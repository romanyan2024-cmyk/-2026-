import React, { useState } from 'react';
import { Plus, Users, UserCheck, Baby, Search, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onOpenAddModal: (type?: 'teacher' | 'supervisor' | 'child') => void;
  onOpenSearch: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onOpenAddModal,
  onOpenSearch
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col items-start gap-2.5 select-none no-print">
      {/* Speed Dial Menu Items */}
      {isOpen && (
        <div className="flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* 1. Add Teacher */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAddModal('teacher');
            }}
            className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border border-indigo-500/40"
          >
            <div className="w-6 h-6 rounded-lg bg-indigo-800 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span>إضافة خادم / معلم</span>
          </button>

          {/* 2. Add Supervisor */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAddModal('supervisor');
            }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border border-amber-400/40"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-700 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span>إضافة مشرف جديد</span>
          </button>

          {/* 3. Add Child */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenAddModal('child');
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border border-emerald-400/40"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center">
              <Baby className="w-3.5 h-3.5" />
            </div>
            <span>تسجيل طفل / مخدوم</span>
          </button>

          {/* 4. Quick Search */}
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenSearch();
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border border-slate-700"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span>بحث في أي فئة</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="إجراءات الإدخال السريع"
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen
            ? 'bg-slate-800 text-rose-400 rotate-90 ring-4 ring-slate-700/50'
            : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 hover:from-indigo-500 hover:to-blue-400 ring-4 ring-indigo-400/30 shadow-indigo-600/40'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-7 h-7 stroke-[2.5]" />}
      </button>
    </div>
  );
};
