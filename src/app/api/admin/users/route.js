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

// GET: mengambil seluruh user
export async function GET() {
  try {
    const auth = await cekAdmin();

    if (auth.error) {
      return Response.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const result = await pool.query(`
      SELECT id, username, email, role, created_at
      FROM users
      ORDER BY id DESC
    `);

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get users error:", error);

    return Response.json(
      { success: false, message: "Gagal mengambil data users." },
      { status: 500 }
    );
  }
}

// POST: menambahkan user baru
export async function POST(request) {
  try {
    const auth = await cekAdmin();

    if (auth.error) {
      return Response.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();

    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role;

    if (!username || !email || !password || !role) {
      return Response.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { success: false, message: "Password minimal 8 karakter." },
        { status: 400 }
      );
    }

    if (!["student", "teacher", "admin"].includes(role)) {
      return Response.json(
        { success: false, message: "Role tidak valid." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword, role]
    );

    return Response.json(
      {
        success: true,
        message: "User berhasil ditambahkan.",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    if (error.code === "23505") {
      return Response.json(
        { success: false, message: "Email atau username sudah digunakan." },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, message: "Gagal menambahkan user." },
      { status: 500 }
    );
  }
}