import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; 

function DocumentosPage() {
    const [documentos, setDocumentos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchDocumentos = async () => {
            try {
                // Petición GET al Backend para listar documentos
                const response = await axios.get(`${API_URL}/documentos`);
                setDocumentos(response.data);
                setCargando(false);
            } catch (error) {
                console.error("Error al cargar documentos:", error);
                setCargando(false);
            }
        };
        fetchDocumentos();
    }, []);

    if (cargando) return <div>Cargando documentos institucionales...</div>;
    
    // Función para manejar la descarga
    const handleDownload = (url, nombre) => {
        // Al hacer clic, se abre directamente la URL pública de Firebase Storage, 
        // y el navegador gestiona la descarga si es un PDF.
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = `${nombre}.pdf`; // Sugiere el nombre de archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2>📑 Documentos Institucionales</h2>
            <p>Aquí puedes descargar los documentos oficiales de la I.E. N° 82212.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {documentos.length === 0 ? (
                    <p>No hay documentos disponibles para descarga.</p>
                ) : (
                    documentos.map((doc) => (
                        <div 
                            key={doc.id} 
                            style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                            onClick={() => handleDownload(doc.archivo_url, doc.nombre)}
                        >
                            <h4 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{doc.nombre} ({doc.tipo_documento})</h4>
                            <p>{doc.descripcion}</p>
                            <span style={{ fontSize: '12px', color: 'gray' }}>Publicado: {new Date(doc.fecha_publicacion).toLocaleDateString()}</span>
                            <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#dc3545' }}>
                                Tocar para Descargar (PDF) ⬇️
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default DocumentosPage;