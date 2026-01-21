import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { db, testDbConnection } from './config/db';

import authRoutes from './routes/auth.routes';
import incidentRoutes from './routes/incident.routes';
import commentRoutes from './routes/comment.routes'; // ✅ NEW
import auditRoutes from './routes/audit.routes';
import userRoutes from './routes/user.routes'; // ✅ NEW


const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- ROOT ROUTE -------------------- */
app.get('/', (_req, res) => {
  res.send('Sentinel Ops Backend is running 🚀');
});

/* -------------------- HEALTH CHECK -------------------- */
app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'Backend + PostgreSQL connected ✅' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'Database connection failed ❌' });
  }
});

/* -------------------- ROUTES -------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/comments', commentRoutes); // ✅ NEW (PERSIST COMMENTS)

app.use('/api/audit', auditRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/users', userRoutes); // ✅ NEW


/* -------------------- SERVER START -------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  testDbConnection();
});
