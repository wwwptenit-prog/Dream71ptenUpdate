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

          {/* 2-Column Group: Quick Links & Popular Courses */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:col-span-2 lg:col-span-2">
            {/* Sub-Column 1: Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4 font-heading border-l-4 border-[#1DB954] pl-2.5">
                {t('কুইক লিংকস', 'Quick Links')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-bengali">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('হোম', 'Home')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('marketplace')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5 font-bold text-[#1DB954]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('ফ্রিডম মার্কেটপ্লেস', 'Marketplace')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('services')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('আমাদের আইটি সার্ভিস', 'IT Services')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('courses')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('কোর্সসমূহ', 'Courses')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('about')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('আমাদের সম্পর্কে', 'About Us')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('gallery')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('ছবি গ্যালারি', 'Photo Gallery')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('contact')} className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#1DB954] shrink-0" /> {t('যোগাযোগ', 'Contact')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Sub-Column 2: Top Courses & Escrow Guarantee */}
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4 font-heading border-l-4 border-[#1DB954] pl-2.5">
                {t('জনপ্রিয় কোর্সসমূহ', 'Popular Courses')}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm font-bengali">
                {courses.slice(0, 5).map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="hover:text-[#1DB954] transition-colors flex items-center gap-1.5 text-left"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shrink-0" />
                      <span className="line-clamp-1">{c.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Escrow Guarantee Box */}
              <div className="mt-4 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 font-bengali space-y-1">
                <span className="text-[10px] sm:text-[11px] font-black text-[#1DB954] block">
                  🛡️ শতভাগ নিরাপদ লেনদেন
                </span>
                <p className="text-[9px] sm:text-[10px] text-slate-400 leading-tight sm:leading-normal">
                  সকল লেনদেন এবং সার্ভিস ডেলিভারির দায়ভার প্রতিষ্ঠান কর্তৃক সরাসরি পরিচালিত।
                </p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Info & Map */}
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
              <li className="pt-1">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {t('হোয়াটসঅ্যাপে চ্যাট করুন', 'Chat on WhatsApp')}
                </a>
              </li>
            </ul>

            {/* Compact Map Embed */}
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-700/80 shadow-md">
              <div className="bg-slate-800/90 px-2.5 py-1.5 flex items-center justify-between text-[11px] text-slate-200 font-bengali">
                <span className="font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#1DB954]" />
                  গুগল ম্যাপ লোকেশন
                </span>
                <a
                  href="https://maps.google.com/?q=Uttara+Dhaka+Bangladesh"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1DB954] hover:underline font-bold text-[10px]"
                >
                  বড় করে দেখুন ↗
                </a>
              </div>
              <div className="w-full h-28 sm:h-32 bg-slate-950 relative">
                <iframe
                  title="PTENit Footer Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.423087289569!2d90.3956!3d23.8759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUyJzMzLjIiTiA5MMKwMjMnNDQuMiJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Official Payment Methods Logo Showcase */}
        <div className="py-6 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 font-bengali">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="text-[#1DB954] flex items-center gap-1.5 font-black text-xs sm:text-sm">
              💳 {t('অফিশিয়াল পেমেন্ট মেথড ও সিকিউর গেটওয়ে:', 'Official Payment Methods & Secure Gateways:')}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-2.5">
            {((siteSettings.paymentLogos && siteSettings.paymentLogos.length > 0)
              ? siteSettings.paymentLogos.filter(p => p.isActive !== false)
              : [
                  { id: 'pay-bkash', name: 'bKash', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/BKash_logo.png' },
                  { id: 'pay-nagad', name: 'Nagad', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nagad_Logo.png/800px-Nagad_Logo.png' },
                  { id: 'pay-rocket', name: 'Rocket', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Rocket_mobile_banking_logo.svg/640px-Rocket_mobile_banking_logo.svg.png' },
                  { id: 'pay-upay', name: 'Upay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Upay_logo.png/640px-Upay_logo.png' },
                  { id: 'pay-visa', name: 'Visa', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png' },
                  { id: 'pay-mastercard', name: 'MasterCard', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/640px-Mastercard-logo.svg.png' },
                  { id: 'pay-dbbl', name: 'DBBL Nexus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dutch-Bangla_Bank_Logo.svg/640px-Dutch-Bangla_Bank_Logo.svg.png' },
                  { id: 'pay-ibbl', name: 'Islami Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Islami_Bank_Bangladesh_Limited_Logo.svg/640px-Islami_Bank_Bangladesh_Limited_Logo.svg.png' }
                ]
            ).map(item => (
              <div
                key={item.id}
                title={item.name}
                className="bg-white/95 dark:bg-slate-800/90 hover:bg-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-slate-700/80 shadow-xs hover:border-[#1DB954] hover:shadow-md transition-all flex items-center justify-center h-8 sm:h-9 min-w-[50px] sm:min-w-[58px]"
              >
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="max-h-5 sm:max-h-6 max-w-[42px] sm:max-w-[52px] object-contain"
                  onError={(e) => {
                    // Fallback to text badge if external image fails
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const span = document.createElement('span');
                      span.className = 'text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200 px-1';
                      span.innerText = item.name;
                      target.parentElement.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
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
