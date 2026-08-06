"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import BrandHeader from "@/components/BrandHeader";

interface Profile {
  firstName: string;
  careNote: string;
  photoUrl?: string;
  emergencyPhone?: string;
}

interface ChatMessage {
  sender: "finder" | "guardian";
  text: string;
  createdAt: number;
}

type PageStatus = "loading" | "ready" | "not_found" | "error";
type LocationState = "idle" | "sharing" | "shared" | "denied" | "error";

export default function TagView({ tagId }: { tagId: string }) {
  const [status, setStatus] = useState<PageStatus>("loading");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [liveAccuracy, setLiveAccuracy] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetch(`/api/tag/${tagId}`);
        if (res.status === 404) {
          if (!cancelled) setStatus("not_found");
          return;
        }
        if (!res.ok) {
          if (!cancelled) setStatus("error");
          return;
        }
        const data: Profile = await res.json();
        if (cancelled) return;
        setProfile(data);

        const storageKey = `nfc_session_${tagId}`;
        let sid = sessionStorage.getItem(storageKey);
        if (!sid) {
          const createRes = await fetch("/api/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tagId }),
          });
          if (createRes.ok) {
            const createData = await createRes.json();
            sid = createData.sessionId ?? null;
            if (sid) sessionStorage.setItem(storageKey, sid);
          }
        }

        if (!cancelled) {
          setSessionId(sid);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [tagId]);

  useEffect(() => {
    if (!sessionId) return;

    async function poll() {
      try {
        const res = await fetch(`/api/session/${sessionId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages ?? []);
        }
      } catch {
        // ignore transient polling errors
      }
    }

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [sessionId]);

  function shareLocation() {
    if (!sessionId) return;
    if (!("geolocation" in navigator)) {
      setLocationState("error");
      return;
    }
    setLocationState("sharing");
    setLiveAccuracy(null);

    // GPS fixes tend to get more precise over the first several seconds, so we
    // sample readings briefly and keep the tightest one instead of settling
    // for whichever arrives first.
    const GOOD_ENOUGH_METERS = 12;
    const MAX_WAIT_MS = 12000;
    let best: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let settled = false;

    const finish = async () => {
      if (settled) return;
      settled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);

      if (!best) {
        setLocationState("error");
        return;
      }
      try {
        const res = await fetch(`/api/session/${sessionId}/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: best.coords.latitude,
            lng: best.coords.longitude,
            accuracy: best.coords.accuracy,
          }),
        });
        if (res.ok) {
          setLocationAccuracy(best.coords.accuracy);
          setLocationState("shared");
        } else {
          setLocationState("error");
        }
      } catch {
        setLocationState("error");
      }
    };

    const timeoutId = setTimeout(finish, MAX_WAIT_MS);

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!best || pos.coords.accuracy < best.coords.accuracy) {
          best = pos;
          setLiveAccuracy(pos.coords.accuracy);
        }
        if (pos.coords.accuracy <= GOOD_ENOUGH_METERS) {
          clearTimeout(timeoutId);
          finish();
        }
      },
      () => {
        clearTimeout(timeoutId);
        settled = true;
        setLocationState("denied");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: MAX_WAIT_MS }
    );
  }

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!sessionId || !text || sending) return;

    setSending(true);
    setInput("");
    setMessages((prev) => [...prev, { sender: "finder", text, createdAt: Date.now() }]);
    try {
      await fetch(`/api/session/${sessionId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } finally {
      setSending(false);
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
          <h1>Código no válido</h1>
          <p>
            Esta etiqueta no está activa. Si encontraste a una persona que parece
            perdida o confundida, por favor contacta a los servicios de emergencia
            locales.
          </p>
        </div>
      </main>
    );
  }

  if (status === "error" || !profile) {
    return (
      <main className="page">
        <BrandHeader />
        <div className="card">
          <h1>No se pudo cargar la página</h1>
          <p>
            Intenta de nuevo. Si esto es una emergencia, contacta a los servicios de
            emergencia locales.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <BrandHeader />
      <div className="card">
        {profile.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.photoUrl} alt={profile.firstName} className="photo" />
        )}
        <h1>Ayuda a {profile.firstName}</h1>
        <p className="note">{profile.careNote}</p>
        {profile.emergencyPhone && (
          <p className="emergency">
            Si es una emergencia médica, llama al <strong>{profile.emergencyPhone}</strong> o
            a los servicios de emergencia locales.
          </p>
        )}
      </div>

      <div className="card">
        <h2>1. Comparte tu ubicación</h2>
        <p className="muted">
          Esto ayuda al cuidador de {profile.firstName} a encontrarlo/a. Tu número de
          teléfono nunca se comparte.
        </p>
        <button className="btn-primary" onClick={shareLocation} disabled={locationState === "sharing"}>
          {locationState === "shared"
            ? "Ubicación enviada ✅ (toca para actualizar)"
            : locationState === "sharing"
              ? "Buscando la ubicación más precisa…"
              : "Compartir mi ubicación"}
        </button>
        {locationState === "sharing" && liveAccuracy != null && (
          <p className="muted" style={{ marginTop: 8 }}>
            Mejor lectura hasta ahora: ±{Math.round(liveAccuracy)} metros. Buscando algo más
            preciso…
          </p>
        )}
        {locationState === "shared" && locationAccuracy != null && (
          <p className="muted" style={{ marginTop: 8 }}>
            Precisión aproximada: ±{Math.round(locationAccuracy)} metros. Si estás en un
            lugar cerrado, salir al aire libre suele mejorarla.
          </p>
        )}
        {locationState === "denied" && (
          <p className="warn">
            No se pudo obtener tu ubicación. Revisa los permisos de ubicación del
            navegador e inténtalo de nuevo.
          </p>
        )}
        {locationState === "error" && (
          <p className="warn">Hubo un problema al enviar la ubicación. Intenta de nuevo.</p>
        )}
      </div>

      <div className="card">
        <h2>2. Escribe un mensaje</h2>
        <p className="muted">El mensaje llega directo al cuidador. Todo es anónimo.</p>
        <div className="chat">
          {messages.length === 0 && <p className="muted">Aún no hay mensajes.</p>}
          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.sender}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="chat-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe aquí..."
            maxLength={500}
          />
          <button type="submit" disabled={sending || !input.trim()}>
            Enviar
          </button>
        </form>
      </div>

      <p className="footer-note">
        Esta página es anónima y temporal. No se comparte ningún número de teléfono.
      </p>
    </main>
  );
}
