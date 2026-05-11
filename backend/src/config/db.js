const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('CRITICAL CONFIGURATION ERROR: DATABASE_URL environment variable is missing from the platform dashboard!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : process.env.DATABASE_URL?.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
