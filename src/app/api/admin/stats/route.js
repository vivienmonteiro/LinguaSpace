import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.user) {
      return Response.json(
        { success: false, message: "Silakan login." },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return Response.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'student') AS total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'teacher') AS total_teachers,
        (SELECT COUNT(*) FROM courses) AS total_courses,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM enrollments) AS total_enrollments
    `);

    return Response.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return Response.json(
      { success: false, message: "Gagal mengambil statistik." },
      { status: 500 }
    );
  }
}