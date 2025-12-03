import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--tg-theme-button-color, #3b82f6)',
    color: 'var(--tg-theme-button-text-color, #ffffff)',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'var(--tg-theme-secondary-bg-color, #e5e7eb)',
    color: 'var(--tg-theme-text-color, #111827)',
    border: 'none',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--tg-theme-link-color, #3b82f6)',
    border: 'none',
  },
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: '12px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '16px' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        fontWeight: 500,
        transition: 'opacity 0.2s, transform 0.1s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LoadingSpinner />
          Загрузка...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

const LoadingSpinner: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      strokeDasharray="31.4 31.4"
      strokeLinecap="round"
    />
  </svg>
);

