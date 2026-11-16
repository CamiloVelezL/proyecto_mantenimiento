import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DashboardMantenimiento = () => {
  const [reportes, setReportes] = useState([]);
  const [intervencion, setIntervencion] = useState('');
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cargarReportes = async () => {
    try {
      const response = await api.get('/reportes');
      const misReportes = response.data.filter(r => r.asignado_id === usuario.id);
      setReportes(misReportes);
    } catch (error) {
      console.error('Error al cargar reportes', error);
    }
  };

  useEffect(() => {
    if (!usuario || usuario.rol !== 'Mantenimiento') {
      navigate('/');
      return;
    }
    const inicializar = async () => {
        await cargarReportes();
    };
    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntervenir = async (e) => {
    e.preventDefault();
    if (!intervencion.trim()) {
      alert('La descripción de la intervención es obligatoria.');
      return;
    }

    try {
      await api.post('/intervenciones', {
        descripcion: intervencion,
        reporte_id: reporteSeleccionado.id,
        tecnico_id: usuario.id
      });
      setIntervencion('');
      setReporteSeleccionado(null);
      cargarReportes();
      alert('Intervención registrada. El reporte ha pasado a "En Proceso".');
    } catch (error) {
      console.error('Error al registrar intervención', error);
    }
  };

  if (!usuario) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Mantenimiento - {usuario.nombre}</h1>
        <button className="btn-logout" onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>
          Cerrar Sesión
        </button>
      </header>

      <div className="card">
        <h3>Mis Reportes Asignados</h3>
        {reportes.length === 0 ? <p style={{ marginTop: '1rem' }}>No tienes reportes asignados.</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acción</th>
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
                    {rep.estado !== 'Cerrado' && (
                      <button className="btn-primary" style={{ width: 'auto', padding: '5px 10px', marginTop: 0 }} onClick={() => setReporteSeleccionado(rep)}>
                        Registrar Intervención
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {reporteSeleccionado && (
        <div className="card" style={{ border: '2px solid #3b82f6' }}>
          <h3>Intervenir Reporte #{reporteSeleccionado.id}</h3>
          <form onSubmit={handleIntervenir} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Descripción de la intervención:</label>
              <textarea 
                value={intervencion} 
                onChange={(e) => setIntervencion(e.target.value)} 
                rows="3" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }} 
                placeholder="Detalle el trabajo realizado..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Guardar Intervención</button>
              <button type="button" className="btn-logout" onClick={() => setReporteSeleccionado(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardMantenimiento;