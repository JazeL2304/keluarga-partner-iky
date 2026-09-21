import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import keluargaRouter from './routes/keluarga.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/keluarga', keluargaRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'keluarga-partner-iky-backend',
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  });
});

// Root fallback
app.get('/', (req, res) => {
  res.send('API Backend Sistem Pendataan Keluarga Partner I Know You berjalan dengan baik.');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server Express berjalan pada port ${PORT} (http://localhost:${PORT})`);
  });
}

export default app;
