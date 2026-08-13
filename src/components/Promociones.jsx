import React from 'react';
import parrillada from '../assets/img/parrillada_mixta_para_2.jpg';
import bifeChorizo from '../assets/img/bife_de_chorizo_300g.jpg';
import tomahawk from '../assets/img/tomahawk_steak_950g.jpg';

const Promociones = () => {
  return (
    <section className="section" style={{ backgroundColor: '#111' }} id="promociones">
      <h2 className="section-title">Promociones en <span>Combos</span></h2>
      
      <div className="cards-container">
        {/* Combo 1 */}
        <div className="card">
          <img src={parrillada} alt="Parrillada Mixta" />
          <div className="card-content">
            <h3>Parrillada Mixta para 2</h3>
            <p>Mejores cortes, chorizo y vegetales a la brasa.</p>
            <p className="price">S/ 119.90</p>
          </div>
        </div>

        {/* Combo 2 */}
        <div className="card">
          <img src={bifeChorizo} alt="Bife de Chorizo" />
          <div className="card-content">
            <h3>Bife de Chorizo 300g</h3>
            <p>Jugoso y tierno, con marcado perfecto a la parrilla.</p>
            <p className="price">S/ 49.90</p>
          </div>
        </div>

        {/* Combo 3 */}
        <div className="card">
          <img src={tomahawk} alt="Tomahawk Steak" />
          <div className="card-content">
            <h3>Tomahawk Steak 950g</h3>
            <p>Corte premium con hueso, grillado con intenso sabor ahumado.</p>
            <p className="price">S/ 89.90</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promociones;