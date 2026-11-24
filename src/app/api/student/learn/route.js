
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request) {
  try {
    const session = await getSession();

    if (!session.user || session.user.role !== "student") {
      return NextResponse.json(
        {
          success: false,
          message: "Hanya Student yang dapat mengakses materi.",
        },
        { status: 403 }
      );
    }

    const studentId = session.user.id;

    const { searchParams } = new URL(request.url);
    const courseId = Number(searchParams.get("course_id"));

    if (!courseId || !Number.isInteger(courseId) || courseId < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "ID kursus tidak valid.",
        },
        { status: 400 }
      );
    }

    // Memastikan kursus tersedia
    const courseResult = await pool.query(
      `SELECT id, name, description, level
       FROM courses
       WHERE id = $1`,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Kursus tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // Mengambil enrollment Student pada kursus
    const enrollmentResult = await pool.query(
      `SELECT id
       FROM enrollments
       WHERE student_id = $1
         AND course_id = $2`,
      [studentId, courseId]
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

    const enrollmentId = enrollmentResult.rows[0].id;

    // Mengambil materi dan progress sesuai enrollment
    const contentsResult = await pool.query(
      `SELECT
          c.id,
          c.title,
          c.content,
          c.order_index,
          CASE
            WHEN cp.id IS NOT NULL THEN TRUE
            ELSE FALSE
          END AS is_completed,
          cp.completed_at
       FROM contents c
       LEFT JOIN content_progress cp
          ON cp.content_id = c.id
          AND cp.enrollment_id = $1
       WHERE c.course_id = $2
       ORDER BY c.order_index ASC, c.id ASC`,
      [enrollmentId, courseId]
    );

    const totalContents = contentsResult.rows.length;

    const completedContents = contentsResult.rows.filter(
      (content) => content.is_completed
    ).length;

    const progressPercentage =
      totalContents > 0
        ? Math.round((completedContents / totalContents) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      course: courseResult.rows[0],
      contents: contentsResult.rows,
      progress: {
        total_contents: totalContents,
        completed_contents: completedContents,
        percentage: progressPercentage,
      },
    });

  } catch (error) {
    console.error("Learn API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil materi kursus.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
