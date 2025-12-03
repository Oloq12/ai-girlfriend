import { useState, useCallback } from 'react';
import type { CharacterId, ChatMessage } from '@/types';
import { sendMessage, ApiError } from '@/lib/api/chatApi';
import { useGameStore } from '@/lib/store';

interface UseChatOptions {
  characterId: CharacterId;
  onMessageSent?: (message: ChatMessage) => void;
  onReplyReceived?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendUserMessage: (text: string) => Promise<void>;
  clearChat: () => void;
}

/**
 * Hook для управления чатом с персонажем
 */
export function useChat({
  characterId,
  onMessageSent,
  onReplyReceived,
  onError,
}: UseChatOptions): UseChatReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    chatHistories,
    characterStats,
    addMessage,
    clearMessages,
    updateCharacterStats,
  } = useGameStore();

  const messages = chatHistories[characterId] ?? [];
  const stats = characterStats[characterId];

  const sendUserMessage = useCallback(
    async (text: string) => {
      const trimmedText = text.trim();
      if (!trimmedText || isLoading) return;

      setError(null);
      setIsLoading(true);

      // Создаём сообщение пользователя
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        from: 'user',
        text: trimmedText,
        type: 'text',
        timestamp: Date.now(),
      };

      // Добавляем сообщение пользователя
      addMessage(characterId, userMessage);
      onMessageSent?.(userMessage);

      try {
        // Отправляем на сервер
        const response = await sendMessage(characterId, trimmedText, {
          stats: stats
            ? {
                affection: stats.affection,
                trust: stats.trust,
                chemistry: stats.chemistry,
              }
            : undefined,
        });

        // Создаём сообщение бота
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          from: 'bot',
          text: response.reply,
          type: 'text',
          timestamp: Date.now(),
        };

        // Добавляем ответ бота
        addMessage(characterId, botMessage);
        onReplyReceived?.(botMessage);

        // Обновляем статы, если есть изменения
        if (response.statChanges) {
          updateCharacterStats(characterId, response.statChanges);
        }
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Ошибка сети, попробуй ещё раз позже';

        setError(errorMessage);

        // Добавляем сообщение об ошибке
        const errorBotMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          from: 'bot',
          text: `У меня небольшие проблемы 🥺 ${errorMessage}`,
          type: 'system',
          timestamp: Date.now(),
        };

        addMessage(characterId, errorBotMessage);
        onError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    },
    [
      characterId,
      isLoading,
      stats,
      addMessage,
      updateCharacterStats,
      onMessageSent,
      onReplyReceived,
      onError,
    ]
  );

  const clearChat = useCallback(() => {
    clearMessages(characterId);
  }, [characterId, clearMessages]);

  return {
    messages,
    isLoading,
    error,
    sendUserMessage,
    clearChat,
  };
}

