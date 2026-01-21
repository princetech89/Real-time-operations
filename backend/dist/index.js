"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const incident_routes_1 = __importDefault(require("./routes/incident.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes")); // ✅ NEW
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
const app = (0, express_1.default)();
/* -------------------- MIDDLEWARE -------------------- */
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/* -------------------- ROOT ROUTE -------------------- */
app.get('/', (_req, res) => {
    res.send('Sentinel Ops Backend is running 🚀');
});
/* -------------------- HEALTH CHECK -------------------- */
app.get('/api/health', async (_req, res) => {
    try {
        await db_1.db.query('SELECT 1');
        res.json({ status: 'Backend + MySQL connected ✅' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Database connection failed ❌' });
    }
});
/* -------------------- ROUTES -------------------- */
app.use('/api/auth', auth_routes_1.default);
app.use('/api/incidents', incident_routes_1.default);
app.use('/api/comments', comment_routes_1.default); // ✅ NEW (PERSIST COMMENTS)
app.use('/api/audit', audit_routes_1.default);
app.use('/api/audit-logs', audit_routes_1.default);
/* -------------------- SERVER START -------------------- */
app.listen(5000, () => {
    console.log('Backend running on http://localhost:5000');
});
