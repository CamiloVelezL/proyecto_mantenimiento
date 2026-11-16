import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DashboardReportante = () => {
  const [reportes, setReportes] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [espacioId, setEspacioId] = useState('');
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cargarReportes = async () => {
    try {
      const response = await api.get('/reportes');
      const misReportes = response.data.filter(r => r.reportante_id === usuario.id);
      setReportes(misReportes);
    } catch (error) {
      console.error('Error al cargar reportes', error);
    }
  };

  useEffect(() => {
    if (!usuario) {
      navigate('/');
      return;
    }
    const inicializar = async () => {
        await cargarReportes();
    };
    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCrearReporte = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      alert('La descripción de la falla es obligatoria.');
      return;
    }
    if (!espacioId) {
      alert('Debe indicar el ID del espacio o instalación.');
      return;
    }

    try {
      await api.post('/reportes', {
        descripcion: descripcion,
        espacio_id: espacioId,
        reportante_id: usuario.id
      });
      setDescripcion('');
      setEspacioId('');
      cargarReportes();
    } catch (error) {
      console.error('Error al crear reporte', error);
      alert('Ocurrió un error al crear el reporte.');
    }
  };

  if (!usuario) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Reportante - {usuario.nombre}</h1>
        <button className="btn-logout" onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>
          Cerrar Sesión
        </button>
      </header>

      <div className="card">
        <h3>Reportar Nueva Falla</h3>
        <form onSubmit={handleCrearReporte} style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Descripción de la falla:</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              rows="3" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }} 
              placeholder="Describa el problema detalladamente..."
            />
          </div>
          <div className="form-group">
            <label>ID del Espacio (Aula, Oficina, etc.):</label>
            <input 
              type="number" 
              value={espacioId} 
              onChange={(e) => setEspacioId(e.target.value)} 
              placeholder="Ej: 1"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Enviar Reporte</button>
        </form>
      </div>

      <div className="card">
        <h3>Mis Reportes</h3>
        {reportes.length === 0 ? <p style={{ marginTop: '1rem' }}>No tienes reportes creados.</p> : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha</th>
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
                  <td>{new Date(rep.fecha_creacion).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardReportante;