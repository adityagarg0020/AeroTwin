import { clsx } from 'clsx';
import type { HealthLevel } from '../../types';

interface BadgeProps {
  variant?: HealthLevel | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono-jb font-semibold',
        variant === 'healthy' && 'bg-green/15 text-green border border-green/20',
        variant === 'moderate' && 'bg-yellow/15 text-yellow border border-yellow/20',
        variant === 'warning' && 'bg-orange/15 text-orange border border-orange/20',
        variant === 'critical' && 'bg-red/15 text-red border border-red/20 animate-pulse-glow',
        variant === 'info' && 'bg-primary/15 text-primary border border-primary/20',
        variant === 'neutral' && 'bg-white/5 text-gray-400 border border-white/10',
        className
      )}
    >
      {variant === 'healthy' && <span className="w-1 h-1 rounded-full bg-green" />}
      {variant === 'moderate' && <span className="w-1 h-1 rounded-full bg-yellow" />}
      {variant === 'warning' && <span className="w-1 h-1 rounded-full bg-orange" />}
      {variant === 'critical' && <span className="w-1 h-1 rounded-full bg-red" />}
      {children}
    </span>
  );
}
