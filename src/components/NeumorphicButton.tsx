import React, { ReactNode, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  primary?: boolean;
  disabled?: boolean;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({ 
  children, 
  onClick, 
  className,
  primary = false,
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onMouseLeave={() => !disabled && setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => !disabled && setIsPressed(false)}
      disabled={disabled}
      className={cn(
        "min-h-[44px] min-w-[44px] rounded-2xl px-6 py-3 font-medium transition-all duration-200 flex items-center justify-center",
        disabled 
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer active:scale-[0.98]",
        primary
          ? "bg-gradient-to-br from-[#7c6ff7] to-[#6c63ff] text-white shadow-[3px_3px_8px_#c4c9d0,-3px_-3px_8px_#ffffff]"
          : "bg-[#e8ecf1] text-gray-700",
        !primary && (isPressed 
          ? "shadow-[inset_3px_3px_8px_#c4c9d0,inset_-3px_-3px_8px_#ffffff]"
          : "shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff]"
        ),
        className
      )}
    >
      {children}
    </button>
  );
};
