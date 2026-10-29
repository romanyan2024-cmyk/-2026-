import React from 'react';
import { Baby, Phone, Trash2, CalendarCheck, MapPin, User, Edit3 } from 'lucide-react';
import { ChildRecord } from '../types';
import { formatCallUrl, formatWhatsAppUrl } from '../utils/formatters';

interface ChildCardProps {
  child: ChildRecord;
  onDelete: (id: string) => void;
  onEdit: (child: ChildRecord) => void;
  onUpdateAttendance: (id: string, delta: number) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({
  child,
  onDelete,
  onEdit,
  onUpdateAttendance
}) => {
  const isBoy = child.gender === 'ولد';

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
              isBoy 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}>
              {isBoy ? 'ولد 👦' : 'بنت 👧'}
            </span>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
              المستوى: {child.level}
            </span>
            {child.grade && (
              <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                الصف {child.grade}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Edit Child Button */}
            <button
              onClick={() => onEdit(child)}
              className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition p-1.5 rounded-xl border border-transparent hover:border-amber-200"
              title="تعديل بيانات الطفل"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف الطفل "${child.name}"؟`)) {
                  onDelete(child.id);
                }
              }}
              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition p-1.5 rounded-xl border border-transparent hover:border-rose-200"
              title="حذف الطفل"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Child Name */}
        <h3 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
          <Baby className={`w-4 h-4 ${isBoy ? 'text-blue-600' : 'text-rose-500'}`} />
          <span>{child.name}</span>
        </h3>

        {/* Details Box */}
        <div className="bg-slate-50 rounded-2xl p-2.5 space-y-1 text-xs text-slate-600 mb-3 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>الخادم: <strong className="text-slate-800">{child.teacherName}</strong></span>
          </div>

          {child.village && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>القرية / الكنيسة: <strong className="text-slate-800">{child.village}</strong></span>
            </div>
          )}

          {child.guardianName && (
            <div className="text-slate-500 pt-1 text-[11px]">
              ولي الأمر: <span className="font-semibold text-slate-700">{child.guardianName}</span>
            </div>
          )}
        </div>

        {child.notes && (
          <p className="text-[11px] text-slate-500 italic mb-3">
            ملاحظات: {child.notes}
          </p>
        )}
      </div>

      {/* Footer: Attendance Counter & Call Parent */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Attendance Counter */}
        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-xl text-xs">
          <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-slate-600 text-[11px]">حضور:</span>
          <strong className="text-slate-900 font-black">{child.attendanceCount || 0}</strong>
          
          <button
            onClick={() => onUpdateAttendance(child.id, 1)}
            className="w-5 h-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center text-xs ml-1 shadow-xs"
            title="تسجيل حضور جديد"
          >
            +
          </button>
        </div>

        {/* Call guardian */}
        {child.guardianPhone && (
          <div className="flex items-center gap-1">
            <a
              href={formatCallUrl(child.guardianPhone)}
              className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
              title="اتصال بولي الأمر"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
            <a
              href={formatWhatsAppUrl(child.guardianPhone)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded-xl bg-emerald-500 text-white text-[10px] font-bold"
            >
              واتساب
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
