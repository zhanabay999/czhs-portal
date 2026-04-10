import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ProfileClient } from "./ProfileClient";

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/kk/login");

  const [user] = await db
    .select({
      id: users.id,
      employeeId: users.employeeId,
      lastName: users.lastName,
      firstName: users.firstName,
      patronymic: users.patronymic,
      phone: users.phone,
      email: users.email,
      department: users.department,
      position: users.position,
      avatarUrl: users.avatarUrl,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!user) redirect("/kk/login");

  return <ProfileClient user={JSON.parse(JSON.stringify(user))} />;
}
