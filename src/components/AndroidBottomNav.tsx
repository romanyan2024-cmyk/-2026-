import React from 'react';
import { Home, Users, UserCheck, Baby, Search, ShieldCheck, Network, Wallet } from 'lucide-react';
import { ActiveTab } from '../types';

interface AndroidBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  teachersCount: number;
  supervisorsCount: number;
  childrenCount: number;
  isAdminUnlocked: boolean;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  setActiveTab,
  teachersCount,
  supervisorsCount,
  childrenCount,
  isAdminUnlocked
}) => {
  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: 'الرئيسية',
      icon: Home,
      badge: null
    },
    {
      id: 'hierarchy' as ActiveTab,
      label: 'الهيكل الإداري',
      icon: Network,
      badge: 'جديد'
    },
    {
      id: 'teachers' as ActiveTab,
      label: 'الخدام',
      icon: Users,
      badge: teachersCount
    },
    {
      id: 'supervisors' as ActiveTab,
      label: 'المشرفين',
      icon: UserCheck,
      badge: supervisorsCount
    },
    {
      id: 'children' as ActiveTab,
      label: 'الأطفال',
      icon: Baby,
      badge: childrenCount
    },
    {
      id: 'accounts' as ActiveTab,
      label: 'حسابات المشروع',
      icon: Wallet,
      badge: 'مالي'
    },
    {
      id: 'search' as ActiveTab,
      label: 'البحث',
      icon: Search,
      badge: null
    },
    {
      id: 'admin' as ActiveTab,
      label: 'الأدمن',
      icon: ShieldCheck,
      badge: isAdminUnlocked ? '✓' : '🔒'
    }
  ];

  return (
    <nav className="bg-slate-900 border-t border-slate-800 px-1 py-1.5 z-30 select-none shadow-2xl no-print">
      <div className="flex items-center justify-around max-w-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 transition-all duration-200 relative group rounded-xl ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active pill indicator for Android Material 3 */}
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-300 relative ${
                  isActive
                    ? 'bg-indigo-600/30 text-indigo-300 ring-1 ring-indigo-500/50 shadow-sm'
                    : 'group-hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-indigo-300' : ''}`} />
                {item.badge !== null && (
                  <span className={`absolute -top-1 -right-1 text-[8px] font-black px-1 py-0.2 rounded-full border border-slate-900 shadow-sm ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9.5px] mt-0.5 transition-all truncate max-w-[58px] ${isActive ? 'font-bold text-indigo-300' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
