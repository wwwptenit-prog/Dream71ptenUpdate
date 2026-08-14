import React, { useState } from 'react';
import { Briefcase, ShieldAlert, ChevronUp, ChevronDown, Sparkles, Check, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';

interface QuickRoleSwitcherProps {
  activeTab?: string;
  setActiveTab: (tab: string) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, demoLogin } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSwitch = (role: UserRole, targetTab: string) => {
    demoLogin(role);
    setActiveTab(targetTab);
  };

  const roleConfigs: {
    role: UserRole;
    targetTab: string;
    label: string;
    subtitle: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    activeBorder: string;
  }[] = [
    {
      role: 'admin',
      targetTab: 'admin',
      label: 'এডমিন প্যানেল',
      subtitle: 'প্ল্যাটফর্ম ও সিস্টেম কন্ট্রোল',
      icon: ShieldAlert,
      color: 'text-amber-300 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20',
      activeBorder: 'border-amber-400 ring-2 ring-amber-400/50 bg-amber-500/20'
    },
    {
      role: 'customer',
      targetTab: 'customer-dashboard',
      label: 'গ্রাহক ড্যাশবোর্ড',
      subtitle: 'ক্লায়েন্ট ও বায়ার পোর্টাল',
      icon: Briefcase,
      color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20',
      activeBorder: 'border-[#1DB954] ring-2 ring-[#1DB954]/50 bg-emerald-500/20'
    },
    {
      role: 'instructor',
      targetTab: 'teacher-dashboard',
      label: 'স্পেশালিস্ট ড্যাশবোর্ড',
      subtitle: 'এক্সপার্ট ও ট্রেইনার পোর্টাল',
      icon: Zap,
      color: 'text-teal-300 bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20',
      activeBorder: 'border-teal-400 ring-2 ring-teal-400/50 bg-teal-500/20'
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50 font-bengali">
      {isOpen && (
        <div className="mb-3 bg-[#142B4D] border border-slate-700/90 rounded-2xl p-4 shadow-2xl text-white w-72 backdrop-blur-md space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1DB954] animate-pulse" />
              <span className="text-xs font-bold text-slate-200">ড্যাশবোর্ড সুইচ</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#1DB954] font-bold">
              Full Access
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            যেকোনো ড্যাশবোর্ডে প্রবেশ করতে ক্লিক করুন:
          </p>

          <div className="space-y-2">
            {roleConfigs.map(({ role, targetTab, label, subtitle, icon: Icon, color, activeBorder }) => {
              const isCurrentTab = activeTab === targetTab;
              const isCurrentRole = currentUser?.role === role;
              const isActive = isCurrentTab || (isCurrentRole && !['admin', 'customer-dashboard', 'teacher-dashboard'].includes(activeTab || ''));

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role, targetTab)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive ? activeBorder : color
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="p-1.5 rounded-lg bg-black/20 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-xs leading-tight">{label}</div>
                      <div className="text-[10px] text-slate-300 font-normal leading-tight mt-0.5">{subtitle}</div>
                    </div>
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] bg-[#1DB954] text-slate-950 px-2 py-0.5 rounded-full font-black shadow-sm shrink-0">
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
