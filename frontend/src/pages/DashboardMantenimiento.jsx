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
      // Filtramos solo los reportes asignados a este técnico
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
  }, [usuario, navigate]);

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
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Mantenimiento - {usuario.nombre}</h1>
      <button onClick={() => { localStorage.removeItem('usuario'); navigate('/'); }}>Cerrar Sesión</button>

      <div style={{ marginTop: '30px' }}>
        <h3>Mis Reportes Asignados</h3>
        {reportes.length === 0 ? <p>No tienes reportes asignados.</p> : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <td><strong>{rep.estado}</strong></td>
                  <td>
                    {rep.estado !== 'Cerrado' && (
                      <button onClick={() => setReporteSeleccionado(rep)}>
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

      {/* Formulario de Intervención */}
      {reporteSeleccionado && (
        <div style={{ marginTop: '30px', border: '1px solid blue', padding: '20px' }}>
          <h3>Intervenir Reporte #{reporteSeleccionado.id}</h3>
          <form onSubmit={handleIntervenir}>
            <div>
              <label>Descripción de la intervención:</label>
              <textarea value={intervencion} onChange={(e) => setIntervencion(e.target.value)} rows="3" style={{ width: '100%' }} />
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Guardar Intervención</button>
            <button type="button" onClick={() => setReporteSeleccionado(null)} style={{ marginLeft: '10px' }}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DashboardMantenimiento;
