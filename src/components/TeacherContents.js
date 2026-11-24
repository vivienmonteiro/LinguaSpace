
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeacherContents({ courseId }) {
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);

  const [editContent, setEditContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editOrderIndex, setEditOrderIndex] = useState(1);

  const [deleteContent, setDeleteContent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadContents() {
    try {
      const response = await fetch(
        `/api/teacher/contents?course_id=${courseId}`
      );

      const result = await response.json();

      if (result.success) {
        setCourse(result.data.course);
        setContents(result.data.contents);
      } else {
        setMessage(result.message || "Gagal mengambil data materi.");
        setMessageType("error");
      }
    } catch {
      setMessage("Gagal mengambil materi.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContents();
  }, [courseId]);

  async function handleAdd(e) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/teacher/contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: courseId,
          title,
          description,
          order_index: Number(orderIndex),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Gagal menambahkan materi.");
        setMessageType("error");
        return;
      }

      setMessage("Materi berhasil ditambahkan!");
      setMessageType("success");

      setTitle("");
      setDescription("");
      setOrderIndex(contents.length + 2);

      await loadContents();
    } catch {
      setMessage("Gagal menambahkan materi.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(content) {
    setEditContent(content);
    setEditTitle(content.title || "");
    setEditDescription(
      content.description || content.content || ""
    );
    setEditOrderIndex(content.order_index || 1);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/teacher/contents/${editContent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            order_index: Number(editOrderIndex),
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message || "Gagal memperbarui materi.");
        setMessageType("error");
        return;
      }

      setMessage("Materi berhasil diperbarui!");
      setMessageType("success");
      setEditContent(null);

      await loadContents();
    } catch {
      setMessage("Gagal mengedit materi.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteContent) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/teacher/contents/${deleteContent.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      setMessage(result.message);
      setMessageType(result.success ? "success" : "error");

      if (result.success) {
        setDeleteContent(null);
        await loadContents();
      }
    } catch {
      setMessage("Gagal menghapus materi.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F6FF] px-4 py-6 md:px-8 md:py-9">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDE5FF] text-xl text-[#805AD5]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
              </div>

              <span className="text-sm font-semibold text-[#9078C8]">
                LINGUASPACE TEACHER
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#30264A] md:text-3xl">
              Content Management
            </h1>

            <p className="mt-2 text-sm text-[#89819B] md:text-base">
              Kelola materi pembelajaran kursus kamu dengan mudah.
            </p>
          </div>

          <Link
            href="/teacher/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E8DFFF] bg-white px-5 py-3 text-sm font-semibold text-[#7655B5] shadow-sm transition hover:bg-[#F1EBFF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
              <path d="M20 12H9" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* NOTIFICATION */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm ${
              messageType === "success"
                ? "border-[#D8C9F8] bg-[#F1ECFF] text-[#6847A5]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span className="text-lg">
              {messageType === "success" ? "✓" : "!"}
            </span>
            {message}
          </div>
        )}

        {/* COURSE INFORMATION */}
        {course && (
          <div className="mb-7 overflow-hidden rounded-2xl border border-[#EAE2FA] bg-white shadow-sm">
            <div className="h-2 bg-gradient-to-r from-[#BCA4F5] via-[#D6C4FF] to-[#E9DFFF]" />

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0EAFE] text-[#8B6BCB]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3 2 8l10 5 10-5-10-5Z" />
                    <path d="m6 10 6 3 6-3" />
                    <path d="M2 8v8l10 5 10-5V8" />
                  </svg>
                </div>

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[#A18BCB]">
                    Current Course
                  </p>

                  <h2 className="text-lg font-bold text-[#30264A] md:text-xl">
                    {course.name}
                  </h2>

                  <p className="mt-1 text-sm text-[#968DA6]">
                    Course ID: {course.id}
                  </p>
                </div>
              </div>

              <div className="w-fit rounded-xl bg-[#F2EDFF] px-4 py-2 text-sm font-semibold text-[#7957B7]">
                {contents.length} Materi
              </div>
            </div>
          </div>
        )}

        {/* ADD CONTENT FORM */}
        <div className="mb-8 rounded-2xl border border-[#EAE2FA] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EAFE] text-[#8665C5]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#30264A]">
                Add New Content
              </h2>
              <p className="mt-1 text-xs text-[#A098AD]">
                Tambahkan materi baru untuk kursus ini.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#514568]">
                Content Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Introduction to English"
                className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none transition placeholder:text-[#B1A9BD] focus:border-[#A78BDF] focus:ring-4 focus:ring-[#EDE5FF]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#514568]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi materi pembelajaran..."
                rows={4}
                className="w-full resize-y rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none transition placeholder:text-[#B1A9BD] focus:border-[#A78BDF] focus:ring-4 focus:ring-[#EDE5FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#514568]">
                Order Number
              </label>

              <input
                type="number"
                min="1"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none transition focus:border-[#A78BDF] focus:ring-4 focus:ring-[#EDE5FF]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8967CA] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#8967CA]/20 transition hover:bg-[#7654B8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>+</span>
              {submitting ? "Adding..." : "Add Content"}
            </button>
          </form>
        </div>

        {/* CONTENT LIST */}
        <div className="overflow-hidden rounded-2xl border border-[#EAE2FA] bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#F0EBF7] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <div>
              <h2 className="text-lg font-bold text-[#30264A]">
                Course Contents
              </h2>
              <p className="mt-1 text-sm text-[#9A91A9]">
                Daftar seluruh materi pembelajaran kursus.
              </p>
            </div>

            <div className="w-fit rounded-lg bg-[#F2EDFF] px-3 py-2 text-xs font-semibold text-[#7957B7]">
              {contents.length} Total Materi
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-5 py-16">
              <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#E9DFFF] border-t-[#8967CA]" />
              <p className="text-sm text-[#968DA6]">
                Loading contents...
              </p>
            </div>
          ) : contents.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2EDFF] text-[#8967CA]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
              </div>

              <h3 className="font-bold text-[#514568]">
                Belum Ada Materi
              </h3>

              <p className="mt-2 max-w-sm text-sm text-[#A098AD]">
                Kursus ini belum memiliki materi pembelajaran.
                Silakan tambahkan materi melalui formulir di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EBF7]">
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="flex flex-col justify-between gap-5 px-5 py-5 transition hover:bg-[#FCFAFF] md:flex-row md:items-center md:px-7"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE5FF] text-sm font-bold text-[#805DBF]">
                      {content.order_index}
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words font-bold text-[#403451]">
                        {content.title}
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#8D849C]">
                        {content.description ||
                          content.content ||
                          "Tidak ada deskripsi."}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2 md:pl-4">
                    <button
                      onClick={() => handleEdit(content)}
                      className="rounded-lg border border-[#E2D5FA] bg-[#F0EAFE] px-4 py-2 text-sm font-semibold text-[#7957B7] transition hover:bg-[#E5D9FF]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteContent(content)}
                      className="rounded-lg border border-[#F8DADA] bg-[#FFF0F0] px-4 py-2 text-sm font-semibold text-[#D65B69] transition hover:bg-[#FFE1E1]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241936]/40 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-xl rounded-2xl border border-[#EAE2FA] bg-white p-6 shadow-2xl md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#30264A]">
                    Edit Content
                  </h2>
                  <p className="mt-1 text-sm text-[#9A91A9]">
                    Perbarui informasi materi pembelajaran.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditContent(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EFFA] text-[#8068A7] transition hover:bg-[#E9DFFF]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#514568]">
                    Content Title
                  </label>

                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF] focus:ring-4 focus:ring-[#EDE5FF]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#514568]">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF] focus:ring-4 focus:ring-[#EDE5FF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#514568]">
                    Order Number
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={editOrderIndex}
                    onChange={(e) => setEditOrderIndex(e.target.value)}
                    className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF] focus:ring-4 focus:ring-[#EDE5FF]"
                    required
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditContent(null)}
                    className="flex-1 rounded-xl border border-[#E7E0F0] bg-white p-3 text-sm font-semibold text-[#81778F] transition hover:bg-[#F8F6FC]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-[#8967CA] p-3 text-sm font-semibold text-white transition hover:bg-[#7654B8] disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE MODAL */}
        {deleteContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#241936]/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-[#EAE2FA] bg-white p-6 shadow-2xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F0] text-xl text-[#D65B69]">
                !
              </div>

              <h2 className="text-xl font-bold text-[#30264A]">
                Delete Content?
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8D849C]">
                Apakah kamu yakin ingin menghapus materi{" "}
                <span className="font-bold text-[#514568]">
                  {deleteContent.title}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  onClick={() => setDeleteContent(null)}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-[#E7E0F0] bg-white p-3 text-sm font-semibold text-[#81778F] transition hover:bg-[#F8F6FC]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#E66D78] p-3 text-sm font-semibold text-white transition hover:bg-[#D95665] disabled:opacity-60"
                >
                  {submitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pb-3 text-center">
          <p className="text-xs text-[#A69CB5]">
            © 2026 LinguaSpace. Empowering Language Learning.
          </p>
        </div>

      </div>
    </div>
  );
}
