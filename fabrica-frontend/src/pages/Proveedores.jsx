import React, { useState, useEffect } from 'react';
import ProveedorForm from '../components/ProveedorForm';
import ProveedorList from '../components/ProveedorList';

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    nuevos: 0
  });

  const obtenerProveedores = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:3000/api/proveedores');
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setProveedores(data);
      
      // Calcular estadísticas básicas
      const ahora = new Date();
      const unMesAtras = new Date();
      unMesAtras.setMonth(ahora.getMonth() - 1);
      
      const activos = data.filter(p => p.activo).length;
      const nuevos = data.filter(p => {
        const fechaCreacion = p.fecha_creacion ? new Date(p.fecha_creacion) : null;
        return fechaCreacion && fechaCreacion >= unMesAtras;
      }).length;
      
      setEstadisticas({
        total: data.length,
        activos,
        inactivos: data.length - activos,
        nuevos
      });
      
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar proveedores:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  useEffect(() => {
    // Filtrar proveedores basados en la búsqueda
    const filtered = proveedores.filter(proveedor => 
      proveedor.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      proveedor.rut?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proveedor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proveedor.telefono?.includes(searchQuery) ||
      proveedor.direccion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Ordenar proveedores
    const sorted = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredProveedores(sorted);
  }, [proveedores, searchQuery, sortConfig]);

  const guardarProveedor = async (proveedor) => {
    setIsLoading(true);
    
    try {
      const metodo = proveedor.id ? 'PUT' : 'POST';
      const url = proveedor.id
        ? `http://localhost:3000/api/proveedores/${proveedor.id}`
        : `http://localhost:3000/api/proveedores`;

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedor),
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      setProveedorSeleccionado(null);
      setShowForm(false);
      await obtenerProveedores();
      
      // Mostrar notificación de éxito (puedes implementar tu propio sistema de notificaciones)
      console.log(`Proveedor ${proveedor.id ? 'actualizado' : 'creado'} exitosamente`);
      
    } catch (err) {
      setError(err.message);
      console.error("Error al guardar proveedor:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarProveedor = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
      setIsLoading(true);
      
      try {
        const res = await fetch(`http://localhost:3000/api/proveedores/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        await obtenerProveedores();
        
        // Mostrar notificación de éxito
        console.log("Proveedor eliminado exitosamente");
        
      } catch (err) {
        setError(err.message);
        console.error("Error al eliminar proveedor:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const editarProveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShowForm(true);
    // Desplazarse al inicio del formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Encabezado de la página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-slate-800 flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            Gestión de Proveedores
          </h2>
          <p className="text-sm text-slate-500">
            Administre sus proveedores y cadena de suministro
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => {setShowForm(!showForm); setProveedorSeleccionado(null);}}
            className={`px-3 py-1.5 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
              showForm 
                ? 'text-slate-600 border border-slate-300 hover:bg-slate-100' 
                : 'text-white bg-slate-800 hover:bg-slate-700'
            }`}
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {showForm 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              }
            </svg>
            {showForm ? 'Cancelar' : 'Nuevo Proveedor'}
          </button>
          
          <button 
            onClick={obtenerProveedores}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Proveedores</span>
            <span className="text-purple-600 bg-purple-50 p-1 rounded text-xs font-medium">Total</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.total}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Proveedores Activos</span>
            <span className="text-green-600 bg-green-50 p-1 rounded text-xs font-medium">Activos</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.activos}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-green-800 bg-green-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.activos / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Proveedores Inactivos</span>
            <span className="text-amber-600 bg-amber-50 p-1 rounded text-xs font-medium">Inactivos</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.inactivos}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-amber-800 bg-amber-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.inactivos / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Nuevos Proveedores</span>
            <span className="text-blue-600 bg-blue-50 p-1 rounded text-xs font-medium">Último mes</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.nuevos}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 mb-6">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-medium text-slate-800">
              {proveedorSeleccionado ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h3>
          </div>
          <ProveedorForm
            proveedorSeleccionado={proveedorSeleccionado}
            onSave={guardarProveedor}
            onCancel={() => {
              setProveedorSeleccionado(null);
              setShowForm(false);
            }}
          />
        </div>
      )}
      
      {/* Errores */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
          <button 
            className="ml-auto text-red-500 hover:text-red-700"
            onClick={() => setError(null)}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Buscador y filtros */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar proveedores por nombre, RUT, email o dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-600"
              onChange={(e) => handleSort(e.target.value)}
              value={sortConfig.key}
            >
              <option value="nombre">Ordenar por Nombre</option>
              <option value="rut">Ordenar por RUT</option>
              <option value="email">Ordenar por Email</option>
              <option value="telefono">Ordenar por Teléfono</option>
              <option value="fecha_creacion">Ordenar por Fecha de registro</option>
            </select>
            
            <button 
              className="px-3 py-2 border border-slate-200 rounded-md text-sm hover:bg-slate-50 transition-colors"
              onClick={() => setSortConfig({...sortConfig, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}
            >
              {sortConfig.direction === 'asc' ? (
                <svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lista de proveedores */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : filteredProveedores.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            <p className="text-slate-500 text-sm">No se encontraron proveedores</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ProveedorList
            proveedores={filteredProveedores}
            onEdit={editarProveedor}
            onDelete={eliminarProveedor}
          />
        )}
      </div>
    </div>
  );
}

export default Proveedores;