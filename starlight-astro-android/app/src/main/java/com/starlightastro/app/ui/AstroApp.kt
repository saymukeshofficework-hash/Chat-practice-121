package com.starlightastro.app.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.starlightastro.app.data.AppViewModel
import com.starlightastro.app.ui.screens.*
import com.starlightastro.app.ui.theme.Astro

private data class Tab(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab("home", "Home", Icons.Filled.Home),
    Tab("courses", "Courses", Icons.Filled.School),
    Tab("consult", "Consult", Icons.Filled.Call),
    Tab("profile", "Profile", Icons.Filled.Person),
)

private fun NavHostController.goTab(route: String) = navigate(route) {
    popUpTo(graph.findStartDestination().id) { saveState = true }
    launchSingleTop = true
    restoreState = true
}

@Composable
fun AstroApp(vm: AppViewModel = viewModel()) {
    val nav = rememberNavController()
    val entry by nav.currentBackStackEntryAsState()
    val route = entry?.destination?.route

    // Tabs switch the bottom bar; everything else is pushed on top.
    val go: (String) -> Unit = { r -> if (tabs.any { it.route == r }) nav.goTab(r) else nav.navigate(r) }
    val back: () -> Unit = { nav.popBackStack() }

    Scaffold(
        containerColor = Astro.Night,
        bottomBar = {
            NavigationBar(containerColor = Astro.Night) {
                tabs.forEach { t ->
                    // Highlight the tab that owns the current screen.
                    val selected = when (route) {
                        "kundali", "tarot", "handwriting" -> t.route == "home"
                        "myCourses", "course/{id}" -> t.route == "courses"
                        "book/{id}", "payment", "confirmation", "myBookings" -> t.route == "consult"
                        else -> t.route == route
                    }
                    NavigationBarItem(
                        selected = selected,
                        onClick = { nav.goTab(t.route) },
                        icon = { Icon(t.icon, contentDescription = t.label) },
                        label = { Text(t.label) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Astro.GoldText, selectedTextColor = Astro.Gold,
                            indicatorColor = Astro.Gold, unselectedIconColor = Astro.TextMuted, unselectedTextColor = Astro.TextMuted,
                        ),
                    )
                }
            }
        },
    ) { pad ->
        NavHost(nav, startDestination = "home", modifier = Modifier.padding(pad)) {
            composable("home") { HomeScreen(vm.profileName, go) }
            composable("courses") { CoursesScreen(vm, go) }
            composable("consult") { ConsultScreen(go) }
            composable("profile") { ProfileScreen(vm, go) }
            composable("kundali") { KundaliScreen(back, go) }
            composable("tarot") { TarotScreen(back, go) }
            composable("handwriting") { HandwritingScreen(back, go) }
            composable("course/{id}") { CourseDetailScreen(it.arguments?.getString("id") ?: "astrology", vm, back, go) }
            composable("book/{id}") { BookingDetailsScreen(it.arguments?.getString("id") ?: "tarot", vm, back, go) }
            composable("payment") {
                PaymentScreen(vm, back) { isService ->
                    nav.navigate(if (isService) "confirmation" else "myCourses") {
                        popUpTo("payment") { inclusive = true }
                    }
                }
            }
            composable("confirmation") { ConfirmationScreen(vm, onHome = { nav.goTab("home") }, go = go) }
            composable("myBookings") { MyBookingsScreen(vm, back, go) }
            composable("myCourses") { MyCoursesScreen(vm, back, go) }
        }
    }
}
