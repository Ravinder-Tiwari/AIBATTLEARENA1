import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageCard from './MessageCard';
import CodeBlock from './CodeBlock';

export default function ChatMessage({ msg, idx, theme }) {
  let aiData = null;
  let isJson = false;

  if (msg.role === 'ai') {
    try {
      aiData = JSON.parse(msg.content);
      isJson = true;
    } catch (e) {
      aiData = { message: msg.content };
      isJson = false;
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="group w-full"
    >
      {msg.role === 'user' ? (
        <div className="flex justify-end mb-6 w-full">
          <div className={`px-6 py-3.5 rounded-3xl rounded-tr-sm max-w-[85%] shadow-xl ${theme === 'dark' ? 'bg-[#2f2f2f] text-white' : 'bg-slate-200 text-slate-900'}`}>
            <p className="whitespace-pre-wrap leading-relaxed font-bold text-base">{msg.content}</p>
          </div>
        </div>
      ) : (
        <div className="w-full mb-8">
          {isJson ? (
            <MessageCard data={aiData} theme={theme} />
          ) : (
            <div className="flex gap-4 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'}`}>
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              <div className={`prose prose-sm max-w-none w-full font-bold text-base ${theme === 'dark' ? 'prose-invert text-white' : 'prose-slate text-slate-900'}`}>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
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
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
