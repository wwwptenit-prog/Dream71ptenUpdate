import React, { useState } from 'react';
import {
  Download,
  Mail,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  ExternalLink,
  FileText,
  ShoppingBag,
  Star,
  ArrowRight,
  ArrowLeft,
  Package,
  Code2,
  Send,
  Gift,
  Cpu,
  Award,
  Share2,
  MessageSquare,
  HelpCircle,
  Clock,
  Lock,
  Unlock,
  RefreshCw,
  Crown,
  Key,
  AlertTriangle,
  CheckCircle2,
  Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DigitalProduct, MarketplaceOrder } from '../types';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface DigitalProductsSectionProps {
  setActiveTab?: (tab: string, category?: string, pushHistory?: boolean) => void;
  isStandalonePage?: boolean;
  onBack?: () => void;
}

export const DigitalProductsSection: React.FC<DigitalProductsSectionProps> = ({ setActiveTab, isStandalonePage = false, onBack }) => {
  const { digitalProducts = [], currentUser, siteSettings, addMarketplaceOrder, updateMarketplaceOrder, marketplaceOrders = [], t, openChatWindow } = useData();

  // Helper to keep product titles compact, concise and clean
  const cleanShortTitle = (title: string) => {
    return title
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\s*ও অ্যাসিস্ট্যান্ট/g, '')
      .trim();
  };

  // Selected Product for Dedicated In-Page Landing View (Not a modal popup)
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // In-Page Checkout / Download Form State
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.mobile || '');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  // Confirmation & Instant Download State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  };

  const safeCopyText = (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          fallbackCopyText(text);
        });
      } else {
        fallbackCopyText(text);
      }
    } catch {
      fallbackCopyText(text);
    }
  };

  const handleCopyNumber = (num: string) => {
    safeCopyText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const getWhatsAppLink = (product: DigitalProduct) => {
    const rawNum = siteSettings?.whatsapp || '+8801700000000';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    const priceText = product.price === 0 ? 'বিনামূল্যে (১০০% ফ্রি)' : `৳${product.price.toLocaleString('bn-BD')}`;
    const msg = `হ্যালো, আমি "${product.title}" ডিজিটাল প্রোডাক্টটি নিতে চাই।\nমূল্য: ${priceText}\nদয়া করে আমাকে হোয়াটসঅ্যাপ বা ইমেইলে এক্সেস ও সরাসরি ডাউনলোড লিঙ্ক দেওয়ার নিয়ম জানান।`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  const getOrderWhatsAppLink = (order: MarketplaceOrder) => {
    const rawNum = siteSettings?.whatsapp || '+8801700000000';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    const msg = `হ্যালো, আমি "${order.title}" ডিজিটাল প্রোডাক্টটির জন্য অর্ডার সম্পন্ন করেছি।\nঅর্ডার আইডি: ${order.id}\nআমার ইমেইল: ${customerEmail}\nদয়া করে আমার ইমেইল ও হোয়াটসঅ্যাপে ফাইল এক্সেস দিন।`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  };

  const handleOpenDetail = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setCustomerEmail(currentUser?.email || '');
    setCustomerName(currentUser?.name || '');
    setCustomerPhone(currentUser?.mobile || '');
    setTrxId('');
    setSenderPhone('');
    setPurchaseError(null);
    setIsOrderPlaced(false);
    setCompletedOrder(null);
    // Instant scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setPurchaseError(null);
    setIsOrderPlaced(false);
    setCompletedOrder(null);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseError(null);
    if (!selectedProduct) return;

    const isFree = selectedProduct.price === 0;
    if (!customerName.trim() || !customerEmail.trim()) {
      setPurchaseError('অনুগ্রহ করে আপনার নাম ও ইমেইল অ্যাড্রেস প্রদান করুন।');
      return;
    }

    if (!customerPhone.trim()) {
      setPurchaseError('অনুগ্রহ করে আপনার সচল হোয়াটসঅ্যাপ নম্বর প্রদান করুন।');
      return;
    }

    if (!isFree && !trxId.trim()) {
      setPurchaseError('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const rawDeliveryType = selectedProduct.deliveryType || 'file_download';
    const isCanva = rawDeliveryType === 'canva_auto';
    const isEmailWhatsApp = rawDeliveryType === 'email_whatsapp' || rawDeliveryType === 'manual';
    const isFileDownload = rawDeliveryType === 'file_download' || rawDeliveryType === 'auto';

    const orderId = isFree 
      ? `FREE-DL-${Math.floor(100000 + Math.random() * 900000)}` 
      : `DIGI-INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const generatedToken = `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const effectiveCanvaLink = selectedProduct.canvaInviteLink || selectedProduct.downloadUrl || 'https://www.canva.com';

    const newOrder: MarketplaceOrder = {
      id: orderId,
      type: 'digital_product_order',
      digitalProductId: selectedProduct.id,
      deliveryType: rawDeliveryType,
      title: selectedProduct.title,
      category: selectedProduct.category,
      buyerId: currentUser?.id || `buyer-${Date.now()}`,
      buyerName: customerName.trim(),
      buyerEmail: customerEmail.trim(),
      buyerPhone: customerPhone.trim(),
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit IT Digital Store',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isInternalStaff: true,
      amount: selectedProduct.price,
      adminCommission: 0,
      sellerPayout: selectedProduct.price,
      paymentMethod: isFree ? 'Free Instant Download' : `${paymentMethod} (TrxID: ${trxId})`,
      transactionId: isFree ? 'FREE_PROMO' : trxId,
      paymentStatus: isFree ? 'verified' : (isCanva ? 'verified' : 'pending'),
      deliveryStatus: isFree ? 'delivered' : (isCanva ? 'delivered' : 'pending'),
      accessUsed: false,
      canvaInviteLink: effectiveCanvaLink,
      downloadToken: generatedToken,
      status: (isFree || isCanva) ? 'completed' : 'pending',
      deliveryNote: isFree 
        ? `বিনামূল্যে ইনস্ট্যান্ট ডাউনলোড সম্পন্ন! ডাউনলোড লিঙ্ক: ${selectedProduct.downloadUrl}`
        : (isCanva
          ? `অটো ক্যানভা এক্সেস প্রস্তুত! ক্যানভা লিঙ্ক: ${effectiveCanvaLink}`
          : isFileDownload
          ? `পেমেন্ট ভেরিফিকেশন সাপেক্ষে সিকিউর ফাইল ডাউনলোড আনলক হবে (টোকেন: ${generatedToken})`
          : 'এডমিন প্যানেল থেকে হোয়াটসঅ্যাপ ও ইমেইলে কাস্টম মেসেজ সহ এক্সেস প্রদান করা হবে।'),
      downloadUrl: selectedProduct.downloadUrl,
      licenseKey: selectedProduct.licenseKey,
      deliveryFileUrl: selectedProduct.downloadUrl,
      deliveryFileName: `${selectedProduct.title}.zip`,
      accessGranted: isFree || isCanva,
      accessGrantedAt: (isFree || isCanva) ? new Date().toLocaleString('en-BD') : undefined,
      accessDeliveryMethod: isFree ? 'direct_download' : (isCanva ? 'both' : undefined),
      customFileUrl: selectedProduct.downloadUrl,
      customFileName: `${selectedProduct.title}.zip`,
      deliveredAt: (isFree || isCanva) ? new Date().toLocaleString('en-BD') : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date().toISOString().split('T')[0]
    };

    addMarketplaceOrder(newOrder);
    setCompletedOrder(newOrder);
    setIsOrderPlaced(true);
  };

  // Single-use Canva Access Button Handler
  const handleCanvaAccessNow = () => {
    if (!completedOrder) return;
    if (completedOrder.accessUsed) {
      alert('সতর্কতা: এই ক্যানভা এক্সেস লিঙ্কটি ইতোমধ্যে ১ বার ব্যবহার করা হয়েছে। এটি আর ব্যবহারযোগ্য নয়।');
      return;
    }

    const targetLink = completedOrder.canvaInviteLink || selectedProduct?.canvaInviteLink || selectedProduct?.downloadUrl || 'https://www.canva.com';
    const usedTimestamp = new Date().toLocaleString('en-BD');

    // Update Context and Local Storage
    updateMarketplaceOrder(completedOrder.id, {
      accessUsed: true,
      accessUsedAt: usedTimestamp,
      status: 'completed',
      deliveryStatus: 'delivered',
      deliveryNote: `গ্রাহক ওয়েবসাইট থেকে ১-বার ব্যবহারযোগ্য ক্যানভা ইনভাইট এক্সেস গ্রহণ করেছেন (${new Date().toLocaleTimeString('en-BD')})`
    });

    // Update local state immediately so button flips to "Access Locked"
    setCompletedOrder(prev => prev ? {
      ...prev,
      accessUsed: true,
      accessUsedAt: usedTimestamp,
      status: 'completed',
      deliveryStatus: 'delivered'
    } : null);

    // Open Canva invite link in new window
    window.open(targetLink, '_blank');
  };

  // Status refresh for file download verification
  const handleRefreshOrderStatus = () => {
    if (!completedOrder) return;
    const latest = marketplaceOrders.find(o => o.id === completedOrder.id);
    if (latest) {
      setCompletedOrder(latest);
    }
  };

  const copyLicenseKey = (keyText: string) => {
    safeCopyText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const copyShareLink = () => {
    safeCopyText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  // =========================================================================
  // 🌟 DEDICATED STANDALONE FULL LANDING PAGE VIEW (Dedicated Fullscreen Takeover)
  // =========================================================================
  if (selectedProduct) {
    const isFree = selectedProduct.price === 0;

    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto min-h-screen font-bengali p-3 sm:p-6 md:p-8 animate-fadeIn">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Top Sticky Navigation Bar */}
          <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1DB954] text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('ফিরে যান', 'Go Back')}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex px-3 py-1 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 rounded-full text-xs font-bold items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                {selectedProduct.category}
              </span>
              <button
                type="button"
                onClick={copyShareLink}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="লিঙ্ক কপি করুন"
              >
                {copiedShareLink ? <Check className="w-4 h-4 text-[#1DB954]" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden md:inline">{copiedShareLink ? 'কপি হয়েছে' : 'শেয়ার'}</span>
              </button>
            </div>
          </div>

        {/* Shortcut Landing Page Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* Left Column: Product Showcase & Details */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Product Card & Preview */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
              {/* Clean Preview Image */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={selectedProduct.thumbnail}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                    {selectedProduct.category}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-xs font-black px-3 py-1 rounded-full shadow-md ${
                    isFree 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-[#1DB954] text-white'
                  }`}>
                    {isFree ? 'সম্পূর্ণ ফ্রি' : `৳${selectedProduct.price.toLocaleString('bn-BD')}`}
                  </span>
                </div>
              </div>

              {/* Title & Compact Meta */}
              <div className="space-y-1.5">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {cleanShortTitle(selectedProduct.title)}
                </h1>

                {/* Compact Meta Row */}
                <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{selectedProduct.rating || 5.0}</span>
                    <span className="text-slate-400 font-normal">({selectedProduct.reviewsCount || 42})</span>
                  </span>
                  <span>·</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-300">
                    {selectedProduct.salesCount || 100}+ ডাউনলোড
                  </span>
                  <span>·</span>
                  <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-300">
                    {selectedProduct.fileSize} · {selectedProduct.fileFormat}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1DB954]" />
                বিবরণ
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedProduct.fullDescription || selectedProduct.shortDescription}
              </div>
            </div>

            {/* Key Features (Clean compact list) */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  সুবিধাসমূহ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Short Security Trust Badge */}
            <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#1DB954] shrink-0" />
              <span>১০০% ভাইরাস ও ম্যালওয়্যার মুক্ত নিরাপদ ড্রাইভ ফাইল</span>
            </div>

          </div>

          {/* Right Column: Integrated Order & Instant Download Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-3.5 lg:sticky lg:top-4">
            
            {/* Box Header - Short & Concise */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isFree ? 'ফ্রি ডাউনলোড' : 'ইনস্ট্যান্ট এক্সেস'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isFree 
                    ? 'তথ্য দিন ও সরাসরি ডাউনলোড লিংক পান' 
                    : 'পেমেন্ট সম্পন্ন করে ফাইল এক্সেস আনলক করুন'}
                </p>
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
                isFree 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20'
              }`}>
                {isFree ? 'সম্পূর্ণ ফ্রি' : `৳${selectedProduct.price.toLocaleString('bn-BD')}`}
              </span>
            </div>

            {!isOrderPlaced ? (
              /* IN-PAGE FORM */
              <form onSubmit={handleConfirmPurchase} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল অ্যাড্রেস *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    হোয়াটসঅ্যাপ নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                  />
                </div>

                {/* Paid Flow Payment Options */}
                {!isFree && (
                  <div className="space-y-2.5 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        পেমেন্ট মেথড *
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map(method => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`py-1.5 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                              paymentMethod === method
                                ? 'border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954] ring-2 ring-[#1DB954]/20'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {method === 'bKash' ? 'বিকাশ' : method === 'Nagad' ? 'নগদ' : method === 'Rocket' ? 'রকেট' : 'ব্যাংক'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Account Number Box */}
                    {(() => {
                      const activeAccNum = paymentMethod === 'bKash' 
                        ? (siteSettings.bkashNumber || '01712345678') 
                        : paymentMethod === 'Nagad' 
                        ? (siteSettings.nagadNumber || '01700000000') 
                        : paymentMethod === 'Rocket' 
                        ? (siteSettings.rocketNumber || '01900000000') 
                        : (siteSettings.bankAccountNumber || '2181100098765');

                      return (
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-slate-600 dark:text-slate-300 block text-[10px]">
                              {paymentMethod === 'bKash' ? 'বিকাশ নম্বর' : paymentMethod === 'Nagad' ? 'নগদ নম্বর' : paymentMethod === 'Rocket' ? 'রকেট নম্বর' : 'ব্যাংক হিসাব নম্বর'}
                            </span>
                            <div className="font-mono font-black text-slate-900 dark:text-white text-sm tracking-wider">
                              {activeAccNum}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyNumber(activeAccNum)}
                            className="px-2.5 py-1 rounded-lg bg-[#1DB954] hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95 shrink-0"
                          >
                            {copiedNumber ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি'}</span>
                          </button>
                        </div>
                      );
                    })()}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                          প্রেরক নম্বর
                        </label>
                        <input
                          type="text"
                          value={senderPhone}
                          onChange={e => setSenderPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                          TrxID *
                        </label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          placeholder="e.g. 9X2A88K1"
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {purchaseError && (
                  <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>{purchaseError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-95 mt-2"
                >
                  {isFree ? (
                    <>
                      <Download className="w-4 h-4" />
                      <span>ডাউনলোড করুন</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>অর্ডার করুন</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ========================================================================= */
              /* 🌟 ORDER SUCCESS & MULTI-SYSTEM DELIVERY COMPLETION SCREEN               */
              /* ========================================================================= */
              <div className="space-y-4 animate-fadeIn">
                
                {/* 1. AUTO CANVA ACCESS FLOW */}
                {((completedOrder?.deliveryType === 'canva_auto') || (selectedProduct.deliveryType === 'canva_auto')) && (
                  <div className="space-y-4">
                    {/* Header Banner */}
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

                    {/* Canva Official Rules Card */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-black text-xs sm:text-sm border-b border-slate-800 pb-2">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>📜 ক্যানভা ব্যবহারের অফিশিয়াল নিয়মাবলী (Access Rules)</span>
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
                            <strong>⚠️ সতর্কতা:</strong> নিচের <strong>"Access Now"</strong> বোতামটি এই ওয়েবসাইট থেকে <strong>শুধুমাত্র ১ বারই ব্যবহারযোগ্য</strong>! একবার ক্লিক করার সাথে সাথে লিংকটি স্বয়ংক্রিয়ভাবে লক হয়ে যাবে এবং দ্বিতীয়বার <strong>"Access Locked"</strong> দেখাবে।
                          </span>
                        </div>
                        {selectedProduct.canvaRules && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-line">
                            {selectedProduct.canvaRules}
                          </div>
                        )}
                      </div>

                      {/* Canva Single-Use Action Button / Locked State */}
                      <div className="pt-2">
                        {!completedOrder?.accessUsed ? (
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={handleCanvaAccessNow}
                              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1DB954] via-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95 group"
                            >
                              <Crown className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
                              <span>Access Now (ক্যানভা এক্সেস নিন)</span>
                              <ExternalLink className="w-4 h-4 text-white/90" />
                            </button>
                            <p className="text-[11px] text-amber-400/90 font-medium text-center">
                              ⚠️ দ্রষ্টব্য: এটি ১-বার ক্লিকযোগ্য বাটন। ক্লিক করার সাথে সাথেই লিংকটি লক হয়ে যাবে।
                            </p>
                          </div>
                        ) : (
                          /* Access Locked Banner */
                          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-center space-y-2.5">
                            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                              <Lock className="w-5 h-5" />
                            </div>
                            <h5 className="text-sm sm:text-base font-black text-rose-400">
                              🔒 Access Locked (এক্সেস লক করা হয়েছে)
                            </h5>
                            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                              এই ক্যানভা এক্সেস লিঙ্কটি ইতোমধ্যে <strong>১ বার ব্যবহার করা হয়েছে</strong> ({completedOrder.accessUsedAt || 'ব্যবহৃত'})। ওয়েবসাইটের নিরাপত্তা নীতি অনুসারে লিঙ্কটি এখন লক করা হয়েছে।
                            </p>
                            <button
                              type="button"
                              disabled
                              className="w-full py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
                            >
                              <Lock className="w-4 h-4" />
                              <span>Access Locked (পুনরায় ব্যবহার সম্ভব নয়)</span>
                            </button>
                            <div className="p-2 bg-slate-950/80 rounded-lg text-[11px] text-slate-400 text-left flex items-start gap-1.5">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>যদি আপনি লিংকটি সংরক্ষণ করতে না পারেন অথবা টেকনিক্যাল সমস্যায় পড়েন, এডমিনের সাথে যোগাযোগ করে সহায়তা নিতে পারেন।</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. INFORMATION → SECURE FILE DOWNLOAD FLOW */}
                {((completedOrder?.deliveryType === 'file_download' || completedOrder?.deliveryType === 'auto') && (completedOrder?.deliveryType !== 'canva_auto') && (selectedProduct.deliveryType !== 'canva_auto')) && (
                  <div className="space-y-4">
                    {/* Header Banner */}
                    <div className="p-4 bg-emerald-500/10 border border-[#1DB954]/30 rounded-2xl text-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {isFree ? '🎉 ফ্রি ফাইল ডাউনলোড প্রস্তুত!' : '🎉 অর্ডার গ্রহণ করা হয়েছে!'}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ইনভয়েস নং: <span className="font-mono font-bold text-[#1DB954]">#{completedOrder?.id}</span>
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-[11px] font-bold mt-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>📁 সিকিউর ফাইল ডাউনলোড সিস্টেম (Information → File Download)</span>
                      </div>
                    </div>

                    {/* Customer Information Summary */}
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">গ্রাহকের সংরক্ষিত তথ্য</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                        <div>নাম: <span className="font-normal text-slate-600 dark:text-slate-400">{completedOrder?.buyerName}</span></div>
                        <div>হোয়াটসঅ্যাপ: <span className="font-mono font-normal text-slate-600 dark:text-slate-400">{completedOrder?.buyerPhone}</span></div>
                        <div className="col-span-2 truncate">ইমেইল: <span className="font-mono font-normal text-slate-600 dark:text-slate-400">{completedOrder?.buyerEmail}</span></div>
                      </div>
                    </div>

                    {/* Secure Token Box */}
                    <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-white">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 block font-bold">সিকিউর ডাউনলোড টোকেন:</span>
                        <code className="font-mono font-bold text-[#1DB954] text-xs sm:text-sm">
                          {completedOrder?.downloadToken || `SEC-${completedOrder?.id.slice(-6)}`}
                        </code>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                        {completedOrder?.paymentStatus === 'verified' || isFree || completedOrder?.accessGranted ? '✅ ভেরিফাইড' : '⏳ ভেরিফিকেশন চলমান'}
                      </span>
                    </div>

                    {/* Download Unlocked or Pending Verification Box */}
                    {(isFree || completedOrder?.paymentStatus === 'verified' || completedOrder?.accessGranted) ? (
                      <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1DB954] flex items-center gap-1">
                            <Zap className="w-4 h-4 fill-[#1DB954]" />
                            ডাউনলোড ফাইল প্রস্তুত
                          </span>
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            {selectedProduct.fileFormat} ({selectedProduct.fileSize})
                          </span>
                        </div>

                        <a
                          href={completedOrder?.customFileUrl || selectedProduct.downloadUrl || 'https://drive.google.com'}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 text-center"
                        >
                          <Download className="w-4 h-4" />
                          <span>📥 সুরক্ষিত ফাইল ডাউনলোড করুন (Secure Download)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {selectedProduct.licenseKey && (
                          <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-[10px] text-slate-400 block font-bold">লাইসেন্স / সিরিয়াল কি:</span>
                            <div className="flex items-center justify-between gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                              <code className="text-xs font-mono font-bold text-amber-400 truncate">
                                {selectedProduct.licenseKey}
                              </code>
                              <button
                                type="button"
                                onClick={() => copyLicenseKey(selectedProduct.licenseKey || '')}
                                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                                title="কি কপি করুন"
                              >
                                {copiedKey ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Payment Verification Pending */
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left space-y-3">
                        <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-bold text-sm">
                          <Clock className="w-4 h-4 animate-spin shrink-0" />
                          <span>পেমেন্ট ভেরিফিকেশন চলছে...</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          আপনার পেমেন্ট ট্রানজেকশন আইডি (<strong className="font-mono text-slate-900 dark:text-white">{completedOrder?.transactionId}</strong>) এডমিন প্যানেল থেকে যাচাই করা হচ্ছে। ভেরিফাই সম্পন্ন হওয়ার সাথে সাথেই এই পেজে সিকিউর ফাইল ডাউনলোড লিংক দৃশ্যমান হবে।
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleRefreshOrderStatus}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>ভেরিফিকেশন স্ট্যাটাস রিফ্রেশ করুন</span>
                          </button>

                          {completedOrder && (
                            <a
                              href={getOrderWhatsAppLink(completedOrder)}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>হোয়াটসঅ্যাপে এডমিনকে জানান</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. EMAIL + WHATSAPP DELIVERY FLOW */}
                {((completedOrder?.deliveryType === 'email_whatsapp' || completedOrder?.deliveryType === 'manual') && (completedOrder?.deliveryType !== 'canva_auto') && (selectedProduct.deliveryType !== 'canva_auto')) && (
                  <div className="space-y-4">
                    {/* Header Banner */}
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-center space-y-1.5">
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        ✅ আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ইনভয়েস আইডি: <span className="font-mono font-bold text-purple-600 dark:text-purple-400">#{completedOrder?.id}</span>
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] font-bold mt-1">
                        <Send className="w-3.5 h-3.5" />
                        <span>✉️ Email + WhatsApp Delivery সিস্টেম</span>
                      </div>
                    </div>

                    {/* Dispatch Notice Card */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800 pb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>এডমিন প্যানেল থেকে কাস্টম মেসেজ সহ ডেলিভারি পাঠানো হবে</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        আপনার অর্ডারটি আমাদের এডমিন প্যানেলে জমা হয়েছে। এডমিন আপনার দেওয়া হোয়াটসঅ্যাপ নম্বর (<strong className="text-white font-mono">{completedOrder?.buyerPhone}</strong>) এবং ইমেইলে (<strong className="text-white font-mono">{completedOrder?.buyerEmail}</strong>) কাস্টমাইজড মেসেজ ও প্রয়োজনীয় এক্সেস / ইনভাইট লিঙ্ক খুব শীঘ্রই সেন্ড করবেন।
                      </p>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                        <div className="flex justify-between">
                          <span>প্রোডাক্ট:</span>
                          <strong className="text-white">{completedOrder?.title}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>পেমেন্ট মেথড:</span>
                          <span className="text-slate-300">{completedOrder?.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ডেলিভারি স্ট্যাটাস:</span>
                          <span className="text-amber-400 font-bold">
                            {completedOrder?.deliveryStatus === 'delivered' ? '✅ পাঠানো হয়েছে' : '⏳ প্রসেসিং চলমান'}
                          </span>
                        </div>
                      </div>

                      {completedOrder && (
                        <div className="pt-1">
                          <a
                            href={getOrderWhatsAppLink(completedOrder)}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition text-center"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                            <span>হোয়াটসঅ্যাপে সরাসরি মেসেজ দিন (দ্রুত এক্সেস পেতে)</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Go to Buyer Dashboard & Return */}
                <div className="flex flex-col gap-2 pt-2">
                  {setActiveTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('marketplace', 'buying');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>বায়ার ড্যাশবোর্ডে ফাইল ও অর্ডার দেখুন →</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    সব ডিজিটাল প্রোডাক্টে ফিরে যান
                  </button>
                </div>
              </div>
            )}

            {/* Need Help Helpline / Website Live Message Box */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  if (openChatWindow) {
                    openChatWindow({
                      id: 'ptenit-helpline',
                      senderName: 'PTENit হেল্পলাইন ও কাস্টমার কেয়ার',
                      senderRole: 'অফিশিয়াল সাপোর্ট টিম',
                      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                      initialMessage: `আসসালামু আলাইকুম! আমি "${cleanShortTitle(selectedProduct.title)}" ডিজিটাল প্রোডাক্ট বিষয়ে হেল্পলাইন সাপোর্ট চাচ্ছি।`
                    });
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>হেল্পলাইন — ওয়েবসাইটে মেসেজ দিন</span>
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Back Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1DB954] text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-extrabold text-xs sm:text-sm transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('ফিরে যান', 'Go Back')}</span>
          </button>
        </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 🛍️ FILTERING & DISPLAYED PRODUCTS
  // =========================================================================
  const filteredProducts = digitalProducts.filter(product => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matches = 
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(q));
      if (!matches) return false;
    }

    if (selectedCategory === 'free') {
      return product.price === 0;
    }
    if (selectedCategory === 'premium') {
      return product.price > 0;
    }
    return true;
  });

  const displayedProducts = isStandalonePage 
    ? filteredProducts 
    : digitalProducts.slice(0, 4);

  // =========================================================================
  // 🛍️ DEFAULT PRODUCT GRID VIEW (Unified Responsive Cards)
  // =========================================================================
  const sectionContent = (
    <div className="space-y-4 sm:space-y-6 font-bengali">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {t('ডিজিটাল প্রোডাক্টস', 'Digital Products')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bengali">
            {t('রেডিমেড সফটওয়্যার, সোর্স কোড ও স্ক্রিপ্ট', 'Ready software, source code & scripts')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isStandalonePage && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
              <span>{t('ফিরে যান', 'Back')}</span>
            </button>
          )}

          {!isStandalonePage && setActiveTab && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('digital-products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-600 font-bold text-xs sm:text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
            >
              <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Standalone Page: Search & Category Filter Pills */}
      {isStandalonePage && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          {/* Category Filter Pills - Just 3: সকল, প্রিমিয়াম, ফ্রি */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'সকল' },
              { id: 'premium', label: 'প্রিমিয়াম' },
              { id: 'free', label: 'ফ্রি' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-[#1DB954] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="প্রোডাক্ট বা টেমপ্লেট খুঁজুন..."
              className="w-full pl-9 pr-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1DB954]"
            />
          </div>
        </div>
      )}

      {/* Grid: 4 columns on desktop, 2 columns on mobile */}
      <div>
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Package className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
              কোনো ডিজিটাল প্রোডাক্ট খুঁজে পাওয়া যায়নি।
            </p>
            <button
              type="button"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#1DB954] text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition cursor-pointer"
            >
              সবগুলো দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {displayedProducts.map(product => {
              const isFree = product.price === 0;

              return (
                <div
                  key={product.id}
                  className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:shadow-[#1DB954]/5 hover:-translate-y-1.5 hover:border-[#1DB954]/70 dark:hover:border-[#1DB954]/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Clean Cover Thumbnail without distracting text overlays */}
                    <div
                      onClick={() => handleOpenDetail(product)}
                      className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-2.5 sm:p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      {/* Product Title & Name - Harmonized text size */}
                      <div>
                        <h3
                          onClick={() => handleOpenDetail(product)}
                          className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors cursor-pointer min-h-[2.25rem] sm:min-h-[2.5rem]"
                          title={product.title}
                        >
                          {product.title}
                        </h3>
                      </div>

                      {/* Rating & Sales Micro Info */}
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                          <span>{product.rating || 5.0}</span>
                          <span className="text-slate-400 font-normal">({product.reviewsCount || 45})</span>
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-[9px] sm:text-[11px]">
                          <Download className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{product.salesCount || 100}+ সেলস</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Harmonized Price & Action Button */}
                  <div className="p-2.5 sm:p-3.5 bg-slate-50/90 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 rounded-b-2xl">
                    <div className="min-w-0">
                      {isFree ? (
                        <div>
                          <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block leading-none mb-1 uppercase tracking-wider">
                            মূল্য
                          </span>
                          <span className="text-sm sm:text-base md:text-lg font-black text-emerald-600 dark:text-emerald-400 block truncate leading-none">
                            সম্পূর্ণ ফ্রি
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block leading-none mb-1 uppercase tracking-wider">
                            মূল্য
                          </span>
                          <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                            ৳{product.price.toLocaleString('bn-BD')}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenDetail(product)}
                      className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-[11px] sm:text-xs shadow-xs flex items-center gap-1 sm:gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer shrink-0 bg-[#1DB954] hover:bg-emerald-600 text-white"
                    >
                      <span>বিস্তারিত</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (isStandalonePage) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 font-bengali text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {sectionContent}
        </div>
      </div>
    );
  }

  return sectionContent;
};
