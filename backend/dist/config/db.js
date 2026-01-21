"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
/**
 * MySQL Connection Pool
 * Uses ENV variables for deployment
 */
exports.db = promise_1.default.createPool({
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
const testDbConnection = async () => {
    try {
        const connection = await exports.db.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        console.log('✅ MySQL connected successfully');
    }
    catch (error) {
        console.error('❌ MySQL connection failed:', error);
        process.exit(1);
    }
};
exports.testDbConnection = testDbConnection;
