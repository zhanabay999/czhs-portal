import { db } from "@/db";
import { users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");

  let userList: Array<{
    id: string;
    email: string;
    employeeId: string | null;
    firstName: string;
    lastName: string;
    patronymic: string | null;
    role: string;
    department: string | null;
    isActive: boolean;
    isApproved: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
  }> = [];

  let pendingList: typeof userList = [];

  try {
    const raw = await db.select().from(users).orderBy(desc(users.createdAt));
    const mapped = raw.map(u => ({
      id: u.id,
      email: u.email,
      employeeId: u.employeeId,
      firstName: u.firstName,
      lastName: u.lastName,
      patronymic: u.patronymic,
      role: u.role,
      department: u.department,
      isActive: u.isActive,
      isApproved: u.isApproved,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
    }));

    userList = mapped.filter(u => u.isApproved);
    pendingList = mapped.filter(u => !u.isApproved);
  } catch {}

  return (
    <UsersClient
      users={JSON.parse(JSON.stringify(userList))}
      pendingUsers={JSON.parse(JSON.stringify(pendingList))}
    />
  );
}
