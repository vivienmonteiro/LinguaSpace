import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(request, { params }) {
  const session = await getSession();

  if (!session.user || session.user.role !== "admin") {
    return Response.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  const { applicationId } = await params;

  try {
    const body = await request.json();
    const status = body.status;

    if (!["approved", "rejected"].includes(status)) {
      return Response.json(
        { success: false, message: "Status tidak valid." },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const application = await client.query(
        `SELECT id, user_id, status
         FROM teacher_applications
         WHERE id = $1
         FOR UPDATE`,
        [applicationId]
      );

      if (application.rows.length === 0) {
        await client.query("ROLLBACK");

        return Response.json(
          { success: false, message: "Pengajuan tidak ditemukan." },
          { status: 404 }
        );
      }

      if (application.rows[0].status !== "pending") {
        await client.query("ROLLBACK");

        return Response.json(
          {
            success: false,
            message: "Pengajuan sudah ditinjau sebelumnya.",
          },
          { status: 409 }
        );
      }

      const userId = application.rows[0].user_id;
      const isApproved = status === "approved";

      await client.query(
        `UPDATE teacher_applications
         SET status = $1,
             reviewed_by = $2,
             approved_at = $4,
             updated_at = NOW()
         WHERE id = $3`,
        [
          status,
          session.user.id,
          applicationId,
          isApproved ? new Date() : null,
        ]
      );

      if (isApproved) {
        await client.query(
          `UPDATE users
           SET role = 'teacher',
               updated_at = NOW()
           WHERE id = $1`,
          [userId]
        );
      }

      await client.query("COMMIT");

      return Response.json({
        success: true,
        message: isApproved
          ? "Pengajuan disetujui. Role pengguna menjadi Teacher."
          : "Pengajuan berhasil ditolak.",
      });
    } catch (error) {
      await client.query("ROLLBACK");

      console.error("REVIEW TEACHER ERROR:", error);

      return Response.json(
        {
          success: false,
          message: "Gagal memproses pengajuan.",
          details: error.message,
        },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("PATCH request error:", error);

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}