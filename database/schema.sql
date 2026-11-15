-- Crear la base de datos (ejecutar manualmente en pgAdmin o psql)
-- CREATE DATABASE mantenimiento_db;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('Reportante', 'Mantenimiento', 'Coordinacion')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Espacios/Instalaciones
CREATE TABLE espacios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(150) NOT NULL
);

-- Tabla de Reportes
CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'Reportado' CHECK (estado IN ('Reportado', 'En Evaluacion', 'Asignado', 'En Proceso', 'Cerrado')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    espacio_id INT REFERENCES espacios(id) ON DELETE CASCADE,
    reportante_id INT REFERENCES usuarios(id),
    asignado_id INT REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Intervenciones
CREATE TABLE intervenciones (
    id SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reporte_id INT REFERENCES reportes(id) ON DELETE CASCADE,
    tecnico_id INT REFERENCES usuarios(id)
);