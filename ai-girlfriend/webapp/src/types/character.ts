/** Уникальный идентификатор персонажа */
export type CharacterId = 'alisa' | 'maria' | 'sofia' | 'katya' | 'lera';

/** Базовая информация о персонаже */
export interface Character {
  id: CharacterId;
  name: string;
  emoji: string;
  shortDescription: string;
  fullDescription: string;
  introMessage: string;
}

/** Статы отношений с персонажем */
export interface CharacterStats {
  affection: number;      // Привязанность (0-100)
  trust: number;          // Доверие (0-100)
  chemistry: number;      // Химия/влечение (0-100)
  mood: CharacterMood;    // Текущее настроение
}

/** Настроение персонажа */
export type CharacterMood = 
  | 'happy' 
  | 'neutral' 
  | 'sad' 
  | 'flirty' 
  | 'annoyed' 
  | 'excited';

/** Начальные статы для нового персонажа */
export const DEFAULT_STATS: CharacterStats = {
  affection: 10,
  trust: 10,
  chemistry: 10,
  mood: 'neutral',
};

