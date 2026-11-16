import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardReportante from './pages/DashboardReportante';
import DashboardMantenimiento from './pages/DashboardMantenimiento';
import DashboardCoordinacion from './pages/DashboardCoordinacion';

const DashboardRouter = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (!usuario) return <Navigate to="/" />;
  
  if (usuario.rol === 'Reportante') return <DashboardReportante />;
  if (usuario.rol === 'Mantenimiento') return <DashboardMantenimiento />;
  if (usuario.rol === 'Coordinacion') return <DashboardCoordinacion />;
  
  return <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;