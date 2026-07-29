"use client";

import { useEffect, useState, type FormEvent } from "react";
import { QRCodeSVG } from "qrcode.react";
import BrandHeader from "@/components/BrandHeader";

interface Profile {
  tagId: string;
  editToken?: string;
  firstName: string;
  careNote: string;
  photoUrl?: string;
  emergencyPhone?: string;
  guardianChatId?: number;
  active: boolean;
}

type AuthState = "checking" | "authed" | "anon";

function extractEditToken(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, "");
  const marker = "/e/";
  const idx = trimmed.lastIndexOf(marker);
  return idx === -1 ? trimmed : trimmed.slice(idx + marker.length);
}

export default function AdminApp() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [creating, setCreating] = useState(false);
  const [familyCode, setFamilyCode] = useState("");
  const [familyCodeError, setFamilyCodeError] = useState<string | null>(null);

  async function loadProfiles() {
    const res = await fetch("/api/admin/profiles");
    if (res.status === 401) {
      setAuth("anon");
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setProfiles(data.profiles ?? []);
      setAuth("authed");
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      await loadProfiles();
    } else {
      setLoginError("Contraseña incorrecta.");
    }
  }

  function handleFamilyCode(e: FormEvent) {
    e.preventDefault();
    const token = extractEditToken(familyCode);
    if (!token) {
      setFamilyCodeError("Ingresa el código o pega el enlace que te compartieron.");
      return;
    }
    setFamilyCodeError(null);
    window.location.href = `/e/${token}`;
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth("anon");
    setProfiles([]);
  }

  if (auth === "checking") {
    return (
      <main className="page">
        <p>Cargando...</p>
      </main>
    );
  }

  if (auth === "anon") {
    return (
      <main className="page">
        <BrandHeader />
        <div className="card">
          <h1>Administrador</h1>
          <p className="muted">Para crear y administrar todas las etiquetas.</p>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {loginError && <p className="error-text">{loginError}</p>}
            <button className="btn-primary" type="submit">
              Entrar
            </button>
          </form>
        </div>

        <div className="card">
          <h2>¿Eres familia?</h2>
          <p className="muted">
            Ingresa el código o pega el enlace privado que te compartieron para
            editar el perfil de tu ser querido.
          </p>
          <form onSubmit={handleFamilyCode}>
            <div className="field">
              <label htmlFor="familyCode">Código o enlace</label>
              <input
                id="familyCode"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                placeholder="Ej: AbC123xyz o el link completo"
              />
            </div>
            {familyCodeError && <p className="error-text">{familyCodeError}</p>}
            <button className="btn-secondary" type="submit" style={{ width: "100%" }}>
              Entrar a mi enlace
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <BrandHeader />
      <div className="admin-header">
        <h1>Panel del cuidador</h1>
        <button className="btn-secondary" onClick={handleLogout}>
          Salir
        </button>
      </div>

      <div className="profile-list">
        {profiles.map((p) => (
          <ProfileCard key={p.tagId} profile={p} onUpdated={loadProfiles} />
        ))}
      </div>

      {creating ? (
        <NewProfileCard
          onDone={() => {
            setCreating(false);
            loadProfiles();
          }}
          onCancel={() => setCreating(false)}
        />
      ) : (
        <button className="btn-primary" onClick={() => setCreating(true)}>
          + Crear nueva etiqueta
        </button>
      )}
    </main>
  );
}

function tagUrl(tagId: string): string {
  const base =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base}/t/${tagId}`;
}

function botLink(tagId: string): string | null {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  if (!username) return null;
  return `https://t.me/${username}?start=${tagId}`;
}

function familyEditUrl(editToken?: string): string | null {
  if (!editToken) return null;
  const base =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "";
  return `${base}/e/${editToken}`;
}

function ProfileCard({ profile, onUpdated }: { profile: Profile; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [careNote, setCareNote] = useState(profile.careNote);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl ?? "");
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyPhone ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedFamily, setCopiedFamily] = useState(false);
  const url = tagUrl(profile.tagId);
  const linkUrl = botLink(profile.tagId);
  const familyUrl = familyEditUrl(profile.editToken);

  async function save(patch: Record<string, unknown>) {
    setSaving(true);
    try {
      await fetch(`/api/admin/profiles/${profile.tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      onUpdated();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>{profile.firstName}</h2>
      <p className="muted">{profile.active ? "Activa" : "Desactivada"}</p>

      <div className="tag-url">{url}</div>
      <button
        className="btn-secondary"
        style={{ marginTop: 8 }}
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copiado ✅" : "Copiar enlace"}
      </button>

      <div style={{ marginTop: 12 }}>
        <QRCodeSVG value={url} size={140} />
      </div>

      {familyUrl && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          <p className="muted" style={{ marginBottom: 6 }}>
            Enlace privado para que la familia edite nombre, nota y teléfono, y
            vincule su propio Telegram (no pueden ver otras etiquetas ni cambiar
            este link NFC):
          </p>
          <div className="tag-url">{familyUrl}</div>
          <button
            className="btn-secondary"
            style={{ marginTop: 8 }}
            onClick={() => {
              navigator.clipboard.writeText(familyUrl);
              setCopiedFamily(true);
              setTimeout(() => setCopiedFamily(false), 1500);
            }}
          >
            {copiedFamily ? "Copiado ✅" : "Copiar enlace para la familia"}
          </button>
        </div>
      )}

      <p className="muted" style={{ marginTop: 12 }}>
        {profile.guardianChatId
          ? "Telegram vinculado ✅"
          : "Telegram sin vincular todavía."}
      </p>
      {!profile.guardianChatId && linkUrl && (
        <p>
          <a href={linkUrl} target="_blank" rel="noreferrer">
            Vincular esta etiqueta con Telegram
          </a>
        </p>
      )}

      {editing ? (
        <div style={{ marginTop: 12 }}>
          <div className="field">
            <label>Nombre</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="field">
            <label>Información para quien la encuentre (sin dirección de casa)</label>
            <textarea rows={4} value={careNote} onChange={(e) => setCareNote(e.target.value)} />
          </div>
          <div className="field">
            <label>URL de foto (opcional)</label>
            <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          </div>
          <div className="field">
            <label>Teléfono de emergencia a mostrar (opcional)</label>
            <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              disabled={saving}
              onClick={() => save({ firstName, careNote, photoUrl, emergencyPhone })}
            >
              Guardar
            </button>
            <button className="btn-secondary" onClick={() => setEditing(false)}>
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            Editar
          </button>
          <button className="btn-secondary" onClick={() => save({ active: !profile.active })}>
            {profile.active ? "Desactivar" : "Activar"}
          </button>
        </div>
      )}
    </div>
  );
}

function NewProfileCard({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [careNote, setCareNote] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!firstName.trim() || !careNote.trim()) {
      setError("El nombre y la información son obligatorios.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, careNote, emergencyPhone }),
      });
      if (!res.ok) {
        setError("No se pudo crear la etiqueta.");
        return;
      }
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Nueva etiqueta</h2>
      <div className="field">
        <label>Nombre</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoFocus />
      </div>
      <div className="field">
        <label>Información para quien la encuentre (sin dirección de casa)</label>
        <textarea
          rows={4}
          value={careNote}
          onChange={(e) => setCareNote(e.target.value)}
          placeholder="Ej: No verbal, autismo. Por favor sé paciente y espera con él/ella."
        />
      </div>
      <div className="field">
        <label>Teléfono de emergencia a mostrar (opcional)</label>
        <input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} />
      </div>
      {error && <p className="error-text">{error}</p>}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-primary" disabled={saving} onClick={create}>
          Crear
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
