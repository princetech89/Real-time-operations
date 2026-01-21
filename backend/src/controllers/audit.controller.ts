import { Request, Response } from 'express';
import { db } from '../config/db';
import { v4 as uuid } from 'uuid';

export const createAuditLog = async (req: Request, res: Response) => {
  const { userId, userName, action, entityId, entityType, details } = req.body;

  try {
    await db.query(
      `INSERT INTO audit_logs
       (id, user_id, user_name, action, entity_id, entity_type, details)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [uuid(), userId, userName, action, entityId, entityType, details]
    );

    res.json({ message: 'Audit log recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create audit log' });
  }
};

export const getAuditLogs = async (_req: Request, res: Response) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
};
