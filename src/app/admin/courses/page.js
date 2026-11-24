"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Form kursus (dipisahkan agar input tidak kehilangan fokus)
function CourseForm({
  categories,
  teachers,
  values,
  setters,
  onSubmit,
  submitText,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Course Name
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setters.name(e.target.value)}
          placeholder="Contoh: English for Beginners"
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(e) => setters.description(e.target.value)}
          placeholder="Deskripsi kursus..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Category
          </label>
          <select
            value={values.categoryId}
            onChange={(e) => setters.categoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
            required
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
          <label className="block mb-2 font-medium text-gray-700">
            Teacher
          </label>
          <select
            value={values.teacherId}
            onChange={(e) => setters.teacherId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
            required
          >
            <option value="">Pilih Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Level
        </label>
        <select
          value={values.level}
          onChange={(e) => setters.level(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={values.startDate}
            onChange={(e) => setters.startDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={values.endDate}
            onChange={(e) => setters.endDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Cover Image URL
        </label>
        <input
          type="text"
          value={values.coverImage}
          onChange={(e) => setters.coverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        {submitText}
      </button>
    </form>
  );
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  // Form tambah
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // Form edit
  const [editCourse, setEditCourse] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editTeacherId, setEditTeacherId] = useState("");
  const [editLevel, setEditLevel] = useState("Beginner");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");

  // Konfirmasi delete
  const [deleteCourse, setDeleteCourse] = useState(null);

  // Mengambil data
  async function loadData() {
    try {
      const [courseResponse, categoryResponse, userResponse] =
        await Promise.all([
          fetch("/api/admin/courses"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/users"),
        ]);

      const courseResult = await courseResponse.json();
      const categoryResult = await categoryResponse.json();
      const userResult = await userResponse.json();

      if (courseResult.success) setCourses(courseResult.data);
      if (categoryResult.success) setCategories(categoryResult.data);

      if (userResult.success) {
        setTeachers(
          userResult.data.filter((user) => user.role === "teacher")
        );
      }

      if (
        !courseResult.success ||
        !categoryResult.success ||
        !userResult.success
      ) {
        setMessage("Gagal mengambil sebagian data.");
      }
    } catch {
      setMessage("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Tambah kursus
  async function handleAddCourse(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category_id: categoryId,
          teacher_id: teacherId,
          level,
          start_date: startDate,
          end_date: endDate,
          cover_image: coverImage,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setMessage("Kursus berhasil ditambahkan!");

      setName("");
      setDescription("");
      setCategoryId("");
      setTeacherId("");
      setLevel("Beginner");
      setStartDate("");
      setEndDate("");
      setCoverImage("");

      await loadData();
    } catch {
      setMessage("Gagal menambahkan kursus.");
    }
  }

  // Membuka modal Edit
  function handleEdit(course) {
    setEditCourse(course);
    setEditName(course.name || "");
    setEditDescription(course.description || "");
    setEditCategoryId(String(course.category_id || ""));
    setEditTeacherId(String(course.teacher_id || ""));
    setEditLevel(course.level || "Beginner");
    setEditStartDate(
      course.start_date ? String(course.start_date).slice(0, 10) : ""
    );
    setEditEndDate(
      course.end_date ? String(course.end_date).slice(0, 10) : ""
    );
    setEditCoverImage(course.cover_image || "");
  }

  // Menyimpan Edit
  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editCourse) return;

    try {
      const response = await fetch(
        `/api/admin/courses/${editCourse.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editName,
            description: editDescription,
            category_id: editCategoryId,
            teacher_id: editTeacherId,
            level: editLevel,
            start_date: editStartDate,
            end_date: editEndDate,
            cover_image: editCoverImage,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setMessage("Kursus berhasil diperbarui!");
      setEditCourse(null);
      await loadData();
    } catch {
      setMessage("Gagal mengedit kursus.");
    }
  }

  // Menghapus kursus
  async function handleDelete() {
    if (!deleteCourse) return;

    try {
      const response = await fetch(
        `/api/admin/courses/${deleteCourse.id}`,
        { method: "DELETE" }
      );

      const result = await response.json();
      setMessage(result.message);

      if (result.success) {
        setDeleteCourse(null);
        await loadData();
      } else {
        setDeleteCourse(null);
      }
    } catch {
      setMessage("Gagal menghapus kursus.");
      setDeleteCourse(null);
    }
  }

  // Search
  const filteredCourses = courses.filter((course) => {
    const keyword = search.toLowerCase();

    return (
      (course.name || "").toLowerCase().includes(keyword) ||
      (course.category_name || "").toLowerCase().includes(keyword) ||
      (course.teacher_name || "").toLowerCase().includes(keyword) ||
      (course.level || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all LinguaSpace courses.
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

        {/* Form tambah */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Add New Course
          </h2>

          <CourseForm
            categories={categories}
            teachers={teachers}
            values={{
              name,
              description,
              categoryId,
              teacherId,
              level,
              startDate,
              endDate,
              coverImage,
            }}
            setters={{
              name: setName,
              description: setDescription,
              categoryId: setCategoryId,
              teacherId: setTeacherId,
              level: setLevel,
              startDate: setStartDate,
              endDate: setEndDate,
              coverImage: setCoverImage,
            }}
            onSubmit={handleAddCourse}
            submitText="Add Course"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course, category, teacher, or level..."
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Tabel kursus */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto text-gray-900">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Course</th>
                <th className="p-4">Category</th>
                <th className="p-4">Teacher</th>
                <th className="p-4">Level</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    Loading courses...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center">
                    No courses found.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-t text-gray-900">
                    <td className="p-4">{course.id}</td>
                    <td className="p-4 font-medium">{course.name}</td>
                    <td className="p-4">{course.category_name || "-"}</td>
                    <td className="p-4">{course.teacher_name || "-"}</td>
                    <td className="p-4">{course.level || "-"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteCourse(course)}
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
        {editCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 my-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Edit Course
              </h2>

              <CourseForm
                categories={categories}
                teachers={teachers}
                values={{
                  name: editName,
                  description: editDescription,
                  categoryId: editCategoryId,
                  teacherId: editTeacherId,
                  level: editLevel,
                  startDate: editStartDate,
                  endDate: editEndDate,
                  coverImage: editCoverImage,
                }}
                setters={{
                  name: setEditName,
                  description: setEditDescription,
                  categoryId: setEditCategoryId,
                  teacherId: setEditTeacherId,
                  level: setEditLevel,
                  startDate: setEditStartDate,
                  endDate: setEditEndDate,
                  coverImage: setEditCoverImage,
                }}
                onSubmit={handleSaveEdit}
                submitText="Save Changes"
              />

              <button
                type="button"
                onClick={() => setEditCourse(null)}
                className="w-full mt-3 bg-gray-200 text-gray-800 p-3 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Modal Delete */}
        {deleteCourse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Delete Course
              </h2>

              <p className="text-gray-600 mb-6">
                Apakah kamu yakin ingin menghapus kursus{" "}
                <span className="font-bold text-gray-900">
                  {deleteCourse.name}
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
                  onClick={() => setDeleteCourse(null)}
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