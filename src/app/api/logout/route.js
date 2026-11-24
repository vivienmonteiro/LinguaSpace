
import { getSession } from "@/lib/session";

export async function POST() {
  try {
    const session = await getSession();

    session.destroy();

    return Response.json({
      success: true,
      message: "Logout berhasil.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return Response.json(
      {
        success: false,
        message: "Logout gagal.",
      },
      { status: 500 }
    );
  }
}
