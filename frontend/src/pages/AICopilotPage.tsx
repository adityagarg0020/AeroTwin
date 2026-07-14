import { PageTransition } from '../components/layout/PageTransition';
import { AICopilot } from '../components/ai/AICopilot';
import { RootCauseAnalysis } from '../components/ai/RootCauseAnalysis';


export function AICopilotPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-space-black text-white p-4">
        <h1 className="text-lg font-bold text-gradient-blue mb-4">AI Copilot</h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7">
            <div style={{ height: 'calc(100vh - 160px)' }}>
              <AICopilot />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 space-y-4">
            <RootCauseAnalysis />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
