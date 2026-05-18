import React from 'react';

interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme?: 'light' | 'dark';
}

export const NeumorphicInput: React.FC<NeumorphicInputProps> = ({ 
  theme = 'light',
  className = '', 
  ...props 
}) => {
  return (
    <input
      {...props}
      className={`
        w-full px-5 py-4 rounded-2xl text-base outline-none transition-all duration-300
        placeholder:text-gray-400 placeholder:text-sm
        ${theme === 'dark' 
          ? 'bg-gray-800 text-white placeholder:text-gray-500 border border-gray-700' 
          : 'bg-[#e8ecf1] text-gray-700 shadow-[inset_3px_3px_8px_#c4c9d0,inset_-3px_-3px_8px_#ffffff]'
        }
        focus:outline-none focus:ring-2 focus:ring-[#6c63ff]/50
        ${className}
      `}
    />
  );
};
