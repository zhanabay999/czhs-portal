"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { approveUser, rejectUser } from "@/actions/user.actions";
import { CheckCircle2, XCircle, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

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

type User = {
  id: string;
  email: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  patronymic?: string | null;
  role: string;
  department: string | null;
  isActive: boolean;
  isApproved?: boolean;
  lastLoginAt: string | null;
  createdAt?: string;
};

export function UsersClient({ users, pendingUsers }: { users: User[]; pendingUsers: User[] }) {
  const { t } = useAdminLocale();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setLoadingId(userId);
    try {
      await approveUser(userId);
      router.refresh();
    } catch {
      // error
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setLoadingId(userId);
    try {
      await rejectUser(userId);
      router.refresh();
    } catch {
      // error
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      {/* Pending Registration Requests */}
      {pendingUsers.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <UserPlus className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-bold text-orange-600">{t("users.pending")}</h2>
            <Badge className="bg-orange-100 text-orange-800">
              {pendingUsers.length} {t("users.pendingCount")}
            </Badge>
          </div>

          <Card className="border-orange-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("users.name")}</TableHead>
                  <TableHead>{t("users.employeeId")}</TableHead>
                  <TableHead>{t("users.patronymic")}</TableHead>
                  <TableHead>{t("users.registeredAt")}</TableHead>
                  <TableHead className="text-right">{/* actions */}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id} className="bg-orange-50/50">
                    <TableCell className="font-medium">
                      {user.lastName} {user.firstName}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">#{user.employeeId}</span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.patronymic || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                          disabled={loadingId === user.id}
                          onClick={() => handleApprove(user.id)}
                        >
                          {loadingId === user.id ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                          )}
                          {t("users.approve")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          disabled={loadingId === user.id}
                          onClick={() => handleReject(user.id)}
                        >
                          {loadingId === user.id ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="mr-1 h-4 w-4" />
                          )}
                          {t("users.reject")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Existing Users */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("users.title")}</h1>
        <p className="text-sm text-muted-foreground">{users.length} {t("users.count")}</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("users.name")}</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>{t("users.role")}</TableHead>
              <TableHead>{t("users.department")}</TableHead>
              <TableHead>{t("users.status")}</TableHead>
              <TableHead>{t("users.lastLogin")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
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
                    {user.isActive ? t("users.active") : t("users.inactive")}
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
