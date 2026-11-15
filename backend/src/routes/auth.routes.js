import express from 'express';
import pool from '../db/pool.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registro de usuarios (encriptando contraseña)
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, password_hash, rol]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login seguro
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); 
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); 
    }

    // Devolvemos solo datos públicos, nunca el hash de la contraseña
    res.json({ 
      mensaje: 'Login exitoso', 
      usuario: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } 
    }); 
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;