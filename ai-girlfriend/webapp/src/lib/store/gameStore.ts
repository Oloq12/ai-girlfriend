import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CharacterId, 
  CharacterStats, 
  ChatMessage,
  GameState 
} from '@/types';
import { DEFAULT_STATS } from '@/types';
import { updateStats, calculateMood } from '@/lib/game/stats';

interface GameStore extends GameState {
  // Actions
  setCurrentCharacter: (id: CharacterId | null) => void;
  initCharacterStats: (id: CharacterId) => void;
  updateCharacterStats: (id: CharacterId, changes: Partial<Omit<CharacterStats, 'mood'>>) => void;
  addMessage: (characterId: CharacterId, message: ChatMessage) => void;
  clearMessages: (characterId: CharacterId) => void;
  unlockScene: (sceneId: string) => void;
  completeScene: (sceneId: string) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  reset: () => void;
}

const INITIAL_STATE: GameState = {
  currentCharacterId: null,
  characterStats: {} as Record<CharacterId, CharacterStats>,
  unlockedScenes: [],
  completedScenes: [],
  chatHistories: {} as Record<CharacterId, ChatMessage[]>,
  currency: {
    coins: 100,
    gems: 10,
  },
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setCurrentCharacter: (id) => {
        set({ currentCharacterId: id });
        if (id && !get().characterStats[id]) {
          get().initCharacterStats(id);
        }
      },

      initCharacterStats: (id) => {
        set((state) => ({
          characterStats: {
            ...state.characterStats,
            [id]: { ...DEFAULT_STATS },
          },
          chatHistories: {
            ...state.chatHistories,
            [id]: state.chatHistories[id] ?? [],
          },
        }));
      },

      updateCharacterStats: (id, changes) => {
        set((state) => {
          const currentStats = state.characterStats[id] ?? { ...DEFAULT_STATS };
          const newStats = updateStats(currentStats, changes);
          
          // Пересчитываем настроение
          const interaction = 
            (changes.affection ?? 0) + (changes.trust ?? 0) + (changes.chemistry ?? 0) > 0
              ? 'positive'
              : (changes.affection ?? 0) + (changes.trust ?? 0) + (changes.chemistry ?? 0) < 0
                ? 'negative'
                : 'neutral';
          
          newStats.mood = calculateMood(newStats, interaction);

          return {
            characterStats: {
              ...state.characterStats,
              [id]: newStats,
            },
          };
        });
      },

      addMessage: (characterId, message) => {
        set((state) => ({
          chatHistories: {
            ...state.chatHistories,
            [characterId]: [
              ...(state.chatHistories[characterId] ?? []),
              message,
            ],
          },
        }));
      },

      clearMessages: (characterId) => {
        set((state) => ({
          chatHistories: {
            ...state.chatHistories,
            [characterId]: [],
          },
        }));
      },

      unlockScene: (sceneId) => {
        set((state) => ({
          unlockedScenes: state.unlockedScenes.includes(sceneId)
            ? state.unlockedScenes
            : [...state.unlockedScenes, sceneId],
        }));
      },

      completeScene: (sceneId) => {
        set((state) => ({
          completedScenes: state.completedScenes.includes(sceneId)
            ? state.completedScenes
            : [...state.completedScenes, sceneId],
        }));
      },

      addCoins: (amount) => {
        set((state) => ({
          currency: {
            ...state.currency,
            coins: state.currency.coins + amount,
          },
        }));
      },

      addGems: (amount) => {
        set((state) => ({
          currency: {
            ...state.currency,
            gems: state.currency.gems + amount,
          },
        }));
      },

      spendCoins: (amount) => {
        const { currency } = get();
        if (currency.coins < amount) return false;
        
        set((state) => ({
          currency: {
            ...state.currency,
            coins: state.currency.coins - amount,
          },
        }));
        return true;
      },

      spendGems: (amount) => {
        const { currency } = get();
        if (currency.gems < amount) return false;
        
        set((state) => ({
          currency: {
            ...state.currency,
            gems: state.currency.gems - amount,
          },
        }));
        return true;
      },

      reset: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: 'lovegate-game-storage',
      partialize: (state) => ({
        characterStats: state.characterStats,
        unlockedScenes: state.unlockedScenes,
        completedScenes: state.completedScenes,
        chatHistories: state.chatHistories,
        currency: state.currency,
      }),
    }
  )
);

// Селекторы
export const selectCurrentCharacterStats = (state: GameStore) =>
  state.currentCharacterId ? state.characterStats[state.currentCharacterId] : null;

export const selectChatHistory = (state: GameStore, characterId: CharacterId) =>
  state.chatHistories[characterId] ?? [];

