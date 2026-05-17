import React from 'react';

interface NeumorphicInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  disabled?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NeumorphicInput: React.FC<NeumorphicInputProps> = ({
  value,
  onChange,
  placeholder = '请输入M3U8播放链接',
  className = '',
  type = 'text',
  disabled = false,
  onKeyPress,
}) => {
  const baseClasses = `
    w-full px-6 py-4 
    bg-neu-bg 
    shadow-neu-inset
    rounded-neu
    text-gray-700
    text-base
    outline-none
    transition-all
    duration-200
    ease-in-out
    placeholder-gray-400
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={baseClasses}
      style={{ minHeight: '52px' }}
    />
  );
};

export default NeumorphicInput;
