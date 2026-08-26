import React from 'react';
import { Briefcase, Cpu, UserCheck, ShieldCheck, Headphones, CircleDollarSign } from 'lucide-react';
import { useData } from '../context/DataContext';

export const WhyChooseUs: React.FC = () => {
  const { t } = useData();

  const features = [
    {
      title: t("অভিজ্ঞতা & দক্ষতা", "Expertise & Skills"),
      desc: t("আমাদের টিমে রয়েছে ওয়েবসাইট ডিজাইন, ডেভেলপমেন্ট, এসইও, গ্রাফিক্স ও ডিজিটাল মার্কেটিং এর অভিজ্ঞ প্রফেশনালবৃন্দ।", "Our team consists of seasoned professionals in Web Design, Development, SEO, Graphics, and Digital Marketing."),
      icon: Briefcase,
      color: "text-[#1DB954]",
      bgColor: "bg-[#1DB954]/10"
    },
    {
      title: t("আধুনিক প্রযুক্তি", "Modern Technology"),
      desc: t("আমরা আধুনিক প্রযুক্তি এবং বিশ্বমানের সফটওয়্যার টুলস ব্যবহার করে আপনার ব্যবসার জন্য কার্যকর ডিজিটাল সলিউশন নিশ্চিত করি।", "We leverage modern technologies and world-class software tools to deliver robust digital solutions for your business."),
      icon: Cpu,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10"
    },
    {
      title: t("ব্যক্তিগত কাস্টম গাইডলাইন", "Personalized Support"),
      desc: t("প্রতিটি ক্লায়েন্ট ও স্টুডেন্টের আলাদা লক্ষ্য থাকে। আমরা প্রত্যেকের চাহিদা অনুযায়ী কাস্টমাইজড সাপোর্ট ও কোর্স মডিউল দিয়ে থাকি।", "Every client and student has unique goals. We provide customized support tailored to your specific requirements."),
      icon: UserCheck,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    {
      title: t("কোয়ালিটি গ্যারান্টি", "Top Quality Guarantee"),
      desc: t("প্রজেক্টের প্রতিটি ডিটেইলসে আমরা সর্বোচ্চ মান বজায় রাখি, যেন কাজের ফলাফল শতভাগ পেশাদার ও আন্তর্জাতিক মানের হয়।", "We maintain top quality in every detail to ensure 100% professional and international standards."),
      icon: ShieldCheck,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10"
    },
    {
      title: t("২৪/৭ ডেডিকেটেড সাপোর্ট", "24/7 Dedicated Support"),
      desc: t("কোর্স শেষ হওয়ার পরেও ক্লায়েন্ট ও শিক্ষার্থীদের জন্য আমাদের রয়েছে ডেডিকেটেড লাইফটাইম প্রাইভেট সাপোর্ট গ্রুপ।", "Even after course completion, we offer lifetime dedicated private support groups for students and clients."),
      icon: Headphones,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: t("সাশ্রয়ী ও যুক্তিসঙ্গত বাজেট", "Affordable Pricing"),
      desc: t("সাশ্রয়ী ও যুক্তিসঙ্গত মূল্যে বাংলাদেশে আন্তর্জাতিক মানের আইটি সার্ভিস ও ট্রেনিং পাওয়ার একমাত্র নির্ভরযোগ্য প্রতিষ্ঠান।", "The most reliable institution in Bangladesh providing international quality IT services and training at affordable rates."),
      icon: CircleDollarSign,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10"
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-10 gap-2.5 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
            {t('কেন PTENit', 'Why Choose PTENit')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
            {t('কেন PTENit নির্বাচন করবেন?', 'Why Choose PTENit?')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-bengali">
            {t('আমরা শুধু কাজ করে দেওয়া বা ট্রেনিং দেওয়ায় সীমাবদ্ধ নই, আপনার সফলতার পথে দীর্ঘমেয়াদী অংশীদার হিসেবে কাজ করি।', 'We go beyond providing services or training — we act as your long-term success partner.')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 p-3.5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-[#1DB954] transition-all duration-300 space-y-2 sm:space-y-4 flex flex-col justify-start"
              >
                <div className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${feat.bgColor} ${feat.color} w-fit`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xs sm:text-lg lg:text-xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
                  {feat.title}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600 dark:text-slate-300 font-bengali leading-relaxed line-clamp-4 sm:line-clamp-none">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
