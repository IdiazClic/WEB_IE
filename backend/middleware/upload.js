const multer = require('multer');

// Configuramos multer para almacenar el archivo en la memoria (buffer)
// antes de subirlo a Firebase Storage. Es más rápido que guardarlo en disco local.
const storage = multer.memoryStorage();

// Exportamos una función que toma el nombre del campo del archivo (e.g., 'imagen', 'documento')
const singleFileUpload = (fieldName) => {
    return multer({
        storage: storage,
        limits: { fileSize: 10 * 1024 * 1024 } // Límite de 10MB para documentos grandes
    }).single(fieldName);
};

module.exports = singleFileUpload;