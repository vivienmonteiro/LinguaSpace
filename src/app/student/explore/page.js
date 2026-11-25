
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentExplorePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const response = await fetch("/api/student/courses");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data kursus.");
      }

      setCourses(result.data || []);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(courseId) {
    setMessage("");
    setEnrollingId(courseId);

    try {
      const response = await fetch("/api/student/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mendaftar kursus.");
      }

      setCourses((previousCourses) =>
        previousCourses.map((course) =>
          course.id === courseId
            ? { ...course, is_enrolled: true }
            : course
        )
      );

      setMessage("Berhasil mendaftar kursus! Kursus sudah masuk ke Kursus Saya.");
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setEnrollingId(null);
    }
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
            DISCOVER YOUR NEXT SKILL
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Explore Courses
          </h1>
          <p className="text-purple-100 max-w-2xl">
            Temukan berbagai kursus bahasa yang tersedia dan pilih bahasa
            yang ingin kamu pelajari bersama LinguaSpace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl font-bold text-[#25245b]">
              Available Courses
            </h2>
            <p className="text-gray-500 mt-1">
              Pilih kursus dan mulai perjalanan belajarmu.
            </p>
          </div>

          <Link
            href="/student/courses"
            className="self-start rounded-xl border-2 border-purple-200 bg-white px-5 py-3 text-purple-700 font-bold hover:bg-purple-50 transition"
          >
            📚 Kursus Saya
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-4 text-purple-800 font-medium">
            {message}
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-purple-700 font-semibold">
            Memuat daftar kursus...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="bg-white rounded-3xl border border-purple-100 p-10 text-center">
            <div className="text-6xl mb-5">🌍</div>
            <h3 className="text-xl font-bold text-[#25245b]">
              Belum Ada Kursus
            </h3>
            <p className="text-gray-500 mt-2">
              Saat ini belum ada kursus yang tersedia.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
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
                    <p>📖 Total materi: {course.total_contents ?? 0}</p>
                  </div>

                  {course.is_enrolled ? (
                    <Link
                      href={`/student/learn/${course.id}`}
                      className="block text-center mt-6 rounded-xl bg-green-50 border border-green-200 px-5 py-3 text-green-700 font-bold"
                    >
                      ✓ Enrolled - Mulai Belajar
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="w-full mt-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-700 px-5 py-3 text-white font-bold hover:shadow-md transition disabled:opacity-60"
                    >
                      {enrollingId === course.id
                        ? "Mendaftarkan..."
                        : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
