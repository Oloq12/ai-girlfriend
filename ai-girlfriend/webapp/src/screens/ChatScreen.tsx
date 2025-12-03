import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatHeader, ChatBubble, ChatInput, TypingIndicator } from '@/components/chat';
import { useCharacter, useChat } from '@/hooks';
import { useGameStore } from '@/lib/store';
import type { CharacterId, ChatMessage } from '@/types';

export const ChatScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { character, stats, isLoaded } = useCharacter(id ?? '');
  const { addMessage, initCharacterStats } = useGameStore();

  const {
    messages,
    isLoading,
    sendUserMessage,
  } = useChat({
    characterId: id as CharacterId,
  });

  // Добавляем intro message при первом входе
  useEffect(() => {
    if (!character || !id) return;

    // Инициализируем статы если нужно
    initCharacterStats(id as CharacterId);

    // Если нет сообщений, добавляем intro
    if (messages.length === 0) {
      const introMessage: ChatMessage = {
        id: `intro-${Date.now()}`,
        from: 'bot',
        text: character.introMessage,
        type: 'text',
        timestamp: Date.now(),
      };
      addMessage(id as CharacterId, introMessage);
    }
  }, [character, id, messages.length, addMessage, initCharacterStats]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isLoaded || !character) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        }}
      >
        <p style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}>
          Персонаж не найден
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--tg-theme-bg-color, #f9fafb)',
      }}
    >
      {/* Header */}
      <ChatHeader
        character={character}
        stats={stats}
        onBack={() => navigate(-1)}
        showStats
      />

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator name={character.name} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendUserMessage}
        isLoading={isLoading}
        placeholder={`Напишите ${character.name}...`}
      />
    </div>
  );
};

export default ChatScreen;

