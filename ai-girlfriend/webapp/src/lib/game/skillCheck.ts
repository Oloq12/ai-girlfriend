import type { 
  CharacterStats, 
  SkillCheck, 
  SkillCheckDifficulty,
  DIFFICULTY_THRESHOLDS 
} from '@/types';

/** Пороги сложности */
const THRESHOLDS: Record<SkillCheckDifficulty, number> = {
  easy: 20,
  medium: 40,
  hard: 60,
  legendary: 80,
};

/** Результат skill-check */
export interface SkillCheckResult {
  success: boolean;
  roll: number;
  statValue: number;
  threshold: number;
  margin: number; // Насколько превысили/недобрали порог
  criticalSuccess: boolean;
  criticalFailure: boolean;
}

/**
 * Выполняет skill-check
 * Механика: statValue + random(0-20) >= threshold
 */
export function performSkillCheck(
  stats: CharacterStats,
  check: SkillCheck
): SkillCheckResult {
  const statValue = stats[check.stat];
  const threshold = THRESHOLDS[check.difficulty];
  
  // Бросок кубика (0-20)
  const roll = Math.floor(Math.random() * 21);
  
  // Итоговое значение
  const totalValue = statValue + roll;
  
  // Критический успех: натуральные 19-20 на кубике
  const criticalSuccess = roll >= 19;
  
  // Критический провал: натуральные 0-1 на кубике
  const criticalFailure = roll <= 1;
  
  // Успех, если превысили порог или крит
  const success = criticalSuccess || (!criticalFailure && totalValue >= threshold);
  
  return {
    success,
    roll,
    statValue,
    threshold,
    margin: totalValue - threshold,
    criticalSuccess,
    criticalFailure,
  };
}

/**
 * Получает шанс успеха skill-check в процентах
 */
export function getSuccessChance(
  stats: CharacterStats,
  check: SkillCheck
): number {
  const statValue = stats[check.stat];
  const threshold = THRESHOLDS[check.difficulty];
  
  // Сколько значений кубика дадут успех
  // statValue + roll >= threshold
  // roll >= threshold - statValue
  const minRollNeeded = threshold - statValue;
  
  // Количество успешных исходов (из 21: 0-20)
  const successfulOutcomes = Math.max(0, Math.min(21, 21 - minRollNeeded));
  
  // Базовый шанс
  let chance = (successfulOutcomes / 21) * 100;
  
  // Учитываем криты: +10% от критов успеха, -10% от критов провала
  // (примерно, для простоты)
  chance = Math.max(5, Math.min(95, chance)); // Всегда есть шанс 5-95%
  
  return Math.round(chance);
}

/**
 * Получает название сложности на русском
 */
export function getDifficultyName(difficulty: SkillCheckDifficulty): string {
  const names: Record<SkillCheckDifficulty, string> = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
    legendary: 'Легендарно',
  };
  return names[difficulty];
}

/**
 * Получает цвет сложности
 */
export function getDifficultyColor(difficulty: SkillCheckDifficulty): string {
  const colors: Record<SkillCheckDifficulty, string> = {
    easy: '#22c55e',    // green
    medium: '#eab308',  // yellow
    hard: '#f97316',    // orange
    legendary: '#ef4444', // red
  };
  return colors[difficulty];
}

/**
 * Создаёт skill-check
 */
export function createSkillCheck(
  id: string,
  stat: keyof Omit<CharacterStats, 'mood'>,
  difficulty: SkillCheckDifficulty,
  description: string,
  successText: string,
  failureText: string,
  effects?: {
    success?: Partial<Omit<CharacterStats, 'mood'>>;
    failure?: Partial<Omit<CharacterStats, 'mood'>>;
  }
): SkillCheck {
  return {
    id,
    stat,
    difficulty,
    description,
    successText,
    failureText,
    successEffects: effects?.success,
    failureEffects: effects?.failure,
  };
}

