import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', glow = true, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer',
          'hover:scale-[1.02] active:scale-[0.98]',
          variant === 'primary' && 'bg-primary text-white hover:bg-blue-600',
          variant === 'accent' && 'bg-accent text-space-black hover:bg-cyan-400',
          variant === 'ghost' && 'bg-transparent border border-primary/30 text-primary hover:bg-primary/10',
          variant === 'danger' && 'bg-red text-white hover:bg-red-600',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-8 py-3.5 text-base',
          glow && variant === 'primary' && 'hover:glow-blue',
          glow && variant === 'accent' && 'hover:glow-accent',
          glow && variant === 'danger' && 'hover:glow-red',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
