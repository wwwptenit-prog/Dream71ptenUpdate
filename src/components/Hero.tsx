import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Play, Code2, LineChart, Award, Users, Bot, BadgeCheck, GraduationCap, Headphones } from 'lucide-react';
import { useData } from '../context/DataContext';

interface HeroProps {
  setActiveTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const { siteSettings, t } = useData();

  return (
    <div className="relative bg-gradient-to-b from-[#142B4D] via-[#10223E] to-[#142B4D] text-white py-10 sm:py-14 lg:py-16 overflow-hidden border-b border-slate-800">
      {/* Abstract Glowing Background Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#1DB954]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/40 text-[#1DB954] text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              {t('১০০% প্রফেশনাল আইটি ও এলএমএস প্ল্যাটফর্ম', '100% Professional IT & LMS Platform')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black font-bengali leading-tight lg:leading-tight text-white tracking-tight"
            >
              {siteSettings.heroHeading || t("আপনার ডিজিটাল প্ল্যাটফর্ম এখানে তৈরি করুন", "Build Your Digital Career & Business")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 font-bengali max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {siteSettings.heroSubtext || t("PTENit আপনার ব্যবসা ও ক্যারিয়ারের জন্য আধুনিক IT Services, Digital Marketing, Web Development এবং Professional Training Solutions প্রদান করে।", "PTENit provides modern IT Services, Digital Marketing, Web Development, and Professional Training Solutions for your business and career.")}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => setActiveTab('services')}
                className="px-7 py-3.5 rounded-xl font-bold text-white bg-[#1DB954] hover:bg-emerald-500 shadow-xl shadow-[#1DB954]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 group text-base"
              >
                {t('সার্ভিসসমূহ দেখুন', 'Explore Services')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className="px-7 py-3.5 rounded-xl font-bold text-slate-100 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 hover:border-[#1DB954] transition-all cursor-pointer text-base flex items-center gap-2"
              >
                {t('কোর্সসমূহ দেখুন', 'Explore Courses')}
                <Play className="w-4 h-4 text-[#1DB954] fill-[#1DB954]" />
              </button>
            </motion.div>

            {/* Micro Feature Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800 max-w-xl mx-auto lg:mx-0 text-left"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1DB954]" />
                <span className="text-xs font-semibold text-slate-300 font-bengali">AI Powered Support</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1DB954]" />
                <span className="text-xs font-semibold text-slate-300 font-bengali">{t('বিশ্বস্ত ট্রেনিং', 'Trusted Training')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1DB954]" />
                <span className="text-xs font-semibold text-slate-300 font-bengali">{t('সনদপত্র প্রদান', 'Certificates Provided')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#1DB954]" />
                <span className="text-xs font-semibold text-slate-300 font-bengali">{t('লাইফটাইম সাপোর্ট', 'Lifetime Support')}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Interactive Tech Graphics */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Glass Computer Mockup Container */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-4 shadow-2xl shadow-emerald-950/50 backdrop-blur-md relative overflow-hidden">
                {/* Browser Top Header */}
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

                {/* Dashboard / Analytics Graphic Simulation */}
                <div className="space-y-4">
                  {/* Top Stats Banner */}
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

                  {/* Code / Visual Preview Box or Custom Uploaded Hero Banner */}
                  {siteSettings.heroBannerUrl ? (
                    <div className="rounded-xl overflow-hidden border border-slate-800 shadow-lg max-h-48">
                      <img src={siteSettings.heroBannerUrl} alt="Hero Banner" className="w-full h-full object-cover" />
                    </div>
                  ) : (
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
                  )}

                  {/* Floating Action Badge */}
                  <div className="bg-gradient-to-r from-[#1DB954] to-emerald-600 p-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-between shadow-lg">
                    <span className="font-bengali">{t('লাইভ ক্লাস ও ফ্রিল্যান্সিং গাইডলাইন', 'Live Classes & Freelancing Guidance')}</span>
                    <span className="bg-white/20 px-2 py-1 rounded text-[10px]">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-slate-800/95 border border-[#1DB954]/50 text-white p-3 rounded-xl shadow-xl hidden sm:flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full bg-[#1DB954] animate-ping" />
                <div>
                  <p className="text-xs font-bold text-[#1DB954]">{t('নতুন ব্যাচ শুরু', 'New Batch Admission')}</p>
                  <p className="text-[11px] text-slate-300 font-bengali">{t('ক্যানভা ও ইউটিউব এসইও', 'Canva & YouTube SEO')}</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};
