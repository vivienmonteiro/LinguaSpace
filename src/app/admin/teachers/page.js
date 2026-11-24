"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

      setApplications(result.data);
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
      }
    } catch (error) {
      setMessage("Gagal memproses pengajuan.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/dashboard"
          className="mb-6 inline-block text-indigo-600 hover:underline"
        >
          ← Kembali ke Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Applications
          </h1>

          <p className="mt-2 text-gray-600">
            Kelola permohonan pengguna yang ingin menjadi Teacher.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-indigo-50 p-4 text-indigo-700">
            {message}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center">Memuat data pengajuan...</p>
        ) : applications.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Belum ada pengajuan Teacher.
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {application.applicant_name}
                    </h2>

                    <p className="text-gray-600">
                      {application.email}
                    </p>

                    <p className="text-sm text-gray-500">
                      Username: {application.username}
                    </p>
                  </div>

                  <span
                    className={`h-fit rounded-full px-4 py-2 text-sm font-semibold ${
                      application.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <p>
                    <strong>Bahasa yang diajar:</strong>{" "}
                    {application.language}
                  </p>

                  <p>
                    <strong>Pengalaman:</strong>{" "}
                    {application.experience}
                  </p>

                  <div>
                    <strong>Deskripsi:</strong>
                    <p className="mt-1 whitespace-pre-wrap text-gray-600">
                      {application.description}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">
                    Tanggal pengajuan:{" "}
                    {new Date(application.requested_at).toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>

                {application.status === "pending" && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        reviewApplication(application.id, "approved")
                      }
                      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        reviewApplication(application.id, "rejected")
                      }
                      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}