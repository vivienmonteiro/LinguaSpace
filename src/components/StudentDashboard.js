
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch("/api/student/courses");
        const result = await response.json();

        if (!result.success) {
          setError(result.message || "Gagal mengambil kursus.");
          return;
        }

        const enrolled = (result.data || []).filter(
          (course) => course.is_enrolled
        );

        const coursesWithProgress = await Promise.all(
          enrolled.map(async (course) => {
            try {
              const progressResponse = await fetch(
                `/api/student/learn?course_id=${course.id}`
              );

              const progressResult = await progressResponse.json();

              if (progressResult.success) {
                return {
                  ...course,
                  progress: progressResult.progress,
                };
              }

              return {
                ...course,
                progress: null,
              };
            } catch {
              return {
                ...course,
                progress: null,
              };
            }
          })
        );

        setCourses(result.data);
        setEnrolledCourses(coursesWithProgress);
      } catch {
        setError("Gagal menghubungi server.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch {
      setError("Gagal logout.");
    }
  }

  // Membuat inisial otomatis dari nama student
  const username = user?.username || "Student";

  const initials = username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // Menentukan bahasa dan flag kursus
  function getLanguageInfo(course) {
    const text = `${course.name || ""} ${course.category_name || ""}`.toLowerCase();

    if (text.includes("english")) {
      return {
        name: "English",
        flag: "🇬🇧",
        image: "english",
      };
    }

    if (text.includes("french")) {
      return {
        name: "French",
        flag: "🇫🇷",
        image: "french",
      };
    }

    if (text.includes("japanese")) {
      return {
        name: "Japanese",
        flag: "🇯🇵",
        image: "japanese",
      };
    }

    if (text.includes("korean")) {
      return {
        name: "Korean",
        flag: "🇰🇷",
        image: "korean",
      };
    }

    if (text.includes("mandarin") || text.includes("chinese")) {
      return {
        name: "Mandarin",
        flag: "🇨🇳",
        image: "mandarin",
      };
    }

    if (text.includes("german")) {
      return {
        name: "German",
        flag: "🇩🇪",
        image: "german",
      };
    }

    if (text.includes("spanish")) {
      return {
        name: "Spanish",
        flag: "🇪🇸",
        image: "spanish",
      };
    }

    if (text.includes("portuguese")) {
      return {
        name: "Portuguese",
        flag: "🇵🇹",
        image: "portuguese",
      };
    }

    return {
      name: course.category_name || "Language",
      flag: "🌍",
      image: "english",
    };
  }

  // Menghitung progress
  function getCourseProgress(course) {
    const progress = course.progress;

    const total =
      progress?.total_contents ??
      course.total_contents ??
      0;

    const completed =
      progress?.completed_contents ?? 0;

    const percentage =
      progress?.percentage ??
      (total > 0
        ? Math.round((completed / total) * 100)
        : 0);

    const isCompleted =
      total > 0 && completed >= total;

    return {
      total,
      completed,
      percentage,
      isCompleted,
    };
  }

  return (
    <div className="min-h-screen bg-[#f7f6ff] text-[#25245b]">

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] border-r border-purple-100 bg-white lg:flex lg:flex-col">

        {/* Logo */}
        <div className="flex h-[76px] items-center gap-3 border-b border-purple-100 px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xl text-white">
            🪐
          </div>

          <span className="text-xl font-extrabold tracking-tight text-violet-700">
            LinguaSpace
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-7 space-y-2 px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3.5 font-semibold text-white shadow-md shadow-purple-200"
          >
            <span className="text-xl">⌂</span>
            Dashboard
          </Link>

          <Link
            href="/student/courses"
            className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-[#393779] transition hover:bg-purple-50"
          >
            <span className="text-xl">📚</span>
            Kursus Saya
          </Link>

          <Link
            href="/student/history"
            className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-[#393779] transition hover:bg-purple-50"
          >
            <span className="text-xl">◷</span>
            Riwayat Belajar
          </Link>

          <Link
            href="/student/profile"
            className="flex items-center gap-4 rounded-2xl px-5 py-3.5 text-[#393779] transition hover:bg-purple-50"
          >
            <span className="text-xl">♙</span>
            Profil
          </Link>
        </nav>

        {/* Sidebar Decoration */}
        <div className="m-5 mt-auto overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100 to-purple-50 p-5">
          <p className="text-center font-bold italic text-violet-500">
            Keep Learning,
            <br />
            Reach Your Dreams!
          </p>

          <div className="mt-4 text-center text-6xl">
            📚
          </div>

          <div className="mt-2 text-center text-3xl">
            🌱 💜
          </div>
        </div>
      </aside>

      {/* ================= MOBILE NAVIGATION ================= */}
      <div className="sticky top-0 z-30 border-b border-purple-100 bg-white lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪐</span>
            <span className="font-extrabold text-violet-700">
              LinguaSpace
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          <Link
            href="/dashboard"
            className="shrink-0 rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/student/courses"
            className="shrink-0 rounded-xl bg-purple-50 px-4 py-2 text-sm text-violet-700"
          >
            Kursus Saya
          </Link>

          <Link
            href="/student/history"
            className="shrink-0 rounded-xl bg-purple-50 px-4 py-2 text-sm text-violet-700"
          >
            Riwayat Belajar
          </Link>

          <Link
            href="/student/profile"
            className="shrink-0 rounded-xl bg-purple-50 px-4 py-2 text-sm text-violet-700"
          >
            Profil
          </Link>
        </nav>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="lg:ml-[250px]">

        {/* Top Header */}
        <header className="hidden h-[76px] items-center justify-end border-b border-purple-100 bg-white px-8 lg:flex">
          <div className="flex items-center gap-3">

            {/* Inisial Student */}
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
              {initials}
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="p-5 md:p-8">

          {/* ================= WELCOME BANNER ================= */}
          <section className="relative mb-7 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] px-7 py-8 md:px-10">

            <div className="relative z-10 max-w-xl">
              <h1 className="text-3xl font-extrabold leading-tight text-violet-800 md:text-4xl">
                Selamat Datang Kembali,
                <br className="hidden md:block" />
                {username}! 👋
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-violet-700 md:text-base">
                Mari lanjutkan perjalanan belajarmu di LinguaSpace.
              </p>

              <p className="mt-2 text-sm text-violet-500">
                Belajar bahasa baru, buka dunia baru! ✨
              </p>
            </div>

            {/* Dekorasi lingkaran tanpa avatar dan tulisan bahasa */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-200/50" />
            <div className="absolute right-40 bottom-0 h-24 w-24 rounded-full bg-violet-200/40" />
          </section>

          {/* ================= STATISTICS ================= */}
          <section className="mb-7 grid gap-4 md:grid-cols-3">

            {/* Available Courses */}
            <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
                  📚
                </div>

                <div>
                  <p className="text-sm text-violet-600">
                    Kursus Tersedia
                  </p>

                  <h3 className="mt-1 text-3xl font-extrabold text-violet-800">
                    {loading ? "..." : courses.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
                  ✅
                </div>

                <div>
                  <p className="text-sm text-violet-600">
                    Kursus Saya
                  </p>

                  <h3 className="mt-1 text-3xl font-extrabold text-violet-800">
                    {loading ? "..." : enrolledCourses.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Learning Status */}
            <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
                  ⭐
                </div>

                <div>
                  <p className="text-sm text-violet-600">
                    Status Belajar
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-violet-800">
                    Siap untuk belajar
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* ================= EXPLORE COURSES ================= */}
          <section className="mb-6 overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-5 p-6 md:flex-row">
              <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-50 md:w-44">
                <span className="text-6xl">🌎📚</span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-violet-800">
                  Explore Courses
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Temukan kursus bahasa yang ingin kamu pelajari.
                </p>
              </div>

              <Link
                href="/student/courses"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-md shadow-purple-200 transition hover:scale-[1.02] md:w-auto"
              >
                Browse Courses
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* ================= APPLY TO BECOME TEACHER ================= */}
          <section className="mb-7 overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm">
            <div className="flex flex-col items-center gap-5 p-6 md:flex-row">
              <div className="flex h-28 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 md:w-44">
                <span className="text-6xl">👩🏻‍🏫🎓</span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-violet-800">
                  Apply to Become a Teacher
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Punya kemampuan bahasa yang ingin dibagikan?
                  Daftarkan dirimu menjadi pengajar di LinguaSpace.
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Pengajuan akan ditinjau dan disetujui oleh Admin.
                </p>
              </div>

              <Link
                href="/teacher-application"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-md shadow-purple-200 transition hover:scale-[1.02] md:w-auto"
              >
                Apply to Become a Teacher
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* ================= MY COURSES ================= */}
          <section className="rounded-[24px] border border-purple-100 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>

                <h2 className="text-xl font-extrabold text-violet-900">
                  My Courses
                </h2>
              </div>

              <Link
                href="/student/courses"
                className="text-sm font-semibold text-violet-600 transition hover:text-violet-800"
              >
                Lihat Semua →
              </Link>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-violet-500" />

                <p className="mt-4 text-gray-500">
                  Sedang mengambil kursus...
                </p>
              </div>
            ) : enrolledCourses.length === 0 ? (
              /* Empty State */
              <div className="rounded-2xl bg-purple-50 px-6 py-12 text-center">
                <div className="text-5xl">📖</div>

                <h3 className="mt-4 font-bold text-violet-800">
                  Kamu belum mengikuti kursus apa pun
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Yuk, cari kursus bahasa yang menarik untukmu!
                </p>

                <Link
                  href="/student/courses"
                  className="mt-5 inline-block rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
                >
                  Explore Courses
                </Link>
              </div>
            ) : (
              /* Course Cards */
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {enrolledCourses.map((course) => {
                  const info = getLanguageInfo(course);
                  const progress = getCourseProgress(course);

                  return (
                    <div
                      key={course.id}
                      className="group overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Course Image */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">
                        <img
                          src={`/images/courses/${info.image}.JPEG`}
                          alt={info.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const img = e.currentTarget;
                            const extensions = [
                              ".jpg",
                              ".jpeg",
                              ".JPG",
                            ];

                            const currentIndex =
                              Number(img.dataset.fallbackIndex || 0);

                            if (currentIndex < extensions.length) {
                              img.dataset.fallbackIndex =
                                currentIndex + 1;

                              img.src =
                                `/images/courses/${info.image}` +
                                extensions[currentIndex];
                            } else {
                              img.style.display = "none";
                            }
                          }}
                        />

                        {/* Flag */}
                        <div className="absolute right-3 top-3 rounded-xl bg-white/90 px-3 py-1.5 text-2xl shadow-sm">
                          {info.flag}
                        </div>

                        {/* Language Badge */}
                        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                          {course.level || "Language Course"}
                        </div>
                      </div>

                      {/* Course Information */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-violet-900">
                          {course.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {info.flag} {info.name}
                        </p>

                        {/* Progress */}
                        <div className="mt-5">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Learning Progress
                            </span>

                            <span className="text-sm font-bold text-violet-600">
                              {progress.percentage}%
                            </span>
                          </div>

                          <div className="h-2.5 overflow-hidden rounded-full bg-purple-100">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                progress.isCompleted
                                  ? "bg-green-500"
                                  : "bg-gradient-to-r from-violet-500 to-purple-600"
                              }`}
                              style={{
                                width: `${progress.percentage}%`,
                              }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-gray-500">
                            {progress.completed} dari {progress.total} materi selesai
                          </p>
                        </div>

                        {/* Status */}
                        <div className="mt-4">
                          {progress.isCompleted ? (
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              ✓ Kursus selesai
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-violet-700">
                              Sedang belajar
                            </span>
                          )}
                        </div>

                        {/* Continue Learning */}
                        <Link
                          href={`/student/learn/${course.id}`}
                          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:shadow-md"
                        >
                          {progress.isCompleted
                            ? "Review Course"
                            : "Continue Learning"}

                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="py-8 text-center text-sm text-violet-400">
            © 2026 LinguaSpace · Keep learning, keep growing 💜
          </footer>

        </div>
      </main>
    </div>
  );
}
