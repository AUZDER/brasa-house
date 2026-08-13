import React from 'react';
import costillas from '../assets/img/costillas_bbq_+_chorizo.png';
import bife from '../assets/img/bife_a_la_parrilla.png';
import parrilla from '../assets/img/parrilla_clasica.png';

const PlatosDestacados = () => {
  return (
    <section className="section" id="menu">
      <h2 className="section-title">Platos <span>Destacados</span></h2>
      
      <div className="cards-container">
        {/* Plato 1 */}
        <div className="card">
          <img src={costillas} alt="Costillas BBQ" />
          <div className="card-content">
            <h3>Costillas BBQ + Chorizo</h3>
            <p>Tiernas costillas glaseadas con chorizo y papas fritas.</p>
            <p className="price">S/ 32.90</p>
          </div>
        </div>

        {/* Plato 2 */}
        <div className="card">
          <img src={bife} alt="Bife a la Parrilla" />
          <div className="card-content">
            <h3>Bife a la Parrilla</h3>
            <p>Jugoso corte grillado con papitas doradas y salsa criolla fresca.</p>
            <p className="price">S/ 28.90</p>
          </div>
        </div>

        {/* Plato 3 */}
        <div className="card">
          <img src={parrilla} alt="Parrilla Clásica" />
          <div className="card-content">
            <h3>Parrilla Clásica</h3>
            <p>Mix de carnes, chorizos y vegetales grillados con salsas.</p>
            <p className="price">S/ 29.90</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatosDestacados;