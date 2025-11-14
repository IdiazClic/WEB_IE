// Importamos 'dotenv' para cargar las variables del archivo .env
require('dotenv').config(); 

// Importamos el cliente de MySQL
const mysql = require('mysql2');

// Creamos un 'pool' de conexiones para manejar las solicitudes de manera eficiente
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Límite de conexiones simultáneas
  queueLimit: 0
});

// Convertimos el pool en promesas para poder usar async/await (código más limpio)
const promisePool = pool.promise();

// Exportamos la conexión para usarla en nuestro servidor
module.exports = promisePool;