import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui';

export interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  placeholder = 'Напиши что-нибудь…',
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    
    onSend(trimmed);
    setValue('');
    
    // Сбросить высоту textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, isLoading, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        borderTop: '1px solid var(--tg-theme-hint-color, #e5e7eb)',
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          border: '1px solid var(--tg-theme-hint-color, #d1d5db)',
          borderRadius: '20px',
          padding: '10px 16px',
          fontSize: '15px',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          color: 'var(--tg-theme-text-color, #111827)',
          outline: 'none',
          minHeight: '42px',
          maxHeight: '120px',
          lineHeight: 1.4,
        }}
      />
      <Button
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        isLoading={isLoading}
        style={{
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          padding: 0,
          flexShrink: 0,
        }}
      >
        {!isLoading && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </Button>
    </div>
  );
};

