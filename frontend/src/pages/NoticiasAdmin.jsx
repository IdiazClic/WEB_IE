import axios from 'axios';
import React, { useState } from 'react';

// URL base de tu API (usamos la variable de entorno)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

function NoticiasAdmin() {
  // 🚨 ESTADOS: Aquí definimos todas las variables que cambian
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null); // <-- Estado para el archivo de imagen
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    // 1. Crear el objeto FormData (necesario para enviar archivos y texto)
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido_html', contenido);
    formData.append('es_evento', 'false'); 

    // 2. Obtener el token del Administrador
    const token = localStorage.getItem('adminToken');

    if (!token) {
        setMensaje({ type: 'error', text: 'Usuario no autenticado. Inicie sesión.' });
        setCargando(false);
        return;
    }

    // 3. Adjuntar el archivo de imagen (SOLO si existe)
    if (imagen) {
        // El nombre 'imagen' debe coincidir con 'upload.single('imagen')' del backend
        formData.append('imagen', imagen); 
    } else {
        setMensaje({ type: 'error', text: 'Debe seleccionar una imagen para la noticia.' });
        setCargando(false);
        return;
    }

    try {
        // 4. Enviar la petición POST al backend
        const response = await axios.post(`${API_URL}/noticias`, formData, {
            headers: {
                // Adjuntar el token de seguridad
                'Authorization': `Bearer ${token}`,
                // Axios gestiona el 'Content-Type' como multipart/form-data automáticamente con FormData
            },
        });

        setMensaje({ type: 'success', text: response.data.message });
        // Limpiar el formulario después del éxito
        setTitulo('');
        setContenido('');
        setImagen(null);
        document.getElementById('file-input').value = null; 

    } catch (error) {
        console.error("Error al subir noticia:", error.response || error);
        const errMessage = error.response?.data?.message || 'Error al comunicarse con el servidor o token inválido.';
        setMensaje({ type: 'error', text: `Fallo: ${errMessage}` });
    } finally {
        setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #007bff', borderRadius: '8px' }}>
      <h3>✍️ Publicar Nueva Noticia/Actividad (Admin)</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Título:</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Contenido (HTML/Texto):</label>
          <textarea value={contenido} onChange={(e) => setContenido(e.target.value)} required style={{ width: '100%', padding: '8px', minHeight: '150px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Imagen Destacada:</label>
          <input 
            type="file" 
            id="file-input"
            accept="image/*" 
            onChange={(e) => setImagen(e.target.files[0])} 
            required
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        {mensaje && (
          <p style={{ color: mensaje.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>
            {mensaje.text}
          </p>
        )}

        <button 
          type="submit" 
          disabled={cargando}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {cargando ? 'Publicando...' : 'Publicar Noticia'}
        </button>
      </form>
    </div>
  );
}

export default NoticiasAdmin;