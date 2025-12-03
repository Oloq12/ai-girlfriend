import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  isClickable?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  isClickable = !!onClick,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f3f4f6)',
        borderRadius: '16px',
        padding: '16px',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ...(isClickable && {
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }),
        ...style,
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

