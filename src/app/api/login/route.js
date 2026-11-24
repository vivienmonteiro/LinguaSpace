
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
    const body = await request.json();

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Validasi input
    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cari pengguna berdasarkan email
    const result = await pool.query(
      `SELECT id, username, email, password, role
       FROM users
       WHERE email = $1`,
      [email]
    );

    // Jika akun tidak ditemukan
    if (result.rows.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Periksa password dengan bcrypt
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return Response.json(
        {
          success: false,
          message: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    // Buat session pengguna
    const session = await getSession();

    session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    await session.save();

    // Login berhasil
    return Response.json({
      success: true,
      message: "Login berhasil!",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
