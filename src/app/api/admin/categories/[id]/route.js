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

// PUT: mengedit kategori
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
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama kategori wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE categories
       SET name = $1,
           description = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [name.trim(), description || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diperbarui!",
      data: result.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengedit kategori." },
      { status: 500 }
    );
  }
}

// DELETE: menghapus kategori
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
      `DELETE FROM categories
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Kategori tidak dapat dihapus karena masih digunakan oleh kursus.",
      },
      { status: 500 }
    );
  }
}