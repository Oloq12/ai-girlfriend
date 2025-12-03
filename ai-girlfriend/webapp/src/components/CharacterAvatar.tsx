import React from 'react';

// ============================================================================
// Types
// ============================================================================

export type Emotion = 
  | 'neutral' 
  | 'happy' 
  | 'sad' 
  | 'angry' 
  | 'flirty' 
  | 'shy' 
  | 'worried'
  | 'excited';

export interface CharacterAvatarProps {
  name: string;
  avatarUrl?: string;
  emoji?: string;
  emotion?: Emotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showEmotionBadge?: boolean;
  onClick?: () => void;
}

// ============================================================================
// Emotion Config
// ============================================================================

const emotionConfig: Record<Emotion, { color: string; emoji: string; label: string }> = {
  neutral: { color: 'bg-gray-400', emoji: '😐', label: 'Спокойно' },
  happy: { color: 'bg-green-500', emoji: '😊', label: 'Радость' },
  sad: { color: 'bg-blue-500', emoji: '😢', label: 'Грусть' },
  angry: { color: 'bg-red-500', emoji: '😠', label: 'Злость' },
  flirty: { color: 'bg-pink-500', emoji: '😏', label: 'Флирт' },
  shy: { color: 'bg-rose-400', emoji: '😳', label: 'Смущение' },
  worried: { color: 'bg-yellow-500', emoji: '😟', label: 'Тревога' },
  excited: { color: 'bg-orange-500', emoji: '🤩', label: 'Восторг' },
};

const sizeConfig = {
  sm: { container: 'w-10 h-10', emoji: 'text-xl', badge: 'w-4 h-4 text-[8px]', name: 'text-xs' },
  md: { container: 'w-14 h-14', emoji: 'text-3xl', badge: 'w-5 h-5 text-[10px]', name: 'text-sm' },
  lg: { container: 'w-20 h-20', emoji: 'text-5xl', badge: 'w-6 h-6 text-xs', name: 'text-base' },
  xl: { container: 'w-28 h-28', emoji: 'text-6xl', badge: 'w-8 h-8 text-sm', name: 'text-lg' },
};

// ============================================================================
// CharacterAvatar Component
// ============================================================================

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  name,
  avatarUrl,
  emoji = '👩',
  emotion = 'neutral',
  size = 'md',
  showName = true,
  showEmotionBadge = true,
  onClick,
}) => {
  const emotionData = emotionConfig[emotion];
  const sizeData = sizeConfig[size];

  return (
    <div
      className={`flex flex-col items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Avatar Circle */}
      <div className="relative">
        <div
          className={`
            ${sizeData.container} rounded-full 
            bg-gradient-to-br from-gray-100 to-gray-200
            flex items-center justify-center
            shadow-md border-2 border-white
            overflow-hidden
          `}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className={sizeData.emoji}>{emoji}</span>
          )}
        </div>

        {/* Emotion Badge */}
        {showEmotionBadge && (
          <div
            className={`
              absolute -bottom-1 -right-1
              ${sizeData.badge} ${emotionData.color}
              rounded-full border-2 border-white
              flex items-center justify-center
              shadow-sm
            `}
            title={emotionData.label}
          >
            <span>{emotionData.emoji}</span>
          </div>
        )}
      </div>

      {/* Name */}
      {showName && (
        <span className={`${sizeData.name} font-medium text-gray-800`}>
          {name}
        </span>
      )}
    </div>
  );
};

export default CharacterAvatar;
