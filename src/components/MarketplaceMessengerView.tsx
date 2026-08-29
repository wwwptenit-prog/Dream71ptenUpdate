import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import {
  X,
  Lock,
  Send,
  Video,
  ExternalLink,
  ShieldCheck,
  Paperclip,
  ThumbsUp,
  Smile,
  CheckCheck,
  Search,
  Settings,
  ChevronLeft,
  Phone,
  Plus,
  MessageCircle,
  Sparkles,
  Star,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  PhoneOff,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  BadgeCheck,
  Sparkle,
  ShoppingBag
} from 'lucide-react';

interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  role: string;
  badge?: string;
  rating?: number;
  ordersCount?: number;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline: boolean;
  onlineTimeAgo?: string;
  category?: string;
}

interface MarketplaceMessengerViewProps {
  isEmbedded?: boolean;
  onClose?: () => void;
  initialCategory?: 'all' | 'sellers' | 'online' | 'orders';
  externalSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const MarketplaceMessengerView: React.FC<MarketplaceMessengerViewProps> = ({
  isEmbedded = false,
  onClose,
  initialCategory,
  externalSearchQuery,
  onSearchQueryChange
}) => {
  const {
    activeChatWindows,
    closeChatWindow,
    sendChatMessage,
    createGoogleMeetCall,
    currentUser,
    directMessages,
    openChatWindow,
    activeMessengerConversationId,
    setActiveMessengerConversationId
  } = useData();

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQueryInternal, setSearchQueryInternal] = useState('');
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : searchQueryInternal;
  const setSearchQuery = (val: string) => {
    setSearchQueryInternal(val);
    if (onSearchQueryChange) onSearchQueryChange(val);
  };
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'sellers' | 'online' | 'orders'>(initialCategory || 'all');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategoryFilter(initialCategory);
    }
  }, [initialCategory]);
  
  // Interactive Modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [userNote, setUserNote] = useState('Available for hire 💼');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeCallState, setActiveCallState] = useState<{
    active: boolean;
    callerName: string;
    callerAvatar: string;
    muted: boolean;
    duration: number;
  } | null>(null);

  // Settings toggles
  const [settings, setSettings] = useState({
    activeStatus: true,
    messageSound: true,
    orderAlerts: true,
    readReceipts: true
  });

  // Synchronize selected conversation ID
  useEffect(() => {
    setSelectedConversationId(activeMessengerConversationId || null);
  }, [activeMessengerConversationId]);

  // Call timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCallState?.active) {
      interval = setInterval(() => {
        setActiveCallState(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCallState?.active]);

  // Professional Marketplace Sellers & Freelancer Profiles
  const defaultHistory: ConversationItem[] = [
    {
      id: 'chat-tanvir-ahmed',
      name: 'Tanvir Ahmed',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Top Rated • Full-Stack Web',
      badge: 'Top Rated',
      rating: 5.0,
      ordersCount: 142,
      lastMessage: 'প্রজেক্টের সোর্স কোড ও লাইভ প্রিভিউ লিংক পাঠিয়েছি, চেক করে জানাবেন।',
      time: '১০ মিনিট আগে',
      unreadCount: 2,
      isOnline: true,
      category: 'sellers'
    },
    {
      id: 'chat-creative-pixels',
      name: 'Creative Pixels Agency',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'Level 2 • UI/UX Designer',
      badge: 'Level 2',
      rating: 4.9,
      ordersCount: 89,
      lastMessage: 'Figma ডিজাইন ফাইল আপডেট করা হয়েছে, ক্লায়েন্ট রিভিশন রেডি।',
      time: '৪৫ মিনিট আগে',
      isOnline: true,
      category: 'sellers'
    },
    {
      id: 'chat-piten-support',
      name: 'PiTen Marketplace Official',
      avatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=120&q=80',
      role: 'অফিসিয়াল সাপোর্ট ও এসক্রো সিকিউরিটি',
      badge: 'Verified Official',
      rating: 5.0,
      ordersCount: 999,
      lastMessage: 'অর্ডার #PT-8942 এর এস্ক্রো পেমেন্ট ভেরিফিকেশন সফল হয়েছে।',
      time: '২ ঘণ্টা আগে',
      unreadCount: 1,
      isOnline: true,
      category: 'orders'
    },
    {
      id: 'chat-shahinur-rahman',
      name: 'Shahinur Rahman',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      role: 'Pro Seller • React & Node Specialist',
      badge: 'Verified Pro',
      rating: 5.0,
      ordersCount: 65,
      lastMessage: 'পেমেন্ট গেটওয়ে এবং ডাটাবেস এপিআই ইন্টিগ্রেশন সম্পন্ন।',
      time: '৩ ঘণ্টা আগে',
      isOnline: false,
      onlineTimeAgo: '৩ ঘণ্টা আগে',
      category: 'sellers'
    },
    {
      id: 'chat-zubair-hossain',
      name: 'Zubair Hossain',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
      role: 'Level 2 • Mobile App Dev',
      badge: 'Level 2',
      rating: 4.9,
      ordersCount: 78,
      lastMessage: 'Android APK ও iOS টেস্টফ্লাইট বিল্ড ডাউনলোড লিংক পাঠানো হয়েছে।',
      time: '৫ ঘণ্টা আগে',
      isOnline: false,
      onlineTimeAgo: '৫ ঘণ্টা আগে',
      category: 'sellers'
    },
    {
      id: 'chat-sadia-afrin',
      name: 'Sadia Afrin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      role: 'Top Rated • SEO & Marketing',
      badge: 'Top Rated',
      rating: 4.8,
      ordersCount: 54,
      lastMessage: 'অন-পেজ এসইও ও কিওয়ার্ড র‍্যাংকিং অডিট রিপোর্ট পাঠানো হয়েছে।',
      time: '১ দিন আগে',
      isOnline: true,
      category: 'sellers'
    },
    {
      id: 'chat-mouson-art',
      name: 'Mouson Branding Studio',
      avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=120&q=80',
      role: 'Level 2 • Logo & Graphics',
      badge: 'Level 2',
      rating: 5.0,
      ordersCount: 112,
      lastMessage: 'লোগো ভেক্টর ফাইল ও ব্র্যান্ডিং কিট প্যাকেজ রেডি।',
      time: '১ দিন আগে',
      isOnline: false,
      onlineTimeAgo: '১ দিন আগে',
      category: 'sellers'
    }
  ];

  // Dynamic list merging active chat windows
  const activeWindowsAsConversations: ConversationItem[] = (activeChatWindows || []).map(w => ({
    id: w.id,
    name: w.senderName,
    avatar: w.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    role: w.senderRole || 'সেলার • ভেরিফাইড প্রফেশনাল',
    badge: 'Verified Seller',
    rating: 4.9,
    ordersCount: 35,
    lastMessage: w.messages[w.messages.length - 1]?.text || 'চ্যাট শুরু হয়েছে...',
    time: w.messages[w.messages.length - 1]?.time || 'এখন',
    isOnline: true,
    category: 'sellers'
  }));

  const allConversationsMap = new Map<string, ConversationItem>();
  activeWindowsAsConversations.forEach(c => allConversationsMap.set(c.id, c));
  defaultHistory.forEach(c => {
    if (!allConversationsMap.has(c.id)) {
      allConversationsMap.set(c.id, c);
    }
  });

  const conversationList = Array.from(allConversationsMap.values())
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeCategoryFilter === 'sellers') return c.category === 'sellers';
      if (activeCategoryFilter === 'orders') return c.category === 'orders';
      if (activeCategoryFilter === 'online') return c.isOnline;
      return true;
    })
    .sort((a, b) => {
      const unreadA = a.unreadCount || 0;
      const unreadB = b.unreadCount || 0;
      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadB > 0 && unreadA === 0) return 1;
      if (unreadA !== unreadB) return unreadB - unreadA;
      return 0;
    });

  // Top Active Stories / Contacts
  const topActiveStories = [
    {
      id: 'story-1',
      name: 'Tanvir A.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-tanvir-ahmed'
    },
    {
      id: 'story-2',
      name: 'Creative P.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-creative-pixels'
    },
    {
      id: 'story-3',
      name: 'Sadia A.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-sadia-afrin'
    },
    {
      id: 'story-4',
      name: 'PiTen Team',
      avatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-piten-support'
    },
    {
      id: 'story-5',
      name: 'Zubair H.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-zubair-hossain'
    }
  ];

  const currentActiveWin = activeChatWindows?.find(w => w.id === selectedConversationId) || (
    selectedConversationId ? {
      id: selectedConversationId,
      senderName: conversationList.find(c => c.id === selectedConversationId)?.name || 'মার্কেটপ্লেস সেলার',
      senderRole: conversationList.find(c => c.id === selectedConversationId)?.role || 'টপ রেটেড সেলার',
      senderAvatar: conversationList.find(c => c.id === selectedConversationId)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      messages: [
        {
          id: 'msg-default-1',
          senderName: conversationList.find(c => c.id === selectedConversationId)?.name || 'সেলার',
          senderAvatar: conversationList.find(c => c.id === selectedConversationId)?.avatar,
          isSelf: false,
          text: conversationList.find(c => c.id === selectedConversationId)?.lastMessage || 'আসসালামু আলাইকুম! আপনার প্রজেক্টের রিকোয়ারমেন্ট বা সার্ভিস সম্পর্কে জানান।',
          time: conversationList.find(c => c.id === selectedConversationId)?.time || '১০ মিনিট আগে'
        }
      ]
    } : null
  );

  return (
    <div className={`w-full flex flex-col font-bengali ${isEmbedded ? 'h-[calc(100dvh-100px)] h-[calc(100vh-100px)] sm:h-[80vh] min-h-[400px]' : 'h-full'}`}>
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-white dark:bg-[#18222D]">
        
        {/* LEFT PANE: MESSAGES HISTORY & STORIES */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#18222D] flex flex-col h-full shrink-0 relative ${
          selectedConversationId ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* MESSAGES HEADER: Clean & Professional, Search + Settings set together on the right */}
          <div className={`px-4 py-3 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0 ${isEmbedded ? 'hidden sm:flex' : 'flex'}`}>
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>Messages</span>
                  <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                </h1>
                <p className="text-[10px] font-semibold text-slate-400/90 tracking-wide leading-tight mt-0.5 font-sans">
                  PTENit Marketplace Inbox
                </p>
              </div>
            </div>

            {/* Right Header Buttons: Settings Icon */}
            <div className="flex items-center gap-1.5">
              <button
                id="messenger-settings-trigger"
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition cursor-pointer"
                title="মেসেঞ্জার সেটিংস"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SEARCH BAR (HIDDEN ON PHONE VIEW FOR MAXIMUM VERTICAL SPACE) */}
          <div className="hidden md:block px-3.5 pt-3 pb-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="messenger-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সেলার, ক্লায়েন্ট বা সার্ভিস খুঁজুন..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800/80 border-none rounded-full text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE STORIES / CONTACTS ROW */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
              {/* User Note Pill */}
              <div
                onClick={() => setIsNoteModalOpen(true)}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt="You"
                    className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#1DB954] transition"
                  />
                  <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] rounded-full p-0.5 shadow-xs">
                    💬
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[50px] text-center">
                  Your note
                </span>
              </div>

              {/* Active Sellers Stories */}
              {topActiveStories.map(story => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedConversationId(story.convoId);
                    if (setActiveMessengerConversationId) setActiveMessengerConversationId(story.convoId);
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative p-0.5 rounded-full border-2 border-[#1DB954]">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18222D]" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[54px] text-center">
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORY FILTER TABS (HIDDEN ON PHONE VIEW FOR MAXIMUM VERTICAL SPACE) */}
          <div className="hidden sm:flex px-3.5 py-2 items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'সব ইনবক্স' },
              { id: 'sellers', label: 'সেলার্স' },
              { id: 'orders', label: 'অর্ডার চ্যাট' },
              { id: 'online', label: 'অনলাইন' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryFilter(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeCategoryFilter === tab.id
                    ? 'bg-[#1DB954] text-white font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONVERSATION LIST FEED */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50 no-scrollbar pb-20">
            {conversationList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <MessageCircle className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold">কোনো চ্যাট বা সেলার পাওয়া যায়নি</p>
              </div>
            ) : (
              conversationList.map(c => {
                const isSelected = selectedConversationId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedConversationId(c.id);
                      if (setActiveMessengerConversationId) setActiveMessengerConversationId(c.id);
                    }}
                    className={`p-3 sm:px-4 sm:py-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-l-4 border-[#1DB954]'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Avatar with Online Indicator */}
                    <div className="relative shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      {c.isOnline ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#18222D]" />
                      ) : (
                        c.onlineTimeAgo && (
                          <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-bold px-1 rounded-full border border-slate-700">
                            {c.onlineTimeAgo}
                          </span>
                        )
                      )}
                    </div>

                    {/* Name, Badge, Rating & Last Message */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate flex items-center gap-1">
                            <span className="truncate">{c.name}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                          </h4>
                          {c.badge && (
                            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold border border-slate-200 dark:border-slate-700 shrink-0">
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-1">
                          {c.time}
                        </span>
                      </div>

                      {/* Role & Rating */}
                      <div className="flex items-center justify-between gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        <span className="truncate flex-1">{c.role}</span>
                        {c.rating && (
                          <span className="hidden sm:flex items-center gap-1 text-slate-700 dark:text-slate-200 shrink-0 font-extrabold text-[10px] bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{c.rating.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      {/* Message snippet */}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium flex-1 mr-2">
                          {c.lastMessage}
                        </p>
                        {c.unreadCount ? (
                          <span className="min-w-5 h-5 px-1.5 bg-[#1DB954] text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-sm ring-2 ring-white dark:ring-slate-900">
                            {c.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>



        </div>

        {/* RIGHT PANE: CHAT CONVERSATION VIEW */}
        <div className={`flex-1 flex flex-col h-full bg-white dark:bg-[#18222D] ${
          selectedConversationId ? 'flex' : 'hidden md:flex'
        }`}>
          {currentActiveWin ? (
            <EmbeddedChatThread
              win={currentActiveWin}
              onBack={() => {
                setSelectedConversationId(null);
                if (setActiveMessengerConversationId) setActiveMessengerConversationId(null);
              }}
              onSend={(text) => sendChatMessage(currentActiveWin.id, text)}
              onCreateMeet={() => createGoogleMeetCall(currentActiveWin.id)}
              onStartVoiceCall={() => {
                setActiveCallState({
                  active: true,
                  callerName: currentActiveWin.senderName,
                  callerAvatar: currentActiveWin.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                  muted: false,
                  duration: 0
                });
              }}
              currentUserName={currentUser?.name || 'আমি'}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-[#1DB954] flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
                মার্কেটপ্লেস চ্যাট ও ইনবক্স
              </h3>
              <p className="text-xs max-w-xs leading-relaxed text-slate-500">
                বাম পাশের তালিকা থেকে যেকোনো ভেরিফাইড সেলার বা প্রজেক্ট নির্বাচন করে সরাসরি বার্তা পাঠান ও ফাইল আদান-প্রদান করুন।
              </p>
            </div>
          )}
        </div>

      </div>

      {/* SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <div 
          onClick={() => setIsSettingsModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#1DB954]" />
                <span>মেসেঞ্জার ও চ্যাট সেটিংস</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">অ্যাক্টিভ অনলাইন স্ট্যাটাস</div>
                  <div className="text-[11px] text-slate-400">বায়ার ও ক্লায়েন্টদের কাছে অনলাইন দৃশ্যমান রাখুন</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.activeStatus}
                  onChange={(e) => setSettings({ ...settings, activeStatus: e.target.checked })}
                  className="w-5 h-5 accent-[#1DB954] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">মেসেজ সাউন্ড নোটিফিকেশন</div>
                  <div className="text-[11px] text-slate-400">নতুন বার্তা আসলে শব্দ হবে</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.messageSound}
                  onChange={(e) => setSettings({ ...settings, messageSound: e.target.checked })}
                  className="w-5 h-5 accent-[#1DB954] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">অর্ডার ও অফার নোটিফিকেশন</div>
                  <div className="text-[11px] text-slate-400">কাস্টম অফার ও ডেলিভারি আপডেট সাথে সাথে পান</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.orderAlerts}
                  onChange={(e) => setSettings({ ...settings, orderAlerts: e.target.checked })}
                  className="w-5 h-5 accent-[#1DB954] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">রিড রিসিপ্ট (Read Receipts)</div>
                  <div className="text-[11px] text-slate-400">মেসেজ পড়া হয়েছে কিনা টিক দেখাবে</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.readReceipts}
                  onChange={(e) => setSettings({ ...settings, readReceipts: e.target.checked })}
                  className="w-5 h-5 accent-[#1DB954] cursor-pointer"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 bg-[#1DB954] text-white text-xs font-black rounded-xl cursor-pointer shadow-xs transition"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTE UPDATE MODAL */}
      {isNoteModalOpen && (
        <div 
          onClick={() => setIsNoteModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                আপনার স্ট্যাটাস নোট দিন
              </h4>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="যেমন: Available for web development 💻"
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-1.5 bg-[#1DB954] text-white text-xs font-black rounded-lg cursor-pointer"
              >
                শেয়ার করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CHAT SELECTION MODAL */}
      {isNewChatModalOpen && (
        <div 
          onClick={() => setIsNewChatModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#1DB954]" />
                <span>নতুন কথোপকথন শুরু করুন</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <input
                type="text"
                placeholder="সেলার বা ব্যবহারকারীর নাম খুঁজুন..."
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
              {defaultHistory.map(u => (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedConversationId(u.id);
                    setIsNewChatModalOpen(false);
                  }}
                  className="p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{u.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{u.role}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-[#1DB954]/10 text-[#1DB954] font-black rounded-full border border-[#1DB954]/30">
                    চ্যাট
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI ASSISTANT PROMPT MODAL */}
      {isAiModalOpen && (
        <div 
          onClick={() => setIsAiModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    PiTen Smart AI Assistant
                  </h4>
                  <p className="text-[10px] text-slate-400">প্রজেক্ট ব্রিফ, ডেসক্রিপশন বা মেসেজ লিখতে সাহায্য নিন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                AI দিয়ে কি লিখতে চান?
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: ক্লায়েন্টকে কাজের আপডেট দেয়ার জন্য একটি পেশাদার মেসেজ ড্রাফট করুন..."
                className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                বন্ধ
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('AI খসড়া তৈরি হয়েছে ও ক্লিপবোর্ডে কপি করা হয়েছে!');
                  setIsAiModalOpen(false);
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black rounded-lg cursor-pointer shadow-md"
              >
                জেনারেট করুন ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE VOICE CALL MODAL */}
      {activeCallState?.active && (
        <div className="fixed inset-0 z-[100000] pointer-events-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-bengali animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm p-6 text-center space-y-6 shadow-2xl">
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={activeCallState.callerAvatar}
                  alt={activeCallState.callerName}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#1DB954] shadow-xl animate-pulse"
                />
                <span className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 absolute bottom-1 right-1" />
              </div>
              <h3 className="text-lg font-black text-white">{activeCallState.callerName}</h3>
              <p className="text-xs text-emerald-400 font-bold">
                ভয়েস কল চলমান • {Math.floor(activeCallState.duration / 60)}:{(activeCallState.duration % 60).toString().padStart(2, '0')}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setActiveCallState(prev => prev ? { ...prev, muted: !prev.muted } : null)}
                className={`p-3.5 rounded-full text-white cursor-pointer transition ${
                  activeCallState.muted ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={activeCallState.muted ? 'আনমিউট করুন' : 'মিউট করুন'}
              >
                {activeCallState.muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveCallState(null)}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-lg hover:scale-105 transition"
                title="কল কেটে দিন"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* EMBEDDED CHAT THREAD (Full Chat with Attachments, Voice, Meet & Offers) */
/* ========================================================================= */

interface EmbeddedChatThreadProps {
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
  };
  onBack: () => void;
  onSend: (text: string) => void;
  onCreateMeet: () => void;
  onStartVoiceCall: () => void;
  currentUserName: string;
}

const EmbeddedChatThread: React.FC<EmbeddedChatThreadProps> = ({
  win,
  onBack,
  onSend,
  onCreateMeet,
  onStartVoiceCall
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTitle, setOfferTitle] = useState('ওয়েবসাইট ডিজাইন ও ডেভেলপমেন্ট সার্ভিস');
  const [offerPrice, setOfferPrice] = useState('৫০০০');
  const [offerDelivery, setOfferDelivery] = useState('৩ দিন');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [win.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSend(inputText);
    setInputText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = (file.size / 1024).toFixed(1);
    onSend(`📎 [ফাইল অ্যাটাচমেন্ট]: ${file.name} (${sizeKb} KB)`);
    if (e.target) e.target.value = '';
  };

  const handleSendCustomOffer = () => {
    if (!offerTitle.trim() || !offerPrice.trim()) return;
    onSend(`💼 [কাস্টম প্রজেক্ট অফার]\n📦 সার্ভিস: ${offerTitle}\n💰 বাজেট: ৳${offerPrice}\n⏱️ ডেলিভারি সময়: ${offerDelivery}\n\n👉 অর্ডার নিশ্চিত করতে বায়ার একসেপ্ট বাটনে ট্যাপ করতে পারেন।`);
    setIsOfferModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#18222D]">
      {/* TOP HEADER BAR (VISIBLE ON ALL SCREENS INCLUDING PHONE VIEW) */}
      <div className="flex px-2.5 sm:px-4 py-2 bg-white dark:bg-[#1C2733] border-b border-slate-200/80 dark:border-slate-800 items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          {/* Prominent Back Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            className="p-1 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition cursor-pointer active:scale-95 shrink-0"
            title="ইনবক্সে ফিরে যান"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Seller Avatar */}
          <div className="relative shrink-0 p-[1.5px] rounded-full bg-gradient-to-tr from-emerald-400 via-blue-500 to-cyan-400 shadow-xs">
            <img
              src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={win.senderName}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-white dark:border-[#1C2733]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1C2733]" />
          </div>

          {/* Seller Info */}
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate flex items-center gap-1">
              <span className="truncate">{win.senderName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
            </h3>
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">অনলাইনে আছেন</span>
            </p>
          </div>
        </div>

        {/* Action icons in header */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Custom Offer Shortcut Button */}
          <button
            type="button"
            onClick={() => setIsOfferModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black hover:bg-emerald-500/20 transition cursor-pointer"
            title="কাস্টম অফার পাঠান"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>অফার পাঠান</span>
          </button>

          {/* Google Meet Video Call */}
          <button
            type="button"
            id="messenger-meet-trigger"
            onClick={onCreateMeet}
            className="p-2 text-[#1DB954] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-full transition cursor-pointer"
            title="Google Meet ভিডিও কল"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Voice Call */}
          <button
            type="button"
            id="messenger-phone-trigger"
            onClick={onStartVoiceCall}
            className="p-2 text-[#1DB954] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-full transition cursor-pointer"
            title="ভয়েস কল"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MESSAGES FEED */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-[#101923] no-scrollbar">
        {/* Profile Intro Banner */}
        <div className="py-5 text-center space-y-2 border-b border-slate-200/50 dark:border-slate-800/60 max-w-sm mx-auto">
          <img
            src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={win.senderName}
            className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-white dark:border-[#1C2733] shadow-md"
          />
          <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
            <span>{win.senderName}</span>
            <CheckCircle2 className="w-4 h-4 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="Verified Profile" />
          </h4>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="truncate">{win.senderRole || 'Pro Seller • React & Node Specialist'}</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-700 dark:text-slate-200 shrink-0 font-extrabold text-[11px] bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>4.9</span>
            </span>
          </div>
        </div>

        {win.messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${m.isSelf ? 'justify-end' : 'justify-start'}`}
          >
            {!m.isSelf && (
              <img
                src={m.senderAvatar || win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
              />
            )}

            <div className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
              <div
                className={`px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  m.isSelf
                    ? 'bg-[#1DB954] text-white font-bold rounded-2xl rounded-br-xs'
                    : 'bg-white dark:bg-[#243447] text-slate-900 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700/60 rounded-2xl rounded-bl-xs'
                }`}
              >
                {m.text.includes('💼') || m.text.includes('অফার') || m.text.includes('অর্ডার') ? (
                  <div className="my-1 p-3.5 bg-gradient-to-br from-slate-900 via-slate-900 to-[#0B132B] text-white rounded-2xl border border-emerald-500/40 shadow-xl space-y-3 font-bengali">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                          <Briefcase className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                            ডাইরেক্ট প্রজেক্ট অর্ডার কার্ড
                          </span>
                          <span className="text-xs font-bold text-slate-200">
                            {win.senderName}-এর জন্য ব্যক্তিগত প্রস্তাব
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                        অপেক্ষমাণ (Pending)
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-200">
                      <p className="whitespace-pre-wrap font-medium">{m.text}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          alert('অভিনন্দন! ডাইরেক্ট প্রজেক্ট অর্ডার কনফার্ম করা হয়েছে এবং এস্ক্রো গেটওয়েতে ফান্ড সিকিউরড করা হয়েছে।');
                        }}
                        className="w-full py-2 px-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>অর্ডার একসেপ্ট ও সিকিউরড পেমেন্ট</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.text}</p>
                )}
                {m.meetLink && (
                  <a
                    href={m.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Join Google Meet Call</span>
                  </a>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-semibold">
                {m.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* BOTTOM INPUT BAR */}
      <div className="p-3 bg-white dark:bg-[#1C2733] border-t border-slate-200/80 dark:border-slate-800 shrink-0 relative">
        {/* Emoji Selector Popup */}
        {showEmojis && (
          <div className="absolute bottom-16 left-4 bg-white dark:bg-[#243447] border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-2xl flex items-center gap-2 z-30 animate-in fade-in duration-100">
            {['👍', '❤️', '🔥', '🎉', '😊', '🚀', '💼', '🤝'].map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setInputText(prev => prev + emoji);
                  setShowEmojis(false);
                }}
                className="text-lg hover:scale-125 transition cursor-pointer p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-1 sm:gap-2 w-full max-w-full overflow-hidden">
          {/* File attachment input hidden */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* 1. New Order Button */}
          <button
            type="button"
            onClick={() => setIsOfferModalOpen(true)}
            className="p-1.5 sm:p-2 text-[#1DB954] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-full transition cursor-pointer shrink-0 active:scale-95"
            title="নতুন ডাইরেক্ট প্রজেক্ট অর্ডার পাঠান"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 2. Attach file */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-[#1DB954] dark:hover:text-[#1DB954] transition cursor-pointer shrink-0"
            title="ফাইল বা ছবি সংযুক্ত করুন"
          >
            <Paperclip className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 3. Emoji */}
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-amber-500 transition cursor-pointer shrink-0"
            title="ইমোজি"
          >
            <Smile className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="মেসেজ লিখুন..."
            className="min-w-0 flex-1 px-2.5 sm:px-4 py-1.5 sm:py-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-full text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
          />

          {/* Send Message Button - Always visible */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer transition active:scale-95 shadow-xs shrink-0 flex items-center justify-center ${
              inputText.trim()
                ? 'bg-[#1DB954] hover:bg-[#19a34a] text-white opacity-100'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            title="পাঠান"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </form>
      </div>

      {/* CUSTOM PROJECT OFFER MODAL */}
      {isOfferModalOpen && (
        <div 
          onClick={() => setIsOfferModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1DB954]" />
                <span>কাস্টম প্রজেক্ট অফার পাঠান</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">অফার সার্ভিস টাইটেল:</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">প্রজেক্ট বাজেট (৳):</label>
                  <input
                    type="text"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">ডেলিভারি সময়:</label>
                  <input
                    type="text"
                    value={offerDelivery}
                    onChange={(e) => setOfferDelivery(e.target.value)}
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSendCustomOffer}
                className="px-4 py-2 bg-[#1DB954] text-white text-xs font-black rounded-xl cursor-pointer shadow-md hover:bg-[#19a34a] transition"
              >
                অফার সেন্ড করুন 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
