import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

function SolicitudesAdmin() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            setCargando(true);
            const token = localStorage.getItem('adminToken');
            
            if (!token) {
                setError('No autenticado. Por favor, inicie sesión.');
                setCargando(false);
                return;
            }

            try {
                // Ruta protegida que lista las solicitudes
                const response = await axios.get(`${API_URL}/contacto/admin`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setSolicitudes(response.data);
                setCargando(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar solicitudes.');
                setCargando(false);
            }
        };
        fetchSolicitudes();
    }, []);

    if (cargando) return <div>Cargando lista de solicitudes...</div>;
    if (error) return <div style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</div>;

    return (
        <div>
            <h2>📥 Bandeja de Solicitudes (Admin)</h2>
            <p>Total de solicitudes recibidas: **{solicitudes.length}**</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Tipo</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Estudiante</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Apoderado (DNI)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Grado</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {solicitudes.map(sol => (
                        <tr key={sol.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(sol.fecha_registro).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{sol.tipo_solicitud}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sol.nombre_estudiante}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sol.nombre_apoderado} ({sol.dni_apoderado})</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sol.grado_solicitado || 'N/A'}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px', color: sol.estado === 'Pendiente' ? 'orange' : 'green' }}>{sol.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SolicitudesAdmin;