import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonLoader({ width = '100%', height = '20px', className }: SkeletonLoaderProps) {
  return (
    <div
      className={clsx(
        'rounded-lg bg-gradient-to-r from-space-card via-white/5 to-space-card',
        'bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
      style={{ width, height }}
    />
  );
}
