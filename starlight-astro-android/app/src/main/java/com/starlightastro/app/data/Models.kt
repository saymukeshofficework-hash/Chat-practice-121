package com.starlightastro.app.data

/** Replace with your real contact details before publishing. */
object Config {
    const val SUPPORT_PHONE = "+919876543210"
    const val SUPPORT_PHONE_DISPLAY = "+91 98765 43210"
    const val WHATSAPP_NUMBER = "919876543210" // digits only, with country code
    const val FAQ_URL = "https://example.com/faq"

    /** Payments are simulated until a real gateway (e.g. Razorpay) is integrated. Set false at that point. */
    const val PAYMENT_DEMO = true
}

data class Service(
    val id: String,
    val name: String,
    val price: Int,
    val priceNote: String,
    val description: String,
    val emoji: String,
)

data class Course(
    val id: String,
    val title: String,
    val subtitle: String,
    val summary: String,
    val price: Int,
    val languages: String,
    val mode: String,
    val emoji: String,
    val learn: List<String>,
    /** One entry per lesson/day, in order. */
    val curriculum: List<String>,
) {
    val durationLabel get() = "${curriculum.size} Days"
}

data class Booking(
    val ref: String,
    val serviceName: String,
    val startMillis: Long,
    val paid: Boolean,
)

data class Enrollment(val courseId: String, val completedLessons: Int)

object Catalog {
    val services = listOf(
        Service(
            "tarot", "Tarot Reading", 526, "1 hour, 1 person",
            "Gain insights into your past, present, and future through intuitive card interpretation.",
            "🔮",
        ),
        Service(
            "handwriting", "Handwriting Analysis", 179, "per person",
            "Discover personality traits, strengths, and hidden potentials through expert graphology.",
            "✒️",
        ),
        Service(
            "kundali", "Kundali Analysis", 829, "per person",
            "Unveil the secrets of your destiny and life path with a comprehensive Vedic astrology reading.",
            "🪐",
        ),
    )

    val courses = listOf(
        Course(
            id = "astrology",
            title = "Beginner Astrology Course",
            subtitle = "Discover the Language of the Stars",
            summary = "Learn zodiac signs, planetary houses, & natal chart interpretation.",
            price = 999,
            languages = "Hindi & English",
            mode = "Beginner Friendly",
            emoji = "☉",
            learn = listOf(
                "Introduction to Astrology", "Zodiac Signs & Meanings", "Planets & Significance",
                "Houses & Their Importance", "Understanding Birth Charts", "Basic Chart Interpretation",
            ),
            curriculum = listOf(
                "Introduction to Astrology", "Zodiac Signs & Elements", "The Nine Planets",
                "Planetary Dignities", "The Twelve Houses", "House Lords & Significations",
                "Reading a Birth Chart", "Nakshatras", "Dasha Basics", "Basic Chart Interpretation",
            ),
        ),
        Course(
            id = "tarot",
            title = "Learn Tarot Reading",
            subtitle = "From Beginner to Professional Reader",
            summary = "Master the Major Arcana, spreads, & intuitive reading.",
            price = 711,
            languages = "Hindi + English",
            mode = "Online Practical Course",
            emoji = "🔮",
            learn = listOf(
                "Introduction to Tarot and its history", "Understanding all 78 Tarot cards",
                "Major and Minor Arcana", "Upright and reversed card meanings",
                "Tarot spreads and layouts", "Intuitive card interpretation",
                "Practical prediction techniques", "Conducting professional Tarot readings",
            ),
            curriculum = listOf(
                "Tarot Fundamentals & History", "Major Arcana Deep Dive", "Minor Arcana Insights",
                "Card Meanings & Spreads", "Professional Reading Practicum",
            ),
        ),
    )

    fun service(id: String) = services.first { it.id == id }
    fun course(id: String) = courses.first { it.id == id }
}
