import React, { useState } from 'react';
import {
  X,
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  PlayCircle,
  FileText,
  HelpCircle,
  Lock,
  ChevronDown,
  ShieldCheck,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Course } from '../types';

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
  const { courses, currentUser, enrollments, enrollCourse } = useData();

  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [openModuleId, setOpenModuleId] = useState<string>('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'SSLCommerz'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!courseId) return null;
  const course = courses.find(c => c.id === courseId);
  if (!course) return null;

  const isEnrolled = currentUser
    ? enrollments.some(e => e.userId === currentUser.id && e.courseId === course.id)
    : false;

  const handleEnrollClick = async () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }

    if (isEnrolled) {
      onStartLearning(course.id);
      onClose();
      return;
    }

    if (course.isFree) {
      setIsSubmitting(true);
      await enrollCourse(course.id);
      setIsSubmitting(false);
      onStartLearning(course.id);
      onClose();
    } else {
      setPaymentModalOpen(true);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone || !transactionId) {
      alert("অনুগ্রহ করে মোবাইল নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }

    setIsSubmitting(true);
    await enrollCourse(course.id, {
      method: paymentMethod,
      phone: senderPhone,
      txId: transactionId,
      amount: course.discountPrice || course.price
    });
    setIsSubmitting(false);
    setPaymentModalOpen(false);
    onStartLearning(course.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl my-auto text-slate-800 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1DB954] text-white text-xs font-bold uppercase">
                {course.category}
              </span>
              {course.isFree ? (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase">
                  ফ্রি কোর্স
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-bold uppercase">
                  প্রিমিয়াম কোর্স
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
              {course.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> {course.rating} ({course.reviewsCount || 45} রিভিউ)
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-[#1DB954]" /> {course.enrolledCount}+ এনরোল্ড স্টুডেন্ট
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#1DB954]" /> {course.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold font-bengali">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#1DB954] text-[#1DB954]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                ওভারভিউ (Overview)
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
                  <h3 className="text-lg font-bold font-heading mb-2 text-slate-900 dark:text-white">
                    কোর্স বিবরণী (Course Description)
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-bengali whitespace-pre-line">
                    {course.description}
                  </p>
                </div>

                {/* What You Will Learn */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-bengali flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
                    এই কোর্সে আপনি যা যা শিখবেন (What You Will Learn):
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bengali">
                    {course.whatYouWillLearn?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-base font-bold font-heading mb-2 text-slate-900 dark:text-white">
                    প্রয়োজনীয় রিকোয়ারমেন্টস (Requirements)
                  </h3>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-bengali space-y-1">
                    {course.requirements?.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Instructor Profile */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1DB954] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {course.instructor[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm font-bengali">
                      কোর্স ট্রেইনার: {course.instructor}
                    </h4>
                    <p className="text-xs text-slate-500 font-bengali">
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
                        <div className="p-3 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800">
                          {module.lessons.map((lesson) => (
                            <div key={lesson.id} className="py-2.5 px-2 flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2.5">
                                <PlayCircle className="w-4 h-4 text-[#1DB954] shrink-0" />
                                <span className="font-medium text-slate-800 dark:text-slate-200 font-bengali">
                                  {lesson.title}
                                </span>
                                {lesson.isFreePreview && (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                                    ফ্রি প্রিভিউ
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 text-xs">
                                <span>{lesson.duration}</span>
                                {!lesson.isFreePreview && !isEnrolled && (
                                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                                )}
                              </div>
                            </div>
                          ))}
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
            <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 sticky top-4 space-y-6">
              
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

              {/* Primary Enrollment CTA Button */}
              <button
                onClick={handleEnrollClick}
                disabled={isSubmitting}
                className={`w-full py-3.5 rounded-xl font-bold text-base text-white transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 ${
                  isEnrolled
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : course.isFree
                    ? 'bg-[#1DB954] hover:bg-emerald-500'
                    : 'bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-emerald-600'
                }`}
              >
                {isEnrolled ? (
                  <>
                    <BookOpen className="w-5 h-5" />
                    পড়াশোনা শুরু করুন
                  </>
                ) : course.isFree ? (
                  'Enroll Free (বিনামূল্যে যুক্ত হন)'
                ) : (
                  'Buy / Enroll Now (এখনই এনরোল করুন)'
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-slate-400 font-bengali flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" /> 100% সিকিউর এনরোলমেন্ট গ্যারান্টি
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Payment Gateway Modal for Paid Courses */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-6 text-slate-900 dark:text-white">
            
            <button
              onClick={() => setPaymentModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-[#1DB954]/20 text-[#1DB954] font-bold text-xs rounded-full">
                বাংলাদেশী পেমেন্ট মেথড
              </span>
              <h3 className="text-xl font-bold font-heading">
                কোর্স পেমেন্ট করুন
              </h3>
              <p className="text-xs text-slate-500 font-bengali">
                {course.title} — <span className="font-bold text-[#1DB954]">৳{course.discountPrice || course.price}</span>
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'bKash', color: 'bg-pink-600 text-white', label: 'bKash' },
                { id: 'Nagad', color: 'bg-orange-600 text-white', label: 'Nagad' },
                { id: 'Rocket', color: 'bg-purple-700 text-white', label: 'Rocket' },
                { id: 'SSLCommerz', color: 'bg-slate-800 text-white', label: 'Card' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`py-2 px-1 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    paymentMethod === m.id
                      ? 'border-[#1DB954] ring-2 ring-[#1DB954]/40 bg-[#1DB954]/10'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`block py-1 rounded-lg ${m.color} text-[11px] mb-1`}>{m.label}</span>
                  <span className="text-[10px] text-slate-500 block">{m.id}</span>
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs space-y-1 font-bengali text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Smartphone className="w-4 h-4 text-[#1DB954]" />
                {paymentMethod} মার্চেন্ট/পার্সোনাল নম্বর: <span className="text-[#1DB954]">01700-000000</span>
              </p>
              <p>১. আপনার মোবাইল অ্যাপ থেকে Send Money বা Payment করুন: ৳{course.discountPrice || course.price}</p>
              <p>২. নিচে প্রেরক মোবাইল নম্বর ও ট্রানজেকশন আইডি দিন।</p>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 font-bengali">
                  আপনার প্রেরক মোবাইল নম্বর (Sender Mobile Number)
                </label>
                <input
                  type="text"
                  required
                  placeholder="01812345678"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 font-bengali">
                  ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="BK9X82M1A7"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#1DB954] uppercase font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {isSubmitting ? 'পেমেন্ট ভেরিফাই হচ্ছে...' : 'পেমেন্ট জমা দিয়ে এনরোল করুন'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
