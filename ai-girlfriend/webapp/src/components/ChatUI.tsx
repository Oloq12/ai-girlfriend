import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CharacterAvatar, type Emotion } from './CharacterAvatar';
import { ChoiceButtons } from './ChoiceButtons';
import { StatsDisplay } from './StatBar';

// Import engines
import { 
  getInitialScene, 
  getNextScene, 
  type Scene,
  type SceneChoice,
} from '@/lib/storyEngine';
import { 
  getInitialStats, 
  applyStatChanges,
  type PlayerStats,
} from '@/lib/stateEngine';

// ============================================================================
// Types
// ============================================================================

export interface Message {
  id: string;
  from: 'character' | 'user';
  text: string;
  timestamp: number;
}

export interface ChatUIProps {
  /** ID персонажа (например, 'kuudere', 'alisa') */
  characterId?: string;
  /** Имя персонажа для отображения */
  characterName?: string;
  /** Эмодзи персонажа */
  characterEmoji?: string;
  /** Callback при завершении эпизода */
  onEpisodeEnd?: (stats: PlayerStats) => void;
  /** Callback при возврате */
  onBack?: () => void;
}

// ============================================================================
// Helper: Map scene emotion to component emotion
// ============================================================================

function mapSceneEmotion(sceneEmotion: string): Emotion {
  const mapping: Record<string, Emotion> = {
    neutral: 'neutral',
    happy: 'happy',
    sad: 'sad',
    angry: 'angry',
    flirty: 'flirty',
    shy: 'shy',
    worried: 'worried',
    excited: 'excited',
    tender: 'happy',
  };
  return mapping[sceneEmotion] || 'neutral';
}

// ============================================================================
// ChatUI Component
// ============================================================================

export const ChatUI: React.FC<ChatUIProps> = ({
  characterId = 'kuudere',
  characterName = 'Алиса',
  characterEmoji = '👩‍🎓',
  onEpisodeEnd,
  onBack,
}) => {
  // ========== State ==========
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<PlayerStats>(getInitialStats());
  const [showStats, setShowStats] = useState(false);
  const [isEpisodeComplete, setIsEpisodeComplete] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ========== Initialization ==========
  useEffect(() => {
    // Get initial scene
    const initialScene = getInitialScene(characterId);
    
    if (initialScene) {
      setCurrentScene(initialScene);
      
      // Add initial message from character
      const initialMessage: Message = {
        id: `msg-${Date.now()}`,
        from: 'character',
        text: initialScene.text,
        timestamp: Date.now(),
      };
      setMessages([initialMessage]);
    } else {
      console.error('[ChatUI] No initial scene found for:', characterId);
    }
    
    // Initialize stats
    setStats(getInitialStats());
  }, [characterId]);

  // ========== Auto-scroll ==========
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ========== Handle Choice Selection ==========
  const handleChoice = useCallback((choiceId: string) => {
    if (!currentScene || isEpisodeComplete) return;

    // Find the selected choice
    const selectedChoice = currentScene.choices.find(c => c.id === choiceId);
    if (!selectedChoice) return;

    // Get next scene
    const result = getNextScene(characterId, currentScene, choiceId);

    // Add user message (the choice text)
    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      from: 'user',
      text: selectedChoice.text,
      timestamp: Date.now(),
    };

    // Apply stat changes
    if (result.statChanges) {
      setStats(prevStats => applyStatChanges(prevStats, result.statChanges!));
    }

    // Update messages and scene
    if (result.nextScene) {
      // Add character response
      const characterMessage: Message = {
        id: `msg-char-${Date.now()}`,
        from: 'character',
        text: result.nextScene.text,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, userMessage, characterMessage]);
      setCurrentScene(result.nextScene);
    } else {
      // Episode ended
      setMessages(prev => [...prev, userMessage]);
      setIsEpisodeComplete(true);
      
      // Callback
      if (onEpisodeEnd) {
        onEpisodeEnd(stats);
      }
    }
  }, [currentScene, characterId, isEpisodeComplete, stats, onEpisodeEnd]);

  // ========== Derived State ==========
  const currentEmotion = currentScene ? mapSceneEmotion(currentScene.emotion) : 'neutral';
  
  // Map scene choices to ChoiceButtons format
  const choiceButtons = currentScene?.choices.map(choice => ({
    id: choice.id,
    text: choice.text,
    statHint: formatStatChanges(choice.statChanges),
  })) || [];

  // ========== Render ==========
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        {onBack ? (
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            ← Назад
          </button>
        ) : (
          <div className="w-16" />
        )}

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowStats(!showStats)}
        >
          <CharacterAvatar
            name={characterName}
            emoji={characterEmoji}
            emotion={currentEmotion}
            size="sm"
            showName={false}
            showEmotionBadge={true}
          />
          <div className="text-center">
            <span className="font-semibold text-gray-900">{characterName}</span>
            <div className="text-xs text-gray-400">
              ❤️{stats.affection} 🤝{stats.trust} 🔥{stats.passion}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowStats(!showStats)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          📊
        </button>
      </header>

      {/* Stats Panel (collapsible) */}
      {showStats && (
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <StatsDisplay
            affection={stats.affection}
            trust={stats.trust}
            passion={stats.passion}
            compact
          />
          <div className="mt-2 text-xs text-gray-400 flex gap-4">
            <span>😈 Ревность: {stats.jealousy}</span>
            <span>💔 Уязвимость: {stats.vulnerability}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.from === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                }
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Choice Buttons */}
        {!isEpisodeComplete && choiceButtons.length > 0 && (
          <div className="mt-4">
            <ChoiceButtons
              choices={choiceButtons}
              onChoice={handleChoice}
              disabled={isEpisodeComplete}
            />
          </div>
        )}

        {/* Episode End Message */}
        {isEpisodeComplete && (
          <div className="mt-6 text-center">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
              <p className="font-semibold">🎬 Конец эпизода</p>
              <p className="text-sm opacity-90 mt-1">Продолжение следует...</p>
            </div>
            
            {onBack && (
              <button
                onClick={onBack}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
              >
                Вернуться в меню
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - disabled during story mode */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 bg-gray-100 text-gray-400 text-sm">
            Выберите вариант ответа выше ↑
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Форматирует изменения статов для отображения в подсказке
 */
function formatStatChanges(changes?: Partial<PlayerStats>): string {
  if (!changes) return '';
  
  const parts: string[] = [];
  
  if (changes.affection) {
    const sign = changes.affection > 0 ? '+' : '';
    parts.push(`❤️${sign}${changes.affection}`);
  }
  if (changes.trust) {
    const sign = changes.trust > 0 ? '+' : '';
    parts.push(`🤝${sign}${changes.trust}`);
  }
  if (changes.passion) {
    const sign = changes.passion > 0 ? '+' : '';
    parts.push(`🔥${sign}${changes.passion}`);
  }
  if (changes.jealousy) {
    const sign = changes.jealousy > 0 ? '+' : '';
    parts.push(`😈${sign}${changes.jealousy}`);
  }
  if (changes.vulnerability) {
    const sign = changes.vulnerability > 0 ? '+' : '';
    parts.push(`💔${sign}${changes.vulnerability}`);
  }
  
  return parts.join(' ');
}

export default ChatUI;
