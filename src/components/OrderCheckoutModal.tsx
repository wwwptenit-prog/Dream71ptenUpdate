import React, { useState, useEffect } from 'react';
import {
  X, Check, CheckCircle2, Clock, ShieldCheck, Sparkles, Zap, Copy,
  ArrowRight, ArrowLeft, MessageSquare, Phone, Mail, User, CreditCard,
  Lock, Award, Crown, FileText, ExternalLink, RefreshCw
} from 'lucide-react';
import { MarketplaceGig, User as UserType, SiteSettings } from '../types';
import { useData } from '../context/DataContext';

interface OrderCheckoutModalProps {
  gig: MarketplaceGig | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserType | null;
  siteSettings?: SiteSettings;
  defaultPackage?: 'basic' | 'standard' | 'premium';
  onOrderCompleted?: (orderId: string) => void;
  setActiveTab?: (tab: string) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  gig,
  isOpen,
  onClose,
  currentUser,
  siteSettings,
  defaultPackage = 'standard',
  onOrderCompleted,
  setActiveTab
}) => {
  const { createDirectGigOrder, openChatWindow, openMessengerInbox } = useData();

  // Step State: 1 = Package & Note, 2 = Contact Info, 3 = Payment Mode, 4 = Digital Receipt
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPkgType, setSelectedPkgType] = useState<'basic' | 'standard' | 'premium'>(defaultPackage);
  const [projectNote, setProjectNote] = useState<string>('');

  // Contact Info
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Payment Selection
  const [orderMode, setOrderMode] = useState<'pay_after_work' | 'instant_escrow'>('pay_after_work');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Card'>('bKash');
  const [trxId, setTrxId] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Success / Receipt State
  const [completedOrder, setCompletedOrder] = useState<{
    id: string;
    title: string;
    packageType: string;
    packageName: string;
    amount: number;
    deliveryDays: number;
    sellerName: string;
    sellerPhone?: string;
    orderMode: 'pay_after_work' | 'instant_escrow';
    trxId?: string;
    createdAt: string;
  } | null>(null);

  // Sync state when gig changes
  useEffect(() => {
    if (gig) {
      setSelectedPkgType(defaultPackage);
      setClientName(currentUser?.name || 'সম্মানিত গ্রাহক');
      setClientPhone(currentUser?.mobile || currentUser?.phone || '01712345678');
      setClientEmail(currentUser?.email || 'client@ptenit.com');
      setFormError('');
      setProjectNote('');
      setTrxId('');
      const isWorkFirst = gig.offerBadge === 'work_first' || gig.offerBadge === 'আগে কাজ শুরু';
      setOrderMode(isWorkFirst ? 'pay_after_work' : 'instant_escrow');
      setCurrentStep(2); // Directly go to Contact step (Step 1 of 2)
      setCompletedOrder(null);
    }
  }, [gig, defaultPackage, currentUser, isOpen]);

  if (!isOpen || !gig) return null;

  const pkg = gig.packages[selectedPkgType] || gig.packages.standard || gig.packages.basic;
  const basePrice = pkg?.price ?? 2000;
  const isDiscounted = orderMode === 'instant_escrow';
  const finalPrice = isDiscounted ? Math.round(basePrice * 0.95) : basePrice;

  const officialAccounts: Record<string, { label: string; number: string; color: string; bg: string }> = {
    bKash: { label: 'bKash Personal', number: siteSettings?.bkashNumber || '01712345678', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-800' },
    Nagad: { label: 'Nagad Personal', number: siteSettings?.nagadNumber || '01700000000', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' },
    Rocket: { label: 'Rocket Personal', number: siteSettings?.rocketNumber || '01900000000', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800' },
    Upay: { label: 'Upay Personal', number: siteSettings?.upayNumber || '01800000000', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800' },
    Card: { label: siteSettings?.bankName || 'Bank / Card PLC', number: siteSettings?.bankAccountNumber || '2181100098765', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' }
  };

  const handleNextToPayment = () => {
    if (!clientName.trim()) {
      setFormError('অনুগ্রহ করে আপনার নাম প্রদান করুন।');
      return;
    }
    if (!clientPhone.trim() || clientPhone.length < 10) {
      setFormError('সঠিক ১০/১১ ডিজিটের হোয়াটসঅ্যাপ/ফোন নম্বর লিখুন।');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setFormError('সঠিক ইমেইল ঠিকানা প্রদান করুন।');
      return;
    }
    setFormError('');
    setCurrentStep(3);
  };

  const handleConfirmOrderSubmit = () => {
    const finalClientName = clientName.trim() || currentUser?.name || 'সম্মানিত গ্রাহক';
    const finalClientPhone = clientPhone.trim() || currentUser?.mobile || currentUser?.phone || '01712345678';
    const finalClientEmail = clientEmail.trim() || currentUser?.email || 'client@ptenit.com';

    if (orderMode === 'instant_escrow' && !trxId.trim()) {
      setFormError('ইনস্ট্যান্ট এস্ক্রো পেমেন্টের জন্য Transaction ID (TrxID) আবশ্যক।');
      return;
    }

    setFormError('');

    const formattedNote = `[অর্ডার মোড: ${orderMode === 'instant_escrow' ? 'ইনস্ট্যান্ট এস্ক্রো (৫% ক্যাশব্যাক)' : 'আগে কাজ, পরে বিল (Zero Risk)'}] | ক্লায়েন্ট: ${finalClientName} | Phone: ${finalClientPhone} | Email: ${finalClientEmail} | TrxID: ${trxId || 'N/A'} | নোট: ${projectNote || 'কোনো অতিরিক্ত নোট নেই'}`;

    const createdOrder = createDirectGigOrder(gig.id, selectedPkgType, formattedNote, {
      name: finalClientName,
      email: finalClientEmail,
      phone: finalClientPhone,
      paymentMethod: orderMode === 'instant_escrow' ? `Escrow (${paymentMethod})` : 'Pay After Delivery',
      transactionId: trxId || `TRX-FREE-${Math.floor(100000 + Math.random() * 900000)}`
    });

    const orderId = createdOrder?.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    setCompletedOrder({
      id: orderId,
      title: gig.title,
      packageType: selectedPkgType === 'basic' ? 'বেসিক' : selectedPkgType === 'standard' ? 'স্ট্যান্ডার্ড' : 'প্রিমিয়াম',
      packageName: pkg?.name || (selectedPkgType === 'basic' ? 'বেসিক প্যাকেজ' : selectedPkgType === 'standard' ? 'স্ট্যান্ডার্ড প্যাকেজ' : 'প্রিমিয়াম প্যাকেজ'),
      amount: finalPrice,
      deliveryDays: pkg?.deliveryDays || 3,
      sellerName: gig.sellerName,
      sellerPhone: gig.sellerPhone || '01712345678',
      orderMode,
      trxId: trxId || undefined,
      createdAt: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    });

    if (onOrderCompleted) {
      onOrderCompleted(orderId);
    }

    setCurrentStep(4);
  };

  const handleOpenMarketplaceChat = () => {
    if (!completedOrder) return;
    const conversationId = `chat-seller-${completedOrder.sellerName.replace(/\s+/g, '-').toLowerCase()}`;
    if (openChatWindow) {
      openChatWindow({
        id: conversationId,
        orderId: completedOrder.id,
        senderName: completedOrder.sellerName,
        senderRole: 'instructor',
        senderAvatar: gig?.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        initialMessage: `সালাম! আমি PTENit মার্কেটপ্লেস থেকে আপনার "${completedOrder.title}" প্রজেক্টটি সফলভাবে অর্ডার করেছি।\n\n📌 **অর্ডার বিবরণ:**\n• অর্ডার আইডি: #${completedOrder.id}\n• প্যাকেজ: ${completedOrder.packageName}\n• বাজেট: ৳${completedOrder.amount.toLocaleString('bn-BD')}\n• ডেলভারি সময়: ${completedOrder.deliveryDays} দিন\n• ক্লায়েন্ট নাম: ${clientName}\n\nকাজ শুরু সম্পর্কিত নির্দেশনা শেয়ার করুন। ধন্যবাদ!`
      });
    }
    onClose();
  };

  const handleCopyAccount = (numberToCopy: string) => {
    navigator.clipboard.writeText(numberToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-bengali animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden transition-all my-auto">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800/80 relative shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center text-[#1DB954] shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-[#1DB954]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#1DB954] text-white shadow-xs">
                  PTENit Checkout
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {currentStep === 4 ? 'অর্ডার প্রস্তুত!' : `ধাপ ${currentStep === 2 ? 1 : 2} / ২`}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2 mt-0.5">
                <span>অর্ডার কনফার্মেশন</span>
                <span className="text-[11px] font-black text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/30 px-2 py-0.5 rounded-md">
                  {selectedPkgType === 'basic' ? 'বেসিক' : selectedPkgType === 'standard' ? 'স্ট্যান্ডার্ড' : 'প্রিমিয়াম'} (৳{finalPrice.toLocaleString('bn-BD')})
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              if (currentStep === 4 && completedOrder) {
                if (onOrderCompleted) {
                  onOrderCompleted(completedOrder.id);
                } else if (setActiveTab) {
                  setActiveTab('marketplace');
                }
              }
            }}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer shrink-0 border border-slate-700/50"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smart Step Indicator Pills - 2 Steps: 1. যোগাযোগ, 2. পেমেন্ট */}
        {currentStep < 4 && (
          <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold gap-2 shrink-0">
            
            {/* Step 1: যোগাযোগ */}
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={`flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border ${
                currentStep === 2
                  ? 'bg-white dark:bg-slate-900 text-[#1DB954] border-[#1DB954]/40 shadow-xs font-black'
                  : currentStep > 2
                  ? 'bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-transparent'
                  : 'text-slate-400 border-transparent'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 2 ? 'bg-[#1DB954] text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-600'
              }`}>
                {currentStep > 2 ? '✓' : '১'}
              </span>
              <span className="truncate">যোগাযোগ</span>
            </button>

            <span className="text-slate-300 dark:text-slate-700 font-normal">›</span>

            {/* Step 2: পেমেন্ট */}
            <button
              type="button"
              onClick={() => {
                if (clientName && clientPhone) setCurrentStep(3);
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border ${
                currentStep === 3
                  ? 'bg-white dark:bg-slate-900 text-[#1DB954] border-[#1DB954]/40 shadow-xs font-black'
                  : 'text-slate-400 border-transparent'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                currentStep === 3 ? 'bg-[#1DB954] text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-600'
              }`}>
                ২
              </span>
              <span className="truncate">পেমেন্ট</span>
            </button>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* STEP 1: PACKAGE & REQUIREMENT NOTE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#1DB954]" />
                  <span>উপযুক্ত প্যাকেজ সিলেক্ট করুন:</span>
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  বিক্রেতা: <strong className="text-slate-900 dark:text-slate-200">{gig.sellerName}</strong>
                </span>
              </div>

              {/* 3 Package Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['basic', 'standard', 'premium'] as const).map(pKey => {
                  const pData = gig.packages[pKey];
                  const isSelected = selectedPkgType === pKey;
                  if (!pData) return null;

                  return (
                    <div
                      key={pKey}
                      onClick={() => setSelectedPkgType(pKey)}
                      className={`p-3.5 pt-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between relative ${
                        isSelected
                          ? 'border-[#1DB954] bg-[#1DB954]/10 dark:bg-[#1DB954]/15 shadow-md ring-1 ring-[#1DB954]'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Floating Package Badge on Top Border */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                        {pKey === 'basic' && (
                          <span className="text-[11px] font-black text-white bg-[#1DB954] border border-emerald-600 px-2.5 py-0.5 rounded-full shadow-xs">
                            বেসিক প্যাকেজ
                          </span>
                        )}
                        {pKey === 'standard' && (
                          <span className="text-[11px] font-black text-white bg-red-600 border border-red-700 px-2.5 py-0.5 rounded-full shadow-xs">
                            স্ট্যান্ডার্ড প্যাকেজ
                          </span>
                        )}
                        {pKey === 'premium' && (
                          <span className="text-[11px] font-black text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border border-purple-500/40 px-2.5 py-0.5 rounded-full shadow-xs">
                            প্রিমিয়াম প্যাকেজ
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <span className="font-extrabold text-slate-500">
                              অফার:
                            </span>
                            <span className="text-emerald-600 dark:text-[#1DB954] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black">
                              {(gig.offerBadge === 'work_first' || gig.offerBadge === 'আগে কাজ শুরু') ? 'আগে কাজ শুরু' : ((gig.offerBadge === '৩০% ক্যাশব্যাক') ? '৩০% ছাড়' : (gig.offerBadge || '৩০% ছাড়'))}
                            </span>
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#1DB954]" />
                            {pData.deliveryDays} দিন
                          </span>
                        </div>

                        <div className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                          {pData.name}
                        </div>

                        <div className="text-base font-black text-[#1DB954]">
                          ৳{pData.price.toLocaleString('bn-BD')}
                        </div>

                        <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 border-t border-slate-200 dark:border-slate-800/80 pt-2">
                          {(pData.features || []).slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5 truncate">
                              <Check className="w-3 h-3 text-[#1DB954] shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`mt-3 w-full py-1.5 rounded-xl font-bold text-xs transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-[#1DB954] text-white shadow'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isSelected ? 'বাছাই করা হয়েছে ✓' : 'নির্বাচন করুন'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Project Brief / Note Field */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  প্রজেক্টের বিশেষ নির্দেশনা বা রিকোয়ারমেন্টস (ঐচ্ছিক):
                </label>
                <textarea
                  rows={2}
                  value={projectNote}
                  onChange={(e) => setProjectNote(e.target.value)}
                  placeholder="আপনার প্রজেক্ট সম্পর্কিত যেকোনো বিশেষ চাওয়া বা ওয়েবসাইট লিঙ্ক থাকলে লিখুন..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* Footer Step Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold font-bengali text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center cursor-pointer"
                >
                  <span>পরবর্তী ধাপে যান (যোগাযোগের তথ্য)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTACT INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div className="p-3 bg-emerald-500/10 dark:bg-emerald-950/30 rounded-2xl border border-[#1DB954]/30 space-y-0.5">
                <h3 className="text-xs sm:text-sm font-black text-[#1DB954] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1DB954]" />
                  <span>আপনার যোগাযোগের তথ্য প্রদান করুন:</span>
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  অর্ডারের আপডেট ও সরাসরি সেলারের সাথে যোগাযোগের জন্য আপনার তথ্য দিন।
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl">
                  ⚠️ {formError}
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                    আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#1DB954] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="উদাহরণ: আরিফ হোসেন"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                      হোয়াটসঅ্যাপ নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#1DB954] absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="01712345678"
                        value={clientPhone}
                        onChange={(e) => {
                          setClientPhone(e.target.value);
                          if (formError) setFormError('');
                        }}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                      ইমেইল ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="name@gmail.com"
                        value={clientEmail}
                        onChange={(e) => {
                          setClientEmail(e.target.value);
                          if (formError) setFormError('');
                        }}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Brief / Note Field */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                    প্রজেক্টের বিশেষ নির্দেশনা বা রিকোয়ারমেন্টস (ঐচ্ছিক):
                  </label>
                  <textarea
                    rows={2.5}
                    value={projectNote}
                    onChange={(e) => setProjectNote(e.target.value)}
                    placeholder="আপনার প্রজেক্ট সম্পর্কিত যেকোনো বিশেষ চাওয়া বা ওয়েবসাইট লিঙ্ক থাকলে লিখুন..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
                  />
                </div>
              </div>

              {/* Step Navigation Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextToPayment}
                  className="w-full sm:w-auto px-7 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-black font-bengali text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center cursor-pointer"
                >
                  <span>পেমেন্ট ও কনফার্মেশনে যান (ধাপ ২)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & ORDER CONFIRMATION */}
          {currentStep === 3 && (
            <div className="space-y-3.5">
              {/* If Work First Gig */}
              {orderMode === 'pay_after_work' ? (
                <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#1DB954] font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1DB954]" />
                      <span>আগে কাজ, পরে বিল (Zero Risk Guarantee)</span>
                    </div>
                    <span className="text-[10px] font-black text-white bg-[#1DB954] px-2.5 py-0.5 rounded-full shadow-xs shrink-0">
                      ১০০% সেফ
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    এই গিগটিতে ‘আগে কাজ শুরু’ সুবিধা রয়েছে। অর্ডার করার জন্য কোনো অগ্রিম পেমেন্ট করতে হবে না। কাজ বুঝে পাওয়ার পর বিল পরিশোধ করবেন।
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4 text-[#1DB954] shrink-0" />
                      <span>কোনো অগ্রিম চার্জ নেই</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-emerald-500/20">
                      <Clock className="w-4 h-4 text-[#1DB954] shrink-0" />
                      <span>সময়মতো প্রজেক্ট ডেলিভারি</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Order: Payment Method Selector */
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-black text-slate-800 dark:text-slate-200">
                    <span className="text-xs font-extrabold text-[#1DB954]">পেমেন্ট মেথড নির্বাচন করুন:</span>
                    <span className="text-[#1DB954] font-black bg-[#1DB954]/10 px-2.5 py-1 rounded-lg border border-[#1DB954]/20">
                      মোট বিল: ৳{finalPrice.toLocaleString('bn-BD')}
                    </span>
                  </div>

                  {/* Prominent & Larger Payment Method Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['bKash', 'Nagad', 'Rocket', 'Upay', 'Card'] as const).map(mKey => {
                      const acc = officialAccounts[mKey];
                      const isSel = paymentMethod === mKey;
                      return (
                        <button
                          key={mKey}
                          type="button"
                          onClick={() => setPaymentMethod(mKey)}
                          className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs ${
                            isSel
                              ? 'bg-white dark:bg-slate-900 border-[#1DB954] text-[#1DB954] ring-2 ring-[#1DB954]/40 shadow-md scale-102'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${acc.bg} ${acc.color}`}>
                            {mKey}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {mKey === 'Card' ? 'ব্যাংক/কার্ড' : 'সেন্ড মানি'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Account Copy Bar */}
                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">
                        {officialAccounts[paymentMethod].label}:
                      </span>
                      <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                        {officialAccounts[paymentMethod].number}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAccount(officialAccounts[paymentMethod].number)}
                      className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5 text-white" />
                      <span>{isCopied ? 'কপি হয়েছে!' : 'নম্বর কপি করুন'}</span>
                    </button>
                  </div>

                  {/* TrxID Input */}
                  <div>
                    <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                      পেমেন্ট শেষ করে TrxID (Transaction ID) লিখুন <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="উদাহরণ: 9J87X6K12"
                      value={trxId}
                      onChange={(e) => {
                        setTrxId(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
                    />
                  </div>
                </div>
              )}

              {/* Price Breakdown Summary */}
              <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-bold">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>প্যাকেজ মূল্য ({selectedPkgType.toUpperCase()}):</span>
                  <span>৳{basePrice.toLocaleString('bn-BD')}</span>
                </div>
                {isDiscounted && (
                  <div className="flex justify-between text-[#1DB954]">
                    <span>ইনস্ট্যান্ট ক্যাশব্যাক (৫% ছাড়):</span>
                    <span>-৳{Math.round(basePrice * 0.05).toLocaleString('bn-BD')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 dark:text-white text-sm font-black pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>সর্বমোট প্রদেয় বিল:</span>
                  <span className="text-[#1DB954]">৳{finalPrice.toLocaleString('bn-BD')}</span>
                </div>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl">
                  ⚠️ {formError}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-300 transition cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOrderSubmit}
                  className="flex-1 py-3 px-6 bg-[#1DB954] hover:bg-emerald-600 text-white font-black font-bengali text-sm rounded-xl shadow-lg hover:shadow-[#1DB954]/20 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>অর্ডার নিশ্চিত করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DIGITAL RECEIPT & WHATSAPP DIRECT CONNECT */}
          {currentStep === 4 && completedOrder && (
            <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-300">
              
              <div className="w-14 h-14 bg-[#1DB954]/20 text-[#1DB954] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#1DB954]/10">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  অর্ডার সফল হয়েছে! 🎉
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  ধন্যবাদ, <strong className="text-slate-800 dark:text-slate-200">{clientName}</strong>!
                </p>
              </div>

              {/* Digital Order Receipt Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-2.5 shadow-inner">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">অর্ডার আইডি</span>
                    <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                      #{completedOrder.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">তারিখ</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {completedOrder.createdAt}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-bold">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>সার্ভিস টাইটেল:</span>
                    <span className="truncate max-w-[220px] text-right text-slate-900 dark:text-white">
                      {completedOrder.title}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>প্যাকেজ নাম:</span>
                    <span className="text-[#1DB954]">{completedOrder.packageName}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>মোট বাজেট:</span>
                    <span className="text-slate-900 dark:text-white font-black text-sm">
                      ৳{completedOrder.amount.toLocaleString('bn-BD')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>ডেলিভারি সময়সীমা:</span>
                    <span>{completedOrder.deliveryDays} দিন</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>বিলিং মোড:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {completedOrder.orderMode === 'instant_escrow' ? 'ইনস্ট্যান্ট এস্ক্রো' : 'আগে কাজ, পরে বিল'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Actions in One Row */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOrderCompleted) {
                      onOrderCompleted(completedOrder.id);
                    } else if (setActiveTab) {
                      setActiveTab('marketplace');
                    }
                  }}
                  className="py-3 px-2 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md truncate"
                >
                  <ArrowRight className="w-4 h-4 shrink-0 text-slate-950" />
                  <span className="truncate">বায়ারের ড্যাশবোর্ডে যান</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenMarketplaceChat}
                  className="py-3 px-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer truncate border border-slate-700"
                >
                  <MessageSquare className="w-4 h-4 text-[#1DB954] shrink-0" />
                  <span className="truncate">মেসেজ করুন</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
