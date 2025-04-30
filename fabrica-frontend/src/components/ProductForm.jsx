import React, { useState, useEffect } from 'react';

function ProductForm({ productoSeleccionado, onSave, onCancel }) {
  const [form, setForm] = useState({
    sku: '',
    nombre_producto: '',
    descripcion: '',
    precio_venta_promedio: '',
    stock: '',
    categoria: '',
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productoSeleccionado) {
      setForm({
        ...productoSeleccionado,
        // Aseguramos que estos campos sean strings para evitar problemas con los inputs
        precio_venta_promedio: productoSeleccionado.precio_venta_promedio?.toString() || '',
        stock: productoSeleccionado.stock?.toString() || ''
      });
    } else {
      setForm({
        sku: '',
        nombre_producto: '',
        descripcion: '',
        precio_venta_promedio: '',
        stock: '',
        categoria: '',
        activo: true
      });
    }
    // Limpiamos errores al cambiar el producto
    setErrors({});
  }, [productoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!form.sku.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }
    
    if (!form.nombre_producto.trim()) {
      newErrors.nombre_producto = 'El nombre del producto es requerido';
    }
    
    if (form.precio_venta_promedio && isNaN(parseFloat(form.precio_venta_promedio))) {
      newErrors.precio_venta_promedio = 'El precio debe ser un número válido';
    }
    
    if (form.stock && isNaN(parseInt(form.stock))) {
      newErrors.stock = 'El stock debe ser un número entero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Convertimos campos numéricos de string a número
      const formData = {
        ...form,
        precio_venta_promedio: form.precio_venta_promedio ? parseFloat(form.precio_venta_promedio) : 0,
        stock: form.stock ? parseInt(form.stock) : 0
      };
      
      await onSave(formData);
      
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Categorías de ejemplo (deberían venir de una API o props)
  const categorias = [
    { id: 1, nombre: 'Electrónica' },
    { id: 2, nombre: 'Hogar' },
    { id: 3, nombre: 'Ropa' },
    { id: 4, nombre: 'Alimentos' },
    { id: 5, nombre: 'Otros' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Ej: PROD-001"
          />
          {errors.sku && (
            <p className="mt-1 text-xs text-red-600">{errors.sku}</p>
          )}
        </div>

        {/* Nombre del producto */}
        <div>
          <label htmlFor="nombre_producto" className="block text-sm font-medium text-slate-700 mb-1">
            Nombre del producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nombre_producto"
            name="nombre_producto"
            value={form.nombre_producto}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.nombre_producto ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
            placeholder="Nombre del producto"
          />
          {errors.nombre_producto && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre_producto}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div>
          <label htmlFor="precio_venta_promedio" className="block text-sm font-medium text-slate-700 mb-1">
            Precio de venta
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              id="precio_venta_promedio"
              name="precio_venta_promedio"
              value={form.precio_venta_promedio}
              onChange={handleChange}
              className={`w-full pl-7 pr-3 py-2 border ${errors.precio_venta_promedio ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="0"
            />
          </div>
          {errors.precio_venta_promedio && (
            <p className="mt-1 text-xs text-red-600">{errors.precio_venta_promedio}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">
            Stock disponible
          </label>
          <input
            type="text"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.stock ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-xs text-red-600">{errors.stock}</p>
          )}
        </div>

        {/* Estado activo */}
        <div className="flex items-center h-full pt-5">
          <input
            id="activo"
            name="activo"
            type="checkbox"
            checked={form.activo}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="activo" className="ml-2 block text-sm text-slate-700">
            Producto activo
          </label>
        </div>
      </div>

      {/* Descripción (fila completa) */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe el producto..."
        ></textarea>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
        {productoSeleccionado && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            disabled={isSaving}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 ${isSaving ? 'bg-slate-600' : 'bg-slate-800 hover:bg-slate-700'} border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 flex items-center transition-colors`}
          disabled={isSaving}
        >
          {isSaving ? (
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
              {productoSeleccionado ? 'Actualizar producto' : 'Crear producto'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;