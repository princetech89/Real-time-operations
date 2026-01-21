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
       VALUES ($1, $2, $3, 'OPEN', $4, $5, $6, $7, $8)`, [id, title, description, priority, createdBy, creatorName, now, now]);
        res.json({ id });
    }
    catch (err) {
        console.error('CREATE INCIDENT ERROR:', err);
        res.status(500).json({ message: 'Failed to create incident' });
    }
};
exports.createIncident = createIncident;
/* ---------------- GET ALL INCIDENTS ---------------- */
const getIncidents = async (_req, res) => {
    try {
        const { rows } = await db_1.db.query(`SELECT * FROM incidents ORDER BY created_at DESC`);
        res.json(rows);
    }
    catch (error) {
        console.error('FETCH INCIDENTS ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch incidents' });
    }
};
exports.getIncidents = getIncidents;
/* ---------------- GET INCIDENT BY ID ---------------- */
const getIncidentById = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db_1.db.query(`SELECT * FROM incidents WHERE id = $1`, [id]);
        if (!rows.length) {
            return res.status(404).json({ message: 'Incident not found' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error('FETCH INCIDENT BY ID ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch incident' });
    }
};
exports.getIncidentById = getIncidentById;
const updateIncidentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db_1.db.query(`UPDATE incidents 
       SET status = $1, updated_at = $2 
       WHERE id = $3`, [status, new Date(), id]);
        res.json({ message: 'Status updated' });
    }
    catch (error) {
        console.error('UPDATE STATUS ERROR:', error);
        res.status(500).json({ message: 'Failed to update status' });
    }
};
exports.updateIncidentStatus = updateIncidentStatus;
