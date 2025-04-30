import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function VentasLista() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [filtros, setFiltros] = useState({
    cliente: '',
    estado: '',
    orden: '',
    desde: '',
    hasta: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    nuevas: 0,
    enviadas: 0, 
    canceladas: 0
  });
  
  const cargarVentas = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/ventas/listado');
      if (!res.ok) throw new Error('Error al cargar ventas');
      const data = await res.json();
      setVentas(data.ventas);
      
      // Calcular estadísticas
      const nuevas = data.ventas.filter(v => v.estado === 'Nueva').length;
      const enviadas = data.ventas.filter(v => v.estado === 'Enviada').length;
      const canceladas = data.ventas.filter(v => v.estado === 'Cancelada').length;
      
      setEstadisticas({
        total: data.ventas.length,
        nuevas,
        enviadas,
        canceladas
      });
      
    } catch (err) {
      console.error(err);
      setError('Error al cargar las ventas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const toggleSeleccion = (numero_orden) => {
    setSeleccionadas((prev) =>
      prev.includes(numero_orden)
        ? prev.filter((id) => id !== numero_orden)
        : [...prev, numero_orden]
    );
  };
  
  const seleccionarTodo = (e) => {
    if (e.target.checked) {
      setSeleccionadas(ventasFiltradas.map(v => v.numero_orden));
    } else {
      setSeleccionadas([]);
    }
  };

  const cambiarEstadoLote = async (nuevoEstado) => {
    if (seleccionadas.length === 0) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/ventas/cambiar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordenes: seleccionadas, estado: nuevoEstado }),
      });
      
      if (!res.ok) throw new Error('Error al cambiar estado');
      
      await cargarVentas();
      setSeleccionadas([]);
      
      // Mostrar notificación de éxito (puedes implementar tu propio sistema de notificaciones)
      console.log(`${seleccionadas.length} ventas actualizadas a estado ${nuevoEstado}`);
      
    } catch (err) {
      console.error(err);
      setError(`Error al cambiar estado: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const eliminarVenta = async (numero_orden) => {
    if (!window.confirm(`¿Está seguro de eliminar la orden ${numero_orden}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ventas/eliminar/${numero_orden}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Error al eliminar venta');
      
      await cargarVentas();
      
      // Mostrar notificación de éxito
      console.log(`Venta ${numero_orden} eliminada exitosamente`);
      
    } catch (err) {
      console.error(err);
      setError(`Error al eliminar venta: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const ventasFiltradas = ventas.filter((venta) => {
    const fecha = dayjs(venta.fecha_entrega);
    const desde = filtros.desde ? dayjs(filtros.desde) : null;
    const hasta = filtros.hasta ? dayjs(filtros.hasta) : null;

    return (
      (!filtros.cliente || venta.cliente_nombre.toLowerCase().includes(filtros.cliente.toLowerCase())) &&
      (!filtros.estado || venta.estado === filtros.estado) &&
      (!filtros.orden || venta.numero_orden?.includes(filtros.orden)) &&
      (!desde || fecha.isAfter(desde.subtract(1, 'day'))) &&
      (!hasta || fecha.isBefore(hasta.add(1, 'day')))
    );
  });
  
  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = ventasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calcular estado de ventas para visualización
  const getEstadoClase = (estado) => {
    switch (estado) {
      case 'Nueva':
        return 'bg-blue-50 text-blue-700';
      case 'Enviada':
        return 'bg-green-50 text-green-700';
      case 'Cancelada':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };
  
  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      cliente: '',
      estado: '',
      orden: '',
      desde: '',
      hasta: ''
    });
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Encabezado de la página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-slate-800 flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ventas Registradas
          </h2>
          <p className="text-sm text-slate-500">
            Gestione y controle las órdenes de venta
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={cargarVentas}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
            disabled={loading}
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
          <button 
            onClick={() => window.location.href = '/ventas/nueva'}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Venta
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Ventas</span>
            <span className="text-slate-600 bg-slate-50 p-1 rounded text-xs font-medium">General</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.total}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Ventas Nuevas</span>
            <span className="text-blue-600 bg-blue-50 p-1 rounded text-xs font-medium">Pendientes</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.nuevas}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-blue-800 bg-blue-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.nuevas / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Ventas Enviadas</span>
            <span className="text-green-600 bg-green-50 p-1 rounded text-xs font-medium">Completadas</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.enviadas}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-green-800 bg-green-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.enviadas / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Ventas Canceladas</span>
            <span className="text-red-600 bg-red-50 p-1 rounded text-xs font-medium">Anuladas</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.canceladas}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-red-800 bg-red-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.canceladas / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
          <button 
            className="ml-auto text-red-500 hover:text-red-700"
            onClick={() => setError('')}
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label htmlFor="cliente" className="block text-xs font-medium text-slate-700 mb-1">
              Cliente
            </label>
            <input
              id="cliente"
              type="text"
              placeholder="Buscar por cliente..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filtros.cliente}
              onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="orden" className="block text-xs font-medium text-slate-700 mb-1">
              Número de Orden
            </label>
            <input
              id="orden"
              type="text"
              placeholder="Buscar por orden..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filtros.orden}
              onChange={(e) => setFiltros({ ...filtros, orden: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="estado" className="block text-xs font-medium text-slate-700 mb-1">
              Estado
            </label>
            <select
              id="estado"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            >
              <option value="">Todos los estados</option>
              <option value="Nueva">Nueva</option>
              <option value="Enviada">Enviada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="desde" className="block text-xs font-medium text-slate-700 mb-1">
              Desde
            </label>
            <input
              id="desde"
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filtros.desde}
              onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="hasta" className="block text-xs font-medium text-slate-700 mb-1">
              Hasta
            </label>
            <div className="flex gap-2">
              <input
                id="hasta"
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filtros.hasta}
                onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
              />
              <button 
                onClick={limpiarFiltros}
                className="flex-shrink-0 px-3 py-2 border border-slate-300 text-slate-600 text-xs rounded-md hover:bg-slate-50"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones por lotes */}
      {seleccionadas.length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 shadow-sm p-3 mb-5 flex flex-wrap items-center">
          <div className="text-sm text-blue-700 font-medium mr-4">
            {seleccionadas.length} {seleccionadas.length === 1 ? 'venta seleccionada' : 'ventas seleccionadas'}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => cambiarEstadoLote('Enviada')}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Marcar como Enviadas
            </button>
            
            <button
              onClick={() => cambiarEstadoLote('Nueva')}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Marcar como Nuevas
            </button>
            
            <button
              onClick={() => cambiarEstadoLote('Cancelada')}
              disabled={isProcessing}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Marcar como Canceladas
            </button>
            
            <button
              onClick={() => setSeleccionadas([])}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 text-white text-xs font-medium rounded hover:bg-slate-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Deseleccionar todo
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : ventasFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-slate-500 text-sm">No hay ventas para mostrar</p>
            <button 
              onClick={limpiarFiltros}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={currentVentas.length > 0 && currentVentas.every(v => seleccionadas.includes(v.numero_orden))}
                        onChange={seleccionarTodo}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Fecha Entrega
                    </th>
                    <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {currentVentas.map((venta) => (
                    <tr key={venta.numero_orden} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={seleccionadas.includes(venta.numero_orden)}
                          onChange={() => toggleSeleccion(venta.numero_orden)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium mr-3">
                            {venta.cliente_nombre?.substring(0, 2).toUpperCase() || 'CL'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {venta.cliente_nombre || 'Cliente sin nombre'}
                            </div>
                            <div className="text-xs text-slate-500">
                              Orden: {venta.numero_orden}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {dayjs(venta.fecha_entrega).format('DD/MM/YYYY')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-800">
                          {venta.producto || 'Producto sin nombre'}
                        </div>
                        {venta.sku && (
                          <div className="text-xs text-slate-500 font-mono">
                            SKU: {venta.sku}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEstadoClase(venta.estado)}`}>
                          {venta.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => window.location.href = `/ventas/ver/${venta.numero_orden}`}
                          className="inline-flex items-center px-2 py-1 border border-slate-200 text-xs leading-4 font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarVenta(venta.numero_orden)}
                          disabled={isProcessing}
                          className="inline-flex items-center px-2 py-1 border border-red-200 text-xs leading-4 font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            {ventasFiltradas.length > itemsPerPage && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage < Math.ceil(ventasFiltradas.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                    disabled={currentPage >= Math.ceil(ventasFiltradas.length / itemsPerPage)}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md ${
                      currentPage >= Math.ceil(ventasFiltradas.length / itemsPerPage)
                        ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-700">
                      Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
                      <span className="font-medium">
                        {indexOfLastItem > ventasFiltradas.length ? ventasFiltradas.length : indexOfLastItem}
                      </span>{' '}
                      de <span className="font-medium">{ventasFiltradas.length}</span> ventas
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 text-sm font-medium ${
                          currentPage === 1
                            ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                            : 'bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Páginas */}
                      {Array.from({ length: Math.min(5, Math.ceil(ventasFiltradas.length / itemsPerPage)) }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        return (
                          <button
                            key={idx}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === pageNumber
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(currentPage < Math.ceil(ventasFiltradas.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                        disabled={currentPage >= Math.ceil(ventasFiltradas.length / itemsPerPage)}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 text-sm font-medium ${
                          currentPage >= Math.ceil(ventasFiltradas.length / itemsPerPage)
                            ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                            : 'bg-white text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className="sr-only">Siguiente</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VentasLista;