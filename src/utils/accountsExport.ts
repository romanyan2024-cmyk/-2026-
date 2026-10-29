import * as XLSX from 'xlsx';
import { ProjectAccountsData, ExpenseCategoryKey } from '../types/accounts';
import { calculateAccountsSummary } from './storage';

// Helper to format date in Arabic locale or ISO
const getFormattedDate = () => new Date().toISOString().slice(0, 10);

/**
 * Professional Excel Workbook Export for Google Sheets & Microsoft Excel
 * Contains multiple sheets with formatted headers, auto column width, and totals.
 */
export function exportAllAccountsToExcel(data: ProjectAccountsData) {
  const wb = XLSX.utils.book_new();
  const summary = calculateAccountsSummary(data);
  const today = getFormattedDate();

  // 1. Sheet 1: الميزانية العامة والملخص (Summary)
  const summaryRows: any[][] = [
    ['مشروع صناع القادة - التقرير المالي المجمع الشامل'],
    [`تاريخ التصدير: ${today}`, '', 'إشراف: Romany Adly'],
    [],
    ['البيان المالي الرئيسي', 'المبلغ (جنيه مصري)', 'النسبة المئوية', 'الحالة'],
    ['إجمالي العهدة المستلمة (الوارد)', summary.totalCustody, '100%', 'وارد رسمي'],
    ['إجمالي المصروفات الفعلية (المنصرف)', summary.totalSpent, `${summary.spentRatio.toFixed(1)}%`, 'منصرف تشغيلي'],
    [
      'صافي رصيد العهدة (المتبقي)',
      summary.remainingCustody,
      `${(100 - summary.spentRatio).toFixed(1)}%`,
      summary.remainingCustody >= 0 ? 'فائض متوفر' : 'عجز مستحق'
    ],
    [],
    ['تفصيل بنود المنصرف (البنود 1 إلى 9)'],
    ['رقم البند', 'اسم البند', 'عدد العمليات', 'إجمالي المبلغ (ج.م)', 'نسبته من المنصرف'],
    ['1', 'مرتبات مدرسين', (data.teachersSalary || []).length, summary.categoryTotals.teachersSalary, `${((summary.categoryTotals.teachersSalary / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['2', 'مرتبات المشرفين', (data.supervisorsSalary || []).length, summary.categoryTotals.supervisorsSalary, `${((summary.categoryTotals.supervisorsSalary / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['3', 'مصاريف إدارية', (data.adminExpenses || []).length, summary.categoryTotals.adminExpenses, `${((summary.categoryTotals.adminExpenses / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['4', 'حسابات الكرنفال', (data.carnival || []).length, summary.categoryTotals.carnival, `${((summary.categoryTotals.carnival / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['5', 'حساب الجلسات الشهرية', (data.regionalSessions || []).length, summary.categoryTotals.regionalSessions, `${((summary.categoryTotals.regionalSessions / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['6', 'حسابات حفلات التخرج', (data.graduationParties || []).length, summary.categoryTotals.graduationParties, `${((summary.categoryTotals.graduationParties / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['7', 'حسابات الزيارات الميدانيه', (data.fieldVisits || []).length, summary.categoryTotals.fieldVisits, `${((summary.categoryTotals.fieldVisits / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['8', 'حسابات مواصلات', (data.transport || []).length, summary.categoryTotals.transport, `${((summary.categoryTotals.transport / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['9', 'حسابات مطبوعات', (data.prints || []).length, summary.categoryTotals.prints, `${((summary.categoryTotals.prints / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    [],
    ['المجموع الكلي للمنصرفات', '', '', summary.totalSpent, '100%']
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'الملخص العام');

  // 2. Sheet 2: الوارد - استلام العهدة الشهرية
  const custodyRows: any[][] = [
    ['مشروع صناع القادة - سجل استلام العهدة الشهرية (الوارد)'],
    [`تاريخ التقرير: ${today}`],
    [],
    ['م', 'من يد (المسلم)', 'المبلغ المستلم (ج.م)', 'التاريخ', 'ملاحظات ورقم الإيصال']
  ];
  (data.custodyReceipts || []).forEach((item, idx) => {
    custodyRows.push([idx + 1, item.receivedFrom, item.amount, item.date, item.notes || '-']);
  });
  custodyRows.push([]);
  custodyRows.push(['', 'إجمالي الوارد (العهدة المستلمة):', summary.totalCustody, '', '']);
  custodyRows.push(['', 'إجمالي المنصرف المخصوم تلقائياً:', summary.totalSpent, '', '']);
  custodyRows.push(['', 'صافي المتبقي بالعهدة:', summary.remainingCustody, '', '']);
  const wsCustody = XLSX.utils.aoa_to_sheet(custodyRows);
  XLSX.utils.book_append_sheet(wb, wsCustody, 'الوارد (العهدة)');

  // 3. Sheet 3: 1- مرتبات المدرسين
  const tsRows: any[][] = [
    ['1- مرتبات المدرسين'],
    ['م', 'العدد (المعلمين)', 'المرتب الفردي (ج.م)', 'الشهر / الدفعة', 'الملاحظات', 'الإجمالي (ج.م)']
  ];
  (data.teachersSalary || []).forEach((item, idx) => {
    tsRows.push([idx + 1, item.count, item.salary, item.period || '-', item.notes || '-', item.total]);
  });
  tsRows.push(['', 'الإجمالي العام لمرتبات المدرسين:', '', '', '', summary.categoryTotals.teachersSalary]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tsRows), '1- مرتبات مدرسين');

  // 4. Sheet 4: 2- مرتبات المشرفين
  const ssRows: any[][] = [
    ['2- مرتبات المشرفين'],
    ['م', 'اسم المشرف', 'المرتب (ج.م)', 'خط السير (ج.م)', 'ملاحظات', 'الإجمالي (ج.م)']
  ];
  (data.supervisorsSalary || []).forEach((item, idx) => {
    ssRows.push([idx + 1, item.name, item.salary, item.routeAllowance, item.notes || '-', item.total]);
  });
  ssRows.push(['', 'الإجمالي العام لمرتبات المشرفين:', '', '', '', summary.categoryTotals.supervisorsSalary]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ssRows), '2- مرتبات المشرفين');

  // 5. Sheet 5: 3- مصاريف إدارية
  const aeRows: any[][] = [
    ['3- مصاريف إدارية'],
    ['م', 'البند', 'العدد', 'التكلفة (ج.م)', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']
  ];
  (data.adminExpenses || []).forEach((item, idx) => {
    aeRows.push([idx + 1, item.itemTitle, item.count, item.cost, item.date || '-', item.notes || '-', item.total]);
  });
  aeRows.push(['', 'الإجمالي العام للمصاريف الإدارية:', '', '', '', '', summary.categoryTotals.adminExpenses]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aeRows), '3- مصاريف إدارية');

  // 6. Sheet 6: 4- حسابات الكرنفال
  const ceRows: any[][] = [
    ['4- حسابات الكرنفال'],
    ['م', 'اسم الفعالية', 'تكلفة البريك', 'تكلفة ملاعب', 'تكلفة قاعات', 'حفلات', 'أخرى', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']
  ];
  (data.carnival || []).forEach((item, idx) => {
    ceRows.push([
      idx + 1,
      item.name || 'كرنفال',
      item.breakCost,
      item.playgroundCost,
      item.hallsCost,
      item.partiesCost,
      item.otherCost,
      item.date || '-',
      item.notes || '-',
      item.total
    ]);
  });
  ceRows.push(['', 'الإجمالي العام لحسابات الكرنفال:', '', '', '', '', '', '', '', summary.categoryTotals.carnival]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ceRows), '4- حسابات الكرنفال');

  // 7. Sheet 7: 5- حساب الجلسات الشهرية
  const rsRows: any[][] = [
    ['5- حساب الجلسات الشهرية'],
    ['م', 'المنطقة', 'التاريخ', 'موضوع الجلسة / ملاحظات', 'التكلفة (ج.م)']
  ];
  (data.regionalSessions || []).forEach((item, idx) => {
    rsRows.push([idx + 1, item.region, item.date || item.createdAt || '-', item.notes || '-', item.cost]);
  });
  rsRows.push(['', 'الإجمالي العام للجلسات الشهرية:', '', '', summary.categoryTotals.regionalSessions]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rsRows), '5- جلسات شهرية');

  // 8. Sheet 8: 6- حسابات حفلات التخرج
  const gpRows: any[][] = [
    ['6- حسابات حفلات التخرج'],
    ['م', 'المنطقة', 'الدفعة / الفوج', 'التاريخ', 'ملاحظات', 'التكلفة (ج.م)']
  ];
  (data.graduationParties || []).forEach((item, idx) => {
    gpRows.push([idx + 1, item.region, item.batchName || '-', item.date || '-', item.notes || '-', item.cost]);
  });
  gpRows.push(['', 'الإجمالي العام لحفلات التخرج:', '', '', '', summary.categoryTotals.graduationParties]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(gpRows), '6- حفلات تخرج');

  // 9. Sheet 9: 7- حسابات الزيارات الميدانيه
  const fvRows: any[][] = [
    ['7- حسابات الزيارات الميدانيه'],
    ['م', 'المنطقة', 'هدف الزيارة', 'التاريخ', 'ملاحظات', 'التكلفة (ج.م)']
  ];
  (data.fieldVisits || []).forEach((item, idx) => {
    fvRows.push([idx + 1, item.region, item.purpose || '-', item.date || '-', item.notes || '-', item.cost]);
  });
  fvRows.push(['', 'الإجمالي العام للزيارات الميدانية:', '', '', '', summary.categoryTotals.fieldVisits]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(fvRows), '7- زيارات ميدانية');

  // 10. Sheet 10: 8- حسابات مواصلات
  const trRows: any[][] = [
    ['8- حسابات مواصلات'],
    ['م', 'البلد / الوجهة', 'العدد (الرحلات/الأفراد)', 'التكلفة الفردية (ج.م)', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']
  ];
  (data.transport || []).forEach((item, idx) => {
    trRows.push([idx + 1, item.destination, item.count, item.cost, item.date || '-', item.notes || '-', item.total]);
  });
  trRows.push(['', 'الإجمالي العام لحسابات المواصلات:', '', '', '', '', summary.categoryTotals.transport]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(trRows), '8- حسابات مواصلات');

  // 11. Sheet 11: 9- حسابات مطبوعات
  const prRows: any[][] = [
    ['9- حسابات مطبوعات'],
    ['م', 'البند (نوع المطبوعات)', 'العدد (الكمية)', 'التكلفة للنسخة (ج.م)', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']
  ];
  (data.prints || []).forEach((item, idx) => {
    prRows.push([idx + 1, item.itemTitle, item.count, item.cost, item.date || '-', item.notes || '-', item.total]);
  });
  prRows.push(['', 'الإجمالي العام لحسابات المطبوعات:', '', '', '', '', summary.categoryTotals.prints]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(prRows), '9- حسابات مطبوعات');

  // Save the full Excel workbook
  XLSX.writeFile(wb, `مشروع_صناع_القادة_حسابات_المشروع_شيت_مجمع_${today}.xlsx`);
}

/**
 * Export ONLY the Custody / Income (الوارد) to a clean Excel file
 */
export function exportCustodyToExcel(data: ProjectAccountsData) {
  const wb = XLSX.utils.book_new();
  const summary = calculateAccountsSummary(data);
  const today = getFormattedDate();

  const rows: any[][] = [
    ['مشروع صناع القادة - كشف استلام العهدة الشهرية (الوارد)'],
    [`تاريخ الاستخراج: ${today}`, '', 'إشراف: Romany Adly'],
    [],
    ['م', 'من يد (المسلم)', 'المبلغ المستلم (ج.م)', 'تاريخ الاستلام', 'ملاحظات ورقم المستند']
  ];

  (data.custodyReceipts || []).forEach((item, idx) => {
    rows.push([idx + 1, item.receivedFrom, item.amount, item.date, item.notes || '-']);
  });

  rows.push([]);
  rows.push(['', 'إجمالي العهدة المستلمة (الوارد):', summary.totalCustody, 'ج.م', '']);
  rows.push(['', 'إجمالي المنصرف الفعلي (مخصوم):', summary.totalSpent, 'ج.م', '']);
  rows.push(['', 'صافي الرصيد المتبقي بالعهدة:', summary.remainingCustody, 'ج.م', summary.remainingCustody >= 0 ? 'فائض' : 'عجز']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'سجل العهدة الوارد');
  XLSX.writeFile(wb, `مشروع_صناع_القادة_سجل_العهدة_الوارد_${today}.xlsx`);
}

/**
 * Export ONLY Expenses (المنصرف - البنود 1 إلى 9) to an Excel file
 */
export function exportExpensesToExcel(data: ProjectAccountsData) {
  const wb = XLSX.utils.book_new();
  const summary = calculateAccountsSummary(data);
  const today = getFormattedDate();

  // Overview Sheet
  const overviewRows: any[][] = [
    ['مشروع صناع القادة - كشف إجمالي المنصرفات والمصروفات التشغيلية'],
    [`تاريخ الاستخراج: ${today}`, '', 'إشراف: Romany Adly'],
    [],
    ['رقم البند', 'اسم البند', 'عدد العمليات', 'الإجمالي (ج.م)', 'النسبة من إجمالي المنصرف'],
    ['1', 'مرتبات مدرسين', (data.teachersSalary || []).length, summary.categoryTotals.teachersSalary, `${((summary.categoryTotals.teachersSalary / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['2', 'مرتبات المشرفين', (data.supervisorsSalary || []).length, summary.categoryTotals.supervisorsSalary, `${((summary.categoryTotals.supervisorsSalary / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['3', 'مصاريف إدارية', (data.adminExpenses || []).length, summary.categoryTotals.adminExpenses, `${((summary.categoryTotals.adminExpenses / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['4', 'حسابات الكرنفال', (data.carnival || []).length, summary.categoryTotals.carnival, `${((summary.categoryTotals.carnival / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['5', 'حساب الجلسات الشهرية', (data.regionalSessions || []).length, summary.categoryTotals.regionalSessions, `${((summary.categoryTotals.regionalSessions / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['6', 'حسابات حفلات التخرج', (data.graduationParties || []).length, summary.categoryTotals.graduationParties, `${((summary.categoryTotals.graduationParties / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['7', 'حسابات الزيارات الميدانيه', (data.fieldVisits || []).length, summary.categoryTotals.fieldVisits, `${((summary.categoryTotals.fieldVisits / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['8', 'حسابات مواصلات', (data.transport || []).length, summary.categoryTotals.transport, `${((summary.categoryTotals.transport / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    ['9', 'حسابات مطبوعات', (data.prints || []).length, summary.categoryTotals.prints, `${((summary.categoryTotals.prints / (summary.totalSpent || 1)) * 100).toFixed(1)}%`],
    [],
    ['الإجمالي الكلي للمنصرف:', '', '', summary.totalSpent, '100%']
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overviewRows), 'ملخص المنصرف');

  // Detailed Expense Rows on unified ledger sheet
  const allExpenseRows: any[][] = [
    ['مشروع صناع القادة - دفتر اليومية المفصل لكافة المنصرفات'],
    [],
    ['م', 'نوع البند', 'البيان والتفاصيل', 'العدد / الكمية', 'القيمة الفردية', 'التاريخ', 'الإجمالي (ج.م)']
  ];
  let counter = 1;

  (data.teachersSalary || []).forEach(t => {
    allExpenseRows.push([counter++, 'مرتبات مدرسين', `دفعة معلمين - ${t.notes || t.period || ''}`, t.count, t.salary, t.createdAt, t.total]);
  });
  (data.supervisorsSalary || []).forEach(s => {
    allExpenseRows.push([counter++, 'مرتبات المشرفين', `${s.name} (خط سير: ${s.routeAllowance} ج.م)`, 1, s.salary, s.createdAt, s.total]);
  });
  (data.adminExpenses || []).forEach(a => {
    allExpenseRows.push([counter++, 'مصاريف إدارية', `${a.itemTitle} (${a.notes || ''})`, a.count, a.cost, a.date || a.createdAt, a.total]);
  });
  (data.carnival || []).forEach(c => {
    allExpenseRows.push([counter++, 'حسابات الكرنفال', `${c.name || 'كرنفال'} - بريك:${c.breakCost}، ملاعب:${c.playgroundCost}، قاعات:${c.hallsCost}`, 1, c.total, c.date || c.createdAt, c.total]);
  });
  (data.regionalSessions || []).forEach(r => {
    allExpenseRows.push([counter++, 'جلسات شهرية', `جلسة منطقة ${r.region} - ${r.notes || ''}`, 1, r.cost, r.date || r.createdAt, r.cost]);
  });
  (data.graduationParties || []).forEach(g => {
    allExpenseRows.push([counter++, 'حفلات تخرج', `حفل منطقة ${g.region} - ${g.batchName || ''}`, 1, g.cost, g.date || g.createdAt, g.cost]);
  });
  (data.fieldVisits || []).forEach(f => {
    allExpenseRows.push([counter++, 'زيارات ميدانية', `زيارة منطقة ${f.region} - ${f.purpose || ''}`, 1, f.cost, f.date || f.createdAt, f.cost]);
  });
  (data.transport || []).forEach(tr => {
    allExpenseRows.push([counter++, 'حسابات مواصلات', `انتقالات ${tr.destination} - ${tr.notes || ''}`, tr.count, tr.cost, tr.date || tr.createdAt, tr.total]);
  });
  (data.prints || []).forEach(pr => {
    allExpenseRows.push([counter++, 'حسابات مطبوعات', `${pr.itemTitle} - ${pr.notes || ''}`, pr.count, pr.cost, pr.date || pr.createdAt, pr.total]);
  });

  allExpenseRows.push([]);
  allExpenseRows.push(['', '', '', '', '', 'المجموع الكلي للمنصرفات:', summary.totalSpent]);

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(allExpenseRows), 'تفاصيل المنصرف الكاملة');
  XLSX.writeFile(wb, `مشروع_صناع_القادة_كشف_المنصرفات_${today}.xlsx`);
}

/**
 * Export a Single Selected Category to Excel
 */
export function exportSingleCategoryToExcel(data: ProjectAccountsData, key: ExpenseCategoryKey) {
  const wb = XLSX.utils.book_new();
  const summary = calculateAccountsSummary(data);
  const today = getFormattedDate();

  const namesMap: Record<ExpenseCategoryKey, string> = {
    teachersSalary: 'مرتبات مدرسين',
    supervisorsSalary: 'مرتبات المشرفين',
    adminExpenses: 'مصاريف إدارية',
    carnival: 'حسابات الكرنفال',
    regionalSessions: 'حساب الجلسات الشهرية',
    graduationParties: 'حسابات حفلات التخرج',
    fieldVisits: 'حسابات الزيارات الميدانيه',
    transport: 'حسابات مواصلات',
    prints: 'حسابات مطبوعات'
  };

  const title = namesMap[key];
  const list = (data[key] as any[]) || [];
  const rows: any[][] = [
    [`مشروع صناع القادة - كشف (${title})`],
    [`تاريخ الاستخراج: ${today}`, '', 'إشراف: Romany Adly'],
    []
  ];

  if (key === 'teachersSalary') {
    rows.push(['م', 'العدد', 'المرتب الفردي', 'الشهر / الدفعة', 'الملاحظات', 'الإجمالي (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.count, r.salary, r.period || '-', r.notes || '-', r.total]));
  } else if (key === 'supervisorsSalary') {
    rows.push(['م', 'اسم المشرف', 'المرتب', 'خط السير', 'ملاحظات', 'الإجمالي (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.name, r.salary, r.routeAllowance, r.notes || '-', r.total]));
  } else if (key === 'adminExpenses') {
    rows.push(['م', 'البند', 'العدد', 'التكلفة', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.itemTitle, r.count, r.cost, r.date || '-', r.notes || '-', r.total]));
  } else if (key === 'carnival') {
    rows.push(['م', 'الفعالية', 'بريك', 'ملاعب', 'قاعات', 'حفلات', 'أخرى', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.name || 'كرنفال', r.breakCost, r.playgroundCost, r.hallsCost, r.partiesCost, r.otherCost, r.date || '-', r.notes || '-', r.total]));
  } else if (key === 'regionalSessions') {
    rows.push(['م', 'المنطقة', 'التاريخ', 'موضوع الجلسة / ملاحظات', 'التكلفة (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.region, r.date || '-', r.notes || '-', r.cost]));
  } else if (key === 'graduationParties') {
    rows.push(['م', 'المنطقة', 'الدفعة', 'التاريخ', 'ملاحظات', 'التكلفة (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.region, r.batchName || '-', r.date || '-', r.notes || '-', r.cost]));
  } else if (key === 'fieldVisits') {
    rows.push(['م', 'المنطقة', 'هدف الزيارة', 'التاريخ', 'ملاحظات', 'التكلفة (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.region, r.purpose || '-', r.date || '-', r.notes || '-', r.cost]));
  } else if (key === 'transport') {
    rows.push(['م', 'البلد / الوجهة', 'العدد', 'التكلفة', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.destination, r.count, r.cost, r.date || '-', r.notes || '-', r.total]));
  } else if (key === 'prints') {
    rows.push(['م', 'البند', 'الكمية', 'التكلفة للنسخة', 'التاريخ', 'ملاحظات', 'الإجمالي (ج.م)']);
    list.forEach((r, i) => rows.push([i + 1, r.itemTitle, r.count, r.cost, r.date || '-', r.notes || '-', r.total]));
  }

  rows.push([]);
  rows.push(['', 'إجمالي البند:', '', '', '', summary.categoryTotals[key]]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, `مشروع_صناع_القادة_${title.replace(/\s+/g, '_')}_${today}.xlsx`);
}
