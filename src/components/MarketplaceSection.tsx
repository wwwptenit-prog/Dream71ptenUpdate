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
import { useData, checkAndAutoCancelOverdueOrders } from '../context/DataContext';
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
    const { updatedOrders } = checkAndAutoCancelOverdueOrders(combined);
    if (updatedOrders.length === 0) {
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
    return updatedOrders;
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
      const penaltyAmount = ord.penaltyAmount || Math.round((ord.amount || 0) * 0.05);
      const buyerBonus = ord.buyerBonus || Math.round((ord.amount || 0) * 0.03);
      const isAutoOverdue = ord.isAutoCancelledOverdue || (ord.cancelledReason && ord.cancelledReason.includes("‡¶∏‡¶Æ‡¶Ø‡¶º‡ßã‡¶§‡ßç‡¶§‡ßÄ‡¶∞‡ßç‡¶£"));
      
      const createdTime = ord.createdAt ? new Date(ord.createdAt).getTime() : 0;
      const deliveryDays = ord.deliveryDays || 3;
      const deadline = (ord.deadlineDate ? new Date(ord.deadlineDate).getTime() : 0) || (createdTime ? createdTime + deliveryDays * 24 * 3600 * 1000 : 0);
      const cancelledTime = ord.cancelledAt ? new Date(ord.cancelledAt).getTime() : currentNow;
      const delayMs = Math.max(0, cancelledTime - deadline);
      const totalSecs = Math.floor(delayMs / 1000);
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const delayText = ord.overdueDelayText || (d > 0 ? `${d.toLocaleString("bn-BD")}‡¶¶‡¶ø‡¶® ${h.toLocaleString("bn-BD")}‡¶ò‡¶£‡ßç‡¶ü‡¶æ` : h > 0 ? `${h.toLocaleString("bn-BD")}‡¶ò‡¶£‡ßç‡¶ü‡¶æ ${m.toLocaleString("bn-BD")}‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü` : `${m.toLocaleString("bn-BD")} ‡¶Æ‡¶ø‡¶®‡¶ø‡¶ü`);

      return {
        text: isAutoOverdue ? `‡¶∏‡¶Æ‡ßü‡ßã‡¶§‡ßç‡¶§‡ßÄ‡¶∞‡ßç‡¶£ ‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ (‡¶Ö‡¶ü‡ßã ‡ß´% ‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ ‡¶ï‡¶∞‡ßç‡¶§‡¶®) ‚Ä¢ ‡¶¶‡ßá‡¶∞‡¶ø ‡¶π‡ßü‡ßá‡¶õ‡ßá: ${delayText}` : (ord.cancelledReason || "‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ ‡¶ï‡¶∞‡¶æ ‡¶π‡ßü‡ßá‡¶õ‡ßá"),
        shortBadge: isAutoOverdue ? `‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ (‡¶¶‡ßá‡¶∞‡¶ø: ${delayText})` : "‡¶¨‡¶æ‡¶§‡¶ø‡¶≤",
        isOverdue: true,
        delayText,
        badgeColor: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
        penaltyAmount,
        buyerBonus,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
    if (ord.status === "in_review" || ord.status === "revision_requested") {
      const deliveredTime = ord.deliveredAt ? new Date(ord.deliveredAt).getTime() : (ord.createdAt ? new Date(ord.createdAt).getTime() : currentNow);
      const reviewDeadline = deliveredTime + 24 * 3600 * 1000;
      const reviewDiff = reviewDeadline - currentNow;

      if (reviewDiff > 0) {
        const totalSecs = Math.floor(reviewDiff / 1000);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        const hStr = h.toLocaleString("bn-BD");
        const mStr = m.toLocaleString("bn-BD");
        const sStr = s.toLocaleString("bn-BD");
        return {
          text: `‡¶∞‡¶ø‡¶≠‡¶ø‡¶â ‡¶∏‡¶Æ‡ßü ‡¶¨‡¶æ‡¶ï‡¶ø: ${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø ${sStr}‡¶∏‡ßá (‡ß®‡ß™ ‡¶ò‡¶£‡ßç‡¶ü‡¶æ‡¶∞ ‡¶™‡¶∞ ‡¶¨‡¶æ‡ßü‡¶æ‡¶∞ ‡ß´% ‡¶≤‡ßá‡¶ü ‡¶´‡¶ø ‡¶ì ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ +‡ß®% ‡¶¨‡ßã‡¶®‡¶æ‡¶∏)`,
          shortBadge: `‡¶∞‡¶ø‡¶≠‡¶ø‡¶â: ${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø`,
          isOverdue: false,
          isReviewOverdue: false,
          badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300",
          penaltyAmount: 0,
          buyerBonus: 0,
          days: 0,
          hours: h,
          minutes: m,
          seconds: s,
        };
      } else {
        const overdueMs = Math.abs(reviewDiff);
        const intervals = Math.floor(overdueMs / (48 * 3600 * 1000)) + 1;
        const buyerPenalty = ord.buyerReviewPenalty || Math.round((ord.amount || 0) * 0.05 * intervals);
        const sellerBonus = ord.sellerReviewBonus || Math.round((ord.amount || 0) * 0.02 * intervals);
        const totalSecs = Math.floor(overdueMs / 1000);
        const d = Math.floor(totalSecs / 86400);
        const h = Math.floor((totalSecs % 86400) / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const dStr = d.toLocaleString("bn-BD");
        const hStr = h.toLocaleString("bn-BD");
        const mStr = m.toLocaleString("bn-BD");
        const delayText = d > 0 ? `${dStr}‡¶¶‡¶ø‡¶® ${hStr}‡¶ò` : `${hStr}‡¶ò ${mStr}‡¶Æ‡¶ø`;
        return {
          text: `‡ß®‡ß™‡¶ò ‡¶∞‡¶ø‡¶≤‡¶ø‡¶ú ‡¶¨‡¶ø‡¶≤‡¶Æ‡ßç‡¶¨ (${delayText}) ‚Ä¢ ‡¶¨‡¶æ‡¶Ø‡¶º‡¶æ‡¶∞ ‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ: ‡ß≥${buyerPenalty.toLocaleString("bn-BD")} (‡ß´%) ‚Ä¢ ‡¶∏‡ßá‡¶≤‡¶æ‡¶∞ ‡¶¨‡ßã‡¶®‡¶æ‡¶∏: +‡ß≥${sellerBonus.toLocaleString("bn-BD")} (‡ß®%)`,
          shortBadge: `‡¶¨‡¶ø‡¶≤‡¶Æ‡ßç‡¶¨: ${delayText} ‚Ä¢ +‡ß®% ‡¶¨‡ßã‡¶®‡¶æ‡¶∏`,
          isOverdue: true,
          isReviewOverdue: true,
          badgeColor: "bg-rose-500 text-white font-black animate-pulse",
          penaltyAmount: buyerPenalty,
          buyerBonus: sellerBonus,
          delayText,
          buyerPenalty,
          sellerBonus,
          days: d,
          hours: h,
          minutes: m,
          seconds: 0,
        };
      }
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
                            const completedCount = marketplaceOrders.filter(o => o.status === 'completed' || o.status === 'cancelled').length;

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
                            if (sellerOrderFilter === 'completed') return o.status === 'completed' || o.status === 'cancelled';
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
                                  statusLabel = "‡¶¨‡¶æ‡¶§‡¶ø‡¶≤ (‡ß´% ‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ)";
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
                                            {ord.status === 'cancelled' ? (
                                              <div className="inline-flex items-center justify-center gap-1 font-black text-[10px] sm:text-[11px] text-rose-600 dark:text-rose-400">
                                                <ShieldAlert className="w-3 h-3 shrink-0 text-rose-500" />
                                                <span>‡¶∏‡¶Æ‡ßü‡¶∏‡ßÄ‡¶Æ‡¶æ ‡¶Ö‡¶§‡¶ø‡¶ï‡ßç‡¶∞‡¶Æ ‡¶ï‡¶∞‡¶æ‡ßü ‡ß´% ‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ ‡¶ï‡¶∞‡ßç‡¶§‡¶® ‡¶π‡ßü‡ßá‡¶õ‡ßá</span>
                                              </div>
                                            ) : (
                                              <div className="inline-flex items-center justify-center gap-1 font-bold text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-300">
                                                <Zap className="w-3 h-3 shrink-0 text-amber-500 fill-amber-500/30" />
                                                <span>‡¶∏‡¶Æ‡ßü‡¶Æ‡¶§‡ßã ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü ‡¶ú‡¶Æ‡¶æ ‡¶®‡¶æ ‡¶¶‡¶ø‡¶≤‡ßá ‡ß´% ‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Row 4: Responsive Action Buttons (All White Text) */}
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      {/* 1. Chat Message Button */}
                                      {isCompleted || ord.status === 'cancelled' ? (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            openChatWindow({
                                              id: `chat-order-${ord.id}`,
                                              orderId: ord.id,
                                              senderName: ord.buyerName,
                                              senderRole: "customer",
                                              isClosed: true,
                                              isReadOnly: true,
                                              initialMessage: `‡¶Ü‡¶∏‡¶∏‡¶æ‡¶≤‡¶æ‡¶Æ‡ßÅ ‡¶Ü‡¶≤‡¶æ‡¶á‡¶ï‡ßÅ‡¶Æ ${ord.buyerName}! ‡¶™‡ßç‡¶∞‡¶ú‡ßá‡¶ï‡ßç‡¶ü #${ord.id.slice(-6)} ‡¶è‡¶∞ ‡¶Æ‡ßá‡¶∏‡ßá‡¶ú‡¶ø‡¶Ç ‡¶∏‡¶Ç‡¶∞‡¶ï‡ßç‡¶∑‡¶ø‡¶§ ‡¶∞‡ßü‡ßá‡¶õ‡ßá‡•§`
                                            });
                                          }}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-slate-600 hover:bg-slate-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                          title="‡¶ö‡ßç‡¶Ø‡¶æ‡¶ü ‡¶¨‡¶®‡ßç‡¶ß (‡¶®‡¶§‡ßÅ‡¶® ‡¶Ö‡¶∞‡ßç‡¶°‡¶æ‡¶∞ ‡¶õ‡¶æ‡ßú‡¶æ ‡¶Æ‡ßá‡¶∏‡ßá‡¶ú ‡¶¶‡ßá‡¶ì‡ßü‡¶æ ‡¶Ø‡¶æ‡¶¨‡ßá ‡¶®‡¶æ)"
                                        >
                                          <Lock className="w-3.5 h-3.5 text-white/80" />
                                          <span>‡¶ö‡ßç‡¶Ø‡¶æ‡¶ü ‡¶¨‡¶®‡ßç‡¶ß</span>
                                        </button>
                                      ) : (
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
                                      )}

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

                                      {ord.status === 'cancelled' && (
                                        <button
                                          type="button"
                                          onClick={() => setViewingOrderDetails(ord)}
                                          className="flex-1 py-1.5 sm:py-2 px-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-[10px] sm:text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shadow-xs active:scale-95 whitespace-nowrap"
                                        >
                                          <ShieldAlert className="w-3.5 h-3.5 text-white" />
                                          <span>‡¶ú‡¶∞‡¶ø‡¶Æ‡¶æ‡¶®‡¶æ ‡¶ï‡¶∞‡ßç‡¶§‡¶®</span>
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

     xúÏ}}ì€∆ôÁˇ˜)⁄⁄úÜã3CŒP/s˚ÊÖí∏ûe8í‚x]1ÜƒêXìÄM&™ä}˚\πƒ[Îh]e˚NÎ]YR9∂£SÍ•jÀ˛**ÅÕG∏~˙h ›@7»ëF∂PˆàÅFw£˚y~B „pˆ«Ë f„B£æÜöı’ù∆÷Ê"Z›⁄Xil‚3´[W∂õı&:â6ñ∑_©Ô\^_^≠£À€[è/m¢œﬁ¸/Í¶ÈqæÌ\G≠ûÂ˚õVﬂ^:±€)Ôwù¿FmÀ{sÛ{V`óœÕÕ°]◊k€˚áùØ‚ÛÙJÒÏY|÷sGÉ∂›.WoÙ–∞ºÄ¸˛‚∞\C˛–jŸÂÉÚ¸˛‹µ⁄Ó~˘Üèˆ‹APﬁµ´Áúx)∑”ÈnÔıÏwªÔó[ˆ ¿›¸«ë8{∏’`ﬂ∂º€ªÒ˛Wî˝Óñ´35≠ŒËtßcÀUÕ÷p{Õ!ÓTœˆ≈F˜Ò,vÒˇÅ}#(øˆwïµïsµÖ◊O†YÌVªÛb{§<˘¯Õêè~üΩáû’zì>%z˘dí»9≤<¥GÇ–„ªﬂ˝ÊÒ›wﬂ˝πEæ|Ç?}ÄˇÁÒΩ€èÔ·ü‡/w»O¯ÍoÈe®tÿrGûo˚3=º6Ç.zï˙∏#v0ƒ}¥∑‡ïÖø˝ÍW»∑{=€ªËt¯…Èõ”∫s3€ù◊|◊≥¯ek^äW˚ 5ÂØU*√ØßÊ:z£∫s˚¯Óüﬂ˚_èÔ~Ü?}ı¯ﬁoﬂΩΩàﬂ˚Ûa‡VØnyª=∏ÎnÀÍŸÕ¿sù“‘Ó†º≤65ùOËXaZíŒJÅ≠€Òú6Ç?Âñ€ÛÀ‘o/F_´dÁÃkŒ	êÀ LHu πç/≥æ5,ïËóS»iﬂòFK/°CÕ◊—r~Ä¸`Sæ -!⁄Œå=\º,€Ù4^•Ï»Úë58òûÒÉQ	?∫ ?---°9Ù2ö_òGã®Zôõ˛oF˝hy˛€é∫1Ùúñ≠W0Õ6njVnåèÓ«¨}≥ÜÜû€Òlﬂø‹Ç˘G	tx1<S¡gŒ÷ÑU|‚4\±`ÿuœjÿ≥ªçü{><fB≥=œFﬁ ï¥È¨sÌãz”>X:|œj˘Gl9Œ‡}ÅﬂûÉõoË≠czD{Îºu(Á~ÀY2Ê»åóû5ù¿qà∞,¯˚.≈=	˚ä±ÏÈnz/¬Ë>Ñﬂ¸cŒ=Ã¸¬è!πDXH±˚∂gı⁄Â⁄‹‹l-]¯ŸsµπŸÍú¶‡2eÿΩEy˜€ÍAw†w¸≥–5rÍ»˙e≤^Ù9%Ø;N–√ƒq≈jwl,xÓXm2KèY…,/êØ=ÅCˆêæ3(ÔóÁ[—Ï*xgÙwÀ„Ê%"¬inxPûã∂,ìŒ%‰qmUÊËE‰ƒÈòƒFN-§$¯÷™˘º¿Ò∑€øˇÄt y<x|ÔwèÔ>2ø∂ÑøK[nÍ.LJ¸≈Ñs4hYFr0?8u`#ôl2ÜŸÓÇÒ∏á*Td-6Hzñù∑◊F˝ Vdë3°·&^,ü<æ{ˇÛ1ëÙÔê5Û }˜Î√Á˛àÂ~*æR—b<…U˛Ï–êvò/.≤ã˚c”7∞†ﬂÚÂΩQØ«ˆ}e.±Ò˝.ûí7Às¶\é‚ú‡∆q~[©%Ùóô	œœŒ3W8…#:W+LÁÃüo&xô1S8E˘OÌwü E}D‘9º5>«ªÖ|∏?Öß·ç
ÏÕˇä‡≤É˛ê∆⁄Ù#√~õSa}}/+.≥˛£]À√¬√rü*ìí¶üaÄw_öˆüŸ≥¶Lq“6 Uª˚Â*ë*ìÚ"?süÈ"FI‹Î∂∑◊√≤{◊icu≥à®b¶–C§s]⁄óX«~î‹x$!ÕòJlˇ)”I?8Ë·Á¢}ßt”[Èt”ºYmª?äI-
“\ÇÅ«òıâó‚„+"eeÉÜ2ñπŸãLT ¶â…Ö…‡ë\Æiπâ©m´Œ»]'—≈∆EÉô⁄˚±Á§~∆˚8≤ŒNSC«E∞Å[€"å˙ª∂W¿ÊFDi∞(·g:NáË®ƒv'˛mÍÒ›¿fz˜?ì¸ÇpZjôæçôÈßƒ¸	?uüô®©¡˙·Æ∑1gÿ.æ∫Eõ2¥™ıÃ`üûÔélèúÄŒÆíﬂ%\¨—Ê-R“¯lìŸˆÙ"™‹|√¨I´œÏô¨èXÔ¬πçY«≤ÕëÊ¸¿
F>±ÕMµ¯èS·”ƒü€vœ¡,çˇÃmâc$c|àô$ìœu?ÁwMÅU≤∆¨í« åÿ3¿/ú-ÜÁ÷√gŒz8yx¥‹~}∫«N>∑!>∑!ékC÷∑"≤Sq˝öùLkÿBÖmâˇÓ?ΩOô¿n©9ÒaØ∑9√}Hu€Á6∆‹„c\‰“ç1e;j6πΩà#1Î&14˛]»ü€ÄvDë÷’ê6Y{VLáüí’OChæ(Èß
"ã∆yn.|n.¸>ô£ù˚‹`¯}3F‰∫ê≈êö3~‡ˆ¬â=YÎ2çãÚlòDk\^AÛãËZcÁ“⁄ˆÚµ\>p8¥‹Q–ÌÓXª‘x≥Ô›∂gÌO°ì'sm0IJ Cóê5p˙∞Öˆ¨∂›–°çGe=O¢¨k‘Zs:å≤M.~ˇâÜU´;<‹’ÊîÖ+cz¿I√ÆÂ€⁄‘ÿ!Ÿ´û›vÇUÀk«Ÿk≥œ§ËjîMH±FcôÌa®–¸âHf_CàÙ›˜®Å˙=bó˛åHy‘’{õFL”ËâXy6°H!œY,%R‚@˚àÃIÒ~.)ﬁ«ÿ∫Z÷7á&ä_h™èfëiÉ‘rˇn8•ö≥t!–{Æ◊GÓ ì¶æ,v≠AªgØZ~ó“+|Ú¶îÚLG‡˜¨ˆûµk˜b$´ÁÚM&l¿K∂›Yâö_5b”$Å≠qÒ-7˚‹
ﬂ·-≤Ùﬂ¬ØuQw4≥d8⁄ÉœéPØ	äæ.PB¬ß∆`¥áØôËC»iÉp˚
^%Sß–"∏¥æÛ%0π¿ø8-w∞àŒ7˚ñªÓ¿ñÂêp≈∫y ºõV«j«˙qBPÓﬁçzpÕÍa!˝Hûæç◊¢ƒˇ 4F=¯ô5<í«ØXÉ7Ô "6o„é NÙÁ°“†íG=\9Ω6@´˘˝‘ÓÊÎƒª⁄7™æõ	Ø˙›Q∏f÷ß‡`§Å‹x¬ËN‚ß•ôƒÌV{NÎÕ•√q˚v¿®ÊÜt›vâ∏<YbÖYÀqøWUÍ®^¬ı%ïëD9µFûÔzÂ°Îêì∆∑ñ8N"Õ¬Xçu–Ñ¬å	)…{#Ÿ—‹‹F’pn˝Mäπµ9ëmúë∞ç˘π£Ò∏ôYÃÙKXŒxW™êD∫¿∑br≥àFI∑ü˛=”⁄;√$’Õ¿¿óõ„ØÛ4Ãòøû7”¥èâ†cÓø{|˜7Á†<¸=Q^ΩœCA1ó†+Ó<¯g0=ßî∆oB˜=˚#«3rê¢.~∂∑tbÆÇâ=L{›Íç0]g$tπ’–&â62Ÿ≠ò˘`IΩÉ[*Ÿ	ˆk≥dœñ◊±ÉÚ`#FàfDôQ65ïÊ•Ûå`4¿åç,Ôæ;pÛÚ}µá†Ø¯πæª˘Ø$P˚!ı»PQêÓq¸È´Áª;ú
ƒ]XˇBıºÒ˜:∏'ª”qãœ–>æª'∞ª?'˙‹∑<FÂﬂQÈÒΩ?Oø}K„hèxÁˆù¡“amnŒd—˜≠Ká÷uÀ¡Û–≥W¨û5hÌÀƒÊ&ÆúIÌk“XIŒ¡èÛ÷V‘O~W+<$~bx*Ü1<áØU∞(w
’»_¯åˇI.jœ(Y˝ ¬d01l3m0dﬂﬁW‹(íaﬂ`ÀOÇqd<0∞*ÿÁ£†Ü.¯˚cñÅ¯2*P–”
ùù∂#±I=aHbhF1õ®bé_µ◊¡Øƒ®í\|`0)mX7¶Ih¡î©ÿT77—Œ›√G®ÃèÎU0f‹åÌ‹P˛51ˇ%t5 pö%b8A–¡L˝Ó?=æ˚“?¶∂umoÍh0„ÔE§ÚÑÄ˝	˜ù‡øøŒÚ5>`^<'°âπ’fffÙüÁ◊õn`¿Ì3x54T\¯~¢˜B"∏&´«ß6h€É6≥fCåúæ%Œê˝“uÓ?®˛Zã≥π”¿Êÿ[çxö»ÊŒYÛVÃ ûî§Kﬁ#≥Ü˜såˇ<ñ?nÔ◊ÜÅ ÷Ñ∑!ÒÌ9Ω^¥n"¢Xs™Äx.›D;˙6È©5≥kõÒMm∆v~¸Ó«/®ia]j4w∂∂_E%ànB Òxyyu'ÇzlÓ,„oÀ€kM¥ºπÜ.4÷wÍ€ÕÈ"AP]«\Ô`¨®Z" ¡Ü^Àe lG˝<ÍuÑØ5d9Ë.tUc˘≥ıÂÌÕ∆¶v‚l≤ø4±éƒl-†#Aﬁ‰Ô´ÂﬁM“2
¶œTAüR1PÂTSﬁy3Áõ]w8ƒ*¡ä’â”TxA]Ú7ô+ÛŒÎ‰-1∏KmhD1ÂZÁ¬ò_1…!ôÒ%OãﬁF8“óHà&Óö≈ôÈ+âEG∫ﬁÎÑ1sGV˛æø”r‡t∫Å~÷˚oìÅœo‰9A€¬J_KZóg®≥h¿0u•»ê@V1Å¨ob^ÜN2ŒÁDÚ˚B$/zV{dÅ‹ªö¨Jê…â)E$Ö‰<Í˝*
!7a˙aG≈1ıLhcl—Ï˚N(œ°√Éﬂ‚ÈrëÉˆ}‚Ç|¿‹¥ÒÂzîTs~ˇ€º¥uem◊ó◊^E+ÀÎÀõX¿ú…LƒaÀÊ√x´j:Ï'ñ—‡#é€£ÅNñ^ `ÑR∂ãQJ•
.Üö>÷ÁS¢õ1 ç(løöM9c…«∞))l›ß«ä`
Aí≈	d“üp|Ë$ﬂqŸÅüU”œd
∑ÛpñO¯ä¸ì(áR™{áP›;GIJQÛ ÍjΩŸºpeùS’&3¨¨/7w¯π|€â|"üÀ£«E]Ì⁄≠7WØ’≥´≈®,…W']=ö ˜‡ióJst})U{v≠·–sØ€ÌÀƒÄ»Ò›n¡˝€hÓé`äûA9òT‹XgÃyf‰aÕ1‚pÔzΩA^ˇôÃ|™Ω˘G‚•39Ÿ÷®ø|hÙ1]†I7ßﬂ@$ª&åª˙öÊ˜»Á;…l>Mﬂ¸QÚû⁄"∫\ﬂ\kl^ƒb¸OÆ‘õöEòé	ìA-∑WÜmJ-Á·7›8π˜!°Yl«ÇP2~î`;¢TÙ.Os|;Àøˆt@ú—sÃRé–‘TÚπ†πP‹Õ∑èáàﬁ€Å¢ùrÊπÁÙz+!éa√ìºl pjz∆≥€£ñ]*Y≠÷)4$!¯#zﬂ@…Ë)47}|¯J∏8fœJ◊úá„òO`RByáhÀxù›•hÆø·Îé
{	yèÑqh^¶Â*•Ó^t5ÎÀ€´ó– ÚˆÒ®Ó7Ø®Ó7	‹âN¥ﬂ^$ü=w>g‚QòVèÛï&ü‡Àçıu}d}`«MÈFŸ.Ú[Pl◊Ú H–Nq3˝]¢üBŒróó{ΩXÍÚ#"¡}HÛáòÒLôdDÛ6ô‡+4L·»‰í[ëG].<·˝?#)#)“¸∂˝èv+Hå‡$ïJ¡îv6çYﬁf¡ ÊÅ $H?«0ì:gL	mì÷îÿ“fã§S'0	ÁA(!∆ ,.
¢J§FáP¡	á©ëFAGc8úë.≥dLî”§#lπB1◊ià∑ƒ˘3«ˇﬁMv6às6ã£÷ç°6âíf±—ÿDÀ[W6w"V‹ÿº|E[Õ”ÂÊh"Á±∏Ñ)òid.›+Œ¿4óFù{9ﬁÿ¯π41Ö∏Z @7_Ä	≈MÚ»√:›!°âÏ˝Ã›$K∞∞?îd†ùü•ónRn#Ó˝˘ÒΩ{ßﬂªKˇ{q"ÌÜ„'ŸvMh˚è„µçuN≤må≈eÈŸxe8◊)ºE.ÿ//ú5
=≥-Ø’Õ4$D&<k◊w{#Ã}zˆ^ †.àªF1æO&8ëw@yﬂ"ÒHY‘”lË`⁄(… AÃË|˛dd{„¶^N68·åﬂ^˘,zT<:2Ú6Ÿ¸Û‡â^jfîÂQ’;À+ÎÖc)
†ÎÍü‘®ët±ÑEëuı©©ÜIxeù’r4a	∞{DÜ$
´`’ºÀK;ﬁaAPÛ‡6èë}7˙Ç¨´¨páwπÚıWZÜá2¡o†íA?DÏ.¯rüÑ†¥õ´[	Ω…L1ëkYD#◊.Óùh)∂ÙÎÉ';#ê∑)≥éa K¨˜…ËõP‚ÂıúÅY2KÂó¨ –¸NçÚÒ¸ï#SUà‰4VãíÑÑ ÑΩ"·^‘êé≈ê…ò–l◊∂⁄fyºÁ/fÃ4Ñûï—0f–á∂◊ä eMLp¬àb|c“œNº‘X;?t'‘!ÜﬂÖ˙/m9Üº˘A{j¢èb©∂≥<'˜2¢üÿ3Ëªı®œF¶5MÙ9î”∆BKC^FiÀ££YoËkíig˙(|ágÜ8gºwœªn˚@¶ONÀ$à}HHT±≥g„HıFÉK…XKb!I„0≤⁄uÃ çñÓ(3n,¥k9ÌT£°Åj›%ûáØ/¯0whÆ˜—zâT–{i	)D“2™B∫†‚◊óPUª ?å·Òs„{òù|hå7J—ú-ÿ≠ÕÅ#\;ÖÓÊ6È»ı^ã,¿1<◊!ÈIV(.né~*VSéE4ï∞4◊‰h(ìR+Ùò"5<L…-ÁÉXFıôRÑºËxt9ajh(∆®ü•aÏ' :’ÁÓægI? ø…ˆªΩUádsíŒZD©@îX]íDTãQ‹$}S%‹àC}ú.VétˆhÊWU#¥†2æØO ñ¨Â˝ÚkX∆≈Rk¡…∆s1p^◊2ﬂ áç|“3F‰πˆ(ƒyˆ'∂>!ûá·L¶r‡§'Ü}éj_“s4∆´¢U`Æ ãDL*x≥¨º\5Y¢(øé7.O3qﬁΩ(ˆ,nçÆ,Œ©πøŸs};ˆP~¢X√ò;[^§àëw_Œ¶ú\¨é˝XÂ„";“4Ñ2~Áëêπ‘fF‹ÈTtW´|XŒÄ0°“òw
>•àu5~D∂Vªê¶&6^Ó≤Á≠…`.öK„áo[Xyb6X{0j¥Kn‚Qœ@Dƒv $rë|„πJŒÒÉ‘ÉG\ò“˙à$V«Ωœw—mÇáã|ö62åéxa1
®◊ëTOÂVWcoò‰o.WÊj»j¡™f'Œ’äÛ"8∆ß¯p$©~eN¶ª≈yÅ2¸zíåéd0í*Æ(ü§à4“ël5Ã∂Ü1KÒ£XÂG8äR<LÛ6\œæj{ÅÉWùùÀ»Uüh:Ù,e∂j
•Åï—±bÖ>˘ë$ÛR]úÓ≈…O=A8ky˝l¯’L(«&Å¸G©#Pês≥ãE‚6f±#ÆHÄhE99ësÖ”>&è„—/$Z˚Äπx-ı©Ïàöﬁ¢IËô ü„i≈∑ﬁ8õè ì°îX|E√q~ú~êíÅ{∑¢®ô®å&» [í¢Î∆â¬Úõ0YÆ(Öx8Í˘ˆƒMx√ £	nÒﬂÚzá˜ﬂ˚5ÕËàexó‹cœ/Rs7’»ò¢/?∆
7ê2—ƒ”±‰a°Òz€	ÿdë	‹rrO`UøJ	!±m—Jy”<|˝ÜG-ä•ÑmqROj¯‚@›∂’É˜V
ºë=ÅGå°K#†
f¨FqÒﬂ8ç≥* •òãJúÏ,Æk"99}:.±F?,–d?πR\˜°«à"^-'!P&ÇD˘∏'JÖù∞8ú´Ú!‡—•Ì¸@©≠≥áJ-w∞Áx˝“Ñ~NÉ‡Ëª˙ñ¶„ÁÆ)Ó’É¨(ºüÛ+cÇÊÔ˚à∫^~czz"3IÊr9Å¶Szˆuí
ˇFô≤ô^˙DbD`Tòæ∆…Ω@ÑÎÇ“îÚæ)Ù*«„ª_2fÚ‰/ËZâäÊó?ªcÄ(?∆Á)«ö-3y‹CN-àLâŸ“L)4πWj«öœÏxXh ”·Cô(üëÆ‘c«jŒè5bì¯M≈ÛüqùT«MD+U„?¡Çù‡¸TY>™©å@¬ÔΩ˝¯ﬁ'Ç˝ŒTÅäØ“nNDkœêGè£÷
$ZXò›°’rÇ Ωå™‹†lızÓæ›F4Õãd€èKegäòËØa~˛ãdbtîπ¿ô5˛c¿÷’®6G•Yîà‰ÇßÂ”1¬rbœxæéÛnPã•?‰üïc∫'ÜiÈaó¿=%°£®s◊Î[=‘≥≠∂9úí˙‡‹ı]>…H#öƒ9Áπ˜ÂÙô)Ra_p|ª;d%˛â¥¯alznˇÏŒÿ/≈ [Mﬁ¿Xiqmk¨ÂTπÖüY,2«4/C5˙¶—L‡AÖAÓ÷,Iﬁ:ä\4≠TZ# ¨±/ ÏS÷FQæ¥õ”*ﬂ≥≤;…öO©'¢~±^g∆Æã´é≥?F+W^≠o«J]m‘Ø°Ô~˝¥±µVﬂﬁDWÎ€€h≠ﬁl\‹D?ûçû®(ÈD@º¯ó≥“˙Nˆ†”s¸.z¸√p9|à£m		bJΩŸ¨o^ƒ}%˝+5wñ7◊ñ◊∑6Îh’7VÍkkı5‘ÿD+€[◊öu“˘$0Û!‰KXımﬂ«ù±=I´Ò1œfœ©¥^<d˘å& ^aäe◊i∑ÌÅP/ﬂ’á˘≈“zÔ˘¸$; x	|XW{?µ∏øﬁﬂµq€Ì•C•W¶3p«Í≠‚Óv\Ô`È0ú':y4„8}fÿ∂7∞zB*∞xo†Ç;~Ê
ælhﬁΩ⁄s}[Ä°Zﬁui™„t¸thub+ß∂X|Rt÷ºË.¢f}uß±µâJóÍ€[ËE¥]_›⁄ÿ®„%	ßõ¯Ãe|æYﬂæ⁄X≠√◊ÊïïùÂïÊ4*£≠ÕıWa•äõNXµ…E[JØZ2M¶6~weﬂˆÆ;-[uUÀ≈≤ºÚ◊twÒdÂo≈Üœÿ‘|Ø’◊Ò|·a/ØæÇÆ‡iBdWñ77ÒÁ/Á÷l¸ póõ∑æ&[Wı´BëoC–iMÈÛ›ä,£ú£z˙}@
§~±XZØtÜôã æ(cÎ©PÕÓµ‹æM‚~N©≈xkX«[ŒπKX≥ÛpßÆ‡UÛÚÃ ﬂ≠ÊõœNm¥}ÙäıK5›Æ’ôöVpºœ&î®4˚˛èˇ°Tzya Ë$ﬂ§≤DhÂ«¯éÈóy˙¸Cvnz∂„úBSF¸ê?"©ﬂb¡qä4‹Fò(N¨ål/øç¿s˙rÄΩÕ√)$Mâëø“<`˜ƒ*ç≠g≈*(%ÊE6’ ;?€≠H¢	IY k[qƒzô“MZö±ty´πîÚÔ19≈4∞Qø §≤ææ2âÑÉ≥«ÂUk§Ü®Ÿ®Òîúk3íé-'∫V⁄Úúé3 Òò6~+‘†*ˇ@z)ùÍ4fb√øÏ˙¡eœ»DàÜ\nå#öqàÔyîÅxéBÈá7ãa©‚ÁÖX™¯s.ñj¯>™b(£œ˝]…JA¢◊+˘õ:»ªÉª;îôz‰k^CØÔ ˚EíÌÏóœ†.˛üÄxùÖ∫¯1Z],qS©Ö/J®{ì™8°¿Œ`.…,îìQÏ—¨ï…G(aõa99èe<{wAVò¢ì—U◊Ö¨LÖ+9sl¶
ZV˜∫Û9l[ø\CÃò+QÛ91÷<S%’1˘õœËiˇà9µB‰p_' ùf•⁄mg‘èıÒuqöØh:∆√  ärt?√BîÒÜ≤~ ñ°`oÙïÌU?/«(Î&áû*utï÷ü6ΩìÂOóπﬂséQ`Ä®Öâ'TÆ/ûUËãÍEHd¥vŒ*¢ﬂ+1D◊Åí‚¶ì ƒ¸QÅŒãD)ÜÑ+˛ l ÿıâ·…îjy_¥‰ñÿÚ4–,óæ&N,T*H,®‘º÷ÿYΩÑv∂¯È2jztO-:âÆ:ªx:¥Íˆ\Ô∫FÜK(-ûﬁï…»™≠Ñ˜òñ∞KS åO ÔU[_›⁄-«Í9~∞a9¢K˜#;Cˆ≠d‘q<˚rÇú}—ÈdFÌ;º®f(Ù˘é[: E4w
Ì⁄]Î∫„zãh Ôªn–ùB7Õ(v˚˜S¨ärΩ“4#˙Ì{!V	)qëX%dƒ•*™<i±Íg…ä∑
â*’Oß◊r1éøºïùt®ñπbj?-ıãe∞OüÆêıH( ˛%˜CaWÃŸ;‘(Fú˝ÄD.∂2c1f-fÃeBÏeqí£b0qíÒ jÕƒ¥¨„·çÉ)S9pÀ⁄Û‹æXf»∂•T¬—…:/Yz≥p°p6º2>dÊÕ,ÈëÅ…âè∏›D
∂ô H6Í[¢Ê£|0Œ"‚†tœ /&µbò˜†≤àVñõı5Ñ?_ª¥ºÉ^›∫Ç6/Ì†ï:Zﬂ⁄zÃﬂ∂∂QÈRcm≠æ	nl≠4÷ÎËÚ•≠ÕzS«Œ‹H˝ˆ"dÕˆRkx5MÊ»ˆ2gŸ§≠Xæ›ŸvøkË¿a∆DkﬁÆ6r‹~ä¸™l™≥ç‘Î,F_kD‘8mb\ádY,õè˙ÉEƒ ~4ù∂Ωkyh«Í¯Y¢π–/‹ç®Ó]VV0)Ã7vıΩ*ñ"ˆU(å≤∫œ!√>&hØÿˆŸ7ÜX%°’qÿé.h´Î‡Ñ˜7]†Êh≥NQOdºù=´Áhh`ul»«+–“5{k[ÓÆ”≥—ÚpX†âÂZ≈ãv◊¸wØª˜‡"&k]ßÖ÷lﬂÈ“ÌHõ°uJÅ’â&U1ﬂyiK≤7¢k0HXÇ\!‹+Íz‹Öâ•3M˘mÑÕØŒi±a*7fÇHg$xàô˙)åa∆Sáƒò
è‰r¨o˜VnŒPÑÎgôyˆ0+t!Ä£ı?w∆M¯#∑–èƒîùÜøàÑ@è¯[#Ÿ^˚∂∑ä©xiz∆¥z£∂ÌóÑÀ„ó®|`G›ˇ©–√XrÕX¯íjPÇÖz˘¯¨ÊFÎCN¬uœlV)Qy`ÓÈl]0+[E^A'€‰E˚√Ÿ#ß—™Âµ}t	o˛_‚WÖI˜E‡»ÊLr•¸x`⁄æb	&˙:ènÙÑØ(4ÇP{»ô”üåÜc–‚A¯3>¶v	˘”ÑÚbù"ì‰‚õ`‡Ÿ47í	ã'MÑ0'¥‹l&¡.øå≈uÃf±ÊXº!⁄EÈnF∞t(|Qﬂ·[◊IomÈP¯¢æ#p;ùû}¡∫é◊[Ä	|¸ª˙æ6k`_Ñ	?™ÆVl'≥ÌRP%®‚M’∏ÿ§ö¿Ú´hΩÒä¨‡à*‰Ö¡ÃÓ⁄É÷≠eæÃ6ód\"WìG•»‘Ñ»D"exÿLØ3û˙ÄP:©ıs»7eA#wi6À˛\¨Ú>Ajá8ÌâÕÊC∆˝6æE˙.AÂêúœ∞“Œ|ù»3z§MV•7&¡)À
À[h$Ä™Ê6Y∑AF0ÿµ˛ÖUX˙ÓùñŒïäµ(wD^ÿF6πèÈu„Qˇ8Ìœ•˜9‘^É÷ÁQzm:oDÂã—xµÂ êæõR˜b¥]ü≤KÈ∫å™§›ÛãËj}ªq°Q_ãáÊ”Ô∞ÙÒY3∑ò÷ñbûñZH13´ı&»,ÏÅº†¬yµ1[¨òeRå™´Ñ—ï˚VFRŒ…¯ö¯LD?Õœ	&W¡á]c‡ƒJˇ»Âù˙¶†´∂ÁÏ9v]ˆ\ÖmQ-ıÀx™P^^;g©ÛÒZÛ˝ 
rÅc»6çØ§Òz|˜?»…O≈‡ï?íS_sÜ˙êf?}KcG>@RoπÂëäAJ0q˜P~ûƒﬁË?≠ÃınôïÙbëàir'œ™í‡–q#8ÀÑÇ?Öﬁñò37üíO_r◊”Á°§Ò‚È•4›˙›Py¸ŸÖÉGÈ¡yRrÑÃ1ß!C|É>3ˇeä	
F
‰˜I†zvo‡†<Å–Æ’Óÿ;VgÈ„ ò£Ôæ¸'πÍ»‰è++eH.AõÀWI
q≠^iÓlm Ê&:I¢ØØ÷—÷ˆZ}[G,Qg-Q'âípê»[U¿Ä®}§:&‹ oªÅ[¶Ó◊]K¶™…hq"™*4OÇ&TS„LïÕ¿Ì©∞+rÀ1£»|ney
⁄¨rRÂ†ÈÕ°€ûïÉ1ÀÃ™≤≥Eû≥jVœÌ†Rú”BR7”FË‘„‚Î)ômıl/≠‰h~–´Ïo∑ﬂˇ7.◊/wÏAÎ 5Ÿƒ‡5«ÁË	Ø7û∑˜lØ3>ä¯˙˙˝·˙jYmªÄVÈƒ‡ı≈¶Ë	//ö¯˘LØ-2ÑÙ¬Z˘Å€G¯Mcâ≠xéΩÁõ,QW·˘è£»ˆ d¥⁄Ï±Zk≤’çE©2ç≥Ëé√≤SπªÂ™ˇ∆¢oõJi@ Ñ®NzNM‘≤, ©≈"Qí4¯Å‚6v–Ú≈˙ÊÍ´ëÖ´O˘`©‹zÉy
Ü :	ù Óö‡ßì,ßÊWòFiÿÉ(K1„±∫˝Ü◊OˇZ ÂH˝}Ôäê¥*kdÜ55i]é€y„πñ©†9Ùd‹Ç8ÒB⁄Q±C“…?SµPﬁë##ì_ÂâîöYÛ€OàÖ(4ÿ_»◊•˝´>ÃÆ–ÒØ…¯CƒKmÕ+z?
G∂“˜:ÂÔH+_Ò9a÷Ÿ8V|6‡%ü
QáoÛK¢Ye≠~%Ã›-“ù„∑ÈΩ¥ØÔ1õ∂¬.k`T…ç1MXcÆ…y§2FZ·ã B®Ñ$ñA∏Si‘4¸—¬Õò$µ∫Ds^D|Ñı,Åâ—üŸsm5÷,1qÇôíH÷/ÄâËÃ4øxdXtë‰G≈3¶°5µı“i/Ú«™¬1¡j	Ÿ|)'·QË¶ÚnŸ§qúårmÌÌ9$6uYÔÓÂÎV`A≤@7Ü˛‚Ï,Ê ¸ÚGœ≤ﬂùiπ˝Ÿa◊‹r•6øP´û=≥P9s¶VÆÕü;∑`ù>◊∂Ï›ó¡§∂IEVprœ	ñZû;<πøÑy¯…_,ùùÀÌ≈∫}›Ó·NÏ∏C¥ç©A€`‰5-
ØL}iãA±´˘Wım€oyŒD2vê’µË,ºxrﬁÔ∫^ ¸ê—ﬂÓ®ø;∞úÔ3ˇNêKt^√¬ô”µ≥g*Á m´∫[´TNü´ú>≠zgÛﬂÅgA4Î˝}©ÕÃe‹c_wÏ}pW¯ù¬)∏·¨˙ˆ!5Ã˚ÏV˛5{Å)€wZãQÚ
|GÃ ?u
=LπQeß¿HéÖ#Ô`Õ:¿ö?E:Ì„óÉøMÕ„À˜l+ya/¯WË≈kS“§ı§ómÍuuà5<êAËsìùJwª*Îv-ﬁÌ⁄d∫}
–õﬂ'|	ˇ oÃ}"å‚2=ìƒ|M2à3ÒA\Ùú>œ⁄G3òSö~ßÿî'ﬂÜQ*ô1˛¿Í‡ÓΩ6≈i<Äí[¸)FI^œ t§J+<Ÿß†R·o*áîfrƒüv.ÚDä %SG∞ê¢Ç‘ÂTYÃçNÊ1'’ïH3ô8åt‘NÀ“v±$,f^'Åˆ≤íºkY@ÛÁù~˘^ãâf!€πâ¨^¿Oˇº)…˛Î“‹]¿™¿swù'\g§£ˆ»#Iô†„gÇßÙ†∞t!‘ËõgÁcôá*{EZ+ä%˙—\F≤<2y3ÙæG\=¯F=†Ã¿˘Ï‰gI≥ Í¶£˝¶¿*d{&cÙ‚ZPAùËú´˛©H=f|k_≠™G›K
\Íû™ÛõUê|Y/•Ÿ‘Î”Q`≈<¨(¡òπ5r≤¢¬nù	.ø©Á⁄çâ˘∂È¨⁄Òr(—J‚àπ®‡,©&D£¸CÚ≠<º=ÁFu≤à$∆Ëc5AÒÚ 	Œ¢f“¯B˛}ç⁄Hæ&Fõ¥™ıWHùòMsèÙiXçëÓ6"‹¸KÊ+T«î…HøÕÒÏ•´ÀkıçW—Í÷ïÌ¶ÆΩ4D}n'’µìF>A"vSù'~ïàÄîFq“ﬂhevn ª%ÍèƒàÒÏß™2„µ∂î⁄~˙êÎ_´bdˆ˚ùLLoÛ¿ÕoC‡ì5ûJ-êÙ]<§÷hör¬Íß%
ØâEgêtî{ü–ÎÔ∞…(EÒzy%≠Èß>∆ü>„a∞ÏŸòNGûàòÄ≈£.è±eî˚ªÅ¡∑<øò]ﬂ8ÆY≤õCè%&d”H¸&`<◊‰æÁö,¶§"GŒ=SzúÄÓ%∞´öåB“Â»îÙ¿ƒLY>X¶~ævì)Z„LM„√:g*Oo˘4…º§…l~éøZ(*aôzP¥Ãû†äò—!"0º+x7,“N:?F≠¿UÜl®àrÅi…˘t÷f≤‘ÒÂÈ˚ÓÄœo¢–≠|ã1o¬0s”Ò…œﬂΩˇˇÛ—˚¥UæssØÔ∑Ó$(3â≠ä®¥VHk2€|y;…Ò/x∂M©QÑ@ü"-òΩA ó»€u|Ç{î3∞D¿…!ˇ27≠¨Å¨ÑÜ8é ]s˘j}çÊõœ¢ÀW∑∂;Xπ£VÆmmø“$yÎ[/“‚*'—E(√@J6§∞ß$ I“¯9-WAQNBÎ∫âR(jÅIq∏[ÆT!}†≤¿Ú“:åuÕˆﬂƒ¨t›Ú:6j∂<êf.Ÿ]'—OFX<D´¯IñUıaµ`g6Õ&Çˇ≈¥Õâ…Ç!NöngöÃ*ì7„íNeÀ9ï∏Ùô¨UÃøc1cñKº÷ob`‰tr\ÙfÇ¡íãŒ©RßÒkı∞)`l´QÕ∞7±æ)‰/ıÊTSvâÒ`BD-Å}™Ñ‡ ä¬° „C/E ÃKa÷TfûZÉGáV(	ÓÄ%¬∑	ë¶˙/a íƒÅ^˛Wöä∏Ö‡!T¬ËÒèÕœo8›ˇTrçbFLR=UßıÄqÂ{1#‰6˘SVr¢…◊B” 0¡7.<Aiâ XæSl)‹˝âÛgÚ„[CsÕP_±>±≈Ω0–wõ=‚]h$	éSBéRÈÄº∏ßbgs◊ã£ÿÚëe8À…øïûî0[Ã–O¢¶ã©Òj◊˙òˇÆXûÑΩñB⁄DÆ&–rû/äî©"øÚÇd¨arç’ÎE4ET2Rsá^$+gEÜêª#Â†€4ÛëmÄ#±È§vó◊¶-©lÕ0—íVÒ-∂îãª≤T(IÔ[ÜiˆÁÃ *_ıôö»a∆⁄S§@H;/ñÉHbPêéÛ¬Mqr& W®Å*“Èƒxì _»tÔ∆ÜIÉ⁄A©˘πÂ∑à¡Êo∑ˇ˘ˇQf¯…Ÿá©˚
t#Âù««o˝=µÒPımn4é‹¸›óˇîDlx 4b,˙€Ì?|∆A"C9ºr•a(Î•+‹a6•c9ÏˆF6á¶ß2!úà€c»©ÖÂoù‰Bàèq‚S®§≈„Ãaﬂ_:≈7TdˆåOct˜dÊ1næ¸hùH˝¶
ä›x^¡äãÜïCö‚.qôY”#ΩÃJdÂﬁ§ÖõÔnπI¬v*ÅIî∞‡Cq¸ìBö ÌÒ≠‘r ^≈⁄,m8ß?Í£*ÊÙßëÎ°z†fÄß_&o%UAÙö√§8_F √XI¯¸41V‰›B/P†*:HúG^®‡ágn%^);º4Ö€Vô£¿mï”Gc€#¥ä◊C-¢}ÎFy8WüãÒ‹π´k»;ÜºTüıyπusxœÃ,~Ω≥ ˇDΩvÔû˚¶]Æ±Â)J´z§ÚÚ¸„˜t<s_&Ùih˛ª#‰Ï›¢e\C«}
¿YiFﬁª*Àü¬µhÇ¶*ØCó-‘TfãÉóœ˛[!HÁA+ áNMP§9ñt¢Ó«∆ˇÖP¯=¨OÑ÷øw°{¿-¶ﬂ˝Ô;ˇ˘Ë˝È0'ıù>—Sk"≤H‚[_Y⁄¯˘Ô1„‰„œÓL¿>˘‰dF˛íF˙óKSÀjiQ£Ü€çÚiıãjÎû≥Ê¨t†ªºöXfî∆(¢∆gø ¿k`CÏ∫√!ﬁ!+VGi=§$$œròøÅî&vÂÜ°UÆ&dNLpfˇÂ∆´—lmπyie 1 ¥sYn]Ÿ!ﬁÃî´≤Ñ%Ê¿±z|ù%·hé,HºÉ¨§Ë7˙ÖGÇ·o>≥ü√Á°ÎÂ!-<JæèvÒN)ª{{¸V€˜±ºm{SØG≈DœÈ41Uæêâ¬ëCŒ2)§:yk‰<∑F&§êZ‹/õI$ë^·q∑"–Ÿ∏77™7-´0ß#∑•c@∫nÑÆ|¬:ÊÚ ·uÖô<$˚Mn$WH2/èL¶ `M‚èÂ⁄î¡$”&!ÔÑî"+t ≈?$Ñ‚] ]ﬂ!l˜k‡uk,vYÄ)íß%Ωry`∏›ËødÖˇCn˛$|>çö˛ÇÛﬁGzœúJ\ƒì d[j≠ƒÙ»Ì8¥mˇb‰xv{ZbØî^ì∫2€®òI± ]*i¡ÛV4.¯¸?®OV»{*πvN°¯‘B„€ø†Íü
qÅ_vÛ€h)Ú“g¬uwπÖô¬ Ú¯ÈﬂAÎ-ŒÒÄ2∞H6ãΩ™ò_¯7–>…=cÔY§ÿ}¶M/ã˙pãsƒ˚°_¯?Ö£,±M"≤iQu¡ÿ,rGÉÈ§·1Y“`(ÈπC{∞<
∫ƒIú&≠kH‰∞yÖ∆I˘iIë¡‚r&ùJ9L2;’¸*ÉR)á∞Ë"≤óÃbkÚ—˚ÒâË‰ïÑ*®dØ…KN.”IÙfÚºTöœYTµpQ=πàÉÑ/O1ˆ¡®∞ªzZâ˙Y*‘? H"•eÈ∞’"*k…Í}R»JQh·≥)¶ÁKÈN{ÈDÿ©≤èü¬∆qé)¢-Ò4w´Øºäv∂.£Kıe<…Ë$∫–Xﬂ¡V∑6wñõ¯Si≠ﬁ|.Ÿ⁄\ïy9—+ê’w°ÒS¸26Ö¯œˆ+ıùÀÎÀ´u÷X°R£¶($Ea˝Ôeuã]L‹€æn∑7Ú@8¡újéw2ºøy°‘eK.ƒÏ
Œ¬„‡CÖ∏»ß”‡uÄOUR‡aéaíKá¸ !øpHÆì#V«ÍeH8gÍâ5≠Ø5Vów\ÆÆ◊ó7— ïW…ÀhÓ\Y´oÓà⁄jÙÆd”íÛõWB8ƒ‚ 49(¨c_ã	 ˇÚÚ rÕRA°‚,f].·È§Ø|Ø§+hΩ±S«£|/®kçùKh£æM∂7^~"8π^q∏∞q·ÕÁ,·]%`GÓ˛"⁄Å4
Ù"‡≤ÔA–ìh√å–
!l™RÆcÑeQ◊ç–a5Ÿ≥2R*2µÖ«É§πíê kÖé–»Æ≈>âÿyô˘AÁ◊≠w¨Y~w◊dûb6,“Tv˙z*pÄ7ÌYBÆw?&^Üﬁ3F ◊ô9ˇ…∏…ıim
©k±zqN:x≥Y˜iò°*±"÷YÛæÜl8ø´Y™=ÙÒ#Asª-Q˜så
JÂ7ƒƒ+Gw7_m,BB sy¯]∆æ…)¨„†á,∆∏ﬁvF{µ¢ãÈ≥l cã%r˝ÖÖ3!◊ÁFÁíHSY]òJ`GK'#—oÖ|«áÍ[3il¶ UÎÖºS5"tx…ë.Z®[@°N]hΩPª”‚·t2±	´y/}]Mò˛˛√Ñ ∑
æs"∆§ﬂπÊ+V˝^(WÆXOXŸ⁄zÖJÄ Ôïâ~!}+Àró4o,o—∞¿ÄP9¨%ÃÒ–„HÂfˆÇDj∏í¬(*3Pˆ·_E(Tt…ÌÀ¬ß¬ûÁÏ	ΩQºÃÔ è1ØŒÔU¨cÍkó¶vG§D{Œ&N€Dü¥∑¬]ö’ﬁ•ç¡Æ{#b${Vœœ.+OÓ⁄tÒ“qZ$]◊◊ºqB¡U⁄uÍâ∑Çb6lÈ«ˆ√¬®QÇ¸$©SfzEy!YÆÊNbˆŸ…‘‰;à≈!3òm(b≥y¡ä 6^fï€Cùb*,ÊN®të:Ï1J´·ˆ˛+aƒ_©6hI%‰A|ë<—G≈·N.ûCùÚÒD≥
DÛ„ﬂAb<≠Ãt2¨crå»& ªà>ıÈÃ´Èı1ó«4ä}-eR ÒFﬁ Îö,ÅÊ…y°*«s*\Ä
á–4„ê„R¶≠oÌLe~z< rƒtx\;à“®PÄhÀÉ™D⁄˝¥ﬂãc}≠:S{5üüAﬂ}ÚnnyN∫ãínxT8ç‰Ög=ÔŸ†KéëΩ@28§±Ö9ÖâØ ÿÄ∫ Ú›Ø7^$nR£]	ûÕ∂„aÍ œ!Ë¸òƒœY9ä‹ea,Jp∞2∏ﬁ*åª®u|qºØl‹Ás	®∞\ãIvæ≤0âÅ”zû•>–Ö˙3ûmµß≈•Ã∆¿l–^N[ãÚóíµˇÛê§2Pv5HuÑÌ?¸âL„9≠áVã3πJÓ˜Å^ßGı‘hˆ}"∏•\⁄¥ Ÿ^±{j≤≠;ÏÒH˜@îÿÄ6«N<¬á4z2t;>lFfÑÃ
êm˝Êr©∂ÏÖ<=¢}À◊$çë‘f¿ZcIéœM$œêâD ≥{n#yjºÕdÿX@‰iÄTô˘íáıí‡_IV”t"e6€6=…Y$ {…jöÖÏ@£Mx≠U‰.ﬂkFõÛ33˘ØŸ •í_ÿŒŒÚÍ•˙∫≤Ÿ∏–Ä“z≥YﬂºXﬂÊQÑ 1*ƒñhÃ‰µK‡Iæpe}Ω|≠±∂sâ6ÎÀ€´ó–O!ò≤æ≥”ÿºÿD+Wvv∂6e·©§ô9Ac˚b¥‹Ÿ$ï˚ª¯Ô~˘5LˆZ• ‹‹}±‚Ÿ˝È◊„qøzıûe(‘ﬂLÍË¶˚ÂØF6ï°md’`m¡'3“h√t$. Å)2H’DÂ˚˝ôWüG;Ò—o•^©Õ1¿†Ï–ƒâÖcí÷rcc‡–çèÅ√@r£G¨vÅ‚%	ıW‰KRpd»
Ùàcd‡µﬂh)G\ä‚≥Ω3¬®ó’37Rjk:$q˛lfŒE,ó˜9CO™s+≤õÃ^Yà‘ê∫ÓπÉu{Oäi´ë¥"Íª˘e•r‚ÑÿU™‚Aá¨ßﬂ…]’§ÉÑÆÃX§ºnﬁ:D¥rÉ¨(∑ô{Fòu∫ﬁC<¸P$„
j[≈‰6ß9/+K∂ŸuÒkÏóÁòt1QUÇ‘’¶_÷Ÿ™∆84÷Rf‘6π$˜O	Æ¢I&Ó≥∫QEåln;r0ÁxÆ~ùL|ZoB.n /$ÃÃ•ﬂ¥¬—˘1∆äVÉ;«ÆZ±⁄õTØÀƒ˙„*√l"˝áÄÖ’¸5¢µJ§π–≤/ô˙FıÚ	&y1˝ÄÜ	≤iV¿k-â‰é€'™nó¸UÔ+Ì∫~·3^b@∫wí—IrsTRÖ—ºz%	'ùŒ/Hg[YîÉ_êÛ:≤„”…ìåQ'>}ã‘F}€VÇZBm∑5Í„¡ÃtÏ†ﬁ≥·„ ñ†"£óL~A€»ï™®«0Õü4”ÇnÊY”åe≤‰RÕE$ùÑê•-[—TZèöÜdÖ«√ëªÍØ:m€MƒLì]ãˇNJ&:.ãtÿ≈O{ïí´Mó)ƒt¯∞ÍB≈B˛Ñ°§X®óa>W≠^/~¢ã5/ù.Îg¿Fb$h7cU„©˚á![ª7RÎCµÑ⁄≠Û∏K¶ƒ!´ÑÇvkfP™
Lâ≥UT&Àä\v 'Ú_ò3éTÂÍ˘A…t!oq^∑VX:Ï«_Ö#Œß7]ﬂÉ	éÕss6$ÌîÏô ÍË3‰aôÈ9pê‰.ñ…lvµzSIÊ¡©D5Æp?E∞*CíâxyÀ∑H‹ †bÃÃÃ‰Õ H\¿Ñ—◊ßDÃÚ4ÏapË¡Í‡»ü»≥ŸEÛ",,£äÍHR€Ë›Q@ Pà LOAΩ*ﬂD_¢Íô≥ë∑Üü>Ô£yd2≤§·Gõê.˜úÏ8LÿZH9∏ﬂAE:7Ú$’ä‰¢P†ò‘d∆µ≥ÚRÊ
„Z~jØ463ç°©”mOi¿ΩÏÕò¸ıß	Úƒ˝ITΩ=¢øC§Yî—‚5(Í√¡+Àfk¥¨û†Õ6?~TR@'´…\!ÇŒ}1˘-•Â
gÙ∏L¬áí„âyºCë‘hË≈0Ò_<ÒΩ†MdüºÉ‚àº≤ÁÆN“ñƒ
<	”/-∫ƒ„ã5M≥iÛcå˙j”„—õ`…D¯vﬂ¿V2Q)√˘ÿw⁄v¬Œ,µ¥Mº‹OºtyßæÈ±ƒl‚§üò)3„Ç1äˆ	≠<
ßí}5ˇ≥«˙Àî#e¶ÇgŒ†8°Ò{ºv&%/j≠¶qd∆'`ÛS w®Óë^O¡Ò(˛`H.Ú™äÂR√¢åˇÕ≈hì:÷•Ú™ªeêl…R…«î-í-QrÆñÂØÃ\2Ÿ2öÆ1òÿmsÍ∞Å|V1ÑNœ+G6¯€ì¡wõ0ÒˇW2ß2)^FïŒE8ee≠Àj
ã?%(F∞|qëUQ˝r!œ9L\„À‘+éˇ˘Äëânæ¶ÎP”sÊe{—Û»®LHN÷3%’p1óLF4—>5s–iÄv-§ÂZîîƒé ⁄ﬂ'œ°pe≈•≠.¿1‘iA¯˝≥u|∆üÕ™„–ryÒÇ8˜©±?ß"7}JÒ0´m¢Ñ\¬*	^åÀ∞ä/,®S¢r*ñàÈüäËO	ê£În‹1¿ØÑ0ƒ|ßı)Û#(ß‰ËV®±CëÆ(2ÍqKK
Õ7‘F¸VöÍ‚ngÁµ“Z2‚S ™ö÷8œLƒ\™∞E˚,¬¢0sLzÂØ5D7¢ªˇ]∫ıUıê
¢2(|÷’<tL=X"—Z@™eÆZÅ’s;«pëè∫¶ï ˜dÛƒt7TF15X£§.Dn1|πÈ“«”/æ{öÅÎ©∑èéé*|M`_Õœ(1≥hç‡#Pc‹ l´Kî<dñ(∫$ÅS´^éπ∫gEòMÙª÷‚6¿K`E∂≤´:l!+mØL˝Áïtﬁ^6òâ†ãƒÎ =$˜ë∞â*˝'2bÈÂÛô¿ù¸ÍWhæ8Ü¥∆n^òâCâtÖßπçeâvœ∂÷Ãt>∫ÕmÄﬁAf S˘}MÂËﬂÖ:Ï|L˙36hà1dÃúËz»ìßIÍÙ·ßIíÙ°7éú"’fÕyÕsá∏ˇY¢˙af	ûÿ„ë°ŸvEåaú°Xlå|ÄúˆINÁ∆ùà¬õç¡*rÉ›Ù!§blˇbnû,˛¸R:Óπ°B˘)ê$RX‰,Òv‚ân˝≈ŸYßODâ—¿«⁄Æﬂùiπ˝Ÿa◊‹r•6øP´û=≥P9s¶VÆÕü;∑`ù>◊∂Ï›ó!viœı˙Vprœ	ñ∞b8<πøÑÈﬂ…_,ùù;ëÁı#âïb«t“œb¥Í∫û÷NßúPò*ãUY≤« ÅÄI#m¥∫hh&L¡öílU`≈ûø‰Ÿ9b∫œÉ∑–†äpê˙Kå,ÜDÒ≤;ëÉª◊∆gC3\™I&iP>Ä‹[≠†õúk‚Ù¡Å¢§xv@äÑ-`ˆõ{øÃã-#©îîÂ- ¸‡òÎHÑÔŒ—]Ë}ílkß„uŒï∂bç√Ñ‡µçƒ0!¥V≤Œ
∞EŒäÖµ∞'Í$r√qli=
Q4zƒË⁄LHŒLöÆ—C#sTôQ≠ı.•˛´Ñ≠MVB+=oπ±YÃKÏçû˚∑€ˇ≥ÆÛÎã(ΩÑ\≠ŸC≠–8ù§Xv]rh%Î—√8wÇ9Ñ4?BhF]˚IØô‹|
zHRtBÇW·9[ê†%Û∂ƒïXIëSE+ã¡°πW‰qB™5≠Ts“.≥!«¢öò!P. ÎÂöì∂µB›Ëï∑®€r¿#UEÀTìœ“Ê2ıâGèx£Û≥tÈÒ§6!±ãƒíw…ôsµπŸ•pÚD6‹∫€Ÿô€çuåwT˛¶ëX≥º}Ñ;jÏãŒgé,C¬Œ*Ã0˝dÑ7èû8ñ>€¢€π¿Œﬂ∂z´tAEæzg+…›GÒ[4.ºÜ◊ÕÁTU4µîÁgvÖú¯.*`ñmq¡.Ãáû9t¢÷i9o$1<U¥∫µ~ec≥â.n7÷†"-9ö^DÎı;®ŸX´Cæ—v„‚•R
RÁWˆÓxN¡ cÚ1∑ÌuÖØUKM√«(Œó[Ø9uÜC≤àV›ﬁ"ﬁÛx%pª«¶u›ÈP7©~xíàf`r eEº0Ó:-Oé?‡ÓóÅÍñÁ°∏ç◊úñ'A?„Ωk‡ñÒä<@´`É—ã_ŒÄz‘œ 	Û§ﬁw-Í|^V≥:¯}Öå$=)£råM)AmØπ"ôíçF?˙Z≥^∑AâmE<∏:‰∏Hyåƒ/ÀJ“¶Ú21@ø¶“
yf‹2Ò{»z´Ts-ë›kB&‰t˛5è©wNDI¬˜ù‡,oãÑa£MwˇƒK˘B£qÜõ&‚©^v•f¸>iq¸KmΩ…-IùúÕ‘äÈSs6GÉ‰¬Ë˙t6U⁄Yã ®(" “Å Û: ±
0ròò§ö"ƒåvdÆ!WÇDùƒßˇA.~õƒ~*¡‰æâ|˝IG’…6Gfßµ¶Mî,Ã?wûˇªdIæåíV’ô¿]w˜mo’ÚÌ“Ùågì÷“Ï?¯/ŒvN°©)Hˇüˆ¿	vA@…Yø9&PΩå1ÂÔ )4aı¢∑”¡‚¬ãhæºÊhkHãßA.ÀSeé#ò's zWﬂ€É(F÷…\UìtÏ(°<Ú,J‰mÄóø6ZÄÚ◊ÌΩÈdD[ôu5‡ ⁄k¸ñRÿ†^ÿ¿û5è‹[Xª=ªm–@‡hÿÕ∞înı D.3L¸‚Kluˇ<†ùˇπ=ò:Öı ~˙†a‚ |Ä„£Õˇ‹¶#ƒè˘˚Ê÷ÊåOûÖJì«›Dò¥∫Ë0è•êJ,Q√:»GÅ;$ØCå!ØFé/ÁwLaƒÖ¸›£AÀ*ƒ◊M>úB&~ÌË≠ <›®ªÃÑ
!V
ÎπÓhò§GrÀÂæ%©'ƒ∑ßÊ∫?ÕLûÚ>~—|BY‚Ác°3¸d:G:|ÓB-'(äxØE+mÃ3%ªKNûMY{”•ÕkÙ2+™*9&_~%!D@‹Û)MáªaÎ¯ÓWƒ'Úç˝°µZÓ–ËˇªÓ[öô%ÆMü¿S'@⁄JxœÇª˜ñ…c≤üì‚*ôíÏç |…U¨√ÙÌ™“®-m≤€ Ùï”ÕX©»„nÙÅì’Òô P≥M¯òù¨‘∂D†%á¨ézæ≠∑í}E6äkC˚5¸4€∂	€ıXæÖ∞wZ/a”ûù8≠©•4ˆ¸≤\ù+ §Íz&eQ‘8∑·z6»Ÿ<∆4}÷‡#È?àÄ8˛Û48·ŸÅóî+ìÆ3∞ÃàÀÁâ⁄(!  Rö°MUXûÔüe]¬eü⁄˛;¯À‡M„ê"®D¥%zLlx◊Wm/¿r°:˙]_É◊⁄Ñ≥§óZ~Ñ°]√ªL√Oöf»◊Q€ﬁ≥FΩ\P]847ô^‘°V0óV‰!!ó˝ÄTó:ΩêUA™ò[!üH¢	¨_höØÑŒ?Œ∏πëç®#O“ÊÆ—ph{-À∑ì·∫rﬂBE9ƒÒÖ10è~“|HE…œiÚ
:I?HFì&)ˆÏy}˜øÑΩ&∂Kﬂ}¯>¢.fì®ΩËõ9Ä9ÅÆ€†ÓÍÿM¬á=°xÂˆ4äe#ææßÃFcwU14:ñÒêﬂ
F‚ö»«ç#líLcr7$ìg|.∂«v¶úKˆ¯«d€~{äC%0ãÙm≤W≈$êœ…˛ú|~(3‹vju1é_$ûGsÛUgPsﬂc“r´ÖﬂbÄöv+ß|ÏÅíTE ùív
'&~S¢ﬁﬂÖŸ‹ÑúGD~7	Ûßáúòîàπı≠Âny˛4Çm¥◊√|†éQÕ) @R‰5˘ÎéÃÙ≠a©Ñœjñ'	˝3 ôÙx”>Ä⁄g≠ß≠GËQêﬁ“#åmb+ìTóÿÜM¡√2†‚ˇ0oi, lãÓπÊ®’≤}√Ôîﬁ Ñ‡èƒ,Û%Yë_Ä±fÍGáº√7ßr2…®q'ΩvâFW 1@L¿<Ù¬Ü=;2Ù¸Ωå∫Ñt, ©±õUœN7ëçÁ|º'˚vØW‰—¶Ôy«È€mä˘©?55}
a⁄4g‘M)ÄÒ‰4*$l‡ëD†cè≈æ›Nñ∏≈1y!ÀãR√úL_Ø‘îﬁÍÖ<+Aæ%;~,¢)<—Ï:õÛYYÔÈ#œb-∫lé…÷µMµÓÙ;º&gã◊‡‰56≈3KÚMb2›4È8àMt≈?’¥~RúID±ì"aFT8!⁄àÍ1ä öü{ûÁˆ
<O3√iå3ÿÑŒÁWöîR‘ﬂD˙AÛÙò÷∞‡–v5Á¬LøûE¸¿≈“}Øá˜p¡¢æ:Efl	ﬂH.-,\NJñO¢–f·jU^+!∆ÍÔ‚WQ≠Í·©Ÿ8¨ëd«Ë3ùÛ?≥Üäçk@•„	hCÎYÃ≠JtfjüÅ9ÕÄ4òeÉÊ]4ñ;™8ö˜Ë®4Ï]∆o:m{◊Ú≤cπT∫ı<"ÑIÀ¶÷ïƒ
^íooPõÇYô"S0ÊC‰°‚GáUu^1YAËÃÃöôé0wQt∑Dæ›Â*zÕÙÇ ∑˜kæ£hì˜UhÎ¨ﬂπƒ›à†ß2ü˙Xƒ‘…Œ… §ªRUi^ù≠∆µ•L¸»£Q†§H‚|‰9dÇ™Ha…”t˛Fø-å%Ø5‹´&Ò–Œû÷Qu
1du(K2âY/\yÍ¢gµGÑê≠&ŸXX|A(9´ìS-wŒ@éçˆNûDT≤B Ö*Ó¬Ts%√√ëo{ı ÕBΩaü°á›§éÆÃQÂAØÁ ôy‹ﬂ±äÍ@-o±ÚT…"*ÕìLET”ˇ  ˇˇÏ}ãn«πÊ´î¥∂9å5ºì¢ÊX(ä≤àHîIŸ	„®9”$;öôûÙÙà¢é±ad≥^C…nVªÜOdQ«ñAp‡ z¡O∞è∞uÔ™Ó™ÓøzfHJ‚ ±8óÓÆÆÆ˙Ôˇ˜£öæñrTNHå^ˇ/Û3.|t$G— Â(«3]¢z3h¨ÀQ˘ ˙§˝ÓÓHX$◊3h Æ5 ëm ò,t„n§®õ§hRsë@≤}zl\Ø¶›Ãyh
>í∫lW»ØIŸ~Ø{Å=ﬂØŸ|çn>m@eaÄê>R˝*ãµÌ∞”¡Æ˘9o+WUX=}™éA
èaôÍ<«AÚÀ…")¥TÈﬂlb¬€Á¥¿¶«“"$˚n“+±é_ºf–çY</¶(Æ˜bT¡Ì¥±\mÓí‘7ÒA–∂◊Eûz/ƒ»ﬁPaµì§Xò0	⁄›8Í’„0!›√ÊyçV–¶ﬂ´gAd\Ì›—±†õn¥»Dqâh8IâÀa_ˆÇ6”I	·
Ï4´·cáN4íÉ>“ÔÈêª!?ïN[&_MäKs ÎZqu¶\·Åê÷öb˚¥“iëƒÛˇ àá~_/dì7Û”?à`>§µõÉˇ2ÜØR9ã‚TÅ’ƒ-∫Éø∞È˙≤E“¯”Æ!≤9Ò¸Ã€1Z¿¶<)GE∆9•!„úR¿eRQ{k `qie}u·Z∏t©∫ºRΩ≤≤Ñ>\∫¥xÂÚ:∑∞≤B@/Ñ∫Ç∑◊-,ãÏ≤Ÿ¿«ÚÉFÚdß-¯>S|ø˘≠†◊B˝(D˙Õ:•HÛ⁄Ì|ÂLÚoõn´F†y∞¯ÿäºFÄG5´⁄å¬V¢¶—≠¿ST4˛EÚïÅI©Ãon!Ÿk$À9‚ëÄx|ﬁ∏F6–.ŸÇÄÖ¬<ë
Û
Ωü´Ÿãæ1qUˇâ2
ÙÇMgo™ö‰bñ¬å‡U*…Ò¢páRVñeÑµ]€ï÷vC¨∫:6¯ÚP‹êP6ÔŒÂ∂/dôc”åÑU·êAëß¢æÌEqebt,ØëúC¨ é–˚ LHÚ‘≤©!`É”êÙ\‡öíÇ,√9+^BE≤éí?—&±''Ï¿5ÈDÊ»›c†lv1z˝› BS≈5%jÿt›„·VU´§YÚJ@S+$Ä@ËaßÅ≈7YÿtNÈGA†ÉﬂˇçÖ≥^W∞ìk†veΩå˜%É‰ì«Ó}ÕÑ{˘Ì¿ÆÅ∞JãÎ¨®Y¬È 9á›‚˙ÇFP;7∞∫,O°≈SŸ÷C…Åzv¨2"sË≈ÂIñNª|~E%ˇL<È
…gS¬‘éñôƒôâ¸∞üÄÛq´XlªúDo™–úË•ÁÂ~Nzﬂ=VƒÒx/¿§¥i@´Üπ‹√[2öƒ7Ù†MÉı¿Å-k®“VùÍ¥j>£æ.â†ô©‡πjä√ê˝É})ﬁ’≈Í⁄˙//-°ÀKÎ´Àãõ∂≤Íw;!~é∑àuD*Z7H©◊n†Û~˜&v,
“*˘∏¥S:.ÌåHX⁄È€êFc/Fì5Ù°◊l˙1G∑º†I‡ü∞Î◊Ù⁄ı¢‹¨˜7Õºø2≠Ÿ„ßú∫≥ª|õI`Wu€$mx8ÚMq∏ﬁ]µXÈô€óô—à«ñÀ‘`Åﬁ;~F›ø
â›GôßJ9Ï/e—õ“}◊≈;ü/+ã,¡7ø√Ç¿0ÿrπÒƒÉë£	Ô6.úÖó{ˇqß¢˘1;tRƒˆ¬ı/t6ü„∫çl¥´ÁŒi+»Õöﬂ)uÌô{-j4ùáñﬂz4õÙ•9Ó…c«|™XﬁXú? µ	
:¿3hüp±E+◊Tç˜˝c¡µ⁄k∑Ò‘ë>}“pSd›…≠Éí[¶Qq^WP*«h~~YÒ%ÌI’^ü”Ü&Ì_Ä4[§[‚’f˝LC:3 ÀgBbqác]Zr!Üˇ“â¬≠»ÔviF0Ûm‰”Xˆ(8ªzèZÓ£Ï∫}™∂+T¨M◊–bÿÍ`%·7é‰ŸaógœE8Ë;aÅ=≤FõÜkö©¡Úd∞‚S†ê[€¸f#∑CÒu˝O	\‡’≈û=‹"moÔÂﬁC¸ø∑ëƒs@∆Ö•´qP LìÉXõ©!V&è•⁄"·	µC*‘û)·ôGí Oã˚Nñuzﬁ8ö(„È€ñd†Ë+$ ˙ùí“}*av˝é.ªg∫ÍQ*b»`#øÈûœP±”Ú@êë2Ò∏ﬁ•%z]tŒs≠úòﬁπ-?ñÖ∑)˛¢„b¬Æí‘≠ì’¥·E¨Æ!w≤áI!¿ÿÈ¬nÃçÂj∏éŒÔ∑’FÚ ˆ`}è|V#\O†ARµq√µèπ´Õ^◊‘¨Ô]g1¸wYÙKr"ö},Û≤œXmd„áîr¢|B-.5üˆµ:xå‚yÉ°05a"A¥Øˇ‚•ﬁ«|‚*)È§+<”ECe∞ﬁ˘#¥fÛ¿}n7˙—≤3æ ˜Sõ“Ï÷\[ä]"»Æ-ºÏûºÀ.RˆhÂ_´$ãõZpâO^rVh˜4T˚ Vƒ∫û¢aPØ£µ^´ÂEåo¥ãvÇxõTrŸ¨	‚ë~2Í‘ùWÏî›µ0âNYP'kËÚÆåkàª∆7Üÿˆø,!N€˛	Xﬂ"y5MéÒå˘»A@óCÀŸär$Ÿ‰∞çQ6u}¸EJ©©ƒ?-∞¨Ç68ÑΩä1ëÙß«÷0Ÿ•µìP∫¢Üπ<%ì†r ÃÓøëáüZpYÂ¢M†òt…$IeSí‘%=ƒBB“èx€ßjdã2”ËÏH&’d∂ô≥ïÕ∂0´	£û2¢‚¥:¿ÎëV∂Q∆6Év£R'€©.∞%Sì}}‚£≥cÏÁÀç—≥cîΩÖóŒ?Oä7∞>ﬂ#q3s∞W5‘z˚'Öt~`∞úÓd÷ñ"rk,4∑b£≤ˆºL,±V<ÌãÕ¬);O=Q˘4X£ƒãÏËŸwZbt˜mgnåÅ¸¬Ìï≥€s@fs6˚ ∞>Õ;|`KéS˝ë¶å/◊õˆÜ/>÷q%›öl7>À¬¶≥}Ë: ÓLÿ≥ïßÂˇ¶$ﬂWy+¬–6MG®w©ªï&∫ÙfïiBÒ˚ì≈€©û5s-7,Í`√rä&0¶FŸØ¸@¶ÅI5_≈l∆å”ÄÉ∞a@±P>özlS‘cci˝◊œa≥¥ºæ[í¢)Îü#µ8zg˚æ¬Ø>d'Üb›OEû°èL
{Å¨ÅNe≤¿éºJıDn^•cπ’†‹∆DŒ⁄ÕF≠ÖÎ–˚É˙LQìø¿—ãö7¬≈Kﬂt-ˆi†Nû“E#ÇtœX?OçuåÆ◊¢‰g˘#G^ﬁ+„Â¡!Eì˘ÁoäáWlbÙg^ÙkZöp/”XYîÁf‚Ny”3ﬁGá–œ¥WK|•.x¿&p	fø R_Á|âwñÒs‚ù^[Yæ∞ºt]ºvª®øDWVœ/≠Æ°w–‚ïk´kKkƒ◊?ñ˘N{˝Ê8Ôﬂï_U%ZîË£\ºˇ\†?+XïÜ∑ï"Zf4§<Œù†∫h}·‹:∑∞JfÌ+•∏ùuùÅ~„$äcò◊ØÃsÎ÷‹=¨0Ë 5Û¥3\n˜‹%üü%üf¬D¥ôc©Fÿñ20≠öüW’x¯&~l/˜ˆ∆ê˘y¢ñÄºû•úr¢öÂ"◊M∑¶öJ+6µtÁÜPHl'©ä©π%µé(›Ó∂Ú´\M⁄F,êT1å;còÃe
`ùU¿àO	En‚#ìWç(‡ú¡*L0ãMŒûÚàæ±à2±PA^Úv√^|ﬁÎnoÑ$‹©CX[Z íR•æûôuÂVSìg1©3Ñ‚‘Lz…h'0∞Mc5ì[è∆Ï˙Ñ«–©ùsç£%V
.Òº∏…WtDáP∆πﬂGNew7Æ∞È§W«‹»î»´‹›M ä˛∂]i©4∂:åOBˆwœøû¥>#õ0,ÏMÆ@§s@!Sèü±K,KHöˆK_úc¥¨“6ù´‚ŸÅ√¢üa9âÛÀ¸é˘Ñ‰·«—πfœ-‰7àòNZé◊éºﬁ	.wë·9úxn<Ø∂UØfÿ'¡}.oíéÄ˝ê⁄‡Áb€9≥∑ü;%ìÚÎ--_÷–Ùp$90B2Ïa.æóc˙`yÈC4Qìqª+,≠“œÃßïMa ZÇx4çGKæØ¿ÍÌkæK¯¥?|Q@˘ë„π±rXvzå„ôë ¯ºèö‚ªº«£rŸãÎ€–ã~∫HR_XØ≈ªMΩÉË≈∞®Ë⁄˛PÛ€?ƒΩLé!5µh±däŸÃ-·l(N_Î,ŸÇÜÛ¶†·Ivå\^S§iæ{'Iæ¢o)ÎHèR/QÍﬁ‹MuAW=™MﬁnÜQãˇ∫J?†„d‹∞(¶mBßƒÑ™Ù]|FŸÄ$
Ö†`<ÀL‘o≤vÎ)=3A‘WfsLôÕK,`©⁄‘Ω∂Çvu:ÍÌÈL"îÄÊÛÁ9•R–?∑}ØA6hü â¸˙lG˚!ƒéøÂaÂäÕÅ∑r+CÃﬂ’–OﬁC/õÈÌÈÚi„¥%⁄ı[A∫˙√9‘ÚM6µ’nª∑Œ4âü}Õ´}≠VﬁÃ¥`∆Ô:íûöÙL∏õç¸‘§Ëù$Étì°è‡H~Ê^øX~ñ5µﬂ	
êBáTàNßÌO^∑ˇ#˝hè◊IPMÇ&=ÚáGÑ⁄±–J¢ëﬂ‚E=˘˜zã—˛q„Ë(äÑÈÀΩˇxÎN%U§9ÜßªW˜Ò«ı˙	“8,˛Ωã*°Vºyˇ:9Å_£‰£…ôS¯È⁄ã:ﬂŸ[$º©‡ù·÷´RmMã;≠Ë¸GBÿ“ßtxd∞FÎój˝pì¿V0›◊XªD–Îï∂Fﬁci^ëÃDÒÙÙƒõ.ä]ƒŸAàe¿O
ÉœãW._]]∫∏¥≤∂¸¡∫∫ÀÀK+ÎË¥æ∫∞≤∂∞∏æ|e]\^[ø≤˙K∆7«ﬁY∑Ïc™Ø˛ÚrÔ˜`Ù™>• òQ:IeØ((®}/¬	éXm<ZÛ¬©ªÎèµt
u6X´GÌ\Hºöfaâ7≠ÿøFbL{òL*JW˝∫tRıî≈öÈöY¶kJ—x—$Pa‡TîKGRiô…ª≈ƒÎ∂ÄÀÎŸtvÜG1`iÈººÌhui∞_º„&∏¡π ˝ kÉ˚ã›*]ÿ+	!Ãáe¬XMÀRh+§ì1Utrõ
5h*7Q∑≥µbƒ•DÅﬂPj¯,/KnxÇl©≥–)
Z±¢lTY4;·VI¬^5Âz∆≤àπíÖlÑ†®ËÑΩ†[ú7.‰hÀÇ
 ¯è|[àZ€W{gªp‹jÕeŸ2*ˆ™iÁSpÒ$õI1≥òkfß3÷û¯f*e⁄àœyKM¶–vÚ`vO˘∆WjÁ8Aﬁ≠„Py»^™?dØZr2e◊Høï´Mﬂ/Ù£Ïfë,ÃdøÙ6Ä±G‹≥H0XçÅG4◊…˙Ûòßw)Ë∆hôÿã%ú>âÚ_ÓT‡Ë2„„x#h˚‘ÒvI∆E~?˘.‡Ëzÿ∆wEóârØ]t:]E“Ú:ï
˛›	4n”¡U`/h‘–çı’_Tﬂ"ïv§Ò,båE~Ôrüj·jÎf\9ÅFFF«∫Ωç.5Mú@s$˛t≠”Ò£EÏ@V∫¬ç+´ÁÒÈ@HÊ /Õ'`CiﬂZ&£Y^˘ 9|bz8ë£5©l·«êP„($iûgËiñIçŒõ
krèÉñqZˆ=m®zVU|O¨∫GªH9Sﬂc1N√HØ~‘Wﬂ•L?‡@Yëç4â)Nbâ4;AÀè∑C¸ê»”yMQ!=AÖÓœΩÓ6≠<^Ò∂ºp<lG≥—‘#üVb|≤∂øÉŒ„wÌã$–IæK;…Ö)]ÿìqJF˛¡SÛ8ìe#1Û§ë{¥Â{ËmStC%_…'GÅ£	∫Kƒâ›—∆ìäÔÀo6±>aÁ°ì’ŒóÁóblœÈç%åEùswtÙü ñì`LçßDÿu–-@Ì"»Fà [\]´NL'HJù"uÊÁ·«qq#ó√§ƒ—-¸L⁄å\Ë5õ’µòb˙ËºÀoÜ™a*óóVW∞¯\XÜÆπD6ÃÃBÖA"¯ˆá∆∂=€∞èJmÿdÀ⁄w%x»Ì∂È5ª>x |oç\]_Z	b¥P˜~kh∞¡ÆRnÒOïZ¸''·«¸‚ø∫ãW^ùˇï◊ﬁ
Iï˝2:áwÇﬂn†•ˆ6∑|¢úˇlô≈Ô¢Òî≈èW˝˜lÒˇp¥¯Ørã∫‘‚üõòyÖˇ
v1«~’Eì3$ËÕù†MÈó—eØã›oÍŸ8Ø˝È©kmÌˆoZ~Ù±˚x$Õµ«oÿ ¸Í#'Ûä{òßÅ<õı7A«’¬9k0ÅWø>66ñ˘	Ñ?Õû6π¡&™à©U∆‘· ¶»è{Q 7»^Ÿ ü9≠X)øÜj∆∑Hª™1;á∂≈’˛”œ∏µ6™ì(Ïxı ﬁ≈¢úì•óÉ†J0“§C3A"4§süÚ`ÆH~&0Ñ@‰O:2X¡y¡ }!kå/πÃh 'én+ÅX∫èxü7˝›”$ºãßb√P¿|@LÁ™æ˘	#yuRQ—¨Œ¿É XeF∑«àÊ-óâaÒdqaïU+T¡CÊÅ![ˆ™)ßmÏ6+¯âa—`h<òÖZW√¬∂|˛Z«”yÇhN Hy-∞`Rq‰Uº‹°viyçã\–
¬ÏpvCõ9`yìâ§N©È‚‘I1˘ù¥§ùy’»Ñ˙nÖÌPëÉ∆ìÏà†}NÙN‡ÑÕsCìJrr¶‰‰dnçV:loÚÍwãì◊ŸTä4iiË˙&˝“íJ…u˙¿jP_xÔóX¬7ŸﬂUq\}¸•
ûƒÎßO˛ç›Ò-Üy–j&˘{ -ÑS≠∂<πióM•ˆÉÙe3}™Ô}&º•R€KÈπúU{.ıUœ>õ…‰Nì£ßKÓ9m{œ∑∑•‹¡}Âv&stb_Z·ä“*^Aû‹'BXkŸáø•ù~Ïh8M’–:ÕæÉŒ˚±4!9jy…Å(S%L0â˘zé≥∂˘¨Õ6üï¨¬}òaºøu"0}?ëÊ8È*ä∏ê‹ü*í<@∑uˆ<≥∑g—å˝ïk˜√Xw©Í4Ä|´îY¢~#Ëµéü°gd1AZáR3Â™Å…\`%"¨J≈eÔÅΩà§‡â }Ûj‰|»o√µ™∆ƒÀΩzLºJQ%%Ø∂w+ÿÚ‚0´7É≈Ì=;∂·©Y«•¬º }RÚ¬¢?ä+7(h¸Á¥ä˝6S∏À¬¿ø#üq.A‚˘ﬂ¯ø«n8^	D∂îºt/oä’∆Yb ^›T∂òxRÈä≈v«»∂¯,QÉü”9ˇ\9ü‘àßèkèJ> óSπ	Ø˜√ŒÆ´ú¢‡{S`Œ3Âd	75øÖ2“À°0Ttê[ùo≤üÓì÷÷ÚÉÿMœQÖÔ7íª;äÆûøÄD;…Ù∑œh<ˆ…⁄˝˙»Y0ˆﬁâ}m-Qx™· õPz≥$dáÿ∂êe„‰∞ÇÿFÙó„‚;Ó¥õ°◊∞¨fÂK/ÏßÙ!Ωx˘a?~Ñª)=–üé‘¿›—J·Öó†ûÒµÑÖ1éﬁÔyxM≈æèVBº2Àt–Oe∫ºJ˜ßsjÚ”ëvµ,6ØÉÍL®=möÔ<oÙ®ßKı:ˆ◊mhÔmO`[mΩÛn,öÜv‰áÙÕc¨˘D´ûßﬂ¶î‘É>«¸ç£ﬂd;Ù^~˚‡¿H5]èQ›å(%Øå]4õƒ#7ˇùR°ƒ	¶_2aXÁüÈGƒ ÉE	Ï.§ù3ìä`ñäjá$OêV	ÑÑàòDÑÎi0ö•ÊÌßœ˛∞Núÿ0˚˙I¡lS‰%ak')√î ñz-,.ú_¬ü\XZXø∂∫Ñ÷Æ-Ø/ÂÉ…V c,ÁrC—[Ñ√ÕÊﬁÎ“/◊—⁄˙µÛ§Õˇ‚µsËÚ“ 5A%◊¬oEMx≤‰¬¯≠8áÖÿ)ø≈ø@é+˛ó»~t#æf¡Y@hHﬁKü∑:SXÔTObEv“Õnòœ@∆"—;˜˛Aî˝˚ë◊ËQà‰EØ£ﬂ (aXcÏ…AÜ,Iùv#XÉRÀS©ƒ≤ö◊I«	Ù6KãY¶/ÜÅızŒM†4ﬁ:ﬁa˝&»T3rˇHú¥êd£¬∑/˜>ëÎ°aU?œ ∫Ñ$? Õ5¥ÜÕ†±Ê7˝zÏ7ﬁ∂*mºt û©ìX'¬ ﬁ‘#í>‘à¨⁄MR„tÇƒ·}àßÜ¸f◊á^ÙÉ¿ﬂπ6¸ »Foó‘~ÉBÇÇrë"{”Öz’hÇfrë≤U5GÁÂH[∫ÚØj∏πâßF…L£VìˇÜ}ıë∞‰–Iã˝œBN˜â5;`Ö"k#åÇèÒ\{M¥¬‚‹dÚ˙Ë¢*Z√ã´È3SdçTº÷}D€09‰eöı°A,¡∏+<:ö∏∞PÑçu5≈¿±∂F±è∑‚!†ˇ!¢)Óa}c≥\™ÈÌÃ√CLÕ]LºÕﬂ¶ËåÒG<!”sjµm
„/µsÙ¿IyœDÚ'ë»Ä /∫Ÿô)O ìHó,ûa¶Mæ’PÖI∆„y§ˇ$êÉ3†˙zeñ⁄∆⁄e@Ú ”íôlÓ4±eä„AÊ6ïßì‡C'{/6n®ñá›jBŸ!Ú¡ñØçªH.≥‚5D:ÃñKY∏îÖ/@	c ›-ÈçÜy˜†˚=ì'‡f‹ZÁÃZ§œ◊Ä$\>E´•Ë∞QH|xnﬁo,≤âfêﬂ¸ÕpÃ˘¬…(Ÿ%¢¯ù‚˜H¨ÄGÈ¯`Exü˜XÇˇÚSJ`œè…ΩΩØÈ¡ˇ†´ä∏[áÿ6¿´1ÿjSÙˇ#„ ªu‘È[
πé9oÜ—±€
,¸ëÅê}Ωj¬Ö†I+zˆ◊@Pó∞M¸'Ìı3
Ój#ÄTƒka.ÿ'Lπ^≤vÚœe$u0F6Ø…].$C$`U:©Õç∑Ú∆Õ§jÛH‡=6„å◊9‘,°‘.œƒ:˚â†-˚®òO‡¿ä&˛£JóÌQ∏¡¥ª¥˘õQÿ’
˘ﬁ≈ú†Ê◊´fL|4¸p-	mÈ⁄L	±»^?C¢Ëˆ°ñÑ]™ﬂ|pò5[
d`¬Ô‡bŸ…Ÿ°;põ˛WÀ
x…à≤ê.]vã¨}ÈÙH*OÏiáMtFdÇ†ó{≠±“9Ëö;4º€ÎÁ–‚ïïuR“3UCãK´ÎÀñ÷ó÷Ú+ñ¨O©ÓGX0DDtKSaOk,éÖ/¨™ß,±ìπ«L+rËÏ ÎëHï˚8◊÷ÙQ&≤∞ca¥+Aj!vÉ§x∏/ãE,(´¸^Í,+≠q˙µ¯9´≠†8£±ﬁï’•z!à¢¥/)Ùèk©*£áL’-N‡¯ÃÙÅ·Ò0aP\ˆ]êµ≈ˆv£¶R∂s&±b€ÃSD≤€Åh0tÄ„ÖD˚¶¥M;ìÊes,˘≥ò Ü≤>ê…o#ïŒ¨Ä€æ#•õ©¢Øò8(99∏gRò’j jÔÊ2µwñRÆ`˚Málçêˇ,É!A‹:I,¥CÍ»VÃ
˝ŸPY.î~á 8eÚÏ¥W*RüÛp⁄ﬁo%"Û◊5>áA∑€£»ƒ¨•ñJVf!ì?ƒØ∂"ØAÜlxuÈë…TÑNN€p"UjE≥ü+")ÆïN˜˛îC˜≤Uù¬I°†Û	ˇ!∞∏Cj©Ã=˜˝êÇ—!8ıö{ãMÉ∑4Qam	¸ë7¥–-íÓ—uG£Ûâï*≥ïË	d·§dH{Ë¿B›÷®™0–]Åππ+PFIZô≈»8ØãLwÎÏku¬õ“⁄—ol«qß[Ôƒ~;¿À8lçﬂ"ñ·Ó∏æ∞]…ï∆¶¸Ωì±–Âw?≤
»gÙ£OÄ≠«V–J^‡Óv’í!;åÜ≠·DY∂ﬁˆl?nÓ÷c!cij=-ı˘I≠°}¿[1€j^~™yXª⁄˘˘ŸhÅ¥vÀó1ôÆ°ÖµµÂ˜WÛ)i˝∫xÂÚ“áWV^2v¢%K∑u9ÑN»≠˘[‰ä~É‘sû““J°++˛Œ(˙çÏÈc,$_† r≠˙Zó}˚\§ üãû˝µ^ΩÓwKéäé;¨	?Gê˛!CRÀÎd·»íÊ‘L!%SZ|„¸ˆ˜ôò+"C dèΩ2“ˆwJQsq!-¡SYFCx<ïV,k˜8$ŸÀ3ﬁ8€~‰Ê¡J6SùîM‚;÷◊ûÚk%˘æ§”Ô?Ò∑ˇ^Ô-”d1àÍMﬂûnsÊh+z®∂‰àÑÓœÑÀØÊﬂKà/U^8)‹\Ï“¬˛;-)Ehá0œÂ6œº∂y qßñ±?x0&q~µ–¥Ç”=;`¸»]ªµîUDG˝ÊÍ+~ˇéªN
=à∆J~¸Ü*¨E“"ºO™ä?œC¶≠4iÒ)¨~vœ…◊Jeu{≠ ∆‡∫◊Ω…‘’&±1ë¿±F=»ı€»ËaQi¥∏”Íy" s »	_5˝÷e∑Ê*81é{4Ø4£·êë7T√¯±}u…ƒc@ã%yJ—•e»k§ÎJn$õÂUw	≥Ì^Ò/a”*2Y6:yï)p=JY•Z“´«h'à∑—%Çwï∫Áà@ﬁw àë¯¬ÖÅòÇ†∂ºS[] 0ıjm)K™¨r©u±ñXÏ@∑ïåÿ·ÁÇz_ ëÅßo¥n (π}∆E¿n›®[7ß»N«Ô¬ˆ™ﬂ	+#Le¡ÈÜ™˚È˙ ˜VÅÍÜR&'ŸæÆœµ$ﬂ*!kı¿¶“Â®òVÃúIzg¥B;~ÑπµÑyí’Ê¶å—-|ÀpKΩı(]LÎ0”é∆—‰B∆^4õv–9/™!÷¡è(˙ª¯cÒsœRø;èÉf1¿ d¥0–¡Ú‰c¸™yÑJÈ
ª‰…+Í_Y+JÎ∂\Ê¸RvrŸ™M…í˘;©/fq2Q \X—ı…yV∑Î<¯	Së ‡"\i¨¯L:£cÛ„¿$sZmrÈ{å…ÇeÎ®‚cNØs-¶ç¯£†<ƒlè∑\iÍÏ7Ó˛pÈMó|¿¥P°ƒÂrU ı¶ñ"ô	 ‡µa<È¯*©e!N'“CûŒ@Û⁄üaœ™¡Âh	*y∫≤˚—Å>uPµBYùJ®ãÌŸAÒmIw∂€Óm1^U¢iª¬ˆÉô	Á™¸‘t∞mÍ íDgc|{÷—8(Òƒ≤h˝ÑöÀıŸeË¨bÜÀ7ï0‘BÀ{ã[ïú9O˘ãÕâzûƒŸç@fu6S≈⁄º®•Œ¥ˆ¡R¬ITﬂi Hü±íJTa´v√kl˘wÅMMôî; ∆πg1€ÊLfyD⁄Ü&ò.Ø€T˚*Ê=˝s3å¨(°eüÈ⁄àˆÑ!I=§Ÿ+R—˙C™xë‡ˆs“≤VZ∫”√Äh†Ü√KÂ¨P(*≥,u‚QTÎÉt~~8ûØ
vQ∆ô34∏L˘1ï˘≠WŒòÁúıﬁç MâˆOÈ£û√ÉûseéKÍΩÌôæ:Æxå˛1bNï &J(¨ﬂgÜ_≤_Î8ÚOÖ∏y"¡ô¿ˇN‡€%xâèEãF¸ò›á¶.†”¿–«?ß\-`JCó} ™¬ŒóW-^2¿=UÀ-g2EµàXP[îlÏW\ªØT˝aã{go∆AíAÓ€Ât4⁄„Å8G€Kƒ€yƒù\Œ9‚nè≤≈–ÈπûˇPû[[è;'N 0ÏÃ0Gù•ó±ÔAg◊∞Û œIË9*·iö∆≤?ae«¿≤›Ö‰·B±ƒ‰f∏ïŸÜò2?ï¬f7◊ÜN0f&ù‘n'h˜@KkY¬qF«à∑∫ˇ—¥ÇÖ‡⁄C_j^§qYCLé7Hè˝˛áÀÌ}Œ˙Œ≥N•D¿æÖ
SòòñÔ˚"˛KÖ
ÀÈQ&vıI‡".Iœ^)ûﬁRq∂∑‹Ë÷	≈:ô¥$«E¿«ïèH¨ùû∑Ãw"™gáîçòÛÏﬂolêª÷:?@ ı0FbÌt_÷ﬁˇ˚˙_Û›∂)&/õÓø“IÈÀ$›Œ=⁄¿˛î—ó}JÅÑÁK‚Y{˙S¶ê{¬ªπèŸVh–4ﬁ◊9d*ãõñ*øDÕøÈD•„¢•cÿÓ…6ÁCé‚£∞a∫ƒGÌˆxz˜)6öµ´_â†®5∫®ŸÏL|˛éÚ~Æ—R2C-ÚËX‹ø@™uè≥<–36;ÿg_÷€§©,«ÚZ_Û+“ü3Ï?≤s±Ôìè^ªXÎt≠†œfÈñ◊Ïy¥œ∆x]b©éÅÖ^e¡°åΩfÎ∆ﬂîË´rÁGÒ◊W7˛ö$"ı¯´
kå¿™ƒΩŸ¨¯ˆ(
Îz¸+ÖUÿ¡G°QWn4wïßN‰’ÿ+ß«_›–ì≠Û{&«’5$≥$-2.9›L>∑˙´*v\Æä4≤Qèk$Ê…˙€“÷ﬁú˚RÓÉ™ﬁˆíTåtë‹£q>eVÀï,˜≥dJñ-ÜÄ?Í3Œﬂ◊N+S>¸•îéÔ£ ¯uîêØ£¿¡ß aº>ë+á-6ˇî∆_ÓSÌ˛ÃÖ/—~“£8˝Qú˛ï©c6@Óø±zm~ƒ¥òªã∑wòCÙ≈)\Ë–ˇƒèﬁì¨A‰T<zØ—X¬¯ﬂâKﬂ£ü˛(Iâ˛˛ËâŸrı ’kW—Â+Á.’ê¿yˇ≥p˚>gS˛µòfÜ€˛¨®ΩÀÍœÈ©Ë|jP_“C?Õ=Cíw)2†Ót-·Sà◊ü	B∑˝
⁄]?∆ ˜„™1îí@Zîïrè‡ÕL9¬øç(ÏNêàlQR∑È5¸eàãM+7˘x7∑|ƒË+yzsã˛±]Ω~j‚÷ˆGyjCàÎi;ˆu>WQKƒ–Ÿl‚7€A£ÅçL=‰™Aån/âò˚4dÓèu„∞sœ¨∑Â√©ÿ5PLÓãÿU$ÊÎæWﬂˆ£ëÆS;lV_œ∞ï!M˜ç¶{î Tó`íÎº∞îQ¶‡4<ﬁ	•ç)@*D*ó C∏¬Bò0!\√oVQñrè~∆´°“4y ≈ÈP˜‰j∂€ÔN¥÷ª∆iã◊ÄÑ¯Î"Å‹~§Îo“∞#L]ÖÛZ≤¿ıàa8J»F≥&bÄ^◊/t u€Ê◊)“gws	Bππ„ç:Â´€ÿ‚(Cá’—˙Âô[õ0mòÿŒùàtÙÕoá”LI3›yÆIÇ4zÇy¿t=ø–•…ñ&3‘pŒ<;@;È\ÿÿÌﬂ(Jxg§…∏Î‚œsïƒXK÷$bã≤ã*6∑∆Í}@°~M∑∆ŸÉ%Ë‘∏wj*†IÏ∫‘åNL#Õ3áX`n–÷bDÕ€å®˛5Ê{Ç&e2Îüé*—ê 3ßx»Ôh}‰√ø‘	B›~måò(©. Çï–nƒ$N,}úÌ0jyMDE[0ù»Øõ` 
∞·wÎQ–°“êùJ∏â§òı˘`Ô
ñ∏,¿¬*K—“ÃÁl∫E¿Fè∆‹WäOø∂∑ÿÅºÃ3	6ÿ®èóﬂ> ¬Æ¥ß`π65Ü÷Æùªºº∂∂|e-Ø\Ω∂æFÑŸ_Ÿ0Q*®ﬁô•ØhÏ∆ˇëÓ·øæÂ!µΩœ·íÓŒ1˚* xwÿt∑˛Ä¯”¸¿áàéÏ>ÍˆÊNÏ$¢»ÉXnwz1Å√ΩÑ’ΩSBœÖÖô˛æÈm¯Mç6ú˙zÜI¬Â≥»∑6ú›5%‡kË¸ÉÀ‡ÿœÑ,˝!oG&˚™f—6Qÿ•ÜÿÒ3?+„ñ–r:$ èœiòô‹ãön’Ä§ÇŸ?≠ñk≤Œ–∏€^{ÀóQØ<lZ,ˆ¢-?£Cp,íÈ`ïÔo„EÂGßèF—≠ ﬁÓmPF—^◊è⁄¯˘çw¢Wx∑2i˝≠ya$œﬂmÓ4ÄF.;,·ùÑ∑^ <@yrb¬Da`V±&Áq3¨˜∫µ∞Â…P÷ŸGQ∫SÍ‹V-rò˜,T	Å6Uì&Ú8"òƒØπh≥ ,ª8ŒR`ø'ø√ö˜PÛ·§Oêö.£µ!ã.r€^‰{NwÖ;›”w¶›Ñ@éÏ"Kc8≤ãaNvEQŒHM°tıs—úr_CM≤˙à$§á~d∂Áÿÿÿ+!á"˜"ø|,~e ]Ö1:G√#]g—ß9˝1œirnu	N¡<ˆ*“cØ>¡˜ÉMT9f≥u∆‚(hUFGùœ™è?îL‚	ÃS∂ø£˚¯æ¯˙)sêJöÆÍØ≤≤ Õ≠tg¿RŸè{Q€ı8ÁÊºñc‘ˆwH[:]b˙ÉF› ïu’∑Óú«Ba¨ÓTFÔﬁ8·|&ØŸ]<˙=`œı—h˙Ã°»√¸0G‹À2g9£uœ¿] "|-&Ò¥˝lk›Úõaá¸∂Ù¯»Â˚óÖ#\n–ã≥7X5DÌ*ˆ-J\ëˆ!‘»7+ó∏
ãE‘î@Ñ◊e;Õ˝\$VB¸11*#Ë]≤[Ÿiï—±8º÷± $oIßk{´2≤—Æû;?r›¡«Ó‚C€=<aA“¬äu“ÒòN†]üPA»Ô—›Q|Úë—7ú¿“Ámﬂ¥üÓ·ΩÔ_Ó=4Ùåî∏~´ï¢ÀÀﬂ´ˇ;¿`Æa˝UCöÕ˝¥Ìê<yõÅÕO[E} c¶XŸÌ}-L—¥Pî±TQ∏˜â0Å…{R£ÂÑO’à!«E˘ˆAâ…T"ƒ9S˘ï˚%DxçœÌ°'˜˙Ç∆ò)µÄƒl¯KÓ-"H	‚èxF_>¸ü‚ªƒè¯∆à `ü‰«¸…·©u5˛…µIÅ$n3M€ïN‰ﬂ"÷ﬂun3ú@ÿo!~4Í|bZq–(c‚A_5Ú[…ÅìE?yá~Ä/E„∆yCq6‡ XôëZ*©|Ê,ö≈Ôo|F¢m◊SrG‡ß˚_9ÑœEmÔL#77¢ÌˇcÜÌ´Bw≥˝ï
WfU<0â…}cˆ¢Ötì§Jç
:∑Y™Æ/À!îä8Õπó)ﬂ¸‡(ò–U)èHµ›'Ì˝^ùT®÷∫ƒ“©ûö"€ñØ‹≠åBû– Pa≤µ€Çe±<Ë #+b/5í¢,dµ»)∆ï*ö¥î…Æ[Ÿ∆«k]‚√[»π˝C *µ∫‡G∏ËßÌi¸gÖù∂ÛÑ±ÃV|@æ⁄ËjÿÈu–œ∆˜;'l(˙…“í
„“qZ˜2l:∆¬Jpi,iÀI3‹Œ÷ÇˇïiA%ÛÎ.Ì%&ƒsH¸ÛªwÀò ¥˘õßÛ·äcYç”«ˇÎ◊ˆM7ÅKú–ÊÈ„ÌÀè"7—B^†‡a‚í,√à÷f[ Ω–F‰{7	⁄Œê°sñn«$›§EÊz1YëY<ÖSΩÂ/År\;ûSÀ©ÉòTF^–qgÌæOÖΩü”øû*13ûÁíçÄÆ‡`8ßq¨ãƒZúõ	^©>tπnüx	πhµC‰>ﬁªéËÆVjÂ‹π¡™Ä≥¨R≤ãﬁr	Üï…•†Ûú–Y4Rå≠53· 9§c!ùöUüØr∏€0ktò9§…%≠ÇÅSA/AáMÉ);ÌÓçªN´–t-´æÀHå34,ÚÇfŸ+ç{ºï◊
SZjœ€wni8Æå‹≥¥Á¨ùBåÑ2‡{˘wËŒÍ>…N^∂;·üIl;Nî}í	nªì
qµN‹C4e4√œdãíZ1€x∆@M>ã∂°i–ÿ`“ÙÅqY…‘ btO´qX;nQòå ˝£‹1ügxQdπÖshÒ  ˙“ :ö©°KÀ,°≈KkkKkË¥∂xqÈ¸µKKπı\w∫qØÅ˜ƒ≈ﬁ∆EØ{ÃÑj‚7U∫‰˝bhh[<iF8»ü*kYéﬂ1W÷Ôò¡˝¸Í⁄ÏÜ+4S
5 ÇâÒA–C]0ˇÈÌêÄ∞ç¥1Ê˙≤èû#—ß§ï'1ìâk©Á≤‹ÏæH=Bï˜√p´È£ÀæM
¿vü…"íX∑Ñ®§∂ $‡µD'iR<j˙n^ëÿÙ›4¶MO§π´ãß¯ß?}ôÆ¿{.⁄øx¬=°Ú_‡˘+ú§‚©ÑhÍR ÈÄNK![ñ⁄Qÿl˙ÄŸe Âu :9≈ØÄÒtÔÏP ¿4n6ñÊlm;p	¥0÷•Õ Í#à>õ]ÒC\Æw=6J?öõ∆∞Ø¥˘¶øNO∑ÿi.hı±/Æo√€ùO˚%#÷ m@∆√dh.PaeÅ¬t<ﬁBˇ°F&1hw„®Wè√9r0√¯wˇn"e√ﬁ,Ñ•F¬@ﬁ)áÖg’≤–¿…É;VÓ!⁄πâÚydY·™-„)àÜ∫»¿3≈Fåk;{Z¥¶2Ê9‚í bXØ’∑˝FØÈÜF”«<¯yé‚ìFÿäûÑ∞ÍC|Jüábö ºÌˇb≥jIΩhx"w`(œÃaÁ;S‹√(© J=ÚÒ„g≥D&i—k6+7Z¯ØÍ[Ã"ªå°Z∫vEOó‹22*B?q™–\Y÷Ì.d™Äœﬂ†;ak¯n2¯XvWMî˙IL’¿◊/<VZÁE¬Ö'`ºd∂Üñ—⁄˙µÛøDÎ◊÷Ø¨ñìxA5ÓaK 9D¢¬!CPNïÖ†‘ùò~¬1≈:ƒ÷±≥ ⁄`¥$cóŒ„ù8ü≤Js“jsÓÙâíss6Êbû„≤∂(4ˆ	’Y}√8„-òòDr}√$[™ƒ˘Ö…fH
ùhf‘}*—{ø`^‘ÎáA;_{xHﬂçø‹˚ÅF+=’™-Òò!/cSËÑ÷,ahJy,{>âP—wJ´>9Úˇ®uhèd˚µº⁄è( ê”7® xnún•c{DÜÈívñ·4ù√ÜôÆÔ˚≠† 2ÆKXæPËM¬Õ„a0î‚ìSi88‘â ˛◊/X'zÈ≤ﬂÌz["Í÷Ínù@A„∂C∞mhxüb¶jC≤Òx¨∞“]¿˙|sc]üÈ1’L¿Z†’¨ÚCaøQ¬:M6Ì>˙˙¸Ï€Aœ 
5r 7GùÚ‘lêwo-öÃ=xÒÈb)‚+›∂¬◊∑ÉˆMº\`•¶∏âiÇü€l:‡¯ƒv™”s ≈OuÂü9(õ¿ﬂ–“˛cccö~êùÓn=2»kä·»ﬁSl&¬†≠òCL_±è'p`ÿ2£@A≈À€à˜¢ú¡„%lˇ‹ﬂ=Ó¥Â)!‚ê4 ˙cX23Y∏D¨QÍ£®∑„M¡~›Û#|V”â`Ω^…åÂî¥^ÚéK“‚ÕDyçÀÒtœ’¯’Ô~‰|-6˚‡˛@|‡rZ¬T‚?1ÒÎAÀÒ5›0EÚfú)”O≠$”Ìr≤od´b3ÜÂÒ∑Ó–gr˜8Ca| §‘ìó{ˇ]PÜ$‡¢?Ú Ó&H¢ÏòœÂ˛&BvãVÉ∑`V∂t>g¶Òﬂ3n¬7≤∏õ˚ ÜÂgJø¸q∆{.óÛæ§zgrƒ:¶Û í4[ˇÔ¢tÎÅ
ÃÚ'IÀ¢ÉÑÚπ·¶ˇ˜Ù∑ü≤ƒ1Ûu«C≠ö¡èávåü›Zñ=≤Èa<≈›´@–èãGhMAd•◊v∆gK;ï“”ŸLàZ‚ô1wh,CõÎ°á√öTﬂ$Tæ˜ZƒÄFøK :1'ìzÑDEÓüÇ,©˚Sé%U„ ££Z<RäGJëæ¨Õ~"XTùnõQímIÙZf€ÿGˆtõPäé∞•ŒTﬁ‡ÇA;Ω≈Ó>}»ˇW"^∏T√rX˚ôzöDkØ|∏ÜÆ¨.øøº≤p	qmï‘Ï^Z^[G^\ZA÷tSk∑ †¬∫#%VÍäRV˘sFÓãt§G˛∂è˘--ìµ¿ -›ı%ﬂã⁄$:≥ÜÑËrÿö≈DvÏ$‘ è©’∆N«é.Af'≥ms:´õ[…‡¥’zRﬂ$Ìúà
mDXÓ»øáaã¸€ËEî≠ç⁄c≤XJhŸ–No£≈fÿ%‰‚Áº∆¥ÿ=≠«…’å…={˛î‹ÉàÖçXr@í¿Ï˘ZèÆÈw˚*ﬂÍß“í”Ëu:~T'§MX`÷â¢®Ót¡6 ŒeòaA¸lÄnEóZÃº:∂È{ÿbˆ◊›H°‹™5áAá[€1)‰tcïŒü&nÁ¬ë kê?ÓG	0 Ë∞s-‰<ñÚ]∑	L Æïß‹Ô È2ï‚A€RäÎùú–ß@KüIt%%y¿)÷”Ûæ=C£Œ…ÄY√¢(‹π‰oÄZIceÓÖ˝?-∑„V/Ë“˜˙Ï©jñ=o7@SMÁr€exÏLΩò9EÇ\ÏvëÓ7µg ÉÙ≤áMZnÔ≥z«´MoœA¨¬S+,÷2ÊibMw;~=Æﬁ¢Á«jûøø>59~Í#AÒúj‚~÷lÕìÖîœŒú∂ÑâÃkˆ∂•`úΩÔ≠-XÙ ™ü.≤$pó[ﬁC¨5AãVxÙ⁄]|Dwõ2’t∂√8¨NŒMOOœŒMNMÕŒÃT7'ßg¶ßfºπ∫Ôü%5ß7	'Z¸ŒfüÆGaÁùù”ìxıøÛÎ”Û¿ÓqØ⁄—¸QKDºçnÿÏ·=*x»˘ÉﬁfˇÑÑÖßJÁEŸ≥’ªTAºõ¯YD"ºuáCnw…Ú$>ÈY4¬â0B 5ƒ€πŸHmêö!Ω®3wÖ◊ÍVÑMP¨π´¯±≈h3¬éb≤|o^Úé–(‚%ÔßYá'§NÉÑ"¬∫ÇÁ´È¥ÓmA	¨;Ûc“⁄s#]Z›ämPb›∏Ûgª¥ç⁄jÇ\ù:Ë∂ÊTlPáüHÅ´´Wx…ÅßØØ6ã¸	£SA≥Òø,U'ΩHí§åXm±!;¿	äÎ€TCÖy˘sıÂﬁ√ó{OâQR@?:îπsÈÿË$≥ÄÆπA3«[ÄÔ°µÿãL‘ﬁõA≥ô\››≤ﬁ˚nÏÂﬁ_Ò≥°˙¯Ô¶qàù`e]Z\Ÿ§=Ç∆—UØ◊%œvLùaÜH†JK$Ø∆º≈ÎBÈ£ë¢êÙ{Áã∫6ÆK©Á2éƒNuíòŒì4⁄ãﬂÃë∑…øvπ.Õ•3LKÑwü ‡Ø‚7–?âÅ≈/¿0û'Ò£’Aügá ôm∞y‡xS÷">G ÷lC0ıΩÁí¯ª§tÒ*áwn'ú(7® ˜®‡–F}è˘$ü≤Ïx“aº¿Õ‚_p	|Ò6ß£±<ÒBtóƒCwXV"c˛ú‰€π)¿$ %ø€€+=¢ÖÓ÷
Ãˆ%;d]≤0≠˙çﬁml)áÕõALHÅH/{mÏfQ:ıw–Í˙œ—?”JãÖ®Nn§N‚›É'J∂Ù§Pu.ÊVØ‘!ûés Çê;ç	§ 7πde¬Ωó{ˇçÊ‰ü1Óïœ_U˙√’|4r˝Ù…ø°ãÁ—‰ƒ¸Dœv‰{≠AO‰qâ!p.ƒª©%‚ä	pŒå‡Nm_≤˜€≤®îZÄVÿõ¿'Ák3≥éﬁ∆¿˙˝‰
}Œç„Öïéu;æﬂË¢”Ë˙‰	4965K˛ãˇ3ıëëÜ`øª/7n„”UÿâÒFm¯∑ØlVòY@÷-Ò ÷»óÑ#krΩÕ«0÷Ù€[Ò∂€e•Yßùô_¸:º¬îºú(Atj2q†r}&n!h!ç†xO“`d⁄l?p˜Óû◊›€à˛Î`—8 –ù;3Uõòp‹≈ûo?»2z≤‡‰ƒƒ¯¸ÑnÍo”UêéÛ¶ûYY·§˚ZJê54&!IøU√ë«Q7ﬁm˙ßÔ‹A;AÉí◊ÕÃæ=Çó˚∞PeÄ?Ö¸ˇπáÂbfZÒn[„5ªJ(é¬^€H+xÒ*«å÷…Q√´RôBN08nMı'yø7<⁄∏ØHPeC™úm÷2:C \m…t`ˆTˆkTÒ5†Ú&˙Å¢tΩç¶ﬂ8mı–{ß—§{í¬R0ò$==˜¶¿èÙ¨“≤:ï…Ω¶ àZ‰√má1q·éÊ:Îè5U‡•.djéù4Ú¡.ÀÌ ≈¿ÍDuÅ t˘ò˛Ô©¿˙DÛ{À πÆË∞Üù‰€/íXâmúÓeØ#õ*.fºs„B◊9ª≠mˇé~TC«»IãæÍ]8Î#ÿ¸>|Q–0ûÓ Á2M°V¨®eõ'Sd∫LüNgJè’oLuõ'›Ë#¿2◊V{∑òÊ‡#É	dáz›·ù*Gí®(µ@»c◊ÎpiÅÆIÅk¨ﬂAŸxv5nNÙ”˝ØËxmø÷ÿ£µÜãG‘BÁ⁄§◊“¥~MM8⁄÷›$5Hèê=·_“ƒ◊≈ƒG>ÕÄOÁ¬•‹ﬁ?p8æn‚?é!•?ÔE∫[W∂—·EˇXœ!ÿssH´%—≠ht{ÆlÜ@ıΩ`)Á]xﬂ–_|AG˜L∂æ%õÎú1w†ŒQ™¿ô√3±¿YN™t∂?à∆É¡dîf6á„Í€∫N¿*mËÀpÜ\Ök.∞~“}Â#∆àFËj–l¬™ø
 ‚iUdÚˆ§|Æ‰cÅ˘29pÃzw∞ﬁﬂ;(h`eG´GGN†¶∑·7©Ú˚A˛*£â‘iTã‰kÔ¬¨z~)Û˚/t ¥ÎŸ1;Â≈X	≠€’<…n£]DÆ^˚B–Ù◊I‹ŒÌÚøÓk~íbâ∏G•æÊ}y©ã~≥√4«ãu±¬©„π≈kYªÊÛT√Ô,ñ$:Õ–k8^Æé’M∞‘Ò™L].W÷ÀÀ.ÏxëÎ5›ˆîkQ‰'–PûúÄAB¸Gˇ-ˆ6,ñCZ∆ˇùF¯1r]òÜbá]f?8HÀ6÷h£*ΩVv%Üœ .¿pMR|;6Û\ˇ   ˇˇÏ}}sGöÁˇ˜)“Zµn—ªB&ÑXªºh$ŸÏÆ√aJ›•Ó:™´⁄U›çLƒ0cb¬ÁÒ›på„<ƒ±Ï``LúGlÿ˜I˛˚.ü|´¨™Ã™ÃÍn!l:f∞T™Œ  ó'üóﬂÛ{Tüj1DÀ|K◊D—ÿ∏,§πZdÖú9¡nïV uAõ!ﬁ¬âa>i⁄¡ôbßÑ§çò£h`uÜïUÅKæa¨‚Æ¸ÖÏXM˛&T™*U'ã#+%Ãl+◊gìas†x´2ïÜ˜ZƒIÖêÏ#ãá4Tî>å≠∑ é!ëÆ
ú;#oÔâ≠cYîŸ.lFaa∞'≠◊ï•Õw◊W–ÈïÕ•’sÇC·Ω’ïKFö´Yû2?tòÇhZïSGﬂZÉúõBπ‚EVπòCE…≤∞zVE9µÈ»€∆97πìH»üÁÇ¶&⁄Q–„V l„_«_¸∂œDáLöΩ\wñ<‚Sb”ÌÛA8S—~¨ÇPo∆<§c0ˇZT‰VÙ⁄ãh˙0Õ˙≈'ƒ* ‡Ω:E@áËLœ˜«7∫‡êÅíËZ	ÆzQHLlëv{¨”6z¿µ4≥ÄŒ{¡®© ,ud&È» ∆ëøEÁ\u6Íë◊ÈÀ´àk§Y5€ÄOXäwÉ:®Á˛≥„˝∞+˙0;_µ≥I÷],|–Ù¡?`QçﬂÙú∑Ìé/Ôb£'>åﬁ	C® åñÒ.€ÙW—Éπ =ò>íta©◊m·ÁÇıÇg‰0˙ªKõh3º‚¯ÒÀ¯yûÿp±ﬁ˘r4Q3Èñ^U;qTá<öv%hzÅ{m`uóÙAB‘Æ≠J√0SπI÷ú]≤–Œ‚GÔ`SàjöãÉj[Ôƒ≠√ËÇ”ƒ∂!åçsxæ∞rÒÀ±§ïó‰Ù±‘zª^€Eó‹≠ç∞é$<kΩ∏Ö.ÑÃƒƒÇ¡ 
rt⁄È:hØ—dU´º3¶§¡HvË≤ˆË¥€ÒC:@µ”–Ø/é’…Â”∏'Ôπÿ÷ˆìëòÁÀ“∞ÃÙ«˘«êyúàÖÊO‡Wµˆ◊,råìûXÅë*!∆Çnñ~*B%âIîa≥†Íà)ÏJ@Ü¥Öè6¥ Z^´Ê≤1Z≥Œ—©ºµ§’Ï¨ß¢¿Î13≥»ê0ûHﬁ*õﬁö[Hv VSfô∂åÔÀOyÿînÀ¨R†Xœ5·dn„eWâ â∞Kf≤Õ#bùÀgIùJêZ’;e#VTj4≥[GﬁN'ÌPÅΩ?Çô6Í:yñMíñ∫sŸYHs0)ºô·˛„√—∫˜v	f∆	^ÉÚè•ç-;‘˚∑¥Â¨◊b´{¨Ó˘°[›{µ¬·ËDa3¬¢	Ú§¶∆–qÒ/sâ§àéy∂Ø™°ùÒÈÄ∞Áâx
*bÕßÍÒïjm_cÂT∂DDpêÂ±ƒÎa’r3‰<y°√ÀR∫˘¡ë“çºmÇ'¯®v¡Èqã‚¨Ä v‹áÄ éO∂Ê-^¢j%bZ{ø/õb´˘*fUÁ∏ã⁄R^Ä∑∆(w‰M‹¢øH‚`ˇZ‘IÈòA⁄˝Z∆ÑÍgÇ¯»RAKp°zDÍô=¯Ç'D~A˛ˆ˝">ä∫Q4s£-6>YÃE…ı∑˘C¥Yﬁ∆i®⁄‰:ÎxÖç]œ$ÁÃdSs¨3À≠tìtÓN"∂ZY2]ÊŒº9˝d≥|.øi5©óÌå∫a…6ãõmTÿÜ·‘≠∆ÁUâë7ü£OÌÁÃ,´* â\‡ï>∑÷6W.x]pa5œm†”^”Î:>ßà[NÙø˝9ô‡$˝Üã˚œ…æ8æ˙··Øè|K˘Êguºò0»N†âN≥ÉBiÓ-ü–{â–á±_^Yﬂ_XòõÓK ì:ZFeèmÙBè»∫«Ó≤ÏÖ◊Nü—ûßﬂ`≥Ä‰7F«Æ+YÎ—Œj>.F}∆ÑIcƒ¥§#[Ió©bZ€fkóéùÔ/†È§a4Q˜ΩŒVàÂ·…âùO ”jÇˆ∞”uØKÿØÇ®ŸùLo.s$-˝àûŸÍbhøëÎ˜¸Z¿‚”¿_v5€9nU√3e∫îA∂FÇj1ﬂU≥£ÈÁ¯rÿ…∏£™PÌ≤∆VW5Ê˚±§-ï$C…à‰•˘gd|eø˛ô“*U‘+”Ç/Êäòπ˛ß}Aà‚LÒ¬»IeŒÅ¢îo©'ª?í©+Êﬂsx$(7»Zƒöc√EµZ]# e+
@€=\™¸(A∆¢TÕc$©áœµz–∑P>	⁄`u[Û œÏ†0¸¶ê˜–l‘/TÉ ˘©±°‡Œ˙Ä∆¸,7˜Y?‹rﬁŒæ∏çM>[Åg=®JÑñ}7πÓvB¨vá—Ó0˜¥ÉZëª}bÑkéÿmı∂@sA¥ÔâëÒÆ	Æå@˘û#AàÔw£+?€“≤ﬁC%mMª{≠ˆÏ¨r3pü§µÿ?˘¬xÿùó√M35GJ–©™ÂÄ‚R™›T◊ld%J
sU‘tvÄNÆˇÏõ√Ã\“úß~j4YúfLïÂ¬ç∆≥•|.q4ﬁïìªæıS≈I|ÉE¸ö∆^ò¡C9xëXûµ≥aÿÙ]tﬁuªcÊƒá}8ÕhÊÓ"ıa›≈Ô£~ΩH145È;Ê%+•ë¥aÜ4Gµ“VèûwÈ®¡†-;æ_•0ëqÿ˛≠ãE4íRâïÙ.E±D3']ˇÍôjŸ˙õ$ã[ì®HC`w∏ª#…Üæ1ƒb7/ÔúêR+áù0([ò-G7h:æ7¨dÅAÎ∏VÑµ˘ìx&£Èó–±T+'»Æ∂üÌ,“êeò∆ÎîÎòó√Àüâπ\dû\ÃŒ;u≠bv|É∂]DHCè<-<Kè∏{§3˜$y˜àw_êOÈŸÙå1~""˝…Q¯ˇoëT,¯â√ãj‹vû!Edˆ[R]b:˜VW6¡ÚÈ©‰gaJí∆ö^õµ
Ç ©5ˇ*ÚjåVõÒÿYgÊTí°IjTò√pc,HˆÖõˇé	“∫⁄œ`!≥`O-ÿ∑∞”oéıE¶;zAïƒïwOjÍˇ"zwU®ÚÈRÎO”•÷oÁ`ÍÈbÂÖeÖ≈¬œπtm<ôÃ∏‘Í”‘îµåIRˇ;˛Û˝,πøE$Ä]ì‚'†®≤
Ó~€ˇA#÷àXÏ‹ÉE¯%=SÄ3Ø|n˚G,<K˘§…OÃ˙|Œ}@ﬂõèv‚oˇ%WJ„´,ª∞ñπ|êﬂáAƒ2+›Z{]7FÈöW∑	NÙ[‰ó«d5 2≈^Ì%&—Fo´ÌuÒÉ!ÕõJÕÒôQ˚ãWR∂!ƒƒ:Ÿ≠»¸$0‘Ÿû›ÄXœâ}‚àÕ†S5Ó‹<¯ëéÌci≈ﬂcû≥Zz»â¢mubom?≤Ê¯K;a90}ë4E R¯VÄó*•_S√”a}–+B‘ﬂ˘òúFw¯ü·"öDì÷8L¬ãV∫ ´ÙÇNØkı“î‚∆Õ|’Ò{Ó	IäBÏú\±À≥
ÉÂñ4qK5W∞Â⁄¨π4ƒ5AkôÀE‹c-ºd‹H>õÏ≈n‡Â6ŸﬁÔD!TcµÖ˚µ4bÈS üJ‰Ì∞ﬁãÒQÍ{ÅKhVÿ%»#ƒ&≥ÙK‚BL€ûÆ
>}(ìÈ˘ı9—çºvmÃÜ∆îÄ‚Å8"oãBÈV≤É˙`ÃdFrJÿÇ·Ci≈løg∑¡Pz◊ ˙îíÂïÈXU®\ÈG¢O5‘4µÃ®Ü⁄œÂq!⁄ƒg<äp_, VÙSFO€™ÌÑZ•Q(ÂRa!Ö“≈{$0≤çP±Ló.W‚i∑dUêÈzxWd<›ŒédÁT3F0m∏“ﬂ∑ô≥°É;_—ËÂµaÁá=ÃöFÆœ◊óä‹¬_…y$hÂæÙ1™QŒN2¥ŸÍWbã†Ω¬èR‡<)Vpäô¯¨¡(ÊnÏNﬁb6	‚dˇÜ˚Ω¿W+Ç∆	YÛMtkü‰¬ez‰‹†'æ|<·
≈3¡,&ZN!,nËŒCÆôÄ⁄ÒàzÀN⁄xÀ4ùyıF¯X0p!*_·L˝îTör[ÑÌÖ˜î¢√ÏháÓ˛2JaÄNqÕﬁ≥≠Q1Óƒ∏≥sc‘Ü2tîg=§DO$U‚∑§/©Ÿ¶oC£œÂ∑˘îﬂuG†vÓ
ØÎØ9:ÖnÒ?¢Ø‹Â}üvq*ªœ…üÛåg2M–√πLdÓ·eŸi7Ö!˝Ùœ∏{åñ)Ït#ØqÕíùâª¨¬—Ñüem‰fqÅè.JaÓ6.v@I™¡TUÔˆ.ÎhhdLÅﬂÃjkR¬ò%∑BÂ^Åú ¯5¨m#^£#Yaü°7*2Ñô‘∂e;2‡ã=öÌ“éY’ ^¸c√ad´:SWsˇ ü`8Ç"ÔabGP»Ç†Œú~ûØÀﬁõ≤ï-ü(N÷hE7È<≠1Éw~%∫Køö)mÕpÙk|îí)‡ˆç©¬K¢V¡Lƒ,™7i’∑ÚJQeÖ¥¨Ï8ÆÏÛ(†ÙüÖvÚ[~ﬁ«á⁄‚¸c0#)$¸™-˝-:ãwöKπ4h‡ò∫ÖÓg›√À2•`≤Ú◊i8æd)	†}∂·ÅYÊµ0ù!Ÿ™]jÒ®|?!*TÉ¯©ÿÍÑíZ©ÎË»lÑ(‰ÜÏ$5@ûK∞ôG¬FKUav\*!õV`+ ¿°≠®©Æ‡æë∑œ∫m/à0‡ƒ}Iî⁄s}Rj;ﬁ&˛RtﬁçcßÈ∆‘¯j«Õ*∆Wj\K≥´êñoHK´øÌDÏ∆·:
ëC[£¢† E€g=ÑéÍ˝Ö˘∑>,A´Û™ÜâıÙÿî]OáEŒ∫/dw0ªy‡ñö√ƒNÌµå˙Wâ¯Ûh?´<Û!V∆¯•ñ™G˜√‡Ô›]†®M[©ŸF¯—X∂–Õº«%—Q‰◊¨.¶u£>"\'TZk/•≈Ø¨æ/¬™{à ¶E&òì˝æ»zq˝É œ§≥4j≠ƒ¨∆¨âÕñ\©ƒN⁄ŸÙ⁄nà˚P	P4z÷.°
’±ÈGö«ìs9OøòãåºπGÊ˙≈=>CJ»¨åñ¸É¯y•Jå„XR!	Îê®Q∏ËERÀ@ÄH≈I_êÀ‘ñπY’\Z[•Ê≠ÏtˇåG_üß¬_ãÌÁ‰…øF[=Ä;N£±n‹SˇoÄ˘°ø„›¸ö=˜≤É«Øπ√[ë€ûÔªÚ¢ë˚_)Œ¥ –L{ıH˙Û3b“ßªKlˆØÓ_∂∆KÿÓEÕf⁄v¸ÿv7]?å∞—c«Ïd|Ø@!Ö “—˘ö.6ÀJ¡¬≥ fc–ô?–®?ﬁÆÊ«\ÊüNÄ\É!›8X(.Û|ZKÙV»-ä⁄R¿ˆH¶Å¬˚˜y Ê¯ÌÛ‡—[Ò‡Ï±kt∆¬ÌÍ»µt∞	¯ïcŸ@ˆÁ¬%H°Ø•‚B§Ô∏¥¸F·°ºŒüãƒ√Dl
ÏDçˇ»s•É=È_6nN£Ωˇõ:∏≈ﬂü¿‹Ø˘Î>£\àGzˇ _∑?"+(´É8≠Gão†º†•>m”3¿&•ı1ô—¶KÃÿÛ6û,sGvﬂÌî9√°ƒ#%Ç‚‹¿N‘à—9ü=„Ñ+≠n¢†–nîñ{‘yÒÊÏËˆ‚nØ·›ï 
AÔ•=c>;JbË±3Ù‘mÿ∞¬p∆ø∑sÖ-¨µÆ…c⁄d;·°õå˝ﬁnhI“g‰» ÷3Ô®âª⁄)ﬂe&ãô¨ ∫vH!at≠bÕ%Íë
˜¥ûùQ°–¬ÿD‹u¢.q-Õá,¸¥ïu>–¯¬`zwŒu¢ Kn;oKÊÀ5±ÛZ®áY-Æçﬁ÷¶≥e#ﬁëãè÷≈ãÿû<Ìvœ∑Ì_ÚÕ§s6Ω0º”¯0íH‰‚=ï˙väj-≤Ò/‰ø¯˜#Úì›…¶úOä	i
H∫î…ægª¥Ó¯ÄõôZ\ˆ∏◊nœC’Öê´CW€X£5◊ ø+æOãEUQvxŸ	Úüpú„§;É∑˚2“ƒŸäCøá%≤`ÖkúdR}dr∆†jNà•©◊›Oœ1øJH9íY∂à-ÊKáõîÊ‰˘>ÉÊZº˝P–<Ÿ1eÖ‚s8ÿÛYòQ›#yƒN‰tlFW≈∫íœç-‡\˙Ì‰Ù|?åE|Ál9õMgK”≠∑l¿V‰aUG´Ì6º^ªåêSÚQƒÔÏS^S/kó®b7™√Ä–9‘‹~˘§“«ﬂG:íãåÓ3L}¶“â”_-Ñm#p√è«AØâxE¶ágH9µ,oŒV:àèO∂Ê™•éòìV¶BRv“¬N◊'*2l˛≥≈*µÓe¯í∞ıÑùbâƒ5O#≤t	⁄[kºD’ñ°Ø€BÓ5®tπı‹¢C%W¥ª§§Ñ@À…ãêßÉº,º‚SS_c]E≠∫ó S\NvØëv˝-§‰I⁄'òÿNRƒÆD˘HQÏU-xg¸í∫ŸDœMHVÄÙÅn8°Ì(lÀÁGò·æû¢^n>- ›ö⁄N.—˙ßàÉ6^!ãG.Ÿ£èOá{¡1ÀÇ˙>˘´ûmó¸π¨‰SﬂÆt‚ìπ–Ö°†cÄ¶K¡¨è∂Sä»¢_1]ä–›’93u›	Æ:£s¿ŸÙBé–Ùö-êæI‹≤ãHVÌ‚êÙõ´—÷Ê-‡˛&—Dr…Æ©DgKz#.Umj=î(}ŸÆIbääñ»o∂4§A"øŸ5¿%πhÉ_∞ù±v«w±&yï»W1oÈ?ÿ5€ªéümRæh◊›óÙ´´¯∞º∂àjö~≤jﬂã¶´?Çm§Qí|ì
è–(n≥V˛‘1ª«J)(ãBUjÅı˘?Ó˛ÓIÓd„Ù.4›¸ñ‡ë˘˛ª$⁄ïAE⁄jﬁœ
»éa∆8vä¶mëÇ3iÕæBﬁ2)ÜIM0¡X∏|Ùßƒ)93UP7ì.]á86?‡ÿLÕUT•€pJÖ∫z¶Zi[5jf±PY¸…hQ//"¯Z-‚ºVãLx≠ôj—@¥ûl˝â[úéÓô‡â´®§P5'ﬁı}g´˜´È‹˙R ˛®¢ˆDË;∑≤dQ√RsÜ©¢^:/–æ π)s˝®Y™]∆e[Qµ±,ÆÛíTù’`;‘¯{+Ë7Z’b‘õŸ≈boWkt8'„zÀmÙ|∑1f¨ıà–JŸ¬Vtñ0˝*” ©}¯ûä¡^§ZeWS%≠j–z’¿4´ËV’Æ™_E√Äé5 -k`z÷–4≠ÅÎZÉ–∂Ù^&ùî∂‘ê≤äñTyµjCâ[È´Ïyí°æ‡Â3-È√^~í_∫∫]N◊ä‹	¸
Tsí¶◊é’+[oÑˇ5QØ‡ \!W≥J\Óò#*M¨o 
ﬁ%0øê⁄®_ÉÉGµ§z¶U Ü	W|$˝in— J÷¬ﬂbÃ^É‚ÇΩ}öz≠JeüÆW•ÍnÑç†GØ5™tCØ5*Ûœkç Ï≥’Ä∫™÷≥ §yUÔVVÌJ…•~ıÆœ?18áíûˇƒîØN/¬A÷øÿï¨
∆.Îµ0ÈÜDcÛ∫˚CVcó˜E#+ôÛ!®eK;N‘ÿgµÃ§I#\ô—mcÂä†&+µÙ˘€ûè'∫V7Uí@9bœ¢œ8C†<Oa–ƒß9 %P=QèÉûh≤qü D¨ÚTÌ˚!ƒŸ%µO›Ö&Õ≤Ø `†¸ˆÎÂ•È*Mœ©€¿:hΩï°˙0Ï°‡˘@'ê≤—\∏„F¿d∆¯¡ûnf*‘©*ô~
÷öÍ>ÓI\˚h}¸±aCâ™5à÷à¶§o»†É¡∫>6·ªA≥€"k“–¬ ”ª.P)œ"´∞*'ì€ëºj0Í”$C6‹ôUw‡ l_#\éÜÚ]ë+¢´˘¢¬Ùœ–ÚºYö§$ÃHôí⁄Vågã2∞¶bò‰≥@/≤º*ÊQDQÇ≤≠∞òÕﬁœ˚rIçÙóﬂ¢/FıÙà–%ﬂPº°`.yî„È¢•üæ∫o˙ívEÎõ∑y1e√ÓìmÅµQ«˜M1T#uú%ÜIä∫™=yÌNRMAVªÏo3I∑0üÒÿb™4ÿ3∆sÕLß*!)k„xÅQ∂≠i±Hµøﬁ{´+ó Ùu˛—≈ı”+ÎP‰ˆQ"]&ºø«√µ4ÂÂ◊?<¯Ò≤=™Z™<çáÄEã]Ä{D˛øCºTL’É1ÂÙî\XË¯c{wúöƒq)1π+rØKv€i∏´e910nLü[w¨âaIé"üìP"Çp±ÃIú)Êá'º#,9ÁÆÅÀ÷>ÂÕî◊<1ø0ÕQ'µ™ ”\“•`f ≈F+Ït∞	r i*Åü¿ø1OÈ7≤Ÿp∂®P©hÖ∞x©?„ÖbWö¬'L”åÃOS[ˇy•≥ŒMVöÊ¨◊¨=ﬂ7<.Ò7ﬂÛ‹ùÛa√≠çnıvâ˝h¸’%Iˆ‘Fõ^3∂¯2ÔÒ2^uÕ0⁄≠ç.ôÛ˝V∏≥·\u◊äç<t¬:gÆ†‡Ô]L$qçKa√o£óèƒl+Ò≠⁄h;	@⁄adí7Sêvº À»â∏çÕ∞∂á∫agMF[nÀπÍÅk~;'Ëé:çt3}≤©‰£À$∞@“ÎëbÙpdD@JäƒO„·ˆ6¬Ã$T@‰å¢«GÍë“w≥k)ì@[K9[a˝¯…ÔÕEùôFg&·x‹Ë:›^Ãœ~ñ|âj›»´w—4=7Á∆óCø◊–Ÿ»k–¸Ùè£K÷7™á~≈&—ÏÿÑÊ‡¨˚¯1>l≤G†¡	fT⁄—l”zº=:Ω-,À?d•◊MÒ$=ë÷˜•ıúÒÔmƒkn3K√±2t6¢Nıv›àà∞ò˚∂B8e¬	/^#ùΩ∏ΩçÁÓ„èÒ•Æ(qS«zJÿ˛–i∫A}˜C"ıFÈ=1ùrr#•˛–È‡æÍ¯˙[»_ﬁ¿r}ﬂçVÏF˛≠@–»ncTıg˛0˜Z«ç∫£‹[c6 Te^Ü≈CÀJH~~)ê®ââà1r/–=Cïêc™Ä√ÏT>t!’Ïéë⁄AÜΩ%5z¬–æ
Í´d4löZeoüzÒZT0˚ÚSÈ7?¶zs¸U£«_7π…bˇz¡á‹πmΩwø$ªñ⁄âè∏QÂÌ$˜Øœ∞Â˜Üº˛…§’O~ó◊>πê^˘‰Rj›ì+˘UO;8kûÙ'≥‚y•∑=ñ€ó∏÷#˜*6¨W:ı+ŸE¡+¨t÷ª>◊π”ﬁr£l.Ê`:ÑòxzA^ÍÙJz≠”k©≈N/ÂW;k‡,w⁄°ÃzΩîﬂ˘ò‚ù_÷íO¢ô∂K^¡j3§ÖüÙ1ØM’ù†JQ£ﬂM°¨Ÿ5ÿMQRôïoåÚ¢™πºÍ¸ˆú¬ªîŸ"RO”ÔL˘˛‹(¨ƒ¯∂±ìâÜ¢Ωò:Å∂ƒ˙•vü¬ﬂûèG€W	m˜∂!c7|Úï^O)_∞ç"'FN∞[°ÚÎﬁÂ„Nª∆≠S`“TÒì¢Iâœ¬,éõΩåú´"Î˜∞((¿I<À“.Gã0ÎÚæ7l“¥b^u∆2A4à◊·∂Ñ~pslûj:«ñT Ÿ•fï•úπs)‘ gô$%r¨Í:¶&Kpd≤RR ∏QÛáÑï€‰X4Á™¨íY~Ø,d uJ=j‡L#ÇGÆ∏PË€3©aCE¯÷.Û”äúÔ™¯µO˛¥ΩK≈/øX8êÄ]∞º~ûñËã}MX¥¨◊¶œSøﬁõÂKõ∂È6`i≥UûzNâÏ$Ë=≤˛§Ëêf/ÅÎe[±¬Íô™E!EËùÏTN‘Y¸≠ﬂvËÇ£ØﬂñºFA≈_/€Î%ÀV _D)¸_i¨ŒtŒ˙ÄV´ø U{1™º´‚sê C ÄÕb˘«[≥}ÅgS A¸Ø PlÕötµ*8G˚Ú9≠™ bQDüå| KáJ!µ/Òà÷%5ƒ˝ô`±JvL·~1[ı:ê¡„ƒëI|NÏMbº‚enmæÆ—ì}âiTTÀ«œHV—1jãÊıÕZµ∂2Ô|ÉíÛﬂ≤—u‚IU7IΩ¨#‰§œ¸˛cÙC¡$nı‹eÆF(,TªπÚ°jëˇm§X‚≥~8˛ˇvw©r¯ïÆ∏&J˝Ò˜èÄ•&~e¡å)£˛B„ƒ⁄"v±ìÜ"Ûrà‡®: ¬z¬C)¡œ)∆ù£wlcË[&xe‹’∏VÒÙ‡V˛…Èç<π“TöÇbl&+
cÛ…B™©b-$˘¸ª<U‰Bz™»•$Iå˛ûK’áã¶SÖÚE…´Ó”c’~x¯ØoâT¸„xL–®œ~xß1√Á§fr£Âπ~c	Îv]#êOR $'ná1ª"¢S}zïA!ˆ €ÊsSîBÚ¸ÜËpñWôâe?¨_©:√˚πAåΩ"Z6üä’DÀRÛî›_"–Vuˆ}ã◊u'5l˜oÊ¯Q=å©pî>ÊÆ“2üv§ßOÇ¥ò&œVù¡TxÍ?¸ïÈ°ñôƒ3ûÔn‚ﬁ[œ£P}Ü1ëI=ë ÛXúõœß“SôYó§hUj*•ÿ^’πTƒ]+Ì∆ñ[øB˘âgå&”Dë·ZÈ•0∫r∆ãœT+¡Áπ…Ωù#;¯œn√ﬂÖí-_™ëkçâzÀâñ√Üª‘≠Mç°∑–sEÿ®»ÎÆ⁄qÑˇC\j´ç¯}⁄¸ÊÕÙ¯˛2∏Ëq[¨—ìh
-“æ“ø≥2ËÙ6»Co≈∂∏pØÊ∂EY ·€fïîŸsM„KSc/MiæÓ¿l7j[\ÉNFA∏ıﬂÒkwJ‹BÏ:nΩEx[nt›aü¿Ìg<Á≠O<€“˘\µÌ‘â¡áNŸ‹¥us¸ R4f¥u‘RP—⁄¨—–)Ó‚yX6|dò	l°=‡…{VF#∑ΩHj3§I∫≈î…D≥ÎOwD√§ñgÖvS«óhÌ›é‚-ÈáΩFïFUrTåÄ$Õ⁄˛¿hÍÏÇ˝Ê’îH§ü ¥*·xQ&XQXÆ»¥E+2Q€‡™Áà‘` ıê™3·3Ï‹#_»TLæyLJ\√ﬂO™ßíª€ã¸◊Y{∑Øiipë'äîßá•rﬂ‹Àj+ÉÈC82	ß—â1@çªm¨å°⁄9¸Ë1Ù1ãñÆûFáx¬)PsPm›k∂∫Êkï≥ˆPgK"-∆´%5”∫9ö\òBÌ.¿lÍÃVäbx≠*ßf€€C§ÁŸ’aµ*CM?§5ÒÁë…^∫Ít4iuªùxqr“N±+q˜¥ÃOìùVàw—Ù¸Ï‹¸Ã¬—πÈ£GÁ«Ágèõsék8Ó÷IYúÿ£∂”=¥ÌuO‘£∞shÁﬁ>á>:±05bS$>§Êu“M.“Iûb˝úù,∂Ì¶B.GQˇü‰M.–º…ÖLπ:©JvF<»©ïLò3
¡«¢<!|r»QT{|+Ïv±,Ãx;í¸∏CpO-Úo¶PJÍŸ˚Ã‰ ôºüéôúí.€‘‰%_P◊∏∂›f˘ªñ≠Í™5J˘pÔOœf G%n+TiÂıﬁ†
“∑$uÌˇ8->°˙ìıv±≠◊Ãæï“rä uÚUyDcÙV(f√;nπˆ¥’8è¡ú&SL0e¶’xI|uã(Ω2ŒÃzæ3R˝¯´A{ÿÚk©û¢ 1ÎÿƒV¿R◊>…Ãv¶-áÿº∆$ªﬂ<ø ·©*π.¡	DV“…WÆ£dëHEﬁ≠*3X.•øa∫¸DÏ{u∑6~dl¢æ€Èp(»0kπÁ«ú`8suÓ%ß~Ãàxe#•Y¸`û¡"˙Õ=Ÿ1áUhK— 9∏“‚ÑYRäå‡û‰â≥DœíF,øaµoÌv-∑%f¡à ›	⁄Ll8l:M”¢ÿ‰πY$œÆ t"mxC≠π¢3[ a¨+“ìÃu‹rt	∆Iv≠o3É…◊ÿ9N»ÉX6Ú3A)D¿5¨®ŒŒzsó–æ√’ø#‚1Ò?à¿ ]TªÑ∞F¸VÄM—zqM ¸†<∂Õ¶SXÌd´Oã≠N+⁄˜-€g$…nì,¨ç¨H{0ÊÒSëÁn◊±V…∆‘™ÚáËßHV‡%wùvØ∫~ÿi„Ÿ©T>kÒï]y ‡Wyæ‡˜ÃYåØg¶®S7K‹#πûTüæ¡üsg%+\DÂF√Jœh˜¥≥KäûŒ^'≈D·V´≤çÏâC:‘aÏçòû€VŸH˛X™œ'”8Ñ…ÈTË˚à"Ù=ó}√◊f-
æ”œb& ò<Zm¯»ƒ+ô∏û}¨µú=9TvŒ°Oë⁄Õƒ·é††ï¿m7Çì >˛ﬂ=J¶¯ÇCdÄR— ‚<ÄöÃÏ"ö·ú*ßzXÖÏ¢S·5T;úÙÄEd>”e\Ÿ$£§hÜgeÜª?Å\»∫∫sÛMõdßÄ˜<mN4ú∏Â6“∆≈¨Œ∏@Ì-x‚‡ùß}9MπﬂéèÉﬂDE 2`/IÍ≥>®ù‡JvïÂwtö1B;i∏ä√lpNéæΩÖ\JD~P]∂äW©‘˚ñ÷‰3÷wqEE˛]pû⁄;g˛uè∏^ú6	ª„3x?ijådY@]D‡h
öµë≠`¸‘ÈëÍò1æ=À(…†2’$L«'2≠4d-1⁄∂∏ô5 xù‘€;Ec—wI∫ƒ–˜G∆œ⁄ﬂÿìÒÁ'ì∏:UXÔ uHú†QîπÙΩ?Ûúçœ®Rqãí±} È°_0Õ#´lP?)—Nî.‘˜¥Ù{}À)¶ã≈≈Òlyq-–ïîÛJ äc∂†∆˚;"-'T7äØ∂&7∑àHaT¡ﬁd(pMEx¨@óÉkDΩ3W‡ˆ“Kÿ¥Nò“¡5ÉÚdYª%è„ù•jZπe∫§ ﬂr-ÓK#+ı§≥Ãä±∆√}ˇ‰t
cL	˛|€Û˝î=◊ßÁVMÑ¿•›]"±Ó≥D4¿≈RP‘üP6≥ ¬9,π %Ê Â‡Ø{ÿ‘hMê%QS™Ë?£©â©YΩ∫1ÜDb/À}óZuwh»e»;%{ÉÏˆó˝¸Zf©J®	’PŸ6®ÕÍB§‹NTâÛzÓÔ˙âZÜ"˜u⁄ J¨Ç*sÉêP¿(A÷:BÆ ¶≈VÇ<∑ïMâﬂ∂duA~Î]5x*ÒÊW$æ^Ï(4äúRSO3moÓ•¡ '))À2ê‡/∑LxòJ	±vù˘Ñ+ü1≤>ı–YÅÜ"G"Y*ﬁoTq◊˜°Ù⁄∫∞.67¿b¥
3EÈq]Ï=/Ó9>:ÂD*ÈäX◊ÅSgÀ®jR‡≠∫aáC} õ9>á(Ë
¸?”â®MBˆMIx¸r<ø≤W<Ã±ª¸cˆ¨ÛâMòÌj◊⁄ËE˘†-
±ª·“=¥„5∫≠Et˘M™Ê¥ùkµπ√®ñÉ∞O¢YPt∆ÆøuŸ¶ö!|*q!˘µX]øƒ≤√ﬁZNÏi≤}å<åº∆5ÎÇæÙ√3RNã’	hœÂÿTñL7ªL[b-C¢Ã†⁄&–º!É	@…ﬁ”+¯{˙Cfõ¿‹Òª]œÈ$ZçÁ=√rüêäT Ôâ« á!‘ÓÄ¬©-WJGßQò©:óŸ∞ñÒ∂‰C◊U≈/Ûõí3¶µï#…g1Y¶}vT«£Œ«õ…Ç¡˙¬◊…ƒUjmVB
ß_sƒö&ÖK¸∞’:TAM‚ü=&´N2∞®RqÍF·w¸˝Y¢„W?.§EÍnÅsÜ€lÆÙSAù_Õ©µí/Nh≠«“p?Ç|IQrˇ¬G‡¯›˝}lX.±ÒíŒ¨€DLP,õÜëÚ8	Ò∫fÿxˆ}›êSÇMVúÈ*àf˙ÕJkƒ™†3| Y”{_L%Ω}ˆ-t*z1∫vΩ∫ãŒÑPÖd◊ÌWU'∫Ÿ9WÈ¿≠Ï°UwóyÁybs•√RA—P¯FS&i©É¥ÇÕö*F‹†‡m∏O√3Ã·H´r¬æM\ì`≈ñ0¨‰§wlí˛€ot;∑{Ã Vñ¨,¨Bß˚OaQiAπ’ˆò·Ë»ëŒﬁ&óËÍª√√êú:éï>‰ÅúÑ¸L¨bº.oÓﬂr≥CUP^ºùxn~≠ªq`@cr$’¨ñ∞÷sâËﬂ@reaV	o/:ÁÏÜΩ'üV®j%øﬂÙZn9]ƒXÿkYùè©P:!0®zxŸ1∫”èm9≈‰S±®±¯z«`Ë.ë∫x5{ΩJN\Æ„∆©eÛ&OZølñøüÍÂÚX§Ù!˚bJ€¡"£m(rXYÈ1*hòà˘ÚááˇùPËP|ÂØF™>y=ÙÒìGËc+∑BSÉÂ7†WÏ€√ãÿcè(–¸V˘>ê¢@!  -^◊s|∂1ÒR!‚ˇü	¡Á ë+Ic#∑…d<•±Ñ“\‰7Ùá—ﬂºôÀº∫N·≤ó°» ⁄⁄ ÉEA3øŒ£0H≠iñÚG¯˜´˚ó≠-;õƒ“›ö±‡ÄOeÔòC‚(?"◊I<Âíó®DãN◊◊†4≠Ì àXçëÇÍ„«•Ïd$Õ"l&0üÑ!óÉ#)ÿÈ!¿ŒR⁄eIjˇHîÂ;Tf§V˛√O^¢ú0-hÃ¶œñ~Ûse1M2Äì’!Ù#W%|e^ºÄ~lµ¸WÍé›Ó∫DdUÎDÓUhß∂á&&&‡∑√à≥[Q1åÂàµs„ıAˇì>Ë˜Ìò˝Ñògﬂãüπ˘È[yS ◊Ké„;\™|M$(8æ è`?€Ôè0´ØÓ˘õ-˛L/sfÁú~ Áoj=q„_qîí-;ƒÛr¿l@∏E∂Û6>Í9Q6çTqSﬂ=ïg™¯eˆdˆ¬∑—:t®B∂Ä€p
3ú÷Üì.Ω?=ÎØ≈ ,°îdå6≤¶—q9»	º6¸‹È˘qZóÙà⁄G8™y†ÜpHÙ∑‘€ïÕÿAE]83h-¬sÌr†x EeÌÀ©ÍºQ∏™Ùr\f“ã(ì^í⁄
◊X:Zeôn-πÛíz(†Óô¥{´s˝Ç∫ﬂ6s«æ?tÙÙ7H6ØåÇçä˜<w«öƒÆ8ÌvœèImë!È4äΩêJô	«ªÆ„KNá‘-G≈e~„O—aÀv` ÊE:UŸ∂W‰à!ûÍ⁄~Y¯)Œ‰Wiß≠9ªÎÆÔ:±{>l8>Ÿq}mµΩÀ{ÕúRùøÅ#≥¥Á‹<›Ÿ…°'mÌÏEq_zg€#Yu} »õ¨ïï∫g^ÓW3r› £¿⁄ıÎ˙¡P∆•M·c)ANáæÔD^3Kœ58˘î'«xB-G·j},ò2ûQ˜-ÀRÕÊ¬J7T‚’©*”$⁄˜WI™Ω|˝Å§Ö∞ÕÏØfeå®%%∂2ªÔµˆpúP≥kve‚~Ñ°!â?êëÅ¡ÿwπsÔ’1 ‡˙[ø·h<•„O√7◊,]≥à…µ*N{Ò\U8G4k9y2|*(úâP9+€Ä∏ÌKº
/u6yS≤è(í'ìﬂˇ·¡W"\¡∏2>\"(¸¶t˜≈jè¨€·¿∑3ﬂÃO»´º‡5]ø„/W≈˜≤rOY‡¯Áº‡ä&è†è`µÌ—a![åo5à.ïaÃKüUåÎcz·Çvïﬂ—‹üªWq_ÓRÊBZLÉ >≥˙ﬁ ˙˙¯∆Ê?û[AÁ/û^YøÄŒ\º∏π≤ûë»*ª»Íö·2H ®»∞Fä$ûfø@Eö4}/neé‹R.πvc1˘uûH≠#πc;;∞öÍ¬*hdÜjWYaZIÉœ)Hñ)©Á∆jÓŸ„=_’óië2OPœJM‰∏ÔΩ}K‚ñWè—!|‡∆ÿX<>âØjn>Ì5ΩÆ„£Û∏≥nürE7_ä<∏Ör…¶¯)˙¬{^√ÒÌK$^TrÛ˘^Ï’·Ê^√ãn$û”n≥Æ∏ıV—›K´h√çÆzun’m«'{~ˆ™:wd_W	$ûP∫≈·,ìw¬¥∂πr¡Î"∞¯5ÉCÔ]∆ä@ÿ∆*¿Fó≠[˝ΩøË9æ◊›Eg{xÚßë>|)àw‹Ë’õõ3ëÎ˙˜äÜ3?ß‹:r‰IJûW4®¸[Zj∫A}∑pV√vª¿\Ω”€*∫ønØ˝JM–),Kpm@Äû·Ãõ,êJ‰·à?ÔN”¶i.ëäæµr≠„F¯Œ∞’ij@ÈWñÒ8a;m`·’⁄PısÇ›°L““VÿÎ≤]T4zÔ∏~Jı:ù0*ºs3¬Únu∂›n·[ãº´N}≠Öÿ¶,ºs”ç⁄1
∑ãÁŸt˙î◊ÚÍ‹km.MÄMLÚsÑœí,ìQ.„dÆp∂™SÍÊ`5¶Ào‰mæ(‘÷5À˛ﬂør	Lu§6¥]tÆ€ò@3S3G‘_V*ÙfØ8WHÙîY’˚Ò≥~∏•GëLÛ™_ø˛ˇäNùﬁ4~Mù=Úüî7Äu¬~”‰‹ÍŸw6O]¸0KñŒa´dùy˜‹9¥±ºæ≤r≠û_:ªÇ÷÷Wﬁ[]π$+{>‡¶∂¬k´P”-Œ …‰Ω;Á‰Ô÷ÇûÔßÃ.y®Ωkny˛“¯T‚∞9FY©∑ú˙ïFv¿K[Û/ÅÜ¨‘©ûqƒpt’∂”pW%ﬂUjTu†:öW?wÕ'?µ∆ﬂ_X∏⁄ n7µ7Õzl2„ìÜ≥MO1¬†îªñE“π˙6>)eZh‹Nª{rÎÙ“˚‡ﬁG»He%»A´Ã¢Vπ;e	IŸ¡‘jÃéT¸9x<p+fΩTrU∏Ñ Åœ‰û…TeOQ∏ü˚^êT óª”PèL*v™Ú◊ƒç ˚tÂÙÍ&ﬁáœ¨Rﬁ´“nÙ‚ïÜ◊eÂ5iåæÉÑ‹∂4‹[G≥{´›0ﬁ[¨$)ó©¨⁄hfÉÌ´¢îf©⁄*ùF‹e6ó–“ßÑUp∂LMí≥bÇ˘öòá5! ŒÓéCÖ äª}U9oµm«è]£}€>°	£9¶Ê4.πíçZ±`∑Ÿ	a}ŒªôlÈÙÂ÷lé]ZA)]V–Oõsõ◊{`Ãµ˚EÏà‹k¸XCÀ0¢¨√ú¶Åﬂ”3”c›{63{n≤6zı∫:™ûgÁúÕT‚Ñb∆ip±¸«π©T|"a¿»JyÓD,|Ö÷Ù„ù[®`†RcCC¶˘VNA|£\˚QHèCΩXº›6z[mØ{bØÂﬂ}∑”¿ã^.¸È∫“‹‚VéíºXg§©K˝'Ñ2•™≤Æ‘°Í‚_J&t€(–†ÚQ^–È©P40m´c4WøÁûê◊ÙUÌj!À*h‚€k.c+È/÷‹âÆ5›ÓiX„≥Om@&®g
eèiÿdı% ≤k<ÌWô'äé*B4:öõó≥4p¯œd€|√Àsôñïn©Á˚∂~HqæJà|Ûı
⁄œÙÑ•†=¯w†=©ùÚ¬±¬ÖÌ8ëÎ('%
w‚{3ÍÀ/¸∞JÀÔı"ŸœEBc‰∑9‰™m\Ò|?.^*Éî)ÙyïV˝Íœv¡hë<tb¢©¢ã]éù©ö„ô«P˚*ÎÑêÏŸåÃwQµË
‘NöˆΩ€Å£iq|‘ åˆôäﬁ[ÛÀœØ--cÉ˛‚⁄ªkhzm,Ω∑rù]=ªÅ°K´Ôú[›ÿDøxwu˘Ô—∆ ÊÊÍ¸óî¡ø·\ugΩfº·v!D¿ÏüıÕ~l9 fˇ>Ÿ˚dNÅâF¥3wËÁ’“- ûgÍÄü™∏$œaf‰§ø∞Ò´‡Eêiè‡Ω0cÔ∏NC¡2iÅAç∆èñÜUv∆p«2U3¥UÁß§JÛSŸ≥Ö\ŒãËói¡ç“ΩZê~èH§tç<u:öˇ¶ÚìòƒbÙEyåÈ‘‘
èô?© D*
Ó(ı‚π¯#_∞äÚ>g¢†•◊æ«Õ] ª§ÆC}@äÎEem“‡Î…∫˜›k
ÚÓTy ıÀÌ≈L¸¨6‚	KÒnKçû”∞‘®∫„ù‹å0ƒlF‚( j éí≤v‘ÿ}.!8ô'âÄ[Y°∑OrıQÓÚ*pﬂ≥b.Sô√ ÁI™√s≈˚uÃr9y3=Å6Bºø.v>¢T»a˜‚B;G¶P∫4Oê0	3%M‰%YŒtê)@’JeGÃL©ƒíÆ>ˆÒı∞ãøµ\ﬂ—÷¡.Æ`√Ω¥_êi˛B±&ËÜÂÂ˝<≈∂ÃÀ©›1]–Ui·’ÿù.Ù&ÓΩØX›{Ñãh4ra§F#Úp|·?Óﬁ˛=}
—~Bj&„E¸oîMÊß˚£Ë∫äcá5‹âº∫˚°◊Smˇ˛ˇ“}q*“ßHj6i∞·f[¸Öå”mˆΩ}ªP$hJm˛¯óˇ!ƒ*cH}&ÀXesêJaßKHßT“¨ ”Å‘o¿ﬂ"®;∂(È!ØÂ%:^v5⁄:rb¨.Ôñ•{óÈö ëPlEvﬂkººÑÉ¥ïµ∑±‹QRûÉvVs;§”éöVd’6≤H)¨ñP‚¥0y‹nÕÙ+QÍÆ]W&öjŒQ'-ôºÀ?f@œù/3àùw—œÔË∂?”#ÜçNÁÀmô2ê¸˚MA\≈xŒT
íW“◊—íÄ¿ ÎG˚bE«â„˚í$en</ñ¿ÿêÃâ_¸>è%¡ˇﬁ+n%áèOu‰M`U„ä€ C—Sç›‚él‹“¶˚—>ﬁ.n7ÀO5Àà‡ò¥ÏƒçJH¯TsüìP}˙—„
 ïè+¸›¡W\≤–≠S£œ09≠•¯¸f*mŒ‚‘*>©“}§Â§út^©≤pÃœ´úJ0˚}*Õ‚´∫ãNGamÜÕ¶ÔñûK‡r7.3zD[fT{ô5.ıÓT]0{w˘·¶™ê3mu∏·ßûr}_{∏âoM˙a‰¬ƒ2îƒ∏«/=fíı7‹ø˛å¸íúáœ%y©ƒæhπ¨ÎÀYpè˘XÊÎoÖ±ü}Ö§‘%≠Ωú”:S√≤¢∑@/–ãeµ+Øljê=∏‰ªQ7a‡USZ?/¿ãN†7‡^uJf´ô:qÏCΩhH]röÓ¯µÒ ≠çv∫n‡u?$≤˙CfÖí·√ë’ñÜ«Í»ØÉ4Ø∑–û˙‘a•˙†’˜U‹®
˛”tÂºc˘ yRÌª:T|çì‡AÊÃuKîßV¨òôÏy4 ŒñlD±Yt*‰Oç[€ªúä&¿ÒMÍy¬‹+úqJD~$`,Õ¡≠Ñ.Àvt«ØçœëQêØ(èB’A®L+a≈ö£kn˝¢á˜£j¥ÛÿAÓn˛¯÷V◊oFo’Á™◊tvú®˚^g+t¢∆òvÔ*nûÿâÃn‚ùU€!¸⁄∞¡aL&Zëª≠€ØÍ)gBÈí∑|/Ó.áœm‘Ä˜[”˛Ú{›ZZ'Õ4A„cá—ØWä .@\«Ï$ìå'+Ìö∂,ª:Œó!ªòIáıÚ≈äUìºRS¨ õ±^ÄC¬F©ÀÓÖqÁßFCYu\≠?++J⁄WœEv≤XZ
ù}Œ£F∑©[ˆ1u,§·±zñä„äßÎ∏Ñtoª—r¢bF√◊}€"h¶yÒ$*l˘“y”EV∆æÙÃ”eòΩÖmTMÑ6ì¥X€ˆ"¨=IÖ≈ÿÄ|O£˜π‚ç«Ì¶6>˘Ç:Dí®àbÏø‚ƒFå∂¸]gàÉKüìá›öÚ£ì£c˙ÉDR?°Ó√˚hπ=äT…å2πm,•˙dk£⁄'îËé»|a~–)©ı’"ú“qeù#"⁄.§r
3êæ
»ÅŸ)kØä!ëaNQ∫UπW7#'ne•»ñªî˘-SKô∫b…RfEüâùÀ##4t˙!©pkÖ¯)ÉFIàΩA„ı‡¢≤Wå⁄Q”Ò÷`(«2Éûüõ™ªôEtq˝Ù :†Î÷÷/˛› ÚÊF!∫é0èΩÜ÷˝¥†uöI}ç´K˚ï∆’%a‹È¨äö9∆í;g˚DÕm¯,¨w¬»˚%‰˚&„◊?Jn®87eÅ89•/W∑Ï¶Ü∫¶Ëπ"K;z∏‹Ω{ã~∆∑œ}:
ü
‘YE«oL’—&÷–∆éjÎÎ8æ2éøÜõ˛â˛˘!s˛[Z«{	]ı±s∞vBÁ√Ÿ(>lñi◊≈å:ñ!˝'WuÉ¨ıOãÉ”dZ„bÎ÷≈ˆ)n•‚£»M7Ûª[T'ˇî∑Ù¢ “›u∂*G∫ÒwÈæx¢ıÓŒj∏ûÔ}Ä6+Ò»•Xê-qYl›k£›a¶ü$‘M˚™µ¢_%h÷ B›0/ÄEÎà≥
OØAXCa)Œ˙ê[FgΩ.K˘ï˝0ñ"Ω”€¬2È√%∞Kã’/ï’<àî˝oT%IŸ≈€†uR∞AÜv}˛Wî'∫∑;
pÀ)oìÍıˇ˙qmã¥¬â¯	u/ñ0¨<ï‹[‚"W◊ı1Í3=z‚Í´x∞´SΩ]7"≤ÉäÜ≤ä˚D€û;D¨=u∂îù$gO¸e%>∞6^»Í¥Î{X-ÿEáe:ââßøÜ\Ω2ê´{<»BeÂwN|´‰X;∏–+≈˘¨}ÀpECS˜9‹ññŸ¯5Õ_m<üBºÏ=
†8ê,≤]∆`¨P=-?;<V¡8HH÷"ZÒŒ∏‡Ó Œ˘<@\~§¢	˘ÂMæΩeMæ°DÂvÉ&≤◊πÜOôÙπm_90ƒG™◊›≈öTÆ¬ıµ8ulˆèÍƒí(ƒöﬂãimPCw:;DëÉ„Ü\©KXKOıÏ…,8ehïFì¬!√èWleBƒ˚áÀÛJKXO”"Ï@ƒ°g—˘ïççïgW÷„œÁ±uÓMliΩAˇîB–˙y}ÖN˚ïéBì≤ù¿¥ É–¸BFÇâ˚˙A√∫¬zΩ’yy∞√œO…ÈLÉ ˇá¨û;≤á˜¿Ñö√˚6◊2æßcZÉbŒﬂbzJ*Z≤ÊãÅÔa≠dâî8‰·
Q6Ù⁄Id«Mî¡~ÉU;•”"ˆÕΩ6?'ËD±	*¥FÒ"≈WëáIﬂ,—}qÁ—M≤o"∂5ﬁE5˙Õ1ÚlÆ1'ﬂ¢/‰{®∂¥„Ïéçj+QÔõÍ˜7QOSÇà¶∆¡E,‚1ßŒ-ã"= Aóo¯ﬂíx…WL÷ìóÎ¬Í∆y’lOq#)Ç
˚Ês©∞∆ÇÌ(ÀÃb∫í›BP$+hº>1^â∞Ç¨J›)wüøH'Iﬂ{È<Â—˘Rñ»Tnøq+≠
qå◊ùÉ Ø5ÒÇƒ`ÑMt0ÇBd}Cß~éÒÇ∂bZ~æGWf∆…5À#À-ßk≈zƒ≤bõ*µˆl5€7ÿJCâï=eäÒI1>¢≥8⁄ˇ˘U÷Ó"óaô∂´cô∂äeJé¨ﬁ÷¶≥≈°L€÷@Zƒ8o•Ã»Ai€™æRD”ˆkDˇ¿
ŸoD”£f˝¯‚÷πï+ÁŒ≠¨C"%⁄x˜‘∆Ú˙Í⁄ÊÍ≈™≤Ñx[≈ı»#Ñ«˝á∞Qó0µJ◊óÿáVI]B)Bï*0:¬É ôÈ≥Ú`⁄öC≈q§≤h’À(E®2ÚyÙ•¿=†"kü·dÌÛedÌY°¿b©¡Úàsh‹B©[é¬ù†Où.•¡®—J¸=¸Ù$)$¸« ïæ—¶„kÆ*‚L[Núó•⁄Hìbth˜≤:í+«ΩHÓ≤a'ì™‡ Çºø
$Ôô»u—öÔ‰èDïÔm∂§jQ5€6gb&È©ÕÕäÑœÛSÈ48B8Úô@Ü>f¸âRÆßt»ªülóÀˇ˙√√ì‹±ˇB·¬œÈ˘j√±Doõõö*±X©Nˇ„Ø˛EÖx$Ô6˙≥X™è•îªªÍrˆR„ˇ¸ñrhÔÀç∂ÚîôqÍ∆éOˆÚFõ≤,ﬁµ(¥\ªrÕ“i’zUππµô§‚ÏlyçÜTX¥R2πj—fƒGV∂∞’‘ﬂ¬-≠≈Jñ/Ó…◊¯Xƒ*?ˆÃîÜkFøúÔ‹2>@>·°»€ÖkZ|¯¿l)Ìó;÷ãYq)mØƒí2eS∂wFQ∂W©hêr≤Ç¢a7–÷ÊÕ<◊n˘QàD_éÍB}ÚÙÆG"«˙∂(›0êRø√‰NÕœ™ûê¬{£ê}i´à9P…®xò‡úWÚörÓs¡>C p9aüRá¸s§$ïPf
ıXK≠NÖ{êÅk®¶±Zv ïÉ§bÂ¿7Wœ¨./Å¡ΩÅNØ_\;}Òí“Ùñ√µq_f˜‹TŒ éªP(åO¨4à5îßG*FTaYgçÁRh`6≤Ãa|¶zsgÀ ≠A$™¥ï|xÿ∞í}ˇ¯=m¨∂$∂¸fRjãú.äÉXﬁ€‰ı<±MΩ A≤ëÎ4∆JI’ñ˙t RÁ¥{‚(<|YU0o¶Îä™w˝z*⁄≠t∂™ïGO´ÈJSÉ◊4˛±q(∑ÒJ[Ú˝î [«(≠◊+œK Ω§K^Hyú
”T
ôÆ¥Ö∆[K?Í%"Ë9ÒÙœd€‹5ÕŒ›û˝p´\ÇπC„Ãå:ƒ‡RŒ™ÃNk∆6ÉIWzãÊfI#`—X™˝∫‡Òå–õ®Áva*ÎµlyﬁkóŸbl7A0jJ…S¨∞3>Ó˝ﬁ?2Ú6ß‰aUK$ı#ÚÀMÖŸ®¶N˜"íÅ6 â«Mç¥¡H#Ê\Ñ@|»KDGZ’í√Æ˛ˇí/®M?gC
ı†`†Ï§Ú÷«£—x7∆RuT˜<ﬂ%ﬂ;G¢˝'–Ëè_ﬁ£.…Ô!—ôhõÚÏ|S÷–)ß—tóa)@kí”/I@HFJ)°π⁄ˆÅÜòº ^É,–=™Á˚E©ó˙èªøˇw±íHY5¥rÍ§pm«êÚµS˛¢˘¥ª$IæH›VÚ◊ëãÁ?=mº°Bõ1 TXO”Zg¡Z˚/ÍàO˝ßñÔ‹u?ı¬¸[qÉÂ´vú]l†⁄L˜_≈;Q'Ã7ƒ…[ä”c.:˜èXÒ,ªWxGÒÆ‚
Ÿ‰ñ¢∑’Ìh,ÄÈÕöDúvªéÁ◊ÙÔÿ,*d˝ÄÓÅˇ“aıÇÌp≤¿êΩIﬂ0ãS˘mÁ(íÑOQ˘í·^Lèæ˛´16¸‹éË~ÚëÅkõ+–Í&⁄†≤∞¨ï•´∂)ìvËÔ§•V∑€â''±%Ÿt„â^wpøZı∞=ŸiÖ›[ù”Xõòü^òô]òwfùÖ≠∆¸—Ì-˜$∑' ≈Êtm{›ı(Ï⁄91=?uË£S˝"˘kd^‡áÇ˚JÑ€⁄']‘`õµ◊.∏TÈE»é*j…âönw”Ÿ"ÕÒ_Ù˜áë◊ÙØµÍ≠XíÎ&¨CŸÍÄ£EËh·8‘ê–æ∆…‘·¶àhö·È¯S@'9.ƒ˘%Ê…1 ŒMïXœ‹∑˚GÁÿª-¶Ω•AûìÜs¡´d'˙Ÿc÷!XÑπïŸO≤´‘vc?(ÃtoÍÓ–WäPæû´>«Mˇ Ñ∂Ò˜Ë÷&6—'+±Ò‰O™,DÙÒ0·≥g‹S‡å3@ÄT nÆMD{B]WÜ{»„≠WxıowE%ÄÒÆ·NƒNY∞≥`*Ú67X1O§äÔ˜%.ﬂ˚à'w˝Å˘i¸‰˜UñÄ~ﬁ…B&Èrâùûd¬I◊™-Õ∆∆2ó‘Â	¥
‹…¿F∞tve≠^8uÒTn‰’`+ºˆ2†[ˇ  ˇˇÏ}{o\«ïÁˇÛ) [l&bÛ-QIäl…‹P"ól⁄„ÉË≤˚äl∏_Èá$ÜC`úÅÌ5èw#(ûMÑUº±EEíeAX_Eò/∞˘[Ô[ØS∑nwì¢6ô}˚>ÍVù:uÍúﬂ˘ù£«>pT†[˙êc∂¡iœË fÈªøå˜Ω˙Ó!˝—∑Oﬂâ„è‹ÉI˚nü~ø)˘vú˙ñÈq0* ˝»j!æ·ñ;oä2rº∫ñ‡ÜP8ÌÆÉªÂJã>±Z∫–k‘Ö^t°xtπ˚|Q{‰?ÒûT">ó¯ÑÍ◊9¶f«Ωr(áõ{«˜â@9]„}÷ÚY&Íöıô»xm„Ém°òΩ∫x∂$˝§	©PªIæñú≤ù…œ∏v(;¶è#Û4ìSŸx‚UÆµ∑zÛ+„·Y÷¶u-≥ÉŒe‚Tk‡uZ¶–Â€ÁV≥œÊœ8Iê¨/|ïŒ®/œ{í˜≠/Áqo1¥Á,’DŒNæß_µ÷®jWëÔÈW	gQr;‚ª≤R«'™Úëc◊ô/Å\"PaS‰±Œ—πb°4üúÖ{"¿ÔíbBß)≤Ñc .¯‘AzT*µ-hà[%¶JL/ÂPÄórfjzfrˆÙÙƒÈ”3£3SgŒLGßŒî£xÙRé3/Â$qQµ£6át™á¥ä⁄ˆçM¬J9Z"´&L≤¢k4ôÿùUuÿ ÿPÄ)¶‡À,õ^3π-†ıÆ‘6j˘†'DBXeˆ∏ﬂ…ê›”Tk‘JWWâèé>3’Ô‰ı<yx®\áÊûR|M“W’Æw∑|ﬁ?°ea‡ß≤û:†“∑wIﬂfÎd∫Õf‹*I¯u;ÆUò˚iW_™zz5(ôH+‡^Âˆ3ô™-2û◊BÇåﬂqV˝t„_Ó˛Ê‹Ï^eÏÄ|[ñπŒR˚◊	ÚP”\$Tñ±Nî™ÂSYÔn÷∞ñ›Õ≈ÄΩÁ	oÑ≈¯Z‘≠vréúvØUËjœZPƒCõÔ¥*µ‹»'¥p— ◊ÀöÈ4¿Tì
ØÔ-‹íçv‹z3_·5Å:}"P¨åOB·?f¯«4 Àw·Œ`ójáièj·CÙQ%<√Xb=óÉLªA⁄d¯ı+MBQÃKjÜ`ã)NpXµ– ©|4¢ıE⁄XóH ﬁuSáƒ:ﬂe›˚ç\ûˆß)O…ªrŒ[{Ä‡ÌcÄNvÖƒ;ü‚^#aœj_´q£}nw“÷Õ≠¯ó],£∂EàMöRºçïU‹"Ãû[æGÎñdi˛Aæ3˜‡ÁÛy€ƒ∏Uªÿ46⁄~ãŸÊ‡=îúÁÆÅãy¸4OoÎÂCìêzÅ®OçDÍ∂Òî”6&KØô“q≥ù?º÷¿ScK]ïÎ$Yû"D<X,î/â/—x∑1;M´¢H'‡Älã®vÌOb!U•]ã
Àd1EŒùáb *; í≤˛ RÎ>MKK≤S‚OLi”»ñÌÉœﬂP6éÓTé†¸ç…ÄÏ∫8á"1™2mx≤§Wú#oA±¬‚R]Z∫dá√‚rÖ0E\™le	Ñ—8Wj4, 6mπ˛›»´Å±ÊË)õÂ12‚‡‰í+÷®SÓ»ÿéN9îPŒtè1ú© R¿£„XƒÕTU≠*±≠S∆›ùRY¿í®?ö‰EÕ 0g7Q_Ü(í§ﬁ	å"}AWÒ/X)üØŸéƒ†'˘ëÑfh˛! —∑¡≥j$CúH_#=1¢§-wO-”ÔOO≤≈„◊2w©5é%´3◊E¶•¢ÑË+0-vÏ∑ ıOÆéßòﬂZiö¿öÅ‡Ú”∏‚ÉÈ·=ˆOaŒGw ~õÉÂjº]èIO‚n‹s’n·hØE◊¶$ÖÀ∫)·‰iaH,ü¥¢\ëÄùF ∂4‚∂¨7ª.6≥9»];–ÿó¶vÃ:´a≠\ÜvAπ&›»võŸiácdg∞®ù§Ö.>Ñê	≤®öî ∂Xzt¯Aà¶äÌf¬˘èùÁ8àNb„≈’∏‰é∑ËÇ&ÓÎ iÜ‹_ç»ÅQåM&Á};¥JäæFµæ:Åäqi{Ëº}ÏÏª*ËñóZQsªR¬;E¥∑+[ÿ µe∫·be´“â™Ë2Óïò¨tCÁ≠Côn¯v•7p[Ê©ùL Á≠Côn8øÑ÷IÌmºA:Ø|…tìı¬
n¿•V„FÇ˙Õwº˝°45^Æv À: uÏ1 …"•ã—N€´,†µL¨fı.Iıp†∞<ü€ùpOzºM9∑;5±ÉK°©£ƒõê…¨ß‘ãsWËõò*ÎØ]gÖÓS||Bx‚°Uº!°XùtV!ˇ"ÀËdßàC’â◊Îe.iÃΩ!1wq∑á(p*Ω•l‚<£åËB‘Æîl“dê}⁄Û¥5ô%?π¥π?
^XÅKÔC¬*[≤–î≠01*_Îº=äZÂ##b¢AΩIô∏˙X–í√É¥$ıRHöTZœilÚπ¿‡>f“µ⁄äkïnÌ»oOo≤≈/>-˝‡Àsõ∞ KÃπ¯HMô˚«"Æpm¨-£\qèZù¿ÔóVÎ%:TDC≤:Uƒu«éïó(râßée§=¢ Ôèdì#ô‹<≤FÂE\~ 5öÊ&§Ì4¡º[èvÈXl¨˝Ô–å°oã•t¸çÓ*¢|ÕnµÌÜ±@x"ëÓ∏3ÇëN≈ÛvE“¸ª*0ù%≠ÚD/¡C™'∆¶Hx}*-€•∑“◊ê˙DhÙJîa≠æbïW„ëG•X0∫tRÈ“ÅE®ï3sLNˆ∆µ∞óﬁgÖt'C·H°ö‰#±π˙Jeæ˚∆àBï’2RıésX-¨]\Yª<e°ÄÊØÃ/ø[\ZX∑AÕ∏EëÈıR||8>∏ÆÅI!Ïq√?—Ï·B‘¬ñM´3)~…ÿá¬Nπ®5®gH/}ü£¥…•w€gî∑{∞à∆O“
ÙŸÕ˘4–∞™=˝‘Z‹NÈ7Ù≥’%¥µ Èº≠Jö|òÓ≥◊Î¥‡ıÒR^…r‡.é7´‘ò°È2«ß5{ãÓ˘ÜŒˇÂÓ≠ˇ!º	5Ù«æ“$–≥©«,ﬁÕÂå	ÿé™q{˜]á`Ô'F–O–4Ó‚ü¢©…Òë|ß±L*s∆º‡Êf}Ù¬‚∞ã˘3”{(©HÓ‘ﬁuˇı€ßËß≥˘È7ÿn„+ÙbˇO/ˆÔQÊFÛæˇ1”¡Aº˙≤ıø>¯œ>Gt„E	ÔsÑQÆPÉø\πöò$r5;sDƒj2?AƒÍs<5ŸˆÅBÒÛ√ﬂº`—ÇêÆ˙n6Gﬂ¬Ê´AÑÀ/[ì∞@1„Êêƒ
€o†ï˙(…¡˘€ñùﬂprñOôﬂÁìƒ4Â-ú>Î£˚wXx^Ïáïì!A¢.hæIc˙Xà	kÚ(ˇõ˘M;~39ë¶Naeñ*ì/]ÀQ’¶ùµV>†˚vÙœl4ºõ&√,C2™V:;Ërå_∑îní]∂_∆ßQ2Ãa_nOª∂2¡ ê7Ît7[qù‰-o4Æù,•ÒÛÑÀ$‰iÚ%·…∆†…Æ)@*u°ú•ıR£ÉD∂ßSïîE>û√íbf’CíækÄœ0Aô≤>ª=*≤û∞¸Â'‹wù[(ÆÅ6¸pE5Õ‰gﬂ@π¬ÕaµÆw<7ÉSö-/àNífó >aãÔ2Ω*ôÎa∫Éï›È∆Ë{ßfﬁ0kRdM…Œå&<J“„ %ªMΩ+ﬂ(ﬁ3f6%¬‘®„1hìÌ˝æWÇ%‹ZCÁ…ÊËî%ÈóKDiv˙o[îzvª/≥ñüâ/¨TÀü/ﬁÛD¨≈9 ≠GùJ˚ZT‚·‡¨í%q6xõÙöﬁ¯|+"1/b‚Ã‰«˜Pé⁄º´‚¨∫Ó‰#+àÏ}ß5I$/5 QL=RËCKZ¸ ›<H/ËÕ—STŸÕà¥euw
Ùû˚Z¨+ãª<‡	f]Z^π0øåä+´£ÀÖ∑Àh±∞\(–¬ ïãKkóÁ› Kç˙µJ´∂W„È˚•ÚÄnﬂ;É?ÈIûËêËmeu+cøJ¬Yf˘4ú S„B ®Ÿ.X}Ôñ|à…vä3ŸN•2Ÿ™ﬁ˙eR	ÓIæ ∞ê¬·0ﬁjGÌÿπˇcRı ¡û∞Jô•âcÌ&≥Í{<µ6óÉJΩÓà’·}V‘ﬁ6Çtßq+O;^“V¡¿÷∆^ﬂSäÉÄ.◊ﬁ—‡\w÷
óïRü3ç∆∂qdÈg·ªÁÃc˘%]ËÌøˇ¶Ωß≥¬zΩ'9;Õ›®<)ç’ÔÛX¿¡’‚4OŸyÊÀpÄÒJ˙Z_eΩU3ÛËa9  Q‡ÎbXb’õ∂*[≈”@Ë˘FhyÎÂÂ%ºóîí»^%úÑé,ªXûï≥/;©>Ml•Kn:OèíNü/Öåœª◊ªπ˛ ±úòè€ÿ÷òñ⁄‰î
á¢G$Í…@;·} i%◊&X˘Úøƒ”∆¶4ÊŸ‰%¨˛AêŸë≈V]µz2®ò≥)`20gP≠ÓG%c«√AõyÎÖÂÂ¬ZY[ƒˇboÈÌ¬⁄ª∂]Wf	vX≥Ø–ÏØ⁄®”hPΩ %<øå“Ã ∫EΩ”≥Ys·u	éº5ÁÜxÙ\øÄ≠nƒWXu æ“° nK´§óô≤Fró∫|–Õj#*/T]ÉÍn…)'2∆µswoÚ˝ˆ`ÔeçäTLé”í1ÃfJ% ôÁåËD∞…›†Æ⁄»Uüaiq˝Ω©	':˙Ø˝øf·Ñ9KâÊ7ª;≈∞0÷g’i0énúÏæPÍá["ÄËa0Â]ß1”§≈¬ø-“}ü˘$˜ø†ÿãùˇ	#lÓâ'Ø…‡Öd(tlÇ˝ßËï€lÛ¿ªAñ‰‡ÏKHî†˝ù8ˇô¯Ì∂óyD|©t€¡lªGƒŒ„[~/VTíâ¸=	ËbÛé≤t≥J ‘.ı;Wù`≤õEÂö√LÆI«*cuŒ(•„r•[;:Ñ7/o“JU˛îNL&?h<ˆé‘&a>·UKâ>EπKïŒ[›ÕìËR£±Ö∑nã-<Ï'—œ+M¥å<ó¢Ô-µ∞€™∫DTõfÇp~´“ŸÓnRû˘⁄N+n6∆∞„UoÙ˙D˛WïfÄ¨_¨T„çVp‚¢~Ÿëì¯c)7•‹Õh˜πTú$wv`¬Â≈ãƒ∑¥ÿr∫?áö≠≠>–nt[∏«Jç2ïﬁÒÚÎ6L“ò\˜7,¡éC=∫ÎH L˙Í‰Ü•∏aÈ#|¥Ô4„g”J¸Ãó¸◊oFü#y∞ﬂò‡◊ßwÀÂ&•$˜™IîJpè?ù1v—Iœ∆≈ﬁyúDÍ≠ìo|a—ê°É¸ûN»Í˜<»®*·π)ŸìëcπódEaw/ ÖX‡Ã¢˛c@Ê‚¿Ω}7ñó—¬ÚR·JQ∫¸äÛKÀ"KqueucUı˚]gÂ€©∞ÚÌ,ó€pÊ˝/”3(HèQùD ‚ΩVÀ9Óx’7®∏›âjMEÃÿ]+ÌU2úo‚e/(¯æéª‰Ò’ùnõÜöÏä_D¸í!¶·7s‹c©NˇHÜ{˙m*ı_4˘ŸŒ[≠≈‰a7j—sáH¨#Ìlr*Åb˝Çl7q«e«”µ&q¿ó_Á∫ÓC0’jÿ}ƒπ }‰¯®Fä~≠w‚Êû¸7Ò«ìâµwá<8‚Ωû÷tc7I—q…p	,«ìŒdˇ:Æò˙áø3˙ëùB˙¶µÌ4∫®7’Sª_é:€y™+sÆyñèjøM!ﬁ„˘3÷d£è^≈K+–\åI/Û]'¨ª‚U;;3´qã(‰^n:>c›ï˙œ.4Í›ˆT?7ûQÄ≠¬YEZN6è^ËqéôûÚ≤«≥VfÊ≠ÉcÈa˙ÃﬁkZ&_móv&·ÿóÈ$ïõc–O€¡äpäÉººÛôIRﬁôˆçÙïU5¨b`·í0Qaï´üFOˆf¥EôJsÜUkÆø¥¢wc≥B=—¬3∂Rä:çzãÜ¶8…õ≤Vﬁùò$±’Dû≤Ldï»Öˆä@é‘:‘éíë WµœÎ‡7ﬁA¥^"z+é»®¶∑R©øù5.íû[œ„-\«ŒÃÿ≤HZÛ≈Ù0⁄Ô´yXRöI⁄çV‘EΩä⁄º„ô6=ﬁê2-Tß¶"·Aq‰o¡ù>qOæÚ˘{ó°á˜˘6û@qnÙIˆŸ 5‹¢vlNŸC¿∏ªWI˜ë‡=Î@MÊ”{Äø6T·,Õ©X(¿§:ÁPˆRÄ^ßùIø´@zÄ(˛utÈQì∞â$t∞s™Añ“L•∂ßñ1•4VR€´÷ˇ‘ö,~0[-éß6<±¶RZŒÚ
çÖ“f˙]m0=`µñ5õJ¥ìôp)≠lv[xd;˘W••¸à⁄V~»j-?n∂óNiqÇÂmaﬂfì¶∞jKÿ´!Ï∞Ÿy?w3ˆÆÓAÍ„Ïı≥j˚Â)º÷MÈÀp1UªÍﬁwΩ·òA9±çæK#_âdÅï˚Èë!}‚∞ª8¢ÉCÜú≤G∑Ó¬óD÷Ü4aaß>[¸Á4û±O[¡okÓHË˜E^O.fŒ‰'‰ä!ÍêÄA¸ıê∑f¶§cïJØl©∑rPu¥á™πêüÏ„\jHXRhÄV˛Ω◊…sÄ"ΩΩ‰`8`Ìö\Z≤!≠õöØu6“˘í®ﬁ _pøé}ﬁ 9ﬂﬁ∂õH˛Ê®Ä| 4p@ÇQ˙ÓJ+‘∆K˜DhÑ5gË•sYÔ•V£Zç6Ò÷ÇYX*…æ6É	 ‚ˆ2  Y√_÷““â<Z&Ï[â≥ÔZ_ûGó∫ÓÁN£çõéfª>%vΩhj´ïIQ”—Nct{≠FMôñ◊+—h+€≠·síﬂîŸ™»¸ÇÑUP≤`6µ´…a{W¬tÿ›|Wª@g4@≈Ë•≥hˆ¬∆ÔXÏÉ”Ω˘-º5µ=øAI}xs î9÷Î¶*ÁÇ¿X¿;ìjù¶‚»~M±BÃàO_ø£yˇ(Q4∑ï‰ÅoY8¿iƒÄÕ0QO∑ò}qT´‚M–˚q‰©8˘
+π%∑_†"‰~FcÀ«3Q¿y≤ó˘RyEnÉ}•ê<Qx¸ø¢à˜{∑8poügß>Wòˇyß
ªçóOV√jR¬:áYIêeX/=GˆèÔÎGüƒÚ/á≥ÓÓGFÃ⁄œ® d«'JXTà7k{ò^
§3iPzÿ& d1ÒLLdˆKhäWãj∫]^E#	Œ6˘◊£dì¿§K#hbì÷˘Ø#Xîå®ﬂõ˘J{[ Ân|xù.3Òî◊Xû{Èˇ˘j‹Í∞˛Ôß˚ìâÒâs…ËØ˜âuÓﬁS∏©ò˘6çñHD4Ω	]ƒ˜}ßRÓl+ˆúõëﬂ‚5ujù8Å^SØìÏõ∂…œü8Õ=±ÑEë˙å’|ôPkàïÄ†%gôbnÁ	GÊâ
+H¢6èºÉí#ˆ=ÈúJÎÕi†ÚËW•ºO	ÿ)x√W,4e#Â˘ó$4„_*s÷º-G;m3©ùÜ(µ”‡˜•/2à_GÁÎP ≤Î&,<%†Áı‚Xb(1€ºÅ>Ú"ÛX…
˚Ï«c¡9
ÇS´‘ªù¯ËãŒcŒ¬JqÏ«¢sDßóıÚ—ñ≠t[uÓ~ìc◊°ΩÜ-ºô7–*C›†hÍDq2h}ßç≈≠u	§Å„˘‹&Ë¶õR¢µÃO')ï∆&fôL~ö“¢Vì¬T«=iPF$ºùNêø´mÄmèj∫Çí»óÌ7ÇMÃüG0Ωa¬Ø$Ω ◊*ÿúñ««¶”£_tèvW–Wfp6ú@vròZÔÚ.Bö∫ES»∆É¯>Ê¸&XÌ§JÓß1'ÎÅ	ÇÓö4ˆ≥ôrF˛˛≥JˆXx1\.
˘Œwƒƒ”.4}âÓ	„Â ª˛k9ë%›‰#Í˙µ‚?b’˘îÍ@g€ùV£æeuñâq∆™bˇ·Äãê˙€5¿s† #ÏdÙôÁeyîßR">n©OTÁëˆj∑ç
+?HVí$µEÔtË’8°˛¶zÉΩì›}-Óqz&ΩíZñ≠î·øî+‚9#,Û˛	<6w€ó.õaœÿÎ?˝¯HΩ¸âõ=T. {ãòKé⁄‡É∂ÌD•OÊ—ÂJ5nwÏNFØãxˇæÂï%÷‚ß©Ìçö÷¬ Ëi=˛˚¨LµûÖ#ﬂ¬H™πtéB#;wˇ¡(ô>‰ÿUçÒƒ2EÛ| f†”ëÍ#$Gú€÷q‹êY>á rêÏ—∏P#ôxo‚—¸’¯ZgtÜN◊ÿDø·ØFuò#‹”¯Ò¿r÷(ﬁò$Ùe>Z	èF¯kπ€¢‡PJ[	<∫›Ÿ©∆Ávw—‚4õCW_ﬂ•∏„Zt37sÂå˜ö"X„ŸŸëΩ7Æ∫íf»«”^üô…_·µF]ºZºªà¶%Œπê*Zÿià‰µKs,VAŒ}®≥_}âœ®`Î|±·ﬁ…†áB–Âq,VÒçX‘q˘‹’j¥˙X∆£>L…ıîdÚ	*›F‡É\$Îq|ã`∫ÊìU5¥Ω˘g,ÅÕ\€¯Õì®ΩTæ	Ê°±èH€X$+ 9z:kd(∏2ƒÙ´∫-q1IÏ»v9=ˇIÓÄˇÃì∑ÖØq¿ÛÕù0Ô«;ÁvIãˆ¨}Ç{c‚jVÓØYÕ¯;U*Èp‘jË#À*>l¯RNx∆DZ	_∂´˘ôc√¯P(¡ %Ä<Là&„N#='WaMƒõ∑Ä&Ö£¥ßT•â‘71’ﬁ{@ì‚≥Àßﬂõ‹:BMà¡Ô«£ÔMQ≥øŒY9ul‡%9ˆÅêè◊]≈O±0€l¿ŒËAzH¸∏π™ã'DÜâ¡“b‚Tí›ï9ﬁS*„4d"n@˙*™°®bOÎ\øìâû„v4Õ:*êíßC◊U‹≈„†çk6∑‘4Œ“⁄aqfìœò)0ﬁs≤+ö £d7IvD◊H™Œ	¥Xi≈•∫å∑Gq}ˇ‘?mê˚£¿îô~≤YÙÂƒ∏@d&sôÄp™(ºG·i|8é™TPΩ[3c¥vyµƒÉ∆ôËT €l‡û›h„õ⁄ºqJõ‡MÜ«›ï!”(||‡*ΩG7xèúÇTf'^YÚìQTv*>…ÙCˆªï∑b«rË⁄•%xÉ3ΩÅ—†Ç†
ÈLä√”…*'º
O9ÁôÅ¯"‘rª[qá‰Àœo5.∞Qg™k©„6ïÁ;`8§'∞YííÚ=,S«á2◊áeÇ¯0$Ç±Ô‰ìÜ'ü ŒˆÒ°„·K£æúŒ;ï:6Ts>;®RûCWK¯‹Q∂`º$ÂÌ]Ö∑ù¯Å‰‰%|+˜≈æKÒbYfﬁ}µ‘È7YkTÒMÜJXÂ7∞˛Ú]Åmøj£„&cUÂΩw•ΩÜ≠ ïzu'‡‹:ﬁBEUbD[∏-W)Òÿ3˙øÖ{Ã™ }§` oS˜«c‰Ó˝Ñ≤Ò58‰˜–»%Èî{™K]·6‰ENh+m1c¸j	íÛ≈◊_]˚`6À }†öB§ÙUÛ¶J…§ëU…!‘-Y	[&Ú3…1¨⁄\õƒFœ(ô––‰'Ÿ6Á®{)Òüﬁ’j‰R<^àt3	/‹a—"ùáR–"ÚXÉ∆ÂŒ#L#Ó÷Å+—≤ùG'7ÄI?èÕÜÑ·˜ˆ´}w“
˘º·±˛´’√G\cÊÜ‹g±¥∫°?ﬁó¡æ{_≥i˘HçÑﬁ”‡[§î¢¯QÜAÕ9Œ*<¸Å˛À¶‘Ô…SIÛÜ4Î05/®ñ∏`≠ˇ≤µ @u»n-—p∂:N≈Üz’õãáv<LÁë¿@ﬂ·[Dkå“∑Üª≤çN†w≠˜—z3vî•ww∆=ƒ -∞}©!ZBMWƒ◊É?û/Ø'ÇÚÉƒÀó¥µ»îE(Dê<R í>§òìw§xIî˚·™¨*Á∫ä— $é·%m‰¨»ÈEÄËr)Ûñ:ÅÃ…ƒ+Øjû±øü«Zéß0‰X¶Mﬁ`Äè;jô,LK„v†|DA3a∏çÓ}¸ñã{oHÍ‰gbIbh§o¬‰+∂8%X V¢ºÁ˝º√)#ﬂP»tb#&»€ ÇˇÑø'„næ#è=T∞0íª‡©‰yñıèX˙‡Cˆj¨Awdbª¸∑Ï›|åÂ>
E=◊éÔñKlW=˜ß|2∞Íˇë!¶|Ì˘R⁄CZ(1Ò’°'◊ß≤Ñ*2‚Œ`fˆ∑Ú8øúû!Í–zD÷<¥ÿ∏Q'ëpö¨>ﬂ∆VyçÒµr∑˜íI›Ù°íâÖ‘⁄sP≠LyTûE“¢&T3RÔT÷ˆj‘å[•jÜí¶,l¡d*Z3u.›‰ç›º4n<ß◊Å	Æö≤å˜ß	<œòXÏOH5P—P˜Â§¯BL
=á7∑∫xqÏÁK´6E<Ôà—≠>W∞iÙ(d@ŒŒL‰Sç7+BáY•g	 Oé°o©éπ-3ñ’ºqFŒü›;ìG+ı®^¬õE<|Ö®U«´8ûı≠8zü¶€∫Å∂ÓÖ®˛~Ω—âAï ãƒ§b·vÓYrñ¸ëä®5Ö•6 %£/á‹[9Ãú5Äm4T~ù‚π°Ÿî¥\<m$√jﬁß@ÇGâæÊ|tL>e#ËpOjÉúí_‚.€Û 	<Ÿj<±¡z√,¨Y≥wzUÍêT$°Â±” ("6ØûEïá5|í‚&·2¡1ö¨®˛¨§Üœ]>”	ˆ˛[≤Ÿ÷MÔ_RRû"/˚ÒÀìWYy|Nı∂L\¯T1ÿ®V—ÚÉrl;z–‚·%Ú
Öü˙Pd£#ÈTÒ
qôπsK◊PT≈fyµªõµJá“Åªl%ß T+;@Yå,E˘Õ∫ïﬂîikÈPúî<è^L+Eu:hßùÿ©4<Õ†r>Ï¨j7…¿,∏a◊∂ı∑Xôz)xn´…ôÄ'2Ó‰‡9ªo≤'/]Ä4B?¿!·ΩØTsàÔƒy"nFîï∫’£À£ˇ≈ﬁM÷ ”En¨’uQ¿≤8a:MÇ…å–
®7&£«ÃcüÉ»qÓﬂ9O4éZ<Â§ v£é.6ù@∫rE≠e¨ã‘y ›üó∞¸pt“∏"È4W’ÏARtˆT◊)∏àì;¬®¡:‘ :éU€Y7ÿ%gY||ª6˜/ÃÉtàhâN£πrÌZ‹¬ä∫rçT/¿=ºNÀcx–›föYpjùbÛúPCRzJ+ps‡-|"\	<¥¡)‰êAQß˘…ìZØﬂ”1}¬0¿•/æ˛j(Û´Å/µã∫ub≥Ò‡5Â°òCSûoï``Ä=ÅUÄ6«g+Y>πÍú Ç’‚—¨˝z¿d‹e√Ñ ùßÙø°-‡U«”†ÛˆÂO*…eB&˚rdßÕÉ¶•'·πYfïo8f&)˝Ga2±ÑUlO∫ÀqVvùeÒ≥É.`Ö≥Ø*¡9ãCØÔ‚(àºì»ˆ¿¡mõRÀcâécÓÍ˚T2æ˜¸!9—‹´Ÿÿ∑4±"Pª∞∑ıìØ:J9«7i‹zLT∆e}Q)Ôëí∏ÓOÀ€^wï°Ô6XÖDùúb˙àõYÖ§¶Õbâó≤√)ë|û¬?Ä §®x}êc5ï]Mëô£97I∂Yä)`Œxı¬ÖîÒ6tbõ˜ëŸoe·Ã%9¶¥åˆ!ÕrÚ
ÃÛ¬Œ`†Ωaﬁ‘ﬂ±5jPVà}∫√œ◊˘HIŸ…Èy/lº[XC´k+óñ§ÑFaacm©¯.⁄X]ú/xY^• o•MìùyÆ3uü≠4„∫Æx“*VŒîKi™ﬁ°3,B™{∆2\´L©U≠‘ú$fÉR´Rf≠DôTû¨n!YN˛îQÃ®ı#%cé(79N MUS'èˆÖ’Ö§ıYHÊ∫@Ö r\∫uæÌ–[rèiÓZTm«ñXB¥G”úiö@Ê°Ñt‰Y” (´Cì∑-E8ÔíJ^Çp·Ãı.õõ£”ñ–º}•^≠‘Ò¥ "4π`∫∑®Ìæìâ3VÂp4g…úˆñ3˜–Jíï¢áO ·Yπ-j¢1k^Ó4ÃL`Ê÷∑é‚]xí£≤ùæ	%¸Zf›íÈ?œF¡''ÕˆN_JÑËuv¯ÚƒÒºÃ˘>Ê.Ó˜t¸ûüD‚‡„ìÃﬂ"±òwÈK}®‡ø∞ìsÜÀ{ON2€˘˘®ÄmÚ>J<≥æŒπœ·‹úúìãƒ#ÉdR€ÊYΩ÷tÆ≥÷‘_ÔñJƒIp!"D∆÷‰glì\ΩÚs/∑ù: «B|[∑FT<∫£OuµrY† Ω·-MõØ∏R]”_lÎ†ÔÄ˙Ñé	lÓô»x	¶ñãçVÕV’ŸÅW…uäë8∑ªMK-ØG◊cuï‹sis[1;"èy¥∫›Ë4–¸ı®µ–zÃ¢èµúﬁ5’¥h'Nuf¡L›rùMêÈ°≥îw»•3‹™,4úÕt√dMÏÉ©8π∆A9µs}∞–T¨ì≤Ã™Øñ‡ÔÉtvåvõ„á†Xü-QÆk•AÈâ ”Î*µ-`ﬂ”nïŒ±πV(W:\4…∆S∏≤Ãﬂä€˘nΩ›ƒﬁ¶>≠&ÈÍ—âô©Èô…Ÿ””ßOœåŒLù93ù:Sé‚Õ7â!{éÃß®s‚ûL%lºü∏qã¡â_ûõZ¢jÁ‹êò•´-Í€Ä¸:â–)B"tJ∑kõ‘WV"Ê§á‰MnS›OÚ°ù]∫Œ¥Äaû9u+¢ŒCbLH{≥ÅÌŒÂ&"V6‚^
ë:Ñé ù”œ+ıf∑„ıë9ç—ı®⁄ç-˘ÇFøA2ÂÎ[¯Ç\,ˆ(ÙKsqˇªwÚÙ÷ ‹éFè∂Ò˙∑ÉPÃ∫Dºòcæ(Ù/E∆§ñL¬<ˇõ~øçrkÀ#â?/üœI'€r„{“`±ÔC*7HB's†UZ÷@£‘mœ5∫∫g†|yÏP-#4/\<Ì&êîöìÜ©¶rÇÔÔè*¥Oœeé<3?ê,Í…∏™˘ÆèxŒºaËÕÅ»∞˛…≥vW◊
ÎÖ‚/Êﬂû/ŒØ≠3:‘Ë˙IT·\®0s®ﬂCK>îTﬂ»«¶‚…%€`Œ∞Ë∫ßäÖ*ÿ ©Ùgpˆ@©ı`'`
M£π<í¶Ë:z€∫úrLLHÜŒõÌa4'O§MhF-R⁄∂Åï_•≥ÉgwDàx>ÏiœﬁU∏{|@:≤≥Â6∫æ«V:˛>x°√„0‰–€ˆBÊ/˝ÊÒ3íœ»`yù¶ÔdûñzC‘´nÔ∫Pîi÷®Dy•@¬2Õp«ü·^NÉÒ
3÷ë'A6…('˚4]aãZ£˝Î3œx/;~2óm¥uúÁ]∞i\#`πvØî¨$„§UÛﬁ˙Ù≥`öb3‡Â“	x™LÂ—;€Qß=ﬂl¢+]ˆ8™&x˜÷œ zÔÍÍÒ·£ˆM?≈íöûò—Ör∆xxS{⁄uBŸ35¨9Å‹ôª∑l˝<e”…–Íó®ph££f3≥“Ü(mè”ŸŸÒ	,¸Ï„j˛±ûNBt©U™hËè®ñÚ.ÎóI√}zÖ"]`•"TäÌ¨S˜ò‹Sı™êUñXŒóÀj6Ö?&wÔs"“±Õ<ÈUôß‡N£€™„q¯«-r9q4OC>–‡4ú…£U‹7ÍÊàŒ¿√±R	,%ä6’@–ò9·HSéM ŸˇÉ∑lá…‘ˇ˝Ä5ç$˚≠}Ïáæd˜¯¿n@™kv€€ç,L"§ëK†Âö¸ ‡˜ıË#[#â∏oÂUK‚“0'¢·Bîätﬂ`ök∂T6¸WXç.Büø+›ãe˚Ø÷M—ÀΩfI#0ƒ.Hs≥OQhÀƒÿ$b>#⁄?;ÙÄ;aæ#W~πıñ¥3»ád‹h¥2L@?PFœÜÚDIô§∏&}ó55“≠Ì]Ö(ôœò˛D>vÖœYË¡ö¥i€G:#√P:„è¢N•MÍ‰¨îëa‘)ù’´°4¥éêtmQM&≤Ã†^<ªæ]â´eï≤õ-.∑L®√8ÖeñAÉÁDñíË≠Z™}’±•´ñó∏ÙøähueΩË¬ìÆ6⁄N_€;úTCäŒöHQ"ÈxSYzÁH°J‹(7$Œ¥9 ì–úÈ¥Sä „Œ=g}ö‘•E]ôC*–£KjaH˚[n”*ØΩÃhX∞Q.¢Y ¢ˆäô^nâ≥≤h’ÌLæß¥9‰# X≠v€.`lúrhB∑Å‚éB9öîH0ΩdÅkJZíëGÁ.H®ÊG2*Ì£°|@˜jœ‰w/5Ä”ÑÄöNÀ›œ$-~¨, ∑yIj£–èà¨´€/IÒáí3”ï‰‰x;+ÏÁ2h«võXµ¨Œ"Å∂¥kÚXFËŒË¨ZYS™IßIiO≤JOLõæ˜…q€=ü≠ˆfÌ&S«b°ŸƒWóÄ7úú>ã[7ÎÜN—ZíIï’”ûGˆüQ	y™¶wŒ5';©ÌE“≤_sÕ5Qúh~∆‘œâ≥ÖŒèá
©≈d˝Lùèê ò˛íu¬Ω˚ˇF3ôŸUº˙∞´à{ÿºq’FqCYïuö˝àeeV]q©∏\bXıy≥√IÅ]‡L’]å⁄˚)M&Áà°Oì0¸Oú{i¿ÉñÓÛ`„B|^D˚iëë`_◊™∏§'◊∑¥õ¨â_Pñ∂Çb‰[ D}$§˝cµèµJ':π<üúÉÕ 5¸ö®9«d˛∆Á*Uº(ÃÌ¨ ›ìﬂ≠'V≈”™çÈÙœ94“a¯Ÿ|ÅÛ≈¬•ïµw—	tacÒR°4≠˝<πìjá˙ƒA´ÑÑò}+0 ?R∫oöËÈ“ ^@ˆÌqÎT‡a \^¿€j¥v≤‡_WïÎB¡ØÏÈ´-Áû¸ﬂFìÓ‚XoΩo¢≈¯z\m4IE:—‘ñ¢@x∫Ø©CŒé±;>R+jnWJ¯°Ì Vùáj>1öá“ﬁ1ãyd|Ãbe´“â™àQ‰‡› –yÂûœÖ0?ÖR‰/„#	tƒËJ/3ÿÆ|ªRéàƒk¯˚}√Õ'¡–Òπ¯“€-`BüÔ¥‰nÎ3í“≤Oí≈≠óGm,çm¸ì"¨ñ	6;?_> ËYˇ“±∞C‡bÎq©ã_má<P.Œè§M
&L˙vvåi9HÙï–¸&9=3O˛Ç;§.„]náà$‘ëûñÑ~ãv¯“.ÑqYßp4ÏÌ51…á/MµJ˝B∑åó◊ÏZô.ãÀBó%À‹|ÃÙ_¶Æ√o„\‘&ˇ*Ã7Ú	Ø¨íÓMa]=T·änˆ$\‚≤>ÑÀ‹U<;4ßÌêÉúD|ñÆ\B+´≈•ï+hΩ∞\X(Æ¨erL¢&D£<†EBp’gÚ#@~]±∫Ó≥-kXBRfwC;2®¸)>BsËùïµü°ãKkÎÓÕ }¸†©§¯ˆÜÚDÒÂπ°ç÷˚ø∏Viµ;0ìæöÄD‚$étgÊ¸èØu“àáhº˜ñE¨¨dF˙≤ìöjÛi^í˙
‡eà†£¯ÑMÿ±:ê_–[Å≠ÈöÄ#äF&9˘û5'üïLM-w≈›å’hî5.RY∂ef\◊ıEˆî?zÁÖ©;û$cPBç|ËÊ‡YFÿ¶ΩÃ±ÑGô ˘°≤—|Œ™≤ﬂüB |hDˆŸıKµè"üıIH›Éå]„©´R»π®	œæ^èÄ˛dZ‡oE}t˙g¬x*#ø˚»{*#Â∑¨Âã˝e+…«∆^Ÿd&!.W" ˘3˝˙p–™D>”mE(»êíD·.]√àüÆcÂ ¬4Ê‰£¨*ìshu~iÒeÆ'Õ®R~eW⁄¯†5D°–xõ∆akR≠qºäºÙUk¢ŒB‘*É˙R•´\J‡µA%F˙û™Ç}ÆhX∂ ó†˝;ÿUÖJ¯`÷ìå˝s‰÷Õ/•KV∆ÎπÙOÇk«¬—{K0úÛzΩJÉ˛Ëﬂ‰∏Cı cV“{©´Fpó˚vòÎ÷÷ñÿ:se•∏¥‡M˜h j√ø:ê Rí’–ïˆzw≥]jU6Aè	—Ê*ﬁ*Ë®Ò)m5Î⁄9⁄ aß…Êâ÷vÃl
;*ÔdÄF`eﬂèwï,∏âjÜ]≠ÎM‹új‹ˆÒñ•«Ó™#L∆2–"{¶˝ jì'≈	h˙L‡ΩÓìíÒ‘Hd7˛*	ˇêø»”¯{x
fR{©eΩ&b]tR,a≥K3«úá≤“»p¿˛]3ƒ;˘â k?ë¸Bœ%ûÑaM¯±¬N€ﬂK¥ê(Gü¶¶˘ÏfﬂKw‘W*‚Í	/tA57l„QI;Ùˆ;|i_…Z˜È£v[¥◊*L/∑]l<øñCËC≠±>ñ’K5Áﬁπ(ß-’∫ieºW“D XEÉ´ü±5r±ê,ëG∂ïH”-˜Fï(7:|è>œ{4∫ˇô†¯§#ñ’ΩJöµ‚»ŸDo¿£’∏—>∑;ÂN≤ΩG√¨Ÿ0] Ö=!ªLMz[ëao	n≠∑OJÃ÷mÖD„âaáròò1ˇ$<íÄ¬í˙√=Uwjc(´\2;î'ªˆú[˘
«n2bºÊã≈˘Ö∑.Æπ;FKøQÓq§¥@¬Ï)%S@3«êço≈‚D≈ï™\çîâ Ø)_ﬂã{ˇìÃ}∆Î√‹ªÌ⁄¡ƒSô˜ÛùNT⁄&¯àJ…1ı!gW	˙=M≠ ’à∞.&U,Ùk±Ì%Ÿî[ïÎq~´—ÿ™∆î˙ì§JéΩæ´_±wïPa
†,Ö{ ´‹¸¢›åK≤zX;ﬂ,_Cí¡Ò^·Gî`ë`+ûóHA™‚oHQ‡≠ÙÂ•"∫∞Q,
ÕÓ ÿì◊Àú6:c∞[„8[<S∫ö%)¥\äΩñx!3Æ¨5©≠_¶¬”“ÿ“•Z"ØÊøqj@èW?}‡‰^≥˚ ûñ–<_G¡•¨w÷23ìJ˛oDÈ±ÊÅ‰g˘`we∏)ﬁIô£öB>mô”›XØÖÔ™Ÿ˛D!ƒß¡®}ÁÃ9}ãc!€±ëîΩe©r‡	¶Z…»|`Ê9æ·iœ≈¬¨HWÁﬂ•V◊•˘b·ù˘w—z±∞ÍLév»Úªﬁâõ«ôœAôœxí“ÃgôÚ|∞YÕ˙¯'4˜õ–‹{n≤Zú¨ì•:Y?yÀPLŒ›5G?o9[ÙH‰J8¥Ë•*ß≠q¬!ÏC«@N\æeP]t÷˚˘÷(5ı9<¶ÍXº˙»Ö∆Kèt]ò_/,"l≠Sjçïãk®¯Ó™KÔ”Ä:4åà%$§áÉLeüÑÉ‘È≠¬#∏‹‰h√%¨4Î5•ÖÖÈR(ü˝2˚å~ab¥œ$ı> ñtÚ=LÁ‚÷.ˆ\L°ÏÉÉ8H	ˆ ™%éFz ue 	Â‹”ﬁS¸àf‰(eáLz*Rµ≈◊RA•´ºöH≈ÔŒ“^#‚πi(ƒx.ÿáNF=í¡®ı£3Á“\°!u3≤nÍ/5ê~‡,5jüÆ≈BP3*ïE†:KY]v≈+§ÕR( ¥π·úñBrq@§Õ≥ÑùbªÂV+≈∏>b√Ì´¨‰9˚	ÈÑÚòÅ©%ÜƒîVh/xæªjπqz±ıçÀóÁ◊ﬁM≠ºÈ/ùv&¨n∞{ÖÉ&¯]sôg¶x‘ØÉº®åÁ±ÃCvùV∑^äú0	?-Ê§H†J≤¨dóLd≈q“Ï°Ã<îıÌG«ÿ%eçÊ’®->d™’ıÜ5tjµ∫˝ÔîdN4äËôÄ\:⁄~◊÷ÂBÒ≠ï≈ı‡b∑ì∂É<p¢®z^ØVô1≠»æ≠M+ÂÏ+KßÿûÏ&YD±]q*Q1Ù±5&M[É˛bÍv:ÉJ˜Xvw%Ω´ﬁìÙêiK%/ñ¶‹Êœ¢ˆ6∫Ñ;˝F¥ì‘√´åPrË¸¯ƒÈâ…—©ÈôSßg≥‘ËêFãDUç!·ùÉ¬3áE\2ËÅ·˜’áÜ¥Á>›?‹Cπ+—VTFãïV\Í‹®ÃfH{Ã/B≠·Ã e’Îi∞rÇ$òº+-êÀä_˘„áÜS∏Ÿ›¨V⁄€<rx•qŒ.qÑñwˇ MV⁄~0±.’Z	·∑5‚[=Ú›∫•! L/˝=0£3|7† ±¬•ätNŒQë{æX–ÒÍW÷¸È∂ëWzÑ6í0awn§àCÿ’‘\˚∆√9h˝Mfäk…Ær*$G'5‡¯ÈToûú%AÃœAÚO2wfÄÌ0ÃT|¬¨q<®D?”˝‰pf)…Ëπ\ï¿¬„¬ZkExlµ∞H"´:Ø¥Sçe–
]Àè√©D“f©N(†jYY”ÏMEE˙pí‚Ùç~kÕcö!5l@;ú9wv»Òû¶gã1â&J§%ƒN{ﬂ+=‘àõEÿÆ¬¬å∞£‚Ôd∞±∂åÑº+í‰ä4BpÂ )u∑='†á?à|πÃfs˜ﬂ0u~>P^œXÊÛ˘aÊ«ó:9I5¯àe^∏1ßêøØ:áqp6÷EiÊÍX;¯ÌŸ£å˙…Ω út∫!eŸ“è9	v◊£Î1ÈO⁄ô{Nç©0ˆ;õ£Ò‰ö˙:\/\&µM Ÿùo
£À=¸öëd’Ir]Èq¡†ã”fZ°p¬ß¨∞ √-ˇòTø$´kœïÁEÆYá#ÛŸô`}âXET˝∞êºfcÄ˝Zòõ¬	kH·øtÚΩ∂—	IÔi tC≥´u(”UÌk¶Õ7õmΩ„Ã#Ÿn∑Ñ;hæ€i‘hVæõ~ ”Õ,.W„ÄÔf0£)î.q‘ïI_*=b,¬˚GlŒÓÁ¶,Ì'……«ÈMå¨UÍÁv±Y7ÓMç$äqæÜµ¿	©EvMé’Â6u„±rdü–-$º‘9£‘ÃKÕdàz≤|=¢Ã2|ß]2•qJ~/$«≥{_Ê úûÑCªÚ+v˙¿L‘’•¥í‹‹n¶V©Ÿ†ªs‘Ç3‘ ÆŸù…≤ìp^ö‚˜ìo≠H*®¡©ÍKÇoY”q†“dÔ5&ü$î'‹≥¡>O†=2ı$◊Êó÷"∫ky˝[Q•çÁ√∏˚˛ÉS©é®Ô_-∏ˆRúˇÆäoÉ)Öà[Pl·ÖKÎFÛïˆˆõªêG¥¶Ÿ=x{nÕ0ﬂÌ?ü?≠|¡X!~Áxù§&GZÁÅÄ{“zOP‘|¿Ä}Iƒî·À8î˜ì˚ˇ.Ç∂?H «'›∞¿ö•UèÉ˝HØ∆ûŸKx –L®VOaö…ä◊£¬∆∏MVD´&èµLæ‡≥âÏ≥‰Â˛wª9€‚»G‘A`–„#˘NcπAPVÎ≤±…o÷G/,;¶éRw¥ˆ·¥ªg'TØ—!ÿ˝‰Ÿ±S◊S⁄`°ü¢∑s™›âõÁvÅ˘ñøﬂ`7ÜùWÅ¨>•FΩ›!∑EÁê€ùÂÊ÷¡™˙äﬁà>=‡‰5“®‹U<PØÔ‚+@°e(Ú◊w…mqgM‡Òà¯UÁìù@Gÿâ—ÆYGXÖ˙VY±√äÅ90ÔDoB≥ (5˘çV‘tÂpºá'˛¯I2	øƒQK˛Cæ˝sæ5sQπ¸6J∑‹2©Ì4:Tn˝sçI!vKóú¥‚N∑U»†˚gã?ﬁ9∑ÀûÓ©¿òÜ°d«º£› Ún¡≥è^ó>ˇX/˜8…†·2!º“—Ñô<©£4˝ª$«Ú#¶3ﬁ¿Œw"&{F∂zê?%+5Îıò||D’.‹´uõørwd¯∆‡ÿ)yPN…–Çó‰íÑú!~… œ¬}ëM‹“v‘G¿[πXX.åöcaÂ ≈•µÀÛˆoy.Àq5>,á;-±Y¶Û?Q˘f/ì‚µº1:1I®Ö&Mj°V£kãò8êﬁ}µõ£Q∑”∞˜È≈V‘ﬁ6RaN·ßür*Ÿ¢Ã«
∫˙˙Ÿ‚Ü"yeF¸óúﬁC'ÃÊŒ/∆‚qˇMk∆Ÿ^æz¯ÜÙôïÔPt‡¯
 ˜Òc™P~œﬁÂ[ûwAâ;¨jfÿ†¸ì)b¡€ebÂÂ[T˚)ƒ¡∂äßqî•{"å≈|≤?ü!◊Ö˛:ôy˝ıkïVçvtÃp¡)Ï †ÂjJBJ=uàÎΩcMuÈ:xù´¸
ËÚÉìê	 ø”èˆú`¥0ø˛÷ F≠˛˚FØ‹´+´£Nﬁ∆w*ùÌr+∫!πc3Ø‹Ût ÚNÚ9{_≤˝ãÙ¨.TfŒê∫RSáu≤Zã¢\¢gÃ(£°…HœøG§	iY¡¡Cg8íºMs3¿ùﬁO$QO;ü4¨tYáM)”¶ı{rÊ$7|'™brÿ1C”ê‡F√_Ó˛Ê;9˝=È}"J™´à¡W‹û£{tùßYº˜ìÂ€¨+pWf˚&My¶DÔæat=`sQàZ™§ôÇhLêú+ßOcs’X6Oµ»Õéé™QΩ£ıN‘È∂%ÿLõ¸(ß Mò{±tùF¥™:E≥G∑ÄL÷Ìå¨ÑD[∆âvÅfÕK˚T∞m}À6√Úºß
√…≥lq0˙Ú0ãˆäÆGïj¥Yç˘ (Ãe˜∞aMQo§W6µ+§Nß‹ûIµxƒ†fΩ/:è∆—õ$	0H±=‘3Æ˛h)Ça4G.GwÛΩ<˛?˛ﬂ0‡Ut≤&ÿœ„VCŒ2lñŸÏ∑∏A≠<{éæa±ûôπÔ‚˛$?Mç”Ì∫∆Sëlÿ•ç Âπ∑ÔÇÄi≈ç@•§Á<m¬|5nu\¥ÓÓ≠<(“æuw⁄&<≤COÚÌ`U!˜›?J∫7ºˇ‘ß2ê‡¯Ø ”=≠ 4dLLaïﬂú!}7OÁáJ´ÆÊì§∫Á'`yàÙ%Cı'À—˝^!W∏÷Eå™”l•√∏@í ì5âºì UÙ uIRD˙Cq˝ÈÂ|®(ö/RÈ∑jG&e>Ä|LPCm†¡≤òDë Û(aëÎ/ﬁ~Ï#(FIo«ìΩ˚q<b”ºã÷ª•R‹n;42©⁄¬$VTåu{∫Œ6"yp®Ì†Ù∂+d(éXw√îDá≠ºï$Í‹1uê—˝†V }ÌÙ≥°‡∞—'dëÖ∏· u/ªA§…˛¿Æ|3ªÄ™ﬂ˝˝—˚XÕ=¿ø˛≠¸˜ô»ÿÂKû†7≈öP6¸r‹Ÿnîq√7öÕ∏µÄwµ9‹‹\Úb•EÓååbeäƒo≥F0ÏÁ^(ì˛Û+}w8jˆê‘®a#Éd`⁄ßEÖ{®∫ï!Ê ÷∑Ñï⁄IíQ´:tËE”T†0,”£"B¿y¯ÔVdn¨ƒs˘L2Ø´aúŒ8G‘üÛ?≈˘‚‹Ì›}œyˇÄ*eº+¢ì√'QﬂöoíJ¸~F£ENT(2gc¬π9.=mÙ Ãa¥w“ˇdJ£®>ô,⁄œî<í‚© Ò\~(Ë…¢˙˚˙+'îî≠≥[–~Gyº¯&ûMæ≥;üÀ\πU"nàU»äC®j˘J¬Ö!±\JÌMcÁ»CP‘FQ}@ÍêO"è§Fª6Ë¬¬ÇÍJµtÄZÓÏ£/0¥¥i≤Á
R}ÎÍÎ∏˜Ë®Ó!é§ˇë ˜™˜DTÄ˜Ï∏ÓÊ:ùÓ#∞wÍgdÖEπñ'Ú]ËSaµÏXh}<àú¸^ïØoJï>¶ªøGjU“˚b∑Gv¡Uoﬂ5HMs«yÆ+;˘˝¬ûj´ï=«'Nﬂ‰ü–≤úG;‰‹U¶Ω#÷Ï‚√≠Æ˘RDÛ*p_+%Qi%'Í‹0$˜±)π∂?`—Ù1Gò¬ôë‚Ì∫l,Üà>S¯¿ÔÛTÓêŸˇÓ≈˛CÊï}	´"ÃÂÚ5hÜ‹On¨(tK…˘÷ùÚ‰ÌPp´®Ù4s∏)7!Í4Iÿr¯Õı∂Ä˛	oÄ|]Ör!6,ø˘’[±€,ECî'∆¶“n.Zönµmù#Ìd»DdôX˘Õ◊:IJèÆÈ@§~Â Ω∆Ø˝ów9Kí4F<9	âX‰Ü{õ|˛ïAùõÃÎ¡~‹ˇÒ⁄∞'ÒÅ•uÄi	ûNp∆‡Nú=rô'§wœU€èﬂw¯ïehkÊ∑gÃÊ‰.ﬂ≥pÄÈZí·ÅoX!¸∞ªØ¡ÈΩˆ3ó‘¯∆ﬁ≈†´ÕhgÙı›ÀQg;≠⁄h¥r√˜SD‡ô[n‘∞‡ˇù¡¢∏wzøg„F±RãÒ]Ò›—"V	90oÂ\ußŸK˝≤∑;≈8*m«≠’h/{9xê;Ïº%º¡∆⁄•EÍ€∑„÷õd3âg“p∑›ùÜ6ÊÚÚ+tOÆ›ÄlsË-./¢uÙ≥ËW¥ﬁÿé∂“oV®aπ0ÓìcÙvmrìlv‚z•ÉwÜ5œ˝X.’ó~¯º&´\Àv¶s∆N’s{f‚3Uï\∆-¯∫z£É;Î*çW›5ÓxùQÀ›ø+MQÿ1ú{›ﬂÓç@˚‚=Xr˙7Ok¨≤tÑTŸ!^:^π!‡ì$.œì∂±iü›¶»õ94Ã;r	ÏÅ∫F1æy 
.%¿œü7¥cÆŸäØìîjñZt37~—c£ºwG|∑cÉπﬁ›,Fõπ·ÌJª”hÌ@ãê˘¶Y;ìêµ„ )ÆÚÜÓú7öQ©“Ÿ!%8ºÊ‚/"ò¡PÚE_n”˘˙Pâb?N˜g¨ÆÓ*Â˛ûZ †peqÈ %	÷ù_]]^Z ≤k*m¬ú≈E\ÎF∂V8∆cx]^<P±VÄò∂zùf¡s˜∆K[©R’UŒKzv	£Ù[¿∫˛~¡ª±*<¯fsh◊1IPÅP±'>fUÖ•c¯öOd‡ãC`∞n‰1Ω.•rÎÂ¡‘–“^ÂæÔ≈Sz0ÒSòﬁ§˜ÿ)9}Yq”ó5}1”Äà©?^ö-âï∫AÖ

ñæ¨Pil∂6$V⁄g§Ù „§Pîäëz#§^≤	'í˛0xõ{S®Éèâ∫ñà¬”Ã“Ö®öı+C‚°ΩGCèv,4U—!"ªD≠ö}∫xˇ√Oªô &yp∞”!{·îaÜËew,ÿ˘JÖ:°¸„¡Ñ9¬ºõ®√ÛëXÏ3ñ–o‘2+ß`Ò ¡fd⁄XπP%àe=˛†‡ûıëö¡IK7ﬁ‘û¢ì˝≈&-µ›G<“%¸ƒ¥ª ïk◊H(ãΩÓ®Àã»ŸÓ‡n£˜»µ<Í1K*‡˚wD
“ßŸ√ñ˛·pˆExÅt4LÇÈ
i7xê|>OŒÄÇ+aÒ!#:dÌê¿ªÎ·!€êu_∏áHÉ™U(Tñ¶~›˝(gtòhöæEï}Á!]Døë;2ÂK…dÜ Û<ùpÙï˜∏õg‘ÚΩ0zÔCΩÿw:E4+ÁıQ#=ƒ˚∏º2_$°!Rq}Â ÿ˙∆¬Ba}WÊ◊ãƒ´Ãñöﬂ1·b%≠˜Y•◊Ô%ªªLÈº-∑«¨}-/∞}üvÛ]z◊á"∆∆Ù‚˝£qÚ“ÌïNiõG_/∑∑B"Xõ<¬µ—S®_√÷Ìÿ$•2IM†õÙ nâ∞TªZ)«M-.≈ÉHÔùôπ~„ü	}ú((·XÅÅ$)•ﬂh/√∆†¥3âÄìIrJõãJ4ãˇI'Êÿôq;©œSQAœﬁ£Œ¶	ˆz[ªÖ'ÕêR ô€QBˆo≥ã’´M
gmRZ›zâd)Q"ﬂâ°Û÷‡Ôπ¨~∑È3 m≥|›xPnÿﬁs(-≠U)olwú¥∑EÁi∞)èß„Õ∂ŸrJÒFˆ∂@ˆò~æ©„˛ÎŒmC¡Ÿ∫ÂÎ∏â<Z(\)ÆÕ/£ç+Kó
ãË Jˇ¡#‡'–e¨ÚÊ/–[x<<'4ôLûˇL<M—bÃò&+Ú°Ë≥J{+º¥^it*◊*%Z2;Ω÷{„„UZÍÀÉ“Ü3Ö≤\Ó”æ›üëï%<A˛i´π›6VÛ„◊∑yRÌSjT-hE ˜Ssìå*TÁ0˘æfB˘æ ∏¿Ö∏z``Å∞~ ∞˝áQ_à≥˝j- ‡‚1`…•¸Íıñﬁ Yœ±∆`™§πLÓtb…å3K$hƒ*Jg“ô¯4≈kú'ÌŒlÏí˚©©ÕœX)\IÈ¨‹â‰ì%)/ ˝ëµ0x"}r!z∂√º%ÉÛíÑÈc	^ìÙ—ú¢Â6	K˝∆⁄ÂƒCÿ≥I	'FÒÙ(©µˇ±;1*#Ó§7ùtêæ◊õ˘™∂Í∂◊∞XÂ›ßD° ó”’Õ˝Í vu±∑ÓYMÏ§8EgZ´πbO&î¢u07Uæò,=í<»œÎÈ}eyñZèŒ˝â©l”6∑¿t/æËc%^©ìHl=£‡⁄¬ßÃ∑ßæ§‚ÖIg\?‡ÿ`:ÜÖ dV*y1T∆ *fvf‹.sñ≤—	îà@(W/ÓÀÆªX©íYSå6Iâ˚ı8jï∂—Ö(›“F&±ô˙4œà≤ëñ*c BÌR´Q≠nF-l∫ãX9qTUU´√'˘“DÜd“≈ÎªuUOÊ´x–ŸﬁπzUJç˙¢võ¬ƒE¿∂Ú¥ø‹˝Õ™\__J?*YÂæ´·s·•‹aVCÆ—±…’…å®Áâ≥`´—⁄°Hõ·6nS‹¶±Ûßù6Ó··«ã¥*Òµ1Ï|oCºÿçñˆ6ˇ~^≥uN¥L/¡ü‰hÈ•VTÓ“;,DMokõ‘”ot˛w ÏÀŒ‘tˆXW”9´Ø≠ü8Ú¨mÇÿ3Úå‚Œ≈ ÚÃ÷°™e=«n‡áïi†2∑A–˘ˇ   ˇˇ #Æú7xúÏ=În‹∆πˇ˚ü¬Z5ﬁ]]}Q-ñ%':∞l◊íìAÄrw)-cÓrCr-©™Å$I‰¥Í:9H}Íq$ùÿïpd†p_E»‰Œ˜ÕÖí3Cr%;v‚E"Ôí3√ô·wøçΩV◊≤Ïu√j√s[$Ù≠n‡Ñé◊%´m'¥Éû’¥´]o’∑z§Ÿ˜œØˆ<ß⁄>ix~˛˘Â∆/àÚ”¥ª0ú{ﬁùÂ≥éã]¶ßßIh5jNK”áêW»Pc•˙÷åŒŒúòúxõÑ6ÃëŒÖ?P∫«ÊÌZÕ+$h[-o3§yäé∏VhWGGFHÀÚØLEWé√˙,ˆÛ®h ]ák|tüzñK$mÔ™ÌOÒqK⁄[qÔÿ»àzé◊~wMq˝î≤ÌÓ¢k5lW’ÁdΩ—CØõÌ;<ún≤ﬁrÆû˙EÍÍF˝Wd—∂¸fõÃX>˘U=”zë¶k¡y´cOÚmXús’>î}ÊI>ê‘zµ:A⁄ø’<∑Ø÷µó√Í8	Ω^u¥>Fÿ˛“ÌZß§∑012rà‘èq∫Ω~®ÿçpΩèƒ)Ó^µ‹æ=Ω!+õØjcΩÓô∂’]Åˆ{òLü"Åû…Ù¨ÿµ–ÚWÏ∞Fœl9~z µvPŒˆßÌmnÔm}∫∑ykoÛﬂ{õwËﬂ{[Ôm>Ñ[doÛÛΩ≠˜˜6·øõÙÀv≠VS≠%±√À}◊Ö«TOêû[›[Øé¸üò¿M‡:µîØ"∂¯^ø€≤[’5óΩ $“k:ë@ Ü¿À^≥Ly˝–u∫HU∫‚R≥≥ãÀºp∑äKâk»Ù’8MãíµsNf‡9ÕÀÆΩV%àºÀ.êïı™’=¬®!ldm7uîtΩj–Ù=◊m ítúnµ]}kÏËHoÌÌlT*b≤‘≤^OÃ0 gmªE*skM∑ Joô¥ﬂnÜ§Ÿ∂B“±É¿Z±É·ÃHMËíeË>⁄ùÄL√•Åk´W°W‘@s—µﬂÌœ_'¯
÷wË◊äûÆM˚ùCíùáæˇÚ+Ä€]
 ª{[D‡FÄﬁ!I`hm∆j≠ÿgµ‡ê®Néå‘G'S4!	µÿd|D96¨æBWºh(∞]◊ˆáÜïªA+˙·÷üˇìøª∑˘xoÎ˛›ºø?ÑË˙æä.]'¯W˚ÄÆÒÏ|WNà(ójwl†*≠ƒb•kbπr3ÕÇØ€Ï‰∫;@¥º¢Î˛.há.hõø hù7ËÖtÖªt+Ä>ÌîXgh[nbë‚BƒjEÉÀÎYÎ@eäæ÷FÎ∏G◊D˜£ΩÕO`ù|ëâwºMﬂÁ%ñgu∞y}—±¿∏ânÖäkæˆ˝Æf}Nkä£Ø”:¢lÅ<‰!ô<+`@›EPÇ)¸fnB7w*⁄fs„xÀ¶í;®Óÿ¿t|$”bçÒJ§..Õù'ÛKdë+”(ßØZ¿®ì„∞kt§vˆÇ©z›È π≠ıA‚ÉyµkMØSÔµΩ–´éN89z|l¸¯D’:>no¥&è-7ÏWêaL/{~«
/;·4∞âﬁ·’È—…ë√ÔN—Ã+tB7Z˝°iê$öq~†∞#ç◊—¥Úm+¸Æã
5KV#P\P∑˜|g≈ÈZ.oÆÇÏ,∏_˛uZ•,íkçuœÀ4@Ü±L[ ÎúéY`v|J'‘ö…≈«@C6T√◊ÿ≈
7‰©¯oÃ2eÉ •∫ÀÄtX±Y”L◊HƒúÆs†	1≤{¿(hπbF9Ä¬ıéﬂÙm=X„ZË;ù ∞zL:zÊØÍËùÛVmˇåÿ≈\ìÀÁ_”´Ws‹J
íœ®9][vPyw°À–àÖ±ØækL[ı(z~YãûtåI´!
∑õÙªHÑ¸€6%a({=ªÎtWËµé◊≤\Ñ÷:mÂıHÖÈ.Àæ˜{õ/\õí5Ëëù°Ù.ﬁ]J¸|ª¿|*ÎihÑu÷VpôMsöŒÃn±ü&Ê[¡%ÑÁæèÇZ€
*b%\∞Òe«kË∆C¿ñf˜‡P<∏N"‚‚Ñ‘Ô˙Õ-)êtÌU2¯Û£Ô sd∏Ü\~ÅTç[X 9Æ2B#◊ÓÆÑmJ.F‘+‰≥´(ü÷˛@UÂ&DtÄ*°¯ç+ÃÍ1Vqà6˛j2’«ã†P•A5î‚a &ÚN? pX?;kT1’Œ
Ê5¸'9±£0Ø£J
Ôí’¨•õ=y0ÖﬁèÊôS{õüÌm~ú´ôŒÙ”Ñˆ6oÉB¡Ù)&[ﬂF[l≥7®ñà∫"…µèl”Ô}s˚dΩßû∫vU≈h†‰Pï¶tõ“	\!D(gr≈^üﬁ†‘’i©0âöô\ßyezCg2`ƒÅóË@&‘∆O M∂1\Çˆ>%aª†º™æ≈∆Ôz’Ò⁄d˜ckÆ0,I÷e
⁄‘Ã“ÙÄêw¶Ëwﬂ[Â§›Ò∫¸v∏jô_±‡Yiª¥÷ ÔUQÎs}4∆RÈ‚d∆]?:"L–Aá¯¿tÄz“‚&cª/~R∂È˙1ÖyÆ>1R–4á≥ÒÄd9·zæ2#¥∏0ö§3ì
C˜ƒAò®U6µƒÀe/≠f´UFÎ™£ÖÈ´∞7√Æ√6_©éòh†”Y—ﬁ]–or|î5@5ò≥èÂÜâ8%S˚$_Aæê0üzçwÏ&0|OJ#Ï∏ÚMR´}™ñº≤# ºö'≤œI`|›‰Ù«aˆ„¶˚d"ì~ïÛIî¿v(∞aå˝√Ã¡tEÙwl2∂∫†m√˜^îì∫HSrÓh∑m”øj¶<ëa ËäW‘¬–Îî^îy:¿Q;f¢ª)|h$$=&1ì”YDÕ1ÜíË˘3åï›ÁçﬂQJÚ÷(ö¡e]o∆ŸjD⁄ˇN+v#&tøÿ4«Ùx ÁD«s:ßXºØ8a”ê≈ÒCe%üdå0«»î§qÀ	πcfÄˇpoÛ€ΩÕø3ÅÀºê‹m…C∏BõÅNf˝^§˘öF6÷¨¸=πâ÷‹É€#òiˆb4π˘´Rhàû&ßœ?„z wY⁄ç‘àlp}ÎÙä7 ìÂ:ngË®˝ïEw≈Lµ‡~{"K+¢ä*øL‚ﬂêŸ©8Ñ≤Sæ„~(áålƒf˝ÚO÷€Ü•˜î+£æN∏—AíÍ2ãD≈ó5ªeZÎ1≈B 3“Î’…o≈÷}LÀ’ËRF—Ëç=›§
¿çP¶»ôu@™Ô6CqçB$›‚æÓC ¥“&UÚ>W≥1	¸˘)Ó&DçÓ*]cïπyÖñ≤ÈÖ–n¡ø±G
/àÔ’¢Bπ_qSFkdH^Ù©†é∆wÕ&0f@ßè~
/´Nÿˆ˙!,÷–0∆åb∫}ÅùaQ!⁄˜Õ%X#Ω`+ß∂Q;≈è]@
ºËÉÓ±BOµiT|P°ep	3ˆhÍ‹–∫Úƒ5‹YÍ$_`=
©∏¯·vÌ¸·K+–ttÌ=ç"çüÑ2Ωd-R¿,c∂°äΩàïÎîBúkF¢¸∆∑ö®RMMÀEçSØI„ßÄ6çüW$Õ6ó±W3‘Wy’JZJ]◊ÜVâè9Ï”úïqE5Ô„Ü®µgˆ°úgZæÕ« ß<¡£ïå⁄ƒæ§óIæË€‘R∆˝Ó€:¨50≠3mªyÂå„7]{,%-Pm	˛ı*Áú⁄Hp1yÈ¸ø£l+A·ÆôEâ8ÜÕ@6«(ŸL0†úØ;ˆ™D9/Ùl‡)å∆˜©¶MZvh9ÓÇ˘\LÙ⁄á¯nÅ◊—°gÈ[dVX˝êÖËÏ!$≥’≈m¬¢∏t¬ü∞A©í‡™  ÖIØûzGë≠iÚ¨á∏àò|",∑ô•∆wºÑ¯r?∫¥+ÏÔè#€<Iã[Â	À‹∫=8=I=æ(©Pﬂ’à™ö√X∫6\IÈD∫H√≥ûáØ3Úõ> =Yt:}óE÷…%e¢NØ%;…k∂€≥≥¡µwF∆F¢g¡‡L=‡	€π⁄w£∑ß⁄\E¸á[˘·‡≈AU¯Ñx\‡n"ƒˇﬁß∑‰;Ä‡€ﬂhèõÙﬁ6ã=º!¡g¶ó£)≈7S˙˛4Àë¬ú,V‘TîáÒ( mÍ,{ü-K∏ª∑∑˘/yœÿFlﬂΩ-êöá≤=˛f∫√h¬ë83°¨{áÖOb{ãÚs:¸πÀdîè®Öe;äÜ‹Â=Ω<`›¶´π«#)∑ﬁ#‘_xÉΩﬂÏÇYl!<‹!‚©˜i8Ù«bKn	b´Á@∂›˚L ÿ_ÒÔ7∑uX,2ŒÈ.{öq úÓ…èT“≈¬~(9HH;|K%F^S˘*≥ÏÕÑ£i∂ÜÀGÖ§\$P‹≥∏˝2+äw;_Ô—◊Û¶XÑÕ†©ä∂gÈoäò'~G˛\§—”ıë7S·'kdvnv˛ÃÈ•πY≤0∑∏8w˛’πK@˜Áœœ\xì,\ò=}éTrQx'¬&â®I°≈_ >u¶'¿∑ª√©˘<ëu:¡|∑·≠-†‡år59|X≤	g⁄∏ú.»m’Ú{¥èºù/°[M.’	íe‰¨H« qı}4—≤’≤ÁªàôE3¡Ö“Sk$¸5≤
X2"'ÂÅó:÷Zuï∫¬Öê8ﬂ{’I∂–£B £-"◊&˜ÂLƒâmß’Ç]«·⁄’∑Nå\møùt•ßXoFBy‰2Gæ¯¿7¢Qtüz|´Z·¢òK
dGE‚OZ^Jx¯h¯A {_–À2Æ∂Ÿù\@›1!⁄¢`´k5BÊIùLZl4∂ƒìÌÒÒoX†´ê—Óä¨ØòAWkØ¸·÷üÔÊ"e©\Óäqw5≤|{\ì◊íuŸ(ÆîÜUæƒdDúÿ)2í§[©á§]Ÿ_•ÀM‘∏˝~ÊHì3∏nJ¨„QLÚŒﬂ‘™LzÖJÈˇ—kQyaÂúuE‰LAÈå*\Ä†Òmp
›í	ßÿ‚&πÓ
Öc7ô{©°wË#ôúÛÅrﬂ>Âf™˝&ÉΩÒ*œlU(¸,ßû?g5€P’∂%j˙Qjî&öîqFòf$#KN0e 8<¶7ì|∑[l—QÂJÁ‹πôGµ€ë±Ü*¨TEJC›€Ñïh\¿ú‚õ3NÜ|rôc˘∫®i`xË.%ı_–>`!ûÚ"πÚÜööéRÏ√˘ ∑Œßﬁ ≤ÂjyR)®b Ã™∂tás"XÑ7ãã6j≥[âÃ\f#„uë∞ë'úÊ«˛ir¡Mô‡©Ñl#‹É9vxVhqSVV4ºMÂ.ëî~P)ÈŸ‹q)ﬂVåz|È‚±±}LPï'ò<û]≈æ™ÂA=!…
≈ûÂ—â(¥ê≈≤—û(—_7Aê,Ñ“ﬂﬂºQy∫9_/ñMoJ£ÁôˆòM_"e>ïÓóîEÚs˛~Ã\/}¢W±l+m™W^ûó¢S…4-±¡?ëL≠Ö`Â Û¥‘£Ω»“zë•U$K+kRz*YZ≈íØ≤Í∂ºŒ™`êÿë√‘èßúÉ’	VL¡ÇûíÅÖ„I¿Rhƒt?£,±U⁄}zëı3ÕøB»§ «‰¯ƒ‰ÿÒc£«éMV'«Oúò∞éûhYv#∑ GnÇW<•Á.øK‡ŸãÙÆÈ]O&Ω+ì≤!Å‹”…ÿ 8/é°˘…<˘πK€∑ròn?YüL\H°}‘N„cT.ÚíÁ≤G õ¿ã4R∞"Yn©ƒ3ú‰∆]ë•›_E˜ËE [zC~R)oà O>„m∞¥0=’πßËˆv«¡->®1∫??^äÿXìÔπ4GÏgù&ØôÔƒÛúµ0ê2¸Hò ’~ÒÛ"_*~·?·|)ôº?Õt©≠¸˘RbÓÁ•\°›bÑÌ”Ú≤≠≤=¯èD[Å™ƒa¸)îuÖè9”∂¬7únÀ[’$»;G®'u)uD{∫'*$rœ¥ÇRlQÖ5m ÎÌtÅx[ÓÇ»Q“ä±õ*Ñ^∫ª?ÊÛÕ"ª√¬tAõ◊ﬁÅyc‚≥üº±àXêsVø€lˇ|Úƒ®Fœ¢Å£dôË‚¯‚ú„ë7KŒJ√k:09ô3F«MØÓißçï·QÂxìÇ'!ÂY≈4ü-ŸQA6îJêz$boC~{Dﬂ Û&¶ŒNÖ÷2ôuÕÙ◊‰ê6hb¯Ç’Ö5Î2∫“´êÉb§ÏÒ±———£'™#÷h´ullÏ¯ÚXk¿
·Yæ7DsÓv≈÷±˝¿=c…xQ∏ÚVõˇà2G/éπ˛££4;Üx7xLõqŒ9âHÓ˚+{dîú˜êâ›Ô–‰?L∫Sªµ‘ ñı	?πn	 L≥ƒO8ÒbGBPˇ˘Á"Ãı9œo;^#Á/,Õü≈∑˘Á1`ÛÚÃŒùY"≥sKßÁœÕÕí3Œ/Õù_"ØœœΩ'ºi“–s– ~ÚTÚ⁄Æf 
îÕl€Wf€‰sûŸÊÆÏ3±çá âmy©lî#>ﬂ	m™H%ç∑úz…≥`˙îO≠PiA‘YÆùôŒ3óÙôè¢œ|4≤2∏”\Rv¢˜ìôÅ*†]ÌtU'&Íÿ1ﬁtäg◊Å™bΩ•M≥+ø°∫‚tE›¡ùêzßÚº¬VÓS±¿lÒO
—¸dlòÃN¬g≤ 	^ï<∂J„a0(úFW·‡N±Xò—Ôîuå)∂»‡'”/Zó˝Z"ˇÌ 4+u›†.∞/s"ƒæ“x"eGKø{Z0oß®¿…œÄ‰≥Íd	≠Ad∆[ÀeµÊºëc¿9ÅÒ+Ç{‚(E>xi∆Øb¡˘éÏòƒ«ZFø◊≥˝&Ê[√m^°ACNKü®ƒ◊n]ˇÔ$Â©G
;TÓV‚6˝.Ë≠˜ß»¶I†€o‰B±Í‘’)óû´†1æ(©â.æ8áN˘†€_QÃW≈G®…˘G)ÓùÕj◊⁄	Q‚ûÒZÎ‘7éáœÊ!£UË≤™Hqı&èA ˛_í_~ló⁄)˛Hm˚√◊Q[ùæ˘u§O÷ÈºÛ?Ce‰¯ﬁ„˚>˛áPòFUY#·Aw∏c∑ú~G>iπÁ€Uj°‡áâ¬\π@Îtª∂_·˘Tí1ΩVéÈ6Ω’NJ4‰ÔÄ–Vﬂ0[{sd´¯‹ów—⁄£9l∏®33¯<RKÊ± óÏûªÁÊÓãÛë“H∞°`2%5àö>MòAU9ÇY†œ9d·f`ÊßŒ©∏ñù5lKN4Æ	H·¶yEïÑÑåÅï:g‰ÔÃ∏´bRJú÷∞s}Ì!–y«@G9∑5∂≥óæ§ç}Re›Œßz9:ìw¸ö•Dú¥•ˆ>ﬂWvïVJ!‚úŸœçáCìÙ6ÇÍp`∂¢Tr/;m˙I'ˆ‚G]Ç¿≥êØP"˜',∆îRˆA1 Æ†¢Uí#û§üap`´ÄpHV†si‘%›P‘O•®oX ®¢|F˘å}π∫ËVÂE_îàºê›^Êwü;Ûbi)èëÙlÂM•›SŸD;Ç>Bc¿|8)*cL[ø©l Üà∏PÖu/¿°Õ›Zƒ S}DÌ ≥’Î&;å.“¡däë/_S†xª ÇuãÑ)å<%∏p]≠∑◊¥
ÖÄ°}ƒgF—⁄∫∏‘‚¡õ≈A-˚‚©hœ$à≠b8üƒÀ–ßÌGgKìi%	ân´ÖxqˆÙ+qK}R?=ûö∏¶â⁄¯…ız‡¶˘’‰AQ”å…4≈-ŒèJ>P:]πe…s“ç{ñ:R}Hë⁄_ZLPD('–÷ÚËA¢ÉJÄ¨cÑ}R£$uÇºXŸª}Gqv4A‘ZDA≈≥hgç2∫ﬂ¥T§Wè˙ÆTí$™%Bã£/ÑEÏ|1DãíhZﬁÊ⁄ØÃΩclÃKΩ…¢&åÌÔ∆±?¨åµ©±àgß–Ú ïG{[Ô±I+k§hÑæ≤BË>E–¥∞¯)ü),œXÊ,%q>π|ëúp´¬-∑∂=JTÙﬁ˙Ù%Öœ¢„
aiÛ>3ØE°àQ‡£l¿!ol∏oX˙¿]j∏e?<fß"Îr,t≤∂Z§^•¿U`Á\w…´l`9ü)2rÑ4Ï∂u’Ò0$.ËÄ<ÿ“Õäx®„Ω‘‰y¨¬%H7î,£<Ê{^æüC£ 0Öækó°–í`Å±Iá÷S‘Ts◊∂|¨m¥
‹=_€?ñEƒãdaÚ]JÊ ÙﬁA‡¢—TÇ¢z£√–π,çÏ.bµâs|ﬂ2Ÿ∞¬ﬂLµc˚›jœ˜ÜÄJ^uZ6˝"ﬁöôZ‚ÛA"8MÌ«
ıó[U¢—èâDá~_gí»!Œ\PPµ+Cç˛:Çè…¬f≤ÿo$&Û<†Íxç,Ü 7›êúg•ã¿NìW}Í˝ÿölÿjË}√≥¸VYíZÿ!±€©*¬%Àä÷X#ô∑Öá8ñ≈»Çk)â©É`Jˆµ†,≥^ç1»Ñ6 ´%∞%É+“ìı].†U˘µbÿÕ9@Ci›Òõ◊v˝ëPp¢FŒÇ◊mÇƒ ó|√r±Zbù\¥÷=•k§(
.G√Œ¸zteqóó¿À¢)ı/º?Tß)•ü
Æ<æ!°ÏC*}R`iƒ/ªÈ˛B¢ƒŒåßó'W9rr∫lª.≈P¡XÏŸ7N.XNó" Ç{h?≤π€– i@iLuFôÁõ†,Êˆj⁄7(ñP≥∞ÃÚ,≠…°{Ä¨0kª∞,ﬂ±É}–*L
∂CÍ[úXÒ”ùJ\LˇJ≤I ¿¶Zö∫|≥≈¸”“c|AÈ¡•Ë‚∂Ì⁄Õ–nΩÍ¨ò\ÑG9‰WkB∆E˙ˆãa„œòv»˚…Ñ7˛ÙÁá|≠ëWÌ.–å&Y¢tÄ !8íf’h»HL1&E6.±mQÔbÙ∂§Bj|Cß]◊ÙnTofﬂÔ≈úyópç=©îwñ•¿#·:¶„7r2‹N–π5Ë◊µ‹sN7&?A⁄’	ıÒ‹ªCcƒV=∞+ÁN≤,‰Ã(«/ÈBYüól¿±Yò;øt·“‚kÛ…Èãœâ¨¿≥.-ƒ©¶Cz>buZ–‘OS)ÔŒπÛîŒ≤[†¶∏”ΩﬁãÛÏ ˙Àg∑ØsÏRπÄœÙIvOˇ ªœñCÌÈÖl¡•®ùÓÙ:¥≈ı©oÙå’+ñ3¢O‰—ï»x
—˝pÎO◊…≈•πÛd~)Á40=°QÕ]s∆‹Åtñ0È´ŒìÎÏ*ñ®Æyuè˚]lƒ|Óq⁄Ôø≈I¥ë◊ÙAzáîõRÚ≥‘≈
‹ôWêlÌâLœ€yLO/ß´Ÿ¥É 
v»DœwƒÉ”qBPÓDól°ÿ,Ì:ö¶V˙4ëåÉ/zêCÒ#¢'âí≥≈‹◊âÜ
p˙3tÙSùE,®§2aI¨B9π¨´π0]åJ{ÏR:ÒÄz'GdÂãΩ≠ˇä¬%“á¥Ω§X∞*9óÜégSe4Î¸ñºHW«÷Úq¥Ñœ®ıe':^!ç+∂Í€»x"ŒEÁØÀeM‰bw•öÇIb~KÃõÎ˝TT ıŒo3ß=çΩ93äŸG'¶Ô–éúâmÚ¢*‚Ë ƒ9ñÒ”PW{˘êŒÛ°	—ÿ"E)C˜"∏Ä˘*ﬁ|ÜU®‚IïïObtÜÇ02d¨h◊zæ}êw÷^∂˙n®éì≥z=w˝¨Á3&¥ùû&R∆^ÎŸ~ËXUN√9qM(Bª8v∑iˇ÷∂¸ ›ëﬁQ˜l8û‘z∆Ò‘Õzû.{Æ„]ˆ]©˝EqY”î/∞[,Çb…Î9Mπ3øKØkh{]y.‚oUSµ9òˆÇéùT¥6åÄe§{˝P{XÓ‡¶≥(°¥™!X4£¥i$÷}4G∂)≤˘X—ﬂ≈+±3Ã"Ì(≤‹£¿3π`Z¿ú‡©…#ùÜ2î}ˆ∂∂jb∫π%ÙJ≥"<4ó<~Í≥àhø/1"|ìT"Ùì∂d8õHfH%;∏ì6ﬁz√nêY†8Æ◊£˛ˇ#dËÚ|˝Úõp=√¯{÷YqBÀ%‘|á6c∏xq="á…Èy¸˘:¥êπñ#ÓüYo¿4mùp}Ëmv»Q”
çπH, ÿ	Ñ1ûL+ËVlÌ«·t¶h„\ts
¬Ú”ï‡¶™Í≈ ∆N∆böímB^M÷$˝à∂©¢ÿ9~v_ß–§áµ·Kâ¨ÿ™õvß`=¯‹∑Ûûk∏k(c™Ø¢-iNi∫ë,£Õ%˝¢«A±O¸¬r6äU∆R}¬h09íV/‚@Ê
◊y5ÆS˙†Ê¨í"¶£úb€¶b◊∆"˝÷√aZ<˙e2tÕåÑÊÚß CŸËDÀúØ´ÙœM»TT¬#cÈŸes€5ô≠›°ÃÏ°`yBM–Ú∏Ö¨}ìﬁ˚S! 2∞ÄæjÂy˛≤BÏ,û¬ºêÌ\,ã9{zpÚå_cMò¡sçïáäíc,»Fâ=ØGi€ˆC£ 6Ph>t
"RExaÒÿM…C
¿Q√∆…:{D°ÁèW'„Áˇ}˛ù}>›7&≠w∏‘'_éÁwÁÂƒ‘ò=RTÖKı(•˝+ìt8–Œù¨3*G´∆kDËJq0˙û%h{=B’ßgóp˝_Çp≥_Õ£Ä≥˚<ºÁ[’…Êæ-t/JÊÉómmÃ—“iöò–w ãâ˛’w∏«#7∑ßh5üÍbà/9•NÄŒÄË¥N*Á1ÑÔåã:ÔµÏ·‹¬?9Í´7¶*uUXD E_u0pó\ætÓŸEœo9z~*©ΩwËOFØ«Ë®µP≤ñò3D*|Õu2c$7mö*”Ωb∑Êªéó}ﬂ5VS…ö©¡:—w å)c†ä∑˚ö)∂Ñ™Á{†”Ÿ/–âò—i≤Ff("-ŸV≥çg∫_l;ÆxΩˆ˙≥ãQwT)9ßÓ;ÊësÍË	÷¥\7‚€C©÷w¨˛’¶@OùH∂•46·*,ﬂ∂‘åÃ[¶7∆’0]äÀÕÑe3·W~n£F∏§r›]¶•v;7æ°ﬁ¶Õh®Ùw -≈©‡Wë#Ân‰⁄ç¸!¢Ã\$«–•À&e…¡%º>‹ë ¢¿˘=kq §·(pZÙ† ‹∂¬ @ËŸ•wkrdƒ„Ë;U5·w.Áﬁ¢‡"'X°£t[@ñ√{z≤mÜâ‚~¬@±ﬂEæ$ÄÛS(≈…ì:ÿV◊∂°.Ñ¶Gœé§ﬂÅºõ√–ÿqÏ%œÔQG(<çÚgVd®´vc./∏Qiˆ}.^lˇ”lÂ}pºó*'ÄÂTO»I˚√¢ˆ∂Vxpô$<Û∑DïCné`˙Ø¶J∆£ÈΩ˜Y◊?’◊+ßŸÓ∑Ü”ë	æZÿ˜üpÙ3.˙8„°MG(JI‚cT£ÄÒ§whIds7YÈù_ä√ÆíÕ∆“F“ΩÒëè≈†∫J¬E˛qV	é#¥<xÔˇP2√YèE}ú¶£mu•ˇçûø"Ω}FÙ±è*Ò G&N™êVD\U∂Ú]?)÷UæÙﬁQ´ÜïÁ}†~%Ê#Ï
º∞Ä∆MË^XrØè™˜z≥˚1<Ù™>YˆΩNjóDÂÔâ¨”NÅú‹oÁÆ◊‰ı¨¶Æ„È∫∂Øi˙{ì6UÅz«¬IÜ…∑æ|ØÙŒó;ˆ £ûL≈ˆ~¸dèÒD≤«‚“È•Àã¬0ª0û,Œ/\>«R?¢¨èd`°§	FµÍyΩöÎ&**ﬂ`ñÁÌßö≤Za?xër0'BïÃyë˛ëHˇ∞:òÖ,EWR/1n©À QúÛ‰3?ˆõÓQ&íYrO›ﬁÆù(-MÜî¸)ÂÄdEBfÜÿùä…;"<W¿®—Â"qh¨•=”·ƒâ“3D∏ÛƒâÖ,^°¬GÊëß9fJG†Œ[ÂëHœX‚Hä§ø»)õ;B˜èú±¸V~°_∆”$ e"U	Çß?Ê‡…Ôô#Q>öﬁ°S*ù]ÉπÖœ€¡ìuòamÑ÷bäûì≥'Û$“¶ëÎj≥$≤∏ù¶ ﬂˆOÜ?i'è&ÍL∂˘yëÕbÃ1(¥X©ÇZ¶ì5òAeKú]˙5u(mmU·Ù?x1éff´ÄÏ…RB/◊HD‘Ô¥	ü	/À'≤	¡dƒ…‰idË≤„%”ôµBã,ˆ;Àœzˇ4Ëo8
ÏË†„âàÎë
ÂÈÊz_ÕªEÍ
‚n€⁄{Sz"˙0ÊL“ó^⁄HTªx~åNá)ÜüO|4°çπ™®∆gl Xïﬁõ»≠qJÃTb7¥®ﬁÍ8]≤Ët˙Æet}(›û]8=È¸º§ƒ$9ìWÚ
-1gÒÖ;‚n˝®60†ı"aΩïìTÓ3[#π˜“Öí4<≥òf®,≠ı.œ‘Z»Ö„€Ô–Chr¸7G∏Ú°¿T`)”∞æ¶,˜6ª(á,›¢Ä€g(∂hñ”’›∏´F' $å®u¡–Y|¬çàyjúå«L9ÌMy…Ô”G‹gq#
ì"èbQ´"4+2´≥ÃÚOJÆè©ç∞>êÇÑ}@\àÕ›QìåÀ$∫≥oáâJ˝˛Ê≈%ﬁãÿ1’	&[Î∆ë}:9ËA|úe=ú¬øIè‹,ìÆJFN∏#uÓ√2˛HÌ¡ê™å‰¯∏¡É∆©JYÂ¢L\¡™(Ú\'≈R¬≈[»”·O!Ÿ†∏˚·Ï¸õs≥d·¬Ã¸π92saiÈ¬9˙ı˘Wôw`ÊÙ%R%só^ÖVoÃ/ΩFñ.\D«¬eºS9;CŒÕ/Õë≈•ﬂûõK€˘wH≥‹åAG<o]uVòò#¥…£ƒçæÄ]˚ı/˛  ˇˇ ïÓª/