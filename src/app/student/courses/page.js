
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMyCourses() {
      try {
        const response = await fetch("/api/student/courses");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Gagal mengambil data kursus.");
        }

        // Hanya mengambil kursus yang sudah diikuti siswa
        const enrolled = (result.data || []).filter(
          (course) => course.is_enrolled
        );

        // Mengambil progres belajar setiap kursus
        const coursesWithProgress = await Promise.all(
          enrolled.map(async (course) => {
            try {
              const progressResponse = await fetch(
                `/api/student/learn?course_id=${course.id}`
              );
              const progressResult = await progressResponse.json();

              return {
                ...course,
                progress: progressResult.data?.progress || {},
              };
            } catch {
              return { ...course, progress: {} };
            }
          })
        );

        setCourses(coursesWithProgress);
      } catch (err) {
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }

    loadMyCourses();
  }, []);

  function getProgress(course) {
    const progress = course.progress || {};
    const total =
      Number(progress.total_contents ?? course.total_contents ?? 0);
    const completed = Number(progress.completed_contents ?? 0);

    const percentage =
      progress.percentage !== undefined
        ? Number(progress.percentage)
        : total > 0
          ? Math.round((completed / total) * 100)
          : 0;

    return {
      total,
      completed,
      percentage: Math.min(100, Math.max(0, percentage)),
      finished: total > 0 && completed >= total,
    };
  }

  return (
    <div className="min-h-screen bg-[#f7f6ff]">
      <header className="bg-white border-b border-purple-100 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-2xl font-extrabold text-[#393779]"
          >
            LinguaSpace
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-purple-700 hover:text-purple-900"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-purple-800 p-8 md:p-10 text-white shadow-lg mb-9">
          <p className="text-purple-100 text-sm font-semibold mb-2">
            STUDENT LEARNING AREA
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Kursus Saya
          </h1>
          <p className="text-purple-100 max-w-2xl">
            Semua kursus yang sudah kamu ikuti ada di sini. Lanjutkan
            perjalanan belajarmu dan tingkatkan kemampuan bahasamu!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl font-bold text-[#25245b]">
              Kursus yang Diikuti
            </h2>
            <p className="text-gray-500 mt-1">
              {courses.length} kursus terdaftar
            </p>
          </div>

          <Link
            href="/student/explore"
            className="self-start rounded-xl bg-gradient-to-r from-violet-500 to-purple-700 px-5 py-3 text-white font-bold shadow-md hover:shadow-lg transition"
          >
            + Jelajahi Kursus
          </Link>
        </div>

        {loading && (
          <div className="text-center py-20 text-purple-700 font-semibold">
            Memuat kursus kamu...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="bg-white rounded-3xl border border-purple-100 p-10 text-center shadow-sm">
            <div className="text-6xl mb-5">📚</div>
            <h3 className="text-xl font-bold text-[#25245b] mb-2">
              Kamu Belum Mengikuti Kursus
            </h3>
            <p className="text-gray-500 mb-6">
              Yuk, temukan kursus bahasa yang ingin kamu pelajari!
            </p>
            <Link
              href="/student/explore"
              className="inline-block rounded-xl bg-gradient-to-r from-violet-500 to-purple-700 px-6 py-3 text-white font-bold"
            >
              Explore Courses
            </Link>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = getProgress(course);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-lg transition"
                >
                  <div className="h-3 bg-gradient-to-r from-violet-500 to-purple-700" />

                  <div className="p-6">
                    <div className="flex justify-between items-center gap-3 mb-4">
                      <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full">
                        {course.category_name || "Language"}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {course.level || "Beginner"}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#25245b] mb-2">
                      {course.name}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-3 min-h-[60px]">
                      {course.description || "Belajar bahasa bersama LinguaSpace."}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-gray-600">
                      <p>👨‍🏫 Teacher: {course.teacher_name || "-"}</p>
                      <p>📖 Total materi: {progress.total}</p>
                    </div>

                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-[#393779]">
                          Progress Belajar
                        </span>
                        <span className="font-bold text-purple-700">
                          {progress.percentage}%
                        </span>
                      </div>

                      <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-700 rounded-full transition-all"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {progress.completed} dari {progress.total} materi selesai
                      </p>
                    </div>

                    {progress.finished && (
                      <div className="mt-4 text-sm font-bold text-green-700 bg-green-50 rounded-xl p-3">
                        ✓ Semua materi telah diselesaikan!
                      </div>
                    )}

                    <Link
                      href={`/student/learn/${course.id}`}
                      className="block text-center mt-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-700 px-5 py-3 text-white font-bold hover:shadow-md transition"
                    >
                      {progress.finished ? "Lihat Kembali Materi" : "Lanjutkan Belajar"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
