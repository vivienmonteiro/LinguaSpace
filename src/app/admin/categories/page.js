
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // State tambah kategori
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // State edit kategori
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // State konfirmasi hapus
  const [deleteCategory, setDeleteCategory] = useState(null);

  // Mengambil kategori
  async function loadCategories() {
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();

      if (result.success) {
        setCategories(result.data || []);
      } else {
        setMessage(result.message);
      }
    } catch {
      setMessage("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Tambah kategori
  async function handleAddCategory(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setMessage("Kategori berhasil ditambahkan!");

      setName("");
      setDescription("");

      await loadCategories();
    } catch {
      setMessage("Gagal menambahkan kategori.");
    }
  }

  // Membuka modal Edit
  function handleEdit(category) {
    setEditCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || "");
  }

  // Simpan Edit
  async function handleSaveEdit(e) {
    e.preventDefault();

    if (!editCategory) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${editCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            description: editDescription,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setMessage("Kategori berhasil diperbarui!");
      setEditCategory(null);

      await loadCategories();
    } catch {
      setMessage("Gagal mengedit kategori.");
    }
  }

  // Hapus kategori
  async function handleDelete() {
    if (!deleteCategory) return;

    try {
      const response = await fetch(
        `/api/admin/categories/${deleteCategory.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      setMessage(result.message);

      if (result.success) {
        setDeleteCategory(null);
        await loadCategories();
      } else {
        setDeleteCategory(null);
      }
    } catch {
      setMessage("Gagal menghapus kategori.");
      setDeleteCategory(null);
    }
  }

  // Search
  const filteredCategories = categories.filter((category) => {
    const keyword = search.toLowerCase();

    return (
      (category.name || "").toLowerCase().includes(keyword) ||
      (category.description || "").toLowerCase().includes(keyword)
    );
  });

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Categories", href: "/admin/categories", icon: "🌎" },
    { name: "Teacher Applications", href: "/admin/teachers", icon: "📝" },
  ];

  const inputStyle =
    "w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  const labelStyle = "mb-2 block text-sm font-semibold text-[#393779]";

  return (
    <div className="min-h-screen bg-[#f7f6ff] md:flex">

      {/* SIDEBAR */}
      <aside className="z-20 flex w-full flex-col border-b border-violet-100 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 border-b border-violet-100 px-6 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-2xl shadow-lg shadow-violet-200">
            🪐
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#25245b]">
              LinguaSpace
            </h2>
            <p className="text-xs font-medium text-violet-500">
              Admin Panel
            </p>
          </div>
        </div>

        <div className="px-5 pb-2 pt-6">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Main Menu
          </p>

          <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {menu.map((item) => {
              const active = item.href === "/admin/categories";

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-200"
                      : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden px-5 pb-5 pt-6 md:block">
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 p-4">
            <div className="mb-2 text-2xl">✨</div>
            <p className="text-sm font-bold text-[#393779]">
              Organize Learning
            </p>
            <p className="mt-1 text-xs leading-relaxed text-violet-700">
              Keep course categories organized for every learner.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="px-5 pb-5 md:hidden">
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-semibold text-violet-500">
              LinguaSpace / Admin
            </p>
            <h1 className="text-2xl font-extrabold text-[#25245b] sm:text-3xl">
              Category Management 🌎
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Organize and manage all learning categories.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
          >
            <span>←</span>
            Back to Dashboard
          </Link>
        </div>

        {/* WELCOME BANNER */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#393779] via-violet-700 to-purple-600 p-6 text-white shadow-xl shadow-violet-200 sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-2 text-sm font-medium text-violet-200">
              CATEGORY ADMINISTRATION
            </p>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Organize Your Learning Categories!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-violet-100">
              Create and manage categories to make every language course
              easier to discover and organize.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-12 text-[170px] opacity-15">
            🌎
          </div>
          <div className="pointer-events-none absolute -bottom-16 right-40 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-violet-200 bg-white p-4 text-sm font-medium text-[#393779] shadow-sm">
            <span className="text-lg">ℹ️</span>
            <p>{message}</p>
          </div>
        )}

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Categories
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-[#25245b]">
                  {loading ? "..." : categories.length}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Registered learning categories
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl text-white shadow-lg">
                🌎
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Search Results
                </p>
                <h3 className="mt-2 text-3xl font-extrabold text-[#25245b]">
                  {loading ? "..." : filteredCategories.length}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Categories matching your search
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-2xl text-white shadow-lg">
                🔎
              </div>
            </div>
          </div>
        </div>

        {/* ADD CATEGORY FORM */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-extrabold text-[#25245b]">
                ➕ Add New Category
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the information below to create a category.
              </p>
            </div>

            <span className="w-fit rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold text-violet-700">
              NEW CATEGORY
            </span>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-5 p-6">
            <div>
              <label className={labelStyle}>Category Name</label>
              <input
                type="text"
                placeholder="Contoh: English"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Description</label>
              <textarea
                placeholder="Tuliskan deskripsi kategori..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputStyle}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-700 sm:w-auto"
            >
              ✨ Add Category
            </button>
          </form>
        </section>

        {/* CATEGORY LIST */}
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">

          {/* SEARCH HEADER */}
          <div className="border-b border-violet-100 p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-[#25245b]">
                  🌎 All Categories
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all registered categories.
                </p>
              </div>

              <span className="w-fit rounded-full bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700">
                {filteredCategories.length} Categories
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>
              <input
                type="text"
                placeholder="Search category name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] py-3 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#f7f5ff]">
                <tr className="text-xs font-bold uppercase tracking-wider text-[#55518d]">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Category Name</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-500">
                      <div className="text-3xl">⏳</div>
                      <p className="mt-2 text-sm">Loading categories...</p>
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center">
                      <div className="text-4xl">🌎</div>
                      <p className="mt-3 font-semibold text-[#393779]">
                        No categories found.
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Try another keyword or add a new category.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="transition hover:bg-violet-50/60"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-gray-500">
                        #{category.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#25245b]">
                          {category.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          LinguaSpace Category
                        </p>
                      </td>

                      <td className="max-w-md px-5 py-4 text-sm leading-relaxed text-gray-600">
                        {category.description || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => setDeleteCategory(category)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-violet-100 bg-[#faf9ff] px-5 py-4">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-bold text-violet-700">
                {filteredCategories.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-violet-700">
                {categories.length}
              </span>{" "}
              categories
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-violet-100 py-5 text-center">
          <p className="text-xs text-gray-400">
            © 2026 LinguaSpace Admin Panel. All rights reserved.
          </p>
        </footer>
      </main>

      {/* MODAL EDIT */}
      {editCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17143b]/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-5">
              <div>
                <h2 className="text-xl font-extrabold text-[#25245b]">
                  ✏️ Edit Category
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update category information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditCategory(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 p-6">
              <div>
                <label className={labelStyle}>Category Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={inputStyle}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-3 font-semibold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-purple-700"
              >
                💾 Save Changes
              </button>

              <button
                type="button"
                onClick={() => setEditCategory(null)}
                className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-600 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {deleteCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17143b]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
              🗑️
            </div>

            <h2 className="text-center text-xl font-extrabold text-[#25245b]">
              Delete Category?
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
              Apakah kamu yakin ingin menghapus kategori{" "}
              <span className="font-bold text-[#393779]">
                {deleteCategory.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setDeleteCategory(null)}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-600 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
