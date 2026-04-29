import { Search, Zap } from 'lucide-react';
import SolutionPanel from './SolutionPanel';

export default function MessageCard({ data, theme }) {
  if (data?.error) {
    return (
      <div className={`w-full border rounded-2xl px-6 py-5 animate-in shake duration-500 ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-red-50 border-red-200 text-red-700'}`}>
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2">System Error</p>
        <p className="text-sm opacity-90">{data.message}</p>
      </div>
    )
  }

  const graphData = data?.result ?? data;

  const judge = graphData?.judge ?? graphData?.judge_recommendation;
  if (!judge) return null;

  return (
    <div className="w-full flex gap-4 items-start">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'}`}>
        <Zap className="w-5 h-5 text-orange-500" />
      </div>
      
      <div className="flex-1 space-y-6">
        <div className={`backdrop-blur-2xl border rounded-[2.5rem] overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-white border-slate-200'}`}>
          <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent' : 'border-slate-100 bg-slate-50/50'}`}>
            <h3 className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-5 flex items-center gap-2 ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
              <Search className="w-3.5 h-3.5 opacity-50" />
              Problem Analysis
            </h3>
            <div className={`leading-relaxed text-xl font-light ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>{graphData.problem}</div>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'}`}>
            <SolutionPanel
              title="LLM Solution A"
              content={graphData.solution_1}
              score={judge.solution_1_score}
              reasoning={judge.solution_1_reasoning}
              icon="A"
              theme={theme}
            />
            <SolutionPanel
              title="LLM Solution B"
              content={graphData.solution_2}
              score={judge.solution_2_score}
              reasoning={judge.solution_2_reasoning}
              icon="B"
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
