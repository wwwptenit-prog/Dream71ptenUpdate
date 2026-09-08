import React, { useState, useMemo } from 'react';
import {
  X,
  User,
  CheckCircle2,
  Calendar,
  MapPin,
  MessageSquare,
  Share2,
  PlusCircle,
  ThumbsUp,
  Clock,
  Briefcase,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  Banknote,
  Send,
  Sparkles,
  ShieldCheck,
  Globe,
  Camera,
  Check,
  PhoneCall,
  Mail,
  FileText,
  Star,
  Eye,
  Zap,
  Image as ImageIcon,
  Package,
  UploadCloud,
  BadgeCheck,
  LayoutGrid,
  List,
  Ban,
  Flag
} from 'lucide-react';
import { MarketplaceOrder, MarketplaceGig, User as UserType } from '../types';
import { GigCard } from './GigCard';

export interface BuyerProfileData {
  id: string;
  name: string;
  role?: 'seller' | 'buyer';
  avatar?: string;
  coverImage?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  reviewsCount?: number;
  location?: string;
  joinedDate?: string;
  isVerified?: boolean;
}

interface BuyerProfileFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyer: BuyerProfileData;
  posts: MarketplaceOrder[];
  gigs?: MarketplaceGig[];
  currentUser?: UserType | null;
  savedGigIds?: string[];
  toggleFavorite?: (gigId: string, e: React.MouseEvent) => void;
  onEditGig?: (gig: MarketplaceGig) => void;
  onDeleteGig?: (gigId: string) => void;
  onOpenCreateGig?: () => void;
  onGigClick?: (gig: MarketplaceGig) => void;
  isCurrentBuyer?: boolean;
  onOpenChat: (buyer: BuyerProfileData, initialMessage?: string) => void;
  onOpenPostProject?: () => void;
  onToggleLikePost?: (postId: string) => void;
  onEditPost?: (post: MarketplaceOrder) => void;
  onDeletePost?: (postId: string) => void;
  onRaiseBudget?: (post: MarketplaceOrder) => void;
  onViewPostDetails?: (post: MarketplaceOrder) => void;
  onUpdateProfile?: (updatedData: Partial<BuyerProfileData>) => void;
}

const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
];

export const BuyerProfileFeedModal: React.FC<BuyerProfileFeedModalProps> = ({
  isOpen,
  onClose,
  buyer,
  posts = [],
  gigs = [],
  currentUser,
  savedGigIds = [],
  toggleFavorite,
  onEditGig,
  onDeleteGig,
  onOpenCreateGig,
  onGigClick,
  isCurrentBuyer = false,
  onOpenChat,
  onOpenPostProject,
  onToggleLikePost,
  onEditPost,
  onDeletePost,
  onRaiseBudget,
  onViewPostDetails,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'about' | 'reviews'>('timeline');
  const [selectedCover, setSelectedCover] = useState<string>(
    buyer.coverImage || PRESET_COVERS[0]
  );
  const [isChangingCover, setIsChangingCover] = useState(false);
  const [postFilter, setPostFilter] = useState<'all' | 'work_first' | 'in_progress' | 'completed'>('all');
  const [active3DotPostId, setActive3DotPostId] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [proposalModalPost, setProposalModalPost] = useState<MarketplaceOrder | null>(null);
  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [customBidMessage, setCustomBidMessage] = useState<string>('');
  const [proposalSentSuccess, setProposalSentSuccess] = useState(false);
  const [expandedDescIds, setExpandedDescIds] = useState<{ [id: string]: boolean }>({});
  const [gigLayoutMode, setGigLayoutMode] = useState<'feed' | 'grid'>('feed');

  // Determine if this profile is a seller
  const isSeller = useMemo(() => {
    if (buyer.role === 'seller') return true;
    if (buyer.role === 'buyer') return false;
    const nameLower = (buyer.name || '').toLowerCase();
    if (nameLower.includes('seller') || nameLower.includes('সেলার') || nameLower.includes('sohag')) return true;
    if (gigs && gigs.some(g => g.sellerId === buyer.id || (buyer.name && g.sellerName?.toLowerCase().includes(buyer.name.toLowerCase())))) {
      return true;
    }
    return false;
  }, [buyer, gigs]);

  // Seller's gigs
  const sellerGigs = useMemo(() => {
    if (!gigs || gigs.length === 0) return [];
    return gigs.filter(g => {
      const matchId = g.sellerId && (g.sellerId === buyer.id || (isCurrentBuyer && (g.sellerId === 'seller-1' || g.sellerId === 'current-user')));
      const matchName = g.sellerName && buyer.name && (
        g.sellerName.toLowerCase().includes(buyer.name.toLowerCase()) ||
        buyer.name.toLowerCase().includes(g.sellerName.toLowerCase())
      );
      return matchId || matchName;
    });
  }, [gigs, buyer, isCurrentBuyer]);

  // Filter posts belonging to this buyer (or all public posts matching this buyer)
  const buyerPosts = useMemo(() => {
    return posts.filter(p => {
      // Match by buyerId or buyerName
      const matchId = p.buyerId && (p.buyerId === buyer.id || p.buyerId === 'current-user' || p.buyerId.startsWith('cust-'));
      const matchName = p.buyerName && buyer.name && p.buyerName.trim().toLowerCase() === buyer.name.trim().toLowerCase();
      // Or if this is a public offer posted by client
      return (matchId || matchName || p.isPublicOffer || p.type === 'custom_agency_order');
    });
  }, [posts, buyer]);

  const filteredPosts = useMemo(() => {
    if (postFilter === 'work_first') {
      return buyerPosts.filter(p => p.offerType === 'work_first' || p.isWorkFirst);
    }
    if (postFilter === 'in_progress') {
      return buyerPosts.filter(p => p.status === 'in_progress' || p.status === 'pending' || p.status === 'pending_approval');
    }
    if (postFilter === 'completed') {
      return buyerPosts.filter(p => p.status === 'completed');
    }
    return buyerPosts;
  }, [buyerPosts, postFilter]);

  if (!isOpen) return null;

  const handleCopyProfileLink = (id?: string) => {
    const key = id || 'profile';
    const link = `${window.location.origin}/#buyer-${buyer.id}`;
    navigator.clipboard.writeText(link);
    setCopiedShareId(key);
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  const handleSendProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalModalPost) return;
    
    // Open chat with buyer about this post and proposal
    const bidText = `আসসালামু আলাইকুম ${buyer.name}! আমি আপনার "${proposalModalPost.title}" প্রজেক্টে প্রস্তাব জমা দিয়েছি।\n💰 প্রস্তাবিত বাজেট: ৳${customBidAmount || proposalModalPost.amount}\n📝 বিবরণ: ${customBidMessage || 'আমি আপনার কাজের বিবরণ দেখেছি এবং নির্ধারিত সময়ের মধ্যে শতভাগ নিখুঁতভাবে ডেলিভারি দিতে প্রস্তুত।'}`;
    
    onOpenChat(buyer, bidText);
    setProposalSentSuccess(true);
    setTimeout(() => {
      setProposalSentSuccess(false);
      setProposalModalPost(null);
      setCustomBidAmount('');
      setCustomBidMessage('');
    }, 1200);
  };

  const toggleExpandDesc = (id: string) => {
    setExpandedDescIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali overflow-y-auto">
      <div 
        className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-3xl max-w-4xl w-full min-h-screen sm:min-h-0 sm:max-h-[94vh] shadow-2xl relative flex flex-col overflow-hidden"
        onClick={() => setActive3DotPostId(null)}
      >
        {/* TOP BAR / NAVIGATION */}
        <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full ${isSeller ? 'bg-[#1DB954]' : 'bg-[#1877F2]'} text-white flex items-center justify-center font-bold text-base shadow-xs`}>
              {isSeller ? 'S' : 'f'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                <span>{buyer.name}</span>
                <CheckCircle2 className={`w-4 h-4 ${isSeller ? 'text-[#1DB954]' : 'text-[#1877F2]'} shrink-0`} />
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isSeller ? 'ফেসবুক স্টাইল সেলার প্রোফাইল & নিজস্ব আপলোডকৃত গিগসমূহ' : 'ফেসবুক স্টাইল বায়ার প্রোফাইল & নিজস্ব টাইমলাইন'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleCopyProfileLink('profile')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="প্রোফাইল লিংক কপি করুন"
            >
              {copiedShareId === 'profile' ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE PROFILE CONTAINER */}
        <div className="flex-1 overflow-y-auto">
          
          {/* 1. COVER PHOTO & PROFILE HEADER SECTION (FACEBOOK AESTHETICS) */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800">
            {/* Cover Photo */}
            <div className="relative h-44 sm:h-64 w-full bg-slate-800 overflow-hidden group">
              <img
                src={selectedCover}
                alt="Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

              {/* Cover change option button */}
              {isCurrentBuyer && (
                <div className="absolute bottom-3 right-3 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsChangingCover(!isChangingCover);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition cursor-pointer shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>কভার ফটো পরিবর্তন</span>
                  </button>

                  {isChangingCover && (
                    <div className="absolute right-0 bottom-full mb-2 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 z-30 animate-fadeIn">
                      {PRESET_COVERS.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedCover(img);
                            setIsChangingCover(false);
                          }}
                          className={`w-12 h-8 rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                            selectedCover === img ? 'border-[#1877F2] scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar & Info Bar */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 relative z-20">
                
                {/* Left: Overlapping Avatar & Name */}
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 mx-auto sm:mx-0">
                    <img
                      src={buyer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                      alt={buyer.name}
                      className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-xl"
                    />
                    <span 
                      className={`absolute bottom-1 right-2 w-5 h-5 ${isSeller ? 'bg-[#1DB954]' : 'bg-[#1877F2]'} rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-xs`} 
                      title="অ্যাক্টিভ প্রোফাইল"
                    >
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </span>
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-tight">
                        {buyer.name}
                      </h1>
                      <CheckCircle2 className={`w-5 h-5 ${isSeller ? 'text-[#1DB954]' : 'text-[#1877F2]'} shrink-0`} />
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isSeller 
                          ? 'bg-emerald-500/15 text-[#1DB954] border border-emerald-500/30' 
                          : 'bg-blue-500/15 text-[#1877F2] border border-blue-500/30'
                      }`}>
                        {isSeller ? '⚡ ভেরিফায়েড সেলার প্রো' : 'ভেরিফায়েড বায়ার'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-md">
                      {buyer.bio || (isSeller 
                        ? "💼 ফুল-স্ট্যাক ওয়েব ডেভেলপার & সিনিয়র ইউআই/ইউএক্স ডিজাইনার • PTEN IT অফিশিয়াল সেলার" 
                        : "💼 সক্রিয় ক্লায়েন্ট ও বায়ার • PTEN IT অফিশিয়াল ফ্রিল্যান্সিং মার্কেটপ্লেস"
                      )}
                    </p>

                    {/* Skill Badges if Available */}
                    {buyer.skills && buyer.skills.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 pt-1">
                        {buyer.skills.slice(0, 5).map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md border border-slate-200 dark:border-slate-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{buyer.location || "ঢাকা, বাংলাদেশ"}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>মেম্বার সিন্স {buyer.joinedDate || "২০২৪"}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#1877F2]">
                        <Globe className="w-3.5 h-3.5" />
                        <span>পাবলিক প্রোফাইল</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Primary Action Buttons */}
                <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0">
                  {/* Send Message / Chat */}
                  <button
                    type="button"
                    onClick={() => onOpenChat(buyer, `আসসালামু আলাইকুম ${buyer.name}! আমি আপনার সাথে প্রজেক্টের বিষয়ে যোগাযোগ করছি।`)}
                    className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" />
                    <span>মেসেজ পাঠান</span>
                  </button>

                  {/* Post New (if own profile) or Contact WhatsApp */}
                  {isCurrentBuyer ? (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (isSeller && onOpenCreateGig) {
                          onOpenCreateGig();
                        } else if (onOpenPostProject) {
                          onOpenPostProject();
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#1DB954] hover:bg-emerald-600 active:scale-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{isSeller ? '+ নতুন গিগ পোস্ট' : '+ নতুন প্রজেক্ট পোস্ট'}</span>
                    </button>
                  ) : (
                    buyer.whatsapp && (
                      <a
                        href={`https://wa.me/${buyer.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>হোয়াটসঅ্যাপ</span>
                      </a>
                    )
                  )}

                  {/* Share profile button */}
                  <button
                    type="button"
                    onClick={() => handleCopyProfileLink('profile')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-slate-700"
                    title="প্রোফাইল শেয়ার"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                    {isSeller ? 'আপলোডকৃত গিগসমূহ' : 'মোট পাবলিক পোস্ট'}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white font-mono">
                    {isSeller ? `${sellerGigs.length}টি গিগ` : `${buyerPosts.length || 4}টি`}
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-center">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">
                    {isSeller ? 'সাকসেস রেট' : 'বাজেট এসক্রো সুরক্ষিত'}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-[#1877F2] font-mono">
                    ১০০% ভেরিফায়েড
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 text-center">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    {isSeller ? 'সেলার রেটিং' : 'ক্লায়েন্ট রেটিং'}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>৫.০ ({isSeller ? '৫২+' : '১০+'})</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/50 text-center">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">রেসপন্স রেট</span>
                  <span className="text-base sm:text-lg font-semibold text-purple-600 dark:text-purple-400 font-mono">
                    ১ ঘণ্টার মধ্যে
                  </span>
                </div>
              </div>

              {/* FACEBOOK TABS */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'timeline'
                      ? 'text-[#1877F2]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{isSeller ? 'আপলোডকৃত গিগসমূহ' : 'টাইমলাইন / পোস্টসমূহ'}</span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'timeline' ? 'bg-[#1877F2] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {isSeller ? sellerGigs.length : (buyerPosts.length || 4)}
                  </span>
                  {activeTab === 'timeline' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('about')}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'about'
                      ? 'text-[#1877F2]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{isSeller ? 'পরিচিতি ও স্কিলস' : 'বায়ার পরিচিতি ও বিবরণ'}</span>
                  {activeTab === 'about' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 px-3 text-xs sm:text-sm font-semibold transition relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'text-[#1877F2]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>{isSeller ? 'ক্লায়েন্টদের রিভিউ (৫২+)' : 'সেলারদের রিভিউ (১০+)'}</span>
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. BODY CONTENT ACCORDING TO TAB */}
          <div className="max-w-4xl mx-auto px-3 sm:px-6 py-5 space-y-4">
            
            {/* TAB 1: TIMELINE / GIGS (ফেসবুক পোস্ট স্টাইলে প্রদর্শিত) */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                
                {isSeller ? (
                  /* ================== SELLER UPLOADED GIGS FEED ================== */
                  <div className="space-y-4">
                    {/* Post New Gig Composer Box (if own profile) */}
                    {isCurrentBuyer && (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={buyer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                            alt={buyer.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onOpenCreateGig) onOpenCreateGig();
                            }}
                            className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between"
                          >
                            <span className="truncate">{buyer.name}, আপনার নতুন সার্ভিস বা গিগ পোস্ট করুন...</span>
                            <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onOpenCreateGig) onOpenCreateGig();
                            }}
                            className="flex-1 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            <PlusCircle className="w-4 h-4 text-[#1DB954]" />
                            <span>৩টি প্যাকেজ গিগ ক্রিয়েট</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onOpenCreateGig) onOpenCreateGig();
                            }}
                            className="flex-1 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                            <span>পোর্টফোলিও ইমেজ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onOpenCreateGig) onOpenCreateGig();
                            }}
                            className="flex-1 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <span>ইনস্ট্যান্ট পাবলিশ</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Header Strip with Layout Toggle */}
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-[#1DB954]" />
                          <span>আপলোডকৃত গিগসমূহ</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-[#1DB954]">
                          {sellerGigs.length}টি
                        </span>
                      </div>

                      <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                        <button
                          type="button"
                          onClick={() => setGigLayoutMode('feed')}
                          className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            gigLayoutMode === 'feed'
                              ? 'bg-[#1877F2] text-white shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="ফেসবুক ফিড ভিউ"
                        >
                          <List className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">ফিড</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGigLayoutMode('grid')}
                          className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                            gigLayoutMode === 'grid'
                              ? 'bg-[#1877F2] text-white shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="গ্রিড ভিউ"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">গ্রিড</span>
                        </button>
                      </div>
                    </div>

                    {/* Gigs List rendered with GigCard in Facebook feed mode */}
                    {sellerGigs.length === 0 ? (
                      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3 shadow-xs">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-[#1DB954] flex items-center justify-center mx-auto">
                          <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                          কোনো আপলোডকৃত গিগ নেই
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                          আপনার দক্ষতা অনুযায়ী নতুন গিগ বা সার্ভিস তৈরি করুন। গ্রাহকরা সহজেই আপনার সার্ভিস অর্ডার করতে পারবে।
                        </p>
                        {isCurrentBuyer && onOpenCreateGig && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenCreateGig();
                            }}
                            className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shadow-md"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>+ নতুন গিগ পোস্ট করুন</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className={gigLayoutMode === 'feed' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
                        {sellerGigs.map(gig => (
                          <div key={gig.id} className="w-full">
                            <GigCard
                              gig={gig}
                              onClick={() => {
                                if (onGigClick) onGigClick(gig);
                              }}
                              currentUser={currentUser}
                              savedGigIds={savedGigIds}
                              toggleFavorite={toggleFavorite}
                              deleteGig={onDeleteGig}
                              onEdit={onEditGig}
                              layoutMode={gigLayoutMode}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ================== BUYER POSTS & TIMELINE ================== */
                  <div className="space-y-4">
                {/* Facebook Style Post Composer Box (যদি লগইন করা ইউজার নিজের প্রোফাইল দেখে অথবা প্রজেক্ট পোস্ট করতে চায়) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={buyer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={buyer.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenPostProject) onOpenPostProject();
                      }}
                      className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{buyer.name}, আপনার কী কাজের জন্য সেলার প্রয়োজন? পোস্ট করুন...</span>
                      <Send className="w-4 h-4 text-[#1877F2] shrink-0 ml-2" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenPostProject) onOpenPostProject();
                      }}
                      className="flex-1 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-500" />
                      <span>ছবি / ফাইল সংযুক্ত</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenPostProject) onOpenPostProject();
                      }}
                      className="flex-1 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      <Zap className="w-4 h-4 text-[#1877F2]" />
                      <span>আগে কাজ শুরু অফার</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenPostProject) onOpenPostProject();
                      }}
                      className="flex-1 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-700 dark:text-slate-300"
                    >
                      <Banknote className="w-4 h-4 text-amber-500" />
                      <span>বাজেট নির্ধারণ</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPostFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                        postFilter === 'all'
                          ? 'bg-[#1877F2] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      সকল পোস্ট ({buyerPosts.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostFilter('work_first')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                        postFilter === 'work_first'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      ⚡ আগে কাজ শুরু
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostFilter('in_progress')}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                        postFilter === 'in_progress'
                          ? 'bg-[#1DB954] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      💼 সক্রিয় অফার
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                    {filteredPosts.length}টি পোস্ট প্রদর্শিত
                  </span>
                </div>

                {/* LIST OF FACEBOOK-STYLE PUBLIC POST CARDS */}
                {filteredPosts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-3 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 text-[#1877F2] flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                      এই ফিল্টারে কোনো পোস্ট পাওয়া যায়নি
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      বায়ারের নতুন কাজের চাহিদা পাবলিক ফিডে পোস্ট করা হলে তা সরাসরি এই ফেসবুক টাইমলাইনে প্রদর্শিত হবে।
                    </p>
                    <button
                      type="button"
                      onClick={() => setPostFilter('all')}
                      className="px-4 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>সকল পোস্ট দেখুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => {
                      const isLiked = post.isLikedByBuyer || false;
                      const likesCount = post.likesCount || 12;
                      const reachCount = post.reachCount || 45;
                      const isWorkFirst = post.offerType === 'work_first' || post.isWorkFirst;
                      const isExpanded = expandedDescIds[post.id];
                      const desc = post.deliveryNote || post.title || '';
                      const isLongDesc = desc.length > 160;

                      return (
                        <div
                          key={post.id}
                          className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* 1. POST HEADER (FACEBOOK STYLE: AVATAR + NAME + TIME + PRIVACY GLOBE) */}
                          <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="relative shrink-0">
                                <img
                                  src={buyer.avatar || post.buyerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                                  alt={buyer.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                                />
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#1DB954] rounded-full border-2 border-white dark:border-slate-900" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {buyer.name}
                                  </span>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-tight mt-0.5">
                                  <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' }) : 'আজ'}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5 text-slate-500 dark:text-slate-400">
                                    <Globe className="w-3 h-3" />
                                    <span>পাবলিক পোস্ট</span>
                                  </span>
                                  <span>•</span>
                                  <span className="text-slate-400 font-mono">#{post.id.slice(-5)}</span>
                                </div>
                              </div>
                            </div>

                            {/* 3-Dot Options Menu */}
                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActive3DotPostId(active3DotPostId === post.id ? null : post.id);
                                }}
                                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
                                title="আরও অপশন"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {active3DotPostId === post.id && (
                                <div 
                                  className="absolute right-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 p-1.5 space-y-1 text-xs animate-fadeIn"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {isCurrentBuyer && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActive3DotPostId(null);
                                          if (onEditPost) onEditPost(post);
                                        }}
                                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <Pencil className="w-3.5 h-3.5 text-blue-500" />
                                        <span>পোস্টের বিবরণ এডিট</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActive3DotPostId(null);
                                          if (onRaiseBudget) onRaiseBudget(post);
                                        }}
                                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>বাজেট বৃদ্ধি করুন</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActive3DotPostId(null);
                                          if (onDeletePost) onDeletePost(post.id);
                                        }}
                                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                        <span>পোস্ট ডিলিট করুন</span>
                                      </button>
                                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                    </>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActive3DotPostId(null);
                                      handleCopyProfileLink(post.id);
                                    }}
                                    className="w-full px-3 py-2 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition cursor-pointer"
                                  >
                                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>পোস্ট লিংক কপি করুন</span>
                                  </button>

                                  {!isCurrentBuyer && (
                                    <>
                                      <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActive3DotPostId(null);
                                          if (window.confirm(`"${buyer.name}" কে ব্লক করতে চান? ব্লক করলে এই ইউজারের পোস্ট লুকানো থাকবে।`)) {
                                            alert(`"${buyer.name}"-কে ব্লক করা হয়েছে।`);
                                          }
                                        }}
                                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <Ban className="w-3.5 h-3.5 text-rose-500" />
                                        <span>ইউজার ব্লক করুন</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActive3DotPostId(null);
                                          alert("রিপোর্ট গ্রহণ করা হয়েছে।");
                                        }}
                                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <Flag className="w-3.5 h-3.5 text-blue-500" />
                                        <span>রিপোর্ট করুন</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 2. POST BODY (TITLE, DETAILS, BUDGET & ATTACHMENTS) */}
                          <div className="p-3.5 sm:p-4 space-y-3">
                            
                            {/* Project Title */}
                            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                              {post.title}
                            </h2>

                            {/* Tags & Badges */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800 flex items-center gap-1">
                                <Briefcase className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                <span>{post.category || "Web Development"}</span>
                              </span>

                              <span className="px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-bold bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                                <span>ডেলিভারি {post.deliveryDays || 5} দিন</span>
                              </span>

                              <span className={`px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-semibold border flex items-center gap-1 ${
                                isWorkFirst
                                  ? "bg-blue-50 dark:bg-blue-950/50 text-[#1877F2] border-blue-200 dark:border-blue-800"
                                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-[#1DB954] border-emerald-200 dark:border-emerald-800"
                              }`}>
                                <Zap className="w-3 h-3" />
                                <span>{isWorkFirst ? "আগে কাজ শুরু" : "এসক্রো ফান্ড জমা"}</span>
                              </span>
                            </div>

                            {/* Description Text */}
                            {desc && (
                              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                {isLongDesc && !isExpanded ? `${desc.slice(0, 160)}...` : desc}
                                {isLongDesc && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandDesc(post.id)}
                                    className="ml-1.5 text-[#1877F2] font-semibold hover:underline cursor-pointer inline-block"
                                  >
                                    {isExpanded ? 'কম দেখুন' : 'আরও পড়ুন'}
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Budget & Payment Guarantee Strip */}
                            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-emerald-50/50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-[#1877F2] flex items-center justify-center shrink-0">
                                  <Banknote className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block leading-tight">ক্লায়েন্ট বাজেট</span>
                                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white font-mono leading-tight">
                                    {post.budgetRange || `৳${(post.amount || 15000).toLocaleString('bn-BD')}`}
                                  </span>
                                </div>
                              </div>

                              <div className="border-l border-slate-200 dark:border-slate-700 pl-2.5 flex items-center justify-between">
                                <div className="min-w-0">
                                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block leading-tight">পেমেন্ট সিকিউরিটি</span>
                                  <span className="text-[11px] sm:text-xs font-semibold text-[#1DB954] flex items-center gap-1 truncate">
                                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                    <span>১০০% এসক্রো প্রটেক্টেড</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Optional Attachment Preview if provided */}
                            {post.attachmentUrl && (
                              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-64 bg-slate-100 dark:bg-slate-950">
                                <img
                                  src={post.attachmentUrl}
                                  alt={post.attachmentName || "Attachment"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>

                          {/* 3. ENGAGEMENT COUNTER BAR (FACEBOOK STYLE: 👍 12 জন • 💬 3 প্রস্তাব • 👁️ 45 রিচ) */}
                          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px] shadow-2xs">
                                <ThumbsUp className="w-2.5 h-2.5 fill-white" />
                              </span>
                              <span className="font-bold">{likesCount} জন পছন্দ করেছেন</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="hover:underline cursor-pointer">
                                ৪টি প্রপোজাল
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-slate-400" />
                                <span>{reachCount} রিচ</span>
                              </span>
                            </div>
                          </div>

                          {/* 4. FACEBOOK INTERACTION ACTION ROW (LIKE, COMMENT/PROPOSAL, SHARE, SUBMIT OFFER) */}
                          <div className="px-2 py-1.5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-1 text-center font-bold text-xs text-slate-600 dark:text-slate-300">
                            
                            {/* Like Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (onToggleLikePost) onToggleLikePost(post.id);
                              }}
                              className={`py-2 px-1 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                                isLiked
                                  ? 'text-[#1877F2] font-semibold bg-blue-50/80 dark:bg-blue-950/40'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                            >
                              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#1877F2]' : ''}`} />
                              <span>লাইক</span>
                            </button>

                            {/* Message / Proposal Button */}
                            <button
                              type="button"
                              onClick={() => {
                                onOpenChat(buyer, `আসসালামু আলাইকুম ${buyer.name}! আমি আপনার "${post.title}" প্রজেক্টের কাজের অফার দিতে চাই। বিস্তারিত আলোচনা করতে আগ্রহী।`);
                              }}
                              className="py-2 px-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                            >
                              <MessageSquare className="w-4 h-4 text-slate-500" />
                              <span>মেসেজ</span>
                            </button>

                            {/* Submit Custom Offer / Bid Modal */}
                            <button
                              type="button"
                              onClick={() => {
                                setProposalModalPost(post);
                                setCustomBidAmount(String(post.amount || 15000));
                              }}
                              className="py-2 px-1 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 font-semibold"
                            >
                              <Send className="w-4 h-4 text-emerald-500" />
                              <span>অফার দিন</span>
                            </button>

                            {/* Share Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyProfileLink(post.id)}
                              className="py-2 px-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                            >
                              {copiedShareId === post.id ? (
                                <>
                                  <Check className="w-4 h-4 text-emerald-500" />
                                  <span className="text-emerald-600 font-semibold">কপিড</span>
                                </>
                              ) : (
                                <>
                                  <Share2 className="w-4 h-4 text-slate-500" />
                                  <span>শেয়ার</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ABOUT / BIO & CONTACT DETAILS */}
            {activeTab === 'about' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <User className="w-5 h-5 text-[#1877F2]" />
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">বায়ার পরিচিতি ও বায়ো</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {buyer.bio || "আমি একজন সক্রিয় ক্লায়েন্ট ও উদ্যোক্তা। PTEN IT মার্কেটপ্লেসের মাধ্যমে বিভিন্ন ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন, ডিজিটাল মার্কেটিং এবং মোবাইল অ্যাপ প্রজেক্টে দক্ষ প্রফেশনালদের সাথে কাজ করি। সময়মতো নিখুঁত ডেলিভারি ও পারস্পরিক সম্মান বজায় রেখে দীর্ঘমেয়াদী কাজ করতে বিশ্বাসী।"}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ইমেইল ঠিকানা</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        <span>{buyer.email || "buyer@ptenit.com"}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">হোয়াটসঅ্যাপ ও মোবাইল</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{buyer.whatsapp || buyer.phone || "+880 1700-000000"}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ঠিকানা / লোকেশন</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{buyer.location || "ঢাকা, বাংলাদেশ"}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">এসক্রো ও পেমেন্ট ভেরিফিকেশন</span>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
                        <span>১০০% ফান্ড ভেরিফায়েড ক্লায়েন্ট</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REVIEWS & SELLER FEEDBACK */}
            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">সেলারদের রেটিং ও ফিডব্যাক</h3>
                    </div>
                    <span className="text-xs font-semibold text-[#1DB954] bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      ★ ৫.০ এভারেজ রেটিং
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        seller: "সোরাব হোসেন",
                        role: "Senior Full Stack Dev",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                        comment: "খুবই চমৎকার বায়ার। রিকোয়ারমেন্টস পরিষ্কারভাবে বুঝিয়ে দিয়েছিলেন এবং কাজ সম্পন্ন হতেই সাথে সাথে পেমেন্ট রিলিজ করেছেন। ওনার সাথে কাজ করা আনন্দের।",
                        date: "২ সপ্তাহ আগে",
                        rating: 5
                      },
                      {
                        seller: "তানজিলা ইসলাম",
                        role: "UI/UX Designer",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                        comment: "বায়ার খুবই অমায়িক এবং কাজের মূল্য বোঝেন। ফিডব্যাক চমৎকারভাবে শেয়ার করেন। ভবিষ্যতে আবার কাজ করার সুযোগ পেলে ভালো লাগবে।",
                        date: "১ মাস আগে",
                        rating: 5
                      },
                      {
                        seller: "আরিফুল ইসলাম",
                        role: "Digital Marketer",
                        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
                        comment: "১০০% বিশ্বস্ত বায়ার। ওনার বিজ্ঞাপনী প্রচারণার কাজের জন্য ধন্যবাদ। হাইলি রেকমেন্ডেড ক্লায়েন্ট!",
                        date: "২ মাস আগে",
                        rating: 5
                      }
                    ].map((rev, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img src={rev.avatar} alt={rev.seller} className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700" />
                            <div>
                              <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{rev.seller}</h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">{rev.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                          "{rev.comment}"
                        </p>
                        <span className="text-[10px] text-slate-400 block text-right font-medium">{rev.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 3. PROPOSAL / BID MODAL SHEET */}
        {proposalModalPost && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setProposalModalPost(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-[#1877F2]">
                  <Send className="w-3 h-3" />
                  <span>কাস্টম প্রস্তাব ও অফার জমা</span>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-tight">
                  "{proposalModalPost.title}" প্রজেক্টে বিড করুন
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ক্লায়েন্ট: <strong>{buyer.name}</strong> • বাজেট: {proposalModalPost.budgetRange || `৳${proposalModalPost.amount}`}
                </p>
              </div>

              {proposalSentSuccess ? (
                <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-[#1DB954] animate-bounce" />
                  <h4 className="text-sm font-semibold">প্রস্তাব সফলভাবে বায়ারকে পাঠানো হয়েছে!</h4>
                  <p className="text-xs">বায়ার আপনার সাথে চ্যাটবক্সে যোগাযোগ করবেন।</p>
                </div>
              ) : (
                <form onSubmit={handleSendProposalSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      আপনার প্রস্তাবিত বাজেট (৳ টাকা)
                    </label>
                    <input
                      type="number"
                      required
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      placeholder="যেমন: ১৫০০০"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1877F2]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      বায়ারের উদ্দেশ্যে কাজের বিবরণ ও ডেলিভারি কমিটমেন্ট
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={customBidMessage}
                      onChange={(e) => setCustomBidMessage(e.target.value)}
                      placeholder="আমি আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী কাজ করতে পারব..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1877F2]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setProposalModalPost(null)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>প্রস্তাব পাঠান</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BuyerProfileFeedModal;
