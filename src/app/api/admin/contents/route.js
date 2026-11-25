
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

// GET: mengambil seluruh materi dan daftar kursus
export async function GET() {
  try {
    const akses = await cekAdmin();

    if (!akses.admin) {
      return NextResponse.json(
        { success: false, message: akses.error },
        { status: akses.status }
      );
    }

    const [contentsResult, coursesResult] = await Promise.all([
      pool.query(`
        SELECT
          contents.id,
          contents.course_id,
          contents.title,
          contents.content,
          contents.order_index,
          contents.created_at,
          contents.updated_at,
          courses.name AS course_name,
          users.username AS teacher_name
        FROM contents
        JOIN courses ON contents.course_id = courses.id
        LEFT JOIN users ON courses.teacher_id = users.id
        ORDER BY courses.name ASC, contents.order_index ASC, contents.id ASC
      `),

      pool.query(`
        SELECT
          courses.id,
          courses.name,
          courses.level,
          users.username AS teacher_name
        FROM courses
        LEFT JOIN users ON courses.teacher_id = users.id
        ORDER BY courses.name ASC
      `),
    ]);

    return NextResponse.json({
      success: true,
      data: contentsResult.rows,
      courses: coursesResult.rows,
    });
  } catch (error) {
    console.error("GET admin contents error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil data materi." },
      { status: 500 }
    );
  }
}

// POST: menambahkan materi baru
export async function POST(request) {
  try {
    const akses = await cekAdmin();

    if (!akses.admin) {
      return NextResponse.json(
        { success: false, message: akses.error },
        { status: akses.status }
      );
    }

    const body = await request.json();

    const courseId = Number(body.course_id);
    const title = body.title?.trim();
    const content = body.content?.trim();
    const orderIndex =
      body.order_index === undefined || body.order_index === ""
        ? 1
        : Number(body.order_index);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      return NextResponse.json(
        { success: false, message: "Silakan pilih kursus yang valid." },
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
      `INSERT INTO contents (course_id, title, content, order_index)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [courseId, title, content, orderIndex]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Materi berhasil ditambahkan.",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST admin contents error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal menambahkan materi." },
      { status: 500 }
    );
  }
}
