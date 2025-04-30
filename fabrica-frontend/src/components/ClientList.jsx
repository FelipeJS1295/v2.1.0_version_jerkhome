import React, { useState } from 'react';

function ClientList({ clientes = [], onEdit, onDelete }) {
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = clientes.slice(indexOfFirstItem, indexOfLastItem);
  
  // Formato para valores monetarios o porcentajes
  const formatPercent = (value) => {
    if (value === undefined || value === null) return '-';
    return `${value}%`;
  };

  // Determinar estado del cliente (activo/inactivo)
  const getClienteStatus = (cliente) => {
    // Esta lógica puede adaptarse según los datos reales de tus clientes
    const isActive = cliente.activo !== undefined ? cliente.activo : true;
    
    return {
      label: isActive ? 'Activo' : 'Inactivo',
      className: isActive 
        ? 'bg-green-50 text-green-700' 
        : 'bg-slate-100 text-slate-600'
    };
  };

  // Generar iniciales para avatar
  const getInitials = (name) => {
    if (!name) return '••';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full">
      {clientes.length === 0 ? (
        <div className="p-6 text-center text-slate-500">
          No hay clientes registrados.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    RUT
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Días de pago
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Comisión
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
                {currentClientes.map((cliente) => {
                  const status = getClienteStatus(cliente);
                  
                  return (
                    <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium mr-3">
                            {getInitials(cliente.nombre)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {cliente.nombre || 'Sin nombre'}
                            </div>
                            {cliente.email && (
                              <div className="text-xs text-slate-500">
                                {cliente.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-600 font-mono">
                          {cliente.rut || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {cliente.contacto || '-'}
                        </div>
                        {cliente.telefono && (
                          <div className="text-xs text-slate-500">
                            {cliente.telefono}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {cliente.dias_pago || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-700">
                          {formatPercent(cliente.porcentaje_comision)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cliente.cobro_logistico ? 'Con cobro logístico' : 'Sin cobro logístico'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => onEdit(cliente)}
                          className="inline-flex items-center px-2 py-1 border border-slate-200 text-xs leading-4 font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(cliente.id)}
                          className="inline-flex items-center px-2 py-1 border border-red-200 text-xs leading-4 font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Paginación */}
          {clientes.length > itemsPerPage && (
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
                  onClick={() => setCurrentPage(currentPage < Math.ceil(clientes.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                  disabled={currentPage >= Math.ceil(clientes.length / itemsPerPage)}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md ${
                    currentPage >= Math.ceil(clientes.length / itemsPerPage)
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
                      {indexOfLastItem > clientes.length ? clientes.length : indexOfLastItem}
                    </span>{' '}
                    de <span className="font-medium">{clientes.length}</span> clientes
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
                    {Array.from({ length: Math.min(5, Math.ceil(clientes.length / itemsPerPage)) }).map((_, idx) => {
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
                      onClick={() => setCurrentPage(currentPage < Math.ceil(clientes.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                      disabled={currentPage >= Math.ceil(clientes.length / itemsPerPage)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 text-sm font-medium ${
                        currentPage >= Math.ceil(clientes.length / itemsPerPage)
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
  );
}

export default ClientList;
  