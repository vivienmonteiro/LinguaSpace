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

    const courseResult = await pool.query(
      `SELECT COUNT(*) AS total
       FROM courses
       WHERE teacher_id = $1`,
      [teacherId]
    );

    const studentResult = await pool.query(
      `SELECT COUNT(DISTINCT e.student_id) AS total
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.teacher_id = $1`,
      [teacherId]
    );

    const coursesResult = await pool.query(
      `SELECT
          c.id,
          c.name,
          c.level,
          cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat
          ON c.category_id = cat.id
       WHERE c.teacher_id = $1
       ORDER BY c.id DESC`,
      [teacherId]
    );

    return NextResponse.json({
      success: true,
      data: {
        totalCourses: Number(courseResult.rows[0].total),
        totalStudents: Number(studentResult.rows[0].total),
        courses: coursesResult.rows,
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