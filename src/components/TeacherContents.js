
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

  // STATE FORUM DISKUSI
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState(null);

  // MENGAMBIL DATA MATERI
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

  // MENGAMBIL KOMENTAR SETIAP MATERI
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

  // MENGIRIM BALASAN TEACHER
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
        setMessage(result.message || "Gagal mengirim balasan.");
        setMessageType("error");
        return;
      }

      setCommentInputs((prev) => ({
        ...prev,
        [contentId]: "",
      }));

      await fetchComments(contentId);

      setMessage("Balasan berhasil dikirim!");
      setMessageType("success");
    } catch {
      setMessage("Gagal mengirim balasan.");
      setMessageType("error");
    } finally {
      setCommentLoading(null);
    }
  }

  // MENAMBAHKAN MATERI
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

  // MEMBUKA FORM EDIT
  function handleEdit(content) {
    setEditContent(content);
    setEditTitle(content.title || "");
    setEditDescription(
      content.description || content.content || ""
    );
    setEditOrderIndex(content.order_index || 1);
  }

  // MENYIMPAN EDIT MATERI
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

  // MENGHAPUS MATERI
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
                📚
              </div>

              <span className="text-sm font-semibold text-[#9078C8]">
                LINGUASPACE TEACHER
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#30264A] md:text-3xl">
              Content Management
            </h1>

            <p className="mt-2 text-sm text-[#89819B] md:text-base">
              Kelola materi pembelajaran dan diskusi kursus kamu.
            </p>
          </div>

          <Link
            href="/teacher/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E8DFFF] bg-white px-5 py-3 text-sm font-semibold text-[#7655B5] shadow-sm transition hover:bg-[#F1EBFF]"
          >
            ← Back to Dashboard
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

              <div className="w-fit rounded-xl bg-[#F2EDFF] px-4 py-2 text-sm font-semibold text-[#7957B7]">
                {contents.length} Materi
              </div>
            </div>
          </div>
        )}

        {/* ADD CONTENT FORM */}
        <div className="mb-8 rounded-2xl border border-[#EAE2FA] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#30264A]">
              Add New Content
            </h2>
            <p className="mt-1 text-xs text-[#A098AD]">
              Tambahkan materi baru untuk kursus ini.
            </p>
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
                className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF]"
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
                className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF]"
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
                className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#8967CA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7654B8] disabled:opacity-60"
            >
              {submitting ? "Adding..." : "+ Add Content"}
            </button>
          </form>
        </div>

        {/* CONTENT LIST */}
        <div className="overflow-hidden rounded-2xl border border-[#EAE2FA] bg-white shadow-sm">
          <div className="border-b border-[#F0EBF7] px-5 py-5 md:px-7">
            <h2 className="text-lg font-bold text-[#30264A]">
              Course Contents
            </h2>

            <p className="mt-1 text-sm text-[#9A91A9]">
              Daftar materi dan forum diskusi setiap materi.
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-[#968DA6]">
              Loading contents...
            </div>
          ) : contents.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <h3 className="font-bold text-[#514568]">
                Belum Ada Materi
              </h3>
              <p className="mt-2 text-sm text-[#A098AD]">
                Tambahkan materi melalui formulir di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EBF7]">
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="px-5 py-6 md:px-7"
                >
                  {/* INFORMASI MATERI */}
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
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

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleEdit(content)}
                        className="rounded-lg border border-[#E2D5FA] bg-[#F0EAFE] px-4 py-2 text-sm font-semibold text-[#7957B7] hover:bg-[#E5D9FF]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteContent(content)}
                        className="rounded-lg border border-[#F8DADA] bg-[#FFF0F0] px-4 py-2 text-sm font-semibold text-[#D65B69] hover:bg-[#FFE1E1]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* FORUM DISKUSI */}
                  <div className="mt-6 rounded-2xl border border-[#EAE2FA] bg-[#FCFAFF] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#514568]">
                          💬 Forum Diskusi
                        </h3>

                        <p className="mt-1 text-xs text-[#A098AD]">
                          Diskusi Student pada materi ini.
                        </p>
                      </div>

                      <span className="rounded-full bg-[#F0EAFE] px-3 py-1 text-xs font-semibold text-[#7957B7]">
                        {(comments[content.id] || []).length} Komentar
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {(comments[content.id] || []).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-[#EEE7F8] bg-white p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[#514568]">
                              {item.username}
                            </p>

                            <span className="rounded-full bg-[#F0EAFE] px-2 py-1 text-xs text-[#7957B7]">
                              {item.role}
                            </span>
                          </div>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F667E]">
                            {item.comment}
                          </p>

                          <p className="mt-2 text-xs text-[#A69CB5]">
                            {new Date(item.created_at).toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}

                      {(comments[content.id] || []).length === 0 && (
                        <p className="rounded-xl bg-white p-4 text-sm text-[#A098AD]">
                          Belum ada diskusi untuk materi ini.
                        </p>
                      )}
                    </div>

                    {/* FORM BALASAN TEACHER */}
                    <div className="mt-4 border-t border-[#EEE7F8] pt-4">
                      <label className="mb-2 block text-sm font-semibold text-[#514568]">
                        Tulis Balasan
                      </label>

                      <textarea
                        value={commentInputs[content.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [content.id]: e.target.value,
                          }))
                        }
                        placeholder="Balas atau tanggapi pertanyaan Student..."
                        rows={3}
                        className="w-full rounded-xl border border-[#E4DDF0] bg-white p-3 text-sm text-[#3F3555] outline-none focus:border-[#A78BDF]"
                      />

                      <button
                        onClick={() => handleSendComment(content.id)}
                        disabled={
                          !commentInputs[content.id]?.trim() ||
                          commentLoading === content.id
                        }
                        className="mt-3 rounded-xl bg-[#8967CA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7654B8] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {commentLoading === content.id
                          ? "Mengirim..."
                          : "Kirim Balasan"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#241936]/40 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-xl rounded-2xl border border-[#EAE2FA] bg-white p-6 shadow-2xl">
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
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3EFFA] text-[#8068A7]"
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
                    className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm outline-none focus:border-[#A78BDF]"
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
                    className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm outline-none focus:border-[#A78BDF]"
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
                    className="w-full rounded-xl border border-[#E4DDF0] bg-[#FCFBFF] px-4 py-3 text-sm outline-none focus:border-[#A78BDF]"
                    required
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setEditContent(null)}
                    className="flex-1 rounded-xl border border-[#E7E0F0] bg-white p-3 text-sm font-semibold text-[#81778F]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-[#8967CA] p-3 text-sm font-semibold text-white disabled:opacity-60"
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
                  className="flex-1 rounded-xl border border-[#E7E0F0] bg-white p-3 text-sm font-semibold text-[#81778F]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#E66D78] p-3 text-sm font-semibold text-white disabled:opacity-60"
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
