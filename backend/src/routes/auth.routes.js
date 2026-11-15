import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Registro de usuarios 
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, password, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    
    if (user.password_hash === password) {
      res.json({ mensaje: 'Login exitoso', usuario: user }); 
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;