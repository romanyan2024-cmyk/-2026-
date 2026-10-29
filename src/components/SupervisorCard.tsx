import React from 'react';
import { UserCheck, MapPin, ChevronLeft, Plus, Edit3, Trash2, Crown } from 'lucide-react';
import { SupervisorRecord, TeacherRecord } from '../types';

interface SupervisorCardProps {
  supervisor: SupervisorRecord;
  teachersUnderSup: TeacherRecord[];
  onFilterBySupervisor: (name: string) => void;
  onAddTeacherToSupervisor: (supName: string) => void;
  onEdit: (supervisor: SupervisorRecord) => void;
  onDelete?: (id: string) => void;
}

export const SupervisorCard: React.FC<SupervisorCardProps> = ({
  supervisor,
  teachersUnderSup,
  onFilterBySupervisor,
  onAddTeacherToSupervisor,
  onEdit,
  onDelete
}) => {
  const teachersCount = teachersUnderSup.length;
  const totalChildren = teachersUnderSup.reduce((acc, t) => acc + (t.totalChildren || 0), 0);
  const totalBoys = teachersUnderSup.reduce((acc, t) => acc + (t.boysCount || 0), 0);
  const totalGirls = teachersUnderSup.reduce((acc, t) => acc + (t.girlsCount || 0), 0);

  const areaLeader = supervisor.areaLeader || (teachersUnderSup.find(t => t.areaLeader)?.areaLeader) || 'Romany Adly';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{supervisor.name}</h3>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                مشرف عام
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Supervisor Button */}
            <button
              onClick={() => onEdit(supervisor)}
              className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition p-1.5 rounded-xl border border-transparent hover:border-amber-200"
              title="تعديل بيانات المشرف وقائد المنطقة"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف المشرف "${supervisor.name}"؟`)) {
                    onDelete(supervisor.id);
                  }
                }}
                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition p-1.5 rounded-xl border border-transparent hover:border-rose-200"
                title="حذف المشرف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Supervisor Area Leader Banner */}
        <div className="mb-3 flex items-center justify-between bg-gradient-to-r from-amber-50 via-amber-100/50 to-indigo-50/50 p-2.5 rounded-2xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-amber-900 font-bold block leading-none mb-0.5">قائد المنطقة المسؤول:</span>
              <strong className="text-slate-900 font-black text-xs block">{areaLeader}</strong>
            </div>
          </div>

          <button
            onClick={() => onEdit(supervisor)}
            className="text-[11px] bg-white hover:bg-amber-50 text-amber-900 font-black px-2.5 py-1 rounded-xl border border-amber-300 transition-all shadow-xs flex items-center gap-1 active:scale-95"
            title={`تعديل قائد المنطقة للمشرف ${supervisor.name}`}
          >
            <Edit3 className="w-3 h-3 text-amber-700" />
            <span>تعديل القائد</span>
          </button>
        </div>

        {/* Assigned Regions */}
        <div className="mb-3">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">المناطق المشرف عليها:</span>
          <div className="flex flex-wrap gap-1">
            {supervisor.regions.map((reg, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {reg}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 mb-3 text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">الخدام المشرف عليهم:</span>
            <span className="font-extrabold text-slate-900 text-sm">{teachersCount} خادم/معلم</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">إجمالي الأطفال:</span>
            <span className="font-extrabold text-indigo-700 text-sm">{totalChildren} طفل</span>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200/60 flex justify-between text-[11px] text-slate-600">
            <span className="text-blue-700 font-bold">أولاد: {totalBoys}</span>
            <span className="text-rose-700 font-bold">بنات: {totalGirls}</span>
          </div>
        </div>

        {/* Notes */}
        {supervisor.notes && (
          <p className="text-[11px] text-slate-500 italic mb-3">
            {supervisor.notes}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onFilterBySupervisor(supervisor.name)}
          className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
        >
          <span>عرض فصوله ({teachersCount})</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onAddTeacherToSupervisor(supervisor.name)}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          title="إضافة خادم تحت إشرافه"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
