
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

export default function CertificatesClient({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCertificates = useCallback(async () => {
    try {
      setError("");

      const response = await fetch("/api/student/courses", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal mengambil data sertifikat."
        );
      }

      const completedCourses = (result.data || []).filter(
        (course) =>
          course.is_enrolled === true &&
          course.completed_at !== null &&
          course.completed_at !== undefined
      );

      setCourses(completedCourses);
    } catch (err) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();

    // Memperbarui sertifikat ketika halaman dibuka kembali
    const handleFocus = () => loadCertificates();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadCertificates]);

  function handlePrint() {
    window.print();
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f6ff] text-[#25245b]">

      {/* NAVBAR */}
      <nav className="bg-white px-6 py-4 shadow-sm print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-extrabold text-violet-700">
            LinguaSpace
          </h1>

          <Link
            href="/dashboard"
            className="rounded-xl px-4 py-2 font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl p-5 md:p-10">

        {/* HEADER */}
        <div className="mb-8 print:hidden">
          <p className="mb-2 font-semibold text-violet-500">
            STUDENT ACHIEVEMENTS
          </p>

          <h1 className="text-3xl font-extrabold md:text-4xl">
            My Certificates 🎓
          </h1>

          <p className="mt-3 text-gray-500">
            Semua sertifikat dari kursus yang berhasil kamu selesaikan
            akan muncul di halaman ini.
          </p>

          {!loading && !error && (
            <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-5 py-3 shadow-sm">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-2xl font-extrabold text-violet-700">
                  {courses.length}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  Certificates Earned
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-4xl">⏳</div>
            <p className="font-semibold text-gray-600">
              Memuat sertifikat...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-bold text-red-700">
              Gagal memuat sertifikat
            </p>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={() => {
                setLoading(true);
                loadCertificates();
              }}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && courses.length === 0 && (
          <div className="rounded-3xl border border-violet-100 bg-white p-10 text-center shadow-sm">
            <div className="mb-5 text-6xl">🎓</div>

            <h2 className="text-2xl font-extrabold">
              Belum Ada Sertifikat
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Kamu belum menyelesaikan seluruh materi dari kursus
              yang diikuti. Terus lanjutkan pembelajaranmu untuk
              mendapatkan sertifikat!
            </p>

            <Link
              href="/student/courses"
              className="mt-6 inline-block rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:opacity-90"
            >
              Lanjutkan Belajar →
            </Link>
          </div>
        )}

        {/* CERTIFICATE LIST */}
        {!loading && !error && courses.length > 0 && (
          <>
            <div className="mb-6 flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:opacity-90"
              >
                🖨️ Cetak Sertifikat
              </button>
            </div>

            <div className="space-y-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="certificate-card rounded-2xl bg-white p-3 shadow-md md:p-6"
                >
                  <div className="border-4 border-double border-amber-500 bg-white p-4 md:p-8">
                    <div className="border border-amber-400 p-5 text-center md:p-10">

                      <p className="font-extrabold tracking-[0.3em] text-violet-700">
                        LINGUASPACE
                      </p>

                      <div className="my-5 text-5xl">🏆</div>

                      <h2 className="font-serif text-3xl font-extrabold text-[#25245b] md:text-5xl">
                        Certificate
                      </h2>

                      <h3 className="mt-2 font-serif text-xl text-amber-600 md:text-2xl">
                        of Completion
                      </h3>

                      <p className="mt-8 text-gray-500">
                        This certificate is proudly presented to
                      </p>

                      <h3 className="mb-5 mt-4 text-2xl font-extrabold text-violet-800 md:text-4xl">
                        {user?.username || "Student"}
                      </h3>

                      <div className="mx-auto mb-6 w-3/4 border-b-2 border-amber-500" />

                      <p className="text-gray-600">
                        For successfully completing the course
                      </p>

                      <h4 className="mt-3 text-xl font-extrabold text-[#25245b] md:text-3xl">
                        {course.name}
                      </h4>

                      <div className="mt-4 space-y-1 text-sm text-gray-600">
                        <p>
                          Category: {course.category_name || "-"}
                        </p>

                        <p>
                          Level: {course.level || "-"}
                        </p>

                        <p>
                          Instructor:{" "}
                          {course.teacher_name || "LinguaSpace Instructor"}
                        </p>
                      </div>

                      <p className="mt-7 text-gray-500">
                        Completed on
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#25245b]">
                        {formatDate(course.completed_at)}
                      </p>

                      <div className="mt-12 grid grid-cols-2 gap-8">
                        <div>
                          <div className="mx-auto mb-2 w-4/5 border-b border-gray-500" />
                          <p className="text-sm text-gray-500">
                            Student
                          </p>
                          <p className="font-semibold text-[#25245b]">
                            {user?.username || "Student"}
                          </p>
                        </div>

                        <div>
                          <div className="mx-auto mb-2 w-4/5 border-b border-gray-500" />
                          <p className="text-sm text-gray-500">
                            Authorized by
                          </p>
                          <p className="font-semibold text-[#25245b]">
                            LinguaSpace
                          </p>
                        </div>
                      </div>

                      <p className="mt-8 text-xs font-semibold tracking-widest text-amber-600">
                        CONGRATULATIONS ON YOUR ACHIEVEMENT
                      </p>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* PRINT STYLE */}
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
