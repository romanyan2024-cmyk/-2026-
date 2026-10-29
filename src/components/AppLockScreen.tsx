import React, { useState } from 'react';
import { Lock, ShieldCheck, Crown, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppLockScreenProps {
  adminPin: string;
  onUnlock: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ adminPin, onUnlock }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 8) {
      const next = pinInput + num;
      setPinInput(next);
      setErrorMsg('');

      if (next === adminPin) {
        try { confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } }); } catch {}
        onUnlock();
      }
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === adminPin) {
      try { confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } }); } catch {}
      onUnlock();
    } else {
      setErrorMsg('كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى');
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white select-none overflow-y-auto">
      {/* Background glowing orbs */}
      <div className="absolute top-12 left-12 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-sm w-full bg-slate-900/90 rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-700/50 backdrop-blur-md relative z-10 text-center">
        {/* App Logo & Crown */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 border border-amber-300/40">
          <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
          تطبيق إدارة صناع القادة
        </h1>

        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-black bg-amber-950/60 py-1 px-3 rounded-full border border-amber-400/40 w-fit mx-auto mb-4 shadow-xs">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>إشراف: Romany Adly</span>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          يرجى إدخال كلمة مرور الأدمن العام للدخول للتطبيق
        </p>

        {/* Masked Password Display Box */}
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="relative max-w-xs mx-auto">
            <input
              type={showPassword ? 'text' : 'password'}
              readOnly
              value={pinInput}
              placeholder="••••"
              className="w-full bg-slate-950/90 border-2 border-indigo-600/70 text-center text-2xl font-black tracking-widest text-amber-300 rounded-2xl py-3 px-10 shadow-inner focus:outline-hidden focus:border-amber-400"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3.5 top-3.5 text-slate-400 hover:text-white transition"
              title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5 text-amber-400" />}
            </button>
          </div>
        </form>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-900/60 border border-rose-500/80 text-rose-200 text-xs rounded-xl flex items-center justify-center gap-1.5 animate-bounce">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Android Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 max-w-xs mx-auto" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleKeyPress(n)}
              className="h-13 rounded-2xl bg-slate-800/90 hover:bg-indigo-700/60 active:bg-indigo-600 text-white font-black text-xl border border-slate-700/80 transition-all active:scale-95 flex items-center justify-center shadow-xs"
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
            className="h-13 rounded-2xl bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-700 text-slate-400 hover:text-amber-300 text-xs font-bold border border-slate-700/70 transition-all active:scale-95 flex items-center justify-center"
            title="مسح الخانات"
          >
            <span>مسح C</span>
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-13 rounded-2xl bg-slate-800/90 hover:bg-indigo-700/60 active:bg-indigo-600 text-white font-black text-xl border border-slate-700/80 transition-all active:scale-95 flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-13 rounded-2xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs border border-slate-700 transition-all active:scale-95 flex items-center justify-center"
          >
            مسح ⌫
          </button>
        </div>

        {/* Direct Unlock Action */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition active:scale-98 flex items-center justify-center gap-2"
        >
          <span>فتح لوحة التطبيق</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
