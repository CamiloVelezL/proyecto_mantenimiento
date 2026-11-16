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
      
      const resTecnicos = await api.get('/auth/tecnicos');
      setTecnicos(resTecnicos.data);
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Coordinación - {usuario.nombre}</h1>
        <button className="btn-logout" onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>
          Cerrar Sesión
        </button>
      </header>

      <div className="card">
        <h3>Todos los Reportes</h3>
        <table className="table">
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
                <td>
                  <span className={`badge badge-${rep.estado.toLowerCase().replace(' ', '-')}`}>
                    {rep.estado}
                  </span>
                </td>
                <td>
                  {rep.estado === 'Reportado' && (
                    <button className="btn-primary" style={{ width: 'auto', padding: '5px 10px', marginTop: 0 }} onClick={() => handleCambiarEstado(rep.id, 'En Evaluacion')}>Evaluar</button>
                  )}
                  {rep.estado === 'En Evaluacion' && (
                    <select className="form-group" onChange={(e) => handleAsignar(rep.id, e.target.value)} defaultValue="" style={{ padding: '5px', borderRadius: '5px' }}>
                      <option value="" disabled>Asignar Técnico...</option>
                      {tecnicos.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                  )}
                  {rep.estado === 'En Proceso' && (
                    <button className="btn-primary" style={{ backgroundColor: '#059669', width: 'auto', padding: '5px 10px', marginTop: 0 }} onClick={() => handleCambiarEstado(rep.id, 'Cerrado')}>Cerrar</button>
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