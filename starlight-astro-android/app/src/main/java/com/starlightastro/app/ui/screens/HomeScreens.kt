package com.starlightastro.app.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.starlightastro.app.data.Catalog
import com.starlightastro.app.ui.*
import com.starlightastro.app.ui.theme.Astro
import java.time.LocalDate

private val dailyGuidance = listOf(
    "Take a quiet moment this morning. Clear intentions make the rest of the day easier.",
    "A conversation you have been putting off may go better than you expect today.",
    "Focus on one thing at a time. Steady effort beats rushing.",
    "Small acts of kindness bring unexpected returns. Notice who needs your support.",
    "Good day to review your plans and trim what no longer serves you.",
    "Trust your preparation. Calm confidence will carry you through.",
    "Rest is productive too. Make space for something that restores you.",
)

private data class Tile(val emoji: String, val label: String, val route: String)

@Composable
fun HomeScreen(name: String, go: (String) -> Unit) {
    var showGuidance by remember { mutableStateOf(false) }
    val tiles = listOf(
        Tile("🪐", "Kundali & Charts", "kundali"), Tile("🔮", "Tarot Reading", "tarot"),
        Tile("✒️", "Handwriting Analysis", "handwriting"), Tile("🎓", "Astrology Courses", "courses"),
        Tile("📅", "Book a Session", "consult"), Tile("👤", "My Profile", "profile"),
    )
    Page(title = if (name.isBlank()) "Hello," else "Hello, $name") {
        Text(
            "Explore the Mysteries of the Cosmos…", color = Astro.Gold, fontSize = 20.sp,
            textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth(),
        )
        tiles.chunked(2).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                row.forEach { t ->
                    AstroCard(Modifier.weight(1f), onClick = { go(t.route) }) {
                        Text(t.emoji, fontSize = 30.sp)
                        Text(t.label, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold, color = Astro.Gold)
                    }
                }
            }
        }
        AstroCard {
            Text("Daily Guidance", style = MaterialTheme.typography.headlineMedium)
            Text("Discover what the stars have in store for you today…")
            SmallGoldButton("Read Now ›", { showGuidance = true })
        }
    }
    if (showGuidance) {
        AlertDialog(
            onDismissRequest = { showGuidance = false },
            confirmButton = { TextButton({ showGuidance = false }) { Text("Close", color = Astro.Gold) } },
            title = { Text("Today's Guidance", color = Astro.Gold) },
            text = {
                Column {
                    Text(dailyGuidance[LocalDate.now().dayOfYear % dailyGuidance.size])
                    Spacer(Modifier.height(10.dp))
                    Muted("General guidance for reflection and entertainment only.")
                }
            },
            containerColor = Astro.Card,
        )
    }
}

@Composable
fun KundaliScreen(onBack: () -> Unit, go: (String) -> Unit) {
    Page("Kundali & Charts", onBack) {
        Muted("Discover the deeper layers of your cosmic blueprint", Modifier.fillMaxWidth())
        SampleChart()
        Muted("Sample chart for illustration", Modifier.fillMaxWidth())
        Heading("Our Services")
        listOf(
            "Janam Kundali" to "Your birth chart", "Divisional Charts" to "D1, D9, D7 & more",
            "Transit Analysis" to "Current & future transits", "Planetary Strength" to "Detailed planet analysis",
            "Muhurta Selection" to "Auspicious timing", "Personalized Astro Report" to "Tailored to your chart",
        ).forEach { (t, d) ->
            AstroCard { Text(t, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold); Muted(d) }
        }
        Heading("Why Choose Us?")
        Text("★ Accurate Calculations   🪷 Easy Explanation\n🛡 Trusted Guidance   ♥ Personalized Insights", lineHeight = 26.sp)
        GoldButton("Get Your Kundali Report  ${rupees(Catalog.service("kundali").price)}", { go("book/kundali") })
    }
}

/** Decorative North-Indian style chart with house numbers. */
@Composable
private fun SampleChart() {
    val measurer = rememberTextMeasurer()
    val style = TextStyle(color = Astro.CreamText, fontSize = 15.sp)
    Canvas(Modifier.fillMaxWidth().aspectRatio(1.2f)) {
        val w = size.width; val h = size.height
        val gold = Astro.GoldDark
        drawRect(Astro.Cream, size = Size(w, h))
        drawRect(gold, size = Size(w, h), style = Stroke(3f))
        drawLine(gold, Offset(0f, 0f), Offset(w, h), 3f)
        drawLine(gold, Offset(w, 0f), Offset(0f, h), 3f)
        val l = Offset(0f, h / 2); val r = Offset(w, h / 2); val t = Offset(w / 2, 0f); val b = Offset(w / 2, h)
        drawLine(gold, l, t, 3f); drawLine(gold, t, r, 3f); drawLine(gold, r, b, 3f); drawLine(gold, b, l, 3f)
        val pos = listOf(
            .5f to .25f, .25f to .1f, .1f to .25f, .25f to .5f, .1f to .75f, .25f to .9f,
            .5f to .75f, .75f to .9f, .9f to .75f, .75f to .5f, .9f to .25f, .75f to .1f,
        )
        pos.forEachIndexed { i, (fx, fy) ->
            val m = measurer.measure((i + 1).toString(), style)
            drawText(m, topLeft = Offset(fx * w - m.size.width / 2f, fy * h - m.size.height / 2f))
        }
    }
}

@Composable
fun TarotScreen(onBack: () -> Unit, go: (String) -> Unit) {
    val s = Catalog.service("tarot")
    Page("Tarot Reading", onBack) {
        Muted("Find clarity, guidance and new perspectives", Modifier.fillMaxWidth())
        Heading("What you can ask about")
        listOf(
            "One Question Reading" to "Quick guidance for your query",
            "Deep Insight Session" to "Detailed reading of the cards",
            "Kundali Based Tarot" to "Astrological + Tarot guidance",
            "Complete Tarot Reading" to "In-depth analysis of your life",
        ).forEach { (t, d) -> AstroCard { Text(t, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold); Muted(d) } }
        AstroCard {
            Text(s.name, color = Astro.Gold, fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold)
            Text("${rupees(s.price)} (${s.priceNote})")
            Muted(s.description)
        }
        GoldButton("Book Your Tarot Session  ${rupees(s.price)}", { go("book/tarot") })
    }
}

@Composable
fun HandwritingScreen(onBack: () -> Unit, go: (String) -> Unit) {
    val s = Catalog.service("handwriting")
    Page("Handwriting Analysis", onBack) {
        Muted("Discover the hidden message in your handwriting…", Modifier.fillMaxWidth())
        Heading("What We Analyse")
        AstroCard { Text("🧠 Personality Traits"); Text("♥ Emotions & Feelings"); Text("🎯 Strengths & Weaknesses") }
        Heading("Our Services")
        AstroCard {
            Text("Handwriting Analysis Report", fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold)
            Muted("One Comprehensive Report")
            Text(rupees(s.price), color = Astro.Gold, fontSize = 24.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold)
        }
        GoldButton("Get Your Analysis  ${rupees(s.price)}", { go("book/handwriting") })
    }
}
