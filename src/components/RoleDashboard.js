
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleDashboard({ user, roleTitle }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.push("/login");
        router.refresh();
      } else {
        alert(result.message || "Logout gagal.");
        setLoading(false);
      }
    } catch (error) {
      alert("Tidak dapat terhubung ke server.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-indigo-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              LinguaSpace
            </h1>

            <p className="mt-1 text-gray-500">
              {roleTitle} Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user.username}!
          </h2>

          <p className="mt-3 text-gray-600">
            Selamat datang di Dashboard LinguaSpace.
            Kamu berhasil login ke akunmu.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-indigo-50 p-5">
              <p className="text-sm text-gray-500">Username</p>
              <p className="mt-1 font-semibold text-gray-900">
                {user.username}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-5">
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 break-all font-semibold text-gray-900">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-5">
              <p className="text-sm text-gray-500">Role</p>
              <p className="mt-1 font-semibold capitalize text-gray-900">
                {user.role}
              </p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-5">
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 font-semibold text-green-700">
                Logged In
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
