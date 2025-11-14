import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

function NoticiasPublicasPage() {
    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                // Petición GET a la API pública de Noticias
                const response = await axios.get(`${API_URL}/noticias`);
                
                // El backend devuelve un objeto con la clave 'data'
                if (response.data.data) {
                    setNoticias(response.data.data);
                }
                setCargando(false);

            } catch (err) {
                console.error("Error al cargar noticias:", err);
                setError('No se pudieron cargar las noticias. Intente más tarde.');
                setCargando(false);
            }
        };
        fetchNoticias();
    }, []);

    if (cargando) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando actividades y eventos...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#0056b3', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>📢 Noticias y Eventos Escolares</h2>
            
            {noticias.length === 0 ? (
                <p>Actualmente no hay noticias o eventos publicados.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {noticias.map((n) => (
                        <div 
                            key={n.id} 
                            style={{ 
                                border: '1px solid #ddd', 
                                borderRadius: '10px', 
                                overflow: 'hidden', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s'
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {/* Imagen de la Noticia */}
                            {n.imagen_url && (
                                <img 
                                    src={n.imagen_url} 
                                    alt={n.titulo} 
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                />
                            )}
                            
                            <div style={{ padding: '15px' }}>
                                <span style={{ fontSize: '12px', color: '#6c757d', display: 'block', marginBottom: '5px' }}>
                                    {new Date(n.fecha_pub).toLocaleDateString()}
                                </span>
                                <h3 style={{ color: '#0056b3', margin: '0 0 10px 0' }}>{n.titulo}</h3>
                                {/* Usamos dangerouslySetInnerHTML si el contenido viene con HTML, si no, solo el resumen */}
                                <p>{n.resumen}...</p> 
                                
                                {/* En un proyecto real, aquí navegarías a la página de detalle */}
                                <a href={`/noticias/${n.id}`} style={{ color: '#dc3545', fontWeight: 'bold', textDecoration: 'none' }}>
                                    Leer más »
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NoticiasPublicasPage;