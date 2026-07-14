import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value, decimals = 1, suffix = '', prefix = '',
  className, duration = 1500
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = display;
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRef.current + (value - startRef.current) * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={clsx('tabular-nums', className)}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}
