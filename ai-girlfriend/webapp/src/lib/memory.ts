/**
 * Memory — система памяти для контекста AI
 * Хранит важные факты о пользователе и истории общения
 */

import type { CharacterId } from '@/types';

export interface MemoryFact {
  id: string;
  characterId: CharacterId;
  category: MemoryCategory;
  key: string;
  value: string;
  importance: 'low' | 'medium' | 'high';
  createdAt: number;
  expiresAt?: number;
}

export type MemoryCategory =
  | 'user_info'      // Имя, возраст, интересы пользователя
  | 'preferences'    // Предпочтения (любимая еда, музыка и т.д.)
  | 'events'         // Важные события из диалогов
  | 'emotions'       // Эмоциональные моменты
  | 'promises'       // Обещания персонажа
  | 'shared';        // Общие воспоминания

export interface MemoryStore {
  facts: MemoryFact[];
  lastUpdated: number;
}

/**
 * Создаёт пустое хранилище памяти
 */
export function createMemoryStore(): MemoryStore {
  return {
    facts: [],
    lastUpdated: Date.now(),
  };
}

/**
 * Добавляет факт в память
 */
export function addFact(
  store: MemoryStore,
  fact: Omit<MemoryFact, 'id' | 'createdAt'>
): MemoryStore {
  const newFact: MemoryFact = {
    ...fact,
    id: `fact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };

  return {
    facts: [...store.facts, newFact],
    lastUpdated: Date.now(),
  };
}

/**
 * Получает факты по категории
 */
export function getFactsByCategory(
  store: MemoryStore,
  characterId: CharacterId,
  category: MemoryCategory
): MemoryFact[] {
  return store.facts.filter(
    (f) => f.characterId === characterId && f.category === category
  );
}

/**
 * Получает все факты для персонажа
 */
export function getCharacterMemory(
  store: MemoryStore,
  characterId: CharacterId
): MemoryFact[] {
  const now = Date.now();
  return store.facts.filter(
    (f) =>
      f.characterId === characterId &&
      (!f.expiresAt || f.expiresAt > now)
  );
}

/**
 * Формирует контекст памяти для AI-промпта
 */
export function buildMemoryContext(
  store: MemoryStore,
  characterId: CharacterId,
  maxFacts: number = 10
): string {
  const facts = getCharacterMemory(store, characterId)
    .sort((a, b) => {
      // Сортировка по важности, затем по дате
      const importanceOrder = { high: 0, medium: 1, low: 2 };
      const impDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (impDiff !== 0) return impDiff;
      return b.createdAt - a.createdAt;
    })
    .slice(0, maxFacts);

  if (facts.length === 0) {
    return 'Ты пока ничего не знаешь о собеседнике.';
  }

  const grouped = facts.reduce((acc, fact) => {
    if (!acc[fact.category]) acc[fact.category] = [];
    acc[fact.category].push(fact);
    return acc;
  }, {} as Record<MemoryCategory, MemoryFact[]>);

  const categoryLabels: Record<MemoryCategory, string> = {
    user_info: 'О собеседнике',
    preferences: 'Предпочтения',
    events: 'Важные события',
    emotions: 'Эмоциональные моменты',
    promises: 'Твои обещания',
    shared: 'Общие воспоминания',
  };

  let context = 'Что ты помнишь о собеседнике:\n';

  for (const [category, categoryFacts] of Object.entries(grouped)) {
    context += `\n${categoryLabels[category as MemoryCategory]}:\n`;
    for (const fact of categoryFacts) {
      context += `- ${fact.key}: ${fact.value}\n`;
    }
  }

  return context;
}

/**
 * Удаляет устаревшие факты
 */
export function cleanupExpiredFacts(store: MemoryStore): MemoryStore {
  const now = Date.now();
  return {
    facts: store.facts.filter((f) => !f.expiresAt || f.expiresAt > now),
    lastUpdated: now,
  };
}

export default {
  createMemoryStore,
  addFact,
  getFactsByCategory,
  getCharacterMemory,
  buildMemoryContext,
  cleanupExpiredFacts,
};

