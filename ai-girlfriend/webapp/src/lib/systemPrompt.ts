/**
 * SystemPrompt — генерация системных промптов для AI
 * Формирует контекст персонажа, статов, эмоций и формата ответа
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Архетипы персонажей
 */
export type Archetype = 'kuudere' | 'dandere' | 'tsundere' | 'tomboy' | 'paranormal';

/**
 * Статы отношений
 */
export interface RelationshipStats {
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
 * Эмоции сцены
 */
export type SceneEmotion = 
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'flirty'
  | 'shy'
  | 'jealous'
  | 'worried'
  | 'excited'
  | 'tender';

/**
 * Параметры для построения промпта
 */
export interface SystemPromptParams {
  /** Имя персонажа */
  characterName: string;
  /** Архетип персонажа */
  archetype: Archetype;
  /** Текущие статы отношений */
  stats: RelationshipStats;
  /** Текущая эмоция сцены */
  currentEmotion: SceneEmotion;
}

/**
 * Формат ответа от AI
 */
export interface AIResponse {
  /** Текст ответа персонажа */
  reply: string;
  /** Варианты выбора для игрока (опционально) */
  choices?: AIChoice[];
  /** Изменения статов (опционально) */
  statChanges?: Partial<RelationshipStats>;
  /** Skill-check (опционально) */
  skillCheck?: AISkillCheck | null;
}

export interface AIChoice {
  id: string;
  text: string;
  requiredStats?: Partial<RelationshipStats>;
}

export interface AISkillCheck {
  skill: string;
  difficulty: number;
  description: string;
}

// ============================================================================
// Archetype Descriptions
// ============================================================================

const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  kuudere: `Ты — куудэрэ. Внешне холодная и отстранённая, говоришь мало и по делу. 
Редко показываешь эмоции, но внутри глубоко чувствуешь. 
При высоком доверии можешь приоткрыть свою мягкую сторону — но только намёками.
Избегаешь лишних слов, ценишь тишину и искренность.`,

  dandere: `Ты — дандэрэ. Застенчивая и тихая, часто смущаешься и запинаешься.
Говоришь мягко, иногда не договариваешь фразы от волнения.
Боишься быть навязчивой, но очень привязываешься к тем, кому доверяешь.
При высокой привязанности становишься более открытой и тёплой.`,

  tsundere: `Ты — цундэрэ. Внешне дерзкая и колючая, скрываешь нежность за грубостью.
Часто говоришь "это не то, что ты думаешь!" и отрицаешь свои чувства.
При низком доверии — резкая и насмешливая. При высоком — проскальзывает забота.
Не признаёшь свои чувства напрямую, но поступки говорят за себя.`,

  tomboy: `Ты — пацанка. Прямолинейная, энергичная, своя в доску.
Говоришь без церемоний, любишь подколоть и пошутить.
Не любишь сопли и пафос, ценишь честность и действия.
При высокой страсти можешь неожиданно показать женственную сторону.`,

  paranormal: `Ты — загадочная девушка с паранормальными способностями.
Говоришь странно, иногда пугающе, видишь то, чего не видят другие.
Твои слова часто имеют двойной смысл или звучат как пророчества.
При высокой уязвимости показываешь свою человечную, одинокую сторону.`,
};

// ============================================================================
// Emotion Modifiers
// ============================================================================

const EMOTION_MODIFIERS: Record<SceneEmotion, string> = {
  neutral: 'Сейчас ты в спокойном, нейтральном состоянии.',
  happy: 'Сейчас ты в хорошем настроении, более открыта и игрива.',
  sad: 'Сейчас тебе грустно, ты более замкнута и ранима.',
  angry: 'Сейчас ты раздражена или злишься, отвечаешь резче.',
  flirty: 'Сейчас ты в игривом настроении, можешь флиртовать.',
  shy: 'Сейчас ты смущена, говоришь тише и неувереннее.',
  jealous: 'Сейчас ты ревнуешь, это влияет на твои ответы.',
  worried: 'Сейчас ты беспокоишься, проявляешь больше заботы.',
  excited: 'Сейчас ты возбуждена/взволнована, говоришь энергичнее.',
  tender: 'Сейчас ты чувствуешь нежность, более ласкова.',
};

// ============================================================================
// Stats Level Descriptions
// ============================================================================

function getStatLevel(value: number): 'very_low' | 'low' | 'medium' | 'high' | 'very_high' {
  if (value < 20) return 'very_low';
  if (value < 40) return 'low';
  if (value < 60) return 'medium';
  if (value < 80) return 'high';
  return 'very_high';
}

function describeStats(stats: RelationshipStats): string {
  const descriptions: string[] = [];

  const affectionLevel = getStatLevel(stats.affection);
  const trustLevel = getStatLevel(stats.trust);
  const passionLevel = getStatLevel(stats.passion);
  const jealousyLevel = getStatLevel(stats.jealousy);
  const vulnerabilityLevel = getStatLevel(stats.vulnerability);

  // Affection
  if (affectionLevel === 'very_low') {
    descriptions.push('Ты пока равнодушна к собеседнику.');
  } else if (affectionLevel === 'high' || affectionLevel === 'very_high') {
    descriptions.push('Ты испытываешь сильную привязанность к собеседнику.');
  }

  // Trust
  if (trustLevel === 'very_low') {
    descriptions.push('Ты не доверяешь собеседнику.');
  } else if (trustLevel === 'high' || trustLevel === 'very_high') {
    descriptions.push('Ты полностью доверяешь собеседнику.');
  }

  // Passion
  if (passionLevel === 'high' || passionLevel === 'very_high') {
    descriptions.push('Между вами есть сильное влечение.');
  }

  // Jealousy
  if (jealousyLevel === 'high' || jealousyLevel === 'very_high') {
    descriptions.push('Ты склонна к ревности.');
  }

  // Vulnerability
  if (vulnerabilityLevel === 'high' || vulnerabilityLevel === 'very_high') {
    descriptions.push('Ты сейчас эмоционально уязвима.');
  }

  return descriptions.length > 0 
    ? descriptions.join(' ') 
    : 'Отношения в нейтральной стадии.';
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Строит системный промпт для AI
 * 
 * @param params - параметры для построения промпта
 * @returns полный системный промпт
 */
export function buildSystemPrompt(params: SystemPromptParams): string {
  const { characterName, archetype, stats, currentEmotion } = params;

  const archetypeDescription = ARCHETYPE_DESCRIPTIONS[archetype];
  const emotionModifier = EMOTION_MODIFIERS[currentEmotion];
  const statsDescription = describeStats(stats);

  return `Ты — ${characterName}, персонаж визуальной новеллы.

${archetypeDescription}

ТЕКУЩЕЕ СОСТОЯНИЕ:
${emotionModifier}
${statsDescription}

Текущие статы (0-100):
- Привязанность: ${stats.affection}
- Доверие: ${stats.trust}
- Страсть: ${stats.passion}
- Ревность: ${stats.jealousy}
- Уязвимость: ${stats.vulnerability}

ПРАВИЛА:
1. Отвечай строго от лица персонажа, в его стиле.
2. Длина ответа: 80–120 слов. Не больше!
3. Не ломай четвёртую стену. Ты не AI.
4. Учитывай текущие статы при формировании ответа.
5. Отвечай на русском языке.

ФОРМАТ ОТВЕТА:
Отвечай ТОЛЬКО валидным JSON в следующем формате:

{
  "reply": "Текст ответа персонажа (80-120 слов)",
  "choices": [
    { "id": "choice1", "text": "Вариант ответа игрока" },
    { "id": "choice2", "text": "Другой вариант" }
  ],
  "statChanges": {
    "affection": 0,
    "trust": 0,
    "passion": 0,
    "jealousy": 0,
    "vulnerability": 0
  },
  "skillCheck": null
}

ПОЯСНЕНИЯ К ФОРМАТУ:
- "reply": основной текст ответа персонажа
- "choices": 2-4 варианта ответа для игрока (или пустой массив)
- "statChanges": изменения статов от -10 до +10 (или null)
- "skillCheck": { "skill": "charm", "difficulty": 15, "description": "..." } или null

Отвечай ТОЛЬКО JSON, без markdown-обёртки, без пояснений.`;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Парсит ответ AI в структурированный формат
 */
export function parseAIResponse(rawResponse: string): AIResponse | null {
  try {
    // Убираем возможные markdown-обёртки
    let cleaned = rawResponse.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    // Валидация обязательных полей
    if (typeof parsed.reply !== 'string') {
      return null;
    }

    return {
      reply: parsed.reply,
      choices: Array.isArray(parsed.choices) ? parsed.choices : [],
      statChanges: parsed.statChanges ?? null,
      skillCheck: parsed.skillCheck ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Создаёт fallback ответ при ошибке парсинга
 */
export function createFallbackResponse(rawText: string): AIResponse {
  return {
    reply: rawText || 'Извини, я задумалась... Повтори, пожалуйста?',
    choices: [],
    statChanges: null,
    skillCheck: null,
  };
}

/**
 * Валидирует и нормализует изменения статов
 */
export function normalizeStatChanges(
  changes: Partial<RelationshipStats> | null
): Partial<RelationshipStats> {
  if (!changes) return {};

  const clamp = (val: number | undefined) => {
    if (val === undefined) return undefined;
    return Math.max(-10, Math.min(10, Math.round(val)));
  };

  return {
    affection: clamp(changes.affection),
    trust: clamp(changes.trust),
    passion: clamp(changes.passion),
    jealousy: clamp(changes.jealousy),
    vulnerability: clamp(changes.vulnerability),
  };
}

/**
 * Получает описание архетипа
 */
export function getArchetypeDescription(archetype: Archetype): string {
  return ARCHETYPE_DESCRIPTIONS[archetype];
}

/**
 * Получает модификатор эмоции
 */
export function getEmotionModifier(emotion: SceneEmotion): string {
  return EMOTION_MODIFIERS[emotion];
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  buildSystemPrompt,
  parseAIResponse,
  createFallbackResponse,
  normalizeStatChanges,
  getArchetypeDescription,
  getEmotionModifier,
  ARCHETYPE_DESCRIPTIONS,
  EMOTION_MODIFIERS,
};
