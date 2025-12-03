/**
 * StoryEngine — движок сюжетных сцен и эпизодов
 * Управляет прогрессией сюжета, навигацией по сценам
 */

import type { PlayerStats } from './stateEngine';

// Import scene data
// @ts-expect-error JSON import
import kuudereEp1Data from '../data/scenes/kuudere_ep1.json';

// ============================================================================
// Types
// ============================================================================

/**
 * Выбор в сцене
 */
export interface SceneChoice {
  id: string;
  text: string;
  next?: string;
  statChanges?: Partial<PlayerStats>;
}

/**
 * Сцена
 */
export interface Scene {
  sceneId: string;
  emotion: string;
  text: string;
  choices: SceneChoice[];
}

/**
 * Данные эпизода (как в JSON)
 */
export interface EpisodeData {
  episodeId: string;
  characterId: string;
  title: string;
  description: string;
  scenes: Scene[];
  rewards?: {
    coins?: number;
    gems?: number;
    unlockedEpisodes?: string[];
  };
  metadata?: {
    estimatedDuration?: string;
    themes?: string[];
    triggerWarnings?: string[];
  };
}

/**
 * Результат перехода к следующей сцене
 */
export interface NextSceneResult {
  nextScene: Scene | null;
  statChanges?: Partial<PlayerStats>;
  isEpisodeEnd: boolean;
}

/**
 * Прогресс в истории
 */
export interface StoryProgress {
  characterId: string;
  currentEpisodeId: string | null;
  currentSceneId: string | null;
  completedEpisodes: string[];
  completedScenes: string[];
}

// ============================================================================
// Scene Data Registry
// ============================================================================

/**
 * Реестр эпизодов по персонажам
 */
const EPISODE_REGISTRY: Record<string, EpisodeData[]> = {
  kuudere: [kuudereEp1Data as EpisodeData],
  alisa: [kuudereEp1Data as EpisodeData],
};

/**
 * Получает все эпизоды для персонажа
 */
function getEpisodesForCharacter(characterId: string): EpisodeData[] {
  // Нормализуем ID
  const normalizedId = characterId.toLowerCase();
  
  // Проверяем прямое совпадение
  if (EPISODE_REGISTRY[normalizedId]) {
    return EPISODE_REGISTRY[normalizedId];
  }
  
  // Маппинг персонажей на архетипы
  const characterToArchetype: Record<string, string> = {
    alisa: 'kuudere',
    maria: 'tsundere',
    sofia: 'dandere',
    katya: 'tomboy',
    lera: 'tomboy',
  };
  
  const archetype = characterToArchetype[normalizedId];
  if (archetype && EPISODE_REGISTRY[archetype]) {
    return EPISODE_REGISTRY[archetype];
  }
  
  return [];
}

/**
 * Получает все сцены для персонажа (из всех эпизодов)
 */
function getAllScenesForCharacter(characterId: string): Scene[] {
  const episodes = getEpisodesForCharacter(characterId);
  return episodes.flatMap(ep => ep.scenes);
}

// ============================================================================
// Main Functions
// ============================================================================

/**
 * Возвращает стартовую сцену для персонажа
 * 
 * @param characterId - ID персонажа (например, 'kuudere', 'alisa')
 * @returns первая сцена первого эпизода или undefined
 */
export function getInitialScene(characterId: string): Scene | undefined {
  const episodes = getEpisodesForCharacter(characterId);
  
  if (episodes.length === 0) {
    console.warn(`[StoryEngine] No episodes found for character: ${characterId}`);
    return undefined;
  }
  
  const firstEpisode = episodes[0];
  
  if (!firstEpisode.scenes || firstEpisode.scenes.length === 0) {
    console.warn(`[StoryEngine] No scenes in episode: ${firstEpisode.episodeId}`);
    return undefined;
  }
  
  return firstEpisode.scenes[0];
}

/**
 * Находит сцену по ID
 * 
 * @param characterId - ID персонажа
 * @param sceneId - ID сцены
 * @returns сцена или undefined
 */
export function getSceneById(characterId: string, sceneId: string): Scene | undefined {
  const scenes = getAllScenesForCharacter(characterId);
  return scenes.find(scene => scene.sceneId === sceneId);
}

/**
 * Возвращает следующую сцену по выбору игрока
 * 
 * @param characterId - ID персонажа
 * @param currentScene - текущая сцена
 * @param choiceId - ID выбранного варианта
 * @returns объект с nextScene, statChanges и флагом конца эпизода
 */
export function getNextScene(
  characterId: string,
  currentScene: Scene,
  choiceId: string
): NextSceneResult {
  // Находим выбранный вариант
  const choice = currentScene.choices.find(c => c.id === choiceId);
  
  if (!choice) {
    console.warn(`[StoryEngine] Choice not found: ${choiceId} in scene: ${currentScene.sceneId}`);
    return {
      nextScene: null,
      statChanges: undefined,
      isEpisodeEnd: true,
    };
  }
  
  // Если нет next — это конец эпизода
  if (!choice.next) {
    return {
      nextScene: null,
      statChanges: choice.statChanges,
      isEpisodeEnd: true,
    };
  }
  
  // Ищем следующую сцену
  const nextScene = getSceneById(characterId, choice.next);
  
  if (!nextScene) {
    console.warn(`[StoryEngine] Next scene not found: ${choice.next}`);
    return {
      nextScene: null,
      statChanges: choice.statChanges,
      isEpisodeEnd: true,
    };
  }
  
  return {
    nextScene,
    statChanges: choice.statChanges,
    isEpisodeEnd: false,
  };
}

// ============================================================================
// Additional Utilities
// ============================================================================

/**
 * Получает эпизод по ID
 */
export function getEpisodeById(characterId: string, episodeId: string): EpisodeData | undefined {
  const episodes = getEpisodesForCharacter(characterId);
  return episodes.find(ep => ep.episodeId === episodeId);
}

/**
 * Получает первый эпизод для персонажа
 */
export function getInitialEpisode(characterId: string): EpisodeData | undefined {
  const episodes = getEpisodesForCharacter(characterId);
  return episodes[0];
}

/**
 * Проверяет, является ли сцена финальной в эпизоде
 */
export function isEpisodeEndScene(scene: Scene): boolean {
  return scene.choices.length === 0 || scene.choices.every(c => !c.next);
}

/**
 * Получает все доступные ID сцен для персонажа
 */
export function getAvailableSceneIds(characterId: string): string[] {
  const scenes = getAllScenesForCharacter(characterId);
  return scenes.map(s => s.sceneId);
}

/**
 * Создаёт начальный прогресс для персонажа
 */
export function createStoryProgress(characterId: string): StoryProgress {
  const initialEpisode = getInitialEpisode(characterId);
  const initialScene = getInitialScene(characterId);
  
  return {
    characterId,
    currentEpisodeId: initialEpisode?.episodeId ?? null,
    currentSceneId: initialScene?.sceneId ?? null,
    completedEpisodes: [],
    completedScenes: [],
  };
}

/**
 * Обновляет прогресс после завершения сцены
 */
export function advanceStoryProgress(
  progress: StoryProgress,
  completedSceneId: string,
  nextSceneId: string | null
): StoryProgress {
  const newCompletedScenes = progress.completedScenes.includes(completedSceneId)
    ? progress.completedScenes
    : [...progress.completedScenes, completedSceneId];

  return {
    ...progress,
    currentSceneId: nextSceneId,
    completedScenes: newCompletedScenes,
  };
}

/**
 * Отмечает эпизод как завершённый
 */
export function completeEpisode(
  progress: StoryProgress,
  episodeId: string
): StoryProgress {
  if (progress.completedEpisodes.includes(episodeId)) {
    return progress;
  }

  return {
    ...progress,
    completedEpisodes: [...progress.completedEpisodes, episodeId],
    currentEpisodeId: null,
    currentSceneId: null,
  };
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  // Main functions
  getInitialScene,
  getSceneById,
  getNextScene,
  // Episode functions
  getEpisodeById,
  getInitialEpisode,
  // Utilities
  isEpisodeEndScene,
  getAvailableSceneIds,
  // Progress
  createStoryProgress,
  advanceStoryProgress,
  completeEpisode,
};
