import React from 'react';
import type { Character, CharacterStats } from '@/types';
import { Button } from '@/components/ui';

export interface ChatHeaderProps {
  character: Character;
  stats?: CharacterStats;
  onBack?: () => void;
  showStats?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  character,
  stats,
  onBack,
  showStats = false,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--tg-theme-hint-color, #e5e7eb)',
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      }}
    >
      {onBack ? (
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Назад
        </Button>
      ) : (
        <div style={{ width: '60px' }} />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{character.emoji}</span>
          <span
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: 'var(--tg-theme-text-color, #111827)',
            }}
          >
            {character.name}
          </span>
        </div>

        {showStats && stats && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '11px',
              color: 'var(--tg-theme-hint-color, #6b7280)',
            }}
          >
            <span>❤️ {stats.affection}</span>
            <span>🤝 {stats.trust}</span>
            <span>✨ {stats.chemistry}</span>
          </div>
        )}
      </div>

      <div style={{ width: '60px' }} />
    </header>
  );
};

