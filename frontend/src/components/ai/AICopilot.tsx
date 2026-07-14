import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { useEngineStore } from '../../store/engineStore';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

function generateResponse(question: string, predictions: any, engineInput: any): string {
  const q = question.toLowerCase();

  if (q.includes('thrust')) {
    return `Current predicted thrust is ${(predictions.thrust / 1000).toFixed(1)} kN. This is ${predictions.thrust > 50000 ? 'within normal operating range' : 'below optimal range'}. Factors affecting thrust include altitude (${engineInput.Altitude_m.toFixed(0)}m), Mach (${engineInput.Mach.toFixed(2)}), and fuel flow (${engineInput.FuelFlow_kg_s.toFixed(3)} kg/s).`;
  }
  if (q.includes('tsfc') || q.includes('efficien') || q.includes('fuel')) {
    return `TSFC (Thrust Specific Fuel Consumption) is ${predictions.tsfc.toFixed(4)} g/(N·s). This measures fuel efficiency — lower is better. Current value indicates ${predictions.tsfc < 0.02 ? 'good' : 'degraded'} efficiency. Optimal range is 0.008–0.025 g/(N·s) for this engine class.`;
  }
  if (q.includes('compressor')) {
    const health = predictions.compressorHealth;
    return `Compressor health is at ${(health * 100).toFixed(1)}% (${health >= 0.85 ? 'Healthy' : health >= 0.7 ? 'Moderate' : health >= 0.5 ? 'Warning' : 'Critical'}). Pressure ratio (P3/P2) is ${(engineInput.P3_Pa / engineInput.P2_Pa).toFixed(2)}. Recommended action: ${health < 0.7 ? 'Compressor wash and blade inspection' : 'Continue monitoring'}.`;
  }
  if (q.includes('turbine')) {
    const health = predictions.turbineHealth;
    return `Turbine health is at ${(health * 100).toFixed(1)}% (${health >= 0.85 ? 'Healthy' : health >= 0.7 ? 'Moderate' : health >= 0.5 ? 'Warning' : 'Critical'}). Temperature drop across turbine (T3-T4): ${(engineInput.T3_K - engineInput.T4_K).toFixed(1)}K. ${health < 0.7 ? 'Warning: Turbine blade inspection recommended.' : 'Turbine operating within limits.'}`;
  }
  if (q.includes('maintenance') || q.includes('repair') || q.includes('fix')) {
    const worst = Math.min(predictions.compressorHealth, predictions.combustorHealth, predictions.turbineHealth);
    if (worst < 0.5) return 'CRITICAL: Immediate maintenance required. Engine components below safe threshold. Recommend: 1) Emergency shutdown 2) Full borescope inspection 3) Component replacement planning. Estimated downtime: 72+ hours.';
    if (worst < 0.7) return 'Preventive maintenance recommended within 25 cycles. Priority actions: 1) Compressor wash 2) Fuel nozzle inspection 3) Oil analysis. Estimated downtime: 8 hours.';
    return 'No immediate maintenance required. Continue standard monitoring. Next scheduled inspection at cycle ' + (engineInput.Cycle + 50);
  }
  if (q.includes('health') || q.includes('overall')) {
    return `Overall engine health: ${(predictions.overallHealth * 100).toFixed(1)}%. Compressor: ${(predictions.compressorHealth * 100).toFixed(1)}% | Combustor: ${(predictions.combustorHealth * 100).toFixed(1)}% | Turbine: ${(predictions.turbineHealth * 100).toFixed(1)}%. Status: ${predictions.overallHealth >= 0.85 ? 'All systems nominal' : predictions.overallHealth >= 0.7 ? 'Minor degradation detected' : 'Significant degradation — action required'}.`;
  }
  if (q.includes('next') || q.includes('predict') || q.includes('future') || q.includes('forecast')) {
    return `Based on current degradation trend (${((1 - predictions.overallHealth) / (engineInput.Cycle || 1) * 100).toFixed(3)}% per cycle), engine health is projected to reach critical threshold (~50%) in approximately ${Math.round((0.5 - predictions.overallHealth) / ((1 - predictions.overallHealth) / (engineInput.Cycle || 1) + 0.001))} cycles. Recommend proactive maintenance planning.`;
  }
  if (q.includes('graph') || q.includes('chart') || q.includes('plot')) {
    return `The current chart shows engine health metrics across operational cycles. Key observation: ${predictions.compressorHealth < predictions.turbineHealth ? 'Compressor is degrading faster than turbine' : 'Turbine is degrading faster than compressor'}. The degradation rate is ${((1 - predictions.overallHealth) / Math.max(engineInput.Cycle, 1)).toFixed(4)} per cycle.`;
  }

  return `Based on current telemetry and AI analysis for Engine ${engineInput.EngineID} at Cycle ${engineInput.Cycle}: Overall health ${(predictions.overallHealth * 100).toFixed(1)}%, Thrust ${(predictions.thrust / 1000).toFixed(1)} kN, TSFC ${predictions.tsfc.toFixed(4)} g/(N·s). Ask me about any specific component, efficiency metrics, or maintenance recommendations.`;
}

export function AICopilot({ minimized = false }: { minimized?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to AeroTwin AI. I am your aerospace engineer copilot. Ask me about engine health, predictions, or maintenance recommendations.' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { predictions, engineInput } = useEngineStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    setTimeout(() => {
      const response = predictions
        ? generateResponse(userMsg, predictions, engineInput)
        : 'Please wait for engine data to load before asking questions.';
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);
  };

  return (
    <div className="glass rounded-2xl flex flex-col relative" style={{ height: minimized ? 'auto' : '400px' }}>
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center gap-2 p-3 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
          <Bot size={12} className="text-accent" />
        </div>
        <span className="text-[9px] font-orbitron text-gray-400 tracking-wider uppercase">AI Copilot</span>
        <Sparkles size={10} className="text-yellow ml-auto" />
      </div>

      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant' ? 'bg-accent/20' : 'bg-primary/20'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={10} className="text-accent" /> : <User size={10} className="text-primary" />}
                  </div>
                  <div className={`max-w-[85%] p-2 rounded-xl text-[10px] font-mono-jb leading-relaxed ${
                    msg.role === 'assistant' ? 'bg-white/[0.04] border border-white/[0.06] text-gray-300' : 'bg-primary/15 border border-primary/20 text-white'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="p-2.5 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about engine health..."
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono-jb text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
              />
              <Button size="sm" variant="primary" onClick={handleSend}>
                <Send size={12} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
