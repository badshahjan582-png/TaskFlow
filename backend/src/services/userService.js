const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
  const { username, email, password, full_name } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (username, email, password, full_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, full_name, created_at
  `;
  const values = [username, email, hashedPassword, full_name];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const result = await db.query(query, [username]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUsername
};
