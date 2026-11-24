
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
    const session = await getSession();

    // Memastikan pengguna sudah login sebagai Student
    if (!session.user || session.user.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Hanya Student yang dapat mendaftar kursus.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const courseId = Number(body.course_id);
    const studentId = session.user.id;

    if (!courseId || !Number.isInteger(courseId)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID kursus tidak valid.",
        },
        { status: 400 }
      );
    }

    // Memastikan kursus tersedia
    const courseResult = await pool.query(
      `SELECT id, name FROM courses WHERE id = $1`,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Kursus tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Memeriksa apakah Student sudah mendaftar
    const existingEnrollment = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1 AND course_id = $2`,
      [studentId, courseId]
    );

    if (existingEnrollment.rows.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Kamu sudah terdaftar di kursus ini.",
        already_enrolled: true,
      });
    }

    // Menyimpan pendaftaran
    await pool.query(
      `INSERT INTO enrollments (student_id, course_id)
       VALUES ($1, $2)`,
      [studentId, courseId]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mendaftar kursus!",
        already_enrolled: false,
        course: courseResult.rows[0],
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Enrollment error:", error);

    // Menangani jika pendaftaran duplikat
    if (error.code === "23505") {
      return NextResponse.json({
        success: true,
        message: "Kamu sudah terdaftar di kursus ini.",
        already_enrolled: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mendaftar kursus.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
