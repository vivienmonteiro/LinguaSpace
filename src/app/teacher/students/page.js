
"use client";

import { useEffect, useState } from "react";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("/api/teacher/students");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil data Student.");
        }

        setStudents(result.data || []);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-900">
          Student Saya
        </h1>
        <p className="mt-1 text-gray-500">
          Daftar Student yang mengikuti kursus yang kamu ajar.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data Student...</p>
      ) : message ? (
        <div className="rounded-xl bg-red-50 p-4 text-red-600">
          {message}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-xl border border-purple-100 bg-white p-8 text-center">
          <p className="font-semibold text-gray-700">
            Belum ada Student.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Student yang mendaftar di kursusmu akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-purple-100 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-50 text-purple-900">
              <tr>
                <th className="p-4">No.</th>
                <th className="p-4">Nama Student</th>
                <th className="p-4">Email</th>
                <th className="p-4">Total Kursus</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-100"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {student.username}
                  </td>
                  <td className="p-4 text-gray-600">
                    {student.email}
                  </td>
                  <td className="p-4 text-gray-600">
                    {student.total_courses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
