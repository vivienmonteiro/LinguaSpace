
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import StudentDashboard from "@/components/StudentDashboard";

export default async function StudentDashboardPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role !== "student") {
    redirect("/dashboard");
  }

  return <StudentDashboard user={session.user} />;
}
