import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Clave PÚBLICA de PRUEBA de Google reCAPTCHA (siempre aprueba).
// Reemplázala por la tuya en https://www.google.com/recaptcha/admin
const SITE_KEY_RECAPTCHA = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const API_URL = "http://localhost/brasa_house_backend/api";

const Login = () => {
  const [tab, setTab] = useState('cliente-login'); // 'cliente-login' | 'cliente-registro' | 'admin'
  const navigate = useNavigate();

  // ---------- LOGIN cliente ----------
  const [loginData, setLoginData] = useState({ correo: '', password: '' });
  const [errorLogin, setErrorLogin] = useState('');
  const [enviandoLogin, setEnviandoLogin] = useState(false);

  // ---------- REGISTRO cliente ----------
  const [regData, setRegData] = useState({ nombres: '', apellidos: '', correo: '', celular: '', password: '', confirmarPassword: '' });
  const [errorReg, setErrorReg] = useState('');
  const [mensajeReg, setMensajeReg] = useState('');
  const [enviandoReg, setEnviandoReg] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [verPasswordLogin, setVerPasswordLogin] = useState(false);

  // ---------- LOGIN admin ----------
  const [adminData, setAdminData] = useState({ username: '', password: '' });
  const [errorAdmin, setErrorAdmin] = useState('');

  // Cargar el script de reCAPTCHA solo cuando se necesita (pestaña de registro)
  useEffect(() => {
    if (tab === 'cliente-registro' && !document.getElementById('recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [tab]);

  const regexCelular = /^9\d{8}$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 signo
  const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[\]{};:,.<>?/]).{8,}$/;

  const loginCompleto = loginData.correo.trim() !== '' && loginData.password.trim() !== '';
  const passwordValida = regexPassword.test(regData.password);
  const passwordsCoinciden = regData.password !== '' && regData.password === regData.confirmarPassword;
  const registroCompleto =
    regData.nombres.trim() !== '' &&
    regData.apellidos.trim() !== '' &&
    regexCorreo.test(regData.correo) &&
    regexCelular.test(regData.celular) &&
    passwordValida &&
    passwordsCoinciden;
  const adminCompleto = adminData.username.trim() !== '' && adminData.password.trim() !== '';

  // ---------- Handlers LOGIN cliente ----------
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    setEnviandoLogin(true);
    try {
      const respuesta = await fetch(`${API_URL}/usuarios.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'login', ...loginData }),
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        localStorage.setItem('usuarioBrasaHouse', JSON.stringify(datos.usuario));
        navigate('/');
        window.location.reload();
      } else {
        setErrorLogin(datos.error || 'No se pudo iniciar sesión');
      }
    } catch (error) {
      setErrorLogin('No se pudo conectar con el servidor');
    } finally {
      setEnviandoLogin(false);
    }
  };

  // ---------- Handlers REGISTRO cliente ----------
  const handleRegChange = (e) => setRegData({ ...regData, [e.target.name]: e.target.value });

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setErrorReg('');
    setMensajeReg('');

    const recaptchaToken = window.grecaptcha ? window.grecaptcha.getResponse() : '';
    if (!recaptchaToken) {
      setErrorReg('Marca el reCAPTCHA antes de continuar');
      return;
    }

    setEnviandoReg(true);
    try {
      const respuesta = await fetch(`${API_URL}/usuarios.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'registro', ...regData, recaptcha: recaptchaToken }),
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setMensajeReg('✅ Cuenta creada correctamente, ya puedes iniciar sesión');
        setRegData({ nombres: '', apellidos: '', correo: '', celular: '', password: '', confirmarPassword: '' });
        if (window.grecaptcha) window.grecaptcha.reset();
        setTimeout(() => setTab('cliente-login'), 1500);
      } else {
        setErrorReg(datos.error || 'No se pudo registrar');
      }
    } catch (error) {
      setErrorReg('No se pudo conectar con el servidor');
    } finally {
      setEnviandoReg(false);
    }
  };

  // ---------- Handlers LOGIN admin ----------
  const handleAdminChange = (e) => setAdminData({ ...adminData, [e.target.name]: e.target.value });

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (adminData.username === 'admin' && adminData.password === '1234') {
      navigate('/admin');
    } else {
      setErrorAdmin('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#1a1a1a', padding: '50px 40px', borderRadius: '16px', width: '100%', maxWidth: '460px' }}>
        <h1 style={{ color: '#F7B41A', marginBottom: '10px', textAlign: 'center' }}>Brasa House</h1>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', marginTop: '20px' }}>
          <button onClick={() => setTab('cliente-login')} style={tabStyle(tab === 'cliente-login')}>Iniciar Sesión</button>
          <button onClick={() => setTab('cliente-registro')} style={tabStyle(tab === 'cliente-registro')}>Registrarme</button>
          <button onClick={() => setTab('admin')} style={tabStyle(tab === 'admin')}>Admin</button>
        </div>

        {tab === 'cliente-login' && (
          <form onSubmit={handleLoginSubmit}>
            <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>Inicia sesión para poder reservar una mesa</p>
            <input type="email" name="correo" placeholder="Correo electrónico" value={loginData.correo} onChange={handleLoginChange} style={inputStyle} required />
            <div style={{ position: 'relative' }}>
              <input
                type={verPasswordLogin ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={loginData.password}
                onChange={handleLoginChange}
                style={{ ...inputStyle, paddingRight: '50px' }}
                required
              />
              <button type="button" onClick={() => setVerPasswordLogin(!verPasswordLogin)} style={ojoStyle}>
                {verPasswordLogin ? '🙈' : '👁️'}
              </button>
            </div>
            {errorLogin && <p style={{ color: '#ef4444', margin: '10px 0' }}>{errorLogin}</p>}
            <button type="submit" disabled={!loginCompleto || enviandoLogin} style={btnStyle(!loginCompleto || enviandoLogin)}>
              {enviandoLogin ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        {tab === 'cliente-registro' && (
          <form onSubmit={handleRegSubmit}>
            <label style={labelStyle}>Nombres <span style={{ color: '#F7B41A' }}>*</span></label>
            <input type="text" name="nombres" value={regData.nombres} onChange={handleRegChange} style={inputStyle} required />

            <label style={labelStyle}>Apellidos <span style={{ color: '#F7B41A' }}>*</span></label>
            <input type="text" name="apellidos" value={regData.apellidos} onChange={handleRegChange} style={inputStyle} required />

            <label style={labelStyle}>Correo electrónico <span style={{ color: '#F7B41A' }}>*</span></label>
            <input type="email" name="correo" value={regData.correo} onChange={handleRegChange} style={inputStyle} required />
            {regData.correo && !regexCorreo.test(regData.correo) && (
              <p style={hintStyle}>Formato de correo inválido (ej: nombre@correo.com)</p>
            )}

            <label style={labelStyle}>Celular <span style={{ color: '#F7B41A' }}>*</span></label>
            <input type="tel" name="celular" placeholder="9XXXXXXXX" value={regData.celular} onChange={handleRegChange} style={inputStyle} required />
            {regData.celular && !regexCelular.test(regData.celular) && (
              <p style={hintStyle}>Debe tener 9 dígitos y empezar con 9</p>
            )}

            <label style={labelStyle}>Contraseña <span style={{ color: '#F7B41A' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPassword ? 'text' : 'password'}
                name="password"
                value={regData.password}
                onChange={handleRegChange}
                style={{ ...inputStyle, paddingRight: '50px' }}
                required
              />
              <button type="button" onClick={() => setVerPassword(!verPassword)} style={ojoStyle}>
                {verPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {regData.password && !passwordValida && (
              <p style={hintStyle}>Mínimo 8 caracteres, con al menos 1 mayúscula, 1 número y 1 signo (ej: !@#$%)</p>
            )}

            <label style={labelStyle}>Confirmar contraseña <span style={{ color: '#F7B41A' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={verConfirmar ? 'text' : 'password'}
                name="confirmarPassword"
                value={regData.confirmarPassword}
                onChange={handleRegChange}
                style={{ ...inputStyle, paddingRight: '50px' }}
                required
              />
              <button type="button" onClick={() => setVerConfirmar(!verConfirmar)} style={ojoStyle}>
                {verConfirmar ? '🙈' : '👁️'}
              </button>
            </div>
            {regData.confirmarPassword && !passwordsCoinciden && (
              <p style={hintStyle}>Las contraseñas no coinciden</p>
            )}

            <div className="g-recaptcha" data-sitekey={SITE_KEY_RECAPTCHA} style={{ margin: '15px 0' }}></div>

            {errorReg && <p style={{ color: '#ef4444', margin: '10px 0' }}>{errorReg}</p>}
            {mensajeReg && <p style={{ color: '#4ade80', margin: '10px 0' }}>{mensajeReg}</p>}

            <button type="submit" disabled={!registroCompleto || enviandoReg} style={btnStyle(!registroCompleto || enviandoReg)}>
              {enviandoReg ? 'Creando cuenta...' : 'Registrarme'}
            </button>
          </form>
        )}

        {tab === 'admin' && (
          <form onSubmit={handleAdminSubmit}>
            <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '0.9rem' }}>Panel Administrativo</p>
            <input type="text" name="username" placeholder="Usuario (admin)" value={adminData.username} onChange={handleAdminChange} style={inputStyle} required />
            <input type="password" name="password" placeholder="Contraseña (1234)" value={adminData.password} onChange={handleAdminChange} style={inputStyle} required />
            {errorAdmin && <p style={{ color: '#ef4444', margin: '10px 0' }}>{errorAdmin}</p>}
            <button type="submit" disabled={!adminCompleto} style={btnStyle(!adminCompleto)}>Iniciar Sesión</button>
            <p style={{ marginTop: '20px', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
              Usuario: <strong>admin</strong> | Contraseña: <strong>1234</strong>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const tabStyle = (activo) => ({
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '600',
  backgroundColor: activo ? '#F7B41A' : '#252525',
  color: activo ? 'black' : '#aaa',
});

const labelStyle = { display: 'block', color: '#ccc', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' };

const hintStyle = { color: '#fbbf24', fontSize: '0.8rem', marginTop: '-12px', marginBottom: '12px' };

const inputStyle = {
  width: '100%', padding: '16px', marginBottom: '18px', borderRadius: '10px',
  border: 'none', backgroundColor: '#252525', color: 'white', fontSize: '1.05rem', boxSizing: 'border-box'
};

const ojoStyle = {
  position: 'absolute',
  right: '14px',
  top: '16px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.1rem',
  padding: 0,
  lineHeight: 1
};

const btnStyle = (deshabilitado) => ({
  width: '100%', padding: '16px', backgroundColor: '#F7B41A', color: 'black', border: 'none',
  borderRadius: '50px', fontSize: '1.1rem', fontWeight: '700',
  cursor: deshabilitado ? 'not-allowed' : 'pointer', marginTop: '10px',
  opacity: deshabilitado ? 0.5 : 1,
});

export default Login;
