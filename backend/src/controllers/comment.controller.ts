import { Request, Response } from 'express';
import { db } from '../config/db';
import { v4 as uuid } from 'uuid';

export const addComment = async (req: Request, res: Response) => {
  const { incidentId, userId, userName, content } = req.body;

  try {
    const id = uuid();
    const now = new Date();

    await db.query(
      `INSERT INTO incident_comments 
       (id, incident_id, user_id, user_name, content, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, incidentId, userId, userName, content, now]
    );

    res.json({ id, created_at: now });
  } catch {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

export const getCommentsByIncident = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM incident_comments 
       WHERE incident_id = ? 
       ORDER BY created_at ASC`,
      [id]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};
