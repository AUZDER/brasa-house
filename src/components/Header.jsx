import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const Header = () => {
  const navigate = useNavigate();
  const { cantidadTotal } = useCarrito();
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioBrasaHouse') || 'null');

  const irASeccion = (id) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    const seccion = document.getElementById(id);
    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioBrasaHouse');
    navigate('/');
    window.location.reload();
  };

  return (
    <header>
      <div className="nav-container">
        <div className="logo">
          <span>Brasa</span> House
        </div>

        <div className="nav-links">
          <Link to="/" onClick={scrollToTop}>Inicio</Link>
          <Link to="/menu">Menú</Link>
          <a href="#promociones" onClick={(e) => {
            e.preventDefault();
            if (window.location.pathname !== '/') {
              window.location.href = '/#promociones';
            } else {
              document.getElementById('promociones').scrollIntoView({ behavior: 'smooth' });
            }
          }}>Promociones</a>
          <a href="#menu" onClick={(e) => {
            e.preventDefault();
            if (window.location.pathname !== '/') {
              window.location.href = '/#menu';
            } else {
              document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
            }
          }}>Platos Destacados</a>
          <a href="#contacto" onClick={(e) => { e.preventDefault(); irASeccion("contacto"); }}>Contacto</a>

          <Link to="/carrito" style={{ position: 'relative', display: 'flex', alignItems: 'center', fontSize: '1.3rem' }}>
            🛒
            {cantidadTotal > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-12px',
                background: '#F7B41A', color: 'black', borderRadius: '50%',
                fontSize: '0.7rem', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>{cantidadTotal}</span>
            )}
          </Link>

          {usuarioActivo ? (
            <>
              <span style={{ color: '#F7B41A', fontSize: '0.95rem' }}>Hola, {usuarioActivo.nombres}</span>
              <button
                onClick={cerrarSesion}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ddd',
                  fontSize: '1.08rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit'
                }}
                onMouseOver={(e) => { e.target.style.color = '#ffcc00'; }}
                onMouseOut={(e) => { e.target.style.color = '#ddd'; }}
              >
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}

          <Link to="/reservas" className="btn-reserve">
           Reservar Mesa
           <span style={{ fontSize: '1.3rem' }}>𓌉◯𓇋</span>
           </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
