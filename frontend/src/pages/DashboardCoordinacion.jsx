import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DashboardCoordinacion = () => {
  const [reportes, setReportes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]); 
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cargarDatos = async () => {
    try {
      const resReportes = await api.get('/reportes');
      setReportes(resReportes.data);
      
      setTecnicos([
        { id: 2, nombre: 'Técnico de Prueba 1' },
        { id: 3, nombre: 'Técnico de Prueba 2' }
      ]);
    } catch (error) {
      console.error('Error al cargar datos', error);
    }
  };

  useEffect(() => {
    if (!usuario || usuario.rol !== 'Coordinacion') {
      navigate('/');
      return;
    }
    const inicializar = async () => {
        await cargarDatos();
    };
    inicializar();
  }, [usuario, navigate]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/reportes/${id}/estado`, { nuevo_estado: nuevoEstado });
      cargarDatos();
    } catch (error) {
      console.error('Error al cambiar estado', error);
      alert('Error al cambiar estado. Revisa las reglas de transición.');
    }
  };

  const handleAsignar = async (id, asignadoId) => {
    if (!asignadoId) return;
    try {
      await api.patch(`/reportes/${id}/asignar`, { asignado_id: parseInt(asignadoId) });
      cargarDatos();
    } catch (error) {
      console.error('Error al asignar', error);
    }
  };

  if (!usuario) return null;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Coordinación - {usuario.nombre}</h1>
      <button onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>Cerrar Sesión</button>

      <div style={{ marginTop: '30px' }}>
        <h3>Todos los Reportes</h3>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map(rep => (
              <tr key={rep.id}>
                <td>{rep.id}</td>
                <td>{rep.descripcion}</td>
                <td><strong>{rep.estado}</strong></td>
                <td>
                  {rep.estado === 'Reportado' && (
                    <button onClick={() => handleCambiarEstado(rep.id, 'En Evaluacion')}>Evaluar</button>
                  )}
                  {rep.estado === 'En Evaluacion' && (
                    <select onChange={(e) => handleAsignar(rep.id, e.target.value)} defaultValue="">
                      <option value="" disabled>Asignar Técnico...</option>
                      {tecnicos.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  )}
                  {rep.estado === 'En Proceso' && (
                    <button onClick={() => handleCambiarEstado(rep.id, 'Cerrado')} style={{ backgroundColor: 'green', color: 'white' }}>Cerrar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardCoordinacion;