import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterCard } from '@/components/character';
import { getAllCharacters } from '@/data/characters';
import { useGameStore } from '@/lib/store';
import type { CharacterId } from '@/types';

export const CharacterSelectScreen: React.FC = () => {
  const navigate = useNavigate();
  const { characterStats } = useGameStore();
  const characters = getAllCharacters();

  const handleSelectCharacter = (id: CharacterId) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      }}
    >
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--tg-theme-text-color, #111827)',
          }}
        >
          Выберите персонажа
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color, #6b7280)',
          }}
        >
          С кем хотите пообщаться?
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            stats={characterStats[character.id]}
            onClick={() => handleSelectCharacter(character.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterSelectScreen;

