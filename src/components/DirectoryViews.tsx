import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Baby, 
  Plus, 
  Search, 
  Download,
  Edit3
} from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import { TeacherCard } from './TeacherCard';
import { SupervisorCard } from './SupervisorCard';
import { ChildCard } from './ChildCard';
import { exportTeachersToCSV } from '../utils/storage';

// -------------------------------------------------------------
// TEACHERS DIRECTORY VIEW
// -------------------------------------------------------------
interface TeachersViewProps {
  teachers: TeacherRecord[];
  onDeleteTeacher: (id: string) => void;
  onEditTeacher: (teacher: TeacherRecord) => void;
  onOpenChildren: (teacher: TeacherRecord) => void;
  onUpdateCounts: (id: string, b: number, g: number) => void;
  onOpenAddModal: () => void;
  initialRegionFilter?: string;
  initialSupervisorFilter?: string;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  onDeleteTeacher,
  onEditTeacher,
  onOpenChildren,
  onUpdateCounts,
  onOpenAddModal,
  initialRegionFilter = '',
  initialSupervisorFilter = ''
}) => {
  const [filterRegion, setFilterRegion] = useState(initialRegionFilter);
  const [filterSupervisor, setFilterSupervisor] = useState(initialSupervisorFilter);
  const [filterDenom, setFilterDenom] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'totalDesc' | 'boysDesc' | 'girlsDesc' | 'nameAsc'>('default');

  const regions = useMemo(() => Array.from(new Set(teachers.map(t => t.region))).filter(Boolean).sort(), [teachers]);
  const supervisors = useMemo(() => Array.from(new Set(teachers.map(t => t.supervisor))).filter(Boolean).sort(), [teachers]);

  const filtered = useMemo(() => {
    return teachers.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const m = 
          t.teacherName.toLowerCase().includes(q) ||
          t.village.toLowerCase().includes(q) ||
          t.supervisor.toLowerCase().includes(q) ||
          t.priestOrPastor.toLowerCase().includes(q) ||
          t.phone.includes(q);
        if (!m) return false;
      }
      if (filterRegion && t.region !== filterRegion) return false;
      if (filterSupervisor && t.supervisor !== filterSupervisor) return false;
      if (filterDenom && t.denomination !== filterDenom) return false;
      if (filterLevel && t.level !== filterLevel) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'totalDesc') return b.totalChildren - a.totalChildren;
      if (sortBy === 'boysDesc') return b.boysCount - a.boysCount;
      if (sortBy === 'girlsDesc') return b.girlsCount - a.girlsCount;
      if (sortBy === 'nameAsc') return a.teacherName.localeCompare(b.teacherName, 'ar');
      return 0;
    });
  }, [teachers, searchQuery, filterRegion, filterSupervisor, filterDenom, filterLevel, sortBy]);

  return (
    <div className="space-y-4 pb-8">
      {/* Top Controls Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>دليل الخدام والمعلمين ({filtered.length} من أصل {teachers.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              استعراض وتعديل بيانات فصول الخدمة والاطلاع على كشف الأطفال والاتصال المباشر
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTeachersToCSV(filtered)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير ({filtered.length})</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ إدخال خادم جديد</span>
            </button>
          </div>
        </div>

        {/* Search & Quick Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، القرية، الكاهن، رقم الموبايل..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Region filter */}
          <div>
            <select
              value={filterRegion}
              onChange={e => setFilterRegion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">كل المناطق ({regions.length})</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Supervisor filter */}
          <div>
            <select
              value={filterSupervisor}
              onChange={e => setFilterSupervisor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">كل المشرفين ({supervisors.length})</option>
              {supervisors.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-indigo-900 focus:outline-hidden"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="totalDesc">الأكثر أطفالاً</option>
              <option value="boysDesc">الأكثر أولاداً</option>
              <option value="girlsDesc">الأكثر بناتاً</option>
              <option value="nameAsc">أبجدياً (أ-ي)</option>
            </select>
          </div>
        </div>

        {/* Clear filters shortcut */}
        {(searchQuery || filterRegion || filterSupervisor || filterDenom || filterLevel) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>نتائج البحث: <strong>{filtered.length} خادم</strong></span>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterRegion('');
                setFilterSupervisor('');
                setFilterDenom('');
                setFilterLevel('');
              }}
              className="text-rose-600 font-bold hover:underline"
            >
              مسح الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Teachers Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-600 mb-2">لا يوجد خدام مطابقون لهذا التحديد</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRegion('');
              setFilterSupervisor('');
            }}
            className="text-xs text-indigo-600 font-bold underline"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map(teacher => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onDelete={onDeleteTeacher}
              onEdit={onEditTeacher}
              onOpenChildren={onOpenChildren}
              onUpdateCounts={onUpdateCounts}
            />
          ))}
        </div>
      )}
    </div>
  );
};


// -------------------------------------------------------------
// SUPERVISORS DIRECTORY VIEW
// -------------------------------------------------------------
interface SupervisorsViewProps {
  supervisors: SupervisorRecord[];
  teachers: TeacherRecord[];
  onOpenAddModal: () => void;
  onFilterBySupervisor: (name: string) => void;
  onAddTeacherToSupervisor: (supName: string) => void;
  onEditSupervisor: (supervisor: SupervisorRecord) => void;
  onViewSupervisorDossier: (supervisor: SupervisorRecord) => void;
}

export const SupervisorsView: React.FC<SupervisorsViewProps> = ({
  supervisors,
  teachers,
  onOpenAddModal,
  onFilterBySupervisor,
  onAddTeacherToSupervisor,
  onEditSupervisor,
  onViewSupervisorDossier
}) => {
  const [supSearch, setSupSearch] = useState('');

  const filtered = useMemo(() => {
    if (!supSearch) return supervisors;
    const q = supSearch.toLowerCase();
    return supervisors.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.regions.some(r => r.toLowerCase().includes(q))
    );
  }, [supervisors, supSearch]);

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-600" />
            <span>المشرفون العامون ({filtered.length} مشرف معتمد)</span>
          </h2>
          <p className="text-xs text-slate-500">
            متابعة وتعديل بيانات المشرفين على المراكز والخدام مع إمكانية عرض كشف الخدام والطباعة
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-amber-600/20 transition flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة مشرف جديد</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={supSearch}
          onChange={e => setSupSearch(e.target.value)}
          placeholder="ابحث باسم المشرف أو منطقته..."
          className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
      </div>

      {/* Supervisors Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(sup => {
          const supTeachers = teachers.filter(t => t.supervisor.trim() === sup.name.trim());
          return (
            <div key={sup.id} className="relative">
              <SupervisorCard
                supervisor={sup}
                teachersUnderSup={supTeachers}
                onFilterBySupervisor={onFilterBySupervisor}
                onAddTeacherToSupervisor={onAddTeacherToSupervisor}
                onEdit={onEditSupervisor}
              />
              <div className="mt-2 px-1">
                <button
                  onClick={() => onViewSupervisorDossier(sup)}
                  className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 border border-slate-200"
                >
                  <span>كشف خدام المشرف المنظم ({supTeachers.length}) وقابل للطباعة</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// -------------------------------------------------------------
// CHILDREN DIRECTORY VIEW
// -------------------------------------------------------------
interface ChildrenViewProps {
  children: ChildRecord[];
  onOpenAddModal: () => void;
  onDeleteChild: (id: string) => void;
  onEditChild: (child: ChildRecord) => void;
  onUpdateAttendance: (id: string, delta: number) => void;
}

export const ChildrenView: React.FC<ChildrenViewProps> = ({
  children,
  onOpenAddModal,
  onDeleteChild,
  onEditChild,
  onUpdateAttendance
}) => {
  const [childSearch, setChildSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'ولد' | 'بنت'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'الاول' | 'الثاني'>('all');

  const [visibleLimit, setVisibleLimit] = useState(60);

  const filtered = useMemo(() => {
    return children.filter(c => {
      if (childSearch) {
        const q = childSearch.toLowerCase();
        const m = 
          c.name.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q) ||
          (c.village && c.village.toLowerCase().includes(q)) ||
          (c.guardianPhone && c.guardianPhone.includes(q)) ||
          (c.grade && c.grade.toLowerCase().includes(q));
        if (!m) return false;
      }
      if (genderFilter !== 'all' && c.gender !== genderFilter) return false;
      if (levelFilter !== 'all' && c.level !== levelFilter) return false;
      return true;
    });
  }, [children, childSearch, genderFilter, levelFilter]);

  const displayedChildren = useMemo(() => {
    return filtered.slice(0, visibleLimit);
  }, [filtered, visibleLimit]);

  const boysCount = children.filter(c => c.gender === 'ولد').length;
  const girlsCount = children.filter(c => c.gender === 'بنت').length;

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Baby className="w-5 h-5 text-emerald-600" />
            <span>سجل الأطفال المسجلين والمخدومين ({children.length} طفل)</span>
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-semibold">
            <span className="text-blue-700">👦 {boysCount} أولاد</span>
            <span>•</span>
            <span className="text-rose-600">👧 {girlsCount} بنات</span>
            <span>•</span>
            <span>متابعة وتعديل بيانات الأطفال والافتقاد</span>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ تسجيل طفل جديد</span>
        </button>
      </div>

      {/* Filter Chips & Search */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 space-y-2">
        <div className="relative">
          <input
            type="text"
            value={childSearch}
            onChange={e => {
              setChildSearch(e.target.value);
              setVisibleLimit(60);
            }}
            placeholder="ابحث باسم الطفل، المعلم، الصف الدراسي، القرية..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold">تصفية:</span>
          {/* Gender */}
          <button
            onClick={() => { setGenderFilter('all'); setVisibleLimit(60); }}
            className={`px-2.5 py-1 rounded-lg font-bold ${genderFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            الكل
          </button>
          <button
            onClick={() => { setGenderFilter('ولد'); setVisibleLimit(60); }}
            className={`px-2.5 py-1 rounded-lg font-bold ${genderFilter === 'ولد' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'}`}
          >
            الأولاد فقط 👦
          </button>
          <button
            onClick={() => { setGenderFilter('بنت'); setVisibleLimit(60); }}
            className={`px-2.5 py-1 rounded-lg font-bold ${genderFilter === 'بنت' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-800'}`}
          >
            البنات فقط 👧
          </button>

          <span className="text-slate-300">|</span>

          {/* Level */}
          <button
            onClick={() => { setLevelFilter(levelFilter === 'الاول' ? 'all' : 'الاول'); setVisibleLimit(60); }}
            className={`px-2.5 py-1 rounded-lg font-bold ${levelFilter === 'الاول' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            المستوى الأول
          </button>
          <button
            onClick={() => { setLevelFilter(levelFilter === 'الثاني' ? 'all' : 'الثاني'); setVisibleLimit(60); }}
            className={`px-2.5 py-1 rounded-lg font-bold ${levelFilter === 'الثاني' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            المستوى الثاني
          </button>
        </div>
      </div>

      {/* Children Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
          <Baby className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">لا يوجد أطفال مطابقون للبحث</p>
          <p className="text-xs text-slate-400 mt-1">يمكنك تسجيل طفل جديد في أي فصل بضغطة زر</p>
          <button
            onClick={onOpenAddModal}
            className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            + تسجيل طفل جديد
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayedChildren.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                onDelete={onDeleteChild}
                onEdit={onEditChild}
                onUpdateAttendance={onUpdateAttendance}
              />
            ))}
          </div>

          {filtered.length > visibleLimit && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleLimit(prev => prev + 60)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-6 py-2.5 rounded-2xl shadow-md transition active:scale-95"
              >
                عرض المزيد (يُعرض حالياً {displayedChildren.length} من أصل {filtered.length} طفل)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
