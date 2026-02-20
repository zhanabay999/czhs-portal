import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Shield } from "lucide-react";

const roleColors: Record<string, string> = {
  super_admin: "bg-red-100 text-red-800",
  admin: "bg-purple-100 text-purple-800",
  content_manager: "bg-blue-100 text-blue-800",
  hr_manager: "bg-amber-100 text-amber-800",
  contest_manager: "bg-pink-100 text-pink-800",
  sports_manager: "bg-green-100 text-green-800",
  moderator: "bg-cyan-100 text-cyan-800",
  employee: "bg-gray-100 text-gray-800",
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");

  let userList: Array<typeof users.$inferSelect> = [];
  try {
    userList = await db.select().from(users).orderBy(desc(users.createdAt));
  } catch {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">Пайдаланушылар</h1>
        <p className="text-sm text-muted-foreground">{userList.length} пайдаланушы</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Аты-жөні</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Рөлі</TableHead>
              <TableHead>Бөлімше</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Кірген уақыт</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.lastName} {user.firstName}
                  {user.employeeId && (
                    <span className="ml-2 text-xs text-muted-foreground">#{user.employeeId}</span>
                  )}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role] || "bg-gray-100"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{user.department || "—"}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Белсенді" : "Өшірілген"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("ru-RU") : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
