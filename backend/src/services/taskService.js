const db = require('../config/db');

const createTask = async (taskData, createdBy) => {
  const { title, description, status, priority, due_date, assigned_to, team_id } = taskData;
  const query = `
    INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, team_id, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  const values = [
    title,
    description,
    status || 'Todo',
    priority || 'Medium',
    due_date,
    assigned_to,
    team_id,
    createdBy
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getTeamTasks = async (teamId, filters = {}) => {
  let query = `
    SELECT t.*, u.username as assigned_to_name, u.email as assigned_to_email,
           c.username as creator_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN users c ON t.created_by = c.id
    WHERE t.team_id = $1
  `;
  const values = [teamId];
  let count = 2;

  if (filters.status) {
    query += ` AND t.status = $${count++}`;
    values.push(filters.status);
  }
  if (filters.assignedTo) {
    query += ` AND t.assigned_to = $${count++}`;
    values.push(filters.assignedTo);
  }
  if (filters.search) {
      query += ` AND (t.title ILIKE $${count} OR t.description ILIKE $${count})`;
      count++;
      values.push(`%${filters.search}%`);
  }

  query += ' ORDER BY t.created_at DESC';

  const result = await db.query(query, values);
  return result.rows;
};

const getTaskById = async (taskId) => {
  const query = `
    SELECT t.*, tm.name as team_name
    FROM tasks t
    JOIN teams tm ON t.team_id = tm.id
    WHERE t.id = $1
  `;
  const result = await db.query(query, [taskId]);
  return result.rows[0];
};

const ALLOWED_UPDATE_FIELDS = ['title', 'description', 'status', 'priority', 'due_date', 'assigned_to'];

const updateTask = async (taskId, updates) => {
  const keys = Object.keys(updates).filter(k => ALLOWED_UPDATE_FIELDS.includes(k));
  if (keys.length === 0) return null;

  const setParts = keys.map((key, idx) => `${key} = $${idx + 1}`);
  const values = keys.map(k => updates[k]);

  const query = `UPDATE tasks SET ${setParts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`;
  values.push(taskId);

  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteTask = async (taskId) => {
  const query = 'DELETE FROM tasks WHERE id = $1';
  await db.query(query, [taskId]);
};

module.exports = {
  createTask,
  getTeamTasks,
  getTaskById,
  updateTask,
  deleteTask
};
