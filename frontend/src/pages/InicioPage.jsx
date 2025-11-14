import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

// Componente para una tarjeta de noticia
const NoticiaCard = ({ noticia }) => (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#fff' }}>
        <h4 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>{noticia.titulo}</h4>
        <p style={{ fontSize: '14px', color: '#666' }}>{noticia.resumen}...</p>
        <span style={{ fontSize: '12px', color: 'gray' }}>
            Publicado: {new Date(noticia.fecha_pub).toLocaleDateString()}
        </span>
    </div>
);

// Componente para un cuadro de documento
const DocumentoCuadro = ({ doc }) => {
    // La función de descarga es la misma que usamos en DocumentosPage
    const handleDownload = (url, nombre) => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = `${nombre}_${doc.tipo_documento}.pdf`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            style={{ 
                border: '1px solid #00a65a', 
                padding: '10px', 
                borderRadius: '4px', 
                textAlign: 'center', 
                cursor: 'pointer',
                backgroundColor: '#e6fffa'
            }}
            onClick={() => handleDownload(doc.archivo_url, doc.nombre)}
        >
            <h5 style={{ margin: '0', color: '#00a65a' }}>{doc.tipo_documento}</h5>
            <p style={{ fontSize: '12px', margin: '5px 0' }}>{doc.nombre}</p>
            <span style={{ fontSize: '10px', color: '#333' }}>Descargar ⬇️</span>
        </div>
    );
};


function InicioPage() {
    const [data, setData] = useState({
        settings: {},
        noticias: [],
        documentos: []
    });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Ejecutamos varias peticiones GET al iniciar la página
        const fetchData = async () => {
            try {
                const [settingsRes, noticiasRes, documentosRes] = await Promise.all([
                    axios.get(`${API_URL}/config`),
                    axios.get(`${API_URL}/noticias`),
                    axios.get(`${API_URL}/documentos`)
                ]);

                setData({
                    settings: settingsRes.data,
                    noticias: noticiasRes.data.data ? noticiasRes.data.data.slice(0, 3) : [], // Mostrar solo 3 noticias
                    documentos: documentosRes.data ? documentosRes.data.slice(0, 5) : [] // Mostrar los primeros 5 documentos
                });
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    if (cargando) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando página principal...</div>;

    const imagenInstitucionalUrl = data.settings.imagen_institucional || 'https://via.placeholder.com/1200x400?text=Imagen+Institucional';
    const logro = data.settings.logro || 'Institución reconocida por su innovación educativa.';
    const historiaBreve = data.settings.historia_breve || 'La historia de nuestra I.E. es un compromiso constante con la excelencia educativa...';

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            
            {/* 1. SECCIÓN PRINCIPAL: Imagen Institucional y Logro */}
            <div style={{ marginBottom: '40px' }}>
                <img 
                    src={imagenInstitucionalUrl} 
                    alt="Imagen Institucional" 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                />
                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center', borderBottom: '3px solid #0056b3' }}>
                    <h2>🌟 Logro Destacado: {logro}</h2>
                </div>
            </div>

            {/* 2. SECCIÓN DE HISTORIA Y BIENVENIDA */}
            <div style={{ padding: '0 50px 40px 50px' }}>
                <h3 style={{ color: '#0056b3' }}>Bienvenido a la I.E. N° 82212 “Pedro Paulet Mostajo”</h3>
                <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                    {historiaBreve}
                </p>
                <Link to="/quienes-somos" style={{ color: '#dc3545', fontWeight: 'bold', textDecoration: 'none' }}>
                    Leer Historia Completa »
                </Link>
            </div>
            
            {/* Separador de Contenido */}
            <hr style={{ margin: '40px 0' }}/>

            {/* 3. SECCIÓN DE NOTICIAS Y DOCUMENTOS */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', padding: '0 50px' }}>
                
                {/* NOTICIAS (Actividades y Eventos) */}
                <div>
                    <h3 style={{ color: '#0056b3', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>📰 Últimas Noticias y Eventos</h3>
                    {data.noticias.length > 0 ? (
                        data.noticias.map(n => <NoticiaCard key={n.id} noticia={n} />)
                    ) : (
                        <p>No hay noticias recientes para mostrar.</p>
                    )}
                    <Link to="/noticias" style={{ display: 'block', marginTop: '15px', color: '#0056b3' }}>
                        Ver todas las Actividades »
                    </Link>
                </div>

                {/* DOCUMENTOS CLAVE */}
                <div>
                    <h3 style={{ color: '#0056b3', borderBottom: '2px solid #ccc', paddingBottom: '5px' }}>📑 Documentos Clave (Descarga Rápida)</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {data.documentos.length > 0 ? (
                            data.documentos.map(d => <DocumentoCuadro key={d.id} doc={d} />)
                        ) : (
                            <p>No hay documentos institucionales clave listados.</p>
                        )}
                    </div>
                    <Link to="/documentos" style={{ display: 'block', marginTop: '15px', color: '#0056b3' }}>
                        Ver todos los Documentos »
                    </Link>
                </div>
            </div>

            {/* 4. SECCIÓN DE CONTACTO/MATRÍCULA */}
            <div style={{ background: '#0056b3', color: 'white', padding: '30px', textAlign: 'center', marginTop: '40px' }}>
                <h3>📢 ¡Solicita tu Matrícula 2026!</h3>
                <p>Usa nuestro canal electrónico para iniciar tu proceso de matrícula o renovación.</p>
                <Link to="/contacto" style={{ 
                    backgroundColor: '#dc3545', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '5px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold'
                }}>
                    Ir a E-Channels de Matrícula
                </Link>
            </div>

        </div>
    );
}

export default InicioPage;