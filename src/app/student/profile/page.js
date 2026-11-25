
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/student/profile");
        const result = await response.json();

        if (result.success) {
          setProfile(result.data);
          setUsername(result.data.username);
        } else {
          setMessage(result.message || "Gagal mengambil profil.");
          setMessageType("error");
        }
      } catch (error) {
        console.error(error);
        setMessage("Terjadi kesalahan saat mengambil profil.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // =========================
  // UPDATE PROFILE
  // =========================
  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (result.success) {
        setProfile((previous) => ({
          ...previous,
          ...result.data,
        }));

        setUsername(result.data.username);
        setEditing(false);
        setMessage(result.message);
        setMessageType("success");
      } else {
        setMessage(result.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Gagal menyimpan perubahan profil.");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // CANCEL EDIT
  // =========================
  function handleCancel() {
    setUsername(profile.username);
    setEditing(false);
    setMessage("");
  }

  // =========================
  // FORMAT DATE
  // =========================
  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7fc]">
        <p className="text-violet-600">Memuat profil...</p>
      </div>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f7fc] px-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">
            Profil tidak dapat ditemukan.
          </p>

          <Link
            href="/dashboard"
            className="mt-4 inline-block text-violet-600 hover:underline"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const initial = profile.username
    ? profile.username.charAt(0).toUpperCase()
    : "S";

  const applicationStatus =
    profile.teacher_application?.status?.toLowerCase();

  return (
    <div className="min-h-screen bg-[#f8f7fc] px-5 py-7 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <header className="mb-7">
          <Link
            href="/dashboard"
            className="mb-3 inline-block text-sm text-violet-500 hover:text-violet-700"
          >
            ← Kembali ke Dashboard
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-800 md:text-3xl">
            Profil Saya
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Kelola informasi akun dan lihat ringkasan perjalanan belajarmu.
          </p>
        </header>

        {/* PROFILE CARD */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">

          <div className="relative h-36 overflow-hidden bg-gradient-to-r from-violet-200 via-purple-100 to-indigo-100">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30" />
            <div className="absolute bottom-0 left-32 h-24 w-24 rounded-full bg-white/20" />
            <div className="absolute -bottom-10 right-40 h-28 w-28 rounded-full bg-purple-200/30" />
          </div>

          <div className="px-6 pb-7 md:px-9">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">

              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-violet-500 text-4xl font-extrabold text-white shadow-sm">
                {initial}
              </div>

              {!editing && (
                <button
                  onClick={() => {
                    setEditing(true);
                    setMessage("");
                  }}
                  className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
                >
                  ✏️ Edit Profil
                </button>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-extrabold text-gray-800">
                {profile.username}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Student LinguaSpace
              </p>

              <span className="mt-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                🎓 Student
              </span>
            </div>
          </div>
        </section>

        {/* TEACHER APPLICATION: PENDING */}
        {applicationStatus === "pending" && (
          <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl">
                ⏳
              </div>

              <div>
                <h2 className="font-bold text-amber-800">
                  Pengajuan Teacher Sedang Ditinjau
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-amber-700">
                  Pengajuan kamu untuk menjadi Teacher LinguaSpace
                  sedang menunggu persetujuan Admin. Silakan periksa
                  kembali halaman profil ini untuk mengetahui hasil
                  pengajuan.
                </p>

                <span className="mt-3 inline-block rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                  Status: Pending
                </span>
              </div>
            </div>
          </section>
        )}

        {/* TEACHER APPLICATION: REJECTED */}
        {applicationStatus === "rejected" && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
                ℹ️
              </div>

              <div>
                <h2 className="font-bold text-red-800">
                  Pengajuan Teacher Belum Disetujui
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-red-700">
                  Maaf, pengajuan kamu untuk menjadi Teacher
                  LinguaSpace belum disetujui oleh Admin.
                  Saat ini kamu masih dapat menggunakan akun
                  sebagai Student.
                </p>

                <span className="mt-3 inline-block rounded-full bg-red-200 px-3 py-1 text-xs font-bold text-red-800">
                  Status: Rejected
                </span>
              </div>
            </div>
          </section>
        )}

        {/* EDIT FORM */}
        {editing && (
          <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-800">
              Edit Informasi Profil
            </h2>

            <form onSubmit={handleSave} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={30}
                  required
                  className="w-full rounded-xl border border-purple-100 px-4 py-3 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  placeholder="Masukkan username"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Username harus terdiri dari 3–30 karakter.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-gray-400"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Email tidak dapat diubah.
                </p>
              </div>

              {message && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    messageType === "success"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}

        {/* MESSAGE AFTER SAVE */}
        {!editing && message && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* ACCOUNT DETAILS */}
        <section className="mb-6 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm md:p-7">
          <h2 className="mb-5 text-lg font-bold text-gray-800">
            Informasi Akun
          </h2>

          <div className="space-y-4">

            <div className="flex items-center gap-4 rounded-xl bg-purple-50/50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                👤
              </div>

              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="mt-1 font-semibold text-gray-700">
                  {profile.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-purple-50/50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                ✉️
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="mt-1 break-all font-semibold text-gray-700">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-purple-50/50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                🎓
              </div>

              <div>
                <p className="text-xs text-gray-400">Role</p>
                <p className="mt-1 font-semibold text-gray-700">
                  Student
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-purple-50/50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                📅
              </div>

              <div>
                <p className="text-xs text-gray-400">Bergabung Sejak</p>
                <p className="mt-1 font-semibold text-gray-700">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* LEARNING STATISTICS */}
        <section className="mb-6">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            Ringkasan Belajar
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                📚
              </div>

              <p className="text-sm text-gray-500">
                Kursus Diikuti
              </p>

              <p className="mt-1 text-3xl font-extrabold text-violet-700">
                {profile.total_courses || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                ✅
              </div>

              <p className="text-sm text-gray-500">
                Materi Selesai
              </p>

              <p className="mt-1 text-3xl font-extrabold text-green-600">
                {profile.completed_contents || 0}
              </p>
            </div>

          </div>
        </section>

        {/* LEARNING HISTORY */}
        <Link
          href="/student/history"
          className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:bg-purple-50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">
              📖
            </div>

            <div>
              <h3 className="font-bold text-gray-800">
                Riwayat Belajar
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Lihat semua aktivitas belajar.
              </p>
            </div>
          </div>

          <span className="text-xl text-violet-500">→</span>
        </Link>

        {/* FOOTER */}
        <footer className="mt-8 border-t border-purple-100 py-5 text-center text-xs text-gray-400">
          © 2026 LinguaSpace. All rights reserved.
        </footer>

      </div>
    </div>
  );
}
