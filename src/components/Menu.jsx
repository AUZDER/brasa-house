import React, { useState, useEffect } from 'react';
import { useCarrito } from '../context/CarritoContext';
import parrilladaMixta from '../assets/img/parrillada_mixta_para_2.jpg';
import bifeChorizo from '../assets/img/bife_de_chorizo_300g.jpg';
import tomahawk from '../assets/img/tomahawk_steak_950g.jpg';

import costillas from '../assets/img/costillas_bbq_+_chorizo.png';
import bifeParrilla from '../assets/img/bife_a_la_parrilla.png';
import parrillaClasica from '../assets/img/parrilla_clasica.png';

import polloParrilla from '../assets/img/pollo_a_la_parrilla.png';
import churrascoRes from '../assets/img/churrasco_de_res.png';
import bifeCerdo from '../assets/img/bife_de_cerdo.png';
import anticuchosRes from '../assets/img/anticuchos_de_res.png';
import chorizoParrillero from '../assets/img/chorizo_parrillero.png';
import filetePescado from '../assets/img/filete_de_pescado_a_la_parrilla.png';
import brochetasMixtas from '../assets/img/brochetas_mixtas.png';
import alitasBBQ from '../assets/img/alitas_bbq.png';
import salchichaParrillera from '../assets/img/salchicha_parrillera.png';

// Mapa: nombre de archivo (guardado en la base de datos) -> imagen importada
const imagenesPorArchivo = {
  'parrillada_mixta_para_2.jpg': parrilladaMixta,
  'bife_de_chorizo_300g.jpg': bifeChorizo,
  'tomahawk_steak_950g.jpg': tomahawk,
  'costillas_bbq_+_chorizo.png': costillas,
  'bife_a_la_parrilla.png': bifeParrilla,
  'parrilla_clasica.png': parrillaClasica,
  'pollo_a_la_parrilla.png': polloParrilla,
  'churrasco_de_res.png': churrascoRes,
  'bife_de_cerdo.png': bifeCerdo,
  'anticuchos_de_res.png': anticuchosRes,
  'chorizo_parrillero.png': chorizoParrillero,
  'filete_de_pescado_a_la_parrilla.png': filetePescado,
  'brochetas_mixtas.png': brochetasMixtas,
  'alitas_bbq.png': alitasBBQ,
  'salchicha_parrillera.png': salchichaParrillera,
};

const API_URL = "http://localhost/brasa_house_backend/api";

const Menu = () => {
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { agregarItem } = useCarrito();

  useEffect(() => {
    fetch(`${API_URL}/platos.php`)
      .then(res => res.json())
      .then(data => {
        setPlatos(data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const combos = platos.filter(p => p.categoria === 'combo');
  const principales = platos.filter(p => p.categoria === 'principal');

  const renderTarjeta = (plato) => {
    const agotado = plato.estado === 'Agotado';
    return (
      <div key={plato.idplato} style={{ background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', opacity: agotado ? 0.6 : 1, position: 'relative' }}>
        {agotado && (
          <span style={{
            position: 'absolute', top: '15px', right: '15px', background: '#ef4444', color: 'white',
            padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', zIndex: 1
          }}>Agotado</span>
        )}
        <img
          src={imagenesPorArchivo[plato.imagen]}
          alt={plato.nombre}
          style={{ width: '100%', height: '280px', objectFit: 'cover' }}
        />
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '8px' }}>{plato.nombre}</h3>
          <p style={{ color: '#aaa', marginBottom: '15px' }}>{plato.descripcion}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#F7B41A', fontSize: '1.6rem', fontWeight: '700' }}>S/ {plato.precio}</span>
            <button
              onClick={() => agregarItem(plato)}
              disabled={agotado}
              style={{
                background: agotado ? '#444' : '#F7B41A',
                color: agotado ? '#999' : 'black',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: agotado ? 'not-allowed' : 'pointer'
              }}
            >
              {agotado ? 'No disponible' : '🛒 Agregar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (cargando) {
    return (
      <div style={{ padding: '100px 40px', backgroundColor: '#0a0a0a', color: '#fff', textAlign: 'center' }}>
        <p>Cargando menú...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '100px 40px 80px', backgroundColor: '#0a0a0a', color: '#fff' }}>
      <h1 style={{ textAlign: 'center', color: '#F7B41A', marginBottom: '80px', fontSize: '3.2rem' }}>Nuestro Menú</h1>

      <div style={{ marginBottom: '90px' }}>
        <h2 style={{ color: '#F7B41A', marginBottom: '40px', textAlign: 'left', fontSize: '2.4rem' }}>Combos en Parrilla</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {combos.map(renderTarjeta)}
        </div>
      </div>

      <div>
        <h2 style={{ color: '#F7B41A', marginBottom: '40px', textAlign: 'left', fontSize: '2.4rem' }}>Platos Principales</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {principales.map(renderTarjeta)}
        </div>
      </div>
    </div>
  );
};

export default Menu;
