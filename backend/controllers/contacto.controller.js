const Solicitud = require('../models/solicitudes.model');

// PÚBLICO: Recibe los datos de los formularios de e-channels
exports.submitSolicitud = async (req, res) => {
    const { 
        tipo_solicitud, nombre_apoderado, dni_apoderado, 
        nombre_estudiante, grado_solicitado, telefono, email 
    } = req.body;

    // Validación básica de que los campos críticos estén presentes
    if (!tipo_solicitud || !nombre_apoderado || !dni_apoderado || !nombre_estudiante) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para la solicitud.' });
    }

    try {
        const nuevaSolicitud = {
            tipo_solicitud, nombre_apoderado, dni_apoderado,
            nombre_estudiante, grado_solicitado: grado_solicitado || null, 
            telefono: telefono || null, email: email || null
        };
        
        const resultado = await Solicitud.create(nuevaSolicitud);
        
        res.status(201).json({
            message: '✅ Solicitud enviada con éxito. Pronto nos comunicaremos con usted.',
            data: resultado
        });
        
        // Aquí podrías añadir lógica para enviar una notificación por correo al administrador
        
    } catch (error) {
        console.error("Error al procesar solicitud:", error);
        res.status(500).json({
            message: 'Error interno al registrar la solicitud.',
            error: error.message
        });
    }
};

// PROTEGIDO (Admin): Ver todas las solicitudes
exports.getSolicitudesAdmin = async (req, res) => {
    try {
        const solicitudes = await Solicitud.getAll();
        res.status(200).json(solicitudes);
    } catch (error) {
         res.status(500).json({ message: 'Error al obtener la lista de solicitudes.', error: error.message });
    }
};