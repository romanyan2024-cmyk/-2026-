import React, { useState, useMemo } from 'react';
import { 
  ProjectAccountsData, 
  ExpenseCategoryKey,
  TeacherSalaryRecord,
  SupervisorSalaryRecord,
  AdminExpenseRecord,
  CarnivalExpenseRecord,
  RegionalSessionRecord,
  GraduationPartyRecord,
  FieldVisitRecord,
  TransportExpenseRecord,
  PrintExpenseRecord,
  CustodyReceiptRecord
} from '../types/accounts';
import { calculateAccountsSummary } from '../utils/storage';
import { 
  exportAllAccountsToExcel, 
  exportCustodyToExcel, 
  exportExpensesToExcel, 
  exportSingleCategoryToExcel 
} from '../utils/accountsExport';
import { AccountsPrintModal } from './AccountsPrintModal';
import { 
  DollarSign, 
  Wallet, 
  FileText, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Truck, 
  Printer, 
  PartyPopper, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  Layers,
  ChevronDown,
  Info,
  Download,
  Table
} from 'lucide-react';

interface ProjectAccountsViewProps {
  accountsData: ProjectAccountsData;
  onUpdateAccounts: (updated: ProjectAccountsData) => void;
  regionsList: string[];
  supervisorsList: string[];
}

export const ProjectAccountsView: React.FC<ProjectAccountsViewProps> = ({
  accountsData,
  onUpdateAccounts,
  regionsList,
  supervisorsList
}) => {
  // Top-level View Mode: 'expenses' (المنصرف) or 'custody' (العهدة)
  const [mainView, setMainView] = useState<'expenses' | 'custody'>('expenses');

  // Dropdown selected item (1 to 9)
  const [selectedExpenseKey, setSelectedExpenseKey] = useState<ExpenseCategoryKey>('teachersSalary');

  // Sub-tab in expenses: 'item-details' (تفاصيل البند المختار) or 'summary-matrix' (شاشة جميع النواتج والمجمعة)
  const [expensesSubTab, setExpensesSubTab] = useState<'item-details' | 'summary-matrix'>('item-details');

  // Print & Export States
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);

  // Feedback banner state
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Ensure default region options
  const defaultRegions = useMemo(() => {
    const list = Array.from(new Set([
      'ابوقرقاص',
      'بني مزار ومغاغة',
      'الفشن وببا وسمسطا',
      'ملوي ودير مواس',
      'سمالوط والمنيا',
      ...regionsList
    ])).filter(Boolean);
    return list;
  }, [regionsList]);

  // Financial summary & custody calculations
  const summary = useMemo(() => calculateAccountsSummary(accountsData), [accountsData]);

  // Form states for each of the 9 items:
  // 1- مرتبات مدرسين: العدد، المرتب، الإجمالي
  const [formTSCount, setFormTSCount] = useState<string>('');
  const [formTSSalary, setFormTSSalary] = useState<string>('');
  const [formTSPeriod, setFormTSPeriod] = useState<string>('فبراير 2025');
  const [formTSNotes, setFormTSNotes] = useState<string>('');

  // 2- مرتبات المشرفين: الاسم، المرتب، خط السير، الإجمالي
  const [formSSName, setFormSSName] = useState<string>('');
  const [formSSSalary, setFormSSSalary] = useState<string>('');
  const [formSSRoute, setFormSSRoute] = useState<string>('');
  const [formSSNotes, setFormSSNotes] = useState<string>('');

  // 3- مصاريف إدارية: البند، العدد، التكلفة، الإجمالي
  const [formAEItem, setFormAEItem] = useState<string>('');
  const [formAECount, setFormAECount] = useState<string>('1');
  const [formAECost, setFormAECost] = useState<string>('');
  const [formAENotes, setFormAENotes] = useState<string>('');

  // 4- حسابات الكرنفال: بريك، ملاعب، قاعات، أخرى، حفلات
  const [formCEName, setFormCEName] = useState<string>('كرنفال الفرح السنوي');
  const [formCEBreak, setFormCEBreak] = useState<string>('');
  const [formCEPlayground, setFormCEPlayground] = useState<string>('');
  const [formCEHalls, setFormCEHalls] = useState<string>('');
  const [formCEParties, setFormCEParties] = useState<string>('');
  const [formCEOther, setFormCEOther] = useState<string>('');
  const [formCENotes, setFormCENotes] = useState<string>('');

  // 5- الجلسات الشهرية: المنطقة، التكلفة
  const [formRSRegion, setFormRSRegion] = useState<string>(defaultRegions[0] || 'ابوقرقاص');
  const [formRSCost, setFormRSCost] = useState<string>('');
  const [formRSNotes, setFormRSNotes] = useState<string>('');

  // 6- حفلات التخرج: المنطقة، التكلفة
  const [formGPRegion, setFormGPRegion] = useState<string>(defaultRegions[0] || 'بني مزار ومغاغة');
  const [formGPCost, setFormGPCost] = useState<string>('');
  const [formGPBatch, setFormGPBatch] = useState<string>('دفعة 2025');
  const [formGPNotes, setFormGPNotes] = useState<string>('');

  // 7- الزيارات الميدانية: المنطقة، التكلفة
  const [formFVRegion, setFormFVRegion] = useState<string>(defaultRegions[0] || 'الفشن وببا وسمسطا');
  const [formFVCost, setFormFVCost] = useState<string>('');
  const [formFVPurpose, setFormFVPurpose] = useState<string>('');
  const [formFVNotes, setFormFVNotes] = useState<string>('');

  // 8- حسابات مواصلات: البلد، العدد، التكلفة
  const [formTRDestination, setFormTRDestination] = useState<string>('');
  const [formTRCount, setFormTRCount] = useState<string>('1');
  const [formTRCost, setFormTRCost] = useState<string>('');
  const [formTRNotes, setFormTRNotes] = useState<string>('');

  // 9- حسابات مطبوعات: البند، العدد، التكلفة
  const [formPRItem, setFormPRItem] = useState<string>('');
  const [formPRCount, setFormPRCount] = useState<string>('100');
  const [formPRCost, setFormPRCost] = useState<string>('');
  const [formPRNotes, setFormPRNotes] = useState<string>('');

  // 10- استلام العهدة الشهرية: من يد، المبلغ، التاريخ
  const [formCRFrom, setFormCRFrom] = useState<string>('');
  const [formCRAmount, setFormCRAmount] = useState<string>('');
  const [formCRDate, setFormCRDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [formCRNotes, setFormCRNotes] = useState<string>('');

  // Category definitions for the dropdown list
  const categoryDefs = [
    { key: 'teachersSalary' as ExpenseCategoryKey, num: 1, title: 'مرتبات مدرسين', icon: Users, desc: 'العدد × المرتب = الإجمالي تلقائياً' },
    { key: 'supervisorsSalary' as ExpenseCategoryKey, num: 2, title: 'مرتبات المشرفين', icon: Briefcase, desc: 'الاسم، المرتب، خط السير، الإجمالي تلقائياً' },
    { key: 'adminExpenses' as ExpenseCategoryKey, num: 3, title: 'مصاريف إدارية', icon: FileText, desc: 'البند، العدد، التكلفة، الإجمالي تلقائياً' },
    { key: 'carnival' as ExpenseCategoryKey, num: 4, title: 'حسابات الكرنفال', icon: PartyPopper, desc: 'بريك، ملاعب، قاعات، أخرى، حفلات، الإجمالي تلقائياً' },
    { key: 'regionalSessions' as ExpenseCategoryKey, num: 5, title: 'حساب الجلسات الشهرية', icon: Calendar, desc: 'اختيار المنطقة من التطبيق والتكلفة' },
    { key: 'graduationParties' as ExpenseCategoryKey, num: 6, title: 'حسابات حفلات التخرج', icon: Sparkles, desc: 'اختيار المنطقة من التطبيق والتكلفة' },
    { key: 'fieldVisits' as ExpenseCategoryKey, num: 7, title: 'حسابات الزيارات الميدانيه', icon: MapPin, desc: 'اختيار المنطقة من التطبيق والتكلفة' },
    { key: 'transport' as ExpenseCategoryKey, num: 8, title: 'حسابات مواصلات', icon: Truck, desc: 'البلد، العدد، التكلفة، الإجمالي' },
    { key: 'prints' as ExpenseCategoryKey, num: 9, title: 'حسابات مطبوعات', icon: Printer, desc: 'البند، العدد، التكلفة، الإجمالي' },
  ];

  // Helper additions
  const handleAddTeacherSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(formTSCount) || 0;
    const salary = Number(formTSSalary) || 0;
    if (count <= 0 || salary <= 0) return;
    const newRecord: TeacherSalaryRecord = {
      id: `ts-${Date.now()}`,
      count,
      salary,
      total: count * salary,
      period: formTSPeriod.trim() || undefined,
      notes: formTSNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      teachersSalary: [newRecord, ...(accountsData.teachersSalary || [])]
    });
    setFormTSCount('');
    setFormTSSalary('');
    setFormTSNotes('');
    showToast('تمت إضافة مرتبات المدرسين وتحديث العهدة تلقائياً');
  };

  const handleAddSupervisorSalary = (e: React.FormEvent) => {
    e.preventDefault();
    const salary = Number(formSSSalary) || 0;
    const route = Number(formSSRoute) || 0;
    const name = formSSName.trim();
    if (!name || salary <= 0) return;
    const newRecord: SupervisorSalaryRecord = {
      id: `ss-${Date.now()}`,
      name,
      salary,
      routeAllowance: route,
      total: salary + route,
      notes: formSSNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      supervisorsSalary: [newRecord, ...(accountsData.supervisorsSalary || [])]
    });
    setFormSSName('');
    setFormSSSalary('');
    setFormSSRoute('');
    setFormSSNotes('');
    showToast('تمت إضافة مرتب المشرف وخط السير بنجاح');
  };

  const handleAddAdminExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const item = formAEItem.trim();
    const count = Number(formAECount) || 1;
    const cost = Number(formAECost) || 0;
    if (!item || cost <= 0) return;
    const newRecord: AdminExpenseRecord = {
      id: `ae-${Date.now()}`,
      itemTitle: item,
      count,
      cost,
      total: count * cost,
      date: new Date().toISOString().slice(0, 10),
      notes: formAENotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      adminExpenses: [newRecord, ...(accountsData.adminExpenses || [])]
    });
    setFormAEItem('');
    setFormAECount('1');
    setFormAECost('');
    setFormAENotes('');
    showToast('تمت إضافة المصروف الإداري بنجاح');
  };

  const handleAddCarnivalExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const breakCost = Number(formCEBreak) || 0;
    const playgroundCost = Number(formCEPlayground) || 0;
    const hallsCost = Number(formCEHalls) || 0;
    const partiesCost = Number(formCEParties) || 0;
    const otherCost = Number(formCEOther) || 0;
    const total = breakCost + playgroundCost + hallsCost + partiesCost + otherCost;
    if (total <= 0) return;
    const newRecord: CarnivalExpenseRecord = {
      id: `ce-${Date.now()}`,
      name: formCEName.trim() || 'كرنفال',
      breakCost,
      playgroundCost,
      hallsCost,
      partiesCost,
      otherCost,
      total,
      date: new Date().toISOString().slice(0, 10),
      notes: formCENotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      carnival: [newRecord, ...(accountsData.carnival || [])]
    });
    setFormCEBreak('');
    setFormCEPlayground('');
    setFormCEHalls('');
    setFormCEParties('');
    setFormCEOther('');
    setFormCENotes('');
    showToast('تم تسجيل حسابات الكرنفال وتحديث الخصم من العهدة');
  };

  const handleAddRegionalSession = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(formRSCost) || 0;
    const region = formRSRegion.trim();
    if (!region || cost <= 0) return;
    const newRecord: RegionalSessionRecord = {
      id: `rs-${Date.now()}`,
      region,
      cost,
      date: new Date().toISOString().slice(0, 10),
      notes: formRSNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      regionalSessions: [newRecord, ...(accountsData.regionalSessions || [])]
    });
    setFormRSCost('');
    setFormRSNotes('');
    showToast(`تم تسجيل جلسة منطقة (${region}) بنجاح`);
  };

  const handleAddGraduationParty = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(formGPCost) || 0;
    const region = formGPRegion.trim();
    if (!region || cost <= 0) return;
    const newRecord: GraduationPartyRecord = {
      id: `gp-${Date.now()}`,
      region,
      cost,
      date: new Date().toISOString().slice(0, 10),
      batchName: formGPBatch.trim() || undefined,
      notes: formGPNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      graduationParties: [newRecord, ...(accountsData.graduationParties || [])]
    });
    setFormGPCost('');
    setFormGPNotes('');
    showToast(`تم تسجيل حفل تخرج منطقة (${region}) بنجاح`);
  };

  const handleAddFieldVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Number(formFVCost) || 0;
    const region = formFVRegion.trim();
    if (!region || cost <= 0) return;
    const newRecord: FieldVisitRecord = {
      id: `fv-${Date.now()}`,
      region,
      cost,
      date: new Date().toISOString().slice(0, 10),
      purpose: formFVPurpose.trim() || undefined,
      notes: formFVNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      fieldVisits: [newRecord, ...(accountsData.fieldVisits || [])]
    });
    setFormFVCost('');
    setFormFVPurpose('');
    setFormFVNotes('');
    showToast(`تم تسجيل الزيارة الميدانية لمنطقة (${region}) بنجاح`);
  };

  const handleAddTransport = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = formTRDestination.trim();
    const count = Number(formTRCount) || 1;
    const cost = Number(formTRCost) || 0;
    if (!dest || cost <= 0) return;
    const newRecord: TransportExpenseRecord = {
      id: `tr-${Date.now()}`,
      destination: dest,
      count,
      cost,
      total: count * cost,
      date: new Date().toISOString().slice(0, 10),
      notes: formTRNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      transport: [newRecord, ...(accountsData.transport || [])]
    });
    setFormTRDestination('');
    setFormTRCount('1');
    setFormTRCost('');
    setFormTRNotes('');
    showToast('تمت إضافة حساب المواصلات بنجاح');
  };

  const handleAddPrint = (e: React.FormEvent) => {
    e.preventDefault();
    const item = formPRItem.trim();
    const count = Number(formPRCount) || 1;
    const cost = Number(formPRCost) || 0;
    if (!item || cost <= 0) return;
    const newRecord: PrintExpenseRecord = {
      id: `pr-${Date.now()}`,
      itemTitle: item,
      count,
      cost,
      total: count * cost,
      date: new Date().toISOString().slice(0, 10),
      notes: formPRNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      prints: [newRecord, ...(accountsData.prints || [])]
    });
    setFormPRItem('');
    setFormPRCount('100');
    setFormPRCost('');
    setFormPRNotes('');
    showToast('تمت إضافة حساب المطبوعات بنجاح');
  };

  const handleAddCustodyReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const from = formCRFrom.trim();
    const amount = Number(formCRAmount) || 0;
    const date = formCRDate || new Date().toISOString().slice(0, 10);
    if (!from || amount <= 0) return;
    const newRecord: CustodyReceiptRecord = {
      id: `cr-${Date.now()}`,
      receivedFrom: from,
      amount,
      date,
      notes: formCRNotes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    onUpdateAccounts({
      ...accountsData,
      custodyReceipts: [newRecord, ...(accountsData.custodyReceipts || [])]
    });
    setFormCRFrom('');
    setFormCRAmount('');
    setFormCRNotes('');
    showToast(`تم تسجيل استلام عهدة بمبلغ ${amount.toLocaleString('ar-EG')} ج.م`);
  };

  // Generic deleter
  const handleDeleteItem = (category: keyof ProjectAccountsData, id: string) => {
    const currentList = accountsData[category] as any[];
    const updated = currentList.filter(item => item.id !== id);
    onUpdateAccounts({
      ...accountsData,
      [category]: updated
    });
    showToast('تم حذف السجل وإعادة احتساب العهدة تلقائياً');
  };

  const activeCategoryDef = categoryDefs.find(c => c.key === selectedExpenseKey) || categoryDefs[0];

  return (
    <div className="space-y-6 pb-20 select-text" dir="rtl">
      
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-2xl border border-indigo-500/40 text-sm font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                النظام المالي الموحد
              </span>
              <span className="text-xs text-indigo-300 font-medium">
                مشروع صناع القادة
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Wallet className="w-7 h-7 text-amber-400" />
              حسابات المشروع
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              إدارة المصروفات التشغيلية (البنود من 1 إلى 9) ومتابعة العهدة الشهرية وحساب المتبقي تلقائياً بدقة فورية.
            </p>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2.5 rounded-2xl text-right min-w-[140px]">
              <span className="text-[11px] text-slate-400 block font-medium">إجمالي المنصرف (1-9)</span>
              <span className="text-lg font-black text-rose-300 font-mono tabular-nums">
                {summary.totalSpent.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
              </span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2.5 rounded-2xl text-right min-w-[140px]">
              <span className="text-[11px] text-slate-400 block font-medium">إجمالي العهدة المستلمة</span>
              <span className="text-lg font-black text-emerald-300 font-mono tabular-nums">
                {summary.totalCustody.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
              </span>
            </div>

            <div className={`px-4 py-2.5 rounded-2xl text-right min-w-[140px] border ${
              summary.remainingCustody >= 0 
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200' 
                : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
            }`}>
              <span className="text-[11px] opacity-80 block font-medium">صافي رصيد العهدة</span>
              <span className="text-lg font-black font-mono tabular-nums">
                {summary.remainingCustody.toLocaleString('ar-EG')} <span className="text-xs font-normal">ج.م</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary View Switcher & Global Print/Export Actions */}
        <div className="mt-6 pt-5 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMainView('expenses')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                mainView === 'expenses'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>أولاً: المنصرف (البنود من 1 إلى 9)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900/30 font-mono">
                {summary.totalSpent.toLocaleString('ar-EG')} ج.م
              </span>
            </button>

            <button
              onClick={() => setMainView('custody')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                mainView === 'custody'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>ثانياً: شاشة العهدة الشهرية والمتبقي (البند 10)</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                summary.remainingCustody >= 0 ? 'bg-slate-900/30 text-slate-900' : 'bg-rose-900 text-rose-200'
              }`}>
                متبقي: {summary.remainingCustody.toLocaleString('ar-EG')} ج.م
              </span>
            </button>
          </div>

          {/* Quick Print & Google Sheets Export Actions */}
          <div className="flex items-center gap-2 relative">
            {/* A4 Print Button */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              title="طباعة تقرير الحسابات بحجم A4 رسمي"
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-black shadow-md transition-all active:scale-95 border border-slate-200"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>طباعة A4 (مجمع / وارد / منصرف)</span>
            </button>

            {/* Google Sheets / Excel Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(prev => !prev)}
                title="تصدير الحسابات لشيت جوجل أو إكسيل"
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-950/30 transition-all active:scale-95 border border-emerald-400/40"
              >
                <Table className="w-4 h-4 text-emerald-200" />
                <span>تصدير لشيت جوجل</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              {isExportMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2 z-40 text-right space-y-1 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsExportMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-black text-slate-500">
                    خيارات تصدير شيت جوجل (Google Sheets / Excel)
                  </div>

                  <button
                    onClick={() => {
                      exportAllAccountsToExcel(accountsData);
                      setIsExportMenuOpen(false);
                      showToast('تم تصدير الشيت المجمع الشامل بنجاح');
                    }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>1. تصدير شيت مجمع شامل (الوارد والمنصرف)</span>
                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                  </button>

                  <button
                    onClick={() => {
                      exportCustodyToExcel(accountsData);
                      setIsExportMenuOpen(false);
                      showToast('تم تصدير شيت الوارد (العهدة) بنجاح');
                    }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>2. تصدير الوارد فقط (شيت العهدة)</span>
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                  </button>

                  <button
                    onClick={() => {
                      exportExpensesToExcel(accountsData);
                      setIsExportMenuOpen(false);
                      showToast('تم تصدير شيت المنصرفات (البنود 1-9) بنجاح');
                    }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold hover:bg-rose-50 text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>3. تصدير المنصرف فقط (البنود 1-9)</span>
                    <Download className="w-3.5 h-3.5 text-rose-600" />
                  </button>

                  <button
                    onClick={() => {
                      exportSingleCategoryToExcel(accountsData, selectedExpenseKey);
                      setIsExportMenuOpen(false);
                      showToast(`تم تصدير كشف ${categoryDefs.find(c => c.key === selectedExpenseKey)?.title} بنجاح`);
                    }}
                    className="w-full text-right px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-50 text-slate-800 flex items-center justify-between transition-colors"
                  >
                    <span>4. تصدير البند الحالي المختار</span>
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: المنصرف (EXPENSES)                                               */}
      {/* ========================================================================= */}
      {mainView === 'expenses' && (
        <div className="space-y-6">
          
          {/* Top Sub-Bar with Dropdown and View Mode Toggle */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* The Requested Dropdown Selector: البنود من 1 إلى 9 في قائمة منسدلة */}
            <div className="flex-1 max-w-xl">
              <label htmlFor="expense-category-select" className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ChevronDown className="w-4 h-4 text-indigo-600" />
                <span>اختر بند المصروفات المطلوب من القائمة المنسدلة (1 - 9):</span>
              </label>
              <div className="relative">
                <select
                  id="expense-category-select"
                  value={selectedExpenseKey}
                  onChange={(e) => {
                    setSelectedExpenseKey(e.target.value as ExpenseCategoryKey);
                    setExpensesSubTab('item-details');
                  }}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border-2 border-indigo-600/40 focus:border-indigo-600 text-slate-900 font-bold text-sm sm:text-base rounded-xl py-3 pr-4 pl-10 cursor-pointer shadow-sm focus:outline-none transition-all"
                >
                  {categoryDefs.map((cat) => (
                    <option key={cat.key} value={cat.key} className="py-2">
                      {cat.num}- {cat.title} ({summary.categoryTotals[cat.key].toLocaleString('ar-EG')} ج.م)
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Sub-view toggle: Item Details vs All Items Summary */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-end">
              <button
                onClick={() => setExpensesSubTab('item-details')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  expensesSubTab === 'item-details'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                تفاصيل البند المختار
              </button>
              <button
                onClick={() => setExpensesSubTab('summary-matrix')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  expensesSubTab === 'summary-matrix'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                شاشة عرض كل النواتج مجمعة
              </button>
            </div>
          </div>

          {/* If 'summary-matrix' is chosen, show all 9 items side by side + grand total */}
          {expensesSubTab === 'summary-matrix' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-indigo-600" />
                    شاشة عرض جميع النواتج لكل بند على حدة وأيضاً مجمعة
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    مقارنة إجماليات كافة بنود المنصرف الـ 9 ونسبتها من التكلفة الكلية
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    title="طباعة الكشف المجمع الشامل بحجم A4"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-300" />
                    <span>طباعة الكشف المجمع (A4)</span>
                  </button>

                  <button
                    onClick={() => {
                      exportExpensesToExcel(accountsData);
                      showToast('تم تصدير شيت المنصرفات لشيت جوجل بنجاح');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    title="تصدير شيت المنصرفات لشيت جوجل"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير شيت المنصرفات</span>
                  </button>

                  <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-2xl text-right">
                    <span className="text-[11px] text-indigo-700 block font-bold">المجموع الكلي المجمع للمنصرفات</span>
                    <span className="text-xl font-black text-indigo-900 font-mono tabular-nums">
                      {summary.totalSpent.toLocaleString('ar-EG')} <span className="text-xs font-bold">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid of all 9 items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryDefs.map((cat) => {
                  const Icon = cat.icon;
                  const itemTotal = summary.categoryTotals[cat.key];
                  const percentage = summary.totalSpent > 0 ? ((itemTotal / summary.totalSpent) * 100).toFixed(1) : '0';
                  const recordsCount = (accountsData[cat.key] || []).length;

                  return (
                    <div
                      key={cat.key}
                      onClick={() => {
                        setSelectedExpenseKey(cat.key);
                        setExpensesSubTab('item-details');
                      }}
                      className="group bg-slate-50 hover:bg-indigo-50/50 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-sm hover:shadow relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 block">
                              بند رقم {cat.num}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900">
                              {cat.title}
                            </h3>
                          </div>
                        </div>

                        <span className="text-[11px] bg-slate-200/70 text-slate-700 font-bold px-2 py-0.5 rounded-full font-mono">
                          {recordsCount} سجل
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-slate-500 block">إجمالي البند:</span>
                          <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                            {itemTotal.toLocaleString('ar-EG')} <span className="text-xs font-bold text-slate-600">ج.م</span>
                          </span>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 font-mono">
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-indigo-600 font-bold flex items-center gap-1 group-hover:underline">
                        <span>فتح تفاصيل هذا البند</span>
                        <ArrowRight className="w-3 h-3 rotate-180" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If 'item-details' is chosen, show the full form and records for the selected item */}
          {expensesSubTab === 'item-details' && (
            <div className="space-y-6">

              {/* Header Card for Selected Item */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                    {React.createElement(activeCategoryDef.icon, { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black px-2 py-0.5 rounded">
                        بند رقم {activeCategoryDef.num}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {activeCategoryDef.desc}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                      {activeCategoryDef.title}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsPrintModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all shadow-xs active:scale-95"
                    title="طباعة كشف هذا البند بحجم A4"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-600" />
                    <span>طباعة هذا البند (A4)</span>
                  </button>

                  <button
                    onClick={() => {
                      exportSingleCategoryToExcel(accountsData, selectedExpenseKey);
                      showToast(`تم تصدير كشف ${activeCategoryDef.title} لشيت جوجل بنجاح`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-xs font-bold transition-all shadow-xs active:scale-95"
                    title="تصدير هذا البند لشيت جوجل"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تصدير البند لشيت جوجل</span>
                  </button>

                  {/* Subtotal Banner for this selected category */}
                  <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-right min-w-[180px] shadow-sm">
                    <span className="text-[11px] text-slate-400 block font-medium">إجمالي {activeCategoryDef.title}:</span>
                    <span className="text-xl font-black text-amber-300 font-mono tabular-nums">
                      {summary.categoryTotals[selectedExpenseKey].toLocaleString('ar-EG')} <span className="text-xs font-bold text-white">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Entry Form for Selected Item with INSTANT AUTO CALCULATION */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  تسجيل عملية جديدة في ({activeCategoryDef.title})
                </h3>

                {/* ITEM 1: مرتبات مدرسين (العدد، المرتب، الإجمالي تلقائي) */}
                {selectedExpenseKey === 'teachersSalary' && (
                  <form onSubmit={handleAddTeacherSalary} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          العدد (عدد المدرسين) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formTSCount}
                          onChange={(e) => setFormTSCount(e.target.value)}
                          placeholder="مثال: 25"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          المرتب لكل مدرس (ج.م) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formTSSalary}
                          onChange={(e) => setFormTSSalary(e.target.value)}
                          placeholder="مثال: 600"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          الإجمالي المحسوب تلقائياً (العدد × المرتب)
                        </label>
                        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-indigo-900 font-mono tabular-nums flex items-center justify-between">
                          <span>{((Number(formTSCount) || 0) * (Number(formTSSalary) || 0)).toLocaleString('ar-EG')}</span>
                          <span className="text-xs text-indigo-700 font-bold">ج.م (تلقائي)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الشهر أو الدفعة</label>
                        <input
                          type="text"
                          value={formTSPeriod}
                          onChange={(e) => setFormTSPeriod(e.target.value)}
                          placeholder="مثال: شهر فبراير 2025"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات / فئة المدرسين</label>
                        <input
                          type="text"
                          value={formTSNotes}
                          onChange={(e) => setFormTSNotes(e.target.value)}
                          placeholder="مثال: معلمي المستوى الأول بجميع المراكز"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!formTSCount || !formTSSalary}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      إضافة إلى مرتبات المدرسين
                    </button>
                  </form>
                )}

                {/* ITEM 2: مرتبات المشرفين (الاسم، المرتب، خط السير، الإجمالي تلقائي) */}
                {selectedExpenseKey === 'supervisorsSalary' && (
                  <form onSubmit={handleAddSupervisorSalary} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">الاسم (اسم المشرف) *</label>
                        <input
                          type="text"
                          list="supervisors-suggestions"
                          required
                          value={formSSName}
                          onChange={(e) => setFormSSName(e.target.value)}
                          placeholder="اسم المشرف"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                        <datalist id="supervisors-suggestions">
                          {supervisorsList.map((sup, idx) => (
                            <option key={idx} value={sup} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">المرتب (ج.م) *</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={formSSSalary}
                          onChange={(e) => setFormSSSalary(e.target.value)}
                          placeholder="مثال: 2800"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">خط السير (ج.م)</label>
                        <input
                          type="number"
                          min="0"
                          value={formSSRoute}
                          onChange={(e) => setFormSSRoute(e.target.value)}
                          placeholder="مثال: 700"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الإجمالي (المرتب + خط السير)</label>
                        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-indigo-900 font-mono tabular-nums flex items-center justify-between">
                          <span>{((Number(formSSSalary) || 0) + (Number(formSSRoute) || 0)).toLocaleString('ar-EG')}</span>
                          <span className="text-xs text-indigo-700 font-bold">ج.م (تلقائي)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات / المنطقة المشرف عليها</label>
                      <input
                        type="text"
                        value={formSSNotes}
                        onChange={(e) => setFormSSNotes(e.target.value)}
                        placeholder="مثال: متابعة وإشراف منطقة الفشن وببا وسمسطا"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formSSName || !formSSSalary}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      إضافة إلى مرتبات المشرفين
                    </button>
                  </form>
                )}

                {/* ITEM 3: مصاريف إدارية (البند، العدد، التكلفة، الإجمالي تلقائي) */}
                {selectedExpenseKey === 'adminExpenses' && (
                  <form onSubmit={handleAddAdminExpense} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">البند (وصف المصروف) *</label>
                        <input
                          type="text"
                          required
                          value={formAEItem}
                          onChange={(e) => setFormAEItem(e.target.value)}
                          placeholder="مثال: أدوات مكتبية وتصوير"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">العدد *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formAECount}
                          onChange={(e) => setFormAECount(e.target.value)}
                          placeholder="1"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">التكلفة (سعر الوحدة) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formAECost}
                          onChange={(e) => setFormAECost(e.target.value)}
                          placeholder="مثال: 350"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الإجمالي (العدد × التكلفة)</label>
                        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-indigo-900 font-mono tabular-nums flex items-center justify-between">
                          <span>{((Number(formAECount) || 1) * (Number(formAECost) || 0)).toLocaleString('ar-EG')}</span>
                          <span className="text-xs text-indigo-700 font-bold">ج.م (تلقائي)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
                      <input
                        type="text"
                        value={formAENotes}
                        onChange={(e) => setFormAENotes(e.target.value)}
                        placeholder="تفاصيل الفاتورة أو الجهة الموردة"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formAEItem || !formAECost}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      إضافة إلى المصاريف الإدارية
                    </button>
                  </form>
                )}

                {/* ITEM 4: حسابات الكرنفال (تكلفة البريك، ملاعب، قاعات، أخرى، حفلات، الإجمالي تلقائي) */}
                {selectedExpenseKey === 'carnival' && (
                  <form onSubmit={handleAddCarnivalExpense} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">اسم الكرنفال أو الفعالية</label>
                        <input
                          type="text"
                          value={formCEName}
                          onChange={(e) => setFormCEName(e.target.value)}
                          placeholder="مثال: كرنفال الفرح السنوي للأطفال"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الفعالية</label>
                        <input
                          type="text"
                          value={formCENotes}
                          onChange={(e) => setFormCENotes(e.target.value)}
                          placeholder="مكان الانعقاد وعدد المشاركين"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">تكلفة البريك (ج.م)</label>
                        <input
                          type="number"
                          min="0"
                          value={formCEBreak}
                          onChange={(e) => setFormCEBreak(e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">تكلفة ملاعب (ج.م)</label>
                        <input
                          type="number"
                          min="0"
                          value={formCEPlayground}
                          onChange={(e) => setFormCEPlayground(e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">تكلفة قاعات (ج.م)</label>
                        <input
                          type="number"
                          min="0"
                          value={formCEHalls}
                          onChange={(e) => setFormCEHalls(e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">حفلات (ج.م)</label>
                        <input
                          type="number"
                          min="0"
                          value={formCEParties}
                          onChange={(e) => setFormCEParties(e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">أخرى (ج.م)</label>
                        <input
                          type="number"
                          min="0"
                          value={formCEOther}
                          onChange={(e) => setFormCEOther(e.target.value)}
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Instant Auto Total Display */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-indigo-700 block">الإجمالي الكلي المحسوب للكرنفال (تلقائي):</span>
                        <span className="text-xs text-slate-500">مجموع (البريك + ملاعب + قاعات + حفلات + أخرى)</span>
                      </div>
                      <span className="text-xl font-black text-indigo-900 font-mono tabular-nums">
                        {((Number(formCEBreak) || 0) + (Number(formCEPlayground) || 0) + (Number(formCEHalls) || 0) + (Number(formCEParties) || 0) + (Number(formCEOther) || 0)).toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      تسجيل حسابات الكرنفال
                    </button>
                  </form>
                )}

                {/* ITEM 5: حساب الجلسات الشهرية (اختيار المنطقة من المناطق الموجودة والتكلفة) */}
                {selectedExpenseKey === 'regionalSessions' && (
                  <form onSubmit={handleAddRegionalSession} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اختيار المنطقة من المناطق الموجودة في التطبيق *
                        </label>
                        <select
                          required
                          value={formRSRegion}
                          onChange={(e) => setFormRSRegion(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        >
                          {defaultRegions.map((reg, idx) => (
                            <option key={idx} value={reg}>{reg}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">التكلفة (ج.م) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formRSCost}
                          onChange={(e) => setFormRSCost(e.target.value)}
                          placeholder="مثال: 1600"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات / موضوع الجلسة الشهرية</label>
                      <input
                        type="text"
                        value={formRSNotes}
                        onChange={(e) => setFormRSNotes(e.target.value)}
                        placeholder="مثال: ورشة عمل المعلمين وتوزيع المناهج الدورية"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formRSRegion || !formRSCost}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      تسجيل جلسة المنطقة
                    </button>
                  </form>
                )}

                {/* ITEM 6: حسابات حفلات التخرج (اختيار المنطقة من المناطق الموجودة والتكلفة) */}
                {selectedExpenseKey === 'graduationParties' && (
                  <form onSubmit={handleAddGraduationParty} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اختيار المنطقة من المناطق الموجودة في التطبيق *
                        </label>
                        <select
                          required
                          value={formGPRegion}
                          onChange={(e) => setFormGPRegion(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        >
                          {defaultRegions.map((reg, idx) => (
                            <option key={idx} value={reg}>{reg}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">التكلفة (ج.م) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formGPCost}
                          onChange={(e) => setFormGPCost(e.target.value)}
                          placeholder="مثال: 5000"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الدفعة / الفوج</label>
                        <input
                          type="text"
                          value={formGPBatch}
                          onChange={(e) => setFormGPBatch(e.target.value)}
                          placeholder="مثال: تخرج المستوى الأول 2025"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الحفل</label>
                      <input
                        type="text"
                        value={formGPNotes}
                        onChange={(e) => setFormGPNotes(e.target.value)}
                        placeholder="شهادات وهدايا التخرج والتكريمات"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formGPRegion || !formGPCost}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      تسجيل حفل التخرج
                    </button>
                  </form>
                )}

                {/* ITEM 7: حسابات الزيارات الميدانيه (اختيار المنطقة من المناطق الموجودة والتكلفة) */}
                {selectedExpenseKey === 'fieldVisits' && (
                  <form onSubmit={handleAddFieldVisit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اختيار المنطقة من المناطق الموجودة في التطبيق *
                        </label>
                        <select
                          required
                          value={formFVRegion}
                          onChange={(e) => setFormFVRegion(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        >
                          {defaultRegions.map((reg, idx) => (
                            <option key={idx} value={reg}>{reg}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">التكلفة (ج.م) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formFVCost}
                          onChange={(e) => setFormFVCost(e.target.value)}
                          placeholder="مثال: 1200"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">هدف الزيارة</label>
                        <input
                          type="text"
                          value={formFVPurpose}
                          onChange={(e) => setFormFVPurpose(e.target.value)}
                          placeholder="مثال: تفقد فصول القرى ومتابعة المعلمين"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الزيارة</label>
                      <input
                        type="text"
                        value={formFVNotes}
                        onChange={(e) => setFormFVNotes(e.target.value)}
                        placeholder="أسماء المرافقين وتقرير المتابعة"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formFVRegion || !formFVCost}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      تسجيل الزيارة الميدانية
                    </button>
                  </form>
                )}

                {/* ITEM 8: حسابات مواصلات (البلد، العدد، التكلفة، الإجمالي) */}
                {selectedExpenseKey === 'transport' && (
                  <form onSubmit={handleAddTransport} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">البلد (خط السير أو الوجهة) *</label>
                        <input
                          type="text"
                          required
                          value={formTRDestination}
                          onChange={(e) => setFormTRDestination(e.target.value)}
                          placeholder="مثال: قرى بني مزار وسمسطا"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">العدد (عدد الرحلات / الأفراد) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formTRCount}
                          onChange={(e) => setFormTRCount(e.target.value)}
                          placeholder="1"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">التكلفة (ج.م) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formTRCost}
                          onChange={(e) => setFormTRCost(e.target.value)}
                          placeholder="مثال: 250"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الإجمالي (العدد × التكلفة)</label>
                        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-indigo-900 font-mono tabular-nums flex items-center justify-between">
                          <span>{((Number(formTRCount) || 1) * (Number(formTRCost) || 0)).toLocaleString('ar-EG')}</span>
                          <span className="text-xs text-indigo-700 font-bold">ج.م (تلقائي)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الانتقالات</label>
                      <input
                        type="text"
                        value={formTRNotes}
                        onChange={(e) => setFormTRNotes(e.target.value)}
                        placeholder="وسيلة النقل أو تفاصيل الذهاب والعودة"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formTRDestination || !formTRCost}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      إضافة إلى حسابات المواصلات
                    </button>
                  </form>
                )}

                {/* ITEM 9: حسابات مطبوعات (البند، العدد، التكلفة، الإجمالي) */}
                {selectedExpenseKey === 'prints' && (
                  <form onSubmit={handleAddPrint} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">البند (نوع المطبوعات) *</label>
                        <input
                          type="text"
                          required
                          value={formPRItem}
                          onChange={(e) => setFormPRItem(e.target.value)}
                          placeholder="مثال: كراسات أنشطة وبوسترات"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">العدد (الكمية المطبوعة) *</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={formPRCount}
                          onChange={(e) => setFormPRCount(e.target.value)}
                          placeholder="100"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">التكلفة للنسخة (ج.م) *</label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          required
                          value={formPRCost}
                          onChange={(e) => setFormPRCost(e.target.value)}
                          placeholder="مثال: 15"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الإجمالي (العدد × التكلفة)</label>
                        <div className="w-full bg-indigo-50 border border-indigo-200 rounded-xl px-3.5 py-2.5 text-sm font-black text-indigo-900 font-mono tabular-nums flex items-center justify-between">
                          <span>{((Number(formPRCount) || 1) * (Number(formPRCost) || 0)).toLocaleString('ar-EG')}</span>
                          <span className="text-xs text-indigo-700 font-bold">ج.م (تلقائي)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الطباعة</label>
                      <input
                        type="text"
                        value={formPRNotes}
                        onChange={(e) => setFormPRNotes(e.target.value)}
                        placeholder="اسم المطبعة وتاريخ التسليم"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!formPRItem || !formPRCost}
                      className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm"
                    >
                      إضافة إلى حسابات المطبوعات
                    </button>
                  </form>
                )}
              </div>

              {/* TABLE OF EXISTING RECORDS FOR THIS SELECTED ITEM */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      سجل العمليات المدخلة في ({activeCategoryDef.title})
                    </h3>
                    <span className="text-xs text-slate-500">
                      كل عملية تضاف تخصم تلقائياً وبشكل فوري من العهدة الشهرية
                    </span>
                  </div>

                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full font-mono">
                    {(accountsData[selectedExpenseKey] || []).length} سجلات مسجلة
                  </span>
                </div>

                {/* Table representation based on active item */}
                <div className="overflow-x-auto">
                  {(accountsData[selectedExpenseKey] || []).length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      لا توجد عمليات مسجلة في هذا البند حتى الآن. استخدم النموذج أعلاه لإضافة أول عملية.
                    </div>
                  ) : (
                    <table className="w-full text-right text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs font-bold">
                          <th className="py-3 px-3">#</th>
                          {selectedExpenseKey === 'teachersSalary' && (
                            <>
                              <th className="py-3 px-3">العدد</th>
                              <th className="py-3 px-3">المرتب الفردي</th>
                              <th className="py-3 px-3">الدورة / الشهر</th>
                              <th className="py-3 px-3">ملاحظات</th>
                              <th className="py-3 px-3 font-mono">الإجمالي</th>
                            </>
                          )}
                          {selectedExpenseKey === 'supervisorsSalary' && (
                            <>
                              <th className="py-3 px-3">الاسم</th>
                              <th className="py-3 px-3">المرتب</th>
                              <th className="py-3 px-3">خط السير</th>
                              <th className="py-3 px-3">ملاحظات</th>
                              <th className="py-3 px-3 font-mono">الإجمالي</th>
                            </>
                          )}
                          {selectedExpenseKey === 'adminExpenses' && (
                            <>
                              <th className="py-3 px-3">البند</th>
                              <th className="py-3 px-3">العدد</th>
                              <th className="py-3 px-3">التكلفة</th>
                              <th className="py-3 px-3">ملاحظات</th>
                              <th className="py-3 px-3 font-mono">الإجمالي</th>
                            </>
                          )}
                          {selectedExpenseKey === 'carnival' && (
                            <>
                              <th className="py-3 px-3">الفعالية</th>
                              <th className="py-3 px-3">بريك</th>
                              <th className="py-3 px-3">ملاعب</th>
                              <th className="py-3 px-3">قاعات</th>
                              <th className="py-3 px-3">حفلات</th>
                              <th className="py-3 px-3">أخرى</th>
                              <th className="py-3 px-3 font-mono">الإجمالي</th>
                            </>
                          )}
                          {(selectedExpenseKey === 'regionalSessions' || selectedExpenseKey === 'graduationParties' || selectedExpenseKey === 'fieldVisits') && (
                            <>
                              <th className="py-3 px-3">المنطقة</th>
                              <th className="py-3 px-3">التاريخ</th>
                              <th className="py-3 px-3">التفاصيل / ملاحظات</th>
                              <th className="py-3 px-3 font-mono">التكلفة</th>
                            </>
                          )}
                          {selectedExpenseKey === 'transport' && (
                            <>
                              <th className="py-3 px-3">البلد / الوجهة</th>
                              <th className="py-3 px-3">العدد</th>
                              <th className="py-3 px-3">التكلفة</th>
                              <th className="py-3 px-3">ملاحظات</th>
                              <th className="py-3 px-3 font-mono">الإجمالي</th>
                            </>
                          )}
                          {selectedExpenseKey === 'prints' && (
                            <>
                              <th className="py-3 px-3">البند</th>
                              <th className="py-3 px-3">العدد</th>
                              <th className="py-3 px-3">التكلفة للنسخة</th>
                              <th className="py-3 px-3">ملاحظات</th>
                              <th className="py-3 px-3 font-mono">الإجمالي</th>
                            </>
                          )}
                          <th className="py-3 px-3 text-center">إجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(accountsData[selectedExpenseKey] as any[]).map((row, index) => (
                          <tr key={row.id || index} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 text-xs text-slate-400 font-mono">{index + 1}</td>

                            {selectedExpenseKey === 'teachersSalary' && (
                              <>
                                <td className="py-3 px-3 font-bold font-mono">{row.count} معلم</td>
                                <td className="py-3 px-3 font-mono">{row.salary?.toLocaleString('ar-EG')} ج.م</td>
                                <td className="py-3 px-3 text-xs text-slate-600">{row.period || '-'}</td>
                                <td className="py-3 px-3 text-xs text-slate-500">{row.notes || '-'}</td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.total?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            {selectedExpenseKey === 'supervisorsSalary' && (
                              <>
                                <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                                <td className="py-3 px-3 font-mono">{row.salary?.toLocaleString('ar-EG')} ج.م</td>
                                <td className="py-3 px-3 font-mono">{row.routeAllowance?.toLocaleString('ar-EG')} ج.م</td>
                                <td className="py-3 px-3 text-xs text-slate-500">{row.notes || '-'}</td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.total?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            {selectedExpenseKey === 'adminExpenses' && (
                              <>
                                <td className="py-3 px-3 font-bold text-slate-900">{row.itemTitle}</td>
                                <td className="py-3 px-3 font-mono">{row.count}</td>
                                <td className="py-3 px-3 font-mono">{row.cost?.toLocaleString('ar-EG')} ج.م</td>
                                <td className="py-3 px-3 text-xs text-slate-500">{row.notes || '-'}</td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.total?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            {selectedExpenseKey === 'carnival' && (
                              <>
                                <td className="py-3 px-3 font-bold text-slate-900">{row.name}</td>
                                <td className="py-3 px-3 font-mono text-xs">{row.breakCost?.toLocaleString('ar-EG')}</td>
                                <td className="py-3 px-3 font-mono text-xs">{row.playgroundCost?.toLocaleString('ar-EG')}</td>
                                <td className="py-3 px-3 font-mono text-xs">{row.hallsCost?.toLocaleString('ar-EG')}</td>
                                <td className="py-3 px-3 font-mono text-xs">{row.partiesCost?.toLocaleString('ar-EG')}</td>
                                <td className="py-3 px-3 font-mono text-xs">{row.otherCost?.toLocaleString('ar-EG')}</td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.total?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            {(selectedExpenseKey === 'regionalSessions' || selectedExpenseKey === 'graduationParties' || selectedExpenseKey === 'fieldVisits') && (
                              <>
                                <td className="py-3 px-3 font-bold text-indigo-900 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                                  <span>{row.region}</span>
                                </td>
                                <td className="py-3 px-3 text-xs font-mono text-slate-500">{row.date || row.createdAt || '-'}</td>
                                <td className="py-3 px-3 text-xs text-slate-600">
                                  {row.batchName || row.purpose || row.notes || '-'}
                                </td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.cost?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            {selectedExpenseKey === 'transport' && (
                              <>
                                <td className="py-3 px-3 font-bold text-slate-900">{row.destination}</td>
                                <td className="py-3 px-3 font-mono">{row.count} رحلة</td>
                                <td className="py-3 px-3 font-mono">{row.cost?.toLocaleString('ar-EG')} ج.م</td>
                                <td className="py-3 px-3 text-xs text-slate-500">{row.notes || '-'}</td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.total?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            {selectedExpenseKey === 'prints' && (
                              <>
                                <td className="py-3 px-3 font-bold text-slate-900">{row.itemTitle}</td>
                                <td className="py-3 px-3 font-mono">{row.count} نسخة</td>
                                <td className="py-3 px-3 font-mono">{row.cost?.toLocaleString('ar-EG')} ج.م</td>
                                <td className="py-3 px-3 text-xs text-slate-500">{row.notes || '-'}</td>
                                <td className="py-3 px-3 font-black text-indigo-700 font-mono tabular-nums">
                                  {row.total?.toLocaleString('ar-EG')} ج.م
                                </td>
                              </>
                            )}

                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => handleDeleteItem(selectedExpenseKey, row.id)}
                                title="حذف هذا السجل"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-300 bg-slate-50 font-black">
                          <td colSpan={2} className="py-3 px-3 text-slate-900">
                            إجمالي {activeCategoryDef.title}:
                          </td>
                          <td colSpan={4} className="py-3 px-3 text-left font-mono text-base text-indigo-900 tabular-nums">
                            {summary.categoryTotals[selectedExpenseKey].toLocaleString('ar-EG')} ج.م
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: شاشة العهدة الشهرية المنفردة (بند 10 والخصم التلقائي اللحظي)       */}
      {/* ========================================================================= */}
      {mainView === 'custody' && (
        <div className="space-y-6">

          {/* Standalone Custody Financial Health Dashboard */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full">
                  شاشة منفردة احترافية
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-emerald-600" />
                  حسابات العهدة الشهرية والمتبقي والمصروف
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  أي مصروف يتم إدخاله في البنود (1 إلى 9) يخصم أوتوماتيكياً من العهدة ويظهر الرصيد المتبقي لحظياً
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  title="طباعة كشف العهدة والوارد بحجم A4"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>طباعة كشف العهدة (A4)</span>
                </button>

                <button
                  onClick={() => {
                    exportCustodyToExcel(accountsData);
                    showToast('تم تصدير كشف الوارد (العهدة) لشيت جوجل بنجاح');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                  title="تصدير كشف العهدة لشيت جوجل"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير كشف العهدة</span>
                </button>

                {/* Status Indicator */}
                <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${
                  summary.remainingCustody > 0
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : summary.remainingCustody === 0
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}>
                  {summary.remainingCustody >= 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  )}
                  <div>
                    <span className="text-[11px] block font-bold">حالة رصيد العهدة:</span>
                    <span className="text-xs font-black">
                      {summary.remainingCustody > 0 
                        ? 'رصيد فائض متوفر ومطابق' 
                        : summary.remainingCustody === 0 
                        ? 'تم استهلاك كامل العهدة' 
                        : 'تجاوز للعهدة (عجز مستحق للصرف)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Main KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              
              {/* Card 1: إجمالي العهدة المستلمة */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md border border-indigo-800/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-indigo-300 font-bold">10- إجمالي العهدة المستلمة</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tabular-nums">
                  {summary.totalCustody.toLocaleString('ar-EG')} <span className="text-sm font-normal text-slate-300">ج.م</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  مجموع إيصالات الاستلام المسجلة ({(accountsData.custodyReceipts || []).length} دفعات)
                </span>
              </div>

              {/* Card 2: إجمالي المنصرف */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-600 font-bold">إجمالي المنصرف الفعلي (البنود 1-9)</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 font-mono tabular-nums">
                  {summary.totalSpent.toLocaleString('ar-EG')} <span className="text-sm font-normal text-slate-500">ج.م</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-2 block">
                  يتم خصمه أوتوماتيكياً لحظياً فور تسجيل أي مصروف
                </span>
              </div>

              {/* Card 3: المتبقي في العهدة */}
              <div className={`p-5 rounded-2xl border shadow-xs ${
                summary.remainingCustody >= 0 
                  ? 'bg-emerald-50/70 border-emerald-300' 
                  : 'bg-rose-50/70 border-rose-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">صافي المتبقي في العهدة</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    summary.remainingCustody >= 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                  }`}>
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-2xl sm:text-3xl font-black font-mono tabular-nums ${
                  summary.remainingCustody >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {summary.remainingCustody.toLocaleString('ar-EG')} <span className="text-sm font-normal">ج.م</span>
                </div>
                <span className="text-[11px] text-slate-600 mt-2 block font-medium">
                  {summary.remainingCustody >= 0 
                    ? `متبقي ${(100 - Math.min(100, summary.spentRatio)).toFixed(1)}% من أصل العهدة المستلمة`
                    : `تجاوز بمقدار ${Math.abs(summary.remainingCustody).toLocaleString('ar-EG')} ج.م`}
                </span>
              </div>
            </div>

            {/* Consumption Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>نسبة استهلاك العهدة:</span>
                <span className="font-mono text-indigo-700">{summary.spentRatio.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    summary.spentRatio <= 75 
                      ? 'bg-emerald-500' 
                      : summary.spentRatio <= 95 
                      ? 'bg-amber-500' 
                      : 'bg-rose-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, summary.spentRatio))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form: 10- استلام العهدة الشهرية (من يد، المبلغ، التاريخ) */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              10- استلام العهدة الشهرية (إضافة دفعة عهدة جديدة)
            </h3>

            <form onSubmit={handleAddCustodyReceipt} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">من يد (المسلم / مصدر العهدة) *</label>
                  <input
                    type="text"
                    required
                    value={formCRFrom}
                    onChange={(e) => setFormCRFrom(e.target.value)}
                    placeholder="مثال: أ/ روماني عدلي أو أمانة الصندوق"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المستلم (ج.م) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formCRAmount}
                    onChange={(e) => setFormCRAmount(e.target.value)}
                    placeholder="مثال: 50000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ *</label>
                  <input
                    type="date"
                    required
                    value={formCRDate}
                    onChange={(e) => setFormCRDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات أو رقم إيصال التحويل</label>
                <input
                  type="text"
                  value={formCRNotes}
                  onChange={(e) => setFormCRNotes(e.target.value)}
                  placeholder="مثال: دفعة العهدة التشغيلية الأولى لشهر فبراير"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!formCRFrom || !formCRAmount}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل استلام العهدة</span>
              </button>
            </form>
          </div>

          {/* Table of Custody Receipts Ledger */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>سجل إيصالات استلام العهدة (الوارد المالي)</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-3 py-1 rounded-full font-bold">
                {summary.totalCustody.toLocaleString('ar-EG')} ج.م مستلمة
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 text-xs font-bold">
                    <th className="py-3 px-3">#</th>
                    <th className="py-3 px-3">من يد</th>
                    <th className="py-3 px-3">التاريخ</th>
                    <th className="py-3 px-3">الملاحظات</th>
                    <th className="py-3 px-3 font-mono">المبلغ المستلم</th>
                    <th className="py-3 px-3 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(accountsData.custodyReceipts || []).map((receipt, idx) => (
                    <tr key={receipt.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-xs text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{receipt.receivedFrom}</td>
                      <td className="py-3 px-3 font-mono text-xs text-slate-500">{receipt.date}</td>
                      <td className="py-3 px-3 text-xs text-slate-600">{receipt.notes || '-'}</td>
                      <td className="py-3 px-3 font-black text-emerald-700 font-mono tabular-nums">
                        {receipt.amount?.toLocaleString('ar-EG')} ج.م
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteItem('custodyReceipts', receipt.id)}
                          title="حذف هذا الإيصال"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deduction Breakdown from Custody */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              بيان الاستقطاع التلقائي من العهدة بحسب البنود التشغيلية
            </h3>

            <div className="space-y-3">
              {categoryDefs.map((cat) => {
                const total = summary.categoryTotals[cat.key];
                const custodyShare = summary.totalCustody > 0 ? ((total / summary.totalCustody) * 100).toFixed(1) : '0';
                return (
                  <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {cat.num}
                      </div>
                      <span className="font-bold text-sm text-slate-800">{cat.title}</span>
                    </div>

                    <div className="flex items-center gap-4 text-left">
                      <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                        يستقطع {custodyShare}% من العهدة
                      </span>
                      <span className="font-black text-rose-600 font-mono tabular-nums text-sm">
                        - {total.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* A4 Print Modal */}
      <AccountsPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        accountsData={accountsData}
        selectedCategoryKey={selectedExpenseKey}
      />

    </div>
  );
};
