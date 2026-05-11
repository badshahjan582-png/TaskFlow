import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ListTodo, Users, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Skeleton from '../components/ui/Skeleton';

const StatCard = ({ title, value, icon: Icon, to, loading }) => (
  <Link to={to}
    className="group flex items-center justify-between p-5 bg-white dark:bg-[#242424] rounded-xl border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15] transition-all duration-150">
    <div className="space-y-1">
      <p className="text-[12px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.06em]">{title}</p>
      {loading
        ? <Skeleton className="h-8 w-12 mt-1" />
        : <p className="text-[28px] font-semibold text-gray-900 dark:text-white leading-none tabular-nums">{value}</p>
      }
    </div>
    <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/25 group-hover:text-[#2383E2] transition-all duration-150">
      <Icon size={17} />
    </div>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ teams: 0, totalTasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teams')
      .then(res => {
        const totalTasks = res.data.reduce((acc, t) => acc + parseInt(t.task_count || 0), 0);
        setStats({ teams: res.data.length, totalTasks });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.full_name?.split(' ')[0] || user?.username || '';

  return (
    <div className="space-y-8 fade-up">

      {/* Page title */}
      <div>
        <h1 className="text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.3px]">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1 text-[13.5px] text-gray-500 dark:text-gray-400">
          Here's an overview of your workspace.
        </p>
      </div>

      {/* Stats */}
      <section>
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-[0.08em] mb-3">
          Overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard title="Active Teams"  value={stats.teams}      icon={Users}    to="/teams" loading={loading} />
          <StatCard title="Total Tasks"   value={stats.totalTasks} icon={ListTodo} to="/teams" loading={loading} />
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-white/[0.06]" />

      {/* Quick access */}
      <section>
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-[0.08em] mb-3">
          Quick access
        </p>
        <Link to="/teams"
          className="group flex items-center justify-between p-4 bg-white dark:bg-[#242424] rounded-xl border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15] transition-all duration-150">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-[#2383E2] shrink-0">
              <LayoutGrid size={17} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-gray-900 dark:text-gray-100 leading-tight">Team Boards</p>
              <p className="text-[12.5px] text-gray-500 dark:text-gray-400 mt-0.5">Manage tasks across all your teams</p>
            </div>
          </div>
          <ArrowRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-150 shrink-0" />
        </Link>
      </section>

    </div>
  );
}
