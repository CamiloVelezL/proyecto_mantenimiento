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
      try {
        const response = await api.get('/reportes');
        const misReportes = response.data.filter(r => r.reportante_id === usuario.id);
        setReportes(misReportes);
      } catch (error) {
        console.error('Error al cargar reportes iniciales', error);
      }
    };

    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCrearReporte = async (e) => {
    e.preventDefault();
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
    }
  };

  if (!usuario) return null;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Reportante - {usuario.nombre}</h1>
      <button onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>Cerrar Sesión</button>

      <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px' }}>
        <h3>Reportar Nueva Falla</h3>
        <form onSubmit={handleCrearReporte}>
          <div>
            <label>Descripción de la falla:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3" style={{ width: '100%' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>ID del Espacio (Aula, Oficina, etc.):</label>
            <input type="number" value={espacioId} onChange={(e) => setEspacioId(e.target.value)} />
          </div>
          <button type="submit" style={{ marginTop: '10px' }}>Enviar Reporte</button>
        </form>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Mis Reportes</h3>
        {reportes.length === 0 ? <p>No tienes reportes creados.</p> : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <td><strong>{rep.estado}</strong></td>
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