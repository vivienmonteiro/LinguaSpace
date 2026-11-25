
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    // Hanya Student yang memiliki status enrollment.
    const studentId =
      session?.user?.role === "student"
        ? session.user.id
        : null;

    const result = await pool.query(
      `SELECT
          c.id,
          c.name,
          c.description,
          c.category_id,
          cat.name AS category_name,
          c.teacher_id,
          teacher.username AS teacher_name,
          teacher.email AS teacher_email,
          c.level,
          c.start_date,
          c.end_date,
          c.cover_image,
          c.created_at,

          CASE
            WHEN e.id IS NOT NULL THEN TRUE
            ELSE FALSE
          END AS is_enrolled,

          COUNT(DISTINCT material.id)::int AS total_contents,

          COUNT(DISTINCT cp.content_id)::int AS completed_contents,

          CASE
            WHEN COUNT(DISTINCT material.id) = 0 THEN 0
            ELSE ROUND(
              COUNT(DISTINCT cp.content_id) * 100.0 /
              COUNT(DISTINCT material.id)
            )::int
          END AS progress,

          e.enrolled_at,
          e.completed_at

       FROM courses c

       LEFT JOIN categories cat
         ON c.category_id = cat.id

       LEFT JOIN users teacher
         ON c.teacher_id = teacher.id

       LEFT JOIN enrollments e
         ON e.course_id = c.id
         AND e.student_id = $1

       LEFT JOIN contents material
         ON material.course_id = c.id

       LEFT JOIN content_progress cp
         ON cp.enrollment_id = e.id
         AND cp.content_id = material.id

       GROUP BY
          c.id,
          c.name,
          c.description,
          c.category_id,
          cat.name,
          c.teacher_id,
          teacher.username,
          teacher.email,
          c.level,
          c.start_date,
          c.end_date,
          c.cover_image,
          c.created_at,
          e.id,
          e.enrolled_at,
          e.completed_at

       ORDER BY c.created_at DESC`,
      [studentId]
    );

    return Response.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error("Error fetching courses:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}
