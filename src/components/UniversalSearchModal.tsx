import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Phone, 
  MapPin, 
  Edit3,
  MessageCircle,
  Download,
  Baby
} from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import { formatCallUrl, formatWhatsAppUrl } from '../utils/formatters';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: TeacherRecord[];
  supervisors: SupervisorRecord[];
  children: ChildRecord[];
  onEditTeacher?: (t: TeacherRecord) => void;
  onEditSupervisor?: (s: SupervisorRecord) => void;
  onEditChild?: (c: ChildRecord) => void;
  onOpenChildren?: (t: TeacherRecord) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  teachers,
  supervisors,
  children,
  onEditTeacher,
  onEditSupervisor,
  onEditChild,
  onOpenChildren
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<'all' | 'teachers' | 'supervisors' | 'children'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDenomination, setSelectedDenomination] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('all');
  const [minChildrenFilter, setMinChildrenFilter] = useState<number>(0);

  // Extract unique regions, denominations, supervisors
  const regions = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.region) s.add(t.region); });
    return Array.from(s).sort();
  }, [teachers]);

  const denominations = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.denomination) s.add(t.denomination); });
    return Array.from(s).sort();
  }, [teachers]);

  const supervisorNames = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.supervisor) s.add(t.supervisor); });
    return Array.from(s).sort();
  }, [teachers]);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    if (selectedTarget === 'supervisors' || selectedTarget === 'children') return [];
    
    return teachers.filter(t => {
      // Text match
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches = 
          t.teacherName.toLowerCase().includes(query) ||
          t.supervisor.toLowerCase().includes(query) ||
          t.village.toLowerCase().includes(query) ||
          t.region.toLowerCase().includes(query) ||
          t.priestOrPastor.toLowerCase().includes(query) ||
          t.denomination.toLowerCase().includes(query) ||
          t.phone.includes(query) ||
          t.level.toLowerCase().includes(query);

        if (!matches) return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && t.region !== selectedRegion) return false;

      // Denomination filter
      if (selectedDenomination !== 'all' && t.denomination !== selectedDenomination) return false;

      // Level filter
      if (selectedLevel !== 'all' && t.level !== selectedLevel) return false;

      // Supervisor filter
      if (selectedSupervisor !== 'all' && t.supervisor !== selectedSupervisor) return false;

      // Min children filter
      if (minChildrenFilter > 0 && t.totalChildren < minChildrenFilter) return false;

      return true;
    });
  }, [teachers, searchTerm, selectedTarget, selectedRegion, selectedDenomination, selectedLevel, selectedSupervisor, minChildrenFilter]);

  // Filtered supervisors
  const filteredSupervisors = useMemo(() => {
    if (selectedTarget === 'teachers' || selectedTarget === 'children') return [];

    return supervisors.filter(s => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches = s.name.toLowerCase().includes(q) || s.regions.some(r => r.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedRegion !== 'all' && !s.regions.includes(selectedRegion)) return false;
      return true;
    });
  }, [supervisors, searchTerm, selectedTarget, selectedRegion]);

  // Filtered children
  const filteredChildren = useMemo(() => {
    if (selectedTarget === 'teachers' || selectedTarget === 'supervisors') return [];

    return children.filter(c => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches = 
          c.name.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q) ||
          (c.village && c.village.toLowerCase().includes(q)) ||
          (c.guardianPhone && c.guardianPhone.includes(q)) ||
          (c.supervisor && c.supervisor.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
      return true;
    });
  }, [children, searchTerm, selectedTarget, selectedLevel]);

  if (!isOpen) return null;

  const totalResultsCount = filteredTeachers.length + filteredSupervisors.length + filteredChildren.length;

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTarget('all');
    setSelectedRegion('all');
    setSelectedDenomination('all');
    setSelectedLevel('all');
    setSelectedSupervisor('all');
    setMinChildrenFilter(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Search Input & Close */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">البحث الذكي في أي فئة</h3>
                <span className="text-[10px] text-amber-300 font-semibold">صناع القادة • Romany Adly</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box Input */}
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم، القرية، المشرف، الكاهن، المنطقة، رقم الموبايل..."
              className="w-full bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm rounded-2xl pr-10 pl-10 py-3 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner font-medium"
            />
            <Search className="w-5 h-5 text-amber-400 absolute right-3.5 top-3.5 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 space-y-2 text-xs">
          
          {/* Target category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">الفئة:</span>
            {[
              { id: 'all', label: `الكل (${totalResultsCount})` },
              { id: 'teachers', label: `الخدام (${filteredTeachers.length})` },
              { id: 'supervisors', label: `المشرفين (${filteredSupervisors.length})` },
              { id: 'children', label: `الأطفال (${filteredChildren.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTarget(tab.id as any)}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedTarget === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {/* Region Filter */}
            <div>
              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-700 focus:outline-hidden font-medium"
              >
                <option value="all">كل المناطق ({regions.length})</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Denomination Filter */}
            <div>
              <select
                value={selectedDenomination}
                onChange={e => setSelectedDenomination(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-700 focus:outline-hidden font-medium"
              >
                <option value="all">كل الطوائف ({denominations.length})</option>
                {denominations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={e => setSelectedLevel(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-700 focus:outline-hidden font-medium"
              >
                <option value="all">كل المستويات</option>
                <option value="الاول">المستوى الأول</option>
                <option value="الثاني">المستوى الثاني</option>
              </select>
            </div>

            {/* Supervisor Filter */}
            <div>
              <select
                value={selectedSupervisor}
                onChange={e => setSelectedSupervisor(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-slate-700 focus:outline-hidden font-medium"
              >
                <option value="all">كل المشرفين ({supervisorNames.length})</option>
                {supervisorNames.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Filters action */}
          {(searchTerm || selectedRegion !== 'all' || selectedDenomination !== 'all' || selectedLevel !== 'all' || selectedSupervisor !== 'all' || selectedTarget !== 'all') && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-indigo-700 font-bold">
                تم العثور على {totalResultsCount} نتيجة مطابقة
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline"
              >
                مسح كل الفلاتر
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="p-3 sm:p-4 overflow-y-auto no-scrollbar space-y-3 flex-1 bg-slate-50">
          {totalResultsCount === 0 ? (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">لا توجد نتائج مطابقة لبحثك</p>
              <p className="text-xs text-slate-400 mt-1">جرب كلمات بحث مختلفة أو أعد تعيين الفلاتر</p>
              <button
                onClick={resetFilters}
                className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                إعادة ضبط البحث
              </button>
            </div>
          ) : (
            <>
              {/* Teachers Results */}
              {filteredTeachers.map(teacher => (
                <div 
                  key={teacher.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-slate-900">{teacher.teacherName}</span>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                        {teacher.denomination}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                        المستوى {teacher.level}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {teacher.region} - {teacher.village}
                      </span>
                      <span>المشرف: <strong className="text-slate-800">{teacher.supervisor}</strong></span>
                      <span>الكاهن/الراعي: <strong className="text-slate-800">{teacher.priestOrPastor}</strong></span>
                    </div>

                    <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-3 pt-0.5">
                      <span>الفصول: {teacher.classCount}</span>
                      <span className="text-blue-700 font-bold">الأولاد: {teacher.boysCount}</span>
                      <span className="text-rose-600 font-bold">البنات: {teacher.girlsCount}</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-black">
                        الإجمالي: {teacher.totalChildren} طفل
                      </span>
                    </div>
                  </div>

                  {/* Actions & Contact */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {onOpenChildren && (
                      <button
                        onClick={() => onOpenChildren(teacher)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition text-xs font-bold flex items-center gap-1"
                        title="كشف أطفال الفصل"
                      >
                        <Baby className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">أطفال ({teacher.totalChildren})</span>
                      </button>
                    )}

                    {onEditTeacher && (
                      <button
                        onClick={() => onEditTeacher(teacher)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition text-xs font-bold flex items-center gap-1"
                        title="تعديل بيانات الخادم"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">تعديل</span>
                      </button>
                    )}

                    {teacher.formattedPhone && (
                      <>
                        <a
                          href={formatCallUrl(teacher.formattedPhone)}
                          className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition"
                          title="اتصال هاتفي"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={formatWhatsAppUrl(teacher.formattedPhone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs"
                          title="محادثة واتساب"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>واتساب</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* Supervisors Results */}
              {filteredSupervisors.map(sup => (
                <div 
                  key={sup.id}
                  className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{sup.name}</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        مشرف معتمد
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      المناطق: <strong className="text-slate-700">{sup.regions.join('، ')}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700">{sup.teachersCount || 0} خادم تابع</span>
                    {onEditSupervisor && (
                      <button
                        onClick={() => onEditSupervisor(sup)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition text-xs font-bold flex items-center gap-1"
                        title="تعديل المشرف"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Children Results */}
              {filteredChildren.map(child => (
                <div 
                  key={child.id}
                  className="bg-white rounded-2xl p-3.5 border border-emerald-200 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{child.name}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        child.gender === 'ولد' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {child.gender}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        المستوى {child.level}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      الخادم: <strong className="text-slate-800">{child.teacherName}</strong>
                      {child.village && <span> • القرية: {child.village}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onEditChild && (
                      <button
                        onClick={() => onEditChild(child)}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition text-xs font-bold flex items-center gap-1"
                        title="تعديل الطفل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                    )}

                    {child.guardianPhone && (
                      <a
                        href={formatCallUrl(child.guardianPhone)}
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                        title="اتصال بولي الأمر"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
