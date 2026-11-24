import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const teacherId = session.user.id;

    // Menghitung total kursus milik teacher
    const courseResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM courses
       WHERE teacher_id = $1`,
      [teacherId]
    );

    // Menghitung jumlah student unik di seluruh kursus teacher
    const studentResult = await pool.query(
      `SELECT COUNT(DISTINCT e.student_id) AS total
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON e.student_id = u.id
       WHERE c.teacher_id = $1
         AND u.role = 'student'`,
      [teacherId]
    );

    // Menghitung total materi dari seluruh kursus teacher
    const contentResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM contents ct
       JOIN courses c ON ct.course_id = c.id
       WHERE c.teacher_id = $1`,
      [teacherId]
    );

    // Mengambil daftar kursus milik teacher
    const coursesResult = await pool.query(
      `SELECT
          c.id,
          c.name,
          c.level,
          cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.teacher_id = $1
       ORDER BY c.id DESC`,
      [teacherId]
    );

    // Mengambil nama student unik beserta kursus yang diikuti
    const studentsResult = await pool.query(
      `SELECT
          u.id,
          u.username,
          u.email,
          ARRAY_AGG(DISTINCT c.name ORDER BY c.name) AS course_names
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON e.student_id = u.id
       WHERE c.teacher_id = $1
         AND u.role = 'student'
       GROUP BY u.id, u.username, u.email
       ORDER BY u.username ASC`,
      [teacherId]
    );

    return NextResponse.json({
      success: true,
      data: {
        totalCourses: Number(courseResult.rows[0].total),
        totalStudents: Number(studentResult.rows[0].total),
        totalContents: Number(contentResult.rows[0].total),
        courses: coursesResult.rows,
        students: studentsResult.rows,
      },
    });
  } catch (error) {
    console.error("Teacher stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil statistik Teacher.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}