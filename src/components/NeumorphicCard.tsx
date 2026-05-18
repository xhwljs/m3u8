import React from 'react';

interface NeumorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: 'light' | 'dark';
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  theme = 'light',
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      {...props}
      className={`
        p-4 rounded-2xl
        transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff]'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};
