import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

async function cekAdmin() {
  const session = await getSession();

  if (!session.user || session.user.role !== "admin") {
    return false;
  }

  return true;
}

// GET: mengambil semua kursus
export async function GET() {
  const admin = await cekAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const result = await pool.query(`
      SELECT 
        courses.*,
        categories.name AS category_name,
        users.username AS teacher_name
      FROM courses
      LEFT JOIN categories 
        ON courses.category_id = categories.id
      LEFT JOIN users 
        ON courses.teacher_id = users.id
      ORDER BY courses.id DESC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("GET courses error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data kursus." },
      { status: 500 }
    );
  }
}

// POST: menambahkan kursus
export async function POST(request) {
  const admin = await cekAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const {
      name,
      description,
      category_id,
      teacher_id,
      level,
      start_date,
      end_date,
      cover_image,
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama kursus wajib diisi." },
        { status: 400 }
      );
    }

    if (!category_id || !teacher_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Kategori dan Teacher wajib dipilih.",
        },
        { status: 400 }
      );
    }

    // Memastikan Teacher benar-benar memiliki role teacher
    const teacherCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1 AND role = 'teacher'`,
      [teacher_id]
    );

    if (teacherCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Teacher tidak valid." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO courses (
        name,
        description,
        category_id,
        teacher_id,
        level,
        start_date,
        end_date,
        cover_image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        name.trim(),
        description || null,
        category_id,
        teacher_id,
        level || "Beginner",
        start_date || null,
        end_date || null,
        cover_image || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Kursus berhasil ditambahkan!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("POST courses error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menambahkan kursus." },
      { status: 500 }
    );
  }
}