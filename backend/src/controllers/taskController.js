const taskService = require('../services/taskService');
const teamService = require('../services/teamService');

const createTask = async (req, res, next) => {
  try {
    const { team_id } = req.body;
    const isMember = await teamService.isTeamMember(team_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Only team members can create tasks.' });
    }

    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

const getTeamTasks = async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const isMember = await teamService.isTeamMember(teamId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { status, assignedTo, search } = req.query;
    const tasks = await taskService.getTeamTasks(teamId, { status, assignedTo, search });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskAndVerifyMember = async (taskId, userId) => {
  const task = await taskService.getTaskById(taskId);
  if (!task) return { task: null, authorized: false };
  const authorized = await teamService.isTeamMember(task.team_id, userId);
  return { task, authorized };
};

const updateTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { task, authorized } = await getTaskAndVerifyMember(taskId, req.user.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    if (!authorized) return res.status(403).json({ message: 'Access denied.' });

    const updatedTask = await taskService.updateTask(taskId, req.body);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = parseInt(req.params.id);
    const { task, authorized } = await getTaskAndVerifyMember(taskId, req.user.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    if (!authorized) return res.status(403).json({ message: 'Access denied.' });

    await taskService.deleteTask(taskId);
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTeamTasks,
  updateTask,
  deleteTask
};
