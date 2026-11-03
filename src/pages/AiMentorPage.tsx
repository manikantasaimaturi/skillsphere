import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  Bot,
  User,
  Copy,
  Check,
  BrainCircuit,
  MessageSquare,
  Flame,
  Terminal,
  Target
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const SAMPLE_PROMPTS = [
  'Explain Java inheritance with two practical examples',
  'Teach me DBMS normalization from beginner to advanced',
  'Give me 15 array coding questions with hints',
  'Create a 30-day DSA learning plan for FAANG',
  'Analyze my quiz results and identify weak concepts',
  'Prepare me for a TCS NQT Technical & HR interview'
];

export const AiMentorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | undefined>(undefined);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const convs = await api.getConversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConvId) {
        selectConversation(convs[0].id);
      } else if (convs.length === 0) {
        startNewConversation();
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
      startNewConversation();
    }
  };

  const selectConversation = async (convId: string) => {
    setActiveConvId(convId);
    try {
      const conv = await api.getConversation(convId);
      setMessages(conv.messages || []);
    } catch (err) {
      console.error('Failed to load conversation details:', err);
    }
  };

  const startNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    setActiveConvId(newId);
    setMessages([
      {
        id: 'msg-welcome',
        role: 'model',
        content: `👋 **Welcome to SkillSphere AI Mentor!**\n\nI am your personalized Computer Science professor, competitive coding coach, and technical interview advisor.\n\nI have access to your profile context:\n- **Student:** ${user?.name || 'Engineer'}\n- **College:** ${user?.college || 'B.Tech CSE'}\n- **Target Career:** ${user?.targetRole || 'Full Stack Software Engineer'}\n\nAsk me any concept explanation, code debugging, system design architecture, or choose a recommended prompt below to begin!`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || inputPrompt).trim();
    if (!promptText || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.chatWithAi(promptText, activeConvId);
      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-m`,
        role: 'model',
        content: res.reply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, modelMsg]);
      if (res.conversationId && (!activeConvId || activeConvId !== res.conversationId)) {
        setActiveConvId(res.conversationId);
      }
      await loadConversations();
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        content: `⚠️ Error contacting Gemini AI: ${err.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white font-heading">
              SkillSphere AI Mentor
            </h1>
            <p className="text-[10px] text-slate-400">
              Powered by Google Gemini 3.8 Flash • Context-Aware Personalized Tutoring
            </p>
          </div>
        </div>

        <button
          onClick={startNewConversation}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-cyan-400" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Chat Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col h-[calc(100vh-125px)] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="h-8 w-8 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 sm:p-5 rounded-2xl relative group ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                    : 'glass-card border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-normal prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
                  {msg.content}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400/80 pt-2 border-t border-slate-800/40">
                  <span className="font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-white"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-xl bg-cyan-600 flex items-center justify-center text-white shrink-0 font-bold text-xs shadow-md">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-xs sm:text-sm">
              <div className="h-8 w-8 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-cyan-400 shrink-0 animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="glass-card p-4 rounded-2xl border border-slate-800 text-slate-400 flex items-center gap-2">
                <div className="animate-spin h-3.5 w-3.5 border-2 border-cyan-400 border-t-transparent rounded-full" />
                <span>AI Mentor is thinking and formulating explanation...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length <= 2 && (
          <div className="mb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
              Recommended Topics for {user?.name || 'You'}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="relative">
          <textarea
            rows={2}
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI Mentor anything (e.g. explain Dijkstra's algorithm, debug Python snippet, TCS placement advice)..."
            className="w-full pl-4 pr-14 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-cyan-500 shadow-xl transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputPrompt.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white disabled:opacity-40 shadow-md transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
