
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

// Form kursus
function CourseForm({
  categories,
  teachers,
  values,
  setters,
  onSubmit,
  submitText,
}) {
  const inputStyle =
    "w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  const labelStyle = "mb-2 block text-sm font-semibold text-[#393779]";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className={labelStyle}>Course Name</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setters.name(e.target.value)}
          placeholder="Contoh: English for Beginners"
          className={inputStyle}
          required
        />
      </div>

      <div>
        <label className={labelStyle}>Description</label>
        <textarea
          value={values.description}
          onChange={(e) => setters.description(e.target.value)}
          placeholder="Tuliskan deskripsi kursus..."
          rows={3}
          className={inputStyle}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelStyle}>Category</label>
          <select
            value={values.categoryId}
            onChange={(e) => setters.categoryId(e.target.value)}
            className={inputStyle}
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
          <label className={labelStyle}>Teacher</label>
          <select
            value={values.teacherId}
            onChange={(e) => setters.teacherId(e.target.value)}
            className={inputStyle}
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
        <label className={labelStyle}>Course Level</label>
        <select
          value={values.level}
          onChange={(e) => setters.level(e.target.value)}
          className={inputStyle}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={labelStyle}>Start Date</label>
          <input
            type="date"
            value={values.startDate}
            onChange={(e) => setters.startDate(e.target.value)}
            className={inputStyle}
          />
        </div>

        <div>
          <label className={labelStyle}>End Date</label>
          <input
            type="date"
            value={values.endDate}
            onChange={(e) => setters.endDate(e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className={labelStyle}>Cover Image URL</label>
        <input
          type="text"
          value={values.coverImage}
          onChange={(e) => setters.coverImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={inputStyle}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-700"
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

      if (courseResult.success) setCourses(courseResult.data || []);
      if (categoryResult.success) setCategories(categoryResult.data || []);

      if (userResult.success) {
        setTeachers(
          (userResult.data || []).filter(
            (user) => user.role === "teacher"
          )
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

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Categories", href: "/admin/categories", icon: "🌎" },
    { name: "Teacher Applications", href: "/admin/teachers", icon: "📝" },
  ];

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      icon: "📚",
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: "🌎",
      color: "from-fuchsia-500 to-purple-500",
    },
    {
      title: "Teachers",
      value: teachers.length,
      icon: "👩‍🏫",
      color: "from-indigo-500 to-violet-600",
    },
    {
      title: "Search Results",
      value: filteredCourses.length,
      icon: "🔎",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const inputValues = {
    name,
    description,
    categoryId,
    teacherId,
    level,
    startDate,
    endDate,
    coverImage,
  };

  const inputSetters = {
    name: setName,
    description: setDescription,
    categoryId: setCategoryId,
    teacherId: setTeacherId,
    level: setLevel,
    startDate: setStartDate,
    endDate: setEndDate,
    coverImage: setCoverImage,
  };

  const editValues = {
    name: editName,
    description: editDescription,
    categoryId: editCategoryId,
    teacherId: editTeacherId,
    level: editLevel,
    startDate: editStartDate,
    endDate: editEndDate,
    coverImage: editCoverImage,
  };

  const editSetters = {
    name: setEditName,
    description: setEditDescription,
    categoryId: setEditCategoryId,
    teacherId: setEditTeacherId,
    level: setEditLevel,
    startDate: setEditStartDate,
    endDate: setEditEndDate,
    coverImage: setEditCoverImage,
  };

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
              const active = item.href === "/admin/courses";

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
              Manage LinguaSpace
            </p>
            <p className="mt-1 text-xs leading-relaxed text-violet-700">
              Keep all learning courses organized in one place.
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
              Course Management 📚
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage, organize, and monitor all learning courses.
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
              COURSE ADMINISTRATION
            </p>
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Build a Better Learning Experience!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-violet-100">
              Manage course information, assign teachers, and organize
              learning categories for LinguaSpace students.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-8 -top-12 text-[170px] opacity-15">
            📚
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
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h3 className="mt-2 text-3xl font-extrabold text-[#25245b]">
                    {loading ? "..." : stat.value}
                  </h3>
                </div>
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-2xl shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD COURSE FORM */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-extrabold text-[#25245b]">
                ➕ Add New Course
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Fill in the information below to create a new course.
              </p>
            </div>
            <span className="w-fit rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold text-violet-700">
              NEW COURSE
            </span>
          </div>

          <div className="p-6">
            <CourseForm
              categories={categories}
              teachers={teachers}
              values={inputValues}
              setters={inputSetters}
              onSubmit={handleAddCourse}
              submitText="✨ Add Course"
            />
          </div>
        </section>

        {/* COURSE LIST */}
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">

          {/* SEARCH HEADER */}
          <div className="border-b border-violet-100 p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-[#25245b]">
                  📖 All Courses
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all registered courses.
                </p>
              </div>

              <span className="w-fit rounded-full bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700">
                {filteredCourses.length} Courses
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🔎
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search course, category, teacher, or level..."
                className="w-full rounded-xl border border-violet-100 bg-[#faf9ff] py-3 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#f7f5ff]">
                <tr className="text-xs font-bold uppercase tracking-wider text-[#55518d]">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Teacher</th>
                  <th className="px-5 py-4">Level</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-500">
                      <div className="text-3xl">⏳</div>
                      <p className="mt-2 text-sm">Loading courses...</p>
                    </td>
                  </tr>
                ) : filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center">
                      <div className="text-4xl">📚</div>
                      <p className="mt-3 font-semibold text-[#393779]">
                        No courses found.
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Try another keyword or add a new course.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className="transition hover:bg-violet-50/60"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-gray-500">
                        #{course.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#25245b]">
                          {course.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          LinguaSpace Course
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                          {course.category_name || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-600">
                        👩‍🏫 {course.teacher_name || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                            course.level === "Beginner"
                              ? "bg-green-50 text-green-700"
                              : course.level === "Intermediate"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {course.level || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-200"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() => setDeleteCourse(course)}
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
                {filteredCourses.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-violet-700">
                {courses.length}
              </span>{" "}
              courses
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
      {editCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#17143b]/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-5">
              <div>
                <h2 className="text-xl font-extrabold text-[#25245b]">
                  ✏️ Edit Course
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update course information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditCourse(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6">
              <CourseForm
                categories={categories}
                teachers={teachers}
                values={editValues}
                setters={editSetters}
                onSubmit={handleSaveEdit}
                submitText="💾 Save Changes"
              />

              <button
                type="button"
                onClick={() => setEditCourse(null)}
                className="mt-3 w-full rounded-xl bg-gray-100 p-3 font-semibold text-gray-600 transition hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {deleteCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17143b]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
              🗑️
            </div>

            <h2 className="text-center text-xl font-extrabold text-[#25245b]">
              Delete Course?
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-gray-500">
              Apakah kamu yakin ingin menghapus kursus{" "}
              <span className="font-bold text-[#393779]">
                {deleteCourse.name}
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
                onClick={() => setDeleteCourse(null)}
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
