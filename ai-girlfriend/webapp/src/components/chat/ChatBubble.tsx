import React from 'react';
import type { ChatMessage } from '@/types';

export interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.from === 'user';
  const isSystem = message.type === 'system';

  return (
    <div
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      <div
        style={{
          backgroundColor: isSystem
            ? 'var(--tg-theme-hint-color, #9ca3af)'
            : isUser
              ? 'var(--tg-theme-button-color, #3b82f6)'
              : 'var(--tg-theme-secondary-bg-color, #e5e7eb)',
          color: isUser
            ? 'var(--tg-theme-button-text-color, #ffffff)'
            : 'var(--tg-theme-text-color, #111827)',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          padding: '10px 14px',
          fontSize: '15px',
          lineHeight: 1.4,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.text}
      </div>
    </div>
  );
};

