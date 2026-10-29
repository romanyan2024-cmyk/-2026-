import React from 'react';
import { 
  Users, 
  UserCheck, 
  Baby, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  School, 
  Download, 
  Crown, 
  Edit3,
  Network,
  Wallet
} from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord, ActiveTab } from '../types';
import { calculateStats, exportTeachersToCSV } from '../utils/storage';
import { TeacherCard } from './TeacherCard';

interface HomeViewProps {
  teachers: TeacherRecord[];
  supervisors: SupervisorRecord[];
  children: ChildRecord[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: (type?: 'teacher' | 'supervisor' | 'child') => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onDeleteTeacher: (id: string) => void;
  onEditTeacher: (teacher: TeacherRecord) => void;
  onOpenChildren: (teacher: TeacherRecord) => void;
  onUpdateCounts: (id: string, boysDelta: number, girlsDelta: number) => void;
  onSelectRegionFilter: (reg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  teachers,
  supervisors,
  children,
  setActiveTab,
  onOpenAddModal,
  onOpenSearch,
  onOpenAdmin,
  onDeleteTeacher,
  onEditTeacher,
  onOpenChildren,
  onUpdateCounts,
  onSelectRegionFilter
}) => {
  const stats = calculateStats(teachers, supervisors, children);
  const totalChildren = stats.totalBoys + stats.totalGirls;

  return (
    <div className="space-y-5 pb-8">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              تطبيق إدارة صناع القادة
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('hierarchy')}
                className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                title="عرض الترتيب الإداري للمناطق والمشرفين"
              >
                <Network className="w-3.5 h-3.5" />
                <span>الهيكل الإداري</span>
              </button>

              <button
                onClick={() => exportTeachersToCSV(teachers)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 border border-white/10"
                title="تصدير الشيت كاملاً"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>
            </div>
          </div>

          {/* Requested Welcome Message & Romany Adly */}
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              أهلاً بيكم في تطبيق صناع القادة
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg sm:text-xl font-extrabold text-amber-300 flex items-center gap-1.5 drop-shadow-sm">
                <Crown className="w-5 h-5 text-amber-400" />
                Romany Adly
              </span>
              <span className="text-[11px] text-slate-300 font-semibold bg-indigo-900/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                المسؤول العام والإشراف
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-xl leading-relaxed mt-2">
              منظومة رقمية شاملة لإدارة بيانات {stats.totalTeachers} معلماً وخادماً و {totalChildren} مخدوماً ومتابعة قادة المناطق والمشرفين والخدام والبحث وكشوف الأطفال القابلة للطباعة.
            </p>
          </div>

          {/* 4 Grand Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-indigo-200 font-bold block">إجمالي الأطفال</span>
              <span className="text-xl sm:text-2xl font-black text-white">{totalChildren.toLocaleString('ar-EG')}</span>
              <span className="text-[10px] text-slate-300 block font-semibold">👦 {stats.totalBoys} • 👧 {stats.totalGirls}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-indigo-200 font-bold block">إجمالي الخدام والمعلمين</span>
              <span className="text-xl sm:text-2xl font-black text-white">{stats.totalTeachers}</span>
              <span className="text-[10px] text-emerald-300 block font-semibold">{stats.totalClassesSum} فصول مسجلة</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-indigo-200 font-bold block">المشرفين المعتمدين</span>
              <span className="text-xl sm:text-2xl font-black text-white">{stats.totalSupervisors}</span>
              <span className="text-[10px] text-amber-300 block font-semibold">مشرف عام</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <span className="text-[10px] text-indigo-200 font-bold block">المناطق والمراكز</span>
              <span className="text-xl sm:text-2xl font-black text-white">{stats.regions.length}</span>
              <span className="text-[10px] text-indigo-300 block font-semibold">{stats.topVillages.length}+ قرية مخدومة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Action Buttons Requested by User */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>إجراءات الإدخال والبحث والترتيب الإداري</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">صناع القادة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
          {/* 1. Add Teacher Button */}
          <button
            onClick={() => onOpenAddModal('teacher')}
            className="bg-white hover:bg-indigo-50/70 p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-400 transition-all text-right flex flex-col justify-between group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 group-hover:text-indigo-900 block">
                + إدخال خادم
              </span>
              <span className="text-[10px] text-slate-500">فصل وأعداد</span>
            </div>
          </button>

          {/* 2. Add Supervisor Button */}
          <button
            onClick={() => onOpenAddModal('supervisor')}
            className="bg-white hover:bg-amber-50/70 p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-400 transition-all text-right flex flex-col justify-between group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 group-hover:text-amber-900 block">
                + إدخال مشرف
              </span>
              <span className="text-[10px] text-slate-500">المناطق الموكلة</span>
            </div>
          </button>

          {/* 3. Add Child Button */}
          <button
            onClick={() => onOpenAddModal('child')}
            className="bg-white hover:bg-emerald-50/70 p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-400 transition-all text-right flex flex-col justify-between group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 group-hover:text-emerald-900 block">
                + تسجيل طفل
              </span>
              <span className="text-[10px] text-slate-500">حضور وولي أمر</span>
            </div>
          </button>

          {/* 4. Administrative Hierarchy Button */}
          <button
            onClick={() => setActiveTab('hierarchy')}
            className="bg-white hover:bg-amber-50/70 p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-400 transition-all text-right flex flex-col justify-between group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 group-hover:text-amber-950 block">
                الهيكل الإداري
              </span>
              <span className="text-[10px] text-slate-500">قائد ومنطقة ومشرف</span>
            </div>
          </button>

          {/* 5. Project Accounts Button (New) */}
          <button
            onClick={() => setActiveTab('accounts')}
            className="bg-white hover:bg-emerald-50/70 p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-400 transition-all text-right flex flex-col justify-between group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 group-hover:text-emerald-950 block">
                حسابات المشروع
              </span>
              <span className="text-[10px] text-slate-500">المنصرف والعهدة</span>
            </div>
          </button>

          {/* 6. Search Any Category Button */}
          <button
            onClick={onOpenSearch}
            className="bg-white hover:bg-blue-50/70 p-3.5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 transition-all text-right flex flex-col justify-between group active:scale-98"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 group-hover:text-blue-900 block">
                🔍 بحث الفئات
              </span>
              <span className="text-[10px] text-slate-500">اسم وقرية وكاهن</span>
            </div>
          </button>

          {/* 7. Master Admin & Stats Button */}
          <button
            onClick={onOpenAdmin}
            className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 rounded-2xl border border-indigo-700/60 shadow-md hover:shadow-lg transition-all text-right flex flex-col justify-between group active:scale-98 col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center mb-2 font-black group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block flex items-center justify-between">
                <span>الأدمن العام</span>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded font-bold">محمي</span>
              </span>
              <span className="text-[10px] text-indigo-200">إحصائيات شاملة</span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Filter by Region Chips */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>تصفح حسب المنطقة ({stats.regions.length} مناطق):</span>
          </h3>
          <button 
            onClick={() => setActiveTab('teachers')}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
          >
            عرض الكل
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {stats.regions.map((reg, idx) => (
            <button
              key={idx}
              onClick={() => onSelectRegionFilter(reg.region)}
              className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>{reg.region}</span>
              <span className="text-[10px] bg-slate-100 text-indigo-700 font-black px-1.5 py-0.2 rounded-md">
                {reg.teachersCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured / Sample Classes List with Edit, Children, and Delete */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <School className="w-4 h-4 text-indigo-600" />
            <span>قائمة الخدام والمعلمين المسجلين (عينة مباشرة)</span>
          </h3>
          <button
            onClick={() => setActiveTab('teachers')}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>عرض جميع الخدام ({teachers.length})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {teachers.slice(0, 6).map((teacher) => (
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
      </div>
    </div>
  );
};
