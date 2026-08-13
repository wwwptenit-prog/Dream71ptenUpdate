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
  Moon
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
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 py-4 sm:py-8 transition-colors font-bengali">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {!hideHeaderBanner && (
          <>
            {/* Dedicated Standalone Dashboard Top Bar */}
            <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg mb-6 flex flex-wrap items-center justify-between gap-3 text-white font-bengali">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1DB954] to-emerald-400 flex items-center justify-center font-black text-white text-base shadow">
                  P
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base tracking-wide text-white block leading-none">
                    PTENit IT Training Academy
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    কাস্টমার & পার্টনার পোর্টাল
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Language Switcher */}
                <button
                  onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="ভাষা পরিবর্তন / Switch Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#1DB954]" />
                  <span>{lang === 'bn' ? 'ENG' : 'বাংলা'}</span>
                </button>

                {/* Night Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  title={darkMode ? 'লাইট মোড অন করুন' : 'নাইট মোড অন করুন'}
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                </button>

                <button
                  onClick={() => setActiveTab?.('marketplace')}
                  className="px-3.5 py-1.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>মার্কেটপ্লেস (গিগ & জবস)</span>
                </button>
                <button
                  onClick={() => setActiveTab?.('home')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>মূল ওয়েবসাইট</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setActiveTab?.('home');
                  }}
                  className="px-3.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
            
            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-[#142B4D] rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-blue-500/20 mb-6 sm:mb-8 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
                <img
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"}
                  alt={currentUser?.name}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover border-2 sm:border-4 border-blue-400/40 shadow-xl shrink-0"
                />

                <div className="space-y-1.5 flex-1 w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-xl sm:text-3xl font-black">{currentUser?.name}</h1>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full font-bold flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" /> কাস্টমার ড্যাশবোর্ড
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium">{currentUser?.institution || 'PTENit ক্লায়েন্ট পোর্টাল'}</p>
                  <p className="text-slate-400 text-[11px] sm:text-xs">{currentUser?.email} • {currentUser?.mobile}</p>
                </div>

                <button
                  onClick={() => setActiveTabState('new-request')}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>নতুন প্রজেক্ট রিকুয়েস্ট করুন</span>
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-700/60">
                <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
                  <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">মোট সার্ভিস আবেদন</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-300">{myProjects.length} টি</span>
                </div>
                <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
                  <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">চলমান প্রজেক্ট</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-300">
                    {myProjects.filter(p => p.status === 'in_progress').length} টি
                  </span>
                </div>
                <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
                  <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">সম্পন্ন প্রজেক্ট</span>
                  <span className="text-xl sm:text-2xl font-black text-[#1DB954]">
                    {myProjects.filter(p => p.status === 'completed').length} টি
                  </span>
                </div>
                <div className="bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-700/80 shadow-inner">
                  <span className="text-slate-400 text-[11px] sm:text-xs font-semibold block">সাপোর্ট মেসেজ</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-300">{myMessages.length} টি</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Full Dashboard Menubar with Header & Extensible Navigation Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md mb-6 sm:mb-8 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400">বায়ার ড্যাশবোর্ড মেনুবার (Customer Menubar):</span>
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-mono">
              + সার্ভিস ও অর্ডার ফ্রেমওয়ার্ক
            </span>
          </div>

          <div className="p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'projects', label: 'আমার সার্ভিস আবেদনসমূহ', icon: Briefcase, badge: myProjects.length },
              { id: 'new-request', label: '+ নতুন সার্ভিস রিকুয়েস্ট', icon: PlusCircle },
              { id: 'inquiries', label: 'মেসেজ ও ইনকোয়ারি', icon: MessageSquare, badge: myMessages.length },
              { id: 'profile', label: 'ক্লায়েন্ট প্রোফাইল আপডেট', icon: User },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabState(tab.id as any)}
                  className={`py-2.5 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
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

        {/* TAB 1: MY PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">আবেদনকৃত প্রজেক্ট ও সার্ভিসসমূহ</h2>

            {myProjects.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-sm text-slate-500 dark:text-slate-400">আপনি এখনো কোনো আইটি বা ডিজিটাল সার্ভিসের জন্য আবেদন করেননি।</p>
                <button
                  onClick={() => setActiveTabState('new-request')}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  নতুন সার্ভিস অর্ডার করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {myProjects.map(prj => {
                  const getStatusBadge = (st: string) => {
                    if (st === 'completed') return <span className="px-3 py-1 bg-emerald-500/10 text-[#1DB954] text-xs font-bold rounded-full border border-emerald-500/20">সম্পন্ন হয়েছে</span>;
                    if (st === 'in_progress') return <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">কাজ চলছে</span>;
                    return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full border border-blue-500/20">পর্যালোচনায় রয়েছে</span>;
                  };

                  return (
                    <div key={prj.id} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                            {prj.category}
                          </span>
                          {getStatusBadge(prj.status)}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">{prj.serviceTitle}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed line-clamp-3">
                          {prj.description}
                        </p>

                        {prj.attachmentName && (
                          <div className="mb-4 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                            <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="font-medium truncate flex-1">{prj.attachmentName}</span>
                            <a href={prj.attachmentUrl} download={prj.attachmentName} className="text-blue-500 font-bold hover:underline shrink-0">
                              ডাউনলোড
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                        <span>বাজেট: <strong className="text-slate-900 dark:text-white font-bold">{prj.budgetRange}</strong></span>
                        <span>তারিখ: {prj.createdAt}</span>
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
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-500" /> নতুন আইটি ও ডিজিটাল সার্ভিসের জন্য আবেদন
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                আপনার কাঙ্ক্ষিত ওয়েবসাইট, সফটওয়্যার বা মার্কেটিং প্রজেক্টের বিস্তারিত তথ্য লিখুন।
              </p>
            </div>

            {requestSubmitted && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>আপনার সার্ভিসের রিকুয়েস্ট সফলভাবে PTENit টিমকে পাঠানো হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ক্যাটাগরি বা বিষয় নির্বাচন করুন</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রজেক্ট / সার্ভিসের শিরোনাম</label>
                <input
                  type="text"
                  value={serviceTitle}
                  onChange={e => setServiceTitle(e.target.value)}
                  placeholder="যেমন: ই-কমার্স ওয়েবসাইট তৈরি ও পেমেন্ট গেটওয়ে ইন্টিগ্রেশন"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রজেক্টের আনুমানিক বাজেট</label>
                <select
                  value={budgetRange}
                  onChange={e => setBudgetRange(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="৳৫,০০০ - ৳১৫,০০০">৳৫,০০০ - ৳১৫,০০০</option>
                  <option value="৳১৫,০০০ - ৳৩০,০০০">৳১৫,০০০ - ৳৩০,০০০</option>
                  <option value="৳৩০,০০০ - ৳৫০,০০০">৳৩০,০০০ - ৳৫০,০০০</option>
                  <option value="৳৫০,০০০+ (কাস্টম)">৳৫০,০০০+ (কাস্টম)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রজেক্টের বিস্তারিত বর্ণনা</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="আপনার কাঙ্ক্ষিত ফিচারের বিস্তারিত বিবরণ দিন..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ফাইল ও রেফারেন্স ফাইল (Doc/PDF/Image)</label>
                <input
                  type="file"
                  onChange={e => handleFileUpload(e, setAttachmentUrl, setAttachmentName)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                />
                {attachmentName && (
                  <span className="text-[11px] text-blue-500 font-medium block mt-1">✓ ফাইল নির্বাচিত: {attachmentName}</span>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> সার্ভিস সাবমিট করুন
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: INQUIRIES & MESSAGES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> PTENit টিমের সাথে সরাসরি ইনকোয়ারি ও যোগাযোগ
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার কোনো জিজ্ঞাসা বা সাপোর্ট লাগলে সরাসরি মেসেজ পাঠান।
              </p>

              {msgSentSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>মেসেজটি সফলভাবে পাঠানো হয়েছে! দ্রুত রিপ্লাই দেওয়া হবে।</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বিষয় / সাবজেক্ট</label>
                  <input
                    type="text"
                    value={msgSubject}
                    onChange={e => setMsgSubject(e.target.value)}
                    placeholder="যেমন: ই-কমার্স ওয়েবসাইটের কোটেশন রিলেটেড ইনকোয়ারি"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">আপনার মেসেজ</label>
                  <textarea
                    rows={3}
                    value={msgBody}
                    onChange={e => setMsgBody(e.target.value)}
                    placeholder="আপনার প্রশ্ন বা বক্তব্যের মূল বার্তা লিখুন..."
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  মেসেজ পাঠান
                </button>
              </form>
            </div>

            {/* Previous Messages List */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">পূর্বে প্রেরিত মেসেজসমূহ</h3>

              <div className="space-y-3">
                {myMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">পূর্বে কোনো মেসেজ পাঠানো হয়নি।</p>
                ) : (
                  myMessages.map(m => (
                    <div key={m.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{m.serviceOrCourse}</span>
                        <span className="text-[10px] text-slate-400">{m.createdAt}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE EDIT */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> ক্লায়েন্ট প্রোফাইল এডিট
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                আপনার বাণিজ্যিক প্রতিষ্ঠান ও কন্টাক্ট ইনফরমেশন পরিবর্তন করুন।
              </p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-[#1DB954] text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>প্রোফাইল সফলভাবে আপডেট করা হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
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
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">প্রতিষ্ঠান / কোম্পানি</label>
                  <input
                    type="text"
                    value={profileInstitution}
                    onChange={e => setProfileInstitution(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সংক্ষিপ্ত নোট / পরিচিতি</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={e => setProfileBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                প্রোফাইল তথ্য সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
