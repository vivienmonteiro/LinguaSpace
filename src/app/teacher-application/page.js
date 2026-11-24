
"use client";

import { useState } from "react";
import Link from "next/link";

export default function TeacherApplicationPage() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleApplication(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/teacher-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          language,
          experience,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Gagal mengirim aplikasi.");
        return;
      }

      setMessage(result.message || "Aplikasi berhasil dikirim!");

      setName("");
      setLanguage("");
      setExperience("");
      setDescription("");
    } catch (error) {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          LinguaSpace
        </Link>

        <Link href="/login" className="text-gray-700 hover:text-indigo-600">
          Login
        </Link>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">

          <p className="font-semibold text-indigo-600">
            BECOME A TEACHER
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Teacher Application
          </h1>

          <p className="mt-3 leading-7 text-gray-700">
            Share your language skills with other learners.
            Submit your application and wait for the Admin approval.
          </p>

          <form onSubmit={handleApplication} className="mt-8 space-y-6">

            {/* Full Name */}
            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Language */}
            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Language You Want to Teach
              </label>

              <select
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="" disabled>
                  Select language
                </option>

                <option value="English">English</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Teaching Experience */}
            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Teaching Experience
              </label>

              <input
                type="text"
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Example: 2 years of teaching experience"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Application Description */}
            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Application Description
              </label>

              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about yourself and why you want to become a teacher..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Information */}
            <div className="rounded-xl bg-yellow-50 p-4 text-sm leading-6 text-yellow-900">
              Your application will be reviewed by the Admin.
              You will become a Teacher after your application is approved.
            </div>

            {/* Message */}
            {message && (
              <div className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-900">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

          </form>

          {/* Back to Home */}
          <Link
            href="/"
            className="mt-6 block text-center text-gray-600 hover:text-indigo-600"
          >
            ← Back to Home
          </Link>

        </div>
      </section>
    </main>
  );
}
