
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

async function cekTeacher() {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return null;
  }

  return session.user;
}

// PUT: mengedit Course milik Teacher sendiri
export async function PUT(request, { params }) {
  const teacher = await cekTeacher();

  if (!teacher) {
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
      `UPDATE courses
       SET name = $1,
           description = $2,
           category_id = $3,
           level = $4,
           start_date = $5,
           end_date = $6,
           cover_image = $7,
           updated_at = NOW()
       WHERE id = $8 AND teacher_id = $9
       RETURNING *`,
      [
        name.trim(),
        description || null,
        category_id,
        level || null,
        start_date || null,
        end_date || null,
        cover_image || null,
        id,
        teacher.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Course tidak ditemukan atau bukan milik Anda.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course berhasil diperbarui.",
      course: result.rows[0],
    });
  } catch (error) {
    console.error("PUT Teacher Course:", error);

    return NextResponse.json(
      { success: false, message: "Gagal memperbarui Course." },
      { status: 500 }
    );
  }
}

// DELETE: menghapus Course milik Teacher sendiri
export async function DELETE(request, { params }) {
  const teacher = await cekTeacher();

  if (!teacher) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM courses
       WHERE id = $1 AND teacher_id = $2
       RETURNING id`,
      [id, teacher.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Course tidak ditemukan atau bukan milik Anda.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE Teacher Course:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Course tidak dapat dihapus karena masih memiliki data terkait.",
      },
      { status: 500 }
    );
  }
}
