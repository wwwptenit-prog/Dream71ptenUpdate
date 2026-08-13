import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ChevronDown,
  Minimize2,
  Headset,
  ShieldAlert,
  CheckCircle2,
  CheckCheck,
  PhoneCall,
  Clock,
  Star,
  ExternalLink,
  BookOpen,
  Briefcase,
  Zap
} from 'lucide-react';
import { useData } from '../context/DataContext';

export interface InChatCardItem {
  id: string;
  type: 'course' | 'service' | 'gig';
  title: string;
  category?: string;
  priceText: string;
  originalPriceText?: string;
  rating?: number;
  thumbnail: string;
  badge?: string;
  description?: string;
  actionText: string;
  tabTarget: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  agentName?: string;
  agentRole?: string;
  agentAvatar?: string;
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  cards?: InChatCardItem[];
}

interface FloatingAiChatbotProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenCourseDetail?: (courseId: string) => void;
  openAuthModal?: () => void;
}

// Audio synthesizer for notification alert tone
const playNotificationTone = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
    osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);

    osc1.start();
    osc2.start(audioCtx.currentTime + 0.08);
    osc1.stop(audioCtx.currentTime + 0.35);
    osc2.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // Web audio fallback
  }
};

// Typewriter Text component for live streaming animation
const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  onComplete?: () => void;
}> = ({ text, speed = 5, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const step = Math.min(3, text.length - currentIndex);
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.slice(currentIndex, currentIndex + step));
        setCurrentIndex((prev) => prev + step);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-1.5 h-3.5 bg-[#1DB954] ml-0.5 animate-pulse rounded-full align-middle" />
      )}
    </span>
  );
};

export const FloatingAiChatbot: React.FC<FloatingAiChatbotProps> = ({
  activeTab = 'home',
  setActiveTab,
  onOpenCourseDetail,
  openAuthModal,
}) => {
  const { courses, services, gigs, currentUser, demoLogin, createDirectGigOrder, createCustomerProject } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Order Modal state for clicked Services / Gigs
  const [selectedModalCard, setSelectedModalCard] = useState<InChatCardItem | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderTxId, setOrderTxId] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Agent profiles for manual escalation
  const [agents] = useState({
    mentor: {
      id: 'mentor',
      name: 'কাজী সোহাগ',
      role: 'Senior Head Mentor & Trainer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isOnline: true,
    },
    support: {
      id: 'support',
      name: 'আরিফ হোসেন',
      role: 'Order Boss Support Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isOnline: true,
    },
  });

  // Dynamic suggestion chips
  const [suggestions, setSuggestions] = useState<string[]>([
    'অনলাইন প্রিমিয়াম কোর্সসমূহ',
    'PTENit সার্ভিস ও প্যাকেজ',
    'Order Boss মার্কেটপ্লেস গিগ',
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! আমি AI Assistant ✨\n\nPTENit এর প্রিমিয়াম কোর্স, আইটি সার্ভিস কিংবা Order Boss এর ফ্রিল্যান্স গিগ ও প্রজেক্ট অর্ডার সংক্রান্ত যেকোনো তথ্যের জন্য আপনাকে সাহায্য করতে আমি প্রস্তুত।',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: false,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  // Function to attach interactive product cards based on context
  const getContextCards = (userQuery: string, botText: string): InChatCardItem[] => {
    const combined = (userQuery + ' ' + botText).toLowerCase();
    const cards: InChatCardItem[] = [];

    // Check if query is about courses
    if (combined.includes('কোর্স') || combined.includes('course') || combined.includes('শিখব') || combined.includes('ক্লাস')) {
      (courses || []).slice(0, 3).forEach((c) => {
        cards.push({
          id: c.id,
          type: 'course',
          title: c.title,
          category: c.category,
          priceText: `৳${c.discountPrice || c.price}`,
          originalPriceText: c.discountPrice ? `৳${c.price}` : undefined,
          rating: c.rating || 4.9,
          thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
          badge: c.discountPrice ? 'বিশেষ ছাড়' : 'পপুলার',
          description: c.description ? c.description.slice(0, 60) + '...' : 'সম্পূর্ণ প্র্যাকটিক্যাল কোর্স উইথ লাইভ সাপোর্ট',
          actionText: 'এখনই এনরোল করুন',
          tabTarget: 'courses',
        });
      });
    }

    // Check if query is about services or IT packages
    if (combined.includes('সার্ভিস') || combined.includes('service') || combined.includes('ওয়েব') || combined.includes('মার্কেটিং') || combined.includes('গ্রাফিক্স') || combined.includes('প্যাকেজ')) {
      (services || []).slice(0, 3).forEach((s) => {
        cards.push({
          id: s.id,
          type: 'service',
          title: s.title,
          category: s.category,
          priceText: s.priceText || '৳15,000 থেকে শুরু',
          rating: s.rating || 5.0,
          thumbnail: s.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
          badge: 'অফিসিয়াল সার্ভিস',
          description: s.shortDescription || '১০০% রেসপন্সিভ ও প্রফেশনাল আইটি সলিউশন',
          actionText: 'সার্ভিস অর্ডার করুন',
          tabTarget: 'services',
        });
      });
    }

    // Check if query is about Order Boss marketplace gigs
    if (combined.includes('গিগ') || combined.includes('gig') || combined.includes('ফ্রিল্যান্স') || combined.includes('অর্ডার বস')) {
      (gigs || []).slice(0, 3).forEach((g) => {
        cards.push({
          id: g.id,
          type: 'gig',
          title: g.title,
          category: g.category,
          priceText: `৳${g.packages?.basic?.price || g.price || 1500}`,
          rating: g.rating || 4.8,
          thumbnail: g.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          badge: 'গিগ সার্ভিস',
          description: 'টপ রেটেড ফ্রিল্যান্সারের কাস্টম ডেলিভারি',
          actionText: 'গিগ বিস্তারিত দেখুন',
          tabTarget: 'marketplace',
        });
      });
    }

    return cards;
  };

  const isAnyStreaming = messages.some((m) => m.isStreaming);
  const isBusy = isLoading || isAnyStreaming;

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText || inputMsg).trim();
    if (!textToSend || isBusy) return;

    if (!overrideText) setInputMsg('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const lowerInput = textToSend.toLowerCase();

    // STRICT HUMAN ESCALATION ONLY IF EXPLICITLY REQUESTED
    const explicitlyAskingHuman =
      lowerInput.includes('হিউম্যান') ||
      lowerInput.includes('মানুষ') ||
      lowerInput.includes('কল দিন') ||
      lowerInput.includes('ফোন কল') ||
      lowerInput.includes('সরাসরি প্রতিনিধি') ||
      lowerInput.includes('সাপোর্ট টিমকে কল') ||
      lowerInput.includes('মেন্টরের ফোন') ||
      lowerInput.includes('human support') ||
      lowerInput.includes('live agent');

    if (explicitlyAskingHuman) {
      playNotificationTone();

      setTimeout(() => {
        setIsLoading(false);
        const targetAgent = agents.mentor;

        const sysMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `🔔 [অ্যালার্ট প্রেরিত] আপনার অনুরোধে সরাসরি ${targetAgent.name}-এর কাছে মেসেজটি পাঠানো হয়েছে।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: false,
        };

        const agentMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          sender: 'agent',
          agentName: targetAgent.name,
          agentRole: targetAgent.role,
          agentAvatar: targetAgent.avatar,
          text: `আসসালামু আলাইকুম! আমি ${targetAgent.name}।\n\n📌 সরাসরি মেন্টর সাপোর্টের জন্য ধন্যবাদ। আমি আপনার মেসেজটি পেয়েছি। নিচে আপনার মোবাইল নম্বরটি লিখে দিন অথবা জুম মিটিং এর সময় সিলেক্ট করুন।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
        };

        setMessages((prev) => [...prev, sysMsg, agentMsg]);
        setSuggestions([
          'আমার নম্বর: 01700000000',
          'লাইভ জুম লিংক পাঠান',
          'সব কোর্সগুলোর ক্যাটালগ',
        ]);
      }, 800);
    } else {
      // GEMINI REAL AI ASSISTANT FOR ALL DOMAIN QUESTIONS
      try {
        const history = messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            history,
            currentTab: activeTab || 'home',
          }),
        });

        const data = await res.json();
        const botReplyText = data.reply || 'উত্তর তৈরি করতে সমস্যা হয়েছে।';

        // Retrieve rich interactive cards for courses/services/gigs if applicable
        const richCards = getContextCards(textToSend, botReplyText);

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReplyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: true,
          cards: richCards.length > 0 ? richCards : undefined,
        };

        setMessages((prev) => [...prev, botMsg]);

        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([
            'অনলাইন প্রিমিয়াম কোর্সসমূহ',
            'PTENit সার্ভিস ও প্যাকেজ',
            'Order Boss মার্কেটপ্লেস গিগ',
          ]);
        }
      } catch (err) {
        console.error('Gemini Chat bot error:', err);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'দুঃখিত, কানেকশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStreaming: false,
        };
        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const markMessageStreamComplete = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, isStreaming: false } : m))
    );
  };

  // HANDLE CLICK ON IN-CHAT ITEM CARDS (COURSES, SERVICES, GIGS)
  const handleCardClick = (card: InChatCardItem) => {
    if (card.type === 'course') {
      // Open Course Details Modal directly!
      if (onOpenCourseDetail) {
        onOpenCourseDetail(card.id);
      } else if (setActiveTab) {
        setActiveTab('courses');
      }
      setIsOpen(false);
    } else {
      // Open Quick Service / Gig Order Modal directly!
      setSelectedModalCard(card);
    }
  };

  const handleConfirmQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModalCard) return;

    if (!currentUser && openAuthModal) {
      openAuthModal();
      return;
    }

    if (selectedModalCard.type === 'gig') {
      createDirectGigOrder(selectedModalCard.id, selectedPkg, orderNote || `Order placed via AI Assistant. Phone: ${orderPhone}, TxID: ${orderTxId}`);
    } else {
      createCustomerProject({
        customerId: currentUser?.id || 'guest',
        customerName: currentUser?.name || 'Guest User',
        customerEmail: currentUser?.email || 'guest@ptenit.com',
        customerPhone: orderPhone || '01700000000',
        serviceTitle: selectedModalCard.title,
        category: selectedModalCard.category || 'IT Service',
        description: orderNote || `Service Order via AI Assistant. Method: ${paymentMethod}, TxID: ${orderTxId}`,
      });
    }

    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedModalCard(null);
      setOrderPhone('');
      setOrderTxId('');
      setOrderNote('');
      if (setActiveTab) {
        setActiveTab('customer-dashboard');
      }
      setIsOpen(false);
    }, 1800);
  };

  const goToAdmin = () => {
    demoLogin('admin');
    if (setActiveTab) setActiveTab('admin');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* FLOATING TRIGGER BUTTON - COMPACT & UNIQUE */}
      {!isOpen && (
        <div className="relative group">
          {/* Subtle Glowing Backlight */}
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#1DB954] via-teal-400 to-[#38bdf8] opacity-80 blur-sm group-hover:opacity-100 transition duration-300 animate-pulse"></div>

          <button
            onClick={() => {
              setIsOpen(true);
              playNotificationTone();
            }}
            className="relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-[#091124] text-white rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-[#1DB954]/80"
          >
            {/* Sleek Bot Icon with Online Dot */}
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1DB954] to-emerald-400 flex items-center justify-center text-slate-950 shadow-inner">
                <Bot className="w-4 h-4 text-slate-950" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1DB954] border border-slate-950"></span>
              </span>
            </div>

            {/* Minimal Title */}
            <span className="font-extrabold text-xs tracking-wide font-heading text-white flex items-center gap-1.5 pr-1">
              AI Assistant
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            </span>
          </button>
        </div>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className={`bg-[#0b132b] border-2 border-[#1DB954]/90 rounded-3xl shadow-2xl w-[94vw] sm:w-[420px] flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-16' : 'h-[600px]'
          }`}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#091124] via-[#0f1d3a] to-[#091124] p-3.5 border-b border-slate-800 flex items-center justify-between text-white shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#1DB954] via-emerald-400 to-[#38bdf8] flex items-center justify-center border-2 border-[#34d399] shadow-md text-slate-950">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1DB954] border-2 border-slate-950 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white font-heading tracking-wide flex items-center gap-1.5">
                  AI Assistant
                  <span className="text-[9px] bg-[#1DB954] text-slate-950 px-1.5 py-0.2 rounded-full font-extrabold">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400 font-medium">
                  PTENit & Order Boss Helper
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 transition cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <ChevronDown className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-red-700/80 rounded-lg text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CHAT BODY */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs bg-[#0b132b]/95">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${
                      m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {m.sender === 'user' ? (
                      <div className="w-7 h-7 rounded-full bg-[#1DB954] text-slate-950 flex items-center justify-center shrink-0 border border-[#34d399] font-bold shadow">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    ) : m.sender === 'agent' ? (
                      <img
                        src={m.agentAvatar}
                        alt={m.agentName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border-2 border-[#1DB954] shadow"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1DB954] via-emerald-500 to-[#38bdf8] text-slate-950 flex items-center justify-center shrink-0 border border-[#34d399] font-extrabold shadow text-sm">
                        <Bot className="w-4 h-4 text-slate-950" />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`p-3 rounded-2xl shadow text-xs leading-relaxed space-y-1.5 ${
                          m.sender === 'user'
                            ? 'bg-[#1DB954] text-slate-950 font-semibold rounded-tr-none'
                            : 'bg-[#131f37] text-slate-100 border border-slate-700/80 rounded-tl-none font-sans'
                        }`}
                      >
                        {m.sender === 'agent' && (
                          <div className="flex items-center gap-1.5 border-b border-slate-700/80 pb-1 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                            <div>
                              <span className="font-extrabold text-white text-[11px] block leading-none">
                                {m.agentName}
                              </span>
                              <span className="text-[9px] text-[#1DB954] font-semibold">
                                {m.agentRole}
                              </span>
                            </div>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">
                          {m.isStreaming ? (
                            <TypewriterText
                              text={m.text.replace(/\*\*/g, '')}
                              speed={6}
                              onComplete={() => markMessageStreamComplete(m.id)}
                            />
                          ) : (
                            m.text.replace(/\*\*/g, '')
                          )}
                        </p>

                        {/* MESSAGE TIME & SEEN STATUS */}
                        <div
                          className={`flex items-center justify-end gap-1.5 text-[9px] pt-1 border-t ${
                            m.sender === 'user'
                              ? 'border-slate-900/20 text-slate-800'
                              : 'border-slate-700/50 text-slate-400'
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5 opacity-70" />
                          <span>{m.timestamp}</span>
                          {m.sender !== 'user' && !m.isStreaming && (
                            <span className="flex items-center gap-0.5 text-[#1DB954] font-bold ml-1">
                              <span>Seen</span>
                              <CheckCheck className="w-3 h-3 text-[#1DB954]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* IN-CHAT INTERACTIVE PRODUCT CARDS */}
                      {m.cards && m.cards.length > 0 && !m.isStreaming && (
                        <div className="space-y-2 pt-1 animate-fadeIn">
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold px-1">
                            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>সম্পর্কিত প্রিমিয়াম ক্যাটালগ ও কার্ড:</span>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
                            {m.cards.map((card) => (
                              <div
                                key={card.id}
                                className="w-48 shrink-0 bg-[#091124] border border-slate-700 hover:border-[#1DB954] rounded-2xl p-2.5 shadow-lg flex flex-col justify-between transition-all duration-200 group"
                              >
                                <div className="space-y-2">
                                  <div className="relative h-24 rounded-xl overflow-hidden bg-slate-800">
                                    <img
                                      src={card.thumbnail}
                                      alt={card.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {card.badge && (
                                      <span className="absolute top-1.5 right-1.5 bg-[#1DB954] text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-md shadow">
                                        {card.badge}
                                      </span>
                                    )}
                                    {card.category && (
                                      <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 backdrop-blur text-slate-300 font-semibold text-[8px] px-1.5 py-0.5 rounded-md">
                                        {card.category}
                                      </span>
                                    )}
                                  </div>

                                  <div>
                                    <h4 className="font-bold text-white text-[11px] leading-snug line-clamp-2">
                                      {card.title}
                                    </h4>
                                    <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">
                                      {card.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800 mt-2 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                      <span className="text-[10px] font-extrabold text-amber-300">
                                        {card.rating}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-black text-[#1DB954]">
                                        {card.priceText}
                                      </span>
                                      {card.originalPriceText && (
                                        <span className="text-[9px] text-slate-500 line-through block leading-none">
                                          {card.originalPriceText}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleCardClick(card)}
                                    className="w-full py-1.5 bg-[#1DB954] hover:bg-[#18a249] active:scale-95 text-slate-950 font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1 transition shadow cursor-pointer"
                                  >
                                    <span>{card.actionText}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* SLEEK PROFESSIONAL TYPING INDICATOR */}
                {isLoading && (
                  <div className="flex items-center gap-3 text-[#1DB954] text-xs p-3 bg-[#091124] rounded-2xl border border-slate-700/80 shadow-md animate-fadeIn">
                    <div className="w-7 h-7 rounded-full bg-[#1DB954]/20 border border-[#1DB954] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-[#1DB954] animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <span>AI Assistant উত্তর প্রস্তুত করছে</span>
                        <div className="flex gap-1 items-center ml-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-bounce"></span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal">উত্তর সম্পূর্ণ না হওয়া পর্যন্ত অনুগ্রহ করে অপেক্ষা করুন...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* DYNAMIC AUTO SUGGESTIONS CHIPS */}
              {suggestions.length > 0 && (
                <div className="p-2 bg-[#080d19] border-t border-slate-800/90 flex gap-1.5 overflow-x-auto no-scrollbar">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      disabled={isBusy}
                      onClick={() => handleSend(sug)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-[#1DB954] hover:text-slate-950 disabled:opacity-50 disabled:hover:bg-slate-900 disabled:hover:text-slate-200 text-slate-200 border border-slate-700/80 rounded-xl text-[11px] font-semibold whitespace-nowrap cursor-pointer disabled:cursor-not-allowed transition shadow-sm"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              {/* INPUT FORM */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isBusy) handleSend();
                }}
                className="p-3 bg-[#0d1b3a] border-t border-slate-800 flex gap-2 items-center"
              >
                <input
                  type="text"
                  disabled={isBusy}
                  placeholder={
                    isBusy
                      ? 'AI Assistant উত্তর তৈরি করছে... অপেক্ষা করুন...'
                      : 'AI Assistant কে প্রশ্ন করুন (যেমন: কোর্স ক্যাটালগ)...'
                  }
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#1DB954] disabled:opacity-60 disabled:cursor-not-allowed font-sans"
                />
                <button
                  type="submit"
                  disabled={isBusy || !inputMsg.trim()}
                  className="p-2.5 bg-[#1DB954] hover:bg-[#19a34a] disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow cursor-pointer disabled:cursor-not-allowed transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* QUICK SERVICE / GIG CHECKOUT MODAL OVERLAY */}
      {selectedModalCard && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b132b] border-2 border-[#1DB954] rounded-3xl w-full max-w-md p-5 shadow-2xl text-white space-y-4 animate-scaleUp relative">
            <button
              onClick={() => setSelectedModalCard(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <img
                src={selectedModalCard.thumbnail}
                alt={selectedModalCard.title}
                className="w-16 h-16 rounded-xl object-cover border border-[#1DB954]"
              />
              <div>
                <span className="text-[10px] font-bold bg-[#1DB954] text-slate-950 px-2 py-0.5 rounded-full">
                  {selectedModalCard.badge || 'PTENit Service'}
                </span>
                <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">
                  {selectedModalCard.title}
                </h3>
                <p className="text-xs font-black text-[#1DB954]">{selectedModalCard.priceText}</p>
              </div>
            </div>

            {orderSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 bg-[#1DB954] text-slate-950 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-white">অর্ডার সফলভাবে কনফার্ম হয়েছে! 🎈</h4>
                <p className="text-xs text-slate-300">
                  AI Assistant আপনার সার্ভিস ও অর্ডার বিবরণী ড্যাশবোর্ডে সংরক্ষণ করেছে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmQuickOrder} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">প্যাকেজ নির্বাচন করুন:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['basic', 'standard', 'premium'] as const).map((pkg) => (
                      <button
                        type="button"
                        key={pkg}
                        onClick={() => setSelectedPkg(pkg)}
                        className={`py-1.5 rounded-xl font-bold capitalize border text-[11px] transition cursor-pointer ${
                          selectedPkg === pkg
                            ? 'bg-[#1DB954] text-slate-950 border-[#1DB954]'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        {pkg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">পেমেন্ট মেথড:</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          paymentMethod === m
                            ? 'bg-amber-400 text-slate-950 border-amber-400'
                            : 'bg-slate-900 text-slate-300 border-slate-800'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-amber-300 mt-1">
                    📌 পেমেন্ট করুন: <span className="font-mono font-bold text-white">01700-000000</span> (মার্চেন্ট অ্যাকাউন্ট)
                  </p>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">আপনার মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01700000000"
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">ট্রানজেকশন আইডি (TxID)</label>
                  <input
                    type="text"
                    placeholder="e.g. 9H8X2A11"
                    value={orderTxId}
                    onChange={(e) => setOrderTxId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">অর্ডার নোট / কাজের নির্দেশনা</label>
                  <textarea
                    rows={2}
                    placeholder="কাজের সংক্ষেপ বা রিকোয়ারমেন্ট লিখুন..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1DB954] hover:bg-[#18a249] text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-lg mt-2"
                >
                  অর্ডার কনফার্ম করুন 🚀
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

