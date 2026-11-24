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

  // Mengambil data user
  async function loadUsers() {
    try {
      const response = await fetch("/api/admin/users");
      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
      } else {
        setMessage(result.message || "Gagal mengambil data user.");
      }
    } catch {
      setMessage("Gagal menghubungi server.");
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

      if (!result.success) {
        setMessage(result.message || "Gagal menambahkan user.");
        return;
      }

      setMessage("User berhasil ditambahkan!");

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("student");

      await loadUsers();
    } catch {
      setMessage("Gagal menambahkan user.");
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

    if (!editUser) return;

    const validRoles = ["student", "teacher", "admin"];

    if (!validRoles.includes(editRole)) {
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

      if (!result.success) {
        setMessage(result.message || "Gagal mengedit user.");
        return;
      }

      setMessage("User berhasil diperbarui!");

      setEditUser(null);
      setEditPassword("");

      await loadUsers();
    } catch {
      setMessage("Gagal mengedit user.");
    }
  }

  // Menghapus user
  async function handleDelete(user) {
    const yakin = confirm(
      `Apakah kamu yakin ingin menghapus akun ${user.username}?`
    );

    if (!yakin) return;

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      setMessage(result.message);

      if (result.success) {
        await loadUsers();
      }
    } catch {
      setMessage("Gagal menghapus user.");
    }
  }

  // Search user
  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              User Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all LinguaSpace users.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Form tambah user */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Add New User
          </h2>

          <form
            onSubmit={handleAddUser}
            className="grid md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              placeholder="Password (minimal 8 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={8}
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 md:col-span-2"
            >
              Add User
            </button>
          </form>
        </div>

        {/* Pesan */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg mb-5">
            {message}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-5">
          <input
            type="text"
            placeholder="Search username, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabel user */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto text-gray-900">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t text-gray-900">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">{user.email}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
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

        {/* Modal Edit User */}
        {editUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">

              <h2 className="text-2xl font-bold text-gray-800 mb-5">
                Edit User
              </h2>

              <form onSubmit={handleSaveEdit} className="space-y-4">

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Username
                  </label>

                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Role
                  </label>

                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-gray-700 font-medium">
                    Password Baru
                  </label>

                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minLength={8}
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}