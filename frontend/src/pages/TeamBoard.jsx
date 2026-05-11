import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import { Plus, Search, UserPlus, Calendar, CheckCircle2, Circle, MoreHorizontal, Trash2, ArrowLeft, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const TaskRow = ({ task, members, onEdit, onDelete, onToggle }) => {
  const priorityColor = {
    'High': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
    'Medium': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
    'Low': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
  };

  const statusColor = {
    'Todo': 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.05]',
    'In Progress': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
    'Completed': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
  };

  return (
    <div className="group flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#242424] border border-gray-200 dark:border-white/[0.08] rounded-lg hover:border-gray-300 dark:hover:border-white/[0.15] hover:shadow-sm transition-all duration-150">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id, task.status)}
        className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
      >
        {task.status === 'Completed' ? (
          <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />
        ) : (
          <Circle size={18} />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13.5px] font-medium leading-tight ${task.status === 'Completed' ? 'line-through opacity-50' : 'text-gray-900 dark:text-white'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${priorityColor[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${statusColor[task.status]}`}>
            {task.status}
          </span>
          {task.due_date && (
            <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar size={11} /> {format(new Date(task.due_date), 'MMM d')}
            </span>
          )}
          {task.assigned_to_name && (
            <span className="text-[11px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/[0.08] px-2 py-0.5 rounded flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[8px] font-bold text-white">
                {task.assigned_to_name[0]}
              </div>
              {task.assigned_to_name}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors"
          title="Edit"
        >
          <MoreHorizontal size={14} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default function TeamBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [memberFilter, setMemberFilter] = useState('');

  const [taskModal, setTaskModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: '', description: '', status: 'Todo', priority: 'Medium', due_date: '', assigned_to: ''
  });
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });
  const [memberEmail, setMemberEmail] = useState('');

  const fetchTeam = useCallback(async () => {
    try {
      const res = await api.get(`/teams/${id}`);
      setTeam(res.data);
      setMembers(res.data.members);
      setTeamForm({ name: res.data.name, description: res.data.description || '' });
    } catch (err) {
      if (err.response?.status === 403) navigate('/teams');
    }
  }, [id, navigate]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (memberFilter) params.append('assignedTo', memberFilter);
      const res = await api.get(`/tasks/team/${id}?${params}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, statusFilter, memberFilter]);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);
  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = {
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      priority: taskForm.priority,
      assigned_to: taskForm.assigned_to ? parseInt(taskForm.assigned_to) : null,
      due_date: taskForm.due_date ? new Date(taskForm.due_date).toISOString() : null,
    };
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, data);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', { ...data, team_id: parseInt(id) });
        toast.success('Task created');
      }
      setTaskModal(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', status: 'Todo', priority: 'Medium', due_date: '', assigned_to: '' });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleTask = async (taskId, status) => {
    const next = status === 'Completed' ? 'Todo' : 'Completed';
    try {
      await api.put(`/tasks/${taskId}`, { status: next });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: next } : t));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/teams/${id}/members`, { email: memberEmail });
      toast.success('Member added');
      setMemberModal(false);
      setMemberEmail('');
      fetchTeam();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/teams/${id}`, teamForm);
      toast.success('Team updated');
      setSettingsModal(false);
      fetchTeam();
    } catch (err) {
      toast.error('Failed to update team');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Delete this team permanently? All tasks will be removed.')) return;
    try {
      await api.delete(`/teams/${id}`);
      toast.success('Team deleted');
      navigate('/teams');
    } catch (err) {
      toast.error('Only admins can delete teams');
    }
  };

  const isAdmin = team && user && team.created_by === user.id;

  if (loading && !team) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-4">Team not found or access denied</p>
        <Button size="sm" onClick={() => navigate('/teams')}>
          <ArrowLeft size={14} /> Back to teams
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-up">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[22px] font-semibold text-gray-900 dark:text-white tracking-[-0.3px] truncate">
              {team.name}
            </h1>
            {isAdmin && (
              <button
                onClick={() => setSettingsModal(true)}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.08] transition-colors shrink-0"
                title="Settings"
              >
                <Settings size={16} />
              </button>
            )}
          </div>
          {team.description && (
            <p className="text-[13px] text-gray-500 dark:text-gray-400 line-clamp-1">
              {team.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Member avatars */}
          <div className="flex -space-x-1.5">
            {members.slice(0, 3).map(m => (
              <div
                key={m.id}
                title={m.username}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border border-white dark:border-[#242424] flex items-center justify-center text-[10px] font-bold text-white"
              >
                {m.username[0].toUpperCase()}
              </div>
            ))}
            {members.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/[0.1] border border-white dark:border-[#242424] flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400">
                +{members.length - 3}
              </div>
            )}
          </div>

          <Button size="sm" variant="secondary" onClick={() => setMemberModal(true)}>
            <UserPlus size={14} /> Invite
          </Button>
          <Button size="sm" onClick={() => { setEditingTask(null); setTaskForm({ title: '', description: '', status: 'Todo', priority: 'Medium', due_date: '', assigned_to: '' }); setTaskModal(true); }}>
            <Plus size={14} /> Task
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-white/[0.06]" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-[13.5px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={memberFilter}
            onChange={e => setMemberFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-[13px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 flex-1 sm:flex-none"
          >
            <option value="">All assignees</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-[13px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60 flex-1 sm:flex-none"
          >
            <option value="">All statuses</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[13.5px] text-gray-500 dark:text-gray-400">
            {tasks.length === 0 ? 'No tasks yet. Create one to get started.' : 'No tasks match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              members={members}
              onEdit={t => {
                setEditingTask(t);
                setTaskForm({
                  title: t.title,
                  description: t.description || '',
                  status: t.status,
                  priority: t.priority,
                  due_date: t.due_date ? format(new Date(t.due_date), 'yyyy-MM-dd') : '',
                  assigned_to: t.assigned_to || ''
                });
                setTaskModal(true);
              }}
              onDelete={handleDeleteTask}
              onToggle={handleToggleTask}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Modal isOpen={taskModal} onClose={() => setTaskModal(false)} title={editingTask ? 'Edit task' : 'New task'}>
        <form onSubmit={handleSaveTask} className="space-y-3.5">
          <Input label="Title" required value={taskForm.title}
            onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title…" />
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">Description</label>
            <textarea rows={2} value={taskForm.description}
              onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="Add details…"
              className="w-full rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-3 py-2 text-[13.5px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">Status</label>
              <select value={taskForm.status}
                onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-[13px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60">
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">Priority</label>
              <select value={taskForm.priority}
                onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-[13px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">Assign to</label>
            <select value={taskForm.assigned_to}
              onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
              className="w-full h-9 px-3 rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] text-[13px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/60">
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
            </select>
          </div>
          <Input label="Due date" type="date" value={taskForm.due_date}
            onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setTaskModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={submitting}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Member Modal */}
      <Modal isOpen={memberModal} onClose={() => setMemberModal(false)} title="Add member">
        <form onSubmit={handleAddMember} className="space-y-3.5">
          <Input label="Email" type="email" required value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)} placeholder="user@example.com" />
          <p className="text-[12px] text-gray-500 dark:text-gray-400">
            User must have an existing TaskFlow account.
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => setMemberModal(false)}>Cancel</Button>
            <Button type="submit" size="sm" isLoading={submitting}>Add</Button>
          </div>
        </form>
      </Modal>

      {/* Settings Modal */}
      {isAdmin && (
        <Modal isOpen={settingsModal} onClose={() => setSettingsModal(false)} title="Team settings">
          <form onSubmit={handleUpdateTeam} className="space-y-3.5">
            <Input label="Team name" required value={teamForm.name}
              onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-gray-600 dark:text-gray-400">Description</label>
              <textarea rows={2} value={teamForm.description}
                onChange={e => setTeamForm({ ...teamForm, description: e.target.value })}
                className="w-full rounded-md border border-gray-200 dark:border-white/[0.1] bg-white dark:bg-white/[0.05] px-3 py-2 text-[13.5px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/60 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setSettingsModal(false)}>Cancel</Button>
              <Button type="submit" size="sm" isLoading={submitting}>Save</Button>
            </div>
            <div className="border-t border-gray-100 dark:border-white/[0.06] pt-3">
              <button
                type="button"
                onClick={handleDeleteTeam}
                className="text-[13px] font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                Delete team permanently
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
