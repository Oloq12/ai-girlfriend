import React from 'react';

// ============================================================================
// Types
// ============================================================================

export interface Choice {
  id: string;
  text: string;
  disabled?: boolean;
  locked?: boolean;
  statHint?: string;
}

export interface ChoiceButtonsProps {
  choices: Choice[];
  onChoice: (id: string) => void;
  disabled?: boolean;
}

// ============================================================================
// ChoiceButtons Component
// ============================================================================

export const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({
  choices,
  onChoice,
  disabled = false,
}) => {
  if (!choices || choices.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl">
      {choices.map((choice, index) => {
        const isLocked = choice.locked || choice.disabled;
        const isDisabled = disabled || isLocked;

        return (
          <button
            key={choice.id}
            onClick={() => !isDisabled && onChoice(choice.id)}
            disabled={isDisabled}
            className={`
              w-full px-4 py-3 rounded-xl text-left transition-all duration-200
              flex items-center justify-between gap-2
              ${isDisabled 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60' 
                : 'bg-white text-gray-800 hover:bg-blue-50 hover:border-blue-300 active:scale-[0.98] cursor-pointer'
              }
              border border-gray-200 shadow-sm
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">
                {index + 1}.
              </span>
              <span className="text-sm font-medium">
                {choice.text}
              </span>
            </span>

            {choice.locked && (
              <span className="text-xs text-red-400 flex items-center gap-1">
                🔒
              </span>
            )}

            {choice.statHint && !choice.locked && (
              <span className="text-xs text-gray-400">
                {choice.statHint}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChoiceButtons;
