"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import BrandHeader from "@/components/BrandHeader";

type Support = "checking" | "supported" | "unsupported";
type Mode = "idle" | "writing" | "reading";

function PhotoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="8.5" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 17l5-5 3.5 3.5L17 10l3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10 9l5 3-5 3V9z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="7" cy="18" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="16" r="2.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.3 18V6.5L19.3 4v11.5" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12c0-4.4 3.8-8 8.5-8s8.5 3.6 8.5 8-3.8 8-8.5 8c-1 0-1.9-.1-2.8-.4L4 21l1.4-4.1C4.5 15.5 4 13.8 4 12z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RecuerdosView() {
  const [support, setSupport] = useState<Support>("checking");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSupport(typeof window !== "undefined" && "NDEFReader" in window ? "supported" : "unsupported");
  }, []);

  function cancel() {
    abortRef.current?.abort();
    abortRef.current = null;
    setMode("idle");
  }

  async function handleWrite(e: FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setStatus(null);
    setMode("writing");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const ndef = new NDEFReader();
      await ndef.write({ records: [{ recordType: "url", data: trimmed }] }, { signal: controller.signal });
      setStatus({ text: "✅ Etiqueta escrita correctamente.", isError: false });
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setStatus({ text: describeError(err), isError: true });
      }
    } finally {
      setMode("idle");
      abortRef.current = null;
    }
  }

  async function handleRead() {
    setStatus(null);
    setMode("reading");
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const ndef = new NDEFReader();
      await ndef.scan({ signal: controller.signal });
      ndef.onreading = (event) => {
        const record = event.message.records[0];
        if (!record?.data) {
          setStatus({ text: "La etiqueta está vacía.", isError: true });
        } else {
          const text = new TextDecoder(record.encoding || "utf-8").decode(record.data);
          setStatus({ text: `Contenido actual:\n${text}`, isError: false });
        }
        controller.abort();
        setMode("idle");
        abortRef.current = null;
      };
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setStatus({ text: describeError(err), isError: true });
      }
      setMode("idle");
      abortRef.current = null;
    }
  }

  return (
    <main className="page recuerdos-theme">
      <BrandHeader sub="recuerdos" variant="lavender" />

      {support === "unsupported" && (
        <div className="card">
          <h1>No disponible en este navegador</h1>
          <p>
            Esta función usa la Web NFC API, que solo funciona en <strong>Chrome para
            Android</strong>. Abre este enlace desde Chrome en un celular Android.
          </p>
        </div>
      )}

      {support === "supported" && (
        <>
          <div className="card">
            <h1>Toca. Y aparece el recuerdo.</h1>
            <p className="muted">
              Guarda lo que quieres recordar y llévalo contigo. Pega el enlace a la
              memoria (fotos, video, música o un mensaje) y acerca la etiqueta al
              celular.
            </p>

            <div className="icon-row">
              <div className="icon-row-item">
                <PhotoIcon />
                <span>Fotos</span>
              </div>
              <div className="icon-row-item">
                <VideoIcon />
                <span>Videos</span>
              </div>
              <div className="icon-row-item">
                <MusicIcon />
                <span>Música</span>
              </div>
              <div className="icon-row-item">
                <MessageIcon />
                <span>Mensajes</span>
              </div>
            </div>

            <form onSubmit={handleWrite}>
              <div className="field">
                <label htmlFor="url">Enlace del recuerdo</label>
                <input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={mode !== "idle"}
                />
              </div>
              {mode === "idle" && (
                <button className="btn-primary" type="submit" disabled={!url.trim()}>
                  Escribir etiqueta
                </button>
              )}
            </form>

            {mode === "idle" && (
              <button
                className="btn-secondary"
                style={{ marginTop: 10, width: "100%" }}
                onClick={handleRead}
              >
                Leer etiqueta (verificar)
              </button>
            )}

            {mode !== "idle" && (
              <div className="card" style={{ background: "var(--v-coral-wash)", marginTop: 12 }}>
                <p style={{ fontWeight: 600, color: "var(--v-coral-dark)" }}>
                  {mode === "writing" ? "Acerca la etiqueta al teléfono…" : "Acerca la etiqueta para leerla…"}
                </p>
                <button className="btn-secondary" style={{ marginTop: 10 }} onClick={cancel}>
                  Cancelar
                </button>
              </div>
            )}

            {status && (
              <p className={status.isError ? "error-text" : "muted"} style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
                {status.text}
              </p>
            )}
          </div>

          <p className="footer-note">
            Necesita permiso de NFC la primera vez — acéptalo cuando el navegador lo pida.
          </p>
        </>
      )}
    </main>
  );
}

function describeError(err: unknown): string {
  const name = (err as Error)?.name;
  if (name === "NotAllowedError") {
    return "Se denegó el permiso de NFC. Revisa los permisos del sitio en Chrome e intenta de nuevo.";
  }
  if (name === "NotSupportedError") {
    return "El NFC no está disponible en este dispositivo o está desactivado.";
  }
  return `Error: ${(err as Error)?.message ?? "intenta de nuevo"}`;
}
