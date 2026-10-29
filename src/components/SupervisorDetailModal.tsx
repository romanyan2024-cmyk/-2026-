import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  UserCheck, 
  Users, 
  Baby, 
  MapPin, 
  Phone, 
  Church, 
  MessageCircle, 
  Edit3,
  Download,
  Crown,
  Check
} from 'lucide-react';
import { SupervisorRecord, TeacherRecord } from '../types';
import { formatCallUrl, formatWhatsAppUrl } from '../utils/formatters';

interface SupervisorDetailModalProps {
  supervisor: SupervisorRecord | null;
  teachersUnderSup: TeacherRecord[];
  onClose: () => void;
  onEditTeacher: (t: TeacherRecord) => void;
  onOpenChildren: (t: TeacherRecord) => void;
  onUpdateSupervisorAreaLeader?: (supervisorId: string, newLeader: string) => void;
}

export const SupervisorDetailModal: React.FC<SupervisorDetailModalProps> = ({
  supervisor,
  teachersUnderSup,
  onClose,
  onEditTeacher,
  onOpenChildren,
  onUpdateSupervisorAreaLeader
}) => {
  if (!supervisor) return null;

  const [isEditingLeader, setIsEditingLeader] = useState(false);
  const currentLeader = supervisor.areaLeader || (teachersUnderSup.find(t => t.areaLeader)?.areaLeader) || 'Romany Adly';
  const [leaderInput, setLeaderInput] = useState(currentLeader);

  const totalBoys = teachersUnderSup.reduce((acc, t) => acc + (t.boysCount || 0), 0);
  const totalGirls = teachersUnderSup.reduce((acc, t) => acc + (t.girlsCount || 0), 0);
  const totalChildren = totalBoys + totalGirls;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveLeader = () => {
    if (onUpdateSupervisorAreaLeader && leaderInput.trim()) {
      onUpdateSupervisorAreaLeader(supervisor.id, leaderInput.trim());
    }
    setIsEditingLeader(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-lg sm:text-xl text-white">
                  بيانات خدام المشرف: {supervisor.name}
                </h3>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  مشرف معتمد
                </span>
              </div>
              <div className="text-xs text-amber-200 mt-1 flex items-center gap-2 flex-wrap">
                <span>المناطق المشرف عليها: <strong className="text-white">{supervisor.regions.join('، ')}</strong></span>
                <span>•</span>
                {/* Area Leader Badge & Inline Editor */}
                <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-amber-400/40">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-amber-300 font-bold">قائد المنطقة:</span>
                  {isEditingLeader ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={leaderInput}
                        onChange={e => setLeaderInput(e.target.value)}
                        className="bg-slate-900 border border-amber-400 text-white text-xs px-2 py-0.5 rounded font-black focus:outline-hidden"
                      />
                      <button
                        onClick={handleSaveLeader}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setIsEditingLeader(false)}
                        className="text-xs text-slate-300 hover:text-white px-1"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white font-black">{currentLeader}</strong>
                      <button
                        onClick={() => {
                          setLeaderInput(currentLeader);
                          setIsEditingLeader(true);
                        }}
                        className="p-1 rounded-md hover:bg-white/10 text-amber-300 hover:text-white transition"
                        title="تعديل قائد المنطقة لهذا المشرف"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition border border-slate-700 flex items-center gap-1.5 shadow-sm active:scale-95"
              title="طباعة كشف خدام المشرف"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">طباعة الكشف</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Header (Shown ONLY when printing) */}
        <div className="hidden print:block p-6 text-center border-b-2 border-slate-900">
          <h1 className="text-xl font-black text-black mb-1">
            تطبيق إدارة صناع القادة • إشراف: Romany Adly
          </h1>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            كشف بيان الخدام والمعلمين التابعين للمشرف: {supervisor.name}
          </h2>
          <div className="flex justify-between items-center text-xs text-slate-700 font-semibold px-4 pt-2 border-t border-slate-300">
            <span>المناطق المشرف عليها: {supervisor.regions.join('، ')}</span>
            <span>قائد المنطقة المسؤول: {currentLeader}</span>
            <span>عدد الخدام التابعين: {teachersUnderSup.length} خادم</span>
            <span>إجمالي الأطفال: {totalChildren} طفل (أولاد: {totalBoys} - بنات: {totalGirls})</span>
            <span>تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        {/* Quick Stats Pill Header */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold no-print">
          <div className="flex items-center gap-2">
            <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 shadow-xs">
              عدد الخدام: <strong className="text-indigo-700 font-black">{teachersUnderSup.length} خادم</strong>
            </span>
            <span className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-200">
              👦 {totalBoys} أولاد
            </span>
            <span className="bg-rose-50 text-rose-800 px-2.5 py-1.5 rounded-xl border border-rose-200">
              👧 {totalGirls} بنات
            </span>
            <span className="bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl border border-indigo-200 font-black">
              إجمالي الأطفال: {totalChildren} طفل
            </span>
          </div>

          <span className="text-slate-500 text-[11px]">
            عرض منسق واحترافي لبيانات الخدام قابل للطباعة الفورية
          </span>
        </div>

        {/* Teachers Table / List */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-3 flex-1 bg-slate-50">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 text-center w-10">#</th>
                  <th className="p-3">اسم الخادم / المدرس</th>
                  <th className="p-3">المنطقة والقرية</th>
                  <th className="p-3">الطائفة</th>
                  <th className="p-3">الكاهن / الراعي</th>
                  <th className="p-3">المستوى</th>
                  <th className="p-3 text-center">الفصول</th>
                  <th className="p-3 text-center text-blue-700">الأولاد</th>
                  <th className="p-3 text-center text-rose-700">البنات</th>
                  <th className="p-3 text-center font-black text-indigo-900">الإجمالي</th>
                  <th className="p-3 text-center no-print">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {teachersUnderSup.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-black text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{t.teacherName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{t.formattedPhone}</span>
                    </td>
                    <td className="p-3 text-slate-700">
                      <div className="font-bold">{t.region}</div>
                      <div className="text-[11px] text-slate-500">{t.village}</div>
                    </td>
                    <td className="p-3 text-slate-700">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                        {t.denomination}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{t.priestOrPastor || 'لا يوجد'}</td>
                    <td className="p-3 text-slate-700 font-bold">{t.level}</td>
                    <td className="p-3 text-center font-bold">{t.classCount}</td>
                    <td className="p-3 text-center font-bold text-blue-700">{t.boysCount}</td>
                    <td className="p-3 text-center font-bold text-rose-700">{t.girlsCount}</td>
                    <td className="p-3 text-center font-black text-indigo-700 text-sm">{t.totalChildren}</td>
                    <td className="p-3 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        {/* Children Button */}
                        <button
                          onClick={() => onOpenChildren(t)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 transition flex items-center gap-1"
                          title="عرض أطفال الفصل"
                        >
                          <Baby className="w-3 h-3" />
                          <span>أطفال</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditTeacher(t)}
                          className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                          title="تعديل بيانات الخادم"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Direct Call / WhatsApp */}
                        {t.formattedPhone && (
                          <a
                            href={formatCallUrl(t.formattedPhone)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="اتصال"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
