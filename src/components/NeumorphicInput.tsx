import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function NeumorphicInput({
  className,
  ...props
}: NeumorphicInputProps) {
  return (
    <input
      className={cn(
        'w-full bg-[#e8ecf1] text-gray-700 px-6 py-4 rounded-2xl outline-none',
        'neumorphic-concave transition-all duration-200',
        'placeholder:text-gray-400',
        'min-h-[44px]',
        className
      )}
      {...props}
    />
  );
}
