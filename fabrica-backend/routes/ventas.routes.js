const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const dayjs = require('dayjs');

// Configurar Multer para recibir archivos
const upload = multer({ storage: multer.memoryStorage() });

// 📥 Importar ventas desde archivo de Falabella
router.post('/importar-falabella', upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debe subir un archivo Excel' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!data || data.length < 2) {
      return res.status(400).json({ error: 'El archivo está vacío o malformado' });
    }

    const limpiarPrecio = (valor) => {
      if (!valor) return null;
      const limpio = String(valor).replace(/[^0-9]/g, '');
      return parseInt(limpio);
    };

    const resultado = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const numero_orden = row[4] || null;

      if (!numero_orden) continue;

      const rawFechaCompra = row[3];
      const rawFechaEntrega = row[50];

      const parsedCompra = new Date(rawFechaCompra);
      const parsedEntrega = new Date(rawFechaEntrega);

      if (isNaN(parsedCompra)) {
        return res.status(400).json({
          error: `❌ Error en la fila ${i + 1}: la fecha de compra (${rawFechaCompra}) no es válida.`,
        });
      }

      if (isNaN(parsedEntrega)) {
        return res.status(400).json({
          error: `❌ Error en la fila ${i + 1}: la fecha de entrega (${rawFechaEntrega}) no es válida.`,
        });
      }

      const fecha_compra = dayjs(parsedCompra).format('YYYY-MM-DD');
      const fecha_entrega = dayjs(parsedEntrega).format('YYYY-MM-DD');

      // Verificar si ya existe en la base de datos
      const [rows] = await req.db.promise().query(
        'SELECT numero_orden FROM ventas_retail WHERE numero_orden = ? LIMIT 1',
        [numero_orden]
      );
      const ya_existe = rows.length > 0;

      resultado.push({
        numero_orden,
        cliente_id: 1,
        cliente_final: row[9] || null,
        rut_documento: row[11] || null,
        direccion: row[13] || null,
        comuna: row[18] || null,
        region: row[22] || null,
        sku: row[1] || null,
        producto: row[40] || null,
        precio: limpiarPrecio(row[35]),
        precio_cliente: limpiarPrecio(row[36]),
        costo_despacho: limpiarPrecio(row[37]),
        courier: row[42] || null,
        estado: 'Nueva',
        documento: row[8] || null,
        fecha_compra,
        fecha_entrega,
        ya_existe
      });
    }

    res.json({ ventas: resultado });

  } catch (error) {
    console.error('❌ Error al importar archivo Falabella:', error);
    res.status(500).json({ error: 'Error al procesar el archivo' });
  }
});


// 📥 Importar ventas desde archivo de Walmart
router.post('/importar-walmart', upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debe subir un archivo Excel' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!data || data.length < 2) {
      return res.status(400).json({ error: 'El archivo está vacío o malformado' });
    }

    const limpiarPrecio = (valor) => {
      if (!valor) return 0;
      const limpio = String(valor).replace(/[^0-9]/g, '');
      return parseInt(limpio);
    };

    const resultado = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const numero_orden = row[1] || null;

      if (!numero_orden) continue;

      // Validar fechas
      const rawFechaCompra = row[2];
      const rawFechaEntrega = row[3];
      const rawFechaCliente = row[4];

      const parsedCompra = new Date(rawFechaCompra);
      const parsedEntrega = new Date(rawFechaEntrega);
      const parsedCliente = new Date(rawFechaCliente);

      if (isNaN(parsedCompra)) {
        return res.status(400).json({
          error: `❌ Fila ${i + 1}: fecha de compra (${rawFechaCompra}) no válida.`,
        });
      }

      if (isNaN(parsedEntrega)) {
        return res.status(400).json({
          error: `❌ Fila ${i + 1}: fecha de entrega (${rawFechaEntrega}) no válida.`,
        });
      }

      const fecha_compra = dayjs(parsedCompra).format('YYYY-MM-DD');
      const fecha_entrega = dayjs(parsedEntrega).format('YYYY-MM-DD');
      const fecha_cliente = parsedCliente && !isNaN(parsedCliente)
        ? dayjs(parsedCliente).format('YYYY-MM-DD')
        : null;

      const precio = limpiarPrecio(row[25]);
      const impuesto = limpiarPrecio(row[27]);
      const costo_despacho = limpiarPrecio(row[26]);

      // Verificar si ya existe en la base de datos
      const [rows] = await req.db.promise().query(
        'SELECT numero_orden FROM ventas_retail WHERE numero_orden = ? LIMIT 1',
        [numero_orden]
      );
      const ya_existe = rows.length > 0;

      resultado.push({
        numero_orden,
        cliente_id: 3,
        fecha_compra,
        fecha_entrega,
        fecha_cliente,
        cliente_final: row[5] || null,
        rut_documento: row[12] || null,
        direccion: row[8] || null,
        comuna: row[10] || null,
        region: row[11] || null,
        sku: row[24] || null,
        producto: row[21] || null,
        precio,
        precio_cliente: precio + impuesto,
        costo_despacho,
        currier: row[31] || null,
        estado: 'Nueva',
        documento: null,
        ya_existe
      });
    }

    res.json({ ventas: resultado });

  } catch (error) {
    console.error('❌ Error al importar archivo Walmart:', error);
    res.status(500).json({ error: 'Error al procesar el archivo de Walmart' });
  }
});


// 📥 Importar ventas desde archivo de Paris
router.post('/importar-paris', upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debe subir un archivo Excel' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!data || data.length < 2) {
      return res.status(400).json({ error: 'El archivo está vacío o malformado' });
    }

    const resultado = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const numero_orden = row[0] || null;
      if (!numero_orden) continue;

      // Validar y formatear fechas
      const rawFechaCompra = row[6];
      const rawFechaEntrega = row[7];
      const rawFechaCliente = row[8];

      const parsedCompra = new Date(rawFechaCompra);
      const parsedEntrega = new Date(rawFechaEntrega);
      const parsedCliente = new Date(rawFechaCliente);

      if (isNaN(parsedCompra)) {
        return res.status(400).json({
          error: `❌ Fila ${i + 1}: fecha de compra (${rawFechaCompra}) no válida.`,
        });
      }

      if (isNaN(parsedEntrega)) {
        return res.status(400).json({
          error: `❌ Fila ${i + 1}: fecha de entrega (${rawFechaEntrega}) no válida.`,
        });
      }

      const fecha_compra = dayjs(parsedCompra).format('YYYY-MM-DD');
      const fecha_entrega = dayjs(parsedEntrega).format('YYYY-MM-DD');
      const fecha_cliente = parsedCliente && !isNaN(parsedCliente)
        ? dayjs(parsedCliente).format('YYYY-MM-DD')
        : null;

      // Verificar existencia en BD
      const [rows] = await req.db.promise().query(
        'SELECT numero_orden FROM ventas_retail WHERE numero_orden = ? LIMIT 1',
        [numero_orden]
      );
      const ya_existe = rows.length > 0;

      resultado.push({
        numero_orden,
        cliente_id: 2, // Paris
        cliente_final: row[2] || null,
        rut_documento: row[3] || null,
        direccion: row[14] || null,
        comuna: row[13] || null,
        region: row[15] || null,
        sku: row[17] || null,
        producto: row[9] || null,
        precio: row[10] || 0,
        precio_cliente: row[11] || 0,
        costo_despacho: row[12] || 0,
        currier: row[27] || null,
        estado: 'Nueva',
        documento: row[19] || null,
        fecha_compra,
        fecha_entrega,
        fecha_cliente,
        ya_existe
      });
    }

    res.json({ ventas: resultado });

  } catch (error) {
    console.error('❌ Error al importar archivo Paris:', error);
    res.status(500).json({ error: 'Error al procesar el archivo de Paris' });
  }
});


  // 📥 Importar ventas desde archivo de Hites (archivo principal)
router.post('/importar-hites', upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debe subir un archivo Excel' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!data || data.length < 2) {
      return res.status(400).json({ error: 'El archivo está vacío o malformado' });
    }

    const ordenes = {};

    // Saltar encabezado
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const numero_orden = row[1] || null;

      if (!numero_orden) continue;

      if (!ordenes[numero_orden]) {
        ordenes[numero_orden] = {
          numero_orden,
          cliente_id: 5, // Hites
          fecha_compra: row[5] || null,
          fecha_entrega: row[5] || null,
          sku: row[9] || null,
          producto: row[3] || null,
          precio: parseInt(row[11]) || 0,
          precio_cliente: parseInt(row[12]) || 0,
          costo_despacho: 0,
          cliente_final: row[35] || null,
          telefono: row[36] || null,
          email: row[37] || null,
          estado: 'Nueva',
          documento: null,
          direccion: null,
          comuna: null,
          region: null,
          rut_documento: null,
          ya_existe: false,
        };
      } else {
        // Si es la segunda fila de la orden (despacho), sumamos el costo de despacho
        ordenes[numero_orden].costo_despacho += parseInt(row[11]) || 0;
      }
    }

    const resultado = Object.values(ordenes);
    res.json({ ventas: resultado });

  } catch (error) {
    console.error('Error al importar archivo Hites:', error);
    res.status(500).json({ error: 'Error al procesar el archivo de Hites' });
  }
});

// 📤 Actualizar ventas Hites desde archivo secundario
router.post('/actualizar-hites', upload.single('archivo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Debe subir un archivo Excel' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (!data || data.length < 2) {
      return res.status(400).json({ error: 'El archivo está vacío o malformado' });
    }

    const actualizaciones = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const numero_orden = row[0] || null;

      if (!numero_orden) continue;

      const sku = row[1] || null;
      const producto = row[5] || null;
      const rut_documento = row[11] || null;
      const precio_cliente = parseInt(row[10]) || 0;


      actualizaciones.push({
        numero_orden,
        sku,
        producto,
        rut_documento,
        precio_cliente,
      });
    }

    // Procesar cada actualización en la base de datos
    const db = req.db;
    let errores = [];

    const actualizarSiguiente = (index) => {
      if (index >= actualizaciones.length) {
        return res.json({ message: 'Actualización completada', errores });
      }

      const venta = actualizaciones[index];

      const query = `
        UPDATE ventas_retail SET 
          sku = ?, 
          producto = ?, 
          rut_documento = ?, 
          precio_cliente = ?, 
          costo_despacho = ?
        WHERE numero_orden = ?
      `;

      db.query(query, [
        venta.sku,
        venta.producto,
        venta.rut_documento,
        venta.precio_cliente,
        venta.costo_despacho,
        venta.numero_orden
      ], (err) => {
        if (err) {
          errores.push({ orden: venta.numero_orden, error: err.message });
        }
        actualizarSiguiente(index + 1);
      });
    };

    actualizarSiguiente(0);

  } catch (error) {
    console.error('Error al actualizar Hites:', error);
    res.status(500).json({ error: 'Error al procesar archivo de actualización Hites' });
  }
});
  

// 💾 Guardar ventas en la base de datos
router.post('/guardar', (req, res) => {
  const ventas = req.body.ventas;

  if (!ventas || ventas.length === 0) {
    return res.status(400).json({ error: 'No hay ventas para guardar' });
  }

  const insertVentas = ventas.map((venta) => [
    venta.numero_orden,
    venta.cliente_id,
    venta.cliente_final,
    venta.rut_documento,
    venta.direccion,
    venta.comuna,
    venta.region,
    venta.sku,
    venta.producto,
    venta.precio,
    venta.precio_cliente,
    venta.costo_despacho,
    venta.courier,
    venta.estado,
    venta.documento,
    venta.fecha_compra,
    venta.fecha_entrega
  ]);

  const sql = `
    INSERT INTO ventas_retail 
    (numero_orden, cliente_id, cliente_final, rut_documento, direccion, comuna, region, sku, producto, precio, precio_cliente, costo_despacho, courier, estado, documento, fecha_compra, fecha_entrega)
    VALUES ?
  `;

  req.db.query(sql, [insertVentas], (err, result) => {
    if (err) {
      console.error('Error al guardar ventas:', err);
      return res.status(500).json({ error: 'Error al guardar ventas' });
    }
    res.json({ message: 'Ventas guardadas correctamente' });
  });
});

// ✅ Nueva ruta para obtener todas las ventas
router.get('/listado', async (req, res) => {
  try {
    const [ventas] = await req.db.promise().query(`
      SELECT 
        ventas_retail.id,
        ventas_retail.numero_orden,
        ventas_retail.cliente_id,
        clientes.nombre AS cliente_nombre,
        ventas_retail.fecha_entrega,
        ventas_retail.sku,
        ventas_retail.producto,
        ventas_retail.estado
      FROM ventas_retail
      LEFT JOIN clientes ON ventas_retail.cliente_id = clientes.id
      ORDER BY ventas_retail.fecha_entrega DESC
    `);

    res.json({ ventas });
  } catch (err) {
    console.error('Error al obtener listado de ventas:', err);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// Cambiar estado en lote
router.post('/cambiar-estado', async (req, res) => {
  const { ordenes, estado } = req.body;
  if (!Array.isArray(ordenes) || !estado) {
    return res.status(400).json({ error: 'Faltan datos para actualizar' });
  }
  try {
    const placeholders = ordenes.map(() => '?').join(',');
    await req.db.promise().query(
      `UPDATE ventas_retail SET estado = ? WHERE numero_orden IN (${placeholders})`,
      [estado, ...ordenes]
    );
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
});

// Eliminar venta
router.delete('/eliminar/:orden', async (req, res) => {
  const { orden } = req.params;
  try {
    await req.db.promise().query(
      'DELETE FROM ventas_retail WHERE numero_orden = ?',
      [orden]
    );
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ error: 'Error al eliminar venta' });
  }
});

router.get('/maestra', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.nombre AS cliente,
        v.producto,
        v.fecha_entrega,
        SUM(v.unidades) AS total_unidades
      FROM ventas_retail v
      JOIN clientes c ON v.cliente_id = c.id
      WHERE v.estado = 'Nueva'
      GROUP BY c.nombre, v.producto, v.fecha_entrega
      ORDER BY c.nombre, v.producto, v.fecha_entrega
    `;
    const [rows] = await req.db.promise().query(query);
    res.json({ datos: rows });
  } catch (error) {
    console.error('Error al obtener la vista maestra:', error);
    res.status(500).json({ error: 'Error al generar la vista maestra' });
  }
});

module.exports = router;
