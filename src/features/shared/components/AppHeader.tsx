import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ActiveUser } from '../../../types';
import { AppNotification } from '../../parent/domain/parentMockData';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderUserMenu } from './HeaderUserMenu';

interface AppHeaderProps {
  centerName: string; space: 'VISITEUR' | 'ADMIN' | 'TEACHER'; setSpace: (space: 'VISITEUR' | 'ADMIN' | 'TEACHER') => void;
  setIsParentTab: (val: boolean) => void; setIsRegistering: (val: boolean) => void; activeUser: ActiveUser | null;
  isUserMenuOpen: boolean; setIsUserMenuOpen: (val: boolean) => void; isInOwnSpace: boolean; isParentTab: boolean;
  setIsLoginModalOpen: (val: boolean) => void; unreadCount: number; activeNotifications: AppNotification[];
  onNotificationClick: (id: string) => void; onMarkAllRead: () => void; simulatedTime: string;
  setSimulatedTime: (val: string) => void; onOpenProfile?: () => void;
}

export function AppHeader({
  centerName, space, setSpace, setIsParentTab, setIsRegistering,
  activeUser, isUserMenuOpen, setIsUserMenuOpen, isInOwnSpace, isParentTab, setIsLoginModalOpen,
  unreadCount, activeNotifications, onNotificationClick, onMarkAllRead,
  simulatedTime, setSimulatedTime, onOpenProfile,
}: AppHeaderProps) {
  const handleNav = (sp: 'VISITEUR' | 'ADMIN' | 'TEACHER', pTab = false, reg = false) => {
    setSpace(sp); setIsParentTab(pTab); setIsRegistering(reg);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 cursor-pointer min-w-0" onClick={() => handleNav('VISITEUR')}>
          <div className="p-2 bg-sky-500 text-white rounded-xl shrink-0"><GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" /></div>
          <div className="min-w-0 block">
            <span className="font-display font-black text-slate-800 text-xs sm:text-sm md:text-base block tracking-tight truncate">{centerName}</span>
            <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 block tracking-widest uppercase truncate">Direction : Elhadji Touré</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 relative">
          {activeUser && (
            <HeaderNotifications
              unreadCount={unreadCount} activeNotifications={activeNotifications}
              onNotificationClick={onNotificationClick} onMarkAllRead={onMarkAllRead}
            />
          )}

          {activeUser ? (
            <HeaderUserMenu
              activeUser={activeUser} isUserMenuOpen={isUserMenuOpen} setIsUserMenuOpen={setIsUserMenuOpen}
              isInOwnSpace={isInOwnSpace} isParentTab={isParentTab} space={space} setSpace={setSpace}
              setIsParentTab={setIsParentTab} setIsRegistering={setIsRegistering} onOpenProfile={onOpenProfile}
            />
          ) : (
            <button
              id="portal-login-btn" onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition text-[10px] sm:text-xs shadow-md cursor-pointer shrink-0"
            >
              <span>Se connecter</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
