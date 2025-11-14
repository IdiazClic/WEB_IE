import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 
const GRADOS = ['Inicial 3 años', 'Inicial 4 años', 'Inicial 5 años', '1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado'];

function ContactoPage() {
    const [formData, setFormData] = useState({
        tipo_solicitud: 'Matrícula Nueva',
        nombre_apoderado: '',
        dni_apoderado: '',
        nombre_estudiante: '',
        grado_solicitado: GRADOS[0],
        telefono: '',
        email: ''
    });
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);
        setMensaje(null);

        try {
            const response = await axios.post(`${API_URL}/contacto/submit`, formData);
            setMensaje({ type: 'success', text: response.data.message });
            // Opcional: limpiar el formulario
            setFormData({ ...formData, nombre_apoderado: '', dni_apoderado: '', nombre_estudiante: '', telefono: '', email: '' });
        } catch (error) {
            const errMessage = error.response?.data?.message || 'Error al enviar la solicitud. Intente más tarde.';
            setMensaje({ type: 'error', text: errMessage });
        } finally {
            setCargando(false);
        }
    };
    
    // Estilos muy básicos para el formulario
    const formContainerStyle = {
        padding: '20px', 
        border: '1px solid #0056b3', 
        borderRadius: '8px', 
        marginBottom: '20px'
    };
    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px' };

    return (
        <div>
            <h2>📞 Contacto y E-Channels</h2>
            <p>Utilice nuestros formularios para trámites de matrícula y renovación.</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
                
                {/* 1. Formulario de Selección de Tipo de Solicitud */}
                <div style={{ flex: 1 }}>
                    <h3>Tipo de Trámite</h3>
                    <select
                        name="tipo_solicitud"
                        value={formData.tipo_solicitud}
                        onChange={handleChange}
                        style={{ ...inputStyle, fontSize: '1.1em', backgroundColor: '#e9ecef' }}
                    >
                        <option value="Matrícula Nueva">Solicitud de Matrícula (2026)</option>
                        <option value="Renovación 2026">Renovación de Matrícula (2026)</option>
                    </select>

                    <h3 style={{ marginTop: '30px', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>
                        {formData.tipo_solicitud === 'Matrícula Nueva' ? 'Solicitar Matrícula' : 'Renovar Matrícula'}
                    </h3>

                    {mensaje && (
                        <p style={{ color: mensaje.type === 'success' ? 'green' : 'red', fontWeight: 'bold' }}>
                            {mensaje.text}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} style={formContainerStyle}>
                        <h4>Datos del Apoderado</h4>
                        <input type="text" name="nombre_apoderado" placeholder="Nombre Apoderado" value={formData.nombre_apoderado} onChange={handleChange} required style={inputStyle} />
                        <input type="text" name="dni_apoderado" placeholder="DNI Apoderado" value={formData.dni_apoderado} onChange={handleChange} required style={inputStyle} />
                        
                        <h4>Datos del Estudiante</h4>
                        <input type="text" name="nombre_estudiante" placeholder="Nombre Estudiante" value={formData.nombre_estudiante} onChange={handleChange} required style={inputStyle} />
                        
                        {/* El grado solo es relevante para matrícula nueva */}
                        {formData.tipo_solicitud === 'Matrícula Nueva' && (
                            <select name="grado_solicitado" value={formData.grado_solicitado} onChange={handleChange} required style={inputStyle}>
                                <option value="">Seleccione Grado</option>
                                {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        )}
                        
                        <h4>Contacto</h4>
                        <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} style={inputStyle} />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} />
                        
                        <button 
                            type="submit" 
                            disabled={cargando}
                            style={{ width: '100%', padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                            {cargando ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </form>
                </div>
                
                {/* 2. Información de Contacto Adicional */}
                <div style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Información Adicional</h3>
                    <p><strong>Teléfono:</strong> [Número de la IE]</p>
                    <p><strong>Email:</strong> [Correo de la IE]</p>
                    <p><strong>Dirección:</strong> [Dirección de la IE]</p>
                    <iframe 
                        src="https://www.ie.edu/es/business-school/noticias-y-eventos/que-esta-pasando/ie-joins-google-indoor-maps/" 
                        width="100%" 
                        height="300" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        title="Ubicación I.E."
                    />
                </div>
            </div>
        </div>
    );
}

export default ContactoPage;