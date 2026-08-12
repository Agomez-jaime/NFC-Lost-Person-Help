"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import BrandHeader from "@/components/BrandHeader";

type Support = "checking" | "supported" | "unsupported";
type Mode = "idle" | "writing" | "reading";

export default function WriteView() {
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
    <main className="page">
      <BrandHeader />

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
            <h1>Escribir etiqueta NFC</h1>
            <p className="muted">
              Pega la URL del perfil (la copias desde la tarjeta de esa persona más
              abajo en /admin) y acerca la etiqueta al celular.
            </p>
            <form onSubmit={handleWrite} style={{ marginTop: 12 }}>
              <div className="field">
                <label htmlFor="url">URL de la etiqueta</label>
                <input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://nfc-lost-person-help.vercel.app/t/abc123"
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
