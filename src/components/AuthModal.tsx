import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert, LogIn, UserPlus, Lock, Mail, GraduationCap, Briefcase, UserCog, Eye, EyeOff, PhoneCall, HelpCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { login, signup, loginMarketplace, signupMarketplace } = useData();

  const [platformTarget, setPlatformTarget] = useState<'ptenit' | 'marketplace'>('ptenit');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone) {
      setErrorMsg('অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল বা মোবাইল নম্বর লিখুন।');
      return;
    }
    const ok = platformTarget === 'marketplace' 
      ? loginMarketplace(loginEmailOrPhone, loginPassword)
      : login(loginEmailOrPhone, loginPassword);

    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('লগইন ব্যর্থ হয়েছে! সঠিক ইমেইল/মোবাইল ও পাসওয়ার্ড দিন।');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      setErrorMsg('পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না।');
      return;
    }
    const userData = {
      name: fullName,
      email: signupEmail,
      mobile: signupMobile,
      role: selectedRole
    };
    const ok = platformTarget === 'marketplace'
      ? signupMarketplace(userData, signupPassword)
      : signup(userData, signupPassword);

    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl space-y-5 text-slate-900 dark:text-white my-auto max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header & Platform Selector */}
        <div className="text-center space-y-3">
          <div className="flex justify-center items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#142B4D] text-[#1DB954] font-bold text-xl flex items-center justify-center font-heading">
              P
            </div>
            <span className="text-2xl font-black font-heading tracking-wider">
              PTEN<span className="text-[#1DB954]">it</span>
            </span>
          </div>

          {/* Platform Account Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl font-bengali text-xs font-bold grid grid-cols-2 gap-1 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setPlatformTarget('ptenit'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                platformTarget === 'ptenit'
                  ? 'bg-[#142B4D] text-white font-extrabold shadow-md border border-slate-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🎓 PTENit একাডেমি</span>
            </button>

            <button
              type="button"
              onClick={() => { setPlatformTarget('marketplace'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                platformTarget === 'marketplace'
                  ? 'bg-[#1DB954] text-slate-950 font-black shadow-md border border-[#1DB954]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🛒 মার্কেটপ্লেস</span>
            </button>
          </div>

          {/* Login / Signup Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl font-bengali text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login' ? 'bg-[#1DB954] text-slate-950 font-black shadow-md' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              লগইন (Login)
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-[#1DB954] text-slate-950 font-black shadow-md' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              সাইনআপ (Signup)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/50 text-rose-500 text-xs font-bold rounded-xl font-bengali leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 font-bengali">
            <div>
              <label className="block text-xs font-bold mb-1">
                ইমেইল অথবা মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="student@ptenit.com / teacher@ptenit.com / 01812345678"
                  value={loginEmailOrPhone}
                  onChange={e => setLoginEmailOrPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                  title={showLoginPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded accent-[#1DB954]"
                />
                <span>মনে রাখুন (Remember me)</span>
              </label>
              <button
                type="button"
                onClick={() => alert("পাসওয়ার্ড রিসেটের জন্য সরাসরি আমাদের সাপোর্ট বা এডমিনের সাথে যোগাযোগ করুন: info@ptenit.com")}
                className="text-[#1DB954] font-bold hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              লগইন করুন
            </button>

            {/* Account Role Guidance & Helpline Support */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2.5">
              <div className="flex items-start gap-2.5 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <HelpCircle className="w-4.5 h-4.5 text-[#1DB954] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">ডেমো লগইন ইমেইল (বায়ার & সেলার ড্যাশবোর্ড):</p>
                  <div className="text-[11px] grid grid-cols-2 gap-1 text-slate-600 dark:text-slate-300 font-mono">
                    <span>💼 customer@ptenit.com (বায়ার)</span>
                    <span>🛠️ teacher@ptenit.com (সেলার)</span>
                    <span>🎓 student@ptenit.com (স্টুডেন্ট)</span>
                    <span>🛡️ admin@ptenit.com (এডমিন)</span>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/8801812345678"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                সরাসরি হেল্পলাইন ও হোয়াটসঅ্যাপ সাপোর্ট
              </a>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup} className="space-y-3 font-bengali">
            {/* Role selection dropdown/tabs */}
            <div>
              <label className="block text-xs font-bold mb-1">আপনি কি হিসেবে অ্যাকাউন্ট তৈরি করতে চান? *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('customer')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'customer'
                      ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  বায়ার (Buyer)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('instructor')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'instructor'
                      ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  সেলার / ট্রেইনার
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'student'
                      ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  স্টুডেন্ট
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#1DB954] text-slate-950 border-[#1DB954] font-black'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <UserCog className="w-4 h-4" />
                  এডমিন
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">পূর্ণ নাম (Full Name) *</label>
              <input
                type="text"
                required
                placeholder="সাব্বির রহমান"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:border-[#1DB954]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold mb-1">ইমেইল *</label>
                <input
                  type="email"
                  required
                  placeholder="your@gmail.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#1DB954]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">মোবাইল নম্বর *</label>
                <input
                  type="text"
                  required
                  placeholder="01812345678"
                  value={signupMobile}
                  onChange={e => setSignupMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold mb-1">পাসওয়ার্ড *</label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                    title={showSignupPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">কনফার্ম পাসওয়ার্ড *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:border-[#1DB954]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                    title={showConfirmPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              সাইনআপ একাউন্ট খুলুন
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

