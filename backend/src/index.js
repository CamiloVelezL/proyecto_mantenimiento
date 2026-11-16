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
  res.send('API de Mantenimiento funcionando correctamente. Ve a /api/... para usar los endpoints.');
});

// Ruta de prueba de base de datos
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ mensaje: 'Conexión a DB exitosa', fecha: result.rows[0].now });
  } catch (error) {
    console.error(error); // Esto te mostrará el error real en la terminal
    res.status(500).json({ error: 'Error conectando a la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});