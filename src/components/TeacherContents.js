"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeacherContents({ courseId }) {
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);

  const [editContent, setEditContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editOrderIndex, setEditOrderIndex] = useState(1);

  const [deleteContent, setDeleteContent] = useState(null);

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
        setMessage(result.message);
      }
    } catch {
      setMessage("Gagal mengambil materi.");
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
        setMessage(result.message);
        return;
      }

      setMessage("Materi berhasil ditambahkan!");
      setTitle("");
      setDescription("");
      setOrderIndex(contents.length + 2);

      await loadContents();
    } catch {
      setMessage("Gagal menambahkan materi.");
    }
  }

  function handleEdit(content) {
    setEditContent(content);
    setEditTitle(content.title || "");
    setEditDescription(content.description || "");
    setEditOrderIndex(content.order_index || 1);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();

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
        setMessage(result.message);
        return;
      }

      setMessage("Materi berhasil diperbarui!");
      setEditContent(null);
      await loadContents();
    } catch {
      setMessage("Gagal mengedit materi.");
    }
  }

  async function handleDelete() {
    if (!deleteContent) return;

    try {
      const response = await fetch(
        `/api/teacher/contents/${deleteContent.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      setMessage(result.message);

      if (result.success) {
        setDeleteContent(null);
        await loadContents();
      }
    } catch {
      setMessage("Gagal menghapus materi.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Content Management
            </h1>

            <p className="text-gray-600 mt-2">
              Kelola materi pembelajaran kursus kamu.
            </p>
          </div>

          <Link
            href="/teacher/dashboard"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg h-fit"
          >
            Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6">
            {message}
          </div>
        )}

        {course && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {course.name}
            </h2>
            <p className="text-gray-500 mt-1">
              Course ID: {course.id}
            </p>
          </div>
        )}

        {/* Form tambah materi */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Add New Content
          </h2>

          <form onSubmit={handleAdd} className="space-y-4">

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Content Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Introduction to English"
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi materi pembelajaran..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Order Number
              </label>

              <input
                type="number"
                min="1"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Add Content
            </button>

          </form>
        </div>

        {/* Daftar materi */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              Course Contents
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-500">Loading contents...</p>
          ) : contents.length === 0 ? (
            <p className="p-6 text-gray-500">
              Belum ada materi di kursus ini.
            </p>
          ) : (
            <div className="divide-y">
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="p-6 flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {content.order_index}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {content.title}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        {content.description || "Tidak ada deskripsi."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 h-fit">
                    <button
                      onClick={() => handleEdit(content)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteContent(content)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Edit */}
        {editContent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-xl rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Edit Content
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Title
                  </label>

                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
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
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Order Number
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={editOrderIndex}
                    onChange={(e) => setEditOrderIndex(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setEditContent(null)}
                  className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

              </form>
            </div>
          </div>
        )}

        {/* Modal Delete */}
        {deleteContent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delete Content
              </h2>

              <p className="text-gray-600 mb-6">
                Yakin ingin menghapus materi{" "}
                <span className="font-bold text-gray-900">
                  {deleteContent.title}
                </span>
                ?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white p-3 rounded-lg"
                >
                  Yes, Delete
                </button>

                <button
                  onClick={() => setDeleteContent(null)}
                  className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-lg"
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