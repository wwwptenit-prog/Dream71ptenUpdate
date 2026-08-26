import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Search,
  ChevronLeft,
  MessageSquare,
  ShoppingBag,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { NotificationItem } from '../types';

interface NotificationCenterModalProps {
  onNavigateTab?: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ onNavigateTab }) => {
  const {
    notifications,
    isNotificationCenterOpen,
    isMessengerInboxOpen,
    closeNotificationCenter,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    deleteNotification,
    openMessengerInbox,
    playAppSound
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'orders' | 'updates'>('all');

  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  if (!isNotificationCenterOpen || isMessengerInboxOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  // Filter & Sort Notifications (Unread notifications automatically sit at top in serial)
  const filteredNotifications = notifications
    .filter(n => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'orders') return n.type === 'success' || n.category === 'payout' || n.targetTab === 'marketplace';
      if (activeFilter === 'updates') return n.type === 'info' || n.type === 'warning' || n.category === 'system';

      return true;
    })
    .sort((a, b) => {
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;
      return 0;
    });

  const handleActionClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    playAppSound('notification');
    closeNotificationCenter();

    const notifTitle = (notif.title || '').toLowerCase();
    const notifMsg = (notif.message || '').toLowerCase();

    if (notif.targetTab === 'messenger' || notif.category === 'message' || notif.targetId?.startsWith('chat-')) {
      openMessengerInbox(notif.targetId);
      return;
    }

    if (notif.targetTab === 'courses' || notifTitle.includes('কোর্স') || notifTitle.includes('মডিউল') || notifMsg.includes('মডিউল')) {
      if (onNavigateTab) onNavigateTab('courses', undefined, true);
      return;
    }

    if (notif.targetTab === 'student-dashboard' || notifTitle.includes('অ্যাসাইনমেন্ট') || notifTitle.includes('assignment') || notifMsg.includes('অ্যাসাইনমেন্ট')) {
      if (onNavigateTab) onNavigateTab('student-dashboard', 'my-courses', true);
      return;
    }

    if (notif.targetTab === 'financials' || notif.category === 'payout' || notifTitle.includes('ওয়ালেট') || notifTitle.includes('পেমেন্ট') || notifTitle.includes('বোনাস') || notifTitle.includes('ক্যাশআউট')) {
      if (onNavigateTab) onNavigateTab('financials', undefined, true);
      return;
    }

    if (notif.targetTab === 'marketplace' || notifTitle.includes('অর্ডার') || notifTitle.includes('ord-') || notifTitle.includes('এস্ক্রো') || notifTitle.includes('গিগ')) {
      if (onNavigateTab) onNavigateTab('marketplace', 'my-orders', true);
      return;
    }

    if (notif.targetTab && onNavigateTab) {
      onNavigateTab(notif.targetTab, undefined, true);
    }
  };

  const getNotifIcon = (notif: NotificationItem) => {
    if (notif.senderAvatar) {
      return (
        <img
          src={notif.senderAvatar}
          alt={notif.title}
          className="w-10 h-10 rounded-full object-cover border border-[#1DB954] shrink-0"
        />
      );
    }

    if (notif.type === 'success' || notif.category === 'payout' || notif.title.includes('৳')) {
      return (
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[#1DB954]">
          <ShoppingBag className="w-5 h-5" />
        </div>
      );
    }

    if (notif.type === 'warning') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#0084FF]">
        <Sparkles className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      
      {/* PHONE VIEW (100% Full Screen Mobile & Centered Desktop Modal) */}
      <div className="w-full h-[100dvh] sm:h-[650px] sm:max-w-lg sm:rounded-3xl bg-[#0B132B] text-slate-100 flex flex-col overflow-hidden shadow-2xl border-0 sm:border sm:border-slate-800/80 font-bengali">
        
        {/* HEADER BAR */}
        <div className="p-3.5 sm:p-4 bg-[#142238] border-b border-slate-800/90 flex flex-col gap-2 shrink-0">
          <div className="flex items-center justify-between">
            {selectedNotification ? (
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="flex items-center gap-1.5 text-slate-200 hover:text-white transition cursor-pointer active:scale-95 py-1 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700"
              >
                <ChevronLeft className="w-5 h-5 text-[#1DB954] stroke-[2.5]" />
                <span className="text-xs sm:text-sm font-black">তালিকায় ফিরে যান</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={closeNotificationCenter}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer active:scale-95"
                  title="বন্ধ করুন"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5] text-slate-400 hover:text-white" />
                </button>
                
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954]">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-sm sm:text-base font-black text-white tracking-tight leading-none flex items-center gap-1.5">
                        <span>নোটিফিকেশন সেন্টার</span>
                        <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                        {notifications.length > 0 && (
                          <span className="min-w-5 h-5 px-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-xs">
                            {unreadCount > 0 ? unreadCount : notifications.length}
                          </span>
                        )}
                      </h2>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 tracking-wide leading-tight mt-0.5 font-sans">
                      PTENit Notifications & Updates
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={closeNotificationCenter}
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 hover:text-rose-200 transition cursor-pointer active:scale-95 shrink-0 border border-rose-500/20"
              title="বন্ধ করুন (X)"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* QUICK TOP ACTION BUTTONS */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <button
              type="button"
              onClick={() => {
                markAllNotificationsRead();
                playAppSound('notification');
              }}
              disabled={unreadCount === 0}
              className="text-[#1DB954] hover:underline disabled:opacity-40 font-bold flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
            >
              <CheckCheck className="w-4 h-4" />
              <span>সব পড়া চিহ্নিত করুন</span>
            </button>

            <button
              type="button"
              onClick={() => {
                clearAllNotifications();
                playAppSound('notification');
              }}
              disabled={notifications.length === 0}
              className="text-rose-400 hover:underline disabled:opacity-40 font-bold flex items-center gap-1.5 cursor-pointer text-[11px] sm:text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>সব মুছে ফেলুন</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR & FILTER TABS */}
        <div className="p-3 bg-[#0E1B33] border-b border-slate-800/80 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নোটিফিকেশন বা বার্তা খুঁজুন..."
              className="w-full pl-9 pr-8 py-2 bg-slate-800/90 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-bold pb-0.5">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#1DB954] text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              সকল ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeFilter === 'unread'
                  ? 'bg-[#1DB954] text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              পড়া হয়নি ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('orders')}
              className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                activeFilter === 'orders'
                  ? 'bg-[#1DB954] text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              অর্ডার ও পেমেন্ট
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('updates')}
              className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                activeFilter === 'updates'
                  ? 'bg-[#1DB954] text-slate-950 font-black shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              সিস্টেম ও সাপোর্ট
            </button>
          </div>
        </div>

        {/* NOTIFICATION LIST (SCROLLABLE BODY) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 w-full bg-[#0B132B]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                <Bell className="w-8 h-8 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-black text-white">কোনো নোটিফিকেশন পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-1">আপনার সকল নতুন নোটিশ ও পেমেন্ট আপডেট এখানে জমা হবে।</p>
              </div>
            </div>
          ) : selectedNotification ? (
            /* NOTIFICATION DETAIL VIEW */
            <div className="p-4 sm:p-5 flex flex-col h-full bg-[#0B132B] animate-in fade-in duration-200 overflow-y-auto">
              <div className="space-y-4 max-w-lg mx-auto w-full">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  {getNotifIcon(selectedNotification)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white leading-tight">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 font-sans">
                      {selectedNotification.time}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedNotification.message}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleActionClick(selectedNotification)}
                    className="flex-1 py-3 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-md cursor-pointer active:scale-95"
                  >
                    <span>{selectedNotification.actionLabel || 'সরাসরি ওপেন করুন'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      deleteNotification(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="p-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-bold text-xs transition cursor-pointer border border-rose-500/20"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  setSelectedNotification(notif);
                }}
                className={`p-3.5 sm:px-4 sm:py-3.5 flex items-start gap-3 cursor-pointer transition-colors w-full ${
                  !notif.read
                    ? 'bg-slate-800/80 hover:bg-slate-800'
                    : 'hover:bg-slate-800/40 opacity-80'
                }`}
              >
                {getNotifIcon(notif)}

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`text-xs sm:text-sm font-black truncate ${!notif.read ? 'text-white' : 'text-slate-200'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-bold ml-1 font-sans">{notif.time}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  {/* Action button & Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        !notif.read ? 'bg-emerald-500/20 text-[#1DB954]' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {!notif.read ? 'নতুন নোটিশ' : 'পড়া হয়েছে'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(notif);
                        }}
                        className="text-[11px] font-black text-[#1DB954] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>ওপেন</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
