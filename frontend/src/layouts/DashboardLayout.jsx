import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, X, CheckSquare } from 'lucide-react';
import { cn } from '../utils/cn';

const NAV = [
  { label: 'Home',  icon: LayoutDashboard, path: '/' },
  { label: 'Teams', icon: Users,           path: '/teams' },
];

const Avatar = ({ name, size = 7 }) => {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ fontSize: size <= 7 ? 11 : 13 }}>
      {initials}
    </div>
  );
};

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={cn(
      'flex flex-col h-full bg-[#F7F7F5] dark:bg-[#202020] border-r border-gray-200 dark:border-white/[0.07]',
      mobile ? 'w-[260px]' : 'w-[220px] hidden lg:flex'
    )}>
      {/* Brand */}
      <div className="h-[52px] flex items-center justify-between px-4 shrink-0">
        <Link to="/" onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-[14.5px] font-semibold text-gray-900 dark:text-gray-100 hover:opacity-75 transition-opacity">
          <div className="w-[22px] h-[22px] rounded-[5px] bg-[#2383E2] flex items-center justify-center shrink-0">
            <CheckSquare size={13} className="text-white" strokeWidth={2.5} />
          </div>
          TaskFlow
        </Link>
        {mobile && (
          <button onClick={() => setOpen(false)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-1 space-y-px overflow-y-auto">
        {NAV.map(({ label, icon: Icon, path }) => {
          const active = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-[6px] rounded-[6px] text-[13.5px] transition-colors',
                active
                  ? 'bg-white dark:bg-white/[0.1] text-gray-900 dark:text-white font-medium shadow-sm shadow-black/5'
                  : 'text-gray-500 dark:text-gray-400 font-normal hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-gray-800 dark:hover:text-gray-200'
              )}>
              <Icon size={15} className={active ? 'text-[#2383E2]' : 'text-gray-400 dark:text-gray-500'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-gray-200 dark:border-white/[0.07] shrink-0 space-y-px">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[6px]">
          <Avatar name={user?.full_name || user?.username} size={7} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate leading-tight">
              {user?.full_name || user?.username}
            </p>
            <p className="text-[11.5px] text-gray-400 dark:text-gray-500 truncate leading-tight">
              {user?.email}
            </p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-[6px] rounded-[6px] text-[13px] text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] dark:bg-[#1A1A1A]">

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile topbar */}
        <header className="lg:hidden h-[52px] flex items-center gap-3 px-4 bg-[#F7F7F5] dark:bg-[#202020] border-b border-gray-200 dark:border-white/[0.07] shrink-0">
          <button onClick={() => setOpen(true)}
            className="p-1.5 rounded-[6px] text-gray-500 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-colors">
            <Menu size={18} />
          </button>
          <Link to="/" className="flex items-center gap-2 text-[14px] font-semibold text-gray-900 dark:text-gray-100">
            <div className="w-5 h-5 rounded-[4px] bg-[#2383E2] flex items-center justify-center">
              <CheckSquare size={11} className="text-white" strokeWidth={2.5} />
            </div>
            TaskFlow
          </Link>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[860px] mx-auto w-full px-5 sm:px-8 py-8 sm:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
