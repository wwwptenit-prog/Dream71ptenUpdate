import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  BookOpen,
  Moon,
  Sun,
  Sparkles,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  Globe,
  BadgeCheck,
  Award
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  openCourseDetail: (courseId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openAuthModal,
  openCourseDetail
}) => {
  const {
    lang,
    setLang,
    t,
    darkMode,
    toggleDarkMode,
    courses,
    services,
    siteSettings
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Inline Search State
  const [inlineSearchOpen, setInlineSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { id: 'home', label: t('হোম', 'Home') },
    { id: 'services', label: t('সার্ভিস', 'Services') },
    { id: 'courses', label: t('কোর্স', 'Courses') },
    { id: 'marketplace', label: t('মার্কেটপ্লেস', 'Marketplace'), highlight: true },
    { id: 'about', label: t('সম্পর্কে', 'About') },
    { id: 'gallery', label: t('গ্যালারি', 'Gallery') },
    { id: 'contact', label: t('যোগাযোগ', 'Contact') },
  ];

  const filteredCourses = searchQuery.trim()
    ? courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const filteredServices = searchQuery.trim()
    ? services.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Auto focus search input when search is opened
  useEffect(() => {
    if (inlineSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [inlineSearchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Slim Header Bar - Hidden on mobile/phone screens */}
      <div className="hidden md:block bg-[#142B4D] text-white text-[11px] sm:text-xs py-1 sm:py-1.5 px-3 sm:px-4 border-b border-slate-700/50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-slate-300 font-medium text-[11px] sm:text-xs">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>{siteSettings.phone}</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:inline-block">
              {siteSettings.email}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <button
              onClick={() => {
                setActiveTab('verify');
              }}
              className="hover:text-emerald-400 text-slate-300 transition-colors text-[11px] sm:text-xs underline cursor-pointer shrink-0 font-bengali"
            >
              {t('সার্টিফিকেট ভেরিফাই', 'Verify Certificate')}
            </button>
            <span className="text-slate-600">|</span>
            {/* Single Official Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600/30 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold cursor-pointer shrink-0"
              title={lang === 'bn' ? 'English - এ পরিবর্তিত করুন' : 'Switch to Bangla'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation - Slim & Sleek */}
      <nav className="glass-nav border-b border-slate-700/60 text-white shadow-lg relative">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
            
            {/* Logo */}
            <div
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
              onClick={() => setActiveTab('home')}
            >
              {siteSettings.logoUrl ? (
                <img src={siteSettings.logoUrl} alt="PTENit Logo" className="h-8 sm:h-9 w-auto max-w-[120px] sm:max-w-[140px] object-contain rounded-lg" />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-bold text-lg sm:text-xl text-white shadow-md shadow-[#1DB954]/20 transform group-hover:scale-105 transition-transform">
                  P
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-xl font-black tracking-wider text-white flex items-center gap-0.5 leading-tight">
                  PTEN<span className="text-[#1DB954]">it</span>
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-300 font-medium tracking-tight">
                  IT Services & Training
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            {!inlineSearchOpen && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm lg:text-[15px] xl:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-black'
                      : item.highlight
                      ? 'bg-slate-800/90 text-white border border-rose-500/50 hover:bg-slate-800 shadow-sm font-black'
                      : 'text-slate-100 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-85"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-[0_0_8px_#ef4444]"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* DESKTOP SEARCH BAR */}
          <div className={`relative flex-1 ${inlineSearchOpen ? 'w-full max-w-none ml-2 mr-0' : 'max-w-md mx-2 hidden md:block'}`}>
            {inlineSearchOpen ? (
              <div className="relative flex items-center w-full animate-in fade-in zoom-in-95 duration-200">
                <Search className="w-4 sm:w-5 h-4 sm:h-5 absolute left-3 text-[#1DB954]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setActiveTab('marketplace');
                      setInlineSearchOpen(false);
                    }
                  }}
                  placeholder={t("কোর্স বা সার্ভিস নাম লিখে খুঁজুন...", "Search courses or services...")}
                  className="w-full bg-slate-900/95 border-2 border-[#1DB954] rounded-2xl pl-9 sm:pl-10 pr-9 py-2.5 sm:py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none shadow-xl font-bengali ring-2 ring-[#1DB954]/20"
                />
                <button
                  onClick={() => {
                    setInlineSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2.5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 cursor-pointer"
                  title="সার্চ বন্ধ করুন"
                >
                  <X className="w-5 h-5 text-slate-300 hover:text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setInlineSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-[#1DB954] text-slate-300 hover:text-white transition-all text-xs cursor-pointer w-full max-w-[200px] lg:max-w-[240px] font-bengali"
              >
                <Search className="w-4 h-4 text-[#1DB954]" />
                <span className="truncate">{t('সার্চ করুন...', 'Search here...')}</span>
              </button>
            )}

            {/* LIVE FLOATING SEARCH RESULTS DROPDOWN (DESKTOP) */}
            {inlineSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#142B4D] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 max-h-96 overflow-y-auto">
                {filteredCourses.length > 0 && (
                  <div className="mb-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1 font-bengali">
                      {t('কোর্সসমূহ', 'Courses')} ({filteredCourses.length})
                    </div>
                    <div className="space-y-1.5">
                      {filteredCourses.map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            openCourseDetail(c.id);
                            setInlineSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-slate-800/90 rounded-xl cursor-pointer transition-colors"
                        >
                          <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0 font-bengali">
                            <p className="font-semibold text-xs text-white truncate">{c.title}</p>
                            <p className="text-[11px] text-[#1DB954] font-bold">
                              {c.isFree ? t('ফ্রি', 'Free') : `৳${c.discountPrice || c.price}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredServices.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1 font-bengali">
                      {t('সার্ভিসসমূহ', 'Services')} ({filteredServices.length})
                    </div>
                    <div className="space-y-1.5">
                      {filteredServices.map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveTab('services');
                            setInlineSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-2 hover:bg-slate-800/90 rounded-xl cursor-pointer transition-colors font-bengali"
                        >
                          <p className="font-semibold text-xs text-white">{s.title}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{s.shortDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredCourses.length === 0 && filteredServices.length === 0 && (
                  <p className="text-center text-slate-400 py-3 text-xs font-bengali">
                    {t('কোনো ফলাফল পাওয়া যায়নি।', 'No results found.')}
                  </p>
                )}

                <div className="pt-2 mt-2 border-t border-slate-700/80">
                  <button
                    onClick={() => {
                      setActiveTab('marketplace');
                      setInlineSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 transition font-bengali cursor-pointer shadow"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>সকল গিগ ও মার্কেটপ্লেস ফলাফল দেখুন (See All)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE INLINE SEARCH BAR (CENTERED, EXACT SAME SIZE & LOOK AS MARKETPLACE) */}
          <div className="flex md:hidden flex-1 min-w-0 mx-1 relative items-center">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setActiveTab('marketplace');
                  }
                }}
                placeholder={t("সার্চ করুন...", "Search...")}
                className="w-full pl-7 pr-6 py-1.5 bg-slate-900/90 border border-slate-700/80 text-white rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1DB954] focus:border-[#1DB954] font-bengali shadow-inner"
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

            {/* LIVE FLOATING SEARCH RESULTS DROPDOWN (MOBILE) */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#142B4D] border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 max-h-80 overflow-y-auto">
                {filteredCourses.length > 0 && (
                  <div className="mb-2.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 border-b border-slate-700 pb-1 font-bengali">
                      {t('কোর্সসমূহ', 'Courses')} ({filteredCourses.length})
                    </div>
                    <div className="space-y-1">
                      {filteredCourses.slice(0, 3).map(c => (
                        <div
                          key={c.id}
                          onClick={() => {
                            openCourseDetail(c.id);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-2 p-1.5 hover:bg-slate-800/90 rounded-lg cursor-pointer transition-colors"
                        >
                          <img src={c.thumbnail} alt={c.title} className="w-8 h-8 rounded-md object-cover shrink-0" />
                          <div className="flex-1 min-w-0 font-bengali">
                            <p className="font-semibold text-xs text-white truncate">{c.title}</p>
                            <p className="text-[10px] text-[#1DB954] font-bold">
                              {c.isFree ? t('ফ্রি', 'Free') : `৳${c.discountPrice || c.price}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredServices.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 border-b border-slate-700 pb-1 font-bengali">
                      {t('সার্ভিসসমূহ', 'Services')} ({filteredServices.length})
                    </div>
                    <div className="space-y-1">
                      {filteredServices.slice(0, 3).map(s => (
                        <div
                          key={s.id}
                          onClick={() => {
                            setActiveTab('services');
                            setSearchQuery('');
                          }}
                          className="p-1.5 hover:bg-slate-800/90 rounded-lg cursor-pointer transition-colors font-bengali"
                        >
                          <p className="font-semibold text-xs text-white truncate">{s.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{s.shortDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredCourses.length === 0 && filteredServices.length === 0 && (
                  <p className="text-center text-slate-400 py-2 text-xs font-bengali">
                    {t('কোনো ফলাফল পাওয়া যায়নি।', 'No results found.')}
                  </p>
                )}

                <div className="pt-2 mt-1.5 border-t border-slate-700/80">
                  <button
                    onClick={() => {
                      setActiveTab('marketplace');
                      setSearchQuery('');
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition font-bengali cursor-pointer shadow"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>সকল গিগ ও মার্কেটপ্লেস ফলাফল দেখুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="hidden md:flex items-center space-x-2.5 lg:space-x-3 shrink-0">
            {/* Direct Link to Marketplace & Buyer Mode */}
            <button
              onClick={() => setActiveTab('marketplace')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-slate-800/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="মার্কেটপ্লেস ও বায়ার মোড"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#1DB954]" />
              <span>মার্কেটপ্লেস (বায়ার মোড)</span>
            </button>

            {/* PRIMARY CTA ENROLL BUTTON */}
            <button
              onClick={() => setActiveTab('courses')}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#1DB954] hover:bg-emerald-500 shadow-md shadow-[#1DB954]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 font-bengali"
            >
              <BookOpen className="w-4 h-4" />
              <span>কোর্সে জয়েন</span>
            </button>
          </div>

          {/* Mobile Actions: Menu Drawer Button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-1.5 text-slate-200 hover:text-white cursor-pointer"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#1DB954]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#142B4D] border-t border-slate-700 px-4 pt-3 pb-6 space-y-3 font-bengali">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-bold transition-colors flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-[#1DB954] text-white font-bold'
                  : item.highlight
                  ? 'text-white bg-slate-800/80 border border-rose-500/50'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              {item.highlight && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-85"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 shadow-[0_0_8px_#ef4444]"></span>
                </span>
              )}
            </button>
          ))}

          {/* Mobile Direct Link to Marketplace & Buyer Mode */}
          <button
            onClick={() => {
              setActiveTab('marketplace');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-base font-bold bg-slate-800/80 text-emerald-400 hover:text-white border border-emerald-500/40 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1DB954]" />
              <span>মার্কেটপ্লেস ও বায়ার মোড</span>
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('verify');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-slate-800 flex items-center justify-between"
          >
            <span>{t('সার্টিফিকেট ভেরিফাই', 'Verify Certificate')}</span>
            <Sparkles className="w-4 h-4 text-[#1DB954]" />
          </button>

          <div className="pt-4 border-t border-slate-700 space-y-3">
            {/* Theme Toggle in Mobile Drawer */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-800 text-amber-300 font-bold border border-slate-700 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-300" />}
                <span>{darkMode ? '☀️ লাইট মোড (Light Mode)' : '🌙 ডার্ক মোড (Dark Mode)'}</span>
              </span>
              <span className="text-xs px-2 py-0.5 bg-slate-900 rounded text-emerald-400 font-extrabold">
                {darkMode ? 'DARK' : 'LIGHT'}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('courses');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              {t('কোর্সে জয়েন করুন', 'Enroll in Course')}
            </button>
          </div>
        </div>
      )}
      </nav>
    </header>
  );
};
