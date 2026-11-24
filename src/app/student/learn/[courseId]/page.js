
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function LearningPage({ params }) {
  const { courseId } = use(params);

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [progress, setProgress] = useState({
    total_contents: 0,
    completed_contents: 0,
    percentage: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Mengambil data materi kursus
  async function fetchLearningData() {
    try {
      const response = await fetch(
        `/api/student/learn?course_id=${courseId}`
      );

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Gagal mengambil materi.");
        return;
      }

      setCourse(result.course);
      setContents(result.contents);
      setProgress(result.progress);
      setMessage("");
    } catch (error) {
      setMessage("Terjadi kesalahan saat mengambil materi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLearningData();
  }, [courseId]);

  // Menandai materi selesai
  async function handleComplete(contentId) {
    try {
      setProcessingId(contentId);
      setMessage("");

      const response = await fetch("/api/student/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Gagal menyimpan progress.");
        return;
      }

      // Mengambil ulang data progress terbaru
      await fetchLearningData();

      setMessage(result.message);
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan progress.");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat materi kursus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold text-gray-800">
            Kursus tidak dapat dibuka
          </h1>

          <p className="mt-3 text-red-600">
            {message || "Kursus tidak ditemukan."}
          </p>

          <Link
            href="/student/dashboard"
            className="inline-block mt-6 bg-blue-600 text-white px-5 py-3 rounded-xl"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Tombol kembali */}
        <Link
          href="/student/dashboard"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Kembali ke Dashboard
        </Link>

        {/* Informasi kursus */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mt-6">
          <span className="text-sm font-medium text-blue-600">
            {course.level}
          </span>

          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            {course.name}
          </h1>

          <p className="text-gray-600 mt-3">
            {course.description}
          </p>

          {/* Progress */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">
                Progress Belajar
              </span>

              <span className="font-bold text-blue-600">
                {progress.percentage}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${progress.percentage}%`,
                }}
              />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              {progress.completed_contents} dari{" "}
              {progress.total_contents} materi selesai
            </p>
          </div>
        </div>

        {/* Pesan */}
        {message && (
          <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl">
            {message}
          </div>
        )}

        {/* Daftar materi */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            Daftar Materi
          </h2>

          {contents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500">
                Belum ada materi yang ditambahkan oleh Teacher.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {contents.map((content, index) => (
                <div
                  key={content.id}
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                    <div className="flex-1">
                      <p className="text-sm text-blue-600 font-medium">
                        Materi {index + 1}
                      </p>

                      <h3 className="text-xl font-bold text-gray-800 mt-1">
                        {content.title}
                      </h3>

                      <div className="mt-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {content.content}
                      </div>
                    </div>

                    {/* Status materi */}
                    <div className="shrink-0">
                      {content.is_completed ? (
                        <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          ✓ Selesai
                        </span>
                      ) : (
                        <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Belum selesai
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tombol selesai */}
                  <div className="mt-6 border-t pt-4">
                    <button
                      onClick={() => handleComplete(content.id)}
                      disabled={
                        content.is_completed ||
                        processingId === content.id
                      }
                      className={`px-5 py-3 rounded-xl font-medium transition ${
                        content.is_completed
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300"
                      }`}
                    >
                      {content.is_completed
                        ? "Materi sudah selesai"
                        : processingId === content.id
                        ? "Menyimpan..."
                        : "Tandai Selesai"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pesan jika seluruh materi selesai */}
        {progress.total_contents > 0 &&
          progress.percentage === 100 && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-bold text-green-700">
                Selamat! Semua materi telah selesai 🎉
              </h2>

              <p className="text-green-600 mt-2">
                Kamu telah menyelesaikan seluruh materi kursus ini.
              </p>
            </div>
          )}

      </div>
    </div>
  );
}
