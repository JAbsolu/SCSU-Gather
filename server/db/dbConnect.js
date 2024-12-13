const mysql = require('mysql2');

const connection_pool = mysql.createPool({
  host: '104.154.42.132',
  user: 'appuser',
  password: 'scsugather',
  database: 'SCSUGather',
  connectionLimit: 10,        // Limit the number of simultaneous connections
  connectTimeout: 10000       // Set timeout to 10 seconds
});

// Test the connection when the pool is created
connection_pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database.');
    connection.release(); // Release the connection back to the pool
  }
});

module.exports = connection_pool;