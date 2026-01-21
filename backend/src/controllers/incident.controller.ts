import { Request, Response } from 'express';
import { db } from '../config/db';
import { v4 as uuid } from 'uuid';

/* ---------------- CREATE INCIDENT ---------------- */
export const createIncident = async (req: Request, res: Response) => {
  const { title, description, priority, createdBy, creatorName } = req.body;

  try {
    const id = uuid();
    const now = new Date();

    await db.query(
      `INSERT INTO incidents 
       (id, title, description, status, priority, created_by, creator_name, created_at, updated_at)
       VALUES (?, ?, ?, 'OPEN', ?, ?, ?, ?, ?)`,
      [id, title, description, priority, createdBy, creatorName, now, now]
    );

    res.json({ id });
  } catch (err) {
    console.error('CREATE INCIDENT ERROR:', err);
    res.status(500).json({ message: 'Failed to create incident' });
  }
};

/* ---------------- GET ALL INCIDENTS ---------------- */
export const getIncidents = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM incidents ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('FETCH INCIDENTS ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch incidents' });
  }
};

/* ---------------- GET INCIDENT BY ID ---------------- */
export const getIncidentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await db.query(
      `SELECT * FROM incidents WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('FETCH INCIDENT BY ID ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch incident' });
  }
};
export const updateIncidentStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      `UPDATE incidents 
       SET status = ?, updated_at = ? 
       WHERE id = ?`,
      [status, new Date(), id]
    );

    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};
