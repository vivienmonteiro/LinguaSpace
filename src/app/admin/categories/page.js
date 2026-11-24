"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        setCategories(result.data);
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
      category.name.toLowerCase().includes(keyword) ||
      (category.description || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Category Management
            </h1>

            <p className="text-gray-600 mt-2">
              Manage course categories in LinguaSpace.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Pesan */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-5">
            {message}
          </div>
        )}

        {/* Form tambah kategori */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Add New Category
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4">

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category Name
              </label>

              <input
                type="text"
                placeholder="Contoh: English"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>

              <textarea
                placeholder="Deskripsi kategori..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Category
            </button>

          </form>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabel kategori */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto text-gray-900">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t text-gray-900"
                  >
                    <td className="p-4">{category.id}</td>

                    <td className="p-4 font-medium">
                      {category.name}
                    </td>

                    <td className="p-4">
                      {category.description || "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteCategory(category)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Edit */}
        {editCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Edit Category
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Category Name
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditCategory(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Modal konfirmasi Delete */}
        {deleteCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delete Category
              </h2>

              <p className="text-gray-600 mb-6">
                Apakah kamu yakin ingin menghapus kategori{" "}
                <span className="font-bold text-gray-900">
                  {deleteCategory.name}
                </span>
                ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
                >
                  Yes, Delete
                </button>

                <button
                  onClick={() => setDeleteCategory(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}