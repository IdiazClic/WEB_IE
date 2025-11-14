const admin = require('firebase-admin');
const serviceAccount = require('../firebase-key.json'); // RUTA A TU ARCHIVO DESCARGADO

// Inicializar la aplicación de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Reemplaza con el bucket URL de tu Firebase Storage (ej: gs://web-ie-2025.appspot.com)
    storageBucket: "gs://[web-ie-1042c].appspot.com" 
});

const bucket = admin.storage().bucket();

module.exports = {
    bucket,
    admin // Exportamos el objeto admin por si se necesita para Auth
};