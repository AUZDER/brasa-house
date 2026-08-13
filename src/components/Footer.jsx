import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0a0a0a', padding: '80px 0 40px', textAlign: 'center' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px', marginBottom: '50px' }}>
          
          <div>
            <div className="logo" style={{ fontSize: '26px', marginBottom: '15px' }}>
              <span>Brasa</span> House
            </div>
            <p>El mejor sabor a la brasa en Lima.</p>
          </div>

          <div>
            <h4>Nuestras Redes</h4>
            <p>Facebook | Instagram | TikTok</p>
          </div>

          <div>
            <h4>Libro de Reclamaciones</h4>
            <p>Libros de Reclamaciones</p>
          </div>
        </div>

        <p style={{ color: '#666', marginTop: '40px' }}>
          © 2026 Brasa House - Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
};

export default Footer;