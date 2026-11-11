package com.starlightastro.app

import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File
import java.io.FileOutputStream

/** Walks through the main screens and saves a PNG of each one (used to generate store/README screenshots). */
@RunWith(AndroidJUnit4::class)
class ScreenshotTest {
    @get:Rule val rule = createAndroidComposeRule<MainActivity>()

    private val dir = File(InstrumentationRegistry.getInstrumentation().targetContext.getExternalFilesDir(null), "shots")
        .also { it.mkdirs() }

    private fun shot(name: String) {
        rule.waitForIdle()
        val bmp = rule.onRoot().captureToImage().asAndroidBitmap()
        FileOutputStream(File(dir, "$name.png")).use { bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, it) }
    }

    private fun back() {
        rule.runOnUiThread { rule.activity.onBackPressedDispatcher.onBackPressed() }
        rule.waitForIdle()
    }

    private fun tap(text: String, substring: Boolean = false, index: Int = 0) {
        rule.onAllNodesWithText(text, substring = substring)[index].performScrollTo().performClick()
        rule.waitForIdle()
    }

    @Test
    fun tour() {
        shot("01_home")
        tap("Kundali & Charts"); shot("02_kundali"); back()
        tap("Tarot Reading"); shot("03_tarot"); back()
        tap("Handwriting Analysis"); shot("04_handwriting"); back()

        tap("Courses"); shot("05_courses")
        tap("View Course", index = 0); shot("06_course_detail"); back()

        tap("Consult"); shot("07_consult")
        tap("Book Now", substring = true, index = 0)
        rule.onNodeWithText("Customer Name").performTextInput("Asha Sharma")
        rule.onNodeWithText("Mobile Number (+91)").performTextInput("9876543210")
        shot("08_booking_details")
        tap("Continue to Payment", substring = true); shot("09_payment")
        tap("Secure Payment", substring = true)
        rule.waitUntil(10_000) { rule.onAllNodesWithText("Booking Confirmed!").fetchSemanticsNodes().isNotEmpty() }
        shot("10_confirmation")
        tap("View My Bookings"); shot("11_my_bookings")

        tap("Profile"); shot("12_profile")
    }
}
