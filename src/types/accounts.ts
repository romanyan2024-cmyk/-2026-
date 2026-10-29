export interface TeacherSalaryRecord {
  id: string;
  count: number;          // العدد
  salary: number;         // المرتب
  total: number;          // الإجمالي (العدد × المرتب)
  period?: string;        // الشهر / الدفعة
  notes?: string;
  createdAt: string;
}

export interface SupervisorSalaryRecord {
  id: string;
  name: string;           // الاسم
  salary: number;         // المرتب
  routeAllowance: number; // خط السير
  total: number;          // الإجمالي (المرتب + خط السير)
  period?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminExpenseRecord {
  id: string;
  itemTitle: string;      // البند
  count: number;          // العدد
  cost: number;           // التكلفة
  total: number;          // الإجمالي (العدد × التكلفة)
  date?: string;
  notes?: string;
  createdAt: string;
}

export interface CarnivalExpenseRecord {
  id: string;
  name?: string;          // اسم الفعالية
  breakCost: number;      // تكلفة البريك
  playgroundCost: number; // تكلفة ملاعب
  hallsCost: number;      // تكلفة قاعات
  otherCost: number;      // أخري
  partiesCost: number;    // حفلات
  total: number;          // الإجمالي
  date?: string;
  notes?: string;
  createdAt: string;
}

export interface RegionalSessionRecord {
  id: string;
  region: string;         // اختيار المنطقة من المناطق الموجودة
  cost: number;           // التكلفة
  date?: string;
  notes?: string;
  createdAt: string;
}

export interface GraduationPartyRecord {
  id: string;
  region: string;         // اختيار المنطقة من المناطق الموجودة
  cost: number;           // التكلفة
  date?: string;
  batchName?: string;
  notes?: string;
  createdAt: string;
}

export interface FieldVisitRecord {
  id: string;
  region: string;         // اختيار المنطقة من المناطق الموجودة
  cost: number;           // التكلفة
  date?: string;
  purpose?: string;
  notes?: string;
  createdAt: string;
}

export interface TransportExpenseRecord {
  id: string;
  destination: string;    // البلد
  count: number;          // العدد
  cost: number;           // التكلفة
  total: number;          // الإجمالي (العدد × التكلفة)
  date?: string;
  notes?: string;
  createdAt: string;
}

export interface PrintExpenseRecord {
  id: string;
  itemTitle: string;      // البند
  count: number;          // العدد
  cost: number;           // التكلفة
  total: number;          // الإجمالي (العدد × التكلفة)
  date?: string;
  notes?: string;
  createdAt: string;
}

export interface CustodyReceiptRecord {
  id: string;
  receivedFrom: string;   // من يد
  amount: number;         // المبلغ
  date: string;           // التاريخ
  notes?: string;
  createdAt: string;
}

export interface ProjectAccountsData {
  teachersSalary: TeacherSalaryRecord[];
  supervisorsSalary: SupervisorSalaryRecord[];
  adminExpenses: AdminExpenseRecord[];
  carnival: CarnivalExpenseRecord[];
  regionalSessions: RegionalSessionRecord[];
  graduationParties: GraduationPartyRecord[];
  fieldVisits: FieldVisitRecord[];
  transport: TransportExpenseRecord[];
  prints: PrintExpenseRecord[];
  custodyReceipts: CustodyReceiptRecord[];
}

export type ExpenseCategoryKey =
  | 'teachersSalary'
  | 'supervisorsSalary'
  | 'adminExpenses'
  | 'carnival'
  | 'regionalSessions'
  | 'graduationParties'
  | 'fieldVisits'
  | 'transport'
  | 'prints';
