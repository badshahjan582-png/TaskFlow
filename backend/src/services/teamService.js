const db = require('../config/db');

const createTeam = async (name, description, createdBy) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const teamQuery = `
      INSERT INTO teams (name, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const teamRes = await client.query(teamQuery, [name, description, createdBy]);
    const team = teamRes.rows[0];

    // Add creator as admin member
    await client.query(`
      INSERT INTO team_members (team_id, user_id, role)
      VALUES ($1, $2, $3)
    `, [team.id, createdBy, 'admin']);

    await client.query('COMMIT');
    return team;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const getTeamsForUser = async (userId) => {
  const query = `
    SELECT t.*, tm.role, u.username as creator_name,
           (SELECT COUNT(*) FROM tasks WHERE team_id = t.id) as task_count
    FROM teams t
    JOIN team_members tm ON t.id = tm.team_id
    LEFT JOIN users u ON t.created_by = u.id
    WHERE tm.user_id = $1
    ORDER BY t.created_at DESC
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

const getTeamById = async (teamId) => {
  const query = `SELECT * FROM teams WHERE id = $1`;
  const result = await db.query(query, [teamId]);
  return result.rows[0];
};

const getTeamMembers = async (teamId) => {
  const query = `
    SELECT u.id, u.username, u.email, u.full_name, tm.role, tm.joined_at
    FROM users u
    JOIN team_members tm ON u.id = tm.user_id
    WHERE tm.team_id = $1
  `;
  const result = await db.query(query, [teamId]);
  return result.rows;
};

const addMemberToTeam = async (teamId, userEmail, role = 'member') => {
  // Find user by email
  const userQuery = 'SELECT id FROM users WHERE email = $1';
  const userRes = await db.query(userQuery, [userEmail]);

  if (userRes.rows.length === 0) {
    throw new Error('User not found with that email.');
  }

  const userId = userRes.rows[0].id;

  const query = `
    INSERT INTO team_members (team_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await db.query(query, [teamId, userId, role]);
  return result.rows[0];
};

const isTeamMember = async (teamId, userId) => {
  const query = `SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2`;
  const result = await db.query(query, [teamId, userId]);
  return result.rows.length > 0;
};

const isTeamAdmin = async (teamId, userId) => {
  const query = `SELECT 1 FROM team_members WHERE team_id = $1 AND user_id = $2 AND role = 'admin'`;
  const result = await db.query(query, [teamId, userId]);
  return result.rows.length > 0;
};

const deleteTeam = async (teamId) => {
    const query = 'DELETE FROM teams WHERE id = $1';
    await db.query(query, [teamId]);
}

const updateTeam = async (teamId, name, description) => {
    const query = 'UPDATE teams SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *';
    const res = await db.query(query, [name, description, teamId]);
    return res.rows[0];
}

module.exports = {
  createTeam,
  getTeamsForUser,
  getTeamById,
  getTeamMembers,
  addMemberToTeam,
  isTeamMember,
  isTeamAdmin,
  deleteTeam,
  updateTeam
};
