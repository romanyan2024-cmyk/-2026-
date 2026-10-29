import React, { useState } from 'react';
import { 
  ProjectAccountsData, 
  ExpenseCategoryKey 
} from '../types/accounts';
import { calculateAccountsSummary } from '../utils/storage';
import { 
  Printer, 
  X, 
  FileText, 
  Layers, 
  Wallet, 
  TrendingDown, 
  Check, 
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';

export type PrintScope = 'all' | 'custody' | 'expenses' | 'single';

interface AccountsPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountsData: ProjectAccountsData;
  selectedCategoryKey: ExpenseCategoryKey;
}

export const AccountsPrintModal: React.FC<AccountsPrintModalProps> = ({
  isOpen,
  onClose,
  accountsData,
  selectedCategoryKey
}) => {
  const [printScope, setPrintScope] = useState<PrintScope>('all');
  const [activeCategory, setActiveCategory] = useState<ExpenseCategoryKey>(selectedCategoryKey);

  const summary = calculateAccountsSummary(accountsData);
  const printDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categoryNames: Record<ExpenseCategoryKey, { num: number; title: string }> = {
    teachersSalary: { num: 1, title: 'مرتبات مدرسين' },
    supervisorsSalary: { num: 2, title: 'مرتبات المشرفين' },
    adminExpenses: { num: 3, title: 'مصاريف إدارية' },
    carnival: { num: 4, title: 'حسابات الكرنفال' },
    regionalSessions: { num: 5, title: 'حساب الجلسات الشهرية' },
    graduationParties: { num: 6, title: 'حسابات حفلات التخرج' },
    fieldVisits: { num: 7, title: 'حسابات الزيارات الميدانيه' },
    transport: { num: 8, title: 'حسابات مواصلات' },
    prints: { num: 9, title: 'حسابات مطبوعات' }
  };

  if (!isOpen) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-text" dir="rtl">
      
      {/* Container Card */}
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>طباعة تقرير الحسابات (ورق A4)</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                  A4 مخصص
                </span>
              </h2>
              <p className="text-xs text-indigo-200">
                اختر نوع التقرير المطلوب طباعته (مجمع، وارد فقط، منصرف فقط، أو بند محدد)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الآن (A4 / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scope Selector Ribbon (Hidden on print) */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 no-print shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setPrintScope('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                printScope === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. تقرير مجمع شامل (الوارد والمنصرف والعهدة)</span>
            </button>

            <button
              onClick={() => setPrintScope('custody')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                printScope === 'custody'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>2. تقرير الوارد فقط (العهدة)</span>
            </button>

            <button
              onClick={() => setPrintScope('expenses')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                printScope === 'expenses'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>3. تقرير المنصرف فقط (البنود 1-9)</span>
            </button>

            <button
              onClick={() => setPrintScope('single')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                printScope === 'single'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>4. تقرير بند محدد</span>
            </button>
          </div>

          {/* Sub-select if 'single' */}
          {printScope === 'single' && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-600">اختر البند:</span>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as ExpenseCategoryKey)}
                className="bg-white border border-indigo-300 font-bold text-indigo-900 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                {Object.entries(categoryNames).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.num}- {info.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Printable Paper Preview (Scrollable in modal, full page on Print) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
          
          {/* Real A4 Sheet Simulation */}
          <div className="bg-white mx-auto max-w-[210mm] min-h-[297mm] p-6 sm:p-10 shadow-lg print:shadow-none border border-slate-200 print:border-none print:m-0 print:w-full print:p-4 text-slate-900 text-sm print-sheet">
            
            {/* Official Report Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <h3 className="font-black text-sm text-slate-700">جمهورية مصر العربية</h3>
                  <h2 className="text-xl font-black text-slate-950 mt-0.5">مشروع صناع القادة</h2>
                  <span className="text-xs text-slate-600 font-bold block mt-0.5">منظومة الإدارة المالية والمحاسبية</span>
                </div>

                <div className="text-center px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 block">نوع المستند</span>
                  <span className="text-sm font-black text-slate-900">
                    {printScope === 'all' && 'تقرير مالي مجمع شامل (A4)'}
                    {printScope === 'custody' && 'كشف الوارد واستلام العهدة (A4)'}
                    {printScope === 'expenses' && 'كشف المنصرفات التشغيلية (A4)'}
                    {printScope === 'single' && `كشف حساب: ${categoryNames[activeCategory].title} (A4)`}
                  </span>
                </div>

                <div className="text-left text-xs space-y-1">
                  <div><span className="text-slate-500">التاريخ: </span><span className="font-bold font-mono">{printDate}</span></div>
                  <div><span className="text-slate-500">الإشراف: </span><span className="font-bold text-slate-900">Romany Adly</span></div>
                  <div><span className="text-slate-500">الرقم المرجعي: </span><span className="font-mono text-slate-600">FIN-{Date.now().toString().slice(-6)}</span></div>
                </div>
              </div>
            </div>

            {/* Financial Overview Banner (Shown on 'all', 'custody', 'expenses') */}
            {printScope !== 'single' && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="border border-slate-300 p-3 rounded-lg text-right bg-slate-50">
                  <span className="text-xs text-slate-600 block">إجمالي العهدة المستلمة (الوارد)</span>
                  <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                    {summary.totalCustody.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
                <div className="border border-slate-300 p-3 rounded-lg text-right bg-slate-50">
                  <span className="text-xs text-slate-600 block">إجمالي المنصرف الفعلي (البنود 1-9)</span>
                  <span className="text-lg font-black text-slate-900 font-mono tabular-nums">
                    {summary.totalSpent.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
                <div className={`border p-3 rounded-lg text-right ${
                  summary.remainingCustody >= 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                }`}>
                  <span className="text-xs text-slate-700 block font-bold">صافي رصيد العهدة (المتبقي)</span>
                  <span className="text-lg font-black font-mono tabular-nums">
                    {summary.remainingCustody.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            )}

            {/* CASE 1: ALL (مجمع شامل) */}
            {printScope === 'all' && (
              <div className="space-y-6">
                {/* 1. Summary of 9 Expense Items */}
                <div>
                  <h4 className="font-black text-sm text-slate-900 mb-2 border-r-4 border-indigo-700 pr-2">
                    أولاً: بيان إجماليات بنود المنصرف (البنود 1 إلى 9)
                  </h4>
                  <table className="w-full text-right text-xs border border-slate-300 mb-4">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-l border-slate-300">البند</th>
                        <th className="p-2 border-l border-slate-300">اسم بند المصروف</th>
                        <th className="p-2 border-l border-slate-300">عدد العمليات</th>
                        <th className="p-2 border-l border-slate-300 font-mono">الإجمالي (ج.م)</th>
                        <th className="p-2">النسبة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(categoryNames).map(([key, info]) => {
                        const total = summary.categoryTotals[key as ExpenseCategoryKey];
                        const pct = summary.totalSpent > 0 ? ((total / summary.totalSpent) * 100).toFixed(1) : '0';
                        return (
                          <tr key={key}>
                            <td className="p-2 border-l border-slate-300 font-mono text-center">{info.num}</td>
                            <td className="p-2 border-l border-slate-300 font-bold">{info.title}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{(accountsData[key as ExpenseCategoryKey] || []).length}</td>
                            <td className="p-2 border-l border-slate-300 font-bold font-mono">{total.toLocaleString('ar-EG')} ج.م</td>
                            <td className="p-2 font-mono">{pct}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100 font-black border-t-2 border-slate-900">
                      <tr>
                        <td colSpan={3} className="p-2 border-l border-slate-300">المجموع الكلي للمنصرفات:</td>
                        <td colSpan={2} className="p-2 font-mono text-sm">{summary.totalSpent.toLocaleString('ar-EG')} ج.م</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* 2. Custody Receipts Table */}
                <div>
                  <h4 className="font-black text-sm text-slate-900 mb-2 border-r-4 border-emerald-700 pr-2">
                    ثانياً: سجل استلام العهدة الشهرية (الوارد)
                  </h4>
                  <table className="w-full text-right text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-l border-slate-300">م</th>
                        <th className="p-2 border-l border-slate-300">من يد (المسلم)</th>
                        <th className="p-2 border-l border-slate-300">التاريخ</th>
                        <th className="p-2 border-l border-slate-300">الملاحظات</th>
                        <th className="p-2 font-mono">المبلغ (ج.م)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(accountsData.custodyReceipts || []).map((c, i) => (
                        <tr key={c.id || i}>
                          <td className="p-2 border-l border-slate-300 text-center font-mono">{i + 1}</td>
                          <td className="p-2 border-l border-slate-300 font-bold">{c.receivedFrom}</td>
                          <td className="p-2 border-l border-slate-300 font-mono">{c.date}</td>
                          <td className="p-2 border-l border-slate-300">{c.notes || '-'}</td>
                          <td className="p-2 font-bold font-mono">{c.amount?.toLocaleString('ar-EG')} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 font-black border-t-2 border-slate-900">
                      <tr>
                        <td colSpan={4} className="p-2 border-l border-slate-300">إجمالي العهدة المستلمة:</td>
                        <td className="p-2 font-mono text-sm">{summary.totalCustody.toLocaleString('ar-EG')} ج.م</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* CASE 2: CUSTODY ONLY (الوارد فقط) */}
            {printScope === 'custody' && (
              <div className="space-y-4">
                <h4 className="font-black text-sm text-slate-900 mb-2 border-r-4 border-emerald-700 pr-2">
                  كشف إيصالات استلام العهدة الشهرية وحركة الخصم التلقائي
                </h4>
                <table className="w-full text-right text-xs border border-slate-300 mb-4">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2.5 border-l border-slate-300">م</th>
                      <th className="p-2.5 border-l border-slate-300">من يد (جهة التسليم)</th>
                      <th className="p-2.5 border-l border-slate-300">التاريخ</th>
                      <th className="p-2.5 border-l border-slate-300">البيان والملاحظات</th>
                      <th className="p-2.5 font-mono">المبلغ المستلم (ج.م)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(accountsData.custodyReceipts || []).map((c, i) => (
                      <tr key={c.id || i}>
                        <td className="p-2.5 border-l border-slate-300 text-center font-mono">{i + 1}</td>
                        <td className="p-2.5 border-l border-slate-300 font-bold">{c.receivedFrom}</td>
                        <td className="p-2.5 border-l border-slate-300 font-mono">{c.date}</td>
                        <td className="p-2.5 border-l border-slate-300">{c.notes || '-'}</td>
                        <td className="p-2.5 font-bold font-mono text-emerald-800">{c.amount?.toLocaleString('ar-EG')} ج.م</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-black border-t-2 border-slate-900 text-xs">
                    <tr>
                      <td colSpan={4} className="p-2.5 border-l border-slate-300">1. إجمالي العهدة المستلمة:</td>
                      <td className="p-2.5 font-mono">{summary.totalCustody.toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-2.5 border-l border-slate-300">2. إجمالي المنصرف الفعلي المخصوم:</td>
                      <td className="p-2.5 font-mono text-rose-700">- {summary.totalSpent.toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                    <tr className="bg-slate-200">
                      <td colSpan={4} className="p-2.5 border-l border-slate-300 text-sm">3. صافي الرصيد المتبقي بالعهدة:</td>
                      <td className="p-2.5 font-mono text-sm font-black">{summary.remainingCustody.toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* CASE 3: EXPENSES ONLY (المنصرف فقط) */}
            {printScope === 'expenses' && (
              <div className="space-y-4">
                <h4 className="font-black text-sm text-slate-900 mb-2 border-r-4 border-rose-700 pr-2">
                  كشف بيان المصروفات التشغيلية المخصومة من العهدة
                </h4>
                <table className="w-full text-right text-xs border border-slate-300">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-l border-slate-300">#</th>
                      <th className="p-2 border-l border-slate-300">البند</th>
                      <th className="p-2 border-l border-slate-300">عدد الحركات</th>
                      <th className="p-2 border-l border-slate-300">طريقة الاحتساب</th>
                      <th className="p-2 font-mono">الإجمالي (ج.م)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {Object.entries(categoryNames).map(([key, info]) => {
                      const total = summary.categoryTotals[key as ExpenseCategoryKey];
                      return (
                        <tr key={key}>
                          <td className="p-2 border-l border-slate-300 font-mono text-center">{info.num}</td>
                          <td className="p-2 border-l border-slate-300 font-bold">{info.title}</td>
                          <td className="p-2 border-l border-slate-300 font-mono">{(accountsData[key as ExpenseCategoryKey] || []).length}</td>
                          <td className="p-2 border-l border-slate-300 text-slate-600">
                            {key === 'teachersSalary' && 'العدد × المرتب'}
                            {key === 'supervisorsSalary' && 'المرتب + خط السير'}
                            {key === 'adminExpenses' && 'العدد × التكلفة'}
                            {key === 'carnival' && 'مجموع البنود'}
                            {key === 'regionalSessions' && 'تكلفة جلسة المنطقة'}
                            {key === 'graduationParties' && 'تكلفة حفل المنطقة'}
                            {key === 'fieldVisits' && 'تكلفة زيارة المنطقة'}
                            {key === 'transport' && 'العدد × التكلفة'}
                            {key === 'prints' && 'الكمية × سعر النسخة'}
                          </td>
                          <td className="p-2 font-bold font-mono">{total.toLocaleString('ar-EG')} ج.م</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 font-black border-t-2 border-slate-900">
                    <tr>
                      <td colSpan={4} className="p-2.5 border-l border-slate-300">الإجمالي العام للمنصرفات:</td>
                      <td className="p-2.5 font-mono text-sm">{summary.totalSpent.toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* CASE 4: SINGLE CATEGORY (لكل بند على حدة) */}
            {printScope === 'single' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-500 font-bold">بند رقم {categoryNames[activeCategory].num}</span>
                    <h3 className="text-base font-black text-slate-900">{categoryNames[activeCategory].title}</h3>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-xs text-slate-500 block">إجمالي هذا البند:</span>
                    <span className="text-lg font-black text-slate-900">
                      {summary.categoryTotals[activeCategory].toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </div>

                {/* Detailed Table for Active Category */}
                <table className="w-full text-right text-xs border border-slate-300">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-l border-slate-300">م</th>
                      {activeCategory === 'teachersSalary' && (
                        <>
                          <th className="p-2 border-l border-slate-300">العدد</th>
                          <th className="p-2 border-l border-slate-300">المرتب الفردي</th>
                          <th className="p-2 border-l border-slate-300">الشهر</th>
                          <th className="p-2 border-l border-slate-300">الملاحظات</th>
                          <th className="p-2 font-mono">الإجمالي</th>
                        </>
                      )}
                      {activeCategory === 'supervisorsSalary' && (
                        <>
                          <th className="p-2 border-l border-slate-300">الاسم</th>
                          <th className="p-2 border-l border-slate-300">المرتب</th>
                          <th className="p-2 border-l border-slate-300">خط السير</th>
                          <th className="p-2 border-l border-slate-300">ملاحظات</th>
                          <th className="p-2 font-mono">الإجمالي</th>
                        </>
                      )}
                      {activeCategory === 'adminExpenses' && (
                        <>
                          <th className="p-2 border-l border-slate-300">البند</th>
                          <th className="p-2 border-l border-slate-300">العدد</th>
                          <th className="p-2 border-l border-slate-300">التكلفة</th>
                          <th className="p-2 border-l border-slate-300">ملاحظات</th>
                          <th className="p-2 font-mono">الإجمالي</th>
                        </>
                      )}
                      {activeCategory === 'carnival' && (
                        <>
                          <th className="p-2 border-l border-slate-300">الفعالية</th>
                          <th className="p-2 border-l border-slate-300">بريك</th>
                          <th className="p-2 border-l border-slate-300">ملاعب</th>
                          <th className="p-2 border-l border-slate-300">قاعات</th>
                          <th className="p-2 border-l border-slate-300">حفلات</th>
                          <th className="p-2 border-l border-slate-300">أخرى</th>
                          <th className="p-2 font-mono">الإجمالي</th>
                        </>
                      )}
                      {(activeCategory === 'regionalSessions' || activeCategory === 'graduationParties' || activeCategory === 'fieldVisits') && (
                        <>
                          <th className="p-2 border-l border-slate-300">المنطقة</th>
                          <th className="p-2 border-l border-slate-300">التاريخ</th>
                          <th className="p-2 border-l border-slate-300">البيان / ملاحظات</th>
                          <th className="p-2 font-mono">التكلفة</th>
                        </>
                      )}
                      {activeCategory === 'transport' && (
                        <>
                          <th className="p-2 border-l border-slate-300">البلد / الوجهة</th>
                          <th className="p-2 border-l border-slate-300">العدد</th>
                          <th className="p-2 border-l border-slate-300">التكلفة</th>
                          <th className="p-2 border-l border-slate-300">ملاحظات</th>
                          <th className="p-2 font-mono">الإجمالي</th>
                        </>
                      )}
                      {activeCategory === 'prints' && (
                        <>
                          <th className="p-2 border-l border-slate-300">البند</th>
                          <th className="p-2 border-l border-slate-300">الكمية</th>
                          <th className="p-2 border-l border-slate-300">التكلفة للنسخة</th>
                          <th className="p-2 border-l border-slate-300">ملاحظات</th>
                          <th className="p-2 font-mono">الإجمالي</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(accountsData[activeCategory] as any[]).map((row, i) => (
                      <tr key={row.id || i}>
                        <td className="p-2 border-l border-slate-300 text-center font-mono">{i + 1}</td>
                        {activeCategory === 'teachersSalary' && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.count}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.salary?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300">{row.period || '-'}</td>
                            <td className="p-2 border-l border-slate-300">{row.notes || '-'}</td>
                            <td className="p-2 font-bold font-mono">{row.total?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                        {activeCategory === 'supervisorsSalary' && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-bold">{row.name}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.salary?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.routeAllowance?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300">{row.notes || '-'}</td>
                            <td className="p-2 font-bold font-mono">{row.total?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                        {activeCategory === 'adminExpenses' && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-bold">{row.itemTitle}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.count}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.cost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300">{row.notes || '-'}</td>
                            <td className="p-2 font-bold font-mono">{row.total?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                        {activeCategory === 'carnival' && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-bold">{row.name}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.breakCost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.playgroundCost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.hallsCost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.partiesCost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.otherCost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 font-bold font-mono">{row.total?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                        {(activeCategory === 'regionalSessions' || activeCategory === 'graduationParties' || activeCategory === 'fieldVisits') && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-bold">{row.region}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.date || row.createdAt || '-'}</td>
                            <td className="p-2 border-l border-slate-300">{row.batchName || row.purpose || row.notes || '-'}</td>
                            <td className="p-2 font-bold font-mono">{row.cost?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                        {activeCategory === 'transport' && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-bold">{row.destination}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.count}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.cost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300">{row.notes || '-'}</td>
                            <td className="p-2 font-bold font-mono">{row.total?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                        {activeCategory === 'prints' && (
                          <>
                            <td className="p-2 border-l border-slate-300 font-bold">{row.itemTitle}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.count}</td>
                            <td className="p-2 border-l border-slate-300 font-mono">{row.cost?.toLocaleString('ar-EG')}</td>
                            <td className="p-2 border-l border-slate-300">{row.notes || '-'}</td>
                            <td className="p-2 font-bold font-mono">{row.total?.toLocaleString('ar-EG')} ج.م</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-black border-t-2 border-slate-900">
                    <tr>
                      <td colSpan={2} className="p-2 border-l border-slate-300">الإجمالي النهائي للبند:</td>
                      <td colSpan={5} className="p-2 font-mono text-sm">{summary.categoryTotals[activeCategory].toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Official Signatures Block at bottom of A4 Sheet */}
            <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-8">
                <span className="font-bold text-slate-700 block">المسؤول عن الصرف / المستلم</span>
                <span className="block border-b border-dashed border-slate-400 w-32 mx-auto"></span>
                <span className="text-[11px] text-slate-400">التوقيع والتاريخ</span>
              </div>

              <div className="space-y-8">
                <span className="font-bold text-slate-700 block">المراجع المالي / أمانة الصندوق</span>
                <span className="block border-b border-dashed border-slate-400 w-32 mx-auto"></span>
                <span className="text-[11px] text-slate-400">التوقيع والتاريخ</span>
              </div>

              <div className="space-y-8">
                <span className="font-bold text-slate-900 block">اعتماد مشرف المشروع العام</span>
                <span className="font-black text-slate-950 block text-sm">أ/ Romany Adly</span>
                <span className="text-[11px] text-slate-400">خاتم والاعتماد الرسمي</span>
              </div>
            </div>

            {/* Print Footer note */}
            <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2">
              طُبع هذا المستند رسمياً من تطبيق إدارة صناع القادة • تم الضبط والتحقق المالي إلكترونياً
            </div>

          </div>
        </div>

      </div>

      {/* Global Print Style for A4 Standard */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-sheet, .print-sheet * {
            visibility: visible;
          }
          .print-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};
