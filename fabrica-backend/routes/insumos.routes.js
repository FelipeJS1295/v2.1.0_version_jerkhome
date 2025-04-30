const express = require('express');
const router = express.Router();

// 📥 GET - Listar con filtros, búsqueda y paginación
router.get('/', (req, res) => {
  const { search, page = 1, limit = 100, sort = 'insumos.id', order = 'ASC' } = req.query;

  let baseQuery = `
    SELECT insumos.*, proveedores.nombre AS proveedor_nombre
    FROM insumos
    LEFT JOIN proveedores ON insumos.proveedor_id = proveedores.id
  `;

  let params = [];

  if (search) {
    baseQuery += ' WHERE insumos.nombre LIKE ? OR insumos.sku LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  baseQuery += ` ORDER BY ${sort} ${order}`;

  const offset = (page - 1) * limit;
  baseQuery += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  req.db.query(baseQuery, params, (err, results) => {
    if (err) {
      console.error('Error al obtener insumos:', err);
      return res.status(500).json({ error: 'Error al obtener insumos' });
    }
    res.json(results);
  });
});

// ➕ POST - Crear insumo
router.post('/', (req, res) => {
  const { sku, nombre, unidad_medida, proveedor_id, costo } = req.body;

  if (!sku || !nombre || !unidad_medida || !proveedor_id || !costo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `
    INSERT INTO insumos (sku, nombre, unidad_medida, proveedor_id, costo)
    VALUES (?, ?, ?, ?, ?)
  `;

  req.db.query(query, [sku, nombre, unidad_medida, proveedor_id, costo], (err, result) => {
    if (err) {
      console.error('Error al crear insumo:', err);
      return res.status(500).json({ error: 'Error al crear insumo' });
    }
    res.status(201).json({ id: result.insertId, message: 'Insumo creado' });
  });
});

// ✏️ PUT - Actualizar insumo
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { sku, nombre, unidad_medida, proveedor_id, costo } = req.body;

  const query = `
    UPDATE insumos
    SET sku = ?, nombre = ?, unidad_medida = ?, proveedor_id = ?, costo = ?
    WHERE id = ?
  `;

  req.db.query(query, [sku, nombre, unidad_medida, proveedor_id, costo, id], (err) => {
    if (err) {
      console.error('Error al actualizar insumo:', err);
      return res.status(500).json({ error: 'Error al actualizar insumo' });
    }
    res.json({ message: 'Insumo actualizado' });
  });
});

// ❌ DELETE - Eliminar insumo
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  req.db.query('DELETE FROM insumos WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar insumo:', err);
      return res.status(500).json({ error: 'Error al eliminar insumo' });
    }
    res.json({ message: 'Insumo eliminado' });
  });
});

module.exports = router;

