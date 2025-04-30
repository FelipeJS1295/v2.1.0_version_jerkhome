import React, { useState, useEffect } from 'react';

function InsumoForm({ insumoSeleccionado, onSave, onCancel }) {
  const [form, setForm] = useState({
    sku: '',
    nombre: '',
    descripcion: '',
    unidad_medida: '',
    proveedor_id: '',
    costo: '',
    stock: '',
    stock_minimo: ''
  });

  const [proveedores, setProveedores] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(true);

  useEffect(() => {
    // Si hay insumo seleccionado, llenar el form
    if (insumoSeleccionado) {
      setForm({
        ...insumoSeleccionado,
        // Aseguramos que estos campos sean strings para evitar problemas con los inputs
        costo: insumoSeleccionado.costo?.toString() || '',
        stock: insumoSeleccionado.stock?.toString() || '',
        stock_minimo: insumoSeleccionado.stock_minimo?.toString() || ''
      });
    } else {
      setForm({
        sku: '',
        nombre: '',
        descripcion: '',
        unidad_medida: '',
        proveedor_id: '',
        costo: '',
        stock: '',
        stock_minimo: ''
      });
    }

    // Limpiar errores al cambiar el insumo
    setErrors({});

    // Obtener proveedores
    setLoadingProveedores(true);
    fetch('${import.meta.env.VITE_API_URL}/api/proveedores')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        setProveedores(data);
      })
      .catch(err => {
        console.error('Error al cargar proveedores:', err);
        setErrors(prev => ({ ...prev, proveedores: 'No se pudieron cargar los proveedores' }));
      })
      .finally(() => {
        setLoadingProveedores(false);
      });
  }, [insumoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setForm({
      ...form,
      [name]: value
    });
    
    // Limpiar el error específico cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }
    
    if (!form.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!form.unidad_medida) {
      newErrors.unidad_medida = 'La unidad de medida es requerida';
    }
    
    if (!form.proveedor_id) {
      newErrors.proveedor_id = 'El proveedor es requerido';
    }
    
    if (!form.costo) {
      newErrors.costo = 'El costo es requerido';
    } else if (isNaN(Number(form.costo)) || Number(form.costo) < 0) {
      newErrors.costo = 'El costo debe ser un número mayor o igual a 0';
    }
    
    if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }
    
    if (form.stock_minimo && (isNaN(Number(form.stock_minimo)) || Number(form.stock_minimo) < 0)) {
      newErrors.stock_minimo = 'El stock mínimo debe ser un número mayor o igual a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convertimos campos numéricos de string a número
      const formData = {
        ...form,
        costo: form.costo ? parseFloat(form.costo) : 0,
        stock: form.stock ? parseInt(form.stock) : 0,
        stock_minimo: form.stock_minimo ? parseInt(form.stock_minimo) : 0
      };
      
      await onSave(formData);
      
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const unidadesMedida = [
    { value: 'metros', label: 'Metros (m)' },
    { value: 'unidades', label: 'Unidades (u)' },
    { value: 'cm', label: 'Centímetros (cm)' },
    { value: 'kg', label: 'Kilogramos (kg)' },
    { value: 'lt', label: 'Litros (lt)' },
    { value: 'ml', label: 'Mililitros (ml)' },
    { value: 'piezas', label: 'Piezas (pz)' },
    { value: 'paquetes', label: 'Paquetes (pq)' },
    { value: 'cajas', label: 'Cajas (cx)' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sección de datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-slate-700 mb-1">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.sku ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
            placeholder="INS-001"
          />
          {errors.sku && (
            <p className="mt-1 text-xs text-red-600">{errors.sku}</p>
          )}
        </div>

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.nombre ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
            placeholder="Nombre del insumo"
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion || ''}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descripción detallada del insumo..."
          />
        </div>

        {/* Unidad de medida */}
        <div>
          <label htmlFor="unidad_medida" className="block text-sm font-medium text-slate-700 mb-1">
            Unidad de medida <span className="text-red-500">*</span>
          </label>
          <select
            id="unidad_medida"
            name="unidad_medida"
            value={form.unidad_medida}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.unidad_medida ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 bg-white`}
          >
            <option value="">Selecciona unidad de medida</option>
            {unidadesMedida.map((unidad) => (
              <option key={unidad.value} value={unidad.value}>
                {unidad.label}
              </option>
            ))}
          </select>
          {errors.unidad_medida && (
            <p className="mt-1 text-xs text-red-600">{errors.unidad_medida}</p>
          )}
        </div>

        {/* Proveedor */}
        <div>
          <label htmlFor="proveedor_id" className="block text-sm font-medium text-slate-700 mb-1">
            Proveedor <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="proveedor_id"
              name="proveedor_id"
              value={form.proveedor_id}
              onChange={handleChange}
              disabled={loadingProveedores}
              className={`w-full px-3 py-2 border ${errors.proveedor_id ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 bg-white ${loadingProveedores ? 'text-slate-400' : ''}`}
            >
              <option value="">Selecciona proveedor</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
            {loadingProveedores && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="animate-spin h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            )}
          </div>
          {errors.proveedor_id && (
            <p className="mt-1 text-xs text-red-600">{errors.proveedor_id}</p>
          )}
          {errors.proveedores && (
            <p className="mt-1 text-xs text-amber-600">{errors.proveedores}</p>
          )}
        </div>
      </div>

      {/* Sección de precios y stock */}
      <div className="pt-2 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Costos e inventario</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Costo */}
          <div>
            <label htmlFor="costo" className="block text-sm font-medium text-slate-700 mb-1">
              Costo unitario <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="costo"
                name="costo"
                value={form.costo}
                onChange={handleChange}
                className={`w-full pl-7 pr-3 py-2 border ${errors.costo ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
                placeholder="0"
              />
            </div>
            {errors.costo && (
              <p className="mt-1 text-xs text-red-600">{errors.costo}</p>
            )}
          </div>

          {/* Stock actual */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
              Stock actual
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="0"
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
            )}
          </div>

          {/* Stock mínimo */}
          <div>
            <label htmlFor="stock_minimo" className="block text-sm font-medium text-slate-700 mb-1">
              Stock mínimo
            </label>
            <input
              type="number"
              id="stock_minimo"
              name="stock_minimo"
              value={form.stock_minimo}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border ${errors.stock_minimo ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="0"
            />
            {errors.stock_minimo && (
              <p className="mt-1 text-xs text-red-600">{errors.stock_minimo}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">Cantidad mínima antes de generar alertas</p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
        {insumoSeleccionado && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 ${isLoading ? 'bg-slate-600' : 'bg-slate-800 hover:bg-slate-700'} border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex items-center transition-colors`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {insumoSeleccionado ? 'Actualizar insumo' : 'Crear insumo'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default InsumoForm;
