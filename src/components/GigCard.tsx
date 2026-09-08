import React, { useState, useMemo, useRef } from "react";
import {
  Heart,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Copy,
  Check,
  Bookmark,
  ShoppingBag,
  Sparkles,
  UserPlus,
  UserCheck,
  Flag,
  Ban,
  Eye,
  ExternalLink,
  Edit,
} from "lucide-react";
import { MarketplaceGig, User as UserType } from "../types";
import { useData } from "../context/DataContext";

// Bengali numeral converter helper
export const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

interface GigCardProps {
  gig: MarketplaceGig;
  onClick: () => void;
  currentUser?: UserType | null;
  savedGigIds?: string[];
  toggleFavorite?: (gigId: string, e: React.MouseEvent) => void;
  deleteGig?: (gigId: string) => void;
  onEdit?: (gig: MarketplaceGig) => void;
  badgeTag?: string;
  className?: string;
  layoutMode?: 'feed' | 'grid' | 'auto';
  openAuthModal?: () => void;
  actionButtonLabel?: string;
  actionButtonIcon?: React.ReactNode;
  onActionClick?: (e: React.MouseEvent) => void;
  isActionDone?: boolean;
  actionDoneLabel?: string;
  onAuthorClick?: () => void;
  pricePrefix?: string;
}

export const GigCard: React.FC<GigCardProps> = ({
  gig,
  onClick,
  currentUser,
  savedGigIds = [],
  toggleFavorite,
  deleteGig,
  onEdit,
  badgeTag,
  className = "",
  layoutMode = 'auto',
  openAuthModal,
  actionButtonLabel,
  actionButtonIcon,
  onActionClick,
  isActionDone,
  actionDoneLabel,
  onAuthorClick,
  pricePrefix,
}) => {
  const { marketplaceOrders, currentUser: contextUser, openMessengerInbox } = useData();
  const effectiveUser = currentUser || contextUser;

  // Check if current user has an active/completed order for this gig
  const userOrder = marketplaceOrders?.find((o) => {
    if (o.gigId !== gig.id && o.title !== gig.title) return false;
    if (o.status === "cancelled") return false;
    if (!effectiveUser) return true;
    return (
      o.buyerId === effectiveUser.id ||
      (effectiveUser.email && o.buyerEmail === effectiveUser.email) ||
      (effectiveUser.name && o.buyerName === effectiveUser.name) ||
      (effectiveUser.phone && o.buyerPhone === effectiveUser.phone)
    );
  });

  const isFavorite = savedGigIds.includes(gig.id);
  const isOwnerOrAdmin =
    effectiveUser &&
    (effectiveUser.role === "admin" ||
      effectiveUser.id === gig.sellerId ||
      (effectiveUser.name &&
        gig.sellerName.toLowerCase().includes(effectiveUser.name.toLowerCase())));

  const price = gig.packages?.basic?.price ?? 2000;
  const isAgency = gig.sellerId === "ptenit-agency" || gig.isAgencyStaff;

  // Facebook post interactive states
  const [isLiked, setIsLiked] = useState<boolean>(isFavorite);
  const [likeCount, setLikeCount] = useState<number>(() => {
    const base = gig.sellerRating && gig.sellerRating > 4.5 ? 24 : 16;
    return isFavorite ? base + 1 : base;
  });
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upCount, setUpCount] = useState<number>(() => {
    return 18 + ((gig.id.charCodeAt(0) || 1) % 15);
  });
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [downCount, setDownCount] = useState<number>(() => {
    return 2 + ((gig.id.charCodeAt(gig.id.length - 1) || 1) % 3);
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [shareCount, setShareCount] = useState<number>(() => {
    return 5 + ((gig.id.charCodeAt(gig.id.length - 1) || 1) % 8);
  });
  const [viewCount] = useState<number>(() => {
    return 148 + (((gig.id.charCodeAt(1) || 2) * 7) % 240);
  });

  // Views in thousands (e.g. "1.8K views" - English clean format)
  const viewCountInK = useMemo(() => {
    const charCode1 = gig.id.charCodeAt(0) || 1;
    const charCode2 = gig.id.charCodeAt(gig.id.length - 1) || 2;
    const rawNum = 1.2 + ((charCode1 * 11 + charCode2 * 7) % 36) / 10;
    const formatted = rawNum % 1 === 0 ? rawNum.toFixed(0) : rawNum.toFixed(1);
    return `${formatted}K views`;
  }, [gig.id]);

  // Multi-image list for gig card gallery - supports single image card or Facebook-style carousel
  const imageList = useMemo(() => {
    const list: string[] = [];
    if (gig.thumbnail) list.push(gig.thumbnail);
    if (gig.galleryImages && Array.isArray(gig.galleryImages)) {
      gig.galleryImages.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if ((gig as any).images && Array.isArray((gig as any).images)) {
      (gig as any).images.forEach((img: string) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    if (gig.portfolioWork && gig.portfolioWork.length > 0) {
      gig.portfolioWork.forEach((p) => {
        if (p.images && Array.isArray(p.images)) {
          p.images.forEach((im) => {
            if (im && !list.includes(im)) list.push(im);
          });
        }
      });
    }

    // Showcase carousel for multi-image gigs (e.g. gig-2, gig-4, gig-6, gig-8, gig-12) or if gallery has >1 images
    const isCarouselShowcase =
      (gig.galleryImages && gig.galleryImages.length > 1) ||
      gig.id === "gig-2" ||
      gig.id === "gig-4" ||
      gig.id === "gig-6" ||
      gig.id === "gig-8" ||
      gig.id === "gig-12" ||
      (gig as any).isCarousel;

    if (list.length === 1 && isCarouselShowcase) {
      const cat = (gig.category || "").toLowerCase();
      const tit = (gig.title || "").toLowerCase();

      const additionalPool: string[] = [];
      if (cat.includes("design") || tit.includes("logo") || tit.includes("গ্রাফিক") || tit.includes("ui")) {
        additionalPool.push(
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
        );
      } else if (cat.includes("web") || cat.includes("code") || tit.includes("ওয়েব") || tit.includes("mern") || tit.includes("react")) {
        additionalPool.push(
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        );
      } else if (cat.includes("video") || tit.includes("ভিডিও") || tit.includes("animation")) {
        additionalPool.push(
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80"
        );
      } else {
        additionalPool.push(
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80"
        );
      }

      additionalPool.forEach((img) => {
        if (list.length < 4 && !list.includes(img)) {
          list.push(img);
        }
      });
    }

    if (list.length === 0) {
      list.push(
        "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"
      );
    }
    return list;
  }, [gig]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  // Facebook post relative time (e.g. 18h)
  const postTime = useMemo(() => {
    if ((gig as any).createdAt) {
      try {
        const diffMs = Date.now() - new Date((gig as any).createdAt).getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours >= 1 && diffHours < 24) return `${diffHours}h`;
        if (diffHours >= 24) return `${Math.floor(diffHours / 24)}d`;
      } catch {
        // ignore
      }
    }
    return "18h";
  }, [gig]);

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.firstElementChild?.clientWidth || 260;
      const index = Math.round(scrollLeft / (cardWidth + 8));
      setCurrentImgIndex(Math.min(Math.max(0, index), imageList.length - 1));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    dragMoved.current = false;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollStart.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 4) {
      dragMoved.current = true;
    }
    carouselRef.current.scrollLeft = scrollStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const activeImage = imageList[currentImgIndex] || imageList[0];

  // Handle Facebook Like Toggle
  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(gig.id, e);
    }
    setIsLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  };

  // Handle Upvote Reaction Toggle
  const handleUpvoteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpvoted((prev) => {
      const next = !prev;
      setUpCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      if (next && isDownvoted) {
        setIsDownvoted(false);
        setDownCount((c) => Math.max(0, c - 1));
      }
      return next;
    });
  };

  // Handle Downvote Reaction Toggle
  const handleDownvoteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownvoted((prev) => {
      const next = !prev;
      setDownCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      if (next && isUpvoted) {
        setIsUpvoted(false);
        setUpCount((c) => Math.max(0, c - 1));
      }
      return next;
    });
  };

  // Handle Send Message to Seller (Facebook Messenger Style)
  const handleMessageSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!effectiveUser) {
      if (openAuthModal) openAuthModal();
      return;
    }
    if (openMessengerInbox) {
      openMessengerInbox(undefined, 'messages');
    }
  };

  // Handle Share / Copy Link
  const handleShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?tab=marketplace&gig=${gig.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      });
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Check if we should render Facebook Mobile Card
  const isFeedMode = layoutMode === 'feed' || layoutMode === 'auto';

  if (isBlocked) {
    return (
      <div className="p-4 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 text-center font-bengali space-y-2 my-2 shadow-xs">
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          🚫 <strong>{gig.sellerName}</strong>-কে ব্লক করা হয়েছে। এই সেলারের পোস্ট ও গিগ লুকানো রয়েছে।
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsBlocked(false);
          }}
          className="text-xs font-bold text-[#1877F2] dark:text-blue-400 hover:underline cursor-pointer"
        >
          আনব্লক করুন
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE FACEBOOK POST & MARKETPLACE CARD (SHOWN ON PHONE IN FEED MODE)  */}
      {/* ========================================================================= */}
      <div
        onClick={onClick}
        className={`${
          isFeedMode ? "flex sm:hidden" : "hidden"
        } flex-col bg-white dark:bg-slate-900 border ${
          userOrder
            ? "border-blue-500/80 ring-1 ring-blue-500/20 shadow-md"
            : "border-slate-200/90 dark:border-slate-800"
        } rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer font-bengali ${className}`}
      >
        {/* --- Facebook Post Header --- */}
        <div className="p-3 pb-2 flex items-center justify-between gap-2">
          {/* Seller Avatar & Meta */}
          <div 
            onClick={(e) => {
              if (onAuthorClick) {
                e.stopPropagation();
                onAuthorClick();
              }
            }}
            className={`flex items-center gap-2 min-w-0 flex-1 ${onAuthorClick ? "cursor-pointer group/author" : ""}`}
            title={onAuthorClick ? "প্রোফাইল ও গিগসমূহ দেখুন" : undefined}
          >
            <div className="relative shrink-0">
              <img
                src={
                  gig.sellerAvatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                }
                alt={gig.sellerName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-[#1877F2]/20 border border-slate-200 dark:border-slate-700 group-hover/author:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Line 1: Name (text-[13.5px] font-semibold) + Verified Blue Tick (Strictly 1 line) */}
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-100 truncate group-hover/author:text-[#1877F2] transition-colors">
                  {gig.sellerName}
                </span>
                <CheckCircle2
                  className="w-3.5 h-3.5 text-[#1877F2] fill-[#1877F2] text-white shrink-0"
                  title="Verified Profile"
                />
              </div>

              {/* Line 2: Guaranteed single-line display: 240d • Top Rated • Agency • Public Icon */}
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 whitespace-nowrap flex-nowrap overflow-hidden">
                <span className="shrink-0">{postTime}</span>
                <span className="text-slate-400 dark:text-slate-500 text-[8px] shrink-0">•</span>
                <span className="font-semibold text-[#1877F2] dark:text-blue-400 shrink-0">
                  Top Rated
                </span>
                {isAgency && (
                  <>
                    <span className="text-slate-400 dark:text-slate-500 text-[8px] shrink-0">•</span>
                    <span className="font-normal text-slate-600 dark:text-slate-300 shrink-0">Agency</span>
                  </>
                )}
                <span className="text-slate-400 dark:text-slate-500 text-[8px] shrink-0">•</span>
                <Globe
                  className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0"
                  aria-label="Public"
                />
              </div>
            </div>
          </div>

          {/* Right Header Options (Edit/Delete if admin/owner, Follow Button, 3-dots Menu) */}
          <div className="flex items-center gap-1 shrink-0 relative">
            {isOwnerOrAdmin && onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(gig);
                }}
                className="p-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-full transition cursor-pointer"
                title="গিগ এডিট করুন"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}

            {isOwnerOrAdmin && deleteGig && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete gig "${gig.title}"?`)) {
                    deleteGig(gig.id);
                  }
                }}
                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition cursor-pointer"
                title="Delete Gig"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Follow Button (compact, clean font-medium, rounded-full) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFollowing((prev) => !prev);
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition flex items-center gap-1 cursor-pointer active:scale-95 shrink-0 ${
                isFollowing
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  : "bg-blue-50 dark:bg-blue-950/60 text-[#1877F2] dark:text-blue-400 hover:bg-[#1877F2] hover:text-white"
              }`}
              title={isFollowing ? "Unfollow" : "Follow"}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3 text-[#1877F2]" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  <span>Follow</span>
                </>
              )}
            </button>

            {/* 3-dots More Menu */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
              title="Menu"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Quick 3-Dots Dropdown Menu */}
            {isMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-9 z-30 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 text-xs space-y-0.5 animate-fadeIn font-bengali"
              >
                {/* 1. If Own Gig: Edit & Delete Options */}
                {isOwnerOrAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        if (onEdit) {
                          onEdit(gig);
                        } else {
                          onClick();
                        }
                      }}
                      className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>গিগ এডিট করুন</span>
                    </button>

                    {deleteGig && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          if (window.confirm(`Delete gig "${gig.title}"?`)) {
                            deleteGig(gig.id);
                          }
                        }}
                        className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>গিগ ডিলিট করুন</span>
                      </button>
                    )}
                    <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />
                  </>
                )}

                {/* 2. Details button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onClick();
                  }}
                  className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                  <span>বিস্তারিত তথ্য দেখুন</span>
                </button>

                {/* 3. Copy Link */}
                <button
                  type="button"
                  onClick={(e) => {
                    handleShareLink(e);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                  <span>{copiedLink ? "লিংক কপি হয়েছে!" : "লিংক কপি করুন"}</span>
                </button>

                {/* 4. If NOT Own Gig (Buyer / Visitor): Block Seller & Report Options */}
                {!isOwnerOrAdmin && (
                  <>
                    <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        if (window.confirm(`"${gig.sellerName}" কে ব্লক করতে চান? ব্লক করলে এই সেলারের কোনো গিগ বা অফার আপনার ফিডে প্রদর্শিত হবে না।`)) {
                          setIsBlocked(true);
                        }
                      }}
                      className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>সেলার ব্লক করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        setIsReported(true);
                        alert(`"${gig.title}" এর জন্য রিপোর্ট গ্রহণ করা হয়েছে। দ্রুত রিভিউ করা হবে।`);
                      }}
                      className="w-full px-2.5 py-2 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2 text-[#1877F2] dark:text-blue-400 font-medium cursor-pointer"
                    >
                      <Flag className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                      <span>{isReported ? "রিপোর্ট জমা হয়েছে" : "রিপোর্ট করুন"}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- Facebook Post Caption / Title (Clean font-normal, not bold) --- */}
        <div className="px-3 pt-0.5 pb-2">
          <p className="text-[13.5px] font-normal text-slate-800 dark:text-slate-200 leading-snug">
            {gig.title}
          </p>
        </div>

        {/* --- Facebook Media: Single Card OR Facebook-style Carousel Cards --- */}
        {imageList.length <= 1 ? (
          /* Single Image Card: Image + "Start Work First" & Price - Click opens full seller details modal */
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="relative w-full overflow-hidden select-none bg-slate-950 cursor-pointer group/singleimg"
            title="ছবিতে ক্লিক করে সেলারের বিস্তারিত তথ্য ও প্যাকেজ দেখুন"
          >
            <div className="aspect-[4/3] w-full overflow-hidden relative">
              <img
                src={activeImage}
                alt={gig.title}
                className="w-full h-full object-cover group-hover/singleimg:scale-105 transition-transform duration-500 ease-out"
              />
              {/* Subtle hover overlay hint */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/singleimg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>বিস্তারিত দেখুন</span>
                </span>
              </div>
            </div>
            {/* Card Bottom: Start Work First + Starts at ৳2,000 */}
            <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#1877F2] dark:text-blue-400 flex items-center gap-1.5">
                Start Work First
              </span>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-normal">{pricePrefix || "Starts at"}</span>
                <span className="font-semibold text-[#1877F2] dark:text-blue-400">
                  ৳{price.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Multi-Image: Facebook Carousel Cards */
          <div className="relative w-full select-none">
            {/* Horizontal Snap Scroll Carousel Track */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex gap-2 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-3 py-0.5 scroll-pl-3 scroll-pr-3 cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {imageList.map((img, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    if (dragMoved.current) {
                      e.stopPropagation();
                      return;
                    }
                    e.stopPropagation();
                    onClick();
                  }}
                  className="w-[72%] sm:w-[250px] shrink-0 snap-start rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs cursor-pointer group/card flex flex-col"
                >
                  {/* Carousel Card Image */}
                  <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img
                      src={img}
                      alt={`${gig.title} - ${idx + 1}`}
                      className="w-full h-full object-cover group-hover/card:scale-102 transition duration-300 pointer-events-none"
                    />
                  </div>

                  {/* Carousel Card Bottom: Start Work First + Starts at ৳2,000 */}
                  <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                    <span className="text-xs font-semibold text-[#1877F2] dark:text-blue-400 flex items-center gap-1 truncate">
                      Start Work First
                    </span>
                    <div className="flex items-center gap-1 text-xs shrink-0">
                      <span className="text-slate-500 dark:text-slate-400 font-normal">{pricePrefix || "Starts at"}</span>
                      <span className="font-semibold text-[#1877F2] dark:text-blue-400">
                        ৳{price.toLocaleString("en-US")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Facebook Reactions & Engagement Counter Bar (Clean font-normal) --- */}
        <div className="px-3 py-1.5 flex items-center justify-between gap-1 text-xs text-slate-600 dark:text-slate-300">
          {/* 1. Left: Facebook Likes */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex -space-x-1 items-center">
              <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px] shadow-xs ring-1 ring-white dark:ring-slate-900">
                <ThumbsUp className="w-2.5 h-2.5 fill-white text-white" />
              </span>
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] shadow-xs ring-1 ring-white dark:ring-slate-900">
                <Heart className="w-2.5 h-2.5 fill-white text-white" />
              </span>
            </div>
            <span className="font-normal text-slate-600 dark:text-slate-400 text-xs">
              {likeCount} {likeCount === 1 ? "like" : "likes"}
            </span>
          </div>

          {/* 2. Right: Views Counter (1.8K views) */}
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="font-normal text-slate-500 dark:text-slate-400 text-xs">
              {viewCountInK}
            </span>
          </div>
        </div>

        {/* --- Action Bar: Up, Down, Details (3 round pill buttons, subtle Facebook style, clean font-medium) --- */}
        <div className="px-3 py-2 grid grid-cols-3 gap-2 items-center border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
          {/* 1. Up / Upvote */}
          <button
            type="button"
            onClick={handleUpvoteToggle}
            className={`py-2 px-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs ${
              isUpvoted
                ? "text-[#1877F2] bg-blue-50 dark:bg-blue-950/60 font-semibold"
                : "text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
            title="Upvote"
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${
                isUpvoted ? "fill-[#1877F2] text-[#1877F2]" : "text-slate-600 dark:text-slate-300"
              }`}
            />
            <span>Up {upCount}</span>
          </button>

          {/* 2. Down / Downvote */}
          <button
            type="button"
            onClick={handleDownvoteToggle}
            className={`py-2 px-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs ${
              isDownvoted
                ? "text-blue-600 bg-blue-50 dark:bg-blue-950/60 font-semibold"
                : "text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
            title="Downvote"
          >
            <ThumbsDown
              className={`w-3.5 h-3.5 ${
                isDownvoted ? "fill-blue-600 text-blue-600" : "text-slate-600 dark:text-slate-300"
              }`}
            />
            <span>Down {downCount}</span>
          </button>

          {/* 3. Details or Custom Action Button (e.g. 'রিসিভ' for seller public offers) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onActionClick) {
                onActionClick(e);
              } else {
                onClick();
              }
            }}
            className={`py-2 px-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs group/btn ${
              isActionDone
                ? "bg-emerald-500/20 text-[#1DB954] border border-emerald-500/30 font-semibold"
                : actionButtonLabel
                ? "bg-[#1DB954] hover:bg-emerald-600 text-white font-bold"
                : "text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
            title={actionButtonLabel || "View Details"}
          >
            {isActionDone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>{actionDoneLabel || "রিসিভড"}</span>
              </>
            ) : (
              <>
                {actionButtonIcon}
                <span>{actionButtonLabel || "বিস্তারিত"}</span>
                {!actionButtonIcon && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 group-hover/btn:translate-x-0.5 transition-transform" />
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP & COMPACT GRID CARD (SHOWN ON DESKTOP OR WHEN IN GRID MODE)     */}
      {/* ========================================================================= */}
      <div
        onClick={onClick}
        className={`${
          isFeedMode ? "hidden sm:flex" : "flex"
        } group relative bg-white dark:bg-slate-900 border ${
          userOrder
            ? "border-blue-500/70 ring-1 ring-blue-500/20 shadow-md"
            : "border-slate-200/90 dark:border-slate-800"
        } rounded-2xl sm:rounded-3xl overflow-hidden shadow-none sm:shadow-sm hover:shadow-2xl hover:shadow-[#1DB954]/10 hover:border-[#1DB954] transition-all duration-300 cursor-pointer flex flex-col justify-between font-bengali ${className}`}
      >
        <div>
          {/* Thumbnail Header with Left/Right Image Navigation - Click opens details */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="relative h-32 sm:h-44 md:h-48 overflow-hidden bg-slate-950 select-none cursor-pointer group/thumb"
            title="ছবিতে ক্লিক করে সেলারের বিস্তারিত তথ্য ও প্যাকেজ দেখুন"
          >
            <img
              src={activeImage}
              alt={gig.title}
              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500 ease-out"
            />

            {/* Soft Bottom Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent pointer-events-none" />

            {/* Top Floating Badges Section */}
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 flex items-center gap-1 sm:gap-1.5 flex-wrap max-w-[70%] pointer-events-none">
              {gig.offerBadge === "work_first" || gig.offerBadge === "আগে কাজ শুরু" ? (
                <span className="bg-[#1877F2] text-white text-[9px] sm:text-[11px] font-semibold px-1.5 py-0.5 sm:px-2 rounded shadow-xs">
                  Start Work First
                </span>
              ) : (
                <span className="bg-[#1DB954] text-white text-[9px] sm:text-[11px] font-medium px-1.5 py-0.5 sm:px-2 rounded shadow-xs">
                  {gig.offerBadge === "৩০% ক্যাশব্যাক" ? "30% Off" : gig.offerBadge || "30% Off"}
                </span>
              )}

              {userOrder && (
                <span className="bg-blue-600 text-white text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                  <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white shrink-0" />
                  <span>Ordered</span>
                </span>
              )}

              {badgeTag && (
                <span className="bg-blue-600 text-white text-[8px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                  {badgeTag}
                </span>
              )}
            </div>

            {/* Top Right Action Icons */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center gap-1 sm:gap-1.5">
              {isOwnerOrAdmin && (
                <>
                  {onEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(gig);
                      }}
                      className="p-1 sm:p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition cursor-pointer"
                      title="গিগ এডিট করুন"
                    >
                      <Edit className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}
                  {deleteGig && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(`Are you sure you want to delete gig "${gig.title}"?`)
                        ) {
                          deleteGig(gig.id);
                        }
                      }}
                      className="p-1 sm:p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
                      title="Delete Gig"
                    >
                      <Trash2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}
                </>
              )}

              {toggleFavorite && (
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(gig.id, e)}
                  className={`p-1 sm:p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                    isFavorite
                      ? "bg-rose-500 text-white shadow-lg scale-105"
                      : "bg-slate-950/70 text-white hover:text-rose-400 hover:bg-slate-950 shadow-md"
                  }`}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Heart
                    className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${
                      isFavorite ? "fill-current" : ""
                    }`}
                  />
                </button>
              )}

              {/* 3-Dot Menu Button on Desktop */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen((prev) => !prev);
                  }}
                  className="p-1 sm:p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition cursor-pointer"
                  title="আরও অপশন"
                >
                  <MoreHorizontal className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                </button>

                {isMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-8 z-30 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 text-xs space-y-0.5 animate-fadeIn font-bengali text-left"
                  >
                    {isOwnerOrAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            if (onEdit) {
                              onEdit(gig);
                            } else {
                              onClick();
                            }
                          }}
                          className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>গিগ এডিট করুন</span>
                        </button>
                        {deleteGig && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMenuOpen(false);
                              if (window.confirm(`Delete gig "${gig.title}"?`)) {
                                deleteGig(gig.id);
                              }
                            }}
                            className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>গিগ ডিলিট করুন</span>
                          </button>
                        )}
                        <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onClick();
                      }}
                      className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                      <span>বিস্তারিত দেখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        handleShareLink(e);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                      <span>{copiedLink ? "লিংক কপি হয়েছে!" : "লিংক কপি করুন"}</span>
                    </button>

                    {!isOwnerOrAdmin && (
                      <>
                        <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            if (window.confirm(`"${gig.sellerName}" কে ব্লক করতে চান? ব্লক করলে এই সেলারের কোনো গিগ বা অফার আপনার ফিডে প্রদর্শিত হবে না।`)) {
                              setIsBlocked(true);
                            }
                          }}
                          className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>সেলার ব্লক করুন</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(false);
                            setIsReported(true);
                            alert(`"${gig.title}" এর রিপোর্ট জমা হয়েছে।`);
                          }}
                          className="w-full px-2.5 py-1.5 text-left rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2 text-[#1877F2] dark:text-blue-400 font-medium cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5 text-[#1877F2] shrink-0" />
                          <span>{isReported ? "রিপোর্ট জমা হয়েছে" : "রিপোর্ট করুন"}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Clean Navigation < & > */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-1 sm:left-1.5 top-1/2 -translate-y-1/2 z-20 p-1 text-white/90 hover:text-white hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer active:scale-90"
                  title="Previous Image"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 z-20 p-1 text-white/90 hover:text-white hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all cursor-pointer active:scale-90"
                  title="Next Image"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Content Body */}
          <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3">
            {/* Seller Identity Bar */}
            <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-1.5 sm:pb-2.5">
              <div 
                onClick={(e) => {
                  if (onAuthorClick) {
                    e.stopPropagation();
                    onAuthorClick();
                  }
                }}
                className={`flex items-center gap-1.5 min-w-0 ${onAuthorClick ? "cursor-pointer group/author" : ""}`}
                title={onAuthorClick ? "প্রোফাইল ও গিগসমূহ দেখুন" : undefined}
              >
                <div className="relative shrink-0">
                  <img
                    src={
                      gig.sellerAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={gig.sellerName}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-[#1DB954] group-hover/author:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white dark:ring-slate-900 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover/author:text-[#1DB954] transition-colors">
                      {gig.sellerName}
                    </span>
                    <CheckCircle2
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0084FF] fill-[#0084FF] text-white shrink-0"
                      title="Verified Profile"
                    />
                  </div>
                  <span className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 block truncate font-normal">
                    {gig.sellerLevel || "Top Rated"}
                  </span>
                </div>
              </div>

              {isAgency ? (
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-[#1DB954]/15 text-[#1DB954] text-[8px] sm:text-xs font-semibold border border-[#1DB954]/30 shrink-0">
                  Agency
                </span>
              ) : (
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[8px] sm:text-xs font-medium border border-slate-200 dark:border-slate-700 shrink-0">
                  Pro
                </span>
              )}
            </div>

            {/* Gig Title */}
            <h3 className="text-xs sm:text-[15px] font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
              {gig.title}
            </h3>

            {/* Key Feature Chips */}
            {gig.tags && gig.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {gig.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] sm:text-xs font-normal text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded sm:rounded-md truncate max-w-[90px]"
                  >
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
            <span className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal block leading-tight">
              {pricePrefix || "Starts at"}
            </span>
            <div className="flex items-baseline gap-0.5 sm:gap-1">
              <span className="text-xs sm:text-base md:text-lg font-bold text-[#1DB954] block leading-tight">
                ৳{price.toLocaleString("en-US")}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onActionClick) {
                onActionClick(e);
              } else {
                onClick();
              }
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0 ${
              isActionDone
                ? "bg-emerald-500/20 text-[#1DB954] border border-emerald-500/30 font-semibold"
                : actionButtonLabel
                ? "bg-[#1DB954] hover:bg-emerald-600 text-white font-bold"
                : "text-white bg-[#1DB954] hover:bg-emerald-600 sm:shadow-md sm:shadow-[#1DB954]/20"
            }`}
          >
            {isActionDone ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#1DB954]" />
                <span>{actionDoneLabel || "রিসিভড"}</span>
              </>
            ) : (
              <>
                {actionButtonIcon}
                <span>{actionButtonLabel || "বিস্তারিত"}</span>
                {!actionButtonIcon && (
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
