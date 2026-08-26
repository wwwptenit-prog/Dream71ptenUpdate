import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CreditCard,
  User as UserIcon,
  PlayCircle,
  Clock,
  CheckCircle,
  Download,
  FileText,
  Upload,
  Send,
  Sparkles,
  Paperclip,
  Check,
  Bell,
  MessageSquare,
  X,
  Calendar,
  Globe,
  LogOut,
  GraduationCap,
  Phone,
  Shield,
  Save,
  Settings,
  Lock,
  Sun,
  Moon,
  Search,
  Video
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Assignment } from '../types';

interface StudentDashboardProps {
  onStartLearning: (courseId: string) => void;
  onViewCertificate: (code: string) => void;
  setActiveTab?: (tab: string) => void;
  hideHeaderBanner?: boolean;
  hideMenubar?: boolean;
  initialSubTab?: 'my-courses' | 'certificates' | 'assignments' | 'payments' | 'profile';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartLearning,
  onViewCertificate,
  setActiveTab,
  hideHeaderBanner = false,
  hideMenubar = false,
  initialSubTab = 'my-courses'
}) => {
  const {
    lang,
    setLang,
    t,
    darkMode,
    toggleDarkMode,
    currentUser,
    courses,
    enrollments,
    certificates,
    orders,
    assignments,
    submissions,
    submitAssignment,
    updateProfile,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    sendContactMessage,
    logout
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<
    'my-courses' | 'certificates' | 'assignments' | 'payments' | 'profile'
  >(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [notifOpen, setNotifOpen] = useState(false);

  // Student Notification & Messenger Preference Toggles State
  const [studentNotifToggles, setStudentNotifToggles] = useState({
    admin: true,       // 👑 এডমিন অ্যানাউন্সমেন্ট
    teacher: true,     // 🎓 টিচার ও ক্লাস আপডেট
    assignment: true   // 📝 অ্যাসাইনমেন্ট ফিডব্যাক
  });
  const [studentMsgToggles, setStudentMsgToggles] = useState({
    support: true,     // 🎧 PTENit সাপোর্ট
    instructor: true   // 👨‍🏫 কোর্স ইনস্ট্রাক্টর
  });

  // Student Messenger / Support Chat State
  const [msgOpen, setMsgOpen] = useState(false);
  const [activeSupportSender, setActiveSupportSender] = useState<'PTENit সাপোর্ট' | 'কোর্স ইনস্ট্রাক্টর'>('PTENit সাপোর্ট');
  const [studentChatInput, setStudentChatInput] = useState('');
  const [studentChatAttachedFile, setStudentChatAttachedFile] = useState<{ name: string; url: string; type: string } | null>(null);
  const studentFileInputRef = React.useRef<HTMLInputElement>(null);
  const [studentChatList, setStudentChatList] = useState([
    {
      id: 'st-msg-1',
      sender: 'PTENit সাপোর্ট',
      text: 'আসসালামু আলাইকুম! PTENit একাডেমির স্টুডেন্ট সাপোর্টে স্বাগতম। আপনার যেকোনো জিজ্ঞাসা, কোর্স কনফিউশন বা সহায়তার জন্য মেসেজ পাঠাতে পারেন।',
      isStudent: false,
      time: 'আজ ১০:১৫ AM',
      read: true
    },
    {
      id: 'st-msg-2',
      sender: 'কোর্স ইনস্ট্রাক্টর',
      text: 'প্রিয় শিক্ষার্থী, ক্লাসের রিসোর্স ও অ্যাসাইনমেন্ট সংক্রান্ত যেকোনো সাহায্যে সরাসরি এখানে যোগাযোগ করতে পারেন।',
      isStudent: false,
      time: 'গতকাল ৪:৩০ PM',
      read: true
    }
  ]);

  // Assignment Submission modal state
  const [selectedAsgn, setSelectedAsgn] = useState<Assignment | null>(null);
  const [subText, setSubText] = useState('');
  const [subFileName, setSubFileName] = useState('');
  const [subFileUrl, setSubFileUrl] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  // Enrolled Courses PC View Interactive Modals State
  const [activeResourceModal, setActiveResourceModal] = useState<any>(null);
  const [activeLiveClassModal, setActiveLiveClassModal] = useState<any>(null);
  const [activeCurriculumModal, setActiveCurriculumModal] = useState<any>(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'live'>('all');

  // Profile Edit state
  const [profName, setProfName] = useState(currentUser?.name || '');
  const [profMobile, setProfMobile] = useState(currentUser?.mobile || '');
  const [profEmail, setProfEmail] = useState(currentUser?.email || '');
  const [profInstitution, setProfInstitution] = useState(currentUser?.institution || '');
  const [profBio, setProfBio] = useState(currentUser?.bio || '');
  const [profAvatar, setProfAvatar] = useState(currentUser?.avatar || '');
  const [profSaved, setProfSaved] = useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  if (!currentUser) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4 font-bengali">
        <UserIcon className="w-16 h-16 text-[#1DB954] mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">লগইন প্রয়োজন</h2>
        <p className="text-sm text-slate-500">
          স্টুডেন্ট ড্যাশবোর্ড দেখার জন্য অনুগ্রহ করে আপনার একাউন্টে লগইন করুন।
        </p>
        <button
          onClick={() => setActiveTab('courses')}
          className="px-6 py-2.5 bg-[#1DB954] text-white font-bold text-sm rounded-xl cursor-pointer"
        >
          কোর্সসমূহ দেখুন
        </button>
      </div>
    );
  }

  // Student's data
  const myEnrollments = enrollments.filter(e => e.userId === currentUser.id || true);
  const myCertificates = certificates.filter(c => c.studentId === currentUser.id || true);
  const myOrders = orders.filter(o => o.userId === currentUser.id || true);

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

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsgn || !subText) return;

    submitAssignment({
      assignmentId: selectedAsgn.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      submissionText: subText,
      fileName: subFileName,
      fileUrl: subFileUrl
    });

    setSubText('');
    setSubFileName('');
    setSubFileUrl('');
    setSubSuccess(true);
    setTimeout(() => {
      setSubSuccess(false);
      setSelectedAsgn(null);
    }, 2000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profName,
      mobile: profMobile,
      email: profEmail,
      institution: profInstitution,
      bio: profBio,
      avatar: profAvatar
    });
    setProfSaved(true);
    setTimeout(() => setProfSaved(false), 3000);
  };

  return (
    <div className={`font-bengali transition-colors ${hideHeaderBanner ? '' : 'py-4 sm:py-8 bg-slate-100/90 dark:bg-slate-950 min-h-screen'}`}>
      <div className={hideHeaderBanner ? 'w-full space-y-4' : 'max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20'}>
        
        {/* Teacher-Style Rich Student Profile Header Banner */}
        {!hideHeaderBanner && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#142B4D] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-emerald-500/30 mb-6 sm:mb-8 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
            <div className="relative group shrink-0">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-2 sm:border-4 border-[#1DB954]/50 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#1DB954] border-2 border-slate-900 flex items-center justify-center text-xs text-white shadow-md" title="সক্রিয় স্টুডেন্ট">
                ✓
              </span>
            </div>

            <div className="space-y-1.5 flex-1 w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
                <span className="bg-emerald-500/20 text-[#1DB954] border border-emerald-500/40 text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-bold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> স্টুডেন্ট প্রোফাইল
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                {currentUser.institution || 'PTENit IT Training Academy'}
              </p>
              <p className="text-slate-400 text-[11px] sm:text-xs">
                {currentUser.email} • {currentUser.mobile}
              </p>
            </div>

            {/* Header Action Suite */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0 font-bengali">
              
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="bg-slate-800/80 px-3 py-2.5 rounded-2xl border border-slate-700 hover:border-[#1DB954] text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="ভাষা পরিবর্তন / Switch Language"
              >
                <Globe className="w-4 h-4 text-[#1DB954]" />
                <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
              </button>

              {/* Night Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 hover:border-[#1DB954] text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
                title={darkMode ? 'লাইট মোড অন করুন' : 'নাইট মোড অন করুন'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
              </button>

              {/* Main Site Link */}
              <button
                onClick={() => setActiveTab('home')}
                className="bg-slate-800/80 px-3 py-2.5 rounded-2xl border border-slate-700 hover:border-[#1DB954] text-xs font-bold text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="মূল ওয়েবসাইটে যান"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t('হোম পেইজ', 'Home Page')}</span>
              </button>

              {/* Notification Badge inside Dashboard */}
              <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (msgOpen) setMsgOpen(false);
                }}
                className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 hover:border-[#1DB954] transition-colors cursor-pointer relative"
                title="নোটিফিকেশনসমূহ"
              >
                <Bell className="w-5 h-5 text-emerald-400" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-slate-900">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {notifOpen && (
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
                          <span>স্টুডেন্ট নোটিফিকেশন সেন্টার</span>
                          {unreadNotifCount > 0 ? (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                              {unreadNotifCount} অপঠিত
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              সব পড়া হয়েছে ✓
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-emerald-400">কোর্স, অ্যাসাইনমেন্ট ও এডমিন নোটিশ</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      {unreadNotifCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        >
                          সব পঠিত ✓
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
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
                      onClick={() => setStudentNotifToggles(prev => ({ ...prev, admin: !prev.admin }))}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                        studentNotifToggles.admin
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                      title="এডমিন নোটিশ চালু/বন্ধ করুন"
                    >
                      <span>👑 এডমিন {studentNotifToggles.admin ? '✓' : '✕'}</span>
                    </button>
                    <button
                      onClick={() => setStudentNotifToggles(prev => ({ ...prev, teacher: !prev.teacher }))}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                        studentNotifToggles.teacher
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                      title="টিচার/কোর্স আপডেট চালু/বন্ধ করুন"
                    >
                      <span>🎓 টিচার {studentNotifToggles.teacher ? '✓' : '✕'}</span>
                    </button>
                    <button
                      onClick={() => setStudentNotifToggles(prev => ({ ...prev, assignment: !prev.assignment }))}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer border flex items-center gap-1 shrink-0 ${
                        studentNotifToggles.assignment
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                      title="অ্যাসাইনমেন্ট ফিডব্যাক চালু/বন্ধ করুন"
                    >
                      <span>📝 অ্যাসাইনমেন্ট {studentNotifToggles.assignment ? '✓' : '✕'}</span>
                    </button>
                  </div>

                  {/* Notification Items */}
                  <div className="p-3 space-y-2 max-h-80 sm:max-h-96 overflow-y-auto bg-slate-950/50">
                    {notifications.filter(n => {
                      if (n.title.includes('এডমিন') || n.title.includes('Admin')) {
                        if (!studentNotifToggles.admin) return false;
                      } else if (n.title.includes('অ্যাসাইনমেন্ট') || n.title.includes('Assignment')) {
                        if (!studentNotifToggles.assignment) return false;
                      } else {
                        if (!studentNotifToggles.teacher) return false;
                      }
                      return true;
                    }).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-10">ফিল্টার ফিল্ড অনুযায়ী কোনো নোটিফিকেশন নেই।</p>
                    ) : (
                      notifications
                        .filter(n => {
                          if (n.title.includes('এডমিন') || n.title.includes('Admin')) {
                            if (!studentNotifToggles.admin) return false;
                          } else if (n.title.includes('অ্যাসাইনমেন্ট') || n.title.includes('Assignment')) {
                            if (!studentNotifToggles.assignment) return false;
                          } else {
                            if (!studentNotifToggles.teacher) return false;
                          }
                          return true;
                        })
                        .map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.targetTab && n.targetTab !== 'student-dashboard' && setActiveTab) {
                                setActiveTab(n.targetTab);
                              } else if (n.title.includes('অ্যাসাইনমেন্ট')) {
                                setActiveSubTab('assignments');
                              } else if (n.title.includes('কোর্স')) {
                                setActiveSubTab('my-courses');
                              }
                              setNotifOpen(false);
                            }}
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

            {/* Message Square & Floating Messenger Window inside Profile Bar */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !msgOpen;
                  setMsgOpen(nextState);
                  if (notifOpen) setNotifOpen(false);
                  if (nextState) {
                    setStudentChatList(prev => prev.map(m => ({ ...m, read: true })));
                  }
                }}
                className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 hover:border-sky-400 transition-colors cursor-pointer relative"
                title="মেসেজ ও লাইভ সাপোর্ট"
              >
                <MessageSquare className="w-5 h-5 text-sky-400" />
                {studentChatList.filter(m => !m.isStudent && !m.read).length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-sky-500 text-white font-black text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-lg border-2 border-slate-900">
                    {studentChatList.filter(m => !m.isStudent && !m.read).length}
                  </span>
                )}
              </button>

              {/* Floating Facebook Messenger / FB Lite Style Bottom Dock Window */}
              {msgOpen && (
                <div className="fixed bottom-0 right-2 sm:right-6 sm:bottom-4 w-full sm:w-[440px] max-w-[calc(100vw-1rem)] z-50 bg-slate-900 border-t-2 sm:border-2 border-sky-500/60 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col font-bengali animate-fadeIn overflow-hidden">
                  <input
                    type="file"
                    ref={studentFileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setStudentChatAttachedFile({
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
                          {activeSupportSender === 'PTENit সাপোর্ট' ? 'S' : 'T'}
                        </div>
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-slate-900 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                          <span>{activeSupportSender}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">অনলাইন</span>
                        </h4>
                        <p className="text-[10px] text-sky-400">লাইভ স্টুডেন্ট মেসেঞ্জার & ইনবক্স</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <button
                        onClick={() => setStudentChatList(prev => prev.map(m => ({ ...m, read: true })))}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold px-2 py-1 rounded-lg border border-slate-700 cursor-pointer transition-all"
                        title="সব বার্তা পঠিত হিসেবে চিহ্নিত করুন"
                      >
                        সব পঠিত ✓
                      </button>
                      <button
                        onClick={() => setMsgOpen(false)}
                        className="p-1 hover:bg-slate-800 hover:text-white text-slate-400 rounded-lg transition-all cursor-pointer"
                        title="বন্ধ করুন"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Channel Tab Bar & Preferences */}
                  <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto scrollbar-none">
                    {(['PTENit সাপোর্ট', 'কোর্স ইনস্ট্রাক্টর'] as const).map((sender) => {
                      const unread = studentChatList.filter(m => m.sender === sender && !m.isStudent && !m.read).length;
                      return (
                        <button
                          key={sender}
                          onClick={() => {
                            setActiveSupportSender(sender);
                            setStudentChatList(prev => prev.map(m => m.sender === sender ? { ...m, read: true } : m));
                          }}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                            activeSupportSender === sender
                              ? 'bg-sky-500 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span>{sender}</span>
                          {unread > 0 && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-rose-600 text-white font-black rounded-full animate-pulse">
                              {unread}
                            </span>
                          )}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setStudentMsgToggles(prev => ({ ...prev, support: !prev.support }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                        studentMsgToggles.support ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="সাপোর্ট বার্তা ফিল্টার অন/অফ"
                    >
                      সাপোর্ট {studentMsgToggles.support ? '✓' : '✕'}
                    </button>
                    <button
                      onClick={() => setStudentMsgToggles(prev => ({ ...prev, instructor: !prev.instructor }))}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 cursor-pointer transition-all ${
                        studentMsgToggles.instructor ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                      title="ইনস্ট্রাক্টর বার্তা ফিল্টার অন/অফ"
                    >
                      ইনস্ট্রাক্টর {studentMsgToggles.instructor ? '✓' : '✕'}
                    </button>
                  </div>

                  {/* Chat Content */}
                  <div className="p-3 space-y-2.5 h-64 sm:h-72 overflow-y-auto bg-slate-950/50">
                    {studentChatList
                      .filter(m => m.sender === activeSupportSender || (m.isStudent && m.sender === activeSupportSender))
                      .length === 0 ? (
                        <div className="text-center py-10 space-y-2">
                          <MessageSquare className="w-8 h-8 text-sky-500/40 mx-auto" />
                          <p className="text-xs text-slate-400">{activeSupportSender}-এর সাথে কথা বলুন।</p>
                        </div>
                      ) : (
                        studentChatList
                          .filter(m => m.sender === activeSupportSender || (m.isStudent && m.sender === activeSupportSender))
                          .map(msg => (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${msg.isStudent ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[85%] p-2.5 rounded-2xl text-xs space-y-1 ${
                                  msg.isStudent
                                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-none shadow-md'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                }`}
                              >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[9px] block text-right ${msg.isStudent ? 'text-sky-200' : 'text-slate-400'}`}>
                                  {msg.time}
                                </span>
                              </div>
                            </div>
                          ))
                      )}
                  </div>

                  {/* File Preview */}
                  {studentChatAttachedFile && (
                    <div className="px-3 py-1.5 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-sky-300">
                      <span className="truncate max-w-[200px]">📎 {studentChatAttachedFile.name}</span>
                      <button
                        onClick={() => setStudentChatAttachedFile(null)}
                        className="p-1 hover:bg-slate-700 rounded text-rose-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!studentChatInput.trim() && !studentChatAttachedFile) return;
                      const newMsg = {
                        id: `st-msg-${Date.now()}`,
                        sender: activeSupportSender,
                        text: studentChatAttachedFile ? `${studentChatInput}\n📎 [সংযুক্ত ফাইল: ${studentChatAttachedFile.name}]` : studentChatInput,
                        isStudent: true,
                        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        read: true
                      };
                      setStudentChatList(prev => [...prev, newMsg]);
                      sendContactMessage?.({
                        name: currentUser?.name || 'স্টুডেন্ট',
                        email: currentUser?.email || 'student@ptenit.com',
                        phone: currentUser?.mobile || '',
                        subject: `[${activeSupportSender}] স্টুডেন্ট মেসেজ`,
                        message: newMsg.text
                      });
                      setStudentChatInput('');
                      setStudentChatAttachedFile(null);

                      // Simulate polite auto-acknowledgement from support after 1 second
                      setTimeout(() => {
                        setStudentChatList(prev => [
                          ...prev,
                          {
                            id: `st-reply-${Date.now()}`,
                            sender: activeSupportSender,
                            text: `ধন্যবাদ! আপনার বার্তাটি প্রাপ্ত হয়েছে। ${activeSupportSender} টিম শীঘ্রই রিপ্লাই দেবেন।`,
                            isStudent: false,
                            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            read: true
                          }
                        ]);
                      }, 1000);
                    }}
                    className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => studentFileInputRef.current?.click()}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-xl transition-all cursor-pointer border border-slate-700 shrink-0"
                      title="ফাইল যুক্ত করুন"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      placeholder={`${activeSupportSender}-কে মেসেজ লিখুন...`}
                      value={studentChatInput}
                      onChange={e => setStudentChatInput(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="submit"
                      disabled={!studentChatInput.trim() && !studentChatAttachedFile}
                      className="p-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>

              {/* Main Website Button */}
              <button
                onClick={() => setActiveTab?.('home')}
                className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/90 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all font-bold text-xs"
                title="মূল ওয়েবসাইটে ফিরে যান"
              >
                <Globe className="w-4 h-4 text-[#1DB954]" />
                <span className="hidden sm:inline">মূল ওয়েবসাইট</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  setActiveTab?.('home');
                }}
                className="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl sm:rounded-2xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all font-bold text-xs"
                title="লগআউট করুন"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>

          {/* Integrated Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-[#1DB954] block">{myEnrollments.length}</span>
              <span className="text-[11px] text-slate-300 font-bold">এনরোলকৃত কোর্স</span>
            </div>
            <div className="bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-sky-400 block">{submissions.filter(s => s.studentId === currentUser.id).length}</span>
              <span className="text-[11px] text-slate-300 font-bold">জমাকৃত টাস্ক</span>
            </div>
            <div className="bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block">{myCertificates.length}</span>
              <span className="text-[11px] text-slate-300 font-bold">অর্জিত সনদপত্র</span>
            </div>
            <div className="bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-300 block">100%</span>
              <span className="text-[11px] text-slate-300 font-bold">লার্নিং স্কোর</span>
            </div>
          </div>
        </div>
      )}

        {/* Full Dashboard Menubar with Header & Extensible Navigation Items */}
        {!hideMenubar && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                <span className="uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">ড্যাশবোর্ড মেনুবার (Student Menubar):</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                + মডিউল ফ্রেমওয়ার্ক প্রস্তুত
              </span>
            </div>

            <div className="p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { id: 'my-courses', label: 'আমার কোর্সসমূহ', icon: BookOpen, badge: myEnrollments.length },
                { id: 'certificates', label: 'সার্টিফিকেটস', icon: Award, badge: myCertificates.length },
                { id: 'assignments', label: 'অ্যাসাইনমেন্ট ও ক্লাসরুম', icon: FileText, badge: submissions.filter(s => s.studentId === currentUser.id).length },
                { id: 'payments', label: 'পেমেন্ট হিস্টোরি', icon: CreditCard, badge: myOrders.length },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id as any)}
                    className={`py-2.5 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#1DB954] text-white shadow-md shadow-[#1DB954]/20 font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                        isActive ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB TAB: MY COURSES */}
        {activeSubTab === 'my-courses' && (
          <div className="space-y-6">
            {/* Header, Search & Filter Bar for PC View */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#1DB954]" />
                    <span>আমার এনরোলকৃত কোর্সসমূহ ({myEnrollments.length})</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    পিসি ভিউতে সকল ক্লাসের ড্রাইভ রিসোর্স, লাইভ মিট লিংক, অ্যাসাইনমেন্ট ও ইনস্ট্রাক্টর সাপোর্ট একনজরে
                  </p>
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="কোর্স বা ইনস্ট্রাক্টর খুঁজুন..."
                    value={courseSearchQuery}
                    onChange={e => setCourseSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-[#1DB954] text-slate-900 dark:text-white"
                  />
                  {courseSearchQuery && (
                    <button
                      onClick={() => setCourseSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold">
                <span className="text-slate-400 shrink-0 text-[11px]">ফিল্টার:</span>
                {[
                  { id: 'all', label: `সব কোর্স (${myEnrollments.length})` },
                  { id: 'in_progress', label: `চলমান (${myEnrollments.filter(e => e.status !== 'completed').length})` },
                  { id: 'completed', label: `সম্পন্ন (${myEnrollments.filter(e => e.status === 'completed').length})` },
                  { id: 'live', label: '🔴 লাইভ ক্লাস ব্যাচ' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setCourseStatusFilter(f.id as any)}
                    className={`px-3 py-1 rounded-xl transition cursor-pointer shrink-0 text-xs font-bold border ${
                      courseStatusFilter === f.id
                        ? 'bg-[#1DB954] text-white border-[#1DB954] shadow-sm font-black'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#1DB954]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enrolled Courses List */}
            {myEnrollments.filter(enr => {
              const course = courses.find(c => c.id === enr.courseId);
              if (!course) return false;

              if (courseSearchQuery.trim()) {
                const q = courseSearchQuery.toLowerCase();
                const matchTitle = course.title.toLowerCase().includes(q);
                const matchInstructor = course.instructor.toLowerCase().includes(q);
                const matchCategory = course.category.toLowerCase().includes(q);
                if (!matchTitle && !matchInstructor && !matchCategory) return false;
              }

              if (courseStatusFilter === 'in_progress') {
                if (enr.status === 'completed') return false;
              } else if (courseStatusFilter === 'completed') {
                if (enr.status !== 'completed') return false;
              }

              return true;
            }).length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
                {myEnrollments
                  .filter(enr => {
                    const course = courses.find(c => c.id === enr.courseId);
                    if (!course) return false;

                    if (courseSearchQuery.trim()) {
                      const q = courseSearchQuery.toLowerCase();
                      const matchTitle = course.title.toLowerCase().includes(q);
                      const matchInstructor = course.instructor.toLowerCase().includes(q);
                      const matchCategory = course.category.toLowerCase().includes(q);
                      if (!matchTitle && !matchInstructor && !matchCategory) return false;
                    }

                    if (courseStatusFilter === 'in_progress') {
                      if (enr.status === 'completed') return false;
                    } else if (courseStatusFilter === 'completed') {
                      if (enr.status !== 'completed') return false;
                    }

                    return true;
                  })
                  .map(enr => {
                    const course = courses.find(c => c.id === enr.courseId);
                    if (!course) return null;

                    return (
                      <div
                        key={enr.id}
                        className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 font-bengali"
                      >
                        {/* Course Main Top Card */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-4">
                            <div className="relative shrink-0">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-md border border-slate-100 dark:border-slate-800"
                              />
                              <span className="absolute -top-1.5 -left-1.5 bg-emerald-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow border border-slate-900">
                                🔴 ব্যাচ-০৪
                              </span>
                            </div>

                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 bg-[#1DB954]/15 text-[#1DB954] text-[10px] font-bold rounded-lg border border-[#1DB954]/30">
                                  {course.category}
                                </span>
                                {enr.status === 'completed' ? (
                                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/30 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> কোর্স সম্পন্ন
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/30 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> লাইভ ব্যাচ চলমান
                                  </span>
                                )}
                              </div>

                              <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg line-clamp-2 leading-snug">
                                {course.title}
                              </h3>

                              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  👨‍🏫 {course.instructor}
                                </span>
                                <span>•</span>
                                <span className="text-emerald-500 font-bold">আজীবন এক্সেস</span>
                              </div>
                            </div>
                          </div>

                          {/* Visual Progress Bar & Lessons Stats */}
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#1DB954]" />
                                <span>অগ্রগতি</span>
                              </span>
                              <span className="text-[#1DB954] font-black text-xs">
                                {enr.progress}% সম্পন্ন
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-[#1DB954] via-emerald-400 to-sky-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${enr.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* PC Feature Action Suite Grid */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                          {/* Main Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onStartLearning(course.id)}
                              className="flex-1 py-2.5 px-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                              <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                              <span>ক্লাসে যান</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveCurriculumModal(course)}
                              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-98"
                            >
                              <span>বিস্তারিত</span>
                            </button>
                          </div>

                          {/* Desktop Interactive Tools Suite */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-bold">
                            <button
                              onClick={() => setActiveResourceModal(course)}
                              className="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-center"
                              title="ক্লাস নোটস, প্রজেক্ট কোড ও রিসোর্স ডাউনলোড করুন"
                            >
                              <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              <span className="truncate">ড্রাইভ রিসোর্স</span>
                            </button>

                            <button
                              onClick={() => setActiveLiveClassModal(course)}
                              className="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-center"
                              title="লাইভ জুম/মিট ক্লাস লিংক ও সময়সূচী"
                            >
                              <Video className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
                              <span className="truncate">লাইভ ক্লাস লিংক</span>
                            </button>

                            <button
                              onClick={() => setActiveCurriculumModal(course)}
                              className="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-center"
                              title="কোর্সের সিলেবাস ও লেসন তালিকা দেখুন"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">সিলেবাস</span>
                            </button>

                            <button
                              onClick={() => {
                                setMsgOpen(true);
                                setActiveSupportSender('কোর্স ইনস্ট্রাক্টর');
                              }}
                              className="py-2 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-center"
                              title="সরাসরি কোর্স ইনস্ট্রাক্টরকে মেসেজ পাঠাত"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="truncate">ইনস্ট্রাক্টর চ্যাট</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
                  {courseSearchQuery ? 'আপনার সার্চ অনুযায়ী কোনো কোর্স পাওয়া যায়নি।' : 'আপনি এখনও কোনো কোর্সে এনরোল করেননি।'}
                </p>
                <button
                  onClick={() => { setCourseSearchQuery(''); setActiveTab?.('courses'); }}
                  className="px-5 py-2.5 bg-[#1DB954] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  কোর্স ক্যাটালগ দেখুন
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUB TAB: CERTIFICATES */}
        {activeSubTab === 'certificates' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              আমার অর্জনকৃত সার্টিফিকেটস ({myCertificates.length})
            </h2>

            {myCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {myCertificates.map(cert => (
                  <div
                    key={cert.id}
                    className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-400/20 text-amber-500 rounded-2xl shrink-0">
                        <Award className="w-8 h-8" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#1DB954]">
                          ID: {cert.certificateCode}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {cert.courseName}
                        </h3>
                        <p className="text-xs text-slate-500">
                          ইস্যু তারিখ: {cert.issueDate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500">
                        ইনস্ট্রাক্টর: {cert.instructorName}
                      </span>
                      <button
                        onClick={() => onViewCertificate(cert.certificateCode)}
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-[#1DB954] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        ডাউনলোড
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-2">
                <Award className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
                  কোর্সের সকল লেসন সম্পন্ন করলে আপনার ডিজিটাল সনদপত্র এখানে যুক্ত হবে।
                </p>
              </div>
            )}
          </div>
        )}

        {/* SUB TAB: PAYMENTS */}
        {activeSubTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              পেমেন্ট ও অর্ডার হিস্টোরি
            </h2>

            {myOrders.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="p-3.5 sm:p-4">অর্ডার ID</th>
                        <th className="p-3.5 sm:p-4">কোর্স</th>
                        <th className="p-3.5 sm:p-4">পেমেন্ট মেথড</th>
                        <th className="p-3.5 sm:p-4">পরিমাণ</th>
                        <th className="p-3.5 sm:p-4">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {myOrders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3.5 sm:p-4 font-mono font-bold text-slate-900 dark:text-white">{ord.id}</td>
                          <td className="p-3.5 sm:p-4 font-semibold">{ord.courseTitle}</td>
                          <td className="p-3.5 sm:p-4 font-medium">{ord.paymentMethod} ({ord.transactionId})</td>
                          <td className="p-3.5 sm:p-4 font-bold text-[#1DB954]">৳{ord.amount}</td>
                          <td className="p-3.5 sm:p-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-[#1DB954]">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">কোনো পেমেন্ট হিস্টোরি পাওয়া যায়নি।</p>
            )}
          </div>
        )}

        {/* SUB TAB: ASSIGNMENTS */}
        {activeSubTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="p-2 bg-[#1DB954]/10 text-[#1DB954] rounded-xl border border-[#1DB954]/20">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span>আমার কোর্সের অ্যাসাইনমেন্টসমূহ</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  এখানে আপনার কোর্সের অ্যাসাইনমেন্ট জমা দিন এবং ইন্সট্রাক্টরের ফিডব্যাক ও গ্রেডিং দেখুন।
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-500/10 text-[#1DB954] border border-emerald-500/20 font-extrabold text-xs rounded-full">
                মোট অ্যাসাইনমেন্ট: {assignments.length} টি
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
              {assignments.map(asgn => {
                const mySubmission = submissions.find(
                  s => s.assignmentId === asgn.id && (s.studentId === currentUser.id || s.studentEmail === currentUser.email)
                );

                return (
                  <div
                    key={asgn.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800/90 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-5 group hover:border-[#1DB954]/40"
                  >
                    {/* Top Gradient Highlight Bar */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#1DB954] via-emerald-400 to-teal-500 absolute top-0 left-0" />

                    <div className="space-y-4 pt-1">
                      {/* Top Header Row with Badges */}
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-extrabold text-xs rounded-full flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{asgn.courseTitle}</span>
                        </span>

                        {mySubmission ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm ${
                              mySubmission.status === 'graded'
                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-[#1DB954] border border-emerald-500/40'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${mySubmission.status === 'graded' ? 'bg-[#1DB954]' : 'bg-amber-400'}`} />
                            {mySubmission.status === 'graded'
                              ? `প্রাপ্ত মার্কস: ${mySubmission.points}/${asgn.totalPoints}`
                              : 'জমা দেওয়া হয়েছে (চেকিং চলছে)'}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-black rounded-full flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            জমা দেওয়া বাকি
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-[#1DB954] transition-colors">
                          {asgn.title}
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {asgn.description}
                        </div>
                      </div>

                      {/* Instructor Attachment File Box */}
                      {asgn.attachmentName && (
                        <div className="p-3 bg-emerald-500/5 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between text-xs border border-emerald-500/20 dark:border-slate-700">
                          <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold truncate">
                            <Paperclip className="w-4 h-4 text-[#1DB954] shrink-0" />
                            <span className="truncate">{asgn.attachmentName}</span>
                          </span>
                          <a
                            href={asgn.attachmentUrl}
                            download={asgn.attachmentName}
                            className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shrink-0 shadow-sm flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>ডাউনলোড</span>
                          </a>
                        </div>
                      )}

                      {/* Meta Footer Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Calendar className="w-4 h-4 text-slate-400" /> ডেডলাইন: <strong className="text-slate-800 dark:text-slate-200">{asgn.dueDate}</strong>
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Award className="w-4 h-4 text-amber-500" /> মোট পয়েন্ট: <strong className="text-slate-800 dark:text-slate-200">{asgn.totalPoints}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Teacher Feedback / Submission Content Box */}
                    <div className="pt-2">
                      {mySubmission ? (
                        <div className="space-y-3">
                          {/* Student Answer */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-bold">
                              <span className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-[#1DB954]" /> আপনার জমাকৃত উত্তর/নোট:
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">{mySubmission.submittedAt}</span>
                            </div>
                            <div className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed font-medium">
                              {mySubmission.submissionText}
                            </div>
                            {mySubmission.fileName && (
                              <div className="text-[11px] text-[#1DB954] font-bold flex items-center gap-1 pt-1">
                                <Paperclip className="w-3.5 h-3.5" /> ফাইল: {mySubmission.fileName}
                              </div>
                            )}
                          </div>

                          {/* Teacher Feedback Card */}
                          {mySubmission.feedback && (
                            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-slate-900/5 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-500/40 p-4 sm:p-5 rounded-2xl shadow-inner space-y-2.5 relative overflow-hidden">
                              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-2">
                                <div className="flex items-center gap-2 text-[#1DB954] font-black text-xs sm:text-sm">
                                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                                  <span>টিচার ফিডব্যাক ও মূল্যায়িত মন্তব্য</span>
                                </div>
                                <span className="px-2.5 py-0.5 bg-[#1DB954] text-white font-mono font-black text-xs rounded-lg shadow-sm">
                                  {mySubmission.points} / {asgn.totalPoints}
                                </span>
                              </div>
                              <p className="text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold leading-relaxed">
                                "{mySubmission.feedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedAsgn(asgn)}
                          className="w-full py-3.5 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 transform active:scale-[0.99]"
                        >
                          <Send className="w-4 h-4" />
                          <span>অ্যাসাইনমেন্ট উত্তর ও ফাইল জমা দিন</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB TAB: PROFILE EDIT */}
        {activeSubTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 max-w-3xl mx-auto space-y-6 shadow-xl font-bengali">
            {/* Header Title Bar */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-[#1DB954]" /> স্টুডেন্ট মাই প্রোফাইল & অ্যাকাউন্ট সেটিংস
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  প্রোফাইল ছবি, ব্যক্তিগত তথ্য, শিক্ষা প্রতিষ্ঠান ও বায়ো আপডেট করুন।
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-[#1DB954] border border-emerald-500/30 font-bold text-xs rounded-full flex items-center gap-1.5 shrink-0">
                <Shield className="w-3.5 h-3.5 text-[#1DB954]" /> ভেরিফাইড স্টুডেন্ট একাউন্ট
              </span>
            </div>

            {profSaved && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
                <Check className="w-5 h-5" /> প্রোফাইল তথ্য সফলভাবে আপডেট ও সংরক্ষণ করা হয়েছে!
              </div>
            )}

            {/* Profile Avatar Card */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={profAvatar || currentUser.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-2xl sm:rounded-3xl object-cover border-4 border-[#1DB954]/50 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1DB954] text-white flex items-center justify-center font-bold text-xs border-2 border-slate-900 shadow">
                  ✓
                </span>
              </div>

              <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  প্রোফাইল ছবি নির্বাচন (ডিভাইস থেকে ফাইল আপলোড বা লিংক)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="px-4 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow transition-all w-full sm:w-auto">
                    <Upload className="w-4 h-4" />
                    <span>ছবি আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, setProfAvatar)}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="অথবা ছবি URL পেস্ট করুন..."
                    value={profAvatar}
                    onChange={e => setProfAvatar(e.target.value)}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  মোবাইল বা কম্পিউটারের গ্যালারি থেকে যেকোনো JPG / PNG ছবি বেছে নিন।
                </p>
              </div>
            </div>

            {/* Profile Information Form */}
            <form onSubmit={handleProfileSave} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পূর্ণ নাম (Full Name) *
                  </label>
                  <input
                    type="text"
                    value={profName}
                    onChange={e => setProfName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শিক্ষা প্রতিষ্ঠান / স্কুল / কলেজ / বিশ্ববিদ্যালয়
                  </label>
                  <input
                    type="text"
                    value={profInstitution}
                    onChange={e => setProfInstitution(e.target.value)}
                    placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় / আইডিয়াল কলেজ"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর (Phone Number)
                  </label>
                  <input
                    type="text"
                    value={profMobile}
                    onChange={e => setProfMobile(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল ঠিকানা (Email Address)
                  </label>
                  <input
                    type="email"
                    value={profEmail}
                    onChange={e => setProfEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত বায়ো ও আইটি ক্যারিয়ার লক্ষ্য (Bio & Goals)
                </label>
                <textarea
                  rows={3}
                  value={profBio}
                  onChange={e => setProfBio(e.target.value)}
                  placeholder="আপনার আইটি ক্যারিয়ারের লক্ষ্য, আগ্রহ বা দক্ষতা সংক্ষেপে লিখুন..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>প্রোফাইল পরিবর্তন তথ্য সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        )}

        {/* ASSIGNMENT SUBMISSION MODAL */}
        {selectedAsgn && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-[#142B4D] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4 my-auto">
              <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#1DB954]" /> উত্তর ও ফাইল জমা দিন
                </h3>
                <button onClick={() => setSelectedAsgn(null)} className="text-slate-400 hover:text-white p-1">✕</button>
              </div>

              <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700 text-xs space-y-1">
                <p className="font-bold text-white">{selectedAsgn.title}</p>
                <p className="text-slate-300">{selectedAsgn.description}</p>
              </div>

              {subSuccess && (
                <div className="p-3 bg-emerald-500/20 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" /> আপনার কাজ সফলভাবে জমা দেওয়া হয়েছে!
                </div>
              )}

              <form onSubmit={handleAssignmentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">উত্তর বিবরণ / নোট লিখুন</label>
                  <textarea
                    rows={4}
                    value={subText}
                    onChange={e => setSubText(e.target.value)}
                    placeholder="আপনার কাজের বিবরণ বা লিংক এখানে লিখুন..."
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>

                {/* Direct Attachment Upload */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">অ্যাসাইনমেন্ট ফাইল / ডকুমেন্ট পিক করুন</label>
                  <input
                    type="file"
                    onChange={e => handleFileUpload(e, setSubFileUrl, setSubFileName)}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1DB954] file:text-white cursor-pointer"
                  />
                  {subFileName && (
                    <span className="text-[11px] text-[#1DB954] mt-1 block">✓ সংযুক্ত ফাইল: {subFileName}</span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAsgn(null)}
                    className="w-1/2 py-3 bg-slate-700 text-white font-bold rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md"
                  >
                    সাবমিট করুন
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 1. CLASS DRIVE & RESOURCES MODAL */}
        {activeResourceModal && (
          <div className="fixed inset-[#000000] z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-bengali">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-sky-500/20 text-sky-400 rounded-2xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{activeResourceModal.title}</h3>
                    <p className="text-xs text-sky-400 font-medium">ক্লাস রিসোর্স, সোর্স কোড ও ড্রাইভ ফাইলস</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveResourceModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">১. লেকচার নোটস ও ক্লাস গাইডলাইন PDF</p>
                      <p className="text-[11px] text-slate-400">সাইজ: ৪.২ MB • ফরম্যাট: PDF Document</p>
                    </div>
                  </div>
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('লেকচার নোটস PDF ডাউনলোড শুরু হয়েছে!'); }}
                    className="px-3 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> ডাউনলোড
                  </a>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">২. প্র্যাকটিস প্রজেক্ট সোর্স কোড (ZIP)</p>
                      <p className="text-[11px] text-slate-400">সাইজ: ১৮.৫ MB • ফরম্যাট: ZIP Archive</p>
                    </div>
                  </div>
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('সোর্স কোড ZIP ফাইল ডাউনলোড শুরু হয়েছে!'); }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center gap-1 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" /> ডাউনলোড
                  </a>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white text-xs">৩. অফিশিয়াল গুগল ড্রাইভ ফোল্ডার</p>
                      <p className="text-[11px] text-slate-400">সকল ক্লাসের ভিডিও ব্যাকআপ ও রিসোর্স লিংক</p>
                    </div>
                  </div>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center gap-1 shrink-0"
                  >
                    ড্রাইভ খুলুন
                  </a>
                </div>
              </div>

              <button
                onClick={() => setActiveResourceModal(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}

        {/* 2. LIVE CLASS LINK & ROUTINE MODAL */}
        {activeLiveClassModal && (
          <div className="fixed inset-[#000000] z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-bengali">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl">
                    <Video className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{activeLiveClassModal.title}</h3>
                    <p className="text-xs text-rose-400 font-medium">গুগল মিট / জুম লাইভ ক্লাস রুম</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveLiveClassModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-rose-950/60 to-slate-800 p-4 rounded-2xl border border-rose-500/30 text-xs space-y-2 text-center">
                <p className="text-rose-400 font-bold flex items-center justify-center gap-1.5 text-sm">
                  <Clock className="w-4 h-4" /> আগামী লাইভ ক্লাস: আজ রাত ৯:০০ টা
                </p>
                <p className="text-slate-300">সাপ্তাহিক দিনসমূহ: শনি, সোম ও বুধবার রাত ৯:০০ PM - ১০:৩০ PM</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                  <p className="font-bold text-slate-300">গুগল মিট জয়েন লিংক:</p>
                  <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-700 font-mono text-emerald-400 text-xs overflow-x-auto">
                    <span>https://meet.google.com/ptenit-live-class</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('https://meet.google.com/ptenit-live-class');
                        alert('লাইভ ক্লাস লিংক কপি করা হয়েছে!');
                      }}
                      className="w-1/2 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition cursor-pointer text-xs"
                    >
                      লিংক কপি করুন
                    </button>
                    <a
                      href="https://meet.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-1/2 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white font-black rounded-xl transition text-center text-xs flex items-center justify-center gap-1 shadow-md"
                    >
                      <Video className="w-4 h-4" /> ক্লাসে প্রবেশ করুন
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveLiveClassModal(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        )}

        {/* 3. CURRICULUM SYLLABUS MODAL */}
        {activeCurriculumModal && (
          <div className="fixed inset-[#000000] z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-bengali">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white space-y-6 shadow-2xl relative">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-[#1DB954] rounded-2xl">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{activeCurriculumModal.title}</h3>
                    <p className="text-xs text-emerald-400 font-medium">কোর্স সিলেবাস ও মডিউল অগ্রগতি breakdown</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCurriculumModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1">
                {[
                  { module: 'মডিউল ০১: পরিচিতি, এনভায়রনমেন্ট সেটআপ ও ক্লাউড টুলস', duration: '৪৫ মিনিট', status: 'completed' },
                  { module: 'মডিউল ০২: ফান্ডামেন্টালস, কোর কনসেপ্ট ও বেসিক ডিজাইন', duration: '১ ঘণ্টা ২০ মিনিট', status: 'completed' },
                  { module: 'মডিউল ০৩: প্র্যাকটিক্যাল কেস স্টাডি ও রিয়েল প্রজেক্ট বিল্ডিং', duration: '২ ঘণ্টা ১০ মিনিট', status: 'in_progress' },
                  { module: 'মডিউল ০৪: অ্যাডভান্সড ফিচারস, পারফরম্যান্স ও সিকিউরিটি', duration: '১ ঘণ্টা ৪৫ মিনিট', status: 'upcoming' },
                  { module: 'মডিউল ০৫: ক্লায়েন্ট হ্যান্ডলিং, মার্কেটপ্লেস ও পোর্টফোলিও', duration: '২ ঘণ্টা ৫০ মিনিট', status: 'upcoming' },
                ].map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-white text-xs">{mod.module}</p>
                      <p className="text-[11px] text-slate-400">সময়সীমা: {mod.duration}</p>
                    </div>
                    {mod.status === 'completed' && (
                      <span className="px-2.5 py-1 bg-emerald-500/20 text-[#1DB954] border border-emerald-500/30 font-bold text-[10px] rounded-lg shrink-0 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> সম্পন্ন
                      </span>
                    )}
                    {mod.status === 'in_progress' && (
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px] rounded-lg shrink-0 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> চলমান
                      </span>
                    )}
                    {mod.status === 'upcoming' && (
                      <span className="px-2.5 py-1 bg-slate-700 text-slate-400 font-bold text-[10px] rounded-lg shrink-0">
                        সামনে আসবে
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActiveCurriculumModal(null);
                    onStartLearning(activeCurriculumModal.id);
                  }}
                  className="w-full py-3 bg-[#1DB954] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" /> লার্নিং প্লেয়ার খুলুন
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
