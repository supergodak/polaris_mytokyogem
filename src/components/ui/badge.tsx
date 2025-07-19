import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'solo' | 'genre';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    solo: 'bg-green-100 text-green-800',
    genre: 'bg-blue-100 text-blue-800'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}