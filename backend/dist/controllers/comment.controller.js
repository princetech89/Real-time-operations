"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentsByIncident = exports.addComment = void 0;
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
const addComment = async (req, res) => {
    const { incidentId, userId, userName, content } = req.body;
    try {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        await db_1.db.query(`INSERT INTO incident_comments 
       (id, incident_id, user_id, user_name, content, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`, [id, incidentId, userId, userName, content, now]);
        res.json({ id, created_at: now });
    }
    catch {
        res.status(500).json({ message: 'Failed to add comment' });
    }
};
exports.addComment = addComment;
const getCommentsByIncident = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db_1.db.query(`SELECT * FROM incident_comments 
       WHERE incident_id = ? 
       ORDER BY created_at ASC`, [id]);
        res.json(rows);
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
};
exports.getCommentsByIncident = getCommentsByIncident;
