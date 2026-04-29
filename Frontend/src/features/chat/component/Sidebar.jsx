import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Plus,
  MessageSquare, 
  Folder,
  PanelLeftClose,
  Bot,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ 
  theme, 
  sidebarOpen, 
  setSidebarOpen, 
  searchQuery, 
  setSearchQuery, 
  filteredHistory, 
  currentChatId, 
  handleGetMessages,
  startNewChat,
  handleLogout,
  handleCreateProject,
  handleSetCurrentProject,
  projects,
  currentProjectId,
  user
}) {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const onCreateProject = (e) => {
    if (e.key === 'Enter' && newProjectName.trim()) {
      handleCreateProject(newProjectName);
      setNewProjectName("");
      setIsCreatingProject(false);
    }
  };

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="md:hidden absolute inset-0 bg-black/50 z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className={`absolute md:relative h-full flex flex-col ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/5' : 'bg-[#f9f9f9] border-slate-200 '} border-r overflow-hidden z-30 shrink-0`}
      >
        <div className="p-4 flex flex-col h-full w-[280px]">
          {/* Top Icons */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className={`p-1.5 rounded-md border transition-colors ${theme === 'dark' ? 'border-orange-500/50 text-orange-500 hover:bg-orange-500/10' : 'border-orange-400 text-orange-500 hover:bg-orange-50'}`}
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-2 mb-6">
            <button 
              onClick={startNewChat}
              className={`w-full py-2 px-4 rounded-xl border-2 font-medium text-sm transition-all ${theme === 'dark' ? 'border-white/20 text-white hover:bg-white/5' : 'border-slate-300 text-slate-800 hover:bg-slate-100'}`}
            >
              New chat {currentProjectId && <span className="text-orange-500 ml-1 opacity-80 text-[10px]">(in project)</span>}
            </button>
          </div>

          {/* Search */}
          <div className="px-2 mb-6 relative">
            <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 opacity-50" />
            <input 
              type="text" 
              placeholder="Search chat" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-1.5 bg-transparent text-sm outline-none transition-all border-b ${theme === 'dark' ? 'text-white border-white/10 focus:border-orange-500' : 'text-slate-800 border-slate-200 focus:border-orange-500'} placeholder:text-current placeholder:opacity-50`} 
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
            {/* Projects */}
            <div className="mb-6">
              <h3 className={`text-sm font-medium mb-2 flex items-center justify-between ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>
                Projects
              </h3>
              
              {isCreatingProject ? (
                <input 
                  autoFocus
                  placeholder="Project name..."
                  className={`w-full px-3 py-2 rounded-lg text-sm bg-transparent border ${theme === 'dark' ? 'border-white/20 text-white' : 'border-slate-300 text-slate-800'}`}
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  onKeyDown={onCreateProject}
                  onBlur={() => setIsCreatingProject(false)}
                />
              ) : (
                <button 
                  onClick={() => setIsCreatingProject(true)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-2 ${theme === 'dark' ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                >
                  <Plus className="w-4 h-4" /> New Project
                </button>
              )}

              <div className="space-y-1">
                {Object.values(projects).map(project => (
                  <div key={project.id} className="flex flex-col">
                    <button 
                      onClick={() => handleSetCurrentProject(currentProjectId === project.id ? null : project.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${currentProjectId === project.id ? (theme === 'dark' ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-50 text-orange-600') : (theme === 'dark' ? 'text-white/60 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-200/50')}`}
                    >
                      <Folder className={`w-4 h-4 shrink-0 transition-transform ${currentProjectId === project.id ? 'scale-110' : ''}`} />
                      <span className="truncate font-medium flex-1 text-left">{project.name}</span>
                    </button>

                    {/* Nested Chats */}
                    <AnimatePresence>
                      {currentProjectId === project.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden ml-4 pl-2 border-l border-orange-500/20 mt-1 space-y-0.5"
                        >
                          {filteredHistory
                            .filter(chat => chat.projectId === project.id)
                            .map(item => (
                              <button 
                                key={item.id}
                                onClick={() => handleGetMessages(item.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-3 ${currentChatId === item.id ? (theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900 font-medium') : (theme === 'dark' ? 'text-white/40 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-200/50')}`}
                              >
                                <MessageSquare className="w-3 h-3 opacity-50 shrink-0" />
                                <span className="truncate">{item.title}</span>
                              </button>
                            ))}
                          {filteredHistory.filter(chat => chat.projectId === project.id).length === 0 && (
                            <div className="px-3 py-2 text-[10px] opacity-30 italic">No chats in project</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Recents (Unassigned) */}
            <div>
              <h3 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>Recents</h3>
              <div className="space-y-0.5">
                  {filteredHistory
                    .filter(chat => !chat.projectId)
                    .map(item => (
                    <button 
                      key={item.id}
                      onClick={() => handleGetMessages(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${currentChatId === item.id ? (theme === 'dark' ? 'bg-white/10 text-white' : 'bg-slate-200/70 text-slate-900 font-medium') : (theme === 'dark' ? 'text-white/60 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-200/50')}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 opacity-50 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </button>
                  ))}
                  {filteredHistory.filter(chat => !chat.projectId).length === 0 && (
                    <div className="px-3 py-2 text-[10px] opacity-30 italic">No recent chats</div>
                  )}
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className={`mt-4 pt-4 border-t px-2 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.username || user.fullName || 'User'}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.username || user.fullName || 'User'}</span>
                    <span className={`text-xs truncate ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>{user.email || 'user@example.com'}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className={`w-full py-2 text-center rounded-lg text-sm font-medium transition-colors border ${theme === 'dark' ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-300 text-slate-800 hover:bg-slate-100'}`}>Log in</Link>
                <Link to="/register" className={`w-full py-2 text-center rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-white text-black hover:bg-white/90' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}
