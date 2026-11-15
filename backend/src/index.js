import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/pool.js';
import authRoutes from './routes/auth.routes.js';
import reportesRoutes from './routes/reportes.routes.js';
import intervencionesRoutes from './routes/intervenciones.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/intervenciones', intervencionesRoutes);

app.get('/', (req, res) => {
  res.send('API de Mantenimiento funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});