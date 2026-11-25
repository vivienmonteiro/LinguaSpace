
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // State tambah user
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  // State edit user
  const [editUser, setEditUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("student");
  const [editPassword, setEditPassword] = useState("");

  // Sidebar Admin
  const menu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "🏠" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Categories", href: "/admin/categories", icon: "🌎" },
    {
      name: "Teacher Applications",
      href: "/admin/teachers",
      icon: "📝",
    },
  ];

  // Mengambil data users dari API
  async function loadUsers() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/users");
      const result = await response.json();

      if (response.ok && result.success) {
        setUsers(result.data || []);
      } else {
        setUsers([]);
        setMessage(result.message || "Gagal mengambil data users.");
      }
    } catch (error) {
      console.error("Load users error:", error);
      setUsers([]);
      setMessage("Terjadi kesalahan saat mengambil data users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // Menambahkan user
  async function handleAddUser(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage("User berhasil ditambahkan!");

        setUsername("");
        setEmail("");
        setPassword("");
        setRole("student");

        await loadUsers();
      } else {
        setMessage(result.message || "Gagal menambahkan user.");
      }
    } catch (error) {
      console.error("Add user error:", error);
      setMessage("Terjadi kesalahan saat menambahkan user.");
    }
  }

  // Membuka modal edit
  function handleEdit(user) {
    setEditUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword("");
    setMessage("");
  }

  // Menyimpan perubahan user
  async function handleSaveEdit(e) {
    e.preventDefault();
    setMessage("");

    if (!editUser) return;

    if (!["student", "teacher", "admin"].includes(editRole)) {
      setMessage("Role tidak valid.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          role: editRole,
          password: editPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage("Data user berhasil diperbarui!");

        setEditUser(null);
        setEditPassword("");

        await loadUsers();
      } else {
        setMessage(result.message || "Gagal memperbarui user.");
      }
    } catch (error) {
      console.error("Edit user error:", error);
      setMessage("Terjadi kesalahan saat memperbarui user.");
    }
  }

  // Menghapus user
  async function handleDelete(user) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus user ${user.username}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage("User berhasil dihapus!");
        await loadUsers();
      } else {
        setMessage(result.message || "Gagal menghapus user.");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      setMessage("Terjadi kesalahan saat menghapus user.");
    }
  }

  // Filter pencarian
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.username?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword) ||
      user.teacher_application_status?.toLowerCase().includes(keyword)
    );
  });

  // Warna badge berdasarkan role
  function getRoleStyle(userRole) {
    switch (userRole) {
      case "admin":
        return "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200";
      case "teacher":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-violet-100 text-violet-800 border-violet-200";
    }
  }

  // Warna badge status pengajuan Teacher
  function getApplicationStatusStyle(status) {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  }

  // Label status pengajuan Teacher
  function getApplicationStatusLabel(status) {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "-";
    }
  }

  const inputStyle =
    "w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium text-[#25245b] outline-none transition placeholder:text-purple-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="min-h-screen bg-[#f7f6ff] md:flex">
      {/* SIDEBAR */}
      <aside className="z-30 w-full border-b border-purple-100 bg-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-b-0 md:border-r">
        <div className="border-b border-purple-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl shadow-md shadow-purple-200">
              🪐
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#25245b]">
                LinguaSpace
              </h1>
              <p className="mt-1 text-xs font-semibold text-violet-500">
                Administrator Panel
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-6">
          <p className="mb-4 px-3 text-xs font-extrabold uppercase tracking-widest text-violet-400">
            Main Menu
          </p>

          <nav className="flex gap-2 overflow-x-auto pb-3 md:flex-col md:overflow-visible">
            {menu.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex shrink-0 items-center gap-3 rounded-xl px-4 py-3.5 transition duration-200 ${
                  index === 1
                    ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-purple-200"
                    : "text-[#393779] hover:bg-purple-50 hover:text-violet-700"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl ${
                    index === 1
                      ? "bg-white/20"
                      : "bg-purple-50 group-hover:bg-purple-100"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-sm font-extrabold">{item.name}</span>

                {index === 1 && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto hidden p-5 md:block">
          <div className="rounded-2xl bg-gradient-to-br from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] p-4">
            <div className="mb-2 text-2xl">💜</div>
            <p className="text-sm font-extrabold text-[#393779]">
              LinguaSpace
            </p>
            <p className="mt-1 text-xs font-medium leading-5 text-violet-500">
              Empowering everyone to learn a new language.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:ml-64 md:px-8 md:py-8 lg:px-10">
        {/* HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2">
              <span className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-extrabold tracking-wide text-violet-700">
                ADMIN PANEL
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-[#25245b] md:text-3xl">
              User Management
            </h2>

            <p className="mt-2 text-sm font-medium text-gray-500">
              Manage all users registered on the LinguaSpace platform.
            </p>
          </div>
        </header>

        {/* WELCOME BANNER */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#f0eaff] via-[#f5f1ff] to-[#e9e5ff] p-6 shadow-sm md:p-8">
          <div className="relative z-10 max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-violet-700 shadow-sm">
              ✨ User Administration
            </div>

            <h3 className="text-2xl font-extrabold text-[#393779] md:text-3xl">
              Manage Your Users!
            </h3>

            <p className="mt-3 text-sm font-medium leading-6 text-[#7772A5] md:text-base">
              Add new accounts, update user information, and manage Student,
              Teacher, and Admin roles in LinguaSpace.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-12 h-52 w-52 rounded-full bg-purple-200/50" />
          <div className="pointer-events-none absolute -bottom-20 right-36 h-48 w-48 rounded-full bg-violet-200/40" />
          <div className="pointer-events-none absolute right-8 top-8 text-6xl opacity-30 md:right-16 md:text-7xl">
            👥
          </div>
        </section>

        {/* STATISTICS */}
        <section className="mb-8">
          <div className="mb-5">
            <h3 className="text-xl font-extrabold text-[#25245b]">
              User Overview
            </h3>
            <p className="mt-1 text-sm font-medium text-gray-500">
              Overview of all registered accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Total Users",
                value: users.length,
                icon: "👥",
                color: "from-violet-500 to-purple-500",
                iconBg: "bg-violet-100",
              },
              {
                title: "Students",
                value: users.filter((user) => user.role === "student").length,
                icon: "🎓",
                color: "from-purple-500 to-fuchsia-400",
                iconBg: "bg-purple-100",
              },
              {
                title: "Teachers",
                value: users.filter((user) => user.role === "teacher").length,
                icon: "👩🏻‍🏫",
                color: "from-indigo-500 to-violet-500",
                iconBg: "bg-indigo-100",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-100"
              >
                <div className={`h-1.5 bg-gradient-to-r ${card.color}`} />

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#7772A5]">
                        {card.title}
                      </p>
                      <h3 className="mt-3 text-3xl font-extrabold text-[#25245b]">
                        {loading ? "..." : card.value}
                      </h3>
                    </div>

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} text-2xl transition duration-300 group-hover:scale-110`}
                    >
                      {card.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ADD USER FORM */}
        <section className="mb-8 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl text-white shadow-md shadow-purple-200">
              +
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#25245b]">
                Add New User
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Create a new account for LinguaSpace.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputStyle}
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputStyle}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-800"
              >
                + Add User
              </button>
            </div>
          </form>
        </section>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm font-semibold text-[#393779]">
            {message}
          </div>
        )}

        {/* USER LIST */}
        <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-purple-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#25245b]">
                User List
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-500">
                Manage all registered users.
              </p>
            </div>

            <div className="w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="🔍 Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-[#eeebff]">
                <tr className="text-xs font-extrabold uppercase tracking-wider text-[#393779]">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Teacher Application</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center font-semibold text-[#77749d]"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-sm font-semibold text-[#8885a8]"
                    >
                      {users.length === 0
                        ? "No users available."
                        : "No users match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-[#faf9ff]"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-[#77749d]">
                        #{user.id}
                      </td>

                      <td className="px-6 py-4 font-bold text-[#25245b]">
                        {user.username}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#77749d]">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold capitalize ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-extrabold ${getApplicationStatusStyle(
                            user.teacher_application_status
                          )}`}
                        >
                          {getApplicationStatusLabel(
                            user.teacher_application_status
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="rounded-lg bg-violet-100 px-4 py-2 text-xs font-bold text-violet-800 transition hover:bg-violet-200"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="rounded-lg bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200"
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

          <div className="border-t border-purple-100 bg-[#faf9ff] px-6 py-4 text-xs font-semibold text-[#77749d]">
            Showing {loading ? 0 : filteredUsers.length} of {users.length} users
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 pb-3 text-center">
          <p className="text-xs font-medium text-gray-400">
            © 2026 LinguaSpace. Empowering Language Learning. 💜
          </p>
        </footer>
      </main>

      {/* EDIT USER MODAL */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#211d49]/60 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                  EDIT ACCOUNT
                </div>
                <h2 className="text-2xl font-extrabold text-[#25245b]">
                  Edit User
                </h2>
                <p className="mt-1 text-sm text-[#8885a8]">
                  Update user account information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-lg font-bold text-[#393779] transition hover:bg-purple-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className={inputStyle}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#393779]">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className={inputStyle}
                  minLength={8}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-xl border border-purple-200 px-6 py-3 text-sm font-bold text-[#393779] transition hover:bg-purple-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:from-violet-700 hover:to-purple-800"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
