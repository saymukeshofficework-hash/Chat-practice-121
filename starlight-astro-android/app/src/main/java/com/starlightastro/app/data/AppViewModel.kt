package com.starlightastro.app.data

import android.app.Application
import android.content.Context
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

/** What the user is about to pay for. */
sealed interface PayItem {
    val title: String
    val amount: Int

    data class ServiceItem(val service: Service, val startMillis: Long) : PayItem {
        override val title get() = service.name
        override val amount get() = service.price
    }

    data class CourseItem(val course: Course) : PayItem {
        override val title get() = course.title
        override val amount get() = course.price
    }
}

class AppViewModel(app: Application) : AndroidViewModel(app) {
    private val prefs = app.getSharedPreferences("starlight", Context.MODE_PRIVATE)

    val bookings = mutableStateListOf<Booking>()
    val enrollments = mutableStateListOf<Enrollment>()

    var profileName by mutableStateOf(prefs.getString("name", "") ?: "")
        private set
    var profilePhone by mutableStateOf(prefs.getString("phone", "") ?: "")
        private set

    /** Item currently going through checkout. */
    var pending by mutableStateOf<PayItem?>(null)
        private set

    /** Last successful booking, shown on the confirmation screen. */
    var lastBooking by mutableStateOf<Booking?>(null)
        private set

    init {
        runCatching {
            val arr = JSONArray(prefs.getString("bookings", "[]"))
            for (i in 0 until arr.length()) {
                val o = arr.getJSONObject(i)
                bookings += Booking(o.getString("ref"), o.getString("name"), o.getLong("start"), o.getBoolean("paid"))
            }
            val en = JSONArray(prefs.getString("enrollments", "[]"))
            for (i in 0 until en.length()) {
                val o = en.getJSONObject(i)
                enrollments += Enrollment(o.getString("id"), o.getInt("done"))
            }
        }
    }

    fun saveProfile(name: String, phone: String) {
        profileName = name
        profilePhone = phone
        prefs.edit().putString("name", name).putString("phone", phone).apply()
    }

    fun startServiceCheckout(service: Service, startMillis: Long) {
        pending = PayItem.ServiceItem(service, startMillis)
    }

    fun startCourseCheckout(course: Course) {
        pending = PayItem.CourseItem(course)
    }

    fun isEnrolled(courseId: String) = enrollments.any { it.courseId == courseId }

    /**
     * Called after payment succeeds. Payment itself is simulated for now —
     * wire a real gateway (e.g. Razorpay) before launch and call this from its success callback.
     */
    fun completePayment() {
        when (val item = pending ?: return) {
            is PayItem.ServiceItem -> {
                val ref = "SB-${item.service.id.take(2).uppercase()}-${100000 + (System.currentTimeMillis() % 900000)}"
                val b = Booking(ref, item.service.name, item.startMillis, paid = true)
                bookings.add(0, b)
                lastBooking = b
            }
            is PayItem.CourseItem -> if (!isEnrolled(item.course.id)) enrollments += Enrollment(item.course.id, 0)
        }
        pending = null
        persist()
    }

    fun completeNextLesson(courseId: String) {
        val i = enrollments.indexOfFirst { it.courseId == courseId }
        if (i < 0) return
        val total = Catalog.course(courseId).curriculum.size
        val e = enrollments[i]
        if (e.completedLessons < total) enrollments[i] = e.copy(completedLessons = e.completedLessons + 1)
        persist()
    }

    private fun persist() {
        val b = JSONArray()
        bookings.forEach {
            b.put(JSONObject().put("ref", it.ref).put("name", it.serviceName).put("start", it.startMillis).put("paid", it.paid))
        }
        val e = JSONArray()
        enrollments.forEach { e.put(JSONObject().put("id", it.courseId).put("done", it.completedLessons)) }
        prefs.edit().putString("bookings", b.toString()).putString("enrollments", e.toString()).apply()
    }
}

object Slots {
    val times = listOf("10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM")
    private val timeFmt = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH)
    private val dateFmt = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH)

    /** Next 14 days starting tomorrow. */
    fun dates(): List<LocalDate> = (1..14).map { LocalDate.now().plusDays(it.toLong()) }

    fun dateLabel(d: LocalDate): String = d.format(dateFmt)

    fun toMillis(date: LocalDate, time: String): Long =
        date.atTime(LocalTime.parse(time, timeFmt)).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()
}
