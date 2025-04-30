const express = require('express');
const router = express.Router();

// Obtener ventas retail con filtros, búsqueda y paginación
router.get('/', (req, res) => {
  const { search, page = 1, limit = 10, sort = 'id', order = 'ASC' } = req.query;

  let baseQuery = 'SELECT * FROM ventas_retail';
  let params = [];

  if (search) {
    baseQuery += ' WHERE producto LIKE ? OR numero_orden LIKE ? OR sku LIKE ?';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  baseQuery += ` ORDER BY ${sort} ${order}`;

  const offset = (page - 1) * limit;
  baseQuery += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  req.db.query(baseQuery, params, (err, results) => {
    if (err) {
      console.error('Error al obtener ventas retail:', err);
      return res.status(500).json({ error: 'Error al obtener ventas retail' });
    }
    res.json(results);
  });
});

module.exports = router;
