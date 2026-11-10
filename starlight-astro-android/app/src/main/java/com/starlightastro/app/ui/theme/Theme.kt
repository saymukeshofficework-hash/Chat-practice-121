package com.starlightastro.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

object Astro {
    val Night = Color(0xFF150B33)
    val Purple = Color(0xFF2E1A6B)
    val PurpleLight = Color(0xFF4B2C9A)
    val Card = Color(0xFF241447)
    val Cream = Color(0xFFFBE9E7)
    val CreamText = Color(0xFF3A1F6B)
    val Gold = Color(0xFFE8C07A)
    val GoldDark = Color(0xFFB98A3E)
    val GoldText = Color(0xFF3B2410)
    val Green = Color(0xFF6FCF8E)
    val TextMuted = Color(0xFFBFB3E0)

    val Background = Brush.verticalGradient(listOf(Night, Purple, Night))
    val GoldButton = Brush.horizontalGradient(listOf(Color(0xFFF3D595), Gold, GoldDark))
}

private val Scheme = darkColorScheme(
    primary = Astro.Gold,
    onPrimary = Astro.GoldText,
    secondary = Astro.PurpleLight,
    background = Astro.Night,
    onBackground = Color.White,
    surface = Astro.Card,
    onSurface = Color.White,
    surfaceVariant = Astro.Card,
    onSurfaceVariant = Astro.TextMuted,
    outline = Astro.Gold.copy(alpha = 0.5f),
)

private val Script = FontFamily.Serif

private val AstroTypography = Typography(
    headlineLarge = TextStyle(fontFamily = Script, fontStyle = FontStyle.Italic, fontWeight = FontWeight.Medium, fontSize = 32.sp, color = Astro.Gold),
    headlineMedium = TextStyle(fontFamily = Script, fontStyle = FontStyle.Italic, fontWeight = FontWeight.Medium, fontSize = 26.sp, color = Astro.Gold),
    titleLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 20.sp, color = Astro.Gold),
    titleMedium = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 16.sp),
    bodyLarge = TextStyle(fontSize = 16.sp),
    bodyMedium = TextStyle(fontSize = 14.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.SemiBold, fontSize = 16.sp),
)

@Composable
fun StarlightTheme(content: @Composable () -> Unit) {
    // The brand look is always dark/purple regardless of system setting.
    MaterialTheme(colorScheme = Scheme, typography = AstroTypography, content = content)
}
