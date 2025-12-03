import type { ChatRequest, ChatResponse, CharacterId } from '@/types';

export const API_URL = 'http://localhost:4000/api';

/**
 * Отправляет сообщение персонажу через API
 */
export async function sendMessage(
  characterId: CharacterId,
  message: string,
  context?: ChatRequest['context']
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      characterId,
      message,
      context,
    } satisfies ChatRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || 'Ошибка сервера',
      response.status
    );
  }

  return response.json();
}

/**
 * Кастомный класс ошибки API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

