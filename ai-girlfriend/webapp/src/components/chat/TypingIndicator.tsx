import React from 'react';

export interface TypingIndicatorProps {
  name?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => {
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #e5e7eb)',
        borderRadius: '18px 18px 18px 4px',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--tg-theme-hint-color, #9ca3af)',
              animation: `typing-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
      {name && (
        <span
          style={{
            fontSize: '13px',
            color: 'var(--tg-theme-hint-color, #6b7280)',
          }}
        >
          {name} печатает…
        </span>
      )}
      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

