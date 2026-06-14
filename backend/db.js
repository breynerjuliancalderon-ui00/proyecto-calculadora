// Cargamos las variables de entorno desde el archivo v_entorno.env
require('dotenv').config({ path: './v_entorno.env' });

// Importamos el driver de MySQL para Node.js
const mysql = require('mysql2');

// Creamos un pool de conexiones usando las variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Dirección del servidor MySQL
    user: process.env.DB_USER,         // Usuario de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña de la base de datos
    database: process.env.DB_NAME,     // Nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Usamos la versión con promesas para escribir código más limpio
const promisePool = pool.promise();

// Probamos la conexión al iniciar
promisePool.query('SELECT 1')
    .then(() => console.log('✓ Conexión a MySQL exitosa'))
    .catch(err => console.error('✗ Error al conectar a MySQL:', err.message));

// Exportamos el pool para usarlo en otros archivos
module.exports = promisePool;