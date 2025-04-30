import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const currentPath = location.pathname;
  
  // Automáticamente expande el menú si estamos en alguna de sus rutas
  useEffect(() => {
    if (currentPath.includes('/ventas')) {
      setExpandedMenu('ventas');
    }
  }, [currentPath]);

  // Maneja el expandir/colapsar categorías
  const toggleExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <aside className="w-64 bg-slate-50 h-screen border-r border-slate-200 shadow-sm">
      {/* Logo o título de empresa */}
      <div className="h-14 flex items-center px-5 border-b border-slate-200">
        <h2 className="text-slate-800 font-medium text-sm tracking-wide uppercase">Admin Console</h2>
      </div>
      
      {/* Menú de navegación */}
      <nav className="py-5 px-3">
        <div className="mb-1 px-2">
          <p className="text-xs font-medium text-slate-400 uppercase mb-2">Panel Principal</p>
        </div>

        {/* Configuraciones */}
        <Link 
          to="/"
          className={`flex items-center h-9 px-3 mb-1 text-sm rounded ${
            currentPath === '/' 
              ? 'bg-slate-200 text-slate-900 font-medium' 
              : 'text-slate-600 hover:bg-slate-200/50'
          }`}
        >
          <svg className="w-4 h-4 mr-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuraciones
        </Link>
        
        {/* Sección de ventas */}
        <div className="mt-6 mb-1 px-2">
          <p className="text-xs font-medium text-slate-400 uppercase mb-2">Análisis</p>
        </div>

        {/* Categoría Ventas */}
        <div>
          <button
            onClick={() => toggleExpand('ventas')}
            className={`flex items-center justify-between w-full h-9 px-3 mb-1 text-sm rounded ${
              currentPath.includes('/ventas') 
                ? 'bg-slate-200 text-slate-900 font-medium' 
                : 'text-slate-600 hover:bg-slate-200/50'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Ventas
            </div>
            <svg 
              className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${expandedMenu === 'ventas' ? 'transform rotate-90' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Submenú de Ventas */}
          {expandedMenu === 'ventas' && (
            <div className="pl-8 mt-1 mb-2">
              <Link
                to="/ventas/listado"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas/listado' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Ver Ventas Cargadas
              </Link>
              <Link
                to="/ventas/maestra"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas/maestra' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Ver Maestra
              </Link>
              <Link
                to="/ventas"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Falabella
              </Link>
              <Link
                to="/ventas/walmart"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas/walmart' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Walmart
              </Link>
              <Link
                to="/ventas/paris"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas/paris' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Paris
              </Link>
              <Link
                to="/ventas/hites"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas/hites' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Hites
              </Link>
              <Link
                to="/ventas/hites/actualizar"
                className={`flex items-center h-8 text-xs rounded px-3 mb-1 ${
                  currentPath === '/ventas/hites/actualizar' 
                    ? 'bg-slate-200 text-slate-900 font-medium' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                Actualizacion Hites
              </Link>
            </div>
          )}
        </div>

        {/* Reportes */}
        <Link
          to="/reportes"
          className={`flex items-center h-9 px-3 mb-1 text-sm rounded ${
            currentPath === '/reportes' 
              ? 'bg-slate-200 text-slate-900 font-medium' 
              : 'text-slate-600 hover:bg-slate-200/50'
          }`}
        >
          <svg className="w-4 h-4 mr-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reportes
        </Link>

        {/* Usuarios */}
        <div className="mt-6 mb-1 px-2">
          <p className="text-xs font-medium text-slate-400 uppercase mb-2">Administración</p>
        </div>
        
        <Link
          to="/usuarios"
          className={`flex items-center h-9 px-3 mb-1 text-sm rounded ${
            currentPath === '/usuarios' 
              ? 'bg-slate-200 text-slate-900 font-medium' 
              : 'text-slate-600 hover:bg-slate-200/50'
          }`}
        >
          <svg className="w-4 h-4 mr-3 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Usuarios
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;