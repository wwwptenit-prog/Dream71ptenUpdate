import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Play, Code2, LineChart, Award, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { GlitterParticles } from './GlitterParticles';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  mouseCoords?: { x: number; y: number } | null;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, mouseCoords: parentMouseCoords }) => {
  const { siteSettings, t } = useData();
  const [internalMouseCoords, setInternalMouseCoords] = useState<{ x: number; y: number } | null>(null);

  const mouseCoords = parentMouseCoords !== undefined ? parentMouseCoords : internalMouseCoords;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setInternalMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setInternalMouseCoords({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setInternalMouseCoords(null);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-gradient-to-b from-[#142B4D] via-[#0D1E38] to-[#142B4D] text-white pt-8 sm:pt-12 lg:pt-14 pb-0 overflow-hidden"
    >
      {/* Dynamic Cursor-Following Radiant Spotlight Glow */}
      {mouseCoords && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(550px circle at ${mouseCoords.x}px ${mouseCoords.y}px, rgba(29, 185, 84, 0.22), rgba(14, 165, 233, 0.12), transparent 70%)`,
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-end">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left pb-8 sm:pb-12 lg:pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-black font-bengali leading-snug lg:leading-tight text-white tracking-tight"
            >
              {siteSettings.heroHeading || t("ডিজিটাল ক্যারিয়ার ও বিজনেস গড়ুন", "Build Your Career & Business")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-slate-300 font-bengali max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {siteSettings.heroSubtext || t("আধুনিক IT সেবাসমূহ, কাস্টম সফটওয়্যার, ডিজিটাল মার্কেটিং ও প্রফেশনাল ট্রেনিং।", "Modern IT services, software, digital marketing and professional training.")}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <button
                onClick={() => setActiveTab('services')}
                className="px-6 py-3 rounded-xl font-bold text-white bg-[#1DB954] hover:bg-emerald-500 shadow-lg shadow-[#1DB954]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 group text-sm sm:text-base font-bengali"
              >
                {t('সার্ভিস দেখুন', 'Services')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('marketplace')}
                className="px-6 py-3 rounded-xl font-bold text-slate-100 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 hover:border-[#1DB954] transition-all cursor-pointer text-sm sm:text-base flex items-center gap-1.5 font-bengali"
              >
                {t('মার্কেটপ্লেস', 'Marketplace')}
                <Play className="w-3.5 h-3.5 text-[#1DB954] fill-[#1DB954]" />
              </button>
            </motion.div>

            {/* Micro Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 border-t border-slate-800/80 max-w-md lg:max-w-xl mx-auto lg:mx-0"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 justify-start pl-2 sm:pl-0">
                  <Sparkles className="w-5 h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-200 font-bengali truncate">AI সাপোর্ট</span>
                </div>
                <div className="flex items-center gap-2 justify-start pl-2 sm:pl-0">
                  <Award className="w-5 h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-200 font-bengali truncate">{t('সার্টিফিকেট', 'Certificate')}</span>
                </div>
                <div className="flex items-center gap-2 justify-start pl-2 sm:pl-0">
                  <ShieldCheck className="w-5 h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-200 font-bengali truncate">{t('বিশ্বস্ত ট্রেনিং', 'Trusted')}</span>
                </div>
                <div className="flex items-center gap-2 justify-start pl-2 sm:pl-0">
                  <Users className="w-5 h-5 text-[#1DB954] shrink-0 stroke-[2.2]" />
                  <span className="text-xs sm:text-sm font-bold text-slate-200 font-bengali truncate">{t('লাইফটাইম সাপোর্ট', 'Support')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Model Image positioned flush to the bottom edge right against the Promotional Offer Banner */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-end self-end w-full">
            {(() => {
              const isCodeMockupMode = siteSettings.heroVisualType === 'code_mockup';
              const photoUrl = siteSettings.heroPhotoUrl || siteSettings.heroBannerUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=85";

              if (!isCodeMockupMode) {
                return (
                  <div className="relative w-full flex items-end justify-center lg:justify-end self-end select-none">
                    {/* Unboxed Model Image with Gentle Bottom Mask */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] flex items-end self-end"
                    >
                      {/* Model Image with Subtle, Gentle Bottom Mask */}
                      <div
                        className="relative w-full overflow-hidden"
                        style={{
                          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0) 100%)',
                          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.3) 92%, rgba(0,0,0,0) 100%)'
                        }}
                      >
                        <img
                          src={photoUrl}
                          alt="PTENit Career Model"
                          className="w-full h-auto max-h-[440px] sm:max-h-[500px] lg:max-h-[560px] object-cover object-top origin-bottom block align-bottom"
                          style={{
                            filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4)) contrast(1.04) brightness(1.02)'
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                );
              }

              // Code Mockup fallback
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative mx-auto max-w-md lg:max-w-none"
                >
                  <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 shadow-2xl shadow-emerald-950/50 backdrop-blur-md relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-md">
                        https://ptenit.com/platform
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                          <div className="p-2.5 bg-[#1DB954]/20 rounded-lg text-[#1DB954]">
                            <Code2 className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-400">Active Code Stack</p>
                            <p className="text-sm font-bold text-white">React + Next.js</p>
                          </div>
                        </div>
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-3">
                          <div className="p-2.5 bg-blue-500/20 rounded-lg text-blue-400">
                            <LineChart className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-400">SEO & Marketing</p>
                            <p className="text-sm font-bold text-white">+245% ROI</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs text-slate-300 space-y-2 relative">
                        <div className="text-slate-500">// PTENit Digital Core Engine</div>
                        <div className="text-emerald-400">
                          const <span className="text-sky-300">ptenItPlatform</span> = &#123;
                        </div>
                        <div className="pl-4 text-amber-300">
                          services: <span className="text-slate-200">['Web', 'SEO', 'Marketing', 'Graphics']</span>,
                        </div>
                        <div className="pl-4 text-emerald-300">
                          trainingStatus: <span className="text-[#1DB954]">'Enrollment Open'</span>
                        </div>
                        <div className="text-emerald-400">&#125;;</div>
                      </div>

                      <div className="bg-gradient-to-r from-[#1DB954] to-emerald-600 p-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-between shadow-lg">
                        <span className="font-bengali">{t('লাইভ ক্লাস ও ফ্রিল্যান্সিং গাইডলাইন', 'Live Classes & Freelancing Guidance')}</span>
                        <span className="bg-white/20 px-2 py-1 rounded text-[10px]">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
};
