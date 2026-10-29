import React, { useState } from 'react';
import { X, Users, UserCheck, Baby, Plus, Check, Phone, MapPin, Church, Award, Crown } from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import { cleanPhoneNumber } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface AddModalsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'teacher' | 'supervisor' | 'child';
  supervisorsList: string[];
  regionsList: string[];
  denominationsList: string[];
  villagesList: string[];
  teachersList: string[];
  onAddTeacher: (t: Omit<TeacherRecord, 'id'>) => void;
  onAddSupervisor: (s: Omit<SupervisorRecord, 'id'>) => void;
  onAddChild: (c: Omit<ChildRecord, 'id'>) => void;
}

export const AddModals: React.FC<AddModalsProps> = ({
  isOpen,
  onClose,
  defaultType = 'teacher',
  supervisorsList,
  regionsList,
  denominationsList,
  villagesList,
  teachersList,
  onAddTeacher,
  onAddSupervisor,
  onAddChild
}) => {
  const [modalType, setModalType] = useState<'teacher' | 'supervisor' | 'child'>(defaultType);

  // Teacher Form State
  const [tSupervisor, setTSupervisor] = useState(supervisorsList[0] || 'ابانوب جاب الله');
  const [tRegion, setTRegion] = useState(regionsList[0] || 'ابوقرقاص');
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tVillage, setTVillage] = useState('');
  const [tDenomination, setTDenomination] = useState('الاورثوذكسية');
  const [tPriest, setTPriest] = useState('');
  const [tLevel, setTLevel] = useState('الاول');
  const [tClasses, setTClasses] = useState('1');
  const [tBoys, setTBoys] = useState('10');
  const [tGirls, setTGirls] = useState('10');

  // Supervisor Form State
  const [sName, setSName] = useState('');
  const [sPhone, setSPhone] = useState('');
  const [sSelectedRegions, setSSelectedRegions] = useState<string[]>(['ابوقرقاص']);
  const [sAreaLeader, setSAreaLeader] = useState('أ/ شحاته عياد');
  const [sNotes, setSNotes] = useState('');

  // Child Form State
  const [cName, setCName] = useState('');
  const [cGender, setCGender] = useState<'ولد' | 'بنت'>('ولد');
  const [cLevel, setCLevel] = useState<'الاول' | 'الثاني'>('الاول');
  const [cTeacher, setCTeacher] = useState(teachersList[0] || '');
  const [cVillage, setCVillage] = useState('');
  const [cGuardianName, setCGuardianName] = useState('');
  const [cGuardianPhone, setCGuardianPhone] = useState('');
  const [cNotes, setCNotes] = useState('');

  if (!isOpen) return null;

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) {
      alert('يرجى إدخال اسم الخادم/المعلم');
      return;
    }

    const b = parseInt(tBoys, 10) || 0;
    const g = parseInt(tGirls, 10) || 0;
    const cls = parseInt(tClasses, 10) || 1;
    const formatted = cleanPhoneNumber(tPhone);

    onAddTeacher({
      supervisor: tSupervisor,
      region: tRegion,
      teacherName: tName.trim(),
      phone: tPhone.trim(),
      formattedPhone: formatted,
      village: tVillage.trim() || 'المركز',
      denomination: tDenomination,
      priestOrPastor: tPriest.trim() || 'لا يوجد',
      level: tLevel,
      classCount: cls,
      boysCount: b,
      girlsCount: g,
      totalChildren: b + g,
      createdAt: new Date().toISOString().slice(0, 10)
    });

    try { confetti({ particleCount: 40 }); } catch {}
    onClose();
  };

  const handleSupervisorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) {
      alert('يرجى إدخال اسم المشرف');
      return;
    }

    onAddSupervisor({
      name: sName.trim(),
      phone: cleanPhoneNumber(sPhone),
      regions: sSelectedRegions.length > 0 ? sSelectedRegions : ['عام'],
      areaLeader: sAreaLeader.trim() || undefined,
      teachersCount: 0,
      totalChildren: 0,
      notes: sNotes.trim()
    });

    try { confetti({ particleCount: 40 }); } catch {}
    onClose();
  };

  const handleChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim()) {
      alert('يرجى إدخال اسم الطفل');
      return;
    }

    onAddChild({
      name: cName.trim(),
      gender: cGender,
      level: cLevel,
      teacherName: cTeacher || 'غير محدد',
      village: cVillage.trim(),
      guardianName: cGuardianName.trim(),
      guardianPhone: cleanPhoneNumber(cGuardianPhone),
      notes: cNotes.trim(),
      attendanceCount: 1,
      createdAt: new Date().toISOString().slice(0, 10)
    });

    try { confetti({ particleCount: 40 }); } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">إضافة وإدخال بيانات جديدة</h3>
              <p className="text-[11px] text-indigo-200">اختر الفئة وأدخل البيانات بدقة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex p-2 bg-slate-100 border-b border-slate-200 gap-1.5">
          <button
            type="button"
            onClick={() => setModalType('teacher')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>خادم / معلم</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('supervisor')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'supervisor'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>مشرف</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('child')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'child'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>طفل / مخدوم</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4">
          
          {/* 1. TEACHER FORM */}
          {modalType === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الخادم / المدرس *</label>
                  <input
                    type="text"
                    required
                    value={tName}
                    onChange={e => setTName(e.target.value)}
                    placeholder="مثال: يوسف نبيل عزيز"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل</label>
                  <input
                    type="tel"
                    value={tPhone}
                    onChange={e => setTPhone(e.target.value)}
                    placeholder="مثال: 01234567890"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
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
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
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
                    placeholder="مثال: دير البرشا أو نزلة حنا"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الطائفة</label>
                  <select
                    value={tDenomination}
                    onChange={e => setTDenomination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
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
                    placeholder="مثال: القس يؤانس أو القمص إسحق"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المستوى</label>
                  <select
                    value={tLevel}
                    onChange={e => setTLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="الاول">المستوى الأول</option>
                    <option value="الثاني">المستوى الثاني</option>
                  </select>
                </div>
              </div>

              {/* Number of classes, boys, girls */}
              <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100">
                <span className="block text-xs font-extrabold text-indigo-900 mb-2">أعداد الفصل والأطفال:</span>
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
                <div className="mt-2 text-center text-xs font-black text-indigo-900">
                  إجمالي الأطفال: {(parseInt(tBoys, 10) || 0) + (parseInt(tGirls, 10) || 0)} طفل
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ الخادم في قاعدة البيانات</span>
              </button>
            </form>
          )}

          {/* 2. SUPERVISOR FORM */}
          {modalType === 'supervisor' && (
            <form onSubmit={handleSupervisorSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المشرف بالكامل *</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={e => setSName(e.target.value)}
                  placeholder="مثال: يوسف بطرس حنا"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الموبايل للمشرف</label>
                <input
                  type="tel"
                  value={sPhone}
                  onChange={e => setSPhone(e.target.value)}
                  placeholder="012xxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Area Leader Field */}
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
                    list="new-supervisor-leaders-options"
                  />
                  <datalist id="new-supervisor-leaders-options">
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
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات ومهام المشرف</label>
                <textarea
                  rows={2}
                  value={sNotes}
                  onChange={e => setSNotes(e.target.value)}
                  placeholder="ملاحظات المتابعة أو مواعيد الافتقاد..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ المشرف الجديد</span>
              </button>
            </form>
          )}

          {/* 3. CHILD FORM */}
          {modalType === 'child' && (
            <form onSubmit={handleChildSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطفل ثلاثي أو رباعي *</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={e => setCName(e.target.value)}
                  placeholder="مثال: كيرلس مينا عادل"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
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
                    onChange={e => setCLevel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="الاول">المستوى الأول</option>
                    <option value="الثاني">المستوى الثاني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المعلم / الخادم التابع له الفصل</label>
                <select
                  value={cTeacher}
                  onChange={e => setCTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  {teachersList.map((tName, idx) => (
                    <option key={idx} value={tName}>{tName}</option>
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
                    placeholder="القرية التابع لها"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">هاتف ولي الأمر</label>
                  <input
                    type="tel"
                    value={cGuardianPhone}
                    onChange={e => setCGuardianPhone(e.target.value)}
                    placeholder="رقم للتواصل والافتقاد"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات واحتياجات الافتقاد</label>
                <textarea
                  rows={2}
                  value={cNotes}
                  onChange={e => setCNotes(e.target.value)}
                  placeholder="ملاحظات الحضور، الحفظ، المواهب..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل الطفل في الفصل</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
