"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = exports.query = exports.db = void 0;
const pg_1 = require("pg");
/**
 * PostgreSQL Connection Pool
 * Uses ENV variables for deployment
 */
exports.db = new pg_1.Pool({
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
const query = (text, params) => exports.db.query(text, params);
exports.query = query;
/**
 * Optional: Test DB connection on startup
 */
const testDbConnection = async () => {
    try {
        const client = await exports.db.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('✅ PostgreSQL connected successfully');
    }
    catch (error) {
        console.error('❌ PostgreSQL connection failed:', error);
        // process.exit(1); // Consider keeping it alive if you want health checks to work
    }
};
exports.testDbConnection = testDbConnection;
