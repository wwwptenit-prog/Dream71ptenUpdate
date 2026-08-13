import React from 'react';
import { Target, Eye, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AboutSection: React.FC = () => {
  const { t } = useData();

  const teamMembers = [
    {
      name: t("কাজী সোহাগ", "Kazi Sohag"),
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      bio: t("৮+ বছরের ডিজিটাল মার্কেটিং ও আইটি প্রজেক্ট ম্যানেজমেন্টের অভিজ্ঞতা।", "8+ years of experience in Digital Marketing & IT Project Management.")
    },
    {
      name: t("তানভীর আহমেদ", "Tanveer Ahmed"),
      role: "Lead UI/UX & Graphic Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      bio: t("আন্তর্জাতিক ফাইবার ও আপওয়ার্ক টপ রেটেড ক্যানভা ও গ্রাফিক্স বিশেষজ্ঞ।", "Top rated Canva & Graphics specialist on Fiverr and Upwork.")
    },
    {
      name: t("শাহরিয়ার হাসান", "Shahriar Hasan"),
      role: "Senior Full Stack Web Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      bio: t("React, Node.js এবং WordPress ই-কমার্স স্পেশালিস্ট।", "React, Node.js and WordPress e-Commerce specialist.")
    }
  ];

  return (
    <div className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-8 sm:space-y-10">
        
        {/* Main Intro */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3 sm:gap-4">
          <span className="text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> {t('কোম্পানি বিবরণী', 'Company Overview')}
          </span>
          <h1 className="text-2xl sm:text-5xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
            {t('PTENit সম্পর্কে জানুন', 'About PTENit')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-bengali">
            {t(
              'PTENit সবসময় আধুনিক প্রযুক্তি ব্যবহার করে ব্যবসা ও ব্যক্তিগত ব্র্যান্ডের জন্য সৃজনশীল এবং ডায়নামিক ডিজিটাল সমাধান তৈরি করে। ওয়েবসাইট, ডিজিটাল মার্কেটিং, গ্রাফিক ডিজাইন, ভিডিও এডিটিং, SEO এবং প্রশিক্ষণসহ বিভিন্ন IT সেবা ও শিক্ষা কার্যক্রমের মাধ্যমে আমরা ব্যক্তি ও প্রতিষ্ঠানকে ডিজিটাল দুনিয়ায় এগিয়ে যেতে সহায়তা করি।',
              'PTENit delivers creative and dynamic digital solutions for businesses and personal brands. Through website development, digital marketing, graphic design, video editing, SEO, and professional training, we empower individuals and companies in the digital world.'
            )}
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1DB954]/20 text-[#1DB954] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white font-bengali">
              {t('আমাদের মিশন', 'Our Mission')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-bengali leading-relaxed">
              {t(
                'বাংলাদেশের প্রতিটি তরুণ ও ব্যবসায় প্রতিষ্ঠানকে আধুনিক আইটি স্কিল ও ডিজিটাল মার্কেটিং সেবার মাধ্যমে স্বাবলম্বী করে তোলা এবং বৈশ্বিক ফ্রিল্যান্সিং মার্কেটপ্লেসে শীর্ষস্থান ধরে রাখা।',
                'To empower youth and businesses in Bangladesh through modern IT skills and digital marketing services to succeed in global marketplaces.'
              )}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white font-bengali">
              {t('আমাদের ভিশন', 'Our Vision')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-bengali leading-relaxed">
              {t(
                'একটি স্মার্ট ও প্রযুক্তি নির্ভর বাংলাদেশ গড়ে তোলা, যেখানে প্রতিটি উদ্যোক্তা তাদের নিজস্ব ওয়েবসাইট ও সোশ্যাল মিডিয়ায় সফলতার সাথে ব্যবসা পরিচালনা করতে পারবে।',
                'To build a smart, tech-driven nation where entrepreneurs successfully operate businesses via websites and social platforms.'
              )}
            </p>
          </div>
        </div>

        {/* Our Team */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white font-bengali">
              {t('আমাদের এক্সপার্ট ট্রেইনার ও টিম', 'Our Expert Trainers & Team')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bengali">
              {t('দীর্ঘ অভিজ্ঞতাসম্পন্ন আইটি প্রফেশনাল ও ফ্রিল্যান্সারদের তত্ত্বাবধানে আমাদের টিম পরিচালিত।', 'Our team is guided by experienced IT professionals and top-rated freelancers.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-sm hover:border-[#1DB954] transition-all">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-[#1DB954] shadow-md"
                />
                <div>
                  <h3 className="font-bold text-lg font-heading text-slate-900 dark:text-white">{m.name}</h3>
                  <span className="text-xs text-[#1DB954] font-bold block">{m.role}</span>
                </div>
                <p className="text-xs text-slate-500 font-bengali leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
