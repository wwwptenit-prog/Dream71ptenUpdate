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
  Monitor,
  Smartphone,
  Bot,
  Cpu,
  Copy,
  Terminal,
  Code,
  Code2,
  Mail,
  Inbox,
  Layers,
  ExternalLink,
  Video,
  Percent,
  ChevronDown,
  ChevronRight,
  Menu,
  HelpCircle,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  Download,
  Phone,
  MessageCircle,
  Link2,
  FileUp,
  Lock,
  Unlock,
  Key,
  Crown
} from 'lucide-react';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

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
import { MarketplaceOrder, Service, DigitalProductDeliveryType } from '../types';

interface AdminPanelProps {
  setActiveTab?: (tab: string) => void;
}

interface AdminLoginGateProps {
  onLogin: (email: string, pass: string) => boolean;
  onGoHome?: () => void;
}

const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onLogin, onGoHome }) => {
  const [email, setEmail] = useState('admin@ptenit.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(email, password);
    if (!ok) {
      setError('লগইন ব্যর্থ হয়েছে! সঠিক এডমিন ইমেইল ও পাসওয়ার্ড দিন।');
    }
  };

  const handleQuickLogin = () => {
    const ok = onLogin('admin@ptenit.com', '123456');
    if (!ok) {
      setError('লগইন ব্যর্থ হয়েছে!');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 font-bengali">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-white font-heading">পিটেন আইটি এডমিন পোর্টাল</h2>
          <p className="text-xs text-slate-400 mt-1">
            ওয়েবসাইটের সকল কন্টেন্ট, কোর্স, সার্ভিস, ব্যানার ও সেটিংস নিয়ন্ত্রণ করতে এডমিন হিসেবে প্রবেশ করুন।
          </p>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        {/* 1-Click Fast Login */}
        <button
          onClick={handleQuickLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#1DB954]/25 transition cursor-pointer active:scale-95"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>১-ক্লিকে এডমিন লগইন করুন (Quick Login)</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-slate-500 text-[11px]">অথবা ক্রেডেনশিয়াল লিখুন</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">এডমিন ইমেইল / ইউজারনেম</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ptenit.com"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#1DB954]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#1DB954]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition cursor-pointer"
          >
            লগইন করুন
          </button>
        </form>

        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">ডিফল্ট এডমিন তথ্য:</p>
          <p>ইমেইল: <code className="text-emerald-400 font-mono">admin@ptenit.com</code> (বা <code className="text-emerald-400 font-mono">admin</code>)</p>
          <p>পাসওয়ার্ড: <code className="text-emerald-400 font-mono">123456</code></p>
        </div>

        {onGoHome && (
          <div>
            <button
              type="button"
              onClick={onGoHome}
              className="text-xs text-slate-400 hover:text-white transition underline cursor-pointer"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

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
    updateMarketplaceOrder,
    updateMarketplaceOrderStatus,
    deleteTeacherPayout,
    deleteTeacherNotice,
    updatePayoutStatus,
    sendTeacherNotice,
    gigs = [],
    deleteGig,
    updateGig,
    createGig,
    digitalProducts = [],
    addDigitalProduct,
    updateDigitalProduct,
    deleteDigitalProduct,
    jobs = [],
    proposals = [],
    marketplaceOrders = [],
    directMessages = [],
    createJob,
    dispatchJobToStaff,
    approveMentorApplication,
    rejectMentorApplication,
    logout,
    login
  } = useData();

  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');
  const [activeMainModule, setActiveMainModule] = useState<'dashboard' | 'academy' | 'marketplace' | 'settings' | 'system'>('dashboard');
  const [methodSubTab, setMethodSubTab] = useState<'all' | 'pixel' | 'payment' | 'tax'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Payment Automation Gateway States
  const [isTestingGateway, setIsTestingGateway] = useState(false);
  const [gatewayTestResult, setGatewayTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showGatewayGuide, setShowGatewayGuide] = useState(false);

  // Footer Payment Logos Manager States
  const [showAddLogoForm, setShowAddLogoForm] = useState(false);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [newLogoType, setNewLogoType] = useState<'mfs' | 'card' | 'bank' | 'other'>('mfs');
  const [logoFeedback, setLogoFeedback] = useState<string | null>(null);

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
  const [mktAdminSubTab, setMktAdminSubTab] = useState<'overview' | 'gigs' | 'jobs' | 'orders' | 'categories' | 'settings'>('overview');
  const [mktCommissionRate, setMktCommissionRate] = useState<number>(10);
  const [trainerRevShareRate, setTrainerRevShareRate] = useState<number>(90);
  const [clientProcessingFeePercent, setClientProcessingFeePercent] = useState<number>(0);
  const [freelancerWithdrawalFeePercent, setFreelancerWithdrawalFeePercent] = useState<number>(1.5);
  const [feeSimulatorAmount, setFeeSimulatorAmount] = useState<number>(10000);
  const [feeSaveSuccess, setFeeSaveSuccess] = useState<boolean>(false);
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

  // Office Projects & Seller Management States
  const [officeSearchQuery, setOfficeSearchQuery] = useState<string>('');
  const [officeStatusFilter, setOfficeStatusFilter] = useState<string>('all');
  const [officeDeliveryModalOrder, setOfficeDeliveryModalOrder] = useState<MarketplaceOrder | null>(null);
  const [officeDeliveryUrl, setOfficeDeliveryUrl] = useState<string>('');
  const [officeDeliveryNote, setOfficeDeliveryNote] = useState<string>('');
  const [officeAssignModalOrder, setOfficeAssignModalOrder] = useState<MarketplaceOrder | null>(null);
  const [officeAssignee, setOfficeAssignee] = useState<string>('');
  const [officeNoteModalOrder, setOfficeNoteModalOrder] = useState<MarketplaceOrder | null>(null);
  const [officeUpdateNoteText, setOfficeUpdateNoteText] = useState<string>('');
  const [officeActionMsg, setOfficeActionMsg] = useState<string>('');

  // Office Seller & Specialist Navigation States
  const [officeSellerSubTab, setOfficeSellerSubTab] = useState<'orders' | 'services' | 'courses' | 'classroom' | 'students' | 'financials' | 'freetools'>('orders');
  const [outsourceModalOrder, setOutsourceModalOrder] = useState<MarketplaceOrder | null>(null);
  const [outsourceTargetType, setOutsourceTargetType] = useState<'public' | 'staff'>('public');
  const [outsourceStaffName, setOutsourceStaffName] = useState<string>('');
  const [outsourceCommissionPercent, setOutsourceCommissionPercent] = useState<number>(20);
  const [outsourceOfferNote, setOutsourceOfferNote] = useState<string>('');

  // Free Tools States
  const [freeToolActive, setFreeToolActive] = useState<'invoice' | 'proposal' | 'calculator' | 'outreach'>('invoice');
  const [invClientName, setInvClientName] = useState('মেসার্স সিটি ট্রেডার্স');
  const [invServiceTitle, setInvServiceTitle] = useState('ওয়েবসাইট ডেভেলপমেন্ট & মার্কেটিং');
  const [invAmount, setInvAmount] = useState<number>(25000);
  const [invSuccessMsg, setInvSuccessMsg] = useState<string>('');

  // Digital Product Management States (Admin)
  const [dpModalOpen, setDpModalOpen] = useState(false);
  const [editingDpId, setEditingDpId] = useState<string | null>(null);
  const [dpTitle, setDpTitle] = useState('');
  const [dpCategory, setDpCategory] = useState<'WordPress' | 'Scripts & PHP' | 'Mobile App' | 'HTML/React' | 'Software' | 'Plugins'>('Scripts & PHP');
  const [dpPrice, setDpPrice] = useState<number>(450);
  const [dpOriginalPrice, setDpOriginalPrice] = useState<number>(1500);
  const [dpIsFree, setDpIsFree] = useState<boolean>(false);
  const [dpThumbnail, setDpThumbnail] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
  const [dpShortDesc, setDpShortDesc] = useState('');
  const [dpFullDesc, setDpFullDesc] = useState('');
  const [dpFileFormat, setDpFileFormat] = useState('ZIP / Source Code');
  const [dpFileSize, setDpFileSize] = useState('24 MB');
  const [dpVersion, setDpVersion] = useState('v1.0.0');
  const [dpDownloadUrl, setDpDownloadUrl] = useState('https://drive.google.com');
  const [dpLicenseKey, setDpLicenseKey] = useState('PTEN-PRO-2026-KEY');
  const [dpDeliveryType, setDpDeliveryType] = useState<DigitalProductDeliveryType>('canva_auto');
  const [dpCanvaInviteLink, setDpCanvaInviteLink] = useState('https://www.canva.com/brand/join?token=vip-ptenit-lifetime');
  const [dpCanvaRules, setDpCanvaRules] = useState('১. আপনার ক্যানভা অ্যাকাউন্টে লগইন অবস্থায় Access Now বাটনে ক্লিক করুন।\n২. এই এক্সেস শুধুমাত্র আপনার ব্যবহারের জন্য বরাদ্দ।');
  const [dpFeaturesText, setDpFeaturesText] = useState('রেসপন্সিভ ডিজাইন, লাইফটাইম আপডেট, ডকুমেন্টেশন অন্তর্ভুক্ত');
  const [dpRequirementsText, setDpRequirementsText] = useState('Node.js 18+ অথবা PHP 8.0+, cPanel হোস্টিং');
  const [dpSearchFilter, setDpSearchFilter] = useState('');
  const [dpCategoryFilter, setDpCategoryFilter] = useState('All');

  // Digital Product Orders & Access Delivery Management
  const [dpActiveSubTab, setDpActiveSubTab] = useState<'products' | 'orders'>('products');
  const [dpOrderFilter, setDpOrderFilter] = useState<'all' | 'pending' | 'granted'>('all');
  const [dpDeliveryTypeFilter, setDpDeliveryTypeFilter] = useState<'all' | 'canva_auto' | 'file_download' | 'email_whatsapp'>('all');
  const [dpPaymentStatusFilter, setDpPaymentStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [dpOrderSearch, setDpOrderSearch] = useState('');
  const [dpAccessFileModalOrder, setDpAccessFileModalOrder] = useState<MarketplaceOrder | null>(null);
  const [dpCustomDownloadUrl, setDpCustomDownloadUrl] = useState('');
  const [dpCustomFileName, setDpCustomFileName] = useState('');
  const [dpCustomLicenseKey, setDpCustomLicenseKey] = useState('');
  const [dpCustomAdminNote, setDpCustomAdminNote] = useState('');

  // Editable WhatsApp Message Modal State
  const [dpWhatsAppModalOrder, setDpWhatsAppModalOrder] = useState<MarketplaceOrder | null>(null);
  const [dpWhatsAppMessageText, setDpWhatsAppMessageText] = useState('');

  // Editable Email Message Modal State
  const [dpEmailModalOrder, setDpEmailModalOrder] = useState<MarketplaceOrder | null>(null);
  const [dpEmailSubject, setDpEmailSubject] = useState('');
  const [dpEmailBody, setDpEmailBody] = useState('');

  const [propClientName, setPropClientName] = useState('Mr. Rahat Karim');
  const [propProjectTitle, setPropProjectTitle] = useState('Social Media Ads & Sales Funnel');
  const [propGeneratedText, setPropGeneratedText] = useState<string>('');

  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(1500);
  const [calcHours, setCalcHours] = useState<number>(20);
  const [calcCommissionPercent, setCalcCommissionPercent] = useState<number>(20);

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

  // Admin Gig Upload Form State (Full Marketplace Features)
  const [gigModalOpen, setGigModalOpen] = useState(false);
  const [editingGigId, setEditingGigId] = useState<string | null>(null);
  const [gigModalTab, setGigModalTab] = useState<'basic' | 'packages' | 'media' | 'description' | 'requirements_faqs'>('basic');
  const [gigTitle, setGigTitle] = useState('');
  const [gigCategory, setGigCategory] = useState('Web Development');
  const [gigTags, setGigTags] = useState('React, Fullstack, Node');
  const [gigOfferBadge, setGigOfferBadge] = useState('cashback');
  const [gigSellerType, setGigSellerType] = useState<'agency' | 'staff'>('agency');
  const [gigSellerName, setGigSellerName] = useState('PTEN IT Official Agency');
  const [gigSellerLevel, setGigSellerLevel] = useState('Top Rated Agency');

  // 3-Tier Packages State
  const [gigBasicTitle, setGigBasicTitle] = useState('বেসিক স্টার্টার');
  const [gigBasicPrice, setGigBasicPrice] = useState(5000);
  const [gigBasicDelivery, setGigBasicDelivery] = useState(3);
  const [gigBasicRevisions, setGigBasicRevisions] = useState('3');
  const [gigBasicDesc, setGigBasicDesc] = useState('বেসিক রেসপন্সিভ ডিজাইন ও ক্লিন কোড বেজ');
  const [gigBasicFeatures, setGigBasicFeatures] = useState('কাস্টম ডিজাইন, রেসপন্সিভ লেআউট, বেসিক সাপোর্ট');

  const [gigStandardTitle, setGigStandardTitle] = useState('স্ট্যান্ডার্ড প্রো');
  const [gigStandardPrice, setGigStandardPrice] = useState(12000);
  const [gigStandardDelivery, setGigStandardDelivery] = useState(5);
  const [gigStandardRevisions, setGigStandardRevisions] = useState('5');
  const [gigStandardDesc, setGigStandardDesc] = useState('স্ট্যান্ডার্ড ফুল ফিচারড সলিউশন ও ইন্টিগ্রেশন');
  const [gigStandardFeatures, setGigStandardFeatures] = useState('কাস্টম ডিজাইন, রেসপন্সিভ লেআউট, ডাটাবেজ ইন্টিগ্রেশন, সোর্স কোড ফাইল, ৩০ দিন টেক সাপোর্ট');

  const [gigPremiumTitle, setGigPremiumTitle] = useState('প্রিমিয়াম এন্টারপ্রাইজ');
  const [gigPremiumPrice, setGigPremiumPrice] = useState(25000);
  const [gigPremiumDelivery, setGigPremiumDelivery] = useState(7);
  const [gigPremiumRevisions, setGigPremiumRevisions] = useState('Unlimited');
  const [gigPremiumDesc, setGigPremiumDesc] = useState('কমপ্লিট হাই-এন্ড এন্টারপ্রাইজ সিস্টেম ও ফুল সলিউশন');
  const [gigPremiumFeatures, setGigPremiumFeatures] = useState('কাস্টম ডিজাইন, রেসপন্সিভ লেআউট, ডাটাবেজ ও এপিআই কানেক্ট, সুপারফাস্ট স্পিড অপ্টিমাইজেশন, সোর্স কোড ডেলিভারি, লাইফটাইম প্রাইওরিটি সাপোর্ট');

  // Media
  const [gigThumbnail, setGigThumbnail] = useState('https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');
  const [gigGalleryImages, setGigGalleryImages] = useState<string[]>([]);
  const [gigNewGalleryUrl, setGigNewGalleryUrl] = useState('');
  const [gigVideoUrl, setGigVideoUrl] = useState('');

  // Description, Requirements & FAQs
  const [gigDescription, setGigDescription] = useState('');
  const [gigRequirements, setGigRequirements] = useState('');
  const [gigFaqs, setGigFaqs] = useState<{ q: string; a: string }[]>([
    { q: 'প্রজেক্ট শুরু করতে ক্লায়েন্টের কী কী দিতে হবে?', a: 'আপনার প্রয়োজনীয় ব্রিফ, লোগো, কনটেন্ট টেক্সট এবং রেফারেন্স ওয়েবসাইটের লিংক দিন।' },
    { q: 'কাজ শেষে কি সোর্স কোড ও ফুল এক্সেস পাবো?', a: 'হ্যাঁ, প্রজেক্টের যাবতীয় সোর্স কোড ও এক্সেস পুরোপুরি আপনাকে বুঝিয়ে দেওয়া হবে।' }
  ]);
  const [gigNewFaqQ, setGigNewFaqQ] = useState('');
  const [gigNewFaqA, setGigNewFaqA] = useState('');

  // Gigs Manage Sub Tab & Referral Modal State
  const [gigManageSubTab, setGigManageSubTab] = useState<'gigs' | 'orders'>('gigs');
  const [adminReferralModalOrder, setAdminReferralModalOrder] = useState<MarketplaceOrder | null>(null);
  const [adminReferralTargetType, setAdminReferralTargetType] = useState<'freelancer' | 'staff' | 'trainer' | 'custom'>('freelancer');
  const [adminReferralAssignee, setAdminReferralAssignee] = useState('ইঞ্জি. তানভীর আহমেদ');
  const [adminReferralCustomName, setAdminReferralCustomName] = useState('');
  const [adminReferralCommission, setAdminReferralCommission] = useState(20);
  const [adminReferralNote, setAdminReferralNote] = useState('');

  // Gallery Form State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState<'Office' | 'Students' | 'Training' | 'Events' | 'Certificates' | 'Projects' | 'Activities'>('Training');
  const [galleryImageUrl, setGalleryImageUrl] = useState('');
  const [galleryCaption, setGalleryCaption] = useState('');

  // Sub-Admin Recruitment Form State
  const [subAdminModalOpen, setSubAdminModalOpen] = useState(false);
  const [subAdminName, setSubAdminName] = useState('');
  const [subAdminEmail, setSubAdminEmail] = useState('');
  const [subAdminPhone, setSubAdminPhone] = useState('');
  const [subAdminRole, setSubAdminRole] = useState<'Sub-Admin' | 'Support Specialist' | 'Order Manager' | 'Course Admin'>('Sub-Admin');
  const [subAdminPermissions, setSubAdminPermissions] = useState<string[]>(['orders_manage', 'support_chat']);
  const [subAdminSearchFilter, setSubAdminSearchFilter] = useState('');
  const [subAdminRoleFilter, setSubAdminRoleFilter] = useState<string>('all');
  const [selectedSubAdminIds, setSelectedSubAdminIds] = useState<string[]>([]);

  // Sidebar Collapsible Navigation Sections State
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    site_settings: false,
    user_management: false,
    payment_config: false,
    academy: false,
    marketplace: false,
    system_tech: false,
  });

  const toggleSidebarSection = (key: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

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
      if (siteSettings.defaultCommissionRate !== undefined) {
        setMktCommissionRate(siteSettings.defaultCommissionRate);
      }
      if (siteSettings.defaultTrainerRevShare !== undefined) {
        setTrainerRevShareRate(siteSettings.defaultTrainerRevShare);
      }
      if (siteSettings.defaultClientFee !== undefined) {
        setClientProcessingFeePercent(siteSettings.defaultClientFee);
      }
      if (siteSettings.defaultWithdrawalFee !== undefined) {
        setFreelancerWithdrawalFeePercent(siteSettings.defaultWithdrawalFee);
      }
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
    return <AdminLoginGate onLogin={login} onGoHome={() => setActiveTab?.('home')} />;
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

  // Helper to open fresh Gig Creation Modal with full default packages
  const openCreateGigModal = () => {
    setEditingGigId(null);
    setGigModalTab('basic');
    setGigTitle('');
    setGigCategory('Web Development');
    setGigTags('React, Fullstack, Next.js, Node.js, Tailwind');
    setGigOfferBadge('cashback');
    setGigSellerType('agency');
    setGigSellerName('PTEN IT Official Agency');
    setGigSellerLevel('Top Rated Agency');
    
    // Packages
    setGigBasicTitle('বেসিক স্টার্টার');
    setGigBasicPrice(5000);
    setGigBasicDelivery(3);
    setGigBasicRevisions('3');
    setGigBasicDesc('বেসিক রেসপন্সিভ সিঙ্গেল/ল্যান্ডিং পেজ ও ক্লিন ডিজাইন');
    setGigBasicFeatures('কাস্টম ডিজাইন, রেসপন্সিভ লেআউট, বেসিক টেক সাপোর্ট');

    setGigStandardTitle('স্ট্যান্ডার্ড প্রো');
    setGigStandardPrice(12000);
    setGigStandardDelivery(5);
    setGigStandardRevisions('5');
    setGigStandardDesc('সম্পূর্ণ ডাইনামিক মাল্টি-পেজ ওয়েবসাইট ও ডাটাবেজ ইন্টিগ্রেশন');
    setGigStandardFeatures('কাস্টম ডিজাইন, রেসপন্সিভ লেআউট, ডাটাবেজ ইন্টিগ্রেশন, সোর্স কোড ফাইল, ৩০ দিন সাপোর্ট');

    setGigPremiumTitle('প্রিমিয়াম এন্টারপ্রাইজ');
    setGigPremiumPrice(25000);
    setGigPremiumDelivery(7);
    setGigPremiumRevisions('Unlimited');
    setGigPremiumDesc('হাই-পারফরম্যান্স ফুলস্ট্যাক এন্টারপ্রাইজ সিস্টেম ও লাইফটাইম সাপোর্ট');
    setGigPremiumFeatures('কাস্টম ডিজাইন, রেসপন্সিভ লেআউট, ডাটাবেজ ও এপিআই কানেক্ট, সুপারফাস্ট স্পিড অপ্টিমাইজেশন, সোর্স কোড ডেলিভারি, লাইফটাইম প্রাইওরিটি সাপোর্ট');

    // Media & Content
    setGigThumbnail('https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');
    setGigGalleryImages([]);
    setGigNewGalleryUrl('');
    setGigVideoUrl('');
    setGigDescription('PTEN IT এজেন্সির অভিজ্ঞ ডেভেলপার ও ইঞ্জিনিয়ার টিম আপনার রিকোয়ারমেন্ট অনুযায়ী সর্বোচ্চ কোয়ালিটির প্রজেক্ট তৈরি করে দিবে।');
    setGigRequirements('১. প্রয়োজনীয় লোগো ও ব্র্যান্ডিং গাইডলাইন\n২. সাইটের কনটেন্ট বা ডেমো রেফারেন্স লিংক\n৩. কোনো স্পেশাল ফিচার থাকলে তার ব্রিফ');
    setGigFaqs([
      { q: 'প্রজেক্ট শুরু করতে ক্লায়েন্টের কী কী দিতে হবে?', a: 'আপনার প্রয়োজনীয় ব্রিফ, লোগো, কনটেন্ট টেক্সট এবং রেফারেন্স ওয়েবসাইটের লিংক দিন।' },
      { q: 'কাজ শেষে কি সোর্স কোড ও ফুল এক্সেস পাবো?', a: 'হ্যাঁ, প্রজেক্টের যাবতীয় সোর্স কোড ও এক্সেস পুরোপুরি আপনাকে বুঝিয়ে দেওয়া হবে।' }
    ]);
    setGigModalOpen(true);
  };

  // Helper to open Gig Edit Modal with existing data populated
  const openEditGigModal = (g: any) => {
    setEditingGigId(g.id);
    setGigModalTab('basic');
    setGigTitle(g.title || '');
    setGigCategory(g.category || 'Web Development');
    setGigTags(g.tags ? g.tags.join(', ') : 'React, Node, Fullstack');
    setGigOfferBadge(g.offerBadge || 'cashback');
    setGigSellerType(g.sellerId === 'ptenit-official' ? 'agency' : 'staff');
    setGigSellerName(g.sellerName || 'PTEN IT Official Agency');
    setGigSellerLevel(g.sellerLevel || 'Top Rated Agency');

    // Populate packages
    const b = g.packages?.basic;
    setGigBasicTitle(b?.name || 'বেসিক প্যাকেজ');
    setGigBasicPrice(b?.price || 5000);
    setGigBasicDelivery(b?.deliveryDays || 3);
    setGigBasicRevisions(b?.revisions || '3');
    setGigBasicDesc(b?.description || 'বেসিক স্টার্টার');
    setGigBasicFeatures(b?.features ? b.features.join(', ') : 'কাস্টম ডিজাইন, রেসপন্সিভ লেআউট');

    const s = g.packages?.standard;
    setGigStandardTitle(s?.name || 'স্ট্যান্ডার্ড প্যাকেজ');
    setGigStandardPrice(s?.price || 12000);
    setGigStandardDelivery(s?.deliveryDays || 5);
    setGigStandardRevisions(s?.revisions || '5');
    setGigStandardDesc(s?.description || 'স্ট্যান্ডার্ড প্রো সলিউশন');
    setGigStandardFeatures(s?.features ? s.features.join(', ') : 'কাস্টম ডিজাইন, ডাটাবেজ ইন্টিগ্রেশন, সোর্স কোড ফাইল');

    const p = g.packages?.premium;
    setGigPremiumTitle(p?.name || 'প্রিমিয়াম প্যাকেজ');
    setGigPremiumPrice(p?.price || 25000);
    setGigPremiumDelivery(p?.deliveryDays || 7);
    setGigPremiumRevisions(p?.revisions || 'Unlimited');
    setGigPremiumDesc(p?.description || 'কমপ্লিট এন্টারপ্রাইজ সিস্টেম');
    setGigPremiumFeatures(p?.features ? p.features.join(', ') : 'কাস্টম ডিজাইন, ডাটাবেজ ও এপিআই কানেক্ট, স্পিড অপ্টিমাইজেশন');

    setGigThumbnail(g.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80');
    setGigGalleryImages(g.galleryImages || []);
    setGigNewGalleryUrl('');
    setGigVideoUrl(g.videoUrl || '');
    setGigDescription(g.description || '');
    setGigRequirements(g.requirements || '');
    setGigFaqs(g.faqs || [
      { q: 'প্রজেক্ট শুরু করতে কী কী লাগবে?', a: 'লোগো, কনটেন্ট টেক্সট এবং রেফারেন্স লিংক প্রদান করুন।' }
    ]);
    setGigModalOpen(true);
  };

  // Handle Save Full-Featured Gig (Admin Mode)
  const handleSaveGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle || !gigDescription) {
      alert('অনুগ্রহ করে গিগ টাইটেল ও বিস্তারিত বিবরণ প্রদান করুন।');
      return;
    }

    const basicPkg = {
      name: gigBasicTitle || 'বেসিক প্যাকেজ',
      price: Number(gigBasicPrice) || 5000,
      deliveryDays: Number(gigBasicDelivery) || 3,
      revisions: gigBasicRevisions || '3',
      description: gigBasicDesc || 'বেসিক স্টার্টার সলিউশন',
      features: gigBasicFeatures.split(',').map(f => f.trim()).filter(Boolean)
    };

    const standardPkg = {
      name: gigStandardTitle || 'স্ট্যান্ডার্ড প্যাকেজ',
      price: Number(gigStandardPrice) || 12000,
      deliveryDays: Number(gigStandardDelivery) || 5,
      revisions: gigStandardRevisions || '5',
      description: gigStandardDesc || 'স্ট্যান্ডার্ড প্রফেশনাল সলিউশন',
      features: gigStandardFeatures.split(',').map(f => f.trim()).filter(Boolean)
    };

    const premiumPkg = {
      name: gigPremiumTitle || 'প্রিমিয়াম প্যাকেজ',
      price: Number(gigPremiumPrice) || 25000,
      deliveryDays: Number(gigPremiumDelivery) || 7,
      revisions: gigPremiumRevisions || 'Unlimited',
      description: gigPremiumDesc || 'কমপ্লিট হাই-এন্ড এন্টারপ্রাইজ সলিউশন',
      features: gigPremiumFeatures.split(',').map(f => f.trim()).filter(Boolean)
    };

    const gigPayload = {
      title: gigTitle,
      category: gigCategory,
      price: basicPkg.price,
      priceText: `৳${basicPkg.price.toLocaleString('bn-BD')}`,
      deliveryTime: `${basicPkg.deliveryDays} দিন`,
      description: gigDescription,
      thumbnail: gigThumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      galleryImages: gigGalleryImages.length > 0 ? gigGalleryImages : [gigThumbnail],
      videoUrl: gigVideoUrl || undefined,
      tags: gigTags.split(',').map(t => t.trim()).filter(Boolean),
      offerBadge: gigOfferBadge || 'regular',
      sellerId: gigSellerType === 'agency' ? 'ptenit-official' : 'ptenit-staff',
      sellerName: gigSellerName || 'PTEN IT Official Agency',
      sellerAvatar: siteSettings.logoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      sellerLevel: gigSellerLevel || 'Top Rated Agency',
      isAgencyStaff: true,
      requirements: gigRequirements,
      faqs: gigFaqs,
      packages: {
        basic: basicPkg,
        standard: standardPkg,
        premium: premiumPkg
      }
    };

    if (editingGigId) {
      updateGig(editingGigId, gigPayload);
      alert('গিগ সফলভাবে আপডেট করা হয়েছে!');
    } else {
      createGig({
        ...gigPayload,
        status: 'active'
      });
      alert('নতুন অফিশিয়াল গিগ সফলভাবে মার্কেটপ্লেসে পাবলিশ করা হয়েছে!');
    }

    setGigModalOpen(false);
    setEditingGigId(null);
  };

  // Handle Save Sub-Admin / Support Staff
  const handleSaveSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAdminName || !subAdminEmail) return;

    const newMember = {
      id: `sub-${Date.now()}`,
      name: subAdminName,
      email: subAdminEmail,
      phone: subAdminPhone || '01700000000',
      role: subAdminRole,
      permissions: subAdminPermissions,
      status: 'active' as const,
      assignedAt: new Date().toISOString().split('T')[0]
    };

    const currentList = settingsForm.subAdminMembers || [];
    const updatedMembers = [...currentList, newMember];

    setSettingsForm({ ...settingsForm, subAdminMembers: updatedMembers });
    updateSiteSettings({ ...settingsForm, subAdminMembers: updatedMembers });

    setSubAdminName('');
    setSubAdminEmail('');
    setSubAdminPhone('');
    setSubAdminModalOpen(false);
  };

  const handleRemoveSubAdmin = (id: string) => {
    const currentList = settingsForm.subAdminMembers || [];
    const updatedMembers = currentList.filter(m => m.id !== id);
    setSettingsForm({ ...settingsForm, subAdminMembers: updatedMembers });
    updateSiteSettings({ ...settingsForm, subAdminMembers: updatedMembers });
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

  const handleTestGatewayConnection = async () => {
    setIsTestingGateway(true);
    setGatewayTestResult(null);
    try {
      const res = await fetch('/api/payment/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: settingsForm.selectedGateway || 'bkash_pgw',
          isSandbox: settingsForm.gatewaySandboxMode !== false,
          appKey: settingsForm.bkashAppKey,
          appSecret: settingsForm.bkashAppSecret,
          username: settingsForm.bkashUsername,
          password: settingsForm.bkashPassword,
          storeId: settingsForm.gatewayStoreId,
          storePassword: settingsForm.gatewayStorePassword,
        })
      });
      const data = await res.json();
      setGatewayTestResult({
        success: data.success,
        message: data.message || (data.success ? 'সংযোগ সফল!' : 'সংযোগ ব্যর্থ!')
      });
    } catch (err: any) {
      setGatewayTestResult({
        success: false,
        message: 'সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।'
      });
    } finally {
      setIsTestingGateway(false);
    }
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
    <div className="py-2 sm:py-6 bg-slate-950 text-slate-100 min-h-screen transition-colors font-bengali w-full overflow-x-hidden pb-12">
      <div className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        
        {/* DESKTOP TOP NAV HEADER (lg:flex) */}
        <header className="hidden lg:flex bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-xl justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-amber-500/15 rounded-xl border border-amber-500/30 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white tracking-wide">PTENit এডমিন সেন্টার</h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="সিস্টেম অনলাইন" />
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                  {currentUser.email}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                <span>মডিউল:</span>
                <span className="text-amber-400 font-bold">
                  {activeMainModule === 'dashboard' ? 'ড্যাশবোর্ড' :
                   activeMainModule === 'academy' ? 'একাডেমি' :
                   activeMainModule === 'marketplace' ? 'মার্কেটপ্লেস' :
                   activeMainModule === 'settings' ? 'সেটিংস' : 'সিস্টেম'}
                </span>
                <span>/</span>
                <span className="text-slate-300">
                  {activeAdminTab === 'dashboard' ? 'ওভারভিউ' :
                   activeAdminTab === 'courses' ? 'কোর্সসমূহ' :
                   activeAdminTab === 'teachers' ? 'টিচারস' :
                   activeAdminTab === 'students' ? 'স্টুডেন্টস' :
                   activeAdminTab === 'billing_verify' ? 'বিল ভেরিফাই' :
                   activeAdminTab === 'gigs_manage' ? 'গিগ আপলোড' :
                   activeAdminTab === 'settings' ? 'সাইট সেটিংস' : activeAdminTab}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
            </button>

            {/* Night Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-amber-400 transition flex items-center justify-center cursor-pointer"
              title={darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setAdminNotifOpen(!adminNotifOpen)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer relative"
                title="নোটিফিকেশন"
              >
                <Bell className="w-4 h-4 text-[#1DB954]" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 bg-rose-600 text-white font-black text-[9px] rounded-full flex items-center justify-center shadow">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {adminNotifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-bengali">
                  <div className="px-3.5 py-2.5 bg-slate-800/90 border-b border-slate-800 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-emerald-400" />
                      <span>নোটিফিকেশন সেন্টার</span>
                    </h4>
                    <div className="flex items-center gap-1.5">
                      {notifications.filter(n => !n.read).length > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-[10px] text-emerald-400 hover:underline font-bold">
                          সব পঠিত ✓
                        </button>
                      )}
                      <button onClick={() => setAdminNotifOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
                    </div>
                  </div>
                  <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">কোনো নোটিফিকেশন নেই।</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            n.read ? 'bg-slate-800/40 text-slate-400' : 'bg-slate-800 text-white border border-emerald-500/20'
                          }`}
                        >
                          <p className="font-bold text-[11px] truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-300 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-500 mt-0.5 block">{n.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                setActiveTab?.('home');
              }}
              className="px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/25 transition cursor-pointer flex items-center gap-1"
              title="লগআউট"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </header>

        {/* MOBILE DEDICATED PHONE NAVIGATION HEADER (ONLY ON < lg) */}
        <div className="w-full block lg:hidden space-y-1.5 font-bengali sticky top-0 z-30">
          {/* Mobile Top Sticky Bar */}
          <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800/80 rounded-xl px-2.5 py-1.5 shadow-lg flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="p-1 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="text-[11px] font-black text-white truncate">PTENit</h1>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="text-[10px] font-bold text-amber-400 px-1 py-0.2 bg-amber-500/10 rounded border border-amber-500/20 truncate">
                    {activeMainModule === 'dashboard' ? 'ড্যাশবোর্ড' :
                     activeMainModule === 'academy' ? 'একাডেমি' :
                     activeMainModule === 'marketplace' ? 'মার্কেট' :
                     activeMainModule === 'settings' ? 'সেটিংস' : 'সিস্টেম'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="px-1.5 py-1 bg-slate-900 rounded-lg text-[10px] font-bold text-slate-300 border border-slate-800 cursor-pointer"
              >
                {lang === 'bn' ? 'ENG' : 'বাং'}
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-1 bg-slate-900 rounded-lg text-amber-400 border border-slate-800 cursor-pointer"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setAdminNotifOpen(!adminNotifOpen)}
                className="p-1 bg-slate-900 rounded-lg text-[#1DB954] border border-slate-800 cursor-pointer relative"
              >
                <Bell className="w-3.5 h-3.5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-600 text-white font-black text-[8px] rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow cursor-pointer active:scale-95"
              >
                <Menu className="w-3 h-3" />
                <span>মেনু</span>
              </button>
            </div>
          </div>

          {/* Mobile Horizontal 5-Module Navigation Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
            {[
              { id: 'dashboard', label: '📊 ড্যাশবোর্ড', tab: 'dashboard' },
              { id: 'academy', label: '🎓 একাডেমি', tab: 'courses', badge: payouts.filter(p => p.status === 'Pending').length },
              { id: 'marketplace', label: '💼 মার্কেট', tab: 'gigs_manage', badge: gigs.length },
              { id: 'settings', label: '⚙️ সেটিংস', tab: 'settings' },
              { id: 'system', label: '💻 সিস্টেম', tab: 'gallery' }
            ].map(m => {
              const isActive = activeMainModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveMainModule(m.id as any);
                    setActiveAdminTab(m.tab);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1 shrink-0 transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="whitespace-nowrap">{m.label}</span>
                  {!!m.badge && m.badge > 0 && (
                    <span className={`px-1 py-0.1 rounded-full text-[9px] font-black ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Secondary Sub-Tabs Row (Only when module !== 'dashboard') */}
          {activeMainModule !== 'dashboard' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none bg-slate-900/90 p-1 rounded-lg border border-slate-800">
              {(() => {
                let currentSubTabs: { id: string; label: string; badge?: number }[] = [];
                if (activeMainModule === 'academy') {
                  currentSubTabs = [
                    { id: 'courses', label: 'কোর্সসমূহ' },
                    { id: 'teachers', label: 'টিচারস', badge: payouts.filter(p => p.status === 'Pending').length },
                    { id: 'students', label: 'স্টুডেন্ট', badge: totalStudents },
                    { id: 'billing_verify', label: 'বিল ভেরিফাই', badge: companyBills.filter(b => b.status === 'pending').length }
                  ];
                } else if (activeMainModule === 'marketplace') {
                  currentSubTabs = [
                    { id: 'gigs_manage', label: 'গিগ আপলোড', badge: gigs.length },
                    { id: 'digital_products', label: 'ডিজিটাল প্রোডাক্ট' },
                    { id: 'agency_clients', label: 'ক্লায়েন্টস' },
                    { id: 'billing_verify', label: 'বিল ভেরিফাই', badge: companyBills.filter(b => b.status === 'pending').length },
                    { id: 'financials', label: 'ফিনান্সিয়াল' }
                  ];
                } else if (activeMainModule === 'settings') {
                  currentSubTabs = [
                    { id: 'settings', label: 'সাইট সেটিংস' },
                    { id: 'sub_admins', label: 'সাব-এডমিন' },
                    { id: 'payment_methods', label: 'পেমেন্ট মেথড' },
                    { id: 'fee_commission', label: 'কমিশন' }
                  ];
                } else if (activeMainModule === 'system') {
                  currentSubTabs = [
                    { id: 'gallery', label: 'গ্যালারি' },
                    { id: 'pixel_setup', label: 'পিক্সেল' },
                    { id: 'seo_setup', label: 'SEO' },
                    { id: 'written_content', label: 'কনটেন্ট' },
                    { id: 'responsive_setup', label: 'লেআউট' }
                  ];
                }

                return currentSubTabs.map(sub => {
                  const isSubActive = activeAdminTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveAdminTab(sub.id)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold shrink-0 transition border cursor-pointer ${
                        isSubActive
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-black'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {!!sub.badge && sub.badge > 0 && (
                        <span className="ml-1 px-1 rounded-full text-[8px] bg-rose-600 text-white">
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          )}
        </div>

        {/* MOBILE SLIDE-OVER DRAWER MODAL */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex font-bengali lg:hidden animate-fadeIn">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative w-[80%] max-w-xs bg-slate-900 border-r border-slate-800 h-full p-3.5 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/15 rounded-lg text-amber-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white">এডমিন কন্ট্রোল মেনু</h3>
                      <p className="text-[10px] text-slate-400">পিটেন আইটি সিস্টেম</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: 'dashboard', label: 'ড্যাশবোর্ড', sub: 'ওভারভিউ & স্ট্যাটস', icon: LayoutDashboard, tab: 'dashboard' },
                    { id: 'academy', label: 'একাডেমি', sub: 'কোর্স, স্টুডেন্ট & টিচার', icon: BookOpen, tab: 'courses', badge: payouts.filter(p => p.status === 'Pending').length },
                    { id: 'marketplace', label: 'মার্কেটপ্লেস', sub: 'গিগ, সার্ভিস & ক্লায়েন্ট', icon: ShoppingBag, tab: 'gigs_manage', badge: gigs.length },
                    { id: 'settings', label: 'সেটিংস', sub: 'সাইট কনফিগ & পেমেন্ট', icon: Settings, tab: 'settings' },
                    { id: 'system', label: 'সিস্টেম', sub: 'গ্যালারি, SEO & লেআউট', icon: Cpu, tab: 'gallery' }
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = activeMainModule === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMainModule(item.id as any);
                          setActiveAdminTab(item.tab);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                            : 'bg-slate-800/60 text-slate-200 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-amber-400" />
                          <div>
                            <p className="text-xs font-bold">{item.label}</p>
                            <p className={`text-[9px] ${isActive ? 'text-slate-950 font-semibold' : 'text-slate-400'}`}>{item.sub}</p>
                          </div>
                        </div>
                        {!!item.badge && item.badge > 0 && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-rose-600 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAddPageModalOpen(true);
                  }}
                  className="w-full py-2 px-3 font-bold text-[11px] flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ নতুন পেজ যুক্ত করুন</span>
                </button>
              </div>

              <div className="pt-2.5 border-t border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 truncate">
                  এডমিন: <span className="text-emerald-400 font-mono">{currentUser.email}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    setActiveTab?.('home');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs border border-rose-500/25 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN RESPONSIVE CONTAINER: PC SIDEBAR + WORKSPACE */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          
          {/* DESKTOP SIDEBAR (lg:block) */}
          <aside className="hidden lg:block lg:w-60 xl:w-64 shrink-0 lg:sticky lg:top-4 z-20 space-y-3 font-bengali">
            <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-3 shadow-xl space-y-3">
              
              {/* Sidebar Header */}
              <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black text-white">কন্ট্রোল মেনু</h2>
                    <p className="text-[10px] text-slate-400">নেভিগেশন প্যানেল</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* 5 Main Modules */}
              <div className="space-y-1.5">
                {[
                  {
                    id: 'dashboard',
                    label: 'ড্যাশবোর্ড',
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
                    label: 'একাডেমি',
                    subText: 'কোর্স, স্টুডেন্ট & টিচার্স',
                    icon: BookOpen,
                    badge: payouts.filter(p => p.status === 'Pending').length,
                    isActive: activeMainModule === 'academy',
                    onClick: () => {
                      setActiveMainModule('academy');
                      if (!['courses', 'teachers', 'students', 'billing_verify'].includes(activeAdminTab)) {
                        setActiveAdminTab('courses');
                      }
                    }
                  },
                  {
                    id: 'marketplace',
                    label: 'মার্কেটপ্লেস',
                    subText: 'গিগ, সার্ভিস & ক্লায়েন্ট',
                    icon: ShoppingBag,
                    badge: gigs.length > 0 ? gigs.length : undefined,
                    isActive: activeMainModule === 'marketplace',
                    onClick: () => {
                      setActiveMainModule('marketplace');
                      if (!['gigs_manage', 'digital_products', 'agency_clients', 'financials'].includes(activeAdminTab)) {
                        setActiveAdminTab('gigs_manage');
                      }
                    }
                  },
                  {
                    id: 'settings',
                    label: 'সেটিংস',
                    subText: 'সাইট কনফিগ & পেমেন্ট',
                    icon: Settings,
                    isActive: activeMainModule === 'settings',
                    onClick: () => {
                      setActiveMainModule('settings');
                      if (!['settings', 'sub_admins', 'payment_methods', 'fee_commission'].includes(activeAdminTab) && !activeAdminTab.startsWith('custom_')) {
                        setActiveAdminTab('settings');
                      }
                    }
                  },
                  {
                    id: 'system',
                    label: 'সিস্টেম',
                    subText: 'গ্যালারি, SEO & লেআউট',
                    icon: Cpu,
                    isActive: activeMainModule === 'system',
                    onClick: () => {
                      setActiveMainModule('system');
                      if (!['gallery', 'pixel_setup', 'seo_setup', 'written_content', 'responsive_setup'].includes(activeAdminTab)) {
                        setActiveAdminTab('gallery');
                      }
                    }
                  }
                ].map(nav => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.id}
                      onClick={nav.onClick}
                      className={`w-full p-2 rounded-xl transition cursor-pointer border text-left flex items-center justify-between ${
                        nav.isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow font-black'
                          : 'bg-slate-800/60 text-slate-200 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${nav.isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-amber-400 border border-slate-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black truncate">{nav.label}</p>
                          <p className={`text-[10px] truncate ${nav.isActive ? 'text-slate-950 font-semibold' : 'text-slate-400'}`}>
                            {nav.subText}
                          </p>
                        </div>
                      </div>

                      {!!nav.badge && nav.badge > 0 && (
                        <span className={`px-1.5 py-0.2 text-[10px] font-black rounded-full shrink-0 ${
                          nav.isActive ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white animate-pulse'
                        }`}>
                          {nav.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer Action: Add New Page */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setAddPageModalOpen(true)}
                  className="w-full py-2 px-3 font-bold text-xs flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ নতুন পেজ যোগ করুন</span>
                </button>
              </div>

            </div>
          </aside>

          {/* RIGHT MAIN WORKSPACE AREA */}
          <main className="flex-1 min-w-0 w-full space-y-4">

            {/* Toast Notification */}
            {newPageSuccessMsg && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] p-3 rounded-xl text-xs font-bold flex items-center justify-between shadow animate-fade-in font-bengali">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                  <span>{newPageSuccessMsg}</span>
                </div>
                <button onClick={() => setNewPageSuccessMsg('')} className="text-slate-400 hover:text-white">✕</button>
              </div>
            )}

            {/* DESKTOP WORKSPACE SUB-TABS BAR (lg:flex) */}
            {(() => {
              if (activeMainModule === 'dashboard') return null;

              let subTabs: { id: string; label: string; icon: any; badge?: number }[] = [];
              let categoryTitle = '';
              let categoryColor = '';

              if (activeMainModule === 'academy') {
                categoryTitle = '🎓 একাডেমি:';
                categoryColor = 'text-[#1DB954]';
                subTabs = [
                  { id: 'courses', label: 'কোর্সসমূহ', icon: BookOpen },
                  { id: 'teachers', label: 'টিচারস', icon: Users, badge: payouts.filter(p => p.status === 'Pending').length },
                  { id: 'students', label: 'স্টুডেন্টস', icon: Users, badge: totalStudents },
                  { id: 'billing_verify', label: '⚡ বিল লেজার & ভেরিফাই', icon: ShieldCheck, badge: companyBills.filter(b => b.status === 'pending').length }
                ];
              } else if (activeMainModule === 'marketplace') {
                categoryTitle = '💼 মার্কেটপ্লেস:';
                categoryColor = 'text-purple-400';
                subTabs = [
                  { id: 'gigs_manage', label: 'গিগ আপলোড', icon: ShoppingBag, badge: gigs.length },
                  { id: 'digital_products', label: 'ডিজিটাল প্রোডাক্ট', icon: Zap, badge: digitalProducts.length },
                  { id: 'agency_clients', label: 'ক্লায়েন্টস', icon: Building2 },
                  { id: 'billing_verify', label: '⚡ বিল ভেরিফাই', icon: ShieldCheck, badge: companyBills.filter(b => b.status === 'pending').length },
                  { id: 'financials', label: 'ফিনান্সিয়ালস', icon: DollarSign }
                ];
              } else if (activeMainModule === 'settings') {
                categoryTitle = '⚙️ সেটিংস & কনফিগ:';
                categoryColor = 'text-amber-400';
                subTabs = [
                  { id: 'settings', label: 'সাইট সেটিংস', icon: Settings },
                  { id: 'sub_admins', label: 'সাব-এডমিন', icon: Users, badge: (settingsForm.subAdminMembers && settingsForm.subAdminMembers.length > 0) ? settingsForm.subAdminMembers.length : undefined },
                  { id: 'payment_methods', label: 'পেমেন্ট মেথড', icon: CreditCard },
                  { id: 'fee_commission', label: 'কমিশন কন্ট্রোল', icon: Percent },
                  ...customAdminPages.filter(cp => cp.category !== 'system').map(cp => ({
                    id: cp.id,
                    label: cp.label,
                    icon: FileText
                  }))
                ];
              } else if (activeMainModule === 'system') {
                categoryTitle = '🖥️ সিস্টেম & লেআউট:';
                categoryColor = 'text-sky-400';
                subTabs = [
                  { id: 'gallery', label: 'গ্যালারি', icon: ImageIcon },
                  { id: 'pixel_setup', label: 'পিক্সেল সেটআপ', icon: Sparkles },
                  { id: 'seo_setup', label: 'SEO এডিটর', icon: Globe },
                  { id: 'written_content', label: 'লিখিত কনটেন্ট', icon: FileText },
                  { id: 'responsive_setup', label: 'রেসপন্সিভ সেটআপ', icon: Monitor },
                  ...customAdminPages.filter(cp => cp.category === 'system').map(cp => ({
                    id: cp.id,
                    label: cp.label,
                    icon: FileText
                  }))
                ];
              }

              return (
                <div className="hidden lg:flex bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow items-center justify-between gap-3 font-bengali">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-black ${categoryColor}`}>{categoryTitle}</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {subTabs.map(st => {
                      const Icon = st.icon;
                      const isActive = activeAdminTab === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setActiveAdminTab(st.id)}
                          className={`py-1.5 px-3 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border shrink-0 ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-xs'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                          <span className="whitespace-nowrap">{st.label}</span>
                          {!!st.badge && st.badge > 0 && (
                            <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full ${
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

            {/* CUSTOM DYNAMIC PAGE VIEW */}
            {activeAdminTab.startsWith('custom_') && (
              <div className="space-y-4 font-bengali">
                {(() => {
                  const pageInfo = customAdminPages.find(p => p.id === activeAdminTab);
                  return (
                    <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] rounded border border-amber-500/30">
                              মডিউল #{pageInfo?.serial || '12'}
                            </span>
                            <h2 className="text-base sm:text-lg font-black text-white">{pageInfo?.label || 'কাস্টম এডমিন পেইজ'}</h2>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{pageInfo?.desc || 'কাস্টম ফিচার ও ডাটা ফ্রেম।'}</p>
                        </div>
                        <button
                          onClick={() => {
                            setCustomAdminPages(prev => prev.filter(p => p.id !== activeAdminTab));
                            setActiveAdminTab('dashboard');
                          }}
                          className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-lg border border-rose-500/30 cursor-pointer flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>রিমুভ করুন</span>
                        </button>
                      </div>

                      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                        <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 flex items-center justify-center mx-auto text-lg font-bold">
                          ⚡
                        </div>
                        <h3 className="text-sm font-black text-white">কাস্টম মডিউল লেআউট রেডি</h3>
                        <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                          ভবিষ্যতে যেকোনো এপিআই ও কাস্টম উইজেট এখানে সংযুক্ত করতে পারবেন।
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 1: DASHBOARD STATS */}
            {activeAdminTab === 'dashboard' && (
              <div className="space-y-3 sm:space-y-4 font-bengali">
                {/* Analytics Header Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow">
                  <div className="space-y-0.5">
                    <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-[#1DB954]" /> ওভারভিউ ও লাইভ স্ট্যাটিস্টিক্স
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      কোর্স, স্টুডেন্ট, সার্ভিস ও আয়ের সার্বিক সারসংক্ষেপ
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveAdminTab('billing_verify')}
                      className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>পেমেন্ট ভেরিফাই</span>
                    </button>
                  </div>
                </div>

                {/* Metric Cards Grid: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
                  {/* Card 1: Total Students */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/30 transition shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-slate-400 truncate">স্টুডেন্টস</span>
                      <div className="p-1 bg-emerald-500/10 rounded-lg text-[#1DB954]">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-base sm:text-lg font-black text-white font-mono">{totalStudents} <span className="text-[10px] font-normal text-slate-400">জন</span></p>
                      <p className="text-[9px] text-emerald-400 font-bold mt-0.5 truncate">● এক্টিভ ডাটাবেজ</p>
                    </div>
                  </div>

                  {/* Card 2: Total Revenue */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/30 transition shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-slate-400 truncate">মোট রিভেনিউ</span>
                      <div className="p-1 bg-amber-500/10 rounded-lg text-amber-400">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-base sm:text-lg font-black text-amber-300 font-mono">৳{totalRevenue.toLocaleString()}</p>
                      <p className="text-[9px] text-amber-400 font-bold mt-0.5 truncate">● পেইড ফি</p>
                    </div>
                  </div>

                  {/* Card 3: Total Active Courses */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/30 transition shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-slate-400 truncate">চালুকৃত কোর্স</span>
                      <div className="p-1 bg-sky-500/10 rounded-lg text-sky-400">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-base sm:text-lg font-black text-sky-300 font-mono">{totalCoursesCount} <span className="text-[10px] font-normal text-slate-400">টি</span></p>
                      <p className="text-[9px] text-sky-400 font-bold mt-0.5 truncate">● লাইভ কোর্স</p>
                    </div>
                  </div>

                  {/* Card 4: Total Course Enrollments */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/30 transition shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-slate-400 truncate">এনরোলমেন্ট</span>
                      <div className="p-1 bg-purple-500/10 rounded-lg text-purple-400">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-base sm:text-lg font-black text-purple-300 font-mono">{totalEnrollmentsCount} <span className="text-[10px] font-normal text-slate-400">জন</span></p>
                      <p className="text-[9px] text-purple-400 font-bold mt-0.5 truncate">● নিবন্ধিত ছাত্র</p>
                    </div>
                  </div>

                  {/* Card 5: Service Orders */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/30 transition shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-slate-400 truncate">সার্ভিস অর্ডার</span>
                      <div className="p-1 bg-indigo-500/10 rounded-lg text-indigo-400">
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-base sm:text-lg font-black text-indigo-300 font-mono">{services.length} <span className="text-[10px] font-normal text-slate-400">টি</span></p>
                      <p className="text-[9px] text-indigo-400 font-bold mt-0.5 truncate">● এজেন্সি প্রজেক্ট</p>
                    </div>
                  </div>

                  {/* Card 6: Pending Teacher Payouts */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/30 transition shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-bold text-slate-400 truncate">পেন্ডিং পে-আউট</span>
                      <div className="p-1 bg-rose-500/10 rounded-lg text-rose-400">
                        <CreditCard className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5">
                      <p className="text-base sm:text-lg font-black text-rose-300 font-mono">{payouts.filter(p => p.status === 'Pending').length} <span className="text-[10px] font-normal text-slate-400">টি</span></p>
                      <p className="text-[9px] text-rose-400 font-bold mt-0.5 truncate">● উইথড্র রিকোয়েস্ট</p>
                    </div>
                  </div>
                </div>

                {/* Quick Orders Overview Table */}
                <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 space-y-2.5 shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 border-b border-slate-800 pb-2.5">
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#1DB954]" /> সাম্প্রতিক পেমেন্ট অর্ডার ও ট্রানজেকশন
                      </h3>
                      <p className="text-[10px] text-slate-400">সর্বশেষ স্টুডেন্ট কোর্স পেমেন্ট অডিট</p>
                    </div>
                    <button
                      onClick={() => setActiveAdminTab('billing_verify')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[#1DB954] hover:text-white text-[11px] font-bold rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      সব দেখুন ({orders.length}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto w-full -mx-1 px-1 sm:mx-0 sm:px-0">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                      <thead className="bg-slate-950 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-2">ID</th>
                          <th className="p-2">স্টুডেন্ট</th>
                          <th className="p-2">কোর্স</th>
                          <th className="p-2">পরিমাণ</th>
                          <th className="p-2">মেথড / TrxID</th>
                          <th className="p-2">স্ট্যাটাস</th>
                          <th className="p-2 text-right">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-slate-500 italic text-xs">কোনো সাম্প্রতিক পেমেন্ট অর্ডার নেই।</td>
                          </tr>
                        ) : (
                          orders.slice(0, 5).map(ord => (
                            <tr key={ord.id} className="hover:bg-slate-800/50">
                              <td className="p-2 font-mono font-bold text-white text-[11px]">{ord.id}</td>
                              <td className="p-2">
                                <span className="font-bold text-white block text-[11px]">{ord.userName}</span>
                                <span className="text-[9px] text-slate-400">{ord.userMobile}</span>
                              </td>
                              <td className="p-2 text-slate-200 text-[11px] truncate max-w-[140px]">{ord.courseTitle}</td>
                              <td className="p-2 font-black text-emerald-400 font-mono text-xs">৳{ord.amount}</td>
                              <td className="p-2 font-mono text-[10px] text-slate-300">
                                <span className="px-1.5 py-0.2 bg-slate-800 rounded text-[9px] font-bold border border-slate-700 mr-1 text-slate-300">{ord.paymentMethod}</span>
                                {ord.transactionId}
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  ord.status === 'Approved'
                                    ? 'bg-emerald-500/20 text-[#1DB954] border border-emerald-500/30'
                                    : ord.status === 'Rejected'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                }`}>
                                  {ord.status === 'Approved' ? '✓ অনুমোদিত' : ord.status === 'Rejected' ? '✕ বাতিল' : '● পেন্ডিং'}
                                </span>
                              </td>
                              <td className="p-2 text-right">
                                {ord.status === 'Pending' ? (
                                  <button
                                    onClick={() => updateOrderStatus(ord.id, 'Approved')}
                                    className="px-2 py-0.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-[10px] rounded shadow cursor-pointer"
                                  >
                                    অনুমোদন
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-slate-500">সম্পন্ন</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Action Navigation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div
                    onClick={() => {
                      setActiveMainModule('academy');
                      setActiveAdminTab('teachers');
                    }}
                    className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-[#1DB954] transition cursor-pointer space-y-1 shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-[#1DB954] group-hover:bg-[#1DB954] group-hover:text-white transition">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">টিচার ও ইনস্ট্রাক্টর প্যানেল</h4>
                        <p className="text-[10px] text-slate-400">সম্মানিয়াম ও নোটিশ</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveMainModule('academy');
                      setActiveAdminTab('courses');
                    }}
                    className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-sky-500 transition cursor-pointer space-y-1 shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">কোর্স ম্যানেজার</h4>
                        <p className="text-[10px] text-slate-400">কোর্স এড ও ফি আপডেট</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveMainModule('academy');
                      setActiveAdminTab('students');
                    }}
                    className="bg-slate-900 border border-slate-800 p-3 rounded-xl hover:border-purple-500 transition cursor-pointer space-y-1 shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">স্টুডেন্ট ডাটাবেজ</h4>
                        <p className="text-[10px] text-slate-400">শিক্ষার্থী ও সার্টিফিকেট</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* TAB: TEACHERS & EXPERTS MANAGEMENT */}
        {activeAdminTab === 'teachers' && (
          <div className="space-y-4 font-bengali">
            {/* Header & Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#1DB954]" /> টিচার ও মেন্টর
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  শিক্ষক তালিকা ও ক্লাস হিসাব।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setTeacherModalOpen(true)}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন টিচার</span>
                </button>
              </div>
            </div>

            {/* Sub Nav Tabs */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setTeacherSubTab('list')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  teacherSubTab === 'list' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>টিচার তালিকা ({users.filter(u => u.role === 'teacher' || u.role === 'instructor' || u.role === 'admin').length})</span>
              </button>

              <button
                onClick={() => setTeacherSubTab('payouts')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  teacherSubTab === 'payouts' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>বিল রিকুয়েস্ট</span>
                {payouts.filter(p => p.status === 'Pending').length > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-extrabold rounded-full animate-pulse">
                    {payouts.filter(p => p.status === 'Pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTeacherSubTab('notices')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  teacherSubTab === 'notices' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>নোটিশ & মেসেজ</span>
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
          <div className="space-y-4 font-bengali">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1DB954]" /> কোর্স ({courses.length})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  কোর্স তালিকা ও পরিচালনা।
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
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন কোর্স</span>
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
                { id: 'all', label: 'সকল', count: courses.length },
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
          <div className="space-y-4 font-bengali">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#1DB954]" /> স্টুডেন্ট ও ইউজার ({users.length})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  শিক্ষার্থী ও ইউজার তালিকা।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-300 font-bold bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
                  ইউজার: <strong className="text-emerald-400 font-mono">{users.length}</strong> জন
                </span>
              </div>
            </div>

            {/* SPECIALIST APPLICATIONS REVIEW HUB */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1DB954]" />
                    <span>স্পেশালিস্ট ও মেন্টরশিপ নতুন আবেদনপত্র</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending').length} টি অপেক্ষমান
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    আবেদনকারীদের স্কিল, অভিজ্ঞতা ও পোর্টফোলিও বিস্তারিত পর্যালোচনা করে অনুমোদন বা বাতিল করুন।
                  </p>
                </div>
              </div>

              {/* Applicant Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication || u.role === 'instructor' || u.isSpecialist).length === 0 ? (
                  <div className="col-span-full py-8 text-center bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 text-slate-400 text-xs">
                    বর্তমানে কোনো নতুন অপেক্ষমান আবেদন নেই।
                  </div>
                ) : (
                  users.filter(u => u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication || u.role === 'instructor' || u.isSpecialist).map(u => {
                    const isPending = u.mentorStatus === 'pending' || u.specialistStatus === 'pending' || u.mentorApplication?.status === 'pending';
                    const isApproved = u.role === 'instructor' || u.mentorStatus === 'approved' || u.specialistStatus === 'approved';

                    return (
                      <div key={u.id} className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isPending
                          ? 'bg-amber-950/20 border-amber-500/50 text-slate-200'
                          : isApproved
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300'
                      }`}>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954]"
                            />
                            <div>
                              <h4 className="font-extrabold text-sm text-white">{u.name}</h4>
                              <p className="text-xs text-slate-400 font-mono">{u.email} • {u.mobile}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                            isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}>
                            {isPending ? 'অপেক্ষমান (Pending)' : isApproved ? 'অনুমোদিত (Specialist)' : 'বাতিল (Rejected)'}
                          </span>
                        </div>

                        {u.mentorApplication && (
                          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                            <p className="font-bold text-emerald-400">
                              বিশেষজ্ঞতা: <span className="text-white">{u.mentorApplication.expertise?.join(', ') || 'Web Development, Design'}</span>
                            </p>
                            <p className="text-slate-300">
                              অভিজ্ঞতা: <span className="font-bold text-white">{u.mentorApplication.experienceYears || '3'} বছর</span>
                            </p>
                            {u.mentorApplication.portfolioUrl && (
                              <p className="text-slate-400 truncate">
                                পোর্টফোলিও: <a href={u.mentorApplication.portfolioUrl} target="_blank" rel="noreferrer" className="text-[#1DB954] underline">{u.mentorApplication.portfolioUrl}</a>
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                          {isPending && (
                            <>
                              <button
                                onClick={() => {
                                  approveMentorApplication(u.id);
                                  alert(`${u.name}-কে সফলভাবে স্পেশালিস্ট ও মেন্টর হিসেবে গ্রহণ ও অনুমোদন দেওয়া হয়েছে!`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer transition flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>গ্রহণ ও অনুমোদন</span>
                              </button>
                              <button
                                onClick={() => {
                                  rejectMentorApplication(u.id, "তথ্য অসম্পূর্ণ থাকার কারণে বাতিল করা হলো।");
                                  alert(`${u.name}-এর আবেদন বাতিল করা হয়েছে।`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow cursor-pointer transition flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>বাতিল করুন</span>
                              </button>
                            </>
                          )}
                          {isApproved && (
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> একটিভ স্পেশালিস্ট প্রোফাইল
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
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
          <div className="space-y-4 font-bengali">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#1DB954]" /> সার্ভিসেস ({services.length})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  আইটি সার্ভিস ও ক্লায়েন্ট প্যাকেজ।
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
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন সার্ভিস</span>
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

        {/* TAB: GIGS MANAGEMENT & ADMIN UPLOAD */}
        {activeAdminTab === 'gigs_manage' && (
          <div className="space-y-4 font-bengali">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#1DB954]" /> গিগ ম্যানেজমেন্ট ({gigs.length})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  গিগ পাবলিশ ও প্যাকেজ নিয়ন্ত্রণ।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={openCreateGigModal}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন গিগ</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Switcher */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setGigManageSubTab('gigs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  gigManageSubTab === 'gigs'
                    ? 'bg-[#1DB954] text-white shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>সকল গিগ ({gigs.length})</span>
              </button>

              <button
                onClick={() => setGigManageSubTab('orders')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  gigManageSubTab === 'orders'
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>প্রাপ্ত গিগ অর্ডারস & মেইন এডমিন রেফারেল ({marketplaceOrders.length})</span>
              </button>
            </div>

            {/* SUB-VIEW 1: PUBLISHED GIGS LIST */}
            {gigManageSubTab === 'gigs' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gigs.map(g => (
                    <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl relative group">
                      <div>
                        <div className="relative h-48 overflow-hidden bg-slate-950">
                          <img src={g.thumbnail} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-[#1DB954] rounded-full border border-emerald-500/30">
                            {g.category}
                          </div>
                          <div className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full shadow">
                            {g.priceText || (g.packages?.basic ? `৳${g.packages.basic.price.toLocaleString('bn-BD')}` : `৳${g.price?.toLocaleString('bn-BD')}`)}
                          </div>
                          {g.offerBadge && g.offerBadge !== 'regular' && (
                            <div className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-rose-500/90 backdrop-blur-sm text-white text-[9px] font-bold rounded-full">
                              {g.offerBadge === 'cashback' ? '💰 ১০% ক্যাশব্যাক' : g.offerBadge === 'work_first' ? '🤝 পে আফটার ওয়ার্ক' : g.offerBadge}
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={g.sellerAvatar} alt={g.sellerName} className="w-6 h-6 rounded-full object-cover border border-slate-700" />
                              <span className="text-xs font-bold text-slate-300">{g.sellerName}</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-semibold">
                              {g.sellerLevel || 'Top Rated'}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-white text-base leading-snug line-clamp-2">{g.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{g.description}</p>

                          {/* 3-Tier Packages Indicator */}
                          {g.packages && (
                            <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-3 gap-1 text-center text-[10px]">
                              <div className="p-1 rounded bg-slate-900">
                                <span className="text-slate-400 block text-[9px]">Basic</span>
                                <span className="font-bold text-[#1DB954]">৳{g.packages.basic?.price}</span>
                              </div>
                              <div className="p-1 rounded bg-slate-900 border border-amber-500/30">
                                <span className="text-amber-400 block text-[9px]">Standard</span>
                                <span className="font-bold text-amber-300">৳{g.packages.standard?.price}</span>
                              </div>
                              <div className="p-1 rounded bg-slate-900">
                                <span className="text-purple-400 block text-[9px]">Premium</span>
                                <span className="font-bold text-purple-300">৳{g.packages.premium?.price}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                            <span className="font-semibold text-emerald-400">⏱️ {g.deliveryTime || (g.packages?.basic ? `${g.packages.basic.deliveryDays} দিন` : '৩ দিন')}</span>
                            <span className="text-slate-400">⭐ {g.rating || 5.0} ({g.salesCount || 0} সেলস)</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex gap-2">
                        <button
                          onClick={() => openEditGigModal(g)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-400" /> এডিট ও প্যাকেজ কাস্টমাইজ
                        </button>
                        <button
                          onClick={() => deleteGig(g.id)}
                          className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl cursor-pointer transition-all"
                          title="গিগ রিমুভ করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: RECEIVED GIG ORDERS & MAIN ADMIN REFERRAL HUB */}
            {gigManageSubTab === 'orders' && (
              <div className="space-y-3">
                <div className="p-3 sm:p-4 bg-slate-900 border border-amber-500/30 rounded-xl flex items-center justify-between gap-2 shadow">
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> গিগ অর্ডার ও রেফারেল
                    </h3>
                    <p className="text-[11px] text-slate-400 hidden sm:block">
                      ক্লায়েন্ট অর্ডার রিসিভ ও ফ্রিল্যান্সারদের কাছে রেফার করুন।
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/30 shrink-0">
                    অর্ডার: {marketplaceOrders.length}
                  </span>
                </div>

                {marketplaceOrders.length === 0 ? (
                  <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                    <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-black text-white">এখনো কোনো গিগ অর্ডার আসেনি</h4>
                    <p className="text-xs text-slate-400">মার্কেটপ্লেস থেকে ক্লায়েন্ট অর্ডার প্লেস করলে এখানে তালিকা দেখা যাবে।</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {marketplaceOrders.map(order => (
                      <div
                        key={order.id}
                        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Order Header */}
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] text-slate-500 font-mono">#{order.id.slice(0, 10)}</span>
                              <h4 className="text-sm font-extrabold text-white leading-tight mt-0.5">
                                {order.gigTitle}
                              </h4>
                            </div>
                            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-xl whitespace-nowrap ${
                              order.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : order.status === 'delivered'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : order.status === 'in_progress'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {order.status === 'pending' && '⏳ অপেক্ষারত'}
                              {order.status === 'in_progress' && '⚡ কাজ চলছে'}
                              {order.status === 'delivered' && '📦 ফাইল ডেলিভার্ড'}
                              {order.status === 'completed' && '✅ সফলভাবে সম্পন্ন'}
                              {order.status === 'cancelled' && '❌ বাতিল'}
                            </span>
                          </div>

                          {/* Client & Price Info Grid */}
                          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400 block text-[10px]">ক্লায়েন্ট নাম:</span>
                              <span className="font-bold text-white">{order.clientName || 'ক্লায়েন্ট'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">ফোন নম্বর:</span>
                              <span className="font-bold text-emerald-400">{order.clientPhone || 'তথ্য সংরক্ষিত'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">অর্ডার প্যাকেজ:</span>
                              <span className="font-bold text-amber-400">{order.selectedPackageName || 'বেসিক প্যাকেজ'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">মোট পেমেন্ট:</span>
                              <span className="font-black text-[#1DB954] text-sm">৳{order.amount?.toLocaleString('bn-BD')}</span>
                            </div>
                          </div>

                          {/* Referral & Delegation Status Banner */}
                          <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-300">অ্যাসাইন / রেফার স্ট্যাটাস:</span>
                              {order.statusNote && order.statusNote.includes('রেফার') ? (
                                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded-md">
                                  📢 রেফারেল সম্পন্ন
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-[#1DB954] font-bold rounded-md">
                                  🏢 পিটেন আইটি হেড অফিস
                                </span>
                              )}
                            </div>
                            {order.statusNote && (
                              <p className="text-[11px] text-amber-300 font-medium leading-tight">
                                📌 {order.statusNote}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Order Controls & Main Admin Referral Trigger */}
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <button
                            onClick={() => {
                              setAdminReferralModalOrder(order);
                              setAdminReferralAssignee('ইঞ্জি. তানভীর আহমেদ');
                              setAdminReferralCommission(20);
                              setAdminReferralNote('');
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>📢 ফ্রিল্যান্সার / স্টাফকে রেফার করুন (মেইন এডমিন)</span>
                          </button>

                          <div className="flex gap-2">
                            {order.status !== 'in_progress' && order.status !== 'completed' && (
                              <button
                                onClick={() => updateMarketplaceOrderStatus(order.id, 'in_progress', 'কাজ চলমান রয়েছে')}
                                className="flex-1 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-bold text-xs rounded-xl cursor-pointer"
                              >
                                ▶️ কাজ শুরু
                              </button>
                            )}
                            {order.status !== 'delivered' && order.status !== 'completed' && (
                              <button
                                onClick={() => updateMarketplaceOrderStatus(order.id, 'delivered', 'প্রজেক্ট ফাইল ডেলিভারি দেওয়া হয়েছে')}
                                className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-bold text-xs rounded-xl cursor-pointer"
                              >
                                🚀 ডেলিভারি
                              </button>
                            )}
                            {order.status !== 'completed' && (
                              <button
                                onClick={() => updateMarketplaceOrderStatus(order.id, 'completed', 'প্রজেক্ট সফলভাবে সমাপ্ত হয়েছে')}
                                className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-[#1DB954] font-bold text-xs rounded-xl cursor-pointer"
                              >
                                ✅ সম্পন্ন
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: OFFICE PROJECTS & CLIENT ORDERS */}
        {activeAdminTab === 'office_projects' && (
          <div className="space-y-6 font-bengali">
            {/* Action Banner */}
            {officeActionMsg && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-between text-sm font-bold animate-fadeIn">
                <span>{officeActionMsg}</span>
                <button onClick={() => setOfficeActionMsg('')} className="text-xs bg-emerald-500/20 px-2 py-1 rounded-lg hover:bg-emerald-500/30">বন্ধ করুন</button>
              </div>
            )}

            {/* SPECIALIST NAVIGATION HEADER BANNER */}
            <div className="bg-slate-900 border border-amber-500/30 p-3.5 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 relative z-10">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-md border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> স্পেশালিস্ট হাব
                    </span>
                  </div>
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-1.5">
                    <Briefcase className="w-5 h-5 text-amber-400" /> অফিস সেলার ও প্রজেক্ট
                  </h2>
                  <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                    সার্ভিস অর্ডার, আর্নিং হিস্টোরি ও ফ্রিল্যান্সার রেফারেল।
                  </p>
                </div>

                {/* Quick Earnings / Referral Summary */}
                <div className="flex items-center gap-2 bg-slate-950 p-2 sm:p-2.5 rounded-xl border border-slate-800 shrink-0">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">মোট আর্নিং</span>
                    <span className="text-sm font-black text-emerald-400">৳৩,৪৫,০০০</span>
                  </div>
                </div>
              </div>
            </div>

            {/* THE 4 SPECIALIST NAVIGATION CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. সেলার সার্ভিস (Seller Services) Card */}
              <div className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 bg-slate-900 ${
                officeSellerSubTab === 'orders' || officeSellerSubTab === 'services'
                  ? 'border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded-full">
                    ১. সেলার সার্ভিস
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">সেলার সার্ভিস</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">ক্লায়েন্ট প্রজেক্ট অর্ডারস & এজেন্সি সার্ভিসেস</p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => setOfficeSellerSubTab('orders')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'orders' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><ShoppingBag className="w-3.5 h-3.5" /> ক্লায়েন্ট অর্ডারস</span>
                    <span className="px-2 py-0.5 bg-slate-900/80 text-amber-400 font-mono text-[11px] rounded-full font-black border border-amber-500/30">
                      (32)
                    </span>
                  </button>

                  <button
                    onClick={() => setOfficeSellerSubTab('services')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'services' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> সার্ভিসেস</span>
                    <span className="px-2 py-0.5 bg-slate-900/80 text-emerald-400 font-mono text-[11px] rounded-full font-black border border-emerald-500/30">
                      (1)
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. মেন্টর সার্ভিস (Mentor Services) Card */}
              <div className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 bg-slate-900 ${
                ['courses', 'classroom', 'students'].includes(officeSellerSubTab)
                  ? 'border-sky-500/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/30">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-sky-500/20 text-sky-400 text-[10px] font-black rounded-full">
                    ২. মেন্টর সার্ভিস
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">মেন্টর সার্ভিস</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">কোর্স, লাইভ ক্লাসরুম & স্টুডেন্টস</p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => setOfficeSellerSubTab('courses')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'courses' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> কোর্স</span>
                    <span className="text-[11px] font-mono font-bold text-sky-400">({courses.length})</span>
                  </button>

                  <button
                    onClick={() => setOfficeSellerSubTab('classroom')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'classroom' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> ক্লাসরুম</span>
                    <span className="text-[11px] font-mono font-bold text-amber-400">(লাইভ)</span>
                  </button>

                  <button
                    onClick={() => setOfficeSellerSubTab('students')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'students' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> স্টুডেন্ট</span>
                    <span className="px-2 py-0.5 bg-slate-900/80 text-sky-400 font-mono text-[11px] rounded-full font-black border border-sky-500/30">
                      (3)
                    </span>
                  </button>
                </div>
              </div>

              {/* 3. একাউন্ট স্টেটমেন্ট (Account Statement) Card */}
              <div className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 bg-slate-900 ${
                officeSellerSubTab === 'financials'
                  ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full">
                    ৩. একাউন্ট স্টেটমেন্ট
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">একাউন্ট স্টেটমেন্ট</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">আর্নিং ও পেমেন্ট হিস্টোরি</p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => setOfficeSellerSubTab('financials')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'financials' ? 'bg-emerald-500 text-white font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> আর্নিং & পেমেন্ট হিস্টোরি</span>
                    <span className="text-[10px] text-emerald-400 font-bold">স্টেটমেন্ট</span>
                  </button>
                </div>
              </div>

              {/* 4. ফ্রি টুলস (Free Tools) Card */}
              <div className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 bg-slate-900 ${
                officeSellerSubTab === 'freetools'
                  ? 'border-purple-500/80 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/30">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-400 text-[10px] font-black rounded-full">
                    ৪. ফ্রি টুলস
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">ফ্রি টুলস</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">১০০% ফ্রি ফ্রিল্যান্সিং টুলস</p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => setOfficeSellerSubTab('freetools')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      officeSellerSubTab === 'freetools' ? 'bg-purple-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> ১০০% ফ্রি টুলস স্যুট</span>
                    <span className="text-[10px] text-purple-400 font-bold">ফ্রি অ্যাক্সেস</span>
                  </button>
                </div>
              </div>

            </div>

            {/* DYNAMIC CONTENT SECTION BASED ON officeSellerSubTab */}

            {/* SECTION 1: CLIENT ORDERS (32) */}
            {officeSellerSubTab === 'orders' && (
              <div className="space-y-4">
                {/* Filter & Search Bar */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  {/* Search */}
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="অর্ডার ID, বায়ারের নাম বা ইমেইল খুজুন..."
                      value={officeSearchQuery}
                      onChange={(e) => setOfficeSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Status Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
                    {[
                      { id: 'all', label: 'সকল' },
                      { id: 'pending', label: 'নতুন অর্ডার' },
                      { id: 'in_progress', label: 'কাজ চলছে' },
                      { id: 'in_review', label: 'ডেলিভারড' },
                      { id: 'completed', label: 'সম্পন্ন' },
                      { id: 'cancelled', label: 'বাতিল' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setOfficeStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          officeStatusFilter === st.id
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List */}
                {(() => {
                  const isAgencyOrder = (o: MarketplaceOrder) => 
                    o.sellerId === 'ptenit-agency' || 
                    o.isInternalStaff || 
                    o.type === 'custom_agency_order' ||
                    ['web-dev', 'digital-marketing', 'graphics-design', 'app-development', 'seo-optimization', 'video-editing', 'cyber-security', 'software-dev'].includes(o.gigId || '') ||
                    o.sellerId === 'teacher-1';

                  let list = marketplaceOrders.filter(isAgencyOrder);

                  if (officeSearchQuery) {
                    const q = officeSearchQuery.toLowerCase();
                    list = list.filter(o => 
                      o.id.toLowerCase().includes(q) ||
                      o.buyerName.toLowerCase().includes(q) ||
                      (o.buyerEmail && o.buyerEmail.toLowerCase().includes(q)) ||
                      o.title.toLowerCase().includes(q) ||
                      (o.transactionId && o.transactionId.toLowerCase().includes(q))
                    );
                  }

                  if (officeStatusFilter !== 'all') {
                    if (officeStatusFilter === 'pending') {
                      list = list.filter(o => o.status === 'pending' || o.status === 'pending_approval');
                    } else {
                      list = list.filter(o => o.status === officeStatusFilter);
                    }
                  }

                  if (list.length === 0) {
                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                        <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                        <h3 className="text-lg font-bold text-slate-300">কোনো ক্লায়েন্ট অর্ডার পাওয়া যায়নি</h3>
                        <p className="text-xs text-slate-500">গ্রাহকগণ আমাদের ওয়েবসাইট থেকে অফিস সার্ভিস বা প্যাকেজ অর্ডার করলে তা এখানে দেখতে পাবেন।</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 gap-4">
                      {list.map(ord => {
                        const statusBadgeClass = 
                          ord.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                          ord.status === 'in_progress' ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' :
                          ord.status === 'in_review' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          ord.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                          'bg-purple-500/20 text-purple-400 border-purple-500/40';

                        const statusLabel = 
                          ord.status === 'completed' ? 'সম্পন্ন (Completed)' :
                          ord.status === 'in_progress' ? 'কাজ চলছে (In Progress)' :
                          ord.status === 'in_review' ? 'ডেলিভারি জমা (In Review)' :
                          ord.status === 'cancelled' ? 'বাতিলকৃত' : 'নতুন অর্ডার (Pending)';

                        return (
                          <div key={ord.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg space-y-4 transition-all">
                            {/* Top Card Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800/80 pb-4">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                  #{ord.id}
                                </span>
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${statusBadgeClass}`}>
                                  {statusLabel}
                                </span>
                                {ord.packageType && (
                                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-black rounded-full">
                                    {ord.packageType} প্যাকেজ
                                  </span>
                                )}
                                <span className="text-xs text-slate-400 font-medium">
                                  তারিখ: {ord.createdAt}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">মূল্য:</span>
                                <span className="text-lg font-black text-emerald-400">৳{ord.amount?.toLocaleString('bn-BD')}</span>
                              </div>
                            </div>

                            {/* Outsourced Referral Banner if active */}
                            {ord.referralCommissionPercent && (
                              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs flex-wrap gap-2">
                                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4" /> অফার্ড ও আউটসোর্সড প্রজেক্ট (অফিস রেফারেল কমিশন: {ord.referralCommissionPercent}%)
                                </span>
                                <span className="text-emerald-400 font-black">
                                  ফ্রিহ্যান্ড ফ্রিল্যান্সার পাবে: ৳{Math.round(((ord.amount || 0) * (100 - ord.referralCommissionPercent)) / 100).toLocaleString('bn-BD')}
                                </span>
                              </div>
                            )}

                            {/* Order Body Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Service Details */}
                              <div className="md:col-span-2 space-y-2">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-amber-400" /> {ord.title}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                                  <span>ক্যাটাগরি: <strong className="text-slate-200">{ord.category || 'General Agency'}</strong></span>
                                  {ord.paymentMethod && <span>পেমেন্ট মাধ্যম: <strong className="text-amber-400">{ord.paymentMethod}</strong></span>}
                                  {ord.transactionId && <span>TrxID: <strong className="text-sky-400 font-mono">{ord.transactionId}</strong></span>}
                                </div>

                                {ord.deliveryNote && (
                                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
                                    <span className="font-bold text-amber-400">প্রজেক্ট ফাইল ডেলিভারি নোট:</span>
                                    <p className="text-slate-300">{ord.deliveryNote}</p>
                                    {ord.deliveryFileUrl && (
                                      <a href={ord.deliveryFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sky-400 underline font-bold mt-1">
                                        <ExternalLink className="w-3.5 h-3.5" /> ডেলিভারি ফাইল লিংক দেখুন
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Client & Assigned Staff Info */}
                              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                                <div>
                                  <span className="text-[11px] text-slate-400 font-bold block mb-1">গ্রাহকের তথ্য (Buyer Info):</span>
                                  <p className="text-xs font-bold text-white">{ord.buyerName}</p>
                                  {ord.buyerEmail && <p className="text-[11px] text-slate-400">{ord.buyerEmail}</p>}
                                  {ord.buyerPhone && <p className="text-[11px] text-sky-400 font-mono">{ord.buyerPhone}</p>}
                                </div>

                                <div className="border-t border-slate-800/80 pt-2">
                                  <span className="text-[11px] text-slate-400 font-bold block mb-1">দায়িত্বপ্রাপ্ত এক্সপার্ট / স্টাফ:</span>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-amber-400">
                                      {ord.assignedExpert || 'পিটেন আইটি হেড টিম'}
                                    </span>
                                    <button
                                      onClick={() => {
                                        setOfficeAssignModalOrder(ord);
                                        setOfficeAssignee(ord.assignedExpert || 'তানভীর আহমেদ');
                                      }}
                                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
                                    >
                                      পরিবর্তন
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Action Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Outsource & Commission Referral Offer Button */}
                                <button
                                  onClick={() => {
                                    setOutsourceModalOrder(ord);
                                    setOutsourceCommissionPercent(20);
                                    setOutsourceOfferNote('');
                                  }}
                                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                                >
                                  <Sparkles className="w-3.5 h-3.5" /> 📢 পাব্লিক / স্টাফদের অফার করুন (কমিশন সেটআপ)
                                </button>

                                {/* Start Work Button */}
                                {ord.status !== 'in_progress' && ord.status !== 'completed' && ord.status !== 'cancelled' && (
                                  <button
                                    onClick={() => {
                                      updateMarketplaceOrderStatus?.(ord.id, 'in_progress', 'পিটেন আইটি প্রজেক্ট টিম কর্তৃক কাজ শুরু করা হয়েছে।');
                                      setOfficeActionMsg(`অর্ডার #${ord.id} এর কাজ শুরু করা হয়েছে!`);
                                    }}
                                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-md shadow-sky-500/20 flex items-center gap-1"
                                  >
                                    ▶️ কাজ শুরু করুন
                                  </button>
                                )}

                                {/* Delivery Button */}
                                {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                                  <button
                                    onClick={() => {
                                      setOfficeDeliveryModalOrder(ord);
                                      setOfficeDeliveryUrl(ord.deliveryFileUrl || '');
                                      setOfficeDeliveryNote(ord.deliveryNote || '');
                                    }}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
                                  >
                                    🚀 প্রজেক্ট ফাইল ডেলিভারি
                                  </button>
                                )}

                                {/* Mark Completed Button */}
                                {ord.status !== 'completed' && ord.status !== 'cancelled' && (
                                  <button
                                    onClick={() => {
                                      updateMarketplaceOrderStatus?.(ord.id, 'completed', 'প্রজেক্ট সফলভাবে সম্পূর্ণ ও ক্লায়েন্টকে হ্যান্ডওভার করা হয়েছে।');
                                      setOfficeActionMsg(`অর্ডার #${ord.id} সম্পন্ন হয়েছে!`);
                                    }}
                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1"
                                  >
                                    ✅ সম্পন্ন মার্ক করুন
                                  </button>
                                )}
                              </div>

                              {/* Cancel Button */}
                              {ord.status !== 'cancelled' && ord.status !== 'completed' && (
                                <button
                                  onClick={() => {
                                    if (confirm(`আপনি কি নিশ্চিত যে অর্ডার #${ord.id} বাতিল করতে চান?`)) {
                                      updateMarketplaceOrderStatus?.(ord.id, 'cancelled', 'অফিস এডমিন কর্তৃক অর্ডারটি বাতিল করা হয়েছে।');
                                      setOfficeActionMsg(`অর্ডার #${ord.id} বাতিল করা হয়েছে।`);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold rounded-xl cursor-pointer border border-rose-500/30"
                                >
                                  ❌ বাতিল
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SECTION 2: OFFICIAL SERVICES (1) */}
            {officeSellerSubTab === 'services' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" /> অফিশিয়াল সেলার সার্ভিসেস তালিকা (১)
                  </h3>
                  <button
                    onClick={() => {
                      setEditingServiceId(null);
                      setServiceTitle('');
                      setServiceCategory('ওয়েব ডেভেলপমেন্ট');
                      setServicePrice('২৫০০০');
                      setServiceDesc('ফুলস্ট্যাক কাস্টম ওয়েবসাইট ও ব্যাকএন্ড সিস্টেম।');
                      setServiceModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> নতুন সার্ভিস যোগ করুন
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {services.map(srv => (
                    <div key={srv.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <img src={srv.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80'} alt={srv.title} className="w-full h-32 object-cover rounded-xl" />
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {srv.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{srv.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{srv.shortDescription}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                        <span className="text-xs text-slate-400">শুরু: <strong className="text-emerald-400 font-black">{srv.priceText}</strong></span>
                        <button
                          onClick={() => {
                            setEditingServiceId(srv.id);
                            setServiceTitle(srv.title);
                            setServiceCategory(srv.category);
                            setServicePrice(srv.priceText || '');
                            setServiceDesc(srv.shortDescription);
                            setServiceModalOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          এডিট
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: COURSES (MENTOR SERVICE) */}
            {officeSellerSubTab === 'courses' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-400" /> মেন্টরশিপ ও পরিচালিত কোর্সসমূহ ({courses.length})
                  </h3>
                  <button
                    onClick={() => {
                      setEditingCourseId(null);
                      setCourseTitle('');
                      setCoursePrice(5000);
                      setCourseCategory('ওয়েব ডেভেলপমেন্ট');
                      setCourseModalOpen(true);
                    }}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-sky-500/20 flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> কাস্টম কোর্স তৈরি করুন
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {courses.map(c => (
                    <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-32 object-cover rounded-xl" />
                      <div>
                        <span className="text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                          {c.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{c.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">মেন্টর: {c.instructorName}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                        <span className="text-xs text-emerald-400 font-bold">৳{c.price.toLocaleString('bn-BD')}</span>
                        <span className="text-xs text-slate-400">{c.studentsCount || 0} স্টুডেন্ট</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: CLASSROOM */}
            {officeSellerSubTab === 'classroom' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" /> লাইভ ক্লাসরুম & অ্যাসাইনমেন্ট মেন্টরিং
                  </h3>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
                    সক্রিয় ক্লাসরুম
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  মেন্টর হিসেবে আপনার পরিচালিত কোর্সগুলোর লাইভ ক্লাস শেডিউল, স্টুডেন্ট অ্যাসাইনমেন্ট জমা ও সার্টিফিকেট প্রদান পরিচালনা করুন।
                </p>

                <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-3">
                  <GraduationCap className="w-12 h-12 text-sky-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">লাইভ মেন্টরশিপ ক্লাসরুম চালু আছে</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    টিচার ড্যাশবোর্ডের সাথে সরাসরি সংযুক্ত। সকল স্টুডেন্টের অ্যাসাইনমেন্ট মূল্যায়ন করুন।
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 5: STUDENTS (3) */}
            {officeSellerSubTab === 'students' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" /> এনরোল্ড স্টুডেন্টস তালিকা (৩)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'মোঃ রাকিবুল হাসান', email: 'rakib@gmail.com', course: 'ফুলস্ট্যাক ওয়েব ডেভেলপমেন্ট', status: 'Active' },
                    { name: 'সাবরিনা সুলতানা', email: 'sabrina@yahoo.com', course: 'ডিজিটাল মার্কেটিং মাস্টারক্লাস', status: 'Active' },
                    { name: 'আরিফ মাহমুদ', email: 'arif@ptenit.com', course: 'UI/UX গ্রাফিক্স ডিজাইন', status: 'Active' }
                  ].map((std, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-500/20 text-sky-400 font-black rounded-full flex items-center justify-center text-sm border border-sky-500/30">
                          {std.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{std.name}</p>
                          <p className="text-[11px] text-slate-400">{std.email}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{std.course}</span>
                        <span className="text-emerald-400 font-bold">{std.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 6: ACCOUNT STATEMENT (EARNINGS & PAYMENT HISTORY) */}
            {officeSellerSubTab === 'financials' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-emerald-400" /> একাউন্ট স্টেটমেন্ট: আর্নিং ও পেমেন্ট হিস্টোরি
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">অফিস সেলার ও মেন্টর কমিশন লেজার এবং ক্লায়েন্ট পেমেন্ট সামারি</p>
                  </div>
                  <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-full border border-emerald-500/40">
                    আর্নিং স্টেটমেন্ট ভেরিফাইড
                  </span>
                </div>

                {/* Financial Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 font-bold block">মোট ক্লায়েন্ট সেলস ভ্যালু</span>
                    <span className="text-2xl font-black text-white mt-1 block">৳৩,৪৫,০০০</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 text-center">
                    <span className="text-xs text-amber-400 font-bold block">অফিস রেফারেল কমিশন আর্নড</span>
                    <span className="text-2xl font-black text-amber-400 mt-1 block">৳৬৯,০০০</span>
                    <span className="text-[10px] text-slate-400 block">(২০% শেয়ারের ওপর)</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 text-center">
                    <span className="text-xs text-emerald-400 font-bold block">ফ্রিল্যান্সার/স্টাফ পে-আউটস</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">৳২,৭৬,০০০</span>
                  </div>
                </div>

                {/* Recent Transactions List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-white">সাম্প্রতিক লেনদেনসমূহ (Transactions):</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'TXN-901', date: '2026-08-14', title: 'ই-কমার্স পোর্টাল প্রজেক্ট', total: 45000, officeComm: 9000, status: 'Completed' },
                      { id: 'TXN-882', date: '2026-08-10', title: 'ডিজিটাল মার্কেটিং অ্যাড ক্যাম্পেইন', total: 25000, officeComm: 5000, status: 'Completed' },
                      { id: 'TXN-854', date: '2026-08-05', title: 'মোবাইল ই-কমার্স অ্যাপ সার্ভিস', total: 60000, officeComm: 12000, status: 'Completed' }
                    ].map(txn => (
                      <div key={txn.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-sky-400">{txn.id}</span>
                            <span className="text-xs font-bold text-white">{txn.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">তারিখ: {txn.date}</p>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span>মোট: <strong className="text-white">৳{txn.total.toLocaleString('bn-BD')}</strong></span>
                          <span>অফিস রেফারেল কমিশন: <strong className="text-amber-400">৳{txn.officeComm.toLocaleString('bn-BD')}</strong></span>
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg border border-emerald-500/30">{txn.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 7: FREE TOOLS (100% FREE FREELANCING TOOLS) */}
            {officeSellerSubTab === 'freetools' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Zap className="w-6 h-6 text-purple-400" /> ১০০% ফ্রি ফ্রিল্যান্সিং টুলস স্যুট
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">ক্লায়েন্ট ইনভয়েস জেনারেটর, প্রপোজাল রাইটার & কমিশন ক্যালকুলেটর</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-black rounded-full border border-purple-500/30">
                    ১০০% ফ্রি অ্যাক্সেস
                  </span>
                </div>

                {/* Sub-tool selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'invoice', label: '📄 ইনভয়েস জেনারেটর' },
                    { id: 'proposal', label: '✉️ স্মার্ট প্রপোজাল রাইটার' },
                    { id: 'calculator', label: '🧮 রেট & কমিশন ক্যালকুলেটর' },
                    { id: 'outreach', label: '📱 ক্লায়েন্ট আউটরিচ পিচ' }
                  ].map(tl => (
                    <button
                      key={tl.id}
                      onClick={() => setFreeToolActive(tl.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        freeToolActive === tl.id
                          ? 'bg-purple-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {tl.label}
                    </button>
                  ))}
                </div>

                {/* Tool 1: Invoice Generator */}
                {freeToolActive === 'invoice' && (
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-xl">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" /> ক্লায়েন্ট ইনভয়েস মেকার
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">ক্লায়েন্টের নাম / প্রতিষ্ঠান:</label>
                        <input
                          type="text"
                          value={invClientName}
                          onChange={(e) => setInvClientName(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">সার্ভিস / প্রজেক্টের শিরোনাম:</label>
                        <input
                          type="text"
                          value={invServiceTitle}
                          onChange={(e) => setInvServiceTitle(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">মোট মূল্য (টাকা):</label>
                        <input
                          type="number"
                          value={invAmount}
                          onChange={(e) => setInvAmount(Number(e.target.value))}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setInvSuccessMsg('ইনভয়েস প্রস্তুত করা হয়েছে! বিকাশ / নগদ পেমেন্ট রেফারেন্স সহ ডাউনলোডের জন্য প্রস্তুত।');
                        }}
                        className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-purple-500/20"
                      >
                        ⚡ ডিজিটাল ইনভয়েস তৈরি করুন
                      </button>

                      {invSuccessMsg && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-bold">
                          {invSuccessMsg}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tool 2: Proposal Writer */}
                {freeToolActive === 'proposal' && (
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-xl">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" /> স্মার্ট ফ্রিল্যান্সার প্রপোজাল রাইটার
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">বায়ার / ক্লায়েন্ট নেম:</label>
                        <input
                          type="text"
                          value={propClientName}
                          onChange={(e) => setPropClientName(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">প্রজেক্ট টাইটেল:</label>
                        <input
                          type="text"
                          value={propProjectTitle}
                          onChange={(e) => setPropProjectTitle(e.target.value)}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setPropGeneratedText(
                            `Hello ${propClientName},\n\nI read your requirements for "${propProjectTitle}" and I am confident that I can deliver outstanding results. With years of expertise and proven track record at Pten IT Official Agency, I ensure top quality, 100% responsive design, and timely delivery.\n\nLet's discuss how we can execute this seamlessly!\nBest regards,\nPten IT Official Freelancer`
                          );
                        }}
                        className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-purple-500/20"
                      >
                        ✨ প্রপোজাল জেনারেট করুন
                      </button>

                      {propGeneratedText && (
                        <div className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl space-y-2">
                          <span className="text-amber-400 font-bold block">কপিযোগ্য প্রপোজাল টেমপ্লেট:</span>
                          <pre className="text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">{propGeneratedText}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tool 3: Rate & Commission Calculator */}
                {freeToolActive === 'calculator' && (
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-xl">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-400" /> আওয়ারলি রেট & রেফারেল কমিশন ক্যালকুলেটর
                    </h4>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">ঘন্টাপ্রতি রেট (৳):</label>
                          <input
                            type="number"
                            value={calcHourlyRate}
                            onChange={(e) => setCalcHourlyRate(Number(e.target.value))}
                            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">মোট ঘন্টা:</label>
                          <input
                            type="number"
                            value={calcHours}
                            onChange={(e) => setCalcHours(Number(e.target.value))}
                            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">অফিস রেফারেল কমিশন (%):</label>
                        <input
                          type="number"
                          value={calcCommissionPercent}
                          onChange={(e) => setCalcCommissionPercent(Number(e.target.value))}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold"
                        />
                      </div>

                      <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">মোট সার্ভিস বাজেট:</span>
                          <span className="text-white font-bold">৳{(calcHourlyRate * calcHours).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-amber-400 font-bold">অফিস রেফারেল কমিশন ({calcCommissionPercent}%):</span>
                          <span className="text-amber-400 font-bold">৳{Math.round(((calcHourlyRate * calcHours) * calcCommissionPercent) / 100).toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="flex justify-between text-xs border-t border-slate-800 pt-2">
                          <span className="text-emerald-400 font-black">ফ্রিল্যান্সার নেট পে-আউট:</span>
                          <span className="text-emerald-400 font-black">৳{Math.round(((calcHourlyRate * calcHours) * (100 - calcCommissionPercent)) / 100).toLocaleString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tool 4: Outreach Pitcher */}
                {freeToolActive === 'outreach' && (
                  <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 max-w-xl">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" /> ক্লায়েন্ট কোল্ড আউটরিচ টেমপ্লেট
                    </h4>
                    <p className="text-xs text-slate-300">
                      ফেসবুক, লিঙ্কডইন বা হোয়াটসঅ্যাপে নতুন ক্লায়েন্টকে অফিশিয়াল প্রজেক্ট মেসেজ পাঠানোর স্ক্রিপ্ট:
                    </p>
                    <div className="p-3 bg-slate-900 border border-slate-800 text-xs rounded-xl text-slate-200 leading-relaxed font-sans">
                      "আসসালামু আলাইকুম! আপনার ব্যবসার বিক্রয় ও অনলাইন দৃশ্যমানতা বৃদ্ধিতে আমরা পিটেন আইটি অফিশিয়াল এজেন্সির পক্ষ থেকে ১০০% গ্যারান্টিযুক্ত ওয়েব ডেভেলপমেন্ট ও ডিজিটাল মার্কেটিং সার্ভিস প্রদান করছি। বিস্তারিত জানতে এবং ফ্রী কনসালটেশন পেতে আমাদের ইনবক্স করুন!"
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Outsource Order & Commission Setup Modal */}
            {outsourceModalOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp font-bengali">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" /> প্রজেক্ট আউটসোর্স & কমিশন সেটআপ
                    </h3>
                    <button onClick={() => setOutsourceModalOrder(null)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
                  </div>

                  <p className="text-xs text-slate-300">
                    অর্ডার <strong>#{outsourceModalOrder.id}</strong> ({outsourceModalOrder.title}) এর কাজ পাব্লিক ফ্রীল্যান্সার বা অফিস স্টাফকে অফার করুন এবং নির্দিষ্ট পার্সেন্টেজ রেফারেল কমিশন নির্ধারণ করুন।
                  </p>

                  {/* Target Type */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">কাজের অফার প্রাপক (Target Freelancer):</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOutsourceTargetType('public')}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center gap-2 cursor-pointer ${
                          outsourceTargetType === 'public'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Globe className="w-4 h-4 text-amber-400" />
                        <div>
                          <p className="text-white text-xs font-bold">🌐 পাব্লিক ফ্রীল্যান্সার মার্কেটপ্লেস</p>
                          <p className="text-[10px] text-slate-400">সকল ফ্রিল্যান্সাররা কাজ করতে পারবে</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOutsourceTargetType('staff')}
                        className={`p-3 rounded-2xl text-xs font-bold border transition-all text-left flex items-center gap-2 cursor-pointer ${
                          outsourceTargetType === 'staff'
                            ? 'bg-sky-500/20 border-sky-500 text-sky-400 font-black'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Users className="w-4 h-4 text-sky-400" />
                        <div>
                          <p className="text-white text-xs font-bold">👤 অফিস স্টাফ / এক্সপার্ট</p>
                          <p className="text-[10px] text-slate-400">নির্দিষ্ট অফিস স্টাফদের অসাইন করুন</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {outsourceTargetType === 'staff' && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">স্টাফ নির্বাচন করুন:</label>
                      <select
                        value={outsourceStaffName}
                        onChange={(e) => setOutsourceStaffName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {agencyStaff.map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.category})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Commission Percentage & Financial Calculation */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">অফিস রেফারেল কমিশন পার্সেন্টেজ (%):</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={outsourceCommissionPercent}
                          onChange={(e) => setOutsourceCommissionPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                          className="w-20 px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-400 font-bold text-center focus:outline-none focus:border-amber-500"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800">
                      <div className="bg-slate-900 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block font-bold">মোট বাজেট</span>
                        <span className="text-xs font-black text-white">৳{(outsourceModalOrder.amount || 0).toLocaleString('bn-BD')}</span>
                      </div>
                      <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                        <span className="text-[10px] text-amber-400 block font-bold">অফিস রেফারেল ({outsourceCommissionPercent}%)</span>
                        <span className="text-xs font-black text-amber-400">৳{Math.round(((outsourceModalOrder.amount || 0) * outsourceCommissionPercent) / 100).toLocaleString('bn-BD')}</span>
                      </div>
                      <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 block font-bold">ফ্রিহ্যান্ড পাবে ({100 - outsourceCommissionPercent}%)</span>
                        <span className="text-xs font-black text-emerald-400">৳{Math.round(((outsourceModalOrder.amount || 0) * (100 - outsourceCommissionPercent)) / 100).toLocaleString('bn-BD')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Offer Notes */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">অফার নোট ও প্রজেক্ট নির্দেশিকা:</label>
                    <textarea
                      rows={3}
                      placeholder="কাজটি নিবিড়ভাবে সম্পন্ন করতে হবে। নির্দিষ্ট সময়ে ফাইল ডেলিভারি বাধ্যতামূলক..."
                      value={outsourceOfferNote}
                      onChange={(e) => setOutsourceOfferNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setOutsourceModalOrder(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => {
                        const officeComm = Math.round(((outsourceModalOrder.amount || 0) * outsourceCommissionPercent) / 100);
                        const netPay = (outsourceModalOrder.amount || 0) - officeComm;
                        
                        updateMarketplaceOrderStatus?.(
                          outsourceModalOrder.id,
                          'in_progress',
                          `প্রজেক্ট আউটসোর্সড! অফিস রেফারেল কমিশন: ${outsourceCommissionPercent}% (৳${officeComm}). এক্সিকিউটর শেয়ার: ৳${netPay}.`
                        );

                        setOfficeActionMsg(`অর্ডার #${outsourceModalOrder.id} সফলভাবে আউটসোর্সড করা হয়েছে! (অফিস কমিশন: ${outsourceCommissionPercent}%)`);
                        setOutsourceModalOrder(null);
                      }}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      📢 অফার ব্রডকাস্ট করুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Modal */}
            {officeDeliveryModalOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scaleUp font-bengali">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Send className="w-5 h-5 text-amber-400" /> প্রজেক্ট ফাইল ও ডেলিভারি সাবমিশন
                    </h3>
                    <button onClick={() => setOfficeDeliveryModalOrder(null)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
                  </div>

                  <p className="text-xs text-slate-300">
                    অর্ডার <strong>#{officeDeliveryModalOrder.id}</strong> ({officeDeliveryModalOrder.title}) এর ফাইনাল ডেলিভারি লিংক ও ক্লায়েন্ট মেসেজ দিন:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">প্রজেক্ট / ডেলিভারি ড্রাইভ বা জিপ লিংক:</label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/d/..."
                        value={officeDeliveryUrl}
                        onChange={(e) => setOfficeDeliveryUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">ডেলিভারি নোট ও ক্লায়েন্ট ইনস্ট্রাকশন:</label>
                      <textarea
                        rows={4}
                        placeholder="আপনার প্রজেক্টের যাবতীয় সোর্স কোড ও ফাইল প্রস্তুত করে লিংক প্রদান করা হলো..."
                        value={officeDeliveryNote}
                        onChange={(e) => setOfficeDeliveryNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setOfficeDeliveryModalOrder(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => {
                        updateMarketplaceOrderStatus?.(
                          officeDeliveryModalOrder.id,
                          'in_review',
                          `প্রজেক্ট ফাইনাল ডেলিভারি সম্পন্ন! লিংক: ${officeDeliveryUrl || 'N/A'}. নোট: ${officeDeliveryNote || 'ধন্যবাদ!'}`
                        );
                        setOfficeActionMsg(`অর্ডার #${officeDeliveryModalOrder.id} এর প্রজেক্ট ডেলিভারি সম্পন্ন হয়েছে!`);
                        setOfficeDeliveryModalOrder(null);
                      }}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      ডেলিভারি সাবমিট করুন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Assign Staff Modal */}
            {officeAssignModalOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl font-bengali">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" /> স্টাফ ডেসপ্যাচ নিয়োগ
                    </h3>
                    <button onClick={() => setOfficeAssignModalOrder(null)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
                  </div>

                  <p className="text-xs text-slate-300">
                    অর্ডার <strong>#{officeAssignModalOrder.id}</strong> এর কাজের জন্য দায়িত্বপ্রাপ্ত এক্সপার্ট বা স্টাফ নির্বাচন করুন:
                  </p>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">অফিস স্টাফ / টিম লিড:</label>
                    <select
                      value={officeAssignee}
                      onChange={(e) => setOfficeAssignee(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {agencyStaff.map(s => (
                        <option key={s.id} value={s.name}>
                          {s.name} — {s.category} ({s.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setOfficeAssignModalOrder(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => {
                        updateMarketplaceOrderStatus?.(
                          officeAssignModalOrder.id,
                          officeAssignModalOrder.status,
                          `প্রজেক্টের মূল দায়িত্ব অর্পণ করা হয়েছে এক্সপার্ট: ${officeAssignee} এর উপর।`
                        );
                        setOfficeActionMsg(`অর্ডার #${officeAssignModalOrder.id} এর দায়িত্ব ${officeAssignee} কে দেওয়া হয়েছে।`);
                        setOfficeAssignModalOrder(null);
                      }}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      নিয়োগ নিশ্চিত করুন
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: DIGITAL PRODUCTS & SOFTWARE MANAGEMENT (Admin can Publish, Edit, Delete, Toggle Free, Manage Orders & Deliver Access via WhatsApp/Email/File) */}
        {activeAdminTab === 'digital_products' && (() => {
          const digitalOrders = marketplaceOrders.filter(o => 
            o.type === 'digital_product_order' || 
            Boolean(o.digitalProductId) ||
            digitalProducts.some(dp => dp.id === o.digitalProductId || dp.title === o.title)
          );
          const pendingDigitalOrders = digitalOrders.filter(o => !o.accessGranted && o.status !== 'completed');
          const grantedDigitalOrders = digitalOrders.filter(o => o.accessGranted || o.status === 'completed');

          const getCanvaInviteLinkForOrder = (order: MarketplaceOrder) => {
            if (order.canvaInviteLink) return order.canvaInviteLink;
            const matchedProd = digitalProducts.find(dp => dp.id === order.digitalProductId || dp.title === order.title);
            return matchedProd?.canvaInviteLink || 'https://www.canva.com/brand/join?token=vip-ptenit-lifetime';
          };

          const handleOpenWhatsAppModal = (order: MarketplaceOrder) => {
            const rawPhone = (order.buyerPhone || '').replace(/[^0-9]/g, '');
            const cleanPhone = rawPhone.length === 11 && rawPhone.startsWith('01') ? '88' + rawPhone : rawPhone;
            const downloadLink = order.customFileUrl || order.downloadUrl || order.deliveryFileUrl || 'https://drive.google.com';
            const license = order.licenseKey || 'N/A';
            const canvaLink = getCanvaInviteLinkForOrder(order);
            const token = order.downloadToken || `SEC-${order.id.slice(-6).toUpperCase()}`;

            let defaultMsg = '';
            if (order.deliveryType === 'canva_auto' || order.title.toLowerCase().includes('canva')) {
              defaultMsg = `আসসালামু আলাইকুম ${order.buyerName || 'সম্মানিত গ্রাহক'},
PTENit ডিজিটাল স্টোর থেকে আপনার Canva VIP Access কনফার্ম করা হয়েছে!

📦 প্রোডাক্ট: ${order.title}
💰 ইনভয়েস আইডি: #${order.id}
⚡ Canva VIP Invite Link: ${canvaLink}

📌 ক্যানভা ব্যবহারের নিয়মাবলী:
১. আপনার নিজস্ব ক্যানভা অ্যাকাউন্টে লগইন থাকা অবস্থায় উপরের লিংকে ক্লিক করে টিমে যুক্ত হোন।
২. এই ইনভাইট লিংকটি শুধুমাত্র আপনার জন্য বরাদ্দ। 

যেকোনো টেকনিক্যাল সাপোর্টে আমাদের সাথে এই হোয়াটসঅ্যাপেই কথা বলতে পারেন। ধন্যবাদ!
PTENit Digital Store`;
            } else if (order.deliveryType === 'file_download') {
              defaultMsg = `আসসালামু আলাইকুম ${order.buyerName || 'সম্মানিত গ্রাহক'},
PTENit ডিজিটাল স্টোর থেকে আপনার অর্ডারটি সফলভাবে ভেরিফাই করা হয়েছে!

📦 প্রোডাক্ট: ${order.title}
💰 ইনভয়েস আইডি: #${order.id}
🔐 সিকিউর অ্যাক্সেস টোকেন: ${token}
📥 সরাসরি ডাউনলোড লিঙ্ক: ${downloadLink}
${license !== 'N/A' ? `🔑 লাইসেন্স / এক্টিভেশন কি: ${license}\n` : ''}
ফাইলটি ডাউনলোড করে ব্যবহার শুরু করতে পারেন। যেকোনো প্রয়োজনে মেসেজ দিন।
PTENit Digital Store`;
            } else {
              defaultMsg = `আসসালামু আলাইকুম ${order.buyerName || 'সম্মানিত গ্রাহক'},
PTENit ডিজিটাল স্টোরে আপনার অর্ডারের অ্যাক্সেস প্রস্তুত করা হয়েছে!

📦 প্রোডাক্ট: ${order.title}
💰 ইনভয়েস আইডি: #${order.id}
📥 এক্সেস ও ডাউনলোড লিঙ্ক: ${downloadLink}
${license !== 'N/A' ? `🔑 লাইসেন্স / এক্টিভেশন কি: ${license}\n` : ''}
আপনার এক্সেস কার্যকর হয়েছে। যেকোনো সহায়তায় আমাদের জানান। ধন্যবাদ!
PTENit Digital Store`;
            }

            setDpWhatsAppModalOrder(order);
            setDpWhatsAppMessageText(defaultMsg);
          };

          const handleSendWhatsAppSubmit = () => {
            if (!dpWhatsAppModalOrder) return;
            const rawPhone = (dpWhatsAppModalOrder.buyerPhone || '').replace(/[^0-9]/g, '');
            const cleanPhone = rawPhone.length === 11 && rawPhone.startsWith('01') ? '88' + rawPhone : rawPhone;
            const waUrl = cleanPhone
              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(dpWhatsAppMessageText)}`
              : `https://wa.me/?text=${encodeURIComponent(dpWhatsAppMessageText)}`;

            window.open(waUrl, '_blank');

            updateMarketplaceOrder(dpWhatsAppModalOrder.id, {
              accessGranted: true,
              accessGrantedAt: new Date().toLocaleString('en-BD'),
              accessDeliveryMethod: 'whatsapp',
              deliveryStatus: 'delivered',
              status: 'completed',
              deliveryNote: `এডমিন কর্তৃক হোয়াটসঅ্যাপে কাস্টমাইজড মেসেজ ও এক্সেস লিংক পাঠানো হয়েছে (${new Date().toLocaleTimeString('en-BD')})`
            });

            setDpWhatsAppModalOrder(null);
          };

          const handleOpenEmailModal = (order: MarketplaceOrder) => {
            const downloadLink = order.customFileUrl || order.downloadUrl || order.deliveryFileUrl || 'https://drive.google.com';
            const license = order.licenseKey || 'N/A';
            const canvaLink = getCanvaInviteLinkForOrder(order);
            const token = order.downloadToken || `SEC-${order.id.slice(-6).toUpperCase()}`;

            let subject = `[PTENit Digital Store] আপনার ডিজিটাল প্রোডাক্ট এক্সেস - #${order.id}`;
            let body = '';

            if (order.deliveryType === 'canva_auto' || order.title.toLowerCase().includes('canva')) {
              subject = `[PTENit Digital] আপনার Canva VIP Access লিঙ্ক ও নিয়মাবলী - #${order.id}`;
              body = `প্রিয় ${order.buyerName || 'গ্রাহক'},

PTENit ডিজিটাল স্টোরে আপনার Canva Pro VIP Access অর্ডারটি সফল হয়েছে। আপনার ক্যানভা টিম এক্সেস লিঙ্ক নিচে দেওয়া হলো:

📦 প্রোডাক্ট: ${order.title}
🔖 ইনভয়েস আইডি: #${order.id}
⚡ Canva VIP Invite Link: ${canvaLink}

📌 এক্সেস নেওয়ার নিয়ম:
১. আপনার ক্যানভা অ্যাকাউন্টে লগইন থাকা অবস্থায় উপরের লিংকে ক্লিক করে আমাদের টিমে জয়েন করুন।
২. এটি আপনার নিজস্ব ব্যক্তিগত ব্যবহারের জন্য সংরক্ষিত।

যেকোনো প্রয়োজনে আমাদের সাপোর্ট টিমের সাথে হোয়াটসঅ্যাপে বা ইমেইলে যোগাযোগ করতে পারেন।

ধন্যবাদ,
PTENit ডিজিটাল টিম`;
            } else if (order.deliveryType === 'file_download') {
              subject = `[PTENit Digital] আপনার ডাউনলোড ফাইল ও সিকিউর টোকেন - #${order.id}`;
              body = `প্রিয় ${order.buyerName || 'গ্রাহক'},

PTENit ডিজিটাল স্টোরে আপনার পেমেন্ট ভেরিফাই করা হয়েছে এবং ডাউনলোড লিংক প্রস্তুত রয়েছে:

📦 প্রোডাক্ট: ${order.title}
🔖 ইনভয়েস আইডি: #${order.id}
🔐 সিকিউর টোকেন: ${token}
📥 সরাসরি ডাউনলোড লিঙ্ক: ${downloadLink}
${license !== 'N/A' ? `🔑 অ্যাক্টিভেশন কি: ${license}\n` : ''}

ধন্যবাদ,
PTENit ডিজিটাল টিম`;
            } else {
              subject = `[PTENit Digital Store] আপনার ডিজিটাল প্রোডাক্ট ডেলিভারি - #${order.id}`;
              body = `প্রিয় ${order.buyerName || 'গ্রাহক'},

PTENit ডিজিটাল স্টোরে আপনার অর্ডারের অ্যাক্সেস ফাইল ও বিস্তারিত তথ্য:

📦 প্রোডাক্ট: ${order.title}
🔖 ইনভয়েস আইডি: #${order.id}
📥 সোর্স কোড / ড্রাইভ লিঙ্ক: ${downloadLink}
${license !== 'N/A' ? `🔑 লাইসেন্স কি: ${license}\n` : ''}

যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।

ধন্যবাদ,
PTENit ডিজিটাল টিম`;
            }

            setDpEmailModalOrder(order);
            setDpEmailSubject(subject);
            setDpEmailBody(body);
          };

          const handleSendEmailSubmit = () => {
            if (!dpEmailModalOrder) return;
            const email = dpEmailModalOrder.buyerEmail || '';
            const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(dpEmailSubject)}&body=${encodeURIComponent(dpEmailBody)}`;
            window.open(mailtoUrl, '_blank');

            updateMarketplaceOrder(dpEmailModalOrder.id, {
              accessGranted: true,
              accessGrantedAt: new Date().toLocaleString('en-BD'),
              accessDeliveryMethod: 'email',
              deliveryStatus: 'delivered',
              status: 'completed',
              deliveryNote: `এডমিন কর্তৃক ইমেইলে কাস্টমাইজড এক্সেস তথ্য পাঠানো হয়েছে (${new Date().toLocaleTimeString('en-BD')})`
            });

            setDpEmailModalOrder(null);
          };

          const handleTogglePaymentStatus = (order: MarketplaceOrder) => {
            const willVerify = order.paymentStatus !== 'verified';
            updateMarketplaceOrder(order.id, {
              paymentStatus: willVerify ? 'verified' : 'pending',
              accessGranted: willVerify ? true : order.accessGranted,
              deliveryNote: willVerify ? `এডমিন কর্তৃক পেমেন্ট ভেরিফাই করা হয়েছে (${new Date().toLocaleTimeString('en-BD')})` : 'পেমেন্ট স্ট্যাটাস পেন্ডিং করা হয়েছে।'
            });
          };

          const handleResetCanvaLock = (order: MarketplaceOrder) => {
            updateMarketplaceOrder(order.id, {
              accessUsed: false,
              accessUsedAt: undefined,
              deliveryNote: `এডমিন কর্তৃক ক্যানভা এক্সেস লক রিসেট করা হয়েছে (${new Date().toLocaleTimeString('en-BD')})`
            });
          };

          const handleOpenAccessFileModal = (order: MarketplaceOrder) => {
            setDpAccessFileModalOrder(order);
            setDpCustomDownloadUrl(order.customFileUrl || order.downloadUrl || order.deliveryFileUrl || '');
            setDpCustomFileName(order.customFileName || order.deliveryFileName || `${order.title}.zip`);
            setDpCustomLicenseKey(order.licenseKey || '');
            setDpCustomAdminNote(order.deliveryNote || '');
          };

          const handleSaveOrderFileAndGrant = () => {
            if (!dpAccessFileModalOrder) return;
            updateMarketplaceOrder(dpAccessFileModalOrder.id, {
              customFileUrl: dpCustomDownloadUrl,
              downloadUrl: dpCustomDownloadUrl,
              deliveryFileUrl: dpCustomDownloadUrl,
              customFileName: dpCustomFileName,
              licenseKey: dpCustomLicenseKey,
              deliveryNote: dpCustomAdminNote || 'এডমিন ফাইল ও ডাউনলোড লিঙ্ক প্রদান করেছেন।',
              accessGranted: true,
              accessGrantedAt: new Date().toLocaleString('en-BD'),
              status: 'completed'
            });
            setDpAccessFileModalOrder(null);
          };

          const handleToggleOrderAccess = (order: MarketplaceOrder) => {
            const willGrant = !order.accessGranted;
            updateMarketplaceOrder(order.id, {
              accessGranted: willGrant,
              accessGrantedAt: willGrant ? new Date().toLocaleString('en-BD') : undefined,
              status: willGrant ? 'completed' : 'pending',
              deliveryNote: willGrant ? 'এডমিন সরাসরি ডাউনলোড এক্সেস মঞ্জুর করেছেন।' : 'এডমিন কর্তৃক এক্সেস সাময়িকভাবে প্রত্যাহার করা হয়েছে।'
            });
          };

          const filteredDigitalOrders = digitalOrders.filter(order => {
            const matchesFilter = dpOrderFilter === 'all' 
              ? true 
              : dpOrderFilter === 'pending' 
              ? (!order.accessGranted && order.status !== 'completed')
              : (order.accessGranted || order.status === 'completed');

            const matchesDelivery = dpDeliveryTypeFilter === 'all'
              ? true
              : order.deliveryType === dpDeliveryTypeFilter || 
                (dpDeliveryTypeFilter === 'canva_auto' && order.title.toLowerCase().includes('canva'));

            const matchesPayment = dpPaymentStatusFilter === 'all'
              ? true
              : dpPaymentStatusFilter === 'verified'
              ? (order.paymentStatus === 'verified' || order.amount === 0)
              : (order.paymentStatus !== 'verified' && order.amount !== 0);
            
            const q = dpOrderSearch.toLowerCase();
            const matchesSearch = !q ||
              order.id.toLowerCase().includes(q) ||
              (order.buyerName && order.buyerName.toLowerCase().includes(q)) ||
              (order.buyerEmail && order.buyerEmail.toLowerCase().includes(q)) ||
              (order.buyerPhone && order.buyerPhone.includes(q)) ||
              (order.title && order.title.toLowerCase().includes(q)) ||
              (order.transactionId && order.transactionId.toLowerCase().includes(q));

            return matchesFilter && matchesDelivery && matchesPayment && matchesSearch;
          });

          return (
          <div className="space-y-4 font-bengali">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#1DB954]" /> ডিজিটাল প্রোডাক্ট ও এক্সেস হাব ({digitalProducts.length})
                  </h2>
                  {pendingDigitalOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 animate-pulse">
                      {pendingDigitalOrders.length} টি এক্সেস বাকি!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  সফটওয়্যার, স্ক্রিপ্ট ও সোর্স কোড ক্যাটালগ এবং গ্রাহকদের হোয়াটসঅ্যাপ, ইমেইল বা ফাইলে এক্সেস কন্ট্রোল।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingDpId(null);
                    setDpTitle('');
                    setDpCategory('Scripts & PHP');
                    setDpPrice(450);
                    setDpOriginalPrice(1500);
                    setDpIsFree(false);
                    setDpThumbnail('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
                    setDpShortDesc('');
                    setDpFullDesc('');
                    setDpFileFormat('ZIP / Source Code');
                    setDpFileSize('24 MB');
                    setDpVersion('v1.0.0');
                    setDpDownloadUrl('https://drive.google.com');
                    setDpLicenseKey('PTEN-PRO-2026-KEY');
                    setDpDeliveryType('canva_auto');
                    setDpCanvaInviteLink('https://www.canva.com/brand/join?token=vip-ptenit-lifetime');
                    setDpCanvaRules('১. আপনার ক্যানভা অ্যাকাউন্টে লগইন অবস্থায় Access Now বাটনে ক্লিক করুন।\n২. এই এক্সেস শুধুমাত্র আপনার ব্যবহারের জন্য বরাদ্দ।');
                    setDpFeaturesText('রেসপন্সিভ ডিজাইন, লাইফটাইম আপডেট, ডকুমেন্টেশন অন্তর্ভুক্ত');
                    setDpRequirementsText('Node.js 18+ অথবা PHP 8.0+, cPanel হোস্টিং');
                    setDpModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ নতুন প্রোডাক্ট</span>
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setDpActiveSubTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  dpActiveSubTab === 'products'
                    ? 'bg-[#1DB954] text-white shadow-lg shadow-[#1DB954]/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>প্রোডাক্ট ক্যাটালগ ও সোর্স ফাইল ({digitalProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDpActiveSubTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer relative ${
                  dpActiveSubTab === 'orders'
                    ? 'bg-[#1DB954] text-white shadow-lg shadow-[#1DB954]/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>কাস্টমার অর্ডার ও এক্সেস কন্ট্রোল ({digitalOrders.length})</span>
                {pendingDigitalOrders.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                    {pendingDigitalOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* SUB-TAB 1: PRODUCTS CATALOG & SOURCE CODE */}
            {dpActiveSubTab === 'products' && (
              <>
                {/* Filter & Search Bar */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="প্রোডাক্ট টাইটেল বা ক্যাটাগরি সার্চ..."
                      value={dpSearchFilter}
                      onChange={(e) => setDpSearchFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                    {['All', 'Scripts & PHP', 'WordPress', 'HTML/React', 'Mobile App', 'Software', 'Plugins'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setDpCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          dpCategoryFilter === cat
                            ? 'bg-[#1DB954] text-white shadow-md'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {cat === 'All' ? 'সকল আইটেম' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Digital Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {digitalProducts
                .filter(p => {
                  const matchCat = dpCategoryFilter === 'All' || p.category === dpCategoryFilter;
                  const matchSearch = !dpSearchFilter || 
                    p.title.toLowerCase().includes(dpSearchFilter.toLowerCase()) ||
                    p.category.toLowerCase().includes(dpSearchFilter.toLowerCase());
                  return matchCat && matchSearch;
                })
                .map(product => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail & Badges */}
                      <div className="relative h-40 bg-slate-950 overflow-hidden">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
                            product.price === 0
                              ? 'bg-emerald-500 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {product.price === 0 ? '🎁 ১০০% ফ্রি' : `৳${product.price.toLocaleString('bn-BD')}`}
                          </span>
                        </div>

                        <div className="absolute top-2 right-2">
                          <span className="bg-slate-900/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                            {product.fileFormat}
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-slate-300 font-bold">
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                            {product.fileSize}
                          </span>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 text-[#1DB954]">
                            সেলস: {product.salesCount || 0}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wide">
                          {product.category}
                        </span>
                        <h3 className="text-sm font-black text-white line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {product.shortDescription}
                        </p>

                        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-300">
                          <div className="flex justify-between items-center truncate">
                            <span className="text-slate-500">ড্রাইভ লিঙ্ক:</span>
                            <a
                              href={product.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#1DB954] hover:underline font-mono truncate max-w-[170px]"
                            >
                              {product.downloadUrl}
                            </a>
                          </div>
                          {product.licenseKey && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">লাইসেন্স কি:</span>
                              <code className="text-amber-400 font-mono text-[10px]">{product.licenseKey}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setEditingDpId(product.id);
                          setDpTitle(product.title);
                          setDpCategory(product.category);
                          setDpPrice(product.price);
                          setDpOriginalPrice(product.originalPrice || product.price * 2);
                          setDpIsFree(product.price === 0);
                          setDpThumbnail(product.thumbnail);
                          setDpShortDesc(product.shortDescription || '');
                          setDpFullDesc(product.fullDescription || '');
                          setDpFileFormat(product.fileFormat || 'ZIP / Source Code');
                          setDpFileSize(product.fileSize || '24 MB');
                          setDpVersion(product.version || 'v1.0.0');
                          setDpDownloadUrl(product.downloadUrl || '');
                          setDpLicenseKey(product.licenseKey || '');
                          setDpDeliveryType(product.deliveryType || 'canva_auto');
                          setDpCanvaInviteLink(product.canvaInviteLink || 'https://www.canva.com/brand/join?token=vip-ptenit-lifetime');
                          setDpCanvaRules(product.canvaRules || '১. আপনার ক্যানভা অ্যাকাউন্টে লগইন অবস্থায় Access Now বাটনে ক্লিক করুন।\n২. এই এক্সেস শুধুমাত্র আপনার ব্যবহারের জন্য বরাদ্দ।');
                          setDpFeaturesText(product.features ? product.features.join(', ') : '');
                          setDpRequirementsText(product.requirements ? product.requirements.join(', ') : '');
                          setDpModalOpen(true);
                        }}
                        className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        <span>এডিট</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`আপনি কি "${product.title}" সফটওয়্যারটি মুছে ফেলতে চান?`)) {
                            deleteDigitalProduct(product.id);
                          }
                        }}
                        className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl cursor-pointer border border-rose-500/30"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}

            {/* SUB-TAB 2: CUSTOMER ORDERS & ACCESS DELIVERY HUB */}
            {dpActiveSubTab === 'orders' && (
              <div className="space-y-4">
                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                    <span className="text-[11px] text-slate-400 font-bold block">মোট ডিজিটাল অর্ডার</span>
                    <span className="text-xl font-black text-white">{digitalOrders.length}</span>
                  </div>
                  <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl bg-amber-500/5">
                    <span className="text-[11px] text-amber-400 font-bold block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> এক্সেস অপেক্ষমান
                    </span>
                    <span className="text-xl font-black text-amber-400">{pendingDigitalOrders.length}</span>
                  </div>
                  <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl bg-emerald-500/5">
                    <span className="text-[11px] text-emerald-400 font-bold block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> এক্সেস দেওয়া হয়েছে
                    </span>
                    <span className="text-xl font-black text-emerald-400">{grantedDigitalOrders.length}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                    <span className="text-[11px] text-slate-400 font-bold block">মোট বিক্রয় ভলিউম</span>
                    <span className="text-xl font-black text-[#1DB954]">
                      ৳{digitalOrders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="নাম, ইমেইল, মোবাইল, ইনভয়েস আইডি বা সফটওয়্যার সার্চ..."
                      value={dpOrderSearch}
                      onChange={(e) => setDpOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  {/* Status Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    <button
                      type="button"
                      onClick={() => setDpOrderFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        dpOrderFilter === 'all'
                          ? 'bg-[#1DB954] text-white shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      সকল অর্ডার ({digitalOrders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpOrderFilter('pending')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        dpOrderFilter === 'pending'
                          ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      ⏳ এক্সেস বাকি ({pendingDigitalOrders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpOrderFilter('granted')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        dpOrderFilter === 'granted'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      🟢 এক্সেস সম্পন্ন ({grantedDigitalOrders.length})
                    </button>
                  </div>
                </div>

                {/* Secondary Filters: Delivery System & Payment Verification */}
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-bold">ডেলিভারি মোড:</span>
                    <button
                      type="button"
                      onClick={() => setDpDeliveryTypeFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                        dpDeliveryTypeFilter === 'all'
                          ? 'bg-slate-800 text-white shadow'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      সকল ({digitalOrders.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpDeliveryTypeFilter('canva_auto')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                        dpDeliveryTypeFilter === 'canva_auto'
                          ? 'bg-amber-500 text-slate-950 shadow font-black'
                          : 'bg-slate-950 text-amber-400 hover:text-amber-300 border border-slate-800'
                      }`}
                    >
                      <Crown className="w-3 h-3" /> Auto Canva
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpDeliveryTypeFilter('file_download')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                        dpDeliveryTypeFilter === 'file_download'
                          ? 'bg-blue-600 text-white shadow font-black'
                          : 'bg-slate-950 text-blue-400 hover:text-blue-300 border border-slate-800'
                      }`}
                    >
                      <Download className="w-3 h-3" /> File Download
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpDeliveryTypeFilter('email_whatsapp')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                        dpDeliveryTypeFilter === 'email_whatsapp'
                          ? 'bg-purple-600 text-white shadow font-black'
                          : 'bg-slate-950 text-purple-400 hover:text-purple-300 border border-slate-800'
                      }`}
                    >
                      <Mail className="w-3 h-3" /> Email + WA
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap sm:ml-auto">
                    <span className="text-[11px] text-slate-400 font-bold">পেমেন্ট স্ট্যাটাস:</span>
                    <button
                      type="button"
                      onClick={() => setDpPaymentStatusFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                        dpPaymentStatusFilter === 'all'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      সকল
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpPaymentStatusFilter('pending')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                        dpPaymentStatusFilter === 'pending'
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-950 text-amber-400 border border-slate-800'
                      }`}
                    >
                      <Clock className="w-3 h-3" /> পেন্ডিং
                    </button>
                    <button
                      type="button"
                      onClick={() => setDpPaymentStatusFilter('verified')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                        dpPaymentStatusFilter === 'verified'
                          ? 'bg-emerald-600 text-white font-black'
                          : 'bg-slate-950 text-emerald-400 border border-slate-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" /> ভেরিফাইড
                    </button>
                  </div>
                </div>

                {/* Orders List */}
                {filteredDigitalOrders.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-sm font-bold">কোনো ডিজিটাল প্রোডাক্ট অর্ডার পাওয়া যায়নি</p>
                    <p className="text-xs text-slate-500">গ্রাহকরা ডিজিটাল প্রোডাক্ট অর্ডার করলে তাদের তথ্য ও এক্সেস বোতাম এখানে প্রদর্শিত হবে।</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredDigitalOrders.map((order) => {
                      const activeDownloadUrl = order.customFileUrl || order.downloadUrl || order.deliveryFileUrl;
                      const isCanva = order.deliveryType === 'canva_auto' || order.title.toLowerCase().includes('canva');
                      const isVerified = order.paymentStatus === 'verified' || order.amount === 0;

                      return (
                        <div
                          key={order.id}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg hover:border-slate-700 transition"
                        >
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[#1DB954]">
                                #{order.id}
                              </span>

                              {/* Delivery Type Badge */}
                              {isCanva ? (
                                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <Crown className="w-3 h-3" /> ⚡ Auto Canva
                                </span>
                              ) : order.deliveryType === 'file_download' ? (
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <Download className="w-3 h-3" /> 📁 File Download
                                </span>
                              ) : (
                                <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> ✉️ Email + WA
                                </span>
                              )}

                              <span className="text-[11px] text-slate-400">
                                তারিখ: {order.createdAt}
                              </span>
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                                {order.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Payment Verification Status Toggle Button */}
                              <button
                                type="button"
                                onClick={() => handleTogglePaymentStatus(order)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                                  isVerified
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
                                }`}
                                title={isVerified ? 'পেমেন্ট ভেরিফাইড (পুনরায় পেন্ডিং করতে ক্লিক করুন)' : 'পেমেন্ট পেন্ডিং (ভেরিফাই করতে ক্লিক করুন)'}
                              >
                                {isVerified ? (
                                  <>
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>ভেরিফাইড পেমেন্ট</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                                    <span>ভেরিফাই করুন ⚡</span>
                                  </>
                                )}
                              </button>

                              <span className="text-sm font-black text-emerald-400">
                                ৳{order.amount ? order.amount.toLocaleString('bn-BD') : 'ফ্রি'}
                              </span>
                              <span className="text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300 font-mono">
                                {order.paymentMethod}
                              </span>
                            </div>
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            {/* Product Info */}
                            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                              <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                                প্রোডাক্ট ও এক্সেস তথ্য
                              </span>
                              <h4 className="font-black text-white text-sm">
                                {order.title}
                              </h4>

                              <div className="space-y-1 text-[11px]">
                                {order.downloadToken && (
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-400">সিকিউর ডাউনলোড টোকেন:</span>
                                    <code className="text-blue-400 font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                      {order.downloadToken}
                                    </code>
                                  </div>
                                )}

                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-slate-400">ডাউনলোড ফাইল লিঙ্ক:</span>
                                  {activeDownloadUrl ? (
                                    <a
                                      href={activeDownloadUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[#1DB954] hover:underline font-mono truncate max-w-[200px] flex items-center gap-1"
                                      title={activeDownloadUrl}
                                    >
                                      <Download className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{order.customFileName || 'সরাসরি ড্রাইভ লিঙ্ক'}</span>
                                      <ExternalLink className="w-3 h-3 shrink-0" />
                                    </a>
                                  ) : (
                                    <span className="text-amber-400 font-bold flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      <span>ফাইল সেট করা হয়নি</span>
                                    </span>
                                  )}
                                </div>

                                {order.licenseKey && (
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-slate-400">লাইসেন্স কি:</span>
                                    <code className="text-amber-400 font-mono text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                      {order.licenseKey}
                                    </code>
                                  </div>
                                )}

                                {order.deliveryNote && (
                                  <div className="text-slate-400 pt-1 text-[10px] border-t border-slate-900">
                                    নোট: <span className="text-slate-300">{order.deliveryNote}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                              <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                                গ্রাহক ও পেমেন্ট বিবরণ
                              </span>
                              <div className="space-y-1.5 text-[11px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">গ্রাহকের নাম:</span>
                                  <span className="text-white font-bold">{order.buyerName}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">ইমেইল:</span>
                                  <a
                                    href={`mailto:${order.buyerEmail}`}
                                    className="text-blue-400 hover:underline font-mono"
                                  >
                                    {order.buyerEmail}
                                  </a>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400">মোবাইল / WhatsApp:</span>
                                  <a
                                    href={`https://wa.me/${(order.buyerPhone || '').replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#25D366] hover:underline font-mono font-bold flex items-center gap-1"
                                  >
                                    <WhatsAppIcon className="w-3 h-3" />
                                    <span>{order.buyerPhone || 'N/A'}</span>
                                  </a>
                                </div>
                                {order.transactionId && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-400">TrxID:</span>
                                    <span className="text-emerald-400 font-mono font-bold">{order.transactionId}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Canva Specific Live Status Card */}
                          {isCanva && (
                            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-900 border border-amber-500/30 rounded-xl space-y-2 text-xs">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                                  <Crown className="w-4 h-4 text-amber-400" />
                                  <span>Canva VIP Team Invite Link & Access Lock Status:</span>
                                </span>

                                {order.accessUsed ? (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px] flex items-center gap-1">
                                      <Lock className="w-3 h-3 text-rose-400" />
                                      <span>Access Locked (১ বার ব্যবহৃত - {order.accessUsedAt || 'ক্লিক সম্পন্ন'})</span>
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleResetCanvaLock(order)}
                                      className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded text-[10px] cursor-pointer flex items-center gap-1 transition active:scale-95"
                                      title="গ্রাহকের জন্য এক্সেস লক রিসেট করুন যাতে সে আবার Access Now চাপতে পারে"
                                    >
                                      <RefreshCw className="w-3 h-3" /> আনলক / রিসেট
                                    </button>
                                  </div>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1">
                                    <Unlock className="w-3 h-3 text-emerald-400" />
                                    <span>Access Unlocked (১-ক্লিক ব্যবহারের অপেক্ষায়)</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <code className="text-[#1DB954] font-mono text-[11px] truncate flex-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                                  {getCanvaInviteLinkForOrder(order)}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(getCanvaInviteLinkForOrder(order));
                                    alert('Canva Invite Link কপি করা হয়েছে!');
                                  }}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1"
                                >
                                  <Copy className="w-3.5 h-3.5" /> কপি লিংক
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Access Status Banner */}
                          {order.accessGranted ? (
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2 text-xs flex-wrap">
                              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>
                                  এক্সেস সক্রিয়! গ্রাহক ফাইলটি ডাউনলোড বা লিংক অ্যাক্সেস করতে পারবেন। (মাধ্যম: {
                                    order.accessDeliveryMethod === 'whatsapp' ? 'হোয়াটসঅ্যাপ' : 
                                    order.accessDeliveryMethod === 'email' ? 'ইমেইল' : 
                                    order.accessDeliveryMethod === 'both' ? 'হোয়াটসঅ্যাপ ও ইমেইল' : 'ড্রাইভ / অটো এক্সেস'
                                  })
                                </span>
                              </div>
                              {order.accessGrantedAt && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  প্রদান: {order.accessGrantedAt}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2 text-xs animate-pulse">
                              <div className="flex items-center gap-2 text-amber-400 font-bold">
                                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                                <span>
                                  এক্সেস অপেক্ষমান! নিচের বাটন দিয়ে হোয়াটসঅ্যাপ বা ইমেইলে মেসেজ সহ অ্যাক্সেস পাঠান।
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons Hub */}
                          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-800/80">
                            {/* WhatsApp Access Button (Opens Editable WhatsApp Composer Modal) */}
                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppModal(order)}
                              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                              title="গ্রাহকের হোয়াটসঅ্যাপে এডিটেবল মেসেজ ও এক্সেস লিংক পাঠান"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
                            </button>

                            {/* Email Access Button (Opens Editable Email Composer Modal) */}
                            <button
                              type="button"
                              onClick={() => handleOpenEmailModal(order)}
                              className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                              title="গ্রাহকের ইমেইলে এডিটেবল কাস্টম মেসেজ ও এক্সেস পাঠান"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>ইমেইলে এক্সেস পাঠান</span>
                            </button>

                            {/* Attach File / Drive URL Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenAccessFileModal(order)}
                              className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer"
                              title="এই অর্ডারের জন্য নির্দিষ্ট গুগল ড্রাইভ লিঙ্ক বা সোর্স ফাইল সেট করুন"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>ফাইল বা ড্রাইভ লিঙ্ক দিন</span>
                            </button>

                            {/* Toggle Access Switch */}
                            <button
                              type="button"
                              onClick={() => handleToggleOrderAccess(order)}
                              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition cursor-pointer ${
                                order.accessGranted
                                  ? 'bg-slate-800 hover:bg-rose-950/40 text-rose-300 border-rose-500/30'
                                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                              }`}
                            >
                              {order.accessGranted ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              <span>{order.accessGranted ? 'এক্সেস বন্ধ করুন' : 'এক্সেস অনুমোদন করুন'}</span>
                            </button>

                            {/* Delete Order */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`আপনি কি অর্ডার #${order.id} মুছে ফেলতে চান?`)) {
                                  deleteMarketplaceOrder(order.id);
                                }
                              }}
                              className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-xl border border-slate-700 transition cursor-pointer ml-auto"
                              title="অর্ডার ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Add / Edit Digital Product Modal */}
            {dpModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp font-bengali my-8">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-black text-white">
                        {editingDpId ? 'ডিজিটাল প্রোডাক্ট এডিট করুন' : 'নতুন ডিজিটাল প্রোডাক্ট / সফটওয়্যার পাবলিশ'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setDpModalOpen(false)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const featArr = dpFeaturesText.split(',').map(s => s.trim()).filter(Boolean);
                      const reqArr = dpRequirementsText.split(',').map(s => s.trim()).filter(Boolean);

                      if (editingDpId) {
                        updateDigitalProduct(editingDpId, {
                          title: dpTitle,
                          category: dpCategory,
                          price: dpIsFree ? 0 : Number(dpPrice),
                          originalPrice: Number(dpOriginalPrice),
                          thumbnail: dpThumbnail,
                          shortDescription: dpShortDesc,
                          fullDescription: dpFullDesc,
                          fileFormat: dpFileFormat,
                          fileSize: dpFileSize,
                          version: dpVersion,
                          downloadUrl: dpDownloadUrl,
                          licenseKey: dpLicenseKey,
                          deliveryType: dpDeliveryType,
                          canvaInviteLink: dpDeliveryType === 'canva_auto' ? dpCanvaInviteLink : undefined,
                          canvaRules: dpDeliveryType === 'canva_auto' ? dpCanvaRules : undefined,
                          features: featArr,
                          requirements: reqArr
                        });
                      } else {
                        addDigitalProduct({
                          title: dpTitle,
                          category: dpCategory,
                          price: dpIsFree ? 0 : Number(dpPrice),
                          originalPrice: Number(dpOriginalPrice),
                          thumbnail: dpThumbnail,
                          shortDescription: dpShortDesc,
                          fullDescription: dpFullDesc,
                          fileFormat: dpFileFormat,
                          fileSize: dpFileSize,
                          version: dpVersion,
                          downloadUrl: dpDownloadUrl,
                          licenseKey: dpLicenseKey,
                          deliveryType: dpDeliveryType,
                          canvaInviteLink: dpDeliveryType === 'canva_auto' ? dpCanvaInviteLink : undefined,
                          canvaRules: dpDeliveryType === 'canva_auto' ? dpCanvaRules : undefined,
                          features: featArr,
                          requirements: reqArr,
                          rating: 5.0,
                          reviewsCount: 12
                        });
                      }
                      setDpModalOpen(false);
                    }}
                    className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
                  >
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">প্রোডাক্টের নাম / টাইটেল *</label>
                      <input
                        type="text"
                        required
                        value={dpTitle}
                        onChange={(e) => setDpTitle(e.target.value)}
                        placeholder="e.g. Canva Pro VIP Team Access / Web Script"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">ক্যাটাগরি *</label>
                        <select
                          value={dpCategory}
                          onChange={(e) => setDpCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#1DB954]"
                        >
                          <option value="Scripts & PHP">Scripts & PHP</option>
                          <option value="WordPress">WordPress Themes & Plugins</option>
                          <option value="Mobile App">Mobile App (Flutter/React Native)</option>
                          <option value="HTML/React">HTML/React Source Templates</option>
                          <option value="Software">Desktop & Cloud Software</option>
                          <option value="Plugins">Plugins & Extensions</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-amber-400 block mb-1">ডেলিভারি সিস্টেম মোড (Delivery System) *</label>
                        <select
                          value={dpDeliveryType}
                          onChange={(e) => setDpDeliveryType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/50 rounded-xl text-xs text-white focus:outline-none focus:border-[#1DB954]"
                        >
                          <option value="canva_auto">⚡ Auto Canva Access (১-বার ব্যবহারযোগ্য লিংক)</option>
                          <option value="file_download">📁 Information → File Download (ভেরিফাইড ডাউনলোড)</option>
                          <option value="email_whatsapp">✉️ Email + WhatsApp Delivery (এডমিন মেসেজ সহ)</option>
                        </select>
                      </div>
                    </div>

                    {/* Canva Setup Box (shown when deliveryType === 'canva_auto') */}
                    {dpDeliveryType === 'canva_auto' && (
                      <div className="p-4 bg-gradient-to-br from-amber-500/10 via-slate-900 to-emerald-500/10 rounded-2xl border border-amber-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span>⚡ Auto Canva Access কনফিগারেশন</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          পেমেন্ট সফল হওয়ার পর গ্রাহক থ্যাংক ইউ / রুলস পেজে যাবে এবং সেখানে থাকা <strong>"Access Now"</strong> বোতামটি <strong>শুধুমাত্র একবারই</strong> ক্লিক করে আপনার সংরক্ষিত ক্যানভা ইনভাইট লিংকে ঢুকতে পারবে। দ্বিতীয়বার বাটনটি <strong>Access Locked</strong> দেখাবে।
                        </p>

                        <div>
                          <label className="text-xs font-bold text-amber-300 block mb-1">
                            সংরক্ষিত Canva Invite Link (Save/Edit) *
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              required={dpDeliveryType === 'canva_auto'}
                              value={dpCanvaInviteLink}
                              onChange={(e) => setDpCanvaInviteLink(e.target.value)}
                              placeholder="https://www.canva.com/brand/join?token=..."
                              className="w-full px-3.5 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-xs text-[#1DB954] font-mono focus:outline-none focus:border-[#1DB954]"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            আপনার ক্যানভা ব্র্যান্ড/টিম ইনভাইট লিঙ্কটি এখানে দিন। এটি সিকিউরভাবে সেভ থাকবে।
                          </span>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Canva Thank You / Rules গাইডলাইন
                          </label>
                          <textarea
                            rows={2}
                            value={dpCanvaRules}
                            onChange={(e) => setDpCanvaRules(e.target.value)}
                            placeholder="১. ক্যানভায় লগইন করে Access Now বাটনে ক্লিক করুন..."
                            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#1DB954]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Pricing & Free Toggle */}
                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">প্রাইসিং সেটআপ:</span>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-400">
                          <input
                            type="checkbox"
                            checked={dpIsFree}
                            onChange={(e) => {
                              setDpIsFree(e.target.checked);
                              if (e.target.checked) setDpPrice(0);
                              else setDpPrice(450);
                            }}
                            className="rounded text-[#1DB954] focus:ring-0 w-4 h-4"
                          />
                          <span>🎁 এটি কি ১০০% ফ্রি প্রোডাক্ট? (Free Access)</span>
                        </label>
                      </div>

                      {!dpIsFree ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">মূল্য (৳ BDT) *</label>
                            <input
                              type="number"
                              required
                              value={dpPrice}
                              onChange={(e) => setDpPrice(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-[#1DB954] font-black"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-slate-400 block mb-1">রেগুলার মূল্য (স্ট্রাইকথ্রু ৳)</label>
                            <input
                              type="number"
                              value={dpOriginalPrice}
                              onChange={(e) => setDpOriginalPrice(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-400"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-400 font-bold">
                          ✓ ব্যবহারকারীরা কোন পেমেন্ট ছাড়াই সরাসরি ১-ক্লিকে বিনামূল্যে ডাউনলোড করতে পারবে।
                        </p>
                      )}
                    </div>

                    {/* Thumbnail Image URL */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">থাম্বনেইল ইমেজ URL *</label>
                      <input
                        type="url"
                        required
                        value={dpThumbnail}
                        onChange={(e) => setDpThumbnail(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    {/* Download URL & License Key */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">গুগল ড্রাইভ / ডাউনলোড লিঙ্ক *</label>
                        <input
                          type="url"
                          required
                          value={dpDownloadUrl}
                          onChange={(e) => setDpDownloadUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-[#1DB954] font-mono focus:outline-none focus:border-[#1DB954]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">লাইসেন্স অ্যাক্টিভেশন কি</label>
                        <input
                          type="text"
                          value={dpLicenseKey}
                          onChange={(e) => setDpLicenseKey(e.target.value)}
                          placeholder="e.g. PTEN-SCRIPT-2026-KEY"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-mono focus:outline-none focus:border-[#1DB954]"
                        />
                      </div>
                    </div>

                    {/* Format, Size, Version */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">ফাইল ফরম্যাট</label>
                        <input
                          type="text"
                          value={dpFileFormat}
                          onChange={(e) => setDpFileFormat(e.target.value)}
                          placeholder="ZIP / Source Code"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">ফাইল সাইজ</label>
                        <input
                          type="text"
                          value={dpFileSize}
                          onChange={(e) => setDpFileSize(e.target.value)}
                          placeholder="24 MB"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">ভার্সন</label>
                        <input
                          type="text"
                          value={dpVersion}
                          onChange={(e) => setDpVersion(e.target.value)}
                          placeholder="v1.0.0"
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">সংক্ষিপ্ত বিবরণ (Short Description)</label>
                      <input
                        type="text"
                        value={dpShortDesc}
                        onChange={(e) => setDpShortDesc(e.target.value)}
                        placeholder="রেডিমেড রেসপন্সিভ সোর্স কোড ও ফুল ইনস্টলেশন গাইড..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    {/* Features (Comma separated) */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">ফিচারসমূহ (কমা দিয়ে আলাদা করুন)</label>
                      <input
                        type="text"
                        value={dpFeaturesText}
                        onChange={(e) => setDpFeaturesText(e.target.value)}
                        placeholder="লাইফটাইম ফ্রি আপডেট, সম্পূর্ণ কাস্টমাইজেবল, প্রফেশনাল ইউআই"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    {/* Full Description & Requirements */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">বিস্তারিত ল্যান্ডিং বিবরণ ও ডকুমেন্টেশন (Full Description)</label>
                      <textarea
                        rows={4}
                        value={dpFullDesc}
                        onChange={(e) => setDpFullDesc(e.target.value)}
                        placeholder="প্রোডাক্টটি কেনার পর কীভাবে সেটআপ করবেন, লাইসেন্স কি কীভাবে ব্যবহার করবেন এবং কি কি ফিচার পাবেন বিস্তারিত লিখুন..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setDpModalOpen(false)}
                        className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        {editingDpId ? 'পরিবর্তন সেভ করুন' : 'পাবলিশ করুন ✓'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal for Setting Custom Download File / Link for Digital Orders */}
            {dpAccessFileModalOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp font-bengali my-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          ফাইল বা ড্রাইভ এক্সেস প্রদান
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          অর্ডার: <span className="font-mono font-bold text-purple-400">#{dpAccessFileModalOrder.id}</span> • {dpAccessFileModalOrder.buyerName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDpAccessFileModalOrder(null)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product Highlight Banner */}
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">অর্ডারকৃত সফটওয়্যার:</span>
                      <span className="font-black text-white text-sm">{dpAccessFileModalOrder.title}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block font-bold">অর্ডার মূল্য:</span>
                      <span className="font-black text-emerald-400 text-sm">৳{dpAccessFileModalOrder.amount.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-4 text-xs">
                    {/* Cloud Drive Download Link */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-bold flex items-center justify-between">
                        <span>১. গুগল ড্রাইভ / ক্লাউড ডাউনলোড লিঙ্ক (Google Drive Link)</span>
                        <span className="text-[10px] text-[#1DB954] font-normal">সরাসরি লিঙ্ক দিন</span>
                      </label>
                      <div className="relative">
                        <Link2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                        <input
                          type="url"
                          value={dpCustomDownloadUrl}
                          onChange={(e) => setDpCustomDownloadUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Or Local File Selector */}
                    <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <label className="block text-slate-300 font-bold flex items-center gap-1.5">
                        <FileUp className="w-4 h-4 text-purple-400" />
                        <span>২. অথবা কম্পিউটার থেকে লোকাল ফাইল সিলেক্ট করুন (ZIP, RAR, SQL)</span>
                      </label>
                      <input
                        type="file"
                        accept=".zip,.rar,.tar,.gz,.sql,.pdf,.json"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDpCustomFileName(file.name);
                            if (!dpCustomDownloadUrl) {
                              setDpCustomDownloadUrl(`https://ptenit.store/downloads/${file.name}`);
                            }
                          }
                        }}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                      />
                    </div>

                    {/* File Name & License Key Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-slate-300 font-bold">
                          ৩. প্রদর্শিত ফাইলের নাম (File Name)
                        </label>
                        <input
                          type="text"
                          value={dpCustomFileName}
                          onChange={(e) => setDpCustomFileName(e.target.value)}
                          placeholder="e.g. erp-software-source-v1.zip"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-300 font-bold">
                            ৪. লাইসেন্স কি (License Key)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const randKey = `PTEN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
                              setDpCustomLicenseKey(randKey);
                            }}
                            className="text-[10px] text-purple-400 hover:underline cursor-pointer"
                          >
                            + জেনারেট করুন
                          </button>
                        </div>
                        <input
                          type="text"
                          value={dpCustomLicenseKey}
                          onChange={(e) => setDpCustomLicenseKey(e.target.value)}
                          placeholder="e.g. PTEN-ERP-2026-KEY"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Admin Instructions / Note */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-300 font-bold">
                        ৫. গ্রাহকের জন্য ডেলিভারি নির্দেশনা / নোট
                      </label>
                      <textarea
                        rows={2}
                        value={dpCustomAdminNote}
                        onChange={(e) => setDpCustomAdminNote(e.target.value)}
                        placeholder="জিপ ফাইলটি ডাউনলোড করে readme.txt অনুসরণ করুন এবং database.sql ইমপোর্ট করুন..."
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDpAccessFileModalOrder(null)}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOrderFileAndGrant}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-purple-500/20 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>সংরক্ষণ ও এক্সেস মঞ্জুর করুন ✓</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Composing & Sending WhatsApp Delivery Message */}
            {dpWhatsAppModalOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp font-bengali my-8">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center font-bold">
                        <WhatsAppIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          হোয়াটসঅ্যাপ মেসেজ ও এক্সেস পাঠান
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          অর্ডার: <span className="font-mono font-bold text-emerald-400">#{dpWhatsAppModalOrder.id}</span> • প্রাপক: <span className="text-white font-bold">{dpWhatsAppModalOrder.buyerName}</span> ({dpWhatsAppModalOrder.buyerPhone || 'ফোন নম্বর নেই'})
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDpWhatsAppModalOrder(null)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Order Overview Banner */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">প্রোডাক্ট:</span>
                      <span className="text-white font-black">{dpWhatsAppModalOrder.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">ডেলিভারি ধরন:</span>
                      <span className="font-bold text-amber-400">
                        {dpWhatsAppModalOrder.deliveryType === 'canva_auto' ? '⚡ Auto Canva' : 
                         dpWhatsAppModalOrder.deliveryType === 'file_download' ? '📁 File Download' : '✉️ Email + WA'}
                      </span>
                    </div>
                  </div>

                  {/* Message Editor */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-bold">
                        প্রাক-নির্ধারিত মেসেজ (প্রয়োজনে এডিট করুন):
                      </label>
                      <span className="text-[10px] text-[#25D366]">প্রি-ফিল্ড টেমপ্লেট প্রস্তুত</span>
                    </div>
                    <textarea
                      rows={9}
                      value={dpWhatsAppMessageText}
                      onChange={(e) => setDpWhatsAppMessageText(e.target.value)}
                      className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#25D366] font-sans leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-500">
                      💡 বোতাম চাপলে স্বয়ংক্রিয়ভাবে WhatsApp ওপেন হবে এবং এই মেসেজটি রেডি থাকবে। একই সাথে অর্ডারটি ডেলিভার্ড হিসেবে চিহ্নিত হবে।
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDpWhatsAppModalOrder(null)}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleSendWhatsAppSubmit}
                      className="px-6 py-2.5 bg-[#25D366] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition active:scale-95"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>WhatsApp-এ মেসেজ পাঠান ✓</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal for Composing & Sending Email Delivery Message */}
            {dpEmailModalOrder && (
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp font-bengali my-8">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          ইমেইলে এক্সেস ও ডেলিভারি মেসেজ পাঠান
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          অর্ডার: <span className="font-mono font-bold text-blue-400">#{dpEmailModalOrder.id}</span> • প্রাপক: <span className="text-white font-bold">{dpEmailModalOrder.buyerName}</span> ({dpEmailModalOrder.buyerEmail || 'ইমেইল নেই'})
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDpEmailModalOrder(null)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Subject Line */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300 font-bold block">ইমেইল সাবজেক্ট (Subject):</label>
                    <input
                      type="text"
                      value={dpEmailSubject}
                      onChange={(e) => setDpEmailSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {/* Message Body */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300 font-bold block">ইমেইল বডি (Message Body):</label>
                    <textarea
                      rows={9}
                      value={dpEmailBody}
                      onChange={(e) => setDpEmailBody(e.target.value)}
                      className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setDpEmailModalOrder(null)}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={handleSendEmailSubmit}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg shadow-blue-900/30 flex items-center gap-2 transition active:scale-95"
                    >
                      <Mail className="w-4 h-4" />
                      <span>ইমেইল ক্লায়েন্টে ওপেন করুন ও এক্সেস দিন ✓</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          );
        })()}

        {/* TAB 5: ORDERS & PAYMENTS */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-4 font-bengali">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1DB954]" /> পেমেন্ট ও অর্ডার ({orders.length})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  কোর্স পেমেন্ট ও ট্রানজেকশন হিস্টোরি।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-mono">
                  রিভেনিউ: ৳{totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="অর্ডার আইডি, নাম, ফোন বা TrxID..."
                  value={orderSearchFilter}
                  onChange={(e) => setOrderSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'সকল' },
                  { id: 'Paid', label: 'Paid' },
                  { id: 'Pending', label: 'Pending' },
                  { id: 'Failed', label: 'Failed' },
                  { id: 'Cancelled', label: 'বাতিল' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setOrderStatusFilter(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition cursor-pointer ${
                      orderStatusFilter === item.id
                        ? 'bg-[#1DB954] text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
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
          <div className="space-y-4 font-bengali">
            {/* Top Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1DB954]" />
                    <span>বিল জমা ও অটো-ভেরিফিকেশন ({companyBills.length})</span>
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  বিকাশ, নগদ, রকেট ও ব্যাংক বিল ট্রানজেকশন অটো-রিড ও অনুমোদন।
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => setAddBillModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer border border-slate-700 transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>+ নতুন বিল</span>
                </button>

                <button
                  onClick={handleAutoVerifyAllPendingBills}
                  disabled={isAutoReading}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>⚡ অটো-ভেরিফাই</span>
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
                        ? 'bg-[#1DB954] text-white'
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
                                  className="px-2.5 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 shadow"
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
          <div className="space-y-4 font-bengali">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#1DB954]" /> ক্লায়েন্ট প্রজেক্ট
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  কর্পোরেট ক্লায়েন্ট ও প্রজেক্ট মিলস্টোন।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('নতুন B2B ক্লায়েন্ট প্রজেক্ট যুক্ত করতে বায়ার জব ও ডেসপ্যাচ ম্যানেজমেন্ট ব্যবহার করুন।')}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন প্রজেক্ট</span>
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
          <div className="space-y-4 font-bengali">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#1DB954]" /> মার্কেটপ্লেস হাব
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  গিগ অনুমোদন, বায়ার ব্রিফ ও অর্ডার নিয়ন্ত্রণ।
                </p>
              </div>

              {/* Sub-Tabs Nav */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 overflow-x-auto max-w-full scrollbar-none">
                {[
                  { id: 'overview', label: 'ওভারভিউ', icon: LayoutDashboard },
                  { id: 'gigs', label: 'গিগসমূহ', icon: ShoppingBag },
                  { id: 'jobs', label: 'বায়ার ব্রিফ', icon: Send },
                  { id: 'orders', label: 'অর্ডারস', icon: ShieldCheck },
                  { id: 'categories', label: 'ক্যাটাগরি', icon: Tag },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMktAdminSubTab(tab.id as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        mktAdminSubTab === tab.id
                          ? 'bg-[#1DB954] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
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
                        gigStatusFilter === 'all' ? 'bg-[#1DB954] text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
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
                              className="px-2 py-1 bg-emerald-500/20 text-[#1DB954] hover:bg-[#1DB954] hover:text-white text-[10px] font-bold rounded-lg transition border border-emerald-500/30 cursor-pointer flex items-center gap-1"
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
                    className="px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition-all"
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
                            className="px-3.5 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow cursor-pointer transition flex items-center gap-1"
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
                        className="px-3 py-1.5 bg-[#1DB954] text-white font-black text-xs rounded-xl hover:bg-emerald-500 transition shadow cursor-pointer flex items-center gap-1"
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
                                    className="px-2.5 py-1 bg-[#1DB954] text-white font-black text-[10px] rounded-md shadow hover:bg-emerald-500 transition cursor-pointer"
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
                  <span>ক্যাটাগরি & সার্ভিস ফিল্টার</span>
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
                    className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl cursor-pointer"
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
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#1DB954]" /> গ্যালারি ও মিডিয়া ({gallery.length})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  একাডেমির ছবি ও ল্যাব ফটোগ্রাফি।
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setGalleryModalOpen(true)}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন ছবি</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map(item => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-32 sm:h-40 object-cover" />
                  <div className="p-2.5 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#1DB954] uppercase">{item.category}</span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{item.caption}</p>
                  </div>
                  <button
                    onClick={() => deleteGalleryItem(item.id)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg shadow opacity-90 hover:opacity-100 cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Testimonials Management Section */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>শিক্ষার্থীদের রিভিউ ({testimonials.length})</span>
                </h3>
                <button
                  onClick={() => setTestimonialModalOpen(true)}
                  className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>+ নতুন রিভিউ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-start gap-2.5 shadow">
                    <div className="flex items-start gap-2.5">
                      <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-semibold">{t.courseOrService}</span>
                        <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">"{t.text}"</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SITE SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-4 font-bengali">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg max-w-3xl">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#1DB954]" /> ওয়েবসাইট কন্টেন্ট
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  ল্যান্ডিং পেজ ও তথ্য সেটিংস।
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-3xl space-y-4">
              {settingsSaved && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-bold rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> সেটিংস সফলভাবে আপডেট ও সেভ হয়েছে!
                </div>
              )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">হিরো মেইন হেডিং</label>
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

              {/* Logo 01: PTENit Website Logo (Main Site Header & Footer) */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#1DB954]/30 bg-white dark:bg-slate-900 shadow-sm space-y-4 font-bengali">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                      ০১. পিটেন আইটি ওয়েবসাইট লোগো (PTENit Main Website Logo)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      মূল ওয়েবসাইট, হেডার ন্যাভবার ও ফুটারের জন্য লোগো। আপলোড না করলে ডিফল্ট টেক্সট লোগো (PTENit) থাকবে।
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                    settingsForm.logoUrl
                      ? "bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}>
                    {settingsForm.logoUrl ? "ইমেজ লোগো সক্রিয়" : "ডিফল্ট টেক্সট লোগো"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow transition-all">
                      <Upload className="w-4 h-4" />
                      <span>পিটেন আইটি লোগো আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileUpload(e, url => setSettingsForm(prev => ({
                          ...prev,
                          logoUrl: url,
                          logoMode: "image"
                        })))}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="অথবা লোগোর সরাসরি ইমেজ URL দিন (https://...)"
                      value={settingsForm.logoUrl || ""}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        logoUrl: e.target.value,
                        logoMode: e.target.value ? "image" : "box_text"
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  {settingsForm.logoUrl ? (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
                          <img
                            src={settingsForm.logoUrl}
                            alt="PTENit Logo"
                            className="h-9 w-auto max-w-[160px] object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">পিটেন আইটি ইমেজ লোগো আপলোড করা হয়েছে</p>
                          <p className="text-[10px] text-[#1DB954]">হেডার ও ফুটারে এই লোগোটি প্রদর্শিত হচ্ছে</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({
                          ...prev,
                          logoUrl: "",
                          logoMode: "box_text"
                        }))}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছে ডিফল্ট টেক্সটে ফিরুন</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                          P
                        </div>
                        <div className="font-bold text-sm">
                          <span className="text-slate-900 dark:text-white">PTEN</span>
                          <span className="text-[#1DB954]">it</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2">
                          (বর্তমানে ডিফল্ট টেক্সট লোগো প্রদর্শিত হচ্ছে)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo 02: Marketplace Logo (Marketplace Header & Branding) */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-sky-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-4 font-bengali">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                      ০২. মার্কেটপ্লেস লোগো (Marketplace Logo)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      মার্কেটপ্লেস ও সার্ভিসেস সেকশনের নিজস্ব লোগো। আপলোড না করলে পিটেন আইটির মূল লোগো বা ডিফল্ট টেক্সট থাকবে।
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                    settingsForm.marketplaceLogoUrl
                      ? "bg-sky-500/10 text-sky-500 border-sky-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}>
                    {settingsForm.marketplaceLogoUrl ? "মার্কেটপ্লেস লোগো সক্রিয়" : "ডিফল্ট লোগো"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow transition-all">
                      <Upload className="w-4 h-4" />
                      <span>মার্কেটপ্লেস লোগো আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileUpload(e, url => setSettingsForm(prev => ({
                          ...prev,
                          marketplaceLogoUrl: url
                        })))}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="অথবা মার্কেটপ্লেস লোগোর সরাসরি ইমেজ URL দিন (https://...)"
                      value={settingsForm.marketplaceLogoUrl || ""}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        marketplaceLogoUrl: e.target.value
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {settingsForm.marketplaceLogoUrl ? (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
                          <img
                            src={settingsForm.marketplaceLogoUrl}
                            alt="Marketplace Logo"
                            className="h-9 w-auto max-w-[160px] object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">মার্কেটপ্লেস ইমেজ লোগো আপলোড করা হয়েছে</p>
                          <p className="text-[10px] text-sky-400">মার্কেটপ্লেস সেকশনে এই লোগোটি প্রদর্শিত হচ্ছে</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({
                          ...prev,
                          marketplaceLogoUrl: ""
                        }))}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
                          M
                        </div>
                        <div className="font-bold text-sm">
                          <span className="text-slate-900 dark:text-white">PTENit</span>
                          <span className="text-sky-500 ml-1">Marketplace</span>
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-2">
                          (আপলোড না থাকলে মূল সাইট লোগো বা ডিফল্ট টেক্সট দেখাবে)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Visual Customizer: Clean Model / Cover Photo Upload */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-4 font-bengali">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#1DB954]" />
                      হিরো সেকশন কভার বা মডেল ছবি (Hero Image)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      ওয়েবসাইটের হিরো সেকশনের ডানপাশে মডেল ছবি আপলোড করুন। ছবিটি কোনো ফ্রেম ছাড়াই সফট মাস্ক ও ব্যাকগ্রাউন্ড কালারের সাথে মিশে হিরো হেডলাইনকে প্রেজেন্ট করবে।
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                    settingsForm.heroPhotoUrl || settingsForm.heroBannerUrl
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}>
                    {settingsForm.heroPhotoUrl || settingsForm.heroBannerUrl ? "মাস্কড মডেল ছবি সক্রিয়" : "কোড প্রিভিউ সক্রিয়"}
                  </span>
                </div>

                {/* Upload & URL Controls */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow transition-all">
                      <Upload className="w-4 h-4" />
                      <span>মডেল বা কভার ছবি আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileUpload(e, url => setSettingsForm(prev => ({
                          ...prev,
                          heroPhotoUrl: url,
                          heroBannerUrl: url,
                          heroVisualType: "photo"
                        })))}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="অথবা ছবির সরাসরি ইমেজ URL দিন (https://...)"
                      value={settingsForm.heroPhotoUrl || settingsForm.heroBannerUrl || ""}
                      onChange={e => setSettingsForm({
                        ...settingsForm,
                        heroPhotoUrl: e.target.value,
                        heroBannerUrl: e.target.value,
                        heroVisualType: e.target.value ? "photo" : "code_mockup"
                      })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  {/* Photo Preview & Remove Option */}
                  {(settingsForm.heroPhotoUrl || settingsForm.heroBannerUrl) ? (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-24 rounded-lg overflow-hidden border border-[#1DB954]/50 bg-slate-950 shrink-0">
                          <img
                            src={settingsForm.heroPhotoUrl || settingsForm.heroBannerUrl}
                            alt="Hero Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">হিরো সেকশনে আপনার ছবি যুক্ত হয়েছে</p>
                          <p className="text-[10px] text-[#1DB954]">
                            হিরো সেকশনে টেক্সটের পাশে ব্যাকগ্রাউন্ড কালারের সাথে নিখুঁতভাবে মিশে ছবিটি প্রদর্শিত হচ্ছে।
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({
                          ...prev,
                          heroPhotoUrl: "",
                          heroBannerUrl: "",
                          heroVisualType: "code_mockup"
                        }))}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ছবি মুছুন (কোড উইন্ডোতে ফিরুন)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      কোনো ছবি যুক্ত নেই — হিরো সেকশনে ডিফল্ট প্ল্যাটফর্ম কোড উইন্ডো প্রদর্শিত হচ্ছে।
                    </div>
                  )}
                </div>
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

        {/* TAB 7.2: DEDICATED SUB-ADMIN MANAGEMENT */}
        {activeAdminTab === 'sub_admins' && (
          <div className="space-y-6 font-bengali">
            {/* Top Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" /> সাব-এডমিন টিম ({settingsForm.subAdminMembers?.length || 0})
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  টিম সদস্য ও একসেস পারমিশন কন্ট্রোল।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubAdminModalOpen(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন মেম্বার</span>
              </button>
            </div>

            {/* Quick Stat Counter Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 shadow">
                <p className="text-xs text-slate-400 font-bold">মোট মেম্বার</p>
                <p className="text-xl sm:text-2xl font-black text-white mt-1">
                  {settingsForm.subAdminMembers?.length || 0} <span className="text-xs font-normal text-slate-400">জন</span>
                </p>
              </div>
              <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 shadow">
                <p className="text-xs text-amber-400 font-bold">সাব-এডমিন</p>
                <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                  {(settingsForm.subAdminMembers || []).filter(m => m.role === 'Sub-Admin').length} <span className="text-xs font-normal text-slate-400">জন</span>
                </p>
              </div>
              <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 shadow">
                <p className="text-xs text-emerald-400 font-bold">সাপোর্ট</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                  {(settingsForm.subAdminMembers || []).filter(m => m.role === 'Support Specialist').length} <span className="text-xs font-normal text-slate-400">জন</span>
                </p>
              </div>
              <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 shadow">
                <p className="text-xs text-blue-400 font-bold">ম্যানেজার</p>
                <p className="text-xl sm:text-2xl font-black text-blue-400 mt-1">
                  {(settingsForm.subAdminMembers || []).filter(m => m.role === 'Order Manager' || m.role === 'Course Admin').length} <span className="text-xs font-normal text-slate-400">জন</span>
                </p>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="নাম, ইমেইল বা ফোন..."
                  value={subAdminSearchFilter}
                  onChange={e => setSubAdminSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-bold whitespace-nowrap">পদবী:</span>
                <select
                  value={subAdminRoleFilter}
                  onChange={e => setSubAdminRoleFilter(e.target.value)}
                  className="w-full sm:w-auto px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="all">সকল ({settingsForm.subAdminMembers?.length || 0})</option>
                  <option value="Sub-Admin">Sub-Admin</option>
                  <option value="Support Specialist">Support Specialist</option>
                  <option value="Order Manager">Order Manager</option>
                  <option value="Course Admin">Course Admin</option>
                </select>
              </div>
            </div>

            {/* Sub-Admin Members List Cards */}
            <div className="space-y-4">
              {(() => {
                const members = (settingsForm.subAdminMembers || []).filter(m => {
                  const matchesSearch = !subAdminSearchFilter ||
                    m.name.toLowerCase().includes(subAdminSearchFilter.toLowerCase()) ||
                    m.email.toLowerCase().includes(subAdminSearchFilter.toLowerCase()) ||
                    m.phone.includes(subAdminSearchFilter);
                  const matchesRole = subAdminRoleFilter === 'all' || m.role === subAdminRoleFilter;
                  return matchesSearch && matchesRole;
                });

                if (members.length === 0) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Users className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">কোনো সাব-এডমিন বা সাপোর্ট মেম্বার পাওয়া যায়নি</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        আপনার এডমিন প্যানেলকে সহযোগিতার জন্য নতুন সাব-এডমিন নিয়োগ করতে উপরের "+ নতুন সাব-এডমিন / মেম্বার নিয়োগ" বাটনে ক্লিক করুন।
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubAdminModalOpen(true)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> মেম্বার যুক্ত করুন
                      </button>
                    </div>
                  );
                }

                const allSelected = members.length > 0 && members.every(m => selectedSubAdminIds.includes(m.id));

                const handleToggleSelectAll = () => {
                  if (allSelected) {
                    setSelectedSubAdminIds(prev => prev.filter(id => !members.some(m => m.id === id)));
                  } else {
                    const newIds = Array.from(new Set([...selectedSubAdminIds, ...members.map(m => m.id)]));
                    setSelectedSubAdminIds(newIds);
                  }
                };

                const handleBulkStatusChange = (newStatus: 'active' | 'suspended') => {
                  if (selectedSubAdminIds.length === 0) return;
                  const updatedList = (settingsForm.subAdminMembers || []).map(m =>
                    selectedSubAdminIds.includes(m.id) ? { ...m, status: newStatus } : m
                  );
                  setSettingsForm({ ...settingsForm, subAdminMembers: updatedList });
                  updateSiteSettings({ ...settingsForm, subAdminMembers: updatedList });
                  alert(`সিলেক্ট করা ${selectedSubAdminIds.length} জন মেম্বারের স্টেটাস ${newStatus === 'active' ? 'অ্যাক্টিভ' : 'সাসপেন্ডেড'} করা হয়েছে!`);
                };

                const handleBulkDelete = () => {
                  if (selectedSubAdminIds.length === 0) return;
                  if (window.confirm(`আপনি কি নিশ্চিত যে সিলেক্ট করা ${selectedSubAdminIds.length} জন সাব-এডমিন মেম্বারকে স্থায়ীভাবে মুছে ফেলতে চান?`)) {
                    const updatedList = (settingsForm.subAdminMembers || []).filter(m => !selectedSubAdminIds.includes(m.id));
                    setSettingsForm({ ...settingsForm, subAdminMembers: updatedList });
                    updateSiteSettings({ ...settingsForm, subAdminMembers: updatedList });
                    setSelectedSubAdminIds([]);
                    alert('সিলেক্ট করা মেম্বারদের রিমুভ করা হয়েছে!');
                  }
                };

                return (
                  <div className="space-y-4">
                    {/* Bulk Action Header Control Toolbar */}
                    <div className="bg-amber-500/10 dark:bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-800 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={handleToggleSelectAll}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                          />
                          <span>সবগুলো সিলেক্ট করুন ({members.length})</span>
                        </label>
                        {selectedSubAdminIds.length > 0 && (
                          <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[11px] rounded-full">
                            {selectedSubAdminIds.length} জন সিলেক্টেড
                          </span>
                        )}
                      </div>

                      {selectedSubAdminIds.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleBulkStatusChange('active')}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-1 shadow transition cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>বাল্ক অ্যাক্টিভ করুন ({selectedSubAdminIds.length})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleBulkStatusChange('suspended')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow transition cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>বাল্ক সাসপেন্ড করুন ({selectedSubAdminIds.length})</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleBulkDelete}
                            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl flex items-center gap-1 shadow transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>বাল্ক ডিলিট ({selectedSubAdminIds.length})</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          💡 একসাথে একাধিক মেম্বারের অ্যাক্সেস অ্যাক্টিভ/সাসপেন্ড করতে টিক চিহ্ন দিন
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {members.map(member => {
                        const isSelected = selectedSubAdminIds.includes(member.id);

                        return (
                          <div
                            key={member.id}
                            className={`bg-slate-900 p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                              isSelected
                                ? 'border-amber-500 bg-amber-950/20 shadow-md'
                                : 'border-slate-800 hover:border-amber-500/50 shadow'
                            }`}
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {
                                      if (isSelected) {
                                        setSelectedSubAdminIds(prev => prev.filter(id => id !== member.id));
                                      } else {
                                        setSelectedSubAdminIds(prev => [...prev, member.id]);
                                      }
                                    }}
                                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0 mt-0.5"
                                  />
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-inner shrink-0 ${
                                    member.role === 'Sub-Admin' ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                                    member.role === 'Support Specialist' ? 'bg-gradient-to-br from-emerald-500 to-teal-700' :
                                    member.role === 'Order Manager' ? 'bg-gradient-to-br from-blue-500 to-indigo-700' :
                                    'bg-gradient-to-br from-purple-500 to-violet-700'
                                  }`}>
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                                      {member.name}
                                    </h4>
                                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded mt-0.5 ${
                                      member.role === 'Sub-Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                      member.role === 'Support Specialist' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                      member.role === 'Order Manager' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    }`}>
                                      {member.role}
                                    </span>
                                  </div>
                                </div>

                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 shrink-0 ${
                                  member.status === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                                  {member.status === 'active' ? 'অ্যাক্টিভ' : 'সাসপেন্ডেড'}
                                </span>
                              </div>

                              <div className="space-y-1 text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                                <p className="flex items-center gap-1.5">
                                  <span className="text-slate-400 font-sans font-bold">ইমেইল:</span> {member.email}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <span className="text-slate-400 font-sans font-bold">মোবাইল:</span> {member.phone}
                                </p>
                                {member.assignedAt && (
                                  <p className="flex items-center gap-1.5 text-[11px]">
                                    <span className="text-slate-400 font-sans font-bold">নিয়োগ তারিখ:</span> {member.assignedAt}
                                  </p>
                                )}
                              </div>

                              <div>
                                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                                  অনুমোদিত অ্যাক্সেস পারমিশনসমূহ:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {member.permissions.map((perm, idx) => {
                                    const permLabels: Record<string, string> = {
                                      'orders_manage': '📦 অর্ডার প্রসেসিং',
                                      'support_chat': '💬 লাইভ চ্যাট & সাপোর্ট',
                                      'courses_manage': '📚 কোর্স মডারেশন',
                                      'user_verify': '👥 ইউজার ভেরিফিকেশন',
                                      'billing_verify': '⚡ বিলিং অডিট',
                                      'gigs_manage': '💼 গিগ & সার্ভিস'
                                    };
                                    return (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-600"
                                      >
                                        {permLabels[perm] || perm}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedList = (settingsForm.subAdminMembers || []).map(m =>
                                    m.id === member.id ? { ...m, status: (m.status === 'active' ? 'suspended' : 'active') as any } : m
                                  );
                                  setSettingsForm({ ...settingsForm, subAdminMembers: updatedList });
                                  updateSiteSettings({ ...settingsForm, subAdminMembers: updatedList });
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  member.status === 'active'
                                    ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                }`}
                              >
                                {member.status === 'active' ? 'পজ / সাসপেন্ড করুন' : 'পুনরায় সক্রিয় করুন'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`আপনি কি নিশ্চিত যে ${member.name}-কে সাব-এডমিন তালিকা থেকে মুছে ফেলতে চান?`)) {
                                    handleRemoveSubAdmin(member.id);
                                  }
                                }}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>ডিলিট</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Permission Guide Matrix Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black text-white">সাব-এডমিন পদবী ও পারমিশন গাইডলাইন</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <p className="font-black text-amber-400">১. Sub-Admin</p>
                  <p className="text-slate-400 text-[11px]">সম্পূর্ণ একাডেমি ও মার্কেটপ্লেসের সকল অর্ডার, গিগ, ক্লায়েন্ট ও ভেরিফিকেশন অ্যাক্সেস।</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <p className="font-black text-emerald-400">২. Support Specialist</p>
                  <p className="text-slate-400 text-[11px]">শুধুমাত্র সরাসরি লাইভ মেসেঞ্জার চ্যাট, গ্রাহক সাপোর্ট ও টিকেট সমাধান করার সুবিধা।</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <p className="font-black text-blue-400">৩. Order Manager</p>
                  <p className="text-slate-400 text-[11px]">মার্কেটপ্লেস এস্ক্রো অর্ডার ডেলিভারি যাচাই, অ্যাপ্রুভাল ও কোর্স রেজিস্ট্রেশন ম্যানেজমেন্ট।</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ALL WRITTEN CONTENT EDITOR */}
        {activeAdminTab === 'written_content' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-3xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-400" /> সকল লিখিত কনটেন ম্যানেজমেন্ট (All Written Content)
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  হিরো নোটিশ ব্যানার, আমাদের সম্পর্কে, শর্তাবলী (Terms), প্রাইভেসি পলিসি, রিফান্ড পলিসি এবং ফুটার স্লোগান এডিট করুন।
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-3xl space-y-6">
              {settingsSaved && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-bold rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> লিখিত কনটেন সফলভাবে আপডেট ও সেভ হয়েছে!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    📢 হিরো ব্যানার নোটিশ & অ্যানাউন্সমেন্ট টেক্সট
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementNoticeText || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, announcementNoticeText: e.target.value })}
                    placeholder="উদা: 📢 ঈদ মেগা ধামাকা অফার! প্রিমিয়াম সার্ভিস ও ডিজিটাল প্রোডাক্ট কোর্সে বিশেষ ছাড় চলছে!"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    ℹ️ আমাদের সম্পর্কে বিস্তারিত কন্টেন্ট (About Us Written Content)
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.aboutUsText || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, aboutUsText: e.target.value })}
                    placeholder="PTEN IT Solutions হলো বাংলাদেশের শীর্ষস্থানীয় ডিজিটাল সার্ভিস ও আইটি স্কিল ডেভেলপমেন্ট প্ল্যাটফর্ম..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    📜 শর্তাবলী ও সার্ভিস পলিসি (Terms & Conditions Text)
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.termsAndConditionsText || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, termsAndConditionsText: e.target.value })}
                    placeholder="১. আমাদের সকল ডিজিটাল সার্ভিস এবং কোর্স ব্যবহারের ক্ষেত্রে প্রফেশনাল পলিসি প্রযোজ্য..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    🔒 প্রাইভেসি পলিসি টেক্সট (Privacy Policy Written Content)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.privacyPolicyText || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, privacyPolicyText: e.target.value })}
                    placeholder="আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত রাখা হয়..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    🔄 রিফান্ড পলিসি ও মানি ব্যাক শর্তাবলী (Refund Policy Text)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.refundPolicyText || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, refundPolicyText: e.target.value })}
                    placeholder="১০ দিনের মানি ব্যাক গ্যারান্টি শর্ত সাপেক্ষে প্রযোজ্য..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    🦶 ফুটার কপিরাইট & ব্র্যান্ড স্লোগান টেক্সট (Footer Copyright Text)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.footerCopyrightText || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, footerCopyrightText: e.target.value })}
                    placeholder="© ২০২৬ PTEN IT Solutions. সর্বস্বত্ব সংরক্ষিত।"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" /> লিখিত কনটেন সেভ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: RESPONSIVE 100% SETUP */}
        {activeAdminTab === 'responsive_setup' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-3xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Monitor className="w-6 h-6 text-emerald-400" /> ১০০% রেসপন্সিভ & কন্টেইনার উইডথ কন্ট্রোল
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  মোবাইল, ট্যাবলেট, ল্যাপটপ এবং ডেক্সটপে ওয়েবসাইটের ১০০% লেআউট উইডথ, গ্রিড ডেনসিটি ও ভিউপোর্ট স্কেলিং কনফিগার করুন।
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-3xl space-y-6">
              {settingsSaved && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-bold rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> রেসপন্সিভ লেআউট সেটিং সেভ হয়েছে!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 100% Fluid Full Width Toggle */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-[#1DB954]" />
                        <span>১০০% ফুল উইডথ মোড (100% Full-Width Fluid Container)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        অন থাকলে ওয়েবসাইট নেভবার, ল্যান্ডিং পেইজ, কোর্স ও সার্ভিস ড্যাশবোর্ড স্ক্রিনের ১০০% উইডথ দখল করবে।
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={settingsForm.enableFullWidth100Percent !== false}
                        onChange={e => setSettingsForm({ ...settingsForm, enableFullWidth100Percent: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1DB954]"></div>
                    </label>
                  </div>
                </div>

                {/* Container Max Width Selector */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    কন্টেইনার ম্যাক্সিমাম উইডথ (Container Width Limit)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: '100%', label: '১০০% সম্পূর্ণ উইডথ (100% Fluid)' },
                      { value: '1536px', label: '১৫৩৬ পিক্সেল (Ultra-Wide 2K)' },
                      { value: '1280px', label: '১২৮০ পিক্সেল (Standard Desktop)' }
                    ].map(opt => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setSettingsForm({ ...settingsForm, containerMaxWidth: opt.value })}
                        className={`p-3 rounded-xl border text-xs font-extrabold flex items-center justify-between cursor-pointer transition-all ${
                          (settingsForm.containerMaxWidth || '100%') === opt.value
                            ? 'border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954]'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {(settingsForm.containerMaxWidth || '100%') === opt.value && <Check className="w-4 h-4 text-[#1DB954]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Scale Percentage */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-900 dark:text-white">
                      ডিসপ্লে ভিউপোর্ট জুম & স্কেলিং (%)
                    </label>
                    <span className="px-2.5 py-1 bg-[#1DB954]/20 text-[#1DB954] text-xs font-black rounded-lg">
                      {settingsForm.customScalePercent || 100}%
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[90, 95, 100, 105].map(scale => (
                      <button
                        type="button"
                        key={scale}
                        onClick={() => setSettingsForm({ ...settingsForm, customScalePercent: scale })}
                        className={`p-2.5 rounded-xl border text-xs font-extrabold text-center cursor-pointer transition-all ${
                          (settingsForm.customScalePercent || 100) === scale
                            ? 'border-[#1DB954] bg-[#1DB954] text-white font-black'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {scale}% {scale === 100 ? '(ডিফল্ট)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Responsive Grid Mode */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                  <label className="block text-xs font-bold text-slate-900 dark:text-white">
                    মোবাইল ডিভাইস গ্রিড রেসপন্সিভ মোড (Mobile Layout)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: 'fluid_100', label: '১০০% এজ-টু-এজ ফ্লুইড' },
                      { value: 'adaptive', label: 'অ্যাডাপ্টিভ প্যাডেড' },
                      { value: 'compact', label: 'কমপ্যাক্ট ফিট' }
                    ].map(m => (
                      <button
                        type="button"
                        key={m.value}
                        onClick={() => setSettingsForm({ ...settingsForm, mobileResponsiveMode: m.value as any })}
                        className={`p-3 rounded-xl border text-xs font-extrabold text-center cursor-pointer transition-all ${
                          (settingsForm.mobileResponsiveMode || 'fluid_100') === m.value
                            ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Responsive Grid Box Preview */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 space-y-2">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping"></span>
                    রেসপন্সিভ গ্রিড লাইভ প্রিভিউ (100% Fit Box)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-[10px] font-bold text-slate-300">
                      📱 মোবাইল (100%)
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-[10px] font-bold text-slate-300">
                      💻 ট্যাবলেট (100%)
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-[10px] font-bold text-slate-300">
                      🖥️ ল্যাপটপ (100%)
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center text-[10px] font-bold text-[#1DB954]">
                      ✨ ডেক্সটপ (100% Fluid)
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#1DB954] text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg hover:bg-emerald-500 transition-all"
                >
                  <Save className="w-4 h-4" /> ১০০% রেসপন্সিভ সেটিং সেভ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: PIXEL & ANALYTICS SETUP */}
        {activeAdminTab === 'pixel_setup' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-3xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-400" /> পিক্সেল & অ্যানালিটিক্স কনফিগারেশন
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  Meta / Facebook Pixel, Google Analytics (GA4), TikTok Pixel এবং Google Tag Manager আইডি সেটিংস করুন।
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-3xl space-y-6">
              {settingsSaved && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-bold rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> পিক্সেল আইডি সফলভাবে আপডেট ও সেভ হয়েছে!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                    Facebook / Meta Pixel ID
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: 7891234567890"
                    value={settingsForm.metaPixelId || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, metaPixelId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">ফেসবুক অ্যাডস ট্র্যাকিং ও কাস্টম অডিয়েন্স তৈরির জন্য পিক্সেল আইডি আইডি।</p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                    Google Analytics (GA4) Tag ID
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: G-XXXXXXXXXX"
                    value={settingsForm.googleAnalyticsId || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">গুগল অ্যানালিটিক্স ৪ ট্র্যাকিং কোড।</p>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                    TikTok Pixel ID
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: C1234567890TIK"
                    value={settingsForm.tiktokPixelId || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, tiktokPixelId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                    Google Tag Manager (GTM) Container ID
                  </label>
                  <input
                    type="text"
                    placeholder="উদা: GTM-XXXXXXX"
                    value={settingsForm.googleTagManagerId || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, googleTagManagerId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                    Meta Conversion API Access Token (Server-Side Tracking)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="EAAG..."
                    value={settingsForm.conversionApiToken || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, conversionApiToken: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" /> পিক্সেল কনফিগ সেভ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: SEO & SEARCH ENGINE OPTIMIZATION SETUP */}
        {activeAdminTab === 'seo_setup' && (
          <div className="space-y-6 font-bengali">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl max-w-4xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Globe className="w-6 h-6 text-emerald-400" /> SEO & সার্চ ইঞ্জিন অপটিমাইজেশন (SEO Settings)
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  Google, Bing, Facebook, Twitter (X) এবং WhatsApp শেয়ারিং মেটা ট্যাগ, ওপেনগ্রাফ ইমেজ ও স্কিমা স্ট্রাকচার্ড ডাটা সংজ্ঞায়িত করুন।
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 max-w-4xl space-y-6">
              {settingsSaved && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-bold rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" /> SEO মেটা ট্যাগ ও ওপেনগ্রাফ সেটিংস সেভ করা হয়েছে!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 1. Global Google & Search Engine Meta Tags */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                    <Search className="w-4 h-4" />১. গুগল & সার্চ ইঞ্জিন মেটা ট্যাগস (Global Search Engine Meta)
                  </span>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      SEO শিরোনাম (Site Meta Title) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="উদা: PTENit – IT Services, Web Development, Digital Marketing & IT Training Academy"
                      value={settingsForm.seoTitle || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">সার্চ রেজাল্ট ও ব্রাউজার ট্যাবে প্রদর্শিত ওয়েবসাইটের মূল মেটা টাইটেল (৫০-৬০ ক্যারেক্টার আদর্শ)।</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      মেটা ডেসক্রিপশন (Meta Description) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="উদা: PTENit বাংলাদেশে প্রফেশনাল ওয়েব ডিজাইন, কাস্টম সফটওয়্যার, ডিজিটাল মার্কেটিং ও আইটি স্কিল ট্রেনিং প্রদান করে।"
                      value={settingsForm.metaDescription || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, metaDescription: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">গুগল সার্চ রেজাল্টে টাইটেলের নিচে দেখানো সামারি ডেসক্রিপশন (১৩০-১৬০ ক্যারেক্টার)।</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      সার্চ কি-ওয়ার্ডস (Meta Keywords)
                    </label>
                    <input
                      type="text"
                      placeholder="PTENit, IT Services, Web Development Bangladesh, SEO Course, Graphic Design"
                      value={settingsForm.metaKeywords || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, metaKeywords: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">কমা (,) দিয়ে আলাদা করা টার্গেটেড আইটি ও কোর্স কি-ওয়ার্ড তালিকা।</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      Google Search Console Verification Tag
                    </label>
                    <input
                      type="text"
                      placeholder="google-site-verification-token-code"
                      value={settingsForm.googleSiteVerification || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, googleSiteVerification: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                {/* 2. OpenGraph Social Sharing Meta Tags */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                  <span className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4" />২. ওপেনগ্রাফ সোশ্যাল শেয়ারিং (Facebook, WhatsApp, LinkedIn OG Cards)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                        OpenGraph টাইটেল (OG Title)
                      </label>
                      <input
                        type="text"
                        placeholder="PTENit – Complete IT Solutions & Skill Development Platform"
                        value={settingsForm.ogTitle || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, ogTitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                        OpenGraph টাইপ (OG Type)
                      </label>
                      <select
                        value={settingsForm.ogType || 'website'}
                        onChange={e => setSettingsForm({ ...settingsForm, ogType: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      >
                        <option value="website">website</option>
                        <option value="article">article</option>
                        <option value="business">business</option>
                        <option value="product">product</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      OpenGraph ডেসক্রিপশন (OG Description)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="ফেসবুক বা মেসেঞ্জারে লিংক শেয়ার করলে প্রদর্শিত বার্তা..."
                      value={settingsForm.ogDescription || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, ogDescription: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      OpenGraph সোশ্যাল শেয়ার ব্যানার ইমেজ ইউআরএল (1200x630px OG Image)
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={settingsForm.ogImageUrl || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, ogImageUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  {/* OG Image Live Preview Box */}
                  {settingsForm.ogImageUrl && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-sky-400 block">
                        📱 সোশ্যাল মিডিয়া প্রিভিউ ব্যানার (Social Preview Card)
                      </span>
                      <div className="w-full max-w-md h-44 rounded-xl overflow-hidden border border-slate-800 relative bg-slate-900">
                        <img
                          src={settingsForm.ogImageUrl}
                          alt="Social OG Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Twitter (X) & Canonical URL */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />৩. Twitter (X) কার্ডস & ক্যানোনিকাল ইউআরএল
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                        Twitter Card Type
                      </label>
                      <select
                        value={settingsForm.twitterCard || 'summary_large_image'}
                        onChange={e => setSettingsForm({ ...settingsForm, twitterCard: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      >
                        <option value="summary_large_image">summary_large_image (বড় ছবিসহ)</option>
                        <option value="summary">summary (ছোট ছবিসহ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                        Twitter / X Handle
                      </label>
                      <input
                        type="text"
                        placeholder="@ptenit_bd"
                        value={settingsForm.twitterHandle || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, twitterHandle: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      Canonical Site URL (ক্যানোনিকাল ডোমেইন)
                    </label>
                    <input
                      type="text"
                      placeholder="https://ptenit.com"
                      value={settingsForm.canonicalUrl || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, canonicalUrl: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">ডুপ্লিকেট ইনডেক্সিং রোধ করতে আপনার সাইটের অফিসিয়াল ক্যানোনিকাল ডোমেইন।</p>
                  </div>
                </div>

                {/* 4. Robots.txt & Schema Structured Data */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                  <span className="text-xs font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4" />৪. Robots.txt & Schema.org Structured Data (JSON-LD)
                  </span>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-800 dark:text-slate-200">
                      Robots.txt কাস্টম ইনস্ট্রাকশন
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.robotsTxt || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, robotsTxt: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Schema.org JSON-LD Structured Data
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const defaultSchema = JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "PTENit Solutions",
                            "url": settingsForm.canonicalUrl || "https://ptenit.com",
                            "logo": "https://ptenit.com/logo.png",
                            "contactPoint": {
                              "@type": "ContactPoint",
                              "telephone": settingsForm.phone || "+8801700000000",
                              "contactType": "customer service"
                            }
                          }, null, 2);
                          setSettingsForm({ ...settingsForm, structuredDataJson: defaultSchema });
                        }}
                        className="text-[11px] font-bold text-[#1DB954] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3" /> অটো ডেমো স্কিমা জেনারেট করুন
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={settingsForm.structuredDataJson || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, structuredDataJson: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-sky-300 font-mono text-xs focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                  <Save className="w-4.5 h-4.5" /> SEO ও মেটা ট্যাগ সেটিং সেভ করুন
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT METHODS SETUP */}
        {/* TAB 4: PAYMENT METHODS SETUP (Streamlined, Clear & Interactive) */}
        {activeAdminTab === 'payment_methods' && (
          <div className="space-y-5 font-bengali">
            {/* Top Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1DB954]" />
                    পেমেন্ট সিস্টেম ও মেথড সেটিংস
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/30">
                    {settingsForm.paymentAutomationMode === 'automated' ? '⚡ স্বয়ংক্রিয় গেটওয়ে সক্রিয়' : '📱 ম্যানুয়াল TrxID মোড সক্রিয়'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  বর্তমান ম্যানুয়াল TrxID পেমেন্ট, ভবিষ্যতের অটোমেটেড গেটওয়ে এবং ফুটারের পেমেন্ট মেথড লোগো সহজে পরিচালনা করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition shrink-0"
              >
                <Save className="w-3.5 h-3.5" /> সেটিংস সংরক্ষণ করুন
              </button>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-500" />
                পেমেন্ট মেথড ও সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              
              {/* SECTION 1: ভবিষ্যৎ ও বর্তমান পেমেন্ট সিস্টেম (Clear, Clean & Transparent) */}
              <div className="p-4 sm:p-6 rounded-2xl border-2 border-emerald-500/30 bg-white dark:bg-slate-900 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
                      <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        ভবিষ্যৎ ও বর্তমান পেমেন্ট সিস্টেম নির্বাচন
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      বর্তমানে ম্যানুয়াল TrxID দিয়ে শিক্ষার্থীদের ভর্তি করান। পরবর্তীতে যেকোনো সময় এক ক্লিকে মার্চেন্ট গেটওয়েতে অটোমেট করতে পারবেন।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowGatewayGuide(!showGatewayGuide)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer transition shrink-0"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {showGatewayGuide ? 'গাইড বন্ধ করুন' : 'কীভাবে অটোমেশন করবেন? (৪ ধাপ)'}
                  </button>
                </div>

                {/* Step-by-Step Automation Roadmap Drawer */}
                {showGatewayGuide && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-3">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      ভবিষ্যতে খুব সহজে পেমেন্ট অটোমেশন চালু করার ৪টি সহজ ধাপ:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">ধাপ ০১</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">মার্চেন্ট একাউন্ট নিন</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          বিকাশ মার্চেন্ট (PGW API) অথবা SSLCommerz / AamarPay-তে আবেদন করুন (ট্রেড লাইসেন্স ও ব্যাংক একাউন্ট লাগবে)।
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">ধাপ ০২</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">API Credentials সংগ্রহ</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          গেটওয়ের ড্যাশবোর্ড থেকে App Key, App Secret, Username ও Password অথবা Store ID সংগ্রহ করুন।
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">ধাপ ০৩</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">কী ইনপুট দিয়ে টেস্ট</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          নিচের অটোমেটেড গেটওয়ে বক্সে কীগুলো বসিয়ে "🔌 টেস্ট গেটওয়ে সংযোগ" বাটনে ক্লিক করে কানেকশন নিশ্চিত করুন।
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">ধাপ ০৪</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">মোড চালু করুন</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          "২. স্বয়ংক্রিয় গেটওয়ে মোড" সিলেক্ট করে "সেভ করুন" বাটনে চাপ দিলেই সাথে সাথে পুরো সাইটের পেমেন্ট অটোমেটিক হবে!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Two Clear Mode Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Manual Mode (Current Default) */}
                  <div
                    onClick={() => setSettingsForm({ ...settingsForm, paymentAutomationMode: 'manual' })}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                      (settingsForm.paymentAutomationMode || 'manual') === 'manual'
                        ? 'border-[#1DB954] bg-[#1DB954]/5 ring-1 ring-[#1DB954] shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          (settingsForm.paymentAutomationMode || 'manual') === 'manual'
                            ? 'border-[#1DB954] bg-[#1DB954]'
                            : 'border-slate-400 dark:border-slate-600'
                        }`}>
                          {(settingsForm.paymentAutomationMode || 'manual') === 'manual' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          ১. বর্তমান সিস্টেম (ম্যানুয়াল TrxID মোড)
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                        সুপারিশকৃত ও কার্যকর
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      শিক্ষার্থী আপনার বিকাশ/নগদ/রকেট নম্বরে টাকা পাঠিয়ে TrxID দেবে। আপনি অ্যাডমিন প্যানেল থেকে মিলিয়ে "Approved" দিলে কোর্স চালু হবে।
                    </p>

                    <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" /> কোনো ব্যাংকিং API বা জটিল ডকুমেন্টের প্রয়োজন নেই
                      </li>
                      <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" /> পার্সোনাল বা মার্চেন্ট যেকোনো নম্বরে টাকা নেওয়া যাবে
                      </li>
                      <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" /> ভুয়া অর্ডার বা পেমেন্ট চেক করার পূর্ণ নিয়ন্ত্রণ থাকবে
                      </li>
                    </ul>
                  </div>

                  {/* Card 2: Automated Gateway (Future Automation) */}
                  <div
                    onClick={() => setSettingsForm({ ...settingsForm, paymentAutomationMode: 'automated' })}
                    className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 relative ${
                      settingsForm.paymentAutomationMode === 'automated'
                        ? 'border-sky-500 bg-sky-500/5 ring-1 ring-sky-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          settingsForm.paymentAutomationMode === 'automated'
                            ? 'border-sky-500 bg-sky-500'
                            : 'border-slate-400 dark:border-slate-600'
                        }`}>
                          {settingsForm.paymentAutomationMode === 'automated' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                          ২. ভবিষ্যৎ সিস্টেম (স্বয়ংক্রিয় গেটওয়ে মোড)
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 shrink-0">
                        তাত্ক্ষণিক সক্রিয়
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      বিকাশ মার্চেন্ট API বা SSLCommerz এর মাধ্যমে শিক্ষার্থী পেমেন্ট করবে। সফল হলেই সাথে সাথে কোনো অ্যাডমিন অনুমোদন ছাড়াই কোর্স অ্যাক্টিভ হবে।
                    </p>

                    <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" /> শিক্ষার্থী পে করার সাথে সাথে অটোমেটিক অ্যাক্টিভেশন
                      </li>
                      <li className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" /> রাত-দিন ২৪ ঘণ্টা স্বয়ংক্রিয় ভেরিফিকেশন
                      </li>
                      <li className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium">
                        <Check className="w-3.5 h-3.5 shrink-0" /> কার্ড, ভিসা, মাস্টারকার্ড ও সকল ব্যাংকিং সাপোর্ট
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Gateway Configuration Fields (Active when Automated Mode is chosen or being configured) */}
                {settingsForm.paymentAutomationMode === 'automated' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-white">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-2">
                          <Sliders className="w-4 h-4" /> স্বয়ংক্রিয় গেটওয়ে নির্বাচন ও API Credentials
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          আপনার মার্চেন্ট পোর্টাল থেকে পাওয়া কীসমূহ এখানে লিখুন
                        </p>
                      </div>

                      {/* Sandbox vs Live toggle */}
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 font-bold">এনভায়রনমেন্ট:</span>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, gatewaySandboxMode: !settingsForm.gatewaySandboxMode })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                            settingsForm.gatewaySandboxMode !== false
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {settingsForm.gatewaySandboxMode !== false ? '🧪 স্যান্ডবক্স (টেস্ট মোড)' : '🚀 লাইভ প্রোডাকশন'}
                        </button>
                      </div>
                    </div>

                    {/* Gateway Selection Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'bkash_pgw', name: 'bKash PGW (মার্চেন্ট API)' },
                        { id: 'sslcommerz', name: 'SSLCommerz (All-in-one)' },
                        { id: 'aamarpay', name: 'AamarPay' },
                        { id: 'shurjopay', name: 'Shurjopay' },
                      ].map(gw => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, selectedGateway: gw.id as any })}
                          className={`p-2.5 rounded-xl text-center border text-xs font-bold transition cursor-pointer ${
                            (settingsForm.selectedGateway || 'bkash_pgw') === gw.id
                              ? 'border-sky-500 bg-sky-500/20 text-white shadow-sm'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                          }`}
                        >
                          {gw.name}
                        </button>
                      ))}
                    </div>

                    {/* bKash PGW Credentials */}
                    {(settingsForm.selectedGateway || 'bkash_pgw') === 'bkash_pgw' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">bKash App Key</label>
                          <input
                            type="text"
                            value={settingsForm.bkashAppKey || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, bkashAppKey: e.target.value })}
                            placeholder="key_live_..."
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">bKash App Secret</label>
                          <input
                            type="password"
                            value={settingsForm.bkashAppSecret || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, bkashAppSecret: e.target.value })}
                            placeholder="secret_live_..."
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">bKash Username</label>
                          <input
                            type="text"
                            value={settingsForm.bkashUsername || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, bkashUsername: e.target.value })}
                            placeholder="মার্চেন্ট ইউজারনেম"
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">bKash Password</label>
                          <input
                            type="password"
                            value={settingsForm.bkashPassword || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, bkashPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* SSLCommerz / Others Credentials */}
                    {(settingsForm.selectedGateway || 'bkash_pgw') !== 'bkash_pgw' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Store ID</label>
                          <input
                            type="text"
                            value={settingsForm.gatewayStoreId || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, gatewayStoreId: e.target.value })}
                            placeholder="যেমন: ptenit_store01"
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">Store Password / Secret Key</label>
                          <input
                            type="password"
                            value={settingsForm.gatewayStorePassword || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, gatewayStorePassword: e.target.value })}
                            placeholder="••••••••••••••••"
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Test Connection Button & Result */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={handleTestGatewayConnection}
                        disabled={isTestingGateway}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer transition disabled:opacity-50"
                      >
                        {isTestingGateway ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {isTestingGateway ? 'যাচাই করা হচ্ছে...' : '🔌 টেস্ট গেটওয়ে সংযোগ'}
                      </button>

                      {gatewayTestResult && (
                        <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          gatewayTestResult.success
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {gatewayTestResult.success ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {gatewayTestResult.message}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: ম্যানুয়াল পেমেন্ট নম্বর ও ব্যাংক তথ্য (বিকাশ, নগদ, রকেট) */}
              <div className="p-4 sm:p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    📱 মোবাইল ফাইনান্সিয়াল সার্ভিসেস (MFS) পেমেন্ট নম্বর
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    চেকআউট পেজে শিক্ষার্থীরা এই নম্বরগুলো দেখতে পাবে এবং এগুলোতে টাকা পাঠিয়ে TrxID প্রদান করবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>bKash নম্বর</span>
                      <span className="text-[10px] text-[#1DB954] font-semibold">Personal / Merchant</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      placeholder="যেমন: 01712345678"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Nagad নম্বর</span>
                      <span className="text-[10px] text-amber-500 font-semibold">Personal / Merchant</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      placeholder="যেমন: 01700000000"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Rocket নম্বর</span>
                      <span className="text-[10px] text-purple-500 font-semibold">Personal / Merchant</span>
                    </label>
                    <input
                      type="text"
                      value={settingsForm.rocketNumber || ''}
                      onChange={e => setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })}
                      placeholder="যেমন: 01900000000"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                {/* Bank Transfer Details (Optional) */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    🏦 ব্যাংক অ্যাকাউন্ট ট্রান্সফার বিবরণ (ঐচ্ছিক)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">ব্যাংকের নাম</label>
                      <input
                        type="text"
                        placeholder="যেমন: Dutch-Bangla Bank PLC"
                        value={settingsForm.bankName || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">একাউন্ট টাইটেল</label>
                      <input
                        type="text"
                        placeholder="যেমন: PTENIT IT SOLUTIONS"
                        value={settingsForm.bankAccountName || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankAccountName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">একাউন্ট নম্বর</label>
                      <input
                        type="text"
                        placeholder="যেমন: 2181100098765"
                        value={settingsForm.bankAccountNumber || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankAccountNumber: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">ব্রাঞ্চ ও রাউটিং</label>
                      <input
                        type="text"
                        placeholder="যেমন: Uttara Branch, Dhaka"
                        value={settingsForm.bankBranch || ''}
                        onChange={e => setSettingsForm({ ...settingsForm, bankBranch: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: ফুটার পেমেন্ট মেথড লোগো ম্যানেজার (Fixed Add, Delete, Restore & 1-Click Presets) */}
              <div className="p-4 sm:p-6 rounded-2xl border-2 border-[#1DB954]/30 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      💳 ফুটার পেমেন্ট মেথড লোগো ম্যানেজার (Footer Payment Logos)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      মোবাইল ও পিসিতে ওয়েবসাইটের ফুটারে প্রদর্শিত পেমেন্ট লোগো তালিকা পরিচালনা করুন।
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Toggle Add Logo Form Button */}
                    <button
                      type="button"
                      onClick={() => setShowAddLogoForm(!showAddLogoForm)}
                      className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {showAddLogoForm ? 'ফর্ম বন্ধ করুন' : '+ নতুন লোগো যোগ করুন'}
                    </button>

                    {/* Restore Default 8 Logos Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const defaultLogos = [
                          { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' as const, isActive: true },
                          { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' as const, isActive: true },
                          { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' as const, isActive: true },
                          { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' as const, isActive: true }
                        ];
                        setSettingsForm(prev => ({ ...prev, paymentLogos: defaultLogos }));
                        setLogoFeedback('ডিফল্ট ৮টি পেমেন্ট লোগো পুনরুদ্ধার করা হয়েছে!');
                        setTimeout(() => setLogoFeedback(null), 3000);
                      }}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer transition shrink-0"
                      title="ডিফল্ট ৮টি লোগো আবার ফিরিয়ে আনুন"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      ডিফল্ট লোগো রিস্টোর
                    </button>
                  </div>
                </div>

                {/* Feedback Notification */}
                {logoFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {logoFeedback}
                  </div>
                )}

                {/* Inline Add Logo Form (Fully works in iframe without prompt) */}
                {showAddLogoForm && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#1DB954]" /> নতুন পেমেন্ট মেথড লোগো যোগ করুন
                      </h4>
                      <span className="text-[10px] text-slate-400">নাম ও লোগো ইমেজ দিয়ে "যুক্ত করুন" চাপুন</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          পেমেন্ট মেথডের নাম *
                        </label>
                        <input
                          type="text"
                          value={newLogoName}
                          onChange={e => setNewLogoName(e.target.value)}
                          placeholder="যেমন: City Bank, Cellfin, PayPal"
                          className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          লোগো ছবি (ইমেজ URL অথবা ডিভাইস থেকে আপলোড) *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newLogoUrl}
                            onChange={e => setNewLogoUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                          />
                          <label className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl cursor-pointer shrink-0 flex items-center gap-1 border border-slate-300 dark:border-slate-700">
                            <Upload className="w-3.5 h-3.5" />
                            <span>আপলোড</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageFileUpload(e, url => setNewLogoUrl(url))}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Preview & Submit Button */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        {newLogoUrl && (
                          <div className="w-10 h-7 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-300 dark:border-slate-700 flex items-center justify-center">
                            <img src={newLogoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                          </div>
                        )}
                        <span className="text-[11px] text-slate-500">
                          {newLogoName ? `নাম: ${newLogoName}` : 'নাম লিখুন ও ছবি নির্বাচন করুন'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!newLogoName.trim()) {
                            alert('দয়া করে পেমেন্ট মেথডের নাম লিখুন!');
                            return;
                          }
                          if (!newLogoUrl.trim()) {
                            alert('দয়া করে লোগোর ছবি দিন অথবা আপলোড করুন!');
                            return;
                          }

                          const currentLogos = settingsForm.paymentLogos && settingsForm.paymentLogos.length > 0
                            ? settingsForm.paymentLogos
                            : [
                                { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' as const, isActive: true },
                                { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' as const, isActive: true },
                                { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' as const, isActive: true },
                                { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' as const, isActive: true },
                                { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' as const, isActive: true },
                                { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' as const, isActive: true },
                                { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' as const, isActive: true },
                                { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' as const, isActive: true }
                              ];

                          const updated = [
                            ...currentLogos,
                            {
                              id: `pay-${Date.now()}`,
                              name: newLogoName.trim(),
                              logoUrl: newLogoUrl.trim(),
                              type: newLogoType,
                              isActive: true
                            }
                          ];

                          setSettingsForm(prev => ({ ...prev, paymentLogos: updated }));
                          setNewLogoName('');
                          setNewLogoUrl('');
                          setShowAddLogoForm(false);
                          setLogoFeedback(`"${newLogoName}" সফলভাবে যুক্ত করা হয়েছে!`);
                          setTimeout(() => setLogoFeedback(null), 3000);
                        }}
                        className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                      >
                        <Check className="w-3.5 h-3.5" /> লোগো যুক্ত করুন
                      </button>
                    </div>
                  </div>
                )}

                {/* 1-Click Popular Presets */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    ⚡ ১-ক্লিকে জনপ্রিয় লোগো যোগ করুন (ক্লিক করলেই যুক্ত হবে):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'bKash', url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' },
                      { name: 'Nagad', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' },
                      { name: 'Rocket', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' },
                      { name: 'Upay', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' },
                      { name: 'Visa', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' },
                      { name: 'MasterCard', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' },
                      { name: 'Amex', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/640px-American_Express_logo_%282018%29.svg.png', type: 'card' },
                      { name: 'DBBL Nexus', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' },
                      { name: 'Islami Bank', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' },
                      { name: 'City Bank', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/City_Bank_%28Bangladesh%29_logo.svg/640px-City_Bank_%28Bangladesh%29_logo.svg.png', type: 'bank' },
                      { name: 'PayPal', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/640px-PayPal.svg.png', type: 'card' },
                    ].map(preset => {
                      const currentList = settingsForm.paymentLogos || [];
                      const exists = currentList.some(p => p.name.toLowerCase() === preset.name.toLowerCase());
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            const list = settingsForm.paymentLogos && settingsForm.paymentLogos.length > 0
                              ? settingsForm.paymentLogos
                              : [
                                  { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' as const, isActive: true },
                                  { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' as const, isActive: true },
                                  { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' as const, isActive: true },
                                  { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' as const, isActive: true },
                                  { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' as const, isActive: true },
                                  { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' as const, isActive: true },
                                  { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' as const, isActive: true },
                                  { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' as const, isActive: true }
                                ];

                            const foundIndex = list.findIndex(p => p.name.toLowerCase() === preset.name.toLowerCase());
                            let updatedList;
                            if (foundIndex >= 0) {
                              updatedList = list.map((p, idx) => idx === foundIndex ? { ...p, isActive: true } : p);
                              setLogoFeedback(`"${preset.name}" সক্রিয় করা হয়েছে!`);
                            } else {
                              updatedList = [
                                ...list,
                                {
                                  id: `pay-${Date.now()}-${preset.name.toLowerCase()}`,
                                  name: preset.name,
                                  logoUrl: preset.url,
                                  type: preset.type as any,
                                  isActive: true
                                }
                              ];
                              setLogoFeedback(`"${preset.name}" সফলভাবে যুক্ত করা হয়েছে!`);
                            }
                            setSettingsForm(prev => ({ ...prev, paymentLogos: updatedList }));
                            setTimeout(() => setLogoFeedback(null), 3000);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                            exists
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1DB954]'
                          }`}
                        >
                          <Plus className="w-3 h-3 text-[#1DB954]" />
                          <span>{preset.name}</span>
                          {exists && <span className="text-[9px] text-[#1DB954] font-black">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* List of Current Logos (Direct Delete without broken prompt) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold">
                      বর্তমানে যুক্ত লোগো তালিকা (মোট: {(settingsForm.paymentLogos && settingsForm.paymentLogos.length > 0 ? settingsForm.paymentLogos : [1,2,3,4,5,6,7,8]).length}টি):
                    </span>
                    <span className="text-[11px] text-slate-400">
                      সক্রিয় টিক দিয়ে অন/অফ করুন অথবা ডিলিট বাটনে চাপ দিন
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {(settingsForm.paymentLogos && settingsForm.paymentLogos.length > 0
                      ? settingsForm.paymentLogos
                      : [
                          { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' as const, isActive: true },
                          { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' as const, isActive: true },
                          { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' as const, isActive: true },
                          { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' as const, isActive: true },
                          { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' as const, isActive: true }
                        ]
                    ).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 transition ${
                          item.isActive !== false
                            ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                            : 'bg-slate-100/60 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-7 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                            <img
                              src={item.logoUrl}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as any).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize block truncate">
                              {item.type || 'Gateway'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 dark:border-slate-800 text-xs">
                          <label className="flex items-center gap-1.5 text-[11px] font-bold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.isActive !== false}
                              onChange={(e) => {
                                const currentList = settingsForm.paymentLogos && settingsForm.paymentLogos.length > 0
                                  ? settingsForm.paymentLogos
                                  : [
                                      { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' as const, isActive: true },
                                      { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' as const, isActive: true },
                                      { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' as const, isActive: true },
                                      { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' as const, isActive: true },
                                      { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' as const, isActive: true },
                                      { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' as const, isActive: true },
                                      { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' as const, isActive: true },
                                      { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' as const, isActive: true }
                                    ];

                                const updated = currentList.map(p =>
                                  p.id === item.id ? { ...p, isActive: e.target.checked } : p
                                );
                                setSettingsForm(prev => ({ ...prev, paymentLogos: updated }));
                              }}
                              className="accent-[#1DB954] w-3.5 h-3.5"
                            />
                            <span className={item.isActive !== false ? 'text-[#1DB954]' : 'text-slate-400'}>
                              {item.isActive !== false ? 'সক্রিয়' : 'লুকানো'}
                            </span>
                          </label>

                          {/* Direct Working Delete Button without blocked prompt/confirm */}
                          <button
                            type="button"
                            onClick={() => {
                              const currentList = settingsForm.paymentLogos && settingsForm.paymentLogos.length > 0
                                ? settingsForm.paymentLogos
                                : [
                                    { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png', type: 'mfs' as const, isActive: true },
                                    { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png', type: 'mfs' as const, isActive: true },
                                    { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png', type: 'mfs' as const, isActive: true },
                                    { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png', type: 'mfs' as const, isActive: true },
                                    { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', type: 'card' as const, isActive: true },
                                    { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png', type: 'card' as const, isActive: true },
                                    { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png', type: 'bank' as const, isActive: true },
                                    { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png', type: 'bank' as const, isActive: true }
                                  ];

                              const updated = currentList.filter(p => p.id !== item.id);
                              setSettingsForm(prev => ({ ...prev, paymentLogos: updated }));
                              setLogoFeedback(`"${item.name}" সফলভাবে মুছে ফেলা হয়েছে!`);
                              setTimeout(() => setLogoFeedback(null), 3000);
                            }}
                            className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer transition"
                            title="লোগো মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Submit Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition"
                >
                  <Save className="w-4 h-4" /> পেমেন্ট সেটিংস সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        )}
        {/* TAB: PLATFORM FEE & COMMISSION RATE CONTROLLER */}
        {activeAdminTab === 'fee_commission' && (
          <div className="space-y-6 font-bengali">
            {/* Top Header Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 bg-slate-900 border border-slate-800 p-3.5 sm:p-5 rounded-2xl shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                    <Percent className="w-5 h-5 text-[#1DB954]" /> কমিশন কনফিগারেশন
                  </h2>
                </div>
                <p className="text-[11px] text-slate-400">
                  মার্কেটপ্লেস, এস্ক্রো ও ট্রেইনার ফি সেটিংস।
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                <span className="text-xs font-bold text-slate-400">প্রিসেট:</span>
                {[
                  { label: '৫%', val: 5, bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40' },
                  { label: '১০%', val: 10, bg: 'bg-emerald-500/20 text-[#1DB954] border-emerald-500/40' },
                  { label: '১৫%', val: 15, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
                  { label: '২০%', val: 20, bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
                ].map(preset => (
                  <button
                    key={preset.val}
                    onClick={() => {
                      setMktCommissionRate(preset.val);
                      setFeeSaveSuccess(true);
                      setTimeout(() => setFeeSaveSuccess(false), 3000);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer transition ${
                      mktCommissionRate === preset.val ? preset.bg + ' ring-1 ring-[#1DB954]' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {feeSaveSuccess && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 text-[#1DB954] font-black rounded-2xl text-xs flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>প্ল্যাটফর্ম ফি & কমিশন সেটিংস সফলভাবে সেভ ও কার্যকর হয়েছে!</span>
                </div>
                <span className="text-[11px] font-mono bg-emerald-950/60 px-2.5 py-1 rounded-lg">LIVE RATE: {mktCommissionRate}%</span>
              </div>
            )}

            {/* Core Commission Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Card 1: Marketplace & Escrow Commission */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-purple-400" />
                    <span>মার্কেটপ্লেস ও এস্ক্রো প্রজেক্ট কমিশন</span>
                  </h3>
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs font-black rounded-lg border border-purple-500/30">
                    ১০% ডিফল্ট
                  </span>
                </div>

                {/* Marketplace Commission Slider & Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <label>এডমিন প্ল্যাটফর্ম কমিশন রেট (%)</label>
                    <span className="text-lg font-black text-[#1DB954]">{mktCommissionRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={mktCommissionRate}
                    onChange={(e) => setMktCommissionRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>০% (ফ্রি)</span>
                    <span>২৫% (মিডিয়াম)</span>
                    <span>৫০% (সর্বোচ্চ)</span>
                  </div>
                </div>

                {/* Auto Ratio Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-emerald-500/20">
                    <p className="text-[11px] text-slate-400 font-bold">এডমিন নিট কমিশন</p>
                    <p className="text-xl font-black text-[#1DB954] mt-1">{mktCommissionRate}%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">প্রতিটি অর্ডারে প্ল্যাটফর্ম আয়</p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/20">
                    <p className="text-[11px] text-slate-400 font-bold">সেলার / ফ্রিল্যান্সার পে</p>
                    <p className="text-xl font-black text-amber-400 mt-1">{100 - mktCommissionRate}%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">ফ্রিল্যান্সারের প্রাপ্য পেআউট</p>
                  </div>
                </div>

                {/* Additional Marketplace Fees */}
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-300">
                      ক্লায়েন্ট অর্ডার চেকআউট ফি (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={15}
                        step={0.5}
                        value={clientProcessingFeePercent}
                        onChange={(e) => setClientProcessingFeePercent(Number(e.target.value) || 0)}
                        className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:outline-none focus:border-[#1DB954]"
                      />
                      <span className="text-xs font-bold text-slate-400 shrink-0">% অতিরিক্ত</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">ক্লায়েন্ট পেমেন্ট করার সময় এই % গেটওয়ে ফি যুক্ত হবে।</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-300">
                      ফ্রিল্যান্সার উইথড্রয়াল প্রসেসিং ফি (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.5}
                        value={freelancerWithdrawalFeePercent}
                        onChange={(e) => setFreelancerWithdrawalFeePercent(Number(e.target.value) || 0)}
                        className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:outline-none focus:border-[#1DB954]"
                      />
                      <span className="text-xs font-bold text-slate-400 shrink-0">% চার্জ</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">বিকাশ/নগদ/ব্যাংক উইথড্রয়াল রিকোয়েস্টে এই % ফি স্বয়ংক্রিয়ভাবে কাটা হবে।</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Academy Course & Trainer Revenue Share */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1DB954]" />
                    <span>একাডেমি কোর্স ও ট্রেইনার রেভিনিউ শেয়ার</span>
                  </h3>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-[#1DB954] text-xs font-black rounded-lg border border-emerald-500/30">
                    ৯০:১০ রেশিও
                  </span>
                </div>

                {/* Trainer Share Slider & Input */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <label>ইনস্ট্রাক্টর / ট্রেইনার শেয়ার (%)</label>
                    <span className="text-lg font-black text-emerald-400">{trainerRevShareRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={1}
                    value={trainerRevShareRate}
                    onChange={(e) => setTrainerRevShareRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>৫০% (সমান শেয়ার)</span>
                    <span>৭৫%</span>
                    <span>১০০% (ফুল ট্রেইনার পে)</span>
                  </div>
                </div>

                {/* Ratio Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-emerald-500/20">
                    <p className="text-[11px] text-slate-400 font-bold">ট্রেইনার এনরোলমেন্ট আয়</p>
                    <p className="text-xl font-black text-emerald-400 mt-1">{trainerRevShareRate}%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">কোর্স বিক্রির টাকা থেকে প্রাপ্য</p>
                  </div>
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-sky-500/20">
                    <p className="text-[11px] text-slate-400 font-bold">একাডেমি প্ল্যাটফর্ম মার্জিন</p>
                    <p className="text-xl font-black text-sky-400 mt-1">{100 - trainerRevShareRate}%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">একাডেমি প্ল্যাটফর্ম রক্ষণাবেক্ষণ</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>স্বয়ংক্রিয় এস্ক্রো ও কমিশন সুরক্ষা</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    এই রেট পরিবর্তন করলে ভবিষ্যতের সকল নতুন কোর্স ভর্তি এবং সার্ভিস অর্ডার স্বয়ংক্রিয়ভাবে নতুন পার্সেন্টেজ অনুযায়ী ক্যালকুলেট ও এস্ক্রোতে জমা হবে।
                  </p>
                </div>
              </div>

            </div>

            {/* LIVE INTERACTIVE REVENUE SIMULATOR */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 border border-slate-800 p-6 rounded-3xl space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>লাইভ রেভিনিউ & কমিশন সিমুলেটর (Live Interactive Simulator)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    যেকোনো প্রজেক্ট ভ্যালু লিখে রিয়েল-টাইমে প্ল্যাটফর্ম কমিশন ও সেলার আর্নিং পরীক্ষা করুন
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">সিমুলেশন এমাউন্ট:</span>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">৳</span>
                    <input
                      type="number"
                      step={500}
                      min={100}
                      value={feeSimulatorAmount}
                      onChange={(e) => setFeeSimulatorAmount(Number(e.target.value) || 0)}
                      className="w-32 pl-7 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Result Cards */}
              {(() => {
                const sampleAmount = feeSimulatorAmount || 0;
                const clientFee = Math.round(sampleAmount * (clientProcessingFeePercent / 100));
                const totalClientPaid = sampleAmount + clientFee;
                const adminCommission = Math.round(sampleAmount * (mktCommissionRate / 100));
                const sellerGross = Math.round(sampleAmount * ((100 - mktCommissionRate) / 100));
                const withdrawalFee = Math.round(sellerGross * (freelancerWithdrawalFeePercent / 100));
                const sellerNet = sellerGross - withdrawalFee;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold">১. বায়ার / ক্লায়েন্ট মোট দেবে</span>
                      <p className="text-xl font-black text-white">৳{totalClientPaid.toLocaleString('bn-BD')}</p>
                      <p className="text-[10px] text-slate-500">মূল: ৳{sampleAmount.toLocaleString('bn-BD')} + ফি: ৳{clientFee}</p>
                    </div>

                    <div className="bg-slate-950/80 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold">২. এডমিন প্ল্যাটফর্ম আয় ({mktCommissionRate}%)</span>
                      <p className="text-xl font-black text-[#1DB954]">৳{adminCommission.toLocaleString('bn-BD')}</p>
                      <p className="text-[10px] text-emerald-400/80">নেট প্রফিট মার্জিন</p>
                    </div>

                    <div className="bg-slate-950/80 border border-amber-500/30 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold">৩. সেলার এস্ক্রো পেআউট ({100 - mktCommissionRate}%)</span>
                      <p className="text-xl font-black text-amber-400">৳{sellerGross.toLocaleString('bn-BD')}</p>
                      <p className="text-[10px] text-amber-400/80">সেলার আর্নিং ব্যালেন্স</p>
                    </div>

                    <div className="bg-slate-950/80 border border-sky-500/30 p-4 rounded-2xl space-y-1">
                      <span className="text-[10px] text-sky-400 font-bold">৪. সেলার নিট উইথড্রয়াল</span>
                      <p className="text-xl font-black text-sky-400">৳{sellerNet.toLocaleString('bn-BD')}</p>
                      <p className="text-[10px] text-sky-400/80">উইথড্র ফি বাদ দেওয়ার পর</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Save Action */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setMktCommissionRate(10);
                  setTrainerRevShareRate(90);
                  setClientProcessingFeePercent(0);
                  setFreelancerWithdrawalFeePercent(1.5);
                  setFeeSaveSuccess(true);
                  setTimeout(() => setFeeSaveSuccess(false), 3000);
                }}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl cursor-pointer transition-all"
              >
                ডিফল্ট ১০% রিস্টোর করুন
              </button>
              <button
                onClick={() => {
                  setFeeSaveSuccess(true);
                  setTimeout(() => setFeeSaveSuccess(false), 3000);
                  alert(`ফি ও কমিশন সেটিংস সফলভাবে সেভ হয়েছে!\n• মার্কেটপ্লেস কমিশন: ${mktCommissionRate}%\n• ট্রেইনার শেয়ার: ${trainerRevShareRate}%\n• ক্লায়েন্ট ফি: ${clientProcessingFeePercent}%\n• উইথড্রয়াল চার্জ: ${freelancerWithdrawalFeePercent}%`);
                }}
                className="px-7 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-2xl flex items-center gap-2 cursor-pointer shadow-xl transition-all"
              >
                <Save className="w-4 h-4" />
                <span>ফি & কমিশন কনফিগারেশন সেভ করুন</span>
              </button>
            </div>

          </div>
        )}

        {/* TAB: FINANCIALS & ESCROW LEDGER */}
        {activeAdminTab === 'financials' && (() => {
          const totalMktOrders = marketplaceOrders.length;
          const completedMktOrders = marketplaceOrders.filter(o => o.status === 'completed');
          const deliveredMktOrders = marketplaceOrders.filter(o => o.status === 'delivered');
          const inProgressMktOrders = marketplaceOrders.filter(o => o.status === 'in_progress');
          const pendingMktOrders = marketplaceOrders.filter(o => o.status === 'pending' || !['completed', 'delivered', 'in_progress', 'cancelled'].includes(o.status));

          const completedRate = totalMktOrders > 0 ? Math.round((completedMktOrders.length / totalMktOrders) * 100) : 100;
          const deliveredRate = totalMktOrders > 0 ? Math.round((deliveredMktOrders.length / totalMktOrders) * 100) : 0;
          const inProgressRate = totalMktOrders > 0 ? Math.round((inProgressMktOrders.length / totalMktOrders) * 100) : 0;
          const pendingRate = totalMktOrders > 0 ? Math.round((pendingMktOrders.length / totalMktOrders) * 100) : 0;

          const totalMktVolume = marketplaceOrders.reduce((s, m) => s + (m.amount || (m as any).price || 0), 0);
          const totalAdminCommission = marketplaceOrders.reduce((s, m) => s + (m.adminCommission || ((m.amount || (m as any).price || 0) * 0.1)), 0);
          const totalSellerPayout = marketplaceOrders.reduce((s, m) => s + (m.sellerPayout || ((m.amount || (m as any).price || 0) * 0.9)), 0);
          const totalEscrowHold = marketplaceOrders.filter(m => m.status !== 'completed').reduce((s, m) => s + (m.amount || (m as any).price || 0), 0);
          const escrowHoldPercent = totalMktVolume > 0 ? Math.round((totalEscrowHold / totalMktVolume) * 100) : 0;
          const escrowReleasedPercent = 100 - escrowHoldPercent;

          return (
            <div className="space-y-6 font-bengali">
              {/* Top Banner */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-[#1DB954]" /> মার্কেটপ্লেস ফিনান্সিয়ালস & কাজের অগ্রগতি পার্সেন্টেজ (%)
                    </h2>
                  </div>
                  <p className="text-xs text-slate-300">
                    মার্কেটপ্লেসের সমস্ত প্রজেক্ট ও গিগ অর্ডারের কাজের সফলতার শতকরা হার (%), ১০% প্ল্যাটফর্ম কমিশন, ৯০% সেলার পেআউট ও এস্ক্রো লেজার রিপোর্ট।
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alert('মার্কেটপ্লেস কাজের পার্সেন্টেজ ও ফিনান্সিয়াল স্টেটমেন্ট ডাউনলোড সফল হয়েছে!')}
                    className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <FileText className="w-4 h-4" /> <span>স্টেটমেন্ট ডাউনলোড</span>
                  </button>
                </div>
              </div>

              {/* WORK COMPLETION PERCENTAGE & PROGRESS BANNER */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span>মার্কেটপ্লেসে কাজের শতকরা অগ্রগতি ও সফলতার হার (%)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ক্লায়েন্টদের দেওয়া সমস্ত প্রজেক্টের রিয়েল-টাইম কাজের স্ট্যাটাস ও পার্সেন্টেজ ব্রেকডাউন
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 bg-[#1DB954]/20 border border-emerald-500/40 text-[#1DB954] text-xs font-black rounded-xl">
                      সার্বিক সমাপ্তির হার: {completedRate}%
                    </span>
                  </div>
                </div>

                {/* Multi-Segment Visual Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                      সম্পন্ন কাজ: {completedRate}% ({completedMktOrders.length} টি)
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                      ডেলিভার্ড / রিভিউ: {deliveredRate}% ({deliveredMktOrders.length} টি)
                    </span>
                    <span className="flex items-center gap-1.5 text-sky-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                      কাজ চলছে: {inProgressRate}% ({inProgressMktOrders.length} টি)
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      অপেক্ষারত: {pendingRate}% ({pendingMktOrders.length} টি)
                    </span>
                  </div>

                  {/* Stacked Progress Bar */}
                  <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 p-0.5 shadow-inner">
                    <div
                      style={{ width: `${completedRate}%` }}
                      className="bg-gradient-to-r from-emerald-500 to-[#1DB954] h-full rounded-l-full transition-all duration-500"
                      title={`সম্পন্ন কাজ: ${completedRate}%`}
                    />
                    <div
                      style={{ width: `${deliveredRate}%` }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                      title={`ডেলিভার্ড: ${deliveredRate}%`}
                    />
                    <div
                      style={{ width: `${inProgressRate}%` }}
                      className="bg-gradient-to-r from-sky-400 to-blue-500 h-full transition-all duration-500"
                      title={`কাজ চলছে: ${inProgressRate}%`}
                    />
                    <div
                      style={{ width: `${pendingRate}%` }}
                      className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-r-full transition-all duration-500"
                      title={`অপেক্ষারত: ${pendingRate}%`}
                    />
                  </div>
                </div>

                {/* 4-Column Percentage Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="bg-slate-950/70 border border-emerald-500/20 p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                      <span>✅ ১০০% সম্পন্ন প্রজেক্ট</span>
                      <span className="text-emerald-400 font-black text-sm">{completedRate}%</span>
                    </div>
                    <p className="text-xl font-black text-emerald-400 mt-1">{completedMktOrders.length} টি কাজ</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${completedRate}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-purple-500/20 p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                      <span>📦 ডেলিভারি / রিভিউ (৮৫%)</span>
                      <span className="text-purple-400 font-black text-sm">{deliveredRate}%</span>
                    </div>
                    <p className="text-xl font-black text-purple-400 mt-1">{deliveredMktOrders.length} টি কাজ</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-400 h-full rounded-full" style={{ width: `${deliveredRate}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-sky-500/20 p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                      <span>⚡ চলমান প্রজেক্ট (৬০%)</span>
                      <span className="text-sky-400 font-black text-sm">{inProgressRate}%</span>
                    </div>
                    <p className="text-xl font-black text-sky-400 mt-1">{inProgressMktOrders.length} টি কাজ</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-sky-400 h-full rounded-full" style={{ width: `${inProgressRate}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-amber-500/20 p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                      <span>⏳ কিউ / অপেক্ষারত (২৫%)</span>
                      <span className="text-amber-400 font-black text-sm">{pendingRate}%</span>
                    </div>
                    <p className="text-xl font-black text-amber-400 mt-1">{pendingMktOrders.length} টি কাজ</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pendingRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Ledger Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-bold">মোট মার্কেটপ্লেস ভ্যালু</p>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md font-bold">১০০% ভলিউম</span>
                  </div>
                  <p className="text-2xl font-black text-white">
                    ৳{totalMktVolume.toLocaleString('bn-BD')}
                  </p>
                  <p className="text-[11px] text-slate-400">সর্বমোট ক্লায়েন্ট প্রজেক্ট বুকিং</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-bold">মার্কেটপ্লেস কমিশন</p>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-[#1DB954] rounded-md font-black">১০% ফিক্সড</span>
                  </div>
                  <p className="text-2xl font-black text-[#1DB954]">
                    ৳{totalAdminCommission.toLocaleString('bn-BD')}
                  </p>
                  <p className="text-[11px] text-emerald-400">এডমিন নেট প্ল্যাটফর্ম আর্নিং</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-bold">এস্ক্রো ওয়ালেট (হোল্ড)</p>
                    <span className="text-[10px] px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded-md font-bold">{escrowHoldPercent}% প্রটেক্টেড</span>
                  </div>
                  <p className="text-2xl font-black text-sky-400">
                    ৳{totalEscrowHold.toLocaleString('bn-BD')}
                  </p>
                  <p className="text-[11px] text-sky-400">কাজ শেষ হলে অটো-রিলিজ হবে</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-400 font-bold">ফ্রিল্যান্সার / সেলার শেয়ার</p>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-md font-black">৯০% পেআউট</span>
                  </div>
                  <p className="text-2xl font-black text-amber-400">
                    ৳{totalSellerPayout.toLocaleString('bn-BD')}
                  </p>
                  <p className="text-[11px] text-amber-400">সেলার ও এজেন্সিদের প্রাপ্য মোট অর্থ</p>
                </div>
              </div>

              {/* Recent Marketplace Escrow Transactions & Work % Progress Table */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <span>প্রজেক্ট ও এস্ক্রো লেজার রেকর্ডস (কাজের % অগ্রগতি সহ)</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">
                    মোট এন্ট্রি: {marketplaceOrders.length} টি
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">ট্রানজ্যাকশন ID & প্রজেক্ট</th>
                        <th className="p-3">বায়ার</th>
                        <th className="p-3">সেলার / ফ্রিল্যান্সার</th>
                        <th className="p-3">মোট ভ্যালু</th>
                        <th className="p-3">কাজের অগ্রগতি (%)</th>
                        <th className="p-3">১০% এডমিন কমিশন</th>
                        <th className="p-3">৯০% সেলার পেআউট</th>
                        <th className="p-3">এস্ক্রো স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {marketplaceOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-500">
                            কোনো এস্ক্রো ট্রানজ্যাকশন বা প্রজেক্ট রেকর্ড পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        marketplaceOrders.map(m => {
                          const orderAmt = m.amount || (m as any).price || 0;
                          const commAmt = m.adminCommission || Math.round(orderAmt * 0.1);
                          const sellerAmt = m.sellerPayout || Math.round(orderAmt * 0.9);

                          // Work percentage based on status
                          let jobProgressPercent = 25;
                          let progressLabel = '২৫% অর্ডার গৃহীত';
                          let progressColor = 'bg-amber-400 text-amber-400';
                          let progressBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

                          if (m.status === 'completed') {
                            jobProgressPercent = 100;
                            progressLabel = '১০০% সম্পন্ন (সম্পূর্ণ)';
                            progressColor = 'bg-emerald-400 text-emerald-400';
                            progressBg = 'bg-emerald-500/20 text-[#1DB954] border-emerald-500/30';
                          } else if (m.status === 'delivered') {
                            jobProgressPercent = 85;
                            progressLabel = '৮৫% ফাইল ডেলিভার্ড';
                            progressColor = 'bg-purple-400 text-purple-400';
                            progressBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                          } else if (m.status === 'in_progress') {
                            jobProgressPercent = 60;
                            progressLabel = '৬০% কাজ চলমান';
                            progressColor = 'bg-sky-400 text-sky-400';
                            progressBg = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
                          } else if (m.status === 'cancelled') {
                            jobProgressPercent = 0;
                            progressLabel = '০% বাতিল';
                            progressColor = 'bg-rose-400 text-rose-400';
                            progressBg = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                          }

                          return (
                            <tr key={m.id} className="hover:bg-slate-800/40">
                              <td className="p-3">
                                <span className="font-mono text-[10px] text-slate-500 block">#{m.id.slice(0, 10)}</span>
                                <span className="font-bold text-white block mt-0.5 line-clamp-1">{m.gigTitle || m.serviceTitle || 'কাস্টম আইটি প্রজেক্ট'}</span>
                              </td>
                              <td className="p-3 font-bold text-slate-200">{m.buyerName || m.clientName || 'ক্লায়েন্ট'}</td>
                              <td className="p-3 text-slate-300">{m.sellerName || 'পিটেন আইটি টিম'}</td>
                              <td className="p-3 font-black text-white">৳{orderAmt.toLocaleString('bn-BD')}</td>
                              <td className="p-3 min-w-[140px]">
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[10px] font-bold">
                                    <span className={progressColor.split(' ')[1]}>{progressLabel}</span>
                                    <span className="text-white font-mono">{jobProgressPercent}%</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${progressColor.split(' ')[0]}`}
                                      style={{ width: `${jobProgressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-bold text-[#1DB954]">
                                ৳{commAmt.toLocaleString('bn-BD')}
                                <span className="text-[9px] text-emerald-400 block font-normal">(১০%)</span>
                              </td>
                              <td className="p-3 font-bold text-amber-400">
                                ৳{sellerAmt.toLocaleString('bn-BD')}
                              </td>
                              <td className="p-3">
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${progressBg}`}>
                                  {m.status === "completed" ? "রিলিজড" : m.status === "delivered" ? "ডেলিভার্ড" : m.status === "cancelled" ? "বাতিল" : "এস্ক্রোতে সংরক্ষিত"}
                                </span>
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
          );
        })()}
          </main>
        </div>
      </div>
    </div>
  );
};
