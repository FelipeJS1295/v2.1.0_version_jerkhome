import React, { useState, useEffect } from 'react';
import ClientForm from '../components/ClientForm';
import ClientList from '../components/ClientList';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    nuevos: 0
  });

  const obtenerClientes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/clientes');
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setClientes(data);
      
      // Calcular estadísticas básicas
      const ahora = new Date();
      const unMesAtras = new Date();
      unMesAtras.setMonth(ahora.getMonth() - 1);
      
      const activos = data.filter(c => c.activo).length;
      const nuevos = data.filter(c => {
        const fechaCreacion = c.fecha_creacion ? new Date(c.fecha_creacion) : null;
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
      console.error("Error al cargar clientes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  useEffect(() => {
    // Filtrar clientes basados en la búsqueda
    const filtered = clientes.filter(cliente => 
      cliente.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cliente.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cliente.telefono?.includes(searchQuery) ||
      cliente.rut?.includes(searchQuery)
    );
    
    // Ordenar clientes
    const sorted = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredClientes(sorted);
  }, [clientes, searchQuery, sortConfig]);

  const guardarCliente = async (cliente) => {
    setIsLoading(true);
    
    try {
      const metodo = cliente.id ? 'PUT' : 'POST';
      const url = cliente.id
        ? `${import.meta.env.VITE_API_URL}/api/clientes/${cliente.id}`
        : `${import.meta.env.VITE_API_URL}/api/clientes`;

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      setClienteSeleccionado(null);
      setShowForm(false);
      await obtenerClientes();
      
      // Mostrar notificación de éxito (puedes implementar tu propio sistema de notificaciones)
      console.log(`Cliente ${cliente.id ? 'actualizado' : 'creado'} exitosamente`);
      
    } catch (err) {
      setError(err.message);
      console.error("Error al guardar cliente:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      setIsLoading(true);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        await obtenerClientes();
        
        // Mostrar notificación de éxito
        console.log("Cliente eliminado exitosamente");
        
      } catch (err) {
        setError(err.message);
        console.error("Error al eliminar cliente:", err);
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

  const editarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Gestión de Clientes
          </h2>
          <p className="text-sm text-slate-500">
            Administre su cartera de clientes y contactos comerciales
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => {setShowForm(!showForm); setClienteSeleccionado(null);}}
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
            {showForm ? 'Cancelar' : 'Nuevo Cliente'}
          </button>
          
          <button 
            onClick={obtenerClientes}
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
            <span className="text-slate-500 text-sm font-medium">Total Clientes</span>
            <span className="text-blue-600 bg-blue-50 p-1 rounded text-xs font-medium">Total</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.total}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Clientes Activos</span>
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
            <span className="text-slate-500 text-sm font-medium">Clientes Inactivos</span>
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
            <span className="text-slate-500 text-sm font-medium">Nuevos Clientes</span>
            <span className="text-purple-600 bg-purple-50 p-1 rounded text-xs font-medium">Último mes</span>
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
              {clienteSeleccionado ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>
          </div>
          <ClientForm
            clienteSeleccionado={clienteSeleccionado}
            onSave={guardarCliente}
            onCancel={() => {
              setClienteSeleccionado(null);
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
              placeholder="Buscar clientes por nombre, email, RUT o teléfono..."
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

      {/* Lista de clientes */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-slate-500 text-sm">No se encontraron clientes</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ClientList
            clientes={filteredClientes}
            onEdit={editarCliente}
            onDelete={eliminarCliente}
          />
        )}
      </div>
    </div>
  );
}

export default Clientes;