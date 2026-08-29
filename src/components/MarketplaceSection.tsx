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
  Radio,
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

const bengaliDigits = ['‡ß¶', '‡ßß', '‡ß®', '‡ß©', '‡ß™', '‡ß´', '‡ß¨', '‡ß≠', '‡ßÆ', '‡ßØ'];
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
  const [displayStr, setDisplayStr] = useState('‡ß¶');

  useEffect(() => {
    const isBengaliInput = /[‡ß¶-‡ßØ]/.test(value);
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
        title: cp.serviceTitle || '‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶ï ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶Ö‡¶´‡¶æ‡¶∞',
        category: cp.category || '‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶ï ‡¶Ö‡¶´‡¶æ‡¶∞',
        buyerId: cp.customerId,
        buyerName: cp.customerName,
        buyerEmail: cp.customerEmail,
        buyerPhone: cp.customerPhone,
        sellerId: cp.assignedStaff || 'pending_expert',
        sellerName: cp.assignedStaff || '‡¶∏‡¶ï‡¶≤ ‡¶è‡¶ï‡ßç‡¶∏‡¶™‡¶æ‡¶∞‡ßç‡¶ü‡¶¶‡ßá‡¶∞ ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠‡¶° ‡¶Ö‡¶™‡ßá‡¶ï‡ßç‡¶∑‡¶Æ‡¶æ‡¶®',
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
        budgetRange: cp.budgetRange || '‡ß≥‡ßß‡ß´,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ß©‡ß¶,‡ß¶‡ß¶‡ß¶'
      };
    }).filter(Boolean) as MarketplaceOrder[];

    const combined = [...marketplaceOrders, ...convertedCustProjects];
    if (combined.length === 0) {
      return [
        {
          id: 'ord-demo-101',
          type: 'gig_order',
          title: '‡¶´‡ßÅ‡¶≤ ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï ‡¶á-‡¶ï‡¶Æ‡¶æ‡¶∞‡ßç‡¶∏ ‡¶ì‡ßü‡ßá‡¶¨‡¶∏‡¶æ‡¶á‡¶ü ‡¶ì ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ó‡ßá‡¶ü‡¶ì‡ßü‡ßá ‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶Æ‡ßá‡¶®‡ßç‡¶ü',
          category: 'Programming & Tech',
          buyerId: currentUser?.id || 'buyer-1',
          buyerName: currentUser?.name || '‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞',
          buyerEmail: currentUser?.email || 'buyer@ptenit.com',
          sellerId: 'seller-1',
          sellerName: '‡¶∏‡ßã‡¶∞‡¶æ‡¶¨ ‡¶π‡ßã‡¶∏‡ßá‡¶® (Senior Web Dev)',
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
          title: '‡¶Æ‡¶°‡¶æ‡¶∞‡ßç‡¶® ‡¶á‡¶â‡¶Ü‡¶á/‡¶á‡¶â‡¶è‡¶ï‡ßç‡¶∏ (UI/UX) ‡¶Æ‡ßã‡¶¨‡¶æ‡¶á‡¶≤ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® & ‡¶´‡¶ø‡¶ó‡¶Æ‡¶æ ‡¶∏‡ßã‡¶∞‡ßç‡¶∏ ‡¶´‡¶æ‡¶á‡¶≤',
          category: 'Graphics & Design',
          buyerId: currentUser?.id || 'buyer-1',
          buyerName: currentUser?.name || '‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞',
          buyerEmail: currentUser?.email || 'buyer@ptenit.com',
          sellerId: 'seller-2',
          sellerName: '‡¶§‡¶æ‡¶®‡¶ú‡¶ø‡¶≤‡¶æ ‡¶á‡¶∏‡¶≤‡¶æ‡¶Æ (UI/UX Designer)',
          sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          packageType: 'Premium',
          amount: 8500,
          adminCommission: 850,
          sellerPayout: 7650,
          paymentMethod: 'Nagad Escrow Security',
          transactionId: 'TRX-NG9921104',
          status: 'in_review',
          deliveryNote: '‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡ßç‡¶∞‡ßü‡ßá‡¶° ‡¶ì ‡¶Ü‡¶á‡¶ì‡¶è‡¶∏ ‡¶Æ‡ßã‡¶¨‡¶æ‡¶á‡¶≤ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™‡ßá‡¶∞ ‡¶∏‡¶Æ‡¶∏‡ßç‡¶§ ‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡¶ø‡¶® ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶ï‡¶∞‡ßá ‡¶´‡¶ø‡¶ó‡¶Æ‡¶æ (Figma) ‡¶≤‡¶ø‡¶ô‡ßç‡¶ï ‡¶è‡¶¨‡¶Ç ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ó‡¶æ‡¶á‡¶°‡¶≤‡¶æ‡¶á‡¶® ‡¶´‡¶æ‡¶á‡¶≤ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ö ‡¶ï‡¶∞‡ßá ‡¶¶‡ßá‡¶ì‡ßü‡¶æ ‡¶π‡¶≤‡ßã‡•§ ‡¶¶‡ßü‡¶æ ‡¶ï‡¶∞‡ßá ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶ï‡¶∞‡ßá ‡¶è‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡ßã ‡¶´‡¶æ‡¶®‡ßç‡¶° ‡¶∞‡¶ø‡¶≤‡¶ø‡¶ú ‡¶ï‡¶∞‡ßÅ‡¶®‡•§',
          createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
          deadlineDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0]
        },
        {
          id: 'ord-demo-103',
          type: 'gig_order',
          title: '‡¶´‡ßá‡¶∏‡¶¨‡ßÅ‡¶ï ‡¶ì ‡¶ó‡ßÅ‡¶ó‡¶≤ ‡¶è‡¶°‡¶∏ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡ßá‡¶á‡¶® ‡¶∏‡ßá‡¶ü‡¶Ü‡¶™ ‡¶è‡¶¨‡¶Ç ‡ßß‡ß¶‡ß¶% ‡¶Ö‡¶∞‡ßç‡¶ó‡¶æ‡¶®‡¶ø‡¶ï ‡¶è‡¶∏‡¶á‡¶ì',
          category: 'Digital Marketing',
          buyerId: currentUser?.id || 'buyer-1',
          buyerName: currentUser?.name || '‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞',
          buyerEmail: currentUser?.email || 'buyer@ptenit.com',
          sellerId: 'seller-3',
          sellerName: '‡¶Ü‡¶∞‡¶ø‡¶´‡ßÅ‡¶≤ ‡¶á‡¶∏‡¶≤‡¶æ‡¶Æ (Growth Marketer)',
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
          batch: c.batch || (progress === 100 ? '‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö-‡ß¶‡ßß (‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®)' : '‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö-‡ß¶‡ß® (‡¶ö‡¶≤‡¶Æ‡¶æ‡¶®)'),
          progress: progress,
          completedLessons: completedLessons,
          totalLessons: totalLessons,
          badge: c.category || 'Professional',
          enrolledDate: enr?.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : '‡¶ö‡¶≤‡¶Æ‡¶æ‡¶®',
          isLive: progress < 100,
          liveSchedule: c.liveSchedule || (progress === 100 ? '‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶® (‡¶Ü‡¶∞‡ßç‡¶ï‡¶æ‡¶á‡¶≠ ‡¶≤‡¶æ‡¶á‡¶≠)' : '‡¶™‡ßç‡¶∞‡¶§‡¶ø ‡¶Æ‡¶ô‡ßç‡¶ó‡¶≤ ‡¶ì ‡¶∂‡ßÅ‡¶ï‡ßç‡¶∞ ‡¶∞‡¶æ‡¶§ ‡ßØ:‡ß¶‡ß¶ ‡¶ü‡¶æ')
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
        instructor: '‡¶§‡¶æ‡¶®‡¶≠‡ßÄ‡¶∞ ‡¶Ü‡¶π‡¶Æ‡ßá‡¶¶',
        instructorRole: 'Senior Graphic Designer & Freelancer',
        batch: '‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö-‡ß¶‡ßß (‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®)',
        progress: 100,
        completedLessons: 16,
        totalLessons: 16,
        badge: 'Graphic Design',
        enrolledDate: '‡ßß‡ß® ‡¶ú‡¶æ‡¶®‡ßÅ‡ßü‡¶æ‡¶∞‡¶ø ‡ß®‡ß¶‡ß®‡ß¨',
        isLive: false,
        liveSchedule: '‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶® (‡¶Ü‡¶∞‡ßç‡¶ï‡¶æ‡¶á‡¶≠ ‡¶≤‡¶æ‡¶á‡¶≠)'
      },
      {
        id: 'course-yt-seo',
        title: 'YouTube SEO & Channel Growth Blueprint',
        coverImage: courses.find(c => c.id === 'course-yt-seo')?.thumbnail || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
        instructor: '‡¶ï‡¶æ‡¶ú‡ßÄ ‡¶∏‡ßã‡¶π‡¶æ‡¶ó',
        instructorRole: 'Digital Marketing & SEO Specialist',
        batch: '‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö-‡ß¶‡ß® (‡¶ö‡¶≤‡¶Æ‡¶æ‡¶®)',
        progress: 72,
        completedLessons: 15,
        totalLessons: 22,
        badge: 'SEO & Growth',
        enrolledDate: '‡ßß‡ß® ‡¶´‡ßá‡¶¨‡ßç‡¶∞‡ßÅ‡ßü‡¶æ‡¶∞‡¶ø ‡ß®‡ß¶‡ß®‡ß¨',
        isLive: true,
        liveSchedule: '‡¶™‡ßç‡¶∞‡¶§‡¶ø ‡¶∞‡¶¨‡¶ø ‡¶ì ‡¶¨‡ßÉ‡¶π‡¶∏‡ßç‡¶™‡¶§‡¶ø ‡¶∞‡¶æ‡¶§ ‡ßØ:‡ß¶‡ß¶ ‡¶ü‡¶æ'
      },
      {
        id: 'course-mern-pro',
        title: 'Full-Stack MERN & Next.js Pro Web Development',
        coverImage: courses.find(c => c.id === 'course-mern-pro')?.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        instructor: '‡¶™‡ßç‡¶∞‡¶ï‡ßå‡¶∂‡¶≤‡ßÄ ‡¶Ü‡¶≤-‡¶Ü‡¶Æ‡¶ø‡¶®',
        instructorRole: 'Lead Full-Stack Architect',
        batch: '‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö-‡ß¶‡ßÆ (‡¶≤‡¶æ‡¶á‡¶≠)',
        progress: 80,
        completedLessons: 16,
        totalLessons: 20,
        badge: 'MERN Stack',
        enrolledDate: '‡ßß‡ß¶ ‡¶ú‡ßÅ‡¶≤‡¶æ‡¶á ‡ß®‡ß¶‡ß®‡ß¨',
        isLive: true,
        liveSchedule: '‡¶™‡ßç‡¶∞‡¶§‡¶ø ‡¶∏‡ßã‡¶Æ ‡¶ì ‡¶¨‡ßÉ‡¶π‡¶∏‡ßç‡¶™‡¶§‡¶ø ‡¶∞‡¶æ‡¶§ ‡ßØ:‡ß¶‡ß¶ ‡¶ü‡¶æ'
      }
    ];

    return standardProCourses;
  }, [userEnrollments, courses]);

  const studentCertificatesList = useMemo(() => {
    const userCerts = (certificates || []).filter(c => currentUser ? (c.studentId === currentUser.id || c.studentEmail === currentUser.email) : false);
    const defaultCerts = [
      {
        id: 'cert-1',
        title: '‡¶´‡ßÅ‡¶≤ ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï MERN ‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶Æ‡¶æ‡¶∏‡ßç‡¶ü‡¶æ‡¶∞‡¶ï‡ßç‡¶≤‡¶æ‡¶∏',
        certId: 'CERT-PTEN-MERN-8891',
        issueDate: '‡ßß‡ß´ ‡¶Ü‡¶ó‡¶∏‡ßç‡¶ü ‡ß®‡ß¶‡ß®‡ß¨',
        grade: 'High Distinction (‡ßØ‡ßÆ%)'
      },
      {
        id: 'cert-2',
        title: '‡¶™‡¶æ‡¶á‡¶•‡¶® ‡¶°‡ßç‡¶Ø‡¶æ‡¶ô‡ßç‡¶ó‡ßã (Django) ‡¶ì AI ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï‡¶è‡¶®‡ßç‡¶° ‡¶á‡¶û‡ßç‡¶ú‡¶ø‡¶®‡¶ø‡ßü‡¶æ‡¶∞‡¶ø‡¶Ç',
        certId: 'CERT-PTEN-PY-4402',
        issueDate: '‡ßß‡ß¶ ‡¶ú‡ßÅ‡¶≤‡¶æ‡¶á ‡ß®‡ß¶‡ß®‡ß¨',
        grade: 'Distinction (‡ßØ‡ß™%)'
      }
    ];
    if (userCerts.length > 0) {
      return [
        ...userCerts.map(c => ({
          id: c.id,
          title: c.courseName || 'PTENit Certified Professional Track',
          certId: c.certificateCode || `PTEN-CERT-${c.id}`,
          issueDate: c.issueDate || '‡¶ö‡¶≤‡¶Æ‡¶æ‡¶® ‡¶Æ‡¶æ‡¶∏',
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
      marks: '‡ßØ‡ßÆ/‡ßß‡ß¶‡ß¶ (A+ Grade)',
      status: 'completed',
      date: '‡ßß‡ßÆ ‡¶Ü‡¶ó‡¶∏‡ßç‡¶ü ‡ß®‡ß¶‡ß®‡ß¨',
      totalMarks: '‡ßß‡ß¶‡ß¶ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      passMarks: '‡ß≠‡ß¶ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      repo: 'https://github.com/student-demo/mern-ecommerce-redux',
      note: '‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶ü‡ßá‡¶∏‡ßç‡¶ü ‡¶ï‡ßá‡¶∏ ‡¶∏‡¶π ‡¶∏‡¶¨ ‡¶è‡¶®‡ßç‡¶°‡¶™‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶™‡ßã‡¶∏‡ßç‡¶ü‡¶Æ‡ßç‡¶Ø‡¶æ‡¶®‡ßá ‡¶≠‡ßá‡¶∞‡¶ø‡¶´‡¶æ‡¶á ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá‡•§',
      description: '‡¶∞‡ßá‡¶°‡ßÅ‡¶è‡¶ï‡ßç‡¶∏ ‡¶ü‡ßÅ‡¶≤‡¶ï‡¶ø‡¶ü ‡¶ì ‡¶è‡¶ï‡ßç‡¶∏‡¶™‡ßç‡¶∞‡ßá‡¶∏ ‡¶®‡ßã‡¶° ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï‡¶è‡¶®‡ßç‡¶° ‡¶¶‡¶ø‡ßü‡ßá ‡¶´‡ßÅ‡¶≤ ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï ‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø, ‡¶™‡ßç‡¶∞‡ßã‡¶°‡¶æ‡¶ï‡ßç‡¶ü ‡¶ì ‡¶ï‡¶æ‡¶∞‡ßç‡¶ü ‡¶è‡¶™‡¶ø‡¶Ü‡¶á ‡¶∏‡¶Æ‡¶æ‡¶ß‡¶æ‡¶®‡•§',
      requirements: [
        'JWT ‡¶Ö‡¶•‡ßá‡¶®‡ßç‡¶ü‡¶ø‡¶ï‡ßá‡¶∂‡¶® ‡¶ì ‡¶™‡ßç‡¶∞‡ßã‡¶ü‡ßá‡¶ï‡ßç‡¶ü‡ßá‡¶° ‡¶∞‡ßÅ‡¶ü ‡¶á‡¶Æ‡¶™‡ßç‡¶≤‡¶ø‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡ßá‡¶∂‡¶®‡•§',
        'Redux Toolkit AsyncThunk ‡¶¶‡¶ø‡ßü‡ßá ‡¶∏‡ßç‡¶ü‡ßá‡¶ü ‡¶∏‡¶ø‡¶ô‡ßç‡¶ï‡ßç‡¶∞‡ßã‡¶®‡¶æ‡¶á‡¶ú‡ßá‡¶∂‡¶®‡•§',
        '‡¶Æ‡¶ô‡ßç‡¶ó‡ßã‡¶°‡¶ø‡¶¨‡¶ø Aggregation Pipeline ‡¶¨‡ßç‡¶Ø‡¶¨‡¶π‡¶æ‡¶∞ ‡¶ï‡¶∞‡ßá ‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞‡¶ø‡¶Ç‡•§'
      ],
      feedback: '‡¶ö‡¶Æ‡ßé‡¶ï‡¶æ‡¶∞ ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï‡¶è‡¶®‡ßç‡¶° ‡¶Ü‡¶∞‡ßç‡¶ï‡¶ø‡¶ü‡ßá‡¶ï‡¶ö‡¶æ‡¶∞ ‡¶è‡¶¨‡¶Ç ‡¶ï‡ßç‡¶≤‡¶ø‡¶® ‡¶∞‡¶ø‡¶°‡¶æ‡¶ï‡ßç‡¶∏ ‡¶∏‡ßç‡¶≤‡¶æ‡¶á‡¶∏ ‡¶Æ‡ßá‡¶•‡¶°‡ßã‡¶≤‡¶ú‡¶ø ‡¶¨‡ßç‡¶Ø‡¶¨‡¶π‡¶æ‡¶∞ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá‡•§'
    },
    {
      id: 'task-2',
      title: 'Real-time Socket.io Chat & Notification Service',
      course: 'Full-Stack MERN & Next.js Pro',
      courseName: 'Full-Stack MERN & Next.js Pro',
      courseId: 'course-mern-pro',
      marks: '‡¶∞‡¶ø‡¶≠‡¶ø‡¶â‡¶∞ ‡¶Ö‡¶™‡ßá‡¶ï‡ßç‡¶∑‡¶æ‡ßü',
      status: 'pending',
      date: '‡ß®‡ß¶ ‡¶Ü‡¶ó‡¶∏‡ßç‡¶ü ‡ß®‡ß¶‡ß®‡ß¨',
      totalMarks: '‡ß´‡ß¶ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      passMarks: '‡ß©‡ß´ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      repo: 'https://github.com/student-demo/socket-live-messaging',
      note: '‡¶∞‡ßÅ‡¶Æ ‡¶¨‡ßç‡¶∞‡¶°‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶ø‡¶Ç ‡¶è‡¶¨‡¶Ç ‡¶Æ‡ßá‡¶∏‡ßá‡¶ú ‡¶π‡¶ø‡¶∏‡ßç‡¶ü‡ßç‡¶∞‡¶ø ‡¶Æ‡¶ô‡ßç‡¶ó‡ßã‡¶°‡¶ø‡¶¨‡¶ø‡¶∞ ‡¶∏‡¶æ‡¶•‡ßá ‡¶∏‡¶ø‡¶ô‡ßç‡¶ï ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá‡•§',
      description: '‡¶∞‡¶ø‡ßü‡ßá‡¶≤‡¶ü‡¶æ‡¶á‡¶Æ ‡¶¶‡ßç‡¶¨‡¶ø‡¶Æ‡ßÅ‡¶ñ‡ßÄ ‡¶ö‡ßç‡¶Ø‡¶æ‡¶ü ‡¶ì ‡¶®‡ßã‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶∂‡¶® ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ ‡¶á‡¶Æ‡¶™‡ßç‡¶≤‡¶ø‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡ßá‡¶∂‡¶®‡•§',
      requirements: [
        'Socket.io ‡¶π‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶∂‡ßá‡¶ï ‡¶ì ‡¶á‡¶â‡¶ú‡¶æ‡¶∞ ‡¶∞‡ßÅ‡¶Æ ‡¶ú‡ßü‡ßá‡¶® ‡¶π‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶≤‡¶ø‡¶Ç‡•§',
        '‡¶Ö‡¶®‡¶≤‡¶æ‡¶á‡¶®/‡¶Ö‡¶´‡¶≤‡¶æ‡¶á‡¶® ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶∏ ‡¶ì ‡¶ü‡¶æ‡¶á‡¶™‡¶ø‡¶Ç ‡¶á‡¶®‡ßç‡¶°‡¶ø‡¶ï‡ßá‡¶ü‡¶∞‡•§',
        '‡¶Æ‡ßá‡¶∏‡ßá‡¶ú ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï‡¶Ü‡¶™ ‡¶ì ‡¶∞‡¶ø‡ßü‡ßá‡¶≤‡¶ü‡¶æ‡¶á‡¶Æ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶≤‡¶æ‡¶∞‡ßç‡¶ü ‡¶®‡ßã‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶∂‡¶®‡•§'
      ],
      feedback: '‡¶á‡¶®‡ßç‡¶∏‡¶ü‡ßç‡¶∞‡¶æ‡¶ï‡¶ü‡¶∞ ‡¶Ü‡¶≤-‡¶Ü‡¶Æ‡¶ø‡¶® ‡¶ï‡ßã‡¶° ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶ï‡¶∞‡¶õ‡ßá‡¶®‡•§'
    }
  ]);

  const [pendingAssignmentsList, setPendingAssignmentsList] = useState([
    {
      id: 'pending-1',
      title: '‡¶Æ‡¶°‡¶ø‡¶â‡¶≤ ‡ß≠: ‡¶á‡¶ï‡¶Æ‡¶æ‡¶∞‡ßç‡¶∏ ‡¶∂‡¶™‡¶ø‡¶Ç ‡¶ï‡¶æ‡¶∞‡ßç‡¶ü ‡¶ì ‡¶ö‡ßá‡¶ï‡¶Ü‡¶â‡¶ü ‡¶á‡¶®‡ßç‡¶ü‡¶ø‡¶ó‡ßç‡¶∞‡ßá‡¶∂‡¶® ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü',
      courseId: 'course-mern-pro',
      courseName: 'Full Stack Web Development',
      deadline: '‡¶Ü‡¶ó‡¶æ‡¶Æ‡ßÄ‡¶ï‡¶æ‡¶≤ ‡¶∞‡¶æ‡¶§ ‡ßß‡ßß:‡ß´‡ßØ',
      badge: '‡¶ú‡¶∞‡ßÅ‡¶∞‡¶ø',
      totalMarks: '‡ß´‡ß¶ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      passMarks: '‡ß©‡ß´ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      description: '‡¶è‡¶ï‡¶ü‡¶ø ‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶∞‡ßá‡¶∏‡¶™‡¶®‡ßç‡¶∏‡¶ø‡¶≠ ‡¶á-‡¶ï‡¶Æ‡¶æ‡¶∞‡ßç‡¶∏ ‡¶∂‡¶™‡¶ø‡¶Ç ‡¶ï‡¶æ‡¶∞‡ßç‡¶ü ‡¶è‡¶¨‡¶Ç ‡¶ö‡ßá‡¶ï‡¶Ü‡¶â‡¶ü ‡¶´‡ßç‡¶≤‡ßã ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡¶§‡ßá ‡¶π‡¶¨‡ßá ‡¶Ø‡ßá‡¶ñ‡¶æ‡¶®‡ßá ‡¶á‡¶â‡¶ú‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡ßã‡¶°‡¶æ‡¶ï‡ßç‡¶ü ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶°, ‡¶ï‡ßã‡ßü‡¶æ‡¶®‡ßç‡¶ü‡¶ø‡¶ü‡¶ø ‡¶™‡¶∞‡¶ø‡¶¨‡¶∞‡ßç‡¶§‡¶®, ‡¶ï‡ßÅ‡¶™‡¶® ‡¶°‡¶ø‡¶∏‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶™‡ßç‡¶∞‡ßü‡ßã‡¶ó ‡¶è‡¶¨‡¶Ç ‡¶°‡ßá‡¶Æ‡ßã ‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶® ‡¶ï‡¶∞‡¶§‡ßá ‡¶™‡¶æ‡¶∞‡¶¨‡ßá‡•§',
      requirements: [
        '‡¶ï‡¶Æ‡¶™‡¶ï‡ßç‡¶∑‡ßá ‡ß´‡¶ü‡¶ø ‡¶™‡ßç‡¶∞‡ßã‡¶°‡¶æ‡¶ï‡ßç‡¶ü ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶≠‡¶ø‡¶â ‡¶è‡¶¨‡¶Ç ‡¶∏‡¶ø‡¶ô‡ßç‡¶ó‡ßá‡¶≤ ‡¶™‡ßç‡¶∞‡ßã‡¶°‡¶æ‡¶ï‡ßç‡¶ü ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£‡ßÄ ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡¶æ‡•§',
        '‡¶Ö‡ßç‡¶Ø‡¶æ‡¶° ‡¶ü‡ßÅ ‡¶ï‡¶æ‡¶∞‡ßç‡¶ü, ‡¶Ü‡¶á‡¶ü‡ßá‡¶Æ ‡¶∏‡¶Ç‡¶ñ‡ßç‡¶Ø‡¶æ ‡¶¨‡ßÉ‡¶¶‡ßç‡¶ß‡¶ø/‡¶π‡ßç‡¶∞‡¶æ‡¶∏ ‡¶ì ‡¶∞‡¶ø‡¶Æ‡ßÅ‡¶≠ ‡¶ï‡¶∞‡¶æ‡¶∞ ‡¶∏‡ßç‡¶ü‡ßá‡¶ü ‡¶Æ‡ßç‡¶Ø‡¶æ‡¶®‡ßá‡¶ú‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡•§',
        '‡¶∏‡¶æ‡¶¨‡¶ü‡ßã‡¶ü‡¶æ‡¶≤, ‡¶≠‡ßç‡¶Ø‡¶æ‡¶ü/‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶∏ ‡¶è‡¶¨‡¶Ç ‡¶ï‡ßÅ‡¶™‡¶® ‡¶ï‡ßã‡¶° ‡¶°‡¶ø‡¶∏‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶∞‡¶ø‡ßü‡ßá‡¶≤‡¶ü‡¶æ‡¶á‡¶Æ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶≤‡¶ï‡ßÅ‡¶≤‡ßá‡¶∂‡¶®‡•§',
        '‡¶ó‡¶ø‡¶ü‡¶π‡¶æ‡¶¨‡ßá ‡¶Ö‡¶®‡ßç‡¶§‡¶§ ‡ß©‡¶ü‡¶ø ‡¶Ö‡¶∞‡ßç‡¶•‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶ï‡¶Æ‡¶ø‡¶ü ‡¶è‡¶¨‡¶Ç Vercel/Netlify ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶™‡ßç‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶≤‡¶ø‡¶Ç‡¶ï‡•§'
      ],
      submissionGuide: '‡¶ó‡¶ø‡¶ü‡¶π‡¶æ‡¶¨ ‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶ï ‡¶∞‡¶ø‡¶™‡ßã‡¶ú‡¶ø‡¶ü‡¶∞‡¶ø ‡¶≤‡¶ø‡¶Ç‡¶ï ‡¶Ö‡¶•‡¶¨‡¶æ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶π‡ßã‡¶∏‡ßç‡¶ü‡ßá‡¶° ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶≤‡¶ø‡¶Ç‡¶ï ‡¶™‡ßç‡¶∞‡¶¶‡¶æ‡¶® ‡¶ï‡¶∞‡ßÅ‡¶®‡•§'
    },
    {
      id: 'pending-2',
      title: '‡¶Æ‡¶°‡¶ø‡¶â‡¶≤ ‡ß™: ‡¶´‡ßá‡¶∏‡¶¨‡ßÅ‡¶ï ‡¶ï‡¶®‡¶≠‡¶æ‡¶∞‡ßç‡¶∏‡¶® ‡¶™‡¶ø‡¶ï‡ßç‡¶∏‡ßá‡¶≤ ‡¶ì ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶Ö‡¶°‡¶ø‡ßü‡ßá‡¶®‡ßç‡¶∏ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡ßá‡¶á‡¶®',
      courseId: 'course-fb-marketing',
      courseName: 'Facebook Marketing & Paid Ads',
      deadline: '‡ß®‡ßÆ ‡¶Ü‡¶ó‡¶∏‡ßç‡¶ü ‡ß®‡ß¶‡ß®‡ß¨',
      badge: '‡¶®‡¶ø‡ßü‡¶Æ‡¶ø‡¶§',
      totalMarks: '‡ß´‡ß¶ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      passMarks: '‡ß©‡ß´ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡¶∏',
      description: '‡¶Æ‡ßá‡¶ü‡¶æ ‡¶¨‡¶ø‡¶ú‡¶®‡ßá‡¶∏ ‡¶Æ‡ßç‡¶Ø‡¶æ‡¶®‡ßá‡¶ú‡¶æ‡¶∞‡ßá ‡¶ï‡¶®‡¶≠‡¶æ‡¶∞‡ßç‡¶∏‡¶® ‡¶™‡¶ø‡¶ï‡ßç‡¶∏‡ßá‡¶≤ ‡¶ì ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶Ö‡¶°‡¶ø‡ßü‡ßá‡¶®‡ßç‡¶∏ ‡¶∏‡ßç‡¶ü‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶ü‡ßá‡¶ú‡¶ø ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡ßá ‡¶ú‡¶Æ‡¶æ ‡¶¶‡¶ø‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§ ‡¶¨‡¶ø‡¶≠‡¶ø‡¶®‡ßç‡¶® ‡¶´‡¶æ‡¶®‡ßá‡¶≤ ‡¶∏‡ßç‡¶ü‡ßá‡¶ú ‡¶Ö‡¶®‡ßÅ‡¶Ø‡¶æ‡ßü‡ßÄ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡ßá‡¶á‡¶® ‡¶∏‡ßç‡¶ü‡ßç‡¶∞‡¶æ‡¶ï‡¶ö‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶ú‡¶æ‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§',
      requirements: [
        '‡¶ì‡ßü‡ßá‡¶¨‡¶∏‡¶æ‡¶á‡¶ü‡ßá ‡¶Æ‡ßá‡¶ü‡¶æ ‡¶™‡¶ø‡¶ï‡ßç‡¶∏‡ßá‡¶≤ ‡¶ì ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶° ‡¶á‡¶≠‡ßá‡¶®‡ßç‡¶ü ‡¶∏‡ßá‡¶ü‡¶Ü‡¶™‡ßá‡¶∞ ‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡¶ø‡¶®‡¶∂‡¶ü‡•§',
        '‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶Ö‡¶°‡¶ø‡ßü‡ßá‡¶®‡ßç‡¶∏ ‡¶ì ‡ß©% ‡¶≤‡ßÅ‡¶ï-‡¶Ö‡ßç‡¶Ø‡¶æ‡¶≤‡¶æ‡¶á‡¶ï ‡¶Ö‡¶°‡¶ø‡ßü‡ßá‡¶®‡ßç‡¶∏ ‡¶§‡ßà‡¶∞‡¶ø‡¶∞ ‡¶™‡ßç‡¶∞‡¶Æ‡¶æ‡¶£‡¶™‡¶§‡ßç‡¶∞‡•§',
        '‡¶Ö‡ßç‡¶Ø‡¶æ‡¶° ‡¶ï‡¶™‡¶ø, ‡¶π‡ßá‡¶°‡¶≤‡¶æ‡¶á‡¶®, ‡¶ï‡ßç‡¶∞‡¶ø‡ßü‡ßá‡¶ü‡¶ø‡¶≠ ‡¶¨‡ßç‡¶Ø‡¶æ‡¶®‡¶æ‡¶∞ ‡¶è‡¶¨‡¶Ç ‡¶™‡ßç‡¶≤‡ßá‡¶∏‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶∏‡ßç‡¶ü‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶ü‡ßá‡¶ú‡¶ø‡•§',
        '‡¶ó‡ßÅ‡¶ó‡¶≤ ‡¶°‡¶ï ‡¶¨‡¶æ ‡¶°‡ßç‡¶∞‡¶æ‡¶á‡¶≠ ‡¶´‡ßã‡¶≤‡ßç‡¶°‡¶æ‡¶∞ ‡¶≤‡¶ø‡¶Ç‡¶ï (‡¶≠‡¶ø‡¶â‡ßü‡¶æ‡¶∞ ‡¶è‡¶ï‡ßç‡¶∏‡ßá‡¶∏ ‡¶∏‡¶π)‡•§'
      ],
      submissionGuide: '‡¶ó‡ßÅ‡¶ó‡¶≤ ‡¶°‡ßç‡¶∞‡¶æ‡¶á‡¶≠ ‡¶¨‡¶æ ‡¶°‡¶ï ‡¶≤‡¶ø‡¶Ç‡¶ï (‡¶∏‡¶¨‡¶æ‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶≠‡¶ø‡¶â ‡¶™‡¶æ‡¶∞‡¶Æ‡¶ø‡¶∂‡¶® ‡¶ì‡¶™‡ßá‡¶® ‡¶∞‡ßá‡¶ñ‡ßá) ‡¶ú‡¶Æ‡¶æ ‡¶¶‡¶ø‡¶®‡•§'
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
  const [isSavedSearchActive, setIsSavedSearchActive] = useState(false);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedCategoryFilter, setSavedCategoryFilter] = useState('all');
  const [isSavedGigsSettingsModalOpen, setIsSavedGigsSettingsModalOpen] = useState(false);
  const [isOrdersSettingsModalOpen, setIsOrdersSettingsModalOpen] = useState(false);
  const [orderNotificationAlerts, setOrderNotificationAlerts] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ptenit_order_alerts') !== 'false';
    } catch {
      return true;
    }
  });
  const [isMessengerSettingsModalOpen, setIsMessengerSettingsModalOpen] = useState(false);
  const [messengerOnlineStatus, setMessengerOnlineStatus] = useState(true);
  const [messengerSoundAlerts, setMessengerSoundAlerts] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ptenit_messenger_sound') !== 'false';
    } catch {
      return true;
    }
  });
  const [savedGigsSort, setSavedGigsSort] = useState<'recent' | 'price_asc' | 'price_desc' | 'rating' | 'popular'>('recent');
  const [savedGigsPriceAlerts, setSavedGigsPriceAlerts] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ptenit_saved_price_alerts') !== 'false';
    } catch {
      return true;
    }
  });
  const [savedWishlistCopied, setSavedWishlistCopied] = useState(false);
  const [isOrderSearchActive, setIsOrderSearchActive] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const activeMessengerUser = useMemo(() => {
    if (!activeMessengerConversationId) return null;
    const win = activeChatWindows?.find(w => w.id === activeMessengerConversationId);
    if (win) {
      return {
        name: win.senderName,
        avatar: win.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        role: win.senderRole || '‡¶≠‡ßá‡¶∞‡¶ø‡¶´‡¶æ‡¶á‡¶° ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞'
      };
    }
    const defaultContacts: Record<string, { name: string; avatar: string; role: string }> = {
      'chat-tanvir-ahmed': { name: 'Tanvir Ahmed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', role: 'Top Rated ‚Ä¢ Full-Stack Web' },
      'chat-creative-pixels': { name: 'Creative Pixels Agency', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', role: 'Level 2 ‚Ä¢ UI/UX Designer' },
      'chat-piten-support': { name: 'PiTen Marketplace Official', avatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=120&q=80', role: '‡¶Ö‡¶´‡¶ø‡¶∏‡¶ø‡ßü‡¶æ‡¶≤ ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶ì ‡¶è‡¶∏‡¶ï‡ßç‡¶∞‡ßã ‡¶∏‡¶ø‡¶ï‡¶ø‡¶â‡¶∞‡¶ø‡¶ü‡¶ø' },
      'chat-shahinur-rahman': { name: 'Shahinur Rahman', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', role: 'Pro Seller ‚Ä¢ React & Node Specialist' },
      'chat-zubair-hossain': { name: 'Zubair Hossain', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', role: 'Level 2 ‚Ä¢ Mobile App Dev' },
      'chat-sadia-afrin': { name: 'Sadia Afrin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', role: 'Top Rated ‚Ä¢ SEO & Marketing' },
      'chat-mouson-art': { name: 'Mouson Branding Studio', avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=120&q=80', role: 'Level 2 ‚Ä¢ Logo & Graphics' },

      'convo-1': { name: 'Tanvir Ahmed', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', role: 'Top Rated ‚Ä¢ Full-Stack Web' },
      'convo-2': { name: 'Creative Pixels Agency', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', role: 'Level 2 ‚Ä¢ UI/UX Designer' },
      'convo-3': { name: 'PiTen Marketplace Official', avatar: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=120&q=80', role: 'Official Support & Escrow' },
      'convo-4': { name: 'Shahinur Rahman', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', role: 'Pro Seller ‚Ä¢ React & Node' },
      'convo-5': { name: 'Zubair Hossain', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80', role: 'Level 2 ‚Ä¢ Mobile App Dev' }
    };
    return defaultContacts[activeMessengerConversationId] || { name: '‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶ö‡ßç‡¶Ø‡¶æ‡¶ü', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', role: '‡¶Ö‡¶®‡¶≤‡¶æ‡¶á‡¶®' };
  }, [activeMessengerConversationId, activeChatWindows]);
  const [sellerOrderFilter, setSellerOrderFilter] = useState<'pending' | 'in_progress' | 'in_review' | 'completed'>('pending');

  // Public Project Post Modal States
  const [detailsModalOrder, setDetailsModalOrder] = useState<any | null>(null);
  const [payReleaseModalOrder, setPayReleaseModalOrder] = useState<any | null>(null);
  const [releaseRating, setReleaseRating] = useState<number>(5);
  const [releaseReviewText, setReleaseReviewText] = useState<string>("‡¶ñ‡ßÅ‡¶¨‡¶á ‡¶ö‡¶Æ‡ßé‡¶ï‡¶æ‡¶∞ ‡¶ì ‡¶Æ‡¶æ‡¶®‡¶∏‡¶Æ‡ßç‡¶Æ‡¶§ ‡¶ï‡¶æ‡¶ú ‡¶™‡ßá‡ßü‡ßá‡¶õ‡¶ø! ‡¶ß‡¶®‡ßç‡¶Ø‡¶¨‡¶æ‡¶¶ ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞‡¶ï‡ßá‡•§");
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
  const [postBudget, setPostBudget] = useState('‡ß≥‡ßß‡ß´,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ß©‡ß¶,‡ß¶‡ß¶‡ß¶');
  const [postDescription, setPostDescription] = useState('');
  const [postAttachmentName, setPostAttachmentName] = useState('');
  const [postAttachmentUrl, setPostAttachmentUrl] = useState('');
  const [postSubmittedSuccess, setPostSubmittedSuccess] = useState(false);

  const publishProjectNow = (forcedOfferType?: "work_first" | "paid") => {
    const computedBudget = `‡ß≥${minBudget} - ‡ß≥${maxBudget}`;
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
  const [newBudgetRange, setNewBudgetRange] = useState<string>('‡ß≥‡ß®‡ß¶,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ß©‡ß´,‡ß¶‡ß¶‡ß¶');

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
    setEditBudget(ord.budgetRange || '‡ß≥‡ßß‡ß´,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ß©‡ß¶,‡ß¶‡ß¶‡ß¶');
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
    setNewBudgetRange(ord.budgetRange || '‡ß≥‡ß®‡ß¶,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ß©‡ß´,‡ß¶‡ß¶‡ß¶');
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
  const [viewingOrderDetails, setViewingOrderDetails] = useState<any | null>(null);
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  // 1-second interval for real-time countdown decrement
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryFileUrl, setDeliveryFileUrl] = useState('');
  const [deliveryFileName, setDeliveryFileName] = useState('');
  const [outsourceOrderModal, setOutsourceOrderModal] = useState<any | null>(null);
  const [outsourceCommPercent, setOutsourceCommPercent] = useState<number>(20);
  const [outsourceTargetName, setOutsourceTargetName] = useState('‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶ï ‡¶´‡ßç‡¶∞‡¶ø‡¶≤‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶∏‡¶æ‡¶∞ ‡¶π‡¶æ‡¶¨');
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
    'course-mern-pro': '‡¶Ü‡¶ú: ‡¶∞‡¶æ‡¶§ ‡ßØ‡¶ü‡¶æ‡ßü',
    'course-python-ai': '‡¶Ü‡¶ó‡¶æ‡¶Æ‡ßÄ‡¶ï‡¶æ‡¶≤ ‡¶∞‡¶æ‡¶§ ‡ßÆ‡¶ü‡¶æ‡ßü',
    'course-flutter-app': '‡¶™‡ßç‡¶∞‡¶§‡¶ø ‡¶∂‡¶®‡¶ø-‡¶¨‡ßÅ‡¶ß ‡¶∞‡¶æ‡¶§ ‡ßØ‡¶ü‡¶æ‡ßü'
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
    { sender: 'ai', text: '‡¶∏‡ßç‡¶¨‡¶æ‡¶ó‡¶§‡¶Æ! ‡¶Ü‡¶Æ‡¶ø ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ AI ‡¶≤‡¶æ‡¶∞‡ßç‡¶®‡¶ø‡¶Ç ‡¶ü‡¶ø‡¶â‡¶ü‡¶∞‡•§ ‡¶è‡¶á ‡¶ï‡ßã‡¶∞‡ßç‡¶∏‡ßá‡¶∞ ‡¶Ø‡ßá‡¶ï‡ßã‡¶®‡ßã ‡¶ï‡ßã‡¶°‡¶ø‡¶Ç, ‡¶°‡ßá‡¶¨‡¶ï‡ßç‡¶∏ ‡¶¨‡¶æ ‡¶ü‡ßá‡¶ï‡¶®‡¶ø‡¶ï‡ßç‡¶Ø‡¶æ‡¶≤ ‡¶∏‡¶Æ‡¶∏‡ßç‡¶Ø‡¶æ ‡¶®‡¶ø‡ßü‡ßá ‡¶™‡ßç‡¶∞‡¶∂‡ßç‡¶® ‡¶ï‡¶∞‡¶§‡ßá ‡¶™‡¶æ‡¶∞‡ßá‡¶®‡•§' }
  ]);
  const [isAiTutorThinking, setIsAiTutorThinking] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [assignmentRepoLink, setAssignmentRepoLink] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [assignmentSubmittedMap, setAssignmentSubmittedMap] = useState<{ [key: string]: boolean }>({
    'asg-1': true
  });

  const getOrderCountdown = (ord: any, currentNow: number) => {
    if (!ord) return null;
    if (ord.status === "completed") {
      return {
        text: "‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶® ‡¶ì ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡ßç‡¶°",
        shortBadge: "‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®",
        isOverdue: false,
        badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#1DB954]",
        penaltyAmount: 0,
        buyerBonus: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    if (ord.status === "cancelled") {
      return {
        text: "‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá",
        shortBadge: "‡¶¨‡¶æ‡¶§‡¶ø‡¶≤",
        isOverdue: false,
        badgeColor: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
        penaltyAmount: 0,
        buyerBonus: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    if (ord.status === "in_review" || ord.status === "revision_requested") {
      return {
        text: "‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡¶ú‡¶Æ‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá ‚Ä¢ ‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶ï‡¶∞‡¶õ‡ßá‡¶®",
        shortBadge: "‡¶∞‡¶ø‡¶≠‡¶ø‡¶â‡¶ß‡ßÄ‡¶®",
        isOverdue: false,
        badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
        penaltyAmount: 0,
        buyerBonus: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : (currentNow - 3600 * 1000 * 4);
    const deliveryDays = ord.deliveryDays || 3;
    const deadline = (ord.deadlineDate ? new Date(ord.deadlineDate).getTime() : 0) || (createdTime + deliveryDays * 24 * 3600 * 1000);
    const diff = deadline - currentNow;

    const penaltyAmount = Math.round((ord.amount || 0) * 0.05);
    const buyerBonus = Math.round((ord.amount || 0) * 0.03);

    if (diff > 0) {
      const totalSecs = Math.floor(diff / 1000);
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;

      const dStr = d.toLocaleString("bn-BD");
      const hStr = h.toLocaleString("bn-BD");
      const mStr = m.toLocaleString("bn-BD");
      const sStr = s.toLocaleString("bn-BD");

      let formattedText = "";
      if (d > 0) {
        formattedText = `‡¶¨‡¶æ‡¶ï‡¶ø: ${dStr}‡¶¶‡¶ø‡¶® ${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø ${sStr}‡¶∏‡ßá`;
      } else {
        formattedText = `‡¶¨‡¶æ‡¶ï‡¶ø: ${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø ${sStr}‡¶∏‡ßá`;
      }

      return {
        text: formattedText,
        shortBadge: d > 0 ? `${dStr}‡¶¶‡¶ø‡¶® ${hStr}‡¶ò` : `${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø`,
        isOverdue: false,
        badgeColor: d > 0 ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300" : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300",
        penaltyAmount,
        buyerBonus,
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
      };
    } else {
      const absSecs = Math.floor(Math.abs(diff) / 1000);
      const h = Math.floor(absSecs / 3600);
      const m = Math.floor((absSecs % 3600) / 60);
      const s = absSecs % 60;

      const hStr = h.toLocaleString("bn-BD");
      const mStr = m.toLocaleString("bn-BD");
      const sStr = s.toLocaleString("bn-BD");

      return {
        text: `‡¶∏‡¶Æ‡ßü ‡¶∂‡ßá‡¶∑: -${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø ${sStr}‡¶∏‡ßá`,
        shortBadge: `-${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø`,
        isOverdue: true,
        badgeColor: "bg-rose-500 text-white font-black animate-pulse",
        penaltyAmount,
        buyerBonus,
        days: 0,
        hours: h,
        minutes: m,
        seconds: s,
      };
    };
  };

  const getTimeAgoBengali = (dateString?: string) => {
    if (!dateString) return '‡¶è‡¶ñ‡¶®‡¶á';
    const createdTime = new Date(dateString).getTime();
    if (isNaN(createdTime) || createdTime <= 0) return '‡¶Ü‡¶ú‡¶ï‡ßá';
    
    const diffSeconds = Math.max(0, Math.floor((Date.now() - createdTime) / 1000));
    if (diffSeconds < 60) return '‡¶è‡¶ñ‡¶®‡¶á (‡ßß ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü‡ßá‡¶∞ ‡¶ï‡¶Æ ‡¶Ü‡¶ó‡ßá)';
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes.toLocaleString('bn-BD')} ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü ‡¶Ü‡¶ó‡ßá`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours.toLocaleString('bn-BD')} ‡¶ò‡¶£‡ßç‡¶ü‡¶æ ‡¶Ü‡¶ó‡ßá`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays.toLocaleString('bn-BD')} ‡¶¶‡¶ø‡¶® ‡¶Ü‡¶ó‡ßá`;
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
      setSpecialistMainTab('marketplace');
      setSellerSubTab('gigs');
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
  const [invClientName, setInvClientName] = useState('‡¶∞‡¶π‡¶ø‡¶Æ ‡¶Ü‡¶π‡¶Æ‡ßá‡¶¶');
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
        `Dear Hiring Manager,\n\nI saw your job post for "${proposalJobTopic}" and I am excited to help you achieve your goal! As a top-rated freelancer with over 5 years of expertise in ${editProfileSkills || 'Full Stack Web & UI/UX'}, I have built similar high-converting applications with 100% client satisfaction.\n\nHere is how I will execute your project:\n1. üîç Comprehensive Requirements & Architecture Plan\n2. üé® Pixel-Perfect UI/UX Design & Responsive Layout\n3. ‚ö° High-Performance Clean Code Implementation\n4. üõ°Ô∏è Thorough Testing & 30-Day Post-Delivery Maintenance Support\n\nI can deliver this project within schedule. Let's discuss further in chat!\n\nBest regards,\n${currentUser?.name || 'Sohag Kazi'}\nBoss Freelancer Pro`
      );
      setIsGeneratingProposal(false);
      playToolkitSound('success');
    }, 500);
  };

  // Seller Workspace & Profile States (Specialist = Seller + Teacher)
  const [specialistMainTab, setSpecialistMainTab] = useState<'overview' | 'courses' | 'marketplace' | 'mentor' | 'payments' | 'ai_toolkit'>('marketplace');
  const [sellerSubTab, setSellerSubTab] = useState<'gigs' | 'orders' | 'requests' | 'earnings' | 'create_gig' | 'courses' | 'assignments' | 'students' | 'certificates'>('gigs');
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
          features: ['‡¶ï‡ßã‡¶∞ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ì ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø', '‡¶∏‡ßã‡¶∞‡ßç‡¶∏ ‡¶´‡¶æ‡¶á‡¶≤']
        },
        standard: {
          name: 'Standard Package',
          price: editGigPriceStandard,
          deliveryDays: Math.max(1, editGigDeliveryDays - 1),
          revisions: '3',
          features: ['‡¶Ö‡ßç‡¶Ø‡¶æ‡¶°‡¶≠‡¶æ‡¶®‡ßç‡¶∏ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ì ‡¶ï‡ßã‡¶°', '‡¶∏‡ßã‡¶∞‡ßç‡¶∏ ‡¶´‡¶æ‡¶á‡¶≤', '‡¶™‡ßç‡¶∞‡¶ø‡¶Æ‡¶ø‡ßü‡¶æ‡¶Æ ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü']
        },
        premium: {
          name: 'Premium Package',
          price: editGigPricePremium,
          deliveryDays: Math.max(1, editGigDeliveryDays - 2),
          revisions: 'Unbounded',
          features: ['‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü', '‡¶≤‡¶æ‡¶á‡¶´‡¶ü‡¶æ‡¶á‡¶Æ ‡¶Æ‡ßá‡¶á‡¶®‡¶ü‡ßá‡¶®‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶∏', '‡¶≠‡¶ø‡¶Ü‡¶á‡¶™‡¶ø ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü']
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
  const [activePackageStep, setActivePackageStep] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [packageLayoutMode, setPackageLayoutMode] = useState<'stepped' | 'columns'>('stepped');
  const [newGigTitle, setNewGigTitle] = useState('');
  const [newGigCategory, setNewGigCategory] = useState('Programming & Tech');
  const [newGigOfferBadge, setNewGigOfferBadge] = useState<string>('');
  const [newGigThumbnail, setNewGigThumbnail] = useState('');
  const [newGigGalleryPic, setNewGigGalleryPic] = useState('');
  const [newGigVideoUrl, setNewGigVideoUrl] = useState('');
  const [newGigDesc, setNewGigDesc] = useState('');
  const [newGigTags, setNewGigTags] = useState('');
  const [newGigRequirements, setNewGigRequirements] = useState('');
  const [newGigFaqs, setNewGigFaqs] = useState<{ id: string; question: string; answer: string }[]>([
    { id: "1", question: "", answer: "" }
  ]);
  const [createGigSuccess, setCreateGigSuccess] = useState(false);

  // Basic Package State
  const [newBasicTitle, setNewBasicTitle] = useState('');
  const [newBasicPrice, setNewBasicPrice] = useState<string | number>('');
  const [newBasicDelivery, setNewBasicDelivery] = useState<string | number>('');
  const [newBasicRevisions, setNewBasicRevisions] = useState<string>('1');
  const [newBasicDesc, setNewBasicDesc] = useState('');

  // Standard Package State
  const [newStandardTitle, setNewStandardTitle] = useState('');
  const [newStandardPrice, setNewStandardPrice] = useState<string | number>('');
  const [newStandardDelivery, setNewStandardDelivery] = useState<string | number>('');
  const [newStandardRevisions, setNewStandardRevisions] = useState<string>('3');
  const [newStandardDesc, setNewStandardDesc] = useState('');

  // Premium Package State
  const [newPremiumTitle, setNewPremiumTitle] = useState('');
  const [newPremiumPrice, setNewPremiumPrice] = useState<string | number>('');
  const [newPremiumDelivery, setNewPremiumDelivery] = useState<string | number>('');
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
    requestedAt: '‡ßß‡ß™/‡ßÆ/‡ß®‡ß¶‡ß®‡ß¨, ‡ßß:‡ßß‡ß©:‡ß™‡ß® AM',
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
  const [buyerEditName, setBuyerEditName] = useState(currentUser?.name || '‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞');
  const [buyerEditAvatar, setBuyerEditAvatar] = useState(currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
  const [buyerEditWhatsapp, setBuyerEditWhatsapp] = useState(currentUser?.mobile || (currentUser as any)?.whatsappNumber || '+8801700000000');
  const [buyerEditEmail, setBuyerEditEmail] = useState(currentUser?.email || 'buyer@ptenit.com');
  const [buyerEditPassword, setBuyerEditPassword] = useState('‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢');
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
      setBuyerEditName(currentUser.name || '‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞');
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
    setBuyerProfileSuccessMsg('‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶õ‡¶¨‡¶ø, ‡¶®‡¶æ‡¶Æ, ‡¶π‡ßã‡ßü‡¶æ‡¶ü‡¶∏‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™ ‡¶®‡¶Æ‡ßç‡¶¨‡¶∞, ‡¶ú‡¶ø-‡¶Æ‡ßá‡¶á‡¶≤ ‡¶ì ‡¶™‡¶æ‡¶∏‡¶ì‡ßü‡¶æ‡¶∞‡ßç‡¶° ‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá ‡¶Ü‡¶™‡¶°‡ßá‡¶ü ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá!');
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
      role: '‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ / ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü',
      email: 'sohag.buyer@email.com',
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      type: 'buyer'
    },
    {
      id: 'acc-3',
      name: 'PTEN Tech Agency',
      role: '‡¶è‡¶ú‡ßá‡¶®‡ßç‡¶∏‡¶ø ‡¶ì ‡¶ü‡¶ø‡¶Æ ‡¶¨‡¶ø‡¶ú‡¶®‡ßá‡¶∏ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü',
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
  const [mentorAppBio, setMentorAppBio] = useState('‡¶Ü‡¶Æ‡¶ø ‡ß´+ ‡¶¨‡¶õ‡¶∞ ‡¶ß‡¶∞‡ßá ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶ì‡ßü‡ßá‡¶¨ ‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶è‡¶¨‡¶Ç ‡¶∂‡¶ø‡¶ï‡ßç‡¶∑‡¶æ‡¶∞‡ßç‡¶•‡ßÄ‡¶¶‡ßá‡¶∞ ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞‡¶ø‡¶Ç ‡¶ï‡¶∞‡ßá ‡¶Ü‡¶∏‡¶õ‡¶ø‡•§');
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
      typeLabel: '‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡¶æ‡¶∞‡ßç‡¶∏‡ßã‡¶®‡¶æ‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞',
      source: 'Client Direct Request',
      clientName: '‡¶Æ‡ßã‡¶∂‡¶æ‡¶∞‡¶∞‡¶´ ‡¶π‡ßã‡¶∏‡ßá‡¶®',
      clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶¢‡¶æ‡¶ï‡¶æ, ‡¶¨‡¶æ‡¶Ç‡¶≤‡¶æ‡¶¶‡ßá‡¶∂',
      postedTime: '‡ßß‡ß¶ ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü ‡¶Ü‡¶ó‡ßá',
      title: '‡¶´‡ßÅ‡¶≤-‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï ‡¶á-‡¶ï‡¶Æ‡¶æ‡¶∞‡ßç‡¶∏ ‡¶ì‡ßü‡ßá‡¶¨‡¶∏‡¶æ‡¶á‡¶ü UI/UX ‡¶∞‡¶ø-‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ì ‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶á‡¶®‡ßç‡¶ü‡¶ø‡¶ó‡ßç‡¶∞‡ßá‡¶∂‡¶® (bKash/Nagad)',
      category: 'Web Development',
      budget: 14500,
      deadline: '‡ß® ‡¶¶‡¶ø‡¶®',
      rating: '4.9 (24 ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â)',
      isVerified: true,
      durationSec: 15,
      requirements: '‡¶Ü‡¶Æ‡¶æ‡¶¶‡ßá‡¶∞ ‡¶∞‡¶æ‡¶®‡¶ø‡¶Ç ‡¶´‡ßç‡¶Ø‡¶æ‡¶∂‡¶® ‡¶¨‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø Next.js ‡¶ì Tailwind CSS ‡¶¨‡ßá‡¶∏‡¶° ‡¶è‡¶ï‡¶ü‡¶ø ‡¶∞‡ßá‡¶∏‡¶™‡¶®‡¶∏‡¶ø‡¶≠ ‡¶Ö‡¶®‡¶≤‡¶æ‡¶á‡¶® ‡¶∏‡ßç‡¶ü‡ßã‡¶∞ ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§ ‡¶∏‡¶æ‡¶•‡ßá SSLCommerz/bKash ‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ó‡ßá‡¶ü‡¶ì‡¶Ø‡¶º‡ßá ‡¶è‡¶¨‡¶Ç ‡¶á‡¶®‡¶≠‡ßü‡ßá‡¶∏ ‡¶ú‡ßá‡¶®‡¶æ‡¶∞‡ßá‡¶∂‡¶® ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ ‡¶Ø‡ßÅ‡¶ï‡ßç‡¶§ ‡¶•‡¶æ‡¶ï‡¶¨‡ßá‡•§ Figma ‡¶´‡¶æ‡¶á‡¶≤ ‡¶™‡ßç‡¶∞‡¶∏‡ßç‡¶§‡ßÅ‡¶§ ‡¶Ü‡¶õ‡ßá‡•§',
      deliverables: [
        '‡¶´‡ßÅ‡¶≤ ‡¶∞‡ßá‡¶∏‡¶™‡¶®‡¶∏‡¶ø‡¶≠ ‡¶´‡ßç‡¶∞‡¶®‡ßç‡¶ü‡¶è‡¶®‡ßç‡¶° ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® (Next.js 14)',
        'SSLCommerz & bKash ‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ó‡ßá‡¶ü‡¶ì‡¶Ø‡¶º‡ßá ‡¶∏‡ßá‡¶ü‡¶Ü‡¶™',
        '‡¶Ö‡¶ü‡ßã‡¶Æ‡ßá‡¶ü‡ßá‡¶° SMS ‡¶ì ‡¶á‡¶Æ‡ßá‡¶á‡¶≤ ‡¶á‡¶®‡¶≠‡¶Ø‡¶º‡ßá‡¶∏ ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ',
        '‡ß≠ ‡¶¶‡¶ø‡¶®‡ßá‡¶∞ ‡¶´‡ßç‡¶∞‡¶ø ‡¶¨‡¶æ‡¶ó ‡¶´‡¶ø‡¶ï‡ßç‡¶∏‡¶ø‡¶Ç ‡¶ì‡¶Ø‡¶º‡¶æ‡¶∞‡ßá‡¶®‡ßç‡¶ü‡¶ø'
      ]
    },
    {
      id: 'live-ord-102',
      type: 'public',
      typeLabel: '‡¶≤‡¶æ‡¶á‡¶≠ ‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶ï ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶Ö‡¶´‡¶æ‡¶∞',
      source: 'Admin Panel Featured',
      clientName: '‡¶§‡¶æ‡¶®‡¶≠‡ßÄ‡¶∞ ‡¶π‡¶æ‡¶∏‡¶æ‡¶® (Dhaka IT Solutions)',
      clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶ö‡¶ü‡ßç‡¶ü‡¶ó‡ßç‡¶∞‡¶æ‡¶Æ, ‡¶¨‡¶æ‡¶Ç‡¶≤‡¶æ‡¶¶‡ßá‡¶∂',
      postedTime: '‡ß®‡ß´ ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü ‡¶Ü‡¶ó‡ßá',
      title: '‡¶≤‡¶æ‡¶∞‡¶æ‡¶≠‡ßá‡¶≤ ‡¶ì ‡¶∞‡¶ø‡ßü‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶ü ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞‡¶∂‡¶ø‡¶™ & ‡¶∞‡¶ø‡ßü‡ßá‡¶≤-‡¶ü‡¶æ‡¶á‡¶Æ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶∏‡ßá‡¶∂‡¶®',
      category: 'Live Mentorship',
      budget: 6000,
      deadline: '‡¶Ü‡¶ú‡¶ï‡ßá‡¶∞ ‡¶Æ‡¶ß‡ßç‡¶Ø‡ßá',
      rating: '5.0 (48 ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â)',
      isVerified: true,
      durationSec: 20,
      requirements: '‡¶Ü‡¶Æ‡¶æ‡¶¶‡ßá‡¶∞ ‡¶ú‡ßÅ‡¶®‡¶ø‡ßü‡¶∞ ‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶æ‡¶∞ ‡¶ü‡¶ø‡¶Æ‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡ß® ‡¶ò‡¶£‡ßç‡¶ü‡¶æ‡¶∞ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶°‡¶ø‡¶Ç ‡¶ì ‡¶™‡ßç‡¶∞‡¶¨‡¶≤‡ßá‡¶Æ ‡¶∏‡¶≤‡¶≠‡¶ø‡¶Ç ‡¶∏‡ßá‡¶∂‡¶® ‡¶™‡¶∞‡¶ø‡¶ö‡¶æ‡¶≤‡¶®‡¶æ ‡¶ï‡¶∞‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§ ‡¶Æ‡ßÇ‡¶≤ ‡¶´‡ßã‡¶ï‡¶æ‡¶∏: RESTful API ‡¶∏‡¶ø‡¶ï‡¶ø‡¶â‡¶∞‡¶ø‡¶ü‡¶ø, JWT ‡¶Ö‡¶•‡ßá‡¶®‡¶ü‡¶ø‡¶ï‡ßá‡¶∂‡¶® ‡¶è‡¶¨‡¶Ç ‡¶∏‡ßç‡¶ü‡ßá‡¶ü ‡¶Æ‡ßç‡¶Ø‡¶æ‡¶®‡ßá‡¶ú‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡•§',
      deliverables: [
        '‡ß® ‡¶ò‡¶£‡ßç‡¶ü‡¶æ‡¶∞ ‡¶ì‡ßü‡¶æ‡¶®-‡¶ü‡ßÅ-‡¶ì‡ßü‡¶æ‡¶® ‡¶ó‡ßÅ‡¶ó‡¶≤ ‡¶Æ‡¶ø‡¶ü ‡¶∏‡ßá‡¶∂‡¶®',
        '‡¶ï‡ßã‡¶° ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶ì ‡¶∏‡¶ø‡¶ï‡¶ø‡¶â‡¶∞‡¶ø‡¶ü‡¶ø ‡¶Ö‡¶°‡¶ø‡¶ü ‡¶ó‡¶æ‡¶á‡¶°‡¶≤‡¶æ‡¶á‡¶®',
        '‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶Ü‡¶∞‡ßç‡¶ï‡¶ø‡¶ü‡ßá‡¶ï‡¶ö‡¶æ‡¶∞ ‡¶∏‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡¶≤ ‡¶∞‡ßá‡¶™‡ßã'
      ]
    },
    {
      id: 'live-ord-103',
      type: 'personal',
      typeLabel: '‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡¶æ‡¶∞‡ßç‡¶∏‡ßã‡¶®‡¶æ‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞',
      source: 'Client Direct Request',
      clientName: '‡¶´‡¶æ‡¶∞‡¶π‡¶æ‡¶®‡¶æ ‡¶ö‡ßå‡¶ß‡ßÅ‡¶∞‡ßÄ (NexGen Agency)',
      clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶¨‡¶®‡¶æ‡¶®‡ßÄ, ‡¶¢‡¶æ‡¶ï‡¶æ',
      postedTime: '‡ßß ‡¶ò‡¶£‡ßç‡¶ü‡¶æ ‡¶Ü‡¶ó‡ßá',
      title: '‡¶Æ‡ßã‡¶¨‡¶æ‡¶á‡¶≤ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™ ‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡¶ø‡¶® ‡¶™‡ßç‡¶∞‡ßã‡¶ü‡ßã‡¶ü‡¶æ‡¶á‡¶™‡¶ø‡¶Ç (Figma to Flutter/React Native)',
      category: 'UI/UX Design',
      budget: 8500,
      deadline: '‡ß®‡ß™ ‡¶ò‡¶£‡ßç‡¶ü‡¶æ',
      rating: '5.0 (19 ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â)',
      isVerified: true,
      durationSec: 12,
      requirements: '‡¶è‡¶ï‡¶ü‡¶ø ‡¶π‡ßá‡¶≤‡¶•-‡¶ü‡ßá‡¶ï ‡¶∏‡ßç‡¶ü‡¶æ‡¶∞‡ßç‡¶ü‡¶Ü‡¶™‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡ßß‡ß®‡¶ü‡¶ø ‡¶™‡ßç‡¶∞‡¶ø‡¶Æ‡¶ø‡ßü‡¶æ‡¶Æ ‡¶Æ‡ßã‡¶¨‡¶æ‡¶á‡¶≤ ‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡¶ø‡¶®‡ßá‡¶∞ ‡¶Ü‡¶ß‡ßÅ‡¶®‡¶ø‡¶ï Figma ‡¶™‡ßç‡¶∞‡ßã‡¶ü‡ßã‡¶ü‡¶æ‡¶á‡¶™ ‡¶ì ‡¶ï‡¶Æ‡ßç‡¶™‡ßã‡¶®‡ßá‡¶®‡ßç‡¶ü ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ï‡¶∞‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§ ‡¶°‡¶æ‡¶∞‡ßç‡¶ï ‡¶ì ‡¶≤‡¶æ‡¶á‡¶ü ‡¶Æ‡ßã‡¶° ‡¶â‡¶≠‡ßü‡¶á ‡¶•‡¶æ‡¶ï‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§',
      deliverables: [
        '‡ßß‡ß®‡¶ü‡¶ø ‡¶´‡ßÅ‡¶≤ ‡¶á‡¶®‡ßç‡¶ü‡¶æ‡¶∞‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶ü‡¶ø‡¶≠ Figma ‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡¶ø‡¶®',
        '‡¶Ö‡¶ü‡ßã-‡¶≤‡ßá‡¶Ü‡¶â‡¶ü ‡¶è‡¶¨‡¶Ç ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ü‡ßã‡¶ï‡ßá‡¶®‡¶∏',
        '‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶æ‡¶∞ ‡¶π‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶Ö‡¶´ ‡¶∞‡ßá‡¶°‡¶ø ‡¶è‡¶∏‡ßá‡¶ü‡¶∏'
      ]
    },
    {
      id: 'live-ord-104',
      type: 'public',
      typeLabel: '‚ö° ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶Ö‡¶´‡¶æ‡¶∞',
      source: 'Client Direct Request',
      clientName: '‡¶∞‡¶æ‡¶ï‡¶ø‡¶¨ ‡¶Ü‡¶π‡¶Æ‡ßá‡¶¶',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶∏‡¶ø‡¶≤‡ßá‡¶ü, ‡¶¨‡¶æ‡¶Ç‡¶≤‡¶æ‡¶¶‡ßá‡¶∂',
      postedTime: '‡ß® ‡¶ò‡¶£‡ßç‡¶ü‡¶æ ‡¶Ü‡¶ó‡ßá',
      title: '‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶°‡¶ø‡¶ú‡¶ø‡¶ü‡¶æ‡¶≤ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç ‡¶ì ‡¶´‡ßá‡¶∏‡¶¨‡ßÅ‡¶ï ‡¶è‡¶°‡¶∏ ‡¶ï‡¶®‡¶∏‡¶æ‡¶≤‡¶ü‡ßá‡¶∂‡¶® ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï',
      category: 'Digital Marketing',
      budget: 4500,
      deadline: '‡ß© ‡¶¶‡¶ø‡¶®',
      rating: '4.8 (12 ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â)',
      isVerified: true,
      durationSec: 18,
      requirements: '‡¶è‡¶ï‡¶ü‡¶ø ‡¶á-‡¶ï‡¶Æ‡¶æ‡¶∞‡ßç‡¶∏ ‡¶¨‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶Æ‡ßá‡¶ü‡¶æ ‡¶ì ‡¶ó‡ßÅ‡¶ó‡¶≤ ‡¶è‡¶°‡¶∏ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡ßá‡¶á‡¶® ‡¶∏‡ßá‡¶ü‡¶Ü‡¶™, ‡¶™‡¶ø‡¶ï‡ßç‡¶∏‡ßá‡¶≤ ‡¶ü‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶ï‡¶ø‡¶Ç ‡¶è‡¶¨‡¶Ç ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶Ö‡¶°‡¶ø‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶∏ ‡¶´‡¶æ‡¶®‡ßá‡¶≤ ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§',
      deliverables: [
        '‡¶ü‡¶æ‡¶∞‡ßç‡¶ó‡ßá‡¶ü‡ßá‡¶° ‡¶è‡¶°‡¶∏ ‡¶∏‡ßç‡¶ü‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶ü‡ßá‡¶ú‡¶ø ‡¶™‡ßç‡¶≤‡ßç‡¶Ø‡¶æ‡¶®',
        'ROAS ‡¶Ö‡¶™‡¶ü‡¶ø‡¶Æ‡¶æ‡¶á‡¶ú‡ßá‡¶∂‡¶® ‡¶ó‡¶æ‡¶á‡¶°',
        '‡¶ï‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡ßá‡¶á‡¶® ‡¶Æ‡¶®‡¶ø‡¶ü‡¶∞‡¶ø‡¶Ç ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü'
      ]
    },
    {
      id: 'live-course-105',
      type: 'course',
      typeLabel: '‚ö° ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶è‡¶®‡¶∞‡ßã‡¶≤‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶´‡¶æ‡¶∞',
      source: 'PTENit Admin Official',
      clientName: 'PTENit IT Academy (‡¶Æ‡ßá‡¶á‡¶® ‡¶è‡¶°‡¶Æ‡¶ø‡¶®)',
      clientAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶Æ‡¶ø‡¶∞‡¶™‡ßÅ‡¶∞-‡ßß‡ß¶, ‡¶¢‡¶æ‡¶ï‡¶æ (‡¶Ö‡¶´‡¶ø‡¶∂‡¶ø‡¶Ø‡¶º‡¶æ‡¶≤)',
      postedTime: '‡ßß‡ß¶ ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü ‡¶Ü‡¶ó‡ßá',
      title: '‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶´‡ßÅ‡¶≤-‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï ‡¶ì‡¶Ø‡¶º‡ßá‡¶¨ ‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶Æ‡ßá‡¶®‡ßç‡¶ü (Next.js, Node.js & AI Masterclass)',
      category: 'Full-Stack Development',
      budget: 12500,
      deadline: '‡ß®‡ß™‡¶ü‡¶ø ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‚Ä¢ ‡ß™‡¶ü‡¶ø ‡¶Æ‡¶°‡¶ø‡¶â‡¶≤',
      rating: '5.0 (‡¶Ö‡¶´‡¶ø‡¶∂‡¶ø‡¶Ø‡¶º‡¶æ‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏)',
      isVerified: true,
      durationSec: 20,
      requirements: 'PTENit ‡¶è‡¶ï‡¶æ‡¶°‡ßá‡¶Æ‡¶ø ‡¶ï‡¶∞‡ßç‡¶§‡ßÉ‡¶ï ‡¶®‡¶ø‡¶∞‡ßç‡¶ß‡¶æ‡¶∞‡¶ø‡¶§ ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö‡•§ ‡¶á‡¶®‡ßç‡¶∏‡¶ü‡ßç‡¶∞‡¶æ‡¶ï‡ßç‡¶ü‡¶∞ ‡¶π‡¶ø‡¶∏‡ßá‡¶¨‡ßá ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡ßá ‡¶∏‡¶∞‡¶æ‡¶∏‡¶∞‡¶ø ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‡¶ì ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶™‡¶∞‡¶ø‡¶ö‡¶æ‡¶≤‡¶®‡¶æ ‡¶ï‡¶∞‡¶§‡ßá ‡¶™‡¶æ‡¶∞‡¶¨‡ßá‡¶®‡•§ ‡ß©‡ß´% ‡¶ï‡¶Æ‡¶ø‡¶∂‡¶® ‡¶∏‡¶Æ‡ßç‡¶Æ‡¶æ‡¶®‡¶ø‡¶Ø‡¶º‡¶æ‡¶Æ ‡¶á‡¶®‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶ü ‡¶ú‡¶Æ‡¶æ ‡¶π‡¶¨‡ßá‡•§',
      deliverables: [
        '‡ß®‡ß™‡¶ü‡¶ø ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‡¶≤‡ßá‡¶ï‡¶ö‡¶æ‡¶∞',
        '‡ß™‡¶ü‡¶ø ‡¶∞‡¶ø‡¶Ø‡¶º‡ßá‡¶≤-‡¶ü‡¶æ‡¶á‡¶Æ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ì ‡¶ï‡ßã‡¶° ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â',
        '‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶´‡¶ø‡¶°‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï ‡¶ì ‡¶∏‡¶æ‡¶∞‡ßç‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶ü ‡¶™‡ßç‡¶∞‡¶¶‡¶æ‡¶®'
      ]
    },
    {
      id: 'live-course-106',
      type: 'course',
      typeLabel: '‚ö° ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶è‡¶®‡¶∞‡ßã‡¶≤‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶´‡¶æ‡¶∞',
      source: 'PTENit Admin Official',
      clientName: 'PTENit Academy Admin',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶Æ‡¶ø‡¶∞‡¶™‡ßÅ‡¶∞-‡ßß‡ß¶, ‡¶¢‡¶æ‡¶ï‡¶æ',
      postedTime: '‡ß´ ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü ‡¶Ü‡¶ó‡ßá',
      title: '‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶°‡¶ø‡¶ú‡¶ø‡¶ü‡¶æ‡¶≤ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç & ‡¶Æ‡ßá‡¶ü‡¶æ ‡¶è‡¶°‡¶∏ ‡¶´‡¶æ‡¶®‡ßá‡¶≤ (‡¶≤‡¶æ‡¶á‡¶≠ ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ö ‡ß®‡ß¶‡ß®‡ß¨)',
      category: 'Digital Marketing',
      budget: 8500,
      deadline: '‡ßß‡ßÆ‡¶ü‡¶ø ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‚Ä¢ ‡ß©‡¶ü‡¶ø ‡¶Æ‡¶°‡¶ø‡¶â‡¶≤',
      rating: '5.0 (‡¶Ö‡¶´‡¶ø‡¶∂‡¶ø‡¶Ø‡¶º‡¶æ‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏)',
      isVerified: true,
      durationSec: 18,
      requirements: '‡¶°‡¶ø‡¶ú‡¶ø‡¶ü‡¶æ‡¶≤ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç ‡¶ì ‡¶Æ‡ßá‡¶ü‡¶æ ‡¶è‡¶°‡¶∏ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡ßá‡¶á‡¶®‡ßá‡¶∞ ‡¶ì‡¶™‡¶∞ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶∏‡ßá‡¶∂‡¶® ‡¶™‡¶∞‡¶ø‡¶ö‡¶æ‡¶≤‡¶®‡¶æ ‡¶ï‡¶∞‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§ ‡¶∏‡ßç‡¶ü‡ßÅ‡¶°‡ßá‡¶®‡ßç‡¶ü‡¶¶‡ßá‡¶∞ ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶è‡¶°‡¶∏ ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶™‡ßç‡¶∞‡¶¶‡¶æ‡¶® ‡¶Ü‡¶¨‡¶∂‡ßç‡¶Ø‡¶ï‡•§',
      deliverables: [
        '‡ßß‡ßÆ‡¶ü‡¶ø ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶™‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶ï‡¶ü‡¶ø‡¶ï‡ßç‡¶Ø‡¶æ‡¶≤ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏',
        '‡¶Æ‡ßá‡¶ü‡¶æ ‡¶ì ‡¶ó‡ßÅ‡¶ó‡¶≤ ‡¶è‡¶°‡¶∏ ‡¶´‡¶æ‡¶®‡ßá‡¶≤ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü',
        '‡¶∏‡ßç‡¶ü‡ßÅ‡¶°‡ßá‡¶®‡ßç‡¶ü ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶´‡¶ø‡¶°‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï'
      ]
    },
    {
      id: 'live-course-107',
      type: 'course',
      typeLabel: '‚ö° ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶è‡¶®‡¶∞‡ßã‡¶≤‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶´‡¶æ‡¶∞',
      source: 'PTENit Admin Official',
      clientName: 'PTENit Tech Team',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      clientLocation: '‡¶â‡¶§‡ßç‡¶§‡¶∞‡¶æ, ‡¶¢‡¶æ‡¶ï‡¶æ',
      postedTime: '‡ßß ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü ‡¶Ü‡¶ó‡ßá',
      title: 'UI/UX ‡¶ì ‡¶™‡ßç‡¶∞‡ßã‡¶°‡¶æ‡¶ï‡ßç‡¶ü ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶Æ‡¶æ‡¶∏‡ßç‡¶ü‡¶æ‡¶∞‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ (Figma, Design System & Portfolio)',
      category: 'UI/UX Design',
      budget: 9500,
      deadline: '‡ß®‡ß¶‡¶ü‡¶ø ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‚Ä¢ ‡ß™‡¶ü‡¶ø ‡¶Æ‡¶°‡¶ø‡¶â‡¶≤',
      rating: '5.0 (‡¶Ö‡¶´‡¶ø‡¶∂‡¶ø‡¶Ø‡¶º‡¶æ‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏)',
      isVerified: true,
      durationSec: 20,
      requirements: 'Figma ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ, ‡¶Ö‡¶ü‡ßã-‡¶≤‡ßá‡¶Ü‡¶â‡¶ü ‡¶è‡¶¨‡¶Ç ‡¶Æ‡ßã‡¶¨‡¶æ‡¶á‡¶≤/‡¶ì‡¶Ø‡¶º‡ßá‡¶¨ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶∂‡ßá‡¶ñ‡¶æ‡¶§‡ßá ‡¶π‡¶¨‡ßá‡•§',
      deliverables: [
        '‡ß®‡ß¶‡¶ü‡¶ø ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶∏‡ßá‡¶∂‡¶®',
        '‡ß®‡¶ü‡¶ø ‡¶∞‡¶ø‡¶Ø‡¶º‡ßá‡¶≤ ‡¶™‡ßç‡¶∞‡ßã‡¶°‡¶æ‡¶ï‡ßç‡¶ü ‡¶ï‡ßá‡¶∏ ‡¶∏‡ßç‡¶ü‡¶æ‡¶°‡¶ø',
        '‡¶™‡ßã‡¶∞‡ßç‡¶ü‡¶´‡ßã‡¶≤‡¶ø‡¶ì ‡¶¨‡¶ø‡¶≤‡ßç‡¶°‡¶ø‡¶Ç ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â'
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
  const [sellerHomeShowcaseTab, setSellerHomeShowcaseTab] = useState<'gigs' | 'offers'>('gigs');
  const [showAllSellerGigs, setShowAllSellerGigs] = useState(false);
  const [homeOrderFilter, setHomeOrderFilter] = useState<'all' | 'in_progress' | 'pending' | 'in_review' | 'completed'>('all');
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

  // Helper to get Gig-style high-quality thumbnail for incoming live orders
  const getOfferThumbnail = (offer: LiveOfferItem): string => {
    if (offer.type === "course" || offer.typeLabel?.includes("‡¶ï‡ßã‡¶∞‡ßç‡¶∏") || offer.title?.toLowerCase().includes("‡¶ï‡ßã‡¶∞‡ßç‡¶∏")) {
      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80";
    }
    const cat = (offer.category || "").toLowerCase();
    const title = (offer.title || "").toLowerCase();
    if (cat.includes("web") || title.includes("website") || title.includes("‡¶ì‡ßü‡ßá‡¶¨‡¶∏‡¶æ‡¶á‡¶ü") || title.includes("‡¶á-‡¶ï‡¶Æ‡¶æ‡¶∞‡ßç‡¶∏") || title.includes("next.js") || title.includes("fullstack") || title.includes("‡¶´‡ßÅ‡¶≤-‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï")) {
      return "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=600&q=80";
    }
    if (cat.includes("ui") || cat.includes("ux") || cat.includes("design") || title.includes("figma") || title.includes("‡¶™‡ßç‡¶∞‡ßã‡¶ü‡ßã‡¶ü‡¶æ‡¶á‡¶™") || title.includes("‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™") || title.includes("‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶®")) {
      return "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80";
    }
    if (cat.includes("marketing") || cat.includes("‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç") || title.includes("‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç") || title.includes("‡¶è‡¶°‡¶∏") || title.includes("ads") || title.includes("seo")) {
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80";
    }
    if (cat.includes("mentor") || cat.includes("‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞") || title.includes("‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞") || title.includes("‡¶≤‡¶æ‡¶∞‡¶æ‡¶≠‡ßá‡¶≤") || title.includes("‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü")) {
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80";
    }
    return offer.clientAvatar || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80";
  };

  // Handle Receive Action (Creates order in marketplaceOrders with 'pending' status and switches to pending tab)
  const handleReceiveLiveOffer = (offer: LiveOfferItem) => {
    // Instantly stop ringing chime
    stopOfferNotificationSound();
    setJustActionedOfferId(offer.id);
    setOfferActionType('received');

    const isCourseOffer = offer.type === 'course' || offer.typeLabel.includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏') || offer.title.toLowerCase().includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏');

    if (isCourseOffer) {
      const matchedCourse = courses.find(c => c.offerStatus === 'offered' && (c.id === offer.id || c.title.toLowerCase().includes(offer.title.toLowerCase().substring(0, 10))));
      if (matchedCourse) {
        acceptCourseOffer(matchedCourse.id, currentUser?.id, currentUser?.name);
      } else {
        const newCourseId = `course-offer-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        addCourse({
          title: offer.title,
          category: offer.category || 'Professional Course',
          instructor: currentUser?.name || '‡¶§‡¶æ‡¶®‡¶≠‡ßÄ‡¶∞ ‡¶Ü‡¶π‡¶Æ‡ßá‡¶¶',
          assignedInstructorId: currentUser?.id || 'teacher-1',
          level: 'professional',
          duration: offer.deadline || '4 Weeks',
          lessonsCount: 16,
          isFree: false,
          price: offer.budget || 8500,
          thumbnail: offer.clientAvatar || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
          description: offer.requirements || offer.title,
          whatYouWillLearn: offer.deliverables && offer.deliverables.length > 0 ? offer.deliverables : ['‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶∏‡ßç‡¶ï‡¶ø‡¶≤‡¶∏ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏', '‡¶∞‡¶ø‡¶Ø‡¶º‡ßá‡¶≤ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ì ‡¶ï‡ßã‡¶° ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â', '‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶´‡¶ø‡¶°‡¶¨‡ßç‡¶Ø‡¶æ‡¶ï ‡¶ì ‡¶∏‡¶æ‡¶∞‡ßç‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶ü ‡¶™‡ßç‡¶∞‡¶¶‡¶æ‡¶®'],
          requirements: ['‡¶ï‡¶Æ‡ßç‡¶™‡¶ø‡¶â‡¶ü‡¶æ‡¶∞ ‡¶¨‡¶æ ‡¶á‡¶®‡ßç‡¶ü‡¶æ‡¶∞‡¶®‡ßá‡¶ü ‡¶∏‡¶Ç‡¶Ø‡ßã‡¶ú‡¶®'],
          tags: ['#PTENit', '#LiveCourse'],
          modules: [
            {
              id: `m-1-${Date.now()}`,
              title: '‡¶Æ‡¶°‡¶ø‡¶â‡¶≤ ‡ßß: ‡¶ì‡¶∞‡¶ø‡ßü‡ßá‡¶®‡ßç‡¶ü‡ßá‡¶∂‡¶® ‡¶ì ‡¶Æ‡ßÇ‡¶≤ ‡¶¨‡¶ø‡¶∑‡ßü‡¶¨‡¶∏‡ßç‡¶§‡ßÅ',
              lessons: [
                { id: `l-1-${Date.now()}`, title: '‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‡ßß: ‡¶™‡¶∞‡¶ø‡¶ö‡¶ø‡¶§‡¶ø ‡¶ì ‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶ì‡¶≠‡¶æ‡¶∞‡¶≠‡¶ø‡¶â', duration: '‡ß™‡ß´ ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü', isFree: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
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

      setSwitchSuccessMsg(`üéâ '${offer.title}' ‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá ‚Ä¢ ‡ß≥${offer.budget.toLocaleString()}`);
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
        sellerName: currentUser?.name || '‡¶™‡ßç‡¶∞‡¶ï‡ßå‡¶∂‡¶≤‡ßÄ ‡¶Ü‡¶≤-‡¶Ü‡¶Æ‡¶ø‡¶®',
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
      setSwitchSuccessMsg(`üéâ '${offer.title}' ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá ‚Ä¢ ‡ß≥${offer.budget.toLocaleString()}`);
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

    setSwitchSuccessMsg(`‚ö†Ô∏è '${offer.title.substring(0, 30)}...' ‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá`);
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

  const savedGigs = useMemo(() => {
    let list = gigs.filter(g => savedGigIds.includes(g.id));
    if (savedCategoryFilter === 'top') {
      list = list.filter(g => (g.rating || 0) >= 4.8);
    } else if (savedCategoryFilter && savedCategoryFilter !== 'all') {
      list = list.filter(g => g.category === savedCategoryFilter || (g.category && g.category.toLowerCase().includes(savedCategoryFilter.toLowerCase())));
    }
    if (savedSearchQuery.trim()) {
      const q = savedSearchQuery.toLowerCase();
      list = list.filter(g => g.title.toLowerCase().includes(q) || (g.sellerName && g.sellerName.toLowerCase().includes(q)) || (g.category && g.category.toLowerCase().includes(q)));
    }
    if (savedGigsSort === 'price_asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (savedGigsSort === 'price_desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (savedGigsSort === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (savedGigsSort === 'popular') {
      list = [...list].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }
    return list;
  }, [gigs, savedGigIds, savedSearchQuery, savedCategoryFilter, savedGigsSort]);

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
      alert('‡¶¶‡ßü‡¶æ ‡¶ï‡¶∞‡ßá ‡¶ï‡¶ø‡¶õ‡ßÅ ‡¶ñ‡¶∏‡ßú‡¶æ ‡¶ü‡¶æ‡¶á‡¶ü‡ßá‡¶≤ ‡¶¨‡¶æ ‡¶¨‡¶∞‡ßç‡¶£‡¶®‡¶æ ‡¶≤‡¶ø‡¶ñ‡ßÅ‡¶®!');
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
      alert('‡¶¶‡ßü‡¶æ ‡¶ï‡¶∞‡ßá ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ Behance, GitHub ‡¶¨‡¶æ LinkedIn ‡¶≤‡¶ø‡¶ô‡ßç‡¶ï ‡¶ü‡¶æ‡¶á‡¶™ ‡¶ï‡¶∞‡ßÅ‡¶®!');
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

  // Quick helpers to auto-fill Standard / Premium from Basic
  const handleCopyBasicToStandard = () => {
    if (!newStandardTitle || newStandardTitle === 'Standard Pro') {
      setNewStandardTitle((newBasicTitle || 'Standard') + ' Pro');
    }
    if (!newStandardPrice || newStandardPrice === 6000) {
      setNewStandardPrice(Math.round((Number(newBasicPrice) || 2500) * 2.2));
    }
    if (!newStandardDesc) {
      setNewStandardDesc(newBasicDesc || '‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶° ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶°‡¶≠‡¶æ‡¶®‡ßç‡¶∏‡¶° ‡¶´‡¶ø‡¶ö‡¶æ‡¶∞ ‡¶ì ‡¶∞‡ßá‡¶∏‡¶™‡¶®‡ßç‡¶∏‡¶ø‡¶≠ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶Ö‡¶®‡ßç‡¶§‡¶∞‡ßç‡¶≠‡ßÅ‡¶ï‡ßç‡¶§‡•§');
    }
  };

  const handleCopyStandardToPremium = () => {
    if (!newPremiumTitle || newPremiumTitle === 'Premium Enterprise') {
      setNewPremiumTitle((newStandardTitle || newBasicTitle || 'Premium') + ' VIP Enterprise');
    }
    if (!newPremiumPrice || newPremiumPrice === 15000) {
      setNewPremiumPrice(Math.round((Number(newStandardPrice) || 6000) * 2.5));
    }
    if (!newPremiumDesc) {
      setNewPremiumDesc(newStandardDesc || '‡¶´‡ßÅ‡¶≤ ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï ‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü, ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ API ‡¶ì ‡¶≠‡¶ø‡¶Ü‡¶á‡¶™‡¶ø ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶Ö‡¶®‡ßç‡¶§‡¶∞‡ßç‡¶≠‡ßÅ‡¶ï‡ßç‡¶§‡•§');
    }
  };

  // Handle Create Order Submit (3-Package Dedicated Page)
  const handleCreateGigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (openAuthModal) openAuthModal();
      return;
    }
    if (!newGigTitle || !newGigDesc) {
      alert('‡¶Ö‡¶®‡ßÅ‡¶ó‡ßç‡¶∞‡¶π ‡¶ï‡¶∞‡ßá ‡¶ó‡¶ø‡¶ó ‡¶ü‡¶æ‡¶á‡¶ü‡ßá‡¶≤ ‡¶è‡¶¨‡¶Ç ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ ‡¶™‡ßÇ‡¶∞‡¶£ ‡¶ï‡¶∞‡ßÅ‡¶®‡•§');
      return;
    }

    // Enforce max 6 gigs limit per seller
    const userGigCount = gigs.filter(g =>
      (currentUser.id && g.sellerId === currentUser.id) ||
      (currentUser.name && g.sellerName.toLowerCase() === currentUser.name.toLowerCase())
    ).length;

    if (userGigCount >= 6) {
      alert('‡¶¶‡ßÅ‡¶É‡¶ñ‡¶ø‡¶§! ‡¶è‡¶ï‡¶ú‡¶® ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞/‡¶¨‡ßç‡¶Ø‡¶ï‡ßç‡¶§‡¶ø ‡¶π‡¶ø‡¶∏‡ßá‡¶¨‡ßá ‡¶Ü‡¶™‡¶®‡¶ø ‡¶∏‡¶∞‡ßç‡¶¨‡ßã‡¶ö‡ßç‡¶ö ‡ß¨‡¶ü‡¶ø‡¶∞ ‡¶¨‡ßá‡¶∂‡¶ø ‡¶ó‡¶ø‡¶ó ‡¶§‡ßà‡¶∞‡¶ø ‡¶¨‡¶æ ‡¶Ü‡¶™‡¶≤‡ßã‡¶° ‡¶ï‡¶∞‡¶§‡ßá ‡¶™‡¶æ‡¶∞‡¶¨‡ßá‡¶® ‡¶®‡¶æ‡•§ ‡¶®‡¶§‡ßÅ‡¶® ‡¶ó‡¶ø‡¶ó ‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶ï‡¶∞‡¶§‡ßá ‡¶ö‡¶æ‡¶á‡¶≤‡ßá ‡¶™‡ßÇ‡¶∞‡ßç‡¶¨‡ßá‡¶∞ ‡¶ï‡ßã‡¶®‡ßã ‡¶ó‡¶ø‡¶ó ‡¶°‡¶ø‡¶≤‡ßá‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®‡•§');
      return;
    }

    createGig({
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerLevel: 'Level 2 Freelancer',
      title: newGigTitle,
      category: newGigCategory,
      status: 'active',
      offerBadge: newGigOfferBadge || '‡ß©‡ß¶% ‡¶õ‡¶æ‡ßú',
      thumbnail: newGigThumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      galleryImages: newGigGalleryPic ? [newGigGalleryPic] : [],
      videoUrl: newGigVideoUrl || undefined,
      tags: newGigTags ? newGigTags.split(',').map(t => t.trim()).filter(Boolean) : [],
      description: newGigDesc,
      packages: {
        basic: {
          name: newBasicTitle || 'Basic Starter',
          price: Number(newBasicPrice) || 2500,
          deliveryDays: Number(newBasicDelivery) || 3,
          revisions: newBasicRevisions || '1',
          description: newBasicDesc || '‡¶ï‡ßã‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶ì ‡¶∏‡ßã‡¶∞‡ßç‡¶∏ ‡¶´‡¶æ‡¶á‡¶≤ ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø',
          features: ['Source Code File', 'Responsive Layout', 'Basic Support']
        },
        standard: {
          name: newStandardTitle || 'Standard Pro',
          price: Number(newStandardPrice) || 6000,
          deliveryDays: Number(newStandardDelivery) || 2,
          revisions: newStandardRevisions || '3',
          description: newStandardDesc || '‡¶´‡ßÅ‡¶≤ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶∏‡ßá‡¶ü‡¶Ü‡¶™ ‡¶ì ‡¶°‡¶æ‡¶ü‡¶æ‡¶¨‡ßá‡¶ú ‡¶á‡¶®‡ßç‡¶ü‡¶ø‡¶ó‡ßç‡¶∞‡ßá‡¶∂‡¶®',
          features: ['Source Code File', 'Responsive Layout', 'Commercial Use', 'Database Integration']
        },
        premium: {
          name: newPremiumTitle || 'Premium Enterprise',
          price: Number(newPremiumPrice) || 15000,
          deliveryDays: Number(newPremiumDelivery) || 1,
          revisions: newPremiumRevisions || 'Unlimited',
          description: newPremiumDesc || '‡¶ï‡¶Æ‡¶™‡ßç‡¶≤‡¶ø‡¶ü ‡¶´‡ßÅ‡¶≤ ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶ï ‡¶∏‡¶≤‡ßç‡¶Ø‡ßÅ‡¶∂‡¶® ‡¶ì ‡¶≤‡¶æ‡¶á‡¶´‡¶ü‡¶æ‡¶á‡¶Æ ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü',
          features: ['Source Code File', 'Responsive Layout', 'Commercial Use', 'Database Integration', 'API Connect', '30 Days VIP Support']
        }
      }
    });

    setCreateGigSuccess(true);
    setTimeout(() => {
      setCreateGigSuccess(false);
      setSellerSubTab('gigs');
      setNewGigTitle('');
      setNewGigOfferBadge('‡ß©‡ß¶% ‡¶õ‡¶æ‡ßú');
      setNewGigDesc('');
      setNewGigThumbnail('');
      setNewGigGalleryPic('');
      setNewGigVideoUrl('');
      setNewGigTags('');
      setNewGigRequirements('');
      setNewGigFaqs([{ id: Date.now().toString(), question: '', answer: '' }]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
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
      alert('‡¶¶‡ßü‡¶æ ‡¶ï‡¶∞‡ßá ‡¶ï‡ßç‡¶Ø‡¶æ‡¶∂‡¶Ü‡¶â‡¶ü‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶∏‡¶†‡¶ø‡¶ï ‡¶ü‡¶æ‡¶ï‡¶æ‡¶∞ ‡¶™‡¶∞‡¶ø‡¶Æ‡¶æ‡¶£ ‡¶™‡ßç‡¶∞‡¶¶‡¶æ‡¶® ‡¶ï‡¶∞‡ßÅ‡¶®!');
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
    setCashoutSuccessMsg(`‚úì ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡ß≥${numAmt.toLocaleString('bn-BD')} ‡¶¨‡¶ø‡¶≤ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶∂‡¶Ü‡¶â‡¶ü ‡¶Ü‡¶¨‡ßá‡¶¶‡¶® ‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá ‡¶ú‡¶Æ‡¶æ ‡¶¶‡ßá‡¶ì‡ßü‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá! ‡ß®‡ß™ ‡¶ò‡¶£‡ßç‡¶ü‡¶æ‡¶∞ ‡¶Æ‡¶ß‡ßç‡¶Ø‡ßá ‡¶ü‡¶æ‡¶ï‡¶æ ‡¶™‡ßç‡¶∞‡¶∏‡ßá‡¶∏ ‡¶ï‡¶∞‡¶æ ‡¶π‡¶¨‡ßá‡•§`);
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
    <div id="marketplace-top" className="pt-0 pb-6 sm:py-6 px-2 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full max-w-[1920px] mx-auto space-y-2 sm:space-y-6 font-sans text-slate-900 dark:text-slate-100 min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 md:pb-8">
      
      {/* PTENit MODERN FIVERR-STYLE MARKETPLACE HEADER (MATCHING PTENIT NAVBAR COLOR & STYLE) */}
      {!selectedGig && !(viewMode === 'selling' && sellerSubTab === 'create_gig') && (
        <div className={`fixed sm:sticky top-0 left-0 right-0 sm:left-auto sm:right-auto z-40 bg-[#0B132B] text-white px-2 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-0 sm:mb-6 shadow-none sm:shadow-md ${
          ['overview', 'my-orders', 'my-courses', 'saved_gigs', 'settings', 'post-project', 'public-offers'].includes(activeSubTab) ? 'md:hidden' : ''
        }`}>
          <div className="w-full max-w-[1920px] mx-auto py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* MOBILE VIEW HEADER (< md screen: Facebook Lite Style Header & Merged Icon Navigation) */}
          <div className="flex md:hidden flex-col gap-2 w-full font-bengali">
            {/* Top Bar: Brand, Search, Profile, Menu - ONLY visible on Home/Gigs tab */}
            {(((activeSubTab === 'gigs' && viewMode === 'buying') || (viewMode === 'selling' && sellerSubTab === 'gigs')) && !isInboxModalOpen && !isNotificationsOpen) && (
              <div className="flex items-center justify-between gap-1.5 w-full">
                {/* Left: PTENit Brand Logo */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGig(null);
                    if (viewMode === 'selling') {
                      setSpecialistMainTab('marketplace');
                      setSellerSubTab('gigs');
                    } else {
                      setViewMode('buying');
                      setActiveSubTab('gigs');
                      setSelectedCategory('All');
                    }
                    setSearchQuery('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-left cursor-pointer shrink-0 group"
                  title="‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶∞‡¶ø‡¶´‡ßç‡¶∞‡ßá‡¶∂"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-bold text-base text-white shadow-md shadow-[#1DB954]/20 shrink-0">
                    P
                  </div>
                  <span className="font-heading text-base font-black tracking-wider text-white">
                    PTEN<span className="text-[#1DB954]">it</span>
                  </span>
                </button>

                {/* Mobile Inline Search Bar - UNIVERSAL FOR BOTH BUYER AND SELLER */}
                <div className="flex-1 min-w-0 mx-1 relative items-center">
                  <div className="relative w-full flex items-center">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={viewMode === 'selling' ? "‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶¨‡¶æ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®..." : "‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®..."}
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
                        <span>‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π ({filteredGigs.length})</span>
                        <span className="text-[9px] text-[#1DB954] font-normal">‡¶≤‡¶æ‡¶á‡¶≠ ‡¶´‡¶≤‡¶æ‡¶´‡¶≤</span>
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
                                      ‡ß≥{gigPrice.toLocaleString('en-US')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-slate-400 py-3 text-xs font-bengali">
                          ‡¶ï‡ßã‡¶®‡ßã ‡¶ó‡¶ø‡¶ó ‡¶¨‡¶æ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶™‡¶æ‡¶ì‡ßü‡¶æ ‡¶Ø‡¶æ‡ßü‡¶®‡¶ø‡•§
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
                            className="w-full py-1.5 px-2.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition font-bengali cursor-pointer shadow"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>‡¶∏‡¶ï‡¶≤ ‡¶´‡¶≤‡¶æ‡¶´‡¶≤ ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶® ({filteredGigs.length} ‡¶ü‡¶ø)</span>
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
                      title="‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶Æ‡ßá‡¶®‡ßÅ"
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
                      ‡¶≤‡¶ó‡¶á‡¶®
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMarketplaceMenuOpen(!isMobileMarketplaceMenuOpen);
                      setIsProfileDropdownOpen(false);
                    }}
                    className="p-1 text-slate-200 hover:text-white cursor-pointer"
                    title="‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶Æ‡ßá‡¶®‡ßÅ"
                  >
                    {isMobileMarketplaceMenuOpen ? <X className="w-5 h-5 text-[#1DB954]" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* FACEBOOK LITE STYLE UNIFIED ICON NAVIGATION BAR */}
            <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5 text-slate-300 w-full overflow-hidden">
              {/* 1. üè† Marketplace / Specialist Home */}
              <button
                type="button"
                onClick={() => {
                  setSelectedGig(null);
                  if (viewMode === 'selling') {
                    setSpecialistMainTab('marketplace');
                    setSellerSubTab('gigs');
                  } else {
                    setViewMode('buying');
                    setActiveSubTab('gigs');
                    setSelectedCategory('All');
                    if (setActiveTab) {
                      setActiveTab('marketplace', 'All', true);
                    }
                  }
                  setSearchQuery('');
                  setIsInboxModalOpen(false);
                  setIsNotificationsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition active:scale-95 cursor-pointer ${
                  ((viewMode === 'buying' && activeSubTab === 'gigs' && (activeTab === 'marketplace' || !activeTab)) ||
                   (viewMode === 'selling' && specialistMainTab === 'marketplace' && sellerSubTab === 'gigs')) &&
                  !selectedGig && !isInboxModalOpen && !isNotificationsOpen
                    ? 'text-[#1DB954]'
                    : 'text-white'
                }`}
                title={viewMode === 'selling' ? '‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°' : '‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶π‡ßã‡¶Æ'}
              >
                <Home className={`w-5 h-5 ${
                  ((viewMode === 'buying' && activeSubTab === 'gigs' && (activeTab === 'marketplace' || !activeTab)) ||
                   (viewMode === 'selling' && specialistMainTab === 'marketplace' && sellerSubTab === 'gigs')) &&
                  !selectedGig && !isInboxModalOpen && !isNotificationsOpen
                    ? 'text-[#1DB954]'
                    : 'text-white'
                }`} />
              </button>

              {/* 2. üõçÔ∏è Order & Courses / Specialist Client Orders */}
              <button
                type="button"
                onClick={() => {
                  if (!currentUser) {
                    if (openAuthModal) openAuthModal();
                    return;
                  }
                  setSelectedGig(null);
                  if (viewMode === 'selling') {
                    setSpecialistMainTab('marketplace');
                    setSellerSubTab('orders');
                  } else {
                    setViewMode('buying');
                    setActiveSubTab('my-orders');
                    setOrderHubTab('orders');
                    if (setActiveTab) {
                      setActiveTab('marketplace', 'my-orders', true);
                    }
                  }
                  setIsInboxModalOpen(false);
                  setIsNotificationsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex-1 flex justify-center items-center py-1.5 transition relative active:scale-95 cursor-pointer ${
                  ((viewMode === 'buying' && (activeSubTab === 'my-orders' || activeSubTab === 'my-courses')) ||
                   (viewMode === 'selling' && specialistMainTab === 'marketplace' && sellerSubTab === 'orders')) &&
                  !selectedGig && !isInboxModalOpen && !isNotificationsOpen
                    ? 'text-[#1DB954]'
                    : 'text-white'
                }`}
                title={viewMode === 'selling' ? '‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏‡¶Æ‡ßÇ‡¶π' : '‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶ï‡ßç‡¶∞‡ßü‡¶ï‡ßÉ‡¶§ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶ì ‡¶ï‡ßã‡¶∞‡ßç‡¶∏‡¶∏‡¶Æ‡ßÇ‡¶π'}
              >
                <ShoppingBag className={`w-5 h-5 ${
                  ((viewMode === 'buying' && (activeSubTab === 'my-orders' || activeSubTab === 'my-courses')) ||
                   (viewMode === 'selling' && specialistMainTab === 'marketplace' && sellerSubTab === 'orders')) &&
                  !selectedGig && !isInboxModalOpen && !isNotificationsOpen
                    ? 'stroke-[2.5] text-[#1DB954]'
                    : 'text-white'
                }`} />
                {viewMode === 'selling' ? (
                  marketplaceOrders && marketplaceOrders.length > 0 && (
                    <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                      {marketplaceOrders.length}
                    </span>
                  )
                ) : (
                  allBuyerOrders && allBuyerOrders.length > 0 && (
                    <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                      {allBuyerOrders.length}
                    </span>
                  )
                )}
              </button>

              {/* 3. ‚úâÔ∏è Messenger */}
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
                  isMessengerInboxOpen || activeSubTab === 'messenger' ? 'text-[#1DB954]' : 'text-white hover:text-[#1DB954]'
                }`}
                title="‡¶Æ‡ßá‡¶∏‡ßá‡¶û‡ßç‡¶ú‡¶æ‡¶∞"
              >
                <Mail className={`w-5 h-5 ${isMessengerInboxOpen || activeSubTab === 'messenger' ? 'text-[#1DB954] stroke-[2.5]' : 'text-white'}`} />
                {(directMessages && directMessages.length > 0) && (
                  <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#1DB954] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {directMessages.filter(m => !m.read).length > 0
                      ? directMessages.filter(m => !m.read).length
                      : directMessages.length}
                  </span>
                )}
              </button>

              {/* 4. üîî Notification */}
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
                title="‡¶®‡ßã‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶∂‡¶®"
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

              {/* 5. ‚ù§Ô∏è Saved / Favorites */}
              <button
                type="button"
                onClick={() => {
                  setSelectedGig(null);
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
                title="‡¶™‡¶õ‡¶®‡ßç‡¶¶‡ßá‡¶∞ ‡¶∏‡ßá‡¶≠ ‡¶ï‡¶∞‡¶æ ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π"
              >
                <Heart className={`w-5 h-5 ${activeSubTab === 'saved_gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen ? 'fill-[#1DB954] text-[#1DB954]' : 'text-white'}`} />
                {savedGigIds && savedGigIds.length > 0 && (
                  <span className="absolute -top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {savedGigIds.length}
                  </span>
                )}
              </button>
            </div>

            {/* ATTACHED SPECIALIST 3-TAB QUICK-ACTION STRIP FOR PHONE VIEW */}
            {viewMode === 'selling' && sellerSubTab !== 'gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (
              <div className="-mx-2 -mb-2 w-[calc(100%+1rem)] font-bengali bg-slate-900 text-white px-2 py-2 border-t border-slate-800 shadow-xs">
                <div className="grid grid-cols-3 gap-1.5 w-full">
                  {/* 1. ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏‡¶Æ‡ßÇ‡¶π */}
                  <button
                    type="button"
                    onClick={() => {
                      setSpecialistMainTab('marketplace');
                      setSellerSubTab('orders');
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-center ${
                      specialistMainTab === 'marketplace' && sellerSubTab === 'orders'
                        ? 'bg-[#1DB954] text-white shadow-md ring-1 ring-[#1DB954]/50'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    <ShoppingBag className={`w-3.5 h-3.5 shrink-0 ${specialistMainTab === 'marketplace' && sellerSubTab === 'orders' ? 'text-slate-950' : 'text-[#1DB954]'}`} />
                    <span className="truncate">‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ({marketplaceOrders.length})</span>
                  </button>

                  {/* 2. ‡¶∏‡ßç‡¶ü‡ßá‡¶ü‡¶Æ‡ßá‡¶®‡ßç‡¶ü */}
                  <button
                    type="button"
                    onClick={() => {
                      setSpecialistMainTab('payments');
                      setSellerSubTab('earnings');
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-center ${
                      specialistMainTab === 'payments'
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-400/50'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    <Wallet className={`w-3.5 h-3.5 shrink-0 ${specialistMainTab === 'payments' ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span className="truncate">‡¶∏‡ßç‡¶ü‡ßá‡¶ü‡¶Æ‡ßá‡¶®‡ßç‡¶ü</span>
                  </button>

                  {/* 3. ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isMentor) {
                        setSpecialistMainTab('mentor');
                        setSellerSubTab('courses');
                      } else if (isMentorPending) {
                        setIsMentorStatusModalOpen(true);
                      } else {
                        setIsMentorAppModalOpen(true);
                      }
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-center ${
                      specialistMainTab === 'mentor'
                        ? 'bg-teal-400 text-slate-950 shadow-md ring-1 ring-teal-400/50'
                        : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/80'
                    }`}
                  >
                    <GraduationCap className={`w-3.5 h-3.5 shrink-0 ${specialistMainTab === 'mentor' ? 'text-slate-950' : 'text-teal-400'}`} />
                    <span className="truncate">‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏</span>
                  </button>
                </div>
              </div>
            )}

            
            {/* ATTACHED UNIFIED MESSENGER HEADER FOR PHONE VIEW (CLEAN WHITE FULL-WIDTH WITH SEARCH X & SETTINGS BUTTON) */}
            {activeSubTab === 'messenger' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (
              <div className="-mx-2 -mb-2 w-[calc(100%+1rem)] font-bengali bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 border-t border-slate-200 dark:border-slate-800 shadow-xs">
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
                        className="p-1 -ml-1 rounded-lg text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                        title="‡¶á‡¶®‡¶¨‡¶ï‡ßç‡¶∏‡ßá ‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200 stroke-[2.5]" />
                      </button>
                      <div className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-emerald-400 via-blue-500 to-cyan-400 shadow-xs">
                        <img
                          src={activeMessengerUser.avatar}
                          alt={activeMessengerUser.name}
                          className="w-8 h-8 rounded-full object-cover border border-white dark:border-slate-800"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1DB954] border-2 border-white dark:border-slate-800" />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1">
                          <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                            {activeMessengerUser.name}
                          </h2>
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 fill-blue-500/20" />
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
                        className="p-1.5 rounded-full text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶≠‡¶ø‡¶°‡¶ø‡¶ì ‡¶ï‡¶≤"
                      >
                        <Video className="w-4.5 h-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const phoneBtn = document.getElementById('messenger-phone-trigger');
                          if (phoneBtn) phoneBtn.click();
                        }}
                        className="p-1.5 rounded-full text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶≠‡¶Ø‡¶º‡ßá‡¶∏ ‡¶ï‡¶≤"
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
                        placeholder="‡¶∏‡ßá‡¶≤‡¶æ‡¶∞, ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶¨‡¶æ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶ñ‡ßÅ‡¶Å‡¶ú‡ßÅ‡¶®..."
                        autoFocus
                        className="w-full pl-8 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsMessengerSearchActive(false);
                          setMessengerSearchQuery('');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                        title="‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶¨‡¶®‡ßç‡¶ß ‡¶ï‡¶∞‡ßÅ‡¶®"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsMessengerSettingsModalOpen(true)}
                      className="p-1.5 rounded-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                      title="‡¶Æ‡ßá‡¶∏‡ßá‡¶û‡ßç‡¶ú‡¶æ‡¶∞ ‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç‡¶∏"
                    >
                      <Settings className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('gigs')}
                        className="p-1 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">Messages</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-sans">PTENit Marketplace Inbox</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMessengerSearchActive(true)}
                        className="p-1.5 rounded-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®"
                      >
                        <Search className="w-4.5 h-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMessengerSettingsModalOpen(true)}
                        className="p-1.5 rounded-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶Æ‡ßá‡¶∏‡ßá‡¶û‡ßç‡¶ú‡¶æ‡¶∞ ‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç‡¶∏"
                      >
                        <Settings className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* ATTACHED UNIFIED FAVORITES / SAVED GIGS HEADER FOR PHONE VIEW (CLEAN WHITE FULL-WIDTH WITH SETTINGS BUTTON) */}
            {activeSubTab === 'saved_gigs' && !selectedGig && !isInboxModalOpen && !isNotificationsOpen && (
              <div className="-mx-2 -mb-2 w-[calc(100%+1rem)] font-bengali bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 border-t border-slate-200 dark:border-slate-800 shadow-xs">
                {isSavedSearchActive ? (
                  <div className="flex items-center gap-2 animate-in fade-in duration-150">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={savedSearchQuery}
                        onChange={(e) => setSavedSearchQuery(e.target.value)}
                        placeholder="‡¶™‡¶õ‡¶®‡ßç‡¶¶‡ßá‡¶∞ ‡¶ó‡¶ø‡¶ó ‡¶¨‡¶æ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶ñ‡ßÅ‡¶Å‡¶ú‡ßÅ‡¶®..."
                        autoFocus
                        className="w-full pl-8 pr-8 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-700 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSavedSearchActive(false);
                          setSavedSearchQuery('');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                        title="‡¶¨‡¶®‡ßç‡¶ß ‡¶ï‡¶∞‡ßÅ‡¶®"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSavedGigsSettingsModalOpen(true)}
                      className="p-1.5 rounded-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                      title="‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç‡¶∏ ‡¶ì ‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤"
                    >
                      <Settings className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setActiveSubTab('gigs')}
                        className="p-1 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®"
                      >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none font-english">Saved Gigs</h2>
                          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
                          {savedGigIds && savedGigIds.length > 0 && (
                            <span className="min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-xs">
                              {savedGigIds.length}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-tight mt-0.5 font-english">
                          PTENit Favorites & Wishlist
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSavedSearchActive(true)}
                        className="p-1.5 rounded-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®"
                      >
                        <Search className="w-4.5 h-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsSavedGigsSettingsModalOpen(true)}
                        className="p-1.5 rounded-full text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç‡¶∏ ‡¶ì ‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤"
                      >
                        <Settings className="w-4.5 h-4.5" />
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
              title="‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶∞‡¶ø‡¶´‡ßç‡¶∞‡ßá‡¶∂ ‡¶ï‡¶∞‡ßÅ‡¶®"
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
              title="‡¶π‡ßã‡¶Æ ‡¶™‡ßá‡¶ú‡ßá ‡¶Ø‡¶æ‡¶®"
            >
              <Home className="w-4 h-4 text-slate-300 group-hover:text-[#1DB954] transition-colors" />
            </button>
          </div>

          {/* Center Search Input Bar (Fiverr Style - Desktop) */}
          <div className="flex-1 max-w-2xl mx-2 hidden md:block relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={viewMode === 'selling' ? "‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶¨‡¶æ ‡¶ï‡ßç‡¶≤‡¶æ‡ßü‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¶‡¶ø‡ßü‡ßá ‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®..." : "What service are you looking for today?"}
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
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#1DB954] hover:bg-emerald-400 text-white rounded-lg transition cursor-pointer font-bold shadow"
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
                  <span>‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π ({filteredGigs.length})</span>
                  <span className="text-xs text-[#1DB954] font-normal">‡¶≤‡¶æ‡¶á‡¶≠ ‡¶´‡¶≤‡¶æ‡¶´‡¶≤</span>
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
                              <span className="text-xs text-slate-400 truncate max-w-[200px]">{gig.sellerName} ‚Ä¢ {gig.category}</span>
                              <span className="text-xs text-[#1DB954] font-bold">
                                ‡ß≥{gigPrice.toLocaleString('en-US')}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-3 text-xs font-bengali">
                    ‡¶ï‡ßã‡¶®‡ßã ‡¶ó‡¶ø‡¶ó ‡¶¨‡¶æ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶™‡¶æ‡¶ì‡ßü‡¶æ ‡¶Ø‡¶æ‡ßü‡¶®‡¶ø‡•§
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
                      className="w-full py-2 px-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 transition font-bengali cursor-pointer shadow"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>‡¶∏‡¶ï‡¶≤ ‡¶´‡¶≤‡¶æ‡¶´‡¶≤ ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶® ({filteredGigs.length} ‡¶ü‡¶ø ‡¶ó‡¶ø‡¶ó)</span>
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
                  title="‡¶®‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶∂‡¶®‡¶∏‡¶Æ‡ßÇ‡¶π"
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
                  title="‡¶Æ‡ßá‡¶∏‡ßá‡¶û‡ßç‡¶ú‡¶æ‡¶∞ - ‡¶∏‡¶¨‡¶æ‡¶∞ ‡¶è‡¶∏‡¶è‡¶Æ‡¶è‡¶∏ ‡¶ì ‡¶Ö‡¶®‡¶≤‡¶æ‡¶á‡¶® ‡¶§‡¶æ‡¶≤‡¶ø‡¶ï‡¶æ"
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
                    title="‡¶´‡ßá‡¶≠‡¶æ‡¶∞‡¶ø‡¶ü ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π"
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
                    title="‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏‡¶Æ‡ßÇ‡¶π"
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
                        title="‡¶®‡¶§‡ßÅ‡¶® ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏‡¶Æ‡ßÇ‡¶π"
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
                    setSpecialistMainTab('marketplace');
                    setSellerSubTab('gigs');
                    setSelectedGig(null);
                  } else {
                    setViewMode('buying');
                    setSelectedGig(null);
                    setActiveSubTab('gigs');
                  }
                }}
                className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-black text-white bg-[#1DB954] hover:bg-[#19a34a] transition-all cursor-pointer items-center gap-1.5 shadow-md shadow-[#1DB954]/20 border border-[#1DB954]"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>{viewMode === 'buying' ? '‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶Æ‡ßã‡¶°' : '‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°'}</span>
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
                title="‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶Æ‡ßá‡¶®‡ßÅ"
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
                className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-400 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer"
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
                      {currentUser.role === 'admin' ? 'üõ°Ô∏è ‡¶è‡¶°‡¶Æ‡¶ø‡¶® ‡¶è‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü' : currentUser.role === 'instructor' ? 'üõ†Ô∏è ‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶è‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü' : 'üíº ‡¶ó‡ßç‡¶∞‡¶æ‡¶π‡¶ï ‡¶è‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü'}
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
                      <p className="text-[9px] text-slate-400 font-bold uppercase">‡¶ì‡ßü‡¶æ‡¶≤‡ßá‡¶ü ‡¶¨‡ßç‡¶Ø‡¶æ‡¶≤‡ßá‡¶®‡ßç‡¶∏</p>
                      <p className="text-xs font-black text-white font-mono">‡ß≥{(currentUser as any)?.balance || '0.00'}</p>
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
                      className="px-2 py-1 rounded bg-[#1DB954]/20 hover:bg-[#1DB954] text-[#1DB954] hover:text-white font-bold text-[10px] transition cursor-pointer border border-[#1DB954]/40"
                    >
                      ‡¶ü‡¶™‡¶Ü‡¶™
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
                      ‡¶â‡¶á‡¶•‡¶°‡ßç‡¶∞
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
                    <span>{currentUser?.role === 'admin' ? '‡¶è‡¶°‡¶Æ‡¶ø‡¶® ‡¶™‡ßç‡¶Ø‡¶æ‡¶®‡ßá‡¶≤' : currentUser?.role === 'instructor' ? '‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°' : '‡¶ó‡ßç‡¶∞‡¶æ‡¶π‡¶ï ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°'}</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-extrabold bg-[#1DB954]/10 px-1.5 py-0.5 rounded">‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°</span>
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
                      <span>{viewMode === 'buying' ? '‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶Æ‡ßã‡¶°‡ßá ‡¶∏‡ßç‡¶Ø‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®' : '‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°‡ßá ‡¶∏‡ßç‡¶Ø‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®'}</span>
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
                    <span>‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶ì ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏‡¶Æ‡ßÇ‡¶π</span>
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
                    <span>‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶≤‡¶æ‡¶∞‡ßç‡¶®‡¶ø‡¶Ç ‡¶ì ‡¶ï‡ßã‡¶∞‡ßç‡¶∏‡¶∏‡¶Æ‡ßÇ‡¶π</span>
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
                  <span>‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®</span>
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
                    <span>‡¶™‡¶õ‡¶®‡ßç‡¶¶‡ßá‡¶∞ ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π (Wishlist)</span>
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
                  <span>‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç‡¶∏ ‡¶ì ‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶è‡¶°‡¶ø‡¶ü</span>
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
                  <span>‡¶≤‡¶ó‡¶Ü‡¶â‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶® (Logout)</span>
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
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] font-mono border border-[#1DB954]/40">‡¶Æ‡ßá‡¶á‡¶® ‡¶∏‡¶æ‡¶á‡¶ü</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium mt-0.5">‡¶™‡¶ø‡¶ü‡ßá‡¶®‡¶Ü‡¶á‡¶ü‡¶ø ‡¶Æ‡ßÇ‡¶≤ ‡¶ì‡ßü‡ßá‡¶¨‡¶∏‡¶æ‡¶á‡¶ü‡ßá ‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®</div>
                </div>
              </div>
              <ArrowLeft className="w-4 h-4 text-[#1DB954] group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-emerald-400 font-bengali flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1DB954]" />
                ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø ‡¶ì ‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞
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
                <span className="truncate">‡¶∏‡¶ï‡¶≤ ‡¶ó‡¶ø‡¶ó ‡¶ì ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏</span>
              </button>

              <button
                onClick={() => {
                  setViewMode("selling");
                  setSellerSubTab("create_gig");
                  setSelectedGig(null);
                  setIsMobileMarketplaceMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-2.5 rounded-xl text-left flex items-center gap-2 border ${
                  viewMode === "selling" && sellerSubTab === "create_gig"
                    ? "bg-[#1DB954] text-white border-[#1DB954] font-black"
                    : "bg-emerald-950/40 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/50"
                }`}
              >
                <PlusCircle className="w-4 h-4 shrink-0 text-[#1DB954]" />
                <span className="truncate">Post a gig (‡ß©‡¶ü‡¶ø ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú)</span>
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
                <span className="truncate">‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡ßã‡¶∏‡ßç‡¶ü</span>
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
                <span className="truncate">‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏‡¶Æ‡ßÇ‡¶π ({marketplaceOrders.length})</span>
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
                <span className="truncate">‡¶™‡¶õ‡¶®‡ßç‡¶¶‡ßá‡¶∞ ‡¶ó‡¶ø‡¶ó ({savedGigIds.length})</span>
              </button>
            </div>

            {/* 2. CATEGORY TYPES SELECTION (‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø ‡¶ü‡¶æ‡¶á‡¶™) */}
            <div className="space-y-2 pt-2 border-t border-slate-800 font-bengali">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">üìÇ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø ‡¶ü‡¶æ‡¶á‡¶™ ‡¶®‡¶ø‡¶∞‡ßç‡¶¨‡¶æ‡¶ö‡¶® ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {selectedCategory === 'All' ? '‡¶∏‡¶¨ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏' : selectedCategory}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'All', label: '‡¶∏‡¶¨ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏' },
                  { id: 'AI Services', label: '‡¶è‡¶Ü‡¶á ‡¶ì ‡¶∏‡¶´‡¶ü‡¶ì‡ßü‡ßç‡¶Ø‡¶æ‡¶∞' },
                  { id: 'Programming & Tech', label: '‡¶™‡ßç‡¶∞‡ßã‡¶ó‡ßç‡¶∞‡¶æ‡¶Æ‡¶ø‡¶Ç ‡¶ì ‡¶ü‡ßá‡¶ï‡¶®‡ßã‡¶≤‡¶ú‡¶ø' },
                  { id: 'Graphics & Design', label: '‡¶ó‡ßç‡¶∞‡¶æ‡¶´‡¶ø‡¶ï‡ßç‡¶∏ ‡¶ì ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶®' },
                  { id: 'Digital Marketing', label: '‡¶°‡¶ø‡¶ú‡¶ø‡¶ü‡¶æ‡¶≤ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç' },
                  { id: 'Video & Animation', label: '‡¶≠‡¶ø‡¶°‡¶ø‡¶ì ‡¶ì ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶®‡¶ø‡¶Æ‡ßá‡¶∂‡¶®' },
                  { id: 'SEO & Growth', label: '‡¶è‡¶∏‡¶á‡¶ì ‡¶ì ‡¶ó‡ßç‡¶∞‡ßã‡¶•' },
                  { id: 'Education & Training', label: '‡¶è‡¶°‡ßÅ‡¶ï‡ßá‡¶∂‡¶® ‡¶ì ‡¶ü‡ßç‡¶∞‡ßá‡¶®‡¶ø‡¶Ç' }
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
                  <span>{viewMode === 'buying' ? '‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°‡ßá ‡¶Ø‡¶æ‡¶®' : '‡¶ó‡ßç‡¶∞‡¶æ‡¶π‡¶ï ‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°‡ßá ‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {/* Spacer for fixed topbar on mobile */}
      {!selectedGig && !(viewMode === 'selling' && sellerSubTab === 'create_gig') && (
        <div className={`sm:hidden !mt-0 ${
          viewMode === 'selling' && sellerSubTab !== 'gigs'
            ? 'h-[142px]'
            : activeSubTab === 'messenger' || activeSubTab === 'saved_gigs'
            ? 'h-[136px]'
            : 'h-[92px]'
        }`} />
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
                  <option value="All" className="bg-slate-900 text-slate-100 font-normal">‡¶∏‡¶¨ ‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø</option>
                  <option value="AI Services" className="bg-slate-900 text-slate-100 font-normal">‡¶è‡¶Ü‡¶á ‡¶ì ‡¶∏‡¶´‡¶ü‡¶ì‡ßü‡ßç‡¶Ø‡¶æ‡¶∞</option>
                  <option value="Programming & Tech" className="bg-slate-900 text-slate-100 font-normal">‡¶™‡ßç‡¶∞‡ßã‡¶ó‡ßç‡¶∞‡¶æ‡¶Æ‡¶ø‡¶Ç ‡¶ì ‡¶ü‡ßá‡¶ï‡¶®‡ßã‡¶≤‡¶ú‡¶ø</option>
                  <option value="Graphics & Design" className="bg-slate-900 text-slate-100 font-normal">‡¶ó‡ßç‡¶∞‡¶æ‡¶´‡¶ø‡¶ï‡ßç‡¶∏ ‡¶ì ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶®</option>
                  <option value="Digital Marketing" className="bg-slate-900 text-slate-100 font-normal">‡¶°‡¶ø‡¶ú‡¶ø‡¶ü‡¶æ‡¶≤ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç</option>
                  <option value="Video & Animation" className="bg-slate-900 text-slate-100 font-normal">‡¶≠‡¶ø‡¶°‡¶ø‡¶ì ‡¶ì ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶®‡¶ø‡¶Æ‡ßá‡¶∂‡¶®</option>
                  <option value="SEO & Growth" className="bg-slate-900 text-slate-100 font-normal">‡¶è‡¶∏‡¶á‡¶ì ‡¶ì ‡¶ó‡ßç‡¶∞‡ßã‡¶•</option>
                  <option value="Education & Training" className="bg-slate-900 text-slate-100 font-normal">‡¶è‡¶°‡ßÅ‡¶ï‡ßá‡¶∂‡¶® ‡¶ì ‡¶ü‡ßç‡¶∞‡ßá‡¶®‡¶ø‡¶Ç</option>
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
                  <option value="popular" className="bg-slate-900 text-slate-100 font-normal">‡¶ú‡¶®‡¶™‡ßç‡¶∞‡¶ø‡¶Ø‡¶º‡¶§‡¶æ</option>
                  <option value="price-asc" className="bg-slate-900 text-slate-100 font-normal">‡¶ï‡¶Æ ‡¶¶‡¶æ‡¶Æ</option>
                  <option value="price-desc" className="bg-slate-900 text-slate-100 font-normal">‡¶¨‡ßá‡¶∂‡¶ø ‡¶¶‡¶æ‡¶Æ</option>
                  <option value="rating" className="bg-slate-900 text-slate-100 font-normal">‡¶ü‡¶™ ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç</option>
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
                ‡¶∞‡¶ø‡¶∏‡ßá‡¶ü
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW MAIN BAR */}
          <div className="hidden sm:flex items-center justify-between gap-2 bg-[#0F172A] dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 text-white -mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-8 md:px-12 lg:px-16 xl:px-20 py-2.5">
            {/* Horizontal Swipe Scroll Category Pills */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap py-1">
                {[
                  { id: 'All', label: '‡¶∏‡¶¨ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏' },
                  { id: 'AI Services', label: '‡¶è‡¶Ü‡¶á ‡¶ì ‡¶∏‡¶´‡¶ü‡¶ì‡ßü‡ßç‡¶Ø‡¶æ‡¶∞' },
                  { id: 'Programming & Tech', label: '‡¶™‡ßç‡¶∞‡ßã‡¶ó‡ßç‡¶∞‡¶æ‡¶Æ‡¶ø‡¶Ç ‡¶ì ‡¶ü‡ßá‡¶ï‡¶®‡ßã‡¶≤‡¶ú‡¶ø' },
                  { id: 'Graphics & Design', label: '‡¶ó‡ßç‡¶∞‡¶æ‡¶´‡¶ø‡¶ï‡ßç‡¶∏ ‡¶ì ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶®' },
                  { id: 'Digital Marketing', label: '‡¶°‡¶ø‡¶ú‡¶ø‡¶ü‡¶æ‡¶≤ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶ø‡¶Ç' },
                  { id: 'Video & Animation', label: '‡¶≠‡¶ø‡¶°‡¶ø‡¶ì ‡¶ì ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶®‡¶ø‡¶Æ‡ßá‡¶∂‡¶®' },
                  { id: 'SEO & Growth', label: '‡¶è‡¶∏‡¶á‡¶ì ‡¶ì ‡¶ó‡ßç‡¶∞‡ßã‡¶•' },
                  { id: 'Education & Training', label: '‡¶è‡¶°‡ßÅ‡¶ï‡ßá‡¶∂‡¶® ‡¶ì ‡¶ü‡ßç‡¶∞‡ßá‡¶®‡¶ø‡¶Ç' }
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
                <span className="text-slate-400 text-xs font-bold">‡¶∏‡¶∞‡ßç‡¶ü:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="pl-2.5 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                >
                  <option value="popular">‡¶ú‡¶®‡¶™‡ßç‡¶∞‡¶ø‡¶Ø‡¶º‡¶§‡¶æ</option>
                  <option value="price-asc">‡¶¶‡¶æ‡¶Æ: ‡¶ï‡¶Æ-‡¶¨‡ßá‡¶∂‡¶ø</option>
                  <option value="price-desc">‡¶¶‡¶æ‡¶Æ: ‡¶¨‡ßá‡¶∂‡¶ø-‡¶ï‡¶Æ</option>
                  <option value="rating">‡¶∏‡¶∞‡ßç‡¶¨‡ßã‡¶ö‡ßç‡¶ö ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç</option>
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
                title="‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞ ‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞‡¶ø‡¶Ç ‡¶Ö‡¶™‡¶∂‡¶® ‡¶¶‡ßá‡¶ñ‡¶æ‡¶®/‡¶≤‡ßÅ‡¶ï‡¶æ‡¶®"
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-current" />
                <span className="font-bold">‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞</span>
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
                  <span>‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞‡¶ø‡¶Ç ‡¶Ö‡¶™‡¶∂‡¶®‡¶∏‡¶Æ‡ßÇ‡¶π</span>
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
                    <RotateCcw className="w-3 h-3" /> ‡¶∞‡¶ø‡¶∏‡ßá‡¶ü ‡¶Ö‡¶≤
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {/* Price Filter */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">üí∞ ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü ‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞:</label>
                  <select
                    value={priceRangeFilter}
                    onChange={(e) => setPriceRangeFilter(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">‡¶∏‡¶¨ ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü (All Prices)</option>
                    <option value="under3k">‡ß≥‡ß©,‡ß¶‡ß¶‡ß¶ ‡¶è‡¶∞ ‡¶®‡¶ø‡¶ö‡ßá (‡¶¨‡¶æ‡¶ú‡ßá‡¶ü)</option>
                    <option value="3k-10k">‡ß≥‡ß©,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ßß‡ß¶,‡ß¶‡ß¶‡ß¶ (‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶°)</option>
                    <option value="10k-30k">‡ß≥‡ßß‡ß¶,‡ß¶‡ß¶‡ß¶ - ‡ß≥‡ß©‡ß¶,‡ß¶‡ß¶‡ß¶ (‡¶™‡ßç‡¶∞‡¶ø‡¶Æ‡¶ø‡¶Ø‡¶º‡¶æ‡¶Æ)</option>
                    <option value="over30k">‡ß≥‡ß©‡ß¶,‡ß¶‡ß¶‡ß¶+ (‡¶è‡¶®‡ßç‡¶ü‡¶æ‡¶∞‡¶™‡ßç‡¶∞‡¶æ‡¶á‡¶ú)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>

                {/* Delivery Time Filter */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">‚ö° ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡¶∏‡¶Æ‡ßü:</label>
                  <select
                    value={deliveryFilter}
                    onChange={(e) => setDeliveryFilter(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="any">‡¶∏‡¶¨ ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡¶∏‡¶Æ‡ßü</option>
                    <option value="1day">‡ß®‡ß™ ‡¶ò‡¶£‡ßç‡¶ü‡¶æ‡¶∞ ‡¶Æ‡¶ß‡ßç‡¶Ø‡ßá (‡¶è‡¶ï‡ßç‡¶∏‡¶™‡ßç‡¶∞‡ßá‡¶∏)</option>
                    <option value="3days">‡ß© ‡¶¶‡¶ø‡¶®‡ßá‡¶∞ ‡¶Æ‡¶ß‡ßç‡¶Ø‡ßá</option>
                    <option value="7days">‡ß≠ ‡¶¶‡¶ø‡¶®‡ßá‡¶∞ ‡¶Æ‡¶ß‡ßç‡¶Ø‡ßá</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>

                {/* Seller Rating Filter */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">‚≠ê ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç:</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value={0}>‡¶∏‡¶¨ ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç (All Ratings)</option>
                    <option value={4.5}>‡ß™.‡ß´+ ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç (‡¶ü‡¶™ ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞)</option>
                    <option value={4.8}>‡ß™.‡ßÆ+ ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç (‡¶∏‡ßÅ‡¶™‡¶æ‡¶∞ ‡¶∏‡ßç‡¶ü‡¶æ‡¶∞)</option>
                    <option value={5.0}>‡ß´.‡ß¶ ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç (‡¶™‡¶æ‡¶∞‡¶´‡ßá‡¶ï‡ßç‡¶ü)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-[28px] pointer-events-none" />
                </div>

                {/* Sort Option */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">üîÑ ‡¶∏‡¶∞‡ßç‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-3 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-bold text-xs focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="popular">‡¶ú‡¶®‡¶™‡ßç‡¶∞‡¶ø‡¶Ø‡¶º‡¶§‡¶æ ‡¶Ö‡¶®‡ßÅ‡¶Ø‡¶æ‡¶Ø‡¶º‡ßÄ</option>
                    <option value="price-asc">‡¶¶‡¶æ‡¶Æ: ‡¶ï‡¶Æ ‡¶•‡ßá‡¶ï‡ßá ‡¶¨‡ßá‡¶∂‡¶ø</option>
                    <option value="price-desc">‡¶¶‡¶æ‡¶Æ: ‡¶¨‡ßá‡¶∂‡¶ø ‡¶•‡ßá‡¶ï‡ßá ‡¶ï‡¶Æ</option>
                    <option value="rating">‡¶∏‡¶∞‡ßç‡¶¨‡ßã‡¶ö‡ßç‡¶ö ‡¶∞‡ßá‡¶ü‡¶ø‡¶Ç ‡¶Ö‡¶®‡ßÅ‡¶Ø‡¶æ‡¶Ø‡¶º‡ßÄ</option>
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
        <div className="space-y-3 sm:space-y-6 animate-fadeIn font-bengali !mt-1 sm:!mt-3">
          {(() => {
            const sellerGigs = currentUser ? gigs.filter(g =>
              (currentUser.id && g.sellerId === currentUser.id) ||
              (currentUser.name && g.sellerName && g.sellerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim())
            ) : [];

            /* STANDALONE DEDICATED GIG CREATION FULL-PAGE EXPERIENCE */
            if (sellerSubTab === 'create_gig') {
              return (
                <div className="space-y-4 sm:space-y-6 font-bengali bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 md:p-8 shadow-2xl animate-fadeIn my-1 sm:my-2 relative overflow-hidden">
                  
                  {/* STICKY TOP HEADER ON MOBILE & DESKTOP WITH FIXED QUICK NAVIGATION */}
                  <div className="sticky -top-3.5 sm:-top-6 md:-top-8 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-3.5 sm:-mx-6 md:-mx-8 -mt-3.5 sm:-mt-6 md:-mt-8 px-3.5 sm:px-6 md:px-8 py-3 mb-3 sm:mb-6 flex items-center justify-between gap-2 shadow-xs">
                    {/* Left: Prominent Back / Home button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSellerSubTab('gigs');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs shrink-0"
                      title="‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°‡ßá ‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                      <span>‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°</span>
                    </button>

                    {/* Center: Title & Short Badge */}
                    <div className="flex items-center gap-2 min-w-0 text-center sm:text-left">
                      <div className="hidden sm:flex w-8 h-8 rounded-lg bg-[#1DB954]/20 text-[#1DB954] items-center justify-center font-black shrink-0">
                        <PlusCircle className="w-5 h-5 text-[#1DB954]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5">
                          <h1 className="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white truncate">
                            ‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶è ‡¶ó‡¶ø‡¶ó (‡ß©‡¶ü‡¶ø ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú)
                          </h1>
                          <span className="px-2 py-0.5 bg-[#1DB954]/15 text-[#1DB954] text-[10px] font-black rounded-full border border-[#1DB954]/30 shrink-0 hidden sm:inline">
                            ‡ß©‡¶ü‡¶ø ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Action Close */}
                    <button
                      type="button"
                      onClick={() => {
                        setSellerSubTab('gigs');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs sm:text-sm font-black transition flex items-center gap-1 cursor-pointer shrink-0 active:scale-95"
                      title="‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ ‡¶ï‡¶∞‡ßá ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°‡ßá ‡¶Ø‡¶æ‡¶®"
                    >
                      <X className="w-4 h-4 text-rose-500" />
                      <span className="hidden sm:inline">‡¶¨‡¶æ‡¶§‡¶ø‡¶≤</span>
                    </button>
                  </div>

                  {sellerGigs.length >= 6 ? (
                    <div className="p-4 sm:p-6 bg-rose-500/10 border-2 border-rose-500/40 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 shrink-0" />
                        <h3 className="text-sm sm:text-base font-black">‡¶∏‡¶∞‡ßç‡¶¨‡ßã‡¶ö‡ßç‡¶ö ‡ß¨‡¶ü‡¶ø ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶∏‡ßÄ‡¶Æ‡¶æ ‡¶Ö‡¶§‡¶ø‡¶ï‡ßç‡¶∞‡¶Æ ‡¶ï‡¶∞‡ßá‡¶õ‡ßá!</h3>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ‡¶è‡¶ï‡¶ú‡¶® ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶π‡¶ø‡¶∏‡ßá‡¶¨‡ßá ‡¶Ü‡¶™‡¶®‡¶ø ‡¶∏‡¶∞‡ßç‡¶¨‡ßã‡¶ö‡ßç‡¶ö ‡ß¨‡¶ü‡¶ø ‡¶∏‡¶ï‡ßç‡¶∞‡¶ø‡ßü ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶∞‡¶æ‡¶ñ‡¶§‡ßá ‡¶™‡¶æ‡¶∞‡ßá‡¶®‡•§ ‡¶®‡¶§‡ßÅ‡¶® ‡¶ó‡¶ø‡¶ó ‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶ï‡¶∞‡¶§‡ßá ‡¶™‡ßÇ‡¶∞‡ßç‡¶¨‡ßá‡¶∞ ‡¶ï‡ßã‡¶®‡ßã ‡¶ó‡¶ø‡¶ó ‡¶°‡¶ø‡¶≤‡¶ø‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®‡•§
                      </p>
                      <button
                        onClick={() => setSellerSubTab('gigs')}
                        className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü‡ßá ‡¶´‡ßá‡¶∞‡¶§ ‡¶Ø‡¶æ‡¶®</span>
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateGigSubmit} className="space-y-4 sm:space-y-6">
                      
                      {/* SECTION 1: ‡¶Æ‡ßÇ‡¶≤ ‡¶§‡¶•‡ßç‡¶Ø (OVERVIEW) */}
                      <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 gap-2">
                          <h3 className="text-xs sm:text-sm font-black uppercase text-[#1DB954] flex items-center gap-1.5">
                            <Layers className="w-4 h-4 shrink-0" />
                            <span>‡ßß. ‡¶∏‡¶æ‡¶ß‡¶æ‡¶∞‡¶£ ‡¶§‡¶•‡ßç‡¶Ø ‡¶ì ‡¶ü‡¶æ‡¶á‡¶ü‡ßá‡¶≤</span>
                          </h3>
                          <button
                            type="button"
                            onClick={handleOptimizeWithGemini}
                            disabled={isAiOptimizing}
                            className="w-auto px-3 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                            <span className="text-white">{isAiOptimizing ? 'AI ‡¶∏‡¶æ‡¶ú‡¶æ‡¶ö‡ßç‡¶õ‡ßá...' : 'AI ‡¶∏‡¶æ‡¶ú‡¶æ‡¶®'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={newGigCategory}
                              onChange={(e) => setNewGigCategory(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                            >
                              <option value="Programming & Tech">Programming & Tech</option>
                              <option value="AI Services">AI Services</option>
                              <option value="Graphics & Design">Graphics & Design</option>
                              <option value="Digital Marketing">Digital Marketing</option>
                              <option value="Video & Animation">Video & Animation</option>
                              <option value="SEO & Growth">SEO & Growth</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶¨‡ßç‡¶Ø‡¶æ‡¶ú <span className="text-rose-500">*</span>
                            </label>
                            <select
                              value={newGigOfferBadge}
                              onChange={(e) => setNewGigOfferBadge(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] font-bold"
                            >
                              <option value="‡ß©‡ß¶% ‡¶õ‡¶æ‡ßú">üéÅ ‡ß©‡ß¶% ‡¶õ‡¶æ‡ßú (30% Discount)</option>
                              <option value="‡ß®‡ß¶% ‡¶õ‡¶æ‡ßú">üéÅ ‡ß®‡ß¶% ‡¶õ‡¶æ‡ßú (20% Discount)</option>
                              <option value="‡ßß‡ß¶% ‡¶õ‡¶æ‡ßú">üéÅ ‡ßß‡ß¶% ‡¶õ‡¶æ‡ßú (10% Discount)</option>
                              <option value="‡ß´‡ß¶% ‡¶õ‡¶æ‡ßú">üéÅ ‡ß´‡ß¶% ‡¶õ‡¶æ‡ßú (50% Discount)</option>
                              <option value="‡¶Ü‡¶ó‡ßá ‡¶ï‡¶æ‡¶ú ‡¶∂‡ßÅ‡¶∞‡ßÅ">‚ö° ‡¶Ü‡¶ó‡ßá ‡¶ï‡¶æ‡¶ú ‡¶∂‡ßÅ‡¶∞‡ßÅ (Work First)</option>
                            </select>
                          </div>

                          <div className="space-y-1 sm:col-span-2 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶ü‡¶æ‡¶á‡¶ü‡ßá‡¶≤ <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: I will build a full stack AI web application..."
                              value={newGigTitle}
                              onChange={(e) => setNewGigTitle(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                            />
                          </div>
                        </div>

                        {/* Search Keywords / Tags */}
                        <div className="space-y-1 pt-1">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            ‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶ï‡¶ø‡¶ì‡¶Ø‡¶º‡¶æ‡¶∞‡ßç‡¶° ‡¶ì ‡¶ü‡ßç‡¶Ø‡¶æ‡¶ó‡¶∏
                          </label>
                          <input
                            type="text"
                            placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: React, Next.js, AI, FullStack, Node.js (‡¶ï‡¶Æ‡¶æ ‡¶¶‡¶ø‡ßü‡ßá ‡¶≤‡¶ø‡¶ñ‡ßÅ‡¶®)"
                            value={newGigTags}
                            onChange={(e) => setNewGigTags(e.target.value)}
                            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                          />
                        </div>
                      </div>

                      {/* SECTION 2: ‡ß©‡¶ü‡¶ø ‡¶™‡ßç‡¶∞‡¶æ‡¶á‡¶∏‡¶ø‡¶Ç ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú (SIDE-BY-SIDE / STEP-BY-STEP BUILDER) */}
                      <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 gap-2">
                          <div>
                            <h3 className="text-xs sm:text-sm font-black uppercase text-[#1DB954] flex items-center gap-1.5">
                              <DollarSign className="w-4 h-4 shrink-0" />
                              <span>‡ß®. ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶™‡ßç‡¶∞‡¶æ‡¶á‡¶∏‡¶ø‡¶Ç (‡ß©‡¶ü‡¶ø)</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              Basic, Standard ‡¶ì Premium ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶ï‡¶®‡¶´‡¶ø‡¶ó‡¶æ‡¶∞ ‡¶ï‡¶∞‡ßÅ‡¶®
                            </p>
                          </div>

                          {/* Desktop Layout Switcher */}
                          <div className="hidden md:flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/80 dark:border-slate-700 text-xs font-bold">
                            <button
                              type="button"
                              onClick={() => setPackageLayoutMode('stepped')}
                              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${packageLayoutMode === 'stepped' ? 'bg-white dark:bg-slate-800 text-[#1DB954] shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                              ‡¶∏‡ßç‡¶ü‡ßá‡¶™ ‡¶ü‡ßç‡¶Ø‡¶æ‡¶¨
                            </button>
                            <button
                              type="button"
                              onClick={() => setPackageLayoutMode('columns')}
                              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${packageLayoutMode === 'columns' ? 'bg-white dark:bg-slate-800 text-[#1DB954] shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                              ‡ß© ‡¶ï‡¶≤‡¶æ‡¶Æ ‡¶≠‡¶ø‡¶â
                            </button>
                          </div>
                        </div>

                        {/* 3 Interactive Package Stepper Tabs - ALWAYS VISIBLE FOR FAST NAVIGATION */}
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 bg-slate-200/60 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                          {/* 1. BASIC TAB */}
                          <button
                            type="button"
                            onClick={() => setActivePackageStep('basic')}
                            className={`py-2 sm:py-2.5 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                              activePackageStep === 'basic'
                                ? 'bg-white dark:bg-slate-800 text-[#1DB954] shadow-md ring-2 ring-[#1DB954] font-black'
                                : 'hover:bg-white/50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold'
                            }`}
                          >
                            <Zap className={`w-4 h-4 shrink-0 ${activePackageStep === 'basic' ? 'text-[#1DB954]' : 'text-slate-500'}`} />
                            <span className="text-xs leading-none">‡ßß. ‡¶¨‡ßá‡¶∏‡¶ø‡¶ï</span>
                          </button>

                          {/* 2. STANDARD TAB */}
                          <button
                            type="button"
                            onClick={() => setActivePackageStep('standard')}
                            className={`py-2 sm:py-2.5 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                              activePackageStep === 'standard'
                                ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-md ring-2 ring-blue-500 font-black'
                                : 'hover:bg-white/50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold'
                            }`}
                          >
                            <Star className={`w-4 h-4 shrink-0 ${activePackageStep === 'standard' ? 'text-blue-500' : 'text-slate-500'}`} />
                            <span className="text-xs leading-none">‡ß®. ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶°</span>
                          </button>

                          {/* 3. PREMIUM TAB */}
                          <button
                            type="button"
                            onClick={() => setActivePackageStep('premium')}
                            className={`py-2 sm:py-2.5 px-1 rounded-xl transition flex flex-col items-center justify-center gap-1 cursor-pointer text-center ${
                              activePackageStep === 'premium'
                                ? 'bg-white dark:bg-slate-800 text-amber-500 shadow-md ring-2 ring-amber-500 font-black'
                                : 'hover:bg-white/50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold'
                            }`}
                          >
                            <Crown className={`w-4 h-4 shrink-0 ${activePackageStep === 'premium' ? 'text-amber-500' : 'text-slate-500'}`} />
                            <span className="text-xs leading-none">‡ß©. ‡¶™‡ßç‡¶∞‡¶ø‡¶Æ‡¶ø‡ßü‡¶æ‡¶Æ</span>
                          </button>
                        </div>

                        {/* STEPPED VIEW OR COLUMNS VIEW */}
                        {packageLayoutMode === 'columns' ? (
                          /* SIDE-BY-SIDE 3 COLUMNS VIEW (FOR DESKTOP) */
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            {/* 1. BASIC CARD */}
                            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-[#1DB954] rounded-2xl p-3.5 space-y-3 shadow-xs transition">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <div className="flex items-center gap-1.5">
                                  <Zap className="w-4 h-4 text-[#1DB954]" />
                                  <span className="text-xs font-black text-slate-900 dark:text-white">Basic ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú</span>
                                </div>
                                
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶®‡¶æ‡¶Æ</label>
                                  <input
                                    type="text"
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Basic Starter"
                                    value={newBasicTitle}
                                    onChange={(e) => setNewBasicTitle(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶Æ‡ßÇ‡¶≤‡ßç‡¶Ø (‡ß≥ BDT)</label>
                                  <input
                                    type="number"
                                    min="500"
                                    step="100"
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß®‡ß´‡ß¶‡ß¶"
                                    value={newBasicPrice}
                                    onChange={(e) => setNewBasicPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-[#1DB954]"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø (‡¶¶‡¶ø‡¶®)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="60"
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß©"
                                      value={newBasicDelivery}
                                      onChange={(e) => setNewBasicDelivery(e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶®</label>
                                    <select
                                      value={newBasicRevisions}
                                      onChange={(e) => setNewBasicRevisions(e.target.value)}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                    >
                                      <option value="1">‡ßß ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="2">‡ß® ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="3">‡ß© ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="Unlimited">‡¶Ü‡¶®‡¶≤‡¶ø‡¶Æ‡¶ø‡¶ü‡ßá‡¶°</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ / ‡¶∏‡ßç‡¶ï‡ßã‡¶™</label>
                                  <textarea
                                    rows={2}
                                    placeholder="‡¶¨‡ßá‡¶∏‡¶ø‡¶ï ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶∏‡¶Ç‡¶ï‡ßç‡¶∑‡ßá‡¶™..."
                                    value={newBasicDesc}
                                    onChange={(e) => setNewBasicDesc(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs resize-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* 2. STANDARD CARD */}
                            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-3.5 space-y-3 shadow-xs transition">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-4 h-4 text-blue-500" />
                                  <span className="text-xs font-black text-slate-900 dark:text-white">Standard ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶®‡¶æ‡¶Æ</label>
                                  <input
                                    type="text"
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Standard Pro"
                                    value={newStandardTitle}
                                    onChange={(e) => setNewStandardTitle(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶Æ‡ßÇ‡¶≤‡ßç‡¶Ø (‡ß≥ BDT)</label>
                                  <input
                                    type="number"
                                    min="500"
                                    step="100"
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß¨‡ß¶‡ß¶‡ß¶"
                                    value={newStandardPrice}
                                    onChange={(e) => setNewStandardPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-blue-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø (‡¶¶‡¶ø‡¶®)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="60"
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß®"
                                      value={newStandardDelivery}
                                      onChange={(e) => setNewStandardDelivery(e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶®</label>
                                    <select
                                      value={newStandardRevisions}
                                      onChange={(e) => setNewStandardRevisions(e.target.value)}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                    >
                                      <option value="2">‡ß® ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="3">‡ß© ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="5">‡ß´ ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="Unlimited">‡¶Ü‡¶®‡¶≤‡¶ø‡¶Æ‡¶ø‡¶ü‡ßá‡¶°</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ / ‡¶∏‡ßç‡¶ï‡ßã‡¶™</label>
                                  <textarea
                                    rows={2}
                                    placeholder="‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶° ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶∏‡¶Ç‡¶ï‡ßç‡¶∑‡ßá‡¶™..."
                                    value={newStandardDesc}
                                    onChange={(e) => setNewStandardDesc(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs resize-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* 3. PREMIUM CARD */}
                            <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 rounded-2xl p-3.5 space-y-3 shadow-xs transition">
                              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                                <div className="flex items-center gap-1.5">
                                  <Crown className="w-4 h-4 text-amber-500" />
                                  <span className="text-xs font-black text-slate-900 dark:text-white">Premium ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶®‡¶æ‡¶Æ</label>
                                  <input
                                    type="text"
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Premium VIP Enterprise"
                                    value={newPremiumTitle}
                                    onChange={(e) => setNewPremiumTitle(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶Æ‡ßÇ‡¶≤‡ßç‡¶Ø (‡ß≥ BDT)</label>
                                  <input
                                    type="number"
                                    min="500"
                                    step="100"
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ßß‡ß´‡ß¶‡ß¶‡ß¶"
                                    value={newPremiumPrice}
                                    onChange={(e) => setNewPremiumPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-amber-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø (‡¶¶‡¶ø‡¶®)</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="60"
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ßß"
                                      value={newPremiumDelivery}
                                      onChange={(e) => setNewPremiumDelivery(e.target.value === '' ? '' : Number(e.target.value))}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶®</label>
                                    <select
                                      value={newPremiumRevisions}
                                      onChange={(e) => setNewPremiumRevisions(e.target.value)}
                                      className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                                    >
                                      <option value="Unlimited">‡¶Ü‡¶®‡¶≤‡¶ø‡¶Æ‡¶ø‡¶ü‡ßá‡¶°</option>
                                      <option value="5">‡ß´ ‡¶¨‡¶æ‡¶∞</option>
                                      <option value="10">‡ßß‡ß¶ ‡¶¨‡¶æ‡¶∞</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ / ‡¶∏‡ßç‡¶ï‡ßã‡¶™</label>
                                  <textarea
                                    rows={2}
                                    placeholder="‡¶™‡ßç‡¶∞‡¶ø‡¶Æ‡¶ø‡ßü‡¶æ‡¶Æ ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶∏‡¶Ç‡¶ï‡ßç‡¶∑‡ßá‡¶™..."
                                    value={newPremiumDesc}
                                    onChange={(e) => setNewPremiumDesc(e.target.value)}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs resize-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* STEP-BY-STEP PROGRESSIVE VIEW (EASY ON MOBILE & DESKTOP) */
                          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xs">
                            
                            {/* ACTIVE STEP 1: BASIC */}
                            {activePackageStep === 'basic' && (
                              <div className="space-y-3.5 animate-fadeIn">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center font-black">
                                      <Zap className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                        ‡ßß. Basic ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú
                                      </h4>
                                      <p className="text-[11px] text-slate-500">‡¶∂‡ßÅ‡¶∞‡ßÅ‡¶∞ ‡¶™‡ßç‡¶∞‡¶æ‡¶á‡¶∏‡¶ø‡¶Ç ‡¶ì ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                      ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá‡¶∞ ‡¶®‡¶æ‡¶Æ
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Basic Starter"
                                      value={newBasicTitle}
                                      onChange={(e) => setNewBasicTitle(e.target.value)}
                                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954]"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                      ‡¶Æ‡ßÇ‡¶≤‡ßç‡¶Ø (‡ß≥ BDT) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      min="500"
                                      step="100"
                                      value={newBasicPrice}
                                      onChange={(e) => setNewBasicPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß®‡ß´‡ß¶‡ß¶"
                                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-black text-[#1DB954] focus:ring-2 focus:ring-[#1DB954]"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 sm:col-span-2 md:col-span-1">
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø (‡¶¶‡¶ø‡¶®)</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß©"
                                        value={newBasicDelivery}
                                        onChange={(e) => setNewBasicDelivery(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶®</label>
                                      <select
                                        value={newBasicRevisions}
                                        onChange={(e) => setNewBasicRevisions(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                      >
                                        <option value="1">‡ßß ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="2">‡ß® ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="3">‡ß© ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="Unlimited">‡¶Ü‡¶®‡¶≤‡¶ø‡¶Æ‡¶ø‡¶ü‡ßá‡¶°</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ ‡¶ì ‡¶´‡¶ø‡¶ö‡¶æ‡¶∞ ‡¶∏‡ßç‡¶ï‡ßã‡¶™
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Single page responsive landing page + clean code + 3 days support..."
                                    value={newBasicDesc}
                                    onChange={(e) => setNewBasicDesc(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm resize-none focus:ring-2 focus:ring-[#1DB954]"
                                  />
                                </div>

                                {/* Step Action Navigation Button */}
                                <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                                  <button
                                    type="button"
                                    onClick={() => setActivePackageStep('standard')}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                                  >
                                    <span>Standard</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* ACTIVE STEP 2: STANDARD */}
                            {activePackageStep === 'standard' && (
                              <div className="space-y-3.5 animate-fadeIn">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center font-black">
                                      <Star className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                        ‡ß®. Standard ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú
                                      </h4>
                                      <p className="text-[11px] text-slate-500">‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶° ‡¶™‡ßç‡¶∞‡¶æ‡¶á‡¶∏‡¶ø‡¶Ç ‡¶ì ‡¶´‡¶ø‡¶ö‡¶æ‡¶∞</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                      ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá‡¶∞ ‡¶®‡¶æ‡¶Æ
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Standard Pro"
                                      value={newStandardTitle}
                                      onChange={(e) => setNewStandardTitle(e.target.value)}
                                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                      ‡¶Æ‡ßÇ‡¶≤‡ßç‡¶Ø (‡ß≥ BDT) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      min="500"
                                      step="100"
                                      value={newStandardPrice}
                                      onChange={(e) => setNewStandardPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß¨‡ß¶‡ß¶‡ß¶"
                                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-black text-blue-500 focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 sm:col-span-2 md:col-span-1">
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø (‡¶¶‡¶ø‡¶®)</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ß®"
                                        value={newStandardDelivery}
                                        onChange={(e) => setNewStandardDelivery(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶®</label>
                                      <select
                                        value={newStandardRevisions}
                                        onChange={(e) => setNewStandardRevisions(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                      >
                                        <option value="2">‡ß® ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="3">‡ß© ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="5">‡ß´ ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="Unlimited">‡¶Ü‡¶®‡¶≤‡¶ø‡¶Æ‡¶ø‡¶ü‡ßá‡¶°</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ ‡¶ì ‡¶´‡¶ø‡¶ö‡¶æ‡¶∞ ‡¶∏‡ßç‡¶ï‡ßã‡¶™
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: 3-5 page responsive web app + database + source code..."
                                    value={newStandardDesc}
                                    onChange={(e) => setNewStandardDesc(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm resize-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* Step Action Navigation Buttons */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setActivePackageStep('basic')}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Basic</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActivePackageStep('premium')}
                                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                                  >
                                    <span>Premium</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* ACTIVE STEP 3: PREMIUM */}
                            {activePackageStep === 'premium' && (
                              <div className="space-y-3.5 animate-fadeIn">
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                                      <Crown className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                        ‡ß©. Premium ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú
                                      </h4>
                                      <p className="text-[11px] text-slate-500">‡¶´‡ßÅ‡¶≤ ‡¶è‡¶®‡ßç‡¶ü‡¶æ‡¶∞‡¶™‡ßç‡¶∞‡¶æ‡¶á‡¶ú ‡¶∏‡¶≤‡ßç‡¶Ø‡ßÅ‡¶∂‡¶®</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                      ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú‡ßá‡¶∞ ‡¶®‡¶æ‡¶Æ
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Premium VIP Enterprise"
                                      value={newPremiumTitle}
                                      onChange={(e) => setNewPremiumTitle(e.target.value)}
                                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                      ‡¶Æ‡ßÇ‡¶≤‡ßç‡¶Ø (‡ß≥ BDT) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      min="500"
                                      step="100"
                                      value={newPremiumPrice}
                                      onChange={(e) => setNewPremiumPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                      placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ßß‡ß´‡ß¶‡ß¶‡ß¶"
                                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-black text-amber-500 focus:ring-2 focus:ring-amber-500"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 sm:col-span-2 md:col-span-1">
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø (‡¶¶‡¶ø‡¶®)</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡ßß"
                                        value={newPremiumDelivery}
                                        onChange={(e) => setNewPremiumDelivery(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶®</label>
                                      <select
                                        value={newPremiumRevisions}
                                        onChange={(e) => setNewPremiumRevisions(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm"
                                      >
                                        <option value="Unlimited">‡¶Ü‡¶®‡¶≤‡¶ø‡¶Æ‡¶ø‡¶ü‡ßá‡¶°</option>
                                        <option value="5">‡ß´ ‡¶¨‡¶æ‡¶∞</option>
                                        <option value="10">‡ßß‡ß¶ ‡¶¨‡¶æ‡¶∞</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                    ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ ‡¶ì ‡¶´‡¶ø‡¶ö‡¶æ‡¶∞ ‡¶∏‡ßç‡¶ï‡ßã‡¶™
                                  </label>
                                  <textarea
                                    rows={2}
                                    placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Complete Full-Stack Solution + Payment Gateway + 30 Days VIP Support..."
                                    value={newPremiumDesc}
                                    onChange={(e) => setNewPremiumDesc(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm resize-none focus:ring-2 focus:ring-amber-500"
                                  />
                                </div>

                                {/* Step Action Navigation Buttons */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setActivePackageStep('standard')}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>Standard</span>
                                  </button>
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* SECTION 3: ‡¶Æ‡¶ø‡¶°‡¶ø‡ßü‡¶æ ‡¶ì ‡¶•‡¶æ‡¶Æ‡ßç‡¶¨‡¶®‡ßá‡¶á‡¶≤ (MEDIA) */}
                      <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <h3 className="text-xs sm:text-sm font-black uppercase text-[#1DB954] flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <ImageIcon className="w-4 h-4 shrink-0" />
                          <span>‡ß©. ‡¶•‡¶æ‡¶Æ‡ßç‡¶¨‡¶®‡ßá‡¶á‡¶≤ ‡¶ì ‡¶Æ‡¶ø‡¶°‡¶ø‡ßü‡¶æ ‡¶≤‡¶ø‡¶ô‡ßç‡¶ï</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶™‡ßç‡¶∞‡¶ß‡¶æ‡¶® ‡¶•‡¶æ‡¶Æ‡ßç‡¶¨‡¶®‡ßá‡¶á‡¶≤ ‡¶á‡¶Æ‡ßá‡¶ú URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={newGigThumbnail}
                              onChange={(e) => setNewGigThumbnail(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶∏‡ßç‡¶Ø‡¶æ‡¶Æ‡ßç‡¶™‡¶≤ ‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶´‡¶ü‡ßã URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={newGigGalleryPic}
                              onChange={(e) => setNewGigGalleryPic(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶°‡ßá‡¶Æ‡ßã ‡¶≠‡¶ø‡¶°‡¶ø‡¶ì ‡¶≤‡¶ø‡¶ô‡ßç‡¶ï (‡¶ê‡¶ö‡ßç‡¶õ‡¶ø‡¶ï)
                            </label>
                            <input
                              type="url"
                              placeholder="https://youtube.com/watch?v=..."
                              value={newGigVideoUrl}
                              onChange={(e) => setNewGigVideoUrl(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£, ‡¶∞‡¶ø‡¶ï‡ßã‡ßü‡¶æ‡¶∞‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ì FAQ (DETAILS) */}
                      <div className="p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <h3 className="text-xs sm:text-sm font-black uppercase text-[#1DB954] flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>‡ß™. ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ ‡¶ì ‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶®‡¶ø‡¶∞‡ßç‡¶¶‡ßá‡¶∂‡¶ø‡¶ï‡¶æ</span>
                        </h3>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              required
                              rows={3}
                              placeholder="‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏, ‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶Ö‡¶≠‡¶ø‡¶ú‡ßç‡¶û‡¶§‡¶æ ‡¶ì ‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶ï‡ßá‡¶® ‡¶Ü‡¶™‡¶®‡¶æ‡¶ï‡ßá ‡¶¨‡ßá‡¶õ‡ßá ‡¶®‡ßá‡¶¨‡ßá ‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§ ‡¶≤‡¶ø‡¶ñ‡ßÅ‡¶®..."
                              value={newGigDesc}
                              onChange={(e) => setNewGigDesc(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1DB954] resize-y"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                              ‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡¶∞‡¶ø‡¶ï‡ßã‡ßü‡¶æ‡¶∞‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∏
                            </label>
                            <input
                              type="text"
                              placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶¨‡ßç‡¶∞‡¶ø‡¶´, ‡¶¨‡ßç‡¶∞‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶° ‡¶≤‡ßã‡¶ó‡ßã ‡¶¨‡¶æ ‡¶∞‡ßá‡¶´‡¶æ‡¶∞‡ßá‡¶®‡ßç‡¶∏ ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶´‡¶æ‡¶á‡¶≤..."
                              value={newGigRequirements}
                              onChange={(e) => setNewGigRequirements(e.target.value)}
                              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          {/* DYNAMIC MULTI-FAQ LIST (ADD/REMOVE CAPABILITY) */}
                          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                                ‡¶∏‡¶ö‡¶∞‡¶æ‡¶ö‡¶∞ ‡¶™‡ßç‡¶∞‡¶∂‡ßç‡¶® ‡¶ì ‡¶â‡¶§‡ßç‡¶§‡¶∞ (FAQ)
                              </label>
                              <button
                                type="button"
                                onClick={() => setNewGigFaqs(prev => [...prev, { id: Date.now().toString(), question: "", answer: "" }])}
                                className="px-2.5 py-1 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 text-[#1DB954] font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>‡¶™‡ßç‡¶∞‡¶∂‡ßç‡¶® ‡¶Ø‡ßã‡¶ó ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {newGigFaqs.map((faq, idx) => (
                                <div key={faq.id} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 relative group">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-bold text-slate-500">‡¶™‡ßç‡¶∞‡¶∂‡ßç‡¶® #{idx + 1}</span>
                                    {newGigFaqs.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => setNewGigFaqs(prev => prev.filter((_, i) => i !== idx))}
                                        className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition cursor-pointer"
                                        title="‡¶™‡ßç‡¶∞‡¶∂‡ßç‡¶® ‡¶Æ‡ßÅ‡¶õ‡ßÅ‡¶®"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="‡¶™‡ßç‡¶∞‡¶∂‡ßç‡¶® (‡¶Ø‡ßá‡¶Æ‡¶®: ‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶™‡¶∞ ‡¶ï‡¶ø ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶™‡¶æ‡¶¨‡ßã?)"
                                    value={faq.question}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNewGigFaqs(prev => prev.map((item, i) => i === idx ? { ...item, question: val } : item));
                                    }}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                                  />
                                  <input
                                    type="text"
                                    placeholder="‡¶â‡¶§‡ßç‡¶§‡¶∞ (‡¶Ø‡ßá‡¶Æ‡¶®: ‡¶π‡ßç‡¶Ø‡¶æ‡¶Å, ‡ß©‡ß¶ ‡¶¶‡¶ø‡¶® ‡¶´‡ßç‡¶∞‡¶ø ‡¶ü‡ßá‡¶ï‡¶®‡¶ø‡¶ï‡ßç‡¶Ø‡¶æ‡¶≤ ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶¶‡ßá‡¶ì‡ßü‡¶æ ‡¶π‡¶¨‡ßá‡•§)"
                                    value={faq.answer}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setNewGigFaqs(prev => prev.map((item, i) => i === idx ? { ...item, answer: val } : item));
                                    }}
                                    className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {createGigSuccess && (
                        <div className="p-3 bg-emerald-500/20 text-[#1DB954] font-bold text-xs sm:text-sm rounded-xl text-center border border-[#1DB954] animate-fadeIn">
                          ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶ó‡¶ø‡¶ó ‡¶ì ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá ‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá!
                        </div>
                      )}

                      {/* FIXED/CLEAN ACTION FOOTER WITH GOOGLE-STYLE PREMIUM BUTTONS */}
                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setSellerSubTab('gigs');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/30 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <X className="w-4 h-4 text-rose-500" />
                          <span>‡¶¨‡¶æ‡¶§‡¶ø‡¶≤</span>
                        </button>
                        <button
                          type="submit"
                          className="flex-1 sm:flex-initial px-6 sm:px-8 py-2.5 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-[#19a34a] hover:to-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-[#1DB954]/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                          <Sparkles className="w-4 h-4 fill-white text-white" />
                          <span className="text-white">‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶∂</span>
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
                  <div className="hidden lg:block lg:col-span-3 xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl text-slate-900 dark:text-white shadow-xl shadow-slate-950/5 dark:shadow-black/40 font-bengali relative z-20 overflow-visible transition-all duration-300">
                    
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
                                ‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶°‡ßç‡¶Ø‡¶æ‡¶∂‡¶¨‡ßã‡¶∞‡ßç‡¶°
                              </h1>
                              <span className="px-3 py-1 bg-amber-500/25 backdrop-blur-md text-amber-300 text-xs font-black rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1.5">
                                <Crown className="w-3.5 h-3.5 text-amber-300" />
                                <span>‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶ì ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶π‡¶æ‡¶¨</span>
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
                            title="PTEN IT ‡¶π‡ßã‡¶Æ ‡¶™‡ßá‡¶ú‡ßá ‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®"
                          >
                            <Home className="w-4 h-4 text-emerald-400" />
                            <span className="hidden sm:inline">‡¶π‡ßã‡¶Æ</span>
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
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-400 text-white rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md active:scale-95"
                            title="‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏‡ßá ‡¶´‡¶ø‡¶∞‡ßá ‡¶Ø‡¶æ‡¶®"
                          >
                            <Store className="w-4 h-4 text-slate-950" />
                            <span>‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°</span>
                          </button>

                          {/* 3. Messenger / Direct Inbox Button (‡¶Æ‡ßá‡¶∏‡ßá‡¶û‡ßç‡¶ú‡¶æ‡¶∞) */}
                          <button
                            id="messenger-direct-btn"
                            onClick={() => {
                              setIsCentralNotificationOpen(false);
                              setIsProfileDropdownOpen(false);
                              openMessengerInbox();
                            }}
                            className="relative p-2 sm:p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center border backdrop-blur-md shadow-sm active:scale-95 bg-slate-900/60 hover:bg-slate-900/90 text-slate-200 border-white/15"
                            title="‡¶Æ‡ßá‡¶∏‡ßá‡¶û‡ßç‡¶ú‡¶æ‡¶∞ ‡¶ì ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶ö‡ßç‡¶Ø‡¶æ‡¶ü"
                          >
                            <Mail className="w-4 h-4 text-slate-200" />
                            {directMessages.filter(m => !m.read).length > 0 && (
                              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#1DB954] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-950 shadow-md">
                                {directMessages.filter(m => !m.read).length}
                              </span>
                            )}
                          </button>

                          {/* 4. Central Notification Hub (‡¶®‡ßã‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶∂‡¶®) */}
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
                            title="‡¶∏‡ßá‡¶®‡ßç‡¶ü‡ßç‡¶∞‡¶æ‡¶≤ ‡¶®‡ßã‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶∂‡¶® ‡¶π‡¶æ‡¶¨ (‡¶∏‡¶ï‡¶≤ ‡¶Ü‡¶™‡¶°‡ßá‡¶ü)"
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
                                title="‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶Æ‡ßá‡¶®‡ßÅ"
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
                                        <p className="text-[10px] text-amber-400 font-bold truncate">‚ö° ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡ßã</p>
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
                                        <span>‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç ‡¶ì ‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤</span>
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
                                        <span>‡¶≤‡¶ó ‡¶Ü‡¶â‡¶ü</span>
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
                            title="‡¶≤‡¶ó ‡¶Ü‡¶â‡¶ü"
                          >
                            <LogOut className="w-4 h-4 text-rose-300" />
                          </button>
                        </div>
                      </div>

                      {/* LIVE OFFER & ORDER NOTIFICATION BANNER (‡ß©D ‡¶∞‡¶ô‡¶ø‡¶® ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶´‡ßã‡¶® ‡¶≠‡¶ø‡¶â ‡¶ï‡¶æ‡¶∞‡ßç‡¶°) */}
                      {activeOffersList.length > 0 && activeOffersList[activeOfferIndex % activeOffersList.length] && (
                        <div className="relative z-20 mt-1.5 sm:mt-3 w-full max-w-2xl mx-auto animate-slideUp font-bengali">
                          {(() => {
                            const currentOffer = activeOffersList[activeOfferIndex % activeOffersList.length];
                            const timerPercentage = totalOfferDuration > 0 ? (offerCountdown / totalOfferDuration) * 100 : 0;
                            const isBeingActioned = justActionedOfferId === currentOffer.id;
                            const sellerPayout = Math.round(currentOffer.budget * 0.9);

                            return (
                              <div
                                onMouseEnter={() => setIsOfferPaused(true)}
                                onMouseLeave={() => setIsOfferPaused(false)}
                              >
                                {/* 1. CENTERED AUTO-SEARCH STYLE LIVE TEXT WITH SEQUENTIAL ANIMATED DOTS (SAME FONT SIZE AS LIVE ORDER SEARCH) */}
                                <div className="flex items-center justify-center gap-2 mb-2 px-3 py-1 w-fit mx-auto select-none">
                                  <div className="relative flex items-center justify-center">
                                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-60" />
                                  </div>
                                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center justify-center tracking-tight">
                                    <span>‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶è‡¶∏‡ßá‡¶õ‡ßá</span>
                                    <span className="inline-flex items-center ml-1 font-black text-emerald-500 dark:text-[#1DB954] text-base sm:text-lg select-none">
                                      <span className="animate-pulse inline-block" style={{ animationDelay: "0ms", animationDuration: "1.2s" }}>.</span>
                                      <span className="animate-pulse inline-block" style={{ animationDelay: "300ms", animationDuration: "1.2s" }}>.</span>
                                      <span className="animate-pulse inline-block" style={{ animationDelay: "600ms", animationDuration: "1.2s" }}>.</span>
                                    </span>
                                  </h4>
                                </div>

                                {/* 2. 3D COMPACT ORDER CARD (REDUCED HEIGHT, EXPANDED WIDTH, CRISP TYPOGRAPHY) */}
                                <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-emerald-50/20 rounded-2xl sm:rounded-3xl border-t-2 border-l-2 border-r-2 border-b-4 border-slate-200 hover:border-emerald-300 shadow-[0_12px_28px_-8px_rgba(16,185,129,0.14),0_4px_12px_-2px_rgba(0,0,0,0.05)] p-3 sm:p-3.5 text-slate-800 transition-all font-bengali">
                                  {/* Ambient Top Glow Line */}
                                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

                                  {/* Row 1: Sender Profile & Multi-Order Switcher */}
                                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 mt-0.5">
                                    {/* Sender Info */}
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="relative shrink-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-500 shadow-xs">
                                          <User className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs sm:text-[13px] font-black text-slate-900 truncate">
                                            {currentOffer.clientName || "PTENit IT Academy"}
                                          </span>
                                          {currentOffer.isVerified && (
                                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          )}
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold block leading-none">
                                          {currentOffer.type === "personal" ? "‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡¶æ‡¶∞‡ßç‡¶∏‡ßã‡¶®‡¶æ‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞" : "‡¶Æ‡ßá‡¶á‡¶® ‡¶è‡¶°‡¶Æ‡¶ø‡¶® ‚Ä¢ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Right Badges: Count */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setIsSeeAllOffersModalOpen(true)}
                                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                                        title="‡¶∏‡¶ï‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶è‡¶ï‡¶∏‡¶æ‡¶•‡ßá ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®"
                                      >
                                        <span className="font-mono">{activeOffersList.length}</span>
                                        <span>‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞</span>
                                        <ChevronRight className="w-3 h-3 text-emerald-700" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Row 2: Project Title & Clean Tags (No Borders, Light Soft Backgrounds, Lucide Icons) */}
                                  <div className="py-1.5 sm:py-2">
                                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-1" title={currentOffer.title}>
                                      {currentOffer.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px] sm:text-[11px] font-medium">
                                      <span className="px-2 py-0.5 bg-sky-50/80 text-sky-700 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-sky-600" />
                                        <span>{currentOffer.deadline}</span>
                                      </span>
                                      <span className="px-2 py-0.5 bg-purple-50/80 text-purple-700 rounded-md flex items-center gap-1">
                                        <Briefcase className="w-3 h-3 text-purple-600" />
                                        <span>{currentOffer.category}</span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 3: Compact Earnings Box With Subtle Dashed Border */}
                                  <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50/90 border border-dashed border-slate-300 dark:border-slate-700 mb-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                                        <Banknote className="w-4 h-4 text-rose-600" />
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-slate-500 font-bold block leading-none">‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü</span>
                                        <span className="text-xs sm:text-sm font-black font-mono text-slate-800 leading-tight">
                                          ‡ß≥{currentOffer.budget.toLocaleString("bn-BD")}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="border-l border-dashed border-slate-300 dark:border-slate-700 pl-2.5 flex items-center justify-between">
                                      <div>
                                        <span className="text-[9px] text-rose-600 font-bold block leading-none">‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶Ü‡ßü (‡ßØ‡ß¶%)</span>
                                        <span className="text-sm sm:text-base font-black font-mono text-emerald-700 leading-tight">
                                          ‡ß≥{sellerPayout.toLocaleString("bn-BD")}
                                        </span>
                                      </div>
                                      <span className="hidden sm:inline-block px-1.5 py-0.5 bg-emerald-600 text-white text-[8px] font-black rounded">
                                        ‡¶á‡¶®‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶ü
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 4: 2 Action Buttons With Countdown in the Middle */}
                                  <div className="flex items-center gap-2">
                                    {/* ‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§ Button */}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOfferForModal(currentOffer)}
                                      className="flex-1 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                                    >
                                      <Info className="w-3.5 h-3.5 text-slate-500" />
                                      <span>‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§</span>
                                    </button>

                                    {/* Center Countdown Badge */}
                                    <div className="flex items-center gap-1 font-mono text-[11px] text-amber-700 font-black bg-amber-50 px-2 py-1.5 rounded-xl shrink-0 select-none">
                                      <Clock className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
                                      <span>{offerCountdown}s</span>
                                    </div>

                                    {/* ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡ßÅ‡¶® Button */}
                                    {isBeingActioned && offerActionType === "received" ? (
                                      <button
                                        disabled
                                        className="flex-1 py-2 px-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-1 animate-pulse"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                        <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠‡¶°!</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleReceiveLiveOffer(currentOffer)}
                                        className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <Zap className="w-3.5 h-3.5 fill-white text-white" />
                                        <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                                      </button>
                                    )}
                                  </div>

                                  {/* Micro Animated Progress Line */}
                                  <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-linear"
                                      style={{ width: `${timerPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/*                     {/*                     {/*                     {/*                     {/*                     {/*                     {/*                     {/*                     {/*                     {/*                     {/*                     {/* 2. BOTTOM PROFILE INFO AREA OVERLAPPING COVER BANNER WITH GENEROUS SPACING */}
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
                                ‚òÖ 5.0 <span className="text-slate-400 font-normal text-[10px]">(52)</span>
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
                            title={isToolkitSoundOn ? "‡¶∏‡¶æ‡¶â‡¶®‡ßç‡¶° ‡¶Ö‡¶® ‡¶Ü‡¶õ‡ßá (‡¶Æ‡¶ø‡¶â‡¶ü ‡¶ï‡¶∞‡¶§‡ßá ‡¶ï‡ßç‡¶≤‡¶ø‡¶ï ‡¶ï‡¶∞‡ßÅ‡¶®)" : "‡¶∏‡¶æ‡¶â‡¶®‡ßç‡¶° ‡¶¨‡¶®‡ßç‡¶ß ‡¶Ü‡¶õ‡ßá (‡¶ö‡¶æ‡¶≤‡ßÅ ‡¶ï‡¶∞‡¶§‡ßá ‡¶ï‡ßç‡¶≤‡¶ø‡¶ï ‡¶ï‡¶∞‡ßÅ‡¶®)"}
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
                      title="‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶°‡¶ø‡¶ü‡ßá‡¶á‡¶≤‡¶∏, ‡¶è‡¶°‡¶ø‡¶ü ‡¶ì ‡¶∏‡ßá‡¶ü‡¶ø‡¶Ç‡¶∏ (3-Dots)"
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
                              <span className="font-black text-slate-900 dark:text-white text-xs">‡¶´‡ßÅ‡¶≤ ‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶á‡¶®‡¶´‡¶∞‡¶Æ‡ßá‡¶∂‡¶®</span>
                              <span className="text-[10px] bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded-full font-bold">Verified</span>
                            </div>
                            
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              <strong>‡¶¨‡¶æ‡ßü‡ßã:</strong> {editProfileBio}
                            </p>

                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400 block text-[9px]">‡¶≤‡ßã‡¶ï‡ßá‡¶∂‡¶®</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#1DB954]" /> Bangladesh
                                </span>
                              </div>
                              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-slate-400 block text-[9px]">‡¶∞‡ßá‡¶∏‡¶™‡¶®‡ßç‡¶∏ ‡¶ü‡¶æ‡¶á‡¶Æ</span>
                                <span className="font-bold text-emerald-600 dark:text-[#1DB954] flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-500" /> ~15 mins
                                </span>
                              </div>
                            </div>

                            <div className="pt-1">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">‡¶∏‡¶ï‡¶≤ ‡¶∏‡ßç‡¶ï‡¶ø‡¶≤‡¶∏:</span>
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
                            <span>‡¶™‡ßç‡¶∞‡ßã‡¶´‡¶æ‡¶á‡¶≤ ‡¶è‡¶°‡¶ø‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶® (Edit Profile)</span>
                          </button>

                          <div className="border-t border-slate-200 dark:border-slate-800 my-1" />

                          {/* Account Switcher Section inside 3-dot menu */}
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-black uppercase text-slate-400">‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶∏‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®</p>
                            <div className="space-y-1 max-h-36 overflow-y-auto">
                              {accountsList.map((acc) => (
                                <button
                                  key={acc.id}
                                  onClick={() => {
                                    setActiveAccount(acc);
                                    setEditProfileName(acc.name);
                                    setIsHeaderMoreMenuOpen(false);
                                    setSwitchSuccessMsg(`‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá '${acc.name}' ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü‡ßá ‡¶∏‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá!`);
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
                                const newName = prompt('‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü‡ßá‡¶∞ ‡¶®‡¶æ‡¶Æ ‡¶≤‡¶ø‡¶ñ‡ßÅ‡¶®:');
                                if (newName) {
                                  const newAcc = {
                                    id: `acc-${Date.now()}`,
                                    name: newName,
                                    role: '‡¶®‡¶§‡ßÅ‡¶® ‡¶´‡ßç‡¶∞‡¶ø‡¶≤‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶∏‡¶æ‡¶∞ / ‡¶∏‡¶¶‡¶∏‡ßç‡¶Ø',
                                    email: `${newName.toLowerCase().replace(/\s+/g, '')}@example.com`,
                                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                                    type: 'seller'
                                  };
                                  setAccountsList([...accountsList, newAcc]);
                                  setActiveAccount(newAcc);
                                  setEditProfileName(newAcc.name);
                                  setIsHeaderMoreMenuOpen(false);
                                  setSwitchSuccessMsg(`‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü '${newName}' ‡¶Ø‡ßã‡¶ó ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá ‡¶è‡¶¨‡¶Ç ‡¶∏‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá!`);
                                  setTimeout(() => setSwitchSuccessMsg(''), 4000);
                                }
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-2 text-[#1DB954] font-bold cursor-pointer text-left"
                            >
                              <Plus className="w-4 h-4" />
                              <span>‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶Ø‡ßã‡¶ó ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsSubscriptionModalOpen(true);
                                setIsHeaderMoreMenuOpen(false);
                              }}
                              className="w-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-2 text-amber-500 font-bold cursor-pointer text-left"
                            >
                              <Crown className="w-4 h-4" />
                              <span>‡¶∏‡¶æ‡¶¨‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡¶ø‡¶™‡¶∂‡¶® (‡ß≥‡ß™‡ßØ‡ßØ/‡¶Æ‡¶æ‡¶∏)</span>
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
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center border-2 border-[#1DB954] shrink-0 shadow-md">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedOfferForModal.type === 'personal' ? (
                            <span className="text-[10px] sm:text-xs font-black px-3 py-1 rounded-full border border-amber-400/60 bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/20 text-amber-300 flex items-center gap-1.5 shadow-md">
                              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡¶æ‡¶∞‡ßç‡¶∏‡ßã‡¶®‡¶æ‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞</span>
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-xs font-black px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5 shadow-sm">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{selectedOfferForModal.typeLabel.replace(/^[‚ö°üîí]\s*/, '')}</span>
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-bold">‚Ä¢ {selectedOfferForModal.source}</span>
                          <span className="text-xs text-amber-400 font-bold">‚òÖ {selectedOfferForModal.rating}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          {selectedOfferForModal.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏') ? '‡¶Ö‡¶∞‡ßç‡¶ó‡¶æ‡¶®‡¶æ‡¶á‡¶ú‡ßá‡¶∂‡¶® / ‡¶è‡¶ï‡¶æ‡¶°‡ßá‡¶Æ‡¶ø: ' : '‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü: '}
                          <strong className="text-white">{selectedOfferForModal.clientName}</strong> ({selectedOfferForModal.clientLocation}) ‚Ä¢ {selectedOfferForModal.postedTime}
                        </p>
                      </div>
                    </div>

                    {/* Quick Highlights Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏') ? '‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶´‡¶ø / ‡¶∏‡¶Æ‡ßç‡¶Æ‡¶æ‡¶®‡¶ø‡¶Ø‡¶º‡¶æ‡¶Æ' : '‡¶¨‡¶æ‡¶ú‡ßá‡¶ü (Budget)'}
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#1DB954]">‡ß≥{selectedOfferForModal.budget.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏') ? '‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶ü‡¶æ‡¶∞‡ßç‡¶ó‡ßá‡¶ü / ‡¶∏‡¶Æ‡¶Ø‡¶º' : '‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡¶∏‡¶Æ‡¶Ø‡¶º'}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-200">{selectedOfferForModal.deadline}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 font-bold block">‡¶ï‡ßç‡¶Ø‡¶æ‡¶ü‡¶æ‡¶ó‡¶∞‡¶ø</span>
                        <span className="text-xs sm:text-sm font-bold text-amber-300">{selectedOfferForModal.category}</span>
                      </div>
                    </div>

                    {/* Requirements & Description */}
                    <div className="space-y-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-200 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#1DB954]" />
                        {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏') ? '‡¶ï‡ßã‡¶∞‡ßç‡¶∏‡ßá‡¶∞ ‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§ ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£ ‡¶ì ‡¶á‡¶®‡ßç‡¶∏‡¶ü‡ßç‡¶∞‡¶æ‡¶ï‡ßç‡¶ü‡¶∞ ‡¶®‡¶ø‡¶∞‡ßç‡¶¶‡ßá‡¶∂‡¶®‡¶æ:' : '‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü‡ßá‡¶∞ ‡¶∞‡¶ø‡¶ï‡ßã‡ßü‡¶æ‡¶∞‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∏ ‡¶ì ‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶¨‡¶ø‡¶¨‡¶∞‡¶£:'}
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
                          {selectedOfferForModal.type === 'course' || selectedOfferForModal.typeLabel.includes('‡¶ï‡ßã‡¶∞‡ßç‡¶∏') ? '‡¶Æ‡¶°‡¶ø‡¶â‡¶≤, ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏ ‡¶ì ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡ßá‡¶¨‡¶≤ ‡¶ü‡¶æ‡¶∞‡ßç‡¶ó‡ßá‡¶ü:' : '‡¶Ø‡¶æ ‡¶Ø‡¶æ ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡¶¶‡¶ø‡¶§‡ßá ‡¶π‡¶¨‡ßá:'}
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
                            üéâ ‡¶Ö‡¶´‡¶æ‡¶∞‡¶ü‡¶ø ‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá! ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü‡¶ü‡¶ø ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶§‡¶æ‡¶≤‡¶ø‡¶ï‡¶æ‡ßü ‡¶∏‡¶ï‡ßç‡¶∞‡¶ø‡ßü ‡¶Ü‡¶õ‡ßá‡•§
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
                          ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®
                        </button>
                      </div>
                    )}

                    {/* Footer Actions: Receive (Green) vs Reject (Red) vs Received State */}
                    {receivedOfferIds.includes(selectedOfferForModal.id) ? (
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#1DB954]" />
                          <span>‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠‡¶° & ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶ü‡¶ø‡¶≠</span>
                        </span>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setSelectedOfferForModal(null)}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold transition cursor-pointer"
                          >
                            ‡¶¨‡¶®‡ßç‡¶ß ‡¶ï‡¶∞‡ßÅ‡¶®
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
                            ‡¶ï‡¶æ‡¶ú‡ßá ‡¶Ø‡¶æ‡¶®
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
                          <span>‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReceiveLiveOffer(selectedOfferForModal)}
                          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#1DB954] to-emerald-400 hover:from-emerald-400 hover:to-[#1DB954] text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1DB954]/25 hover:scale-105 active:scale-95 transition cursor-pointer"
                        >
                          <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                          <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡ßÅ‡¶® (‡ß≥{selectedOfferForModal.budget.toLocaleString()})</span>
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
                          <span>‡¶∏‡¶ï‡¶≤ ‡¶™‡ßá‡¶®‡ßç‡¶°‡¶ø‡¶Ç ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶ì ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶∏‡¶Æ‡ßÇ‡¶π ({activeOffersList.length})</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶¶‡¶ï‡ßç‡¶∑‡¶§‡¶æ ‡¶Ö‡¶®‡ßÅ‡¶Ø‡¶æ‡ßü‡ßÄ ‡¶™‡¶æ‡¶ì‡ßü‡¶æ ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶ì ‡¶™‡¶æ‡¶¨‡¶≤‡¶ø‡¶ï ‡¶∞‡¶ø‡¶ï‡ßã‡¶Ø‡¶º‡ßá‡¶∏‡ßç‡¶ü ‡¶§‡¶æ‡¶≤‡¶ø‡¶ï‡¶æ
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
                          ‚ú® ‡¶¨‡¶∞‡ßç‡¶§‡¶Æ‡¶æ‡¶®‡ßá ‡¶ï‡ßã‡¶®‡ßã ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶®‡ßá‡¶á‡•§
                        </div>
                      ) : (
                        activeOffersList.map((offer) => (
                          <div
                            key={offer.id}
                            className="p-4 bg-slate-950/70 border border-slate-800 hover:border-[#1DB954]/50 rounded-2xl transition space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center border-2 border-[#1DB954] shrink-0">
                                  <User className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-white truncate">{offer.clientName}</span>
                                    {offer.type === 'personal' ? (
                                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/25 to-yellow-500/20 text-amber-300 flex items-center gap-1 shadow-xs">
                                        <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                                        <span>‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡¶æ‡¶∞‡ßç‡¶∏‡ßã‡¶®‡¶æ‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 flex items-center gap-1 shadow-xs">
                                        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                                        <span>{offer.typeLabel.replace(/^[‚ö°üîí]\s*/, '')}</span>
                                      </span>
                                    )}
                                    <span className="text-[10px] text-amber-400 font-bold">‚òÖ {offer.rating}</span>
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-black text-slate-100 mt-1">
                                    {offer.title}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                <div className="text-left sm:text-right">
                                  <span className="text-sm sm:text-base font-black text-[#1DB954]">
                                    ‡ß≥{offer.budget.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">
                                    ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø: {offer.deadline}
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
                                    ‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§
                                  </button>

                                  {receivedOfferIds.includes(offer.id) ? (
                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                                      <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠‡¶°</span>
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleReceiveLiveOffer(offer)}
                                      className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black rounded-xl text-xs flex items-center gap-1 shadow-md cursor-pointer"
                                    >
                                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                                      <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠</span>
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


              {/* DESKTOP SIDEBAR (HIDDEN ON MOBILE) */}
              <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-sm font-bengali space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span>‡¶∏‡ßç‡¶™‡ßá‡¶∂‡¶æ‡¶≤‡¶ø‡¶∏‡ßç‡¶ü ‡¶®‡ßá‡¶≠‡¶ø‡¶ó‡ßá‡¶∂‡¶®</span>
                  </span>
                  <span className="text-xs bg-[#1DB954]/10 text-[#1DB954] px-3 py-1 rounded-full font-black border border-[#1DB954]/20 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶ì ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞</span>
                  </span>
                </div>

                {/* Vertical Navigation Items (Top to Bottom) - Short, Crisp & Large Typography */}
                <div className="space-y-3">
                  {/* 1. ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ (‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏) */}
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
                            ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏
                          </span>
                          {/* Active Dot */}
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                            ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶ü‡¶ø‡¶≠
                          </span>
                        </div>
                        <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                          specialistMainTab === 'marketplace' ? 'text-slate-950/90 font-black' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏ ({marketplaceOrders.length}) ‚Ä¢ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏‡ßá‡¶∏ ({sellerGigs.length || 2})
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 shrink-0 ${specialistMainTab === 'marketplace' ? 'text-slate-950 font-black' : 'text-slate-400'}`} />
                  </button>

                  {/* 2. ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ */}
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
                              ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏
                            </span>
                            {/* Active Dot */}
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-black bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/40">
                              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                              ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶ü‡¶ø‡¶≠
                            </span>
                          </div>
                          <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                            specialistMainTab === 'mentor' ? 'text-slate-950/90 font-black' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            ‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‚Ä¢ ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏‡¶∞‡ßÅ‡¶Æ ‚Ä¢ ‡¶∏‡ßç‡¶ü‡ßÅ‡¶°‡ßá‡¶®‡ßç‡¶ü (3)
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
                                ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-amber-500/30 text-amber-300 rounded-full font-bold border border-amber-500/50">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                ‡¶™‡ßá‡¶®‡ßç‡¶°‡¶ø‡¶Ç
                              </span>
                            </div>
                            <span className="block text-xs sm:text-sm font-bold text-amber-400/80 truncate mt-1">
                              ‡¶è‡¶°‡¶Æ‡¶ø‡¶® ‡¶™‡¶∞‡ßç‡¶Ø‡¶æ‡¶≤‡ßã‡¶ö‡¶®‡¶æ‡ßü ‡¶∞‡ßü‡ßá‡¶õ‡ßá
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
                              ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏
                            </span>
                            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                              ‡¶á‡¶®‡¶Ö‡ßç‡¶Ø‡¶æ‡¶ï‡ßç‡¶ü‡¶ø‡¶≠
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg">
                          ‡¶≤‡¶ï‡¶°
                        </span>
                      </div>
                      
                      {/* ‡¶Ü‡¶¨‡ßá‡¶¶‡¶® ‡¶ï‡¶∞‡ßÅ‡¶® ‡¶¨‡¶æ‡¶ü‡¶® ‡¶®‡¶ø‡¶ö‡ßá */}
                      <button
                        id="nav-mentor-apply"
                        onClick={() => setIsMentorAppModalOpen(true)}
                        className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                      >
                        <span>‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶π‡¶§‡ßá ‡¶Ü‡¶¨‡ßá‡¶¶‡¶® ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>
                    </div>
                  )}

                  {/* 3. ‡¶è‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶∏‡ßç‡¶ü‡ßá‡¶ü‡¶Æ‡ßá‡¶®‡ßç‡¶ü */}
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
                          ‡¶è‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶∏‡ßç‡¶ü‡ßá‡¶ü‡¶Æ‡ßá‡¶®‡ßç‡¶ü
                        </span>
                        <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                          specialistMainTab === 'payments' ? 'text-slate-950/90 font-black' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          ‡¶Ü‡¶∞‡ßç‡¶®‡¶ø‡¶Ç ‡¶ì ‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶π‡¶ø‡¶∏‡ßç‡¶ü‡ßã‡¶∞‡¶ø
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-6 h-6 shrink-0 ${specialistMainTab === 'payments' ? 'text-slate-950 font-black' : 'text-slate-400'}`} />
                  </button>

                  {/* 4. ‡¶´‡ßç‡¶∞‡¶ø ‡¶ü‡ßÅ‡¶≤‡¶∏ */}
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
                          ‡¶´‡ßç‡¶∞‡¶ø ‡¶ü‡ßÅ‡¶≤‡¶∏
                        </span>
                        <span className={`block text-xs sm:text-sm font-bold truncate mt-1 ${
                          specialistMainTab === 'ai_toolkit' ? 'text-white/90 font-black' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          ‡ßß‡ß¶‡ß¶% ‡¶´‡ßç‡¶∞‡¶ø ‡¶´‡ßç‡¶∞‡¶ø‡¶≤‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶∏‡¶ø‡¶Ç ‡¶ü‡ßÅ‡¶≤‡¶∏
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
                    <span>‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°‡ßá ‡¶∏‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN CONTENT AREA */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">

              {/* SPECIALIST DYNAMIC SUB-TABS STRIP */}
              <div className={`bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl space-y-3 font-bengali text-white animate-fadeIn ${specialistMainTab === 'marketplace' ? 'hidden lg:block' : ''}`}>
                {/* Header Info Strip */}
                <div className="flex items-center justify-between text-xs sm:text-sm pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span className="uppercase tracking-wider text-xs sm:text-sm font-black text-[#1DB954] flex items-center gap-2">
                      {specialistMainTab === 'marketplace' && <><Briefcase className="w-4 h-4" /><span><span className="sm:hidden">‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏</span><span className="hidden sm:inline">‡ßß. ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏</span></span></>}
                      {specialistMainTab === 'mentor' && <><GraduationCap className="w-4 h-4" /><span><span className="sm:hidden">‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏‡ßá‡¶∏</span><span className="hidden sm:inline">‡ß®. ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏‡ßá‡¶∏</span></span></>}
                      {specialistMainTab === 'payments' && <><Wallet className="w-4 h-4" /><span><span className="sm:hidden">‡¶∏‡ßç‡¶ü‡ßá‡¶ü‡¶Æ‡ßá‡¶®‡ßç‡¶ü</span><span className="hidden sm:inline">‡ß©. ‡¶è‡¶ï‡¶æ‡¶â‡¶®‡ßç‡¶ü ‡¶∏‡ßç‡¶ü‡ßá‡¶ü‡¶Æ‡ßá‡¶®‡ßç‡¶ü</span></span></>}
                      {specialistMainTab === 'ai_toolkit' && <><Sparkles className="w-4 h-4" /><span>‡ß™. ‡¶´‡ßç‡¶∞‡¶ø ‡¶ü‡ßÅ‡¶≤‡¶∏</span></>}
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
                              ? 'bg-[#1DB954] text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏ ({marketplaceOrders.length})</span>
                        </button>

                        <button
                          onClick={() => setSellerSubTab('gigs')}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                            sellerSubTab === 'gigs'
                              ? 'bg-[#1DB954] text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Package className="w-4 h-4" />
                          <span>‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏‡ßá‡¶∏ ({sellerGigs.length || 2})</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setSellerSubTab('create_gig')}
                        className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                          sellerSubTab === 'create_gig'
                            ? 'bg-white text-slate-950'
                            : 'bg-gradient-to-r from-[#1DB954] to-emerald-400 text-white hover:opacity-90'
                        }`}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{sellerSubTab === 'create_gig' ? '‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶§‡¶æ‡¶≤‡¶ø‡¶ï‡¶æ' : '+ ‡¶®‡¶§‡ßÅ‡¶® ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶Ü‡¶™‡¶≤‡ßã‡¶°'}</span>
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
                            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                              sellerSubTab === 'courses'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden">‡¶ï‡ßã‡¶∞‡ßç‡¶∏</span>
                            <span className="hidden sm:inline">‡¶Ü‡¶Æ‡¶æ‡¶∞ ‡¶™‡¶∞‡¶ø‡¶ö‡¶æ‡¶≤‡¶ø‡¶§ ‡¶ï‡ßã‡¶∞‡ßç‡¶∏</span>
                          </button>

                          <button
                            onClick={() => setSellerSubTab('assignments')}
                            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                              sellerSubTab === 'assignments'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden">‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü</span>
                            <span className="hidden sm:inline">‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ì ‡¶ï‡ßç‡¶≤‡¶æ‡¶∏‡¶∞‡ßÅ‡¶Æ</span>
                          </button>

                          <button
                            onClick={() => setSellerSubTab('students')}
                            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                              sellerSubTab === 'students'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden">‡¶™‡ßç‡¶∞‡¶∂‡¶ø‡¶ï‡ßç‡¶∑‡¶®‡¶æ‡¶∞‡ßç‡¶•‡ßÄ (3)</span>
                            <span className="hidden sm:inline">‡¶∂‡¶ø‡¶ï‡ßç‡¶∑‡¶æ‡¶∞‡ßç‡¶•‡ßÄ‡¶¨‡ßÉ‡¶®‡ßç‡¶¶ (3)</span>
                          </button>

                          <button
                            onClick={() => setSellerSubTab('certificates')}
                            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                              sellerSubTab === 'certificates'
                                ? 'bg-teal-400 text-slate-950 shadow-md'
                                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                            }`}
                          >
                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>‡¶∏‡¶æ‡¶∞‡ßç‡¶ü‡¶ø‡¶´‡¶ø‡¶ï‡ßá‡¶ü (1)</span>
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            setSellerSubTab('assignments');
                            setIsCreateAssignmentModalOpen(true);
                          }}
                          className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-90 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
                        >
                          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="sm:hidden">+ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü</span>
                          <span className="hidden sm:inline">+ ‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶∏‡¶æ‡¶á‡¶®‡¶Æ‡ßá‡¶®‡ßç‡¶ü</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-3 w-full py-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm text-teal-300 font-black flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞‡¶∂‡¶ø‡¶™ ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶™‡ßç‡¶≤‡¶ø‡¶ï‡ßá‡¶∂‡¶® ‡¶π‡¶æ‡¶¨
                          </span>
                          {isMentorPending && (
                            <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
                              ‡¶Ü‡¶¨‡ßá‡¶¶‡¶® ‡¶∞‡¶ø‡¶≠‡¶ø‡¶â‡¶§‡ßá ‡¶∞‡ßü‡ßá‡¶õ‡ßá
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => isMentorPending ? setIsMentorStatusModalOpen(true) : setIsMentorAppModalOpen(true)}
                          className="px-4 py-2 rounded-full text-xs sm:text-sm font-black bg-teal-500 hover:bg-teal-400 text-slate-950 transition cursor-pointer shadow-sm"
                        >
                          {isMentorPending ? '‡¶Ü‡¶¨‡ßá‡¶¶‡¶®‡ßá‡¶∞ ‡¶§‡¶•‡ßç‡¶Ø' : '‡¶Ü‡¶¨‡ßá‡¶¶‡¶® ‡¶´‡¶∞‡¶Æ'}
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
                          className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                            payoutSubTab === 'overview' || payoutSubTab === 'sources'
                              ? 'bg-[#1DB954] text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="sm:hidden">‡¶∏‡¶æ‡¶Æ‡¶æ‡¶∞‡¶ø</span>
                          <span className="hidden sm:inline">‡¶∏‡¶æ‡¶Æ‡¶æ‡¶∞‡¶ø ‡¶ì ‡¶¨‡ßç‡¶Ø‡¶æ‡¶≤‡ßá‡¶®‡ßç‡¶∏</span>
                        </button>

                        <button
                          onClick={() => setPayoutSubTab('history')}
                          className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
                            payoutSubTab === 'history'
                              ? 'bg-[#1DB954] text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="sm:hidden">‡¶π‡¶ø‡¶∏‡ßç‡¶ü‡ßã‡¶∞‡¶ø</span>
                          <span className="hidden sm:inline">‡¶â‡¶á‡¶•‡¶°‡ßç‡¶∞ ‡¶π‡¶ø‡¶∏‡ßç‡¶ü‡ßã‡¶∞‡¶ø</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setWithdrawSuccess(false);
                          setIsWithdrawModalOpen(true);
                        }}
                        className="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 sm:gap-2 whitespace-nowrap bg-gradient-to-r from-[#1DB954] to-emerald-400 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#1DB954]/20 border border-emerald-400 shrink-0"
                      >
                        <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>‡¶ï‡ßç‡¶Ø‡¶æ‡¶∂‡¶Ü‡¶â‡¶ü</span>
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
                          <span>‡¶™‡ßç‡¶∞‡¶™‡ßã‡¶ú‡¶æ‡¶≤ ‡¶∞‡¶æ‡¶á‡¶ü‡¶æ‡¶∞</span>
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
                          <span>‡¶á‡¶®‡¶≠‡¶Ø‡¶º‡ßá‡¶∏ ‡¶ú‡ßá‡¶®‡¶æ‡¶∞‡ßá‡¶ü‡¶∞</span>
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
                          <span>‡¶∞‡ßá‡¶ü ‡¶ï‡ßç‡¶Ø‡¶æ‡¶≤‡¶ï‡ßÅ‡¶≤‡ßá‡¶ü‡¶∞</span>
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
                          <span>‡¶ï‡¶®‡ßç‡¶ü‡ßç‡¶∞‡¶æ‡¶ï‡ßç‡¶ü ‡¶ú‡ßá‡¶®‡¶æ‡¶∞‡ßá‡¶ü‡¶∞</span>
                        </button>
                      </div>

                      <span className="px-3.5 py-1.5 bg-purple-500/20 text-purple-300 font-black text-xs rounded-full border border-purple-500/30 shrink-0 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                        <span>‡ßß‡ß¶‡ß¶% ‡¶´‡ßç‡¶∞‡¶ø ‡¶ü‡ßÅ‡¶≤‡¶∏</span>
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
                          ‡¶´‡ßç‡¶∞‡¶ø ‡¶è‡¶Ü‡¶á ‡¶ì ‡¶™‡ßç‡¶∞‡¶´‡ßá‡¶∂‡¶®‡¶æ‡¶≤ ‡¶ü‡ßÅ‡¶≤‡¶ï‡¶ø‡¶ü
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                          ‡¶á‡¶®‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶ü ‡¶è‡¶Ü‡¶á ‡¶™‡ßç‡¶∞‡¶™‡ßã‡¶ú‡¶æ‡¶≤, ‡¶á‡¶®‡¶≠‡¶Ø‡¶º‡ßá‡¶∏, ‡¶ï‡ßç‡¶Ø‡¶æ‡¶≤‡¶ï‡ßÅ‡¶≤‡ßá‡¶ü‡¶∞ ‡¶ì ‡¶ï‡¶®‡ßç‡¶ü‡ßç‡¶∞‡¶æ‡¶ï‡ßç‡¶ü
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
                        title={isToolkitSoundOn ? "‡¶∏‡¶æ‡¶â‡¶®‡ßç‡¶° ‡¶Ö‡¶® ‡¶Ü‡¶õ‡ßá (‡¶Æ‡¶ø‡¶â‡¶ü ‡¶ï‡¶∞‡¶§‡ßá ‡¶ï‡ßç‡¶≤‡¶ø‡¶ï ‡¶ï‡¶∞‡ßÅ‡¶®)" : "‡¶∏‡¶æ‡¶â‡¶®‡ßç‡¶° ‡¶¨‡¶®‡ßç‡¶ß ‡¶Ü‡¶õ‡ßá (‡¶ö‡¶æ‡¶≤‡ßÅ ‡¶ï‡¶∞‡¶§‡ßá ‡¶ï‡ßç‡¶≤‡¶ø‡¶ï ‡¶ï‡¶∞‡ßÅ‡¶®)"}
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
                        ‚ö° ‡ßß‡ß¶‡ß¶% ‡¶´‡ßç‡¶∞‡ßÄ ‡¶è‡¶Ü‡¶á
                      </span>
                    </div>
                  </div>

                  {/* Tool 1: AI Proposal Generator */}
                  {activeToolkit === 'proposal' && (
                    <div className="space-y-5 pt-1 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200">
                          ‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶ü‡¶æ‡¶á‡¶ü‡ßá‡¶≤ ‡¶¶‡¶ø‡¶®, ‡¶è‡¶Ü‡¶á ‡¶Ö‡¶ü‡ßã ‡¶™‡ßç‡¶∞‡¶™‡ßã‡¶ú‡¶æ‡¶≤ ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡¶¨‡ßá:
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="‡¶Ø‡ßá‡¶Æ‡¶®: Fullstack E-commerce Website in React & Node.js"
                          value={proposalJobTopic}
                          onChange={(e) => setProposalJobTopic(e.target.value)}
                          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DB954] transition"
                        />
                        <button
                          onClick={handleGenerateProposal}
                          disabled={isGeneratingProposal || !proposalJobTopic.trim()}
                          className="px-6 py-3 bg-[#1DB954] hover:bg-[#19a34a] disabled:opacity-50 text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 active:scale-95"
                        >
                          <Sparkles className="w-5 h-5 text-slate-950" />
                          <span>{isGeneratingProposal ? '‡¶ú‡ßá‡¶®‡¶æ‡¶∞‡ßá‡¶ü ‡¶π‡¶ö‡ßç‡¶õ‡ßá...' : 'AI Proposal ‡¶§‡ßà‡¶∞‡¶ø ‡¶ï‡¶∞‡ßÅ‡¶®'}</span>
                        </button>
                      </div>

                      {proposalResult && (
                        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-inner">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-sm font-black text-emerald-600 dark:text-[#1DB954] flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" /> AI Proposal ‡¶™‡ßç‡¶∞‡¶∏‡ßç‡¶§‡ßÅ‡¶§!
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
                              <span>{proposalCopied ? '‡¶ï‡¶™‡¶ø ‡¶π‡ßü‡ßá‡¶õ‡ßá!' : '‡¶ï‡¶™‡¶ø ‡¶ï‡¶∞‡ßÅ‡¶®'}</span>
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
                            ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü‡ßá‡¶∞ ‡¶®‡¶æ‡¶Æ
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
                            ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü (‡ß≥)
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
                          <span className="text-xs text-slate-400 font-mono">‡¶§‡¶æ‡¶∞‡¶ø‡¶ñ: 2026-08-14</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü:</strong> {invClientName}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏:</strong> {invProjectName}
                        </p>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 font-black text-base">
                          <span>‡¶Æ‡ßã‡¶ü ‡¶∏‡¶∞‡ßç‡¶¨‡¶Æ‡ßã‡¶ü ‡¶¨‡¶ø‡¶≤:</span>
                          <span className="text-[#1DB954] text-lg">‡ß≥{invAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <button
                          onClick={() => alert(`‚úì ‡¶á‡¶®‡¶≠‡¶Ø‡¶º‡ßá‡¶∏ #INV-2026-088 ‡¶∏‡¶´‡¶≤‡¶≠‡¶æ‡¶¨‡ßá ‡¶°‡¶æ‡¶â‡¶®‡¶≤‡ßã‡¶° ‡¶π‡ßü‡ßá‡¶õ‡ßá!`)}
                          className="w-full mt-3 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black rounded-2xl text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                        >
                          <FileText className="w-5 h-5 text-slate-950" />
                          <span>‡¶á‡¶®‡¶≠‡¶Ø‡¶º‡ßá‡¶∏ ‡¶°‡¶æ‡¶â‡¶®‡¶≤‡ßã‡¶° (PDF)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tool 3: Profit Calculator */}
                  {activeToolkit === 'calculator' && (
                    <div className="space-y-5 pt-1 animate-fadeIn">
                      <div>
                        <label className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 block mb-2">
                          ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü‡ßá‡¶∞ ‡¶Æ‡ßÇ‡¶≤ ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü (‡ß≥)
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
                          <span>‡¶è‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡ßã ‡¶ö‡¶æ‡¶∞‡ßç‡¶ú (5%):</span>
                          <span className="text-red-400 font-bold">- ‡ß≥{(calcGrossPrice * 0.05).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300 text-sm">
                          <span>‡¶™‡ßá‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶ó‡ßá‡¶ü‡¶ì‡¶Ø‡¶º‡ßá ‡¶´‡¶ø (1.8%):</span>
                          <span className="text-amber-500 font-bold">- ‡ß≥{(calcGrossPrice * 0.018).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-base font-black text-slate-900 dark:text-white">
                          <span>‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶Æ‡ßÇ‡¶≤ ‡¶®‡¶ø‡¶ü ‡¶Ü‡¶Ø‡¶º:</span>
                          <span className="text-[#1DB954] text-lg font-black">‡ß≥{(calcGrossPrice * 0.932).toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tool 4: Contract Generator */}
                  {activeToolkit === 'contract' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                        ‡¶¨‡¶æ‡¶Ç‡¶≤‡¶æ‡¶¶‡ßá‡¶∂ ‡¶≤‡¶ø‡¶ó‡ßç‡¶Ø‡¶æ‡¶≤ ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶° ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶ö‡ßÅ‡¶ï‡ßç‡¶§‡¶ø‡¶™‡¶§‡ßç‡¶∞ ‡¶ü‡ßá‡¶Æ‡¶™‡ßç‡¶≤‡ßá‡¶ü:
                      </p>
                      <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-sm">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between flex-wrap gap-2">
                          <span className="flex items-center gap-2 text-[#1DB954] font-black text-sm">
                            <ShieldCheck className="w-5 h-5 text-[#1DB954]" /> Standard NDA & Service Contract.pdf
                          </span>
                          <span className="text-slate-400 text-xs font-medium">Verified Legal Format</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm font-medium">
                          ‚Ä¢ ‡¶∏‡ßã‡¶∞‡ßç‡¶∏ ‡¶ï‡ßã‡¶° ‡¶ì ‡¶∞‡¶æ‡¶á‡¶ü‡¶∏ ‡¶π‡¶∏‡ßç‡¶§‡¶æ‡¶®‡ßç‡¶§‡¶∞ ‡¶∂‡¶∞‡ßç‡¶§‡¶æ‡¶¨‡¶≤‡ßÄ<br/>
                          ‚Ä¢ ‡ß´‡ß¶% ‡¶Ö‡¶ó‡ßç‡¶∞‡¶ø‡¶Æ ‡¶è‡¶∏‡ßç‡¶ï‡ßç‡¶∞‡ßã ‡¶Æ‡¶æ‡¶á‡¶≤‡¶∏‡ßç‡¶ü‡ßã‡¶® ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ<br/>
                          ‚Ä¢ ‡ß©‡ß¶ ‡¶¶‡¶ø‡¶®‡ßá‡¶∞ ‡¶´‡ßç‡¶∞‡¶ø ‡¶∏‡¶æ‡¶™‡ßã‡¶∞‡ßç‡¶ü ‡¶ì ‡¶∞‡¶ø‡¶≠‡¶ø‡¶∂‡¶® ‡¶™‡¶≤‡¶ø‡¶∏‡¶ø
                        </p>
                        <button
                          onClick={() => alert("‚úì ‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶°‡¶æ‡¶∞‡ßç‡¶° ‡¶´‡ßç‡¶∞‡¶ø‡¶≤‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶∏‡¶ø‡¶Ç ‡¶ö‡ßÅ‡¶ï‡ßç‡¶§‡¶ø‡¶™‡¶§‡ßç‡¶∞ ‡¶°‡¶æ‡¶â‡¶®‡¶≤‡ßã‡¶°‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶™‡ßç‡¶∞‡¶∏‡ßç‡¶§‡ßÅ‡¶§!")}
                          className="w-full mt-2 py-3 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                        >
                          <FileText className="w-5 h-5 text-slate-950" />
                          <span>‡¶ö‡ßÅ‡¶ï‡ßç‡¶§‡¶ø‡¶™‡¶§‡ßç‡¶∞ ‡¶°‡¶æ‡¶â‡¶®‡¶≤‡ßã‡¶° (PDF)</span>
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
                      {/* INCOMING LIVE ORDERS & OFFERS SHOWCASE (GIG CARD STYLE) */}
                      {activeOffersList.length > 0 && (
                        <div className="hidden lg:block bg-gradient-to-br from-emerald-950/20 via-slate-900/60 to-slate-950/80 border-2 border-emerald-500/30 dark:border-[#1DB954]/40 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-lg space-y-3.5 sm:space-y-4">
                          <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1DB954]"></span>
                              </span>
                              <div>
                                <h3 className="text-xs sm:text-base font-black text-white flex items-center gap-1.5 sm:gap-2">
                                  <span>‡¶á‡¶®‡¶ï‡¶æ‡¶Æ‡¶ø‡¶Ç ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶ì ‡¶Ö‡¶´‡¶æ‡¶∞</span>
                                  <span className="text-[10px] sm:text-xs bg-[#1DB954] text-white px-2 py-0.5 rounded-full font-black">
                                    {activeOffersList.length}‡¶ü‡¶ø ‡¶≤‡¶æ‡¶á‡¶≠
                                  </span>
                                </h3>
                                <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                                  ‡¶∏‡¶∞‡¶æ‡¶∏‡¶∞‡¶ø ‡¶ó‡¶ø‡¶ó ‡¶ï‡¶æ‡¶∞‡ßç‡¶°‡ßá ‡¶ï‡ßç‡¶≤‡¶ø‡¶ï ‡¶ï‡¶∞‡ßá ‡¶¨‡¶æ '‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠' ‡¶¨‡¶æ‡¶ü‡¶®‡ßá ‡¶ö‡ßá‡¶™‡ßá ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶ó‡ßç‡¶∞‡¶π‡¶£ ‡¶ï‡¶∞‡ßÅ‡¶®
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setIsSeeAllOffersModalOpen(true)}
                              className="text-[11px] sm:text-xs font-black text-[#1DB954] hover:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <span>‡¶∏‡¶¨‡¶ó‡ßÅ‡¶≤‡ßã ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Responsive 2-column mobile, 3-column desktop Gig Card Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
                            {activeOffersList.map((offer) => {
                              const isReceived = receivedOfferIds.includes(offer.id);
                              const thumbnailImg = getOfferThumbnail(offer);
                              return (
                                <div
                                  key={offer.id}
                                  onClick={() => setSelectedOfferForModal(offer)}
                                  className={`group relative bg-white dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer ${
                                    isReceived
                                      ? "border-emerald-500/50 opacity-80"
                                      : "border-slate-200 dark:border-slate-800 hover:border-[#1DB954] hover:shadow-xl hover:scale-[1.01]"
                                  }`}
                                >
                                  <div>
                                    {/* Thumbnail Image with Badges */}
                                    <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden bg-slate-950">
                                      <img
                                        src={thumbnailImg}
                                        alt={offer.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                                      {/* Top Left Badge: Type */}
                                      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1">
                                        {offer.type === "personal" ? (
                                          <span className="bg-amber-500/90 backdrop-blur-md text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg shadow-sm flex items-center gap-1">
                                            <Lock className="w-2.5 h-2.5" />
                                            <span>‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞</span>
                                          </span>
                                        ) : offer.type === "course" || offer.typeLabel?.includes("‡¶ï‡ßã‡¶∞‡ßç‡¶∏") ? (
                                          <span className="bg-teal-400/90 backdrop-blur-md text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg shadow-sm flex items-center gap-1">
                                            <Sparkles className="w-2.5 h-2.5" />
                                            <span>‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü</span>
                                          </span>
                                        ) : (
                                          <span className="bg-[#1DB954]/90 backdrop-blur-md text-slate-950 text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg shadow-sm flex items-center gap-1">
                                            <Zap className="w-2.5 h-2.5 fill-slate-950" />
                                            <span>‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶´‡¶æ‡¶∞</span>
                                          </span>
                                        )}

                                        <span className="bg-slate-950/80 backdrop-blur-md text-[#1DB954] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-[#1DB954]/30 w-fit">
                                          {offer.category}
                                        </span>
                                      </div>

                                      {/* Top Right Deadline Badge */}
                                      <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
                                        <span className="bg-slate-950/85 backdrop-blur-md text-amber-300 text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                                          <span>{offer.deadline}</span>
                                        </span>
                                      </div>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-2.5 sm:p-3.5 space-y-2">
                                      {/* Client Info Bar */}
                                      <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-[#1DB954] shrink-0">
                                          <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                              {offer.clientName}
                                            </span>
                                            {offer.isVerified && (
                                              <BadgeCheck className="w-3 h-3 text-[#1DB954] shrink-0" />
                                            )}
                                          </div>
                                          <span className="text-[8px] sm:text-[10px] text-slate-400 block truncate">
                                            {offer.clientLocation || "‡¶¨‡¶æ‡¶Ç‡¶≤‡¶æ‡¶¶‡ßá‡¶∂"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Offer Title */}
                                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
                                        {offer.title}
                                      </h4>

                                      {/* Requirements Snippet */}
                                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                                        {offer.requirements}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Footer: Price & Accept/View Button */}
                                  <div className="p-2.5 sm:p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 bg-slate-50/80 dark:bg-slate-950/50 rounded-b-2xl sm:rounded-b-3xl">
                                    <div className="min-w-0">
                                      <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold block leading-none">
                                        ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü/‡¶∏‡¶Æ‡ßç‡¶Æ‡¶æ‡¶®‡ßÄ
                                      </span>
                                      <span className="text-xs sm:text-base font-black text-[#1DB954] block font-mono mt-0.5">
                                        ‡ß≥{offer.budget.toLocaleString("bn-BD")}
                                      </span>
                                    </div>

                                    {isReceived ? (
                                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-[#1DB954] font-black text-[10px] sm:text-xs border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠‡¶°</span>
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleReceiveLiveOffer(offer);
                                        }}
                                        className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-[#1DB954] hover:bg-emerald-400 text-white text-[10px] sm:text-xs font-black rounded-lg sm:rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                                      >
                                        <Zap className="w-3 h-3 fill-slate-950" />
                                        <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {/* Filter Header & Stats */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs space-y-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-1">
                            <div>
                              <h3 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#1DB954]" />
                                <span>‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡¶∏</span>
                              </h3>
                            </div>
                          </div>

                        </div>

                        {/* Status Filter Tabs - 4 Responsive Columns Layout (Removed '‡¶∏‡¶ï‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞') */}
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 pt-1">
                          {(() => {
                            const pendingOrdersCount = marketplaceOrders.filter(o => o.status === 'pending' || o.status === 'pending_approval').length;
                            const inProgressCount = marketplaceOrders.filter(o => o.status === 'in_progress').length;
                            const inReviewCount = marketplaceOrders.filter(o => o.status === 'in_review' || o.status === 'revision_requested').length;
                            const completedCount = marketplaceOrders.filter(o => o.status === 'completed').length;

                            return [
                              { id: 'pending', label: '‡¶®‡¶§‡ßÅ‡¶® ‡¶™‡ßá‡¶®‡ßç‡¶°‡¶ø‡¶Ç', count: pendingOrdersCount, icon: Clock, color: 'text-amber-500' },
                              { id: 'in_progress', label: '‡¶ö‡¶≤‡¶Æ‡¶æ‡¶® ‡¶ï‡¶æ‡¶ú', count: inProgressCount, icon: Zap, color: 'text-blue-500' },
                              { id: 'in_review', label: '‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶Ö‡¶™‡ßá‡¶ï‡ßç‡¶∑‡¶æ‡¶Ø‡¶º', count: inReviewCount, icon: FileText, color: 'text-purple-500' },
                              { id: 'completed', label: '‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®', count: completedCount, icon: CheckCircle2, color: 'text-emerald-500' },
                            ].map(tab => {
                              const isSelected = sellerOrderFilter === tab.id;
                              const TabIcon = tab.icon;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => setSellerOrderFilter(tab.id as any)}
                                  className={`py-2 px-1 sm:px-2 rounded-xl sm:rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 min-w-0 ${
                                    isSelected
                                      ? 'bg-slate-100 dark:bg-slate-800 border-[#1DB954] text-slate-950 dark:text-white shadow-xs font-black ring-1 sm:ring-2 ring-[#1DB954]/30'
                                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-center gap-1 max-w-full">
                                    <TabIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${tab.color}`} />
                                    <span className="text-[9px] min-[360px]:text-[10px] sm:text-xs font-black leading-tight truncate">{tab.label}</span>
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

                        {/* Filtered Order List - Beautiful Home Card Style (3D Compact, Responsive on Phone, White Text Buttons) */}
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
                              <div className="p-8 text-center text-slate-400 space-y-2 font-bengali">
                                <Package className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">‡¶è‡¶á ‡¶´‡¶ø‡¶≤‡ßç‡¶ü‡¶æ‡¶∞‡ßá ‡¶ï‡ßã‡¶®‡ßã ‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶™‡¶æ‡¶ì‡ßü‡¶æ ‡¶Ø‡¶æ‡ßü‡¶®‡¶ø</p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-3 sm:space-y-3.5 font-bengali">
                              {filtered.map(ord => {
                                const isPendingApproval = ord.status === 'pending_approval';
                                const isPending = ord.status === 'pending';
                                const isInProgress = ord.status === 'in_progress';
                                const isInReview = ord.status === 'in_review' || ord.status === 'revision_requested';
                                const isCompleted = ord.status === 'completed';
                                const isExpanded = !!expandedSellerOrders[ord.id];

                                let glowGradient = "from-blue-500 via-indigo-400 to-cyan-400";
                                let leftAccentBorder = "border-l-[6px] border-l-blue-500";
                                let badgeClasses = "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
                                let statusLabel = "‡¶ö‡¶≤‡¶Æ‡¶æ‡¶®";
                                let StatusIcon = Zap;

                                if (isPendingApproval) {
                                  glowGradient = "from-amber-400 via-amber-300 to-yellow-400";
                                  leftAccentBorder = "border-l-[6px] border-l-amber-500";
                                  badgeClasses = "bg-amber-500 text-white border-amber-500";
                                  statusLabel = "‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡¶´‡¶æ‡¶∞";
                                  StatusIcon = Clock;
                                } else if (isPending) {
                                  glowGradient = "from-amber-400 via-orange-300 to-amber-500";
                                  leftAccentBorder = "border-l-[6px] border-l-amber-400";
                                  badgeClasses = "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
                                  statusLabel = "‡¶™‡ßá‡¶®‡ßç‡¶°‡¶ø‡¶Ç";
                                  StatusIcon = Clock;
                                } else if (isInReview) {
                                  glowGradient = "from-purple-500 via-fuchsia-400 to-pink-400";
                                  leftAccentBorder = "border-l-[6px] border-l-purple-500";
                                  badgeClasses = "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
                                  statusLabel = "‡¶∞‡¶ø‡¶≠‡¶ø‡¶â‡¶ß‡ßÄ‡¶®";
                                  StatusIcon = FileText;
                                } else if (isCompleted) {
                                  glowGradient = "from-emerald-400 via-teal-300 to-[#1DB954]";
                                  leftAccentBorder = "border-l-[6px] border-l-[#1DB954]";
                                  badgeClasses = "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-[#1DB954] border-emerald-200 dark:border-emerald-800";
                                  statusLabel = "‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®";
                                  StatusIcon = CheckCircle2;
                                } else if (ord.status === 'cancelled') {
                                  glowGradient = "from-rose-400 via-red-400 to-pink-400";
                                  leftAccentBorder = "border-l-[6px] border-l-rose-500";
                                  badgeClasses = "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
                                  statusLabel = "‡¶¨‡¶æ‡¶§‡¶ø‡¶≤";
                                  StatusIcon = ShieldAlert;
                                }

                                const sellerPayout = ord.sellerPayout || Math.round(ord.amount * 0.9);
                                const unreadCount = ord.unreadMessageCount !== undefined ? ord.unreadMessageCount : (ord.status === "in_progress" ? 2 : ord.status === "pending" ? 3 : 0);

                                let currentStepIndex = 0;
                                if (isPendingApproval || isPending) currentStepIndex = 0;
                                else if (isInProgress) currentStepIndex = 1;
                                else if (isInReview) currentStepIndex = 2;
                                else if (isCompleted) currentStepIndex = 3;

                                const timelineSteps = [
                                  { label: "‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞", icon: Clock },
                                  { label: "‡¶ö‡¶≤‡¶Æ‡¶æ‡¶® ‡¶ï‡¶æ‡¶ú", icon: Play },
                                  { label: "‡¶∞‡¶ø‡¶≠‡¶ø‡¶â", icon: UploadCloud },
                                  { label: "‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®", icon: CheckCircle2 },
                                ];

                                return (
                                  <div
                                    key={ord.id}
                                    className={`relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all p-3 sm:p-3.5 text-slate-800 dark:text-slate-100 ${leftAccentBorder}`}
                                  >


                                    {/* Row 1: Sender Profile, Order ID & Status Badge */}
                                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/80 mt-0.5">
                                      {/* Sender Info */}
                                      <div className="flex items-center gap-2 min-w-0">
                                        <div className="relative shrink-0">
                                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-500 shadow-xs">
                                            <User className="w-3.5 h-3.5 text-white" />
                                          </div>
                                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white truncate">
                                              {ord.buyerName || "‡¶ï‡ßç‡¶≤‡¶æ‡¶Ø‡¶º‡ßá‡¶®‡ßç‡¶ü ‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞"}
                                            </span>
                                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#1DB954] shrink-0" />
                                          </div>
                                          <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block leading-none">
                                            ‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‚Ä¢ {getTimeAgoBengali(ord.createdAt)}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Right Badges: ID & Status */}
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[9px] sm:text-[10px] font-bold rounded-md border border-slate-200 dark:border-slate-700">
                                          #{ord.id.slice(-6).toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black border flex items-center gap-1 shadow-2xs ${badgeClasses}`}>
                                          <StatusIcon className="w-3 h-3 shrink-0" />
                                          <span>{statusLabel}</span>
                                        </span>
                                      </div>
                                    </div>

                                    {/* Row 2: Project Title & Clean Concise Tags */}
                                    <div className="py-1.5 sm:py-2">
                                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-1" title={ord.title}>
                                        {ord.title}
                                      </h4>
                                      <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px] sm:text-[11px] font-medium">
                                        <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-md flex items-center gap-1">
                                          <Briefcase className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                          <span>{ord.category}</span>
                                        </span>
                                        <span className="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 rounded-md flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                                          <span>‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡ß© ‡¶¶‡¶ø‡¶®</span>
                                        </span>
                                      </div>
                                    </div>

                                    {/* Row 3: Compact 2-Column Earnings Box With Subtle Dashed Border (Like Home) */}
                                    <div className="grid grid-cols-2 gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 mb-2.5">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                                          <Banknote className="w-4 h-4 text-rose-600" />
                                        </div>
                                        <div>
                                          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold block leading-none">‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü</span>
                                          <span className="text-xs sm:text-sm font-black font-mono text-slate-800 dark:text-slate-200 leading-tight">
                                            ‡ß≥{ord.amount.toLocaleString("bn-BD")}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="border-l border-dashed border-slate-300 dark:border-slate-700 pl-2.5 flex items-center justify-between">
                                        <div>
                                          <span className="text-[9px] text-rose-600 dark:text-rose-400 font-bold block leading-none">‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶Ü‡ßü (‡ßØ‡ß¶%)</span>
                                          <span className="text-xs sm:text-sm font-black font-mono text-emerald-700 dark:text-[#1DB954] leading-tight">
                                            ‡ß≥{sellerPayout.toLocaleString("bn-BD")}
                                          </span>
                                        </div>
                                        <span className="hidden sm:inline-block px-1.5 py-0.5 bg-emerald-600 text-white text-[8px] font-black rounded">
                                          ‡¶á‡¶®‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶ü
                                        </span>
                                      </div>
                                    </div>

                                    {/* Row 3.5: Order Live Status Timeline & Tracking Time Box */}
                                    {(() => {
                                      const orderCountdown = getOrderCountdown(ord, nowTimestamp);
                                      return (
                                        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 mb-2.5 space-y-1.5">
                                          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold">
                                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                              <Clock className="w-3.5 h-3.5 text-[#1DB954]" />
                                              <span>‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶ü‡¶æ‡¶á‡¶Æ‡¶≤‡¶æ‡¶á‡¶®</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] sm:text-[10px] font-black flex items-center gap-1 ${orderCountdown?.badgeColor || "bg-blue-100 text-blue-700"}`}>
                                              <Clock className="w-3 h-3 shrink-0" />
                                              <span>{orderCountdown?.text || "‡¶∏‡¶Æ‡ßü ‡¶ö‡¶æ‡¶≤‡ßÅ"}</span>
                                            </span>
                                          </div>

                                          {/* 4-Step Interactive Timeline Visual Bar */}
                                          <div className="relative pt-1 pb-0.5">
                                            {/* Background Track Line */}
                                            <div className="absolute top-[13px] left-4 right-4 h-1 bg-slate-200 dark:bg-slate-700 z-0 rounded-full" />

                                            {/* Active Colored Progress Line */}
                                            <div
                                              className="absolute top-[13px] left-4 h-1 bg-[#1DB954] z-0 rounded-full transition-all duration-300"
                                              style={{ width: `${Math.max(4, (currentStepIndex / 3) * 88)}%` }}
                                            />

                                            {/* 4 Steps Indicator */}
                                            <div className="grid grid-cols-4 relative z-10">
                                              {timelineSteps.map((step, idx) => {
                                                const isDone = idx < currentStepIndex;
                                                const isCurrent = idx === currentStepIndex;
                                                const StepIcon = step.icon;

                                                return (
                                                  <div key={idx} className="flex flex-col items-center text-center">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-all ${
                                                      isDone
                                                        ? "bg-[#1DB954] text-white border-[#1DB954]"
                                                        : isCurrent
                                                        ? "bg-white dark:bg-slate-900 text-[#1DB954] border-2 border-[#1DB954] ring-2 ring-[#1DB954]/30 shadow-xs"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700"
                                                    }`}>
                                                      {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : <StepIcon className="w-2.5 h-2.5" />}
                                                    </div>
                                                    <span className={`text-[8px] sm:text-[9px] font-bold mt-1 leading-none truncate max-w-full ${
                                                      isCurrent ? "text-[#1DB954] font-black" : isDone ? "text-slate-800 dark:text-slate-200" : "text-slate-400"
                                                    }`}>
                                                      {step.label}
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>

                                          {/* 5% Penalty & 3% Bonus Notice (No Border, Compact, Clean) */}
                                          <div className="pt-1 flex items-center justify-center text-center">
                                            <div className="inline-flex items-center justify-center gap-1 font-bold text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-300">
                                              <Zap className="w-3 h-3 shrink-0 text-amber-500 fill-amber-500/30" />
                                              <span>‡¶∏‡¶Æ‡ßü‡¶Æ‡¶§‡ßã ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶ú‡¶Æ‡¶æ ‡¶®‡¶æ ‡¶¶‡¶ø‡¶≤‡ßá ‡ß´% ‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ</span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Row 4: Responsive Action Buttons (All White Text) */}
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      {/* 1. Chat Message Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          openChatWindow({
                                            id: `chat-order-${ord.id}`,
                                            orderId: ord.id,
                                            senderName: ord.buyerName,
                                            senderRole: "customer",
                                            initialMessage: `‡¶Ü‡¶∏‡¶∏‡¶æ‡¶≤‡¶æ‡¶Æ‡ßÅ ‡¶Ü‡¶≤‡¶æ‡¶á‡¶ï‡ßÅ‡¶Æ ${ord.buyerName}! ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü #${ord.id.slice(-6)} ("${ord.title}") ‡¶®‡¶ø‡ßü‡ßá ‡¶ï‡¶•‡¶æ ‡¶¨‡¶≤‡¶æ‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶Ü‡¶™‡¶®‡¶æ‡¶ï‡ßá ‡¶Æ‡ßá‡¶∏‡ßá‡¶ú ‡¶™‡¶æ‡¶†‡¶æ‡¶ö‡ßç‡¶õ‡¶ø‡•§`
                                          });
                                        }}
                                        className="flex-1 py-1.5 sm:py-2 px-2 bg-[#1DB954] hover:bg-[#19a34a] text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        title="‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞‡¶ï‡ßá ‡¶Æ‡ßá‡¶∏‡ßá‡¶ú ‡¶¶‡¶ø‡¶®"
                                      >
                                        <div className="relative shrink-0">
                                          <MessageSquare className="w-3.5 h-3.5 text-white fill-white/20" />
                                          {unreadCount > 0 && (
                                            <span className="absolute -top-2 -right-2 min-w-[15px] h-[15px] px-1 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
                                              {unreadCount}
                                            </span>
                                          )}
                                        </div>
                                        <span>‡¶Æ‡ßá‡¶∏‡ßá‡¶ú</span>
                                      </button>

                                      {/* 2. Primary Status Action Button */}
                                      {isPendingApproval && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            stopOfferNotificationSound();
                                            updateMarketplaceOrderStatus(ord.id, "in_progress", "‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá ‡¶è‡¶¨‡¶Ç ‡¶ï‡¶æ‡¶ú ‡¶∂‡ßÅ‡¶∞‡ßÅ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá‡•§");
                                            updateMarketplaceOrder(ord.id, { unreadMessageCount: 3 });
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                          <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠</span>
                                        </button>
                                      )}

                                      {isPending && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            stopOfferNotificationSound();
                                            updateMarketplaceOrderStatus(ord.id, "in_progress", "‡¶ï‡¶æ‡¶ú ‡¶∂‡ßÅ‡¶∞‡ßÅ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá‡•§");
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        >
                                          <Play className="w-3.5 h-3.5 fill-white text-white" />
                                          <span>‡¶ï‡¶æ‡¶ú ‡¶∂‡ßÅ‡¶∞‡ßÅ</span>
                                        </button>
                                      )}

                                      {isInProgress && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDeliveringOrder(ord);
                                            setDeliveryNote(`‡¶™‡ßç‡¶∞‡¶ø‡ßü ${ord.buyerName}, ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü‡¶ü‡¶ø ‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶ï‡¶∞‡ßá‡¶õ‡¶ø‡•§ ‡¶Ö‡¶®‡ßÅ‡¶ó‡ßç‡¶∞‡¶π ‡¶ï‡¶∞‡ßá ‡¶´‡¶æ‡¶á‡¶≤ ‡¶∞‡¶ø‡¶≠‡¶ø‡¶ì ‡¶ï‡¶∞‡ßÅ‡¶®‡•§`);
                                            setDeliveryFileUrl(`https://github.com/example/project-${ord.id}.zip`);
                                            setDeliveryFileName(`project-release-${ord.id}.zip`);
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        >
                                          <UploadCloud className="w-3.5 h-3.5 text-white" />
                                          <span>‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø</span>
                                        </button>
                                      )}

                                      {isInReview && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDeliveringOrder(ord);
                                            setDeliveryNote(ord.deliveryNote || "");
                                            setDeliveryFileUrl(ord.deliveryFileUrl || "");
                                            setDeliveryFileName(ord.deliveryFileName || "delivered-file.zip");
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        >
                                          <Eye className="w-3.5 h-3.5 text-white" />
                                          <span>‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®</span>
                                        </button>
                                      )}

                                      {isCompleted && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setDeliveringOrder(ord);
                                            setDeliveryNote(ord.deliveryNote || "");
                                            setDeliveryFileUrl(ord.deliveryFileUrl || "");
                                            setDeliveryFileName(ord.deliveryFileName || "delivered-file.zip");
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                          <span>‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶® ‡¶´‡¶æ‡¶á‡¶≤</span>
                                        </button>
                                      )}

                                      {/* 3. Details Pop Button */}
                                      <button
                                        type="button"
                                        onClick={() => setViewingOrderDetails(ord)}
                                        className="py-1.5 sm:py-2 px-2.5 bg-slate-700 hover:bg-slate-800 active:scale-95 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                                        title="‡¶ï‡¶æ‡¶ú‡ßá‡¶∞ ‡¶∏‡¶Æ‡ßç‡¶™‡ßÇ‡¶∞‡ßç‡¶£ ‡¶§‡¶•‡ßç‡¶Ø ‡¶ì ‡¶¨‡ßç‡¶∞‡¶ø‡¶´ ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®"
                                      >
                                        <Info className="w-3.5 h-3.5 text-white" />
                                        <span>‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§</span>
                                        <ExternalLink className="w-2.5 h-2.5 text-white/80" />
                                      </button>
                                    </div>

                                    {/* Expandable Seller Details Section */}
                                    {isExpanded && (
                                      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fadeIn text-xs sm:text-sm mt-2.5">
                                        <div className="bg-slate-50/90 dark:bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                                          <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                                            <FileText className="w-3.5 h-3.5 text-[#1DB954]" />
                                            <span>‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞‡ßá‡¶∞ ‡¶∞‡¶ø‡¶ï‡ßã‡ßü‡¶æ‡¶∞‡¶Æ‡ßá‡¶®‡ßç‡¶ü & ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶®‡ßã‡¶ü:</span>
                                          </h4>
                                          <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-[10px] sm:text-xs">
                                            {ord.requirements || "‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶•‡ßá‡¶ï‡ßá ‡¶™‡ßç‡¶∞‡¶æ‡¶™‡ßç‡¶§ ‡¶®‡¶ø‡¶∞‡ßç‡¶¶‡¶ø‡¶∑‡ßç‡¶ü ‡¶™‡ßç‡¶∞‡ßü‡ßã‡¶ú‡¶®‡ßÄ‡ßü ‡¶®‡¶ø‡¶∞‡ßç‡¶¶‡ßá‡¶∂‡¶®‡¶æ ‡¶Ö‡¶®‡ßÅ‡¶Ø‡¶æ‡ßü‡ßÄ ‡¶°‡ßá‡¶≠‡ßá‡¶≤‡¶™‡¶Æ‡ßá‡¶®‡ßç‡¶ü ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶® ‡¶ï‡¶∞‡¶æ ‡¶π‡¶ö‡ßç‡¶õ‡ßá‡•§"}
                                          </p>
                                        </div>

                                        {ord.deliveryNote && (
                                          <div className="bg-emerald-50/90 dark:bg-emerald-950/30 p-2.5 sm:p-3 rounded-xl border border-emerald-500/30 space-y-1">
                                            <h4 className="font-black text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]" />
                                              <span>‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡ßá‡¶∞‡¶ø‡¶§ ‡¶°‡ßá‡¶≤‡¶ø‡¶≠‡¶æ‡¶∞‡¶ø ‡¶¨‡¶æ‡¶∞‡ßç‡¶§‡¶æ:</span>
                                            </h4>
                                            <p className="text-emerald-900 dark:text-emerald-200 font-medium text-[10px] sm:text-xs">
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
                    <div className="space-y-3.5 sm:space-y-6">
                      {/* üåü SELLER MODE COMPACT ACTION CARDS (TIGHT SPACING & SHORT TEXT) */}
                      <div className="space-y-1.5 sm:space-y-2.5">
                        <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                          <span>Welcome back,</span>
                          <span className="text-[#1DB954]">
                            {(activeAccount.name || currentUser?.name || 'Mds Kazi Sohag')
                              .replace(/\s*\((?:‡¶´‡ßç‡¶∞‡¶ø‡¶≤‡¶æ‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶∏‡¶æ‡¶∞\s*)?‡¶∏‡ßá‡¶≤‡¶æ‡¶∞\)/gi, '')
                              .replace(/\s*\((?:‡¶ó‡ßç‡¶∞‡¶æ‡¶π‡¶ï\s*)?‡¶¨‡¶æ‡ßü‡¶æ‡¶∞\)/gi, '')
                              .replace(/\s*\(Student\s*\/\s*Buyer\)/gi, '')
                              .trim()}
                          </span>{' '}
                          <span className="text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm">
                            (‡¶∏‡ßá‡¶≤‡¶æ‡¶∞)
                          </span>
                        </h1>

                        {/* TWO COMPACT RECOMMENDED ACTION CARDS FOR SELLER (POST A GIG + BUYER MODE) */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          
                          {/* CARD 1: POST A GIG (Original clean button color) */}
                          <div 
                            onClick={() => {
                              setViewMode('selling');
                              setSellerSubTab('create_gig');
                              setSelectedGig(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 shadow-2xs hover:border-[#1DB954] dark:hover:border-[#1DB954] transition cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#1DB954]/15 dark:bg-[#1DB954]/25 text-[#1DB954] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <PlusCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight truncate">‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶ó‡¶ø‡¶ó</h3>
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">‡ß©‡¶ü‡¶ø ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewMode('selling');
                                setSellerSubTab('create_gig');
                                setSelectedGig(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full sm:w-auto px-2 py-0.5 sm:px-3 sm:py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1DB954] dark:hover:border-[#1DB954] text-slate-800 dark:text-slate-200 text-[10px] sm:text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap text-center shadow-2xs group-hover:bg-[#1DB954] group-hover:text-white group-hover:border-[#1DB954]"
                            >
                              Get started
                            </button>
                          </div>

                          {/* CARD 2: BUYER MODE (SWITCH TO BUYER - Blue Theme, Blue Icon & Text, Blue Button with White Text) */}
                          <div 
                            onClick={() => {
                              setViewMode('buying');
                              setActiveSubTab('gigs');
                              setSelectedGig(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 shadow-2xs hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/15 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Store className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 leading-tight truncate">‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°</h3>
                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶ì ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewMode('buying');
                                setActiveSubTab('gigs');
                                setSelectedGig(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="w-full sm:w-auto px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white text-[10px] sm:text-xs font-black rounded-lg transition cursor-pointer whitespace-nowrap text-center shadow-xs active:scale-95"
                            >
                              ‡¶∏‡ßÅ‡¶á‡¶ö ‡¶ï‡¶∞‡ßÅ‡¶®
                            </button>
                          </div>

                        </div>
                      </div>
                      {/* ‚ö° LIVE OFFER & ORDER NOTIFICATION BANNER / LIVE SEARCH (TOP HEADER ON HOME) */}
                      <div className="font-bengali space-y-3">
                        {activeOffersList.length > 0 && activeOffersList[activeOfferIndex % activeOffersList.length] ? (
                          (() => {
                            const currentOffer = activeOffersList[activeOfferIndex % activeOffersList.length];
                            const timerPercentage = totalOfferDuration > 0 ? (offerCountdown / totalOfferDuration) * 100 : 0;
                            const isBeingActioned = justActionedOfferId === currentOffer.id;
                            const sellerPayout = Math.round(currentOffer.budget * 0.9);

                            return (
                              <div
                                onMouseEnter={() => setIsOfferPaused(true)}
                                onMouseLeave={() => setIsOfferPaused(false)}
                                className="w-full max-w-2xl mx-auto font-bengali"
                              >
                                {/* 1. CENTERED AUTO-SEARCH STYLE LIVE TEXT WITH SEQUENTIAL ANIMATED DOTS (SAME FONT SIZE AS LIVE ORDER SEARCH) */}
                                <div className="flex items-center justify-center gap-2 mb-2 px-3 py-1 w-fit mx-auto select-none">
                                  <div className="relative flex items-center justify-center">
                                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-60" />
                                  </div>
                                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center justify-center tracking-tight">
                                    <span>‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶è‡¶∏‡ßá‡¶õ‡ßá</span>
                                    <span className="inline-flex items-center ml-1 font-black text-emerald-500 dark:text-[#1DB954] text-base sm:text-lg select-none">
                                      <span className="animate-pulse inline-block" style={{ animationDelay: "0ms", animationDuration: "1.2s" }}>.</span>
                                      <span className="animate-pulse inline-block" style={{ animationDelay: "300ms", animationDuration: "1.2s" }}>.</span>
                                      <span className="animate-pulse inline-block" style={{ animationDelay: "600ms", animationDuration: "1.2s" }}>.</span>
                                    </span>
                                  </h4>
                                </div>

                                {/* 2. 3D COMPACT ORDER CARD (REDUCED HEIGHT, EXPANDED WIDTH, CRISP TYPOGRAPHY) */}
                                <div className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-emerald-50/20 rounded-2xl sm:rounded-3xl border-t-2 border-l-2 border-r-2 border-b-4 border-slate-200 hover:border-emerald-300 shadow-[0_12px_28px_-8px_rgba(16,185,129,0.14),0_4px_12px_-2px_rgba(0,0,0,0.05)] p-3 sm:p-3.5 text-slate-800 transition-all font-bengali">
                                  {/* Ambient Top Glow Line */}
                                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400" />

                                  {/* Row 1: Sender Profile & Multi-Order Switcher */}
                                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 mt-0.5">
                                    {/* Sender Info */}
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="relative shrink-0">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xs flex items-center justify-center ring-2 ring-emerald-500 shadow-xs">
                                          <User className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1">
                                          <span className="text-xs sm:text-[13px] font-black text-slate-900 truncate">
                                            {currentOffer.clientName || "PTENit IT Academy"}
                                          </span>
                                          {currentOffer.isVerified && (
                                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          )}
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] text-emerald-700 font-bold block leading-none">
                                          {currentOffer.type === "personal" ? "‡¶°‡¶ø‡¶∞‡ßá‡¶ï‡ßç‡¶ü ‡¶™‡¶æ‡¶∞‡ßç‡¶∏‡ßã‡¶®‡¶æ‡¶≤ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞" : "‡¶Æ‡ßá‡¶á‡¶® ‡¶è‡¶°‡¶Æ‡¶ø‡¶® ‚Ä¢ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞"}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Right Badges: Count */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setIsSeeAllOffersModalOpen(true)}
                                        className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                                        title="‡¶∏‡¶ï‡¶≤ ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶è‡¶ï‡¶∏‡¶æ‡¶•‡ßá ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®"
                                      >
                                        <span className="font-mono">{activeOffersList.length}</span>
                                        <span>‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞</span>
                                        <ChevronRight className="w-3 h-3 text-emerald-700" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Row 2: Project Title & Clean Tags (No Borders, Light Soft Backgrounds, Lucide Icons) */}
                                  <div className="py-1.5 sm:py-2">
                                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug line-clamp-1" title={currentOffer.title}>
                                      {currentOffer.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px] sm:text-[11px] font-medium">
                                      <span className="px-2 py-0.5 bg-sky-50/80 text-sky-700 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-sky-600" />
                                        <span>{currentOffer.deadline}</span>
                                      </span>
                                      <span className="px-2 py-0.5 bg-purple-50/80 text-purple-700 rounded-md flex items-center gap-1">
                                        <Briefcase className="w-3 h-3 text-purple-600" />
                                        <span>{currentOffer.category}</span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 3: Compact Earnings Box With Subtle Dashed Border */}
                                  <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50/90 border border-dashed border-slate-300 dark:border-slate-700 mb-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                                        <Banknote className="w-4 h-4 text-rose-600" />
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-slate-500 font-bold block leading-none">‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¨‡¶æ‡¶ú‡ßá‡¶ü</span>
                                        <span className="text-xs sm:text-sm font-black font-mono text-slate-800 leading-tight">
                                          ‡ß≥{currentOffer.budget.toLocaleString("bn-BD")}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="border-l border-dashed border-slate-300 dark:border-slate-700 pl-2.5 flex items-center justify-between">
                                      <div>
                                        <span className="text-[9px] text-rose-600 font-bold block leading-none">‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶Ü‡ßü (‡ßØ‡ß¶%)</span>
                                        <span className="text-sm sm:text-base font-black font-mono text-emerald-700 leading-tight">
                                          ‡ß≥{sellerPayout.toLocaleString("bn-BD")}
                                        </span>
                                      </div>
                                      <span className="hidden sm:inline-block px-1.5 py-0.5 bg-emerald-600 text-white text-[8px] font-black rounded">
                                        ‡¶á‡¶®‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶ü
                                      </span>
                                    </div>
                                  </div>

                                  {/* Row 4: 2 Action Buttons With Countdown in the Middle */}
                                  <div className="flex items-center gap-2">
                                    {/* ‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§ Button */}
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOfferForModal(currentOffer)}
                                      className="flex-1 py-2 px-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                                    >
                                      <Info className="w-3.5 h-3.5 text-slate-500" />
                                      <span>‡¶¨‡¶ø‡¶∏‡ßç‡¶§‡¶æ‡¶∞‡¶ø‡¶§</span>
                                    </button>

                                    {/* Center Countdown Badge */}
                                    <div className="flex items-center gap-1 font-mono text-[11px] text-amber-700 font-black bg-amber-50 px-2 py-1.5 rounded-xl shrink-0 select-none">
                                      <Clock className="w-3 h-3 text-amber-500 animate-spin" style={{ animationDuration: "4s" }} />
                                      <span>{offerCountdown}s</span>
                                    </div>

                                    {/* ‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡ßÅ‡¶® Button */}
                                    {isBeingActioned && offerActionType === "received" ? (
                                      <button
                                        disabled
                                        className="flex-1 py-2 px-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 flex items-center justify-center gap-1 animate-pulse"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                        <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠‡¶°!</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleReceiveLiveOffer(currentOffer)}
                                        className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 transition flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <Zap className="w-3.5 h-3.5 fill-white text-white" />
                                        <span>‡¶∞‡¶ø‡¶∏‡¶ø‡¶≠ ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                                      </button>
                                    )}
                                  </div>

                                  {/* Micro Animated Progress Line */}
                                  <div className="w-full bg-slate-100 rounded-full h-1 mt-2.5 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-linear"
                                      style={{ width: `${timerPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          /* SEARCHING STATE WHEN NO LIVE OFFERS ACTIVE */
                          <div className="p-4 sm:p-5 bg-emerald-50/25 dark:bg-emerald-950/20 border border-dashed border-emerald-500/30 rounded-2xl sm:rounded-3xl text-center space-y-2 relative overflow-hidden shadow-2xs font-bengali">
                            {/* Animated Radio Radar Icon */}
                            <div className="relative w-10 h-10 mx-auto flex items-center justify-center">
                              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                              <div className="w-9 h-9 rounded-full bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40 flex items-center justify-center relative z-10">
                                <Radio className="w-4 h-4 animate-pulse" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center justify-center tracking-tight">
                                <span>Live order ‡¶∏‡¶æ‡¶∞‡ßç‡¶ö ‡¶π‡¶ö‡ßç‡¶õ‡ßá</span>
                                <span className="inline-flex items-center ml-1 font-black text-emerald-500 dark:text-[#1DB954] text-base sm:text-lg select-none">
                                  <span className="animate-pulse inline-block" style={{ animationDelay: '0ms', animationDuration: '1.2s' }}>.</span>
                                  <span className="animate-pulse inline-block" style={{ animationDelay: '300ms', animationDuration: '1.2s' }}>.</span>
                                  <span className="animate-pulse inline-block" style={{ animationDelay: '600ms', animationDuration: '1.2s' }}>.</span>
                                </span>
                              </h4>
                              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                                ‡¶®‡¶§‡ßÅ‡¶® ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞‡ßá‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶∏‡¶ø‡¶∏‡ßç‡¶ü‡ßá‡¶Æ ‡¶∏‡ßç‡¶ï‡ßç‡¶Ø‡¶æ‡¶® ‡¶ï‡¶∞‡¶õ‡ßá<br />
                                ‡¶Ö‡¶´‡¶æ‡¶∞ ‡¶Ü‡¶∏‡¶æ‡¶Æ‡¶æ‡¶§‡ßç‡¶∞‡¶á ‡¶∏‡¶æ‡¶â‡¶®‡ßç‡¶° ‡¶Ö‡ßç‡¶Ø‡¶æ‡¶≤‡¶æ‡¶∞‡ßç‡¶ü ‡¶∏‡¶π ‡¶∂‡ßã ‡¶ï‡¶∞‡¶¨‡ßá
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* ‚ö° ‚ö° ‡¶Ü‡¶™‡¶≤‡ßã‡¶°‡¶ï‡ßÉ‡¶§ ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π SHOWCASE (HEADER + 2 COLUMNS 2-3 ROWS) */}
                        <div className="pt-2 sm:pt-3 space-y-3 font-bengali">
                          {/* Header: Title on Left, See All & Add Buttons on Right */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-[#1DB954] flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4" />
                              </div>
                              <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>‡¶Ü‡¶™‡¶≤‡ßã‡¶°‡¶ï‡ßÉ‡¶§ ‡¶ó‡¶ø‡¶ó‡¶∏‡¶Æ‡ßÇ‡¶π</span>
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-[#1DB954] text-[10px] font-black rounded-full">
                                  {sellerGigs.length}‡¶ü‡¶ø
                                </span>
                              </h3>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* ‡¶∏‡¶¨‡¶ó‡ßÅ‡¶≤‡ßã ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶® Button that takes to the full gigs page */}
                              <button
                                type="button"
                                onClick={() => {
                                  setViewMode('selling');
                                  setSpecialistMainTab('marketplace');
                                  setSellerSubTab('gigs');
                                  setSelectedGig(null);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-[#1DB954] hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-black rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap border-0"
                              >
                                <span>‡¶∏‡¶¨‡¶ó‡ßÅ‡¶≤‡ßã ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* 2-Column Responsive Gigs Grid (2 to 3 rows) */}
                          {sellerGigs.length === 0 ? (
                            <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2.5 font-bengali shadow-sm">
                              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-[#1DB954] flex items-center justify-center mx-auto ring-4 ring-emerald-500/5">
                                <UploadCloud className="w-6 h-6" />
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                  ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶è‡¶ñ‡¶® ‡¶™‡¶∞‡ßç‡¶Ø‡¶®‡ßç‡¶§ ‡¶ï‡ßã‡¶®‡ßã ‡¶Ü‡¶™‡¶≤‡ßã‡¶°‡¶ï‡ßÉ‡¶§ ‡¶ó‡¶ø‡¶ó ‡¶®‡ßá‡¶á
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                                  ‡¶Ü‡¶™‡¶®‡¶æ‡¶∞ ‡¶∏‡¶æ‡¶∞‡ßç‡¶≠‡¶ø‡¶∏ ‡¶ì ‡¶∏‡ßç‡¶ï‡¶ø‡¶≤ ‡¶®‡¶ø‡ßü‡ßá ‡¶Ü‡¶ï‡¶∞‡ßç‡¶∑‡¶£‡ßÄ‡ßü ‡¶™‡ßç‡¶Ø‡¶æ‡¶ï‡ßá‡¶ú ‡¶∏‡¶π ‡¶®‡¶§‡ßÅ‡¶® ‡¶ó‡¶ø‡¶ó ‡¶Ü‡¶™‡¶≤‡ßã‡¶° ‡¶ï‡¶∞‡ßÅ‡¶®‡•§
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setViewMode('selling');
                                  setSellerSubTab('create_gig');
                                  setSelectedGig(null);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>‡¶™‡ßç‡¶∞‡¶•‡¶Æ ‡¶ó‡¶ø‡¶ó ‡¶™‡ßã‡¶∏‡ßç‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3.5">
                              {(showAllSellerGigs ? sellerGigs : sellerGigs.slice(0, 6)).map(g => (
                                <div
                                  key={g.id}
                                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#1DB954] transition-all duration-200 shadow-2xs hover:shadow-lg flex flex-col justify-between group relative"
                                >
                                  {/* Thumbnail & Badges */}
                                  <div className="relative h-28 sm:h-36 overflow-hidden bg-slate-900">
                                    <img
                                      src={g.thumbnail}
                                      alt={g.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                                    {/* Top Left: Category & Active Badge */}
                                    <div className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1">
                                      <span className="bg-slate-950/85 backdrop-blur-md text-[#1DB954] text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#1DB954]/30 shadow-xs truncate max-w-[80px]">
                                        {g.category}
                                      </span>
                                      <span className="bg-emerald-500/90 text-white text-[7px] sm:text-[8px] font-black px-1 py-0.2 rounded-full shadow-xs flex items-center gap-0.5">
                                        <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                        <span>‡¶≤‡¶æ‡¶á‡¶≠</span>
                                      </span>
                                    </div>

                                    {/* Top Right: 3-Dot Options Dropdown */}
                                    <div className="absolute top-1.5 right-1.5 z-20">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveGigMenuId(activeGigMenuId === g.id ? null : g.id);
                                        }}
                                        className="w-6 h-6 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition cursor-pointer active:scale-95"
                                        title="‡¶Ö‡¶™‡¶∂‡¶®"
                                      >
                                        <MoreVertical className="w-3 h-3" />
                                      </button>

                                      {activeGigMenuId === g.id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-20 cursor-default"
                                            onClick={() => setActiveGigMenuId(null)}
                                          />
                                          <div
                                            className="absolute right-0 top-7 z-30 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 space-y-1 font-bengali animate-fadeIn"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <button
                                              type="button"
                                              onClick={() => {
                                                handleOpenEditGig(g);
                                                setActiveGigMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-[#1DB954] rounded-lg transition text-left cursor-pointer"
                                            >
                                              <Edit className="w-3 h-3" />
                                              <span>‡¶ó‡¶ø‡¶ó ‡¶è‡¶°‡¶ø‡¶ü</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setPerformanceGig(g);
                                                setActiveGigMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition text-left cursor-pointer"
                                            >
                                              <BarChart2 className="w-3 h-3" />
                                              <span>‡¶∞‡¶ø‡¶ö/‡¶≠‡¶ø‡¶â</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedGig(g);
                                                setActiveGigMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-500/10 hover:text-amber-500 rounded-lg transition text-left cursor-pointer"
                                            >
                                              <Eye className="w-3 h-3" />
                                              <span>‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶™‡ßç‡¶∞‡¶ø‡¶≠‡¶ø‡¶â</span>
                                            </button>

                                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                            <button
                                              type="button"
                                              onClick={() => {
                                                handleDeleteGig(g.id, g.title);
                                                setActiveGigMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2 px-2 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-500/10 rounded-lg transition text-left cursor-pointer"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                              <span>‡¶°‡¶ø‡¶≤‡¶ø‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®</span>
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Card Content & Details */}
                                  <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                      <h4 className="text-[11px] sm:text-xs md:text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors min-h-[1.9rem] sm:min-h-[2.2rem]">
                                        {g.title}
                                      </h4>
                                      <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold">‡¶∂‡ßÅ‡¶∞‡ßÅ ‡¶Æ‡¶æ‡¶§‡ßç‡¶∞</span>
                                        <span className="text-[11px] sm:text-xs font-black text-[#1DB954] font-mono">
                                          ‡ß≥{(g.packages?.basic?.price ?? g.price ?? 2500).toLocaleString('bn-BD')}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Performance & Reach Mini Grid */}
                                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/70 grid grid-cols-2 gap-1 text-[8px] sm:text-[9px]">
                                      <div>
                                        <span className="text-slate-400 block text-[7px] sm:text-[8px]">üëÅÔ∏è ‡¶≠‡¶ø‡¶â</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">
                                          {((g.salesCount || 1) * 120 + 85).toLocaleString('bn-BD')}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[7px] sm:text-[8px]">üìà ‡¶∞‡¶ø‡¶ö</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">
                                          {((g.salesCount || 1) * 450 + 320).toLocaleString('bn-BD')}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[7px] sm:text-[8px]">üì¶ ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞</span>
                                        <span className="font-extrabold text-emerald-600 dark:text-[#1DB954]">
                                          {(g.salesCount || 12).toLocaleString('bn-BD')}‡¶ü‡¶ø
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 block text-[7px] sm:text-[8px]">üí∞ ‡¶Ü‡ßü</span>
                                        <span className="font-extrabold text-emerald-600 dark:text-[#1DB954] truncate block">
                                          ‡ß≥{((g.price || g.packages?.basic?.price || 2500) * (g.salesCount || 12)).toLocaleString('bn-BD')}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Mobile-Friendly Quick Interactive Action Buttons */}
                                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditGig(g)}
                                        className="flex-1 py-1 px-1 bg-emerald-500/10 hover:bg-[#1DB954] text-emerald-700 dark:text-[#1DB954] hover:text-white font-black text-[9px] sm:text-[10px] rounded-lg transition border border-[#1DB954]/30 flex items-center justify-center gap-0.5 cursor-pointer active:scale-95"
                                        title="‡¶ó‡¶ø‡¶ó ‡¶è‡¶°‡¶ø‡¶ü ‡¶ï‡¶∞‡ßÅ‡¶®"
                                      >
                                        <Edit className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>‡¶è‡¶°‡¶ø‡¶ü</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setPerformanceGig(g)}
                                        className="flex-1 py-1 px-1 bg-blue-500/10 hover:bg-blue-600 text-blue-700 dark:text-blue-400 hover:text-white font-black text-[9px] sm:text-[10px] rounded-lg transition border border-blue-500/30 flex items-center justify-center gap-0.5 cursor-pointer active:scale-95"
                                        title="‡¶∞‡¶ø‡¶ö ‡¶ì ‡¶™‡¶æ‡¶∞‡¶´‡¶∞‡¶Æ‡ßá‡¶®‡ßç‡¶∏ ‡¶¶‡ßá‡¶ñ‡ßÅ‡¶®"
                                      >
                                        <BarChart2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>‡¶∞‡¶ø‡¶ö</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setSelectedGig(g)}
                                        className="flex-1 py-1 px-1 bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-slate-950 font-black text-[9px] sm:text-[10px] rounded-lg transition border border-amber-500/30 flex items-center justify-center gap-0.5 cursor-pointer active:scale-95"
                                        title="‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶Æ‡ßã‡¶°‡ßá ‡¶™‡ßç‡¶∞‡¶ø‡¶≠‡¶ø‡¶â"
                                      >
                                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                        <span>‡¶™‡ßç‡¶∞‡¶ø‡¶≠‡¶ø‡¶â</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          handleDeleteGig(g.id, g.title);
                                        }}
                                        className="p-1 bg-rose-500/10 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white font-black rounded-lg transition border border-rose-500/30 flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
                                        title="‡¶ó‡¶ø‡¶ó ‡¶°‡¶ø‡¶≤‡¶ø‡¶ü"
                                      >
                                        <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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
                            note: "‡¶Ü‡¶ó‡¶∏‡ßç‡¶ü ‡ß®‡ß¶‡ß®‡ß¨ ‡ßß‡¶Æ ‡¶∏‡¶™‡ßç‡¶§‡¶æ‡¶π‡ßá‡¶∞ ‡¶á‡¶®‡¶∏‡ßç‡¶ü‡ßç‡¶Ø‡¶æ‡¶®‡ßç‡¶ü ‡¶ï‡ßç‡¶Ø‡¶æ‡¶∂‡¶Ü‡¶â‡¶ü",
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
                            note: "‡¶ú‡ßÅ‡¶≤‡¶æ‡¶á ‡ß®‡ß¶‡ß®‡ß¨ ‡ß®‡ßü ‡¶ï‡¶ø‡¶∏‡ßç‡¶§‡¶ø ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶ì ‡¶ó‡¶ø‡¶ó ‡¶™‡ßá‡¶Ü‡¶â‡¶ü",
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
                            note: "‡¶¨‡ßç‡¶Ø‡¶æ‡¶Ç‡¶ï ‡¶ü‡ßç‡¶∞‡¶æ‡¶®‡ßç‡¶∏‡¶´‡¶æ‡¶∞ ‡¶™‡ßá‡¶Ü‡¶â‡¶ü ‡¶∞‡¶ø‡¶ï‡ßã‡ßü‡ßá‡¶∏‡ßç‡¶ü",
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
                            note: "‡¶Ö‡¶®‡¶≤‡¶æ‡¶á‡¶® ‡¶ï‡ßç‡¶Ø‡¶æ‡¶∂‡¶Ü‡¶â‡¶ü ‡¶Ü‡¶¨‡ßá‡¶¶‡¶® (‡¶™‡ßç‡¶∞‡¶ï‡ßç‡¶∞‡¶ø‡ßü‡¶æ‡¶ß‡ßÄ‡¶®)",
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
                                  <button onClick={() => setCashoutSuccessMsg('')} className="p-1 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">‚úï</button>
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
                                        <DollarSign className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> ‡¶∏‡¶∞‡ßç‡¶¨‡¶Æ‡ßã‡¶ü ‡¶Ü‡ßü
                                      </span>
                                      <span className="text-[9px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold shrink-0">‡¶Ø‡ßå‡¶•</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ‡ß≥{totalEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶ì ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞</div>
                                  </div>

                                  {/* Card 2: Cashout Ready Balance */}
                                  <div className="p-3.5 sm:p-4 bg-emerald-500/10 dark:bg-emerald-950/30 border-2 border-[#1DB954] rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-emerald-800 dark:text-[#1DB954] flex items-center gap-1.5 truncate">
                                        <Wallet className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> ‡¶ï‡ßç‡¶Ø‡¶æ‡¶∂‡¶Ü‡¶â‡¶ü ‡¶¨‡ßç‡¶Ø‡¶æ‡¶≤‡ßá‡¶®‡ßç‡¶∏
                                      </span>
                                      <span className="text-[9px] text-[#1DB954] bg-[#1DB954]/20 px-1.5 py-0.5 rounded font-black shrink-0">‡¶â‡¶á‡¶•‡¶°‡ßç‡¶∞ ‡¶∞‡ßá‡¶°‡¶ø</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-[#1DB954] tracking-tight">
                                      ‡ß≥{availableBalance.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold truncate">‡¶â‡¶á‡¶•‡¶°‡ßç‡¶∞ ‡¶ï‡¶∞‡¶æ‡¶∞ ‡¶ú‡¶®‡ßç‡¶Ø ‡¶™‡ßç‡¶∞‡¶∏‡ßç‡¶§‡ßÅ‡¶§</div>
                                  </div>

                                  {/* Card 3: Marketplace Earnings */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400 shrink-0" /> ‡ßß. ‡¶Æ‡¶æ‡¶∞‡ßç‡¶ï‡ßá‡¶ü‡¶™‡ßç‡¶≤‡ßá‡¶∏ ‡¶Ü‡ßü
                                      </span>
                                      <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">‡¶ó‡¶ø‡¶ó</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ‡ß≥{mktEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">‡¶ó‡¶ø‡¶ó ‡¶ì ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü</div>
                                  </div>

                                  {/* Card 4: Mentor & Courses Earnings */}
                                  <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 truncate">
                                        <GraduationCap className="w-3.5 h-3.5 text-teal-400 shrink-0" /> ‡ß®. ‡¶Æ‡ßá‡¶®‡ßç‡¶ü‡¶∞ ‡¶ì ‡¶ï‡ßã‡¶∞‡ßç‡¶∏
                                      </span>
                                      <span className="text-[9px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶´‡¶ø</span>
                                    </div>
                                    <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                      ‡ß≥{mntEarned.toLocaleString('bn-BD')}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-bold truncate">‡¶ï‡ßã‡¶∞‡ßç‡¶∏ ‡¶ì ‡¶∏‡ßç‡¶ü‡ßÅ‡¶°‡ßá‡¶®‡ßç‡¶ü ‡¶è‡¶®‡¶∞‡ßã‡¶≤‡¶Æ‡ßá‡¶®‡ßç‡¶ü</div>
                                  </div>
                                </div>

                                {/* UNIFIED SECTION: COMBINED COURSES & MARKETPLACE PROJECTS */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs font-bengali">
                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[#1DB954]" />
                                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                        ‡¶≤‡¶æ‡¶á‡¶≠ ‡¶ï‡¶æ‡¶ú ‡¶ì ‡¶Ü‡ßü‡ßá‡¶∞ ‡¶§‡¶æ‡¶≤‡¶ø‡¶ï‡¶æ ({courses.length + (marketplaceOrders.length || sellerGigs.length)})
                                      </h3>
                                    </div>
                                    <span className="text-[11px] font-black text-[#1DB954]">
                                      ‡¶Ø‡ßå‡¶• ‡¶Æ‡ßã‡¶ü: ‡ß≥{totalEarned.toLocaleString('bn-BD')}
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
                                                  üéì ‡¶ï‡ßã‡¶∞‡ßç‡¶∏
                                                </span>
                                              </div>
                                              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                                                {course.title}
                                              </h4>
                                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                                                {stCount} ‡¶ú‡¶® ‡¶õ‡¶æ‡¶§‡ßç‡¶∞ ‚Ä¢ ‡¶´‡¶ø: ‡ß≥{crsFee.toLocaleString('bn-BD')}
                                              </p>
                                            </div>
                                            <span
                                              className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                                                isCompleted
                                                  ? 'bg-emerald-500/15 text-[#1DB954] border border-[#1DB954]/30'
                                                  : 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                                              }`}
                                            >
                                              {isCompleted ? '‚úì ‡¶∏‡¶Æ‡ßç‡¶™‡¶®‡ßç‡¶®' : `${progressPct}% ‡¶™‡ßç‡¶∞‡ßã‡¶ó‡ßç‡¶∞‡ßá‡¶∏`}
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
                                              ‡ß≥{crsTotal.toLocaleString('bn-BD')}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {/* 2. MARKETPLACE PROJECTS & GIGS */}
                                    {(marketplaceOrders.length > 0 ? marketplaceOrders : sellerGigs).map((item: any, idx: number) => {
                                      const title = item.gigTitle || item.title || '‡¶ì‡¶Ø‡¶º‡ßá‡¶¨‡¶∏‡¶æ‡¶á‡¶ü ‡¶°‡¶ø‡¶ú‡¶æ‡¶á‡¶® ‡¶ì ‡¶ï‡¶æ‡¶∏‡ßç‡¶ü‡¶Æ ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü';
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
                                              ? 'border-l-4 border-l-[#1DB954] bg-emerald-500/5 dark:bg-emerald-950/20 border-slate-2xúÏ}}s«ôÁˇ˜)⁄⁄¨ ∆IêÑDqEÎ@í∞ÊãB@Rº^W< Ü¿¨23≈0™äs˚\)Ø∑÷—∫ Òù÷∑≤§rlEß‘9J’ñ˝UT˛õèp˝tOœÙÃtœt@â≤=eS¿`^˙ıy~œ¬ÍŒ[´-€ÈòN…ÌûYZYX(¸7§u¨¢Çˇà~iGcg‘7KïÖ‘ÍrﬂÊ+˛kÉìÁ*Ûã(“é≈Ö)¥Ó÷õ∑îØ~E„πGÛ?FMÀÎõ≥h›ËtMt5ç.˙Òº˙Î:ﬂ±n†vﬂp›c`Æù⁄Ôõ7ëÂô∑‰zÜ„°ªûµXjôﬁÅiQ◊ïOÈ¥3˘íÅ5,î4üí⁄ÿ∂9ÙLá¥Æ<WAÉV©¨˝x¸wd˘7åní«çK¯«;fyÊMØÙ˙π—Õ7–æ=ÙJ≠æ—~+∂æ Ù2ˇ‘∂í¯ìÀlΩ±e«=`Q|‡¯Îùﬂøˇ_O>@OÔ=|zÔÎß˜=Ωˇ˛”{∑üﬁ˜ÈΩ;OÔ}Næ>&_üËèœ<êˆ¥Õ„y”æ©∑ÃO∂õ.rt›?ÙÙŸúÁ"}–√ÀyŒxÿ∆?Ê–#vòŒé"çüÔ-kwxîËÔÎÂ2¨1ÆwïHÔË9XEt,Ï~<X™9zJ	Y∞l˛¯ÙﬁíEÚÄúº≥äé⁄}o2hﬁ-ÙÌØ˛˙õ#≤fÎ˝—i“˝Dv≤fª¬·?zo¸≈ÿ∂/Ìè˚}ÔóbõﬂÌ9÷≠“˙—ëˆ»[ÓÜ=¿€ﬁ3;96¸Ã¯∫%s`:FøCIO≈oÂﬂî7◊œUñﬂàô‡¸¸í6õÖcïºëßu§L÷Ù_©√?·–]˙G‹¯√h~˚…áx3|JV?ﬁﬂ<Ω˜%GI?-‡˛ø˘££ëcw”uØ¥Ω[K6\Ûâf[ı	™ø4ÂÑ+~kQÀp∞úP‡%ÌMOTπo\Vyx˘K¿ãJVeôd5ø¢À˜‘§]ô%˘‹É“""„¢!;süÈq!B0Ï¶≥ﬂ∑J=´”1áy§‹ê€î'g=⁄ñH√~_¯∏'i($vyAw“√ı˚∏GË¿ÍxΩ‰÷y›“Ï¸≥A‚“ O˚e¯‘+—˛ÂôÚÚ;MÅ)$◊⁄ãÚÈ˝?ÑàÃyˆñ›6˙f√√∞[,¥Ü•ıÕ¬Ã3¢É«r˘Ãﬂ)]xK©ìäoV∫L·"‹¶‘ﬂâ÷X]GK´ËzΩyysØz=ìçåC{Ï5∆≠¶—Bkkk®p`yΩéc–È”®ò’Ï%≈s›6KáXO7Ü÷ ∂–æ—1Î*¥1˛(L¢®å•≈Á"HÜBê∆•õ}4*U`ﬂåJgk*>—3:òäª•Õ¢œ,˝µT<jïñ˜Ì˘ﬁRÇ4`z¿HCÀpMmjR˛z~√1;ñ∑a8ù({≠`ˆ]O©”zB_yzÔ"≥=ö?…Ï´ß˜ﬁyzÔ=¨  ÚÓ>#Rﬁ˚D≤ªC.Çõ˛ ﬂÔ=‘°HX›[Rº2ç•ÑJh°Ÿ!.ﬁ/ƒ≈˚[óÀ˙ 3DFÁ¡”{O®Ó«ç¢Ø"bHx7R≈QRQu˜¸æÌê=ƒ§i`ykG=cÿÈõÜ€£Ù
üº%§<™;GBπ4V{ﬂhô˝…Í€lìa˛N:∑ÌVj˛¢õÛœ}ç#òI≤'»©€¡ﬁ&Kˇm<≠´™Ωô'›QÓ|l¯∫é’Aß‘∂˚.V0	
ø.SB¬ÜF£∑GØÎËC»ÍÄp˚*^%ÖYD:Ñø3¬AπØ/V€Æ¢ÛçÅ·x£û=4£‰jì´Â@ÒBÖnÕÍ∑c«ËùH;Œ˚ËÈΩ{aÆ},§À€˜Z4Ω»ÎÊ¬∞ˇ`åéÂıÎ∆≠ÿÑƒÊ◊∏!à—üG˝yB®4®‰a◊«VøÉ–≈Ïv*7ÛçπÅ1*–⁄+ô"úoç=œ÷≥>yá# ‰∆SZwæeÆÊ,M3ú=‹Ë[Ì∑÷éä3–?◊Ù|™πmz=ªSÑ'"√≈⁄°¶,1£>∆¯”ÕÄ;qTœ1ÜÆÂYˆP X0âó3P{Ï∏∂SŸ9©mpkÛ˝$“,ÙU[ç)Ãàìê‚º7îıÕmTg÷ﬂ∏ò[Y‡Ÿ∆Y€XZ8üñÆUNOøÑÂåwµ¶
I§|+!&∑Úhît˚©ﬂ3£º34‘O_-G˘ÎŸ@K⁄¸ıºû¶-xt}ˇ›”{ø·8Â·ÔÒÚÍ"ΩO∏¸#UqG[‡¡7X√—ÿ”h9•¸–∫Ôò?[éñ√`Ñï;≥á'¿t÷N-î1±†áŒko˝1¶Î>	≠∂€`⁄Z¶£≥[1Û¡íz?©h∆ÿO‰ôEsŒ3úÆÈÕëk1¢à@4# å“©©»h∞$§òg9£fldyÏ°ù°>´è∂∫‚´Â¯NÏÊø<Ωˇ[¢œÄGÜäÇtè„Oÿ›¡P Ê¬˙7™ÁMæ◊¡˝;›ùéü¯ÌÛv˜v˜ÁDü˚Ü≈®¸*>Ωˇßôì∑oáÑÛŒX√µ£ ¬ÇŒ¢7◊éåÜÖ«°oÆ}cÿ÷⁄ó±ÕM\9”⁄◊‰aE1?…[;nç–”ﬂ’â_Éû≤fœ—Îe, Õ¢
˘üÒ?ÒBÌEc‡Õ"´ssF◊∞ëœ¥·õ(uΩ˘ç")ˆy‚A–¥kD÷#¨>jËÅø5bà.Q £=#—ŸÈs¯ 6°ß IÃ(zïœÒ+˜˙"¯ïU‚ã&≈m„Ê	-(Ë˙áuusÌ\”=|å ¸§^m∆ù√ÿŒÂ_#ÒüW˛˚[4OƒpŒÔ`¶~Ô_ûﬁ˚òÈøß∂ueØÎh–„Ôy§ÚòÄ˝	Ûù‡øøJÛ5>ÚΩ
xLÓﬂ°q∑TçôõõS{î_Ôÿû∑O·’†¸¬˜ÛΩo∫S¡Yı$Ê8πA€v|k6ƒ»©[‚4Ÿ/]Á.ÒÉ™Øµ(õ;lŒü’êßÒlÓú±¥lD‡qI
O7èæ5|êa¸g±¸Q{øj74±ÃÜ¿k¥oı˚·∫’àDcÙ©u÷~MàÏCrQ‘S´g◊÷„õ åÌ¸<¯›O^P”Ú*∫\o4w˜^CEànBÀhcw˚Ju£	ˇÆ◊wjõ®—¨‚o’ΩÕ™Ól¢ãı≠fmØ1ì'™gπûÌNUâ≈@˘{«vçæ•@†Îï‘^™D˘Í9ÍóPøÀ}≠PøÇÉÊB≥PymW˜^≠5ØlU7j®V›€©Ô\Rkm≤Ω¯ıs~Ã÷2özLÿ"-æ å|)ÀL⁄°`ÍÏ@Ù)eﬁA9ÂÕë7sæ—≥G#¨¨›(MÖ	ÍëøÒ\Åàw^%o	%ΩØu§[*â–:ƒ¸ÚIÒå/q∫X8AO_!!ò∏§g¶Æxƒizøƒ¸	Ãi˘S¯"<ß%œÍˆ<ı02¨+ﬁÚjÜ34;ì≈	O⁄Ûå†mn•ÉŸáà-ºG GÉß`j0LU)2 êãò@÷v0/Cß1Yø∫◊¯ÅH~gà‰%«Ëåê{7‚ÅU12ÈôF_L$π‰<Í˝˙˘•O;U”;ßLÉ„5E>Á†çën–ò‹oæÎÑr¯¬  <¯mñ.:h? .»Gæõ6∫\èìj.≠‚ówØ6—^≠∫˘ZØnUw∞Ä9íã√f¥ìùÅ• ﬁj1ˆÇÀp∞GmãaGßK/E∞1B…€E(•TÁCMsÎÛ9—M.[ó3¥ $EÂå$√¶|DzÚÈâ"ò\êd~˜'ú:…ˆBTv`gÂÙ3ûÖ¬Ï<,úÂ∂"ˇ»À°îÍﬁ%T˜Óqí“ÂU‘∏∫±Qk4.^›bTµ·V∂™ç&;óm;‰ÚËIëG7zf˚≠Ài˜Õ≈|TñÜ‰ÀìÆûMe{åÑK%9∫∫î™<∫G∆h‰ÿ7ÃŒb@tÁ˙Ê∞Îın¡˝õpÏéaà^@9ÿ≥=£_FÃza‰a≈>·0Ô∫Äﬁ$”ˇàE&˚>’UäÒóŒed[£bÙÚëq8¿tÅ&9‹öyëÏö ÓÍ+"òﬂ'üÔ∆≥˘}Û«…{*´ËJmg≥æs	ãÒ?πZk4_(£j€˝lSj9æ©∆…}œ∏	]Hc;Ñí£€·•¢wYö„Ø”¸kœá—DŸ=Á[JÇÍöJ>Á4óOi˜OáÁmé‡öX˘sÛ‹∑˙xΩG«0ös=√ª‘w≈B`afŒ1;„∂Y,Ìˆ,ëê¸Ωåo†dt-Ãúæ,é˘·˙Ä”ìp˝åK(ÔmØ≥{x©ëË|›QaÔœA Ô±0≈Àî\•‘›ãN£F≠∫∑q≠W˜r9Hè	wbôr™J¿Tñ¶Å;¿UãùUÚŸ±‡s*Ö∫Oóé,xúØ6ÿ _©om©≤l~«¯KÄ¶t≥då=πm«Ó˜[ÜSBÇvÇõ©Ôır?wπ⁄ÔGRóü	Ó#¢ò?∆åß†ìÕûÈæ‹É)ôXrÀÛ
∂Àπ7|'$d$yøg˛ìŸˆb=∏MÉøª"((ga”òÂñ7‘V÷T&A ¯=öô‘…8cJhÑ∞^§ƒñ>6O:uìp	Ñb¬‚¬ ™XjtÄïúpîË	a¥7öÅ√)È“KfŒDi>M:ƒñÀsùÑxãù?{Bah≤≥Fú≥^µjµNî$0ãÌ˙™nÔ^›iÜ¨∏æsÂ™≤öß 3Ù—DŒcq	S0›»\∫W∂≠°n.ç(:˜JÙaìÁ“D‚≈∫ŸL ˛+Íê«÷ièMÙÁg·ÒXÇÖ˝± Ì¸<Ω<˜Û!Âø‚˛üûﬁø?˚Ù˛=˙ﬂÀSyn`¸ƒi>ª¬=˚ì=Îúd€h%*ÚÀ“1Ò ∞nPx1ä\pPZ^—
=3ß›K5$Ñ&<£Â⁄˝1Ê>}sﬂPƒ]≠ﬂgìÀ;†âºoìx$àÜ,ãÍi>t0£ïd#ft<26ù√ISØƒ8Âåﬂ~iç*yõn˛Å~
T/’3 ≤®Ífu}+w,E4`U˝ì5‚."≠.`—SUoöj|iØ¨ï@-◊A ªádH†∞rVÕ{ƒ—˚>µ—ˇÅa∏—ê/#˚nÙYWi·Ô2ÂÎ/‰∑'î	‚ORÙC‰ﬂ_êîv}u+¶7È)&b-ãh‰äÿ≠â'Ö¬÷BﬁG‰≠†◊-dÅı>}b@ºúæ5‘ Kz©¸ÇUòﬂ©Q>öørl™äëú¡Íb^í3@È–¢W‹ã“±í#€3çé^Ôyœâ35°gE4Ã7hèG#”iáÄ≤:&8ÆGæ—ÇÙ≥SØ‘7œœ{Ω)=å√ØŸB˝∑©>9Çº˘a{j™ØÚSmÁYNÓ§Gˇ1µw–πu®œF§5Mı=î”FBK^FiÀì„ÍYoË+íiß˚*|á£á8ßΩwœ{-ªs»w”'´Ée‰àITë≥+Q§z≠Œ%d,Ç%1
ë$¥qÌ°Î!Àı“hM‚é“„∆‹s´ìxh``Gø¸e¸}¯˙ú/≥GÊÍË ≠◊`<–+kH"íñ–"§J~}-˛ùNm8”;CM 80–æ«∑ìè¥ÒFÈ¡õ≥9ªué¢9pk'◊›Ã&∫ﬁ+°8‚èg:$=ÈäãZÜ√üÚ’‘ÅcbñÊäÿ eR*π^ìßÜá.πÖ„º…®Å#SàêWè.'L5≈˘ªå˝DYß˙‹–>påi‡7ôÆgv™ﬁq5H0'hLÆEîDâ‘%âEÖ˘q"íõÑ3Uƒ1"®è3˘j¬ë∆œ¯ j§ÅT¬˜ƒíq≥tPzÀ∏XjÕ9ÿx,Ü6û<ÃI
⁄ê˘ö 8~œß=bD˛kè\úÁ`jÎ‚yXŒt*«¯úˆ¿¯Fü„⁄ó¥¿çÒ*+òÀ…"ë/ÂºYT^n1^"/øé7)O2q÷º0ˆ,jØÃœ©ôøŸ±]3ÚRv"ﬂÉ1wŒ∑ºH;"Ô^»
·Üú\,è˝X‰„<;R7Ñ2zÁ±êπƒfFÃÈîwWÀ|X÷ê0Æ“òwræ%èu5zÑ∂V3ó¶∆&^ˆËäcèå.…`.jöK£ákzªXyÚm∞Êp\ÔÌÿ	¢ûÅààÏH‰*˘6¡{sîúc©é∏ •ımI¨‡è˚ÄÌ¢;-˘4£d—¬
|PøÀàú<(≥∫B{„kA.ÊRy°Çå6¨jˇƒπJ~^«‰é8’//àt∑(/êÜ_Oì1¿Fí≈E‚ì$ëF*í≠ÇŸV3f)z‰´¸G^äáiﬁ∂Ìò◊L«≥™†siπÍcè<yô≠úB) A•4,_°Ovƒ…ºÄTÁß{QÚDOŒZZ@ø [ûö)Âÿƒêˇ(µÛ	‰‹¥∞H‹¡√,vÏ¿1≠0''tÆa⁄≈‰q2˙Öxkê!Ø•ï›Qì¿õB4	=„·3º-ˇ÷õdÛQy2êÛØh8ŒO“ÚÄx ÅèΩ[ñ‘LîF§Â-	—u£äDn˘çÎä(◊	îÇ<˜]s‚∆ΩÀ« ¢	n≥ﬂ∞zá˜üﬁˇÕËàdx‰ó‹#ÔœSs7Òê	E_vLn >D¢+àß…√‹√kÀÛ˜†ô¿,'«øÍW1f#$∂-Z)oÜÖØC˜®E±≥-NÎMuóÔ®›1˙0oEœõSx≈∫;í!≤`fŒjˇµ”8yπsQÅ≥¡?ãÖÎ
GNNüâJ¨·À4ŸO¨Ñ‰◊}Ë1¢àóA€ä	î± Q÷Ô©RaN'ÃÁ*}Ixt·sæß‘÷⁄G≈∂=‹∑úAÒM¬?ßAptÆæ°È¯ôÜkä{ı(-
/¬gÉ¸ àÖ ÄÅπK√˚>¶nÑoŒÃLe$…XVch:≈ëcﬁ )°oò);ï·•o$Fü
”iúﬁ"Ñß√ÒänÚæŒ5>«”{_˙(ÃdƒÙ5≠DEÛÀ?ª´Ä(>&Á)'ö-3y‘CN-ÛL…∑•«òR`r/WN4üi:XhJ”a]ô*üÆ‘«jŒO‘cù¯M…˚_pùîÛ«ME+ï„?¡Çù‚Â¸Ti>™BJ aâ˜˝Ù˛'ú˝n!G≈Wa3ß¢µNf»£«qkÀ≠ ,Ãˆ»h[ﬁ!ê^ü™mØdÙ˚ˆÅŸA4Õãd€OJe9gäòË/A~˛ãDbtòπ¿ò5˛¿∂‰®6«•Yâ‰ÇáÂ”	¬r"Ô¯a7ú‰› Køœ":*'tOåí“Cã¿=≈°£b®sC€}‘7çé>úí¸`‹ı6]>ÒH#öƒ9„πƒÙŸW§ÇG|¡ÌÓíï¯GÚƒè`”p˚gw'ûçl5Ò&íHÛk[-ßúÔÕ˝Œ|ë9∫yph™—∑¥F7“(4r∑ÊIÚ÷q‰¢)•“jaM|Qjõ“6ät“nÕ»|œ“Êƒk>%.åù€Â∑ÇΩ3r]Tuúˇ1Zø˙Zm/RäËZΩv}˚´ﬂ°Ì›Õ⁄ﬁ∫XøV€€CõµF˝“˙Ò|¯FII'‚≈æ¨Î;ô√nﬂr{Ë%√Â!ä∂≈}$à)µF£∂s	∑ï¥ØÿhVw6´[ª;54èj€ÎµÕÕ⁄&™Ô†ıΩ›Îçi|ò˘àÚ%¨¶Î‚∆òé†à’‰ògÛÁdZ/Ó2è|∆>Ø ≈≤gu:Êê´áÔ¿¯‚?IΩ˜¸6~ìÈºÑm÷≠kñyêX\ñ[¥L¸ÏŒ⁄xÅí+”ZûeÙ7psª∂s∏vå<öqúº3l”}.òø7P¡r?3◊Ù∂ÔﬁË€Æ…¡PUππ.∫V◊MÜV«∂rbãE˜ Egm‚Ew	5jÕ˙Ó*^ÆÌÌ¢ó—^mcw{ªÜó$ún‡3W˘FmÔZ}£_W◊õ’ı∆*°›ù≠◊`•Úõé[µÒE[LÆZ“M&y&ûªík:7¨∂)ª™mcY^˙Î?Ÿ-<XŸB≤·S65∆Îµ-<^∏€’çW—U<Làå„zug.≤rnç˙? nµ¡Ppkõ"∞uYª ˘6 -÷î>ﬂ+ã2 ™ß; §@Íã§ıÍa@ßòπ‡ã4∂û
ı◊Õ~€ò$ÓgV.∆KpXÉ:ﬁbŒuTƒöùÉuØösC|g∏.|ﬂtp∂∞›q—´∆/,‘∞{F∑0#·xséI(Qq˛›ˇc±xaA Ë$_'≤DhÂ«G¯éô,}˛±nfækÕ¢Ç÷?b/¸öHÍ∑˝¡pÚ<∏·ç1Qˆ‡3úXöNˆ3<«àE 6è
Hò#û“,`˜ÿ*ç¨g…*(∆∆E‘Ÿ ;?ﬂ+¢	IY Îª!qƒ∫JÈ&-ÕXº≤€h•¸{LN1¨◊.©¨mmÅL"‡‡˛Î≤™5RC‘lîÇx
NÒµI√™±¶w´kI<¶âgÖzdÂH+ÖCùƒL¨ªWl◊ª‚ÿ —ÀçQD3ÒΩÑRP œQ(›¸f,U¸æ KŒƒRÊcëetôø+^)à˜z≈ìywqsG"SèxÕ´bË¨aÈ •ËA¸9•≥®áˇ' ^+Oˇ√G´Û%n ï`¢∏∫7âä
Ï>Ã%ÖR<ä=µ˘%lS,'Á±åg6qD•Å):]u=¯êb¿JU∏‚#Áè¥èÇñ÷ºﬁR€V/◊1&EJ‘|Nå5O¯FA5DL˛ñRZöƒ?ÚùZr∏´ÂN≥RÕé5D⁄xõ∫ÖÕCöéÒá  Ä¢=H±•ÃP⁄O©¡2Ïç^"≥Ω™ÁÂhe›d–S©é.”˙ì¶w≤¸	˛2Û{.¯ j·_‚	Îã+}Q^>â◊Œä$˙M≤C—ÅwH)n2©åœÂË<Oî"H∏¸‹¶å\ÎûxA…ñ˜%”CÆg8û)NMsÈÀa‚¯B•úƒÇäçÎıÊ∆e‘‹eßK®AË—E<¥Ë4∫fµpzh√Ó€Œ,∫N∫K(-ﬁıÈ»≤≠Ñ˜òñ0ã ∆'Ä˜≤-ÅØnåÃ∂eÙ-◊€6¨!—•°ù!˝V“Î®û~9AŒædu”£¨!^Ts˙ºiè ºr-Ã¢ñŸ3nX∂≥ä
Ó¿∂Ω^›í<F≤€øõbUòÎï§·oﬂ	±äKâ≈*.#.QQÂYãUˇØx+ë®Ì¥˙}.„‰À[ÈIárô+¢ˆ”RøX˚Ù˘
YO∏¢Ï_Rp?4’á9{á∫ ˘à≥Ôë»•¡V&b,⁄¨EèπLâΩL N2T_úÙyµfbZ÷u∆¡î©‰Ÿ%Ì;ˆÄ/3ds€éR*Óädpàó~z3w!w6∏2 >ÙÕõi“#!”Òsc)ÿz Ÿ®oàöè≥¡8ÛàÉ¬=+æò‘äÒΩÂU¥^m‘6˛|˝rµâ^€Ωä∂Îó.7—zmÌÓæ
ÊÔãª{®xπæπY€Å∑w◊Î[5tÂÚÓN≠°b˜›HÉŒ*dÃˆBk¯bíÃKêÌE‡œ¢A[7\≥≤ÌAœ–°=∆åà~kﬁ∂6r¸¸$&¯ã¢°N7˛ïQøª~≠Q„åé	píe±l>Wë_ˆ£auÃñ·†¶—u”DsÆ]∏a›ª¥¨`Ròo‚Í{ãXäÿ∑d°0“Í>G˚ò†Ωjö#dﬁaïÑV«ÒwpAS^'∏øa5G€òuàz"£œŸ7˙néçÆ	˘x9ût›lamk€nY}UG£è®÷—^¥-€ss‹Ωewm‹ÇKò¨ı¨6⁄4]´;L>G¯Z˜ßË›aRÛùï∂D ÒC‰a	Kê+Ñ[EB/Åª0∂tf(ø±†Ÿ’©!-&EÏ∆TÈî>S?Å1ÏÛ‘Ò&¬#ôÎöÀ/7ß(¬Ù≥‘<{∫¿—˙íˆ;Â&¸ëYËG‡
JO√_E\†El÷H∂◊ÅÈl`*^úô≥ÜÌ˛∏c∫EÓÚË%2ÿq∑øêzIÆô_RJê¢†P/’Ãh}»I∏·ÿ√=¬*
#Ã=ìÆ¶e´à+Ë§õºh{{ƒ‚4⁄0úéã.„Õˇ<Uòt_é¨œ$óQ¬è¶Ó+ñ`¬ØKËfü˚∫å#µá,A 9˝Io-ÓÑ;Áb˙g±êø<C(/÷)RI.æ	:ûNsÒCRÅbÒÔ‰¢©ÊòñÉõJpπÀØ`q≥Y¨πy∆oàN^∫Ü¨q_‰w∏∆“⁄z«];‚æ»ÔÏn∑o^4n‡ıÊa˝.øØÉ˚Íôó`¿Éè≤´%€Ioª‰T	Ò¶™_jPM†˙⁄™ø**8"yÒaf[Ê∞ãukëÄ/≤Õ≈œ’ƒQ)"5!¥ëH6”ÔN¶> îLj˝ÚM˝†ë{4€œ˛úØÚAjá8ÌèàÕÊ#∆˝k|ãp.AÂúO∞íŒ|ï»3z$MVe©7&∆)À
 [($Ä ∆6^∑AF0ÿµ˛ÕØ∞ÙÌ;ˇ*+këÓà¨∞çtr—Îñ'£˛Q⁄üIÔ3®Ω≠œ¢Ù t^ã Á£ÒrÀï&}◊•Ó˘hª:e“uUœIªóV—µ⁄^˝bΩ∂ˇÃ¶ﬂAÈ„1p∑à÷bûZH±oVÎOëYòCqAÖÛrc∂8X1Õ§VW	¢+,¨å$ ú„Ò5—ëZZ‡LÆú?4∫F¿â•˛ë+Õ⁄éÂ°k¶cÌ[f]qlâmQ.ıãx*W^¶ù±‘•h≠˘Åπ¿1dõ∆W“¯è?>Ω˜ü‰‰ß| »©ØC}L≥üæ°±#"°∑É‹ÚD∆ Öò®{(?ObÑ9o¥üVÊz∑‰óÙÚ#”‰NñU%
¿°˝Fp÷
˛xg¸Ñ¿å±˘î|˙íπû>$çK/•È÷Ôb»”œÓJ<RŒ≥í#Dé9ÇÂ|CÒw_¶ò¢°•@~óäëc˛ µåN◊l›µS>¿Ñ}˚Âøà˝S«&\]/Ar	⁄©^´_"(ƒi¥qµ—‹›fAÃtöD__´°›ΩÕ⁄ûäX"œZ‡¢Nb%· ëwQ"˜iêÍò¿s=ºÌÜvâ∫_[ÜHˇîì—¸DTVhû
Àæ8∞ò0ß™lnOâ≠Xí˚#Yé)EÊ3+ÀS–fôì*MoI›vE∆,2´ävÃ.yœÜ·}ªãäQ2LI›J°SPèÛØßx∂’ãΩ¥‚Ω˘^Ø≤øﬁ˘‡ˇ0πæ⁄5áÌC‘Ø96FœxΩ±ºΩ{ù±^|œ◊◊?¨Ø∂—1áhÉ^_˛=„ÂE?_ËµE∫Ω^Xc◊≥œ4ñÿ–∫cô˚ÆŒÚ·%qûˇ$äÏ‡∞Dz´†Õû®µ&Zma_§*”$ãÓ$,;ôª[¨˙o":€TJR∆Eu“sr¢ñfH,Åí§ê¿∑ﬁD’Kµùç◊B-Vü≤¡"πıÚ"ô·u>:ô›55¿O%YNÃ/1ç“∞^ñÚç{ƒÍˆV?˝+îˇ1ı˜ΩÀC“ ¨ë)÷‘∏u9jÁçÊZ&ÇNƒ–ìQSp ‚ƒ
iá≈I#ˇHL]‘ByW‹çîL~ô'RhfÕl?≈B†–`&_ˇù∂õ¨˙ò3ªB√ø"wP<‡è+µ˝´Ë˝$Ë!ÿJﬂ#ËîÔìß<dc‚[g?dX¡_∞—ÄIûPáÔ∞K¬Qıü˙êª€‰tåMÔ•m}œ∑iKÏ≤FïÃ”òU1‚ö\B2ìa®5ÄÅæ»,ÑR»@bÑ;•¶AE√-‹åIRªG4ÁUƒ¡«@Xœò›π}kÿëcÕ'ò)	ÅÙ€0›9ÇÊç/¸(y«<MnΩ¥:´Ïµ≤pL∞ZB∂@_ H∏A∫B÷-;4é”ß\ª˚˚âM≠™›]Ωax$Ù<o‰ÆŒœc–≈ì?∫xî›ﬁ\€Ãèz∂gó ï•Â ‚ ŸÂÚŸ≥ïReÈ‹πe„Ãπéa∂.ÄImíäÔÙæÂ≠µ{t˙`Û”?_[Y»l≈ñy√Ï„F4Ì⁄√‘†£—2M´‹î…/m˚PA˛’Ï´¸ÜéÈ∂k"ôê’Õ,L<9Ôˆl«„~Hioo<h´œ⁄Ãæ‰ïiX>{¶≤r∂|Æ‘1[ïr˘ÃπÚô3≤9X…û«Ä0hø9Ù¥•2∑êrèy√2‹¿]awrß‡˛Â˘Ì#jòw˝[Ÿ◊Ù}¶l◊jØÜ¡ÀÎ˘V˛¬,9òr≠¢Ú>f¡HéÖ#Áp”8ƒ/Zö%çvÒ‰‡oÖ%|˘æixc'h˚
≠xΩ LZè{Ÿ
o»C¨·`Å\õ˛©d≥EÕÆDõ]ôN≥gΩ˘¬ó˜≥∫·ªO∏^\°gíùX™:q6⁄â´√æ5¿‚YÁx:3K°©·wäç@yÚË•¥ì)˝˜å.nﬁÎFì‡î‹‚OJÚF
°#UZqÁ©»^ÄJ=Ñø…RäY»!w|ﬁπ»S)*O¡BäZÄSóe14:Q<|ê«WWBMh¬d‚ “Q9m8(K€√í0üy⁄KKÚÆ§Õü∑]‰:m_4ÿŒ-dÙ=v¯Á-Aˆ_è˛c∑ ´è›ñpùíjå:cá$eÇéü
ú–ÉÇ“ÖP£o…/`∏…<îŸ+íZQ$—èÊ2íÂëä»õ¢˜=aÍ¡◊Ú•Œß'?rò9P7Ì7V!⁄3)ΩÁ◊Ç¥ÚDÁLıOñ¯@Í1„[rU=l^\‡í∑Tûﬂ,É‰K{y1…¶ﬁò	+ñh`E.¿Ã≠ûë4ÉËLp˘-5◊6oLÃ∂∞eÄOß’ñàñC	WC»D˜ìJ`@ ?d ﬂä√€3nî'ãbÅŒ¯¨∆À_$∆Y‰l@_(√øØP…WƒhÛàVµ~Ë©≥…j·æM ã¿°1“›FÑ;ÄIùByLô¯á‰lNf/›®n÷∂_CªW˜™ˆ“ eÙ;©™ù4Ù	±õäË48Òa,R≈I£ïŸôÅÏ6'®?·3 &≥ü  åWbÿRr˚Èc¶g|I¨ä°ŸÔct:f0Ω√7ø	Äœ÷x*¥@“πxL≠—4ÂƒØü+º∆ù}D“QÓBØøÎ«HÜ˘+íÈeî¥¶ú˙=˛ÙÉıﬂ˝»◊È»ë/`±®Àle˛n`m«Õg≈7NjÖÏÊ¿câ	Ÿ‚øq?hrﬂqMS\ë#Á^(=éC˜‚ÿUED°sÈrdH˙`b¶,,S?kÅ›§@kú…i|PÁL@ÂÈ-ü∆ôó!ŸüìØÚJX™.≥g®"¶4àÔrﬁÕG´¥ë÷–ıúq€≥•!€*¢X`ZBb>ù∂á}YÍ√èŸÚt]{HçÁ∑P‡VæÌ3o¬03”Ò…œﬂ~ˇÎ…Ù©lÁf(^ﬂm›âSfb[Qi-ó÷§∑˘≤víÂ^tLìR£Å>AZ05zìî9.íŸµ\Ç{î3∞D¿…˚≤0#≠Å,ÖÜ8â ]£z≠∂IÛÕÁ—≈Íµ›Ωz+w¥¬ ı›ΩW$è`k˜“%Z\Â4∫eH…Üˆî@$I?£Â*( I`]◊Q
y-0Æ!éZ•Ú"§îó˝¸Å§é}›4›∑0´ƒ›2úÆâm§ôÀ¶B◊iÙì1—~ìÉeUuX-∞3	Üf¡ˇ|⁄Ê‘d¡ 'M5á3If•…õQIßºÄÂúrT˙å◊*fﬂ±ò1œ$VÎ7÷1r:ﬁ/z3¡`…DÁî©”xZùl
€*F3hM§m˘Kæ9Âî]`<òQãa*°pF·PÂÒ1ãó" Ê≈ k*5OÆAO¢CK;w¿·Ø	ë¶˙œA í ƒÅ^˛öäòÖ‡1TÇËÒœüﬂ0∫ˇ©‡…àË§z N´„ä˜bJ»m6Úß®‰DÉ≠ÖÜÈA`Ç´]x"Ñ“‚ï±|ßÿR∞˚cÁœf«∑(Êä°æ2bubã[°°Ô6˙ƒªr–Hßò%”YqO…ŒfÆ3?,é
`ä7Dö·,#ˇVxR¿l˝`=Ò4jÿòoÙ¨ëã˘Ô∫·ÿÎQ1†M‰j-Áò0Q§L˘ï$ÛLÆ1˙˝ÇèJFjÓ–ãDÂ¨H2w§tõf>˙‡Xl:…Öù∆ÂïiK"[3H¥§U|Û-Â¸Æ,
D‹˚ñbö}¬8ÖoeØ˙TM‰(eÌIR ÑçÁÀAƒ1(H√Y·¶(9„Ä+‰@…tbºI‰/§∫w#›§AÌ†‘¸Ãp€ƒ`Û◊;ˇ˙ˇ(3|HrˆaËÇn$Ω‚¯ÿ≠ˇLm<î@}ì˘ Gn˛ˆÀâ#6<‚	1˝ıŒÔ>c °°¶\jJõt	É;Jß4,áVl2hz*¬â®=ÜúZNPé‡÷i.Ñhß>ÑRZ<…F˝9ØStCÖfœË0ÜwOg£ÊÀèW—©D◊o…†ÿµ«5¨à∂hòR9§¡o·"#ê©5=íÀ¨H∂QÊMJ8∞ŸÓûõƒlWÅáA	
>‰«?yƒ•©‹ô\–J,ê±`"(÷fq€ZÉÒ -˙¿úÓ≤TåºC‘ã‰≠∏*à^AògÀHY+1üü"∆ä£õkÂ˜
TEâÛÿº‡,ì¡≠D+eó&p€ ∏≠|Êxl{ÑV±zÅEt`‹, Á01û9wUyg¿êóh≥∫!/≥nkôû≈O√†∑Ç†¸Oÿ*`˜ÆÁÿoô•r[û§Ñ∞¨E2Ø!À?pO'3˜•BüÊøª\ŒﬁmZ∆5p<† \°Öêf‰Ω+≥¸I\ã:o≤Ú:tŸBMeq∞2@‡Ÿøiä!È8(‡–¡†	ä4«í‘ÉHˇø‡ øáıâ¿˙˜.b tèò≈Ù€ˇu˜øû|0‰§ﬁ¶√«˚a»#è-í¯Õ)K?ˇ#bú|˙Ÿ›)ÿ'üùÃ(¬_RHø`2c±PïKã
5‹nñŒ0®ˇHT;_áú±¥l$›≈’l¿2#50Ü5÷ê8˚e^bœçY7∫RÎ!%!Yñ√Ï$5±K7≠r5%sbå3+¯/∑_càfõ’∆Âı](«HÄ–äæÀr˜jìx3Æ "ñò=ÀË≥uás†9R∞H Ò≤í¬ﬂË	Üøπæ˝>èl◊+çh·QÚ}‹¬;•dÔÔ≥[M◊≈Ú∂Èﬁã)û”b™|)Ö#)Ü¨¯R»‚Ù≠ëKÃìB*QølB$¡ÉDZÖˇ≈Õ
Ag£‹Ã®ﬁ§¨‚;ô-çíu#TÂøa÷p(ﬁ"Pò	¡C∞ﬂƒFrâd!ÚÚàd
V'˛X¨M	LÇ0m"ÒN@)“Bá°\¸cB(ﬁ•‹ı¬vøb^∑g¿bóò"x[‹+7ï€çæ!'+¸orÛ'¡˚i‘Ùå˜>Q{g!v3Lê¡o©µ”#ªk—û˘Û±ÂòùÅΩR,xMCËä…X˛F≈L ﬂ¬•í<oá˝ÇœˇÉ˙d≈Äº≥Òµ3ã¢Cˇ	çoˇÇF® ≈~EÿÕo√•¿…Küq◊›cf
+À‚ßC≠∑8«# ¿BŸ,2Uøo‡˘$˜,àΩ˜#≈∞0mzYÿÜ€å#>‹p¯¬ˇ…E•âmëMâÇ»∆¶ë;L'èIìIœô√ÍÿÎ'q:Dò∞Æ!ë√ñ$R#ÂgEÛÀaòtJÂ0¡Ë,fWJ9ÑEÁëÕòdYì_ﬁèOx'Ø TA&{•H^™‡pbô^K¢◊ìÁÖ“|∆¢™ãÍŸEƒÃ»xyÚ±ZÖ›Â+8◊JTœR°˛Qü$RZñ{ë-¢|±Ü°¨Ó£C
Y1-|1≈Ùl)›Í¨ù
UrÒ˚ CX;Œ1A¥ÅF≥æÒÍk®π{]ÆUÒ £”Ëb}´â?lÏÓ4´ı¸©∏Ykº
óÏÓlΩÜJ¨úËU»ÍªXˇ)ûåm|!˛≥˜j≠ye´∫QÛñ´‘®á) !IQX@ø¿;AZ›¢Öâ{«¡◊µ˙cÑÃ©Hpßè˜∑ƒï∫,a…Öò]·√
º>îâÎÅ|:^¯¥H
<,¯ÿÅ‰“ªrƒ.ëÎƒà’ëzŒô8AbMkõıçjèÂ∆V≠∫É÷ØæF&£—º∫Y€iÚ⁄j8W¢äiÒÒÕ™!|qö‘±ØÑùêqy±Ê ©†Pqñ˚M.‚·§S>ÉW“≈u¥Uo÷p/_√ÍzΩym◊ˆ»ˆ∆Àè'W+<úõ˘åÇ%¨©Ï»>XEMH£@/.˚>î=ç∂Õ·≠¬&+Â:AXPZu’ø&{ZÜCBE¶∂hû√!S‚d≠¿⁄µ¸O<v^j~–˘-„–{õÜ€kŸÄÃìœÜEïûæû ¡èv.◊{/ÉÔ)=ÎÃåˇ§‹àƒ˙¥≤Ö‰µX8Ω8£	<ÅYØ˘4ÃPñXi¨~[6ú›‘4’⁄¯1ßπ›®˚ôF9•Úkb‚øù°ªNöØ6!!êπ,¸.eﬂdVq–Cc\ÎXûO{ï¢ãÈ±läcãr˝YâÖ3&◊gFgíH]YùJ`Gkß8#—oπ|««Ú[Sil™ TÎÂ¨S9"tp…±.Z®õC°NùkΩ∞Pª3¸at"±	´Yì>ÅÆ∆çõˇ °ÚÌúsNƒò‰ú+N±Ï˜\πä p]ƒz¬˙ÓÓ´TyØDÙNË[Øäe\ÚxmyãÜzÑ a-aÅÖá*∑o/à•ÜK)!Ù¢<e˛ùáBEóÌÅ(|*hy∆ûP€˘À¸q≥Í¸^√∫1¶æf±–íÌ7Ë8mcmRr‹rw)V{GîF‘á-˚f»Hˆçæõ^Vû‹µc„•cµI∫Æ´x„îÇ´îÎ‘nE l¸•Ÿ>>Gçb‰'NùRã–K âr5_≤b£ÔüL.±É2√„¬El6/!¿∆ør{†SÇbÓÑJÁ©√°¥
nÔøF¸P∂ASH*!¸D≤D√	á8∏xU «ßÕE öø„ie¶”AìD6ÿÖ˜©œ§^MØè∏<fP‰k1ïz àØ7vÜi◊§	4œû»sU9~†¬9®p M3	9.¶⁄÷NUÊg&£,«Lá'µÉHç
9à∂8®äß›œ{&¸8÷◊Á*o†„¶‡KsË€OﬁæÕÃ-?êÓº§^#ô¥˜Ωt…r£=R¢Há4±0'1ÒÂ €P@º˚’˙ã¯M™µ+¡≥Ÿ±L‡=ù”ÇË.+GíªÃıE
V◊[ŸGcÆj_EÔ+˜˘\*,”bíûØÃçE¨„¥ûgq t·•¡úcù>G)ıa`÷x^∆≥V≈ìí∂ˇ≥ê§RPvHuÑÌﬂ˝ÒL„Z=	≠ÊGrÉ,‹ÔΩNˆÍπ—ÏDpK∏¥i≤ΩnˆÂd[µ€ìëÓ!/±méúx>Ñ;
iÙlËv¥€>ô2;ÃA∂’óIµEÚ¸àˆ,_ì4"DRõkÕOr¸¡DÚôH80ªl$œç∑iÉûà8ê*3_≤∞^¸+»¬ cöé•Ã¶€¶ß9äd/^M3ó˝ÇC ®wØÂæÚ‹Â;Õhì}>ff&˛5§TÅk6´ókõËÍN˝b¬KkçFmÁRmèEƒ([X§1ì◊/É'˘‚’≠≠“ı˙fÛ2(l‘™{ó—O!ò≤÷l÷w.5–˙’fswGûJ⁄êö4±/F…ùM"QQi–¬JØc≤◊.ñ˛ˆÂ≤cfﬁà∆˝™’{°Psx|sA®ßßöÓóΩ˝°l#ˆk.ëzÜ#v	LAä»*€ÔÔ{ıYp¥5DˇPÍÂ Çîö8µpLÚ¥Ãÿ8T„c‡–ê‹Ë©] ô$ÆûÅ‰älI
éYÅQåºˆ˚-eàKa|ßwÜı¢zÊ\‚FBmM¶ÅƒŒØ§Ê\¡rYì»z<ÄPû[ë˛»ÙïÖH©é=‹2˜Öò∂
I+ºæõ]V*#N»øJVúA!Ë–Ç5ËfÆjRåA@WÊR^7k"ZπAÙ (∑ô}{Jòu≤ﬁC4¸ê'„jªà…mF2&+M∂iŸx•_∫Åò®EÇ‘Â¶_ø±ã
˝PXK©Q€‰íx‹?%∏í2$©∏œÚáJbd3ü#séÊ‡™◊â¿ƒß˝‰‚z0!Af.˝¶éŒé	V¥‹9r’∫—Èö§z]*÷gWdÈ? ,\Ã^#J´DòÌCˆ≈SˇÉ®^6¿$/f‡—0Aò%p¿JK"æ„à™€#Â˚JπÆ_éW| ›°} …Ë$π9,©‚—ºz%	'ù….HG[ZîÉ]ê1ÈÒÈ‰äi∆®ì>ã‘F”Ù÷Ω!ZCª=‡ŒÃuMØ÷7·„˙!ñ†B£ó<L~A€»î™®Áø`ÜΩiÆÕÃ≤¶iÀdÒ•öâH:!KY∂¢©.¥5ˇHèá#s’_≥:¶ãô&ªˇùñLtRÈ®á)ûÚ*%WÎ.Sˆäô‡eﬂ◊ÖäÖ¸ˇBIß∞PØ¿xn˝8^¸TkV:]⁄œÄç»≈H–(nüUM¶Ó˚8È⁄ΩñZ®%‘nù≈eh_R%ûY%¥˚X3ÉRU`Jú_D%≤¨»eáp"{¬¨·h,+WœJ6†	YãÛÜÅ∑¬⁄— :Aé8õﬁÙ|&8&ÀÕŸ<ßhŒyPG«õ#/KMœÅÉÑ'˜∞Lf:∞k®’õJ2èfc’∏Ç˝¬™¯®ÇdHƒ [æM‚cnn.kÑ @‚"&åÆ:%Ú-O£>÷ G¸°éâ,õ]8.‹¬“™H!†é$µ˜n’{ Ö¿Ù‘´ˇM¯%¨>ë:Yk¯˘Û>öG&"K
~¥‡¬Âûëùá[(Û;»HbFû∏Z_ìä»∏∂".e.1Æeß∆±*@3”ö:›ˆî‹è¿ﬁL»_#Ô@‹üOU€#Í;DòE.^ç¢>ÏPº“l∂ZÀÍ⁄l≥„Gt“ô)D–±œ'øeØ¥L·läói¯P2<1œÄwHí5Ω:˛ãgæîâÏ≥wPì˜aJ6‡Ã’Iû%∞O√ÙKã.±¯bE”l“¸∏F}πÈÒ¯M∞d \s`q`+©®î¡xX3f	˜-µÙôxπüzÂJ≥∂cyëƒl‚§üö)3ÂÇ	äˆqOyN&˚*0˛èıÁñ)ß&FäL/úAq
B„wxÌLK^TZMì»åœ¿Ê'AÓê›#ºûÇ„Q¸¡ê\‰UÀ%á$Dˇõâ—&.t¨JÂewã Ÿ‚•íO
([:$["¢‰\%Õ_ô∫d“e4Uc0±€f‘a˘¨¨	ùûU<ét∑gÉÔ6e‡1‚ˇ/ße\º+ùÛp “Zóã	,˛Ñ†¬ÚEEVIıÀÂ,Á0qç?.QØ8˛ÁCﬂàLtõ`|]áöûS(›ãûEFEBrºû)©Ü√âπd0¬Å&©©ùN¥+!ùH◊¢†$v–˛yÖ+{Ã/myÅ Ü°N‚¿Ôü”Ò{∑_áñÀ˚òƒy@ç˝πÈLH≈ˇ	¿¨ˆàr´$x1V	`/-^%XP≥º2Iƒtg√˙YrtÀÓbÇ;¯UåòÔ¥>evÖ‰¥y∫™7)“EF=iiIÅ˘ÜÄ⁄ﬂäÖnvöq^)≠%%>¢™içÛ,¡XÃ•ãêá∞O√!Ã3ÁKØlZt#∫˚ﬂ•[_3PU)'˙†ÖÔ75Sñà∑êjôÜgÙÌÓ	\‰ìÅÆ)%¿=€<1’ïRB÷(®ëY_ÆªÉ‘ÒÙÛÔûÜg;ÚÌ£"Ç#ç
_SÿWKsJÃ<⁄$¯‘7¡Ü“€*˘%èô%å.â·‘ óc¶Æ«ÿFf˛Æ¥∏5í'X≠ÏE∂êñ∂W¢˛Ûr2o/ÃÑ”E¢ueàí9G$lbë˛±‘Ú˘t‡N~˘K¥îCZa7/œE°D∫¬Û‹∆¢Dª©g[+f:ﬂÊ÷@Ô #ê™¸^@Ö˝[†PgÇùOH&ë ÜLòCyˆ4Iû>¸<Ií:Ù∆±S§ ß9o:ˆ∑?MT?J-¡yΩ$24›Æ®‡Ä—åS#ÀÔ#Î £}Ç”ôqgπ¢‡fm∞äÃ`75EÄ©ò€?üõ'ã?ª‘ü
Ü{f®Pv
$IÄ‰πü¯;ÒTœÛFÓÍ¸º5 ¢ƒxËbm◊ÌÕµÌ¡¸®g{v©\YZÆ,Æú].ü=[)UñŒù[6ŒúÎfÎƒ¿ÆÌ€Œ¿NÔ[ﬁVGß÷0˝;˝ÛµïÖSY^?íX…7L%˝,B{°ÆÎÂt )Ö©˙±*õ@V¢‡$0n§WÕÑ#XSÇ≠
¨ÿ±=‚ó\Y ¶˚,x™©ø‰ì≈Ä(^±G„≤pÛ:¯l‡œÒóríI(Ó@ån≠R–M∆5Q˙`AQR‹”#E¬ñ1˚Õº_‰≈ëTJ ≤evpLåuƒ¬wh¯.¥æI∂ï3—:gíJ[ëÇ∆ABpü⁄F"ò +Qc9Xàî"g˘¬Z¸7™$r√qbi=rQ4zDË⁄YLHŒNõÆ—C!sTöQ≠4óBˇUÃ÷&*°ï∑Ãÿ¨îf%ˆÜÔ˝Îùﬂˇ´™ÛÎã0ΩÑ\≠ÿB•–8ï§Xˇ∫¯˛<TJ:V¢ávÓ=2iv˛˜yÌ'µ«dÊS–Cê¢º2ÀŸÇ-ë∑%™ƒ
bàDÄò2Zô?‡≈Ω"éí•®)•öìÁ˙6‰HTìo»jπÊ‰ŸJ°nÙ ú[‘m1‡ë¨¢e‚ë/“Ê“ıÒGüx£≥≥tÈÒ¨6!±ãDíw…ôsïÖ˘e©pÚL6‹ñ››{©€çu¥wT˛¶ëX≥ºså;j‚ãŒßˆ,E¬Œ
*L1˝då7ãû8ë>€º€9«Œﬁ∂j´dAE∂zÁÀÒ›GÒ[b4*º◊-eTU‘µîggvúË. amqŒ.Ã∫û9	t¢“i1o$1<ãhcwÎÍˆN]⁄´o@EZr:(4Ωä∂jõ®Qﬂ¨Aæó—^˝“Â&)©≥+{w´É‡Ä1πò€ˆª´‹◊EKM√«e(ŒóYØ9q∫C≤à6Ï˛*ﬁÛáx%0ª«éq√ÍR7©~x⁄'œƒ@ íxa‹tZû¿Õ/’--A%pÓ´9-NÇvF[W«O∆+ÚmÄF-~9ÍQ=ú7$,ëzﬂï∞ÒYYIæ’¡Hd$·IﬁïalJj-º2ƒFàdJø7Í—◊äı∫5JlK‚¡ï–!'E Àa$æpb,+qõ bÄví
yj‹2—{»z+/fZBª◊îL»…¸;j:ûRÔè*áÔ;≈Xﬁ.	√F;ˆ¡©W≤ÖFÌ7EƒSµÏJ≈¯}Úƒ…s,ïÙ¶∑$Ur6+Ü§OåŸí¢ÎìŸTIgq$†,â H,©(«r(¿–a¢ìjäêo¥#cπ$ÍË4>˝œ·‚wHÏ˜ß<LÊLdÎO*™N∫92=≠5i¢Ù√¸3«˘øñ‰∑™Œyˆñ}`:ÜkgÊìÑ∑Áˇ—}yæ;ã
Hˇ/å<shy-P2÷oÜ	T-cL˙;H
XΩ®iwªX\x-ï6mÌéhÒ"»•y™Ùq≥dNQÎj˚˚≈Ë72S’$;N(è,ãy‚•¬Øâ÷ †ºi€˝∑,èÙh7µÆD{çﬁR®6∞ãGÕ!˜÷ÜF´ov4‡9á
v3,•}ë≈ÇÀºO|—_›?Ûh„ÊB
≥XÄ‡Æ
&Æ‘ÿ–?˙¯üô¥á¯5ﬂÿ›ôs…ª∞@©Û∫[”Éve±Râ%|∞
Úëgè»tq dj‡¯2~«Êê_(aó¡ﬂ=∞¨B|›‰√,R0Ò+Gè(·©F›•&Tp±RXœµ«£Ù =8‚[.sñh§ﬂúöÈ~Ï¥oÚá±ãñb ;	ùa'ì9“¡ªp*±Äp–x@ﬁPƒZÕ[i#∂–àÅ(ﬁ\rr%aÌM6î>^°ïiQÖpP…˘(>exJàÄ ∏ÁSö˜ ƒ÷›áƒ'Úç˝°µZÓ“Ëˇ ªÓöô&ÆÕú¬C'~A⁄ä{ÀÇªˇ∂Œk“:üë‚*íÙÖ |…5¨√ÃE©Q-\⁄d∑ïËî”ÕX.ã„n‘ÅìÂÒô P˚ö1:%X…©m±@KY9˜]S	n%˝ät'ˇ ””t€&l◊9AÎî&a√ûû8≠©%5ˆ¸¢¥∏êCHUıLä"¢®qn€vLê≥YåiÚ¨¿G‹qƒ¸ÁIp¬ïÅîKì$Æ=∞ÃêÀgâ (!“ Rö°MUXñÔˇ¿œ∫ÑÀ>'¥˝}¯Î√õF!EPëhKÓÃÑÿ"0◊◊L«√r°<˙]]ÉW⁄Ñ≥$óZvÑ°]√ªL¡Oöf»÷Q«‹7∆˝LP]87ôZ‘°R0óR‰!!óèTó:≥úVA*ü[!üH¢	¨_`ö/Œ?∆∏πûé(Î#KíÊÆÒhd:m√5„·∫bﬂBY⁄≈…π>¯˝∏˘êäíü”‰tö~êå_ö§ÿ∞Á’›ˇˆ€¬Ø|˚—à∫òu¢
‘¢oB‰ ﬂ	tu‘m∞•b7	^ˆå‚m§€S+ñç¯˙û[0ç›ï≈–®X∆~Àâ+<◊é∞â3çÈ‹êLû…πT<gäπ4`èˇûl€ofTÇoëæCˆ*üÚ9Ÿ¿üìœO eÜŸÆ≠.¬ÒÛƒÛ(næ≈9‘8∞¿òTm∑Ò,z®a∂3ä¡G^(àAï–IigÆpb‚◊–%ÍÉD»f&‰<!⁄ªqò?ı8‰ÿ†ÑÃm`‹,ıJKgl£˝>ÊÉá%på*í"”‰nYÆ770F≈">C®Yñ4ƒµOÉd“„-ÛjüµÁ¨é˝°GNzKè ∂…_ô§£™ƒ6x<ì!˛˝'MÅœ¢{Æ1n∑M◊›vª≈7	!¯1À|IV‰`¨)¸Ëà5¯V!#ìåwíkóhƒÃC/Ω©Ÿb∞#C;¿A—À®KH≈¢úËª^ıÏ‰qôxÃ'{≥kˆ˚y^≠;œMk`B¥] Ê'&æPòôEò6-h5EQ
†G49ç
1x(®X√#±/ZE∑ìá¡oqL^»Ú¢îFsÇ„ÈÎÂä‘[Ωúe%»∂dGèUT–¡MØ≥πîñıû<≤,÷¸° f‡òn]€ƒ”≠Aó’‰l≥ú¨∆¶OÒÙí<ìòH7ç;B|UÒO6,˘∫gbQÏ§Fêà≤"{ç$ÅÊßFﬁÁÿ˝ÔSÃpö‡Ü£Ç6°ÛŸï&≈Ö’7ëz–<=f,8Ùπäc°ß_/"ægcÈæﬂ«{∏`^	_û"3±ÑØ%óÊ.ß%ÀM&Q(≥pπ*ØîcZx**ºU=85Ö>ñÏu¶s˛åëd„jPÈh⁄„¿zñs+ù}µO√ú¶AÙ≤A≥.ö»ïÕ{tTˆŒ„7¨éŸ2úÙX.ônΩÑaRrá…Åu≈Fæ¬ÑÁõ£õ‘¶ @V¶¡å˘£ y(Ç¯ë¬aeçó@Z∫ofMÇLáòª(∫[$ﬂÓ1ΩÊz¡?Ä€˚€QÙëdhÎ~ª3âªAOd>±à©ìôëˇîJwÖ™“:ª’ñRÒ#èGÅ"â≥ûgê	™"%Oì˘É◊ó¨ßÒ‡^Åáv˛åä™£Qà!≠AiZêNÃzÓ Só£3&Ñl#Œ∆Ç‚\…Yïúj±srlîwÚ4¢˙„≠»RŒUqÁ∆`1S2<ª¶S“,‘v}Ù∞[‘—ï⁄´,ËıLCπo◊ƒ∑D~Eu†ñ∑˝	yÆdëïfI¶z®¶ﬂI:ï}˝oVñ/^|„:ä¶HG}<”Ài˜„Ä∆Q:L¿DÑt“›=
´É‰˙
ZP ◊ö… Lf™Ò… &…‘T§ %⁄æ47˝Z/¶‹Ï◊°…`¯N¢≤Ì¬’∂?v/“˘-˝˛˜PËˆáMëY §`ì2ãFœç∞jæntSYÖ‘—3!Îò&Ò8.QùÇÁhP˛`∞¿Ö˝´Ñ"º|L3dzL-BBÚÃEzŒ>2€ñ—∑\è⁄√ÒbrºˆÿCE¸È`àÈjˇ\ﬂ†É†û·"Éø≈ƒH'ﬁ	Pa>\,îòXC◊s∆mœv
ê=,æ»Ë¨!˘ù
ÇvgÊ,7l‹Lñàp<hƒ9¨·‡öΩmXC ì¬Ç+jè ^+uÿ·ê#i£®·=nr‚„nÀß%Ö‡“î∫ÅWZû Wx*EkE∂}ãßíi⁄ÛﬂgÖáæbææ	íº©û˛€iÛURª}_Z·+óœ"€U q≥çÓ ?»åÙa˘≤H¸Æ"ÿú¯ûÛ°á™XîWB ·ëqŒEêqŒq‡21´Ω‘e∞Q€iÓU∑Puk´Tﬂ)ÌÓ‘–ı⁄÷∆Óv≠Wwv† ËE€Aªx{›¿¥HNõımˇ¶BÌîﬂó3åÔWs`çË≤ÈÿË∫Ÿoìi∆pòÅØúpæ‚m„VöìèÆct,<%œ.9hﬂ±!õF7,Éc—¯ä'A1$.2øﬂEAÆQ¶Ë#I àÁWÙÄkÇ‰í¬§ `¢∞Ta%ÅBÕÁÍèäoLI\…º∂AZ=c”…ì™ >ô%0#xï≈Ò˚Äî¨Ã[Vˆn› ∞≤Á»*ƒÚ´£Â/N±É‰›3©È… ±ÒäPï´!´EáNEªg8UØ∏03ÁŸW¡'G+@∫§Ä©¢‚<ïlj∞çÈqHÚ,pM\êyjŒ≤É±HöQÚI{8+Æâ;2∑^RÚfg£◊êÎ¶`ö .Qì†Ü◊mﬂ|C£j97KZÅ“©®®îá]RæIVÅç˚îæbt˜?SsVX◊UY…îv•πåü$&jÏ~·û~vWa3◊î∞J≥„¨àX‚óÉÙkÿm4´b¡»≥£+ïÈ©jT2ı0®ÅzaÆX|ËŸ·IíLªÙ˙äúˇ4õ@
NVb¬ÿé<âÀÈf?Á£±§∞ÌRΩ±@CeG/yÆØÁƒ˜›9~Ô5*¢à4•UCUÓ„[2ä/»A[RÊœmŸHMï≤ËT≠UÛŒˇ  ˇˇÏ}o◊ΩÁW91íàjDI§ñyc≤$«∫µe]QvZF="G“‘$áÂ√≤‚H≥hÉ¢{7ã∏›Ìz7»≠c˘&Nb¯©,‚Øb‰ÏGÿÛû3è3ÛˇIY∂5hcëú«ôÛ¯üˇÛ˜„∂.Û†%S¡s÷dª!˚2,ºı•buÛóW»•ïÕç’%âM[ÿpªmüé„-¶±å÷-VAÍ¥ÍdŸÌﬁ§ÜEFX%ó∂∆•ùUiK;ì°rOcœÈëRÖ|Ë4nèLë≈[é◊`O‘Ùk8≠ZV
n‹˙õ÷_û“Ï©S®ÍÏÆ\fÿ’\6AAmé˛êÌÆ«¢´foz…ÂÀBi§mKej∞@Ôù8£ÑÓ˜
BG#B◊Ql‡L)GÌ•8zS¥Ó:{ÂÀieë%ÙÂ˜Ñ≥ Ëf´Cò,=xµqf/º8¯œ;Öê≥«;E-/j–pªÒ"Cgs%Æ€ÿV´xn9k∑ÇºlÚ‰;eŒΩ‰ZÅÕ˚°È÷Ω>è&}¶lé{∫¿X˚1üö7ÁXnÇÅZ'ú≠—j¡UÆ»∫*∏6˙≠Ì:Vßœ
n≤¥€cπı≤‰÷_πW\Ê‰ä1&è_\|i=ºdÍÎÛ°¶i˝ Õñ¯íxıÖŸ ›çå Ùüi‹˛dóß\®Ä·Ø⁄ß„vª<"˚µ„r_ˆ88∫˙2$ûp¥‹'Òy˚ƒ,W™Xõ©ê%øŸ¶õÑ[?ñgG]û=SÓ†Øïˆ»Ím≠jf:ÀÉ∆™oÅBÆ∫ÎπçzjÖ‚+$ÍÔ∏¿´©5{¥E⁄¡¡ãÉáÙÔçÁ@åãW´¸† ò&ÑXõ≠ë&O•⁄íp·µ#*‘ûÓôGö /‰˜û,k˜;t·ÑDô¸*ºlÂó@AÚÅæB¢l–.…]ßÚ2‘ÆﬂÛi˜TAW=äxl‰7*‹Û©*FMœ!∏ )ìÙÎ-
P*ï¢◊%ÁlÊƒÃa»5h˙±N¨∏ÕÒüoóv-üëúênçÕ¶-ß#ÚR;{îÇùŒÔˆ§≤A≠Á—Y¸˝∂‹ËÑ8Ä›Y√#üÆ– ë‹8ç·:@Ç‹z£ﬂM*VÅ◊Æ˛{"˙@9	èà>÷qŸß"∑≤≤]¯/ïr"¬`%òúO˚\>FÒBÇ¢PûN"A¥œˇÏ©>¿~‡*HÈ‰3<VE√eËæÛghŒÊKüÙ©’Ë«”.Ò»_Oùfá∞Ê⁄BÏöAWm—i˜›´1ÌR!eèg^‚ë1K‚∏±ë	ÿT‡)gÖvèBµc÷A¥Î2wÉ:µ©ˆõMß#¯FªdœÎÌ≤,@)õCÇxlêà:7ÁÕ ;gwÕ¢s‘RÖ\⁄◊~’`¨c‰é•ˇÎ‚®ÓÄ’»%íñ”ÑÙw@p`íØt94ù-+F€e#œá¿o Q§åúö·@l»€”:¡ h√”Aƒëçâ=1áŸ*ËpQ;	%53JIÇ
ò=x!èº4·2Úyõ86@6ÈRíhdôMAPó’+	…øíeü¶fO å¢ˇâ+ÖT”n\ÿbég6€‹¨Iıúïﬁ†Ÿ>èï"àÖ2πÌµÍÖ[N5Ö-ÈÏk”◊œNä”WÎ„g'9{ãLù$o–˝¸Ä˘ÕíùΩ¶:`Ê€óY—¿˚Àâ'≥∂$ë[}Ÿ†æUUîÁ≈|âïÁÈ@l®Ë<∑DıhàBâÁÒÊÒ	†¢Ô<≈ËÓ;hnå°ú·ˆJYÌ) s)ã}Xü…+|hSé'S˝ôáåˇ§Á[ËÉú|¢‚‡3æ4≈j|áMÎPu \ô∞±•ß•üììÔ+øëP6ÕG∏u6+ì0Ë¢ãUá	’˘'ß3í∑#5k…π‹0Ø/ÄÂMLç∫^˘Å≥læB≤3Cá˘2@Òhn±ïπ≈&¬˙Øü¡f)'x}-∂ Dì◊>ÀFjAZgáæ"ü>b#Üb=HEﬂaÄHä8@÷@£2ò`«V•y#úUâL∑ñŸà√9ª⁄*·:Úˆ`∏ß∏ üaËÅEÕa‚E_∫í˚4T#œ®¢QN∫ß¢ûß"*F◊irÚ≥ÙÇëc+Ôï±Ú‡êç™»¸”7≈¬ÀV1S/U-2’
∏ïôòYîff“N93≥Œı#hg⁄≥%>7'ºr`)8á
sÿeÆüS~§++Ò{fù^Y[=ø∫≤L.\9GM‘_íÀÀ+UÚ.Y∫|e£∫Re∂x(cÈÔ®’üÏÁ˝á†ÚK¢*§Aã≤˝(Ô?Ëœ
V¬€ä-ñﬁKù‡∫dsÒ\ïú[‹`Ωˆπë‹.™ŒˇH~ã≈øMË◊œì˚W‹=*7Ë`9Ûº2\/˜‘)ü%ü¬DïôS©∆ÿñb0≠°m|¡‹∆≥¿7È∞Ω88ò$…„ïâZ⁄p‡˘,˘6'æ≥\ê{ì∆mÉmMπ76ƒ∂tÁÜ⁄êƒJ27¶∆éﬁuTÍv∑ôûÂö¥€®	IÜ¡s1˙A_Fp  –Yå¯T"°»ÌL|dvT»ò°Œ'hÖfqí±g¸¢oÃ¢LÃ‹ /:˚~ø∑Ïtw∑|ÊÓCX[J ÇT•Å∆Öı∫Ò™ëŒ≥®‘ÄBqÜTzÕò(N``õ ∆j!∑M⁄˜ÈCÁzŒ}2EVD*∏∆ÛíõH˙∆¡[teF˘>ñp·#æí§rEUßêrıéLâŸ‡Ó8®Í¬∞ÌFIeb©√T	≤æìx…˛˚—I;‡ŸÑafmÍh"Ôôz‚å]bY\b–∞_Ù·£ïaï∂∏Î‹œãAöÖÁˇ1S¯‹Û1ã√Oësçæ˚Z»o1ùæ4Ø;ﬁ	ÆWñ}·)úx8	ûñ€Œf8$¡}Œ˜o≤äÄ√ê⁄‡q±âÌîﬁ;LÅëIÈ˘ññ+df4íË!u≥áÁﬂKı1]]]˘êLW¥ﬂÓÚ’ï˛]≤«©"Ae#ò≤'„Òî/¡+ùıˆÖpﬂ≤€>œ†¸H±‹≤X9¨ª∞è‡„ô’ ¯≤éö9‚ª≤∆£p…È’v†ˇvâÖæ®$Æˆˆ.yó,ÚáQQÿkCQL/ˇPÔRö$fh—¢…d≥ô'îÑã¶08}”≠óI∞ds.$9OäkÏ‡Ú°çT#Õw{NGíã?Òèúu$éGNQÍﬁ‹èTA™Õ>n˚ù¶<ª»ø‡Ì‹0/¶≠CÀ™CM˙.Ÿ£¢AÖB5/"µõ¢‹∫éL∞ÌLnfÛb3õ¶X¿Bµëwmz≠‚¥’ª3±@(Õó„YR?w]ßŒËÄ âÚ˘bEªu%‘äøÂ–Õï™oßfÜ$ˇV!Û2xŸxEOÔŒ‰G5—Æ€Ù¢Ÿ6œa(ﬁ—][Ï∂˙;‡Hsñ¯9‘»10€GÒ◊Ü“õ≈.≥ªé•gHz‹MGF~Ü§¯õçƒ…–ã‡X~¶>?[~ÊUµﬂ	
êBGTàŒDıOô∑ˇˇÍ@ÊK–êj‰èéµc°ÂPD;n›Î-ÖÉØ∑7é∑"Kòæ8¯œ∑Ô"Iöì¥ª˚5ó~]´Mü˚aÈü‰=RC…õÙˇÙ€“4=∆ŸW•ŸSttÌIùoÇÏÕ^GTŒJÌ’»∂Ê…ùVt˛c!l©S::28DÎ)˝¿I`+òÓk,Ç1¸y˘Ñm"Ô[Q^åH¢xff˙M≈qˆ2ƒ2‡îLÁÛ“ÂKÎ+V÷™´WW»˙‚//≠¨míw…Ê∆‚ZuqisıÚπ∞Z›ººÒKÊ∆OˆΩãjŸ«|ø˙€ãÉèÒŒË—e}Í-c÷®$’µ¢ ßˆ:y'8πÒ§Í
ÑS¸6kiô¥∑D©àDÌ^»`ºö…¬í.Zµ~â1ÌU`V01®(›pkÆ◊é‰√sk±◊ÃâΩ&ç@ Ea*írÀLY-f ^±Ñú^/∫Cñ3<JCññËÈmG´ãÇ˝“7-%˝ÉÙ´üÆ/∆e∫à#	°‘áU∆XÕ”Rx)§í1ítrõ5òînb.gk∆&EAæP§˘".À^xÉx™≥⁄S¥bc≥1e—‹4.ìD„yâiˇu%Ÿk@V“â8†K\.%»5–í%î…ì_˙≤Pπ∂Øˆ êoÅ\fŒeﬁ4*qTB˜3pı$õç0≥$ÁÃŒƒ¥=ıK9¢⁄®ÔeIM,—∂ÙrVœ Ò∆WjÂ††
èÓ“AdäcH˘á‚®73Vç∆õ5π⁄¬ÎÖ_,öÖ9ÜÏ]&
e¨|	´1tèÊ&õé∞Ù.z›Ye˙b£OcÅÏó;8∫Ã‘CﬁÚZnù¥ù}±$∑FGæ∏∫Ê∑Ë[Òibºkóúéfë4ùv°@œõ ^˝6o\∂ºzÖ‹ÿ‹¯EÒmñi«@œÒ«d«m”UÓÚ]∏ÿºŸ+éMê±±Ò…n´+\M”dû˘üÆ¥€ngâêÜÆp„Ú∆2Ωmã–©yc÷î÷≠U÷ö’µ´¡Â”%ËÂLéVÙføÜÕÄäD!âÚ<Co√∞L*ºﬂLXì{¥L“¿0–≤oxA’”¢a{jg’=^E*ô˙´ˆH¬Azı≠¢æ˙:¢˙*¸à¢•ÅO±D%“4ÏM∑∑Î”Ab£Û)s!=ÕÖÓœùÓ.œ<^svú:∞=u™Gã÷‘:.s¨.ˆËÕZÓY¶ü
°G'˚-‚ÏdÊtaﬂMq 0ˆÌö«¿vü¨hI2O{G[ºáø6G74ÇÒÖ∏srÿØª¬åÿΩP{"˛b‡{πç›Oƒ}¯ﬂl∂ÀÈ˘ôj€3˛bcdœπ;>˛OMHH0±çGDÿ5–+@ı&»∆ò [⁄®ßK¿“RgåIùÖ¯uR‹(sôñ8°ç~!m∆Œ˜çbµ«±›-≤Ïﬁr~õÔ0ÖK+kT|.ÆBÁ\ fÁ†¬ r˘C/À^,ÿGπl∞dÌ´<Ùr€v]‹ π∂∆÷7W÷ºY¨9u∑πTÿ`O…7˘Àπ&ˇ…¸∫ó?˘◊˜ÈÃkëÂ_;≠üeŸØíst%∏≠:YiÌPuÀe˚zÚœÂô¸òœò¸t÷#&ˇ∑«ì?·»7˘grM˛˘ÈŸWhÚØQsÚ◊]Röea@«kÏy-NøL.9]j~sÀ=˜g 9Ê~µzë⁄7M∑Û~<“Í⁄„7l Œ∫éRØ§Öyz»≥q{t]e.ú≥	™"È◊&''c-ü Ù€¯-aùÎmìÇÍZïeÃûq†lÍ∏Ω~ßÄG<Ûg>î¨îûC5ã¿-
=51;Ov’”˛”¶å∏5∑ä%‚∑ùö◊€ß¢ìÂèÉ†j0“†B3@"LÁ>ëŒ\¸`Å»üºe∞Ñ%v¿ }!sLN=Õ∏#ß◊πm8r`·n⁄v‡{ﬁt˜O3˜
Ã3Ò«@”1—Y}”â‰’AFE£8w*”-≥s{íÌº˘"1¬ü¨l“°ÜMê†ÀV„ˆ™å›¬fø1ÃıWÎÜø«x√Vó'»&ÌŒ	Ó†ô êrÇ,
gR∂ÁUx®]û^Éëk‡Ñû·√XÇwO(3g‡"n2‰i3\Y#&øìñ∞≥Ãô÷@ﬂMøÂõ"—h:òlExuË8Ò7E¿	'˜*ÈŒ)ÎŒâΩœD,ov∫ƒŸq6"JÜæâ°†Rú∞ÃÉÆ˝ÛAŸ&á;+Nò√ü+·I?}¸Ô‚Eòm1 óÄf3ÈÛÅ¥®\m}Û§UVé¨1È+z˙‘¿ÎLYKπñóQs9g÷\ÜgΩ¯n6;Æû…πÊBÀ{∏º-È¯v‰[ô¬–}Î“
W4î"Pu0yˆû¬	aÕe˝íFùåTú ≤…„ÇÔíe∑ÁxHåZ?r®	 |fòƒr>˜‚∫˘úM7ü”¨¬®a≤æÉ¥;`˙y£ê·òHWë≈Ö‡˛‰ÿ"Ÿ ‚Ê!ÿÚåøûeg,=8Ù>¬Åuóoù… ]+ö®[˜˙Õg¯ÖOAÎê´ß∞;0[Éã"EDd©`÷ÿäû–∑ÃFNá¸Nx"kL¯Ï1u‰¢J
éñsÀ€qz~g≤÷⁄∑˜Ï‰^ávÕ&ù(ae ÈìÇÉä˛NØpÉÉ∆ ≥ÿüS5Eö,ºkˆù‰d.ûˇEˇ˚÷‰ì@dK¡∂Ú "7ŒR∞Í Òd‚íQ£íÌbÜëmÚYº,	b|>Ã˘áÂ|2.Oüï Ã≠p¬Î˝%øΩˆUñ9¯^Ãyf‹,‡¶ñØêGz!CıE/s©ÀEˆ”}V"Í@æU´È)»ı∆¢cw«…˙Úy¢ I˛»œ} ˝±_j÷ÓÂC.ú±èËJhi©ƒ”pJoúÉÑ≠€≤,ú¥V€H¯@NæeØ’ù∫e6oò{b?·ÉÙ¸≈√áÉLl¯xUz®ßé∂Åª„ÖÃ)
OA=Á”.j*cä|–wËúÍπ.YÛÈÃÃSA_éUyg§Óœ§‰‰G=ÌfZ˛\Z=‘ò0k⁄B∂ÛB¢E=ì´÷q∞jC{m{ €j´ù«±h&î#?‰+`Õ	œz¢ﬂ>|áKPñ˙D]Ûwâ~Ø–{Ò’ÉóF™â›x∑õ1#ÂU∞ã∆ÉxÏÂø62#B qäÈóuÿQ¬˘W˛S '''a^ª	iÁÃ‰"XÑ¢Z>ãD7ã BByL:åÎi8öπ˙Ìß?¸`û†ÿ0:%„≈;4lmâ3L)b©w…‚“‚Ú
˝Ê¸ ‚ÊïçRΩ≤∫πí&[»è±ú ≈_7õ˙Æ+øX\⁄$’Õ+À¨Ãˇ¬ïs‰“ ⁄E•Á¬ÔTNx0Ùƒ¯ù8GÖÿ)Ωƒ?Cé˛Ÿzƒ_#ã‡( ‘•Ø•èª[—÷{≈ìt#;â”bê1ôHÙË⁄?»fˇA«©˜9DÚí”ø l¬∞¬"ÿ»Aö¨IQ´ºÉ'ÑñÀë¿≤◊â˙	¬eñµ,<ÜVÎ9?M¢xÎt¯µõ U-ë¯æ¡iI*|ı‚‡c≠!àëıÛ∞˜Åê‰á∞ÛA≠Q3hT›Ü[ÎπıºùBãNÄ•ƒÚﬂ4Å›aioÊAÍa≥võÂ8M0?º±‘à€Ë∫–á^ı‹ΩK~›-åmı˜YÓ7»%#AêãdÈõÍ’D4ãL [5cth/GT”’˝Ìm⁄5Fdö4<˘o8Ï´èî&ˇ(ù‰±Zˇ¬Âtüi≥CÊP»“6¸é˜ÌkßA÷Ñüõuù]R$U:πÆPE™,„µÊ^Ü)!ˇ3¢5b	∆]i‡—Ò¿Ä≠Ä#¸áXW#’]ø”sÈR<Ù?L4ı˙tøËQµ‹¶ÍçÊ·a™Êæp&ﬁñ#t∆Ù´<°ÿÁÃl€∆_dÂÑ'Y‰=”¡(ñàäÄ“/∫Òû…O Hó8ûa¨LæY7Ö∆”~‰ˇêÉ≥†¸zeéÎâπÀÄ‡ ¶%‡J“π£ƒñé€4Né¡GN0∂^l‹PMáö1\;Ñ(≤#‰3ÇM_wëûfŸsàtOó≤‡q_Åˆ8w∑¶7Â€Éﬁ˜LöÄörkÌ3knP∏øÜ$·“)Z-IÄÖ
@zêÕpÛn}I¥HÉ¸ˆ∑dVbŒgvˆP…˛8≈ÔªGc<ä˙ ˙º'¥ÙÃO8ÅΩºV˜æ‡ˇ»g3∑é∞n@g£∑”‚Ëˇ« A|Èò›÷8Ú0Ê|2åé]?0`·èÑ¯Ò™)ÁΩœË9\¡ú¬6ÒL¥◊OE»x®é ⁄"^u¡ﬁa∆ÛÇπìûxÆ=©√Q"®zÕﬁr1h"´
ì⁄‹x;˝4©fs7øAn—„‰dú±Ï<á°™%ú⁄Â©ögﬂÂ¥_eÛ	º4Ö¢Aˇ(Úi{ÏnHZ]°˛´øR(Ùgå:¡/:V&íèWMô∏Í’]ˇp5â–‘µ©jíΩ~äD÷ÎC5	ªTΩ˙ÄË5[dh¬ÔÂ˘"‚ù≥«W‡.ˇo(*<‰)£“B∆§tE¨ù˚“Ó≥PûZ”àEtFEÇêﬂWDÍtŒﬁÌÕ≈sdÈÚ⁄&KÈ)W»“ ∆ÊÍ˘’•≈Õïjz∆íuîjná
fèâànn*Ïô2ÒEdı‰%vJÆ1•!*ª“j$"È>Ë‹ö“D˜,åv9H-‘j–˜u≤®ÄyÄﬂ(Ag•Cú~°Nπg¥†Ê€í1ªL+ÑàÎ@îˆ9Ö˛âP®*—é#I’Õú¿â3òÈ™€°/‚÷a¬ ;Ì;#jKıÌz≈§lóLbŸ,6∂ûÁà0lµ—`x9∆ªà◊MÖÌlîóôÚgQï“˙ÄLfe©6v`	‹ˆ)(›í2˙≤âÉÇõÉk âYÕ: ˜n>ñ{gIÂ ∂è(:sÑ˝g	Ç´$±–¡≥#õ=ëË/ö* p°Ù;º¿©$À.T· EÍ3ÈN;¯ùFd˛¢"˚–Îv˚ôXî‘r…*4dˆá:kß„‘YÛÅØòôXFhiöÈÜ”ëúP+ö˝|6Iv~®6⁄†∏˜ß’À÷ÌN
ÌO¯â¿l‡6À•JÆπÑå7UKò\ò≠º÷í¿dA_"—]<‚ÔO∫©r7[éö@·N
Ä÷Aé*‘meÅÊz+$OÆ
‘^D)†–Eg∆bd:Æ.p†Ÿ	/Jœ(Gø±€Îµªï©©vœmyt˚Õ©[L3‹ü
OlL!πQÿîævb∫˛Ìë˘îıâ‡ ∞’∏√ZŸÆn75∂¬∏€Nîe´mè◊„¶.=·¢ILMç£ßEæ?*hÚRåóöÁ_ÜÊ èjµA+ˇ ßçgHÎQó|ôìô
Y¨VW?XcÃß¨ÙÎ¬ÂK+^ﬁ¯yNﬂI(Xòª¨·:a/Tuwÿ›:À#ñ<•JÖ.¨π{„‰∑∫¶O∞ê¸ëV[d√e–∫‚◊g*¯L’ÏW˚µö€ÕL9F$∑E~ä$`ıC	A-÷'H√—)Õëû"F§4˚≈ÂÎ21W–DÅî)ÜΩ0÷r˜rQsI!≠¡#Q∆˜x$¨òWÔA≈·$æ∏X~ÏÂ¡õl,;)<§oû{∆ŸF¸»∞O¿ﬂ·sxΩø»Tì%ØSk∏ˆpö£-kPm¡›Ó	Ào»æ◊_¶º@m∏©ÿ•ôıw°†c†A?Á[<°≈ìè;5/à-x‡¡òƒÈŸ2@’
N˜å¿¯—	∫ˆM¸’⁄¨:º’oÓ~%ﬂπÍ¥–ÉÏX¡…oËÜµƒJÑi´í„yƒv´ê¥xç6¨AVœ…◊jÀÍˆ∑ö^èZÄõN˜¶ÿÆ∂ÖàÌ1	‹Q ˝ml¸®li<π”jyŒs*»	_µ˝≠+^·Õ›‡T ◊hZ˝hlá3@Fﬁ–é¡è™I¶Üu%ñÏ÷Fï!Ø—^ós!ôÿ,oËv0€é~√À>1m"ì≈ΩìÎb{)ã|ótj=≤Áıv…EÜ∑ŒÕs¬ Ô€ƒH˙‡LGLÜS[ø©-/zï∂‰•?eVar],çÂ	VlF–m-FúÆ®∑Ë£ê<£u @¡Î.ÒÍX†Ó∞:≈V:˝‰∑6‹∂_ÉG*3n«0TÒ∑ ‹€™Iöúf˚∫6«∂%˝—pYõ6å*GCµÍLP;J¥ìW$óñ»Oä‹‹à2∫C_9n.=ä&”"zâ`lM
0qh¢ﬂ&ÁúNÖà
~¬i–ﬂ£_3àüK¥ó∫Ù”2UŸ Éê÷¬@Ûìè…ß¶*E3ÏÇë7∂cÆl•€zöÀoX~ÿ…ibÀvL
æ∞»ﬂ…dV7S9†≤¿Eî]+-àº]t/–Ê"U¿E`i¨dO¢—±Âu`íπPnrÓwÏ±	+Ê+pãOhst÷$Áb⁄à?2“CíıÒ&ñ¶Œ˛‚¯¡Â/ùsÄy¢Bé«•0™ ÚM-I2”@¿ÎÑˆD˝´,óÖù$ÏÚDÕá^¯å´∫î£9®`ÙÌÚÆG}‰¢<€
gu ±]ÏŒãoKõ≥›VGÏ‡E√€’+l'ÃN£≥Ú#›!ñ)ñ%â˜∆‘ÓR9»1bq¥~FÕÖªùUO‡ÚïÜZhzov©öÛT∂1[-–®ÁÅü=!y;Ü™b-^ÖŒBÂÉπÑì æÅ ˝A§TíÇòµ[N}«Ω,jä= ﬂU6Œ=ã⁄6ü§∂±!
-h∂Ä˘Ù∫Õw_CΩÁn˚+Jhﬁ1=√—æHRyÙäe¥~.ê*û∏˝í Åï¨ÂñÓ¸2 h¬Â9ÆBo(»≤“,s›xúT ù_çÂkÇ]‰1Ê
\ L~îc‚#ΩÙ
çy.YÔqTnÜ∑ønı<mÙ<Jî!ß‘˚ª≥U\I˝c0ƒú)í(°Ë˛>ãh~Œz≠B»?Q‚Ê;.˛◊
ﬂ.¿K|$(ZB`ƒè≈{Ñ∂h7ÙÒO9Wò“≥ÆAQUÿ˝“ÚØ’°‹ÂJj:SíW{ëÌ·Csj´îç√Úk™?j~Ô¯À $‰Ω1∑„ﬁˆm⁄€û√ﬂ.=ÓÏqhè{"xîÕáŒ_{ˇ#·xtÌ∞ﬂ90ÄngqA≤◊Y[áÓt∆∫ùáÈx\œùñfR[«≠åt,€MHÈ.TSLœaÒ∆©,ÆH)À[lvC1mx' }f⁄HÌ∂Ω÷Ä¥Ë.À8ŒX·≥Vﬂõñ1∞5Ùπ˙E+ó"‰xù’ÿæK1ﬂ⁄ó¨Ô2ÍîKö´0Çâi˘}`G!ë„òÀUò«Y»ØJbW/'qN⁄xqD@x*tIı:~kG∑Œ(÷Yß1.>n|≈|Ì¸æy&8ä®^\í◊c.=∞Á]∑æ≈flµÂµ€no!◊£Ëâµ–Cô{ˇÔã{,W€∂Íp:m∆§˝ '$ß/”t;˜x˚A_ˆ	vPñ/àÂÈOƒÜD?3ﬁÕCå∂Bù¶Èæhó©NnXNm˘9r˛ìnî€/ö€áç∂°/9ˆè¬öâÒè⁄ıÒËÍëo4ÆWøNQ´w1§≥Ò˘{ŒK¯ià∂êìÜ<èH«‚·9RC.QºXƒÅûäﬁy æ˚å±éÿ:Õd9÷œ˙B>ëü.x∞ˇ,Ó%~ÃæzÌ|≠3ïå:õï[N£Ô:õ$«ÎäuÕı™´é§Ô5û7˛¶x_ç7?ˆøæ∫˛◊ ˆøö∞f@¨I‹˜¡™_èΩ∞ÿÎ_	/¨¡Óò	>
ı∫p£Qø´æ›h<Øâµraˇ+=Ÿ⁄øgRL›Ñ`ˆKq¬Bìåsv∑êœÕ¡≤äë”’êF6ÍÒây0ˇvBso?ï†™∑öäëOí{‹œgÙjæîÂA¶LŒ¥Â£‡'˙˘Ziy“áﬂ†ÅQÒ} «! }á ^~‡˙Îπr‘|ÛO∏ˇÂ>ﬂ›üb¯Ì7=ˆ”˚È_ô<Ê»˝W¬W/ºÕèD!B»Áé±ˆé≤ã>;Ñm˙_‰’ö5à›JzÔC4	n¸Ø’£ÔÒo–§DˇxçÙLmYøº~eù\∫ººx±BŒ˚_ïŸ˜©ËÚ/T7‹ˆßYï0‰=ëŒo≈˚3ˇøÙì‘;qó,ÍN◊‚>ÖX˝1'Ñw€≠Ø’u{tÛ˝®òËäH†êóïsè–≈Ã9¬Ëøıéﬂfú ∂TJ›∂SwW!&–5mº@«•´…ªÂA_)À–;¸è›‚µS”∑vØßmJ\œÿ±Ø”πíÿ∂ƒùÌ˝∞Î’ÎT…ª\C„Ä◊<Ê.wôªì›ûﬂ^ß=ÎÏ8Lq* Vì˚5Ñ˘¶Î‘v›ŒXUﬂØg≈Ã–™˚V’=Ö d™0…√º∞ ®$Á4‹ﬂ	•ç…„@*Dƒ	 C`a!í0!∞Ó7´(ãò«ß…l®(Mh„D‰=a’v˚€©“z¨ü6{NH‡àão(æ˛ë!(ÀÌ>X◊äcÍ Ï◊êÿ+Fa(ÕöÚn9]7ßÎ∂ı/ ”gw√8°pDDxºQTº∫E5é<tXÌPΩº0k¶ç$∂sëNxÒ€·4#!ôÓ<p◊NöpÄy»t=øKìY*Mf‘phû†ûtŒØÔÆº3Ze‹«ÿÛíE%P÷Ç9Iƒ§ÏíÇÕ¨±ZP®ﬂ§WìÏ¡tj*w™u–˙à]j6LL£’3Ñ/0’ikQ¢lJ‘‡;Ê˚ÁΩg2úé*ÿ!AjNˆ–øÒ¸»á´ 	Bqg'zLåP ¡JÌnÃdF,Œñﬂi:¬Eóò0Ìé[d:¡P6¿∫€≠uº6óÜBÈ4‹MÃ!%¥œøiwÄ¯¸P±ƒ=ëY˙àßf>›≠6aoÃ}#˘Ù´sK\(”<gÉ›!É˙xÒ’∞"å•=ÀµÚ$©^9wiµZ]ΩºFV◊÷ØlVô0˚^4ìD‹ÅÊK∞^˙úª /˛c¿ªGˇ˙J∫‘>ÖK∫;oŸg√ª£™ªıô‡˜V8¡|â™» ˇ1`on˜P"äƒj´›Ô18‹ãtªGÙ0,Ã¸¸Ü≥Â6B¥·‹ûGò4ÃQ:ã|smæ0Ø)[ _pGÁè.CbG<U≤Ù€¥¨´äe∑È¯]Æàù8Û≥<f	Ô!‘%>T75πﬂi‡≤Y≥{⁄L;!»¢°qwù÷é´Ω^iÿ¥ÓdœÈÏ∏ΩIﬁdíLõn˘Ó.ùTnÁÙ	≈(∫„ıv˚[úQ¥ﬂu;-:~SÌéˇk∫ZÖ¥˛*yb„èÎªê¿=óm‹[	V ‹Ayrz:â¬ yãM2∑˝Zø[Ò˚=∂y
îuÒUám∫eÛÉnk&!˙Ö !– ≠"OÜI¸öã6´Ã≤ÎÄS"ˆ'v›yˇ;W˛ï’	r’eº2b—≈^€È∏ÍM;˛^˜ÙùúHë]ljåFvq Ï·….†¢®“π*¢~™äSÓáPì¨6¬&	π¡°ÖﬂüÖÓ999˘Jà¿ë»Ωé€ı>“ßE»gaèú„Óë.ZÙÖå˛ûåi$ƒ:py	(gû8Ú∏Ùƒ1 ¯æ∑M
oŸtù…^«k∆«—w5¯«j&∞‘S±øÊÎ¯æ˙˘â0êr™ÆÊYEZ@»¨ƒ3P©Ïˆ˙ùˆ:tÒùÀ=“r˜XY9ù£˚ΩzÖ‹`ôu≈∑Ô,S°0ŸÚ˜
„woL†ÔƒΩ„ªâ«ónjπ~©
Mü"í<ísﬂX9Ki->wûâjè˘”>t∑®ÆuÀm¯mvnÓˆ±«ı6Æ÷3[∏ZÁË÷–i©më„âº°¬&∏X9«SÑ/¢b8"úÆXi¯{1_	oòäQ#Ô±’JÿJ+åOˆ¸ã~ç
@ˆëU∫∂v
c[≠‚πÂ±	rá^ªO/mıiáy5˙Mìn¨ªÙõÜO€4Aˆ]F°'w«ÈÕ«∆sºp Kü∂|–~æÜæyq0°f$«Û€t[…zº>G>˝?hÜÛÙ›ø*$cg√ﬂ∂Â≥ë∑)ÿÚ∂Y^‘'“gJ7ªÉ/î*ä⁄ó™>V*0ª‚@Ôh)ÓS”c(qQæzê£3q `g·°2¿+≤Áx={◊Á‹«¸»»dj√ﬂR_ë@R†=˙‚·ˇPøvƒóâ ˆN~,Gév-V1¯'lë‹∆ä∂Ìé{ãi◊§Œ0A®›¬æº>é~”≠CÏ’Û(É¥—Îâ¸V∫·Ï_UOﬁÊ_–GqøqZS–
 Î ÷Ú#K%ïŒú≈£¯Éµ/ëh{Ki¸tˇsÑB¯LÂˆ~´¡4Rc#°ıˇV¬Ú5°;‰›æÁ¬Uhíƒ‰°1{ÒD∫ÀRcéÇˆmëÄjÄÎÎt##.d‹Îêo∫sLËj§GD ÓÉÚ~ß∆2T+]¶ÈO-åêmÀéWéK£–7¥rÑlÕ¡∂Ä¢,÷ΩLO¡–RÄƒazRåâl¶°|\ë†í%5HWΩÿúœ6>^Î›DV»ÌQÆŸøì†7ö≤ß©üIv^B,∆:Zqï˝‡µ»∫ﬂÓ∑…œ¶;&úêÙìÓ§e∆π˝¥¯4lﬁ∆ÃLpj,+Àâ2‹W∆›ˇãÿç»/^⁄SLò5Ü¸À∑«ELŸÌ∏€ß”Åu≈â®∆Èø¢˚kÎ&N‡2#¥q˙DÀßÕr;úha«(xÑ∏d”∞√s≥-È^d´„:7⁄Œà°sVn˜X∫¡ì0íÛ≈tFfIıñ>ÚqÌ8®íSÑò4ZûQqg≠æè∏ΩüÒøû>3Á“ÖÄÿ@(Ë0éu∞òØ]L
HıëÀıd˜âÅÁêÎÄbP;0DÍﬁE¢;`¨dÊ‹π!≤Ä„
¨ë≤Kﬁ∆8C≤“‰"–y®:K∆≤±µfßêCa,§SsÊ¯ó„öY·ÕL!]ö®i8tÛtÿ(ò2™iwo‹EÕB4ËZ|˚Œ#1Œp∑»se{lx4Ó…R^+LiÆ5o_ππ·∏brœRûó†Ìdb$‰ﬂKC<W(æìQV6û/Il#; ﬁIG∑µÖ`µºã&ØÉfîÓôxRR≥'^¢£&ùE;°hPÿê‡§‹Éô…\!Ù îÇò;8/ÃKå ù8)µM◊ß)^YnÒY∫º∂π≤∂If+‰‚Í’≤tq±Z]©íwIuÈ¬ Úïã+©˘\w∫Ω~ùÆâ˝≠EÓäﬁt∂Ñ
’†ä| ªŸ––6“l‡ Ω´¨d)v«|^ª£¨ú˚ÈŸµÒó©¶dÓ@h &∆UØÓ˙a¡ƒÏˇ9./Ä∏ înJ¶Ø¯ÍQuJ°Ù$°2…]ÍôN7ªØAèH·ﬂﬂi∏‰íÎBÉ∞’ó§1I÷Ñ∏§∂ $–πƒ;©§ÜöZ0$6ˇ"¨ÛØf¶£‹’Ÿ]¸”_>ãf‡=SÂ_2·û⁄Úü”˛ÀÏ§ÏÆÑÏ‘π “ïñJ∂¨¥:~£·÷ fW î◊ÄË‰ºqcº∆ ∆£µ≥# –∏µ_XXö≤¥Ì¿%–ƒXLô‘FP3|.>„9Ü∏ûÔaﬂ(ˇjV-öÑuÍo~v¥ª’J√†’&∑ú^m^éà*<îåiÉº ô6S†!`†¬ÚÖÖÒx3Ìá
ÎDØ’Ìu˙µûﬂÅ{éjX˛›4√øõé®«∞â7a©—–âw
1Ò¨ª,z ÿyp√
Ô¢ùüŒG÷iHWmNOÜ7#œd+1ÿrˆ®hçDÃSƒ%óL±Æ÷v›zøÅC£`	æ¸~WÜ‚wCÙ∞eçÑr∞ÜC}À«√PMu‹ˆäåY3•^<±7x0í1C¨|Ñ3ÔFâ8PjóøË%÷IKN£Q∏—§ﬂŸ†%°§k_’tÈ%£Ω"¸TÜ÷“≤nw!]ˇÑΩ	[#WSÇçe7’T™ü∂¡LW|˛¬}5†yû!úyì!˙KÊ*dqïT7Ø,ˇíl^Ÿººë”M‚x≈^üjRhâ	áòAYŒA6bq«dÔ!XX«ˆÄhkàﬁíò^∫@W‚BD+M	´Õ„È-$Á…—8òâyŒÔÂ’E°æOËû50å3]ÇÅ:¿$◊óB≤ERúü'ÈA¢sÄ -î∫O4zÔÖ’5ƒaê†∆◊m“◊S/æâ—FMµ©K<»ÀTöK$•<÷5üèî´Ëk£Tü]˘øÕ<¥G∫¸Z?Ìá( ê—7,x™üÆı“â5¢›tA ;Œpça√T◊‹¶◊Úk◊E*ﬂ_íÎM√Õ”fî‚ìÂ(iw ˆ◊«€d˚“%∑€uvî◊≠Ÿ›ô ^˝6¬˘X6‹=GÔ
Q#π!q<›∞¢]¿¸˙rì]ó%Èâ≠ôÅµ@≥DÊá¡~c∏u¢€|ÙµÖπwÆCÔ*5R ú°.y™k‰›CBãf}œû}ª°häÙâ^wQÃÕ]ØuìNX*Eíﬂ$iÇ«m.@éÿ^qf¥ÒÛΩÚØîM·oÑ¬˛ìììCÍ~êûé◊‰5«à@≤˜d´â0h+a≥·À∂Òåòf(({z'‚Ωw¿cº¯≠üª˚À˛^Kﬂ"Y¢;I%≥êÖ+LÂ6ä˘:Hh
Å®õæ€°wM∫¨÷+Ëµ9•ó≤‚íïxQ^ër|ÇØπä|˙›ÎËgâﬁ◊“W£¶–Î–_øÈ5]ü>á)í÷;‡HâÍFxh%Ën«”ù}#ûS,Oº}áè…›ÖÒâêRﬂΩ8¯oä2$ ˝A:)8p7C◊|™O¯ªrYÿ5⁄ºÖ–≤µq©Pçˇ3æ‘…›“^°lËV˛¡®óÆÓxO√Âäfﬁ◊TÔ¬!#AéD≈t@RH◊ˇáJ›z`≥¸E”≤ÑABeﬂH’ˇ~Ó'"p,l"Ò–U)|H·ßMª∆OÅ.-ÀŸvËº≈›	B∑@–…Ÿ≠îéF ≤¢s;f≥EçJmèÖŸíµ‘ò'bxh¨Ñ2◊#áU2?TæÔöÈƒÄzøs :	ß§ÌX4î-Ú6»ú€„`õcŒ≠q#r[<ﬁè7E~ ¥ÕA6DvÿÍ¬Ó∂Y#ÿxØu¥M|e∑©¡ÿ#l°3ì78£ëŸFØB±ªœ˘ˇhƒLÊ1,Üuò°ß©^∏¸aï\ﬁX˝`umÒ"˝· ÀŸΩ∏Z›$^XY#÷pSsø(†¬∫c9VÊ≤BVÈ}∆ﬁãU§w‹]ó˘-ó¨≤π  -›ıE◊È¥òw¶J‰˘‰í_wŸDv‚&‘ Ìq≠M‹N\ùÉÃNG€Ê√¨n∏î¡´ˆdæi⁄9ÂÚZÑ±‹±?Ú˝&˚∑ﬁÔp∂6ÆèÈdiÄ(†e#{^oó,5¸.#?Á‘w`†≈¯∞û$WKÓŸ„è†‡¨A¬m$ÇZëFœ´m⁄∫Ü€(}kêƒKKL£ﬂnªù#m¢≥∆6ä‚û«'\f‚|åƒœ®Vƒ‰b¶≠–…m◊°≥ªâ#Ö¬ekéÇ´ÁÌÏˆX"'éU:Ω3Ñ∏Eˆí kò'◊£ 6Ù%∞s-¶K~ÜÆ€&eﬂ ”Æ˜êt%•‚AÀR≤ÛùPË(‘gÊ]âzIHäu≈t#¨ÖoîF/–ƒ∏q2d÷∞≈N«ﬂªËnÅZI%c≈ﬁÖ5˝ˇZ^ó/à©é{}÷T1Néû∂ö2†©fRπÌb<vIµò)IÇRÏwí6µ4êBz…°*≠‘˜Eæ„z√Ÿß}≈´h◊*ç5èzh”›∂[ÎoÒ˚”m^~æV.Mù∫Æ(û#Â@r‡Áíµy6ë“Ÿô£ö0”ÉeŒﬁ}å≥˜}ØπÛtjß≥4	⁄‹’¶≥#´Aç◊‰˝Vó^—›ÂL5Ì]øÁKÛ333sÛ•rynv∂∏]öôù)œ:Û5◊=ÀrNo3N¥ﬁª€^Ôt≠„∑ﬂ›;]¢≥ˇ›ﬂú^òVè;ç^f£ëÍèô"‚lu˝FüÆQ≈C.zW¸„o1û"ÔcÕ}jRyΩ˝¿Œb·Ì;rªÀ¶'≥Iœí1y&=aå•k®èÛscê‹ 5CtR«ﬁäŒ’ùUAÈŒ]§√÷#€j(”˜ñÁüç"=)¯<#*<!yÃ·∑…e⁄_«´ìMgJ¯`]ô±“òâ)uÀ÷AôvÉÁœ∆îç⁄rÇ∞FùttõC3*∂∏¡œ§¿˙∆eÈABÙTfëﬁaº+xa6˝∑N•
˝¶ﬂ—Ä$%6‘âTëbıjªT√Ñy˘kÒ≈¡√ﬂ1£ Å~|$}á©ÿj'ánrÅfäµ _C’û”I¢ˆﬁˆç‡ÈxÕ˙‡Î…ﬂ”±·˙ÙÔEqàQ∞≤òR„ÔíË4∂èê)≤ÓÙªÃ·ŸÍÒBgò¢®ZIÀ1o ºP>‘™ R%íaÎ|)ºﬁälœyâΩbâ©Œ%ÓÌ•ÊŸøªÏ_ª\◊ÍøQ
ÑdWüjÁØa7?ôÇ% 0ûKth√†œs#ÂÃN–y‡xS÷$>$ kº ò€ﬁÛÅˇ];R∫Hº —›ÖÖÉ™|üéP´O“6ü‚SßóÌ.§„¯Œ‚mézce‡ÖÌ]1≠Tƒ¸ã∑KU@Hîãn∑Î∑÷˙l∫[…Pƒè‚íMÕ¬¥·÷˚∑©¶Ï7nz=F
D[z…iQ3ã”©øK66N˛ÖgZ,vjÏEjÃﬂ=|¢dKM
ﬂŒUﬂÜ3uò•Év`CpRª1Äê*óŒL∏˜‚‡øÚò¸S¡ΩÚ˙Wëˇ#p5ç›%?}¸Ô‰¬2)M/L∑iow\ß9ÏéA!.SŒ˘t55ïø√PŒ9√Q‘ˆ9kø-ì »h˙-Y^Z®ÃŒ!≠ç°’˚È;æ,Ù9«ãHÎ∂]∑ﬁ%ß…µ“)MñÁÿÈ ◊qDä˝Óvoµ~õﬁÆ nLj›Ω}yª ‘6oôQe?2é¨“8yG∂a≤·∂vzª∏«jµ.tg˘k≤9Sv†(A¬T)0†Rm&©!ÑB+¿∞û¥¬(v≥√¿›ªì0^wo˛/B£A ï;[ÆLO#W1¬ÚY&,89==µ0Vıw˘,à˙y#cñW8ÖÌàPHP4.Iá~4›ë'H∑∑ﬂpOﬂπCˆº:'Øõù{gåN˜Q°  Oπ¸ˇ•OÂjYsny;é‡5[gG~øKu§5∫ÇdñäÑc&õÏ™—e©î	
WTR÷{√Ωçáä‘›lXñ≥M[&gÿ ﬂ∂t80~+˚3äÙP˘˝¿¢Óuù≠Ü[?mµ»˚ßI	§∞d'HGO})êû5JVÀ±ÿk$=Åmã≤π-ø«Dúøá¡\ı±Ixë%«ñ˘ç`á≈vÄbxh˘*ª¿d∫|Ãˇ˜D·}≤{Û π/Ë®∫QÚK¨M¨$N˜í”÷≈åè.º#‰öd∑µ≠ﬂÒÎÚªiˆâ‡ßﬁÖ≥>Ç’Ô£'s¬Ë±/£¥f∆äô∂y2BñiÍ€ôXÍ±˘KRﬁÊI}XÊ⁄rœ‡”<ºe0Åå»ß±–ﬁπar$©åÄ\Ñ{8ógÑ∑GñEÄÇ⁄(œnàõì¸tˇsﬁ^€Ÿ!ˆËP¡≈µùõÙZ™÷ÔìÚ4R∑ÜÏMz«Ì#¨F#¸s™¯ÔaT|‚2–x«H.\ŒÌ˝≠Ñ√êÛˆ!˝„-b‘Á=èVÎÍ2::Èác6¬‹“jMt´
›ûãF P}£X eﬁó¸å?Ú÷=’•o¡‚zŒò;T„(í‡,·ôÑ„,%T:7D„À¡d‘j∂Ñ„XªVF¿/»
@C.Ç‹5ÁE=´ærâ`DÒ;d›k4`Ÿ_Ò<+2¯xRè+˚ZaæîÜé˘¬ﬂV˚{áxu∫ŸÒÏ—±	“p∂‹ﬂ¸æ5¿Ä?è¬h“3Ω˜j±xÌ]òV/≈`~≈ª,Ù<;fß~òH°≈=Õ—Ï6°ßÅ®¬Õgü˜Ó&Û€·ˇõæ˜QË¡ﬂEX"ÓqÈFüy_?ÍÇ€h˘∞.›pj¥oÈ\=ÛY§‡@VÎ2ùÜÔ‘ëè´—Ì∆€ˆjtVFó*Îıc˜úˆôøi9∆≥8ÚS–PﬂúÅAB¸uÅˇ÷s∂çà!≠“òBNz˘${.láó{]°?08H…U÷x°*Vˆ$Åœ N¿¿9æùh<ï/Üà¨∑@∫&“ „≤0∆™"ä8]‚¥ˆÛ‹Öe]à€	èpb¿G#;XNwJ⁄<O0 'WX°.’ÇA≈]SÂ∂¸¶U™<¨ìÈë Öñπ>Z˚Ad¿£h*ÅÁ"‚§ZHP≈√oîV>L≠∑€Ütπ*√‹9qÊé^:HRf\<aXì(≈ueqÛ ∆
Y^Ÿ\\ΩX’
WWW>iÆ∞:eµÈH  iÉoÕäAŒNìy™s§ô@¶,Ã_Uëmz‚LäqÆLÓ Ú7¢∞†ÖâˆXz|2€‘ÂÙ¬XË)≥7yg˘#˛ƒmz˚¸PŒ‰¥Û'AËToâ<7ü1X@ãäüJZ˝fÖî&D’/›!VY\Ω_–>9ﬂo4ä’sòâí‰]≤“∫Âu|n≤Pã¥◊oSù∂ﬁgXKÂr…kçAUf£!Â†!+’˘˜»?;∑új≠„µ{‹Ú•*‚∫√ ¨vö,?a±ªﬂ™1ı‹£?;]∫ˆufÊÚ∂a&h√ÜKÖ)-¸*™Èõ^Ù∂›‚“>5z∫‰ÇÔ3`≤DW°ﬂufs∑†44a±ﬂ€•œe÷ë	ÚœníMˇ¶€¢è_¢œÛ\÷Ä™KıV/'
5ÉFPÈï∑'Õ~àg”Æ¥vºñ;A™T›Âm02j◊Wçn(Án¡B–ÇugüO¥Ë£˜®)œÄjvD.)l˝‹ÈÓNê5gá⁄Ü¥3™ÈxQÂ‚£Ò†πßdÈTh>4z^”%∫[UøF7$:
Î˝Ó.YÛ•âIƒ:ÉAêìeßÁê*ù£¡¨<ï{eLù¨–•ÜﬂØìe∑›EñYª:tr¨N--”ñ\u©≠›zbNMK`§·Ÿ "é´à<Æn°5&È´bíJ◊LsåÛñ†íIRAnV9S%πIA≥Í4ÌJß#hÀkhÅiiº{Q∑ã∆h-»:'ß„÷íU¿YOiÅ◊S0≥/§n¶µp	óƒ
Eñiz≠‚XFŸaS±,Ø£J†dÀ-·de„Egââ¿3aÎàd„‚’DF£ÇL≠¸ç¬àï$5Z⁄≠'ŒÑãvÑ¿Æ∞?a&F]Áœ¬i%7.Z À  ƒõ˛m?›—≠«òÅºÜõúl®§çm:‘∑¥Õ™◊t´{éY›s#∑∫ÔRª£›Òw:T4±:©ÈqÚ>aÒ/∏D≤wD^Ìõt£Ωb©ÃRÿ„@<)åXs!>UkÛ∂§SŸ“¡a“cÈ◊£™-´Õ0_pû’ÖéÆîÅ“ÕîÓƒH>¡gjó9=>y<≠Ä'ÏtûÒ˛‘Ó‚%Ú2Ó˙æràQ„ïé™ÆÚ.
/.¿;„¯G˛¶?øƒ¿`ˇ^Û§öò¡Ô˚Ωô¬°üy∆G
⁄H'ê)Tè8üŸ√ø®Ç»øﬂûWËV‘Î¯≠ùXoÎ≈Dw∏(π˚›¯1”\Üj-æ£NgàZÿÈ„ë‚úr¥4]Yé“M¬µ;Åÿ⁄çêŸ*wÊ‡Hx‚àV˘‹x5®7pF›®d‚då
õÅ0:º_eybœ˙ˇ   ˇˇÏ}{o‹F∂Áˇ˚)*æI‘¬µﬁÀZŸÜ,…éˆ˙°ëîdÓ1’MusÕ&;d∑eçb Œ‚∆ÃŒdw≤û`3¡z|Øc˚:«`s=¿EÿO‰ÃGÿ:ıbë¨"´ÿ›≤ú∏1„®Ÿd±»:UÁ‘9øÛ;©=]:k∞¨™ $"pÅóZomlØ]Ú∫‡:¬fû€@´^”Î:>ßà[IÏø√—L†IøÂÀ˝o…æP_}ˇ‡£Eƒ¡#°|Ûà≥:~	ò0»N†âNp›A°4wçTÀ'Ù\≤Ë√ª[Y€‹[XòùÍk&u¥å €ÿÖëuè	‹eŸo¨û”Í”o	∞éY@Úk#£7î¨ıGÅh∑k^x£>c¬§1≤µ§o∂í-Sekmõ-¨;ﬂ_@”I√hºÓ{ùùØág∆˜"<lÄL´	⁄√N◊º.a;ºKÕ˛Dzrô#iÈGxf™ãW˚≠\øÁcãDYi∂s‹™ÜßÀl)Élç’b>™fG”œ“Jÿ…∏£™PÌ≤∆VWıŒC§-ç$C…à‰Ö˘gd|eø˛ô“*U‘+”ÇsELÑ\ˇ”æ Dq¶xa‰§2Á¿ Q ∑‘ì›xIÇ‘ÛÔã1º íî[D±ÂÿpQÌü÷7@Ÿä–vó?Jê±(UÛIÊ·3≠Ù(üm∞∫≠y„gfP	~S¨˜∞l‘TÉ ˘Ÿ—°‡Œ˙Ä∆¸$'˜y?‹qèﬁÃæºã∑|ﬁû˜†*ZÒ]‹‰¶€	±ŸF˚√ú”jEÓÓ©c‹rƒ€—Vo,«càV„=uÏ}<kÇ´«†|œ©cAàœw£?”“≤ﬁC%kM;{≠ÊÏÁ¨r€‡>N[±?|ÚπÒkw^7ÕÃ)Aß™ïÜK©uS›≤ëç()ÃU—“Ÿ:π¸sh3ÛeêÊ<ıS£…BKò1Uñ/n4û-Âs	’xGNÓ˙´®?ò*∂H‚¨(‚74∆ú«à»¡ÛdÁY;ÜMﬂE]∑;jN|ÿá”åÜ`Ó,R÷ó¢∏„=Ù˝Éoi Ü¶&}«ºd•4í6ÃêÊœ®6⁄ÍûÛ.}k“VﬂØçPò»Lˇå’≈"I©ƒJvó¢X¢ôìÆÛL5çl˝M“é[ì®HC`_rwGí}sà≈n^úûêR+áù0®Ω0G7h:æ7¨dÅA€∏VÑµyM<ù±ÙKËX™ïd7WÔüÌi»2LcãuJáuÃÀ·Âub.Wô'3}ßÆUÃ‘WÑ∑Ì"Bz‰)A‡Y™‚ÓíŒ‹ï÷ªáL›}N<°∫È)/b¸XD˙U¯ ˇoëT,¯	ÂE-nª œê"≤ä˝[R]b*˜VW6¡Ú©…‰gaRíﬁ5=6cïSk˛M‰’IõÒª≥ŒÃ©¥Ü&©9¿Py¡ÜcA⁄_ÿ∞˘OMê÷’~ã5Ê¥ë®¿ºÖô~kåò/2›—s®$ÆºªRSﬂ¯èXÔ¢∑◊Ö)ü.µ˛$]j˝q¶Ó^!vQ^XVÏX∏ûK◊∆ì…åKw}öö≤ñ± i’ˇéˇ}/K.Öﬂﬂ"¿Æ	ÒPTYwÜøÌ_—í¡Ù·T%¶ g&$^5∏N˚-G,<M˘§…_l˜˘å˚Ä˛jæy¥[˛ÂÍœh|ô◊.l•@.‰˜°7!bôïnmÜΩÆ£tÕ´€'˙ê-[‰À#"ÄL±_äí-—VoßÌuÒç!Õoïöc”#ˆ	/Â⁄Ü[÷…lΩO∆'Å°Ê»ˆÏ^àıòÿ'éÿºtj∆Õ”ó[Äü‡ª}$I¸]Ê9´•_91¥M£NÏ©Ìﬂ¨9˛“n±òΩHö")|+¿ÀäJÈ◊‘tX+zEàÅ˙;mÙ%ˇ¢	îq0i7áIòb—  Ø√ÍzAß◊µzhJÒÔÕ|ÕÒ{Ó)iÖ(ÿ/∏jóg+-'h‚ñjÆ` µYs«iàkú‹÷2óã∏«ZXd‹H>õË≈n`qõhÔèu¢™±⁄ΩÖ˚µ4bÈS üJÚnXÔ≈ãXï˙^‡övÚÒñY˙í∏êÜ”∂ß´ÇO_ < d˙Z^>«ªë◊Æç⁄–òÚè P‹*Ú∂(înµvPåŸöëh	[0 |(≠òÌuv•g≠lO)Y^ôçUÖ ï~$˙TCKSÀåjh˝ºV¢M¸ÜGÓ	`E?≈∆Ë±`[µP´4
Â∫‘_XH±È‚=ŸfQ±Ló.7‚i∑õD*»p=∏#2ûÓ
gG2çs¶#ò6î4≈ı6c6tpÁ‡+Ω∏†!Ï<‚∞á”»’ „˘z‚Rë[¯ëúGÇ∆PÓ¢èPçrﬁpí°ÌV/∏[Ì~îÁI±ÅSÃƒgF1wcwÚﬁ≥Aö˝[Ó˜_≠`#dÕ∑–l}íW® πI5æ|<Ê≈S¡,&ZN!,nÚËŒnôÄŸÒêzÀŒÿxÀ4:ÛÍç±`‡Bt}ù˙kæ†“úê€"l/º◊`g™u4:ú˝E
î¬ ù‚òΩg[˝F≈{ø/ﬁ;”#6î°#<ÉËÕ z,ôø"}Iç6}Í}&?ÕØ˘Y_
‘Œ·u˝ò£SËˇ◊AÙïªºÔ—#Ne˜)˘„SûÒÃB¶	z8óâÃ=º,;ÌñÿH˝3Ó£e
;›„»k\∑dg‚Ó+ÉÉp4·{Yor3Ñ∏?√™ãRòªçÀ0íjUÕªÉ+:S‡7≥÷öî0f…mÑ–πG Z?Üı≈à◊h>ªÿgËçä6¬l’∂e;2‡ã=ëÌy•'"≤™ïΩ¯«Ü√»÷t¶Æ"Ê˛>¡
»z{’Å,ÍÃÈ«˘ÜÏΩ)ìlY£8uê—ä0n“yZcœ¸Jt;ñ~5S⁄ö·ÿ◊Xïí!‡˚SÉó‹DmÇô2àYTo“öoÂï¢ 
iY%ÿq\ŸÁP@ÈÖuÚ+ÆÔa•ˆö–f$ÖÑﬂ@µÂøGÁÒLs)óS∑–Ω¨ªaxŸA¶LV˛:çÇ„"KI Ìk∞Ã:0ØÖÈ…õ0a⁄•ÑGÂ;¯!P°ƒèeØ~D(©ï∂éé¿fÖÇ√X;IêglÊ°ÿ£•*É∞}\*!õV`ª@ÄC[QS]¿4|«Nüw€^‡!X¬Ä˜Qjœ.ÙI©Ìx€¯¢Ë¢«N”çÈÊ´7´læ™P„Znª
©a˘Ñ¥‹ı‡ßè›†¡8\G rhª©(®r—ˆE°£zoaÓç_ñ†’Äy’√ƒzzr“Æß√"g=ÄÇ≤Ü;òù<pKç2±3{-£˛U"˛<⁄OóÄu∏ü˘+V∆¯•ñ™G˜√‡‹}†®M[©ŸE¯÷xm°ìy‘%±Q‰«¨.¶u£> \ßTZk/ßó_X}OÑU]õŸ¬túÃ˜E÷ãø®|O:J#∂—J‹¿zÃöÿny¡’J|‡§ùmØÌÜ∏’ê Eoœ⁄%T°:6˝H√„xbpÆ‰ÈsëÉcØê1ºqå‚ü"%dVFK˛^¸ΩàR•∆p,©êÑuHTá\Ù ©e†@§‚§œ…a∫óπU’\ﬁXß€[ŸÈ˛}}ñ¬#"¥üí;åvz w∆ùFc(‹∏ß˛+ﬁ ÛC«ª˘ªÓeøo,s«ﬁEÓzæÔ6»ÉFÓ•8”@3Ì’CÈÁßdKüÓ.Ÿ≥uÔä5^¬v.j&”Æ„«∂≥È∆qÑ7=vÃN∆ÁZ R®,]ùo®∞±XV
û–à0ÉŒ¸ûF˝Òt5Ws=<6ï πC∫q¥P\Ê˘¥ñË≠>ê[µ•R¿ˆH¶Å*·√W¡}*‡¡®ﬂ>ïÔ UoE≈;Xµk§c·tu‰ZRl~D◊±l ˚S·§JË©∏È˚}æZ~´éP^ÁOE‚a≤l
ÏDçˇ¿s%≈ûÙ/7ß—ﬁˇM‹‚˜«0˜1‹ßî+ÒHÔÔ·r{Y¡XÑz¥Vé
o†º†•>mS`ì“˙àåË©à{ﬁÜ¬ìeÓ»Óªù2g8îx§DPúÿâ1∫‡a›3F∏r—˙6⁄
ÌFiπGùo÷é· Óˆn–]¢Ï^⁄3Ê≥£‰!Ü;COÒ–—Ü+g¸˚q{1Wÿ¬⁄Íö8©M∂:…ÿ˜vCKí>-G∞ò°xGM‹’N˘,3f"ATvH!aÙ&Z«ñK‘#Ói=;£B°Ö±â∏ÎD]‚Zö1X¯i+€|`ÒÖ¡ÙÓÇÎD^πÌº-ôãkBèÛZ®«Y-Æ≠ﬁŒ∂≥c≥º#´÷≈Àx?πÍvœ∑Ì_re“9õ^ûi¨å$â\<G†Rﬂñx†÷"S!ˇ≈ﬂÁeìù…§úKä	i
H∫î…ºc≥¥Ó¯ÄõôZ\v…k7ç«!éÍbë´C◊€ÿ¢5∑ ø+Æß≈¢™{ºÏ˘O∏Œå1“ù¡Ô˚2´â≥á~Ø»^ÄÆ1íIIÏëâiÉ™9!^MΩÓ˛Xzå˘QB ëå≤El1_:å∞ÿ§,'œ˜4◊‚ÈáÇÊ…æSV(1áÉ=üÖ5–=í[ÏEN«ÊÌ™XWÚπ±ú+¬æùòöÎá±àœúßa3Èlb…m∫ıñÿä‹¨Í€jªØ◊.#‰î|EÛä¯ù} kÍaÌUÏﬁÍ0 t@5{X>©¥˙Ô[•#Ÿ∞»ÿ>√¥g*iú˛j© º77¸XÙöà◊QdvxÜîS[¡b€ŸJäxi¢5[-uƒú¥2µ $e'-ˆÈ˙DEÜÕ∫X•÷Ω_{=±O±D‚ößY∫˜[ºD’é°=Ø€BÓu®tπÙ‹¢C%W‹wII36<Äñí!O3xYxñOM}çA`tµÍ^ `LQp9ô9ºF⁄ç7êí'Èê`b{Iª„#E±Wµ‡ùKÍfK=7!Y“∫·XÑv£∞-Îè0¬|5<E%º‹xZîª41¥›∏LÎSú%⁄xQÑ,Rπ,dè>D<Ó9«,:Ë{‰W=€.˘π¨‰SﬂÆt‚ì˘¢ØÇæ4UÚÃ˙h0•à,zâ©(AwT{‰Ã‘u'∏ÊåÃg”?9@”k∂@.∏í∏eël2⁄≈!ÈïÎ—∂Ê-‡˛&—Dr»Æ©ƒfKz#Umj3î^P˙∞]ìd+*Z"ﬂlhH/â|≥kÄØ‰¢~¿vƒ⁄ﬂ≈ñ‰|)Y_≈∏•∞k∂v?€§|–Æ9:/È•ÎXY^_D5M?YµÔøGS’o¡&“…
æEî¬C4Ç€¨ïﬂu‘Ó∂R
 ¢Xá*µ¿˙¸∑;ø}ú”lúﬁÖ¶õ&xd~è∑ÇD€¢2Ëí∂É˜≥≤cò1éù¢i[§‡Lö@≥Øê∑LäaRì ∂`,‹>˙W‚îúû,®õIEó≈!NŒ8ˆ CGsUÈ6<úR°ÓÅﬁÇ©V⁄¿÷åö^,44V‘ããæ2ãxØÃ"”^ôEÊÖY4´'[‚3NG˜TƒU4R®ôÔ˚æ≥”ã˚µt>˚B ˛®°ˆXÿ;üe…¢ÜeÊ”Dºt^†}A<rRÊ¯	≥TªåÀ∂¢icY\Áô:Î¡n®Ò˜V∞o¥¶≈·ò73ã≈ﬁÆ∂ËÎúàÎ-∑—Û›∆®±’#B+1d[—}X¬Ù´XL§ˆ·{*{ërhï]Mï¨™A€U≥¨`[‘∫®}5k 6÷ ¨¨ÅŸYC≥¥nk¬⁄“{ôt´¥•Öî5¥§ ´UJ‹J_eıIÜ˙Çóœ¥§{ÒI~ÈÍv9[+rS$T®f%KéÕ”+[oÑˇöòWpd6áá£Y£éwÃº ÎàÇg	å/§6Íep®ñÅTœ¥JŸ0·
Çèd?Õ.Ñ¡à¬V¯b≥∑†¯¬âNüÇ¶^ôRŸªÎM©∫·ÕÜ–£WU∫°Wï˘ÁïEeˆ9ãj@]U€Ye´yUÔV÷ÏJ≠K˝⁄]ü~b†áíûˇ»åØN/¬Ç €_ÏH÷cáıVòtBbà±Éy[å˝ê5«ÿ·C±»J∆|fŸÚû5Ÿ,3i“Wft⁄hπ!®…J-Ωˇ¯ÆÁ„ÅÆ’Mç$0éÿΩË=Œë(œS4±‡4G8£™'Ü‚ÿâ&∑bâUﬁÉ£}ﬂÑ8ª§ˆ©ª–§Yv	  OøQ^öÆ“ºñz∞-lÉ÷[™√
ût
)/Ñ{nÏAfåÏÓf[Ö:5%”w¡VS›«=âkå¢?4l(1µ—±îÙ¥b≤nåé˚n–Ï∂àLÓ∞ÚÙÆtïgëçÅUXïì…ÌH^5ı)í!õ
ÓÃ(Ç;†€◊	ó£·˙Æ»—’|Qa˙ßiyﬁ,MRf§ÃIm+∆≥EXS1LÚY†Y^ïØyQ‘Ö†l+,fÛò˜Ûû\R„&˝ÚœÑËãQ==$t…7O(òKÊx∫hÈßØÓô>§≈æø‚Óoo∑ÚÀîªO∂™j#éÔõ6bhFÍ8KìuU{Ú÷ùdö*Ç¨vŸﬂfíN0üÚÿb™4ÿM3∆sÕÃ¶*!)kc©`ÒQ∂≠i±»¥øﬁ;ÎkÔËÎ‚?¢Àõ´kõ[P‰ˆQ"]&ºøÀ√µ4ÂÂ„ÔÔˇÒ≤=™Z™<çáÄEã]Äd˝ãx©ò©b È)π∞–kc{ånâ„Rbr3V‰^Dv◊i∏Îe91ﬁò=∑ÓY√íE÷ìP"Çp±ÃJú)Ê ûäñ\◊¿eküÚf ékûèòfç®ìZU é)æ“•`f∆≈V+Ït‰¨”T?Åcé“od≥·lQ°R—
±„•˛åÁäYi
ü0M32◊¶∂˛ÛJ∫Ù&+Msﬁk÷ÇûÔ™K|Â;ûªw1l∏µëùﬁ>Ÿ?_∫,≠=µë¶◊å-.Ê=^¡R◊£˝⁄»≤πöáÎ[·ﬁñsÕm\¸}+J4rs∞MÎúπÅÇØªú¨ƒ5æ
^M6Ω¸ùAº¡∆∞W’F⁄I Úê‡•G y3iœ9◊¡£±÷P7Ï,¢…„h«m9◊<pÕè¿∆Œ	∫#ÜNA#€Lül*˘Ër	,êÙz§Ω®åHIë¯k,‹›^òÈÑ
àË(™>ÇêPèî>õÕ≤ñ⁄hk)g+Ï°>˘ù˘Rgf—ô-â†∑∫N∑s›œí/Qm´yı.ö¢zsvl%Ù{Ì ùèºÕOè{tâ|£zËáQlÕÍ¿&4ˇ`€«è±≤…™@fT⁄—l“z<=:ΩºñøœJØõ‚)Hz˛"≠ÔKÎ93‚ﬂ€à◊‹fñÜbc0Ë."ºâ:€€w#≤Ñ≈‹∑Çñ	«ΩxÉtˆÚÓ.ª?ƒá∫¢ƒM€)a˚}ßÈı˝˜…™7BœâÈêì≥)ı˚N?5«◊üB~yˇ‰˙æ≠7ÿâ¸≠@–»ncDı3øô{Ω„F›Ó≠1{!‘d^·°e%$?øHÃƒdâ1|Â^†ªá6*!«Táô…|ËBlT≥?ú$µÉ{K<jT√–æ
Í´‰mÿ4µŒû>ı‡”¥®`ˆ·'”O~Rı‰¯R£€ﬂ09…b˛z¡˚‹πm=wø ≥ñÓp¢ ”IÓ_ü3`«ÔY˛…$È'ﬂeŸ'“íO•‰û…K=mÏË»<ÈOF‚y•ß=ô⁄(Îë{o¨%ù˙ïÏ¢‡$ùıÆO9w⁄;nîÕ≈¨†Û[àÅßdQßG“≤Nè•Ñù K;kËà;ÌPFﬁE/Âg>©xÊ%ÚI4”V‰¨6C|)‚⁄ü‡+ÎrVK™Ør·//úöÀùŒO——ôºKôi ı4˝¸'ïœ?¿…¿ àÔ;íh∏ŸãÈ+Bß–éêQ∫∑ì¬Ùª„^c‡1g;p*°Êﬁ5dÂÜOæöÎYÂ÷†Q‰ƒ»	ˆ+Tw=∏“a¸h◊˘ÿ2’Ö˙§àQ‚ó0Àë„[[∏GŒëımXpè≤4À—"å∫<Ôõ4≠äWùïLê	by À¥-iú\ÜáöéqÜ	ïÚr©ôc)/Ól
¿ô$I´⁄ç©¡í82X©U ∏QÛ"Ü§îª„DıôÛQV…w,?◊˙1Ä⁄
•^3pòëÖGÆ™PËˆ:0©SCóù}Êã+\¬s˛©‚«>Û„ˆ ?¸b·ã|Ç›À+ªõ©Å®ÓñÚr!°m∫&/©˚î¨BÎFFRä•ÿ ‹p[∂+dõ©ÅR<€ôæ h·xùE´˙má
#(ë~[Ú-_^¸noîàH ¢ZÆ4≤e:f} Í™UM_êj£’©’áº9§é·Â†ufëÔ•÷L_ê∫ô§ˇ´óóÎZ3&]-÷Õ“æ|J+m*`Kˇ&#ÈûBõR˘DÌC<§U<Qr&»•íS8_Ã§^…!ËÅœ)óÕ15….KπÈ>êo©>ﬂ†÷^¶aµOk\˘ªRÁ¬	
Ìm∞q‰ùÿtÎ.6^g˜◊à¢¶ÍBÎW›5q™~M<,∆Ω‚w€p#XàXóﬂ§¶ø6¿ù±X‘Õ3Ë§Êå‰Aœ†˘9|ŒÙúIË›Ù…Íÿ•¶ Ÿﬂπ¯∆&&∏˛iÕÃ}(Oóaâ-obÜîaIéÄ£FÂXöö4ºM—;∑Ì®p$≥nÚÔr'«o]Én€Is·}d_Â.ä(åEG©^;èÙ√∂2∞Ö=taL—6NLe<wÈ|∞ƒ≥™î·CïM)¿!zMèÃ+ÔI
[JúYTõâòN…¡±˘|pLÍ∞$⁄Ç€oC6*˘Ê
Ó›0∫zŒãbÆFBÿ?oãùÛ˛˘˝]¯]h/˘Ækº∆xΩÂD+a√]Ó÷∞˛öf∆xπzêª≤¬gÀŸ˝-¢⁄’
w@
ïﬂôÏ`7]ﬂ≈ò∆r–ΩP‹]nﬂqwªÖg%nÃ¢÷/!"(êpS¸3˚Lùz©¿Íw‘ﬁ˛˛˛«„„„∆y¡ç∞{∂ô	˚_ø0,‹@z}3nˆCãƒ`z≈N7»ı8	·C'ùôYÁˆqÑ⁄qÛ,ôûâ‚ ƒ¬*< ìÅ™o˘ÜZR™§§ùÄá!ÑItø¢
ÂR]ì∏ΩBâé`&]»‚”∞ô~3ÉN(‘‹ïÖ’v4˙V9ix»¬Z=.üíWn[TWﬁÇ¬Ä±VÇkØ ≠¬ÑJc§NLV≈#ÓÅ3Çj96r:d9¸g‘PÌÁn´≠∏Ä
oYuâ¥o¢?˘Kêô¥«ÖÅI`RX.ù´[Y‡lﬂëôƒk%ûvÚn9ÍD[fA2ÖÖúã£ô‚¨q}£m≠¢]±”Œ¶…Mb˜XoJ‡ßÿ·Vœ‚Æ€ç‡óπAw´Îvn”Ä3k~ËÒÉäÉ£[z[0ecSñç—°R65m’îxˇ ∂fåÁN◊kªêŒWÉL•{§óıTÑa‰8ÚpÀãh≈ÎWÒâ:å8Õ»∆})ö%ıü≠[Õ‡qY[ow¸–i‡éˆˆM*Ì*˛Ï-∑~ï˚ò6B•Y,uõÆs.¬ˇ!ÇıF¸ıv¸¬tˆˆ∏z∞'∏%÷‰Óub©“ﬂ/bôwö.=í®!x∏ãEŒ’ú∂(K9>mI-zg–>49jÏÅ!jç4ﬁ˜‹›&K8«†À«QÓmcQ∆ÀPªc¢9,0x∆e	¯ééÖ-„¬¡ïÚÔ‚ÃÌÈÎ13+ÿÅv#[1ïø.B∫ÇV~Ã«≠≠§%»Ò§éiÃ¶=Üik“7Èsv∂EIAVËf‚ŒtRÜõ']L∂ëñ‰Û£BÖ”7”C)˝#È†ÿ>XÙœ8¥¡oíx~Ã,F#hùyuG XòZDÃSãﬂÏÆÁª®v¡›Ìé¢¿l}Ω…ì3œB8’6Ωf´kŒ;;<*”ˆ)ãÖN⁄‘Çœ∂πx)ËlÍ /yÌ¶≈È≈QùÆí4Læ|ÕÈ:7“Ív;Ò‚ƒÑ¸®1÷/q˜≤,ñùVÿ«¶ÊffÁ¶NÃNù81767sÚ‰¨3≤·∏;g Prj7å⁄N˜Õ]Ø{™Öù7˜Nay}ÛÉSì#6Ôr¸Æ‹IxQ§ãú,Ê≥vÏZMÅaPˇ?]hw`cÑ$6É–ëI!¯zoNÜh\|ñ~r`bg'˝VNc;a∑∂	∞w,ÇC˛‹#j§EïI∫æ[ÍŸ√LÛ?dç'Ø''Më?º√Ê5ë…Èô`?áå	G¨⁄‘óŒ§Ô´`MÈÃ	∆◊i_Oû~‘íOçÚøê˚õ¸_‡ﬁ˙Ñ⁄Ïñì¡çŒÆIY÷E%≈ÖÛØ˛~∆1«}¨KÓ—n[âö∂^¯IÄ¿ÛQeà¯¥WJË≤ô‚„ôÜ∆∑…¥„Ã:Ü~¯Ë_Ë®s,'Ûw›¥Í^s˝∞”∆2m5¿∂√kı^ÕK_ì≥USï‘≠¨á>õ≥n–‡$ˆZP3ƒRöC;¬+«{799?Ó‹/¿PØ_ÖÌ¬íj5ñ«v„±Ô’›⁄ÿ¸Ëx7|ª”·»WÛ1≥±ÃSìƒèÈÇ¥ï»K2NıùfµÕ ±ﬂú¿Á≈‡\ÿß“^%Èı·°\R˝µﬁ∫$=>åãËÌ·A]å;Ü˜>˝®íÉ+{$”™E˛MÕ8´Èíö0˘I0íÕ¨∏	&ºIB…9|‰ëŒùõ1Xtøπ
6ÌÈÉÃÉ™˝xπÁÕxøøˇ‡˚Ig èõÂπ@≈·ØÀ¥<€u⁄BØ⁄hUæ”û^DM∏ˆÒ∂z€i∆ï∑—‹-en8´¿ˇfnW≈AØâv"◊π:∂áÁvl°êâ6&Y5Ãj&î¢å£Ë© %I¨‘ÊsŒÖyáÉÇ£‚∆Ÿ#"ù∑∏hﬁAµwÒ6H<¬ÿ3LM†Ájm%íA´dT‘j˜~L(ï-—nX—Í÷ú≈ë„Œú◊¨Î¯+”lêuø∆ŸèÊ}6\ √èˆWù}íV0sœö˚d]¶©-O≈,z∆◊lV3Ù[¬¯mÁﬁï•U+@Æ/á}hgLÀÜ}ö”ñv’Å&*¸BF|+	@"( ‡áf:˝K•∫óí?Á⁄h…á6∑á¨–g—4Á#<€k4›.:^GµãPœ	`Ã±æ‚{êÁô⁄’ùÊÜ¬iÊ”ÜˇìËñÆbÛúb≠Ç Hzj8qÀmÌVé˘æ]'3Óû9≈‚™r…û´µ≥ê1ìH8µMÜ∑Fö˘K¡ùeÁ4]:ÎWÉõoE˛¿bV’hÏ≠%NüƒdháZè2Á> A|ßM"ÚXCN·…19JÚ°°ﬁ7pèÕ⁄»N0vvuƒ¬?t§}z‰ÌEñﬁ≥#59oeM}¢PH°*∂È§{–;Cµdå£öâ√‘~∆nµ<◊o_~·§≠ÃÑ.Ód7A37ÌcÊ˝OY&7¸˚%“˙FÚñu÷”#Ò‡VÓ9º≈©V6…Ï"ÇzW<`øÕ0k‡k`ésb£TµB™ôs˙‚:åD{á‹C89,‚6ˆxŸÕûÏÀßR^˜>`:n¬µ`#∑Hh¥LTYN_ÏÔpáÃ©P…√°N €=dbEDU®—°¶<;⁄Îi∞› ïE Ûƒ{!sÕ&Œypx€˙±Uc
#⁄◊::◊Ë§Äm¿rJı2¢œ`w8ÆW√≥a±õ.Ód√≤*‚Ü:dO´h‘Ÿ±gõ(ênÿ¡í6íÊªª›±YD° P“d*Y6ßs.%X~9ñÖÿ=L±òÙc÷y÷ÈDÒgªòR6zëCæ¿bf—ù∏ªÔ„ô}ÄˆºF∑µàÆº~Ä∑’≠Ò∂sΩ6{’rHÓ	4É7◊haaÙ∆Wl ¡NãùAŸ !FøƒSﬂŒcóÇóS÷ïˇyyçÎ÷e–Ù* NA#h)á∑©≈+%4–VX´ê«0àv…≈¯ORÆ“Ìå>‹ÑËA˙X±Ö&2™ëåüÁF¸Å◊Ià§¨AC9AÇË$ËÈLd≤î»SRkíc∂Vf&ZÜ9Èá OÖπ+UIúÍŸ9K˘g1≈>:®Cí´A”yê!∏qÚq(S=r’«≥à¬Ké‡IXıà;ˇXZ,¸s¿÷û3ä¶¥a∫Qx’{oÜÿ£¯ëóƒ*ê:[@&·4;Ï|¨ÅhÏ≤úùIÖb!eFûLcs`ãüFù	,÷]c{ï0Ùì¨ºg≤‰
27ôÏ’ÀŸõ™rm”≤êMÚ<4!+=•‹≠0™ˆ®»J≤`W≤ﬁ
F64ßò»so†7p¸Ó>ﬁ˛œºÅ7˛A/Fó¬ÆWwQÌRàhJÏq˛ßnÅËW8@ÏÕÙïµ“ÃﬁÀHU-CöÎ§AΩÀóz'A>Îù¯?9ù¢=õ|?Åºï√á∑ÁlÎF∂„˜®?LÀ¯í‚jh·ÔÑcıçÂ…’äoìC˛Ìzuœq&E~)Ω…}9Ò)˝ë¬†oΩÃ^µπEºÿaê‘%c…|xf≠∫]«Ûctˆãa√Òôì´≈Ÿ±1√#@BèH·!Ä∑KÏÅÃß|∆Qkne´6Ÿ˚Çﬂ 'Nyà˘¨/Q*˝êı& µ"RqÛ hz—ê\‹ÈÂ"]íŸîhøR≤ê1~ø"–ó´H∑Ñ–
uœM≥˛¬°Zˆ|Õ‚-§—™J|lã∞ÚOæ`ƒÜ≥œh »:AÏ∑™çı#§S…÷Z1ì√ÃîY6NwAÕ€”xJçu√±ÌFa;%ı¯hñ˜+uN“+|f3r› ì·bßµ[#ÙıBWV$&ÜÄ4^•™;9ø¥qÂõ⁄x∆¨ÜæÔD[^3–,D’|–9(—cjk÷ËGWƒJÕ≥∞_6@(ùP¡Om^˛>∞ÚKılˆAµY!_¥ˆr(Í è%O‡g)T9ê&ï À·î
Çc£ØäπΩ•ÿk‹∂d∂ö≈ÆÃR∑U”lïäå”÷ÅõG≠π◊†ç⁄¬É ﬂé#Œ—A©ˆÜ⁄jˇv‹`•Âtﬂ%®kñJ∞±àÆ‘Ò’c‘Ä|ùsT\1%Öbù†œG9nΩÜ›≈±Ö£a÷,JÈ©ºjVÿ˜)√Úí≈ÚãÔ¸wímAëóÛX…w›}®GFoY©ö§.˜ú±kÀ∞ t|6†êÈs˛Ï4‘å∑∫7EN-=ﬂ&èˇÑhK3“_£W?°vÏ'|=x™ﬂ6ˇ›Îπ¬®vÏı$ó·∆±Q
q}JwÀ∞Ú©Å âüì[∞ø≈>˘0í_›ªbÂh2ü·0cee»¥z»÷RbeÌ¶
%◊˘áÏ©c˘·éÜE£ø}ô@ÏM€∑P9l>l}–s¢b'yZªx1€Ì•û∆V)»ÑIß—$zÛM´pú*cä";à–Eaú+4,9Â%YK“(k¡{S≥¬◊ß®úfã[ìuòË2„Ωab…Zò‹yıròÿ|xÔ˜ÒàÇuﬁr-KW~i£¥BŒƒ⁄Fé§˘OèÃ“&‹ ï◊8ãebmX+œc≤n>Áµzæ„Œ=[,ëÕéŒÿå7<±T+óàJÔSp‡’µ^–ÆÚÕ˘πsÁÂe§wC∞ù[gmsslk˚/¨°ãóW◊6/°só/oØmfñ$U‹IÂª¶E∫¯Ù,ŸQœJıºËlwÉ¶Ô≈≠åÆ(M÷i7ìØsdBœÁÙMˆ≈jÚ}UƒXK≠ŸîÂfÃ{C_ƒ±”+4˜“s„•â÷¨‚=_ô{,vÛ$é¶T°Kæw˙<^ãZ^=&·(Ò¥4ÅèjN^ıö^◊Ò—E‹Y∑ã˚¢ìﬂç<8ÖúxRº¬]é◊pC|˙2…Ø/9˘b/ˆÍprØ·ÖE'WÑ”n≥Æ∏ıV—ŸÀÎhÀçÆ·D¨>mi¢Ágè™Wá*%ÁBûÕ61y+‹C€kóº.◊†ÊÂ–sWHQP¨∑∫LnıÁ˛¨Á¯^wùÔ·¡/FzÛÂ ﬁs£óolŒEÆÎ;AùÙ}„s÷≠„Wé>H…˝ä^*ø*@À§Çk·®ÜÌv/Ä±z´∑St"~‹^˚•†≥x-	¿[πËZºgåÿ–‡©dΩ"Lù o(!√ûØHEW±"z[a/™”◊“KV{¬ˆ*⁄¬∂ÍÀ5°*&ÿ  -ÔÑΩ.õEEoÔ-◊Ô ˝fØ”	£¬3∑#º¬©ŒÆ€-úbëwÕ©Ô£ço≠
œ‹v£vå¬›‚q6>Â±º97omÕ•Q∫x˜E˛é∞.…Ê˘‰ê≥Ö£eH,™æ¨√T¸éùÊB°ﬁÚ–Ω“ˇ˚7æS©É˜†.∫–må£È…Èyı≈JÉﬁÏg”†Ú´#x\:Ôá;∫Ì#ÅÄÆQ˚∫¯Òøgtvu€¯1u˚ëˇ§<v'ÏOûY?ˇ÷ˆŸÀ?ám…Úº+ŸDÁﬁæpm≠lÆ≠]BÎóœØ°çÕµw÷◊ﬁï6+>‰yÏÑ◊◊€&$˚¡2©y'«˘⁄Z–Û˝‘∂K~’ﬁu∑Åº _46ôƒ)swÍWQÿÅÙ£hÃo¢_¨¶‘ﬂ ûÒQp6™]ß·ÆKú‘[’Â‘P‡ÎÏuü¸’{oa·Z+;›‘%Îwìy?	+$≥LM≤ÙõîáA“ÄZwçh∑”Œóúú˛<=ÊÒ,ò'sÄxBh‹‡A*∫ùjïõC¡1LXÑS“ò}_@·{å¿◊¿ªñı…ÏØ	Çôè‰4…ﬂ∫`Ê≈zﬂﬁ<•mN›qB1Sï_7Ã”µ’ım</ü[ß.<W•ŸË≈kØÀ(Æ)¯¶ÉBnZŒ≠Ÿπ’nœ-AGü"ôœL∞¢yU ØLS`C4√f!aΩgcI∏Ò°OIæÌLôô$QaãÊ212ìj◊«øÏì
Êg˚∫r‹j§Æê—ºáiü$›Q,•y^EéñYª,ÿMv»§õÕ9I5¸¬öÌâ˜πåwSã-Õ€=Œ.nd!ÉÂ¸ög"xÔ˚˚_âà(S™;*mNÈÿRá‹D∂zı:ÖdcL˘ºıô€6î1VIYÖ Ÿu/Eå2´<w"ñº|Ö’Ù√óü°Çïz7zîÂkÂ÷è
±¥ÙÔx∫mıv⁄^˜‘AÀ	æ˚vßÅÖ^º\¯ÈÜrª≈w9◊U|v<ÖK$˚£‘T÷‰«S:ëcß9T˝…"ﬁ£@É [yAßßF7“Ë¥≠éò\s¸û{Jñ=Ë´⁄’˛$h‚”k._∆÷“÷‹ÒÆ5›Ó8iX„≥OM@∂POP-ú‘,hs¡r2ûvâ´∂'äé*"=:å˝ãÅÂ¯öLõoπ∞<ì	ËîzvhÚC(@+	πÚï¶=f†ù˚ˇI5µ≥^8Z((–éπérP¢p/>u0≠±º†‡õU|›+!9L!°ÅÎ€õ¸’∂Æzæã  ◊zøJ“B/˝…
åÃB!&∂êÍ&äw±œA$Uri‹›_eù“>DﬁFÊª®∫≥ì‚æ˛§w;–◊®FX,MÄYô±>S—{„›¸ ÂãÀ+xCy„ÌR§j˘ùµUt~˝¸zΩªæı÷Öı≠mÙ≥∑◊W˛m≠moØ_¬ø§6¸[Œ5∑qﬁk∆[nBƒÒ ∂˝s/ˇ∂ÔÂmˇ!Ì˜…ò˙a¨µõ;Ù„jÈ œ3u¿_U\íÁ0ÛÊ§_ÿ˚´‡Eêêßè‡Ω0boπ¨⁄π±2ãã¿Kç∆NîÜU≤æ(ü‹I∫Ñ|áI8«ÜÅùê’-‰p6XD/¶Tt•sµ „e	øëHÈ!)‹¢K©™¸$&±}≠-„¥aµ¡cÊO™\-ãx.˛¿ˆæ ãª«±˚î©Û;°nÓêC„Ø™ﬁj(˘ïPa9NÿX¶s|.jÊúŸñ˙·b∂¸¨7‚qØ‚›ñ=ß	`©QuKù‹à‰]i»Uï%,®t≥˚LÇU2O·£˘˚Ñ$‡3Dˇ‰CÒ5#æ]¶kc[ïLágäÁÎò‰rÎÕ‘8⁄
Ò¸∫‹!¯à“ÖGªSPŒO¢4ieê0dΩVQÁ∑2©ÑzB©ˆ”ì™eIWoi3Ï‚´VÍ{*é	É‰:Ó•˝úÛÁ
ô†ñ´ﬁÇ˜20.g˜GuAWÂ«àƒ|™–õx†*≥}@2µF"ﬁ‘»qQk˙ownˇé>≠¥˝òP—c!˛wösì?”Ωu±i÷p'ÚÍÓ˚N\Oµ˝ªˇKÁ¡ƒâ.û ¡o“`√Õ∂¯[D…1»4˚´}ª@Æ4•6¯”ˇÀ*„ﬂx*Ø± Ê~AËÊ¬Nó§‚©V≥∞?-Â‹ÈjK9ó#ˇÛV^b„a±´—÷ëcsyøtSzp•ì*Úƒ7ë@a(ªÔµ^Œü&Mem2},wîp·—ŒjN-⁄b9uYâ”¬h…„˚÷Lø∞•Óö∫>±Fè¬{“2?È1¸£ Ùú~ôG+º»Ã9œÔÿ∂?Q√ﬁN˙ÖÆµﬂê%ç:⁄?ß9àõœ8ó${Ù•Z2’ótV§NﬂóVRF-~ˇYÒ
å7íπÂ?œ#i·ÖÔ∑í√«ß:ró2~Â‚∂ÚPÙTcüqG6î‘b∂Ì„Ì‚vs∞¸T≥,uñ˘@À4éhTB¬ßö˚î(@µˆ£Í
o@*´+|Ì‡’_YË‘©—{òh+yµﬂLeîYh≠bMïÓ#ÂnuéêæF5I+≠o„∞µ“Ã8⁄ ˚≠FamáÕ¶üß≤V1ÒÁH≥ QÅõÑ£i’‡WùUìñ)ãì*7çÂîïr√w=Î˙æVπ	*#Mcéã.Àœi55zË[Yˇô˚◊üí/â>|&≠óJÏãFà»aÖ∑¿∞ã∆Ypó˘â Ø‰“*©GH(·)≥£,q<¢Àäﬁ˝Ç^ºVî»[2ó}7Í&º$Í≈îV¯≈¢SË58WùíŸ≈f¶n9ˆ°¬§.9Mw¸⁄Xrk#ùÆx›˜…Z˝>€ÖíaÂ»™¡muî(7`5Ø∑–ÅZÎ0~lhAuΩäQB¡ë¶≠>ôß≠ñàßÎP!NÇù%óïZ+VåLV•+„Œ‰úˆJ≠ê◊∂0‡wp%M ıMXÚ·ÓNΩ°•D˛$`,ç‚÷ΩÑ.Àvt«ÆèÕR_ÈàR™°¬3≠ÑkT◊Ï8˙Yœ1∆&iÁ±Î®™!m™Î'£∑ãjÅsÕk:x:é◊}Ø≥íZ}∫π´8y|/¬#ªçgVmè0ç√áw2ﬁä‹]›|U9[îﬁı‚ñÔ≈›ï∞„πç∞!i⁄¡W@•ü∞◊≠•m“L4>vMCô3Â¿ê#◊1ªïI
∆IªÆ-X§éÛâÄ}∆P ?ë∂^u¶Iﬁ®)6ÂÕ!¿!ac‘egçbsÁáF√≠π§∂üïTÔ∂ºoöZs	ññBgüÒ®—mÍñ}Dix¨û:bIqwπüÓi∑ZNT¬Œj¯∏ß-ÇföO¢¬ñùﬂ∫hàd±/=…O¶Fø√6‚óÉEõ≠¥ÿ€ı"l=I¥’ÏÖ0~⁄{‹∆ÔÌñ6>˘ú:Dí®à‚›≈È¿Ò”M*gàÉKüëõ›ñÚ√3#£zE"ôü¿Ü˜ﬁ/¥‹E¶d∆òå‹6^•ˆd[#⁄;îÿé»|aÆËî§dÍ%úíéeù#"⁄û&ÈôÀÆ’903iÌU1‰Ê±Å Ã*
!)ÁÍv‰ƒ≠ÏÍkK…æî˘-S¢L]±Dî‹ªπÚ%CÁÚ»,:˚êî°∞B¸-ÉFIàΩA„ı‡†≤Wå⁄QºD5xï£ôóûõ™ªÈEtysum–uõóˇÀ⁄ ˆV!∫épΩÇ÷˝∏†uöA}Ö´K_˝R„Íí0ÓTÆvpZç•™YıÖö€Ú=¨∑¬»˚%‰˚&ÔØî‹Pqnƒ1J˝∑wÖBïS˙rWJ¡nj®€∞aäû+‚±¥£«À›ªü‡
ÉÖ·ÈsèæÖ_‘YE«oL’—6∂–÷ûfÎ´8æ2éøÅõ˛â˛˘¢u’i≠†øJË™Ô»>['t<úùÅ‚√f‰:…ZFÀê˛cÇ´∫Id˝◊≈¡i2¨q
±ıŸ}≈Ù)n•bU‰¶õ˘Ìg‘&ˇ5oÈyA§ªÎÏTét„kÈæ|¢ıÓﬁz∏ÔΩÅ6+Ò»•äX‚≤ò‹k£›a¶ü$‘M˚™›EøL–¨Ñ∫·mº  ±1y5™W ¨°É∞∫˛π‰ñ—YœáÄÀRC~e?åÂíﬁÈÌ‡5È˝%∞K/´_|îµ<»*˚ﬂ®Ií≤ãl/Ä÷Ie⁄ıÈü≥•E¨Un9"´RΩ˛_øA‹⁄bäV8?°Ó≈2√™≤…Ω%.rï#¡∞œTıƒ’1VÒ`!Vg{˚nD÷∫t0îU‹'2ÿVÔ±VÎÏ(;ItO¸
e%> / dµÍ˙6†*e:ââßøÇ\Ω4ê´ª<»B◊ Ôú¯≥µvt°W
˝¨} pECS˜8‹ññ≥˙W∫5πÒXd˘Ñ"≈ªPHôÆ?a0V®ñü´‡=IH÷"⁄ÒÃ∏‰Ó!Œ˘<@\˛MDÚ‚M.Çﬁ≤é&W(FπŸ†âÏuÆc-ì÷€ˆıDC¨RΩÓ>∂§r•áÆ«)µŸ?™GDK¢~/¶Ç›ÈLâ>$ä„¶»Î˝N⁄-=—;∞'≤X‡‘F´4ö\~î∏r`+"><ÃXûgPa=Là∞#áûYD◊∂∂÷.ù_€,å?C)47h‚ù÷´Ùè)≠◊WQËÙ’/uœ/ÚíEö»¨`‚º~C–¨t¢ïæ<⁄·gπP„ˇ!“Û•Ï·=2°Êd„}õ[•c⁄;ƒúø%Ã –4 (©∏ì-0_|[%À§‘Wxà≤°áWN";n¢ˆvµ”x~Nßóÿ◊⁄\O–ÅbT∏≈B:Ç7\E&}≥ƒˆ}(ï~H1œ%ö¿V¢Ωr4):˛µ|ù∏XêÔ¢⁄Úû≥?™Ø<~h.®LY€M7±àGú:∑,ätü]æÂø%ÒíØÿB@XO^¨ˇ	õU£-<Mƒç§*öœ•Çåˇ=.⁄∑p4¸-”„àŸHvAë¨†ÒJcºaÖlÔ˜˘ÛtíÙ›æÄß<:_»+2]∑üã∏ÅïUÖ8∆ÎÀ£∞^k‚…Ü&——à%Î˝:ıSå¥√Ú”U]ôóp44◊è¨¥úÆ5ÎÀàEˆ∞†“˝¬!Ä≠f˙[i(±≤Z¶ücù≈—˛œØ≤˚é!Bqñi∑:ñiw†X¶Deıv∂ùe⁄µ“"∆y+eFH€Vıï"öv_!ö¯$‰∞M√èöı„ãˇIÁVn≠]∏∞∂	âîhÎÌ≥[+õÎ€Îó/© ‚i◊#è˜¬ZD]¬t‘*]_‚BX%u	•U™¿Ë¿*G¶œ ÉÈ›*é#ïE´^D)B’&üG_
‹*≤ˆiN÷>WF÷û]XL"ı≤<‚≥0ÍV¢p/Ë”¶KY0j4Ö=NJ	ˇ1¨Jﬂj”Ò5Gq¶'ŒØ•⁄Hì‚Ì–Óem4$Wé1zê‹d√N&U¡ï9y¨ºÁ"◊EæìWâ*ﬂ€LI’¢j{òú…6IOmnV$|é◊òJß¡¬ëﬂdË#∆ÔêÂzJáº˚…V\æÁÔ‹ü‡é˝Á
?æOœWoKÏ∂Ÿ……í"’È¯Ë_îQàáÚl£Q}$•‹›Qó≥óı W{áÏ‹h+Oÿ6N›ÿ“D/øiS°·›àBKŸïkñN©‰U•rs≤ô(R°;[^£·ÑVJ&W	mf˘»Æ-Lö˙‹“Z¨D|qOæ¡ˇÄ´¸ÿ”ìÆΩ8˘ô±˘Ñá"o 0¥¯‡æô!Õó/≠ÖYq(Ω_â%c ¶lÔ¥¢lØ“:– ÂdE√n†≠Õõx nπ*D¢à/Gı?¶>yz÷Cëc}[înH©ﬂarßÊGUœH·ΩQ».⁄)bTÚ*n&xÁîºÅ¶Åá\∞œ\Nÿß¥aˇ)I%åôB;÷“™S·d‡™©óX-;Ä AR±r‡•À€ÎÁ÷Wña√ΩÖV7/o¨^~Wπıñ√µq_€ÓŸ…‹.;ÓB°0>∞n– ªY†<ù?™Q≈Œ:ªy.Öf#À∆gj7wv—D¢ Z…áá+Ÿ˜èﬂ”∆jKbÀn%•∂àvQ(bxÔ êÂy|ózïÇd	∆#◊iåñí6™wÍS©ù:ß›™XeM¡¸6]WTÕ∏Î7R—n•≥Um<öxZM%M^–˚/àE•‹∆í∂Ï˚©lﬂ†¥^Ø<.)˜í.y!Âq*LgPd∫“o-˝®ED–sbÙG2mÓÅôfÁnœø˝ÎVπsC„Ãºuà¡•úUôw8•y∑L∫“cXå0◊0Kπ ãﬁ•°ŸØOªâzn&≥^[¿ñÁΩvô)∆f£&ï<≈äc∆«¿Ωﬂ˚cÛ«NsJV±d•~Hæ‹Rl’4¬ÈæCD2–$Ò{”G#m0“à9!X>dQÜ•£≠j…a•ˇ?Áj”≈ŸêB=((;©ºı·áh$ﬁèÒ™:¢ªüÔíÎ.êhˇ)4Ú√w©KÚØêËL¨Mytæ-kË¨”h∫+ 
–ö‰ÙK¡H%4˜@€>–ìƒ2»›#zæ_îz®ø›˘›pàïD ™°ïS'Ök;ÜîèùÚÕ•›%IÚEÍ¥ÇáøÅ\<˛Èw–∆*¥yÑ
ÎI⁄Í·œ,Xkø„E±÷b˘Ã]◊ÒSÃß'X>j«Ÿ«Tõ·˛≥x&ÍÑ˘ñ8~EqzÃÂ@«˛!+ûe˜®Ô(ûU·õúRÙ¥∫ç◊`zÛÇ&YV›Æ„˘5˝Ûv≤É~¿Á¿ÈkıÇ›pÚÇ	 )zíæ)æ¿,¬_Âß]†H>DÂ$Ø{1˝ˆıó∆x„ÁF†~†˚…7≤nlØ]BÎ€hãÆÖe≠,_sû2iá~'-µ∫›Nº81ÅwíM7Ôq˜´5^€ùVÿÒÆs
[sS”3≥cŒ¬å≥∞”ò;±ª„ûu{
PlN˜Õ]Ø{™Öù7˜NMÕMæ˘¡©Ö…Ç~ë¸52.G¡yX·¥6≈I5ÿfÌµŒSz≤£äZr¢¶€›vvHs¸ã˛¸0Úö^‡`yPõﬁjÄ%9n¬:î≠>¡ 8ZÑééC7⁄«8ìRnäàñ·6<*Ë$ÍB‹ëbﬁë£ÏÏd…Óô{#‚vˇË{∑E≤ÖiÔhêÁ§·\0ƒ*Ÿâ~ÿÓvÑπïŸO≤´Ãvc?ÃtnÍŒ–WäP>û´>À∑˛,"xè@g∞6±âﬁYâç'?©≤	¿”«Ø	Îû1pOÅ3Œ FP∏π6qàEËÜ2‹Cno--‡’√º›ï ∆∫Ü3;e¡ŒÇ°»ÔπaÛX™¯~O‚ÚΩáxr◊ÔôüˆáO~WEÙ„Nô§À%˚Ù$N:VM84?åéf©Àh∏ìÅç`˘¸⁄ZøtˆÚœUn‰ı`'º~D†[/ÿ≥|T†[È!yÖŸ:ß=•X§Ô˛"ﬁ[Tı›Î÷èæ}˙Jøy‰^õ¥ØˆÈ˜õíüèSñı8d* }Gk!∂·;oÇ2R<z*@°P:⁄U^ºOTCzõ∏–€Ü.tè.süØ¶Ó¶Ûüõxœ5T"E.Ò)Ÿ!ûÊòZò,ÙêÎr∏ôw¸î“5ﬁg-ü∞\”w∆3^c|0VäÂµK¡ñ§ü4!j7Õt…|ﬁô¨√‡en»e≈ÙQdûZ9ï3 ^Âv‹¨ÊW∆¬≥úöVƒµL÷:ó¡©b=-“à˙.r´Âœf˜8H˙.ä*ù_^qÛê˜.©/W‡ﬁ¢.vÎÇ≥d7úù|/øj3ÙSW¡˜Ú´∏≥(πé)∫“ä„¯l‰Ëµ ”⁄Kt.]aST`ù¢s%á“‡|F˙$(¸&¸.%&tŸBñp¡·ÇO§G≈k7uC’ÈRíıR3RŒÕÃŒM/úòù:qbnlnÊ‰…Yg˛d√qw¥^ IÍ•<¶ì8«Ô ›°—ùZ@ZEl˚pX)«Í†]t`¬$+∫Míâ’)Å∫J†
[
zä)˝e9õ>erÁÄƒª“ﬁ—P;àï8!¬™Ï/v2ÿ{ö⁄aJØ⁄πg©ﬂ©–ÛT†‡uÂ:RÓ)…◊$|Uq–kyˇ¯*´w—i¸T˘Å'®ÚÌ]Ún≠«:Ü^ß„Fuøé›∂G›OiUUqËÂ†d"≠˜*≥üa™F0èÖ_0V7” ∆ø›˘›c}∑´ ÿê|[9sù¶ˆoÚêÛ”ú™Çú±ãjŒß≤’€i„Uˆ†ÊjÏ=wx3 ¨∫ªNœÔ÷ª◊<¢Ìi∂Ò–éw#Ø]eÑ*‡†ë≤!ïòlRa˝·ûºª—ôÒÄá◊8ÍÙ)G±RF<ÖøE-[$ Àv· `ólá•n·C‰Vu<√B,±ósÉ,’Ä£µ…„{†(¶∑Öö!ÿbrú^ZHêT‹ë˙"1^ÉÎÄW5J„pö…ùØ≤Ó¿~ÉÀK¿ﬁ¸4È.µïAÆ¬yßnP.bÄNvÖ‡ù/qØ¡ãq∞ÅóÎ_Ó≈ß¶Ûks‰~–√2ö∑±ISw[x±r#`ˆ4ÿÚ=¶XmŸ@öÜ@·ùB@ò||<ob\s¸6ç≥ùä∂9x%Êπj‡\?'ÕÚ°	H=G‘óF"”∂Òå“6’õMÈ∏ó≈wC<5±d≠@≤<=D<X,§/â/1Ûl˘4-OíNçj∞I,º⁄uqTïV)ö…í9uJVVÈQöîıGûZ˜Î≤¥ç"ÕaJäSb¢ÄÚ≤=¸¸i„®NÂ0 ﬂò6»ﬁ  Ÿâ©°*KèMz≈“(˛jA±µ’ımt~˝|>Ê6<`ä8Ô5ma$ŒU3ÑÕÊ\ÉÇôn‰Â¿Xglû¬XåúLrπéöWG∆ˆs·îC	ÂÃVå·ÃêÓçMMbœ¶™¶™Á◊∆íqWßTÆaILﬂÚ¢Ê40g5QüEIPÔFë>'Z¸sZ Á+∫#…–ì|°íàj‰i¨µà•udAå(ÈÀŒSK◊˜g«©Ú¯X‰é"π∆±`ufkQ÷RëBÙ“©ä|ÏwM¨?µ O±bk•ì÷ó_∆oLØxc?7ìhs8≤˚ìˆ{ÿl¯ÓñsÕÖ7â_„ïQ≠^"˝Õ—µII·¢nJÜ@Ái°H¨"iEµm ;çjÿ“¿mtz*6µ9‡Ü*áù÷ÿ¶∂K_÷∂k•2¥◊§k çlµô]F`q8F∂ÖE≠$-TÒ!îpÄLÅRÕRÇ‰≈≤`Üh ÿn*úü≥ÿymÖÅàı¬	6ûÎªuuº%-hº5m∞N'm¸BÅ˚—àú6äídrˆnèm@—Wß›∆≠°7—∂[o;ù?∂4AØ2jÚ|‰tZ^Ô—™{MlÄÊY5∏Í5ΩÆ„£ã¯≠∏†ÈéùŒ≤jØ·Ü∏/ÀƒN¿¡È‹!´ó◊—‘ﬁ∆‰cß•/Vçl≠]∆8Ö{]<Ú∑¢fˆáL ≠©ÒbWmYG°«û†ö(R∫ÍÏ«ÖãÖNóqmÙ ’CÄ¬Ú|Í`J=ÈÒ6Â‘¡Ã§éÖX´
≥kxÎuJæ∏vâ<Iv…˙±ØY¶˚î">!<Ò–ﬁê¨N9´P±í•t≤3‡PU‚ı™Ã•sØÇDàœù«ÃÌ¡ú
o)ù8œ	„:Îƒ^}hì∆Bˆ…õ'Ω±ñ¸‰“˛Â˛(xa9.Ω	∑î≠ˇ  ˇˇÏ}˝r«ëÁˇ˜%¨DmbMÇXQ\R8É“ 
áŸòi sLèga,",o»:ÖB´ªÂ“⁄ìKÎ,\í¢tÑElàØ¬ú·Íª´´3´´g ∏¬ÑMaz∫´´´≥≤≤2˘K∑lÈBSJ¥¸ƒ∏|-µÈˆ(hVéçà©u&eÍÍAã˜N–‚‘K%iZi=„±…g
É˚XH◊B3‹¨nm·í˝ÈL∂‰≈'¢ï<¯‚‹&¢Úíp.>“@SAÊ˛°ä+‹!+ãs§∞ºAﬂZù¡ÔgVÎ:TTGÚ:U‘u'éï(r±ßNd§=‚ ÔOlì£ô‹≤ÖFÂU\~zõˆ&§ö`Œ≠G´|"6©˝Ñ–ú°ÔKiÔ˘‹UE˘[µˇÅX"·8¡»¶bÙèyCë4˜Æ
Mg…™<—IpƒíÍ·¡Q^Õ vÈ¨Ù5¶>‹·=¡eDE´/EÂ‡=b‰QY/,XC:biOã"lVrsLét∆5ΩñﬂÖtG|·ƒ†öî#µπ˙“dæ˚⁄äbï’rRuésX(-^û_º:um∫D¶ÆMÕΩ≥<;Ωî=4¬&G¶◊À·	·¯ ]â‚BÿCñ¢3ÿ√•†I-õf{ƒ/R¸Ç±îúsQ'h†H≤xÙ}â“fóﬁUllüpﬁÓﬁ""L?K+HŒn…ßqdÄÜÖƒ›O@æ≈Ìåq#?[ò%”A≥í]¿;Ui"· C¶;`ˆ:ù≤>ûG +[‡‚xFç	ö~$s|,aoÒ=_ﬂΩ{Î*Ø@L˝°´4	v«|™ò≈ªÖÇ5[A-lM”±k3Ï˝iÚ2Fá¯ßdtdËt±Õ± ú°,∏ŸøZ∏4”1Êz#	NMëC˜óﬂ?%?û(éΩ&v_íÁ˚ˇÒ|ˇg^4Ô˚b0MƒÀ/[ˇ˚˝ˇw)·/Nx_`år-Ñ¸≈ ’ì´âÒc"V#≈a&Vü“©)v∞äüÔÙÇ≈BBı›“L]õ´z.∑lç‡%åõ#+jºFÊÎ,Á«-;ˇ"…Y>~üèb”Tr¥H˙¨ﬂ=ﬂø{»¬Û|ˇœT9Y§ÍÇ<¶OÖ»í∞ÜåÚ_,Æ≤ÿÒ≈¯Dû:EïY¶Læp-«U[≤ËÑ™µÚ>ﬂà£ﬂâ∑·ÿ,íA≠⁄ﬁ!WC˙∏Âl„êÌ≤›2>÷ãíaÄ}π1meº@$ot7.7√:À[^i Æù<•ÒÀÑÀ8‰iÛ%—…&†ÒÆé¿*uëÇzKKÂ®¢D6∆2ïTä|<Ü≈'≈Õ™«$]9÷üaå2cv{@e<˘ÀO§Ô∫0Ωºà⁄T¯Õ’4^úxçJ7Àå’∫ﬁv4Üß4ßº Ií¥tôÊNÒ]fW%Énñt∞äñ∂ﬁ=;˛ö]ì"oJvn4·qíÄîÏ6˜Æ|m,x¬läÖ)™”w–b€˚E⁄VÇ•‹Z}o∞Õ—K(K⁄/ã“ƒÿè[îzvªØ≥ñ‘Q™Â;≈ã˜,+AqN
KAª⁄Z 2úW≤4ŒÜnì˛Ì€_l,Ê≈LúÒ‚–)põw!bŒ™.A>∂Ç(ûw,!âÏ°z$äô}
}$ƒíøÇ¢õáÈΩ9pˆê*ªYë∂ºÓNÖæ°”a?Î „ÓD8ÇYWÊÊ/MÕëÂ˘ÖÅπ“[•92Sö+-ó»Ù¸µÀ≥ãWß‡
ÂÂ®æVmnŒÑµ∞Õ∆~∂“cÜ€wœ”Oví'9"z[]› ⁄Ø≤pñ]>Õ'Ë‘8ü2jûD∂”©±á%c≤ïL∂£ôL∂ñ™O˝2b˜4_•_H·hoG”±7v9˝«¶Í’/{8U ,K7oä0krèg÷FìrP≠◊ÅX›g≠+HwéˆÚêiålm“Î{Fqp–Ì-Œu∞V∏Æî˙Lh4±çcKøﬂ=À/Ë¬B◊hˇ˝ãÈ=]*¨◊yí3–iÈFï¡Hmúò~ü«
nßy*Œ≥FÑàäWÚ«˙ÍÀ‘S5rø]/, Ú\b!Ü%QΩiΩ∫æ	D.∞oåñ∑^)péQ∆{…)â“´HË(≤ãıYÖÙegÃ^¡VN±”y:î$r˙Tô)dzﬁ’∞æÖüÎÆ+â˘§}Amç1≠MŒöp(~D£û,41ÔCI+•6° W˛•Ó68ö`ûı1@æ7¬ÍÔ{ôyl5ﬂUÀcD1É¿úç"kêÖ9√juw¯Vr<√0∂ô∑Töõ+-í˘≈˙/5Òfﬂ*-æì∂Î*"¡éjˆyæÄ˝ó6Í4®Nêù_Fiºá›Lr–ÛYs˛u	éΩ5C<:Æ_ ÷?ÒVƒW6î≈m%*ÈÂ¶¨—‹•êz•QãÇ t-⁄≤ÿ°Œ“ûúë1–Œﬁ‰ªÌ¡ŒÀ?T©òß•+"0bò;¬îäA:œôâê&ÑA]=¥ˇTüavfí¸ç≠':˘Ào˛Ø]8a2•Dã´[;≈0 Î≤àÍ«@∑ ª/ñ˙K≤Ä"#å¶º'iÃ“áo´tﬂ'V>…}ƒ/®ˆb}o¸á˜6˜ƒë◊dÒB
:5¡˛Sç m±yê√†KrHˆ%¢J–~ÆŒ?Pø}/ˆ2èò/ïo;Ñm˜àŸyr+#€E%Ö»ﬂ”Ä.11Ô KòURß÷H©ﬂπµΩ…nfåké2π&´L’π†î+’≠Õ„CxÛ‚&≠VÂO˘ƒÚÛÄ«cÔ®@m\Ê#Yµî…‡SR∏RmøπµzÜ\â¢u∫uõi“◊~Ü¸º⁄ st¡É}g©Ö[Õ$¢âi¶Á◊´Ìç≠UŒ3øπ”— µ„B∫Í‹.˛∫⁄êıÀ’Z∏“ÙNCúI^vÏ$˛D m)áÌ>’äìÂŒˆLx±ºXkë¯Ü˜ÉZN˜'I£ÒÍ≠h´IG¨U∏ÙÂê_ÿ0…`v›èXÇÅC∫ÎX L˚ÍÙÜ•ÌπaÈ"|ÊµÔ¥„gcF¸Ãï¸◊mFê<ÿmxMÎ“ªπI9…Ωie‹"Oå]|“ã˜íﬁyú!f”Ò7π∞$∞Wá˘=A»Î˜<Ã®*„πˆ)ŸììcπìdEaCw/∆ÖY‡¬¢˛ìGÊbœΩ}óWÊÊ»Ù‹lÈ⁄≤v˘-OÕŒ©,≈Ö˘Öï”ÔwCîoÁB  ∑ã\n[¿Ö˜ø¬œ‡ Q˙éÍ,∂˘µ˙XhÒ©G€T‹jõCÃD´’÷Ç N5Ë≤F⁄.–Jë^›ﬁjÒ C_C\ÒÀ@^“á6Íﬂ–∆lù3˛±˜Ïf™ı_6‰Ÿ`Sã!k¡Ø°&?∑è≈:≤Œfß2(÷/ŸvìqXÓ>m6òæ‚q˚≤:jáa.j5øv‘πF;˙z≤…ä~-µ√∆,ù¸7iãCÒâLè¶Éá>x⁄y=ØÈ&â_"p…0râxY¿#‡z|Å+FˇˆøY„(Nac”\v¢≠66öÊ)ÙŸØÌç"◊ïhûÉMÖﬂÊÔ°‚˘‘d„∑^†K+–\Y/w´√©VÈ
jÌùÒÖ∞…r'ççßZÂ˛≥KQ}´5⁄M√£ßç V·YEVN∂å^$„„ÂeÂ≠Ã,{á«≤√¸ûù÷ºLΩ:]⁄ô˝E_∆‚TnâA£?m@Ñ(¬© ÚŒÁGXyg>^<“WéjfX≈¬¬≈a4¢"6*!U?QÉNˆF∞ŒôJñUkØøº¢w¥ZÂûâ`ù–[-Ì®Iﬁ‰°iéDˆ§¢ó€√#,6`ö»£)Ÿ$r·£¢ê#õmnGÈH TmÑ≈Û⁄ÙâwØóHﬁˆV≥{i‘ﬂŒ…Œ≠óÒ)àÉÁ«”≤»¶Êã+ËaıﬂUÛŒ≥§¥ê¥Ìf–EΩ™⁄ºCπ6=Œê2/Tg¶"—ó‰o(°É‰?qœ!æˆ˘»–£˚âbãN†∞0pñ%˚¨∞n”A+¥ßç°`‹›Îl¯X^`BÊ≥G@>6V·-Õi¨ƒ»¨:g_≤hf"È\¨9’!q`÷7ﬂ¥˙¡ÊoR«ŸñÌ“d¬÷ÃËπÑû¸Fü˘w≥√¸@™∑¸®›U~–£ü¬6 Ëec´IﬂÉÓß¸jÙT1˚*•z+è€˝ïá3zÉ§U_ƒ∑â∏+‚ÄŸq$’qÿÓánÓ∆ﬁı=l^æ>ÕòâçË(]DFìÎ r1üçª¶qOáòıY&N¸úÔf%™-6ı%^≥8ıâ⁄ı>„.˛˝Á˚ø—Õ⁄F:ø‡æÇ˙À|[·_}¬ÆË„eç°»πﬂˆ9KCÊ ∞wvy‹îÄßµ©∂“°M)>†ˆe•Q˜>/Ü{%¨≥˚ uk;IK "˚≠M≠mÛ˘	/%◊s;	>d+ÅÅDÙ·«Iü◊C¥∑“›ˆ‰Cä
3ísìΩ·H‘.ì’q;‚¯ÚÇ_ãËd‚Ç⁄r3™’ÇUjm£vöJ%€ÍÂ∞jœ¶ËÆ,TDﬁàPÍ ÎÈpëÃ1B™ÿˇuä,ÕMë+[Á6›K_än›Ü:>™6ÇéhΩTXùœÅv4∞JÌüf¥iLÀ’`†JïÌzƒ£%Ùú¯7c∂&mFy¡∏¿Ü¿Q4¡Í≤ﬂ6  !ˆkÕu5Ñ√‚‡x∂ñM,Ÿ	Åñº=∞L{g@À&úe¶øayn‘^V úÍu[ïKAâÙhÀ¨Ä•m= 	°0ÁñXÿÔ$*V¿nrﬁû\˚ü™ìøv!Ç‚&•·Äƒv€¯¯Y€ôÈ√áŒHÄXûd‰øM}"ÿø8‹)¡7*Rå›∆àﬁ7pBÃF˚Dç˝@T‚îª$Œ“7C‡“FÎ%tR ;5¬iÇY‰˝∆;œ·‹˚ŒÑID≠‡≠®Sk†¡&∆è≤¡˛uhå8Õ≤Ñÿd>˛Îi*JVTÁb±⁄ößÀie+<∫A◊ôV∆à'X|;ˇ©ZÿlãÒÔf¯„âÒëJb˙íÔd†Øª—g¶&l √©‡¬#≥lûæB.”6ﬁÆV⁄ÜqS‹…&^1ß÷©S‰3¥í9Û>π˘Ò∆§ßç±‰qü†ô·ª¥änI!·V2Ã∞qÏ•Ns≠Ëí.g7"€ëÆgÙﬁû&OzMÀ˚®Ç
Å∑|ÅJ„p∂Iô_«\ÔÓÂßêö∑ï`ß%6uOßÓÈC¸z¸Az±à&—◊I®€B2ñ 	˘ÓxΩ8ëòJÃFDwÉ«^d˛ç*Yïn˘√â‡¡Ÿ¨÷∑⁄·Òù«íeì„îODÁ8àN+,Gı Òëçr€ÙT˜~ììÆ	¡GçZx„ØëÅ™ ß»ËkÑ„ »“NãäY‹b!kâ◊ÇM<‘Á4jD„Ñ”ISÊè[2ˇ4öûå(Sùé§E	Û2Ç n®oàmO;j˚5‚ L⁄	Çõò?p˙∫ò?GªH◊™‘ú÷««≤É0|èvW—2e£À»…˝öäx~;Õ~tä§ìÃzÜw•Ú‘=gÜfùtáKpQL'ÕIﬂá=9ƒ≥ËΩ
_Û§túÌî"ˆ˜w&‘cÂ≈Ä\˙ôÔ®âó∏–ˆ]»D%·¬x™Ω¿–•'≤¶|ƒ”ˆ~K ÍkFıó◊[ÌfT_Oñça•™bˇ·k"eJ◊rìπSºê€ÆéBUcü‚˜|Cóøx™%‚Sû˚»t%Ì∂UA„{Õ:ß.${F3Ëï|“ˇxM<SöÂ˚X“„t†=}â,J-∑b2HI)Q2~
<∑¬€r∞Ì#ûí$fÿÅx¸gjôó?Q~≥gä™aÁPs	‡ˆGß∂mg*}§HÆVka´Õ`U:ªLwÒÔÅ(û<Å7ig‘£∞?°u8£Û2ë:é¸∂Ø?>Æ>È-ÑVˆÂ˛É6}ÿ±¶ìâCÜÊ˘XÃ@–ëÍ"ú&íª8nIÇ.è¬x^XÚ:JÊg]ò xw¯,”¸µp≠=0.	òkl8ãøÓ◊I>“Ùˆ»r·◊)Ÿô8écﬂ⁄àrÙke´…¡úñπu´ΩS/ÏÓímÊ4õ$◊_›Â∏“Õ‡fa¸)XﬁA2 ∞§ß˜^ª%E∞èc ú>3˝&M◊ZB.jÒÓûv6	¡.°ú>ñ“*OäX;˜aí›ËzFïZÁìDºˆŒx›√ë∑±äØ’¢ˆ¿äÉË˚.‘Çﬂ€&0)ÊÕå\>M6†Ô`“)xﬁ‘§n'∑∂k>QSsa€õ_P	l
‘∆oú!≠Ÿ M4œH|,Ü≠(¯‰uÅe %Øûﬁj™ãp?ﬂÂ¸D˙'kÅ˛YdOã_¿ØÌü0ÔÖ;vYèˆR˚xcÏ„j6⁄7Åäv0ô+ïll
Z¥ÙäUTÒ˙2NR∞∫X¶˛Ó˙Ò…œ§xÌû7≈ÊVÑÂŸ!<Ÿrå$s.V<∫yÛËrü?
w,˜ŸHl3Îº±ªß>ªr˙]î÷	j"Ã~/xwîõ%Ùq^◊S'çˇcß‡>ˆq∫´‰))LÆxaÁìÅoœ∆¸¥ª¶ã«GÜô°“bÉ.‚›ó99R&£0Ü a/‹
«w˝™∏Ü‚ä=kp›N&~Ïhö *L»ñá¡◊U:ƒC®çkw∑Ç‘¨Õ”€a≥DŸgEÇ˜Ü◊öÌäFã‰€M≤—K≈8Ef™Õ∞‹&WÈˆ(¨Ø”ü∫Vır‰ô—M∂ùÄÆúe3S)<¢	)kKHY„@áAç™skf-Ä©]ﬁfÏAìôˆ¸?&*k7p__i—F”º`FüMÜ√›ï#ìƒˇ˝‡;TﬁFÄ-|èúª|´˘ß8ƒ8üd˚!ªÅ\]
*Î!∞Bªt/¨ª38”¿+¯hêäd8<A÷0ÂUx*9≠,ƒ£€]€,zj=∫$r ¡T∆r3§}™Lµ—pHG>`YÇ√™≥Å’^ÏÏ„Ç\cÎP‘+I˚Ìjùöã‹©VËfæLœJ˚U$ÒiÔ:æı„WŒ“Ü‡KÒÈbUæVœ«¨&£m¢ØLnDµg~~µN7Aç≠î¡:ΩÊ:ß_:‡ˇ˚AÕı«¢ÃÔ§‡mÓ$xL‡ÒââÎ^¡ÛÉçmúT∂G
}Y"/†Ô¥äÏkÔΩØÑcˇëÈ˝æ£Êœ7&ΩÙ⁄ıù‰èS¨Õ‰ˇ~Œ/¸ªÀW_^GXÙ_èir∞BçõΩ,·ùó¯b∏8o§à¿ÑM∂ò/~‡ºëQ
<	¢9§8-˝j+hb–9Øu9Q¸)~=ô G›uá%9V$
‘∆åIFêDﬂ&≠µ,ﬂéöÔë•F‘˜‚≠ÉïÏé–„éÿ/‘ÁŒ∏dñÈıËJ.Ûíi*Ú €∂eâGä˝P˘÷—ê‡#£éÿCDµâQNîı∞{üºôxKÃ†{.È ^∑/Àí§1ÃfÌÁs“‘MsQ;Á¢r”W5ﬁxæø_Dﬂµ~üäE_@o9WDÓh;1*…qG,*ø„Q–˜ï0‹6)3˜È/T.ÓΩ¶π‘z#¬À_ãê·óbÂâÉáHú–xŒ˚E¿ ÷O¯(,ä] ∑ç’¸â|NA∂xG{h7ufÂSMÃ®®
Î¸—DáÓà¨~‚ﬂãgsQå∫8è~0CGlÎ`}#˜≈¯≈öS¸wıÁmÏ$Í6®âü`K=Uua¬D MU…ˇTé›hÍª±‡K[Û»L¥]g°ûJ7’¢fvã µÛütíÁ’P|_:√õ«R∏G*/ï¸ù8Ã#∆µﬁ;¨ú≤Ö†6Àµ*é Xÿºì¥›Líﬂ≈OÁª√ Áé]5u›ÕècºÖ5-®ÿü“j‡°°°ÓÎIÒôöâÃ#RXòπ<¯ÛŸÖ4ß´à·JÆΩΩmÙ$‡`∆Úi°£Çl&è{§vsÕÛ[éßy_çıó	’Å<qŒånó›;^$ó´ı†^¶;A˙˙JA≥NWq:Îõaœ9±u=m›KA˝Ωz‘Qï†´∫ƒ∑‚á¸Ì‹;∫F–- Áı;"á.j
€ƒm"Ràﬂæ~ÂŒRÜ~Ê¨ÖTÊy=˙Î®Lˆ…ß§ı‚—k#WÛûï¿1o Pñ:.8ˇ/90◊ŸƒY,Dvæ¢‚√¿{8mZ^8vßJìä8V0xeÎ@E$Õ◊ì¢‡°æIÅ)BÏhgBVLgUL∫WŒt¶¸Üm6úÖNªóîåég»KäÆEã…À¨<xM˚dA˚˙ã¯.àÌËaãáìfƒG8B…#ëçå§≥E"Iè√äpf◊HP£feá¥∂V7´mŒﬂ	ŸJ† 4©ò±úŸ<Fñ°¸&`Â7j€Z…ÿjp∑” Pù )“œ
êˆ
ƒõÜÒrªâ+ÿ/]ˆƒ∂˛ñ»™`S/#•∂ö¿å
ïB°_8|#yÈ<§m 	g{íZO
˜ﬁâÀÃ™úass´«5ñCˇ´Ωõf @¶ãﬁXõÎ¢ä≥KÜSQ5;o»›£@àz¶íπD¿πˇ<—:ö"ù‚’◊…Â(j{Úãj-g!ÉòC=…àú£«ÄAåáŸ†Ae.{I ÷Q!Ô™p—∑∞πÏÀÙQ‰ÒÒÌ¶ô	qb¡˙‡~`©Qc~m-lRE]]ct√tÑó8ü5
 d´Q°/ÕÆ±ƒŸ÷AÏ´ë`§?Éê;=QÆ⁄êú@6ÁP¬Og˚ñø”'`Ä\˙¸´/˚r?˙Pªd´Œl6£Êâ≈ìdç‡Û1Ô rÇD˛}&∞â∏ìÄ;∂ÈUÁ¨Ö∏Û©ãAµ_ Xj;0–rÖˇŸ±^rÁ®ï!DÅh.u\	‚G?˝{:o_¸§“…ÈlRâ/«vJÒƒ&d*Ò|s	ˆÃ3´\ØÛpfí¡ |&ì»@¢ˆ$\?£∑≤÷M¢˜ˆ∫@T∫ºnÁÊçº∫K0‡vgH⁄cà #@fÒ°5ÙM∏´Ôs…¯Lµ˘}|¢Ω16”În%ƒä·Ë¸ûZ<º‘^oÚ∏ı†*e'∆¢ZŸc5Ïr¥œÎ—]W≠®Réû≠ıV!qı≥BI⁄’c´ê–≤“.Ò@≈g‘ì* }äJ≤óü®©¸jäÕúÑsì•dòˆå7€P.§úÕâm∑£”* ô;¿íÜx›À#öÂ*‰%òÁ•ùnºÒ¸ˆÛ¶~.÷®^Y!È”°“ˆhaNÙÄñîΩ”ÖdΩK+Ôî…¬‚¸ÂŸπ#¯.MØ,Œ.øCVf¶ñK≤éûQAØ⁄‚Ÿk2yçªœÊa=©x≤JLç{êπ7LÔ–y!Mz∆¯;QJ*Qf*·$±;îYF*oÈ®∏TTmùË˙Øguàb‹,¯§)T}®!V ‚t∑ú<â/¢êgèØE≠ê\‚Bïr\¬:?Ì–õÖﬂia-®µ“≈n1ã1I®1∆ sGP& Bz:ÚR” "˝ÁŸx)EÅ8Ô‚Ç‘®B·¬πT5V∆“≈p≠Ê´ıZµNßô‡˘uqä´8N`∑cUÄ£9O*ú≥˛®É'åÖØ=|ä(œ mU±Ââ*’˛LÉéà`¨@)§oÅ“"tí{£≤ÄABüÑ3=}•SnÈ‹ûÉ"Íâ∆IãΩ”aÖzù°Ú#é8ûsÇÅœcÔ‚˛¿ﬂﬂ≥3Dó?#¸-ãyó?‘˛˚Å8˘±§,ª˜‰å∞ùü(ÿ¶£ÿ3Îú˚Œ-Ÿ÷§H<≤X√€º‘®5¿u65ıó∂ eÊ$∏0f ‘‰ÙaRΩ sØ∂@ícaæS§ÖVT‹∫ìúÍf]∂@az√Yπëwﬂp•B”_gL{ÎdÏêÍI¿∂˜LÏ}©‘˚ÀQs3≠™≤ÉÆíK#qawÉ◊F\
nÑÊ*πiÛ¥b"è√E≤∞µ#2u#hM≤äË£GÒEÖw»(-?!‰8ı™^gc‰E6DËuN$ÈX¢ï≥¢ô0L÷∆>ÿäSjR0◊Õƒ:ÀúU∆√j)B&ÏFØÚa~äı•%
∫Vîé0øÆ∫πéÏ{ZÕÚ1◊Jïj[ä&€x*Wù˘Îa´∏Uo5Ëç7∏O´¡Üz`x|tl|d‚‹ÿπs„„£ÁœègœWÇpı"3d/∞˘¥O≠—…T¶∆˚©ÌTN˝Í¬ƒör‘⁄˙‘,]ê’°≥7µ€√g+ƒŸ§]≠r_Yôôì÷ΩMÖÔ‰B;C∫Œ∂Äq‚ s+bŒCfLh{5¢vÁ&'õ`V6}≈ùîIÑé!ù≥)l´ı∆V€È=bs{G7Ç⁄Vòí/ÏÌG,˘ΩæÍJ∑tèr)yi!,“◊√vë7ç¬ÌxÙhÉÆoaÛB_¨$ÑuId≈ûß´QË_®å…D2â¸˛˝6)¨,Œùé˝y≈b—K:≈∂Pﬂ#-q˜RΩAR:Y≠≤≤¢ÚVk2⁄jÛ='@á¸x∂∞yÔ⁄@RnNZ¶öIÚ∫ø?`x<”	¬L|_”‚∆Ô’Ãw}$‚-CoEÜuœÜ≤ª∞XZ*-ˇrÍ≠©Â©≈%¡o‹8C™í‹ßÇs{hŸá≥ƒ—Ü\ÙH>û\ˆI{Ï‹p–íõÇçP Ÿe≠µ÷√ùÄº[ˆÚƒÿ˚Ç‰"ÈOÎrN0<¨)◊n∂˙…§>ëw°4Y·Ωà*øj{áŒÈàPËºﬂ—üΩÎ¯∏ÄtlÀmpcO¨tÚyËBGﬂC†36“ôªñè√œ»>ß{KtLﬂë"Ø›C∏W€ﬂﬁÖPîY÷®Fye@¬rÕpÄ¥…r/g¡xï‰I∞M2)ËÒAMW‹¢ƒ÷h˜˙,3ﬁ°“ˆ≤ÕÉ∂¿yŒõ«5<ñkx•5∂FR$˛¯÷ßõ”õ/ó)ë¿ß hëºΩ¥[Sçπ∂≈¿«u¬xÔﬁ∫YY_ßª∫z8ÕF]”œpÖd¶'ÊtFëÇı>ú)áÌ:±lÑqÅN8Å‡Ã]ä[˜~äÊ‰ËıT8º”A£ë[È®}Obè”ââ°a*¸‚uˇDO©è$!∫≤Tkdêî¯è©ñr.ÎWY«]zÖ#]p•¢TJ⁄Y=hÓ1•ßÍè*T°Àfàú™T‘¨Á»ZÔr"Úwõ{Ú´rO¡ùh´YßÔ·Ô÷ŸÂÃ—t2ÂãFß·xë,–Òÿf®õc:è∆NòKUÆ∂¶≤F—fâ‚x§© &Äˇﬁ€iá…g‹ˇ˝@tMTò˘Ω}‚ÌáVæd¯˝‡n@Ækv[—∂ì(iîÏ◊úﬂ∫!"~_á>Jk$u∏)ßZRó˙9-¢ßTd˚≥X£i“øƒjqˆî}ïæﬁ%[Ù
Ø§§y≈§E∏ŸG9¥expÑüü~¿Çùﬂî_û˙ÖΩñ¨3î¨2p„—Ã0…"ñÎãÜ DIàL2∏fcó75÷ˆ≥x/ÛÛ¡üÿ'Aës6t¬`Mâi€E:#√ÔQ:„™Xö‘…!XoFPdXt©QıeöB“^L≥1D5ò(R0ΩFÒı•çjX´`h®å›ÑkqπeCÖ∆…/≥{y ≤îEo–“ƒ◊$∂taÂ“‹Ï4ó˛˜“Ù2Yò_ZÜ§Q´-Èk;áì&ê¢6Rî	D6ﬁT◊R8V®R7*Õç3m»$Ùg:Êƒîƒ∏ÉÁ¨KìBZzë90§
=*∞§)iwÀmV)ùÄı6ÍE4@4Ωbf◊œê¨,ârE6ﬂS÷r,‘∂Z0å6Œö6P‡(Ä–‰@äÈ%\S”í¥ô<Çª •öÈ®¥ãÜÚﬂ´ËÔNjÄ4LjÇñ;œd=~l, ∑eçQ´rÉä¨õ€'IÒö3Jrû.v«s«vTµ,)Œ"Ö∂ºòçû‹ò0K•i5	öîÈ)¬VÈ·1€˜>2îvœÁ+¶∂yS®cµ–¨“´À»éONü†ΩõÄ°ìH¥‡C≤©≤:`⁄s◊2~»'âQiú=fNv\¨Ö•eøÕÄö»Œåt?g
ÍßÃŸ¬Á«C¯4≈d}`ŒçGDL!·ﬁÛ˝‚ôÃ‚*UE® Î7oNì…Ù| °¨∆:-~ƒ≤
´nyvyÆ‰≈∞ÍÚ2Êáì"ª ƒò©ªµ˜SûL.C«a¯üÄ{iƒÉñÌs`„||^L˚-Û
"ﬁæÆuIG>ÆoD1qÜïbÒé¡J¨ å˘ñ1Q)iˇ–„Dì$πºúíCÃ 3¸´=«t˛∆ß&Uº™¥
ñYÌ»Ô÷´‚9”∆˝sÄF:
?õã#pzjπte~Òrä\ZôπRZˆö÷nû‹ë≈‡‹
‚∞U!JÃæQÄ8›7OÙÑ4ÄS∞}{X£:πô1óßi«÷£ÊN¸ÎÇqù/¯’Å=}πÂ‹ëˇ5¯.Nåvﬂ€·*ô	oÑµ®¡*z∞–IBm
)’¸˙†h—ÛÜWöAc£Z¶7mU◊Î2TÛâä—<‘ˆé]Ã#Ámf™Î’vP#Ç"áÓV˙ﬁ0⁄|¶Ñ˘)f¯”3~õÛñ:b•çóÈÌPæU≠ÑaÒ˘|_KÛI1t|™ætˆ@”Tá0¸Á€M}á€…Çq≠¿'Ò‚÷…≠VfW˛¡ê	QÀÑöù™/ü*et–ΩtLÔ0∏ÿRXﬁ¢è∂√n®ÁG⁄&E&›7{}Ph9HÙ•–¸69Ω0O˛ùøÇ;§†f–mùÑz∫£%°€¢Æ¥e\÷9{;MLˆëK”fµ~i´Bó◊≠LW’eæÀR ‹|,¸_°Æ„O.j#ˇ%Ã7ˆÒØ¨íÌ»`]=R·
nv$\Í≤.ÑÀﬁUú¡”vz»AŒ">≥◊Æê˘ÖÂŸ˘kd©4Wö^û_ÃÂ<!åFπGãÑ‚™œÂG¿¸∫ju›[VøÑ§‹ÓÜvdX˘Ò¶‰û$oœ/˛å\û]\Ç7É¸ˆΩ¶íí€ŒπL//ÙmGÕ˜~πVm∂⁄8ìæôÄƒ‚$@∫≥p˛ákÌ,‚!o¶£ï"V62#]ŸI≥˚</…|Ù2¬–Qr¬∆ÏéTË/Ëm¿÷íö@cäF'9πÓ5©ÔïÃL-á‚n÷ÍÉtÀöB©º€:)TnñäË† :Û“7Y›)å$~∑%‘ÿáo>”5Ç”¥óë® ?06öœDıAÒ˚S¨@ôç(>ªn©vQ‰ã1Ò©{êshu5\”°\‘·òg?YèÄ˛tZ‡ygEê‰€°Î√w"ÑÒTG:˛†ˆë˜LF oD	 Á˚ø+…á÷^Ÿf&a/\ØDîÛˇ˙GpHTâ|§¶€ÜP<–% 5â¬]æÜ1?-^«Àï≈iÃŸ«XUF&…¬‘ÏÃã\OAµÚ“Æ$ºÛ^kàA1ê‡m¬≠I≥Fƒ…*Ú¬W™â⁄”A≥ÇÍKìÆ¬s)¡◊ìÈ[Æ
ˆ•¢Ÿ*_†ˆooW.·ΩYOréœ±[O~)£X≤Òæûiˇ$∫v|¶Ω∑√π¨◊k°4¯èÓM™G≥‚—À\5ºá‹µ√\Zπ¥4Ω8+÷ôkÛÀ≥”ph∫CS∆RÓ’ÅUñ“¨~àÜØ∂ñ∂V[Âfuıò0mn‚M∞≤Ä@ç§†Oi´Q\◊NÚ);MwGnHù«ÏÆà£∫#¯NÈUˆ›xWŸÇ´f‹’∫‘†›©Ö-oY&qÏÆ˘ÜŸªÙ¥»?®⁄‰qqû>„Ÿ÷}V2ûâ¢·/„˚˚á>Ñ<M>á£@a.µóY÷Àc21Ñ(@'√∂á4áqúÄÛpVÿøkbÜ‰ ?Q`Ì'ö_Ëô∆ì¨âlë*‹˛¨˝]øF©rÙYjZ˛ ˚Vª£æ4WOd°ÆπqèK⁄ë˜•}©k›gøµ€™ø©¬Ùz€%ﬁÁW˙∫Pk‚Üèuı“ÑsÔÅ^î≥ñÍ§ie=W‹E$YEΩ´üâ5r¶/ë«∂K”-x£ î}èb>œ{≤Üˇ@Q|Ú7ñ◊Ω ∫4√ Ï¢3‡—å∂[vG·◊i @fB¶˜xò5¶À∏∞#dó≠Io2Ï,¡ùÌ3≥u€ —xbŸ°&fÕ?èd†∞8ÖÖˇpœ‘ùâw®´\
;T&ªvú[˘«nrbº¶ñóß¶ﬂºZ∫∂,›1âÙ£çc•bfO-ô
ö9Hîh|£'.Æ\Â&AÖ®¸ñÛı=ø˜ø8¡‹'≤>ÃΩ€–ˆp û∆ºüj∑ÉÚ√œ`TJ¿‘«úER%$€¥µV#"u1´bëºñ⁄^∫êM•YΩ◊£hΩrÍOñ*9¯ÍnÚäΩÎÃx¿
S e)ÿSYÂÊó≠FX÷’√Z≈Feçh«œdÖUÇEÉ≠d:\,®äë¢†[È´≥À‰“ Ú≤ß°–h”¬=iaΩ"i£s¶√ß«Ÿ‚π“’Rí¬À•§◊'$c Z”ä1ıÀ®Zö¯`∫4ë»õﬂÄ–·’œ~xrØ=|Oãoû/Pp∆(Îù∑ÃÃàëˇpz¨IA y,?ÉÏé±7√;©sT3»G∞-s∂Îˇ]µÿüÑ¯<µ/·ú–∑8Ë≥;ù±∑Ï U›!·T+9ôÏ<gÀ7ú#Ìyπtç*“Ö©w∏’uejπÙˆ‘;diπ¥ ¶?;l˘]jáçìÃgØÃg:IyÊ≥Ny>‹¨Ê‰˚9IhÓ6°πÛ‹d≥8Y;Ou≤nÚñ±ò<4«?o9_ÙHÂJ ZÙêRï≥÷8Âv°c0'Æ‹2ò.∫‘Û˜π÷(3ıŸ?¶
,^]‰B”%FF∫.M-ïfµ÷9µ∆¸ÂÀ•E≤¸ŒB:ñ=¶uhãO(≤ï}2ß∑	èêr„ë£çG|å∞“j 

ı
”eP>ªeˆÄb¥/$ı> ëtÚ-NÁkóÙ\Ã†Ï√É8ƒˆ ™≈é∆F s˜Â 	Â“”ﬁQ¸àg‰eá{Lz™R!äØ¥Ç≤JW95ëâ/ﬁ∑ú•ùF(‘}≥P "àÒL±=≤:úåz§ÉQÍG0Á”\æ!u;≤nÎ/3ê~Ë,3jü≠≈|P3&ïÖß:ÀX!ª‚%“fâπNÅîBÇ8 ≤fä]¬Œ∞›
’Â∞~⁄«Ü€7Yÿ}ˆc“	„6=S!FIv(´–û˜|ájπIz±•ï´Wßﬂ…¨ºÈ.ùvﬁØn≤{≈É&9¯]sYf¶8‘/@^ÅT∆sXÊ>ªãvs´^@òòüÇ)R=®íRV2$yqú<{(7•C}ÉÔxwqY#èy5â*√2◊jQ=JΩ:≥Z›˛üçdN2@¯ùÄÁ]:€~(◊÷’“ÚõÛ3Kﬁ≈nG“rœâ‚°ÍeΩZc∆ ZQ|ˇ ,öU*
´îNI{≤l•v≈ŸX≈CÃ÷±m˛ã≠WƒÈ*›	`Jﬁjr$˘!€ñPJ^-MÖ’ü≠rÖ˙v∞Éì‘„kº5§6dﬂC√ÁÜGF«∆œûõ»S£◊„ÖDMUµ^â<æ˘õ˝Z‘%Ω~1≤›‰´ë”/Á>ﬂ?‹#Ök¡zP!3’fXnﬁ[ô»ˇV0Ì15Õ`y¥ò*™◊Û`Â0K0yG[(óør«-ßpckµVmm»»·µhœ.BÀ;åÂ¶(mﬂõXói≠¯€ZÒ≠˘n!G©œF√ Kñ˛Óô—Èøõ≈Pòÿ#·RC:G&π»ø5µ\J‚’/œ/∫”m{"ØzÑ6‚0aÅw0Rv357}	ÄÒ gœ£ø)LÒD≤´û
Ò—ëp¸\¶7Oœ/Êg/˘gô;3 Ì0ÃU|¬Æq‹´D?€˝8≥ådÙBÆJd·ÅÉ∞©µ¬?∂Zöaë’$Øt*¶
 †yæñüÑS=à§ÌRùX@5eeçâ'UÈ˝Iä≥7nÙ©e4OhÜÃ∞!Ì sÓ“!«Ûtöû∑,∆8ö®uê`åïê<8Ê|ÆÏP#ÌcªÚ3‚é2åø£ó¡∆ÓŸ2bÚÆlHiƒ<‡
 )Ö˚^P–√ÔUæ‹˚v∑•˚Øü;?¯UÅ≈b±_¯ÒµNéS~'2/`Ã) ÚwUÁ∞ˆ¬F†˙Ød(ÕBùj∑=€c4ÉU c8yr'»pÅˆB7d,[…c ¡ÓRp#d„…s‘òc?®ÿÄŒß ◊‹◊UºpôlÆ"»ÓÃxì]Ó—◊åd´>Jí•Sî‘Ω.NõkÖˆ¿	;ú≤)Ään≤¯«à˘%^];Æ<◊+jXtÕ:ôœœÎJp∞¿¢ÍÊÄ≈‰5ÏèLhQ`n'¨u Éˇ‰{mëSöﬁ3u(WÉ ≥kÍPÆ-’ƒ◊\M5≠‰¿ŸGÚ57Khj´mÚ¨⁄ZÚ@Æ∆R\Æ÷Wc8£)ñ.q‘ïM_™=b"¬˚'jŒÓˇ¶,Ì&……≈ÈLå‹¨÷/ÏR≥n»ô…„‘&’JK$¶≈5Qó€÷ç' Q||∑ê¯RÏåR;/5ó!Í»Úuà≤»Éd ‚å¸^Lésf˜æ",8	1}≠ÍØ≈È=3Q{Tó2ï‰ªôzX•“gÉÁ®yg®!$\á≤;?ñe'Òº4√Ôßü⁄êTTÉs’ﬂÚ&¶q§“dÁ5&üƒT&‹ã¡æL†=6ı$ßfóJ*∫õÚ˙7ÉjãŒÅq9Ò˝{ßRSﬂøYpÌÖ8ˇ°äoΩ)ÖH{∞‹§ï÷ï∆KÌÌ∑w!èxM≥{
ˆ,X¥/`¿|ÿ)~$>^˘B∞B|<N\ì#≠À@¿=ÌΩß(jﬁ¿æ8b*e ˚—Û˝VA€Ô5
P‚éoX`1•UOÇ›ÿ®Ü
ûŸIx¿–Ã®VœzaöŸä◊°¬ˆ∆∏yM÷$à÷4L'2˘:Äœ∆z∞Àíó˚ﬁ-§-éb¿=t∫ÿéÊ"Ü≤Zj≥çM°µ>pi¶ò:NH›Ò⁄á'†›;°:ç·Ó'«éùªû≤^˘)áùS≠vÿ∏∞ã¸(∑¸ıp[4å;Ø<Y} QΩ’fÕívg¡‹:TU_Kv¢@O˜8yëu™pùæ®WwÈ®–
˘´ª¨Y:X√t@"~º3H tåù≠Õ‘ƒQVar´lÿÖ˛é√¿Ïôw£7·Yúö|ª4†éwÈƒ:√&˝ó9jŸÿ∑_7ÉF!®TﬁbB	À≠ê⁄v‘ÊrÎûkBr®â&!9iÜÌ≠f!ÉÓû-˛ΩpÁ¬Æ∏ª£cÜR|Äy«áÂ›¬gø.{˛âQÓp≤B√e;Bd•£a;y2â“tÔíÄÂGMg∫ˇ¿ù!p"¶∏Gæzê?e+µx◊˛Î1˚∏à™!‹k™ôˇ‚ÓHˇç¡âSÚ∞úíæ	/»%â99|¸íûÖ˚*‡û∏ïÿQoÂLiÆ¥\‘”Û◊.œ.^ù‚∞ˇîÁ≤÷¬¿≤ø”íöeI˛'.ﬂ‚a2ºñ€√#åZhƒ¶jF≠0±à©Ÿ√∑ys ÿjGÈ}˙r3hmX©0gÈ›œÑJi—ÛÊcE]}›lq}ëº:#˛IÔë$ÃñŒ/¡‚qˇbj∆•Ω|=Ùı%gV±Õ—Å}Ë#†‹«èπB˘Éxñodﬁ'ÓH=P#˜ãı ?e|∫LlØº|3Ê8˘8¯¸VÒ,é≤lOÑµòètÁ‚s/‰Ë∫–› ØﬂtT_´67˘@áú1¿ ≠TSâ §÷SG∏ﬁk*§Îu^≠Úﬂ†À˜œ`Zƒ+ˇ.y¥„£È©•7ÁWñ…bÈÔWJtÂ^ò_XyﬂÆ∂7*Õ`[s«Ê^π=Ê±åÂùÂsvædªÈâ§PŸ9CÊJÕ÷Òj≠Bàzâ∑£åñ&c#ˇf∞.de{¡p${ö∆™á;ΩõHb2Ì|ƒ≤“u6£L[b‹„3Gê∏·€Aç*ê£é⁄ÜÑ4˛z˜_˛l!ßøÂ!ΩèTIu≥B 3"‰ä€qtèØÛ<ã˜~º|€uÓÍlﬂ∏+FÙÓkA◊sH6àB4•*Pöi$à&	\9≠xöò´÷≤yÓ∏E∆xvtPÍÂê,µÉˆVãpÇÕ¨…oqÄJ
–òπáÀ÷iL´öS4tâ¡‰-–.»JX¥eàil&Òº¥è€÷7b3¨œ{j0ú‰ãÉÒá«Ydê∞Wp#®÷Ç’Z(_`è¬\È∂Ï°QÓçL∆ïmÌä©”Qÿ3iØ¬‘RœKﬁ C‰"KÙRCbu ’/E–O&ŸÂË[§√|ØHˇOˇ◊èxÅC©	ˆÛ∞ÈYFÌœäò˝)n–‘æ~Å?a±ûùπq≤üFá¯v=¡SoÿµçÄÂ¡€wA¿ò·F‡R“Òûwa™6€≠;ºïGE⁄µÓé•	è“°'˝t∏™–˚Ó4››ÅÏRDq
|HWÂ±éVe2f&ø o`HÊÈ¸¿Ëµ¿’|Wí¸"ë?§Ø˛9∫ﬂ‰
w˝ÜHPu⁄Ωå¢©<EüËñ©í¢_@©K‚"“®ÎÔh/ÁCC—|!êJø72.Û˘=Ê´ÇÍkı6xê«$ràxòG13à^©vca1Ç?jz;ôÏ›ç„ôõnÀ!Z⁄*ó√V–»¨jã¸ëYQ!’ÌŸ:€ä‰·°∂√“€P»PÎ±Ó∆)âéZy»‘7∫5Í‡°†9˙ﬁ¨ ˙ —ÈgK¡Q£O…¢q„AÍNvÉƒ í˝^8\Â"fWø˚˚œ˜©ö{@˝7^˘Ôï±+ó<EoJ5°Ó¯’∞ΩUh«Wç∞9Mwµ⁄›B¸`Â2GÓú† î®oãNÏÁüì˛Ûñ(}w4jˆà‘®e#£d)¿òKã*˜Pm=GÃU¨o1+5HíS´:Ù2Éiz*PñÈP>‡<˙w3∞7â
åá÷ç˜‚π<–ÃÎf'ÉsœuÁ¸èJæ8∏øªÔÇáÈ§Z°ª"Œ1ŸÜ‘i”rìdpP“Ë=¢&;—†»Lå1ÁÊêˆ¥ÒT0˚…ﬁ˜ù9ç¢ygI∞òæßÊëTw5®˚ C^wæ‘ﬂK>r¨AYŸ∫tZÔÌ∑Wﬂ‘ΩŸwqcæœUÿ‰JÜXeÅ¨$Ñj≥X≠`X"?$§‘ﬁNhÏª		Z$®Ô HˆâÂë’háaÉUW¶•É‘rü‰√Kk∞.;Æ`’∑ÆøJGèø’="ëÅ¸?Z˘^w6¿D¡xO%›\Á≤}Ñ˝ËˆÆc„åÅ¨®(oô¸b∫¿TT-É/[#'øSÂÎ⁄üÚB•è˘ÓÔëYïÙæ⁄Ì±]pN’€uR€‹œÖ≤ìﬂN^ÿQÌa≥≤Á–πõÚ„[ñ3¡—é9wçiüÑ'Ï‚£≠Æ˘BDÛ#.p_%Qy%'Ó‹∞$˜±-π∂ﬂc—t1Gÿ¬ôì‚Ìƒu˘X ,=0¯¿ÔÀTÈêŸˇÛÛ˝á¬+˚$÷DòÎÂ´◊å
§ü‹ZQ¯ñRÚ≠ÉÚ‚Pt´hå¥p∏ç0u'Ïy9¸&ª[`Å˜Ñ∑@æP°\åÀm~uVÏ6œF—Â·¡—,á‰OÀÚ¡ıæ∂-¯Êp√£ßÉåôà"3Ç*ø©Õvú“ì‘t(Rø∫F
Ø»kˇÒU+Ø≥$ç”éúÑÄE,
˝ùM>˜ `ŒM·ıê?Èˇx•ﬂë¯ “:–¥« Ä1∏Sß‘àºAÏ≤áÁz⁄èﬂu¯Udhxk·∑ÃÊ¨ïoE8¿v-È¿◊¢ÇΩŸ›WÙéN«YJj∏=Kw1‰z#ÿxu˜j–ﬁ(Æ’¢®Y`æü~ÄŒ‹J¥Iˇ'‰<≈ΩÎÿΩdõ—ˆru3§≠“÷…U	4oÂo°∫”‚°~µ∂⁄ÀaPﬁõ¡]ˆ
¯KnãÛfÈõjó&´oﬂ
õŸfíŒ§˛≠Vs`∏€òÎÀØÒ=y¢∂Õ·M\ù!K‰g¡Ø´d)⁄÷≥+mRπ∞ZŸ1ﬁ\ã5ÚwçvXØ∂ÈŒp”—û»•öî“èü◊ïk≈Œt“⁄©:ö&æPUÒe“Ú«Ø´Gm:X◊yºÍæ™q'Îå¶¨—˝ª⁄≈√ÖW-ˇÌﬁil_ºáK]ˇ¶xÕÉëéê);Ã+√Á¡K˜
‰$	+S¨ob⁄·g∑8ÚfíÙÀÅ¡\{®Æ1åoà¬K	»Ûß,ÌXh4√lÂöe3∏Y:C¯±9∫ß]Õâóπ¥µ∫¨˙7™≠v‘‹¡!$Û-aÌå`÷ <2\ÂQ“Ó·9èAπ⁄ﬁa%8<ºÊÍØD0á°‰äæ‹ÊÛı°≈~úÌŒY]*ÂÜ˛ûY †tmfˆ⁄÷ùZXòõùF≤k™-∆ú%E<÷“Z·√{Ç·Ö0ºÙEÖâ: ¸¿Xj‘˘a<á7vT⁄ ’ZRÂº0 Øc;eîﬁxL◊ﬂ-x˜w¢
mlíÏSêUê∏„cQUXk0ÅØ˘Hæ$F ÎN!¶R*'∞^Lı-Ì’SÓ˚N<•á?≈ÈM:èù"ë”7}QQ”3ıàò∫„•ô—RüX)Ã™Tê∞ÙEÖJCª∑>±“.#•á'≈¢§Xå‘!uíMÄH˙£‡mÓL°ˆ>&⁄ÎZ"O≥HG8£jN^ÈÌ<zºc°9®äéXôÿΩØj’ÏÛ≈˚ü~f*Îô‰·¡N@ˆ¸)√,—ÀÓÏY∞Û•
ub˘«Ω	s˛Dx7páÁ#∞ÿe,°€®e^N¡.‚ïΩÕ»µ±:v°JÀz(¸Aﬁ#Î"¥Éì)›ÑxS;äNvõL©Ì.‚ëÆ(‚'Ê√U©Æ≠±Pñx‹»ã(ŸÓa„m‰âZ˜ò%˝;*È„¸aK˜Î ª¢	2Ç¿'¡Ñ¬Bâ.¢/§X,≤3∞‡ä_|»ä•vHhÎ…P⁄êÖ/‹#¨Cµ*ÀRø8ÍÌ'ö∂o—dﬂy»—Ø5¡éNE˘BÛÄ!ô!»<œ&}©√=bs¿] ﬂ*£˜>6ä]ßStA≥r°W3“√ºèsÛSÀ,4ƒ*Æœ_\Zôû.--ëÂ˘©•eÊUKÕÁB∏DIÎ}QÈı[ÕÓÆS:oÎƒÌ¡‘æVÿæœá˘.oı°ä±	Ωxˇ¥’πCyË÷vµ]ﬁê—◊´≠uü÷jDﬂÊ¿YR◊®u;8B∏LrË&?¿É[*,’™U+·J#óíA§wœèﬂÿ˛£èS%ú+40C4•î‡ç„et¬Xîv6p<IŒ&Ê¢ÕíÚâ9x~(ù‘HÁ©™åêÃﬁ„Œ¶aÒﬁl∫Ö#ÕêS Ÿ€UBèocã™◊4)\jì“‹™óYñ'ÚÓ{#ıÚ˜ ´6"]d⁄,_≤nTËOÔ9åûn÷8olÉú∂∑’‡%`3N«õ-ªÁú‚çÌmëÏ±‰˘∂é˚Àù€ñÇKÎ¬Ø„Üãd∫tmyqjé¨\õΩ<[ö!◊ÊóÈ2~ä\•*oÍJâºπrI∆√JìÈ‰˘OO¿”-&åi∂"â>´∂¶©b†KÎµ®]]´ñy-»¸ÙZÔyTi1®/3HﬂnÃ ÚDpüá—˝q]Y¬‰KïbÕmP5?tcCé'◊>Â®fi¡T$ê¡ ¯85VŸ[≈ÍÔ%ﬂ◊∏/ﬂ∏÷,‡7∂ˇ(Í	c∂[≠Ö\`ï\ŒØæRoRÈùÊúıkå¶J⁄À4„NgñÃê∞dPÇF™¢íÏCIÊ9MÈÁHª≥;ªGÙ~ÍnÛV
()]úÿ¿>yíÚ<–y3â/@§OŒ+D/vò∑tp^ì0}®¡kö>ZR¥‹B£a©_ßˆEuqoV¬IP<=äÎ@Ì'FÂƒùt¶ì”˜∫IﬂÕT-±Í∂©X<›GU° »È
søƒÆ{ªÂûÖhbG‘)I¶µ^∞öˆd,@ZÁÅpÉUÂK»“#ÕÉ¸L±ûﬁ(ÀÛ‘z˜,¶≤¡ˇµÿ‹<”Ω‰¢OïxµŒ"-∞u¿'¿gºáOÖoœ|H√ìÕ∏~»±ƒtÙ`»¨LÚb¨åU™òŸ˘°tô≥åçéßDxBπ:qÔ§Ï∫À’õ5À¡*+qøÕÚπd[z »d6SóÊS6⁄R@§UnFµ⁄j–·¡\ƒ
ƒQITQP´ıü!<‰À‚Io-ØÓ÷M=Y¨—m@{cÔÙı3§ZéÍìÑ€m ÑIﬁäÄ-„nΩ˚/ˇir}}°˝®lï˚B≠Üœîîsá•:≤∆ﬂM°ŒfDΩ»úÎQsá#m˙[¥Oa≥ü«jÏüvZtÑ˚O“¨ÜkefÿπûÜy±£f‚i˛˘æf'9—r=Ñº–”+Õ†≤≈[òŒﬁ6∏ßﬂ¸?£X¿[∏/;W◊≈m°ÆKVﬂ¥~í»≥v∞äbœ\»3é;££»≥¥55®òË—ÄVñ ï¡ÅsçÊZPËázƒJT!ÅP|Y9’o>Ë¢Ô®˝|ë„√@∆#{ãê©ﬂl·$&Ú,sÅJ‹åj˜ÄÕ6ñ5¶Ï&sÀ;jŸN¿Ó#_√∂Dt˘TÅ∑XÙ:BÅ≠_∂®8ñëÙöÄî(Êß Ü /,]Ø¢⁄}µ‹Î=J⁄Q√ˆ}Ô÷\FªBûô¬*˙ÎˇôN]ŸÚ,√Ç˝=∑ÙﬁÁ€'fîãE?P£6pû4ö™4ÑC˛1êPv]Cëd∏√—JYG¶ÌIÊ™≠∂ól`86gv§9cXKtPáI=–&+j…‹r#gô!5vÏcp0—√πÜR(›,◊∂ZÃ≠ëJµñ€§º¥…fÿjÎa+ΩÎhà5z˘,≥Œ$"±≤ïãq§ß´K„ıí'ƒ
õ
Îr
¸†=«°Éte˝ÀÁ_†û Sÿøuµv)®¨á”Ïµ∞&ç‚ëC⁄èg0wõÚ)Ú}¿∂ÿÉ?°aÄa(Ûâ§5(`1πa.ÎÏ5¡	:ûd¨è7…
∂øGB∫’J>∑≤Ÿºû;√n¸Dyp‘¶˘qéÁláA-ÒêÍÄ^j’	9OŸu~Ø’Y1·ñÿj<1øÕÒx˜∏…m<†IÀ?!pL÷„ÑüègKÛÈ[E +lM§ˆê©˙ô9… |â“ìÏ/˜)s¬ÜW√Ï>9≤…‰¬óµB∫ËH ÒåÒÆ§ñK◊»Ï2Y  ’ ‘çÄ.‘…vƒ1ﬁ“Fª›hMV7ô∫-nQãèˆkÉQ66¢v40|vòÆÑ„√#£c¡ƒh0±Z?∑∂^d∆V™.hüZ´∂/–e¢qj˚¬¯–©_]òB˙≈ù[™C¸rï$uö\∞7çˆ∞‘sÊ¨Vg±øë∂∏Q≥¨Í’¯¸®Y]Ø÷Éö<íl®j' Ö¢K§‹A¨Ó0/GÍ∂`àç^»®2ÙònüÎ	xg¢< ∞⁄ÄöWõKÊak*˚/æ≈á~ïª|`µÜt◊©ƒ;ÏÆj≥£©]|O{§t9–£Aë˚éøﬂ
õ;ôr N.∂õ’Õ¬i¯ÑuÙ+⁄Ë¬h.⁄V4∆ê7_˛i?=¨ÃŸêpUêºG±Zßb%l~uöIó„b™,ú◊‚ó∆∫o ∏⁄˚e-EM™«Ñµ⁄f∆-ΩCH∂xÙå–ØÌçê´0fGç∞^≠ØÛcõ…ÿ2v¯YQÉƒﬁe≠˝:‰ŒãZ»’Ω"›C„]ºK˜RÍÎ/ä-⁄üB!8CVQå∂êÇ‡Ì†%Ç|¥÷≥∞"ærôò≠¥Cj<^ô‚F–*t-ÂB¥∑ö∑ΩU¨=NŒ∑ˆ
ùCq„òE$Õ	„∫ãÑÓo&…pNÉD”	≠ÚÂÜ	Ê–È"[%Ë7∫àœ¿3<Wˆîz	ÔWŒ›]æ‹ÜÏ0Z|_b}∏çtU”dNN¶j¨õ:ßFø“púg_^Çî˘èûîü>ø˜°eVã=”g*_@f†ÖGeD2¸#q-0ÏÎ|*?]%Hãw≥WÉ{ÅÈ˝p0◊Æû>`Ã¡ ≥=xCÆ©Õ>,íl˙xYv/J{)=ºÕ<⁄ôÄ‡»ÊÿªúÄ-±‡&ˇªmKyß™ΩŸÊAOI‘aµ¸“®C:+_Ô3√F™Yö¿A0WÈÇnm& ™&\‹€7=xpœéy∫ÊXo∏˝ÏêÖvˆäîvÔ¢vD≈À/èyÕ∂Ü4Ä÷Sø∆09,ji\[›\G§{¡fYŒGsàõ≥¸äv‚äkûmˆIÆCl]H∏O£’ˇñÈb√ﬁËÑﬂÙπ!êoJ|PıN»n<Ä
6Ê'Fÿ¶olÉ˛-˘ªÙ∏3ü–M‡F[ÕÜµ-ûàè]∆n¸µ˘Å*GdÙ}ÑC1L|`rQK- ,?ëÈÁ}(˜c‡Ì0ì≠¸’öj·5…Òkhìòí,ÚÁh+=Œª◊(ù	¬S„øYâ√àâΩ_Ï¢:«u{ÜO6/ú√ÇbÒ∏‚ ;Ÿ†˜¸¿”ñ}>π@¯bS«\ÍN|ÑﬁqË;,YŒk0Xê{]ÀáÓ…ì;∑H/ƒ)fÆ|v∞¸(ÜYB‡6O˚˙4'mHÎn¶ç»Æ‹oM≠Gó^æ ˝õµﬂ®∏µ±jsI]ë§µy59ˇ˙›AE^π3;pﬂü°Fvc7˛¯Xπ/˘k|2Î§?l2ïjï˚r=+¨¥ü≥ﬂ¸ûó^„z\d/Â‹#∫$ÄEcYÜ/› \‚Ö÷$!3Uj’◊ÀmuåÙI8£ `Rõ†¬	Êﬂ´£iLÇºøqS©]ÿ2'CÂtØ±-¬ºjóAm;¬yXñÀaQ)v@˝=‡kî£ÛU&ıõ›O
lè&GÑπMÆ“6[º˚,N√ÂÖq–2ÇÃr-j1«òpäa„í≈àïø<PË‹ù≤OXlQ+p°I˜Î|„	ªF’ámhÖ\“û(4n†°<ıa;‹$ø*Æ⁄‚≤èÙkg7ü{Õ[GC6“ÏÉA∑‚e¬^‰ÄW[n$ﬂº	ì-∆2¿≤¢ùUñ<v”Ïs—ÿŸf.ÏÄ2NC”mxïM«∑ÿÏ„ÜÄù;gW‡ªÛûpÙ Ø‚d†⁄{V«¢Â\wÓ_∏ùÛ∆nb3ü‚[ﬁˇÔdÅmC√Åâ±Fª8@]|ò⁄·j3±0PÕ˘V5‹64'ÉõSÉÎ¯-æ”&ï∞ÕHﬁOÊÀ§09{∑t≠„Mœ∑(º∞xì^z∂/&ø9bÒ&L+zË|0:`e8!d≠ØÍÕ$††çYÍó8≠L>R¯/â‚˝Neá<—áîˇ˝Ìõ'∂πï_±îv¬Œıâu{_UˇäÂ«¡?§πÌ˜N€W8”nƒ^3Ã»ﬂo—IOñ™õ[5Å<$ã ƒÉ^Àa´Mﬁkèl‹C∆j””úôù¬«nY ˛mÄ©˚◊ªˇ˙Øä1Z
‡”í∏¿.KÈ_ˇn‘cøØÚUIwzO˚q`26D„ª5ΩGºÜ9äÅT(§‰ÖÑIÂ},{ﬂ$‚Ä;^>.ô!≤#EÏLWóìEÌoŸπñËI.&|È~l#cóØÁü(ˆ™ì(Ê:êWp¢5ìÚâ§‹ˇç`∞∫≠Ûd≠ÿB	<|L‘]ü®l“ò ⁄UR·S%`≤l5Ü¿»∏j}-BŒàÅp
‹ìçTÎ«∞∞&ÖÕScÑÔBf$TıXﬁ\s‘^÷ÿä’d.
csëóµ¸ßD=Q<⁄Ûı˛z„µ	e?Úe:? „E2Söaú•N¯Q∫v•¥Hı˛ÏµKÛˇ”~dLa3·Y+5Z¸πS?r*êŸ˙jt3Q≥„Ñ$ã‰ˇ  ˇˇ —∞ÁåxúÏ={è‘FûˇÔß®p+∫gC?Ê	Ã2DÛ"ô”pÃv!≠ª€3Ì‡∂;∂õôŸY§Õû≤Qƒ›E:ƒÊîÂñE!3,∞qÈ_eîOêèpø˙ïÀ.€Ueªg ‰6-1t€Ær=~ÔWŸ§gl’6kc[6Ò‹Å”1;µq¯ﬁØMø7›ØMøkt‹	”6Î™I¸æ—6k€µ	‚^5ΩuÓw≠N«t∞ªnÌÉìÕ´›Àd›6∑O≠Ì⁄GNˇåüƒèù∆/»{¶—1=Úã∆µƒ≠SÎ*i€ÜÔü5zÊÃÏ”
Ãû_kõN ->¯Åµæ]kô¡¶	ChπtTkÒ/>⁄¨ç5õ§cxW¶WO¿’~´6≥Ù,ÁJ≠ôeë˜o˝⁄X}2”2€üã÷ôÆhk£ˆ¡?ç.Ãùúú∏‹ù$ÅπƒW¬âƒOég«âÔ[1,[|·&lc∑6yÑ4$Ék¿Ë‰cñˆ]l§„Ç÷›q±1N≥e¯&2¸aoêu◊Åã∂—æ¬ñÅÌ–Iæoxm≥ØTºÉêÔoˇÁC≤ø{sÔﬂ˜wüÏÔæÿﬂ˝f˜˜˜>›ﬂΩáo√ÌG¯˚˛˝^ΩÖè>Ü{7‡ﬂóxÌºFü«∆ªyøœ‰lt«Â√⁄ÈXûŸVLﬂ76LøænŸ∞Z’ô9MﬁÍ’= ˚ë∫m:Aóú&MrÙ(©*Êw
ŒI ‘VmåÙ∑kM +îHºX!Hç6˚[ó≈%ÊP∏>∞mé„[æriKÕ„¨⁄Ì˝›óWÓÓ˛ﬁ«%µÚ∑Tsl–I á1rMòr8Ü˝»m˘"hM&@ã]õh Qã‡L
n‚$`í˜C`√ôÖÙHÑ8⁄b˜)¨<õú˚ªª¯ìB‚3|‚k¯Õ~<∆ﬂÏÀÀÙZÜÔeΩ¬Öø≥—æd€∞ø˚È∫ıÖ‚pÑQF[É p…òÇÌ>Ùƒnë‹wùy€j_ôŸ©éP∞€ënTN]o—hw†ˆ`ªƒ˚ l´Ω∫’˘•§∑k2àK"‡8E¿QÅÆ3≤Œ¿i4‚:«ÈRÆ_äXSÍ˙q∏.ÄÊq	∏éÒG ≤rªváû·¯V`π@,ûÔzµæk·ñ»7	F/[Ì¿
lò#B›MÄ.	‘ÙS‚	ﬂû#†±;‘~âóû#lﬂ√Ôw(
Qäê}ßçÁªf˚ ºÂµms,…‹∆ÎîΩ—øIæ)ÂwÚ ,¿É,«∂`,8W ı_‡´Øß&πwg¯g¯´¢TßÄ3sàêÔõ¡íø‰¥‹≠∑cÿÁ˙¶S]7lﬂîí»§RPÛâeÀ2Ü-‹	9ë
,¬Øäã6|“◊3‘MF€®4˙/XmryiêU”⁄›\·4êï‚§ÂÙAfƒl˚ÈZe◊¢¸⁄Ï^õEF-·‹„ﬁ~Dò_§7zÏ!bÂ∑ ’„OÛ„}äûız=;ò´Ü=0gv(Ò˚¨í7[õ,‹»vgûÆöhÁ3Ì™f=0º3®c◊¯Ml:ä+åN¶Åˆ‰d≥q¢ôíõÛ (=r}åSï§Ã GÅ∂˛¥;(©9Æ√/•ÂˆÙrf@W≤ÆryPMH≤ÑB≤ÊïJù0Zæk`rûµ—Ä…n?^)˙‚&íÖP˙ª[7#ojƒ*ƒ˘:Y∂¸ _#Ìuªf7“kÈDQo%}Ø6ö¡‚ù™J ±ÕÄ0…ÿÏêôî,íï0¨uRÕÓy=¨^udD*‡¥]fˆt.kË.ªõ¶7™UU*–c„_íºT¢Í’}0ƒ£ãñ|E›r⁄ˆ†c˙’èF»Ô~ßjNÅB›P“H2ˆkYv⁄ ¬Ïz¡4ﬂt¿‘ÆxâI’H¸∫ ïVœ$Ó:qÅQZŒ^ÎQŒI¸¿ÿ∆ß‹>©2≤±Óπø± ‡Ÿ¯á^†Evê¬J~ §íˇº\∆T´∆1“R
©lçKÜësGfvÿœc©„_0◊Î¿'=ÿÂz◊´ïRe{ zkïÎ≠•ÍçÇ§0≤∑ffÑÆÂ I`ïÇÅÁà3zá ÚLìQ©T-πˆ‡òõdàå˜`™9Rˆ∞ø ÈjÒÜÙ		‡¿5)‚Ejﬂ30’¶|Ü·Ë‰äy∆Ã˙¿#Ñ°êÕÈ ∏RøN˜±IªË“?	EΩ∏ºFâ≥⁄V˛Ïm!›”h˝ì“åkJ!bcïBé7ÛîrT¿Q2aäˆ]ÆwﬂcJà?◊Ò«u©:BüºA•tîz–àC†˙Òı]©Œ´s1BÇGP=£_≠ˆ¸$ 2†°€-»s{fZv ∞§†
Ã‡˚-⁄èkÈG°„§ÙÅ-ÅÙ™¸rºﬂ;øÈ£xï∞Ä2ö+Ë	´1UŒªÁnÜ†€Pi”YÅ©^;ûVÆZáh©îÎÙ©$çµ1˛%,∏[ÌTìõ◊¸HSŒ–E¸/~d¨YQæwﬂ!}„∏L‰ùhîuÈh\ FV∞]õ‚“ø0ZH„ìı⁄odõØ@6µÂàÌ-€ªûÂ‘6kÕP+L9Ûu0°≠’€Pﬁ$ƒ˜⁄ô¯3{’Ä·QÜSÈAﬂün4¨⁄òéZöﬂ≠∑›^£ﬂu∑6:9>19v‚¯ƒËÒ„ìµ…Òì''å©ì√lΩCIÓÃ∫Îıå‡Ë∫Ã¥=∑tsft≤yÙ£ôÕäçÿ«∞qHt ∫«ì•I9JBﬂq[Ê¢]ç‘•$$çK!È8iÂ[ïå‰Êœ üTVn˙…òj6 ∫/Õcìw§±‘®™2JjLs	ëmå˝«tú˛éï:√ÅΩÑÔ˝ÅÌõÓ,p≤‰ÿ«–P%:í‹|"√ÕßËê¢µ\–àz•'•üÜ
n‰ÊﬁËn
›8ñrGç®ÖM∆„7=£ØÈ+ªŒ;øIZB—ÕÒÛ»UÙö|ÖR[·ë)	Ñ® ±”‡º8ÜÍ¸Úy…xt‡∑g†ÂWtqPÎu(†µÏíÙ»À»/§–>zN·cîNÚÇk£ ^Ÿ6RK¡Ú'\òJYÍuπpQ˜ÎDﬁ“DÆ»“ÓØ¢kîGÑ
-çb“¢D9√pÓ
}wÎìÿˇ \]-Ã)÷b4πÃ›
JŒlOÕ€.@añüQ
MvBÂuv√ùM‘∞-îø©v´üUŒ¢Ë	yJã©'Z1·Fèíbõô?jT™⁄2;z™rO·Ú˙fœ¢Kú¶∞*3á¬"È°M‘À£Tı¥
™n…®uq∂ç* <Ã…smöåë9¥V˙‰HË(bÆ-ê':ÙsË˛â_M$£˜¶8#ó]6FBK8hAõÃt…ı†«§¿4|'®EäjL¸{≠®æ†Ñk∫£u"Œ9\	ÂuVkˆ…sÇ±O¨õZò~Ã∫“‡y∞çÉnù‹* ?C)√J≈ó~ Ø‡,éâé çGÊê˛€îE'tÁ£Mu†iømÿTETkæÙìØ˝“œ;Ç&öÀNH{4Î˙o*]ﬂjïò~RjqZ'fönävóÚ
5NhF ◊vŸ'Úö≤oú}4‘æÄü\´ ì<Ω#íwqOq¯ﬂ"—ærMœá4Ópˆ°§dåíí≠¸«•&D„›◊µ¢&?j˜ß/1¬Ù∞ùÌÁüié©ÙB∑JE˚ﬁkƒÑ°xÕ|◊.YN«›¨Í¶+¿ußií‘•éjI±eZA)÷3¯à˝∞+y≠-à∑aáªŒ⁄SZ§mvMø»c>Gb«ˆh:V0"ΩpÈ§1>a$¬%!Éß*Ãè‘,-ä=LÛ,5ŒF$ˆ”ëmﬁêxí≤Xyª∏mOWSØ/J3ÂwUèÚŸ–∂k#’ÇÓÙ3ÆK7i”
∫aLLD,»≤1p⁄›1€}@…°£2ÚΩÂﬁ#MÏçNÃ’^CçûE?„Ò6–≈Ò≈9·«7#oTØÈ¿‰g¸·«(,–~”≥ìBîäIÍôc'S9Ué7Ix•<Î†òÊ≥%-;*»ÜDˆSA˘Ìè»Ω?«dﬁ%’î•G#JÊ#≤Æ ‹`@˛(iÉöË…ä·¿úΩú∆úcrP4A ù:Yk£ùŒÒ±±Îcù\ÖjiæK˜G\7∂tl=ËöºÖ+ﬂƒÖ{tå]æœ√◊‚0hÊ
˛;£	∫fàw3åi"Œ_≤0MÜl/1ZÛ„®Fc£ÿMËzˇ…˛◊wn-9àe}¬⁄∞µùI3_
›µªz°>D2KüﬁNõ”,Ò≥êx—´wòˇ¸O<Ãï6…– Úâ”I¸â|ÂîóÃ÷G`8Ãq¢NŒû[[:≥4?ª∂tÓ,ÿº8˜œãÛkdaqmviyqÅÃü;ª∂xvçºø¥xâ¨ú[ò]¶X˚«’ªÈh»á\gc1/8Â•2@¸l$5éW2ø´ñπi9‰µ`4#òÒ©X‘Lg9@ükMÚ[ ª±ÊÂ|9ç:\1·kÇ$É)AXŸØÄ∫<jÊÆ≤u£c.9!»2√eÇo¶á÷J∏™DeΩd¿fN<fhcômˆ∆€¬–@1±-/ï9‚è;°M©§ñ£ó<¶C9ÕßFaì£'∆∆OL‘å„∆âVgÚ¯zÀ iéŒrÂ»Tûπ§œ|î˙ÃG!+√;Õe'⁄üÃdÌrß´<	∞;ë·=~Øxv®j ÷ 4ªÚz™—ù8@J!ÈËù Û
+¸¡≈ùÅl'.õ ]è◊€û3:Ê<}B¥à;V”G·ëq≠gC˜‚e£e⁄¯ŒÔæºìÊU˜0&é•z=U8_u
ß÷U8ºS,f‘¡;ecí%“¯…‘ìVeøñ»;Õ
∏Ù˚ôU`_˙Dà•ÒF éí~I÷¥`ﬁNQÅìÒÿ’Raı÷®5àÃπ[π¨Vü7r8'0~IpbaèA#…/Õ¯e,8ﬂëì¯XÀÙ˚¶◊¶˘÷∞°Ì+4du‘˘ÄR|˝˛ˆçKRûF§∞›aÈ∞â€¯ù–{OKêMë@w–»≥gzÜ›IPe·Zj[≈ßA/π±

„ãîö®R·ãshÓî˜ù¡Üdº2>Ç&S ?JqÔlVª“NH%Ó9∑≥çæq •\d‘¢äçÏN)._§‚1( ƒˇMîzüò}˝Ôﬂﬂﬂ˚∑?|=ã—Èª_•A˙T«ùá¯*#∆˜ûêê¶ÚtHbïydiÈ\·ûŸ±=Ç‡∆6™Ôô5¥PPŸ≥K±—1h-«1Ω¢†ÔGIF∑˚Tº_r≈;˝`∏ü˙öŸ:ÿŒ˝ÅZ=®I#nÚXL‹•÷û,§óL]¢‘íy,»≥oo√¬yÑπ˚‚|§4ÏHê0˘Ñ[6+
DÂ¬`‚aø2"ÀÃ›∏NL'áf~qÍúåk…—Y¡∂‘·D„äÄî–4/©íê∞Å1∞íÁå¸ïweLJä”
vÆÆÅ¢H¸•]Ú/˝Ñ9∑€Ÿ¶Ø)cüdY∑K©ñ˘9∑Ùì ;˛úöÖDú¥•ˆq∏ÆÏ*VJa%)^FN/iF1˝§ñTáC≥•í{1µ˜ï'ˆ“èºÅ&f!?^°DÓOX¥)•ÏC≈ÄD∏ÇåV	éxí~á∆Å-¬ä:¨@Â“÷®K™Æ–O%¶@[m›(TQ>£|∆Å\]∏Ty—%"/D∑ó~Ôs;a^,e'e‚1íû≠C£Æ£¥{J!õ({PGhô'Deå)Î7ï¿‡≤∞é‚8îπ[´4¿TE;àlıÜŒ£ät–ôbƒK#◊$E – ∆.`›"a
cO	ù∏™÷€k⁄ÖÇ√–‚3£hmU\jÒ‡Õ‚†ñ›xÌô±óàâT⁄ã^≈f®”ˆôË¥f¥»åîÑD∑ÂBºÎYñcÿÔƒO™ì˙⁄ê∏fà‹¯Íı¿MÛ´?àùR-L—g®†InÖ¸®‰c∆!_2·~ﬁö%≠T$©˝•≈Ñ!EÑr‚>-ˆÓ'»»ç∞Ojî§A(/Vˆ—¿Ú∂%≠®"◊"
*ûE+î—Éˆ†Ï†*l=’wÖí$Q-ë
*v◊yƒŒ,J¢xÚn®Õ–ÿ–Qifä%ãÅﬁeQ⁄Á∆±?® iÊë·8f§Ú|Ô˜lêïëiçÖ–WV=†ö#Ä?E·3ÖÂπB‚!Àú•$ŒWóﬁÃ	∑*,—Ü÷∂ÁÇ1Ññ∂{K¢≈≥Ëƒ∏BX⁄ºœÃkQ(b¯(x»ÎÓkñ>mw£Ïå¸RÖ]©emπHΩâ¿U˜aÂl{Õ≠Ó–r>”§yå¥ÃÆq’riHúﬂy∞[QvÕäx»„Ω‰‰y¨¬%H7Hñ©<Êπnæ/S£ 0ÖÅmñ°–Ç`A	bªVS‘‘„∂ix¥∂—A(∞∏û≤},ã$à+»¬,‰œêÃïi˝àFSqä™iMÌö∆ei§≥J´M,áÎ¶!ê…´·Œ‘z¶Á‘˙û[*y’Íò¯ÖÔöûZ“˜ÉD0ãˆcÿBıÀ≈ß™QÔ«à@¢o†2I‰ÁPPP5´ï÷`õÇèŒ¬F≤:h%Ûc@’Ò:Y núÄÃ˙æµ·P`'G…ªz?Ä¶>Î∂÷zﬂrØSÅ>»Ú3{/UE∏$b—Kc$Û∂Ñ!ée1≤‡\JbÍ0òí›*Àl◊b“°çÙj	l…‡äfuìs‘™¸^1ÏÇ«CÄÜ¬º„ùW6˝ÅPp¢NŒÄÁ¥AbÒÅK^2lZ-±AŒ€Æ‘5R◊£nág~}DY‹KçÒ‡e—˝Àü’1•Ù:ó· s‡õ >EÅÔ≥ÉH#~ŸÖH∑Á%mÃxzy2q5DŒê.õ∂ç™#´}ì¬çÂ+ÜÂ  h±€1êÂ»›Öˆ HCjHc¬@X–•oÇ≤Ëüó”æa…∞ÄöÖeñ7âhM÷	Æù≤¬Çi√¥<ÀÙ@´hR∞†ouxbEa€,-©¬≈Ù;ÇM¢x 6µ“‘Âs!¯ı“}|ÅÙ‡ãRÙÄ‚∂iõÌ¿ÏºkmË\ÑáG9ƒ≠’!„*Óﬁj1l¸¶‚z2·-|˚èá|L’…ª¶4£M÷êJŒÄ‰C≥jd$¶Gèí"óX∂®u1z[R!’Ó–¨mÎˆF∂3ﬁ}Ê]¬5ˆ™RﬁYñB	◊”øëì·.qÇ.nA;«∞ó-'&?A∫µ	˘Ò°ˆ∆.>â≠z∞+ÊN≤,‰'Ã(^RÖ≤˛X≤«ÍdeÒÏ⁄π´Ô-ù'≥Áœ/Û¨¿3Á.¨ƒ©∫Cz˛»Í¥PS?¶R>‡úÛ—k…˘≥¸4≈Õˆ˚ëk©l÷_Û@YÕy÷_Ê8ªùcó |£O≤{˝ÿ¶a'BÌÒB∂‡RÙúÍÙ:jã†otﬁËÀQ'Ú®JdºÜÉËæø˝7»˘µ≈≥di-Á405°ëç]q∆‹°tñ0ÈÀŒÎ<ìLQ^ÛÍÏˆúlƒ|≥HÔ·„º∏≥%§WH∫(%è1K]<§¿ù%	…Vû»Ùc;èÈıÂtµ€¶ÔG¡ôË˘_c–`zV  oí-õ•]Sij•†O…8¯¢9?¬!z/9QÃùÿ†© ß>≥AE?ÂYƒúJJñ¯,§ÉÀ∫ö”≈®¥«3§O–;Ò""+_ÏÔ˝k.ë>§Ì-…ÑeŸ»π4t<õ*£òÁ˝‡EúõÀß—>GÎ;õÒû\ó,’˝»xÇ+¿Òìê2GeMƒbÖöÇIb~õè&Î„TT zÁÔ1ß=∆ﬁÒú…Ë?¡Aå{y=bbªaQ~te‚À¯áÑi»´Ω|Ç„|*B¬Ò«6âÁQ –7\¿x%;üa≤xRIeÂS4:C¬“÷4Î}œº
»ª`Æ;ê«…˝æΩ}∆ıÒªV_)cnıM/∞|ZUé√E~M(ÇM,”iõø6œO7ƒ;Úñ-Àûû≥\˘c}◊÷]€r/z∂¸y~Y—
î◊7;,ÇbÕÌ[m±qxØ+:Ë∫é∏ÁÈoŸ£rs0Ì;©*m>ÀHwÅÚ∞‹Œu9zQBjU9Fh—å“¶ëX˜QŸ&…ÊcEWØX¿«ÊôE⁄ídπ—èR œ‰Çµ∞Ä>¡SëFz-i˛(˚ÏÔÌ’5ƒtwO(ËïfEÙ–\F¬SüyD˚c˛#¬∑H5B?aIF≤âdöT≤√;aÁÉ %≥EÄ‚ÿn˝ˇ«HÂ‚R„‚Ø‡"ı”ﬂ÷Ü6YAÛµ√≈Û€ 9JfóËœ˜i@YÏX¸˛¸vÜ±jÇ®h€ïÀÏê£∂hsëX ∞Âsc<ôë–≠ÿ⁄OªSô¢µgp·"ÊÑOWÇwË™™+[8ã}0%+ZÑºö¨I˙-SU≤r·Ÿ}m:Ñ6÷FóP[J¥`≈V’ Ëaw÷Cﬂ{9ÔΩöªö2¶Í*⁄ÇÊî¶…2⁄°§_Ù8(ˆâ7,g°Xel.’'åìÕ¥z◊ “W∏Œ´qù“gï1Â€÷ª÷È∞Và÷P¿‚—oì 5=ÍÀüJe√Åñ9^UÈ?4!£®DOååe§7óÕ›´ãlÌ2≥ßúÂq5A…„>·≤ˆ-º˜¶Bîe`>nµtÄa˛≤DÏ,û¬ºím\,ã9{zpÚå_mMò·sç•áäìcÃ…Fâ=∑è4è-˚ëQöèúÅà‘(º∞xÏ?ß‰!	‡»a„TÉΩ¢–˚«kìÒ˚ˇÜÔp¿˜S˜çNÎ)5¿…∑„Ò=x;14fè‰E·R#Jiø£ìáZπSÜCÂh’xùp])Fø‰zW¸Æ€'®>ΩπÑÎo	¬UÃ~hú=√K(‡‹óùl^ó◊¢¥`>|Ÿœ§9Z
·!M˙Ód1—~®˙ﬂÑëàª˜¶±öOm5†õúR'@gAt⁄&’≥4ÑÔCu÷Ìò#πÖ˛ﬂQ_µ1Uä®Ä®‹"(˙ÆEw…≈Ào.zﬁ—Û∫†ˆ>¿üåﬁà—Qi°dO“ú!RÁ‹ s&@r€ƒTÁäŸYr/û≠≠¶í5SÉuºÌ«S∆@ÔZò)∂Ñ™Ôπ†”ô?°—£”dùÃ!"≠ôFªKœt?ﬂµl◊w˚›Ì7£»RbN›∑Ã"Ê‘·	÷XÆõ‚€S°÷∑¨˛’.GO*:ë*,Kil¢≥0<”ê32w”üŸó√t).77ñÕÖ_˘πç
·Â∫áL7J≠v$n|çﬁ¶›®´õ¯;Âñ
©‡ù»ëÚ0Ú	=ã¸!ºÃ\$«‡ç“eì≤‰‡ïÉ∞>‹!ë "ﬂ˙-{‚H√pZÍ†Çp◊| °7ó"<¨ãë/¢Ô®j<ßﬂC9˜6Çãò`E•˜8—rxØO∂Õ0Q∫ﬁ√0P⁄Ó'Eæ$ÄáßPÚì'U∞-ØmÉ.Ñ∂ãgG‚w Ô˙04v{…Û{‰
Ø£¸ô—Í™¡ò‹®∂û/˙¶˜éÓ∂Ú>∏∞ï,'ÄÂTO»I˚£EÌM/®Üe¿ErêÃﬂÊUCss–ﬂô.è¶ˆﬁg]ˇ®ØWgŸÍwF“ë	æZÿ˜üpÙ3.˙"„°LG(JI‚cT£ÄÒ§whIds;YÈ=ºá]%KG	˜∆õ9ãatïÑã¸„¨áky∞Ôó2ÕYèE}ú∫£mU•ˇµûø"ΩFÙ±è,Ò G:N™êVD\e∂Ú]?)÷Uæ‘ﬁ^´ÜïÁ}"ﬂ˝v6Ã«∏	’Ü%◊zJæ÷4ªüfÅnÕ#Îû€ãCÌ‡Ø¸=ëu⁄Iê3Ù€Ÿ·6π}£m€Ùt›C[◊4˝Ω≈ãÇ™@Ωc·$#‰˚€_˛æÙ ó;ˆÄF=ÈäÌ˝…„âdè’µŸµã´4ÑaaeÈ,Y]Zπ∏ÃR?¢¨èd`°†	FµÍ√z57tTTº¡,œ˜^kb»j`ˇß‹ê√9™dn»OÈâÙ£◊ÇQàbQt%µâÒì™…i0Ø>Û„†Èe"ô˜‘cÓÌzÖ°•…êîÄø¶ê¨H»Ãœ¶c2ƒéœ’h‘orÑ8j¨≈ñÈp‚DÈ¬›y¸ƒBØP{	"OsÃîéÄŒ[ÈëHoX‚Hä§ˇî;R6w◊èÃ^'ø–/„iÂ“ë™¡SsÍé˜âLéë(Ô»iôŒÆ¿‹¬ÁÌ–ìuòa≠…k1EOâ…Ÿìyi”îÎ*≥$≤∏ù¶ ﬂ}˛?-~“NMTôlÛÛ<#õEõ'¢Q‡±X©ÑZ¶ì5òAeèü]˙:îˆˆjèÖ ˝ΩG3≥Y@ˆf!°",◊Hx‘oï	üs/Àg¢	Agƒ…‰idË≤
„”Y0É¨z=√ÀzˇËØ9
ljXÉqÇDDÅıÖHÖÙtsµÇ/Á›<ı?q7πmÌ˜”j"x.0ÊL“óZ⁄ITz~Ùé›√œWæä–∆√\YT„∂
e¨JØM‰÷8≠
f*±JTÔÙ,á¨ZΩÅmh]R∑áÜg<NO8?/)1	éA∆‰•ºBIÃY|·#~
w˝(70PÎE¬z+&©<f∂"FrøIJRÃbö°∞î÷ª<Sk!ég~àá–‰¯oéÖ á√SÅ•L√˙
YÓ]vQY∫ç@óOSlQ/ßÀõÖÆï ê0¢68CgÒ	7#Ê©pz0ˇ)r⁄[‚î?∆W<fq#ì"Î/,ƒÃ£Vyh≠»,œ2À?)π1&7¬z@
ˆ~!6wGèd\&—ù;LdbËw∑nJV(±/|≈d'PËl≠ØGË‰†áÒqñıprˇ&πY&\ñåúpG™‹áe¸ë É!e…ÒqÉáçSCî≤ Eô∏ÇUQ‰πAä•ÑÛ]»S·O!Ÿ†∏˚·Ã“Ø» ππ•ÂE2wnmÌ‹
9;˚˛“ªÃ;07{Å‘» ‚Öw·©KKkÔëµsÁ©c·"ΩS=3Gñó÷…Í⁄Øó”v˛]«“,7cP¶=û5ÆZLÃ⁄ƒ^‚âF_¿Æ˝Úgˇ  ˇˇ 	–‘