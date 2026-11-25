
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

  // State Forum Diskusi
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState(null);

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

  // Mengambil komentar setiap materi
  async function fetchComments(contentId) {
    try {
      const response = await fetch(
        `/api/student/comments?content_id=${contentId}`
      );

      const result = await response.json();

      if (result.success) {
        setComments((prev) => ({
          ...prev,
          [contentId]: result.data,
        }));
      }
    } catch (error) {
      console.error("Gagal mengambil komentar:", error);
    }
  }

  useEffect(() => {
    contents.forEach((content) => {
      fetchComments(content.id);
    });
  }, [contents]);

  // Mengirim komentar
  async function handleSendComment(contentId) {
    const comment = commentInputs[contentId]?.trim();

    if (!comment) return;

    try {
      setCommentLoading(contentId);

      const response = await fetch("/api/student/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_id: contentId,
          comment,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Gagal mengirim komentar.");
        return;
      }

      setCommentInputs((prev) => ({
        ...prev,
        [contentId]: "",
      }));

      await fetchComments(contentId);
      setMessage(result.message);
    } catch (error) {
      setMessage("Terjadi kesalahan saat mengirim komentar.");
    } finally {
      setCommentLoading(null);
    }
  }

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

      await fetchLearningData();
      setMessage(result.message);
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan progress.");
    } finally {
      setProcessingId(null);
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6ff]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-violet-600" />
          <p className="mt-4 font-medium text-violet-700">
            Memuat materi kursus...
          </p>
        </div>
      </div>
    );
  }

  // Kursus tidak ditemukan
  if (!course) {
    return (
      <div className="min-h-screen bg-[#f7f6ff] p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
            📚
          </div>

          <h1 className="text-2xl font-bold text-violet-900">
            Kursus tidak dapat dibuka
          </h1>

          <p className="mt-3 text-violet-600">
            {message || "Kursus tidak ditemukan."}
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-3 font-semibold text-white"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6ff] text-[#25245b]">
      <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">

        {/* HEADER */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="font-semibold text-violet-600 hover:text-purple-800"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* INFORMASI KURSUS */}
        <section className="relative overflow-hidden rounded-[28px] border border-purple-100 bg-white p-6 shadow-sm md:p-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-100/70" />
          <div className="absolute -bottom-16 right-32 h-36 w-36 rounded-full bg-purple-50" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-violet-100 px-4 py-1.5 text-sm font-semibold text-violet-700">
              {course.level || "Language Course"}
            </span>

            <h1 className="mt-4 text-2xl font-extrabold text-violet-950 md:text-3xl">
              {course.name}
            </h1>

            <p className="mt-3 leading-relaxed text-gray-600">
              {course.description}
            </p>

            {/* PROGRESS */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold text-violet-900">
                  Progress Belajar
                </span>

                <span className="font-bold text-violet-700">
                  {progress.percentage}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-700"
                  style={{
                    width: `${progress.percentage}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-sm text-violet-500">
                {progress.completed_contents} dari{" "}
                {progress.total_contents} materi selesai
              </p>
            </div>
          </div>
        </section>

        {/* PESAN */}
        {message && (
          <div className="mt-5 rounded-2xl border border-purple-200 bg-violet-50 p-4 text-sm font-medium text-violet-800">
            {message}
          </div>
        )}

        {/* DAFTAR MATERI */}
        <section className="mt-9">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-xl">
              📚
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-violet-950">
                Daftar Materi
              </h2>

              <p className="mt-1 text-sm text-violet-500">
                Pelajari setiap materi dan selesaikan pembelajaranmu.
              </p>
            </div>
          </div>

          {contents.length === 0 ? (
            <div className="rounded-3xl border border-purple-100 bg-white px-6 py-12 text-center shadow-sm">
              <div className="text-5xl">📖</div>

              <h3 className="mt-4 font-bold text-violet-900">
                Belum Ada Materi
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Belum ada materi yang ditambahkan oleh Teacher.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {contents.map((content, index) => (
                <div
                  key={content.id}
                  className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm transition duration-300 hover:shadow-md md:p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        Materi {index + 1}
                      </span>

                      <h3 className="mt-3 text-lg font-bold leading-relaxed text-violet-950 md:text-xl">
                        {content.title}
                      </h3>

                      <div className="mt-4 whitespace-pre-wrap leading-relaxed text-gray-600">
                        {content.content}
                      </div>
                    </div>

                    {/* STATUS MATERI */}
                    <div className="shrink-0">
                      {content.is_completed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                          ✓ Selesai
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                          ◷ Belum selesai
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TOMBOL SELESAI */}
                  <div className="mt-6 border-t border-purple-100 pt-5">
                    <button
                      onClick={() => handleComplete(content.id)}
                      disabled={
                        content.is_completed ||
                        processingId === content.id
                      }
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                        content.is_completed
                          ? "cursor-not-allowed bg-green-100 text-green-700"
                          : "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-purple-200 hover:from-violet-600 hover:to-purple-700 disabled:cursor-wait disabled:opacity-60"
                      }`}
                    >
                      {content.is_completed
                        ? "✓ Materi sudah selesai"
                        : processingId === content.id
                          ? "Menyimpan..."
                          : "Tandai Selesai"}
                    </button>
                  </div>

                  {/* FORUM DISKUSI */}
                  <div className="mt-6 border-t border-purple-100 pt-5">
                    <h4 className="text-lg font-bold text-violet-900">
                      💬 Forum Diskusi
                    </h4>

                    <div className="mt-4 space-y-3">
                      {(comments[content.id] || []).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl bg-violet-50 p-4"
                        >
                          <p className="font-semibold text-violet-900">
                            {item.username}
                          </p>

                          <p className="mt-1 whitespace-pre-wrap text-gray-700">
                            {item.comment}
                          </p>

                          <p className="mt-2 text-xs text-violet-400">
                            {new Date(item.created_at).toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}

                      {(comments[content.id] || []).length === 0 && (
                        <p className="text-sm text-gray-500">
                          Belum ada diskusi. Jadilah yang pertama berkomentar!
                        </p>
                      )}
                    </div>

                    <textarea
                      value={commentInputs[content.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [content.id]: e.target.value,
                        }))
                      }
                      placeholder="Tulis pertanyaan atau komentar..."
                      className="mt-4 w-full rounded-xl border border-purple-200 p-4 outline-none focus:border-violet-500"
                      rows={3}
                    />

                    <button
                      onClick={() => handleSendComment(content.id)}
                      disabled={
                        !commentInputs[content.id]?.trim() ||
                        commentLoading === content.id
                      }
                      className="mt-3 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                    >
                      {commentLoading === content.id
                        ? "Mengirim..."
                        : "Kirim Komentar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SEMUA MATERI SELESAI */}
        {progress.total_contents > 0 &&
          progress.percentage === 100 && (
            <section className="mt-8 rounded-3xl border border-purple-200 bg-gradient-to-r from-violet-100 via-purple-50 to-indigo-100 p-7 text-center md:p-9">
              <div className="text-5xl">🎓</div>

              <h2 className="mt-4 text-xl font-extrabold text-violet-900 md:text-2xl">
                Selamat! Semua Materi Telah Selesai 🎉
              </h2>

              <p className="mt-3 leading-relaxed text-violet-700">
                Kamu telah menyelesaikan seluruh materi kursus ini.
                Terus tingkatkan kemampuan bahasamu bersama LinguaSpace!
              </p>

              <Link
                href="/student/certificate"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-semibold text-white"
              >
                🎓 Lihat Certificate
              </Link>
            </section>
          )}

        {/* FOOTER */}
        <footer className="py-9 text-center text-sm text-violet-400">
          © 2026 LinguaSpace · Keep learning, keep growing 💜
        </footer>
      </div>
    </div>
  );
}
