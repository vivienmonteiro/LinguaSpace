import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import CertificatesClient from "@/components/CertificatesClient";

export default async function CertificatesPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  if (session.user.role !== "student") {
    redirect("/dashboard");
  }

  return <CertificatesClient user={session.user} />;
}