import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Download,
  Package,
  Clock,
  CheckCircle2,
  Award,
  FileText,
  HelpCircle,
  Lock,
  ShieldCheck,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Share2,
  Gift,
  Facebook,
  Mail,
  Crown,
  AlertTriangle,
  Maximize2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  Globe
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DigitalProduct, MarketplaceOrder } from '../types';
import { SinglePromoBadgeView } from '../utils/badgeHelper';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface DigitalProductDetailModalProps {
  product: DigitalProduct;
  onClose: () => void;
}

export const DigitalProductDetailModal: React.FC<DigitalProductDetailModalProps> = ({
  product,
  onClose
}) => {
  const { currentUser, siteSettings, addMarketplaceOrder, updateMarketplaceOrder, updateDigitalProduct, marketplaceOrders = [], t } = useData();

  const isFree = product.price === 0;

  // Tabs ('overview' | 'demo') - Specs removed as requested
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview');
  
  // Checkout Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Customer Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.mobile || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Order Placement & Delivery State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedDemoLink, setCopiedDemoLink] = useState(false);

  // Admin In-Modal Live Demo & Gallery Management State
  const [adminDemoUrl, setAdminDemoUrl] = useState(product.demoUrl || '');
  const [isEditingAdminDemo, setIsEditingAdminDemo] = useState(false);
  const [saveDemoSuccess, setSaveDemoSuccess] = useState(false);
  const [newGalleryImgUrl, setNewGalleryImgUrl] = useState('');

  // Media Gallery & Demo State
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const productMediaList: string[] = Array.from(new Set([
    product.thumbnail,
    ...(product.demoImages || []),
    ...(product.galleryImages || [])
  ].filter(Boolean)));

  // Lightbox key controls
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : productMediaList.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < productMediaList.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, productMediaList.length]);

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

  const copyLicenseKey = (keyText: string) => {
    copyText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  // Step 1: Proceed to Payment or Confirm Free Download
  const handleProceedToPaymentStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPurchaseError(null);

    if (!customerName.trim()) {
      setPurchaseError('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!customerPhone.trim()) {
      setPurchaseError('অনুগ্রহ করে আপনার সচল মোবাইল / হোয়াটসঅ্যাপ নম্বর দিন।');
      return;
    }

    const bdPhoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
    const cleanPhone = customerPhone.replace(/[\s-]/g, '');
    if (!bdPhoneRegex.test(cleanPhone)) {
      setPurchaseError('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)');
      return;
    }

    if (!customerEmail.trim()) {
      setPurchaseError('অনুগ্রহ করে আপনার ইমেইল অ্যাড্রেস প্রদান করুন।');
      return;
    }

    if (isFree) {
      handleConfirmPurchase();
    } else {
      setCheckoutStep(2);
    }
  };

  // Step 2: Finalize Purchase & Delivery
  const handleConfirmPurchase = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPurchaseError(null);

    if (!isFree && !trxId.trim()) {
      setPurchaseError('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const rawDeliveryType = product.deliveryType || 'file_download';
    const isCanva = rawDeliveryType === 'canva_auto';
    const isFileDownload = rawDeliveryType === 'file_download' || rawDeliveryType === 'auto';

    const orderId = isFree 
      ? `FREE-DL-${Math.floor(100000 + Math.random() * 900000)}` 
      : `DIGI-INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const generatedToken = `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCanvaLink = product.canvaInviteLink || product.downloadUrl || 'https://www.canva.com';

    const newOrder: MarketplaceOrder = {
      id: orderId,
      type: 'digital_product_order',
      digitalProductId: product.id,
      deliveryType: rawDeliveryType,
      title: product.title,
      category: product.category,
      buyerId: currentUser?.id || `buyer-${Date.now()}`,
      buyerName: customerName.trim(),
      buyerEmail: customerEmail.trim(),
      buyerPhone: customerPhone.trim(),
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit IT Digital Store',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isInternalStaff: true,
      amount: product.price,
      adminCommission: 0,
      sellerPayout: product.price,
      paymentMethod: isFree ? 'Free Instant Download' : `${paymentMethod} (TrxID: ${trxId})`,
      transactionId: isFree ? 'FREE_PROMO' : trxId,
      paymentStatus: isFree ? 'verified' : (isCanva ? 'verified' : 'pending'),
      deliveryStatus: isFree ? 'delivered' : (isCanva ? 'delivered' : 'pending'),
      accessUsed: false,
      canvaInviteLink: effectiveCanvaLink,
      downloadToken: generatedToken,
      status: (isFree || isCanva) ? 'completed' : 'pending',
      deliveryNote: isFree 
        ? `বিনামূল্যে ইনস্ট্যান্ট ডাউনলোড সম্পন্ন! ডাউনলোড লিঙ্ক: ${product.downloadUrl}`
        : (isCanva
          ? `অটো ক্যানভা এক্সেস প্রস্তুত! ক্যানভা লিঙ্ক: ${effectiveCanvaLink}`
          : isFileDownload
          ? `পেমেন্ট ভেরিফিকেশন সাপেক্ষে সিকিউর ফাইল ডাউনলোড আনলক হবে (টোকেন: ${generatedToken})`
          : 'এডমিন প্যানেল থেকে হোয়াটসঅ্যাপ ও ইমেইলে কাস্টম মেসেজ সহ এক্সেস প্রদান করা হবে।'),
      downloadUrl: product.downloadUrl,
      licenseKey: product.licenseKey,
      deliveryFileUrl: product.downloadUrl,
      deliveryFileName: `${product.title}.zip`,
      accessGranted: isFree || isCanva,
      accessGrantedAt: (isFree || isCanva) ? new Date().toLocaleString('en-BD') : undefined,
      accessDeliveryMethod: isFree ? 'direct_download' : (isCanva ? 'both' : undefined),
      customFileUrl: product.downloadUrl,
      customFileName: `${product.title}.zip`,
      deliveredAt: (isFree || isCanva) ? new Date().toLocaleString('en-BD') : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date().toISOString().split('T')[0]
    };

    addMarketplaceOrder(newOrder);
    setCompletedOrder(newOrder);
    setIsOrderPlaced(true);
  };

  // Single-use Canva Access Handler
  const handleCanvaAccessNow = () => {
    if (!completedOrder) return;
    if (completedOrder.accessUsed) {
      alert('সতর্কতা: এই ক্যানভা এক্সেস লিঙ্কটি ইতোমধ্যে ১ বার ব্যবহার করা হয়েছে। এটি আর ব্যবহারযোগ্য নয়।');
      return;
    }

    const targetLink = completedOrder.canvaInviteLink || product.canvaInviteLink || product.downloadUrl || 'https://www.canva.com';
    const usedTimestamp = new Date().toLocaleString('en-BD');

    updateMarketplaceOrder(completedOrder.id, {
      accessUsed: true,
      accessUsedAt: usedTimestamp,
      status: 'completed',
      deliveryStatus: 'delivered',
      deliveryNote: `গ্রাহক ওয়েবসাইট থেকে ১-বার ব্যবহারযোগ্য ক্যানভা ইনভাইট এক্সেস গ্রহণ করেছেন (${new Date().toLocaleTimeString('en-BD')})`
    });

    setCompletedOrder(prev => prev ? {
      ...prev,
      accessUsed: true,
      accessUsedAt: usedTimestamp,
      status: 'completed',
      deliveryStatus: 'delivered'
    } : null);

    window.open(targetLink, '_blank');
  };

  const getOrderWhatsAppLink = (order: MarketplaceOrder) => {
    const rawNum = siteSettings?.supportPhone || '8801700000000';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    const msg = `হ্যালো, আমি "${order.title}" ডিজিটাল প্রোডাক্টটির জন্য অর্ডার সম্পন্ন করেছি।\nঅর্ডার আইডি: ${order.id}\nআমার ইমেইল: ${customerEmail}\nদয়া করে আমার ইমেইল ও হোয়াটসঅ্যাপে ফাইল এক্সেস দিন।`;
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
          title: product.title,
          text: `PTENit এর ডিজিটাল প্রোডাক্ট: ${product.title}`,
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
    const text = encodeURIComponent(`${product.title}\n${getShareUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(product.title);
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400');
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
        
        {/* Main Product Content Container (Matching CourseDetailModal!) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs">

          {/* 1. TOP BAR: ব্যাক বাটন | সেন্টারে: প্রিমিয়াম সার্ভিস / সম্পূর্ণ ফ্রি | শেয়ার সোশ্যাল মিডিয়া */}
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

            {/* CENTER: ডিজিটাল প্রোডাক্টে প্রাইজ থাকলে প্রিমিয়াম সার্ভিস, সম্পূর্ণ ফ্রি থাকলে সম্পূর্ণ ফ্রি (কালো আইকন ও টেক্সট) */}
            <div className="flex items-center justify-center min-w-0">
              <SinglePromoBadgeView 
                item={{ id: product.id, title: product.title, price: product.price, offerBadge: (product as any).offerBadge }} 
                itemType="digital_product" 
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

          {/* Product Banner Image - Click to Zoom & Subtle Prev/Next Navigation */}
          <div 
            onClick={() => setLightboxIndex(activeMediaIndex)}
            className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden cursor-zoom-in group select-none"
            title="বড় করে দেখতে ক্লিক করুন"
          >
            <img
              src={productMediaList[activeMediaIndex] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
            />

            {/* Subtle Prev & Next Navigation Buttons on Top Photo */}
            {productMediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : productMediaList.length - 1));
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
                    setActiveMediaIndex((prev) => (prev < productMediaList.length - 1 ? prev + 1 : 0));
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
                <span>{product.rating || 5}</span>
                <span className="text-white/70 font-normal">({product.reviewsCount || 29})</span>
              </span>
              <span className="text-white/40 shrink-0">·</span>
              <span className="font-medium text-white/95 shrink-0">
                {product.salesCount || 88}+ ডাউনলোড
              </span>
              {product.fileSize && (
                <>
                  <span className="text-white/40 shrink-0">·</span>
                  <span className="font-medium text-white/95 shrink-0">
                    {product.fileSize}
                  </span>
                </>
              )}
              <span className="text-white/40 shrink-0">·</span>
              <span className="font-semibold text-emerald-400 shrink-0">
                লাইফটাইম এক্সেস
              </span>
            </div>
          </div>

          {/* Header (Outside/Below the Photo) */}
          <div className="p-3.5 sm:p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
            {/* Title - Full display (না কেটে পুরো টাইটেল দেখাবে), matching font size of 'এই প্রোডাক্টে আপনি যা যা পাবেন:' (text-sm sm:text-base font-bold) */}
            <div className="min-w-0">
              <h1 
                className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white leading-snug break-words" 
                title={product.title}
              >
                {product.title}
              </h1>
            </div>

            {/* Compact Demo Screenshots Strip directly under Title - Click switches top photo WITHOUT zoom */}
            {productMediaList.length > 0 && (
              <div className="pt-1">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {productMediaList.map((imgUrl, idx) => (
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

          {/* Main Body (lg:grid-cols-12 - Matching CourseDetailModal!) */}
          <div className="p-3.5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tabs Header */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold font-bengali overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-[#1DB954] text-[#1DB954]'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  প্রোডাক্ট বিবরণী
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'demo'
                      ? 'border-[#1DB954] text-[#1DB954]'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>ডেমো ও গ্যালারী</span>
                  {productMediaList.length > 0 && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                      {productMediaList.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab 1: Overview Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heading mb-2 text-slate-900 dark:text-white">
                      প্রোডাক্ট বিবরণী
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-bengali whitespace-pre-line">
                      {product.fullDescription || product.shortDescription}
                    </p>
                  </div>

                  {/* What You Will Get */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-bengali flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                      এই প্রোডাক্টে আপনি যা যা পাবেন:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bengali">
                      {(product.features && product.features.length > 0
                        ? product.features
                        : [
                            'রেডিমেড ও সহজে কাস্টমাইজেবল সোর্স ফাইল',
                            'সম্পূর্ণ রেডি-টু-ইউজ ডিজিটাল এসেট',
                            'লাইফটাইম ব্যবহারযোগ্যতা ও ফ্রি আপডেট',
                            'সিকিউর ডাউনলোড ও ইনস্ট্যান্ট এক্সেস লিঙ্ক',
                            'উচ্চমানের প্রফেশনাল ডিজাইন স্ট্যান্ডার্ড'
                          ]
                      ).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements & Instructions */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold font-heading mb-2 text-slate-900 dark:text-white">
                      প্রয়োজনীয় রিকোয়ারমেন্টস ও টেক স্ট্যাক
                    </h3>
                    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bengali space-y-1">
                      {product.deliveryType === 'canva_auto' ? (
                        <>
                          <li>Canva Free অথবা Canva Pro একাউন্ট (লগইন করা থাকতে হবে)</li>
                          <li>ডেস্কটপ অথবা মোবাইল ব্রাউজার দিয়ে সরাসরি এক্সেস করা যাবে</li>
                          <li>১-ক্লিকে টেমপ্লেট আপনার নিজস্ব ক্যানভা ড্যাশবোর্ডে কপি হয়ে যাবে</li>
                        </>
                      ) : (
                        <>
                          <li>ফাইল এক্সট্রাক্ট করার জন্য WinRAR বা 7-Zip (কম্পিউটার বা মোবাইল)</li>
                          <li>প্রয়োজনীয় সফটওয়্যার বা টেক্সট এডিটর (যেমন: VS Code, Adobe ইত্যাদি)</li>
                          <li>ইন্টারনেট সংযোগ (ফাইল ডাউনলোডের জন্য)</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Verified Resource Profile */}
                  <div className="p-3 sm:p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1DB954] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-[13px] font-bengali truncate">
                        ভেরিফাইড রিসোর্স: PTENit IT Digital Store
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 font-bengali truncate">
                        ১০০% সিকিউর ও কোয়ালিটি-টেস্টেড • ইনস্ট্যান্ট অটো এক্সেস সমর্থিত
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Demo & Gallery Tab Content (Replaces Specs & Guide) */}
              {activeTab === 'demo' && (
                <div className="space-y-6">
                  {/* Live Demo Link Card: Only shown if admin provided demoUrl */}
                  {product.demoUrl && product.demoUrl.trim() ? (
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
                          href={product.demoUrl}
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

                  {/* Admin Live Link & Gallery Management Section */}
                  {currentUser?.role === 'admin' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-amber-500" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            এডমিন কন্ট্রোল: লাইভ ডেমো লিংক ও গ্যালারি আপডেট
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          এডমিন শুধুমাত্র
                        </span>
                      </div>

                      {/* Live Demo URL for Admin */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>লাইভ ডেমো ওয়েবসাইট লিংক (URL)</span>
                          {saveDemoSuccess && (
                            <span className="text-emerald-500 text-xs flex items-center gap-1 animate-fadeIn font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> সংরক্ষিত হয়েছে!
                            </span>
                          )}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={adminDemoUrl}
                            onChange={(e) => setAdminDemoUrl(e.target.value)}
                            placeholder="https://example.com/demo"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updateDigitalProduct(product.id, {
                                demoUrl: adminDemoUrl.trim() || undefined
                              });
                              product.demoUrl = adminDemoUrl.trim() || undefined;
                              setSaveDemoSuccess(true);
                              setTimeout(() => setSaveDemoSuccess(false), 2500);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer whitespace-nowrap active:scale-95"
                          >
                            লিংক সেভ করুন
                          </button>
                        </div>
                      </div>

                      {/* Add Gallery Screenshot for Admin */}
                      <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          নতুন ডেমো স্ক্রিনশট ইমেজ URL যুক্ত করুন
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newGalleryImgUrl}
                            onChange={(e) => setNewGalleryImgUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/... বা ছবির লিঙ্ক"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newGalleryImgUrl.trim()) return;
                              const existing = product.demoImages || product.galleryImages || [];
                              const updated = [...existing, newGalleryImgUrl.trim()];
                              updateDigitalProduct(product.id, {
                                demoImages: updated
                              });
                              product.demoImages = updated;
                              setNewGalleryImgUrl('');
                            }}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition cursor-pointer whitespace-nowrap flex items-center gap-1 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>ছবি যুক্ত করুন</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screenshots & Preview Gallery Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white truncate whitespace-nowrap">
                          স্ক্রিনশট গ্যালারী
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-bengali truncate whitespace-nowrap">
                          বড় করে দেখতে ছবিতে ক্লিক করুন
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg shrink-0 whitespace-nowrap">
                        {productMediaList.length}টি ছবি
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {productMediaList.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-zoom-in shadow-xs transition hover:border-[#1DB954]"
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.title} screenshot ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                            <div className="self-end bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                              <Maximize2 className="w-3 h-3" />
                              <span>বড় করে দেখুন</span>
                            </div>
                            <div className="text-white text-xs font-medium truncate">
                              {idx === 0 ? 'মূল কভার ছবি' : `স্ক্রিনশট #${idx}`}
                            </div>
                          </div>
                          {/* Admin delete image button for additional images */}
                          {currentUser?.role === 'admin' && idx > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const existing = (product.demoImages || product.galleryImages || []).filter(
                                  (_, imgIdx) => imgIdx !== (idx - 1)
                                );
                                updateDigitalProduct(product.id, {
                                  demoImages: existing
                                });
                                product.demoImages = existing;
                              }}
                              className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="ছবি ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right Action Sidebar (lg:col-span-4 - Matching CourseDetailModal!) */}
            <div className="lg:col-span-4 block">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700/80 sticky top-4 space-y-5">
                
                {/* Pricing Box (Matching CourseDetailModal!) */}
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    প্রোডাক্ট মূল্য
                  </span>
                  {isFree ? (
                    <div className="text-3xl font-black text-emerald-500 mt-1">
                      সম্পূর্ণ ফ্রি!
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-center gap-3">
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                        ৳{product.price.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Package Perks (Matching Course Package Perks!) */}
                <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300 font-bengali">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-[#1DB954]" />
                    <span>ইনস্ট্যান্ট অটো ডেলিভারি ও এক্সেস</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#1DB954]" />
                    <span>সম্পূর্ণ ফাইল ও রিসোর্স কোড</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#1DB954]" />
                    <span>লাইফটাইম এক্সেস ও ফ্রি আপডেট</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#1DB954]" />
                    <span>১০০% সিকিউর ও ভেরিফাইড ডিজিটাল ফাইল</span>
                  </div>
                </div>

                {/* Primary CTA Order Button - Standardized Gig Style */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalOpen(true);
                    if (!isOrderPlaced) {
                      setCheckoutStep(1);
                    }
                    setPurchaseError(null);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-bold font-bengali text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d]"
                >
                  {isOrderPlaced ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>অর্ডার সম্পন্ন • এক্সেস দেখুন</span>
                    </>
                  ) : isFree ? (
                    <>
                      <Download className="w-5 h-5" />
                      <span>বিনামূল্যে ডাউনলোড করুন</span>
                    </>
                  ) : (
                    <>
                      <span>অর্ডার করুন</span>
                      <span className="opacity-60">•</span>
                      <span className="font-extrabold text-amber-200">
                        ৳{product.price.toLocaleString('bn-BD')}
                      </span>
                    </>
                  )}
                </button>

                {/* Standardized Trust & Guarantee Badges under Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#15803d] shrink-0" />
                    <span>১০-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#15803d] shrink-0" />
                    <span>দ্রুত অনলাইন টেকনিক্যাল সাপোর্ট</span>
                  </p>
                </div>

                {/* Quick Order Success Link if placed */}
                {isOrderPlaced && completedOrder && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-xs space-y-2">
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold block">
                      ✅ অর্ডার #{completedOrder.id} নিশ্চিত হয়েছে
                    </span>
                    {completedOrder.deliveryType === 'canva_auto' ? (
                      <button
                        type="button"
                        onClick={handleCanvaAccessNow}
                        className="w-full py-2 px-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-300" />
                        <span>Canva Access খুলুন</span>
                      </button>
                    ) : (
                      <a
                        href={completedOrder.customFileUrl || product.downloadUrl || 'https://drive.google.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 text-center"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ফাইল ডাউনলোড করুন</span>
                      </a>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 2-Step Enrollment & Payment Checkout Modal (Matching CourseDetailModal!) */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-7 relative shadow-2xl space-y-5 text-slate-900 dark:text-white my-auto animate-in fade-in zoom-in-95 duration-200">
            
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isOrderPlaced ? (
              <>
                {/* Modal Header */}
                <div className="text-center space-y-1 pt-1">
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full inline-block">
                    ডিজিটাল প্রোডাক্ট এক্সেস ও পেমেন্ট
                  </span>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 dark:text-white">
                    {checkoutStep === 1 ? 'ধাপ ১: আপনার যোগাযোগের তথ্য' : 'ধাপ ২: পেমেন্ট মেথড ও কনফার্মেশন'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali truncate max-w-md mx-auto">
                    {product.title} — <span className="font-bold text-[#15803d] dark:text-[#1DB954]">
                      {isFree ? 'সম্পূর্ণ ফ্রি' : `৳${product.price.toLocaleString('bn-BD')}`}
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
                    <span>যোগাযোগের তথ্য</span>
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
                    <span>{isFree ? 'ডাউনলোড এক্সেস' : 'পেমেন্ট ও অর্ডার'}</span>
                  </button>
                </div>

                {/* Error Banner */}
                {purchaseError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bengali flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>{purchaseError}</span>
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
                          if (purchaseError) setPurchaseError(null);
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
                          if (purchaseError) setPurchaseError(null);
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
                          if (purchaseError) setPurchaseError(null);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold font-bengali text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-2"
                    >
                      <span>{isFree ? 'ফ্রি ডাউনলোড এক্সেস নিন' : 'পরবর্তী ধাপ: পেমেন্ট মেথড'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* STEP 2: Payment Form */}
                {checkoutStep === 2 && !isFree && (
                  <form onSubmit={handleConfirmPurchase} className="space-y-4 font-bengali">
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

                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                        ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="যেমন: 9M7A8K6..."
                        value={trxId}
                        onChange={e => {
                          setTrxId(e.target.value);
                          if (purchaseError) setPurchaseError(null);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono focus:outline-none focus:border-[#15803d]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPurchaseError(null);
                          setCheckoutStep(1);
                        }}
                        className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                      >
                        ← পেছনে
                      </button>

                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>অর্ডার সম্পন্ন করুন • ৳{product.price.toLocaleString('bn-BD')}</span>
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              /* ORDER SUCCESS & MULTI-SYSTEM DELIVERY SCREEN */
              <div className="space-y-4 font-bengali">
                
                {/* 1. AUTO CANVA ACCESS FLOW */}
                {((completedOrder?.deliveryType === 'canva_auto') || (product.deliveryType === 'canva_auto')) && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-[#1DB954]/30 rounded-2xl text-center space-y-1.5">
                      <div className="w-11 h-11 rounded-full bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-md">
                        <Crown className="w-6 h-6 text-amber-300" />
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                        🎉 পেমেন্ট সফল হয়েছে! ধন্যবাদ আপনার ক্রয়ের জন্য
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ইনভয়েস নং: <span className="font-mono font-bold text-[#1DB954]">#{completedOrder?.id}</span> • ক্রেতা: <strong className="text-slate-900 dark:text-white">{completedOrder?.buyerName}</strong>
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#1DB954] text-[11px] font-bold mt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>⚡ অটো ক্যানভা এক্সেস সিস্টেম (Auto Canva VIP Access)</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm border-b border-slate-800 pb-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>📜 ক্যানভা ব্যবহারের অফিশিয়াল নিয়মাবলী</span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                        <p className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">১</span>
                          <span>আপনার ব্যক্তিগত Canva একাউন্টে লগইন থাকা অবস্থায় নিচের <strong>"Access Now"</strong> বাটনে ক্লিক করুন।</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">২</span>
                          <span>লিংকে ক্লিক করার সাথে সাথে সরাসরি আপনার ক্যানভা একাউন্টে প্রিমিয়াম ব্র্যান্ড টিম যুক্ত হবে।</span>
                        </p>
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2 text-[11px]">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>⚠️ সতর্কতা:</strong> নিচের <strong>"Access Now"</strong> বোতামটি <strong>শুধুমাত্র ১ বারই ব্যবহারযোগ্য</strong>!
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {!completedOrder?.accessUsed ? (
                          <button
                            type="button"
                            onClick={handleCanvaAccessNow}
                            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1DB954] via-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer active:scale-95"
                          >
                            <Crown className="w-5 h-5 text-amber-300" />
                            <span>Access Now (ক্যানভা এক্সেস নিন)</span>
                            <ExternalLink className="w-4 h-4 text-white/90" />
                          </button>
                        ) : (
                          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                              <Lock className="w-4 h-4" />
                            </div>
                            <h5 className="text-sm font-black text-rose-400">
                              🔒 Access Locked (এক্সেস লক করা হয়েছে)
                            </h5>
                            <p className="text-xs text-slate-300">
                              এই ক্যানভা লিঙ্কটি ইতোমধ্যে ১ বার ব্যবহার করা হয়েছে।
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. FILE DOWNLOAD FLOW */}
                {((completedOrder?.deliveryType === 'file_download' || completedOrder?.deliveryType === 'auto') && (completedOrder?.deliveryType !== 'canva_auto') && (product.deliveryType !== 'canva_auto')) && (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-[#1DB954]/30 rounded-2xl text-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {isFree ? '🎉 ফ্রি ফাইল ডাউনলোড প্রস্তুত!' : '🎉 অর্ডার গ্রহণ করা হয়েছে!'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ইনভয়েস নং: <span className="font-mono font-bold text-[#1DB954]">#{completedOrder?.id}</span>
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#1DB954] flex items-center gap-1">
                          <Zap className="w-4 h-4 fill-[#1DB954]" />
                          ডাউনলোড ফাইল প্রস্তুত
                        </span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {product.fileFormat} ({product.fileSize || 'Standard'})
                        </span>
                      </div>

                      <a
                        href={completedOrder?.customFileUrl || product.downloadUrl || 'https://drive.google.com'}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 text-center"
                      >
                        <Download className="w-4 h-4" />
                        <span>📥 সুরক্ষিত ফাইল ডাউনলোড করুন (Download File)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {product.licenseKey && (
                        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-[10px] text-slate-400 block font-bold">লাইসেন্স / সিরিয়াল কি:</span>
                          <div className="flex items-center justify-between gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                            <code className="text-xs font-mono font-bold text-amber-400 truncate">
                              {product.licenseKey}
                            </code>
                            <button
                              type="button"
                              onClick={() => copyLicenseKey(product.licenseKey || '')}
                              className="text-slate-400 hover:text-white p-1 cursor-pointer"
                              title="কি কপি করুন"
                            >
                              {copiedKey ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. EMAIL / WHATSAPP DELIVERY FLOW */}
                {((completedOrder?.deliveryType === 'email_whatsapp' || completedOrder?.deliveryType === 'manual') && (completedOrder?.deliveryType !== 'canva_auto') && (product.deliveryType !== 'canva_auto')) && (
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        ✅ আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ইনভয়েস আইডি: <span className="font-mono font-bold text-purple-600">#{completedOrder?.id}</span>
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 text-xs">
                      <p className="text-slate-300 leading-relaxed">
                        আপনার অর্ডারটি আমাদের এডমিন প্যানেলে জমা হয়েছে। এডমিন আপনার দেওয়া হোয়াটসঅ্যাপ নম্বর (<strong className="text-white font-mono">{completedOrder?.buyerPhone}</strong>) এবং ইমেইলে লিঙ্ক খুব শীঘ্রই সেন্ড করবেন।
                      </p>

                      {completedOrder && (
                        <a
                          href={getOrderWhatsAppLink(completedOrder)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition text-center"
                        >
                          <WhatsAppIcon className="w-4 h-4" />
                          <span>এডমিনের সাথে হোয়াটসঅ্যাপে চ্যাট করুন</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
                >
                  উইন্ডো বন্ধ করুন
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Lightbox Modal */}
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
          {productMediaList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : productMediaList.length - 1));
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
                  setLightboxIndex((prev) => (prev !== null && prev < productMediaList.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 rounded-full cursor-pointer z-20 backdrop-blur-xs transition active:scale-95 shadow-lg"
                title="পরবর্তী ছবি"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </>
          )}

          <img
            src={productMediaList[lightboxIndex] || product.thumbnail}
            alt="Fullscreen"
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl transition-all duration-200"
            onClick={e => e.stopPropagation()}
          />

          {/* Image index counter in Lightbox */}
          {productMediaList.length > 1 && (
            <div className="absolute bottom-4 text-xs font-semibold text-white/80 bg-black/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full pointer-events-none">
              {lightboxIndex + 1} / {productMediaList.length}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
