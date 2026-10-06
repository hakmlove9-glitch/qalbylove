import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentMember();
  if (!session) redirect("/login");
  if (session.member.is_admin !== true) redirect("/dashboard");
  return <AdminShell>{children}</AdminShell>;
}
