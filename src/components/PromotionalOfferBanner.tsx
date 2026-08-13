import React, { useState, useEffect } from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

interface PromotionalOfferBannerProps {
  setActiveTab: (tab: string) => void;
}

export const PromotionalOfferBanner: React.FC<PromotionalOfferBannerProps> = ({ setActiveTab }) => {
  const { offers, t } = useData();
  const activeOffer = offers.find(o => o.active);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!activeOffer?.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(activeOffer.endDate).getTime();
      const diff = end - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeOffer]);

  if (!activeOffer) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-[#1DB954] to-teal-700 text-white py-10 px-4 relative overflow-hidden shadow-2xl">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Offer Text */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Tag className="w-3.5 h-3.5" />
            {t('অফার চলমান রয়েছে...', 'Limited Time Offer...')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-bengali">
            {activeOffer.title}
          </h2>
          <p className="text-sm sm:text-base text-emerald-100 font-bengali max-w-2xl">
            {activeOffer.subtitle || t("আপনার পছন্দের সার্ভিস বা কোর্সটি আজই অর্ডার/এনরোল করুন", "Enroll or order your desired service/course today")}
          </p>
        </div>

        {/* Right Timer & CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Countdown Clock */}
          <div className="flex items-center gap-2 font-mono">
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl text-center min-w-[55px] border border-white/20">
              <span className="text-xl font-bold block">{timeLeft.days}</span>
              <span className="text-[10px] text-emerald-300 uppercase font-sans">{t('দিন', 'Days')}</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl text-center min-w-[55px] border border-white/20">
              <span className="text-xl font-bold block">{timeLeft.hours}</span>
              <span className="text-[10px] text-emerald-300 uppercase font-sans">{t('ঘণ্টা', 'Hours')}</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl text-center min-w-[55px] border border-white/20">
              <span className="text-xl font-bold block">{timeLeft.minutes}</span>
              <span className="text-[10px] text-emerald-300 uppercase font-sans">{t('মিনিট', 'Mins')}</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl text-center min-w-[55px] border border-white/20">
              <span className="text-xl font-bold block">{timeLeft.seconds}</span>
              <span className="text-[10px] text-emerald-300 uppercase font-sans">{t('সেকেন্ড', 'Secs')}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="px-6 py-3.5 rounded-xl font-bold text-[#142B4D] bg-white hover:bg-emerald-50 shadow-xl hover:scale-105 transition-all cursor-pointer flex items-center gap-2 text-sm shrink-0"
          >
            {activeOffer.ctaText || t("অফারটি গ্রহণ করুন", "Claim Offer Now")}
            <ArrowRight className="w-4 h-4 text-[#1DB954]" />
          </button>
        </div>

      </div>
    </div>
  );
};
