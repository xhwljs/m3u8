import React, { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'circle';
  size?: 'sm' | 'md' | 'lg';
}

export default function NeumorphicButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}: NeumorphicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'transition-all duration-200 flex items-center justify-center active:neumorphic-button-pressed min-h-[44px] min-w-[44px]';
  
  const variantClasses = {
    default: 'bg-[#e8ecf1] text-gray-700',
    primary: 'bg-gradient-to-br from-[#7c6ff7] to-[#6c63ff] text-white shadow-lg',
    circle: 'bg-[#e8ecf1] text-gray-700 rounded-full',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-8 py-4 text-base rounded-2xl',
    lg: 'px-12 py-5 text-lg rounded-2xl',
  };

  const circleSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const isCircle = variant === 'circle';

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        isCircle ? circleSizeClasses[size] : sizeClasses[size],
        !isCircle && 'neumorphic-convex',
        isCircle && 'neumorphic-convex',
        isPressed && 'neumorphic-button-pressed',
        variant === 'primary' && 'hover:opacity-90',
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  );
}
