import React from 'react';

interface NeumorphicCardProps {
  children: React.ReactNode;
  variant?: 'raised' | 'inset';
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  variant = 'raised',
  className = '',
  padding = 'medium',
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-5',
    large: 'p-8',
  };

  const shadowClass = variant === 'raised' ? 'shadow-neu-raised' : 'shadow-neu-inset';

  const baseClasses = `
    ${shadowClass}
    ${paddingClasses[padding]}
    bg-neu-bg
    rounded-neu
    transition-all
    duration-200
    ${className}
  `;

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};

export default NeumorphicCard;
