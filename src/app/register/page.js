
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [registrationType, setRegistrationType] = useState("student");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Data tambahan Teacher
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama!");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (
      registrationType === "teacher" &&
      (!language || !experience.trim() || !description.trim())
    ) {
      setError("Lengkapi semua informasi pengajuan Teacher.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
          registrationType,
          ...(registrationType === "teacher" && {
            language,
            experience,
            description,
          }),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registrasi gagal.");
        return;
      }

      setSuccess(
        registrationType === "teacher"
          ? "Registrasi berhasil! Akun Student telah dibuat dan pengajuan Teacher sedang menunggu persetujuan Admin."
          : "Registrasi Student berhasil! Mengarahkan ke halaman Login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-indigo-50 px-5 py-10">
      <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-lg md:p-9">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          🪐 LinguaSpace
        </Link>

        <h1 className="mt-8 text-3xl font-extrabold text-gray-900">
          Create Account
        </h1>

        <p className="mt-2 text-gray-500">
          Join LinguaSpace and start your journey with us.
        </p>

        {/* PILIHAN REGISTRASI */}
        <div className="mt-7">
          <label className="mb-3 block font-semibold text-gray-700">
            Choose Your Account Type
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setRegistrationType("student");
                setError("");
                setSuccess("");
              }}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                registrationType === "student"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span className="text-3xl">🎓</span>
              <p className="mt-2 font-bold text-indigo-700">
                Register as Student
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Join courses and start learning.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegistrationType("teacher");
                setError("");
                setSuccess("");
              }}
              className={`rounded-2xl border-2 p-4 text-left transition ${
                registrationType === "teacher"
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span className="text-3xl">👩🏻‍🏫</span>
              <p className="mt-2 font-bold text-indigo-700">
                Register as Teacher
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Share your language knowledge.
              </p>
            </button>
          </div>
        </div>

        {/* PESAN ERROR */}
        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* PESAN SUKSES */}
        {success && (
          <div className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-7 space-y-5">
          {/* NAMA */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min. 8 characters)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
            />
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
            />
          </div>

          {/* FORM TAMBAHAN TEACHER */}
          {registrationType === "teacher" && (
            <div className="space-y-5 rounded-2xl border border-purple-200 bg-purple-50 p-5">
              <div>
                <h2 className="text-lg font-bold text-indigo-800">
                  Teacher Application
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Lengkapi informasi berikut untuk mengajukan diri sebagai
                  pengajar LinguaSpace.
                </p>
              </div>

              {/* BAHASA */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Language You Want to Teach
                </label>

                <select
                  required
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
                >
                  <option value="">Select language</option>
                  <option value="English">English</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Portuguese">Portuguese</option>
                </select>
              </div>

              {/* PENGALAMAN */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Teaching Experience
                </label>

                <input
                  type="text"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Example: 2 years of teaching experience"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Application Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about yourself and why you want to become a teacher..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500"
                />
              </div>

              {/* INFORMASI PENDING */}
              <div className="rounded-xl border border-purple-200 bg-white p-3 text-sm leading-6 text-purple-800">
                🔔 Your application will be reviewed by the Admin. Your
                account will initially have Student access and become
                Teacher after approval.
              </div>
            </div>
          )}

          {/* TOMBOL REGISTER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Registering..."
              : registrationType === "teacher"
                ? "Register as Teacher →"
                : "Register as Student →"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600">
            Login
          </Link>
        </p>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:text-indigo-600"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
