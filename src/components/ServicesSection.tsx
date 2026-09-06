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
  CheckCircle2,
  X,
  MessageSquare,
  ShoppingBag,
  Star,
  Clock,
  Check,
  BadgeCheck,
  Briefcase,
  FileText,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Service, MarketplaceGig } from '../types';
import { GigCard } from './GigCard';
import { OrderCheckoutModal } from './OrderCheckoutModal';
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
  const { currentUser, services, gigs, siteSettings, t, lang } = useData();

  // Selected Gig/Service for In-place Detail Modal
  const [activeInPlaceGig, setActiveInPlaceGig] = useState<MarketplaceGig | null>(null);
  const [inPlaceSelectedPkg, setInPlaceSelectedPkg] = useState<'basic' | 'standard' | 'premium'>('basic');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleCopyShareLink = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // silent
    }
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  // State for Direct Order Modal (Checkout)
  const [activeGigForOrder, setActiveGigForOrder] = useState<MarketplaceGig | null>(null);
  const [selectedPkgType, setSelectedPkgType] = useState<'basic' | 'standard' | 'premium'>('basic');

  // Top Trending General Gigs
  const featuredGigs = gigs.slice(0, 4);

  // Open Service or Gig Details in IN-PLACE Modal with 3-tab bar package UI
  const handleOpenServiceDetail = (service: Service) => {
    const matchedGig = mapServiceToGig(service);
    setActiveInPlaceGig(matchedGig);
    setInPlaceSelectedPkg('basic');
  };

  const navigateToGigDetail = (gig: MarketplaceGig) => {
    setActiveInPlaceGig(gig);
    setInPlaceSelectedPkg('basic');
  };

  // Start Order Checkout Flow from In-place Detail Modal
  const handleStartOrderFromInPlace = (pkgType: 'basic' | 'standard' | 'premium' = 'basic') => {
    if (!activeInPlaceGig) return;
    setActiveGigForOrder(activeInPlaceGig);
    setSelectedPkgType(pkgType);
    setActiveInPlaceGig(null);
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

  // In-Place Detail Modal with 3-tab bar package UI (Marketplace style for phone and desktop views)
  const renderDetailModal = () => {
    if (!activeInPlaceGig) return null;

    const isAgency = activeInPlaceGig.isAgencyStaff || activeInPlaceGig.sellerId === 'ptenit-agency';
    const pkgKeys: Array<'basic' | 'standard' | 'premium'> = ['basic', 'standard', 'premium'];
    const activePkg = activeInPlaceGig.packages?.[inPlaceSelectedPkg] || activeInPlaceGig.packages?.basic || {
      name: 'স্ট্যান্ডার্ড প্যাকেজ',
      price: 5000,
      deliveryDays: 3,
      revisions: '3',
      features: ['কাস্টম ডিজাইন', 'রেসপন্সিভ লেআউট', 'ফুল সাপোর্ট']
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 overflow-y-auto min-h-screen font-bengali p-3 sm:p-6 md:p-8 animate-fadeIn text-slate-800 dark:text-slate-100">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Top Sticky Navigation Bar */}
          <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveInPlaceGig(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#1DB954] text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('ফিরে যান', 'Go Back')}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex px-3 py-1 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 rounded-full text-xs font-bold items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {isAgency ? 'Official Agency' : (activeInPlaceGig.category || 'Freelance Service')}
              </span>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#1DB954] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="লিঙ্ক কপি করুন"
              >
                {copiedShareLink ? <Check className="w-4 h-4 text-[#1DB954]" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden md:inline">{copiedShareLink ? 'কপি হয়েছে' : 'শেয়ার'}</span>
              </button>
            </div>
          </div>

          {/* 2-Column Responsive Layout (7 cols Left, 5 cols Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            
            {/* Left Column: Showcase & Details */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Service Card & Preview */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-xs space-y-3">
                {/* Clean Preview Image */}
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={activeInPlaceGig.thumbnail || 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80'}
                    alt={activeInPlaceGig.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/10">
                      {isAgency ? 'Official Agency' : (activeInPlaceGig.category || 'Service')}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-xs font-black px-3 py-1 rounded-full shadow-md bg-[#1DB954] text-white">
                      ৳{activePkg.price.toLocaleString('bn-BD')}
                    </span>
                  </div>
                </div>

                {/* Title & Compact Meta Row (Below image) */}
                <div className="space-y-1.5">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {activeInPlaceGig.title}
                  </h1>

                  {/* Compact Meta Row */}
                  <div className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                      <span>{activeInPlaceGig.rating || 5.0}</span>
                      <span className="text-slate-400 font-normal">({activeInPlaceGig.reviewsCount || 48})</span>
                    </span>
                    <span>·</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-300">
                      {activeInPlaceGig.salesCount || 120}+ ডেলিভারি সম্পন্ন
                    </span>
                    <span>·</span>
                    <span className="bg-emerald-500/10 text-[#1DB954] border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                      {activeInPlaceGig.offerBadge || '৩০% অফার'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provider / Agency Info Card */}
              <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeInPlaceGig.sellerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={activeInPlaceGig.sellerName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white truncate">
                      <span>{activeInPlaceGig.sellerName}</span>
                      <BadgeCheck className="w-4 h-4 text-[#0084FF] fill-[#0084FF] text-white shrink-0" />
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
                      {isAgency ? 'PTENit গ্যারান্টিযুক্ত অফিশিয়াল সার্ভিস টিম' : (activeInPlaceGig.sellerLevel || 'Verified Specialist')}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-[#1DB954] font-black text-[11px] border border-emerald-500/20 shrink-0">
                  ১০০% এস্ক্রো সিকিউরড
                </span>
              </div>

              {/* Description Card */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1DB954]" />
                  সার্ভিস বিবরণ
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeInPlaceGig.description}
                </div>
              </div>

              {/* Key Deliverables & Advantages */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  প্যাকেজে অন্তর্ভুক্ত সুবিধাসমূহ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(activePkg.features || ['কাস্টম ডিজাইন', 'রেসপন্সিভ লেআউট', 'ফুল সাপোর্ট', 'সিকিউর কোডিং']).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Quality Trust Badge */}
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#1DB954] shrink-0" />
                <span>১০০% মানসম্মত ও সন্তুষ্টি গ্যারান্টি সহ সম্পূর্ণ সুরক্ষিত সার্ভিস ডেলিভারি</span>
              </div>

            </div>

            {/* Right Column: 3-Tab Package Selector & Order Box (Sticky on Desktop) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 lg:sticky lg:top-4">
              
              {/* Box Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    সার্ভিস প্যাকেজ
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন
                  </p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg shrink-0 bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20">
                  ৳{activePkg.price.toLocaleString('bn-BD')}
                </span>
              </div>

              {/* 3-Tab Package Selector */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs sm:text-sm font-bold items-center justify-center text-center">
                  {pkgKeys.map(pKey => {
                    const isSelected = inPlaceSelectedPkg === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        onClick={() => setInPlaceSelectedPkg(pKey)}
                        className={`py-2.5 px-2 rounded-xl transition cursor-pointer text-center text-xs sm:text-sm font-black active:scale-95 ${
                          isSelected
                            ? 'bg-[#1DB954] text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {pKey === 'basic' ? 'বেসিক' : pKey === 'standard' ? 'স্ট্যান্ডার্ড' : 'প্রিমিয়াম'}
                      </button>
                    );
                  })}
                </div>

                {/* Active Package Details Card with Centered Floating Badge */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#1DB954] bg-emerald-50/40 dark:bg-emerald-950/20 relative space-y-3.5 transition-all shadow-sm">
                  {/* Floating Centered Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap text-center">
                    {inPlaceSelectedPkg === 'basic' && (
                      <span className="text-xs font-black text-white bg-[#1DB954] border border-emerald-600 px-4 py-0.5 rounded-full shadow-md inline-block text-center">
                        বেসিক প্যাকেজ
                      </span>
                    )}
                    {inPlaceSelectedPkg === 'standard' && (
                      <span className="text-xs font-black text-white bg-red-600 border border-red-700 px-4 py-0.5 rounded-full shadow-md inline-block text-center">
                        স্ট্যান্ডার্ড প্যাকেজ
                      </span>
                    )}
                    {inPlaceSelectedPkg === 'premium' && (
                      <span className="text-xs font-black text-white bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 border border-purple-500/40 px-4 py-0.5 rounded-full shadow-md inline-block text-center">
                        প্রিমিয়াম প্যাকেজ
                      </span>
                    )}
                  </div>

                  {/* Package Title, Offer, Price */}
                  <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2.5 pt-1.5 border-b border-emerald-500/20 pb-3">
                    <div className="space-y-1 flex flex-col items-center sm:items-start w-full sm:w-auto">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">অফার:</span>
                        <span className="text-xs font-black text-emerald-600 dark:text-[#1DB954] bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          {activeInPlaceGig.offerBadge || '৩০% ছাড়'}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white text-center sm:text-left">
                        {activePkg.name}
                      </h4>
                    </div>

                    <div className="text-center sm:text-right">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">প্যাকেজ মূল্য</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#1DB954]">
                        ৳{activePkg.price.toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Days & Revisions */}
                  <div className="flex items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#1DB954]" />
                      <span>{activePkg.deliveryDays} দিনে ডেলিভারি</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-[#1DB954]" />
                      <span>{activePkg.revisions}টি রিভিশন</span>
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                      প্যাকেজে অন্তর্ভুক্ত সুবিধাসমূহ:
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold">
                      {(activePkg.features || ['কাস্টম ডিজাইন', 'রেসপন্সিভ লেআউট', 'ফুল সাপোর্ট']).map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1DB954] shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => handleStartOrderFromInPlace(inPlaceSelectedPkg)}
                  className="w-full py-3.5 rounded-2xl bg-[#1DB954] hover:bg-emerald-600 active:scale-98 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>প্যাকেজটি অর্ডার করুন (৳{activePkg.price.toLocaleString('bn-BD')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${siteSettings.whatsapp}?text=I%20am%20interested%20in%20${encodeURIComponent(activeInPlaceGig.title)}%20(${activePkg.name})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer transition"
                >
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>হোয়াটসঅ্যাপে সরাসরি কথা বলুন</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
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

        {/* ORDER CHECKOUT MODAL */}
        <OrderCheckoutModal
          gig={activeGigForOrder}
          isOpen={!!activeGigForOrder}
          onClose={() => setActiveGigForOrder(null)}
          currentUser={currentUser}
          siteSettings={siteSettings}
          defaultPackage={selectedPkgType}
          setActiveTab={setActiveTab}
          onOrderCompleted={(orderId) => {
            setActiveGigForOrder(null);
            setActiveInPlaceGig(null);
            if (setActiveTab) {
              setActiveTab('marketplace', 'buying');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
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

      {/* IN-PLACE DETAIL MODAL */}
      {renderDetailModal()}

      {/* MODAL 2: Interactive Smart Order Checkout Modal */}
      <OrderCheckoutModal
        gig={activeGigForOrder}
        isOpen={!!activeGigForOrder}
        onClose={() => setActiveGigForOrder(null)}
        currentUser={currentUser}
        siteSettings={siteSettings}
        defaultPackage={selectedPkgType}
        setActiveTab={setActiveTab}
        onOrderCompleted={(orderId) => {
          setActiveGigForOrder(null);
          setActiveInPlaceGig(null);
          if (setActiveTab) {
            setActiveTab('marketplace', 'buying');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
};
