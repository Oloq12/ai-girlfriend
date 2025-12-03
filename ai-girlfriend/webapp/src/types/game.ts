import type { CharacterId, CharacterStats } from './character';
import type { ChatMessage } from './chat';

/** Сложность skill-check */
export type SkillCheckDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

/** Конфигурация skill-check */
export interface SkillCheck {
  id: string;
  stat: keyof Omit<CharacterStats, 'mood'>;
  difficulty: SkillCheckDifficulty;
  description: string;
  successText: string;
  failureText: string;
  successEffects?: Partial<Omit<CharacterStats, 'mood'>>;
  failureEffects?: Partial<Omit<CharacterStats, 'mood'>>;
}

/** Пороги сложности для skill-check */
export const DIFFICULTY_THRESHOLDS: Record<SkillCheckDifficulty, number> = {
  easy: 20,
  medium: 40,
  hard: 60,
  legendary: 80,
};

/** Сцена в сюжете */
export interface Scene {
  id: string;
  characterId: CharacterId;
  title: string;
  messages: SceneMessage[];
  requiredStats?: Partial<Omit<CharacterStats, 'mood'>>;
  unlockCondition?: () => boolean;
}

/** Сообщение в сцене */
export interface SceneMessage {
  id: string;
  text: string;
  sender: 'bot' | 'narrator';
  delay?: number;
  choices?: SceneChoice[];
  skillCheck?: SkillCheck;
}

/** Выбор в сцене */
export interface SceneChoice {
  id: string;
  text: string;
  nextMessageId?: string;
  effects?: Partial<Omit<CharacterStats, 'mood'>>;
  requiredStats?: Partial<Omit<CharacterStats, 'mood'>>;
}

/** Состояние игры */
export interface GameState {
  currentCharacterId: CharacterId | null;
  characterStats: Record<CharacterId, CharacterStats>;
  unlockedScenes: string[];
  completedScenes: string[];
  chatHistories: Record<CharacterId, ChatMessage[]>;
  currency: {
    coins: number;
    gems: number;
  };
}

/** Начальное состояние игры */
export const INITIAL_GAME_STATE: GameState = {
  currentCharacterId: null,
  characterStats: {} as Record<CharacterId, CharacterStats>,
  unlockedScenes: [],
  completedScenes: [],
  chatHistories: {} as Record<CharacterId, ChatMessage[]>,
  currency: {
    coins: 100,
    gems: 10,
  },
};

