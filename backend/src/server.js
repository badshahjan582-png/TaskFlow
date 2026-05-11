const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test Database Connection before starting
pool.connect()
  .then((client) => {
    console.log('Successfully connected to PostgreSQL database');
    client.release();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  });
