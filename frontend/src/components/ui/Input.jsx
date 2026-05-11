import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ label, error, className, type = 'text', ...props }, ref) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
    )}
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full h-9 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-3 text-[13.5px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-400 dark:focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
        error && 'border-red-400 focus:ring-red-400/50',
        className
      )}
      {...props}
    />
    {error && <p className="text-[12px] text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
