import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = ({ children, className, variant = 'primary', size = 'md', isLoading, disabled, ...props }) => {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-[#2383E2] hover:bg-[#1a6fc4] text-white shadow-sm shadow-blue-500/20',
    secondary: 'bg-white dark:bg-white/[0.08] border border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.12]',
    ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.07] hover:text-gray-900 dark:hover:text-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    outline: 'border border-gray-200 dark:border-white/[0.1] bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]',
  };

  const sizes = {
    xs: 'h-7 px-2.5 text-[12px]',
    sm: 'h-8 px-3 text-[13px]',
    md: 'h-9 px-4 text-[13.5px]',
    lg: 'h-10 px-5 text-[14px]',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>Loading…</span>
        </>
      ) : children}
    </button>
  );
};

export default Button;
