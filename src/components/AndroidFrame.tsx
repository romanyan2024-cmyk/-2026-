import React from 'react';

interface AndroidFrameProps {
  isPhoneFrame: boolean;
  children: React.ReactNode;
  onBack?: () => void;
  onHome?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  isPhoneFrame,
  children,
  onBack,
  onHome
}) => {
  if (!isPhoneFrame) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-4 sm:py-8 px-2 flex flex-col items-center justify-center">
      {/* Phone Mockup Wrapper */}
      <div className="w-full max-w-md bg-slate-950 rounded-[48px] p-3 shadow-2xl ring-12 ring-slate-800/80 border-4 border-slate-700/60 relative overflow-hidden flex flex-col h-[92vh] max-h-[880px]">
        
        {/* Android Punch Hole Camera & Speaker */}
        <div className="w-full h-5 flex items-center justify-center relative select-none z-30 shrink-0">
          <div className="w-16 h-1 bg-slate-800 rounded-full mb-1"></div>
          <div className="absolute top-1.5 w-3 h-3 rounded-full bg-slate-900 ring-2 ring-slate-800"></div>
        </div>

        {/* Phone Content Screen */}
        <div className="flex-1 flex flex-col bg-slate-100 rounded-3xl overflow-hidden relative shadow-inner">
          {children}
        </div>

        {/* Android Bottom Software Bar (Back, Home, Recents) */}
        <div className="h-6 w-full flex items-center justify-around text-slate-500 pt-1 select-none shrink-0 no-print">
          {/* Back Triangle */}
          <button 
            type="button" 
            onClick={onBack} 
            className="hover:text-white transition p-1"
            title="رجوع"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>

          {/* Home Circle */}
          <button 
            type="button" 
            onClick={onHome} 
            className="hover:text-white transition p-1"
            title="الرئيسية"
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current"></div>
          </button>

          {/* Recents Square */}
          <button 
            type="button" 
            className="hover:text-white transition p-1"
            title="التطبيقات الحديثة"
          >
            <div className="w-3 h-3 rounded-xs border-2 border-current"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
