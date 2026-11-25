
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminContentsPage() {
  const [contents, setContents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [orderIndex, setOrderIndex] = useState("1");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Mengambil data materi dan kursus
  async function fetchContents() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/contents");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data materi.");
      }

      setContents(result.data || []);
      setCourses(result.courses || []);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContents();
  }, []);

  // Membersihkan form
  function resetForm() {
    setCourseId("");
    setTitle("");
    setContent("");
    setOrderIndex("1");
    setEditingId(null);
    setShowForm(false);
  }

  // Membuka form tambah materi
  function handleAdd() {
    setEditingId(null);
    setCourseId(courses.length > 0 ? String(courses[0].id) : "");
    setTitle("");
    setContent("");
    setOrderIndex("1");
    setShowForm(true);
    setMessage("");
  }

  // Membuka form edit materi
  function handleEdit(item) {
    setEditingId(item.id);
    setCourseId(String(item.course_id));
    setTitle(item.title || "");
    setContent(item.content || "");
    setOrderIndex(String(item.order_index || 1));
    setShowForm(true);
    setMessage("");
  }

  // Menyimpan materi baru atau perubahan materi
  async function handleSubmit(event) {
    event.preventDefault();

    if (!courseId || !title.trim() || !content.trim()) {
      setMessage("Semua kolom wajib diisi.");
      setMessageType("error");
      return;
    }

    const order = Number(orderIndex);

    if (!Number.isInteger(order) || order < 1) {
      setMessage("Urutan materi harus berupa angka minimal 1.");
      setMessageType("error");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const url = editingId
        ? `/api/admin/contents/${editingId}`
        : "/api/admin/contents";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: Number(courseId),
          title: title.trim(),
          content: content.trim(),
          order_index: order,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan materi.");
      }

      setMessage(result.message);
      setMessageType("success");
      resetForm();
      await fetchContents();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  // Menghapus materi
  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus materi "${item.title}"?`
    );

    if (!confirmed) return;

    try {
      setMessage("");

      const response = await fetch(`/api/admin/contents/${item.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus materi.");
      }

      setMessage(result.message);
      setMessageType("success");
      await fetchContents();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  }

  // Filter dan pencarian materi
  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item.title?.toLowerCase().includes(keyword) ||
        item.course_name?.toLowerCase().includes(keyword) ||
        item.teacher_name?.toLowerCase().includes(keyword);

      const matchesCourse =
        selectedCourse === "all" ||
        String(item.course_id) === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [contents, search, selectedCourse]);

  const totalCourses = courses.length;
  const totalContents = contents.length;

  const totalTeachers = new Set(
    contents.map((item) => item.teacher_name).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-[#f7f6ff] text-[#25245b]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-[265px] shrink-0 border-r border-violet-100 bg-white px-5 py-7 shadow-sm lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-2xl text-white shadow-md">
              🌐
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                LinguaSpace
              </h1>
              <p className="text-xs font-medium text-violet-400">
                Admin Panel
              </p>
            </div>
          </div>

          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Menu Utama
          </p>

          <nav className="flex flex-col gap-2">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <span className="text-xl">📊</span>
              Dashboard
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <span className="text-xl">👥</span>
              Kelola Users
            </Link>

            <Link
              href="/admin/courses"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <span className="text-xl">📚</span>
              Kelola Kursus
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <span className="text-xl">🗂️</span>
              Kelola Kategori
            </Link>

            <Link
              href="/admin/contents"
              className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 font-bold text-white shadow-md shadow-violet-200"
            >
              <span className="text-xl">📝</span>
              Kelola Materi
            </Link>

            <Link
              href="/admin/teachers"
              className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <span className="text-xl">🎓</span>
              Teacher Applications
            </Link>
          </nav>

          <div className="mt-auto rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 p-4">
            <p className="font-bold text-violet-800">LinguaSpace Admin</p>
            <p className="mt-1 text-xs leading-relaxed text-violet-600">
              Kelola kursus dan materi pembelajaran dengan mudah.
            </p>
          </div>

          <div className="mt-5">
            <LogoutButton />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10">
          {/* HEADER */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-semibold text-violet-500">
                Admin / Kelola Materi
              </p>
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Kelola Materi Pembelajaran
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Atur seluruh materi pembelajaran dari setiap kursus.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
              <span className="text-2xl">👋</span>
              <div>
                <p className="text-sm font-bold">Administrator</p>
                <p className="text-xs text-gray-400">LinguaSpace</p>
              </div>
            </div>
          </div>

          {/* MOBILE NAVIGATION */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Users", href: "/admin/users" },
              { label: "Kursus", href: "/admin/courses" },
              { label: "Kategori", href: "/admin/categories" },
              { label: "Materi", href: "/admin/contents" },
              { label: "Teacher", href: "/admin/teachers" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${
                  item.href === "/admin/contents"
                    ? "bg-violet-600 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* BANNER */}
          <section className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white shadow-lg shadow-violet-200 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="max-w-xl">
                <p className="mb-2 text-sm font-semibold text-violet-100">
                  CONTENT MANAGEMENT
                </p>
                <h3 className="text-2xl font-extrabold sm:text-3xl">
                  Semua Materi dalam Satu Tempat
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-violet-100">
                  Tambahkan materi baru, perbarui isi pembelajaran, dan atur
                  urutan materi untuk setiap kursus.
                </p>
              </div>

              <div className="text-6xl opacity-90">📖</div>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Materi
                  </p>
                  <h3 className="mt-2 text-3xl font-extrabold">
                    {totalContents}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-2xl">
                  📝
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Kursus
                  </p>
                  <h3 className="mt-2 text-3xl font-extrabold">
                    {totalCourses}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
                  📚
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Teacher dengan Materi
                  </p>
                  <h3 className="mt-2 text-3xl font-extrabold">
                    {totalTeachers}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                  🎓
                </div>
              </div>
            </div>
          </section>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mb-6 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                messageType === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <p>{message}</p>
              <button
                onClick={() => setMessage("")}
                className="font-bold"
                aria-label="Tutup pesan"
              >
                ✕
              </button>
            </div>
          )}

          {/* CONTENT TABLE CARD */}
          <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold">Daftar Materi</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Kelola materi dari seluruh kursus yang tersedia.
                </p>
              </div>

              <button
                onClick={handleAdd}
                disabled={courses.length === 0}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + Tambah Materi
              </button>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari judul materi, kursus, atau teacher..."
                className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />

              <select
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
                className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="all">Semua Kursus</option>
                {courses.map((course) => (
                  <option key={course.id} value={String(course.id)}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
                <p className="text-sm text-gray-500">
                  Memuat data materi...
                </p>
              </div>
            ) : filteredContents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-[#faf9ff] px-5 py-14 text-center">
                <div className="mb-3 text-5xl">📚</div>
                <h4 className="font-bold text-[#25245b]">
                  {contents.length === 0
                    ? "Belum Ada Materi"
                    : "Materi Tidak Ditemukan"}
                </h4>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  {contents.length === 0
                    ? "Belum ada materi pembelajaran. Tambahkan materi pertama untuk memulai."
                    : "Coba ubah kata kunci pencarian atau pilihan kursus."}
                </p>

                {contents.length === 0 && courses.length > 0 && (
                  <button
                    onClick={handleAdd}
                    className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
                  >
                    + Tambah Materi Pertama
                  </button>
                )}

                {courses.length === 0 && (
                  <p className="mt-4 text-xs font-medium text-violet-500">
                    Tambahkan kursus terlebih dahulu sebelum membuat materi.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="mb-3 text-xs font-medium text-gray-400">
                  Menampilkan {filteredContents.length} dari {contents.length}{" "}
                  materi
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse text-left">
                    <thead>
                      <tr className="border-y border-violet-100 bg-[#faf9ff] text-xs uppercase tracking-wide text-violet-600">
                        <th className="px-4 py-4">No.</th>
                        <th className="px-4 py-4">Materi</th>
                        <th className="px-4 py-4">Kursus</th>
                        <th className="px-4 py-4">Teacher</th>
                        <th className="px-4 py-4 text-center">Urutan</th>
                        <th className="px-4 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredContents.map((item, index) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 transition hover:bg-violet-50/50"
                        >
                          <td className="px-4 py-4 text-sm font-semibold text-gray-500">
                            {index + 1}
                          </td>

                          <td className="max-w-[250px] px-4 py-4">
                            <p className="font-bold text-[#25245b]">
                              {item.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                              {item.content}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-block rounded-lg bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
                              {item.course_name}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.teacher_name || "Belum tersedia"}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                              {item.order_index}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(item)}
                                className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          <p className="mt-6 text-center text-xs text-gray-400">
            © 2026 LinguaSpace. Admin Content Management.
          </p>
        </main>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17143b]/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-violet-500">
                  CONTENT MANAGEMENT
                </p>
                <h3 className="mt-1 text-2xl font-extrabold text-[#25245b]">
                  {editingId ? "Edit Materi" : "Tambah Materi Baru"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Lengkapi informasi materi pembelajaran di bawah ini.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Tutup form"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#25245b]">
                  Pilih Kursus <span className="text-red-500">*</span>
                </label>

                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  required
                  className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">-- Pilih Kursus --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={String(course.id)}>
                      {course.name}
                      {course.level ? ` - ${course.level}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#25245b]">
                  Judul Materi <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Introduction to English"
                  required
                  className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#25245b]">
                  Isi Materi <span className="text-red-500">*</span>
                </label>

                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Tuliskan isi materi pembelajaran di sini..."
                  rows={7}
                  required
                  className="w-full resize-y rounded-xl border border-violet-100 bg-[#faf9ff] px-4 py-3 text-sm leading-relaxed outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#25245b]">
                  Urutan Materi <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={orderIndex}
                  onChange={(event) => setOrderIndex(event.target.value)}
                  required
                  className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Angka lebih kecil akan ditampilkan lebih dahulu.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan Perubahan"
                      : "Tambah Materi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
