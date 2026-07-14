export function formatNumber(value: number, decimals = 2): string {
  return Number(value).toFixed(decimals);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatThrust(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)} kN`;
  return `${value.toFixed(0)} N`;
}

export function formatTSFC(value: number): string {
  return `${value.toFixed(4)} g/(N·s)`;
}

export function formatAltitude(value: number): string {
  return `${value.toFixed(0)} m`;
}

export function formatMach(value: number): string {
  return `M ${value.toFixed(2)}`;
}

export function formatRPM(value: number): string {
  return `${value.toFixed(0)} rpm`;
}

export function formatFuelFlow(value: number): string {
  return `${value.toFixed(3)} kg/s`;
}

export function formatTemperature(value: number): string {
  return `${value.toFixed(1)} K`;
}

export function formatPressure(value: number): string {
  if (value >= 100000) return `${(value / 1000).toFixed(1)} kPa`;
  return `${value.toFixed(0)} Pa`;
}

export function formatCycle(value: number): string {
  return `Cycle ${value}`;
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
