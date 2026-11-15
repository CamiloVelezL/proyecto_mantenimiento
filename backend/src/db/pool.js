import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mantenimiento_bd_error', 
  password: 'admin123', 
  port: 5432,
});

export default pool;
