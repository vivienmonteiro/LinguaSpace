"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CertificatesClient({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCertificates() {
      try {
        const response = await fetch("/api/student/courses");
        const result = await response.json();

        if (!result.success) {
          setError(result.message || "Gagal mengambil data sertifikat.");
          return;
        }

        // Hanya mengambil kursus yang diikuti dan sudah selesai
        const completedCourses = result.data.filter(
          (course) =>
            course.is_enrolled && course.completed_at
        );

        setCourses(completedCourses);
      } catch (err) {
        setError("Gagal menghubungi server.");
      } finally {
        setLoading(false);
      }
    }

    loadCertificates();
  }, []);

  function handlePrint() {
    window.print();
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            LinguaSpace
          </h1>

          <Link
            href="/student/dashboard"
            className="text-blue-600 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900">
            My Certificates
          </h1>

          <p className="text-gray-600 mt-2">
            Sertifikat kursus yang berhasil kamu selesaikan.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-600">
            Memuat sertifikat...
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && courses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="text-5xl mb-4">🎓</div>

            <h2 className="text-xl font-bold text-gray-900">
              Belum ada sertifikat
            </h2>

            <p className="text-gray-600 mt-2">
              Selesaikan seluruh materi kursus untuk mendapatkan sertifikat.
            </p>

            <Link
              href="/student/courses"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Explore Courses
            </Link>
          </div>
        )}

        {/* Certificate List */}
        {!loading && courses.length > 0 && (
          <>
            {/* Print Button */}
            <div className="flex justify-end mb-6 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                🖨️ Cetak Sertifikat
              </button>
            </div>

            <div className="space-y-8">

              {courses.map((course) => (
                <div
                  key={course.id}
                  className="certificate-card bg-white p-3 md:p-6 rounded-xl shadow-sm"
                >

                  {/* Certificate Design */}
                  <div className="border-4 border-double border-yellow-600 p-5 md:p-10 text-center bg-white">

                    <div className="border border-yellow-500 p-5 md:p-10">

                      <p className="text-blue-700 font-bold tracking-[0.3em] uppercase">
                        LinguaSpace
                      </p>

                      <div className="text-5xl my-5">
                        🏆
                      </div>

                      <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-800">
                        Certificate
                      </h1>

                      <h2 className="text-xl md:text-2xl text-yellow-700 mt-2 font-serif">
                        of Completion
                      </h2>

                      <p className="text-gray-600 mt-8">
                        This certificate is proudly presented to
                      </p>

                      <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mt-4 mb-5">
                        {user.username}
                      </h2>

                      <div className="w-3/4 mx-auto border-b-2 border-yellow-600 mb-6"></div>

                      <p className="text-gray-700">
                        For successfully completing the course
                      </p>

                      <h3 className="text-xl md:text-3xl font-bold text-gray-900 mt-3">
                        {course.name}
                      </h3>

                      <p className="text-gray-600 mt-3">
                        Category: {course.category_name}
                      </p>

                      <p className="text-gray-600 mt-1">
                        Instructor: {course.teacher_name || "LinguaSpace Instructor"}
                      </p>

                      <p className="text-gray-600 mt-6">
                        Completed on
                      </p>

                      <p className="text-lg font-semibold text-gray-800">
                        {formatDate(course.completed_at)}
                      </p>

                      <div className="grid grid-cols-2 gap-8 mt-12">

                        <div>
                          <div className="border-b border-gray-500 w-4/5 mx-auto mb-2"></div>

                          <p className="text-sm text-gray-600">
                            Student
                          </p>

                          <p className="font-medium text-gray-800">
                            {user.username}
                          </p>
                        </div>

                        <div>
                          <div className="border-b border-gray-500 w-4/5 mx-auto mb-2"></div>

                          <p className="text-sm text-gray-600">
                            LinguaSpace
                          </p>

                          <p className="font-medium text-gray-800">
                            Course Completion
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </main>

      {/* Print Styling */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          nav,
          .print\\:hidden {
            display: none !important;
          }

          main {
            max-width: none !important;
            padding: 0 !important;
          }

          .certificate-card {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            break-after: page;
            page-break-after: always;
          }

          .certificate-card:last-child {
            break-after: auto;
            page-break-after: auto;
          }

          @page {
            size: landscape;
            margin: 1cm;
          }
        }
      `}</style>

    </div>
  );
}