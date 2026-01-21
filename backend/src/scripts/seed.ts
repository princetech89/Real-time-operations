import 'dotenv/config';
import { Pool } from 'pg';
import { v4 as uuid } from 'uuid';

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function seedUser() {
    try {
        const client = await pool.connect();

        console.log('Seeding admin user...');

        // Check if user exists
        const check = await client.query('SELECT * FROM users WHERE email = $1', ['admin@sentinel.ops']);

        if (check.rows.length === 0) {
            await client.query(
                `INSERT INTO users (id, name, email, role, avatar, enabled) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    uuid(),
                    'System Admin',
                    'admin@sentinel.ops',
                    'ADMIN',
                    'https://ui-avatars.com/api/?name=System+Admin&background=0284c7&color=fff',
                    true
                ]
            );
            console.log('✅ Admin user created: admin@sentinel.ops');
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        client.release();
    } catch (err) {
        console.error('❌ Error seeding user:', err);
    } finally {
        await pool.end();
    }
}

seedUser();
