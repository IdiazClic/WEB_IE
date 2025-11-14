const db = require('../config/db.config'); // Importamos la conexión a MySQL

// Objeto para manejar todas las interacciones de Noticias con la BD
const Noticia = {
    // Método para obtener todas las noticias ordenadas por fecha (más reciente primero)
    getAll: async () => {
        const query = 'SELECT id, titulo, SUBSTRING(contenido_html, 1, 150) as resumen, fecha_pub, imagen_url FROM noticias ORDER BY fecha_pub DESC';
        try {
            // Ejecutamos la consulta usando el pool de promesas
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            // Lanzamos el error para que el Controlador lo maneje
            throw new Error(`Error al obtener noticias: ${error.message}`);
        }
    },
    
    // Aquí irán otros métodos: getById, create, update, delete (CRUD)

    // ... (código existente de Noticia.getAll)

    // Nuevo método para crear una noticia
    create: async (nuevaNoticia) => {
        const query = 'INSERT INTO noticias (titulo, contenido_html, imagen_url, es_evento) VALUES (?, ?, ?, ?)';
        const { titulo, contenido_html, imagen_url, es_evento } = nuevaNoticia;
        
        try {
            // Ejecutamos la inserción
            const [result] = await db.query(query, [titulo, contenido_html, imagen_url, es_evento]);
            
            // Retornamos el ID de la noticia insertada
            return { id: result.insertId, ...nuevaNoticia };
        } catch (error) {
            throw new Error(`Error al crear noticia: ${error.message}`);
        }
    },
    
    // ... (fin de Noticia)
};


module.exports = Noticia;

