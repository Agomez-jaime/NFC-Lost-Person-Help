import { VinculoSymbol } from "@/components/BrandHeader";
import "./home.css";

function ShieldCheckIcon() {
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

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7.5-4.6-10-9.4C0.4 7.1 2.4 4 6 4c2 0 3.6 1.1 6 3.6C14.4 5.1 16 4 18 4c3.6 0 5.6 3.1 4 6.6C19.5 15.4 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
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

function CallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3.5c1 0 2.4 2 2.4 3s-1.2 1.6-1.2 2.6c0 2 3.7 5.7 5.7 5.7 1 0 1.6-1.2 2.6-1.2s3 1.4 3 2.4-2 2.5-3 2.5C10.5 18.5 5.5 13.5 5.5 8.5 5.5 7.5 5 5.5 6 3.5z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ColombiaFlag() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 30 20"
      aria-label="Bandera de Colombia"
      style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 2 }}
    >
      <rect width="30" height="20" fill="#FCD116" />
      <rect y="10" width="30" height="5" fill="#003893" />
      <rect y="15" width="30" height="5" fill="#CE1126" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
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
              <VinculoSymbol variant="coral" size={30} />
            </span>
            vínculo
            <span className="l-brand-sub">seguro</span>
          </a>
          <a className="l-btn l-btn-ghost l-btn-sm" href="/admin">
            Entrar
          </a>
        </div>
      </header>

      <section className="l-hero">
        <div className="l-hero-inner">
          <div className="l-hero-copy">
            <span className="l-badge">Vínculo · Seguro</span>
            <h1>
              Para estar <em>ahí</em>, incluso cuando no puedes.
            </h1>
            <p className="l-lede">
              Tecnología que conecta lo invisible con lo que importa. Un toque, y
              quien encuentre a tu familiar puede avisarte al instante —{" "}
              <strong>sin ver nunca tus datos privados</strong>.
            </p>
            <div className="l-hero-actions">
              <a className="l-btn l-btn-coral" href="#como-funciona">
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

      <section className="l-features" id="como-funciona">
        <div className="l-features-grid">
          <div className="l-feature">
            <span className="l-feature-icon">
              <ShieldCheckIcon />
            </span>
            <h3>Conecta al instante</h3>
            <p>Un toque y aparece lo que importa.</p>
          </div>
          <div className="l-feature">
            <span className="l-feature-icon">
              <LockIcon />
            </span>
            <h3>Privado y seguro</h3>
            <p>Solo tú decides qué información compartir.</p>
          </div>
          <div className="l-feature">
            <span className="l-feature-icon">
              <HeartIcon />
            </span>
            <h3>Hecho para durar</h3>
            <p>Diseños resistentes, para el día a día.</p>
          </div>
          <div className="l-feature">
            <span className="l-feature-icon">
              <SparkleIcon />
            </span>
            <h3>Discreto y con estilo</h3>
            <p>Cuidar no tiene que verse como cuidar.</p>
          </div>
        </div>
      </section>

      <section className="l-product">
        <div className="l-product-inner">
          <div className="l-product-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/product-necklace.png"
              alt="Dije en forma de corazón grabado con el mensaje 'toca con el celular si estoy perdida'"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/product-necklace-2.png"
              alt="Dije en forma de flor con el mismo grabado, en otro estilo"
            />
          </div>
          <div className="l-product-copy">
            <span className="l-badge">Discreto y con estilo</span>
            <h2>Un objeto que llevas puesto, no que escondes.</h2>
            <p>
              Cada dije se graba en el estilo que más le quede a cada persona, con
              un mensaje simple: "toca con el celular si estoy perdida". Nadie más
              lo va a notar, hasta que de verdad haga falta.
            </p>
          </div>
        </div>
      </section>

      <div className="l-phone-wrap">
        <div className="l-phone-card">
          <span className="l-phone-icon">
            <PhoneIcon />
          </span>
          <h2>Toca con el celular si estoy perdida.</h2>
          <p>Una ayuda rápida cuando más importa.</p>
        </div>
      </div>

      <section className="l-privacy">
        <div className="l-privacy-inner">
          <div className="l-privacy-card">
            <span className="l-privacy-icon">
              <CallIcon />
            </span>
            <div>
              <h3>Información que puedes compartir</h3>
              <p>Contacto de emergencia, ubicación, información médica, alergias y más.</p>
            </div>
          </div>
          <div className="l-privacy-card">
            <span className="l-privacy-icon">
              <GearIcon />
            </span>
            <div>
              <h3>Tú tienes el control</h3>
              <p>Activa, edita o desactiva la información cuando lo necesites.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="l-cta-wrap">
        <div className="l-cta">
          <h2>Un vínculo privado. Tranquilidad todos los días.</h2>
          <p>
            Cada etiqueta es personal para tu familia. Tú siempre puedes actualizar
            los datos de la tuya desde tu enlace privado.
          </p>
        </div>
      </div>

      <footer className="l-footer">
        <a
          className="l-btn l-btn-ghost l-btn-sm"
          href="https://www.instagram.com/vinculo.wear/"
          target="_blank"
          rel="noreferrer"
          style={{ marginBottom: 8 }}
        >
          <InstagramIcon /> @vinculo.wear
        </a>
        <p>
          © 2026 vínculo — hecho con amor ❤️ en Colombia <ColombiaFlag />.
        </p>
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
