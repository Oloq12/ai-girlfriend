import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useCharacter } from '@/hooks';
import type { CharacterId } from '@/types';

export const CharacterProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { character, stats, relationshipLevel, isLoaded } = useCharacter(id ?? '');

  if (!isLoaded || !character) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        }}
      >
        <h2
          style={{
            color: 'var(--tg-theme-text-color, #111827)',
            marginBottom: '16px',
          }}
        >
          Персонаж не найден
        </h2>
        <Button onClick={() => navigate('/')}>Назад к выбору</Button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-hint-color, #e5e7eb)',
        }}
      >
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Назад
        </Button>
      </header>

      {/* Profile Content */}
      <div
        style={{
          padding: '32px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            fontSize: '80px',
            marginBottom: '16px',
          }}
        >
          {character.emoji}
        </div>

        {/* Name */}
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #111827)',
          }}
        >
          {character.name}
        </h1>

        {/* Relationship Level */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #f3f4f6)',
            borderRadius: '20px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '14px' }}>💝</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--tg-theme-text-color, #111827)',
            }}
          >
            {relationshipLevel.name}
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '24px',
            padding: '16px 24px',
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #f3f4f6)',
            borderRadius: '16px',
          }}
        >
          <StatItem label="Привязанность" value={stats.affection} emoji="❤️" />
          <StatItem label="Доверие" value={stats.trust} emoji="🤝" />
          <StatItem label="Химия" value={stats.chemistry} emoji="✨" />
        </div>

        {/* Description */}
        <p
          style={{
            margin: '0 0 32px',
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'var(--tg-theme-hint-color, #6b7280)',
          }}
        >
          {character.fullDescription}
        </p>

        {/* Start Chat Button */}
        <Button
          size="lg"
          onClick={() => navigate(`/chat/${character.id}`)}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          💬 Начать общение
        </Button>
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  emoji: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, emoji }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
    <span style={{ fontSize: '20px' }}>{emoji}</span>
    <span
      style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'var(--tg-theme-text-color, #111827)',
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontSize: '11px',
        color: 'var(--tg-theme-hint-color, #6b7280)',
      }}
    >
      {label}
    </span>
  </div>
);

export default CharacterProfileScreen;

