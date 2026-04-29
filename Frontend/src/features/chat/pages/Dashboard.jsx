import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import useChat from "../hook/useChat.js";
import useAuth from "../../auth/hook/useAuth.js";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChatId } from '../state/chat.slice';

import Sidebar from '../component/Sidebar';
import Header from '../component/Header';
import EmptyState from '../component/EmptyState';
import MessageInput from '../component/MessageInput';
import ChatMessage from '../component/ChatMessage';
import { useNavigate } from 'react-router';

function Dashboard() {
  const { handleChat, handleGetMyChats, handleGetMessages, handleCreateProject, handleSetCurrentProject } = useChat();
  const { handleGetMyProfile, handleLogout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { chats = {}, projects = {}, currentProjectId = null, currentChatId = null, isLoading = false } = useSelector(state => state.chat || {});
  const { user } = useSelector(state => state.auth || {});
  
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [fontSizeScale, setFontSizeScale] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const historyList = Object.values(chats).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  const filteredHistory = historyList.filter(chat => 
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentMessages = currentChatId && chats[currentChatId] ? chats[currentChatId].messages : [];

  const increaseFontSize = () => setFontSizeScale(prev => Math.min(prev + 0.1, 1.5));
  const decreaseFontSize = () => setFontSizeScale(prev => Math.max(prev - 0.1, 0.8));

  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    handleGetMyProfile();
    handleGetMyChats();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    const currentInput = input;
    const currentFile = selectedFile;
    setInput('');
    setSelectedFile(null);
    try {
      await handleChat({ message: currentInput, chatId: currentChatId });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const startNewChat = () => {
    dispatch(setCurrentChatId(null));
    setSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen items-center justify-center transition-colors duration-300 ${theme === 'dark' ? 'bg-[#111]' : 'bg-[#e5e5e5]'}`}>
      <div className={`flex w-full h-full shadow-2xl overflow-hidden relative ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'} font-sans`} style={{ fontSize: `${16 * fontSizeScale}px` }}>

        <Sidebar 
          theme={theme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredHistory={filteredHistory}
          currentChatId={currentChatId}
          handleGetMessages={handleGetMessages}
          startNewChat={startNewChat}
          handleLogout={handleLogout}
          handleCreateProject={handleCreateProject}
          handleSetCurrentProject={handleSetCurrentProject}
          projects={projects}
          currentProjectId={currentProjectId}
          user={user}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-w-0 z-10 w-full overflow-hidden">
          
          <Header 
            theme={theme}
            setTheme={setTheme}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            decreaseFontSize={decreaseFontSize}
            increaseFontSize={increaseFontSize}
            logout ={
              handleLogout
            }
          />

          <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-hidden">
            <div className={`flex-1 overflow-y-auto custom-scrollbar w-full border-2 rounded-[2.5rem] ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10' : 'bg-[#fcfcfc] border-slate-300'}`}>
              <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 pb-32">
                
                {currentMessages.length === 0 && <EmptyState theme={theme} user={user} />}

                {currentMessages.map((msg, idx) => (
                  <ChatMessage key={idx} msg={msg} idx={idx} theme={theme} />
                ))}

                {isLoading && (
                  <div className="flex justify-start px-4">
                    <div className="flex gap-4 items-start">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 ${theme === 'dark' ? 'bg-white/10 text-white/40' : 'bg-slate-200 text-slate-400'}`}>
                        <Zap className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className={`border px-6 py-4 rounded-2xl flex gap-3 items-center text-sm ${theme === 'dark' ? 'bg-[#141414] border-white/5 text-white/60' : 'bg-white border-slate-200 text-slate-600'}`}>
                        <span className="font-medium tracking-wide">Processing response</span>
                        <span className="flex gap-1">
                          <span className={`w-1 h-1 rounded-full animate-bounce bg-orange-500`} style={{ animationDelay: '0ms' }}></span>
                          <span className={`w-1 h-1 rounded-full animate-bounce bg-orange-500`} style={{ animationDelay: '150ms' }}></span>
                          <span className={`w-1 h-1 rounded-full animate-bounce bg-orange-500`} style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} className="h-4" />
              </div>
            </div>
          </div>

          <MessageInput 
            theme={theme}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            user={user}
          />
        </main>
      </div>
    </div>
  )
}

export default Dashboard;
