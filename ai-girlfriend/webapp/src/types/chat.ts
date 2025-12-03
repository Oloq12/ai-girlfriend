import type { CharacterId } from './character';

/** Отправитель сообщения */
export type MessageSender = 'user' | 'bot';

/** Тип сообщения */
export type MessageType = 
  | 'text'           // Обычный текст
  | 'choice'         // Сообщение с выборами
  | 'skill_check'    // Результат skill-check
  | 'system';        // Системное сообщение

/** Выбор в диалоге */
export interface DialogChoice {
  id: string;
  text: string;
  requiredStat?: {
    stat: 'affection' | 'trust' | 'chemistry';
    minValue: number;
  };
  effects?: {
    affection?: number;
    trust?: number;
    chemistry?: number;
  };
}

/** Сообщение в чате */
export interface ChatMessage {
  id: string;
  from: MessageSender;
  text: string;
  type: MessageType;
  timestamp: number;
  choices?: DialogChoice[];
  isSkillCheckSuccess?: boolean;
}

/** Состояние чата */
export interface ChatState {
  characterId: CharacterId | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

/** Запрос к API чата */
export interface ChatRequest {
  characterId: CharacterId;
  message: string;
  context?: {
    recentMessages?: string[];
    currentMood?: string;
    stats?: {
      affection: number;
      trust: number;
      chemistry: number;
    };
  };
}

/** Ответ от API чата */
export interface ChatResponse {
  reply: string;
  moodChange?: string;
  statChanges?: {
    affection?: number;
    trust?: number;
    chemistry?: number;
  };
}

