import { motion } from 'framer-motion';
import { Globe, Zap, FileText } from 'lucide-react';

export default function EmptyState({ theme, user }) {
  const displayName = user ? (user.username || user.fullName || 'User') : 'Guest';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center pt-20"
    >
      <h1 className={`text-5xl md:text-6xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500`}>
        Hello {displayName} 👋
      </h1>
      <h2 className={`text-4xl md:text-5xl font-bold tracking-tight mb-12 ${theme === 'dark' ? 'text-white/40' : 'text-slate-300'}`}>
        How can I help you today?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
        {[
          { icon: Globe, title: "What's Happen in 24 hours? 🌍", desc: "See what's been happening in the world over the last 24 hours" },
          { icon: Zap, title: "Stock market update 📈", desc: "See what's happening in the stock market in real time" },
          { icon: FileText, title: "Deep economic research 🧠", desc: "See research from experts that we have simplified" }
        ].map((item, i) => (
          <button key={i} className={`flex flex-col text-left p-6 rounded-[2rem] border transition-all group ${theme === 'dark' ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-white/5 hover:border-white/20' : 'bg-gradient-to-br from-orange-50 to-red-50 border-white shadow-sm hover:shadow-md'}`}>
            <div className={`p-3 rounded-xl mb-4 inline-flex shadow-sm ${theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-gradient-to-br from-orange-400 to-red-500 text-white'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={`text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>{item.title}</span>
            <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>{item.desc}</p>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
