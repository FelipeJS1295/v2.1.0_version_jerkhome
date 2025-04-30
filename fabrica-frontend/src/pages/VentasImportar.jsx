import { useState } from 'react';

function VentasImportar() {
  const [archivo, setArchivo] = useState(null);
  const [ventasPreview, setVentasPreview] = useState([]);
  const [error, setError] = useState('');

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleImportar = async () => {
    if (!archivo) {
      setError('Debes seleccionar un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    try {
      const res = await fetch('http://localhost:3000/api/ventas/importar-falabella', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const dataError = await res.json();
        throw new Error(dataError.error || 'Error al importar archivo');
      }

      const data = await res.json();
      setVentasPreview(data.ventas);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleGuardarVentas = async () => {
    if (ventasPreview.length === 0) return;

    try {
      const res = await fetch('http://localhost:3000/api/ventas/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventas: ventasPreview }),
      });

      if (!res.ok) {
        throw new Error('Error al guardar ventas');
      }

      alert('✅ Ventas guardadas exitosamente');
      setVentasPreview([]); // Limpiar preview
      setArchivo(null); // Limpiar archivo
    } catch (err) {
      console.error(err);
      alert('❌ Error al guardar ventas');
    }
  };

  const eliminarVenta = (index) => {
    setVentasPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📥 Importar Ventas (Falabella)</h1>

      <div className="space-y-4 mb-8">
        <input type="file" onChange={handleArchivoChange} className="border p-2" />
        <button
          onClick={handleImportar}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Importar Archivo
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {ventasPreview.length > 0 && (
        <>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleGuardarVentas}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Ventas
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <h2 className="text-xl font-semibold mb-2">📋 Vista Previa</h2>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">N° Orden</th>
                  <th className="p-2">Cliente Final</th>
                  <th className="p-2">Producto</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Precio Cliente</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasPreview.map((venta, index) => (
                  <tr
                    key={index}
                    className={`border-t ${venta.ya_existe ? 'bg-red-100 text-red-700 font-semibold' : ''}`}
                  >
                    <td className="p-2">{venta.numero_orden}</td>
                    <td className="p-2">{venta.cliente_final}</td>
                    <td className="p-2">{venta.producto}</td>
                    <td className="p-2">{venta.sku}</td>
                    <td className="p-2">${venta.precio_cliente}</td>
                    <td className="p-2">{venta.estado}</td>
                    <td className="p-2 text-center">
                      {venta.ya_existe && (
                        <button
                          onClick={() => eliminarVenta(index)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default VentasImportar;