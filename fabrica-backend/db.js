const mysql = require('mysql2');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fabrica_muebles'
});

// Conectar
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa!');
});

module.exports = connection;
