import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function CodeBlock({ language, codeString, theme }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`rounded-lg overflow-hidden my-6 shadow-sm font-sans ${theme === 'dark' ? 'bg-[#0d0d0d]' : 'bg-[#1e1e1e]'}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#2f2f2f] text-white/70 text-xs">
        <span className="capitalize">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <SyntaxHighlighter
        children={codeString}
        style={vs2015}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
        className="text-[13px] !bg-transparent font-mono"
      />
    </div>
  )
}
