import { useState } from 'react';

function VentasActualizarHites() {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleActualizar = async () => {
    if (!archivo) {
      setMensaje('Debes seleccionar un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    setLoading(true);
    setMensaje('');
    setErrores([]);

    try {
      const res = await fetch('http://localhost:3000/api/ventas/actualizar-hites', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.message);
        setErrores(data.errores || []);
      } else {
        setMensaje(data.error || 'Error desconocido');
      }
    } catch (error) {
      setMensaje('Error al actualizar las órdenes: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🔄 Actualizar Ventas - Hites (archivo secundario)</h1>

      <div className="space-y-4 mb-6">
        <input type="file" onChange={handleArchivoChange} className="border p-2" />
        <button
          onClick={handleActualizar}
          disabled={loading}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          {loading ? 'Procesando...' : 'Actualizar Ventas'}
        </button>
        {mensaje && <p className="text-blue-700 font-semibold">{mensaje}</p>}
      </div>

      {errores.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Errores al actualizar:</h2>
          <ul className="text-sm list-disc list-inside text-red-500">
            {errores.map((err, idx) => (
              <li key={idx}>
                Orden {err.orden}: {err.error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default VentasActualizarHites;
