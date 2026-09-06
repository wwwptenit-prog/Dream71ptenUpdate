import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  X,
  MessageSquare,
  ShoppingBag,
  ShoppingCart,
  Star,
  Clock,
  Check,
  BadgeCheck,
  Briefcase,
  FileText,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ImageIcon,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceGig } from '../types';
import { GigCard } from './GigCard';
import { GigDetailPage } from './GigDetailPage';
import { DigitalProductsSection } from './DigitalProductsSection';
import { getLocalizedService } from '../utils/localization';

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
  onBack?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  setActiveTab,
  openAuthModal,
  isStandalonePage = false,
  onBack
}) => {
  const { currentUser, services, gigs, siteSettings, t, lang, createDirectGigOrder } = useData();

  // Selected Gig/Service for Exact Marketplace Gig Detail View
  const [activeInPlaceGig, setActiveInPlaceGig] = useState<MarketplaceGig | null>(null);

  // Top Trending General Gigs
  const featuredGigs = gigs.slice(0, 4);

  // Open Service or Gig Details in EXACT Marketplace Gig Detail View
  const handleOpenServiceDetail = (service: Service) => {
    const matchedGig = mapServiceToGig(service);
    setActiveInPlaceGig(matchedGig);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToGigDetail = (gig: MarketplaceGig) => {
    setActiveInPlaceGig(gig);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to map an Agency Service into a Marketplace Gig format for GigCard rendering & detailed package ordering
  const mapServiceToGig = (service: Service): MarketplaceGig => {
    const locService = getLocalizedService(service, lang);

    const matchedGig = gigs.find(
      g => g.id === service.id || g.title.toLowerCase() === service.title.toLowerCase()
    );
    if (matchedGig) {
      return {
        ...matchedGig,
        title: locService.title,
        category: locService.category,
        description: locService.shortDescription,
        sellerName: 'PTENit Official Agency',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        sellerLevel: 'Official Top Rated Agency',
        isAgencyStaff: true,
        demoImages: service.demoImages || (service.galleryImages ? service.galleryImages : matchedGig.demoImages),
        demoUrl: service.demoUrl || matchedGig.demoUrl,
        offerBadge: matchedGig.offerBadge || (lang === 'en' ? 'Official Guarantee' : 'অফিশিয়াল গ্যারান্টি')
      };
    }

    const defaultFeatures = locService.features && locService.features.length > 0
      ? locService.features
      : (lang === 'en'
        ? ['Custom Responsive Design', 'SEO Friendly Structure', 'Technical Support', 'Source Code Delivery']
        : ['কাস্টম রেসপন্সিভ ডিজাইন', 'এসইও ফ্রেন্ডলি স্ট্রাকচার', 'টেকনিক্যাল সাপোর্ট', 'সোর্স ফাইল ডেলিভারি']);

    return {
      id: service.id,
      sellerId: 'ptenit-agency',
      sellerName: 'PTENit Official Agency',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerLevel: 'Official Top Rated Agency',
      isAgencyStaff: true,
      title: locService.title,
      category: locService.category,
      description: locService.fullDescription || locService.shortDescription,
      thumbnail: service.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
      demoImages: service.demoImages || (service.galleryImages ? service.galleryImages : undefined),
      demoUrl: service.demoUrl,
      rating: service.rating || 5.0,
      reviewsCount: service.reviewsCount || 48,
      salesCount: 150,
      packages: {
        basic: {
          name: service.packages?.basic?.name || (lang === 'en' ? 'Basic Package' : 'বেসিক প্যাকেজ'),
          price: service.packages?.basic?.price ?? 5000,
          deliveryDays: service.packages?.basic?.deliveryDays ?? 3,
          revisions: (service.packages?.basic?.revisions as any) || '3',
          features: service.packages?.basic?.features || defaultFeatures.slice(0, 3)
        },
        standard: {
          name: service.packages?.standard?.name || (lang === 'en' ? 'Standard Package' : 'স্ট্যান্ডার্ড প্যাকেজ'),
          price: service.packages?.standard?.price ?? 12000,
          deliveryDays: service.packages?.standard?.deliveryDays ?? 5,
          revisions: (service.packages?.standard?.revisions as any) || '5',
          features: service.packages?.standard?.features || defaultFeatures.slice(0, 4)
        },
        premium: {
          name: service.packages?.premium?.name || (lang === 'en' ? 'Premium Package' : 'প্রিমিয়াম প্যাকেজ'),
          price: service.packages?.premium?.price ?? 25000,
          deliveryDays: service.packages?.premium?.deliveryDays ?? 7,
          revisions: (service.packages?.premium?.revisions as any) || 'Unlimited',
          features: service.packages?.premium?.features || defaultFeatures
        }
      },
      tags: ['Official Agency', 'PTENit Guarantee', locService.category],
      status: 'active' as const,
      offerBadge: lang === 'en' ? 'Official Agency' : 'অফিশিয়াল এজেন্সি'
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

  // Exact Marketplace Gig Detail View (renders identical to Marketplace gig detail)
  const renderDetailModal = () => {
    if (!activeInPlaceGig) return null;
    return (
      <GigDetailPage
        gig={activeInPlaceGig}
        allGigs={gigs}
        currentUser={currentUser}
        onBack={() => {
          setActiveInPlaceGig(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectGig={(g) => {
          setActiveInPlaceGig(g);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        openAuthModal={openAuthModal}
        createDirectGigOrder={createDirectGigOrder}
        setActiveTab={setActiveTab}
        onOrderSuccess={() => {
          setActiveInPlaceGig(null);
          if (setActiveTab) {
            setActiveTab("marketplace");
          }
        }}
      />
    );
  };

  // STANDALONE FULL-PAGE VIEW FOR OFFICIAL AGENCY PACKAGES
  if (isStandalonePage) {
    return (
      <div className="w-full min-h-screen bg-white dark:bg-slate-900 font-bengali text-slate-900 dark:text-slate-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          {/* Top Header Bar - Centered on Mobile, Row on Desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 text-center sm:text-left">
            <div className="space-y-1.5 flex flex-col items-center sm:items-start">
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t('আমাদের সার্ভিসসমূহ', 'Our Services')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                {t('সরাসরি আমাদের এক্সপার্ট টিম থেকে প্রফেশনাল ওয়েব, মোবাইল অ্যাপ, এআই সফটওয়্যার ও সার্ভিস গ্রহণ করুন।', 'Get professional web, mobile app, AI software, and custom digital services directly from our expert team.')}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
                  title={t('পূর্ববর্তী স্থানে ফিরে যান', 'Go back to previous page')}
                >
                  <ArrowLeft className="w-4 h-4 text-[#1DB954]" />
                  <span>{t('ফিরে যান', 'Back')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Agency Services - All services shown directly on PC & Mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {allPublishedServices.map(renderServiceCard)}
          </div>

        </div>

        {/* IN-PLACE DETAIL MODAL */}
        {renderDetailModal()}
      </div>
    );
  }

  // HOME PAGE SECTION VIEW - Show official agency packages (4 on PC for 1 row of 4)
  const visibleAgencyServices = allPublishedServices.slice(0, 4);

  return (
    <div className="w-full">
      {/* SECTION 1: Official Agency Packages - হালকা শেড / অফ-হোয়াইট (Soft Light Shade, not full white) */}
      <section className="py-10 sm:py-14 bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-white border-y border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('আমাদের অফিশিয়াল এজেন্সি প্যাকেজসমূহ', 'Our Official Agency Packages')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bengali">
                {t('PTENit এর গ্যারান্টিযুক্ত সার্ভিস প্যাকেজ।', 'Guaranteed official IT service packages.')}
              </p>
            </div>

            {!isStandalonePage && setActiveTab && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-600 font-bold text-xs sm:text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Agency Services Grid: Desktop shows 4 in 1 row; Mobile shows 4 cards */}
          <div className="space-y-4">
            {/* Desktop (Hidden on mobile): 1 row of 4 */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:gap-5">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>

            {/* Mobile (Visible only on mobile): 4 items */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {visibleAgencyServices.map(renderServiceCard)}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Digital Products Section - একদুম সাদা (Completely Pure White) */}
      <section className="py-10 sm:py-14 bg-white text-slate-900 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DigitalProductsSection setActiveTab={setActiveTab} />
        </div>
      </section>

      {/* SECTION 3: Popular Freelance Gigs Row - হালকা শেড / অফ-হোয়াইট (Soft Light Shade, not full white) */}
      <section className="py-10 sm:py-14 bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-white border-y border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1.5 text-center sm:text-left flex flex-col items-center sm:items-start">
              <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
                {t('জনপ্রিয় গিগ ও ডিজিটাল সার্ভিসসমূহ', 'Popular Gigs & Digital Services')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-bengali">
                {t('PTENit ভেরিফায়েড স্পেশালিস্টদের জনপ্রিয় ফ্রিল্যান্সিং গিগস।', 'Popular freelance gigs and services by verified specialists.')}
              </p>
            </div>

            {setActiveTab && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('marketplace', 'All');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1 text-[#1DB954] hover:text-emerald-600 font-bold text-xs sm:text-sm hover:underline transition-all cursor-pointer font-bengali shrink-0 group"
                >
                  <span>{t('সবগুলো দেখুন →', 'See All →')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Gigs Grid: Desktop shows 4 in 1 row; Mobile shows 4 */}
          <div className="space-y-4">
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

            {/* Mobile (Visible only on mobile): 4 items */}
            <div className="grid grid-cols-2 gap-2.5 sm:hidden">
              {gigs.slice(0, 4).map(gig => (
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
      </section>

      {/* EXACT MARKETPLACE GIG DETAIL VIEW */}
      {renderDetailModal()}
    </div>
  );
};
