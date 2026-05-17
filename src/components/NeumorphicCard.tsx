import React, { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicCardProps {
  children: ReactNode;
  className?: string;
  inset?: boolean;
  onClick?: () => void;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ 
  children, 
  className, 
  inset = false,
  onClick 
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-[#e8ecf1] rounded-2xl p-4 transition-all duration-300",
        inset 
          ? "shadow-[inset_3px_3px_8px_#c4c9d0,inset_-3px_-3px_8px_#ffffff]"
          : "shadow-[5px_5px_15px_#c4c9d0,-5px_-5px_15px_#ffffff]",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
};
