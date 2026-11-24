
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();

    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    // Validasi input
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Username, email, dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        {
          success: false,
          message: "Password minimal 8 karakter.",
        },
        { status: 400 }
      );
    }

    // Cek email
    const cekEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (cekEmail.rows.length > 0) {
      return Response.json(
        {
          success: false,
          message: "Email sudah terdaftar.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword]
    );

    return Response.json(
      {
        success: true,
        message: "Registrasi berhasil!",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === "23505") {
      return Response.json(
        {
          success: false,
          message: "Username atau email sudah digunakan.",
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
