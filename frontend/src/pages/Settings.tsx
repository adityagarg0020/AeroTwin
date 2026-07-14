import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { Volume2, VolumeX, Monitor, Sun } from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const [sound, setSound] = useState(false);
  const [theme, setTheme] = useState<'space' | 'light'>('space');

  const applyTheme = (t: 'space' | 'light') => {
    setTheme(t);
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    document.body.style.background = t === 'space' ? '#020617' : '#f1f5f9';
    document.body.style.color = t === 'space' ? '#e2e8f0' : '#0f172a';
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-4" style={{ background: 'transparent' }}>
        <h1 className="text-lg font-bold font-orbitron tracking-wider mb-6 text-gradient-blue">Settings</h1>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <div className="glass p-5 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4">Display</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono-jb">Theme</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant={theme === 'space' ? 'primary' : 'ghost'} onClick={() => applyTheme('space')}>
                      <Monitor size={14} /> Space
                    </Button>
                    <Button size="sm" variant={theme === 'light' ? 'primary' : 'ghost'} onClick={() => applyTheme('light')}>
                      <Sun size={14} /> Light
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono-jb">Sound</span>
                  <Button size="sm" variant="ghost" onClick={() => setSound(!sound)}>
                    {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    {sound ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="glass p-5 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4">About</h2>
              <div className="space-y-2 text-xs text-gray-400 font-mono-jb">
                <p><span className="text-primary">AeroTwin AI</span> <span className="text-gray-600">v1.0.0</span></p>
                <p className="text-gray-500">Physics-Informed Digital Twin for Four-Stage Turbojet Health Monitoring</p>
                <p className="text-gray-600">Built for <span className="text-accent">IIT Indore × HAL Hackathon</span></p>
                <div className="pt-3 mt-3 border-t border-white/5">
                  <p className="text-[10px] text-gray-600">&copy; 2026 AeroTwin AI. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
