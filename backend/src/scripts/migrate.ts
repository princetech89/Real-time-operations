import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function runSchema() {
    try {
        const schemaPath = path.join(__dirname, '../../schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Connecting to database...');
        const client = await pool.connect();

        console.log('Executing schema...');
        await client.query(sql);

        console.log('✅ Tables created successfully!');
        client.release();
    } catch (err) {
        console.error('❌ Error executing schema:', err);
    } finally {
        await pool.end();
    }
}

runSchema();
