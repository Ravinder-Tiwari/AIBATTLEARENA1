import { Menu, Sun, Moon, Share2 } from 'lucide-react';

export default function Header({ 
  theme, 
  setTheme, 
  sidebarOpen, 
  setSidebarOpen, 
  decreaseFontSize, 
  increaseFontSize,
  logout 
}) {
  return (
    <div className="flex flex-col w-full">
      <header className="h-14 flex items-center justify-between px-6 shrink-0 w-full">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(true)}
              className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <h1 className={`text-sm font-bold tracking-[0.2em] uppercase italic ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            CP ARENA
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 border-r pr-2 sm:pr-4 border-slate-200 dark:border-white/10">
            <button onClick={decreaseFontSize} className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition text-[10px] font-bold`}>A-</button>
            <button onClick={increaseFontSize} className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition text-[10px] font-bold`}>A+</button>
          </div>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white/40 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border-2 text-xs font-bold transition-all ${theme === 'dark' ? 'border-white/20 text-white hover:bg-white/5' : 'border-slate-800 text-slate-800 hover:bg-slate-100'}`}>
            <Share2 className="w-3 h-3" /> Share
          </button>
        </div>
      </header>
      <div className={`h-[2px] w-full mx-auto max-w-[calc(100%-3rem)] ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-800'}`} />
    </div>
  )
}
