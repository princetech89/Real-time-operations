"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.createAuditLog = void 0;
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
/* ================= CREATE AUDIT LOG ================= */
const createAuditLog = async (req, res) => {
    const { userId, userName, action, entityId, entityType, target, details } = req.body;
    try {
        await db_1.db.query(`
      INSERT INTO audit_logs
      (id, user_id, user_name, action, entity_id, entity_type, target, details)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
            (0, uuid_1.v4)(),
            userId,
            userName,
            action,
            entityId,
            entityType,
            target ?? null,
            details ?? null
        ]);
        res.status(201).json({ message: 'Audit log recorded' });
    }
    catch (error) {
        console.error('AUDIT LOG ERROR:', error);
        res.status(500).json({ message: 'Failed to create audit log' });
    }
};
exports.createAuditLog = createAuditLog;
/* ================= GET AUDIT LOGS ================= */
const getAuditLogs = async (_req, res) => {
    try {
        const { rows } = await db_1.db.query(`
      SELECT action, entity_type, details, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      `);
        res.json(rows);
    }
    catch (error) {
        console.error('FETCH AUDIT LOGS ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch audit logs' });
    }
};
exports.getAuditLogs = getAuditLogs;
