import { clsx } from 'clsx';
import { Rocket } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface NavigationProps {
  items: NavItem[];
  currentPage: string;
  onNavigate: (page: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Navigation({ items, currentPage, onNavigate, isOpen, onClose }: NavigationProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={clsx(
        'fixed top-0 left-0 z-40 h-full w-64 bg-space-card/95 backdrop-blur-xl border-r border-primary/10',
        'transform transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full relative">
          {/* Scanline accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          {/* Logo */}
          <div className="p-5 border-b border-white/5">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Rocket size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-orbitron text-xs font-bold text-white tracking-wider">AeroTwin</h2>
                <p className="text-[9px] text-gray-600 font-orbitron tracking-widest uppercase">Mission Control</p>
              </div>
            </button>
          </div>

          {/* System status bar */}
          <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-breathe" />
              <span className="text-[9px] font-orbitron text-gray-500 tracking-wider uppercase">SYSTEM NOMINAL</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  'hover:bg-primary/10 hover:text-white',
                  currentPage === item.id
                    ? 'bg-primary/15 text-primary border border-primary/20 shadow-sm shadow-primary/10'
                    : 'text-gray-400 border border-transparent'
                )}
              >
                <span className={clsx(
                  'transition-colors duration-200',
                  currentPage === item.id ? 'text-primary' : 'text-gray-500'
                )}>
                  {item.icon}
                </span>
                <span className="text-xs">{item.label}</span>
                {currentPage === item.id && (
                  <span className="ml-auto flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary animate-blink" />
                    <span className="w-1 h-1 rounded-full bg-primary/50" />
                    <span className="w-1 h-1 rounded-full bg-primary/20" />
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/5">
            <div className="text-center space-y-1">
              <p className="text-[9px] font-orbitron text-gray-600 tracking-widest uppercase">AeroTwin AI v2.0.0</p>
              <p className="text-[8px] text-gray-700 font-mono-jb">IIT Indore × HAL</p>
            </div>
          </div>

          {/* HUD corners */}
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-tr" />
          <div className="hud-corner hud-corner-bl" />
          <div className="hud-corner hud-corner-br" />
        </div>
      </aside>
    </>
  );
}
