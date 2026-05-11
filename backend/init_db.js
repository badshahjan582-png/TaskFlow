const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const init = async () => {
  try {
    console.log('Reading schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('Connecting to database and creating tables...');
    await pool.query(schema);
    console.log('Database initialization successful!');
  } catch (error) {
    console.error('Initialization Failed:', error.message);
  } finally {
    await pool.end();
  }
};

init();
