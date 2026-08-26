import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  PlusCircle,
  Plus,
  Search,
  Star,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  RotateCw,
  Folder,
  AlertCircle,
  Send,
  Building2,
  UserCheck,
  ShieldCheck,
  DollarSign,
  FileText,
  Paperclip,
  Pencil,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  Filter,
  X,
  BadgeCheck,
  Zap,
  Crown,
  Briefcase,
  BookOpen,
  LogIn,
  LogOut,
  GraduationCap,
  ShieldAlert,
  User,
  Code,
  Edit,
  Trash2,
  Eye,
  Share2,
  MapPin,
  Calendar,
  MessageCircle,
  Info,
  Wallet,
  Award,
  TrendingUp,
  ExternalLink,
  UploadCloud,
  Video,
  Image as ImageIcon,
  CheckCircle,
  Smartphone,
  CreditCard,
  Package,
  Lock,
  Layers,
  Compass,
  Banknote,
  Coins,
  Home,
  Store,
  Bell,
  Mail,
  Heart,
  Bookmark,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
  Globe,
  PhoneCall,
  Play,
  PlayCircle,
  BarChart2,
  MoreVertical,
  Bot,
  Receipt,
  Calculator,
  ScrollText,
  Copy,
  MessageSquare,
  Download,
  HelpCircle,
  FileCheck,
  Users,
  Volume2,
  VolumeX,
  Menu,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MarketplaceGig, MarketplaceJob, MarketplaceOrder } from '../types';
import { GigDetailPage } from './GigDetailPage';
import { GigCard } from './GigCard';
import { StudentDashboard } from './StudentDashboard';
import { CustomerDashboard } from './CustomerDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { MarketplaceMessengerView } from './MarketplaceMessengerView';

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function toBengaliOverview(numStr: string): string {
  return numStr.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
}

function fromBengaliOverview(str: string): string {
  let res = str;
  bengaliDigits.forEach((bDigit, idx) => {
    res = res.replaceAll(bDigit, englishDigits[idx]);
  });
  return res;
}

const AnimatedOverviewCounter: React.FC<{ value: string }> = ({ value }) => {
  const [displayStr, setDisplayStr] = useState('০');

  useEffect(() => {
    const isBengaliInput = /[০-৯]/.test(value);
    const normalizedValue = fromBengaliOverview(value);

    const match = normalizedValue.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayStr(value);
      return;
    }

    const prefix = match[1] || '';
    const rawNumStr = match[2].replace(/,/g, '');
    const targetNum = parseFloat(rawNumStr);
    const suffix = match[3] || '';

    if (isNaN(targetNum)) {
      setDisplayStr(value);
      return;
    }

    const duration = 2500;
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Smooth Ease Out curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easeProgress * targetNum);

      let formattedNum = currentNum.toLocaleString();
      if (isBengaliInput) {
        formattedNum = toBengaliOverview(formattedNum);
      }

      setDisplayStr(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        let finalNum = targetNum.toLocaleString();
        if (isBengaliInput) finalNum = toBengaliOverview(finalNum);
        setDisplayStr(`${prefix}${finalNum}${suffix}`);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <span>{displayStr}</span>;
};

interface MarketplaceSectionProps {
  setActiveTab?: (tab: string, category?: string, pushHistory?: boolean) => void;
  activeTab?: string;
  openAuthModal?: () => void;
  initialCategory?: string;
  onStartLearning?: (courseId: string, tabMode?: any, originCategory?: string) => void;
  onOpenDetail?: (courseId: string) => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ setActiveTab, activeTab = 'marketplace', openAuthModal, initialCategory, onStartLearning, onOpenDetail }) => {
  const {
    marketplaceUser,
    ptenitUser,
    demoLoginMarketplace,
    logoutMarketplace,
    updateMarketplaceProfile,
    gigs,
    jobs,
    proposals,
    marketplaceOrders,
    users,
    courses,
    enrollments,
    certificates,
    services,
    createGig,
    updateGig,
    deleteGig,
    createJob,
    submitProposal,
    acceptProposalAndCreateOrder,
    createDirectGigOrder,
    deliverMarketplaceOrder,
    requestOrderRevision,
    approveOrderAndReleaseEscrow,
    cancelMarketplaceOrder,
    updateMarketplaceOrderStatus,
    addMarketplaceOrder,
    payouts,
    requestTeacherPayout,
    notifications,
    isNotificationCenterOpen,
    isMessengerInboxOpen,
    openNotificationCenter,
    markNotificationRead,
    markAllNotificationsRead,
    sendCentralNotification,
    applyForMentorship,
    approveMentorApplication,
    rejectMentorApplication,
    directMessages,
    markDirectMessageRead,
    markAllDirectMessagesRead,
    openChatWindow,
    activeChatWindows,
    activeMessengerConversationId,
    setActiveMessengerConversationId,
    openMessengerInbox,
    sendDirectMessage,
    customerProjects,
    createCustomerProject,
    updateMarketplaceOrder,
    deleteMarketplaceOrder,
    addCourse,
    acceptCourseOffer,
    declineCourseOffer,
    createGoogleMeetCall
  } = useData();

  const allBuyerOrders = useMemo(() => {
    // Convert any customerProjects into MarketplaceOrder format if missing in marketplaceOrders
    const convertedCustProjects: MarketplaceOrder[] = (customerProjects || []).map(cp => {
      const existing = marketplaceOrders.find(o => o.id === cp.id || (o.title === cp.serviceTitle && o.buyerId === cp.customerId));
      if (existing) return null;
      return {
        id: cp.id,
        type: 'custom_agency_order',
        title: cp.serviceTitle || 'পাবলিক প্রজেক্ট অফার',
        category: cp.category || 'কাস্টম পাবলিক অফার',
        buyerId: cp.customerId,
        buyerName: cp.customerName,
        buyerEmail: cp.customerEmail,
        buyerPhone: cp.customerPhone,
        sellerId: cp.assignedStaff || 'pending_expert',
        sellerName: cp.assignedStaff || 'সকল এক্সপার্টদের অফার রিসিভড অপেক্ষমান',
        sellerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        isInternalStaff: true,
        packageType: 'Custom',
        amount: cp.priceEstimate || 15000,
        adminCommission: Math.round((cp.priceEstimate || 15000) * 0.1),
        sellerPayout: Math.round((cp.priceEstimate || 15000) * 0.9),
        paymentMethod: 'PTEN IT Official Escrow',
        transactionId: `TRX-PUBLIC-${cp.id.slice(-6)}`,
        status: cp.status === 'Completed' ? 'completed' : cp.status === 'Cancelled' ? 'cancelled' : cp.status === 'Under Testing' ? 'in_review' : cp.status === 'In Progress' ? 'in_progress' : 'pending_approval',
        deliveryNote: cp.description,
        createdAt: cp.createdAt,
        deadlineDate: cp.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        isPublicOffer: true,
        assignedExpert: cp.assignedStaff,
        reachCount: 42,
        likesCount: 14,
        budgetRange: cp.budgetRange || '৳১৫,০০০ - ৳৩০,০০০'
      };
    }).filter(Boolean) as MarketplaceOrder[];

    const combined = [...marketplaceOrders, ...convertedCustProjects];
    if (combined.length === 0) {
      return [
        {
          id: 'ord-demo-101',
          type: 'gig_order',
          title: 'ফুল স্ট্যাক ই-কমার্স ওয়েবসাইট ও কাস্টম পেমেন্ট গেটওয়ে ডেভেলপমেন্ট',
          category: 'Programming & Tech',
          buyerId: currentUser?.id || 'buyer-1',
          buyerName: currentUser?.name || 'বায়ার',
          buyerEmail: currentUser?.email || 'buyer@ptenit.com',
          sellerId: 'seller-1',
          sellerName: 'সোরাব হোসেন (Senior Web Dev)',
          sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
          packageType: 'Standard',
          amount: 12000,
          adminCommission: 1200,
          sellerPayout: 10800,
          paymentMethod: 'bKash Escrow Security',
          transactionId: 'TRX-BK8839210',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          deadlineDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'ord-demo-102',
          type: 'gig_order',
          title: 'মডার্ন ইউআই/ইউএক্স (UI/UX) মোবাইল অ্যাপ ডিজাইন & ফিগমা সোর্স ফাইল',
          category: 'Graphics & Design',
          buyerId: currentUser?.id || 'buyer-1',
          buyerName: currentUser?.name || 'বায়ার',
          buyerEmail: currentUser?.email || 'buyer@ptenit.com',
          sellerId: 'seller-2',
          sellerName: 'তানজিলা ইসলাম (UI/UX Designer)',
          sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          packageType: 'Premium',
          amount: 8500,
          adminCommission: 850,
          sellerPayout: 7650,
          paymentMethod: 'Nagad Escrow Security',
          transactionId: 'TRX-NG9921104',
          status: 'in_review',
          deliveryNote: 'আপনার অ্যান্ড্রয়েড ও আইওএস মোবাইল অ্যাপের সমস্ত স্ক্রিন ডিজাইন সম্পূর্ণ করে ফিগমা (Figma) লিঙ্ক এবং ডিজাইন গাইডলাইন ফাইল অ্যাটাচ করে দেওয়া হলো। দয়া করে রিভিউ করে এস্ক্রো ফান্ড রিলিজ করুন।',
          createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
          deadlineDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'ord-demo-103',
          type: 'gig_order',
          title: 'ফেসবুক ও গুগল এডস ক্যাম্পেইন সেটআপ এবং ১০০% অর্গানিক এসইও',
          category: 'Digital Marketing',
          buyerId: currentUser?.id || 'buyer-1',
          buyerName: currentUser?.name || 'বায়ার',
          buyerEmail: currentUser?.email || 'buyer@ptenit.com',
          sellerId: 'seller-3',
          sellerName: 'আরিফুল ইসলাম (Growth Marketer)',
          sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          packageType: 'Basic',
          amount: 5000,
          adminCommission: 500,
          sellerPayout: 4500,
          paymentMethod: 'Bank Escrow Security',
          transactionId: 'TRX-BK1002341',
          status: 'completed',
          createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
          deadlineDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0]
        }
      ];
    }
    return combined;
  }, [marketplaceOrders, customerProjects]);

  const currentUser = marketplaceUser || ptenitUser;
  const offeredCourses = useMemo(() => {
    return (courses || []).filter(c => c.offerStatus === 'offered');
  }, [courses]);
  const userEnrollments = useMemo(() => {
    if (!currentUser) return enrollments || [];
    const matched = (enrollments || []).filter(e => e.userId === currentUser.id || e.studentId === currentUser.id);
    return matched.length > 0 ? matched : (enrollments || []);
  }, [enrollments, currentUser]);

  const studentEnrolledCourses = useMemo(() => {
    const enrolledMap = new Map<string, any>();
    (userEnrollments || []).forEach(e => {
      enrolledMap.set(e.courseId, e);
    });

    const listFromDb = (courses || [])
      .filter(c => enrolledMap.has(c.id))
      .map(c => {
        const enr = enrolledMap.get(c.id);
        const progress = enr?.progress ?? 0;
        const totalLessons = c.lessonsCount || (c.modules ? c.modules.reduce((acc: number, m: any) => acc + (m.lessons ? m.lessons.length : 0), 0) : 20) || 20;
        const completedLessons = enr?.completedLessons?.length ?? Math.round((progress / 100) * totalLessons);
        return {
          id: c.id,
          title: c.title,
          coverImage: c.thumbnail || (c as any).coverImage || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
          instructor: c.instructor || 'PTEN IT Certified Trainer',
          instructorRole: c.instructorRole || 'Lead Technical Instructor',
          batch: c.batch || (progress === 100 ? 'ব্যাচ-০১ (সম্পন্ন)' : 'ব্যাচ-০২ (চলমান)'),
          progress: progress,
          completedLessons: completedLessons,
          totalLessons: totalLessons,
          badge: c.category || 'Professional',
          enrolledDate: enr?.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : 'চলমান',
          isLive: progress < 100,
          liveSchedule: c.liveSchedule || (progress === 100 ? 'কোর্স সম্পন্ন (আর্কাইভ লাইভ)' : 'প্রতি মঙ্গল ও শুক্র রাত ৯:০০ টা')
        };
      });

    if (listFromDb.length > 0) {
      return listFromDb;
    }

    const standardProCourses = [
      {
        id: 'course-canva',
        title: 'Canva Design & Freelancing Masterclass',
        coverImage: courses.find(c => c.id === 'course-canva')?.thumbnail || 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
        instructor: 'তানভীর আহমেদ',
        instructorRole: 'Senior Graphic Designer & Freelancer',
        batch: 'ব্যাচ-০১ (সম্পন্ন)',
        progress: 100,
        completedLessons: 16,
        totalLessons: 16,
        badge: 'Graphic Design',
        enrolledDate: '১২ জানুয়ারি ২০২৬',
        isLive: false,
        liveSchedule: 'কোর্স সম্পন্ন (আর্কাইভ লাইভ)'
      },
      {
        id: 'course-yt-seo',
        title: 'YouTube SEO & Channel Growth Blueprint',
        coverImage: courses.find(c => c.id === 'course-yt-seo')?.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
        instructor: 'কাজী সোহাগ',
        instructorRole: 'Digital Marketing & SEO Specialist',
        batch: 'ব্যাচ-০২ (চলমান)',
        progress: 72,
        completedLessons: 15,
        totalLessons: 22,
        badge: 'SEO & Growth',
        enrolledDate: '১২ ফেব্রুয়ারি ২০২৬',
        isLive: true,
        liveSchedule: 'প্রতি রবি ও বৃহস্পতি রাত ৯:০০ টা'
      },
      {
        id: 'course-mern-pro',
        title: 'Full-Stack MERN & Next.js Pro Web Development',
        coverImage: courses.find(c => c.id === 'course-mern-pro')?.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        instructor: 'প্রকৌশলী আল-আমিন',
        instructorRole: 'Lead Full-Stack Architect',
        batch: 'ব্যাচ-০৮ (লাইভ)',
        progress: 80,
        completedLessons: 16,
        totalLessons: 20,
        badge: 'MERN Stack',
        enrolledDate: '১০ জুলাই ২০২৬',
        isLive: true,
        liveSchedule: 'প্রতি সোম ও বৃহস্পতি রাত ৯:০০ টা'
      }
    ];

    return standardProCourses;
  }, [userEnrollments, courses]);

  const studentCertificatesList = useMemo(() => {
    const userCerts = (certificates || []).filter(c => currentUser ? (c.studentId === currentUser.id || c.studentEmail === currentUser.email) : false);
    const defaultCerts = [
      {
        id: 'cert-1',
        title: 'ফুল স্ট্যাক MERN ডেভেলপমেন্ট মাস্টারক্লাস',
        certId: 'CERT-PTEN-MERN-8891',
        issueDate: '১৫ আগস্ট ২০২৬',
        grade: 'High Distinction (৯৮%)'
      },
      {
        id: 'cert-2',
        title: 'পাইথন ড্যাঙ্গো (Django) ও AI ব্যাকএন্ড ইঞ্জিনিয়ারিং',
        certId: 'CERT-PTEN-PY-4402',
        issueDate: '১০ জুলাই ২০২৬',
        grade: 'Distinction (৯৪%)'
      }
    ];
    if (userCerts.length > 0) {
      return [
        ...userCerts.map(c => ({
          id: c.id,
          title: c.courseName || 'PTENit Certified Professional Track',
          certId: c.certificateCode || `PTEN-CERT-${c.id}`,
          issueDate: c.issueDate || 'চলমান মাস',
          grade: 'Grade A+ (Verified)'
        })),
        ...defaultCerts
      ];
    }
    return defaultCerts;
  }, [certificates, currentUser]);

  const [submittedTasksList, setSubmittedTasksList] = useState([
    {
      id: 'task-1',
      title: 'E-Commerce REST API & Redux Toolkit Integration',
      course: 'Full-Stack MERN & Next.js Pro',
      courseName: 'Full-Stack MERN & Next.js Pro',
      courseId: 'course-mern-pro',
      marks: '৯৮/১০০ (A+ Grade)',
      status: 'completed',
      date: '১৮ আগস্ট ২০২৬',
      totalMarks: '১০০ মার্কস',
      passMarks: '৭০ মার্কস',
      repo: 'https://github.com/student-demo/mern-ecommerce-redux',
      note: 'সম্পূর্ণ টেস্ট কেস সহ সব এন্ডপয়েন্ট পোস্টম্যানে ভেরিফাই করা হয়েছে।',
      description: 'রেডুএক্স টুলকিট ও এক্সপ্রেস নোড ব্যাকএন্ড দিয়ে ফুল স্ট্যাক ক্যাটাগরি, প্রোডাক্ট ও কার্ট এপিআই সমাধান।',
      requirements: [
        'JWT অথেন্টিকেশন ও প্রোটেক্টেড রুট ইমপ্লিমেন্টেশন।',
        'Redux Toolkit AsyncThunk দিয়ে স্টেট সিঙ্ক্রোনাইজেশন।',
        'মঙ্গোডিবি Aggregation Pipeline ব্যবহার করে ফিল্টারিং।'
      ],
      feedback: 'চমৎকার ব্যাকএন্ড আর্কিটেকচার এবং ক্লিন রিডাক্স স্লাইস মেথডোলজি ব্যবহার করা হয়েছে।'
    },
    {
      id: 'task-2',
      title: 'Real-time Socket.io Chat & Notification Service',
      course: 'Full-Stack MERN & Next.js Pro',
      courseName: 'Full-Stack MERN & Next.js Pro',
      courseId: 'course-mern-pro',
      marks: 'রিভিউর অপেক্ষায়',
      status: 'pending',
      date: '২০ আগস্ট ২০২৬',
      totalMarks: '৫০ মার্কস',
      passMarks: '৩৫ মার্কস',
      repo: 'https://github.com/student-demo/socket-live-messaging',
      note: 'রুম ব্রডকাস্টিং এবং মেসেজ হিস্ট্রি মঙ্গোডিবির সাথে সিঙ্ক করা হয়েছে।',
      description: 'রিয়েলটাইম দ্বিমুখী চ্যাট ও নোটিফিকেশন সিস্টেম ইমপ্লিমেন্টেশন।',
      requirements: [
        'Socket.io হ্যান্ডশেক ও ইউজার রুম জয়েন হ্যান্ডলিং।',
        'অনলাইন/অফলাইন স্ট্যাটাস ও টাইপিং ইন্ডিকেটর।',
        'মেসেজ ব্যাকআপ ও রিয়েলটাইম অ্যালার্ট নোটিফিকেশন।'
      ],
      feedback: 'ইন্সট্রাকটর আল-আমিন কোড রিভিউ করছেন।'
    }
  ]);

  const [pendingAssignmentsList, setPendingAssignmentsList] = useState([
    {
      id: 'pending-1',
      title: 'মডিউল ৭: ইকমার্স শপিং কার্ট ও চেকআউট ইন্টিগ্রেশন প্রজেক্ট',
      courseId: 'course-mern-pro',
      courseName: 'Full Stack Web Development',
      deadline: 'আগামীকাল রাত ১১:৫৯',
      badge: 'জরুরি',
      totalMarks: '৫০ মার্কস',
      passMarks: '৩৫ মার্কস',
      description: 'একটি সম্পূর্ণ রেসপন্সিভ ই-কমার্স শপিং কার্ট এবং চেকআউট ফ্লো তৈরি করতে হবে যেখানে ইউজার প্রোডাক্ট অ্যাড, কোয়ান্টিটি পরিবর্তন, কুপন ডিসকাউন্ট প্রয়োগ এবং ডেমো পেমেন্ট সম্পন্ন করতে পারবে।',
      requirements: [
        'কমপক্ষে ৫টি প্রোডাক্ট লিস্ট ভিউ এবং সিঙ্গেল প্রোডাক্ট বিবরণী তৈরি করা।',
        'অ্যাড টু কার্ট, আইটেম সংখ্যা বৃদ্ধি/হ্রাস ও রিমুভ করার স্টেট ম্যানেজমেন্ট।',
        'সাবটোটাল, ভ্যাট/ট্যাক্স এবং কুপন কোড ডিসকাউন্ট রিয়েলটাইম ক্যালকুলেশন।',
        'গিটহাবে অন্তত ৩টি অর্থপূর্ণ কমিট এবং Vercel/Netlify লাইভ প্রিভিউ লিংক।'
      ],
      submissionGuide: 'গিটহাব পাবলিক রিপোজিটরি লিংক অথবা লাইভ হোস্টেড প্রজেক্ট লিংক প্রদান করুন।'
    },
    {
      id: 'pending-2',
      title: 'মডিউল ৪: ফেসবুক কনভার্সন পিক্সেল ও কাস্টম অডিয়েন্স ক্যাম্পেইন',
      courseId: 'course-fb-marketing',
      courseName: 'Facebook Marketing & Paid Ads',
      deadline: '২৮ আগস্ট ২০২৬',
      badge: 'নিয়মিত',
      totalMarks: '৫০ মার্কস',
      passMarks: '৩৫ মার্কস',
      description: 'মেটা বিজনেস ম্যানেজারে কনভার্সন পিক্সেল ও কাস্টম অডিয়েন্স স্ট্র্যাটেজি তৈরি করে জমা দিতে হবে। বিভিন্ন ফানেল স্টেজ অনুযায়ী ক্যাম্পেইন স্ট্রাকচার সাজাতে হবে।',
      requirements: [
        'ওয়েবসাইটে মেটা পিক্সেল ও স্ট্যান্ডার্ড ইভেন্ট সেটআপের স্ক্রিনশট।',
        'কাস্টম অডিয়েন্স ও ৩% লুক-অ্যালাইক অডিয়েন্স তৈরির প্রমাণপত্র।',
        'অ্যাড কপি, হেডলাইন, ক্রিয়েটিভ ব্যানার এবং প্লেসমেন্ট স্ট্র্যাটেজি।',
        'গুগল ডক বা ড্রাইভ ফোল্ডার লিংক (ভিউয়ার এক্সেস সহ)।'
      ],
      submissionGuide: 'গুগল ড্রাইভ বা ডক লিংক (সবার জন্য ভিউ পারমিশন ওপেন রেখে) জমা দিন।'
    }
  ]);
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<'new' | 'review' | 'success'>('new');
  const [selectedAssignmentDetail, setSelectedAssignmentDetail] = useState<{
    id?: string;
    title: string;
    courseName?: string;
    course?: string;
    courseId?: string;
    deadline?: string;
    badge?: string;
    totalMarks?: string;
    passMarks?: string;
    description?: string;
    requirements?: string[];
    submissionGuide?: string;
    status?: 'new' | 'pending' | 'completed';
    marks?: string;
    feedback?: string;
    date?: string;
    repo?: string;
    note?: string;
  } | null>(null);
  const [assignmentSubmissionRepo, setAssignmentSubmissionRepo] = useState('');
  const [assignmentSubmissionNote, setAssignmentSubmissionNote] = useState('');
  const demoLogin = demoLoginMarketplace;
  const logout = logoutMarketplace;
  const updateProfile = updateMarketplaceProfile;

  const [activeSubTab, setActiveSubTab] = useState<'gigs' | 'jobs' | 'courses' | 'post-job' | 'my-orders' | 'ptenit-services' | 'overview' | 'my-courses' | 'saved_gigs' | 'settings' | 'messenger'>(() => {
    if (initialCategory === 'my-courses') return 'my-courses';
    if (initialCategory === 'my-orders' || initialCategory === 'My Orders') return 'my-orders';
    if (initialCategory === 'courses') return 'courses';
    if (initialCategory === 'gigs' || initialCategory === 'All') return 'gigs';
    return 'my-courses';
  });
  const [studentHubActiveTab, setStudentHubActiveTab] = useState<'my-courses' | 'certificates' | 'assignments' | 'live-classes' | 'ai-tutor'>('my-courses');
  const [studentCourseFilter, setStudentCourseFilter] = useState<'all' | 'in_progress' | 'completed' | 'live'>('all');
  const [studentCourseSearch, setStudentCourseSearch] = useState('');
  const [newAssignmentText, setNewAssignmentText] = useState('');
  const [newAssignmentRepo, setNewAssignmentRepo] = useState('');
  const [newAssignmentCourseId, setNewAssignmentCourseId] = useState('course-mern-pro');
  const [orderHubTab, setOrderHubTab] = useState<'overview' | 'orders' | 'courses'>(() => {
    if (initialCategory === 'my-orders' || initialCategory === 'My Orders') return 'orders';
    if (initialCategory === 'overview') return 'overview';
    return 'courses';
  });
  const [overviewInnerTab, setOverviewInnerTab] = useState<'all' | 'courses' | 'orders'>('all');
  const [buyerOrderStatusFilter, setBuyerOrderStatusFilter] = useState<'all' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'public_projects'>('public_projects');
  const [messengerSubTabFilter, setMessengerSubTabFilter] = useState<'all' | 'sellers' | 'online' | 'orders'>('all');
  const [isMessengerSearchActive, setIsMessengerSearchActive] = useState(false);
  const [messengerSearchQuery, setMessengerSearchQuery] = useState('');
  const [isOrderSearchActive, setIsOrderSearchActive] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const activeMessengerUser = useMemo(() => {
    if (!activeMessengerConversationId) return null;
    const win = activeChatWindows?.find(w => w.id === activeMessengerConversationId);
    if (win) {
      return {
        name: win.senderName,
        avatar: win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        role: win.senderRole || 'ভেরিফাইড সেলার'
      };
    }
    const defaultContacts: Record<string, { name: string; avatar: string; role: string }> = {
      'chat-tanvir-ahmed': { name: 'Tanvir Ahmed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', role: 'Top Rated • Full-Stack Web' },
      'chat-creative-pixels': { name: 'Creative Pixels Agency', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', role: 'Level 2 • UI/UX Designer' },
      'chat-piten-support': { name: 'PiTen Marketplace Official', avatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=120&q=80', role: 'অফিসিয়াল সাপোর্ট ও এসক্রো সিকিউরিটি' },
      'chat-shahinur-rahman': { name: 'Shahinur Rahman', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', role: 'Pro Seller • React & Node Specialist' },
      'chat-zubair-hossain': { name: 'Zubair Hossain', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', role: 'Level 2 • Mobile App Dev' },
      'chat-sadia-afrin': { name: 'Sadia Afrin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', role: 'Top Rated • SEO & Marketing' },
      'chat-mouson-art': { name: 'Mouson Branding Studio', avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=120&q=80', role: 'Level 2 • Logo & Graphics' },

      'convo-1': { name: 'Tanvir Ahmed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', role: 'Top Rated • Full-Stack Web' },
      'convo-2': { name: 'Creative Pixels Agency', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', role: 'Level 2 • UI/UX Designer' },
      'convo-3': { name: 'PiTen Marketplace Official', avatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=120&q=80', role: 'Official Support & Escrow' },
      'convo-4': { name: 'Shahinur Rahman', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', role: 'Pro Seller • React & Node' },
      'convo-5': { name: 'Zubair Hossain', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', role: 'Level 2 • Mobile App Dev' }
    };
    return defaultContacts[activeMessengerConversationId] || { name: 'মার্কেটপ্লেস চ্যাট', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', role: 'অনলাইন' };
  }, [activeMessengerConversationId, activeChatWindows]);
  const [sellerOrderFilter, setSellerOrderFilter] = useState<'all' | 'pending' | 'in_progress' | 'in_review' | 'completed'>('all');

  // Public Project Post Modal States
  const [detailsModalOrder, setDetailsModalOrder] = useState<any | null>(null);
  const [payReleaseModalOrder, setPayReleaseModalOrder] = useState<any | null>(null);
  const [releaseRating, setReleaseRating] = useState<number>(5);
  const [releaseReviewText, setReleaseReviewText] = useState<string>("খুবই চমৎকার ও মানসম্মত কাজ পেয়েছি! ধন্যবাদ সেলারকে।");
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);
  const [isReleaseSuccessToast, setIsReleaseSuccessToast] = useState(false);
  const [isPostProjectModalOpen, setIsPostProjectModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [isPaymentStepOpen, setIsPaymentStepOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [postOfferType, setPostOfferType] = useState<'work_first' | 'paid'>('work_first');
  const [minBudget, setMinBudget] = useState('500');
  const [maxBudget, setMaxBudget] = useState('1000');
  const [postCategory, setPostCategory] = useState('Web Development');
  const [postBudget, setPostBudget] = useState('৳১৫,০০০ - ৳৩০,০০০');
  const [postDescription, setPostDescription] = useState('');
  const [postAttachmentName, setPostAttachmentName] = useState('');
  const [postAttachmentUrl, setPostAttachmentUrl] = useState('');
  const [postSubmittedSuccess, setPostSubmittedSuccess] = useState(false);

  const publishProjectNow = (forcedOfferType?: "work_first" | "paid") => {
    const computedBudget = `৳${minBudget} - ৳${maxBudget}`;
    const finalType = forcedOfferType || postOfferType;
    const isWorkFirst = finalType === "work_first";
    createCustomerProject({
      customerId: currentUser?.id || "cust-1",
      offerType: finalType,
      isWorkFirst: isWorkFirst,
      customerName: currentUser?.name || "Customer",
      customerEmail: currentUser?.email || "customer@ptenit.com",
      customerPhone: currentUser?.mobile || "01700000000",
      serviceTitle: postTitle,
      category: postCategory,
      description: postDescription,
      budgetRange: computedBudget,
      attachmentName: postAttachmentName,
      attachmentUrl: postAttachmentUrl
    });
    setIsPaymentStepOpen(false);
    setPostSubmittedSuccess(true);
    setTimeout(() => {
      setPostSubmittedSuccess(false);
      setIsPostProjectModalOpen(false);
      setPostTitle("");
      setPostDescription("");
      setPostAttachmentName("");
      setPostAttachmentUrl("");
      setBuyerOrderStatusFilter("public_projects");
      if (activeSubTab !== "my-orders") {
        setActiveSubTab("my-orders");
      }
    }, 1800);
  };

  const handlePostProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postDescription) return;

    if (postOfferType === "work_first" && isSubscribed) {
      publishProjectNow("work_first");
    } else {
      setIsPaymentStepOpen(true);
    }
  };

  // 3-Dot Menu & Post Management States
  const [open3DotMenuId, setOpen3DotMenuId] = useState<string | null>(null);
  
  // Edit Post Modal State
  const [editingOrder, setEditingOrder] = useState<MarketplaceOrder | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editAmount, setEditAmount] = useState<number>(15000);
  const [editDescription, setEditDescription] = useState('');

  // Raise / Increase Budget State
  const [raisingBudgetOrder, setRaisingBudgetOrder] = useState<MarketplaceOrder | null>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState<number>(20000);
  const [newBudgetRange, setNewBudgetRange] = useState<string>('৳২০,০০০ - ৳৩৫,০০০');

  // Delete Post Confirmation State
  const [deletingOrder, setDeletingOrder] = useState<MarketplaceOrder | null>(null);

  // Toggle Like Handler
  const handleToggleLikeOrder = (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = allBuyerOrders.find(o => o.id === orderId);
    if (!target) return;
    const isLiked = !target.isLikedByBuyer;
    const currentLikes = target.likesCount || 12;
    const updatedLikes = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    updateMarketplaceOrder(orderId, {
      isLikedByBuyer: isLiked,
      likesCount: updatedLikes
    });
  };

  // Open Edit Modal Handler
  const handleOpenEditModal = (ord: MarketplaceOrder) => {
    setEditingOrder(ord);
    setEditTitle(ord.title);
    setEditCategory(ord.category || 'Web Development');
    setEditBudget(ord.budgetRange || '৳১৫,০০০ - ৳৩০,০০০');
    setEditAmount(ord.amount || 15000);
    setEditDescription(ord.deliveryNote || '');
    setOpen3DotMenuId(null);
  };

  // Save Edit Handler
  const handleSaveEditOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateMarketplaceOrder(editingOrder.id, {
      title: editTitle,
      category: editCategory,
      budgetRange: editBudget,
      amount: editAmount,
      sellerPayout: Math.round(editAmount * 0.9),
      adminCommission: Math.round(editAmount * 0.1),
      deliveryNote: editDescription
    });
    setEditingOrder(null);
  };

  // Open Raise Budget Modal
  const handleOpenRaiseBudgetModal = (ord: MarketplaceOrder) => {
    setRaisingBudgetOrder(ord);
    const currAmount = ord.amount || 15000;
    setNewBudgetAmount(currAmount + 5000);
    setNewBudgetRange(ord.budgetRange || '৳২০,০০০ - ৳৩৫,০০০');
    setOpen3DotMenuId(null);
  };

  // Save Raised Budget Handler
  const handleSaveRaiseBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raisingBudgetOrder) return;
    updateMarketplaceOrder(raisingBudgetOrder.id, {
      amount: newBudgetAmount,
      budgetRange: newBudgetRange,
      sellerPayout: Math.round(newBudgetAmount * 0.9),
      adminCommission: Math.round(newBudgetAmount * 0.1)
    });
    setRaisingBudgetOrder(null);
  };

  // Confirm Delete Handler
  const handleConfirmDeleteOrder = () => {
    if (!deletingOrder) return;
    deleteMarketplaceOrder(deletingOrder.id);
    setDeletingOrder(null);
    setOpen3DotMenuId(null);
  };
  const [expandedBuyerOrders, setExpandedBuyerOrders] = useState<{ [orderId: string]: boolean }>({});
  const [expandedSellerOrders, setExpandedSellerOrders] = useState<{ [orderId: string]: boolean }>({});
  const [orderProgressNote, setOrderProgressNote] = useState<{ [orderId: string]: string }>({});
  const [readOrderIds, setReadOrderIds] = useState<{ [orderId: string]: boolean }>({});
  const [deliveringOrder, setDeliveringOrder] = useState<any | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryFileUrl, setDeliveryFileUrl] = useState('');
  const [deliveryFileName, setDeliveryFileName] = useState('');
  const [outsourceOrderModal, setOutsourceOrderModal] = useState<any | null>(null);
  const [outsourceCommPercent, setOutsourceCommPercent] = useState<number>(20);
  const [outsourceTargetName, setOutsourceTargetName] = useState('পাবলিক ফ্রিল্যান্সার হাব');
  const [outsourceNote, setOutsourceNote] = useState('');
  const [viewMode, setViewMode] = useState<'buying' | 'selling'>('buying');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Sync search state to instantly show results
  useEffect(() => {
    if (searchQuery.trim()) {
      if (selectedGig) setSelectedGig(null);
      if (activeSubTab !== 'gigs') setActiveSubTab('gigs');
      if (viewMode !== 'buying') setViewMode('buying');
    }
  }, [searchQuery]);
  const [isMobileMarketplaceMenuOpen, setIsMobileMarketplaceMenuOpen] = useState(false);
  const [priceRangeFilter, setPriceRangeFilter] = useState<'all' | 'under3k' | '3k-10k' | '10k-30k' | 'over30k'>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<'any' | '1day' | '3days' | '7days'>('any');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);
  const [isMobileCatSheetOpen, setIsMobileCatSheetOpen] = useState(false);
  const [isMobileFilterSheetOpen, setIsMobileFilterSheetOpen] = useState(false);

  // Dynamic Live Class Schedule State per course
  const [courseLiveSchedules, setCourseLiveSchedules] = useState<{ [id: string]: string }>({
    'course-mern-pro': 'আজ: রাত ৯টায়',
    'course-python-ai': 'আগামীকাল রাত ৮টায়',
    'course-flutter-app': 'প্রতি শনি-বুধ রাত ৯টায়'
  });
  const [editingLiveScheduleCourseId, setEditingLiveScheduleCourseId] = useState<string | null>(null);
  const [tempLiveScheduleText, setTempLiveScheduleText] = useState<string>('');
  const [activeMarketplaceCourseModal, setActiveMarketplaceCourseModal] = useState<{
    courseTitle: string;
    courseId?: string;
    coverImage?: string;
    instructor?: string;
    instructorRole?: string;
    batch?: string;
    badge?: string;
    progress?: number;
    completedLessons?: number;
    totalLessons?: number;
    activeLessonIndex?: number;
    activeLessonTitle?: string;
    featureType: 'video' | 'certificate' | 'source_code' | 'live_class' | 'quiz' | 'qna' | 'syllabus' | 'assignment';
    featureTitle: string;
  } | null>(null);

  // Dedicated Course Learning Studio States
  const [courseIsPlaying, setCourseIsPlaying] = useState(false);
  const [coursePlaybackSpeed, setCoursePlaybackSpeed] = useState<number>(1);
  const [activeCourseLessonNumber, setActiveCourseLessonNumber] = useState<number>(17);
  const [courseCompletedLessonsMap, setCourseCompletedLessonsMap] = useState<{ [key: string]: boolean }>({
    '1': true, '2': true, '3': true, '4': true, '5': true, '6': true, '7': true, '8': true, '9': true, '10': true, '11': true, '12': true, '13': true, '14': true, '15': true, '16': true
  });
  const [aiTutorInput, setAiTutorInput] = useState('');
  const [aiTutorMessages, setAiTutorMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'স্বাগতম! আমি আপনার AI লার্নিং টিউটর। এই কোর্সের যেকোনো কোডিং, ডেবক্স বা টেকনিক্যাল সমস্যা নিয়ে প্রশ্ন করতে পারেন।' }
  ]);
  const [isAiTutorThinking, setIsAiTutorThinking] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [assignmentRepoLink, setAssignmentRepoLink] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [assignmentSubmittedMap, setAssignmentSubmittedMap] = useState<{ [key: string]: boolean }>({
    'asg-1': true
  });

  const getTimeAgoBengali = (dateString?: string) => {
    if (!dateString) return 'এখনই';
    const createdTime = new Date(dateString).getTime();
    if (isNaN(createdTime) || createdTime <= 0) return 'আজকে';
    
    const diffSeconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
    if (diffSeconds < 60) return 'এখনই (১ মিনিটের কম আগে)';
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes.toLocaleString('bn-BD')} মিনিট আগে`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours.toLocaleString('bn-BD')} ঘণ্টা আগে`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays.toLocaleString('bn-BD')} দিন আগে`;
  };

  // Auto-hide filter bar smoothly on scroll down, show on scroll up (with hysteresis to prevent flickering)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Avoid triggering toggle when close to the top of the page
          if (currentScrollY < 220) {
            setIsFilterBarVisible(true);
          } else {
            // Require a minimum scroll delta of 25px to prevent flickering
            const delta = currentScrollY - lastScrollY;
            if (delta > 25) {
              setIsFilterBarVisible(false);
            } else if (delta < -20) {
              setIsFilterBarVisible(true);
            }
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Whenever initialCategory or marketplace route is navigated to, sync viewMode and subTabs
  useEffect(() => {
    if (initialCategory === 'selling' || initialCategory === 'seller') {
      setViewMode('selling');
    } else {
      setViewMode('buying');
    }

    if (initialCategory === 'my-orders' || initialCategory === 'My Orders') {
      setActiveSubTab('my-orders');
      setOrderHubTab('orders');
      setSelectedGig(null);
    } else if (initialCategory === 'overview') {
      setActiveSubTab('overview');
      setSelectedGig(null);
    } else if (initialCategory === 'my-courses') {
      setActiveSubTab('my-courses');
      setOrderHubTab('courses');
      setStudentHubActiveTab('my-courses');
      setSelectedGig(null);
    } else if (initialCategory === 'saved_gigs') {
      setActiveSubTab('saved_gigs');
      setSelectedGig(null);
    } else if (initialCategory === 'courses') {
      setActiveSubTab('courses');
      setSelectedGig(null);
    } else if (initialCategory === 'gigs' || initialCategory === 'All') {
      setActiveSubTab('gigs');
      setSelectedCategory('All');
      setSelectedGig(null);
    } else if (initialCategory && initialCategory !== 'selling' && initialCategory !== 'seller' && initialCategory !== 'buying' && initialCategory !== 'buyer') {
      setSelectedCategory(initialCategory);
      setActiveSubTab('gigs');
      setSelectedGig(null);
    }
  }, [initialCategory, currentUser?.role]);

  // Global marketplace internal navigation event listener (used by Messenger top bar and quick links)
  useEffect(() => {
    const handleMarketplaceNavigate = (e: any) => {
      const targetSubTab = e.detail?.subTab;
      if (targetSubTab) {
        setSelectedGig(null);
        setViewMode('buying');
        setActiveSubTab(targetSubTab);
        setIsInboxModalOpen(false);
        setIsNotificationsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('marketplace:navigate', handleMarketplaceNavigate);
    return () => window.removeEventListener('marketplace:navigate', handleMarketplaceNavigate);
  }, []);

  // Freelancer Free Tech Toolkit States
  const [activeToolkit, setActiveToolkit] = useState<'proposal' | 'invoice' | 'calculator' | 'contract'>('proposal');
  const [proposalJobTopic, setProposalJobTopic] = useState('');
  const [proposalResult, setProposalResult] = useState('');
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [proposalCopied, setProposalCopied] = useState(false);
  const [isToolkitSoundOn, setIsToolkitSoundOn] = useState(() => {
    try {
      const saved = localStorage.getItem('ptenit_toolkit_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound Synth for Toolkit Actions
  const playToolkitSound = (type: 'click' | 'success' | 'generate' | 'mute' | 'unmute' = 'click', forced: boolean = false) => {
    try {
      const saved = localStorage.getItem('ptenit_toolkit_sound');
      if (saved !== null && saved === 'false' && !forced) return;
    } catch {}
    if (!isToolkitSoundOn && !forced) return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) return;
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      
      const playNotes = () => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'unmute' || type === 'success') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'mute') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.start(now);
          osc.stop(now + 0.22);
        } else if (type === 'generate') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        }
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(() => playNotes()).catch(() => {});
      } else {
        playNotes();
      }
    } catch (e) {
      // Ignore audio autoplay restriction errors
    }
  };

  // Invoice tool states
  const [invClientName, setInvClientName] = useState('রহিম আহমেদ');
  const [invProjectName, setInvProjectName] = useState('Full Stack Web & Mobile App Development');
  const [invAmount, setInvAmount] = useState<number>(15000);

  // Escrow Calculator states
  const [calcGrossPrice, setCalcGrossPrice] = useState<number>(10000);

  const handleGenerateProposal = () => {
    if (!proposalJobTopic.trim()) return;
    setIsGeneratingProposal(true);
    playToolkitSound('generate');
    setTimeout(() => {
      setProposalResult(
        `Dear Hiring Manager,\n\nI saw your job post for "${proposalJobTopic}" and I am excited to help you achieve your goal! As a top-rated freelancer with over 5 years of expertise in ${editProfileSkills || 'Full Stack Web & UI/UX'}, I have built similar high-converting applications with 100% client satisfaction.\n\nHere is how I will execute your project:\n1. 🔍 Comprehensive Requirements & Architecture Plan\n2. 🎨 Pixel-Perfect UI/UX Design & Responsive Layout\n3. ⚡ High-Performance Clean Code Implementation\n4. 🛡️ Thorough Testing & 30-Day Post-Delivery Maintenance Support\n\nI can deliver this project within schedule. Let's discuss further in chat!\n\nBest regards,\n${currentUser?.name || 'Sohag Kazi'}\nBoss Freelancer Pro`
      );
      setIsGeneratingProposal(false);
      playToolkitSound('success');
    }, 500);
  };

  // Seller Workspace & Profile States (Specialist = Seller + Teacher)
  const [specialistMainTab, setSpecialistMainTab] = useState<'overview' | 'courses' | 'marketplace' | 'mentor' | 'payments' | 'ai_toolkit'>('marketplace');
  const [sellerSubTab, setSellerSubTab] = useState<'gigs' | 'orders' | 'requests' | 'earnings' | 'create_gig' | 'courses' | 'assignments' | 'students' | 'certificates'>('orders');
  const [payoutSubTab, setPayoutSubTab] = useState<'overview' | 'sources' | 'withdraw' | 'history'>('overview');
  const [payoutStatusFilter, setPayoutStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [payoutMinAmount, setPayoutMinAmount] = useState<number>(0);
  const [payoutSearchQuery, setPayoutSearchQuery] = useState<string>('');
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false);
  const [selectedDetailOrderForModal, setSelectedDetailOrderForModal] = useState<any | null>(null);
  
  // Edit Gig State
  const [editingGig, setEditingGig] = useState<MarketplaceGig | null>(null);
  const [editGigTitle, setEditGigTitle] = useState('');
  const [editGigCategory, setEditGigCategory] = useState('Programming & Tech');
  const [editGigPriceBasic, setEditGigPriceBasic] = useState<number>(2500);
  const [editGigPriceStandard, setEditGigPriceStandard] = useState<number>(6000);
  const [editGigPricePremium, setEditGigPricePremium] = useState<number>(15000);
  const [editGigDeliveryDays, setEditGigDeliveryDays] = useState<number>(3);
  const [editGigThumbnail, setEditGigThumbnail] = useState('');
  const [editGigDesc, setEditGigDesc] = useState('');
  const [editGigSuccess, setEditGigSuccess] = useState(false);

  // Performance Analytics Modal State
  const [performanceGig, setPerformanceGig] = useState<MarketplaceGig | null>(null);
  const [activeGigMenuId, setActiveGigMenuId] = useState<string | null>(null);
  const [confirmDeleteGigId, setConfirmDeleteGigId] = useState<string | null>(null);

  const handleOpenEditGig = (gig: MarketplaceGig) => {
    setEditingGig(gig);
    setEditGigTitle(gig.title);
    setEditGigCategory(gig.category);
    setEditGigPriceBasic(gig.packages?.basic?.price || (gig as any).price || 2500);
    setEditGigPriceStandard(gig.packages?.standard?.price || 6000);
    setEditGigPricePremium(gig.packages?.premium?.price || 15000);
    setEditGigDeliveryDays(gig.packages?.basic?.deliveryDays || 3);
    setEditGigThumbnail(gig.thumbnail);
    setEditGigDesc(gig.description || '');
    setEditGigSuccess(false);
  };

  const handleSaveEditGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGig) return;
    updateGig(editingGig.id, {
      title: editGigTitle,
      category: editGigCategory,
      price: editGigPriceBasic,
      thumbnail: editGigThumbnail,
      description: editGigDesc,
      packages: {
        basic: {
          name: 'Basic Package',
          price: editGigPriceBasic,
          deliveryDays: editGigDeliveryDays,
          revisions: '1',
          features: ['কোর ডিজাইন ও ডেলিভারি', 'সোর্স ফাইল']
        },
        standard: {
          name: 'Standard Package',
          price: editGigPriceStandard,
          deliveryDays: Math.max(1, editGigDeliveryDays - 1),
          revisions: '3',
          features: ['অ্যাডভান্স ডিজাইন ও কোড', 'সোর্স ফাইল', 'প্রিমিয়াম সাপোর্ট']
        },
        premium: {
          name: 'Premium Package',
          price: editGigPricePremium,
          deliveryDays: Math.max(1, editGigDeliveryDays - 2),
          revisions: 'Unbounded',
          features: ['সম্পূর্ণ প্রজেক্ট', 'লাইফটাইম মেইনটেন্যান্স', 'ভিআইপি সাপোর্ট']
        }
      }
    });
    setEditGigSuccess(true);
    setTimeout(() => {
      setEditGigSuccess(false);
      setEditingGig(null);
    }, 1200);
  };

  const handleDeleteGig = (gigId: string, title: string) => {
    deleteGig(gigId);
    if (activeGigMenuId === gigId) {
      setActiveGigMenuId(null);
    }
  };
  
  // Create New Order Page State (3-Package Dedicated Page)
  const [isCreateGigModalOpen, setIsCreateGigModalOpen] = useState(false);
  const [newGigTitle, setNewGigTitle] = useState('');
  const [newGigCategory, setNewGigCategory] = useState('Programming & Tech');
  const [newGigOfferBadge, setNewGigOfferBadge] = useState<string>('৩০% ছাড়');
  const [newGigThumbnail, setNewGigThumbnail] = useState('');
  const [newGigGalleryPic, setNewGigGalleryPic] = useState('');
  const [newGigVideoUrl, setNewGigVideoUrl] = useState('');
  const [newGigDesc, setNewGigDesc] = useState('');
  const [newGigTags, setNewGigTags] = useState('');
  const [newGigRequirements, setNewGigRequirements] = useState('');
  const [newGigFaqQ, setNewGigFaqQ] = useState('');
  const [newGigFaqA, setNewGigFaqA] = useState('');
  const [createGigSuccess, setCreateGigSuccess] = useState(false);

  // Basic Package State
  const [newBasicTitle, setNewBasicTitle] = useState('');
  const [newBasicPrice, setNewBasicPrice] = useState<number>(2500);
  const [newBasicDelivery, setNewBasicDelivery] = useState<number>(3);
  const [newBasicRevisions, setNewBasicRevisions] = useState<string>('1');
  const [newBasicDesc, setNewBasicDesc] = useState('');

  // Standard Package State
  const [newStandardTitle, setNewStandardTitle] = useState('');
  const [newStandardPrice, setNewStandardPrice] = useState<number>(6000);
  const [newStandardDelivery, setNewStandardDelivery] = useState<number>(2);
  const [newStandardRevisions, setNewStandardRevisions] = useState<string>('3');
  const [newStandardDesc, setNewStandardDesc] = useState('');

  // Premium Package State
  const [newPremiumTitle, setNewPremiumTitle] = useState('');
  const [newPremiumPrice, setNewPremiumPrice] = useState<number>(15000);
  const [newPremiumDelivery, setNewPremiumDelivery] = useState<number>(1);
  const [newPremiumRevisions, setNewPremiumRevisions] = useState<string>('Unlimited');
  const [newPremiumDesc, setNewPremiumDesc] = useState('');

  // Cashout / Payout Request State
  const [isCashoutFormOpen, setIsCashoutFormOpen] = useState(false);
  const [cashoutMethod, setCashoutMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [cashoutAccountNumber, setCashoutAccountNumber] = useState('01700000000');
  const [cashoutAccountName, setCashoutAccountName] = useState(currentUser?.name || 'Sohag Kazi');
  const [cashoutAmount, setCashoutAmount] = useState<number>(5000);
  const [cashoutNote, setCashoutNote] = useState('');
  const [cashoutSuccessMsg, setCashoutSuccessMsg] = useState('');

  // Gemini AI Assistant State
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiSuccessMsg, setAiSuccessMsg] = useState(false);

  // 1-Click External Portfolio Importer State
  const [portfolioUrlInput, setPortfolioUrlInput] = useState('');
  const [isImportingPortfolio, setIsImportingPortfolio] = useState(false);
  const [portfolioImportSuccess, setPortfolioImportSuccess] = useState(false);

  // Local Payment Gateway & Escrow Checkout State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card'>('bKash');
  const [mfsNumber, setMfsNumber] = useState('01700000000');

  // Withdraw Earnings Modal State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(25000);
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState('01700000000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // Active Pending Cashout Application State
  const [activePendingPayout, setActivePendingPayout] = useState<{
    id: string;
    amount: number;
    paymentMethod: string;
    accountNumber: string;
    requestedAt: string;
    status: 'Pending' | 'Approved' | 'Paid';
  } | null>({
    id: 'pay-106',
    amount: 683919,
    paymentMethod: 'bKash',
    accountNumber: '01700000000',
    requestedAt: '১৪/৮/২০২৬, ১:১৩:৪২ AM',
    status: 'Pending'
  });

  const [isPendingMenuOpen, setIsPendingMenuOpen] = useState(false);
  const [openPayoutMenuId, setOpenPayoutMenuId] = useState<string | null>(null);
  const [isEditPendingModalOpen, setIsEditPendingModalOpen] = useState(false);
  const [editPendingAmount, setEditPendingAmount] = useState<number>(683919);
  const [editPendingMethod, setEditPendingMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [editPendingAccount, setEditPendingAccount] = useState('01700000000');

  // Edit Seller Profile Modal State
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isHeaderMoreMenuOpen, setIsHeaderMoreMenuOpen] = useState(false);
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);

  // Buyer Profile & Security Update Modal State
  const [isBuyerProfileModalOpen, setIsBuyerProfileModalOpen] = useState(false);
  const [buyerEditName, setBuyerEditName] = useState(currentUser?.name || 'বায়ার');
  const [buyerEditAvatar, setBuyerEditAvatar] = useState(currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
  const [buyerEditWhatsapp, setBuyerEditWhatsapp] = useState(currentUser?.mobile || (currentUser as any)?.whatsappNumber || '+8801700000000');
  const [buyerEditEmail, setBuyerEditEmail] = useState(currentUser?.email || 'buyer@ptenit.com');
  const [buyerEditPassword, setBuyerEditPassword] = useState('••••••••');
  const [showBuyerPassword, setShowBuyerPassword] = useState(false);
  const [buyerProfileSuccessMsg, setBuyerProfileSuccessMsg] = useState('');

  const PRESET_AVATARS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  ];

  useEffect(() => {
    if (currentUser) {
      setBuyerEditName(currentUser.name || 'বায়ার');
      setBuyerEditAvatar(currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
      setBuyerEditWhatsapp(currentUser.mobile || (currentUser as any)?.whatsappNumber || '+8801700000000');
      setBuyerEditEmail(currentUser.email || 'buyer@ptenit.com');
    }
  }, [currentUser]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenPayoutMenuId(null);
    };
    if (openPayoutMenuId) {
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [openPayoutMenuId]);

  const handleSaveBuyerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      name: buyerEditName,
      avatar: buyerEditAvatar,
      mobile: buyerEditWhatsapp,
      whatsappNumber: buyerEditWhatsapp,
      email: buyerEditEmail,
      password: buyerEditPassword,
    };
    if (updateMarketplaceProfile) updateMarketplaceProfile(updatedData);
    if (updateProfile) updateProfile(updatedData);
    setBuyerProfileSuccessMsg('আপনার প্রোফাইল ছবি, নাম, হোয়াটসঅ্যাপ নম্বর, জি-মেইল ও পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => {
      setBuyerProfileSuccessMsg('');
      setIsBuyerProfileModalOpen(false);
    }, 1800);
  };
  const [switchSuccessMsg, setSwitchSuccessMsg] = useState('');
  const [accountsList, setAccountsList] = useState([
    {
      id: 'acc-1',
      name: currentUser?.name || 'Sohag Kazi',
      role: 'Boss Freelancer Pro (Seller)',
      email: 'sohag@freelancer.com',
      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      type: 'seller'
    },
    {
      id: 'acc-2',
      name: 'Sohag Kazi (Student / Buyer)',
      role: 'বায়ার / ক্লায়েন্ট অ্যাকাউন্ট',
      email: 'sohag.buyer@email.com',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      type: 'buyer'
    },
    {
      id: 'acc-3',
      name: 'PTEN Tech Agency',
      role: 'এজেন্সি ও টিম বিজনেস অ্যাকাউন্ট',
      email: 'agency@ptentech.com',
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
      type: 'agency'
    }
  ]);
  const [activeAccount, setActiveAccount] = useState(accountsList[0]);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [isCentralNotificationOpen, setIsCentralNotificationOpen] = useState(false);
  const [centralNotifFilter, setCentralNotifFilter] = useState<'all' | 'messages' | 'orders' | 'mentor' | 'payouts'>('all');
  const [centralNotifSearch, setCentralNotifSearch] = useState('');

  // Detailed View Modal state for Notifications and Direct Messages
  const [viewingNotifDetail, setViewingNotifDetail] = useState<any | null>(null);

  // Refs to snapshot unread items at the moment the notification/inbox modal is opened
  // (Prevents instant re-sorting/jumping while the user is actively reading)
  const openedUnreadNotifIdsRef = useRef<Set<string>>(new Set());
  const openedUnreadMsgIdsRef = useRef<Set<string>>(new Set());

  // Capture unread IDs snapshot when opening Central Notification Hub
  useEffect(() => {
    if (isCentralNotificationOpen) {
      const unreadSet = new Set((notifications || []).filter(n => !n.read).map(n => n.id));
      openedUnreadNotifIdsRef.current = unreadSet;
    }
  }, [isCentralNotificationOpen, notifications]);

  // Capture unread IDs snapshot when opening Client Inbox
  useEffect(() => {
    if (isInboxModalOpen) {
      const unreadSet = new Set((directMessages || []).filter(m => !m.read).map(m => m.id));
      openedUnreadMsgIdsRef.current = unreadSet;
    }
  }, [isInboxModalOpen, directMessages]);

  // Mentorship Application & Role-Based Access States
  const [isMentorAppModalOpen, setIsMentorAppModalOpen] = useState(false);
  const [isMentorStatusModalOpen, setIsMentorStatusModalOpen] = useState(false);
  const [mentorAppExpertise, setMentorAppExpertise] = useState<string[]>(['Web Development', 'UI/UX Design']);
  const [mentorAppExperience, setMentorAppExperience] = useState('3+ Years');
  const [mentorAppBio, setMentorAppBio] = useState('আমি ৫+ বছর ধরে প্রফেশনাল ওয়েব ডেভেলপমেন্ট এবং শিক্ষার্থীদের মেন্টরিং করে আসছি।');
  const [mentorAppPortfolio, setMentorAppPortfolio] = useState('https://github.com/expert-mentor');
  const [mentorAppProposedTopic, setMentorAppProposedTopic] = useState('Full-Stack Web Development & Modern React Bootcamp');
  const [mentorAppPhone, setMentorAppPhone] = useState(currentUser?.mobile || '01700000000');
  const [mentorAppSubmittedSuccess, setMentorAppSubmittedSuccess] = useState(false);

  // Role-Based Checks
  const isMentor = Boolean(
    currentUser?.role === 'instructor' || 
    currentUser?.isMentor === true || 
    currentUser?.mentorStatus === 'approved'
  );
  const mentorAppStatus = currentUser?.mentorStatus || (currentUser?.mentorApplication ? currentUser.mentorApplication.status : 'not_applied');
  const isMentorPending = mentorAppStatus === 'pending';

  // Central Combined Unread Notification Counter
  const totalUnreadCount = (notifications?.filter(n => !n.read).length || 0) + (directMessages?.filter(m => !m.read).length || 0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProSubscribed, setIsProSubscribed] = useState(true);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [inboxMessageText, setInboxMessageText] = useState('');
  const [inboxSuccess, setInboxSuccess] = useState(false);
  const [editProfileName, setEditProfileName] = useState(currentUser?.name || 'Sohag Kazi');
  const [editProfileTitle, setEditProfileTitle] = useState('Full-Stack Software Developer & AI Specialist');
  const [editProfileBio, setEditProfileBio] = useState('Expert developer with 5+ years of experience delivering high-converting websites, web apps, and AI chatbots.');
  const [editProfileSkills, setEditProfileSkills] = useState('React, TypeScript, Node.js, Python, Tailwind CSS, Next.js, AI Agents');
  const [editProfileSuccess, setEditProfileSuccess] = useState(false);

  // Live Offer / Order Notification Banner States (Cover Banner)
  interface LiveOfferItem {
    id: string;
    type: 'personal' | 'public' | 'course';
    typeLabel: string;
    source: string;
    clientName: string;
    clientAvatar: string;
    title: string;
    category: string;
    budget: number;
    deadline: string;
    rating: string;
    isVerified: boolean;
    durationSec: number; // Dynamic duration (Admin/Client set)
    requirements: string;
    deliverables: string[];
    clientLocation: string;
    postedTime: string;
  }

  const INITIAL_LIVE_OFFERS: LiveOfferItem[] = [
    {
      id: 'live-ord-101',
      type: 'personal',
      typeLabel: 'ডিরেক্ট পার্সোনাল অর্ডার',
      source: 'Client Direct Request',
      clientName: 'মোশাররফ হোসেন',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'ঢাকা, বাংলাদেশ',
      postedTime: '১০ মিনিট আগে',
      title: 'ফুল-স্ট্যাক ই-কমার্স ওয়েবসাইট UI/UX রি-ডিজাইন ও পেমেন্ট ইন্টিগ্রেশন (bKash/Nagad)',
      category: 'Web Development',
      budget: 14500,
      deadline: '২ দিন',
      rating: '4.9 (24 রিভিউ)',
      isVerified: true,
      durationSec: 15,
      requirements: 'আমাদের রানিং ফ্যাশন ব্র্যান্ডের জন্য Next.js ও Tailwind CSS বেসড একটি রেসপনসিভ অনলাইন স্টোর তৈরি করতে হবে। সাথে SSLCommerz/bKash পেমেন্ট গেটওয়ে এবং ইনভয়েস জেনারেশন সিস্টেম যুক্ত থাকবে। Figma ফাইল প্রস্তুত আছে।',
      deliverables: [
        'ফুল রেসপনসিভ ফ্রন্টএন্ড ডিজাইন (Next.js 14)',
        'SSLCommerz & bKash পেমেন্ট গেটওয়ে সেটআপ',
        'অটোমেটেড SMS ও ইমেইল ইনভয়েস সিস্টেম',
        '৭ দিনের ফ্রি বাগ ফিক্সিং ওয়ারেন্টি'
      ]
    },
    {
      id: 'live-ord-102',
      type: 'public',
      typeLabel: 'লাইভ পাবলিক প্রজেক্ট অফার',
      source: 'Admin Panel Featured',
      clientName: 'তানভীর হাসান (Dhaka IT Solutions)',
      clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'চট্টগ্রাম, বাংলাদেশ',
      postedTime: '২৫ মিনিট আগে',
      title: 'লারাভেল ও রিয়্যাক্ট লাইভ মেন্টরশিপ & রিয়েল-টাইম প্রজেক্ট সাপোর্ট সেশন',
      category: 'Live Mentorship',
      budget: 6000,
      deadline: 'আজকের মধ্যে',
      rating: '5.0 (48 রিভিউ)',
      isVerified: true,
      durationSec: 20,
      requirements: 'আমাদের জুনিয়র ডেভেলপার টিমের জন্য ২ ঘণ্টার লাইভ কোডিং ও প্রবলেম সলভিং সেশন পরিচালনা করতে হবে। মূল ফোকাস: RESTful API সিকিউরিটি, JWT অথেনটিকেশন এবং স্টেট ম্যানেজমেন্ট।',
      deliverables: [
        '২ ঘণ্টার ওয়ান-টু-ওয়ান গুগল মিট সেশন',
        'কোড রিভিউ ও সিকিউরিটি অডিট গাইডলাইন',
        'প্রজেক্ট আর্কিটেকচার স্যাম্পল রেপো'
      ]
    },
    {
      id: 'live-ord-103',
      type: 'personal',
      typeLabel: 'ডিরেক্ট পার্সোনাল অর্ডার',
      source: 'Client Direct Request',
      clientName: 'ফারহানা চৌধুরী (NexGen Agency)',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'বনানী, ঢাকা',
      postedTime: '১ ঘণ্টা আগে',
      title: 'মোবাইল অ্যাপ স্ক্রিন প্রোটোটাইপিং (Figma to Flutter/React Native)',
      category: 'UI/UX Design',
      budget: 8500,
      deadline: '২৪ ঘণ্টা',
      rating: '5.0 (19 রিভিউ)',
      isVerified: true,
      durationSec: 12,
      requirements: 'একটি হেলথ-টেক স্টার্টআপের জন্য ১২টি প্রিমিয়াম মোবাইল স্ক্রিনের আধুনিক Figma প্রোটোটাইপ ও কম্পোনেন্ট সিস্টেম ডিজাইন করতে হবে। ডার্ক ও লাইট মোড উভয়ই থাকতে হবে।',
      deliverables: [
        '১২টি ফুল ইন্টারঅ্যাক্টিভ Figma স্ক্রিন',
        'অটো-লেআউট এবং ডিজাইন টোকেনস',
        'ডেভেলপার হ্যান্ডঅফ রেডি এসেটস'
      ]
    },
    {
      id: 'live-ord-104',
      type: 'public',
      typeLabel: '⚡ লাইভ ক্লায়েন্ট প্রজেক্ট অফার',
      source: 'Client Direct Request',
      clientName: 'রাকিব আহমেদ',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'সিলেট, বাংলাদেশ',
      postedTime: '২ ঘণ্টা আগে',
      title: 'প্রফেশনাল ডিজিটাল মার্কেটিং ও ফেসবুক এডস কনসালটেশন প্যাক',
      category: 'Digital Marketing',
      budget: 4500,
      deadline: '৩ দিন',
      rating: '4.8 (12 রিভিউ)',
      isVerified: true,
      durationSec: 18,
      requirements: 'একটি ই-কমার্স ব্র্যান্ডের জন্য মেটা ও গুগল এডস ক্যাম্পেইন সেটআপ, পিক্সেল ট্র্যাকিং এবং কাস্টম অডিয়েন্স ফানেল তৈরি করতে হবে।',
      deliverables: [
        'টার্গেটেড এডস স্ট্র্যাটেজি প্ল্যান',
        'ROAS অপটিমাইজেশন গাইড',
        'ক্যাম্পেইন মনিটরিং সাপোর্ট'
      ]
    },
    {
      id: 'live-course-105',
      type: 'course',
      typeLabel: '⚡ লাইভ কোর্স এনরোলমেন্ট অফার',
      source: 'PTENit Admin Official',
      clientName: 'PTENit IT Academy (মেইন এডমিন)',
      clientAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'মিরপুর-১০, ঢাকা (অফিশিয়াল)',
      postedTime: '১০ মিনিট আগে',
      title: 'প্রফেশনাল ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট (Next.js, Node.js & AI Masterclass)',
      category: 'Full-Stack Development',
      budget: 12500,
      deadline: '২৪টি লাইভ ক্লাস • ৪টি মডিউল',
      rating: '5.0 (অফিশিয়াল লাইভ কোর্স)',
      isVerified: true,
      durationSec: 20,
      requirements: 'PTENit একাডেমি কর্তৃক নির্ধারিত প্রফেশনাল লাইভ ব্যাচ। ইন্সট্রাক্টর হিসেবে রিসিভ করে সরাসরি ক্লাস ও অ্যাসাইনমেন্ট পরিচালনা করতে পারবেন। ৩৫% কমিশন সম্মানিয়াম ইনস্ট্যান্ট জমা হবে।',
      deliverables: [
        '২৪টি প্রফেশনাল লাইভ ক্লাস লেকচার',
        '৪টি রিয়েল-টাইম অ্যাসাইনমেন্ট ও কোড রিভিউ',
        'প্রজেক্ট ফিডব্যাক ও সার্টিফিকেট প্রদান'
      ]
    },
    {
      id: 'live-course-106',
      type: 'course',
      typeLabel: '⚡ লাইভ কোর্স এনরোলমেন্ট অফার',
      source: 'PTENit Admin Official',
      clientName: 'PTENit Academy Admin',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'মিরপুর-১০, ঢাকা',
      postedTime: '৫ মিনিট আগে',
      title: 'প্রফেশনাল ডিজিটাল মার্কেটিং & মেটা এডস ফানেল (লাইভ ব্যাচ ২০২৬)',
      category: 'Digital Marketing',
      budget: 8500,
      deadline: '১৮টি লাইভ ক্লাস • ৩টি মডিউল',
      rating: '5.0 (অফিশিয়াল লাইভ কোর্স)',
      isVerified: true,
      durationSec: 18,
      requirements: 'ডিজিটাল মার্কেটিং ও মেটা এডস ক্যাম্পেইনের ওপর লাইভ সেশন পরিচালনা করতে হবে। স্টুডেন্টদের কাস্টম এডস সাপোর্ট প্রদান আবশ্যক।',
      deliverables: [
        '১৮টি লাইভ প্র্যাকটিক্যাল ক্লাস',
        'মেটা ও গুগল এডস ফানেল প্রজেক্ট',
        'স্টুডেন্ট প্রফেশনাল ফিডব্যাক'
      ]
    },
    {
      id: 'live-course-107',
      type: 'course',
      typeLabel: '⚡ লাইভ কোর্স এনরোলমেন্ট অফার',
      source: 'PTENit Admin Official',
      clientName: 'PTENit Tech Team',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      clientLocation: 'উত্তরা, ঢাকা',
      postedTime: '১ মিনিট আগে',
      title: 'UI/UX ও প্রোডাক্ট ডিজাইন মাস্টারক্লাস (Figma, Design System & Portfolio)',
      category: 'UI/UX Design',
      budget: 9500,
      deadline: '২০টি লাইভ ক্লাস • ৪টি মডিউল',
      rating: '5.0 (অফিশিয়াল লাইভ কোর্স)',
      isVerified: true,
      durationSec: 20,
      requirements: 'Figma প্রফেশনাল ডিজাইন সিস্টেম, অটো-লেআউট এবং মোবাইল/ওয়েব অ্যাপ ডিজাইন শেখাতে হবে।',
      deliverables: [
        '২০টি লাইভ ডিজাইন সেশন',
        '২টি রিয়েল প্রোডাক্ট কেস স্টাডি',
        'পোর্টফোলিও বিল্ডিং রিভিউ'
      ]
    }
  ];

  const [activeOffersList, setActiveOffersList] = useState<LiveOfferItem[]>(INITIAL_LIVE_OFFERS);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [isOfferPaused, setIsOfferPaused] = useState(false);
  const [offerCountdown, setOfferCountdown] = useState(15);
  const [totalOfferDuration, setTotalOfferDuration] = useState(15);
  
  // Sound toggle for live offers & order notification sound (Permanent Saved State)
  const [isOfferSoundEnabled, setIsOfferSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ptenit_offer_sound_enabled');
      return saved !== null ? JSON.parse(saved) === true : true;
    } catch {
      return true;
    }
  });

  // Modals for Offer details and See all
  const [receivedOfferIds, setReceivedOfferIds] = useState<string[]>([]);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState<LiveOfferItem | null>(null);
  const [isSeeAllOffersModalOpen, setIsSeeAllOffersModalOpen] = useState(false);
  const [justActionedOfferId, setJustActionedOfferId] = useState<string | null>(null);
  const [offerActionType, setOfferActionType] = useState<'received' | 'rejected' | null>(null);
  const activeAudioContextRef = useRef<AudioContext | null>(null);

  // Instantly stop any running offer sound
  const stopOfferNotificationSound = useCallback(() => {
    try {
      if (activeAudioContextRef.current && activeAudioContextRef.current.state !== 'closed') {
        activeAudioContextRef.current.close().catch(() => {});
        activeAudioContextRef.current = null;
      }
    } catch {
      // ignore
    }
  }, []);

  // Toggle Offer Sound Function (Persists permanently in localStorage)
  const toggleOfferSound = useCallback(() => {
    setIsOfferSoundEnabled(prev => {
      const next = !prev;
      setIsToolkitSoundOn(next);
      try {
        localStorage.setItem('ptenit_offer_sound_enabled', JSON.stringify(next));
        localStorage.setItem('ptenit_toolkit_sound', String(next));
      } catch {}
      if (!next) {
        stopOfferNotificationSound();
      }
      return next;
    });
  }, [stopOfferNotificationSound]);

  // Web Audio Notification Sound Chime (Plays on new offer, NEVER plays if muted in state or localStorage)
  const playOfferNotificationSound = useCallback(() => {
    // 1. Strict localStorage check
    try {
      const saved = localStorage.getItem('ptenit_offer_sound_enabled');
      if (saved !== null && JSON.parse(saved) === false) {
        return;
      }
    } catch {}

    // 2. React state check
    if (!isOfferSoundEnabled) return;

    try {
      // Close previous audio if running
      if (activeAudioContextRef.current && activeAudioContextRef.current.state !== 'closed') {
        activeAudioContextRef.current.close().catch(() => {});
        activeAudioContextRef.current = null;
      }

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      activeAudioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play a soft recurring rhythmic chime for 10 seconds
      const startTime = ctx.currentTime;
      const chimeTones = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Pleasing chord)
      
      for (let i = 0; i < 5; i++) {
        const intervalTime = startTime + i * 2.0; // every 2 seconds for 10 seconds total
        chimeTones.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, intervalTime + idx * 0.08);

          gain.gain.setValueAtTime(0, intervalTime + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.08, intervalTime + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, intervalTime + idx * 0.08 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(intervalTime + idx * 0.08);
          osc.stop(intervalTime + idx * 0.08 + 0.6);
        });
      }

      // Auto close audio context after 10.5 seconds
      setTimeout(() => {
        if (ctx.state !== 'closed') {
          ctx.close().catch(() => {});
          if (activeAudioContextRef.current === ctx) {
            activeAudioContextRef.current = null;
          }
        }
      }, 10500);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isOfferSoundEnabled]);

  // When active offer changes, reset countdown based on that offer's dynamic duration and play sound
  useEffect(() => {
    if (activeOffersList.length === 0) return;
    const safeIndex = activeOfferIndex % activeOffersList.length;
    const currentOffer = activeOffersList[safeIndex];
    if (currentOffer) {
      const dur = currentOffer.durationSec || 15;
      setTotalOfferDuration(dur);
      setOfferCountdown(dur);
      playOfferNotificationSound();
    }
  }, [activeOfferIndex, activeOffersList.length, playOfferNotificationSound]);

  // Live Dynamic Countdown Timer Effect with Hover-to-Pause Support
  useEffect(() => {
    if (activeOffersList.length === 0 || isOfferPaused || selectedOfferForModal || isSeeAllOffersModalOpen || justActionedOfferId) {
      return;
    }

    const interval = setInterval(() => {
      setOfferCountdown((prev) => {
        if (prev <= 1) {
          setActiveOfferIndex((curr) => (curr + 1) % activeOffersList.length);
          return totalOfferDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOfferPaused, selectedOfferForModal, isSeeAllOffersModalOpen, justActionedOfferId, activeOffersList.length, totalOfferDuration]);

  // Handle Receive Action (Creates order in marketplaceOrders with 'pending' status and switches to pending tab)
  const handleReceiveLiveOffer = (offer: LiveOfferItem) => {
    // Instantly stop ringing chime
    stopOfferNotificationSound();
    setJustActionedOfferId(offer.id);
    setOfferActionType('received');

    const isCourseOffer = offer.type === 'course' || offer.typeLabel.includes('কোর্স') || offer.title.toLowerCase().includes('কোর্স');

    if (isCourseOffer) {
      const matchedCourse = courses.find(c => c.offerStatus === 'offered' && (c.id === offer.id || c.title.toLowerCase().includes(offer.title.toLowerCase().substring(0, 10))));
      if (matchedCourse) {
        acceptCourseOffer(matchedCourse.id, currentUser?.id, currentUser?.name);
      } else {
        const newCourseId = `course-offer-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        addCourse({
          title: offer.title,
          category: offer.category || 'Professional Course',
          instructor: currentUser?.name || 'তানভীর আহমেদ',
          assignedInstructorId: currentUser?.id || 'teacher-1',
          level: 'professional',
          duration: offer.deadline || '4 Weeks',
          lessonsCount: 16,
          isFree: false,
          price: offer.budget || 8500,
          thumbnail: offer.clientAvatar || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
          description: offer.requirements || offer.title,
          whatYouWillLearn: offer.deliverables && offer.deliverables.length > 0 ? offer.deliverables : ['প্রফেশনাল স্কিলস লাইভ ক্লাস', 'রিয়েল প্রজেক্ট অ্যাসাইনমেন্ট ও কোড রিভিউ', 'প্রজেক্ট ফিডব্যাক ও সার্টিফিকেট প্রদান'],
          requirements: ['কম্পিউটার বা ইন্টারনেট সংযোজন'],
          tags: ['#PTENit', '#LiveCourse'],
          modules: [
            {
              id: `m-1-${Date.now()}`,
              title: 'মডিউল ১: ওরিয়েন্টেশন ও মূল বিষয়বস্তু',
              lessons: [
                { id: `l-1-${Date.now()}`, title: 'ক্লাস ১: পরিচিতি ও কোর্স ওভারভিউ', duration: '৪৫ মিনিট', isFree: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
              ]
            }
          ],
          published: true,
          targetModules: 4,
          targetLessons: 16,
          teacherCommissionRate: 35,
          offerStatus: 'accepted',
          isPublicOffer: false
        });
        acceptCourseOffer(newCourseId, currentUser?.id, currentUser?.name);
      }

      setSwitchSuccessMsg(`🎉 '${offer.title}' কোর্স অফার রিসিভ করা হয়েছে • ৳${offer.budget.toLocaleString()}`);
      setTimeout(() => {
        setSwitchSuccessMsg('');
      }, 4000);
    } else {
      const newOrder: MarketplaceOrder = {
        id: `ord-mkt-${Date.now()}`,
        type: 'custom_agency_order',
        title: offer.title,
        category: offer.category || 'Specialist Project',
        buyerId: offer.clientName.toLowerCase().replace(/\s+/g, '-'),
        buyerName: offer.clientName,
        buyerEmail: 'client@ptenit.com',
        buyerPhone: '01812345678',
        sellerId: currentUser?.id || 'teacher-1',
        sellerName: currentUser?.name || 'প্রকৌশলী আল-আমিন',
        sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        packageType: 'Standard',
        amount: offer.budget,
        adminCommission: Math.round(offer.budget * 0.1),
        sellerPayout: Math.round(offer.budget * 0.9),
        paymentMethod: 'bKash Escrow Security',
        transactionId: `TRX-${Date.now().toString().slice(-8)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        deadlineDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        deliveryNote: offer.requirements
      };

      addMarketplaceOrder(newOrder);
      setSwitchSuccessMsg(`🎉 '${offer.title}' অফার রিসিভ করা হয়েছে • ৳${offer.budget.toLocaleString()}`);
      setTimeout(() => {
        setSwitchSuccessMsg('');
      }, 4000);
    }

    setReceivedOfferIds((prev) => (prev.includes(offer.id) ? prev : [...prev, offer.id]));

    setTimeout(() => {
      // Remove from active list
      setActiveOffersList((prev) => prev.filter((item) => item.id !== offer.id));
      setJustActionedOfferId(null);
      setOfferActionType(null);
      // Keep modal open so the user can review all details without pop-up disappearing
      setActiveOfferIndex((curr) => (curr >= activeOffersList.length - 1 ? 0 : curr));
    }, 400);
  };

  // Handle Reject Action (Removes offer from active list)
  const handleRejectLiveOffer = (offer: LiveOfferItem) => {
    // Instantly stop ringing chime
    stopOfferNotificationSound();
    setJustActionedOfferId(offer.id);
    setOfferActionType('rejected');

    setSwitchSuccessMsg(`⚠️ '${offer.title.substring(0, 30)}...' বাতিল করা হয়েছে`);
    setTimeout(() => {
      setSwitchSuccessMsg('');
    }, 3500);

    setTimeout(() => {
      // Remove from active list
      setActiveOffersList((prev) => prev.filter((item) => item.id !== offer.id));
      setJustActionedOfferId(null);
      setOfferActionType(null);
      setSelectedOfferForModal(null);
      setActiveOfferIndex((curr) => (curr >= activeOffersList.length - 1 ? 0 : curr));
    }, 600);
  };

  // Order Details Modal (Checkout & Freelancer Showcase)
  const [selectedGig, setSelectedGig] = useState<MarketplaceGig | null>(() => {
    try {
      const savedGigData = localStorage.getItem('ptenit_selected_gig_data');
      if (savedGigData) {
        localStorage.removeItem('ptenit_selected_gig_data');
        localStorage.removeItem('ptenit_selected_gig_id');
        const parsed = JSON.parse(savedGigData);
        if (parsed && parsed.id) return parsed;
      }
      const savedGigId = localStorage.getItem('ptenit_selected_gig_id');
      if (savedGigId) {
        localStorage.removeItem('ptenit_selected_gig_id');
        const found = gigs.find(g => g.id === savedGigId || g.title === savedGigId);
        if (found) return found;
      }
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    try {
      const savedGigData = localStorage.getItem('ptenit_selected_gig_data');
      if (savedGigData) {
        localStorage.removeItem('ptenit_selected_gig_data');
        localStorage.removeItem('ptenit_selected_gig_id');
        const parsed = JSON.parse(savedGigData);
        if (parsed && parsed.id) {
          setSelectedGig(parsed);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      const savedGigId = localStorage.getItem('ptenit_selected_gig_id');
      if (savedGigId) {
        localStorage.removeItem('ptenit_selected_gig_id');
        const found = gigs.find(g => g.id === savedGigId || g.title === savedGigId);
        if (found) {
          setSelectedGig(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {}
  }, [gigs]);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [gigOrderNote, setGigOrderNote] = useState('');
  const [gigOrderSuccess, setGigOrderSuccess] = useState(false);
  const [gigDetailTab, setGigDetailTab] = useState<'overview' | 'packages' | 'portfolio' | 'reviews' | 'seller' | 'faqs'>('overview');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [savedGigIds, setSavedGigIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ptenit_saved_gigs');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed : ['gig-1', 'gig-2', 'gig-3'];
    } catch {
      return ['gig-1', 'gig-2', 'gig-3'];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const savedGigs = useMemo(() => gigs.filter(g => savedGigIds.includes(g.id)), [gigs, savedGigIds]);

  const toggleFavorite = (gigId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedGigIds(prev => {
      const isSaved = prev.includes(gigId);
      const updated = isSaved ? prev.filter(id => id !== gigId) : [...prev, gigId];
      try {
        localStorage.setItem('ptenit_saved_gigs', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const [showCopyToast, setShowCopyToast] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Category List (Text Only in Navigation)
  const categoryAliases: Record<string, string[]> = {
    'Graphics & Design': ['Graphic Design', 'Graphics & Design', 'UI/UX', 'Design'],
    'Programming & Tech': ['Web Development', 'Mobile App Development', 'Software', 'Programming & Tech', 'Development'],
    'Digital Marketing': ['Digital Marketing', 'Social Media', 'Marketing'],
    'AI Services': ['AI & Automation', 'AI Services', 'AI Development', 'AI', 'Chatbot', 'SaaS', 'Bot', 'Artificial'],
    'AI Development': ['AI & Automation', 'AI Services', 'AI Development', 'AI', 'Chatbot', 'SaaS', 'Bot', 'Artificial'],
    'Video & Animation': ['Video Editing', 'Video & Animation', 'Multimedia'],
    'SEO & Growth': ['SEO & Growth', 'SEO'],
    'Education & Training': ['Education & Training', 'Training', 'Academic']
  };

  // Filtered Gigs
  const filteredGigs = gigs.filter(gig => {
    if (showSavedOnly && !savedGigIds.includes(gig.id)) {
      return false;
    }
    let matchesCat = selectedCategory === 'All';
    if (!matchesCat) {
      const allowed = categoryAliases[selectedCategory] || [selectedCategory];
      matchesCat = allowed.some(catName =>
        gig.category.toLowerCase().includes(catName.toLowerCase()) ||
        catName.toLowerCase().includes(gig.category.toLowerCase())
      );
    }
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gig.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gig.category.toLowerCase().includes(searchQuery.toLowerCase());

    const gigPrice = gig.packages?.basic?.price ?? (gig as any).price ?? 2500;
    let matchesPrice = true;
    if (priceRangeFilter === 'under3k') matchesPrice = gigPrice < 3000;
    else if (priceRangeFilter === '3k-10k') matchesPrice = gigPrice >= 3000 && gigPrice <= 10000;
    else if (priceRangeFilter === '10k-30k') matchesPrice = gigPrice > 10000 && gigPrice <= 30000;
    else if (priceRangeFilter === 'over30k') matchesPrice = gigPrice > 30000;

    const gigDelivery = gig.packages?.basic?.deliveryDays ?? 3;
    let matchesDelivery = true;
    if (deliveryFilter === '1day') matchesDelivery = gigDelivery <= 1;
    else if (deliveryFilter === '3days') matchesDelivery = gigDelivery <= 3;
    else if (deliveryFilter === '7days') matchesDelivery = gigDelivery <= 7;

    const gigRating = gig.rating ?? 5.0;
    const matchesRating = gigRating >= ratingFilter;

    return matchesCat && matchesSearch && matchesPrice && matchesDelivery && matchesRating;
  }).sort((a, b) => {
    const priceA = a.packages?.basic?.price ?? (a as any).price ?? 2500;
    const priceB = b.packages?.basic?.price ?? (b as any).price ?? 2500;
    const ratingA = a.rating ?? 5.0;
    const ratingB = b.rating ?? 5.0;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'rating') return ratingB - ratingA;
    return (b.salesCount || 1) - (a.salesCount || 1);
  });

  // Handle Gemini AI Order Optimization
  const handleOptimizeWithGemini = async () => {
    if (!newGigTitle && !newGigDesc) {
      alert('দয়া করে কিছু খসড়া টাইটেল বা বর্ণনা লিখুন!');
      return;
    }
    setIsAiOptimizing(true);
    try {
      const res = await fetch('/api/gemini/optimize-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roughTitle: newGigTitle,
          category: newGigCategory,
          description: newGigDesc,
        }),
      });
      const data = await res.json();
      if (data.optimizedTitle) setNewGigTitle(data.optimizedTitle);
      if (data.optimizedDesc) setNewGigDesc(data.optimizedDesc);
      setAiSuccessMsg(true);
      setTimeout(() => setAiSuccessMsg(false), 3000);
    } catch (err) {
      console.error('Gemini Optimization Error:', err);
    } finally {
      setIsAiOptimizing(false);
    }
  };

  // Handle 1-Click External Portfolio Importer
  const handleImportPortfolio = async () => {
    if (!portfolioUrlInput) {
      alert('দয়া করে আপনার Behance, GitHub বা LinkedIn লিঙ্ক টাইপ করুন!');
      return;
    }
    setIsImportingPortfolio(true);
    try {
      const res = await fetch('/api/portfolio/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: portfolioUrlInput }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.extractedBio) setEditProfileBio(data.extractedBio);
        if (data.extractedSkills) setEditProfileSkills(data.extractedSkills.join(', '));
        if (data.extractedTitle) setEditProfileTitle(data.extractedTitle);
        setPortfolioImportSuccess(true);
        setTimeout(() => setPortfolioImportSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Portfolio Import Error:', err);
    } finally {
      setIsImportingPortfolio(false);
    }
  };

  // Handle Direct Order Confirmation
  const handleOrderGig = () => {
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      return;
    }
    if (!selectedGig) return;

    createDirectGigOrder(selectedGig.id, selectedPackage, `${gigOrderNote} | Payment: ${paymentMethod} (${mfsNumber})`);
    setGigOrderSuccess(true);
    setTimeout(() => {
      setGigOrderSuccess(false);
      setSelectedGig(null);
      setActiveSubTab('my-orders');
    }, 1800);
  };

  // Handle Create Order Submit (3-Package Dedicated Page)
  const handleCreateGigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      return;
    }
    if (!newGigTitle || !newGigDesc) return;

    // Enforce max 6 gigs limit per seller
    const userGigCount = gigs.filter(g =>
      (currentUser.id && g.sellerId === currentUser.id) ||
      (currentUser.name && g.sellerName.toLowerCase() === currentUser.name.toLowerCase())
    ).length;

    if (userGigCount >= 6) {
      alert('দুঃখিত! একজন সেলার/ব্যক্তি হিসেবে আপনি সর্বোচ্চ ৬টির বেশি গিগ তৈরি বা আপলোড করতে পারবেন না। নতুন গিগ পোস্ট করতে চাইলে পূর্বের কোনো গিগ ডিলেট করুন।');
      return;
    }

    createGig({
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerLevel: 'Level 2 Freelancer',
      title: newGigTitle,
      category: newGigCategory,
      offerBadge: newGigOfferBadge || '৩০% ছাড়',
      thumbnail: newGigThumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      description: newGigDesc,
      packages: {
        basic: {
          name: newBasicTitle || 'Basic Starter',
          price: Number(newBasicPrice),
          deliveryDays: Number(newBasicDelivery),
          revisions: newBasicRevisions || '1',
          description: newBasicDesc,
          features: ['Sourse Code File', 'Responsive Layout', 'Basic Support']
        },
        standard: {
          name: newStandardTitle || 'Standard Pro',
          price: Number(newStandardPrice),
          deliveryDays: Number(newStandardDelivery),
          revisions: newStandardRevisions || '3',
          description: newStandardDesc,
          features: ['Sourse Code File', 'Responsive Layout', 'Commercial Use', 'Database Integration']
        },
        premium: {
          name: newPremiumTitle || 'Premium Enterprise',
          price: Number(newPremiumPrice),
          deliveryDays: Number(newPremiumDelivery),
          revisions: newPremiumRevisions || 'Unlimited',
          description: newPremiumDesc,
          features: ['Sourse Code File', 'Responsive Layout', 'Commercial Use', 'Database Integration', 'API Connect', '30 Days VIP Support']
        }
      }
    });

    setCreateGigSuccess(true);
    setTimeout(() => {
      setCreateGigSuccess(false);
      setIsCreateGigModalOpen(false);
      setSellerSubTab('gigs');
      setNewGigTitle('');
      setNewGigOfferBadge('৩০% ছাড়');
      setNewGigDesc('');
    }, 1200);
  };

  // Handle Bill Cashout Application Submit
  const handleCashoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      return;
    }
    const numAmt = Number(cashoutAmount);
    if (!numAmt || numAmt <= 0) {
      alert('দয়া করে ক্যাশআউটের জন্য সঠিক টাকার পরিমাণ প্রদান করুন!');
      return;
    }
    const newId = `pay-${Date.now().toString().slice(-6)}`;
    const nowTime = new Date().toLocaleString('bn-BD');

    requestTeacherPayout({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherEmail: currentUser.email || 'seller@ptenit.com',
      amount: numAmt,
      paymentMethod: cashoutMethod,
      accountNumber: cashoutAccountNumber,
      note: cashoutNote || `Seller Bill Cashout Request via ${cashoutMethod}`
    });

    setActivePendingPayout({
      id: newId,
      amount: numAmt,
      paymentMethod: cashoutMethod,
      accountNumber: cashoutAccountNumber,
      requestedAt: nowTime,
      status: 'Pending'
    });

    setAvailableBalance(prev => Math.max(0, prev - numAmt));
    setPayoutSubTab('history');
    setCashoutSuccessMsg(`✓ আপনার ৳${numAmt.toLocaleString('bn-BD')} বিল ক্যাশআউট আবেদন সফলভাবে জমা দেওয়া হয়েছে! ২৪ ঘণ্টার মধ্যে টাকা প্রসেস করা হবে।`);
    setIsCashoutFormOpen(false);
    setTimeout(() => {
      setCashoutSuccessMsg('');
    }, 6000);
  };

  // Handle Profile Update
  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editProfileName
    });
    setAccountsList(prev => prev.map(a => a.id === activeAccount.id ? { ...a, name: editProfileName } : a));
    setActiveAccount(prev => ({ ...prev, name: editProfileName }));
    setEditProfileSuccess(true);
    setTimeout(() => {
      setEditProfileSuccess(false);
      setIsEditProfileModalOpen(false);
    }, 1200);
  };

  return (
    <div id="marketplace-top" className="pt-0 pb-6 sm:py-6 px-2 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full max-w-[1920px] mx-auto space-y-4 sm:space-y-8 font-sans text-slate-900 dark:text-slate-100 min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 md:pb-8">
      
      {/* PTENit MODERN FIVERR-STYLE MARKETPLACE HEADER (MATCHING PTENIT NAVBAR COLOR & STYLE) */}
      {!selectedGig && viewMode !== 'selling' && (
        <div className={`fixed sm:sticky top-0 left-0 right-0 sm:left-auto sm:right-auto z-40 bg-[#0B132B] text-white px-2 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-0 sm:mb-6 shadow-none sm:shadow-md ${
          ['overview', 'my-orders', 'my-courses', 'saved_gigs', 'settings', 'post-project', 'public-offers'].includes(activeSubTab) ? 'md:hidden' : ''
        }`}>
          <div className="w-full max-w-[1920px] mx-auto py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* MOBILE VIEW HEADER (< md screen: Facebook Lite Style Header & Merged Icon Navigation) */}
          <div className="flex md:hidden flex-col gap-2 w-full font-bengali">
            {/* Top Bar: Brand, Search, Profile, Menu - ONLY visible on Home/Gigs tab */}
            {(activeSubTab === 'gigs' && !isInboxModalOpen && !isNotificationsOpen) && (
              <div className="flex items-center justify-between gap-1.5 w-full">
                {/* Left: PTENit Brand Logo */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGig(null);
                    setViewMode('buying');
                    setActiveSubTab('gigs');
                    setSelectedCategory('All');
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-left cursor-pointer shrink-0 group"
                  title="মার্কেটপ্লেস রিফ্রেশ"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-bold text-base text-white shadow-md shadow-[#1DB954]/20 shrink-0">
                    P
                  </div>
                  <span className="font-heading text-base font-black tracking-wider text-white">
                    PTEN<span className="text-[#1DB954]">it</span>
                  </span>
                </button>

                {/* Mobile Inline Search Bar */}
                <div className="flex-1 min-w-0 mx-1 relative items-center">
                  <div className="relative w-full flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="সার্চ করুন..."
                      className="w-full pl-7 pr-6 py-1 bg-slate-900/90 border border-slate-700/80 text-white rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1DB954] font-bengali shadow-inner"
                    />
                    <Search className="w-3.5 h-3.5 text-[#1DB954] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* LIVE FLOATING SEARCH RESULTS DROPDOWN (MOBILE MARKETPLACE) */}
                  {searchQuery.trim() && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-[#142B4D] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 max-h-80 overflow-y-auto">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 border-b border-slate-700 pb-1 font-bengali flex items-center justify-between">
                        <span>মার্কেটপ্লেস গিগসমূহ ({filteredGigs.length})</span>
                        <span className="text-[9px] text-[#1DB954] font-normal">লাইভ ফলাফল</span>
                      </div>

                      {filteredGigs.length > 0 ? (
                        <div className="space-y-1.5">
                          {filteredGigs.slice(0, 4).map(gig => {
                            const gigPrice = gig.packages?.basic?.price ?? (gig as any).price ?? 2500;
                            const gigThumbnail = gig.images?.[0] || gig.sellerAvatar || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80';
                            return (
                              <div
                                key={gig.id}
                                onClick={() => {
                                  setSelectedGig(gig);
                                  setViewMode('buying');
                                  setActiveSubTab('gigs');
                                  setSearchQuery('');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 p-1.5 hover:bg-slate-800/90 rounded-lg cursor-pointer transition-colors bg-slate-900/60 border border-slate-800"
                              >
                                <img
                                  src={gigThumbnail}
                                  alt={gig.title}
                                  className="w-9 h-9 rounded-md object-cover shrink-0 border border-slate-700"
                                />
                                <div className="flex-1 min-w-0 font-bengali">
                                  <p className="font-semibold text-xs text-white truncate">{gig.title}</p>
                                  <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[10px] text-slate-400 truncate max-w-[110px]">{gig.sellerName}</span>
                                    <span className="text-[11px] text-[#1DB954] font-bold">
                                      ৳{gigPrice.toLocaleString('en-US')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-slate-400 py-3 text-xs font-bengali">
                          কোনো গিগ বা সার্ভিস পাওয়া যায়নি।
                        </p>
                      )}

                      {filteredGigs.length > 0 && (
                        <div className="pt-2 mt-1.5 border-t border-slate-700/80">
                          <button
                            onClick={() => {
                              setSelectedGig(null);
                              setViewMode('buying');
                              setActiveSubTab('gigs');
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className="w-full py-1.5 px-2.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition font-bengali cursor-pointer shadow"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>সকল ফলাফল দেখুন ({filteredGigs.length} টি)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                        setIsMobileMarketplaceMenuOpen(false);
                      }}
                      className="flex items-center p-0.5 rounded-full bg-slate-900 border-2 border-[#1DB954] cursor-pointer active:scale-95 transition"
                      title="প্রোফাইল মেনু"
                    >
                      <img
                        src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openAuthModal}
                      className="px-2 py-0.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 font-bengali"
                    >
                      লগইন
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMarketplaceMenuOpen(!isMobileMarketplaceMenuOpen);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="p-1 text-slate-200 hover:text-white cursor-pointer"
                    title="মার্কেটপ্লেস মেনু"
                  >
                    {isMobileMarketplaceMenuOpen ? <X className="w-5 h-5 text-[#1DB954]" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* FACEBOOK LITE STYLE UNIFIED ICON NAVIGATION BAR */}
            <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5 text-slate-300 w-full overflow-hidden">
              {/* 1. 🏠 Marketplace Home */}
              <button
                type="button"
                onClick={() => {
                  setSelectedGig(null);
                  setViewMode('buying');
                  setActiveSubTab('gigs');
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setIsInboxModalOpen(false);
                  setIsNotificationsOpen(false);
                  if (setActiveTab) {
                    setActiveTab('marketplace', 'All', true);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition active:scale-95 cursor-pointer ${
                  activeSubTab === 'gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (activeTab === 'marketplace' || !activeTab) ? 'text-[#1DB954]' : 'text-white'
                }`}
                title="মার্কেটপ্লেস হোম"
              >
                <Home className={`w-5 h-5 ${activeSubTab === 'gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (activeTab === 'marketplace' || !activeTab) ? 'text-[#1DB954]' : 'text-white'}`} />
              </button>

              {/* 2. 🛍️ Order & Courses */}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (openAuthModal) openAuthModal();
                    return;
                  }
                  setSelectedGig(null);
                  setViewMode('buying');
                  setActiveSubTab('my-orders');
                  setOrderHubTab('orders');
                  if (setActiveTab) {
                    setActiveTab('marketplace', 'my-orders', true);
                  }
                  setIsInboxModalOpen(false);
                  setIsNotificationsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                  (activeSubTab === 'my-orders' || activeSubTab === 'my-courses') && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'text-[#1DB954]' : 'text-white'
                }`}
                title="আমার ক্রয়কৃত প্রজেক্ট ও কোর্সসমূহ"
              >
                <ShoppingBag className={`w-5 h-5 ${(activeSubTab === 'my-orders' || activeSubTab === 'my-courses') && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'stroke-[2.5] text-[#1DB954]' : 'text-white'}`} />
              </button>

              {/* 3. ✉️ Messenger */}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (openAuthModal) openAuthModal();
                    return;
                  }
                  openMessengerInbox();
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                  isMessengerInboxOpen ? 'text-[#1DB954]' : 'text-white hover:text-[#1DB954]'
                }`}
                title="মেসেঞ্জার"
              >
                <Mail className={`w-5 h-5 ${isMessengerInboxOpen ? 'text-[#1DB954] stroke-[2.5]' : 'text-white'}`} />
                {(directMessages && directMessages.length > 0) && (
                  <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {directMessages.filter(m => !m.read).length > 0 
                      ? directMessages.filter(m => !m.read).length 
                      : directMessages.length}
                  </span>
                )}
              </button>

              {/* 4. 🔔 Notification */}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (openAuthModal) openAuthModal();
                    return;
                  }
                  openNotificationCenter();
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                  isNotificationCenterOpen ? 'text-[#1DB954]' : 'text-white hover:text-[#1DB954]'
                }`}
                title="নোটিফিকেশন"
              >
                <Bell className={`w-5 h-5 ${isNotificationCenterOpen ? 'text-[#1DB954] stroke-[2.5]' : 'text-white'}`} />
                {(notifications && notifications.length > 0) && (
                  <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {notifications.filter(n => !n.read).length > 0 
                      ? notifications.filter(n => !n.read).length 
                      : notifications.length}
                  </span>
                )}
              </button>

              {/* 5. ❤️ Saved / Favorites */}
              <button
                type="button"
                onClick={() => {
                  setSelectedGig(null);
                  setViewMode('buying');
                  setActiveSubTab('saved_gigs');
                  if (setActiveTab) {
                    setActiveTab('marketplace', 'saved_gigs', true);
                  }
                  setIsInboxModalOpen(false);
                  setIsNotificationsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                  activeSubTab === 'saved_gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'text-[#1DB954]' : 'text-white'
                }`}
                title="পছন্দের সেভ করা গিগসমূহ"
              >
                <Heart className={`w-5 h-5 ${activeSubTab === 'saved_gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'fill-[#1DB954] text-[#1DB954]' : 'text-white'}`} />
                {savedGigIds && savedGigIds.length > 0 && (
                  <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {savedGigIds.length}
                  </span>
                )}
              </button>
            </div>

            {/* ATTACHED UNIFIED ORDERS & COURSES HEADER FOR PHONE VIEW (SAME CLEAN MESSENGER STYLE) */}
            {(activeSubTab === 'my-orders' || activeSubTab === 'my-courses') && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (
              <div className="w-full font-bengali bg-[#0B132B] px-3 py-2 border-t border-slate-800/80">
                {isOrderSearchActive ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-150">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="অর্ডার বা কোর্স সার্চ করুন..."
                        autoFocus
                        className="w-full pl-8 pr-7 py-1 bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/80 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                      />
                      {orderSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setOrderSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPostProjectModalOpen(true)}
                      className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
                      title="সেটিংস ও প্রজেক্ট পোস্ট"
                    >
                      <Settings className="w-4.5 h-4.5 text-slate-200" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOrderSearchActive(false);
                        setOrderSearchQuery('');
                      }}
                      className="px-2 py-1 rounded-lg text-slate-300 hover:text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('gigs')}
                        className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="ফিরে যান"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-200" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-white tracking-tight leading-none font-english">Your Orders</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400/90 tracking-wide leading-tight mt-0.5 font-english">PTENit Project & courses</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsOrderSearchActive(true)}
                        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="সার্চ করুন"
                      >
                        <Search className="w-4.5 h-4.5 text-slate-200" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPostProjectModalOpen(true)}
                        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="সেটিংস ও প্রজেক্ট পোস্ট"
                      >
                        <Settings className="w-4.5 h-4.5 text-slate-200" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ATTACHED UNIFIED MESSENGER HEADER FOR PHONE VIEW (SAME COLOR AS TOPBAR #0B132B) */}
            {activeSubTab === 'messenger' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (
              <div className="w-full font-bengali bg-[#0B132B] px-3 py-2 border-t border-slate-800/80">
                {activeMessengerConversationId && activeMessengerUser ? (
                  <div className="flex items-center justify-between w-full animate-in fade-in duration-150 py-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (setActiveMessengerConversationId) setActiveMessengerConversationId(null);
                          setIsMessengerSearchActive(false);
                          setMessengerSearchQuery('');
                        }}
                        className="p-1 -ml-1 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer shrink-0"
                        title="ইনবক্সে ফিরে যান"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-100" />
                      </button>
                      <div className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-emerald-400 via-blue-500 to-cyan-400 shadow-xs">
                        <img
                          src={activeMessengerUser.avatar}
                          alt={activeMessengerUser.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#0B132B]"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1DB954] border-2 border-[#0B132B]" />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1">
                          <h2 className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight truncate">
                            {activeMessengerUser.name}
                          </h2>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 fill-blue-400/20" />
                        </div>
                        <p className="text-[10px] text-[#1DB954] font-bold leading-none mt-0.5 truncate">
                          Active now
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const meetBtn = document.getElementById('messenger-meet-trigger');
                          if (meetBtn) meetBtn.click();
                        }}
                        className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition cursor-pointer"
                        title="ভিডিও কল"
                      >
                        <Video className="w-4.5 h-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const phoneBtn = document.getElementById('messenger-phone-trigger');
                          if (phoneBtn) phoneBtn.click();
                        }}
                        className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition cursor-pointer"
                        title="ভয়েস কল"
                      >
                        <PhoneCall className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ) : isMessengerSearchActive ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-150">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={messengerSearchQuery}
                        onChange={(e) => setMessengerSearchQuery(e.target.value)}
                        placeholder="সেলার, ক্লায়েন্ট বা সার্ভিস খুঁজুন..."
                        autoFocus
                        className="w-full pl-8 pr-7 py-1 bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/80 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                      />
                      {messengerSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setMessengerSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMessengerSearchActive(false);
                        setMessengerSearchQuery('');
                      }}
                      className="px-2 py-1 rounded-lg text-slate-300 hover:text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      বাতিল
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('gigs')}
                        className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="ফিরে যান"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-200" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-white tracking-tight leading-none">Messages</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400/90 tracking-wide leading-tight mt-0.5 font-sans">PTENit Marketplace Inbox</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMessengerSearchActive(true)}
                        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="সার্চ করুন"
                      >
                        <Search className="w-4.5 h-4.5 text-slate-200" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const settingsBtn = document.getElementById('messenger-settings-trigger');
                          if (settingsBtn) settingsBtn.click();
                        }}
                        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        title="সেটিংস"
                      >
                        <Settings className="w-4.5 h-4.5 text-slate-200" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DESKTOP VIEW HEADER (>= md screen) */}
          <div className="hidden md:flex items-center justify-between gap-4 w-full">
          {/* Left Brand Logo & Active Mode Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedGig(null);
                setViewMode('buying');
                setActiveSubTab('gigs');
                setSelectedCategory('All');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 text-left cursor-pointer group"
              title="মার্কেটপ্লেস রিফ্রেশ করুন"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-bold text-xl text-white shadow-md shadow-[#1DB954]/20 transform group-hover:scale-105 transition-transform shrink-0">
                P
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-white tracking-wider font-heading group-hover:opacity-90 transition">
                    PTEN<span className="text-[#1DB954]">it</span>
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs ${
                    viewMode === 'selling'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40'
                  }`}>
                    {viewMode === 'selling' ? 'Seller' : 'Market'}
                  </span>
                </div>
                <span className="text-[9px] text-slate-300 font-medium tracking-tight">
                  Marketplace & Services
                </span>
              </div>
            </button>

            {/* Back to PTEN IT Main Website Home Button */}
            <button
              type="button"
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('home');
                }
              }}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/60 hover:border-[#1DB954]/40 transition cursor-pointer shadow-sm ml-1 group"
              title="হোম পেজে যান"
            >
              <Home className="w-4 h-4 text-slate-300 group-hover:text-[#1DB954] transition-colors" />
            </button>
          </div>

          {/* Center Search Input Bar (Fiverr Style - Desktop) */}
          <div className="flex-1 max-w-2xl mx-2 hidden md:block relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={viewMode === 'selling' ? "আপনার সার্ভিস বা ক্লায়েন্ট অর্ডার দিয়ে সার্চ করুন..." : "What service are you looking for today?"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1DB954]/40 focus:border-[#1DB954] font-english transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#1DB954] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveSubTab('gigs')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#1DB954] hover:bg-emerald-400 text-slate-950 rounded-lg transition cursor-pointer font-bold shadow"
                  title="Search"
                >
                  <Search className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* LIVE FLOATING SEARCH RESULTS DROPDOWN (DESKTOP MARKETPLACE) */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#142B4D] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 max-h-96 overflow-y-auto">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1 font-bengali flex items-center justify-between">
                  <span>মার্কেটপ্লেস গিগসমূহ ({filteredGigs.length})</span>
                  <span className="text-xs text-[#1DB954] font-normal">লাইভ ফলাফল</span>
                </div>

                {filteredGigs.length > 0 ? (
                  <div className="space-y-1.5">
                    {filteredGigs.slice(0, 5).map(gig => {
                      const gigPrice = gig.packages?.basic?.price ?? (gig as any).price ?? 2500;
                      const gigThumbnail = gig.images?.[0] || gig.sellerAvatar || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80';
                      return (
                        <div
                          key={gig.id}
                          onClick={() => {
                            setSelectedGig(gig);
                            setViewMode('buying');
                            setActiveSubTab('gigs');
                            setSearchQuery('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-slate-800/90 rounded-xl cursor-pointer transition-colors bg-slate-900/60 border border-slate-800"
                        >
                          <img
                            src={gigThumbnail}
                            alt={gig.title}
                            className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-700"
                          />
                          <div className="flex-1 min-w-0 font-bengali">
                            <p className="font-semibold text-xs text-white truncate">{gig.title}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-slate-400 truncate max-w-[200px]">{gig.sellerName} • {gig.category}</span>
                              <span className="text-xs text-[#1DB954] font-bold">
                                ৳{gigPrice.toLocaleString('en-US')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-3 text-xs font-bengali">
                    কোনো গিগ বা সার্ভিস পাওয়া যায়নি।
                  </p>
                )}

                {filteredGigs.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-700/80">
                    <button
                      onClick={() => {
                        setSelectedGig(null);
                        setViewMode('buying');
                        setActiveSubTab('gigs');
                        window.scrollTo({ top: 500, behavior: 'smooth' });
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition font-bengali cursor-pointer shadow"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>সকল ফলাফল দেখুন ({filteredGigs.length} টি গিগ)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 font-english relative">

            {currentUser && (
              <>
                {/* Notification Bell */}
                <button
                  onClick={() => {
                    openNotificationCenter();
                  }}
                  className="relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/60"
                  title="নটিফিকেশনসমূহ"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Messages Inbox */}
                <button
                  onClick={() => {
                    setIsInboxModalOpen(false);
                    setIsNotificationsOpen(false);
                    openMessengerInbox();
                  }}
                  className="relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/60"
                  title="মেসেঞ্জার - সবার এসএমএস ও অনলাইন তালিকা"
                >
                  <Mail className="w-4.5 h-4.5" />
                  {directMessages.filter(m => !m.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs">
                      {directMessages.filter(m => !m.read).length}
                    </span>
                  )}
                </button>

                {/* Saved Wishlist (Buying) - Hidden on extra small mobile to save space, available in mobile menu */}
                {viewMode === 'buying' && (
                  <button
                    onClick={() => {
                      setViewMode('buying');
                      setActiveSubTab('gigs');
                      setSelectedGig(null);
                      setShowSavedOnly(prev => !prev);
                    }}
                    className={`hidden sm:flex relative p-2 rounded-xl transition cursor-pointer items-center justify-center border ${
                      showSavedOnly
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/60'
                    }`}
                    title="ফেভারিট গিগসমূহ"
                  >
                    <Heart className={`w-4.5 h-4.5 ${showSavedOnly ? 'fill-current text-white' : savedGigIds.length > 0 ? 'text-rose-400 fill-rose-400' : 'text-slate-200'}`} />
                    {savedGigIds.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs bg-rose-500 text-white">
                        {savedGigIds.length}
                      </span>
                    )}
                  </button>
                )}

                {/* My Orders Button - Visible when buyer is logged in */}
                {viewMode === 'buying' ? (
                  <button
                    onClick={() => {
                      setViewMode('buying');
                      setActiveSubTab('my-orders');
                      setSelectedGig(null);
                      setIsProfileDropdownOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('my-orders-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 50);
                    }}
                    className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border ${
                      activeSubTab === 'my-orders'
                        ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-bold shadow-md shadow-[#1DB954]/20'
                        : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/60'
                    }`}
                    title="আমার অর্ডারসমূহ"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                    {marketplaceOrders.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#1DB954] text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs">
                        {marketplaceOrders.length}
                      </span>
                    )}
                  </button>
                ) : (
                  /* Seller New Orders Icon Button */
                  (() => {
                    const pendingOrdersCount = marketplaceOrders.filter(o => o.status === 'pending' || o.status === 'pending_approval').length;
                    return (
                      <button
                        onClick={() => {
                          setViewMode('selling');
                          setSellerSubTab('orders');
                          setSelectedGig(null);
                          setIsProfileDropdownOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById('seller-orders-section');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 50);
                        }}
                        className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border ${
                          sellerSubTab === 'orders'
                            ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-bold shadow-md shadow-[#1DB954]/20'
                            : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/60'
                        }`}
                        title="নতুন ক্লায়েন্ট অর্ডারসমূহ"
                      >
                        <ShoppingBag className="w-4.5 h-4.5" />
                        {pendingOrdersCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs animate-pulse">
                            {pendingOrdersCount}
                          </span>
                        )}
                      </button>
                    );
                  })()
                )}
              </>
            )}

            {/* Switch to Specialist Mode / Buying Mode */}
            {((currentUser && (currentUser.role === 'instructor' || currentUser.role === 'admin' || (currentUser as any).isSpecialist)) || viewMode === 'selling') && (
              <button
                onClick={() => {
                  if (viewMode === 'buying') {
                    setViewMode('selling');
                    setSelectedGig(null);
                  } else {
                    setViewMode('buying');
                    setSelectedGig(null);
                    setActiveSubTab('gigs');
                  }
                }}
                className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 bg-[#1DB954] hover:bg-[#19a34a] transition-all cursor-pointer items-center gap-1.5 shadow-md shadow-[#1DB954]/20 border border-[#1DB954]"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>{viewMode === 'buying' ? 'স্পেশালিস্ট মোড' : 'বায়ার মোড'}</span>
              </button>
            )}

            {/* User Avatar & Profile Dropdown Trigger (Desktop) */}
            {currentUser ? (
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  setIsNotificationsOpen(false);
                  setIsInboxModalOpen(false);
                }}
                className="relative group cursor-pointer flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 transition"
                title="প্রোফাইল মেনু"
              >
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-[#1DB954]/50 group-hover:scale-105 transition"
                />
                <span className="absolute -bottom-0.5 right-2 sm:right-3 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-[#1DB954] border border-slate-950 rounded-full"></span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-[#1DB954]' : ''}`} />
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
          </div>

        </div>

        {/* COMPREHENSIVE UNIFIED PROFILE POPUP MODAL/DROPDOWN (MOBILE & DESKTOP) */}
        {currentUser && isProfileDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150" 
              onClick={() => setIsProfileDropdownOpen(false)}
            />
            <div className="fixed top-12 sm:top-14 right-2 sm:right-4 left-2 sm:left-auto z-50 sm:w-80 bg-[#0F172A] border-2 border-[#1DB954] rounded-2xl shadow-2xl p-3 text-slate-100 font-bengali space-y-2 divide-y divide-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
              {/* Profile Header Card */}
              <div className="p-2.5 bg-slate-900/95 rounded-xl border border-slate-800 flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-slate-900 rounded-full"></span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-white text-xs truncate leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{currentUser.mobile || currentUser.email || 'PTENit Verified User'}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40">
                      {currentUser.role === 'admin' ? '🛡️ এডমিন একাউন্ট' : currentUser.role === 'instructor' ? '🛠️ স্পেশালিস্ট একাউন্ট' : '💼 গ্রাহক একাউন্ট'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Balance & Quick Overview Bar */}
              <div className="pt-2">
                <div className="p-2 bg-gradient-to-r from-slate-900 to-slate-800/80 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-[#1DB954]" />
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">ওয়ালেট ব্যালেন্স</p>
                      <p className="text-xs font-black text-white font-mono">৳{(currentUser as any)?.balance || '0.00'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (setActiveTab) {
                          const targetTab = currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'instructor' ? 'teacher-dashboard' : 'customer-dashboard';
                          setActiveTab(targetTab);
                        } else {
                          setActiveSubTab('settings');
                        }
                      }}
                      className="px-2 py-1 rounded bg-[#1DB954]/20 hover:bg-[#1DB954] text-[#1DB954] hover:text-slate-950 font-bold text-[10px] transition cursor-pointer border border-[#1DB954]/40"
                    >
                      টপআপ
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (setActiveTab) {
                          const targetTab = currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'instructor' ? 'teacher-dashboard' : 'customer-dashboard';
                          setActiveTab(targetTab);
                        } else {
                          setActiveSubTab('settings');
                        }
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] transition cursor-pointer border border-slate-700"
                    >
                      উইথড্র
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Navigation Options (Compact font) */}
              <div className="pt-1.5 space-y-1 text-xs">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    if (setActiveTab) {
                      const targetTab = currentUser?.role === 'admin' ? 'admin' : currentUser?.role === 'instructor' ? 'teacher-dashboard' : 'customer-dashboard';
                      setActiveTab(targetTab);
                    }
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>{currentUser?.role === 'admin' ? 'এডমিন প্যানেল' : currentUser?.role === 'instructor' ? 'স্পেশালিস্ট ড্যাশবোর্ড' : 'গ্রাহক ড্যাশবোর্ড'}</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-extrabold bg-[#1DB954]/10 px-1.5 py-0.5 rounded">ড্যাশবোর্ড</span>
                </button>

                {/* Marketplace View Mode Switcher if Specialist */}
                {currentUser && (currentUser.role === 'instructor' || currentUser.role === 'admin' || (currentUser as any).isSpecialist) && (
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setViewMode(viewMode === 'buying' ? 'selling' : 'buying');
                      setSelectedGig(null);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-[#1DB954]/20 border border-[#1DB954]/30 text-xs font-bold text-emerald-300 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#1DB954]" />
                      <span>{viewMode === 'buying' ? 'স্পেশালিস্ট মোডে স্যুইচ করুন' : 'বায়ার মোডে স্যুইচ করুন'}</span>
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setViewMode('buying');
                    setActiveSubTab('my-orders');
                    setSelectedGig(null);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>আমার প্রজেক্ট ও অর্ডারসমূহ</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">({marketplaceOrders.length})</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    if (setActiveTab) setActiveTab('courses');
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>আমার লার্নিং ও কোর্সসমূহ</span>
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setViewMode('buying');
                    setActiveSubTab('post-project');
                    setSelectedGig(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>কাস্টম প্রজেক্ট পোস্ট করুন</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setShowSavedOnly(true);
                    setActiveSubTab('gigs');
                    setSelectedGig(null);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>পছন্দের গিগসমূহ (Wishlist)</span>
                  </span>
                  <span className="text-[10px] text-rose-400 font-mono font-bold">({savedGigIds.length})</span>
                </button>
              </div>

              {/* Settings & Profile Edit Controls */}
              <div className="pt-1.5 space-y-1">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setActiveSubTab('settings');
                    setSelectedGig(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer transition"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>অ্যাকাউন্ট সেটিংস ও প্রোফাইল এডিট</span>
                </button>
              </div>

              {/* Logout Action */}
              <div className="pt-1.5">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setActiveSubTab('gigs');
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-black text-xs border border-rose-500/40 cursor-pointer transition-all shadow-md"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট করুন (Logout)</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mobile Slide-Over Navigation Menu with CATEGORIES & FILTERS INCLUDED */}
        {isMobileMarketplaceMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white border-t border-emerald-500/40 p-4 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150 max-h-[85vh] overflow-y-auto">
            {/* 0. Top Return to PTENit Main Website CTA (Requirement #3) */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMarketplaceMenuOpen(false);
                if (setActiveTab) setActiveTab('home');
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-800 to-slate-850 border-2 border-[#1DB954] text-white hover:bg-slate-800 transition-all font-bengali shadow-xl cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#1DB954] text-slate-950 flex items-center justify-center font-black shadow-md shadow-[#1DB954]/30 group-hover:scale-105 transition-transform">
                  <ArrowLeft className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-white flex items-center gap-1.5 leading-tight">
                    <span>Back PTENit</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-mono border border-[#1DB954]/40">মেইন সাইট</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">পিটেনআইটি মূল ওয়েবসাইটে ফিরে যান</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-[#1DB954] group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-emerald-400 font-bengali flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1DB954]" />
                মার্কেটপ্লেস ক্যাটাগরি ও ফিল্টার
              </span>
              <button
                onClick={() => setIsMobileMarketplaceMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Quick Navigation Shortcuts */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold font-bengali">
              <button
                onClick={() => {
                  setViewMode('buying');
                  setActiveSubTab('gigs');
                  setSelectedGig(null);
                  setSelectedCategory('All');
                  setIsMobileMarketplaceMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center gap-2 border ${
                  activeSubTab === 'gigs' && viewMode === 'buying' && selectedCategory === 'All' && !showSavedOnly
                    ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">সকল গিগ ও সার্ভিস</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('buying');
                  setActiveSubTab('post-project');
                  setSelectedGig(null);
                  setIsMobileMarketplaceMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center gap-2 border ${
                  activeSubTab === 'post-project'
                    ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <PlusCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="truncate">কাস্টম প্রজেক্ট পোস্ট</span>
              </button>

              <button
                onClick={() => {
                  setViewMode('buying');
                  setActiveSubTab('my-orders');
                  setSelectedGig(null);
                  setIsMobileMarketplaceMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center gap-2 border ${
                  activeSubTab === 'my-orders'
                    ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0 text-[#1DB954]" />
                <span className="truncate">আমার অর্ডারসমূহ ({marketplaceOrders.length})</span>
              </button>

              <button
                onClick={() => {
                  setShowSavedOnly(true);
                  setActiveSubTab('gigs');
                  setSelectedGig(null);
                  setIsMobileMarketplaceMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-left flex items-center gap-2 border ${
                  showSavedOnly
                    ? 'bg-rose-600 text-white border-rose-500 font-black'
                    : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <Heart className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="truncate">পছন্দের গিগ ({savedGigIds.length})</span>
              </button>
            </div>

            {/* 2. CATEGORY TYPES SELECTION (ক্যাটাগরি টাইপ) */}
            <div className="space-y-2 pt-2 border-t border-slate-800 font-bengali">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">📂 ক্যাটাগরি টাইপ নির্বাচন করুন</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {selectedCategory === 'All' ? 'সব সার্ভিস' : selectedCategory}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'All', label: 'সব সার্ভিস' },
                  { id: 'AI Services', label: 'এআই ও সফটওয়্যার' },
                  { id: 'Programming & Tech', label: 'প্রোগ্রামিং ও টেকনোলজি' },
                  { id: 'Graphics & Design', label: 'গ্রাফিক্স ও ডিজাইন' },
                  { id: 'Digital Marketing', label: 'ডিজিটাল মার্কেটিং' },
                  { id: 'Video & Animation', label: 'ভিডিও ও অ্যানিমেশন' },
                  { id: 'SEO & Growth', label: 'এসইও ও গ্রোথ' },
                  { id: 'Education & Training', label: 'এডুকেশন ও ট্রেনিং' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedGig(null);
                      setSelectedCategory(cat.id);
                      setShowSavedOnly(false);
                      setIsMobileMarketplaceMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded-lg font-bold text-[11px] text-left transition border truncate ${
                      (selectedCategory === cat.id || (cat.id === 'AI Services' && selectedCategory === 'AI Development')) && activeSubTab === 'gigs' && !showSavedOnly
                        ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-sm'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode switch for specialists on mobile */}
            {((currentUser && (currentUser.role === 'instructor' || currentUser.role === 'admin' || (currentUser as any).isSpecialist)) || viewMode === 'selling') && (
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setViewMode(viewMode === 'buying' ? 'selling' : 'buying');
                    setSelectedGig(null);
                    setIsMobileMarketplaceMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{viewMode === 'buying' ? 'স্পেশালিস্ট সেলার মোডে যান' : 'গ্রাহক বায়ার মোডে ফিরে যান'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* Spacer for fixed topbar on mobile */}
      {!selectedGig && viewMode !== 'selling' && (
        <div className={`${(activeSubTab === 'my-orders' || activeSubTab === 'my-courses' || activeSubTab === 'messenger') ? 'h-[102px]' : 'h-[80px]'} sm:hidden !mt-0`} />
      )}

      {/* CATEGORY & SERVICE FILTER SUB-NAVBAR (NOT FIXED ON PHONE VIEW, STICKY ON DESKTOP VIEW) */}
      {viewMode === 'buying' && !['overview', 'my-orders', 'my-courses', 'saved_gigs', 'settings', 'post-project', 'public-offers', 'messenger'].includes(activeSubTab) && !selectedGig && (
        <div className={`relative sm:sticky sm:top-[57px] z-30 !mt-0 transition-all duration-300 ease-in-out ${
          isFilterBarVisible
            ? 'translate-y-0 opacity-100 mb-2 sm:mb-6 max-h-[500px] pointer-events-auto'
            : '-translate-y-2 opacity-0 py-0 mb-2 max-h-0 overflow-hidden pointer-events-none'
        }`}>
          
          {/* PHONE VIEW: SAME DARK COLOR AS TOPBAR (#0B132B), NO BORDERS OR SPACES, LOOKS LIKE CONTINUATION OF TOPBAR, NOT FIXED */}
          <div className="sm:hidden bg-[#0B132B] -mx-2 px-2.5 py-2 text-white font-bengali">
            <div className="flex items-center gap-1.5">
              {/* 1. Category Select */}
              <div className="relative flex-1 min-w-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setActiveSubTab('gigs');
                    setSelectedGig(null);
                    setSelectedCategory(e.target.value);
                  }}
                  className={`w-full pl-2.5 pr-6 py-1 bg-slate-800/80 border-0 text-[10px] rounded-lg focus:outline-none appearance-none cursor-pointer truncate ${
                    selectedCategory !== 'All'
                      ? 'text-[#1DB954] font-extrabold'
                      : 'text-slate-200 font-bold'
                  }`}
                >
                  <option value="All" className="bg-slate-900 text-slate-100 font-normal">সব ক্যাটাগরি</option>
                  <option value="AI Services" className="bg-slate-900 text-slate-100 font-normal">এআই ও সফটওয়্যার</option>
                  <option value="Programming & Tech" className="bg-slate-900 text-slate-100 font-normal">প্রোগ্রামিং ও টেকনোলজি</option>
                  <option value="Graphics & Design" className="bg-slate-900 text-slate-100 font-normal">গ্রাফিক্স ও ডিজাইন</option>
                  <option value="Digital Marketing" className="bg-slate-900 text-slate-100 font-normal">ডিজিটাল মার্কেটিং</option>
                  <option value="Video & Animation" className="bg-slate-900 text-slate-100 font-normal">ভিডিও ও অ্যানিমেশন</option>
                  <option value="SEO & Growth" className="bg-slate-900 text-slate-100 font-normal">এসইও ও গ্রোথ</option>
                  <option value="Education & Training" className="bg-slate-900 text-slate-100 font-normal">এডুকেশন ও ট্রেনিং</option>
                </select>
                <ChevronDown className={`w-3.5 h-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${selectedCategory !== 'All' ? 'text-[#1DB954]' : 'text-slate-400'}`} />
              </div>

              {/* 2. Sort Select */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`pl-2 pr-5 py-1 bg-slate-800/80 border-0 text-[10px] rounded-lg focus:outline-none appearance-none cursor-pointer ${
                    sortBy !== 'popular'
                      ? 'text-[#1DB954] font-extrabold'
                      : 'text-slate-200 font-bold'
                  }`}
                >
                  <option value="popular" className="bg-slate-900 text-slate-100 font-normal">জনপ্রিয়তা</option>
                  <option value="price-asc" className="bg-slate-900 text-slate-100 font-normal">কম দাম</option>
                  <option value="price-desc" className="bg-slate-900 text-slate-100 font-normal">বেশি দাম</option>
                  <option value="rating" className="bg-slate-900 text-slate-100 font-normal">টপ রেটিং</option>
                </select>
                <ChevronDown className={`w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none ${sortBy !== 'popular' ? 'text-[#1DB954]' : 'text-slate-400'}`} />
              </div>

              {/* 3. Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSortBy('popular');
                  setPriceRangeFilter('all');
                  setDeliveryFilter('any');
                  setRatingFilter(0);
                  setSearchQuery('');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer active:scale-95 ${
                  (selectedCategory !== 'All' || sortBy !== 'popular' || priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0)
                    ? 'bg-rose-500 text-white font-extrabold shadow-xs'
                    : 'bg-slate-800 text-slate-300 border-0'
                }`}
              >
                রিসেট
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW MAIN BAR */}
          <div className="hidden sm:flex items-center justify-between gap-2 bg-[#0F172A] dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 text-white -mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-8 md:px-12 lg:px-16 xl:px-20 py-2.5">
            {/* Horizontal Swipe Scroll Category Pills */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap py-1">
                {[
                  { id: 'All', label: 'সব সার্ভিস' },
                  { id: 'AI Services', label: 'এআই ও সফটওয়্যার' },
                  { id: 'Programming & Tech', label: 'প্রোগ্রামিং ও টেকনোলজি' },
                  { id: 'Graphics & Design', label: 'গ্রাফিক্স ও ডিজাইন' },
                  { id: 'Digital Marketing', label: 'ডিজিটাল মার্কেটিং' },
                  { id: 'Video & Animation', label: 'ভিডিও ও অ্যানিমেশন' },
                  { id: 'SEO & Growth', label: 'এসইও ও গ্রোথ' },
                  { id: 'Education & Training', label: 'এডুকেশন ও ট্রেনিং' }
                ].map(cat => {
                  const isSelected = (selectedCategory === cat.id || (cat.id === 'AI Services' && selectedCategory === 'AI Development')) && activeSubTab === 'gigs' && !showSavedOnly;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveSubTab('gigs');
                        setSelectedGig(null);
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-3.5 py-1.5 rounded-full font-bold text-xs transition cursor-pointer shrink-0 border whitespace-nowrap text-center ${
                        isSelected
                          ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-xs font-black'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/80 hover:border-[#1DB954]/50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop Detailed Filter Toggle Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative flex items-center gap-1.5">
                <span className="text-slate-400 text-xs font-bold">সর্ট:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-2.5 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="popular">জনপ্রিয়তা</option>
                  <option value="price-asc">দাম: কম-বেশি</option>
                  <option value="price-desc">দাম: বেশি-কম</option>
                  <option value="rating">সর্বোচ্চ রেটিং</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={() => setIsFilterExpanded(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-xs sm:text-sm font-extrabold transition cursor-pointer active:scale-95 select-none ${
                  isFilterExpanded || (priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0)
                    ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-md shadow-[#1DB954]/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#1DB954]'
                }`}
                title="ফিল্টার ফিল্টারিং অপশন দেখান/লুকান"
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-current" />
                <span className="font-bold">ফিল্টার</span>
                {(priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0) && (
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Collapsible Detailed Filter Panel */}
          {isFilterExpanded && (
            <div className="hidden sm:block mt-2.5 p-3 sm:p-4 bg-slate-50/90 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 animate-in fade-in slide-in-from-top-1 duration-150 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 dark:border-slate-700/70 text-xs font-bold text-slate-700 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-slate-900 dark:text-white font-black">
                  <Filter className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>ফিল্টারিং অপশনসমূহ</span>
                </span>
                {(selectedCategory !== 'All' || priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0 || searchQuery !== '') && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setPriceRangeFilter('all');
                      setDeliveryFilter('any');
                      setRatingFilter(0);
                      setSearchQuery('');
                      setSortBy('popular');
                    }}
                    className="text-rose-500 hover:underline text-[11px] font-extrabold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> রিসেট অল
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {/* Price Filter */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">💰 বাজেট ফিল্টার:</label>
                  <select
                    value={priceRangeFilter}
                    onChange={(e) => setPriceRangeFilter(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">সব বাজেট (All Prices)</option>
                    <option value="under3k">৳৩,০০০ এর নিচে (বাজেট)</option>
                    <option value="3k-10k">৳৩,০০০ - ৳১০,০০০ (স্ট্যান্ডার্ড)</option>
                    <option value="10k-30k">৳১০,০০০ - ৳৩০,০০০ (প্রিমিয়াম)</option>
                    <option value="over30k">৳৩০,০০০+ (এন্টারপ্রাইজ)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>

                {/* Delivery Time Filter */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">⚡ ডেলিভারি সময়:</label>
                  <select
                    value={deliveryFilter}
                    onChange={(e) => setDeliveryFilter(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="any">সব ডেলিভারি সময়</option>
                    <option value="1day">২৪ ঘণ্টার মধ্যে (এক্সপ্রেস)</option>
                    <option value="3days">৩ দিনের মধ্যে</option>
                    <option value="7days">৭ দিনের মধ্যে</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>

                {/* Seller Rating Filter */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">⭐ সেলার রেটিং:</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value={0}>সব রেটিং (All Ratings)</option>
                    <option value={4.5}>৪.৫+ রেটিং (টপ সেলার)</option>
                    <option value={4.8}>৪.৮+ রেটিং (সুপার স্টার)</option>
                    <option value={5.0}>৫.০ রেটিং (পারফেক্ট)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>

                {/* Sort Option */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">🔄 সর্ট করুন:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="popular">জনপ্রিয়তা অনুযায়ী</option>
                    <option value="price-asc">দাম: কম থেকে বেশি</option>
                    <option value="price-desc">দাম: বেশি থেকে কম</option>
                    <option value="rating">সর্বোচ্চ রেটিং অনুযায়ী</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

        {/* FREELANCER SELLER PROFILE WORKSPACE VS BUYER MARKETPLACE */}
        {selectedGig ? (
          <GigDetailPage
            gig={selectedGig}
            allGigs={gigs}
            currentUser={currentUser}
            onBack={() => {
              const returnTab = localStorage.getItem('ptenit_return_tab');
              setSelectedGig(null);
              if (returnTab) {
                localStorage.removeItem('ptenit_return_tab');
                if (setActiveTab) {
                  setActiveTab(returnTab);
                }
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectGig={(g) => {
              setSelectedGig(g);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            openAuthModal={openAuthModal}
            createDirectGigOrder={createDirectGigOrder}
            setActiveTab={setActiveTab}
            onOrderSuccess={() => {
              setSelectedGig(null);
              setActiveSubTab('my-orders');
              setViewMode('buying');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : viewMode === 'selling' ? (
        /* SELLER WORKSPACE */
        <div className="space-y-6 animate-fadeIn font-bengali">
          {(() => {
            const sellerGigs = currentUser ? gigs.filter(g =>
              (currentUser.id && g.sellerId === currentUser.id) ||
              (currentUser.name && g.sellerName && g.sellerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
            ) : [];

            /* STANDALONE DEDICATED GIG CREATION PAGE - HIDES ALL OTHER DASHBOARD PANELS & HEADERS */
            if (sellerSubTab === 'create_gig') {
              return (
                <div className="space-y-6 font-bengali bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl animate-fadeIn my-2">
                  
                  {/* TOP PAGE HEADER WITH CLEAN X CLOSE BUTTON */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center font-black shrink-0 shadow-inner">
                        <PlusCircle className="w-7 h-7 text-[#1DB954]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                            নতুন প্রজেক্ট পোস্ট ও কাস্টমাইজেশন
                          </h1>
                          <span className="px-3 py-1 bg-[#1DB954]/20 text-[#1DB954] text-xs sm:text-sm font-black rounded-full border border-[#1DB954]/40">
                            ৩টি প্রাইসিং প্যাকেজ এডিটর
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-slate-500 font-bold mt-1">
                          আপনার স্কিল ও প্রজেক্টের বিস্তারিত তথ্য, ৩টি প্রাইসিং প্যাকেজ, মিডিয়া ও এফএকিউ সহ লাইভ করুন
                        </p>
                      </div>
                    </div>

                    {/* PROMINENT CLEAN CLOSE BUTTON (NO DOUBLE X) */}
                    <button
                      type="button"
                      onClick={() => setSellerSubTab('gigs')}
                      className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 transition cursor-pointer flex items-center gap-2 text-sm sm:text-base font-black shrink-0 active:scale-95 shadow-md"
                      title="বাতিল করে ফিরে যান"
                    >
                      <X className="w-5 h-5 text-rose-500" />
                      <span>বন্ধ করুন</span>
                    </button>
                  </div>

                  {sellerGigs.length >= 6 ? (
                    <div className="p-6 bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl text-rose-600 dark:text-rose-400 text-base font-bold space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 animate-bounce" />
                        <h3 className="text-lg font-black">সর্বোচ্চ ৬টি প্রজেক্ট আপলোড সীমা অতিক্রম করেছে!</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        একজন সেলার হিসেবে আপনার অ্যাকাউন্টে ইতোমধ্যে সর্বোচ্চ ৬টি সক্রিয় প্রজেক্ট রয়েছে। নতুন কোনো প্রজেক্ট পোস্ট করতে চাইলে পূর্বের কোনো অনাবশ্যক প্রজেক্ট ডিলেট করুন।
                      </p>
                      <button
                        onClick={() => setSellerSubTab('gigs')}
                        className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition shadow cursor-pointer flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        <span>প্রজেক্ট লিস্টে ফেরত যান</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateGigSubmit} className="space-y-8">
                      
                      {/* Step 1: Core Overview & Meta */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                          <h3 className="text-base sm:text-lg font-black uppercase text-[#1DB954] flex items-center gap-2">
                            <Layers className="w-5 h-5" />
                            <span>১. মূল তথ্য, প্রজেক্ট টাইটেল ও সার্চ ট্যাগস</span>
                          </h3>
                          <button
                            type="button"
                            onClick={handleOptimizeWithGemini}
                            disabled={isAiOptimizing}
                            className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Sparkles className="w-4 h-4 fill-slate-950" />
                            <span>{isAiOptimizing ? 'AI জেনারেট হচ্ছে...' : 'Gemini AI দিয়ে টাইটেল ও বর্ণনা অটো অপটিমাইজ করুন ✨'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                              ক্যাটাগরি (Category) <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={newGigCategory}
                              onChange={(e) => setNewGigCategory(e.target.value)}
                              className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                            >
                              <option value="Programming & Tech">Programming & Tech</option>
                              <option value="AI Services">AI Services</option>
                              <option value="Graphics & Design">Graphics & Design</option>
                              <option value="Digital Marketing">Digital Marketing</option>
                              <option value="Video & Animation">Video & Animation</option>
                              <option value="SEO & Growth">SEO & Growth</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                              অফার টাইপ / ব্যাজ (Offer Badge) <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={newGigOfferBadge}
                              onChange={(e) => setNewGigOfferBadge(e.target.value)}
                              className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] font-bold font-bengali"
                            >
                              <option value="আগে কাজ শুরু">⚡ আগে কাজ শুরু (Work First)</option>
                              <option value="৫% ছাড়">🎁 ৫% ছাড় (5% Discount)</option>
                              <option value="১০% ছাড়">🎁 ১০% ছাড় (10% Discount)</option>
                              <option value="২০% ছাড়">🎁 ২০% ছাড় (20% Discount)</option>
                              <option value="৩০% ছাড়">🎁 ৩০% ছাড় (30% Discount)</option>
                              <option value="৫০% ছাড়">🎁 ৫০% ছাড় (50% Discount)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                              প্রজেক্ট টাইটেল (Title) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="যেমন: I will build a full stack AI web application with React & Node.js..."
                              value={newGigTitle}
                              onChange={(e) => setNewGigTitle(e.target.value)}
                              className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                            />
                          </div>
                        </div>

                        {/* Search Keywords / Tags */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                            সার্চ কিওয়ার্ড ও ট্যাগস (Keywords & Tags)
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: React, Node.js, AI Integration, Web App, Frontend"
                            value={newGigTags}
                            onChange={(e) => setNewGigTags(e.target.value)}
                            className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                          />
                          <p className="text-xs sm:text-sm text-slate-500 font-medium">কমা (,) দিয়ে আলাদা করে কিওয়ার্ড টাইপ করুন, যা বায়ারদের সার্চে আপনার প্রজেক্ট খুঁজে পেতে সাহায্য করবে।</p>
                        </div>
                      </div>

                      {/* Step 2: 3-Tier Packages Builder */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-black uppercase text-[#1DB954] flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            <span>২. ৩টি প্যাকেজ কনফিগারেশন (3 Packages Pricing & Scope)</span>
                          </h3>
                          <span className="text-xs sm:text-sm text-slate-500 font-bold">Basic, Standard, Premium Tiers</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* BASIC PACKAGE */}
                          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-sm hover:border-[#1DB954] transition">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="px-3 py-1 bg-emerald-500/10 text-[#1DB954] font-black text-xs sm:text-sm rounded-lg uppercase">
                                Basic Tier
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-slate-400">শুরু মূল্য</span>
                            </div>

                            <div className="space-y-3.5 text-sm">
                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্যাকেজ নাম:</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="যেমন: Basic Starter"
                                  value={newBasicTitle}
                                  onChange={(e) => setNewBasicTitle(e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রাইস (৳ BDT):</label>
                                <input
                                  type="number"
                                  required
                                  placeholder="২৫০০"
                                  value={newBasicPrice}
                                  onChange={(e) => setNewBasicPrice(Number(e.target.value))}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black text-[#1DB954]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ডেলিভারি (দিন):</label>
                                  <input
                                    type="number"
                                    required
                                    min={1}
                                    placeholder="3"
                                    value={newBasicDelivery}
                                    onChange={(e) => setNewBasicDelivery(Number(e.target.value))}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">রিভিশন:</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="১টি"
                                    value={newBasicRevisions}
                                    onChange={(e) => setNewBasicRevisions(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ:</label>
                                <textarea
                                  rows={2}
                                  placeholder="যেমন: কোর ডিজাইন ও ডেলিভারি, রেসপন্সিভ লেআউট, সোর্স ফাইল"
                                  value={newBasicDesc}
                                  onChange={(e) => setNewBasicDesc(e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                                />
                              </div>
                            </div>
                          </div>

                          {/* STANDARD PACKAGE */}
                          <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-5 space-y-4 shadow-md hover:border-blue-500 transition">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 font-black text-xs sm:text-sm rounded-lg uppercase">
                                Standard Tier
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-blue-500">বেস্ট ভ্যালু</span>
                            </div>

                            <div className="space-y-3.5 text-sm">
                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্যাকেজ নাম:</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="যেমন: Standard Pro"
                                  value={newStandardTitle}
                                  onChange={(e) => setNewStandardTitle(e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রাইস (৳ BDT):</label>
                                <input
                                  type="number"
                                  required
                                  placeholder="৬০০০"
                                  value={newStandardPrice}
                                  onChange={(e) => setNewStandardPrice(Number(e.target.value))}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black text-blue-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ডেলিভারি (দিন):</label>
                                  <input
                                    type="number"
                                    required
                                    min={1}
                                    placeholder="2"
                                    value={newStandardDelivery}
                                    onChange={(e) => setNewStandardDelivery(Number(e.target.value))}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">রিভিশন:</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="৩টি"
                                    value={newStandardRevisions}
                                    onChange={(e) => setNewStandardRevisions(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ:</label>
                                <textarea
                                  rows={2}
                                  placeholder="যেমন: অ্যাডভান্স ডিজাইন, ডাটাবেজ ইন্টিগ্রেশন, কাস্টম ব্যাকএন্ড API"
                                  value={newStandardDesc}
                                  onChange={(e) => setNewStandardDesc(e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                                />
                              </div>
                            </div>
                          </div>

                          {/* PREMIUM PACKAGE */}
                          <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 space-y-4 shadow-md hover:border-amber-500 transition">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 font-black text-xs sm:text-sm rounded-lg uppercase">
                                Premium Tier
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-amber-500">ফুল প্রজেক্ট</span>
                            </div>

                            <div className="space-y-3.5 text-sm">
                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্যাকেজ নাম:</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="যেমন: Premium Enterprise"
                                  value={newPremiumTitle}
                                  onChange={(e) => setNewPremiumTitle(e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                                />
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রাইস (৳ BDT):</label>
                                <input
                                  type="number"
                                  required
                                  placeholder="১৫০০০"
                                  value={newPremiumPrice}
                                  onChange={(e) => setNewPremiumPrice(Number(e.target.value))}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black text-amber-500"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ডেলিভারি (দিন):</label>
                                  <input
                                    type="number"
                                    required
                                    min={1}
                                    placeholder="1"
                                    value={newPremiumDelivery}
                                    onChange={(e) => setNewPremiumDelivery(Number(e.target.value))}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">রিভিশন:</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="অসীম (Unlimited)"
                                    value={newPremiumRevisions}
                                    onChange={(e) => setNewPremiumRevisions(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ:</label>
                                <textarea
                                  rows={2}
                                  placeholder="যেমন: সম্পূর্ণ ফুল স্ট্যাক প্রজেক্ট, AI চ্যাটবট, লাইফটাইম মেইনটেন্যান্স"
                                  value={newPremiumDesc}
                                  onChange={(e) => setNewPremiumDesc(e.target.value)}
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Step 3: Media & Showcase */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="text-base sm:text-lg font-black uppercase text-[#1DB954] flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <ImageIcon className="w-5 h-5" />
                          <span>৩. মিডিয়া, থাম্বনেইল ও ভিডিও শোকেস</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-800 dark:text-slate-200">
                              থাম্বনেইল ইমেজ URL: <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="url"
                              required
                              placeholder="যেমন: https://images.unsplash.com/photo-..."
                              value={newGigThumbnail}
                              onChange={(e) => setNewGigThumbnail(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base"
                            />
                            {newGigThumbnail && (
                              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                                <img src={newGigThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-800 dark:text-slate-200">
                              গ্যালারি স্যাম্পল ছবি URL:
                            </label>
                            <input
                              type="url"
                              placeholder="যেমন: https://images.unsplash.com/photo-..."
                              value={newGigGalleryPic}
                              onChange={(e) => setNewGigGalleryPic(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base"
                            />
                            {newGigGalleryPic && (
                              <div className="mt-2 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                                <img src={newGigGalleryPic} alt="Gallery Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-800 dark:text-slate-200">
                              ডেমো ভিডিও URL (YouTube/Vimeo):
                            </label>
                            <input
                              type="url"
                              placeholder="https://youtube.com/watch?v=..."
                              value={newGigVideoUrl}
                              onChange={(e) => setNewGigVideoUrl(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base"
                            />
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">বায়ারদের আকৃষ্ট করতে ডেমো প্রজেক্ট ভিডিও লিংক দিন</p>
                          </div>
                        </div>
                      </div>

                      {/* Step 4: Description */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="text-base sm:text-lg font-black uppercase text-[#1DB954] flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <FileText className="w-5 h-5" />
                          <span>৪. বিস্তারিত প্রজেক্ট বিবরণ (Full Project Description)</span>
                        </h3>

                        <div className="space-y-1.5 text-sm">
                          <label className="block font-bold text-slate-800 dark:text-slate-200">
                            সার্ভিস ও প্রজেক্ট বিবরণ <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            rows={5}
                            required
                            placeholder="আপনার প্রজেক্ট সম্পর্কে বিস্তারিত বর্ণনা লিখুন। ক্লায়েন্ট কেন আপনাকে নির্বাচন করবে, আপনার কাজের সুবিধা ইত্যাদি।"
                            value={newGigDesc}
                            onChange={(e) => setNewGigDesc(e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                          />
                        </div>
                      </div>

                      {/* Step 5: Buyer Requirements */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="text-base sm:text-lg font-black uppercase text-[#1DB954] flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>৫. ক্লায়েন্ট রিকোয়ারমেন্টস (Buyer Instructions & Requirements)</span>
                        </h3>

                        <div className="space-y-1.5 text-sm">
                          <label className="block font-bold text-slate-800 dark:text-slate-200">
                            অর্ডারের কাজ শুরু করার জন্য বায়ারকে কী কী সরবরাহ করতে হবে?
                          </label>
                          <textarea
                            rows={3}
                            placeholder="যেমন:&#10;১. প্রজেক্টের লগো ও ব্র্যান্ড কালার নির্দেশিকা&#10;২. প্রয়োজনীয় কনটেন্ট ও ইমেজ ফাইল&#10;৩. হোস্টিং/সার্ভার এক্সেস (যদি প্রয়োজন হয়)"
                            value={newGigRequirements}
                            onChange={(e) => setNewGigRequirements(e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                          />
                        </div>
                      </div>

                      {/* Step 6: FAQ Setup */}
                      <div className="p-6 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <h3 className="text-base sm:text-lg font-black uppercase text-[#1DB954] flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <HelpCircle className="w-5 h-5" />
                          <span>৬. সচরাচর জিজ্ঞাসিত প্রশ্নাবলি (Frequently Asked Questions - FAQ)</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-800 dark:text-slate-200">
                              প্রশ্ন (Question):
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: ডেলিভারির পর কি ফ্রি সাপোর্ট পাবো?"
                              value={newGigFaqQ}
                              onChange={(e) => setNewGigFaqQ(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block font-bold text-slate-800 dark:text-slate-200">
                              উত্তর (Answer):
                            </label>
                            <input
                              type="text"
                              placeholder="যেমন: হ্যাঁ, প্রতিটি প্যাকেজে ৩০ দিন পর্যন্ত ফ্রি টেকনিক্যাল সাপোর্ট পাবেন।"
                              value={newGigFaqA}
                              onChange={(e) => setNewGigFaqA(e.target.value)}
                              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>

                      {createGigSuccess && (
                        <div className="p-4 bg-emerald-500/20 text-[#1DB954] font-black text-base rounded-2xl text-center border border-[#1DB954] animate-bounce shadow-lg">
                          ✓ আপনার ৩টি প্যাকেজ সহ নতুন প্রজেক্ট সফলভাবে পোস্ট ও লাইভ করা হয়েছে!
                        </div>
                      )}

                      {/* ACTION FOOTER */}
                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setSellerSubTab('gigs')}
                          className="px-6 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-extrabold text-sm sm:text-base rounded-xl transition cursor-pointer flex items-center gap-2 active:scale-95"
                        >
                          <X className="w-5 h-5" />
                          <span>বাতিল</span>
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-sm sm:text-base rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                          <CheckCircle2 className="w-5 h-5 fill-slate-950" />
                          <span>প্রজেক্ট ও ৩টি প্যাকেজ পাবলিশ করুন 🚀</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            }

            return (
              <>
                {/* SPECIALIST DASHBOARD 2-COLUMN LAYOUT WITH LEFT SIDEBAR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 font-bengali animate-fadeIn">
                  
                  {/* UNIFIED SINGLE CONTAINER: COVER BANNER + ACTIONS + PROFILE INFO */}
                  <div className="lg:col-span-3 xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl text-slate-900 dark:text-white shadow-xl shadow-slate-950/5 dark:shadow-black/40 font-bengali relative z-20 overflow-visible transition-all duration-300">
                    
                    {/* 1. DYNAMIC TOP COVER BANNER: Auto-expands gracefully when live offers exist */}
                    <div className={`relative w-full overflow-hidden rounded-t-3xl bg-slate-950 flex flex-col justify-between p-4 sm:p-5 transition-all duration-500 ease-in-out ${
                      activeOffersList.length > 0
                        ? 'min-h-[200px] sm:min-h-[210px] md:min-h-[220px] pb-5 sm:pb-6'
                        : 'min-h-[135px] sm:min-h-[150px] md:min-h-[165px] pb-4'
                    }`}>
                      {/* Cover Photo / Texture with Dark/Emerald Tint */}
                      <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
                        alt="Cover Banner"
                        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-emerald-950/30 to-slate-950/90 pointer-events-none" />

                      {/* Top Overlay Controls on Cover: Left Badge & Right Action Buttons */}
                      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3">
                        
                        {/* Left: Specialist Title / Badge */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400/40">
                            <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
                          </div>
                          <div className="text-white">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h1 className="text-base sm:text-lg lg:text-xl font-black text-white drop-shadow-md tracking-tight">
                                স্পেশালিস্ট ড্যাশবোর্ড
                              </h1>
                              <span className="px-3 py-1 bg-amber-500/25 backdrop-blur-md text-amber-300 text-xs font-black rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1.5">
                                <Crown className="w-3.5 h-3.5 text-amber-300" />
                                <span>সেলার ও মেন্টর হাব</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Transparent / Glassmorphism Action Bar */}
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                          
                          {/* 1. PTEN IT Home Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (setActiveTab) setActiveTab('home');
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md text-slate-200 border border-white/15 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer active:scale-95 shadow-sm"
                            title="PTEN IT হোম পেজে ফিরে যান"
                          >
                            <Home className="w-4 h-4 text-emerald-400" />
                            <span className="hidden sm:inline">হোম</span>
                          </button>

                          {/* 2. Buyer Marketplace Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setViewMode('buying');
                              setActiveSubTab('gigs');
                              setSelectedGig(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-400 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md active:scale-95"
                            title="বায়ার মার্কেটপ্লেসে ফিরে যান"
                          >
                            <Store className="w-4 h-4 text-slate-950" />
                            <span>বায়ার মোড</span>
                          </button>

                          {/* 3. Messenger / Direct Inbox Button (মেসেঞ্জার) */}
                          <button
                            id="messenger-direct-btn"
                            onClick={() => {
                              setIsCentralNotificationOpen(false);
                              setIsProfileDropdownOpen(false);
                              openMessengerInbox();
                            }}
                            className="relative p-2 sm:p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center border backdrop-blur-md shadow-sm active:scale-95 bg-slate-900/60 hover:bg-slate-900/90 text-slate-200 border-white/15"
                            title="মেসেঞ্জার ও ক্লায়েন্ট চ্যাট"
                          >
                            <Mail className="w-4 h-4 text-slate-200" />
                            {directMessages.filter(m => !m.read).length > 0 && (
                              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#1DB954] text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-md">
                                {directMessages.filter(m => !m.read).length}
                              </span>
                            )}
                          </button>

                          {/* 4. Central Notification Hub (নোটিফিকেশন) */}
                          <button
                            id="central-notification-btn"
                            onClick={() => {
                              setIsCentralNotificationOpen(!isCentralNotificationOpen);
                              setIsInboxModalOpen(false);
                              setIsProfileDropdownOpen(false);
                            }}
                            className={`relative p-2 sm:p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center border backdrop-blur-md shadow-sm active:scale-95 ${
                              isCentralNotificationOpen
                                ? 'bg-[#1DB954] text-slate-950 border-[#1DB954]'
                                : 'bg-slate-900/60 hover:bg-slate-900/90 text-slate-200 border-white/15'
                            }`}
                            title="সেন্ট্রাল নোটিফিকেশন হাব (সকল আপডেট)"
                          >
                            <Bell className={`w-4 h-4 ${isCentralNotificationOpen ? 'text-slate-950 fill-slate-950' : 'text-slate-200'}`} />
                            {notifications.filter(n => !n.read).length > 0 && (
                              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-md animate-pulse">
                                {notifications.filter(n => !n.read).length}
                              </span>
                            )}
                          </button>

                          {/* 5. Profile & Dropdown */}
                          {currentUser && (
                            <div className="relative">
                              <button
                                onClick={() => {
                                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                  setIsNotificationsOpen(false);
                                  setIsInboxModalOpen(false);
                                }}
                                className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-white/15 transition cursor-pointer shadow-sm"
                                title="প্রোফাইল অ্যাকাউন্ট মেনু"
                              >
                                <img
                                  src={activeAccount.avatar || currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                                  alt={activeAccount.name}
                                  className="w-6 h-6 rounded-full object-cover border border-[#1DB954]"
                                />
                                <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Profile Dropdown Popup */}
                              {isProfileDropdownOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setIsProfileDropdownOpen(false)}
                                  />
                                  <div className="absolute right-0 top-10 z-50 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 font-bengali text-white animate-fadeIn">
                                    <div className="px-3.5 py-2 border-b border-slate-800 flex items-center gap-2">
                                      <img
                                        src={activeAccount.avatar || currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                                        alt={activeAccount.name}
                                        className="w-7 h-7 rounded-full object-cover border border-[#1DB954]"
                                      />
                                      <div className="min-w-0">
                                        <p className="text-xs font-black text-white truncate">{activeAccount.name}</p>
                                        <p className="text-[10px] text-amber-400 font-bold truncate">⚡ সেলার প্রো</p>
                                      </div>
                                    </div>

                                    <div className="py-1">
                                      <button
                                        onClick={() => {
                                          setIsProfileDropdownOpen(false);
                                          setIsEditProfileModalOpen(true);
                                        }}
                                        className="w-full px-3.5 py-1.5 text-left text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-[#1DB954] flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                                        <span>সেটিং ও প্রোফাইল</span>
                                      </button>
                                    </div>

                                    <div className="pt-1 border-t border-slate-800">
                                      <button
                                        onClick={() => {
                                          setIsProfileDropdownOpen(false);
                                          setViewMode('buying');
                                          logout();
                                        }}
                                        className="w-full px-3.5 py-1.5 text-left text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition cursor-pointer"
                                      >
                                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                                        <span>লগ আউট</span>
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}

                          {/* Quick Logout Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setViewMode('buying');
                              logout();
                            }}
                            className="p-1.5 sm:p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 backdrop-blur-md text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
                            title="লগ আউট"
                          >
                            <LogOut className="w-4 h-4 text-rose-300" />
                          </button>
                        </div>
                      </div>

                      {/* LIVE OFFER & ORDER NOTIFICATION BANNER (প্রিমিয়াম স্লিক ও আকর্ষণীয় ব্যাংকনোট ক্যাশ-ক্রেডিট কার্ড) */}
                      {activeOffersList.length > 0 && activeOffersList[activeOfferIndex % activeOffersList.length] && (
                        <div className="relative z-20 mt-3 sm:mt-4 max-w-4xl mx-auto animate-slideUp">
                          {(() => {
                            const currentOffer = activeOffersList[activeOfferIndex % activeOffersList.length];
                            const timerPercentage = totalOfferDuration > 0 ? (offerCountdown / totalOfferDuration) * 100 : 0;
                            const isBeingActioned = justActionedOfferId === currentOffer.id;
                            const sellerPayout = Math.round(currentOffer.budget * 0.9);

                            return (
                              <div
                                onMouseEnter={() => setIsOfferPaused(true)}
                                onMouseLeave={() => setIsOfferPaused(false)}
                                className="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 shadow-2xl text-slate-900 dark:text-white transition-all duration-300 group hover:border-emerald-500/60 font-bengali"
                              >
                                {/* Subtle Ambient Glows */}
                                <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl pointer-events-none bg-emerald-500/15 dark:bg-emerald-500/20" />
                                <div className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full blur-3xl pointer-events-none bg-teal-500/15 dark:bg-teal-500/20" />

                                {/* Top Sub-Bar: Client Info, Type Badge, Show All Orders Button & Live Countdown */}
                                <div className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    {/* Client Profile Pill */}
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 shrink-0">
                                      <img
                                        src={currentOffer.clientAvatar}
                                        alt={currentOffer.clientName}
                                        className="w-4 h-4 rounded-full object-cover border border-emerald-500 shrink-0"
                                      />
                                      <span className="truncate max-w-[130px] sm:max-w-[180px]">{currentOffer.clientName}</span>
                                      {currentOffer.isVerified && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                                      )}
                                    </div>

                                    {/* Order Type Tag */}
                                    {currentOffer.type === 'personal' ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 rounded-full text-[11px] font-extrabold border border-amber-400/40">
                                        <Lock className="w-3 h-3 text-amber-500" />
                                        ডিরেক্ট পার্সোনাল অর্ডার
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-extrabold border border-emerald-500/30">
                                        <Sparkles className="w-3 h-3 text-[#1DB954]" />
                                        {currentOffer.typeLabel.replace(/^[⚡🔒]\s*/, '')}
                                      </span>
                                    )}

                                    {/* Time and location */}
                                    <span className="hidden md:inline-flex text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                                      • {currentOffer.postedTime || '১০ মিনিট আগে'}
                                    </span>
                                  </div>

                                  {/* Right side: 7 Orders Show Button + Live Countdown Badge */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    {/* 7 Orders Show Button (সকল অফার দেখুন) */}
                                    <button
                                      type="button"
                                      onClick={() => setIsSeeAllOffersModalOpen(true)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-full border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
                                      title="সকল লাইভ অফার ও অর্ডার তালিকা দেখুন"
                                    >
                                      <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954]" />
                                      <span className="font-mono text-[11px] text-[#1DB954]">{activeOffersList.length}</span>
                                      <span className="hidden sm:inline">অর্ডার শো</span>
                                    </button>

                                    {/* Live Countdown Badge */}
                                    <div
                                      className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-400/60 text-amber-800 dark:text-amber-300 rounded-full text-xs font-black shrink-0 shadow-xs"
                                      title={isOfferPaused ? "পজ করা আছে (মাউস সরানো হলে আবার চলবে)" : "অফার গ্রহণের সময়সীমা"}
                                    >
                                      <Clock className={`w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ${isOfferPaused ? '' : 'animate-spin'}`} style={{ animationDuration: '4s' }} />
                                      <span className="font-mono font-black text-xs">
                                        {offerCountdown}s বাকি
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Main Banner Content */}
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                                  {/* Left: Cash Credit & Net Earnings */}
                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="px-3.5 py-2 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 shadow-sm flex items-center gap-2.5">
                                      <div className="w-9 h-9 rounded-xl bg-[#1DB954]/15 dark:bg-[#1DB954]/25 flex items-center justify-center shrink-0">
                                        <Banknote className="w-5 h-5 text-[#1DB954] animate-pulse" />
                                      </div>
                                      <div>
                                        <div className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-200 font-mono tracking-tight leading-none flex items-center gap-0.5">
                                          <span>+৳</span>
                                          <span>{currentOffer.budget.toLocaleString('bn-BD')}</span>
                                        </div>
                                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                                          ক্যাশ ক্রেডিট
                                        </div>
                                      </div>
                                    </div>

                                    <div className="hidden sm:block text-left pl-1">
                                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                                        আপনার আয়:
                                      </span>
                                      <span className="text-xs font-black text-[#1DB954] font-mono">
                                        ৳{sellerPayout.toLocaleString('bn-BD')}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Middle: Project Title & Deliverables / Deadlines */}
                                  <div className="min-w-0 flex-1 space-y-1.5">
                                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate" title={currentOffer.title}>
                                      {currentOffer.title}
                                    </h4>

                                    <div className="flex items-center gap-2 flex-wrap text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                        ⏱️ {currentOffer.deadline}
                                      </span>
                                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                        💼 {currentOffer.category}
                                      </span>
                                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-500/20 sm:hidden">
                                        • আয়: ৳{sellerPayout.toLocaleString('bn-BD')}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Right: Actions (View Details, Receive Button & Switcher) */}
                                  <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                                    {/* View Details Button */}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOfferForModal(currentOffer)}
                                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                                      title="অর্ডারের বিবরণী দেখুন"
                                    >
                                      <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                      <span>ভিউ ডিটেইলস</span>
                                    </button>

                                    {/* Receive Button (রিসিভ করুন) */}
                                    {isBeingActioned && offerActionType === 'received' ? (
                                      <button
                                        disabled
                                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-500/30 animate-pulse shrink-0"
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-slate-950" />
                                        <span>রিসিভড!</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleReceiveLiveOffer(currentOffer)}
                                        className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer shrink-0"
                                      >
                                        <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                                        <span>রিসিভ</span>
                                        {activeOffersList.length > 0 && (
                                          <span className="ml-1 px-1.5 py-0.5 bg-slate-950 text-[#1DB954] text-[10px] font-black rounded-full leading-none">
                                            ({activeOffersList.length})
                                          </span>
                                        )}
                                      </button>
                                    )}

                                    {/* Multi Offer Switcher */}
                                    {activeOffersList.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => setActiveOfferIndex((curr) => (curr + 1) % activeOffersList.length)}
                                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95 shrink-0"
                                        title="পরবর্তী অফার দেখুন"
                                      >
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Micro Animated Progress Line */}
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-teal-400 via-[#1DB954] to-emerald-500 h-full rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${timerPercentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* 2. BOTTOM PROFILE INFO AREA OVERLAPPING COVER BANNER WITH GENEROUS SPACING */}
                    <div className="px-5 sm:px-8 pb-6 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/50">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        
                        {/* Left Side: Avatar (Overlapping Cover) + Name + Title + Skills Chips */}
                        <div className="flex items-start sm:items-center gap-4 min-w-0">
                          <div className="relative -mt-10 sm:-mt-12 shrink-0 z-10">
                            <img
                              src={activeAccount.avatar || currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                              alt={activeAccount.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
                            />
                            <span className="w-4 h-4 rounded-full bg-[#1DB954] border-2 border-white dark:border-slate-900 absolute bottom-1 right-1 shadow-sm" title="Online Now"></span>
                          </div>

                          <div className="min-w-0 space-y-1 pt-1 sm:pt-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">
                                {activeAccount.name}
                              </h2>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/30">
                                <BadgeCheck className="w-3.5 h-3.5 text-[#1DB954]" />
                                {activeAccount.role}
                              </span>
                              <span className="text-amber-500 font-black text-xs flex items-center gap-0.5">
                                ★ 5.0 <span className="text-slate-400 font-normal text-[10px]">(52)</span>
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate">
                              @{activeAccount.name ? activeAccount.name.toLowerCase().replace(/\s+/g, '') : 'ptenitadmin'} | {editProfileTitle}
                            </p>

                            {/* Compact Skills Chips */}
                            <div className="flex flex-wrap items-center gap-1 pt-0.5">
                              {editProfileSkills.split(',').slice(0, 4).map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                                  {skill.trim()}
                                </span>
                              ))}
                              {editProfileSkills.split(',').length > 4 && (
                                <span className="text-[10px] text-slate-400 font-bold">+{editProfileSkills.split(',').length - 4} more</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Side: 1-Click Portfolio Sync + 3-Dot More Info & Edit Button */}
                        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-between lg:justify-end mt-2 lg:mt-0">
                          
                          {/* 1-Click Portfolio Sync Bar */}
                          <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex-1 sm:flex-initial">
                            <span className="text-xs font-black text-slate-700 dark:text-amber-400 flex items-center gap-1 shrink-0 hidden sm:flex">
                              <ExternalLink className="w-3.5 h-3.5 text-[#1DB954]" />
                              1-Click Sync:
                            </span>
                            <input
                              type="url"
                              placeholder="e.g. behance.net/username..."
                              value={portfolioUrlInput}
                              onChange={(e) => setPortfolioUrlInput(e.target.value)}
                              className="w-36 sm:w-44 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1DB954]"
                            />
                            <button
                              onClick={handleImportPortfolio}
                              disabled={isImportingPortfolio}
                              className="px-3 py-1 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition shrink-0"
                            >
                              {isImportingPortfolio ? '...' : 'Sync'}
                            </button>
                          </div>

                          {/* Premium Sound Effect Toggle 1-Icon Button (Master Audio Control) */}
                          <button
                            type="button"
                            onClick={() => {
                              const nextState = !isToolkitSoundOn;
                              setIsToolkitSoundOn(nextState);
                              setIsOfferSoundEnabled(nextState);
                              try {
                                localStorage.setItem('ptenit_toolkit_sound', String(nextState));
                                localStorage.setItem('ptenit_offer_sound_enabled', JSON.stringify(nextState));
                              } catch {}
                              if (!nextState) {
                                stopOfferNotificationSound();
                              }
                              playToolkitSound(nextState ? 'unmute' : 'mute', true);
                            }}
                            className={`relative p-2.5 rounded-2xl transition flex items-center justify-center border cursor-pointer active:scale-90 shadow-xs group ${
                              isToolkitSoundOn
                                ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-[#1DB954] border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                                : 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-500 border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                            }`}
                            title={isToolkitSoundOn ? "সাউন্ড অন আছে (মিউট করতে ক্লিক করুন)" : "সাউন্ড বন্ধ আছে (চালু করতে ক্লিক করুন)"}
                          >
                            {isToolkitSoundOn ? (
                              <>
                                <Volume2 className="w-4 h-4 text-[#1DB954] group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1DB954] ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                              </>
                            ) : (
                              <>
                                <VolumeX className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                              </>
                            )}
                          </button>

                  {/* 3-Dots Button -> Opens Menu with Full Profile Info, Edit Profile, Account Switcher */}
                  <div className="relative shrink-0 z-30">
                    <button
                      onClick={() => setIsHeaderMoreMenuOpen(!isHeaderMoreMenuOpen)}
                      className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-1 font-bold text-xs"
                      title="প্রোফাইল ডিটেইলস, এডিট ও সেটিংস (3-Dots)"
                    >
                      <MoreVertical className="w-4 h-4 text-[#1DB954]" />
                    </button>

                    {isHeaderMoreMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-50 cursor-default"
                          onClick={() => setIsHeaderMoreMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[60] p-4 space-y-3 font-bengali text-xs animate-fadeIn max-h-[85vh] overflow-y-auto ring-1 ring-black/10 dark:ring-white/10">
                          
                          {/* Full Profile Info Section */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                              <span className="font-black text-slate-900 dark:text-white text-xs">ফুল প্রোফাইল ইনফরমেশন</span>
                              <span className="text-[10px] bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded-full font-bold">Verified</span>
                            </div>
                            
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              <strong>বায়ো:</strong> {editProfileBio}
                            </p>

                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400 block text-[9px]">লোকেশন</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#1DB954]" /> Bangladesh
                                </span>
                              </div>
                              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400 block text-[9px]">রেসপন্স টাইম</span>
                                <span className="font-bold text-emerald-600 dark:text-[#1DB954] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-500" /> ~15 mins
                                </span>
                              </div>
                            </div>

                            <div className="pt-1">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">সকল স্কিলস:</span>
                              <div className="flex flex-wrap gap-1">
                                {editProfileSkills.split(',').map((skill, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md border border-slate-200 dark:border-slate-800">
                                    {skill.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Edit Profile Action Button */}
                          <button
                            onClick={() => {
                              setIsEditProfileModalOpen(true);
                              setIsHeaderMoreMenuOpen(false);
                            }}
                            className="w-full py-2.5 px-3 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs"
                          >
                            <Edit className="w-4 h-4 text-slate-950" />
                            <span>প্রোফাইল এডিট করুন (Edit Profile)</span>
                          </button>

                          <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                          {/* Account Switcher Section inside 3-dot menu */}
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase text-slate-400">অ্যাকাউন্ট সুইচ করুন</p>
                            <div className="space-y-1 max-h-36 overflow-y-auto">
                              {accountsList.map((acc) => (
                                <button
                                  key={acc.id}
                                  onClick={() => {
                                    setActiveAccount(acc);
                                    setEditProfileName(acc.name);
                                    setIsHeaderMoreMenuOpen(false);
                                    setSwitchSuccessMsg(`সফলভাবে '${acc.name}' অ্যাকাউন্টে সুইচ করা হয়েছে!`);
                                    if (acc.type === 'buyer') {
                                      setViewMode('buying');
                                    } else {
                                      setViewMode('selling');
                                    }
                                    setTimeout(() => setSwitchSuccessMsg(''), 4000);
                                  }}
                                  className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                                    activeAccount.id === acc.id
                                      ? 'bg-[#1DB954]/15 border border-[#1DB954]/40 text-slate-900 dark:text-white'
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img src={acc.avatar} alt={acc.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-300 dark:border-slate-700" />
                                    <div className="truncate">
                                      <p className="font-bold text-[11px] truncate">{acc.name}</p>
                                      <p className="text-[9px] text-slate-400 truncate">{acc.role}</p>
                                    </div>
                                  </div>
                                  {activeAccount.id === acc.id && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                          {/* Additional Quick Links */}
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                const newName = prompt('নতুন অ্যাকাউন্টের নাম লিখুন:');
                                if (newName) {
                                  const newAcc = {
                                    id: `acc-${Date.now()}`,
                                    name: newName,
                                    role: 'নতুন ফ্রিল্যান্সার / সদস্য',
                                    email: `${newName.toLowerCase().replace(/\s+/g, '')}@example.com`,
                                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                                    type: 'seller'
                                  };
                                  setAccountsList([...accountsList, newAcc]);
                                  setActiveAccount(newAcc);
                                  setEditProfileName(newAcc.name);
                                  setIsHeaderMoreMenuOpen(false);
                                  setSwitchSuccessMsg(`নতুন অ্যাকাউন্ট '${newName}' যোগ করা হয়েছে এবং সুইচ করা হয়েছে!`);
                                  setTimeout(() => setSwitchSuccessMsg(''), 4000);
                                }
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-2 text-[#1DB954] font-bold cursor-pointer text-left"
                            >
                              <Plus className="w-4 h-4" />
                              <span>নতুন অ্যাকাউন্ট যোগ করুন</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsSubscriptionModalOpen(true);
                                setIsHeaderMoreMenuOpen(false);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-2 text-amber-500 font-bold cursor-pointer text-left"
                            >
                              <Crown className="w-4 h-4" />
                              <span>সাবস্ক্রিপশন (৳৪৯৯/মাস)</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

                  {/* LEFT VERTICAL NAVIGATION SIDEBAR CARD */}
            <div className="lg:col-span-1 space-y-4">

              {/* LIVE OFFER VIEW DETAILS MODAL */}
              {selectedOfferForModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
                  <div className="bg-slate-900 border border-slate-700/80 w-full max-w-2xl rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedOfferForModal(null)}
                      className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Modal Header */}
                    <div className="flex items-start gap-3.5 pr-8">
                      <img
                        src={selectedOfferForModal.clientAvatar}
                        alt={selectedOfferForModal.clientName}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-[#1DB954] shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedOfferForModal.type === 'personal' ? (
                            <span className="text-[10px] sm:text-xs font-black px-3 py-1 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/20 text-amber-300 flex items-center gap-1.5 shadow-md">
                              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>ডিরেক্ট পার্সোনাল অর্ডার</span>
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-xs font-black px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5 shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{selectedOfferForModal.typeLabel.replace(/^[⚡🔒]\s*/, '')}</span>
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-bold">• {selectedOfferForModal.source}</span>
                          <span className="text-xs text-amber-400 font-bold">★ {selectedOfferForModal.rating}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {selectedOfferForModal.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('কোর্স') ? 'অর্গানাইজেশন / একাডেমি: ' : 'ক্লায়েন্ট: '}
                          <strong className="text-white">{selectedOfferForModal.clientName}</strong> ({selectedOfferForModal.clientLocation}) • {selectedOfferForModal.postedTime}
                        </p>
                      </div>
                    </div>

                    {/* Quick Highlights Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('কোর্স') ? 'কোর্স ফি / সম্মানিয়াম' : 'বাজেট (Budget)'}
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#1DB954]">৳{selectedOfferForModal.budget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('কোর্স') ? 'কোর্স টার্গেট / সময়' : 'ডেলিভারি সময়'}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-200">{selectedOfferForModal.deadline}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 font-bold block">ক্যাটাগরি</span>
                        <span className="text-xs sm:text-sm font-bold text-amber-300">{selectedOfferForModal.category}</span>
                      </div>
                    </div>

                    {/* Requirements & Description */}
                    <div className="space-y-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#1DB954]" />
                        {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('কোর্স') ? 'কোর্সের বিস্তারিত বিবরণ ও ইন্সট্রাক্টর নির্দেশনা:' : 'প্রজেক্টের রিকোয়ারমেন্টস ও কাজের বিবরণ:'}
                      </h4>
                      <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {selectedOfferForModal.requirements}
                      </div>
                    </div>

                    {/* Deliverables Checklist */}
                    {selectedOfferForModal.deliverables && selectedOfferForModal.deliverables.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('কোর্স') ? 'মডিউল, ক্লাস ও ডেলিভারেবল টার্গেট:' : 'যা যা ডেলিভারি দিতে হবে:'}
                        </h4>
                        <div className="space-y-1.5">
                          {selectedOfferForModal.deliverables.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/60 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Received status banner inside modal */}
                    {receivedOfferIds.includes(selectedOfferForModal.id) && (
                      <div className="p-3.5 bg-emerald-500/15 border border-[#1DB954]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-300 animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#1DB954] shrink-0" />
                          <span className="text-xs sm:text-sm font-black">
                            🎉 অফারটি সফলভাবে রিসিভ করা হয়েছে! প্রজেক্টটি আপনার ক্লায়েন্ট অর্ডার তালিকায় সক্রিয় আছে।
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOfferForModal(null);
                            setSpecialistMainTab('marketplace');
                            setSellerSubTab('orders');
                          }}
                          className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer self-end sm:self-auto shrink-0"
                        >
                          অর্ডার দেখুন
                        </button>
                      </div>
                    )}

                    {/* Footer Actions: Receive (Green) vs Reject (Red) vs Received State */}
                    {receivedOfferIds.includes(selectedOfferForModal.id) ? (
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                          <span>অর্ডার সফলভাবে রিসিভড & অ্যাক্টিভ</span>
                        </span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setSelectedOfferForModal(null)}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition cursor-pointer"
                          >
                            বন্ধ করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOfferForModal(null);
                              setSpecialistMainTab('marketplace');
                              setSellerSubTab('orders');
                            }}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer shadow-md"
                          >
                            কাজে যান
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            handleRejectLiveOffer(selectedOfferForModal);
                            setSelectedOfferForModal(null);
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <X className="w-4 h-4 text-rose-400" />
                          <span>বাতিল করুন</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReceiveLiveOffer(selectedOfferForModal)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#1DB954] to-emerald-400 hover:from-emerald-400 hover:to-[#1DB954] text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1DB954]/25 hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                          <span>রিসিভ করুন (৳{selectedOfferForModal.budget.toLocaleString()})</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SEE ALL OFFERS MODAL */}
              {isSeeAllOffersModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
                  <div className="bg-slate-900 border border-slate-700/80 w-full max-w-3xl rounded-3xl p-5 sm:p-7 text-white shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <Zap className="w-5 h-5 text-[#1DB954]" />
                          <span>সকল পেন্ডিং লাইভ অফার ও অর্ডার সমূহ ({activeOffersList.length})</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          আপনার দক্ষতা অনুযায়ী পাওয়া ক্লায়েন্ট ও পাবলিক রিকোয়েস্ট তালিকা
                        </p>
                      </div>
                      <button
                        onClick={() => setIsSeeAllOffersModalOpen(false)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Offers List */}
                    <div className="space-y-3">
                      {activeOffersList.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                          ✨ বর্তমানে কোনো লাইভ অফার নেই।
                        </div>
                      ) : (
                        activeOffersList.map((offer) => (
                          <div
                            key={offer.id}
                            className="p-4 bg-slate-950/70 border border-slate-800 hover:border-[#1DB954]/50 rounded-2xl transition space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={offer.clientAvatar}
                                  alt={offer.clientName}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954] shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-white truncate">{offer.clientName}</span>
                                    {offer.type === 'personal' ? (
                                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 flex items-center gap-1 shadow-xs">
                                        <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                                        <span>ডিরেক্ট পার্সোনাল অর্ডার</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 flex items-center gap-1 shadow-xs">
                                        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                                        <span>{offer.typeLabel.replace(/^[⚡🔒]\s*/, '')}</span>
                                      </span>
                                    )}
                                    <span className="text-[10px] text-amber-400 font-bold">★ {offer.rating}</span>
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-black text-slate-100 mt-1">
                                    {offer.title}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-left sm:text-right">
                                  <span className="text-sm sm:text-base font-black text-[#1DB954]">
                                    ৳{offer.budget.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">
                                    ডেলিভারি: {offer.deadline}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsSeeAllOffersModalOpen(false);
                                      setSelectedOfferForModal(offer);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-white/10 cursor-pointer"
                                  >
                                    বিস্তারিত
                                  </button>

                                  {receivedOfferIds.includes(offer.id) ? (
                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                                      <span>রিসিভড</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleReceiveLiveOffer(offer)}
                                      className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow-md cursor-pointer"
                                    >
                                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                                      <span>রিসিভ</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-sm font-bengali space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span>স্পেশালিস্ট নেভিগেশন</span>
                  </span>
                  <span className="text-xs bg-[#1DB954]/10 text-[#1DB954] px-3 py-1 rounded-full font-black border border-[#1DB954]/20 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>সেলার ও মেন্টর</span>
                  </span>
                </div>

                {/* Vertical Navigation Items (Top to Bottom) - Short, Crisp & Large Typography */}
                <div className="space-y-3">
                  {/* 1. সেলার সার্ভিস (মার্কেটপ্লেস) */}
                  <button
                    id="nav-specialist-marketplace"
                    onClick={() => {
                      setSpecialistMainTab('marketplace');
                      setSellerSubTab('orders');
                    }}
                    className={`w-full p-4 rounded-2xl font-black transition flex items-center justify-between gap-3 cursor-pointer border text-left active:scale-[0.99] ${
                      specialistMainTab === 'marketplace'
                        ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] shadow-md ring-2 ring-[#1DB954]/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-3 rounded-xl shrink-0 ${specialistMainTab === 'marketplace' ? 'bg-slate-950 text-[#1DB954]' : 'bg-slate-200 dark:bg-slate-700 text-amber-500'}`}>
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="block font-black text-base sm:text-lg tracking-tight leading-snug">
                            সেলার সার্ভিস
                          </span>
                          {/* Active Dot */}
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                            অ্যাক্টিভ
                          </span>
                        </div>
                        <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                          specialistMainTab === 'marketplace' ? 'text-slate-950/90 font-black' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          ক্লায়েন্ট অর্ডারস ({marketplaceOrders.length}) • সার্ভিসেস ({sellerGigs.length || 2})
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 shrink-0 ${specialistMainTab === 'marketplace' ? 'text-slate-950 font-black' : 'text-slate-400'}`} />
                  </button>

                  {/* 2. মেন্টর সার্ভিস */}
                  {isMentor ? (
                    <button
                      id="nav-mentor-services"
                      onClick={() => {
                        setSpecialistMainTab('mentor');
                        setSellerSubTab('courses');
                      }}
                      className={`w-full p-4 rounded-2xl font-black transition flex items-center justify-between gap-3 cursor-pointer border text-left active:scale-[0.99] ${
                        specialistMainTab === 'mentor'
                          ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`p-3 rounded-xl shrink-0 ${specialistMainTab === 'mentor' ? 'bg-slate-950 text-teal-400' : 'bg-slate-200 dark:bg-slate-700 text-teal-500'}`}>
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="block font-black text-base sm:text-lg tracking-tight leading-snug">
                              মেন্টর সার্ভিস
                            </span>
                            {/* Active Dot */}
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-black bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40">
                              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                              অ্যাক্টিভ
                            </span>
                          </div>
                          <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                            specialistMainTab === 'mentor' ? 'text-slate-950/90 font-black' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            কোর্স • ক্লাসরুম • স্টুডেন্ট (3)
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-6 h-6 shrink-0 ${specialistMainTab === 'mentor' ? 'text-slate-950 font-black' : 'text-slate-400'}`} />
                    </button>
                  ) : isMentorPending ? (
                    <div className="space-y-1.5">
                      <button
                        id="nav-mentor-pending"
                        onClick={() => setIsMentorStatusModalOpen(true)}
                        className="w-full p-4 rounded-2xl font-black transition flex items-center justify-between gap-3 cursor-pointer border text-left bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="p-3 rounded-xl shrink-0 bg-amber-500/20 text-amber-400">
                            <Clock className="w-6 h-6 animate-spin" />
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="block font-black text-base sm:text-lg text-amber-200 tracking-tight leading-snug">
                                মেন্টর সার্ভিস
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-amber-500/30 text-amber-300 rounded-full font-bold border border-amber-500/50">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                পেন্ডিং
                              </span>
                            </div>
                            <span className="block text-xs sm:text-sm font-bold text-amber-400/80 truncate mt-1">
                              এডমিন পর্যালোচনায় রয়েছে
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 shrink-0 text-amber-400" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-black text-base sm:text-lg text-slate-800 dark:text-slate-200">
                              মেন্টর সার্ভিস
                            </span>
                            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                              ইনঅ্যাক্টিভ
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg">
                          লকড
                        </span>
                      </div>
                      
                      {/* আবেদন করুন বাটন নিচে */}
                      <button
                        id="nav-mentor-apply"
                        onClick={() => setIsMentorAppModalOpen(true)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span>মেন্টর হতে আবেদন করুন</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>
                    </div>
                  )}

                  {/* 3. একাউন্ট স্টেটমেন্ট */}
                  <button
                    id="nav-specialist-statement"
                    onClick={() => {
                      setSpecialistMainTab('payments');
                      setSellerSubTab('earnings');
                    }}
                    className={`w-full p-4 rounded-2xl font-black transition flex items-center justify-between gap-3 cursor-pointer border text-left active:scale-[0.99] ${
                      specialistMainTab === 'payments'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-3 rounded-xl shrink-0 ${specialistMainTab === 'payments' ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 dark:bg-slate-700 text-amber-500'}`}>
                        <Wallet className="w-6 h-6" />
                      </div>
                      <div className="truncate">
                        <span className="block font-black text-base sm:text-lg tracking-tight leading-snug">
                          একাউন্ট স্টেটমেন্ট
                        </span>
                        <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                          specialistMainTab === 'payments' ? 'text-slate-950/90 font-black' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          আর্নিং ও পেমেন্ট হিস্টোরি
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 shrink-0 ${specialistMainTab === 'payments' ? 'text-slate-950 font-black' : 'text-slate-400'}`} />
                  </button>

                  {/* 4. ফ্রি টুলস */}
                  <button
                    id="nav-specialist-free-tools"
                    onClick={() => {
                      setSpecialistMainTab('ai_toolkit');
                      setSellerSubTab('orders');
                    }}
                    className={`w-full p-4 rounded-2xl font-black transition flex items-center justify-between gap-3 cursor-pointer border text-left active:scale-[0.99] ${
                      specialistMainTab === 'ai_toolkit'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-3 rounded-xl shrink-0 ${specialistMainTab === 'ai_toolkit' ? 'bg-white/20 text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-purple-400'}`}>
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="truncate">
                        <span className="block font-black text-base sm:text-lg tracking-tight leading-snug">
                          ফ্রি টুলস
                        </span>
                        <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                          specialistMainTab === 'ai_toolkit' ? 'text-white/90 font-black' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          ১০০% ফ্রি ফ্রিল্যান্সিং টুলস
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 shrink-0 ${specialistMainTab === 'ai_toolkit' ? 'text-white font-black' : 'text-slate-400'}`} />
                  </button>
                </div>

                {/* Mode Switcher Shortcut in Left Sidebar */}
                <div className="pt-3.5 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setViewMode('buying');
                      setActiveSubTab('gigs');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-3 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-[#1DB954]" />
                    <span>বায়ার মোডে সুইচ করুন</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN CONTENT AREA */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">

              {/* SPECIALIST DYNAMIC SUB-TABS STRIP */}
              <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl space-y-3 font-bengali text-white animate-fadeIn">
                {/* Header Info Strip */}
                <div className="flex items-center justify-between text-xs sm:text-sm pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span className="uppercase tracking-wider text-xs sm:text-sm font-black text-[#1DB954] flex items-center gap-2">
                      {specialistMainTab === 'marketplace' && <><Briefcase className="w-4 h-4" /><span>১. সেলার মার্কেটপ্লেস</span></>}
                      {specialistMainTab === 'mentor' && <><GraduationCap className="w-4 h-4" /><span>২. মেন্টর সার্ভিসেস</span></>}
                      {specialistMainTab === 'payments' && <><Wallet className="w-4 h-4" /><span>৩. একাউন্ট স্টেটমেন্ট</span></>}
                      {specialistMainTab === 'ai_toolkit' && <><Sparkles className="w-4 h-4" /><span>৪. ফ্রি টুলস</span></>}
                    </span>
                  </div>
                </div>

                {/* Secondary Dynamic Sub-Navigation Bar (Pills + Action Buttons) */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* CATEGORY 1: MARKETPLACE SUB-ITEMS */}
                  {specialistMainTab === 'marketplace' && (
                    <>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                        <button
                          onClick={() => setSellerSubTab('orders')}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            sellerSubTab === 'orders'
                              ? 'bg-[#1DB954] text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>ক্লায়েন্ট অর্ডারস ({marketplaceOrders.length})</span>
                        </button>

                        <button
                          onClick={() => setSellerSubTab('gigs')}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            sellerSubTab === 'gigs'
                              ? 'bg-[#1DB954] text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Package className="w-4 h-4" />
                          <span>আমার সার্ভিসেস ({sellerGigs.length || 2})</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setSellerSubTab('create_gig')}
                        className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                          sellerSubTab === 'create_gig'
                            ? 'bg-white text-slate-950'
                            : 'bg-gradient-to-r from-[#1DB954] to-emerald-400 text-slate-950 hover:opacity-90'
                        }`}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{sellerSubTab === 'create_gig' ? 'প্রজেক্ট তালিকা' : '+ নতুন সার্ভিস আপলোড'}</span>
                      </button>
                    </>
                  )}

                  {/* CATEGORY 2: MENTOR SERVICE SUB-ITEMS */}
                  {specialistMainTab === 'mentor' && (
                    isMentor ? (
                      <>
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                          <button
                            onClick={() => setSellerSubTab('courses')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                              sellerSubTab === 'courses'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>আমার পরিচালিত কোর্স</span>
                          </button>

                          <button
                            onClick={() => setSellerSubTab('assignments')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                              sellerSubTab === 'assignments'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <FileCheck className="w-4 h-4" />
                            <span>অ্যাসাইনমেন্ট ও ক্লাসরুম</span>
                          </button>

                          <button
                            onClick={() => setSellerSubTab('students')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                              sellerSubTab === 'students'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            <span>শিক্ষার্থীবৃন্দ (3)</span>
                          </button>

                          <button
                            onClick={() => setSellerSubTab('certificates')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                              sellerSubTab === 'certificates'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <Award className="w-4 h-4" />
                            <span>সার্টিফিকেট (1)</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setSellerSubTab('assignments');
                            setIsCreateAssignmentModalOpen(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-90 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>+ নতুন অ্যাসাইনমেন্ট</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-3 w-full py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-teal-300 font-black flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            মেন্টরশিপ অ্যাপ্লিকেশন হাব
                          </span>
                          {isMentorPending && (
                            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
                              আবেদন রিভিউতে রয়েছে
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => isMentorPending ? setIsMentorStatusModalOpen(true) : setIsMentorAppModalOpen(true)}
                          className="px-4 py-2 rounded-full text-xs sm:text-sm font-black bg-teal-500 hover:bg-teal-400 text-slate-950 transition cursor-pointer shadow-sm"
                        >
                          {isMentorPending ? 'আবেদনের তথ্য' : 'আবেদন ফরম'}
                        </button>
                      </div>
                    )
                  )}

                  {/* CATEGORY 3: PAYMENTS & CASHOUT SUB-ITEMS */}
                  {specialistMainTab === 'payments' && (
                    <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-0.5 w-full">
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                        <button
                          onClick={() => setPayoutSubTab('overview')}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            payoutSubTab === 'overview' || payoutSubTab === 'sources'
                              ? 'bg-[#1DB954] text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <BarChart2 className="w-4 h-4" />
                          <span>সামারি ও ব্যালেন্স</span>
                        </button>

                        <button
                          onClick={() => setPayoutSubTab('history')}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            payoutSubTab === 'history'
                              ? 'bg-[#1DB954] text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Receipt className="w-4 h-4" />
                          <span>উইথড্র হিস্টোরি</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setWithdrawSuccess(false);
                          setIsWithdrawModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap bg-gradient-to-r from-[#1DB954] to-emerald-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1DB954]/20 border border-emerald-400 shrink-0"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>ক্যাশআউট</span>
                      </button>
                    </div>
                  )}

                  {/* CATEGORY 4: FREELANCER FREE AI TOOLKIT SUB-ITEMS */}
                  {specialistMainTab === 'ai_toolkit' && (
                    <>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                        <button
                          onClick={() => {
                            setActiveToolkit('proposal');
                            playToolkitSound('click');
                          }}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            activeToolkit === 'proposal'
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Bot className="w-4 h-4 text-purple-300" />
                          <span>প্রপোজাল রাইটার</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveToolkit('invoice');
                            playToolkitSound('click');
                          }}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            activeToolkit === 'invoice'
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <FileText className="w-4 h-4 text-purple-300" />
                          <span>ইনভয়েস জেনারেটর</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveToolkit('calculator');
                            playToolkitSound('click');
                          }}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            activeToolkit === 'calculator'
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Calculator className="w-4 h-4 text-purple-300" />
                          <span>রেট ক্যালকুলেটর</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveToolkit('contract');
                            playToolkitSound('click');
                          }}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            activeToolkit === 'contract'
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-300" />
                          <span>কন্ট্রাক্ট জেনারেটর</span>
                        </button>
                      </div>

                      <span className="px-3.5 py-1.5 bg-purple-500/20 text-purple-300 font-black text-xs rounded-full border border-purple-500/30 shrink-0 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                        <span>১০০% ফ্রি টুলস</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* TAB 4: FREELANCER FREE AI TOOLKIT CONTENT VIEW */}
              {specialistMainTab === 'ai_toolkit' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white shadow-lg font-bengali animate-fadeIn">
                  
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/15 text-[#1DB954] flex items-center justify-center font-bold shadow-xs shrink-0">
                        <Sparkles className="w-6 h-6 text-[#1DB954]" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-wide">
                          ফ্রি এআই ও প্রফেশনাল টুলকিট
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          ইনস্ট্যান্ট এআই প্রপোজাল, ইনভয়েস, ক্যালকুলেটর ও কন্ট্রাক্ট
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Sound On / Off Toggle Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !isToolkitSoundOn;
                          setIsToolkitSoundOn(nextState);
                          setIsOfferSoundEnabled(nextState);
                          try {
                            localStorage.setItem('ptenit_toolkit_sound', String(nextState));
                            localStorage.setItem('ptenit_offer_sound_enabled', JSON.stringify(nextState));
                          } catch {}
                          if (!nextState) {
                            stopOfferNotificationSound();
                          }
                          playToolkitSound(nextState ? 'unmute' : 'mute', true);
                        }}
                        className={`relative p-2 sm:px-3 sm:py-2 rounded-xl transition flex items-center justify-center border cursor-pointer active:scale-90 shadow-xs group ${
                          isToolkitSoundOn
                            ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-[#1DB954] border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                            : 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-500 border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                        }`}
                        title={isToolkitSoundOn ? "সাউন্ড অন আছে (মিউট করতে ক্লিক করুন)" : "সাউন্ড বন্ধ আছে (চালু করতে ক্লিক করুন)"}
                      >
                        {isToolkitSoundOn ? (
                          <>
                            <Volume2 className="w-4 h-4 text-[#1DB954] group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1DB954] ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                          </>
                        ) : (
                          <>
                            <VolumeX className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                          </>
                        )}
                      </button>

                      <span className="self-start sm:self-auto text-xs font-black bg-[#1DB954]/15 text-[#1DB954] px-4 py-1.5 rounded-full border border-[#1DB954]/30 shadow-xs">
                        ⚡ ১০০% ফ্রী এআই
                      </span>
                    </div>
                  </div>

                  {/* Tool 1: AI Proposal Generator */}
                  {activeToolkit === 'proposal' && (
                    <div className="space-y-5 pt-1 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">
                          কাজের টাইটেল দিন, এআই অটো প্রপোজাল তৈরি করবে:
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="যেমন: Fullstack E-commerce Website in React & Node.js"
                          value={proposalJobTopic}
                          onChange={(e) => setProposalJobTopic(e.target.value)}
                          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] transition"
                        />
                        <button
                          onClick={handleGenerateProposal}
                          disabled={isGeneratingProposal || !proposalJobTopic.trim()}
                          className="px-6 py-3 bg-[#1DB954] hover:bg-[#19a34a] disabled:opacity-50 text-slate-950 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 active:scale-95"
                        >
                          <Sparkles className="w-5 h-5 text-slate-950" />
                          <span>{isGeneratingProposal ? 'জেনারেট হচ্ছে...' : 'AI Proposal তৈরি করুন'}</span>
                        </button>
                      </div>

                      {proposalResult && (
                        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-inner">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-sm font-black text-emerald-600 dark:text-[#1DB954] flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" /> AI Proposal প্রস্তুত!
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(proposalResult);
                                setProposalCopied(true);
                                setTimeout(() => setProposalCopied(false), 2000);
                              }}
                              className="text-xs bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              {proposalCopied ? <Check className="w-4 h-4 text-[#1DB954]" /> : <Copy className="w-4 h-4 text-[#1DB954]" />}
                              <span>{proposalCopied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                            </button>
                          </div>
                          <pre className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto no-scrollbar font-medium">
                            {proposalResult}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tool 2: Invoice Builder */}
                  {activeToolkit === 'invoice' && (
                    <div className="space-y-5 pt-1 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 block mb-1.5">
                            ক্লায়েন্টের নাম
                          </label>
                          <input
                            type="text"
                            value={invClientName}
                            onChange={(e) => setInvClientName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                          />
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 block mb-1.5">
                            প্রজেক্ট বাজেট (৳)
                          </label>
                          <input
                            type="number"
                            value={invAmount}
                            onChange={(e) => setInvAmount(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                          />
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-[#1DB954]/50 rounded-2xl space-y-3 text-sm shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                          <span className="font-black text-[#1DB954] text-sm tracking-wide">INVOICE #INV-2026-088</span>
                          <span className="text-xs text-slate-400 font-mono">তারিখ: 2026-08-14</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>ক্লায়েন্ট:</strong> {invClientName}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>সার্ভিস:</strong> {invProjectName}
                        </p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 font-black text-base">
                          <span>মোট সর্বমোট বিল:</span>
                          <span className="text-[#1DB954] text-lg">৳{invAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <button
                          onClick={() => alert(`✓ ইনভয়েস #INV-2026-088 সফলভাবে ডাউনলোড হয়েছে!`)}
                          className="w-full mt-3 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-2xl text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                        >
                          <FileText className="w-5 h-5 text-slate-950" />
                          <span>ইনভয়েস ডাউনলোড (PDF)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tool 3: Profit Calculator */}
                  {activeToolkit === 'calculator' && (
                    <div className="space-y-5 pt-1 animate-fadeIn">
                      <div>
                        <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 block mb-2">
                          প্রজেক্টের মূল বাজেট (৳)
                        </label>
                        <input
                          type="number"
                          value={calcGrossPrice}
                          onChange={(e) => setCalcGrossPrice(Number(e.target.value))}
                          className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-base font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                        />
                      </div>

                      <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300 text-sm">
                          <span>এস্ক্রো চার্জ (5%):</span>
                          <span className="text-red-400 font-bold">- ৳{(calcGrossPrice * 0.05).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300 text-sm">
                          <span>পেমেন্ট গেটওয়ে ফি (1.8%):</span>
                          <span className="text-amber-500 font-bold">- ৳{(calcGrossPrice * 0.018).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-base font-black text-slate-900 dark:text-white">
                          <span>আপনার মূল নিট আয়:</span>
                          <span className="text-[#1DB954] text-lg font-black">৳{(calcGrossPrice * 0.932).toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tool 4: Contract Generator */}
                  {activeToolkit === 'contract' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                        বাংলাদেশ লিগ্যাল স্ট্যান্ডার্ড সার্ভিস চুক্তিপত্র টেমপ্লেট:
                      </p>
                      <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-sm">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between flex-wrap gap-2">
                          <span className="flex items-center gap-2 text-[#1DB954] font-black text-sm">
                            <ShieldCheck className="w-5 h-5 text-[#1DB954]" /> Standard NDA & Service Contract.pdf
                          </span>
                          <span className="text-slate-400 text-xs font-medium">Verified Legal Format</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-medium">
                          • সোর্স কোড ও রাইটস হস্তান্তর শর্তাবলী<br/>
                          • ৫০% অগ্রিম এস্ক্রো মাইলস্টোন সিস্টেম<br/>
                          • ৩০ দিনের ফ্রি সাপোর্ট ও রিভিশন পলিসি
                        </p>
                        <button
                          onClick={() => alert("✓ স্ট্যান্ডার্ড ফ্রিল্যান্সিং চুক্তিপত্র ডাউনলোডের জন্য প্রস্তুত!")}
                          className="w-full mt-2 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                        >
                          <FileText className="w-5 h-5 text-slate-950" />
                          <span>চুক্তিপত্র ডাউনলোড (PDF)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}



                  {/* SUBTAB: TEACHER / SPECIALIST MODULES (Courses, Assignments, Students, Certificates) */}
                  {specialistMainTab === 'mentor' && (sellerSubTab === 'courses' || sellerSubTab === 'assignments' || sellerSubTab === 'students' || sellerSubTab === 'certificates') && (
                    <div className="space-y-4 animate-fadeIn">
                      <TeacherDashboard
                        initialTab={
                          sellerSubTab === 'courses'
                            ? 'courses'
                            : sellerSubTab === 'assignments'
                            ? 'assignments'
                            : sellerSubTab === 'students'
                            ? 'students'
                            : 'certificates'
                        }
                        openCreateAssignmentModal={isCreateAssignmentModalOpen}
                        onCloseCreateAssignmentModal={() => setIsCreateAssignmentModalOpen(false)}
                        hideHeader={true}
                      />
                    </div>
                  )}

                  {/* SUBTAB: Active Client Orders Workspace */}
                  {specialistMainTab === 'marketplace' && sellerSubTab === 'orders' && (
                    <div id="seller-orders-section" className="space-y-6 animate-fadeIn font-bengali">
                      {/* Filter Header & Stats */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs space-y-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-1">
                            <div>
                              <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#1DB954]" />
                                <span>ক্লায়েন্ট অর্ডারস</span>
                              </h3>
                            </div>
                          </div>

                        </div>

                        {/* Status Filter Tabs - Single Line Layout */}
                        <div className="grid grid-cols-5 gap-1 sm:gap-2 pt-1">
                          {(() => {
                            const pendingOrdersCount = marketplaceOrders.filter(o => o.status === 'pending' || o.status === 'pending_approval').length;
                            const inProgressCount = marketplaceOrders.filter(o => o.status === 'in_progress').length;
                            const inReviewCount = marketplaceOrders.filter(o => o.status === 'in_review' || o.status === 'revision_requested').length;
                            const completedCount = marketplaceOrders.filter(o => o.status === 'completed').length;
                            const totalCount = marketplaceOrders.length;

                            return [
                              { id: 'all', label: 'সকল অর্ডার', count: totalCount, icon: Package, color: 'text-[#1DB954]' },
                              { id: 'pending', label: 'নতুন পেন্ডিং', count: pendingOrdersCount, icon: Clock, color: 'text-amber-500' },
                              { id: 'in_progress', label: 'চলমান কাজ', count: inProgressCount, icon: Zap, color: 'text-blue-500' },
                              { id: 'in_review', label: 'রিভিউ অপেক্ষায়', count: inReviewCount, icon: FileText, color: 'text-purple-500' },
                              { id: 'completed', label: 'সম্পন্ন', count: completedCount, icon: CheckCircle2, color: 'text-emerald-500' },
                            ].map(tab => {
                              const isSelected = sellerOrderFilter === tab.id;
                              const TabIcon = tab.icon;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setSellerOrderFilter(tab.id as any)}
                                  className={`py-2 px-1 sm:px-2.5 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 min-w-0 ${
                                    isSelected
                                      ? 'bg-slate-100 dark:bg-slate-800 border-[#1DB954] text-slate-950 dark:text-white shadow-xs font-black ring-1 sm:ring-2 ring-[#1DB954]/30'
                                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-center gap-1 max-w-full">
                                    <TabIcon className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 ${tab.color}`} />
                                    <span className="text-[10px] sm:text-xs font-black leading-tight truncate">{tab.label}</span>
                                  </div>
                                  <span className={`text-xs sm:text-sm lg:text-base font-black leading-tight ${
                                    isSelected ? 'text-[#1DB954]' : 'text-slate-800 dark:text-slate-200'
                                  }`}>
                                    {tab.count}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                        </div>

                        {/* Filtered Order List */}
                        {(() => {
                          const filtered = marketplaceOrders.filter(o => {
                            if (sellerOrderFilter === 'all') return true;
                            if (sellerOrderFilter === 'pending') return o.status === 'pending' || o.status === 'pending_approval';
                            if (sellerOrderFilter === 'in_progress') return o.status === 'in_progress';
                            if (sellerOrderFilter === 'in_review') return o.status === 'in_review' || o.status === 'revision_requested';
                            if (sellerOrderFilter === 'completed') return o.status === 'completed';
                            return true;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="p-8 text-center text-slate-400 space-y-2">
                                <Package className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                                <p className="text-xs font-bold">এই ফিল্টারে কোনো ক্লায়েন্ট অর্ডার পাওয়া যায়নি</p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-4">
                              {filtered.map(ord => {
                                const isPendingApproval = ord.status === 'pending_approval';
                                const isPending = ord.status === 'pending';
                                const isInProgress = ord.status === 'in_progress';
                                const isInReview = ord.status === 'in_review' || ord.status === 'revision_requested';
                                const isCompleted = ord.status === 'completed';
                                const isExpanded = !!expandedSellerOrders[ord.id];

                                let cardStatusClasses = "border-l-8 border-l-blue-500 bg-gradient-to-r from-blue-500/10 via-slate-50/50 to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                let badgeClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
                                let statusLabel = "কাজ চলছে";
                                let StatusIcon = Clock;

                                if (isPendingApproval) {
                                  cardStatusClasses = "border-l-8 border-l-amber-500 bg-gradient-to-r from-amber-500/15 via-slate-50/50 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border-amber-500/30 shadow-md";
                                  badgeClasses = "bg-amber-500 text-slate-950 font-black border-amber-500";
                                  statusLabel = "📩 নতুন প্রজেক্ট অফার";
                                  StatusIcon = Clock;
                                } else if (isPending) {
                                  cardStatusClasses = "border-l-8 border-l-amber-400 bg-gradient-to-r from-amber-500/10 via-slate-50/50 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                  badgeClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold";
                                  statusLabel = "পেন্ডিং প্রজেক্ট (কাজ করুন)";
                                  StatusIcon = Clock;
                                } else if (isInReview) {
                                  cardStatusClasses = "border-l-8 border-l-purple-500 bg-gradient-to-r from-purple-500/10 via-slate-50/50 to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                  badgeClasses = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
                                  statusLabel = "ডেলিভারি রিভিউধীন";
                                  StatusIcon = FileText;
                                } else if (isCompleted) {
                                  cardStatusClasses = "border-l-8 border-l-[#1DB954] bg-gradient-to-r from-emerald-500/10 via-slate-50/50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                  badgeClasses = "bg-emerald-500/10 text-emerald-700 dark:text-[#1DB954] border-emerald-500/30";
                                  statusLabel = "সম্পন্ন প্রজেক্ট";
                                  StatusIcon = ShieldCheck;
                                } else if (ord.status === 'cancelled') {
                                  cardStatusClasses = "border-l-8 border-l-rose-500 bg-gradient-to-r from-rose-500/10 via-slate-50/50 to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                  badgeClasses = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
                                  statusLabel = "বাতিলকৃত প্রজেক্ট";
                                  StatusIcon = ShieldAlert;
                                }

                                return (
                                  <div
                                    key={ord.id}
                                    className={`border rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all duration-200 space-y-3 hover:shadow-md font-bengali ${cardStatusClasses}`}
                                  >
                                    {/* Top Main Details Bar */}
                                    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                                      <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                                        <span className="px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 font-mono text-xs font-black rounded-lg shrink-0 border border-slate-700 shadow-2xs">
                                          #{ord.id.slice(-8).toUpperCase()}
                                        </span>
                                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-[260px] sm:max-w-[360px]" title={ord.title}>
                                          {ord.title}
                                        </h3>
                                        <span className="hidden sm:inline-block px-3 py-1 bg-[#1DB954]/15 text-[#1DB954] text-xs font-black rounded-full border border-[#1DB954]/30 shrink-0">
                                          {ord.category}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 shrink-0 ml-auto">
                                        <div className="text-right">
                                          <span className="text-base sm:text-lg font-black text-[#1DB954] block leading-none">
                                            ৳{ord.amount.toLocaleString('bn-BD')}
                                          </span>
                                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                                            আয়: ৳{ord.sellerPayout ? ord.sellerPayout.toLocaleString('bn-BD') : Math.round(ord.amount * 0.9).toLocaleString('bn-BD')}
                                          </span>
                                        </div>

                                        {/* Simple Status Badge */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeClasses}`}>
                                          <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                          <span>{statusLabel}</span>
                                        </span>
                                      </div>
                                    </div>

                                    {/* Progress Bar, Order Time & Buyer Info Row */}
                                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-sm flex-wrap sm:flex-nowrap">
                                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-wrap sm:flex-nowrap">
                                        {/* Buyer Avatar & Name */}
                                        <div className="flex items-center gap-2 shrink-0">
                                          <div className="w-7 h-7 rounded-full bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 border-2 border-[#1DB954]">
                                            <User className="w-4 h-4 text-[#1DB954]" />
                                          </div>
                                          <div className="min-w-0">
                                            <span className="text-[10px] text-slate-400 font-bold block leading-none">বায়ার</span>
                                            <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">
                                              {ord.buyerName}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Clean Simple Order Time */}
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold shrink-0 flex items-center gap-1.5 px-1 py-0.5">
                                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          <span>{getTimeAgoBengali(ord.createdAt)}</span>
                                        </span>
                                      </div>

                                      {/* Action Buttons for Seller: Green Message, Red Details, Primary Action */}
                                      <div className="flex items-center gap-2 shrink-0 ml-auto">
                                        {/* Buyer Chat Button (Vibrant Green - সবুজ) with dynamic unread count */}
                                        {(() => {
                                          const unreadCount = ord.unreadMessageCount !== undefined ? ord.unreadMessageCount : (ord.status === 'in_progress' ? 2 : ord.status === 'pending' ? 3 : 0);
                                          return (
                                            <button
                                              onClick={() => {
                                                openChatWindow({
                                                  id: `chat-order-${ord.id}`,
                                                  orderId: ord.id,
                                                  senderName: ord.buyerName,
                                                  senderRole: 'customer',
                                                  initialMessage: `আসসালামু আলাইকুম ${ord.buyerName}! প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") নিয়ে কথা বলার জন্য আপনাকে মেসেজ পাঠাচ্ছি।`
                                                });
                                              }}
                                              className="relative px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                                              title="বায়ারকে মেসেজ দিন (পপআপ চ্যাট খুলুন)"
                                            >
                                              <div className="relative">
                                                <MessageCircle className="w-4 h-4 text-slate-950" />
                                                {unreadCount > 0 && (
                                                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                                )}
                                              </div>
                                              <span>মেসেজ</span>
                                              {unreadCount > 0 && (
                                                <span className="ml-0.5 px-1.5 py-0.5 bg-rose-600 text-white text-[11px] font-black rounded-full shadow-2xs leading-none flex items-center justify-center min-w-[18px]">
                                                  {unreadCount}
                                                </span>
                                              )}
                                            </button>
                                          );
                                        })()}

                                        {/* Primary Action Button depending on status */}
                                        {isPendingApproval && (
                                          <button
                                            onClick={() => {
                                              stopOfferNotificationSound();
                                              updateMarketplaceOrderStatus(ord.id, 'in_progress', 'অর্ডার রিসিভ করা হয়েছে এবং কাজ শুরু করা হয়েছে।');
                                              updateMarketplaceOrder(ord.id, { unreadMessageCount: 3 });
                                            }}
                                            className="px-3.5 py-1.5 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                                          >
                                            <CheckCircle2 className="w-4 h-4 text-slate-950" />
                                            <span>রিসিভ করুন</span>
                                          </button>
                                        )}

                                        {isPending && (
                                          <button
                                            onClick={() => {
                                              stopOfferNotificationSound();
                                              updateMarketplaceOrderStatus(ord.id, 'in_progress', 'কাজ শুরু করা হয়েছে।');
                                            }}
                                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                                          >
                                            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                                            <span>কাজ করুন</span>
                                          </button>
                                        )}

                                        {isInProgress && (
                                          <button
                                            onClick={() => {
                                              setDeliveringOrder(ord);
                                              setDeliveryNote(`প্রিয় ${ord.buyerName}, আপনার প্রজেক্টটি সম্পূর্ণ করেছি। অনুগ্রহ করে ফাইল রিভিও করুন।`);
                                              setDeliveryFileUrl(`https://github.com/example/project-${ord.id}.zip`);
                                              setDeliveryFileName(`project-release-${ord.id}.zip`);
                                            }}
                                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                          >
                                            <UploadCloud className="w-4 h-4 text-white" />
                                            <span>ফাইনাল ডেলিভারি</span>
                                          </button>
                                        )}

                                        {isInReview && (
                                          <button
                                            onClick={() => {
                                              setDeliveringOrder(ord);
                                              setDeliveryNote(ord.deliveryNote || '');
                                              setDeliveryFileUrl(ord.deliveryFileUrl || '');
                                              setDeliveryFileName(ord.deliveryFileName || 'delivered-file.zip');
                                            }}
                                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                          >
                                            <Eye className="w-4 h-4 text-white" />
                                            <span>ডেলিভারি দেখুন</span>
                                          </button>
                                        )}

                                        {/* Expand Toggle Button (Red - লাল) */}
                                        <button
                                          onClick={() => setExpandedSellerOrders(prev => ({ ...prev, [ord.id]: !prev[ord.id] }))}
                                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                        >
                                          <span>{isExpanded ? 'সংক্ষেপ' : 'বিস্তারিত'}</span>
                                          {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Expandable Seller Details Section */}
                                    {isExpanded && (
                                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn text-xs sm:text-sm">
                                        <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                          <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                            <FileText className="w-4 h-4 text-[#1DB954]" />
                                            <span>বায়ারের রিকোয়ারমেন্ট & প্রজেক্ট নোট:</span>
                                          </h4>
                                          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                            {ord.requirements || "বায়ার থেকে প্রাপ্ত নির্দিষ্ট প্রয়োজনীয় নির্দেশনা অনুযায়ী ডেভেলপমেন্ট সম্পন্ন করা হচ্ছে।"}
                                          </p>
                                        </div>

                                        {ord.deliveryNote && (
                                          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30 space-y-1.5">
                                            <h4 className="font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                                              <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                                              <span>আপনার প্রেরিত ডেলিভারি বার্তা:</span>
                                            </h4>
                                            <p className="text-emerald-900 dark:text-emerald-200 font-medium">
                                              {ord.deliveryNote}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* SUBTAB 1: Active Uploaded Orders */}
                  {specialistMainTab === 'marketplace' && sellerSubTab === 'gigs' && (
                    <div className="space-y-4">
                      {sellerGigs.length === 0 ? (
                        <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4 font-bengali">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-[#1DB954] flex items-center justify-center mx-auto">
                            <UploadCloud className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                              আপনার এখন পর্যন্ত কোনো আপলোডকৃত গিগ/অর্ডার নেই
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                              আপনার সার্ভিস, স্কিল বা প্রোডাক্ট নিয়ে ৩টি প্যাকেজ সহ নতুন গিগ তৈরি করুন এবং ক্লায়েন্টদের থেকে সরাসরি কাজ পান।
                            </p>
                          </div>
                          <button
                            onClick={() => setSellerSubTab('create_gig')}
                            className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>প্রথম গিগ পোস্ট করুন</span>
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {sellerGigs.map(g => (
                            <div key={g.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#1DB954] transition-all duration-200 shadow-sm flex flex-col group">
                              {/* Card Image Header */}
                              <div className="relative h-40 overflow-hidden bg-slate-800">
                                <img src={g.thumbnail} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md text-[#1DB954] text-[10px] font-black px-2.5 py-1 rounded-full border border-[#1DB954]/30 shadow-sm">
                                  {g.category}
                                </div>
                                 {/* 3-Dot Options Menu */}
                                 <div className="absolute top-2.5 right-2.5 z-20">
                                   <button
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setActiveGigMenuId(activeGigMenuId === g.id ? null : g.id);
                                     }}
                                     className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white hover:bg-[#1DB954] hover:text-slate-950 transition cursor-pointer border border-white/20 shadow-md flex items-center justify-center"
                                     title="গিগ অপশন (3 Dots)"
                                   >
                                     <MoreVertical className="w-4 h-4" />
                                   </button>

                                   {activeGigMenuId === g.id && (
                                     <>
                                       <div
                                         className="fixed inset-0 z-30 cursor-default"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setActiveGigMenuId(null);
                                         }}
                                       />

                                       <div
                                         className="absolute right-0 top-full mt-1.5 w-[160px] bg-white dark:bg-slate-900 border border-rose-500 rounded-xl shadow-xl z-40 p-2 space-y-1.5 animate-fadeIn font-bengali text-center"
                                         onClick={(e) => e.stopPropagation()}
                                       >
                                         <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                                           <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                                             <Trash2 className="w-3 h-3" />
                                             ডিলেট করুন?
                                           </span>
                                           <button
                                             onClick={() => setActiveGigMenuId(null)}
                                             className="p-0.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                                             title="বন্ধ করুন"
                                           >
                                             <X className="w-3 h-3" />
                                           </button>
                                         </div>

                                         <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 py-0.5 leading-tight">
                                           আপনি কি সত্যিই ডিলেট করবেন?
                                         </p>

                                         <div className="flex items-center justify-center gap-1.5 pt-0.5">
                                           <button
                                             onClick={() => {
                                               handleDeleteGig(g.id, g.title);
                                               setActiveGigMenuId(null);
                                             }}
                                             className="flex-1 py-1 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-bold transition cursor-pointer shadow-sm text-center"
                                           >
                                             হ্যাঁ
                                           </button>
                                           <button
                                             onClick={() => setActiveGigMenuId(null)}
                                             className="flex-1 py-1 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-bold transition cursor-pointer text-center"
                                           >
                                             না
                                           </button>
                                         </div>
                                       </div>
                                     </>
                                   )}
                                 </div>
                              </div>

                              {/* Card Details Body */}
                              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-relaxed">
                                    {g.title}
                                  </h4>
                                  <div className="mt-2 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">শুরু ৳</span>
                                    <span className="text-sm font-black text-[#1DB954]">
                                      ৳{(g.packages?.basic?.price ?? g.price ?? 2500).toLocaleString('bn-BD')}
                                    </span>
                                  </div>
                                </div>

                                {/* Performance Stats Box */}
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-[10px]">
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">👁️ ভিউ</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                      {((g.salesCount || 1) * 120 + 85).toLocaleString('bn-BD')}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">📈 ইমপ্রেশন</span>
                                    <span className="font-extrabold text-slate-900 dark:text-white">
                                      {((g.salesCount || 1) * 450 + 320).toLocaleString('bn-BD')}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">📦 মোট অর্ডার</span>
                                    <span className="font-extrabold text-emerald-600 dark:text-[#1DB954]">
                                      {(g.salesCount || 12).toLocaleString('bn-BD')}টি
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px]">💰 অর্জিত আয়</span>
                                    <span className="font-extrabold text-emerald-600 dark:text-[#1DB954]">
                                      ৳{((g.price || g.packages?.basic?.price || 2500) * (g.salesCount || 12)).toLocaleString('bn-BD')}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditGig(g)}
                                    className="flex-1 py-1.5 px-2 bg-emerald-500/10 hover:bg-[#1DB954] text-emerald-700 dark:text-[#1DB954] hover:text-slate-950 font-bold text-[11px] rounded-lg transition border border-[#1DB954]/30 flex items-center justify-center gap-1 cursor-pointer"
                                    title="গিগ এডিট করুন"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>এডিট</span>
                                  </button>

                                  <button
                                    onClick={() => setPerformanceGig(g)}
                                    className="flex-1 py-1.5 px-2 bg-blue-500/10 hover:bg-blue-600 text-blue-700 dark:text-blue-400 hover:text-white font-bold text-[11px] rounded-lg transition border border-blue-500/30 flex items-center justify-center gap-1 cursor-pointer"
                                    title="পারফরমেন্স অ্যানালিটিক্স দেখুন"
                                  >
                                    <BarChart2 className="w-3.5 h-3.5" />
                                    <span>পারফরমেন্স</span>
                                  </button>

                                  <button
                                    onClick={() => setSelectedGig(g)}
                                    className="flex-1 py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-slate-950 font-bold text-[11px] rounded-lg transition border border-amber-500/30 flex items-center justify-center gap-1 cursor-pointer"
                                    title="বায়ার মোডে প্রিভিউ দেখুন"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>প্রিভিউ</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUBTAB 4: Bill Cashout / Earnings Management */}
                  {specialistMainTab === 'payments' && sellerSubTab === 'earnings' && (
                    <div className="space-y-6 font-bengali animate-fadeIn">
                      {(() => {
                        const mktEarned = sellerGigs.reduce((acc, g) => acc + ((g.price || g.packages?.basic?.price || 2500) * (g.salesCount || 12)), 0) || 125000;
                        const mntEarned = courses.reduce((acc, c) => acc + ((c.price || 3500) * (c.studentsCount || 15)), 0) || 767985;
                        const totalEarned = mktEarned + mntEarned;
                        const commFee = Math.round(totalEarned * 0.066);
                        const netEarned = totalEarned - commFee;
                        const availableBalance = Math.max(683919, Math.round(netEarned * 0.82));
                        const pendingEscrow = Math.round(netEarned * 0.18);

                        const rawPayouts = currentUser ? payouts.filter(p =>
                          p.teacherId === currentUser.id ||
                          (currentUser.name && p.teacherName.toLowerCase().includes(currentUser.name.toLowerCase()))
                        ) : payouts;

                        const defaultSellerPayouts = [
                          {
                            id: "pay-105",
                            teacherId: currentUser?.id || "usr-1",
                            teacherName: currentUser?.name || "MD S Kazi Sohag",
                            teacherEmail: currentUser?.email || "sohag@ptenit.com",
                            amount: 50000,
                            paymentMethod: "bKash",
                            accountNumber: "01700000000",
                            note: "আগস্ট ২০২৬ ১ম সপ্তাহের ইনস্ট্যান্ট ক্যাশআউট",
                            status: "Approved",
                            requestedAt: "2026-08-10 14:30"
                          },
                          {
                            id: "pay-104",
                            teacherId: currentUser?.id || "usr-1",
                            teacherName: currentUser?.name || "MD S Kazi Sohag",
                            teacherEmail: currentUser?.email || "sohag@ptenit.com",
                            amount: 25000,
                            paymentMethod: "Nagad",
                            accountNumber: "01800000000",
                            note: "জুলাই ২০২৬ ২য় কিস্তি মেন্টর ও গিগ পেআউট",
                            status: "Approved",
                            requestedAt: "2026-07-28 11:15"
                          },
                          {
                            id: "pay-103",
                            teacherId: currentUser?.id || "usr-1",
                            teacherName: currentUser?.name || "MD S Kazi Sohag",
                            teacherEmail: currentUser?.email || "sohag@ptenit.com",
                            amount: 15000,
                            paymentMethod: "Bank",
                            accountNumber: "205012345678",
                            note: "ব্যাংক ট্রান্সফার পেআউট রিকোয়েস্ট",
                            status: "Approved",
                            requestedAt: "2026-07-15 09:40"
                          }
                        ];

                        const basePayouts = rawPayouts.length > 0 ? rawPayouts : defaultSellerPayouts;
                        const sellerPayouts = [
                          ...(activePendingPayout ? [{
                            id: activePendingPayout.id,
                            teacherId: currentUser?.id || "usr-1",
                            teacherName: currentUser?.name || "MD S Kazi Sohag",
                            teacherEmail: currentUser?.email || "sohag@ptenit.com",
                            amount: activePendingPayout.amount,
                            paymentMethod: activePendingPayout.paymentMethod,
                            accountNumber: activePendingPayout.accountNumber,
                            note: "অনলাইন ক্যাশআউট আবেদন (প্রক্রিয়াধীন)",
                            status: activePendingPayout.status,
                            requestedAt: activePendingPayout.requestedAt
                          }] : []),
                          ...basePayouts.filter(p => !activePendingPayout || p.id !== activePendingPayout.id)
                        ];

                        const approvedPayouts = sellerPayouts.filter(p => p.status === 'Approved' || p.status === 'Paid');
                        const lastCashout = approvedPayouts.length > 0 ? approvedPayouts[0] : sellerPayouts[0];
                        const totalApprovedPaid = approvedPayouts.reduce((acc, p) => acc + p.amount, 0);

                        // Filter payouts
                        const filteredPayouts = sellerPayouts.filter(p => {
                          if (payoutStatusFilter === 'Pending' && p.status !== 'Pending') return false;
                          if (payoutStatusFilter === 'Approved' && (p.status !== 'Approved' && p.status !== 'Paid')) return false;
                          if (payoutStatusFilter === 'Rejected' && p.status !== 'Rejected') return false;

                          if (payoutMinAmount > 0 && p.amount < payoutMinAmount) return false;

                          if (payoutSearchQuery.trim()) {
                            const q = payoutSearchQuery.toLowerCase();
                            const matchId = p.id.toLowerCase().includes(q);
                            const matchMethod = p.paymentMethod.toLowerCase().includes(q);
                            const matchAcc = p.accountNumber.toLowerCase().includes(q);
                            const matchNote = (p.note || '').toLowerCase().includes(q);
                            if (!matchId && !matchMethod && !matchAcc && !matchNote) return false;
                          }
                          return true;
                        });

                        return (
                          <>
                            {/* SUCCESS ALERT BANNER */}
                            {cashoutSuccessMsg && (
                              <div className="space-y-3 animate-fadeIn">
                                <div className="p-4 bg-emerald-500/15 text-[#1DB954] font-black text-xs sm:text-sm rounded-2xl border-2 border-[#1DB954]/50 shadow-md flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 fill-[#1DB954] text-slate-950 animate-bounce" />
                                    <span>{cashoutSuccessMsg}</span>
                                  </div>
                                  <button onClick={() => setCashoutSuccessMsg('')} className="p-1 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">✕</button>
                                </div>
                              </div>
                            )}

                            {/* TAB 1: SUMMARY & BALANCE (SINGLE ROW 4 COMPACT CARDS) */}
                            {(payoutSubTab === 'overview' || payoutSubTab === 'sources') && (
                              <div className="space-y-6 animate-fadeIn font-bengali">
                                {/* 4 Compact Stat Cards in 1 Single Row with Minimal Short Text */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                  {/* Card 1: Total Earnings */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <DollarSign className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> সর্বমোট আয়
                                      </span>
                                      <span className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold shrink-0">যৌথ</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ৳{totalEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">মার্কেটপ্লেস ও মেন্টর</div>
                                  </div>

                                  {/* Card 2: Cashout Ready Balance */}
                                  <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-950/30 border-2 border-[#1DB954] rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-emerald-800 dark:text-[#1DB954] flex items-center gap-1.5 truncate">
                                        <Wallet className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> ক্যাশআউট ব্যালেন্স
                                      </span>
                                      <span className="text-[9px] text-[#1DB954] bg-[#1DB954]/20 px-1.5 py-0.5 rounded font-black shrink-0">উইথড্র রেডি</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-[#1DB954] tracking-tight">
                                      ৳{availableBalance.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold truncate">উইথড্র করার জন্য প্রস্তুত</div>
                                  </div>

                                  {/* Card 3: Marketplace Earnings */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400 shrink-0" /> ১. মার্কেটপ্লেস আয়
                                      </span>
                                      <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">গিগ</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ৳{mktEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">গিগ ও প্রজেক্ট</div>
                                  </div>

                                  {/* Card 4: Mentor & Courses Earnings */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <GraduationCap className="w-3.5 h-3.5 text-teal-400 shrink-0" /> ২. মেন্টর ও কোর্স
                                      </span>
                                      <span className="text-[9px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">কোর্স ফি</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ৳{mntEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">কোর্স ও স্টুডেন্ট এনরোলমেন্ট</div>
                                  </div>
                                </div>

                                {/* UNIFIED SECTION: COMBINED COURSES & MARKETPLACE PROJECTS */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs font-bengali">
                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[#1DB954]" />
                                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                        লাইভ কাজ ও আয়ের তালিকা ({courses.length + (marketplaceOrders.length || sellerGigs.length)})
                                      </h3>
                                    </div>
                                    <span className="text-[11px] font-black text-[#1DB954]">
                                      যৌথ মোট: ৳{totalEarned.toLocaleString('bn-BD')}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {/* 1. COURSES */}
                                    {courses.map((course, idx) => {
                                      const stCount = course.enrolledCount || (course as any).studentsCount || (idx === 0 ? 343 : 210);
                                      const crsFee = course.price || 1200;
                                      const crsTotal = stCount * crsFee;
                                      const progressPct = idx === 0 ? 100 : idx === 1 ? 85 : idx === 2 ? 60 : 40;
                                      const isCompleted = progressPct === 100;

                                      return (
                                        <div
                                          key={`crs-${course.id || idx}`}
                                          className={`p-3 sm:p-3.5 rounded-xl border transition flex flex-col justify-between gap-2.5 shadow-xs ${
                                            isCompleted
                                              ? 'border-l-4 border-l-[#1DB954] bg-emerald-500/5 dark:bg-emerald-950/20 border-slate-200 dark:border-slate-800'
                                              : 'border-l-4 border-l-teal-500 bg-teal-500/5 dark:bg-teal-950/20 border-slate-200 dark:border-slate-800'
                                          }`}
                                        >
                                          {/* Title, Badge & Tag */}
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-1.5 mb-1">
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                                                  🎓 কোর্স
                                                </span>
                                              </div>
                                              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                                                {course.title}
                                              </h4>
                                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                                                {stCount} জন ছাত্র • ফি: ৳{crsFee.toLocaleString('bn-BD')}
                                              </p>
                                            </div>
                                            <span
                                              className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                                isCompleted
                                                  ? 'bg-emerald-500/15 text-[#1DB954] border border-[#1DB954]/30'
                                                  : 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                                              }`}
                                            >
                                              {isCompleted ? '✓ সম্পন্ন' : `${progressPct}% প্রোগ্রেস`}
                                            </span>
                                          </div>

                                          {/* Progress bar & Amount */}
                                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                            <div className="flex items-center gap-2">
                                              <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                  className={`h-full rounded-full ${isCompleted ? 'bg-[#1DB954]' : 'bg-teal-500'}`}
                                                  style={{ width: `${progressPct}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-slate-400 font-bold">{progressPct}%</span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-black text-[#1DB954]">
                                              ৳{crsTotal.toLocaleString('bn-BD')}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {/* 2. MARKETPLACE PROJECTS & GIGS */}
                                    {(marketplaceOrders.length > 0 ? marketplaceOrders : sellerGigs).map((item: any, idx: number) => {
                                      const title = item.gigTitle || item.title || 'ওয়েবসাইট ডিজাইন ও কাস্টম প্রজেক্ট';
                                      const clientName = item.buyerName || 'Client';
                                      const orderId = item.id || `ord-${idx + 1}`;
                                      const amount = item.budget || item.price || 12000;
                                      const isCompleted = item.status === 'completed' || item.status === 'delivered' || idx === 0;
                                      const progressPct = isCompleted ? 100 : item.status === 'in_progress' ? 65 : 40;

                                      return (
                                        <div
                                          key={`mkt-${orderId}`}
                                          className={`p-3 sm:p-3.5 rounded-xl border transition flex flex-col justify-between gap-2.5 shadow-xs ${
                                            isCompleted
                                              ? 'border-l-4 border-l-[#1DB954] bg-emerald-500/5 dark:bg-emerald-950/20 border-slate-200 dark:border-slate-800'
                                              : 'border-l-4 border-l-purple-500 bg-purple-500/5 dark:bg-purple-950/20 border-slate-200 dark:border-slate-800'
                                          }`}
                                        >
                                          {/* Title, Badge & Tag */}
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-1.5 mb-1">
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                                  🛍️ মার্কেটপ্লেস
                                                </span>
                                              </div>
                                              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                                                {title}
                                              </h4>
                                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                                                ক্লায়েন্ট: {clientName} • #{orderId}
                                              </p>
                                            </div>
                                            <span
                                              className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                                isCompleted
                                                  ? 'bg-emerald-500/15 text-[#1DB954] border border-[#1DB954]/30'
                                                  : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                              }`}
                                            >
                                              {isCompleted ? '✓ ডেলিভার্ড' : `${progressPct}% কাজ`}
                                            </span>
                                          </div>

                                          {/* Progress bar & Amount */}
                                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                            <div className="flex items-center gap-2">
                                              <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                  className={`h-full rounded-full ${isCompleted ? 'bg-[#1DB954]' : 'bg-purple-500'}`}
                                                  style={{ width: `${progressPct}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] text-slate-400 font-bold">{progressPct}%</span>
                                            </div>
                                            <span className="text-xs sm:text-sm font-black text-purple-400">
                                              ৳{amount.toLocaleString('bn-BD')}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* TAB 3: WITHDRAW */}
                            {payoutSubTab === 'withdraw' && (
                              <div className="space-y-4 animate-fadeIn">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
                                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                      <CreditCard className="w-5 h-5 text-[#1DB954]" />
                                      <span>বিল ক্যাশআউট উইথড্রয়াল ফরম</span>
                                    </h3>
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-500/10 text-[#1DB954] rounded-full border border-[#1DB954]/30">
                                      ইনস্ট্যান্ট পেআউট
                                    </span>
                                  </div>

                                  <form onSubmit={handleCashoutSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                                        মেথড সিলেক্ট করুন:
                                      </label>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                        {[
                                          { id: 'bKash', label: 'বিকাশ', icon: <Smartphone className="w-4 h-4 shrink-0" /> },
                                          { id: 'Nagad', label: 'নগদ', icon: <Wallet className="w-4 h-4 shrink-0" /> },
                                          { id: 'Rocket', label: 'রকেট', icon: <Zap className="w-4 h-4 shrink-0" /> },
                                          { id: 'Bank', label: 'ব্যাংক ট্রান্সফার', icon: <Building2 className="w-4 h-4 shrink-0" /> }
                                        ].map(m => (
                                          <button
                                            type="button"
                                            key={m.id}
                                            onClick={() => setCashoutMethod(m.id as any)}
                                            className={`p-2.5 rounded-xl border font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                                              cashoutMethod === m.id
                                                ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] shadow-sm'
                                                : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                                            }`}
                                          >
                                            {m.icon}
                                            <span>{m.label}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                      <div>
                                        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                                          অ্যাকাউন্ট নম্বর:
                                        </label>
                                        <input
                                          type="text"
                                          required
                                          placeholder="01700000000"
                                          value={cashoutAccountNumber}
                                          onChange={(e) => setCashoutAccountNumber(e.target.value)}
                                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                                        />
                                      </div>

                                      <div>
                                        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                                          অ্যাকাউন্ট হোল্ডার নাম:
                                        </label>
                                        <input
                                          type="text"
                                          required
                                          placeholder="নাম লিখুন"
                                          value={cashoutAccountName}
                                          onChange={(e) => setCashoutAccountName(e.target.value)}
                                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                                        />
                                      </div>

                                      <div>
                                        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                                          পরিমাণ (৳):
                                        </label>
                                        <input
                                          type="number"
                                          required
                                          min={500}
                                          max={availableBalance}
                                          value={cashoutAmount}
                                          onChange={(e) => setCashoutAmount(Number(e.target.value))}
                                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-black text-[#1DB954]"
                                        />
                                        <div className="flex gap-1 mt-1.5">
                                          {[1000, 5000, 10000, availableBalance].map((amt, idx) => (
                                            <button
                                              key={idx}
                                              type="button"
                                              onClick={() => setCashoutAmount(amt)}
                                              className="px-2 py-0.5 bg-slate-100 hover:bg-[#1DB954] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-950 text-[10px] font-bold rounded transition"
                                            >
                                              ৳{amt.toLocaleString('bn-BD')} {amt === availableBalance ? '(Max)' : ''}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                                        বিশেষ মেমো / নোট (ঐচ্ছিক):
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="জরুরী ক্যাশআউট রিকোয়েস্ট..."
                                        value={cashoutNote}
                                        onChange={(e) => setCashoutNote(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                                      />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2">
                                      <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <Send className="w-4 h-4 fill-slate-950" />
                                        <span>ক্যাশআউট রিকোয়েস্ট সাবমিট করুন</span>
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            )}

                            {/* TAB 4: HISTORY (WITH 4 COMPACT COMBINED STAT CARDS AND FILTERS) */}
                            {payoutSubTab === 'history' && (
                              <div className="space-y-5 animate-fadeIn font-bengali">
                                {/* 5 COMPACT COMBINED STAT CARDS */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                  {/* CARD 1: MARKETPLACE EARNINGS */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400 shrink-0" /> মার্কেটপ্লেস আয়
                                      </span>
                                      <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">গিগ</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ৳{mktEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">গিগ ও প্রজেক্ট আয়</div>
                                  </div>

                                  {/* CARD 2: MENTOR & COURSE EARNINGS */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <GraduationCap className="w-3.5 h-3.5 text-teal-400 shrink-0" /> মেন্টর ও কোর্স
                                      </span>
                                      <span className="text-[9px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">কোর্স ফি</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ৳{mntEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">স্টুডেন্ট এনরোলমেন্ট</div>
                                  </div>

                                  {/* CARD 3: CASHOUT READY BALANCE */}
                                  <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-950/30 border-2 border-[#1DB954] rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-emerald-800 dark:text-[#1DB954] flex items-center gap-1.5 truncate">
                                        <Wallet className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> ক্যাশআউট ব্যালেন্স
                                      </span>
                                      <span className="text-[9px] text-[#1DB954] bg-[#1DB954]/20 px-1.5 py-0.5 rounded font-black shrink-0">রেডি</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-[#1DB954] tracking-tight">
                                      ৳{availableBalance.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold truncate">উইথড্র করার জন্য প্রস্তুত</div>
                                  </div>

                                  {/* CARD 4: SUCCESSFUL CASHOUTS (WITH LAST CASHOUT) */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> সফল ক্যাশআউট
                                      </span>
                                      <span className="text-[9px] text-emerald-600 dark:text-[#1DB954] bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">
                                        {approvedPayouts.length}টি সফল
                                      </span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ৳{totalApprovedPaid.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">
                                      {lastCashout ? `সর্বশেষ: ৳${lastCashout.amount.toLocaleString('bn-BD')} (${lastCashout.paymentMethod})` : 'পরিশোধিত পেআউট'}
                                    </div>
                                  </div>

                                  {/* CARD 5: PENDING REQUESTS */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs col-span-2 sm:col-span-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" /> প্রসেসিং রিকোয়েস্ট
                                      </span>
                                      <span className="text-[9px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">পেন্ডিং</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-amber-500 tracking-tight">
                                      ৳{sellerPayouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0).toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-bold truncate">
                                      {sellerPayouts.filter(p => p.status === 'Pending').length}টি আবেদন অপেক্ষমাণ
                                    </div>
                                  </div>
                                </div>

                                {/* FILTER & SEARCH BAR */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-sm">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    {/* STATUS FILTER PILLS */}
                                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
                                      {[
                                        { id: 'All', label: 'সবগুলো' },
                                        { id: 'Approved', label: '✓ পরিশোধিত' },
                                        { id: 'Pending', label: '⏳ পেন্ডিং' },
                                        { id: 'Rejected', label: '✕ বাতিল' }
                                      ].map(btn => (
                                        <button
                                          key={btn.id}
                                          onClick={() => setPayoutStatusFilter(btn.id as any)}
                                          className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs shrink-0 ${
                                            payoutStatusFilter === btn.id
                                              ? 'bg-[#1DB954] text-slate-950 font-black shadow-sm'
                                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                          }`}
                                        >
                                          {btn.label}
                                        </button>
                                      ))}
                                    </div>

                                    {/* MIN AMOUNT & SEARCH INPUTS */}
                                    <div className="flex items-center gap-2 text-xs">
                                      <select
                                        value={payoutMinAmount}
                                        onChange={(e) => setPayoutMinAmount(Number(e.target.value))}
                                        className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                                      >
                                        <option value={0}>সকল পরিমাণ</option>
                                        <option value={1000}>৳১,০০০+</option>
                                        <option value={10000}>৳১০,০০০+</option>
                                        <option value={50000}>৳৫০,০০০+</option>
                                      </select>

                                      <div className="relative flex-1 sm:w-48">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                          type="text"
                                          placeholder="খুঁজুন (মেথড/নম্বর)..."
                                          value={payoutSearchQuery}
                                          onChange={(e) => setPayoutSearchQuery(e.target.value)}
                                          className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* HISTORY TABLE */}
                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                    {filteredPayouts.length === 0 ? (
                                      <div className="text-center py-8 space-y-2">
                                        <p className="text-slate-400 text-xs font-bold">প্রদত্ত ফিল্টারে কোনো ক্যাশআউট ইতিহাস পাওয়া যায়নি</p>
                                        <button
                                          onClick={() => {
                                            setPayoutStatusFilter('All');
                                            setPayoutMinAmount(0);
                                            setPayoutSearchQuery('');
                                          }}
                                          className="text-xs text-[#1DB954] font-bold underline"
                                        >
                                          ফিল্টার রিসেট করুন
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                          <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                                              <th className="pb-2.5">ID</th>
                                              <th className="pb-2.5">তারিখ</th>
                                              <th className="pb-2.5">মেথড ও নম্বর</th>
                                              <th className="pb-2.5">নোট/বিবরণ</th>
                                              <th className="pb-2.5 text-right">পরিমাণ</th>
                                              <th className="pb-2.5 text-center">স্ট্যাটাস</th>
                                              <th className="pb-2.5 text-right">অ্যাকশন</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                                            {filteredPayouts.map((p, idx) => {
                                              const isPending = p.status === 'Pending';
                                              const isPaid = p.status === 'Approved' || p.status === 'Paid';
                                              const openUpward = idx >= filteredPayouts.length - 2 && filteredPayouts.length > 2;

                                              return (
                                                <tr
                                                  key={p.id}
                                                  className={`transition ${
                                                    isPending
                                                      ? 'bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-950/20 dark:hover:bg-amber-950/30'
                                                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                  }`}
                                                >
                                                  <td className="py-3 font-mono text-slate-500">{p.id}</td>
                                                  <td className="py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{p.requestedAt}</td>
                                                  <td className="py-3 text-slate-900 dark:text-white whitespace-nowrap">
                                                    <span className="font-bold">{p.paymentMethod}</span> <span className="font-mono text-slate-500">({p.accountNumber})</span>
                                                  </td>
                                                  <td className="py-3 text-slate-500 dark:text-slate-400 line-clamp-1 max-w-[200px]">
                                                    {p.note || 'ইনস্ট্যান্ট পেআউট'}
                                                  </td>
                                                  <td className="py-3 text-right text-[#1DB954] font-black text-sm whitespace-nowrap">
                                                    ৳{p.amount.toLocaleString('bn-BD')}
                                                  </td>
                                                  <td className="py-3 text-center whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                                      isPaid
                                                        ? 'bg-emerald-500/20 text-[#1DB954]'
                                                        : isPending
                                                        ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                                        : 'bg-rose-500/20 text-rose-500'
                                                    }`}>
                                                      {isPaid ? '✓ পরিশোধিত' : isPending ? '⏳ পেন্ডিং' : p.status}
                                                    </span>
                                                  </td>
                                                  <td className="py-3 text-right whitespace-nowrap relative">
                                                    <div className="relative inline-block text-left">
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          setOpenPayoutMenuId(openPayoutMenuId === p.id ? null : p.id);
                                                        }}
                                                        title="মেনু অপশন (এডিট / বাতিল)"
                                                        className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 ${
                                                          isPending
                                                            ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                        }`}
                                                      >
                                                        <MoreVertical className="w-4 h-4" />
                                                      </button>

                                                      {openPayoutMenuId === p.id && (
                                                        <div
                                                          onClick={(e) => e.stopPropagation()}
                                                          className={`absolute right-0 z-50 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-1 text-left font-sans ${
                                                            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
                                                          }`}
                                                        >
                                                          {isPending ? (
                                                            <>
                                                              <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                                                                <Clock className="w-3 h-3 animate-pulse" />
                                                                <span>প্রক্রিয়াধীন আবেদন</span>
                                                              </div>
                                                              <button
                                                                onClick={() => {
                                                                  setOpenPayoutMenuId(null);
                                                                  setEditPendingAmount(p.amount);
                                                                  setEditPendingMethod((p.paymentMethod || 'bKash') as any);
                                                                  setEditPendingAccount(p.accountNumber);
                                                                  setIsEditPendingModalOpen(true);
                                                                }}
                                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                                                              >
                                                                <Pencil className="w-3.5 h-3.5 text-blue-500" />
                                                                <span>এডিট করুন</span>
                                                              </button>
                                                              <button
                                                                onClick={() => {
                                                                  setOpenPayoutMenuId(null);
                                                                  if (confirm(`আপনি কি ৳${p.amount.toLocaleString('bn-BD')} এর ক্যাশআউট আবেদনটি বাতিল করতে চান?`)) {
                                                                    setAvailableBalance(prev => prev + p.amount);
                                                                    setActivePendingPayout(null);
                                                                    alert('আপনার ক্যাশআউট আবেদনটি সফলভাবে বাতিল করা হয়েছে।');
                                                                  }
                                                                }}
                                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/15 transition cursor-pointer"
                                                              >
                                                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                                <span>বাতিল করুন</span>
                                                              </button>
                                                            </>
                                                          ) : (
                                                            <>
                                                              <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[10px] font-bold text-emerald-500">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                <span>{isPaid ? 'পরিশোধিত' : 'স্ট্যাটাস চূড়ান্ত'}</span>
                                                              </div>
                                                              <div
                                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed select-none"
                                                                title="পরিশোধিত হওয়ায় এডিট করা যাবে না"
                                                              >
                                                                <Lock className="w-3.5 h-3.5" />
                                                                <span>এডিট (লকড)</span>
                                                              </div>
                                                              <div
                                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed select-none"
                                                                title="পরিশোধিত হওয়ায় বাতিল করা যাবে না"
                                                              >
                                                                <Lock className="w-3.5 h-3.5" />
                                                                <span>বাতিল (লকড)</span>
                                                              </div>
                                                              <p className="px-2 pb-0.5 text-[9px] text-slate-400 font-normal leading-tight">
                                                                টাকা পরিশোধ সম্পন্ন হওয়ায় এটি পরিবর্তনযোগ্য নয়।
                                                              </p>
                                                            </>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

            </div>
          </div>
        </>
      );
    })()}
  </div>
      ) : (
        /* BUYER MARKETPLACE VIEW — MODERN FIVERR DESIGN */
        <div className="space-y-10 animate-fadeIn font-english">
          
          {/* MESSENGER VIEW (STANDALONE / EMBEDDED IN BROWSE MODE) */}
          {activeSubTab === 'messenger' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-none overflow-hidden shadow-md sm:my-4 my-0">
              <MarketplaceMessengerView
                isEmbedded={true}
                initialCategory={messengerSubTabFilter}
                externalSearchQuery={messengerSearchQuery}
                onSearchQueryChange={setMessengerSearchQuery}
                onClose={() => setActiveSubTab('gigs')}
              />
            </div>
          )}

          {/* CATALOG SECTION (HERO + RECOMMENDATIONS + PRO SERVICES + SUBTABS) - ONLY IN MARKETPLACE BROWSE MODE */}
          {(activeSubTab === 'gigs' || activeSubTab === 'ptenit-services' || activeSubTab === 'courses' || activeSubTab === 'jobs') && (
            <div className="space-y-10">
              {/* WELCOME BACK USER HERO BANNER (COMPACT SIZING AS REQUESTED) */}
              <div className="space-y-2">
                <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, <span className="text-[#1DB954]">{currentUser?.name || 'Mds Kazi Sohag'}</span>
                </h1>

                {/* TWO RECOMMENDED ACTION CARDS - COMPACT TYPOGRAPHY */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  
                  {/* CARD 1: POST A PROJECT BRIEF */}
                  <div className="p-2.5 sm:p-3.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#1DB954]/10 dark:bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">Post project brief</h3>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">Get tailored offers.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPostProjectModalOpen(true)}
                      className="w-full sm:w-auto px-2 py-0.5 sm:px-3 sm:py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1DB954] dark:hover:border-[#1DB954] text-slate-800 dark:text-slate-200 text-[9px] sm:text-[11px] font-bold rounded-md transition cursor-pointer whitespace-nowrap text-center shadow-2xs"
                    >
                      Get started
                    </button>
                  </div>

                  {/* CARD 2: TAILOR PTENit TO YOUR NEEDS */}
                  <div className="p-2.5 sm:p-3.5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">Tailor to needs</h3>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">Better recommendations.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="w-full sm:w-auto px-2 py-0.5 sm:px-3 sm:py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1DB954] dark:hover:border-[#1DB954] text-slate-800 dark:text-slate-200 text-[9px] sm:text-[11px] font-bold rounded-md transition cursor-pointer whitespace-nowrap text-center shadow-2xs"
                    >
                      Add info
                    </button>
                  </div>

                </div>
              </div>

              {/* SECTION 1: BASED ON WHAT YOU MIGHT BE LOOKING FOR (HIDDEN ON MOBILE PHONES) */}
              <div className="hidden md:block space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Based on what you might be looking for
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* Left Column: Filter Sidebar Tags */}
                  <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 h-fit">
                    {[
                      { name: 'Keep exploring', active: true },
                      { name: 'Social Media Marketing', active: false },
                      { name: 'Social Media Management', active: false },
                      { name: 'Web & Mobile App', active: false },
                      { name: 'AI Chatbots', active: false },
                      { name: 'Logo & Graphic Design', active: false }
                    ].map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (tag.name !== 'Keep exploring') setSearchQuery(tag.name);
                          else setSearchQuery('');
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-between ${
                          tag.active && !searchQuery
                            ? 'bg-slate-100 dark:bg-slate-800 text-[#1DB954] font-bold'
                            : searchQuery && tag.name.toLowerCase().includes(searchQuery.toLowerCase())
                            ? 'bg-slate-100 dark:bg-slate-800 text-[#1DB954] font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <span>{tag.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      </button>
                    ))}
                  </div>

                  {/* Right Column: Gig Cards Horizontal Grid */}
                  <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                    {filteredGigs.slice(0, 4).map(gig => (
                      <GigCard
                        key={gig.id}
                        gig={gig}
                        onClick={() => {
                          setSelectedGig(gig);
                          setSelectedPackage('standard');
                        }}
                        currentUser={currentUser}
                        savedGigIds={savedGigIds}
                        toggleFavorite={toggleFavorite}
                        deleteGig={deleteGig}
                      />
                    ))}
                  </div>

                </div>
              </div>

              {/* SECTION 2: GIGS YOU MAY LIKE */}
              <div className="space-y-3 font-bengali">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs sm:text-base md:text-lg font-bold text-slate-900 dark:text-white">
                    আপনার পছন্দ হতে পারে এমন গিগসমূহ
                  </h2>
                  <button
                    onClick={() => setActiveSubTab('gigs')}
                    className="text-[11px] sm:text-xs font-bold text-[#1DB954] hover:underline cursor-pointer"
                  >
                    সবগুলো দেখুন →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                  {filteredGigs.map(gig => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      onClick={() => {
                        setSelectedGig(gig);
                        setSelectedPackage('standard');
                      }}
                      currentUser={currentUser}
                      savedGigIds={savedGigIds}
                      toggleFavorite={toggleFavorite}
                      deleteGig={deleteGig}
                    />
                  ))}
                </div>
              </div>

              {/* SECTION 3: VERIFIED PRO SERVICES */}
              <div className="p-4 sm:p-8 bg-slate-900 text-white rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6 border border-slate-800 shadow-xl font-bengali">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/15 border border-[#1DB954]/30 px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full">
                      PTENit Verified Pro
                    </span>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-black mt-2">ভেরিফায়েড প্রফেশনাল টিম ও সার্ভিসেস</h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">হাই-কোয়ালিটি প্রজেক্টের জন্য সেরা ভেরিফায়েড ডেভেলপার ও ডিজাইনার।</p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('gigs')}
                    className="text-xs sm:text-sm font-bold text-[#1DB954] hover:underline hidden sm:block cursor-pointer"
                  >
                    সবগুলো দেখুন →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                  {filteredGigs.slice(0, 4).map(gig => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      onClick={() => {
                        setSelectedGig(gig);
                        setSelectedPackage('premium');
                      }}
                      currentUser={currentUser}
                      savedGigIds={savedGigIds}
                      toggleFavorite={toggleFavorite}
                      deleteGig={deleteGig}
                      badgeTag="PTENit Pro ⭐"
                    />
                  ))}
                </div>
              </div>

              {/* SUB-TABS NAVIGATION FOR CUSTOM PROJECTS & ACTIVE ORDERS */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 pt-2 sm:pt-4 no-scrollbar">
                <button
                  onClick={() => setActiveSubTab('gigs')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'gigs'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Order Catalog ({filteredGigs.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('ptenit-services')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'ptenit-services'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  🏢 PTENit Agency Services ({services.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('courses')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'courses'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  🎓 PTENit Academy Courses ({courses.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('jobs')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'jobs'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Custom Client Briefs
                </button>

                {currentUser && (
                  <button
                    onClick={() => setActiveSubTab('my-orders')}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      activeSubTab === 'my-orders'
                        ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    My Active Orders ({marketplaceOrders.length})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PTENIT AGENCY SERVICES TAB */}
          {activeSubTab === 'ptenit-services' && (
            <div className="space-y-4 animate-fadeIn font-bengali">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🏢 PTENit কোড অফিশিয়াল আইটি সার্ভিসেস</span>
                    <span className="px-2.5 py-0.5 bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold rounded-full">গ্যারান্টিযুক্ত সার্ভিস</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">প্রতিষ্ঠান পরিচালিত শতভাগ বিশ্বস্ত ও উচ্চমানের ওয়েবসাইট, সফটওয়্যার ও মার্কেটিং সলিউশন।</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(serv => (
                  <div
                    key={serv.id}
                    onClick={() => {
                      const matchedGig: MarketplaceGig = gigs.find(
                        g => g.id === serv.id || g.title.toLowerCase() === serv.title.toLowerCase()
                      ) || {
                        id: serv.id,
                        sellerId: 'ptenit-agency',
                        sellerName: 'PTENit Official Agency',
                        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        sellerLevel: 'Top Rated Official Agency',
                        title: serv.title,
                        category: serv.category,
                        description: serv.fullDescription || serv.shortDescription,
                        thumbnail: serv.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
                        rating: serv.rating || 5.0,
                        reviewsCount: serv.reviewsCount || 48,
                        packages: serv.packages || {
                          basic: { name: 'Basic Package', price: 10000, deliveryDays: 3, revisions: '3', features: serv.features || ['কাস্টম ডিজাইন'] },
                          standard: { name: 'Standard Package', price: 20000, deliveryDays: 5, revisions: '5', features: serv.features || ['কাস্টম ডিজাইন', 'এসইও'] },
                          premium: { name: 'Premium Package', price: 35000, deliveryDays: 7, revisions: 'Unlimited', features: serv.features || ['কাস্টম ডিজাইন', 'এসইও', 'সাপোর্ট'] }
                        },
                        tags: ['Official', 'PTENit', serv.category],
                        status: 'active' as const
                      };
                      setSelectedGig(matchedGig);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#1DB954] transition shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img src={serv.thumbnail} alt={serv.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-[#1DB954] text-slate-950 text-[10px] font-black rounded-full shadow">
                          অফিশিয়াল সেবা
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#1DB954] transition">
                        {serv.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {serv.shortDescription}
                      </p>
                      <div className="space-y-1">
                        {(serv.features || []).slice(0, 3).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">শুরু মাত্র:</span>
                      <span className="text-sm font-black text-[#1DB954]">{serv.priceText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PTENIT ACADEMY COURSES TAB */}
          {activeSubTab === 'courses' && (
            <div className="space-y-4 animate-fadeIn font-bengali">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🎓 PTENit একাডেমি প্রফেশনাল ট্রেনিং কোর্সসমূহ</span>
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded-full">লাইভ ব্যাচ & সার্টিফিকেট</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">মার্কেটপ্লেসে সফল ক্যারিয়ার গড়ে তুলতে প্রফেশনালদের কাছ থেকে সরাসরি শিখুন।</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map(crs => (
                  <div
                    key={crs.id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('courses');
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-[#1DB954] transition shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img src={crs.thumbnail} alt={crs.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full shadow">
                          {crs.level === 'live_batch' ? 'লাইভ ব্যাচ' : 'সার্টিফাইড কোর্স'}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#1DB954] transition line-clamp-1">
                        {crs.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        মেন্টর: {crs.instructor}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>📚 {crs.lessonsCount} টি ক্লাস</span>
                        <span>⏱️ {crs.duration}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1DB954]">কোর্স ফি:</span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {crs.isFree ? 'ফ্রি কোর্স' : `৳${(crs.discountPrice || crs.price || 0).toLocaleString('bn-BD')}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAVED GIGS / FAVORITES VIEW (WORKS FOR LOGGED IN & GUEST USERS) */}
          {activeSubTab === 'saved_gigs' && !selectedGig && (
            <div className="space-y-4 font-bengali animate-fadeIn pb-12 pt-14 sm:pt-2">
              {/* Gigs Grid (Minimum 2 Columns) or Empty State */}
              {savedGigs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
                  {savedGigs.map(gig => (
                    <GigCard
                      key={gig.id}
                      gig={gig}
                      onClick={() => {
                        setSelectedGig(gig);
                        setSelectedPackage('standard');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      currentUser={currentUser}
                      savedGigIds={savedGigIds}
                      toggleFavorite={toggleFavorite}
                      deleteGig={deleteGig}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-10 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-lg mx-auto shadow-sm">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/50">
                    <Heart className="w-8 h-8 text-rose-400 stroke-1" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      আপনার পছন্দের তালিকায় কোনো গিগ নেই
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      মার্কেটপ্লেসের বিভিন্ন গিগ ব্রাউজ করে হার্ট (❤️) আইকনে ক্লিক করে সহজেই পছন্দের তালিকায় সংরক্ষণ করুন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                    }}
                    className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-white text-xs font-black rounded-xl transition cursor-pointer shadow-md inline-flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>মার্কেটপ্লেস গিগসমূহ ব্রাউজ করুন</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MY ACTIVE DASHBOARD TABS (LOGGED OUT VIEW) */}
          {(initialCategory === 'my-orders' || ['overview', 'my-orders', 'my-courses', 'settings', 'post-project', 'public-offers', 'messenger'].includes(activeSubTab)) && !currentUser && (
            <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-5 font-bengali max-w-lg mx-auto my-8 sm:my-12 shadow-xl animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-[#1DB954] flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {activeSubTab === 'my-courses' ? 'আমার কোর্সসমূহ (লগইন আবশ্যক)' : activeSubTab === 'my-orders' ? 'আমার অর্ডারসমূহ (লগইন আবশ্যক)' : activeSubTab === 'messenger' ? 'মেসেঞ্জার ইনবক্স (লগইন আবশ্যক)' : 'লগইন প্রয়োজন (Login Required)'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                  আপনার ক্রয়কৃত প্রজেক্ট, কোর্স, মেসেজ এবং ড্যাশবোর্ডের তথ্যাদি দেখতে অনুগ্রহ করে লগইন করুন অথবা একটি নতুন অ্যাকাউন্ট তৈরি করুন।
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={openAuthModal}
                  className="w-full sm:w-auto px-6 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-lg inline-flex items-center justify-center gap-2 active:scale-95"
                >
                  <User className="w-4 h-4 text-white" />
                  <span>লগইন বা রেজিস্টার করুন</span>
                </button>
                <button
                  onClick={() => {
                    setActiveSubTab('gigs');
                    setSelectedCategory('All');
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 transition cursor-pointer active:scale-95"
                >
                  মার্কেটপ্লেসে ফিরে যান
                </button>
              </div>
            </div>
          )}

          {/* MY ACTIVE ORDERS TAB (LOGGED IN VIEW) */}
          {(initialCategory === 'my-orders' || ['overview', 'my-orders', 'my-courses', 'settings', 'post-project', 'public-offers', 'messenger'].includes(activeSubTab)) && currentUser && (
            <div id="my-orders-section" className="space-y-4 font-bengali animate-fadeIn">
              
              {/* STICKY TOP HEADER & FILTER CONTAINER (DESKTOP ONLY - MOBILE USES FIXED MAIN MARKETPLACE HEADER) */}
              <div className="hidden md:block sticky top-0 z-30 bg-slate-900 text-white backdrop-blur-md pt-0 pb-1 sm:py-3 space-y-2 -mx-0 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-slate-800 shadow-xl">
                
                {/* DEDICATED CLEAN BUYER & STUDENT DASHBOARD TOP HEADER */}
                <div className="bg-slate-900 text-white rounded-none sm:rounded-2xl p-2.5 sm:p-5 border-b sm:border border-slate-800">
                  {/* PHONE VIEW HEADER (md:hidden) - FB LITE STYLE WITH MERGED ICON NAVIGATION */}
                  <div className="md:hidden space-y-2 font-bengali">
                    {/* Top Row: Title + Profile & Menu Buttons */}
                    <div className="flex items-center justify-between gap-2 px-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-[#1DB954] text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-[#1DB954]/20">
                          <LayoutDashboard className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-extrabold text-sm text-white truncate">
                          {activeSubTab === 'my-orders' 
                            ? 'আমার ক্রয়কৃত প্রজেক্ট ও সার্ভিসসমূহ' 
                            : activeSubTab === 'my-courses'
                            ? 'আমার ক্রয়কৃত ও ফ্রি কোর্সসমূহ'
                            : activeSubTab === 'messenger'
                            ? 'মেসেঞ্জার ও চ্যাট ইনবক্স'
                            : 'গ্রাহক ড্যাশবোর্ড'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsEditProfileModalOpen(true)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95"
                          title="প্রোফাইল"
                        >
                          <User className="w-4 h-4 text-emerald-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsMobileMarketplaceMenuOpen(true)}
                          className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95"
                          title="মেনু"
                        >
                          <Menu className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* FACEBOOK LITE ICON-ONLY NAVIGATION BAR */}
                    <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5 text-slate-300 w-full overflow-hidden">
                      {/* 1. 🏠 Marketplace Home */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGig(null);
                          setViewMode('buying');
                          setActiveSubTab('gigs');
                          setSelectedCategory('All');
                          setSearchQuery('');
                          setIsInboxModalOpen(false);
                          setIsNotificationsOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex-1 flex justify-center items-center py-1.5 transition active:scale-95 cursor-pointer ${
                          activeSubTab === 'gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (activeTab === 'marketplace' || !activeTab) ? 'text-[#1DB954]' : 'text-white'
                        }`}
                        title="মার্কেটপ্লেস হোম"
                      >
                        <Home className={`w-5 h-5 ${activeSubTab === 'gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (activeTab === 'marketplace' || !activeTab) ? 'text-[#1DB954]' : 'text-white'}`} />
                      </button>

                      {/* 2. 🛍️ Order & Courses */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            if (openAuthModal) openAuthModal();
                            return;
                          }
                          setSelectedGig(null);
                          setViewMode('buying');
                          setActiveSubTab('my-orders');
                          setIsInboxModalOpen(false);
                          setIsNotificationsOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                          (activeSubTab === 'my-orders' || activeSubTab === 'my-courses') && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'text-[#1DB954]' : 'text-white'
                        }`}
                        title="আমার ক্রয়কৃত প্রজেক্ট ও কোর্সসমূহ"
                      >
                        <ShoppingBag className={`w-5 h-5 ${(activeSubTab === 'my-orders' || activeSubTab === 'my-courses') && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'stroke-[2.5] text-[#1DB954]' : 'text-white'}`} />
                      </button>

                      {/* 3. ✉️ Messenger */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            if (openAuthModal) openAuthModal();
                            return;
                          }
                          openMessengerInbox();
                        }}
                        className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                          isMessengerInboxOpen ? 'text-[#1DB954]' : 'text-white hover:text-[#1DB954]'
                        }`}
                        title="মেসেঞ্জার"
                      >
                        <Mail className={`w-5 h-5 ${isMessengerInboxOpen ? 'text-[#1DB954] stroke-[2.5]' : 'text-white'}`} />
                        {(directMessages && directMessages.length > 0) && (
                          <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
                            {directMessages.filter(m => !m.read).length > 0 
                              ? directMessages.filter(m => !m.read).length 
                              : directMessages.length}
                          </span>
                        )}
                      </button>

                      {/* 5. 🔔 Notification */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            if (openAuthModal) openAuthModal();
                            return;
                          }
                          openNotificationCenter();
                        }}
                        className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                          isNotificationCenterOpen ? 'text-[#1DB954]' : 'text-white hover:text-[#1DB954]'
                        }`}
                        title="নোটিফিকেশন"
                      >
                        <Bell className={`w-5 h-5 ${isNotificationCenterOpen ? 'text-[#1DB954] stroke-[2.5]' : 'text-white'}`} />
                        {(notifications && notifications.length > 0) && (
                          <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                            {notifications.filter(n => !n.read).length > 0 
                              ? notifications.filter(n => !n.read).length 
                              : notifications.length}
                          </span>
                        )}
                      </button>

                      {/* 6. ❤️ Saved / Favorites */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser) {
                            if (openAuthModal) openAuthModal();
                            return;
                          }
                          setSelectedGig(null);
                          setViewMode('buying');
                          setActiveSubTab('saved_gigs');
                          setIsInboxModalOpen(false);
                          setIsNotificationsOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                          activeSubTab === 'saved_gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'text-[#1DB954]' : 'text-white'
                        }`}
                        title="পছন্দের সেভ করা গিগসমূহ"
                      >
                        <Heart className={`w-5 h-5 ${activeSubTab === 'saved_gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'fill-[#1DB954] text-[#1DB954]' : 'text-white'}`} />
                        {savedGigIds && savedGigIds.length > 0 && (
                          <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                            {savedGigIds.length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ATTACHED UNIFIED MESSENGER HEADER FOR PHONE VIEW (CUSTOMER DASHBOARD PHONE HEADER - SAME COLOR AS TOPBAR #0B132B) */}
                  {activeSubTab === 'messenger' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (
                    <div className="w-full font-bengali bg-[#0B132B] px-3 py-2 border-t border-slate-800/80">
                      {activeMessengerConversationId && activeMessengerUser ? (
                        <div className="flex items-center justify-between w-full animate-in fade-in duration-150 py-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={() => {
                                if (setActiveMessengerConversationId) setActiveMessengerConversationId(null);
                              }}
                              className="p-1 -ml-1 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer shrink-0"
                              title="ইনবক্সে ফিরে যান"
                            >
                              <ChevronLeft className="w-5 h-5 text-slate-100" />
                            </button>
                            <div className="relative shrink-0">
                              <img
                                src={activeMessengerUser.avatar}
                                alt={activeMessengerUser.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-700/80 shadow-2xs"
                              />
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1DB954] border-2 border-[#0B132B]" />
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                              <div className="flex items-center gap-1">
                                <h2 className="text-xs sm:text-sm font-black text-white tracking-tight leading-tight truncate">
                                  {activeMessengerUser.name}
                                </h2>
                                <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 fill-blue-400/20" />
                              </div>
                              <p className="text-[10px] text-[#1DB954] font-bold leading-none mt-0.5 truncate flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shrink-0" />
                                <span>Active now (অনলাইনে আছেন)</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const meetBtn = document.getElementById('messenger-meet-trigger');
                                if (meetBtn) meetBtn.click();
                              }}
                              className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition cursor-pointer"
                              title="ভিডিও কল"
                            >
                              <Video className="w-4.5 h-4.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const phoneBtn = document.getElementById('messenger-phone-trigger');
                                if (phoneBtn) phoneBtn.click();
                              }}
                              className="p-1.5 rounded-full text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition cursor-pointer"
                              title="ভয়েস কল"
                            >
                              <PhoneCall className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </div>
                      ) : isMessengerSearchActive ? (
                        <div className="flex items-center gap-2 animate-in fade-in duration-150">
                          <div className="relative flex-1">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={messengerSearchQuery}
                              onChange={(e) => setMessengerSearchQuery(e.target.value)}
                              placeholder="সেলার, ক্লায়েন্ট বা সার্ভিস খুঁজুন..."
                              autoFocus
                              className="w-full pl-8 pr-7 py-1 bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/80 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                            />
                            {messengerSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setMessengerSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMessengerSearchActive(false);
                              setMessengerSearchQuery('');
                            }}
                            className="px-2 py-1 rounded-lg text-slate-300 hover:text-white text-xs font-bold cursor-pointer shrink-0"
                          >
                            বাতিল
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => setActiveSubTab('gigs')}
                              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                              title="ফিরে যান"
                            >
                              <ChevronLeft className="w-5 h-5 text-slate-200" />
                            </button>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h2 className="text-sm font-black text-white tracking-tight leading-none">Messages</h2>
                                <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold leading-tight mt-0.5">PiTen Marketplace Inbox</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsMessengerSearchActive(true)}
                              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                              title="সার্চ করুন"
                            >
                              <Search className="w-4.5 h-4.5 text-slate-200" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const settingsBtn = document.getElementById('messenger-settings-trigger');
                                if (settingsBtn) settingsBtn.click();
                              }}
                              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                              title="সেটিংস"
                            >
                              <Settings className="w-4.5 h-4.5 text-slate-200" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DESKTOP VIEW HEADER (hidden md:flex) */}
                  <div className="hidden md:flex md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1DB954] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md shadow-[#1DB954]/20">
                        <LayoutDashboard className="w-5 h-5 text-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-lg sm:text-xl font-black text-white">
                            {activeSubTab === 'my-orders' ? 'আমার ক্রয়কৃত প্রজেক্ট ও সার্ভিসসমূহ' : 'গ্রাহক ড্যাশবোর্ড'}
                          </h1>
                          <span className="hidden sm:inline-flex px-2 py-0.5 bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-extrabold rounded-full border border-[#1DB954]/40">
                            অল-ইন-ওয়ান প্যানেল
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-bold hidden sm:block">
                          আপনার মার্কেটপ্লেস প্রজেক্ট অর্ডার এবং এনরোলকৃত কোর্সসমূহ একই স্থান থেকে পরিচালনা করুন
                        </p>
                      </div>
                    </div>

                    {/* Right Header Action Bar: Home, Marketplace, Notifications, Messenger, Profile & Logout */}
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                      
                      {/* 1. PTEN IT Home Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (setActiveTab) setActiveTab('home');
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95"
                        title="PTEN IT হোম পেজে ফিরে যান"
                      >
                        <Home className="w-4 h-4 text-emerald-400" />
                        <span>হোম</span>
                      </button>

                      {/* 2. Marketplace Gigs Catalog Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('gigs');
                          setSelectedGig(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#1DB954] hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow-xs active:scale-95"
                        title="মার্কেটপ্লেসে যান"
                      >
                        <Store className="w-4 h-4 text-slate-950" />
                        <span>মার্কেটপ্লেস</span>
                      </button>

                      {/* 3. Messenger / Direct Inbox */}
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          openMessengerInbox();
                        }}
                        className="relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                        title="মেসেঞ্জার ও চ্যাট"
                      >
                        <Mail className="w-4 h-4 text-slate-200" />
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#1DB954] text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs">
                          {directMessages.filter(m => !m.read).length || 3}
                        </span>
                      </button>

                      {/* 4. Notification Bell */}
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(!isNotificationsOpen);
                          setIsInboxModalOpen(false);
                        }}
                        className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border ${
                          isNotificationsOpen
                            ? 'bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                        title="নটিফিকেশনসমূহ"
                      >
                        <Bell className="w-4 h-4 text-slate-200" />
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs">
                          {notifications.filter(n => !n.read).length || 3}
                        </span>
                      </button>

                      {/* 5. Profile & Dropdown */}
                      {currentUser && (
                        <div className="relative">
                          <button
                            onClick={() => {
                              setIsProfileDropdownOpen(!isProfileDropdownOpen);
                              setIsNotificationsOpen(false);
                              setIsInboxModalOpen(false);
                            }}
                            className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
                            title="প্রোফাইল অ্যাকাউন্ট মেনু"
                          >
                            <img
                              src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                              alt={currentUser.name}
                              className="w-6 h-6 rounded-full object-cover border border-[#1DB954]"
                            />
                            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Profile Dropdown Popup inside Dashboard Header */}
                          {isProfileDropdownOpen && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={() => setIsProfileDropdownOpen(false)}
                              />
                              <div className="absolute right-0 top-10 z-50 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 font-bengali text-white">
                                <div className="px-3.5 py-2 border-b border-slate-800 flex items-center gap-2">
                                  <img
                                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                                    alt={currentUser.name}
                                    className="w-7 h-7 rounded-full object-cover border border-[#1DB954]"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                                    <p className="text-[10px] text-[#1DB954] font-bold truncate">🛒 মার্কেটপ্লেস বায়ার</p>
                                  </div>
                                </div>

                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setIsProfileDropdownOpen(false);
                                      setIsEditProfileModalOpen(true);
                                    }}
                                    className="w-full px-3.5 py-1.5 text-left text-xs font-bold text-slate-200 hover:bg-slate-800 hover:text-[#1DB954] flex items-center gap-2 transition cursor-pointer"
                                  >
                                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                                    <span>সেটিং ও প্রোফাইল</span>
                                  </button>
                                </div>

                                <div className="pt-1 border-t border-slate-800">
                                  <button
                                    onClick={() => {
                                      setIsProfileDropdownOpen(false);
                                      setActiveSubTab('gigs');
                                      logout();
                                    }}
                                    className="w-full px-3.5 py-1.5 text-left text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition cursor-pointer"
                                  >
                                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                                    <span>লগ আউট</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Quick Logout Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setActiveSubTab('gigs');
                          logout();
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0"
                        title="লগ আউট"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 12 COLUMNS GRID FOR BUYER DASHBOARD: LEFT SIDEBAR + RIGHT CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 pt-2 font-bengali">
                
                {/* Left Col: Buyer Profile Navigation Menu & Quick Stats */}
                <div className="hidden lg:block lg:col-span-3 xl:col-span-3 space-y-5">
                  {/* Buyer Profile Identity Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-5 text-slate-900 dark:text-white shadow-sm">
                    
                    {/* Profile Header */}
                    <div className="pb-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                              alt={currentUser?.name || 'বায়ার'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#1DB954]"
                            />
                            <span className="w-3 h-3 rounded-full bg-[#1DB954] border-2 border-white dark:border-slate-900 absolute bottom-0 right-0" title="Online Now"></span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                              <h2 className="text-sm font-black text-slate-900 dark:text-white truncate">
                                {currentUser?.name || 'বায়ার'}
                              </h2>
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/30">
                                <BadgeCheck className="w-3 h-3 text-[#1DB954]" />
                                🛒 বায়ার & 🎓 স্টুডেন্ট
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate mt-0.5">
                              @{currentUser?.name ? currentUser.name.toLowerCase().replace(/\s+/g, '') : 'ptenitbuyer'}
                            </p>
                          </div>
                        </div>

                        {/* Sound Toggle + 3-Dot Options Menu */}
                        <div className="flex items-center gap-1.5 shrink-0 font-bengali">
                          {/* Sound Effect Toggle Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const nextState = !isToolkitSoundOn;
                              setIsToolkitSoundOn(nextState);
                              setIsOfferSoundEnabled(nextState);
                              try {
                                localStorage.setItem('ptenit_toolkit_sound', String(nextState));
                                localStorage.setItem('ptenit_offer_sound_enabled', JSON.stringify(nextState));
                              } catch {}
                              if (!nextState) {
                                stopOfferNotificationSound();
                              }
                              playToolkitSound(nextState ? 'unmute' : 'mute', true);
                            }}
                            className={`relative p-2 rounded-xl transition flex items-center justify-center border cursor-pointer active:scale-90 shadow-xs group ${
                              isToolkitSoundOn
                                ? 'bg-emerald-500/10 dark:bg-emerald-950/40 text-[#1DB954] border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                                : 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-500 border-rose-300 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                            }`}
                            title={isToolkitSoundOn ? "সাউন্ড অন আছে (মিউট করতে ক্লিক করুন)" : "সাউন্ড বন্ধ আছে (চালু করতে ক্লিক করুন)"}
                          >
                            {isToolkitSoundOn ? (
                              <>
                                <Volume2 className="w-4 h-4 text-[#1DB954] group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#1DB954] ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                              </>
                            ) : (
                              <>
                                <VolumeX className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                              </>
                            )}
                          </button>

                          <div className="relative z-20 shrink-0 font-bengali">
                            <button
                              onClick={() => setIsHeaderMoreMenuOpen(!isHeaderMoreMenuOpen)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center"
                              title="প্রোফাইল আপডেট ও নিরাপত্তা সেটিংস (3-Dots)"
                            >
                              <MoreVertical className="w-4 h-4 text-[#1DB954]" />
                            </button>

                            {isHeaderMoreMenuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-40 cursor-default"
                                  onClick={() => setIsHeaderMoreMenuOpen(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2.5 space-y-1 text-xs animate-fadeIn">
                                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <span>বায়ার অপশন & সিকিউরিটি</span>
                                    <span className="text-[#1DB954]">● Active</span>
                                  </div>

                                  {/* 1. Profile Update button */}
                                  <button
                                    onClick={() => {
                                      setIsHeaderMoreMenuOpen(false);
                                      setIsBuyerProfileModalOpen(true);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs font-black text-slate-900 dark:text-white hover:bg-[#1DB954]/15 rounded-xl flex items-center gap-2 transition cursor-pointer text-[#1DB954]"
                                  >
                                    <User className="w-4 h-4 text-[#1DB954]" />
                                    <span>প্রোফাইল, ছবি, হোয়াটসঅ্যাপ & পাসওয়ার্ড আপডেট</span>
                                  </button>

                                  {/* 2. Switch Account Section */}
                                  <div className="py-1 border-t border-slate-100 dark:border-slate-800">
                                    <p className="px-2 text-[10px] font-black uppercase text-slate-400 mb-1">অ্যাকাউন্ট সুইচ করুন</p>
                                    <div className="space-y-1 max-h-36 overflow-y-auto">
                                      {accountsList.map((acc) => (
                                        <button
                                          key={acc.id}
                                          onClick={() => {
                                            setActiveAccount(acc);
                                            setEditProfileName(acc.name);
                                            setIsHeaderMoreMenuOpen(false);
                                            setSwitchSuccessMsg(`সফলভাবে '${acc.name}' অ্যাকাউন্টে সুইচ করা হয়েছে!`);
                                            if (acc.type === 'buyer') {
                                              setViewMode('buying');
                                            } else {
                                              setViewMode('selling');
                                            }
                                            setTimeout(() => setSwitchSuccessMsg(''), 4000);
                                          }}
                                          className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                                            activeAccount.id === acc.id
                                              ? 'bg-[#1DB954]/15 border border-[#1DB954]/40 text-slate-900 dark:text-white'
                                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <img src={acc.avatar} alt={acc.name} className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-300 dark:border-slate-700" />
                                            <div className="min-w-0">
                                              <p className="font-bold text-xs truncate">{acc.name}</p>
                                              <p className="text-[10px] text-slate-400 truncate">{acc.role}</p>
                                            </div>
                                          </div>
                                          {activeAccount.id === acc.id && <Check className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 3. Switch to Seller Mode */}
                                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                      onClick={() => {
                                        setIsHeaderMoreMenuOpen(false);
                                        setViewMode('selling');
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-xs font-bold text-amber-500 hover:bg-amber-500/10 rounded-xl flex items-center gap-2 transition cursor-pointer"
                                    >
                                      <Zap className="w-3.5 h-3.5" />
                                      <span>সেলার ড্যাশবোর্ডে সুইচ করুন</span>
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Navigation Sidebar Menu */}
                    <div className="space-y-3 pt-1 font-bengali">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">গ্রাহক নেভিগেশন মেনু</p>
                      
                      <div className="space-y-2">
                        {/* 1. আমার কোর্স সমূহ (সদাসর্বদা দৃশ্যমান) */}
                        <button
                          onClick={() => {
                            setActiveSubTab('my-courses');
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-xs font-black transition flex items-center justify-between gap-2 cursor-pointer ${
                            activeSubTab === 'my-courses'
                              ? 'bg-blue-600 text-white shadow-md font-black'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <GraduationCap className="w-4.5 h-4.5 text-blue-400" />
                            <span className="text-sm">আমার কোর্স সমূহ</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-200">
                            {userEnrollments.length}টি
                          </span>
                        </button>

                        {/* 2. মেসেঞ্জার ও চ্যাট ইনবক্স */}
                        <button
                          onClick={() => {
                            setActiveSubTab('messenger');
                            openMessengerInbox();
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-xs font-black transition flex items-center justify-between gap-2 cursor-pointer ${
                            activeSubTab === 'messenger'
                              ? 'bg-[#0084FF] text-white shadow-md font-black'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageCircle className="w-4.5 h-4.5 text-[#0084FF]" />
                            <span className="text-sm">মেসেঞ্জার ও চ্যাট ইনবক্স</span>
                          </div>
                          {directMessages.filter(m => !m.read).length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                              {directMessages.filter(m => !m.read).length}
                            </span>
                          )}
                        </button>

                        {/* 3. মার্কেটপ্লেস প্রজেক্ট অর্ডার (সদাসর্বদা দৃশ্যমান) */}
                        <button
                          onClick={() => {
                            setActiveSubTab('my-orders');
                            setBuyerOrderStatusFilter('all');
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-xs font-black transition flex items-center justify-between gap-2 cursor-pointer ${
                            activeSubTab === 'my-orders'
                              ? 'bg-[#1DB954] text-slate-950 shadow-md font-black'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-4.5 h-4.5 text-slate-900 dark:text-white" />
                            <span className="text-sm">মার্কেটপ্লেস প্রজেক্ট অর্ডার</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900/15 dark:bg-slate-950/20 text-slate-900 dark:text-white">
                            {allBuyerOrders.length}টি
                          </span>
                        </button>

                        {/* Switch to Specialist Mode Shortcut (Shown only if user has a Specialist account) */}
                        {currentUser && (currentUser.role === 'instructor' || currentUser.role === 'admin' || (currentUser as any).isSpecialist) && (
                          <button
                            onClick={() => setViewMode('selling')}
                            className="w-full p-3 rounded-2xl text-left text-xs font-black text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between transition cursor-pointer mt-4"
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              <span>স্পেশালিস্ট মোডে সুইচ করুন</span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Main Content Area */}
                <div className="lg:col-span-9 xl:col-span-9 space-y-5 font-bengali">

                    {/* CENTRAL ALL-IN-ONE WELCOME BANNER (For Overview) */}
                    {activeSubTab === 'overview' && (
                      <div className="space-y-4">
                        {/* Premium Hero Welcome Banner */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl shadow-lg relative overflow-hidden border border-slate-800/80">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-[#1DB954]/10 rounded-full blur-2xl pointer-events-none" />
                          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-md shrink-0">
                                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <h2 className="text-base font-black text-white">
                                    স্বাগতম, {currentUser?.name || 'গ্রাহক'}!
                                  </h2>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">
                                    কাস্টমার ড্যাশবোর্ড
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-300">
                                  আপনার কোর্স শিক্ষা এবং প্রজেক্ট অর্ডারসমূহ এক নজরে ম্যানেজ করুন।
                                </p>
                              </div>
                            </div>

                            {/* Catalog Direct CTAs */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => setActiveTab?.('courses')}
                                className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                                <span>কোর্স ব্রাউজ</span>
                              </button>
                              <button
                                onClick={() => setActiveTab?.('gigs')}
                                className="px-3 py-1.5 rounded-xl text-xs font-black bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] border border-[#1DB954]/40 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954]" />
                                <span>আইটি সার্ভিস</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ALL-IN-ONE PC-STYLE METRICS GRID (Responsive for Mobile and Desktop) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                          {/* Stat 1: Wallet / Available Balance */}
                          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-sm transition space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">ব্যালেন্স</span>
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-[#1DB954]">
                                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                            </div>
                            <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                              ৳{(currentUser?.walletBalance || 0).toLocaleString('bn-BD')}
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium">এস্ক্রো সুরক্ষিত ওয়ালেট</span>
                          </div>

                          {/* Stat 2: Active / Running Projects */}
                          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-sm transition space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">চলমান অর্ডার</span>
                              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                            </div>
                            <div className="text-base sm:text-xl font-black text-blue-600 dark:text-blue-400">
                              {allBuyerOrders.filter(o => o.status === 'in_progress' || o.status === 'in_review').length}টি
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium">কাজ চলমান রয়েছে</span>
                          </div>

                          {/* Stat 3: Completed Projects */}
                          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-sm transition space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">সম্পন্ন প্রজেক্ট</span>
                              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                            </div>
                            <div className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                              {allBuyerOrders.filter(o => o.status === 'completed').length}টি
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium">১০০% সফল ডেলিভারি</span>
                          </div>

                          {/* Stat 4: Enrolled Courses */}
                          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs hover:shadow-sm transition space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">লার্নিং কোর্স</span>
                              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                            </div>
                            <div className="text-base sm:text-xl font-black text-purple-600 dark:text-purple-400">
                              {userEnrollments.length}টি
                            </div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-medium">অনলাইন সার্টিফিকেট কোর্স</span>
                          </div>
                        </div>

                        {/* Quick Mobile Action Shortcuts Bar */}
                        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs flex items-center justify-between gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
                          <button
                            type="button"
                            onClick={() => setIsPostProjectModalOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-[#1DB954] text-slate-950 text-xs font-black flex items-center gap-1.5 hover:bg-emerald-500 transition shrink-0 cursor-pointer shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ নতুন জব আপলোড</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSubTab('my-orders');
                              setBuyerOrderStatusFilter('all');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954]" />
                            <span>সব অর্ডার দেখুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveSubTab('my-courses')}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                          >
                            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                            <span>কোর্স ক্লাসরুম</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsBuyerProfileModalOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
                          >
                            <User className="w-3.5 h-3.5 text-purple-500" />
                            <span>প্রোফাইল সেটিংস</span>
                          </button>
                        </div>

                        {/* 2 Compact Summary Cards with 'সব দেখুন' */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Card 1: My Courses Summary */}
                          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-500/40 transition">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm">
                                  <GraduationCap className="w-4.5 h-4.5" />
                                  <span>আমার কোর্স সমূহ</span>
                                </div>
                                <button
                                  onClick={() => setActiveSubTab('my-courses')}
                                  className="text-[11px] font-black text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>সব দেখুন</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              {userEnrollments.length > 0 ? (
                                <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-1">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {courses.find(c => c.id === userEnrollments[0]?.courseId)?.title || 'সক্রিয় লার্নিং প্রোগ্রাম'}
                                  </p>
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                    <span>মোট কোর্স: {userEnrollments.length}টি</span>
                                    <span className="font-black text-blue-600 dark:text-blue-400">অগ্রগতি: {userEnrollments[0]?.progress || 0}%</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    এখনো কোনো কোর্সে এনরোল করা হয়নি।
                                  </p>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => setActiveSubTab('my-courses')}
                              className="w-full py-2 px-3 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>কোর্স ক্লাসরুম বিস্তারিত (সব দেখুন)</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Card 2: My Orders Summary */}
                          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col justify-between space-y-3 hover:border-[#1DB954]/40 transition">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#1DB954] font-black text-sm">
                                  <ShoppingBag className="w-4.5 h-4.5" />
                                  <span>মার্কেটপ্লেস প্রজেক্ট অর্ডার</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveSubTab('my-orders');
                                    setBuyerOrderStatusFilter('all');
                                  }}
                                  className="text-[11px] font-black text-[#1DB954] hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>সব দেখুন</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {allBuyerOrders.length > 0 ? (
                                <div className="p-2.5 bg-[#1DB954]/5 rounded-xl border border-[#1DB954]/20 space-y-1">
                                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                    {allBuyerOrders[0]?.title || 'সক্রিয় প্রজেক্ট অর্ডার'}
                                  </p>
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                    <span>মোট অর্ডার: {allBuyerOrders.length}টি</span>
                                    <span className="font-black text-[#1DB954]">মূল্য: ৳{(allBuyerOrders[0]?.amount || 0).toLocaleString('bn-BD')}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    এখনো কোনো প্রজেক্ট অর্ডার নেই।
                                  </p>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setActiveSubTab('my-orders');
                                setBuyerOrderStatusFilter('all');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-[#1DB954] text-slate-950 font-black text-xs hover:bg-[#19a34a] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>সব অর্ডার ও প্রগ্রেস দেখুন</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UNIFIED HUB: MY ORDERS & COURSES (আমার অর্ডার ও কোর্স লার্নিং হাব) */}
                    {(activeSubTab === 'my-orders' || activeSubTab === 'my-courses') && (
                      <div className="space-y-4 font-bengali animate-fadeIn pt-1 sm:pt-0">
                        {/* 3 TABS BAR (ওভারভিউ | প্রজেক্ট অর্ডার | কোর্স ও লার্নিং) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xs">
                          <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                            {/* ১. ওভারভিউ */}
                            <button
                              type="button"
                              onClick={() => {
                                setOrderHubTab('overview');
                                setActiveSubTab('my-orders');
                              }}
                              className={`py-2 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer ${
                                orderHubTab === 'overview'
                                  ? 'bg-slate-900 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              <LayoutDashboard className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                                orderHubTab === 'overview' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                              }`} />
                              <span className="truncate">ওভারভিউ</span>
                            </button>

                            {/* ২. প্রজেক্ট (সবুজ / Emerald কালার) */}
                            <button
                              type="button"
                              onClick={() => {
                                setOrderHubTab('orders');
                                setActiveSubTab('my-orders');
                              }}
                              className={`py-2 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer ${
                                orderHubTab === 'orders' && activeSubTab !== 'my-courses'
                                  ? 'bg-[#1DB954] text-white shadow-xs'
                                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                              }`}
                            >
                              <ShoppingBag className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                                orderHubTab === 'orders' && activeSubTab !== 'my-courses' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                              }`} />
                              <span className="truncate sm:hidden">প্রজেক্ট ({allBuyerOrders.length})</span>
                              <span className="hidden sm:inline truncate">প্রজেক্ট অর্ডার ({allBuyerOrders.length})</span>
                            </button>

                            {/* ৩. কোর্স (নীল / Blue কালার) */}
                            <button
                              type="button"
                              onClick={() => {
                                setOrderHubTab('courses');
                                setActiveSubTab('my-courses');
                              }}
                              className={`py-2 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-black flex items-center justify-center gap-1 sm:gap-1.5 transition cursor-pointer ${
                                orderHubTab === 'courses' || activeSubTab === 'my-courses'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-500/10'
                              }`}
                            >
                              <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                                orderHubTab === 'courses' || activeSubTab === 'my-courses' ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                              }`} />
                              <span className="truncate sm:hidden">কোর্স ({userEnrollments.length > 0 ? userEnrollments.length : 3})</span>
                              <span className="hidden sm:inline truncate">কোর্স ও লার্নিং ({userEnrollments.length > 0 ? userEnrollments.length : 3})</span>
                            </button>
                          </div>
                        </div>

                        {/* VIEW 0: UNIFIED OVERVIEW (ওভারভিউ: একনজরে অর্ডার ও সকল পেমেন্ট হিস্টোরি) */}
                        {orderHubTab === 'overview' && (
                          <div className="space-y-4 animate-fadeIn">
                            {/* 4 Overview Quick Stats Cards (Matching StatsCounter Style & Animation) */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                              {/* 1. মোট প্রজেক্ট */}
                              <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3.5 hover:border-sky-500 transition-all transform hover:-translate-y-0.5 shadow-xs">
                                <div className="p-2.5 sm:p-3.5 rounded-xl bg-sky-500/10 text-sky-500 shrink-0">
                                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                                    <AnimatedOverviewCounter value={`${allBuyerOrders.length > 0 ? allBuyerOrders.length : 6}টি`} />
                                  </h3>
                                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 font-bengali leading-snug">
                                    মোট প্রজেক্ট
                                  </p>
                                </div>
                              </div>

                              {/* 2. এনরোল্ড কোর্স */}
                              <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3.5 hover:border-amber-500 transition-all transform hover:-translate-y-0.5 shadow-xs">
                                <div className="p-2.5 sm:p-3.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
                                    <AnimatedOverviewCounter value={`${userEnrollments.length > 0 ? userEnrollments.length : 3}টি`} />
                                  </h3>
                                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 font-bengali leading-snug">
                                    এনরোল্ড কোর্স
                                  </p>
                                </div>
                              </div>

                              {/* 3. মোট পরিশোধিত */}
                              <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3.5 hover:border-purple-500 transition-all transform hover:-translate-y-0.5 shadow-xs">
                                <div className="p-2.5 sm:p-3.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg sm:text-2xl font-black font-heading text-purple-600 dark:text-purple-400">
                                    <AnimatedOverviewCounter value={`৳${((allBuyerOrders.reduce((acc, o) => acc + (o.amount || 0), 0) + 10000) || 149500).toLocaleString('bn-BD')}`} />
                                  </h3>
                                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 font-bengali leading-snug">
                                    মোট পরিশোধিত
                                  </p>
                                </div>
                              </div>

                              {/* 4. এসক্রো ব্যালেন্স */}
                              <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3.5 hover:border-[#1DB954] transition-all transform hover:-translate-y-0.5 shadow-xs">
                                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[#1DB954]/10 text-[#1DB954] shrink-0">
                                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg sm:text-2xl font-black font-heading text-[#1DB954]">
                                    <AnimatedOverviewCounter value={`৳${((allBuyerOrders.filter(o => o.status !== 'completed').reduce((acc, o) => acc + (o.amount || 0), 0)) || 133000).toLocaleString('bn-BD')}`} />
                                  </h3>
                                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 font-bengali leading-snug">
                                    এসক্রো ব্যালেন্স
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* COMPREHENSIVE PAYMENT & TRANSACTION HISTORY (পেমেন্ট বিবরণী) */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
                              {/* Header & Filter Section */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                <div className="space-y-0.5">
                                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954]" />
                                    <span>পেমেন্ট হিস্টোরি</span>
                                  </h3>
                                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                                    অর্ডার ও কোর্স লেনদেন বিবরণী
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
                                  <button
                                    type="button"
                                    onClick={() => setOverviewInnerTab('all')}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                                      overviewInnerTab === 'all'
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                    }`}
                                  >
                                    সব পেমেন্ট
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setOverviewInnerTab('orders')}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                                      overviewInnerTab === 'orders'
                                        ? 'bg-emerald-600 text-white shadow-xs'
                                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100'
                                    }`}
                                  >
                                    প্রজেক্ট
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setOverviewInnerTab('courses')}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer shrink-0 ${
                                      overviewInnerTab === 'courses'
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-100'
                                    }`}
                                  >
                                    কোর্স
                                  </button>
                                </div>
                              </div>

                              {/* Transaction List Items */}
                              <div className="space-y-2.5">
                                {(() => {
                                  // Combined payment records
                                  const orderTransactions = allBuyerOrders.map((ord, idx) => ({
                                    id: `TRX-${ord.id ? ord.id.replace('ord-mkt-', '').substring(0, 6).toUpperCase() : `ORD-${idx + 1}`}`,
                                    invId: `INV-${idx + 101}`,
                                    type: 'orders',
                                    typeName: 'সার্ভিস',
                                    title: ord.title || 'কাস্টম ফুল-স্ট্যাক ওয়েবসাইট ডেভেলপমেন্ট',
                                    amount: ord.amount || 12000,
                                    method: idx % 2 === 0 ? 'bKash' : 'Nagad',
                                    date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('bn-BD') : '১৮/০৮/২৬',
                                    status: ord.status === 'completed' ? 'পরিশোধিত' : 'হোল্ড (এসক্রো)',
                                    isEscrow: ord.status !== 'completed',
                                    seller: ord.sellerName || 'এক্সপার্ট'
                                  }));

                                  const courseTransactions = [
                                    {
                                      id: 'TRX-CRS-01',
                                      invId: 'INV-881',
                                      type: 'courses',
                                      typeName: 'কোর্স',
                                      title: 'Full-Stack Web Development (MERN + AI)',
                                      amount: 4500,
                                      method: 'bKash',
                                      date: '১২/০৮/২৬',
                                      status: 'পরিশোধিত',
                                      isEscrow: false,
                                      seller: 'PTENit Academy'
                                    },
                                    {
                                      id: 'TRX-CRS-02',
                                      invId: 'INV-712',
                                      type: 'courses',
                                      typeName: 'কোর্স',
                                      title: 'Python Django & AI Backend Engineering',
                                      amount: 5500,
                                      method: 'Nagad',
                                      date: '০৫/০৭/২৬',
                                      status: 'পরিশোধিত',
                                      isEscrow: false,
                                      seller: 'PTENit Academy'
                                    },
                                    {
                                      id: 'TRX-CRS-03',
                                      invId: 'INV-604',
                                      type: 'courses',
                                      typeName: 'কোর্স',
                                      title: 'Next.js 14 & Tailwind Pro Masterclass',
                                      amount: 3200,
                                      method: 'SSLCommerz',
                                      date: '২৮/০৬/২৬',
                                      status: 'পরিশোধিত',
                                      isEscrow: false,
                                      seller: 'PTENit Academy'
                                    }
                                  ];

                                  const combined = overviewInnerTab === 'orders'
                                    ? orderTransactions
                                    : overviewInnerTab === 'courses'
                                    ? courseTransactions
                                    : [...orderTransactions, ...courseTransactions];

                                  if (combined.length === 0) {
                                    return (
                                      <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                                        <Receipt className="w-6 h-6 text-slate-400 mx-auto mb-1 opacity-60" />
                                        <p className="text-xs text-slate-500 font-bold">কোনো পেমেন্ট রেকর্ড নেই</p>
                                      </div>
                                    );
                                  }

                                  return combined.map((trx, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 transition space-y-1.5 border-l-4 ${
                                        trx.type === 'orders'
                                          ? 'border-l-emerald-500 hover:border-emerald-500/80'
                                          : 'border-l-blue-500 hover:border-blue-500/80'
                                      }`}
                                    >
                                      {/* Row 1: ID, Type, Date, Status, Amount */}
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono font-bold">
                                            {trx.id}
                                          </span>
                                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                            trx.type === 'orders'
                                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                          }`}>
                                            {trx.typeName}
                                          </span>
                                          <span className="text-[10px] text-slate-400">
                                            • {trx.date}
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                                            trx.isEscrow
                                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                          }`}>
                                            {trx.status}
                                          </span>
                                          <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                            ৳{trx.amount.toLocaleString('bn-BD')}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Row 2: Title & Details */}
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-xs">
                                        <div className="min-w-0 pr-1">
                                          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                                            {trx.title}
                                          </p>
                                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                            {trx.seller} • <span className="text-slate-700 dark:text-slate-300 font-medium">{trx.method}</span>
                                          </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-1 shrink-0 pt-0.5 sm:pt-0">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              navigator.clipboard?.writeText(trx.id);
                                              alert(`আইডি ${trx.id} কপি হয়েছে!`);
                                            }}
                                            className="px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-slate-200 dark:border-slate-600 transition cursor-pointer"
                                            title="আইডি কপি"
                                          >
                                            <Copy className="w-2.5 h-2.5" />
                                            <span>আইডি</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => alert(`✓ ইনভয়েস (${trx.invId}) PDF ডাউনলোড সম্পন্ন!`)}
                                            className="px-2.5 py-1 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer shadow-xs"
                                          >
                                            <Download className="w-2.5 h-2.5 text-white" />
                                            <span>রসিদ</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>

                              {/* Bottom Action / Guarantee Note */}
                              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                                <div className="flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                                  <span>এসক্রো দ্বারা ১০০% সুরক্ষিত লেনদেন।</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => alert('স্টেটমেন্ট রিপোর্ট প্রস্তুত হচ্ছে...')}
                                  className="font-bold text-[#1DB954] hover:underline whitespace-nowrap cursor-pointer text-left sm:text-right"
                                >
                                  স্টেটমেন্ট রিপোর্ট →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VIEW 1: MY COURSES & ACADEMY FEATURE SUITE */}
                        {(orderHubTab === 'courses' || activeSubTab === 'my-courses') && (
                          <div className="space-y-4 animate-fadeIn">

                        {/* EXACT STUDENT HUB MENU BAR (স্টুডেন্ট মেনুবার) */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5">
                          {/* Header Line */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                              <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-[#1DB954] flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div className="flex items-center gap-2">
                                <span>স্টুডেন্ট মেনুবার</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hidden sm:inline-block">
                                  সক্রিয় শিক্ষার্থী প্যানেল
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGig(null);
                                if (setActiveTab) {
                                  setActiveTab('courses', undefined, true);
                                } else {
                                  setViewMode('buying');
                                  setActiveSubTab('courses');
                                }
                              }}
                              className="text-[#1DB954] hover:text-emerald-400 font-black text-xs sm:text-sm flex items-center gap-1 transition cursor-pointer hover:underline underline-offset-2 shrink-0 ml-auto"
                            >
                              <span>নতুন কোর্স ব্রাউজ →</span>
                            </button>
                          </div>

                          {/* Horizontal Navigation Tabs - Single Line Service Order Style (3 Items) */}
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-1">
                            {/* 1. আমার কোর্স (Shortened) */}
                            <button
                              type="button"
                              onClick={() => setStudentHubActiveTab('my-courses')}
                              className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-0 ${
                                studentHubActiveTab === 'my-courses'
                                  ? 'bg-[#1DB954] border-[#1DB954] text-white shadow-md font-black ring-2 ring-[#1DB954]/40'
                                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-1.5 max-w-full">
                                <BookOpen className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                                  studentHubActiveTab === 'my-courses' ? 'text-white' : 'text-[#1DB954]'
                                }`} />
                                <span className={`text-[11px] sm:text-xs font-black leading-tight truncate ${
                                  studentHubActiveTab === 'my-courses' ? 'text-white' : ''
                                }`}>আমার কোর্স</span>
                              </div>
                              <span className={`text-xs sm:text-sm font-black leading-tight ${
                                studentHubActiveTab === 'my-courses' ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {studentEnrolledCourses.length || 4}টি
                              </span>
                            </button>

                            {/* 2. অ্যাসাইনমেন্ট (বাকি সংখ্যা ডায়নামিক) */}
                            <button
                              type="button"
                              onClick={() => setStudentHubActiveTab('assignments')}
                              className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-0 ${
                                studentHubActiveTab === 'assignments'
                                  ? 'bg-purple-600 border-purple-600 text-white shadow-md font-black ring-2 ring-purple-500/40'
                                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-1.5 max-w-full">
                                <FileText className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                                  studentHubActiveTab === 'assignments' ? 'text-white' : 'text-purple-500'
                                }`} />
                                <span className={`text-[11px] sm:text-xs font-black leading-tight truncate ${
                                  studentHubActiveTab === 'assignments' ? 'text-white' : ''
                                }`}>অ্যাসাইনমেন্ট</span>
                              </div>
                              <span className={`text-xs sm:text-sm font-black leading-tight ${
                                studentHubActiveTab === 'assignments' ? 'text-white font-black' : 'text-amber-600 dark:text-amber-400 font-bold'
                              }`}>
                                {pendingAssignmentsList.length > 0 ? `${pendingAssignmentsList.length}টি বাকি` : 'সব সম্পন্ন'}
                              </span>
                            </button>

                            {/* 3. লাইভ ক্লাস */}
                            <button
                              type="button"
                              onClick={() => setStudentHubActiveTab('live-classes')}
                              className={`py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-0 ${
                                studentHubActiveTab === 'live-classes'
                                  ? 'bg-rose-600 border-rose-600 text-white shadow-md font-black ring-2 ring-rose-500/40'
                                  : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-1.5 max-w-full">
                                <Video className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                                  studentHubActiveTab === 'live-classes' ? 'text-white' : 'text-rose-500'
                                }`} />
                                <span className={`text-[11px] sm:text-xs font-black leading-tight truncate ${
                                  studentHubActiveTab === 'live-classes' ? 'text-white' : ''
                                }`}>লাইভ ক্লাস</span>
                              </div>
                              <span className={`text-[11px] sm:text-xs font-black leading-tight flex items-center gap-1 ${
                                studentHubActiveTab === 'live-classes' ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  studentHubActiveTab === 'live-classes' ? 'bg-white' : 'bg-rose-500'
                                } animate-pulse shrink-0`} />
                                <span>রাত ৯:০০</span>
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* TAB CONTENT 2: CERTIFICATES */}
                        {studentHubActiveTab === 'certificates' && (
                          <div className="space-y-3 font-bengali">
                            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#1DB954]" />
                                <span>অর্জিত ভেরিফাইড কোর্স সার্টিফিকেট ({studentCertificatesList.length} টি)</span>
                              </div>
                              <span className="bg-[#1DB954] text-white font-black px-2.5 py-1 rounded-md text-[10px]">PTENit Verified</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {studentCertificatesList.map((cert) => (
                                <div key={cert.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 hover:border-blue-400/50 transition">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#1DB954] text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/80">
                                        {cert.certId}
                                      </span>
                                      <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{cert.title}</h3>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ইস্যু ডেট: {cert.issueDate} • ফলাফল: {cert.grade}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
                                      <Award className="w-5 h-5" />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                      onClick={() => alert(`সার্টিফিকেট ${cert.certId} ডাউনলোড শুরু হয়েছে!`)}
                                      className="flex-1 py-2 bg-[#1DB954] hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>PDF সার্টিফিকেট</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard?.writeText(`https://ptenit.com/verify/${cert.certId}`);
                                        alert('সার্টিফিকেট ভেরিফিকেশন লিংক কপি হয়েছে!');
                                      }}
                                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>লিংক</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT 3: ASSIGNMENTS & HOMEWORK */}
                        {studentHubActiveTab === 'assignments' && (
                          <div className="space-y-4 font-bengali">
                            {/* Segmented Tab Filter: নতুন (New) | রিভিউ (In Review) | সাকসেস (Success) */}
                            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                                  {/* 1. নতুন (New Assignments) */}
                                  <button
                                    type="button"
                                    onClick={() => setAssignmentStatusFilter('new')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                                      assignmentStatusFilter === 'new'
                                        ? 'bg-purple-600 text-white shadow-xs border border-purple-600 font-black'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                  >
                                    <AlertCircle className={`w-3.5 h-3.5 shrink-0 ${
                                      assignmentStatusFilter === 'new' ? 'text-white' : 'text-amber-500'
                                    }`} />
                                    <span className="truncate">নতুন</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none shrink-0 ${
                                      assignmentStatusFilter === 'new'
                                        ? 'bg-purple-800 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                      {pendingAssignmentsList.length}
                                    </span>
                                  </button>

                                  {/* 2. রিভিউ (In Review) */}
                                  <button
                                    type="button"
                                    onClick={() => setAssignmentStatusFilter('review')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                                      assignmentStatusFilter === 'review'
                                        ? 'bg-amber-500 text-white shadow-xs border border-amber-500 font-black'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                  >
                                    <Clock className={`w-3.5 h-3.5 shrink-0 ${
                                      assignmentStatusFilter === 'review' ? 'text-white' : 'text-amber-500'
                                    }`} />
                                    <span className="truncate">রিভিউ</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none shrink-0 ${
                                      assignmentStatusFilter === 'review'
                                        ? 'bg-amber-700 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                      {submittedTasksList.filter(t => t.status === 'pending').length}
                                    </span>
                                  </button>

                                  {/* 3. সাকসেস (Success / Completed) */}
                                  <button
                                    type="button"
                                    onClick={() => setAssignmentStatusFilter('success')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer min-w-0 ${
                                      assignmentStatusFilter === 'success'
                                        ? 'bg-[#1DB954] text-white shadow-xs border border-[#1DB954] font-black'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                  >
                                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${
                                      assignmentStatusFilter === 'success' ? 'text-white' : 'text-[#1DB954]'
                                    }`} />
                                    <span className="truncate">সাকসেস</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none shrink-0 ${
                                      assignmentStatusFilter === 'success'
                                        ? 'bg-emerald-800 text-white'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                    }`}>
                                      {submittedTasksList.filter(t => t.status === 'completed').length}
                                    </span>
                                  </button>
                                </div>

                                {/* VIEW 1: নতুন (New Pending Assignments) - Compact with Left Purple Stripe */}
                                {assignmentStatusFilter === 'new' && (
                                  <div className="space-y-3">
                                    {pendingAssignmentsList.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pendingAssignmentsList.map((item) => (
                                          <div
                                            key={item.id}
                                            onClick={() => {
                                              setSelectedAssignmentDetail(item);
                                              setAssignmentSubmissionRepo('');
                                              setAssignmentSubmissionNote('');
                                            }}
                                            className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-[5px] border-l-purple-600 dark:border-l-purple-500 shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700/60 transition-all group cursor-pointer flex flex-col justify-between"
                                          >
                                            <div className="space-y-2">
                                              {/* Top Bar: Course Name + Total Marks + Deadline */}
                                              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                                <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-2 py-0.5 rounded-md border border-purple-200/70 dark:border-purple-900/50 truncate max-w-[180px]">
                                                  {item.courseName}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[10px]">
                                                  {item.totalMarks && (
                                                    <span className="font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                                      {item.totalMarks}
                                                    </span>
                                                  )}
                                                  <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-0.5">
                                                    <Clock className="w-3 h-3 text-amber-500" />
                                                    <span>{item.deadline}</span>
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Title */}
                                              <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                                                {item.title}
                                              </h5>
                                            </div>

                                            {/* Bottom Action Row */}
                                            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                <span>বাকি আছে ({item.badge})</span>
                                              </span>
                                              <span className="text-xs font-black text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                                <span>জমা দিন ও বিস্তারিত</span>
                                                <span>→</span>
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#1DB954] flex items-center justify-center mx-auto">
                                          <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">সব অ্যাসাইনমেন্ট জমা সম্পন্ন!</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">বর্তমানে আপনার কোনো নতুন বা বাকি অ্যাসাইনমেন্ট নেই।</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* VIEW 2: রিভিউ (In Review) - Compact with Left Amber Stripe */}
                                {assignmentStatusFilter === 'review' && (
                                  <div className="space-y-3">
                                    {submittedTasksList.filter(t => t.status === 'pending').length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {submittedTasksList
                                          .filter(t => t.status === 'pending')
                                          .map((task) => (
                                            <div
                                              key={task.id}
                                              onClick={() => setSelectedAssignmentDetail(task)}
                                              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-[5px] border-l-amber-500 dark:border-l-amber-400 shadow-xs hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700/60 transition-all group cursor-pointer flex flex-col justify-between"
                                            >
                                              <div className="space-y-2">
                                                {/* Top row */}
                                                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                                  <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-200/70 dark:border-amber-900/50 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                                                    <span>রিভিউ চলছে</span>
                                                  </span>
                                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                    জমা: {task.date}
                                                  </span>
                                                </div>

                                                {/* Title & Course */}
                                                <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                                                  {task.title}
                                                </h5>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                  কোর্স: <strong className="text-slate-700 dark:text-slate-300">{task.courseName || task.course}</strong>
                                                </p>
                                              </div>

                                              {/* Bottom Feedback Snippet */}
                                              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                  💬 {task.feedback || 'ইন্সট্রাকটর মূল্যায়ন করছেন...'}
                                                </span>
                                                <span className="text-xs font-black text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
                                                  <span>ভিউ</span>
                                                  <span>→</span>
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    ) : (
                                      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
                                          <Clock className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">বর্তমানে রিভিউর অপেক্ষায় কোনো অ্যাসাইনমেন্ট নেই</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">নতুন অ্যাসাইনমেন্ট জমা দিলে তা এখানে রিভিউ স্ট্যাটাসে দেখা যাবে।</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* VIEW 3: সাকসেস (Success / Evaluated) - Compact with Left Emerald Stripe */}
                                {assignmentStatusFilter === 'success' && (
                                  <div className="space-y-3">
                                    {submittedTasksList.filter(t => t.status === 'completed').length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {submittedTasksList
                                          .filter(t => t.status === 'completed')
                                          .map((task) => (
                                            <div
                                              key={task.id}
                                              onClick={() => setSelectedAssignmentDetail(task)}
                                              className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-[5px] border-l-[#1DB954] dark:border-l-emerald-500 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all group cursor-pointer flex flex-col justify-between"
                                            >
                                              <div className="space-y-2">
                                                {/* Top row */}
                                                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                                  <span className="text-[10px] font-black text-[#1DB954] bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200/70 dark:border-emerald-900/50 flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3 text-[#1DB954]" />
                                                    <span>মূল্যায়ন সম্পন্ন</span>
                                                  </span>
                                                  <div className="flex items-center gap-1.5">
                                                    {task.marks && (
                                                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                                        মার্কস: {task.marks}
                                                      </span>
                                                    )}
                                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                      {task.date}
                                                    </span>
                                                  </div>
                                                </div>

                                                {/* Title & Course */}
                                                <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#1DB954] transition">
                                                  {task.title}
                                                </h5>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                  কোর্স: <strong className="text-slate-700 dark:text-slate-300">{task.courseName || task.course}</strong>
                                                </p>
                                              </div>

                                              {/* Bottom Feedback Snippet */}
                                              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                                  💬 {task.feedback}
                                                </span>
                                                <span className="text-xs font-black text-[#1DB954] group-hover:translate-x-0.5 transition-transform shrink-0 flex items-center gap-0.5">
                                                  <span>রেজাল্ট</span>
                                                  <span>→</span>
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    ) : (
                                      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#1DB954] flex items-center justify-center mx-auto">
                                          <Award className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">এখনও কোনো মূল্যায়ন সম্পন্ন অ্যাসাইনমেন্ট নেই</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">ইন্সট্রাকটর অ্যাসাইনমেন্ট গ্রেড করলে ফলাফল এখানে প্রকাশিত হবে।</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                            {/* POPUP MODAL: টিচারের টাইটেল ও বিস্তারিত + নিচে লিংক এবং বিস্তারিত জমা */}
                            {selectedAssignmentDetail && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
                                <div
                                  className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col font-bengali"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* Header: Teacher's Title */}
                                  <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                                          {selectedAssignmentDetail.courseName || selectedAssignmentDetail.course || 'কোর্স অ্যাসাইনমেন্ট'}
                                        </span>
                                        {selectedAssignmentDetail.deadline && (
                                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-amber-500" />
                                            <span>শেষ সময়: {selectedAssignmentDetail.deadline}</span>
                                          </span>
                                        )}
                                      </div>
                                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                                        {selectedAssignmentDetail.title}
                                      </h3>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedAssignmentDetail(null)}
                                      className="p-1.5 rounded-xl bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition shrink-0 cursor-pointer"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {/* Body */}
                                  <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
                                    {/* 1. Teacher's Assignment Details (টিচারের বিস্তারিত) */}
                                    <div className="p-3.5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl space-y-1.5">
                                      <span className="text-[11px] font-black text-purple-800 dark:text-purple-300 flex items-center gap-1">
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>অ্যাসাইনমেন্টের বিস্তারিত বিবরণ:</span>
                                      </span>
                                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                                        {selectedAssignmentDetail.description || 'সম্পূর্ণ নির্দেশিকা অনুসরণ করে প্রজেক্ট সম্পন্ন করুন এবং নিচে লিংক জমা দিন।'}
                                      </p>
                                    </div>

                                    {/* 2. SUBMISSION INPUTS (যদি এখনও জমা দেওয়া না হয়ে থাকে) */}
                                    {!selectedAssignmentDetail.date && selectedAssignmentDetail.status !== 'completed' && selectedAssignmentDetail.status !== 'pending' ? (
                                      <div className="space-y-3 pt-1">
                                        {/* Input 1: Link */}
                                        <div>
                                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                            গিটহাব বা লাইভ প্রজেক্ট লিংক: <span className="text-rose-500">*</span>
                                          </label>
                                          <input
                                            type="url"
                                            value={assignmentSubmissionRepo}
                                            onChange={(e) => setAssignmentSubmissionRepo(e.target.value)}
                                            placeholder="https://github.com/username/project অথবা লাইভ লিংক"
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
                                          />
                                        </div>

                                        {/* Input 2: Details / Note */}
                                        <div>
                                          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                            প্রজেক্ট বিস্তারিত / নোট (ঐচ্ছিক):
                                          </label>
                                          <textarea
                                            rows={3}
                                            value={assignmentSubmissionNote}
                                            onChange={(e) => setAssignmentSubmissionNote(e.target.value)}
                                            placeholder="প্রজেক্ট সম্পর্কে কোনো মেসেজ বা বিস্তারিত তথ্য লিখুন..."
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-medium"
                                          />
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="pt-2 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (!assignmentSubmissionRepo.trim()) {
                                                alert('দয়া করে গিটহাব রিপোজিটরি বা লাইভ প্রজেক্ট লিংক প্রদান করুন');
                                                return;
                                              }
                                              const newTask = {
                                                id: `task-${Date.now()}`,
                                                title: selectedAssignmentDetail.title || 'মডিউল অ্যাসাইনমেন্ট প্রজেক্ট',
                                                course: selectedAssignmentDetail.courseName || selectedAssignmentDetail.course || 'Full Stack Web Development',
                                                courseName: selectedAssignmentDetail.courseName || selectedAssignmentDetail.course || 'Full Stack Web Development',
                                                courseId: selectedAssignmentDetail.courseId || 'course-mern-pro',
                                                marks: 'রিভিউর অপেক্ষায়',
                                                status: 'pending' as const,
                                                date: 'আজ (' + new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) + ')',
                                                totalMarks: selectedAssignmentDetail.totalMarks || '৫০ মার্কস',
                                                passMarks: selectedAssignmentDetail.passMarks || '৩৫ মার্কস',
                                                repo: assignmentSubmissionRepo.trim(),
                                                note: assignmentSubmissionNote.trim() || 'সম্পূর্ণ রিকোয়ারমেন্ট অনুযায়ী সমাধান সম্পন্ন করা হয়েছে।',
                                                description: selectedAssignmentDetail.description,
                                                feedback: 'সাবমিশন গ্রহণ করা হয়েছে। ইন্সট্রাকটর শীঘ্রই কোড রিভিউ সম্পন্ন করবেন।'
                                              };

                                              setSubmittedTasksList(prev => [newTask, ...prev]);

                                              if (selectedAssignmentDetail.id) {
                                                setPendingAssignmentsList(prev => prev.filter(p => p.id !== selectedAssignmentDetail.id));
                                              }

                                              setAssignmentSubmissionRepo('');
                                              setAssignmentSubmissionNote('');
                                              setSelectedAssignmentDetail(null);
                                              setAssignmentStatusFilter('review');
                                              alert('✓ অ্যাসাইনমেন্ট সফলভাবে জমা দেওয়া হয়েছে! রিভিউ ট্যাবে যুক্ত হয়েছে।');
                                            }}
                                            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-98"
                                          >
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>জমা দিন (Submit)</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => setSelectedAssignmentDetail(null)}
                                            className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 transition cursor-pointer"
                                          >
                                            বাতিল
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      /* Review & Completed Details View in Popup */
                                      <div className="space-y-3 pt-1">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">আপনার জমাকৃত লিংক:</span>
                                          {selectedAssignmentDetail.repo ? (
                                            <a
                                              href={selectedAssignmentDetail.repo}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-xs font-black text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 break-all"
                                            >
                                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                              <span>{selectedAssignmentDetail.repo}</span>
                                            </a>
                                          ) : (
                                            <span className="text-xs text-slate-700 dark:text-slate-300">লিংক সংরক্ষিত নেই</span>
                                          )}
                                        </div>

                                        {selectedAssignmentDetail.note && (
                                          <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">আপনার সাবমিশন নোট:</span>
                                            <p className="text-xs text-slate-700 dark:text-slate-300">{selectedAssignmentDetail.note}</p>
                                          </div>
                                        )}

                                        <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                                          selectedAssignmentDetail.status === 'completed'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                                        }`}>
                                          <div className="flex items-center justify-between text-xs font-black">
                                            <span>ফিডব্যাক ও স্ট্যাটাস:</span>
                                            {selectedAssignmentDetail.marks && (
                                              <span className="px-2 py-0.5 rounded-md text-xs font-black bg-white dark:bg-slate-900 border">
                                                {selectedAssignmentDetail.marks}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs">
                                            {selectedAssignmentDetail.feedback || 'ইন্সট্রাকটর মূল্যায়ন করছেন...'}
                                          </p>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => setSelectedAssignmentDetail(null)}
                                          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                                        >
                                          বন্ধ করুন
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* TAB CONTENT 4: LIVE CLASSES & SCHEDULE */}
                        {studentHubActiveTab === 'live-classes' && (
                          <div className="space-y-4 font-bengali">
                            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Video className="w-5 h-5 text-rose-500" />
                                <span>লাইভ ক্লাস শিডিউল ও সরাসরি জয়েন (Google Meet)</span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 animate-pulse">
                                ● লাইভ সেশন সক্রিয়
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {studentEnrolledCourses.map((c) => (
                                <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-black border border-rose-200 dark:border-rose-800">
                                        {c.batch}
                                      </span>
                                      <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{c.title}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ইন্সট্রাকটর: {c.instructor}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900">
                                      <Video className="w-5 h-5" />
                                    </div>
                                  </div>

                                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                                      <span>ক্লাস শিডিউল:</span>
                                      <span className="font-bold text-rose-600 dark:text-rose-400">{c.liveSchedule}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                                      <span>ক্লাসরুম স্ট্যাটাস:</span>
                                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Google Meet লিঙ্ক প্রস্তুত</span>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => createGoogleMeetCall(`meet-${c.id}`)}
                                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                                  >
                                    <Video className="w-4 h-4" />
                                    <span>সরাসরি লাইভ ক্লাসে জয়েন করুন</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT 5: AI STUDY TUTOR */}
                        {studentHubActiveTab === 'ai-tutor' && (
                          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 font-bengali">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                                  <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-black text-slate-900 dark:text-white">AI স্টাডি অ্যাসিস্ট্যান্ট ও কোডিং টিউটর</h4>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">২৪/৭ যে কোন প্রবলেম, কোড সমাধান বা কনসেপ্ট বোঝার জন্য প্রশ্ন করুন</p>
                                </div>
                              </div>
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Gemini 2.5 Live
                              </span>
                            </div>

                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                              {aiTutorMessages.map((msg, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                    msg.sender === 'user'
                                      ? 'bg-[#1DB954] text-white ml-auto max-w-[85%]'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 max-w-[92%]'
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              ))}
                              {isAiTutorThinking && (
                                <div className="p-3 rounded-2xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-500 animate-pulse border border-slate-200 dark:border-slate-700 w-36">
                                  AI চিন্তা করছে...
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <input
                                type="text"
                                value={aiTutorInput}
                                onChange={(e) => setAiTutorInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && aiTutorInput.trim()) {
                                    const query = aiTutorInput.trim();
                                    setAiTutorMessages(prev => [...prev, { sender: 'user', text: query }]);
                                    setAiTutorInput('');
                                    setIsAiTutorThinking(true);
                                    setTimeout(() => {
                                      setAiTutorMessages(prev => [
                                        ...prev,
                                        { sender: 'ai', text: `আপনার প্রশ্ন "${query}" এর চমৎকার বিশ্লেষণ: এই বিষয়ের জন্য প্রজেক্টে স্টেট হ্যান্ডলিং ও মডিউলার আর্কিটেকচার বজায় রাখুন। বিস্তারিত কোড সহায়তা লাগলে নির্দিষ্ট ফাংশনটি শেয়ার করুন।` }
                                      ]);
                                      setIsAiTutorThinking(false);
                                    }, 700);
                                  }
                                }}
                                placeholder="আপনার যে কোন কোডিং বা কোর্স সম্পর্কিত প্রশ্ন লিখুন..."
                                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                              />
                              <button
                                onClick={() => {
                                  if (!aiTutorInput.trim()) return;
                                  const query = aiTutorInput.trim();
                                  setAiTutorMessages(prev => [...prev, { sender: 'user', text: query }]);
                                  setAiTutorInput('');
                                  setIsAiTutorThinking(true);
                                  setTimeout(() => {
                                    setAiTutorMessages(prev => [
                                      ...prev,
                                      { sender: 'ai', text: `আপনার প্রশ্ন "${query}" এর চমৎকার বিশ্লেষণ: এই বিষয়ের জন্য প্রজেক্টে স্টেট হ্যান্ডলিং ও মডিউলার আর্কিটেকচার বজায় রাখুন। বিস্তারিত কোড সহায়তা লাগলে নির্দিষ্ট ফাংশনটি শেয়ার করুন।` }
                                    ]);
                                    setIsAiTutorThinking(false);
                                  }, 700);
                                }}
                                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs transition"
                              >
                                জিজ্ঞাসা করুন
                              </button>
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT 1 SHOWS ORIGINAL COURSES LIST WHEN studentHubActiveTab === 'my-courses' */}
                        {studentHubActiveTab === 'my-courses' && (
                          <>
                            {/* Comprehensive Interactive Course Learning Studio Modal */}
                            {activeMarketplaceCourseModal && (
                              <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl relative animate-in fade-in zoom-in duration-200 space-y-4">
                                {/* Header with Close & Badge */}
                                <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                                  <div className="flex items-center gap-2 text-[#1DB954]">
                                    <Sparkles className="w-5 h-5" />
                                    <div>
                                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-[#1DB954] px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                        {activeMarketplaceCourseModal.featureTitle}
                                      </span>
                                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                                        {activeMarketplaceCourseModal.courseTitle}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => setActiveMarketplaceCourseModal(null)}
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                                      title="কোর্স তালিকায় ফিরে যান"
                                    >
                                      <ArrowLeft className="w-3.5 h-3.5" />
                                      <span>তালিকায় ফিরে যান</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveMarketplaceCourseModal(null)}
                                      className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 transition cursor-pointer shrink-0"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Main Course Video Player & Cover Header */}
                                <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-3 sm:p-5 group">
                                  <img
                                    src={activeMarketplaceCourseModal.coverImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80'}
                                    alt={activeMarketplaceCourseModal.courseTitle}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${courseIsPlaying ? 'opacity-30' : 'opacity-65'}`}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30" />

                                  {/* Top Overlaid Tags */}
                                  <div className="relative z-10 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                                        {activeMarketplaceCourseModal.badge || 'PRO COURSE'}
                                      </span>
                                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 text-[10px] font-bold">
                                        {activeMarketplaceCourseModal.batch || 'ব্যাচ-০৮ (লাইভ)'}
                                      </span>
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-amber-400" />
                                      <span>৪.৯ (৫০০+ রিভিউ)</span>
                                    </span>
                                  </div>

                                  {/* Center Play / Pause Controller */}
                                  <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center space-y-2">
                                    <button
                                      type="button"
                                      onClick={() => setCourseIsPlaying(!courseIsPlaying)}
                                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1DB954] hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition transform hover:scale-110 active:scale-95 cursor-pointer"
                                    >
                                      {courseIsPlaying ? (
                                        <div className="flex gap-1">
                                          <div className="w-1.5 h-6 bg-white rounded-xs" />
                                          <div className="w-1.5 h-6 bg-white rounded-xs" />
                                        </div>
                                      ) : (
                                        <Play className="w-7 h-7 fill-white ml-1" />
                                      )}
                                    </button>
                                    <div>
                                      <p className="text-xs sm:text-sm font-black text-white drop-shadow-md">
                                        লেসন {activeCourseLessonNumber}: {activeMarketplaceCourseModal.activeLessonTitle || 'Redux Toolkit State Management & RTK Query Architecture'}
                                      </p>
                                      <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5">
                                        ইন্সট্রাকটর: {activeMarketplaceCourseModal.instructor || 'প্রকৌশলী আল-আমিন'} • HD 1080p Stream
                                      </p>
                                    </div>
                                  </div>

                                  {/* Bottom Player Controller Bar */}
                                  <div className="relative z-10 space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-white font-mono">
                                      <span>18:45</span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const speeds = [1, 1.25, 1.5, 2];
                                            const nextIdx = (speeds.indexOf(coursePlaybackSpeed) + 1) % speeds.length;
                                            setCoursePlaybackSpeed(speeds[nextIdx]);
                                          }}
                                          className="px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[10px] text-emerald-400 font-bold hover:bg-black cursor-pointer"
                                        >
                                          {coursePlaybackSpeed}x Speed
                                        </button>
                                        <span>42:00</span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-slate-700/80 rounded-full h-1.5 overflow-hidden cursor-pointer">
                                      <div className="bg-[#1DB954] h-1.5 rounded-full transition-all duration-300" style={{ width: '45%' }} />
                                    </div>
                                  </div>
                                </div>

                                {/* Quick Lesson Navigation: Previous & Next with Complete Tick */}
                                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeCourseLessonNumber > 1) {
                                        setActiveCourseLessonNumber(activeCourseLessonNumber - 1);
                                      }
                                    }}
                                    disabled={activeCourseLessonNumber <= 1}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                      activeCourseLessonNumber <= 1
                                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100'
                                    }`}
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>পূর্ববর্তী লেসন</span>
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCourseCompletedLessonsMap(prev => ({
                                          ...prev,
                                          [String(activeCourseLessonNumber)]: !prev[String(activeCourseLessonNumber)]
                                        }));
                                      }}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                        courseCompletedLessonsMap[String(activeCourseLessonNumber)]
                                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                                      }`}
                                    >
                                      <CheckCircle2 className={`w-3.5 h-3.5 ${courseCompletedLessonsMap[String(activeCourseLessonNumber)] ? 'text-[#1DB954]' : 'text-slate-400'}`} />
                                      <span>{courseCompletedLessonsMap[String(activeCourseLessonNumber)] ? 'সম্পন্ন হয়েছে ✓' : 'সম্পন্ন মার্ক করুন'}</span>
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (activeCourseLessonNumber < 20) {
                                        setCourseCompletedLessonsMap(prev => ({ ...prev, [String(activeCourseLessonNumber)]: true }));
                                        setActiveCourseLessonNumber(activeCourseLessonNumber + 1);
                                      } else {
                                        alert('অভিনন্দন! আপনি কোর্সের সব লেসন সফলভাবে সম্পন্ন করেছেন। সার্টিফিকেট ডাউনলোড করুন!');
                                      }
                                    }}
                                    className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                                  >
                                    <span>পরবর্তী লেসন</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Feature Mode Selector Pills */}
                                <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 sm:gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                                  {[
                                    { id: 'video', label: 'ভিডিও ক্লাস', icon: Play },
                                    { id: 'live_class', label: 'লাইভ ক্লাস', icon: Video },
                                    { id: 'assignment', label: 'অ্যাসাইনমেন্টস', icon: FileText },
                                    { id: 'quiz', label: 'মডিউল কুইজ', icon: HelpCircle },
                                    { id: 'source_code', label: 'সোর্স কোড', icon: Download },
                                    { id: 'certificate', label: 'সার্টিফিকেট', icon: Award },
                                    { id: 'qna', label: 'AI টিউটর', icon: Bot }
                                  ].map((tab) => {
                                    const IconComp = tab.icon;
                                    const isActive = activeMarketplaceCourseModal.featureType === tab.id;
                                    return (
                                      <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveMarketplaceCourseModal({
                                          ...activeMarketplaceCourseModal,
                                          featureType: tab.id as any,
                                          featureTitle: tab.label
                                        })}
                                        className={`p-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                                          isActive
                                            ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-xs'
                                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                        }`}
                                      >
                                        <IconComp className="w-4 h-4" />
                                        <span className="text-[10px] truncate leading-none">{tab.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* FEATURE DETAILS CONTENT VIEW */}
                                {activeMarketplaceCourseModal.featureType === 'video' && (
                                  <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-slate-800 dark:text-slate-200">কোর্সের সম্পূর্ণ সিলেবাস ও লেসনসমূহ</span>
                                      <span className="text-[#1DB954] font-black">মোট ২০টি লেসন</span>
                                    </div>
                                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                      {[
                                        { num: 1, title: 'Introduction to Full-Stack Architecture & Environment Setup', dur: '28 Min' },
                                        { num: 2, title: 'ES6+ JavaScript Modern Paradigms & Async Await Mastery', dur: '35 Min' },
                                        { num: 3, title: 'React 18 Component Life-Cycles, Hooks & Custom Hooks', dur: '45 Min' },
                                        { num: 16, title: 'Authentication, JWT Tokens, Cookies & Security Headers', dur: '50 Min' },
                                        { num: 17, title: 'Redux Toolkit State Engine, Slices & RTK Query APIs', dur: '42 Min' },
                                        { num: 18, title: 'Payment Gateway Integration (bKash, Nagad & SSLCommerz)', dur: '48 Min' },
                                        { num: 19, title: 'Realtime WebSockets, Push Notifications & Live Data Sync', dur: '39 Min' },
                                        { num: 20, title: 'Production Cloud Deployment (Docker, CI/CD & Vercel)', dur: '55 Min' }
                                      ].map((l) => (
                                        <div
                                          key={l.num}
                                          onClick={() => {
                                            setActiveCourseLessonNumber(l.num);
                                            setCourseIsPlaying(true);
                                          }}
                                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition cursor-pointer ${
                                            activeCourseLessonNumber === l.num
                                              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-[#1DB954] text-[#1DB954] font-black'
                                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            {courseCompletedLessonsMap[String(l.num)] ? (
                                              <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                                            ) : (
                                              <Play className="w-4 h-4 text-slate-400 shrink-0" />
                                            )}
                                            <span className="truncate">লেসন {l.num}: {l.title}</span>
                                          </div>
                                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">{l.dur}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {activeMarketplaceCourseModal.featureType === 'certificate' && (
                                  <div className="space-y-3 text-center bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    {(activeMarketplaceCourseModal.progress || 0) < 100 ? (
                                      <div className="space-y-3 py-2">
                                        <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto mb-1 border border-amber-200 dark:border-amber-800">
                                          <Clock className="w-6 h-6" />
                                        </div>
                                        <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">সার্টিফিকেট এখনও আনলক হয়নি</h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                          কোর্স সম্পন্ন (১০০%) না হওয়া পর্যন্ত সার্টিফিকেট ডাউনলোড করা যাবে না। আপনার বর্তমান অগ্রগতি: <strong className="text-amber-500">{activeMarketplaceCourseModal.progress || 0}%</strong>
                                        </p>
                                        <div className="w-full max-w-xs mx-auto bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                          <div
                                            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${activeMarketplaceCourseModal.progress || 0}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#1DB954] flex items-center justify-center mx-auto mb-1 border border-emerald-200 dark:border-emerald-800">
                                          <Award className="w-6 h-6" />
                                        </div>
                                        <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">PTENit Verified Digital Course Certificate</h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">শিক্ষার্থী: সোহাগ কাজী • ভেরিফাইড সার্টিফিকেট আইডি: PTEN-CERT-8841</p>
                                        <div className="pt-2 flex items-center justify-center gap-2">
                                          <button onClick={() => alert('সার্টিফিকেট PDF ডাউনলোড শুরু হয়েছে!')} className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs">
                                            <Download className="w-4 h-4" />
                                            <span>PDF সার্টিফিকেট ডাউনলোড</span>
                                          </button>
                                          <button onClick={() => {
                                            navigator.clipboard?.writeText('https://ptenit.com/verify/PTEN-CERT-8841');
                                            alert('ভেরিফিকেশন লিংক কপি হয়েছে!');
                                          }} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer">
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>লিংক কপি</span>
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}

                                {activeMarketplaceCourseModal.featureType === 'source_code' && (
                                  <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#1DB954]" />
                                        <span className="font-bold text-slate-900 dark:text-white text-xs">Full Production Source Code (ZIP File)</span>
                                      </div>
                                      <button onClick={() => alert('সোর্স কোড জিপ ফাইল ডাউনলোড হচ্ছে...')} className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black rounded-lg text-xs cursor-pointer shadow-xs">
                                        ডাউনলোড (48 MB)
                                      </button>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-[#1DB954]" />
                                        <span className="font-bold text-slate-900 dark:text-white text-xs">Official GitHub Clean Repository</span>
                                      </div>
                                      <a href="https://github.com" target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs cursor-pointer">
                                        গিটহাব লিংক ↗
                                      </a>
                                    </div>
                                  </div>
                                )}

                                {activeMarketplaceCourseModal.featureType === 'live_class' && (
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-center">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#1DB954] flex items-center justify-center mx-auto">
                                      <Video className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">লাইভ ডাউট ক্লিয়ারিং ও সমস্যা সমাধান সেশন (Google Meet)</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">সময়: আজ রাত ৯:০০ টা • ইন্সট্রাকটর: প্রকৌশলী আল-আমিন</p>
                                    <button onClick={() => createGoogleMeetCall('course-live')} className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                                      <Video className="w-4 h-4" />
                                      <span>লাইভ ক্লাসে জয়েন করুন</span>
                                    </button>
                                  </div>
                                )}

                                {activeMarketplaceCourseModal.featureType === 'assignment' && (
                                  <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bengali">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2.5">
                                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#1DB954]">
                                          <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <h5 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">কোর্স অ্যাসাইনমেন্টস ও প্রজেক্ট টাস্ক</h5>
                                          <p className="text-[11px] text-slate-500 dark:text-slate-400">ডেডলাইন: আগামী রবিবার রাত ১১:৫৯ মিনিট</p>
                                        </div>
                                      </div>
                                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                        মোট ৩টি অ্যাসাইনমেন্ট
                                      </span>
                                    </div>

                                    <div className="space-y-2 pt-1">
                                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-black text-slate-900 dark:text-white text-xs">অ্যাসাইনমেন্ট ১: ই-কমার্স শপ ড্যাশবোর্ড UI ও স্টেট ম্যানেজমেন্ট</span>
                                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                                            প্রাপ্ত মার্কস: ১০০/১০০ ✓
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">স্ট্যাটাস: চেক করা সম্পন্ন হয়েছে (চমৎকার কোড কোয়ালিটি)</p>
                                      </div>

                                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                                        <div className="flex items-center justify-between">
                                          <span className="font-black text-slate-900 dark:text-white text-xs">অ্যাসাইনমেন্ট ২: JWT Auth & Protected Routes ব্যাকএন্ড এপিআই</span>
                                          {assignmentSubmittedMap['asg-2'] ? (
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                                              জমা দেওয়া হয়েছে ✓
                                            </span>
                                          ) : (
                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                                              পেন্ডিং (জমা দিন)
                                            </span>
                                          )}
                                        </div>

                                        <div className="space-y-2 pt-1">
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                            গিটহাব রিপোজিটরি / লাইভ প্রজেক্ট লিংক:
                                          </label>
                                          <input
                                            type="text"
                                            value={assignmentRepoLink}
                                            onChange={(e) => setAssignmentRepoLink(e.target.value)}
                                            placeholder="https://github.com/username/my-project"
                                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                                          />
                                          <button
                                            onClick={() => {
                                              if (!assignmentRepoLink.trim()) {
                                                alert('দয়া করে গিটহাব রিপোজিটরি বা প্রজেক্ট লিংক দিন');
                                                return;
                                              }
                                              setAssignmentSubmittedMap(prev => ({ ...prev, 'asg-2': true }));
                                              alert('অ্যাসাইনমেন্ট ২ সফলভাবে জমা দেওয়া হয়েছে! ইন্সট্রাকটর দ্রুত রিভিউ করবেন।');
                                            }}
                                            className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-xs transition"
                                          >
                                            {assignmentSubmittedMap['asg-2'] ? 'পুনরায় আপডেট করে জমা দিন' : 'অ্যাসাইনমেন্ট জমা দিন'}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {activeMarketplaceCourseModal.featureType === 'quiz' && (
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">মডিউল কুইজ পরীক্ষা - মডিউল ৪ (Redux & Async Thunks)</p>
                                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 space-y-2">
                                      <p className="font-bold text-slate-900 dark:text-white">প্রশ্ন ১: RTK Query-তে `useQuery` হুক ব্যবহারের প্রধান সুবিধা কোনটি?</p>
                                      <div className="space-y-1.5">
                                        {[
                                          'অটোমেটিক ক্যাশিং, রি-ফেচিং ও লোডিং স্টেট ম্যানেজমেন্ট সুবিধা প্রদান করে',
                                          'শুধু ব্রাউজারের লোকাল স্টোরেজ ডাটা সংরক্ষণ করে',
                                          'শুধুমাত্র সিএসএস স্টাইল লোড করার কাজে লাগে'
                                        ].map((opt, idx) => (
                                          <label
                                            key={idx}
                                            onClick={() => setQuizSelectedOption(idx)}
                                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                                              quizSelectedOption === idx
                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-[#1DB954] text-slate-900 dark:text-white font-bold'
                                                : 'bg-slate-50 dark:bg-slate-800/70 border border-transparent hover:bg-slate-100'
                                            }`}
                                          >
                                            <input type="radio" name="quiz" checked={quizSelectedOption === idx} onChange={() => setQuizSelectedOption(idx)} className="accent-[#1DB954]" />
                                            <span>{opt}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                    {quizSubmitted && (
                                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                                        <span>সঠিক উত্তর! স্কোর: ১০০% (A+ Grade অর্জিত হয়েছে)</span>
                                      </div>
                                    )}
                                    <button
                                      onClick={() => setQuizSubmitted(true)}
                                      className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-xs transition"
                                    >
                                      কুইজের উত্তর জমা দিন
                                    </button>
                                  </div>
                                )}

                                {activeMarketplaceCourseModal.featureType === 'qna' && (
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                                        <Bot className="w-4 h-4 text-[#1DB954]" />
                                        <span>AI লার্নিং টিউটর ও ডাউট সমাধান</span>
                                      </span>
                                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Gemini 2.5 Live</span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                      {aiTutorMessages.map((msg, idx) => (
                                        <div
                                          key={idx}
                                          className={`p-2.5 rounded-xl text-xs ${
                                            msg.sender === 'user'
                                              ? 'bg-[#1DB954] text-white ml-auto max-w-[85%]'
                                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 max-w-[90%]'
                                          }`}
                                        >
                                          {msg.text}
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={aiTutorInput}
                                        onChange={(e) => setAiTutorInput(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' && aiTutorInput.trim()) {
                                            const query = aiTutorInput.trim();
                                            setAiTutorMessages(prev => [...prev, { sender: 'user', text: query }]);
                                            setAiTutorInput('');
                                            setIsAiTutorThinking(true);
                                            setTimeout(() => {
                                              setAiTutorMessages(prev => [
                                                ...prev,
                                                { sender: 'ai', text: `আপনার প্রশ্ন "${query}" এর চমৎকার ব্যাখ্যা: Redux Toolkit-এ createAsyncThunk ও createSlice ব্যবহার করে সহজেই ব্যাকএন্ড API হ্যান্ডেল করা যায় এবং builder.addCase মেথডের সাহায্যে pending, fulfilled ও rejected স্ট্যাটাস কন্ট্রোল করা হয়।` }
                                              ]);
                                              setIsAiTutorThinking(false);
                                            }, 700);
                                          }
                                        }}
                                        placeholder="কোর্সের যে কোন কোড বা প্রশ্ন লিখুন..."
                                        className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                                      />
                                      <button
                                        onClick={() => {
                                          if (!aiTutorInput.trim()) return;
                                          const query = aiTutorInput.trim();
                                          setAiTutorMessages(prev => [...prev, { sender: 'user', text: query }]);
                                          setAiTutorInput('');
                                          setIsAiTutorThinking(true);
                                          setTimeout(() => {
                                            setAiTutorMessages(prev => [
                                              ...prev,
                                              { sender: 'ai', text: `আপনার প্রশ্ন "${query}" এর ব্যাখ্যা: Redux Toolkit এ ক্যাশিং এবং ডেটা ফেচিং এর জন্য RTK Query আদর্শ সমাধান। এটি কোড সাইজ ছোট করে এবং স্টেট সিঙ্ক স্বয়ংক্রিয় রাখে।` }
                                            ]);
                                            setIsAiTutorThinking(false);
                                          }, 700);
                                        }}
                                        className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs rounded-xl cursor-pointer"
                                      >
                                        পাঠান
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Clean Course Cards List - PTEN IT Styled */}
                            <div className="space-y-4 font-bengali">
                              {studentEnrolledCourses.map((course) => (
                                <div
                                  key={course.id}
                                  className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 space-y-3.5 overflow-hidden group"
                                >
                                  {/* Course Title & Instructor Header */}
                                  <div className="flex items-start gap-3.5">
                                    <div
                                      onClick={() => {
                                        if (onStartLearning) {
                                          onStartLearning(course.id, 'video', activeSubTab);
                                        } else if (onOpenDetail) {
                                          onOpenDetail(course.id);
                                        }
                                      }}
                                      className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 cursor-pointer border border-slate-200 dark:border-slate-800 group-hover:scale-102 transition"
                                    >
                                      <img
                                        src={course.coverImage}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <Play className="w-5 h-5 text-white fill-white" />
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1 space-y-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#1DB954]/15 text-[#1DB954]">
                                          {course.badge}
                                        </span>
                                        {course.batch && (
                                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {course.batch}
                                          </span>
                                        )}
                                      </div>
                                      <h4
                                        onClick={() => {
                                          if (onOpenDetail) onOpenDetail(course.id);
                                          else if (onStartLearning) onStartLearning(course.id, 'video', activeSubTab);
                                        }}
                                        className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug truncate hover:text-[#1DB954] transition cursor-pointer"
                                      >
                                        {course.title}
                                      </h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                        ইন্সট্রাক্টর: <span className="text-slate-800 dark:text-slate-200 font-bold">{course.instructor}</span>
                                      </p>
                                    </div>
                                  </div>

                                  {/* Progress bar with exact requested labels */}
                                  <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                      <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-[#1DB954]" />
                                        <span>অগ্রগতি</span>
                                      </span>
                                      <span className="text-[#1DB954] font-black">{course.progress}% সম্পন্ন</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-[#1DB954] to-emerald-400 rounded-full transition-all duration-500"
                                        style={{ width: `${course.progress}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Action Buttons: ক্লাসে যান | বিস্তারিত | লাইভ ক্লাস | সার্টিফিকেট */}
                                  <div className="flex items-center gap-2 pt-1">
                                    {/* Button 1: ক্লাসে যান */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onStartLearning) {
                                          onStartLearning(course.id || 'course-canva', 'video', activeSubTab);
                                        } else {
                                          setActiveMarketplaceCourseModal({
                                            courseTitle: course.title,
                                            courseId: course.id,
                                            coverImage: course.coverImage,
                                            instructor: course.instructor,
                                            instructorRole: course.instructorRole,
                                            batch: course.batch,
                                            badge: course.badge,
                                            progress: course.progress,
                                            completedLessons: course.completedLessons,
                                            totalLessons: course.totalLessons,
                                            activeLessonIndex: (course.completedLessons || 0) + 1,
                                            activeLessonTitle: 'লেসন ' + ((course.completedLessons || 0) + 1),
                                            featureType: 'video',
                                            featureTitle: '🎬 ক্লাস ভিডিও দেখা'
                                          });
                                          setCourseIsPlaying(true);
                                        }
                                      }}
                                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm shadow-[#1DB954]/20 transition cursor-pointer active:scale-95"
                                    >
                                      <PlayCircle className="w-4 h-4 shrink-0" />
                                      <span>ক্লাসে যান</span>
                                    </button>

                                    {/* Button 2: বিস্তারিত */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onOpenDetail) {
                                          onOpenDetail(course.id);
                                        } else {
                                          setActiveMarketplaceCourseModal({
                                            courseTitle: course.title,
                                            courseId: course.id,
                                            coverImage: course.coverImage,
                                            instructor: course.instructor,
                                            instructorRole: course.instructorRole,
                                            batch: course.batch,
                                            badge: course.badge,
                                            progress: course.progress,
                                            completedLessons: course.completedLessons,
                                            totalLessons: course.totalLessons,
                                            activeLessonIndex: 1,
                                            activeLessonTitle: 'কোর্স ওভারভিউ',
                                            featureType: 'syllabus',
                                            featureTitle: '📚 সিলেবাস ও মডিউল'
                                          });
                                        }
                                      }}
                                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
                                    >
                                      <Info className="w-3.5 h-3.5" />
                                      <span>বিস্তারিত</span>
                                    </button>

                                    {/* Button 3: লাইভ ক্লাস (if active/scheduled) */}
                                    {course.isLive && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (onStartLearning) {
                                            onStartLearning(course.id, 'live', activeSubTab);
                                          } else {
                                            setActiveMarketplaceCourseModal({
                                              courseTitle: course.title,
                                              courseId: course.id,
                                              coverImage: course.coverImage,
                                              instructor: course.instructor,
                                              instructorRole: course.instructorRole,
                                              batch: course.batch,
                                              badge: course.badge,
                                              progress: course.progress,
                                              completedLessons: course.completedLessons,
                                              totalLessons: course.totalLessons,
                                              activeLessonIndex: 1,
                                              activeLessonTitle: 'লাইভ ক্লাস',
                                              featureType: 'live_class',
                                              featureTitle: '🎥 লাইভ ডাউট সেশন'
                                            });
                                          }
                                        }}
                                        className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 font-bold text-xs transition cursor-pointer"
                                        title="লাইভ ক্লাস"
                                      >
                                        <Video className="w-4 h-4" />
                                      </button>
                                    )}

                                    {/* Button 4: সার্টিফিকেট (if 100% complete) */}
                                    {course.progress >= 100 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (onStartLearning) {
                                            onStartLearning(course.id, 'certificate', activeSubTab);
                                          } else {
                                            setActiveMarketplaceCourseModal({
                                              courseTitle: course.title,
                                              courseId: course.id,
                                              coverImage: course.coverImage,
                                              instructor: course.instructor,
                                              instructorRole: course.instructorRole,
                                              batch: course.batch,
                                              badge: course.badge,
                                              progress: course.progress,
                                              completedLessons: course.completedLessons,
                                              totalLessons: course.totalLessons,
                                              activeLessonIndex: course.completedLessons,
                                              activeLessonTitle: 'সার্টিফিকেট ভিউ',
                                              featureType: 'certificate',
                                              featureTitle: '🏆 সার্টিফিকেট ভিউ'
                                            });
                                          }
                                        }}
                                        className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 font-bold text-xs transition cursor-pointer"
                                        title="সার্টিফিকেট"
                                      >
                                        <Award className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {studentEnrolledCourses
                                .filter(c => {
                                  if (studentCourseFilter === 'ongoing') return c.progress < 100;
                                  if (studentCourseFilter === 'completed') return c.progress >= 100;
                                  if (studentCourseFilter === 'live') return c.isLive;
                                  return true;
                                })
                                .filter(c => {
                                  if (!studentCourseSearch.trim()) return true;
                                  const q = studentCourseSearch.toLowerCase();
                                  return (
                                    c.title.toLowerCase().includes(q) ||
                                    c.instructor.toLowerCase().includes(q) ||
                                    c.badge.toLowerCase().includes(q)
                                  );
                                }).length === 0 && (
                                <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                                  <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">কোন কোর্স পাওয়া যায়নি</p>
                                  <p className="text-xs text-slate-500">আপনার ফিল্টার পরিবর্তন করুন অথবা নতুন কোর্সে এনরোল করুন।</p>
                                  <button
                                    onClick={() => {
                                      setStudentCourseSearch('');
                                      setStudentCourseFilter('all');
                                    }}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition"
                                  >
                                    ফিল্টার রিসেট করুন
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                  </div>
                )}

                        {/* VIEW 2: MY ORDERS (আমার অর্ডারসমূহ ও লাইভ প্রগ্রেস) */}
                        {orderHubTab === 'orders' && activeSubTab !== 'my-courses' && (
                          <div className="space-y-4 font-bengali animate-fadeIn">
                            {/* Filter Row */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
                              {/* Header Line */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 font-black text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954] shrink-0" />
                                  <span>সার্ভিস অর্ডার</span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedGig(null);
                                    setViewMode('buying');
                                    setActiveSubTab('gigs');
                                    setSelectedCategory('All');
                                    setShowSavedOnly(false);
                                    setSearchQuery('');
                                    setOrderHubTab('orders');
                                    if (setActiveTab) {
                                      setActiveTab('marketplace', 'All', true);
                                    }
                                    window.scrollTo({ top: 0, behavior: 'instant' });
                                  }}
                                  className="text-[#1DB954] hover:text-emerald-400 font-black text-xs sm:text-sm flex items-center transition cursor-pointer hover:underline underline-offset-2 shrink-0 whitespace-nowrap"
                                >
                                  <span>নতুন প্রজেক্ট ব্রাউজ →</span>
                                </button>
                              </div>

                              {/* Status Filter Buttons (Strict 1 Line 4-Column Grid with respective colors) */}
                              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                                {[
                                  {
                                    id: 'public_projects',
                                    label: 'পাবলিক পোস্ট',
                                    count: allBuyerOrders.filter(o => o.isPublicOffer || o.type === 'custom_agency_order' || o.status === 'pending_approval' || o.status === 'pending' || !o.sellerId || o.sellerId === 'unassigned' || o.sellerId === 'pending_expert').length,
                                    activeClass: 'bg-purple-600 text-white shadow-xs font-black',
                                    inactiveClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50',
                                    badgeActive: 'bg-black/20 text-white',
                                    badgeInactive: 'bg-purple-200/70 dark:bg-purple-900 text-purple-900 dark:text-purple-200',
                                  },
                                  {
                                    id: 'in_progress',
                                    label: 'চলমান',
                                    count: allBuyerOrders.filter(o => o.status === 'in_progress').length,
                                    activeClass: 'bg-blue-600 text-white shadow-xs font-black',
                                    inactiveClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50',
                                    badgeActive: 'bg-black/20 text-white',
                                    badgeInactive: 'bg-blue-200/70 dark:bg-blue-900 text-blue-900 dark:text-blue-200',
                                  },
                                  {
                                    id: 'in_review',
                                    label: 'রিভিউ',
                                    count: allBuyerOrders.filter(o => o.status === 'in_review').length,
                                    activeClass: 'bg-amber-500 text-white shadow-xs font-black',
                                    inactiveClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50',
                                    badgeActive: 'bg-black/20 text-white',
                                    badgeInactive: 'bg-amber-200/70 dark:bg-amber-900 text-amber-900 dark:text-amber-200',
                                  },
                                  {
                                    id: 'completed',
                                    label: 'সম্পন্ন',
                                    count: allBuyerOrders.filter(o => o.status === 'completed').length,
                                    activeClass: 'bg-[#1DB954] text-white shadow-xs font-black',
                                    inactiveClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
                                    badgeActive: 'bg-black/20 text-white',
                                    badgeInactive: 'bg-emerald-200/70 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200',
                                  },
                                ].map((f) => {
                                  const isActive = buyerOrderStatusFilter === f.id;
                                  return (
                                    <button
                                      key={f.id}
                                      onClick={() => setBuyerOrderStatusFilter(f.id as any)}
                                      className={`py-1.5 px-1.5 sm:px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer ${
                                        isActive ? f.activeClass : f.inactiveClass
                                      }`}
                                    >
                                      <span className="truncate">{f.label}</span>
                                      <span
                                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-black min-w-4 text-center leading-none ${
                                          isActive ? f.badgeActive : f.badgeInactive
                                        }`}
                                      >
                                        {f.count}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                         {/* Order Cards List */}
                         {(() => {
                           const byStatus = buyerOrderStatusFilter === 'public_projects'
                             ? allBuyerOrders.filter(o => o.isPublicOffer || o.type === 'custom_agency_order' || o.status === 'pending_approval' || o.status === 'pending' || !o.sellerId || o.sellerId === 'unassigned' || o.sellerId === 'pending_expert')
                             : buyerOrderStatusFilter === 'all'
                             ? allBuyerOrders
                             : allBuyerOrders.filter(o => o.status === buyerOrderStatusFilter);

                           const filtered = byStatus.filter(o => {
                             if (!orderSearchQuery) return true;
                             const q = orderSearchQuery.toLowerCase();
                             return (
                               o.title?.toLowerCase().includes(q) ||
                               o.category?.toLowerCase().includes(q) ||
                               o.sellerName?.toLowerCase().includes(q) ||
                               o.id?.toLowerCase().includes(q)
                             );
                           });

                           if (filtered.length === 0) {
                             return (
                               <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                                 <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                                 <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো অর্ডার পাওয়া যায়নি</h3>
                                 <p className="text-xs text-slate-400">এই ফিল্টারে বর্তমানে কোনো অর্ডার নেই।</p>
                               </div>
                             );
                           }

                           return (
                             <div className="space-y-3 sm:space-y-4">
                               {filtered.map((ord) => {
                                 const isPublicProject = !ord.sellerId || ord.sellerId === 'unassigned' || ord.status === 'pending';
                                 const isReceivedByExpert = ord.status === 'in_progress' || ord.status === 'in_review' || ord.status === 'completed';
                                 const progressPercent = ord.progress || (ord.status === 'completed' ? 100 : ord.status === 'in_review' ? 90 : ord.status === 'in_progress' ? 65 : 25);
                                 
                                 const cardStatusClasses =
                                   ord.status === 'completed'
                                     ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                                     : ord.status === 'in_review'
                                     ? 'border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/10'
                                     : ord.status === 'in_progress'
                                     ? 'border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/10'
                                     : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';

                                 const badgeClasses =
                                   ord.status === 'completed'
                                     ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#1DB954] border-emerald-500/30'
                                     : ord.status === 'in_review'
                                     ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                     : ord.status === 'in_progress'
                                     ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                     : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                                const isWorkFirst = ord.offerType === 'work_first' || ord.isWorkFirst || (ord.id.charCodeAt(0) % 2 === 0);
                                const isWorkCompletedBySeller = ord.status === 'in_review' || ord.status === 'completed';
                                const isOrderReleasedAndCompleted = ord.status === 'completed';

                                const stTheme = (() => {
                                  if (ord.status === 'in_progress') {
                                    return {
                                      label: 'রানিং...',
                                      dotBg: 'bg-[#1DB954]',
                                      textColor: 'text-[#1DB954]',
                                      ping: true,
                                      btnBg: 'bg-[#1DB954] hover:bg-[#19a34a] text-white',
                                      msgBorder: 'border-[#1DB954] text-[#1DB954]',
                                      progressBg: 'bg-[#1DB954]',
                                    };
                                  } else if (ord.status === 'in_review') {
                                    return {
                                      label: 'রিভিউ...',
                                      dotBg: 'bg-amber-500',
                                      textColor: 'text-amber-500 dark:text-amber-400',
                                      ping: true,
                                      btnBg: 'bg-amber-500 hover:bg-amber-600 text-white',
                                      msgBorder: 'border-amber-500 text-amber-600 dark:text-amber-400',
                                      progressBg: 'bg-amber-500',
                                    };
                                  } else if (ord.status === 'completed') {
                                    return {
                                      label: 'সম্পন্ন',
                                      dotBg: 'bg-blue-500',
                                      textColor: 'text-blue-500 dark:text-blue-400',
                                      ping: false,
                                      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
                                      msgBorder: 'border-blue-500 text-blue-500 dark:text-blue-400',
                                      progressBg: 'bg-blue-500',
                                    };
                                  } else {
                                    return {
                                      label: 'অপেক্ষমাণ...',
                                      dotBg: 'bg-slate-400',
                                      textColor: 'text-slate-400',
                                      ping: false,
                                      btnBg: 'bg-slate-700 hover:bg-slate-800 text-white',
                                      msgBorder: 'border-slate-400 text-slate-500',
                                      progressBg: 'bg-slate-400',
                                    };
                                  }
                                })();

                                return (
                                  <div
                                    key={ord.id}
                                    className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-sm transition-all font-bengali space-y-2.5 border-l-4 ${
                                      ord.status === 'completed'
                                        ? 'border-l-blue-500 hover:border-l-blue-600'
                                        : ord.status === 'in_review'
                                        ? 'border-l-amber-500 hover:border-l-amber-600'
                                        : 'border-l-emerald-500 hover:border-l-emerald-600'
                                    }`}
                                  >
                                    {/* TOP ROW: Order ID (Left) | Project Tag (Text only) + 3 Dots Menu (Right) */}
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[#0066FF] font-mono text-[10px] sm:text-xs font-bold tracking-tight">
                                        #{ord.id.slice(-8).toUpperCase()}
                                      </span>

                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${
                                            isWorkFirst
                                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/80'
                                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80'
                                          }`}
                                        >
                                          প্রজেক্ট: {isWorkFirst ? 'আগে কাজ শুরু' : 'পেইড'}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={() => setDetailsModalOrder(ord)}
                                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                                          title="বিকল্পসমূহ"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* SECOND ROW: Order Title (Small, Bold) | Price + Subtext */}
                                    <div className="flex items-start justify-between gap-2.5">
                                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug break-words flex-1">
                                        {ord.title || 'করপোরেট ওয়েবসাইট ডেভেলপমেন্ট (WordPress)'}
                                      </h3>

                                      <div className="text-right shrink-0">
                                        <span className="text-xs sm:text-sm font-bold text-[#1DB954] font-mono leading-none block">
                                          ৳{(ord.amount || 18000).toLocaleString('bn-BD')}
                                        </span>
                                        <span className="text-[8px] text-slate-400 font-bold block mt-0.5">
                                          মোট মূল্য
                                        </span>
                                      </div>
                                    </div>

                                    {/* THIRD ROW: Seller Name (Small, Bold) | Dynamic Status Text & Animated Light Dot */}
                                    <div className="flex items-center justify-between gap-2 py-0.5">
                                      {/* Left: Seller Avatar & Name */}
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <img
                                          src={ord.sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                                          alt={ord.sellerName || 'মাহবুবুল আলম'}
                                          className="w-7 h-7 rounded-full object-cover border border-[#1DB954] shrink-0"
                                        />

                                        <div className="min-w-0">
                                          <span className="text-[8px] text-slate-400 font-bold block leading-none">সেলার</span>
                                          <div className="flex items-center gap-1 mt-0.5">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                                              {ord.sellerName || 'মাহবুবুল আলম'}
                                            </span>
                                            <CheckCircle2 className="w-3 h-3 text-blue-500 fill-blue-500 text-white shrink-0" />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right: Dynamic Status Text (Small, Bold) & Animated Light Dot */}
                                      <div className="flex items-center gap-1.5 shrink-0 text-right">
                                        <span className="relative flex h-2 w-2 shrink-0">
                                          {stTheme.ping && (
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stTheme.dotBg} opacity-75`} />
                                          )}
                                          <span className={`relative inline-flex rounded-full h-2 w-2 ${stTheme.dotBg}`} />
                                        </span>
                                        <span className={`text-xs font-bold ${stTheme.textColor} tracking-tight`}>
                                          {stTheme.label}
                                        </span>
                                      </div>
                                    </div>

                                    {/* FOURTH ROW: FULL WIDTH PROGRESS BAR UNDER PROFILE */}
                                    <div className="space-y-1 py-0.5">
                                      <div className="flex items-center justify-between text-[10px] font-bold">
                                        <span className="text-slate-400 font-bold">প্রগতি</span>
                                        <span className={`${stTheme.textColor} font-mono text-xs font-bold`}>{progressPercent}%</span>
                                      </div>
                                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full ${stTheme.progressBg} rounded-full transition-all duration-300`}
                                          style={{ width: `${progressPercent}%` }}
                                        />
                                      </div>
                                    </div>

                                    {/* FIFTH ROW: 3-COLUMN METADATA GRID */}
                                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
                                      <div>
                                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">অর্ডার</span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                                          ৮ জানু, ২০২৬ইং
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">ডেডলাইন</span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                                          ৮ দিন বাকি
                                        </span>
                                      </div>

                                      <div>
                                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">ধরন</span>
                                        <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                                          Web Development
                                        </span>
                                      </div>
                                    </div>

                                    {/* SIXTH ROW: 3 ACTION BUTTONS / STATUS BADGES */}
                                    <div className="flex items-center justify-between gap-1.5 pt-1.5">
                                      {/* Left: Release Button / Success Badge / In-Progress Badge */}
                                      {isOrderReleasedAndCompleted ? (
                                        /* RELEASED / COMPLETED STATE: NON-BUTTON GREEN SUCCESS TEXT BADGE */
                                        <div className="flex-1 py-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-black text-[10px] sm:text-[11px] rounded-xl flex items-center justify-center gap-1 shrink-0">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400 text-white shrink-0" />
                                          <span>প্রজেক্টটি সফল হয়েছে</span>
                                        </div>
                                      ) : isWorkCompletedBySeller ? (
                                        /* SUBMITTED FOR REVIEW STATE: ACTION RELEASE BUTTON */
                                        <button
                                          type="button"
                                          onClick={() => setPayReleaseModalOrder(ord)}
                                          className={`flex-1 py-1.5 px-2.5 ${
                                            isWorkFirst
                                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                              : 'bg-[#1DB954] hover:bg-[#19a34a] text-white'
                                          } font-bold text-[11px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 shrink-0 shadow-2xs`}
                                        >
                                          <DollarSign className="w-3.5 h-3.5" />
                                          <span>{isWorkFirst ? 'বকেয়া পে করুন' : 'রিলিজ করুন'}</span>
                                        </button>
                                      ) : (
                                        /* IN PROGRESS STATE: RUNNING STATUS BADGE */
                                        <div className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-[11px] rounded-xl flex items-center justify-center gap-1 shrink-0">
                                          <Clock className="w-3.5 h-3.5 text-[#1DB954]" />
                                          <span>কাজ চলমান...</span>
                                        </div>
                                      )}

                                      {/* Right Group: 2 Small COLORFUL Buttons Together (Message & Details) */}
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        {/* Colorful Message Button */}
                                        {(() => {
                                          const isRead = readOrderIds[ord.id];
                                          const unreadCount = isRead ? 0 : (ord.unreadMessageCount !== undefined ? ord.unreadMessageCount : (ord.status === 'in_review' ? 2 : ord.status === 'in_progress' ? 1 : 0));

                                          return (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setReadOrderIds(prev => ({ ...prev, [ord.id]: true }));
                                                openChatWindow({
                                                  id: `chat-order-${ord.id}`,
                                                  orderId: ord.id,
                                                  senderName: ord.sellerName || 'সাবরিনা চৌধুরী',
                                                  senderRole: 'seller',
                                                  senderAvatar: ord.sellerAvatar,
                                                  initialMessage: `আসসালামু আলাইকুম ${ord.sellerName || 'সেলার'}! আমি আমার প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") এর জন্য যোগাযোগ করছি।`
                                                });
                                              }}
                                              className="relative py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 shadow-2xs"
                                              title="সেলারকে মেসেজ দিন (পপআপ চ্যাট খুলুন)"
                                            >
                                              <MessageSquare className="w-3.5 h-3.5 text-white" />
                                              <span>মেসেজ</span>
                                              {unreadCount > 0 && (
                                                <span className="px-1 py-0.2 bg-rose-600 text-white text-[8px] font-black rounded-full min-w-[14px] text-center leading-none">
                                                  {unreadCount}
                                                </span>
                                              )}
                                            </button>
                                          );
                                        })()}

                                        {/* Colorful Details Button */}
                                        <button
                                          type="button"
                                          onClick={() => setDetailsModalOrder(ord)}
                                          className="py-1.5 px-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 active:scale-95 shadow-2xs"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-white" />
                                          <span>বিস্তারিত</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

          {/* FIVERR-STYLE MODERN FOOTER */}
          <div className="pt-12 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-8 font-english">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Categories</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>Graphics & Design</li>
                  <li>Digital Marketing</li>
                  <li>Writing & Translation</li>
                  <li>Video & Animation</li>
                  <li>Music & Audio</li>
                  <li>Programming & Tech</li>
                  <li>AI Services</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">For Clients</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>How PTENit Works</li>
                  <li>Customer Stories</li>
                  <li>Quality Guide</li>
                  <li>PTENit Answers</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">For Freelancers</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>Become a PTENit Freelancer</li>
                  <li>Become an Agency</li>
                  <li>Community Hub</li>
                  <li>Forum</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Business Solutions</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>PTENit Pro</li>
                  <li>Project Management Service</li>
                  <li>Expert Sourcing Service</li>
                  <li>Contact Sales</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Company</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>About PTENit</li>
                  <li>Help & Support</li>
                  <li>Trust & Safety</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">PTENit</span>
                <span>© PTENit Marketplace Ltd. 2026</span>
              </div>
              <div className="flex items-center gap-4 font-bold">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> English</span>
                <span>৳ BDT</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* CREATE NEW ORDER MODAL REDIRECT TO DEDICATED PAGE */}
      {isCreateGigModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 font-bengali animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#1DB954] rounded-3xl max-w-lg w-full p-6 space-y-4 text-slate-900 dark:text-white relative shadow-2xl text-center">
            <button
              onClick={() => setIsCreateGigModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center mx-auto border border-[#1DB954]/30">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Upload an Order (গিগ ও ৩টি প্যাকেজ সেটআপ)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                পপআপ এর পরিবর্তে এখন সম্পূর্ণ পেজ জুড়ে ফাইবারের মতো ৩টি প্যাকেজ (Basic, Standard, Premium) সহ গিগ সেটআপ করার জন্য নতুন পেজ উন্মুক্ত করা হয়েছে।
              </p>
            </div>

            <button
              onClick={() => {
                setIsCreateGigModalOpen(false);
                setViewMode('selling');
                setSellerSubTab('create_gig');
              }}
              className="w-full py-3 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 fill-slate-950" />
              <span>গিগ সেটআপ পেজে যান 🚀</span>
            </button>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR FULL SCREEN IMAGE PREVIEW */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[88vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#1DB954] transition cursor-pointer flex items-center gap-1 font-bold text-sm"
            >
              <X className="w-6 h-6" /> বন্ধ করুন
            </button>
            <img
              src={lightboxImage}
              alt="Full View"
              className="max-w-full max-h-[82vh] rounded-2xl object-contain shadow-2xl border-2 border-[#1DB954]"
            />
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 font-bengali animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#1DB954] rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3 text-slate-900 dark:text-white relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsEditProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-black text-emerald-600 dark:text-[#1DB954] flex items-center gap-1.5">
              <Edit className="w-4 h-4 text-[#1DB954]" />
              <span>প্রোফাইল তথ্য আপডেট</span>
            </h3>

            {editProfileSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center font-bold text-xs text-emerald-600 dark:text-[#1DB954]">
                ✓ প্রোফাইল আপডেট সফল হয়েছে!
              </div>
            ) : (
              <form onSubmit={handleUpdateProfileSubmit} className="space-y-2.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">নাম:</label>
                  <input
                    type="text"
                    value={editProfileName}
                    onChange={(e) => setEditProfileName(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">প্রফেশনাল টাইটেল:</label>
                  <input
                    type="text"
                    value={editProfileTitle}
                    onChange={(e) => setEditProfileTitle(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">বায়ো (Bio):</label>
                  <textarea
                    rows={2}
                    value={editProfileBio}
                    onChange={(e) => setEditProfileBio(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">স্কিলস (Skills):</label>
                  <input
                    type="text"
                    value={editProfileSkills}
                    onChange={(e) => setEditProfileSkills(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition font-bengali"
                >
                  প্রোফাইল সেভ করুন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SELLER PRO SUBSCRIPTION MODAL */}
      {isSubscriptionModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#1DB954] rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsSubscriptionModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-0.5">
              <span className="px-2.5 py-0.5 bg-[#1DB954]/20 text-[#1DB954] font-black text-[10px] rounded-full inline-flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#1DB954]" />
                <span>সেলার কাস্টম অর্ডার সাবস্ক্রিপশন</span>
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                বস সেলার প্রো সাবস্ক্রিপশন
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Free Plan */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-slate-500 block text-[11px]">ফ্রি প্ল্যান</span>
                <p className="text-base font-black text-slate-900 dark:text-white">৳০/মাস</p>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[10px]">
                  <li>• স্ট্যান্ডার্ড সাপোর্ট</li>
                  <li>• ৫% প্ল্যাটফর্ম ফি</li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div className="p-3 bg-emerald-500/10 rounded-2xl border-2 border-[#1DB954] space-y-1 text-xs relative overflow-hidden">
                <span className="font-bold text-[#1DB954] block text-[11px]">প্রো সেলার পাস</span>
                <p className="text-base font-black text-emerald-600 dark:text-[#1DB954]">৳৪৯৯/মাস</p>
                <ul className="space-y-1 text-slate-800 dark:text-slate-200 text-[10px] font-bold">
                  <li>✓ কাস্টম অর্ডার আনলক</li>
                  <li>✓ ০% প্ল্যাটফর্ম চার্জ</li>
                </ul>
              </div>
            </div>

            {subscriptionSuccess ? (
              <div className="p-2 bg-emerald-500/20 text-[#1DB954] font-bold text-xs rounded-xl text-center border border-[#1DB954]">
                ✓ আপনার প্রো সেলার সাবস্ক্রিপশন সফলভাবে রিনিউ করা হয়েছে!
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSubscriptionSuccess(true);
                  setIsProSubscribed(true);
                  setTimeout(() => setSubscriptionSuccess(false), 2500);
                }}
                className="w-full py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>প্রো সাবস্ক্রিপশন সক্রিয় করুন (৳৪৯৯/মাস)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS DROPDOWN MODAL */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 bg-slate-950/40 z-50 flex items-start justify-end p-4 pt-16 font-bengali animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#1DB954] rounded-3xl max-w-sm w-full p-4 space-y-3 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1DB954]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  নোটিফিকেশন সেন্টার
                </h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-500 font-bold text-[10px] rounded-full">
                    {notifications.filter(n => !n.read).length} নতুন
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {notifications.filter(n => !n.read).length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1DB954] font-bold px-2 py-0.5 rounded-lg transition"
                  >
                    সব পঠিত ✓
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs max-h-80 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <p className="text-slate-400 text-center py-6">কোনো নোটিফিকেশন নেই</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setIsNotificationsOpen(false);

                      const cat = n.category || 'system';
                      let catLabel = '⚡ বিষয় নোটিশ';
                      let catBadgeClass = 'bg-slate-500/15 text-slate-400 border-slate-500/30';
                      if (cat === 'seller') {
                        catLabel = '💼 বায়ার অর্ডার ও ডেলিভারি';
                        catBadgeClass = 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
                      } else if (cat === 'mentor') {
                        catLabel = '🎓 মেন্টর ও ক্লাসরুম';
                        catBadgeClass = 'bg-teal-500/15 text-teal-500 border-teal-500/30';
                      } else if (cat === 'payout') {
                        catLabel = '💳 ক্যাশআউট ও আর্নিং';
                        catBadgeClass = 'bg-amber-500/15 text-amber-500 border-amber-500/30';
                      }

                      setViewingNotifDetail({
                        id: n.id,
                        type: n.type === 'info' ? 'notification' : n.type,
                        category: cat,
                        categoryLabel: catLabel,
                        categoryBadgeClass: catBadgeClass,
                        senderName: n.senderName || 'PTEN IT System',
                        senderAvatar: n.senderAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
                        title: n.title,
                        text: n.message,
                        time: n.time,
                        read: true,
                        targetTab: n.targetTab,
                        original: n
                      });
                    }}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      n.read
                        ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-[#1DB954]/40 text-slate-900 dark:text-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#1DB954]" />}
                        {n.title}
                      </span>
                      <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">{n.message}</p>
                    <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-slate-200 dark:border-slate-800/80 text-[10px]">
                      <span className="text-[#1DB954] font-bold">বিস্তারিত দেখুন →</span>
                      <span className="text-slate-400 font-normal">{n.read ? 'পঠিত' : 'অপঠিত'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES INBOX MODAL */}
      {isInboxModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 font-bengali animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#1DB954] rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-3 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsInboxModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 pr-8">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1DB954]" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">ইনবক্স ও কাস্টম অর্ডার মেসেঞ্জার</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">সেলার ও বায়ারদের সাথে সরাসরি ইনবক্স চ্যাট</p>
                </div>
              </div>
              {directMessages.filter(m => !m.read).length > 0 && (
                <button
                  onClick={markAllDirectMessagesRead}
                  className="text-[10px] bg-slate-100 dark:bg-slate-800 text-[#1DB954] font-bold px-2 py-1 rounded-lg hover:opacity-80 transition"
                >
                  সব পড়া ✓
                </button>
              )}
            </div>

            {/* Live Direct Messages List */}
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 max-h-60 overflow-y-auto text-xs">
              {directMessages.length === 0 ? (
                <p className="text-slate-400 text-center py-6">কোনো ইনবক্স মেসেজ নেই</p>
              ) : (
                directMessages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      markDirectMessageRead(msg.id);
                      if (openMessengerInbox) {
                        openMessengerInbox(msg.id, 'messages');
                      } else {
                        openChatWindow({
                          id: msg.id,
                          senderName: msg.senderName,
                          senderRole: msg.senderRole,
                          senderAvatar: msg.senderAvatar,
                          initialMessage: msg.text
                        });
                      }
                      setIsInboxModalOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                      msg.read
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-90'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 border-[#1DB954]/50 shadow-sm'
                    }`}
                  >
                    <img
                      src={msg.senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover border border-[#1DB954] shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center font-bold text-[11px] mb-0.5">
                        <span className="text-[#1DB954] truncate">{msg.senderName}</span>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-1">{msg.time}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] line-clamp-2 leading-snug">
                        {msg.text}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[9px]">
                        <span className="text-slate-400 uppercase font-semibold">{msg.senderRole}</span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1 hover:underline">
                          চ্যাট চালু করুন 💬
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Send Message Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!inboxMessageText.trim()) return;
                sendDirectMessage({
                  senderName: currentUser?.name || 'মার্কেটপ্লেস ইউজার',
                  senderRole: currentUser?.role || 'customer',
                  senderAvatar: currentUser?.avatar,
                  recipientRole: viewMode === 'selling' ? 'customer' : 'instructor',
                  text: inboxMessageText.trim()
                });
                setInboxSuccess(true);
                setInboxMessageText('');
                setTimeout(() => setInboxSuccess(false), 2500);
              }}
              className="space-y-2 pt-1"
            >
              <textarea
                rows={2}
                required
                placeholder="ইনবক্স মেসেজ বা প্রজেক্ট আপডেট লিখুন..."
                value={inboxMessageText}
                onChange={(e) => setInboxMessageText(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              />

              {inboxSuccess && (
                <div className="p-2 bg-emerald-500/20 text-[#1DB954] font-bold text-xs rounded-lg text-center border border-[#1DB954]/40">
                  ✓ মেসেজ সফলভাবে ইনবক্সে পাঠানো হয়েছে!
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>মেসেজ পাঠান</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GIG MODAL */}
      {editingGig && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">গিগ তথ্য সম্পাদনা (Edit Gig)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">গিগ টাইটেল, মূল্য ও প্যাকেজ আপডেট করুন</p>
                </div>
              </div>
              <button
                onClick={() => setEditingGig(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">গিগ টাইটেল (Title)</label>
                <input
                  type="text"
                  required
                  value={editGigTitle}
                  onChange={(e) => setEditGigTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ক্যাটাগরি (Category)</label>
                  <select
                    value={editGigCategory}
                    onChange={(e) => setEditGigCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                  >
                    <option value="Programming & Tech">Programming & Tech</option>
                    <option value="Graphics & Design">Graphics & Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Video & Animation">Video & Animation</option>
                    <option value="AI Services">AI Services</option>
                    <option value="SEO & Growth">SEO & Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ডেলিভারি টাইম (Delivery Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={editGigDeliveryDays}
                    onChange={(e) => setEditGigDeliveryDays(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                  />
                </div>
              </div>

              {/* Price Packages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#1DB954] mb-1">বেসিক প্রাইস (৳ Basic)</label>
                  <input
                    type="number"
                    required
                    value={editGigPriceBasic}
                    onChange={(e) => setEditGigPriceBasic(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-500 mb-1">স্ট্যান্ডার্ড (৳ Standard)</label>
                  <input
                    type="number"
                    required
                    value={editGigPriceStandard}
                    onChange={(e) => setEditGigPriceStandard(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-500 mb-1">প্রিমিয়াম (৳ Premium)</label>
                  <input
                    type="number"
                    required
                    value={editGigPricePremium}
                    onChange={(e) => setEditGigPricePremium(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">থাম্বনেইল ইমেজ URL (Thumbnail Image)</label>
                <input
                  type="text"
                  required
                  value={editGigThumbnail}
                  onChange={(e) => setEditGigThumbnail(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">গিগ বিবরণ (Description)</label>
                <textarea
                  rows={3}
                  value={editGigDesc}
                  onChange={(e) => setEditGigDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>

              {editGigSuccess && (
                <div className="p-3 bg-emerald-500/20 text-[#1DB954] font-bold text-xs rounded-xl text-center border border-[#1DB954]/40 animate-pulse">
                  ✓ গিগ সফলভাবে আপডেট করা হয়েছে!
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGig(null)}
                  className="w-1/3 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>পরিবর্তন সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERFORMANCE ANALYTICS MODAL */}
      {performanceGig && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">গিগ পারফরমেন্স অ্যানালিটিক্স</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{performanceGig.title}</p>
                </div>
              </div>
              <button
                onClick={() => setPerformanceGig(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">📈 ইমপ্রেশন</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {((performanceGig.salesCount || 1) * 450 + 320).toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-emerald-500 font-bold block">▲ +18.4% গত ৩০ দিনে</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">👁️ ভিউ (Views)</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {((performanceGig.salesCount || 1) * 120 + 85).toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-emerald-500 font-bold block">▲ +12.1% এই সপ্তাহে</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">📦 সম্পন্ন অর্ডার</span>
                <span className="text-lg font-black text-[#1DB954]">
                  {(performanceGig.salesCount || 12).toLocaleString('bn-BD')}টি
                </span>
                <span className="text-[9px] text-emerald-500 font-bold block">100% On-Time</span>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">💰 মোট উপার্জিত আয়</span>
                <span className="text-lg font-black text-[#1DB954]">
                  ৳{(((performanceGig as any).price || performanceGig.packages?.basic?.price || 2500) * (performanceGig.salesCount || 12)).toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-emerald-500 font-bold block">এস্ক্রো সুরক্ষিত</span>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1DB954]" />
                <span>মেট্রিক্স ও কোয়ালিটি স্কোর (Quality Score)</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[11px] mb-1">
                    <span className="text-slate-600 dark:text-slate-300">ক্লিক-থ্রু রেট (CTR)</span>
                    <span className="text-[#1DB954]">5.8% (Excellent)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1DB954] h-full w-[65%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[11px] mb-1">
                    <span className="text-slate-600 dark:text-slate-300">অর্ডার কনভার্সন রেট (Conversion Rate)</span>
                    <span className="text-blue-500">8.4%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[84%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[11px] mb-1">
                    <span className="text-slate-600 dark:text-slate-300">ক্লায়েন্ট সন্তুষ্টি রেটিং (Satisfaction)</span>
                    <span className="text-amber-500">★ {performanceGig.rating || 5.0} (100% Positive)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[100%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPerformanceGig(null)}
                className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL TOP-LEVEL DELETE CONFIRMATION MODAL */}
      {confirmDeleteGigId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 font-bengali animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-500/60 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setConfirmDeleteGigId(null)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                আপনি কি সত্যিই ডিলেট করবেন?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এই গিগটি পার্মানেন্টলি ডিলেট হয়ে যাবে।
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  const gigToDelete = gigs.find(g => g.id === confirmDeleteGigId);
                  handleDeleteGig(confirmDeleteGigId, gigToDelete?.title || '');
                  setConfirmDeleteGigId(null);
                  setActiveGigMenuId(null);
                }}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-rose-600/30 text-center"
              >
                হ্যাঁ
              </button>
              <button
                onClick={() => setConfirmDeleteGigId(null)}
                className="flex-1 py-2.5 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer text-center"
              >
                না
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SELLER ORDER DELIVERY MODAL */}
      {deliveringOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 font-bengali animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border-2 border-[#1DB954]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setDeliveringOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-[#1DB954] flex items-center justify-center shrink-0">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  ফাইনাল কাজ জমা দিন (Deliver Order)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  অর্ডার ID: #{deliveringOrder.id} • বায়ার: {deliveringOrder.buyerName}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-black text-slate-800 dark:text-slate-200">
                  ডেলিভারি মেসেজ / কাজ সম্পন্ন করার বিবরন <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="বায়ারকে কাজের মূল ফিচারসমূহ এবং ব্যবহারের নির্দেশনা জানান..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-black text-slate-800 dark:text-slate-200">
                  ফাইল / রেপোজিটরি ইউআরএল (GitHub, Google Drive, Zip Link)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/myrepo/release-v1.zip"
                  value={deliveryFileUrl}
                  onChange={(e) => setDeliveryFileUrl(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-black text-slate-800 dark:text-slate-200">
                  ফাইল / প্যাকেজ এর নাম
                </label>
                <input
                  type="text"
                  placeholder="যেমন: project-source-code-v1.0.zip"
                  value={deliveryFileName}
                  onChange={(e) => setDeliveryFileName(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeliveringOrder(null)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  if (!deliveryNote.trim()) return;
                  deliverMarketplaceOrder(deliveringOrder.id, deliveryNote, deliveryFileUrl, deliveryFileName);
                  setDeliveringOrder(null);
                }}
                className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ডেলিভারি সম্পূর্ণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUYER PROFILE & SECURITY UPDATE MODAL */}
      {isBuyerProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setIsBuyerProfileModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#1DB954]/15 text-[#1DB954]">
                <BadgeCheck className="w-4 h-4 text-[#1DB954]" />
                <span>বায়ার প্রোফাইল & সিকিউরিটি সেন্টার</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                প্রোফাইল তথ্য ও পাসওয়ার্ড আপডেট করুন
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার ছবি, নাম, হোয়াটসঅ্যাপ নম্বর, জি-মেইল এবং পাসওয়ার্ড নিচে পরিবর্তন করুন।
              </p>
            </div>

            {/* Success Banner */}
            {buyerProfileSuccessMsg && (
              <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-[#1DB954] text-xs font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 shrink-0 text-[#1DB954]" />
                <span>{buyerProfileSuccessMsg}</span>
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleSaveBuyerProfile} className="space-y-4">
              
              {/* 1. Photo Avatar Section */}
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>প্রোফাইল ছবি (Photo Avatar)</span>
                  <span className="text-[10px] text-[#1DB954]">লাইভ প্রিভিউ</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={buyerEditAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt="Profile Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#1DB954] shadow-md"
                    />
                    <span className="w-4 h-4 rounded-full bg-[#1DB954] border-2 border-white dark:border-slate-900 absolute bottom-0 right-0"></span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={buyerEditAvatar}
                      onChange={(e) => setBuyerEditAvatar(e.target.value)}
                      placeholder="ছবি বা ইমেজের ডিরেক্ট লিঙ্ক (URL) দিন..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                    <p className="text-[10px] text-slate-400">নিচে থেকে ১-ক্লিকে নমুনা ছবি নির্বাচন করুন:</p>
                    <div className="flex items-center gap-1.5">
                      {PRESET_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBuyerEditAvatar(av)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                            buyerEditAvatar === av ? 'border-[#1DB954] scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={av} alt="Avatar Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>আপনার নাম (Full Name)</span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerEditName}
                  onChange={(e) => setBuyerEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* 3. WhatsApp Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                    <span>হোয়াটসঅ্যাপ নম্বর (WhatsApp Number)</span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    WhatsApp Active
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={buyerEditWhatsapp}
                  onChange={(e) => setBuyerEditWhatsapp(e.target.value)}
                  placeholder="+8801700000000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* 4. Gmail / Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                  <span>জি-মেইল / ইমেইল ঠিকানা (Gmail Address)</span>
                </label>
                <input
                  type="email"
                  required
                  value={buyerEditEmail}
                  onChange={(e) => setBuyerEditEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* 5. Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>নতুন পাসওয়ার্ড (Change Password)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">গোপন রাখুন</span>
                </label>
                <div className="relative">
                  <input
                    type={showBuyerPassword ? "text" : "password"}
                    required
                    value={buyerEditPassword}
                    onChange={(e) => setBuyerEditPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড দিন..."
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBuyerPassword(!showBuyerPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBuyerProfileModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>পাসওয়ার্ড ও তথ্য সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PUBLIC PROJECT POST MODAL */}
      {isPostProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto relative">
            <button
              type="button"
              onClick={() => setIsPostProjectModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center shrink-0">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  পাবলিক প্রজেক্ট পোস্ট করুন
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  মার্কেটপ্লেসে নতুন প্রজেক্টের অফার জমা দিন
                </p>
              </div>
            </div>

            {postSubmittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  প্রজেক্ট সফলভাবে পাবলিক করা হয়েছে!
                </h4>
                <p className="text-xs text-slate-500">
                  আপনার প্রজেক্টটি এখন ফ্রিল্যান্সার জব ফিডে দৃশ্যমান।
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostProjectSubmit} className="space-y-4">
                {/* TITLE */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    প্রজেক্টের মূল শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="যেমন: ই-কমার্স ওয়েবসাইটের জন্য রেসপন্সিভ রিঅ্যাক্ট ফ্রন্টএন্ড ডেভলপমেন্ট"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                {/* CATEGORY & BUDGET */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                      ক্যাটাগরি *
                    </label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    >
                      <option value="Web Development">ওয়েব ডেভেলপমেন্ট</option>
                      <option value="Graphic Design">গ্রাফিক ডিজাইন</option>
                      <option value="Digital Marketing">ডিজিটাল মার্কেটিং</option>
                      <option value="App Development">অ্যাপ ডেভেলপমেন্ট</option>
                      <option value="Video Editing">ভিডিও এডিটিং</option>
                      <option value="Content Writing">কন্টেন্ট রাইটিং</option>
                      <option value="UI/UX Design">ইউআই/ইউএক্স ডিজাইন</option>
                      <option value="Cyber Security">সাইবার সিকিউরিটি</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                      বাজেট রেঞ্জ (টাকায়) *
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        placeholder="মিনিমাম"
                        className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                      <span className="text-xs font-bold text-slate-400">-</span>
                      <input
                        type="number"
                        required
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        placeholder="ম্যাক্সিমাম"
                        className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  </div>
                </div>

                {/* POSTING OPTION SELECTOR */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">
                    প্রজেক্ট পোস্ট করার ধরন নির্বাচন করুন *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* OPTION 1: WORK FIRST */}
                    <button
                      type="button"
                      onClick={() => setPostOfferType("work_first")}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                        postOfferType === "work_first"
                          ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                          আগে কাজ শুরু (বিনা অগ্রিম বিল)
                        </span>
                        {postOfferType === "work_first" && (
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-medium leading-tight opacity-90">
                        কাজ শেষ হলে পছন্দ অনুযায়ী পেমেন্ট করুন। (প্রতিষ্ঠানের সাবস্ক্রিপশন প্রয়োজন)
                      </p>
                    </button>

                    {/* OPTION 2: PAID */}
                    <button
                      type="button"
                      onClick={() => setPostOfferType("paid")}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                        postOfferType === "paid"
                          ? "border-[#1DB954] bg-[#1DB954]/10 text-slate-900 dark:text-emerald-300 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-[#1DB954] shrink-0" />
                          অগ্রিম বিল পরিশোধ (পেইড প্রজেক্ট)
                        </span>
                        {postOfferType === "paid" && (
                          <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] font-medium leading-tight opacity-90">
                        বাজেটের বিল পিটেন পেমেন্ট গেটওয়েতে জমা দিয়ে প্রজেক্ট পাবলিক করুন।
                      </p>
                    </button>
                  </div>
                </div>

                {/* SUBSCRIPTION NOTICE */}
                {postOfferType === "work_first" && (
                  <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    isSubscribed
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                      : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300"
                  }`}>
                    <div className="flex items-center gap-1.5 font-black">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>{isSubscribed ? "সাবস্ক্রিপশন সক্রিয় রয়েছে" : "সাবস্ক্রিপশন নীতি সতর্কতা"}</span>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed">
                      {isSubscribed
                        ? "আপনার প্রতিষ্ঠানের সক্রিয় সাবস্ক্রিপশন প্ল্যান থাকায় আপনি সরাসরি বিনামূল্যে 'আগে কাজ শুরু' ফিচারে প্রজেক্ট প্রকাশ করতে পারছেন।"
                        : "বিনামূল্যে 'আগে কাজ শুরু' ফিচারে প্রজেক্ট পোস্ট করতে সাবস্ক্রিপশন কিনতে হবে। অন্যথায় প্রজেক্ট সাবমিট করার পর বাজেটের বিল পরিশোধ করতে হবে।"}
                    </p>
                  </div>
                )}

                {/* DESCRIPTION */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    কাজ ও প্রয়োজনীয় বিবরণের বিস্তার *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="আপনার কাজের সম্পূর্ণ বিবরণ, রিকোয়ারমেন্টস ও অন্যান্য তথ্যাদি বিস্তারিত লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                {/* ATTACHMENT OPTIONAL */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    ফাইলের নাম / স্যাম্পল ফাইল লিংক (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={postAttachmentName}
                    onChange={(e) => {
                      setPostAttachmentName(e.target.value);
                      setPostAttachmentUrl(e.target.value ? `https://drive.google.com/file/${e.target.value}` : "");
                    }}
                    placeholder="যেমন: project_specifications.pdf বা গুগল ড্রাইভ লিংক"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPostProjectModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition cursor-pointer"
                  >
                    বাতিল করুন
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4 text-slate-950" />
                    <span>
                      {postOfferType === "work_first" && !isSubscribed
                        ? "পরবর্তী ধাপ (পেমেন্ট/সাবস্ক্রিপশন)"
                        : "প্রজেক্ট পোস্ট করুন"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PTENIT PAYMENT GATEWAY STEP MODAL */}
      {isPaymentStepOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-5 space-y-4 relative">
            <button
              type="button"
              onClick={() => setIsPaymentStepOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  পিটেন পেমেন্ট গেটওয়ে
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {postOfferType === "work_first" ? "আগে কাজ শুরু প্ল্যান বা বিল পেমেন্ট" : "প্রজেক্টের অগ্রিম বিল পরিশোধ"}
                </p>
              </div>
            </div>

            {/* NOTICE BASED ON POST OFFER TYPE */}
            {postOfferType === "work_first" ? (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-black">
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>আগে কাজ শুরু সুবিধা নোটিশ</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-[11px]">
                  বিনা অগ্রিম বিলে "আগে কাজ শুরু" ফিচারে প্রজেক্ট পাবলিক করতে আপনার প্রতিষ্ঠানের একটি সক্রিয় সাবস্ক্রিপশন প্ল্যান লাগবে। অথবা নিচে প্রজেক্টের নির্ধারিত বাজেটের বিল পরিশোধ করে পেইড প্রজেক্ট হিসেবে প্রকাশ করতে পারবেন।
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>অগ্রিম বিল পেমেন্ট নোটিশ</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-[11px]">
                  প্রজেক্টটি পেইড হিসেবে পাবলিক জব ফিডে প্রকাশ করতে নিচে পিটেন (PiTen) পেমেন্ট গেটওয়ের মাধ্যমে নির্ধারিত বাজেটের বিল পরিশোধ সম্পন্ন করুন।
                </p>
              </div>
            )}

            {/* PROJECT SUMMARY */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">প্রজেক্ট শিরোনাম</span>
              <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                {postTitle || "নতুন পাবলিক প্রজেক্ট"}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-bold">নির্ধারিত বাজেট:</span>
                <span className="font-mono font-black text-[#1DB954]">৳{minBudget} - ৳{maxBudget}</span>
              </div>
            </div>

            {/* PAYMENT METHODS */}
            <div className="space-y-2 text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 font-black block">পেমেন্ট মেথড নির্বাচন করুন:</span>
              <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 flex items-center justify-between">
                <span className="text-pink-700 dark:text-pink-300 font-black">বিকাশ (bKash Gateway)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">01712-345678</span>
              </div>
              <div className="p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 flex items-center justify-between">
                <span className="text-orange-700 dark:text-orange-300 font-black">নগদ (Nagad Direct)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">01812-345678</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-2 pt-1">
              {/* BUTTON 1: PAY PROJECT BUDGET */}
              <button
                type="button"
                onClick={() => publishProjectNow("paid")}
                className="w-full py-3 px-4 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>বাজেটের বিল পরিশোধ সম্পন্ন করে পেইড প্রজেক্ট পোস্ট করুন</span>
              </button>

              {/* BUTTON 2: ACTIVATE SUBSCRIPTION FOR WORK FIRST */}
              <button
                type="button"
                onClick={() => {
                  setIsSubscribed(true);
                  publishProjectNow("work_first");
                }}
                className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>প্রতিষ্ঠানের সাবস্ক্রিপশন প্ল্যান সক্রিয় করুন (আগে কাজ শুরু সুবিধা)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PUBLIC PROJECT MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-indigo-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    প্রজেক্ট পোস্ট এডিট করুন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    (যেহেতু পোস্টটি 'অপেক্ষা...' অবস্থায় আছে)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্টের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Graphics & Design">Graphics & Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Apps Development">Apps Development</option>
                    <option value="AI & Automation">AI & Automation</option>
                    <option value="Content Writing">Content Writing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    বাজেট পরিমাণ (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্ট বিবরণ *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>পরিবর্তন সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RAISE BUDGET MODAL */}
      {raisingBudgetOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-[#1DB954] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    বাজেট বৃদ্ধি করুন (বাজেট আপ)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    উচ্চ বাজেট এক্সপার্টদের দ্রুত কাজ নিতে উৎসাহিত করে
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRaisingBudgetOrder(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRaiseBudget} className="p-4 sm:p-6 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">বর্তমান বাজেট:</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  ৳{(raisingBudgetOrder.amount || 0).toLocaleString('bn-BD')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  নতুন বাজেট পরিমাণ (৳) *
                </label>
                <input
                  type="number"
                  required
                  min={(raisingBudgetOrder.amount || 0) + 500}
                  step={500}
                  value={newBudgetAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNewBudgetAmount(val);
                    setNewBudgetRange(`৳${val.toLocaleString('bn-BD')} - ৳${(val + 15000).toLocaleString('bn-BD')}`);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-black text-emerald-600 dark:text-[#1DB954] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {[3000, 5000, 10000, 15000].map(addVal => {
                  const total = (raisingBudgetOrder.amount || 15000) + addVal;
                  return (
                    <button
                      type="button"
                      key={addVal}
                      onClick={() => {
                        setNewBudgetAmount(total);
                        setNewBudgetRange(`৳${total.toLocaleString('bn-BD')} - ৳${(total + 15000).toLocaleString('bn-BD')}`);
                      }}
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-lg transition cursor-pointer border border-emerald-500/20"
                    >
                      +৳{addVal.toLocaleString('bn-BD')}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRaisingBudgetOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>বাজেট বৃদ্ধি নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE POST CONFIRMATION MODAL */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                প্রজেক্ট পোস্টটি ডিলিট করতে চান?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                "{deletingOrder.title}" পোস্টটি সম্পূর্ণ মুছে যাবে।
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOrder}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASHOUT REQUEST POP-UP MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">💳 ক্যাশআউট রিকোয়েস্ট</h3>
                  <p className="text-xs text-slate-400">ইনস্ট্যান্ট পেআউট সার্ভিস</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Balance Status Card */}
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-0.5">ক্যাশআউটযোগ্য ব্যালেন্স</span>
                <span className="text-2xl font-black text-[#1DB954]">
                  ৳{availableBalance.toLocaleString('bn-BD')}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-[11px] font-black">
                {availableBalance > 0 ? 'ইনস্ট্যান্ট প্রসেসিং' : 'ব্যালেন্স ০.০০'}
              </div>
            </div>

            {/* Zero Balance Condition */}
            {availableBalance <= 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-400">ক্যাশআউট করার মতো ব্যালেন্স নেই</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    বর্তমানে আপনার অ্যাকাউন্টে কোনো ক্যাশআউটযোগ্য অবশিষ্ট ব্যালেন্স নেই। আপনার সার্ভিস বা কোর্স বিক্রি সম্পন্ন হলে অর্জিত ফান্ড এখানে জমা হবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition cursor-pointer"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : withdrawSuccess ? (
              /* Success State */
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-400">রিকোয়েস্ট সফল হয়েছে!</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    আপনার ৳{withdrawAmount.toLocaleString('bn-BD')} ক্যাশআউট রিকোয়েস্ট গ্রহণ করা হয়েছে। ১-২৪ ঘণ্টার মধ্যে {withdrawMethod.toUpperCase()} ({withdrawAccount})-এ টাকা পাঠিয়ে দেওয়া হবে।
                  </p>
                </div>
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1DB954] text-slate-950 font-black text-xs hover:bg-emerald-400 transition cursor-pointer shadow-lg"
                >
                  বন্ধ করুন
                </button>
              </div>
            ) : (
              /* Form State */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    পেমেন্ট মেথড সিলেক্ট করুন
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'bKash', name: 'বিকাশ', color: 'border-pink-500/50 bg-pink-500/10 text-pink-400' },
                      { id: 'Nagad', name: 'নগদ', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
                      { id: 'Bank', name: 'ব্যাংক', color: 'border-sky-500/50 bg-sky-500/10 text-sky-400' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWithdrawMethod(m.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-black transition cursor-pointer text-center ${
                          withdrawMethod === m.id
                            ? `${m.color} ring-2 ring-[#1DB954]`
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    অ্যাকাউন্ট / মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    placeholder="যেমন: 017xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                    উইথড্রয়াল অ্যামাউন্ট (৳)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    placeholder="সর্বনিম্ন ৳৫০০"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#1DB954] font-black focus:outline-none focus:border-[#1DB954]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    * সর্বনিম্ন ক্যাশআউট ৳৫০০। সর্বোচ্চ ক্যাশআউটযোগ্য: ৳{availableBalance.toLocaleString('bn-BD')}
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const numAmt = Number(withdrawAmount);
                      if (!numAmt || numAmt < 500) {
                        alert('সর্বনিম্ন ক্যাশআউট অ্যামাউন্ট ৳৫০০ হতে হবে!');
                        return;
                      }
                      if (availableBalance > 0 && numAmt > availableBalance) {
                        alert(`আপনার ক্যাশআউটযোগ্য ব্যালেন্স ৳${availableBalance.toLocaleString('bn-BD')} এর বেশি দেওয়া সম্ভব নয়!`);
                        return;
                      }
                      const newId = `pay-${Math.floor(100 + Math.random() * 900)}`;
                      const nowTime = new Date().toLocaleString('bn-BD');

                      requestTeacherPayout({
                        teacherId: currentUser?.id || 'usr-1',
                        teacherName: currentUser?.name || 'MD S Kazi Sohag',
                        teacherEmail: currentUser?.email || 'sohag@ptenit.com',
                        amount: numAmt,
                        paymentMethod: withdrawMethod,
                        accountNumber: withdrawAccount,
                        note: `অনলাইন উইথড্রয়াল রিকোয়েস্ট (${withdrawMethod})`
                      });

                      setActivePendingPayout({
                        id: newId,
                        amount: numAmt,
                        paymentMethod: withdrawMethod,
                        accountNumber: withdrawAccount,
                        requestedAt: nowTime,
                        status: 'Pending'
                      });
                      setWithdrawSuccess(true);
                      setAvailableBalance(prev => Math.max(0, prev - numAmt));
                      setPayoutSubTab('history');
                    }}
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#1DB954] to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 transition cursor-pointer shadow-lg shadow-[#1DB954]/20"
                  >
                    রিকোয়েস্ট কনফার্ম করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT PENDING CASHOUT APPLICATION MODAL */}
      {isEditPendingModalOpen && activePendingPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">ক্যাশআউট আবেদন এডিট</h3>
                  <p className="text-xs text-slate-400">আইডি: {activePendingPayout.id} (এডমিন রিভিউ পেন্ডিং)</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditPendingModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  পেমেন্ট মেথড সিলেক্ট করুন
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bKash', name: 'বিকাশ', color: 'border-pink-500/50 bg-pink-500/10 text-pink-400' },
                    { id: 'Nagad', name: 'নগদ', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
                    { id: 'Bank', name: 'ব্যাংক', color: 'border-sky-500/50 bg-sky-500/10 text-sky-400' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setEditPendingMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-black transition cursor-pointer text-center ${
                        editPendingMethod === m.id
                          ? `${m.color} ring-2 ring-[#1DB954]`
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  অ্যাকাউন্ট / মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  value={editPendingAccount}
                  onChange={(e) => setEditPendingAccount(e.target.value)}
                  placeholder="যেমন: 017xxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1.5">
                  অনুরোধকৃত পরিমাণ (৳)
                </label>
                <input
                  type="number"
                  value={editPendingAmount}
                  onChange={(e) => setEditPendingAmount(Number(e.target.value))}
                  placeholder="সর্বনিম্ন ৳৫০০"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-[#1DB954] font-black focus:outline-none focus:border-[#1DB954]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  * উপলব্ধ ক্যাশআউটযোগ্য ব্যালেন্স: ৳{availableBalance.toLocaleString('bn-BD')}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditPendingModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const numAmt = Number(editPendingAmount);
                    if (!numAmt || numAmt < 500) {
                      alert('সর্বনিম্ন ক্যাশআউট পরিমাণ ৳৫০০ হতে হবে!');
                      return;
                    }
                    const diff = numAmt - activePendingPayout.amount;
                    if (diff > availableBalance) {
                      alert(`আপনার ক্যাশআউটযোগ্য ব্যালেন্স ৳${availableBalance.toLocaleString('bn-BD')} এর বেশি বাড়ানো সম্ভব নয়!`);
                      return;
                    }

                    setAvailableBalance(prev => prev - diff);
                    setActivePendingPayout(prev => prev ? {
                      ...prev,
                      amount: numAmt,
                      paymentMethod: editPendingMethod,
                      accountNumber: editPendingAccount,
                    } : null);

                    setIsEditPendingModalOpen(false);
                    alert('আপনার ক্যাশআউট আবেদনটি সফলভাবে আপডেট করা হয়েছে!');
                  }}
                  className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#1DB954] to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 transition cursor-pointer shadow-lg shadow-[#1DB954]/20"
                >
                  সংশোধন আপডেট করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING ACTION/SUCCESS TOAST (নিচে শুধু শর্ট সাকসেস/অ্যাকশন নোটিফিকেশন) */}
      {/* ========================================================================= */}
      {switchSuccessMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp font-bengali max-w-[95vw] sm:max-w-md">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-950/95 backdrop-blur-xl border border-[#1DB954]/60 text-white shadow-2xl shadow-black/90 rounded-2xl text-xs sm:text-sm font-black ring-1 ring-white/10">
            <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0 animate-pulse" />
            <span className="truncate flex-1">{switchSuccessMsg}</span>
            <button
              type="button"
              onClick={() => setSwitchSuccessMsg('')}
              className="ml-1.5 p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition cursor-pointer text-xs"
              title="বন্ধ করুন"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CENTRAL UNIFIED NOTIFICATION & MESSAGE HUB MODAL (সেন্ট্রাল নোটিফিকেশন হাব) */}
      {/* ========================================================================= */}
      {isCentralNotificationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      সেন্ট্রাল নোটিফিকেশন হাব
                    </h3>
                    {totalUnreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-xs">
                        {totalUnreadCount} টি অপঠিত
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    সেলার, মেন্টর ও সিস্টেম কাজের সকল লাইভ আপডেট (মেসেজ ইনবক্সে)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  title="সকল নোটিফিকেশন পড়া হিসেবে চিহ্নিত করুন"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span className="hidden sm:inline">সবগুলো পড়া হয়েছে</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCentralNotificationOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="space-y-2.5 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {[
                  { id: 'all', label: `সকল আপডেট (${notifications.length})`, icon: Bell },
                  { id: 'orders', label: `💼 অর্ডার ও ডেলিভারি (${notifications.filter(n => n.category === 'seller' || n.category === 'system').length})`, icon: Briefcase },
                  { id: 'mentor', label: `🎓 মেন্টর ও কোর্স (${notifications.filter(n => n.category === 'mentor').length})`, icon: GraduationCap },
                  { id: 'payouts', label: `💳 পেমেন্ট ও ক্যাশআউট (${notifications.filter(n => n.category === 'payout').length})`, icon: Wallet }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCentralNotifFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer border ${
                      centralNotifFilter === tab.id
                        ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={centralNotifSearch}
                  onChange={(e) => setCentralNotifSearch(e.target.value)}
                  placeholder="নোটিফিকেশন খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar min-h-[260px]">
              {(() => {
                // Notifications Feed (Exclusive of direct chat messages)
                const feedItems = notifications.map(notif => {
                  const cat = notif.category || 'system';
                  let catLabel = '⚡ সিস্টেম নোটিশ';
                  let catBadgeClass = 'bg-slate-500/15 text-slate-400 border-slate-500/30';
                  if (cat === 'seller') {
                    catLabel = '💼 বায়ার অর্ডার ও ডেলিভারি';
                    catBadgeClass = 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
                  } else if (cat === 'mentor') {
                    catLabel = '🎓 মেন্টর ও ক্লাসরুম';
                    catBadgeClass = 'bg-teal-500/15 text-teal-500 border-teal-500/30';
                  } else if (cat === 'payout') {
                    catLabel = '💳 ক্যাশআউট ও আর্নিং';
                    catBadgeClass = 'bg-amber-500/15 text-amber-500 border-amber-500/30';
                  }
                  return {
                    id: notif.id,
                    type: 'notification' as const,
                    category: cat,
                    categoryLabel: catLabel,
                    categoryBadgeClass: catBadgeClass,
                    senderName: notif.senderName || 'PTEN IT System',
                    senderAvatar: notif.senderAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
                    title: notif.title,
                    text: notif.message,
                    time: notif.time,
                    read: notif.read,
                    targetTab: notif.targetTab,
                    original: notif
                  };
                });

                // Filter by Tab
                let filtered = feedItems;
                if (centralNotifFilter === 'orders') {
                  filtered = feedItems.filter(item => item.category === 'seller' || item.category === 'system');
                } else if (centralNotifFilter === 'mentor') {
                  filtered = feedItems.filter(item => item.category === 'mentor');
                } else if (centralNotifFilter === 'payouts') {
                  filtered = feedItems.filter(item => item.category === 'payout');
                }

                // Filter by Search Query
                if (centralNotifSearch.trim()) {
                  const q = centralNotifSearch.toLowerCase();
                  filtered = filtered.filter(item => 
                    item.title.toLowerCase().includes(q) || 
                    item.text.toLowerCase().includes(q) ||
                    item.senderName.toLowerCase().includes(q)
                  );
                }

                // Sort: Items that were unread at the time of opening the modal stay at top (order frozen while reading)
                filtered = [...filtered].sort((a, b) => {
                  const aWasUnread = openedUnreadNotifIdsRef.current.has(a.id);
                  const bWasUnread = openedUnreadNotifIdsRef.current.has(b.id);
                  if (aWasUnread !== bWasUnread) {
                    return aWasUnread ? -1 : 1;
                  }
                  return new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime();
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Bell className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-400">এই ক্যাটাগরিতে বর্তমানে কোনো নোটিফিকেশন নেই।</p>
                    </div>
                  );
                }

                return filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.read) {
                        markNotificationRead(item.id);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${
                      !item.read
                        ? 'bg-[#1DB954]/10 dark:bg-[#1DB954]/15 border-[#1DB954]/60 shadow-sm ring-1 ring-[#1DB954]/20'
                        : 'bg-slate-100/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-60 hover:opacity-100 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={item.senderAvatar}
                          alt={item.senderName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                        />
                        {!item.read ? (
                          <span className="w-3 h-3 rounded-full bg-[#1DB954] absolute -top-1 -right-1 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600 absolute -bottom-1 -right-1 ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.categoryBadgeClass}`}>
                            {item.categoryLabel}
                          </span>
                          {!item.read ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40">
                              ⚡ অপঠিত
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              ✓ পঠিত
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {getTimeAgoBengali(item.time)}
                          </span>
                        </div>

                        <h4 className={`text-xs font-black ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                          {item.title}
                        </h4>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${!item.read ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {item.text}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: 2 Distinct Buttons "পড়ুন" and "দেখুন" */}
                    <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      {/* 1. 'পড়ুন' (Read Button) - Marks item as read without closing modal */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.type === 'message') {
                            markDirectMessageRead(item.id);
                          } else {
                            markNotificationRead(item.id);
                          }
                        }}
                        className={`px-3 py-1.5 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                          !item.read
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700'
                            : 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 border border-slate-200 dark:border-slate-800/80'
                        }`}
                        title="পড়া হিসেবে চিহ্নিত করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{item.read ? 'পড়া শেষ' : 'পড়ুন'}</span>
                      </button>

                      {/* 2. 'দেখুন' (View Button) - Opens full subject detail modal */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.type === 'message') {
                            markDirectMessageRead(item.id);
                          } else {
                            markNotificationRead(item.id);
                          }
                          setViewingNotifDetail(item);
                        }}
                        className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                        title="উক্ত বিষয়ের বিস্তারিত দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>দেখুন</span>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Footer with Quick Simulation / Real-time Test Helper */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="text-[11px] text-slate-400">
                🔔 রিয়েল-টাইম সেন্ট্রাল নোটিফিকেশন ইঞ্জিন সক্রিয়
              </span>
              <button
                type="button"
                onClick={() => {
                  sendCentralNotification({
                    title: '⚡ নতুন ক্লায়েন্ট ইনকোয়ারি ও লাইভ অফার',
                    message: 'মার্কেটপ্লেসে আপনার স্কিল অনুযায়ী একটি নতুন কাস্টম প্রজেক্ট রিকোয়েস্ট এসেছে।',
                    type: 'info',
                    category: 'seller',
                    senderName: 'সিস্টেম অ্যালার্ট'
                  });
                }}
                className="text-[11px] text-[#1DB954] hover:underline font-bold cursor-pointer"
              >
                + টেস্ট নোটিফিকেশন যুক্ত করুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.5. DEDICATED MESSENGER / INBOX MODAL (ক্লায়েন্ট মেসেঞ্জার ও চ্যাট হাব) */}
      {/* ========================================================================= */}
      {isInboxModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#1DB954]/15 text-[#1DB954] border border-[#1DB954]/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      💬 ক্লায়েন্ট মেসেঞ্জার ও চ্যাট ইনবক্স
                    </h3>
                    {directMessages.filter(m => !m.read).length > 0 && (
                      <span className="px-2 py-0.5 bg-[#1DB954] text-slate-950 text-[10px] font-black rounded-full shadow-xs">
                        {directMessages.filter(m => !m.read).length} টি নতুন মেসেজ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    মার্কেটপ্লেস ও মেন্টরশিপ ক্লায়েন্টদের সাথে সরাসরি মেসেজ ও লাইভ মিটিং
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    directMessages.forEach(m => markDirectMessageRead(m.id));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  title="সকল মেসেজ পড়া হিসেবে চিহ্নিত করুন"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span className="hidden sm:inline">সবগুলো পড়া হয়েছে</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsInboxModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Filter / Search */}
            <div className="relative shrink-0">
              <input
                type="text"
                placeholder="ক্লায়েন্টের নাম বা মেসেজের বিষয় খুঁজুন..."
                value={centralNotifSearch}
                onChange={(e) => setCentralNotifSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
              />
              {centralNotifSearch && (
                <button
                  onClick={() => setCentralNotifSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Message List */}
            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {(() => {
                let filtered = directMessages;
                if (centralNotifSearch.trim()) {
                  const q = centralNotifSearch.toLowerCase();
                  filtered = filtered.filter(m => 
                    m.senderName.toLowerCase().includes(q) || 
                    m.text.toLowerCase().includes(q)
                  );
                }

                // Sort: Messages that were unread at the time of opening the modal stay at top (order frozen while reading)
                filtered = [...filtered].sort((a, b) => {
                  const aWasUnread = openedUnreadMsgIdsRef.current.has(a.id);
                  const bWasUnread = openedUnreadMsgIdsRef.current.has(b.id);
                  if (aWasUnread !== bWasUnread) {
                    return aWasUnread ? -1 : 1;
                  }
                  return new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime();
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Mail className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-slate-400">বর্তমানে কোনো মেসেজ পাওয়া যায়নি।</p>
                    </div>
                  );
                }

                return filtered.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      if (!msg.read) {
                        markDirectMessageRead(msg.id);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${
                      !msg.read
                        ? 'bg-[#1DB954]/10 dark:bg-[#1DB954]/15 border-[#1DB954]/60 shadow-sm ring-1 ring-[#1DB954]/20'
                        : 'bg-slate-100/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-60 hover:opacity-100 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={msg.senderName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                        />
                        {!msg.read ? (
                          <span className="w-3 h-3 rounded-full bg-[#1DB954] absolute -top-1 -right-1 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600 absolute -bottom-1 -right-1 ring-2 ring-white dark:ring-slate-900" />
                        )}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-black ${!msg.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-500 border border-blue-500/30">
                            {msg.senderRole || 'Client'}
                          </span>
                          {!msg.read ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40">
                              💬 নতুন মেসেজ
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              ✓ পঠিত
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {getTimeAgoBengali(msg.time)}
                          </span>
                        </div>

                        <p className={`text-xs line-clamp-2 leading-relaxed ${!msg.read ? 'text-slate-700 dark:text-slate-200 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                          {msg.text}
                        </p>
                      </div>
                    </div>

                    {/* Action Controls: 2 Buttons "পড়ুন" and "দেখুন" */}
                    <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      {/* 1. পড়ুন Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markDirectMessageRead(msg.id);
                        }}
                        className={`px-3 py-1.5 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                          !msg.read
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700'
                            : 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 border border-slate-200 dark:border-slate-800/80'
                        }`}
                        title="পড়া হিসেবে চিহ্নিত করুন"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{msg.read ? 'পড়া শেষ' : 'পড়ুন'}</span>
                      </button>

                      {/* 2. দেখুন Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markDirectMessageRead(msg.id);
                          setIsInboxModalOpen(false);
                          if (openMessengerInbox) {
                            openMessengerInbox(msg.id, 'messages');
                          } else {
                            openChatWindow({
                              senderName: msg.senderName,
                              senderRole: msg.senderRole || 'Client',
                              senderAvatar: msg.senderAvatar,
                              initialMessage: msg.text
                            });
                          }
                        }}
                        className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                        title="ফুল চ্যাট ও মেসেজ দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>দেখুন</span>
                      </button>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Footer with Quick Messenger Launcher */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span className="text-[11px] text-slate-400">
                💬 ইনস্ট্যান্ট ক্লায়েন্ট কানেক্ট ও মেসেঞ্জার সক্রিয়
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsInboxModalOpen(false);
                  if (openMessengerInbox) {
                    openMessengerInbox(undefined, 'messages');
                  } else {
                    openChatWindow({
                      senderName: 'হাসান মাহমুদ (নতুন ক্লায়েন্ট)',
                      senderRole: 'Buyer & Project Manager',
                      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                      initialMessage: 'আসসালামু আলাইকুম, আপনার সার্ভিস প্যাকেজটি নিয়ে কিছু প্রশ্ন ছিল।'
                    });
                  }
                }}
                className="text-[11px] text-[#1DB954] hover:underline font-bold cursor-pointer"
              >
                + নতুন চ্যাট উইন্ডো খুলুন
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.8. NOTIFICATION / SUBJECT DETAILED CONTENT VIEW MODAL (উক্ত বিষয় বিস্তারিত ভিউ) */}
      {/* ========================================================================= */}
      {viewingNotifDetail && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={viewingNotifDetail.senderAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80'}
                  alt={viewingNotifDetail.senderName}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-300 dark:border-slate-700 shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {viewingNotifDetail.senderName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${viewingNotifDetail.categoryBadgeClass || 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                      {viewingNotifDetail.categoryLabel || '⚡ বিষয় নোটিশ'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" /> {getTimeAgoBengali(viewingNotifDetail.time)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingNotifDetail(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subject / Title Box */}
            <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#1DB954] uppercase tracking-wider flex items-center gap-1">
                  📌 বিষয় / আপডেট বিষয়বস্তু:
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  ✓ পঠিত
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                {viewingNotifDetail.title || viewingNotifDetail.senderName}
              </h3>
            </div>

            {/* Full Body Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400">
                📝 উক্ত বিষয়ের সম্পূর্ণ বিবরণ:
              </label>
              <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line min-h-[100px] shadow-inner">
                {viewingNotifDetail.text || 'উক্ত বিষয়ে অতিরিক্ত বিবরণ তথ্য সংযুক্ত রয়েছে।'}
              </div>
            </div>

            {/* Quick Interactive Reply for Direct Messages */}
            {(viewingNotifDetail.type === 'message' || viewingNotifDetail.category === 'messages') && (
              <div className="p-3 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                  💬 সরাসরি চ্যাটে মেসেজ পাঠান:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inboxMessageText}
                    onChange={(e) => setInboxMessageText(e.target.value)}
                    placeholder="এখানে আপনার রেসপন্স লিখুন..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (inboxMessageText.trim()) {
                        sendDirectMessage(viewingNotifDetail.senderName, inboxMessageText);
                        setInboxMessageText('');
                      }
                      setViewingNotifDetail(null);
                      setIsCentralNotificationOpen(false);
                      setIsInboxModalOpen(false);
                      if (openMessengerInbox) {
                        openMessengerInbox(undefined, 'messages');
                      } else {
                        openChatWindow({
                          senderName: viewingNotifDetail.senderName,
                          senderRole: viewingNotifDetail.senderRole || 'Client',
                          senderAvatar: viewingNotifDetail.senderAvatar,
                          initialMessage: viewingNotifDetail.text
                        });
                      }
                    }}
                    className="px-3.5 py-2 bg-[#1DB954] text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#19a34a] transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> <span>পাঠাও</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setViewingNotifDetail(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                বন্ধ করুন
              </button>

              <button
                type="button"
                onClick={() => {
                  const targetTab = viewingNotifDetail.targetTab || viewingNotifDetail.original?.targetTab;
                  const notifTitle = (viewingNotifDetail.title || '').toLowerCase();
                  const notifText = (viewingNotifDetail.text || viewingNotifDetail.message || '').toLowerCase();
                  const senderName = viewingNotifDetail.senderName || viewingNotifDetail.original?.senderName || '';

                  setViewingNotifDetail(null);
                  setIsCentralNotificationOpen(false);
                  setIsInboxModalOpen(false);
                  setIsNotificationsOpen(false);

                  // 1. Direct Message / Chat inquiry
                  if (
                    viewingNotifDetail.type === 'message' ||
                    viewingNotifDetail.category === 'messages' ||
                    viewingNotifDetail.category === 'message' ||
                    (senderName && (senderName.includes('সোহাগ') || senderName.includes('তানজিম') || senderName.includes('রাশেদুল') || senderName.includes('বায়ার') || senderName.includes('সেবাগ্রহীতা')))
                  ) {
                    if (openMessengerInbox) {
                      openMessengerInbox(undefined, 'messages');
                    } else {
                      openChatWindow({
                        senderName: senderName || 'Client',
                        senderRole: viewingNotifDetail.senderRole || 'Client',
                        senderAvatar: viewingNotifDetail.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                        initialMessage: viewingNotifDetail.text || 'হ্যালো! আপনার কাজের আপডেট সংক্রান্ত বিষয়ে কথা বলতে চাই।'
                      });
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  // 2. Course / Classroom / Live Module
                  if (
                    targetTab === 'courses' ||
                    targetTab === 'learning' ||
                    viewingNotifDetail.category === 'mentor' ||
                    notifTitle.includes('কোর্স') ||
                    notifTitle.includes('মডিউল') ||
                    notifText.includes('মডিউল')
                  ) {
                    if (onStartLearning) {
                      onStartLearning('course-mern-pro', 'video', 'courses');
                    } else if (setActiveTab) {
                      setActiveTab('courses', undefined, true);
                    } else {
                      setViewMode('buying');
                      setActiveSubTab('courses');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  // 3. Student Assignment & Grading
                  if (
                    targetTab === 'student-dashboard' ||
                    notifTitle.includes('অ্যাসাইনমেন্ট') ||
                    notifTitle.includes('assignment') ||
                    notifTitle.includes('রিভিউ') ||
                    notifText.includes('অ্যাসাইনমেন্ট')
                  ) {
                    if (setActiveTab) {
                      setActiveTab('student-dashboard', 'my-courses', true);
                    }
                    setViewMode('buying');
                    setActiveSubTab('my-courses');
                    setOrderHubTab('courses');
                    setStudentHubActiveTab('assignments');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  // 4. Financials / Wallet / Payout
                  if (
                    targetTab === 'financials' ||
                    viewingNotifDetail.category === 'payout' ||
                    notifTitle.includes('ওয়ালেট') ||
                    notifTitle.includes('পেমেন্ট') ||
                    notifTitle.includes('বোনাস') ||
                    notifTitle.includes('ক্যাশআউট') ||
                    notifText.includes('ওয়ালেট') ||
                    notifText.includes('ক্রেডিট')
                  ) {
                    if (viewMode === 'selling') {
                      setSpecialistMainTab('payments');
                      setPayoutSubTab('history');
                    } else {
                      setViewMode('buying');
                      setActiveSubTab('my-orders');
                      setOrderHubTab('orders');
                    }
                    if (setActiveTab) {
                      setActiveTab('financials', undefined, true);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  // 5. Orders & Deliveries
                  if (
                    targetTab === 'marketplace' ||
                    viewingNotifDetail.category === 'seller' ||
                    notifTitle.includes('অর্ডার') ||
                    notifTitle.includes('ord-') ||
                    notifTitle.includes('এস্ক্রো') ||
                    notifTitle.includes('গিগ')
                  ) {
                    setSelectedGig(null);
                    if (viewMode === 'selling') {
                      setSpecialistMainTab('marketplace');
                      setSellerSubTab('orders');
                    } else {
                      setViewMode('buying');
                      setActiveSubTab('my-orders');
                      setOrderHubTab('orders');
                    }
                    if (setActiveTab) {
                      setActiveTab('marketplace', 'my-orders', true);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }

                  // 6. Generic Target Tab Fallback
                  if (targetTab && setActiveTab) {
                    setActiveTab(targetTab, undefined, true);
                  } else if (setActiveTab) {
                    setActiveTab('marketplace', 'All', true);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>মূল কাজ / প্যানেলে যান</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MENTORSHIP APPLICATION FORM MODAL (মেন্টরশিপ আবেদন ফর্ম) */}
      {/* ========================================================================= */}
      {isMentorAppModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    🎓 PTEN IT মেন্টরশিপ আবেদন ফর্ম
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    কোর্স ও লাইভ ক্লাস মেন্টর হিসেবে যোগদানের অফিসিয়াল আবেদন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMentorAppModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            {mentorAppSubmittedSuccess ? (
              <div className="p-6 bg-teal-500/15 border border-teal-500/40 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-teal-400">
                  আপনার মেন্টরশিপ আবেদনটি সফলভাবে গৃহীত হয়েছে!
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  পিটেন আইটি এডমিন প্যানেল আপনার প্রোফাইল ও প্রস্তাবিত কোর্স টপিক পর্যালোচনা করছে। এডমিন অনুমোদন দিলে সাথে সাথে মেন্টর সার্ভিস অপশনটি আনলক হয়ে যাবে।
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyForMentorship({
                    expertise: mentorAppExpertise,
                    experienceYears: mentorAppExperience,
                    bio: mentorAppBio,
                    portfolioUrl: mentorAppPortfolio,
                    proposedCourseTopic: mentorAppProposedTopic,
                    phone: mentorAppPhone,
                  });
                  setMentorAppSubmittedSuccess(true);
                  setTimeout(() => {
                    setMentorAppSubmittedSuccess(false);
                    setIsMentorAppModalOpen(false);
                  }, 1800);
                }}
                className="space-y-4 text-xs"
              >
                {/* 1. Skill Categories */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    ১. আপনার প্রধান মেন্টরিং এক্সপার্টাইজ (Expertise Categories):
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {['Web Development', 'UI/UX Design', 'Digital Marketing', 'Python & AI', 'Video Editing', 'Cyber Security'].map((cat) => {
                      const isSelected = mentorAppExpertise.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setMentorAppExpertise(mentorAppExpertise.filter(c => c !== cat));
                            } else {
                              setMentorAppExpertise([...mentorAppExpertise, cat]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-black text-xs transition border cursor-pointer ${
                            isSelected
                              ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Years of Experience */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    ২. প্রফেশনাল ও মেন্টরিং অভিজ্ঞতা:
                  </label>
                  <select
                    value={mentorAppExperience}
                    onChange={(e) => setMentorAppExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="1-2 Years">১ - ২ বছর প্রফেশনাল অভিজ্ঞতা</option>
                    <option value="3-5 Years">৩ - ৫ বছর প্রফেশনাল অভিজ্ঞতা (প্রস্তাবিত)</option>
                    <option value="5+ Years">৫+ বছর সিনিয়র / লিড এক্সপার্ট অভিজ্ঞতা</option>
                  </select>
                </div>

                {/* 3. Proposed Course / Workshop Topic */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    ৩. প্রস্তাবিত কোর্স বা ওয়ার্কশপের বিষয় (Course Topic):
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorAppProposedTopic}
                    onChange={(e) => setMentorAppProposedTopic(e.target.value)}
                    placeholder="যেমন: Full-Stack Web Development Mastery (Next.js & Node)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* 4. Portfolio / GitHub URL */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    ৪. পোর্টফোলিও বা প্রোফাইল লিংক (GitHub / Behance / LinkedIn):
                  </label>
                  <input
                    type="url"
                    value={mentorAppPortfolio}
                    onChange={(e) => setMentorAppPortfolio(e.target.value)}
                    placeholder="https://github.com/yourprofile"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* 5. Bio / Teaching Philosophy */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    ৫. আপনার সংক্ষিপ্ত বায়ো ও শিক্ষণ দর্শন (Bio):
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={mentorAppBio}
                    onChange={(e) => setMentorAppBio(e.target.value)}
                    placeholder="আপনার কাজের অভিজ্ঞতা এবং শিক্ষার্থীদের কীভাবে গাইড করবেন সে সম্পর্কে লিখুন..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                {/* 6. Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">
                    ৬. যোগাযোগ / হোয়াটসঅ্যাপ নম্বর:
                  </label>
                  <input
                    type="text"
                    value={mentorAppPhone}
                    onChange={(e) => setMentorAppPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      approveMentorApplication(currentUser?.id);
                      setIsMentorAppModalOpen(false);
                      setSpecialistMainTab('mentor');
                      setSellerSubTab('courses');
                      alert('⚡ অ্যাডমিন টেস্ট মোড: মেন্টরশিপ আবেদন সাথে সাথে অনুমোদিত (Approved) হয়েছে এবং মেন্টর সার্ভিস আনলক করা হয়েছে!');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 border border-purple-500/30 font-black text-xs transition cursor-pointer"
                  >
                    ⚡ অ্যাডমিন টেস্ট ইনস্ট্যান্ট অ্যাপ্রুভ
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setIsMentorAppModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition cursor-pointer"
                    >
                      আবেদন জমা দিন (Submit) 🚀
                    </button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MENTORSHIP STATUS & ADMIN SIMULATION MODAL (আবেদনের অবস্থা ও অ্যাডমিন অ্যাকশন) */}
      {/* ========================================================================= */}
      {isMentorStatusModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-4 overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    মেন্টরশিপ আবেদনের বর্তমান অবস্থা
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    স্ট্যাটাস: {isMentor ? 'অনুমোদিত (Approved)' : isMentorPending ? 'এডমিন রিভিউ পেন্ডিং (Pending)' : 'আবেদন করা হয়নি'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMentorStatusModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Card */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500">আবেদন স্ট্যাটাস</span>
                <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                  পেন্ডিং রিভিউ ⏳
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                আপনার মেন্টরশিপ আবেদনটি পিটেন আইটি অ্যাডমিন টিম রিভিউ করছে। সাধারণত ১-১২ ঘণ্টার মধ্যে যাচাই শেষে মেন্টর একাউন্ট আনলক করা হয়।
              </p>
            </div>

            {/* Application Data Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>আবেদনকারী:</span>
                <strong className="text-slate-900 dark:text-white">{currentUser?.name}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>অভিজ্ঞতা:</span>
                <strong className="text-slate-900 dark:text-white">{mentorAppExperience}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>প্রস্তাবিত কোর্স:</span>
                <strong className="text-teal-500">{mentorAppProposedTopic}</strong>
              </div>
            </div>

            {/* Admin Simulation Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-black uppercase text-slate-400 block text-center">
                অ্যাডমিন সিমুলেশন অ্যাকশন (টেস্টিং এর জন্য)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    rejectMentorApplication(currentUser?.id, 'অভিজ্ঞতার প্রমাণপত্র প্রয়োজন');
                    setIsMentorStatusModalOpen(false);
                    alert('আবেদনটি বাতিল/রিজেক্ট করা হয়েছে। ইউজার পুনরায় আবেদন করতে পারবেন।');
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border border-rose-500/30 font-black text-xs transition cursor-pointer"
                >
                  ✕ আবেদন বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    approveMentorApplication(currentUser?.id);
                    setIsMentorStatusModalOpen(false);
                    setSpecialistMainTab('mentor');
                    setSellerSubTab('courses');
                    alert('✓ আবেদনটি সফলভাবে অনুমোদন (Approved) করা হয়েছে! মেন্টর সার্ভিস সম্পূর্ণ আনলক হয়েছে।');
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  ✓ এডমিন অনুমোদন (Approve)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR - MERGED WITH TOP MENUBAR (FB LITE STYLE) */}
      <div className="hidden">
        {/* 1. হোম (Home) */}
        <button
          type="button"
          onClick={() => {
            if (setActiveTab) setActiveTab('home');
          }}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer active:scale-95 text-slate-400 hover:text-white"
        >
          <Home className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-bold">হোম</span>
        </button>

        {/* 2. অর্ডার (Orders) */}
        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              if (openAuthModal) openAuthModal();
              return;
            }
            setSelectedGig(null);
            setViewMode('buying');
            setActiveSubTab('my-orders');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer relative active:scale-95 ${
            activeSubTab === 'my-orders' && !selectedGig ? 'text-[#1DB954] font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">অর্ডার</span>
          {allBuyerOrders.length > 0 && (
            <span className="absolute -top-0.5 right-1 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
              {allBuyerOrders.length}
            </span>
          )}
        </button>


        {/* 4. মেসেঞ্জার (Messenger) */}
        <button
          type="button"
          onClick={() => {
            setIsNotificationsOpen(false);
            openMessengerInbox();
          }}
          className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer relative active:scale-95 text-slate-400 hover:text-white"
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px] font-bold">মেসেঞ্জার</span>
          {directMessages.filter(m => !m.read).length > 0 && (
            <span className="absolute -top-0.5 right-1 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
              {directMessages.filter(m => !m.read).length}
            </span>
          )}
        </button>

        {/* 5. নোটিফিকেশন (Notification) */}
        <button
          type="button"
          onClick={() => {
            setIsNotificationsOpen(!isNotificationsOpen);
            setIsInboxModalOpen(false);
          }}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer relative active:scale-95 ${
            isNotificationsOpen ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-bold">নোটিফিকেশন</span>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-0.5 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>

        {/* 6. পছন্দের (Saved) */}
        <button
          type="button"
          onClick={() => {
            if (!currentUser) {
              if (openAuthModal) openAuthModal();
              return;
            }
            setSelectedGig(null);
            setViewMode('buying');
            setActiveSubTab('saved_gigs');
            setIsInboxModalOpen(false);
            setIsNotificationsOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-xl transition cursor-pointer relative active:scale-95 ${
            activeSubTab === 'saved_gigs' && !selectedGig ? 'text-[#1DB954] font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-5 h-5 text-rose-400" />
          <span className="text-[10px] font-bold">পছন্দের</span>
          {savedGigIds && savedGigIds.length > 0 && (
            <span className="absolute -top-0.5 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {savedGigIds.length}
            </span>
          )}
        </button>
      </div>

      {/* MOBILE CATEGORY SELECTION SHEET / MODAL */}
      {isMobileCatSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsMobileCatSheetOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-250">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">ক্যাটাগরি নির্বাচন করুন</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">আপনার পছন্দের সার্ভিস ক্যাটাগরি বেছে নিন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCatSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Categories */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                { id: 'All', title: 'সব সার্ভিস (All)', icon: Layers, desc: 'সকল ক্যাটাগরি', badgeColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
                { id: 'AI Services', title: 'এআই ও সফটওয়্যার', icon: Sparkles, desc: 'Gemini, ChatGPT, AI Web', badgeColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
                { id: 'Programming & Tech', title: 'প্রোগ্রামিং ও টেক', icon: Code, desc: 'Web & Mobile Apps', badgeColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
                { id: 'Graphics & Design', title: 'গ্রাফিক্স ও ডিজাইন', icon: Pencil, desc: 'Logo, UI/UX, Banner', badgeColor: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40' },
                { id: 'Digital Marketing', title: 'ডিজিটাল মার্কেটিং', icon: TrendingUp, desc: 'FB Ads, Marketing', badgeColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
                { id: 'Video & Animation', title: 'ভিডিও ও অ্যানিমেশন', icon: Video, desc: 'Reels, Editing, 2D', badgeColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
                { id: 'SEO & Growth', title: 'এসইও ও গ্রোথ', icon: Search, desc: 'Rankings, Traffic', badgeColor: 'text-teal-500 bg-teal-50 dark:bg-teal-950/40' },
                { id: 'Education & Training', title: 'এডুকেশন ও ট্রেনিং', icon: GraduationCap, desc: 'Skills, Courses', badgeColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' }
              ].map(item => {
                const isSelected = selectedCategory === item.id;
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedGig(null);
                      setSelectedCategory(item.id);
                      setIsMobileCatSheetOpen(false);
                    }}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition cursor-pointer active:scale-95 relative ${
                      isSelected
                        ? 'bg-[#1DB954]/10 border-[#1DB954] shadow-md ring-2 ring-[#1DB954]/20'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-[#1DB954]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.badgeColor}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#1DB954] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">{item.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE DETAILED FILTER & SORT SHEET */}
      {isMobileFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsMobileFilterSheetOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-250">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto -mt-1 mb-1" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center font-bold">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">ফিল্টার ও সর্টিং</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">ফিল্টার সেট করে নির্দিষ্ট সার্ভিস খুঁজুন</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0 || sortBy !== 'popular') && (
                  <button
                    type="button"
                    onClick={() => {
                      setPriceRangeFilter('all');
                      setDeliveryFilter('any');
                      setRatingFilter(0);
                      setSortBy('popular');
                    }}
                    className="text-rose-500 hover:underline text-xs font-black"
                  >
                    রিসেট
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200">🔄 সর্ট করুন:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'popular', label: 'জনপ্রিয়তা' },
                  { id: 'price-asc', label: 'দাম: কম থেকে বেশি' },
                  { id: 'price-desc', label: 'দাম: বেশি থেকে কম' },
                  { id: 'rating', label: 'সর্বোচ্চ রেটিং' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSortBy(s.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      sortBy === s.id
                        ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price / Budget Options */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200">💰 বাজেট ফিল্টার:</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'সব বাজেট' },
                  { id: 'under3k', label: '৳৩,০০০ এর নিচে' },
                  { id: '3k-10k', label: '৳৩k - ৳১০k' },
                  { id: '10k-30k', label: '৳১০k - ৳৩০k' },
                  { id: 'over30k', label: '৳৩০k+' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriceRangeFilter(p.id as any)}
                    className={`py-1.5 px-3 rounded-full border text-xs font-bold transition cursor-pointer ${
                      priceRangeFilter === p.id
                        ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Time Options */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200">⚡ ডেলিভারি সময়:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'any', label: 'সব ডেলিভারি সময়' },
                  { id: '1day', label: '২৪ ঘণ্টা (এক্সপ্রেস)' },
                  { id: '3days', label: '৩ দিন' },
                  { id: '7days', label: '৭ দিন' }
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDeliveryFilter(d.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      deliveryFilter === d.id
                        ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 dark:text-slate-200">⭐ সেলার রেটিং:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 0, label: 'সব রেটিং' },
                  { id: 4.5, label: '৪.৫+ ⭐ (টপ)' },
                  { id: 4.8, label: '৪.৮+ ⭐ (সুপার)' },
                  { id: 5.0, label: '৫.০ ⭐ (পারফেক্ট)' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRatingFilter(r.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                      ratingFilter === r.id
                        ? 'bg-[#1DB954] text-white border-[#1DB954] font-black shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit / View Results Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsMobileFilterSheetOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs sm:text-sm shadow-lg shadow-[#1DB954]/25 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ফলাফল দেখুন ({filteredGigs.length}টি সার্ভিস)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* SELLER PAYMENT METHODS & FUND RELEASE MODAL */}
      {payReleaseModalOrder && (() => {
        const modalIsWorkFirst = payReleaseModalOrder.offerType === "work_first" || payReleaseModalOrder.isWorkFirst || (payReleaseModalOrder.id.charCodeAt(0) % 2 === 0);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative">
              {/* Modal Close Button */}
              <button
                type="button"
                onClick={() => setPayReleaseModalOrder(null)}
                className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pr-8">
                <div className={modalIsWorkFirst ? "w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0" : "w-10 h-10 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center shrink-0"}>
                  {modalIsWorkFirst ? <CreditCard className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                    {modalIsWorkFirst ? "সেলার পেমেন্ট ও বকেয়া শোধ" : "এসক্রো ফান্ড রিলিজ"}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    অর্ডার আইডি: #{payReleaseModalOrder.id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Seller Summary Box */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={payReleaseModalOrder.sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={payReleaseModalOrder.sellerName || "মাহবুবুল আলম"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954]"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {payReleaseModalOrder.sellerName || "মাহবুবুল আলম"}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-white" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">ভেরিফাইড ডেভেলপমেন্ট সেলার</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm sm:text-base font-black text-[#1DB954] font-mono block">
                    ৳{(payReleaseModalOrder.amount || 18000).toLocaleString("bn-BD")}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold block">
                    {modalIsWorkFirst ? "বকেয়া মূল্য" : "পেইড (এসক্রো)"}
                  </span>
                </div>
              </div>

              {/* IF PAID / ESCROW: Show direct Escrow Release notice (NO payment methods needed) */}
              {!modalIsWorkFirst ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>পেমেন্ট অলরেডি এসক্রোতে সুরক্ষিত আছে</span>
                    </div>
                    <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/90 font-medium leading-relaxed">
                      আপনি অর্ডার করার সময়েই ৳{(payReleaseModalOrder.amount || 18000).toLocaleString("bn-BD")} পরিশোধ করেছেন। সেলার কাজ সম্পন্ন করায় পেমেন্ট রিলিজ করতে নিচের রিভিউ ও কনফার্ম বাটন ব্যবহার করুন।
                    </p>
                  </div>
                </div>
              ) : (
                /* IF WORK FIRST: Show Seller Payment Methods for paying due bill */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      <span>সেলার পেমেন্ট মেথডসমূহ (বকেয়া বিল)</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold">বিল পরিষদ করুন</span>
                  </div>

                  {/* Payment Methods Cards */}
                  <div className="space-y-2 text-xs font-bold">
                    {/* bKash */}
                    <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center text-[10px] font-black">ব</span>
                        <div>
                          <span className="text-pink-700 dark:text-pink-300 font-black block text-[11px]">বিকাশ (Personal/Merchant)</span>
                          <span className="text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">01712-345678</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("01712345678");
                          setCopiedMethod("bKash");
                          setTimeout(() => setCopiedMethod(null), 2000);
                        }}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-[10px] font-bold hover:bg-pink-100 transition cursor-pointer flex items-center gap-1"
                      >
                        {copiedMethod === "bKash" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMethod === "bKash" ? "কপি হয়েছে" : "কপি"}</span>
                      </button>
                    </div>

                    {/* Nagad */}
                    <div className="p-2.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">ন</span>
                        <div>
                          <span className="text-orange-700 dark:text-orange-300 font-black block text-[11px]">নগদ (Personal)</span>
                          <span className="text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">01812-345678</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("01812345678");
                          setCopiedMethod("Nagad");
                          setTimeout(() => setCopiedMethod(null), 2000);
                        }}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-300 text-[10px] font-bold hover:bg-orange-100 transition cursor-pointer flex items-center gap-1"
                      >
                        {copiedMethod === "Nagad" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedMethod === "Nagad" ? "কপি হয়েছে" : "কপি"}</span>
                      </button>
                    </div>

                    {/* Bank */}
                    <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-700 dark:text-blue-300 font-black text-[11px]">ব্যাংক ট্রান্সফার (Bank Transfer)</span>
                        <span className="text-[9px] text-blue-500 font-bold">ইসলামী ব্যাংক</span>
                      </div>
                      <div className="text-[10px] text-slate-700 dark:text-slate-300 font-mono leading-tight">
                        হিসাব নম্বর: <span className="font-bold text-slate-900 dark:text-white">২০৫০১২৩৪৫৬৭৮৯</span> | শাখা: গুলশান, ঢাকা
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RATING & REVIEW SECTION */}
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>সেলারকে রেটিং ও রিভিউ দিন</span>
                  </span>
                  <span className="text-[10px] text-amber-500 font-bold">{releaseRating}.0 স্টার</span>
                </div>

                {/* Star rating picker */}
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReleaseRating(star)}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= releaseRating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Review Textarea */}
                <textarea
                  rows={2}
                  value={releaseReviewText}
                  onChange={(e) => setReleaseReviewText(e.target.value)}
                  placeholder="সেলার ও কাজের কোয়ালিটি নিয়ে মতামত লিখুন..."
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* Action Release Confirm Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (updateMarketplaceOrder) {
                        updateMarketplaceOrder(payReleaseModalOrder.id, {
                          status: "completed",
                          isPaid: true,
                          rating: releaseRating,
                          review: releaseReviewText,
                        });
                      }
                    } catch (e) {
                      console.log(e);
                    }
                    setPayReleaseModalOrder(null);
                    setIsReleaseSuccessToast(true);
                    setTimeout(() => setIsReleaseSuccessToast(false), 4500);
                  }}
                  className="w-full py-3 px-4 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-sm rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>
                    {modalIsWorkFirst
                      ? "বকেয়া শোধ, রিভিউ ও রিলিজ নিশ্চিত করুন"
                      : "ফান্ড রিলিজ ও রিভিউ প্রদান করুন"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PACKAGE DETAILS POPUP MODAL */}
      {detailsModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl relative">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setDetailsModalOrder(null)}
              className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8 space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#0B0F19] text-white font-mono text-xs font-black rounded-lg border border-slate-800">
                  #{detailsModalOrder.id.slice(-8).toUpperCase()}
                </span>
                {detailsModalOrder.category && (
                  <span className="px-2.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-[#1DB954] text-xs font-extrabold rounded-full border border-emerald-500/30">
                    {detailsModalOrder.category}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold border border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10">
                  {detailsModalOrder.status === 'completed'
                    ? 'সম্পন্ন'
                    : detailsModalOrder.status === 'in_review'
                    ? 'রিভিউ পর্যায়ে'
                    : detailsModalOrder.status === 'in_progress'
                    ? 'কাজ চলমান'
                    : 'অপেক্ষমাণ'}
                </span>
              </div>

              {/* Full Title */}
              <h2 className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                {detailsModalOrder.title || 'Direct Service Order'}
              </h2>
            </div>

            {/* ORDERED GIG PACKAGE DETAILS CARD */}
            <div className="p-4 bg-gradient-to-br from-emerald-500/10 via-slate-50 to-blue-500/10 dark:from-emerald-950/30 dark:via-slate-950 dark:to-blue-950/30 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#1DB954] text-slate-950 text-xs font-black rounded-lg uppercase tracking-wider">
                    অর্ডারকৃত গিগ প্যাকেজ
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {detailsModalOrder.packageName || detailsModalOrder.packageTier || 'প্রিমিয়াম অল-ইন-ওয়ান প্যাকেজ'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-[#1DB954] font-mono block">
                    ৳{(detailsModalOrder.amount || 89500).toLocaleString('bn-BD')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block">
                    {detailsModalOrder.paymentMethod || 'bKash Escrow Protected'}
                  </span>
                </div>
              </div>

              {/* Package Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                  <span>রেসপনসিভ ই-কমার্স UI/UX ডিজাইন</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                  <span>bKash & Nagad এস্ক্রো পেমেন্ট গেটওয়ে</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                  <span>ফাস্ট ৭-দিনের এক্সপ্রেস ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                  <span>আনলিমিটেড রিভিশন ও সোর্স ফাইল</span>
                </div>
              </div>

              {/* Package Description */}
              <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 block">
                  প্যাকেজ রিকোয়ারমেন্ট ও বিবরণ:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {detailsModalOrder.description || 'ফুল-স্ট্যাক ই-কমার্স ওয়েবসাইট UI/UX রি-ডিজাইন, রেসপনসিভ মোবাইল লেআউট এবং bKash ও Nagad এস্ক্রো পেমেন্ট গেটওয়ে ইন্টিগ্রেশন সম্পন্ন করতে হবে।'}
                </p>
              </div>
            </div>

            {/* 4-Step Live Progress Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>লাইভ প্রজেক্ট টাইমলাইন ও প্রগতি</span>
                <span className="text-[#1DB954] font-black">{detailsModalOrder.progress || (detailsModalOrder.status === 'completed' ? 100 : detailsModalOrder.status === 'in_review' ? 90 : detailsModalOrder.status === 'in_progress' ? 65 : 25)}%</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-bold text-xs">
                <div className={`p-2 rounded-xl flex items-center gap-1.5 ${
                  (detailsModalOrder.progress || 65) >= 25
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">১. এস্ক্রো জমা</span>
                </div>

                <div className={`p-2 rounded-xl flex items-center gap-1.5 ${
                  (detailsModalOrder.progress || 65) >= 65
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                }`}>
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="truncate">২. কাজ চলমান</span>
                </div>

                <div className={`p-2 rounded-xl flex items-center gap-1.5 ${
                  (detailsModalOrder.progress || 65) >= 90
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                }`}>
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">৩. ফাইল ডেলিভারি</span>
                </div>

                <div className={`p-2 rounded-xl flex items-center gap-1.5 ${
                  (detailsModalOrder.progress || 65) >= 100
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                }`}>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">৪. ফান্ড রিলিজ</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={detailsModalOrder.sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                  alt={detailsModalOrder.sellerName || 'সাবরিনা চৌধুরী'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954]"
                />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block leading-none">অ্যাসাইনকৃত সেলার</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block">
                    {detailsModalOrder.sellerName || 'সাবরিনা চৌধুরী'}
                  </span>
                  <span className="text-xs font-bold text-[#1DB954]">ফ্রিলা্যান্সার সেলার (ভেরিফাইড)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const ordId = detailsModalOrder.id;
                  setDetailsModalOrder(null);
                  openChatWindow({
                    id: `chat-order-${ordId}`,
                    orderId: ordId,
                    senderName: detailsModalOrder.sellerName || 'সাবরিনা চৌধুরী',
                    senderRole: 'seller',
                    senderAvatar: detailsModalOrder.sellerAvatar,
                    initialMessage: `আসসালামু আলাইকুম ${detailsModalOrder.sellerName || 'সেলার'}! আমি আমার প্রজেক্ট #${ordId.slice(-6)} ("${detailsModalOrder.title}") এর জন্য যোগাযোগ করছি।`
                  });
                }}
                className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>সেলারকে মেসেজ দিন</span>
              </button>
            </div>

            {/* Footer Controls */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
              <button
                type="button"
                onClick={() => alert(`প্রজেক্ট #${detailsModalOrder.id.slice(-6)} এর ইনভয়েস ক্যাশ মেমো:\n\nঅর্ডার ID: ${detailsModalOrder.id}\nপ্রজেক্ট: ${detailsModalOrder.title}\nসেলার: ${detailsModalOrder.sellerName || 'সাবরিনা চৌধুরী'}\nপরিমাণ: ৳${(detailsModalOrder.amount || 89500).toLocaleString('bn-BD')}\nতারিখ: ${detailsModalOrder.createdAt || '২০২৬-০৮-১৮'}`)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>ইনভয়েস ক্যাশ মেমো</span>
              </button>

              {detailsModalOrder.status !== 'completed' && detailsModalOrder.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => {
                    const note = window.prompt("সেলারকে কাজের সংশোধনের জন্য আপনার বার্তা লিখুন:");
                    if (note) {
                      requestOrderRevision(detailsModalOrder.id, note);
                      alert("সেলারকে রিভিশন রিকোয়েস্ট পাঠানো হয়েছে!");
                    }
                  }}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>রিভিশন মেসেজ</span>
                </button>
              )}

              {detailsModalOrder.status === 'in_review' && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`আপনি কি নিশ্চিত যে "${detailsModalOrder.title}" প্রজেক্টটি সঠিকভাবে বুঝে পেয়েছেন এবং সেলারকে ৳${(detailsModalOrder.amount || 89500).toLocaleString('bn-BD')} এস্ক্রো পেমেন্ট রিলিজ করতে চান?`)) {
                      approveOrderAndReleaseEscrow(detailsModalOrder.id, 5, "চমৎকার প্রজেক্ট তৈরি করেছেন! ১০০% সন্তুষ্ট।");
                      setDetailsModalOrder(null);
                      alert("অভিনন্দন! সেলারকে পেমেন্ট রিলিজ করা হয়েছে এবং প্রজেক্টটি সফলভাবে কমপ্লিট হিসেবে মার্ক করা হয়েছে।");
                    }
                  }}
                  className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>এপ্রুভ ও পেমেন্ট রিলিজ</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
