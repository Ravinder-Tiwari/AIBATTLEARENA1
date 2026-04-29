import { Paperclip, Send, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MessageInput({
  theme,
  input,
  setInput,
  handleSend,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  handleFileChange,
  user
}) {
  return (
    <footer className="p-4 sm:p-6 pb-8">
      <div className="max-w-5xl mx-auto relative flex flex-col items-center">
        
        {!user ? (
          <div className={`w-full flex flex-col items-center justify-center p-6 rounded-3xl shadow-lg border transition-all ${theme === 'dark' ? 'bg-[#111] border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Log in to start chatting</h3>
            <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>You need an account to use the AI Arena.</p>
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors border ${theme === 'dark' ? 'hover:bg-white/10 text-white border-white/20' : 'hover:bg-slate-50 text-slate-700 border-slate-200'}`}
              >
                Log in
              </Link>
              <Link 
                to="/register"
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-black text-white hover:bg-slate-800'}`}
              >
                Sign up
              </Link>
            </div>
          </div>
        ) : (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />

            {selectedFile && (
              <div className="w-full mb-2">
                <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium items-center gap-2 border animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-white/5 text-white/80 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  <FileText className="w-3 h-3" />
                  {selectedFile.name}
                  <button onClick={() => setSelectedFile(null)} className="hover:opacity-70 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div className={`w-full flex items-center pl-4 pr-2 py-1.5 rounded-[1.5rem] shadow-lg border-2 transition-all ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/20 focus-within:border-orange-500' : 'bg-white border-slate-800 focus-within:border-orange-500'}`}>
              
              <button 
                onClick={() => fileInputRef.current.click()}
                className={`p-2 transition-colors shrink-0 ${theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-orange-500'}`}
                title="Upload file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                className={`flex-1 bg-transparent border-none focus:ring-0 px-3 py-3 outline-none font-bold text-sm tracking-widest ${theme === 'dark' ? 'text-white placeholder-white/20' : 'text-slate-800 placeholder-slate-400'}`}
                placeholder="ASK ANYTHING"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() && !selectedFile}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm disabled:opacity-50 ${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            
            <p className={`text-[10px] mt-4 font-bold text-center opacity-40 uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              CP ARENA can make mistakes. Check important info. See Cookie Preferences.
            </p>
          </>
        )}
      </div>
    </footer>
  )
}
