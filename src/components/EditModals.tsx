import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, Users, UserCheck, Baby, Save, Phone, MapPin, Church, ShieldCheck, Crown } from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import { cleanPhoneNumber } from '../utils/formatters';
import confetti from 'canvas-confetti';

export type EditingTarget = 
  | { type: 'teacher'; data: TeacherRecord }
  | { type: 'supervisor'; data: SupervisorRecord }
  | { type: 'child'; data: ChildRecord }
  | null;

interface EditModalsProps {
  editingTarget: EditingTarget;
  onClose: () => void;
  supervisorsList: string[];
  regionsList: string[];
  denominationsList: string[];
  teachersList: string[];
  areaLeaders?: Record<string, string>;
  onSaveTeacher: (t: TeacherRecord) => void;
  onSaveSupervisor: (s: SupervisorRecord) => void;
  onSaveChild: (c: ChildRecord) => void;
}

export const EditModals: React.FC<EditModalsProps> = ({
  editingTarget,
  onClose,
  supervisorsList,
  regionsList,
  denominationsList,
  teachersList,
  areaLeaders,
  onSaveTeacher,
  onSaveSupervisor,
  onSaveChild
}) => {
  // Teacher form state
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tSupervisor, setTSupervisor] = useState('');
  const [tRegion, setTRegion] = useState('');
  const [tVillage, setTVillage] = useState('');
  const [tDenomination, setTDenomination] = useState('');
  const [tPriest, setTPriest] = useState('');
  const [tLevel, setTLevel] = useState('');
  const [tClasses, setTClasses] = useState('1');
  const [tBoys, setTBoys] = useState('0');
  const [tGirls, setTGirls] = useState('0');
  const [tNotes, setTNotes] = useState('');

  // Supervisor form state
  const [sName, setSName] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sSelectedRegions, setSSelectedRegions] = useState<string[]>([]);
  const [sAreaLeader, setSAreaLeader] = useState('');
  const [sNotes, setSNotes] = useState('');

  // Child form state
  const [cName, setCName] = useState('');
  const [cGender, setCGender] = useState<'ولد' | 'بنت'>('ولد');
  const [cLevel, setCLevel] = useState('الاول');
  const [cTeacher, setCTeacher] = useState('');
  const [cVillage, setCVillage] = useState('');
  const [cGuardianName, setCGuardianName] = useState('');
  const [cGuardianPhone, setCGuardianPhone] = useState('');
  const [cAttendance, setCAttendance] = useState('1');
  const [cNotes, setCNotes] = useState('');

  useEffect(() => {
    if (!editingTarget) return;

    if (editingTarget.type === 'teacher') {
      const d = editingTarget.data;
      setTName(d.teacherName || '');
      setTPhone(d.phone || '');
      setTSupervisor(d.supervisor || '');
      setTRegion(d.region || '');
      setTVillage(d.village || '');
      setTDenomination(d.denomination || 'الاورثوذكسية');
      setTPriest(d.priestOrPastor || '');
      setTLevel(d.level || 'الاول');
      setTClasses(String(d.classCount || 1));
      setTBoys(String(d.boysCount || 0));
      setTGirls(String(d.girlsCount || 0));
      setTNotes(d.notes || '');
    } else if (editingTarget.type === 'supervisor') {
      const d = editingTarget.data;
      setSName(d.name || '');
      setSPhone(d.phone || '');
      setSSelectedRegions(d.regions || []);
      const defaultLeader = d.areaLeader || (areaLeaders && d.regions[0] ? areaLeaders[d.regions[0]] : '') || '';
      setSAreaLeader(defaultLeader);
      setSNotes(d.notes || '');
    } else if (editingTarget.type === 'child') {
      const d = editingTarget.data;
      setCName(d.name || '');
      setCGender(d.gender || 'ولد');
      setCLevel(d.level || 'الاول');
      setCTeacher(d.teacherName || '');
      setCVillage(d.village || '');
      setCGuardianName(d.guardianName || '');
      setCGuardianPhone(d.guardianPhone || '');
      setCAttendance(String(d.attendanceCount || 1));
      setCNotes(d.notes || '');
    }
  }, [editingTarget]);

  if (!editingTarget) return null;

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTarget.type !== 'teacher') return;
    if (!tName.trim()) {
      alert('يرجى كتابة اسم المعلم/الخادم');
      return;
    }

    const b = parseInt(tBoys, 10) || 0;
    const g = parseInt(tGirls, 10) || 0;
    const cls = parseInt(tClasses, 10) || 1;
    const formatted = cleanPhoneNumber(tPhone);

    onSaveTeacher({
      ...editingTarget.data,
      teacherName: tName.trim(),
      phone: tPhone.trim(),
      formattedPhone: formatted,
      supervisor: tSupervisor.trim(),
      region: tRegion.trim(),
      village: tVillage.trim(),
      denomination: tDenomination.trim(),
      priestOrPastor: tPriest.trim(),
      level: tLevel.trim(),
      classCount: cls,
      boysCount: b,
      girlsCount: g,
      totalChildren: b + g,
      notes: tNotes.trim()
    });

    try { confetti({ particleCount: 30 }); } catch {}
    onClose();
  };

  const handleSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTarget.type !== 'supervisor') return;
    if (!sName.trim()) {
      alert('يرجى كتابة اسم المشرف');
      return;
    }

    onSaveSupervisor({
      ...editingTarget.data,
      name: sName.trim(),
      phone: cleanPhoneNumber(sPhone),
      regions: sSelectedRegions.length > 0 ? sSelectedRegions : editingTarget.data.regions,
      areaLeader: sAreaLeader.trim() || undefined,
      notes: sNotes.trim()
    });

    try { confetti({ particleCount: 30 }); } catch {}
    onClose();
  };

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTarget.type !== 'child') return;
    if (!cName.trim()) {
      alert('يرجى كتابة اسم الطفل');
      return;
    }

    onSaveChild({
      ...editingTarget.data,
      name: cName.trim(),
      gender: cGender,
      level: cLevel,
      teacherName: cTeacher.trim(),
      village: cVillage.trim(),
      guardianName: cGuardianName.trim(),
      guardianPhone: cleanPhoneNumber(cGuardianPhone),
      attendanceCount: parseInt(cAttendance, 10) || 0,
      notes: cNotes.trim()
    });

    try { confetti({ particleCount: 30 }); } catch {}
    onClose();
  };

  const titleMap = {
    teacher: 'تعديل بيانات الخادم / المعلم',
    supervisor: 'تعديل بيانات المشرف',
    child: 'تعديل بيانات الطفل / المخدوم'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base">{titleMap[editingTarget.type]}</h3>
              <p className="text-[11px] text-indigo-200">تحديث البيانات وحفظ التعديلات في قاعدة البيانات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          
          {/* 1. TEACHER EDIT FORM */}
          {editingTarget.type === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الخادم / المدرس *</label>
                  <input
                    type="text"
                    required
                    value={tName}
                    onChange={e => setTName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
                  <input
                    type="tel"
                    value={tPhone}
                    onChange={e => setTPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المشرف المسؤول</label>
                  <select
                    value={tSupervisor}
                    onChange={e => setTSupervisor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  >
                    {supervisorsList.map((sup, idx) => (
                      <option key={idx} value={sup}>{sup}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المنطقة</label>
                  <select
                    value={tRegion}
                    onChange={e => setTRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  >
                    {regionsList.map((reg, idx) => (
                      <option key={idx} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">القرية / الكنيسة</label>
                  <input
                    type="text"
                    value={tVillage}
                    onChange={e => setTVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الطائفة</label>
                  <select
                    value={tDenomination}
                    onChange={e => setTDenomination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="الاورثوذكسية">الاورثوذكسية</option>
                    <option value="الانجيلية">الانجيلية</option>
                    <option value="الكاثوليك">الكاثوليك</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الكاهن أو الراعي</label>
                  <input
                    type="text"
                    value={tPriest}
                    onChange={e => setTPriest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المستوى</label>
                  <select
                    value={tLevel}
                    onChange={e => setTLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="الاول">المستوى الأول</option>
                    <option value="الثاني">المستوى الثاني</option>
                  </select>
                </div>
              </div>

              {/* Counts */}
              <div className="bg-indigo-50/80 p-3 rounded-2xl border border-indigo-200">
                <span className="block text-xs font-black text-indigo-900 mb-2">أعداد الفصول والأطفال:</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">عدد الفصول</label>
                    <input
                      type="number"
                      min="1"
                      value={tClasses}
                      onChange={e => setTClasses(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 mb-1">الأولاد</label>
                    <input
                      type="number"
                      min="0"
                      value={tBoys}
                      onChange={e => setTBoys(e.target.value)}
                      className="w-full bg-white border border-blue-300 rounded-xl p-2 text-xs text-center font-bold text-blue-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 mb-1">البنات</label>
                    <input
                      type="number"
                      min="0"
                      value={tGirls}
                      onChange={e => setTGirls(e.target.value)}
                      className="w-full bg-white border border-rose-300 rounded-xl p-2 text-xs text-center font-bold text-rose-900"
                    />
                  </div>
                </div>
                <div className="mt-2 text-center text-xs font-black text-indigo-950">
                  إجمالي الأطفال بعد التعديل: {(parseInt(tBoys, 10) || 0) + (parseInt(tGirls, 10) || 0)} طفل
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  value={tNotes}
                  onChange={e => setTNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الخادم</span>
              </button>
            </form>
          )}

          {/* 2. SUPERVISOR EDIT FORM */}
          {editingTarget.type === 'supervisor' && (
            <form onSubmit={handleSupervisorSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المشرف بالكامل *</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={e => setSName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
                <input
                  type="tel"
                  value={sPhone}
                  onChange={e => setSPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Area Leader (قائد المنطقة) Field */}
              <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-300/80 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span>قائد المنطقة المسؤول عن هذا المشرف:</span>
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full font-black">
                    الترتيب الإداري
                  </span>
                </div>

                <div className="relative mb-2">
                  <input
                    type="text"
                    value={sAreaLeader}
                    onChange={e => setSAreaLeader(e.target.value)}
                    placeholder="اكتب اسم قائد المنطقة أو اختر من المقترحات أدناه..."
                    className="w-full bg-white border border-amber-400 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    list="supervisor-leaders-options"
                  />
                  <datalist id="supervisor-leaders-options">
                    <option value="أ/ يوسف حنا">بني مزار ومغاغة</option>
                    <option value="أ/ عماد لندي">الفشن وببا وسمسطا</option>
                    <option value="أ/ لابان وليم">ملوي ودير مواس</option>
                    <option value="أ/ شحاته عياد">ابوقرقاص</option>
                    <option value="أ/ شكري فرج">سمالوط والمنيا</option>
                    <option value="Romany Adly">المسؤول العام</option>
                  </datalist>
                </div>

                {/* Quick picker chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-amber-900 font-bold self-center ml-1">قادة معتمدون:</span>
                  {[
                    'أ/ يوسف حنا',
                    'أ/ عماد لندي',
                    'أ/ لابان وليم',
                    'أ/ شحاته عياد',
                    'أ/ شكري فرج',
                    'Romany Adly'
                  ].map((ldr) => (
                    <button
                      key={ldr}
                      type="button"
                      onClick={() => setSAreaLeader(ldr)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                        sAreaLeader === ldr
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400'
                          : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/60'
                      }`}
                    >
                      {sAreaLeader === ldr && <Check className="w-3 h-3 text-slate-950" />}
                      <span>{ldr}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">المناطق الموكلة إليه بالإشراف:</label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {regionsList.map((reg, idx) => {
                    const isSelected = sSelectedRegions.includes(reg);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSSelectedRegions(prev => prev.filter(r => r !== reg));
                          } else {
                            setSSelectedRegions(prev => [...prev, reg]);
                          }
                        }}
                        className={`text-xs px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{reg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات المشرف</label>
                <textarea
                  rows={2}
                  value={sNotes}
                  onChange={e => setSNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات المشرف</span>
              </button>
            </form>
          )}

          {/* 3. CHILD EDIT FORM */}
          {editingTarget.type === 'child' && (
            <form onSubmit={handleChildSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطفل *</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={e => setCName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">النوع / الجنس</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCGender('ولد')}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                        cGender === 'ولد'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ولد 👦
                    </button>
                    <button
                      type="button"
                      onClick={() => setCGender('بنت')}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition ${
                        cGender === 'بنت'
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      بنت 👧
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المستوى</label>
                  <select
                    value={cLevel}
                    onChange={e => setCLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="الاول">المستوى الأول</option>
                    <option value="الثاني">المستوى الثاني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المعلم / الخادم المسؤول</label>
                <select
                  value={cTeacher}
                  onChange={e => setCTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  {teachersList.map((tn, idx) => (
                    <option key={idx} value={tn}>{tn}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">القرية أو المنطقة</label>
                  <input
                    type="text"
                    value={cVillage}
                    onChange={e => setCVillage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مرات الحضور المسجلة</label>
                  <input
                    type="number"
                    min="0"
                    value={cAttendance}
                    onChange={e => setCAttendance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم ولي الأمر</label>
                  <input
                    type="text"
                    value={cGuardianName}
                    onChange={e => setCGuardianName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">هاتف ولي الأمر</label>
                  <input
                    type="tel"
                    value={cGuardianPhone}
                    onChange={e => setCGuardianPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات المتابعة</label>
                <textarea
                  rows={2}
                  value={cNotes}
                  onChange={e => setCNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-98 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الطفل</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
