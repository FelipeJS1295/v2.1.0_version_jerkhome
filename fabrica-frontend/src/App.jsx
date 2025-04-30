import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Insumos from './pages/Insumos';
import Proveedores from './pages/Proveedores';
import Configuraciones from './pages/Configuraciones';
import VentasImportar from './pages/VentasImportar';
import VentasImportarWalmart from './pages/VentasImportarWalmart';
import VentasImportarParis from './pages/VentasImportarParis';
import VentasImportarHites from './pages/VentasImportarHites';
import VentasActualizarHites from './pages/VentasActualizarHites';
import VentasLista from './pages/VentasLista';
import VentasMaestra from './pages/VentasMaestra';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Configuraciones />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/ventas" element={<VentasImportar />} />
          <Route path="/ventas/walmart" element={<VentasImportarWalmart />} />
          <Route path="/ventas/paris" element={<VentasImportarParis />} />
          <Route path="/ventas/hites" element={<VentasImportarHites />} />
          <Route path="/ventas/hites/actualizar" element={<VentasActualizarHites />} />
          <Route path="/ventas/listado" element={<VentasLista />} />
          <Route path="/ventas/maestra" element={<VentasMaestra />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;