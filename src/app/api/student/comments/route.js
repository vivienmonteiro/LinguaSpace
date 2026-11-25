
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

// GET: Mengambil komentar berdasarkan materi
export async function GET(request) {
  try {
    const session = await getSession();

    if (
      !session.user ||
      !["student", "teacher"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contentId = Number(searchParams.get("content_id"));

    if (!Number.isInteger(contentId) || contentId < 1) {
      return NextResponse.json(
        { success: false, message: "ID materi tidak valid." },
        { status: 400 }
      );
    }

    const access = await pool.query(
      `SELECT c.id
       FROM contents c
       JOIN courses co ON co.id = c.course_id
       LEFT JOIN enrollments e
         ON e.course_id = co.id
         AND e.student_id = $2
       WHERE c.id = $1
         AND (e.id IS NOT NULL OR co.teacher_id = $2)`,
      [contentId, session.user.id]
    );

    if (access.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kamu tidak memiliki akses ke materi ini." },
        { status: 403 }
      );
    }

    const result = await pool.query(
      `SELECT
         cm.id,
         cm.content_id,
         cm.user_id,
         cm.parent_comment_id,
         cm.comment,
         cm.created_at,
         u.username,
         u.role
       FROM comments cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.content_id = $1
       ORDER BY cm.created_at ASC`,
      [contentId]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengambil komentar." },
      { status: 500 }
    );
  }
}

// POST: Mengirim komentar atau balasan
export async function POST(request) {
  try {
    const session = await getSession();

    if (
      !session.user ||
      !["student", "teacher"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const contentId = Number(body.content_id);
    const comment = body.comment?.trim();
    const parentId = body.parent_comment_id
      ? Number(body.parent_comment_id)
      : null;

    if (
      !Number.isInteger(contentId) ||
      contentId < 1 ||
      !comment ||
      comment.length > 5000
    ) {
      return NextResponse.json(
        { success: false, message: "Komentar tidak valid atau terlalu panjang." },
        { status: 400 }
      );
    }

    const access = await pool.query(
      `SELECT c.id
       FROM contents c
       JOIN courses co ON co.id = c.course_id
       LEFT JOIN enrollments e
         ON e.course_id = co.id
         AND e.student_id = $2
       WHERE c.id = $1
         AND (e.id IS NOT NULL OR co.teacher_id = $2)`,
      [contentId, session.user.id]
    );

    if (access.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Kamu tidak memiliki akses ke materi ini." },
        { status: 403 }
      );
    }

    if (parentId !== null) {
      if (!Number.isInteger(parentId) || parentId < 1) {
        return NextResponse.json(
          { success: false, message: "ID komentar induk tidak valid." },
          { status: 400 }
        );
      }

      const parent = await pool.query(
        `SELECT id
         FROM comments
         WHERE id = $1 AND content_id = $2`,
        [parentId, contentId]
      );

      if (parent.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: "Komentar induk tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    const result = await pool.query(
      `INSERT INTO comments
       (content_id, user_id, parent_comment_id, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [contentId, session.user.id, parentId, comment]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Komentar berhasil dikirim.",
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post comment error:", error);

    return NextResponse.json(
      { success: false, message: "Gagal mengirim komentar." },
      { status: 500 }
    );
  }
}
