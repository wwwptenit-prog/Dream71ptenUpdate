import React from 'react';
import { Clock, BookOpen, Users, Star, ArrowRight, Tag, CheckCircle2, PlayCircle } from 'lucide-react';
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

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl border ${isEnrolled ? 'border-[#1DB954] shadow-md dark:border-[#1DB954]/60' : 'border-slate-200/90 dark:border-slate-700/80 shadow-sm'} hover:shadow-2xl hover:border-[#1DB954] transition-all duration-300 flex flex-col overflow-hidden group`}>
      
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video sm:aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-2 flex-wrap">
          {isEnrolled ? (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#1DB954] text-slate-950 font-black text-[9px] sm:text-xs shadow-md uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-slate-950" /> {t('এনরোল্ড', 'Enrolled')}
            </span>
          ) : course.isFree ? (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500 text-white font-bold text-[9px] sm:text-xs shadow-md uppercase tracking-wider flex items-center gap-0.5 sm:gap-1">
              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {t('সম্পূর্ণ ফ্রি', 'Fully Free')}
            </span>
          ) : (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#142B4D] text-[#1DB954] border border-[#1DB954]/50 font-bold text-[9px] sm:text-xs shadow-md uppercase tracking-wider">
              {t('প্রিমিয়াম', 'Premium')}
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-black/60 text-slate-200 text-[9px] sm:text-xs font-semibold backdrop-blur-md">
            {course.category}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-0.5 sm:gap-1 bg-black/70 text-amber-400 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold backdrop-blur-md">
          <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400" />
          <span>{course.rating}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4.5 md:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
        
        <div className="space-y-1">
          <h3
            onClick={() => {
              if (isEnrolled && onStartLearning) {
                onStartLearning(course.id);
              } else {
                onOpenDetail(course.id);
              }
            }}
            className="text-xs sm:text-base font-bold font-heading text-slate-900 dark:text-white hover:text-[#1DB954] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {course.title}
          </h3>

          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold font-bengali truncate">
            {t('ইন্সট্রাক্টর:', 'Instructor:')} <span className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1"><span className="truncate">{course.instructor}</span><CheckCircle2 className="w-3 h-3 text-[#0084FF] fill-[#0084FF] text-white shrink-0" title="ভেরিফাইড ইনস্ট্রাক্টর" /></span>
          </p>
        </div>

        {/* Course Info Micro Metrics */}
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1 py-1.5 sm:py-2.5 border-y border-slate-100 dark:border-slate-700/60 text-[9px] sm:text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1DB954] shrink-0" />
            <span className="truncate">{course.duration}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 justify-center min-w-0">
            <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1DB954] shrink-0" />
            <span className="truncate">{course.lessonsCount} {t('ক্লাস', 'L')}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 justify-end min-w-0">
            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1DB954] shrink-0" />
            <span className="truncate">{course.enrolledCount}+</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="min-w-0">
            {isEnrolled ? (
              <span className="text-[11px] sm:text-xs font-black text-[#1DB954] flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
                <span>অ্যাক্টিভ কোর্স</span>
              </span>
            ) : course.isFree ? (
              <span className="text-[11px] sm:text-base font-black text-emerald-500 dark:text-emerald-400 block truncate leading-tight">
                {t('সম্পূর্ণ ফ্রি', 'Fully Free')}
              </span>
            ) : (
              <div className="flex flex-col">
                {course.discountPrice && (
                  <span className="text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 line-through block leading-tight truncate">
                    ৳{course.price.toLocaleString('bn-BD')}
                  </span>
                )}
                <span className="text-xs sm:text-base md:text-lg font-black text-[#1DB954] block truncate leading-tight">
                  ৳{(course.discountPrice || course.price).toLocaleString('bn-BD')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black text-slate-950 bg-[#1DB954] hover:bg-[#19a34a] shadow-xs sm:shadow-md sm:shadow-[#1DB954]/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
              >
                <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{t('ক্লাসে যান →', 'Go to Class →')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenDetail(course.id)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-600 shadow-xs sm:shadow-md sm:shadow-[#1DB954]/20 transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
              >
                <span>{t('বিস্তারিত', 'Details')}</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
