import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

export default function SolutionPanel({ title, content, score, reasoning, icon, theme }) {
  const [displayedContent, setDisplayedContent] = useState('');

  useEffect(() => {
    if (!content) return;
    const lines = content.split('\n');
    let currentIdx = 0;
    setDisplayedContent('');

    const timer = setInterval(() => {
      if (currentIdx < lines.length) {
        setDisplayedContent(prev => prev === '' ? lines[currentIdx] : prev + '\n' + lines[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [content]);

  const getScoreColor = (sc) => {
    if (sc >= 9) return theme === 'dark' ? 'bg-white text-black border-white' : 'bg-orange-600 text-white border-orange-600';
    if (sc >= 7) return theme === 'dark' ? 'bg-white/10 text-white border-white/20' : 'bg-slate-100 text-slate-700 border-slate-200';
    return theme === 'dark' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200';
  };

  const isMathText = (text) => {
    if (!text || typeof text !== 'string') return false;
    const hasOperators = /[+\-*\/=<>^]/.test(text);
    const hasNumbers = /\d/.test(text);
    const isDollarEnclosed = /^\s*\$\$.*\$\$\s*$/.test(text) || /^\s*\$.*\$\s*$/.test(text);
    return isDollarEnclosed || (hasOperators && hasNumbers && text.length > 3);
  };

  return (
    <div className={`flex flex-col h-full transition-colors group/panel ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/50'}`}>
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h4 className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold border ${theme === 'dark' ? 'bg-white/5 text-white/40 border-white/5' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{icon}</span>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>{title}</span>
          </h4>
          <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${getScoreColor(score)}`}>
            {score} / 10
          </div>
        </div>
        
        <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert' : 'prose-slate'}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ children }) {
                const textContent = String(children);
                if (isMathText(textContent)) {
                  return (
                    <div className={`font-mono border rounded-2xl p-6 my-6 text-center text-xl shadow-inner ${theme === 'dark' ? 'text-white/90 bg-white/5 border-white/10' : 'text-orange-700 bg-orange-50 border-orange-100'}`}>
                      {textContent.replace(/\$/g, '')}
                    </div>
                  );
                }
                return <p className={`leading-relaxed font-light ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>{children}</p>;
              },
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const codeStr = String(children).replace(/\n$/, '');
                return !inline && match ? (
                  <CodeBlock language={match[1]} codeString={codeStr} theme={theme} />
                ) : (
                  <code className={`px-1.5 py-0.5 rounded font-mono text-xs ${theme === 'dark' ? 'bg-white/10 text-white/90' : 'bg-slate-100 text-slate-700'}`}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>
      </div>

      <div className={`p-8 mt-auto border-t ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
        <p className={`text-xs leading-relaxed font-light line-clamp-3 group-hover/panel:line-clamp-none transition-all ${theme === 'dark' ? 'text-white/30' : 'text-slate-400'}`}>
          <span className={`font-bold uppercase tracking-[0.2em] text-[9px] mr-2 ${theme === 'dark' ? 'text-white/20' : 'text-slate-300'}`}>Evaluation</span>
          {reasoning}
        </p>
      </div>
    </div>
  )
}
