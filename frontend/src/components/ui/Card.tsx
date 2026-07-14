import { type HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'blue' | 'accent' | 'green' | 'yellow' | 'orange' | 'red' | null;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glow = null, hover = true, padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'glass',
          'transition-all duration-300',
          hover && 'hover-lift',
          glow === 'blue' && 'glow-blue',
          glow === 'accent' && 'glow-accent',
          glow === 'green' && 'glow-green',
          glow === 'yellow' && 'glow-yellow',
          glow === 'orange' && 'glow-orange',
          glow === 'red' && 'glow-red',
          padding === 'sm' && 'p-3',
          padding === 'md' && 'p-5',
          padding === 'lg' && 'p-7',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
