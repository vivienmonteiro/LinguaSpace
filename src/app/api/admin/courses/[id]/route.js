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

// PUT: mengedit kursus
export async function PUT(request, { params }) {
  const admin = await cekAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
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
      `UPDATE courses
       SET name = $1,
           description = $2,
           category_id = $3,
           teacher_id = $4,
           level = $5,
           start_date = $6,
           end_date = $7,
           cover_image = $8,
           updated_at = NOW()
       WHERE id = $9
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
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kursus tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kursus berhasil diperbarui!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("PUT courses error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengedit kursus." },
      { status: 500 }
    );
  }
}

// DELETE: menghapus kursus
export async function DELETE(request, { params }) {
  const admin = await cekAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM courses
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kursus tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kursus berhasil dihapus!",
    });
  } catch (error) {
    console.error("DELETE courses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Kursus tidak dapat dihapus karena masih memiliki data terkait.",
      },
      { status: 500 }
    );
  }
}