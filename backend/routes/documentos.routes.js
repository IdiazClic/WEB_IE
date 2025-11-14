const express = require('express');
const router = express.Router(); 
const documentosController = require('../controllers/documentos.controller');
const verificarAdmin = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload');

// Usamos el middleware para el campo 'documento'
const uploadDocumento = uploadMiddleware('documento');

// PÚBLICO: GET /api/documentos -> Lista de documentos para descarga
router.get('/', documentosController.findAll); 

// PROTEGIDO (Admin): POST /api/documentos -> Subir nuevo documento (PDF)
// Nota: Usamos el mismo middleware 'upload' (multer)
router.post('/', verificarAdmin, uploadDocumento, documentosController.create); 

module.exports = router;