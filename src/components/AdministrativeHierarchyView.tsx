import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Crown, 
  UserCheck, 
  Users, 
  Baby, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Edit3, 
  Phone, 
  Church, 
  Award,
  Sparkles,
  Download
} from 'lucide-react';
import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import { formatCallUrl, formatWhatsAppUrl } from '../utils/formatters';

interface AdministrativeHierarchyViewProps {
  teachers: TeacherRecord[];
  supervisors: SupervisorRecord[];
  children: ChildRecord[];
  areaLeaders: Record<string, string>;
  onUpdateAreaLeader: (region: string, newLeaderName: string) => void;
  onUpdateSupervisorAreaLeader?: (supervisorId: string, newLeaderName: string) => void;
  onEditTeacher: (t: TeacherRecord) => void;
  onEditSupervisor: (s: SupervisorRecord) => void;
  onOpenChildren: (t: TeacherRecord) => void;
  onViewSupervisorDossier: (s: SupervisorRecord) => void;
}

export const AdministrativeHierarchyView: React.FC<AdministrativeHierarchyViewProps> = ({
  teachers,
  supervisors,
  children,
  areaLeaders,
  onUpdateAreaLeader,
  onUpdateSupervisorAreaLeader,
  onEditTeacher,
  onEditSupervisor,
  onOpenChildren,
  onViewSupervisorDossier
}) => {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [editingRegionLeader, setEditingRegionLeader] = useState<string | null>(null);
  const [leaderInput, setLeaderInput] = useState('');
  const [editingSupervisorId, setEditingSupervisorId] = useState<string | null>(null);
  const [supervisorLeaderInput, setSupervisorLeaderInput] = useState('');
  const [collapsedRegions, setCollapsedRegions] = useState<Record<string, boolean>>({});

  // Group by region
  const regionsList = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.region) s.add(t.region); });
    return Array.from(s).sort();
  }, [teachers]);

  const toggleRegionCollapse = (r: string) => {
    setCollapsedRegions(prev => ({ ...prev, [r]: !prev[r] }));
  };

  const handleStartEditLeader = (region: string, currentLeader: string) => {
    setEditingRegionLeader(region);
    setLeaderInput(currentLeader || 'Romany Adly');
  };

  const handleSaveLeader = (region: string) => {
    if (leaderInput.trim()) {
      onUpdateAreaLeader(region, leaderInput.trim());
    }
    setEditingRegionLeader(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredRegions = selectedRegionFilter === 'all' 
    ? regionsList 
    : regionsList.filter(r => r === selectedRegionFilter);

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  الترتيب الإداري لمسؤولي المناطق
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  الهيكل الإداري
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                توزيع إداري منظم: <strong>قائد المنطقة ➔ المشرفين المعتمدين ➔ الخدام التابعين لكل مشرف</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition border border-slate-700 flex items-center gap-1.5 shadow-sm active:scale-95"
              title="طباعة كشف الهيكل الإداري"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>طباعة الهيكل الإداري</span>
            </button>
          </div>
        </div>

        {/* Region Filter Selector */}
        <div className="mt-4 pt-4 border-t border-indigo-900/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-indigo-200 font-bold shrink-0">تصفية حسب المنطقة:</span>
          <button
            onClick={() => setSelectedRegionFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedRegionFilter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            كافة المناطق ({regionsList.length})
          </button>
          {regionsList.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegionFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedRegionFilter === r
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Official Print Header */}
      <div className="hidden print:block p-6 text-center border-b-2 border-slate-900">
        <h1 className="text-2xl font-black text-black mb-1">
          تطبيق إدارة صناع القادة • إشراف: Romany Adly
        </h1>
        <h2 className="text-lg font-bold text-slate-800 mb-1">
          كشف الهيكل والترتيب الإداري للمناطق والمشرفين والخدام
        </h2>
        <p className="text-xs text-slate-600">
          تاريخ الاعتماد: {new Date().toLocaleDateString('ar-EG')}
        </p>
      </div>

      {/* Region Hierarchy Blocks */}
      <div className="space-y-4">
        {filteredRegions.map((regionName) => {
          const leaderName = areaLeaders[regionName] || 'Romany Adly';
          const isCollapsed = collapsedRegions[regionName];

          // Teachers in this region
          const regionTeachers = teachers.filter(t => t.region === regionName);
          const regionTotalBoys = regionTeachers.reduce((acc, t) => acc + t.boysCount, 0);
          const regionTotalGirls = regionTeachers.reduce((acc, t) => acc + t.girlsCount, 0);
          const regionTotalChildren = regionTotalBoys + regionTotalGirls;

          // Supervisors who have teachers in this region
          const regionSupervisorsMap = new Map<string, TeacherRecord[]>();
          regionTeachers.forEach(t => {
            const sName = t.supervisor.trim();
            if (!regionSupervisorsMap.has(sName)) {
              regionSupervisorsMap.set(sName, []);
            }
            regionSupervisorsMap.get(sName)!.push(t);
          });

          return (
            <div 
              key={regionName}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden transition-all hover:border-indigo-300"
            >
              {/* Region Level Header: Area Leader & Regional Stats */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/60 border border-indigo-400/40 text-amber-300 flex items-center justify-center font-bold shadow-md shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-black text-white">
                          منطقة: {regionName}
                        </h3>
                        <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-700">
                          {regionTeachers.length} خادم
                        </span>
                      </div>

                      {/* Area Leader Box */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-300 font-bold">قائد المنطقة:</span>
                        {editingRegionLeader === regionName ? (
                          <div className="flex items-center gap-1.5 no-print">
                            <input
                              type="text"
                              value={leaderInput}
                              onChange={e => setLeaderInput(e.target.value)}
                              className="bg-slate-950 border border-amber-400 text-amber-300 text-xs px-2.5 py-1 rounded-lg font-bold focus:outline-hidden"
                            />
                            <button
                              onClick={() => handleSaveLeader(regionName)}
                              className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => setEditingRegionLeader(null)}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-black text-amber-300 bg-amber-950/70 border border-amber-400/40 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                              {leaderName}
                            </span>
                            <button
                              onClick={() => handleStartEditLeader(regionName, leaderName)}
                              className="text-slate-400 hover:text-amber-300 p-1 no-print"
                              title="تعديل قائد المنطقة"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Region Summary Badges */}
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="bg-indigo-900/80 px-2.5 py-1 rounded-xl text-indigo-200 border border-indigo-700/50">
                      المشرفين: {regionSupervisorsMap.size}
                    </span>
                    <span className="bg-blue-950 text-blue-300 px-2.5 py-1 rounded-xl border border-blue-800/60">
                      👦 {regionTotalBoys}
                    </span>
                    <span className="bg-rose-950 text-rose-300 px-2.5 py-1 rounded-xl border border-rose-800/60">
                      👧 {regionTotalGirls}
                    </span>
                    <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-xl font-black">
                      {regionTotalChildren} طفل
                    </span>

                    <button
                      onClick={() => toggleRegionCollapse(regionName)}
                      className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition no-print"
                      title={isCollapsed ? "عرض التفاصيل" : "طي التفاصيل"}
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-tier: Supervisors & Their Teachers */}
              {!isCollapsed && (
                <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50">
                  {Array.from(regionSupervisorsMap.entries()).map(([supName, supTeachers], supIdx) => {
                    const supRecord = supervisors.find(s => s.name.trim() === supName);
                    const supBoys = supTeachers.reduce((acc, t) => acc + t.boysCount, 0);
                    const supGirls = supTeachers.reduce((acc, t) => acc + t.girlsCount, 0);
                    const supTotal = supBoys + supGirls;
                    const supLeader = supRecord?.areaLeader || (supTeachers.find(t => t.areaLeader)?.areaLeader) || leaderName;

                    return (
                      <div 
                        key={supIdx}
                        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs"
                      >
                        {/* Supervisor Tier Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 border border-amber-300 flex items-center justify-center font-bold">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-900">
                                  المشرف: {supName}
                                </h4>
                                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-bold">
                                  {supTeachers.length} خادم بالمنطقة
                                </span>
                              </div>
                              
                              {/* Supervisor Area Leader Display & Inline Edit */}
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[11px] text-slate-500 font-bold">قائد المنطقة:</span>
                                {editingSupervisorId === supRecord?.id ? (
                                  <div className="flex items-center gap-1 no-print">
                                    <input
                                      type="text"
                                      value={supervisorLeaderInput}
                                      onChange={e => setSupervisorLeaderInput(e.target.value)}
                                      className="text-xs bg-slate-900 border border-amber-400 text-amber-300 font-bold px-2 py-0.5 rounded-lg focus:outline-hidden"
                                      list="area-leaders-suggest"
                                    />
                                    <datalist id="area-leaders-suggest">
                                      <option value="أ/ يوسف حنا" />
                                      <option value="أ/ عماد لندي" />
                                      <option value="أ/ لابان وليم" />
                                      <option value="أ/ شحاته عياد" />
                                      <option value="أ/ شكري فرج" />
                                      <option value="Romany Adly" />
                                    </datalist>
                                    <button
                                      onClick={() => {
                                        if (supRecord && supervisorLeaderInput.trim() && onUpdateSupervisorAreaLeader) {
                                          onUpdateSupervisorAreaLeader(supRecord.id, supervisorLeaderInput.trim());
                                        }
                                        setEditingSupervisorId(null);
                                      }}
                                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded"
                                    >
                                      حفظ
                                    </button>
                                    <button
                                      onClick={() => setEditingSupervisorId(null)}
                                      className="text-[10px] text-slate-400 hover:text-slate-600 px-1"
                                    >
                                      إلغاء
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <strong className="text-amber-900 font-black text-xs bg-amber-50 border border-amber-300/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                      <Crown className="w-3 h-3 text-amber-600" />
                                      {supLeader}
                                    </strong>
                                    {supRecord && (
                                      <button
                                        onClick={() => {
                                          setEditingSupervisorId(supRecord.id);
                                          setSupervisorLeaderInput(supLeader);
                                        }}
                                        className="text-slate-400 hover:text-amber-700 p-0.5 rounded transition no-print"
                                        title={`تغيير قائد المنطقة للمشرف ${supName}`}
                                      >
                                        <Edit3 className="w-3 h-3 text-amber-600" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                              👦 {supBoys}
                            </span>
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                              👧 {supGirls}
                            </span>
                            <span className="text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 font-black">
                              الإجمالي: {supTotal} طفل
                            </span>

                            {supRecord && (
                              <>
                                <button
                                  onClick={() => onEditSupervisor(supRecord)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-2 py-1 rounded-lg transition no-print border border-slate-200 flex items-center gap-1"
                                  title="تعديل بيانات المشرف وقائده"
                                >
                                  <Edit3 className="w-3 h-3 text-amber-700" />
                                  <span>تعديل</span>
                                </button>
                                <button
                                  onClick={() => onViewSupervisorDossier(supRecord)}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition no-print shadow-xs"
                                >
                                  كشف الخدام
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Teachers Table under this Supervisor */}
                        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-100">
                          <table className="w-full text-right text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                              <tr>
                                <th className="p-2.5 text-center w-8">#</th>
                                <th className="p-2.5">اسم الخادم / المدرس</th>
                                <th className="p-2.5">القرية</th>
                                <th className="p-2.5">الكاهن / الراعي</th>
                                <th className="p-2.5">الطائفة</th>
                                <th className="p-2.5 text-center">المستوى</th>
                                <th className="p-2.5 text-center text-blue-700">أولاد</th>
                                <th className="p-2.5 text-center text-rose-700">بنات</th>
                                <th className="p-2.5 text-center font-black text-indigo-900">الإجمالي</th>
                                <th className="p-2.5 text-center no-print">أطفال الفصل</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {supTeachers.map((t, tIdx) => (
                                <tr key={t.id} className="hover:bg-slate-50 transition">
                                  <td className="p-2.5 text-center text-slate-400 font-bold">{tIdx + 1}</td>
                                  <td className="p-2.5 font-bold text-slate-900">
                                    <div className="flex items-center gap-1.5">
                                      <span>{t.teacherName}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono block">{t.formattedPhone}</span>
                                  </td>
                                  <td className="p-2.5 text-slate-700 font-semibold">{t.village}</td>
                                  <td className="p-2.5 text-slate-600">{t.priestOrPastor || 'لا يوجد'}</td>
                                  <td className="p-2.5 text-slate-700">
                                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                                      {t.denomination}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-center font-bold">{t.level}</td>
                                  <td className="p-2.5 text-center font-bold text-blue-700">{t.boysCount}</td>
                                  <td className="p-2.5 text-center font-bold text-rose-700">{t.girlsCount}</td>
                                  <td className="p-2.5 text-center font-black text-indigo-700">{t.totalChildren}</td>
                                  <td className="p-2.5 text-center no-print">
                                    <div className="flex items-center justify-center gap-1">
                                      {/* Children Button */}
                                      <button
                                        onClick={() => onOpenChildren(t)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-xs transition active:scale-95 flex items-center gap-1"
                                        title="عرض أطفال الفصل"
                                      >
                                        <Baby className="w-3 h-3" />
                                        <span>أطفال ({t.totalChildren})</span>
                                      </button>

                                      {/* Edit Button */}
                                      <button
                                        onClick={() => onEditTeacher(t)}
                                        className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                                        title="تعديل بيانات الخادم"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
