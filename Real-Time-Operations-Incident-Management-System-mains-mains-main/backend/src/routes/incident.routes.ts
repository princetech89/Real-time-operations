import { Router } from 'express';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus
} from '../controllers/incident.controller';

const router = Router();

/* ---------- INCIDENT CRUD ---------- */
router.get('/', getIncidents);
router.post('/', createIncident);
router.get('/:id', getIncidentById);

/* ---------- STATUS UPDATE (PERSISTED) ---------- */
router.patch('/:id/status', updateIncidentStatus);

export default router;
