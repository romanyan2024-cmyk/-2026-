import { TeacherRecord, SupervisorRecord, ChildRecord, AreaLeaderRecord } from '../types';
import { initialTeachers, initialSupervisors, initialChildren, extractSupervisors } from '../data/initialData';
import { ProjectAccountsData } from '../types/accounts';
import { initialProjectAccounts } from '../data/initialAccountsData';

const TEACHERS_KEY = 'app_leaders_makers_teachers_v5';
const SUPERVISORS_KEY = 'app_leaders_makers_supervisors_v5';
const CHILDREN_KEY = 'app_leaders_makers_children_v5';
const ADMIN_PIN_KEY = 'app_leaders_makers_admin_pin_v5';
const AREA_LEADERS_KEY = 'app_leaders_makers_area_leaders_v5';
const APP_UNLOCKED_SESSION_KEY = 'app_leaders_makers_unlocked_session_v5';
const PROJECT_ACCOUNTS_KEY = 'app_leaders_makers_project_accounts_v1';

export const DEFAULT_PIN = '9990';

export const initialAreaLeaders: Record<string, string> = {
  'بني مزار ومغاغة': 'أ/ يوسف حنا',
  'الفشن وببا وسمسطا': 'أ/ عماد لندي',
  'ملوي': 'أ/ لابان وليم',
  'ابوقرقاص': 'أ/ شحاته عياد',
  'سمالوط': 'أ/ شكري فرج',
  'المنيا': 'أ/ شكري فرج',
  'ودير مواس': 'أ/ لابان وليم',
  'دير مواس': 'أ/ لابان وليم'
};

export function getStoredTeachers(): TeacherRecord[] {
  try {
    const raw = localStorage.getItem(TEACHERS_KEY);
    if (!raw) {
      localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
      return initialTeachers;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === initialTeachers.length) {
      return parsed;
    }
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
    return initialTeachers;
  } catch (err) {
    console.error('Error loading teachers:', err);
    return initialTeachers;
  }
}

export function saveTeachers(teachers: TeacherRecord[]): void {
  try {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  } catch (err) {
    console.error('Error saving teachers:', err);
  }
}

export function getStoredSupervisors(): SupervisorRecord[] {
  try {
    const raw = localStorage.getItem(SUPERVISORS_KEY);
    if (!raw) {
      localStorage.setItem(SUPERVISORS_KEY, JSON.stringify(initialSupervisors));
      return initialSupervisors;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map(s => {
        if (!s.areaLeader) {
          const matchingInit = initialSupervisors.find(is => is.id === s.id || is.name.trim() === s.name.trim());
          const fallbackLeader = matchingInit?.areaLeader || (s.regions?.[0] ? initialAreaLeaders[s.regions[0]] : '') || 'Romany Adly';
          return { ...s, areaLeader: fallbackLeader };
        }
        return s;
      });
    }
    return initialSupervisors;
  } catch (err) {
    console.error('Error loading supervisors:', err);
    return initialSupervisors;
  }
}

export function saveSupervisors(supervisors: SupervisorRecord[]): void {
  try {
    localStorage.setItem(SUPERVISORS_KEY, JSON.stringify(supervisors));
  } catch (err) {
    console.error('Error saving supervisors:', err);
  }
}

export function getStoredAreaLeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem(AREA_LEADERS_KEY);
    if (!raw) {
      localStorage.setItem(AREA_LEADERS_KEY, JSON.stringify(initialAreaLeaders));
      return initialAreaLeaders;
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : initialAreaLeaders;
  } catch {
    return initialAreaLeaders;
  }
}

export function saveAreaLeaders(leaders: Record<string, string>): void {
  try {
    localStorage.setItem(AREA_LEADERS_KEY, JSON.stringify(leaders));
  } catch (err) {
    console.error('Error saving area leaders:', err);
  }
}

export function getStoredChildren(): ChildRecord[] {
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    if (!raw) {
      localStorage.setItem(CHILDREN_KEY, JSON.stringify(initialChildren));
      return initialChildren;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 5000) {
      return parsed;
    }
    // If cache is empty or has old mock data, strictly load real 5,289 children from sheet
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(initialChildren));
    return initialChildren;
  } catch (err) {
    console.error('Error loading children:', err);
    return initialChildren;
  }
}

export function saveChildren(children: ChildRecord[]): void {
  try {
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(children));
  } catch (err) {
    console.error('Error saving children:', err);
  }
}

export function getAdminPin(): string {
  try {
    const pin = localStorage.getItem(ADMIN_PIN_KEY);
    if (!pin || pin === '1234') {
      localStorage.setItem(ADMIN_PIN_KEY, DEFAULT_PIN);
      return DEFAULT_PIN;
    }
    return pin;
  } catch {
    return DEFAULT_PIN;
  }
}

export function setAdminPin(newPin: string): boolean {
  try {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(ADMIN_PIN_KEY, newPin.trim());
    return true;
  } catch {
    return false;
  }
}

export function resetAllDataToDefault(): void {
  try {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
    localStorage.setItem(SUPERVISORS_KEY, JSON.stringify(extractSupervisors(initialTeachers)));
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(initialChildren));
    localStorage.setItem(ADMIN_PIN_KEY, DEFAULT_PIN);
    localStorage.setItem(AREA_LEADERS_KEY, JSON.stringify(initialAreaLeaders));
  } catch (err) {
    console.error('Error resetting data:', err);
  }
}

// Return strictly registered real children from the sheet for this teacher
export function generateInitialRosterForTeacher(teacher: TeacherRecord): ChildRecord[] {
  return initialChildren.filter(c => 
    c.teacherId === teacher.id || 
    c.teacherName.trim() === teacher.teacherName.trim()
  );
}

export interface ComprehensiveStats {
  totalTeachers: number;
  totalSupervisors: number;
  totalChildrenRegistered: number;
  totalClassesSum: number;
  totalBoys: number;
  totalGirls: number;
  boysPercentage: number;
  girlsPercentage: number;
  avgClassSize: number;
  
  // By Denomination
  denominations: {
    name: string;
    teachersCount: number;
    boys: number;
    girls: number;
    totalChildren: number;
    percentage: number;
  }[];

  // By Level
  levels: {
    level: string;
    teachersCount: number;
    boys: number;
    girls: number;
    totalChildren: number;
    percentage: number;
  }[];

  // By Region
  regions: {
    region: string;
    leader: string;
    teachersCount: number;
    boys: number;
    girls: number;
    totalChildren: number;
    villagesCount: number;
    avgPerTeacher: number;
  }[];

  // By Supervisor
  supervisorsStats: {
    supervisor: string;
    teachersCount: number;
    regions: string[];
    boys: number;
    girls: number;
    totalChildren: number;
  }[];

  // Top Villages by density
  topVillages: {
    village: string;
    region: string;
    teachersCount: number;
    totalChildren: number;
    boys: number;
    girls: number;
  }[];
}

export function calculateStats(
  teachers: TeacherRecord[], 
  supervisors: SupervisorRecord[], 
  children: ChildRecord[],
  areaLeaders: Record<string, string> = initialAreaLeaders
): ComprehensiveStats {
  const totalTeachers = teachers.length;
  const totalSupervisors = supervisors.length;
  const totalChildrenRegistered = children.length;

  let totalClassesSum = 0;
  let totalBoys = 0;
  let totalGirls = 0;

  const denomMap = new Map<string, { teachersCount: number; boys: number; girls: number }>();
  const levelMap = new Map<string, { teachersCount: number; boys: number; girls: number }>();
  const regionMap = new Map<string, { teachersCount: number; boys: number; girls: number; villages: Set<string> }>();
  const supMap = new Map<string, { teachersCount: number; boys: number; girls: number; regions: Set<string> }>();
  const villageMap = new Map<string, { region: string; teachersCount: number; totalChildren: number; boys: number; girls: number }>();

  teachers.forEach(t => {
    totalClassesSum += t.classCount || 1;
    totalBoys += t.boysCount || 0;
    totalGirls += t.girlsCount || 0;

    // Denomination
    const dName = t.denomination?.trim() || 'أخرى';
    if (!denomMap.has(dName)) denomMap.set(dName, { teachersCount: 0, boys: 0, girls: 0 });
    const dObj = denomMap.get(dName)!;
    dObj.teachersCount += 1;
    dObj.boys += t.boysCount || 0;
    dObj.girls += t.girlsCount || 0;

    // Level
    const lName = t.level?.trim() || 'غير محدد';
    if (!levelMap.has(lName)) levelMap.set(lName, { teachersCount: 0, boys: 0, girls: 0 });
    const lObj = levelMap.get(lName)!;
    lObj.teachersCount += 1;
    lObj.boys += t.boysCount || 0;
    lObj.girls += t.girlsCount || 0;

    // Region
    const rName = t.region?.trim() || 'غير محدد';
    if (!regionMap.has(rName)) regionMap.set(rName, { teachersCount: 0, boys: 0, girls: 0, villages: new Set<string>() });
    const rObj = regionMap.get(rName)!;
    rObj.teachersCount += 1;
    rObj.boys += t.boysCount || 0;
    rObj.girls += t.girlsCount || 0;
    if (t.village) rObj.villages.add(t.village);

    // Supervisor
    const sName = t.supervisor?.trim() || 'غير محدد';
    if (!supMap.has(sName)) supMap.set(sName, { teachersCount: 0, boys: 0, girls: 0, regions: new Set<string>() });
    const sObj = supMap.get(sName)!;
    sObj.teachersCount += 1;
    sObj.boys += t.boysCount || 0;
    sObj.girls += t.girlsCount || 0;
    if (t.region) sObj.regions.add(t.region);

    // Village
    const vKey = `${t.village}-${t.region}`;
    if (!villageMap.has(vKey)) {
      villageMap.set(vKey, { region: t.region, teachersCount: 0, totalChildren: 0, boys: 0, girls: 0 });
    }
    const vObj = villageMap.get(vKey)!;
    vObj.teachersCount += 1;
    vObj.totalChildren += t.totalChildren;
    vObj.boys += t.boysCount || 0;
    vObj.girls += t.girlsCount || 0;
  });

  const totalSumChildren = totalBoys + totalGirls;
  const boysPercentage = totalSumChildren > 0 ? Math.round((totalBoys / totalSumChildren) * 100) : 0;
  const girlsPercentage = totalSumChildren > 0 ? Math.round((totalGirls / totalSumChildren) * 100) : 0;
  const avgClassSize = totalTeachers > 0 ? Math.round(totalSumChildren / totalTeachers) : 0;

  // Process Denominations
  const denominations = Array.from(denomMap.entries()).map(([name, val]) => {
    const tot = val.boys + val.girls;
    return {
      name,
      teachersCount: val.teachersCount,
      boys: val.boys,
      girls: val.girls,
      totalChildren: tot,
      percentage: totalSumChildren > 0 ? Math.round((tot / totalSumChildren) * 100) : 0
    };
  }).sort((a, b) => b.totalChildren - a.totalChildren);

  // Process Levels
  const levels = Array.from(levelMap.entries()).map(([level, val]) => {
    const tot = val.boys + val.girls;
    return {
      level,
      teachersCount: val.teachersCount,
      boys: val.boys,
      girls: val.girls,
      totalChildren: tot,
      percentage: totalSumChildren > 0 ? Math.round((tot / totalSumChildren) * 100) : 0
    };
  }).sort((a, b) => b.totalChildren - a.totalChildren);

  // Process Regions
  const regions = Array.from(regionMap.entries()).map(([region, val]) => {
    const tot = val.boys + val.girls;
    return {
      region,
      leader: areaLeaders[region] || 'Romany Adly',
      teachersCount: val.teachersCount,
      boys: val.boys,
      girls: val.girls,
      totalChildren: tot,
      villagesCount: val.villages.size,
      avgPerTeacher: val.teachersCount > 0 ? Math.round(tot / val.teachersCount) : 0
    };
  }).sort((a, b) => b.totalChildren - a.totalChildren);

  // Process Supervisors
  const supervisorsStats = Array.from(supMap.entries()).map(([supervisor, val]) => ({
    supervisor,
    teachersCount: val.teachersCount,
    regions: Array.from(val.regions),
    boys: val.boys,
    girls: val.girls,
    totalChildren: val.boys + val.girls
  })).sort((a, b) => b.totalChildren - a.totalChildren);

  // Process Top Villages
  const topVillages = Array.from(villageMap.entries()).map(([vKey, val]) => {
    const villageName = vKey.split('-')[0];
    return {
      village: villageName,
      region: val.region,
      teachersCount: val.teachersCount,
      totalChildren: val.totalChildren,
      boys: val.boys,
      girls: val.girls
    };
  }).sort((a, b) => b.totalChildren - a.totalChildren).slice(0, 12);

  return {
    totalTeachers,
    totalSupervisors,
    totalChildrenRegistered,
    totalClassesSum,
    totalBoys,
    totalGirls,
    boysPercentage,
    girlsPercentage,
    avgClassSize,
    denominations,
    levels,
    regions,
    supervisorsStats,
    topVillages
  };
}

export function exportTeachersToCSV(teachers: TeacherRecord[]): void {
  const headers = ['المشرف', 'المنطقة', 'اسم المدرس', 'رقم الموبيل', 'القرية', 'الطائفة', 'اسم الكاهن او الراعي', 'المستوي', 'عدد الفصل', 'عدد الاولاد', 'عدد البنات', 'إجمالي الأطفال'];
  
  const rows = teachers.map(t => [
    `"${t.supervisor.replace(/"/g, '""')}"`,
    `"${t.region.replace(/"/g, '""')}"`,
    `"${t.teacherName.replace(/"/g, '""')}"`,
    `"${t.phone.replace(/"/g, '""')}"`,
    `"${t.village.replace(/"/g, '""')}"`,
    `"${t.denomination.replace(/"/g, '""')}"`,
    `"${t.priestOrPastor.replace(/"/g, '""')}"`,
    `"${t.level.replace(/"/g, '""')}"`,
    t.classCount,
    t.boysCount,
    t.girlsCount,
    t.totalChildren
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `صناع_القادة_بيانات_الخدام_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getStoredProjectAccounts(): ProjectAccountsData {
  try {
    const raw = localStorage.getItem(PROJECT_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(PROJECT_ACCOUNTS_KEY, JSON.stringify(initialProjectAccounts));
      return initialProjectAccounts;
    }
    const parsed = JSON.parse(raw);
    return {
      teachersSalary: Array.isArray(parsed.teachersSalary) ? parsed.teachersSalary : initialProjectAccounts.teachersSalary,
      supervisorsSalary: Array.isArray(parsed.supervisorsSalary) ? parsed.supervisorsSalary : initialProjectAccounts.supervisorsSalary,
      adminExpenses: Array.isArray(parsed.adminExpenses) ? parsed.adminExpenses : initialProjectAccounts.adminExpenses,
      carnival: Array.isArray(parsed.carnival) ? parsed.carnival : initialProjectAccounts.carnival,
      regionalSessions: Array.isArray(parsed.regionalSessions) ? parsed.regionalSessions : initialProjectAccounts.regionalSessions,
      graduationParties: Array.isArray(parsed.graduationParties) ? parsed.graduationParties : initialProjectAccounts.graduationParties,
      fieldVisits: Array.isArray(parsed.fieldVisits) ? parsed.fieldVisits : initialProjectAccounts.fieldVisits,
      transport: Array.isArray(parsed.transport) ? parsed.transport : initialProjectAccounts.transport,
      prints: Array.isArray(parsed.prints) ? parsed.prints : initialProjectAccounts.prints,
      custodyReceipts: Array.isArray(parsed.custodyReceipts) ? parsed.custodyReceipts : initialProjectAccounts.custodyReceipts,
    };
  } catch (err) {
    console.error('Error loading project accounts:', err);
    return initialProjectAccounts;
  }
}

export function saveProjectAccounts(data: ProjectAccountsData): void {
  try {
    localStorage.setItem(PROJECT_ACCOUNTS_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving project accounts:', err);
  }
}

export function calculateAccountsSummary(data: ProjectAccountsData) {
  const teachersSalaryTotal = (data.teachersSalary || []).reduce((acc, curr) => acc + (Number(curr.total) || (Number(curr.count) * Number(curr.salary)) || 0), 0);
  const supervisorsSalaryTotal = (data.supervisorsSalary || []).reduce((acc, curr) => acc + (Number(curr.total) || (Number(curr.salary) + Number(curr.routeAllowance)) || 0), 0);
  const adminExpensesTotal = (data.adminExpenses || []).reduce((acc, curr) => acc + (Number(curr.total) || (Number(curr.count) * Number(curr.cost)) || 0), 0);
  const carnivalTotal = (data.carnival || []).reduce((acc, curr) => acc + (Number(curr.total) || ((Number(curr.breakCost) || 0) + (Number(curr.playgroundCost) || 0) + (Number(curr.hallsCost) || 0) + (Number(curr.partiesCost) || 0) + (Number(curr.otherCost) || 0))), 0);
  const regionalSessionsTotal = (data.regionalSessions || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  const graduationPartiesTotal = (data.graduationParties || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  const fieldVisitsTotal = (data.fieldVisits || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
  const transportTotal = (data.transport || []).reduce((acc, curr) => acc + (Number(curr.total) || (Number(curr.count) * Number(curr.cost)) || 0), 0);
  const printsTotal = (data.prints || []).reduce((acc, curr) => acc + (Number(curr.total) || (Number(curr.count) * Number(curr.cost)) || 0), 0);

  const totalSpent =
    teachersSalaryTotal +
    supervisorsSalaryTotal +
    adminExpensesTotal +
    carnivalTotal +
    regionalSessionsTotal +
    graduationPartiesTotal +
    fieldVisitsTotal +
    transportTotal +
    printsTotal;

  const totalCustody = (data.custodyReceipts || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remainingCustody = totalCustody - totalSpent;

  return {
    categoryTotals: {
      teachersSalary: teachersSalaryTotal,
      supervisorsSalary: supervisorsSalaryTotal,
      adminExpenses: adminExpensesTotal,
      carnival: carnivalTotal,
      regionalSessions: regionalSessionsTotal,
      graduationParties: graduationPartiesTotal,
      fieldVisits: fieldVisitsTotal,
      transport: transportTotal,
      prints: printsTotal
    },
    totalSpent,
    totalCustody,
    remainingCustody,
    spentRatio: totalCustody > 0 ? (totalSpent / totalCustody) * 100 : 0
  };
}
