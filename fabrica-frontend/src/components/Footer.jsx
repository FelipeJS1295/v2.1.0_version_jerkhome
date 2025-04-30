import React from 'react';

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-4 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Jerk Home
            </p>
          </div>
          
          {/* Enlaces */}
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200">
              Términos
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200">
              Privacidad
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200">
              Contacto
            </a>
          </div>
          
          {/* Versión */}
          <div className="hidden md:block">
            <span className="text-xs text-slate-400">v1.2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
