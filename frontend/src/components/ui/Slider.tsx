import { clsx } from 'clsx';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (v: number) => string;
  className?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, format, className }: SliderProps) {
  return (
    <div className={clsx('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-orbitron text-gray-500 tracking-wider">{label}</span>
        <span className="text-[10px] font-mono-jb text-primary font-semibold tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-space-card rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(59,130,246,0.5)]
          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200
          [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:hover:shadow-[0_0_12px_rgba(59,130,246,0.7)]
          [&::-webkit-slider-thumb]:active:scale-90"
      />
    </div>
  );
}
