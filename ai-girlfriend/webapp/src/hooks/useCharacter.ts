import { useMemo } from 'react';
import type { Character, CharacterId, CharacterStats } from '@/types';
import { getCharacterById } from '@/data/characters';
import { useGameStore } from '@/lib/store';
import { getRelationshipLevel } from '@/lib/game/stats';
import { DEFAULT_STATS } from '@/types';

interface UseCharacterReturn {
  character: Character | undefined;
  stats: CharacterStats;
  relationshipLevel: {
    level: number;
    name: string;
    nextThreshold: number | null;
  };
  isLoaded: boolean;
}

/**
 * Hook для получения данных персонажа и его статов
 */
export function useCharacter(characterId: CharacterId | string): UseCharacterReturn {
  const { characterStats, initCharacterStats } = useGameStore();

  const character = useMemo(
    () => getCharacterById(characterId),
    [characterId]
  );

  const stats = useMemo(() => {
    const existingStats = characterStats[characterId as CharacterId];
    
    // Если статов нет, инициализируем
    if (!existingStats && character) {
      initCharacterStats(characterId as CharacterId);
      return { ...DEFAULT_STATS };
    }
    
    return existingStats ?? { ...DEFAULT_STATS };
  }, [characterId, characterStats, character, initCharacterStats]);

  const relationshipLevel = useMemo(
    () => getRelationshipLevel(stats),
    [stats]
  );

  return {
    character,
    stats,
    relationshipLevel,
    isLoaded: !!character,
  };
}

