import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Crear un reporte (CA-01)
router.post('/', async (req, res) => {
  const { descripcion, espacio_id, reportante_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO reportes (descripcion, espacio_id, reportante_id) VALUES ($1, $2, $3) RETURNING *',
      [descripcion, espacio_id, reportante_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reporte' });
  }
});

// Obtener todos los reportes (CA-06)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reportes ORDER BY fecha_creacion DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

//estado (CA-02, CA-05) 
router.patch('/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { nuevo_estado } = req.body;

  try {
    // 1. Obtener el reporte actual
    const reporteActual = await pool.query('SELECT estado FROM reportes WHERE id = $1', [id]);
    if (reporteActual.rows.length === 0) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    const estadoActual = reporteActual.rows[0].estado;

    // 2. Validar las transiciones permitidas
    const transicionesValidas = {
      'Reportado': ['En Evaluacion'],
      'En Evaluacion': ['Asignado'],
      'Asignado': ['En Proceso'],
      'En Proceso': ['Cerrado'],
      'Cerrado': [] 
    };

    if (!transicionesValidas[estadoActual] || !transicionesValidas[estadoActual].includes(nuevo_estado)) {
      return res.status(400).json({ 
        error: `Transición no permitida de "${estadoActual}" a "${nuevo_estado}"` 
      });
    }

    // 3. Si es válido, actualizamos
    const result = await pool.query(
      'UPDATE reportes SET estado = $1 WHERE id = $2 RETURNING *',
      [nuevo_estado, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Asignar responsable (CA-03)
router.patch('/:id/asignar', async (req, res) => {
  const { id } = req.params;
  const { asignado_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE reportes SET asignado_id = $1, estado = $2 WHERE id = $3 RETURNING *',
      [asignado_id, 'Asignado', id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar responsable' });
  }
});

export default router;