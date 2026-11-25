
"use client";

import { useState } from "react";
import Link from "next/link";

export default function TeacherApplicationPage() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleApplication(e) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
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

      setSuccess(true);
      setMessage(result.message || "Aplikasi berhasil dikirim!");

      setName("");
      setLanguage("");
      setExperience("");
      setDescription("");
    } catch {
      setMessage("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f6ff]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-20 border-b border-purple-100 bg-white/95 px-5 py-4 shadow-sm backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-2xl font-extrabold text-violet-700"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-xl text-white">
              🪐
            </span>
            LinguaSpace
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl px-4 py-2 font-semibold text-violet-700 transition hover:bg-purple-50"
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-12">
        {/* PURPLE BANNER */}
        <div className="mx-auto mb-8 w-full max-w-4xl overflow-hidden rounded-[20px] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 p-4 text-white shadow-lg md:p-5">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-block rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold tracking-widest">
                BECOME A TEACHER
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
                Share Your Knowledge,
                <br />
                Inspire the World!
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-purple-100">
                Jadilah bagian dari komunitas pengajar LinguaSpace.
                Bagikan kemampuan bahasamu dan bantu orang lain
                mengembangkan keterampilan mereka.
              </p>
            </div>

            <div className="hidden h-40 w-40 items-center justify-center rounded-[35px] border border-white/20 bg-white/10 text-8xl shadow-inner md:flex">
              👩🏻‍🏫
            </div>
          </div>
        </div>

        {/* TEACHER APPLICATION FORM */}
        <section className="mx-auto max-w-4xl rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:p-9">
          <div className="mb-7">
            <p className="text-sm font-bold tracking-widest text-violet-600">
              TEACHER REGISTRATION
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-[#30245c] md:text-3xl">
              Teacher Application Form
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Lengkapi informasi berikut untuk mengajukan diri menjadi
              pengajar di LinguaSpace.
            </p>
          </div>

          <form onSubmit={handleApplication} className="space-y-5">
            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#393779]">
                Full Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-purple-100 bg-[#fcfbff] px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-purple-100"
              />
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#393779]">
                Language You Want to Teach
              </label>

              <select
                required
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-purple-100 bg-[#fcfbff] px-4 py-3 text-gray-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-purple-100"
              >
                <option value="" disabled>
                  Select language
                </option>

                <option value="English">English</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Mandarin">Mandarin</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Portuguese">Portuguese</option>
                
              </select>
            </div>

            {/* TEACHING EXPERIENCE */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#393779]">
                Teaching Experience
              </label>

              <input
                type="text"
                required
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Example: 2 years of teaching experience"
                className="w-full rounded-xl border border-purple-100 bg-[#fcfbff] px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-purple-100"
              />
            </div>

            {/* APPLICATION DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-bold text-[#393779]">
                Application Description
              </label>

              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about yourself and why you want to become a teacher..."
                className="w-full resize-y rounded-xl border border-purple-100 bg-[#fcfbff] px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-4 focus:ring-purple-100"
              />
            </div>

            {/* NOTIFICATION */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm leading-6 text-purple-900">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔔</span>

                <p>
                  Your application will be reviewed by the Admin.
                  You will become a Teacher after your application is approved.
                </p>
              </div>
            </div>

            {/* SUCCESS / ERROR MESSAGE */}
            {message && (
              <div
                className={`rounded-xl border p-4 text-sm font-medium ${
                  success
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 py-4 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting Application..."
                : "Submit Application →"}
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="py-9 text-center text-sm text-violet-400">
          © 2026 LinguaSpace · Keep learning, keep growing 💜
        </footer>
      </section>
    </main>
  );
}
