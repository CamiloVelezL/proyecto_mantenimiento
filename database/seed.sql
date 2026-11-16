-- Insertar espacios de prueba
INSERT INTO espacios (nombre, ubicacion) VALUES 
('Aula 101', 'Bloque A'),
('Oficina 202', 'Bloque B'),
('Laboratorio 3', 'Bloque C');

-- Insertar usuarios de prueba 
-- (Contraseña en texto plano: "123456")
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES 
('Camilo Reportante', 'reportante@test.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjUGnJ63ba', 'Reportante'),
('Tecnico Uno', 'tecnico@test.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjUGnJ63ba', 'Mantenimiento'),
('Coordinador Uno', 'coordinador@test.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjUGnJ63ba', 'Coordinacion');

-- Insertar un reporte inicial
INSERT INTO reportes (descripcion, espacio_id, reportante_id) VALUES 
('Falla en la iluminación del Aula 101', 1, 1);