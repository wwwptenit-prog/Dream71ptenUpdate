import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { siteSettings, services, courses, t } = useData();

  return (
    <footer className="bg-[#142B4D] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Logo & About */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1DB954] to-emerald-600 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                P
              </div>
              <span className="font-heading text-2xl font-black text-white">
                PTEN<span className="text-[#1DB954]">it</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed font-bengali">
              {t('PTENit আপনার ব্যবসা ও ক্যারিয়ারের জন্য আধুনিক IT Services, Digital Marketing, Web Development এবং Professional Training Solutions প্রদান করে।', 'PTENit provides modern IT Services, Digital Marketing, Web Development, and Professional Training Solutions for your business and career.')}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1DB954] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1DB954] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1DB954] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1DB954] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links & Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading border-l-4 border-[#1DB954] pl-3">
              {t('কুইক লিংকস', 'Quick Links')}
            </h4>
            <ul className="space-y-2.5 text-sm font-bengali">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('হোম', 'Home')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('marketplace')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5 font-bold text-[#1DB954]">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('ফ্রিডম মার্কেটপ্লেস', 'Marketplace')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('আমাদের আইটি সার্ভিস', 'IT Services')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('courses')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('কোর্সসমূহ', 'Courses')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('আমাদের সম্পর্কে', 'About Us')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('ছবি গ্যালারি', 'Photo Gallery')}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1DB954]" /> {t('যোগাযোগ', 'Contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Courses & Escrow Guarantee */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading border-l-4 border-[#1DB954] pl-3">
              {t('জনপ্রিয় কোর্সসমূহ', 'Popular Courses')}
            </h4>
            <ul className="space-y-2.5 text-sm font-bengali">
              {courses.slice(0, 4).map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="hover:text-[#1DB954] transition-colors flex items-center gap-2 text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                    <span className="line-clamp-1">{c.title}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Escrow Guarantee Box */}
            <div className="mt-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 font-bengali space-y-1">
              <span className="text-[11px] font-black text-[#1DB954] block">
                🛡️ শতভাগ নিরাপদ লেনদেন
              </span>
              <p className="text-[10px] text-slate-400 leading-normal">
                সকল লেনদেন এবং সার্ভিস ডেলিভারির দায়ভার প্রতিষ্ঠান কর্তৃক সরাসরি নিয়ন্ত্রিত ও পরিচালিত।
              </p>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-heading border-l-4 border-[#1DB954] pl-3">
              {t('যোগাযোগ ঠিকানা', 'Contact Info')}
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1DB954] shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs leading-relaxed font-bengali">{siteSettings.officeAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1DB954] shrink-0" />
                <span className="text-slate-300 text-xs font-semibold">{siteSettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#1DB954] shrink-0" />
                <span className="text-slate-300 text-xs">{siteSettings.email}</span>
              </li>
              <li className="pt-2">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  {t('হোয়াটসঅ্যাপে চ্যাট করুন', 'Chat on WhatsApp')}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Official Payment Methods Bar */}
        <div className="py-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-bengali">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="text-[#1DB954]">💳 অফিশিয়াল পেমেন্ট মেথড:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 bg-pink-950/60 text-pink-400 border border-pink-800/40 rounded-lg font-bold">
              bKash: {siteSettings.bkashNumber || '01712345678'}
            </span>
            <span className="px-2.5 py-1 bg-orange-950/60 text-orange-400 border border-orange-800/40 rounded-lg font-bold">
              Nagad: {siteSettings.nagadNumber || '01700000000'}
            </span>
            <span className="px-2.5 py-1 bg-purple-950/60 text-purple-400 border border-purple-800/40 rounded-lg font-bold">
              Rocket: {siteSettings.rocketNumber || '01900000000'}
            </span>
            <span className="px-2.5 py-1 bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg font-bold">
              {siteSettings.bankName || 'Dutch-Bangla Bank PLC'} ({siteSettings.bankAccountNumber || '2181100098765'})
            </span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PTENit. All Rights Reserved.</p>
          <p className="text-slate-400 font-bengali">
            {t('"আপনার ডিজিটাল প্ল্যাটফর্ম এখানে তৈরি করুন"', '"Build Your Digital Platform Here"')}
          </p>
        </div>
      </div>
    </footer>
  );
};
