import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Plus, Users, ArrowRight, Hash, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';

const TeamCard = ({ team }) => (
  <Link to={`/teams/${team.id}`}
    className="group flex items-start justify-between p-4 bg-white dark:bg-[#242424] rounded-xl border border-gray-200 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.16] hover:shadow-sm transition-all duration-150">

    <div className="flex items-start gap-3.5 min-w-0 flex-1">
      {/* Icon */}
      <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-400 dark:text-gray-500 shrink-0 mt-0.5 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/20 group-hover:text-[#2383E2] transition-all duration-150">
        <Users size={16} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#2383E2] transition-colors truncate">
            {team.name}
          </span>
          {team.role === 'admin' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20 shrink-0">
              <ShieldCheck size={10} /> Admin
            </span>
          )}
        </div>
        <p className="text-[12.5px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
          {team.description || 'No description'}
        </p>
        <div className="flex items-center gap-1 mt-1.5 text-[12px] text-gray-400 dark:text-gray-500">
          <Hash size={11} />
          <span>{team.task_count || 0} tasks</span>
        </div>
      </div>
    </div>

    <ArrowRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-150 shrink-0 mt-1 ml-3" />
  </Link>
);

const CardSkeleton = () => (
  <div className="flex items-start gap-3.5 p-4 bg-white dark:bg-[#242424] rounded-xl border border-gray-200 dark:border-white/[0.08]">
    <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2 pt-0.5">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeams = () => {
    api.get('/teams')
      .then(r => setTeams(r.data))
      .catch(() => toast.error('Failed to load teams'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTeams, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/teams', form);
      toast.success('Team created!');
      setModalOpen(false);
      setForm({ name: '', description: '' });
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-up">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.3px]">Teams</h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
            {!loading && `${teams.length} workspace${teams.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} className="shrink-0">
          <Plus size={14} /> New team
        </Button>
      </div>

      <div className="border-t border-gray-100 dark:border-white/[0.06]" />

      {/* List */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08] flex items-center justify-center text-gray-400 mb-4">
            <Users size={22} />
          </div>
          <p className="text-[14px] font-medium text-gray-900 dark:text-white mb-1">No teams yet</p>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-[260px] mb-5">
            Create your first team to start collaborating on tasks.
          </p>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Create a team
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {teams.map(team => <TeamCard key={team.id} team={team} />)}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New team">
        <form onSubmit={handleCreate} className="space-y-3.5">
          <Input label="Team name" required value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Engineering, Design…" />
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">
              Description <span className="text-gray-400 dark:text-gray-600 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What does this team work on?"
              className="w-full rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-3 py-2 text-[13.5px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 resize-none transition-shadow"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={submitting}>Create team</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
