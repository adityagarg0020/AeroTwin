import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'light';
  border?: boolean;
  glow?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ variant = 'dark', border = true, glow = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          variant === 'dark' && 'glass',
          variant === 'light' && 'glass-light',
          border && 'border border-primary/10',
          glow && 'glow-blue',
          'transition-all duration-300',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
