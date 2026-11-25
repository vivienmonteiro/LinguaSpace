
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

async function cekAdmin() {
  const session = await getSession();

  if (!session.user) {
    return { error: "Silakan login terlebih dahulu.", status: 401 };
  }

  if (session.user.role !== "admin") {
    return { error: "Akses hanya untuk Admin.", status: 403 };
  }

  return { admin: true };
}

// PUT: mengedit materi
export async function PUT(request, { params }) {
  try {
    const akses = await cekAdmin();

    if (!akses.admin) {
      return NextResponse.json(
        { success: false, message: akses.error },
        { status: akses.status }
      );
    }

    const { id } = await params;
    const contentId = Number(id);

    if (!Number.isInteger(contentId) || contentId <= 0) {
      return NextResponse.json(
        { success: false, message: "ID materi tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const courseId = Number(body.course_id);
    const title = body.title?.trim();
    const content = body.content?.trim();
    const orderIndex = Number(body.order_index);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return NextResponse.json(
        { success: false, message: "Kursus tidak valid." },
        { status: 400 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Judul dan isi materi wajib diisi." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(orderIndex) || orderIndex < 1) {
      return NextResponse.json(
        { success: false, message: "Urutan materi harus berupa angka minimal 1." },
        { status: 400 }
      );
    }

    const courseResult = await pool.query(
      "SELECT id FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kursus tidak ditemukan." },
        { status: 404 }
      );
    }

    const result = await pool.query(
      `UPDATE contents
       SET course_id = $1,
           title = $2,
           content = $3,
           order_index = $4,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [courseId, title, content, orderIndex, contentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Materi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Materi berhasil diperbarui.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("PUT admin contents error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal memperbarui materi." },
      { status: 500 }
    );
  }
}

// DELETE: menghapus materi
export async function DELETE(request, { params }) {
  try {
    const akses = await cekAdmin();

    if (!akses.admin) {
      return NextResponse.json(
        { success: false, message: akses.error },
        { status: akses.status }
      );
    }

    const { id } = await params;
    const contentId = Number(id);

    if (!Number.isInteger(contentId) || contentId <= 0) {
      return NextResponse.json(
        { success: false, message: "ID materi tidak valid." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM contents WHERE id = $1 RETURNING id",
      [contentId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Materi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Materi berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE admin contents error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menghapus materi. Materi mungkin masih memiliki data progres belajar Student.",
      },
      { status: 500 }
    );
  }
}
