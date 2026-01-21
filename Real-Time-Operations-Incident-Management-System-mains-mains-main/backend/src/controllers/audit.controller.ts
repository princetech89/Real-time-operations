import { Request, Response } from 'express';
import { db } from '../config/db';
import { v4 as uuid } from 'uuid';

/* ================= CREATE AUDIT LOG ================= */
export const createAuditLog = async (req: Request, res: Response) => {
  const {
    userId,
    userName,
    action,
    entityId,
    entityType,
    target,
    details
  } = req.body;

  try {
    await db.query(
      `
      INSERT INTO audit_logs
      (id, user_id, user_name, action, entity_id, entity_type, target, details)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        uuid(),
        userId,
        userName,
        action,
        entityId,
        entityType,
        target ?? null,
        details ?? null
      ]
    );

    res.status(201).json({ message: 'Audit log recorded' });
  } catch (error) {
    console.error('AUDIT LOG ERROR:', error);
    res.status(500).json({ message: 'Failed to create audit log' });
  }
};

/* ================= GET AUDIT LOGS ================= */
export const getAuditLogs = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `
      SELECT action, entity_type, details, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      `
    );

    res.json(rows);
  } catch (error) {
    console.error('FETCH AUDIT LOGS ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};
