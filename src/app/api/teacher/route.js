
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

// GET: mengambil semua kursus milik Teacher yang login
export async function GET() {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const result = await pool.query(
      `SELECT
         c.*,
         cat.name AS category_name
       FROM courses c
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.teacher_id = $1
       ORDER BY c.id DESC`,
      [session.user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("GET teacher courses error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil kursus." },
      { status: 500 }
    );
  }
}

// POST: menambahkan kursus baru milik Teacher
export async function POST(request) {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
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

    if (!name?.trim() || !category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama kursus dan kategori wajib diisi.",
        },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO courses
        (name, description, category_id, teacher_id, level,
         start_date, end_date, cover_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name.trim(),
        description?.trim() || null,
        category_id,
        session.user.id,
        level || "Beginner",
        start_date || null,
        end_date || null,
        cover_image?.trim() || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Kursus berhasil ditambahkan.",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST teacher courses error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan kursus." },
      { status: 500 }
    );
  }
}
