import React from 'react';

function Header() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm h-14">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo y Título */}
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5 text-slate-700" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h1 className="text-sm font-medium text-slate-800 tracking-wide">Panel de Administración</h1>
        </div>
        
        {/* Acciones y Usuario */}
        <div className="flex items-center gap-6">
          {/* Notificaciones */}
          <button className="text-slate-500 hover:text-slate-700 relative">
            <svg 
              className="w-5 h-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          
          {/* Usuario con badge */}
          <div className="flex items-center gap-3">
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-medium">Admin</span>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-medium">
              AB
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;