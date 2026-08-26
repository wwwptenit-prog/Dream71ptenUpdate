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

        {/* Main Grid: 2 Columns on PC (Form Left, Office Info & Map Right), Single Form on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Inquiry / Contact Form (Visible on all screens) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-800/95 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl space-y-5">
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

          {/* Right Column: Office Address & Google Map (Visible on PC / lg screens) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-5 bg-white dark:bg-slate-800/95 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-xl">
            <div className="border-b border-slate-100 dark:border-slate-700/70 pb-3">
              <span className="text-[10px] font-bold text-[#1DB954] uppercase tracking-wider block">
                {t('অফিস ঠিকানা', 'Office Address')}
              </span>
              <h3 className="text-xl font-black font-bengali text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                <Building className="w-5 h-5 text-[#1DB954]" />
                {t('আমাদের প্রধান কার্যালয়', 'Visit Our Main Office')}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-bengali text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1DB954] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block font-bold">ঠিকানা:</strong>
                  <span>{siteSettings.officeAddress || 'হাউজ #১২, রোড #০৫, ব্লক-সি, বনানী, ঢাকা-১২১৩, বাংলাদেশ'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#1DB954] shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white inline-block font-bold mr-1">ফোন:</strong>
                  <span>{siteSettings.phone || '+880 1700-000000'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#1DB954] shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white inline-block font-bold mr-1">ইমেইল:</strong>
                  <span>{siteSettings.email || 'support@ptenit.com'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#1DB954] shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white inline-block font-bold mr-1">অফিস সময়:</strong>
                  <span>{siteSettings.officeHours || 'সকাল ১০:০০ - রাত ০৮:০০ (শনিবার - বৃহস্পতিবার)'}</span>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Map for PC */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-52 sm:h-60 mt-auto shadow-inner">
              <iframe
                title="PTENit Office Map PC"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.085442751509!2d90.4028053!3d23.7911762!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c2e39e24b%3A0xb214739eb38c92a2!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
