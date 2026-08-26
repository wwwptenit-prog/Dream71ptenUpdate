import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Star,
  BadgeCheck,
  Eye,
  Play,
  Video,
  CreditCard,
  ShoppingBag,
  Check,
  Crown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Briefcase,
  User,
  Send,
  HelpCircle,
  FileText,
  PhoneCall,
  Copy,
  Trash2,
  Edit,
  BarChart2,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { MarketplaceGig, User as UserType } from '../types';
import { useData } from '../context/DataContext';
import { OrderCheckoutModal } from './OrderCheckoutModal';

interface GigDetailPageProps {
  gig: MarketplaceGig;
  allGigs: MarketplaceGig[];
  currentUser: UserType | null;
  onBack: () => void;
  onSelectGig: (gig: MarketplaceGig) => void;
  openAuthModal?: () => void;
  createDirectGigOrder?: (gigId: string, packageType: string, note: string) => void;
  setActiveTab?: (tab: string) => void;
  onOrderSuccess?: (orderId?: string) => void;
}

export const GigDetailPage: React.FC<GigDetailPageProps> = ({
  gig,
  allGigs,
  currentUser,
  onBack,
  onSelectGig,
  openAuthModal,
  setActiveTab: setGlobalActiveTab,
  onOrderSuccess
}) => {
  const { siteSettings, deleteGig, updateGig, openChatWindow, openMessengerInbox, marketplaceOrders } = useData();

  // Active order for this gig placed by current user
  const userActiveOrder = marketplaceOrders?.find(o => {
    if (o.gigId !== gig.id && o.title !== gig.title) return false;
    if (o.status === 'cancelled') return false;
    if (!currentUser) return true;
    return (
      o.buyerId === currentUser.id ||
      (currentUser.email && o.buyerEmail === currentUser.email) ||
      (currentUser.name && o.buyerName === currentUser.name) ||
      (currentUser.phone && o.buyerPhone === currentUser.phone)
    );
  });

  const handleOpenSellerChat = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (openChatWindow) {
      const sellerId = `chat-seller-${(gig.sellerName || 'seller').replace(/\s+/g, '-').toLowerCase()}`;
      openChatWindow({
        id: sellerId,
        orderId: userActiveOrder?.id,
        senderName: gig.sellerName || 'গিগ প্রোভাইডার (PTENit Pro)',
        senderRole: 'seller',
        senderAvatar: gig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        initialMessage: `আসসালামু আলাইকুম ${gig.sellerName || 'ভাইয়া'}! আমি আপনার "${gig.title}" সার্ভিসটির বিষয়ে আলোচনা ও মেসেজ দিতে চাচ্ছি।`
      });
    } else {
      window.open(`https://wa.me/${siteSettings?.whatsapp || '8801712345678'}?text=I%20want%20to%20discuss%20about%20"${encodeURIComponent(gig.title)}"`, '_blank');
    }
  };

  // Active Main Tab State
  const [activeTab, setActiveTab] = useState<'packages' | 'overview' | 'portfolio' | 'reviews' | 'seller' | 'faqs'>('packages');

  // Package State
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');

  // Order Checkout Modal State
  const [isOrderCheckoutOpen, setIsOrderCheckoutOpen] = useState(false);

  // Gallery & Media State
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Saved / Favorite State
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = localStorage.getItem('ptenit_saved_gigs');
      const list = saved ? JSON.parse(saved) : [];
      return list.includes(gig.id);
    } catch {
      return false;
    }
  });

  // Edit Modal & Analytics States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(gig.title);
  const [editCategory, setEditCategory] = useState(gig.category);
  const [editPriceBasic, setEditPriceBasic] = useState(gig.packages?.basic?.price || (gig as any).price || 2500);
  const [editPriceStandard, setEditPriceStandard] = useState(gig.packages?.standard?.price || 6000);
  const [editPricePremium, setEditPricePremium] = useState(gig.packages?.premium?.price || 15000);
  const [editDeliveryDays, setEditDeliveryDays] = useState(gig.packages?.basic?.deliveryDays || 3);
  const [editThumbnail, setEditThumbnail] = useState(gig.thumbnail);
  const [editDesc, setEditDesc] = useState(gig.description || '');
  const [editOfferBadge, setEditOfferBadge] = useState<string>(gig.offerBadge === '৩০% ক্যাশব্যাক' ? '৩০% ছাড়' : (gig.offerBadge || '৩০% ছাড়'));
  const [editSuccess, setEditSuccess] = useState(false);

  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Media items list
  const mediaList: string[] = [gig.thumbnail];
  if (gig.galleryImages && gig.galleryImages.length > 0) {
    gig.galleryImages.forEach(img => {
      if (img && !mediaList.includes(img)) mediaList.push(img);
    });
  }
  if (mediaList.length < 3) {
    mediaList.push('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
    mediaList.push('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
  }

  const activeMediaUrl = mediaList[activeMediaIndex % mediaList.length];

  // Selected package details
  const currentPkg = gig.packages?.[selectedPackage] || gig.packages?.standard || gig.packages?.basic || {
    name: `${selectedPackage.toUpperCase()} Package`,
    price: gig.price || 2500,
    deliveryDays: gig.deliveryDays || 3,
    revisions: '3',
    features: ['হাই-কোয়ালিটি ডিজাইন ও কোড', 'রেসপন্সিভ অল ডিভাইস', 'সোর্স ফাইল', '৩০ দিন সাপোর্ট']
  };

  const isOwnerOrAdmin = currentUser && (
    currentUser.role === 'admin' ||
    currentUser.id === gig.sellerId ||
    (currentUser.name && gig.sellerName.toLowerCase().includes(currentUser.name.toLowerCase()))
  );

  const toggleSave = () => {
    setIsSaved(prev => {
      const next = !prev;
      try {
        const saved = localStorage.getItem('ptenit_saved_gigs');
        let list: string[] = saved ? JSON.parse(saved) : [];
        if (next && !list.includes(gig.id)) list.push(gig.id);
        if (!next) list = list.filter(id => id !== gig.id);
        localStorage.setItem('ptenit_saved_gigs', JSON.stringify(list));
      } catch {}
      return next;
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleOpenOrderCheckout = () => {
    if (!currentUser && openAuthModal) {
      openAuthModal();
      return;
    }
    setIsOrderCheckoutOpen(true);
  };

  const handleSaveEditGig = (e: React.FormEvent) => {
    e.preventDefault();
    updateGig(gig.id, {
      title: editTitle,
      category: editCategory,
      price: editPriceBasic,
      thumbnail: editThumbnail,
      description: editDesc,
      offerBadge: editOfferBadge,
      packages: {
        basic: {
          name: 'Basic Package',
          price: editPriceBasic,
          deliveryDays: editDeliveryDays,
          revisions: '1',
          features: gig.packages?.basic?.features || ['কোর ডিজাইন ও ডেলিভারি', 'সোর্স ফাইল']
        },
        standard: {
          name: 'Standard Package',
          price: editPriceStandard,
          deliveryDays: Math.max(1, editDeliveryDays - 1),
          revisions: '3',
          features: gig.packages?.standard?.features || ['অ্যাডভান্স ডিজাইন ও কোড', 'সোর্স ফাইল', 'প্রিমিয়াম সাপোর্ট']
        },
        premium: {
          name: 'Premium Package',
          price: editPricePremium,
          deliveryDays: Math.max(1, editDeliveryDays - 2),
          revisions: 'Unbounded',
          features: gig.packages?.premium?.features || ['সম্পূর্ণ প্রজেক্ট', 'লাইফটাইম মেইনটেন্যান্স', 'ভিআইপি সাপোর্ট']
        }
      }
    });
    gig.title = editTitle;
    gig.category = editCategory;
    gig.thumbnail = editThumbnail;
    gig.description = editDesc;
    gig.offerBadge = editOfferBadge;

    setEditSuccess(true);
    setTimeout(() => {
      setEditSuccess(false);
      setIsEditModalOpen(false);
    }, 1200);
  };

  // Recommended Gigs Pool
  const recommendedGigs = allGigs.filter(g => g.id !== gig.id).slice(0, 3);

  // Sample Client Reviews
  const reviewsList = [
    {
      name: 'তানভীর আহমেদ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      date: '৩ দিন আগে',
      rating: 5,
      comment: 'অসাধারণ অভিজ্ঞতা! প্রজেক্টের সময়সীমার আগেই নিখুঁত কোডিং ডেলিভারি করেছেন। ১০০% রেকমেন্ডেড!'
    },
    {
      name: 'নাসরিন সুলতানা',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      date: '১ সপ্তাহ আগে',
      rating: 5,
      comment: 'রেসপন্সিভ ডিজাইন ও কাস্টমার ফ্রেন্ডলি সাপোর্ট পেয়েছি। যেকোনো সমস্যায় ইনস্ট্যান্ট রেসপন্স।'
    },
    {
      name: 'মেহেদী হাসান',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      date: '২ সপ্তাহ আগে',
      rating: 5,
      comment: 'খুবই হেল্পফুল মাইন্ডসেট! পেমেন্ট ও সাপোর্ট দুইটাই খুব স্মুথ ছিল।'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-bengali text-slate-900 dark:text-slate-100 pb-28 lg:pb-16 animate-fadeIn">
      
      {/* 1. TOP HEADER NAVIGATION BAR */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-3 mb-6">
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between gap-3">
          
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#1DB954] dark:bg-slate-800 dark:hover:bg-[#1DB954] text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফিরে যান</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md md:max-w-2xl">
            <span onClick={onBack} className="hidden sm:inline hover:text-[#1DB954] cursor-pointer hover:underline transition">মার্কেটপ্লেস</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
            <span className="text-[#1DB954] font-bold truncate">{gig.category}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{gig.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerOrAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-[#1DB954] text-emerald-600 dark:text-[#1DB954] hover:text-slate-950 transition cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPerformanceModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white transition cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">অ্যানালিটিক্স</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer relative"
              title="লিংক শেয়ার করুন"
            >
              <Share2 className="w-4 h-4 text-[#1DB954]" />
              {showCopyToast && (
                <span className="absolute -bottom-8 right-0 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-40">
                  লিংক কপি হয়েছে!
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={toggleSave}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSaved
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
              title={isSaved ? 'সংরক্ষিত আছে' : 'সেভ করুন'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTAINER */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-2">
        

        {/* TITLE & SELLER BRIEF BANNER */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {(gig.offerBadge === 'work_first' || gig.offerBadge === 'আগে কাজ শুরু') ? (
              <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 flex items-center">
                আগে কাজ শুরু
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded border border-[#1DB954]/20 flex items-center">
                {gig.offerBadge === '৩০% ক্যাশব্যাক' ? '৩০% ছাড়' : (gig.offerBadge || '৩০% ছাড়')}
              </span>
            )}

            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full">
              <Star className="w-4 h-4 fill-current" />
              <span>{gig.rating || 5.0} ({gig.reviewsCount || 12} রিভিউ)</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-[#1DB954]">{gig.salesCount || 25}+ প্রজেক্ট সম্পন্ন</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {gig.title}
          </h1>

          {/* Seller Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={gig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={gig.sellerName}
                  className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover border-2 border-[#1DB954] shadow-xs"
                />
                <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full absolute bottom-0 right-0 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{gig.sellerName}</span>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold">
                  {gig.sellerTitle || 'Top Rated Service Provider'}
                </p>
              </div>
            </div>

            {siteSettings?.enableMoneyBackGuarantee !== false && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#1DB954] border border-[#1DB954]/30 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{siteSettings?.moneyBackGuaranteeText || `${siteSettings?.moneyBackGuaranteeDays || 10}-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি`}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: MAIN CONTENT + STICKY SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: MEDIA + TABS + SECTIONS */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* MEDIA PREVIEW CAROUSEL */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div className="relative h-64 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden group border border-slate-800 shadow-inner">
                <img
                  src={activeMediaUrl}
                  alt={gig.title}
                  className="w-full h-full object-cover cursor-pointer hover:scale-102 transition duration-300"
                  onClick={() => setLightboxImage(activeMediaUrl)}
                />

                {/* Navigation Arrows */}
                <button
                  type="button"
                  onClick={() => setActiveMediaIndex(prev => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-[#1DB954] text-white hover:text-slate-950 transition backdrop-blur-md shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMediaIndex(prev => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-[#1DB954] text-white hover:text-slate-950 transition backdrop-blur-md shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setLightboxImage(activeMediaUrl)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md cursor-pointer border border-white/20"
                >
                  <Eye className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>ফুলস্ক্রিন</span>
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {mediaList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                      activeMediaIndex === idx
                        ? 'border-[#1DB954] ring-2 ring-[#1DB954]/30 scale-102'
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* TABBED NAVIGATION MENU */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs sm:text-sm font-black scrollbar-none">
              {[
                { id: 'packages', label: 'প্যাকেজসমূহ' },
                { id: 'overview', label: 'বিবরণ (Overview)' },
                { id: 'portfolio', label: 'পোর্টফোলিও' },
                { id: 'reviews', label: `রিভিউ (${gig.reviewsCount || 35})` },
                { id: 'seller', label: 'সেলার বায়ো' },
                { id: 'faqs', label: 'প্রশ্নোত্তর (FAQ)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-[#1DB954] text-white font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT CARDS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
              
              {/* TAB 1: PACKAGES COMPARISON */}
              {activeTab === 'packages' && (
                <div className="space-y-5 animate-fadeIn font-bengali">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <Briefcase className="w-5 h-5 text-[#1DB954]" />
                      <span>প্যাকেজ সমূহ</span>
                      
                      {(gig.offerBadge || editOfferBadge) === 'work_first' || (gig.offerBadge || editOfferBadge) === 'আগে কাজ শুরু' ? (
                        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs sm:text-sm font-bold rounded flex items-center">
                          আগে কাজ শুরু
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-[#1DB954] border border-emerald-500/20 text-xs sm:text-sm font-bold rounded flex items-center">
                          {(gig.offerBadge === '৩০% ক্যাশব্যাক' || editOfferBadge === '৩০% ক্যাশব্যাক') ? '৩০% ছাড়' : (gig.offerBadge || editOfferBadge || '৩০% ছাড়')}
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['basic', 'standard', 'premium'] as const).map(pKey => {
                      const pkg = gig.packages?.[pKey] || {
                        name: `${pKey.toUpperCase()} Package`,
                        price: pKey === 'basic' ? 2500 : pKey === 'standard' ? 6000 : 15000,
                        deliveryDays: pKey === 'basic' ? 3 : pKey === 'standard' ? 2 : 1,
                        revisions: '3',
                        features: ['কোর ডিজাইন', 'সোর্স ফাইল', 'সাপোর্ট']
                      };
                      const isSelected = selectedPackage === pKey;

                      return (
                        <div
                          key={pKey}
                          onClick={() => setSelectedPackage(pKey)}
                          className={`p-4 pt-6 sm:p-5 sm:pt-7 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-4 relative ${
                            isSelected
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-[#1DB954] shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          {/* Floating Package Badge on Top Border */}
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                            {pKey === 'basic' && (
                              <span className="text-xs font-black text-white bg-[#1DB954] border border-emerald-600 px-3.5 py-0.5 rounded-full shadow-md">
                                বেসিক প্যাকেজ
                              </span>
                            )}
                            {pKey === 'standard' && (
                              <span className="text-xs font-black text-white bg-red-600 border border-red-700 px-3.5 py-0.5 rounded-full shadow-md">
                                স্ট্যান্ডার্ড প্যাকেজ
                              </span>
                            )}
                            {pKey === 'premium' && (
                              <span className="text-xs font-black text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border border-purple-500/40 px-3.5 py-0.5 rounded-full shadow-md">
                                প্রিমিয়াম প্যাকেজ
                              </span>
                            )}
                          </div>

                          <div className="space-y-2.5">
                            {/* Offer Row */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                                <span className="font-extrabold text-slate-700 dark:text-slate-300">
                                  অফার:
                                </span>
                                {((gig.offerBadge || editOfferBadge) === 'work_first' || (gig.offerBadge || editOfferBadge) === 'আগে কাজ শুরু') ? (
                                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                                    আগে কাজ শুরু
                                  </span>
                                ) : (
                                  <span className="text-xs font-black text-emerald-600 dark:text-[#1DB954] bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                                    {(gig.offerBadge === '৩০% ক্যাশব্যাক' || editOfferBadge === '৩০% ক্যাশব্যাক') ? '৩০% ছাড়' : (gig.offerBadge || editOfferBadge || '৩০% ছাড়')}
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{pkg.name}</h4>

                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl sm:text-3xl font-black text-[#1DB954]">
                                ৳{(pkg.price ?? 0).toLocaleString('bn-BD')}
                              </span>
                              <span className="text-xs sm:text-sm text-slate-400 line-through font-bold">
                                ৳{((pkg.price ?? 0) + 1650).toLocaleString('bn-BD')}
                              </span>
                            </div>

                            <div className="text-xs sm:text-sm space-y-2 border-t border-slate-200 dark:border-slate-800 pt-2.5 text-slate-700 dark:text-slate-200">
                              <p className="flex items-center gap-1.5 font-bold">
                                <Clock className="w-4 h-4 text-[#1DB954]" /> {pkg.deliveryDays} দিনে ডেলিভারি
                              </p>
                              <p className="flex items-center gap-1.5 font-bold">
                                <Check className="w-4 h-4 text-[#1DB954]" /> {pkg.revisions} রিভিশন
                              </p>
                            </div>

                            <div className="pt-2 space-y-1.5">
                              {(pkg.features || []).map((f, fIdx) => (
                                <p key={fIdx} className="text-xs sm:text-sm flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                                  <Check className="w-4 h-4 text-[#1DB954] shrink-0" /> {f}
                                </p>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelected) {
                                handleOpenOrderCheckout();
                              } else {
                                setSelectedPackage(pKey);
                              }
                            }}
                            className={`w-full py-2.5 rounded-xl font-black text-xs sm:text-sm cursor-pointer transition ${
                              isSelected
                                ? 'bg-[#1DB954] text-white shadow-xs'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-[#1DB954] hover:text-white'
                            }`}
                          >
                            {isSelected ? 'অর্ডার করুন' : 'প্যাকেজ বাছাই করুন'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-fadeIn font-bengali">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Sparkles className="w-5 h-5 text-[#1DB954]" />
                    <span>সার্ভিস বিবরণ ও কাজের পরিধি</span>
                  </h3>

                  <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                    {gig.description || 'এই সার্ভিসের আওতায় আপনি পাচ্ছেন ১০০% রেসপন্সিভ এবং আধুনিক প্রযুক্তিতে তৈরি হাই-পারফর্মেন্স সমাধান। কোনো প্রকার বাগ ছাড়া নির্দিষ্ট সময়ের মধ্যে সম্পূর্ণ প্রজেক্ট ডেলিভারি করা হবে।'}
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                    <h4 className="text-xs sm:text-sm font-black text-[#1DB954] uppercase tracking-wider">
                      কেন এই গিগটি নির্বাচন করবেন?
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                        <span>১০০% রেসপন্সিভ ও ক্লিন কোডিং</span>
                      </div>
                      {siteSettings?.enableMoneyBackGuarantee !== false && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                          <span>এস্ক্রো ওয়ালেট টাকা {siteSettings?.moneyBackGuaranteeDays || 10} দিন সুরক্ষিত</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                        <span>সোর্স ফাইল ও ফ্রি ডিপ্লয়মেন্ট গ্যারান্টি</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                        <span>৩০ দিনের ফ্রি টেকনিক্যাল সাপোর্ট</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PORTFOLIO SHOWCASE */}
              {activeTab === 'portfolio' && (
                <div className="space-y-5 animate-fadeIn font-bengali">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <ImageIcon className="w-5 h-5 text-[#1DB954]" />
                    <span>পূর্বে সম্পন্নকৃত পোর্টফোলিও কাজ</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'হাই-কনভার্টিং ই-কমার্স ও ল্যান্ডিং পেজ',
                        img: gig.thumbnail,
                        tag: 'Web App',
                        review: 'খুবই চমৎকার এবং রেসপন্সিভ কোড পেয়েছি!'
                      },
                      {
                        title: 'কাস্টম এডমিন ড্যাশবোর্ড ও API সংযোগ',
                        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                        tag: 'Full-Stack',
                        review: 'টাইমলাইনের আগেই প্রজেক্ট সাবমিট করেছেন।'
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                        <div className="relative h-44 sm:h-48 bg-slate-900 rounded-xl overflow-hidden cursor-pointer group" onClick={() => setLightboxImage(item.img)}>
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          <span className="absolute top-2 left-2 bg-slate-950/80 text-[#1DB954] text-xs font-black px-2.5 py-1 rounded-full border border-[#1DB954]/30">
                            {item.tag}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-slate-500 italic font-medium">"{item.review}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-5 animate-fadeIn font-bengali">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Star className="w-5 h-5 text-amber-500 fill-current" />
                    <span>ক্লায়েন্টদের রিভিউ ও রেটিং</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {reviewsList.map((rev, rIdx) => (
                      <div key={rIdx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-3">
                          <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-[#1DB954]" />
                          <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{rev.name}</h4>
                            <span className="text-xs text-slate-400 font-medium">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SELLER BIO */}
              {activeTab === 'seller' && (
                <div className="space-y-5 animate-fadeIn font-bengali">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <User className="w-5 h-5 text-[#1DB954]" />
                    <span>ফ্রি ল্যান্সার / সেলার প্রোফাইল</span>
                  </h3>

                  <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={gig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={gig.sellerName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#1DB954]"
                      />
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{gig.sellerName}</span>
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
                          {gig.sellerTitle || 'Senior Developer & Tech Specialist'}
                        </p>
                        <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-[#1DB954] mt-1">
                          ★ {gig.rating || 5.0} • {gig.salesCount || 25}টি সফল অর্ডার
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenSellerChat}
                      className="w-full py-3 bg-slate-900 text-white dark:bg-slate-800 hover:bg-[#1DB954] hover:text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#1DB954]" />
                      <span>মেসেজে কথা বলুন</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4 animate-fadeIn font-bengali">
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <HelpCircle className="w-5 h-5 text-[#1DB954]" />
                    <span>সাধারণ প্রশ্ন ও উত্তর (FAQs)</span>
                  </h3>

                  <div className="space-y-3">
                    {[
                      { q: 'কাজ কতদিনের মধ্যে সম্পূর্ণ হবে?', a: 'প্যাকেজ নির্বাচন অনুযায়ী ১ থেকে ৩ কার্যদিবসের মধ্যে কাজ ডেলিভারি করা হবে।' },
                      { q: 'আমি কি কাজ সংশোধন বা রিভিশন করে নিতে পারব?', a: 'জি, আপনার কাজ পছন্দ না হওয়া পর্যন্ত একাধিক রিভিশন সেবা অন্তর্ভুক্ত রয়েছে।' },
                      { q: 'টাকা কীভাবে পরিশোধ করব?', a: 'আপনি বিকাশ, নগদ, রকেট বা ব্যাংক কার্ড দিয়ে এস্ক্রো অথবা কাজ বুঝে পেয়ে বিল পরিশোধ করতে পারবেন।' }
                    ].map((faq, fIdx) => (
                      <div key={fIdx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                          className="w-full p-4 text-left font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954] transition transform ${openFaqIndex === fIdx ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaqIndex === fIdx && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-200 border-t border-slate-200/60 dark:border-slate-800 leading-relaxed font-bold">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RECOMMENDED GIGS GRID */}
            {recommendedGigs.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1DB954]" />
                    <span>আরও জনপ্রিয় গিগ সার্ভিসসমূহ</span>
                  </h3>
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-[#1DB954] hover:text-emerald-400 text-xs font-bold hover:underline transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>সবগুলো দেখুন →</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendedGigs.map(recGig => (
                    <div
                      key={recGig.id}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        onSelectGig(recGig);
                      }}
                      className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#1DB954] transition cursor-pointer space-y-2 group"
                    >
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-900">
                        <img src={recGig.thumbnail} alt={recGig.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#1DB954] transition">
                        {recGig.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#1DB954]">
                        <span>৳{(recGig.packages?.basic?.price || recGig.price || 2000).toLocaleString('bn-BD')}</span>
                        <span className="text-slate-400">★ {recGig.rating || 5.0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY ORDER CHECKOUT BOX (DESKTOP) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4 font-bengali">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-[#1DB954]/50 shadow-xl space-y-4">
              
              {/* Package Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs sm:text-sm font-bold items-center justify-center text-center">
                {(['basic', 'standard', 'premium'] as const).map(pKey => {
                  const isSelected = selectedPackage === pKey;
                  return (
                    <button
                      key={pKey}
                      type="button"
                      onClick={() => setSelectedPackage(pKey)}
                      className={`py-2.5 px-1 rounded-xl transition cursor-pointer text-center text-xs sm:text-sm font-black flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#1DB954] text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{pKey === 'basic' ? 'বেসিক' : pKey === 'standard' ? 'স্ট্যান্ডার্ড' : 'প্রিমিয়াম'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Price & Package Info */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div>
                    <div className="mb-1">
                      {selectedPackage === 'basic' && (
                        <span className="text-xs font-black text-white bg-[#1DB954] px-2.5 py-1 rounded-lg shadow-xs inline-flex items-center justify-center text-center">
                          বেসিক প্যাকেজ
                        </span>
                      )}
                      {selectedPackage === 'standard' && (
                        <span className="text-xs font-black text-white bg-red-600 px-2.5 py-1 rounded-lg shadow-xs inline-flex items-center justify-center text-center">
                          স্ট্যান্ডার্ড প্যাকেজ
                        </span>
                      )}
                      {selectedPackage === 'premium' && (
                        <span className="text-xs font-black text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border border-purple-500/40 px-2.5 py-1 rounded-lg shadow-xs inline-flex items-center justify-center text-center">
                          প্রিমিয়াম প্যাকেজ
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1.5">
                      {currentPkg.name || (selectedPackage === 'basic' ? 'বেসিক প্যাকেজ' : selectedPackage === 'standard' ? 'স্ট্যান্ডার্ড প্যাকেজ' : 'প্রিমিয়াম প্যাকেজ')}
                    </h3>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1DB954]">
                    ৳{(currentPkg.price ?? 2500).toLocaleString('bn-BD')}
                  </div>
                </div>

                {/* Specs */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4.5 h-4.5 text-[#1DB954]" />
                    <span>{currentPkg.deliveryDays ?? 3} দিনে ডেলিভারি</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4.5 h-4.5 text-[#1DB954]" />
                    <span>{currentPkg.revisions ?? '3'}টি রিভিশন</span>
                  </span>
                </div>

                {/* Features List */}
                <ul className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2 pt-1">
                  {(currentPkg.features || ['হাই-কোয়ালিটি ডেলিভারি', 'সোর্স ফাইল', 'সাপোর্ট']).map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Order Notice Pill in Sidebar */}
              {userActiveOrder && (
                <div className="p-3 bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-2xl flex items-center justify-between text-xs font-bold text-[#1DB954]">
                  <span className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1DB954]" />
                    <span className="truncate">অর্ডারকৃত গিগ (আইডি: #{userActiveOrder.id.slice(-6)})</span>
                  </span>
                  <span className="text-[10px] bg-[#1DB954] text-white px-2 py-0.5 rounded-md font-black uppercase shrink-0">
                    একটিভ
                  </span>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleOpenOrderCheckout}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold font-bengali text-sm sm:text-base shadow-md hover:scale-[1.01] transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>অর্ডার করুন</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenSellerChat}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#1DB954]" />
                  <span>মেসেজে কথা বলুন</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 space-y-2">
                {siteSettings?.enableMoneyBackGuarantee !== false && (
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                    <span>{siteSettings?.moneyBackGuaranteeText || `${siteSettings?.moneyBackGuaranteeDays || 10}-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি`}</span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Zap className="w-4.5 h-4.5 text-[#1DB954] shrink-0" />
                  <span>দ্রুত অনলাইন টেকনিক্যাল সাপোর্ট</span>
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 3. MOBILE STICKY BOTTOM BAR (< lg screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3.5 shadow-2xl font-bengali">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="mb-0.5">
              {selectedPackage === 'basic' && (
                <span className="text-xs font-black text-white bg-[#1DB954] px-2 py-0.5 rounded inline-block text-center">
                  বেসিক প্যাকেজ
                </span>
              )}
              {selectedPackage === 'standard' && (
                <span className="text-xs font-black text-white bg-red-600 px-2 py-0.5 rounded inline-block text-center">
                  স্ট্যান্ডার্ড প্যাকেজ
                </span>
              )}
              {selectedPackage === 'premium' && (
                <span className="text-xs font-black text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border border-purple-500/40 px-2 py-0.5 rounded inline-block text-center">
                  প্রিমিয়াম প্যাকেজ
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#1DB954]">
              ৳{(currentPkg.price ?? 2500).toLocaleString('bn-BD')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenOrderCheckout}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold font-bengali text-sm shadow-md flex items-center justify-center cursor-pointer active:scale-98"
          >
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>

      {/* 4. LIGHTBOX ZOOM MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#1DB954] transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={lightboxImage} alt="Fullscreen View" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      {/* 5. EDIT GIG MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#1DB954]" />
                <span>গিগ এডিট করুন</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-[#1DB954] font-bold text-xs rounded-xl text-center">
                ✓ গিগ সফলভাবে আপডেট করা হয়েছে!
              </div>
            )}

            <form onSubmit={handleSaveEditGig} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">গিগ টাইটেল</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">ক্যাটাগরি</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">গিগ অফার টাইপ (ব্যাজ)</label>
                <select
                  value={editOfferBadge}
                  onChange={(e) => setEditOfferBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954] font-bold"
                >
                  <option value="আগে কাজ শুরু">⚡ আগে কাজ শুরু</option>
                  <option value="৫% ছাড়">🎁 ৫% ছাড়</option>
                  <option value="১০% ছাড়">🎁 ১০% ছাড়</option>
                  <option value="২০% ছাড়">🎁 ২০% ছাড়</option>
                  <option value="৩০% ছাড়">🎁 ৩০% ছাড়</option>
                  <option value="৫০% ছাড়">🎁 ৫০% ছাড়</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Basic (৳)</label>
                  <input
                    type="number"
                    value={editPriceBasic}
                    onChange={(e) => setEditPriceBasic(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Standard (৳)</label>
                  <input
                    type="number"
                    value={editPriceStandard}
                    onChange={(e) => setEditPriceStandard(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Premium (৳)</label>
                  <input
                    type="number"
                    value={editPricePremium}
                    onChange={(e) => setEditPricePremium(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 rounded-xl font-black cursor-pointer shadow"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. PERFORMANCE ANALYTICS MODAL */}
      {isPerformanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#1DB954]" />
                <span>পারফরমেন্স অ্যানালিটিক্স</span>
              </h3>
              <button onClick={() => setIsPerformanceModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">মোট ইম্প্রেশন</span>
                <span className="text-lg font-black text-[#1DB954]">১,২৪০</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">ক্লিক সংখ্যা</span>
                <span className="text-lg font-black text-[#1DB954]">৩১৫</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">সম্পন্ন অর্ডার</span>
                <span className="text-lg font-black text-[#1DB954]">{gig.salesCount || 25}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block font-medium">গড় রিভিউ</span>
                <span className="text-lg font-black text-amber-500">★ {gig.rating || 5.0}</span>
              </div>
            </div>

            <button
              onClick={() => setIsPerformanceModalOpen(false)}
              className="w-full py-2.5 bg-[#1DB954] text-slate-950 font-black rounded-xl cursor-pointer text-xs shadow"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* 7. REUSABLE SMART ORDER CHECKOUT MODAL */}
      <OrderCheckoutModal
        gig={gig}
        isOpen={isOrderCheckoutOpen}
        onClose={() => setIsOrderCheckoutOpen(false)}
        currentUser={currentUser}
        siteSettings={siteSettings}
        defaultPackage={selectedPackage}
        setActiveTab={setGlobalActiveTab}
        onOrderCompleted={(orderId) => {
          if (onOrderSuccess) {
            onOrderSuccess(orderId);
          } else if (setGlobalActiveTab) {
            setGlobalActiveTab('marketplace');
          }
        }}
      />

    </div>
  );
};
