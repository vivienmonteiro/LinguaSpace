import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import TeacherContents from "@/components/TeacherContents";

export default async function TeacherContentsPage({ params }) {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role !== "teacher") {
    redirect("/dashboard");
  }

  const { id } = await params;

  return <TeacherContents courseId={id} />;
}