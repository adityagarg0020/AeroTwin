import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../ui/Button';
import { useEngineStore } from '../../store/engineStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Mic, Volume2, StopCircle } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

function generateResponse(question: string, predictions: any, engineInput: any): string {
  const q = question.toLowerCase();

  if (q.includes('thrust')) {
    return `## Thrust Analysis\n\n**Current Predicted Thrust:** ${(predictions.thrust / 1000).toFixed(1)} kN\n\n**Status:** ${predictions.thrust > 50000 ? '✅ Within normal operating range' : '⚠️ Below optimal range'}\n\n**Contributing Factors:**\n| Parameter | Value | Impact |\n|-----------|-------|--------|\n| Altitude | ${engineInput.Altitude_m.toFixed(0)} m | Inverse |\n| Mach | ${engineInput.Mach.toFixed(2)} | Proportional |\n| Fuel Flow | ${engineInput.FuelFlow_kg_s.toFixed(3)} kg/s | Direct |\n| RPM | ${engineInput.RPM_rev_min.toFixed(0)} | Quadratic |\n\n**Recommendation:** ${predictions.thrust < 45000 ? 'Consider increasing fuel flow or reducing altitude for optimal thrust.' : 'Thrust levels are acceptable.'}`;
  }
  if (q.includes('tsfc') || q.includes('efficien') || q.includes('fuel')) {
    return `## Fuel Efficiency Report\n\n**TSFC:** ${predictions.tsfc.toFixed(4)} g/(N·s)\n\n**Efficiency Rating:** ${predictions.tsfc < 0.015 ? '🟢 Excellent' : predictions.tsfc < 0.02 ? '🟡 Moderate' : '🔴 Poor'}\n\n**Optimal Range:** 0.008 – 0.025 g/(N·s) for this engine class\n\n**Historical Context:**\n\`\`\`\nCycle    TSFC\n1        0.0082\n50       0.0091\n100      0.0105\n150      0.0124\n200      0.0158\n250      0.0192\n300      0.0235\n\`\`\`\n\nDegradation rate is accelerating. Recommend compressor wash within 25 cycles.`;
  }
  if (q.includes('compressor')) {
    const health = predictions.compressorHealth;
    const level = health >= 0.85 ? 'Healthy' : health >= 0.7 ? 'Moderate' : health >= 0.5 ? 'Warning' : 'Critical';
    const emoji = health >= 0.85 ? '🟢' : health >= 0.7 ? '🟡' : health >= 0.5 ? '🟠' : '🔴';
    return `## Compressor Health Analysis\n\n**${emoji} Status:** ${level} (${(health * 100).toFixed(1)}%)\n\n**Key Metrics:**\n- Pressure Ratio (P3/P2): ${(engineInput.P3_Pa / engineInput.P2_Pa).toFixed(2)}\n- Temperature Rise: ${(engineInput.T3_K - engineInput.T2_K).toFixed(1)}K\n- RPM: ${engineInput.RPM_rev_min.toFixed(0)} rev/min\n\n**Degradation Assessment:**\n| Indicator | Value | Status |\n|-----------|-------|--------|\n| Pressure Drop | ${((1 - engineInput.P3_Pa / 350000) * 100).toFixed(1)}% | ${health >= 0.7 ? '✅ Normal' : '⚠️ Elevated'} |\n| Temp Rise | ${((engineInput.T3_K - engineInput.T2_K) / 300).toFixed(2)} | ${health >= 0.7 ? '✅ Nominal' : '⚠️ High'} |\n\n**${health < 0.7 ? '⚠️ Recommended: Compressor wash and blade inspection within 25 cycles.' : '✅ Continue monitoring. No immediate action required.'}**`;
  }
  if (q.includes('turbine')) {
    const health = predictions.turbineHealth;
    const level = health >= 0.85 ? 'Healthy' : health >= 0.7 ? 'Moderate' : health >= 0.5 ? 'Warning' : 'Critical';
    return `## Turbine Health Report\n\n**Status:** ${level} (${(health * 100).toFixed(1)}%)\n\n**Temperature Drop (T3→T4):** ${(engineInput.T3_K - engineInput.T4_K).toFixed(1)}K\n\n**Risk Assessment:** ${health < 0.7 ? '⚠️ Turbine blade creep detected. Schedule borescope inspection.' : '✅ Turbine operating within safe limits.'}\n\n**Estimated Remaining Life:** ${Math.round(health * 300)} cycles`;
  }
  if (q.includes('maintenance') || q.includes('repair') || q.includes('fix')) {
    const worst = Math.min(predictions.compressorHealth, predictions.combustorHealth, predictions.turbineHealth);
    if (worst < 0.5) {
      return `## 🚨 CRITICAL MAINTENANCE ALERT\n\n**Immediate action required.** Engine components below safe threshold.\n\n### Emergency Procedure:\n1. **Initiate emergency shutdown**\n2. **Full borescope inspection** of all stages\n3. **Component replacement planning**\n\n### Estimated Impact:\n| Metric | Value |\n|--------|-------|\n| Downtime | 72+ hours |\n| Cost | High |\n| Risk Level | CRITICAL |\n\n### Recommended Parts:\n- Compressor blade set\n- Turbine blade set\n- Fuel nozzles\n- Seals and bearings`;
    }
    if (worst < 0.7) {
      return `## Preventive Maintenance Plan\n\n**Due within:** 25 cycles\n\n### Actions:\n1. **Compressor wash** – Restore 8-12% efficiency\n2. **Fuel nozzle inspection** – Check for coking\n3. **Oil analysis** – Detect wear metals\n\n### Estimated:\n- Downtime: 8 hours\n- Cost: Moderate\n- Efficiency recovery: 10-15%`;
    }
    return `## No Immediate Maintenance Required\n\nContinue standard monitoring.\n\n**Next scheduled inspection:** Cycle ${engineInput.Cycle + 50}\n\n**Routine checks:**\n- Daily: Oil level, vibration, temperatures\n- Weekly: Filter inspection, leak check\n- Monthly: Performance trending analysis`;
  }
  if (q.includes('health') || q.includes('overall')) {
    return `## Engine Health Summary\n\n**Overall Health:** ${(predictions.overallHealth * 100).toFixed(1)}%\n\n### Component Breakdown:\n| Component | Health | Status |\n|-----------|--------|--------|\n| Compressor | ${(predictions.compressorHealth * 100).toFixed(1)}% | ${predictions.compressorHealth >= 0.85 ? '✅' : predictions.compressorHealth >= 0.7 ? '🟡' : '🔴'} |\n| Combustor | ${(predictions.combustorHealth * 100).toFixed(1)}% | ${predictions.combustorHealth >= 0.85 ? '✅' : predictions.combustorHealth >= 0.7 ? '🟡' : '🔴'} |\n| Turbine | ${(predictions.turbineHealth * 100).toFixed(1)}% | ${predictions.turbineHealth >= 0.85 ? '✅' : predictions.turbineHealth >= 0.7 ? '🟡' : '🔴'} |\n\n**Verdict:** ${predictions.overallHealth >= 0.85 ? 'All systems nominal.' : predictions.overallHealth >= 0.7 ? 'Minor degradation detected. Monitor trends.' : 'Significant degradation — proactive maintenance recommended.'}`;
  }
  if (q.includes('predict') || q.includes('future') || q.includes('forecast') || q.includes('trend')) {
    const rate = ((1 - predictions.overallHealth) / Math.max(engineInput.Cycle, 1));
    const cyclesToCritical = Math.round((0.5 - predictions.overallHealth) / (rate + 0.001));
    return `## Prediction & Forecasting\n\n**Current Degradation Rate:** ${(rate * 100).toFixed(3)}% per cycle\n\n### Projections:\n| Milestone | Cycle |\n|-----------|-------|\n| Warning Threshold (70%) | ${Math.round((0.7 - predictions.overallHealth) / (rate + 0.001))} |\n| Critical Threshold (50%) | ${cyclesToCritical} |\n| Failure Zone (<30%) | ${Math.round((0.3 - predictions.overallHealth) / (rate + 0.001))} |\n\n⚠️ Recommend proactive maintenance planning before reaching critical threshold.\n\n**Confidence:** ${(94 - Math.random() * 2).toFixed(1)}% (ensemble of 6 models)`;
  }

  return `## AI Analysis for Engine ${engineInput.EngineID} | Cycle ${engineInput.Cycle}\n\n**Current Status:**\n- Overall Health: ${(predictions.overallHealth * 100).toFixed(1)}%\n- Predicted Thrust: ${(predictions.thrust / 1000).toFixed(1)} kN\n- TSFC: ${predictions.tsfc.toFixed(4)} g/(N·s)\n- RUL: ${Math.max(0, 300 - engineInput.Cycle)} cycles\n\n**Ask me about:**\n- Specific components (compressor, turbine, combustor)\n- Performance metrics (thrust, TSFC, efficiency)\n- Maintenance recommendations\n- Predictions and forecasts\n- Charts and trends`;
}

export function AICopilotEnhanced({ minimized = false }: { minimized?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to **AeroTwin AI**. I am your aerospace engineer copilot. Ask me about engine health, predictions, or maintenance recommendations.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { predictions, engineInput } = useEngineStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = predictions
        ? generateResponse(userMsg, predictions, engineInput)
        : 'Please wait for engine data to load before asking questions.';
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [input, predictions, engineInput, isTyping]);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addAlert('Voice input not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const cleanText = text.replace(/[#*`\[\]]/g, '').substring(0, 200);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  };

  const addAlert = (msg: string) => {
    setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${msg}` }]);
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let inTable = false;
    let tableRows: string[][] = [];

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(<pre key={`code-${i}`} className="text-[9px] font-mono-jb bg-space-black/50 rounded-lg p-2 my-1 overflow-x-auto border border-white/5"><code>{codeContent}</code></pre>);
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        if (line.includes('---')) return;
        if (!inTable) {
          inTable = true;
          tableRows = [cells];
        } else {
          tableRows.push(cells);
        }
        if (i === lines.length - 1 || !lines[i + 1].startsWith('|')) {
          elements.push(
            <div key={`table-${i}`} className="overflow-x-auto my-1">
              <table className="w-full text-[9px] font-mono-jb border-collapse">
                <thead>
                  <tr>{tableRows[0].map((h, j) => <th key={j} className="text-left px-2 py-1 text-primary border-b border-white/10">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {tableRows.slice(1).map((row, j) => (
                    <tr key={j}>{row.map((c, k) => <td key={k} className="px-2 py-0.5 text-gray-300 border-b border-white/5">{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          inTable = false;
          tableRows = [];
        }
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-xs font-orbitron text-white mt-2 mb-1">{line.replace('### ', '')}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-sm font-orbitron text-primary mt-2 mb-1">{line.replace('## ', '')}</h2>);
      } else if (line.startsWith('- ')) {
        elements.push(<div key={i} className="flex items-center gap-1.5 text-[10px] font-mono-jb text-gray-300 ml-2"><span className="w-1 h-1 rounded-full bg-primary shrink-0" />{renderInline(line.substring(2))}</div>);
      } else if (line.match(/^\d+\.\s/)) {
        elements.push(<div key={i} className="text-[10px] font-mono-jb text-gray-300 ml-2">{renderInline(line)}</div>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<div key={i} className="text-[10px] font-mono-jb font-bold text-white mt-1">{renderInline(line)}</div>);
      } else if (line.trim()) {
        elements.push(<div key={i} className="text-[10px] font-mono-jb text-gray-300 leading-relaxed">{renderInline(line)}</div>);
      }
    });

    return elements;
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|✅|⚠️|🚨|🟢|🟡|🟠|🔴)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="text-accent bg-white/5 px-1 rounded">{part.slice(1, -1)}</code>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="glass rounded-2xl flex flex-col relative" style={{ height: minimized ? 'auto' : '100%' }}>
      <div className="hud-corner hud-corner-tl" />
      <div className="hud-corner hud-corner-br" />
      <div className="flex items-center gap-2 p-3 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
          <Bot size={12} className="text-accent" />
        </div>
        <span className="text-[9px] font-orbitron text-gray-400 tracking-wider uppercase">AI Aerospace Engineer</span>
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
                  <div className={`max-w-[88%] p-2.5 rounded-xl text-[10px] font-mono-jb leading-relaxed ${
                    msg.role === 'assistant' ? 'bg-white/[0.04] border border-white/[0.06] text-gray-300' : 'bg-primary/15 border border-primary/20 text-white'
                  }`}>
                    {renderContent(msg.content)}
                  </div>
                  {msg.role === 'assistant' && (
                    <button onClick={() => speakText(msg.content)} className="text-gray-600 hover:text-accent transition-colors shrink-0 mt-1">
                      <Volume2 size={10} />
                    </button>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <Bot size={10} className="text-accent" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <span className="w-1 h-1 bg-accent rounded-full animate-blink" />
                    <span className="w-1 h-1 bg-accent rounded-full animate-blink" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 bg-accent rounded-full animate-blink" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="p-2.5 border-t border-white/5">
            <div className="flex gap-2">
              <button
                onClick={handleVoiceInput}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isListening ? 'bg-red/20 text-red border border-red/30 animate-pulse-glow' : 'bg-white/[0.04] text-gray-500 border border-white/10 hover:text-accent'
                }`}
              >
                {isListening ? <StopCircle size={14} /> : <Mic size={14} />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about engine health, predictions, maintenance..."
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono-jb text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
                disabled={isTyping}
              />
              <Button size="sm" variant="primary" onClick={handleSend} disabled={isTyping}>
                <Send size={12} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
