const db = require('../config/db.config');

const Documento = {
    // Obtener todos los documentos públicos
    getAll: async () => {
        const query = 'SELECT id, nombre, descripcion, tipo_documento, archivo_url, fecha_publicacion FROM documentos ORDER BY tipo_documento, fecha_publicacion DESC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Registrar un nuevo documento subido (usado por el Admin)
    create: async (nuevoDocumento) => {
        const query = 'INSERT INTO documentos (nombre, descripcion, tipo_documento, archivo_url, fecha_publicacion, id_usuario_admin) VALUES (?, ?, ?, ?, CURDATE(), ?)';
        
        const { nombre, descripcion, tipo_documento, archivo_url, id_usuario_admin } = nuevoDocumento;
        
        try {
            const [result] = await db.query(query, [nombre, descripcion, tipo_documento, archivo_url, id_usuario_admin]);
            
            return { id: result.insertId, ...nuevoDocumento };
        } catch (error) {
            throw new Error(`Error al registrar documento: ${error.message}`);
        }
    }
};

module.exports = Documento;