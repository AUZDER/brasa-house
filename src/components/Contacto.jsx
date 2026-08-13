function Contacto() {

  return (

    <section id="contacto" className="contacto">

      <h2>Contáctanos</h2>

      <div className="contacto-grid">

        <div className="info">

          <h3>📍 Dirección</h3>
          <p>Av. Principal 123 - Lima</p>

          <h3>📞 Teléfono</h3>
          <p>+51 999 999 999</p>

          <h3>✉ Correo</h3>
          <p>contacto@brasahouse.com</p>

          <h3>🕒 Horario</h3>
          <p>Lunes a Domingo</p>
          <p>12:00 pm - 11:00 pm</p>

        </div>

        <form>

          <input
            type="text"
            placeholder="Nombre"
          />

          <input
            type="email"
            placeholder="Correo"
          />

          <textarea
            rows="6"
            placeholder="Escribe tu mensaje..."
          />

          <button>
            Enviar
          </button>

        </form>

      </div>

    </section>

  );

}

export default Contacto;