import { TeacherRecord, SupervisorRecord, ChildRecord } from '../types';
import importedSheetData from './imported_sheet_data.json';

// Use the complete verified database extracted directly from the user's attached file
export const initialTeachers: TeacherRecord[] = importedSheetData.teachers as TeacherRecord[];

// Only real children from the user's attached file (5,289 real children records)
export const initialChildren: ChildRecord[] = importedSheetData.children as ChildRecord[];

// Real area leaders map extracted from the sheet
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

export function extractSupervisors(teachers: TeacherRecord[]): SupervisorRecord[] {
  const map = new Map<string, { regions: Set<string>; count: number; children: number; phone?: string; areaLeader?: string }>();

  teachers.forEach(t => {
    const sName = t.supervisor.trim();
    if (!map.has(sName)) {
      map.set(sName, { regions: new Set<string>(), count: 0, children: 0 });
    }
    const entry = map.get(sName)!;
    entry.regions.add(t.region);
    entry.count += 1;
    entry.children += t.totalChildren;
    if (!entry.phone && t.formattedPhone) {
      entry.phone = t.formattedPhone;
    }
    if (!entry.areaLeader && (t.areaLeader || initialAreaLeaders[t.region])) {
      entry.areaLeader = t.areaLeader || initialAreaLeaders[t.region];
    }
  });

  return Array.from(map.entries()).map(([name, data], idx) => {
    const firstRegion = Array.from(data.regions)[0] || '';
    const leader = data.areaLeader || initialAreaLeaders[firstRegion] || 'Romany Adly';
    return {
      id: `supervisor-${idx + 1}`,
      name,
      phone: data.phone,
      regions: Array.from(data.regions),
      areaLeader: leader,
      teachersCount: data.count,
      totalChildren: data.children,
      notes: `يشرف على ${data.count} معلماً/خادماً في مناطق: ${Array.from(data.regions).join('، ')}`
    };
  });
}

export const initialSupervisors: SupervisorRecord[] = extractSupervisors(initialTeachers);
