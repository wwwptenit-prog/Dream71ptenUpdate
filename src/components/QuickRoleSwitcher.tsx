import React, { useState } from 'react';
import { UserCheck, GraduationCap, Briefcase, ShieldAlert, ChevronUp, ChevronDown, Sparkles, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface QuickRoleSwitcherProps {
  setActiveTab: (tab: string) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ setActiveTab }) => {
  const { currentUser, demoLogin } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSwitch = (role: UserRole) => {
    demoLogin(role);
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'instructor') {
      setActiveTab('teacher-dashboard');
    } else if (role === 'customer') {
      setActiveTab('customer-dashboard');
    } else {
      setActiveTab('customer-dashboard');
    }
  };

  const roleConfigs: { role: UserRole; label: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { role: 'admin', label: 'এডমিন প্যানেল', icon: ShieldAlert, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20' },
    { role: 'customer', label: 'গ্রাহক ড্যাশবোর্ড (বায়ার & স্টুডেন্ট)', icon: Briefcase, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20' },
    { role: 'student', label: 'গ্রাহক ড্যাশবোর্ড (স্টুডেন্ট ভিউ)', icon: UserCheck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20' },
    { role: 'instructor', label: 'সেলার / ইন্সট্রাক্টর ড্যাশবোর্ড', icon: GraduationCap, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 font-bengali">
      {isOpen && (
        <div className="mb-3 bg-[#142B4D] border border-slate-700/90 rounded-2xl p-4 shadow-2xl text-white w-72 backdrop-blur-md space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1DB954] animate-pulse" />
              <span className="text-xs font-bold text-slate-200">ড্যাশবোর্ড & এডমিন কুইক এক্সেস</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#1DB954] font-bold">
              Full Access
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            এডমিন ড্যাশবোর্ড বা যেকোনো রোলে ঢুকতে ক্লিক করুন:
          </p>

          <div className="space-y-2">
            {roleConfigs.map(({ role, label, icon: Icon, color }) => {
              const isActive = currentUser?.role === role;
              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${color} ${
                    isActive ? 'ring-2 ring-[#1DB954] shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] bg-[#1DB954] text-white px-2 py-0.5 rounded-full font-black">
                      <Check className="w-3 h-3" /> এক্টিভ
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-[#1DB954] hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
        <span>ড্যাশবোর্ড সুইচ</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};
