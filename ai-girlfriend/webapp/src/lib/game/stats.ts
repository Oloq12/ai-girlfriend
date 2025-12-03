import type { CharacterStats, CharacterId, CharacterMood } from '@/types';

/** Минимальное и максимальное значение статов */
const STAT_MIN = 0;
const STAT_MAX = 100;

/**
 * Нормализует значение стата в допустимых пределах
 */
function clampStat(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(value)));
}

/**
 * Обновляет статы персонажа
 */
export function updateStats(
  currentStats: CharacterStats,
  changes: Partial<Omit<CharacterStats, 'mood'>>
): CharacterStats {
  return {
    ...currentStats,
    affection: clampStat(currentStats.affection + (changes.affection ?? 0)),
    trust: clampStat(currentStats.trust + (changes.trust ?? 0)),
    chemistry: clampStat(currentStats.chemistry + (changes.chemistry ?? 0)),
  };
}

/**
 * Вычисляет настроение персонажа на основе статов и контекста
 */
export function calculateMood(
  stats: CharacterStats,
  recentInteraction?: 'positive' | 'negative' | 'neutral'
): CharacterMood {
  const avgStat = (stats.affection + stats.trust + stats.chemistry) / 3;

  // Если недавнее взаимодействие было негативным
  if (recentInteraction === 'negative') {
    if (stats.trust < 30) return 'annoyed';
    return 'sad';
  }

  // Если недавнее взаимодействие было позитивным
  if (recentInteraction === 'positive') {
    if (stats.chemistry > 50) return 'flirty';
    return 'excited';
  }

  // Базовое настроение на основе статов
  if (avgStat >= 70) return 'happy';
  if (avgStat >= 40) return 'neutral';
  if (avgStat >= 20) return 'sad';
  return 'annoyed';
}

/**
 * Получает модификатор для ответов AI на основе настроения
 */
export function getMoodModifier(mood: CharacterMood): string {
  const modifiers: Record<CharacterMood, string> = {
    happy: 'Ты в отличном настроении, отвечай тепло и радостно.',
    neutral: 'Ты в нейтральном настроении, отвечай спокойно и дружелюбно.',
    sad: 'Ты немного грустишь, отвечай более сдержанно.',
    flirty: 'Ты в игривом настроении, можешь флиртовать и шутить.',
    annoyed: 'Ты слегка раздражена, отвечай короче и суше.',
    excited: 'Ты в восторге, отвечай с энтузиазмом и энергией!',
  };
  return modifiers[mood];
}

/**
 * Проверяет, достаточно ли статов для определённого действия
 */
export function checkStatRequirement(
  stats: CharacterStats,
  required: Partial<Omit<CharacterStats, 'mood'>>
): boolean {
  if (required.affection !== undefined && stats.affection < required.affection) {
    return false;
  }
  if (required.trust !== undefined && stats.trust < required.trust) {
    return false;
  }
  if (required.chemistry !== undefined && stats.chemistry < required.chemistry) {
    return false;
  }
  return true;
}

/**
 * Получает уровень отношений
 */
export function getRelationshipLevel(stats: CharacterStats): {
  level: number;
  name: string;
  nextThreshold: number | null;
} {
  const avgStat = (stats.affection + stats.trust + stats.chemistry) / 3;

  const levels = [
    { threshold: 0, name: 'Незнакомцы' },
    { threshold: 20, name: 'Знакомые' },
    { threshold: 40, name: 'Приятели' },
    { threshold: 60, name: 'Друзья' },
    { threshold: 80, name: 'Близкие друзья' },
    { threshold: 95, name: 'Лучшие друзья' },
  ];

  let currentLevel = 0;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (avgStat >= levels[i].threshold) {
      currentLevel = i;
      break;
    }
  }

  return {
    level: currentLevel,
    name: levels[currentLevel].name,
    nextThreshold: levels[currentLevel + 1]?.threshold ?? null,
  };
}

