import pool from "@/lib/db";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

async function cekAdmin() {
  const session = await getSession();

  if (!session.user) {
    return { error: "Belum login", status: 401 };
  }

  if (session.user.role !== "admin") {
    return { error: "Akses ditolak", status: 403 };
  }

  return { user: session.user };
}

// PUT: mengedit user
export async function PUT(request, { params }) {
  try {
    const auth = await cekAdmin();

    if (auth.error) {
      return Response.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role;

    if (!username || !email || !role) {
      return Response.json(
        { success: false, message: "Username, email, dan role wajib diisi." },
        { status: 400 }
      );
    }

    if (!["student", "teacher", "admin"].includes(role)) {
      return Response.json(
        { success: false, message: "Role tidak valid." },
        { status: 400 }
      );
    }

    // Admin tidak boleh mengubah role dirinya sendiri
    if (String(auth.user.id) === String(id) && role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Role akun Admin yang sedang digunakan tidak boleh diubah.",
        },
        { status: 400 }
      );
    }

    let result;

    if (body.password && body.password.length > 0) {
      if (body.password.length < 8) {
        return Response.json(
          { success: false, message: "Password minimal 8 karakter." },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      result = await pool.query(
        `UPDATE users
         SET username = $1,
             email = $2,
             role = $3,
             password = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, username, email, role, created_at`,
        [username, email, role, hashedPassword, id]
      );
    } else {
      result = await pool.query(
        `UPDATE users
         SET username = $1,
             email = $2,
             role = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING id, username, email, role, created_at`,
        [username, email, role, id]
      );
    }

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "User berhasil diperbarui.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update user error:", error);

    if (error.code === "23505") {
      return Response.json(
        { success: false, message: "Email atau username sudah digunakan." },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, message: "Gagal mengedit user." },
      { status: 500 }
    );
  }
}

// DELETE: menghapus user
export async function DELETE(request, { params }) {
  try {
    const auth = await cekAdmin();

    if (auth.error) {
      return Response.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;

    // Admin tidak boleh menghapus akun yang sedang dipakai
    if (String(auth.user.id) === String(id)) {
      return Response.json(
        { success: false, message: "Anda tidak dapat menghapus akun sendiri." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { success: false, message: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "User berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal menghapus user. User mungkin masih memiliki data terkait.",
      },
      { status: 500 }
    );
  }
}