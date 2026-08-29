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
  User,
  PhoneOff,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  BadgeCheck,
  Sparkle,
  Home,
  Globe,
  ShoppingBag,
  BookOpen,
  Mail,
  Bell,
  Heart,
  PhoneCall,
  Trash2,
  AlertTriangle,
  Info,
  CreditCard,
  ArrowRight,
  Play,
  Award,
  Download,
  HelpCircle,
  CheckCircle,
  MessageSquare
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

interface FloatingMessengerWindowsProps {
  onNavigateTab?: (tab: string, category?: string, pushHistory?: boolean) => void;
}

export const FloatingMessengerWindows: React.FC<FloatingMessengerWindowsProps> = ({ onNavigateTab }) => {
  const {
    activeChatWindows,
    closeChatWindow,
    toggleMinimizeChatWindow,
    sendChatMessage,
    createGoogleMeetCall,
    currentUser,
    directMessages,
    openChatWindow,
    isMessengerInboxOpen,
    initialMessengerTab,
    closeMessengerInbox,
    activeMessengerConversationId,
    setActiveMessengerConversationId,
    openNotificationCenter,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    playAppSound,
    isNotificationCenterOpen,
    closeNotificationCenter
  } = useData();

  // Full Screen Messenger State
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [activeTopTab, setActiveTopTab] = useState<'messages' | 'notifications' | 'courses'>('messages');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [activeCourseFeatureModal, setActiveCourseFeatureModal] = useState<{
    courseTitle: string;
    featureType: 'video' | 'certificate' | 'source_code' | 'live_class' | 'quiz' | 'qna';
    featureTitle: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'sellers' | 'online' | 'orders'>('all');
  
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

  const isOpen = isMessengerInboxOpen || isFullScreenOpen;

  useEffect(() => {
    if (isMessengerInboxOpen) {
      setActiveTopTab(initialMessengerTab || 'messages');
    }
  }, [isMessengerInboxOpen, initialMessengerTab]);

  // Synchronize selected conversation ID whenever messenger opens or activeMessengerConversationId changes
  useEffect(() => {
    setSelectedConversationId(activeMessengerConversationId || null);
  }, [activeMessengerConversationId, isMessengerInboxOpen]);

  // Always reset mobile search and settings modals when switching tabs or closing/opening messenger or changing conversation
  useEffect(() => {
    setIsMobileSearchActive(false);
    setSearchQuery('');
    setIsSettingsModalOpen(false);
    setIsNoteModalOpen(false);
    setIsNewChatModalOpen(false);
    setIsAiModalOpen(false);
  }, [activeTopTab, isMessengerInboxOpen, selectedConversationId]);

  const handleCloseAll = () => {
    setIsFullScreenOpen(false);
    setSelectedConversationId(null);
    setIsMobileSearchActive(false);
    setSearchQuery('');
    setIsSettingsModalOpen(false);
    setIsNoteModalOpen(false);
    setIsNewChatModalOpen(false);
    setIsAiModalOpen(false);
    if (setActiveMessengerConversationId) setActiveMessengerConversationId(null);
    closeMessengerInbox();
    if (isNotificationCenterOpen) closeNotificationCenter();
  };

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
      if (activeCategoryFilter === 'online') return c.isOnline;
      if (activeCategoryFilter === 'orders') return c.category === 'orders' || c.name.includes('Official');
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

  // Top seller stories / online status cards
  const topSellers = [
    {
      id: 'my-note',
      name: 'Your note',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      isMe: true,
      noteText: userNote
    },
    {
      id: 'story-tanvir',
      name: 'Tanvir (Top)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-tanvir-ahmed'
    },
    {
      id: 'story-creative',
      name: 'Pixels (UI)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-creative-pixels'
    },
    {
      id: 'story-shahin',
      name: 'Shahinur (Dev)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-shahinur-rahman'
    },
    {
      id: 'story-sadia',
      name: 'Sadia (SEO)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
      isOnline: true,
      convoId: 'chat-sadia-afrin'
    },
    {
      id: 'story-zubair',
      name: 'Zubair (App)',
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

  const getNotificationTypeIcon = (n: any) => {
    if (!n) return null;
    if (n.type === 'success' || n.category === 'payment' || (n.title && (n.title.includes('৳') || n.title.includes('ওয়ালেট')))) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-[#1DB954] shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
      );
    }
    if (n.type === 'warning' || n.type === 'alert') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    }
    if (n.category === 'mentor' || n.targetTab === 'student-dashboard' || (n.title && n.title.includes('কোর্স'))) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
      );
    }
    if (n.senderAvatar) {
      return (
        <img
          src={n.senderAvatar}
          alt=""
          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#0084FF] shrink-0 shadow-xs">
        <Sparkles className="w-5 h-5" />
      </div>
    );
  };

  return (
    <>
      {/* 1. FLOATING MINI CHAT POPUP WINDOWS (VISIBLE ON BOTH DESKTOP & MOBILE OVER ORDERS) */}
      {!isOpen && activeChatWindows && activeChatWindows.length > 0 && (
        <div className="fixed bottom-0 sm:bottom-0 right-0 sm:right-6 left-0 sm:left-auto z-[9990] flex items-end justify-center sm:justify-end gap-3 p-2 sm:p-0 pointer-events-none font-bengali">
          {activeChatWindows.map(win => (
            <SingleChatWindow
              key={win.id}
              win={win}
              onClose={() => closeChatWindow(win.id)}
              onMinimize={() => toggleMinimizeChatWindow(win.id)}
              onSend={(text) => sendChatMessage(win.id, text)}
              onCreateMeet={() => createGoogleMeetCall(win.id)}
              onExpandFullScreen={() => {
                setSelectedConversationId(win.id);
                setIsFullScreenOpen(true);
              }}
              currentUserName={currentUser?.name || 'আমি'}
            />
          ))}
        </div>
      )}

      {/* 2. FULL SCREEN MESSENGER MODAL / SCREEN (RESPONSIVE PC & PHONE) */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#18222D] flex flex-col font-bengali animate-in fade-in zoom-in-95 duration-200">
          
          {/* MOBILE VIEW TOPBAR (6 ICONS + ATTACHED SUB-HEADER IN #0B132B) */}
          <div className="md:hidden bg-[#0B132B] text-white shrink-0 font-bengali z-50">
            {/* Top 6 Icons Navigation Bar */}
            <div className="flex items-center justify-around py-2 px-2 border-b border-slate-800/80">
              {/* 1. Home */}
              <button
                type="button"
                onClick={() => {
                  handleCloseAll();
                  if (onNavigateTab) onNavigateTab('home');
                }}
                className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                title="হোম পেজে যান"
              >
                <Home className="w-5 h-5 text-white" />
              </button>
              {/* 2. Order */}
              <button
                type="button"
                onClick={() => {
                  handleCloseAll();
                  if (onNavigateTab) onNavigateTab('marketplace', 'my-orders');
                }}
                className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                title="আমার অর্ডারসমূহ"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
              </button>
              {/* 3. Messenger */}
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsMobileSearchActive(false);
                  setActiveTopTab('messages');
                  if (isNotificationCenterOpen) closeNotificationCenter();
                }}
                className={`flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer ${
                  activeTopTab === 'messages' ? 'text-[#1DB954]' : 'text-white hover:text-emerald-400'
                }`}
                title="মেসেঞ্জার ও ইনবক্স"
              >
                <Mail className={`w-5 h-5 ${activeTopTab === 'messages' ? 'stroke-[2.5] text-[#1DB954]' : 'text-white'}`} />
              </button>
              {/* 4. Notification */}
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsMobileSearchActive(false);
                  setActiveTopTab('notifications');
                  setSelectedConversationId(null);
                }}
                className={`flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer ${
                  activeTopTab === 'notifications' ? 'text-[#1DB954]' : 'text-white hover:text-emerald-400'
                }`}
                title="নোটিফিকেশন সেন্টার"
              >
                <Bell className={`w-5 h-5 ${activeTopTab === 'notifications' ? 'stroke-[2.5] text-[#1DB954]' : 'text-white'}`} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#1DB954] ring-2 ring-[#0B132B]" />
                )}
              </button>
              {/* 5. Saved / Favorites */}
              <button
                type="button"
                onClick={() => {
                  handleCloseAll();
                  if (onNavigateTab) onNavigateTab('marketplace', 'saved_gigs');
                }}
                className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                title="পছন্দের সেভ করা গিগসমূহ"
              >
                <Heart className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Sub-Header Attached Below 6 Icons */}
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-colors">
              {selectedConversationId && currentActiveWin ? (
                /* Active Chat Sub-Header: < [Avatar] Name Active now 📹 📞 */
                <div className="flex items-center justify-between w-full animate-in fade-in duration-150 py-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedConversationId(null);
                        setIsMobileSearchActive(false);
                        setSearchQuery('');
                        setActiveCategoryFilter('all');
                        if (setActiveMessengerConversationId) setActiveMessengerConversationId(null);
                      }}
                      className="p-1 -ml-1 rounded-lg text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                      title="ইনবক্সে ফিরে যান"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200 stroke-[2.5]" />
                    </button>
                    <div className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-emerald-400 via-blue-500 to-cyan-400 shadow-xs">
                      {currentActiveWin.senderRole === 'customer' || currentActiveWin.senderRole === 'buyer' ? (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center border border-[#0B132B]">
                          <User className="w-4 h-4" />
                        </div>
                      ) : (
                        <img
                          src={currentActiveWin.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={currentActiveWin.senderName}
                          className="w-8 h-8 rounded-full object-cover border border-[#0B132B]"
                        />
                      )}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1DB954] border-2 border-[#0B132B]" />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-1">
                        <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                          {currentActiveWin.senderName}
                        </h2>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                      </div>
                      <p className="text-[10px] text-[#1DB954] font-bold leading-none mt-0.5 truncate">
                        Active now
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => createGoogleMeetCall(selectedConversationId)}
                      className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition cursor-pointer"
                      title="ভিডিও কল"
                    >
                      <Video className="w-4.5 h-4.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => createGoogleMeetCall(selectedConversationId)}
                      className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition cursor-pointer"
                      title="ভয়েস কল"
                    >
                      <PhoneCall className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ) : isMobileSearchActive ? (
                /* Inline Search Input inside Top Sub-Header (Centered, White Box, Inside X Button that closes on tap) */
                <div className="w-full max-w-md mx-auto flex items-center animate-in fade-in duration-150 py-0.5">
                  <div className="relative w-full flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="সেলার, বায়ার বা সার্ভিস খুঁজুন..."
                      autoFocus
                      className="w-full pl-9 pr-8 py-1.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsMobileSearchActive(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition cursor-pointer"
                      title="সার্চ বন্ধ করুন"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : activeTopTab === 'courses' ? (
                /* List View Sub-Header for Courses: Courses & Academy Features • PTENit */
                <div className="flex items-center justify-between py-0.5 font-bengali">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseAll();
                        if (onNavigateTab) onNavigateTab('home');
                      }}
                      className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="হোমে ফিরে যান"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">Academy & Learning</h2>
                        <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans">
                        PTENit Enrolled Courses & Features
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsMobileSearchActive(true)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="কোর্স খুঁজুন"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : activeTopTab === 'notifications' ? (
                selectedNotification ? (
                  /* Notification Detail View Header (Replaces Notifications • PTENit Marketplace Updates) */
                  <div className="flex items-center justify-between py-0.5">
                    <button
                      type="button"
                      onClick={() => setSelectedNotification(null)}
                      className="flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition cursor-pointer active:scale-95 py-1 -ml-1"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#1DB954] stroke-[2.5]" />
                      <span className="text-xs font-black">ফিরে যান</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          deleteNotification(selectedNotification.id);
                          setSelectedNotification(null);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="নোটিফিকেশন মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* List View Sub-Header for Notifications: Notifications • PTENit Marketplace Updates */
                  <div className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseAll();
                          if (onNavigateTab) onNavigateTab('home');
                        }}
                        className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="হোমে ফিরে যান"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">Notifications</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="bg-[#1DB954] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 shrink-0">
                              {notifications.filter(n => !n.read).length}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans">
                          PTENit Marketplace Updates
                        </p>
                      </div>
                    </div>

                    {/* Right: Search + Settings */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsMobileSearchActive(true)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="সার্চ করুন"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="সেটিংস"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* List View Sub-Header: Messages • PiTen Marketplace Inbox */
                <div className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseAll();
                        if (onNavigateTab) onNavigateTab('home');
                      }}
                      className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="হোমে ফিরে যান"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">Messages</h2>
                        <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans">
                        PTENit Marketplace Inbox
                      </p>
                    </div>
                  </div>

                  {/* Right: Search + Settings */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsMobileSearchActive(true)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="সার্চ করুন"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="সেটিংস"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* LEFT PANE: MESSAGES HISTORY & STORIES (VISIBLE ON DESKTOP OR WHEN NO CONVO SELECTED ON PHONE) */}
            <div className={`w-full md:w-88 lg:w-96 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#18222D] flex flex-col h-full shrink-0 relative ${
              selectedConversationId ? 'hidden md:flex' : 'flex'
            }`}>
              
              {/* MESSAGES HEADER: Clean & Professional, Search + Settings set together on the right */}
              <div className="hidden md:flex px-4 py-3 items-center justify-between border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCloseAll}
                    className="p-1.5 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition cursor-pointer active:scale-95"
                    title="বন্ধ করে পেজে ফিরে যান"
                  >
                    <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
                      <span>{activeTopTab === 'notifications' ? 'Notifications' : 'Messages'}</span>
                      <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                    </h1>
                    <p className="text-[10px] font-semibold text-slate-400/90 tracking-wide leading-tight mt-0.5 font-sans">
                      {activeTopTab === 'notifications' ? 'PTENit Marketplace Updates' : 'PTENit Marketplace Inbox'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Search Toggle Icon */}
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('messenger-search-input');
                      if (input) input.focus();
                    }}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition cursor-pointer active:scale-95"
                    title="মেসেজ সার্চ করুন"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {/* Settings Button (Paired with Search) */}
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 relative transition cursor-pointer active:scale-95"
                    title="মেসেঞ্জার সেটিংস"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* SCROLLABLE BODY: SEARCH BAR, FILTER TABS, SELLERS CAROUSEL & CONVERSATION LIST ALL SCROLL TOGETHER */}
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100/80 dark:divide-slate-800/40">
                
                {/* SEARCH BAR & FILTER TABS (HIDDEN ON PHONE VIEW) */}
                <div className="hidden md:block p-3 space-y-2.5">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="messenger-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="সেলার, বায়ার বা সার্ভিস খুঁজুন..."
                      className="w-full pl-9 pr-8 py-2 bg-white dark:bg-white text-slate-900 dark:text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0084FF] shadow-xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Filter Pills (Hidden on Phone View) */}
                  <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('all')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer whitespace-nowrap ${
                        activeCategoryFilter === 'all'
                          ? 'bg-[#0084FF] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      সকল চ্যাট
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('online')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                        activeCategoryFilter === 'online'
                          ? 'bg-[#0084FF] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      অনলাইন ({defaultHistory.filter(h => h.isOnline).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('sellers')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer whitespace-nowrap ${
                        activeCategoryFilter === 'sellers'
                          ? 'bg-[#0084FF] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      টপ সেলার্স
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategoryFilter('orders')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer whitespace-nowrap ${
                        activeCategoryFilter === 'orders'
                          ? 'bg-[#0084FF] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      অর্ডার ও সাপোর্ট
                    </button>
                  </div>
                </div>



                {/* CONVERSATION, COURSES OR NOTIFICATION HISTORY LIST / DETAIL */}
                {activeTopTab === 'courses' ? (
                  /* COURSES & ACADEMY FEATURE SUITE (PHONE & DESKTOP VIEW) */
                  <div className="p-3 sm:p-5 space-y-4 w-full font-bengali overflow-y-auto max-h-[85vh] md:max-h-full">
                    {/* Course Stats Bar */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl text-center shadow-lg">
                      <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-bold">এনরোল্ড কোর্স</p>
                        <p className="text-base font-black text-[#1DB954] mt-0.5">৩ টি</p>
                      </div>
                      <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-bold">লার্নিং সময়</p>
                        <p className="text-base font-black text-sky-400 mt-0.5">৪৬ ঘণ্টা</p>
                      </div>
                      <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-bold">সার্টিফিকেট</p>
                        <p className="text-base font-black text-amber-400 mt-0.5">২ টি অর্জন</p>
                      </div>
                    </div>

                    {/* Interactive Feature Modal Popup (when clicked) */}
                    {activeCourseFeatureModal && (
                      <div className="p-4 rounded-2xl bg-slate-900 border-2 border-[#1DB954] shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                          type="button"
                          onClick={() => setActiveCourseFeatureModal(null)}
                          className="absolute top-3 right-3 p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2 text-[#1DB954]">
                          <Sparkles className="w-4 h-4" />
                          <h4 className="text-xs font-black uppercase tracking-wider">{activeCourseFeatureModal.featureTitle}</h4>
                        </div>
                        <p className="text-xs text-white font-bold mb-3">{activeCourseFeatureModal.courseTitle}</p>

                        {activeCourseFeatureModal.featureType === 'video' && (
                          <div className="space-y-3">
                            <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                              <div className="w-12 h-12 rounded-full bg-[#1DB954] text-white flex items-center justify-center shadow-lg mb-2">
                                <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                              </div>
                              <p className="text-xs font-bold text-white">Lesson 17: Redux Toolkit State Management & RTK Query</p>
                              <p className="text-[10px] text-slate-400 mt-1">Duration: 42 Minutes • HD 1080p Stream</p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                              <span className="text-[11px] text-emerald-400 font-bold">✓ ১৬/২০ লেসন সম্পূর্ণ</span>
                              <button onClick={() => alert('পরবর্তী ক্লাসে চলে যাওয়া হচ্ছে...')} className="px-3 py-1.5 bg-[#1DB954] text-white font-black rounded-lg text-xs hover:bg-emerald-400 transition cursor-pointer">
                                পরবর্তী লেসন →
                              </button>
                            </div>
                          </div>
                        )}

                        {activeCourseFeatureModal.featureType === 'certificate' && (
                          <div className="space-y-3 text-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1 border border-amber-500/30">
                              <Award className="w-6 h-6" />
                            </div>
                            <h5 className="text-xs font-black text-amber-300">PTENit Verified Digital Course Certificate</h5>
                            <p className="text-[11px] text-slate-300">শিক্ষার্থী: সোহাগ কাজী (ভেরিফাইড আইডি: PTEN-CERT-8841)</p>
                            <div className="pt-2 flex items-center justify-center gap-2">
                              <button onClick={() => alert('সার্টিফিকেট PDF ডাউনলোড শুরু হয়েছে!')} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow">
                                <Download className="w-4 h-4" />
                                <span>PDF সার্টিফিকেট ডাউনলোড</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {activeCourseFeatureModal.featureType === 'source_code' && (
                          <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-sky-400" />
                                <span className="font-bold text-white text-[11px]">Complete Source Code (ZIP File)</span>
                              </div>
                              <button onClick={() => alert('সোর্স কোড জিপ ফাইল ডাউনলোড হচ্ছে...')} className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-md text-[10px] cursor-pointer">
                                ডাউনলোড (48 MB)
                              </button>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[#1DB954]" />
                                <span className="font-bold text-white text-[11px]">Official GitHub Repository</span>
                              </div>
                              <a href="https://github.com" target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-md text-[10px] cursor-pointer">
                                গিটহাব লিংক ↗
                              </a>
                            </div>
                          </div>
                        )}

                        {activeCourseFeatureModal.featureType === 'live_class' && (
                          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                              <Video className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-white">লাইভ ডাউট ক্লিয়ারিং সেশন (Google Meet)</p>
                            <p className="text-[11px] text-slate-400">সময়: আজ রাত ৯:০০ টা • ইন্সট্রাকটর: প্রকৌশলী আল-আমিন</p>
                            <button onClick={() => createGoogleMeetCall('course-live')} className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow">
                              <Video className="w-4 h-4" />
                              <span>সরাসরি লাইভ ক্লাসে জয়েন করুন</span>
                            </button>
                          </div>
                        )}

                        {activeCourseFeatureModal.featureType === 'quiz' && (
                          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                            <p className="text-xs font-bold text-white">মডিউল কুইজ পরীক্ষা - মডিউল ৪ (Redux & Async Thunks)</p>
                            <div className="p-2.5 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800">
                              <p className="font-semibold text-white mb-1.5">প্রশ্ন ১: RTK Query-তে `useQuery` হুক ব্যবহারের প্রধান সুবিধা কোনটি?</p>
                              <div className="space-y-1">
                                <label className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded cursor-pointer hover:bg-slate-700">
                                  <input type="radio" name="quiz" className="accent-[#1DB954]" defaultChecked />
                                  <span>অটোমেটিক ক্যাশিং ও রি-ফেচিং সুবিধা প্রদান করে</span>
                                </label>
                                <label className="flex items-center gap-2 p-1.5 bg-slate-800/80 rounded cursor-pointer hover:bg-slate-700">
                                  <input type="radio" name="quiz" />
                                  <span>শুধু লোকাল স্টোরেজ ডাটা সেভ করে</span>
                                </label>
                              </div>
                            </div>
                            <button onClick={() => alert('কুইজ উত্তর সাবমিট করা হয়েছে! স্কোর: ১০০%')} className="w-full py-2 bg-[#1DB954] hover:bg-emerald-400 text-white font-black text-xs rounded-xl cursor-pointer">
                              উত্তর জমা দিন
                            </button>
                          </div>
                        )}

                        {activeCourseFeatureModal.featureType === 'qna' && (
                          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                            <p className="text-xs font-bold text-white">ইন্সট্রাকটরের কাছে সরাসরি প্রশ্ন করুন</p>
                            <textarea
                              placeholder="আপনার সমস্যা বা প্রশ্ন বিস্তারিত লিখুন..."
                              rows={2}
                              className="w-full p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                            />
                            <button onClick={() => alert('আপনার প্রশ্ন সফলভাবে সাবমিট হয়েছে। ইন্সট্রাকটর শীঘ্রই উত্তর দিবেন।')} className="w-full py-2 bg-[#1DB954] text-white font-black text-xs rounded-xl cursor-pointer">
                              প্রশ্ন পাঠান
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section Title */}
                    <div className="flex items-center justify-between pt-1">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#1DB954]" />
                        <span>এনরোল্ড কোর্সসমূহ ও এনাবেল্ড ফিচারস</span>
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold">লাইফটাইম অ্যাক্সেস</span>
                    </div>

                    {/* Course List Cards */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 'course-mern-pro',
                          title: 'Full-Stack MERN & Next.js Pro Web Development',
                          instructor: 'প্রকৌশলী আল-আমিন',
                          progress: 80,
                          completedLessons: 16,
                          totalLessons: 20,
                          badge: 'MERN Pro',
                          nextLessonTitle: 'Lesson 17: Redux Toolkit State Engine & RTK Query'
                        },
                        {
                          id: 'course-python-ai',
                          title: 'Python, Django & Artificial Intelligence Masterclass',
                          instructor: 'Shahinur Rahman',
                          progress: 45,
                          completedLessons: 9,
                          totalLessons: 20,
                          badge: 'AI & Django',
                          nextLessonTitle: 'Lesson 10: Building Custom Neural Networks'
                        },
                        {
                          id: 'course-flutter-app',
                          title: 'Mobile App Dev with React Native & Flutter',
                          instructor: 'Zubair Hossain',
                          progress: 20,
                          completedLessons: 4,
                          totalLessons: 20,
                          badge: 'App Dev',
                          nextLessonTitle: 'Lesson 5: Native Bridges & Camera API'
                        }
                      ].map((course) => (
                        <div key={course.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-md space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded-md bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-black border border-[#1DB954]/30">
                                  {course.badge}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                  {course.completedLessons}/{course.totalLessons} লেসন ({course.progress}%)
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                                {course.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-1">
                                ইনস্ট্রাকটর: <strong className="text-slate-200">{course.instructor}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#1DB954] to-emerald-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 font-semibold truncate">
                              পরবর্তী লেসন: {course.nextLessonTitle}
                            </p>
                          </div>

                          {/* 6 Feature Buttons Grid (Same as Messenger Action Buttons) */}
                          <div className="pt-1 border-t border-slate-800/80 grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => setActiveCourseFeatureModal({
                                courseTitle: course.title,
                                featureType: 'video',
                                featureTitle: '🎬 ক্লাস ভিডিও দেখা'
                              })}
                              className="p-2 rounded-xl bg-slate-800/90 hover:bg-[#1DB954]/20 hover:text-[#1DB954] text-slate-200 border border-slate-700/60 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1 active:scale-95"
                            >
                              <Play className="w-4 h-4 text-[#1DB954]" />
                              <span className="text-[10px] font-black leading-none">ক্লাস ভিডিও</span>
                            </button>

                            <button
                              onClick={() => setActiveCourseFeatureModal({
                                courseTitle: course.title,
                                featureType: 'certificate',
                                featureTitle: '📜 ভেরিফাইড সার্টিফিকেট'
                              })}
                              className="p-2 rounded-xl bg-slate-800/90 hover:bg-amber-500/20 hover:text-amber-400 text-slate-200 border border-slate-700/60 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1 active:scale-95"
                            >
                              <Award className="w-4 h-4 text-amber-400" />
                              <span className="text-[10px] font-black leading-none">সার্টিফিকেট</span>
                            </button>

                            <button
                              onClick={() => setActiveCourseFeatureModal({
                                courseTitle: course.title,
                                featureType: 'source_code',
                                featureTitle: '📂 সোর্স কোড ও নোটস'
                              })}
                              className="p-2 rounded-xl bg-slate-800/90 hover:bg-sky-500/20 hover:text-sky-400 text-slate-200 border border-slate-700/60 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1 active:scale-95"
                            >
                              <Download className="w-4 h-4 text-sky-400" />
                              <span className="text-[10px] font-black leading-none">সোর্স কোড</span>
                            </button>

                            <button
                              onClick={() => setActiveCourseFeatureModal({
                                courseTitle: course.title,
                                featureType: 'live_class',
                                featureTitle: '🎥 লাইভ ডাউট সেশন'
                              })}
                              className="p-2 rounded-xl bg-slate-800/90 hover:bg-blue-500/20 hover:text-blue-400 text-slate-200 border border-slate-700/60 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1 active:scale-95"
                            >
                              <Video className="w-4 h-4 text-blue-400" />
                              <span className="text-[10px] font-black leading-none">লাইভ ক্লাস</span>
                            </button>

                            <button
                              onClick={() => setActiveCourseFeatureModal({
                                courseTitle: course.title,
                                featureType: 'quiz',
                                featureTitle: '📝 কুইজ ও পরীক্ষা'
                              })}
                              className="p-2 rounded-xl bg-slate-800/90 hover:bg-purple-500/20 hover:text-purple-400 text-slate-200 border border-slate-700/60 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1 active:scale-95"
                            >
                              <HelpCircle className="w-4 h-4 text-purple-400" />
                              <span className="text-[10px] font-black leading-none">মডিউল কুইজ</span>
                            </button>

                            <button
                              onClick={() => setActiveCourseFeatureModal({
                                courseTitle: course.title,
                                featureType: 'qna',
                                featureTitle: '💬 ইন্সট্রাকটর প্রশ্নাবলি'
                              })}
                              className="p-2 rounded-xl bg-slate-800/90 hover:bg-pink-500/20 hover:text-pink-400 text-slate-200 border border-slate-700/60 transition cursor-pointer flex flex-col items-center justify-center text-center gap-1 active:scale-95"
                            >
                              <MessageSquare className="w-4 h-4 text-pink-400" />
                              <span className="text-[10px] font-black leading-none">প্রশ্ন করুন</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Browse Marketplace Courses Banner */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-[#1DB954]/40 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-white">নতুন কোর্স এক্সপ্লোর করুন</h4>
                        <p className="text-[10px] text-slate-300 mt-0.5">মার্কেটপ্লেসের ১০০+ প্রিমিয়াম টিউটোরিয়াল ও কোর্স</p>
                      </div>
                      <button
                        onClick={() => {
                          handleCloseAll();
                        }}
                        className="px-3 py-2 bg-[#1DB954] hover:bg-emerald-400 text-white font-black rounded-xl text-xs shrink-0 cursor-pointer transition shadow"
                      >
                        কোর্স ক্যাটালগ →
                      </button>
                    </div>
                  </div>
                ) : activeTopTab === 'notifications' ? (
                  selectedNotification ? (
                    /* NOTIFICATION DETAIL VIEW */
                    <div className="p-4 sm:p-5 flex flex-col h-full bg-white dark:bg-[#18222D] animate-in fade-in duration-200 w-full overflow-y-auto">
                      {/* Detail Card Content */}
                      <div className="space-y-4 max-w-lg mx-auto w-full">
                        <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
                          {getNotificationTypeIcon(selectedNotification)}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                              {selectedNotification.title}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 mt-1">
                              {selectedNotification.time}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                          {selectedNotification.message}
                        </div>

                        {selectedNotification.details && (
                          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                            {selectedNotification.details.badgeText && (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 font-bold text-[10px] mb-1">
                                {selectedNotification.details.badgeText}
                              </span>
                            )}
                            {selectedNotification.details.note && (
                              <p className="font-semibold">{selectedNotification.details.note}</p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="pt-2 flex items-center gap-3">
                          {(selectedNotification.targetTab === 'messenger' || selectedNotification.category === 'message' || selectedNotification.targetId) ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (selectedNotification.targetId) {
                                  setSelectedConversationId(selectedNotification.targetId);
                                  if (setActiveMessengerConversationId) setActiveMessengerConversationId(selectedNotification.targetId);
                                }
                                setActiveTopTab('messages');
                                setSelectedNotification(null);
                              }}
                              className="flex-1 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
                            >
                              <span>সরাসরি ইনবক্সে কথা বলুন</span>
                              <Mail className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const notifTitle = (selectedNotification.title || '').toLowerCase();
                                const notifMsg = (selectedNotification.message || '').toLowerCase();
                                const targetTab = selectedNotification.targetTab;

                                setSelectedNotification(null);
                                handleCloseAll();

                                if (targetTab === 'courses' || notifTitle.includes('কোর্স') || notifTitle.includes('মডিউল') || notifMsg.includes('মডিউল')) {
                                  if (onNavigateTab) onNavigateTab('courses', undefined, true);
                                  return;
                                }

                                if (targetTab === 'student-dashboard' || notifTitle.includes('অ্যাসাইনমেন্ট') || notifTitle.includes('assignment') || notifMsg.includes('অ্যাসাইনমেন্ট')) {
                                  if (onNavigateTab) onNavigateTab('student-dashboard', 'my-courses', true);
                                  return;
                                }

                                if (targetTab === 'financials' || selectedNotification.category === 'payout' || notifTitle.includes('ওয়ালেট') || notifTitle.includes('পেমেন্ট') || notifTitle.includes('বোনাস') || notifTitle.includes('ক্যাশআউট')) {
                                  if (onNavigateTab) onNavigateTab('financials', undefined, true);
                                  return;
                                }

                                if (targetTab === 'marketplace' || notifTitle.includes('অর্ডার') || notifTitle.includes('ord-') || notifTitle.includes('এস্ক্রো') || notifTitle.includes('গিগ')) {
                                  if (onNavigateTab) onNavigateTab('marketplace', 'my-orders', true);
                                  return;
                                }

                                if (targetTab && onNavigateTab) {
                                  onNavigateTab(targetTab, undefined, true);
                                } else if (onNavigateTab) {
                                  onNavigateTab('marketplace', 'All', true);
                                }
                              }}
                              className="flex-1 py-2.5 bg-[#0084FF] hover:bg-blue-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-xs cursor-pointer active:scale-95"
                            >
                              <span>{selectedNotification.actionLabel || 'ড্যাশবোর্ড / সেকশন ওপেন করুন'}</span>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              deleteNotification(selectedNotification.id);
                              setSelectedNotification(null);
                            }}
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs transition cursor-pointer"
                            title="নোটিফিকেশন মুছুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* NOTIFICATION LIST VIEW */
                    <div className="divide-y divide-slate-100/80 dark:divide-slate-800/40 w-full">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-bold">
                          কোনো নোটিফিকেশন পাওয়া যায়নি।
                        </div>
                      ) : (
                        notifications
                          .filter(n => {
                            if (!searchQuery) return true;
                            return n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
                          })
                          .sort((a, b) => {
                            if (!a.read && b.read) return -1;
                            if (a.read && !b.read) return 1;
                            return 0;
                          })
                          .map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationRead(n.id);
                                setSelectedNotification(n);
                              }}
                              className={`p-3 sm:px-4 sm:py-3.5 flex items-center gap-3 cursor-pointer transition-colors w-full ${
                                !n.read
                                  ? 'bg-blue-50/90 dark:bg-slate-800/90 font-semibold'
                                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-85'
                              }`}
                            >
                              {/* Google Material Icon Badge */}
                              <div className="relative shrink-0">
                                {getNotificationTypeIcon(n)}
                                {!n.read && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#1DB954] rounded-full border-2 border-white dark:border-[#18222D] shadow-xs" />
                                )}
                              </div>

                              {/* Title, Time & Snippet */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className={`text-xs sm:text-sm font-black truncate ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {n.title}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-1">
                                    {n.time}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium flex-1 mr-2">
                                    {n.message}
                                  </p>
                                  {!n.read && (
                                    <span className="min-w-5 h-5 px-1.5 bg-[#1DB954] text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-xs ring-2 ring-white dark:ring-slate-900">
                                      নতুন
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  )
                ) : (
                  /* CONVERSATION HISTORY LIST (PROFESSIONAL MARKETPLACE PROFILES) */
                  <div className="divide-y divide-slate-100/80 dark:divide-slate-800/40">
                  {conversationList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      কোনো চ্যাট হিস্ট্রি পাওয়া যায়নি।
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
                              ? 'bg-blue-50/80 dark:bg-slate-800/80'
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
                )}

              </div>



            </div>

            {/* RIGHT PANE: FULL SCREEN CHAT CONVERSATION VIEW */}
            <div className={`flex-1 flex flex-col h-full bg-white dark:bg-[#18222D] ${
              selectedConversationId ? 'flex' : 'hidden md:flex'
            }`}>
              {currentActiveWin ? (
                <FullScreenChatThread
                  win={currentActiveWin}
                  onBack={() => {
                    setSelectedConversationId(null);
                    if (setActiveMessengerConversationId) setActiveMessengerConversationId(null);
                  }}
                  onCloseFullScreen={handleCloseAll}
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
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-[#0084FF]">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
                    মার্কেটপ্লেস চ্যাট ও অর্ডার ইনবক্স
                  </h3>
                  <p className="text-xs max-w-xs leading-relaxed">
                    বাম পাশের তালিকা থেকে যেকোনো ভেরিফাইড সেলার নির্বাচন করে সরাসরি কথা বলুন, কাস্টম অফার পাঠান এবং Google Meet কল শুরু করুন।
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 3. SETTINGS MODAL */}
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
                <Settings className="w-5 h-5 text-[#0084FF]" />
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
                  className="w-5 h-5 accent-[#0084FF] cursor-pointer"
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
                  className="w-5 h-5 accent-[#0084FF] cursor-pointer"
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
                  className="w-5 h-5 accent-[#0084FF] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">রিড রিসিপ্ট (Read Receipts)</div>
                  <div className="text-[11px] text-slate-400">মেসেজ পড়া হয়েছে কিনা ব্লু-টিক দেখাবে</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.readReceipts}
                  onChange={(e) => setSettings({ ...settings, readReceipts: e.target.checked })}
                  className="w-5 h-5 accent-[#0084FF] cursor-pointer"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 bg-[#0084FF] hover:bg-[#0073e6] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NOTE UPDATE MODAL */}
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
                ✕
              </button>
            </div>

            <input
              type="text"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="যেমন: Available for hire 💼"
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
            />

            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-400 font-bold">কুইক প্রিসেট:</div>
              <div className="flex flex-wrap gap-1.5">
                {['Available for hire 💼', 'Taking new orders 🚀', 'Fast delivery ⚡', 'In a client meeting 📞', 'Working on projects 💻'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setUserNote(preset)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-[#0084FF] transition cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsNoteModalOpen(false)}
              className="w-full py-2.5 bg-[#0084FF] hover:bg-[#0073e6] text-white text-xs font-black rounded-xl transition cursor-pointer shadow-md"
            >
              নোট আপডেট করুন
            </button>
          </div>
        </div>
      )}

      {/* 5. NEW CHAT PICKER MODAL */}
      {isNewChatModalOpen && (
        <div 
          onClick={() => setIsNewChatModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0084FF]" />
                <span>নতুন সেলার চ্যাট শুরু করুন</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-1">
              {defaultHistory.map(seller => (
                <div
                  key={seller.id}
                  onClick={() => {
                    setSelectedConversationId(seller.id);
                    setIsNewChatModalOpen(false);
                  }}
                  className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 flex items-center gap-3 cursor-pointer transition"
                >
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                        {seller.name}
                      </h4>
                      {seller.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#1DB954]/10 text-[#1DB954] rounded-full">
                          {seller.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {seller.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. AI ASSISTANT MODAL */}
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
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    PiTen Smart AI Assistant
                  </h3>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                    মার্কেটপ্লেস মেসেজিং ও প্রপোজাল হেল্পার
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (currentActiveWin) {
                    sendChatMessage(currentActiveWin.id, '💼 [কাস্টম প্রপোজাল ড্রাফট]: আসসালামু আলাইকুম! আপনার প্রজেক্টের বিস্তারিত পড়েছি। আমি ৩ দিনের মধ্যে ১০০% কোয়ালিটি নিশ্চিত করে ডেলিভারি দিতে প্রস্তুত।');
                  }
                  setIsAiModalOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 hover:scale-[1.01] transition cursor-pointer font-medium"
              >
                ✨ <strong className="font-bold">কুইক প্রপোজাল পাঠান:</strong> "৩ দিনের মধ্যে ১০০% কোয়ালিটি ডেলিভারির অফার"
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentActiveWin) {
                    sendChatMessage(currentActiveWin.id, '📞 আসসালামু আলাইকুম! প্রজেক্টের জরুরি বিষয়গুলো দ্রুত আলোচনা করার জন্য একটি Google Meet মিটিংয়ে যুক্ত হতে পারবেন?');
                  }
                  setIsAiModalOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 hover:scale-[1.01] transition cursor-pointer font-medium"
              >
                🎥 <strong className="font-bold">মিটিং রিকুয়েস্ট পাঠান:</strong> "জরুরি বিষয় আলোচনার জন্য Google Meet কল"
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentActiveWin) {
                    sendChatMessage(currentActiveWin.id, '✅ ধন্যবাদ! আমি এখনই কাজ শুরু করছি এবং নিয়মিত কাজের অগ্রগতি মেসেঞ্জারে আপডেট জানাব।');
                  }
                  setIsAiModalOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 hover:scale-[1.01] transition cursor-pointer font-medium"
              >
                ⚡ <strong className="font-bold">কনফার্মেশন মেসেজ:</strong> "ধন্যবাদ! কাজ শুরু হয়েছে ও দ্রুত আপডেট দেওয়া হবে।"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. LIVE VOICE CALL OVERLAY */}
      {activeCallState?.active && (
        <div className="fixed inset-0 z-[100000] pointer-events-auto bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white font-bengali animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-4 max-w-sm w-full">
            <div className="relative inline-block">
              <img
                src={activeCallState.callerAvatar}
                alt={activeCallState.callerName}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#0084FF] shadow-2xl mx-auto animate-pulse"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>

            <div>
              <h3 className="text-xl font-black">{activeCallState.callerName}</h3>
              <p className="text-xs text-sky-400 font-bold mt-0.5">PiTen ভয়েস কল চলছে (HD অডিও)</p>
              <div className="text-sm font-mono text-slate-300 mt-2 font-bold">
                {Math.floor(activeCallState.duration / 60).toString().padStart(2, '0')}:
                {(activeCallState.duration % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6">
              <button
                type="button"
                onClick={() => setActiveCallState(prev => prev ? { ...prev, muted: !prev.muted } : null)}
                className={`p-4 rounded-full transition cursor-pointer ${
                  activeCallState.muted ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
                title={activeCallState.muted ? 'আনমিউট করুন' : 'মিউট করুন'}
              >
                {activeCallState.muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveCallState(null)}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl transition cursor-pointer active:scale-95"
                title="কল শেষ করুন"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ========================================================================= */
/* SINGLE FLOATING WINDOW (Desktop-only Mini window) */
/* ========================================================================= */

interface SingleChatWindowProps {
  win: {
    id: string;
    orderId?: string;
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
    isClosed?: boolean;
    isReadOnly?: boolean;
  };
  onClose: () => void;
  onMinimize: () => void;
  onSend: (text: string) => void;
  onCreateMeet: () => void;
  onExpandFullScreen: () => void;
  currentUserName: string;
}

const SingleChatWindow: React.FC<SingleChatWindowProps> = ({
  win,
  onClose,
  onMinimize,
  onSend,
  onCreateMeet,
  onExpandFullScreen
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
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
    onSend(`📎 [ফাইল সংযুক্ত]: ${file.name} (${sizeKb} KB)`);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="w-[320px] sm:w-[360px] max-w-[calc(100vw-1rem)] bg-white dark:bg-[#1C2733] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col pointer-events-auto transition-all duration-200 overflow-hidden ring-1 ring-black/10 animate-in slide-in-from-bottom-5 duration-200">
      {/* Header Bar */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#0084FF] to-[#0066CC] text-white flex items-center justify-between select-none shadow-md">
        <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer" onClick={onMinimize} title="মিনিমাইজ / ম্যাক্সিমাইজ করুন">
          <div className="relative shrink-0">
            {win.senderRole === 'customer' || win.senderRole === 'buyer' ? (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center border-2 border-white/60 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            ) : (
              <img
                src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={win.senderName}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/60 shadow-xs"
              />
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-1.5 ring-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-black truncate leading-tight flex items-center gap-1">
              <span>{win.senderName}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-200 shrink-0" />
            </h4>
            <span className="text-[10px] text-sky-100 font-bold block truncate">
              {win.orderId ? `📦 অর্ডার #${win.orderId.slice(-6)} চ্যাট` : '🟢 অনলাইনে আছেন'}
            </span>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onCreateMeet}
            className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer text-white"
            title="Google Meet ভিডিও মিটিং রুম তৈরি করুন"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onExpandFullScreen}
            className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer text-white"
            title="ফুল ইনবক্স ভিউ খুলুন"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onMinimize}
            className="p-1.5 hover:bg-white/20 rounded-lg transition cursor-pointer font-bold text-xs text-white"
            title={win.minimized ? 'খুলুন' : 'মিনিমাইজ করুন'}
          >
            _
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-rose-500/80 hover:bg-rose-600 rounded-lg transition cursor-pointer text-white font-black shadow-xs active:scale-95"
            title="চ্যাট পপআপ বন্ধ করুন (X)"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {!win.minimized && (
        <>
          {/* Order Info Bar (if linked to an order) */}
          {win.orderId && (
            <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>প্রজেক্ট অর্ডার #{win.orderId.slice(-6)} এর চ্যাট রুম</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-black">
                লাইভ এস্ক্রো
              </span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="h-68 sm:h-76 overflow-y-auto p-3 space-y-2.5 bg-slate-50 dark:bg-[#121B24] text-xs">
            {win.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[88%] text-xs leading-relaxed shadow-xs ${
                    m.isSelf
                      ? 'bg-[#0084FF] text-white rounded-tr-xs font-medium'
                      : 'bg-white dark:bg-[#243447] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>

                  {m.meetLink && (
                    <div className="mt-2 p-2 bg-slate-900 text-white rounded-xl border border-sky-400/50 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300">
                        <Video className="w-3.5 h-3.5 animate-pulse text-sky-400" />
                        <span>Google Meet মিটিং লিংক</span>
                      </div>
                      <a
                        href={m.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-1.5 px-2.5 bg-[#0084FF] hover:bg-[#0073e6] text-white text-center font-black text-[11px] rounded-lg transition"
                      >
                        🚀 মিটিংয়ে যুক্ত হন
                      </a>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Toolbar */}
          {showEmojis && (
            <div className="px-3 py-1.5 bg-slate-100 dark:bg-[#18222D] border-t border-slate-200 dark:border-slate-700 flex items-center justify-around gap-1 shrink-0">
              {['👍', '❤️', '😊', '🔥', '🎉', '👏', '🙏', '💯', '🚀'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    onSend(emoji);
                    setShowEmojis(false);
                  }}
                  className="text-lg p-1 hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input Form */}
          <form onSubmit={handleSend} className="p-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1.5 bg-white dark:bg-[#1C2733]">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-500 dark:text-slate-300 hover:text-[#0084FF] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition cursor-pointer shrink-0"
              title="ফাইল বা ছবি সংযুক্ত করুন"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-1.5 text-slate-500 dark:text-slate-300 hover:text-[#0084FF] hover:bg-blue-50 dark:hover:bg-slate-800 rounded-full transition cursor-pointer shrink-0"
              title="ইমোজি"
            >
              <Smile className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="মেসেজ লিখুন..."
              className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2 rounded-full transition cursor-pointer shadow-xs active:scale-95 flex items-center justify-center shrink-0 ${
                inputText.trim()
                  ? 'bg-[#0084FF] hover:bg-[#0073e6] text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
              title="মেসেজ পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

/* ========================================================================= */
/* FULL SCREEN CHAT THREAD (High-End Marketplace Experience) */
/* ========================================================================= */

interface FullScreenChatThreadProps {
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
    isClosed?: boolean;
    isReadOnly?: boolean;
  };
  onBack: () => void;
  onCloseFullScreen: () => void;
  onSend: (text: string) => void;
  onCreateMeet: () => void;
  onStartVoiceCall: () => void;
  currentUserName: string;
}

const FullScreenChatThread: React.FC<FullScreenChatThreadProps> = ({
  win,
  onBack,
  onCloseFullScreen,
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
      {/* TOP HEADER BAR (HIDDEN ON PHONE VIEW AS ATTACHED DARK BAR HANDLES IT) */}
      <div className="hidden md:flex px-3 sm:px-4 py-2.5 bg-white dark:bg-[#1C2733] border-b border-slate-200/80 dark:border-slate-800 items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Prominent Back Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
            className="p-2 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition cursor-pointer active:scale-95 shrink-0"
            title="ইনবক্সে ফিরে যান"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Seller Avatar */}
          <div className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-emerald-400 via-blue-500 to-cyan-400 shadow-xs">
            <img
              src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={win.senderName}
              className="w-10 h-10 rounded-full object-cover border border-white dark:border-[#1C2733]"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#1C2733]" />
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
            onClick={onCreateMeet}
            className="p-2 text-[#0084FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition cursor-pointer"
            title="Google Meet ভিডিও কল"
          >
            <Video className="w-5 h-5" />
          </button>

          {/* Voice Call */}
          <button
            type="button"
            onClick={onStartVoiceCall}
            className="p-2 text-[#0084FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition cursor-pointer"
            title="ভয়েস কল"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MESSAGES FEED */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-[#101923] no-scrollbar">
        {/* Profile Intro Banner */}
        <div className="py-6 text-center space-y-2 border-b border-slate-200/50 dark:border-slate-800/60 max-w-sm mx-auto">
          <img
            src={win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={win.senderName}
            className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-white dark:border-[#1C2733] shadow-md"
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-full text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>এন্ড-টু-এন্ড এনক্রিপ্টেড ও ১০০% নিরাপদ পেমেন্ট হিস্ট্রি</span>
          </div>
        </div>

        {win.messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-end gap-2 ${m.isSelf ? 'justify-end' : 'justify-start'}`}
          >
            {!m.isSelf && (
              win.senderRole === 'customer' || win.senderRole === 'buyer' ? (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 mb-1 border border-slate-700">
                  <User className="w-3.5 h-3.5" />
                </div>
              ) : (
                <img
                  src={m.senderAvatar || win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                />
              )
            )}

            <div className={`flex flex-col ${m.isSelf ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
              <div
                className={`px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  m.isSelf
                    ? 'bg-[#0084FF] text-white font-medium rounded-2xl rounded-br-xs'
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
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                )}

                {m.meetLink && (
                  <div className="mt-2.5 p-3 bg-slate-900 text-white border border-[#0084FF]/60 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                      <Video className="w-4 h-4 text-sky-400 animate-pulse" />
                      <span>Google Meet ভিডিও মিটিং রুম তৈরি হয়েছে</span>
                    </div>
                    <a
                      href={m.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-[#0084FF] hover:bg-[#0073e6] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
                    >
                      <span>🚀 মিটিংয়ে যুক্ত হন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 mt-0.5 px-1.5">
                <span className="text-[10px] text-slate-400">{m.time}</span>
                {m.isSelf && <CheckCheck className="w-3.5 h-3.5 text-[#0084FF]" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK EMOJI BAR */}
      {showEmojis && (
        <div className="px-4 py-2 bg-white dark:bg-[#1C2733] border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-around gap-2 shrink-0 animate-in slide-in-from-bottom-2">
          {['👍', '❤️', '😊', '🔥', '🎉', '👏', '🙏', '💯', '🚀'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSend(emoji);
                setShowEmojis(false);
              }}
              className="text-xl p-1 hover:scale-125 transition-transform cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* BOTTOM INPUT BAR */}
      {win.isClosed || win.isReadOnly ? (
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2 shrink-0">
          <Lock className="w-4 h-4 shrink-0" />
          <span>প্রজেক্টটি সম্পন্ন হয়েছে ও ডেলিভারি রিলিজড। চ্যাট মোড বন্ধ রয়েছে।</span>
        </div>
      ) : (
        <form onSubmit={handleSend} className="p-1.5 sm:p-2.5 bg-white dark:bg-[#1C2733] border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1 sm:gap-2 shrink-0 w-full max-w-full overflow-hidden">
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
            className="p-1.5 sm:p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-full transition cursor-pointer shrink-0 active:scale-95"
            title="নতুন ডাইরেক্ট প্রজেক্ট অর্ডার পাঠান"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 2. Attach file */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:p-2 text-[#0084FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition cursor-pointer shrink-0"
            title="ছবি বা ফাইল সংযুক্ত করুন"
          >
            <Paperclip className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          {/* 3. Emoji */}
          <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-1.5 sm:p-2 text-[#0084FF] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition cursor-pointer shrink-0"
            title="ইমোজি"
          >
            <Smile className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="মেসেজ লিখুন..."
            className="min-w-0 flex-1 bg-slate-100 dark:bg-[#243447] border-0 rounded-full px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
          />

          {/* Send Message Button - Always visible */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer transition shadow-xs shrink-0 active:scale-95 flex items-center justify-center ${
              inputText.trim()
                ? 'bg-[#0084FF] hover:bg-[#0073e6] text-white opacity-100'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            title="মেসেজ পাঠান"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </form>
      )}

      {/* CUSTOM OFFER MODAL */}
      {isOfferModalOpen && (
        <div 
          onClick={() => setIsOfferModalOpen(false)}
          className="fixed inset-0 z-[100000] pointer-events-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-bengali animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C2733] border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                <span>কাস্টম প্রজেক্ট অফার পাঠান</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  সার্ভিস / প্রজেক্টের বিবরণ
                </label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="যেমন: ফুল স্ট্যাক ওয়েবসাইট ডেভেলপমেন্ট"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    বাজেট (টাকা ৳)
                  </label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="৫০০০"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    ডেলিভারি সময়
                  </label>
                  <input
                    type="text"
                    value={offerDelivery}
                    onChange={(e) => setOfferDelivery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="৩ দিন"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSendCustomOffer}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition cursor-pointer"
              >
                অফার পাঠান
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MarketplaceMessengerView } from './MarketplaceMessengerView';

