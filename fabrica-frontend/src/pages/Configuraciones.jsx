import React from 'react';
import { Link } from 'react-router-dom';

function Configuraciones() {
  // Configuración de datos con iconos y descripciones
  const configItems = [
    { 
      nombre: 'Productos', 
      path: '/productos',
      descripcion: 'Gestione su catálogo de productos, precios y disponibilidad',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      stats: { total: 284, nuevos: 12 }
    },
    { 
      nombre: 'Clientes', 
      path: '/clientes',
      descripcion: 'Administre la información de clientes y contactos comerciales',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      stats: { total: 1428, nuevos: 32 }
    },
    { 
      nombre: 'Insumos', 
      path: '/insumos',
      descripcion: 'Control de inventario y materiales para su operación',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      stats: { total: 157, nuevos: 8 }
    },
    { 
      nombre: 'Proveedores', 
      path: '/proveedores',
      descripcion: 'Gestione relaciones con proveedores y cadena de suministro',
      icon: (
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      stats: { total: 68, nuevos: 4 }
    }
  ];

  // Estadísticas generales
  const generalStats = [
    { label: 'Productos activos', value: '284', icon: '📦', change: '+3.4%', positive: true },
    { label: 'Proveedores', value: '68', icon: '🏭', change: '+0.8%', positive: true },
    { label: 'Clientes activos', value: '1,428', icon: '👥', change: '+12.4%', positive: true },
    { label: 'Insumos en stock', value: '157', icon: '📋', change: '-2.3%', positive: false }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuraciones
          </h2>
          <div className="flex gap-3">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-100 transition-colors">
              Exportar datos
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors">
              Nueva configuración
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Administre las configuraciones centrales del sistema y sus componentes principales.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {generalStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-semibold text-slate-800">{stat.value}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${stat.positive ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tarjetas de configuración principales */}
      <h3 className="text-sm font-medium text-slate-800 mb-4">Módulos del sistema</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {configItems.map((item) => (
          <Link
            key={item.nombre}
            to={item.path}
            className="block group"
          >
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden h-full flex flex-col">
              <div className={`p-4 ${item.color}`}>
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-md ${item.iconColor} bg-white/80`}>
                    {item.icon}
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-slate-500 bg-white/70 rounded-full px-2 py-0.5">
                      {item.stats.total}
                    </span>
                    {item.stats.nuevos > 0 && (
                      <span className="ml-1 text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                        +{item.stats.nuevos}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-base font-medium text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.nombre}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex-1">
                  {item.descripcion}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Última actualización: hoy</span>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sección adicional - Acciones rápidas */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-slate-800 mb-4">Acciones rápidas</h3>
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo producto
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir cliente
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Importar datos
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Generar reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuraciones;