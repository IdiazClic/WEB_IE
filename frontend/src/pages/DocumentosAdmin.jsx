import axios from 'axios';
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 
const TIPOS_DOCUMENTO = ['PEI', 'PCI', 'Reglamento Interno', 'PAT', 'Plan Ambiental', 'Otros'];

function DocumentosAdmin() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipo, setTipo] = useState(TIPOS_DOCUMENTO[0]);
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje('');

        const token = localStorage.getItem('adminToken');
        if (!token || !archivo) {
            setMensaje({ type: 'error', text: 'Falta Token de Admin o el archivo PDF.' });
            setCargando(false);
            return;
        }
        
        // El Backend espera el archivo como 'file' (por nuestro middleware upload)
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('tipo_documento', tipo);
        formData.append('file', archivo); // 'file' es el nombre que usaremos para el PDF

        // 2. Adjuntar el archivo PDF
            if (archivo) {
                formData.append('documento', archivo); // <-- ¡USAR 'documento'!
            }
            
        try {
            // El Backend espera que el archivo sea enviado como 'file',
            // pero el middleware que creamos (upload.js) usa '.single('imagen')'
            // 🚨 NOTA: DEBEMOS CORREGIR EL MIDDLEWARE DE BACKEND
            // Para ser prácticos, usaremos 'imagen' aquí temporalmente.
            formData.append('imagen', archivo); // Usamos 'imagen' para que Multer lo capture

            const response = await axios.post(`${API_URL}/documentos`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setMensaje({ type: 'success', text: response.data.message });
        } catch (error) {
            const errMessage = error.response?.data?.message || 'Error al subir documento.';
            setMensaje({ type: 'error', text: `Fallo: ${errMessage}` });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #dc3545', borderRadius: '8px' }}>
            <h3>📄 Subir Documentos Institucionales</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Tipo de Documento:</label>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                        {TIPOS_DOCUMENTO.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Título / Nombre:</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Descripción (Opcional):</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Archivo PDF:</label>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setArchivo(e.target.files[0])} 
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
                    style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    {cargando ? 'Subiendo...' : 'Subir Documento'}
                </button>
            </form>
        </div>
    );
}

export default DocumentosAdmin;