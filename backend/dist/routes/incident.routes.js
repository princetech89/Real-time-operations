"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const incident_controller_1 = require("../controllers/incident.controller");
const router = (0, express_1.Router)();
/* ---------- INCIDENT CRUD ---------- */
router.get('/', incident_controller_1.getIncidents);
router.post('/', incident_controller_1.createIncident);
router.get('/:id', incident_controller_1.getIncidentById);
/* ---------- STATUS UPDATE (PERSISTED) ---------- */
router.patch('/:id/status', incident_controller_1.updateIncidentStatus);
exports.default = router;
