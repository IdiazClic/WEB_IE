const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');
const verificarAdmin = require('../middleware/auth.middleware');

// Ruta PÚBLICA: GET /api/config -> Obtiene todo el contenido estático
router.get('/', configController.getSettings);

// Ruta PROTEGIDA: PUT /api/config -> Actualiza una configuración (Misión, Visión, Historia)
router.put('/', verificarAdmin, configController.updateSetting);

module.exports = router;