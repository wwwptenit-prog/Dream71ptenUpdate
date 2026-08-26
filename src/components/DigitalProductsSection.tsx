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
  HelpCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { DigitalProduct, MarketplaceOrder } from '../types';

interface DigitalProductsSectionProps {
  setActiveTab?: (tab: string) => void;
}

export const DigitalProductsSection: React.FC<DigitalProductsSectionProps> = ({ setActiveTab }) => {
  const { digitalProducts = [], currentUser, siteSettings, addMarketplaceOrder, t } = useData();

  // Selected Product for Dedicated In-Page Landing View (Not a modal popup)
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<boolean>(false);
  const [desktopExpanded, setDesktopExpanded] = useState<boolean>(false);

  // In-Page Checkout / Download Form State
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.mobile || '');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');

  // Confirmation & Instant Download State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<MarketplaceOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleOpenDetail = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setCustomerEmail(currentUser?.email || '');
    setCustomerName(currentUser?.name || '');
    setCustomerPhone(currentUser?.mobile || '');
    setTrxId('');
    setSenderPhone('');
    setIsOrderPlaced(false);
    setCompletedOrder(null);
    // Instant scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
    setIsOrderPlaced(false);
    setCompletedOrder(null);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const isFree = selectedProduct.price === 0;
    if (!customerEmail || !customerName) {
      alert('অনুগ্রহ করে আপনার নাম ও ইমেইল অ্যাড্রেস প্রদান করুন।');
      return;
    }

    if (!isFree && !trxId) {
      alert('অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি (TrxID) প্রদান করুন।');
      return;
    }

    const orderId = isFree ? `FREE-DL-${Math.floor(100000 + Math.random() * 900000)}` : `DIGI-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: MarketplaceOrder = {
      id: orderId,
      type: 'digital_product_order',
      digitalProductId: selectedProduct.id,
      title: selectedProduct.title,
      category: selectedProduct.category,
      buyerId: currentUser?.id || `buyer-${Date.now()}`,
      buyerName: customerName,
      buyerEmail: customerEmail,
      buyerPhone: customerPhone,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit IT Digital Store',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isInternalStaff: true,
      amount: selectedProduct.price,
      adminCommission: 0,
      sellerPayout: selectedProduct.price,
      paymentMethod: isFree ? 'Free Instant Download' : `${paymentMethod} (TrxID: ${trxId})`,
      transactionId: isFree ? 'FREE_PROMO' : trxId,
      status: 'completed',
      deliveryNote: isFree 
        ? `বিনামূল্যে ইনস্ট্যান্ট ডাউনলোড সম্পন্ন! ডাউনলোড লিঙ্ক: ${selectedProduct.downloadUrl}`
        : (selectedProduct.deliveryType === 'auto'
          ? `স্বয়ংক্রিয় ইমেইল ও ড্যাশবোর্ড ডেলিভারি সম্পন্ন! ডাউনলোড লিঙ্ক: ${selectedProduct.downloadUrl}`
          : 'ম্যানুয়াল ভেরিফিকেশনের জন্য ইমেইল ও ড্যাশবোর্ডে ফাইল প্রসেসিং করা হচ্ছে।'),
      downloadUrl: selectedProduct.downloadUrl,
      licenseKey: selectedProduct.licenseKey,
      deliveryFileUrl: selectedProduct.downloadUrl,
      deliveryFileName: `${selectedProduct.title}.zip`,
      deliveredAt: new Date().toLocaleString('en-BD'),
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: new Date().toISOString().split('T')[0]
    };

    addMarketplaceOrder(newOrder);
    setCompletedOrder(newOrder);
    setIsOrderPlaced(true);
  };

  const copyLicenseKey = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
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

        {/* Hero Banner Showcase */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
          <div className="relative h-64 sm:h-96 w-full overflow-hidden">
            <img
              src={selectedProduct.thumbnail}
              alt={selectedProduct.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Badges in Hero */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-[#1DB954] text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-white" />
                {selectedProduct.category}
              </span>
              {isFree ? (
                <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 fill-white" />
                  ১০০% ফ্রি লাইসেন্স
                </span>
              ) : (
                <span className="bg-purple-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  অরিজিনাল প্রিমিয়াম প্যাকেজ
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{selectedProduct.rating} ({selectedProduct.reviewsCount || 45} রিভিউ)</span>
                  <span>•</span>
                  <span className="text-slate-300 font-normal">{selectedProduct.salesCount || 100}+ ডাউনলোড ও সেলস</span>
                </div>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-md">
                  {selectedProduct.title}
                </h1>
              </div>

              {/* Price Tag in Hero */}
              <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  প্রোডাক্ট মূল্য
                </span>
                {isFree ? (
                  <div className="text-emerald-400 font-black text-2xl sm:text-3xl">
                    সম্পূর্ণ ফ্রি!
                  </div>
                ) : (
                  <div className="flex items-baseline justify-end gap-2">
                    {selectedProduct.originalPrice && (
                      <span className="text-xs sm:text-sm text-slate-400 line-through">
                        ৳{selectedProduct.originalPrice.toLocaleString('bn-BD')}
                      </span>
                    )}
                    <span className="text-[#1DB954] font-black text-2xl sm:text-3xl">
                      ৳{selectedProduct.price.toLocaleString('bn-BD')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tech Specs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#1DB954] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">ফাইল সাইজ</span>
              <strong className="text-slate-900 dark:text-white font-bold">{selectedProduct.fileSize}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">ফাইল ফরম্যাট</span>
              <strong className="text-slate-900 dark:text-white font-bold">{selectedProduct.fileFormat}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">ভার্সন ও আপডেট</span>
              <strong className="text-slate-900 dark:text-white font-bold">{selectedProduct.version || 'v2026.1 Official'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">ডেলিভারি মেথড</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {isFree ? '১-ক্লিক ইনস্ট্যান্ট' : (selectedProduct.deliveryType === 'auto' ? 'অটোমেটিক ইমেইল ও ড্রাইভ' : 'ম্যানুয়াল সাপোর্ট')}
              </strong>
            </div>
          </div>
        </div>

        {/* Main Content & Integrated Download/Order Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Product Information, Description & Features */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Description Card */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1DB954]" />
                প্রোডাক্ট বিবরণ ও পরিচিতি
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedProduct.fullDescription || selectedProduct.shortDescription}
              </div>
            </div>

            {/* Key Features */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  প্রোডাক্টের বিশেষ সুবিধাসমূহ (Key Features)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-800 dark:text-slate-200">
                      <CheckCircle className="w-4 h-4 text-[#1DB954] shrink-0 mt-0.5" />
                      <span className="font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Requirements */}
            {selectedProduct.requirements && selectedProduct.requirements.length > 0 && (
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  প্রয়োজনীয় সিস্টেম ও সার্ভার রিকোয়ারমেন্ট
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedProduct.requirements.map((req, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                      • {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantee Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-[#1DB954]/20 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-6 h-6 text-[#1DB954] shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white block font-bold">PTENit অফিশিয়াল সিকিউর ড্রাইভ গ্যারান্টি</strong>
                সকল সোর্স কোড ও ফাইল প্রি-স্ক্যানড এবং সম্পূর্ণ ম্যালওয়্যার/ভাইরাস মুক্ত।
              </div>
            </div>

          </div>

          {/* Right Column: Integrated Order & Instant Download Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 sticky top-6">
            
            {/* Box Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wider block">
                {isFree ? '🎁 ফ্রি ইনস্ট্যান্ট এক্সেস' : '💳 নিরাপদ অনলাইন অর্ডার ও ডেলিভারি'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                {isFree ? 'বিনামূল্যে এখনই ডাউনলোড করুন' : 'অর্ডার ও বিল কনফার্ম করুন'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isFree 
                  ? 'তথ্য দিয়ে সাবমিট করার সাথে সাথেই গুগল ড্রাইভ সরাসরি ডাউনলোড লিঙ্ক পেয়ে যাবেন।' 
                  : 'পেমেন্ট সম্পন্ন করে TrxID দিলে স্বয়ংক্রিয়ভাবে সোর্স কোড লিঙ্ক ও অফিশিয়াল ইনভয়েস বিল দেওয়া হবে।'}
              </p>
            </div>

            {!isOrderPlaced ? (
              /* IN-PAGE FORM */
              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার ইমেইল অ্যাড্রেস *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                  />
                </div>

                {/* Paid Flow Payment Options */}
                {!isFree && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        পেমেন্ট মেথড নির্বাচন করুন *
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map(method => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
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
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-1 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {paymentMethod === 'bKash' ? 'বিকাশ সেন্ড মানি নম্বর (Personal):' : paymentMethod === 'Nagad' ? 'নগদ সেন্ড মানি নম্বর (Personal):' : paymentMethod === 'Rocket' ? 'রকেট নম্বর (Personal):' : 'ব্যাংক হিসাব নম্বর:'}
                      </span>
                      <div className="font-black text-[#1DB954] text-sm tracking-wider">
                        {paymentMethod === 'bKash' ? (siteSettings.bkashNumber || '01712345678') : paymentMethod === 'Nagad' ? (siteSettings.nagadNumber || '01700000000') : paymentMethod === 'Rocket' ? (siteSettings.rocketNumber || '01900000000') : `${siteSettings.bankName || 'DBBL'} - ${siteSettings.bankAccountNumber || '2181100098765'}`}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        উপরোক্ত নম্বরে ৳{selectedProduct.price.toLocaleString('bn-BD')} টাকা সেন্ড মানি করে নিচে TrxID দিন।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          প্রেরক নম্বর
                        </label>
                        <input
                          type="text"
                          value={senderPhone}
                          onChange={e => setSenderPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          ট্রানজেকশন আইডি (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={e => setTrxId(e.target.value)}
                          placeholder="e.g. 9X2A88K1"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    মূল্য: <span className={`font-black text-sm ${isFree ? 'text-emerald-500' : 'text-[#1DB954]'}`}>
                      {isFree ? 'বিনামূল্যে (ফ্রি)' : `৳${selectedProduct.price.toLocaleString('bn-BD')}`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
                  >
                    {isFree ? (
                      <>
                        <Download className="w-4 h-4" />
                        <span>১-ক্লিকে ফ্রি ডাউনলোড করুন</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>অর্ডার নিশ্চিত করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* INSTANT SUCCESS & UNLOCKED ACCESS */
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-500/10 border border-[#1DB954]/30 rounded-2xl text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {isFree ? '🎉 ফ্রি ডাউনলোড প্রস্তুত!' : '🎉 পেমেন্ট ও ইনভয়েস সফল হয়েছে!'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    ইনভয়েস নং: <span className="font-mono font-bold text-[#1DB954]">{completedOrder?.id}</span>
                  </p>
                </div>

                {/* Direct Google Drive Link Box */}
                <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1DB954] flex items-center gap-1">
                      <Zap className="w-4 h-4 fill-[#1DB954]" />
                      ডাউনলোড ফাইল ও এক্সেস
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {selectedProduct.fileFormat} ({selectedProduct.fileSize})
                    </span>
                  </div>

                  <a
                    href={selectedProduct.downloadUrl || 'https://drive.google.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>সরাসরি গুগল ড্রাইভে ডাউনলোড ফাইল ওপেন করুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {selectedProduct.licenseKey && (
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">অ্যাক্টিভেশন / লাইসেন্স কি:</span>
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
                          {copiedKey ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleBackToList}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    সব প্রোডাক্টে ফিরে যান
                  </button>
                </div>
              </div>
            )}

            {/* Need Help WhatsApp Box */}
            <div className="pt-2 text-center">
              <a
                href={`https://wa.me/${siteSettings.whatsapp}?text=I%20need%20help%20with%20digital%20product%20${encodeURIComponent(selectedProduct.title)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1DB954] transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>যেকোনো প্রয়োজনে সরাসরি হোয়াটসঅ্যাপে সাপোর্ট নিন</span>
              </a>
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
  // 🛍️ DEFAULT PRODUCT GRID VIEW (5 cols on PC, 2 cols on Phone)
  // =========================================================================
  return (
    <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800 font-bengali">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1 text-center sm:text-left flex flex-col items-center sm:items-start">
          <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
            <Zap className="w-3.5 h-3.5" />
            {t('ইনস্ট্যান্ট ডাউনলোড ও সোর্স কোড', 'Instant Download & Source Code')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {t('ডিজিটাল প্রোডাক্টস ও সফটওয়্যার', 'Digital Products & Software Downloads')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            সম্পূর্ণ প্রস্তুত প্রিমিয়াম ও ফ্রি সোর্স কোড, স্ক্রিপ্ট, থিম ও সফটওয়্যার কালেকশন।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile View Toggle */}
          {mobileExpanded ? (
            <button
              type="button"
              onClick={() => setMobileExpanded(false)}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] font-bold text-xs transition-colors cursor-pointer font-bengali shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('ফিরে যান', 'Back')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMobileExpanded(true)}
              className="sm:hidden inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-xs transition-all cursor-pointer font-bengali shrink-0 group"
            >
              <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
            </button>
          )}

          {/* Desktop View Navigation / Toggle */}
          {desktopExpanded ? (
            <button
              type="button"
              onClick={() => setDesktopExpanded(false)}
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] font-bold text-sm transition-colors cursor-pointer font-bengali shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('কমিয়ে দেখুন', 'Show Less')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDesktopExpanded(true)}
              className="hidden sm:inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
            >
              <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: 4 columns on PC, 2 columns on Phone (Max 4 on mobile unless expanded) */}
      <div>
        {/* Desktop: 1 row of 4 or expanded */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
          {(desktopExpanded ? digitalProducts : digitalProducts.slice(0, 4)).map(product => {
            const isFree = product.price === 0;

            return (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div 
                    onClick={() => handleOpenDetail(product)}
                    className="relative h-32 sm:h-40 overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {isFree ? (
                        <span className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Gift className="w-3 h-3 fill-white" />
                          ১০০% ফ্রি
                        </span>
                      ) : product.deliveryType === 'auto' ? (
                        <span className="bg-[#1DB954] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Zap className="w-3 h-3 fill-white" />
                          অটো ডেলিভারি
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Mail className="w-3 h-3" />
                          ম্যানুয়াল
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-slate-900/90 text-slate-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
                        {product.fileFormat}
                      </span>
                    </div>

                    {/* Bottom Specs Pill */}
                    <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[10px] text-white font-bold">
                      <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
                        <Package className="w-3 h-3 text-[#1DB954]" />
                        <span>{product.fileSize}</span>
                      </span>
                      <span className="bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wide block truncate">
                        {product.category}
                      </span>
                    </div>

                    <h3 
                      onClick={() => handleOpenDetail(product)}
                      className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors cursor-pointer"
                    >
                      {product.title}
                    </h3>

                    <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed hidden sm:block">
                      {product.shortDescription}
                    </p>

                    {/* Features list bullet tags */}
                    {product.features && product.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.features.slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 truncate max-w-[110px]">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Clean Price and Details Button */}
                <div className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1 sm:gap-2">
                  <div className="min-w-0">
                    {isFree ? (
                      <span className="text-xs sm:text-base font-black text-emerald-500 dark:text-emerald-400 block truncate leading-tight">
                        {t('সম্পূর্ণ ফ্রি', 'Fully Free')}
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-slate-400 line-through block leading-tight truncate">
                            ৳{product.originalPrice.toLocaleString('bn-BD')}
                          </span>
                        )}
                        <span className="text-xs sm:text-base md:text-lg font-black text-[#1DB954] block truncate leading-tight">
                          ৳{product.price.toLocaleString('bn-BD')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(product)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-600 shadow-xs sm:shadow-md sm:shadow-[#1DB954]/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                  >
                    <span>{t('বিস্তারিত', 'Details')}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Max 4 unless expanded */}
        <div className="grid grid-cols-2 gap-2.5 sm:hidden">
          {(mobileExpanded ? digitalProducts : digitalProducts.slice(0, 4)).map(product => {
            const isFree = product.price === 0;

            return (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div 
                    onClick={() => handleOpenDetail(product)}
                    className="relative h-28 overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1">
                      {isFree ? (
                        <span className="bg-emerald-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Gift className="w-2.5 h-2.5 fill-white" />
                          সম্পূর্ণ ফ্রি
                        </span>
                      ) : product.deliveryType === 'auto' ? (
                        <span className="bg-[#1DB954] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Zap className="w-2.5 h-2.5 fill-white" />
                          অটো
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Mail className="w-2.5 h-2.5" />
                          ম্যানুয়াল
                        </span>
                      )}
                    </div>

                    <div className="absolute top-1.5 right-1.5 z-10">
                      <span className="bg-slate-900/90 text-slate-200 text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-700">
                        {product.fileFormat}
                      </span>
                    </div>

                    {/* Bottom Specs Pill */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10 flex items-center justify-between text-[9px] text-white font-bold">
                      <span className="bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-slate-800 flex items-center gap-0.5">
                        <Package className="w-2.5 h-2.5 text-[#1DB954]" />
                        <span>{product.fileSize}</span>
                      </span>
                      <span className="bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        <span>{product.rating}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-2 space-y-1">
                    <span className="text-[9px] font-bold text-[#1DB954] uppercase tracking-wide block truncate">
                      {product.category}
                    </span>

                    <h3 
                      onClick={() => handleOpenDetail(product)}
                      className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors min-h-[2rem] cursor-pointer"
                    >
                      {product.title}
                    </h3>
                  </div>
                </div>

                {/* Card Footer: Clean Price and Details Button */}
                <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <div className="min-w-0">
                    {isFree ? (
                      <span className="text-xs sm:text-sm font-black text-emerald-500 block truncate leading-tight">
                        {t('সম্পূর্ণ ফ্রি', 'Fully Free')}
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        {product.originalPrice && (
                          <span className="text-[9px] text-slate-400 line-through block leading-tight truncate">
                            ৳{product.originalPrice.toLocaleString('bn-BD')}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm font-black text-[#1DB954] block truncate leading-tight">
                          ৳{product.price.toLocaleString('bn-BD')}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenDetail(product)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-600 shadow-xs sm:shadow-md sm:shadow-[#1DB954]/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
                  >
                    <span>{t('বিস্তারিত', 'Details')}</span>
                    <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
