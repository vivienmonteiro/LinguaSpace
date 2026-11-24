
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeacherDashboard({ user }) {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalContents: 0,
    courses: [],
    students: [],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const username = user?.username || "Teacher";

  // Membuat inisial otomatis
  const initials = username
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const dashboardUrl = "/teacher/dashboard";

  // Menu sidebar Teacher
  const menuItems = [
    {
      label: "Dashboard",
      href: dashboardUrl,
      icon: "⌂",
    },
    {
      label: "Kursus Saya",
      href: `${dashboardUrl}#courses`,
      icon: "📚",
    },
    {
      label: "Student Saya",
      href: `${dashboardUrl}#students`,
      icon: "♧",
    },
    {
      label: "Profil",
      href: `${dashboardUrl}#profile`,
      icon: "♙",
    },
  ];

  // Mengambil data dashboard Teacher
  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/teacher/stats");
        const result = await response.json();

        if (!result.success) {
          setMessage(
            result.message || "Gagal mengambil data dashboard."
          );
          return;
        }

        setStats({
          totalCourses: result.data.totalCourses || 0,
          totalStudents: result.data.totalStudents || 0,
          totalContents: result.data.totalContents || 0,
          courses: result.data.courses || [],
          students: result.data.students || [],
        });
      } catch {
        setMessage("Gagal menghubungi server.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Logout
  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        setMessage("Gagal logout. Silakan coba lagi.");
      }
    } catch {
      setMessage("Gagal logout. Silakan coba lagi.");
    }
  }

  // Menentukan bahasa dan gambar kursus
  function getLanguageInfo(course) {
    const text = `${course.name || ""} ${
      course.category_name || ""
    }`.toLowerCase();

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

  return (
    <div className="min-h-screen scroll-smooth bg-[#f7f6ff] text-[#25245b]">

      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}
        <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] flex-col border-r border-purple-100 bg-white px-5 py-7 lg:flex">

          {/* Logo */}
          <Link
            href={dashboardUrl}
            className="mb-10 flex items-center gap-3 px-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-md shadow-purple-200">
              🪐
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-violet-700">
                LinguaSpace
              </h1>

              <p className="text-xs text-gray-400">
                Teacher Panel
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menu Utama
          </p>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) =>
              item.label === "Dashboard" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3.5 font-semibold text-white shadow-md shadow-purple-200"
                >
                  <span className="w-5 text-center text-xl">
                    {item.icon}
                  </span>

                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 rounded-2xl px-5 py-3.5 font-semibold text-[#393779] transition hover:bg-purple-50"
                >
                  <span className="w-5 text-center text-xl">
                    {item.icon}
                  </span>

                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Sidebar Decoration */}
          <div className="m-1 mt-auto overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100 to-purple-50 p-5">
            <p className="text-center font-bold italic text-violet-500">
              Keep Teaching,
              <br />
              Inspire Your Students!
            </p>

            <div className="mt-4 text-center text-6xl">
              📚
            </div>

            <div className="mt-2 text-center text-3xl">
              🌱 💜
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <span className="text-xl">↪</span>
            Logout
          </button>

        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:ml-[250px] lg:px-10 lg:py-8">

          {/* ================= TOP HEADER ================= */}
          <header className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-400">
                Teacher Dashboard
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-800 sm:text-2xl">
                Dashboard
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                {initials}
              </div>
            </div>

          </header>

          {/* ================= MOBILE NAVIGATION ================= */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">

            {menuItems.map((item) =>
              item.label === "Dashboard" ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="shrink-0 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-violet-700 shadow-sm"
                >
                  {item.label}
                </a>
              )
            )}

            <button
              onClick={handleLogout}
              className="shrink-0 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500"
            >
              Logout
            </button>

          </div>

          {/* ================= WELCOME BANNER ================= */}
          <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] px-7 py-8 md:px-10">

            <div className="relative z-10 max-w-xl">

              <p className="mb-2 text-sm font-medium text-violet-600">
                Welcome Back, Teacher!
              </p>

              <h1 className="text-3xl font-extrabold leading-tight text-violet-800 md:text-4xl">
                Hello, {username}! 👋
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-violet-700 md:text-base">
                Selamat datang kembali di LinguaSpace. Kelola kursus,
                materi pembelajaran, dan pantau student Anda melalui
                dashboard ini.
              </p>

              <a
                href={`${dashboardUrl}#courses`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:scale-[1.02]"
              >
                Kelola Kursus
                <span>→</span>
              </a>

            </div>

            {/* Dekorasi */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-purple-200/50" />

            <div className="pointer-events-none absolute right-40 bottom-0 h-28 w-28 rounded-full bg-violet-200/40" />

            <div className="pointer-events-none absolute right-16 top-12 h-5 w-5 rounded-full bg-purple-300/50" />

          </section>

          {/* ================= ERROR MESSAGE ================= */}
          {message && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {message}
            </div>
          )}

          {/* ================= STATISTICS ================= */}
          <section className="mb-9">

            <div className="mb-5">
              <h2 className="text-lg font-bold text-violet-900">
                Teaching Overview
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Ringkasan aktivitas pengajaran Anda di LinguaSpace.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {/* Total Courses */}
              <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-2xl">
                    📚
                  </div>

                  <div>
                    <p className="text-sm text-violet-600">
                      Total Courses
                    </p>

                    <h3 className="mt-1 text-3xl font-extrabold text-violet-800">
                      {loading ? "..." : stats.totalCourses}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Kursus yang Anda ajarkan
                    </p>
                  </div>

                </div>
              </div>

              {/* Total Students */}
              <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                    ♧
                  </div>

                  <div>
                    <p className="text-sm text-violet-600">
                      Total Students
                    </p>

                    <h3 className="mt-1 text-3xl font-extrabold text-violet-800">
                      {loading ? "..." : stats.totalStudents}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Student yang mengikuti kursus
                    </p>
                  </div>

                </div>
              </div>

              {/* Total Contents */}
              <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-2xl">
                    📝
                  </div>

                  <div>
                    <p className="text-sm text-violet-600">
                      Total Materi
                    </p>

                    <h3 className="mt-1 text-3xl font-extrabold text-violet-800">
                      {loading ? "..." : stats.totalContents}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Materi dari seluruh kursus Anda
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </section>

          {/* ================= KURSUS SAYA ================= */}
          <section
            id="courses"
            className="mb-9 scroll-mt-8"
          >

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

              <div>
                <h2 className="text-xl font-extrabold text-violet-900">
                  Kursus Saya
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Daftar kursus yang sedang Anda ajarkan.
                </p>
              </div>

              <span className="rounded-xl bg-purple-100 px-4 py-2 text-sm font-semibold text-violet-700">
                {stats.totalCourses} Kursus
              </span>

            </div>

            {loading ? (

              <div className="rounded-2xl border border-purple-100 bg-white p-10 text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-violet-500" />

                <p className="mt-4 text-sm text-gray-500">
                  Memuat data kursus...
                </p>

              </div>

            ) : stats.courses.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-12 text-center">

                <div className="text-5xl">
                  📚
                </div>

                <h3 className="mt-4 font-bold text-violet-800">
                  Belum Ada Kursus
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Kursus yang Anda ajarkan akan ditampilkan di bagian ini.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {stats.courses.map((course) => {
                  const info = getLanguageInfo(course);

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

                            const currentIndex = Number(
                              img.dataset.fallbackIndex || 0
                            );

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

                        {/* Language */}
                        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
                          {course.level || "Language Course"}
                        </div>

                      </div>

                      {/* Course Information */}
                      <div className="p-5">

                        {course.category_name && (
                          <span className="mb-3 inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-violet-700">
                            {course.category_name}
                          </span>
                        )}

                        <h3 className="min-h-12 text-lg font-bold text-violet-900">
                          {course.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {info.flag} {info.name}
                        </p>

                        <div className="mt-5 border-t border-purple-100 pt-4">

                          <Link
                            href={`/teacher/courses/${course.id}/contents`}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
                          >
                            Kelola Materi
                            <span>→</span>
                          </Link>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* ================= STUDENT SAYA ================= */}
          <section
            id="students"
            className="mb-9 scroll-mt-8"
          >

            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-violet-900">
                Student Saya
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Daftar student yang mengikuti kursus Anda.
              </p>
            </div>

            {/* Total Student */}
            <div className="mb-5 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                    ♧
                  </div>

                  <div>
                    <h3 className="font-bold text-violet-900">
                      Total Student Terdaftar
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Jumlah student unik di seluruh kursus Anda.
                    </p>
                  </div>

                </div>

                <div className="text-right">
                  <p className="text-3xl font-extrabold text-violet-700">
                    {loading ? "..." : stats.totalStudents}
                  </p>

                  <p className="text-xs text-gray-400">
                    Student
                  </p>
                </div>

              </div>
            </div>

            {/* Student List */}
            {loading ? (

              <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center text-sm text-gray-500">
                Memuat data student...
              </div>

            ) : stats.students.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-12 text-center">

                <div className="text-5xl">
                  👥
                </div>

                <h3 className="mt-4 font-bold text-violet-800">
                  Belum Ada Student
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Student yang mengikuti kursus Anda akan ditampilkan di sini.
                </p>

              </div>

            ) : (

              <div className="grid gap-4 md:grid-cols-2">

                {stats.students.map((student) => {
                  const studentName = student.username || "Student";

                  const studentInitials = studentName
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("");

                  return (
                    <div
                      key={student.id}
                      className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >

                      <div className="flex items-start gap-4">

                        {/* Student Avatar */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
                          {studentInitials}
                        </div>

                        {/* Student Information */}
                        <div className="min-w-0 flex-1">

                          <h3 className="font-bold text-violet-900">
                            {studentName}
                          </h3>

                          <p className="mt-1 break-all text-sm text-gray-500">
                            {student.email || "Email tidak tersedia"}
                          </p>

                          <div className="mt-3">

                            <p className="mb-2 text-xs font-semibold text-violet-600">
                              Kursus yang Diikuti:
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {(student.course_names || []).map(
                                (courseName, index) => (
                                  <span
                                    key={`${student.id}-${index}`}
                                    className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-violet-700"
                                  >
                                    {courseName}
                                  </span>
                                )
                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* ================= PROFIL TEACHER ================= */}
          <section
            id="profile"
            className="mb-8 scroll-mt-8"
          >

            <div className="mb-5">
              <h2 className="text-xl font-extrabold text-violet-900">
                Profil Teacher
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Informasi akun yang sedang Anda gunakan.
              </p>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-sm">

              {/* Profile Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] px-6 py-8">

                <div className="relative z-10 flex flex-col items-center gap-4 sm:flex-row">

                  {/* Avatar */}
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-2xl font-extrabold text-white shadow-lg shadow-purple-200">
                    {initials}
                  </div>

                  {/* Name and Role */}
                  <div className="text-center sm:text-left">

                    <h3 className="text-xl font-extrabold text-violet-900">
                      {username}
                    </h3>

                    <p className="mt-1 text-sm text-violet-600">
                      {user?.email || "Email tidak tersedia"}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-bold text-violet-700 shadow-sm">
                      Teacher
                    </span>

                  </div>

                </div>

                {/* Decoration */}
                <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-purple-200/50" />

                <div className="pointer-events-none absolute bottom-0 right-40 h-20 w-20 rounded-full bg-violet-200/40" />

              </div>

              {/* Profile Details */}
              <div className="grid gap-5 p-6 sm:grid-cols-2">

                <div className="rounded-2xl bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                    Username
                  </p>

                  <p className="mt-2 font-bold text-violet-900">
                    {username}
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                    Email
                  </p>

                  <p className="mt-2 break-all font-bold text-violet-900">
                    {user?.email || "Email tidak tersedia"}
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-50 p-4 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                    Account Role
                  </p>

                  <p className="mt-2 font-bold text-violet-900">
                    Teacher
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* ================= FOOTER ================= */}
          <footer className="border-t border-purple-100 py-7 text-center">
            <p className="text-sm text-violet-400">
              © 2026 LinguaSpace · Keep learning, keep growing 💜
            </p>
          </footer>

        </main>

      </div>

    </div>
  );
}
