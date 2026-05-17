import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const NeumorphicInput: React.FC<NeumorphicInputProps> = ({ 
  className, 
  ...props 
}) => {
  return (
    <input
      className={cn(
        "w-full bg-[#e8ecf1] rounded-2xl p-4 text-gray-700 outline-none transition-all duration-300",
        "shadow-[inset_3px_3px_8px_#c4c9d0,inset_-3px_-3px_8px_#ffffff]",
        "placeholder:text-gray-400",
        "focus:shadow-[inset_4px_4px_10px_#c4c9d0,inset_-4px_-4px_10px_#ffffff]",
        className
      )}
      {...props}
    />
  );
};
