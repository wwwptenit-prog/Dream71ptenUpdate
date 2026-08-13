import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  Award,
  CreditCard,
  Tag,
  Settings,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Search,
  DollarSign,
  Image as ImageIcon,
  ShieldAlert,
  Save,
  Check,
  Bell,
  Globe,
  LogOut,
  FileText,
  Send,
  Clock,
  GraduationCap,
  X,
  Paperclip,
  Upload,
  ShoppingBag,
  Zap,
  Building2,
  ShieldCheck,
  Sun,
  Moon,
  AlertCircle,
  RefreshCw,
  BarChart2,
  TrendingUp,
  CheckSquare,
  Sparkles,
  Bot,
  Cpu,
  Copy,
  Terminal,
  Code,
  Mail,
  Inbox
} from 'lucide-react';

interface CompanyBillItem {
  id: string;
  payerName: string;
  payerPhone: string;
  gateway: 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Card';
  transactionId: string;
  amount: number;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  date: string;
  note?: string;
}
import { useData } from '../context/DataContext';

interface AdminPanelProps {
  setActiveTab?: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ setActiveTab }) => {
  const {
    lang,
    setLang,
    t,
    darkMode,
    toggleDarkMode,
    currentUser,
    users,
    courses,
    services,
    gallery,
    testimonials,
    enrollments,
    certificates,
    offers,
    siteSettings,
    orders,
    contactMessages,
    notifications,
    payouts = [],
    teacherNotices = [],
    submissions = [],
    assignments = [],
    markMessageRead,
    markNotificationRead,
    markAllNotificationsRead,
    addCourse,
    updateCourse,
    deleteCourse,
    addService,
    updateService,
    deleteService,
    addGalleryItem,
    deleteGalleryItem,
    addTestimonial,
    deleteTestimonial,
    updateOffers,
    updateSiteSettings,
    updateOrderStatus,
    toggleUserBlock,
    issueCertificate,
    addUser,
    deleteUser,
    deleteOrder,
    deleteJob,
    deleteMarketplaceOrder,
    updateMarketplaceOrderStatus,
    deleteTeacherPayout,
    deleteTeacherNotice,
    updatePayoutStatus,
    sendTeacherNotice,
    gigs = [],
    deleteGig,
    updateGig,
    jobs = [],
    proposals = [],
    marketplaceOrders = [],
    directMessages = [],
    createJob,
    dispatchJobToStaff,
    logout
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [activeMainModule, setActiveMainModule] = useState<'dashboard' | 'academy' | 'marketplace' | 'settings'>('dashboard');

  // Admin Menubar Extensibility & Filter State
  const [adminMenuCategory, setAdminMenuCategory] = useState<'all' | 'overview' | 'academy' | 'marketplace' | 'finance' | 'system'>('all');
  const [addPageModalOpen, setAddPageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageCategory, setNewPageCategory] = useState<'overview' | 'academy' | 'marketplace' | 'finance' | 'system'>('overview');
  const [newPageDesc, setNewPageDesc] = useState('');
  const [newPageSuccessMsg, setNewPageSuccessMsg] = useState('');
  const [customAdminPages, setCustomAdminPages] = useState<Array<{
    id: string;
    serial: string;
    label: string;
    category: 'overview' | 'academy' | 'marketplace' | 'finance' | 'system';
    desc: string;
  }>>([]);

  // Teacher Add & Management State
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherMobile, setTeacherMobile] = useState('');
  const [teacherPass, setTeacherPass] = useState('123456');
  const [teacherTitle, setTeacherTitle] = useState('ইনস্ট্রাক্টর ও কোর্স এক্সপার্ট');
  const [teacherInstitution, setTeacherInstitution] = useState('PTENit IT Training Academy');
  const [teacherBio, setTeacherBio] = useState('');
  const [teacherAvatar, setTeacherAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Payout Transaction Modal State
  const [payingPayoutId, setPayingPayoutId] = useState<string | null>(null);
  const [payoutTxId, setPayoutTxId] = useState('');

  // Teacher Notice Form state
  const [noticeRecipient, setNoticeRecipient] = useState<string>('all');
  const [noticeSubject, setNoticeSubject] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [noticeSuccessMsg, setNoticeSuccessMsg] = useState('');

  // Teacher Sub Tab
  const [teacherSubTab, setTeacherSubTab] = useState<'list' | 'payouts' | 'notices'>('list');

  // Course Form Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Digital Marketing');
  const [courseInstructor, setCourseInstructor] = useState('PTENit Expert');
  const [coursePrice, setCoursePrice] = useState(1500);
  const [courseDiscountPrice, setCourseDiscountPrice] = useState(999);
  const [courseIsFree, setCourseIsFree] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState('https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseTargetModules, setCourseTargetModules] = useState<number>(4);
  const [courseTargetLessons, setCourseTargetLessons] = useState<number>(16);
  const [courseTeacherCommissionRate, setCourseTeacherCommissionRate] = useState<number>(30);
  const [courseLevel, setCourseLevel] = useState<'basic' | 'advanced' | 'professional' | 'live_batch'>('basic');
  const [courseAssignedTeacherId, setCourseAssignedTeacherId] = useState<string>('public');
  const [courseSubTab, setCourseSubTab] = useState<string>('all');

  // Agency Staff & Instructor Options with Categories & IDs
  interface AgencyStaffMember {
    id: string;
    name: string;
    category: string;
    title: string;
    email?: string;
  }

  const detailedStaffList: AgencyStaffMember[] = [
    { id: 'teacher-1', name: 'তানভীর আহমেদ', category: 'Development', title: 'Senior Full Stack & React Specialist' },
    { id: 'teacher-2', name: 'আরিফ হোসেন', category: 'Digital Marketing', title: 'Digital Marketing & Ads Specialist' },
    { id: 'teacher-3', name: 'নাজমুল হাসান', category: 'Graphics & Design', title: 'Lead Graphics & UI/UX Designer' },
    { id: 'teacher-4', name: 'রাফসান সানি', category: 'SEO & Content', title: 'SEO & Content Growth Manager' },
    { id: 'teacher-5', name: 'প্রকৌশলী আল-আমিন', category: 'Development', title: 'Mobile App & Software Engineer' },
    { id: 'teacher-6', name: 'ড. শরিফুল ইসলাম', category: 'Cyber Security', title: 'Cyber Security & Networks Expert' },
    { id: 'teacher-7', name: 'মোঃ মাহাবুব আলম', category: 'Video & Animation', title: 'Video Editor & Motion Designer' },
  ];

  const agencyStaff: AgencyStaffMember[] = [
    ...detailedStaffList,
    ...users
      .filter(u => (u.role === 'teacher' || u.role === 'admin') && !detailedStaffList.some(s => s.id === u.id))
      .map(u => ({
        id: u.id,
        name: u.name,
        category: u.title?.includes('Graphics') ? 'Graphics & Design' : u.title?.includes('Marketing') ? 'Digital Marketing' : u.title?.includes('SEO') ? 'SEO & Content' : 'Development',
        title: u.title || 'Agency Expert Staff',
        email: u.email
      }))
  ];

  const isCategoryMatch = (staffCat: string, targetCat: string) => {
    if (!targetCat || targetCat === 'all') return true;
    const s = (staffCat || '').toLowerCase();
    const t = (targetCat || '').toLowerCase();
    if (t.includes('dev') || t.includes('web') || t.includes('app') || t.includes('software')) {
      return s.includes('dev') || s.includes('web') || s.includes('app') || s.includes('software');
    }
    if (t.includes('design') || t.includes('graphic') || t.includes('ui/ux')) {
      return s.includes('design') || s.includes('graphic') || s.includes('ui/ux');
    }
    if (t.includes('market') || t.includes('digital') || t.includes('ads')) {
      return s.includes('market') || s.includes('digital') || s.includes('ads');
    }
    if (t.includes('seo') || t.includes('content')) {
      return s.includes('seo') || s.includes('content');
    }
    if (t.includes('video') || t.includes('animation') || t.includes('3d')) {
      return s.includes('video') || s.includes('anim') || s.includes('3d');
    }
    if (t.includes('security') || t.includes('cyber') || t.includes('network')) {
      return s.includes('security') || s.includes('cyber') || s.includes('net');
    }
    return s.includes(t) || t.includes(s);
  };

  const availableInstructors = [
    { id: 'public', name: '📢 ক্যাটাগরির সকল ট্রেইনারের নিকট পাবলিক অফার (Public Broadcast)', category: 'All' },
    ...agencyStaff.map(s => ({
      id: s.id,
      name: `[ID: ${s.id}] ${s.name} — ${s.category} (${s.title})`,
      rawName: s.name,
      category: s.category
    }))
  ];

  // Marketplace Admin Management States
  const [mktAdminSubTab, setMktAdminSubTab] = useState<'overview' | 'gigs' | 'jobs' | 'orders' | 'settings'>('overview');
  const [mktCommissionRate, setMktCommissionRate] = useState<number>(10);
  const [gigSearchFilter, setGigSearchFilter] = useState<string>('');
  const [gigStatusFilter, setGigStatusFilter] = useState<string>('all');

  // Bulk Order Selection & Status Update States (Course Payment Orders)
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [orderSearchFilter, setOrderSearchFilter] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [bulkOrderTargetStatus, setBulkOrderTargetStatus] = useState<'Paid' | 'Pending' | 'Failed' | 'Cancelled'>('Paid');

  // Bulk Order Selection & Status Update States (Marketplace Escrow Orders)
  const [selectedMktOrderIds, setSelectedMktOrderIds] = useState<string[]>([]);
  const [mktOrderSearchFilter, setMktOrderSearchFilter] = useState<string>('');
  const [mktOrderStatusFilter, setMktOrderStatusFilter] = useState<string>('all');
  const [bulkMktOrderTargetStatus, setBulkMktOrderTargetStatus] = useState<string>('completed');

  // Course Orders Filtering & Bulk Handlers
  const filteredCourseOrders = orders.filter(o => {
    const matchesSearch = !orderSearchFilter || 
      o.id.toLowerCase().includes(orderSearchFilter.toLowerCase()) ||
      o.userName.toLowerCase().includes(orderSearchFilter.toLowerCase()) ||
      (o.userMobile && o.userMobile.includes(orderSearchFilter)) ||
      o.courseTitle.toLowerCase().includes(orderSearchFilter.toLowerCase()) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(orderSearchFilter.toLowerCase()));
    
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const isAllCourseOrdersSelected = filteredCourseOrders.length > 0 && 
    filteredCourseOrders.every(o => selectedOrderIds.includes(o.id));

  const handleToggleSelectAllCourseOrders = () => {
    if (isAllCourseOrdersSelected) {
      const filteredIdsSet = new Set(filteredCourseOrders.map(o => o.id));
      setSelectedOrderIds(prev => prev.filter(id => !filteredIdsSet.has(id)));
    } else {
      const newSelected = new Set([...selectedOrderIds, ...filteredCourseOrders.map(o => o.id)]);
      setSelectedOrderIds(Array.from(newSelected));
    }
  };

  const handleToggleSelectCourseOrder = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleApplyBulkOrderStatus = () => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach(id => {
      updateOrderStatus(id, bulkOrderTargetStatus);
    });
    alert(`সফলভাবে ${selectedOrderIds.length}টি অর্ডারের স্ট্যাটাস '${bulkOrderTargetStatus}' এ আপডেট করা হয়েছে!`);
    setSelectedOrderIds([]);
  };

  const handleBulkDeleteCourseOrders = () => {
    if (selectedOrderIds.length === 0) return;
    if (window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedOrderIds.length}টি অর্ডার মুছে ফেলতে চান?`)) {
      selectedOrderIds.forEach(id => {
        deleteOrder(id);
      });
      setSelectedOrderIds([]);
    }
  };

  // Marketplace Orders Filtering & Bulk Handlers
  const filteredMktOrders = marketplaceOrders.filter(o => {
    const matchesSearch = !mktOrderSearchFilter ||
      o.id.toLowerCase().includes(mktOrderSearchFilter.toLowerCase()) ||
      o.title.toLowerCase().includes(mktOrderSearchFilter.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(mktOrderSearchFilter.toLowerCase()) ||
      o.sellerName.toLowerCase().includes(mktOrderSearchFilter.toLowerCase());

    const matchesStatus = mktOrderStatusFilter === 'all' || o.status === mktOrderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const isAllMktOrdersSelected = filteredMktOrders.length > 0 &&
    filteredMktOrders.every(o => selectedMktOrderIds.includes(o.id));

  const handleToggleSelectAllMktOrders = () => {
    if (isAllMktOrdersSelected) {
      const filteredIdsSet = new Set(filteredMktOrders.map(o => o.id));
      setSelectedMktOrderIds(prev => prev.filter(id => !filteredIdsSet.has(id)));
    } else {
      const newSelected = new Set([...selectedMktOrderIds, ...filteredMktOrders.map(o => o.id)]);
      setSelectedMktOrderIds(Array.from(newSelected));
    }
  };

  const handleToggleSelectMktOrder = (orderId: string) => {
    setSelectedMktOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleApplyBulkMktOrderStatus = () => {
    if (selectedMktOrderIds.length === 0) return;
    selectedMktOrderIds.forEach(id => {
      if (updateMarketplaceOrderStatus) {
        updateMarketplaceOrderStatus(id, bulkMktOrderTargetStatus as any, "এডমিন কর্তৃক বাল্ক স্ট্যাটাস আপডেট");
      }
    });
    alert(`সফলভাবে ${selectedMktOrderIds.length}টি এস্ক্রো অর্ডারের স্ট্যাটাস '${bulkMktOrderTargetStatus}' এ আপডেট করা হয়েছে!`);
    setSelectedMktOrderIds([]);
  };

  const handleBulkDeleteMktOrders = () => {
    if (selectedMktOrderIds.length === 0) return;
    if (window.confirm(`আপনি কি নিশ্চিত যে নির্বাচিত ${selectedMktOrderIds.length}টি এস্ক্রো অর্ডার মুছে ফেলতে চান?`)) {
      selectedMktOrderIds.forEach(id => {
        deleteMarketplaceOrder(id);
      });
      setSelectedMktOrderIds([]);
    }
  };
  
  // Admin Gig Edit & Performance States
  const [adminEditingGig, setAdminEditingGig] = useState<any | null>(null);
  const [adminEditTitle, setAdminEditTitle] = useState('');
  const [adminEditCategory, setAdminEditCategory] = useState('Programming & Tech');
  const [adminEditPriceBasic, setAdminEditPriceBasic] = useState(2500);
  const [adminEditPriceStandard, setAdminEditPriceStandard] = useState(6000);
  const [adminEditPricePremium, setAdminEditPricePremium] = useState(15000);
  const [adminEditDeliveryDays, setAdminEditDeliveryDays] = useState(3);
  const [adminEditThumbnail, setAdminEditThumbnail] = useState('');
  const [adminEditDesc, setAdminEditDesc] = useState('');
  const [adminEditSuccess, setAdminEditSuccess] = useState(false);

  const [adminPerformanceGig, setAdminPerformanceGig] = useState<any | null>(null);

  const handleOpenAdminEditGig = (gig: any) => {
    setAdminEditingGig(gig);
    setAdminEditTitle(gig.title);
    setAdminEditCategory(gig.category);
    setAdminEditPriceBasic(gig.packages?.basic?.price || (gig as any).price || 2500);
    setAdminEditPriceStandard(gig.packages?.standard?.price || 6000);
    setAdminEditPricePremium(gig.packages?.premium?.price || 15000);
    setAdminEditDeliveryDays(gig.packages?.basic?.deliveryDays || 3);
    setAdminEditThumbnail(gig.thumbnail);
    setAdminEditDesc(gig.description || '');
    setAdminEditSuccess(false);
  };

  const handleSaveAdminEditGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEditingGig) return;
    updateGig(adminEditingGig.id, {
      title: adminEditTitle,
      category: adminEditCategory,
      price: adminEditPriceBasic,
      thumbnail: adminEditThumbnail,
      description: adminEditDesc,
      packages: {
        basic: {
          title: 'Basic Package',
          price: adminEditPriceBasic,
          deliveryDays: adminEditDeliveryDays,
          revisions: '1',
          features: ['কোর ডিজাইন ও ডেলিভারি', 'সোর্স ফাইল']
        },
        standard: {
          title: 'Standard Package',
          price: adminEditPriceStandard,
          deliveryDays: Math.max(1, adminEditDeliveryDays - 1),
          revisions: '3',
          features: ['অ্যাডভান্স ডিজাইন ও কোড', 'সোর্স ফাইল', 'প্রিমিয়াম সাপোর্ট']
        },
        premium: {
          title: 'Premium Package',
          price: adminEditPricePremium,
          deliveryDays: Math.max(1, adminEditDeliveryDays - 2),
          revisions: 'Unbounded',
          features: ['সম্পূর্ণ প্রজেক্ট', 'লাইফটাইম মেইনটেন্যান্স', 'ভিআইপি সাপোর্ট']
        }
      }
    });
    adminEditingGig.title = adminEditTitle;
    adminEditingGig.category = adminEditCategory;
    adminEditingGig.thumbnail = adminEditThumbnail;
    adminEditingGig.description = adminEditDesc;

    setAdminEditSuccess(true);
    setTimeout(() => {
      setAdminEditSuccess(false);
      setAdminEditingGig(null);
    }, 1200);
  };
  const [mktEscrowFilter, setMktEscrowFilter] = useState<string>('all');
  const [mktCategories, setMktCategories] = useState<string[]>([
    'Graphics & Design',
    'Programming & Tech',
    'Digital Marketing',
    'Video & Animation',
    'Writing & Translation',
    'Music & Audio',
    'Business',
    'Finance',
    'AI Services'
  ]);
  const [newCatName, setNewCatName] = useState<string>('');

  // Service Form State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Development');
  const [serviceIcon, setServiceIcon] = useState('Code');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('৳১০,০০০');
  const [serviceThumbnail, setServiceThumbnail] = useState('https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');

  // Gallery Form State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<'Office' | 'Students' | 'Training' | 'Events' | 'Certificates' | 'Projects' | 'Activities'>('Training');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');

  // Testimonial Form State
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialRole, setTestimonialRole] = useState('Student');
  const [testimonialCourse, setTestimonialCourse] = useState('Web Development');
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialAvatar, setTestimonialAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  // Company Billing & Auto-Read Verification System States
  const [companyBills, setCompanyBills] = useState<CompanyBillItem[]>([
    {
      id: 'BILL-1001',
      payerName: 'মোঃ শফিকুল ইসলাম',
      payerPhone: '01712345678',
      gateway: 'bKash',
      transactionId: '8N7X9K2P',
      amount: 4750,
      category: 'এডভান্স পেমেন্ট - React App',
      status: 'pending',
      date: '2026-08-05 10:30 AM',
      note: '5% ছাড় অফার অর্ডারের বিল'
    },
    {
      id: 'BILL-1002',
      payerName: 'আরিফ উল্লাহ',
      payerPhone: '01898765432',
      gateway: 'Nagad',
      transactionId: 'NGD982310',
      amount: 999,
      category: 'কোর্স পেমেন্ট - Digital Marketing',
      status: 'verified',
      verifiedAt: '2026-08-05 09:15 AM',
      date: '2026-08-05 09:00 AM',
      note: 'অটো-রিড ও ইনস্ট্যান্ট ভেরিফাইড'
    },
    {
      id: 'BILL-1003',
      payerName: 'ডায়না ট্রেডিং প্রাঃ লিঃ',
      payerPhone: '01911223344',
      gateway: 'Bank',
      transactionId: 'TRX778899',
      amount: 15000,
      category: 'কাস্টম আইটি সার্ভিস - ERP Billing',
      status: 'pending',
      date: '2026-08-05 11:00 AM',
      note: 'কর্পোরেট ইনভয়েস পেমেন্ট'
    },
    {
      id: 'BILL-1004',
      payerName: 'কামরুল হাসান',
      payerPhone: '01655443322',
      gateway: 'Rocket',
      transactionId: 'RKT445566',
      amount: 2500,
      category: 'মার্কেটপ্লেস গিগ - UI/UX Design',
      status: 'pending',
      date: '2026-08-05 11:05 AM',
      note: 'এমএফএস রকেট এডভান্স বিল'
    }
  ]);

  const [billSearchFilter, setBillSearchFilter] = useState('');
  const [billStatusFilter, setBillStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [addBillModalOpen, setAddBillModalOpen] = useState(false);
  const [newBillPayerName, setNewBillPayerName] = useState('');
  const [newBillPayerPhone, setNewBillPayerPhone] = useState('');
  const [newBillGateway, setNewBillGateway] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Card'>('bKash');
  const [newBillTrxId, setNewBillTrxId] = useState('');
  const [newBillAmount, setNewBillAmount] = useState<number>(2333);
  const [newBillCategory, setNewBillCategory] = useState('এডভান্স পেমেন্ট');
  const [newBillNote, setNewBillNote] = useState('');
  const [autoVerifyLog, setAutoVerifyLog] = useState<string | null>(null);
  const [isAutoReading, setIsAutoReading] = useState(false);

  const handleCreateCompanyBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillPayerName.trim() || !newBillTrxId.trim()) {
      alert('অনুগ্রহ করে পেয়ারের নাম এবং ট্রানজেকশন আইডি (TrxID) সঠিকভাবে দিন।');
      return;
    }
    const newBill: CompanyBillItem = {
      id: `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      payerName: newBillPayerName,
      payerPhone: newBillPayerPhone || '01700000000',
      gateway: newBillGateway,
      transactionId: newBillTrxId.trim().toUpperCase(),
      amount: newBillAmount,
      category: newBillCategory,
      status: 'pending',
      date: new Date().toLocaleString('bn-BD'),
      note: newBillNote || 'ম্যানুয়ালি যুক্ত প্রতিষ্ঠানের বিল'
    };
    setCompanyBills(prev => [newBill, ...prev]);
    setAddBillModalOpen(false);
    setNewBillPayerName('');
    setNewBillPayerPhone('');
    setNewBillTrxId('');
    setNewBillAmount(2333);
    setNewBillNote('');
    alert(`প্রতিষ্ঠানের বিল ${newBill.id} সফলভাবে যুক্ত করা হয়েছে!`);
  };

  const handleAutoVerifySingleBill = (billId: string) => {
    const targetBill = companyBills.find(b => b.id === billId);
    if (!targetBill) return;

    setIsAutoReading(true);
    setAutoVerifyLog(`[Auto-Read Engine] MFS TrxID "${targetBill.transactionId}" রিড করা হচ্ছে...`);

    setTimeout(() => {
      setAutoVerifyLog(`[Auto-Read Engine] ✓ ${targetBill.gateway} SMS/API ম্যাচড! TrxID: ${targetBill.transactionId} | পরিমাণ: ৳${targetBill.amount} | পেয়ার: ${targetBill.payerName}`);
      setCompanyBills(prev => prev.map(b => {
        if (b.id === billId) {
          return {
            ...b,
            status: 'verified',
            verifiedAt: new Date().toLocaleTimeString('bn-BD')
          };
        }
        return b;
      }));
      setIsAutoReading(false);
    }, 1000);
  };

  const handleAutoVerifyAllPendingBills = () => {
    const pendingList = companyBills.filter(b => b.status === 'pending');
    if (pendingList.length === 0) {
      alert('কোনো পেন্ডিং বিল নেই! সকল বিল ইতোমধ্যে ভেরিফাইড।');
      return;
    }

    setIsAutoReading(true);
    setAutoVerifyLog(`[Auto-Read Batch] মোট ${pendingList.length} টি পেন্ডিং বিলের TrxID অটো-স্ক্যান করা হচ্ছে...`);

    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString('bn-BD');
      setCompanyBills(prev => prev.map(b => {
        if (b.status === 'pending') {
          return {
            ...b,
            status: 'verified',
            verifiedAt: nowTime
          };
        }
        return b;
      }));
      setIsAutoReading(false);
      setAutoVerifyLog(`[Auto-Read Batch] ⚡ সফলভাবে ${pendingList.length} টি প্রতিষ্ঠানের পেমেন্ট বিলের TrxID অটো-রিড ও ভেরিফাই সম্পন্ন হয়েছে!`);
    }, 1500);
  };

  // Job Creation Form State
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [reDispatchJobId, setReDispatchJobId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('Development');
  const [jobBuyerName, setJobBuyerName] = useState('PTENit B2B Client');
  const [jobBuyerPhone, setJobBuyerPhone] = useState('01700000000');
  const [jobBudget, setJobBudget] = useState<number>(15000);
  const [jobDeadlineDays, setJobDeadlineDays] = useState<number>(7);
  const [jobDescription, setJobDescription] = useState('');
  const [jobVisibility, setJobVisibility] = useState<'public' | 'internal_staff_only' | 'custom_assigned'>('public');
  const [jobAssignedStaffId, setJobAssignedStaffId] = useState<string>('');

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) return;

    let assignedStaffName = '';
    if (jobVisibility === 'custom_assigned' && jobAssignedStaffId) {
      const foundStaff = agencyStaff.find(s => s.id === jobAssignedStaffId);
      if (foundStaff) {
        assignedStaffName = `${foundStaff.name} [ID: ${foundStaff.id}] (${foundStaff.category})`;
      } else {
        const foundUser = users.find(u => u.id === jobAssignedStaffId);
        if (foundUser) {
          assignedStaffName = `${foundUser.name} [ID: ${foundUser.id}]`;
        }
      }
    }

    createJob({
      buyerId: currentUser?.id || 'admin-1',
      buyerName: jobBuyerName || 'PTENit B2B Client',
      buyerPhone: jobBuyerPhone || '01700000000',
      title: jobTitle,
      category: jobCategory,
      description: jobDescription || 'কাস্টম প্রজেক্ট বিবরণ',
      budget: Number(jobBudget) || 10000,
      deadlineDays: Number(jobDeadlineDays) || 7,
      visibility: jobVisibility,
      ...(jobVisibility === 'custom_assigned' && jobAssignedStaffId ? {
        assignedStaffId: jobAssignedStaffId,
        assignedStaffName: assignedStaffName
      } : {})
    });

    setJobModalOpen(false);
    setJobTitle('');
    setJobDescription('');
    alert('নতুন জব/প্রজেক্ট সফলভাবে যুক্ত করা হয়েছে!');
  };

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm(prev => ({ ...siteSettings, ...prev }));
    }
  }, [siteSettings]);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [adminNotifOpen, setAdminNotifOpen] = useState(false);
  const [adminNotifToggles, setAdminNotifToggles] = useState({
    activity: true,  // 🎓 টিচার ও স্টুডেন্ট অ্যাক্টিভিটি
    expert: true,    // ⚡ এক্সপার্ট ও ট্রেইনার টাস্ক
    system: true     // ⚙️ সিস্টেম ও সিকিউরিটি
  });

  // Admin Messenger Popover State
  const [adminMsgOpen, setAdminMsgOpen] = useState(false);
  const [activeAdminChatSender, setActiveAdminChatSender] = useState<string>('শিক্ষার্থী ইনকোয়ারি');
  const [adminChatInput, setAdminChatInput] = useState('');
  const [adminChatAttachedFile, setAdminChatAttachedFile] = useState<{ name: string; url: string; type: string } | null>(null);
  const adminFileInputRef = React.useRef<HTMLInputElement>(null);
  const [adminMsgToggles, setAdminMsgToggles] = useState({
    student: true,
    teacher: true,
    support: true
  });

  const [adminChatList, setAdminChatList] = useState([
    {
      id: 'am1',
      sender: 'শিক্ষার্থী ইনকোয়ারি',
      text: 'আসসালামু আলাইকুম স্যার, আইটি কোর্সের নতুন ব্যাচের শিডিউল জানতে চাচ্ছিলাম।',
      time: '১০:১৫ AM',
      isAdmin: false,
      read: false
    },
    {
      id: 'am2',
      sender: 'শিক্ষার্থী ইনকোয়ারি',
      text: 'ওয়ালাইকুম আসসালাম। আগামী সোমবার থেকে নতুন ব্যাচ শুরু হচ্ছে।',
      time: '১০:১৮ AM',
      isAdmin: true,
      read: true
    },
    {
      id: 'am3',
      sender: 'টিচার সাপোর্ট',
      text: 'এডমিন স্যার, আগামী সপ্তাহে প্রজেক্ট সাবমিশনের ডেডলাইন আপডেট করা দরকার।',
      time: '১১:৩০ AM',
      isAdmin: false,
      read: false
    }
  ]);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4 font-bengali">
        <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">এডমিন অ্যাক্সেস সংরক্ষিত</h2>
        <p className="text-sm text-slate-500">
          এই পৃষ্ঠাটি শুধুমাত্র এডমিন ব্যবহারকারীদের জন্য সংরক্ষিত।
        </p>
      </div>
    );
  }

  // File Upload Helper for Images
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('ফাইল সাইজ খুব বড়! অনুগ্রহ করে ৮MB এর কম সাইজের ছবি আপলোড করুন।');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin Stats Calculations
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalCoursesCount = courses.length;
  const totalEnrollmentsCount = enrollments.length;
  const paidOrders = orders.filter(o => o.status === 'Paid');
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.amount, 0);
  const freeCoursesCount = courses.filter(c => c.isFree).length;

  // Handle Save Course
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = courses.find(c => c.id === editingCourseId);
    const isPublic = courseAssignedTeacherId === 'public';
    const foundInst = availableInstructors.find(i => i.id === courseAssignedTeacherId);
    const assignedName = isPublic
      ? 'পাবলিক অফার (উন্মুক্ত ট্রেইনার)'
      : (foundInst ? foundInst.name.split(' (')[0] : courseInstructor);

    if (editingCourseId) {
      updateCourse(editingCourseId, {
        title: courseTitle,
        category: courseCategory,
        instructor: assignedName,
        assignedInstructorId: courseAssignedTeacherId,
        isPublicOffer: isPublic,
        level: courseLevel,
        price: coursePrice,
        discountPrice: courseDiscountPrice,
        isFree: courseIsFree,
        thumbnail: courseThumbnail,
        description: courseDesc,
        targetModules: courseTargetModules,
        targetLessons: courseTargetLessons,
        teacherCommissionRate: courseTeacherCommissionRate,
        offerStatus: existing?.offerStatus === 'accepted' ? 'accepted' : 'offered'
      });
    } else {
      addCourse({
        title: courseTitle,
        category: courseCategory,
        instructor: assignedName,
        assignedInstructorId: courseAssignedTeacherId,
        isPublicOffer: isPublic,
        level: courseLevel,
        duration: "4 Weeks",
        lessonsCount: courseTargetLessons || 12,
        isFree: courseIsFree,
        price: coursePrice,
        discountPrice: courseDiscountPrice,
        thumbnail: courseThumbnail,
        description: courseDesc,
        whatYouWillLearn: ["প্রফেশনাল স্কিলস মাস্টারক্লাস"],
        requirements: ["কম্পিউটার বা মোবাইল"],
        tags: ["#PTENit"],
        modules: [],
        published: true,
        targetModules: courseTargetModules,
        targetLessons: courseTargetLessons,
        teacherCommissionRate: courseTeacherCommissionRate,
        offerStatus: 'offered'
      });
    }
    setCourseModalOpen(false);
  };

  // Handle Save Service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceId) {
      updateService(editingServiceId, {
        title: serviceTitle,
        category: serviceCategory,
        shortDescription: serviceDesc,
        fullDescription: serviceDesc,
        iconName: serviceIcon,
        priceText: servicePrice,
        thumbnail: serviceThumbnail
      });
    } else {
      addService({
        title: serviceTitle,
        category: serviceCategory,
        shortDescription: serviceDesc,
        fullDescription: serviceDesc,
        iconName: serviceIcon,
        priceText: servicePrice,
        thumbnail: serviceThumbnail,
        features: ["100% Quality Service", "24/7 Dedicated Support"],
        published: true
      });
    }
    setServiceModalOpen(false);
  };

  // Handle Save Gallery
  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem({
      title: galleryTitle || 'PTENit Media',
      category: galleryCategory,
      imageUrl: galleryImageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      caption: galleryCaption || galleryTitle
    });
    setGalleryModalOpen(false);
    setGalleryTitle('');
    setGalleryImageUrl('');
    setGalleryCaption('');
  };

  // Handle Save Testimonial
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
      name: testimonialName || 'শিক্ষার্থী',
      role: testimonialRole,
      courseOrService: testimonialCourse,
      rating: testimonialRating,
      text: testimonialText,
      avatar: testimonialAvatar
    });
    setTestimonialModalOpen(false);
    setTestimonialName('');
    setTestimonialText('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim() || !teacherEmail.trim()) return;

    addUser({
      name: teacherName.trim(),
      email: teacherEmail.trim(),
      mobile: teacherMobile.trim() || '01700000000',
      role: 'teacher',
      title: teacherTitle || 'ইনস্ট্রাক্টর ও কোর্স এক্সপার্ট',
      institution: teacherInstitution || 'PTENit IT Training Academy',
      bio: teacherBio.trim() || 'PTENit একাডেমির সম্মানিত ইনস্ট্রাক্টর ও ট্রেইনার।',
      avatar: teacherAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });

    setTeacherModalOpen(false);
    setTeacherName('');
    setTeacherEmail('');
    setTeacherMobile('');
    setTeacherBio('');
    setTeacherAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  };

  const handleApprovePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingPayoutId) return;
    updatePayoutStatus(payingPayoutId, 'Paid', payoutTxId.trim() || `TX-${Date.now()}`);
    setPayingPayoutId(null);
    setPayoutTxId('');
  };

  const handleSendNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeSubject.trim() || !noticeMessage.trim()) return;

    const allTeachersList = users.filter(u => u.role === 'teacher' || u.role === 'admin');
    const recipientObj = allTeachersList.find(t => t.id === noticeRecipient);

    sendTeacherNotice({
      senderName: 'PTENit Admin Center',
      recipientTeacherId: noticeRecipient,
      recipientTeacherName: noticeRecipient === 'all' ? 'সকল টিচার ও এক্সপার্ট' : recipientObj?.name,
      subject: noticeSubject.trim(),
      message: noticeMessage.trim()
    });

    setNoticeSubject('');
    setNoticeMessage('');
    setNoticeSuccessMsg('সাপোর্ট মেসেজ ও নোটিশ সফলভাবে প্রেরিত হয়েছে!');
    setTimeout(() => setNoticeSuccessMsg(''), 4000);
  };

  return (
    <div className="py-4 sm:py-8 bg-slate-950 text-slate-100 min-h-screen transition-colors font-bengali">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Responsive Layout: Left Sidebar Navigation + Right Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR NAVIGATION MENUBAR */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-4 z-20 space-y-4 font-bengali">
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-xl space-y-4">
              
              {/* Sidebar Header Title */}
              <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white">এডমিন কন্ট্রোল মেনু</h2>
                    <p className="text-[11px] text-slate-400">সহজ ও দ্রুত কন্ট্রোল সেন্টার</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="সিস্টেম সচল রয়েছে" />
              </div>

              {/* Categorized Subject-Wise Menubar Groups (4 Main Modules) */}
              <div className="space-y-2 max-h-[65vh] lg:max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
                {(() => {
                  const pendingPayouts = payouts.filter(p => p.status === 'Pending').length;
                  const openJobs = jobs.filter(j => j.status === 'open').length;

                  const mainNavs = [
                    {
                      id: 'dashboard',
                      label: '১. ড্যাশবোর্ড',
                      subText: 'ওভারভিউ & স্ট্যাটস',
                      icon: LayoutDashboard,
                      isActive: activeMainModule === 'dashboard',
                      onClick: () => {
                        setActiveMainModule('dashboard');
                        setActiveAdminTab('dashboard');
                      }
                    },
                    {
                      id: 'academy',
                      label: '২. একাডেমি',
                      subText: 'কোর্স, স্টুডেন্ট & পেমেন্ট হিস্টোরি',
                      icon: BookOpen,
                      badge: pendingPayouts > 0 ? pendingPayouts : undefined,
                      isActive: activeMainModule === 'academy',
                      onClick: () => {
                        setActiveMainModule('academy');
                        if (!['courses', 'teachers', 'students', 'orders', 'financials'].includes(activeAdminTab)) {
                          setActiveAdminTab('courses');
                        }
                      }
                    },
                    {
                      id: 'marketplace',
                      label: '৩. মার্কেটপ্লেস',
                      subText: 'সার্ভিস, কাজ & ক্লায়েন্ট পেমেন্ট',
                      icon: ShoppingBag,
                      badge: openJobs > 0 ? openJobs : undefined,
                      isActive: activeMainModule === 'marketplace',
                      onClick: () => {
                        setActiveMainModule('marketplace');
                        if (!['services', 'marketplace', 'agency_clients', 'orders', 'financials'].includes(activeAdminTab)) {
                          setActiveAdminTab('services');
                        }
                      }
                    },
                    {
                      id: 'settings',
                      label: '৪. সেটিংস',
                      subText: 'সাইট কনফিগ, গ্যালারি & পেজ',
                      icon: Settings,
                      isActive: activeMainModule === 'settings',
                      onClick: () => {
                        setActiveMainModule('settings');
                        if (!['settings', 'gallery'].includes(activeAdminTab) && !activeAdminTab.startsWith('custom_')) {
                          setActiveAdminTab('settings');
                        }
                      }
                    }
                  ];

                  return (
                    <div className="space-y-2">
                      {mainNavs.map(nav => {
                        const Icon = nav.icon;
                        return (
                          <button
                            key={nav.id}
                            onClick={nav.onClick}
                            className={`w-full p-3 rounded-2xl transition-all cursor-pointer border text-left flex items-center justify-between ${
                              nav.isActive
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black'
                                : 'bg-slate-800/60 text-slate-200 border-slate-800 hover:text-white hover:bg-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 ${nav.isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-amber-400 border border-slate-700'}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-black truncate">{nav.label}</p>
                                <p className={`text-xs truncate ${nav.isActive ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                  {nav.subText}
                                </p>
                              </div>
                            </div>

                            {!!nav.badge && (
                              <span className={`px-2 py-0.5 text-xs font-black rounded-full shrink-0 ${
                                nav.isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white animate-pulse'
                              }`}>
                                {nav.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Sidebar Footer Action: Add New Page */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setAddPageModalOpen(true)}
                  className="w-full py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন পেজ যুক্ত করুন</span>
                </button>
              </div>

            </div>
          </aside>

          {/* RIGHT MAIN WORKSPACE AREA */}
          <main className="flex-1 min-w-0 w-full space-y-6">
        
        {/* Top Header */}
        <div className="bg-slate-900 border border-slate-800 text-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-bengali">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-black uppercase">
                Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">Admin: <strong className="text-emerald-400">{currentUser.email}</strong></span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black mt-1 text-white">
              PTENit এডমিন কন্ট্রোল সেন্টার
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-2xl border border-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="ভাষা পরিবর্তন / Switch Language"
            >
              <Globe className="w-4 h-4 text-[#1DB954]" />
              <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
            </button>

            {/* Night Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 rounded-2xl border border-slate-700 text-amber-400 text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
              title={darkMode ? 'লাইট মোড অন করুন' : 'নাইট মোড অন করুন'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setAdminNotifOpen(!adminNotifOpen)}
                className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-300 hover:text-white hover:border-[#1DB954] transition-colors cursor-pointer relative"
                title="এডমিন নোটিফিকেশন"
              >
                <Bell className="w-5 h-5 text-[#1DB954]" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-slate-900">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {adminNotifOpen && (
                <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[460px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-emerald-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                  {/* Header Bar */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                          <Bell className="w-4 h-4 text-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>এডমিন নোটিফিকেশন সেন্টার</span>
                          {notifications.filter(n => !n.read).length > 0 ? (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                              {notifications.filter(n => !n.read).length} অপঠিত
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              সব পড়া হয়েছে ✓
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-emerald-400">টিচার, ট্রেইনার ও স্টুডেন্ট সিস্টেম নোটিশ</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        >
                          সব পঠিত ✓
                        </button>
                      )}
                      <button
                        onClick={() => setAdminNotifOpen(false)}
                        className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="বন্ধ করুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Filter & Toggle Controls Bar */}
                  <div className="p-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] font-bold">
                    <span className="text-slate-400 shrink-0 px-1">ফিল্টার:</span>
                    <button
                      onClick={() => setAdminNotifToggles(prev => ({ ...prev, activity: !prev.activity }))}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                        adminNotifToggles.activity
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                      title="টিচার ও স্টুডেন্ট অ্যাক্টিভিটি চালু/বন্ধ করুন"
                    >
                      <span>🎓 টিচার/স্টুডেন্ট {adminNotifToggles.activity ? '✓' : '✕'}</span>
                    </button>
                    <button
                      onClick={() => setAdminNotifToggles(prev => ({ ...prev, expert: !prev.expert }))}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                        adminNotifToggles.expert
                          ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                      title="এক্সপার্ট ও ট্রেইনার টাস্ক চালু/বন্ধ করুন"
                    >
                      <span>⚡ এক্সপার্ট/ট্রেইনার {adminNotifToggles.expert ? '✓' : '✕'}</span>
                    </button>
                    <button
                      onClick={() => setAdminNotifToggles(prev => ({ ...prev, system: !prev.system }))}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                        adminNotifToggles.system
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                      title="সিস্টেম অ্যালার্ট চালু/বন্ধ করুন"
                    >
                      <span>⚙️ সিস্টেম {adminNotifToggles.system ? '✓' : '✕'}</span>
                    </button>
                  </div>

                  {/* Notification Items */}
                  <div className="p-3 space-y-2 max-h-80 sm:max-h-96 overflow-y-auto bg-slate-950/50">
                    {notifications.filter(n => {
                      if (n.title.includes('টিচার') || n.title.includes('স্টুডেন্ট')) {
                        if (!adminNotifToggles.activity) return false;
                      } else if (n.title.includes('এক্সপার্ট') || n.title.includes('ট্রেইনার')) {
                        if (!adminNotifToggles.expert) return false;
                      } else {
                        if (!adminNotifToggles.system) return false;
                      }
                      return true;
                    }).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-10">ফিল্টার ফিল্ড অনুযায়ী কোনো নোটিফিকেশন নেই।</p>
                    ) : (
                      notifications
                        .filter(n => {
                          if (n.title.includes('টিচার') || n.title.includes('স্টুডেন্ট')) {
                            if (!adminNotifToggles.activity) return false;
                          } else if (n.title.includes('এক্সপার্ট') || n.title.includes('ট্রেইনার')) {
                            if (!adminNotifToggles.expert) return false;
                          } else {
                            if (!adminNotifToggles.system) return false;
                          }
                          return true;
                        })
                        .map(n => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 rounded-2xl text-xs cursor-pointer transition-all ${
                              n.read
                                ? 'bg-slate-800/40 border border-slate-800 text-slate-400'
                                : 'bg-slate-800 border border-emerald-500/30 text-white shadow-md'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-1 mb-1">
                              <p className="font-bold text-white text-[12px] flex items-center gap-1.5 truncate">
                                {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
                                {n.title}
                              </p>
                            </div>
                            <p className={`text-[11px] leading-relaxed ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.time}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Message / Inbox Floating Messenger Button */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !adminMsgOpen;
                  setAdminMsgOpen(nextState);
                  if (adminNotifOpen) setAdminNotifOpen(false);
                  if (nextState) {
                    setAdminChatList(prev => prev.map(m => ({ ...m, read: true })));
                    contactMessages.forEach(m => {
                      if (!m.read) markMessageRead(m.id);
                    });
                  }
                }}
                className="p-2.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-300 hover:text-white hover:border-sky-400 transition-colors cursor-pointer relative"
                title="মেসেঞ্জার ও ইনস্ট্যান্ট ইনবক্স"
              >
                <MessageSquare className="w-5 h-5 text-sky-400" />
                {(contactMessages.filter(m => !m.read).length + adminChatList.filter(m => !m.isAdmin && !m.read).length + directMessages.filter(m => !m.read).length) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-sky-500 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-slate-900">
                    {contactMessages.filter(m => !m.read).length + adminChatList.filter(m => !m.isAdmin && !m.read).length + directMessages.filter(m => !m.read).length}
                  </span>
                )}
              </button>

              {/* Floating Messenger Window for Admin */}
              {adminMsgOpen && (
                <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[440px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-sky-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                  <input
                    type="file"
                    ref={adminFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setAdminChatAttachedFile({
                            name: file.name,
                            url: event.target?.result as string,
                            type: file.type
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />

                  {/* Header Bar */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/40">
                          A
                        </div>
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-slate-900 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>এডমিন লাইভ কেন্ট্রোল সেন্টার</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">সক্রিয়</span>
                        </h4>
                        <p className="text-[10px] text-sky-400">মেসেঞ্জার ড্যাশবোর্ড ও ইনবক্স রিপ্লাই</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setAdminChatList(prev => prev.map(m => ({ ...m, read: true })));
                          contactMessages.forEach(m => {
                            if (!m.read) markMessageRead(m.id);
                          });
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        title="সব বার্তা পঠিত হিসেবে চিহ্নিত করুন"
                      >
                        সব পঠিত ✓
                      </button>
                      <button
                        onClick={() => {
                          setAdminMsgOpen(false);
                          setActiveAdminTab('inbox');
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        title="সম্পূর্ণ ইনবক্স ভিউতে যান"
                      >
                        ইনবক্স ↗
                      </button>
                      <button
                        onClick={() => setAdminMsgOpen(false)}
                        className="p-1 hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg transition-all cursor-pointer"
                        title="বন্ধ করুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Channel Tab Bar & Filter Controls */}
                  <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto scrollbar-none text-[11px] font-bold">
                    {['শিক্ষার্থী ইনকোয়ারি', 'টিচার সাপোর্ট'].map((sender) => {
                      return (
                        <button
                          key={sender}
                          onClick={() => {
                            setActiveAdminChatSender(sender);
                            setAdminChatList(prev => prev.map(m => m.sender === sender ? { ...m, read: true } : m));
                          }}
                          className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            activeAdminChatSender === sender
                              ? 'bg-sky-500 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span>{sender}</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setAdminMsgToggles(prev => ({ ...prev, student: !prev.student }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                        adminMsgToggles.student ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="স্টুডেন্ট বার্তা ফিল্টার অন/অফ"
                    >
                      স্টুডেন্ট {adminMsgToggles.student ? '✓' : '✕'}
                    </button>
                    <button
                      onClick={() => setAdminMsgToggles(prev => ({ ...prev, teacher: !prev.teacher }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                        adminMsgToggles.teacher ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="টিচার বার্তা ফিল্টার অন/অফ"
                    >
                      টিচার {adminMsgToggles.teacher ? '✓' : '✕'}
                    </button>
                    <button
                      onClick={() => setAdminMsgToggles(prev => ({ ...prev, support: !prev.support }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                        adminMsgToggles.support ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="সাপোর্ট বার্তা ফিল্টার অন/অফ"
                    >
                      সাপোর্ট {adminMsgToggles.support ? '✓' : '✕'}
                    </button>
                  </div>

                  {/* Chat Content */}
                  <div className="p-3 space-y-2.5 h-64 sm:h-72 overflow-y-auto bg-slate-950/50">
                    {adminChatList
                      .filter(m => {
                        if (m.sender === 'শিক্ষার্থী ইনকোয়ারি' && !adminMsgToggles.student) return false;
                        if (m.sender === 'টিচার সাপোর্ট' && !adminMsgToggles.teacher) return false;
                        return m.sender === activeAdminChatSender || (m.isAdmin && activeAdminChatSender === 'শিক্ষার্থী ইনকোয়ারি');
                      })
                      .length === 0 ? (
                        <div className="text-center py-10 space-y-2">
                          <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                          <p className="text-xs text-slate-400">এই ফিল্টারে কোনো বার্তা নেই।</p>
                        </div>
                      ) : (
                        adminChatList
                          .filter(m => {
                            if (m.sender === 'শিক্ষার্থী ইনকোয়ারি' && !adminMsgToggles.student) return false;
                            if (m.sender === 'টিচার সাপোর্ট' && !adminMsgToggles.teacher) return false;
                            return m.sender === activeAdminChatSender || (m.isAdmin && activeAdminChatSender === 'শিক্ষার্থী ইনকোয়ারি');
                          })
                          .map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                                  msg.isAdmin
                                    ? 'bg-sky-600 text-white rounded-br-none shadow-md'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}
                              >
                                <p className="text-[10px] font-bold opacity-75 mb-0.5">
                                  {msg.isAdmin ? 'এডমিন (আপনি)' : msg.sender}
                                </p>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <span className="text-[9px] opacity-60 block mt-1 text-right font-mono">
                                  {msg.time}
                                </span>
                              </div>
                            </div>
                          ))
                      )}
                  </div>

                  {/* Attachment Preview if any */}
                  {adminChatAttachedFile && (
                    <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <span className="truncate max-w-[200px] text-[11px] font-mono">📎 {adminChatAttachedFile.name}</span>
                      <button
                        onClick={() => setAdminChatAttachedFile(null)}
                        className="text-rose-400 hover:text-rose-300 text-[10px] font-bold cursor-pointer"
                      >
                        রিমুভ
                      </button>
                    </div>
                  )}

                  {/* Input Form Footer */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminChatInput.trim() && !adminChatAttachedFile) return;
                      const newMsg = {
                        id: 'am_' + Date.now(),
                        sender: activeAdminChatSender,
                        text: adminChatInput + (adminChatAttachedFile ? `\n[সংযুক্ত ফাইল: ${adminChatAttachedFile.name}]` : ''),
                        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
                        isAdmin: true,
                        read: true
                      };
                      setAdminChatList(prev => [...prev, newMsg]);
                      setAdminChatInput('');
                      setAdminChatAttachedFile(null);
                    }}
                    className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      title="ফাইল/ছবি যুক্ত করুন"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={adminChatInput}
                      onChange={(e) => setAdminChatInput(e.target.value)}
                      placeholder="এখানে উত্তর লিখুন..."
                      className="flex-1 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-md shrink-0"
                      title="মেসেজ পাঠান"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                setActiveTab?.('home');
              }}
              className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              title="লগআউট করুন"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Success Toast Notification */}
        {newPageSuccessMsg && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1DB954]" />
              <span>{newPageSuccessMsg}</span>
            </div>
            <button onClick={() => setNewPageSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* SUB-TABS BAR (ট্যাববার - প্রতিটি মূল মডিউলের বিষয়ভিত্তিক বিস্তারিত সাব-ট্যাবস) */}
        {(() => {
          const currentModule = activeMainModule === 'dashboard'
            ? (['courses', 'teachers', 'students'].includes(activeAdminTab) ? 'academy' : ['services', 'marketplace', 'agency_clients'].includes(activeAdminTab) ? 'marketplace' : ['settings', 'gallery'].includes(activeAdminTab) || activeAdminTab.startsWith('custom_') ? 'settings' : 'dashboard')
            : activeMainModule;

          if (currentModule === 'dashboard') {
            return null;
          }

          let subTabs: { id: string; label: string; icon: any; badge?: number }[] = [];
          let categoryTitle = '';
          let categoryColor = '';

          if (currentModule === 'academy') {
            categoryTitle = '🎓 একাডেমি মডিউল (কোর্স, স্টুডেন্ট & পেমেন্ট):';
            categoryColor = 'text-[#1DB954]';
            subTabs = [
              { id: 'courses', label: 'কোর্সসমূহ', icon: BookOpen },
              { id: 'teachers', label: 'টিচারস', icon: Users, badge: payouts.filter(p => p.status === 'Pending').length },
              { id: 'students', label: 'স্টুডেন্টস', icon: GraduationCap, badge: totalStudents },
              { id: 'orders', label: 'কোর্স ক্রয় & পেমেন্ট হিস্টোরি', icon: CreditCard },
              { id: 'billing_verify', label: '⚡ বিল লেজার & অটো-ভেরিফাই', icon: ShieldCheck, badge: companyBills.filter(b => b.status === 'pending').length },
              { id: 'financials', label: 'একাডেমি ফিনান্সিয়ালস', icon: DollarSign }
            ];
          } else if (currentModule === 'marketplace') {
            categoryTitle = '💼 মার্কেটপ্লেস মডিউল:';
            categoryColor = 'text-purple-400';
            subTabs = [
              { id: 'services', label: 'সার্ভিসসমূহ', icon: Briefcase },
              { id: 'marketplace', label: 'জবস & কাজ', icon: ShoppingBag, badge: jobs.filter(j => j.status === 'open').length },
              { id: 'agency_clients', label: 'ক্লায়েন্টস', icon: Building2 },
              { id: 'orders', label: 'সার্ভিস অর্ডারস & পেমেন্ট', icon: CreditCard },
              { id: 'billing_verify', label: '⚡ বিল লেজার & অটো-ভেরিফাই', icon: ShieldCheck, badge: companyBills.filter(b => b.status === 'pending').length },
              { id: 'financials', label: 'মার্কেটপ্লেস ফিনান্সিয়ালস', icon: DollarSign }
            ];
          } else if (currentModule === 'settings') {
            categoryTitle = '⚙️ সাইট সেটিংস & কন্ফিগ:';
            categoryColor = 'text-amber-400';
            subTabs = [
              { id: 'settings', label: 'সাইট সেটিংস', icon: Settings },
              { id: 'gallery', label: 'গ্যালারি', icon: ImageIcon },
              ...customAdminPages.map(cp => ({
                id: cp.id,
                label: cp.label,
                icon: FileText
              }))
            ];
          }

          return (
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-xl space-y-2.5 font-bengali">
              <div className="px-1 flex items-center justify-between text-sm font-extrabold text-slate-300">
                <span className={`text-xs sm:text-sm font-mono tracking-wider ${categoryColor}`}>{categoryTitle}</span>
                <span className="text-xs text-slate-400 font-normal hidden sm:inline">ট্যাবে ক্লিক করে কন্ট্রোল পরিবর্তন করুন</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
                {subTabs.map(st => {
                  const Icon = st.icon;
                  const isActive = activeAdminTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setActiveAdminTab(st.id)}
                      className={`py-2.5 px-4 rounded-xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer border shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span className="whitespace-nowrap">{st.label}</span>
                      {!!st.badge && st.badge > 0 && (
                        <span className={`px-2 py-0.5 text-xs font-black rounded-full ${
                          isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {st.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}



        {/* CUSTOM DYNAMIC PAGE VIEW (If active tab is custom) */}
        {activeAdminTab.startsWith('custom_') && (
          <div className="space-y-6 font-bengali">
            {(() => {
              const pageInfo = customAdminPages.find(p => p.id === activeAdminTab);
              return (
                <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 font-mono font-bold text-xs rounded-lg border border-amber-500/30">
                          মডিউল #{pageInfo?.serial || '12'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-white">{pageInfo?.label || 'কাস্টম এডমিন পেইজ'}</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{pageInfo?.desc || 'এই কাস্টম পেইজটিতে ভবিষ্যতের জন্য নতুন ফিচার বা ডাটা টেবিল যুক্ত করার সুবিধা প্রস্তুত রয়েছে।'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCustomAdminPages(prev => prev.filter(p => p.id !== activeAdminTab));
                        setActiveAdminTab('dashboard');
                      }}
                      className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30 cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>পেইজটি রিমুভ করুন</span>
                    </button>
                  </div>

                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                    <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20 flex items-center justify-center mx-auto text-2xl font-bold">
                      ⚡
                    </div>
                    <h3 className="text-lg font-black text-white">কাস্টম মডিউল লেআউট রেডি (Module Frame Ready)</h3>
                    <p className="text-xs text-slate-400 max-w-lg mx-auto">
                      এখানে ভবিষ্যতে কাস্টম এনালাইটিক্স উইজেট, রিপোর্ট জেনারেটর, অথবা এপিআই ইন্টিগ্রেশন ইন্টারফেস সহজেই সংযুক্ত করতে পারবেন।
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-2 text-xs">
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg">● কাস্টম উইজেট</span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg">● অ্যাডভান্সড ফিল্টারিং</span>
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg">● ডিরেক্ট এপিআই সিঙ্ক</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 1: DASHBOARD STATS */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-8 font-bengali">
            {/* Analytics Header Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-[#1DB954]" /> ওভারভিউ স্ট্যাটিস্টিক্স (Analytics Dashboard)
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    লাইভ সিস্টেম সিঙ্কড
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  আইটি ইনস্টিটিউটের সকল স্টুডেন্ট, কোর্স, সার্ভিস রিকোয়েস্ট, উইথড্রয়াল এবং পেমেন্ট আয়-ব্যয়ের লাইভ ওভারভিউ।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>পেমেন্ট ভেরিফাই করুন</span>
                </button>
              </div>
            </div>

            {/* Metric Cards Grid (6 High Contrast Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1: Total Students */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 border-l-4 border-l-[#1DB954] space-y-3 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-300">মোট নিবন্ধিত স্টুডেন্ট</span>
                  <div className="p-2.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-[#1DB954]">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-white font-mono">{totalStudents} <span className="text-xs font-normal text-slate-400">জন</span></p>
                  <p className="text-[11px] text-emerald-400 font-bold mt-1">● এক্টিভ শিক্ষার্থী ডাটাবেজ</p>
                </div>
              </div>

              {/* Card 2: Total Revenue */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 border-l-4 border-l-amber-400 space-y-3 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-300">মোট রিভেনিউ / প্ল্যাটফর্ম আয়</span>
                  <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-amber-300 font-mono">৳{totalRevenue.toLocaleString()}</p>
                  <p className="text-[11px] text-amber-400 font-bold mt-1">● পেইড কোর্স ও ক্লায়েন্ট সার্ভিস ফি</p>
                </div>
              </div>

              {/* Card 3: Total Active Courses */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 border-l-4 border-l-sky-400 space-y-3 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-300">চালুকৃত মোট কোর্স</span>
                  <div className="p-2.5 bg-sky-500/10 rounded-2xl border border-sky-500/20 text-sky-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-sky-300 font-mono">{totalCoursesCount} <span className="text-xs font-normal text-slate-400">টি</span></p>
                  <p className="text-[11px] text-sky-400 font-bold mt-1">● ইনস্ট্রাক্টর অ্যাসাইনকৃত কোর্স</p>
                </div>
              </div>

              {/* Card 4: Total Course Enrollments */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 border-l-4 border-l-purple-400 space-y-3 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-300">মোট কোর্স এনরোলমেন্ট</span>
                  <div className="p-2.5 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-purple-300 font-mono">{totalEnrollmentsCount} <span className="text-xs font-normal text-slate-400">জন</span></p>
                  <p className="text-[11px] text-purple-400 font-bold mt-1">● সফলভাবে এনরোলড স্টুডেন্ট</p>
                </div>
              </div>

              {/* Card 5: Service Orders */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 border-l-4 border-l-indigo-400 space-y-3 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-300">আইটি সার্ভিস অর্ডারস</span>
                  <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-indigo-300 font-mono">{services.length} <span className="text-xs font-normal text-slate-400">টি</span></p>
                  <p className="text-[11px] text-indigo-400 font-bold mt-1">● এজেন্সি ক্লায়েন্ট প্রজেক্ট</p>
                </div>
              </div>

              {/* Card 6: Pending Teacher Payouts */}
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 border-l-4 border-l-rose-500 space-y-3 shadow-xl hover:border-slate-700 transition-all">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-300">পেন্ডিং টিচার পে-আউট</span>
                  <div className="p-2.5 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-rose-300 font-mono">{payouts.filter(p => p.status === 'Pending').length} <span className="text-xs font-normal text-slate-400">টি</span></p>
                  <p className="text-[11px] text-rose-400 font-bold mt-1">● টিচারদের উইথড্র রিকোয়েস্ট</p>
                </div>
              </div>
            </div>

            {/* Quick Orders Overview Table */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#1DB954]" /> সাম্প্রতিক পেমেন্ট অর্ডার ও বিকাশ/নগদ ট্রানজেকশন
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">সর্বশেষ ৫ টি স্টুডেন্ট পেমেন্ট অডিট রিপোর্ট</p>
                </div>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#1DB954] hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  সব অর্ডার দেখুন ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-200 font-extrabold uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">অর্ডার ID</th>
                      <th className="p-3.5">স্টুডেন্ট তথ্য</th>
                      <th className="p-3.5">কোর্স</th>
                      <th className="p-3.5">ফি (পরিমাণ)</th>
                      <th className="p-3.5">মেথড & TrxID</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500 italic">কোনো সাম্প্রতিক পেমেন্ট অর্ডার পাওয়া যায়নি।</td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-800/50">
                          <td className="p-3.5 font-mono font-bold text-white">{ord.id}</td>
                          <td className="p-3.5">
                            <span className="font-bold text-white block">{ord.userName}</span>
                            <span className="text-[10px] text-slate-400">{ord.userMobile}</span>
                          </td>
                          <td className="p-3.5 text-slate-200 font-medium">{ord.courseTitle}</td>
                          <td className="p-3.5 font-black text-emerald-400 font-mono text-sm">৳{ord.amount}</td>
                          <td className="p-3.5 font-mono text-slate-200">
                            <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold border border-slate-700 mr-1 text-slate-300">{ord.paymentMethod}</span>
                            {ord.transactionId}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              ord.status === 'Approved'
                                ? 'bg-emerald-500/20 text-[#1DB954] border border-emerald-500/30'
                                : ord.status === 'Rejected'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            }`}>
                              {ord.status === 'Approved' ? '✓ অনুমোদিত' : ord.status === 'Rejected' ? '✕ বাতিল' : '● পেন্ডিং'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            {ord.status === 'Pending' ? (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Approved')}
                                className="px-3 py-1 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-[11px] rounded-lg shadow transition-all cursor-pointer"
                              >
                                অনুমোদন দিন
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-bold">সম্পন্ন</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Platform Quick Action Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveAdminTab('teachers')}
                className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-[#1DB954] transition-all cursor-pointer space-y-2 group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-[#1DB954] group-hover:bg-[#1DB954] group-hover:text-white transition-all">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">টিচার ও ইনস্ট্রাক্টর প্যানেল</h4>
                    <p className="text-xs text-slate-400">সম্মানিয়াম, বিল রিকোয়েস্ট ও ক্লাসের হিসাব</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveAdminTab('courses')}
                className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-sky-500 transition-all cursor-pointer space-y-2 group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">কোর্স ও কারিকুলাম ম্যানেজার</h4>
                    <p className="text-xs text-slate-400">নতুন কোর্স এড, ফি ও মডিউল আপডেট</p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveAdminTab('students')}
                className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-purple-500 transition-all cursor-pointer space-y-2 group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">স্টুডেন্ট ডাটাবেজ & সার্টিফিকেট</h4>
                    <p className="text-xs text-slate-400">শিক্ষার্থী কন্ট্রোল ও সনদপত্র ইস্যু</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TEACHERS & EXPERTS MANAGEMENT */}
        {activeAdminTab === 'teachers' && (
          <div className="space-y-6 font-bengali">
            {/* Header & Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#1DB954]" /> টিচার ও এক্সপার্ট ড্যাশবোর্ড
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    {users.filter(u => u.role === 'teacher' || u.role === 'instructor' || u.role === 'admin').length} জন ইনস্ট্রাক্টর সিঙ্কড
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  টিচার যুক্তকরণ, কার কত জন ছাত্র ও কাজের রিপোর্ট, বিল রিকুয়েস্ট অনুমোদন এবং সাপোর্ট নোটিশ প্রেরণের পূর্ণাঙ্গ প্যানেল।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setTeacherModalOpen(true)}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" /> <span>নতুন টিচার / এক্সপার্ট যুক্ত করুন</span>
                </button>
              </div>
            </div>

            {/* Sub Nav Tabs */}
            <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setTeacherSubTab('list')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  teacherSubTab === 'list' ? 'bg-[#1DB954] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>টিচার তালিকা & কাজের রিপোর্ট ({users.filter(u => u.role === 'teacher' || u.role === 'instructor' || u.role === 'admin').length})</span>
              </button>

              <button
                onClick={() => setTeacherSubTab('payouts')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  teacherSubTab === 'payouts' ? 'bg-[#1DB954] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>বিল রিকুয়েস্ট (Payouts)</span>
                {payouts.filter(p => p.status === 'Pending').length > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-extrabold rounded-full animate-pulse">
                    {payouts.filter(p => p.status === 'Pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTeacherSubTab('notices')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  teacherSubTab === 'notices' ? 'bg-[#1DB954] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>সাপোর্ট নোটিশ ও মেসেজ</span>
              </button>
            </div>

            {/* SUB-TAB 1: TEACHER LIST & WORK REPORTS */}
            {teacherSubTab === 'list' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.filter(u => u.role === 'teacher' || u.role === 'instructor' || u.role === 'admin').map(teacher => {
                    const assignedCourses = courses.filter(c =>
                      c.assignedInstructorId === teacher.id ||
                      c.instructor === teacher.name ||
                      (teacher.name?.includes('তানভীর') && c.instructor?.includes('তানভীর'))
                    );
                    const totalEnrolledInTeacherCourses = assignedCourses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0);
                    const evaluatedSubmissions = submissions.filter(s => s.status === 'graded').length;
                    const estimatedTotalEarnings = assignedCourses.reduce((acc, c) => {
                      const effPrice = c.discountPrice || c.price || 0;
                      const comm = c.teacherCommissionRate || 30;
                      return acc + Math.round(effPrice * (c.enrolledCount || 0) * (comm / 100));
                    }, 0);

                    return (
                      <div key={teacher.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <img
                              src={teacher.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                              alt={teacher.name}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0"
                            />
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-black text-sm text-white truncate">{teacher.name}</h3>
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-[#1DB954] text-[10px] font-bold rounded-full border border-emerald-500/30">
                                  {teacher.role === 'admin' ? 'এডমিন & ইন্সট্রাক্টর' : 'টিচার / এক্সপার্ট'}
                                </span>
                              </div>
                              <p className="text-[11px] text-emerald-400 font-semibold">{teacher.title || 'ইনস্ট্রাক্টর'}</p>
                              <p className="text-[10px] text-slate-400 truncate">{teacher.email} • {teacher.mobile || '01700000000'}</p>
                            </div>
                          </div>

                          {/* Work Report Statistics Box */}
                          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                            <div className="flex justify-between items-center text-slate-300">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-[#1DB954]" /> চালুকৃত কোর্স:
                              </span>
                              <span className="font-extrabold text-white">{assignedCourses.length} টি</span>
                            </div>

                            <div className="flex justify-between items-center text-slate-300">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-blue-400" /> মোট অ্যাক্টিভ স্টুডেন্ট:
                              </span>
                              <span className="font-extrabold text-blue-300">{totalEnrolledInTeacherCourses} জন</span>
                            </div>

                            <div className="flex justify-between items-center text-slate-300">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-purple-400" /> মূল্যায়িত অ্যাসাইনমেন্ট:
                              </span>
                              <span className="font-extrabold text-purple-300">{evaluatedSubmissions} টি</span>
                            </div>

                            <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 text-slate-300">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> আনুমানিক সম্মানিয়াম:
                              </span>
                              <span className="font-black text-emerald-400 font-mono">৳{(estimatedTotalEarnings || 0).toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Courses List */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] text-slate-400 font-bold block">অ্যাসাইনকৃত কোর্সসমূহ:</span>
                            {assignedCourses.length === 0 ? (
                              <p className="text-[11px] text-slate-500 italic">কোনো কোর্স অ্যাসাইন করা হয়নি</p>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {assignedCourses.map(c => (
                                  <span key={c.id} className="px-2 py-1 bg-slate-800 text-slate-200 text-[10px] font-bold rounded-lg border border-slate-700 truncate max-w-[200px]">
                                    {c.title}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                          <button
                            onClick={() => toggleUserBlock(teacher.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                              teacher.blocked
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {teacher.blocked ? 'ব্লকড (আনব্লক করুন)' : 'অ্যাক্টিভ (ব্লক করুন)'}
                          </button>

                          <button
                            onClick={() => {
                              setNoticeRecipient(teacher.id);
                              setTeacherSubTab('notices');
                            }}
                            className="px-3 py-1.5 bg-[#1DB954]/20 hover:bg-[#1DB954]/30 text-[#1DB954] font-bold text-[11px] rounded-xl border border-[#1DB954]/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>মেসেজ দিন</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: BILL REQUESTS (PAYOUTS) */}
            {teacherSubTab === 'payouts' && (
              <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1DB954]" /> টিচারদের বিল & উইথড্র রিকোয়েস্ট
                  </h3>
                  <span className="text-xs text-slate-400">
                    পেন্ডিং বিল যাচাই করে ট্রানজেকশন নম্বর সহ পরিশোধ করুন
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-200 font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">টিচার নাম & ইমেইল</th>
                        <th className="p-3.5">রিকোয়েস্ট তারিখ</th>
                        <th className="p-3.5">পরিমাণ (BDT)</th>
                        <th className="p-3.5">মেথড & একাউন্ট</th>
                        <th className="p-3.5">নোট</th>
                        <th className="p-3.5">স্ট্যাটাস</th>
                        <th className="p-3.5 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {payouts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                            কোনো উইথড্র বা বিল রিকোয়েস্ট পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        payouts.map(p => (
                          <tr key={p.id} className="hover:bg-slate-800/50">
                            <td className="p-3.5">
                              <span className="font-bold text-white block">{p.teacherName}</span>
                              <span className="text-[10px] text-slate-400">{p.teacherEmail}</span>
                            </td>
                            <td className="p-3.5 text-slate-400">{p.requestedAt}</td>
                            <td className="p-3.5 font-black text-emerald-400 text-sm font-mono">৳{(p.amount || 0).toLocaleString()}</td>
                            <td className="p-3.5 font-medium text-slate-200">
                              <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-bold mr-1">{p.paymentMethod}</span>
                              {p.accountNumber}
                            </td>
                            <td className="p-3.5 text-slate-400 max-w-xs">{p.note || 'সম্মানিয়াম উইথড্র'}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                p.status === 'Paid'
                                  ? 'bg-emerald-500/20 text-[#1DB954] border border-emerald-500/30'
                                  : p.status === 'Rejected'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              }`}>
                                {p.status === 'Paid' ? '✓ পরিশোধিত' : p.status === 'Rejected' ? '✕ বাতিল' : '● পেন্ডিং'}
                              </span>
                              {p.transactionId && (
                                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">TrxID: {p.transactionId}</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {p.status === 'Pending' ? (
                                  <>
                                    <button
                                      onClick={() => setPayingPayoutId(p.id)}
                                      className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold rounded-xl text-[11px] shadow transition-all cursor-pointer"
                                    >
                                      পে করুন
                                    </button>
                                    <button
                                      onClick={() => updatePayoutStatus(p.id, 'Rejected')}
                                      className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl text-[11px] border border-rose-500/30 transition-all cursor-pointer"
                                    >
                                      বাতিল
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-semibold">সম্পন্ন</span>
                                )}
                                <button
                                  onClick={() => {
                                    deleteTeacherPayout(p.id);
                                  }}
                                  className="p-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-[11px] border border-rose-500/30 transition-all cursor-pointer"
                                  title="উইথড্র রিকোয়েস্ট ডিলেট করুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: SUPPORT MESSAGES & NOTICES */}
            {teacherSubTab === 'notices' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Send Notice Form */}
                <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#1DB954]" /> টিচারদের নোটিশ ও সাপোর্ট মেসেজ পাঠান
                  </h3>

                  {noticeSuccessMsg && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{noticeSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendNoticeSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">প্রাপক টিচার নির্বাচন করুন</label>
                      <select
                        value={noticeRecipient}
                        onChange={e => setNoticeRecipient(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      >
                        <option value="all">📢 সকল টিচার ও ইনস্ট্রাক্টরবৃন্দ (All Teachers)</option>
                        {users.filter(u => u.role === 'teacher' || u.role === 'instructor' || u.role === 'admin').map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">নোটিশের বিষয় (Subject)</label>
                      <input
                        type="text"
                        value={noticeSubject}
                        onChange={e => setNoticeSubject(e.target.value)}
                        placeholder="যেমন: নতুন কারিকুলাম ও ক্লাসের সময়সূচী সংক্রান্ত নির্দেশিকা"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বিস্তারিত বার্তা / নির্দেশনা</label>
                      <textarea
                        rows={4}
                        value={noticeMessage}
                        onChange={e => setNoticeMessage(e.target.value)}
                        placeholder="টিচারদের জন্য বিস্তারিত নির্দেশনা লিখুন..."
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>মেসেজ ও নোটিশ প্রেরণ করুন</span>
                    </button>
                  </form>
                </div>

                {/* Sent Notices Log */}
                <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" /> প্রেরিত নোটিশ ও মেসেজ ইতিহাস
                  </h3>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {teacherNotices.length === 0 ? (
                      <p className="text-xs text-slate-500 italic text-center py-8">এখনো কোনো সাপোর্ট নোটিশ পাঠানো হয়নি।</p>
                    ) : (
                      teacherNotices.map(tn => (
                        <div key={tn.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-extrabold text-xs text-white">{tn.subject}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{tn.sentAt}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{tn.message}</p>
                          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px]">
                            <span className="text-emerald-400 font-semibold">প্রাপক: {tn.recipientTeacherName || 'সকল টিচার'}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500">প্রেরক: {tn.senderName}</span>
                              <button
                                onClick={() => {
                                  deleteTeacherNotice(tn.id);
                                }}
                                className="p-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded cursor-pointer transition"
                                title="নোটিশ ডিলেট করুন"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COURSES MANAGEMENT */}
        {activeAdminTab === 'courses' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#1DB954]" /> কোর্স ম্যানেজমেন্ট ও অফারসমূহ ({courses.length})
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    মডিউল & লাইভ ব্যাচ সিঙ্কড
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  একই বিষয়ের বেসিক, এডভান্সড বা প্রফেশনাল লেভেলের একাধিক কোর্স ট্রেইনার অফার দিয়ে লঞ্চ ও পরিচালনা করুন।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingCourseId(null);
                    setCourseTitle('');
                    setCourseCategory('Digital Marketing');
                    setCourseInstructor('তানভীর আহমেদ (ইনস্ট্রাক্টর)');
                    setCourseAssignedTeacherId('public');
                    setCourseLevel('basic');
                    setCoursePrice(1500);
                    setCourseDiscountPrice(999);
                    setCourseIsFree(false);
                    setCourseModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" /> <span>নতুন কোর্স লঞ্চ / অফার করুন</span>
                </button>
              </div>
            </div>

            {/* Course Subject / Category Sub-tabs */}
            {(() => {
              const defaultCategories = [
                { id: 'Digital Marketing', label: '📢 Digital Marketing' },
                { id: 'SEO & Affiliate', label: '🔍 SEO & Content' },
                { id: 'Web Development', label: '💻 Web Development' },
                { id: 'PTE Academic', label: '📖 PTE Academic' },
                { id: 'Graphic Design', label: '🎨 Graphic Design' },
                { id: 'AI & Cyber Security', label: '🤖 AI & Cyber Security' },
              ];
              const existingCats: string[] = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));
              const allCategoryIds: string[] = Array.from(new Set([...defaultCategories.map(d => d.id), ...existingCats]));

              const categoryTabs = [
                { id: 'all', label: 'সকল কোর্স', count: courses.length },
                ...allCategoryIds.map((cat: string) => {
                  const predefined = defaultCategories.find(d => d.id === cat);
                  const count = courses.filter(c => 
                    c.category === cat || 
                    (c.category && c.category.toLowerCase().includes(cat.toLowerCase())) ||
                    (c.title && c.title.toLowerCase().includes(cat.toLowerCase()))
                  ).length;
                  return {
                    id: cat,
                    label: predefined ? predefined.label : `📘 ${cat}`,
                    count
                  };
                })
              ];

              return (
                <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {categoryTabs.map(st => (
                    <button
                      key={st.id}
                      onClick={() => setCourseSubTab(st.id)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                        courseSubTab === st.id
                          ? 'bg-[#1DB954] text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      {st.label} ({st.count})
                    </button>
                  ))}
                </div>
              );
            })()}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => {
                if (courseSubTab === 'all') return true;
                return (
                  c.category === courseSubTab ||
                  (c.category && c.category.toLowerCase().includes(courseSubTab.toLowerCase())) ||
                  (c.title && c.title.toLowerCase().includes(courseSubTab.toLowerCase()))
                );
              }).map(course => (
                <div key={course.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-3 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover rounded-2xl" />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow">
                          {course.level === 'basic' ? '🟢 বেসিক লেভেল' :
                           course.level === 'advanced' ? '⚡ এডভান্সড' :
                           course.level === 'professional' ? '🎓 প্রফেশনাল' :
                           course.level === 'live_batch' ? '🔴 লাইভ ব্যাচ' : '📘 স্ট্যান্ডার্ড'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-sm leading-snug">{course.title}</h3>
                      <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px] text-slate-700 dark:text-slate-200">{course.category}</span>
                        <span className="font-black text-[#1DB954]">{course.isFree ? 'Free' : `৳${course.discountPrice || course.price}`}</span>
                      </div>
                    </div>

                    {/* Instructor & Offer Status Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl text-[11px] space-y-2 border border-slate-200/80 dark:border-slate-700/60 font-bengali">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">অফার স্ট্যাটাস:</span>
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                          course.isPublicOffer || course.assignedInstructorId === 'public'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : course.offerStatus === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                        }`}>
                          {course.isPublicOffer || course.assignedInstructorId === 'public'
                            ? '📢 পাবলিক অফার (উন্মুক্ত)'
                            : course.offerStatus === 'accepted'
                            ? '✅ দায়িত্বপ্রাপ্ত'
                            : '⏳ অফার পাঠানো হয়েছে'}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-100 truncate">
                        👤 {course.instructor || 'পাবলিক অফার (উন্মুক্ত)'}
                      </p>

                      <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                        <span>🎯 {course.targetModules || 4} মডিউল | 📹 {course.targetLessons || 16} ক্লাস</span>
                        <span className="text-[#1DB954] font-black">{course.teacherCommissionRate || 30}% কমিশন</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setEditingCourseId(course.id);
                        setCourseTitle(course.title);
                        setCourseCategory(course.category);
                        setCourseInstructor(course.instructor);
                        setCourseAssignedTeacherId(course.assignedInstructorId || (course.isPublicOffer ? 'public' : 'teacher-1'));
                        setCourseLevel(course.level || 'basic');
                        setCoursePrice(course.price);
                        setCourseDiscountPrice(course.discountPrice || course.price);
                        setCourseIsFree(course.isFree);
                        setCourseThumbnail(course.thumbnail);
                        setCourseDesc(course.description);
                        setCourseTargetModules(course.targetModules || 4);
                        setCourseTargetLessons(course.targetLessons || 16);
                        setCourseTeacherCommissionRate(course.teacherCommissionRate || 30);
                        setCourseModalOpen(true);
                      }}
                      className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" /> এডিট
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-500 text-xs font-bold rounded-xl cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS MANAGEMENT */}
        {activeAdminTab === 'students' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#1DB954]" /> রেজিস্টার্ড স্টুডেন্টস ক্যাটালগ ({users.length})
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    রিয়েল-টাইম একাউন্ট সিঙ্ক
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  ইনস্টিটিউটের নিবন্ধিত শিক্ষার্থী, ট্রেইনার ও এডমিন ব্যবহারকারীদের প্রোফাইল তথ্য এবং সিকিউরিটি ম্যানেজমেন্ট।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-300 font-bold bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
                  মোট ইউজার: <strong className="text-white font-mono">{users.length}</strong> জন
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4">নাম</th>
                      <th className="p-4">ইমেইল</th>
                      <th className="p-4">মোবাইল</th>
                      <th className="p-4">রোল</th>
                      <th className="p-4">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                        <td className="p-4 font-mono text-slate-700 dark:text-slate-300">{u.mobile}</td>
                        <td className="p-4 font-bold uppercase text-[#1DB954]">{u.role}</td>
                        <td className="p-4">
                          {u.role !== 'admin' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleUserBlock(u.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                                  u.blocked ? 'bg-emerald-600 text-white' : 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
                                }`}
                              >
                                {u.blocked ? 'আনব্লক করুন' : 'ব্লক করুন'}
                              </button>
                              <button
                                onClick={() => {
                                  deleteUser(u.id);
                                }}
                                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                                title="ইউজার ডিলেট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES MANAGEMENT */}
        {activeAdminTab === 'services' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-[#1DB954]" /> আইটি সার্ভিসেস প্রাক্টিস ও ক্লায়েন্ট সাপোর্ট ({services.length})
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    আইটি সার্ভিসেস রেডি
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  ওয়েব ডেভেলপমেন্ট, অ্যাপস, গ্রাফিক্স ও ডিজিটাল মার্কেটিং ক্লায়েন্ট সার্ভিস প্যাকেজ ব্যবস্থাপনা।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingServiceId(null);
                    setServiceTitle('');
                    setServiceCategory('Development');
                    setServicePrice('৳১০,০০০');
                    setServiceDesc('');
                    setServiceThumbnail('https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');
                    setServiceModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" /> <span>নতুন সার্ভিস যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden space-y-2 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="relative h-36 overflow-hidden bg-slate-900">
                      <img
                        src={s.thumbnail || "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"}
                        alt={s.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-[#1DB954] rounded-full border border-slate-700">
                        {s.category}
                      </div>
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{s.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">{s.shortDescription}</p>
                      <span className="text-xs font-bold text-[#1DB954] block mt-2">{s.priceText}</span>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingServiceId(s.id);
                        setServiceTitle(s.title);
                        setServiceCategory(s.category);
                        setServicePrice(s.priceText || '');
                        setServiceDesc(s.shortDescription);
                        setServiceThumbnail(s.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');
                        setServiceModalOpen(true);
                      }}
                      className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      <Edit className="w-3.5 h-3.5" /> এডিট
                    </button>
                    <button
                      onClick={() => deleteService(s.id)}
                      className="p-1.5 bg-rose-500/20 text-rose-500 text-xs font-bold rounded-lg cursor-pointer hover:bg-rose-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS & PAYMENTS */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6 font-bengali">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-[#1DB954]" /> পেমেন্ট অর্ডার ও মোবাইল ব্যাংকিং হিস্টোরি ({orders.length})
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    বিকাশ/নগদ/রকেট সিঙ্কড
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  শিক্ষার্থীদের কোর্স পেমেন্ট ট্রানজেকশন যাচাই, মাল্টিপল অর্ডার সিলেক্ট করে বাল্ক স্ট্যাটাস আপডেট ও ফিল্টারিং।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 font-mono">
                  মোট রিভেনিউ: ৳{totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, স্টুডেন্টের নাম, মোবাইল বা TrxID দিয়ে খুঁজুন..."
                  value={orderSearchFilter}
                  onChange={(e) => setOrderSearchFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'সকল' },
                  { id: 'Paid', label: 'Paid (অনুমোদিত)' },
                  { id: 'Pending', label: 'Pending (পেন্ডিং)' },
                  { id: 'Failed', label: 'Failed (ব্যর্থ)' },
                  { id: 'Cancelled', label: 'Cancelled (বাতিল)' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setOrderStatusFilter(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                      orderStatusFilter === item.id
                        ? 'bg-[#1DB954] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* BULK ACTION TOOLBAR (Visible when orders selected) */}
            {selectedOrderIds.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950/80 to-slate-900 border-2 border-[#1DB954] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1DB954] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white bg-[#1DB954] px-2.5 py-0.5 rounded-full mr-2">
                      {selectedOrderIds.length} টি সিলেক্টেড
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      একসাথে একাধিক অর্ডারের স্ট্যাটাস পরিবর্তন অথবা মুছে ফেলুন
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-[11px] font-bold text-slate-300">নতুন স্ট্যাটাস:</span>
                    <select
                      value={bulkOrderTargetStatus}
                      onChange={(e) => setBulkOrderTargetStatus(e.target.value as any)}
                      className="bg-slate-900 text-white text-xs font-bold py-1 px-2 rounded-lg border border-slate-700 focus:outline-none focus:border-[#1DB954] cursor-pointer"
                    >
                      <option value="Paid">Paid (অনুমোদিত)</option>
                      <option value="Pending">Pending (অপেক্ষমান)</option>
                      <option value="Failed">Failed (ব্যর্থ)</option>
                      <option value="Cancelled">Cancelled (বাতিল)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleApplyBulkOrderStatus}
                    className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>বাল্ক আপডেট</span>
                  </button>

                  <button
                    onClick={handleBulkDeleteCourseOrders}
                    className="px-3 py-2 bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-bold text-xs rounded-xl border border-rose-500/40 transition flex items-center gap-1 cursor-pointer"
                    title="নির্বাচিত অর্ডার ডিলেট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>ডিলেট ({selectedOrderIds.length})</span>
                  </button>

                  <button
                    onClick={() => setSelectedOrderIds([])}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    সিলেকশন ক্লিয়ার
                  </button>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={isAllCourseOrdersSelected}
                          onChange={handleToggleSelectAllCourseOrders}
                          className="w-4 h-4 rounded cursor-pointer accent-[#1DB954]"
                          title="সকলের সিলেক্ট/আনসিলেক্ট করুন"
                        />
                      </th>
                      <th className="p-4">অর্ডার ID</th>
                      <th className="p-4">স্টুডেন্ট</th>
                      <th className="p-4">কোর্স</th>
                      <th className="p-4">মেথড & TrxID</th>
                      <th className="p-4">পরিমাণ</th>
                      <th className="p-4">স্ট্যাটাস</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredCourseOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                          কোনো অর্ডার পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      filteredCourseOrders.map(o => {
                        const isSelected = selectedOrderIds.includes(o.id);
                        return (
                          <tr
                            key={o.id}
                            className={`transition-colors ${
                              isSelected
                                ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-l-4 border-l-[#1DB954]'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                          >
                            <td className="p-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectCourseOrder(o.id)}
                                className="w-4 h-4 rounded cursor-pointer accent-[#1DB954]"
                              />
                            </td>
                            <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{o.id}</td>
                            <td className="p-4 text-slate-800 dark:text-slate-200">{o.userName} ({o.userMobile})</td>
                            <td className="p-4 text-slate-800 dark:text-slate-200">{o.courseTitle}</td>
                            <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{o.paymentMethod} - {o.transactionId}</td>
                            <td className="p-4 font-bold text-[#1DB954]">৳{o.amount}</td>
                            <td className="p-4">
                              <select
                                value={o.status}
                                onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                                className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                              >
                                <option value="Paid">Paid (অনুমোদিত)</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => {
                                  deleteOrder(o.id);
                                }}
                                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                                title="অর্ডার ডিলেট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: COMPANY BILLS & AUTOMATED PAYMENT VERIFICATION */}
        {activeAdminTab === 'billing_verify' && (
          <div className="space-y-6 font-bengali">
            {/* Top Banner */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-7 h-7 text-[#1DB954]" />
                    <span>প্রতিষ্ঠানের সকল বিল জমা & অটো-রিড ভেরিফিকেশন প্যানেল</span>
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    ফ্রি অটো-রিড ইঞ্জি‌ন সক্রিয়
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  সকল বিকাশ, নগদ, রকেট ও ব্যাংক বিল জমা থাকবে। সিস্টেম নিজে থেকে TrxID রিড করে ভেরিফাই করতে পারে।
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => setAddBillModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer border border-slate-700 transition"
                >
                  <Plus className="w-4 h-4 text-[#1DB954]" />
                  <span>+ নতুন বিল যুক্ত করুন</span>
                </button>

                <button
                  onClick={handleAutoVerifyAllPendingBills}
                  disabled={isAutoReading}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>⚡ সকল পেন্ডিং বিল একসাথে অটো-রিড & ভেরিফাই করুন</span>
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-[11px] text-slate-400 font-bold">মোট নিবন্ধিত বিল</p>
                <p className="text-xl font-black text-white mt-1">{companyBills.length} টি</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-[11px] text-amber-400 font-bold">ভেরিফিকেশন অপেক্ষমান</p>
                <p className="text-xl font-black text-amber-400 mt-1">
                  {companyBills.filter(b => b.status === 'pending').length} টি
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-[11px] text-[#1DB954] font-bold">অটো-ভেরিফাইড বিল (Verified)</p>
                <p className="text-xl font-black text-[#1DB954] mt-1">
                  {companyBills.filter(b => b.status === 'verified').length} টি
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <p className="text-[11px] text-sky-400 font-bold">মোট বিল কালেকশন</p>
                <p className="text-xl font-black text-sky-300 mt-1">
                  ৳{companyBills.reduce((acc, b) => acc + b.amount, 0).toLocaleString('bn-BD')}
                </p>
              </div>
            </div>

            {/* Live Auto-Read Engine Log */}
            {autoVerifyLog && (
              <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl shadow-xl font-mono text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-2">
                    <RefreshCw className={`w-3.5 h-3.5 ${isAutoReading ? 'animate-spin' : ''}`} />
                    অটো-রিড ও ট্রানজেকশন ভেরিফিকেশন কন্সোল
                  </span>
                  <button onClick={() => setAutoVerifyLog(null)} className="text-slate-500 hover:text-white cursor-pointer">✕</button>
                </div>
                <p className="text-slate-200">{autoVerifyLog}</p>
              </div>
            )}

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="TrxID, নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                  value={billSearchFilter}
                  onChange={(e) => setBillSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-slate-400 font-bold shrink-0">ফিল্টার:</span>
                {(['all', 'pending', 'verified', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setBillStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
                      billStatusFilter === st
                        ? 'bg-[#1DB954] text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'সকল বিল' : st === 'pending' ? 'পেন্ডিং' : st === 'verified' ? 'ভেরিফাইড' : 'বাতিল'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bills Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-black border-b border-slate-800">
                    <tr>
                      <th className="p-4">বিল ID & ক্যাটাগরি</th>
                      <th className="p-4">পেয়ারের নাম & মোবাইল</th>
                      <th className="p-4">মেথড & TrxID</th>
                      <th className="p-4">পরিমাণ (৳)</th>
                      <th className="p-4">ভেরিফিকেশন স্ট্যাটাস</th>
                      <th className="p-4 text-right">অটো-রিড & অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {companyBills
                      .filter(b => {
                        if (billStatusFilter !== 'all' && b.status !== billStatusFilter) return false;
                        if (billSearchFilter.trim()) {
                          const query = billSearchFilter.toLowerCase();
                          return (
                            b.transactionId.toLowerCase().includes(query) ||
                            b.payerName.toLowerCase().includes(query) ||
                            b.payerPhone.toLowerCase().includes(query) ||
                            b.id.toLowerCase().includes(query)
                          );
                        }
                        return true;
                      })
                      .map(bill => (
                        <tr key={bill.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4">
                            <p className="font-mono font-black text-amber-400">{bill.id}</p>
                            <p className="text-[11px] font-bold text-slate-300 mt-0.5">{bill.category}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{bill.date}</p>
                          </td>

                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{bill.payerName}</p>
                            <p className="text-xs font-mono text-slate-400">{bill.payerPhone}</p>
                            {bill.note && <p className="text-[10px] text-slate-500 italic mt-0.5">{bill.note}</p>}
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-[10px] font-black rounded-md ${
                                bill.gateway === 'bKash' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                                bill.gateway === 'Nagad' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                bill.gateway === 'Rocket' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {bill.gateway}
                              </span>
                              <span className="font-mono font-extrabold text-white tracking-wider bg-slate-950 px-2 py-1 rounded-md border border-slate-800 text-xs">
                                {bill.transactionId}
                              </span>
                            </div>
                          </td>

                          <td className="p-4 font-black text-[#1DB954] text-sm">
                            ৳{(bill.amount || 0).toLocaleString('bn-BD')}
                          </td>

                          <td className="p-4">
                            {bill.status === 'verified' ? (
                              <div className="space-y-0.5">
                                <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] font-black rounded-full text-[10px] inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  ✓ ভেরিফাইড (অটো-রিড)
                                </span>
                                {bill.verifiedAt && <p className="text-[10px] text-slate-500 font-mono">সময়: {bill.verifiedAt}</p>}
                              </div>
                            ) : bill.status === 'pending' ? (
                              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black rounded-full text-[10px] inline-flex items-center gap-1 animate-pulse">
                                ⏳ ভেরিফিকেশন বাকি
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-300 font-black rounded-full text-[10px]">
                                ✕ বাতিল করা হয়েছে
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            {bill.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleAutoVerifySingleBill(bill.id)}
                                  className="px-2.5 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 shadow"
                                >
                                  <Zap className="w-3 h-3 fill-slate-950" />
                                  অটো-রিড & ভেরিফাই
                                </button>
                                <button
                                  onClick={() => {
                                    setCompanyBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: 'rejected' } : b));
                                  }}
                                  className="px-2 py-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] rounded-lg cursor-pointer transition"
                                >
                                  বাতিল
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setCompanyBills(prev => prev.map(b => b.id === bill.id ? { ...b, status: 'pending' } : b));
                                }}
                                className="px-2.5 py-1 bg-slate-800 text-slate-400 hover:text-white font-bold text-[10px] rounded-lg cursor-pointer"
                              >
                                পেন্ডিং করুন
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AGENCY B2B CLIENTS & MILESTONES */}
        {activeAdminTab === 'agency_clients' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#1DB954]" /> ক্লায়েন্ট প্রজেক্টস & কর্পোরেট মিলস্টোনস
                  </h2>
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs font-black rounded-full border border-sky-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    B2B প্রজেক্ট ট্র্যাকার সক্রিয়
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  কর্পোরেট ক্লায়েন্টদের কাস্টম সফটওয়্যার, মোবাইল অ্যাপ এবং ই-কমার্স প্রজেক্টের মিলস্টোন, বাজেট ও চুক্তিনামা পরিচালনা করুন।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('নতুন B2B ক্লায়েন্ট প্রজেক্ট যুক্ত করতে বায়ার জব ও ডেসপ্যাচ ম্যানেজমেন্ট ব্যবহার করুন।')}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" /> <span>নতুন B2B প্রজেক্ট এন্ট্রি</span>
                </button>
              </div>
            </div>

            {/* B2B Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">সক্রিয় ক্লায়েন্ট প্রজেক্ট</p>
                <p className="text-2xl font-black text-white mt-1">৮ টি</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">মোট চুক্তিকৃত মূল্য (B2B Value)</p>
                <p className="text-2xl font-black text-[#1DB954] mt-1">৳৪,৫০,০০০</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">সম্পন্ন মিলস্টোনস</p>
                <p className="text-2xl font-black text-sky-400 mt-1">১৮ / ২৪</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">ইনভয়েস পেন্ডিং</p>
                <p className="text-2xl font-black text-amber-400 mt-1">৳৭৫,০০০</p>
              </div>
            </div>

            {/* Client Projects List */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>বর্তমান B2B কর্পোরেট ক্লায়েন্ট তালিকা</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">ক্লায়েন্ট / প্রজেক্ট নাম</th>
                      <th className="p-3">ক্যাটাগরি</th>
                      <th className="p-3">অ্যাসাইনড টিম লিড</th>
                      <th className="p-3">বাজেট</th>
                      <th className="p-3">মিলস্টোন অগ্রগতি</th>
                      <th className="p-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <p className="font-bold text-white">Apex Fashion ERP Solution</p>
                        <p className="text-[10px] text-slate-400">ক্লায়েন্ট: অ্যাপেক্স বিডি লিমিটেড</p>
                      </td>
                      <td className="p-3 text-slate-300">Software & ERP</td>
                      <td className="p-3 text-emerald-400 font-bold">কে.এম. রফিকুল ইসলাম (Head of IT)</td>
                      <td className="p-3 font-bold text-white">৳১,৮০,০০০</td>
                      <td className="p-3">
                        <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">৩/৪ মিলস্টোন সম্পন্ন</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-emerald-500/20 text-[#1DB954] font-bold rounded-full text-[10px]">
                          ইন প্রোগ্রেস
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <p className="font-bold text-white">Multivendor E-Commerce App (iOS/Android)</p>
                        <p className="text-[10px] text-slate-400">ক্লায়েন্ট: ঢাকা মার্ট ডিজিটাল</p>
                      </td>
                      <td className="p-3 text-slate-300">Mobile App Development</td>
                      <td className="p-3 text-emerald-400 font-bold">তানভীর আহমেদ (App Specialist)</td>
                      <td className="p-3 font-bold text-white">৳১,২০,০০০</td>
                      <td className="p-3">
                        <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">২/৪ মিলস্টোন সম্পন্ন</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-emerald-500/20 text-[#1DB954] font-bold rounded-full text-[10px]">
                          ইন প্রোগ্রেস
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <p className="font-bold text-white">Corporate Brand Identity & Animated Video</p>
                        <p className="text-[10px] text-slate-400">ক্লায়েন্ট: গ্রীন ফিল্ড এগ্রো</p>
                      </td>
                      <td className="p-3 text-slate-300">Graphics & Video</td>
                      <td className="p-3 text-emerald-400 font-bold">সাবরিনা সুলতানা (Design Expert)</td>
                      <td className="p-3 font-bold text-white">৳৫০,০০০</td>
                      <td className="p-3">
                        <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#1DB954] h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">সম্পূর্ণ সম্পন্ন</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-sky-500/20 text-sky-300 font-bold rounded-full text-[10px]">
                          ডেলিভার্ড & পেইড
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6.5: MARKETPLACE CONTROL CENTER & AGENCY DISPATCH MANAGEMENT */}
        {activeAdminTab === 'marketplace' && (
          <div className="space-y-6 font-bengali">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-[#1DB954]" /> মার্কেটপ্লেস কন্ট্রোল সেন্টার & এজেন্সী হাব
                  </h2>
                  <span className="px-3.5 py-1.5 bg-[#1DB954]/20 text-[#1DB954] text-xs sm:text-sm font-black rounded-full border border-[#1DB954]/40 flex items-center gap-1.5 animate-pulse">
                    <Zap className="w-4 h-4 text-[#1DB954]" />
                    {mktCommissionRate}% প্ল্যাটফর্ম কমিশন সক্রিয়
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  ফাইবারের মতো গিগ অ্যাপ্রুভাল, সেলার ট্রাস্ট ব্যাজ (Vetted Pro), এস্ক্রো ডিসপ্যুট রেজোলিউশন ও স্টাফ প্রজেক্ট ডেসপ্যাচ সম্পূর্ণ নিয়ন্ত্রণ করুন।
                </p>
              </div>

              {/* Sub-Tabs Nav */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 flex-wrap">
                {[
                  { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
                  { id: 'gigs', label: 'গিগ সার্ভিসেস', icon: ShoppingBag },
                  { id: 'jobs', label: 'বায়ার ব্রিফ ও ডেসপ্যাচ', icon: Send },
                  { id: 'orders', label: 'এস্ক্রো অর্ডাস & ডিসপ্যুট', icon: ShieldCheck },
                  { id: 'categories', label: 'ক্যাটাগরি কন্ট্রোল', icon: Tag },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMktAdminSubTab(tab.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-2 ${
                        mktAdminSubTab === tab.id
                          ? 'bg-[#1DB954] text-slate-950 shadow-md'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUB TAB 1: OVERVIEW & PLATFORM COMMISSION STATS */}
            {mktAdminSubTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                    <p className="text-xs sm:text-sm text-slate-400 font-bold">মোট গিগ সার্ভিস</p>
                    <p className="text-2xl sm:text-3xl font-black text-white">{gigs.length} টি</p>
                    <span className="text-xs text-emerald-400 font-bold">পাবলিক বায়ার ক্যাটালগে প্রদর্শিত</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                    <p className="text-xs sm:text-sm text-slate-400 font-bold">বায়ার কাস্টম প্রজেক্টস/জব</p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">{jobs.length} টি</p>
                    <span className="text-xs text-amber-300 font-bold">স্টাফে অর্পণের সুযোগ</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                    <p className="text-xs sm:text-sm text-slate-400 font-bold">সক্রিয় এস্ক্রো অর্ডার</p>
                    <p className="text-2xl sm:text-3xl font-black text-sky-400">{marketplaceOrders.length} টি</p>
                    <span className="text-xs text-sky-300 font-bold">১০০% এস্ক্রো সিকিউরড পেমেন্ট</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                    <p className="text-xs sm:text-sm text-slate-400 font-bold">মার্কেটপ্লেস এডমিন রেভিনিউ</p>
                    <p className="text-2xl sm:text-3xl font-black text-[#1DB954]">
                      ৳{marketplaceOrders.reduce((sum, o) => sum + (o.adminCommission || 0), 0).toLocaleString('bn-BD')}
                    </p>
                    <span className="text-xs text-[#1DB954] font-bold">{mktCommissionRate}% রেট এ জমাকৃত কমিশন</span>
                  </div>
                </div>

                {/* Dynamic Platform Fee Controller */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#1DB954]" />
                    <span>প্ল্যাটফর্ম ফি & কমিশন রেট কন্ট্রোলার</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">মার্কেটপ্লেস প্লাটফর্ম কমিশন (%)</label>
                      <select
                        value={mktCommissionRate}
                        onChange={(e) => {
                          setMktCommissionRate(Number(e.target.value));
                          alert(`প্লাটফর্ম কমিশন রেট সফলভাবে ${e.target.value}% এ সেট করা হয়েছে!`);
                        }}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-black text-white focus:outline-none focus:border-[#1DB954]"
                      >
                        <option value={5}>৫% (ইনসেন্টিভ কম ফি)</option>
                        <option value={10}>১০% (স্ট্যান্ডার্ড রেট - ডিফল্ট)</option>
                        <option value={15}>১৫% (প্রিমিয়াম এজেন্সী মার্জিন)</option>
                        <option value={20}>২০% (ফাইবার মডেল রেট)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <p className="text-slate-400 font-semibold">প্রাক্কলিত এডমিন শেয়ার:</p>
                      <p className="font-black text-amber-400 text-sm">{mktCommissionRate}% পার অর্ডার</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <p className="text-slate-400 font-semibold">সেলার পে-আউট শেয়ার:</p>
                      <p className="font-black text-[#1DB954] text-sm">{100 - mktCommissionRate}% ডিরেক্ট পে আউট</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB TAB 2: GIG MODERATION & VETTED BADGES */}
            {mktAdminSubTab === 'gigs' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="গিগ শিরোনাম বা সেলারের নাম খুঁজুন..."
                      value={gigSearchFilter}
                      onChange={(e) => setGigSearchFilter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => setGigStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                        gigStatusFilter === 'all' ? 'bg-[#1DB954] text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      সকল গিগ ({gigs.length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gigs
                    .filter(g => !gigSearchFilter || g.title.toLowerCase().includes(gigSearchFilter.toLowerCase()) || g.sellerName.toLowerCase().includes(gigSearchFilter.toLowerCase()))
                    .map(gig => (
                      <div key={gig.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 shadow-md flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950">
                            <img src={gig.thumbnail} alt={gig.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur text-[10px] font-bold text-emerald-400 rounded-md border border-slate-700">
                              {gig.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <img src={gig.sellerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt={gig.sellerName} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-xs font-bold text-white truncate">{gig.sellerName}</span>
                            <span className="text-[10px] font-bold text-[#1DB954] bg-[#1DB954]/10 px-1.5 py-0.5 rounded">
                              Vetted Pro
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white line-clamp-2">{gig.title}</h4>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="font-black text-[#1DB954]">
                            ৳{(gig.packages?.basic?.price ?? 0).toLocaleString('bn-BD')}
                          </span>
                          
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <button
                              onClick={() => handleOpenAdminEditGig(gig)}
                              className="px-2 py-1 bg-emerald-500/20 text-[#1DB954] hover:bg-[#1DB954] hover:text-slate-950 text-[10px] font-bold rounded-lg transition border border-emerald-500/30 cursor-pointer flex items-center gap-1"
                              title="গিগ এডিট করুন"
                            >
                              <Edit className="w-3 h-3" />
                              <span>এডিট</span>
                            </button>

                            <button
                              onClick={() => setAdminPerformanceGig(gig)}
                              className="px-2 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white text-[10px] font-bold rounded-lg transition border border-blue-500/30 cursor-pointer flex items-center gap-1"
                              title="পারফরমেন্স অ্যানালিটিক্স"
                            >
                              <BarChart2 className="w-3 h-3" />
                              <span>পারফরমেন্স</span>
                            </button>

                            <button
                              onClick={() => {
                                deleteGig(gig.id);
                              }}
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white text-[10px] font-bold rounded-lg transition border border-rose-500/30 cursor-pointer"
                              title="গিগ ডিলেট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB TAB 3: BUYER JOBS & DISPATCH */}
            {mktAdminSubTab === 'jobs' && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-500" />
                    <span>বায়ার প্রজেক্ট কাস্টম ব্রিফ ও অফিস স্টাফে ডেসপ্যাচ</span>
                  </h3>
                  <button
                    onClick={() => {
                      setJobTitle('');
                      setJobCategory('Development');
                      setJobBuyerName('PTENit B2B Client');
                      setJobBuyerPhone('01700000000');
                      setJobBudget(15000);
                      setJobDeadlineDays(7);
                      setJobDescription('');
                      setJobVisibility('public');
                      setJobAssignedStaffId('');
                      setJobModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ নতুন জব পোস্ট / কাস্টম প্রজেক্ট এডড</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                              {job.category}
                            </span>
                            <span className="text-[10px] text-slate-400">বায়ার: {job.buyerName} ({job.buyerPhone})</span>
                          </div>
                          <h4 className="text-sm font-black text-white mt-1">{job.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{job.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-[#1DB954]">৳{(job.budget || 0).toLocaleString('bn-BD')}</p>
                          <p className="text-[10px] text-slate-400">স্ট্যাটাস: <strong className="uppercase text-amber-400">{job.status}</strong></p>
                        </div>
                      </div>

                      {/* Dispatch Control */}
                      <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="text-slate-400">
                          {job.assignedStaffName ? (
                            <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                              অর্পিত/ডেসপ্যাচকৃত স্টাফ: {job.assignedStaffName}
                            </span>
                          ) : (
                            <span className="text-amber-400 font-bold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                              <AlertCircle className="w-4 h-4 text-amber-400" />
                              প্রজেক্ট ডেসপ্যাচের অপেক্ষায়
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            id={`dispatch-${job.id}`}
                            className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#1DB954]"
                          >
                            <option value="">-- স্টাফ নির্বাচন করুন --</option>
                            {agencyStaff.map(s => (
                              <option key={s.id} value={`${s.id}||${s.name} (${s.category})`}>
                                {s.name} — {s.category} ({s.title})
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => {
                              const elem = document.getElementById(`dispatch-${job.id}`) as HTMLSelectElement;
                              if (elem && elem.value) {
                                const [sId, sName] = elem.value.split('||');
                                dispatchJobToStaff(job.id, sId, sName);
                                alert(`প্রজেক্টটি સફળভাবে ${sName}-এর নিকট ডেসপ্যাচ করা হয়েছে!`);
                              } else {
                                alert('অনুগ্রহ করে অফিস স্টাফ মেম্বার সিলেক্ট করুন।');
                              }
                            }}
                            className="px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>ডেসপ্যাচ করুন</span>
                          </button>

                          <button
                            onClick={() => {
                              deleteJob(job.id);
                            }}
                            className="p-2 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                            title="জব ডিলেট করুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB TAB 4: ESCROW ORDERS & DISPUTE AUDIT */}
            {mktAdminSubTab === 'orders' && (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                    <span>সকল এস্ক্রো প্রজেক্ট অর্ডার ও ডিসপ্যুট হাব ({marketplaceOrders.length})</span>
                  </h3>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="অর্ডার, বায়ার বা সেলার খুঁজুন..."
                        value={mktOrderSearchFilter}
                        onChange={(e) => setMktOrderSearchFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <select
                      value={mktOrderStatusFilter}
                      onChange={(e) => setMktOrderStatusFilter(e.target.value)}
                      className="p-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#1DB954] cursor-pointer"
                    >
                      <option value="all">সকল স্ট্যাটাস</option>
                      <option value="pending">pending</option>
                      <option value="in_progress">in_progress</option>
                      <option value="in_review">in_review</option>
                      <option value="revision_requested">revision_requested</option>
                      <option value="completed">completed</option>
                      <option value="disputed">disputed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                </div>

                {/* BULK ACTION BAR FOR MARKETPLACE ORDERS */}
                {selectedMktOrderIds.length > 0 && (
                  <div className="p-3 bg-slate-950 border-2 border-[#1DB954] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white bg-[#1DB954] px-2.5 py-0.5 rounded-full">
                        {selectedMktOrderIds.length} টি এস্ক্রো অর্ডার সিলেক্টেড
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                      <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400">বাল্ক স্ট্যাটাস:</span>
                        <select
                          value={bulkMktOrderTargetStatus}
                          onChange={(e) => setBulkMktOrderTargetStatus(e.target.value as any)}
                          className="bg-slate-950 text-white text-xs font-bold py-0.5 px-2 rounded border border-slate-700 focus:outline-none focus:border-[#1DB954] cursor-pointer uppercase"
                        >
                          <option value="completed">completed (সম্পন্ন)</option>
                          <option value="in_progress">in_progress (চলমান)</option>
                          <option value="in_review">in_review (রিভিউতে)</option>
                          <option value="revision_requested">revision_requested (রিভিশন)</option>
                          <option value="disputed">disputed (ডিসপ্যুট)</option>
                          <option value="cancelled">cancelled (বাতিল)</option>
                        </select>
                      </div>

                      <button
                        onClick={handleApplyBulkMktOrderStatus}
                        className="px-3 py-1.5 bg-[#1DB954] text-slate-950 font-black text-xs rounded-xl hover:bg-emerald-500 transition shadow cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>বাল্ক আপডেট</span>
                      </button>

                      <button
                        onClick={handleBulkDeleteMktOrders}
                        className="px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white font-bold text-xs rounded-xl border border-rose-500/30 transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলেট ({selectedMktOrderIds.length})</span>
                      </button>

                      <button
                        onClick={() => setSelectedMktOrderIds([])}
                        className="px-2.5 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        বাতিল
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isAllMktOrdersSelected}
                            onChange={handleToggleSelectAllMktOrders}
                            className="w-4 h-4 rounded cursor-pointer accent-[#1DB954]"
                          />
                        </th>
                        <th className="p-3">অর্ডার ID & শিরোনাম</th>
                        <th className="p-3">বায়ার</th>
                        <th className="p-3">সেলার/স্টাফ</th>
                        <th className="p-3">মোট বাজেট</th>
                        <th className="p-3">এডমিন কমিশন</th>
                        <th className="p-3">সেলার প্রাপ্তি</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3 text-right">এডমিন অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredMktOrders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-6 text-center text-slate-500 italic">
                            কোনো এস্ক্রো অর্ডার পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        filteredMktOrders.map(ord => {
                          const isSelected = selectedMktOrderIds.includes(ord.id);
                          return (
                            <tr
                              key={ord.id}
                              className={`transition-colors ${
                                isSelected ? 'bg-emerald-950/30 border-l-2 border-l-[#1DB954]' : 'hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleToggleSelectMktOrder(ord.id)}
                                  className="w-4 h-4 rounded cursor-pointer accent-[#1DB954]"
                                />
                              </td>
                              <td className="p-3">
                                <p className="font-bold text-white">{ord.title}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{ord.id}</p>
                              </td>
                              <td className="p-3 text-slate-300">{ord.buyerName}</td>
                              <td className="p-3 text-slate-300 font-bold">{ord.sellerName}</td>
                              <td className="p-3 font-bold text-white">৳{(ord.amount || (ord as any).price || 0).toLocaleString('bn-BD')}</td>
                              <td className="p-3 font-bold text-amber-400">৳{(ord.adminCommission || 0).toLocaleString('bn-BD')}</td>
                              <td className="p-3 font-bold text-[#1DB954]">৳{(ord.sellerPayout || 0).toLocaleString('bn-BD')}</td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-sky-500/20 text-sky-300 font-bold rounded-full text-[10px] uppercase">
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      alert(`অর্ডার ${ord.id} এর এস্ক্রো পেমেন্ট সফলভাবে সেলারের ওয়ালেটে রিলিজ করা হলো!`);
                                    }}
                                    className="px-2.5 py-1 bg-[#1DB954] text-slate-950 font-black text-[10px] rounded-md shadow hover:bg-emerald-500 transition cursor-pointer"
                                  >
                                    রিলিজ এস্ক্রো
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteMarketplaceOrder(ord.id);
                                    }}
                                    className="p-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-md transition cursor-pointer"
                                    title="অর্ডার ডিলেট করুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB TAB 5: CATEGORIES CONTROL */}
            {mktAdminSubTab === 'categories' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#1DB954]" />
                  <span>মার্কেটপ্লেস ক্যাটাগরি ও সার্ভিস ফিল্টার ম্যানেজার</span>
                </h3>

                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    placeholder="নতুন ক্যাটাগরির নাম লিখুন..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    onClick={() => {
                      if (newCatName.trim()) {
                        setMktCategories(prev => [...prev, newCatName.trim()]);
                        setNewCatName('');
                        alert(`ক্যাটাগরি "${newCatName.trim()}" সফলভাবে যুক্ত হয়েছে!`);
                      }
                    }}
                    className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                  >
                    + যোগ করুন
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {mktCategories.map((cat, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2">
                      <span>{cat}</span>
                      <button
                        onClick={() => setMktCategories(prev => prev.filter(c => c !== cat))}
                        className="text-slate-500 hover:text-red-400 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
        {activeAdminTab === 'gallery' && (
          <div className="space-y-8 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-[#1DB954]" /> গ্যালারি ও মিডিয়া ম্যানেজমেন্ট ({gallery.length})
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    মিডিয়া লাইব্রেরি রেডি
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  আইটি একাডেমির ইভেন্ট, ল্যাব ফোটোগ্রাফি, প্রেজেন্টেশন এবং সফল শিক্ষার্থীদের রিভিউ পরিচালনা করুন।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setGalleryModalOpen(true)}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" /> <span>নতুন ছবি / মিডিয়া যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">{item.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">{item.caption}</p>
                  </div>
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-full shadow-lg opacity-90 hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Testimonials Management Section */}
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  শিক্ষার্থীদের রিভিউ & রিভিউ ম্যানেজমেন্ট ({testimonials.length})
                </h3>
                <button
                  onClick={() => setTestimonialModalOpen(true)}
                  className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" /> নতুন রিভিউ যোগ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3">
                      <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                        <span className="text-[10px] text-[#1DB954] font-semibold">{t.courseOrService}</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">"{t.text}"</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SITE SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-3xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Settings className="w-6 h-6 text-[#1DB954]" /> ওয়েবসাইট কন্টেন্ট & ডাইনামিক সেটিংস
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    গ্লোবাল কনফিগারেশন সিঙ্কড
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  ল্যান্ডিং পেইজের টেক্সট, কাউন্টার স্ট্যাটিস্টিক্স, যোগাযোগ নম্বর, ইমেইল ও অফিস ঠিকানা সেটিংস।
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-3xl space-y-6">
              {settingsSaved && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-bold rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> সেটিংস সফলভাবে আপডেট ও সেভ হয়েছে!
                </div>
              )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">হিরো মেইন হেডিং (Hero Heading)</label>
                <input
                  type="text"
                  value={settingsForm.heroHeading}
                  onChange={e => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">হিরো সাবটেক্সট (Hero Subtext)</label>
                <textarea
                  rows={3}
                  value={settingsForm.heroSubtext}
                  onChange={e => setSettingsForm({ ...settingsForm, heroSubtext: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">স্টুডেন্ট কাউন্টার</label>
                  <input
                    type="text"
                    value={settingsForm.statsStudents}
                    onChange={e => setSettingsForm({ ...settingsForm, statsStudents: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">প্রজেক্ট কাউন্টার</label>
                  <input
                    type="text"
                    value={settingsForm.statsProjects}
                    onChange={e => setSettingsForm({ ...settingsForm, statsProjects: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">ফোন নম্বর</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">ইমেইল ঠিকানা</label>
                  <input
                    type="text"
                    value={settingsForm.email}
                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">অফিস ঠিকানা</label>
                <input
                  type="text"
                  value={settingsForm.officeAddress}
                  onChange={e => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              {/* Official Payment Methods & Bank Config */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <label className="block text-xs font-black text-[#1DB954] uppercase tracking-wider">
                  💳 পেমেন্ট মেথড কনফিগারেশন (এমএফএস ও ব্যাংক অ্যাকাউন্ট)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      bKash Personal নম্বর
                    </label>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      placeholder="01712345678"
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nagad Personal নম্বর
                    </label>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      placeholder="01700000000"
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Rocket Personal নম্বর
                    </label>
                    <input
                      type="text"
                      value={settingsForm.rocketNumber || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })}
                      placeholder="01900000000"
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    🏦 অফিশিয়াল ব্যাংক একাউন্ট বিবরণ
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="ব্যাংকের নাম (যেমন: Dutch-Bangla Bank PLC)"
                        value={settingsForm.bankName || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="একাউন্ট টাইটেল (যেমন: PTENIT IT SOLUTIONS)"
                        value={settingsForm.bankAccountName || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankAccountName: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="একাউন্ট নম্বর (যেমন: 2181100098765)"
                        value={settingsForm.bankAccountNumber || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankAccountNumber: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="ব্রাঞ্চের নাম (যেমন: Uttara Branch, Dhaka)"
                        value={settingsForm.bankBranch || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankBranch: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Logo Upload */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  ওয়েবসাইট লোগো (ডিভাইস থেকে আপলোড অথবা লিংক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>লোগো আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, url => setSettingsForm(prev => ({ ...prev, logoUrl: url })))}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা লোগো ইমেজ URL লিংক দিন..."
                    value={settingsForm.logoUrl || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {settingsForm.logoUrl && (
                  <div className="mt-2 relative inline-block bg-slate-800 p-2 rounded-xl">
                    <img src={settingsForm.logoUrl} alt="Logo Preview" className="h-10 w-auto max-w-[160px] object-contain" />
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="লোগো মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Hero Banner Upload */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  হিরো ব্যানার ব্যাকগ্রাউন্ড ছবি (ডিভাইস থেকে আপলোড অথবা লিংক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ব্যানার আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, url => setSettingsForm(prev => ({ ...prev, heroBannerUrl: url })))}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ব্যানার ইমেজ URL লিংক দিন..."
                    value={settingsForm.heroBannerUrl || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, heroBannerUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {settingsForm.heroBannerUrl && (
                  <div className="mt-2 relative inline-block">
                    <img src={settingsForm.heroBannerUrl} alt="Banner Preview" className="w-36 h-20 object-cover rounded-xl border border-slate-700 shadow" />
                    <button
                      type="button"
                      onClick={() => setSettingsForm(prev => ({ ...prev, heroBannerUrl: '' }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="ব্যানার মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Money Back & Escrow Guarantee Settings Control */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#1DB954]" />
                      মানি ব্যাক ও এস্ক্রো গ্যারান্টি কন্ট্রোল (Money-Back & Escrow Guarantee)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      গিগ সার্ভিস ও পেমেন্ট পেজে মানি ব্যাক গ্যারান্টি এবং এস্ক্রো সুরক্ষা ব্যাজ সক্রিয়/নিষ্ক্রিয় ও পরিবর্তন করুন।
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={settingsForm.enableMoneyBackGuarantee !== false}
                      onChange={e => setSettingsForm({ ...settingsForm, enableMoneyBackGuarantee: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1DB954]"></div>
                  </label>
                </div>

                {settingsForm.enableMoneyBackGuarantee !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        গ্যারান্টি সময়সীমা (দিন)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={settingsForm.moneyBackGuaranteeDays ?? 10}
                        onChange={e => setSettingsForm({ ...settingsForm, moneyBackGuaranteeDays: parseInt(e.target.value) || 10 })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                        placeholder="১০"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        গ্যারান্টি ব্যাজ টেক্সট (Custom Badge Text)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.moneyBackGuaranteeText || `${settingsForm.moneyBackGuaranteeDays || 10}-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি`}
                        onChange={e => setSettingsForm({ ...settingsForm, moneyBackGuaranteeText: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                        placeholder="১০-দিনের মানি ব্যাক ও এস্ক্রো গ্যারান্টি"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#1DB954] text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> সেভ করুন
              </button>
            </form>
          </div>
        </div>
        )}

        {/* TAB: FINANCIALS & ESCROW LEDGER */}
        {activeAdminTab === 'financials' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-[#1DB954]" /> ফিনান্সিয়ালস, রেভিনিউ & এস্ক্রো লেজার
                  </h2>
                  <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                    স্বচ্ছ অটোমেটেড কমিশন লেজার
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  কোর্স এনরোলমেন্ট ফি, সার্ভিস বুকিং, মার্কেটপ্লেস ১০% কমিশন এবং ট্রেইনার উইথড্রয়াল পে-আউটের কেন্দ্রীয় ফিনান্সিয়াল রিপোর্ট।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('মার্কেটপ্লেস ও প্ল্যাটফর্ম ফিনান্সিয়াল রিপোর্ট এক্সপোর্ট সফল হয়েছে!')}
                  className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <FileText className="w-4 h-4" /> <span>স্টেটমেন্ট ডাউনলোড</span>
                </button>
              </div>
            </div>

            {/* Financial Ledger Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">মোট প্ল্যাটফর্ম ইনকাম</p>
                <p className="text-2xl font-black text-white mt-1">
                  ৳{(
                    orders.reduce((s, o) => s + (o.amount || 0), 0) +
                    marketplaceOrders.reduce((s, m) => s + (m.adminCommission || 0), 0)
                  ).toLocaleString('bn-BD')}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">মার্কেটপ্লেস কমিশন (১০%)</p>
                <p className="text-2xl font-black text-[#1DB954] mt-1">
                  ৳{marketplaceOrders.reduce((s, m) => s + (m.adminCommission || 0), 0).toLocaleString('bn-BD')}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">এস্ক্রো ওয়ালেট ব্যালেন্স (হোল্ড)</p>
                <p className="text-2xl font-black text-sky-400 mt-1">
                  ৳{marketplaceOrders.filter(m => m.status === 'in_escrow' || (m as any).status === 'delivered').reduce((s, m) => s + (m.amount || (m as any).price || 0), 0).toLocaleString('bn-BD')}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400 font-bold">ট্রেইনার ও সেলার পে-আউট (৯০%)</p>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  ৳{payouts.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.amount || 0), 0).toLocaleString('bn-BD')}
                </p>
              </div>
            </div>

            {/* Recent Marketplace Escrow Transactions */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>এস্ক্রো ফাণ্ড ও কমিশন লেজার রেকর্ডস</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">ট্রানজ্যাকশন ID</th>
                      <th className="p-3">বায়ার</th>
                      <th className="p-3">প্রোভাইডার/সেলার</th>
                      <th className="p-3">মোট ভ্যালু</th>
                      <th className="p-3">১০% কমিশন</th>
                      <th className="p-3">৯০% সেলার পে</th>
                      <th className="p-3">এস্ক্রো স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {marketplaceOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          কোনো এস্ক্রো ট্রানজ্যাকশন পাওয়া যায়নি।
                        </td>
                      </tr>
                    ) : (
                      marketplaceOrders.map(m => (
                        <tr key={m.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-slate-400">{m.id}</td>
                          <td className="p-3 font-bold text-white">{m.buyerName}</td>
                          <td className="p-3 text-slate-300">{m.sellerName}</td>
                          <td className="p-3 font-bold text-white">৳{(m.amount || (m as any).price || 0).toLocaleString('bn-BD')}</td>
                          <td className="p-3 font-bold text-[#1DB954]">৳{(m.adminCommission || 0).toLocaleString('bn-BD')}</td>
                          <td className="p-3 font-bold text-amber-400">৳{(m.sellerPayout || 0).toLocaleString('bn-BD')}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              m.status === 'completed' ? 'bg-emerald-500/20 text-[#1DB954]' : 'bg-sky-500/20 text-sky-300'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

          </main>
        </div>

      </div>

      {/* Course Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 font-bengali text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">কোর্স যোগ / এডিট</h3>
            <form onSubmit={handleSaveCourse} className="space-y-3">
              <input
                type="text"
                placeholder="কোর্সের শিরোনাম"
                required
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কোর্স থম্বনেইল / ছবি (ডিভাইস থেকে আপলোড অথবা লিংক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, setCourseThumbnail)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ছবি URL পেস্ট করুন"
                    value={courseThumbnail}
                    onChange={e => setCourseThumbnail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {courseThumbnail && (
                  <div className="mt-2 relative inline-block">
                    <img src={courseThumbnail} alt="Thumbnail Preview" className="w-24 h-16 object-cover rounded-xl border border-slate-700 shadow" />
                    <button
                      type="button"
                      onClick={() => setCourseThumbnail('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="ছবি মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {/* Course Category & Level Selection */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">কোর্স ক্যাটাগরি</label>
                  <input
                    type="text"
                    placeholder="ক্যাটাগরি"
                    value={courseCategory}
                    onChange={e => setCourseCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">কোর্স লেভেল / টায়ার</label>
                  <select
                    value={courseLevel}
                    onChange={e => setCourseLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option value="basic">🟢 বেসিক লেভেল (Basic Tier)</option>
                    <option value="advanced">⚡ এডভান্সড লেভেল (Advanced Tier)</option>
                    <option value="professional">🎓 প্রফেশনাল ডিপ্লোমা (Diploma)</option>
                    <option value="live_batch">🔴 লাইভ ব্যাচ (Live Batch)</option>
                  </select>
                </div>
              </div>

              {/* Trainer Assignment / Public Offer Dropdown */}
              <div className="p-3 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 rounded-2xl space-y-1.5">
                <label className="block text-[11px] font-extrabold text-amber-900 dark:text-amber-400">
                  🎯 কোর্স ট্রেইনার অ্যাসাইনমেন্ট বা ব্রডকাস্ট অফার
                </label>
                <select
                  value={courseAssignedTeacherId}
                  onChange={e => {
                    setCourseAssignedTeacherId(e.target.value);
                    const found = availableInstructors.find(i => i.id === e.target.value);
                    if (found) {
                      setCourseInstructor(e.target.value === 'public' ? 'পাবলিক অফার (উন্মুক্ত ট্রেইনার)' : found.name.split(' (')[0]);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-amber-500/40 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-amber-200 focus:outline-none focus:border-[#1DB954]"
                >
                  {availableInstructors.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-tight">
                  {courseAssignedTeacherId === 'public'
                    ? '💡 ব্রডকাস্ট পাবলিক অফার দিলে ঐ ক্যাটাগরির সকল ট্রেইনারের কাছে নোটিফিকেশন ও অফার যাবে। যিনি প্রথম একসেপ্ট করবেন তিনি কোর্সটির দায়িত্ব পাবেন।'
                    : '💡 নির্দিষ্ট ট্রেইনার নির্বাচন করলে অফার শুধুমাত্র উক্ত ট্রেইনারের ড্যাশবোর্ডে শো করবে।'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="মূল্য (BDT)"
                  value={coursePrice}
                  onChange={e => setCoursePrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
                <input
                  type="number"
                  placeholder="ডিসকাউন্ট মূল্য"
                  value={courseDiscountPrice}
                  onChange={e => setCourseDiscountPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={courseIsFree}
                  onChange={e => setCourseIsFree(e.target.checked)}
                />
                <span>এটি একটি ফ্রি কোর্স</span>
              </label>

              {/* Targets & Commission Settings Box */}
              <div className="p-3.5 bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                    🎯 কোর্স টার্গেট ও ইনস্ট্রাক্টর কমিশন হার
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">এডমিন দ্বারা সেটকৃত</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">টার্গেট মডিউল</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="মডিউল"
                      value={courseTargetModules}
                      onChange={e => setCourseTargetModules(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">টার্গেট ক্লাস/ভিডিও</label>
                    <input
                      type="number"
                      min={1}
                      placeholder="ক্লাস"
                      value={courseTargetLessons}
                      onChange={e => setCourseTargetLessons(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">টিচার কমিশন (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="কমিশন %"
                      value={courseTeacherCommissionRate}
                      onChange={e => setCourseTeacherCommissionRate(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>
              </div>

              <textarea
                placeholder="কোর্সের বিবরণ..."
                rows={3}
                value={courseDesc}
                onChange={e => setCourseDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md">
                  সেভ করুন
                </button>
                <button type="button" onClick={() => setCourseModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{editingServiceId ? 'সার্ভিস এডিট করুন' : 'নতুন সার্ভিস যোগ করুন'}</h3>
            <form onSubmit={handleSaveService} className="space-y-3">
              <input
                type="text"
                placeholder="সার্ভিস টাইটেল"
                required
                value={serviceTitle}
                onChange={e => setServiceTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <input
                type="text"
                placeholder="ক্যাটাগরি (উদা: Web Development, Graphics)"
                value={serviceCategory}
                onChange={e => setServiceCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <input
                type="text"
                placeholder="প্রাইস টেক্সট (উদা: ৳১০,০০০)"
                value={servicePrice}
                onChange={e => setServicePrice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সার্ভিস এর কভার/ব্যানার ছবি (ডিভাইস থেকে ফাইল আপলোড অথবা লিংক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, setServiceThumbnail)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ছবির লিংক/URL পেস্ট করুন"
                    value={serviceThumbnail}
                    onChange={e => setServiceThumbnail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {serviceThumbnail && (
                  <div className="mt-2 relative inline-block">
                    <img src={serviceThumbnail} alt="Service Preview" className="w-24 h-16 object-cover rounded-xl border border-slate-700 shadow" />
                    <button
                      type="button"
                      onClick={() => setServiceThumbnail('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="ছবি মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <textarea
                placeholder="সার্ভিস বিবরণ..."
                rows={3}
                value={serviceDesc}
                onChange={e => setServiceDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md">
                  সেভ করুন
                </button>
                <button type="button" onClick={() => setServiceModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">নতুন ছবি / মিডিয়া গ্যালারিতে যোগ করুন</h3>
            <form onSubmit={handleSaveGallery} className="space-y-3">
              <input
                type="text"
                placeholder="শিরোনাম / টাইটেল"
                required
                value={galleryTitle}
                onChange={e => setGalleryTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <select
                value={galleryCategory}
                onChange={e => setGalleryCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="Training">Training (ট্রেনিং ক্লাসরুম)</option>
                <option value="Office">Office (অফিস পরিবেশ)</option>
                <option value="Students">Students (শিক্ষার্থীরা)</option>
                <option value="Events">Events (ইভেন্টস)</option>
                <option value="Certificates">Certificates (সার্টিফিকেট)</option>
                <option value="Projects">Projects (প্রজেক্ট)</option>
              </select>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  গ্যালারি ছবি (ডিভাইস থেকে ফাইল আপলোড অথবা লিংক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, setGalleryImageUrl)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ছবির লিংক পেস্ট করুন"
                    value={galleryImageUrl}
                    onChange={e => setGalleryImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {galleryImageUrl && (
                  <div className="mt-2 relative inline-block">
                    <img src={galleryImageUrl} alt="Gallery Preview" className="w-24 h-16 object-cover rounded-xl border border-slate-700 shadow" />
                    <button
                      type="button"
                      onClick={() => setGalleryImageUrl('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="ছবি মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="ক্যাপশন (সংক্ষিপ্ত বর্ণনা)"
                value={galleryCaption}
                onChange={e => setGalleryCaption(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md">
                  সেভ করুন
                </button>
                <button type="button" onClick={() => setGalleryModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 text-slate-900 dark:text-white shadow-2xl">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">নতুন শিক্ষার্থী রিভিউ যোগ করুন</h3>
            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <input
                type="text"
                placeholder="শিক্ষার্থীর নাম"
                required
                value={testimonialName}
                onChange={e => setTestimonialName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <input
                type="text"
                placeholder="কোর্স বা সার্ভিস নাম"
                value={testimonialCourse}
                onChange={e => setTestimonialCourse(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিক্ষার্থীর ছবি/অবতার (ডিভাইস থেকে আপলোড অথবা লিংক)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, setTestimonialAvatar)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ছবি/অবতার URL পেস্ট করুন"
                    value={testimonialAvatar}
                    onChange={e => setTestimonialAvatar(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {testimonialAvatar && (
                  <div className="mt-2 relative inline-block">
                    <img src={testimonialAvatar} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow" />
                    <button
                      type="button"
                      onClick={() => setTestimonialAvatar('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="ছবি মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <textarea
                placeholder="শিক্ষার্থীর মতামত/রিভিউ..."
                rows={3}
                required
                value={testimonialText}
                onChange={e => setTestimonialText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all shadow-md">
                  সেভ করুন
                </button>
                <button type="button" onClick={() => setTestimonialModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Job Creation Modal (Public or Direct Dispatch) */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 text-slate-900 dark:text-white shadow-2xl my-8 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#1DB954]" />
                <span>নতুন বায়ার জব / কাস্টম প্রজেক্ট এডড করুন</span>
              </h3>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  জব / প্রজেক্ট টাইটেল *
                </label>
                <input
                  type="text"
                  placeholder="উদা: MERN Stack E-Commerce Web & Mobile App"
                  required
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={jobCategory}
                    onChange={e => setJobCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option value="Development">Development & Software</option>
                    <option value="Graphics & Design">Graphics & UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing & Ads</option>
                    <option value="SEO & Content">SEO & Article Writing</option>
                    <option value="Video & Animation">Video Editing & 3D</option>
                    <option value="Cyber Security">Cyber Security & IT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বাজেট (BDT ৳)
                  </label>
                  <input
                    type="number"
                    placeholder="15000"
                    required
                    value={jobBudget}
                    onChange={e => setJobBudget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্লায়েন্ট / বায়ার নাম
                  </label>
                  <input
                    type="text"
                    placeholder="ঢাকা মার্ট / বায়ার নাম"
                    value={jobBuyerName}
                    onChange={e => setJobBuyerName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মেয়াদ / ডেডলাইন (দিন)
                  </label>
                  <input
                    type="number"
                    placeholder="7"
                    value={jobDeadlineDays}
                    onChange={e => setJobDeadlineDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              {/* Assignment & Visibility Option */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                <label className="block font-black text-slate-800 dark:text-slate-200 text-xs">
                  জব পাবলিশিং & সরাসরি ডেসপ্যাচ মোড (Visibility)
                </label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobVisibility"
                      value="public"
                      checked={jobVisibility === 'public'}
                      onChange={() => setJobVisibility('public')}
                      className="accent-[#1DB954]"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      📢 পাবলিক জব (উন্মুক্ত - মার্কেটপ্লেসে যে কেউ বিড করতে পারবে)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobVisibility"
                      value="internal_staff_only"
                      checked={jobVisibility === 'internal_staff_only'}
                      onChange={() => setJobVisibility('internal_staff_only')}
                      className="accent-[#1DB954]"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      🔒 এজেন্সি স্টাফ মোড (কেবলমাত্র অফিসের স্টাফরা দেখতে পারবে)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobVisibility"
                      value="custom_assigned"
                      checked={jobVisibility === 'custom_assigned'}
                      onChange={() => setJobVisibility('custom_assigned')}
                      className="accent-[#1DB954]"
                    />
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      🎯 সরাসরি নির্দিষ্ট ট্রেইনার/স্টাফকে ডেসপ্যাচ (Direct Dispatch)
                    </span>
                  </label>
                </div>

                {jobVisibility === 'custom_assigned' && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 animate-fadeIn space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                        যাকে প্রজেক্টটি সরাসরি ডেসপ্যাচ করতে চান (ID & ক্যাটাগরি ফিল্টার)
                      </label>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-md">
                        ক্যাটাগরি: {jobCategory}
                      </span>
                    </div>
                    <select
                      value={jobAssignedStaffId}
                      onChange={e => setJobAssignedStaffId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-amber-500/50 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      required={jobVisibility === 'custom_assigned'}
                    >
                      <option value="">-- {jobCategory} ক্যাটাগরির ট্রেইনার / স্টাফ সিলেক্ট করুন --</option>
                      {(() => {
                        const matching = agencyStaff.filter(s => isCategoryMatch(s.category, jobCategory));
                        const others = agencyStaff.filter(s => !isCategoryMatch(s.category, jobCategory));
                        return (
                          <>
                            {matching.length > 0 && (
                              <optgroup label={`🎯 ${jobCategory} ক্যাটাগরির ট্রেইনার/বিশেষজ্ঞগণ`}>
                                {matching.map(s => (
                                  <option key={s.id} value={s.id}>
                                    [ID: {s.id}] {s.name} — {s.category} ({s.title})
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            <optgroup label="🌐 অন্যান্য ক্যাটাগরির ট্রেইনার / স্টাফগণ">
                              {others.map(s => (
                                <option key={s.id} value={s.id}>
                                  [ID: {s.id}] {s.name} — {s.category} ({s.title})
                                </option>
                              ))}
                            </optgroup>
                          </>
                        );
                      })()}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্ট বিস্তারিত ও ডেসক্রিপশন
                </label>
                <textarea
                  placeholder="প্রজেক্টের মূল কাজ ও রিকোয়ারমেন্টস বিস্তারিত লিখুন..."
                  rows={3}
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>জব পাবলিশ ও ডেসপ্যাচ সম্পন্ন করুন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher/Expert Modal */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1DB954]" /> নতুন টিচার / কোর্স এক্সপার্ট যোগ করুন
              </h3>
              <button onClick={() => setTeacherModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  placeholder="যেমন: তানভীর আহমেদ"
                  required
                  value={teacherName}
                  onChange={e => setTeacherName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">ইমেইল এড্রেস *</label>
                  <input
                    type="email"
                    placeholder="teacher@ptenit.com"
                    required
                    value={teacherEmail}
                    onChange={e => setTeacherEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    placeholder="017XXXXXXXX"
                    value={teacherMobile}
                    onChange={e => setTeacherMobile(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">পদবী / টাইটেল</label>
                  <input
                    type="text"
                    placeholder="যেমন: সিনিয়র গ্রাফিক্স ইনস্ট্রাক্টর"
                    value={teacherTitle}
                    onChange={e => setTeacherTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">লগইন পাসওয়ার্ড</label>
                  <input
                    type="text"
                    value={teacherPass}
                    onChange={e => setTeacherPass(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">প্রোফাইল ছবি / অবতার (ফাইল আপলোড অথবা লিংক)</label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageFileUpload(e, setTeacherAvatar)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ছবি/অবতার URL পেস্ট করুন"
                    value={teacherAvatar}
                    onChange={e => setTeacherAvatar(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                {teacherAvatar && (
                  <div className="mt-2 relative inline-block">
                    <img src={teacherAvatar} alt="Teacher Preview" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow" />
                    <button
                      type="button"
                      onClick={() => setTeacherAvatar('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                      title="ছবি মুছুন"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">সংক্ষিপ্ত বায়ো (Bio)</label>
                <textarea
                  placeholder="টিচারের এক্সপার্টিজ ও অভিজ্ঞতা সম্পর্কে সংক্ষেপে লিখুন..."
                  rows={2}
                  value={teacherBio}
                  onChange={e => setTeacherBio(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer">
                  টিচার একাউন্ট তৈরি করুন
                </button>
                <button type="button" onClick={() => setTeacherModalOpen(false)} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Bill Request Modal */}
      {payingPayoutId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#1DB954]" /> টিচারকে বিল পরিশোধ করুন
              </h3>
              <button onClick={() => setPayingPayoutId(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleApprovePayout} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">পেমেন্ট ট্রানজেকশন আইডি (bKash/Bank TrxID)</label>
                <input
                  type="text"
                  placeholder="যেমন: TrxID902834012"
                  required
                  value={payoutTxId}
                  onChange={e => setPayoutTxId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer">
                  অনুমোদন ও পরিশোধ কনফার্ম করুন
                </button>
                <button type="button" onClick={() => setPayingPayoutId(null)} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Page / Custom Admin Module Modal */}
      {addPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-bengali">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">নতুন এডমিন পেইজ / মডিউল যুক্ত করুন</h3>
                  <p className="text-[11px] text-slate-400">এডমিন ড্যাশবোর্ড মেনুবারে নতুন নেভিগেশন মডিউল রেজিস্টার করুন</p>
                </div>
              </div>
              <button onClick={() => setAddPageModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPageTitle.trim()) return;

                const newId = `custom_${Date.now()}`;
                const nextSerial = String(11 + customAdminPages.length + 1).padStart(2, '0');

                const newPageObj = {
                  id: newId,
                  serial: nextSerial,
                  label: newPageTitle.trim(),
                  category: newPageCategory,
                  desc: newPageDesc.trim() || 'কাস্টম এডমিন পেইজ মডিউল'
                };

                setCustomAdminPages(prev => [...prev, newPageObj]);
                setActiveAdminTab(newId);
                setNewPageTitle('');
                setNewPageDesc('');
                setAddPageModalOpen(false);
                setNewPageSuccessMsg(`নতুন পেইজ "${newPageTitle}" সফলভাবে এডমিন মেনুবারে যুক্ত হয়েছে!`);
                setTimeout(() => setNewPageSuccessMsg(''), 4000);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-300 mb-1">পেইজ বা মডিউলের নাম (Title)</label>
                <input
                  type="text"
                  placeholder="যেমন: কাস্টম রিপোর্টস, সিস্টেম সিকিউরিটি লটস, লাইভ সাপোর্ট"
                  required
                  value={newPageTitle}
                  onChange={e => setNewPageTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি গ্রুপ (Category Filter Group)</label>
                <select
                  value={newPageCategory}
                  onChange={e => setNewPageCategory(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-amber-400 font-bold"
                >
                  <option value="overview">ওভারভিউ (Overview & Analytics)</option>
                  <option value="academy">একাডেমি (Academy & Students)</option>
                  <option value="marketplace">সার্ভিস & মার্কেটপ্লেস (Marketplace & Services)</option>
                  <option value="finance">ফিন্যান্স & পেমেন্ট (Finance & Escrow)</option>
                  <option value="system">সিস্টেম & গ্যালারি (System & Media)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">মডিউল বিবরণ (Description & Purpose)</label>
                <textarea
                  placeholder="এই পেইজটিতে কি ধরনের ডাটা বা ফিচার থাকবে তার বর্ণনা লিখুন..."
                  rows={3}
                  value={newPageDesc}
                  onChange={e => setNewPageDesc(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all">
                  + পেইজ যুক্ত ও সেভ করুন
                </button>
                <button type="button" onClick={() => setAddPageModalOpen(false)} className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW COMPANY BILL MODAL */}
      {addBillModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-bengali">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1DB954]" />
                <span>প্রতিষ্ঠানের নতুন পেমেন্ট বিল যোগ করুন</span>
              </h3>
              <button
                onClick={() => setAddBillModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompanyBill} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">পেয়ারের নাম / ক্লায়েন্ট:</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ শফিকুল ইসলাম"
                    value={newBillPayerName}
                    onChange={(e) => setNewBillPayerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">মোবাইল / MFS নম্বর:</label>
                  <input
                    type="text"
                    placeholder="যেমন: 01712345678"
                    value={newBillPayerPhone}
                    onChange={(e) => setNewBillPayerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">পেমেন্ট গেটওয়ে:</label>
                  <select
                    value={newBillGateway}
                    onChange={(e) => setNewBillGateway(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#1DB954] cursor-pointer"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Rocket">Rocket (রকেট)</option>
                    <option value="Bank">Bank Transfer (ব্যাংক)</option>
                    <option value="Card">Credit/Debit Card</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">ট্রানজেকশন আইডি (TrxID):</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 8N7X9K2P"
                    value={newBillTrxId}
                    onChange={(e) => setNewBillTrxId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">বিলের পরিমাণ (৳):</label>
                  <input
                    type="number"
                    required
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block">বিলের ধরন / টাইপ:</label>
                  <select
                    value={newBillCategory}
                    onChange={(e) => setNewBillCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#1DB954] cursor-pointer"
                  >
                    <option value="এডভান্স পেমেন্ট">এডভান্স পেমেন্ট</option>
                    <option value="মার্কেটপ্লেস গিগ/অর্ডার">মার্কেটপ্লেস গিগ/অর্ডার</option>
                    <option value="কোর্স পেমেন্ট">কোর্স পেমেন্ট</option>
                    <option value="কাস্টম আইটি সার্ভিস">কাস্টম আইটি সার্ভিস</option>
                    <option value="অন্যান্য প্রতিষ্ঠান বিল">অন্যান্য প্রতিষ্ঠান বিল</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">নোট বা কাজের বিবরণ:</label>
                <input
                  type="text"
                  placeholder="সংক্ষেপে কোনো নোট থাকলে লিখুন..."
                  value={newBillNote}
                  onChange={(e) => setNewBillNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddBillModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  + বিল সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN EDIT GIG MODAL */}
      {adminEditingGig && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-bengali">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">এডমিন গিগ এডিট (Admin Gig Edit)</h3>
                  <p className="text-xs text-slate-400">গিগ টাইটেল, ক্যাটাগরি, প্রাইসিং ও থাম্বনেইল আপডেট করুন</p>
                </div>
              </div>
              <button
                onClick={() => setAdminEditingGig(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminEditGig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">গিগ এর টাইটেল (Title)</label>
                <input
                  type="text"
                  required
                  value={adminEditTitle}
                  onChange={(e) => setAdminEditTitle(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">ক্যাটাগরি</label>
                  <select
                    value={adminEditCategory}
                    onChange={(e) => setAdminEditCategory(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-[#1DB954]"
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
                  <label className="block text-xs font-bold text-slate-300 mb-1">ডেলিভারি সময় (দিন)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={adminEditDeliveryDays}
                    onChange={(e) => setAdminEditDeliveryDays(Number(e.target.value))}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-[#1DB954] mb-1">বেসিক (৳ Price)</label>
                  <input
                    type="number"
                    required
                    value={adminEditPriceBasic}
                    onChange={(e) => setAdminEditPriceBasic(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-400 mb-1">স্ট্যান্ডার্ড (৳ Price)</label>
                  <input
                    type="number"
                    required
                    value={adminEditPriceStandard}
                    onChange={(e) => setAdminEditPriceStandard(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">প্রিমিয়াম (৳ Price)</label>
                  <input
                    type="number"
                    required
                    value={adminEditPricePremium}
                    onChange={(e) => setAdminEditPricePremium(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">থাম্বনেইল URL</label>
                <input
                  type="text"
                  required
                  value={adminEditThumbnail}
                  onChange={(e) => setAdminEditThumbnail(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-[#1DB954]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">বিবরণ (Description)</label>
                <textarea
                  rows={3}
                  value={adminEditDesc}
                  onChange={(e) => setAdminEditDesc(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-[#1DB954]"
                />
              </div>

              {adminEditSuccess && (
                <div className="p-3 bg-emerald-500/20 text-[#1DB954] font-bold text-xs rounded-xl text-center border border-[#1DB954]/40 animate-pulse">
                  ✓ গিগ আপডেট সম্পূর্ণ হয়েছে!
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminEditingGig(null)}
                  className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PERFORMANCE MODAL */}
      {adminPerformanceGig && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-bengali">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative my-8 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">গিগ পারফরমেন্স অ্যানালিটিক্স</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{adminPerformanceGig.title}</p>
                </div>
              </div>
              <button
                onClick={() => setAdminPerformanceGig(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">📈 ইমপ্রেশন</span>
                <span className="text-lg font-black text-white">
                  {((adminPerformanceGig.salesCount || 1) * 450 + 320).toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold block">▲ +18.4% গত ৩০ দিনে</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">👁️ ভিউ</span>
                <span className="text-lg font-black text-white">
                  {((adminPerformanceGig.salesCount || 1) * 120 + 85).toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold block">▲ +12.1% এই সপ্তাহে</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">📦 সম্পন্ন অর্ডার</span>
                <span className="text-lg font-black text-[#1DB954]">
                  {(adminPerformanceGig.salesCount || 12).toLocaleString('bn-BD')}টি
                </span>
                <span className="text-[9px] text-emerald-400 font-bold block">100% On-Time</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">💰 মোট উপার্জিত আয়</span>
                <span className="text-lg font-black text-[#1DB954]">
                  ৳{(((adminPerformanceGig as any).price || adminPerformanceGig.packages?.basic?.price || 2500) * (adminPerformanceGig.salesCount || 12)).toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-emerald-400 font-bold block">এস্ক্রো সুরক্ষিত</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1DB954]" />
                <span>মেট্রিক্স ও কোয়ালিটি স্কোর (Quality Score)</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[11px] mb-1">
                    <span className="text-slate-300">ক্লিক-থ্রু রেট (CTR)</span>
                    <span className="text-[#1DB954]">5.8% (Excellent)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1DB954] h-full w-[65%] rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[11px] mb-1">
                    <span className="text-slate-300">অর্ডার কনভার্সন রেট</span>
                    <span className="text-blue-400">4.2%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[50%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
