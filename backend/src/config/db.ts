import mysql from 'mysql2/promise';

/**
 * MySQL Connection Pool
 * Uses ENV variables for deployment
 */
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sentinel_ops',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Optional: Test DB connection on startup
 */
export const testDbConnection = async () => {
  try {
    const connection = await db.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    console.log('✅ MySQL connected successfully');
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
    process.exit(1);
  }
};
