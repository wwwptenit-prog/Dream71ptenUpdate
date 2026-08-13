import React, { useState } from 'react';
import { Search, Filter, Sparkles, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CourseCard } from './CourseCard';
import { Course } from '../types';

interface CoursesSectionProps {
  onOpenDetail: (courseId: string) => void;
  onQuickEnroll: (course: Course) => void;
  setActiveTab?: (tab: string, category?: string) => void;
  isStandalonePage?: boolean;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  onOpenDetail,
  onQuickEnroll,
  setActiveTab,
  isStandalonePage = false
}) => {
  const { courses, t } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    if (!course.published) return false;

    // Category filter
    if (selectedCategory !== 'All' && course.category !== selectedCategory) {
      return false;
    }

    // Pricing filter
    if (pricingFilter === 'Free' && !course.isFree) return false;
    if (pricingFilter === 'Paid' && course.isFree) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchInstructor = course.instructor.toLowerCase().includes(q);
      const matchTag = course.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchInstructor && !matchTag) return false;
    }

    return true;
  });

  const coursesToDisplay = !isStandalonePage ? filteredCourses.slice(0, 4) : filteredCourses;

  return (
    <section className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-900/90">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Back Button if standalone page */}
        {isStandalonePage && setActiveTab && (
          <div className="mb-6">
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-[#1DB954] hover:text-slate-950 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-sm font-bengali"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← ব্যাক টু হোম পেজ (Back to Home)</span>
            </button>
          </div>
        )}

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 max-w-2xl">
            <span className="text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20 inline-flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> {t('এলএমএস ক্যারিয়ার একাডেমি', 'LMS Career Academy')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
              {t('আমাদের কোর্সসমূহ', 'Our Courses')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bengali">
              {t('দক্ষতা অর্জন করুন এবং ক্যারিয়ার গড়ুন।', 'Build skills and advance your career.')}
            </p>
          </div>

          {!isStandalonePage && setActiveTab && (
            <button
              onClick={() => setActiveTab('courses')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md font-bengali shrink-0"
            >
              <span>{t('সকল কোর্স দেখুন (See All)', 'See All Courses')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Bar (Visible in standalone or if active) */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t("কোর্স বা স্কিল লিখে সার্চ...", "Search courses or skills...")}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-[#1DB954]"
              />
            </div>

            {/* Free vs Paid Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setPricingFilter('All')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingFilter === 'All'
                    ? 'bg-[#1DB954] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                {t('সব কোর্স', 'All Courses')}
              </button>
              <button
                onClick={() => setPricingFilter('Paid')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingFilter === 'Paid'
                    ? 'bg-[#1DB954] text-[#ffffff] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                {t('প্রিমিয়াম কোর্স', 'Premium Courses')}
              </button>
              <button
                onClick={() => setPricingFilter('Free')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingFilter === 'Free'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-white'
                }`}
              >
                {t('ফ্রি কোর্স', 'Free Courses')}
              </button>
            </div>

          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-700/60 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 uppercase mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> ক্যাটাগরি:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer font-bengali ${
                  selectedCategory === cat
                    ? 'bg-[#142B4D] text-[#1DB954] border border-[#1DB954]/50'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'সকল ক্যাটাগরি' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Courses Grid: 4 Columns 1 Row Layout */}
        {coursesToDisplay.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coursesToDisplay.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onOpenDetail={onOpenDetail}
                  onQuickEnroll={onQuickEnroll}
                />
              ))}
            </div>

            {/* Bottom See All Button on Home view if more courses exist */}
            {!isStandalonePage && filteredCourses.length > 4 && setActiveTab && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md font-bengali"
                >
                  <span>{t('সকল কোর্স দেখুন (See All Courses)', 'See All Courses')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white font-bengali">
              কোনো কোর্স পাওয়া যায়নি
            </h3>
            <p className="text-xs text-slate-500 font-bengali">
              আপনার ফিল্টার বা সার্চ কিওয়ার্ড পরিবর্তন করে দেখুন।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setPricingFilter('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#1DB954] text-white text-xs font-bold rounded-xl"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
