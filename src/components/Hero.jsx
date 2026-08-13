import React from 'react';
import portada from '../assets/img/brasa_house_imagen_portada_header.png';

const Hero = () => {
  return (
    <section
  className="hero"
  id="inicio"
  style={{
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
      url(${portada})
    `,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
      <div className="hero-content">
        <h1>FUEGO QUE UNE</h1>
        <h1 className="subtitle">SABOR QUE ENAMORA...</h1>
        <button className="btn-primary">Reservar Mesa</button>
      </div>
    </section>
  );
};

export default Hero;