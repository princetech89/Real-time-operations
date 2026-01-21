import { Request, Response } from 'express';
import { db } from '../config/db';

/* ---------------- GET USERS ---------------- */
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const { rows } = await db.query(
            `SELECT id, name, email, role, avatar, enabled FROM users ORDER BY name ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error('GET USERS ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

/* ---------------- UPDATE ROLE ---------------- */
export const updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        await db.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, id]);
        res.json({ message: 'User role updated' });
    } catch (error) {
        console.error('UPDATE ROLE ERROR:', error);
        res.status(500).json({ message: 'Failed to update user role' });
    }
};

/* ---------------- TOGGLE STATUS ---------------- */
export const toggleUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { enabled } = req.body; // Expect boolean

    try {
        await db.query(`UPDATE users SET enabled = $1 WHERE id = $2`, [enabled, id]);
        res.json({ message: 'User status updated' });
    } catch (error) {
        console.error('TOGGLE STATUS ERROR:', error);
        res.status(500).json({ message: 'Failed to update user status' });
    }
};
