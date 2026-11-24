
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

        const enrolled = result.data.filter(
          (course) => course.is_enrolled
        );

        // Mengambil progress setiap kursus yang diikuti
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
                  progress: progressResult.data.progress,
                };
              }

              return {
                ...course,
                progress: null,
              };
            } catch (err) {
              return {
                ...course,
                progress: null,
              };
            }
          })
        );

        setCourses(result.data);
        setEnrolledCourses(coursesWithProgress);
      } catch (err) {
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
    } catch (err) {
      setError("Gagal logout.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            LinguaSpace
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-800">
              {user.username}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h2>

          <p className="text-gray-600 mt-2">
            Selamat datang, {user.username}! Mari lanjutkan perjalanan belajarmu.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-600">
              Available Courses
            </p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {loading ? "..." : courses.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-600">
              My Enrolled Courses
            </p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {loading ? "..." : enrolledCourses.length}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-600">
              Learning Status
            </p>
            <h3 className="text-xl font-bold text-purple-600 mt-2">
              Ready to Learn
            </h3>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Explore Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Explore Courses
              </h3>

              <p className="text-gray-600 mt-1">
                Temukan kursus bahasa yang ingin kamu pelajari.
              </p>
            </div>

            <Link
              href="/student/courses"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Browse Courses
            </Link>

          </div>

        </div>

    {/* Teacher Application */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-gray-300">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

        <div>
            <h3
                className="text-xl font-bold"
                style={{ color: "#111827" }}
            >
                Become a Teacher
            </h3>

      <p
        className="mt-2 leading-7"
        style={{ color: "#374151" }}
      >
        Punya kemampuan bahasa yang ingin dibagikan?
        Daftarkan dirimu menjadi pengajar di LinguaSpace.
      </p>

      <p
        className="text-sm mt-2"
        style={{ color: "#4B5563" }}
      >
        Pengajuan akan ditinjau dan disetujui oleh Admin.
      </p>
    </div>

    <Link
      href="/teacher-application"
      className="w-full md:w-auto text-center bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition"
    >
      Apply to Become a Teacher
    </Link>

  </div>

</div>

        {/* My Courses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">

          <h3 className="text-xl font-bold text-gray-900 mb-5">
            My Courses
          </h3>

          {loading ? (
            <p className="text-gray-600">
              Loading courses...
            </p>
          ) : enrolledCourses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Kamu belum mengikuti kursus apa pun.
              </p>

              <Link
                href="/student/courses"
                className="text-blue-600 font-medium hover:underline"
              >
                Explore courses now →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {enrolledCourses.map((course) => {
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

                return (
                  <div
                    key={course.id}
                    className="border border-gray-200 rounded-xl p-5"
                  >
                    <h4 className="font-bold text-gray-900 text-lg">
                      {course.name}
                    </h4>

                    <p className="text-gray-600 mt-2">
                      {course.category_name}
                    </p>

                    {/* Progress */}
                    <div className="mt-5">

                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Learning Progress
                        </span>

                        <span className="font-bold text-blue-600">
                          {percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-green-500"
                              : "bg-blue-600"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <p className="text-sm text-gray-600 mt-2">
                        {completed} dari {total} materi selesai
                      </p>

                    </div>

                    {/* Course Status */}
                    {isCompleted ? (
                      <span className="inline-block mt-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Kursus selesai
                      </span>
                    ) : (
                      <span className="inline-block mt-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Sedang belajar
                      </span>
                    )}

                    {/* Button */}
                    <Link
                      href={`/student/learn/${course.id}`}
                      className="block text-center mt-5 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      {isCompleted
                        ? "Review Course"
                        : "Continue Learning"}
                    </Link>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
