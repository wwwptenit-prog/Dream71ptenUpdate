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
  Palette,
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
  const [buyerOrderStatusFilter, setBuyerOrderStatusFilter] = useState<'all' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'public_projects' | 'courses'>('all');
  const [revisionModalOrder, setRevisionModalOrder] = useState<any | null>(null);
  const [revisionNote, setRevisionNote] = useState<string>("");
  const [messengerSubTabFilter, setMessengerSubTabFilter] = useState<'all' | 'sellers' | 'online' | 'orders'>('all');
  const [isMessengerSearchActive, setIsMessengerSearchActive] = useState(false);
  const [messengerSearchQuery, setMessengerSearchQuery] = useState('');
  const [isOrderSearchActive, setIsOrderSearchActive] = useState(false);
  const [isMarketplaceSettingsModalOpen, setIsMarketplaceSettingsModalOpen] = useState(false);
  const [mktSettings, setMktSettings] = useState({
    notifications: true,
    autoSaveOrders: true,
    soundAlerts: true,
    currency: "BDT"
  });
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [isSavedSearchActive, setIsSavedSearchActive] = useState(false);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');



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
  // Mobile expansion toggles for 2-column sections (max 4 by default on phone)
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [mobileCoursesExpanded, setMobileCoursesExpanded] = useState(false);
  const [mobileGigsExpanded, setMobileGigsExpanded] = useState(false);

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

  // Always reset search inputs when changing sub tabs, categories, or closing/opening messenger/notifications
  useEffect(() => {
    setIsOrderSearchActive(false);
    setOrderSearchQuery('');
    setIsSavedSearchActive(false);
    setSavedSearchQuery('');
    setIsMessengerSearchActive(false);
    setMessengerSearchQuery('');
    setIsMarketplaceSettingsModalOpen(false);
  }, [activeSubTab, orderHubTab, selectedGig, isMessengerInboxOpen, isNotificationCenterOpen]);

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
  const displayedSavedGigs = useMemo(() => {
    let list = savedGigs;
    if (savedSearchQuery.trim()) {
      const q = savedSearchQuery.toLowerCase();
      list = list.filter(g =>
        g.title?.toLowerCase().includes(q) ||
        g.category?.toLowerCase().includes(q) ||
        g.sellerName?.toLowerCase().includes(q) ||
        g.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [savedGigs, savedSearchQuery]);

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
    <div id="marketplace-top" className={`pt-0 pb-6 sm:py-6 px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full max-w-[1920px] mx-auto space-y-3 sm:space-y-8 font-sans text-slate-900 dark:text-slate-100 min-h-screen ${
    (activeSubTab === "gigs" && selectedCategory === "All" && !selectedGig)
      ? "bg-slate-50 dark:bg-slate-950" 
      : "bg-white sm:bg-slate-50 dark:bg-slate-950"
  } pb-12 md:pb-8`}>
      
      {/* PTENit MODERN FIVERR-STYLE MARKETPLACE HEADER (MATCHING PTENIT NAVBAR COLOR & STYLE) */}
      {!selectedGig && viewMode !== "selling" && (
        <div className={`sticky top-0 z-40 bg-[#0B132B] text-white w-full px-0 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-0 sm:mb-6 shadow-md ${
          ["overview", "my-orders", "my-courses", "saved_gigs", "settings", "post-project", "public-offers"].includes(activeSubTab) ? "md:hidden" : ""
        }`}>
          <div className="w-full max-w-[1920px] mx-auto py-0 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-0 sm:gap-4">
            
            {/* MOBILE VIEW HEADER (< md screen: Always Logo + Search Bar + 5 Icons) */}
            <div className="flex md:hidden flex-col w-full font-bengali">
              {/* Top Bar: Brand, Search, Profile, Menu - ONLY ON HOME TAB */}
              {activeSubTab === "gigs" && !selectedGig && (
                <div className="flex items-center justify-between gap-1.5 w-full px-3 py-1.5">
                  {/* Left: PTENit Brand Logo */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGig(null);
                      setViewMode("buying");
                      setActiveSubTab("gigs");
                      setSelectedCategory("All");
                      setSearchQuery("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
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
                          onClick={() => setSearchQuery("")}
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
                              const gigThumbnail = gig.images?.[0] || gig.sellerAvatar || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80";
                              return (
                                <div
                                  key={gig.id}
                                  onClick={() => {
                                    setSelectedGig(gig);
                                    setViewMode("buying");
                                    setActiveSubTab("gigs");
                                    setSearchQuery("");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
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
                                        ৳{gigPrice.toLocaleString("en-US")}
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
                                setViewMode("buying");
                                setActiveSubTab("gigs");
                                window.scrollTo({ top: 400, behavior: "smooth" });
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
                        onClick={() => {
                          if (openAuthModal) openAuthModal();
                        }}
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
                      className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                      title="মেনু ও ফিল্টার"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* FACEBOOK LITE STYLE UNIFIED 5 ICON NAVIGATION BAR (EXACT SAME SIZING AS MESSENGER) */}
              <div className={`flex items-center justify-around py-2 px-2 border-b border-slate-800/80 w-full text-white ${
                activeSubTab === "gigs" && !selectedGig ? "border-t border-slate-800/80 border-b-0" : ""
              }`}>
                {/* 1. 🏠 Marketplace Home */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMarketplaceSettingsModalOpen(false);
                    setIsOrderSearchActive(false);
                    setIsSavedSearchActive(false);
                    setSelectedGig(null);
                    setViewMode("buying");
                    setActiveSubTab("gigs");
                    setSelectedCategory("All");
                    setSearchQuery("");
                    setIsInboxModalOpen(false);
                    setIsNotificationsOpen(false);
                    if (setActiveTab) {
                      setActiveTab("marketplace", "All", true);
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                  title="মার্কেটপ্লেস হোম"
                >
                  <Home className={`w-5 h-5 ${
                    activeSubTab === "gigs" && selectedCategory === "All" && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (activeTab === "marketplace" || !activeTab)
                      ? "text-[#1DB954] stroke-[2.5]"
                      : "text-white"
                  }`} />
                </button>

                {/* 2. 🛍️ Order & Courses */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMarketplaceSettingsModalOpen(false);
                    setIsOrderSearchActive(false);
                    setIsSavedSearchActive(false);
                    setSelectedGig(null);
                    setViewMode("buying");
                    setActiveSubTab("my-orders");
                    setOrderHubTab("orders");
                    if (setActiveTab) {
                      setActiveTab("marketplace", "my-orders", true);
                    }
                    setIsInboxModalOpen(false);
                    setIsNotificationsOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                  title="আমার ক্রয়কৃত প্রজেক্ট ও কোর্সসমূহ"
                >
                  <ShoppingBag className={`w-5 h-5 ${
                    (activeSubTab === "my-orders" || activeSubTab === "my-courses") && !selectedGig && !isInboxModalOpen && !isNotificationsOpen
                      ? "stroke-[2.5] text-[#1DB954]"
                      : "text-white"
                  }`} />
                </button>

                {/* 3. ✉️ Messenger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMarketplaceSettingsModalOpen(false);
                    setIsOrderSearchActive(false);
                    setIsSavedSearchActive(false);
                    if (!currentUser) {
                      if (openAuthModal) openAuthModal();
                      return;
                    }
                    openMessengerInbox();
                  }}
                  className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                  title="মেসেঞ্জার"
                >
                  <Mail className={`w-5 h-5 ${
                    isMessengerInboxOpen
                      ? "text-[#1DB954] stroke-[2.5]"
                      : "text-white"
                  }`} />
                  {(directMessages && directMessages.length > 0) && (
                    <span className="absolute -top-1.5 right-1.5 sm:right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-[#1DB954] text-white text-[9px] font-black flex items-center justify-center shadow-md ring-2 ring-[#0B132B]">
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
                    setIsMarketplaceSettingsModalOpen(false);
                    setIsOrderSearchActive(false);
                    setIsSavedSearchActive(false);
                    if (!currentUser) {
                      if (openAuthModal) openAuthModal();
                      return;
                    }
                    openNotificationCenter();
                  }}
                  className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                  title="নোটিফিকেশন"
                >
                  <Bell className={`w-5 h-5 ${
                    isNotificationCenterOpen
                      ? "text-[#1DB954] stroke-[2.5]"
                      : "text-white"
                  }`} />
                  {(notifications && notifications.length > 0) && (
                    <span className="absolute -top-1.5 right-1.5 sm:right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-md ring-2 ring-[#0B132B]">
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
                    setIsMarketplaceSettingsModalOpen(false);
                    setIsOrderSearchActive(false);
                    setIsSavedSearchActive(false);
                    setSelectedGig(null);
                    setViewMode("buying");
                    setActiveSubTab("saved_gigs");
                    if (setActiveTab) {
                      setActiveTab("marketplace", "saved_gigs", true);
                    }
                    setIsInboxModalOpen(false);
                    setIsNotificationsOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 flex justify-center items-center py-1 transition relative active:scale-95 cursor-pointer text-white"
                  title="পছন্দের সেভ করা গিগসমূহ"
                >
                  <Heart className={`w-5 h-5 ${
                    activeSubTab === "saved_gigs" && !selectedGig && !isInboxModalOpen && !isNotificationsOpen
                      ? "fill-[#1DB954] text-[#1DB954]"
                      : "text-white"
                  }`} />
                  {savedGigIds && savedGigIds.length > 0 && (
                    <span className="absolute -top-1.5 right-1.5 sm:right-2 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-md ring-2 ring-[#0B132B]">
                      {savedGigIds.length}
                    </span>
                  )}
                </button>
              </div>

              {/* ATTACHED SUB-HEADER BELOW 5 ICONS FOR ORDER / SAVED GIGS (MATCHING MESSENGER PIXEL-FOR-PIXEL) */}
              {(activeSubTab === "my-orders" || activeSubTab === "my-courses") && (
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-colors w-full">
                  {isOrderSearchActive ? (
                    /* Inline Direct Replacement Search Bar (Center, White Box, Inside X) */
                    <div className="w-full max-w-md mx-auto flex items-center animate-in fade-in duration-150 py-0.5">
                      <div className="relative w-full flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          placeholder="অর্ডার বা কোর্স সার্চ করুন..."
                          autoFocus
                          className="w-full pl-9 pr-8 py-1.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setOrderSearchQuery("");
                            setIsOrderSearchActive(false);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition cursor-pointer"
                          title="সার্চ বন্ধ করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGig(null);
                            setViewMode("buying");
                            setActiveSubTab("gigs");
                            setSelectedCategory("All");
                            setSearchQuery("");
                            if (setActiveTab) setActiveTab("marketplace", "All", true);
                          }}
                          className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                          title="হোমে ফিরে যান"
                        >
                          <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none truncate">Orders & Learning</h2>
                            <span className="w-2 h-2 rounded-full bg-[#1DB954] shrink-0" />
                            {allBuyerOrders.length > 0 && (
                              <span className="bg-[#1DB954] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 shrink-0">
                                {allBuyerOrders.length}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans truncate">
                            PTENit Client Hub & Purchases
                          </p>
                        </div>
                      </div>
                      {/* SEARCH & SETTINGS BUTTONS (Identical cleanly styled icon buttons without border clash) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsOrderSearchActive(true)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="সার্চ করুন"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMarketplaceSettingsModalOpen(true)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="সেটিংস"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSubTab === "saved_gigs" && (
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs transition-colors w-full">
                  {isSavedSearchActive ? (
                    /* Inline Direct Replacement Search Bar (Center, White Box, Inside X) */
                    <div className="w-full max-w-md mx-auto flex items-center animate-in fade-in duration-150 py-0.5">
                      <div className="relative w-full flex items-center">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={savedSearchQuery}
                          onChange={(e) => setSavedSearchQuery(e.target.value)}
                          placeholder="সেভ করা গিগ সার্চ করুন..."
                          autoFocus
                          className="w-full pl-9 pr-8 py-1.5 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSavedSearchQuery("");
                            setIsSavedSearchActive(false);
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs transition cursor-pointer"
                          title="সার্চ বন্ধ করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedGig(null);
                            setViewMode("buying");
                            setActiveSubTab("gigs");
                            setSelectedCategory("All");
                            setSearchQuery("");
                            if (setActiveTab) setActiveTab("marketplace", "All", true);
                          }}
                          className="p-1 -ml-1 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                          title="হোমে ফিরে যান"
                        >
                          <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none truncate">Saved Gigs</h2>
                            <span className="w-2 h-2 rounded-full bg-[#1DB954] shrink-0" />
                            {savedGigIds && savedGigIds.length > 0 && (
                              <span className="bg-[#1DB954] text-white text-[10px] font-black rounded-full px-1.5 py-0.2 shrink-0">
                                {savedGigIds.length}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans truncate">
                            PTENit Saved Services
                          </p>
                        </div>
                      </div>

                      {/* Right: Search + Settings */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsSavedSearchActive(true)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="সার্চ করুন"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMarketplaceSettingsModalOpen(true)}
                          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="সেটিংস"
                        >
                          <Settings className="w-4 h-4" />
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
                        ? 'bg-[#1DB954] text-white border-[#1DB954] font-bold shadow-md shadow-[#1DB954]/20'
                        : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700/60'
                    }`}
                    title="আমার অর্ডারসমূহ"
                  >
                    <ShoppingBag className="w-4.5 h-4.5" />
                    {marketplaceOrders.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#1DB954] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900 shadow-xs">
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
                            ? 'bg-[#1DB954] text-white border-[#1DB954] font-bold shadow-md shadow-[#1DB954]/20'
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
      </div>
      )}

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
                <div className="w-9 h-9 rounded-xl bg-[#1DB954] text-white flex items-center justify-center font-black shadow-md shadow-[#1DB954]/30 group-hover:scale-105 transition-transform">
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
                    ? 'bg-[#1DB954] text-white border-[#1DB954] font-black'
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
                    ? 'bg-[#1DB954] text-white border-[#1DB954] font-black'
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
                    ? 'bg-[#1DB954] text-white border-[#1DB954] font-black'
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
                    className={`px-2.5 py-2 rounded-xl font-bold text-xs text-left transition border truncate cursor-pointer ${
                      (selectedCategory === cat.id || (cat.id === 'AI Services' && selectedCategory === 'AI Development')) && activeSubTab === 'gigs' && !showSavedOnly
                        ? 'bg-[#1DB954] !text-white border-[#1DB954] font-black shadow-md ring-1 ring-white/20'
                        : 'bg-slate-800/90 text-slate-200 border-slate-700/80 hover:bg-slate-750 hover:text-white'
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

      {/* Clean layout: Sticky topbar occupies natural height */} 

      {/* CATEGORY & SERVICE FILTER SUB-NAVBAR (DESKTOP VIEW) */}
      {viewMode === 'buying' && activeSubTab === 'gigs' && selectedCategory === 'All' && !selectedGig && (
        <div className={`hidden sm:block sm:sticky sm:top-[57px] z-30 !mt-0 transition-all duration-300 ease-in-out ${
          isFilterBarVisible
            ? 'translate-y-0 opacity-100 mb-6 max-h-[500px] pointer-events-auto'
            : '-translate-y-2 opacity-0 py-0 max-h-0 overflow-hidden pointer-events-none'
        }`}>
          {/* DESKTOP VIEW MAIN BAR */}
          <div className="flex items-center justify-between gap-2 bg-[#0F172A] dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 text-white -mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-8 md:px-12 lg:px-16 xl:px-20 py-2.5">
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
                          ? 'bg-[#1DB954] !text-white border-[#1DB954] shadow-md shadow-[#1DB954]/25 font-black ring-1 ring-white/20'
                          : 'bg-slate-800/80 text-slate-200 border-slate-700/80 hover:bg-slate-700 hover:text-white hover:border-slate-600'
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
                            className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs sm:text-sm rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer shrink-0"
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
                          className="px-8 py-3.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-sm sm:text-base rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
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
                              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#1DB954] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-md">
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
                                ? 'bg-[#1DB954] text-white border-[#1DB954]'
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
                                        className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer shrink-0"
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
                              className="px-3 py-1 bg-[#1DB954] hover:bg-[#19a34a] text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer transition shrink-0"
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
                            className="w-full py-2.5 px-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs"
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
                          className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer self-end sm:self-auto shrink-0"
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
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs sm:text-sm transition cursor-pointer shadow-md"
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
                                      className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-md cursor-pointer"
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
                        ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-md ring-2 ring-[#1DB954]/20'
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
                              ? 'bg-[#1DB954] text-white shadow-md font-black'
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
                              ? 'bg-[#1DB954] text-white shadow-md font-black'
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
                              ? 'bg-[#1DB954] text-white shadow-md font-black'
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
                              ? 'bg-[#1DB954] text-white shadow-md font-black'
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
                          className="w-full mt-3 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black rounded-2xl text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
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
                          className="w-full mt-2 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
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
                                              className="relative px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
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
                            className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer inline-flex items-center gap-2"
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
                                                ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-sm'
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
                                        className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
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
                                              ? 'bg-[#1DB954] text-white font-black shadow-sm'
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

          {/* CATALOG SECTION (HERO + CATEGORY SECTIONS + FULL PAGE CATEGORY VIEWS) */}
          {(activeSubTab === 'gigs' || activeSubTab === 'ptenit-services' || activeSubTab === 'courses' || activeSubTab === 'jobs') && (
            <div className="space-y-4 sm:space-y-8 px-3 sm:px-0 pt-3 sm:pt-4">
              {/* WELCOME BACK USER HERO BANNER (COMPACT SIZING) */}
              {activeSubTab === 'gigs' && selectedCategory === 'All' && !searchQuery.trim() && (
                <div className="space-y-2.5">
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
              )}

              {/* VIEW 1: ACTIVE SEARCH QUERY RESULTS */}
              {searchQuery.trim() && activeSubTab === 'gigs' && (
                <div className="space-y-4 font-bengali animate-fadeIn">
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#1DB954]" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        "<strong>{searchQuery}</strong>" এর জন্য {filteredGigs.length}টি ফলাফল পাওয়া গেছে
                      </span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-rose-500 hover:underline font-bold cursor-pointer"
                    >
                      সার্চ রিসেট করুন ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                    {filteredGigs.map(gig => (
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
                </div>
              )}

              {/* VIEW 2: DEDICATED FULL-PAGE CATEGORY VIEW (WHEN A CATEGORY IS SELECTED) */}
              {!searchQuery.trim() && activeSubTab === 'gigs' && selectedCategory !== 'All' && (
                <div className="space-y-3 sm:space-y-4 font-bengali animate-fadeIn pb-8 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
                  {/* Mobile View Category Return Bar - Clean White */}
                  <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                        <span>সকল সার্ভিস</span>
                      </button>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {selectedCategory}
                      </h2>
                    </div>
                    <span className="text-[10px] font-black text-[#1DB954] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                      {filteredGigs.length}টি গিগ
                    </span>
                  </div>
                  {/* Desktop view category return button and title */}
                  <div className="hidden sm:flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95 shadow-xs"
                      >
                        <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                        <span>সকল সার্ভিসে ফিরে যান</span>
                      </button>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedCategory === 'Digital Marketing' ? 'Digital Marketing' :
                         selectedCategory === 'Programming & Tech' ? 'Programming & Tech' :
                         selectedCategory === 'Graphics & Design' ? 'Graphics & Design' :
                         selectedCategory === 'AI Services' ? 'AI & Automation' :
                         selectedCategory === 'Video & Animation' ? 'Video & Animation' :
                         selectedCategory === 'SEO & Growth' ? 'SEO & Growth' :
                         selectedCategory === 'Education & Training' ? 'Education & Training' : selectedCategory} সার্ভিসেস
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                      মোট {filteredGigs.length}টি গিগ পাওয়া গেছে
                    </span>
                  </div>

                  {/* FULL CATEGORY GIGS GRID - 2 COLUMNS ON PHONE, RESPONSIVE ON PC */}
                  {filteredGigs.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                      {filteredGigs.map(gig => (
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
                    <div className="p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        এই ক্যাটাগরিতে ফিল্টারের সাথে মিল রেখে কোনো গিগ পাওয়া যায়নি।
                      </p>
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setPriceRangeFilter('all');
                          setDeliveryFilter('any');
                        }}
                        className="px-4 py-2 bg-[#1DB954] text-white rounded-xl font-black text-xs cursor-pointer shadow-md"
                      >
                        সকল গিগ ব্রাউজ করুন
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* VIEW 3: MAIN MULTI-CATEGORY MARKETPLACE VIEW (2 COLUMNS X 2 ROWS PER CATEGORY WITH "আরও দেখুন") */}
              {!searchQuery.trim() && activeSubTab === 'gigs' && selectedCategory === 'All' && (
                <div className="space-y-10 font-bengali">

                  {/* 1. DIGITAL MARKETING CATEGORY BLOCK (২টা কলাম ২টা রো = ৪টি গিগ) */}
                  {(() => {
                    const marketingGigs = gigs.filter(g =>
                      ['digital marketing', 'social media', 'marketing', 'facebook', 'ads'].some(k =>
                        g.category.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)
                      )
                    );
                    const displayGigs = marketingGigs.length > 0 ? marketingGigs : gigs.slice(0, 4);

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="min-w-0">
                            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                              <TrendingUp className="w-4 h-4 text-[#1DB954] shrink-0" />
                              <span>ডিজিটাল মার্কেটিং সার্ভিসেস</span>
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('Digital Marketing');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                          >
                            <span>আরও দেখুন</span>
                            <span>→</span>
                          </button>
                        </div>

                        {/* 2x2 Grid (4 items) on Phone */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                          {displayGigs.slice(0, 4).map(gig => (
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
                      </div>
                    );
                  })()}

                  {/* 2. PROGRAMMING & WEB DEV CATEGORY BLOCK (২টা কলাম ২টা রো = ৪টি গিগ) */}
                  {(() => {
                    const devGigs = gigs.filter(g =>
                      ['web', 'development', 'programming', 'software', 'app', 'react', 'node'].some(k =>
                        g.category.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)
                      )
                    );
                    const displayGigs = devGigs.length > 0 ? devGigs : gigs.slice(4, 8);

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="min-w-0">
                            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                              <Code className="w-4 h-4 text-blue-500 shrink-0" />
                              <span>ওয়েব ও মোবাইল অ্যাপ ডেভেলপমেন্ট</span>
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('Programming & Tech');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                          >
                            <span>আরও দেখুন</span>
                            <span>→</span>
                          </button>
                        </div>

                        {/* 2x2 Grid (4 items) on Phone */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                          {displayGigs.slice(0, 4).map(gig => (
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
                      </div>
                    );
                  })()}

                  {/* 3. GRAPHICS & CREATIVE DESIGN BLOCK (২টা কলাম ২টা রো = ৪টি গিগ) */}
                  {(() => {
                    const designGigs = gigs.filter(g =>
                      ['graphic', 'design', 'ui/ux', 'logo', 'banner', 'creative'].some(k =>
                        g.category.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)
                      )
                    );
                    const displayGigs = designGigs.length > 0 ? designGigs : gigs.slice(8, 12);

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="min-w-0">
                            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                              <Palette className="w-4 h-4 text-pink-500 shrink-0" />
                              <span>গ্রাফিক্স ও ক্রিয়েটিভ ডিজাইন</span>
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('Graphics & Design');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                          >
                            <span>আরও দেখুন</span>
                            <span>→</span>
                          </button>
                        </div>

                        {/* 2x2 Grid (4 items) on Phone */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                          {displayGigs.slice(0, 4).map(gig => (
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
                      </div>
                    );
                  })()}

                  {/* 4. AI & AUTOMATION SERVICES BLOCK (২টা কলাম ২টা রো = ৪টি গিগ) */}
                  {(() => {
                    const aiGigs = gigs.filter(g =>
                      ['ai', 'automation', 'chatbot', 'bot', 'gpt', 'saas'].some(k =>
                        g.category.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)
                      )
                    );
                    const displayGigs = aiGigs.length > 0 ? aiGigs : gigs.slice(12, 16);

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="min-w-0">
                            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                              <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
                              <span>এআই ও অটোমেশন সার্ভিসেস</span>
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('AI Services');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                          >
                            <span>আরও দেখুন</span>
                            <span>→</span>
                          </button>
                        </div>

                        {/* 2x2 Grid (4 items) on Phone */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                          {displayGigs.slice(0, 4).map(gig => (
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
                      </div>
                    );
                  })()}

                  {/* 5. OFFICIAL IT AGENCY SERVICES BLOCK (DEEP GREEN CANVAS, 4 ITEMS 2X2) */}
                  <div className="bg-gradient-to-b from-[#064E3B] via-[#065F46] to-[#044E3B] text-white rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xl border border-emerald-600/40 space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-black text-white flex items-center gap-2 truncate">
                          <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                          <span>🏢 অফিশিয়াল আইটি সার্ভিসেস</span>
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('ptenit-services');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                      >
                        <span>আরও দেখুন</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* 2x2 Grid (4 items) */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                      {services.slice(0, 4).map(serv => {
                        const priceNum = typeof serv.priceText === 'string'
                          ? parseInt(serv.priceText.replace(/[^0-9]/g, ''), 10) || 10000
                          : 10000;

                        const servGig: MarketplaceGig = gigs.find(
                          g => g.id === serv.id || g.title.toLowerCase() === serv.title.toLowerCase()
                        ) || {
                          id: serv.id,
                          sellerId: 'ptenit-agency',
                          sellerName: 'PTENit Official Agency',
                          sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                          sellerLevel: 'Official Top Rated Agency',
                          isAgencyStaff: true,
                          title: serv.title,
                          category: serv.category,
                          description: serv.fullDescription || serv.shortDescription,
                          thumbnail: serv.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
                          rating: serv.rating || 5.0,
                          reviewsCount: serv.reviewsCount || 48,
                          packages: serv.packages || {
                            basic: {
                              name: 'বেসিক সলিউশন',
                              price: priceNum,
                              deliveryDays: 3,
                              revisions: '3',
                              features: serv.features && serv.features.length > 0 ? serv.features.slice(0, 3) : ['কাস্টম ডিজাইন', 'রেসপন্সিভ লেআউট', 'বেসিক সাপোর্ট']
                            },
                            standard: {
                              name: 'স্ট্যান্ডার্ড প্যাকেজ',
                              price: priceNum * 2,
                              deliveryDays: 5,
                              revisions: '5',
                              features: serv.features && serv.features.length > 0 ? serv.features.slice(0, 5) : ['কাস্টম ডিজাইন', 'এসইও ফ্রেন্ডলি', 'স্পিড অপটিমাইজেশন', '১ মাস সাপোর্ট']
                            },
                            premium: {
                              name: 'ফুল এজেন্সি সলিউশন',
                              price: priceNum * 3.5,
                              deliveryDays: 7,
                              revisions: 'Unlimited',
                              features: serv.features || ['সম্পূর্ণ কাস্টম আর্কিটেকচার', 'ফুল ডেপ্লয়মেন্ট', 'ভিআইপি সাপোর্ট', 'সোর্স ফাইল']
                            }
                          },
                          tags: ['Official Agency', 'PTENit Guarantee', serv.category],
                          status: 'active' as const,
                          offerBadge: 'অফিশিয়াল এজেন্সি'
                        };

                        return (
                          <div
                            key={serv.id}
                            onClick={() => {
                              setSelectedGig(servGig);
                              setSelectedPackage('standard');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1DB954] dark:hover:border-[#1DB954] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition duration-200 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-3.5 group relative overflow-hidden text-slate-900 dark:text-white"
                          >
                            <div className="space-y-2">
                              <div className="relative h-24 sm:h-38 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                                <img
                                  src={serv.thumbnail}
                                  alt={serv.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 bg-[#1DB954] text-white text-[9px] sm:text-[10px] font-black rounded-md shadow-xs border border-white/20">
                                  অফিশিয়াল
                                </span>
                                <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 bg-slate-950/85 backdrop-blur-xs text-amber-400 text-[9px] sm:text-[10px] font-black rounded-md shadow-xs flex items-center gap-0.5">
                                  ⭐ {serv.rating || '5.0'}
                                </span>
                              </div>

                              <div>
                                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#1DB954] transition line-clamp-1 sm:line-clamp-2 leading-snug">
                                  {serv.title}
                                </h3>
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                  {serv.shortDescription}
                                </p>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                              <div className="min-w-0">
                                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block leading-tight">শুরু মাত্র</span>
                                <span className="text-xs sm:text-sm font-black text-[#1DB954] truncate block leading-tight">
                                  {serv.priceText || '৳১০,০০০'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedGig(servGig);
                                  setSelectedPackage('standard');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 bg-[#1DB954] hover:bg-[#19a34a] text-white text-[9px] sm:text-[11px] font-black rounded-lg transition duration-200 shrink-0 shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <span>অর্ডার</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. PTENIT ACADEMY COURSES BLOCK (২টা কলাম ২টা রো = ৪টি কোর্স) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 truncate">
                          <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>🎓 PTENit একাডেমি কোর্সসমূহ</span>
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('courses');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                      >
                        <span>আরও দেখুন</span>
                        <span>→</span>
                      </button>
                    </div>

                    {/* 2x2 Grid (4 items) */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                      {courses.slice(0, 4).map(crs => (
                        <div
                          key={crs.id}
                          onClick={() => {
                            if (setActiveTab) setActiveTab('courses');
                          }}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 hover:border-[#1DB954] transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-3 group"
                        >
                          <div className="space-y-2">
                            <div className="relative h-24 sm:h-38 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                              <img src={crs.thumbnail} alt={crs.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black rounded-md sm:rounded-full shadow-xs">
                                {crs.level === 'live_batch' ? 'লাইভ ব্যাচ' : 'সার্টিফাইড'}
                              </span>
                              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[10px] font-bold rounded">
                                {crs.category}
                              </span>
                            </div>

                            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#1DB954] transition line-clamp-1 sm:line-clamp-2 leading-snug">
                              {crs.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">
                              মেন্টর: {crs.instructor}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                            <div className="min-w-0">
                              <span className="text-[8px] sm:text-[10px] text-slate-400 block leading-tight">কোর্স ফি</span>
                              <span className="text-xs sm:text-sm font-black text-[#1DB954] truncate block leading-tight">
                                {crs.isFree ? 'ফ্রি কোর্স' : ('৳' + (crs.discountPrice || crs.price || 0).toLocaleString('bn-BD'))}
                              </span>
                            </div>
                            <span className="px-2 py-1 bg-[#1DB954]/10 group-hover:bg-[#1DB954] text-[#1DB954] group-hover:text-white text-[9px] sm:text-[11px] font-black rounded-lg transition duration-200 shrink-0 shadow-2xs">
                              বিস্তারিত →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. VIDEO & ANIMATION CATEGORY BLOCK (২টা কলাম ২টা রো = ৪টি গিগ) */}
                  {(() => {
                    const videoGigs = gigs.filter(g =>
                      ['video', 'animation', 'editing', 'reels', 'youtube'].some(k =>
                        g.category.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)
                      )
                    );
                    const displayGigs = videoGigs.length > 0 ? videoGigs : gigs.slice(16, 20);

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                                <Video className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>ভিডিও এডিটিং ও অ্যানিমেশন</span>
                              </h2>
                              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[9px] sm:text-[10px] font-black rounded-md border border-rose-500/20">
                                প্রায় ১২টি সার্ভিস
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                              ইউটিউব ভিডিও এডিটিং, শর্টস/রিলস, মোশন গ্রাফিক্স ও ২ডি অ্যানিমেশন
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('Video & Animation');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                          >
                            <span>আরও দেখুন</span>
                            <span>→</span>
                          </button>
                        </div>

                        {/* 2x2 Grid (4 items) on Phone */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                          {displayGigs.slice(0, 4).map(gig => (
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
                      </div>
                    );
                  })()}

                  {/* 8. SEO & ORGANIC GROWTH CATEGORY BLOCK (২টা কলাম ২টা রো = ৪টি গিগ) */}
                  {(() => {
                    const seoGigs = gigs.filter(g =>
                      ['seo', 'growth', 'ranking', 'traffic', 'backlink'].some(k =>
                        g.category.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)
                      )
                    );
                    const displayGigs = seoGigs.length > 0 ? seoGigs : gigs.slice(20, 24);

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h2 className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                                <Search className="w-4 h-4 text-teal-500 shrink-0" />
                                <span>এসইও ও অর্গানিক গ্রোথ হ্যাকিং</span>
                              </h2>
                              <span className="px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[9px] sm:text-[10px] font-black rounded-md border border-teal-500/20">
                                প্রায় ১০টি সার্ভিস
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                              গুগল ১ম পেজ র‍্যাঙ্কিং, টেকনিক্যাল এসইও ও অর্গানিক ট্রাফিক বুস্ট
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('SEO & Growth');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[#1DB954] hover:text-[#19a34a] font-bold text-xs sm:text-sm transition-colors cursor-pointer hover:underline shrink-0"
                          >
                            <span>আরও দেখুন</span>
                            <span>→</span>
                          </button>
                        </div>

                        {/* 2x2 Grid (4 items) on Phone */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                          {displayGigs.slice(0, 4).map(gig => (
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
                      </div>
                    );
                  })()}

                </div>
              )}
            </div>
          )}

          {/* DEDICATED FULL-PAGE PTENIT AGENCY SERVICES TAB */}
          {activeSubTab === 'ptenit-services' && (
            <div className="space-y-3 sm:space-y-4 font-bengali animate-fadeIn pb-8 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
              {/* Mobile View PTENit Services Return Bar - Clean White */}
              <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>মার্কেটপ্লেস</span>
                  </button>
                  <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    অফিশিয়াল সার্ভিসেস
                  </h2>
                </div>
                <span className="text-[10px] font-black text-[#1DB954] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                  {services.length}টি সার্ভিস
                </span>
              </div>
              {/* Desktop view header */}
              <div className="hidden sm:flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95 shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                    <span>সকল সার্ভিসে ফিরে যান</span>
                  </button>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    🏢 অফিশিয়াল আইটি সার্ভিসেস (PTENit Official Agency)
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  মোট {services.length}টি অফিশিয়াল সার্ভিস
                </span>
              </div>

              {/* 2 Columns on Phone View (All Agency Services on Full Page) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                {services.map(serv => {
                    const priceNum = typeof serv.priceText === 'string' 
                      ? parseInt(serv.priceText.replace(/[^0-9]/g, ''), 10) || 10000 
                      : 10000;
                    
                    const servGig: MarketplaceGig = gigs.find(
                      g => g.id === serv.id || g.title.toLowerCase() === serv.title.toLowerCase()
                    ) || {
                      id: serv.id,
                      sellerId: 'ptenit-agency',
                      sellerName: 'PTENit Official Agency',
                      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                      sellerLevel: 'Official Top Rated Agency',
                      isAgencyStaff: true,
                      title: serv.title,
                      category: serv.category,
                      description: serv.fullDescription || serv.shortDescription,
                      thumbnail: serv.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
                      rating: serv.rating || 5.0,
                      reviewsCount: serv.reviewsCount || 48,
                      packages: serv.packages || {
                        basic: { 
                          name: 'বেসিক সলিউশন', 
                          price: priceNum, 
                          deliveryDays: 3, 
                          revisions: '3', 
                          features: serv.features && serv.features.length > 0 ? serv.features.slice(0, 3) : ['কাস্টম ডিজাইন', 'রেসপন্সিভ লেআউট', 'বেসিক সাপোর্ট'] 
                        },
                        standard: { 
                          name: 'স্ট্যান্ডার্ড প্যাকেজ', 
                          price: priceNum * 2, 
                          deliveryDays: 5, 
                          revisions: '5', 
                          features: serv.features && serv.features.length > 0 ? serv.features.slice(0, 5) : ['কাস্টম ডিজাইন', 'এসইও ফ্রেন্ডলি', 'স্পিড অপটিমাইজেশন', '১ মাস সাপোর্ট'] 
                        },
                        premium: { 
                          name: 'ফুল এজেন্সি সলিউশন', 
                          price: priceNum * 3.5, 
                          deliveryDays: 7, 
                          revisions: 'Unlimited', 
                          features: serv.features || ['সম্পূর্ণ কাস্টম আর্কিটেকচার', 'ফুল ডেপ্লয়মেন্ট', 'ভিআইপি সাপোর্ট', 'সোর্স ফাইল'] 
                        }
                      },
                      tags: ['Official Agency', 'PTENit Guarantee', serv.category],
                      status: 'active' as const,
                      offerBadge: 'অফিশিয়াল এজেন্সি'
                    };

                    return (
                      <div
                        key={serv.id}
                        onClick={() => {
                          setSelectedGig(servGig);
                          setSelectedPackage('standard');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#1DB954] dark:hover:border-[#1DB954] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 transition duration-200 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-3.5 group relative overflow-hidden text-slate-900 dark:text-white"
                      >
                        <div className="space-y-2">
                          {/* Image Thumbnail with Badges */}
                          <div className="relative h-24 sm:h-38 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <img
                              src={serv.thumbnail}
                              alt={serv.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 py-0.5 bg-[#1DB954] text-white text-[9px] sm:text-[10px] font-black rounded-md shadow-xs border border-white/20">
                              অফিশিয়াল
                            </span>
                            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 bg-slate-950/85 backdrop-blur-xs text-amber-400 text-[9px] sm:text-[10px] font-black rounded-md shadow-xs flex items-center gap-0.5">
                              ⭐ {serv.rating || '5.0'}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#1DB954] transition line-clamp-1 sm:line-clamp-2 leading-snug">
                              {serv.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {serv.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Pricing & Action */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 block leading-tight">শুরু মাত্র</span>
                            <span className="text-xs sm:text-sm font-black text-[#1DB954] truncate block leading-tight">
                              {serv.priceText || '৳১০,০০০'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGig(servGig);
                              setSelectedPackage('standard');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 bg-[#1DB954] hover:bg-[#19a34a] text-white text-[9px] sm:text-[11px] font-black rounded-lg transition duration-200 shrink-0 shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span>অর্ডার</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                
              </div>
            </div>
          )}

          {/* DEDICATED FULL-PAGE PTENIT ACADEMY COURSES TAB */}
          {activeSubTab === 'courses' && (
            <div className="space-y-3 sm:space-y-4 animate-fadeIn font-bengali pb-12 pt-1 sm:pt-0 bg-white dark:bg-slate-900 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl sm:rounded-none border border-slate-200/80 dark:border-slate-800 sm:border-0 shadow-xs sm:shadow-none">
              {/* Mobile View Courses Return Bar - Clean White */}
              <div className="flex sm:hidden items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>মার্কেটপ্লেস</span>
                  </button>
                  <h2 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    একাডেমি কোর্সসমূহ
                  </h2>
                </div>
                <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full shrink-0">
                  {courses.length}টি কোর্স
                </span>
              </div>
              <div className="hidden sm:flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95 shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                    <span>সকল সার্ভিসে ফিরে যান</span>
                  </button>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    🎓 PTENit একাডেমি প্রফেশনাল ট্রেনিং কোর্সসমূহ
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                  মোট {courses.length}টি কোর্স
                </span>
              </div>
              {/* 2 Columns on Phone View, 3 on Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">
                {courses.map(crs => (
                  <div
                    key={crs.id}
                    onClick={() => {
                      if (setActiveTab) setActiveTab('courses');
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 hover:border-[#1DB954] transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between space-y-2 sm:space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="relative h-24 sm:h-38 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img src={crs.thumbnail} alt={crs.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                        <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black rounded-md sm:rounded-full shadow-xs">
                          {crs.level === 'live_batch' ? 'লাইভ ব্যাচ' : 'সার্টিফাইড'}
                        </span>
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[8px] sm:text-[10px] font-bold rounded">
                          {crs.category}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#1DB954] transition line-clamp-1 sm:line-clamp-2 leading-snug">
                        {crs.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">
                        মেন্টর: {crs.instructor}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] sm:text-xs text-slate-500">
                        <span>📚 {crs.lessonsCount} ক্লাস</span>
                        <span>⏱️ {crs.duration}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <span className="text-[8px] sm:text-[10px] text-slate-400 block leading-tight">কোর্স ফি</span>
                        <span className="text-xs sm:text-sm font-black text-[#1DB954] truncate block leading-tight">
                          {crs.isFree ? 'ফ্রি কোর্স' : ('৳' + (crs.discountPrice || crs.price || 0).toLocaleString('bn-BD'))}
                        </span>
                      </div>
                      <span className="px-2 py-1 bg-[#1DB954]/10 group-hover:bg-[#1DB954] text-[#1DB954] group-hover:text-white text-[9px] sm:text-[11px] font-black rounded-lg transition duration-200 shrink-0 shadow-2xs">
                        বিস্তারিত →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                    {/* ORDERS & LEARNING HUB VIEW (FULL PHONE VIEW & DESKTOP SUPPORT) */}
          {(activeSubTab === "my-orders" || activeSubTab === "my-courses") && !selectedGig && (
            <div className="space-y-4 font-bengali animate-fadeIn pb-16 pt-2 px-2 sm:px-0">
              {/* TOP HEADER & UNIFIED TAB BAR (OVERVIEW, PROJECTS, COURSES) */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {/* Title & Top Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#1DB954]" />
                      <span>আমার ক্রয়কৃত সার্ভিস, প্রজেক্ট ও কোর্সসমূহ</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      পিটেন আইটি ক্লায়েন্ট হাব — লাইভ ট্র্যাকিং, এসক্রো নিরাপত্তা ও সরাসরি সেলার যোগাযোগ
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPostProjectModalOpen(true)}
                      className="px-3.5 py-2 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>নতুন প্রজেক্ট পোস্ট করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSubTab("gigs");
                        if (setActiveTab) setActiveTab("marketplace", "All", true);
                      }}
                      className="px-3.5 py-2 bg-slate-100 dx��}�oǙ���+&�Ϡ�"��(v��^eQ%餹 �W��e�ew��\��%w�E���7_�|FmY�:��Z8���pA����������(�4&��ܝ������<oN���V�zN�O/,���ħ�੎/�Ο��#w7�e�9t�?��[��!� �G���)�z 
�A؋z� �GA�š�Dn �7���0�P|�S��`ﻃ���=9x�냽;�n��;��>Ň��E�=x�����.���l����(����Yg�;���������߃�h�σ��(��>����}y~���`}�;v� <��~�_�b��l�卵jc��Q��G�U���7��-f����X�
mF��繝�<8
���ܸ>�d������\Ԑ[�nP뀳gϢ����s�^]��hԁ'�}�祯r���w��i�p�a���w%�t��X 甿���^pɉvJ�ހ��́�YxႡ�9^=���y�G�݀��M���g 7PP�(�:@�s�p��gg�|�^q�/�%�"����]Ћ�~Xl��J�iF����-7���u��%��t��w��(���/�m4^[N �QqqFG?r�ODOXa}9�m�����W�r��Bv�jϽ6�\��K�
��]��ė�������kzv�'������G[�-
3>��r�$J3r�Qx��\E�o�G�2��pM���`�U\�]8�pF��e�d�1a�}ʁ=���b���"�̋���ʏ�	S|<V�� ���Ǐ��v��+�dݰJo $qR����K8�Nrÿ\ہ�`z��+��Яz�^ם��(Zs-�	:"9]+������7���{J�93�3�<��8~\ØO;�l��7�\ȡ u���s�#�'�uw�ߝ�B��2�C��o��J
w�bDa�;� ߇3y�ҪvEL��LȘ>����'�w�y@8����pW ������z�v�	��9��$�����W��^�TO�zqa����"�/�G6�"��_�JI�5�U�E.z���0�'�K$c�MC��,p�hv����>�_^�%P������TU�a�t��?H�~1p:#e�N��k�g������sĘ6/g���3s��j ���?A�
���w@��v=�����}������N��q�j�e��i^@��I͋c!SaX��0W�B
^�s�uO��o��\�S�q�8&8�2li�+Q�3z����������hݡR磯�⅐�'�쟰�� �̿kPX�O����l.Y%h�Tj�j��@�o���!ɨ�w����6�5>C��}x���'�v���#��w��aS���~��t����Z��*��6�pi�/�]�65�Vֻq� ��b��������P���р����G�7����;3�d��.��I�d�3���Cύ�N��;-�2mA����p_\��v��ԓ&��+;�!|3𱒕�A��
��'$7���r=x���Z��h5կ9Ѓ7��u�,�N��绫IQG�V�9� �zt�#r�s�~��F�cZ�>˜,�0]��=˕��午t-H���+�:,R���	��T"F�ۊ�?�{���� o��A�Y������	�/�X�j���C�w:�ף����(�df����>�D�[����<�*�P#��ڞ�$������u̝.��Wt����tb��H�U"�5�F��m�ͬ�S���(Af����}�wM=
` :�� ���ώ��L��=�� 1��h�2�m ��AZ�H�D�yȒ�Yz�7p�z)#.HB�ߓ�tZ�0",���<�v��Z�)ɭ�m�C�;Md)�/Čː>~�Y#��o�� �	1]C�����䜿�'*(X�Oq��Jf7ri�*�g9�c����H�J��O��ta���`�eBm�Sظ��YUc��#��of��h�(��%ŲN�H�\�D ��rx��Y�Pr!-���OӲ� �D�ƿ��@DY��R�� 5�ug���Y�N�?�6>�U?�V���A��K��G������Uk�T�}�y[��Cs�t����n���s�������pw)9}�_@-vavN�!� ��h�/B7|� �/��`��dq���E�۾�N|����e���@���_�!����]����]O�1j<�b��-��{&{�M���=j1ޣ��5�V��"�"��u8�3J���[L=ʴ��Y��	���@a�Y0'�q�z�-�+�L{^W܄U/A;ӿ�����ܳ��>:���
3[����-�f~���fj������d�avv%�b����k������{�/<&�Ae�c|i�X���}G�j0�5�e&QJ����,g02��D�ya�H��\��y�ƒ�q`���(��h��EzO��	���SG��S:%x+���x�Žh��������\�jeR��mj��/��d5^��d&�	���@x�S)v�`�Ll�1�g/�[��g�"`��8��=��X����9�������b��b��e�/t.�3"��J���34 �?N�{������R�ݣ[@é!�Z��Ҥ�n�i�!��`�Q��j���f��qT��rm��P!=X�/Fnpj�r�?�O�)��\s�
\6��TP���??�Ņ �� �퐋�8H��Y;�}�uVc!�;Q{�ؚA!���Y�uz��7�!mR�	-�z��F#|0�v���!ki8�G���z�G��Ӌ�o���[G��6��������C�V���c�!4ێ��(��2MSYm��V�)�� Ykxb5�a�����ƃ#��ėL� ٵ"��uzm�stS�<�z��@*㘴˨?M��=���[{�ܭ��v���^|<$q��i6|F�p6�Q�;�݂�����y��ݦ૚��gd�iH0�ԐH'4��3�ǆA4�S�_MlA�5�I�d�mJ���`cj���53,�&��"u����Q*[a�+[+��ֵ��I��F�g��F��+�^Sk���ao�=�t��;�wzb}Hz�lm޳��V�Ԇ����F'�1��ϩp����& �Oh�t)�-�|o#߂�yt���E��깬���[��ՠ��ZC"}o���>dh�v�C�V[wCi���e��W9]\�#�S��Q���_`�9�mnI��_���X��w%��O��!���)!��c��r/i5t����,��@=�gS�A<�gx�	�VNi�5��Q��/���Z~Ѕp	��h$�}%'G´��`BF������0*.�p��2��l|	��C�.����,�=|[-n$�E,YL��of�[\A>PK�ާH�nS��2Q�i��nH*A����4!��U�%��I}C��n�g(�����Y f�pj�h�9;ϔ��7���i�&\9�S^���}��˴����},�s���f;�kN�������CA��Xk��fu}�.�/V�z�Bk�j��*8�ʭ*�T[[[�΁�F��N"ǹ�Mp�r�U� ����[����n�L�x�P1�I��C7:���C���o�1�¢�$�d��٥FL�h�hS�|!��93N�>�Q��h4[�d1���>?�������J��Fa#�%���{>P��R@�̎oPl@�;k�q��i��"~a���9��W��1_Y�z�Ԋ�}=�K�E�,)��Bij�	���r���ƈ�\ݔ���0�Yђ~�[�t�ޠ[���x���䊟;��f���N;�o���ay|L�O��+��oHO�c
� �-���dQa���k�he�-z����绸Y!8o~��>uJ�>�߶��D�JTN��I�����k��p�b�o�S�c��Bq�ع���\�>R�5cAz�TQ�FA�PA�c�h�R�<�3��m|(�Sw"�H���#)�@{�7��^���_���0�8༃�n�C�O$���ߓpӃ��a0M��"F�Ȭ>�$,�^F_9b�>�%�-vFNm��b?SR�6��<)��֜9�.[~BJX��q�X�7jj�5Ш��u/PձYp��_� �d�<Q�
J�̜j�|��
��q�d4�����gf�]f�x�f�� ���t�yP���*�<q,�O�	',�R�&����kEb}�Լ�O�I�x�k?�i���7�F��I�V�W�ep.�R�.��]�K!�	�gS�`�q�H��{�`��s�~b���O�t��Lg8�`������B�p]^�|]�����nf�/���b�RYOW�`h�֐av�Ӄ˷�ŭ l~_L��'��-�Ø��Cg7$�#��s y�BM�-,́E��py8d�r�i��2T>�W���ʊ4[�"(�<e�@|���)�u�}wCq���ϱ��Yfj�#��LivKԜ�L� vLv�U��́������b�����3f�Q����>(�4=Ƅm,�Yͩ�j�Ǡ��75�bV䢉��H���?���d�i�r��8zޞ�~d)��w�@��HfM�z���n�'�Q���Z�?^<�n�˜�#���8凗�&1�a���A)9�VJdt���V ��M�o�k,m�5�S�� ��.**`�s������N���iR�����>�OKW�&�x�3�Զ#�F��Z��H�6����Iv`�ZtCR��tN�q��J�O� c�֙PR���J��lU7@��a���ΌU�����}m�����L����3� �+簃�\�T�At�^k��a����ߤ0r��u�َ�(�O/x*h��~G�(vQ&ɉ�(�,LP�����\%��*�hZ��˞�G�2������+km��B�-I�Z�X�m���6`ý����-aA1D���0V��<S�'�Z�,YJ��ZF�@MsBE�(��v�E����)�!y��;.S����*n���M$�ϵL�{�*�Q����>�˚ɠD��ŜFy�yHof=
��b�%�c4�.�e�T��BV'꣄c+�]D����tծc��j�\��r�@�d(gx� )�α15�X$+��C�J�[1d�L�Z�X0��v�i&m=���nk#�'m_�ԣ�\�yn���@%+�j�k;e�گjY�q"Ft�K���}���ON�a�ơ;@��ao 	�`#��s���E�c��u�]Mн5��9ϭ�����"Z��M7|6=C��uoЋz�w	2�۸�%�g���)s7��8�sh�x��69��`S{��hS��xr�&���=��C��O������yd'e������J[N�V�{W��,�B�R�X[2�xbe���eݳk�Z꧋����LP�Lh)�h��AL�6��#��Ugx�������K~��G����Z�&8yzŠ�׃I#c�V(��w�;���<$�۴�zs<s�����V �;X�Wv��o�pqW���a�^E�ڴK��/�^�\W���Vv�c�x;��L�c���6�c�~|S���I=f>��aH4�0�N��B���G9��}Kk�5K�Z�����ג*g���������1ip?�}:U�T��3�k�dVY�d�U�kT�F'�>_��]@=���$-2�엕U��kr:�g�@6�����_�Lv���Q鮓qFj�_�q�y@{�D�qM�����DP��*G���96X�F����=٫CK��w��w�%�H8�����w�����&).![[=�;�P�֝Z�]a�fO���{�;��$	5O���
+q�d��4ŏF�Liq�>�?f���g��Ҙ?%���1����~Z6�.�p��\.�׃�bp}Ï� �c� ��Է��(�\���{���/��v꜆���b�s��> ��P�|��L�I럣�"�����:Y}��=��"&��%2m|q2�3�>�Iпw9��G�M
%��0 �cm���e�;
32-لN��_���Ā�USP�w�T@1y9����٥���ƨ��Nҹ�tX9ܖ��޿���������9��/�G,w
e���'�m���YL�����N�Ne9��I�16����F��b����c�-P��.�����IJb*����l���}��&�2_i� K>H���l���V>���>��T��f�j�����8�ԏ���Ý���(.ÜP�P��C��s�>�}�鸵�����O�Gm�L�O;�r��	(MR���pB0�&�ؽ߉~�y�߬}z��0͢�0/�=�6J����%�N!�|eA/3��dݜ���Ñh�<
�m�l�[K�LyTZk-_=L��p�N>��2+����]�&��gL��W�}K�S�9m�S����|��.�
(oT���<
w�K�,��z�|��P��$/c-������?�
cF�WmY���u�^��u�])�}���1���D�KF����9|_�ڪ�L�ce�C٫]��f��._,66j�Q����9Ac��nW�8�j�ơ���J�r�Z�t˯�*AK_r��*���g,��;b���Mu3�N���]�����C�,����~����'���P�Ę����}G�2G.��M)
92.���_23�2Hs�6n�*��Vu���6������/7��&hV+�Z}#O����>�HRJm?i&ɬ�ƹM�FH�
r���Iѧ3�3�N#�(3$ÜN����<Q��&�bw${g�
��>��L���f�饦�����N0��(�o�z�-w���yMa�ɬ$���%�L���{Z�՜N2��`���c��*V�����2��ˠ��̡PJ�6*��ޔ2y��re�L�}�&L��>�
2d��p�Ku\�w:J��	�c�$p>"��Y!��� �O����JE�6��I��h5(K k����<�����Rq���
���J�)����hJ�,�>P&�țQ��e6	;�Lf	M���J #�V�+H��X���;��S���X�T]�Ι4��G؉*�A�p�"튒�vJ�
��{x!p]�B�f/.�gH��r�迏��&V���6�>����CpF�E2;�i����yc�����������p4�2Sq��c	�����,Y�'+9���nXp�lU�T��X�Ǩ�[_���k�3	����5p�v�	�����F�Um�J_����I\�7�z��Ex]m/W�-p�Ym4��cG��B��й�v~�+��J������\�uӺ�^���3/�A׮;�:^Or�-����L8X�*���Ax�u�<L��n��h�?���)�{H���L�fY� �#�|
�v��e�(厢H���Rb&C������؉���Y�87�>��gN ���Ҡ�Z��20;K��8d�P�o�1�JA{�_�#��$�ê��r�jY�v�Β��Ku��j��?`a�ϩ��Y�����9$j^5"���W|":bkD9͜�Nkń,��J�U�i�%������c�W� ^QOȂ��>���n�V��x�Bk�E."�GQ^^�CV�p�禶�Đ��ҊM�m�k<�K���U�@gcĀl� �_�%�߭�b������m�n��7�Zs�na&��]�c*�v��(�mT���� �ƫ`al�;�U�2�}ߏvfY�"�P���X8�]Ϧ��	ώ������\��!�'��w)70�����L�ʌYt�E��M�����ȰxR-O(6s�d[�(��*��X����W4����Er�%���5�۴&���]�W$�����G^�U��¦�>����hS�N|��]����x"���Đ��[Ĵ�[fA��|�	���}����"�G�-ޠ�gk�*g��i�k���
x5
5�eJ�⌏�/���CK��t5g��i��ź.��$�EVVq��*�֛P��_�P����P�����36��jm�.����X�w�t*IV��ؤc�</�~���ۅ�Mo o�:�/>���pֱ���	�!�#`�0K�r�P�F� i��/O:�xBp��>e̊_��o�B�so�:]ܖQ�X�*K���?ɱ� �~�d�'���&k����Ķ=x@uxa~��}��Ybp�;ŏ�Y���I�&RUr�Ati�_-��'˩),z����M�W�G�s���ai˴�J�h'���%�@�[)02;�@�`�e�-����ؐR�� ��s��}��*LT
?�/X��gB�d�;!�'�!P��ƹ��:@�V�?�ǟ���9�$���r`�'5��y���k�Ob���T��	�_�ߐ3K��C��V����.]�z�T��"9__�(��@��y�u"R�ت.�
��$m1-9��J:�U����'IS2���=)	�΢/��#TW��yu5�pGm(2vh��J�Մ&��G�d�i��3�߸��)�k�Yc�n�QB�Fyﴦ@�0�K,g"$v��3bo����7��#�3�rΑ��/�j�
P��;���X�Ri�w�=�T����?��	/ T۸P�O�)�Lg\P�TyB:�	�
��-d�1��:|o��̋���:����9����i5�"�&Ŗ��oY*X�:W��a��6�kɳ���0����I�B��j�Mu�Egs'�kM�lKѹJ欚��e��t�z1�OQ/��H6J���>0�5Nq�G�{��x���)��Ib��t��iN�\kU/q���S?d��|VX�Vlú�!*3�ڂj�d�L�� 3ڌ]�=��	�A���������Իeρ)�47|zMG�y��ؠ��ۭ�C�]k�Wi���4C�� ˄�=��L�(�~H,W-��b�oR��Y���_������ҁ�P[�-���NeR�.�ް��؇�ۛi����U@H�F,hRŔ<�,��J�ɳ[��F�L­*�5�M���)�D���3��hP�Y��Fae:�QWݤ�a͝��upp�!3��E��	��~���d7c[�}$(��[>%%�N�Fؓ�s��:h1_i5~V<���{o^ɷ���FCz
ū�����R9��P�O'�/�r�8�h��ϸ���~-�(���I]���`.�'�o��z�<O�m�R��ϓJ��f�%n�?⩘�2e����WLvj?R��x�^o٘2�c��k�{�x2mߘ��5S_�!�G����0+��	��RJx>�N��}$��X��l2۱!5�F�Q�C���M\,g�1�7�
�%-ƍ3��y�ֹ�%Z)^��?=��d�y��=�+K%P��l�?��9ޏ�Fu�ZnVA�Yi�?L�䇊��9��ʬ�o�Gn��w�h�G6-n�����Ǉ�wزݚ�[
�;ü��&J��Y׈㼅�l� +f�%J��En�%1)�=�m��b�v�Z�:rΪ*Z�zٖ��8:3�F�e�����Y-σ=bA̖�k�U*jP#�Y�	�㠸�(��	��t�S�<ȍT-reӄX:"�h�{�����2�a"��
�{�q�F����ʙ�f\���ӯ�p��!W��m�δ���Xa?�dsw���>���l��� �s��9�/��(�j�Q�Zi�����F�)b�xΖ�eZut�<�=%
����=���V��E��*����g�q/&VS�����X�+s��'8������+�Q�8�����=V�˳���p��
"'��㗒>�sH�����(]mh*� �obgP��pw9iΔ�^�9���-�*8̏����)�4a�&���:�n��r��%8���W'��&�}O���U��Y���KՍ֫�a�Л�����(�=�	\G1M�-<;^V��U�A`�s��`K�k}TGx�u��%?����`7�nT�M+�;؁#���%�z�u��q��~f3�k����R��"��,���a�
).*�pY��j���No��G�*ڥ�K�A����(U��M��B ��;'�w���<�rr�G�I��+~����S�/t$��H�O��9����G�<��Q�� �kj���QgMsC-��7G���-�	��66	����]H3�R�Ml;^��B�jaa�p��K�M�Z?z#au�����.����D6�F��8�F
 R�r�
Xo��7���
~6p-�J����"����qY�WT�g��\���	�xpӆ|Sk��9��s/U��V��iѝ�p�]U���c�= �<�R}�����5M��Հ��Å6�!��H��V���qNcXZ}�hS+�%�u)��Q1��Ej%*�#[����i�|+��Ů�R_��jJ� ��M�'�]��/����x����!�F2�Ohh?��'���L${��ѻ$��eXLļ(U�WX���lEn���M����k�aU�k����Fx�٘Ҳ4���Ȟ�(�ʦ Y�]��%��3S�ġ����ʴ/KK�%�M��� c��uy�v�V]�ʍ�T[���J4�-d�iR��P�_�,WZ`���F�$K<Η+?Yk�7Ae�V�	(_nՋ��z�*fI��Kq&��!<���ȝRހ�i~Q3�F��\���}�t��?=]�^{c�'-��ӬRU��8M�ּ�^f A5�-�	�Z0-�*�M2S"���r�{��Q��)����r;=�Vi�iݔǑ�B{�bȑ�G0!�^��*����1�<"��+0i9t�=�$e,�)��F��0Av�!���Ƌ;�B�OJ.
��.l�ls�s�^��A��5�GX��s�2���C�Y�b	4��Mwmp���#�{�����)���=��A�t=ם���H񞄓���ᖿ�4'�����q�ӈ�����������2��J��7P��
-΁D�������:[�}�i#�L�/<+Agop|C�6D�,��g��UF��Iֹ�o�9h��$�t��D��	�6
�'?~�d�T�� ��	�!�׏��N�_�,��A2�ٗ�IΚ�GD�)љ��sG"��))��-q�gx_$��= ��CF�/��l��VcgJ��l���~ԧ�]u��b��ῤN�
°��+���8�!���>�8�0��Kn�0��]��������.����n��������|za�ԅj��=4�U3arDBi�:����R�l���;���5ԃ��Ӷ5�俧��.��`�к'jO�xv���o�|����ݡD��n;#/�y���}��   �� �y<