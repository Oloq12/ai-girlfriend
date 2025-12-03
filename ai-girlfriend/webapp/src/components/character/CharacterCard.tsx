import React from 'react';
import type { Character, CharacterStats } from '@/types';
import { Card } from '@/components/ui';

export interface CharacterCardProps {
  character: Character;
  stats?: CharacterStats;
  onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  stats,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '8px',
        padding: '20px 16px',
      }}
    >
      <span style={{ fontSize: '48px' }}>{character.emoji}</span>
      
      <h3
        style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #111827)',
        }}
      >
        {character.name}
      </h3>
      
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          color: 'var(--tg-theme-hint-color, #6b7280)',
          lineHeight: 1.4,
        }}
      >
        {character.shortDescription}
      </p>

      {stats && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '8px',
            padding: '6px 12px',
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          <span>❤️ {stats.affection}</span>
          <span>🤝 {stats.trust}</span>
          <span>✨ {stats.chemistry}</span>
        </div>
      )}
    </Card>
  );
};

