import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import TeacherDashboard from "@/components/TeacherDashboard";

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role !== "teacher") {
    redirect("/dashboard");
  }

  return <TeacherDashboard user={session.user} />;
}