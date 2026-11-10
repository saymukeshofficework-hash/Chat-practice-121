package com.starlightastro.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.starlightastro.app.data.*
import com.starlightastro.app.ui.*
import com.starlightastro.app.ui.theme.Astro
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.util.Date
import java.util.Locale

private fun fmtDate(ms: Long) = SimpleDateFormat("dd MMMM yyyy", Locale.ENGLISH).format(Date(ms))
private fun fmtTime(ms: Long) = SimpleDateFormat("hh:mm a", Locale.ENGLISH).format(Date(ms))
private fun fmtShort(ms: Long) = SimpleDateFormat("dd MMM yyyy", Locale.ENGLISH).format(Date(ms))

@Composable
fun ConsultScreen(go: (String) -> Unit) {
    Page("Booking & Services") {
        Catalog.services.forEach { s ->
            AstroCard {
                Text("${s.emoji} ${s.name}", color = Astro.Gold, fontSize = 20.sp, fontWeight = FontWeight.SemiBold)
                Text("${rupees(s.price)} (${s.priceNote})", fontWeight = FontWeight.SemiBold)
                Text(s.description, fontSize = 14.sp)
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    SmallGoldButton("Book Now  ${rupees(s.price)}", { go("book/${s.id}") })
                }
            }
        }
        OutlinedButton({ go("myBookings") }, Modifier.fillMaxWidth()) { Text("My Bookings", color = Astro.Gold) }
    }
}

@Composable
fun BookingDetailsScreen(serviceId: String, vm: AppViewModel, onBack: () -> Unit, go: (String) -> Unit) {
    val s = Catalog.service(serviceId)
    var name by remember { mutableStateOf(vm.profileName) }
    var phone by remember { mutableStateOf(vm.profilePhone) }
    val dates = remember { Slots.dates() }
    var date by remember { mutableStateOf<LocalDate?>(dates.first()) }
    var time by remember { mutableStateOf<String?>(Slots.times[3]) }
    var message by remember { mutableStateOf("") }
    var tried by remember { mutableStateOf(false) }

    val nameErr = if (tried && name.isBlank()) "Please enter your name" else null
    val phoneErr = if (tried && phone.length != 10) "Enter a 10-digit mobile number" else null

    Page("Booking Details", onBack) {
        AstroCard {
            Text("Selected Service", color = Astro.Gold, fontWeight = FontWeight.SemiBold)
            Text("${s.name} - ${rupees(s.price)} (${s.priceNote})")
        }
        AstroTextField(name, { name = it }, "Customer Name", error = nameErr)
        AstroTextField(
            phone, { phone = it.filter(Char::isDigit).take(10) }, "Mobile Number (+91)",
            keyboard = KeyboardOptions(keyboardType = KeyboardType.Phone), error = phoneErr,
        )
        DropdownField("Preferred Date", dates, date, { Slots.dateLabel(it) }) { date = it }
        DropdownField("Preferred Time", Slots.times, time, { it }) { time = it }
        AstroTextField(message, { message = it }, "Optional Message for the astrologer", singleLine = false, minLines = 3)
        GoldButton("Continue to Payment ${rupees(s.price)}", {
            tried = true
            val d = date; val t = time
            if (name.isNotBlank() && phone.length == 10 && d != null && t != null) {
                vm.saveProfile(name.trim(), phone)
                vm.startServiceCheckout(s, Slots.toMillis(d, t))
                go("payment")
            }
        })
    }
}

@Composable
fun PaymentScreen(vm: AppViewModel, onBack: () -> Unit, onPaid: (isService: Boolean) -> Unit) {
    var processing by remember { mutableStateOf(false) }
    val processing0 = processing
    val item = vm.pending
    if (item == null) { if (!processing0) LaunchedEffect(Unit) { onBack() }; return }
    val methods = listOf("UPI (BHIM, Paytm)", "Google Pay", "PhonePe", "Credit/Debit Card, Net Banking")
    var method by remember { mutableStateOf(methods[0]) }

    if (processing) {
        LaunchedEffect(Unit) {
            delay(1500) // TODO: replace with the real payment gateway flow
            val isService = item is PayItem.ServiceItem
            vm.completePayment()
            onPaid(isService)
        }
    }

    Page("Payment", onBack.takeIf { !processing }) {
        AstroCard {
            Text("Order Summary", color = Astro.Gold, fontWeight = FontWeight.SemiBold, fontSize = 18.sp)
            Text("Service/Course Name: ${item.title}")
            Text("Tariff: ${rupees(item.amount)}")
            Text("Total Payable Amount: ${rupees(item.amount)}", fontWeight = FontWeight.Bold)
        }
        Heading("Select Payment Method")
        methods.forEach { m ->
            AstroCard(onClick = { method = m }) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    RadioButton(
                        selected = method == m, onClick = { method = m },
                        colors = RadioButtonDefaults.colors(selectedColor = Astro.Gold, unselectedColor = Astro.TextMuted),
                    )
                    Text(m, fontSize = 16.sp)
                }
            }
        }
        if (Config.PAYMENT_DEMO) Muted("Demo mode: no real payment is taken. A live payment gateway will be connected before launch.")
        if (processing) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
                CircularProgressIndicator(color = Astro.Gold)
            }
        } else {
            GoldButton("Secure Payment ${rupees(item.amount)}", { processing = true })
        }
        Muted("🔒 Payment is secure and encrypted.", Modifier.fillMaxWidth())
    }
}

@Composable
fun ConfirmationScreen(vm: AppViewModel, onHome: () -> Unit, go: (String) -> Unit) {
    val b = vm.lastBooking
    val ctx = LocalContext.current
    Page("Booking Confirmed!") {
        if (b == null) {
            AstroCard { Text("No recent booking found."); SmallGoldButton("Home", onHome) }
            return@Page
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            Icon(Icons.Filled.CheckCircle, null, tint = Astro.Gold, modifier = Modifier.size(72.dp))
        }
        AstroCard {
            Muted("Booking Reference Number:")
            Text(b.ref, fontSize = 22.sp, fontWeight = FontWeight.SemiBold)
            Text("Service Details: ${b.serviceName}")
            Text("📅 Appointment Date: ${fmtDate(b.startMillis)}")
            Text("🕒 Appointment Time: ${fmtTime(b.startMillis)}")
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("Payment Status: "); Chip(if (b.paid) "Paid" else "Pending")
            }
            Spacer(Modifier.height(4.dp))
            Text("Your session is now confirmed. Our team will contact you on your mobile number with the details.")
        }
        SupportBlock()
        GoldButton("Add to Calendar", { ctx.addToCalendar(b.serviceName, b.startMillis) })
        OutlinedButton({ go("myBookings") }, Modifier.fillMaxWidth()) { Text("View My Bookings", color = Astro.Gold) }
    }
}

@Composable
fun MyBookingsScreen(vm: AppViewModel, onBack: () -> Unit, go: (String) -> Unit) {
    val now = System.currentTimeMillis()
    val upcoming = vm.bookings.filter { it.startMillis + 60 * 60 * 1000L >= now }.sortedBy { it.startMillis }
    val past = vm.bookings.filter { it.startMillis + 60 * 60 * 1000L < now }
    Page("My Bookings", onBack) {
        Heading("Upcoming Appointments")
        if (upcoming.isEmpty()) AstroCard { Text("No upcoming appointments."); SmallGoldButton("Book a Session", { go("consult") }) }
        upcoming.forEach { b ->
            AstroCard {
                Text("Service: ${b.serviceName}", fontWeight = FontWeight.SemiBold)
                Text("Booking Date: ${fmtDate(b.startMillis)}")
                Text("Booking Time: ${fmtTime(b.startMillis)}")
                Muted("Ref: ${b.ref}")
                Row(verticalAlignment = Alignment.CenterVertically) { Text("Payment Status: "); Chip(if (b.paid) "Paid" else "Pending") }
            }
        }
        Heading("Past Bookings")
        if (past.isEmpty()) Muted("No past bookings yet.")
        past.forEach { b ->
            AstroCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Column { Text(b.serviceName, fontWeight = FontWeight.SemiBold); Muted(fmtShort(b.startMillis)) }
                    Text("Completed", color = Astro.Green)
                }
            }
        }
    }
}

@Composable
fun ProfileScreen(vm: AppViewModel, go: (String) -> Unit) {
    val ctx = LocalContext.current
    var name by remember { mutableStateOf(vm.profileName) }
    var phone by remember { mutableStateOf(vm.profilePhone) }
    var saved by remember { mutableStateOf(false) }
    Page("My Profile") {
        AstroTextField(name, { name = it; saved = false }, "Name")
        AstroTextField(
            phone, { phone = it.filter(Char::isDigit).take(10); saved = false }, "Mobile Number (+91)",
            keyboard = KeyboardOptions(keyboardType = KeyboardType.Phone),
        )
        GoldButton(if (saved) "Saved ✓" else "Save Profile", { vm.saveProfile(name.trim(), phone); saved = true })
        AstroCard(onClick = { go("myBookings") }) { Text("📅 My Bookings", fontSize = 16.sp) }
        AstroCard(onClick = { go("myCourses") }) { Text("🎓 My Courses", fontSize = 16.sp) }
        SupportBlock()
        Muted("Starlight Astro v1.0.0", Modifier.fillMaxWidth())
    }
}
