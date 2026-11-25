
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  const session = await getSession();

  if (!session.user || session.user.role !== "student") {
    return NextResponse.json(
      {
        success: false,
        message: "Hanya Student yang dapat mengakses progress materi.",
      },
      { status: 403 }
    );
  }

  const client = await pool.connect();

  try {
    const body = await request.json();
    const contentId = Number(body.content_id);
    const studentId = session.user.id;

    if (
      !Number.isInteger(contentId) ||
      contentId < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "ID materi tidak valid.",
        },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // 1. Memastikan materi tersedia
    const contentResult = await client.query(
      `SELECT id, course_id, title
       FROM contents
       WHERE id = $1`,
      [contentId]
    );

    if (contentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          message: "Materi tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const content = contentResult.rows[0];

    // 2. Mengambil dan mengunci enrollment Student
    const enrollmentResult = await client.query(
      `SELECT id, completed_at
       FROM enrollments
       WHERE student_id = $1
         AND course_id = $2
       FOR UPDATE`,
      [studentId, content.course_id]
    );

    if (enrollmentResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        {
          success: false,
          message: "Kamu belum terdaftar di kursus ini.",
        },
        { status: 403 }
      );
    }

    const enrollment = enrollmentResult.rows[0];
    const enrollmentId = enrollment.id;

    // 3. Menyimpan progress jika belum pernah selesai
    const progressResult = await client.query(
      `INSERT INTO content_progress (enrollment_id, content_id)
       VALUES ($1, $2)
       ON CONFLICT (enrollment_id, content_id)
       DO NOTHING
       RETURNING id, enrollment_id, content_id, completed_at`,
      [enrollmentId, contentId]
    );

    const alreadyCompleted = progressResult.rows.length === 0;

    // 4. Mengambil data progress
    let progressData;

    if (alreadyCompleted) {
      const existingResult = await client.query(
        `SELECT id, enrollment_id, content_id, completed_at
         FROM content_progress
         WHERE enrollment_id = $1
           AND content_id = $2`,
        [enrollmentId, contentId]
      );

      progressData = existingResult.rows[0];
    } else {
      progressData = progressResult.rows[0];
    }

    // 5. Menghitung total materi
    const totalResult = await client.query(
      `SELECT COUNT(*)::int AS total
       FROM contents
       WHERE course_id = $1`,
      [content.course_id]
    );

    const totalContents = totalResult.rows[0].total;

    // 6. Menghitung materi selesai
    const completedResult = await client.query(
      `SELECT COUNT(DISTINCT cp.content_id)::int AS completed
       FROM content_progress cp
       JOIN contents c ON c.id = cp.content_id
       WHERE cp.enrollment_id = $1
         AND c.course_id = $2`,
      [enrollmentId, content.course_id]
    );

    const completedContents = completedResult.rows[0].completed;

    const percentage =
      totalContents > 0
        ? Math.round((completedContents / totalContents) * 100)
        : 0;

    const courseCompleted =
      totalContents > 0 &&
      completedContents >= totalContents;

    // 7. Mengupdate status kursus
    let completedAt = enrollment.completed_at;

    if (courseCompleted) {
      const updateResult = await client.query(
        `UPDATE enrollments
         SET completed_at = COALESCE(completed_at, NOW())
         WHERE id = $1
         RETURNING completed_at`,
        [enrollmentId]
      );

      completedAt = updateResult.rows[0].completed_at;
    }

    await client.query("COMMIT");

    // 8. Mengirim hasil
    return NextResponse.json(
      {
        success: true,
        message: courseCompleted
          ? "Selamat! Semua materi kursus telah selesai. Certificate kamu sudah tersedia!"
          : alreadyCompleted
            ? "Materi ini sudah selesai sebelumnya."
            : "Materi berhasil ditandai selesai!",
        already_completed: alreadyCompleted,
        course_completed: courseCompleted,
        progress: progressData,
        course_progress: {
          total_contents: totalContents,
          completed_contents: completedContents,
          percentage,
        },
        completed_at: completedAt,
      },
      { status: 200 }
    );

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Progress error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan progress materi.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );

  } finally {
    client.release();
  }
}
