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
  lang: 'bn' | 'en';
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, lang }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [displayStr, setDisplayStr] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const normalizedValue = fromBengali(value);

    const match = normalizedValue.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayStr(lang === 'bn' ? toBengali(value) : fromBengali(value));
      return;
    }

    const prefix = match[1] || '';
    const rawNumStr = match[2].replace(/,/g, '');
    const targetNum = parseFloat(rawNumStr);
    const suffix = match[3] || '';

    if (isNaN(targetNum)) {
      setDisplayStr(lang === 'bn' ? toBengali(value) : fromBengali(value));
      return;
    }

    const duration = 2500; // 2.5 seconds count-up duration
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Smooth Ease Out curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNum = Math.floor(easeProgress * targetNum);

      let formattedNum = lang === 'bn' ? toBengali(currentNum.toLocaleString()) : currentNum.toLocaleString('en-US');
      setDisplayStr(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        let finalNum = lang === 'bn' ? toBengali(targetNum.toLocaleString()) : targetNum.toLocaleString('en-US');
        setDisplayStr(`${prefix}${finalNum}${suffix}`);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, value, lang]);

  return <span ref={ref}>{displayStr}</span>;
};

export const StatsCounter: React.FC = () => {
  const { siteSettings, t, lang } = useData();

  const stats = [
    {
      id: 'students',
      label: t('সফল স্টুডেন্ট ও ট্রেইনি', 'Successful Students & Trainees'),
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
      label: t('ক্লায়েন্ট স্যাটিসফ্যাকশন', 'Client Satisfaction Rate'),
      value: siteSettings.statsSatisfaction || '95%',
      icon: HeartHandshake,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10'
    }
  ];

  return (
    <section className="py-6 sm:py-10 lg:py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="p-3 sm:p-5 lg:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3.5 hover:border-[#1DB954] transition-all transform hover:-translate-y-1 shadow-xs"
              >
                <div className={`p-2 sm:p-3.5 rounded-xl ${stat.bgColor} ${stat.color} shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl lg:text-3xl font-black font-heading text-slate-900 dark:text-white">
                    <AnimatedCounter value={stat.value} lang={lang} />
                  </h3>
                  <p className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 font-bengali leading-snug">
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
