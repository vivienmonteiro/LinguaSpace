"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const [languages, setLanguages] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // MENGAMBIL DATA DARI API
  // =========================================
  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [categoryResponse, courseResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/courses"),
        ]);

        if (!categoryResponse.ok || !courseResponse.ok) {
          throw new Error("Gagal mengambil data");
        }

        const categoryResult = await categoryResponse.json();
        const courseResult = await courseResponse.json();

        if (!categoryResult.success || !courseResult.success) {
          throw new Error("Data gagal dimuat");
        }

        setLanguages(categoryResult.data);
        setCourses(courseResult.data);
      } catch (error) {
        console.error(error);
        setError("Data gagal dimuat. Silakan coba kembali.");
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  // =========================================
  // BENDERA BAHASA
  // =========================================
  const languageFlags = {
    English: "/images/flags/gb.svg",
    Japanese: "/images/flags/jp.svg",
    Korean: "/images/flags/kr.svg",
    French: "/images/flags/fr.svg",
    Spanish: "/images/flags/es.svg",
    Mandarin: "/images/flags/cn.svg",
    Chinese: "/images/flags/cn.svg",
    Portuguese: "/images/flags/pt.svg",
    "European Portuguese": "/images/flags/pt.svg",
  };

  // =========================================
  // GAMBAR KURSUS
  // Nama file tanpa ekstensi
  // =========================================
  const courseImages = {
    english: "/images/courses/english",
    french: "/images/courses/french",
    japanese: "/images/courses/japanese",
    korean: "/images/courses/korean",
    mandarin: "/images/courses/mandarin",
    chinese: "/images/courses/mandarin",
    spanish: "/images/courses/spanish",
    portuguese: "/images/courses/portuguese",
    "european portuguese": "/images/courses/portuguese",
  };

  // =========================================
  // MENGAMBIL GAMBAR SESUAI NAMA KATEGORI
  // =========================================
  function getCourseImage(categoryName) {
    if (!categoryName) return null;

    const category = categoryName.toLowerCase().trim();

    return courseImages[category] || null;
  }

  // =========================================
  // MENGHITUNG JUMLAH KURSUS
  // =========================================
  function languageCourseCount(languageId) {
    return courses.filter(
      (course) => course.category_id === languageId
    ).length;
  }

  // =========================================
  // SEARCH DAN FILTER
  // =========================================
  const filteredCourses = courses.filter((course) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      course.name?.toLowerCase().includes(keyword) ||
      course.description?.toLowerCase().includes(keyword) ||
      course.category_name?.toLowerCase().includes(keyword);

    const matchesLanguage =
      selectedLanguage === "All" ||
      course.category_name === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Maksimal 4 kursus
  const popularCourses = filteredCourses.slice(0, 4);

  // =========================================
  // SCROLL KE KURSUS
  // =========================================
  function exploreCourses() {
    document
      .getElementById("courses")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  // =========================================
  // SCROLL KE BAHASA
  // =========================================
  function exploreLanguages() {
    document
      .getElementById("languages")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9ff] text-[#29245b]">

      {/* =====================================
          NAVBAR
      ====================================== */}
      <nav className="sticky top-0 z-50 border-b border-purple-100/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">

          {/* LOGO */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-3xl">🪐</span>

            <span className="text-xl font-extrabold tracking-tight text-[#4526a8] md:text-2xl">
              LinguaSpace
            </span>
          </a>

          {/* NAVIGATION */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/"
              className="font-semibold text-[#7047ed]"
            >
              Home
            </a>

            <a
              href="/courses"
              className="text-[#77729d] transition hover:text-[#7047ed]"
            >
              Courses
            </a>

            <a
              href="#languages"
              className="text-[#77729d] transition hover:text-[#7047ed]"
            >
              Languages
            </a>

            <a
              href="#about"
              className="text-[#77729d] transition hover:text-[#7047ed]"
            >
              About Us
            </a>
          </div>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="rounded-xl px-4 py-2 font-semibold text-[#6043c7] transition hover:bg-purple-50"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-gradient-to-r from-[#7545ed] to-[#a04cf5] px-4 py-2.5 font-semibold text-white shadow-md shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* =====================================
          HERO SECTION
      ====================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#faf9ff] via-[#f4f0ff] to-[#eee7ff] px-5 py-16 md:px-10 md:py-24">

        {/* Dekorasi */}
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />

        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          {/* HERO TEXT */}
          <div>
            <span className="inline-flex items-center rounded-full border border-purple-200 bg-white/70 px-4 py-2 text-sm font-semibold text-[#7650dc] shadow-sm">
              ✨ Jelajahi Dunia dengan Bahasa
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#29245b] md:text-6xl">
              Explore Languages,

              <span className="block bg-gradient-to-r from-[#7446ed] to-[#a34ff4] bg-clip-text text-transparent">
                Open New Opportunities.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#77729d] md:text-lg">
              Pilih bahasa yang ingin kamu pelajari dan mulai perjalanan
              menuju versi terbaik dirimu.
            </p>

            <div className="mt-8">
              <button
                onClick={exploreLanguages}
                className="rounded-2xl bg-gradient-to-r from-[#7844ed] to-[#a044f4] px-7 py-3.5 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-1 hover:shadow-xl"
              >
                Jelajahi Bahasa →
              </button>
            </div>

            {/* STATISTIK */}
            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <h3 className="text-2xl font-extrabold text-[#7144dc]">
                  {languages.length}+
                </h3>

                <p className="text-sm text-[#8983aa]">
                  Languages
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#7144dc]">
                  {courses.length}+
                </h3>

                <p className="text-sm text-[#8983aa]">
                  Courses
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-[#7144dc]">
                  Anytime
                </h3>

                <p className="text-sm text-[#8983aa]">
                  Learn at your pace
                </p>
              </div>
            </div>
          </div>

          {/* HERO ILUSTRASI */}
          <div className="relative flex min-h-[350px] items-center justify-center md:min-h-[440px]">

            {/* Lingkaran background */}
            <div className="absolute h-[300px] w-[300px] rounded-full bg-gradient-to-br from-[#e4d9ff] to-[#c9b5ff] shadow-inner md:h-[390px] md:w-[390px]" />

            <div className="absolute h-[250px] w-[250px] rounded-full border border-white/70 md:h-[330px] md:w-[330px]" />

            <div className="absolute h-[200px] w-[200px] rounded-full border border-white/50 md:h-[270px] md:w-[270px]" />

            {/* Planet */}
            <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-[#b8a0ff] via-[#8a67ef] to-[#6241cb] shadow-2xl shadow-purple-300 md:h-64 md:w-64">
              <span className="text-8xl drop-shadow-lg md:text-9xl">
                🌎
              </span>
            </div>

            {/* Floating greetings */}
            <div className="absolute left-4 top-10 rotate-[-8deg] rounded-2xl bg-white px-5 py-3 font-bold text-[#7444dd] shadow-lg md:left-12">
              Hello!
            </div>

            <div className="absolute right-4 top-14 rotate-[8deg] rounded-2xl bg-[#8859f4] px-5 py-3 font-bold text-white shadow-lg md:right-10">
              Bonjour!
            </div>

            <div className="absolute bottom-14 left-5 rotate-[5deg] rounded-2xl bg-white px-5 py-3 font-bold text-[#7444dd] shadow-lg md:left-12">
              Hola!
            </div>

            <div className="absolute bottom-8 right-5 rotate-[-7deg] rounded-2xl bg-white px-5 py-3 font-bold text-[#7444dd] shadow-lg md:right-12">
              こんにちは
            </div>

            <span className="absolute left-1/2 top-2 text-3xl text-purple-400">
              ✦
            </span>

            <span className="absolute left-5 top-1/2 text-2xl text-purple-400">
              ✧
            </span>

            <span className="absolute bottom-4 left-1/2 text-3xl text-purple-400">
              ✦
            </span>

            <span className="absolute right-4 top-1/2 text-2xl text-purple-400">
              ✧
            </span>
          </div>
        </div>
      </section>

      {/* =====================================
          LANGUAGE SECTION
      ====================================== */}
      <section
        id="languages"
        className="bg-gradient-to-b from-[#f5f0ff] to-[#faf9ff] px-5 py-16 md:px-10"
      >
        <div className="mx-auto max-w-7xl">

          {/* HEADING */}
          <div className="mb-8">
            <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-[#7446dd]">
              ✨ Explore
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#34266e] md:text-4xl">
              Explore Languages
            </h2>

            <p className="mt-3 text-[#827ca6]">
              Pilih bahasa dan mulai perjalanan belajarmu.
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="py-8 text-[#827ca6]">
              Loading languages...
            </p>
          )}

          {/* LANGUAGE CARDS */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">

              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => {
                    setSelectedLanguage(language.name);
                    exploreCourses();
                  }}
                  className="group flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/90 p-3 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 md:p-4"
                >

                  {/* BENDERA */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-50 shadow-sm">

                    {languageFlags[language.name] ? (
                      <img
                        src={languageFlags[language.name]}
                        alt={`${language.name} flag`}
                        className="h-9 w-9 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-3xl">
                        🌍
                      </span>
                    )}

                  </div>

                  {/* NAMA DAN JUMLAH KURSUS */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#39306e]">
                      {language.name}
                    </h3>

                    <p className="text-xs text-[#8983aa]">
                      {languageCourseCount(language.id)} courses
                    </p>
                  </div>

                  {/* ARROW */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[#8554ed] transition group-hover:bg-[#8554ed] group-hover:text-white">
                    →
                  </span>
                </button>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* =====================================
          POPULAR COURSES
      ====================================== */}
      <section
        id="courses"
        className="bg-[#faf9ff] px-5 py-16 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-7xl">

          {/* HEADING */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-[#7446dd]">
                ✨ Popular Courses
              </span>

              <h2 className="mt-4 text-3xl font-extrabold text-[#34266e] md:text-4xl">
                Popular Courses
              </h2>

              <p className="mt-3 text-[#827ca6]">
                Kursus favorit banyak pelajar. Mulai dari yang paling sesuai dengan minatmu.
              </p>
            </div>

            <a
              href="/courses"
              className="font-semibold text-[#7546e5] transition hover:text-[#5426b8]"
            >
              View All →
            </a>
          </div>

          {/* SEARCH */}
          <div className="mt-8">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-400">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Cari kursus, bahasa, atau level..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-purple-100 bg-white py-4 pl-12 pr-5 text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* FILTER BAHASA */}
          <div className="mt-5 flex flex-wrap gap-2.5">

            <button
              onClick={() => setSelectedLanguage("All")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                selectedLanguage === "All"
                  ? "bg-gradient-to-r from-[#7844ed] to-[#a044f4] text-white shadow-md shadow-purple-200"
                  : "border border-purple-100 bg-white text-[#77729d] hover:bg-purple-50"
              }`}
            >
              All
            </button>

            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => setSelectedLanguage(language.name)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  selectedLanguage === language.name
                    ? "bg-gradient-to-r from-[#7844ed] to-[#a044f4] text-white shadow-md shadow-purple-200"
                    : "border border-purple-100 bg-white text-[#77729d] hover:bg-purple-50"
                }`}
              >
                {language.name}
              </button>
            ))}

          </div>

          {/* LOADING */}
          {loading && (
            <p className="mt-10 text-center text-[#827ca6]">
              Loading courses...
            </p>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600">
              {error}
            </div>
          )}

          {/* COURSE CARDS */}
          {!loading && !error && popularCourses.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {popularCourses.map((course) => {
                const imageBase = getCourseImage(course.category_name);

                return (
                  <div
                    key={course.id}
                    className="group overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-100"
                  >

                    {/* COVER FOTO */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#e7ddff] to-[#f4e7ff]">

                      {imageBase ? (
                        <>
                          <img
                            src={`${imageBase}.jpeg`}
                            alt={`${course.category_name} course`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const img = e.currentTarget;

                              // Coba JPEG -> JPG
                              if (img.src.endsWith(".jpeg")) {
                                img.src = `${imageBase}.jpg`;
                              } else {
                                // Jika keduanya gagal, tampilkan fallback
                                img.style.display = "none";

                                const fallback =
                                  img.parentElement.querySelector(
                                    ".course-image-fallback"
                                  );

                                if (fallback) {
                                  fallback.style.display = "flex";
                                }
                              }
                            }}
                          />

                          {/* FALLBACK */}
                          <div
                            className="course-image-fallback h-full w-full items-center justify-center"
                            style={{ display: "none" }}
                          >
                            <span className="text-7xl">
                              🌍
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-7xl">
                            🌍
                          </span>
                        </div>
                      )}

                      {/* LEVEL BADGE */}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#7046d8] shadow-sm">
                        {course.level || "All Levels"}
                      </span>
                    </div>

                    {/* COURSE DETAILS */}
                    <div className="p-5">

                      <p className="text-sm font-semibold text-[#8054e9]">
                        {course.category_name || "Language"}
                      </p>

                      <h3 className="mt-2 line-clamp-2 min-h-[56px] text-lg font-bold text-[#332765]">
                        {course.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-6 text-[#8983aa]">
                        {course.description ||
                          "Mulai belajar bahasa baru bersama LinguaSpace."}
                      </p>

                      {/* TEACHER */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-[#8983aa]">
                        <span>👩‍🏫</span>

                        <span>
                          {course.teacher_name
                            ? course.teacher_name
                            : course.teacher_id
                            ? `Teacher ID: ${course.teacher_id}`
                            : "Teacher not assigned"}
                        </span>
                      </div>

                      {/* BUTTON */}
                      <a
                        href="/courses"
                        className="mt-5 block rounded-xl bg-gradient-to-r from-[#7844ed] to-[#a044f4] py-3 text-center font-semibold text-white shadow-sm transition hover:shadow-md hover:shadow-purple-200"
                      >
                        View Course →
                      </a>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && popularCourses.length === 0 && (
            <div className="mt-10 rounded-2xl border border-purple-100 bg-white p-10 text-center">
              <span className="text-5xl">🔎</span>

              <p className="mt-4 font-semibold text-[#514486]">
                No courses found.
              </p>

              <p className="mt-2 text-sm text-[#8983aa]">
                Coba kata pencarian atau bahasa lainnya.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedLanguage("All");
                }}
                className="mt-5 rounded-xl bg-purple-100 px-5 py-2 font-semibold text-purple-700 hover:bg-purple-200"
              >
                Reset Filter
              </button>
            </div>
          )}

        </div>
      </section>

      {/* =====================================
          CTA
      ====================================== */}
      <section className="px-5 py-16 md:px-10 md:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#7544e9] via-[#8953f2] to-[#a66af7] px-8 py-12 text-white shadow-xl shadow-purple-200 md:px-16 md:py-16">

          {/* DEKORASI */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[30px] border-white/10" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">

            {/* ILUSTRASI */}
            <div className="flex justify-center">
              <div className="relative flex h-44 w-64 items-center justify-center">

                <span className="absolute left-5 top-0 text-5xl opacity-70">
                  ✦
                </span>

                <span className="absolute right-5 top-5 text-3xl opacity-70">
                  ✧
                </span>

                <span className="absolute bottom-0 right-8 text-4xl opacity-70">
                  ✦
                </span>

                <div className="relative text-8xl drop-shadow-xl">
                  📚
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div>
              <p className="font-medium text-purple-100">
                ✨ Together with LinguaSpace
              </p>

              <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">
                Ready to Start Learning?
              </h2>

              <p className="mt-4 max-w-lg leading-7 text-purple-100">
                Jelajahi berbagai kursus, tingkatkan kemampuan bahasa,
                dan capai tujuanmu bersama LinguaSpace.
              </p>

              <a
                href="/register"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-[#7042d7] shadow-lg transition hover:-translate-y-0.5 hover:bg-purple-50"
              >
                Buat Akun Sekarang →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================
          FOOTER
      ====================================== */}
      <footer className="border-t border-purple-100 bg-[#f5f1ff] px-5 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="text-2xl">🪐</span>

          <span className="font-bold text-[#4929a5]">
            LinguaSpace
          </span>
        </div>
      </footer>

    </main>
  );
}