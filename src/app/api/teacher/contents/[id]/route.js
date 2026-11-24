
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PUT(request, { params }) {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const { title, description, order_index } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Judul materi wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE contents
       SET title = $1,
           content = $2,
           order_index = $3,
           updated_at = NOW()
       WHERE id = $4
         AND course_id IN (
           SELECT id
           FROM courses
           WHERE teacher_id = $5
         )
       RETURNING
         id,
         course_id,
         title,
         content AS description,
         order_index,
         created_at,
         updated_at`,
      [
        title.trim(),
        description || "",
        Number(order_index) || 1,
        id,
        session.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Materi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Materi berhasil diperbarui!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Teacher contents PUT error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengedit materi." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { id } = await params;

    const result = await pool.query(
      `DELETE FROM contents
       WHERE id = $1
         AND course_id IN (
           SELECT id
           FROM courses
           WHERE teacher_id = $2
         )
       RETURNING id`,
      [id, session.user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Materi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Materi berhasil dihapus!",
    });
  } catch (error) {
    console.error("Teacher contents DELETE error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menghapus materi." },
      { status: 500 }
    );
  }
}
