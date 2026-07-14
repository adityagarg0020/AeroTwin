import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { ArrowDown, Rocket, Activity, Zap, BarChart3, Sparkles, Cpu, Shield, Globe, Layers, GitCompare, BrainCircuit } from 'lucide-react';

export function Landing({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-space-black text-white overflow-hidden">
      {/* Cinematic space gradient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-space-black via-space-black/95 to-[#030712] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_60%)] pointer-events-none" />

      {/* Animated grid */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Floating orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-purple-glow/5 rounded-full blur-[100px] animate-float pointer-events-none" />
      <div className="fixed top-2/3 left-2/3 w-64 h-64 bg-accent/3 rounded-full blur-[80px] animate-nebula pointer-events-none" />

      {/* Hero Section */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-light rounded-full border border-primary/10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-breathe" />
                <span className="text-[10px] font-orbitron text-gray-400 tracking-widest uppercase">
                  IIT Indore &times; HAL | Next-Gen Aerospace
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4"
            >
              <span className="font-orbitron text-gradient tracking-wider">AeroTwin AI</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-green animate-blink" />
                <span className="text-[10px] font-orbitron text-green tracking-widest uppercase">System Nominal</span>
              </div>
              <span className="text-gray-700">|</span>
              <span className="text-[10px] font-mono-jb text-gray-600">DIGITAL TWIN v2.0</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl font-light text-gray-300 mb-2 font-orbitron tracking-wider"
            >
              Physics-Informed Aerospace Digital Twin
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-sm md:text-base text-gray-400 mb-8 max-w-2xl mx-auto font-mono-jb"
            >
              Real-Time Six-Model AI Ensemble &bull; Interactive 3D Engine Twin &bull; Explainable Predictions &bull; Predictive Maintenance
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-[10px] text-gray-600 mb-10 font-orbitron tracking-[0.3em] uppercase"
            >
              Monitor &bull; Predict &bull; Analyze &bull; Optimize &bull; Maintain
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex items-center justify-center gap-4"
            >
              <Button size="lg" variant="primary" glow onClick={onEnter} className="text-base px-10 py-4">
                <Rocket size={20} />
                Launch Mission Control
              </Button>
              <Button size="lg" variant="ghost" glow={false} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
            >
              <StatBlock label="Prediction Accuracy" value={99.3} suffix="%" />
              <StatBlock label="Inference Time" value={85} suffix="ms" />
              <StatBlock label="AI Models" value={6} suffix="" decimals={0} />
              <StatBlock label="Engine Cycles" value={300} suffix="+" decimals={0} />
            </motion.div>
          </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown size={20} className="text-primary/50" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="text-[10px] font-orbitron text-gray-600 tracking-[0.2em] uppercase">//</span>
            <h2 className="text-xl md:text-2xl font-orbitron font-bold text-center text-gradient tracking-wider">
              Aerospace-Grade Intelligence
            </h2>
            <span className="text-[10px] font-orbitron text-gray-600 tracking-[0.2em] uppercase">//</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass p-5 rounded-2xl hover-lift relative cinematic-glow"
              >
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-br" />
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="text-xs font-orbitron font-bold text-white mb-1.5 tracking-wider">{f.title}</h3>
                <p className="text-[10px] font-mono-jb text-gray-400 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Architecture Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="text-[10px] font-orbitron text-gray-600 tracking-[0.2em] uppercase">//</span>
            <h2 className="text-xl md:text-2xl font-orbitron font-bold text-center text-gradient tracking-wider">
              System Architecture
            </h2>
            <span className="text-[10px] font-orbitron text-gray-600 tracking-[0.2em] uppercase">//</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { title: 'Frontend', desc: 'React 19 + Three.js + Framer Motion + Tailwind v4', icon: <Globe size={18} className="text-primary" /> },
              { title: '3D Engine', desc: 'React Three Fiber + Drei + Custom Shaders', icon: <Layers size={18} className="text-accent" /> },
              { title: 'ML Backend', desc: 'FastAPI + Scikit-Learn + 6 Model Ensemble', icon: <Cpu size={18} className="text-purple-glow" /> },
              { title: 'State', desc: 'Zustand + React Query + Real-time Telemetry', icon: <BrainCircuit size={18} className="text-green" /> },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-4 rounded-2xl text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-2">
                  {item.icon}
                </div>
                <h3 className="text-[10px] font-orbitron font-semibold text-white tracking-wider">{item.title}</h3>
                <p className="text-[9px] font-mono-jb text-gray-500 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatBlock({ label, value, suffix = '', decimals = 1 }: { label: string; value: number; suffix?: string; decimals?: number }) {
  return (
    <div className="glass-light p-3 rounded-2xl text-center relative border border-white/5">
      <div className="text-xl md:text-2xl font-black font-mono-jb text-primary tabular-nums">
        <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
      </div>
      <div className="text-[9px] font-orbitron text-gray-500 tracking-wider mt-1 uppercase">{label}</div>
    </div>
  );
}

const features = [
  {
    title: 'Interactive 3D Digital Twin',
    description: 'Full four-stage turbojet engine with selectable components, exploded view, X-ray mode, heatmap overlay, and real-time health visualization.',
    icon: <Rocket size={18} className="text-primary" />
  },
  {
    title: 'Six AI Model Ensemble',
    description: 'Random Forest models predicting compressor, combustor, turbine, overall health, thrust, and TSFC with 94-98% accuracy.',
    icon: <Activity size={18} className="text-primary" />
  },
  {
    title: 'Advanced Flight Simulation',
    description: 'Real-time throttle, altitude, Mach, RPM, fuel flow adjustments with instant AI predictions and 3D engine response.',
    icon: <Zap size={18} className="text-primary" />
  },
  {
    title: 'SHAP Explainable AI',
    description: 'Feature importance analysis, waterfall charts, contribution graphs, and confidence scoring for every prediction.',
    icon: <BarChart3 size={18} className="text-primary" />
  },
  {
    title: 'Mission Replay System',
    description: 'Play through takeoff, climb, cruise, combat, descent, and landing phases with synchronized telemetry and predictions.',
    icon: <Sparkles size={18} className="text-primary" />
  },
  {
    title: 'AI Aerospace Engineer',
    description: 'Advanced natural language interface with markdown, tables, code blocks, voice input/output, and streaming responses.',
    icon: <BrainCircuit size={18} className="text-primary" />
  },
  {
    title: 'Predictive Maintenance',
    description: 'AI-generated maintenance schedules with urgency, downtime estimates, cost analysis, parts recommendations, and RUL forecasts.',
    icon: <Shield size={18} className="text-primary" />
  },
  {
    title: 'Model Comparison',
    description: 'Comprehensive model metrics: accuracy, precision, recall, F1, MAE, RMSE, inference time, and training performance.',
    icon: <GitCompare size={18} className="text-primary" />
  },
  {
    title: 'Sound Synthesis System',
    description: 'Procedurally generated engine sounds: startup, idle, throttle, alerts, and shutdown — no audio files needed.',
    icon: <Cpu size={18} className="text-primary" />
  }
];

