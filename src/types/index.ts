export interface TeacherRecord {
  id: string;
  supervisor: string;       // المشرف
  region: string;           // المنطقة
  teacherName: string;      // اسم المدرس
  phone: string;            // رقم الموبيل
  formattedPhone: string;   // رقم منسق للاتصال
  village: string;          // القرية
  denomination: string;     // الطائفة (الاورثوذكسية, الانجيلية, الكاثوليك, ...)
  priestOrPastor: string;   // اسم الكاهن او الراعي
  level: string;            // المستوي (الاول, الثاني)
  classCount: number;       // عدد الفصل
  boysCount: number;        // عدد الاولاد
  girlsCount: number;       // عدد البنات
  totalChildren: number;    // إجمالي الأولاد والبنات
  areaLeader?: string;      // قائد المنطقة
  churchName?: string;      // اسم الكنيسة
  qualification?: string;   // المؤهل الدراسي
  maritalStatus?: string;   // الحالة الاجتماعية
  serviceStartYear?: string;// سنة الاشتراك
  orphanNotes?: string;     // أسماء الأيتام
  generalNotes?: string;    // ملاحظات عامة أو أزمات
  notes?: string;
  createdAt?: string;
}

export interface SupervisorRecord {
  id: string;
  name: string;
  phone?: string;
  regions: string[];
  areaLeader?: string;      // قائد المنطقة المسؤول عن المشرف
  teachersCount?: number;
  totalChildren?: number;
  notes?: string;
}

export interface AreaLeaderRecord {
  region: string;
  leaderName: string;
  phone?: string;
  notes?: string;
}

export interface ChildRecord {
  id: string;
  name: string;
  grade?: string;           // الصف الدراسي (مثال: الثاني، الرابع، الخامس)
  gender: 'ولد' | 'بنت';
  level: 'الاول' | 'الثاني' | string;
  teacherId?: string;
  teacherName: string;
  supervisor?: string;
  areaLeader?: string;      // قائد المنطقة
  village?: string;
  region?: string;
  denomination?: string;
  guardianName?: string;
  guardianPhone?: string;
  notes?: string;
  attendanceCount?: number;
  createdAt: string;
}

export type ActiveTab = 'home' | 'hierarchy' | 'teachers' | 'supervisors' | 'children' | 'accounts' | 'search' | 'admin';

export type CategoryFilter = {
  keyword: string;
  supervisor: string;
  region: string;
  denomination: string;
  level: string;
  village: string;
  minChildren: number;
};

export * from './accounts';
