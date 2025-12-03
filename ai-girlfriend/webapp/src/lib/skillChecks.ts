/**
 * SkillChecks — система проверок навыков
 * Механика: roll(1-20) + modifier >= difficulty
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Типы навыков
 */
export type Skill = 'empathy' | 'honesty' | 'courage' | 'charm';

/**
 * Результат проверки навыка
 */
export interface SkillCheckResult {
  /** Успешна ли проверка */
  success: boolean;
  /** Значение броска (1-20) */
  roll: number;
  /** Сложность проверки */
  difficulty: number;
}

/**
 * Расширенный результат с дополнительной информацией
 */
export interface DetailedSkillCheckResult extends SkillCheckResult {
  /** Модификатор от навыка */
  modifier: number;
  /** Итоговое значение (roll + modifier) */
  total: number;
  /** Критический успех (натуральные 20) */
  criticalSuccess: boolean;
  /** Критический провал (натуральные 1) */
  criticalFailure: boolean;
  /** Разница между total и difficulty */
  margin: number;
}

/**
 * Конфигурация проверки навыка
 */
export interface SkillCheckConfig {
  skill: Skill;
  difficulty: number;
  description?: string;
  successText?: string;
  failureText?: string;
}

// ============================================================================
// Constants
// ============================================================================

/** Минимальное значение броска */
export const ROLL_MIN = 1;

/** Максимальное значение броска */
export const ROLL_MAX = 20;

/** Пороги сложности */
export const DIFFICULTY_THRESHOLDS = {
  trivial: 5,
  easy: 10,
  medium: 15,
  hard: 20,
  legendary: 25,
} as const;

/** Названия сложности на русском */
export const DIFFICULTY_NAMES: Record<string, string> = {
  trivial: 'Тривиально',
  easy: 'Легко',
  medium: 'Средне',
  hard: 'Сложно',
  legendary: 'Легендарно',
};

/** Названия навыков на русском */
export const SKILL_NAMES: Record<Skill, string> = {
  empathy: 'Эмпатия',
  honesty: 'Честность',
  courage: 'Смелость',
  charm: 'Обаяние',
};

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Выполняет проверку навыка
 * 
 * Механика:
 * - roll = случайное число 1–20
 * - modifier = Math.floor(skillValue / 10)
 * - success = roll + modifier >= difficulty
 * 
 * @param skillValue - значение навыка (0-100)
 * @param difficulty - сложность проверки
 * @returns результат проверки
 */
export function performSkillCheck(
  skillValue: number,
  difficulty: number
): SkillCheckResult {
  const roll = rollDice();
  const modifier = Math.floor(skillValue / 10);
  const total = roll + modifier;
  const success = total >= difficulty;

  return {
    success,
    roll,
    difficulty,
  };
}

/**
 * Выполняет проверку навыка с детальным результатом
 * 
 * @param skillValue - значение навыка (0-100)
 * @param difficulty - сложность проверки
 * @returns детальный результат проверки
 */
export function performDetailedSkillCheck(
  skillValue: number,
  difficulty: number
): DetailedSkillCheckResult {
  const roll = rollDice();
  const modifier = Math.floor(skillValue / 10);
  const total = roll + modifier;
  
  const criticalSuccess = roll === ROLL_MAX;
  const criticalFailure = roll === ROLL_MIN;
  
  // Критический успех всегда успешен, критический провал всегда провален
  const success = criticalSuccess || (!criticalFailure && total >= difficulty);

  return {
    success,
    roll,
    difficulty,
    modifier,
    total,
    criticalSuccess,
    criticalFailure,
    margin: total - difficulty,
  };
}

/**
 * Бросает кубик d20 (1-20)
 */
export function rollDice(): number {
  return Math.floor(Math.random() * ROLL_MAX) + ROLL_MIN;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Вычисляет шанс успеха в процентах
 * 
 * @param skillValue - значение навыка (0-100)
 * @param difficulty - сложность проверки
 * @returns шанс успеха (0-100%)
 */
export function getSuccessChance(skillValue: number, difficulty: number): number {
  const modifier = Math.floor(skillValue / 10);
  
  // Минимальный бросок для успеха
  const minRollNeeded = difficulty - modifier;
  
  // Количество успешных исходов (из 20 возможных: 1-20)
  const successfulOutcomes = Math.max(0, Math.min(20, ROLL_MAX - minRollNeeded + 1));
  
  // Базовый шанс
  let chance = (successfulOutcomes / ROLL_MAX) * 100;
  
  // Всегда есть минимум 5% (крит) и максимум 95% (крит провал)
  chance = Math.max(5, Math.min(95, chance));
  
  return Math.round(chance);
}

/**
 * Получает название сложности по значению
 */
export function getDifficultyName(difficulty: number): string {
  if (difficulty <= DIFFICULTY_THRESHOLDS.trivial) return DIFFICULTY_NAMES.trivial;
  if (difficulty <= DIFFICULTY_THRESHOLDS.easy) return DIFFICULTY_NAMES.easy;
  if (difficulty <= DIFFICULTY_THRESHOLDS.medium) return DIFFICULTY_NAMES.medium;
  if (difficulty <= DIFFICULTY_THRESHOLDS.hard) return DIFFICULTY_NAMES.hard;
  return DIFFICULTY_NAMES.legendary;
}

/**
 * Получает цвет для отображения сложности
 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= DIFFICULTY_THRESHOLDS.trivial) return '#9ca3af'; // gray
  if (difficulty <= DIFFICULTY_THRESHOLDS.easy) return '#22c55e';    // green
  if (difficulty <= DIFFICULTY_THRESHOLDS.medium) return '#eab308';  // yellow
  if (difficulty <= DIFFICULTY_THRESHOLDS.hard) return '#f97316';    // orange
  return '#ef4444'; // red
}

/**
 * Форматирует шанс успеха с описанием
 */
export function formatSuccessChance(skillValue: number, difficulty: number): string {
  const chance = getSuccessChance(skillValue, difficulty);
  
  if (chance >= 90) return `${chance}% — Почти наверняка`;
  if (chance >= 70) return `${chance}% — Хороший шанс`;
  if (chance >= 50) return `${chance}% — Равные шансы`;
  if (chance >= 30) return `${chance}% — Рискованно`;
  if (chance >= 10) return `${chance}% — Маловероятно`;
  return `${chance}% — Почти невозможно`;
}

/**
 * Форматирует результат проверки для отображения
 */
export function formatSkillCheckResult(result: DetailedSkillCheckResult): string {
  const rollText = `🎲 ${result.roll}`;
  const modText = result.modifier > 0 ? ` + ${result.modifier}` : '';
  const totalText = ` = ${result.total}`;
  const vsText = ` vs ${result.difficulty}`;
  
  let statusText: string;
  if (result.criticalSuccess) {
    statusText = '🎯 Критический успех!';
  } else if (result.criticalFailure) {
    statusText = '💥 Критический провал!';
  } else if (result.success) {
    statusText = '✅ Успех!';
  } else {
    statusText = '❌ Провал';
  }
  
  return `${rollText}${modText}${totalText}${vsText} — ${statusText}`;
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  // Core
  performSkillCheck,
  performDetailedSkillCheck,
  rollDice,
  // Utilities
  getSuccessChance,
  getDifficultyName,
  getDifficultyColor,
  formatSuccessChance,
  formatSkillCheckResult,
  // Constants
  ROLL_MIN,
  ROLL_MAX,
  DIFFICULTY_THRESHOLDS,
  DIFFICULTY_NAMES,
  SKILL_NAMES,
};
