package com.starlightastro.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.starlightastro.app.data.AppViewModel
import com.starlightastro.app.data.Catalog
import com.starlightastro.app.ui.*
import com.starlightastro.app.ui.theme.Astro

@Composable
fun CoursesScreen(vm: AppViewModel, go: (String) -> Unit) {
    Page("Astrology Courses") {
        Catalog.courses.forEach { c ->
            AstroCard {
                Text("${c.emoji} ${c.title}", color = Astro.Gold, fontSize = 20.sp, fontWeight = FontWeight.SemiBold)
                Text(c.summary)
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Column {
                        Muted("📅 ${c.durationLabel}")
                        Muted("Languages: ${c.languages}")
                    }
                    Text(rupees(c.price), color = Astro.Gold, fontSize = 28.sp, fontWeight = FontWeight.Bold)
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Muted("${c.curriculum.size} lessons")
                    SmallGoldButton(if (vm.isEnrolled(c.id)) "Enrolled ✓" else "View Course", { go("course/${c.id}") })
                }
            }
        }
        OutlinedButton({ go("myCourses") }, Modifier.fillMaxWidth()) { Text("My Courses", color = Astro.Gold) }
    }
}

@Composable
fun CourseDetailScreen(courseId: String, vm: AppViewModel, onBack: () -> Unit, go: (String) -> Unit) {
    val c = Catalog.course(courseId)
    Page(c.title, onBack) {
        Text(c.subtitle, color = Astro.TextMuted, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
        AstroCard {
            Text("Duration: ${c.durationLabel} / ${c.curriculum.size} Lessons")
            Text("Language: ${c.languages}")
            Text("Mode: ${c.mode}")
        }
        Heading("What You Will Learn")
        AstroCard { c.learn.forEach { Text("✦ $it") } }
        Heading("Course Curriculum")
        AstroCard { c.curriculum.forEachIndexed { i, t -> Text("Day ${i + 1}: $t") } }
        if (vm.isEnrolled(c.id)) {
            GoldButton("Go to My Courses", { go("myCourses") })
        } else {
            GoldButton("Enrol Now  ${rupees(c.price)}", { vm.startCourseCheckout(c); go("payment") })
        }
    }
}

@Composable
fun MyCoursesScreen(vm: AppViewModel, onBack: () -> Unit, go: (String) -> Unit) {
    Page("My Courses", onBack) {
        if (vm.enrollments.isEmpty()) {
            AstroCard {
                Text("You haven't enrolled in a course yet.")
                SmallGoldButton("Browse Courses", { go("courses") })
            }
        }
        vm.enrollments.forEach { e ->
            val c = Catalog.course(e.courseId)
            val total = c.curriculum.size
            val pct = e.completedLessons * 100 / total
            AstroCard {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(c.title, color = Astro.Gold, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
                    Chip("Purchased", Astro.Gold)
                }
                Muted("Course Progress")
                LinearProgressIndicator(
                    progress = { e.completedLessons / total.toFloat() },
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    color = Astro.Gold, trackColor = Astro.Gold.copy(alpha = 0.2f),
                )
                Muted("$pct% Completed")
                c.curriculum.forEachIndexed { i, t ->
                    val done = i < e.completedLessons
                    val current = i == e.completedLessons
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("${if (done) "✔" else "○"} $t", modifier = Modifier.weight(1f))
                        when {
                            done -> Text("Completed", color = Astro.Green, fontSize = 13.sp)
                            current -> Text("In Progress", color = Astro.TextMuted, fontSize = 13.sp)
                        }
                    }
                }
                if (e.completedLessons < total) {
                    SmallGoldButton("Mark Lesson ${e.completedLessons + 1} Complete", { vm.completeNextLesson(c.id) })
                } else Text("🎉 Course completed!", color = Astro.Green)
            }
        }
    }
}
