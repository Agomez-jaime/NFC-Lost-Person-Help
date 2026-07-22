# Etiqueta NFC de ayuda (para personas con discapacidad)

Sitio web que se abre al escanear una etiqueta NFC (o un código QR de respaldo).
Muestra información breve y segura sobre la persona, permite que quien la
encontró comparta su ubicación, y abre un chat anónimo con el cuidador — sin
mostrar nunca el número de teléfono de nadie.

Todo corre en servicios gratuitos en la nube (Vercel + Firebase + Telegram).
Una vez desplegado, **funciona 24/7 aunque tu computadora esté apagada** — tu
computadora solo se usa para escribir y desplegar el código.

---

## Cómo funciona (resumen)

1. La etiqueta NFC (o el QR impreso) apunta a `https://tu-app.vercel.app/t/<tagId>`.
2. Quien la encuentra escanea/toca con su celular → se abre la página en el
   navegador, sin instalar nada. Ve el nombre, una nota de cuidado (la que tú
   escribas) y un botón para compartir su ubicación.
3. Al compartir ubicación, tú (el cuidador) recibes al instante un mensaje de
   **Telegram** con un enlace de Google Maps — funciona como una notificación
   de SMS, pero gratis.
4. Quien encontró a la persona también puede escribir un mensaje en la misma
   página. Tú respondes directamente desde Telegram, y tu respuesta aparece en
   el chat de esa persona. Nunca se comparte tu número de teléfono ni el suyo.
5. Los datos de cada búsqueda (ubicación + chat) se borran automáticamente
   después de 48 horas.

> **Nota sobre Telegram**: pediste algo "gratis, idealmente SMS o WhatsApp".
> El SMS real y la API de negocio de WhatsApp cuestan dinero a partir de
> cierto uso. Telegram logra el mismo resultado (notificación instantánea al
> celular del cuidador, respuesta directa) de forma completamente gratuita e
> ilimitada, así que se usó como reemplazo.

---

## Requisitos previos

Todo esto es gratis y no requiere tarjeta de crédito para lo que usaremos:

- Una cuenta de [Firebase](https://firebase.google.com/) (usa tu cuenta de Google).
- Una cuenta de [Telegram](https://telegram.org/) (para crear el bot y para que
  cada cuidador reciba mensajes).
- Una cuenta de [Vercel](https://vercel.com/) (puedes entrar con GitHub).
- [Node.js](https://nodejs.org/) 18+ instalado si quieres probarlo en tu
  computadora antes de desplegarlo.
- Un teléfono con NFC (la mayoría de Android e iPhone desde hace varios años)
  y unas etiquetas NFC en blanco (se consiguen muy baratas en línea, ej.
  "NTAG213 NFC stickers").

---

## Paso 1 — Crear el proyecto de Firebase

1. Ve a https://console.firebase.google.com/ → **Agregar proyecto** → dale
   cualquier nombre (ej. "ayuda-nfc") → puedes desactivar Google Analytics, no
   se necesita.
2. En el menú lateral, ve a **Firestore Database** → **Crear base de datos** →
   elige **Modo de producción** → elige cualquier región cercana a ti.
3. Ve a **Configuración del proyecto** (ícono de engranaje) → pestaña **Cuentas
   de servicio** → botón **Generar nueva clave privada**. Se descargará un
   archivo `.json`. Guárdalo, lo necesitarás en el Paso 3. **No lo subas a
   ningún repositorio público.**

De ese archivo usarás tres valores:
- `project_id` → variable `FIREBASE_PROJECT_ID`
- `client_email` → variable `FIREBASE_CLIENT_EMAIL`
- `private_key` → variable `FIREBASE_PRIVATE_KEY` (incluye los `\n`, cópialo tal cual)

---

## Paso 2 — Crear el bot de Telegram

1. En Telegram, busca **@BotFather** y abre el chat.
2. Envía `/newbot`, dale un nombre y un usuario terminado en `bot` (ej.
   `AyudaNFCBot`).
3. BotFather te dará un **token** (algo como `123456:ABC-...`) → variable
   `TELEGRAM_BOT_TOKEN`.
4. Anota también el usuario del bot (sin la `@`) → variable
   `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`.

---

## Paso 3 — Desplegar en Vercel

1. Sube esta carpeta a un repositorio de GitHub (puede ser privado).
2. En https://vercel.com/, **Add New → Project** → importa ese repositorio.
3. Antes de desplegar, agrega estas variables de entorno (Settings →
   Environment Variables), usando tus propios valores:

   | Variable | Valor |
   |---|---|
   | `FIREBASE_PROJECT_ID` | del archivo de Firebase |
   | `FIREBASE_CLIENT_EMAIL` | del archivo de Firebase |
   | `FIREBASE_PRIVATE_KEY` | del archivo de Firebase (con los `\n`) |
   | `TELEGRAM_BOT_TOKEN` | de BotFather |
   | `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | usuario del bot, sin `@` |
   | `TELEGRAM_WEBHOOK_SECRET` | invéntate una cadena larga y aleatoria |
   | `ADMIN_PASSWORD` | la contraseña que usarás para entrar a `/admin` |
   | `ADMIN_SESSION_SECRET` | invéntate otra cadena larga y aleatoria |
   | `CRON_SECRET` | invéntate otra cadena larga y aleatoria |
   | `NEXT_PUBLIC_APP_URL` | se pone después de desplegar, ej. `https://tu-app.vercel.app` |

4. Despliega. Cuando tengas la URL final, actualiza `NEXT_PUBLIC_APP_URL` con
   esa URL y vuelve a desplegar (Redeploy).

---

## Paso 4 — Conectar el bot de Telegram con tu sitio (webhook)

Una sola vez, ejecuta este comando (reemplaza los valores entre `<>`), desde
cualquier terminal con `curl`:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -d "url=https://<tu-app>.vercel.app/api/telegram/webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

Debe responder `{"ok":true,...}`.

---

## Paso 5 — Crear tus 2 etiquetas en el panel del cuidador

1. Abre `https://<tu-app>.vercel.app/admin` y entra con `ADMIN_PASSWORD`.
2. Botón **"+ Crear nueva etiqueta"** → escribe el nombre y la información que
   verá quien encuentre a la persona (evita poner dirección de casa o datos
   financieros — solo lo esencial: condición, si es no verbal, alergias, etc.).
3. Repite para la segunda persona/etiqueta.
4. Cada tarjeta muestra la URL de la etiqueta y un código QR — puedes imprimir
   el QR como respaldo por si el NFC falla.

---

## Paso 6 — Vincular el Telegram del cuidador (una vez por etiqueta)

1. En la tarjeta de cada perfil en `/admin`, haz clic en **"Vincular esta
   etiqueta con Telegram"**.
2. Se abrirá Telegram con el bot — envía `/start` (ya viene prellenado).
3. El bot confirmará: *"✅ Vinculado correctamente a [Nombre]"*. Desde ahora,
   ese chat de Telegram recibirá las notificaciones de esa etiqueta y podrá
   responder directamente ahí.

---

## Paso 7 — Grabar las etiquetas NFC físicas

1. Instala una app gratuita como **NFC Tools** (Android / iPhone).
2. Abre la app → **Escribir** → **Agregar un registro** → **URL/URI** → pega
   la URL de esa persona (ej. `https://tu-app.vercel.app/t/abc123`).
3. Acerca el celular a la etiqueta NFC en blanco y confirma la escritura.
4. Prueba escaneando la etiqueta con otro celular (o el mismo, en modo avión
   para simular a un desconocido) para confirmar que abre la página correcta.

---

## Cómo probarlo de extremo a extremo

1. Abre la URL de una etiqueta en el celular del "cuidador" primero y vincula
   Telegram (Paso 6).
2. Abre la misma URL en **otro** celular o navegador (simulando a quien la
   encuentra) → toca "Compartir mi ubicación" → confirma que llega el mensaje
   de Telegram con el enlace de Google Maps.
3. Escribe un mensaje en la página del "buscador" → confirma que llega a
   Telegram.
4. Responde desde Telegram → confirma que el mensaje aparece en la página del
   "buscador" (puede tardar hasta ~3 segundos, revisa cada pocos segundos).

## Desarrollo local (opcional)

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev
```

Para probar el webhook de Telegram en local necesitarías exponer tu máquina a
internet (ej. con `ngrok`) — para el uso normal no hace falta, esto es solo
para desarrollo.

---

## Privacidad y borrado automático

- Nunca se muestra el número de teléfono ni el usuario de Telegram del
  cuidador a quien encuentra a la persona, ni viceversa.
- La ubicación se captura solo cuando el buscador toca el botón (no hay
  rastreo continuo en segundo plano).
- Un trabajo diario (`/api/cron/cleanup`, programado en `vercel.json`) borra
  automáticamente las sesiones (ubicación + chat) de más de 48 horas.
- El panel `/admin` está protegido con una contraseña compartida — suficiente
  para uso personal con 2 etiquetas; si en el futuro esto crece a muchas
  familias, se necesitaría un sistema de cuentas propio por familia.

## Limitaciones actuales / posibles mejoras futuras

- Solo Telegram como canal de notificación al cuidador (no SMS/WhatsApp real,
  por costo). Se podría agregar Twilio más adelante si se acepta el costo.
- Sin rastreo continuo de ubicación (a propósito, por privacidad y batería).
- Sin sistema de cuentas para múltiples familias — pensado para las 2
  etiquetas iniciales.
#   N F C - L o s t - P e r s o n - H e l p  
 