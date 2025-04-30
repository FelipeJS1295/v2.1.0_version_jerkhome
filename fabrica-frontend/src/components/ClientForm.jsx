import React, { useState, useEffect } from 'react';

function ClientForm({ clienteSeleccionado, onSave, onCancel }) {
  const [form, setForm] = useState({
    rut: '',
    nombre: '',
    direccion: '',
    contacto: '',
    email: '',
    telefono: '',
    dias_pago: '',
    porcentaje_comision: '',
    cobro_logistico: false,
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (clienteSeleccionado) {
      // Convertir a booleanos explícitos los campos que pueden venir como strings
      setForm({
        ...clienteSeleccionado,
        cobro_logistico: typeof clienteSeleccionado.cobro_logistico === 'string'
          ? clienteSeleccionado.cobro_logistico === 'true' || clienteSeleccionado.cobro_logistico === '1'
          : Boolean(clienteSeleccionado.cobro_logistico),
        activo: clienteSeleccionado.activo === undefined ? true : Boolean(clienteSeleccionado.activo),
        // Aseguramos que estos campos sean strings para evitar problemas con los inputs
        dias_pago: clienteSeleccionado.dias_pago?.toString() || '',
        porcentaje_comision: clienteSeleccionado.porcentaje_comision?.toString() || ''
      });
    } else {
      setForm({
        rut: '',
        nombre: '',
        direccion: '',
        contacto: '',
        email: '',
        telefono: '',
        dias_pago: '',
        porcentaje_comision: '',
        cobro_logistico: false,
        activo: true
      });
    }
    
    setErrors({});
  }, [clienteSeleccionado]);

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
    
    if (form.dias_pago && (isNaN(Number(form.dias_pago)) || Number(form.dias_pago) < 0 || Number(form.dias_pago) > 60)) {
      newErrors.dias_pago = 'Los días de pago deben ser un número entre 0 y 60';
    }
    
    if (form.porcentaje_comision && (isNaN(Number(form.porcentaje_comision)) || Number(form.porcentaje_comision) < 0 || Number(form.porcentaje_comision) > 100)) {
      newErrors.porcentaje_comision = 'La comisión debe ser un porcentaje entre 0 y 100';
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
        dias_pago: form.dias_pago ? parseInt(form.dias_pago) : 0,
        porcentaje_comision: form.porcentaje_comision ? parseFloat(form.porcentaje_comision) : 0
      };
      
      await onSave(formData);
      
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
            placeholder="Nombre del cliente"
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-slate-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Dirección completa"
          />
        </div>

        {/* Contacto */}
        <div>
          <label htmlFor="contacto" className="block text-sm font-medium text-slate-700 mb-1">
            Nombre de contacto
          </label>
          <input
            type="text"
            id="contacto"
            name="contacto"
            value={form.contacto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre de la persona de contacto"
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
            placeholder="correo@ejemplo.com"
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
      </div>

      {/* Sección de términos comerciales */}
      <div className="pt-2 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Términos comerciales</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Días de pago */}
          <div>
            <label htmlFor="dias_pago" className="block text-sm font-medium text-slate-700 mb-1">
              Días de pago
            </label>
            <input
              type="number"
              id="dias_pago"
              name="dias_pago"
              value={form.dias_pago}
              onChange={handleChange}
              min="0"
              max="60"
              className={`w-full px-3 py-2 border ${errors.dias_pago ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
              placeholder="30"
            />
            {errors.dias_pago && (
              <p className="mt-1 text-xs text-red-600">{errors.dias_pago}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">Plazo en días para el pago de facturas</p>
          </div>

          {/* Porcentaje de comisión */}
          <div>
            <label htmlFor="porcentaje_comision" className="block text-sm font-medium text-slate-700 mb-1">
              Comisión (%)
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                id="porcentaje_comision"
                name="porcentaje_comision"
                value={form.porcentaje_comision}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-3 py-2 pr-8 border ${errors.porcentaje_comision ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm text-sm focus:outline-none focus:ring-1`}
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 sm:text-sm">%</span>
              </div>
            </div>
            {errors.porcentaje_comision && (
              <p className="mt-1 text-xs text-red-600">{errors.porcentaje_comision}</p>
            )}
          </div>

          {/* Estado */}
          <div className="flex flex-col justify-end space-y-3 pb-1">
            <div className="flex items-center">
              <input
                id="cobro_logistico"
                name="cobro_logistico"
                type="checkbox"
                checked={form.cobro_logistico}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="cobro_logistico" className="ml-2 block text-sm text-slate-700">
                Aplica cobro logístico
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="activo"
                name="activo"
                type="checkbox"
                checked={form.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-slate-700">
                Cliente activo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
        {clienteSeleccionado && (
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
              {clienteSeleccionado ? 'Actualizar cliente' : 'Crear cliente'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ClientForm;