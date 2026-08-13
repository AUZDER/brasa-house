import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "http://localhost/brasa_house_backend/api";

const Reservas = () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioBrasaHouse') || 'null');

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);

  const [formData, setFormData] = useState({
    personas: '2',
    hora: '',
    idmesa: '',
    ocasion: '',
    mensaje: ''
  });

  // Cada vez que cambian fecha u hora, consulta qué mesas están libres
  useEffect(() => {
    if (selectedDate && formData.hora) {
      setCargandoMesas(true);
      setFormData(prev => ({ ...prev, idmesa: '' }));
      fetch(`${API_URL}/mesas.php?fecha=${selectedDate}&hora=${formData.hora}`)
        .then(res => res.json())
        .then(data => {
          setMesasDisponibles(data);
          setCargandoMesas(false);
        })
        .catch(() => setCargandoMesas(false));
    } else {
      setMesasDisponibles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, formData.hora]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mesa que el usuario eligió (para saber su capacidad máxima)
  const mesaSeleccionada = mesasDisponibles.find(m => String(m.idmesa) === String(formData.idmesa));

  // Si cambia la mesa elegida, ajusta "personas" para que no exceda su capacidad
  useEffect(() => {
    if (mesaSeleccionada) {
      setFormData(prev => {
        const personasActuales = parseInt(prev.personas) || 1;
        if (personasActuales > mesaSeleccionada.capacidad || personasActuales < 1) {
          return { ...prev, personas: '1' };
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.idmesa]);

  const [enviando, setEnviando] = useState(false);

  // Campos obligatorios: hora, mesa y fecha seleccionada (nombre/teléfono ya vienen de la sesión)
  const formularioCompleto = formData.hora !== '' && formData.idmesa !== '' && selectedDate !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Por favor selecciona una fecha");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API_URL}/reservas.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idusuario: usuarioActivo.idusuario,
          idmesa: formData.idmesa,
          fecha: selectedDate,
          hora: formData.hora,
          personas: formData.personas,
          ocasion: formData.ocasion,
          mensaje: formData.mensaje,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        alert(`✅ Reserva confirmada para el ${selectedDate}`);
        setFormData({ personas: '2', hora: '', idmesa: '', ocasion: '', mensaje: '' });
        setSelectedDate(null);
      } else {
        alert(`⚠️ ${datos.error || 'No se pudo crear la reserva'}`);
      }
    } catch (error) {
      alert("⚠️ No se pudo conectar con el servidor. Verifica que XAMPP esté encendido.");
    } finally {
      setEnviando(false);
    }
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getDaysInMonth = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({ day, fullDate });
    }
    return days;
  };

  const days = getDaysInMonth();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // ---------- Si no hay sesión iniciada, pide loguearse ----------
  if (!usuarioActivo) {
    return (
      <section className="section" style={{ backgroundColor: '#0f0f0f', paddingTop: '120px', minHeight: '70vh' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <h2 className="section-title">Reserva tu <span>Mesa</span></h2>
          <div style={{ background: '#1a1a1a', padding: '50px 40px', borderRadius: '16px', marginTop: '40px' }}>
            <p style={{ fontSize: '1.3rem', color: '#F7B41A', fontWeight: '600', marginBottom: '15px' }}>
              Debe loguearse para poder reservar mesa
            </p>
            <p style={{ color: '#aaa', marginBottom: '30px' }}>
              Crea una cuenta o inicia sesión para continuar con tu reserva.
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', padding: '16px 40px', fontSize: '1.1rem' }}>
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ backgroundColor: '#0f0f0f', paddingTop: '120px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2 className="section-title">Reserva tu <span>Mesa</span></h2>
        <p style={{ color: '#F7B41A', marginBottom: '30px' }}>
          Reservando como: <strong>{usuarioActivo.nombres} {usuarioActivo.apellidos}</strong>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '70px' }}>

          {/* Calendario */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#F7B41A', fontSize: '1.8rem', cursor: 'pointer' }}>←</button>
              <h3 style={{ color: '#F7B41A' }}>{monthNames[currentMonth]} {currentYear}</h3>
              <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#F7B41A', fontSize: '1.8rem', cursor: 'pointer' }}>→</button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
              textAlign: 'center'
            }}>
              {['D','L','M','M','J','V','S'].map((d, i) => (
                <div key={i} style={{ color: '#666', fontSize: '0.95rem', padding: '8px 0' }}>{d}</div>
              ))}

              {days.map((date, index) => (
                date ? (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date.fullDate)}
                    style={{
                      padding: '16px 8px',
                      backgroundColor: selectedDate === date.fullDate ? '#F7B41A' : '#1f1f1f',
                      color: selectedDate === date.fullDate ? '#000' : '#fff',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: '0.3s',
                      border: selectedDate === date.fullDate ? '2px solid #fff' : 'none'
                    }}
                  >
                    {date.day}
                  </div>
                ) : <div key={index}></div>
              ))}
            </div>

            {selectedDate && (
              <p style={{ marginTop: '25px', color: '#F7B41A', fontWeight: '600', fontSize: '1.1rem' }}>
                ✓ Fecha seleccionada: {new Date(selectedDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            )}
          </div>

          {/* Formulario */}
          <div>
            <form onSubmit={handleSubmit} style={{ background: '#1a1a1a', padding: '40px', borderRadius: '16px' }}>
              <label style={labelStyle}>Hora <span style={{color: '#F7B41A'}}>*</span></label>
              <select name="hora" required value={formData.hora} onChange={handleChange} style={inputStyle}>
                <option value="">Hora</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:30">1:30 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
              </select>

              <label style={labelStyle}>Mesa <span style={{color: '#F7B41A'}}>*</span></label>
              {!selectedDate || !formData.hora ? (
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Selecciona una fecha y una hora para ver las mesas disponibles
                </p>
              ) : cargandoMesas ? (
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '18px' }}>Buscando mesas disponibles...</p>
              ) : mesasDisponibles.length === 0 ? (
                <p style={{ color: '#ef4444', fontSize: '0.95rem', marginBottom: '18px' }}>
                  ⚠️ No quedan mesas disponibles para esa fecha y hora. Elige otro horario.
                </p>
              ) : (
                <select name="idmesa" required value={formData.idmesa} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecciona una mesa</option>
                  {mesasDisponibles.map(m => (
                    <option key={m.idmesa} value={m.idmesa}>{m.numero} (hasta {m.capacidad} personas)</option>
                  ))}
                </select>
              )}

              <label style={labelStyle}>Personas <span style={{color: '#F7B41A'}}>*</span></label>
              {!mesaSeleccionada ? (
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Elige una mesa para ver cuántas personas puede recibir
                </p>
              ) : (
                <select name="personas" value={formData.personas} onChange={handleChange} style={inputStyle}>
                  {Array.from({ length: mesaSeleccionada.capacidad }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              )}

              <label style={labelStyle}>Tipo de ocasión</label>
              <select name="ocasion" value={formData.ocasion} onChange={handleChange} style={inputStyle}>
                <option value="">Tipo de ocasión</option>
                <option value="cumpleanos">Cumpleaños</option>
                <option value="aniversario">Aniversario</option>
                <option value="negocios">Negocios</option>
              </select>

              <label style={labelStyle}>Notas especiales</label>
              <textarea name="mensaje" placeholder="Notas especiales..." value={formData.mensaje} onChange={handleChange} style={{...inputStyle, height: '110px'}} />

              <p style={{color: '#888', fontSize: '0.85rem', marginTop: '-8px', marginBottom: '15px'}}>
                <span style={{color: '#F7B41A'}}>*</span> Campos obligatorios (incluye seleccionar una fecha en el calendario)
              </p>

              <button type="submit" disabled={enviando || !formularioCompleto} className="btn-primary" style={{width: '100%', padding: '18px', fontSize: '1.35rem', marginTop: '10px', opacity: (enviando || !formularioCompleto) ? 0.5 : 1, cursor: (enviando || !formularioCompleto) ? 'not-allowed' : 'pointer'}}>
                {enviando ? 'Enviando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const labelStyle = {
  display: 'block',
  color: '#ccc',
  fontSize: '0.9rem',
  marginBottom: '8px',
  fontWeight: '500'
};

const inputStyle = {
  width: '100%',
  padding: '16px',
  marginBottom: '18px',
  borderRadius: '10px',
  border: 'none',
  backgroundColor: '#252525',
  color: 'white',
  fontSize: '1.05rem'
};

export default Reservas;
