import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

function QuienesSomosPage() {
    const [settings, setSettings] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [activeTab, setActiveTab] = useState(null); // 'mision' o 'vision'

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Petición GET a la nueva API pública
                const response = await axios.get(`${API_URL}/config`);
                
                // Parsear el JSON de directoras
                const data = response.data;
                data.directoras = JSON.parse(data.directoras); 
                
                setSettings(data);
                setCargando(false);
            } catch (error) {
                console.error("Error al cargar la información institucional:", error);
                setCargando(false);
            }
        };
        fetchSettings();
    }, []);

    if (cargando) return <div>Cargando información institucional...</div>;
    if (!settings) return <div>No se pudo cargar la información.</div>;

    // Estilos base para los cuadros
    const cardStyle = {
        padding: '20px',
        margin: '10px',
        border: '1px solid #0056b3',
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'center'
    };
    const activeCardStyle = {
        ...cardStyle,
        backgroundColor: '#0056b3',
        color: 'white',
        fontWeight: 'bold'
    };

    return (
        <div>
            <h2>📚 Quienes Somos - I.E. N° 82212</h2>
            <hr/>

            {/* Misión y Visión (Cuadros Interactivos) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                {/* Cuadro Misión */}
                <div 
                    style={activeTab === 'mision' ? activeCardStyle : cardStyle}
                    onClick={() => setActiveTab(activeTab === 'mision' ? null : 'mision')}
                >
                    Misión
                </div>

                {/* Cuadro Visión */}
                <div 
                    style={activeTab === 'vision' ? activeCardStyle : cardStyle}
                    onClick={() => setActiveTab(activeTab === 'vision' ? null : 'vision')}
                >
                    Visión
                </div>
            </div>

            {/* Contenido Misión/Visión */}
            {activeTab && (
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '30px' }}>
                    <h3>{activeTab === 'mision' ? 'Nuestra Misión' : 'Nuestra Visión'}</h3>
                    <p>{activeTab === 'mision' ? settings.mision : settings.vision}</p>
                </div>
            )}
            
            <hr/>

            {/* Historia y Directoras */}
            <h3>Historia de la Institución</h3>
            <p>{settings.historia_breve}</p>

            <h3>Directoras que pasaron por la I.E.</h3>
            <ul>
                {Object.entries(settings.directoras).map(([periodo, nombre]) => (
                    <li key={periodo}>**{periodo}**: {nombre}</li>
                ))}
            </ul>
        </div>
    );
}

export default QuienesSomosPage;