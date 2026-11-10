package com.starlightastro.app.ui

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.CalendarContract
import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.starlightastro.app.data.Config
import com.starlightastro.app.ui.theme.Astro

val CardShape = RoundedCornerShape(18.dp)

/** Full-screen page: gradient background, optional back arrow, scrolling content. */
@Composable
fun Page(
    title: String,
    onBack: (() -> Unit)? = null,
    scroll: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        Modifier
            .fillMaxSize()
            .background(Astro.Background)
            .statusBarsPadding()
    ) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            if (onBack != null) {
                IconButton(onClick = onBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Astro.Gold)
                }
            } else Spacer(Modifier.width(12.dp))
            Text("✦ Starlight Astro", color = Astro.Gold, fontSize = 20.sp, fontWeight = FontWeight.SemiBold)
        }
        val mod = Modifier.weight(1f).fillMaxWidth().let { if (scroll) it.verticalScroll(rememberScrollState()) else it }
        Column(mod.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text(
                title, style = androidx.compose.material3.MaterialTheme.typography.headlineLarge,
                textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
            )
            content()
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
fun AstroCard(modifier: Modifier = Modifier, onClick: (() -> Unit)? = null, content: @Composable ColumnScope.() -> Unit) {
    val base = modifier
        .fillMaxWidth()
        .clip(CardShape)
        .background(Astro.Card.copy(alpha = 0.92f))
        .border(BorderStroke(1.dp, Astro.Gold.copy(alpha = 0.55f)), CardShape)
        .let { if (onClick != null) it.clickable(onClick = onClick) else it }
    Column(base.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp), content = content)
}

@Composable
fun GoldButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true) {
    Box(
        modifier
            .fillMaxWidth()
            .height(54.dp)
            .clip(RoundedCornerShape(27.dp))
            .background(Astro.GoldButton, alpha = if (enabled) 1f else 0.5f)
            .clickable(enabled = enabled, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        Text(text, color = Astro.GoldText, fontWeight = FontWeight.SemiBold, fontSize = 17.sp)
    }
}

@Composable
fun SmallGoldButton(text: String, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Box(
        modifier
            .height(40.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Astro.GoldButton)
            .clickable(onClick = onClick)
            .padding(horizontal = 18.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(text, color = Astro.GoldText, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
    }
}

@Composable
fun Heading(text: String) = Text(text, color = Astro.Gold, fontWeight = FontWeight.SemiBold, fontSize = 18.sp)

@Composable
fun Muted(text: String, modifier: Modifier = Modifier) =
    Text(text, color = Astro.TextMuted, fontSize = 14.sp, modifier = modifier)

@Composable
fun Chip(text: String, color: Color = Astro.Green) {
    Text(
        text, color = color, fontSize = 12.sp, fontWeight = FontWeight.Medium,
        modifier = Modifier.clip(RoundedCornerShape(12.dp)).background(color.copy(alpha = 0.18f)).padding(horizontal = 10.dp, vertical = 3.dp),
    )
}

@Composable
fun AstroTextField(
    value: String, onChange: (String) -> Unit, label: String,
    modifier: Modifier = Modifier, singleLine: Boolean = true, minLines: Int = 1,
    keyboard: androidx.compose.foundation.text.KeyboardOptions = androidx.compose.foundation.text.KeyboardOptions.Default,
    error: String? = null,
) {
    OutlinedTextField(
        value = value, onValueChange = onChange, label = { Text(label) },
        modifier = modifier.fillMaxWidth(), singleLine = singleLine, minLines = minLines,
        keyboardOptions = keyboard, isError = error != null,
        supportingText = error?.let { { Text(it) } },
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = Astro.Gold, unfocusedBorderColor = Astro.Gold.copy(alpha = 0.5f),
            focusedLabelColor = Astro.Gold, unfocusedLabelColor = Astro.TextMuted, cursorColor = Astro.Gold,
        ),
    )
}

@Composable
fun <T> DropdownField(label: String, options: List<T>, selected: T?, display: (T) -> String, onSelect: (T) -> Unit) {
    var open by remember { mutableStateOf(false) }
    Box {
        OutlinedTextField(
            value = selected?.let(display) ?: "", onValueChange = {}, readOnly = true,
            label = { Text(label) }, modifier = Modifier.fillMaxWidth(),
            trailingIcon = { Icon(Icons.Filled.ExpandMore, contentDescription = null, tint = Astro.Gold) },
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = Astro.Gold, unfocusedBorderColor = Astro.Gold.copy(alpha = 0.5f),
                focusedLabelColor = Astro.Gold, unfocusedLabelColor = Astro.TextMuted,
            ),
        )
        // Transparent overlay so a tap anywhere on the field opens the menu.
        Box(Modifier.matchParentSize().clickable { open = true })
        DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
            options.forEach { o ->
                DropdownMenuItem(text = { Text(display(o)) }, onClick = { onSelect(o); open = false })
            }
        }
    }
}

// ---- External intents --------------------------------------------------------------------

private fun Context.launch(intent: Intent) {
    try {
        startActivity(intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    } catch (_: ActivityNotFoundException) {
        Toast.makeText(this, "No app available to open this", Toast.LENGTH_SHORT).show()
    }
}

fun Context.callSupport() = launch(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${Config.SUPPORT_PHONE}")))
fun Context.whatsappSupport() = launch(Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/${Config.WHATSAPP_NUMBER}")))
fun Context.openFaq() = launch(Intent(Intent.ACTION_VIEW, Uri.parse(Config.FAQ_URL)))

fun Context.addToCalendar(title: String, startMillis: Long) = launch(
    Intent(Intent.ACTION_INSERT).apply {
        data = CalendarContract.Events.CONTENT_URI
        putExtra(CalendarContract.Events.TITLE, "Starlight Astro – $title")
        putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, startMillis)
        putExtra(CalendarContract.EXTRA_EVENT_END_TIME, startMillis + 60 * 60 * 1000L)
    }
)

@Composable
fun SupportBlock() {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    AstroCard {
        Heading("Need Assistance?")
        SupportRow("📞", "Call Support: ${Config.SUPPORT_PHONE_DISPLAY}") { ctx.callSupport() }
        SupportRow("💬", "WhatsApp Us") { ctx.whatsappSupport() }
        SupportRow("❓", "FAQs & Help Center") { ctx.openFaq() }
    }
}

@Composable
private fun SupportRow(emoji: String, text: String, onClick: () -> Unit) {
    Row(Modifier.fillMaxWidth().clickable(onClick = onClick).padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(emoji, fontSize = 22.sp)
        Spacer(Modifier.width(12.dp))
        Text(text, fontSize = 16.sp)
    }
}

fun rupees(amount: Int) = "₹$amount"
