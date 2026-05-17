import React from 'react';

interface NeumorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  size = 'medium',
}) => {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const baseClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]}
    font-semibold
    text-white
    bg-gradient-to-br
    from-neu-primary
    to-neu-secondary
    rounded-neu
    shadow-neu-button
    transition-all
    duration-200
    ease-in-out
    active:shadow-neu-button-active
    active:scale-98
    disabled:opacity-60
    disabled:cursor-not-allowed
    disabled:active:scale-100
    select-none
    touch-target
  `;

  const secondaryClasses = variant === 'secondary' ? `
    bg-gradient-to-br
    from-gray-400
    to-gray-500
  ` : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${secondaryClasses} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default NeumorphicButton;
