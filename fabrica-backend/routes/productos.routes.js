const express = require('express');
const router = express.Router();

// GET - Listar productos
router.get('/', (req, res) => {
  req.db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(results);
  });
});

// POST - Crear producto
router.post('/', (req, res) => {
  const { sku, nombre_producto, descripcion, precio_venta_promedio } = req.body;
  if (!sku || !nombre_producto) return res.status(400).json({ error: 'SKU y nombre requeridos' });

  const query = `INSERT INTO productos (sku, nombre_producto, descripcion, precio_venta_promedio) VALUES (?, ?, ?, ?)`;
  req.db.query(query, [sku, nombre_producto, descripcion, precio_venta_promedio], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear producto' });
    res.status(201).json({ id: result.insertId, message: 'Producto creado' });
  });
});

// PUT - Editar producto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { sku, nombre_producto, descripcion, precio_venta_promedio } = req.body;

  const query = `UPDATE productos SET sku = ?, nombre_producto = ?, descripcion = ?, precio_venta_promedio = ? WHERE id = ?`;
  req.db.query(query, [sku, nombre_producto, descripcion, precio_venta_promedio, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar producto' });
    res.json({ message: 'Producto actualizado' });
  });
});

// DELETE - Eliminar producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
    res.json({ message: 'Producto eliminado' });
  });
});

module.exports = router;
