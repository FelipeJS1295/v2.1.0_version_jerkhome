import React from 'react';

function ProductList({ productos = [], onEdit, onDelete }) {
  // Función para formatear el precio adecuadamente
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Función para determinar el color del badge de stock
  const getStockStatusColor = (stock) => {
    if (stock === undefined || stock === null) return { bg: 'bg-gray-100', text: 'text-gray-600' };
    if (stock <= 0) return { bg: 'bg-red-50', text: 'text-red-700' };
    if (stock < 10) return { bg: 'bg-amber-50', text: 'text-amber-700' };
    return { bg: 'bg-green-50', text: 'text-green-700' };
  };

  // Función para truncar texto largo
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div>
      {productos.length === 0 ? (
        <div className="py-12 text-center">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-slate-500 text-sm">No hay productos disponibles en el sistema.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {productos.map((prod) => {
                const stockStatus = getStockStatusColor(prod.stock);
                
                return (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 mr-3">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {prod.nombre_producto || 'Sin nombre'}
                          </div>
                          <div className="text-xs text-slate-500">
                            ID: {prod.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-mono text-slate-600">
                        {prod.sku || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-600 max-w-xs">
                        {truncateText(prod.descripcion) || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800">
                        {formatCurrency(prod.precio_venta_promedio || 0)}
                      </div>
                      {prod.precio_anterior && (
                        <div className="text-xs text-slate-400 line-through">
                          {formatCurrency(prod.precio_anterior)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stockStatus.bg} ${stockStatus.text}`}>
                        {prod.stock !== undefined && prod.stock !== null ? prod.stock : 'No disponible'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEdit(prod)}
                        className="inline-flex items-center px-2 py-1 border border-slate-200 text-xs leading-4 font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(prod.id)}
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
      )}
    </div>
  );
}

export default ProductList;
