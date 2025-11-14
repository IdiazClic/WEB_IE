const express = require('express');
const router = express.Router(); 
const contactoController = require('../controllers/contacto.controller');
const verificarAdmin = require('../middleware/auth.middleware');

// PÚBLICO: POST /api/contacto/submit -> Envía la solicitud de matrícula/renovación
router.post('/submit', contactoController.submitSolicitud); 

// PROTEGIDO (Admin): GET /api/contacto/admin -> Lista todas las solicitudes
router.get('/admin', verificarAdmin, contactoController.getSolicitudesAdmin); 

module.exports = router;