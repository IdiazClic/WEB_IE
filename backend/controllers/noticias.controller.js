const Noticia = require('../models/noticias.model');
const { bucket } = require('../config/firebase.config'); // Importamos el bucket de Firebase

// ===================================
// 1. FUNCIÓN PÚBLICA: Obtener todas las noticias (GET)
// ===================================
exports.findAll = async (req, res) => {
    try {
        const noticias = await Noticia.getAll();
        
        // ... (código de retorno si no hay noticias o si es exitoso) ...
        if (noticias.length === 0) {
            return res.status(200).json({ 
                message: "Aún no hay noticias publicadas." ,
                data: []
            });
        }
        
        res.status(200).json({
            message: "Noticias obtenidas con éxito.",
            data: noticias
        });
        
    } catch (error) {
        // Manejo de errores internos del servidor
        res.status(500).json({
            message: "Error interno del servidor al consultar noticias.",
            error: error.message
        });
    }
}; // <-- ¡Fin de la función findAll!

// ===================================
// 2. FUNCIÓN PROTEGIDA: Crear una nueva noticia (POST)
// ===================================
exports.create = async (req, res) => { // <-- ¡DEFINICIÓN CORRECTA DE LA FUNCIÓN!
    
    // 1. Obtener los datos del cuerpo de la petición (texto)
    const { titulo, contenido_html, es_evento } = req.body;
    let imagen_url = null;
    
    try {
        // 2. Subida a Firebase Storage si hay un archivo
        if (req.file) {
            const fileName = `noticias/${Date.now()}_${req.file.originalname}`;
            const file = bucket.file(fileName);
            
            await file.save(req.file.buffer, {
                metadata: {
                    contentType: req.file.mimetype,
                },
                public: true, 
                validation: 'crc32c' 
            });

            // Obtener la URL pública del archivo
            imagen_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        }
        
        // 3. Crear el objeto noticia para guardar en MySQL
        const nuevaNoticia = {
            titulo,
            contenido_html,
            es_evento: es_evento === 'true' ? true : false, 
            imagen_url: imagen_url
        };
        
        // 4. Guardar la noticia en MySQL
        const resultado = await Noticia.create(nuevaNoticia);
        
        res.status(201).json({
            message: '✅ Noticia creada y publicada con éxito.',
            data: resultado
        });

    } catch (error) {
        console.error("Error al crear noticia:", error);
        res.status(500).json({
            message: "Error al procesar la subida y creación de la noticia.",
            error: error.message
        });
    }
}; // <-- ¡Fin de la función create!

// No necesitas 'module.exports' aquí, ya que usamos 'exports.nombreFuncion'