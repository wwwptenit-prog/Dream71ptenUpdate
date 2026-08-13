import React from 'react';
import { Clock, BookOpen, Users, Star, ArrowRight, Tag } from 'lucide-react';
import { Course } from '../types';
import { useData } from '../context/DataContext';

interface CourseCardProps {
  course: Course;
  onOpenDetail: (courseId: string) => void;
  onQuickEnroll: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetail,
  onQuickEnroll
}) => {
  const { t } = useData();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-2xl hover:border-[#1DB954] transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Thumbnail & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Free / Paid Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {course.isFree ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-md uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" /> {t('ফ্রি', 'Free')}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-[#142B4D] text-[#1DB954] border border-[#1DB954]/50 font-bold text-xs shadow-md uppercase tracking-wider">
              {t('প্রিমিয়াম', 'Premium')}
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-lg bg-black/60 text-slate-200 text-xs font-semibold backdrop-blur-md">
            {course.category}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 text-amber-400 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{course.rating}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          <h3
            onClick={() => onOpenDetail(course.id)}
            className="text-lg font-bold font-heading text-slate-900 dark:text-white hover:text-[#1DB954] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {course.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-bengali">
            {t('ইন্সট্রাক্টর:', 'Instructor:')} <span className="text-slate-700 dark:text-slate-200">{course.instructor}</span>
          </p>
        </div>

        {/* Course Info Micro Metrics */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#1DB954]" />
            <span className="truncate">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <BookOpen className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>{course.lessonsCount} {t('ক্লাস', 'Lessons')}</span>
          </div>
          <div className="flex items-center gap-1 justify-end">
            <Users className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>{course.enrolledCount}+</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {course.isFree ? (
              <span className="text-lg font-black text-emerald-500">{t('ফ্রি!', 'Free!')}</span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white font-heading">
                  ৳{course.discountPrice || course.price}
                </span>
                {course.discountPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ৳{course.price}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetail(course.id)}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {t('বিস্তারিত', 'Details')}
            </button>
            <button
              onClick={() => onQuickEnroll(course)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1DB954] hover:bg-emerald-500 shadow-md shadow-[#1DB954]/20 transition-all cursor-pointer flex items-center gap-1"
            >
              {t('এনরোল', 'Enroll')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
