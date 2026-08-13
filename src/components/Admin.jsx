import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost/brasa_house_backend/api";

const Admin = () => {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [dashboard, setDashboard] = useState({ reservasHoy: 0, mesasOcupadas: 0, mesasTotal: 0, clientesSemana: 0 });
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      const [resReservas, resMesas, resPlatos, resUsuarios, resDashboard] = await Promise.all([
        fetch(`${API_URL}/reservas.php`),
        fetch(`${API_URL}/mesas.php`),
        fetch(`${API_URL}/platos.php`),
        fetch(`${API_URL}/usuarios.php`),
        fetch(`${API_URL}/dashboard.php`),
      ]);
      setReservas(await resReservas.json());
      setMesas(await resMesas.json());
      setPlatos(await resPlatos.json());
      setUsuarios(await resUsuarios.json());
      setDashboard(await resDashboard.json());
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cambiarEstadoReserva = async (idreserva, estadoActual) => {
    const nuevoEstado = estadoActual === 'Confirmada' ? 'Pendiente' : 'Confirmada';
    try {
      await fetch(`${API_URL}/reservas.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idreserva, estado: nuevoEstado }),
      });
      setReservas(reservas.map(res =>
        res.idreserva === idreserva ? { ...res, estado: nuevoEstado } : res
      ));
    } catch (error) {
      alert("No se pudo actualizar la reserva");
    }
  };

  const cambiarEstadoMesa = async (idmesa, estadoActual) => {
    const nuevoEstado = estadoActual === 'Disponible' ? 'Ocupada' : 'Disponible';
    try {
      await fetch(`${API_URL}/mesas.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idmesa, estado: nuevoEstado }),
      });
      setMesas(mesas.map(mesa =>
        mesa.idmesa === idmesa ? { ...mesa, estado: nuevoEstado } : mesa
      ));
      const resDashboard = await fetch(`${API_URL}/dashboard.php`);
      setDashboard(await resDashboard.json());
    } catch (error) {
      alert("No se pudo actualizar la mesa");
    }
  };

  const cambiarEstadoPlato = async (idplato, estadoActual) => {
    const nuevoEstado = estadoActual === 'Disponible' ? 'Agotado' : 'Disponible';
    try {
      await fetch(`${API_URL}/platos.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idplato, estado: nuevoEstado }),
      });
      setPlatos(platos.map(p => (p.idplato === idplato ? { ...p, estado: nuevoEstado } : p)));
    } catch (error) {
      alert("No se pudo actualizar el plato");
    }
  };

  const cambiarBloqueoUsuario = async (idusuario, bloqueadoActual) => {
    const nuevoValor = bloqueadoActual == 1 ? 0 : 1;
    try {
      await fetch(`${API_URL}/usuarios.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idusuario, bloqueado: nuevoValor }),
      });
      setUsuarios(usuarios.map(u => (u.idusuario === idusuario ? { ...u, bloqueado: nuevoValor } : u)));
    } catch (error) {
      alert("No se pudo actualizar el usuario");
    }
  };

  if (cargando) {
    return (
      <div style={{ padding: '30px', backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff', textAlign: 'center' }}>
        <p style={{ marginTop: '100px' }}>Cargando datos del servidor...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ color: '#F7B41A', marginBottom: '10px' }}>Panel Administrativo</h1>
        <p style={{ color: '#aaa', marginBottom: '40px' }}>Brasa House - Gestión General</p>

        {/* Tarjetas de Resumen (datos reales) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h3>Reservas Hoy</h3>
            <h2 style={{ color: '#F7B41A', fontSize: '3rem' }}>{dashboard.reservasHoy}</h2>
          </div>
          <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h3>Mesas Ocupadas</h3>
            <h2 style={{ color: '#F7B41A', fontSize: '3rem' }}>{dashboard.mesasOcupadas} / {dashboard.mesasTotal}</h2>
          </div>
          <div style={{ background: '#1f1f1f', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h3>Clientes Esta Semana</h3>
            <h2 style={{ color: '#F7B41A', fontSize: '3rem' }}>{dashboard.clientesSemana}</h2>
          </div>
        </div>

        {/* Gestión de Reservas */}
        <h2 style={{ marginBottom: '20px', color: '#F7B41A' }}>Gestión de Reservas</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#222' }}>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Mesa</th>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Hora</th>
              <th style={thStyle}>Personas</th>
              <th style={thStyle}>Estado</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(res => (
              <tr key={res.idreserva} style={{ borderBottom: '1px solid #333' }}>
                <td style={tdStyle}>{res.nombre}</td>
                <td style={tdStyle}>{res.mesa || '—'}</td>
                <td style={tdStyle}>{res.fecha}</td>
                <td style={tdStyle}>{res.hora}</td>
                <td style={tdStyle}>{res.personas}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(res.estado === 'Confirmada' ? '#4ade80' : '#fbbf24')}>{res.estado}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button onClick={() => cambiarEstadoReserva(res.idreserva, res.estado)} style={btnAccionStyle}>Cambiar Estado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gestión de Mesas */}
        <h2 style={{ margin: '60px 0 20px', color: '#F7B41A' }}>Gestión de Mesas</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#222' }}>
              <th style={thStyle}>Mesa</th>
              <th style={thStyle}>Capacidad</th>
              <th style={thStyle}>Estado</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesas.map(mesa => (
              <tr key={mesa.idmesa} style={{ borderBottom: '1px solid #333' }}>
                <td style={tdStyle}>{mesa.numero}</td>
                <td style={tdStyle}>{mesa.capacidad} personas</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(mesa.estado === 'Disponible' ? '#4ade80' : '#ef4444')}>{mesa.estado}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button onClick={() => cambiarEstadoMesa(mesa.idmesa, mesa.estado)} style={btnAccionStyle}>Cambiar Estado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gestión de Platos */}
        <h2 style={{ margin: '60px 0 20px', color: '#F7B41A' }}>Gestión de Platos (Menú)</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#222' }}>
              <th style={thStyle}>Plato</th>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Precio</th>
              <th style={thStyle}>Estado</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platos.map(plato => (
              <tr key={plato.idplato} style={{ borderBottom: '1px solid #333' }}>
                <td style={tdStyle}>{plato.nombre}</td>
                <td style={tdStyle}>{plato.categoria === 'combo' ? 'Combo' : 'Principal'}</td>
                <td style={tdStyle}>S/ {plato.precio}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(plato.estado === 'Disponible' ? '#4ade80' : '#ef4444')}>{plato.estado}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button onClick={() => cambiarEstadoPlato(plato.idplato, plato.estado)} style={btnAccionStyle}>Cambiar Estado</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gestión de Usuarios */}
        <h2 style={{ margin: '60px 0 20px', color: '#F7B41A' }}>Gestión de Usuarios</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#222' }}>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Correo</th>
              <th style={thStyle}>Celular</th>
              <th style={thStyle}>Estado</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.idusuario} style={{ borderBottom: '1px solid #333' }}>
                <td style={tdStyle}>{u.nombres} {u.apellidos}</td>
                <td style={tdStyle}>{u.correo}</td>
                <td style={tdStyle}>{u.celular}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(u.bloqueado == 0 ? '#4ade80' : '#ef4444')}>{u.bloqueado == 0 ? 'Activo' : 'Bloqueado'}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <button
                    onClick={() => cambiarBloqueoUsuario(u.idusuario, u.bloqueado)}
                    style={{ ...btnAccionStyle, background: u.bloqueado == 0 ? '#ef4444' : '#4ade80' }}
                  >
                    {u.bloqueado == 0 ? 'Bloquear' : 'Desbloquear'}
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#666' }}>Aún no hay usuarios registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' };
const thStyle = { padding: '18px', textAlign: 'left' };
const tdStyle = { padding: '18px' };
const badgeStyle = (color) => ({ padding: '8px 18px', borderRadius: '20px', background: color, color: 'black', fontWeight: 'bold' });
const btnAccionStyle = {
  background: '#F7B41A', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px',
  cursor: 'pointer', fontWeight: '700', transition: 'all 0.3s ease'
};

export default Admin;
