
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (session.user.role === "teacher") {
    redirect("/teacher/dashboard");
  }

  if (session.user.role === "student") {
    redirect("/student/dashboard");
  }

  redirect("/");
}
