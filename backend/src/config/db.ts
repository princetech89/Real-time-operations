import { Pool } from 'pg';

/**
 * PostgreSQL Connection Pool
 * Uses ENV variables for deployment
 */
export const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sentinel_ops',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

/**
 * Helper to maintain compatibility with mysql2's query style where needed
 * or to provide a unified interface.
 */
export const query = (text: string, params?: any[]) => db.query(text, params);

/**
 * Optional: Test DB connection on startup
 */
export const testDbConnection = async () => {
  try {
    const client = await db.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    // process.exit(1); // Consider keeping it alive if you want health checks to work
  }
};
