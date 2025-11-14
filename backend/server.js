// Cargar la configuración de la BD
const db = require('./config/db.config');
const express = require('express');
const cors = require('cors');
const noticiasRoutes = require('./routes/noticias.routes'); // IMPORTAR la ruta de Noticias
const configRoutes = require('./routes/config.routes');
const documentosRoutes = require('./routes/documentos.routes');
const contactoRoutes = require('./routes/contacto.routes');

// Cargar las variables de entorno
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Para permitir peticiones desde el frontend
app.use(express.json()); // Para manejar datos JSON en las peticiones
app.use('/api/noticias', noticiasRoutes); // USAR la ruta de Noticias con el prefijo /api/noticias
app.use('/api/config', configRoutes); // USAR la ruta de Configuración con el prefijo /api/config
app.use('/api/documentos', documentosRoutes);
app.use('/api/contacto', contactoRoutes); // USAR la ruta de Contacto con el prefijo /api/contacto
// ---------------------------------------------
// RUTA DE PRUEBA: Verificar Conexión y Servidor
// ---------------------------------------------
app.get('/', async (req, res) => {
    try {
        // Ejecutamos una consulta simple para probar la conexión
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        
        // Si no hay error, la conexión es exitosa
        res.status(200).json({
            message: '✅ Conexión a MySQL y Servidor Express exitosos!',
            result: rows[0].solution
        });

    } catch (error) {
        // Si hay un error, lo mostramos
        console.error("Error de conexión a la BD:", error);
        res.status(500).json({
            message: '❌ Error al conectar a MySQL. Revisa tus credenciales en .env',
            error: error.message
        });
    }
});


// ---------------------------------------------
// INICIO DEL SERVIDOR
// ---------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor de la WEB_IE corriendo en http://localhost:${PORT}`);
});