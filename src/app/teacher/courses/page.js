
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const formAwal = {
  name: "",
  description: "",
  category_id: "",
  level: "Beginner",
  start_date: "",
  end_date: "",
  cover_image: "",
};

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(formAwal);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadCourses() {
    try {
      const response = await fetch("/api/teacher/courses");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data kursus.");
      }

      setCourses(result.courses || []);
      setCategories(result.categories || []);
    } catch (err) {
      setError(err.message || "Gagal memuat kursus.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function bukaTambah() {
    setForm(formAwal);
    setEditingId(null);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function bukaEdit(course) {
    setForm({
      name: course.name || "",
      description: course.description || "",
      category_id: String(course.category_id || ""),
      level: course.level || "Beginner",
      start_date: course.start_date
        ? String(course.start_date).slice(0, 10)
        : "",
      end_date: course.end_date
        ? String(course.end_date).slice(0, 10)
        : "",
      cover_image: course.cover_image || "",
    });

    setEditingId(course.id);
    setMessage("");
    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function tutupForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(formAwal);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const url = editingId
        ? `/api/teacher/courses/${editingId}`
        : "/api/teacher/courses";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          start_date: form.start_date || null,
          end_date: form.end_date || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan Course.");
      }

      setMessage(result.message);
      tutupForm();
      await loadCourses();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    const yakin = window.confirm(
      `Apakah kamu yakin ingin menghapus Course "${name}"?`
    );

    if (!yakin) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/teacher/courses/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus Course.");
      }

      setMessage(result.message);
      await loadCourses();
    } catch (err) {
      setError(err.message || "Gagal menghapus Course.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f6ff] text-[#25245b]">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[250px] flex-col border-r border-purple-100 bg-white px-5 py-7 lg:flex">
          <Link
            href="/teacher/dashboard"
            className="mb-10 flex items-center gap-3 px-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl text-white">
              🪐
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-violet-700">
                LinguaSpace
              </h1>
              <p className="text-xs text-gray-400">Teacher Panel</p>
            </div>
          </Link>

          <p className="mb-4 px-3 text-xs font-semibold uppercase text-gray-400">
            Menu Utama
          </p>

          <nav className="flex flex-col gap-2">
            <Link
              href="/teacher/dashboard"
              className="flex items-center gap-4 rounded-2xl px-5 py-3.5 font-semibold text-[#393779] hover:bg-purple-50"
            >
              <span>⌂</span> Dashboard
            </Link>

            <Link
              href="/teacher/courses"
              className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-3.5 font-semibold text-white shadow-md"
            >
              <span>📚</span> Kursus Saya
            </Link>

            <Link
              href="/teacher/dashboard#students"
              className="flex items-center gap-4 rounded-2xl px-5 py-3.5 font-semibold text-[#393779] hover:bg-purple-50"
            >
              <span>♧</span> Student Saya
            </Link>

            <Link
              href="/teacher/dashboard#profile"
              className="flex items-center gap-4 rounded-2xl px-5 py-3.5 font-semibold text-[#393779] hover:bg-purple-50"
            >
              <span>♙</span> Profil
            </Link>
          </nav>

          <div className="m-1 mt-auto rounded-3xl bg-gradient-to-br from-violet-100 to-purple-50 p-5 text-center">
            <p className="font-bold italic text-violet-500">
              Keep Teaching,
              <br />
              Inspire Your Students!
            </p>
            <div className="mt-4 text-5xl">📚</div>
            <div className="mt-2 text-2xl">🌱 💜</div>
          </div>

          <button
            onClick={async () => {
              const response = await fetch("/api/logout", {
                method: "POST",
              });
              if (response.ok) window.location.href = "/login";
            }}
            className="mt-5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 hover:bg-red-50"
          >
            ↪ Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:ml-[250px] lg:px-10 lg:py-8">
          <header className="mb-8">
            <p className="text-sm text-gray-400">Teacher Panel</p>
            <h1 className="mt-1 text-2xl font-extrabold text-violet-900">
              Kursus Saya
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Buat dan kelola kursus serta materi pembelajaran Anda.
            </p>
          </header>

          {/* MOBILE NAVIGATION */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            <Link href="/teacher/dashboard" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700">
              Dashboard
            </Link>
            <Link href="/teacher/courses" className="shrink-0 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white">
              Kursus Saya
            </Link>
            <Link href="/teacher/dashboard#students" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700">
              Student Saya
            </Link>
            <Link href="/teacher/dashboard#profile" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700">
              Profil
            </Link>
          </div>

          {/* INTRO */}
          <section className="mb-7 rounded-3xl bg-gradient-to-r from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] p-6 sm:p-8">
            <p className="text-sm font-medium text-violet-600">
              Teaching Management
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-violet-900">
              Kelola Kursus Anda 📚
            </h2>
            <p className="mt-2 text-sm text-violet-700">
              Tambahkan kursus baru dan kelola kursus yang Anda ajarkan.
            </p>
          </section>

          {/* NOTIFICATION */}
          {message && (
            <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ADD COURSE BUTTON */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-violet-900">
                Daftar Kursus
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {courses.length} kursus yang Anda miliki
              </p>
            </div>

            <button
              onClick={bukaTambah}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg"
            >
              + Tambah Course
            </button>
          </div>

          {/* COURSE FORM */}
          {showForm && (
            <section className="mb-8 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-violet-900">
                {editingId ? "Edit Course" : "Tambah Course Baru"}
              </h2>

              <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Nama Course *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-violet-500"
                    placeholder="Contoh: English for Beginners"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Kategori *
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Level
                  </label>
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 outline-none focus:border-violet-500"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Cover Image (URL)
                  </label>
                  <input
                    name="cover_image"
                    value={form.cover_image}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-violet-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Tanggal Mulai (Opsional)
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    min={form.start_date || undefined}
                    className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-violet-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border border-purple-200 px-4 py-3 outline-none focus:border-violet-500"
                    placeholder="Jelaskan isi dan tujuan kursus..."
                  />
                </div>

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 font-bold text-white disabled:opacity-60"
                  >
                    {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Course"}
                  </button>

                  <button
                    type="button"
                    onClick={tutupForm}
                    className="rounded-xl border border-purple-200 px-6 py-3 font-semibold text-violet-700 hover:bg-purple-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* COURSE LIST */}
          {loading ? (
            <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
              Memuat data kursus...
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-purple-200 bg-white px-5 py-14 text-center">
              <div className="text-5xl">📚</div>
              <h3 className="mt-4 font-bold text-violet-800">
                Belum Ada Kursus
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Klik Tambah Course untuk membuat kursus pertama Anda.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm"
                >
                  <div className="flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 text-6xl">
                    {course.cover_image ? (
                      <img
                        src={course.cover_image}
                        alt={course.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "📚"
                    )}
                  </div>

                  <div className="p-5">
                    {course.category_name && (
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        {course.category_name}
                      </span>
                    )}

                    <h3 className="mt-3 text-lg font-bold text-violet-900">
                      {course.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 min-h-[60px] text-sm text-gray-500">
                      {course.description || "Belum ada deskripsi."}
                    </p>

                    <p className="mt-3 text-sm text-gray-500">
                      Level: {course.level || "Beginner"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {course.start_date
                        ? new Date(course.start_date).toLocaleDateString("id-ID")
                        : "Tanpa tanggal mulai"}
                      {" — "}
                      {course.end_date
                        ? new Date(course.end_date).toLocaleDateString("id-ID")
                        : "Lifetime Access"}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => bukaEdit(course)}
                        className="rounded-xl border border-purple-200 px-3 py-2.5 text-sm font-semibold text-violet-700 hover:bg-purple-50"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(course.id, course.name)}
                        className="rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        🗑 Hapus
                      </button>
                    </div>

                    <Link
                      href={`/teacher/courses/${course.id}/contents`}
                      className="mt-3 block rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:shadow-md"
                    >
                      Kelola Materi →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer className="mt-10 border-t border-purple-100 py-7 text-center">
            <p className="text-sm text-violet-400">
              © 2026 LinguaSpace · Keep learning, keep growing 💜
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
