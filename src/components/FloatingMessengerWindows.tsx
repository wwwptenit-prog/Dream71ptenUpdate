import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { X, Minus, Send, Video, ExternalLink, Sparkles, User, ShieldCheck, Paperclip, FileText } from 'lucide-react';

export const FloatingMessengerWindows: React.FC = () => {
  const {
    activeChatWindows,
    closeChatWindow,
    toggleMinimizeChatWindow,
    sendChatMessage,
    createGoogleMeetCall,
    currentUser
  } = useData();

  if (!activeChatWindows || activeChatWindows.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-20 z-50 flex items-end gap-3 max-w-[calc(100vw-80px)] overflow-x-auto pb-0 pointer-events-none">
      {activeChatWindows.map(win => (
        <SingleChatWindow
          key={win.id}
          win={win}
          onClose={() => closeChatWindow(win.id)}
          onMinimize={() => toggleMinimizeChatWindow(win.id)}
          onSend={(text) => sendChatMessage(win.id, text)}
          onCreateMeet={() => createGoogleMeetCall(win.id)}
          currentUserName={currentUser?.name || 'আমি'}
        />
      ))}
    </div>
  );
};

interface SingleChatWindowProps {
  win: {
    id: string;
    senderName: string;
    senderRole?: string;
    senderAvatar?: string;
    messages: Array<{
      id: string;
      senderName: string;
      senderAvatar?: string;
      isSelf: boolean;
      text: string;
      time: string;
      meetLink?: string;
    }>;
    minimized?: boolean;
  };
  onClose: () => void;
  onMinimize: () => void;
  onSend: (text: string) => void;
  onCreateMeet: () => void;
  currentUserName: string;
}

const SingleChatWindow: React.FC<SingleChatWindowProps> = ({
  win,
  onClose,
  onMinimize,
  onSend,
  onCreateMeet,
  currentUserName
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!win.minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [win.messages, win.minimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSend(inputText.trim());
    setInputText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = (file.size / 1024).toFixed(1);
    onSend(`📎 [ফাইল সংযুক্ত]: ${file.name} (${sizeKb} KB)`);
    if (e.target) e.target.value = '';
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return 'সেলার';
    const r = role.toLowerCase();
    if (r === 'seller') return 'সেলার';
    if (r === 'instructor' || r === 'teacher') return 'ইনস্ট্রাক্টর';
    if (r === 'both' || r === 'seller_instructor' || r === 'instructor_seller' || r === 'seller_and_instructor') return 'সেলার ও ইনস্ট্রাক্টর';
    if (r === 'customer' || r === 'buyer') return 'বায়ার';
    if (r === 'admin' || r === 'support') return 'এজেন্সী সাপোর্ট';
    if (r.includes('seller') && r.includes('instructor')) return 'সেলার ও ইনস্ট্রাক্টর';
    if (r.includes('seller')) return 'সেলার';
    if (r.includes('instructor')) return 'ইনস্ট্রাক্টর';
    return role;
  };

  if (win.minimized) {
    return (
      <div className="pointer-events-auto relative mb-3 group">
        <button
          onClick={onMinimize}
          className="w-13 h-13 rounded-full bg-[#142B4D] border-2 border-[#1DB954] shadow-2xl flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform"
          title={`${win.senderName} - চ্যাট উইন্ডো আবার খুলুন`}
        >
          <img
            src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={win.senderName}
            className="w-full h-full rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto w-80 sm:w-84 h-[420px] bg-[#0F172A] border border-slate-700/90 rounded-t-2xl shadow-2xl flex flex-col font-bengali overflow-hidden border-b-0 animate-in slide-in-from-bottom-5 duration-200">
      
      {/* HEADER: Sender Name, Role Badge, Google Meet Button, Minimize & Close */}
      <div className="bg-[#142B4D] border-b border-slate-700/80 px-3 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <img
              src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={win.senderName}
              className="w-8 h-8 rounded-full object-cover border border-[#1DB954]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{win.senderName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
            </h4>
            <span className="text-[10px] font-extrabold text-[#1DB954] block truncate">
              {getRoleLabel(win.senderRole)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onCreateMeet}
            className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-[#1DB954] border border-[#1DB954]/40 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="গুগুল মিট লাইভ কল লিংক জেনারেট করুন"
          >
            <Video className="w-3.5 h-3.5 text-[#1DB954]" />
            <span className="hidden sm:inline">মিট কল</span>
          </button>
          
          <button
            onClick={onMinimize}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="মিনিমাইজ করুন"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MESSAGES BODY */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-950/60 text-xs">
        {win.messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                m.isSelf
                  ? 'bg-[#1DB954] text-white font-medium rounded-br-none shadow-md'
                  : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none'
              }`}
            >
              <p>{m.text}</p>

              {/* GOOGLE MEET EMBEDDED BUTTON */}
              {m.meetLink && (
                <div className="mt-2.5 p-2 bg-slate-900/90 border border-emerald-500/60 rounded-xl text-white space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1DB954]">
                    <Video className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Google Meet ভিডিও মিটিং রুম</span>
                  </div>
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-[11px] rounded-lg flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition"
                  >
                    <span>🚀 জয়েন করুন গুগুল মিটে</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER INPUT FORM */}
      <form onSubmit={handleSend} className="p-2 bg-[#142B4D] border-t border-slate-700/80 flex items-center gap-1.5 shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-slate-300 hover:text-[#1DB954] hover:bg-slate-800 rounded-xl transition cursor-pointer"
          title="ফাইল, ফটো বা ডকুমেন্টস সংযুক্ত করে পাঠান"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="এখানে উত্তর বা বার্তা লিখুন..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#1DB954] font-bengali"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-[#1DB954] hover:bg-[#19a34a] disabled:opacity-40 text-white rounded-xl cursor-pointer transition font-bold"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
