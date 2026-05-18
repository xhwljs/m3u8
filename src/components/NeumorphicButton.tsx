import React, { useState } from 'react';

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  theme?: 'light' | 'dark';
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  primary = false,
  theme = 'light',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      {...props}
      disabled={disabled}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        min-h-[52px] px-6 py-3 rounded-2xl font-medium text-white
        flex items-center justify-center
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${primary
          ? `
            bg-gradient-to-r from-[#7c6ff7] to-[#6c63ff]
            hover:from-[#6c63ff] hover:to-[#5a52e6]
            shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff,inset_1px_1px_2px_rgba(255,255,255,0.2)]
            ${isPressed ? 'transform scale-[0.98] shadow-[2px_2px_8px_#c4c9d0,-2px_-2px_8px_#ffffff]' : ''}
          `
          : theme === 'dark'
            ? `
              bg-gray-800 text-white
              hover:bg-gray-700
              ${isPressed ? 'transform scale-[0.98]' : ''}
            `
            : `
              bg-white text-gray-700
              shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff]
              hover:shadow-[4px_4px_12px_#c4c9d0,-4px_-4px_12px_#ffffff]
              ${isPressed ? 'transform scale-[0.98] shadow-[2px_2px_8px_#c4c9d0,-2px_-2px_8px_#ffffff]' : ''}
            `
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};
