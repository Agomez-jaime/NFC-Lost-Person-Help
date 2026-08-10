package com.guardiannfc.writer

import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageManager
import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.Ndef
import android.nfc.tech.NdefFormatable
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Brand palette, matching the Guardián NFC website.
private val Paper = Color(0xFFFAF4E7)
private val PaperRaised = Color(0xFFFFFFFF)
private val Ink = Color(0xFF182129)
private val InkSoft = Color(0xFF5B6672)
private val Teal = Color(0xFF1F6B62)
private val TealDeep = Color(0xFF133E3A)
private val TealWash = Color(0xFFE2EDE9)
private val Coral = Color(0xFFDD7E58)
private val CoralWash = Color(0xFFFBE6DA)
private val Line = Color(0xFFE7DDC7)

private enum class Mode { IDLE, WRITING, READING }

class MainActivity : ComponentActivity() {

    private var nfcAdapter: NfcAdapter? = null
    private var pendingIntent: PendingIntent? = null

    private val mode = mutableStateOf(Mode.IDLE)
    private val urlText = mutableStateOf("")
    private val status = mutableStateOf<StatusMessage?>(null)

    data class StatusMessage(val text: String, val isError: Boolean)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        nfcAdapter = NfcAdapter.getDefaultAdapter(this)
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            PendingIntent.FLAG_MUTABLE
        } else {
            0
        }
        pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            flags
        )

        setContent {
            WriterScreen(
                hasNfc = packageManager.hasSystemFeature(PackageManager.FEATURE_NFC),
                nfcEnabled = nfcAdapter?.isEnabled == true,
                mode = mode.value,
                urlText = urlText.value,
                status = status.value,
                onUrlChange = { urlText.value = it },
                onStartWrite = {
                    if (urlText.value.isNotBlank()) {
                        status.value = null
                        mode.value = Mode.WRITING
                        enableForegroundDispatch()
                    }
                },
                onStartRead = {
                    status.value = null
                    mode.value = Mode.READING
                    enableForegroundDispatch()
                },
                onCancel = {
                    mode.value = Mode.IDLE
                    nfcAdapter?.disableForegroundDispatch(this)
                },
                onOpenNfcSettings = {
                    startActivity(Intent(Settings.ACTION_NFC_SETTINGS))
                }
            )
        }
    }

    override fun onResume() {
        super.onResume()
        if (mode.value != Mode.IDLE) {
            enableForegroundDispatch()
        }
    }

    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    private fun enableForegroundDispatch() {
        val adapter = nfcAdapter ?: return
        if (!adapter.isEnabled) return
        adapter.enableForegroundDispatch(this, pendingIntent, null, null)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val tag: Tag = getTagFromIntent(intent) ?: return

        when (mode.value) {
            Mode.WRITING -> writeUrlToTag(tag, urlText.value.trim())
            Mode.READING -> readTag(tag)
            Mode.IDLE -> Unit
        }
    }

    @Suppress("DEPRECATION")
    private fun getTagFromIntent(intent: Intent): Tag? {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra(NfcAdapter.EXTRA_TAG, Tag::class.java)
        } else {
            intent.getParcelableExtra(NfcAdapter.EXTRA_TAG)
        }
    }

    private fun writeUrlToTag(tag: Tag, url: String) {
        if (url.isBlank()) {
            finishWith("Escribe primero la URL de la etiqueta.", isError = true)
            return
        }

        try {
            val record = NdefRecord.createUri(url)
            val message = NdefMessage(arrayOf(record))

            val ndef = Ndef.get(tag)
            if (ndef != null) {
                ndef.connect()
                if (!ndef.isWritable) {
                    finishWith("Esta etiqueta no se puede escribir (está bloqueada).", isError = true)
                    ndef.close()
                    return
                }
                if (ndef.maxSize < message.toByteArray().size) {
                    finishWith("La URL es muy larga para esta etiqueta.", isError = true)
                    ndef.close()
                    return
                }
                ndef.writeNdefMessage(message)
                ndef.close()
                finishWith("✅ Etiqueta escrita correctamente.", isError = false)
                return
            }

            val formatable = NdefFormatable.get(tag)
            if (formatable != null) {
                formatable.connect()
                formatable.format(message)
                formatable.close()
                finishWith("✅ Etiqueta formateada y escrita correctamente.", isError = false)
                return
            }

            finishWith("Esta etiqueta no es compatible (no soporta NDEF).", isError = true)
        } catch (e: Exception) {
            finishWith("Error al escribir: ${e.message ?: "desconocido"}. Intenta de nuevo.", isError = true)
        }
    }

    private fun readTag(tag: Tag) {
        try {
            val ndef = Ndef.get(tag)
            if (ndef == null) {
                finishWith("Esta etiqueta no tiene datos NDEF.", isError = true)
                return
            }
            ndef.connect()
            val message = ndef.cachedNdefMessage ?: ndef.ndefMessage
            ndef.close()

            val record = message?.records?.firstOrNull()
            val payload = record?.let { decodeUriRecord(it) }

            if (payload.isNullOrBlank()) {
                finishWith("La etiqueta está vacía.", isError = true)
            } else {
                finishWith("Contenido actual:\n$payload", isError = false)
            }
        } catch (e: Exception) {
            finishWith("Error al leer: ${e.message ?: "desconocido"}. Intenta de nuevo.", isError = true)
        }
    }

    /** Reconstructs the full URI from an NFC Forum "URI Record" payload, whose
     * first byte is a compressed prefix code (e.g. 0x04 = "https://"). */
    private fun decodeUriRecord(record: NdefRecord): String {
        val payload = record.payload
        if (payload.isEmpty()) return ""
        val prefixCode = payload[0].toInt() and 0xFF
        val rest = String(payload, 1, payload.size - 1, Charsets.UTF_8)
        val prefix = when (prefixCode) {
            0x01 -> "http://www."
            0x02 -> "https://www."
            0x03 -> "http://"
            0x04 -> "https://"
            0x05 -> "tel:"
            0x06 -> "mailto:"
            else -> ""
        }
        return prefix + rest
    }

    private fun finishWith(text: String, isError: Boolean) {
        status.value = StatusMessage(text, isError)
        mode.value = Mode.IDLE
        nfcAdapter?.disableForegroundDispatch(this)
    }
}

@Composable
private fun WriterScreen(
    hasNfc: Boolean,
    nfcEnabled: Boolean,
    mode: Mode,
    urlText: String,
    status: MainActivity.StatusMessage?,
    onUrlChange: (String) -> Unit,
    onStartWrite: () -> Unit,
    onStartRead: () -> Unit,
    onCancel: () -> Unit,
    onOpenNfcSettings: () -> Unit
) {
    MaterialTheme(
        colorScheme = lightColorScheme(
            primary = Teal,
            onPrimary = Color.White,
            secondary = Coral,
            background = Paper,
            surface = PaperRaised,
            onBackground = Ink,
            onSurface = Ink
        )
    ) {
        Surface(modifier = Modifier.fillMaxSize(), color = Paper) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(24.dp),
                horizontalAlignment = Alignment.Start
            ) {
                BrandHeader()

                Spacer(Modifier.height(24.dp))

                if (!hasNfc) {
                    InfoCard(
                        title = "Este teléfono no tiene NFC",
                        body = "Necesitas un celular con lector NFC para escribir o leer etiquetas.",
                        isError = true
                    )
                    return@Column
                }

                if (!nfcEnabled) {
                    InfoCard(
                        title = "El NFC está apagado",
                        body = "Actívalo en la configuración del teléfono para continuar.",
                        isError = true
                    )
                    Spacer(Modifier.height(12.dp))
                    OutlinedButton(onClick = onOpenNfcSettings, modifier = Modifier.fillMaxWidth()) {
                        Text("Abrir configuración de NFC")
                    }
                    return@Column
                }

                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = PaperRaised),
                    border = BorderStroke(1.dp, Line),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(Modifier.padding(20.dp)) {
                        Text(
                            "URL de la etiqueta",
                            fontWeight = FontWeight.SemiBold,
                            fontSize = 15.sp,
                            color = Ink
                        )
                        Spacer(Modifier.height(8.dp))
                        OutlinedTextField(
                            value = urlText,
                            onValueChange = onUrlChange,
                            enabled = mode == Mode.IDLE,
                            placeholder = { Text("https://nfc-lost-person-help.vercel.app/t/abc123") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(Modifier.height(6.dp))
                        Text(
                            "Copia esta URL desde /admin en Guardián NFC.",
                            fontSize = 13.sp,
                            color = InkSoft
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))

                if (mode == Mode.IDLE) {
                    Button(
                        onClick = onStartWrite,
                        enabled = urlText.isNotBlank(),
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(999.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Teal)
                    ) {
                        Text("Escribir etiqueta", fontWeight = FontWeight.SemiBold)
                    }

                    Spacer(Modifier.height(10.dp))

                    OutlinedButton(
                        onClick = onStartRead,
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(999.dp)
                    ) {
                        Text("Leer etiqueta (verificar)", fontWeight = FontWeight.SemiBold)
                    }
                } else {
                    WaitingCard(mode = mode, onCancel = onCancel)
                }

                status?.let {
                    Spacer(Modifier.height(16.dp))
                    InfoCard(
                        title = if (it.isError) "Ups" else "Listo",
                        body = it.text,
                        isError = it.isError
                    )
                }
            }
        }
    }
}

@Composable
private fun BrandHeader() {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .clip(CircleShape)
                .background(Teal),
            contentAlignment = Alignment.Center
        ) {
            Text("G", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
        Spacer(Modifier.width(10.dp))
        Text(
            "Guardián NFC",
            fontFamily = FontFamily.Serif,
            fontWeight = FontWeight.SemiBold,
            fontSize = 22.sp,
            color = Ink
        )
    }
}

@Composable
private fun WaitingCard(mode: Mode, onCancel: () -> Unit) {
    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = TealWash),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                if (mode == Mode.WRITING) "Acerca la etiqueta al teléfono…" else "Acerca la etiqueta para leerla…",
                fontWeight = FontWeight.SemiBold,
                color = TealDeep,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(4.dp))
            Text(
                "Mantenla pegada a la parte trasera del celular unos segundos.",
                fontSize = 13.sp,
                color = InkSoft,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(14.dp))
            TextButton(onClick = onCancel) {
                Text("Cancelar", color = TealDeep)
            }
        }
    }
}

@Composable
private fun InfoCard(title: String, body: String, isError: Boolean) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = if (isError) CoralWash else TealWash),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(
                title,
                fontWeight = FontWeight.SemiBold,
                color = if (isError) Coral else TealDeep
            )
            Spacer(Modifier.height(4.dp))
            Text(body, fontSize = 14.sp, color = Ink)
        }
    }
}
