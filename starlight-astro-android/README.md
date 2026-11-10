# Starlight Astro – Android app

Native Android app (Kotlin + Jetpack Compose, Material 3) for Starlight Astro: Kundali & Charts, Tarot Reading,
Handwriting Analysis, astrology courses, session booking, payment checkout, My Bookings and My Courses.

- Package: `com.starlightastro.app` · minSdk 26 · target/compile SDK 36 · version 1.0.0 (code 1)

## Build

**Easiest: GitHub Actions.** Every push touching this folder runs `.github/workflows/android.yml` and uploads a
debug APK (install on a phone to test) and a release `.aab` (the file Play Store wants) as workflow artifacts.

**Locally:** open this folder in Android Studio (latest stable), or run `./gradlew assembleDebug` with the Android SDK installed.

## Before uploading to the Play Store

1. **Signing key.** Create one once and keep it safe (losing it blocks future updates):
   `keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias starlight`
   - Locally: create `keystore.properties` next to `gradlew` with `storeFile`, `storePassword`, `keyAlias`, `keyPassword`.
   - On GitHub: add secrets `KEYSTORE_BASE64` (`base64 -w0 release.jks`), `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`.
   (Or enroll in Play App Signing and upload the AAB signed with an upload key.)
2. **Real payments.** Checkout is simulated (`Config.PAYMENT_DEMO = true`). Integrate Razorpay (UPI/cards/net banking)
   and call `AppViewModel.completePayment()` from its success callback, then set `PAYMENT_DEMO = false`.
   Bookings/enrolments are stored on-device only; add a backend if you need them across devices or for staff to see.
3. **Contact details.** Replace the placeholder phone / WhatsApp / FAQ URL in `data/Models.kt` (`Config`).
4. **Store listing.** Needs a privacy-policy URL, Data safety form, app icon 512×512, screenshots, and (for new personal
   developer accounts) the Play closed-testing requirement. Use your own artwork/photos only.
5. Bump `versionCode` in `app/build.gradle.kts` for every upload.

## Not built yet
Hindi/English toggle, free course preview videos, lesson content/video player, push notifications, login/OTP,
Daily Guidance from a server, real Kundali calculation (the chart on that screen is an illustration).
