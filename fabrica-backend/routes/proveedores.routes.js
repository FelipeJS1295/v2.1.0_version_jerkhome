const express = require('express');
const router = express.Router();

// 🔍 GET - Listar con búsqueda y paginación
router.get('/', (req, res) => {
  const { search, page = 1, limit = 100, sort = 'id', order = 'ASC' } = req.query;

  let baseQuery = 'SELECT * FROM proveedores';
  let params = [];

  if (search) {
    baseQuery += ' WHERE nombre LIKE ? OR rut LIKE ?';
    params.push(`%${search}%`, `%${search}%`);
  }

  baseQuery += ` ORDER BY ${sort} ${order}`;

  const offset = (page - 1) * limit;
  baseQuery += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  req.db.query(baseQuery, params, (err, results) => {
    if (err) {
      console.error('Error al obtener proveedores:', err);
      return res.status(500).json({ error: 'Error al obtener proveedores' });
    }
    res.json(results);
  });
});

// ➕ POST - Crear proveedor
router.post('/', (req, res) => {
  const { rut, nombre, direccion, contacto, forma_pago } = req.body;

  if (!rut || !nombre) {
    return res.status(400).json({ error: 'RUT y nombre son obligatorios' });
  }

  const query = `
    INSERT INTO proveedores (rut, nombre, direccion, contacto, forma_pago)
    VALUES (?, ?, ?, ?, ?)
  `;

  req.db.query(query, [rut, nombre, direccion, contacto, forma_pago], (err, result) => {
    if (err) {
      console.error('Error al crear proveedor:', err);
      return res.status(500).json({ error: 'Error al crear proveedor' });
    }
    res.status(201).json({ id: result.insertId, message: 'Proveedor creado' });
  });
});

// ✏️ PUT - Actualizar proveedor
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { rut, nombre, direccion, contacto, forma_pago } = req.body;

  const query = `
    UPDATE proveedores
    SET rut = ?, nombre = ?, direccion = ?, contacto = ?, forma_pago = ?
    WHERE id = ?
  `;

  req.db.query(query, [rut, nombre, direccion, contacto, forma_pago, id], (err) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
    res.json({ message: 'Proveedor actualizado' });
  });
});

// ❌ DELETE - Eliminar proveedor
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  req.db.query('DELETE FROM proveedores WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
    res.json({ message: 'Proveedor eliminado' });
  });
});

module.exports = router;

