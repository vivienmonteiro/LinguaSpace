
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

// Memastikan pengguna adalah Teacher
async function cekTeacher() {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return null;
  }

  return session.user;
}

// GET: mengambil Course milik Teacher dan daftar kategori
export async function GET() {
  const teacher = await cekTeacher();

  if (!teacher) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const courses = await pool.query(
      `SELECT c.*, cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.teacher_id = $1
       ORDER BY c.id DESC`,
      [teacher.id]
    );

    const categories = await pool.query(
      `SELECT id, name FROM categories ORDER BY name ASC`
    );

    return NextResponse.json({
      success: true,
      courses: courses.rows,
      categories: categories.rows,
    });
  } catch (error) {
    console.error("GET Teacher Courses:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data Course." },
      { status: 500 }
    );
  }
}

// POST: membuat Course baru milik Teacher yang sedang login
export async function POST(request) {
  const teacher = await cekTeacher();

  if (!teacher) {
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
      level,
      start_date,
      end_date,
      cover_image,
    } = body;

    if (!name || !category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama Course dan kategori wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (start_date && end_date && start_date > end_date) {
      return NextResponse.json(
        {
          success: false,
          message: "Tanggal selesai tidak boleh sebelum tanggal mulai.",
        },
        { status: 400 }
      );
    }

    const category = await pool.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id]
    );

    if (category.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kategori tidak ditemukan." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO courses
       (name, description, category_id, teacher_id, level, start_date, end_date, cover_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name.trim(),
        description || null,
        category_id,
        teacher.id,
        level || null,
        start_date || null,
        end_date || null,
        cover_image || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Course berhasil dibuat.",
        course: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Teacher Courses:", error);

    return NextResponse.json(
      { success: false, message: "Gagal membuat Course." },
      { status: 500 }
    );
  }
}
