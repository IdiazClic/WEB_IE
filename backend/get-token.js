const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

// Configuración de tu App de Firebase (obtén esto de la Configuración del Proyecto -> Apps)
const firebaseConfig = {
  apiKey: "[AIzaSyDWDaiFYrZd5Gh0hWvmXWgBlzEmWa4ua90]", 
  authDomain: "[web-ie-1042c.firebaseapp.com].firebaseapp.com",
  projectId: "[web-ie-1042c]",
  storageBucket: "web-ie-1042c.firebasestorage.app",
  messagingSenderId: "566881110415",
  appId: "1:566881110415:web:0a5b79fa925d7914b063fa", 
  measurementId: "G-VF3JFW321X"

};

// 1. Inicializar la app cliente
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getToken() {
  try {
    console.log("Iniciando sesión...");
    // 2. Iniciar sesión con el usuario Administrador que creaste
    const userCredential = await signInWithEmailAndPassword(auth, 'admin@ie.edu.pe', 'password123');

    // 3. Obtener el token de identificación
    const idToken = await userCredential.user.getIdToken();

    console.log("✅ Token obtenido con éxito. Úsalo en Postman:");
    console.log("\nBearer " + idToken + "\n");

  } catch (error) {
    console.error("Error al obtener token:", error.message);
  }
}

getToken();