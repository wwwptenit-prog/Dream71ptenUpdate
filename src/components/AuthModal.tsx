import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, Phone, Eye, EyeOff, Briefcase, Wrench, Zap, KeyRound, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';

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
  const { login, signup } = useData();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login Fields
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState(() => {
    return localStorage.getItem('ptenit_remember_email') || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [selectedRoleType, setSelectedRoleType] = useState<'customer' | 'specialist' | 'both'>('customer');
  
  // Forgot Password Fields
  const [resetEmailOrPhone, setResetEmailOrPhone] = useState('');
  const [resetSupportMsg, setResetSupportMsg] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল বা ফোন নম্বর লিখুন।');
      return;
    }

    if (rememberMe) {
      localStorage.setItem('ptenit_remember_email', loginEmailOrPhone);
    } else {
      localStorage.removeItem('ptenit_remember_email');
    }

    const ok = login(loginEmailOrPhone, loginPassword || '123456');
    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    } else {
      setErrorMsg('লগইন ব্যর্থ হয়েছে! সঠিক ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড দিন।');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!signupPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে মোবাইল নম্বর লিখুন।');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল লিখুন।');
      return;
    }

    let primaryRole: 'customer' | 'instructor' | 'specialist' = 'customer';
    let userRoles: ('customer' | 'specialist' | 'instructor' | 'admin')[] = ['customer'];

    if (selectedRoleType === 'customer') {
      primaryRole = 'customer';
      userRoles = ['customer'];
    } else if (selectedRoleType === 'specialist') {
      primaryRole = 'instructor';
      userRoles = ['specialist', 'instructor'];
    } else if (selectedRoleType === 'both') {
      primaryRole = 'customer';
      userRoles = ['customer', 'specialist', 'instructor'];
    }

    const userData = {
      name: fullName,
      email: signupEmail,
      mobile: signupPhone,
      role: primaryRole as any,
      roles: userRoles,
      activeRole: 'customer' as const,
      isSpecialist: selectedRoleType === 'specialist' || selectedRoleType === 'both',
      specialistStatus: (selectedRoleType === 'specialist' || selectedRoleType === 'both') ? 'pending' : 'not_applied'
    };

    const ok = signup(userData as any, signupPassword || '123456');
    if (ok) {
      setErrorMsg('');
      onSuccess();
      onClose();
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailOrPhone.trim()) {
      setErrorMsg('অনুগ্রহ করে ইমেইল বা মোবাইল নম্বরটি লিখুন।');
      return;
    }
    setErrorMsg('');
    setResetLoading(true);

    setTimeout(() => {
      setResetLoading(false);
      setResetSuccess(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 sm:p-6 relative shadow-2xl space-y-3.5 text-slate-900 dark:text-white my-auto font-bengali">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white transition cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="flex justify-center items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#142B4D] text-[#1DB954] font-black text-xl flex items-center justify-center shadow-md font-heading">
              P
            </div>
            <span className="text-xl font-black font-heading tracking-wider">
              PTEN<span className="text-[#1DB954]">it</span>
            </span>
          </div>
          <p className="text-sm font-black text-slate-900 dark:text-white pt-1">
            {mode === 'login'
              ? 'লগইন করুন'
              : mode === 'signup'
              ? 'নতুন অ্যাকাউন্ট করুন'
              : 'পাসওয়ার্ড রিসেট'}
          </p>

          {mode === 'forgot' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setResetSuccess(false); }}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1DB954] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>লগইন পেজে ফিরে যান</span>
              </button>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-2.5 bg-rose-500/15 border border-rose-500/40 text-rose-500 text-[11px] font-bold rounded-xl leading-relaxed text-center">
            {errorMsg}
          </div>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' ? (
          resetSuccess ? (
            <div className="space-y-3 text-center py-2 bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-[#1DB954] text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#1DB954]">
                  পাসওয়ার্ড রিসেট মেসেজ প্রেরিত!
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  আপনার জিমেইল (<span className="font-bold text-slate-900 dark:text-white">{resetEmailOrPhone}</span>)-এ রিসেট লিঙ্ক পাঠানো হয়েছে।
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setMode('login'); setResetSuccess(false); setErrorMsg(''); }}
                className="w-full py-2 bg-[#1DB954] hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
              >
                লগইন করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3 font-bengali">
              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl text-[11px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                <KeyRound className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  আপনার জিমেইল বা ফোন নম্বর দিন। রিসেট লিংক জিমেইলে চলে যাবে।
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1 text-slate-700 dark:text-slate-300">
                  জিমেইল বা ফোন নম্বর *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="আপনার জিমেইল বা ফোন নম্বর"
                    value={resetEmailOrPhone}
                    onChange={e => setResetEmailOrPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1 text-slate-700 dark:text-slate-300">
                  মেসেজ / সাপোর্ট নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="পাসওয়ার্ড ভুলে যাওয়ার মেসেজ..."
                  value={resetSupportMsg}
                  onChange={e => setResetSupportMsg(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{resetLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট মেইল পাঠান'}</span>
              </button>
            </form>
          )
        ) : mode === 'signup' ? (
          /* SIGNUP FORM */
          <form onSubmit={handleSignup} className="space-y-2.5">
            
            {/* Account Role Choice */}
            <div>
              <label className="block text-[11px] font-bold mb-1 text-slate-700 dark:text-slate-300">
                ভূমিকা বেছে নিন *
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedRoleType('customer')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                    selectedRoleType === 'customer'
                      ? 'bg-[#1DB954] text-white border-[#1DB954] font-black'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Briefcase className="w-3 h-3 shrink-0" />
                  <span>গ্রাহক</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoleType('specialist')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                    selectedRoleType === 'specialist'
                      ? 'bg-[#1DB954] text-white border-[#1DB954] font-black'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Wrench className="w-3 h-3 shrink-0" />
                  <span>স্পেশালিস্ট</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRoleType('both')}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center justify-center gap-1 ${
                    selectedRoleType === 'both'
                      ? 'bg-[#1DB954] text-white border-[#1DB954] font-black'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>দুইটাই</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold mb-0.5 text-slate-700 dark:text-slate-300">
                পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                placeholder="আপনার নাম"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
              />
            </div>

            {/* Mobile / Phone */}
            <div>
              <label className="block text-[11px] font-bold mb-0.5 text-slate-700 dark:text-slate-300">
                মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={signupPhone}
                  onChange={e => setSignupPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold mb-0.5 text-slate-700 dark:text-slate-300">
                ইমেইল অ্যাড্রেস *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold mb-0.5 text-slate-700 dark:text-slate-300">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type={showSignupPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                >
                  {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 mt-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>সাইনআপ করুন</span>
            </button>

            {/* Switch to Login */}
            <div className="text-center pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              আপনার কি অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className="font-bold text-[#1DB954] hover:underline cursor-pointer"
              >
                লগইন করুন
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold mb-1 text-slate-700 dark:text-slate-300">
                ইমেইল অথবা মোবাইল নম্বর *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="ইমেইল বা মোবাইল নম্বর"
                  value={loginEmailOrPhone}
                  onChange={e => setLoginEmailOrPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1 text-slate-700 dark:text-slate-300">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#1DB954] cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-[#1DB954] focus:ring-[#1DB954] accent-[#1DB954] cursor-pointer"
                />
                <span className="font-medium">পাসওয়ার্ড সেভ রাখুন</span>
              </label>

              <button
                type="button"
                onClick={() => { setMode('forgot'); setErrorMsg(''); setResetSuccess(false); }}
                className="font-bold text-[#1DB954] hover:underline cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1DB954] hover:bg-emerald-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-[#1DB954]/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 tracking-wide mt-1"
            >
              <LogIn className="w-4 h-4 stroke-[2.5]" />
              <span>লগইন করুন</span>
            </button>

            {/* Switch to Signup */}
            <div className="text-center pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              আপনার কি অ্যাকাউন্ট করা নেই?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); }}
                className="font-bold text-[#1DB954] hover:underline cursor-pointer"
              >
                সাইনআপ করুন
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
