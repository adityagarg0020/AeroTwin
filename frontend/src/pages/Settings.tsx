import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { Button } from '../components/ui/Button';
import { useEngineStore } from '../store/engineStore';
import { Volume2, VolumeX, Monitor, Sun, Music, Mic, MessageSquare, Wifi, Cpu } from 'lucide-react';

export function Settings() {
  const { soundEnabled, setSoundEnabled } = useEngineStore();

  const applyTheme = (t: 'space' | 'light') => {
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    document.body.style.background = t === 'space' ? '#020617' : '#f1f5f9';
    document.body.style.color = t === 'space' ? '#e2e8f0' : '#0f172a';
  };

  return (
    <PageTransition>
      <div className="min-h-screen p-4" style={{ background: 'transparent' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-orbitron text-xs font-bold">S</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">System Settings</h1>
            <p className="text-[10px] text-gray-500 font-mono-jb">Configure AeroTwin AI Preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass p-4 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4 flex items-center gap-2">
                <Monitor size={12} className="text-primary/70" /> Display
              </h2>
              <div className="space-y-3">
                <SettingRow label="Theme">
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={() => applyTheme('space')}>
                      <Monitor size={12} /> Space
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => applyTheme('light')}>
                      <Sun size={12} /> Light
                    </Button>
                  </div>
                </SettingRow>
                <SettingRow label="Animations">
                  <Button size="sm" variant="primary">Enabled</Button>
                </SettingRow>
              </div>
            </div>

            <div className="glass p-4 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4 flex items-center gap-2">
                <Music size={12} className="text-primary/70" /> Audio
              </h2>
              <div className="space-y-3">
                <SettingRow label="Sound Effects">
                  <Button size="sm" variant={soundEnabled ? 'primary' : 'ghost'} onClick={() => setSoundEnabled(!soundEnabled)}>
                    {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                    {soundEnabled ? 'On' : 'Off'}
                  </Button>
                </SettingRow>
                <SettingRow label="Engine Audio">
                  <Button size="sm" variant="ghost" disabled>Coming Soon</Button>
                </SettingRow>
                <SettingRow label="Voice Output">
                  <Button size="sm" variant="primary">
                    <Mic size={12} /> On
                  </Button>
                </SettingRow>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="glass p-4 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4 flex items-center gap-2">
                <MessageSquare size={12} className="text-primary/70" /> AI Copilot
              </h2>
              <div className="space-y-3">
                <SettingRow label="Auto-suggest">
                  <Button size="sm" variant="primary">Enabled</Button>
                </SettingRow>
                <SettingRow label="Voice Input">
                  <Button size="sm" variant="primary">
                    <Mic size={12} /> On
                  </Button>
                </SettingRow>
                <SettingRow label="Markdown">
                  <Button size="sm" variant="primary">Enabled</Button>
                </SettingRow>
              </div>
            </div>

            <div className="glass p-4 rounded-2xl relative">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4 flex items-center gap-2">
                <Wifi size={12} className="text-primary/70" /> Telemetry
              </h2>
              <div className="space-y-3">
                <SettingRow label="Auto-fetch">
                  <Button size="sm" variant="primary">3s interval</Button>
                </SettingRow>
                <SettingRow label="Demo Mode">
                  <Button size="sm" variant="ghost">Disabled</Button>
                </SettingRow>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="glass p-4 rounded-2xl relative h-full">
              <div className="hud-corner hud-corner-tl" />
              <div className="hud-corner hud-corner-br" />
              <h2 className="text-[10px] font-orbitron text-gray-500 tracking-wider uppercase mb-4 flex items-center gap-2">
                <Cpu size={12} className="text-primary/70" /> About
              </h2>
              <div className="space-y-3 text-[10px] font-mono-jb">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <p className="text-primary font-bold text-xs">AeroTwin AI</p>
                  <p className="text-gray-500 mt-0.5">v2.0.0 — Physics-Informed Aerospace Digital Twin</p>
                </div>
                <div className="space-y-1.5">
                  <InfoRow label="Framework" value="React 19 + Three.js + FastAPI" />
                  <InfoRow label="ML Engine" value="6× Random Forest (Scikit-Learn)" />
                  <InfoRow label="3D Renderer" value="React Three Fiber + Drei" />
                  <InfoRow label="State" value="Zustand v5" />
                  <InfoRow label="Styling" value="Tailwind CSS v4 + Framer Motion" />
                  <InfoRow label="Charts" value="Recharts v3" />
                  <InfoRow label="Dataset" value="Turbojet Engine (4-stage)" />
                  <InfoRow label="Features" value="21 (14 raw + 7 engineered)" />
                </div>
                <div className="pt-3 mt-3 border-t border-white/5 text-[9px] text-gray-600">
                  <p>Built for <span className="text-accent">IIT Indore × HAL Hackathon</span></p>
                  <p className="mt-1">&copy; 2026 AeroTwin AI. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-mono-jb text-gray-400">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded bg-white/[0.02]">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-300 text-right">{value}</span>
    </div>
  );
}
