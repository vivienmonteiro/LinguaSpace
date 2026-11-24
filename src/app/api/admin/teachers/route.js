
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.user || session.user.role !== "admin") {
      return Response.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    const result = await pool.query(
      `SELECT
          ta.id,
          ta.user_id,
          ta.applicant_name,
          ta.language,
          ta.experience,
          ta.description,
          ta.status,
          ta.requested_at,
          u.username,
          u.email
       FROM teacher_applications ta
       JOIN users u ON u.id = ta.user_id
       ORDER BY ta.requested_at DESC`
    );

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Admin teacher applications error:", error);

    return Response.json(
      { success: false, message: "Gagal mengambil data pengajuan." },
      { status: 500 }
    );
  }
}
