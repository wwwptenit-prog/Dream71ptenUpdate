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
  Bot
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceGig } from '../types';
import { GigCard } from './GigCard';
import { OrderCheckoutModal } from './OrderCheckoutModal';
import { DigitalProductsSection } from './DigitalProductsSection';

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
  const { currentUser, services, gigs, siteSettings, t } = useData();

  // State for Service Detail Modal
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // State for Direct Order Modal (Checkout)
  const [activeGigForOrder, setActiveGigForOrder] = useState<MarketplaceGig | null>(null);
  const [selectedPkgType, setSelectedPkgType] = useState<'basic' | 'standard' | 'premium'>('basic');

  // Mobile expansion state for sections on home page
  const [mobileAgencyExpanded, setMobileAgencyExpanded] = useState<boolean>(false);
  const [mobileGigsExpanded, setMobileGigsExpanded] = useState<boolean>(false);

  // Top Trending General Gigs
  const featuredGigs = gigs.slice(0, 4);

  const navigateToGigDetail = (gig: MarketplaceGig) => {
    try {
      localStorage.setItem('ptenit_selected_gig_id', gig.id);
      localStorage.setItem('ptenit_selected_gig_data', JSON.stringify(gig));
      localStorage.setItem('ptenit_return_tab', isStandalonePage ? 'services' : 'home');
    } catch (e) {}
    if (setActiveTab) {
      setActiveTab('marketplace');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Service Detail Page on PTENit with full Packages & Order options
  const handleOpenServiceDetail = (service: Service) => {
    const matchedGig = mapServiceToGig(service);
    navigateToGigDetail(matchedGig);
  };

  // Open Featured Gig Detail Page
  const handleOpenFeaturedGig = (gig: MarketplaceGig) => {
    navigateToGigDetail(gig);
  };

  // Start Order Checkout Flow from a Service
  const handleStartOrderFromService = (service: Service) => {
    const matchedGig = mapServiceToGig(service);
    setSelectedService(null);
    setActiveGigForOrder(matchedGig);
  };

  // Helper to map an Agency Service into a Marketplace Gig format for GigCard rendering & detailed package ordering
  const mapServiceToGig = (service: Service): MarketplaceGig => {
    const matchedGig = gigs.find(
      g => g.id === service.id || g.title.toLowerCase() === service.title.toLowerCase()
    );
    if (matchedGig) {
      return {
        ...matchedGig,
        sellerName: 'PTENit Official Agency',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        sellerLevel: 'Official Top Rated Agency',
        isAgencyStaff: true,
        offerBadge: matchedGig.offerBadge || 'অফিশিয়াল গ্যারান্টি'
      };
    }

    const defaultFeatures = service.features && service.features.length > 0
      ? service.features
      : ['কাস্টম রেসপন্সিভ ডিজাইন', 'এসইও ফ্রেন্ডলি স্ট্রাকচার', 'টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি'];

    return {
      id: service.id,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit Official Agency',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerLevel: 'Official Top Rated Agency',
      isAgencyStaff: true,
      title: service.title,
      category: service.category,
      description: service.fullDescription || service.shortDescription,
      thumbnail: service.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      rating: service.rating || 5.0,
      reviewsCount: service.reviewsCount || 48,
      salesCount: 150,
      packages: {
        basic: {
          name: service.packages?.basic?.name || 'বেসিক প্যাকেজ',
          price: service.packages?.basic?.price ?? 5000,
          deliveryDays: service.packages?.basic?.deliveryDays ?? 3,
          revisions: (service.packages?.basic?.revisions as any) || '3',
          features: service.packages?.basic?.features || defaultFeatures.slice(0, 3)
        },
        standard: {
          name: service.packages?.standard?.name || 'স্ট্যান্ডার্ড প্যাকেজ',
          price: service.packages?.standard?.price ?? 12000,
          deliveryDays: service.packages?.standard?.deliveryDays ?? 5,
          revisions: (service.packages?.standard?.revisions as any) || '5',
          features: service.packages?.standard?.features || defaultFeatures.slice(0, 4)
        },
        premium: {
          name: service.packages?.premium?.name || 'প্রিমিয়াম প্যাকেজ',
          price: service.packages?.premium?.price ?? 25000,
          deliveryDays: service.packages?.premium?.deliveryDays ?? 7,
          revisions: (service.packages?.premium?.revisions as any) || 'Unlimited',
          features: service.packages?.premium?.features || defaultFeatures
        }
      },
      tags: ['Official Agency', 'PTENit Guarantee', service.category],
      status: 'active' as const,
      offerBadge: 'অফিশিয়াল এজেন্সি'
    };
  };

  // Reusable Unified Service Card Component - uses GigCard for exact visual parity
  const renderServiceCard = (service: Service) => {
    const gigObj = mapServiceToGig(service);
    return (
      <GigCard
        key={service.id}
        gig={gigObj}
        onClick={() => handleOpenServiceDetail(service)}
        currentUser={currentUser}
      />
    );
  };

  const allPublishedServices = services.filter(s => s.published);

  // STANDALONE FULL-PAGE VIEW FOR OFFICIAL AGENCY PACKAGES
  if (isStandalonePage) {
    const displayedStandaloneServices = mobileAgencyExpanded
      ? allPublishedServices
      : allPublishedServices.slice(0, 4);

    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 font-bengali text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-3 sm:px-8 md:px-12 lg:px-16 animate-fadeIn">
        <div className="max-w-[1920px] mx-auto space-y-8 sm:space-y-12">
          
          {/* Top Header Bar - Centered on Mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 text-center sm:text-left">
            <div className="space-y-1.5 flex flex-col items-center sm:items-start">
              <span className="text-[10px] sm:text-xs font-bold text-[#1DB954] uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                <BadgeCheck className="w-4 h-4" />
                PTENit Official Agency
              </span>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('আমাদের অফিশিয়াল এজেন্সি প্যাকেজসমূহ', 'Our Official Agency Packages')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                সরাসরি আমাদের এক্সপার্ট টিম থেকে প্রফেশনাল ওয়েব, মোবাইল অ্যাপ, এআই সফটওয়্যার ও সার্ভিস গ্রহণ করুন।
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-1.5 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 rounded-full text-xs font-bold shadow-sm">
                {allPublishedServices.length} টি প্রস্তুত সার্ভিস
              </span>
            </div>
          </div>

          {/* Grid of Agency Services - 5 Cols PC (all), 2 Cols Phone (4 cards by default, expandable) */}
          <div className="space-y-6">
            {/* Desktop View: Full Grid (4 columns on PC) */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {allPublishedServices.map(renderServiceCard)}
            </div>

            {/* Mobile View: 4 items initially on phone, or all when expanded */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {displayedStandaloneServices.map(renderServiceCard)}
            </div>

            {/* Mobile 'See All' / 'Show Less' Centered Button Below 4 Cards */}
            {allPublishedServices.length > 4 && (
              <div className="flex justify-center pt-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => setMobileAgencyExpanded(!mobileAgencyExpanded)}
                  className="w-full max-w-xs py-2.5 px-5 rounded-2xl bg-[#1DB954] hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition font-bengali shadow-md cursor-pointer"
                >
                  <span>
                    {mobileAgencyExpanded
                      ? t('কম দেখুন (Show Less)', 'Show Less')
                      : t(`সব দেখুন (${allPublishedServices.length} টি সার্ভিস)`, `See All (${allPublishedServices.length} Services)`)}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${mobileAgencyExpanded ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </div>
            )}
          </div>

          {/* DIGITAL PRODUCTS SECTION BELOW AGENCY PACKAGES */}
          <DigitalProductsSection setActiveTab={setActiveTab} />

        </div>

        {/* MODAL 1: Agency Service Detail & Package Order Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-5 sm:p-8 relative shadow-2xl space-y-6 my-8">
              
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1DB954] text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ফিরে যান</span>
                </button>

                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center shrink-0">
                  {React.createElement(iconMap[selectedService.iconName] || Code, { className: "w-7 h-7 sm:w-8 sm:h-8" })}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider">
                    {selectedService.category} • Official PTENit Agency
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-bengali">
                {selectedService.fullDescription}
              </p>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-bengali">
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

              {/* Package Tier Options */}
              {selectedService.packages && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-bengali">
                    প্যাকেজ নির্বাচন করুন:
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {(['basic', 'standard', 'premium'] as const).map(pKey => {
                      const pkg = selectedService.packages?.[pKey];
                      if (!pkg) return null;
                      const isSelected = selectedPkgType === pKey;
                      return (
                        <div
                          key={pKey}
                          onClick={() => setSelectedPkgType(pKey)}
                          className={`p-2.5 sm:p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#1DB954] bg-[#1DB954]/10 ring-2 ring-[#1DB954]/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">{pKey}</span>
                          <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate">{pkg?.name}</div>
                          <div className="font-extrabold text-[#1DB954] text-xs sm:text-sm mt-1">৳{(pkg?.price ?? 0).toLocaleString('bn-BD')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-500 font-bengali">সার্ভিস শুরু ফি</span>
                  <p className="text-lg sm:text-xl font-bold text-[#1DB954]">{selectedService.priceText || 'কাস্টম রেট'}</p>
                </div>

                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => handleStartOrderFromService(selectedService)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer font-bengali"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    অর্ডার করুন
                  </button>
                  <a
                    href={`https://wa.me/${siteSettings.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(selectedService.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
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
      </div>
    );
  }

  // HOME PAGE SECTION VIEW - Show official agency packages (4 on PC for 1 row of 4)
  const visibleAgencyServices = allPublishedServices.slice(0, 4);

  return (
    <section className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-900/80">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-10 sm:space-y-12">

        {/* SECTION 1: Official Agency Packages */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
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

            {!isStandalonePage && (
              <div className="flex items-center gap-2">
                {/* Mobile View Toggle */}
                {mobileAgencyExpanded ? (
                  <button
                    type="button"
                    onClick={() => setMobileAgencyExpanded(false)}
                    className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] font-bold text-xs transition-colors cursor-pointer font-bengali shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('ফিরে যান', 'Back')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMobileAgencyExpanded(true)}
                    className="sm:hidden inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-xs transition-all cursor-pointer font-bengali shrink-0 group"
                  >
                    <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                  </button>
                )}

                {/* Desktop View Navigation */}
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hidden sm:inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                  >
                    <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Agency Services Grid: Desktop shows 4 in 1 row; Mobile shows max 4 unless expanded */}
          <div className="space-y-4">
            {/* Desktop (Hidden on mobile): 1 row of 4 */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>

            {/* Mobile (Visible only on mobile): Max 4 unless expanded */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {(mobileAgencyExpanded ? allPublishedServices : allPublishedServices.slice(0, 4)).map(renderServiceCard)}
            </div>

            {/* Mobile View: Centered 'See All' button below the cards */}
            {allPublishedServices.length > 4 && (
              <div className="flex justify-center pt-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => setMobileAgencyExpanded(!mobileAgencyExpanded)}
                  className="w-full max-w-xs py-2.5 px-5 rounded-2xl bg-[#1DB954] hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition font-bengali shadow-md cursor-pointer"
                >
                  <span>
                    {mobileAgencyExpanded
                      ? t('কম দেখুন (Show Less)', 'Show Less')
                      : t(`সব দেখুন (${allPublishedServices.length} টি সার্ভিস)`, `See All (${allPublishedServices.length} Services)`)}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${mobileAgencyExpanded ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* SECTION 2: Digital Products Section */}
        <DigitalProductsSection setActiveTab={setActiveTab} />

        {/* SECTION 3: Popular Freelance Gigs Row */}
        <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
              <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
                <Sparkles className="w-3.5 h-3.5" />
                {t('পপুলার ফ্রিল্যান্সিং গিগস', 'Popular Freelance Gigs')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('জনপ্রিয় গিগ ও ডিজিটাল সার্ভিসসমূহ', 'Popular Gigs & Digital Services')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bengali">
                {t('PTENit ভেরিফায়েড স্পেশালিস্টদের জনপ্রিয় ফ্রিল্যান্সিং গিগস।', 'Popular freelance gigs and services by verified specialists.')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile View Toggle */}
              {mobileGigsExpanded ? (
                <button
                  type="button"
                  onClick={() => setMobileGigsExpanded(false)}
                  className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] font-bold text-xs transition-colors cursor-pointer font-bengali shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('ফিরে যান', 'Back')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileGigsExpanded(true)}
                  className="sm:hidden inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-xs transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              )}

              {/* Desktop View Navigation */}
              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('marketplace', 'All');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hidden sm:inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-400 font-bold text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Gigs Grid: Desktop shows 4 in 1 row; Mobile shows max 4 unless expanded */}
          <div>
            {/* Desktop (Hidden on mobile): 1 row of 4 */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {featuredGigs.map(gig => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onClick={() => navigateToGigDetail(gig)}
                  currentUser={currentUser}
                />
              ))}
            </div>

            {/* Mobile (Visible only on mobile): Max 4 unless expanded */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {(mobileGigsExpanded ? gigs : gigs.slice(0, 4)).map(gig => (
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

      </div>

      {/* MODAL 1: Agency Service Detail & Package Order Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-5 sm:p-8 relative shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <button
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1DB954] text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ফিরে যান</span>
              </button>

              <button
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center shrink-0">
                {React.createElement(iconMap[selectedService.iconName] || Code, { className: "w-7 h-7 sm:w-8 sm:h-8" })}
              </div>
              <div>
                <span className="text-xs font-bold text-[#1DB954] uppercase tracking-wider">
                  {selectedService.category} • Official PTENit Agency
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-bengali">
              {selectedService.fullDescription}
            </p>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-bengali">
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

            {/* Package Tier Options */}
            {selectedService.packages && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-bengali">
                  প্যাকেজ নির্বাচন করুন:
                </h4>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {(['basic', 'standard', 'premium'] as const).map(pKey => {
                    const pkg = selectedService.packages?.[pKey];
                    if (!pkg) return null;
                    const isSelected = selectedPkgType === pKey;
                    return (
                      <div
                        key={pKey}
                        onClick={() => setSelectedPkgType(pKey)}
                        className={`p-2.5 sm:p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#1DB954] bg-[#1DB954]/10 ring-2 ring-[#1DB954]/30'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">{pKey}</span>
                        <div className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate">{pkg?.name}</div>
                        <div className="font-extrabold text-[#1DB954] text-xs sm:text-sm mt-1">৳{(pkg?.price ?? 0).toLocaleString('bn-BD')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 font-bengali">সার্ভিস শুরু ফি</span>
                <p className="text-lg sm:text-xl font-bold text-[#1DB954]">{selectedService.priceText || 'কাস্টম রেট'}</p>
              </div>

              <div className="flex gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => handleStartOrderFromService(selectedService)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer font-bengali"
                >
                  <ShoppingBag className="w-4 h-4" />
                  অর্ডার করুন
                </button>
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(selectedService.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
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
