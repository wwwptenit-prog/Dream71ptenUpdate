import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  PlusCircle,
  Plus,
  Search,
  Star,
  Clock,
  CheckCircle2,
  Send,
  Building2,
  UserCheck,
  ShieldCheck,
  DollarSign,
  FileText,
  Paperclip,
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
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { MarketplaceGig, MarketplaceJob, MarketplaceOrder } from '../types';
import { GigDetailPage } from './GigDetailPage';
import { GigCard } from './GigCard';
import { StudentDashboard } from './StudentDashboard';
import { CustomerDashboard } from './CustomerDashboard';
import { TeacherDashboard } from './TeacherDashboard';

interface MarketplaceSectionProps {
  setActiveTab?: (tab: string, category?: string) => void;
  openAuthModal?: () => void;
  initialCategory?: string;
  onStartLearning?: (courseId: string) => void;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ setActiveTab, openAuthModal, initialCategory, onStartLearning }) => {
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
    payouts,
    requestTeacherPayout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    directMessages,
    markDirectMessageRead,
    markAllDirectMessagesRead,
    openChatWindow,
    sendDirectMessage,
    customerProjects,
    createCustomerProject,
    updateMarketplaceOrder,
    deleteMarketplaceOrder
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
  const userEnrollments = useMemo(() => {
    if (!currentUser) return [];
    return (enrollments || []).filter(e => e.userId === currentUser.id || e.studentId === currentUser.id);
  }, [enrollments, currentUser]);
  const demoLogin = demoLoginMarketplace;
  const logout = logoutMarketplace;
  const updateProfile = updateMarketplaceProfile;

  const [activeSubTab, setActiveSubTab] = useState<'gigs' | 'jobs' | 'courses' | 'post-job' | 'my-orders' | 'ptenit-services' | 'overview' | 'my-courses' | 'saved_gigs' | 'settings'>('overview');
  const [overviewInnerTab, setOverviewInnerTab] = useState<'all' | 'courses' | 'orders'>('all');
  const [buyerOrderStatusFilter, setBuyerOrderStatusFilter] = useState<'all' | 'in_progress' | 'in_review' | 'completed' | 'cancelled' | 'public_projects'>('all');
  const [sellerOrderFilter, setSellerOrderFilter] = useState<'all' | 'pending' | 'in_progress' | 'in_review' | 'completed'>('all');

  // Public Project Post Modal States
  const [isPostProjectModalOpen, setIsPostProjectModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Web Development');
  const [postBudget, setPostBudget] = useState('৳১৫,০০০ - ৳৩০,০০০');
  const [postDescription, setPostDescription] = useState('');
  const [postAttachmentName, setPostAttachmentName] = useState('');
  const [postAttachmentUrl, setPostAttachmentUrl] = useState('');
  const [postSubmittedSuccess, setPostSubmittedSuccess] = useState(false);

  const handlePostProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postDescription) return;

    createCustomerProject({
      customerId: currentUser?.id || 'cust-1',
      customerName: currentUser?.name || 'Customer',
      customerEmail: currentUser?.email || 'customer@ptenit.com',
      customerPhone: currentUser?.mobile || '01700000000',
      serviceTitle: postTitle,
      category: postCategory,
      description: postDescription,
      budgetRange: postBudget,
      attachmentName: postAttachmentName,
      attachmentUrl: postAttachmentUrl
    });

    setPostSubmittedSuccess(true);
    setTimeout(() => {
      setPostSubmittedSuccess(false);
      setIsPostProjectModalOpen(false);
      setPostTitle('');
      setPostDescription('');
      setPostAttachmentName('');
      setPostAttachmentUrl('');
      setBuyerOrderStatusFilter('public_projects');
      if (activeSubTab !== 'my-orders') {
        setActiveSubTab('my-orders');
      }
    }, 1500);
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
  const [viewMode, setViewMode] = useState<'buying' | 'selling'>('buying');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState<'all' | 'under3k' | '3k-10k' | '10k-30k' | 'over30k'>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<'any' | '1day' | '3days' | '7days'>('any');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [isFilterBarVisible, setIsFilterBarVisible] = useState(true);

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

  // Whenever initialCategory or marketplace route is navigated to, set viewMode to 'buying' and sync selectedCategory
  useEffect(() => {
    setViewMode('buying');
    if (initialCategory === 'my-orders' || initialCategory === 'My Orders') {
      setActiveSubTab('my-orders');
      setSelectedGig(null);
    } else if (initialCategory === 'overview') {
      setActiveSubTab('overview');
      setSelectedGig(null);
    } else if (initialCategory === 'my-courses') {
      setActiveSubTab('my-courses');
      setSelectedGig(null);
    } else if (initialCategory) {
      setSelectedCategory(initialCategory);
      setActiveSubTab('gigs');
    }
  }, [initialCategory]);

  // Freelancer Free Tech Toolkit States
  const [activeToolkit, setActiveToolkit] = useState<'proposal' | 'invoice' | 'calculator' | 'contract'>('proposal');
  const [proposalJobTopic, setProposalJobTopic] = useState('');
  const [proposalResult, setProposalResult] = useState('');
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [proposalCopied, setProposalCopied] = useState(false);

  // Invoice tool states
  const [invClientName, setInvClientName] = useState('রহিম আহমেদ');
  const [invProjectName, setInvProjectName] = useState('Full Stack Web & Mobile App Development');
  const [invAmount, setInvAmount] = useState<number>(15000);

  // Escrow Calculator states
  const [calcGrossPrice, setCalcGrossPrice] = useState<number>(10000);

  const handleGenerateProposal = () => {
    if (!proposalJobTopic.trim()) return;
    setIsGeneratingProposal(true);
    setTimeout(() => {
      setProposalResult(
        `Dear Hiring Manager,\n\nI saw your job post for "${proposalJobTopic}" and I am excited to help you achieve your goal! As a top-rated freelancer with over 5 years of expertise in ${editProfileSkills || 'Full Stack Web & UI/UX'}, I have built similar high-converting applications with 100% client satisfaction.\n\nHere is how I will execute your project:\n1. 🔍 Comprehensive Requirements & Architecture Plan\n2. 🎨 Pixel-Perfect UI/UX Design & Responsive Layout\n3. ⚡ High-Performance Clean Code Implementation\n4. 🛡️ Thorough Testing & 30-Day Post-Delivery Maintenance Support\n\nI can deliver this project within schedule. Let's discuss further in chat!\n\nBest regards,\n${currentUser?.name || 'Sohag Kazi'}\nBoss Freelancer Pro`
      );
      setIsGeneratingProposal(false);
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

  // Order Details Modal (Checkout & Freelancer Showcase)
  const [selectedGig, setSelectedGig] = useState<MarketplaceGig | null>(() => {
    try {
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
    if (!cashoutAmount || cashoutAmount <= 0) {
      alert('দয়া করে ক্যাশআউটের জন্য সঠিক টাকার পরিমাণ প্রদান করুন!');
      return;
    }
    requestTeacherPayout({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      teacherEmail: currentUser.email || 'seller@ptenit.com',
      amount: Number(cashoutAmount),
      paymentMethod: cashoutMethod,
      accountNumber: cashoutAccountNumber,
      note: cashoutNote || `Seller Bill Cashout Request via ${cashoutMethod}`
    });
    setCashoutSuccessMsg(`✓ আপনার ৳${Number(cashoutAmount).toLocaleString('bn-BD')} বিল ক্যাশআউট আবেদন সফলভাবে জমা দেওয়া হয়েছে! ২৪ ঘণ্টার মধ্যে টাকা প্রসেস করা হবে।`);
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
    <div id="marketplace-top" className="py-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full max-w-[1920px] mx-auto space-y-8 font-sans text-slate-900 dark:text-slate-100 min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 md:pb-8">
      
      {/* PTENit MODERN FIVERR-STYLE MARKETPLACE HEADER */}
      {!selectedGig && !['overview', 'my-orders', 'my-courses', 'saved_gigs', 'settings', 'post-project', 'public-offers'].includes(activeSubTab) && viewMode !== 'selling' && (
        <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 mb-6 shadow-sm">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-3 flex items-center justify-between gap-4">
          
          {/* Left Brand Logo & Active Mode Indicator */}
          <div className="flex items-center gap-3 shrink-0">
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
              <span className="w-3.5 h-3.5 rounded-full bg-[#1DB954] animate-pulse shadow-[0_0_12px_#1DB954]"></span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-heading group-hover:opacity-90 transition">
                PTEN<span className="text-[#1DB954]">it</span>
              </span>
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${
                viewMode === 'selling'
                  ? 'bg-amber-400 text-slate-950 border border-amber-500/30'
                  : 'bg-[#1DB954] text-slate-950'
              }`}>
                {viewMode === 'selling' ? 'Seller Pro' : 'Market Buyer'}
              </span>
            </button>

            {/* Back to PTEN IT Main Website Button */}
            <button
              type="button"
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('home');
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#1DB954] text-white hover:text-slate-950 border border-slate-700/80 text-xs sm:text-sm font-black transition cursor-pointer shadow-md font-bengali ml-1 group"
              title="PTEN IT মূল ওয়েবসাইটে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4 text-[#1DB954] group-hover:text-slate-950 group-hover:-translate-x-0.5 transition-transform" />
              <span>← ফিরে যান</span>
            </button>
          </div>

          {/* Center Search Input Bar (Fiverr Style) */}
          <div className="flex-1 max-w-2xl mx-2 hidden sm:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={viewMode === 'selling' ? "আপনার সার্ভিস বা ক্লায়েন্ট অর্ডার দিয়ে সার্চ করুন..." : "What service are you looking for today?"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] font-english"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                onClick={() => setActiveSubTab('gigs')}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 rounded-md transition cursor-pointer"
                title="Search"
              >
                <Search className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Right Action Icons & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-english relative">
            {currentUser && (
              <>
                {/* Notification Bell */}
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsInboxModalOpen(false);
                  }}
                  className={`relative p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                    isNotificationsOpen
                      ? 'bg-emerald-500/20 text-[#1DB954]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="নটিফিকেশনসমূহ"
                >
                  <Bell className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                    {notifications.filter(n => !n.read).length || 3}
                  </span>
                </button>

                {/* Messages Inbox */}
                <button
                  onClick={() => {
                    setIsInboxModalOpen(!isInboxModalOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className={`relative p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                    isInboxModalOpen
                      ? 'bg-emerald-500/20 text-[#1DB954]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="ইনবক্স মেসেজ"
                >
                  <Mail className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-[#1DB954] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                    {directMessages.filter(m => !m.read).length || 3}
                  </span>
                </button>

                {/* Saved Wishlist (Buying) */}
                {viewMode === 'buying' && (
                  <button
                    onClick={() => {
                      setViewMode('buying');
                      setActiveSubTab('gigs');
                      setSelectedGig(null);
                      setShowSavedOnly(prev => !prev);
                    }}
                    className={`relative p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                      showSavedOnly
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title="ফেভারিট গিগসমূহ"
                  >
                    <Heart className={`w-4.5 h-4.5 ${showSavedOnly ? 'fill-current text-white' : savedGigIds.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                    <span className={`absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs ${
                      showSavedOnly ? 'bg-rose-600 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {savedGigIds.length || 3}
                    </span>
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
                    className={`relative p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                      activeSubTab === 'my-orders'
                        ? 'bg-emerald-500/20 text-[#1DB954]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title="আমার অর্ডারসমূহ"
                  >
                    <ShoppingBag className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200" />
                    <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-[#1DB954] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                      {marketplaceOrders.length || 3}
                    </span>
                  </button>
                ) : (
                  /* Seller New Orders Icon Button - Shows pending orders count & decreases on work start */
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
                        className={`relative p-2 rounded-lg transition cursor-pointer flex items-center justify-center ${
                          sellerSubTab === 'orders'
                            ? 'bg-emerald-500/20 text-[#1DB954]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title="নতুন ক্লায়েন্ট অর্ডারসমূহ (New Client Orders)"
                      >
                        <ShoppingBag className="w-4.5 h-4.5 text-slate-700 dark:text-slate-200" />
                        {pendingOrdersCount > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse">
                            {pendingOrdersCount}
                          </span>
                        )}
                      </button>
                    );
                  })()
                )}
              </>
            )}

            {/* Switch to Selling / Buying */}
            <button
              onClick={() => {
                if (viewMode === 'buying') {
                  setViewMode('selling');
                  setSelectedGig(null);
                  if (!currentUser) demoLogin('instructor');
                } else {
                  setViewMode('buying');
                  setSelectedGig(null);
                  setActiveSubTab('gigs');
                  if (!currentUser) demoLogin('customer');
                }
              }}
              className="px-3.5 py-1.5 rounded-md text-xs font-black text-slate-900 dark:text-white bg-emerald-500/10 hover:bg-[#1DB954] hover:text-slate-950 dark:hover:text-slate-950 border border-[#1DB954]/40 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>{viewMode === 'buying' ? 'সেলার মোডে যান' : 'বায়ার মোডে যান'}</span>
            </button>

            {/* User Avatar & Profile Dropdown Popup */}
            {currentUser ? (
              <div className="relative flex items-center pl-2 border-l border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsNotificationsOpen(false);
                    setIsInboxModalOpen(false);
                  }}
                  className="relative group cursor-pointer flex items-center gap-1 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="প্রোফাইল মেনু"
                >
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#1DB954] group-hover:scale-105 transition"
                  />
                  <span className="absolute -bottom-0.5 right-3 w-2.5 h-2.5 bg-emerald-500 border border-white dark:border-slate-900 rounded-full"></span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Popup Dropdown */}
                {isProfileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-11 z-50 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 font-bengali animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Marketplace User Header */}
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                        <img
                          src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                          alt={currentUser.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#1DB954]"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-[#1DB954] font-bold truncate">🛒 মার্কেটপ্লেস: {currentUser.role === 'instructor' ? 'সেলার' : 'বায়ার'}</p>
                        </div>
                      </div>

                      {/* Connected PTENit Account Link Card */}
                      <div className="mx-2 my-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          <span>🎓 PTENit একাউন্ট</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black">
                            {ptenitUser?.role === 'instructor' ? 'ট্রেইনার' : ptenitUser?.role === 'admin' ? 'এডমিন' : 'স্টুডেন্ট'}
                          </span>
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {ptenitUser?.name || 'সাব্বির রহমান (স্টুডেন্ট)'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            if (setActiveTab) setActiveTab('courses');
                          }}
                          className="mt-1 w-full py-1 px-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition text-center flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>PTENit একাডেমিতে যান ➔</span>
                        </button>
                      </div>

                      <div className="py-1">
                        {/* 1. বায়ার মোড (Buyer Mode) */}
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setViewMode('buying');
                            setSelectedGig(null);
                            setActiveSubTab('gigs');
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                            viewMode === 'buying' 
                              ? 'bg-emerald-500/10 text-[#1DB954]' 
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1DB954]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag className="w-4 h-4 text-[#1DB954]" />
                            <span>🛒 বায়ার মোড (Buyer)</span>
                          </div>
                          {viewMode === 'buying' && <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>}
                        </button>

                        {/* 2. সেলার মোড (Seller Mode) */}
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setViewMode('selling');
                            setSelectedGig(null);
                            if (!currentUser) demoLogin('instructor');
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                            viewMode === 'selling' 
                              ? 'bg-emerald-500/10 text-[#1DB954]' 
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1DB954]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Zap className="w-4 h-4 text-[#1DB954]" />
                            <span>💼 সেলার মোড (Seller)</span>
                          </div>
                          {viewMode === 'selling' && <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>}
                        </button>

                        {/* 3. আমার অর্ডারসমূহ */}
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setViewMode('buying');
                            setActiveSubTab('my-orders');
                            setSelectedGig(null);
                            setTimeout(() => {
                              const el = document.getElementById('my-orders-section');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 50);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1DB954] flex items-center gap-2.5 transition cursor-pointer border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                        >
                          <ShoppingBag className="w-4 h-4 text-[#1DB954]" />
                          <span>আমার অর্ডারসমূহ</span>
                        </button>

                        {/* 4. বায়ার পোর্টাল / ড্যাশবোর্ড */}
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            if (setActiveTab) setActiveTab('customer-dashboard');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1DB954] flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#1DB954]" />
                          <span>বায়ার ড্যাশবোর্ড (Portal)</span>
                        </button>

                        {/* 4. সেটিং */}
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setIsEditProfileModalOpen(true);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1DB954] flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span>সেটিং</span>
                        </button>
                      </div>

                      {/* 3. লগ আউট */}
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setActiveSubTab('gigs');
                            logout();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>লগ আউট</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-md shadow-sm transition cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

        </div>
      </div>
      )}

      {/* CATEGORY & SERVICE FILTER SUB-NAVBAR (ONLY VISIBLE IN BUYER MARKETPLACE CATALOG MODE AND NOT IN DASHBOARD) */}
      {viewMode === 'buying' && !['overview', 'my-orders', 'my-courses', 'saved_gigs', 'settings', 'post-project', 'public-offers'].includes(activeSubTab) && !selectedGig && (
        <div className={`sticky top-[57px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 shadow-xs transition-all duration-300 ease-in-out ${
          isFilterBarVisible
            ? 'translate-y-0 opacity-100 py-2.5 mb-6 max-h-[500px] pointer-events-auto'
            : '-translate-y-2 opacity-0 py-0 mb-2 max-h-0 overflow-hidden pointer-events-none'
        }`}>
          
          {/* Main Bar: Category Pills + Expand/Collapse Filter Toggle Button */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Category Bar with Flex-Wrap & 2-Line / See All Toggle */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between gap-2 mb-1 sm:hidden">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-bengali">ক্যাটাগরি টাইপ:</span>
                <button
                  type="button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-[11px] font-bold text-[#1DB954] hover:underline font-bengali flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAllCategories ? 'কমিয়ে দেখুন' : 'সব ক্যাটাগরি (See All)'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className={`flex flex-wrap items-center gap-1.5 text-xs py-0.5 transition-all duration-300 ${
                showAllCategories ? 'max-h-none' : 'max-h-[82px] sm:max-h-[88px] overflow-hidden'
              }`}>
                {[
                  { id: 'All', label: 'সব সার্ভিস (All)' },
                  { id: 'AI Services', label: 'এআই ও সফটওয়্যার (AI)' },
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
                    }}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 border whitespace-nowrap ${
                      (selectedCategory === cat.id || (cat.id === 'AI Services' && selectedCategory === 'AI Development')) && activeSubTab === 'gigs' && !showSavedOnly
                        ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] shadow-xs font-black'
                        : 'bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm text-[#1DB954] bg-[#1DB954]/10 hover:bg-[#1DB954] hover:text-slate-950 transition cursor-pointer border border-[#1DB954]/30 font-bengali shrink-0"
                >
                  <span>{showAllCategories ? 'কমিয়ে দেখুন' : 'সব ক্যাটাগরি (See All)'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllCategories ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Toggle Button for Detailed Filters (Price, Delivery, Rating, Sort) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsFilterExpanded(prev => !prev)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs sm:text-sm font-black transition cursor-pointer active:scale-95 select-none ${
                  isFilterExpanded || (priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0)
                    ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#1DB954]'
                }`}
                title="ফিল্টার ফিল্টারিং অপশন দেখান/লুকান"
              >
                <span className="font-bold">ফিল্টার</span>
                {(priceRangeFilter !== 'all' || deliveryFilter !== 'any' || ratingFilter > 0) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 dark:bg-white animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Detailed Filter Panel (Price, Delivery, Rating, Sort, Reset) */}
          {isFilterExpanded && (
            <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Price Filter */}
                <div className="relative">
                  <select
                    value={priceRangeFilter}
                    onChange={(e) => setPriceRangeFilter(e.target.value as any)}
                    className="pl-3.5 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="all">প্রাইজ ফিল্টার: সব</option>
                    <option value="under3k">৳৩,০০০ এর নিচে (বাজেট)</option>
                    <option value="3k-10k">৳৩,০০০ - ৳১০,০০০ (স্ট্যান্ডার্ড)</option>
                    <option value="10k-30k">৳১০,০০০ - ৳৩০,০০০ (প্রিমিয়াম)</option>
                    <option value="over30k">৳৩০,০০০+ (এন্টারপ্রাইজ)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Delivery Time Filter */}
                <div className="relative">
                  <select
                    value={deliveryFilter}
                    onChange={(e) => setDeliveryFilter(e.target.value as any)}
                    className="pl-3.5 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="any">ডেলিভারি সময়: সব</option>
                    <option value="1day">২৪ ঘণ্টার মধ্যে (এক্সপ্রেস)</option>
                    <option value="3days">৩ দিনের মধ্যে</option>
                    <option value="7days">৭ দিনের মধ্যে</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Seller Rating Filter */}
                <div className="relative">
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="pl-3.5 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value={0}>সেলার রেটিং: সব</option>
                    <option value={4.5}>৪.৫+ রেটিং (টপ সেলার)</option>
                    <option value={4.8}>৪.৮+ রেটিং (সুপার স্টার)</option>
                    <option value={5.0}>৫.০ রেটিং (পারফেক্ট)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Reset Filters */}
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
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs sm:text-sm flex items-center gap-1 transition cursor-pointer border border-rose-500/20"
                    title="সমস্ত ফিল্টার রিসেট করুন"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>রিসেট</span>
                  </button>
                )}
              </div>

              {/* Right: Sort By & Count */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium hidden md:inline">
                  <strong className="text-[#1DB954] font-black">{filteredGigs.length}টি</strong> সার্ভিস
                </span>

                <div className="relative flex items-center gap-1.5">
                  <span className="text-slate-400 text-xs font-bold hidden sm:inline">সর্ট:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#1DB954] cursor-pointer appearance-none shadow-2xs"
                  >
                    <option value="popular">জনপ্রিয়তা অনুযায়ী</option>
                    <option value="price-asc">দাম: কম থেকে বেশি</option>
                    <option value="price-desc">দাম: বেশি থেকে কম</option>
                    <option value="rating">সর্বোচ্চ রেটিং অনুযায়ী</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
              setSelectedGig(null);
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
                {/* STICKY TOP HEADER & ACTION BAR FOR SELLER DASHBOARD */}
                <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 pb-3 space-y-3 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                  
                  {/* DEDICATED CLEAN SELLER DASHBOARD TOP HEADER */}
                  <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-5 border border-slate-800 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md shadow-amber-500/20">
                          <Zap className="w-5 h-5 text-slate-950" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-lg sm:text-xl font-black text-white">
                              স্পেশালিস্ট ড্যাশবোর্ড (সেলার + টিচার)
                            </h1>
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-extrabold rounded-full border border-amber-500/40">
                              ⚡ সেলার & ট্রেনারের কাস্টমাইজড হাব
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-bold hidden sm:block">
                            আপনার ফ্রিল্যান্স সার্ভিস, ক্লায়েন্ট অর্ডার, পরিচালিত কোর্স, ক্লাসরুম অ্যাসাইনমেন্ট, সার্টিফিকেট ও ক্যাশআউট হাব
                          </p>
                        </div>
                      </div>

                      {/* Right Header Action Bar: Home, Marketplace, Messenger, Notifications, Profile & Logout */}
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

                        {/* 2. Buyer Marketplace Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setViewMode('buying');
                            setActiveSubTab('gigs');
                            setSelectedGig(null);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#1DB954] hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow-xs active:scale-95"
                          title="বায়ার মার্কেটপ্লেসে ফিরে যান"
                        >
                          <Store className="w-4 h-4 text-slate-950" />
                          <span>বায়ার মোড</span>
                        </button>

                        {/* 3. Messenger / Direct Inbox */}
                        <button
                          onClick={() => {
                            setIsInboxModalOpen(!isInboxModalOpen);
                            setIsNotificationsOpen(false);
                          }}
                          className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border ${
                            isInboxModalOpen
                              ? 'bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          }`}
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
                                src={activeAccount.avatar || currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                                alt={activeAccount.name}
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
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0"
                          title="লগ আউট"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Account Switch Toast Notification */}
          {switchSuccessMsg && (
            <div className="p-4 bg-[#1DB954]/15 text-[#1DB954] font-black text-xs sm:text-sm rounded-2xl border border-[#1DB954]/40 shadow-md flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1DB954]" />
                <span>{switchSuccessMsg}</span>
              </div>
              <button onClick={() => setSwitchSuccessMsg('')} className="p-1 hover:bg-[#1DB954]/20 rounded-lg text-slate-400 hover:text-white transition">✕</button>
            </div>
          )}

          {/* SPECIALIST DASHBOARD 2-COLUMN LAYOUT WITH LEFT SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 font-bengali animate-fadeIn">
            
            {/* SINGLE ELEGANT HORIZONTAL SPECIALIST HEADER BAR */}
            <div className="lg:col-span-3 xl:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-sm font-bengali">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                {/* Left Side: Avatar + Name + Title + Skills Chips */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={activeAccount.avatar || currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={activeAccount.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#1DB954]"
                    />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1DB954] border-2 border-white dark:border-slate-900 absolute bottom-0 right-0" title="Online Now"></span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {activeAccount.name}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/30">
                        <BadgeCheck className="w-3 h-3 text-[#1DB954]" />
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
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md border border-slate-200 dark:border-slate-700">
                          {skill.trim()}
                        </span>
                      ))}
                      {editProfileSkills.split(',').length > 4 && (
                        <span className="text-[10px] text-slate-400 font-bold">+{editProfileSkills.split(',').length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center / Right: 1-Click Portfolio Sync + 3-Dot More Info & Edit Button */}
                <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 justify-between lg:justify-end">
                  
                  {/* 1-Click Portfolio Sync Bar */}
                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex-1 sm:flex-initial">
                    <span className="text-xs font-black text-slate-700 dark:text-amber-400 flex items-center gap-1 shrink-0 hidden sm:flex">
                      <ExternalLink className="w-3.5 h-3.5 text-[#1DB954]" />
                      1-Click Portfolio Sync:
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
                      {isImportingPortfolio ? '...' : 'Sync Now'}
                    </button>
                  </div>

                  {/* 3-Dots Button -> Opens Menu with Full Profile Info, Edit Profile, Account Switcher */}
                  <div className="relative shrink-0">
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
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => setIsHeaderMoreMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-4 space-y-3 font-bengali text-xs animate-fadeIn max-h-[85vh] overflow-y-auto">
                          
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

            {/* LEFT VERTICAL NAVIGATION SIDEBAR CARD */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 text-slate-900 dark:text-white shadow-sm font-bengali space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                    স্পেশালিস্ট নেভিগেশন
                  </span>
                  <span className="text-[10px] bg-[#1DB954]/10 text-[#1DB954] px-2.5 py-0.5 rounded-full font-extrabold border border-[#1DB954]/20">
                    সেলার & মেন্টর
                  </span>
                </div>

                {/* Vertical Navigation Items (Top to Bottom) */}
                <div className="space-y-2">
                  {/* 1. মার্কেটপ্লেস */}
                  <button
                    onClick={() => {
                      setSpecialistMainTab('marketplace');
                      setSellerSubTab('orders');
                    }}
                    className={`w-full p-3.5 rounded-2xl font-black text-xs transition flex items-center justify-between gap-2 cursor-pointer border text-left ${
                      specialistMainTab === 'marketplace'
                        ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${specialistMainTab === 'marketplace' ? 'bg-slate-950 text-[#1DB954]' : 'bg-slate-200 dark:bg-slate-700 text-amber-500'}`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="block font-black text-xs">মার্কেটপ্লেস</span>
                        <span className={`block text-[10px] font-bold truncate ${
                          specialistMainTab === 'marketplace' ? 'text-slate-900/80' : 'text-slate-400'
                        }`}>
                          ক্লায়েন্ট অর্ডারস (32) • সার্ভিসেস ({sellerGigs.length || 2})
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${specialistMainTab === 'marketplace' ? 'text-slate-950' : 'text-slate-400'}`} />
                  </button>

                  {/* 2. মেন্টর সার্ভিস */}
                  <button
                    onClick={() => {
                      setSpecialistMainTab('mentor');
                      setSellerSubTab('courses');
                    }}
                    className={`w-full p-3.5 rounded-2xl font-black text-xs transition flex items-center justify-between gap-2 cursor-pointer border text-left ${
                      specialistMainTab === 'mentor'
                        ? 'bg-teal-500 text-slate-950 border-teal-500 shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${specialistMainTab === 'mentor' ? 'bg-slate-950 text-teal-400' : 'bg-slate-200 dark:bg-slate-700 text-teal-500'}`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="block font-black text-xs">মেন্টর সার্ভিস</span>
                        <span className={`block text-[10px] font-bold truncate ${
                          specialistMainTab === 'mentor' ? 'text-slate-900/80' : 'text-slate-400'
                        }`}>
                          কোর্স • ক্লাসরুম • স্টুডেন্ট (3)
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${specialistMainTab === 'mentor' ? 'text-slate-950' : 'text-slate-400'}`} />
                  </button>

                  {/* 3. পেমেন্ট ও ক্যাশআউট */}
                  <button
                    onClick={() => {
                      setSpecialistMainTab('payments');
                      setSellerSubTab('earnings');
                    }}
                    className={`w-full p-3.5 rounded-2xl font-black text-xs transition flex items-center justify-between gap-2 cursor-pointer border text-left ${
                      specialistMainTab === 'payments'
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${specialistMainTab === 'payments' ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 dark:bg-slate-700 text-amber-500'}`}>
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="block font-black text-xs">পেমেন্ট ও ক্যাশআউট</span>
                        <span className={`block text-[10px] font-bold truncate ${
                          specialistMainTab === 'payments' ? 'text-slate-900/80' : 'text-slate-400'
                        }`}>
                          মার্কেট + মেন্টর যৌথ হিসাব
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${specialistMainTab === 'payments' ? 'text-slate-950' : 'text-slate-400'}`} />
                  </button>

                  {/* 4. ফ্রি টুলস্ */}
                  <button
                    onClick={() => {
                      setSpecialistMainTab('ai_toolkit');
                    }}
                    className={`w-full p-3.5 rounded-2xl font-black text-xs transition flex items-center justify-between gap-2 cursor-pointer border text-left ${
                      specialistMainTab === 'ai_toolkit'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 shadow-md scale-[1.01]'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${specialistMainTab === 'ai_toolkit' ? 'bg-white/20 text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-purple-400'}`}>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                      </div>
                      <div className="truncate">
                        <span className="block font-black text-xs">ফ্রি টুলস্</span>
                        <span className={`block text-[10px] font-bold truncate ${
                          specialistMainTab === 'ai_toolkit' ? 'text-white/80' : 'text-slate-400'
                        }`}>
                          ⚡ ১০০% ফ্রী ফ্রিল্যান্সিং টুলস
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${specialistMainTab === 'ai_toolkit' ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                </div>

                {/* Mode Switcher Shortcut in Left Sidebar */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setViewMode('buying');
                      setActiveSubTab('gigs');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer"
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
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                    <span className="uppercase tracking-wider text-[11px] font-black text-[#1DB954]">
                      {specialistMainTab === 'marketplace' && '১. মার্কেটপ্লেস ওয়ার্কস্পেস (Marketplace Services)'}
                      {specialistMainTab === 'mentor' && '২. মেন্টর সার্ভিস ওয়ার্কস্পেস (Mentor Classroom)'}
                      {specialistMainTab === 'payments' && '৩. পেমেন্ট ও ক্যাশআউট ড্যাশবোর্ড (Earning & Payout)'}
                      {specialistMainTab === 'ai_toolkit' && '৪. ফ্রি ফ্রিল্যান্সার এআই টুলকিট (Free Tools)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/30 font-extrabold hidden sm:inline-block">
                    ⚡ সেলার + মেন্টর ৪-ইন-১ সার্ভিস হাব
                  </span>
                </div>

                {/* Secondary Dynamic Sub-Navigation Bar (Pills + Action Buttons) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  {/* CATEGORY 1: MARKETPLACE SUB-ITEMS */}
                  {specialistMainTab === 'marketplace' && (
                    <>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                        <button
                          onClick={() => setSellerSubTab('orders')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            sellerSubTab === 'orders'
                              ? 'bg-[#1DB954] text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ক্লায়েন্ট অর্ডারস (32)</span>
                        </button>

                        <button
                          onClick={() => setSellerSubTab('gigs')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            sellerSubTab === 'gigs'
                              ? 'bg-[#1DB954] text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>আমার সার্ভিসেস ({sellerGigs.length || 2})</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setSellerSubTab('create_gig')}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                          sellerSubTab === 'create_gig'
                            ? 'bg-white text-slate-950 font-black'
                            : 'bg-gradient-to-r from-[#1DB954] to-emerald-400 text-slate-950 hover:opacity-90 font-black'
                        }`}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>{sellerSubTab === 'create_gig' ? 'প্রজেক্ট তালিকা' : '+ নতুন প্রজেক্ট আপলোড'}</span>
                      </button>
                    </>
                  )}

                  {/* CATEGORY 2: MENTOR SERVICE SUB-ITEMS */}
                  {specialistMainTab === 'mentor' && (
                    <>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                        <button
                          onClick={() => setSellerSubTab('courses')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            sellerSubTab === 'courses'
                              ? 'bg-teal-400 text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>আমার পরিচালিত কোর্স</span>
                        </button>

                        <button
                          onClick={() => setSellerSubTab('assignments')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            sellerSubTab === 'assignments'
                              ? 'bg-teal-400 text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>অ্যাসাইনমেন্ট ও ক্লাসরুম</span>
                        </button>

                        <button
                          onClick={() => setSellerSubTab('students')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            sellerSubTab === 'students'
                              ? 'bg-teal-400 text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>শিক্ষার্থীবৃন্দ (3)</span>
                        </button>

                        <button
                          onClick={() => setSellerSubTab('certificates')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            sellerSubTab === 'certificates'
                              ? 'bg-teal-400 text-slate-950 font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>সার্টিফিকেট প্রদান (1)</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setSellerSubTab('assignments');
                          setIsCreateAssignmentModalOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-400 hover:opacity-90 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>+ নতুন অ্যাসাইনমেন্ট দিন</span>
                      </button>
                    </>
                  )}

                  {/* CATEGORY 3: PAYMENTS & CASHOUT SUMMARY HEADER */}
                  {specialistMainTab === 'payments' && (
                    <div className="flex items-center justify-between gap-3 overflow-x-auto scrollbar-none py-1 text-xs font-bold w-full">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40 rounded-full flex items-center gap-1.5 font-black text-xs shrink-0">
                          <Wallet className="w-3.5 h-3.5 text-[#1DB954]" /> ক্যাশআউটযোগ্য যৌথ ব্যালেন্স: ৳৬,৮৩,৯১৯
                        </span>
                        <span className="text-slate-400 text-xs hidden md:inline-block">
                          (মার্কেটপ্লেস ও মেন্টরিং সার্ভিস যৌথ ফান্ড)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setPayoutSubTab('withdraw');
                          setIsCashoutFormOpen(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>+ ইনস্ট্যান্ট ক্যাশআউট</span>
                      </button>
                    </div>
                  )}

                  {/* CATEGORY 4: FREELANCER FREE AI TOOLKIT SUB-ITEMS */}
                  {specialistMainTab === 'ai_toolkit' && (
                    <>
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                        <button
                          onClick={() => setActiveToolkit('proposal')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            activeToolkit === 'proposal'
                              ? 'bg-purple-500 text-white font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Bot className="w-3.5 h-3.5 text-purple-300" />
                          <span>AI প্রপোজাল রাইটার</span>
                        </button>

                        <button
                          onClick={() => setActiveToolkit('invoice')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            activeToolkit === 'invoice'
                              ? 'bg-purple-500 text-white font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-300" />
                          <span>ইনভয়েস জেনারেটর</span>
                        </button>

                        <button
                          onClick={() => setActiveToolkit('contract')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            activeToolkit === 'contract'
                              ? 'bg-purple-500 text-white font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
                          <span>চুক্তিপত্র (NDA)</span>
                        </button>

                        <button
                          onClick={() => setActiveToolkit('calculator')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                            activeToolkit === 'calculator'
                              ? 'bg-purple-500 text-white font-black shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                          }`}
                        >
                          <Calculator className="w-3.5 h-3.5 text-amber-300" />
                          <span>ক্যালকুলেটর</span>
                        </button>
                      </div>

                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-black text-[11px] rounded-full border border-purple-500/30 shrink-0">
                        ⚡ ১০০% ফ্রী ফ্রিল্যান্সিং টুলস
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* TAB 4: FREELANCER FREE AI TOOLKIT CONTENT VIEW */}
              {specialistMainTab === 'ai_toolkit' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-5 text-slate-900 dark:text-white shadow-sm font-bengali animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center font-bold">
                        <Sparkles className="w-5 h-5 text-[#1DB954]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                          ফ্রিল্যান্সার ফ্রি এআই ও প্রফেশনাল টুলকিট
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">১০০% ফ্রী এআই জেনারেটর, ইনভয়েস, ক্যালকুলেটর ও লিগ্যাল কন্ট্রাক্ট</p>
                      </div>
                    </div>
                    <span className="text-xs font-black bg-[#1DB954]/20 text-[#1DB954] px-3 py-1 rounded-full border border-[#1DB954]/30">
                      FREE AI TOOLKIT
                    </span>
                  </div>

                  {/* Tool 1: AI Proposal Generator */}
                  {activeToolkit === 'proposal' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        ক্লায়েন্টের কাজের টাইটেল লিখুন, এআই অটোমেটিক প্রফেশনাল Proposal তৈরি করবে:
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="যেমন: Fullstack E-commerce Website in React & Node.js"
                          value={proposalJobTopic}
                          onChange={(e) => setProposalJobTopic(e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#1DB954]"
                        />
                        <button
                          onClick={handleGenerateProposal}
                          disabled={isGeneratingProposal || !proposalJobTopic.trim()}
                          className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                        >
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>{isGeneratingProposal ? 'এআই জেনারেট হচ্ছে...' : 'ইনস্ট্যান্ট AI Proposal জেনারেট করুন'}</span>
                        </button>
                      </div>

                      {proposalResult && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-xs font-bold text-emerald-600 dark:text-[#1DB954] flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" /> AI Proposal Ready
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(proposalResult);
                                setProposalCopied(true);
                                setTimeout(() => setProposalCopied(false), 2000);
                              }}
                              className="text-xs bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              {proposalCopied ? <Check className="w-3.5 h-3.5 text-[#1DB954]" /> : <Copy className="w-3.5 h-3.5 text-[#1DB954]" />}
                              <span>{proposalCopied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                            </button>
                          </div>
                          <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto no-scrollbar">
                            {proposalResult}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tool 2: Invoice Builder */}
                  {activeToolkit === 'invoice' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">ক্লায়েন্টের নাম</label>
                          <input
                            type="text"
                            value={invClientName}
                            onChange={(e) => setInvClientName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">প্রজেক্ট বাজেট (৳)</label>
                          <input
                            type="number"
                            value={invAmount}
                            onChange={(e) => setInvAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-[#1DB954]/40 rounded-2xl space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                          <span className="font-black text-[#1DB954] text-xs">INVOICE #INV-2026-088</span>
                          <span className="text-xs text-slate-400 font-mono">Date: 2026-08-13</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          <strong>ক্লায়েন্ট:</strong> {invClientName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          <strong>সার্ভিস:</strong> {invProjectName}
                        </p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 font-black text-sm">
                          <span>মোট বিল:</span>
                          <span className="text-[#1DB954]">৳{invAmount.toLocaleString('bn-BD')}</span>
                        </div>
                        <button
                          onClick={() => alert(`✓ ইনভয়েস #INV-2026-088 সফলভাবে প্রিন্ট ও সেভ করা হয়েছে!`)}
                          className="w-full mt-2 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-slate-950" />
                          <span>ইনভয়েস ডাউনলোড (PDF)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tool 3: Profit Calculator */}
                  {activeToolkit === 'calculator' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">গ্রস বাজেট (Gross Amount ৳)</label>
                        <input
                          type="number"
                          value={calcGrossPrice}
                          onChange={(e) => setCalcGrossPrice(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300 text-xs">
                          <span>এস্ক্রো চার্জ (5%):</span>
                          <span className="text-red-400 font-bold">- ৳{(calcGrossPrice * 0.05).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300 text-xs">
                          <span>বিকাশ/ব্যাংক ট্রানজেকশন ফি (1.8%):</span>
                          <span className="text-amber-500 font-bold">- ৳{(calcGrossPrice * 0.018).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white">
                          <span>আপনার নীট ইনকাম:</span>
                          <span className="text-[#1DB954]">৳{(calcGrossPrice * 0.932).toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tool 4: Contract Generator */}
                  {activeToolkit === 'contract' && (
                    <div className="space-y-3 pt-1 animate-fadeIn">
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        ক্লায়েন্ট ও ফ্রিল্যান্সারের জন্য বাংলাদেশ লিগ্যাল স্ট্যান্ডার্ড সার্ভিস চুক্তিপত্র টেমপ্লেট:
                      </p>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[#1DB954]">
                            <ShieldCheck className="w-4 h-4 text-[#1DB954]" /> Standard NDA & Service Contract.pdf
                          </span>
                          <span className="text-slate-400 text-[10px]">Bangladesh Legal Compliant</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed text-xs">
                          ১. সোর্স কোড ও রাইটস হস্তান্তর শর্তাবলী।<br/>
                          ২. ৫০% অগ্রিম এস্ক্রো মাইলস্টোন সিস্টেম।<br/>
                          ৩. ৩০ দিনের ফ্রি সাপোর্ট ও রিভিশন পলিসি।
                        </p>
                        <button
                          onClick={() => alert("✓ স্ট্যান্ডার্ড ফ্রিল্যান্সিং চুক্তিপত্র ডাউনলোডের জন্য প্রস্তুত!")}
                          className="w-full py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-slate-950" />
                          <span>চুক্তিপত্র ডাউনলোড (PDF)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}



                  {/* SUBTAB: TEACHER / SPECIALIST MODULES (Courses, Assignments, Students, Certificates) */}
                  {(sellerSubTab === 'courses' || sellerSubTab === 'assignments' || sellerSubTab === 'students' || sellerSubTab === 'certificates') && (
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

                  {/* SUBTAB 1: Active Uploaded Orders */}
                  {sellerSubTab === 'gigs' && (
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

                  {/* SUBTAB 2: Active Client Orders Workspace */}
                  {sellerSubTab === 'orders' && (
                    <div id="seller-orders-section" className="space-y-6 animate-fadeIn font-bengali">
                      {/* Filter Header & Stats */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 rounded-xl shadow-xs space-y-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                          <div>
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Package className="w-4 h-4 text-[#1DB954]" />
                              <span>বায়ার ক্লায়েন্ট প্রজেক্ট অর্ডার ড্যাশবোর্ড</span>
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              বায়ারদের প্রজেক্ট অর্ডার পরিচালনা করুন, নতুন কাজ শুরু করুন ও আপডেট দিন।
                            </p>
                          </div>

                          {/* Status Filter Tabs - Guaranteed 1-line layout */}
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto whitespace-nowrap max-w-full scrollbar-none shrink-0">
                            {[
                              { id: 'all', label: 'সকল অর্ডার', count: marketplaceOrders.length },
                              { id: 'pending', label: 'নতুন পেন্ডিং', count: marketplaceOrders.filter(o => o.status === 'pending' || o.status === 'pending_approval').length, badgeColor: 'bg-amber-500 text-white' },
                              { id: 'in_progress', label: 'চলমান কাজ', count: marketplaceOrders.filter(o => o.status === 'in_progress').length, badgeColor: 'bg-blue-500 text-white' },
                              { id: 'in_review', label: 'রিভিউ এর অপেক্ষায়', count: marketplaceOrders.filter(o => o.status === 'in_review' || o.status === 'revision_requested').length, badgeColor: 'bg-purple-500 text-white' },
                              { id: 'completed', label: 'সম্পন্ন', count: marketplaceOrders.filter(o => o.status === 'completed').length, badgeColor: 'bg-emerald-500 text-white' },
                            ].map(tab => (
                              <button
                                key={tab.id}
                                onClick={() => setSellerOrderFilter(tab.id as any)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                                  sellerOrderFilter === tab.id
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-black border border-slate-200 dark:border-slate-700'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                  tab.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}>
                                  {tab.count}
                                </span>
                              </button>
                            ))}
                          </div>
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
                                <p className="text-xs font-bold">এই ফিল্টারে কোনো প্রজেক্ট অর্ডার পাওয়া যায়নি</p>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-4">
                              {filtered.map(ord => {
                                const isPending = ord.status === 'pending' || ord.status === 'pending_approval';
                                const isInProgress = ord.status === 'in_progress';
                                const isInReview = ord.status === 'in_review' || ord.status === 'revision_requested';
                                const isCompleted = ord.status === 'completed';
                                const isExpanded = !!expandedSellerOrders[ord.id];

                                let cardStatusClasses = "border-l-8 border-l-blue-500 bg-gradient-to-r from-blue-500/10 via-slate-50/50 to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                let badgeClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
                                let statusLabel = "কাজ চলছে";
                                let StatusIcon = Clock;

                                if (isPending) {
                                  cardStatusClasses = "border-l-8 border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-slate-50/50 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                                  badgeClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
                                  statusLabel = "পেন্ডিং প্রজেক্ট";
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
                                    className={`border rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 space-y-3.5 hover:shadow-md ${cardStatusClasses}`}
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
                                        {/* Buyer Chat Button (Vibrant Green - সবুজ) */}
                                        <button
                                          onClick={() => openChatWindow({
                                            senderName: ord.buyerName,
                                            senderRole: 'customer',
                                            initialMessage: `আসসালামু আলাইকুম ${ord.buyerName}! প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") নিয়ে কথা বলার জন্য আপনাকে মেসেজ পাঠাচ্ছি।`
                                          })}
                                          className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                          title="বায়ারকে মেসেজ দিন"
                                        >
                                          <MessageCircle className="w-4 h-4 text-slate-950" />
                                          <span>মেসেজ</span>
                                        </button>

                                        {/* Primary Action Button depending on status */}
                                        {isPending && (
                                          <button
                                            onClick={() => updateMarketplaceOrderStatus(ord.id, 'in_progress', 'কাজ শুরু করা হয়েছে।')}
                                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                          >
                                            <Play className="w-4 h-4 fill-slate-950" />
                                            <span>কাজ শুরু করুন</span>
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

                  {/* SUBTAB 4: Bill Cashout / Earnings Management */}

                  {/* SUBTAB 4: Bill Cashout / Earnings Management */}
                  {sellerSubTab === 'earnings' && (
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

                        const sellerPayouts = rawPayouts.length > 0 ? rawPayouts : [
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
                            {/* PROMINENT TOP CASHOUT & BILL APPLICATION ALERT BANNER */}
                            {(cashoutSuccessMsg || sellerPayouts.some(p => p.status === 'Pending')) && (
                              <div className="space-y-3 animate-fadeIn">
                                {cashoutSuccessMsg && (
                                  <div className="p-4 bg-emerald-500/15 text-[#1DB954] font-black text-xs sm:text-sm rounded-2xl border-2 border-[#1DB954]/50 shadow-md flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                      <CheckCircle2 className="w-5 h-5 shrink-0 fill-[#1DB954] text-slate-950 animate-bounce" />
                                      <span>{cashoutSuccessMsg}</span>
                                    </div>
                                    <button onClick={() => setCashoutSuccessMsg('')} className="p-1 hover:bg-emerald-500/20 rounded-lg text-slate-400 hover:text-white transition">✕</button>
                                  </div>
                                )}

                                {sellerPayouts.some(p => p.status === 'Pending') && (
                                  <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-slate-900 border-2 border-amber-500/40 rounded-3xl space-y-3 font-bengali shadow-md">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <div className="flex items-center gap-2.5">
                                        <Clock className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">১টি ক্যাশআউট / বিল আবেদন এডমিন পর্যালোচনায় প্রক্রিয়াধীন রয়েছে</h4>
                                      </div>
                                      <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-xs font-black rounded-full border border-amber-500/30 self-start sm:self-auto">
                                        ⏳ প্রসেসিং চলছে (২৪ ঘণ্টার মধ্যে পরিশোধিত হবে)
                                      </span>
                                    </div>
                                    {(() => {
                                      const pending = sellerPayouts.find(p => p.status === 'Pending');
                                      if (!pending) return null;
                                      return (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-amber-500/20 font-bold">
                                          <div><span className="text-[10px] text-slate-400 block">অনুরোধকৃত পরিমাণ</span><span className="text-base font-black text-[#1DB954]">৳{pending.amount.toLocaleString('bn-BD')}</span></div>
                                          <div><span className="text-[10px] text-slate-400 block">পেমেন্ট মেথড</span><span className="text-slate-800 dark:text-slate-200">{pending.paymentMethod}</span></div>
                                          <div><span className="text-[10px] text-slate-400 block">অ্যাকাউন্ট নম্বর</span><span className="font-mono text-slate-800 dark:text-slate-200">{pending.accountNumber}</span></div>
                                          <div><span className="text-[10px] text-slate-400 block">আবেদনের তারিখ</span><span className="text-slate-500 dark:text-slate-400">{pending.requestedAt}</span></div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Inner Sub-Navigation Tab Bar */}
                            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-3 scrollbar-none">
                              {[
                                { id: 'overview', label: '📊 সামারি ও ব্যালেন্স', desc: 'ব্যালেন্স ও ওভারভিউ' },
                                { id: 'sources', label: '⚡ যৌথ ইনকাম সোর্স', desc: 'কোর্স ও মার্কেটপ্লেস লিষ্ট' },
                                { id: 'withdraw', label: '💳 ক্যাশআউট রিকোয়েস্ট', desc: 'ইনস্ট্যান্ট পেআউট' },
                                { id: 'history', label: '📜 পেআউট হিস্টোরি', desc: 'ফিল্টার ও ট্রানজেকশন' }
                              ].map(sub => {
                                const isActive = payoutSubTab === sub.id;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => setPayoutSubTab(sub.id as any)}
                                    className={`px-4 py-2.5 rounded-2xl transition cursor-pointer text-left shrink-0 border ${
                                      isActive
                                        ? 'bg-[#1DB954] text-slate-950 font-black border-[#1DB954] shadow-md'
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#1DB954]'
                                    }`}
                                  >
                                    <span className="block text-xs font-black">{sub.label}</span>
                                    <span className={`block text-[10px] ${isActive ? 'text-slate-950/80' : 'text-slate-400'}`}>
                                      {sub.desc}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* TAB 1: OVERVIEW */}
                            {payoutSubTab === 'overview' && (
                              <div className="space-y-6 animate-fadeIn">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1 shadow-sm">
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                      <DollarSign className="w-4 h-4 text-[#1DB954]" /> সর্বমোট যৌথ ইনকাম
                                    </span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white block">
                                      ৳{totalEarned.toLocaleString('bn-BD')}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-bold block">
                                      মার্কেটপ্লেস + মেন্টর সার্ভিস আয়
                                    </span>
                                  </div>

                                  <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-[#1DB954] rounded-3xl space-y-1 shadow-md">
                                    <span className="text-xs text-emerald-700 dark:text-[#1DB954] font-bold flex items-center gap-1.5">
                                      <Wallet className="w-4 h-4 text-[#1DB954]" /> ক্যাশআউটযোগ্য ব্যালেন্স
                                    </span>
                                    <span className="text-2xl font-black text-[#1DB954] block">
                                      ৳{availableBalance.toLocaleString('bn-BD')}
                                    </span>
                                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold block">
                                      উইথড্রয়াল প্রস্তুত ফান্ড
                                    </span>
                                  </div>

                                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-1 shadow-sm">
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                      <Clock className="w-4 h-4 text-amber-500" /> এস্ক্রো ও ক্লিয়ারেন্স
                                    </span>
                                    <span className="text-2xl font-black text-amber-500 block">
                                      ৳{pendingEscrow.toLocaleString('bn-BD')}
                                    </span>
                                    <span className="text-[10px] text-amber-500/80 font-bold block">
                                      প্রসেসিং ফান্ড
                                    </span>
                                  </div>
                                </div>

                                {/* Quick Action Banner */}
                                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                                  <div className="space-y-1">
                                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[#1DB954]" />
                                      <span>ইনস্ট্যান্ট ক্যাশআউট সার্ভিস</span>
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                      বিকাশ, নগদ, রকেট বা ব্যাংকে দ্রুত উইথড্রয়াল আবেদন করুন।
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => setPayoutSubTab('sources')}
                                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
                                    >
                                      ইনকাম সোর্স লিষ্ট দেখুন
                                    </button>
                                    <button
                                      onClick={() => {
                                        setPayoutSubTab('withdraw');
                                        setIsCashoutFormOpen(true);
                                      }}
                                      className="px-4 py-2 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                                    >
                                      <CreditCard className="w-4 h-4" />
                                      <span>ক্যাশআউট রিকোয়েস্ট</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* TAB 2: SOURCES (COURSE LIST & MARKETPLACE GIG LIST) */}
                            {payoutSubTab === 'sources' && (
                              <div className="space-y-6 animate-fadeIn">
                                {/* Top Revenue Breakdown Cards */}
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4 shadow-xl">
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                                      <Sparkles className="w-4 h-4 text-[#1DB954]" />
                                      <span>যৌথ ইনকাম সোর্স সামারি</span>
                                    </h3>
                                    <span className="text-[10px] text-[#1DB954] bg-[#1DB954]/10 px-2.5 py-1 rounded-full border border-[#1DB954]/20 font-bold">
                                      একক ওয়ালেটে সমন্বিত
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1.5">
                                      <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                                        <ShoppingBag className="w-3.5 h-3.5 text-purple-400" /> ১. মার্কেটপ্লেস ও প্রজেক্ট
                                      </span>
                                      <div className="text-xl font-black text-white">৳{mktEarned.toLocaleString('bn-BD')}</div>
                                      <p className="text-[11px] text-slate-400">গিগ, কাস্টম অফার ও প্রজেক্ট থেকে অর্জিত আয়।</p>
                                    </div>

                                    <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1.5">
                                      <span className="text-xs font-black text-teal-300 flex items-center gap-1.5">
                                        <GraduationCap className="w-3.5 h-3.5 text-teal-400" /> ২. মেন্টরশিপ ও কোর্স ফি
                                      </span>
                                      <div className="text-xl font-black text-white">৳{mntEarned.toLocaleString('bn-BD')}</div>
                                      <p className="text-[11px] text-slate-400">কোর্স বিক্রয়, মেন্টরিং ও স্টুডেন্ট এনরোলমেন্ট ফি।</p>
                                    </div>

                                    <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-1.5">
                                      <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> ৩. নেট পেআউট ফান্ড
                                      </span>
                                      <div className="text-xl font-black text-[#1DB954]">৳{netEarned.toLocaleString('bn-BD')}</div>
                                      <p className="text-[11px] text-slate-400">৬.৬% প্ল্যাটফর্ম চার্জ কর্তন পরবর্তী নীট ব্যালেন্স।</p>
                                    </div>
                                  </div>
                                </div>

                                {/* SECTION A: COURSE-BY-COURSE EARNINGS & LIVE PROGRESS LIST */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="w-5 h-5 text-teal-500" />
                                      <div>
                                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                          🎓 কোর্স ভিত্তিক লাইভ আয় ও প্রোগ্রেস ট্র্যাকার ({courses.length}টি কোর্স)
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-bold">কোর্সের ক্লাস/কন্টেন্ট সম্পূর্ণ সম্পন্ন হলে তা ওয়ালেট আনিং এ যুক্ত হবে</p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 self-start sm:self-auto">
                                      কোর্স হতে মোট লাইভ আর্নিং: ৳{mntEarned.toLocaleString('bn-BD')}
                                    </span>
                                  </div>

                                  <div className="space-y-3">
                                    {courses.map((course, idx) => {
                                      const stCount = course.enrolledCount || (course as any).studentsCount || (18 - idx * 2);
                                      const crsFee = course.price || 3500;
                                      const crsTotal = stCount * crsFee;
                                      
                                      // Progress logic: course completion rate
                                      const progressPct = idx === 0 ? 100 : idx === 1 ? 85 : idx === 2 ? 60 : 40;
                                      const remainingWork = 100 - progressPct;
                                      const isCompleted = progressPct === 100;
                                      const potentialEarning = Math.round(crsTotal * 1.2); // Potential if more students enroll

                                      return (
                                        <div key={course.id || idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-3 transition hover:border-teal-500/40">
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 font-black flex items-center justify-center shrink-0 border border-teal-500/20 text-xs">
                                                #{idx + 1}
                                              </div>
                                              <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                                    {course.title}
                                                  </h4>
                                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                                    isCompleted 
                                                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-[#1DB954]' 
                                                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                                  }`}>
                                                    {isCompleted ? '✅ ১০০% সম্পন্ন (আর্নিং এ যুক্ত)' : `⏳ চলমান (কাজ ${remainingWork}% বাকি)`}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                                                  <span>এনরোলমেন্ট: <strong className="text-slate-800 dark:text-slate-200">{stCount} জন</strong></span>
                                                  <span>•</span>
                                                  <span>কোর্স ফি: <strong className="text-slate-800 dark:text-slate-200">৳{crsFee.toLocaleString('bn-BD')}</strong></span>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 shrink-0">
                                              <div className="text-left sm:text-right">
                                                <span className="text-[10px] text-slate-400 font-bold block">লাইভ পেতে পারেন / প্রাপ্তি</span>
                                                <span className="text-base font-black text-teal-600 dark:text-teal-400">
                                                  ৳{crsTotal.toLocaleString('bn-BD')}
                                                </span>
                                              </div>
                                              <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-700 hidden sm:block">
                                                <span className="text-[10px] text-slate-400 font-bold block">সাম্ভাব্য ক্যাপ</span>
                                                <span className="text-xs font-black text-slate-500 dark:text-slate-400">
                                                  ৳{potentialEarning.toLocaleString('bn-BD')}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Progress Bar & Remaining Work Indicator */}
                                          <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between text-[11px] font-bold">
                                              <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                <span>কাজ প্রোগ্রেস:</span>
                                                <strong className={isCompleted ? "text-[#1DB954]" : "text-amber-500"}>
                                                  {progressPct}% সম্পূর্ণ
                                                </strong>
                                              </span>
                                              <span className="text-slate-400 text-[10px]">
                                                {isCompleted ? 'কোর্স সিলেবাস ও লাইভ ক্লাস ফুল সম্পন্ন' : `বাকি কাজ: ${remainingWork}% (সম্পন্ন হলে ক্যাশআউট ব্যালেন্স বাড়বে)`}
                                              </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                              <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-[#1DB954]' : 'bg-gradient-to-r from-amber-500 to-teal-500'}`} 
                                                style={{ width: `${progressPct}%` }}
                                              ></div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* SECTION B: MARKETPLACE GIG & PROJECT EARNINGS LIST */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                                    <div className="flex items-center gap-2">
                                      <ShoppingBag className="w-5 h-5 text-purple-500" />
                                      <div>
                                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                          🛍️ প্রজেক্ট ও গিগ ভিত্তিক লাইভ কাজের তালিকা ({sellerGigs.length}টি প্রজেক্ট)
                                        </h3>
                                        <p className="text-[11px] text-slate-400 font-bold">প্রজেক্ট এর ডেলিভারি ও মাইলস্টোন সম্পন্ন হলে ইনকাম একাউন্টে জমা হবে</p>
                                      </div>
                                    </div>
                                    <span className="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 self-start sm:self-auto">
                                      প্রজেক্ট মোট আয়: ৳{mktEarned.toLocaleString('bn-BD')}
                                    </span>
                                  </div>

                                  <div className="space-y-3">
                                    {sellerGigs.map((gig, idx) => {
                                      const ordersCount = gig.salesCount || (15 - idx * 3);
                                      const gigPrice = gig.price || gig.packages?.basic?.price || 2500;
                                      const gigTotal = ordersCount * gigPrice;

                                      // Project Progress logic
                                      const projProgress = idx === 0 ? 100 : idx === 1 ? 90 : 70;
                                      const remainingProj = 100 - projProgress;
                                      const isProjDone = projProgress === 100;

                                      return (
                                        <div key={gig.id || idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-3 transition hover:border-purple-500/40">
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-start gap-3 flex-1">
                                              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 font-black flex items-center justify-center shrink-0 border border-purple-500/20 text-xs">
                                                #{idx + 1}
                                              </div>
                                              <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                  <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                                    {gig.title}
                                                  </h4>
                                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                                    isProjDone 
                                                      ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' 
                                                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                                  }`}>
                                                    {isProjDone ? '✅ প্রজেক্ট সম্পন্ন (আর্নিং যুক্ত)' : `⏳ প্রজেক্ট বাকি ${remainingProj}%`}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                                                  <span>ক্যাটাগরি: <strong className="text-purple-500">{gig.category || 'Programming'}</strong></span>
                                                  <span>•</span>
                                                  <span>অর্ডার ডেলিভারি: <strong className="text-slate-800 dark:text-slate-200">{ordersCount}টি</strong></span>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-slate-200 dark:border-slate-700 pt-2 sm:pt-0 shrink-0">
                                              <div>
                                                <span className="text-[10px] text-slate-400 font-bold block text-left sm:text-right">মোট প্রজেক্ট ফি</span>
                                                <span className="text-base font-black text-purple-600 dark:text-purple-400">
                                                  ৳{gigTotal.toLocaleString('bn-BD')}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Progress bar */}
                                          <div className="space-y-1 bg-white dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between text-[11px] font-bold">
                                              <span className="text-slate-600 dark:text-slate-300">
                                                প্রজেক্ট মাইলস্টোন প্রোগ্রেস: <strong className="text-purple-500">{projProgress}%</strong>
                                              </span>
                                              <span className="text-slate-400 text-[10px]">
                                                {isProjDone ? 'ডেলিভারি অনুমোদিত ও পেমেন্ট ওয়ালেটে যুক্ত' : `অবশিষ্ট কাজ ${remainingProj}% শেষ হলে মূলধনে যোগ হবে`}
                                              </span>
                                            </div>
                                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                              <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${projProgress}%` }}></div>
                                            </div>
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

                            {/* TAB 4: HISTORY (WITH LAST CASHOUT SUMMARY AND FILTERS) */}
                            {payoutSubTab === 'history' && (
                              <div className="space-y-5 animate-fadeIn">
                                {/* LAST CASHOUT & SUMMARY STAT CARDS */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* CARD 1: LAST CASHOUT SUMMARY */}
                                  <div className="p-5 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-slate-900 border-2 border-[#1DB954]/40 rounded-3xl space-y-2 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-black text-[#1DB954] flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-[#1DB954]" /> সর্বশেষ ক্যাশআউট
                                      </span>
                                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#1DB954]/20 text-[#1DB954] rounded-full">
                                        {lastCashout ? lastCashout.paymentMethod : 'N/A'}
                                      </span>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                                      {lastCashout ? `৳${lastCashout.amount.toLocaleString('bn-BD')}` : '৳০'}
                                    </div>
                                    {lastCashout && (
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold space-y-0.5">
                                        <p>নম্বর: <span className="font-mono text-slate-700 dark:text-slate-200">{lastCashout.accountNumber}</span></p>
                                        <p>তারিখ: {lastCashout.requestedAt}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* CARD 2: TOTAL APPROVED WITHDRAWALS */}
                                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-sm">
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                      <Wallet className="w-4 h-4 text-emerald-500" /> সর্বমোট সফল পেআউট
                                    </span>
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                                      ৳{totalApprovedPaid.toLocaleString('bn-BD')}
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold block">
                                      {approvedPayouts.length}টি সফল ক্যাশআউট সম্পন্ন
                                    </span>
                                  </div>

                                  {/* CARD 3: PENDING REQUESTS */}
                                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2 shadow-sm">
                                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                      <Clock className="w-4 h-4 text-amber-500" /> প্রসেসিংয়ে থাকা আবেদন
                                    </span>
                                    <div className="text-2xl font-black text-amber-500">
                                      {sellerPayouts.filter(p => p.status === 'Pending').length}টি রিকোয়েস্ট
                                    </div>
                                    <span className="text-[10px] text-amber-500/80 font-bold block">
                                      ৳{sellerPayouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0).toLocaleString('bn-BD')} পেন্ডিং
                                    </span>
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
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                                            {filteredPayouts.map(p => (
                                              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
                                                    p.status === 'Approved' || p.status === 'Paid'
                                                      ? 'bg-emerald-500/20 text-[#1DB954]'
                                                      : p.status === 'Pending'
                                                      ? 'bg-amber-500/20 text-amber-500'
                                                      : 'bg-rose-500/20 text-rose-500'
                                                  }`}>
                                                    {p.status === 'Approved' || p.status === 'Paid' ? '✓ পরিশোধিত' : p.status === 'Pending' ? '⏳ পেন্ডিং' : p.status}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
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
          
          {/* CATALOG SECTION (HERO + RECOMMENDATIONS + PRO SERVICES + SUBTABS) - ONLY IN MARKETPLACE BROWSE MODE */}
          {(activeSubTab === 'gigs' || activeSubTab === 'ptenit-services' || activeSubTab === 'courses' || activeSubTab === 'jobs') && (
            <div className="space-y-10">
              {/* WELCOME BACK USER HERO BANNER */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Welcome back, <span className="text-[#1DB954]">{currentUser?.name || 'Mds Kazi Sohag'}</span>
                </h1>

                {/* TWO RECOMMENDED ACTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* CARD 1: POST A PROJECT BRIEF */}
                  <div className="p-5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#1DB954]/10 dark:bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post a project brief</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Get tailored offers for your needs.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCreateGigModalOpen(true)}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1DB954] dark:hover:border-[#1DB954] text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap"
                    >
                      Get started
                    </button>
                  </div>

                  {/* CARD 2: TAILOR PTENit TO YOUR NEEDS */}
                  <div className="p-5 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <SlidersHorizontal className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tailor PTENit to your needs</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Add info to get better recommendations.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditProfileModalOpen(true)}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#1DB954] dark:hover:border-[#1DB954] text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition cursor-pointer whitespace-nowrap"
                    >
                      Add your info
                    </button>
                  </div>

                </div>
              </div>

              {/* SECTION 1: BASED ON WHAT YOU MIGHT BE LOOKING FOR */}
              <div className="space-y-4">
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
                  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {filteredGigs.slice(0, 3).map(gig => (
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
              <div className="space-y-4 font-bengali">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    আপনার পছন্দ হতে পারে এমন গিগসমূহ
                  </h2>
                  <button
                    onClick={() => setActiveSubTab('gigs')}
                    className="text-sm font-bold text-[#1DB954] hover:underline cursor-pointer"
                  >
                    সবগুলো দেখুন →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
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
              <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6 border border-slate-800 shadow-xl font-bengali">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/15 border border-[#1DB954]/30 px-3.5 py-1 rounded-full">
                      PTENit Verified Pro
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mt-2">ভেরিফায়েড প্রফেশনাল টিম ও সার্ভিসেস</h2>
                    <p className="text-sm text-slate-300 mt-1 font-medium">হাই-কোয়ালিটি প্রজেক্টের জন্য সেরা ভেরিফায়েড ডেভেলপার ও ডিজাইনার।</p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('gigs')}
                    className="text-sm font-bold text-[#1DB954] hover:underline hidden sm:block cursor-pointer"
                  >
                    সবগুলো দেখুন →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {filteredGigs.slice(0, 3).map(gig => (
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
              <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 pt-4">
                <button
                  onClick={() => setActiveSubTab('gigs')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'gigs'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Order Catalog ({filteredGigs.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('ptenit-services')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'ptenit-services'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  🏢 PTENit এজেন্সির সার্ভিসসমূহ ({services.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('courses')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSubTab === 'courses'
                      ? 'bg-[#1DB954] text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  🎓 PTENit একাডেমি কোর্সসমূহ ({courses.length})
                </button>

                <button
                  onClick={() => setActiveSubTab('jobs')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
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
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
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

          {/* MY ACTIVE ORDERS TAB (LOGGED OUT VIEW) */}
          {activeSubTab === 'my-orders' && !currentUser && (
            <div className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-4 font-bengali max-w-md mx-auto my-8 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                আমার অর্ডারসমূহ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                আপনার ক্রয়কৃত সার্ভিস ও অর্ডারসমূহ দেখতে অনুগ্রহ করে লগইন করুন।
              </p>
              <button
                onClick={openAuthModal}
                className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow inline-flex items-center gap-2"
              >
                <span>লগইন / সাইন ইন করুন</span>
              </button>
            </div>
          )}

          {/* MY ACTIVE ORDERS TAB (LOGGED IN VIEW) */}
          {(initialCategory === 'my-orders' || activeSubTab === 'my-orders' || activeSubTab === 'overview' || activeSubTab === 'my-courses' || activeSubTab === 'saved_gigs' || activeSubTab === 'settings' || activeSubTab === 'post-project' || activeSubTab === 'public-offers') && currentUser && (
            <div id="my-orders-section" className="space-y-4 font-bengali animate-fadeIn">
              
              {/* STICKY TOP HEADER & FILTER CONTAINER (WON'T SCROLL AWAY) */}
              <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md pt-2 pb-3 space-y-3 -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                
                {/* DEDICATED CLEAN BUYER & STUDENT DASHBOARD TOP HEADER */}
                <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-5 border border-slate-800 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1DB954] text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md shadow-[#1DB954]/20">
                        <LayoutDashboard className="w-5 h-5 text-slate-950" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h1 className="text-lg sm:text-xl font-black text-white">
                            গ্রাহক ড্যাশবোর্ড
                          </h1>
                          <span className="px-2 py-0.5 bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-extrabold rounded-full border border-[#1DB954]/40">
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
                          setIsInboxModalOpen(!isInboxModalOpen);
                          setIsNotificationsOpen(false);
                        }}
                        className={`relative p-2 rounded-xl transition cursor-pointer flex items-center justify-center border ${
                          isInboxModalOpen
                            ? 'bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
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

              {/* 4 COLUMNS GRID FOR BUYER DASHBOARD: LEFT SIDEBAR + RIGHT CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2 font-bengali">
                
                {/* Left Col: Buyer Profile Navigation Menu & Quick Stats */}
                <div className="lg:col-span-1 space-y-6">
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

                        {/* 3-Dot Options Menu */}
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

                    {/* Buyer Navigation Sidebar Menu */}
                    <div className="space-y-3 pt-1 font-bengali">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">গ্রাহক নেভিগেশন মেনু</p>
                      
                      <div className="space-y-2">
                        {/* 1. বায়ার & স্টুডেন্ট অল-ইন-ওয়ান ড্যাশবোর্ড */}
                        <button
                          onClick={() => {
                            setActiveSubTab('overview');
                          }}
                          className={`w-full p-3.5 rounded-2xl text-left text-xs font-black transition flex items-center justify-between gap-2 cursor-pointer ${
                            activeSubTab === 'overview'
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <LayoutDashboard className="w-4.5 h-4.5 text-[#1DB954]" />
                            <span className="text-sm">ওভারভিউ</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1DB954]/20 text-[#1DB954]">
                            ড্যাশবোর্ড
                          </span>
                        </button>

                        {/* 2. আমার কোর্স সমূহ (সদাসর্বদা দৃশ্যমান) */}
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

                        {/* Switch to Seller Mode Shortcut */}
                        <button
                          onClick={() => setViewMode('selling')}
                          className="w-full p-3 rounded-2xl text-left text-xs font-black text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between transition cursor-pointer mt-4"
                        >
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>সেলার মোডে সুইচ করুন</span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Main Content Area */}
                <div className="lg:col-span-3 space-y-5 font-bengali">

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
                                    {allBuyerOrders[0]?.title}
                                  </p>
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                                    <span>মোট প্রজেক্ট: {allBuyerOrders.length}টি</span>
                                    <span className="font-black text-[#1DB954] uppercase">{allBuyerOrders[0]?.status === 'completed' ? 'সম্পন্ন' : 'চলমান'}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    এখনো কোনো প্রজেক্ট অর্ডার দেওয়া হয়নি।
                                  </p>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setActiveSubTab('my-orders');
                                setBuyerOrderStatusFilter('all');
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-[#1DB954] text-slate-950 font-black text-xs hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>প্রজেক্ট অর্ডার ট্র্যাকিং (সব দেখুন)</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB VIEW: STUDENT DASHBOARD */}
                    {activeSubTab === 'my-courses' && (
                      <div className="animate-fadeIn font-bengali space-y-3">
                        <StudentDashboard
                          hideHeaderBanner={true}
                          hideMenubar={false}
                          initialSubTab="my-courses"
                          onStartLearning={(courseId) => {
                            if (onStartLearning) {
                              onStartLearning(courseId);
                            } else if (setActiveTab) {
                              setActiveTab('learning');
                            }
                          }}
                          onViewCertificate={(code) => {
                            alert(`আপনার ডিজিটাল সার্টিফিকেট কোড: ${code}`);
                          }}
                          setActiveTab={(tab) => {
                            if (setActiveTab) {
                              setActiveTab(tab);
                            }
                          }}
                        />
                      </div>
                    )}



                    {/* SUBTAB VIEW: MARKETPLACE ORDERS HEADER */}
                    {activeSubTab === 'my-orders' && activeSubTab !== 'saved_gigs' && activeSubTab !== 'settings' && (
                      <div className="space-y-4 pt-2">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <ShoppingBag className="w-4 h-4 text-[#1DB954]" />
                              <span>আমার ক্রয়কৃত প্রজেক্ট ও সার্ভিসসমূহ</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              প্রজেক্টের লাইভ প্রোগ্রেস ট্র্যাকিং এবং এস্ক্রো সুরক্ষায় ফান্ড রিলিজ
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
                              {[
                                { id: 'all', label: 'সকল', count: allBuyerOrders.length },
                                { id: 'in_progress', label: 'চলমান', count: allBuyerOrders.filter(o => o.status === 'in_progress' && (!o.isPublicOffer || (o.sellerId && o.sellerId !== 'pending_expert' && o.sellerId !== 'ptenit-agency'))).length },
                                { id: 'in_review', label: 'রিভিউ', count: allBuyerOrders.filter(o => o.status === 'in_review').length },
                                { id: 'completed', label: 'সম্পন্ন', count: allBuyerOrders.filter(o => o.status === 'completed').length },
                                { id: 'public_projects', label: 'পাবলিক করা পোস্ট', count: (customerProjects || []).length },
                              ].map(tab => {
                                const isSel = buyerOrderStatusFilter === tab.id;
                                let bgClass = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50';
                                let badgeClass = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

                                if (isSel) {
                                  if (tab.id === 'all') {
                                    bgClass = 'bg-blue-600 text-white shadow-md font-black';
                                    badgeClass = 'bg-white/20 text-white font-black';
                                  } else if (tab.id === 'in_progress') {
                                    bgClass = 'bg-[#1DB954] text-slate-950 shadow-md font-black';
                                    badgeClass = 'bg-slate-950/20 text-slate-950 font-black';
                                  } else if (tab.id === 'in_review') {
                                    bgClass = 'bg-purple-600 text-white shadow-md font-black';
                                    badgeClass = 'bg-white/20 text-white font-black';
                                  } else if (tab.id === 'completed') {
                                    bgClass = 'bg-teal-600 text-white shadow-md font-black';
                                    badgeClass = 'bg-white/20 text-white font-black';
                                  } else if (tab.id === 'public_projects') {
                                    bgClass = 'bg-amber-500 text-slate-950 shadow-md font-black';
                                    badgeClass = 'bg-slate-950/20 text-slate-950 font-black';
                                  }
                                }

                                return (
                                  <button
                                    key={tab.id}
                                    onClick={() => {
                                      setBuyerOrderStatusFilter(tab.id as any);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${bgClass}`}
                                  >
                                    <span>{tab.label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${badgeClass}`}>
                                      {tab.count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => setIsPostProjectModalOpen(true)}
                              className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                              title="সকল এক্সপার্টদের অফার করার জন্য নতুন প্রজেক্ট পোস্ট করুন"
                            >
                              <PlusCircle className="w-4 h-4" />
                              <span>+ পাবলিক প্রজেক্ট পোস্ট</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. SUBTAB VIEW: SAVED GIGS */}
                    {activeSubTab === 'saved_gigs' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <Bookmark className="w-4.5 h-4.5 text-rose-500" />
                              <span>আপনার সংরক্ষিত প্রজেক্টসমূহ ({savedGigs.length}টি)</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              পছন্দ করে রাখা সার্ভিসগুলো পরবর্তীতে সরাসরি অর্ডার করতে পারেন
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveSubTab('gigs')}
                            className="px-3 py-1.5 bg-[#1DB954]/15 text-[#1DB954] hover:bg-[#1DB954]/25 text-xs font-black rounded-xl transition cursor-pointer"
                          >
                            মার্কেটপ্লেসে প্রজেক্ট খুঁজুন
                          </button>
                        </div>

                        {savedGigs.length === 0 ? (
                          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3">
                            <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              আপনার বুকমার্ক করা কোনো প্রজেক্ট নেই।
                            </p>
                            <button
                              onClick={() => setActiveSubTab('gigs')}
                              className="px-4 py-2 bg-[#1DB954] text-slate-950 text-xs font-black rounded-xl hover:bg-[#19a34a] transition cursor-pointer"
                            >
                              মার্কেটপ্লেস প্রজেক্টসমূহ দেখুন
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {savedGigs.map(gig => (
                              <div
                                key={gig.id}
                                onClick={() => setSelectedGig(gig)}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                              >
                                <div className="relative aspect-video">
                                  <img src={gig.thumbnail} alt={gig.title} className="w-full h-full object-cover" />
                                  <button
                                    onClick={(e) => toggleFavorite(gig.id, e)}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/80 text-rose-500 hover:scale-110 transition cursor-pointer"
                                  >
                                    <Bookmark className="w-4 h-4 fill-rose-500" />
                                  </button>
                                </div>
                                <div className="p-4 space-y-2">
                                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2">
                                    {gig.title}
                                  </h4>
                                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-slate-500 font-medium">{gig.category}</span>
                                    <span className="font-black text-[#1DB954]">
                                      ৳{(gig.packages?.basic?.price || gig.price || 2500).toLocaleString('bn-BD')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. SUBTAB VIEW: PROFILE & SETTINGS */}
                    {activeSubTab === 'settings' && (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 animate-fadeIn">
                        <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <Settings className="w-5 h-5 text-[#1DB954]" />
                              <span>বায়ার অ্যাকাউন্ট সেটিং ও প্রোফাইল এডিট</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              আপনার বায়ার প্রোফাইলের নাম, যোগাযোগ এবং নোটিফিকেশন সেটিংস আপডেট করুন
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            updateProfile({ name: editProfileName, bio: editProfileBio });
                            setEditProfileSuccess(true);
                            setTimeout(() => setEditProfileSuccess(false), 3000);
                          }}
                          className="space-y-4 max-w-lg"
                        >
                          {editProfileSuccess && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              <span>বায়ার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">বায়ার নাম</label>
                            <input
                              type="text"
                              value={editProfileName}
                              onChange={(e) => setEditProfileName(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ইমেইল ঠিকানা</label>
                            <input
                              type="email"
                              disabled
                              value={currentUser?.email || 'ptenitbuyer@gmail.com'}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-500 cursor-not-allowed"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">বায়ার নোট/বায়ো</label>
                            <textarea
                              rows={3}
                              value={editProfileBio}
                              onChange={(e) => setEditProfileBio(e.target.value)}
                              placeholder="আপনার কোম্পানি বা আপনার সার্ভিস চাহিদা সম্পর্কে কিছু লিখুন..."
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-sm"
                          >
                            সেটিং সেভ করুন
                          </button>
                        </form>
                      </div>
                    )}

                    {/* 5. MAIN ORDERS LIST VIEW */}
                    {(activeSubTab === 'my-orders' || (activeSubTab === 'overview' && (overviewInnerTab === 'all' || overviewInnerTab === 'orders'))) && activeSubTab !== 'saved_gigs' && activeSubTab !== 'settings' && (
                      <div className="space-y-4">
                        {(() => {
                          const filteredOrders = allBuyerOrders.filter(ord => {
                            if (buyerOrderStatusFilter === 'all') return true;
                            if (buyerOrderStatusFilter === 'public_projects') {
                              return ord.isPublicOffer || ord.type === 'custom_agency_order' || ord.id.startsWith('proj-');
                            }
                            if (buyerOrderStatusFilter === 'in_progress') {
                              if (ord.isPublicOffer || ord.type === 'custom_agency_order') {
                                return ord.status === 'in_progress' && ord.sellerId && ord.sellerId !== 'pending_expert' && ord.sellerId !== 'ptenit-agency';
                              }
                              return ord.status === 'in_progress';
                            }
                            return ord.status === buyerOrderStatusFilter;
                          });

                          if (filteredOrders.length === 0) {
                            return (
                              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-3">
                                <ShoppingBag className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                  এই ক্যাটাগরিতে আপনার কোনো প্রজেক্ট অর্ডার পাওয়া যায়নি।
                                </p>
                                <button
                                  onClick={() => setBuyerOrderStatusFilter('all')}
                                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                                >
                                  সকল প্রজেক্ট প্রদর্শন করুন
                                </button>
                              </div>
                            );
                          }

                          return filteredOrders.map(ord => {
                        let progressPercent = 65;
                        if (ord.status === 'completed') progressPercent = 100;
                        if (ord.status === 'in_review') progressPercent = 90;
                        if (ord.status === 'revision_requested') progressPercent = 75;
                        if (ord.status === 'pending_approval') progressPercent = 25;
                        if (ord.status === 'cancelled') progressPercent = 0;

                        const isExpanded = !!expandedBuyerOrders[ord.id];

                        let cardStatusClasses = "border-l-8 border-l-blue-500 bg-gradient-to-r from-blue-500/10 via-slate-50/50 to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                        let badgeClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
                        let statusLabel = "কাজ চলছে";
                        let StatusIcon = Clock;

                        if (ord.status === 'in_review') {
                          cardStatusClasses = "border-l-8 border-l-purple-500 bg-gradient-to-r from-purple-500/10 via-slate-50/50 to-white dark:from-purple-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                          badgeClasses = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
                          statusLabel = "ডেলিভারি রিভিউধীন";
                          StatusIcon = FileText;
                        } else if (ord.status === 'completed') {
                          cardStatusClasses = "border-l-8 border-l-[#1DB954] bg-gradient-to-r from-emerald-500/10 via-slate-50/50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                          badgeClasses = "bg-emerald-500/10 text-emerald-700 dark:text-[#1DB954] border-emerald-500/30";
                          statusLabel = "সম্পন্ন প্রজেক্ট";
                          StatusIcon = ShieldCheck;
                        } else if (ord.status === 'cancelled') {
                          cardStatusClasses = "border-l-8 border-l-rose-500 bg-gradient-to-r from-rose-500/10 via-slate-50/50 to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                          badgeClasses = "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
                          statusLabel = "বাতিলকৃত প্রজেক্ট";
                          StatusIcon = ShieldAlert;
                        } else if (ord.status === 'revision_requested') {
                          cardStatusClasses = "border-l-8 border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-slate-50/50 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                          badgeClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
                          statusLabel = "রিভিশন অনুরোধ";
                          StatusIcon = RotateCcw;
                        }

                        const isPublicProject = ord.isPublicOffer || ord.type === 'custom_agency_order';
                        const isReceivedByExpert = isPublicProject && ord.sellerId && ord.sellerId !== 'pending_expert' && ord.sellerId !== 'ptenit-agency' && ord.status === 'in_progress';

                        if (isPublicProject) {
                          if (isReceivedByExpert) {
                            statusLabel = "অর্ডারে কাজ চলছে";
                            badgeClasses = "bg-emerald-500/10 text-emerald-700 dark:text-[#1DB954] border-emerald-500/30 font-black";
                            cardStatusClasses = "border-l-8 border-l-[#1DB954] bg-gradient-to-r from-emerald-500/10 via-slate-50/50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                            StatusIcon = CheckCircle2;
                          } else if (ord.status === 'completed') {
                            statusLabel = "সম্পন্ন প্রজেক্ট";
                            badgeClasses = "bg-emerald-500/10 text-emerald-700 dark:text-[#1DB954] border-emerald-500/30 font-black";
                            StatusIcon = ShieldCheck;
                          } else if (ord.status === 'in_review') {
                            statusLabel = "রিভিউধীন";
                            badgeClasses = "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 font-black";
                            StatusIcon = FileText;
                          } else {
                            statusLabel = "অপেক্ষা...";
                            badgeClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-black";
                            cardStatusClasses = "border-l-8 border-l-amber-500 bg-gradient-to-r from-amber-500/10 via-slate-50/50 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-slate-200 dark:border-slate-800";
                            StatusIcon = Clock;
                            progressPercent = 10;
                          }
                        }

                        return (
                          <div
                            key={ord.id}
                            className={`border rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 space-y-3.5 hover:shadow-md ${cardStatusClasses}`}
                          >
                            {/* Top Main Details Bar with LARGER TEXT */}
                            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                                  <span className="px-2.5 py-1 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 font-mono text-xs font-black rounded-lg shrink-0 border border-slate-700 shadow-2xs">
                                    #{ord.id.slice(-8).toUpperCase()}
                                  </span>
                                  <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-[260px] sm:max-w-[360px]" title={ord.title}>
                                      {ord.title}
                                    </h3>
                                    {isPublicProject && (
                                      <div className="space-y-1 mt-0.5">
                                        <div className="flex items-center gap-1.5">
                                          {isReceivedByExpert ? (
                                            <span className="text-[11px] font-black text-[#1DB954] flex items-center gap-1">
                                              <CheckCircle2 className="w-3 h-3 text-[#1DB954]" />
                                              <span>অর্ডারে কাজ চলছে • আপনার অফার করা প্রজেক্ট (রিসিভড)</span>
                                            </span>
                                          ) : (
                                            <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                              <Clock className="w-3 h-3 text-amber-500" />
                                              <span>অপেক্ষা... • কেউ রিসিভ না করা পর্যন্ত অপেক্ষা করুন</span>
                                            </span>
                                          )}
                                        </div>

                                        {/* Quick Reach & Like Stats Chips */}
                                        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                                          <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black flex items-center gap-1 border border-blue-500/20">
                                            <Eye className="w-3 h-3" />
                                            <span>{ord.reachCount || 42} রিচ</span>
                                          </span>
                                          <button
                                            type="button"
                                            onClick={(e) => handleToggleLikeOrder(ord.id, e)}
                                            className={`px-2 py-0.5 rounded-lg text-[11px] font-black flex items-center gap-1 border transition cursor-pointer ${
                                              ord.isLikedByBuyer
                                                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                                            }`}
                                            title="লাইক দিন"
                                          >
                                            <Heart className={`w-3 h-3 ${ord.isLikedByBuyer ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                                            <span>{ord.likesCount || 14} লাইক</span>
                                          </button>
                                          {ord.budgetRange && (
                                            <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[11px] font-black flex items-center gap-1 border border-purple-500/20">
                                              <TrendingUp className="w-3 h-3 text-purple-500" />
                                              <span>{ord.budgetRange}</span>
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <span className="hidden sm:inline-block px-3 py-1 bg-[#1DB954]/15 text-[#1DB954] text-xs font-black rounded-full border border-[#1DB954]/30 shrink-0">
                                    {ord.category}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5 shrink-0 ml-auto">
                                  <div className="text-right">
                                    <span className="text-base sm:text-lg font-black text-[#1DB954] block leading-none">
                                      ৳{(ord.amount || 0).toLocaleString('bn-BD')}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">এস্ক্রো গ্যারান্টি পেমেন্ট</span>
                                  </div>

                                  {/* Distinct Large Status Badge - Simple & Clean */}
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeClasses}`}>
                                    <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                    <span>{statusLabel}</span>
                                  </span>

                                  {/* 3-Dot Options Menu Button for Public Project Posts */}
                                  {isPublicProject && (
                                    <div className="relative shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpen3DotMenuId(open3DotMenuId === ord.id ? null : ord.id);
                                        }}
                                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                                        title="পোস্ট ম্যানেজমেন্ট অপশনস (৩-ডট মেনু)"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </button>

                                      {/* Dropdown Menu */}
                                      {open3DotMenuId === ord.id && (
                                        <>
                                          <div
                                            className="fixed inset-0 z-30"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpen3DotMenuId(null);
                                            }}
                                          />

                                          <div className="absolute right-0 top-9 z-40 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1.5 animate-fadeIn font-bengali text-xs">
                                            <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                              <span className="font-black text-slate-800 dark:text-slate-200">পোস্ট অপশনস</span>
                                              {isReceivedByExpert ? (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#1DB954] text-[10px] font-black">
                                                  রিসিভড
                                                </span>
                                              ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black">
                                                  অপেক্ষা...
                                                </span>
                                              )}
                                            </div>

                                            {/* Reach Stats */}
                                            <div className="px-3.5 py-2 flex items-center justify-between text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/60">
                                              <div className="flex items-center gap-2">
                                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="font-bold">রিচ সংখ্যা:</span>
                                              </div>
                                              <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg">
                                                {ord.reachCount || 42} জন
                                              </span>
                                            </div>

                                            {/* Like Toggle */}
                                            <button
                                              type="button"
                                              onClick={(e) => handleToggleLikeOrder(ord.id, e)}
                                              className="w-full px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition cursor-pointer text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/60"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Heart className={`w-3.5 h-3.5 ${ord.isLikedByBuyer ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                                                <span className="font-bold">লাইক দিন:</span>
                                              </div>
                                              <span className="font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                {ord.likesCount || 14} {ord.isLikedByBuyer && '✓'}
                                              </span>
                                            </button>

                                            {/* Action 1: Raise Budget */}
                                            {!isReceivedByExpert ? (
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleOpenRaiseBudgetModal(ord);
                                                }}
                                                className="w-full px-3.5 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2 text-emerald-600 dark:text-[#1DB954] font-black transition cursor-pointer"
                                              >
                                                <TrendingUp className="w-3.5 h-3.5 text-[#1DB954]" />
                                                <span>বাজেট বৃদ্ধি করুন (বাজেট আপ)</span>
                                              </button>
                                            ) : (
                                              <div
                                                className="w-full px-3.5 py-2 flex items-center justify-between text-slate-400 dark:text-slate-500 font-semibold opacity-60 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50"
                                                title="কেউ রিসিভ করায় বাজেট বৃদ্ধি সম্ভব নয়"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                  <span>বাজেট বৃদ্ধি</span>
                                                </div>
                                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">লকড</span>
                                              </div>
                                            )}

                                            {/* Action 2: Edit Post */}
                                            {!isReceivedByExpert ? (
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleOpenEditModal(ord);
                                                }}
                                                className="w-full px-3.5 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black transition cursor-pointer"
                                              >
                                                <Edit className="w-3.5 h-3.5 text-indigo-500" />
                                                <span>পোস্ট এডিট করুন</span>
                                              </button>
                                            ) : (
                                              <div
                                                className="w-full px-3.5 py-2 flex items-center justify-between text-slate-400 dark:text-slate-500 font-semibold opacity-60 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50"
                                                title="কেউ রিসিভ করায় এডিট সম্ভব নয়"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                  <span>পোস্ট এডিট</span>
                                                </div>
                                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">লকড</span>
                                              </div>
                                            )}

                                            {/* Action 3: Delete Post */}
                                            {!isReceivedByExpert ? (
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeletingOrder(ord);
                                                  setOpen3DotMenuId(null);
                                                }}
                                                className="w-full px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black transition cursor-pointer border-t border-slate-100 dark:border-slate-800"
                                              >
                                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                <span>পোস্ট ডিলিট করুন</span>
                                              </button>
                                            ) : (
                                              <div
                                                className="w-full px-3.5 py-2 flex items-center justify-between text-slate-400 dark:text-slate-500 font-semibold opacity-60 cursor-not-allowed bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800"
                                                title="কেউ রিসিভ করায় ডিলিট সম্ভব নয়"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                                  <span>পোস্ট ডিলিট</span>
                                                </div>
                                                <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">লকড</span>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Progress Bar, Order Time & Seller Info Row */}
                              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 text-sm flex-wrap sm:flex-nowrap">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-wrap sm:flex-nowrap">
                                  {/* Seller Avatar & Name */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <img
                                      src={ord.sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                                      alt={ord.sellerName}
                                      className="w-7 h-7 rounded-full object-cover border-2 border-[#1DB954]"
                                    />
                                    <div className="min-w-0">
                                      <span className="text-[10px] text-slate-400 font-bold block leading-none">সেলার</span>
                                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px]">
                                        {ord.sellerName}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Progress Bar Indicator */}
                                  <div className="flex items-center gap-2 w-28 sm:w-36 shrink-0">
                                    <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                      <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-[#1DB954] rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-black font-mono text-[#1DB954]">{progressPercent}%</span>
                                  </div>

                                  {/* Clean, Simple Order Time - No heavy background color */}
                                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold shrink-0 flex items-center gap-1.5 px-1 py-0.5">
                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{getTimeAgoBengali(ord.createdAt)}</span>
                                  </span>
                                </div>

                                {/* Action Buttons for Buyer: Green Message Button & Red Details Button */}
                                <div className="flex items-center gap-2 shrink-0 ml-auto">
                                  {/* Seller Chat Button (Vibrant Green - সবুজ) */}
                                  {(() => {
                                    const isRead = readOrderIds[ord.id];
                                    const defaultUnread = ord.status === 'in_review' ? 2 : ord.status === 'in_progress' ? 1 : 0;
                                    const unreadCount = isRead ? 0 : defaultUnread;
                                    
                                    return (
                                      <button
                                        onClick={() => {
                                          setReadOrderIds(prev => ({ ...prev, [ord.id]: true }));
                                          openChatWindow({
                                            senderName: ord.sellerName,
                                            senderRole: 'seller',
                                            senderAvatar: ord.sellerAvatar,
                                            initialMessage: `আসসালামু আলাইকুম ${ord.sellerName}! আমি আমার প্রজেক্ট #${ord.id.slice(-6)} ("${ord.title}") এর জন্য যোগাযোগ করছি।`
                                          });
                                        }}
                                        className="relative px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                        title="সেলারকে মেসেজ দিন"
                                      >
                                        <div className="relative">
                                          <MessageSquare className="w-4 h-4 text-slate-950" />
                                          {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                                          )}
                                        </div>
                                        <span>মেসেজ</span>
                                        {unreadCount > 0 && (
                                          <span className="ml-0.5 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-black rounded-full shadow-2xs">
                                            {unreadCount}
                                          </span>
                                        )}
                                      </button>
                                    );
                                  })()}

                                  {/* Download file button */}
                                  {ord.deliveryFileUrl && (
                                    <a
                                      href={ord.deliveryFileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                                    >
                                      <Download className="w-4 h-4" />
                                      <span>ফাইল</span>
                                    </a>
                                  )}

                                  {/* Approve button if in review */}
                                  {ord.status === 'in_review' && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`আপনি কি নিশ্চিত যে "${ord.title}" প্রজেক্টটি সঠিকভাবে বুঝে পেয়েছেন এবং সেলারকে ৳${ord.amount.toLocaleString('bn-BD')} এস্ক্রো পেমেন্ট রিলিজ করতে চান?`)) {
                                          approveOrderAndReleaseEscrow(ord.id, 5, "চমৎকার প্রজেক্ট তৈরি করেছেন! ১০০% সন্তুষ্ট।");
                                          alert("অভিনন্দন! সেলারকে পেমেন্ট রিলিজ করা হয়েছে এবং প্রজেক্টটি সফলভাবে কমপ্লিট হিসেবে মার্ক করা হয়েছে।");
                                        }
                                      }}
                                      className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-[#19a34a] text-slate-950 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                                    >
                                      <Check className="w-4 h-4" />
                                      <span>এপ্রুভ করুন</span>
                                    </button>
                                  )}

                                  {/* Expand Toggle Button (Red - লাল) */}
                                  <button
                                    onClick={() => setExpandedBuyerOrders(prev => ({ ...prev, [ord.id]: !prev[ord.id] }))}
                                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                                  >
                                    <span>{isExpanded ? 'সংক্ষেপ' : 'বিস্তারিত'}</span>
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Buyer Details Section */}
                              {isExpanded && (
                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn text-xs sm:text-sm">
                                  {/* 4-Step Interactive Step Timeline */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-bold p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <div className={`p-2 rounded-xl flex items-center gap-2 ${
                                      progressPercent >= 25
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                    }`}>
                                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                                      <span>১. অর্ডার ও এস্ক্রো জমা</span>
                                    </div>

                                    <div className={`p-2 rounded-xl flex items-center gap-2 ${
                                      progressPercent >= 65
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                    }`}>
                                      <Clock className="w-4 h-4 shrink-0" />
                                      <span>২. কাজ চলমান</span>
                                    </div>

                                    <div className={`p-2 rounded-xl flex items-center gap-2 ${
                                      progressPercent >= 90
                                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                    }`}>
                                      <FileText className="w-4 h-4 shrink-0" />
                                      <span>৩. ফাইল ডেলিভারি জমা</span>
                                    </div>

                                    <div className={`p-2 rounded-xl flex items-center gap-2 ${
                                      progressPercent >= 100
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400'
                                    }`}>
                                      <ShieldCheck className="w-4 h-4 shrink-0" />
                                      <span>৪. অনুমোদন & ফান্ড রিলিজ</span>
                                    </div>
                                  </div>

                                  {/* Delivery Notes / Files */}
                                  {(ord.deliveryNote || ord.deliveryFileUrl) && (
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                                        <FileText className="w-4 h-4" />
                                        <span>সেলার কর্তৃক জমাকৃত প্রজেক্ট ফাইল ও বিবরণ:</span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed font-medium">
                                        {ord.deliveryNote || 'কাজ সম্পন্ন করে সোর্স ফাইল ও ফাইল নোট আপলোড করা হলো।'}
                                      </p>
                                      {ord.deliveryFileUrl && (
                                        <a
                                          href={ord.deliveryFileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-slate-950 font-black text-xs sm:text-sm rounded-xl hover:bg-[#19a34a] transition cursor-pointer shadow-sm"
                                        >
                                          <Download className="w-4 h-4" />
                                          <span>সোর্স ফাইল ডাউনলোড করুন ({ord.deliveryFileName || 'download.zip'})</span>
                                        </a>
                                      )}
                                    </div>
                                  )}

                                  {/* Bottom controls inside expandable area */}
                                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                                    <div className="flex items-center gap-3 text-slate-500 font-bold">
                                      <span>তারিখ: <strong className="text-slate-900 dark:text-white">{ord.createdAt}</strong></span>
                                      <span>•</span>
                                      <span>পেমেন্ট মেথড: <strong className="text-[#1DB954]">{ord.paymentMethod || 'bKash Escrow Protected'}</strong></span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => {
                                          alert(`ইনভয়েস মেমো:\n\nঅর্ডার ID: ${ord.id}\nপ্রজেক্ট: ${ord.title}\nসেলার: ${ord.sellerName}\nপরিমাণ: ৳${ord.amount}\nতারিখ: ${ord.createdAt}`);
                                        }}
                                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                      >
                                        <FileText className="w-4 h-4" />
                                        <span>ইনভয়েস ক্যাশ মেমো</span>
                                      </button>

                                      {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                                        <button
                                          onClick={() => {
                                            const note = window.prompt("সেলারকে কাজের সংশোধনের জন্য আপনার বার্তা লিখুন:");
                                            if (note) {
                                              requestOrderRevision(ord.id, note);
                                              alert("সেলারকে রিভিশন রিকোয়েস্ট পাঠানো হয়েছে!");
                                            }
                                          }}
                                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-amber-500/30"
                                        >
                                          <RotateCcw className="w-4 h-4" />
                                          <span>রিভিশন মেসেজ পাঠান</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
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
                      if (n.targetTab && setActiveTab) {
                        setActiveTab(n.targetTab);
                        setIsNotificationsOpen(false);
                      }
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
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{n.message}</p>
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
                      openChatWindow({
                        id: msg.id,
                        senderName: msg.senderName,
                        senderRole: msg.senderRole,
                        senderAvatar: msg.senderAvatar,
                        initialMessage: msg.text
                      });
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

      {/* MOBILE NATIVE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-xl px-4 py-2.5 flex justify-around items-center text-slate-900 dark:text-white shadow-xl">
        <button
          onClick={() => {
            setViewMode('buying');
            setActiveSubTab('gigs');
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            viewMode === 'buying' && activeSubTab === 'gigs' ? 'text-[#1DB954] font-bold scale-105' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">ক্যাটালগ</span>
        </button>

        <button
          onClick={() => {
            setViewMode('selling');
            setSellerSubTab('create_gig');
          }}
          className="flex flex-col items-center gap-1 cursor-pointer text-[#1DB954] font-bold"
        >
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-slate-950 shadow-md -mt-4 border-2 border-white dark:border-slate-900">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px]">আপলোড</span>
        </button>

        <button
          onClick={() => {
            setViewMode('buying');
            setActiveSubTab('my-orders');
          }}
          className={`flex flex-col items-center gap-1 cursor-pointer transition ${
            activeSubTab === 'my-orders' ? 'text-[#1DB954] font-bold scale-105' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px]">অর্ডার</span>
        </button>

        <button
          onClick={() => {
            setViewMode(viewMode === 'buying' ? 'selling' : 'buying');
            if (viewMode === 'buying') demoLogin('instructor');
            else demoLogin('customer');
          }}
          className="flex flex-col items-center gap-1 cursor-pointer text-slate-700 dark:text-slate-200 font-bold"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">{viewMode === 'buying' ? 'Boss Mode' : 'Buyer Mode'}</span>
        </button>
      </div>

      {/* PUBLIC PROJECT POST POPUP MODAL */}
      {isPostProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-bengali">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-slate-900/10 dark:from-purple-950/40 dark:to-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    পাবলিক প্রজেক্ট পোস্ট করুন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    সকল দক্ষতার এক্সপার্টদের জন্য আপনার প্রজেক্টের অফার দিন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPostProjectModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {postSubmittedSuccess ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3 my-4">
                  <CheckCircle2 className="w-12 h-12 text-[#1DB954] mx-auto animate-bounce" />
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    আপনার পাবলিক প্রজেক্ট পোস্ট সফল হয়েছে!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    আপনার প্রজেক্টটি সকল এক্সপার্টদের জব ফিডে প্রকাশ করা হয়েছে। শীঘ্রই তারা প্রপোজাল জমা দেওয়া শুরু করবে।
                  </p>
                </div>
              ) : (
                <form id="post-public-project-form" onSubmit={handlePostProjectSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      প্রজেক্ট বা সার্ভিসের নাম / শিরোনাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="যেমন: ই-কমার্স ওয়েবসাইট তৈরি বা প্রফেশনাল মোবাইল অ্যাপ ডেভেলপমেন্ট"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        ক্যাটাগরি নির্বাচন করুন *
                      </label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                        আনুমানিক বাজেট *
                      </label>
                      <select
                        value={postBudget}
                        onChange={(e) => setPostBudget(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="৳৫,০০০ - ৳১৫,০০০">৳৫,০০০ - ৳১৫,০০০</option>
                        <option value="৳১৫,০০০ - ৳৩০,০০০">৳১৫,০০০ - ৳৩০,০০০</option>
                        <option value="৳৩০,০০০ - ৳৫০,০০০">৳৩০,০০০ - ৳৫০,০০০</option>
                        <option value="৳৫০,০০০ - ৳১,০০,০০০+">৳৫০,০০০ - ৳১,০০,০০০+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      প্রজেক্টের বিবরণ ও প্রয়োজনীয়তার বিবরণ *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={postDescription}
                      onChange={(e) => setPostDescription(e.target.value)}
                      placeholder="আপনার কাঙ্ক্ষিত প্রজেক্টের যাবতীয় রিকোয়ারমেন্ট, রেফারেন্স সাইট লিঙ্ক বা বিবরণ বিস্তারিত লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      নমুনা ফাইল / ডকুমেন্ট অ্যাটাচমেন্ট (ঐচ্ছিক)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3.5 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs transition">
                        <span className="text-slate-500 dark:text-slate-400 truncate">
                          {postAttachmentName || 'পিডিএফ, ডকুমেন্ট বা ইমেজ সিলেক্ট করুন'}
                        </span>
                        <UploadCloud className="w-4 h-4 text-purple-500 shrink-0 ml-2" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setPostAttachmentName(file.name);
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPostAttachmentUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            {!postSubmittedSuccess && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPostProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  form="post-public-project-form"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>পাবলিক পোস্ট নিশ্চিত করুন</span>
                </button>
              </div>
            )}
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

    </div>
  );
};
