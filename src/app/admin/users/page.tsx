import { db } from "@/db";
import { users, newsArticles } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");

  const viewerEmployeeId = session.user.employeeId as string;
  // 151192 is the top boss — sees everyone; others see everyone except 151192
  const isBoss = viewerEmployeeId === "151192";

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
    newsCount: number;
  }> = [];

  let pendingList: Array<{
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
    newsCount: number;
  }> = [];

  try {
    const raw = await db.select().from(users).orderBy(desc(users.createdAt));

    // News count per author
    const newsCounts = await db
      .select({ authorId: newsArticles.authorId, count: sql<number>`count(*)::int` })
      .from(newsArticles)
      .groupBy(newsArticles.authorId);
    const newsCountMap = Object.fromEntries(newsCounts.map(r => [r.authorId, r.count]));

    const mapped = raw
      .filter(u => isBoss || u.employeeId !== "151192") // hide boss from non-boss
      .map(u => ({
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
        newsCount: newsCountMap[u.id] || 0,
      }));

    userList = mapped.filter(u => u.isApproved);
    pendingList = mapped.filter(u => !u.isApproved);
  } catch {}

  return (
    <UsersClient
      users={JSON.parse(JSON.stringify(userList))}
      pendingUsers={JSON.parse(JSON.stringify(pendingList))}
      viewerEmployeeId={viewerEmployeeId}
    />
  );
}
