import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { DigitalTwin } from './pages/DigitalTwin';
import { Predictions } from './pages/Predictions';
import { Analytics } from './pages/Analytics';
import { FlightSimPage } from './pages/FlightSimPage';
import { AICopilotPage } from './pages/AICopilotPage';
import { FleetPage } from './pages/Fleet';
import { Maintenance } from './pages/Maintenance';
import { Settings } from './pages/Settings';
import { Navigation } from './components/layout/Navigation';
import {
  LayoutDashboard, Box, Brain, BarChart3, Plane, Bot,
  Layers, Wrench, Settings2, Menu, X
} from 'lucide-react';

type Page = 'landing' | 'dashboard' | 'digital-twin' | 'predictions' | 'analytics' |
  'flight-sim' | 'ai-copilot' | 'fleet' | 'maintenance' | 'settings';

const navItems: Array<{ id: Page; label: string; icon: React.ReactNode }> = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'digital-twin', label: 'Virtual Engine', icon: <Box size={16} /> },
  { id: 'predictions', label: 'Predictions', icon: <Brain size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} /> },
  { id: 'flight-sim', label: 'Flight Sim', icon: <Plane size={16} /> },
  { id: 'ai-copilot', label: 'AI Copilot', icon: <Bot size={16} /> },
  { id: 'fleet', label: 'Fleet', icon: <Layers size={16} /> },
  { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={16} /> },
  { id: 'settings', label: 'Settings', icon: <Settings2 size={16} /> },
];

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const bootText = [
    'AeroTwin AI v1.0.0',
    'Loading AI models...',
    'Establishing digital twin connection...',
    'Calibrating sensors...',
    'System ready.',
  ];

  useEffect(() => {
    if (phase < bootText.length) {
      const timer = setTimeout(() => setPhase(phase + 1), 600 + Math.random() * 400);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div className="boot-screen">
      <div className="text-center space-y-4">
        <div className="text-2xl font-black text-gradient">AeroTwin AI</div>
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${(phase / bootText.length) * 100}%` }}
          />
        </div>
        <div className="space-y-1">
          {bootText.slice(0, phase).map((text, i) => (
            <div key={i} className="text-xs text-gray-400 font-mono">
              {i === phase - 1 ? (
                <span className="text-accent animate-pulse">&gt; {text}</span>
              ) : (
                <span className="text-gray-600">{text}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showBoot, setShowBoot] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [navOpen, setNavOpen] = useState(false);

  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
  }, []);

  const navigate = useCallback((page: Page) => {
    setCurrentPage(page);
    setNavOpen(false);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <Landing onEnter={() => navigate('dashboard')} />;
      case 'dashboard': return <Dashboard />;
      case 'digital-twin': return <DigitalTwin />;
      case 'predictions': return <Predictions />;
      case 'analytics': return <Analytics />;
      case 'flight-sim': return <FlightSimPage />;
      case 'ai-copilot': return <AICopilotPage />;
      case 'fleet': return <FleetPage />;
      case 'maintenance': return <Maintenance />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  if (showBoot) return <BootScreen onComplete={handleBootComplete} />;

  if (currentPage === 'landing') return <Landing onEnter={() => navigate('dashboard')} />;

  return (
    <div className="min-h-screen bg-space-black">
      {/* Mobile nav toggle */}
      <button
        onClick={() => setNavOpen(!navOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center"
      >
        {navOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
      </button>

      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* Sidebar Navigation */}
      <Navigation
        items={navItems}
        currentPage={currentPage}
        onNavigate={navigate}
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <AnimatePresence mode="wait">
          <div key={currentPage}>
            {renderPage()}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
