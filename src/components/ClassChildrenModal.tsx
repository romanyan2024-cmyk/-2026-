import React, { useState } from 'react';
import { 
  X, 
  Baby, 
  Printer, 
  Plus, 
  Phone, 
  MessageCircle, 
  User, 
  CalendarCheck, 
  Trash2, 
  Edit3, 
  Sparkles,
  School,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { TeacherRecord, ChildRecord } from '../types';
import { formatCallUrl, formatWhatsAppUrl, cleanPhoneNumber } from '../utils/formatters';
import { generateInitialRosterForTeacher } from '../utils/storage';
import confetti from 'canvas-confetti';

interface ClassChildrenModalProps {
  teacher: TeacherRecord | null;
  children: ChildRecord[];
  onClose: () => void;
  onAddChild: (c: Omit<ChildRecord, 'id'>) => void;
  onEditChild: (child: ChildRecord) => void;
  onDeleteChild: (id: string) => void;
  onUpdateAttendance: (id: string, delta: number) => void;
  onPopulateRoster: (roster: ChildRecord[]) => void;
}

export const ClassChildrenModal: React.FC<ClassChildrenModalProps> = ({
  teacher,
  children,
  onClose,
  onAddChild,
  onEditChild,
  onDeleteChild,
  onUpdateAttendance,
  onPopulateRoster
}) => {
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildGender, setNewChildGender] = useState<'ولد' | 'بنت'>('ولد');
  const [newChildGuardianName, setNewChildGuardianName] = useState('');
  const [newChildGuardianPhone, setNewChildGuardianPhone] = useState('');
  const [newChildNotes, setNewChildNotes] = useState('');

  if (!teacher) return null;

  // Filter children for this specific teacher
  const classChildren = children.filter(c => 
    c.teacherName.trim() === teacher.teacherName.trim() ||
    (c.teacherId && c.teacherId === teacher.id)
  );

  const boysCount = classChildren.filter(c => c.gender === 'ولد').length;
  const girlsCount = classChildren.filter(c => c.gender === 'بنت').length;

  const handlePrint = () => {
    window.print();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) {
      alert('يرجى إدخال اسم الطفل');
      return;
    }

    onAddChild({
      name: newChildName.trim(),
      gender: newChildGender,
      level: teacher.level,
      teacherId: teacher.id,
      teacherName: teacher.teacherName,
      supervisor: teacher.supervisor,
      village: teacher.village,
      region: teacher.region,
      denomination: teacher.denomination,
      guardianName: newChildGuardianName.trim() || `والد ${newChildName.split(' ')[0]}`,
      guardianPhone: cleanPhoneNumber(newChildGuardianPhone) || teacher.formattedPhone,
      attendanceCount: 1,
      notes: newChildNotes.trim(),
      createdAt: new Date().toISOString().slice(0, 10)
    });

    setNewChildName('');
    setNewChildGuardianName('');
    setNewChildGuardianPhone('');
    setNewChildNotes('');
    setShowAddChildForm(false);
    try { confetti({ particleCount: 30 }); } catch {}
  };

  const handleAutoPopulateRoster = () => {
    const generated = generateInitialRosterForTeacher(teacher);
    onPopulateRoster(generated);
    try { confetti({ particleCount: 40 }); } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white p-4 sm:p-5 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
              <Baby className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base sm:text-lg">
                  كشف أطفال فصل: {teacher.teacherName}
                </h3>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  المستوى {teacher.level}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>المشرف: <strong className="text-white">{teacher.supervisor}</strong></span>
                <span>•</span>
                <span>القرية: <strong className="text-white">{teacher.village}</strong> ({teacher.region})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Print Roster Button */}
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition border border-slate-700 flex items-center gap-1.5 shadow-sm active:scale-95"
              title="طباعة كشف أطفال الفصل"
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

        {/* Printable Official Header (Shown ONLY when printing) */}
        <div className="hidden print:block p-6 text-center border-b-2 border-slate-900">
          <h1 className="text-xl font-black text-black mb-1">
            تطبيق إدارة صناع القادة • إشراف: Romany Adly
          </h1>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            كشف أسماء أطفال فصل الخادم / المعلم: {teacher.teacherName}
          </h2>
          <div className="flex justify-between items-center text-xs text-slate-700 font-semibold px-4 pt-2 border-t border-slate-300">
            <span>المشرف المسؤول: {teacher.supervisor}</span>
            <span>المنطقة: {teacher.region} - {teacher.village}</span>
            <span>الطائفة: {teacher.denomination}</span>
            <span>الكاهن/الراعي: {teacher.priestOrPastor}</span>
            <span>المستوى: {teacher.level}</span>
          </div>
          <div className="mt-2 text-xs font-black text-slate-900 bg-slate-100 p-1.5 rounded">
            إجمالي أطفال الفصل: {classChildren.length} طفل (أولاد: {boysCount} - بنات: {girlsCount})
          </div>
        </div>

        {/* Class Metrics & Action Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 shadow-xs">
              مسجل بالكشف: <strong className="text-indigo-600 font-black">{classChildren.length} طفل</strong>
            </span>
            <span className="bg-blue-50 text-blue-800 px-2.5 py-1.5 rounded-xl border border-blue-200">
              👦 {boysCount} أولاد
            </span>
            <span className="bg-rose-50 text-rose-800 px-2.5 py-1.5 rounded-xl border border-rose-200">
              👧 {girlsCount} بنات
            </span>
            <span className="text-slate-500 hidden md:inline text-[11px]">
              (إجمالي الفصل بالشيت الأصلي: {teacher.totalChildren} طفل)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddChildForm(!showAddChildForm)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ إضافة طفل لهذا الفصل</span>
            </button>
          </div>
        </div>

        {/* Notes for Orphans or Special Cases / Crisis */}
        {(teacher.orphanNotes || teacher.generalNotes) && (
          <div className="bg-amber-50/90 border-b border-amber-200 p-3 sm:px-5 space-y-1 text-xs text-amber-950">
            {teacher.orphanNotes && (
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md shrink-0">الأيتام بالفصل:</span>
                <span className="font-semibold">{teacher.orphanNotes}</span>
              </div>
            )}
            {teacher.generalNotes && (
              <div className="flex items-center gap-2">
                <span className="font-black text-rose-900 bg-rose-200/70 px-2 py-0.5 rounded-md shrink-0">حالات صحية / خاصة:</span>
                <span className="font-semibold text-rose-950">{teacher.generalNotes}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick Add Form Box */}
        {showAddChildForm && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-emerald-50/70 border-b border-emerald-200 space-y-3 no-print animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                إضافة طفل جديد لفصل {teacher.teacherName}:
              </span>
              <button
                type="button"
                onClick={() => setShowAddChildForm(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="اسم الطفل رباعي *"
                  value={newChildName}
                  onChange={e => setNewChildName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <select
                  value={newChildGender}
                  onChange={e => setNewChildGender(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold focus:outline-hidden"
                >
                  <option value="ولد">ولد 👦</option>
                  <option value="بنت">بنت 👧</option>
                </select>
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="هاتف ولي الأمر"
                  value={newChildGuardianPhone}
                  onChange={e => setNewChildGuardianPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-1.5 rounded-xl shadow-sm transition active:scale-95"
              >
                تسجيل الطفل
              </button>
            </div>
          </form>
        )}

        {/* Children List Table */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-3 flex-1 bg-slate-50">
          {classChildren.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
              <Baby className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">لم يتم تسجيل أسماء أطفال لهذا الفصل حتى الآن</p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                وفقاً للشيت المسجل، يضم هذا الفصل {teacher.boysCount} أولاد و {teacher.girlsCount} بنات (الإجمالي: {teacher.totalChildren} طفل).
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setShowAddChildForm(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95"
                >
                  + إضافة طفل جديد للفصل
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center w-12">#</th>
                    <th className="p-3">اسم الطفل</th>
                    <th className="p-3">الصف الدراسي</th>
                    <th className="p-3">النوع</th>
                    <th className="p-3">المستوى</th>
                    <th className="p-3">ولي الأمر</th>
                    <th className="p-3">الهاتف</th>
                    <th className="p-3 text-center">الحضور</th>
                    <th className="p-3 text-center no-print">إجراءات</th>
                    <th className="p-3 text-center hidden print:table-cell">التوقيع / الملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {classChildren.map((child, idx) => {
                    const isBoy = child.gender === 'ولد';
                    return (
                      <tr key={child.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-black text-slate-900">
                          {child.name}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {child.grade || child.notes || '-'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isBoy ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isBoy ? 'ولد 👦' : 'بنت 👧'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{child.level}</td>
                        <td className="p-3 text-slate-700">{child.guardianName || '-'}</td>
                        <td className="p-3 text-slate-600 font-mono">
                          {child.guardianPhone ? (
                            <div className="flex items-center gap-1.5">
                              <span>{child.guardianPhone}</span>
                              <div className="flex items-center gap-1 no-print">
                                <a
                                  href={formatCallUrl(child.guardianPhone)}
                                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-indigo-700"
                                  title="اتصال"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                <a
                                  href={formatWhatsAppUrl(child.guardianPhone)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                                  title="واتساب"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                              {child.attendanceCount || 0}
                            </span>
                            <button
                              onClick={() => onUpdateAttendance(child.id, 1)}
                              className="w-5 h-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold no-print shadow-xs"
                              title="تسجيل حضور جديد"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center no-print">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onEditChild(child)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                              title="تعديل الطفل"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف الطفل "${child.name}"؟`)) {
                                  onDeleteChild(child.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="حذف الطفل"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-center hidden print:table-cell text-slate-400">
                          ____________________
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
