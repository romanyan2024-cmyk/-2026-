import React from 'react';
import { 
  Phone, 
  MapPin, 
  Church, 
  User, 
  Trash2,
  Edit3,
  MessageCircle,
  Baby,
  Crown
} from 'lucide-react';
import { TeacherRecord } from '../types';
import { formatCallUrl, formatWhatsAppUrl } from '../utils/formatters';

interface TeacherCardProps {
  teacher: TeacherRecord;
  onDelete: (id: string) => void;
  onEdit: (teacher: TeacherRecord) => void;
  onOpenChildren: (teacher: TeacherRecord) => void;
  onUpdateCounts: (id: string, boysDelta: number, girlsDelta: number) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onDelete,
  onEdit,
  onOpenChildren,
  onUpdateCounts
}) => {
  const getDenomBadgeStyle = (denom: string) => {
    if (denom.includes('الاورثوذكسية')) {
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
    if (denom.includes('الانجيلية')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (denom.includes('الكاثوليك')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  const boysPercent = teacher.totalChildren > 0 ? Math.round((teacher.boysCount / teacher.totalChildren) * 100) : 50;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getDenomBadgeStyle(teacher.denomination)}`}>
              {teacher.denomination}
            </span>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              المستوى: {teacher.level}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {teacher.region}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Teacher Button */}
            <button
              onClick={() => onEdit(teacher)}
              className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition p-1.5 rounded-xl border border-transparent hover:border-amber-200"
              title="تعديل بيانات الخادم"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف الخادم "${teacher.teacherName}"؟`)) {
                  onDelete(teacher.id);
                }
              }}
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition p-1.5 rounded-xl border border-transparent hover:border-rose-200"
              title="حذف الخادم"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Teacher Name */}
        <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-900 transition-colors mb-1.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
          <span>{teacher.teacherName}</span>
        </h3>

        {/* Administrative hierarchy & Church details */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50/80 rounded-2xl p-2.5 border border-slate-100">
          {teacher.areaLeader && (
            <div className="flex items-center gap-1.5 text-amber-900 bg-amber-50/60 p-1 rounded-lg border border-amber-200/50">
              <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>قائد المنطقة: <strong className="font-black">{teacher.areaLeader}</strong></span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>المشرف المسؤول: <strong className="text-indigo-800">{teacher.supervisor}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>القرية: <strong className="text-slate-800">{teacher.village || 'غير محدد'}</strong></span>
            {teacher.churchName && <span className="text-slate-400">({teacher.churchName})</span>}
          </div>

          <div className="flex items-center gap-1.5">
            <Church className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">الكاهن/الراعي: <strong className="text-slate-800">{teacher.priestOrPastor || 'لا يوجد'}</strong></span>
          </div>
        </div>
      </div>

      {/* Children counts breakdown & Quick adjust */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-blue-700 font-extrabold flex items-center gap-0.5">
              👦 {teacher.boysCount} أولاد
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-extrabold flex items-center gap-0.5">
              👧 {teacher.girlsCount} بنات
            </span>
          </div>

          <div className="font-black text-slate-900 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 text-xs">
            الإجمالي: {teacher.totalChildren} طفل
          </div>
        </div>

        {/* Mini progress bar for boys/girls ratio */}
        <div className="w-full bg-rose-200 rounded-full h-1.5 overflow-hidden flex">
          <div style={{ width: `${boysPercent}%` }} className="bg-blue-600 h-full" />
          <div style={{ width: `${100 - boysPercent}%` }} className="bg-rose-500 h-full" />
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
          {/* Requested "أطفال" Button inside each teacher icon */}
          <button
            onClick={() => onOpenChildren(teacher)}
            className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
            title="عرض وطباعة كشف أسماء أطفال هذا الفصل"
          >
            <Baby className="w-3.5 h-3.5" />
            <span>أطفال ({teacher.totalChildren})</span>
          </button>

          {/* Contact buttons */}
          <div className="flex items-center gap-1.5">
            {teacher.formattedPhone && (
              <>
                <a
                  href={formatCallUrl(teacher.formattedPhone)}
                  className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition active:scale-95"
                  title="اتصال هاتفي"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                <a
                  href={formatWhatsAppUrl(teacher.formattedPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs active:scale-95"
                  title="محادثة واتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
