import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Download, 
  Printer, 
  KeyRound, 
  RotateCcw, 
  Users, 
  UserCheck, 
  Baby, 
  School, 
  MapPin, 
  Cross, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  Crown
} from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import { calculateStats, exportTeachersToCSV, setAdminPin, resetAllDataToDefault } from '../utils/storage';
import confetti from 'canvas-confetti';

interface AdminStatsModalProps {
  isAdminUnlocked: boolean;
  setIsAdminUnlocked: (val: boolean) => void;
  adminPin: string;
  setAdminPinState: (pin: string) => void;
  teachers: TeacherRecord[];
  supervisors: SupervisorRecord[];
  children: ChildRecord[];
  onDataReset: () => void;
  onClose?: () => void;
}

export const AdminStatsModal: React.FC<AdminStatsModalProps> = ({
  isAdminUnlocked,
  setIsAdminUnlocked,
  adminPin,
  setAdminPinState,
  teachers,
  supervisors,
  children,
  onDataReset,
  onClose
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState('');
  const [activeCategoryView, setActiveCategoryView] = useState<'all' | 'regions' | 'supervisors' | 'denominations' | 'levels' | 'villages'>('all');

  const stats = calculateStats(teachers, supervisors, children);

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 6) {
      const next = pinInput + num;
      setPinInput(next);
      setErrorMsg('');

      if (next === adminPin) {
        setIsAdminUnlocked(true);
        setPinInput('');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
      }
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      alert('يجب أن تتكون كلمة المرور من 4 خانات على الأقل');
      return;
    }
    const ok = setAdminPin(newPinInput.trim());
    if (ok) {
      setAdminPinState(newPinInput.trim());
      setPinSuccessMsg('تم تغيير كلمة مرور الأدمن بنجاح!');
      setNewPinInput('');
      setTimeout(() => setPinSuccessMsg(''), 4000);
      setShowPinChange(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If locked, render the Android Security Lock Screen
  if (!isAdminUnlocked) {
    return (
      <div className="p-4 sm:p-6 max-w-md mx-auto my-4 text-center">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>

          <h2 className="text-xl font-black text-slate-800 mb-1">شاشة الأدمن العام</h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-50 py-1 px-3 rounded-full border border-amber-200 w-fit mx-auto mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>صناع القادة | Romany Adly</span>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            لوحة الإحصائيات الشاملة محمية برمز مرور الأدمن العام
          </p>

          {/* PIN Indicator dots */}
          <div className="flex items-center justify-center gap-3 mb-6" dir="ltr">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pinInput.length > idx
                    ? 'bg-indigo-600 scale-125 shadow-md shadow-indigo-600/40 ring-4 ring-indigo-100'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-center gap-1.5 animate-bounce">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Android Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-4 max-w-xs mx-auto" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleKeyPress(n)}
                className="h-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 text-slate-800 hover:text-indigo-700 font-bold text-xl border border-slate-200/80 transition-all active:scale-95 flex items-center justify-center shadow-xs"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPinInput('');
                setErrorMsg('');
              }}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-500 hover:text-amber-700 text-xs font-bold border border-slate-200 transition-all active:scale-95 flex items-center justify-center"
              title="مسح الخانات"
            >
              <span>مسح C</span>
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 active:bg-indigo-100 text-slate-800 font-bold text-xl border border-slate-200/80 transition-all active:scale-95 flex items-center justify-center shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs border border-slate-200 transition-all active:scale-95 flex items-center justify-center"
            >
              مسح ⌫
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center text-xs text-slate-500">
            <span className="text-slate-400">لوحة الإدارة والتحكم الشاملة</span>
          </div>
        </div>
      </div>
    );
  }

  // Admin is Unlocked -> Render the Complete Statistics Dashboard
  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner and Quick Controls */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-indigo-900/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">لوحة إحصائيات الأدمن العام</h2>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  مصرح (رمز: {adminPin})
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  صناع القادة • إشراف Romany Adly
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1">
                تقرير رقمي تفصيلي ومباشر لكافة الفصول والخدام والمشرفين والأطفال
              </p>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={() => exportTeachersToCSV(teachers)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-md shadow-emerald-900/30 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير Excel/CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl transition border border-slate-700 active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>طباعة تقرير رسمي</span>
            </button>

            <button
              onClick={() => setShowPinChange(!showPinChange)}
              className="flex items-center gap-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 text-xs font-bold px-3 py-2 rounded-xl transition border border-indigo-700/60 active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>تغيير الرمز</span>
            </button>

            <button
              onClick={() => setIsAdminUnlocked(false)}
              className="flex items-center gap-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>قفل الشاشة</span>
            </button>
          </div>
        </div>

        {/* Change PIN Box */}
        {showPinChange && (
          <form onSubmit={handleChangePin} className="mt-4 p-4 bg-slate-900/95 rounded-2xl border border-indigo-700/50 flex flex-wrap items-center gap-3 no-print">
            <span className="text-xs text-indigo-200 font-bold">كلمة مرور الأدمن الجديدة (حالياً {adminPin}):</span>
            <input
              type="text"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="مثلاً: 9990"
              className="bg-slate-950 border border-slate-700 text-white px-3 py-1.5 rounded-xl text-xs w-36 text-center tracking-widest font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition"
            >
              حفظ الرمز الجديد
            </button>
            <button
              type="button"
              onClick={() => setShowPinChange(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </form>
        )}

        {pinSuccessMsg && (
          <div className="mt-3 p-2 bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-xs rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{pinSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* 4 Grand Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Children */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">إجمالي الأطفال المخدومين</span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Baby className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {(stats.totalBoys + stats.totalGirls).toLocaleString('ar-EG')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">طفل مسجل</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>متوسط الفصل:</span>
            <span className="font-bold text-indigo-600">
              {stats.avgClassSize} طفل/خادم
            </span>
          </div>
        </div>

        {/* Card 2: Total Teachers */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">إجمالي الخدام والمعلمين</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalTeachers.toLocaleString('ar-EG')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">خادم/معلم</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>الفصول المدارة:</span>
            <span className="font-bold text-emerald-600">{stats.totalClassesSum} فصول</span>
          </div>
        </div>

        {/* Card 3: Total Supervisors */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">إجمالي المشرفين المعتمدين</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalSupervisors.toLocaleString('ar-EG')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">مشرف مسؤول</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>معدل الإشراف:</span>
            <span className="font-bold text-amber-600">
              {stats.totalSupervisors > 0 ? Math.round(stats.totalTeachers / stats.totalSupervisors) : 0} خادم/مشرف
            </span>
          </div>
        </div>

        {/* Card 4: Regions & Villages */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md relative overflow-hidden group hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">المناطق والقرى</span>
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.regions.length.toLocaleString('ar-EG')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">مناطق رئيسية</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>القرى المسجلة:</span>
            <span className="font-bold text-cyan-700">{stats.topVillages.length}+ قرى نشطة</span>
          </div>
        </div>
      </div>

      {/* Boys & Girls Visual Split */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
        <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
          <Baby className="w-5 h-5 text-indigo-600" />
          <span>توزيع الأطفال حسب النوع (أولاد وبنات)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Boys Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-blue-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                إجمالي عدد الأولاد
              </span>
              <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {stats.boysPercentage}%
              </span>
            </div>
            <div className="text-2xl font-black text-blue-950">
              {stats.totalBoys.toLocaleString('ar-EG')} <span className="text-xs font-normal text-blue-700">ولد</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 mt-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${stats.boysPercentage}%` }}
              />
            </div>
          </div>

          {/* Girls Card */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50/50 rounded-2xl p-4 border border-rose-200/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                إجمالي عدد البنات
              </span>
              <span className="text-xs font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                {stats.girlsPercentage}%
              </span>
            </div>
            <div className="text-2xl font-black text-rose-950">
              {stats.totalGirls.toLocaleString('ar-EG')} <span className="text-xs font-normal text-rose-700">بنت</span>
            </div>
            <div className="w-full bg-rose-200 rounded-full h-3 mt-3 overflow-hidden">
              <div 
                className="bg-rose-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${stats.girlsPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Combined Ratio Bar */}
        <div className="bg-slate-100 rounded-2xl p-3 border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span className="text-blue-700">الأولاد: {stats.totalBoys} ({stats.boysPercentage}%)</span>
            <span className="text-slate-800">إجمالي المخدومين: {stats.totalBoys + stats.totalGirls} طفل</span>
            <span className="text-rose-700">البنات: {stats.totalGirls} ({stats.girlsPercentage}%)</span>
          </div>
          <div className="w-full h-4 rounded-xl flex overflow-hidden ring-1 ring-slate-300">
            <div style={{ width: `${stats.boysPercentage}%` }} className="bg-blue-600 h-full" title={`أولاد: ${stats.totalBoys}`} />
            <div style={{ width: `${stats.girlsPercentage}%` }} className="bg-rose-500 h-full" title={`بنات: ${stats.totalGirls}`} />
          </div>
        </div>
      </div>

      {/* Category View Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 no-print">
        {[
          { id: 'all', label: 'كافة التصنيفات' },
          { id: 'regions', label: 'إحصائيات المناطق' },
          { id: 'supervisors', label: 'إحصائيات المشرفين الـ 14' },
          { id: 'denominations', label: 'إحصائيات الطوائف' },
          { id: 'levels', label: 'إحصائيات المستويات' },
          { id: 'villages', label: 'أعلى القرى كثافة' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveCategoryView(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategoryView === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Denominations Grids */}
      {(activeCategoryView === 'all' || activeCategoryView === 'denominations') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
          <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Cross className="w-5 h-5 text-indigo-600" />
            <span>إحصائيات الطوائف المسيحية في قاعدة البيانات</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.denominations.map((denom, i) => (
              <div key={i} className="rounded-2xl p-4 border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-900">{denom.name}</span>
                    <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                      {denom.percentage}%
                    </span>
                  </div>

                  <div className="text-xl font-black text-slate-800 mb-1">
                    {denom.totalChildren.toLocaleString('ar-EG')} <span className="text-xs font-medium text-slate-500">طفل</span>
                  </div>

                  <div className="text-xs text-slate-600 mb-3 font-medium">
                    يشمل {denom.teachersCount} معلماً/خادماً
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <div className="flex justify-between font-bold">
                    <span className="text-blue-700">أولاد: {denom.boys}</span>
                    <span className="text-rose-700">بنات: {denom.girls}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                    <div 
                      style={{ width: `${denom.totalChildren > 0 ? (denom.boys / denom.totalChildren) * 100 : 0}%` }} 
                      className="bg-blue-600 h-full"
                    />
                    <div 
                      style={{ width: `${denom.totalChildren > 0 ? (denom.girls / denom.totalChildren) * 100 : 0}%` }} 
                      className="bg-rose-500 h-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Levels Breakdown */}
      {(activeCategoryView === 'all' || activeCategoryView === 'levels') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
          <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-600" />
            <span>إحصائيات المراحل والمستويات التعليمية</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.levels.map((lvl, i) => (
              <div key={i} className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl p-4 border border-indigo-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black text-indigo-950">المستوى: {lvl.level}</span>
                    <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                      {lvl.teachersCount} خادم ({lvl.percentage}%)
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-2">
                    {lvl.totalChildren.toLocaleString('ar-EG')} <span className="text-xs font-normal text-slate-600">طفل مسجل</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-indigo-100/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-lg">الأولاد: {lvl.boys}</span>
                  <span className="text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-lg">البنات: {lvl.girls}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Regions Table & Distribution */}
      {(activeCategoryView === 'all' || activeCategoryView === 'regions') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>إحصائيات تفصيلية لجميع المناطق والمراكز</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
              {stats.regions.length} مناطق مسجلة
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar rounded-2xl border border-slate-200">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">المنطقة</th>
                  <th className="p-3">عدد الخدام</th>
                  <th className="p-3">القرى المشمولة</th>
                  <th className="p-3 text-blue-700">الأولاد</th>
                  <th className="p-3 text-rose-700">البنات</th>
                  <th className="p-3 font-extrabold text-indigo-900">إجمالي الأطفال</th>
                  <th className="p-3 text-slate-500">معدل الفصل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stats.regions.map((reg, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      {reg.region}
                    </td>
                    <td className="p-3 font-semibold text-slate-700">{reg.teachersCount}</td>
                    <td className="p-3 text-slate-600">{reg.villagesCount} قرية</td>
                    <td className="p-3 text-blue-700 font-bold">{reg.boys}</td>
                    <td className="p-3 text-rose-700 font-bold">{reg.girls}</td>
                    <td className="p-3 font-black text-indigo-700">
                      {reg.totalChildren}
                    </td>
                    <td className="p-3 text-slate-600 font-semibold">{reg.avgPerTeacher} طفل</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Supervisors Breakdown */}
      {(activeCategoryView === 'all' || activeCategoryView === 'supervisors') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>إحصائيات المشرفين المسؤولين (14 مشرفاً)</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-full">
              {stats.supervisorsStats.length} مشرف معتمد
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.supervisorsStats.map((sup, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-black text-slate-900">{sup.supervisor}</h4>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {sup.teachersCount} خادم
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    المناطق: <span className="font-semibold text-slate-700">{sup.regions.join('، ')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600">إجمالي الأطفال: <strong className="text-slate-900">{sup.totalChildren}</strong></span>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    <span className="text-blue-700">{sup.boys} 👦</span>
                    <span className="text-rose-700">{sup.girls} 👧</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Top Villages Density */}
      {(activeCategoryView === 'all' || activeCategoryView === 'villages') && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-md">
          <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>أعلى القرى كثافة في عدد الأطفال المخدومين</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {stats.topVillages.map((vil, i) => (
              <div key={i} className="bg-gradient-to-b from-amber-50/50 to-slate-50 p-3.5 rounded-2xl border border-amber-200/70 text-center">
                <span className="text-[10px] font-bold text-amber-700 block mb-0.5">#{i + 1} {vil.region}</span>
                <h5 className="text-xs font-black text-slate-900 truncate mb-1" title={vil.village}>{vil.village}</h5>
                <div className="text-base font-black text-indigo-700">{vil.totalChildren} طفل</div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 mt-1">
                  <span>{vil.teachersCount} خادم</span>
                  <span>•</span>
                  <span className="text-blue-700 font-bold">{vil.boys}ب</span>
                  <span className="text-rose-700 font-bold">{vil.girls}ب</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin Safety & Data Maintenance */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 no-print">
        <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span>إدارة وصيانة قاعدة البيانات (صناع القادة)</span>
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          يمكنك إعادة ضبط قاعدة البيانات إلى حالتها الأصلية الواردة في الشيت المعتمد.
        </p>

        <button
          onClick={() => {
            if (confirm('هل أنت متأكد من إعادة ضبط قاعدة البيانات إلى البيانات الأصلية المعتمدة بالشيت (222 خادم و 5,289 طفل)؟')) {
              resetAllDataToDefault();
              onDataReset();
              alert('تم استرجاع البيانات الأصلية للشيت بنجاح (222 خادم و 5,289 طفل)!');
            }
          }}
          className="bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold px-4 py-2 rounded-xl transition border border-slate-300 active:scale-95 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>استعادة البيانات الأصلية للشيت (222 خادم و 5,289 طفل)</span>
        </button>
      </div>
    </div>
  );
};
