import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const API_URL = "http://localhost/brasa_house_backend/api";

const Carrito = () => {
  const { items, cambiarCantidad, quitarItem, vaciarCarrito, total } = useCarrito();
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioBrasaHouse') || 'null');

  const [tipoPago, setTipoPago] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(null);

  const confirmarPedido = async () => {
    if (!usuarioActivo) {
      alert('Debes iniciar sesión para confirmar el pedido');
      return;
    }
    if (!tipoPago) {
      alert('Selecciona un método de pago');
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API_URL}/pedidos.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idusuario: usuarioActivo.idusuario,
          tipopago: tipoPago,
          items: items.map(i => ({ idplato: i.idplato, cantidad: i.cantidad, precio: i.precio })),
        }),
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setConfirmado(datos);
        vaciarCarrito();
      } else {
        alert(`⚠️ ${datos.error || 'No se pudo confirmar el pedido'}`);
      }
    } catch (error) {
      alert('⚠️ No se pudo conectar con el servidor');
    } finally {
      setEnviando(false);
    }
  };

  if (confirmado) {
    return (
      <section style={{ minHeight: '80vh', backgroundColor: '#0f0f0f', paddingTop: '140px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ color: '#4ade80', fontSize: '2rem' }}>✅ Pedido confirmado</h2>
        <p style={{ marginTop: '15px', color: '#aaa' }}>N° de pedido: {confirmado.idpedido}</p>
        <p style={{ color: '#F7B41A', fontSize: '1.4rem', fontWeight: '700', marginTop: '10px' }}>Total: S/ {confirmado.total.toFixed(2)}</p>
        <Link to="/menu" className="btn-primary" style={{ display: 'inline-block', marginTop: '30px', padding: '14px 35px' }}>
          Volver al Menú
        </Link>
      </section>
    );
  }

  return (
    <section style={{ minHeight: '80vh', backgroundColor: '#0f0f0f', paddingTop: '120px', paddingBottom: '80px', color: '#fff' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
        <h2 className="section-title">Tu <span>Carrito</span></h2>

        {!usuarioActivo && (
          <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '25px', textAlign: 'center' }}>
            <p style={{ color: '#F7B41A', marginBottom: '10px' }}>Debes iniciar sesión para confirmar tu pedido</p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '10px 25px' }}>Iniciar Sesión</Link>
          </div>
        )}

        {items.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>Tu carrito está vacío. <Link to="/menu" style={{ color: '#F7B41A' }}>Ver el menú</Link></p>
        ) : (
          <>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '25px' }}>
              {items.map(item => (
                <div key={item.idplato} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', borderBottom: '1px solid #2a2a2a' }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>{item.nombre}</p>
                    <p style={{ color: '#F7B41A' }}>S/ {item.precio.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => cambiarCantidad(item.idplato, item.cantidad - 1)} style={qtyBtnStyle}>-</button>
                    <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(item.idplato, item.cantidad + 1)} style={qtyBtnStyle}>+</button>
                    <button onClick={() => quitarItem(item.idplato)} style={{ ...qtyBtnStyle, background: '#ef4444', marginLeft: '10px' }}>🗑</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'right', marginBottom: '20px' }}>
                Total: <span style={{ color: '#F7B41A' }}>S/ {total.toFixed(2)}</span>
              </p>

              <label style={{ display: 'block', marginBottom: '10px', color: '#ccc' }}>Método de pago <span style={{ color: '#F7B41A' }}>*</span></label>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                <button onClick={() => setTipoPago('Tarjeta')} style={pagoBtnStyle(tipoPago === 'Tarjeta')}>💳 Tarjeta</button>
                <button onClick={() => setTipoPago('Efectivo')} style={pagoBtnStyle(tipoPago === 'Efectivo')}>💵 Efectivo</button>
              </div>

              <button
                onClick={confirmarPedido}
                disabled={enviando || !tipoPago || !usuarioActivo}
                className="btn-primary"
                style={{ width: '100%', padding: '18px', fontSize: '1.2rem', opacity: (enviando || !tipoPago || !usuarioActivo) ? 0.5 : 1, cursor: (enviando || !tipoPago || !usuarioActivo) ? 'not-allowed' : 'pointer' }}
              >
                {enviando ? 'Procesando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const qtyBtnStyle = {
  background: '#333', color: 'white', border: 'none', width: '30px', height: '30px',
  borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
};

const pagoBtnStyle = (activo) => ({
  flex: 1, padding: '16px', borderRadius: '10px', border: activo ? '2px solid #F7B41A' : '2px solid #333',
  background: activo ? '#F7B41A22' : '#252525', color: activo ? '#F7B41A' : '#ccc',
  fontWeight: '600', cursor: 'pointer', fontSize: '1rem'
});

export default Carrito;
