import "./home.css";

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8-3.8 8-8.5 8c-1 0-1.9-.1-2.8-.4L4 21l1.4-4.1C4.5 15.5 4 13.8 4 12z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="landing">
      <header className="l-header">
        <div className="l-header-inner">
          <a className="l-brand" href="/">
            <span className="l-brand-icon">
              <ShieldIcon />
            </span>
            Guardián NFC
          </a>
          <a className="l-btn l-btn-ghost l-btn-sm" href="/admin">
            Entrar
          </a>
        </div>
      </header>

      <section className="l-hero">
        <div className="l-hero-inner">
          <div className="l-hero-copy">
            <span className="l-badge">
              <ShieldIcon /> Protección discreta y humana
            </span>
            <h1>Si tu ser querido se pierde, alguien podrá ayudarlo.</h1>
            <p className="l-lede">
              Cada etiqueta NFC tiene una página segura y privada. Cuando alguien la
              escanea, el cuidador recibe al instante su ubicación —{" "}
              <strong>sin mostrar nunca datos privados</strong>.
            </p>
            <div className="l-hero-actions">
              <a className="l-btn l-btn-teal" href="#como-funciona">
                Cómo funciona
              </a>
            </div>
            <p className="l-hero-note">
              Ideal para niños, adultos mayores y personas con discapacidad.
            </p>
          </div>
          <div className="l-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-family.jpg"
              alt="Una abuela sonríe mientras su nieta le da un beso en la mejilla"
            />
          </div>
        </div>
      </section>

      <section className="l-steps" id="como-funciona">
        <h2>Tres pasos, tranquilidad todos los días</h2>
        <div className="l-steps-grid">
          <div className="l-step-card">
            <div className="l-step-icon">
              <PhoneIcon />
            </div>
            <h3>1. Recibe tu etiqueta</h3>
            <p>Ya viene lista con el perfil de tu familiar. Puedes editar la nota y el teléfono cuando quieras.</p>
          </div>
          <div className="l-step-card">
            <div className="l-step-icon">
              <ShieldIcon />
            </div>
            <h3>2. Vincula tu Telegram</h3>
            <p>Desde tu celular, en menos de un minuto, para empezar a recibir las alertas.</p>
          </div>
          <div className="l-step-card">
            <div className="l-step-icon">
              <PinIcon />
            </div>
            <h3>3. Recibe la alerta</h3>
            <p>Si alguien la encuentra, te llega al instante un mensaje con su ubicación.</p>
          </div>
        </div>
      </section>

      <section className="l-privacy">
        <div className="l-privacy-inner">
          <div className="l-privacy-copy">
            <span className="l-lock-badge">
              <LockIcon />
            </span>
            <h2>Privacidad por diseño</h2>
            <p>
              Quien encuentra a la persona solo ve su nombre y la nota de cuidado que tú
              escribas — <strong>nunca tu número de teléfono</strong>. Puede escribirte un
              mensaje o compartir su ubicación, y tú respondes directo, sin que nadie vea
              tus datos.
            </p>
          </div>
          <div className="l-privacy-card">
            <ul>
              <li>
                <span className="l-privacy-icon">
                  <ChatIcon />
                </span>
                Chat anónimo, sin exponer tu número
              </li>
              <li>
                <span className="l-privacy-icon">
                  <PinIcon />
                </span>
                Ubicación enviada con un solo toque
              </li>
              <li>
                <span className="l-privacy-icon">
                  <ClockIcon />
                </span>
                Los datos se borran solos a las 48 horas
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="l-cta-wrap">
        <div className="l-cta">
          <h2>Un enlace privado. Tranquilidad todos los días.</h2>
          <p>
            Cada etiqueta es personal y gratuita para tu familia. Solo el cuidador
            principal puede crear o desactivar etiquetas — tú siempre puedes
            actualizar los datos de la tuya desde tu enlace privado.
          </p>
        </div>
      </div>

      <footer className="l-footer">
        <p>© 2026 Guardián NFC — hecho con amor ❤️ en Colombia 🇨🇴.</p>
        <p className="l-attribution">
          Foto de familia:{" "}
          <a href="https://www.freepik.com" target="_blank" rel="noreferrer">
            Freepik
          </a>
        </p>
      </footer>
    </div>
  );
}
