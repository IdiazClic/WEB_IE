const { admin } = require('../config/firebase.config'); // Importamos Firebase Admin SDK
const db = require('../config/db.config'); // Importamos la conexión a MySQL

// Middleware para verificar la autenticación (Autentica token de Firebase y verifica Rol en MySQL)
const verificarAdmin = async (req, res, next) => {
    // 1. Obtener el token del encabezado (Header) de la petición
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso Denegado. Token no proporcionado.' });
    }

    // El token es la segunda parte del string 'Bearer <token>'
    const idToken = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token usando Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid; // El ID único del usuario de Firebase

        // 3. Verificar el Rol en la Base de Datos MySQL
        // Nota: Asumimos que la tabla 'usuarios' tiene una columna 'uid' (VARCHAR) y 'rol_id'
        const [rows] = await db.query(
            'SELECT r.nombre_rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.uid = ?',
            [uid]
        );

        if (rows.length === 0 || rows[0].nombre_rol !== 'Administrador') {
            return res.status(403).json({ message: 'Acceso Prohibido. Rol no autorizado (solo Administradores).' });
        }

        // Si es administrador, adjuntamos la información del usuario a la petición
        req.user = { uid: uid, rol: rows[0].nombre_rol }; 
        
        // 4. Continuar al siguiente middleware (el controlador de noticias)
        next(); 

    } catch (error) {
        console.error("Error de autenticación/token:", error.message);
        return res.status(401).json({ message: 'Token inválido o expirado.', error: error.message });
    }
};

module.exports = verificarAdmin;