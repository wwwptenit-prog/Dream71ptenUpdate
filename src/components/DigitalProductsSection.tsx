import React, { useState, useEffect, useRef } from 'react';
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
  ShoppingCart,
  Star,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Maximize2,
  Image as ImageIcon,
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
import { DigitalProductDetailModal } from './DigitalProductDetailModal';

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
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'preview' | 'specs'>('overview');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  // Confirmation & Instant Download State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Media Gallery & Demo Showcase State
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Computed Product Media List (Limited to primary image or at most 1 demo image)
  const productMediaList: string[] = selectedProduct
    ? [
        selectedProduct.thumbnail,
        ...((selectedProduct.demoImages || selectedProduct.galleryImages || []).slice(0, 1))
      ].filter(Boolean)
    : [];

  const handlePrevMedia = () => {
    if (productMediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : productMediaList.length - 1));
  };

  const handleNextMedia = () => {
    if (productMediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev < productMediaList.length - 1 ? prev + 1 : 0));
  };

  const handlePrevLightbox = () => {
    if (productMediaList.length <= 1 || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : productMediaList.length - 1));
  };

  const handleNextLightbox = () => {
    if (productMediaList.length <= 1 || lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < productMediaList.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextLightbox();
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, productMediaList.length]);

  // Ref for Smooth Scrolling to Order Form
  const orderFormRef = useRef<HTMLDivElement>(null);
  const scrollToOrderForm = () => {
    if (checkoutStep === 0) setCheckoutStep(1);
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const savedScrollPositionRef = useRef<number>(0);

  const handleOpenDetail = (product: DigitalProduct) => {
    savedScrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    setSelectedProduct(product);
    setActiveDetailTab('overview');
    setActiveMediaIndex(0);
    setLightboxIndex(null);
    setPaymentModalOpen(false);
    setCheckoutStep(1);
    setCustomerEmail(currentUser?.email || '');
    setCustomerName(currentUser?.name || '');
    setCustomerPhone(currentUser?.mobile || '');
    setTrxId('');
    setSenderPhone('');
    setPurchaseError(null);
    setIsOrderPlaced(false);
    setCompletedOrder(null);
  };

  const handleCloseDetail = () => {
    const targetY = savedScrollPositionRef.current;
    setSelectedProduct(null);
    setPaymentModalOpen(false);
    setCheckoutStep(1);
    setPurchaseError(null);
    setIsOrderPlaced(false);
    setCompletedOrder(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'instant' });
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' });
      }, 40);
    });
  };

  const handleBackToList = () => {
    handleCloseDetail();
  };

  const handleProceedToPayment = (e?: React.FormEvent) => {
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

    if (!selectedProduct) return;
    if (selectedProduct.price === 0) {
      handleConfirmPurchase();
    } else {
      setCheckoutStep(2);
    }
  };

  const handleConfirmPurchase = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  // (Stand-alone detail modal rendered as overlay below to keep scroll position)

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
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
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
                    {/* Clean Cover Thumbnail - purely the image, no buttons or badges */}
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
                          className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 dark:text-white line-clamp-3 sm:line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors cursor-pointer min-h-[3rem] sm:min-h-[2.5rem]"
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

      {/* Fullscreen Interactive Lightbox Modal with Prev/Next, Thumbnails & Mobile Gestures */}
      {lightboxIndex !== null && productMediaList[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX !== null) {
              const diff = e.changedTouches[0].clientX - touchStartX;
              if (diff > 50) handlePrevLightbox();
              else if (diff < -50) handleNextLightbox();
              setTouchStartX(null);
            }
          }}
        >
          {/* Top Bar: Product Name, Counter, Close */}
          <div
            className="flex items-center justify-between text-white max-w-6xl mx-auto w-full z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-[#1DB954] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                ডেমো প্রিভিউ
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                {selectedProduct?.title}
              </h4>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                {lightboxIndex + 1} / {productMediaList.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition active:scale-95 cursor-pointer border border-slate-700"
                title="বন্ধ করুন (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Main Image Stage with Side Arrows */}
          <div
            className="relative flex-1 flex items-center justify-center my-2 max-w-5xl mx-auto w-full min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={productMediaList[lightboxIndex]}
              alt={`Fullscreen ${lightboxIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10 transition-all duration-200"
            />

            {/* Left & Right Navigation Arrows */}
            {productMediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevLightbox}
                  className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition active:scale-90 cursor-pointer shadow-xl"
                  title="পূর্ববর্তী ছবি (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextLightbox}
                  className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition active:scale-90 cursor-pointer shadow-xl"
                  title="পরবর্তী ছবি (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          {productMediaList.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-3xl mx-auto w-full z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {productMediaList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative w-14 h-10 sm:w-18 sm:h-12 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer ${
                    lightboxIndex === idx
                      ? 'ring-2 ring-[#1DB954] ring-offset-2 ring-offset-black scale-105 opacity-100'
                      : 'opacity-50 hover:opacity-80 border border-slate-700'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DEDICATED STANDALONE DETAIL MODAL VIEW (Matching Course Detail Modal) */}
      {selectedProduct && (
        <DigitalProductDetailModal
          product={selectedProduct}
          onClose={handleCloseDetail}
        />
      )}
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
