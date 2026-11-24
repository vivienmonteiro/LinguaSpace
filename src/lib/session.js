
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions = {
  cookieName: "linguaspace_session",

  password: process.env.SESSION_SECRET,

  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();

  return getIronSession(cookieStore, sessionOptions);
}
