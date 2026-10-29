import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Smartphone, 
  Monitor, 
  Lock, 
  Unlock, 
  Search, 
  Plus, 
  Layers,
  Sparkles,
  Award,
  LogOut,
  Wallet
} from 'lucide-react';
import { ActiveTab } from '../types';

interface AndroidHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminUnlocked: boolean;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
  onOpenAddModal: (type?: 'teacher' | 'supervisor' | 'child') => void;
  isPhoneFrame: boolean;
  setIsPhoneFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  totalTeachers: number;
  totalChildren: number;
  onLockApp?: () => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  activeTab,
  setActiveTab,
  isAdminUnlocked,
  onOpenAdmin,
  onOpenSearch,
  onOpenAddModal,
  isPhoneFrame,
  setIsPhoneFrame,
  totalTeachers,
  totalChildren,
  onLockApp
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white select-none shadow-md border-b border-indigo-900/50">
      {/* Android Top System Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs text-slate-300 border-b border-indigo-900/40">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span>{time || '10:30 ص'}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] text-amber-300 font-bold hidden sm:inline flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            صناع القادة
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] bg-indigo-800/80 px-2 py-0.5 rounded-full text-indigo-200 font-semibold border border-indigo-700/50">
            {totalTeachers} خادم • {totalChildren} مخدوم
          </span>
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1 text-[11px]">
            <span>99%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>
        </div>
      </div>

      {/* Android Main App Bar */}
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40 shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                تطبيق إدارة صناع القادة
                <span className="text-[9px] sm:text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  أندرويد
                </span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-indigo-200 flex items-center gap-1.5 font-medium">
              <span>إشراف:</span>
              <span className="text-amber-300 font-bold bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-400/30">
                Romany Adly
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons in App Bar */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            title="بحث شامل في أي فئة"
            className="flex items-center gap-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold border border-indigo-700/60 transition-all active:scale-95 shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">بحث الفئات</span>
          </button>

          {/* Quick Project Accounts Button */}
          <button
            onClick={() => setActiveTab('accounts')}
            title="شاشة حسابات المشروع والمنصرف والعهدة"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              activeTab === 'accounts'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-indigo-900/80 hover:bg-indigo-800 text-amber-300 border-indigo-700/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">حسابات المشروع</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => onOpenAddModal()}
            title="إدخال جديد (خادم / مشرف / طفل)"
            className="flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">إدخال جديد</span>
          </button>

          {/* Admin Lock / Unlock Button */}
          <button
            onClick={onOpenAdmin}
            title={isAdminUnlocked ? "لوحة الأدمن العام (مفتوحة)" : "لوحة الأدمن العام (محمية بكلمة مرور)"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              isAdminUnlocked 
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-amber-500/10'
                : 'bg-rose-500/20 text-rose-200 border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            {isAdminUnlocked ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">الأدمن مفتوح</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">الأدمن العام</span>
              </>
            )}
          </button>

          {/* Toggle Phone Frame / Fullscreen view */}
          <button
            onClick={() => setIsPhoneFrame(prev => !prev)}
            title={isPhoneFrame ? "تبديل إلى العرض الكامل" : "تبديل إلى مظهر هاتف أندرويد"}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:scale-95 hidden sm:flex items-center justify-center"
          >
            {isPhoneFrame ? (
              <Monitor className="w-3.5 h-3.5" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-indigo-300" />
            )}
          </button>

          {/* Lock App / Logout Button */}
          {onLockApp && (
            <button
              onClick={onLockApp}
              title="قفل التطبيق بكلمة المرور"
              className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-800/60 transition-all active:scale-95 flex items-center justify-center"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
