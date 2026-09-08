import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  Play,
  PlayCircle,
  FileText,
  HelpCircle,
  Lock,
  ChevronDown,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Share2,
  Facebook
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Course } from '../types';
import { SinglePromoBadgeView } from '../utils/badgeHelper';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

interface CourseDetailModalProps {
  courseId: string | null;
  onClose: () => void;
  openAuthModal: () => void;
  onStartLearning: (courseId: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  courseId,
  onClose,
  openAuthModal,
  onStartLearning
}) => {
  const { courses, currentUser, enrollments, enrollCourse, siteSettings } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [openModuleId, setOpenModuleId] = useState<string>('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentPendingModal, setPaymentPendingModal] = useState(false);
  
  // 2-Step Checkout State
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentPhone, setStudentPhone] = useState(currentUser?.mobile || '');
  const [studentEmail, setStudentEmail] = useState(currentUser?.email || '');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz'>('bKash');
  const [senderPhone, setSenderPhone] = useState(currentUser?.mobile || '');
  const [transactionId, setTransactionId] = useState('');
  const [paymentFormError, setPaymentFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [autoPayTab, setAutoPayTab] = useState<'instant' | 'manual'>('instant');
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

  const handleCopyNumber = (num: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(num).catch(() => {
          fallbackCopyText(num);
        });
      } else {
        fallbackCopyText(num);
      }
    } catch {
      fallbackCopyText(num);
    }
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  if (!courseId) return null;
  const course = courses.find(c => c.id === courseId);
  if (!course) return null;

  const userEnrollment = currentUser
    ? enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id)
    : null;
  const isEnrolled = !!userEnrollment;
  const isPendingApproval = userEnrollment?.status === 'pending';

  // Social Media Share States & Actions
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${course.title} - PTENit Learning\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(course.title);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    fallbackCopyText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 2000);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: course.description?.slice(0, 100) || course.title,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleEnrollClick = async () => {
    if (isPendingApproval) {
      setPaymentPendingModal(true);
      return;
    }

    if (isEnrolled) {
      onStartLearning(course.id);
      onClose();
      return;
    }

    if (course.isFree) {
      if (!currentUser) {
        openAuthModal();
        return;
      }
      setIsSubmitting(true);
      await enrollCourse(course.id);
      setIsSubmitting(false);
      onStartLearning(course.id);
      onClose();
    } else {
      setCheckoutStep(1);
      setStudentName(currentUser?.name || '');
      setStudentPhone(currentUser?.mobile || '');
      setStudentEmail(currentUser?.email || '');
      setSenderPhone(currentUser?.mobile || '');
      setPaymentFormError(null);
      setPaymentModalOpen(true);
    }
  };

  const handleProceedToPaymentStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPaymentFormError(null);
    if (!studentName.trim()) {
      setPaymentFormError("অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।");
      return;
    }
    if (!studentPhone.trim()) {
      setPaymentFormError("অনুগ্রহ করে আপনার সচল মোবাইল / হোয়াটসঅ্যাপ নম্বর দিন।");
      return;
    }
    if (!studentEmail.trim()) {
      setPaymentFormError("অনুগ্রহ করে আপনার ইমেইল অ্যাড্রেস প্রদান করুন।");
      return;
    }
    if (!senderPhone.trim()) {
      setSenderPhone(studentPhone.trim());
    }
    setCheckoutStep(2);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentFormError(null);

    const cleanPhone = senderPhone.trim() || studentPhone.trim();
    const cleanTxId = transactionId.trim();

    if (!cleanPhone || !cleanTxId) {
      setPaymentFormError("অনুগ্রহ করে প্রেরক মোবাইল নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }

    setIsSubmitting(true);
    try {
      await enrollCourse(course.id, {
        method: paymentMethod,
        phone: cleanPhone,
        txId: cleanTxId,
        amount: course.discountPrice || course.price
      });
    } catch {
      // safe continuation
    } finally {
      setIsSubmitting(false);
      setPaymentModalOpen(false);
      setPaymentPendingModal(true);
    }
  };

  const handleInstantGatewayPayment = async () => {
    setIsAutoProcessing(true);
    setPaymentFormError(null);
    try {
      const gateway = siteSettings?.selectedGateway || 'bkash_pgw';
      const isSandbox = siteSettings?.gatewaySandboxMode !== false;
      const amount = course.discountPrice || course.price;

      // 1. Create Checkout Session via Server
      const sessionRes = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          amount,
          studentName: studentName.trim() || currentUser?.name || 'Student',
          studentEmail: studentEmail.trim() || currentUser?.email || '',
          studentPhone: studentPhone.trim() || currentUser?.mobile || '',
          gateway,
          isSandbox
        })
      });
      const sessionData = await sessionRes.json();

      // 2. Verify with gateway (simulates instant tokenized checkout verification)
      const verifyRes = await fetch('/api/payment/verify-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: sessionData.paymentId,
          gateway,
          isSandbox,
          amount
        })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        // Instant automated enrollment & activation without admin waiting!
        await enrollCourse(course.id, {
          method: (gateway === 'bkash_pgw' ? 'bKash' : 'SSLCommerz') as any,
          phone: currentUser?.mobile || '01700000000',
          txId: verifyData.transactionId,
          amount,
          isAutomated: true
        });

        setIsAutoProcessing(false);
        setPaymentModalOpen(false);
        onStartLearning(course.id);
        onClose();
      } else {
        setPaymentFormError(verifyData.message || 'পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে।');
        setIsAutoProcessing(false);
      }
    } catch (err) {
      setPaymentFormError('গেটওয়ে সার্ভারের সাথে সংযোগ করা যায়নি। ম্যানুয়াল TrxID অপশন ব্যবহার করুন।');
      setIsAutoProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto min-h-screen font-bengali p-2 sm:p-4 md:p-6 lg:p-8 animate-fadeIn text-slate-800 dark:text-slate-100">
      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">

        {/* Main Course Content Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xs">

          {/* 1. TOP BAR: ব্যাক বাটন | সেন্টারে: প্রিমিয়াম সার্ভিস / সম্পূর্ণ ফ্রি | শেয়ার সোশ্যাল মিডিয়া */}
          <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 rounded-t-2xl sm:rounded-t-3xl">
            {/* LEFT: BACK BUTTON (বেক বাটন - ChevronLeft, কালো কালার, কোনো বর্ডার ছাড়া) */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shrink-0 border-0 outline-none"
              title="ফিরে যান"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-slate-900 dark:text-white" />
              <span className="hidden xs:inline text-slate-900 dark:text-white">ফিরে যান</span>
            </button>

            {/* CENTER: কোর্স হলে সম্পূর্ণ ফ্রি কোর্স বা প্রিমিয়াম কোর্স (কালো আইকন ও টেক্সট) */}
            <div className="flex items-center justify-center min-w-0">
              <SinglePromoBadgeView 
                item={{ id: course.id, title: course.title, price: course.price, isFree: course.isFree, offerBadge: (course as any).offerBadge }} 
                itemType="course" 
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
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
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

          {/* Clean Course Banner Image */}
          <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />

            {/* Meta stats directly on the photo (Above title) - 1 Single Line */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 sm:p-3 z-20 flex items-center flex-nowrap overflow-x-auto scrollbar-none gap-2 text-[11px] sm:text-xs text-white/90 whitespace-nowrap">
              <span className="inline-flex items-center gap-1 font-bold text-amber-400 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{course.rating}</span>
                <span className="text-white/70 font-normal">({course.reviewsCount || 45})</span>
              </span>
              <span className="text-white/40 shrink-0">·</span>
              <span className="font-medium text-white/95 shrink-0">
                {course.enrolledCount}+ শিক্ষার্থী
              </span>
              <span className="text-white/40 shrink-0">·</span>
              <span className="font-medium text-white/95 shrink-0">
                {course.duration}
              </span>
            </div>
          </div>

          {/* Header Outside/Below the Photo (Matching Digital Modal Style) */}
          <div className="p-3.5 sm:p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Title - Full display (টাইটেলের সাথে ডিজিটাল মার্কেটিং ক্যাটাগরি ট্যাগ থাকবে না) */}
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white leading-snug break-words" title={course.title}>
                {course.title}
              </h1>
            </div>
          </div>

          {/* Main Body */}
          <div className="p-3.5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Left Main Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Tabs Header */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold font-bengali overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#1DB954] text-[#1DB954]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                কোর্স ওভারভিউ
              </button>
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'curriculum'
                    ? 'border-[#1DB954] text-[#1DB954]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                কারিকুলাম ও লেসনস ({course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || course.lessonsCount})
              </button>
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading mb-2 text-slate-900 dark:text-white">
                    কোর্স বিবরণী
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-bengali whitespace-pre-line">
                    {course.description}
                  </p>
                </div>

                {/* What You Will Learn */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-bengali flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                    এই কোর্সে আপনি যা যা শিখবেন:
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bengali">
                    {course.whatYouWillLearn?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold font-heading mb-2 text-slate-900 dark:text-white">
                    প্রয়োজনীয় রিকোয়ারমেন্টস
                  </h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bengali space-y-1">
                    {course.requirements?.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Instructor Profile (Compact & Refined) */}
                <div className="p-3 sm:p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1DB954] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {course.instructor[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-[13px] font-bengali truncate">
                      কোর্স ট্রেইনার: {course.instructor}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-bengali truncate">
                      {course.instructorRole || "PTENit Senior Academic Specialist"}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Curriculum Tab Content */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                  কোর্স কারিকুলাম ও মডিউল
                </h3>

                {course.modules?.map((module) => {
                  const isOpen = openModuleId === module.id || openModuleId === '';
                  return (
                    <div
                      key={module.id}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/40"
                    >
                      <button
                        onClick={() => setOpenModuleId(isOpen ? 'none' : module.id)}
                        className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span className="font-bengali">{module.title}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="p-3 bg-white dark:bg-slate-900 space-y-2 border-t border-slate-200 dark:border-slate-800">
                          {module.lessons.map((lesson, lesIdx) => {
                            const cleanName = lesson.title ? lesson.title.replace(/^(?:Lesson|লেসন|ক্লাস|Class)\s*[\d০-৯]+\s*[:\-–]\s*/i, '').trim() : `লেসন ${lesIdx + 1}`;
                            const bNum = lesIdx + 1 < 10 ? `০${lesIdx + 1}` : `${lesIdx + 1}`;
                            return (
                              <div
                                key={lesson.id}
                                className="p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs sm:text-sm gap-2.5 shadow-sm"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[#1DB954] text-xs font-black shrink-0">
                                    SL {bNum}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-bengali leading-snug break-words block">
                                      {cleanName || lesson.title}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs shrink-0">
                                  {lesson.duration && <span className="font-mono text-[11px]">⏱ {lesson.duration}</span>}
                                  {lesson.isFreePreview ? (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                                      ফ্রি প্রিভিউ
                                    </span>
                                  ) : !isEnrolled ? (
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                  ) : (
                                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-[#1DB954] flex items-center justify-center">
                                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Action Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700/80 sticky top-4 space-y-5">
              
              {/* Pricing Box */}
              <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  কোর্স ফি
                </span>
                {course.isFree ? (
                  <div className="text-3xl font-black text-emerald-500 mt-1">
                    সম্পূর্ণ ফ্রি!
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-center gap-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-white font-heading">
                      ৳{course.discountPrice || course.price}
                    </span>
                    {course.discountPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ৳{course.price}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Course Package Perks */}
              <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300 font-bengali">
                <div className="flex items-center gap-2.5">
                  <PlayCircle className="w-4 h-4 text-[#1DB954]" />
                  <span>লাইফটাইম রেকর্ড কন্টেন্ট অ্যাক্সেস</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#1DB954]" />
                  <span>পিডিএফ ও সোর্স কোড রিসোর্স</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#1DB954]" />
                  <span>এসাইনমেন্ট ও কুইজ টেস্ট</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-[#1DB954]" />
                  <span>PTENit ভেরিফাইড কোর্স সার্টিফিকেট</span>
                </div>
              </div>

              {/* Primary Enrollment CTA Button - Standardized Gig Style */}
              <button
                onClick={handleEnrollClick}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold font-bengali text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 ${
                  isPendingApproval
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : isEnrolled
                    ? 'bg-[#15803d] hover:bg-[#166534]'
                    : 'bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d]'
                }`}
              >
                {isPendingApproval ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    <span>পেমেন্ট ভেরিফিকেশন অপেক্ষমান</span>
                  </>
                ) : isEnrolled ? (
                  <>
                    <BookOpen className="w-5 h-5" />
                    <span>পড়াশোনা শুরু করুন</span>
                  </>
                ) : course.isFree ? (
                  <span>বিনামূল্যে এনরোল করুন</span>
                ) : (
                  <>
                    <span>অর্ডার করুন</span>
                    <span className="opacity-60">•</span>
                    <span className="font-extrabold text-amber-200">
                      ৳{((course.discountPrice || course.price) ?? 0).toLocaleString('bn-BD')}
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

            </div>
          </div>

        </div>

      </div>
    </div>

      {/* 2-Step Enrollment & Payment Checkout Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-7 relative shadow-2xl space-y-5 text-slate-900 dark:text-white my-auto animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1 pt-1">
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-full inline-block">
                কোর্স এনরোলমেন্ট ও পেমেন্ট
              </span>
              <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 dark:text-white">
                {checkoutStep === 1 ? 'ধাপ ১: শিক্ষার্থীর যোগাযোগের তথ্য' : 'ধাপ ২: পেমেন্ট মেথড ও কনফার্মেশন'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali truncate max-w-md mx-auto">
                {course.title} — <span className="font-bold text-[#15803d] dark:text-[#1DB954]">৳{((course.discountPrice || course.price) ?? 0).toLocaleString('bn-BD')}</span>
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
                <span>শিক্ষার্থীর তথ্য</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (studentName.trim() && studentPhone.trim() && studentEmail.trim()) {
                    setCheckoutStep(2);
                  }
                }}
                disabled={!studentName.trim() || !studentPhone.trim() || !studentEmail.trim()}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  checkoutStep === 2
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs cursor-pointer'
                    : 'text-slate-400 dark:text-slate-500 disabled:opacity-50'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${checkoutStep === 2 ? 'bg-[#15803d] text-white' : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'}`}>
                  ২
                </span>
                <span>পেমেন্ট ও এক্টিভেশন</span>
              </button>
            </div>

            {/* Error Banner */}
            {paymentFormError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bengali flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span>{paymentFormError}</span>
              </div>
            )}

            {/* STEP 1: Student Information Form */}
            {checkoutStep === 1 && (
              <form onSubmit={handleProceedToPaymentStep} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                    শিক্ষার্থীর পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ সাকিব হাসান"
                    value={studentName}
                    onChange={e => {
                      setStudentName(e.target.value);
                      if (paymentFormError) setPaymentFormError(null);
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
                    placeholder="018XXXXXXXX"
                    value={studentPhone}
                    onChange={e => {
                      setStudentPhone(e.target.value);
                      if (paymentFormError) setPaymentFormError(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                    ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={studentEmail}
                    onChange={e => {
                      setStudentEmail(e.target.value);
                      if (paymentFormError) setPaymentFormError(null);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                  />
                </div>

                {/* Course Order Summary Pill */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <BookOpen className="w-4 h-4 text-[#15803d] shrink-0" />
                    <span className="truncate text-slate-600 dark:text-slate-300">{course.title}</span>
                  </div>
                  <span className="font-extrabold text-[#15803d] dark:text-[#1DB954] shrink-0 text-sm">
                    ৳{((course.discountPrice || course.price) ?? 0).toLocaleString('bn-BD')}
                  </span>
                </div>

                {/* Next Step Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl text-white font-bold font-bengali text-sm bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-2"
                >
                  <span>পরবর্তী ধাপ (পেমেন্ট নির্বাচন)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Payment Selection and TrxID Submission */}
            {checkoutStep === 2 && (
              <div className="space-y-4">
                {/* If Automated Mode is enabled by Admin, show Instant vs Manual Tab */}
                {siteSettings?.paymentAutomationMode === 'automated' && (
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setAutoPayTab('instant')}
                      className={`py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        autoPayTab === 'instant'
                          ? 'bg-[#15803d] text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" /> তাত্ক্ষণিক গেটওয়ে
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoPayTab('manual')}
                      className={`py-2 px-3 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        autoPayTab === 'manual'
                          ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" /> বিকাশ / নগদ (TrxID)
                    </button>
                  </div>
                )}

                {/* INSTANT AUTOMATED CHECKOUT VIEW */}
                {siteSettings?.paymentAutomationMode === 'automated' && autoPayTab === 'instant' ? (
                  <div className="space-y-4 py-2">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-800/40 to-emerald-500/5 border border-[#15803d]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#15803d] dark:text-[#1DB954] uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> স্বয়ংক্রিয় পেমেন্ট গেটওয়ে
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#15803d]/20 text-[#15803d] dark:text-[#1DB954] border border-[#15803d]/40">
                          তাৎক্ষণিক এক্সেস
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-bengali">
                        কোনো অপেক্ষার প্রয়োজন নেই! বিকাশ বা গেটওয়ের মাধ্যমে সরাসরি পেমেন্ট সম্পন্ন করলেই কোর্সটি <strong>স্বয়ংক্রিয়ভাবে সাথে সাথে আনলক</strong> হয়ে যাবে।
                      </p>
                      <div className="p-3 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs font-bengali">
                        <span className="text-slate-500 dark:text-slate-400">পরিশোধের পরিমাণ:</span>
                        <span className="text-lg font-black text-[#15803d] dark:text-[#1DB954]">৳{((course.discountPrice || course.price) ?? 0).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleInstantGatewayPayment}
                      disabled={isAutoProcessing}
                      className="w-full py-4 bg-[#15803d] hover:bg-[#166534] text-white font-black text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                    >
                      {isAutoProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>পেমেন্ট গেটওয়ে প্রক্রিয়াকরণ হচ্ছে ও কোর্স সক্রিয় করা হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>বিকাশ / গেটওয়ে দিয়ে এখনই পে করুন (৳{((course.discountPrice || course.price) ?? 0).toLocaleString('bn-BD')})</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>পূর্ববর্তী ধাপে ফিরে যান</span>
                    </button>
                  </div>
                ) : (
                  /* MANUAL TrxID FLOW */
                  <div className="space-y-4">
                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'bKash', color: 'bg-pink-600 text-white', label: 'bKash' },
                        { id: 'Nagad', color: 'bg-orange-600 text-white', label: 'Nagad' },
                        { id: 'Rocket', color: 'bg-purple-700 text-white', label: 'Rocket' },
                        { id: 'SSLCommerz', color: 'bg-slate-800 text-white', label: 'Bank' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`py-2 px-1 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                            paymentMethod === m.id
                              ? 'border-[#15803d] ring-2 ring-[#15803d]/40 bg-[#15803d]/10'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span className={`block py-1 rounded-lg ${m.color} text-[11px] mb-1 font-sans`}>{m.label}</span>
                          <span className="text-[10px] text-slate-500 block">{m.id === 'SSLCommerz' ? 'ব্যাংক' : m.id}</span>
                        </button>
                      ))}
                    </div>

                    {/* Compact Number Card with 1-Click Copy */}
                    {paymentMethod !== 'SSLCommerz' ? (
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0 ${
                            paymentMethod === 'bKash' ? 'bg-pink-600' :
                            paymentMethod === 'Nagad' ? 'bg-orange-600' : 'bg-purple-700'
                          }`}>
                            {paymentMethod === 'bKash' ? 'bK' : paymentMethod === 'Nagad' ? 'Nag' : 'Rk'}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                              {paymentMethod} পার্সোনাল/মার্চেন্ট নম্বর
                            </span>
                            <span className="font-mono font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-wide truncate block">
                              {paymentMethod === 'bKash'
                                ? (siteSettings?.bkashNumber || '01712345678')
                                : paymentMethod === 'Nagad'
                                ? (siteSettings?.nagadNumber || '01700000000')
                                : (siteSettings?.rocketNumber || '01900000000')}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyNumber(
                            paymentMethod === 'bKash'
                              ? (siteSettings?.bkashNumber || '01712345678')
                              : paymentMethod === 'Nagad'
                              ? (siteSettings?.nagadNumber || '01700000000')
                              : (siteSettings?.rocketNumber || '01900000000')
                          )}
                          className="px-3.5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm active:scale-95 shrink-0"
                        >
                          {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedNumber ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{siteSettings?.bankName || 'Dutch-Bangla Bank PLC'}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyNumber(siteSettings?.bankAccountNumber || '2181100098765')}
                            className="px-3 py-1.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                          >
                            {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedNumber ? 'কপি হয়েছে!' : 'A/C কপি'}</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 font-mono">
                          <p>হিসাব নম্বর: <strong className="text-slate-900 dark:text-white font-bold">{siteSettings?.bankAccountNumber || '2181100098765'}</strong></p>
                          <p>অ্যাকাউন্টের নাম: {siteSettings?.bankAccountName || 'PTENIT IT SOLUTIONS'}</p>
                          <p>শাখা: {siteSettings?.bankBranch || 'Uttara Branch'}</p>
                        </div>
                      </div>
                    )}

                    {/* Amount Display */}
                    <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">কোর্স পরিশোধযোগ্য ফি:</span>
                      <span className="font-black text-base text-[#15803d] dark:text-[#1DB954]">৳{((course.discountPrice || course.price) ?? 0).toLocaleString('bn-BD')}</span>
                    </div>

                    <form onSubmit={handleConfirmPayment} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                          আপনার প্রেরক মোবাইল নম্বর <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="018XXXXXXXX"
                          value={senderPhone}
                          onChange={e => {
                            setSenderPhone(e.target.value);
                            if (paymentFormError) setPaymentFormError(null);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1 font-bengali text-slate-700 dark:text-slate-300">
                          ট্রানজেকশন আইডি (TrxID) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: BK9X82M1A7"
                          value={transactionId}
                          onChange={e => {
                            setTransactionId(e.target.value);
                            if (paymentFormError) setPaymentFormError(null);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#15803d] dark:focus:border-[#1DB954] uppercase font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(1)}
                          className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>পূর্ববর্তী ধাপ</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="py-3 px-4 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>{isSubmitting ? 'পেমেন্ট হচ্ছে...' : 'অর্ডার সম্পন্ন করুন'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* Manual Payment Verification Pending Modal */}
      {paymentPendingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 dark:text-white text-center">
            
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-500 font-bold text-xs rounded-full">
                অপেক্ষমান (Pending)
              </span>
              <h3 className="text-xl font-bold font-heading">
                পেমেন্ট সম্পন্ন হয়েছে!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bengali leading-relaxed">
                আপনার পেমেন্ট তথ্য সফলভাবে গ্রহণ করা হয়েছে। অল্প সময়ের মধ্যে কোর্সটি সক্রিয় করা হবে।
              </p>
            </div>

            <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-xs space-y-2 font-bengali text-left border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center text-slate-500">
                <span>কোর্সের নাম:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{course.title}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>পরিশোধিত অংক:</span>
                <span className="font-bold text-[#1DB954]">৳{course.discountPrice || course.price}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>প্রেরক নম্বর:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{senderPhone || currentUser?.mobile || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>সময়:</span>
                <span className="font-bold text-amber-500">৫ - ১৫ মিনিট</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  setPaymentPendingModal(false);
                  onClose();
                }}
                className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-[#1DB954]/20"
              >
                ঠিক আছে
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
