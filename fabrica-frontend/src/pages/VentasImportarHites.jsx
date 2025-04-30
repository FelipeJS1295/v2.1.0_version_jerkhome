import { useState } from 'react';

function VentasImportarHites() {
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
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/ventas/importar-hites', {
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
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/ventas/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventas: ventasPreview }),
      });

      if (!res.ok) {
        throw new Error('Error al guardar ventas');
      }

      alert('✅ Ventas guardadas exitosamente');
      setVentasPreview([]);
      setArchivo(null);
    } catch (err) {
      console.error(err);
      alert('❌ Error al guardar ventas');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Importar Ventas - Hites</h1>

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
                  <th className="p-2">Producto</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Despacho</th>
                  <th className="p-2">Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {ventasPreview.map((venta, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{venta.numero_orden}</td>
                    <td className="p-2">{venta.producto}</td>
                    <td className="p-2">{venta.sku}</td>
                    <td className="p-2">${venta.precio}</td>
                    <td className="p-2">${venta.costo_despacho}</td>
                    <td className="p-2">
                      ${parseInt(venta.precio_cliente) + parseInt(venta.costo_despacho)}
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

export default VentasImportarHites;
