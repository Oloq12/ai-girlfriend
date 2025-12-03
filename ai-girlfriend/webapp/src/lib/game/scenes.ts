import type { 
  Scene, 
  SceneMessage, 
  SceneChoice, 
  CharacterStats,
  CharacterId 
} from '@/types';
import { checkStatRequirement } from './stats';

/** Состояние проигрывания сцены */
export interface ScenePlayState {
  scene: Scene;
  currentMessageIndex: number;
  isComplete: boolean;
  selectedChoices: string[];
}

/**
 * Создаёт начальное состояние для проигрывания сцены
 */
export function createScenePlayState(scene: Scene): ScenePlayState {
  return {
    scene,
    currentMessageIndex: 0,
    isComplete: false,
    selectedChoices: [],
  };
}

/**
 * Получает текущее сообщение сцены
 */
export function getCurrentMessage(state: ScenePlayState): SceneMessage | null {
  if (state.isComplete) return null;
  return state.scene.messages[state.currentMessageIndex] ?? null;
}

/**
 * Переходит к следующему сообщению
 */
export function advanceScene(
  state: ScenePlayState,
  choiceId?: string
): ScenePlayState {
  const currentMessage = getCurrentMessage(state);
  if (!currentMessage) {
    return { ...state, isComplete: true };
  }

  let nextIndex = state.currentMessageIndex + 1;
  const newSelectedChoices = [...state.selectedChoices];

  // Если был выбор, записываем его
  if (choiceId) {
    newSelectedChoices.push(choiceId);
    
    // Если у выбора есть конкретный следующий message
    const choice = currentMessage.choices?.find(c => c.id === choiceId);
    if (choice?.nextMessageId) {
      const targetIndex = state.scene.messages.findIndex(
        m => m.id === choice.nextMessageId
      );
      if (targetIndex !== -1) {
        nextIndex = targetIndex;
      }
    }
  }

  const isComplete = nextIndex >= state.scene.messages.length;

  return {
    ...state,
    currentMessageIndex: nextIndex,
    isComplete,
    selectedChoices: newSelectedChoices,
  };
}

/**
 * Фильтрует доступные выборы на основе статов
 */
export function getAvailableChoices(
  choices: SceneChoice[],
  stats: CharacterStats
): Array<SceneChoice & { isLocked: boolean }> {
  return choices.map(choice => ({
    ...choice,
    isLocked: choice.requiredStats 
      ? !checkStatRequirement(stats, choice.requiredStats)
      : false,
  }));
}

/**
 * Проверяет, разблокирована ли сцена
 */
export function isSceneUnlocked(
  scene: Scene,
  stats: CharacterStats,
  completedScenes: string[]
): boolean {
  // Проверяем требования статов
  if (scene.requiredStats && !checkStatRequirement(stats, scene.requiredStats)) {
    return false;
  }

  // Проверяем кастомное условие
  if (scene.unlockCondition && !scene.unlockCondition()) {
    return false;
  }

  return true;
}

/**
 * Создаёт сцену
 */
export function createScene(
  id: string,
  characterId: CharacterId,
  title: string,
  messages: SceneMessage[],
  options?: {
    requiredStats?: Partial<Omit<CharacterStats, 'mood'>>;
    unlockCondition?: () => boolean;
  }
): Scene {
  return {
    id,
    characterId,
    title,
    messages,
    requiredStats: options?.requiredStats,
    unlockCondition: options?.unlockCondition,
  };
}

/**
 * Создаёт сообщение сцены
 */
export function createSceneMessage(
  id: string,
  text: string,
  sender: 'bot' | 'narrator',
  options?: {
    delay?: number;
    choices?: SceneChoice[];
  }
): SceneMessage {
  return {
    id,
    text,
    sender,
    delay: options?.delay,
    choices: options?.choices,
  };
}

