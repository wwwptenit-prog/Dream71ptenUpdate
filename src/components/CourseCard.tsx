import React from 'react';
import { Clock, BookOpen, Users, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Course } from '../types';
import { useData } from '../context/DataContext';

interface CourseCardProps {
  course: Course;
  onOpenDetail: (courseId: string) => void;
  onQuickEnroll: (course: Course) => void;
  onStartLearning?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetail,
  onQuickEnroll,
  onStartLearning
}) => {
  const { t, currentUser, enrollments } = useData();

  const isEnrolled = currentUser
    ? enrollments.some(e => (e.userId === currentUser.id || (e as any).studentId === currentUser.id) && e.courseId === course.id)
    : false;

  const toBengaliNumber = (num: number | string): string => {
    const banglaDigits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).replace(/[0-9]/g, d => banglaDigits[d] || d);
  };

  const getBanglaDuration = (durationStr?: string): string => {
    if (!durationStr) return '৪ সপ্তাহ';
    let str = durationStr.replace(/\s*\([^)]*\)/, '').trim();
    str = toBengaliNumber(str);
    str = str.replace(/weeks?/i, 'সপ্তাহ')
             .replace(/months?/i, 'মাস')
             .replace(/hours?|hrs?/i, 'ঘণ্টা')
             .replace(/mins?|minutes?/i, 'মিনিট')
             .replace(/days?/i, 'দিন');
    return str;
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border ${isEnrolled ? 'border-[#1DB954] shadow-sm dark:border-[#1DB954]/60' : 'border-slate-200/90 dark:border-slate-800 shadow-xs'} hover:shadow-xl hover:-translate-y-1 hover:border-[#1DB954] transition-all duration-300 flex flex-col justify-between overflow-hidden group`}>
      
      {/* Thumbnail: Standard Aspect Ratio 16:10 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Minimal Enrolled indicator only if already enrolled */}
        {isEnrolled && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-md bg-[#1DB954] text-white font-bold text-[9px] sm:text-[10px] shadow-xs uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-white" /> {t('এনরোল্ড', 'Enrolled')}
            </span>
          </div>
        )}
      </div>

      {/* Card Content - Harmonized body padding and spacing */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        
        <div>
          <h3
            onClick={() => {
              if (isEnrolled && onStartLearning) {
                onStartLearning(course.id);
              } else {
                onOpenDetail(course.id);
              }
            }}
            className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-[#1DB954] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[2.25rem] sm:min-h-[2.5rem]"
            title={course.title}
          >
            {course.title}
          </h3>
        </div>

        {/* Course Info Micro Metrics */}
        <div className="grid grid-cols-3 gap-1 py-1.5 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex flex-col items-center justify-center text-center min-w-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1DB954] mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full leading-tight">
              {getBanglaDuration(course.duration)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center min-w-0">
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1DB954] mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full leading-tight">
              {toBengaliNumber(course.lessonsCount || 1)} ক্লাস
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center min-w-0">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1DB954] mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full leading-tight">
              {toBengaliNumber(course.enrolledCount || 1)}+
            </span>
          </div>
        </div>

      </div>

      {/* Price & Actions Ribbon - Harmonized with GigCard and DigitalProducts */}
      <div className="p-2.5 sm:p-3.5 bg-slate-50/90 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 rounded-b-2xl">
        <div className="min-w-0">
          {isEnrolled ? (
            <span className="text-[11px] sm:text-xs font-bold text-[#1DB954] flex items-center gap-1 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
              <span>অ্যাক্টিভ</span>
            </span>
          ) : course.isFree ? (
            <div>
              <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block leading-none mb-1 uppercase tracking-wider">
                স্পেশাল
              </span>
              <span className="text-sm sm:text-base md:text-lg font-black text-emerald-500 dark:text-emerald-400 block truncate leading-none">
                {t('সম্পূর্ণ ফ্রি', 'Fully Free')}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-bold block leading-none mb-1 uppercase tracking-wider">
                কোর্স ফি
              </span>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white block truncate leading-none tracking-tight">
                  ৳{(course.discountPrice || course.price).toLocaleString('bn-BD')}
                </span>
                {course.discountPrice && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-none">
                    ৳{course.price.toLocaleString('bn-BD')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isEnrolled ? (
            <button
              type="button"
              onClick={() => {
                if (onStartLearning) {
                  onStartLearning(course.id);
                } else {
                  onOpenDetail(course.id);
                }
              }}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-600 shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
            >
              <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{t('ক্লাসে যান', 'Go to Class')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenDetail(course.id)}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-600 shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
            >
              <span>{t('বিস্তারিত', 'Details')}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
