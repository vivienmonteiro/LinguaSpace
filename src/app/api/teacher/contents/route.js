
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const session = await getSession();

  if (!session.user || session.user.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("course_id");

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Course ID wajib diisi." },
        { status: 400 }
      );
    }

    const courseResult = await pool.query(
      `SELECT id, name
       FROM courses
       WHERE id = $1 AND teacher_id = $2`,
      [courseId, session.user.id]
    );

    if (courseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kursus tidak ditemukan." },
        { status: 404 }
      );
    }

    const contentsResult = await pool.query(
      `SELECT
          id,
          course_id,
          title,
          content AS description,
          order_index,
          created_at,
          updated_at
       FROM contents
       WHERE course_id = $1
       ORDER BY order_index ASC`,
      [courseId]
    );

    return NextResponse.json({
      success: true,
      data: {
        course: courseResult.rows[0],
        contents: contentsResult.rows,
      },
    });
  } catch (error) {
    console.error("Teacher contents GET error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil materi." },
      { status: 500 }
    );
  }
}

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

    const { course_id, title, description, order_index } = body;

    if (!course_id || !title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Course dan judul wajib diisi." },
        { status: 400 }
      );
    }

    const courseResult = await pool.query(
      `SELECT id
       FROM courses
       WHERE id = $1 AND teacher_id = $2`,
      [course_id, session.user.id]
    );

    if (courseResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kursus bukan milik kamu." },
        { status: 403 }
      );
    }

    const result = await pool.query(
      `INSERT INTO contents
       (course_id, title, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING
          id,
          course_id,
          title,
          content AS description,
          order_index,
          created_at,
          updated_at`,
      [
        course_id,
        title.trim(),
        description || "",
        Number(order_index) || 1,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Materi berhasil ditambahkan!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Teacher contents POST error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menambahkan materi." },
      { status: 500 }
    );
  }
}
