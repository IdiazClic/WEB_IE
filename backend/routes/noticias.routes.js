// routes/noticias.routes.js
const express = require('express');
const router = express.Router(); 
const noticiasController = require('../controllers/noticias.controller');
const uploadMiddleware = require('../middleware/upload');
const verificarAdmin = require('../middleware/auth.middleware');
 
// Usamos el middleware para el campo 'imagen'
const uploadImage = uploadMiddleware('imagen');
// ...
router.get('/', noticiasController.findAll); 
router.post('/', verificarAdmin, uploadImage, noticiasController.create); 
// ...

module.exports = router;