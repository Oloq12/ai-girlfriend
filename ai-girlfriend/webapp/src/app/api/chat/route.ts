/**
 * API Route: POST /api/chat
 * Обрабатывает сообщения чата и генерирует ответы персонажа
 */

import type { PlayerStats } from '@/lib/stateEngine';
import {
  getInitialScene,
  getSceneById,
  type Scene,
  type SceneChoice,
} from '@/lib/storyEngine';

// ============================================================================
// Types
// ============================================================================

/**
 * Тело запроса
 */
interface ChatRequest {
  /** Сообщение пользователя */
  message: string;
  /** ID текущей сцены (опционально) */
  sceneId?: string;
  /** Текущие статы (опционально) */
  stats?: Partial<PlayerStats>;
  /** ID персонажа */
  characterId: string;
}

/**
 * Тело ответа
 */
interface ChatResponse {
  reply: string;
  choices?: SceneChoice[];
  statChanges?: Partial<PlayerStats>;
}

// ============================================================================
// LLM Integration (Stub)
// ============================================================================

/**
 * Вызывает LLM для генерации ответа
 * 
 * ЗАГЛУШКА: возвращает данные из текущей сцены
 * TODO: Подключить DeepSeek/OpenAI
 * 
 * @param currentScene - текущая сцена
 * @returns объект с reply, choices, statChanges
 */
async function callLLM(currentScene: Scene): Promise<ChatResponse> {
  // Симуляция задержки API
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    reply: currentScene.text,
    choices: currentScene.choices,
    statChanges: {},
  };
}

// ============================================================================
// Request Processing
// ============================================================================

/**
 * Валидирует тело запроса
 */
function validateRequest(body: unknown): ChatRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const req = body as Record<string, unknown>;

  if (typeof req.message !== 'string') {
    return null;
  }

  if (typeof req.characterId !== 'string' || !req.characterId.trim()) {
    return null;
  }

  return {
    message: req.message,
    sceneId: typeof req.sceneId === 'string' ? req.sceneId : undefined,
    stats: typeof req.stats === 'object' ? (req.stats as Partial<PlayerStats>) : undefined,
    characterId: req.characterId.trim(),
  };
}

/**
 * Обрабатывает запрос чата
 */
async function processChat(request: ChatRequest): Promise<ChatResponse> {
  const { characterId, sceneId } = request;

  // Получаем текущую сцену
  let currentScene: Scene | undefined;

  if (sceneId) {
    currentScene = getSceneById(characterId, sceneId);
  }

  if (!currentScene) {
    currentScene = getInitialScene(characterId);
  }

  if (!currentScene) {
    return {
      reply: 'Сцена не найдена. Попробуйте начать заново.',
      choices: [],
      statChanges: {},
    };
  }

  // Вызываем LLM (заглушка)
  const response = await callLLM(currentScene);

  return response;
}

// ============================================================================
// Route Handler
// ============================================================================

/**
 * POST /api/chat
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();

    const validatedRequest = validateRequest(body);
    if (!validatedRequest) {
      return Response.json(
        { error: 'Invalid request. Required: characterId' },
        { status: 400 }
      );
    }

    const response = await processChat(validatedRequest);

    return Response.json(response);
  } catch (error) {
    console.error('[/api/chat] Error:', error);

    const message = error instanceof Error ? error.message : 'Internal server error';

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/chat (CORS)
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
