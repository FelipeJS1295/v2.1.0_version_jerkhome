import React, { useState, useEffect } from 'react';

function ProveedorForm({ proveedorSeleccionado, onSave, onCancel }) {
  const [form, setForm] = useState({
    rut: '',
    nombre: '',
    direccion: '',
    contacto: '',
    email: '',
    telefono: '',
    forma_pago: '',
    dias_credito: '',
    sitio_web: '',
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (proveedorSeleccionado) {
      setForm({
        ...proveedorSeleccionado,
        // Aseguramos que estos campos sean strings para evitar problemas con los inputs
        dias_credito: proveedorSeleccionado.dias_credito?.toString() || '',
        activo: proveedorSeleccionado.activo === undefined ? true : Boolean(proveedorSeleccionado.activo)
      });
    } else {
      setForm({
        rut: '',
        nombre: '',
        direccion: '',
        contacto: '',
        email: '',
        telefono: '',
        forma_pago: '',
        dias_credito: '',
        sitio_web: '',
        activo: true
      });
    }
    
    setErrors({});
  }, [proveedorSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setForm({
      ...form,
      [name]: newValue
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
    
    if (!form.rut?.trim()) {
      newErrors.rut = 'El RUT es requerido';
    } else if (!/^[0-9]{1,2}[\.][0-9]{3}[\.][0-9]{3}[-][0-9kK]{1}$/.test(form.rut)) {
      newErrors.rut = 'Formato de RUT inválido (ej: 12.345.678-9)';
    }
    
    if (!form.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (form.dias_credito && (isNaN(Number(form.dias_credito)) || Number(form.dias_credito) < 0 || Number(form.dias_credito) > 120)) {
      newErrors.dias_credito = 'Los días de crédito deben ser un número entre 0 y 120';
    }
    
    if (!form.forma_pago) {
      newErrors.forma_pago = 'La forma de pago es requerida';
    }
    
    // Validar sitio web si está presente
    if (form.sitio_web && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(form.sitio_web)) {
      newErrors.sitio_web = 'URL de sitio web inválida';
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
        dias_credito: form.dias_credito ? parseInt(form.dias_credito) : null
      };
      
      await onSave(formData);
      
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Opciones para forma de pago
  const formasPago = [
    { value: '', label: 'Seleccione una forma de pago' },
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'CREDITO', label: 'Crédito' },
    { value: 'TARJETA', label: 'Tarjeta de Crédito/Débito' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Sección de datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* RUT */}
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-slate-700 mb-1">
            RUT <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="rut"
            name="rut"
            value={form.rut}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.rut ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
            placeholder="12.345.678-9"
          />
          {errors.rut && (
            <p className="mt-1 text-xs text-red-600">{errors.rut}</p>
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
            placeholder="Nombre del proveedor"
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
          )}
        </div>

        {/* Dirección */}
        <div className="md:col-span-2">
          <label htmlFor="direccion" className="block text-sm font-medium text-slate-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={form.direccion || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dirección completa"
          />
        </div>
      </div>

      {/* Sección de contacto */}
      <div className="pt-2 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Información de contacto</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Persona de contacto */}
          <div>
            <label htmlFor="contacto" className="block text-sm font-medium text-slate-700 mb-1">
              Persona de contacto
            </label>
            <input
              type="text"
              id="contacto"
              name="contacto"
              value={form.contacto || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre completo de la persona de contacto"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="ejemplo@empresa.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-slate-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={form.telefono || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+56 9 1234 5678"
            />
          </div>

          {/* Sitio web */}
          <div>
            <label htmlFor="sitio_web" className="block text-sm font-medium text-slate-700 mb-1">
              Sitio web
            </label>
            <input
              type="text"
              id="sitio_web"
              name="sitio_web"
              value={form.sitio_web || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.sitio_web ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="www.ejemplo.com"
            />
            {errors.sitio_web && (
              <p className="mt-1 text-xs text-red-600">{errors.sitio_web}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección de términos comerciales */}
      <div className="pt-2 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Términos comerciales</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Forma de pago */}
          <div>
            <label htmlFor="forma_pago" className="block text-sm font-medium text-slate-700 mb-1">
              Forma de pago <span className="text-red-500">*</span>
            </label>
            <select
              id="forma_pago"
              name="forma_pago"
              value={form.forma_pago}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.forma_pago ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 bg-white`}
            >
              {formasPago.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.forma_pago && (
              <p className="mt-1 text-xs text-red-600">{errors.forma_pago}</p>
            )}
          </div>

          {/* Días de crédito */}
          <div>
            <label htmlFor="dias_credito" className="block text-sm font-medium text-slate-700 mb-1">
              Días de crédito
            </label>
            <input
              type="number"
              id="dias_credito"
              name="dias_credito"
              value={form.dias_credito}
              onChange={handleChange}
              min="0"
              max="120"
              className={`w-full px-3 py-2 border ${errors.dias_credito ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="30"
            />
            {errors.dias_credito && (
              <p className="mt-1 text-xs text-red-600">{errors.dias_credito}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">Plazo en días para el pago de facturas</p>
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
              Proveedor activo
            </label>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
        {proveedorSeleccionado && (
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
              {proveedorSeleccionado ? 'Actualizar proveedor' : 'Crear proveedor'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProveedorForm;
