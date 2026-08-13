import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Building, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

export const OfficeLocation: React.FC = () => {
  const { siteSettings, sendContactMessage, t } = useData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceOrCourse, setServiceOrCourse] = useState('Web Design & Development');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    sendContactMessage({
      name,
      phone,
      email,
      serviceOrCourse,
      message
    });

    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <section className="py-8 sm:py-12 bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-8 sm:space-y-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-3 sm:gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#1DB954] font-bold text-xs uppercase tracking-widest bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/20">
            {t('যোগাযোগ ও অবস্থান', 'Get in Touch')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-bengali text-slate-900 dark:text-white leading-tight">
            {t('অফিস লোকেশন ও যোগাযোগ', 'Office Location & Contact')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-bengali">
            {t('যেকোনো তথ্য জানতে বা আমাদের অফিসে সরাসরি আসার জন্য ইনকোয়ারি করুন।', 'Inquire or visit our office for any assistance or information.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Contact Form (Self-contained, tight layout with no empty space) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-800/95 p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-700/70 pb-3">
              <h3 className="text-xl sm:text-2xl font-black font-bengali text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-[#1DB954]" />
                {t('ইনকোয়ারি / মেসেজ পাঠান', 'Send an Inquiry / Message')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('ফরমটি পূরণ করুন, আমাদের প্রতিনিধি ২৫ মিনিটের মধ্যে আপনার সাথে কথা বলবেন।', 'Fill up the form, our team will respond within 25 minutes.')}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-emerald-600 dark:text-emerald-400 space-y-3 font-bengali text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-[#1DB954]" />
                <h4 className="font-bold text-lg">{t('ধন্যবাদ! আপনার ইনকোয়ারি গ্রহণ করা হয়েছে।', 'Thank you! Your inquiry has been received.')}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {t('আমাদের প্রতিনিধি অতি শীঘ্রই আপনার প্রদানকৃত মোবাইল নম্বরে যোগাযোগ করবেন।', 'Our representative will call your phone number shortly.')}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-5 py-2.5 bg-[#1DB954] hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {t('অন্য মেসেজ পাঠান', 'Send Another Message')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-bengali">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {t('আপনার নাম *', 'Full Name *')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("উদা: সাব্বির হোসেন", "e.g. Sabbir Hossain")}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      {t('মোবাইল নম্বর *', 'Phone Number *')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="01712345678"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                      {t('ইমেইল', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      placeholder="info@gmail.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {t('সার্ভিস বা কোর্স নির্বাচন করুন', 'Select Service or Course')}
                  </label>
                  <select
                    value={serviceOrCourse}
                    onChange={e => setServiceOrCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option value="Web Design & Development">Web Design & Development</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="SEO">SEO (Search Engine Optimization)</option>
                    <option value="Canva Course">Canva Design Course</option>
                    <option value="YouTube SEO Course">YouTube SEO Course</option>
                    <option value="Facebook Marketing Course">Facebook Marketing Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                    {t('আপনার মেসেজ', 'Your Message')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t("আপনার কি ধরণের সার্ভিস বা ট্রেনিং প্রয়োজন লিখুন...", "Write your inquiry details...")}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#1DB954] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#1DB954] to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('মেসেজ পাঠান', 'Send Inquiry')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Office Address & Modern Google Map */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-[#142B4D] text-white p-6 sm:p-7 rounded-3xl space-y-5 shadow-xl border border-slate-700/80">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1DB954]/20 text-[#1DB954] text-xs font-extrabold rounded-full border border-[#1DB954]/30">
                <Building className="w-4 h-4" />
                <span>Visit Our Main Office</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#1DB954] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm sm:text-base font-bengali">অফিস ঠিকানা:</h4>
                    <p className="text-xs text-slate-300 font-bengali leading-relaxed">{siteSettings.officeAddress}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                    <Phone className="w-4 h-4 text-[#1DB954] shrink-0" />
                    <div>
                      <h4 className="font-bold text-[11px] font-bengali text-slate-300">ফোন নম্বর:</h4>
                      <p className="text-xs text-white font-mono font-bold">{siteSettings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                    <Clock className="w-4 h-4 text-[#1DB954] shrink-0" />
                    <div>
                      <h4 className="font-bold text-[11px] font-bengali text-slate-300">অফিস সময়:</h4>
                      <p className="text-xs text-white font-bengali">সকাল ১০:০০ - রাত ৮:০০</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/80">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp-এ সরাসরি চ্যাট করুন</span>
                </a>
              </div>
            </div>

            {/* Enhanced Modern Google Map Container */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-xl space-y-0">
              {/* Custom Map Top Bar */}
              <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-700 text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-ping" />
                  <MapPin className="w-4 h-4 text-[#1DB954]" />
                  <span>PTENit GPS Map Location</span>
                </div>
                <a
                  href="https://maps.google.com/?q=Uttara+Dhaka+Bangladesh"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-[#1DB954]/20 hover:bg-[#1DB954] text-[#1DB954] hover:text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 border border-[#1DB954]/40"
                >
                  <span>গুগল ম্যাপে বড় করে দেখুন ↗</span>
                </a>
              </div>

              {/* Map Iframe */}
              <div className="w-full h-56 sm:h-64 relative bg-slate-950">
                <iframe
                  title="PTENit Office Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.423087289569!2d90.3956!3d23.8759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDUyJzMzLjIiTiA5MMKwMjMnNDQuMiJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="opacity-95 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
