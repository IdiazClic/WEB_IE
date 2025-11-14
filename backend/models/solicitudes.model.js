const db = require('../config/db.config');

const Solicitud = {
    // Método para registrar una nueva solicitud (usado por el formulario público)
    create: async (nuevaSolicitud) => {
        const query = 'INSERT INTO solicitudes (tipo_solicitud, nombre_apoderado, dni_apoderado, nombre_estudiante, grado_solicitado, telefono, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        const { tipo_solicitud, nombre_apoderado, dni_apoderado, nombre_estudiante, grado_solicitado, telefono, email } = nuevaSolicitud;
        
        try {
            const [result] = await db.query(query, [tipo_solicitud, nombre_apoderado, dni_apoderado, nombre_estudiante, grado_solicitado, telefono, email]);
            
            return { id: result.insertId, ...nuevaSolicitud };
        } catch (error) {
            // Este error puede ser por un campo demasiado largo o BD inactiva
            throw new Error(`Error al registrar la solicitud: ${error.message}`);
        }
    },
    
    // El administrador necesitará una ruta protegida para ver esto
    getAll: async () => {
         const query = 'SELECT * FROM solicitudes ORDER BY fecha_registro DESC';
         const [rows] = await db.query(query);
         return rows;
    }
};

module.exports = Solicitud;