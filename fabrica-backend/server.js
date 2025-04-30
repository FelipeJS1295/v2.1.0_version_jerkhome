const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a DB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fabrica_muebles',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err);
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

// Inyectar conexión
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Importar rutas
const productosRoutes = require('./routes/productos.routes');
const clientesRoutes = require('./routes/clientes.routes');
const insumosRoutes = require('./routes/insumos.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const ventasRetailRoutes = require('./routes/ventasRetail.routes');
const ventasRoutes = require('./routes/ventas.routes');

// Usar rutas
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/insumos', insumosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/ventas-retail', ventasRetailRoutes);
app.use('/api/ventas', ventasRoutes);

// Puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

