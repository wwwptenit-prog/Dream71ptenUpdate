import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useData } from '../context/DataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, t } = useData();

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-8 sm:space-y-10">
        
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3 sm:gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
            {t('সাকসেস স্টোরি', 'Success Stories')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
            {t('আমাদের শিক্ষার্থী ও ক্লায়েন্টদের মতামত', 'Student & Client Reviews')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-bengali">
            {t('PTENit থেকে ট্রেনিং নিয়ে শত শত স্টুডেন্ট ও বিজনেস ওনাররা তাদের লক্ষ্যে পৌঁছেছেন।', 'Hundreds of students and business owners reached their goals with PTENit.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(item => (
            <div
              key={item.id}
              className="bg-slate-50 dark:bg-slate-800/60 p-8 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between relative group"
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
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-bengali">
                    {item.name}
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
