import React from 'react';
import { Star, Heart, Trash2, Clock, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Zap, ShoppingBag } from 'lucide-react';
import { MarketplaceGig, User as UserType } from '../types';
import { useData } from '../context/DataContext';

interface GigCardProps {
  gig: MarketplaceGig;
  onClick: () => void;
  currentUser?: UserType | null;
  savedGigIds?: string[];
  toggleFavorite?: (gigId: string, e: React.MouseEvent) => void;
  deleteGig?: (gigId: string) => void;
  badgeTag?: string;
  className?: string;
}

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  onClick,
  currentUser,
  savedGigIds = [],
  toggleFavorite,
  deleteGig,
  badgeTag,
  className = ''
}) => {
  const { marketplaceOrders, currentUser: contextUser } = useData();
  const effectiveUser = currentUser || contextUser;

  // Check if current user has an active/completed order for this gig
  const userOrder = marketplaceOrders?.find(o => {
    if (o.gigId !== gig.id && o.title !== gig.title) return false;
    if (o.status === 'cancelled') return false;
    if (!effectiveUser) return true; // match by gig if user placed order
    return (
      o.buyerId === effectiveUser.id ||
      (effectiveUser.email && o.buyerEmail === effectiveUser.email) ||
      (effectiveUser.name && o.buyerName === effectiveUser.name) ||
      (effectiveUser.phone && o.buyerPhone === effectiveUser.phone)
    );
  });

  const isFavorite = savedGigIds.includes(gig.id);
  const isOwnerOrAdmin = effectiveUser && (
    effectiveUser.role === 'admin' ||
    effectiveUser.id === gig.sellerId ||
    (effectiveUser.name && gig.sellerName.toLowerCase().includes(effectiveUser.name.toLowerCase()))
  );

  const price = gig.packages?.basic?.price ?? 2000;
  const deliveryDays = gig.packages?.basic?.deliveryDays ?? 3;
  const isAgency = gig.sellerId === 'ptenit-agency' || gig.isAgencyStaff;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white dark:bg-slate-900 border ${
        userOrder ? 'border-blue-500/70 ring-1 ring-blue-500/20 shadow-md' : 'border-slate-200/90 dark:border-slate-800'
      } rounded-2xl sm:rounded-3xl overflow-hidden shadow-none sm:shadow-sm hover:shadow-2xl hover:shadow-[#1DB954]/10 hover:border-[#1DB954] transition-all duration-300 cursor-pointer flex flex-col justify-between font-bengali ${className}`}
    >
      <div>
        {/* Thumbnail Header */}
        <div className="relative h-32 sm:h-44 md:h-48 overflow-hidden bg-slate-950">
          <img
            src={gig.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80'}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />

          {/* Soft Bottom Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top Floating Badges Section */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 flex items-center gap-1 sm:gap-1.5 flex-wrap max-w-[85%]">
            {/* Offer / Discount Badge */}
            {(gig.offerBadge === 'work_first' || gig.offerBadge === 'আগে কাজ শুরু') ? (
              <span className="bg-amber-500 text-slate-950 text-[9px] sm:text-[11px] font-bold font-bengali px-1.5 py-0.5 sm:px-2 rounded shadow-xs">
                আগে কাজ শুরু
              </span>
            ) : (
              <span className="bg-[#1DB954] text-white text-[9px] sm:text-[11px] font-bold font-bengali px-1.5 py-0.5 sm:px-2 rounded shadow-xs">
                {gig.offerBadge === '৩০% ক্যাশব্যাক' ? '৩০% ছাড়' : (gig.offerBadge || '৩০% ছাড়')}
              </span>
            )}

            {/* Ordered Status Badge */}
            {userOrder && (
              <span className="bg-blue-600 text-white text-[8px] sm:text-[9px] font-extrabold font-bengali px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white shrink-0" />
                <span>অর্ডারকৃত</span>
              </span>
            )}

            {badgeTag && (
              <span className="bg-amber-400 text-slate-950 text-[8px] sm:text-[10px] font-bold font-bengali px-1.5 py-0.5 rounded shadow-xs">
                {badgeTag}
              </span>
            )}
          </div>

          {/* Top Right Action Icons */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1 sm:gap-1.5">
            {isOwnerOrAdmin && deleteGig && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`আপনি কি নিশ্চিত যে "${gig.title}" গিগটি স্থায়ীভাবে ডিলেট করতে চান?`)) {
                    deleteGig(gig.id);
                  }
                }}
                className="p-1 sm:p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
                title="গিগ ডিলেট করুন"
              >
                <Trash2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

            {toggleFavorite && (
              <button
                type="button"
                onClick={(e) => toggleFavorite(gig.id, e)}
                className={`p-1 sm:p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500 text-white shadow-lg scale-105'
                    : 'bg-slate-950/60 text-white hover:text-rose-400 hover:bg-slate-950 border border-white/20'
                }`}
                title={isFavorite ? 'ফেভারিট থেকে সরান' : 'ফেভারিটে যোগ করুন'}
              >
                <Heart className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Floating Specs overlay on image bottom */}
          <div className="absolute bottom-1.5 left-2 right-2 sm:bottom-2.5 sm:left-3 sm:right-3 z-10 flex items-center justify-between text-[9px] sm:text-xs font-bold text-white">
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-100 flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#1DB954]" />
              <span>{deliveryDays} দিন</span>
            </span>

            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 flex items-center gap-0.5 sm:gap-1">
              <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{gig.rating || 5.0}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3">
          {/* Seller Identity Bar */}
          <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-1.5 sm:pb-2.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={gig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={gig.sellerName}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-[#1DB954]"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-slate-900 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-slate-100 truncate group-hover:text-[#1DB954] transition-colors">
                    {gig.sellerName}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                </div>
                <span className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 block truncate font-medium">
                  {gig.sellerLevel || 'Top Rated'}
                </span>
              </div>
            </div>

            {isAgency ? (
              <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-[#1DB954]/15 text-[#1DB954] text-[8px] sm:text-xs font-black border border-[#1DB954]/30 shrink-0">
                Agency
              </span>
            ) : (
              <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[8px] sm:text-xs font-bold border border-slate-200 dark:border-slate-700 shrink-0">
                Pro
              </span>
            )}
          </div>

          {/* Gig Title */}
          <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors min-h-[2rem] sm:min-h-[2.75rem]">
            {gig.title}
          </h3>

          {/* Key Feature Chips */}
          {gig.tags && gig.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {gig.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="text-[9px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded sm:rounded-md truncate max-w-[90px]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Price & Action Ribbon */}
      <div className="p-2 sm:p-3.5 md:p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1 bg-slate-50/70 dark:bg-slate-950/40 rounded-b-2xl sm:rounded-b-3xl">
        <div className="min-w-0">
          <span className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold block leading-tight">
            প্রথম শুরু
          </span>
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span className="text-xs sm:text-base md:text-lg font-black text-[#1DB954] block leading-tight">
              ৳ {price.toLocaleString('bn-BD')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-600 shadow-xs sm:shadow-md sm:shadow-[#1DB954]/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
        >
          <span>বিস্তারিত</span>
          <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
};
