// src/App.jsx (CÓDIGO CORREGIDO Y UNIFICADO)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; 

// --- IMPORTACIONES DE PÁGINAS ADMINISTRATIVAS ---
import LoginPage from './pages/LoginPage';
import NoticiasAdmin from './pages/NoticiasAdmin'; 
import SolicitudesAdmin from './pages/SolicitudesAdmin'; 
import DocumentosAdmin from './pages/DocumentosAdmin'; // <-- Asegúrate de que este archivo exista

// --- IMPORTACIONES DE PÁGINAS PÚBLICAS ---
import InicioPage from './pages/InicioPage'; 
import QuienesSomosPage from './pages/QuienesSomosPage';
import NoticiasPublicasPage from './pages/NoticiasPublicasPage';
import DocumentosPage from './pages/DocumentosPage';
import ContactoPage from './pages/ContactoPage'; 

// ----------------------------------------------------------------------
function App() {
    // ... (isAuthenticated y ProtectedRoute se mantienen igual)
    const isAuthenticated = () => {
        return localStorage.getItem('adminToken') !== null;
    };
    const ProtectedRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    return (
        <BrowserRouter>
            <Header /> 
            
            <main style={{ padding: '20px' }}>
                <Routes>
                    {/* Módulos Públicos */}
                    <Route path="/" element={<InicioPage />} />
                    <Route path="/quienes-somos" element={<QuienesSomosPage />} />
                    <Route path="/noticias" element={<NoticiasPublicasPage />} />
                    <Route path="/documentos" element={<DocumentosPage />} />
                    <Route path="/contacto" element={<ContactoPage />} />
                    
                    {/* Ruta de Login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Rutas Protegidas de Administración */}
                    <Route path="/admin" element={<ProtectedRoute><NoticiasAdmin /></ProtectedRoute>} />
                    <Route path="/admin/noticias" element={<ProtectedRoute><NoticiasAdmin /></ProtectedRoute>} />
                    
                    {/* Aquí usamos los nuevos componentes Admin */}
                    <Route path="/admin/documentos" element={<ProtectedRoute><DocumentosAdmin /></ProtectedRoute>} /> 
                    <Route path="/admin/solicitudes" element={<ProtectedRoute><SolicitudesAdmin /></ProtectedRoute>} /> 

                    <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;