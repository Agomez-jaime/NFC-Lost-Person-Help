"use client";

import { useState } from "react";
import { VinculoSymbol } from "@/components/BrandHeader";
import "./home.css";

type Tab = "inicio" | "seguro" | "recuerdos" | "ruta";

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

function PhotoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 17l5-5 3.5 3.5L17 10l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 9l5 3-5 3V9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="7" cy="18" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="16" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.3 18V6.5L19.3 4v11.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8-3.8 8-8.5 8c-1 0-1.9-.1-2.8-.4L4 21l1.4-4.1C4.5 15.5 4 13.8 4 12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3s7 7.4 7 12a7 7 0 0 1-14 0c0-4.6 7-12 7-12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 2.5v2.6M12 18.9v2.6M21.5 12h-2.6M5.1 12H2.5M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8M18.6 18.6l-1.8-1.8M7.2 7.2 5.4 5.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WaveSignalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="19" r="1.3" fill="currentColor" />
      <path d="M5 14.5a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 9.5a12 12 0 0 1 12 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
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

const TAB_MARK: Record<Tab, "ink" | "coral" | "lavender" | "green"> = {
  inicio: "ink",
  seguro: "coral",
  recuerdos: "lavender",
  ruta: "green",
};

const TAB_LABEL: Record<Tab, string> = {
  inicio: "Inicio",
  seguro: "Seguro",
  recuerdos: "Recuerdos",
  ruta: "Ruta",
};

export default function HomePage() {
  const [tab, setTab] = useState<Tab>("inicio");

  return (
    <div className={`landing tab-${tab}`}>
      <header className="l-header">
        <div className="l-header-inner">
          <a className="l-brand" href="/">
            <span className="l-brand-icon">
              <VinculoSymbol variant={TAB_MARK[tab]} size={30} />
            </span>
            vínculo
          </a>
          <a className="l-btn l-btn-ghost l-btn-sm" href="/admin">
            Entrar
          </a>
        </div>
        <nav className="l-tabs" aria-label="Secciones de Vínculo">
          {(["inicio", "seguro", "recuerdos", "ruta"] as Tab[]).map((t) => (
            <button key={t} className={`l-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {TAB_LABEL[t]}
            </button>
          ))}
        </nav>
      </header>

      {tab === "inicio" && (
        <>
          <section className="l-hero">
            <div className="l-hero-inner l-hero-inner-solo">
              <div className="l-hero-copy">
                <span className="l-badge">La marca madre</span>
                <h1>La unión entre lo físico y lo invisible.</h1>
                <p className="l-lede">
                  Un objeto que llevas contigo y que, con un toque, conecta con algo
                  que importa. Vínculo es tecnología que desaparece para que lo humano
                  aparezca.
                </p>
                <div className="l-hero-actions">
                  <a className="l-btn l-btn-coral" href="#tres-mundos">
                    Conoce los tres mundos
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="l-features">
            <div className="l-features-grid l-features-grid-3">
              <div className="l-feature">
                <span className="l-feature-icon">
                  <HeartIcon />
                </span>
                <h3>Idea</h3>
                <p>Conexión. Un gesto simple — tocar — que revela lo que importa, cuando más importa.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <ShieldCheckIcon />
                </span>
                <h3>Promesa</h3>
                <p>Un toque basta para revelar lo que importa. Seguro. Privado. Sin apps ni pantallas de por medio.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <WaveSignalIcon />
                </span>
                <h3>Tecnología</h3>
                <p>NFC pasivo a 13,56 MHz. Invisible, sin batería, siempre listo. El medio, nunca el protagonista.</p>
              </div>
            </div>
          </section>

          <section id="tres-mundos">
            <div className="l-worlds">
              <span className="l-badge">Un mismo símbolo, tres mundos</span>
              <h2 className="l-worlds-title">Al ver cualquier producto, primero piensas "esto es Vínculo".</h2>
              <div className="l-worlds-grid">
                <button className="l-world-card l-world-card-coral" onClick={() => setTab("seguro")}>
                  <VinculoSymbol variant="coral" size={28} />
                  <h3>Seguro</h3>
                  <p>Protección. "Para estar ahí."</p>
                </button>
                <button className="l-world-card l-world-card-lavender" onClick={() => setTab("recuerdos")}>
                  <VinculoSymbol variant="lavender" size={28} />
                  <h3>Recuerdos</h3>
                  <p>Memoria. "Para volver a ese momento."</p>
                </button>
                <button className="l-world-card l-world-card-green" onClick={() => setTab("ruta")}>
                  <VinculoSymbol variant="green" size={28} />
                  <h3>Ruta</h3>
                  <p>Movimiento. "Muévete libre, sigue conectado."</p>
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "seguro" && (
        <>
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
                  <a className="l-btn l-btn-coral" href="#como-funciona-seguro">
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

          <section className="l-features" id="como-funciona-seguro">
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
        </>
      )}

      {tab === "recuerdos" && (
        <>
          <section className="l-hero">
            <div className="l-hero-inner">
              <div className="l-hero-copy">
                <span className="l-badge">Vínculo · Recuerdos</span>
                <h1>Para volver a ese momento.</h1>
                <p className="l-lede">
                  Fotos, videos, canciones, mensajes y voces — lo que quieres recordar,
                  siempre contigo. Toca, y aparece el recuerdo.
                </p>
                <div className="l-hero-actions">
                  <a className="l-btn l-btn-coral" href="/admin/recuerdos">
                    Escribir un recuerdo
                  </a>
                </div>
                <p className="l-hero-note">Emocional, pero nunca infantil.</p>
              </div>
              <div className="l-hero-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/recuerdos-product.jpg"
                  alt="Charm de flor negra en dorado junto a una tarjeta 'vínculo recuerdos, toca aquí para recordar'"
                />
              </div>
            </div>
          </section>

          <section className="l-features">
            <div className="l-features-grid">
              <div className="l-feature">
                <span className="l-feature-icon">
                  <PhotoIcon />
                </span>
                <h3>Fotos</h3>
                <p>El momento, siempre a la mano.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <VideoIcon />
                </span>
                <h3>Videos</h3>
                <p>Revive el instante completo.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <MusicIcon />
                </span>
                <h3>Música</h3>
                <p>La canción de ese momento.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <MessageIcon />
                </span>
                <h3>Mensajes</h3>
                <p>Una voz, una carta, un mensaje.</p>
              </div>
            </div>
          </section>

          <div className="l-cta-wrap">
            <div className="l-cta">
              <h2>Esto guarda una historia.</h2>
              <p>
                Flores, corazones, iniciales y formas de color — cada charm conecta con
                lo que más quieres recordar.
              </p>
            </div>
          </div>
        </>
      )}

      {tab === "ruta" && (
        <>
          <section className="l-hero">
            <div className="l-hero-inner">
              <div className="l-hero-copy">
                <span className="l-badge">Vínculo · Ruta</span>
                <h1>Muévete libre. Sigue conectado.</h1>
                <p className="l-lede">
                  Para ciclistas, runners, hikers y viajeros. Si algo pasa, estamos
                  cerca.
                </p>
                <div className="l-hero-actions">
                  <span className="l-coming-soon">Próximamente</span>
                </div>
                <p className="l-hero-note">La función gana al branding: hecho para sobrevivir en casco, moto y mochila.</p>
              </div>
              <div className="l-hero-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ruta-product.jpg"
                  alt="Sticker NFC 'toca aquí si necesito ayuda, vínculo ruta' en un casco de ciclismo"
                />
              </div>
            </div>
          </section>

          <section className="l-features">
            <div className="l-features-grid">
              <div className="l-feature">
                <span className="l-feature-icon">
                  <WaveSignalIcon />
                </span>
                <h3>Un toque</h3>
                <p>Conecta al instante.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <ShieldCheckIcon />
                </span>
                <h3>Seguro</h3>
                <p>Información confiable cuando más importa.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <DropIcon />
                </span>
                <h3>Resistente</h3>
                <p>Impermeable y hecho para el exterior.</p>
              </div>
              <div className="l-feature">
                <span className="l-feature-icon">
                  <SunIcon />
                </span>
                <h3>Visible</h3>
                <p>Colores y materiales de alta visibilidad.</p>
              </div>
            </div>
          </section>

          <div className="l-cta-wrap">
            <div className="l-cta">
              <h2>Más aventura, menos preocupación.</h2>
              <p>Estamos preparando esta línea. Vuelve pronto para más.</p>
            </div>
          </div>
        </>
      )}

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
          Fotos:{" "}
          <a href="https://www.freepik.com" target="_blank" rel="noreferrer">
            Freepik
          </a>
        </p>
      </footer>
    </div>
  );
}
