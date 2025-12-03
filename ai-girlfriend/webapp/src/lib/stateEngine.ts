/**
 * StateEngine — движок управления игровым состоянием
 * Централизованное управление статами, флагами и прогрессом
 */

import type { CharacterStats, CharacterId } from '@/types';

// ============================================================================
// Constants
// ============================================================================

/** Минимальное значение стата */
export const STAT_MIN = 0;

/** Максимальное значение стата */
export const STAT_MAX = 100;

/** Начальные значения статов */
export const INITIAL_STATS = {
  affection: 10,
  trust: 10,
  passion: 10,
  jealousy: 5,
  vulnerability: 10,
} as const;

// ============================================================================
// Player Stats
// ============================================================================

/**
 * Статы игрока/отношений с персонажем
 */
export interface PlayerStats {
  /** Привязанность (0-100) */
  affection: number;
  /** Доверие (0-100) */
  trust: number;
  /** Страсть (0-100) */
  passion: number;
  /** Ревность (0-100) */
  jealousy: number;
  /** Уязвимость (0-100) */
  vulnerability: number;
}

/**
 * Дельта для изменения статов (может быть отрицательной)
 */
export type StatsDelta = Partial<PlayerStats>;

/**
 * Возвращает начальные статы для нового игрока/персонажа
 */
export function getInitialStats(): PlayerStats {
  return {
    affection: INITIAL_STATS.affection,
    trust: INITIAL_STATS.trust,
    passion: INITIAL_STATS.passion,
    jealousy: INITIAL_STATS.jealousy,
    vulnerability: INITIAL_STATS.vulnerability,
  };
}

/**
 * Применяет изменения к статам
 * @param current - текущие статы
 * @param delta - изменения (положительные или отрицательные)
 * @returns новые статы с применёнными изменениями (уже clamped)
 */
export function applyStatChanges(current: PlayerStats, delta: StatsDelta): PlayerStats {
  const newStats: PlayerStats = {
    affection: current.affection + (delta.affection ?? 0),
    trust: current.trust + (delta.trust ?? 0),
    passion: current.passion + (delta.passion ?? 0),
    jealousy: current.jealousy + (delta.jealousy ?? 0),
    vulnerability: current.vulnerability + (delta.vulnerability ?? 0),
  };

  return clampedStats(newStats);
}

/**
 * Ограничивает статы в диапазоне 0-100
 * @param stats - статы для ограничения
 * @returns статы с значениями в допустимом диапазоне
 */
export function clampedStats(stats: PlayerStats): PlayerStats {
  return {
    affection: clampValue(stats.affection),
    trust: clampValue(stats.trust),
    passion: clampValue(stats.passion),
    jealousy: clampValue(stats.jealousy),
    vulnerability: clampValue(stats.vulnerability),
  };
}

/**
 * Ограничивает одно значение в диапазоне STAT_MIN - STAT_MAX
 */
function clampValue(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, Math.round(value)));
}

/**
 * Сериализует статы в строку для хранения/передачи
 * @param stats - статы для сериализации
 * @returns JSON-строка
 */
export function serializeStats(stats: PlayerStats): string {
  return JSON.stringify({
    affection: stats.affection,
    trust: stats.trust,
    passion: stats.passion,
    jealousy: stats.jealousy,
    vulnerability: stats.vulnerability,
  });
}

/**
 * Десериализует статы из строки
 * @param data - JSON-строка со статами
 * @returns PlayerStats или null при ошибке
 */
export function deserializeStats(data: string): PlayerStats | null {
  try {
    const parsed = JSON.parse(data);
    
    if (
      typeof parsed.affection !== 'number' ||
      typeof parsed.trust !== 'number' ||
      typeof parsed.passion !== 'number' ||
      typeof parsed.jealousy !== 'number' ||
      typeof parsed.vulnerability !== 'number'
    ) {
      return null;
    }

    return clampedStats({
      affection: parsed.affection,
      trust: parsed.trust,
      passion: parsed.passion,
      jealousy: parsed.jealousy,
      vulnerability: parsed.vulnerability,
    });
  } catch {
    return null;
  }
}

/**
 * Вычисляет средний уровень отношений
 */
export function getAverageStats(stats: PlayerStats): number {
  return Math.round((stats.affection + stats.trust + stats.passion) / 3);
}

/**
 * Проверяет, достигнут ли порог стата
 */
export function meetsStatRequirement(
  stats: PlayerStats,
  stat: keyof PlayerStats,
  minValue: number
): boolean {
  return stats[stat] >= minValue;
}

/**
 * Проверяет все требования статов
 */
export function meetsAllStatRequirements(
  stats: PlayerStats,
  requirements: Partial<PlayerStats>
): boolean {
  for (const [stat, minValue] of Object.entries(requirements)) {
    if (minValue !== undefined && stats[stat as keyof PlayerStats] < minValue) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// Game Flags
// ============================================================================

export interface GameFlags {
  [key: string]: boolean | number | string;
}

export interface StateSnapshot {
  characterId: CharacterId;
  stats: CharacterStats;
  flags: GameFlags;
  timestamp: number;
}

/**
 * Проверяет условие на основе текущего состояния
 */
export function checkCondition(
  stats: CharacterStats,
  flags: GameFlags,
  condition: StateCondition
): boolean {
  switch (condition.type) {
    case 'stat_gte':
      return stats[condition.stat as keyof CharacterStats] >= condition.value;
    case 'stat_lte':
      return stats[condition.stat as keyof CharacterStats] <= condition.value;
    case 'flag_equals':
      return flags[condition.flag] === condition.value;
    case 'flag_exists':
      return condition.flag in flags;
    default:
      return true;
  }
}

export interface StateCondition {
  type: 'stat_gte' | 'stat_lte' | 'flag_equals' | 'flag_exists';
  stat?: string;
  flag?: string;
  value?: number | string | boolean;
}

/**
 * Применяет эффекты к состоянию
 */
export function applyEffects(
  stats: CharacterStats,
  flags: GameFlags,
  effects: StateEffects
): { stats: CharacterStats; flags: GameFlags } {
  const newStats = { ...stats };
  const newFlags = { ...flags };

  // Применяем изменения статов
  if (effects.statChanges) {
    for (const [key, value] of Object.entries(effects.statChanges)) {
      if (key in newStats && typeof value === 'number') {
        (newStats as any)[key] = Math.max(0, Math.min(100, (newStats as any)[key] + value));
      }
    }
  }

  // Применяем изменения флагов
  if (effects.flagChanges) {
    for (const [key, value] of Object.entries(effects.flagChanges)) {
      newFlags[key] = value;
    }
  }

  return { stats: newStats, flags: newFlags };
}

export interface StateEffects {
  statChanges?: Partial<Record<keyof CharacterStats, number>>;
  flagChanges?: GameFlags;
}

/**
 * Создаёт снимок состояния
 */
export function createSnapshot(
  characterId: CharacterId,
  stats: CharacterStats,
  flags: GameFlags
): StateSnapshot {
  return {
    characterId,
    stats: { ...stats },
    flags: { ...flags },
    timestamp: Date.now(),
  };
}

export default {
  // Player Stats
  getInitialStats,
  applyStatChanges,
  clampedStats,
  serializeStats,
  deserializeStats,
  getAverageStats,
  meetsStatRequirement,
  meetsAllStatRequirements,
  // Game State
  checkCondition,
  applyEffects,
  createSnapshot,
  // Constants
  STAT_MIN,
  STAT_MAX,
  INITIAL_STATS,
};

