const db = require('../config/db.config');

const Config = {
    // Obtiene todos los pares clave-valor (Misión, Visión, etc.)
    getAll: async () => {
        const query = 'SELECT clave, valor FROM configuracion';
        const [rows] = await db.query(query);
        // Convertimos el array a un objeto {mision: '...', vision: '...'}
        return rows.reduce((obj, item) => {
            obj[item.clave] = item.valor;
            return obj;
        }, {});
    },

    // Actualiza un valor (usado por el Administrador)
    update: async (clave, nuevoValor) => {
        const query = 'UPDATE configuracion SET valor = ? WHERE clave = ?';
        const [result] = await db.query(query, [nuevoValor, clave]);
        return result.affectedRows;
    }
};

module.exports = Config;