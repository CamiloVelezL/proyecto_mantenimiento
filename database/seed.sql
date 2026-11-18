-- Insertar espacios de prueba
INSERT INTO espacios (nombre, ubicacion) VALUES 
('Aula 101', 'Bloque A'),
('Oficina 202', 'Bloque B'),
('Laboratorio 3', 'Bloque C');

-- Insertar usuarios de prueba 
-- (Contraseña de los tres usuarios: "123456", guardada con bcrypt)
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES 
('Camilo Reportante', 'reportante@admin.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXeF8.CSXAdJsNSp2ZXXAum1QelgJGXoPC', 'Reportante'),
('Tecnico Uno', 'tecnico@admin.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXeF8.CSXAdJsNSp2ZXXAum1QelgJGXoPC', 'Mantenimiento'),
('Coordinador Uno', 'coordinador@admin.com', '$2a$10$EixZaYVK1fsbw1ZfbX3OXeF8.CSXAdJsNSp2ZXXAum1QelgJGXoPC', 'Coordinacion');

-- Insertar un reporte inicial
INSERT INTO reportes (descripcion, espacio_id, reportante_id) VALUES 
('Falla en la iluminación del Aula 101', 1, 1);