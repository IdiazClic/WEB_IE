// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 0',
    backgroundColor: '#0056b3', // Color institucional
    color: 'white'
  };
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  return (
    <header style={navStyle}>
      <Link to="/" style={linkStyle}>WEB_IE N° 82212</Link>
      <Link to="/quienes-somos" style={linkStyle}>Quienes Somos</Link>
      <Link to="/noticias" style={linkStyle}>Noticias</Link>
      <Link to="/documentos" style={linkStyle}>Documentos</Link>
      <Link to="/contacto" style={linkStyle}>Contacto</Link>
      <Link to="/login" style={linkStyle}>🔐 Admin</Link>
    </header>
  );
}

export default Header;