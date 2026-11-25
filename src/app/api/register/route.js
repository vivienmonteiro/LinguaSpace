
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  let client;

  try {
    const body = await request.json();

    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const registrationType = body.registrationType || "student";

    // Validasi data akun
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Nama, email, dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return Response.json(
        {
          success: false,
          message: "Password minimal 8 karakter.",
        },
        { status: 400 }
      );
    }

    if (!["student", "teacher"].includes(registrationType)) {
      return Response.json(
        {
          success: false,
          message: "Jenis registrasi tidak valid.",
        },
        { status: 400 }
      );
    }

    // Validasi email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        {
          success: false,
          message: "Format email tidak valid.",
        },
        { status: 400 }
      );
    }

    // Data tambahan jika mendaftar sebagai Teacher
    const language = body.language?.trim();
    const experience = body.experience?.trim();
    const description = body.description?.trim();

    if (
      registrationType === "teacher" &&
      (!language || !experience || !description)
    ) {
      return Response.json(
        {
          success: false,
          message: "Lengkapi informasi pengajuan Teacher.",
        },
        { status: 400 }
      );
    }

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaksi database
    client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Semua pendaftar awalnya memiliki role Student
      const userResult = await client.query(
        `INSERT INTO users (username, email, password, role)
         VALUES ($1, $2, $3, 'student')
         RETURNING id, username, email, role, created_at`,
        [username, email, hashedPassword]
      );

      const newUser = userResult.rows[0];

      // Jika mendaftar sebagai Teacher, buat pengajuan Pending
      if (registrationType === "teacher") {
        await client.query(
          `INSERT INTO teacher_applications
           (user_id, applicant_name, language, experience, description, status)
           VALUES ($1, $2, $3, $4, $5, 'pending')`,
          [
            newUser.id,
            username,
            language,
            experience,
            description,
          ]
        );
      }

      await client.query("COMMIT");

      return Response.json(
        {
          success: true,
          message:
            registrationType === "teacher"
              ? "Registrasi berhasil! Akun Student dibuat dan pengajuan Teacher sedang menunggu persetujuan Admin."
              : "Registrasi Student berhasil!",
          data: newUser,
        },
        { status: 201 }
      );
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
      client = null;
    }
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === "23505") {
      return Response.json(
        {
          success: false,
          message: "Email atau username sudah digunakan.",
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
  } finally {
    if (client) {
      client.release();
    }
  }
}
