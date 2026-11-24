
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await fetch("/api/student/courses");
        const result = await response.json();

        if (result.success) {
          setCourses(result.data);
        } else {
          setError(result.message || "Gagal mengambil kursus.");
        }
      } catch (err) {
        setError("Tidak dapat terhubung ke server.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  async function handleEnroll(courseId) {
    setMessage("");
    setEnrollingId(courseId);

    try {
      const response = await fetch("/api/student/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCourses((previousCourses) =>
          previousCourses.map((course) =>
            course.id === courseId
              ? { ...course, is_enrolled: true }
              : course
          )
        );

        setMessage(result.message);
      } else {
        setMessage(result.message || "Gagal mendaftar kursus.");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan saat mendaftar.");
    } finally {
      setEnrollingId(null);
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

          <Link
            href="/student/dashboard"
            className="text-blue-600 font-medium hover:text-blue-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Course Catalog
          </h2>

          <p className="text-gray-600 mt-2">
            Explore berbagai kursus bahasa dan mulai perjalanan belajarmu.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Loading courses...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">
              Belum ada kursus tersedia.
            </p>
          </div>
        )}

        {/* Course List */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition"
              >

                {/* Card Header */}
                <div className="bg-blue-600 p-5">
                  <span className="inline-block bg-white text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {course.category_name || "General"}
                  </span>

                  <h3 className="text-xl font-bold text-white">
                    {course.name}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-5">

                  <p className="text-gray-600 text-sm leading-6 min-h-[72px]">
                    {course.description || "Belum ada deskripsi kursus."}
                  </p>

                  <div className="mt-4 space-y-2">

                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Teacher:</span>{" "}
                      {course.teacher_name || "-"}
                    </p>

                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Level:</span>{" "}
                      {course.level || "-"}
                    </p>

                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold">Learning Materials:</span>{" "}
                      {course.total_contents}
                    </p>

                  </div>

                  {/* Enrollment Button */}
                  <div className="mt-5">

                    {course.is_enrolled ? (
                      <Link
                        href="/student/dashboard"
                        className="block bg-green-100 text-green-800 text-center py-3 px-4 rounded-lg font-semibold"
                      >
                        Enrolled ✓
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollingId === course.id}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                      >
                        {enrollingId === course.id
                          ? "Enrolling..."
                          : "Enroll Now"}
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}
