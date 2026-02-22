import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canAccessAdmin } from "@/lib/permissions";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AdminLocaleProvider } from "@/components/providers/AdminLocaleProvider";
import type { UserRole } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/kk/login");
  }

  if (!canAccessAdmin(session.user.role as UserRole)) {
    redirect("/kk");
  }

  return (
    <SessionProvider>
      <AdminLocaleProvider>
        <div className="flex min-h-screen">
          <AdminSidebar userRole={session.user.role as UserRole} userName={session.user.name || ""} />
          <main className="flex-1 bg-gray-50 p-6 lg:p-8">{children}</main>
        </div>
      </AdminLocaleProvider>
    </SessionProvider>
  );
}
