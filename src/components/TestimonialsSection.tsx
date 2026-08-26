import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, t } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide on mobile every 3.5 seconds
  useEffect(() => {
    if (isPaused || !testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, testimonials]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 font-bengali">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-6 sm:space-y-10">
        
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2.5 sm:gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
            {t('সাকসেস স্টোরি', 'Success Stories')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
            {t('আমাদের শিক্ষার্থী ও ক্লায়েন্টদের মতামত', 'Student & Client Reviews')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base font-bengali">
            {t('PTENit থেকে ট্রেনিং নিয়ে শত শত স্টুডেন্ট ও বিজনেস ওনাররা তাদের লক্ষ্যে পৌঁছেছেন।', 'Hundreds of students and business owners reached their goals with PTENit.')}
          </p>
        </div>

        {/* Mobile View: Automatic Slide Carousel */}
        <div 
          className="block md:hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((item, idx) => (
                <div key={item.id || idx} className="w-full shrink-0 px-1">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs relative flex flex-col justify-between min-h-[260px]">
                    <Quote className="w-8 h-8 text-[#1DB954]/20 absolute top-4 right-4" />

                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic font-bengali leading-relaxed">
                        "{item.text}"
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#1DB954] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white font-bengali truncate flex items-center gap-1">
                          <span className="truncate">{item.name}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                        </h4>
                        <p className="text-[11px] text-slate-500 font-bengali truncate">
                          {item.role} • <span className="text-[#1DB954] font-semibold">{item.courseOrService}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls on Mobile */}
          <div className="flex items-center justify-between mt-4 px-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#1DB954] hover:text-white transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dots indicator */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-[#1DB954]'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#1DB954] hover:text-white transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop View: Clean 3-Column Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="bg-slate-50 dark:bg-slate-800/60 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-[#1DB954]/20 absolute top-6 right-6 group-hover:text-[#1DB954]/40 transition-colors" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 italic font-bengali leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1DB954]"
                />
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-bengali flex items-center gap-1">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড প্রোফাইল" />
                  </h4>
                  <p className="text-xs text-slate-500 font-bengali">
                    {item.role} • <span className="text-[#1DB954] font-semibold">{item.courseOrService}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
