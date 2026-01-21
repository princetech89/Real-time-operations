"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUserStatus = exports.updateUserRole = exports.getUsers = void 0;
const db_1 = require("../config/db");
/* ---------------- GET USERS ---------------- */
const getUsers = async (_req, res) => {
    try {
        const { rows } = await db_1.db.query(`SELECT id, name, email, role, avatar, enabled FROM users ORDER BY name ASC`);
        res.json(rows);
    }
    catch (error) {
        console.error('GET USERS ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
/* ---------------- UPDATE ROLE ---------------- */
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    try {
        await db_1.db.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, id]);
        res.json({ message: 'User role updated' });
    }
    catch (error) {
        console.error('UPDATE ROLE ERROR:', error);
        res.status(500).json({ message: 'Failed to update user role' });
    }
};
exports.updateUserRole = updateUserRole;
/* ---------------- TOGGLE STATUS ---------------- */
const toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    const { enabled } = req.body; // Expect boolean
    try {
        await db_1.db.query(`UPDATE users SET enabled = $1 WHERE id = $2`, [enabled, id]);
        res.json({ message: 'User status updated' });
    }
    catch (error) {
        console.error('TOGGLE STATUS ERROR:', error);
        res.status(500).json({ message: 'Failed to update user status' });
    }
};
exports.toggleUserStatus = toggleUserStatus;
