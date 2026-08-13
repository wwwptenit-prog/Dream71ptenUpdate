import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Download, ShieldCheck, Printer, Award } from 'lucide-react';
import { useData } from '../context/DataContext';

interface CertificateModalProps {
  certificateCode: string | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificateCode,
  onClose
}) => {
  const { getCertificateByCode } = useData();

  useEffect(() => {
    if (certificateCode) {
      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [certificateCode]);

  if (!certificateCode) return null;
  const cert = getCertificateByCode(certificateCode);

  if (!cert) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-slate-900 text-white p-8 rounded-3xl max-w-md w-full text-center space-y-4 font-bengali">
          <X className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold">সার্টিফিকেট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-400">
            প্রদত্ত আইডি অনুযায়ী কোনো বৈধ সার্টিফিকেট পাওয়া যায়নি।
          </p>
          <button onClick={onClose} className="px-6 py-2 bg-[#1DB954] text-white font-bold rounded-xl">
            বন্ধ করুন
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
      
      <div className="bg-white rounded-3xl max-w-3xl w-full p-2 relative shadow-2xl my-auto print:shadow-none print:m-0 print:p-0">
        
        {/* Top Floating Controls */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#1DB954]" />
            <span className="font-bold font-heading text-slate-800 text-sm">
              PTENit Official Certificate
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-[#1DB954] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              প্রিন্ট / ডাউনলোড PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CARD */}
        <div className="p-8 sm:p-12 border-8 border-double border-[#142B4D] rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/40 relative text-slate-900 text-center space-y-6">
          
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none font-black text-9xl text-[#142B4D] font-heading select-none">
            PTENit
          </div>

          {/* Certificate Header */}
          <div className="space-y-2">
            <div className="flex justify-center items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#142B4D] text-[#1DB954] flex items-center justify-center font-black text-2xl font-heading shadow-md">
                P
              </div>
              <span className="text-3xl font-black font-heading tracking-widest text-[#142B4D]">
                PTEN<span className="text-[#1DB954]">it</span>
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500 font-sans">
              Professional IT, Digital Marketing & Training Academy
            </p>
          </div>

          <div className="py-2">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#142B4D] uppercase tracking-wider">
              Certificate of Completion
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#1DB954] to-transparent mx-auto mt-2" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-serif italic">
            This is proudly presented to
          </p>

          <div className="py-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#142B4D] font-bengali underline decoration-[#1DB954] underline-offset-8">
              {cert.studentName}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-bengali leading-relaxed">
            কোর্সের সকল থিওরিটিক্যাল ও প্র্যাকটিক্যাল প্রজেক্ট মডিউল সফলভাবে সম্পন্ন করায়
            <span className="font-bold text-slate-900 font-sans block text-base mt-1 text-[#142B4D]">
              "{cert.courseName}"
            </span>
            এর অনুকূলে এই প্রফেশনাল সনদপত্র প্রদান করা হলো।
          </p>

          {/* Bottom Verification & Signatures */}
          <div className="pt-8 grid grid-cols-3 items-end text-left border-t border-slate-300 gap-4">
            
            {/* Left QR Code */}
            <div className="space-y-1">
              <img
                src={cert.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${cert.certificateCode}`}
                alt="Verification QR"
                className="w-16 h-16 border border-slate-300 p-1 rounded-lg"
              />
              <span className="text-[10px] font-mono text-slate-500 block font-bold">
                ID: {cert.certificateCode}
              </span>
              <span className="text-[9px] text-[#1DB954] font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            {/* Middle Seal */}
            <div className="text-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-[10px] flex items-center justify-center mx-auto shadow-lg border-2 border-white uppercase tracking-tighter">
                Official Seal
              </div>
              <span className="text-[10px] font-bold text-slate-600 block">
                ইস্যু তারিখ: {cert.issueDate}
              </span>
            </div>

            {/* Right Signature */}
            <div className="text-right space-y-1">
              <div className="font-serif italic text-lg font-bold text-[#142B4D]">
                {cert.instructorName}
              </div>
              <div className="w-32 h-0.5 bg-slate-400 ml-auto" />
              <span className="text-[10px] font-bold text-slate-600 block font-bengali">
                অনুমোদিত ট্রেইনার ও একাডেমিক হেড
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
