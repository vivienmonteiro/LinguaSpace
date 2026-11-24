import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT
          courses.id,
          courses.name,
          courses.description,
          courses.category_id,
          categories.name AS category_name,
          courses.teacher_id,
          courses.level,
          courses.start_date,
          courses.end_date,
          courses.cover_image,
          courses.created_at
       FROM courses
       LEFT JOIN categories
       ON courses.category_id = categories.id
       ORDER BY courses.created_at DESC`
    );

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}