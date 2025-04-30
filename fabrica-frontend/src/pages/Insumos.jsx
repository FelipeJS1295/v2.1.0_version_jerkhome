import React, { useState, useEffect } from 'react';
import InsumoForm from '../components/InsumoForm';
import InsumoList from '../components/InsumoList';

function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInsumos, setFilteredInsumos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    disponibles: 0,
    agotados: 0,
    valorTotal: 0
  });

  const obtenerInsumos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/insumos');
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setInsumos(data);
      
      // Calcular estadísticas
      const disponibles = data.filter(i => i.stock > 0).length;
      const valorTotal = data.reduce((total, i) => total + (i.precio * (i.stock || 0)), 0);
      
      setEstadisticas({
        total: data.length,
        disponibles,
        agotados: data.length - disponibles,
        valorTotal
      });
      
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar insumos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerInsumos();
  }, []);

  useEffect(() => {
    // Filtrar insumos basados en la búsqueda
    const filtered = insumos.filter(insumo => 
      insumo.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      insumo.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insumo.codigo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insumo.proveedor?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Ordenar insumos
    const sorted = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredInsumos(sorted);
  }, [insumos, searchQuery, sortConfig]);

  const guardarInsumo = async (insumo) => {
    setIsLoading(true);
    
    try {
      const metodo = insumo.id ? 'PUT' : 'POST';
      const url = insumo.id
        ? `${import.meta.env.VITE_API_URL}/api/insumos/${insumo.id}`
        : `${import.meta.env.VITE_API_URL}/api/insumos`;

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insumo),
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      setInsumoSeleccionado(null);
      setShowForm(false);
      await obtenerInsumos();
      
      // Mostrar notificación de éxito (puedes implementar tu propio sistema de notificaciones)
      console.log(`Insumo ${insumo.id ? 'actualizado' : 'creado'} exitosamente`);
      
    } catch (err) {
      setError(err.message);
      console.error("Error al guardar insumo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarInsumo = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este insumo?')) {
      setIsLoading(true);
      
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/insumos/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        await obtenerInsumos();
        
        // Mostrar notificación de éxito
        console.log("Insumo eliminado exitosamente");
        
      } catch (err) {
        setError(err.message);
        console.error("Error al eliminar insumo:", err);
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

  const editarInsumo = (insumo) => {
    setInsumoSeleccionado(insumo);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Gestión de Insumos
          </h2>
          <p className="text-sm text-slate-500">
            Administre el inventario de materiales e insumos para su operación
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => {setShowForm(!showForm); setInsumoSeleccionado(null);}}
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
            {showForm ? 'Cancelar' : 'Nuevo Insumo'}
          </button>
          
          <button 
            onClick={obtenerInsumos}
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
            <span className="text-slate-500 text-sm font-medium">Total Insumos</span>
            <span className="text-amber-600 bg-amber-50 p-1 rounded text-xs font-medium">Inventario</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.total}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Disponibles</span>
            <span className="text-green-600 bg-green-50 p-1 rounded text-xs font-medium">En stock</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.disponibles}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-green-800 bg-green-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.disponibles / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Agotados</span>
            <span className="text-red-600 bg-red-50 p-1 rounded text-xs font-medium">Sin stock</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.agotados}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-red-800 bg-red-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.agotados / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Valor de Inventario</span>
            <span className="text-blue-600 bg-blue-50 p-1 rounded text-xs font-medium">Financiero</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">
              ${estadisticas.valorTotal.toLocaleString('es-CL')}
            </span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 mb-6">
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="text-sm font-medium text-slate-800">
              {insumoSeleccionado ? 'Editar Insumo' : 'Nuevo Insumo'}
            </h3>
          </div>
          <InsumoForm
            insumoSeleccionado={insumoSeleccionado}
            onSave={guardarInsumo}
            onCancel={() => {
              setInsumoSeleccionado(null);
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
              placeholder="Buscar insumos por nombre, código, descripción o proveedor..."
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
              <option value="codigo">Ordenar por Código</option>
              <option value="precio">Ordenar por Precio</option>
              <option value="stock">Ordenar por Stock</option>
              <option value="proveedor">Ordenar por Proveedor</option>
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

      {/* Lista de insumos */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : filteredInsumos.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-slate-500 text-sm">No se encontraron insumos</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <InsumoList
            insumos={filteredInsumos}
            onEdit={editarInsumo}
            onDelete={eliminarInsumo}
          />
        )}
      </div>
    </div>
  );
}

export default Insumos;