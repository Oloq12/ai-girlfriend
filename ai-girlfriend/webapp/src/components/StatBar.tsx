import React from 'react';

// ============================================================================
// Types
// ============================================================================

export interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
  emoji?: string;
  color?: 'red' | 'green' | 'purple' | 'blue' | 'yellow' | 'pink';
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface StatsDisplayProps {
  affection: number;
  trust: number;
  passion: number;
  compact?: boolean;
}

// ============================================================================
// Color Mapping
// ============================================================================

const colorClasses: Record<string, { bg: string; fill: string }> = {
  red: { bg: 'bg-red-100', fill: 'bg-red-500' },
  green: { bg: 'bg-green-100', fill: 'bg-green-500' },
  purple: { bg: 'bg-purple-100', fill: 'bg-purple-500' },
  blue: { bg: 'bg-blue-100', fill: 'bg-blue-500' },
  yellow: { bg: 'bg-yellow-100', fill: 'bg-yellow-500' },
  pink: { bg: 'bg-pink-100', fill: 'bg-pink-500' },
};

const sizeClasses = {
  sm: { height: 'h-1.5', text: 'text-xs', gap: 'gap-1' },
  md: { height: 'h-2.5', text: 'text-sm', gap: 'gap-1.5' },
  lg: { height: 'h-3.5', text: 'text-base', gap: 'gap-2' },
};

// ============================================================================
// StatBar Component
// ============================================================================

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue = 100,
  emoji,
  color = 'blue',
  showValue = true,
  size = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  return (
    <div className={`flex flex-col ${sizes.gap}`}>
      <div className="flex justify-between items-center">
        <span className={`${sizes.text} text-gray-700 flex items-center gap-1`}>
          {emoji && <span>{emoji}</span>}
          {label}
        </span>
        {showValue && (
          <span className={`${sizes.text} font-semibold text-gray-900`}>
            {value}
          </span>
        )}
      </div>
      <div className={`w-full ${sizes.height} ${colors.bg} rounded-full overflow-hidden`}>
        <div
          className={`${sizes.height} ${colors.fill} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// StatsDisplay Component (Affection / Trust / Passion)
// ============================================================================

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  affection,
  trust,
  passion,
  compact = false,
}) => {
  const size = compact ? 'sm' : 'md';

  return (
    <div className={`flex flex-col ${compact ? 'gap-2' : 'gap-3'}`}>
      <StatBar
        label="Affection"
        value={affection}
        emoji="❤️"
        color="red"
        size={size}
      />
      <StatBar
        label="Trust"
        value={trust}
        emoji="🤝"
        color="green"
        size={size}
      />
      <StatBar
        label="Passion"
        value={passion}
        emoji="🔥"
        color="purple"
        size={size}
      />
    </div>
  );
};

export default StatBar;
