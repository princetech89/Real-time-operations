"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const db_1 = require("../config/db");
const login = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const { rows } = await db_1.db.query(`SELECT id, name, email, role, avatar, enabled 
       FROM users 
       WHERE email = $1 AND enabled = true`, [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed' });
    }
};
exports.login = login;
