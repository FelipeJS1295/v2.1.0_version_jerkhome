const express = require('express');
const router = express.Router();

// GET - Listar
router.get('/', (req, res) => {
  req.db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
    res.json(results);
  });
});

// POST - Crear
router.post('/', (req, res) => {
  const { rut, nombre, direccion, contacto, dias_pago, porcentaje_comision, cobro_logistico } = req.body;

  if (!rut || !nombre) return res.status(400).json({ error: 'RUT y nombre son obligatorios' });

  const query = `
    INSERT INTO clientes (rut, nombre, direccion, contacto, dias_pago, porcentaje_comision, cobro_logistico)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  req.db.query(query, [rut, nombre, direccion, contacto, dias_pago, porcentaje_comision, cobro_logistico], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear cliente' });
    res.status(201).json({ id: result.insertId, message: 'Cliente creado' });
  });
});

// PUT - Editar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { rut, nombre, direccion, contacto, dias_pago, porcentaje_comision, cobro_logistico } = req.body;

  const query = `
    UPDATE clientes SET rut = ?, nombre = ?, direccion = ?, contacto = ?, dias_pago = ?, porcentaje_comision = ?, cobro_logistico = ?
    WHERE id = ?
  `;

  req.db.query(query, [rut, nombre, direccion, contacto, dias_pago, porcentaje_comision, cobro_logistico, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar cliente' });
    res.json({ message: 'Cliente actualizado' });
  });
});

// DELETE - Eliminar
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  req.db.query('DELETE FROM clientes WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar cliente' });
    res.json({ message: 'Cliente eliminado' });
  });
});

module.exports = router;