import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && (
        <label
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--tg-theme-text-color, #111827)',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          padding: '12px 16px',
          borderRadius: '12px',
          border: error
            ? '1px solid #ef4444'
            : '1px solid var(--tg-theme-hint-color, #d1d5db)',
          fontSize: '15px',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          color: 'var(--tg-theme-text-color, #111827)',
          outline: 'none',
          transition: 'border-color 0.2s',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>
      )}
    </div>
  );
};

