import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  CheckCircle2,
  Award,
  FileText,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Share2,
  Gift,
  Facebook,
  Crown,
  Maximize2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Globe,
  MessageSquare,
  BadgeCheck,
  User,
  HelpCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceOrder, MarketplaceGigPackage, MarketplaceGig } from '../types';
import { SinglePromoBadgeView } from '../utils/badgeHelper';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export interface ServiceDetailModalProps {
  service: Service | MarketplaceGig;
  onClose: () => void;
  setActiveTab?: (tab: string, category?: string) => void;
  openAuthModal?: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  setActiveTab,
  openAuthModal
}) => {
  const { currentUser, siteSettings, addMarketplaceOrder, updateService, t, signup } = useData();

  // Active Tab: 'overview' | 'portfolio' | 'reviews' | 'seller' | 'faqs'
  const [activeTabState, setActiveTabState] = useState<'overview' | 'portfolio' | 'reviews' | 'seller' | 'faqs'>('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Client Reviews List
  const reviewsList = [
    {
      name: 'তানভীর আহমেদ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      date: '৩ দিন আগে',
      rating: 5,
      comment: 'অসাধারণ অভিজ্ঞতা! প্রজেক্টের সময়সীমার আগেই নিখুঁত এবং ক্লিন কোড ডেলিভারি পেয়েছি। ১০০% রেকমেন্ডেড!'
    },
    {
      name: 'নাসরিন সুলতানা',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      date: '১ সপ্তাহ আগে',
      rating: 5,
      comment: 'রেসপন্সিভ ডিজাইন ও কাস্টমার ফ্রেন্ডলি সাপোর্ট পেয়েছি। প্রতিটি রিকোয়ারমেন্ট নিখুঁতভাবে তৈরি।'
    },
    {
      name: 'মেহেদী হাসান',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      date: '২ সপ্তাহ আগে',
      rating: 5,
      comment: 'একদম প্রফেশনাল টিম। সম্পূর্ণ টেস্টেড কোড এবং সুন্দর ডকুমেন্টেশন প্রদান করেছেন।'
    },
    {
      name: 'সাকিব আল হাসান',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      date: '৩ সপ্তাহ আগে',
      rating: 5,
      comment: 'উচ্চমানের সার্ভিস ও ইনস্ট্যান্ট রেসপন্স। ভবিষ্যতে যেকোনো প্রজেক্টে এই টিমকেই ফার্স্ট চয়েস রাখব।'
    }
  ];

  // Selected Package: 'basic' | 'standard' | 'premium'
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('basic');

  // Checkout Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Customer Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.mobile || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPassword, setCustomerPassword] = useState('');
  const [projectRequirements, setProjectRequirements] = useState('');

  // Auto-fill user fields when currentUser becomes available
  useEffect(() => {
    if (currentUser) {
      setCustomerName(prev => prev || currentUser.name || '');
      setCustomerPhone(prev => prev || currentUser.mobile || '');
      setCustomerEmail(prev => prev || currentUser.email || '');
    }
  }, [currentUser]);

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [orderError, setOrderError] = useState<string | null>(null);

  // Order Placement & State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedDemoLink, setCopiedDemoLink] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Admin In-Modal Live Demo & Gallery Management State
  const [adminDemoUrl, setAdminDemoUrl] = useState(service.demoUrl || '');
  const [isEditingAdminDemo, setIsEditingAdminDemo] = useState(false);
  const [saveDemoSuccess, setSaveDemoSuccess] = useState(false);
  const [newGalleryImgUrl, setNewGalleryImgUrl] = useState('');

  // Media Gallery & Demo State
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Consolidated Media List
  const serviceMediaList: string[] = Array.from(new Set([
    service.thumbnail,
    ...(service.demoImages || []),
    ...(service.galleryImages || [])
  ].filter(Boolean))) as string[];

  // Packages Normalized
  const defaultFeatures = service.features && service.features.length > 0
    ? service.features
    : ['কাস্টম রেসপন্সিভ ডিজাইন', 'এসইও ফ্রেন্ডলি স্ট্রাকচার', 'টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি'];

  const servicePackages: Record<'basic' | 'standard' | 'premium', MarketplaceGigPackage> = {
    basic: {
      name: service.packages?.basic?.name || 'বেসিক প্যাকেজ',
      price: service.packages?.basic?.price ?? 5000,
      deliveryDays: service.packages?.basic?.deliveryDays ?? 3,
      revisions: (service.packages?.basic?.revisions as any) || '3',
      features: service.packages?.basic?.features || defaultFeatures.slice(0, 3)
    },
    standard: {
      name: service.packages?.standard?.name || 'স্ট্যান্ডার্ড প্যাকেজ',
      price: service.packages?.standard?.price ?? 12000,
      deliveryDays: service.packages?.standard?.deliveryDays ?? 5,
      revisions: (service.packages?.standard?.revisions as any) || '5',
      features: service.packages?.standard?.features || defaultFeatures.slice(0, 4)
    },
    premium: {
      name: service.packages?.premium?.name || 'প্রিমিয়াম প্যাকেজ',
      price: service.packages?.premium?.price ?? 25000,
      deliveryDays: service.packages?.premium?.deliveryDays ?? 7,
      revisions: (service.packages?.premium?.revisions as any) || 'Unlimited',
      features: service.packages?.premium?.features || defaultFeatures
    }
  };

  const currentPackage = servicePackages[selectedTier];

  // Lightbox keyboard controls
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : serviceMediaList.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < serviceMediaList.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, serviceMediaList.length]);

  const copyText = (text: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const copyShareLink = () => {
    copyText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  // Step 1: Proceed to Payment
  const handleProceedToPaymentStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOrderError(null);

    if (!customerName.trim()) {
      setOrderError('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!customerPhone.trim()) {
      setOrderError('অনুগ্রহ করে আপনার সচল মোবাইল / হোয়াটসঅ্যাপ নম্বর দিন।');
      return;
    }

    const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    if (!bdPhoneRegex.test(cleanPhone)) {
      setOrderError('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }

    if (!customerEmail.trim()) {
      setOrderError('অনুগ্রহ করে আপনার ইমেইল অ্যাড্রেস প্রদান করুন।');
      return;
    }

    setCheckoutStep(2);
  };

  // Step 2: Finalize Service Order
  const handleConfirmOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOrderError(null);

    if (!trxId.trim()) {
      setOrderError('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    // Enforce account creation on purchase if user is a guest ("লাস্ট টাইম সার্ভিস কিনার পর জোর করে সাইনআপ করিয়ে নিবে")
    let activeBuyerId = currentUser?.id;
    if (!activeBuyerId) {
      activeBuyerId = `usr-${Date.now()}`;
      const finalPass = customerPassword.trim() || '123456';
      const newUserData = {
        name: customerName.trim() || 'সম্মানিত বায়ার',
        email: customerEmail.trim() || `${customerPhone.trim()}@ptenit.com`,
        mobile: customerPhone.trim(),
        role: 'customer' as const,
        roles: ['customer' as const],
        activeRole: 'customer' as const
      };
      if (signup) {
        signup(newUserData, finalPass);
      }
    }

    const orderId = `SRV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: MarketplaceOrder = {
      id: orderId,
      type: 'custom_agency_order',
      gigId: service.id,
      title: `${service.title} (${currentPackage.name})`,
      category: service.category,
      packageType: selectedTier,
      buyerId: activeBuyerId,
      buyerName: customerName.trim(),
      buyerEmail: customerEmail.trim(),
      buyerPhone: customerPhone.trim(),
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit Official Agency',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isInternalStaff: true,
      amount: currentPackage.price,
      adminCommission: 0,
      sellerPayout: currentPackage.price,
      paymentMethod: `${paymentMethod} (TrxID: ${trxId})`,
      transactionId: trxId,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      status: 'in_progress',
      deliveryNote: `অফিশিয়াল সার্ভিস প্যাকেজ গ্রহণ করা হয়েছে। প্রয়োজনীয়তা: ${projectRequirements.trim() || 'সাধারণ রিকোয়ারমেন্টস'}`,
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date(Date.now() + (currentPackage.deliveryDays || 3) * 86400000).toISOString().split('T')[0]
    };

    addMarketplaceOrder(newOrder);
    setCompletedOrder(newOrder);
    setIsOrderPlaced(true);
  };

  const getOrderWhatsAppLink = (order: MarketplaceOrder) => {
    const rawNum = siteSettings?.supportPhone || '8801700000000';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    const msg = `হ্যালো, আমি "${service.title}" সার্ভিসের জন্য অর্ডার সম্পন্ন করেছি।\nঅর্ডার আইডি: ${order.id}\nআমার নাম: ${customerName}\nপ্যাকেজ: ${selectedTier.toUpperCase()} (৳${currentPackage.price.toLocaleString('bn-BD')})\nপেমেন্ট মেথড: ${paymentMethod} (TrxID: ${trxId})\nদয়া করে প্রজেক্টের কাজ শুরু করুন।`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  const getInquiryWhatsAppLink = () => {
    const rawNum = siteSettings?.supportPhone || '8801700000000';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    const msg = `হ্যালো, আমি আপনাদের "${service.title}" সার্ভিস প্যাকেজ সম্পর্কে জানতে আগ্রহী। আমাকে বিস্তারিত জানাবেন কি?`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  // Social Media Share State & Handlers
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.title,
          text: `PTENit এর প্রফেশনাল সার্ভিস: ${service.title}`,
          url: getShareUrl(),
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      setIsShareMenuOpen(prev => !prev);
    }
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${service.title}\n${getShareUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(service.title);
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  // Gig-style Package Selector and Order Card (Matching GigDetailPage exactly!)
  const renderPackageAndOrder = (isMobileView: boolean) => {
    return (
      <div className={`space-y-3.5 font-bengali ${isMobileView ? 'max-w-[345px] sm:max-w-[380px] mx-auto px-0.5' : 'w-full'}`}>
        {/* Centered Heading with subtle light underline */}
        <div className="text-center pb-0.5">
          <span className="inline-block text-sm sm:text-base font-bold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-1 px-3">
            প্যাকেজ সিলেক্ট করেন
          </span>
        </div>

        {/* 3-Package Selector: ছোট, গোল ও কিউট পিল ডিজাইন */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 p-0.5 text-xs font-bold text-center">
          {(['basic', 'standard', 'premium'] as const).map((pKey) => {
            const isSelected = selectedTier === pKey;
            let activeClass = '';
            let inactiveClass = '';
            let label = '';

            if (pKey === 'basic') {
              label = 'বেসিক';
              activeClass = 'bg-[#15803d] text-white shadow-xs scale-105 border border-[#15803d]';
              inactiveClass = 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-500/40';
            } else if (pKey === 'standard') {
              label = 'স্ট্যান্ডার্ড';
              activeClass = 'bg-red-600 text-white shadow-xs scale-105 border border-red-600';
              inactiveClass = 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-500/40';
            } else {
              label = 'প্রিমিয়াম';
              activeClass = 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shadow-xs scale-105 border border-purple-600';
              inactiveClass = 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-purple-500/40';
            }

            return (
              <button
                key={pKey}
                type="button"
                onClick={() => setSelectedTier(pKey)}
                className={`py-1.5 px-3.5 sm:px-4 rounded-full transition-all cursor-pointer text-center text-xs font-bold flex items-center justify-center ${
                  isSelected ? activeClass : inactiveClass
                }`}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* প্যাকেজ কার্ড: হালকা কালো বর্ডার, কার্ডের টপ বর্ডারের ঠিক সেন্টারে সিলেক্ট করা প্যাকেজের ব্যাজ */}
        <div className="relative mt-5 bg-white dark:bg-slate-900 px-3.5 sm:px-5 pt-5 pb-4 rounded-2xl border border-neutral-700/35 dark:border-slate-700 shadow-sm space-y-3.5">
          {/* বর্ডারের সেন্টারে উপরে ব্যাজ */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            {selectedTier === 'basic' && (
              <span className="text-xs font-bold text-white bg-[#15803d] px-4 py-1 rounded-full shadow-md inline-flex items-center justify-center text-center whitespace-nowrap">
                বেসিক প্যাকেজ
              </span>
            )}
            {selectedTier === 'standard' && (
              <span className="text-xs font-bold text-white bg-red-600 px-4 py-1 rounded-full shadow-md inline-flex items-center justify-center text-center whitespace-nowrap">
                স্ট্যান্ডার্ড প্যাকেজ
              </span>
            )}
            {selectedTier === 'premium' && (
              <span className="text-xs font-bold text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border border-purple-500/40 px-4 py-1 rounded-full shadow-md inline-flex items-center justify-center text-center whitespace-nowrap">
                প্রিমিয়াম প্যাকেজ
              </span>
            )}
          </div>

          {/* Package Title */}
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {currentPackage.name || (selectedTier === 'basic' ? 'বেসিক প্যাকেজ' : selectedTier === 'standard' ? 'স্ট্যান্ডার্ড প্যাকেজ' : 'প্রিমিয়াম প্যাকেজ')}
          </h4>

          {/* প্যাকেজের মূল্য ও ছাড়ের বিবরণ: চিকন ড্যাশড বর্ডার (প্যাকেজ কালার অনুযায়ী) */}
          <div
            className={`flex items-center justify-between py-2.5 px-3.5 sm:px-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-dashed transition-all ${
              selectedTier === 'basic'
                ? 'border-[#15803d]'
                : selectedTier === 'standard'
                ? 'border-red-600'
                : 'border-purple-600'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  অফার
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedTier === 'basic'
                      ? 'text-[#15803d] bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-700/60'
                      : selectedTier === 'standard'
                      ? 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-300/80 dark:border-red-700/60'
                      : 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-300/80 dark:border-purple-700/60'
                  }`}
                >
                  ৩০% ছাড়
                </span>
              </div>
              <div
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  selectedTier === 'basic'
                    ? 'text-[#15803d]'
                    : selectedTier === 'standard'
                    ? 'text-red-600'
                    : 'text-purple-700 dark:text-purple-400'
                }`}
              >
                ৳{(currentPackage.price ?? 2500).toLocaleString('bn-BD')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">
                রেগুলার প্রাইস
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-400 dark:text-slate-500 line-through">
                ৳{(Math.round((currentPackage.price ?? 2500) * 1.3)).toLocaleString('bn-BD')}
              </div>
            </div>
          </div>

          {/* ডেলিভারি সময় ও রিভিশন */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 py-2 border-y border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#15803d]" />
              <span>{currentPackage.deliveryDays ?? 3} দিনে ডেলিভারি</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Check className="w-3.5 h-3.5 text-[#15803d]" />
              <span>{currentPackage.revisions ?? '3'}টি রিভিশন</span>
            </span>
          </div>

          {/* ফিচারের তালিকা */}
          <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 py-1">
            {(currentPackage.features || defaultFeatures || ['হাই-কোয়ালিটি ডেলিভারি', 'সোর্স ফাইল', 'সাপোর্ট']).map((f, idx) => (
              <li key={idx} className="flex items-center gap-2 font-normal">
                <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Active Order Notice Pill if applicable */}
          {isOrderPlaced && (
            <div className="p-3 bg-[#15803d]/10 border border-[#15803d]/30 rounded-xl flex items-center justify-between text-xs font-bold text-[#15803d]">
              <span className="flex items-center gap-1.5 truncate">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#15803d]" />
                <span className="truncate">অর্ডারকৃত সার্ভিস {completedOrder?.id ? `(আইডি: #${completedOrder.id})` : ''}</span>
              </span>
              <span className="text-[10px] bg-[#15803d] text-white px-2 py-0.5 rounded-md font-black uppercase shrink-0">
                একটিভ
              </span>
            </div>
          )}

          {/* "অর্ডার করুন" বাটন (প্যাকেজ অনুযায়ী ফোকাসড কালার ও ৪-কোণা রাউন্ডেড স্টাইল) */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => {
                setOrderModalOpen(true);
                if (!isOrderPlaced) {
                  setCheckoutStep(1);
                }
                setOrderError(null);
              }}
              className={`w-full py-3 px-4 rounded-lg text-white font-bold font-bengali text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
                selectedTier === 'basic'
                  ? 'bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d]'
                  : selectedTier === 'standard'
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                  : 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-900'
              }`}
            >
              <span>{isOrderPlaced ? 'অর্ডার সম্পন্ন • স্ট্যাটাস দেখুন' : 'অর্ডার করুন'}</span>
              <span className="opacity-60">•</span>
              <span className="font-extrabold text-amber-200">
                ৳{(currentPackage.price ?? 2500).toLocaleString('bn-BD')}
              </span>
            </button>
          </div>

          {/* নিচে "১০-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি" ও "দ্রুত অনলাইন টেকনিক্যাল সাপোর্ট" */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 space-y-1.5">
            {siteSettings?.enableMoneyBackGuarantee !== false && (
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#15803d] shrink-0" />
                <span>{siteSettings?.moneyBackGuaranteeText || `${siteSettings?.moneyBackGuaranteeDays || 10}-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি`}</span>
              </p>
            )}
            <p className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#15803d] shrink-0" />
              <span>দ্রুত অনলাইন টেকনিক্যাল সাপোর্ট</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const activeAccNum = paymentMethod === 'bKash' 
    ? (siteSettings?.bkashNumber || '01712345678') 
    : paymentMethod === 'Nagad' 
    ? (siteSettings?.nagadNumber || '01700000000') 
    : paymentMethod === 'Rocket' 
    ? (siteSettings?.rocketNumber || '01900000000') 
    : (siteSettings?.bankAccountNumber || '2181100098765');

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto min-h-screen font-bengali p-3 sm:p-6 md:p-8 animate-fadeIn text-slate-800 dark:text-slate-100">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Main Service Content Container (Matching DigitalProductDetailModal!) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs">

          {/* 1. TOP BAR: ব্যাক বাটন | সেন্টারে: আগে কাজ শুরু / প্রিমিয়াম সার্ভিস | শেয়ার সোশ্যাল মিডিয়া */}
          <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 rounded-t-2xl sm:rounded-t-3xl">
            {/* LEFT: BACK BUTTON (বেক বাটন - ChevronLeft, কালো কালার, কোনো বর্ডার ছাড়া) */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shrink-0 border-0 outline-none"
              title={t('ফিরে যান', 'Go Back')}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-slate-900 dark:text-white" />
              <span className="hidden xs:inline text-slate-900 dark:text-white">{t('ফিরে যান', 'Go Back')}</span>
            </button>

            {/* CENTER: সার্ভিস বা গিগ হলে আগে কাজ শুরু বা প্রিমিয়াম সার্ভিস শো করবে (কালো আইকন ও টেক্সট) */}
            <div className="flex items-center justify-center min-w-0">
              <SinglePromoBadgeView 
                item={{ id: service.id, title: service.title, price: (service as any).price, offerBadge: (service as any).offerBadge }} 
                itemType="service" 
                textColor="text-slate-900 dark:text-white"
              />
            </div>

            {/* RIGHT: শেয়ার সোশ্যাল মিডিয়া (Social Media Share - কালো আইকন ও টেক্সট) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 border-0 outline-none"
                title="সোশ্যাল মিডিয়ায় শেয়ার করুন"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 dark:text-white" />
                <span className="hidden sm:inline text-slate-900 dark:text-white">শেয়ার</span>
              </button>

              {/* Share Popover Dropdown */}
              {isShareMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsShareMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-56 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 space-y-2 animate-fadeIn font-bengali">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 border-b border-slate-100 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                      <span>সোশ্যাল মিডিয়ায় শেয়ার করুন</span>
                      <button
                        type="button"
                        onClick={() => setIsShareMenuOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          shareWhatsApp();
                          setIsShareMenuOpen(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition cursor-pointer"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                        <span className="truncate">হোয়াটসঅ্যাপ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          shareFacebook();
                          setIsShareMenuOpen(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition cursor-pointer"
                      >
                        <Facebook className="w-4 h-4 text-[#1877F2] shrink-0" />
                        <span className="truncate">ফেসবুক</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          shareTwitter();
                          setIsShareMenuOpen(false);
                        }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <span className="truncate">টুইটার (X)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold truncate">কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
                            <span className="truncate">লিংক কপি</span>
                          </>
                        )}
                      </button>
                    </div>

                    {typeof navigator !== 'undefined' && !!navigator.share && (
                      <button
                        type="button"
                        onClick={() => {
                          handleNativeShare();
                          setIsShareMenuOpen(false);
                        }}
                        className="w-full py-1.5 px-2 mt-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#1DB954]" />
                        <span>অন্যান্য অ্যাপসে শেয়ার</span>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Service Banner Image - Click to Zoom & Subtle Prev/Next Navigation */}
          <div 
            onClick={() => setLightboxIndex(activeMediaIndex)}
            className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden cursor-zoom-in group select-none"
            title="বড় করে দেখতে ক্লিক করুন"
          >
            <img
              src={serviceMediaList[activeMediaIndex] || service.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80'}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
            />

            {/* Subtle Prev & Next Navigation Buttons on Top Photo */}
            {serviceMediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : serviceMediaList.length - 1));
                  }}
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/75 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs active:scale-95 shadow-md"
                  title="পূর্ববর্তী ছবি"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIndex((prev) => (prev < serviceMediaList.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/75 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs active:scale-95 shadow-md"
                  title="পরবর্তী ছবি"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Subtle Zoom Hint in Top Right */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white/90 text-[11px] sm:text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 backdrop-blur-xs font-medium">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>বড় করে দেখুন</span>
            </div>

            {/* Meta text directly on the photo (Above title) - 1 Single Line */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 sm:p-3 z-20 flex items-center flex-nowrap overflow-x-auto scrollbar-none gap-2 text-[11px] sm:text-xs text-white/90 whitespace-nowrap"
            >
              <span className="inline-flex items-center gap-1 font-bold text-amber-400 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{service.rating || 5}</span>
                <span className="text-white/70 font-normal">({service.reviewsCount || 48})</span>
              </span>
              <span className="text-white/40 shrink-0">·</span>
              <span className="font-medium text-white/95 shrink-0">
                ১৫০+ প্রজেক্ট ডেলিভারি
              </span>
              <span className="text-white/40 shrink-0">·</span>
              <span className="font-medium text-white/95 shrink-0">
                {service.category}
              </span>
            </div>
          </div>

          {/* Header (Outside/Below the Photo) */}
          <div className="p-3.5 sm:p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
            {/* Title - Full display (না কেটে পুরো টাইটেল দেখাবে), matching font size of 'এই প্রোডাক্টে আপনি যা যা পাবেন:' (text-sm sm:text-base font-bold) */}
            <div className="min-w-0">
              <h1 
                className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white leading-snug break-words" 
                title={service.title}
              >
                {service.title}
              </h1>
            </div>

            {/* Compact Demo Screenshots Strip directly under Title - Click switches top photo WITHOUT zoom */}
            {serviceMediaList.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {serviceMediaList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setActiveMediaIndex(idx);
                        // Deliberately no setLightboxIndex here! Just changes active photo
                      }}
                      className={`relative w-16 h-11 sm:w-20 sm:h-13 rounded-lg overflow-hidden shrink-0 transition cursor-pointer border ${
                        activeMediaIndex === idx
                          ? 'border-[#1DB954] ring-2 ring-[#1DB954]/40 scale-102 opacity-100'
                          : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                      }`}
                      title={`ডেমো ছবি ${idx + 1}`}
                    >
                      <img src={imgUrl} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Body (lg:grid-cols-12 - Matching DigitalProductDetailModal!) */}
          <div className="p-3.5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tabs Header - 5 Tabs: সার্ভিস বিবরণী, পোর্টফোলিও, রিভিউ (35), সেলার বায়ো, প্রশ্নোত্তর (FAQ) */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 sm:gap-6 text-xs sm:text-sm font-bold font-bengali overflow-x-auto scrollbar-none">
                {[
                  { id: 'overview', label: 'সার্ভিস বিবরণী' },
                  { id: 'portfolio', label: 'পোর্টফোলিও' },
                  { id: 'reviews', label: `রিভিউ (${service.reviewsCount || 35})` },
                  { id: 'seller', label: 'সেলার বায়ো' },
                  { id: 'faqs', label: 'প্রশ্নোত্তর (FAQ)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTabState(tab.id as any)}
                    className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTabState === tab.id
                        ? 'border-[#1DB954] text-[#1DB954]'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW (সার্ভিস বিবরণী) */}
              {activeTabState === 'overview' && (
                <div className="space-y-6 animate-fadeIn font-bengali">
                  
                  {/* Service Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heading mb-2 text-slate-900 dark:text-white">
                      সার্ভিস বিবরণী
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                      {service.fullDescription || service.shortDescription}
                    </p>
                  </div>

                  {/* What You Will Get (এই সার্ভিসে আপনি যা যা পাবেন) */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                      <span>এই সার্ভিসে আপনি যা যা পাবেন:</span>
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-normal">
                      {defaultFeatures.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements & Work Process (প্রয়োজনীয় রিকোয়ারমেন্টস ও কাজের প্রক্রিয়া) */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-heading mb-2 text-slate-900 dark:text-white">
                      প্রয়োজনীয় রিকোয়ারমেন্টস ও কাজের প্রক্রিয়া
                    </h3>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 font-normal">
                      <li>১০০% হ্যান্ড-কোডেড ও আধুনিক প্রযুক্তির রেসপন্সিভ আর্কিটেকচার</li>
                      <li>ক্লিন ও অপ্টিমাইজড সোর্স ফাইল ডেলিভারি সহ লাইভ টেস্টেড প্রজেক্ট</li>
                      <li>প্রয়োজনীয় ব্রাউজার বা মোবাইল ডিভাইসে পূর্ণাঙ্গ টেস্ট রিপোর্ট</li>
                      <li>ডেলিভারি পরবর্তীতে ফ্রি রিভিশন ও ইনস্টলেশন সাপোর্ট</li>
                    </ul>
                  </div>

                  {/* Verified Service Profile & Guarantee (ভেরিফাইড সার্ভিস প্রোফাইল) */}
                  <div className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1DB954] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                        ভেরিফাইড সার্ভিস (PTENit Agency)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        ১০০% সিকিউর এস্ক্রো ও মানি ব্যাক গ্যারান্টি
                      </p>
                    </div>
                  </div>

                  {/* ফোন ভিউতে সার্ভিস বিবরণীর ঠিক নিচেই গিগ প্যাকেজ সিলেক্ট (এর নিচে আর কিছু থাকবে না) */}
                  <div className="block lg:hidden pt-2">
                    {renderPackageAndOrder(true)}
                  </div>

                </div>
              )}

              {/* TAB 2: PORTFOLIO (পোর্টফোলিও) */}
              {activeTabState === 'portfolio' && (
                <div className="space-y-6 animate-fadeIn font-bengali">
                  
                  {/* Live Demo Link Card: Only shown if admin provided demoUrl */}
                  {service.demoUrl && service.demoUrl.trim() ? (
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse shrink-0" />
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate whitespace-nowrap">
                          <Globe className="w-4 h-4 text-[#1DB954] shrink-0" />
                          <span className="truncate">লাইভ ডেমো প্রিভিউ</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={service.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs transition shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>লাইভ দেখুন</span>
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Admin Controls for Demo URL and Gallery */}
                  {currentUser?.role === 'admin' && (
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                          <Edit3 className="w-4 h-4 text-[#1DB954]" />
                          <span>এডমিন কন্ট্রোল: লাইভ ডেমো লিংক ও গ্যালারি আপডেট</span>
                        </div>
                        {saveDemoSuccess && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                            ✓ সফলভাবে সংরক্ষিত হয়েছে!
                          </span>
                        )}
                      </div>

                      {/* Edit Demo URL Input */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          লাইভ ডেমো ওয়েবসাইট লিংক (URL)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://your-service-demo.com"
                            value={adminDemoUrl}
                            onChange={(e) => setAdminDemoUrl(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-[#1DB954]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateService(service.id, { demoUrl: adminDemoUrl.trim() });
                              setSaveDemoSuccess(true);
                              setTimeout(() => setSaveDemoSuccess(false), 2500);
                            }}
                            className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            লিংক সেভ
                          </button>
                        </div>
                      </div>

                      {/* Add New Screenshot to Gallery */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          নতুন স্ক্রিনশট ছবির লিংক যোগ করুন
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://example.com/screenshot.png"
                            value={newGalleryImgUrl}
                            onChange={(e) => setNewGalleryImgUrl(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-mono focus:outline-none focus:border-[#1DB954]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newGalleryImgUrl.trim()) return;
                              const currentImages = service.demoImages || service.galleryImages || [];
                              const updated = [...currentImages, newGalleryImgUrl.trim()];
                              updateService(service.id, { demoImages: updated, galleryImages: updated });
                              setNewGalleryImgUrl('');
                              setSaveDemoSuccess(true);
                              setTimeout(() => setSaveDemoSuccess(false), 2500);
                            }}
                            className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ছবি যোগ</span>
                          </button>
                        </div>
                      </div>

                      {/* Manage Existing Screenshots */}
                      {serviceMediaList.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                            বিদ্যমান ছবি ব্যবস্থাপনা ({serviceMediaList.length}টি)
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {serviceMediaList.map((url, i) => (
                              <div key={i} className="relative group/thumb w-16 h-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                                <img src={url} alt="thumb" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentImages = service.demoImages || service.galleryImages || [];
                                    const updated = currentImages.filter((img) => img !== url);
                                    updateService(service.id, { demoImages: updated, galleryImages: updated });
                                  }}
                                  className="absolute inset-0 bg-black/60 flex items-center justify-center text-rose-400 opacity-0 group-hover/thumb:opacity-100 transition cursor-pointer"
                                  title="ছবি রিমুভ করুন"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Screenshots & Preview Gallery Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white truncate whitespace-nowrap">
                          ডেমো স্ক্রিনশট ও প্রিভিউ গ্যালারী
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-bengali truncate whitespace-nowrap">
                          যেকোনো ছবিতে ক্লিক করে ফুলস্ক্রিনে বড় করে দেখুন
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap">
                        মোট ছবি: {serviceMediaList.length}টি
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {serviceMediaList.map((mediaUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-900 cursor-zoom-in border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition duration-200"
                        >
                          <img
                            src={mediaUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-xs">
                              <Maximize2 className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: REVIEWS (রিভিউ) */}
              {activeTabState === 'reviews' && (
                <div className="space-y-5 animate-fadeIn font-bengali">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-current" />
                      <span>ক্লায়েন্টদের রিভিউ ও রেটিং</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-300/40">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{service.rating || 5.0} ({service.reviewsCount || 35}টি রিভিউ)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {reviewsList.map((rev, rIdx) => (
                      <div key={rIdx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.avatar}
                            alt={rev.name}
                            className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{rev.name}</h4>
                            <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-500 shrink-0">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal leading-relaxed">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SELLER BIO (সেলার বায়ো) */}
              {activeTabState === 'seller' && (
                <div className="space-y-4 sm:space-y-5 animate-fadeIn font-bengali">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954]" />
                    <span>সেলার প্রোফাইল</span>
                  </h3>

                  <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3.5 sm:space-y-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <img
                        src={(service as any).sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                        alt={(service as any).sellerName || "PTENit Certified Team"}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-500 shrink-0 mt-0.5 sm:mt-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
                            {(service as any).sellerName || "PTENit Certified Team"}
                          </h4>
                          <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                          <span className="text-amber-500 font-bold whitespace-nowrap">{(service as any).sellerLevel || "Top Rated Agency"}</span>
                          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
                          <span className="text-[#15803d] dark:text-[#1DB954] font-semibold whitespace-nowrap">{(service as any).sellerTitle || "Full-Stack Engineers"}</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                          ★ {((service as any).sellerRating || service.rating || 5.0).toFixed(1)} রেটিং · {((service as any).salesCount ? `${(service as any).salesCount}+ সফল ডেলিভারি` : '১২০+ সফল প্রজেক্ট ডেলিভারি')}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      আমরা PTENit এর ভেরিফাইড ইঞ্জিনিয়ার ও ক্রিয়েটিভ টিম। গত ৫ বছর যাবত দেশি ও আন্তর্জাতিক ক্লায়েন্টদের জন্য কাস্টম ওয়েব অ্যাপ, SaaS সফটওয়্যার এবং ই-কমার্স সল্যুশন ডেভেলপ করে আসছি। প্রতিটি প্রজেক্ট শতভাগ কোয়ালিটি ও সিকিউরিটি নিশ্চিত করে গ্রাহকের চাহিদা অনুযায়ী প্রস্তুত করা হয়।
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Firebase', 'API Integration'].map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setOrderModalOpen(true);
                        setCheckoutStep(1);
                        setOrderError(null);
                      }}
                      className="w-full py-2.5 sm:py-3 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                    >
                      <span>অর্ডার করুন • ৳{(currentPackage.price ?? 5000).toLocaleString('bn-BD')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: FAQS (প্রশ্নোত্তর FAQ) */}
              {activeTabState === 'faqs' && (
                <div className="space-y-4 animate-fadeIn font-bengali">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954]" />
                    <span>সাধারণ প্রশ্ন ও উত্তর (FAQs)</span>
                  </h3>

                  <div className="space-y-2.5">
                    {[
                      {
                        q: 'কাজ কতদিনের মধ্যে ডেলিভারি করা হবে?',
                        a: 'প্যাকেজ নির্বাচন অনুযায়ী ৩ থেকে ৭ কার্যদিবসের মধ্যে সম্পূর্ণ কাজ ডেলিভারি করা হবে। জরুরি প্রয়োজনে এক্সপ্রেস ডেলিভারির সুবিধা রয়েছে।'
                      },
                      {
                        q: 'আমি কি কাজ সংশোধন বা রিভিশন করে নিতে পারব?',
                        a: 'জি, আপনার কাজ পছন্দ না হওয়া পর্যন্ত নির্বাচিত প্যাকেজ অনুযায়ী রিভিশন সেবা অন্তর্ভুক্ত রয়েছে।'
                      },
                      {
                        q: 'টাকা কীভাবে পরিশোধ করব এবং এস্ক্রো কীভাবে কাজ করে?',
                        a: 'বিকাশ, নগদ, রকেট বা ব্যাংক একাউন্টের মাধ্যমে এস্ক্রো ওয়ালেটে পেমেন্ট করবেন। আপনি কাজ বুঝে পেয়ে সন্তুষ্ট হওয়ার পর ডেভেলপার অর্থ পাবেন।'
                      },
                      {
                        q: 'ডেলিভারি পরবর্তীতে কি টেকনিক্যাল সাপোর্ট পাব?',
                        a: 'হ্যাঁ, প্রজেক্ট ডেলিভারির পর ৩০ দিন পর্যন্ত ফ্রি টেকনিক্যাল সাপোর্ট ও ইনস্টলেশন গাইডলাইন প্রদান করা হবে।'
                      }
                    ].map((faq, fIdx) => (
                      <div key={fIdx} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                          className="w-full p-3.5 sm:p-4 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-[#1DB954] transition-transform duration-200 ${openFaqIndex === fIdx ? 'rotate-180' : ''}`} />
                        </button>
                        {openFaqIndex === fIdx && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800 leading-relaxed font-normal">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Action Sidebar (Desktop Only: sticky top-4) */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-4">
                {renderPackageAndOrder(false)}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 2-Step Enrollment & Payment Checkout Modal (Matching DigitalProductDetailModal!) */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-7 relative shadow-2xl space-y-5 text-slate-900 dark:text-white my-auto animate-in fade-in zoom-in-95 duration-200">
            
            <button
              type="button"
              onClick={() => setOrderModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isOrderPlaced ? (
              <>
                {/* Modal Header */}
                <div className="text-center space-y-1 pt-1">
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full inline-block">
                    সার্ভিস বুকিং ও পেমেন্ট
                  </span>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 dark:text-white">
                    {checkoutStep === 1 ? 'ধাপ ১: আপনার যোগাযোগের তথ্য' : 'ধাপ ২: পেমেন্ট মেথড ও কনফার্মেশন'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali truncate max-w-md mx-auto">
                    {service.title} ({currentPackage.name}) — <span className="font-bold text-[#15803d] dark:text-[#1DB954]">
                      ৳{currentPackage.price.toLocaleString('bn-BD')}
                    </span>
                  </p>
                </div>

                {/* Step Progress Indicators */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      checkoutStep === 1
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${checkoutStep === 1 ? 'bg-[#15803d] text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}>
                      ১
                    </span>
                    <span>যোগাযোগ ও রিকোয়ারমেন্ট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (customerName.trim() && customerPhone.trim() && customerEmail.trim()) {
                        setCheckoutStep(2);
                      }
                    }}
                    disabled={!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      checkoutStep === 2
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs cursor-pointer'
                        : 'text-slate-400 dark:text-slate-500 disabled:opacity-50'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${checkoutStep === 2 ? 'bg-[#15803d] text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}>
                      ২
                    </span>
                    <span>পেমেন্ট ও অর্ডার</span>
                  </button>
                </div>

                {/* Error Banner */}
                {orderError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bengali flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* STEP 1: Customer Info Form */}
                {checkoutStep === 1 && (
                  <form onSubmit={handleProceedToPaymentStep} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                        আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: মোঃ সাকিব হাসান"
                        value={customerName}
                        onChange={e => {
                          setCustomerName(e.target.value);
                          if (orderError) setOrderError(null);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                        মোবাইল / হোয়াটসঅ্যাপ নম্বর <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={customerPhone}
                        onChange={e => {
                          setCustomerPhone(e.target.value);
                          if (orderError) setOrderError(null);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-bengali">
                        ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন।
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                        ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={customerEmail}
                        onChange={e => {
                          setCustomerEmail(e.target.value);
                          if (orderError) setOrderError(null);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                      />
                    </div>

                    {!currentUser && (
                      <div>
                        <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                          একাউন্ট পাসওয়ার্ড <span className="text-emerald-500 text-[11px] font-normal">(অর্ডার ট্র্যাকিং ও লগইনের জন্য)</span>
                        </label>
                        <input
                          type="password"
                          placeholder="কমপক্ষে ৬ অক্ষরের একটি পাসওয়ার্ড দিন (ঐচ্ছিক)"
                          value={customerPassword}
                          onChange={e => setCustomerPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                        />
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-bengali flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>সার্ভিস ক্রয়ের সাথে সাথে আপনার এই প্রোফাইলটি স্বয়ংক্রিয়ভাবে পিটেন + বায়ার আইডি হিসেবে সাইনআপ হয়ে যাবে।</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                        প্রজেক্টের সংক্ষিপ্ত চাহিদা / স্পেশাল নোট (ঐচ্ছিক)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="আপনার কোনো স্পেশাল রিকোয়ারমেন্ট থাকলে সংক্ষেপে লিখুন..."
                        value={projectRequirements}
                        onChange={e => setProjectRequirements(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold font-bengali text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-2"
                    >
                      <span>পরবর্তী ধাপ: পেমেন্ট মেথড</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* STEP 2: Payment Form */}
                {checkoutStep === 2 && (
                  <form onSubmit={handleConfirmOrder} className="space-y-4 font-bengali">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                        পেমেন্ট মেথড সিলেক্ট করুন
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map(method => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                              paymentMethod === method
                                ? 'bg-emerald-500/15 border-[#15803d] text-[#15803d] dark:text-[#1DB954]'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            {method === 'bKash' ? 'বিকাশ' : method === 'Nagad' ? 'নগদ' : method === 'Rocket' ? 'রকেট' : 'ব্যাংক'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Account Number Box with 1-Click Copy */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">
                          {paymentMethod} একাউন্ট নম্বর:
                        </span>
                        <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">
                          {activeAccNum}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          copyText(activeAccNum);
                          setCopiedNumber(true);
                          setTimeout(() => setCopiedNumber(false), 2000);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold flex items-center gap-1 hover:bg-slate-100 cursor-pointer"
                      >
                        {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি'}</span>
                      </button>
                    </div>

                    {/* Instructions */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      উপরের নম্বরে <strong className="text-slate-800 dark:text-slate-200">৳{currentPackage.price.toLocaleString('bn-BD')}</strong> সেন্ড মানি বা পেমেন্ট করে নিচের বক্সে আপনার পেমেন্ট ট্রানজেকশন আইডি (TrxID) লিখুন।
                    </p>

                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                        ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 9K8X2M14QP"
                        value={trxId}
                        onChange={e => {
                          setTrxId(e.target.value);
                          if (orderError) setOrderError(null);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        পেছনে
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>অর্ডার কনফার্ম করুন (৳{currentPackage.price.toLocaleString('bn-BD')})</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* ORDER CONFIRMED SUCCESS VIEW */
              <div className="text-center space-y-4 py-3 font-bengali">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    সার্ভিস বুকিং সফল হয়েছে!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের টিম খুব দ্রুত প্রজেক্টের কাজ শুরু করবে।
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>পিটেন + বায়ার প্রোফাইল সক্রিয় হয়েছে ({customerName || 'নতুন বায়ার'})</span>
                  </div>
                </div>

                {/* Order Summary Box */}
                {completedOrder && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <span className="text-slate-500">অর্ডার নম্বর:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">#{completedOrder.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <span className="text-slate-500">সার্ভিস:</span>
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{service.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                      <span className="text-slate-500">প্যাকেজ:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{currentPackage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">পরিশোধিত মূল্য:</span>
                      <span className="font-black text-[#15803d] dark:text-[#1DB954]">৳{completedOrder.amount.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                )}

                {/* Action Button: WhatsApp */}
                {completedOrder && (
                  <div className="pt-2 space-y-2">
                    <a
                      href={getOrderWhatsAppLink(completedOrder)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>হোয়াটসঅ্যাপে টিমকে জানান</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setOrderModalOpen(false)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Lightbox Modal (Matching DigitalProductDetailModal!) */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer z-20 transition"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox Prev & Next Buttons */}
          {serviceMediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : serviceMediaList.length - 1));
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 rounded-full cursor-pointer z-20 backdrop-blur-xs transition active:scale-95 shadow-lg"
                title="পূর্ববর্তী ছবি"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev < serviceMediaList.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 rounded-full cursor-pointer z-20 backdrop-blur-xs transition active:scale-95 shadow-lg"
                title="পরবর্তী ছবি"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          <img
            src={serviceMediaList[lightboxIndex] || service.thumbnail}
            alt="Fullscreen"
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl transition-all duration-200"
            onClick={e => e.stopPropagation()}
          />

          {/* Image index counter in Lightbox */}
          {serviceMediaList.length > 1 && (
            <div className="absolute bottom-4 text-xs font-semibold text-white/80 bg-black/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full pointer-events-none">
              {lightboxIndex + 1} / {serviceMediaList.length}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
