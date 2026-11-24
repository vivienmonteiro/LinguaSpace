"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentHistoryPage() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/api/student/history");
        const result = await response.json();

        if (result.success) {
          setHistory(result.data || []);
          setSummary(result.summary || {});
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    if (filter === "completed") {
      return item.activity_type === "completed";
    }
    if (filter === "enrollment") {
      return item.activity_type === "enrollment";
    }

    return true;
  });

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc] px-5 py-7 md:px-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-7 flex items-center justify-between">

          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-block text-sm text-violet-500 hover:text-violet-700"
            >
              ← Kembali ke Dashboard
            </Link>

            <h1 className="text-2xl font-extrabold text-gray-800 md:text-3xl">
              Riwayat Belajar
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Lihat perjalanan dan aktivitas belajarmu di LinguaSpace.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl sm:flex">
            📖
          </div>

        </div>

        {/* SUMMARY */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
              📚
            </div>

            <p className="text-sm text-gray-500">
              Kursus Diikuti
            </p>

            <h2 className="mt-1 text-3xl font-extrabold text-violet-700">
              {summary.total_courses || 0}
            </h2>

          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
              ✅
            </div>

            <p className="text-sm text-gray-500">
              Materi Diselesaikan
            </p>

            <h2 className="mt-1 text-3xl font-extrabold text-green-600">
              {summary.completed_contents || 0}
            </h2>

          </div>

        </div>

        {/* HISTORY */}
        <section className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-7">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Aktivitas Terbaru
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Semua aktivitas belajarmu tercatat di sini.
              </p>
            </div>

          </div>

          {/* FILTER */}
          <div className="mb-6 flex flex-wrap gap-2">

            <button
              onClick={() => setFilter("all")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                filter === "all"
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-600 hover:bg-violet-100"
              }`}
            >
              Semua
            </button>

            <button
              onClick={() => setFilter("completed")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                filter === "completed"
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-600 hover:bg-violet-100"
              }`}
            >
              Materi Selesai
            </button>

            <button
              onClick={() => setFilter("enrollment")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                filter === "enrollment"
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-600 hover:bg-violet-100"
              }`}
            >
              Kursus Diikuti
            </button>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="py-12 text-center text-gray-400">
              Memuat riwayat belajar...
            </div>
          )}

          {/* EMPTY */}
          {!loading && filteredHistory.length === 0 && (
            <div className="py-12 text-center">

              <div className="mb-3 text-5xl">
                📚
              </div>

              <h3 className="font-bold text-gray-700">
                Belum Ada Aktivitas
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Aktivitas belajarmu akan muncul di sini setelah kamu mulai mengikuti kursus.
              </p>

              <Link
                href="/student/courses"
                className="mt-5 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Jelajahi Kursus
              </Link>

            </div>
          )}

          {/* HISTORY LIST */}
          {!loading && filteredHistory.length > 0 && (

            <div className="space-y-4">

              {filteredHistory.map((item, index) => (

                <div
                  key={`${item.enrollment_id}-${item.activity_type}-${index}`}
                  className="flex gap-4 rounded-2xl border border-purple-50 p-4 transition hover:bg-purple-50/50"
                >

                  {/* ICON */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl">
                    {item.activity_type === "completed"
                      ? "✅"
                      : "📚"}
                  </div>

                  {/* INFORMATION */}
                  <div className="min-w-0 flex-1">

                    <h3 className="font-semibold text-gray-800">
                      {item.activity_type === "completed"
                        ? "Materi Selesai"
                        : "Mengikuti Kursus"}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-violet-700">
                      {item.content_title ||
                        item.course_name}
                    </p>

                    {item.content_title && (
                      <p className="mt-1 text-xs text-gray-500">
                        Kursus: {item.course_name}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">

                      {item.category_name && (
                        <span className="rounded-lg bg-purple-50 px-2 py-1 text-xs text-purple-600">
                          {item.category_name}
                        </span>
                      )}

                      {item.level && (
                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-500">
                          {item.level}
                        </span>
                      )}

                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(item.activity_date)}
                    </p>

                  </div>

                  {/* STATUS */}
                  <div className="hidden shrink-0 sm:block">

                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      item.activity_type === "completed"
                        ? "bg-green-50 text-green-600"
                        : "bg-violet-50 text-violet-600"
                    }`}>
                      {item.activity_type === "completed"
                        ? "Selesai"
                        : "Terdaftar"}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-purple-100 py-5 text-center text-xs text-gray-400">
          © 2026 LinguaSpace. All rights reserved.
        </footer>

      </div>

    </div>
  );
}