import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 工具函数：合并 Tailwind 类名
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  concave?: boolean;
  onClick?: () => void;
}

export default function NeumorphicCard({
  children,
  className,
  concave = false,
  onClick,
}: NeumorphicCardProps) {
  return (
    <div
      className={cn(
        'bg-[#e8ecf1] rounded-2xl transition-all duration-200',
        concave ? 'neumorphic-concave' : 'neumorphic-convex',
        onClick && 'cursor-pointer active:neumorphic-concave active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
