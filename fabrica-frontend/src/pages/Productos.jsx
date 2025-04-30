import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activos: 0,
    sinStock: 0,
    valorInventario: 0
  });

  const obtenerProductos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:3000/api/productos');
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      setProductos(data);
      
      // Calcular estadísticas
      const activos = data.filter(p => p.activo).length;
      const sinStock = data.filter(p => p.stock === 0).length;
      const valorInventario = data.reduce((total, p) => total + (p.precio * p.stock), 0);
      
      setEstadisticas({
        total: data.length,
        activos,
        sinStock,
        valorInventario
      });
      
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar productos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  useEffect(() => {
    // Filtrar productos basados en la búsqueda
    const filtered = productos.filter(producto => 
      producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      producto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producto.codigo?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Ordenar productos
    const sorted = [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredProductos(sorted);
  }, [productos, searchQuery, sortConfig]);

  const guardarProducto = async (producto) => {
    setIsLoading(true);
    
    try {
      const metodo = producto.id ? 'PUT' : 'POST';
      const url = producto.id
        ? `http://localhost:3000/api/productos/${producto.id}`
        : `http://localhost:3000/api/productos`;

      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto),
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      setProductoSeleccionado(null);
      setShowForm(false);
      await obtenerProductos();
      
      // Mostrar notificación de éxito (puedes implementar tu propio sistema de notificaciones)
      console.log(`Producto ${producto.id ? 'actualizado' : 'creado'} exitosamente`);
      
    } catch (err) {
      setError(err.message);
      console.error("Error al guardar producto:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      setIsLoading(true);
      
      try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        await obtenerProductos();
        
        // Mostrar notificación de éxito
        console.log("Producto eliminado exitosamente");
        
      } catch (err) {
        setError(err.message);
        console.error("Error al eliminar producto:", err);
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

  const editarProducto = (producto) => {
    setProductoSeleccionado(producto);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Gestión de Productos
          </h2>
          <p className="text-sm text-slate-500">
            Administre su catálogo de productos, precios e inventario
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button 
            onClick={() => {setShowForm(!showForm); setProductoSeleccionado(null);}}
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
            {showForm ? 'Cancelar' : 'Nuevo Producto'}
          </button>
          
          <button 
            onClick={obtenerProductos}
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
            <span className="text-slate-500 text-sm font-medium">Total Productos</span>
            <span className="text-blue-600 bg-blue-50 p-1 rounded text-xs font-medium">Inventario</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.total}</span>
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Productos Activos</span>
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
            <span className="text-slate-500 text-sm font-medium">Sin Stock</span>
            <span className="text-amber-600 bg-amber-50 p-1 rounded text-xs font-medium">Alerta</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">{estadisticas.sinStock}</span>
            <span className="text-xs px-1.5 py-0.5 rounded text-amber-800 bg-amber-100">
              {estadisticas.total > 0 ? `${Math.round((estadisticas.sinStock / estadisticas.total) * 100)}%` : '0%'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">Valor Inventario</span>
            <span className="text-purple-600 bg-purple-50 p-1 rounded text-xs font-medium">Financiero</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-semibold text-slate-800">
              ${estadisticas.valorInventario.toLocaleString('es-CL')}
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
              {productoSeleccionado ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
          </div>
          <ProductForm
            productoSeleccionado={productoSeleccionado}
            onSave={guardarProducto}
            onCancel={() => {
              setProductoSeleccionado(null);
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
              placeholder="Buscar productos..."
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
              <option value="precio">Ordenar por Precio</option>
              <option value="stock">Ordenar por Stock</option>
              <option value="categoria">Ordenar por Categoría</option>
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

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-slate-500 text-sm">No se encontraron productos</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ProductList
            productos={filteredProductos}
            onEdit={editarProducto}
            onDelete={eliminarProducto}
          />
        )}
      </div>
    </div>
  );
}

export default Productos;
