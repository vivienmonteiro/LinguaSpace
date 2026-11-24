import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session.user) {
      return Response.json(
        { success: false, message: "Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    if (session.user.role !== "student") {
      return Response.json(
        { success: false, message: "Hanya Student yang dapat mengajukan." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const applicant_name = body.name?.trim();
    const language = body.language?.trim();
    const experience = body.experience?.trim();
    const description = body.description?.trim();

    if (!applicant_name || !language || !experience || !description) {
      return Response.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const existing = await pool.query(
      `SELECT id
       FROM teacher_applications
       WHERE user_id = $1 AND status = 'pending'`,
      [session.user.id]
    );

    if (existing.rows.length > 0) {
      return Response.json(
        {
          success: false,
          message: "Kamu masih memiliki pengajuan yang menunggu persetujuan.",
        },
        { status: 409 }
      );
    }

    await pool.query(
      `INSERT INTO teacher_applications
       (user_id, applicant_name, language, experience, description, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [
        session.user.id,
        applicant_name,
        language,
        experience,
        description,
      ]
    );

    return Response.json({
      success: true,
      message: "Pengajuan berhasil dikirim dan menunggu persetujuan Admin.",
    });
  } catch (error) {
    console.error("Teacher application error:", error);

    return Response.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}