import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';


function VentasMaestra() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('todo');
  const [clienteFiltrado, setClienteFiltrado] = useState('');
  const [productoFiltrado, setProductoFiltrado] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    totalUnidades: 0,
    totalClientes: 0,
    totalProductos: 0,
    mayorCliente: { nombre: '', unidades: 0 }
  });

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/ventas/maestra');
        if (!res.ok) throw new Error('Error al cargar la vista maestra');
        const data = await res.json();
        setDatos(data.datos);
        
        // Calcular estadísticas
        const totalUnidades = data.datos.reduce((acc, d) => acc + Number(d.total_unidades || 0), 0);
        const clientes = [...new Set(data.datos.map(d => d.cliente))];
        const productos = [...new Set(data.datos.map(d => d.producto))];
        
        // Encontrar cliente con más unidades
        const ventasPorCliente = {};
        data.datos.forEach(d => {
          if (!ventasPorCliente[d.cliente]) ventasPorCliente[d.cliente] = 0;
          ventasPorCliente[d.cliente] += Number(d.total_unidades || 0);
        });
        
        let mayorCliente = { nombre: '', unidades: 0 };
        Object.entries(ventasPorCliente).forEach(([cliente, unidades]) => {
          if (unidades > mayorCliente.unidades) {
            mayorCliente = { nombre: cliente, unidades };
          }
        });
        
        setEstadisticas({
          totalUnidades,
          totalClientes: clientes.length,
          totalProductos: productos.length,
          mayorCliente
        });
        
      } catch (err) {
        console.error(err);
        setError('Error al cargar la vista maestra. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleImprimir = () => {
    const contenido = document.getElementById('area-a-imprimir').innerHTML;
    const ventana = window.open('', '', 'width=1000,height=700');
    ventana.document.write(`
      <html>
        <head>
          <title>Vista Maestra de Ventas</title>
          <style>
            body { font-family: sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
            th { background-color: #f8f8f8; }
          </style>
        </head>
        <body>
          ${contenido}
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  };
  

  // Filtrar por periodo
  const filtrarPorPeriodo = (fecha) => {
    const hoy = dayjs();
    const fechaVenta = dayjs(fecha);
    
    switch (periodoSeleccionado) {
      case 'ultimos30':
        return fechaVenta.isAfter(hoy.subtract(30, 'day'));
      case 'ultimos90':
        return fechaVenta.isAfter(hoy.subtract(90, 'day'));
      case 'año':
        return fechaVenta.year() === hoy.year();
      default:
        return true; // todo
    }
  };

  // Construir datos filtrados
  const datosFiltrados = datos.filter(d => {
    return filtrarPorPeriodo(d.fecha_entrega) && 
           (!clienteFiltrado || d.cliente.toLowerCase().includes(clienteFiltrado.toLowerCase())) &&
           (!productoFiltrado || d.producto.toLowerCase().includes(productoFiltrado.toLowerCase()));
  });

  // Agrupar por cliente → producto → fechas
  const agrupado = {};
  const fechasUnicas = new Set();

  datosFiltrados.forEach(({ cliente, producto, fecha_entrega, total_unidades }) => {
    if (!agrupado[cliente]) agrupado[cliente] = {};
    if (!agrupado[cliente][producto]) agrupado[cliente][producto] = {};
    agrupado[cliente][producto][fecha_entrega] = total_unidades;
    fechasUnicas.add(fecha_entrega);
  });

  const fechasOrdenadas = [...fechasUnicas].sort((a, b) => new Date(a) - new Date(b));

  const formatearFecha = (fecha) => dayjs(fecha).format('DD/MM/YY');
  
  // Obtener lista de clientes y productos para filtros
  const listaClientes = [...new Set(datos.map(d => d.cliente))].sort();
  const listaProductos = [...new Set(datos.map(d => d.producto))].sort();

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Encabezado de la página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-medium text-slate-800 flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Vista Maestra de Ventas
          </h2>
          <p className="text-sm text-slate-500">
            Análisis consolidado por cliente, producto y fecha
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
            disabled={loading}
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
          <button 
            onClick={handleImprimir}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Total Unidades</span>
            <span className="text-purple-600 bg-purple-50 p-1 rounded text-xs font-medium">General</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.totalUnidades.toLocaleString()}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Clientes</span>
            <span className="text-blue-600 bg-blue-50 p-1 rounded text-xs font-medium">Total</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.totalClientes}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Productos</span>
            <span className="text-green-600 bg-green-50 p-1 rounded text-xs font-medium">Catálogo</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.totalProductos}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Cliente Principal</span>
            <span className="text-amber-600 bg-amber-50 p-1 rounded text-xs font-medium">Top</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-medium text-slate-800 truncate" title={estadisticas.mayorCliente.nombre}>
              {estadisticas.mayorCliente.nombre}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-slate-500">{estadisticas.mayorCliente.unidades.toLocaleString()} unidades</span>
              <span className="text-xs px-1.5 py-0.5 rounded text-amber-800 bg-amber-100">
                {estadisticas.totalUnidades > 0 ? `${Math.round((estadisticas.mayorCliente.unidades / estadisticas.totalUnidades) * 100)}%` : '0%'}
              </span>
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="periodo" className="block text-xs font-medium text-slate-700 mb-1">
              Periodo
            </label>
            <select
              id="periodo"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            >
              <option value="todo">Todo el periodo</option>
              <option value="ultimos30">Últimos 30 días</option>
              <option value="ultimos90">Últimos 90 días</option>
              <option value="año">Este año</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="cliente" className="block text-xs font-medium text-slate-700 mb-1">
              Cliente
            </label>
            <select
              id="cliente"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={clienteFiltrado}
              onChange={(e) => setClienteFiltrado(e.target.value)}
            >
              <option value="">Todos los clientes</option>
              {listaClientes.map(cliente => (
                <option key={cliente} value={cliente}>{cliente}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="producto" className="block text-xs font-medium text-slate-700 mb-1">
              Producto
            </label>
            <select
              id="producto"
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={productoFiltrado}
              onChange={(e) => setProductoFiltrado(e.target.value)}
            >
              <option value="">Todos los productos</option>
              {listaProductos.map(producto => (
                <option key={producto} value={producto}>{producto}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => {
                setPeriodoSeleccionado('todo');
                setClienteFiltrado('');
                setProductoFiltrado('');
              }}
              className="w-full px-3 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex items-center justify-center gap-1"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Maestra */}
      
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-4">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : Object.keys(agrupado).length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-slate-500 text-sm">No hay datos para mostrar con los filtros actuales</p>
            <button 
              onClick={() => {
                setPeriodoSeleccionado('todo');
                setClienteFiltrado('');
                setProductoFiltrado('');
              }}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div id="area-a-imprimir" className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-2 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider border border-slate-200">
                    Producto
                  </th>
                  {fechasOrdenadas.map((fecha) => (
                    <th key={fecha} className="px-2 py-3 bg-slate-50 text-center text-xs font-medium text-slate-500 uppercase tracking-wider border border-slate-200">
                      {formatearFecha(fecha)}
                    </th>
                  ))}
                  <th className="px-2 py-3 bg-slate-50 text-center text-xs font-medium text-slate-500 uppercase tracking-wider border border-slate-200">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(agrupado).map(([cliente, productos]) => {
                  let totalCliente = 0;

                  return (
                    <React.Fragment key={cliente}>
                      {/* Fila de nombre del cliente */}
                      <tr className="bg-blue-50">
                        <td className="px-3 py-2 text-sm font-semibold text-blue-800 border border-blue-100" colSpan={fechasOrdenadas.length + 2}>
                          {cliente.toUpperCase()}
                        </td>
                      </tr>

                      {/* Fila por producto */}
                      {Object.entries(productos).map(([producto, fechas], idx) => {
                        let totalProducto = 0;

                        return (
                          <tr key={`${cliente}-${idx}`} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-sm text-slate-700 border border-slate-200">
                              {producto}
                            </td>
                            {fechasOrdenadas.map((f) => {
                              const unidades = fechas[f] || '';
                              totalProducto += Number(unidades) || 0;
                              return (
                                <td key={f} className="px-3 py-2 text-sm text-center text-slate-700 border border-slate-200">
                                  {unidades || '-'}
                                </td>
                              );
                            })}
                            <td className="px-3 py-2 text-sm text-center font-medium text-slate-900 bg-slate-50 border border-slate-200">
                              {totalProducto}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Fila subtotal por cliente */}
                      <tr className="bg-blue-50/60">
                        <td className="px-3 py-2 text-sm font-medium text-blue-800 border border-blue-100">
                          Total {cliente}
                        </td>
                        {fechasOrdenadas.map((fecha) => {
                          let subtotal = 0;
                          Object.values(productos).forEach((f) => {
                            if (f[fecha]) subtotal += Number(f[fecha]) || 0;
                          });
                          totalCliente += Number(subtotal) || 0;
                          return (
                            <td key={fecha} className="px-3 py-2 text-sm text-center font-medium text-blue-800 border border-blue-100">
                              {subtotal || '-'}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2 text-sm text-center font-medium text-blue-800 border border-blue-100">
                          {totalCliente}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}

                {/* Fila Total General */}
                <tr className="bg-slate-800 text-white">
                  <td className="px-3 py-2 text-sm font-semibold border border-slate-600">
                    TOTAL GENERAL
                  </td>
                  {fechasOrdenadas.map((fecha) => {
                    let total = 0;
                    Object.values(agrupado).forEach((productos) => {
                      Object.values(productos).forEach((f) => {
                        if (f[fecha]) total += Number(f[fecha]) || 0;
                      });
                    });
                    return (
                      <td key={fecha} className="px-3 py-2 text-sm text-center font-semibold border border-slate-600">
                        {total}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-sm text-center font-semibold border border-slate-600">
                    {datosFiltrados.reduce((acc, d) => acc + Number(d.total_unidades || 0), 0)}
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Nota informativa */}
      <div className="text-xs text-slate-500 italic">
        Los datos mostrados corresponden a unidades vendidas por cliente, producto y fecha de entrega.
      </div>
    </div>
  );
}

export default VentasMaestra;
