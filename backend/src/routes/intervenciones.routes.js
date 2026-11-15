import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Registrar intervención (CA-04)
router.post('/', async (req, res) => {
  const { descripcion, reporte_id, tecnico_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO intervenciones (descripcion, reporte_id, tecnico_id) VALUES ($1, $2, $3) RETURNING *',
      [descripcion, reporte_id, tecnico_id]
    );
    // Al registrar intervención, el reporte pasa a "En Proceso"
    await pool.query('UPDATE reportes SET estado = $1 WHERE id = $2', ['En Proceso', reporte_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar intervención' });
  }
});

export default router;