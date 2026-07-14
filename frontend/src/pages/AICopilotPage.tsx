import { PageTransition } from '../components/layout/PageTransition';
import { AICopilotEnhanced } from '../components/ai/AICopilotEnhanced';
import { RootCauseAnalysis } from '../components/ai/RootCauseAnalysis';
import { ShapExplainer } from '../components/dashboard/ShapExplainer';

export function AICopilotPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="text-accent font-orbitron text-xs font-bold">AI</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">AI Aerospace Engineer</h1>
            <p className="text-[10px] text-gray-500 font-mono-jb">Advanced AI Copilot with explainable predictions</p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7">
            <div style={{ height: 'calc(100vh - 160px)' }}>
              <AICopilotEnhanced />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <RootCauseAnalysis />
            <ShapExplainer />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
