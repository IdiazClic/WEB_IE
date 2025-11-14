import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // <-- ¡Necesita react-router-dom!
import { auth } from '../firebase/config'; // Asegúrate de que este archivo exista

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const navigate = useNavigate(); // Hook para la navegación

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoggingIn(true);

        try {
            // 1. Iniciar sesión con Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // 2. Obtener el token de autenticación
            const idToken = await user.getIdToken();
            
            console.log("✅ Login exitoso. Redirigiendo al Admin.");
            
            // 3. Guardar el token para futuras peticiones seguras
            localStorage.setItem('adminToken', idToken);
            
            // 4. Redirigir al dashboard principal de administración
            navigate('/admin/noticias'); // Redirige a la página de gestión de noticias
            
        } catch (err) {
            console.error("Error de autenticación:", err.code, err.message);
            
            let errorMessage = 'Error desconocido al iniciar sesión.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                errorMessage = 'Credenciales inválidas. Revisa el email y la contraseña.';
            } 
            setError(errorMessage);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #0056b3', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2>🔐 Acceso de Administrador</h2>
            <form onSubmit={handleLogin}>
                {/* Campos de formulario */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc' }}
                    />
                </div>
                {error && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>{error}</p>}
                <button 
                    type="submit" 
                    disabled={isLoggingIn}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: isLoggingIn ? '#6c757d' : '#0056b3', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: isLoggingIn ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoggingIn ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;