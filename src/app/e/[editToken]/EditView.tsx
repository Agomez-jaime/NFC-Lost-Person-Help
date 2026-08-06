"use client";

import { useEffect, useState } from "react";
import BrandHeader from "@/components/BrandHeader";

interface EditData {
  firstName: string;
  careNote: string;
  emergencyPhone: string;
  telegramLinked: boolean;
  telegramLinkedCount: number;
  telegramLinkUrl: string | null;
}

type Status = "loading" | "ready" | "not_found" | "error";

export default function EditView({ editToken }: { editToken: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<EditData | null>(null);
  const [firstName, setFirstName] = useState("");
  const [careNote, setCareNote] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/edit/${editToken}`);
        if (res.status === 404) {
          if (!cancelled) setStatus("not_found");
          return;
        }
        if (!res.ok) {
          if (!cancelled) setStatus("error");
          return;
        }
        const json: EditData = await res.json();
        if (cancelled) return;
        setData(json);
        setFirstName(json.firstName);
        setCareNote(json.careNote);
        setEmergencyPhone(json.emergencyPhone ?? "");
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [editToken]);

  async function save() {
    if (!firstName.trim() || !careNote.trim()) {
      setError("El nombre y la información son obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/edit/${editToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, careNote, emergencyPhone }),
      });
      if (!res.ok) {
        setError("No se pudo guardar. Intenta de nuevo.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <main className="page">
        <p>Cargando...</p>
      </main>
    );
  }

  if (status === "not_found") {
    return (
      <main className="page">
        <BrandHeader />
        <div className="card">
          <h1>Enlace no válido</h1>
          <p>Este enlace de edición no existe o ya no está activo.</p>
        </div>
      </main>
    );
  }

  if (status === "error" || !data) {
    return (
      <main className="page">
        <BrandHeader />
        <div className="card">
          <h1>No se pudo cargar la página</h1>
          <p>Intenta de nuevo en un momento.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <BrandHeader />
      <div className="card">
        <h1>Editar el perfil de {data.firstName}</h1>
        <p className="muted">
          Este enlace es privado, solo para tu familia. Aquí puedes actualizar el
          nombre, la nota de cuidado y el teléfono que ve quien encuentre a la
          persona. El enlace de la etiqueta NFC no cambia.
        </p>

        <div className="field" style={{ marginTop: 16 }}>
          <label>Nombre</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="field">
          <label>Información para quien la encuentre (sin dirección de casa)</label>
          <textarea rows={4} value={careNote} onChange={(e) => setCareNote(e.target.value)} />
        </div>
        <div className="field">
          <label>Teléfono de emergencia (opcional, queda visible públicamente en la etiqueta)</label>
          <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary" onClick={save} disabled={saving}>
          {saved ? "Guardado ✅" : saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <div className="card">
        <h2>Notificaciones por Telegram</h2>
        <p className="muted">
          {data.telegramLinked
            ? `Telegram vinculado ✅ (${data.telegramLinkedCount} ${data.telegramLinkedCount === 1 ? "chat" : "chats"} recibiendo avisos). Puedes vincular otro celular más, por ejemplo el de otro familiar, sin quitar los que ya están.`
            : "Todavía no has vinculado Telegram. Sin este paso, no recibirás avisos cuando alguien escanee la etiqueta."}
        </p>
        {data.telegramLinkUrl && (
          <a
            className="btn-secondary"
            style={{ display: "inline-block", marginTop: 8, textDecoration: "none" }}
            href={data.telegramLinkUrl}
            target="_blank"
            rel="noreferrer"
          >
            {data.telegramLinked ? "Vincular otro Telegram" : "Vincular Telegram"}
          </a>
        )}
      </div>
    </main>
  );
}
