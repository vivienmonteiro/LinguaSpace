
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
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

    const body = await request.json();
    const contentId = Number(body.content_id);
    const studentId = session.user.id;

    if (!contentId || !Number.isInteger(contentId) || contentId < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "ID materi tidak valid.",
        },
        { status: 400 }
      );
    }

    // 1. Memastikan materi tersedia
    const contentResult = await pool.query(
      `SELECT id, course_id, title
       FROM contents
       WHERE id = $1`,
      [contentId]
    );

    if (contentResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Materi tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const content = contentResult.rows[0];

    // 2. Mengambil enrollment Student
    const enrollmentResult = await pool.query(
      `SELECT id, completed_at
       FROM enrollments
       WHERE student_id = $1
         AND course_id = $2`,
      [studentId, content.course_id]
    );

    if (enrollmentResult.rows.length === 0) {
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

    // 3. Memeriksa materi yang sudah selesai
    const existingProgress = await pool.query(
      `SELECT id, enrollment_id, content_id, completed_at
       FROM content_progress
       WHERE enrollment_id = $1
         AND content_id = $2`,
      [enrollmentId, contentId]
    );

    let progressData;
    let alreadyCompleted = false;

    if (existingProgress.rows.length > 0) {
      progressData = existingProgress.rows[0];
      alreadyCompleted = true;
    } else {
      // 4. Menyimpan progress materi
      const progressResult = await pool.query(
        `INSERT INTO content_progress (enrollment_id, content_id)
         VALUES ($1, $2)
         RETURNING id, enrollment_id, content_id, completed_at`,
        [enrollmentId, contentId]
      );

      progressData = progressResult.rows[0];
    }

    // 5. Menghitung total materi kursus
    const totalResult = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM contents
       WHERE course_id = $1`,
      [content.course_id]
    );

    const totalContents = totalResult.rows[0].total;

    // 6. Menghitung materi yang sudah diselesaikan
    const completedResult = await pool.query(
      `SELECT COUNT(DISTINCT cp.content_id)::int AS completed
       FROM content_progress cp
       JOIN contents c ON c.id = cp.content_id
       WHERE cp.enrollment_id = $1
         AND c.course_id = $2`,
      [enrollmentId, content.course_id]
    );

    const completedContents = completedResult.rows[0].completed;

    const courseCompleted =
      totalContents > 0 &&
      completedContents >= totalContents;

    // 7. Jika semua materi selesai, update enrollment
    let completedAt = enrollment.completed_at;

    if (courseCompleted) {
      const updateResult = await pool.query(
        `UPDATE enrollments
         SET completed_at = COALESCE(completed_at, NOW())
         WHERE id = $1
         RETURNING completed_at`,
        [enrollmentId]
      );

      completedAt = updateResult.rows[0].completed_at;
    }

    // 8. Mengirim hasil
    return NextResponse.json(
      {
        success: true,
        message: alreadyCompleted
          ? "Materi ini sudah selesai sebelumnya."
          : courseCompleted
            ? "Selamat! Semua materi kursus telah selesai!"
            : "Materi berhasil ditandai selesai!",
        already_completed: alreadyCompleted,
        course_completed: courseCompleted,
        progress: progressData,
        course_progress: {
          total_contents: totalContents,
          completed_contents: completedContents,
          percentage:
            totalContents > 0
              ? Math.round(
                  (completedContents / totalContents) * 100
                )
              : 0,
        },
        completed_at: completedAt,
      },
      { status: alreadyCompleted ? 200 : 201 }
    );

  } catch (error) {
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
  }
}
