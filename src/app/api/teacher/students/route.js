
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

    const result = await pool.query(
      `SELECT
          u.id,
          u.username,
          u.email,
          COUNT(DISTINCT e.course_id) AS total_courses,
          COUNT(DISTINCT e.id) AS total_enrollments
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users u ON u.id = e.student_id
       WHERE c.teacher_id = $1
       GROUP BY u.id, u.username, u.email
       ORDER BY u.username ASC`,
      [teacherId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Teacher students error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data Student." },
      { status: 500 }
    );
  }
}
