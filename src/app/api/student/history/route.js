import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.user || session.user.role !== "student") {
      return Response.json(
        {
          success: false,
          message: "Akses ditolak.",
        },
        { status: 401 }
      );
    }

    const studentId = session.user.id;

    const result = await pool.query(
      `
      SELECT
        e.id AS enrollment_id,
        e.enrolled_at AS activity_date,
        'enrollment' AS activity_type,
        NULL AS content_title,
        co.name AS course_name,
        ca.name AS category_name,
        co.level
      FROM enrollments e
      JOIN courses co ON co.id = e.course_id
      LEFT JOIN categories ca ON ca.id = co.category_id
      WHERE e.student_id = $1

      UNION ALL

      SELECT
        e.id AS enrollment_id,
        cp.completed_at AS activity_date,
        'completed' AS activity_type,
        ct.title AS content_title,
        co.name AS course_name,
        ca.name AS category_name,
        co.level
      FROM content_progress cp
      JOIN enrollments e ON e.id = cp.enrollment_id
      JOIN contents ct ON ct.id = cp.content_id
      JOIN courses co ON co.id = e.course_id
      LEFT JOIN categories ca ON ca.id = co.category_id
      WHERE e.student_id = $1

      ORDER BY activity_date DESC
      `,
      [studentId]
    );

    const summary = await pool.query(
      `
      SELECT
        COUNT(DISTINCT e.id) AS total_courses,
        COUNT(cp.id) AS completed_contents
      FROM enrollments e
      LEFT JOIN content_progress cp
        ON cp.enrollment_id = e.id
      WHERE e.student_id = $1
      `,
      [studentId]
    );

    return Response.json({
      success: true,
      data: result.rows,
      summary: summary.rows[0],
    });
  } catch (error) {
    console.error("History API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil riwayat belajar.",
      },
      { status: 500 }
    );
  }
}