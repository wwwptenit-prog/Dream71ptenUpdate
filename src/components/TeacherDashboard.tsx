import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Briefcase,
  FileCheck,
  Users,
  PlusCircle,
  Clock,
  CheckCircle,
  CheckCircle2,
  Award,
  Upload,
  User,
  Send,
  Sparkles,
  FileText,
  Calendar,
  Layers,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Trash2,
  Check,
  Search,
  Filter,
  Video,
  Play,
  X,
  Plus,
  FileVideo,
  ExternalLink,
  Eye,
  Download,
  Film,
  CreditCard,
  DollarSign,
  Bell,
  Wallet,
  Target,
  Globe,
  LogOut,
  Settings,
  Lock,
  Moon,
  Sun,
  Shield,
  Phone,
  Save,
  Image,
  Pencil,
  MoreVertical,
  Zap
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Assignment, AssignmentSubmission } from '../types';

interface TeacherDashboardProps {
  onViewCourse?: (courseId: string) => void;
  setActiveTab?: (tab: string) => void;
  initialTab?: 'courses' | 'certificates' | 'assignments' | 'payments' | 'profile' | 'students';
  openCreateAssignmentModal?: boolean;
  onCloseCreateAssignmentModal?: () => void;
  hideHeader?: boolean;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onViewCourse,
  setActiveTab,
  initialTab,
  openCreateAssignmentModal,
  onCloseCreateAssignmentModal,
  hideHeader
}) => {
  const {
    currentUser,
    users = [],
    courses = [],
    enrollments = [],
    certificates = [],
    assignments = [],
    submissions = [],
    payouts = [],
    teacherNotices = [],
    notifications = [],
    markNotificationRead,
    markAllNotificationsRead,
    requestTeacherPayout,
    addAssignment,
    deleteAssignment,
    gradeSubmission,
    updateProfile,
    updateCourse,
    issueCertificate,
    acceptCourseOffer,
    declineCourseOffer,
    logout,
    t,
    lang,
    setLang,
    darkMode,
    toggleDarkMode
  } = useData();

  const [activeTab, setActiveTabState] = useState<'courses' | 'certificates' | 'assignments' | 'payments' | 'profile' | 'students'>(initialTab || 'courses');

  useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (openCreateAssignmentModal) {
      if (courses.length > 0) setSelectedCourseId(courses[0].id);
      setShowCreateModal(true);
    }
  }, [openCreateAssignmentModal, courses]);
  
  // Certificate Issue State
  const [certStudentId, setCertStudentId] = useState('');
  const [certCourseId, setCertCourseId] = useState(courses[0]?.id || '');
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  // Payment Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [payoutsList, setPayoutsList] = useState([
    { id: 'W-9081', date: '2026-07-28', amount: 12500, method: 'bKash (01712***89)', paymentMethod: 'bKash', accountNumber: '01712000089', status: 'Approved' },
    { id: 'W-8812', date: '2026-07-15', amount: 8000, method: 'Nagad (01812***34)', paymentMethod: 'Nagad', accountNumber: '01812000034', status: 'Approved' },
  ]);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [isEditPayoutModalOpen, setIsEditPayoutModalOpen] = useState(false);
  const [openTeacherPayoutMenuId, setOpenTeacherPayoutMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setOpenTeacherPayoutMenuId(null);
    };
    if (openTeacherPayoutMenuId) {
      window.addEventListener('click', handleGlobalClick);
      return () => window.removeEventListener('click', handleGlobalClick);
    }
  }, [openTeacherPayoutMenuId]);

  const [editingPayoutItem, setEditingPayoutItem] = useState<{ id: string; amount: number; paymentMethod: string; accountNumber: string } | null>(null);
  const [editPayoutAmount, setEditPayoutAmount] = useState<number>(0);
  const [editPayoutMethod, setEditPayoutMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [editPayoutAccount, setEditPayoutAccount] = useState('');
  
  // Assignment Creation Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [asgnTitle, setAsgnTitle] = useState('');
  const [asgnDesc, setAsgnDesc] = useState('');
  const [asgnDueDate, setAsgnDueDate] = useState('');
  const [asgnPoints, setAsgnPoints] = useState('50');
  const [asgnAttachmentName, setAsgnAttachmentName] = useState('');
  const [asgnAttachmentUrl, setAsgnAttachmentUrl] = useState('');

  // Course Video Upload & Module Manager Modal state
  const [selectedManageCourseId, setSelectedManageCourseId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonModuleId, setLessonModuleId] = useState('');
  const [newModuleName, setNewModuleName] = useState('');
  const [lessonVideoType, setLessonVideoType] = useState<'url' | 'file'>('url');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonVideoFileName, setLessonVideoFileName] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15:00 min');
  const [lessonResourceName, setLessonResourceName] = useState('');
  const [lessonResourceUrl, setLessonResourceUrl] = useState('');
  const [lessonSuccessMsg, setLessonSuccessMsg] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Grading Modal state
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradePoints, setGradePoints] = useState<number>(0);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileTitle, setProfileTitle] = useState(currentUser?.title || 'সিনিয়র ইনস্ট্রাক্টর');
  const [profilePhone, setProfilePhone] = useState(currentUser?.mobile || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || 'PTENit-এর অভিজ্ঞ ট্রেইনার ও আইটি বিশেষজ্ঞ।');
  const [profileInstitution, setProfileInstitution] = useState(currentUser?.institution || 'PTENit IT Academy');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Search/Filter state for assignments
  const [searchQuery, setSearchQuery] = useState('');

  // Notification dismissal state
  const [isPolicyDismissed, setIsPolicyDismissed] = useState(false);
  const [isOfferNoticeDismissed, setIsOfferNoticeDismissed] = useState(false);

  // Notification and Message Filtering & Preferences Toggle State
  const [teacherNotifToggles, setTeacherNotifToggles] = useState({
    admin: true,       // 👑 এডমিন নোটিশ
    expert: true,      // ⚡ এক্সপার্ট/ট্রেইনার আপডেট
    student: true,     // 🎓 স্টুডেন্ট সাবমিশন
    system: true       // ⚙️ সিস্টেম নোটিফিকেশন
  });
  const [teacherMsgToggles, setTeacherMsgToggles] = useState({
    admin: true,       // 📩 এডমিন মেসেজ
    support: true,     // 🎧 কাস্টমার/ক্লায়েন্ট সাপোর্ট
    student: true      // 🎓 স্টুডেন্ট চ্যাট
  });

  // Profile Section Popups, Policy Directives, and Full View Modals
  const [showTeacherNotifPop, setShowTeacherNotifPop] = useState(false);
  const [showTeacherMsgPop, setShowTeacherMsgPop] = useState(false);
  const [showDirectivesModal, setShowDirectivesModal] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const [activeChatSender, setActiveChatSender] = useState<string>('PTENit Admin');

  // Profile Settings Modal State
  const [showTeacherSettingsModal, setShowTeacherSettingsModal] = useState(false);
  const [settingsSubTab, setSettingsSubTab] = useState<'profile' | 'payout' | 'security' | 'preferences'>('profile');
  const [settingsPassword, setSettingsPassword] = useState({ old: '', new: '', confirm: '' });
  const [settingsPasswordSaved, setSettingsPasswordSaved] = useState(false);
  const [settingsPayoutMethod, setSettingsPayoutMethod] = useState('bkash');
  const [settingsPayoutNumber, setSettingsPayoutNumber] = useState(currentUser?.mobile || '01700000000');
  const [settingsPayoutSaved, setSettingsPayoutSaved] = useState(false);

  const [chatInputText, setChatInputText] = useState('');
  const [chatImageInput, setChatImageInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [chatAttachedFile, setChatAttachedFile] = useState<{ name: string; url: string; type?: string } | null>(null);
  const chatFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [teacherChatList, setTeacherChatList] = useState([
    {
      id: '1',
      sender: 'PTENit Admin',
      text: 'নতুন সেমিস্টার কোর্স কনটেন্ট আপডেট নির্দেশিকা: সম্মানিত ট্রেইনারবৃন্দ, দয়া করে আগামী ব্যাচের মডিউল ও কুইজসমূহ আগামী ১৫ আগস্টের মধ্যে টিচার ড্যাশবোর্ডে আপলোড নিশ্চিত করুন।',
      time: '10:30 AM',
      isTeacher: false,
      read: false,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      sender: 'অ্যাকাডেমিক ক্লায়েন্ট সাপোর্ট',
      text: 'স্যার, ক্লায়েন্ট সার্ভিসেস ও বিশেষ ট্রেনিং সেশনের তালিকা শিট সংযুক্ত করা হয়েছে। বিস্তারিত দেখতে ইমেজে ক্লিক করুন।',
      time: '11:15 AM',
      isTeacher: false,
      read: false,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  // Combined Teacher Notifications State (Includes Student Assignment Submissions & Admin Notices)
  const [teacherNotificationsList, setTeacherNotificationsList] = useState([
    {
      id: 'notif-asgn-1',
      title: 'নতুন অ্যাসাইনমেন্ট জমা ও কমেন্ট (আরিফ হোসেন)',
      message: 'শিক্ষার্থী আরিফ হোসেন "PTE Speaking Describe Image Task Practice" অ্যাসাইনমেন্ট জমা ও কমেন্ট করেছেন: "স্যার আমার ডেসক্রাইব ইমেজ টাস্কের ফাইল ও প্র্যাকটিস নোট জমা দিয়েছি, ফিডব্যাক ও রিভিউ রিপ্লাই দিলে কৃতজ্ঞ থাকবো।"',
      time: '৫ মিনিট আগে',
      read: false,
      type: 'assignment',
      assignmentId: 'asgn-1',
      submissionId: 'sub-1',
      studentName: 'আরিফ হোসেন'
    },
    {
      id: 'notif-asgn-2',
      title: 'অ্যাসাইনমেন্ট ২ উত্তরপত্র জমা (রাফসান)',
      message: 'শিক্ষার্থী রাফসান "React Components & Tailwind Layout" অ্যাসাইনমেন্টে ফাইল আপলোড করে প্রশ্ন কমেন্ট জমা দিয়েছেন।',
      time: '২৫ মিনিট আগে',
      read: false,
      type: 'assignment',
      assignmentId: 'asgn-2',
      submissionId: 'sub-2',
      studentName: 'রাফসান'
    },
    {
      id: 'notif-admin-1',
      title: 'PTENit এডমিন অফিশিয়াল গাইডলাইন নোটিশ',
      message: 'সম্মানিত কোর্স ইনস্ট্রাক্টরবৃন্দ, নতুন ব্যাচের মডিউল, লেকচার স্লাইড ও কুইজ সম্পর্কিত নির্দেশিকা প্রকাশ করা হলো।',
      time: '১ ঘন্টা আগে',
      read: false,
      type: 'admin'
    },
    {
      id: 'notif-admin-2',
      title: 'ক্লাস শিডিউল ও রেজাল্ট সিস্টেম আপডেট',
      message: 'আগামী সেমিস্টারের ক্লাস রুটিং টিচার প্যানেলে যুক্ত করা হয়েছে।',
      time: '২ ঘন্টা আগে',
      read: false,
      type: 'admin'
    }
  ]);

  // Sound Synthesizer for Notifications & Offer Actions
  const playChimeSound = (type: 'notification' | 'accept' | 'decline' = 'notification') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      if (type === 'notification') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.12); // A5
        gain2.gain.setValueAtTime(0.25, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.6);
      } else if (type === 'accept') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.45);
        });
      } else if (type === 'decline') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const [hasPlayedOfferSound, setHasPlayedOfferSound] = useState(false);

  // File Upload Handler (Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, setName?: (name: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (setName) setName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Video Upload Handler
  const handleAddVideoLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourse = courses.find(c => c.id === selectedManageCourseId);
    if (!targetCourse || !lessonTitle.trim()) return;

    let currentModules = targetCourse.modules ? [...targetCourse.modules] : [];
    let targetModuleId = lessonModuleId;

    // Create module if "new" is selected or no modules exist
    if (!targetModuleId || targetModuleId === 'new' || currentModules.length === 0) {
      const modTitle = newModuleName.trim() || `মডিউল ${currentModules.length + 1}: ক্লাস ভিডিও সিরিজ`;
      const newModuleObj = {
        id: `mod-${Date.now()}`,
        courseId: targetCourse.id,
        title: modTitle,
        lessons: [],
        order: currentModules.length + 1
      };
      currentModules.push(newModuleObj);
      targetModuleId = newModuleObj.id;
    }

    const finalVideoUrl = lessonVideoUrl.trim() || "https://www.youtube.com/embed/dQw4w9WgXcQ";

    const newLessonObj = {
      id: `les-${Date.now()}`,
      courseId: targetCourse.id,
      moduleId: targetModuleId,
      title: lessonTitle.trim(),
      duration: lessonDuration.trim() || '15 mins',
      videoUrl: finalVideoUrl,
      pdfResourceUrl: lessonResourceUrl || undefined,
      content: lessonResourceName ? `নোটস: ${lessonResourceName}` : undefined,
      isFreePreview: false,
      order: Date.now()
    };

    currentModules = currentModules.map(m => {
      if (m.id === targetModuleId) {
        return {
          ...m,
          lessons: [...(m.lessons || []), newLessonObj]
        };
      }
      return m;
    });

    const totalLessons = currentModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

    updateCourse(targetCourse.id, {
      modules: currentModules,
      lessonsCount: totalLessons
    });

    setLessonTitle('');
    setLessonVideoUrl('');
    setLessonVideoFileName('');
    setLessonResourceName('');
    setLessonResourceUrl('');
    setNewModuleName('');
    setLessonSuccessMsg('নতুন ক্লাস ভিডিও সফলভাবে আপলোড করা হয়েছে!');
    setTimeout(() => setLessonSuccessMsg(''), 3500);
  };

  const handleDeleteLesson = (courseId: string, moduleId: string, lessonId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const updatedModules = course.modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: (m.lessons || []).filter(l => l.id !== lessonId)
        };
      }
      return m;
    });

    const totalLessons = updatedModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

    updateCourse(courseId, {
      modules: updatedModules,
      lessonsCount: totalLessons
    });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgnTitle || !selectedCourseId) return;

    const courseObj = courses.find(c => c.id === selectedCourseId);

    addAssignment({
      courseId: selectedCourseId,
      courseTitle: courseObj?.title || 'General Course',
      instructorId: currentUser?.id,
      title: asgnTitle,
      description: asgnDesc,
      dueDate: asgnDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalPoints: Number(asgnPoints) || 50,
      attachmentName: asgnAttachmentName,
      attachmentUrl: asgnAttachmentUrl
    });

    setAsgnTitle('');
    setAsgnDesc('');
    setAsgnDueDate('');
    setAsgnAttachmentName('');
    setAsgnAttachmentUrl('');
    setShowCreateModal(false);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission) {
      gradeSubmission(selectedSubmission.id, gradePoints, gradeFeedback);
      setSelectedSubmission(null);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      title: profileTitle,
      mobile: profilePhone,
      bio: profileBio,
      institution: profileInstitution,
      avatar: profileAvatar
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleIssueCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudentId || !certCourseId) return;
    const newCert = issueCertificate(certStudentId, certCourseId);
    if (newCert) {
      setCertSuccessMsg(`সার্টিফিকেটটি সফলভাবে তৈরি করা হয়েছে! সার্টিফিকেট কোড: ${newCert.certificateCode}`);
      setTimeout(() => setCertSuccessMsg(''), 5000);
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0 || !withdrawAccount) return;

    if (requestTeacherPayout) {
      requestTeacherPayout({
        teacherId: currentUser?.id || 'teacher-1',
        teacherName: currentUser?.name || 'তানভীর আহমেদ',
        teacherEmail: currentUser?.email || 'teacher@ptenit.com',
        amount: amt,
        paymentMethod: withdrawMethod === 'bkash' ? 'bKash' : withdrawMethod === 'nagad' ? 'Nagad' : 'Bank Transfer',
        accountNumber: withdrawAccount,
        note: 'ইনস্ট্রাক্টর ক্যাশআউট উইথড্র রিকোয়েস্ট'
      });
    }

    setWithdrawAmount('');
    setWithdrawAccount('');
    setWithdrawSuccessMsg('উইথড্র রিকোয়েস্ট সফলভাবে জমা দেওয়া হয়েছে! এডমিন যাচাই শেষে আপনার একাউন্টে টাকা পৌছে যাবে।');
    setTimeout(() => setWithdrawSuccessMsg(''), 5000);
  };

  // Offered & Active Courses - show all admin course offers to trainers
  const offeredCourses = courses.filter(c => c.offerStatus === 'offered');

  const teacherCourses = courses.filter(c =>
    c.offerStatus === 'accepted' ||
    (!c.offerStatus && (currentUser?.name?.includes("তানভীর") || c.instructor?.includes("তানভীর") || c.instructor === currentUser?.name))
  );
  const pendingSubmissions = submissions.filter(s => s.status === 'submitted');
  const totalGraded = submissions.filter(s => s.status === 'graded');

  const filteredAssignments = assignments.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 py-4 sm:py-8 transition-colors font-bengali">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">

        {/* Teacher Profile Header Banner & Menubar (Hidden when hideHeader is true) */}
        {!hideHeader && (
          <>
        {/* Teacher Profile Header Banner */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-[#142B4D] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-teal-500/20 mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
            <div className="relative group shrink-0">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                alt={currentUser?.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-2 sm:border-4 border-teal-400/40 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1DB954] border-2 border-slate-900 flex items-center justify-center text-xs text-white shadow-md" title="Active Teacher">
                ✓
              </span>
            </div>

            <div className="space-y-1.5 flex-1 w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-3xl font-black text-white">{currentUser?.name}</h1>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> স্পেশালিস্ট ড্যাশবোর্ড
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">{currentUser?.title || 'ইনস্ট্রাক্টর ও কোর্স মেন্টর'}</p>
              <p className="text-slate-400 text-[11px] sm:text-xs">{currentUser?.institution || 'PTENit IT Training Academy'}</p>
            </div>

            {/* Action Suite: Controls, Directives, Notification, Message, Settings */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 font-bengali">
              
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all font-bold text-xs"
                title="ভাষা পরিবর্তন / Switch Language"
              >
                <Globe className="w-4 h-4 text-[#1DB954]" />
                <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
              </button>

              {/* Night Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 sm:p-3 bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center cursor-pointer transition-all text-xs"
                title={darkMode ? 'লাইট মোড অন করুন' : 'নাইট মোড অন করুন'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              </button>

              {/* Main Site Link */}
              <button
                onClick={() => setActiveTab?.('home')}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-teal-300 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all font-bold text-xs"
                title="মূল ওয়েবসাইট"
              >
                <Globe className="w-4 h-4 text-teal-400" />
                <span className="hidden md:inline">{t('হোম পেইজ', 'Home Page')}</span>
              </button>

              {/* Marketplace Projects Link */}
              <button
                onClick={() => setActiveTab?.('marketplace')}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 border border-[#1DB954] rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all font-black text-xs"
                title="মার্কেটপ্লেস ও ডেসপ্যাচ জবস"
              >
                <Briefcase className="w-4 h-4 text-slate-950" />
                <span className="hidden md:inline">মার্কেটপ্লেস জবস</span>
              </button>

              {/* Profile Policy & Directives Button */}
              <button
                onClick={() => setShowDirectivesModal(true)}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-teal-300 hover:text-teal-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                title="টিচার পলিসি ও এডমিন নির্দেশিকা"
              >
                <FileText className="w-4 h-4 text-teal-400" />
                <span className="hidden md:inline">পলিসি & নির্দেশিকা</span>
              </button>

              {/* Profile Notification Button & Floating Dock Window */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTeacherMsgPop(false);
                    setShowTeacherNotifPop(!showTeacherNotifPop);
                  }}
                  className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 hover:text-amber-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                  title="টিচার নোটিফিকেশন"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span className="hidden md:inline">নোটিফিকেশন</span>
                  {teacherNotificationsList.filter(n => !n.read).length > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse border border-slate-900">
                      {teacherNotificationsList.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Floating Facebook Lite / Messenger Style Notification Dock Window */}
                {showTeacherNotifPop && (
                  <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[460px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-amber-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                    {/* Header Bar */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/40">
                            <Bell className="w-4 h-4 text-amber-400" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>টিচার নোটিফিকেশন সেন্টার</span>
                            {teacherNotificationsList.filter(n => !n.read).length > 0 ? (
                              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                                {teacherNotificationsList.filter(n => !n.read).length} অপঠিত
                              </span>
                            ) : (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                                সব দেখা হয়েছে ✓
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-amber-400">এডমিন, ট্রেইনার ও স্টুডেন্ট অ্যাক্টিভিটি আপডেট</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          onClick={() => {
                            setTeacherNotificationsList(prev => prev.map(item => ({ ...item, read: true })));
                            markAllNotificationsRead?.();
                          }}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        >
                          সব পঠিত ✓
                        </button>
                        <button
                          onClick={() => setShowTeacherNotifPop(false)}
                          className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="বন্ধ করুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter & Toggle Controls Bar */}
                    <div className="p-2 bg-slate-950/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px] font-bold">
                      <span className="text-slate-400 shrink-0 px-1">ফিল্টার:</span>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, admin: !prev.admin }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.admin
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="এডমিন নোটিশ চালু/বন্ধ করুন"
                      >
                        <span>👑 এডমিন {teacherNotifToggles.admin ? '✓' : '✕'}</span>
                      </button>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, expert: !prev.expert }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.expert
                            ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="ট্রেইনার/এক্সপার্ট আপডেট চালু/বন্ধ করুন"
                      >
                        <span>⚡ এক্সপার্ট {teacherNotifToggles.expert ? '✓' : '✕'}</span>
                      </button>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, student: !prev.student }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.student
                            ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="স্টুডেন্ট অ্যাক্টিভিটি চালু/বন্ধ করুন"
                      >
                        <span>🎓 স্টুডেন্ট {teacherNotifToggles.student ? '✓' : '✕'}</span>
                      </button>
                      <button
                        onClick={() => setTeacherNotifToggles(prev => ({ ...prev, system: !prev.system }))}
                        className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                          teacherNotifToggles.system
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                        title="সিস্টেম অ্যালার্ট চালু/বন্ধ করুন"
                      >
                        <span>⚙️ সিস্টেম {teacherNotifToggles.system ? '✓' : '✕'}</span>
                      </button>
                    </div>

                    {/* Notification Items List */}
                    <div className="p-3 space-y-2.5 h-72 sm:h-96 overflow-y-auto bg-slate-950/50">
                      {teacherNotificationsList.filter(n => {
                        const type = (n as any).type || 'admin';
                        if (type === 'admin' && !teacherNotifToggles.admin) return false;
                        if (type === 'expert' && !teacherNotifToggles.expert) return false;
                        if (type === 'assignment' && !teacherNotifToggles.student) return false;
                        if (type === 'system' && !teacherNotifToggles.system) return false;
                        return true;
                      }).length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                          <Bell className="w-8 h-8 text-amber-500/40 mx-auto" />
                          <p className="text-xs text-slate-400">ফিল্টার ফিল্ড অনুযায়ী কোনো নোটিফিকেশন নেই।</p>
                        </div>
                      ) : (
                        teacherNotificationsList
                          .filter(n => {
                            const type = (n as any).type || 'admin';
                            if (type === 'admin' && !teacherNotifToggles.admin) return false;
                            if (type === 'expert' && !teacherNotifToggles.expert) return false;
                            if (type === 'assignment' && !teacherNotifToggles.student) return false;
                            if (type === 'system' && !teacherNotifToggles.system) return false;
                            return true;
                          })
                          .map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                setTeacherNotificationsList(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                markNotificationRead?.(n.id);
                                if (n.targetTab && n.targetTab !== 'teacher-dashboard' && setActiveTab) {
                                  setActiveTab(n.targetTab);
                                } else {
                                  setExpandedNotifId(prev => prev === n.id ? null : n.id);
                                }
                              }}
                              className={`p-3 rounded-2xl text-xs cursor-pointer transition-all ${
                                n.read
                                  ? 'bg-slate-800/40 border border-slate-800 text-slate-400'
                                  : 'bg-slate-800 border border-amber-500/30 text-white shadow-md'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1 gap-2">
                                <p className="font-bold text-white text-[12px] flex items-center gap-1.5 truncate">
                                  {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                                  {n.title}
                                </p>
                                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0 border border-amber-500/20">
                                  {expandedNotifId === n.id ? 'সংক্ষিপ্ত ▲' : 'বিস্তারিত ▼'}
                                </span>
                              </div>
                              <p className={`text-[11px] leading-relaxed ${expandedNotifId === n.id ? 'whitespace-pre-wrap text-slate-200' : 'line-clamp-2 text-slate-300'}`}>
                                {n.message}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
                                <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                                {(n as any).type === 'assignment' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveTabState('assignments');
                                      setShowTeacherNotifPop(false);
                                      const matched = submissions.find(s => s.id === (n as any).submissionId) || submissions[0];
                                      if (matched) {
                                        setSelectedSubmission(matched);
                                        setGradePoints(matched.points || 50);
                                        setGradeFeedback(matched.feedback || '');
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                                  >
                                    <FileCheck className="w-3.5 h-3.5" />
                                    <span>অ্যাসাইনমেন্টে যান</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Message Button & Attached Facebook Messenger-style Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTeacherNotifPop(false);
                    const nextState = !showTeacherMsgPop;
                    setShowTeacherMsgPop(nextState);
                    if (nextState) {
                      // Mark all unread messages as read when opening messenger
                      setTeacherChatList(prev => prev.map(m => ({ ...m, read: true })));
                    }
                  }}
                  className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-sky-300 hover:text-sky-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                  title="মেসেজ ও ইনবক্স"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span className="hidden md:inline">মেসেজ</span>
                  {teacherChatList.filter(m => !m.isTeacher && !m.read).length > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                      {teacherChatList.filter(m => !m.isTeacher && !m.read).length}
                    </span>
                  )}
                </button>

                {/* Floating Facebook Messenger / FB Lite Style Bottom Dock Window */}
                {showTeacherMsgPop && (
                  <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[440px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-sky-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                    {/* Hidden Native File Input for attaching any document/file/image */}
                    <input
                      type="file"
                      ref={chatFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setChatAttachedFile({
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

                    {/* Facebook Messenger Header Bar */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center border border-sky-500/40">
                            {activeChatSender === 'PTENit Admin' ? 'A' : 'C'}
                          </div>
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-slate-900 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{activeChatSender}</span>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">অনলাইন</span>
                          </h4>
                          <p className="text-[10px] text-sky-400">লাইভ চ্যাট & ডাইরেক্ট ইনবক্স</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          onClick={() => setTeacherChatList(prev => prev.map(m => ({ ...m, read: true })))}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                          title="সকল বার্তা পঠিত হিসেবে চিহ্নিত করুন"
                        >
                          সব পঠিত ✓
                        </button>
                        <button
                          onClick={() => setShowTeacherMsgPop(false)}
                          className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-all cursor-pointer"
                          title="বন্ধ করুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Sender Selector Bar with Full On/Off Toggles */}
                    <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto scrollbar-none">
                      {['PTENit Admin', 'অ্যাকাডেমিক ক্লায়েন্ট সাপোর্ট', 'শিক্ষার্থী কমিউনিটি'].map((sender) => {
                        const unreadCount = teacherChatList.filter(m => m.sender === sender && !m.isTeacher && !m.read).length;
                        return (
                          <button
                            key={sender}
                            onClick={() => {
                              setActiveChatSender(sender);
                              setTeacherChatList(prev => prev.map(m => m.sender === sender ? { ...m, read: true } : m));
                            }}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              activeChatSender === sender
                                ? 'bg-sky-500 text-slate-950 shadow'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <span>{sender}</span>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.2 text-[9px] bg-rose-600 text-white font-black rounded-full animate-pulse">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                        );
                      })}
                      
                      {/* On/Off Category Toggles */}
                      <button
                        onClick={() => setTeacherMsgToggles(prev => ({ ...prev, admin: !prev.admin }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                          teacherMsgToggles.admin ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="এডমিন বার্তা ফিল্টার অন/অফ"
                      >
                        এডমিন {teacherMsgToggles.admin ? '✓' : '✕'}
                      </button>
                      <button
                        onClick={() => setTeacherMsgToggles(prev => ({ ...prev, support: !prev.support }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                          teacherMsgToggles.support ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="সাপোর্ট বার্তা ফিল্টার অন/অফ"
                      >
                        সাপোর্ট {teacherMsgToggles.support ? '✓' : '✕'}
                      </button>
                      <button
                        onClick={() => setTeacherMsgToggles(prev => ({ ...prev, student: !prev.student }))}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                          teacherMsgToggles.student ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="স্টুডেন্ট বার্তা ফিল্টার অন/অফ"
                      >
                        স্টুডেন্ট {teacherMsgToggles.student ? '✓' : '✕'}
                      </button>
                    </div>

                    {/* Chat Thread Area */}
                    <div className="p-3 space-y-2.5 h-64 sm:h-72 overflow-y-auto bg-slate-950/50">
                      {teacherChatList
                        .filter(m => m.sender === activeChatSender || (m.isTeacher && m.text.includes(activeChatSender)))
                        .length === 0 ? (
                          <div className="text-center py-10 space-y-2">
                            <MessageSquare className="w-8 h-8 text-sky-500/40 mx-auto" />
                            <p className="text-xs text-slate-400">{activeChatSender}-এর সাথে চ্যাট শুরু করুন।</p>
                          </div>
                        ) : (
                          teacherChatList
                            .filter(m => m.sender === activeChatSender || (m.isTeacher && m.text.includes(activeChatSender)))
                            .map(msg => (
                              <div
                                key={msg.id}
                                onClick={() => {
                                  setTeacherChatList(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                                }}
                                className={`p-2.5 rounded-2xl text-xs space-y-1 cursor-pointer hover:opacity-95 transition-all max-w-[88%] ${
                                  msg.isTeacher
                                    ? 'bg-emerald-950/90 border border-emerald-500/30 text-emerald-100 ml-auto text-right'
                                    : 'bg-slate-800 border border-sky-500/30 text-slate-100 mr-auto text-left shadow-sm'
                                }`}
                              >
                                <div className="flex justify-between items-center gap-2">
                                  <span className="font-bold text-white text-[10px]">{msg.sender}</span>
                                  <span className="text-[9px] text-slate-400">{msg.time}</span>
                                </div>
                                <p className="text-[11px] leading-relaxed">{msg.text}</p>
                                {(msg as any).imageUrl && (
                                  <div className="mt-1 rounded-xl overflow-hidden border border-slate-700">
                                    <img
                                      src={(msg as any).imageUrl}
                                      alt="Attached file"
                                      className="w-full h-28 object-cover hover:scale-105 transition-transform"
                                    />
                                  </div>
                                )}
                                {(msg as any).fileName && (
                                  <a
                                    href={(msg as any).fileUrl || '#'}
                                    download={(msg as any).fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-1.5 p-2 bg-slate-900/90 rounded-xl border border-sky-500/40 flex items-center gap-2 hover:bg-slate-800 transition-all text-sky-300 text-[11px] font-semibold"
                                  >
                                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                                    <span className="truncate flex-1 font-mono">{(msg as any).fileName}</span>
                                    <Download className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                  </a>
                                )}
                              </div>
                            ))
                        )}
                    </div>

                    {/* Attached Local File Preview Bar */}
                    {chatAttachedFile && (
                      <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-sky-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate font-semibold text-[11px]">{chatAttachedFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setChatAttachedFile(null)}
                          className="text-slate-400 hover:text-white p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Input Footer */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!chatInputText.trim() && !chatAttachedFile) return;
                        const isImg = chatAttachedFile?.type?.startsWith('image/') || (chatAttachedFile?.name && /\.(jpg|jpeg|png|gif|webp)$/i.test(chatAttachedFile.name));
                        setTeacherChatList([
                          ...teacherChatList,
                          {
                            id: String(Date.now()),
                            sender: currentUser?.name || 'টিচার',
                            text: chatInputText.trim() ? `${chatInputText.trim()} (${activeChatSender}-কে)` : `ফাইল/ছবি সংযুক্ত বার্তা (${activeChatSender}-কে)`,
                            time: 'এখনই',
                            isTeacher: true,
                            read: true,
                            imageUrl: isImg ? chatAttachedFile?.url : undefined,
                            fileName: chatAttachedFile?.name,
                            fileUrl: chatAttachedFile?.url
                          }
                        ]);
                        setChatInputText('');
                        setChatAttachedFile(null);
                        playChimeSound('notification');
                      }}
                      className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-1.5"
                    >
                      <button
                        type="button"
                        onClick={() => chatFileInputRef.current?.click()}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          chatAttachedFile ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-sky-400 hover:bg-slate-700'
                        }`}
                        title="যে কোনো ফাইল বা ছবি (PDF, Doc, Image) যুক্ত করুন"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={chatInputText}
                        onChange={(e) => setChatInputText(e.target.value)}
                        placeholder={`${activeChatSender}-কে লিখুন...`}
                        className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-1 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">পাঠান</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Settings Option Button */}
              <button
                onClick={() => setShowTeacherSettingsModal(true)}
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 bg-slate-800/90 hover:bg-slate-700/90 text-emerald-300 hover:text-emerald-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all relative font-bold text-xs"
                title="প্রোফাইল সেটিং, অ্যাকাউন্ট ও সিকিউরিটি"
              >
                <Settings className="w-4 h-4 text-emerald-400" />
                <span>সেটিংস</span>
              </button>

              {/* Create Assignment CTA */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-[#1DB954] to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন অ্যাসাইনমেন্ট দিন</span>
              </button>
            </div>
          </div>

          {/* COMPACT ACTIVE COURSE OFFERS WIDGET (INSIDE PROFILE CARD) */}
          {offeredCourses.length > 0 && !isOfferNoticeDismissed && (
            <div className="mt-5 pt-4 border-t border-amber-500/30 font-bengali relative z-10">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <h3 className="text-xs sm:text-sm font-black text-amber-300 flex items-center gap-1.5">
                    📩 মেইন এডমিন থেকে প্রাপ্ত কোর্স অফারসমূহ ({offeredCourses.length} টি)
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    রিভিউ অপেক্ষমাণ
                  </span>
                </div>
                <button
                  onClick={() => setIsOfferNoticeDismissed(true)}
                  className="p-1 hover:bg-slate-800/80 text-amber-300/80 hover:text-white rounded-lg transition-all cursor-pointer"
                  title="অফার উইজেট বন্ধ করুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-2.5 transition-all ${
                offeredCourses.length > 2
                  ? 'max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-500/30'
                  : ''
              }`}>
                {offeredCourses.map(course => (
                  <div key={course.id} className="bg-slate-900/90 backdrop-blur-sm p-2.5 sm:p-3 rounded-2xl border border-amber-500/40 shadow-md flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <img src={course.thumbnail} alt={course.title} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-700" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {course.level === 'basic' ? '🟢 বেসিক' : course.level === 'advanced' ? '⚡ এডভান্সড' : course.level === 'professional' ? '🎓 প্রফেশনাল' : '📘 কোর্স'}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-300">
                            {course.category}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-white truncate">{course.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-300">
                          <span>মডিউল: {course.targetModules || 4}টি</span>
                          <span>ক্লাস: {course.targetLessons || 16}টি</span>
                          <span className="text-[#1DB954] font-bold">কমিশন: {course.teacherCommissionRate || 35}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          acceptCourseOffer(course.id, currentUser?.id, currentUser?.name);
                          playChimeSound('accept');
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] rounded-xl shadow flex items-center gap-1 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>গ্রহণ</span>
                      </button>
                      <button
                        onClick={() => {
                          declineCourseOffer(course.id);
                          playChimeSound('decline');
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 text-[11px] font-semibold rounded-xl cursor-pointer transition-all border border-slate-700"
                        title="প্রত্যাখ্যান করুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-700/60">
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মোট কোর্স</span>
              <span className="text-xl sm:text-2xl font-black text-teal-300">{teacherCourses.length} টি</span>
            </div>
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মোট অ্যাসাইনমেন্ট</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300">{assignments.length} টি</span>
            </div>
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মূল্যায়ন বাকি</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">{pendingSubmissions.length} টি</span>
            </div>
            <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
              <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">ইস্যুকৃত সার্টিফিকেট</span>
              <span className="text-xl sm:text-2xl font-black text-[#1DB954]">{certificates.length} টি</span>
            </div>
          </div>
        </div>

        {/* Full Dashboard Menubar with Header & Extensible Navigation Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">ইনস্ট্রাক্টর ড্যাশবোর্ড মেনুবার (Instructor Menubar):</span>
            </div>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">
              + মডিউল ও কোর্স ফ্রেমওয়ার্ক
            </span>
          </div>

          <div className="p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'courses', label: 'আমার পরিচালিত কোর্স', icon: BookOpen, badge: offeredCourses.length },
              { id: 'assignments', label: 'অ্যাসাইনমেন্ট ও ক্লাসরুম', icon: FileCheck, badge: pendingSubmissions.length },
              { id: 'students', label: 'শিক্ষার্থীবৃন্দ', icon: Users, badge: enrollments.length },
              { id: 'certificates', label: 'সার্টিফিকেট প্রদান', icon: Award, badge: certificates.length },
              { id: 'payments', label: 'পেমেন্ট ও ক্যাশআউট', icon: CreditCard },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabState(tab.id as any)}
                  className={`py-2.5 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {!!tab.badge && tab.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      isActive ? 'bg-white text-teal-900' : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
          </>
        )}

        {/* TAB 1: ASSIGNMENT CLASSROOM */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#1DB954]" /> অ্যাসাইনমেন্ট ম্যানেজমেন্ট ও গ্রেডিং
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  শিক্ষার্থীদের নতুন অ্যাসাইনমেন্ট ও জমা পড়া অ্যাসাইনমেন্ট ফাইল মূল্যায়ন করুন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (courses.length > 0) setSelectedCourseId(courses[0].id);
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>নতুন অ্যাসাইনমেন্ট</span>
                </button>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="খুঁজুন..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>
            </div>

            {/* Assignment Cards List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredAssignments.map(asgn => {
                const asgnSubmissions = submissions.filter(s => s.assignmentId === asgn.id);
                const pendingCount = asgnSubmissions.filter(s => s.status === 'submitted').length;

                return (
                  <div
                    key={asgn.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-5 hover:border-teal-500/40"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-500/20">
                          {asgn.courseTitle || 'সাধারণ কোর্স'}
                        </span>
                        <button
                          onClick={() => deleteAssignment(asgn.id)}
                          className="p-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{asgn.title}</h3>
                      <p className="text-xs text-slate-900 dark:text-white leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        {asgn.description}
                      </p>

                      {asgn.attachmentName && (
                        <div className="p-3 bg-teal-500/5 dark:bg-slate-800/80 rounded-2xl border border-teal-500/20 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Paperclip className="w-4 h-4 text-[#1DB954] shrink-0" />
                          <span className="font-bold truncate flex-1">{asgn.attachmentName}</span>
                          <a href={asgn.attachmentUrl} download={asgn.attachmentName} className="px-3 py-1 bg-[#1DB954] text-white font-bold rounded-lg text-xs hover:bg-emerald-600 transition-colors shrink-0">
                            ডাউনলোড
                          </a>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> ডেডলাইন: <strong className="text-slate-800 dark:text-slate-200">{asgn.dueDate}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Award className="w-3.5 h-3.5 text-amber-500" /> মোট নম্বর: <strong className="text-slate-800 dark:text-slate-200">{asgn.totalPoints}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Submissions Stats & Action Box */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4 text-[#1DB954]" /> জমাকৃত উত্তরপত্র ({asgnSubmissions.length} টি)
                        </span>
                        {pendingCount > 0 && (
                          <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] rounded-full border border-rose-500/30 animate-pulse">
                            {pendingCount} টি মূল্যায়ন বাকি
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 max-h-52 overflow-y-auto">
                        {asgnSubmissions.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-4 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">এখনো কোনো কাজ জমা দেওয়া হয়নি।</p>
                        ) : (
                          asgnSubmissions.map(sub => (
                            <div key={sub.id} className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm hover:border-[#1DB954]/40 transition-colors">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-slate-900 dark:text-white">{sub.studentName}</p>
                                  <span className="text-[10px] text-slate-400">({sub.studentEmail})</span>
                                </div>
                                <p className="text-[10px] text-slate-400">জমা: {sub.submittedAt}</p>
                                {sub.submissionText && (
                                  <p className="text-[11px] text-slate-900 dark:text-white line-clamp-1 italic bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                    "{sub.submissionText}"
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                                {sub.status === 'graded' ? (
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 bg-emerald-500/10 text-[#1DB954] text-[11px] font-black rounded-xl border border-emerald-500/30">
                                      {sub.points} / {asgn.totalPoints} পয়েন্ট
                                    </span>
                                    <button
                                      onClick={() => {
                                        setSelectedSubmission(sub);
                                        setGradePoints(sub.points || asgn.totalPoints);
                                        setGradeFeedback(sub.feedback || '');
                                      }}
                                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-[#1DB954]" />
                                      <span>ভিউ / এডিট</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setSelectedSubmission(sub);
                                      setGradePoints(asgn.totalPoints);
                                      setGradeFeedback('');
                                    }}
                                    className="w-full sm:w-auto px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md text-center flex items-center justify-center gap-1.5"
                                  >
                                    <Award className="w-3.5 h-3.5" />
                                    <span>মূল্যায়ন ও মার্কস দিন</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Issue Certificate Form */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1DB954]" /> নতুন সার্টিফিকেট ইস্যু করুন
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  কোর্স সম্পন্নকারী শিক্ষার্থীকে ভেরিফাইড কোর্স সার্টিফিকেট প্রদান করুন।
                </p>

                {certSuccessMsg && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{certSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleIssueCertificateSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">শিক্ষার্থী নির্বাচন করুন *</label>
                    <select
                      value={certStudentId}
                      onChange={e => setCertStudentId(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    >
                      <option value="">-- শিক্ষার্থী সিলেক্ট করুন --</option>
                      {users.filter(u => u.role === 'student' || !u.role).map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name} ({st.email || st.mobile || st.id})
                        </option>
                      ))}
                      <option value="stu-demo-1">কাজী সিয়াম (siam@gmail.com)</option>
                      <option value="stu-demo-2">রাকিবুল হাসান (rakib@gmail.com)</option>
                      <option value="stu-demo-3">সামিয়া সুলতানা (samiya@gmail.com)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">কোর্স নির্বাচন করুন *</label>
                    <select
                      value={certCourseId}
                      onChange={e => setCertCourseId(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>সার্টিফিকেট জেনারেট ও ইস্যু করুন</span>
                  </button>
                </form>
              </div>

              {/* Issued Certificates List */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> ইস্যুকৃত সার্টিফিকেট তালিকা ({certificates.length} টি)
                  </h3>
                </div>

                <div className="space-y-3">
                  {certificates.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">এখনো কোনো সার্টিফিকেট ইস্যু করা হয়নি।</p>
                  ) : (
                    certificates.map(cert => (
                      <div key={cert.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">{cert.studentName}</span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-[#1DB954] text-[10px] font-mono font-bold rounded border border-emerald-500/20">
                              {cert.certificateCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{cert.courseTitle}</p>
                          <span className="text-[11px] text-slate-400 block">ইস্যু ডেট: {cert.issueDate}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-[#1DB954]/10 text-[#1DB954] rounded-lg text-xs font-bold border border-[#1DB954]/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> ভেরিফাইড
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & EARNINGS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-emerald-500/30 shadow-md">
                <span className="text-slate-400 text-xs font-bold block">মোট অর্জিত সম্মানিয়াম</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">৳ ৪৮,৫০০ BDT</span>
                <span className="text-[10px] text-emerald-500 mt-1 block">✓ কোর্স বিক্রি ও মেন্টরিং শেয়ার</span>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-blue-500/30 shadow-md">
                <span className="text-slate-400 text-xs font-bold block">বর্তমান উইথড্রযোগ্য ব্যালেন্স</span>
                <span className="text-2xl font-black text-blue-400 mt-1 block">৳ ১৪,২০০ BDT</span>
                <span className="text-[10px] text-blue-400 mt-1 block">যেকোনো সময় ক্যাশআউট রিকোয়েস্ট দিতে পারবেন</span>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 p-5 rounded-2xl border border-purple-500/30 shadow-md">
                <span className="text-slate-400 text-xs font-bold block">সম্পন্নকৃত ক্যাশআউট (Paid)</span>
                <span className="text-2xl font-black text-purple-300 mt-1 block">৳ ৩৪,৩০০ BDT</span>
                <span className="text-[10px] text-purple-400 mt-1 block">বিকাশ/নগদ/ব্যাংকে পরিশোধিত</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Request Withdrawal Form */}
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#1DB954]" /> টাকা উইথড্র করুন
                </h3>

                {withdrawSuccessMsg && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{withdrawSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পেমেন্ট মেথড সিলেক্ট করুন</label>
                    <select
                      value={withdrawMethod}
                      onChange={e => setWithdrawMethod(e.target.value as any)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    >
                      <option value="bkash">bKash (বিকাশ পার্সোনাল)</option>
                      <option value="nagad">Nagad (নগদ পার্সোনাল)</option>
                      <option value="bank">Bank Transfer (ব্যাংক একাউন্ট)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">একাউন্ট/মোবাইল নম্বর *</label>
                    <input
                      type="text"
                      value={withdrawAccount}
                      onChange={e => setWithdrawAccount(e.target.value)}
                      placeholder="উদা: 018XXXXXXXX"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">উইথড্র পরিমাণ (টাকা) *</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      placeholder="সর্বনিম্ন ১,০০০ টাকা"
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>উইথড্র রিকোয়েস্ট সাবমিট করুন</span>
                  </button>
                </form>
              </div>

              {/* Withdrawal History Table */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" /> ক্যাশআউট হিস্টোরি ও ট্রানজেকশন
                </h3>

                {(() => {
                  const userContextPayouts = payouts.filter(p =>
                    !currentUser ||
                    p.teacherId === currentUser.id ||
                    (currentUser.name && p.teacherName?.toLowerCase().includes(currentUser.name.toLowerCase()))
                  );

                  const allPayoutRows = [
                    ...userContextPayouts.map(p => ({
                      id: p.id,
                      date: p.requestedAt,
                      amount: p.amount,
                      method: `${p.paymentMethod} (${p.accountNumber})`,
                      paymentMethod: p.paymentMethod,
                      accountNumber: p.accountNumber,
                      status: p.status,
                      isPending: p.status === 'Pending'
                    })),
                    ...payoutsList.filter(pl => !userContextPayouts.some(p => p.id === pl.id)).map(pl => ({
                      ...pl,
                      isPending: pl.status === 'Pending'
                    }))
                  ];

                  if (allPayoutRows.length === 0) {
                    return (
                      <div className="p-8 text-center text-slate-400 space-y-2">
                        <Wallet className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                        <p className="text-xs font-bold">কোনো উইথড্রয়াল হিস্টোরি পাওয়া যায়নি</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="p-3">আইডি</th>
                            <th className="p-3">তারিখ</th>
                            <th className="p-3">পরিমাণ</th>
                            <th className="p-3">মেথড</th>
                            <th className="p-3">স্ট্যাটাস</th>
                            <th className="p-3 text-right">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {allPayoutRows.map((pay, idx) => {
                            const isPending = pay.isPending || pay.status === 'Pending';
                            const isPaid = pay.status === 'Approved' || pay.status === 'Paid';
                            const openUpward = idx >= allPayoutRows.length - 2 && allPayoutRows.length > 2;

                            return (
                              <tr
                                key={pay.id}
                                className={`transition ${
                                  isPending
                                    ? 'bg-amber-500/5 hover:bg-amber-500/10 dark:bg-amber-950/20'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{pay.id}</td>
                                <td className="p-3 text-slate-400 whitespace-nowrap">{pay.date}</td>
                                <td className="p-3 font-bold text-[#1DB954] whitespace-nowrap">৳ {(pay.amount || 0).toLocaleString()} BDT</td>
                                <td className="p-3 whitespace-nowrap">{pay.method}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    isPending
                                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                      : isPaid
                                      ? 'bg-emerald-500/20 text-[#1DB954]'
                                      : 'bg-rose-500/20 text-rose-500'
                                  }`}>
                                    {isPending ? '⏳ প্রসেসিং / পেন্ডিং' : isPaid ? '✓ অনুমোদিত' : pay.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap relative">
                                  <div className="relative inline-block text-left">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenTeacherPayoutMenuId(openTeacherPayoutMenuId === pay.id ? null : pay.id);
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

                                    {openTeacherPayoutMenuId === pay.id && (
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
                                                setOpenTeacherPayoutMenuId(null);
                                                setEditingPayoutItem({
                                                  id: pay.id,
                                                  amount: pay.amount,
                                                  paymentMethod: pay.paymentMethod || 'bKash',
                                                  accountNumber: pay.accountNumber || ''
                                                });
                                                setEditPayoutAmount(pay.amount);
                                                setEditPayoutMethod(pay.paymentMethod === 'Nagad' ? 'nagad' : pay.paymentMethod === 'Bank' || pay.paymentMethod === 'Bank Transfer' ? 'bank' : 'bkash');
                                                setEditPayoutAccount(pay.accountNumber || '');
                                                setIsEditPayoutModalOpen(true);
                                              }}
                                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                                            >
                                              <Pencil className="w-3.5 h-3.5 text-blue-500" />
                                              <span>এডিট করুন</span>
                                            </button>
                                            <button
                                              onClick={() => {
                                                setOpenTeacherPayoutMenuId(null);
                                                if (confirm(`আপনি কি ৳${pay.amount.toLocaleString()} এর উইথড্রয়াল আবেদনটি বাতিল করতে চান?`)) {
                                                  setPayoutsList(prev => prev.filter(item => item.id !== pay.id));
                                                  alert('আপনার উইথড্রয়াল আবেদনটি সফলভাবে বাতিল করা হয়েছে।');
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
                                              <span>{isPaid ? 'অনুমোদিত' : 'স্ট্যাটাস চূড়ান্ত'}</span>
                                            </div>
                                            <div
                                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed select-none"
                                              title="অনুমোদিত হওয়ায় এডিট করা যাবে না"
                                            >
                                              <Lock className="w-3.5 h-3.5" />
                                              <span>এডিট (লকড)</span>
                                            </div>
                                            <div
                                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed select-none"
                                              title="অনুমোদিত হওয়ায় বাতিল করা যাবে না"
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
                  );
                })()}
              </div>
            </div>

            {/* Course Wise Commission Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" /> কোর্সভিত্তিক এডমিন নির্ধারিত কমিশন ও ইনকাম হিসাব
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">মেইন এডমিন দ্বারা সেটকৃত কমিশন হার অনুযায়ী আপনার প্রাপ্তি</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">কোর্সের নাম</th>
                      <th className="p-3">মূল্য (BDT)</th>
                      <th className="p-3">মোট ছাত্র</th>
                      <th className="p-3">এডমিন কমিশন %</th>
                      <th className="p-3">আপনার মোট অর্জিত সম্মানিয়াম</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {teacherCourses.map(course => {
                      const effectivePrice = course.discountPrice || course.price;
                      const commRate = course.teacherCommissionRate || 30;
                      const totalEarned = Math.round(effectivePrice * course.enrolledCount * (commRate / 100));

                      return (
                        <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{course.title}</td>
                          <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">৳ {(effectivePrice || 0).toLocaleString()}</td>
                          <td className="p-3 font-bold text-blue-500">{course.enrolledCount} জন</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] border border-emerald-500/20">
                              {commRate}% কমিশন
                            </span>
                          </td>
                          <td className="p-3 font-black text-[#1DB954]">৳ {(totalEarned || 0).toLocaleString()} BDT</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEACHER COURSES & VIDEO LESSONS */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* ADMIN COURSE OFFERS SECTION - RECEIVE OFFERS */}
            {offeredCourses.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/15 via-slate-900/90 to-amber-950/30 border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 font-bengali">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-amber-500/30">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping shrink-0" />
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                        <span>📩 মেইন এডমিন থেকে প্রাপ্ত কোর্স অফারসমূহ</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                          {offeredCourses.length}টি অফার অপেক্ষমাণ
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        এডমিন কর্তৃক আপনাকে নির্ধারিত কোর্সের অফার ও দায়িত্ব রিভিউ করুন এবং রিসিভ করে ক্লাস শুরু করুন।
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40 shrink-0">
                    ইনস্ট্যান্ট রিসিভ সুবিধাযুক্ত
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offeredCourses.map(course => (
                    <div
                      key={course.id}
                      className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-amber-500/40 shadow-md flex flex-col justify-between space-y-3 hover:border-amber-400 transition"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                                {course.level === 'basic' ? '🟢 বেসিক লেভেল' : course.level === 'advanced' ? '⚡ এডভান্সড লেভেল' : course.level === 'professional' ? '🎓 প্রফেশনাল' : '📘 কোর্স অফার'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                {course.category}
                              </span>
                            </div>
                            <h4 className="font-black text-sm text-slate-900 dark:text-white leading-snug line-clamp-2">
                              {course.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          {course.description}
                        </p>

                        {/* Admin Offer Breakdown */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 bg-amber-500/5 dark:bg-amber-950/20 rounded-xl border border-amber-500/20 text-center">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">মডিউল টার্গেট</span>
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                              {course.targetModules || 4}টি
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">ক্লাস টার্গেট</span>
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                              {course.targetLessons || 16}টি
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-bold">শিক্ষক কমিশন</span>
                            <span className="font-black text-xs text-emerald-600 dark:text-[#1DB954]">
                              {course.teacherCommissionRate || 35}% ফি
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: Accept / Decline */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            acceptCourseOffer(course.id, currentUser?.id, currentUser?.name);
                            playChimeSound('accept');
                          }}
                          className="flex-1 py-2 px-3 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 dark:text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950 dark:text-white" />
                          <span>রিসিভ করুন</span>
                        </button>
                        <button
                          onClick={() => {
                            declineCourseOffer(course.id);
                            playChimeSound('decline');
                          }}
                          className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 text-slate-600 dark:text-slate-300 hover:text-rose-500 font-bold text-xs rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>প্রত্যাখ্যান</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Film className="w-6 h-6 text-[#1DB954]" />
                  আমার পরিচালিত সক্রিয় কোর্সসমূহ ({teacherCourses.length} টি)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  যে সকল কোর্সের দায়িত্ব গ্রহণ করেছেন সেগুলোতে নতুন ভিডিও লেসন, ক্লাস মডিউল ও লেকচার নোটস সরাসরি আপলোড করুন।
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {teacherCourses.map(course => {
                const totalModules = course.modules?.length || 0;
                const totalVideos = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

                const targetModules = course.targetModules || 4;
                const targetLessons = course.targetLessons || 16;
                const commissionRate = course.teacherCommissionRate || 30;

                const moduleProgressPct = Math.min(100, Math.round((totalModules / targetModules) * 100));
                const lessonProgressPct = Math.min(100, Math.round((totalVideos / targetLessons) * 100));
                const isTargetComplete = totalModules >= targetModules && totalVideos >= targetLessons;

                return (
                  <div key={course.id} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[#1DB954] text-[11px] font-bold border border-[#1DB954]/30">
                          {course.category}
                        </span>
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 border border-slate-700">
                          <Video className="w-3.5 h-3.5 text-[#1DB954]" />
                          <span>{totalVideos} টি ভিডিও লেসন</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-3">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{course.description}</p>

                        {/* Upload Target & Admin Requirements Box */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <Target className="w-3.5 h-3.5 text-amber-500" />
                              কোর্স আপলোড টার্গেট
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isTargetComplete ? 'bg-emerald-500/20 text-[#1DB954]' : 'bg-amber-500/20 text-amber-500'
                            }`}>
                              {isTargetComplete ? '✓ টার্গেট সম্পূর্ণ' : '⏳ প্রোগ্রেস রানিং'}
                            </span>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            <div>
                              <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                                <span>মডিউল টার্গেট: <strong>{totalModules} / {targetModules}</strong> টি</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{moduleProgressPct}%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#1DB954] h-full transition-all duration-300" style={{ width: `${moduleProgressPct}%` }} />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-slate-500 dark:text-slate-400 mb-1">
                                <span>ক্লাস/ভিডিও টার্গেট: <strong>{totalVideos} / {targetLessons}</strong> টি</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{lessonProgressPct}%</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${lessonProgressPct}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400">এডমিন নির্ধারিত কমিশন:</span>
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold rounded-lg border border-emerald-500/20">
                              {commissionRate}% কমিশন
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-[#1DB954]" />
                            {totalModules} টি মডিউল
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                            {course.enrolledCount} এনরোল্ড
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 pt-0 space-y-2 mt-2">
                      <button
                        onClick={() => {
                          setSelectedManageCourseId(course.id);
                          if (course.modules && course.modules.length > 0) {
                            setLessonModuleId(course.modules[0].id);
                          } else {
                            setLessonModuleId('new');
                          }
                        }}
                        className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>ক্লাস ভিডিও ও মডিউল আপলোড করুন</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onViewCourse) onViewCourse(course.id);
                        }}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>কোর্স স্টুডেন্ট ভিউ দেখুন →</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ENROLLED STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">এনরোলকৃত শিক্ষার্থীবৃন্দ</h2>

            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3.5 sm:p-4">শিক্ষার্থীর আইডি</th>
                      <th className="p-3.5 sm:p-4">এনরোলমেন্ট নম্বর</th>
                      <th className="p-3.5 sm:p-4">কোর্স প্রোগ্রেস</th>
                      <th className="p-3.5 sm:p-4">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {enrollments.map(enr => (
                      <tr key={enr.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 sm:p-4 font-bold text-slate-900 dark:text-white">
                          শিক্ষার্থী #{enr.userId.slice(-4)}
                        </td>
                        <td className="p-3.5 sm:p-4 font-mono text-slate-400">{enr.id}</td>
                        <td className="p-3.5 sm:p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 sm:w-28 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#1DB954] h-full" style={{ width: `${enr.progress}%` }} />
                            </div>
                            <span className="font-bold">{enr.progress}%</span>
                          </div>
                        </td>
                        <td className="p-3.5 sm:p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            enr.status === 'completed' ? 'bg-emerald-500/20 text-[#1DB954]' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {enr.status === 'completed' ? 'সম্পন্ন' : 'রানিং'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TEACHER PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#1DB954]" /> টিচার প্রোফাইল এডিট
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                সরাসরি ডিভাইস থেকে ছবি আপলোড করে ইনস্ট্রাক্টর তথ্য আপডেট করুন।
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>টিচার প্রোফাইল সফলভাবে আপডেট হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={profileAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500/40 shadow-md shrink-0"
                />

                <div className="space-y-1.5 flex-1 w-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    প্রোফাইল ছবি পরিবর্তন (ফাইল আপলোড)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, setProfileAvatar)}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1DB954] file:text-white hover:file:bg-emerald-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block">গ্যালারি থেকে সরাসরি যেকোনো JPG/PNG ছবি আপলোড দিন।</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পদবী / টাইটেল</label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={e => setProfileTitle(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রতিষ্ঠান / একাডেমি</label>
                  <input
                    type="text"
                    value={profileInstitution}
                    onChange={e => setProfileInstitution(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সংক্ষিপ্ত বায়ো (Bio)</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                প্রোফাইল পরিবর্তন সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

        {/* CREATE ASSIGNMENT MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-[#142B4D] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4 font-bengali my-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#1DB954]" /> নতুন অ্যাসাইনমেন্ট তৈরি করুন
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">কোর্স নির্বাচন করুন</label>
                  <select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">অ্যাসাইনমেন্টের শিরোনাম</label>
                  <input
                    type="text"
                    value={asgnTitle}
                    onChange={e => setAsgnTitle(e.target.value)}
                    placeholder="যেমন: PTE Speaking Describe Image Task Practice"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">বিস্তারিত নির্দেশনা (Instructions)</label>
                  <textarea
                    rows={3}
                    value={asgnDesc}
                    onChange={e => setAsgnDesc(e.target.value)}
                    placeholder="শিক্ষার্থী কী কাজ করবে তার বিস্তারিত লিখুন..."
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">শেষ সময় (DueDate)</label>
                    <input
                      type="date"
                      value={asgnDueDate}
                      onChange={e => setAsgnDueDate(e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">মোট নম্বর (Marks)</label>
                    <input
                      type="number"
                      value={asgnPoints}
                      onChange={e => setAsgnPoints(e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ফাইল অ্যাটাচমেন্ট (ঐচ্ছিক PDF/Image)</label>
                  <input
                    type="file"
                    onChange={e => handleFileUpload(e, setAsgnAttachmentUrl, setAsgnAttachmentName)}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-700 file:text-white cursor-pointer"
                  />
                  {asgnAttachmentName && (
                    <span className="text-[11px] text-[#1DB954] font-medium block mt-1">✓ সংযুক্ত: {asgnAttachmentName}</span>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="w-1/2 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                  >
                    পাবলিশ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* GRADING MODAL */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-[#142B4D] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4 font-bengali my-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> নম্বর ও ফিডব্যাক দিন
                </h3>
                <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>

              <div className="bg-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
                <p className="font-bold text-white text-sm">{selectedSubmission.studentName}</p>
                <p className="text-slate-300 bg-slate-900/80 p-3 rounded-xl">{selectedSubmission.submissionText}</p>
                {selectedSubmission.fileName && (
                  <a
                    href={selectedSubmission.fileUrl}
                    download={selectedSubmission.fileName}
                    className="inline-flex items-center gap-1.5 text-[#1DB954] hover:underline font-bold pt-1"
                  >
                    <Paperclip className="w-4 h-4" /> ডাউনলোড ফাইল: {selectedSubmission.fileName}
                  </a>
                )}
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">প্রাপ্ত পয়েন্ট / নম্বর</label>
                  <input
                    type="number"
                    value={gradePoints}
                    onChange={e => setGradePoints(Number(e.target.value))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ইনস্ট্রাক্টর ফিডব্যাক / মন্তব্য</label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={e => setGradeFeedback(e.target.value)}
                    placeholder="শিক্ষার্থীর সংশোধন বা প্রশংসা জানিয়ে বার্তা দিন..."
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="w-1/2 py-3 bg-slate-700 text-white font-bold rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                  >
                    গ্রেড জমা দিন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* COURSE VIDEO & MODULE MANAGER MODAL */}
        {selectedManageCourseId && (() => {
          const course = courses.find(c => c.id === selectedManageCourseId);
          if (!course) return null;

          return (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
              <div className="bg-[#142B4D] text-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl space-y-5 font-bengali my-auto max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate-700/80 pb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold">
                      {course.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 flex items-center gap-2">
                      <Film className="w-5 h-5 text-[#1DB954]" />
                      {course.title} - ক্লাস ভিডিও ও মডিউল
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedManageCourseId(null);
                      setPreviewVideoUrl(null);
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {lessonSuccessMsg && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                    <span>{lessonSuccessMsg}</span>
                  </div>
                )}

                {/* Form to Add New Video Lesson */}
                <form onSubmit={handleAddVideoLesson} className="bg-slate-800/80 p-4 sm:p-5 rounded-2xl border border-slate-700/80 space-y-4 text-xs">
                  <h4 className="font-bold text-sm text-[#1DB954] flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4" /> নতুন ক্লাস ভিডিও / লেসন আপলোড ফর্ম
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">মডিউল নির্বাচন করুন</label>
                      <select
                        value={lessonModuleId}
                        onChange={e => setLessonModuleId(e.target.value)}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      >
                        {course.modules?.map((mod, idx) => (
                          <option key={mod.id} value={mod.id}>
                            {mod.title}
                          </option>
                        ))}
                        <option value="new">+ নতুন মডিউল তৈরি করুন</option>
                      </select>
                    </div>

                    {(lessonModuleId === 'new' || !course.modules || course.modules.length === 0) && (
                      <div>
                        <label className="block font-bold text-amber-400 mb-1">নতুন মডিউলের নাম</label>
                        <input
                          type="text"
                          value={newModuleName}
                          onChange={e => setNewModuleName(e.target.value)}
                          placeholder="উদা: মডিউল ৪: অ্যাডভান্সড ক্লাস পার্ট"
                          className="w-full p-2.5 bg-slate-900 border border-amber-500/50 rounded-xl text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ক্লাস ভিডিওর নাম / শিরোনাম *</label>
                    <input
                      type="text"
                      required
                      value={lessonTitle}
                      onChange={e => setLessonTitle(e.target.value)}
                      placeholder="উদা: ক্লাস ৫: লাইভ প্রজেক্ট ডেভেলপমেন্ট ও টেস্ট"
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-300">ভিডিও সোর্স টাইপ</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setLessonVideoType('url')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${lessonVideoType === 'url' ? 'bg-[#1DB954] text-white' : 'bg-slate-900 text-slate-400'}`}
                        >
                          YouTube / লিংক
                        </button>
                        <button
                          type="button"
                          onClick={() => setLessonVideoType('file')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${lessonVideoType === 'file' ? 'bg-[#1DB954] text-white' : 'bg-slate-900 text-slate-400'}`}
                        >
                          ডিভাইস ভিডিও ফাইল
                        </button>
                      </div>
                    </div>

                    {lessonVideoType === 'url' ? (
                      <input
                        type="text"
                        value={lessonVideoUrl}
                        onChange={e => setLessonVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/... অথবা ভিডিও লিংক পেস্ট করুন"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    ) : (
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 space-y-2">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={e => handleFileUpload(e, setLessonVideoUrl, setLessonVideoFileName)}
                          className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1DB954]/20 file:text-[#1DB954] cursor-pointer"
                        />
                        {lessonVideoFileName && (
                          <p className="text-[11px] text-[#1DB954] font-bold">✓ নির্বাচিত ভিডিও: {lessonVideoFileName}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ভিডিও ডিউরেশন / সময়</label>
                      <input
                        type="text"
                        value={lessonDuration}
                        onChange={e => setLessonDuration(e.target.value)}
                        placeholder="১৫:০০ মিনিট"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">লেকচার নোটস/PDF (ঐচ্ছিক)</label>
                      <input
                        type="file"
                        onChange={e => handleFileUpload(e, setLessonResourceUrl, setLessonResourceName)}
                        className="block w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-slate-700 file:text-white cursor-pointer"
                      />
                      {lessonResourceName && (
                        <span className="text-[10px] text-[#1DB954] block mt-1">✓ {lessonResourceName}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ক্লাস ভিডিও কোর্সে যুক্ত করুন</span>
                  </button>
                </form>

                {/* List of Current Video Lessons in Course */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" /> বর্তমান কারিকুলাম ও আপলোডকৃত ভিডিওসমূহ
                  </h4>

                  {(!course.modules || course.modules.length === 0) ? (
                    <p className="text-xs text-slate-400 italic bg-slate-900 p-4 rounded-xl">এখনো কোনো ভিডিও ক্লাস আপলোড করা হয়নি। উপরের ফর্ম ব্যবহার করে ভিডিও আপলোড করুন।</p>
                  ) : (
                    <div className="space-y-3">
                      {course.modules.map(module => (
                        <div key={module.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-700 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-[#1DB954]">
                            <span>{module.title}</span>
                            <span className="text-[10px] text-slate-400">({module.lessons?.length || 0} টি ক্লাস)</span>
                          </div>

                          <div className="space-y-1.5">
                            {module.lessons?.map(lesson => (
                              <div key={lesson.id} className="bg-slate-800 p-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Play className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                                  <span className="font-medium text-slate-200 truncate">{lesson.title}</span>
                                  <span className="text-[10px] text-slate-400 shrink-0">({lesson.duration})</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" /> প্লে প্লে
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLesson(course.id, module.id, lesson.id)}
                                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded cursor-pointer"
                                    title="ভিডিও লেসন মুছুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Preview Overlay */}
                {previewVideoUrl && (
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                      <span>ভিডিও লেসন প্রিভিউ</span>
                      <button onClick={() => setPreviewVideoUrl(null)} className="text-slate-400 hover:text-white text-xs">বন্ধ করুন ✕</button>
                    </div>
                    <div className="aspect-video bg-black rounded-xl overflow-hidden">
                      {previewVideoUrl.includes('embed') || previewVideoUrl.includes('youtube') || previewVideoUrl.includes('vimeo') ? (
                        <iframe
                          src={previewVideoUrl}
                          title="Preview"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video src={previewVideoUrl} controls className="w-full h-full" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* MODAL: CREATE NEW ASSIGNMENT */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-7 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 font-bengali my-auto">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-[#1DB954]" /> নতুন অ্যাসাইনমেন্ট তৈরি করুন
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1">কোর্স নির্বাচন করুন *</label>
                  <select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#1DB954]"
                    required
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">অ্যাসাইনমেন্টের নাম/শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={asgnTitle}
                    onChange={e => setAsgnTitle(e.target.value)}
                    placeholder="উদা: PTE Describe Image Speaking Task Practice"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">বিস্তারিত নির্দেশনা/ডিসক্রিপশন *</label>
                  <textarea
                    required
                    rows={3}
                    value={asgnDesc}
                    onChange={e => setAsgnDesc(e.target.value)}
                    placeholder="শিক্ষার্থীদের কী করতে হবে তার বিবরণ..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">ডেডলাইন (শেষ তারিখ)</label>
                    <input
                      type="date"
                      value={asgnDueDate}
                      onChange={e => setAsgnDueDate(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">মোট নম্বর (পয়েন্ট)</label>
                    <input
                      type="number"
                      min={1}
                      value={asgnPoints}
                      onChange={e => setAsgnPoints(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">রিসোর্স ফাইল / গাইড সংযুক্ত করুন (ঐচ্ছিক)</label>
                  <input
                    type="file"
                    onChange={e => handleFileUpload(e, setAsgnAttachmentUrl, setAsgnAttachmentName)}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1DB954]/20 file:text-[#1DB954] cursor-pointer"
                  />
                  {asgnAttachmentName && (
                    <p className="text-[11px] text-[#1DB954] font-bold mt-1">✓ সংযুক্ত ফাইল: {asgnAttachmentName}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>অ্যাসাইনমেন্ট প্রকাশ করুন</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: VIEW & GRADE SUBMISSION */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-bengali">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 sm:p-8 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#1DB954] text-[10px] font-extrabold border border-emerald-500/20">
                    শিক্ষার্থীর উত্তরপত্র মূল্যায়ন ও গ্রেডিং
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#1DB954]" />
                    {selectedSubmission.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedSubmission.studentEmail} • জমা দেওয়ার সময়: {selectedSubmission.submittedAt}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Response Content Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#1DB954]" /> শিক্ষার্থীর লিখিত উত্তর / নোট:
                </h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedSubmission.submissionText || 'কোনো লিখিত নোট প্রদান করা হয়নি।'}
                </div>

                {/* Submitted File / Audio / Document Section */}
                {selectedSubmission.fileName || selectedSubmission.fileUrl ? (
                  <div className="p-4 bg-emerald-500/10 dark:bg-slate-800 rounded-2xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-4 h-4 text-[#1DB954] shrink-0" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {selectedSubmission.fileName || 'সংযুক্ত ফাইল/নোট'}
                        </span>
                      </div>
                      {selectedSubmission.fileUrl && (
                        <a
                          href={selectedSubmission.fileUrl}
                          download={selectedSubmission.fileName || 'submission_file'}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ডাউনলোড / দেখুন</span>
                        </a>
                      )}
                    </div>

                    {/* Audio Preview if audio data */}
                    {selectedSubmission.fileUrl && (selectedSubmission.fileUrl.startsWith('data:audio') || selectedSubmission.fileName?.match(/\.(mp3|wav|m4a|ogg)$/i)) && (
                      <div className="pt-2">
                        <audio src={selectedSubmission.fileUrl} controls className="w-full h-9 rounded-lg" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-2">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span>শিক্ষার্থী কোনো আলাদা ফাইল বা ভয়েস রেকর্ড সংযুক্ত করেনি।</span>
                  </div>
                )}
              </div>

              {/* Grading Form */}
              <form onSubmit={handleGradeSubmit} className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" /> পয়েন্ট প্রদান ও ইনস্ট্রাক্টর মার্কস
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রাপ্ত নম্বর (পয়েন্ট) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={gradePoints}
                    onChange={e => setGradePoints(Number(e.target.value))}
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইনস্ট্রাক্টর মন্তব্য / ফিডব্যাক
                  </label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={e => setGradeFeedback(e.target.value)}
                    placeholder="শিক্ষার্থীর মূল্যায়নের ওপর শিক্ষক হিসেবে আপনার মন্তব্য বা পরামর্শ লিখুন..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>মূল্যায়ন সংরক্ষণ করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}



        {/* POLICY & ADMIN DIRECTIVES MODAL */}
        {showDirectivesModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 font-bengali animate-fadeIn">
            <div className="bg-slate-900 border border-teal-500/50 rounded-3xl max-w-xl w-full p-6 shadow-2xl text-left relative space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center font-black">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">টিচার নীতি ও এডমিন নির্দেশিকা হাব</h3>
                    <p className="text-[10px] text-teal-400">PTENit IT Training Academy • অফিশিয়াল টিচার নীতিমালা</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDirectivesModal(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {/* Admin Notice Directive */}
                <div className="p-4 bg-slate-800/80 border border-amber-500/40 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-black text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> নতুন সেমিস্টার কোর্স কনটেন্ট আপডেট নির্দেশিকা
                    </span>
                    <span className="text-[10px] text-slate-400">2026-08-01 09:00</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    সম্মানিত ট্রেইনারবৃন্দ, দয়া করে আগামী ব্যাচের মডিউল ও কুইজসমূহ আগামী ১৫ আগস্টের মধ্যে টিচার ড্যাশবোর্ডে আপলোড নিশ্চিত করুন।
                  </p>
                  <span className="text-[10px] text-slate-400 block text-right font-bold">প্রেরক: PTENit Admin (মেইন এডমিন)</span>
                </div>

                {/* Policy Notice Card */}
                <div className="p-4 bg-slate-800/80 border border-emerald-500/40 rounded-2xl space-y-2">
                  <span className="font-black text-emerald-400 text-xs flex items-center gap-1.5">
                    📌 কোর্স দায়িত্ব নীতি
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    মেইন এডমিন কোর্স অফার পাঠালে <strong>'দায়িত্ব গ্রহণ (Accept Offer)'</strong> করার পরেই শুধুমাত্র এতে মডিউল ও ভিডিও কনটেন্ট আপলোড করতে পারবেন। দায়িত্ব গ্রহণের আগে কোনো কন্টেন্ট যোগ করার সুযোগ থাকবে না।
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowDirectivesModal(false)}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold text-xs rounded-xl shadow cursor-pointer transition-all"
                >
                  ঠিক আছে, বুঝেছি
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TEACHER SETTINGS MODAL */}
        {showTeacherSettingsModal && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 font-bengali animate-fadeIn overflow-y-auto">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl text-left relative space-y-6 my-auto max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] flex items-center justify-center font-black">
                    <Settings className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">টিচার সেটিংস হাব</h3>
                    <p className="text-xs text-slate-400">প্রোফাইল আপডেট, পাসওয়ার্ড, পেমেন্ট মেথড ও সেটিংস সেটআপ করুন</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTeacherSettingsModal(false)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Sub Tab Navigation */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none text-xs font-bold">
                <button
                  onClick={() => setSettingsSubTab('profile')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'profile' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>প্রোফাইল আপডেট</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('payout')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'payout' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>পেমেন্ট ও ক্যাশআউট নাম্বার</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('security')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'security' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>পাসওয়ার্ড পরিবর্তন</span>
                </button>

                <button
                  onClick={() => setSettingsSubTab('preferences')}
                  className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    settingsSubTab === 'preferences' ? 'bg-[#1DB954] text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>সিস্টেম প্রেফারেন্স</span>
                </button>
              </div>

              {/* SUBTAB 1: PROFILE UPDATE */}
              {settingsSubTab === 'profile' && (
                <form
                  onSubmit={(e) => {
                    handleProfileSave(e);
                  }}
                  className="space-y-4 text-xs"
                >
                  {profileSaved && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                      <span>টিচার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <img
                      src={profileAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md shrink-0"
                    />

                    <div className="space-y-1.5 flex-1 w-full">
                      <label className="block font-bold text-slate-300">
                        প্রোফাইল ছবি পরিবর্তন (ডিভাইস থেকে ফাইল আপলোড)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, setProfileAvatar)}
                        className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1DB954] file:text-white hover:file:bg-emerald-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 block">গ্যালারি থেকে আপনার পাসপোর্ট/প্রোফাইল ছবি নির্বাচন করুন।</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">আপনার পূর্ণ নাম *</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#1DB954]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পদবী / টাইটেল</label>
                      <input
                        type="text"
                        value={profileTitle}
                        onChange={e => setProfileTitle(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">মোবাইল নম্বর</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">প্রতিষ্ঠান / ট্রেইনিং একাডেমি</label>
                      <input
                        type="text"
                        value={profileInstitution}
                        onChange={e => setProfileInstitution(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">সংক্ষিপ্ত বায়ো (Bio)</label>
                    <textarea
                      rows={3}
                      value={profileBio}
                      onChange={e => setProfileBio(e.target.value)}
                      className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>প্রোফাইল পরিবর্তন সংরক্ষণ করুন</span>
                  </button>
                </form>
              )}

              {/* SUBTAB 2: PAYOUT PAYMENT SETUP */}
              {settingsSubTab === 'payout' && (
                <div className="space-y-4 text-xs">
                  {settingsPayoutSaved && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                      <span>পেমেন্ট ও ক্যাশআউট তথ্য আপডেট হয়েছে!</span>
                    </div>
                  )}

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#1DB954]" /> ক্যাশআউট ও উইথড্রয়াল ওয়ালেট
                    </h4>
                    <p className="text-slate-400 text-xs">
                      কোর্স বিক্রয়ের আয় বিকাশে অথবা ব্যাংকে ক্যাশআউট করার জন্য তথ্য দিন।
                    </p>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">পেমেন্ট মেথড নির্বাচন করুন</label>
                      <select
                        value={settingsPayoutMethod}
                        onChange={e => setSettingsPayoutMethod(e.target.value)}
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-[#1DB954]"
                      >
                        <option value="bkash">বিকাশ (bKash Personal)</option>
                        <option value="nagad">নগদ (Nagad Personal)</option>
                        <option value="rocket">রকেট (Rocket Personal)</option>
                        <option value="bank">ব্যাংক একাউন্ট (Bank Wire)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">একাউন্ট / মোবাইল নম্বর *</label>
                      <input
                        type="text"
                        value={settingsPayoutNumber}
                        onChange={e => setSettingsPayoutNumber(e.target.value)}
                        placeholder="উদা: 01700000000"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsPayoutSaved(true);
                        setTimeout(() => setSettingsPayoutSaved(false), 3000);
                      }}
                      className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>পেমেন্ট তথ্য সেভ করুন</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: PASSWORD & SECURITY */}
              {settingsSubTab === 'security' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (settingsPassword.new !== settingsPassword.confirm) {
                      alert('নতুন পাসওয়ার্ড দুটি মিলছে না!');
                      return;
                    }
                    setSettingsPasswordSaved(true);
                    setSettingsPassword({ old: '', new: '', confirm: '' });
                    setTimeout(() => setSettingsPasswordSaved(false), 3000);
                  }}
                  className="space-y-4 text-xs"
                >
                  {settingsPasswordSaved && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1DB954]" />
                      <span>পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!</span>
                    </div>
                  )}

                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" /> অ্যাকাউন্ট সিকিউরিটি ও পাসওয়ার্ড
                    </h4>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বর্তমান পাসওয়ার্ড</label>
                      <input
                        type="password"
                        required
                        value={settingsPassword.old}
                        onChange={e => setSettingsPassword({ ...settingsPassword, old: e.target.value })}
                        placeholder="••••••••"
                        className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1">নতুন পাসওয়ার্ড</label>
                        <input
                          type="password"
                          required
                          value={settingsPassword.new}
                          onChange={e => setSettingsPassword({ ...settingsPassword, new: e.target.value })}
                          placeholder="••••••••"
                          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                        <input
                          type="password"
                          required
                          value={settingsPassword.confirm}
                          onChange={e => setSettingsPassword({ ...settingsPassword, confirm: e.target.value })}
                          placeholder="••••••••"
                          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>পাসওয়ার্ড সিকিউর আপডেট করুন</span>
                    </button>
                  </div>
                </form>
              )}

              {/* SUBTAB 4: PREFERENCES & LOGOUT */}
              {settingsSubTab === 'preferences' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-sky-400" /> সিস্টেম অপশন ও একাউন্ট কন্ট্রোল
                    </h4>

                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                      <div>
                        <p className="font-bold text-white">ড্যাশবোর্ড সাউন্ড নোটিফিকেশন</p>
                        <p className="text-[10px] text-slate-400">নতুন মেসেজ বা নোটিফিকেশনে সাউন্ড প্লেইং</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/20 text-[#1DB954] font-bold text-[11px] rounded-lg">চালু রয়েছে ✓</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                      <div>
                        <p className="font-bold text-white">ড্যাশবোর্ড মোড</p>
                        <p className="text-[10px] text-slate-400">হাই কনট্রাস্ট ডার্ক মোড ইন্টারফেস</p>
                      </div>
                      <span className="px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-[11px] rounded-lg flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5" /> ডার্ক মোড
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowTeacherSettingsModal(false);
                          setActiveTab?.('home');
                        }}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm rounded-xl border border-slate-700 shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Globe className="w-4 h-4 text-emerald-400" />
                        <span>মূল ওয়েবসাইটে ফিরে যান</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowTeacherSettingsModal(false);
                          logout?.();
                        }}
                        className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>টিচার অ্যাকাউন্ট থেকে লগ আউট করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Modal Action */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTeacherSettingsModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

            </div>
          </div>
        )}

        {/* EDIT PENDING PAYOUT MODAL */}
        {isEditPayoutModalOpen && editingPayoutItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-bengali">
            <div className="bg-slate-900 border border-slate-800 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">ক্যাশআউট রিকোয়েস্ট পরিবর্তন</h3>
                    <p className="text-[11px] text-slate-400 font-mono">আইডি: {editingPayoutItem.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditPayoutModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editPayoutAmount || editPayoutAmount <= 0) {
                    alert('সঠিক টাকার পরিমাণ দিন!');
                    return;
                  }
                  if (!editPayoutAccount) {
                    alert('সঠিক অ্যাকাউন্ট নম্বর দিন!');
                    return;
                  }
                  setPayoutsList(prev => prev.map(item => {
                    if (item.id === editingPayoutItem.id) {
                      const methodLabel = editPayoutMethod === 'bkash' ? 'bKash' : editPayoutMethod === 'nagad' ? 'Nagad' : 'Bank Transfer';
                      return {
                        ...item,
                        amount: editPayoutAmount,
                        method: `${methodLabel} (${editPayoutAccount})`,
                        paymentMethod: methodLabel,
                        accountNumber: editPayoutAccount
                      };
                    }
                    return item;
                  }));
                  setIsEditPayoutModalOpen(false);
                  alert('আপনার ক্যাশআউট রিকোয়েস্ট সফলভাবে আপডেট করা হয়েছে!');
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-300 mb-1">পেমেন্ট মেথড</label>
                  <select
                    value={editPayoutMethod}
                    onChange={(e) => setEditPayoutMethod(e.target.value as any)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option value="bkash">bKash (বিকাশ পার্সোনাল)</option>
                    <option value="nagad">Nagad (নগদ পার্সোনাল)</option>
                    <option value="bank">Bank Transfer (ব্যাংক একাউন্ট)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">একাউন্ট/মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={editPayoutAccount}
                    onChange={(e) => setEditPayoutAccount(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ক্যাশআউট পরিমাণ (টাকা) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={editPayoutAmount}
                    onChange={(e) => setEditPayoutAmount(Number(e.target.value))}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditPayoutModalOpen(false)}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-[#1DB954] to-emerald-400 text-slate-950 font-black hover:opacity-95 transition cursor-pointer shadow-lg shadow-[#1DB954]/20"
                  >
                    আপডেট সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
