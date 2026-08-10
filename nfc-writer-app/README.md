# Guardián NFC — app para escribir etiquetas

App de Android nativa (Kotlin + Jetpack Compose) para escribir y verificar las
URLs en tus etiquetas NFC, con la misma identidad visual del sitio (crema,
teal, coral). Reemplaza apps genéricas como "NFC Tools" con algo propio.

No está pensada para publicarse en Google Play — es para instalar directo en
1-2 celulares tuyos, gratis, sin cuenta de desarrollador.

## Qué hace

- **Escribir etiqueta**: pegas la URL de un perfil (la que copias desde
  `/admin` en el sitio principal, algo como
  `https://nfc-lost-person-help.vercel.app/t/abc123`), tocas "Escribir
  etiqueta", acercas la etiqueta NFC en blanco al teléfono, y queda grabada.
- **Leer etiqueta**: verifica qué URL tiene grabada una etiqueta ya escrita,
  sin necesitar la app del sitio.

## Requisitos

- Un celular Android con NFC (la gran mayoría desde ~2015 lo tienen).
- [Android Studio](https://developer.android.com/studio) instalado en tu
  computadora (gratis). La primera vez que lo abras, descarga el SDK de
  Android automáticamente — no necesitas instalar nada más a mano.

## Instalar en tu celular (opción más simple)

1. Abre Android Studio → **Open** → selecciona esta carpeta (`nfc-writer-app`).
2. Espera a que termine de sincronizar (la primera vez puede tardar varios
   minutos mientras descarga cosas).
3. En tu celular: activa **Opciones de desarrollador** (Ajustes → Acerca del
   teléfono → toca 7 veces "Número de compilación") y dentro de ahí activa
   **Depuración USB**.
4. Conecta el celular a la computadora por cable USB. Si aparece un aviso en
   el celular preguntando si confías en esta computadora, acepta.
5. En Android Studio, tu celular debería aparecer en el menú desplegable de
   dispositivos (arriba). Selecciónalo y presiona el botón ▶ **Run**.
6. La app se instala y abre sola en tu celular. Ya puedes desconectar el
   cable — queda instalada permanentemente, como cualquier otra app.

Repite los pasos 3-5 con el segundo celular cuando lo tengas a mano.

## Alternativa: compartir un archivo APK

Si prefieres no conectar cada celular por cable (por ejemplo, para mandarle
la app a alguien más):

1. En Android Studio: **Build → Build App Bundle(s) / APK(s) → Build APK(s)**.
2. Cuando termine, aparece un enlace "locate" — ahí está el archivo
   `app-debug.apk`.
3. Mándaselo al celular (por WhatsApp, correo, USB, lo que sea) y ábrelo
   directamente en el teléfono.
4. Android va a pedir permiso para "instalar apps de fuentes desconocidas" —
   es normal al no venir de Google Play, actívalo solo para esa instalación.

## Notas

- La app no se conecta a internet ni a Firebase — solo lee/escribe el chip
  NFC directamente. No necesita ninguna de las variables de entorno del sitio
  principal.
- `minSdk` es 26 (Android 8.0+), cubre prácticamente cualquier teléfono
  razonablemente reciente.
- Este proyecto no se compiló ni probó automáticamente en esta sesión (no
  había Android SDK instalado en la máquina) — si algo no compila al abrirlo
  en Android Studio, dime el error exacto y lo corrijo.
