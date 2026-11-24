
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session.user) {
      return Response.json(
        {
          success: false,
          message: "Anda belum login.",
        },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      data: session.user,
    });
  } catch (error) {
    console.error("Session check error:", error);

    return Response.json(
      {
        success: false,
        message: "Gagal memeriksa session.",
      },
      { status: 500 }
    );
  }
}
