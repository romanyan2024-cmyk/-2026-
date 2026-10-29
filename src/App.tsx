import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredTeachers, 
  saveTeachers, 
  getStoredSupervisors, 
  saveSupervisors, 
  getStoredChildren, 
  saveChildren, 
  getStoredAreaLeaders,
  saveAreaLeaders,
  getAdminPin,
  calculateStats,
  getStoredProjectAccounts,
  saveProjectAccounts
} from './utils/storage';
import { TeacherRecord, SupervisorRecord, ChildRecord, ActiveTab, ProjectAccountsData } from './types';
import { AndroidHeader } from './components/AndroidHeader';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { AndroidFrame } from './components/AndroidFrame';
import { FloatingActionButton } from './components/FloatingActionButton';
import { HomeView } from './components/HomeView';
import { TeachersView, SupervisorsView, ChildrenView } from './components/DirectoryViews';
import { AdminStatsModal } from './components/AdminStatsModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { AddModals } from './components/AddModals';
import { EditModals, EditingTarget } from './components/EditModals';
import { AppLockScreen } from './components/AppLockScreen';
import { ClassChildrenModal } from './components/ClassChildrenModal';
import { SupervisorDetailModal } from './components/SupervisorDetailModal';
import { AdministrativeHierarchyView } from './components/AdministrativeHierarchyView';
import { ProjectAccountsView } from './components/ProjectAccountsView';

export default function App() {
  // App-level lock state (Master PIN 9990 required on first open)
  const [isAppLocked, setIsAppLocked] = useState<boolean>(true);

  const [teachers, setTeachers] = useState<TeacherRecord[]>(() => getStoredTeachers());
  const [supervisors, setSupervisors] = useState<SupervisorRecord[]>(() => getStoredSupervisors());
  const [children, setChildren] = useState<ChildRecord[]>(() => getStoredChildren());
  const [areaLeaders, setAreaLeaders] = useState<Record<string, string>>(() => getStoredAreaLeaders());
  const [adminPin, setAdminPinState] = useState<string>(() => getAdminPin());
  const [accountsData, setAccountsData] = useState<ProjectAccountsData>(() => getStoredProjectAccounts());

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'teacher' | 'supervisor' | 'child'>('teacher');
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);

  // Class Children modal & Supervisor Dossier modal
  const [selectedTeacherForChildren, setSelectedTeacherForChildren] = useState<TeacherRecord | null>(null);
  const [selectedSupervisorForDossier, setSelectedSupervisorForDossier] = useState<SupervisorRecord | null>(null);

  // Directory filter initial state
  const [teacherRegionFilter, setTeacherRegionFilter] = useState('');
  const [teacherSupervisorFilter, setTeacherSupervisorFilter] = useState('');

  // Save to localStorage upon changes
  useEffect(() => {
    saveTeachers(teachers);
  }, [teachers]);

  useEffect(() => {
    saveSupervisors(supervisors);
  }, [supervisors]);

  useEffect(() => {
    saveChildren(children);
  }, [children]);

  useEffect(() => {
    saveAreaLeaders(areaLeaders);
  }, [areaLeaders]);

  useEffect(() => {
    saveProjectAccounts(accountsData);
  }, [accountsData]);

  // Extract distinct lists for forms and filters
  const supervisorsList = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.supervisor) s.add(t.supervisor.trim()); });
    supervisors.forEach(sup => s.add(sup.name.trim()));
    return Array.from(s).filter(Boolean).sort();
  }, [teachers, supervisors]);

  const regionsList = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.region) s.add(t.region.trim()); });
    return Array.from(s).filter(Boolean).sort();
  }, [teachers]);

  const denominationsList = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.denomination) s.add(t.denomination.trim()); });
    return Array.from(s).filter(Boolean).sort();
  }, [teachers]);

  const villagesList = useMemo(() => {
    const s = new Set<string>();
    teachers.forEach(t => { if (t.village) s.add(t.village.trim()); });
    return Array.from(s).filter(Boolean).sort();
  }, [teachers]);

  const teachersNamesList = useMemo(() => {
    return teachers.map(t => t.teacherName).filter(Boolean).sort();
  }, [teachers]);

  // Handlers for Additions
  const handleAddTeacher = (newTeacherData: Omit<TeacherRecord, 'id'>) => {
    const newRecord: TeacherRecord = {
      ...newTeacherData,
      id: `teacher-${Date.now()}`
    };
    setTeachers(prev => [newRecord, ...prev]);
  };

  const handleAddSupervisor = (newSupData: Omit<SupervisorRecord, 'id'>) => {
    const newRecord: SupervisorRecord = {
      ...newSupData,
      id: `sup-${Date.now()}`
    };
    setSupervisors(prev => [newRecord, ...prev]);
  };

  const handleAddChild = (newChildData: Omit<ChildRecord, 'id'>) => {
    const newRecord: ChildRecord = {
      ...newChildData,
      id: `child-${Date.now()}`
    };
    setChildren(prev => [newRecord, ...prev]);
  };

  // Handlers for Edits
  const handleSaveEditedTeacher = (updated: TeacherRecord) => {
    setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
    if (selectedTeacherForChildren && selectedTeacherForChildren.id === updated.id) {
      setSelectedTeacherForChildren(updated);
    }
  };

  const handleSaveEditedSupervisor = (updated: SupervisorRecord) => {
    setSupervisors(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (selectedSupervisorForDossier && selectedSupervisorForDossier.id === updated.id) {
      setSelectedSupervisorForDossier(updated);
    }
  };

  const handleSaveEditedChild = (updated: ChildRecord) => {
    setChildren(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Handlers for Deletions
  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const handleDeleteChild = (id: string) => {
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  // Quick adjust boys and girls count on a class
  const handleUpdateCounts = (id: string, boysDelta: number, girlsDelta: number) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const nextBoys = Math.max(0, t.boysCount + boysDelta);
        const nextGirls = Math.max(0, t.girlsCount + girlsDelta);
        return {
          ...t,
          boysCount: nextBoys,
          girlsCount: nextGirls,
          totalChildren: nextBoys + nextGirls
        };
      }
      return t;
    }));
  };

  // Quick adjust child attendance
  const handleUpdateAttendance = (id: string, delta: number) => {
    setChildren(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          attendanceCount: Math.max(0, (c.attendanceCount || 0) + delta)
        };
      }
      return c;
    }));
  };

  const handlePopulateRoster = (roster: ChildRecord[]) => {
    setChildren(prev => [...roster, ...prev]);
  };

  const handleUpdateAreaLeader = (region: string, leader: string) => {
    setAreaLeaders(prev => ({ ...prev, [region]: leader }));
  };

  const handleOpenAddModalWithType = (type: 'teacher' | 'supervisor' | 'child' = 'teacher') => {
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  const handleDataReset = () => {
    setTeachers(getStoredTeachers());
    setSupervisors(getStoredSupervisors());
    setChildren(getStoredChildren());
    setAreaLeaders(getStoredAreaLeaders());
    setAdminPinState(getAdminPin());
    setAccountsData(getStoredProjectAccounts());
  };

  // Stats calculation
  const stats = useMemo(() => calculateStats(teachers, supervisors, children, areaLeaders), [teachers, supervisors, children, areaLeaders]);
  const totalChildrenCount = stats.totalBoys + stats.totalGirls;

  // If the app is locked, render the Master 9990 Lock Screen
  if (isAppLocked) {
    return (
      <AppLockScreen
        adminPin={adminPin}
        onUnlock={() => {
          setIsAppLocked(false);
          setIsAdminUnlocked(true);
        }}
      />
    );
  }

  return (
    <AndroidFrame
      isPhoneFrame={isPhoneFrame}
      onBack={() => setActiveTab('home')}
      onHome={() => setActiveTab('home')}
    >
      <div className="flex flex-col h-full min-h-screen bg-slate-100 overflow-x-hidden">
        
        {/* Android Top Header */}
        <AndroidHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdminUnlocked={isAdminUnlocked}
          onOpenAdmin={() => setActiveTab('admin')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAddModal={handleOpenAddModalWithType}
          isPhoneFrame={isPhoneFrame}
          setIsPhoneFrame={setIsPhoneFrame}
          totalTeachers={teachers.length}
          totalChildren={totalChildrenCount}
          onLockApp={() => setIsAppLocked(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'home' && (
            <HomeView
              teachers={teachers}
              supervisors={supervisors}
              children={children}
              setActiveTab={setActiveTab}
              onOpenAddModal={handleOpenAddModalWithType}
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenAdmin={() => setActiveTab('admin')}
              onDeleteTeacher={handleDeleteTeacher}
              onEditTeacher={(teacher) => setEditingTarget({ type: 'teacher', data: teacher })}
              onOpenChildren={(teacher) => setSelectedTeacherForChildren(teacher)}
              onUpdateCounts={handleUpdateCounts}
              onSelectRegionFilter={(reg) => {
                setTeacherRegionFilter(reg);
                setActiveTab('teachers');
              }}
            />
          )}

          {activeTab === 'hierarchy' && (
            <AdministrativeHierarchyView
              teachers={teachers}
              supervisors={supervisors}
              children={children}
              areaLeaders={areaLeaders}
              onUpdateAreaLeader={handleUpdateAreaLeader}
              onEditTeacher={(teacher) => setEditingTarget({ type: 'teacher', data: teacher })}
              onEditSupervisor={(supervisor) => setEditingTarget({ type: 'supervisor', data: supervisor })}
              onOpenChildren={(teacher) => setSelectedTeacherForChildren(teacher)}
              onViewSupervisorDossier={(supervisor) => setSelectedSupervisorForDossier(supervisor)}
            />
          )}

          {activeTab === 'teachers' && (
            <TeachersView
              teachers={teachers}
              onDeleteTeacher={handleDeleteTeacher}
              onEditTeacher={(teacher) => setEditingTarget({ type: 'teacher', data: teacher })}
              onOpenChildren={(teacher) => setSelectedTeacherForChildren(teacher)}
              onUpdateCounts={handleUpdateCounts}
              onOpenAddModal={() => handleOpenAddModalWithType('teacher')}
              initialRegionFilter={teacherRegionFilter}
              initialSupervisorFilter={teacherSupervisorFilter}
            />
          )}

          {activeTab === 'supervisors' && (
            <SupervisorsView
              supervisors={supervisors}
              teachers={teachers}
              onOpenAddModal={() => handleOpenAddModalWithType('supervisor')}
              onFilterBySupervisor={(supName) => {
                setTeacherSupervisorFilter(supName);
                setTeacherRegionFilter('');
                setActiveTab('teachers');
              }}
              onAddTeacherToSupervisor={(supName) => {
                handleOpenAddModalWithType('teacher');
              }}
              onEditSupervisor={(supervisor) => setEditingTarget({ type: 'supervisor', data: supervisor })}
              onViewSupervisorDossier={(supervisor) => setSelectedSupervisorForDossier(supervisor)}
            />
          )}

          {activeTab === 'children' && (
            <ChildrenView
              children={children}
              onOpenAddModal={() => handleOpenAddModalWithType('child')}
              onDeleteChild={handleDeleteChild}
              onEditChild={(child) => setEditingTarget({ type: 'child', data: child })}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {activeTab === 'accounts' && (
            <ProjectAccountsView
              accountsData={accountsData}
              onUpdateAccounts={setAccountsData}
              regionsList={regionsList}
              supervisorsList={supervisorsList}
            />
          )}

          {activeTab === 'search' && (
            <div className="py-2">
              <UniversalSearchModal
                isOpen={true}
                onClose={() => setActiveTab('home')}
                teachers={teachers}
                supervisors={supervisors}
                children={children}
                onEditTeacher={(teacher) => setEditingTarget({ type: 'teacher', data: teacher })}
                onEditSupervisor={(supervisor) => setEditingTarget({ type: 'supervisor', data: supervisor })}
                onEditChild={(child) => setEditingTarget({ type: 'child', data: child })}
                onOpenChildren={(teacher) => setSelectedTeacherForChildren(teacher)}
              />
            </div>
          )}

          {activeTab === 'admin' && (
            <AdminStatsModal
              isAdminUnlocked={isAdminUnlocked}
              setIsAdminUnlocked={setIsAdminUnlocked}
              adminPin={adminPin}
              setAdminPinState={setAdminPinState}
              teachers={teachers}
              supervisors={supervisors}
              children={children}
              onDataReset={handleDataReset}
              onClose={() => setActiveTab('home')}
            />
          )}
        </main>

        {/* Android Material Floating Action Button (FAB) */}
        <FloatingActionButton
          onOpenAddModal={handleOpenAddModalWithType}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Android Material Bottom Navigation Bar */}
        <AndroidBottomNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== 'teachers') {
              setTeacherRegionFilter('');
              setTeacherSupervisorFilter('');
            }
            setActiveTab(tab);
          }}
          teachersCount={teachers.length}
          supervisorsCount={supervisors.length}
          childrenCount={children.length}
          isAdminUnlocked={isAdminUnlocked}
        />

        {/* Search Modal (when triggered via button or FAB) */}
        {isSearchOpen && activeTab !== 'search' && (
          <UniversalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            teachers={teachers}
            supervisors={supervisors}
            children={children}
            onEditTeacher={(teacher) => setEditingTarget({ type: 'teacher', data: teacher })}
            onEditSupervisor={(supervisor) => setEditingTarget({ type: 'supervisor', data: supervisor })}
            onEditChild={(child) => setEditingTarget({ type: 'child', data: child })}
            onOpenChildren={(teacher) => setSelectedTeacherForChildren(teacher)}
          />
        )}

        {/* Add Entry Modal (for Teacher, Supervisor, or Child) */}
        {isAddModalOpen && (
          <AddModals
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            defaultType={addModalType}
            supervisorsList={supervisorsList}
            regionsList={regionsList}
            denominationsList={denominationsList}
            villagesList={villagesList}
            teachersList={teachersNamesList}
            onAddTeacher={handleAddTeacher}
            onAddSupervisor={handleAddSupervisor}
            onAddChild={handleAddChild}
          />
        )}

        {/* Universal Edit Modal (for editing ANY category: Teacher, Supervisor, or Child) */}
        {editingTarget && (
          <EditModals
            editingTarget={editingTarget}
            onClose={() => setEditingTarget(null)}
            supervisorsList={supervisorsList}
            regionsList={regionsList}
            denominationsList={denominationsList}
            teachersList={teachersNamesList}
            onSaveTeacher={handleSaveEditedTeacher}
            onSaveSupervisor={handleSaveEditedSupervisor}
            onSaveChild={handleSaveEditedChild}
          />
        )}

        {/* Class Children Modal (Opened via "أطفال" button on any teacher) */}
        {selectedTeacherForChildren && (
          <ClassChildrenModal
            teacher={selectedTeacherForChildren}
            children={children}
            onClose={() => setSelectedTeacherForChildren(null)}
            onAddChild={handleAddChild}
            onEditChild={(child) => setEditingTarget({ type: 'child', data: child })}
            onDeleteChild={handleDeleteChild}
            onUpdateAttendance={handleUpdateAttendance}
            onPopulateRoster={handlePopulateRoster}
          />
        )}

        {/* Supervisor Dossier Modal (Opened via "كشف خدام المشرف" with print support) */}
        {selectedSupervisorForDossier && (
          <SupervisorDetailModal
            supervisor={selectedSupervisorForDossier}
            teachersUnderSup={teachers.filter(t => t.supervisor.trim() === selectedSupervisorForDossier.name.trim())}
            onClose={() => setSelectedSupervisorForDossier(null)}
            onEditTeacher={(teacher) => setEditingTarget({ type: 'teacher', data: teacher })}
            onOpenChildren={(teacher) => setSelectedTeacherForChildren(teacher)}
          />
        )}
      </div>
    </AndroidFrame>
  );
}
