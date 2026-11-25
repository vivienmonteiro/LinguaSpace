
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

    const userId = session.user.id;

    // Ambil informasi akun
    const result = await pool.query(
      `
      SELECT
        id,
        username,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Ambil pengajuan Teacher terbaru
    const applicationResult = await pool.query(
      `
      SELECT
        id,
        status,
        requested_at,
        approved_at,
        applicant_name,
        language
      FROM teacher_applications
      WHERE user_id = $1
      ORDER BY requested_at DESC, id DESC
      LIMIT 1
      `,
      [userId]
    );

    // Hitung kursus yang diikuti
    const courseResult = await pool.query(
      `
      SELECT COUNT(*) AS total_courses
      FROM enrollments
      WHERE student_id = $1
      `,
      [userId]
    );

    // Hitung materi yang diselesaikan
    const contentResult = await pool.query(
      `
      SELECT COUNT(*) AS completed_contents
      FROM content_progress cp
      JOIN enrollments e ON e.id = cp.enrollment_id
      WHERE e.student_id = $1
      `,
      [userId]
    );

    return Response.json({
      success: true,
      data: {
        ...result.rows[0],

        teacher_application:
          applicationResult.rows[0] || null,

        total_courses:
          Number(courseResult.rows[0].total_courses),

        completed_contents:
          Number(contentResult.rows[0].completed_contents),
      },
    });
  } catch (error) {
    console.error("Profile GET Error:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal mengambil profil.",
      },
      { status: 500 }
    );
  }
}

// =========================
// UPDATE USERNAME
// =========================
export async function PATCH(request) {
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

    const userId = session.user.id;
    const body = await request.json();
    const username = body.username?.trim();

    if (!username) {
      return Response.json(
        {
          success: false,
          message: "Username tidak boleh kosong.",
        },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return Response.json(
        {
          success: false,
          message: "Username harus terdiri dari 3–30 karakter.",
        },
        { status: 400 }
      );
    }

    // Cek username duplikat
    const duplicate = await pool.query(
      `
      SELECT id
      FROM users
      WHERE LOWER(username) = LOWER($1)
        AND id <> $2
      `,
      [username, userId]
    );

    if (duplicate.rows.length > 0) {
      return Response.json(
        {
          success: false,
          message: "Username sudah digunakan.",
        },
        { status: 409 }
      );
    }

    // Update username
    const result = await pool.query(
      `
      UPDATE users
      SET username = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email, role, created_at
      `,
      [username, userId]
    );

    // Update username pada session
    session.user.username = result.rows[0].username;
    await session.save();

    return Response.json({
      success: true,
      message: "Profil berhasil diperbarui.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Profile PATCH Error:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal memperbarui profil.",
      },
      { status: 500 }
    );
  }
}
