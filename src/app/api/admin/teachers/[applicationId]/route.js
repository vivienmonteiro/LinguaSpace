
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PATCH(request, { params }) {
  const session = await getSession();

  // Memeriksa akses Admin
  if (!session.user || session.user.role !== "admin") {
    return Response.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { applicationId } = await params;
    const id = Number(applicationId);

    // Validasi ID pengajuan
    if (!Number.isInteger(id) || id <= 0) {
      return Response.json(
        { success: false, message: "ID pengajuan tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const status = body.status;

    // Validasi status
    if (!["approved", "rejected"].includes(status)) {
      return Response.json(
        { success: false, message: "Status tidak valid." },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Mengambil data pengajuan
      const application = await client.query(
        `SELECT id, user_id, status
         FROM teacher_applications
         WHERE id = $1
         FOR UPDATE`,
        [id]
      );

      if (application.rows.length === 0) {
        await client.query("ROLLBACK");

        return Response.json(
          { success: false, message: "Pengajuan tidak ditemukan." },
          { status: 404 }
        );
      }

      // Memastikan pengajuan belum pernah ditinjau
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

      // Memperbarui status pengajuan
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
          id,
          isApproved ? new Date() : null,
        ]
      );

      // Jika disetujui, ubah role pengguna menjadi Teacher
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
      },
      { status: 500 }
    );
  }
}
