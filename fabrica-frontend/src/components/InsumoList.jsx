import React, { useState } from 'react';

function InsumoList({ insumos = [], onEdit, onDelete }) {
  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInsumos = insumos.slice(indexOfFirstItem, indexOfLastItem);
  
  // Formato para valores monetarios
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Determinar estado del stock
  const getStockStatus = (stock) => {
    if (stock === undefined || stock === null) return { label: 'Sin datos', className: 'bg-slate-100 text-slate-600' };
    if (stock <= 0) return { label: 'Agotado', className: 'bg-red-50 text-red-700' };
    if (stock < 10) return { label: 'Bajo', className: 'bg-amber-50 text-amber-700' };
    return { label: 'Disponible', className: 'bg-green-50 text-green-700' };
  };

  return (
    <div className="w-full">
      {insumos.length === 0 ? (
        <div className="p-6 text-center text-slate-500">
          No hay insumos registrados.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Insumo
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Unidad Medida
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-4 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentInsumos.map((insumo) => {
                  const stockStatus = getStockStatus(insumo.stock);
                  
                  return (
                    <tr key={insumo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mr-3">
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {insumo.nombre || 'Sin nombre'}
                            </div>
                            {insumo.descripcion && (
                              <div className="text-xs text-slate-500 truncate max-w-xs">
                                {insumo.descripcion}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-mono text-slate-600">
                          {insumo.sku || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {insumo.unidad_medida || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {insumo.proveedor_nombre || '-'}
                        </div>
                        {insumo.proveedor_id && (
                          <div className="text-xs text-slate-500">
                            ID: {insumo.proveedor_id}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stockStatus.className}`}>
                            {stockStatus.label}
                          </span>
                          {insumo.stock !== undefined && insumo.stock !== null && (
                            <span className="ml-2 text-sm text-slate-600">{insumo.stock}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {formatCurrency(insumo.costo)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => onEdit(insumo)}
                          className="inline-flex items-center px-2 py-1 border border-slate-200 text-xs leading-4 font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(insumo.id)}
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
          {insumos.length > itemsPerPage && (
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
                  onClick={() => setCurrentPage(currentPage < Math.ceil(insumos.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                  disabled={currentPage >= Math.ceil(insumos.length / itemsPerPage)}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md ${
                    currentPage >= Math.ceil(insumos.length / itemsPerPage)
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
                      {indexOfLastItem > insumos.length ? insumos.length : indexOfLastItem}
                    </span>{' '}
                    de <span className="font-medium">{insumos.length}</span> insumos
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
                    {Array.from({ length: Math.min(5, Math.ceil(insumos.length / itemsPerPage)) }).map((_, idx) => {
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
                      onClick={() => setCurrentPage(currentPage < Math.ceil(insumos.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                      disabled={currentPage >= Math.ceil(insumos.length / itemsPerPage)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 text-sm font-medium ${
                        currentPage >= Math.ceil(insumos.length / itemsPerPage)
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

export default InsumoList;