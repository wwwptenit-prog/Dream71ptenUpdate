import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  User,
  Send,
  Sparkles,
  MessageSquare,
  Building,
  DollarSign,
  Phone,
  Mail,
  Check,
  Paperclip,
  CheckCircle,
  Globe,
  LogOut,
  Sun,
  Moon,
  Home,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  Bell
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface CustomerDashboardProps {
  setActiveTab?: (tab: string) => void;
  initialTab?: 'projects' | 'new-request' | 'inquiries' | 'profile';
  hideHeaderBanner?: boolean;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ setActiveTab, initialTab = 'projects', hideHeaderBanner = false }) => {
  const {
    lang,
    setLang,
    t,
    darkMode,
    toggleDarkMode,
    currentUser,
    services,
    customerProjects,
    contactMessages,
    createCustomerProject,
    sendContactMessage,
    updateProfile,
    logout
  } = useData();

  const [activeTab, setActiveTabState] = useState<'projects' | 'new-request' | 'inquiries' | 'profile'>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTabState(initialTab);
    }
  }, [initialTab]);

  // New Service Request Form
  const [serviceTitle, setServiceTitle] = useState('');
  const [category, setCategory] = useState(services[0]?.title || 'Web Development');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('৳১৫,০০০ - ৳৩০,০০০');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // New Inquiry / Message Form
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Profile Edit
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.mobile || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileInstitution, setProfileInstitution] = useState(currentUser?.institution || 'মেসার্স ট্রেডিং কোম্পানি');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || 'PTENit-এর সম্মানিত ক্লায়েন্ট');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // File Upload Helper
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

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle || !description) return;

    createCustomerProject({
      customerId: currentUser?.id || 'cust-1',
      customerName: currentUser?.name || 'Customer',
      customerEmail: currentUser?.email || 'customer@ptenit.com',
      customerPhone: currentUser?.mobile || '01700000000',
      serviceTitle,
      category,
      description,
      budgetRange,
      attachmentName,
      attachmentUrl
    });

    setServiceTitle('');
    setDescription('');
    setAttachmentName('');
    setAttachmentUrl('');
    setRequestSubmitted(true);
    setTimeout(() => {
      setRequestSubmitted(false);
      setActiveTabState('projects');
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody) return;

    sendContactMessage({
      name: currentUser?.name || 'Customer',
      phone: currentUser?.mobile || '01700000000',
      email: currentUser?.email || 'customer@ptenit.com',
      serviceOrCourse: msgSubject || 'সার্ভিস সংক্রান্ত বিষয়',
      message: msgBody
    });

    setMsgSubject('');
    setMsgBody('');
    setMsgSentSuccess(true);
    setTimeout(() => setMsgSentSuccess(false), 3000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      mobile: profilePhone,
      email: profileEmail,
      institution: profileInstitution,
      bio: profileBio,
      avatar: profileAvatar
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const myProjects = customerProjects;
  const myMessages = contactMessages;

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 py-3 sm:py-6 md:py-8 pb-28 lg:pb-8 transition-colors font-bengali">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12">
        
        {/* MOBILE APP TOP HEADER (Visible on Mobile & Tablet < lg) */}
        {!hideHeaderBanner && (
          <div className="lg:hidden bg-slate-900 border border-slate-800 p-2.5 px-3 rounded-2xl shadow-lg mb-4 flex items-center justify-between gap-2 text-white font-bengali sticky top-2 z-30">
            {/* Left: Dashboard Icon + Text */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 bg-gradient-to-tr from-[#1DB954] to-emerald-400 text-slate-950 rounded-xl shadow shrink-0">
                <LayoutDashboard className="w-5 h-5 font-bold" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white truncate">
                গ্রাহক ড্যাশবোর্ড
              </span>
            </div>

            {/* Right: Profile Button & Menu Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTabState('profile')}
                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition active:scale-95 cursor-pointer min-h-[38px] ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                }`}
                title="প্রোফাইল"
              >
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="hidden xs:inline">প্রোফাইল</span>
              </button>

              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2 bg-slate-800 text-amber-400 rounded-xl border border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer min-h-[38px] min-w-[38px]"
                title={darkMode ? 'লাইট মোড' : 'নাইট মোড'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition active:scale-95 cursor-pointer min-h-[38px] min-w-[38px]"
                aria-label="মেনু বাটন"
                title="মেনু"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SLIDE-OVER MOBILE DRAWER (~50% Screen Width) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop: Clicking outside closes drawer */}
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Panel (50% Width / max-w-[280px]) */}
            <div className="relative w-1/2 min-w-[200px] max-w-[280px] bg-slate-900 border-l border-slate-800 h-full p-4 text-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10 font-bengali transition-transform duration-300 ease-in-out">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={currentUser?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"}
                      alt={currentUser?.name}
                      className="w-8 h-8 rounded-lg object-cover border border-blue-400/50 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs truncate">{currentUser?.name}</h3>
                      <p className="text-[10px] text-blue-300 truncate">{currentUser?.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition cursor-pointer"
                    title="বন্ধ করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Menu Items */}
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-extrabold text-slate-400 px-1 mb-1">মেনু নেভিগেশন</p>

                  {[
                    { id: 'projects', label: 'সার্ভিস আবেদন', icon: Briefcase, badge: myProjects.length },
                    { id: 'new-request', label: '+ নতুন রিকুয়েস্ট', icon: PlusCircle },
                    { id: 'inquiries', label: 'সাপোর্ট মেসেজ', icon: MessageSquare, badge: myMessages.length },
                    { id: 'profile', label: 'প্রোফাইল এডিট', icon: User },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => {
                          setActiveTabState(tab.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full py-2.5 px-2.5 font-bold text-xs flex items-center justify-between rounded-lg transition cursor-pointer min-h-[40px] ${
                          isActive
                            ? 'bg-blue-600 text-white shadow font-black'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full shrink-0 ${
                            isActive ? 'bg-white text-blue-900' : 'bg-blue-600 text-white'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-3 mt-2 border-t border-slate-800 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveTab?.('marketplace');
                      }}
                      className="w-full py-2 px-2.5 font-bold text-xs flex items-center gap-2 text-emerald-400 hover:bg-slate-800 rounded-lg transition min-h-[40px]"
                    >
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">মার্কেটপ্লেস</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveTab?.('home');
                      }}
                      className="w-full py-2 px-2.5 font-bold text-xs flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg transition min-h-[40px]"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">ওয়েবসাইট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                      className="w-full py-2 px-2.5 font-bold text-xs flex items-center gap-2 text-slate-300 hover:bg-slate-800 rounded-lg transition min-h-[40px]"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                      <span className="truncate">ভাষা: {lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Logout at bottom of drawer */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  setActiveTab?.('home');
                }}
                className="w-full py-2.5 px-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs rounded-lg border border-rose-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[40px] mt-4"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        )}

        {/* DESKTOP TOP BAR (Hidden on mobile) */}
        {!hideHeaderBanner && (
          <div className="hidden lg:flex bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg mb-4 sm:mb-6 flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-white font-bengali">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1DB954] to-emerald-400 flex items-center justify-center font-black text-white text-base shadow shrink-0">
                P
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-xs sm:text-base tracking-wide text-white block leading-tight truncate">
                  PTENit IT Training Academy
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold block truncate">
                  কাস্টমার & পার্টনার পোর্টাল
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95 min-h-[38px]"
                title="ভাষা পরিবর্তন / Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
              </button>

              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-1.5 min-h-[38px] min-w-[38px] bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center transition cursor-pointer shadow-sm active:scale-95"
                title={darkMode ? 'লাইট মোড অন করুন' : 'নাইট মোড অন করুন'}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab?.('marketplace')}
                className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md active:scale-95 min-h-[38px]"
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">মার্কেটপ্লেস</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab?.('home')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95 min-h-[38px]"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>ওয়েবসাইট</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setActiveTab?.('home');
                }}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95 min-h-[38px]"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        )}

        {/* PC Control Panel Layout: Sidebar (Left) + Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* LEFT SIDEBAR / PC CONTROL PANEL NAVIGATION (Hidden on mobile, visible on lg) */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3 space-y-4">
            
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3.5 relative z-10 mb-4">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"}
                  alt={currentUser?.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-400/50 shadow-md shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-base sm:text-lg font-black truncate">{currentUser?.name}</h2>
                  <p className="text-xs text-blue-300 font-medium truncate">{currentUser?.institution || 'PTENit ক্লায়েন্ট পোর্টাল'}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold mt-1">
                    <Briefcase className="w-3 h-3 shrink-0" /> ক্লায়েন্ট অ্যাকাউন্ট
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1 pt-3 border-t border-slate-800/80">
                <p className="truncate"><strong className="text-slate-400 font-normal">ইমেইল:</strong> {currentUser?.email}</p>
                <p className="truncate"><strong className="text-slate-400 font-normal">ফোন:</strong> {currentUser?.mobile}</p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setActiveTabState('new-request')}
                className="w-full mt-4 min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span>+ নতুন প্রজেক্ট রিকুয়েস্ট করুন</span>
              </button>
            </div>

            {/* Quick Stats Widget Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 block mb-2.5">
                প্রজেক্ট ওভারভিউ স্ট্যাটস:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold block truncate">মোট আবেদন</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5 block">{myProjects.length} টি</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold block truncate">চলমান কাজ</span>
                  <span className="text-lg font-black text-amber-500 mt-0.5 block">
                    {myProjects.filter(p => p.status === 'in_progress').length} টি
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold block truncate">সম্পন্ন কাজ</span>
                  <span className="text-lg font-black text-[#1DB954] mt-0.5 block">
                    {myProjects.filter(p => p.status === 'completed').length} টি
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold block truncate">সাপোর্ট মেসেজ</span>
                  <span className="text-lg font-black text-emerald-500 mt-0.5 block">{myMessages.length} টি</span>
                </div>
              </div>
            </div>

            {/* PC Navigation Side Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
              <div className="px-3.5 py-2.5 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                  <span className="uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 truncate">ড্যাশবোর্ড কন্ট্রোল মেনু</span>
                </div>
              </div>

              <div className="p-2 space-y-1.5">
                {[
                  { id: 'projects', label: 'আমার সার্ভিস আবেদনসমূহ', icon: Briefcase, badge: myProjects.length },
                  { id: 'new-request', label: '+ নতুন সার্ভিস রিকুয়েস্ট', icon: PlusCircle },
                  { id: 'inquiries', label: 'সাপোর্ট মেসেজ & ইনকোয়ারি', icon: MessageSquare, badge: myMessages.length },
                  { id: 'profile', label: 'ক্লায়েন্ট প্রোফাইল এডিট', icon: User },
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTabState(tab.id as any)}
                      className={`w-full py-2.5 px-3.5 font-bold text-xs sm:text-sm flex items-center justify-between rounded-xl transition-all cursor-pointer min-h-[44px] ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shrink-0 ${
                          isActive ? 'bg-white text-blue-900' : 'bg-blue-600 text-white'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT MAIN CANVAS / CONTENT VIEW */}
          <div className="lg:col-span-8 xl:col-span-9">

        {/* TAB 1: MY PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">আবেদনকৃত প্রজেক্ট ও সার্ভিসসমূহ</h2>

            {myProjects.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">আপনি এখনো কোনো আইটি বা ডিজিটাল সার্ভিসের জন্য আবেদন করেননি।</p>
                <button
                  type="button"
                  onClick={() => setActiveTabState('new-request')}
                  className="px-6 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  নতুন সার্ভিস অর্ডার করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
                {myProjects.map(prj => {
                  const getStatusBadge = (st: string) => {
                    if (st === 'completed') return <span className="px-2.5 py-1 bg-emerald-500/10 text-[#1DB954] text-[11px] sm:text-xs font-bold rounded-full border border-emerald-500/20 shrink-0">সম্পন্ন হয়েছে</span>;
                    if (st === 'in_progress') return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[11px] sm:text-xs font-bold rounded-full border border-amber-500/20 shrink-0">কাজ চলছে</span>;
                    return <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 text-[11px] sm:text-xs font-bold rounded-full border border-blue-500/20 shrink-0">পর্যালোচনায় রয়েছে</span>;
                  };

                  return (
                    <div key={prj.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                          <span className="text-[11px] sm:text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                            {prj.category}
                          </span>
                          {getStatusBadge(prj.status)}
                        </div>

                        <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug break-words">{prj.serviceTitle}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
                          {prj.description}
                        </p>

                        {prj.attachmentName && (
                          <div className="mb-4 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="font-medium truncate flex-1">{prj.attachmentName}</span>
                            <a href={prj.attachmentUrl} download={prj.attachmentName} className="text-blue-500 font-bold hover:underline shrink-0 p-1 min-h-[36px] flex items-center">
                              ডাউনলোড
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span>বাজেট: <strong className="text-slate-900 dark:text-white font-bold">{prj.budgetRange}</strong></span>
                        <span className="text-[11px] sm:text-xs">তারিখ: {prj.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NEW REQUEST FORM */}
        {activeTab === 'new-request' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-500 shrink-0" /> নতুন আইটি ও ডিজিটাল সার্ভিসের জন্য আবেদন
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                আপনার কাঙ্ক্ষিত ওয়েবসাইট, সফটওয়্যার বা মার্কেটিং প্রজেক্টের বিস্তারিত তথ্য লিখুন।
              </p>
            </div>

            {requestSubmitted && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>আপনার সার্ভিসের রিকুয়েস্ট সফলভাবে PTENit টিমকে পাঠানো হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">ক্যাটাগরি বা বিষয় নির্বাচন করুন</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  required
                >
                  <option value="ওয়েবসাইট ও সফটওয়্যার ডেভেলপমেন্ট">ওয়েবসাইট ও সফটওয়্যার ডেভেলপমেন্ট</option>
                  <option value="ডিজিটাল মার্কেটিং ও এসইও">ডিজিটাল মার্কেটিং ও এসইও</option>
                  <option value="গ্রাফিক ডিজাইন ও ব্র্যান্ডিং">গ্রাফিক ডিজাইন ও ব্র্যান্ডিং</option>
                  <option value="ভিডিও এডিটিং ও এনিমেশন">ভিডিও এডিটিং ও এনিমেশন</option>
                  <option value="অন্যান্য আইটি সাপোর্ট">অন্যান্য আইটি সাপোর্ট</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">প্রজেক্ট / সার্ভিসের শিরোনাম</label>
                <input
                  type="text"
                  value={serviceTitle}
                  onChange={e => setServiceTitle(e.target.value)}
                  placeholder="যেমন: ই-কমার্স ওয়েবসাইট তৈরি ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন"
                  className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">প্রজেক্টের আনুমানিক বাজেট</label>
                <select
                  value={budgetRange}
                  onChange={e => setBudgetRange(e.target.value)}
                  className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                >
                  <option value="৳৫,০০০ - ৳১৫,০০০">৳৫,০০০ - ৳১৫,০০০</option>
                  <option value="৳১৫,০০০ - ৳৩০,০০০">৳১৫,০০০ - ৳৩০,০০০</option>
                  <option value="৳৩০,০০০ - ৳৫০,০০০">৳৩০,০০০ - ৳৫০,০০০</option>
                  <option value="৳৫০,০০০+ (কাস্টম)">৳৫০,০০০+ (কাস্টম)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">প্রজেক্টের বিস্তারিত বর্ণনা</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="আপনার কাঙ্ক্ষিত ফিচারের বিস্তারিত বিবরণ দিন..."
                  className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">ফাইল ও রেফারেন্স ফাইল (Doc/PDF/Image)</label>
                <input
                  type="file"
                  onChange={e => handleFileUpload(e, setAttachmentUrl, setAttachmentName)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer min-h-[44px]"
                />
                {attachmentName && (
                  <span className="text-[11px] text-blue-500 font-medium block mt-1">✓ ফাইল নির্বাচিত: {attachmentName}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 min-h-[48px] active:scale-98"
              >
                <Send className="w-4 h-4 shrink-0" /> সার্ভিস সাবমিট করুন
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: INQUIRIES & MESSAGES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500 shrink-0" /> PTENit টিমের সাথে সরাসরি ইনকোয়ারি ও যোগাযোগ
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার কোনো জিজ্ঞাসা বা সাপোর্ট লাগলে সরাসরি মেসেজ পাঠান।
              </p>

              {msgSentSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>মেসেজটি সফলভাবে পাঠানো হয়েছে! দ্রুত রিপ্লাই দেওয়া হবে।</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">বিষয় / সাবজেক্ট</label>
                  <input
                    type="text"
                    value={msgSubject}
                    onChange={e => setMsgSubject(e.target.value)}
                    placeholder="যেমন: ই-কমার্স ওয়েবসাইটের কোটেশন রিলেটেড ইনকোয়ারি"
                    className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">আপনার মেসেজ</label>
                  <textarea
                    rows={3}
                    value={msgBody}
                    onChange={e => setMsgBody(e.target.value)}
                    placeholder="আপনার প্রশ্ন বা বক্তব্যের মূল বার্তা লিখুন..."
                    className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-98 transition-all"
                >
                  মেসেজ পাঠান
                </button>
              </form>
            </div>

            {/* Previous Messages List */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">পূর্বে প্রেরিত মেসেজসমূহ</h3>

              <div className="space-y-3">
                {myMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">পূর্বে কোনো মেসেজ পাঠানো হয়নি।</p>
                ) : (
                  myMessages.map(m => (
                    <div key={m.id} className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-blue-600 dark:text-blue-400 truncate">{m.serviceOrCourse}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{m.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5 sm:space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500 shrink-0" /> ক্লায়েন্ট প্রোফাইল এডিট
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                আপনার বাণিজ্যিক প্রতিষ্ঠান ও কন্টাক্ট ইনফরমেশন পরিবর্তন করুন।
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={profileAvatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md shrink-0"
                />

                <div className="space-y-1.5 flex-1 w-full">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">
                    ছবি আপলোড করুন (Device Upload)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, setProfileAvatar)}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">পূর্ণ নাম</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">প্রতিষ্ঠান / কোম্পানি</label>
                  <input
                    type="text"
                    value={profileInstitution}
                    onChange={e => setProfileInstitution(e.target.value)}
                    className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">সংক্ষিপ্ত নোট / পরিচিতি</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  className="w-full p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer min-h-[48px] active:scale-98"
              >
                প্রোফাইল তথ্য সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

          </div>
        </div>

        {/* FIXED MOBILE BOTTOM APP NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white shadow-2xl px-1 py-1.5 flex items-center justify-around font-bengali">
          {/* 1. Home Icon */}
          <button
            type="button"
            onClick={() => setActiveTab?.('home')}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-1 py-1 text-slate-400 hover:text-white transition cursor-pointer active:scale-95"
            title="হোম"
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[10px] font-bold tracking-tight">হোম</span>
          </button>

          {/* 2. Order Icon */}
          <button
            type="button"
            onClick={() => setActiveTabState('projects')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-1 py-1 transition cursor-pointer active:scale-95 relative ${
              activeTab === 'projects' ? 'text-[#1DB954] font-black' : 'text-slate-400 hover:text-white font-medium'
            }`}
            title="অর্ডার"
          >
            <Briefcase className="w-5 h-5 shrink-0" />
            <span className="text-[10px]">অর্ডার</span>
            {myProjects.length > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-[#1DB954]" />
            )}
          </button>

          {/* 3. Course Icon */}
          <button
            type="button"
            onClick={() => setActiveTab?.('marketplace')}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-1 py-1 text-slate-400 hover:text-white transition cursor-pointer active:scale-95"
            title="কোর্স"
          >
            <BookOpen className="w-5 h-5 shrink-0 text-emerald-400" />
            <span className="text-[10px] font-bold">কোর্স</span>
          </button>

          {/* 4. Messenger Icon */}
          <button
            type="button"
            onClick={() => setActiveTabState('inquiries')}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-1 py-1 transition cursor-pointer active:scale-95 relative ${
              activeTab === 'inquiries' ? 'text-[#1DB954] font-black' : 'text-slate-400 hover:text-white font-medium'
            }`}
            title="মেসেঞ্জার"
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span className="text-[10px]">মেসেঞ্জার</span>
            {myMessages.length > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </button>

          {/* 5. Notification Icon */}
          <button
            type="button"
            onClick={() => setActiveTabState('inquiries')}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] px-1 py-1 text-slate-400 hover:text-amber-400 transition cursor-pointer active:scale-95 relative"
            title="নোটিফিকেশন"
          >
            <Bell className="w-5 h-5 shrink-0 text-amber-400" />
            <span className="text-[10px] font-bold">নোটিফিকেশন</span>
            {(myProjects.length > 0 || myMessages.length > 0) && (
              <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
