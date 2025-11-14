const Documento = require('../models/documentos.model');
const { bucket } = require('../config/firebase.config'); // Para subir a Storage
const upload = require('../middleware/upload'); // Para procesar el archivo

// PÚBLICO: Obtener listado de documentos para la web
exports.findAll = async (req, res) => {
    try {
        const documentos = await Documento.getAll();
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de documentos.', error: error.message });
    }
};

// PROTEGIDO (Admin): Subir archivo y registrar en BD
exports.create = async (req, res) => {
    // Los datos del usuario vienen del middleware verificarAdmin
    const { uid: firebaseUid } = req.user; 
    const { nombre, descripcion, tipo_documento } = req.body;
    
    if (!req.file || !nombre || !tipo_documento) {
        return res.status(400).json({ message: 'Faltan datos: se requiere Archivo, Nombre y Tipo de Documento.' });
    }

    let archivo_url = null;
    
    try {
        // 1. Subida del archivo a Firebase Storage (dentro de una carpeta 'documentos/')
        const fileName = `documentos/${tipo_documento.replace(/\s/g, '_')}_${Date.now()}.pdf`; // Nombre legible
        const file = bucket.file(fileName);
        
        await file.save(req.file.buffer, {
            metadata: {
                contentType: req.file.mimetype,
            },
            public: true, // El archivo debe ser público para que se pueda descargar
            validation: 'crc32c'
        });

        // Obtener la URL pública
        archivo_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        
        // 2. Obtener el ID de usuario de MySQL (para la FK)
        const [userRow] = await db.query('SELECT id FROM usuarios WHERE uid = ?', [firebaseUid]);
        const id_usuario_admin = userRow.length > 0 ? userRow[0].id : null;

        // 3. Registrar en MySQL
        const nuevoDocumento = {
            nombre, 
            descripcion, 
            tipo_documento, 
            archivo_url, 
            id_usuario_admin
        };
        
        const resultado = await Documento.create(nuevoDocumento);
        
        res.status(201).json({
            message: `✅ Documento ${tipo_documento} subido y registrado con éxito.`,
            data: resultado
        });

    } catch (error) {
        console.error("Error al subir documento:", error);
        res.status(500).json({
            message: "Error al procesar la subida del documento.",
            error: error.message
        });
    }
};