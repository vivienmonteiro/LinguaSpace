
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeacherDashboard({ user }) {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    courses: [],
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/teacher/stats");
        const result = await response.json();

        if (result.success) {
          setStats(result.data);
        } else {
          setMessage(result.message);
        }
      } catch (error) {
        setMessage("Gagal menghubungi server.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "/login";
      }
    } catch (error) {
      setMessage("Gagal logout. Silakan coba lagi.");
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
            <span className="text-gray-800 hidden sm:block">
              {user.username}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Teacher Dashboard
          </h2>

          <p className="text-gray-700 mt-2">
            Selamat datang kembali, {user.username}!
          </p>

          <p className="text-gray-600 mt-1">
            Kelola kursus dan pantau student kamu di sini.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-2">
              Total My Courses
            </p>

            <h3 className="text-4xl font-bold text-blue-600">
              {loading ? "..." : stats.totalCourses}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-2">
              Total Students
            </p>

            <h3 className="text-4xl font-bold text-green-600">
              {loading ? "..." : stats.totalStudents}
            </h3>
          </div>

        </div>

        {/* Error Message */}
        {message && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {/* My Courses */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              My Courses
            </h3>
          </div>

          {loading ? (
            <p className="text-gray-600">
              Loading courses...
            </p>
          ) : stats.courses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">
                Kamu belum memiliki kursus.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              {stats.courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-white"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {course.name}
                  </h4>

                  <p className="text-gray-600 mb-3">
                    Category: {course.category_name || "-"}
                  </p>

                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.level || "Beginner"}
                  </span>

                  {/* Manage Contents Button */}
                  <Link
                    href={`/teacher/courses/${course.id}/contents`}
                    className="block mt-4 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Manage Contents
                  </Link>
                </div>
              ))}

            </div>
          )}

        </div>

        {/* Menu */}
        <div className="grid md:grid-cols-2 gap-5 mt-8">

          {/* Course Management */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Course Management
            </h3>

            <p className="text-gray-600 mb-4">
              Manage your course learning materials.
            </p>

            <p className="text-blue-600 font-medium">
              Select Manage Contents on your course above.
            </p>
          </div>

          {/* Student Monitoring */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Student Monitoring
            </h3>

            <p className="text-gray-600 mb-4">
              Pantau student yang mengikuti kursus kamu.
            </p>

            <p className="text-blue-600 font-medium">
              Student monitoring will be available in a later step.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}
