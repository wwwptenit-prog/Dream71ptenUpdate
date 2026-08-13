import React, { useState } from 'react';
import {
  Code,
  TrendingUp,
  Palette,
  Video,
  Search,
  Share2,
  Globe,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  MessageSquare,
  ShoppingBag,
  Star,
  Sparkles,
  BadgeCheck,
  Check,
  Clock,
  ShieldCheck,
  Cpu,
  Bot,
  Copy,
  CreditCard,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceGig } from '../types';
import { GigCard } from './GigCard';
import { OrderCheckoutModal } from './OrderCheckoutModal';
import { GigDetailPage } from './GigDetailPage';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code,
  TrendingUp,
  Palette,
  Video,
  Search,
  Share2,
  Globe,
  Award
};

interface ServicesSectionProps {
  setActiveTab?: (tab: string, category?: string) => void;
  openAuthModal?: () => void;
  isStandalonePage?: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  setActiveTab,
  openAuthModal,
  isStandalonePage = false
}) => {
  const { currentUser, services, gigs, siteSettings, t, createDirectGigOrder } = useData();

  // State for Service Detail Modal
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);

  // State for Direct Gig Order Modal from website
  const [activeGigForOrder, setActiveGigForOrder] = useState<MarketplaceGig | null>(null);
  const [selectedGigDetail, setSelectedGigDetail] = useState<MarketplaceGig | null>(null);
  const [selectedPkgType, setSelectedPkgType] = useState<'basic' | 'standard' | 'premium'>('basic');

  // Filter Gigs for "Most popular Gigs in AI Development"
  const aiGigs = gigs.filter(g =>
    g.category.toLowerCase().includes('ai') ||
    g.title.toLowerCase().includes('ai') ||
    g.title.toLowerCase().includes('চ্যাটবট') ||
    g.title.toLowerCase().includes('chatbot') ||
    g.title.toLowerCase().includes('saas')
  );

  // Top Trending General Gigs
  const featuredGigs = gigs.slice(0, 4);

  const navigateToGigDetail = (gig: MarketplaceGig) => {
    try {
      localStorage.setItem('ptenit_selected_gig_id', gig.id);
    } catch (e) {}
    if (setActiveTab) {
      setActiveTab('marketplace');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenServiceDetail = (service: Service) => {
    const matchedGig: MarketplaceGig = gigs.find(
      g => g.id === service.id || g.title.toLowerCase() === service.title.toLowerCase()
    ) || {
      id: service.id,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit Official Agency',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerLevel: 'Top Rated Official Agency',
      title: service.title,
      category: service.category,
      description: service.fullDescription || service.shortDescription,
      thumbnail: service.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      rating: service.rating || 5.0,
      reviewsCount: service.reviewsCount || 48,
      packages: service.packages || {
        basic: { name: 'Basic Package', price: 10000, deliveryDays: 3, revisions: '3', features: service.features || ['কাস্টম ডিজাইন'] },
        standard: { name: 'Standard Package', price: 20000, deliveryDays: 5, revisions: '5', features: service.features || ['কাস্টম ডিজাইন', 'এসইও'] },
        premium: { name: 'Premium Package', price: 35000, deliveryDays: 7, revisions: 'Unlimited', features: service.features || ['কাস্টম ডিজাইন', 'এসইও', 'সাপোর্ট'] }
      },
      tags: ['Official', 'PTENit', service.category],
      status: 'active' as const
    };

    setSelectedService(null);
    navigateToGigDetail(matchedGig);
  };

  // STANDALONE FULL-PAGE VIEW FOR OFFICIAL AGENCY PACKAGES
  if (isStandalonePage) {
    const allPublishedServices = services.filter(s => s.published);

    return (
      <div className="w-full min-h-screen bg-slate-950 font-bengali text-slate-100 py-6 px-4 sm:px-8 md:px-12 lg:px-16 animate-fadeIn">
        <div className="max-w-[1920px] mx-auto space-y-8">
          
          {/* Top Header Bar: Back Button & Service Name */}
          <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTab && setActiveTab('home')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-[#1DB954] text-white hover:text-slate-950 border border-slate-700 text-xs sm:text-sm font-black transition cursor-pointer shadow group shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-[#1DB954] group-hover:text-slate-950 group-hover:-translate-x-1 transition-transform" />
                <span>← ফিরে যান</span>
              </button>
              
              <div className="h-7 w-px bg-slate-800 hidden sm:block" />

              <div>
                <span className="text-[10px] sm:text-xs font-bold text-[#1DB954] uppercase tracking-wider flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  PTENit Official Agency
                </span>
                <h1 className="text-base sm:text-xl md:text-2xl font-black text-white">
                  {t('আমাদের অফিশিয়াল এজেন্সি প্যাকেজসমূহ', 'Our Official Agency Packages')}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 text-[#1DB954] border border-[#1DB954]/30 rounded-full text-xs font-bold">
                {allPublishedServices.length} টি প্রস্তুত সার্ভিস
              </span>
            </div>
          </div>

          {/* Subtitle Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1DB954]/5 rounded-full blur-3xl pointer-events-none" />
            <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
              <ShieldCheck className="w-4 h-4" />
              ১০০% গ্যারান্টিযুক্ত আইটি সলিউশন
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              PTENit অফিশিয়াল এজেন্সি সার্ভিস প্যাকেজ
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              সরাসরি আমাদের এক্সপার্ট ডেভেলপার ও ডিজাইনার টিম থেকে প্রফেশনাল ওয়েব, মোবাইল অ্যাপ, এআই সফটওয়্যার, সাইবার সিকিউরিটি ও ডিজিটাল মার্কেটিং সার্ভিস গ্রহণ করুন।
            </p>
          </div>

          {/* Full Grid of Agency Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allPublishedServices.map(service => {
              const IconComponent = iconMap[service.iconName] || Code;
              return (
                <div
                  key={service.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-slate-950">
                      <img
                        src={service.thumbnail || "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-slate-700/50">
                        {service.category}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1DB954] text-slate-950 font-black text-[10px] rounded-full flex items-center gap-1 shadow">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Official Service</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-300">PTENit IT Agency</span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {service.shortDescription}
                      </p>

                      {/* Feature Bullet Badges */}
                      {service.features && service.features.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {service.features.slice(0, 3).map((feat, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-[#1DB954]" />
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{service.rating || '5.0'} ({service.reviewsCount || '40'})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#1DB954]">
                        {service.priceText || '৳১০,০০০'}
                      </span>
                      <button
                        onClick={() => handleOpenServiceDetail(service)}
                        className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 bg-[#1DB954] hover:bg-emerald-600 transition cursor-pointer shadow-md"
                      >
                        বিস্তারিত ও অর্ডার
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* MODAL 1: Agency Service Detail & Package Order Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-8">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center shrink-0">
                  {React.createElement(iconMap[selectedService.iconName] || Code, { className: "w-8 h-8" })}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider">
                    {selectedService.category} • Official PTENit Agency
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedService.fullDescription}
              </p>

              <div className="space-y-3 bg-slate-800/60 p-5 rounded-2xl border border-slate-700">
                <h4 className="font-bold text-white text-sm">
                  এই সার্ভিসের মূল বৈশিষ্ট্যসমূহ (Features):
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
                  {selectedService.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1DB954] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">সার্ভিস শুরু ফি</span>
                  <p className="text-xl font-bold text-[#1DB954]">{selectedService.priceText || 'কাস্টম রেট'}</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleOpenServiceDetail(selectedService)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    অর্ডার করুন
                  </button>
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(selectedService.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    হোয়াটসঅ্যাপ
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  const visibleAgencyServices = (isStandalonePage || showAllServices)
    ? services.filter(s => s.published)
    : services.filter(s => s.published).slice(0, 4);

  return (
    <section className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-900/80">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-10 sm:space-y-12">

        {/* Back Button if standalone page */}
        {isStandalonePage && setActiveTab && (
          <div>
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-[#1DB954] hover:text-slate-950 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-sm font-bengali"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← ব্যাক টু হোম পেজ (Back to Home)</span>
            </button>
          </div>
        )}

        {/* SECTION 1: Most popular Gigs in AI Development */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-black text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
                  <Bot className="w-3.5 h-3.5 text-[#1DB954]" />
                  AI & Software Innovation
                </span>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-full border border-amber-500/20">
                  Trending 🔥
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">
                Most popular Gigs in AI Development
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bengali">
                {t('এআই ওয়েবসাইট, চ্যাটবট ও সফটওয়্যার।', 'AI websites, chatbots & software solutions.')}
              </p>
            </div>

            {setActiveTab && (
              <button
                onClick={() => setActiveTab('marketplace', 'AI Services')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-[#1DB954] hover:text-slate-950 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer group shadow shrink-0 font-bengali"
              >
                <span>{t('সকল এআই গিগ দেখুন (See All)', 'See All AI Gigs')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

          {/* AI Gigs Grid (4 cols x 1 row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiGigs.slice(0, 4).map(gig => (
              <GigCard
                key={gig.id}
                gig={gig}
                onClick={() => navigateToGigDetail(gig)}
                currentUser={currentUser}
                badgeTag="AI Special 🔥"
              />
            ))}
          </div>
        </div>

        {/* SECTION 2: Official Agency Packages */}
        <div className="space-y-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
                <BadgeCheck className="w-4 h-4 text-[#1DB954]" />
                {t('প্রফেশনাল আইটি সলিউশন', 'Professional IT Solutions')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('আমাদের অফিশিয়াল এজেন্সি প্যাকেজসমূহ', 'Our Official Agency Packages')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bengali">
                {t('PTENit এর গ্যারান্টিযুক্ত সার্ভিস প্যাকেজ।', 'Guaranteed official IT service packages.')}
              </p>
            </div>

            {setActiveTab && !isStandalonePage && (
              <button
                onClick={() => setActiveTab('services')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow border border-slate-700/50 font-bengali shrink-0"
              >
                <span>{t('সকল এজেন্সি সার্ভিস দেখুন (See All)', 'See All Agency Services')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Agency Services Grid (4 cols x 1 row layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleAgencyServices.map(service => {
              const IconComponent = iconMap[service.iconName] || Code;
              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-slate-950">
                      <img
                        src={service.thumbnail || "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80"}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-slate-700/50">
                        {service.category}
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#1DB954] text-slate-950 font-black text-[9px] rounded-full flex items-center gap-1 shadow">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PTENit Official</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-bengali">PTENit IT Agency</span>
                      </div>

                      <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1DB954] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-bengali">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{service.rating || '5.0'} ({service.reviewsCount || '40'})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#1DB954] font-bengali">
                        {service.priceText || '৳১০,০০০'}
                      </span>
                      <button
                        onClick={() => handleOpenServiceDetail(service)}
                        className="px-3 py-1.5 rounded-lg text-xs font-black text-slate-950 bg-[#1DB954] hover:bg-emerald-600 transition cursor-pointer shadow font-bengali"
                      >
                        বিস্তারিত ও অর্ডার
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!isStandalonePage && services.filter(s => s.published).length > 4 && setActiveTab && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setActiveTab('services')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md font-bengali"
              >
                <span>{t('সকল এজেন্সি প্যাকেজ দেখুন (See All)', 'See All Agency Packages')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* SECTION 3: Popular Freelance Gigs Row */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
                <Sparkles className="w-3.5 h-3.5" />
                {t('পপুলার ফ্রিল্যান্সিং গিগস', 'Popular Freelance Gigs')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('জনপ্রিয় গিগ ও ডিজিটাল সার্ভিসসমূহ', 'Popular Gigs & Digital Services')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bengali">
                {t('জনপ্রিয় ফ্রিল্যান্সিং গিগস।', 'Popular freelance gigs and services.')}
              </p>
            </div>

            {setActiveTab && (
              <button
                onClick={() => setActiveTab('marketplace', 'All')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-[#1DB954]/20 hover:scale-105 transition-all cursor-pointer font-bengali shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>সকল গিগ ও মার্কেটপ্লেস দেখুন (See All)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGigs.map(gig => (
              <GigCard
                key={gig.id}
                gig={gig}
                onClick={() => navigateToGigDetail(gig)}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>

      </div>

      {/* MODAL 1: Agency Service Detail & Package Order Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-8">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center shrink-0">
                {React.createElement(iconMap[selectedService.iconName] || Code, { className: "w-8 h-8" })}
              </div>
              <div>
                <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider">
                  {selectedService.category} • Official PTENit Agency
                </span>
                <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-bengali">
              {selectedService.fullDescription}
            </p>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm font-bengali">
                এই সার্ভিসের মূল বৈশিষ্ট্যসমূহ (Features):
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bengali">
                {selectedService.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1DB954] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Package Tier Options if available */}
            {selectedService.packages && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm font-bengali">
                  প্যাকেজসমূহ নির্বাচন করুন (Fiverr Tiers):
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {(['basic', 'standard', 'premium'] as const).map(pKey => {
                    const pkg = selectedService.packages?.[pKey];
                    if (!pkg) return null;
                    const isSelected = selectedPkgType === pKey;
                    return (
                      <div
                        key={pKey}
                        onClick={() => setSelectedPkgType(pKey)}
                        className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#1DB954] bg-[#1DB954]/10 ring-2 ring-[#1DB954]/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">{pKey}</span>
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{pkg?.name}</div>
                        <div className="font-extrabold text-[#1DB954] text-sm mt-1">৳{(pkg?.price ?? 0).toLocaleString('bn-BD')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 font-bengali">সার্ভিস শুরু ফি</span>
                <p className="text-xl font-bold text-[#1DB954]">{selectedService.priceText || 'কাস্টম রেট'}</p>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleOpenServiceDetail(selectedService)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer font-bengali"
                >
                  <ShoppingBag className="w-4 h-4" />
                  অর্ডার করুন
                </button>
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(selectedService.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  হোয়াটসঅ্যাপ
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Smart Order Checkout Modal */}
      <OrderCheckoutModal
        gig={activeGigForOrder}
        isOpen={!!activeGigForOrder}
        onClose={() => setActiveGigForOrder(null)}
        currentUser={currentUser}
        siteSettings={siteSettings}
        setActiveTab={setActiveTab}
      />
    </section>
  );
};
