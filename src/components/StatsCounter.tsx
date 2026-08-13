import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';
import { Users, CheckCircle2, BookOpen, HeartHandshake } from 'lucide-react';
import { useData } from '../context/DataContext';

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function toBengali(numStr: string): string {
  return numStr.replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)]);
}

function fromBengali(str: string): string {
  let res = str;
  bengaliDigits.forEach((bDigit, idx) => {
    res = res.replaceAll(bDigit, englishDigits[idx]);
  });
  return res;
}

interface AnimatedCounterProps {
  value: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayStr, setDisplayStr] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const isBengaliInput = /[০-৯]/.test(value);
    const normalizedValue = fromBengali(value);

    const match = normalizedValue.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayStr(value);
      return;
    }

    const prefix = match[1] || '';
    const rawNumStr = match[2].replace(/,/g, '');
    const targetNum = parseFloat(rawNumStr);
    const suffix = match[3] || '';

    if (isNaN(targetNum)) {
      setDisplayStr(value);
      return;
    }

    const duration = 3000; // 3 seconds count-up duration
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Smooth Ease Out curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easeProgress * targetNum);

      let formattedNum = currentNum.toLocaleString();
      if (isBengaliInput) {
        formattedNum = toBengali(formattedNum);
      }

      setDisplayStr(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        let finalNum = targetNum.toLocaleString();
        if (isBengaliInput) finalNum = toBengali(finalNum);
        setDisplayStr(`${prefix}${finalNum}${suffix}`);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value]);

  return <span ref={ref}>{displayStr}</span>;
};

export const StatsCounter: React.FC = () => {
  const { siteSettings, t } = useData();

  const stats = [
    {
      id: 'students',
      label: t('সফল স্টুডেন্ট', 'Successful Students'),
      value: siteSettings.statsStudents || '500+',
      icon: Users,
      color: 'text-[#1DB954]',
      bgColor: 'bg-[#1DB954]/10'
    },
    {
      id: 'projects',
      label: t('সফল প্রজেক্ট ডেলিভারি', 'Projects Delivered'),
      value: siteSettings.statsProjects || '100+',
      icon: CheckCircle2,
      color: 'text-sky-500',
      bgColor: 'bg-sky-500/10'
    },
    {
      id: 'courses',
      label: t('পেশাদার ট্রেনিং কোর্স', 'Professional Courses'),
      value: siteSettings.statsCourses || '50+',
      icon: BookOpen,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      id: 'satisfaction',
      label: t('ক্লায়েন্ট স্যাটিসফ্যাকশন', 'Client Satisfaction'),
      value: siteSettings.statsSatisfaction || '95%',
      icon: HeartHandshake,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10'
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="p-3.5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 hover:border-[#1DB954] transition-all transform hover:-translate-y-1 shadow-sm"
              >
                <div className={`p-2.5 sm:p-4 rounded-xl ${stat.bgColor} ${stat.color} shrink-0`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">
                    <AnimatedCounter value={stat.value} />
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 font-bengali leading-snug">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
