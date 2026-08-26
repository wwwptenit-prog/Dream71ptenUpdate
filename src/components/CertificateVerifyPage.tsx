import React, { useState } from 'react';
import { Search, ShieldCheck, Award, X, AlertCircle, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CertificateVerifyPageProps {
  onBack?: () => void;
}

export const CertificateVerifyPage: React.FC<CertificateVerifyPageProps> = ({ onBack }) => {
  const { getCertificateByCode, t } = useData();
  const [code, setCode] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    const found = getCertificateByCode(code.trim());
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {onBack && (
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী পেজে ফিরে যান</span>
            </button>
          </div>
        )}

        <div className="text-center space-y-3">
          <span className="px-3 py-1 bg-[#1DB954]/20 text-[#1DB954] text-xs font-bold rounded-full uppercase tracking-wider">
            {t('অফিসিয়াল ভেরিফিকেশন পোর্টাল', 'Official Verification Portal')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white font-bengali">
            {t('PTENit সার্টিফিকেট ভেরিফিকেশন', 'PTENit Certificate Verification')}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-bengali">
            {t('শিক্ষার্থীর সার্টিফিকেট কোড লিখে ভেরিফাই করুন এবং সনদের আসল কপি যাচাই করুন।', 'Enter student certificate code to verify and validate the authentic certificate record.')}
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t("উদাহরণ: CERT-PTEN-2026-0891", "e.g. CERT-PTEN-2026-0891")}
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm font-mono focus:outline-none focus:border-[#1DB954] uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer font-bengali"
            >
              {t('ভেরিফাই করুন', 'Verify Certificate')}
            </button>
          </form>

          {searched && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              {result ? (
                <div className="bg-emerald-500/10 border border-emerald-500/40 p-6 rounded-2xl space-y-3 text-slate-900 dark:text-white font-bengali">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-base">
                    <ShieldCheck className="w-6 h-6" />
                    {t('বৈধ ও সত্যায়িত সার্টিফিকেট', 'Valid & Verified Certificate')}
                  </div>
                  <div className="space-y-1.5 text-sm pt-2">
                    <p><span className="text-slate-500">{t('শিক্ষার্থীর নাম:', 'Student Name:')}</span> <strong>{result.studentName}</strong></p>
                    <p><span className="text-slate-500">{t('কোর্সের নাম:', 'Course Name:')}</span> <strong>{result.courseName}</strong></p>
                    <p><span className="text-slate-500">{t('সার্টিফিকেট ID:', 'Certificate ID:')}</span> <strong className="font-mono">{result.certificateCode}</strong></p>
                    <p><span className="text-slate-500">{t('ইস্যুর তারিখ:', 'Issue Date:')}</span> <strong>{result.issueDate}</strong></p>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/40 p-6 rounded-2xl flex items-center gap-3 text-rose-500 font-bengali text-sm font-bold">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  {t('প্রদত্ত আইডি দিয়ে কোনো বৈধ সনদপত্র পাওয়া যায়নি। আইডি সঠিকভাবে চেক করে পুনরায় চেষ্টা করুন।', 'No valid certificate found with the provided ID. Please check the code and try again.')}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
