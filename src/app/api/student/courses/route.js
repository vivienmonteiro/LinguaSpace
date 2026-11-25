
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses hanya untuk Student.",
        },
        { status: 403 }
      );
    }

    const studentId = session.user.id;

    const result = await pool.query(
      `SELECT
          c.id,
          c.name,
          c.description,
          c.level,
          cat.name AS category_name,
          teacher.username AS teacher_name,

          (SELECT COUNT(*)
           FROM contents co
           WHERE co.course_id = c.id) AS total_contents,

          (SELECT COUNT(*)
           FROM enrollments e
           WHERE e.course_id = c.id
             AND e.student_id = $1) AS is_enrolled,

          (SELECT e.completed_at
           FROM enrollments e
           WHERE e.course_id = c.id
             AND e.student_id = $1
           LIMIT 1) AS completed_at

       FROM courses c

       LEFT JOIN categories cat
          ON c.category_id = cat.id

       LEFT JOIN users teacher
          ON c.teacher_id = teacher.id

       ORDER BY c.id DESC`,
      [studentId]
    );

    const courses = result.rows.map((course) => ({
      ...course,
      total_contents: Number(course.total_contents),
      is_enrolled: Number(course.is_enrolled) > 0,
    }));

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Student courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar kursus.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
