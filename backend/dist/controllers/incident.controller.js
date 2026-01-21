"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIncidentStatus = exports.getIncidentById = exports.getIncidents = exports.createIncident = void 0;
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
/* ---------------- CREATE INCIDENT ---------------- */
const createIncident = async (req, res) => {
    const { title, description, priority, createdBy, creatorName } = req.body;
    try {
        const id = (0, uuid_1.v4)();
        const now = new Date();
        await db_1.db.query(`INSERT INTO incidents 
       (id, title, description, status, priority, created_by, creator_name, created_at, updated_at)
       VALUES (?, ?, ?, 'OPEN', ?, ?, ?, ?, ?)`, [id, title, description, priority, createdBy, creatorName, now, now]);
        res.json({ id });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create incident' });
    }
};
exports.createIncident = createIncident;
/* ---------------- GET ALL INCIDENTS ---------------- */
const getIncidents = async (_req, res) => {
    try {
        const [rows] = await db_1.db.query(`SELECT * FROM incidents ORDER BY created_at DESC`);
        res.json(rows);
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch incidents' });
    }
};
exports.getIncidents = getIncidents;
/* ---------------- GET INCIDENT BY ID ---------------- */
const getIncidentById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db_1.db.query(`SELECT * FROM incidents WHERE id = ?`, [id]);
        if (!rows.length) {
            return res.status(404).json({ message: 'Incident not found' });
        }
        res.json(rows[0]);
    }
    catch {
        res.status(500).json({ message: 'Failed to fetch incident' });
    }
};
exports.getIncidentById = getIncidentById;
const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db_1.db.query(`UPDATE incidents 
       SET status = ?, updated_at = ? 
       WHERE id = ?`, [status, new Date(), id]);
        res.json({ message: 'Status updated' });
    }
    catch {
        res.status(500).json({ message: 'Failed to update status' });
    }
};
exports.updateIncidentStatus = updateIncidentStatus;
