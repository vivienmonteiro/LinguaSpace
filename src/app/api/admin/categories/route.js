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

// GET: mengambil semua kategori
export async function GET() {
  const admin = await cekAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const result = await pool.query(`
      SELECT *
      FROM categories
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil kategori." },
      { status: 500 }
    );
  }
}

// POST: menambahkan kategori
export async function POST(request) {
  const admin = await cekAdmin();

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Akses ditolak." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Nama kategori wajib diisi." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name.trim(), description || null]
    );

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil ditambahkan!",
      data: result.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan kategori." },
      { status: 500 }
    );
  }
}