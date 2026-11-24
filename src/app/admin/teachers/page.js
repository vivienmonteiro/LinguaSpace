
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminTeachersPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadApplications() {
    try {
      const response = await fetch("/api/admin/teachers");
      const result = await response.json();

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      setApplications(result.data || []);
      setMessage("");
    } catch (error) {
      setMessage("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function reviewApplication(id, status) {
    const confirmation =
      status === "approved"
        ? "Setujui pengajuan dan ubah role menjadi Teacher?"
        : "Tolak pengajuan ini?";

    if (!confirm(confirmation)) return;

    try {
      const response = await fetch(`/api/admin/teachers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      setMessage(result.message);

      if (result.success) {
        await loadApplications();
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Gagal memproses pengajuan.");
    }
  }

  const pendingCount = applications.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "rejected"
  ).length;

  function getStatusStyle(status) {
    if (status === "approved") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  function getStatusLabel(status) {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
  }

  return (
    <main className="min-h-screen bg-[#f7f6ff] md:flex">

      {/* SIDEBAR */}
      <aside className="w-full border-r border-violet-100 bg-white px-5 py-7 md:fixed md:flex md:h-screen md:w-72 md:flex-col">

        <Link href="/admin/dashboard" className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-2xl shadow-lg shadow-violet-200">
            🌐
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#25245b]">
              LinguaSpace
            </h1>
            <p className="text-xs font-medium text-violet-500">
              ADMIN PANEL
            </p>
          </div>
        </Link>

        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <span className="text-xl">📊</span>
            Dashboard
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <span className="text-xl">👥</span>
            Users
          </Link>

          <Link
            href="/admin/courses"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <span className="text-xl">📚</span>
            Courses
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-gray-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <span className="text-xl">🗂️</span>
            Categories
          </Link>

          <Link
            href="/admin/teachers"
            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 font-bold text-white shadow-lg shadow-violet-200"
          >
            <span className="text-xl">🎓</span>
            Teacher Applications
          </Link>
        </nav>

        <div className="mt-8 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-100 p-4">
          <p className="font-bold text-[#393779]">
            LinguaSpace Admin
          </p>
          <p className="mt-1 text-xs leading-relaxed text-violet-600">
            Manage your language learning platform with ease.
          </p>
          <div className="mt-3 text-3xl">✨</div>
        </div>

        <div className="mt-6 md:mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="w-full px-5 py-7 md:ml-72 md:px-10 md:py-10">

        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-violet-500">
              Admin / Teacher Applications
            </p>

            <h1 className="text-3xl font-extrabold text-[#25245b]">
              Teacher Applications 🎓
            </h1>

            <p className="mt-2 text-gray-500">
              Kelola dan tinjau permohonan pengguna yang ingin menjadi Teacher.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold text-gray-400">
              TOTAL APPLICATIONS
            </p>
            <p className="text-2xl font-extrabold text-violet-700">
              {applications.length}
            </p>
          </div>
        </div>

        {/* BANNER */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-7 text-white shadow-xl shadow-violet-200 md:p-9">
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold tracking-wide">
              TEACHER MANAGEMENT
            </span>

            <h2 className="mt-5 text-2xl font-extrabold md:text-3xl">
              Discover Your Future Teachers!
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-violet-100 md:text-base">
              Periksa setiap permohonan, kenali pengalaman calon pengajar,
              dan pilih teacher terbaik untuk bergabung bersama LinguaSpace.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-5 -top-10 text-[150px] opacity-20">
            🎓
          </div>

          <div className="pointer-events-none absolute -bottom-16 right-36 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Pending Applications
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-amber-600">
                  {pendingCount}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Menunggu peninjauan
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
                ⏳
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Approved Applications
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-green-600">
                  {approvedCount}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Pengajuan diterima
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                ✅
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Rejected Applications
                </p>
                <h3 className="mt-3 text-3xl font-extrabold text-red-600">
                  {rejectedCount}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Pengajuan ditolak
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                ❌
              </div>
            </div>
          </div>

        </div>

        {/* APPLICATION LIST */}
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-violet-100 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-[#25245b]">
                Application List
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Daftar seluruh permohonan calon Teacher.
              </p>
            </div>

            <button
              onClick={loadApplications}
              className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
            >
              ↻ Refresh Data
            </button>
          </div>

          <div className="p-6">

            {message && (
              <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 p-4 text-sm font-medium text-violet-700">
                {message}
              </div>
            )}

            {loading ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
                <p className="font-medium text-gray-500">
                  Memuat data pengajuan...
                </p>
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/50 px-5 py-14 text-center">
                <div className="mb-4 text-5xl">📭</div>
                <h3 className="text-lg font-bold text-[#393779]">
                  Belum Ada Pengajuan
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Saat ini belum ada pengguna yang mengajukan diri menjadi Teacher.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-2xl border border-violet-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100"
                  >

                    {/* APPLICANT HEADER */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-200 text-2xl">
                          👤
                        </div>

                        <div>
                          <h3 className="text-lg font-extrabold text-[#25245b]">
                            {application.applicant_name}
                          </h3>
                          <p className="break-all text-sm text-gray-500">
                            {application.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            @{application.username}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-4 py-2 text-xs font-extrabold ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(application.status)}
                      </span>
                    </div>

                    {/* APPLICATION DETAILS */}
                    <div className="mt-6 space-y-4">

                      <div className="rounded-xl bg-violet-50/70 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-violet-500">
                          🌍 Language to Teach
                        </p>
                        <p className="mt-2 font-bold text-[#393779]">
                          {application.language || "-"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          💼 Teaching Experience
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {application.experience || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-violet-500">
                          📝 Applicant Description
                        </p>
                        <p className="whitespace-pre-wrap break-words rounded-xl border border-gray-100 bg-white p-4 text-sm leading-relaxed text-gray-600">
                          {application.description || "Tidak ada deskripsi."}
                        </p>
                      </div>

                    </div>

                    {/* DATE */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-violet-100 pt-4">
                      <p className="text-xs text-gray-400">
                        📅 Tanggal Pengajuan
                      </p>

                      <p className="text-xs font-semibold text-gray-500">
                        {application.requested_at
                          ? new Date(application.requested_at).toLocaleString(
                              "id-ID"
                            )
                          : "-"}
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    {application.status === "pending" && (
                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <button
                          onClick={() =>
                            reviewApplication(application.id, "approved")
                          }
                          className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-green-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          ✓ Approve
                        </button>

                        <button
                          onClick={() =>
                            reviewApplication(application.id, "rejected")
                          }
                          className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-red-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          ✕ Reject
                        </button>

                      </div>
                    )}

                    {application.status === "approved" && (
                      <div className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700">
                        ✓ Pengajuan telah disetujui.
                      </div>
                    )}

                    {application.status === "rejected" && (
                      <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
                        ✕ Pengajuan telah ditolak.
                      </div>
                    )}

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-violet-100 py-6 text-center">
          <p className="text-sm font-medium text-gray-400">
            © 2026 LinguaSpace. Admin Dashboard.
          </p>
          <p className="mt-1 text-xs text-violet-400">
            Learn Languages, Connect the World 🌍
          </p>
        </footer>

      </section>
    </main>
  );
}
