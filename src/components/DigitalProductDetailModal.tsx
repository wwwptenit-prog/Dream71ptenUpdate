import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
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
  Mail,
  Crown,
  AlertTriangle,
  Maximize2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DigitalProduct, MarketplaceOrder } from '../types';

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
  const { currentUser, siteSettings, addMarketplaceOrder, updateMarketplaceOrder, marketplaceOrders = [], t } = useData();

  const isFree = product.price === 0;

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'specs'>('overview');
  
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

  // Media Gallery & Demo State
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const productMediaList: string[] = [
    product.thumbnail,
    ...((product.demoImages || product.galleryImages || []).slice(0, 3))
  ].filter(Boolean);

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
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">

          {/* Clean Product Banner Image - No text overlay, ONLY the Back Button */}
          <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden">
            <img
              src={productMediaList[activeMediaIndex] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {/* Back Button directly on top of the photo */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95"
              title={t('ফিরে যান', 'Go Back')}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('ফিরে যান', 'Go Back')}</span>
            </button>

            {/* Quick Fullscreen Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(activeMediaIndex)}
              className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 z-20 p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 text-xs font-bold transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
              title="ছবি বড় করে দেখুন"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline">ছবি বড় করুন</span>
            </button>
          </div>

          {/* 2-Line Header (Outside/Below the Photo): Line 1 Title, Line 2 Rating/Downloads/Size/Lifetime Access */}
          <div className="p-5 sm:p-7 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900">
            {/* Category / Format Badges & Demo/Share Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30 text-xs font-bold">
                  {product.category}
                </span>
                {isFree ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    সম্পূর্ণ ফ্রি
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
                    প্রিমিয়াম ডিজিটাল প্রোডাক্ট
                  </span>
                )}
                {product.fileFormat && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                    {product.fileFormat}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>লাইভ ডেমো ↗</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="শেয়ার লিঙ্ক কপি করুন"
                >
                  {copiedShareLink ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copiedShareLink ? 'কপি হয়েছে' : 'শেয়ার'}</span>
                </button>
              </div>
            </div>

            {/* Line 1: Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-black font-heading text-slate-900 dark:text-white leading-snug">
              {product.title}
            </h1>

            {/* Line 2: Rating, Downloads, Size, Lifetime Access */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-0.5">
              <span className="flex items-center gap-1.5 font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.9} ({product.reviewsCount || 88} রিভিউ)</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Download className="w-4 h-4 text-[#1DB954]" />
                <span>{product.salesCount || 310}+ ডাউনলোড</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Package className="w-4 h-4 text-[#1DB954]" />
                <span>{product.fileSize || '18 MB'}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-[#1DB954]" />
                <span>লাইফটাইম এক্সেস</span>
              </span>
            </div>
          </div>

          {/* Main Body (lg:grid-cols-12 - Matching CourseDetailModal!) */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
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
                  onClick={() => setActiveTab('preview')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'preview'
                      ? 'border-[#1DB954] text-[#1DB954]'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  ডেমো ও স্ক্রিনশট ({productMediaList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`pb-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'border-[#1DB954] text-[#1DB954]'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  স্পেসিফিকেশন ও গাইড
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

                  {/* Verified Resource Profile (Matching Instructor Profile in CourseDetailModal) */}
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

              {/* Tab 2: Gallery Preview Tab Content */}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
                    প্রোডাক্ট স্ক্রিনশট ও ডেমো প্রিভিউ
                  </h3>

                  {/* Preview Main Stage */}
                  <div
                    onClick={() => setLightboxIndex(activeMediaIndex)}
                    className="relative aspect-video sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer border border-slate-200 dark:border-slate-800"
                  >
                    <img
                      src={productMediaList[activeMediaIndex] || product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>ফুলস্ক্রিন দেখুন</span>
                      </span>
                    </div>
                  </div>

                  {/* Thumbnails Strip */}
                  {productMediaList.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {productMediaList.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveMediaIndex(idx)}
                          className={`relative w-16 h-11 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                            activeMediaIndex === idx
                              ? 'ring-2 ring-[#1DB954] ring-offset-2 ring-offset-white dark:ring-offset-slate-900 scale-102 opacity-100'
                              : 'opacity-60 hover:opacity-100 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Live Demo Link Card */}
                  {product.demoUrl && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            লাইভ প্রজেক্ট প্রিভিউ দেখুন
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            আসল ইন্টারফেস ও কাজের ডেমো সরাসরি ব্রাউজারে যাচাই করুন
                          </p>
                        </div>
                      </div>
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <span>লাইভ ডেমো ভিজিট করুন</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Specs Tab Content */}
              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
                    স্পেসিফিকেশন ও বিস্তারিত ফাইল তথ্য
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                      <span className="text-slate-500 text-[11px] block">ফাইল ফরম্যাট</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {product.fileFormat || 'ZIP / Archive'}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                      <span className="text-slate-500 text-[11px] block">ফাইল সাইজ</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {product.fileSize || 'Standard'}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                      <span className="text-slate-500 text-[11px] block">ডেলিভারি পদ্ধতি</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        {product.deliveryType === 'canva_auto' ? 'অটো ক্যানভা ভিআইপি এক্সেস' : 'ইনস্ট্যান্ট ডিরেক্ট ডাউনলোড'}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                      <span className="text-slate-500 text-[11px] block">লাইসেন্স টাইপ</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        ব্যক্তিগত ও বাণিজ্যিক লাইসেন্স
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                      <span className="text-slate-500 text-[11px] block">ভবিষ্যৎ আপডেট</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        লাইফটাইম ফ্রি আপডেট
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                      <span className="text-slate-500 text-[11px] block">সাপোর্ট পলিসি</span>
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        ১০-দিনের মানি-ব্যাক ও টেকনিক্যাল হেল্প
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Action Sidebar (lg:col-span-4 - Matching CourseDetailModal!) */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 sticky top-4 space-y-6">
                
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
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={productMediaList[lightboxIndex] || product.thumbnail}
            alt="Fullscreen"
            className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};
