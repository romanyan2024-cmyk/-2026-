import { ProjectAccountsData } from '../types/accounts';

export const initialProjectAccounts: ProjectAccountsData = {
  // 1- مرتبات مدرسين
  teachersSalary: [
    {
      id: 'ts-1',
      count: 28,
      salary: 600,
      total: 16800,
      period: 'شهر فبراير 2025',
      notes: 'دفعة معلمي المستوى الأول بجميع المراكز',
      createdAt: '2025-02-01'
    },
    {
      id: 'ts-2',
      count: 15,
      salary: 650,
      total: 9750,
      period: 'شهر فبراير 2025',
      notes: 'دفعة معلمي المستوى الثاني والمتميزين',
      createdAt: '2025-02-02'
    }
  ],

  // 2- مرتبات المشرفين
  supervisorsSalary: [
    {
      id: 'ss-1',
      name: 'أ/ يوسف حنا',
      salary: 2800,
      routeAllowance: 700,
      total: 3500,
      period: 'شهر فبراير 2025',
      notes: 'إشراف ومتابعة منطقة بني مزار ومغاغة',
      createdAt: '2025-02-01'
    },
    {
      id: 'ss-2',
      name: 'أ/ عماد لندي',
      salary: 2800,
      routeAllowance: 850,
      total: 3650,
      period: 'شهر فبراير 2025',
      notes: 'إشراف ومتابعة منطقة الفشن وببا وسمسطا',
      createdAt: '2025-02-01'
    },
    {
      id: 'ss-3',
      name: 'أ/ لابان وليم',
      salary: 2800,
      routeAllowance: 650,
      total: 3450,
      period: 'شهر فبراير 2025',
      notes: 'إشراف ومتابعة منطقة ملوي ودير مواس',
      createdAt: '2025-02-01'
    }
  ],

  // 3- مصاريف إدارية
  adminExpenses: [
    {
      id: 'ae-1',
      itemTitle: 'أدوات مكتبية ومستلزمات تصوير وتوثيق',
      count: 4,
      cost: 350,
      total: 1400,
      date: '2025-02-04',
      notes: 'أوراق وفايلات وملفات للمراكز الإدارية',
      createdAt: '2025-02-04'
    },
    {
      id: 'ae-2',
      itemTitle: 'ضيافة اجتماعات المشرفين الشهرية',
      count: 2,
      cost: 450,
      total: 900,
      date: '2025-02-08',
      notes: 'مشروبات ومأكولات خفيفة خلال اللقاء التنسيقي',
      createdAt: '2025-02-08'
    }
  ],

  // 4- حسابات الكرنفال
  carnival: [
    {
      id: 'ce-1',
      name: 'كرنفال الأبطال السنوي للأطفال',
      breakCost: 4200,
      playgroundCost: 3500,
      hallsCost: 3000,
      partiesCost: 2500,
      otherCost: 1100,
      total: 14300,
      date: '2025-02-10',
      notes: 'يوم ترفيهي وتربوي مجمع لأطفال المراكز',
      createdAt: '2025-02-10'
    }
  ],

  // 5- حساب الجلسات الشهرية
  regionalSessions: [
    {
      id: 'rs-1',
      region: 'ابوقرقاص',
      cost: 1600,
      date: '2025-02-06',
      notes: 'جلسة التطوير المهني لمعلمي مركز ابوقرقاص',
      createdAt: '2025-02-06'
    },
    {
      id: 'rs-2',
      region: 'بني مزار ومغاغة',
      cost: 1900,
      date: '2025-02-07',
      notes: 'ورشة عمل مهارات التدريس والقيادة',
      createdAt: '2025-02-07'
    }
  ],

  // 6- حسابات حفلات التخرج
  graduationParties: [
    {
      id: 'gp-1',
      region: 'ملوي',
      cost: 4800,
      date: '2025-01-25',
      batchName: 'حفل تخرج أبطال المستوى الثاني',
      notes: 'توزيع الشهادات والجوائز التقديرية',
      createdAt: '2025-01-25'
    }
  ],

  // 7- حسابات الزيارات الميدانيه
  fieldVisits: [
    {
      id: 'fv-1',
      region: 'الفشن وببا وسمسطا',
      cost: 1450,
      date: '2025-02-12',
      purpose: 'زيارة ميدانية وتفقد فصول قرى الفشن وسمسطا',
      notes: 'تقييم بيئة التعلم وحصر احتياجات الفصول',
      createdAt: '2025-02-12'
    },
    {
      id: 'fv-2',
      region: 'سمالوط',
      cost: 1100,
      date: '2025-02-14',
      purpose: 'متابعة الفصول والاطمئنان على سير البرنامج',
      notes: 'لقاء مع الخدام وأولياء الأمور',
      createdAt: '2025-02-14'
    }
  ],

  // 8- حسابات مواصلات
  transport: [
    {
      id: 'tr-1',
      destination: 'بني مزار - صندفا والقيس',
      count: 6,
      cost: 320,
      total: 1920,
      date: '2025-02-03',
      notes: 'انتقالات فريق الإشراف للقرى البعيدة',
      createdAt: '2025-02-03'
    },
    {
      id: 'tr-2',
      destination: 'سمسطا - بدهل ومازورة',
      count: 4,
      cost: 300,
      total: 1200,
      date: '2025-02-09',
      notes: 'نقل مواد تعليمية وكتب الفصول',
      createdAt: '2025-02-09'
    }
  ],

  // 9- حسابات مطبوعات
  prints: [
    {
      id: 'pr-1',
      itemTitle: 'كراسات الواجب وأوراق أنشطة مهارية',
      count: 350,
      cost: 15,
      total: 5250,
      date: '2025-02-02',
      notes: 'طباعة مجلدات الأنشطة التفاعلية للأطفال',
      createdAt: '2025-02-02'
    },
    {
      id: 'pr-2',
      itemTitle: 'شهادات تقدير وبطاقات تشجيعية ملونة',
      count: 180,
      cost: 8,
      total: 1440,
      date: '2025-02-05',
      notes: 'شهادات شرف للمتفوقين في الحضور والحفظ',
      createdAt: '2025-02-05'
    }
  ],

  // 10- استلام العهدة الشهرية
  custodyReceipts: [
    {
      id: 'cr-1',
      receivedFrom: 'أ/ روماني عدلي (إدارة المشروع)',
      amount: 60000,
      date: '2025-02-01',
      notes: 'الدفعة الأولى للعهدة المالية لشهر فبراير 2025 - تحويل بنكي رسمي',
      createdAt: '2025-02-01'
    },
    {
      id: 'cr-2',
      receivedFrom: 'أمانة الصندوق والماليات',
      amount: 25000,
      date: '2025-02-10',
      notes: 'دفعة تعزيز إضافية للكرنفال والمطبوعات الميدانية',
      createdAt: '2025-02-10'
    }
  ]
};
