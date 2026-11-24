"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // AMBIL DATA KURSUS DARI DATABASE
  // ==============================
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses");

        if (!response.ok) {
          throw new Error("Gagal mengambil data kursus");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setCourses(result.data);
      } catch (error) {
        console.error(error);
        setError("Kursus gagal dimuat. Silakan coba kembali.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // ==============================
  // DAFTAR BAHASA
  // ==============================

  const languageIcons = {
    English: "gb",
    Japanese: "jp",
    Korean: "kr",
    French: "fr",
    Spanish: "es",
    Mandarin: "cn",
    Portuguese: "pt",
    "European Portuguese": "pt",
  };

  const languageNames = {
    English: "Inggris",
    Japanese: "Jepang",
    Korean: "Korea",
    French: "Prancis",
    Spanish: "Spanyol",
    Mandarin: "Mandarin",
    Portuguese: "Portugis",
    "European Portuguese": "Portugis",
  };

  // Gambar lokal untuk setiap bahasa
  const courseImages = {
    English: "/images/courses/english.jpeg",
    Japanese: "/images/courses/japanese.jpeg",
    Korean: "/images/courses/korean.jpeg",
    French: "/images/courses/french.jpeg",
    Spanish: "/images/courses/spanish.jpeg",
    Mandarin: "/images/courses/mandarin.jpeg",
    Portuguese: "/images/courses/portuguese.jpeg",
    "European Portuguese": "/images/courses/portuguese.jpeg",
  };

  // Menghilangkan German dari daftar
  const languages = [
    "All",
    ...new Set(
      courses
        .map((course) => course.category_name)
        .filter(Boolean)
        .filter(
          (language) =>
            !language.toLowerCase().includes("german") &&
            !language.toLowerCase().includes("deutsch")
        )
    ),
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  // ==============================
  // FILTER KURSUS
  // ==============================

  const filteredCourses = courses.filter((course) => {
    const category = course.category_name || "";

    // Jangan tampilkan German
    const isGerman =
      category.toLowerCase().includes("german") ||
      category.toLowerCase().includes("deutsch");

    if (isGerman) return false;

    const searchText = search.toLowerCase();

    const matchesSearch =
      course.name?.toLowerCase().includes(searchText) ||
      course.description?.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText);

    const matchesLanguage =
      selectedLanguage === "All" ||
      category === selectedLanguage;

    const matchesLevel =
      selectedLevel === "All" ||
      course.level?.toLowerCase() === selectedLevel.toLowerCase();

    return matchesSearch && matchesLanguage && matchesLevel;
  });

  // ==============================
  // FOOTER SOCIAL MEDIA
  // ==============================

  const socialMedia = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.6 15.3V8.7l5.8 3.3-5.8 3.3Z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.6 6.2a5.5 5.5 0 0 1-3.4-3.8V2h-3.7v13.4a3.1 3.1 0 1 1-3.1-3.1c.5 0 1 .1 1.4.3V8.8a6.8 6.8 0 0 0-1.4-.2A6.8 6.8 0 1 0 16.2 15V8.2a9.2 9.2 0 0 0 4.8 1.4V5.9a5.4 5.4 0 0 1-1.4.3Z" />
        </svg>
      ),
    },
    {
      name: "X",
      url: "https://x.com/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.1L5.7 22H2.5l7.3-8.4L1 2h6.5l4.5 6.5L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5v-9h3v9ZM6.5 8a1.7 1.7 0 1 1 0-3.4A1.7 1.7 0 0 1 6.5 8ZM19 19h-3v-4.4c0-1.1 0-2.5-1.5-2.5s-1.7 1.2-1.7 2.4V19h-3v-9h2.9v1.2h.1a3.2 3.2 0 0 1 2.8-1.5c3 0 3.5 2 3.5 4.5V19Z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf9ff] text-[#30256f]">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="sticky top-0 z-50 border-b border-purple-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🪐</span>

            <span className="text-xl font-extrabold tracking-tight text-[#4933a5]">
              LinguaSpace
            </span>
          </Link>

          {/* MENU */}
          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/"
              className="font-medium text-gray-600 transition hover:text-purple-600"
            >
              Beranda
            </Link>

            <Link
              href="/courses"
              className="font-semibold text-purple-600"
            >
              Kursus
            </Link>

            <a
              href="#footer"
              className="font-medium text-gray-600 transition hover:text-purple-600"
            >
              Tentang Kami
            </a>

          </div>

          {/* LOGIN */}
          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Login
          </Link>

        </div>
      </nav>

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="relative overflow-hidden bg-gradient-to-r from-[#eee9ff] via-[#f8f5ff] to-[#e9e5ff] px-6 py-16 md:py-20">

        {/* Dekorasi */}
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="max-w-3xl">

            <span className="inline-flex items-center rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-sm font-semibold text-purple-600 shadow-sm">
              ✨ Explore Your Learning Journey
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-[#30256f] md:text-6xl">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Courses
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
              Temukan kursus bahasa yang sesuai dengan tujuanmu.
              Dari pemula hingga mahir, mulai perjalanan
              multibahasamu bersama LinguaSpace!
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-2xl border border-purple-100 bg-white/80 px-5 py-3 shadow-sm">
                <span className="mr-2">📚</span>
                <span className="text-sm font-semibold text-purple-800">
                  Materi Terstruktur
                </span>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white/80 px-5 py-3 shadow-sm">
                <span className="mr-2">👩‍🏫</span>
                <span className="text-sm font-semibold text-purple-800">
                  Tutor Profesional
                </span>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white/80 px-5 py-3 shadow-sm">
                <span className="mr-2">🏆</span>
                <span className="text-sm font-semibold text-purple-800">
                  Belajar Bertahap
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          SEARCH & FILTER
      ========================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10">

        <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm md:p-7">

          {/* SEARCH */}
          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-500">
              🔍
            </span>

            <input
              type="text"
              placeholder="Cari kursus, bahasa, atau level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-purple-100 bg-[#fcfbff] py-3.5 pl-12 pr-5 text-gray-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
            />

          </div>

          {/* FILTER BAHASA */}
          <div className="mt-7">

            <p className="mb-3 text-sm font-bold text-[#4933a5]">
              Bahasa
            </p>

            <div className="flex flex-wrap gap-2">

              {languages.map((language) => (

                <button
                  key={language}
                  onClick={() => setSelectedLanguage(language)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                    selectedLanguage === language
                      ? "border-purple-600 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200"
                      : "border-purple-100 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >

                  {language === "All" ? (
                    <span>✨</span>
                  ) : (
                    <img
                      src={`/images/flags/${languageIcons[language]}.svg`}
                      alt={`Bendera ${language}`}
                      className="h-5 w-5 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  {language === "All"
                    ? "Semua Bahasa"
                    : languageNames[language] || language}

                </button>

              ))}

            </div>
          </div>

          {/* FILTER LEVEL */}
          <div className="mt-7">

            <p className="mb-3 text-sm font-bold text-[#4933a5]">
              Level
            </p>

            <div className="flex flex-wrap gap-2">

              {levels.map((level) => (

                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? "border-purple-600 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200"
                      : "border-purple-100 bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {level === "All" ? "Semua Level" : level}
                </button>

              ))}

            </div>
          </div>

        </div>

        {/* ==========================================
            COURSE TITLE
        ========================================== */}

        <div className="mb-6 mt-10 flex flex-wrap items-end justify-between gap-3">

          <div>

            <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
              ✨ Kursus Pilihan
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#30256f]">
              Kursus Tersedia
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Pilih kursus yang sesuai dengan minat dan tujuan belajarmu.
            </p>

          </div>

          <div className="rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600">
            {filteredCourses.length} kursus ditemukan
          </div>

        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="rounded-3xl border border-purple-100 bg-white py-20 text-center shadow-sm">

            <div className="mb-4 text-5xl animate-pulse">
              🪐
            </div>

            <p className="font-medium text-purple-600">
              Sedang memuat kursus...
            </p>

          </div>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}

        {!loading && error && (

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>

        )}

        {/* ==========================================
            EMPTY
        ========================================== */}

        {!loading && !error && filteredCourses.length === 0 && (

          <div className="rounded-3xl border border-purple-100 bg-white px-6 py-16 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              📚
            </div>

            <h3 className="text-xl font-bold text-[#30256f]">
              Kursus Tidak Ditemukan
            </h3>

            <p className="mt-2 text-gray-500">
              Coba gunakan kata kunci atau filter yang berbeda.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedLanguage("All");
                setSelectedLevel("All");
              }}
              className="mt-6 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Reset Filter
            </button>

          </div>

        )}

        {/* ==========================================
            COURSE CARDS
        ========================================== */}

        {!loading && !error && filteredCourses.length > 0 && (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredCourses.map((course) => {

              const language = course.category_name || "";
              const flag = languageIcons[language];
              const localImage = courseImages[language];

              return (

                <article
                  key={course.id}
                  className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-100"
                >

                  {/* COURSE IMAGE */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100">

                    {localImage ? (

                      <img
                        src={localImage}
                        alt={`Ilustrasi kursus ${language}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Jika foto lokal gagal, gunakan cover database
                          if (
                            course.cover_image &&
                            e.currentTarget.src !== course.cover_image
                          ) {
                            e.currentTarget.src = course.cover_image;
                          } else {
                            e.currentTarget.style.display = "none";
                          }
                        }}
                      />

                    ) : course.cover_image ? (

                      <img
                        src={course.cover_image}
                        alt={course.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-7xl">
                        🌍
                      </div>

                    )}

                    {/* LEVEL BADGE */}
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-purple-600 shadow-sm">
                      {course.level || "All Levels"}
                    </span>

                    {/* FLAG */}
                    {flag && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 shadow-sm">

                        <img
                          src={`/images/flags/${flag}.svg`}
                          alt={`Bendera ${language}`}
                          className="h-5 w-5 rounded-full object-cover"
                        />

                        <span className="text-xs font-bold text-purple-700">
                          {language}
                        </span>

                      </div>
                    )}

                  </div>

                  {/* COURSE DETAILS */}
                  <div className="p-5">

                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-500">
                      {languageNames[language] || language || "Bahasa"}
                    </p>

                    <h3 className="min-h-[52px] text-lg font-bold leading-6 text-[#30256f]">
                      {course.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-6 text-gray-500">
                      {course.description ||
                        "Mulai perjalanan belajar bahasa baru bersama LinguaSpace."}
                    </p>

                    {/* INFO */}
                    <div className="mt-5 border-t border-purple-50 pt-4">

                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">

                        <span className="text-purple-500">
                          👩‍🏫
                        </span>

                        <span>
                          Teacher ID: {course.teacher_id ?? "Belum tersedia"}
                        </span>

                      </div>

                      {/* BUTTON */}
                      <Link
                        href="/login"
                        className="block rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-purple-100 transition hover:shadow-lg hover:shadow-purple-200"
                      >
                        Enroll Now →
                      </Link>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </section>

      {/* ==========================================
          CTA
      ========================================== */}

      <section className="mx-5 mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-[#7250ed] via-[#8967f5] to-[#a28aff] md:mx-auto md:max-w-7xl">

        <div className="relative px-7 py-12 md:px-14 md:py-14">

          {/* Dekorasi */}
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">

            <div className="max-w-2xl">

              <p className="text-sm font-semibold text-purple-100">
                ✨ Bersama LinguaSpace
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
                Ready to Start Learning?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-purple-100">
                Jelajahi berbagai kursus, tingkatkan kemampuan bahasa,
                dan capai tujuanmu bersama LinguaSpace.
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-purple-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Buat Akun Sekarang →
              </Link>

            </div>

            <div className="text-8xl opacity-90 md:text-9xl">
              📚
            </div>

          </div>

        </div>

      </section>

      {/* ==========================================
          FOOTER
          TENTANG KAMI LANGSUNG MENUJU BAGIAN INI
      ========================================== */}

      <footer
        id="footer"
        className="relative scroll-mt-20 overflow-hidden border-t border-purple-100 bg-gradient-to-r from-[#f0ecff] via-[#faf9ff] to-[#f0ecff]"
      >

        {/* Dekorasi */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full border-[20px] border-purple-100/60" />
        <div className="pointer-events-none absolute -right-12 -bottom-20 h-48 w-48 rounded-full bg-purple-100/50" />

        <div className="relative mx-auto max-w-7xl px-6 py-9">

          <div className="flex flex-col items-center justify-between gap-7 md:flex-row">

            {/* LOGO + TAGLINE */}
            <Link href="/" className="flex items-center gap-3">

              <span className="text-4xl">
                🪐
              </span>

              <div>

                <h2 className="text-xl font-extrabold text-[#4933a5]">
                  LinguaSpace
                </h2>

                <p className="mt-1 text-xs tracking-wide text-gray-500">
                  Learn · Connect · Grow
                </p>

              </div>

            </Link>

            {/* SOCIAL MEDIA */}
            <div className="flex items-center gap-4">

              {socialMedia.map((social) => (

                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[#4933a5] transition hover:-translate-y-1 hover:bg-purple-100 hover:text-purple-700"
                >

                  <span className="h-5 w-5">
                    {social.icon}
                  </span>

                </a>

              ))}

            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="mt-7 border-t border-purple-100 pt-5 text-center">

            <p className="text-xs text-gray-500">
              © 2026 LinguaSpace. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}