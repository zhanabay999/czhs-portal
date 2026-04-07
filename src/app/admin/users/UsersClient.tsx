"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { approveUser, rejectUser } from "@/actions/user.actions";
import { CheckCircle2, XCircle, Loader2, UserPlus, KeyRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const roleColors: Record<string, string> = {
  super_admin: "bg-red-100 text-red-800",
  admin: "bg-purple-100 text-purple-800",
  content_manager: "bg-blue-100 text-blue-800",
  hr_manager: "bg-amber-100 text-amber-800",
  contest_manager: "bg-pink-100 text-pink-800",
  sports_manager: "bg-green-100 text-green-800",
  moderator: "bg-cyan-100 text-cyan-800",
  news_moderator: "bg-indigo-100 text-indigo-800",
  social_admin: "bg-emerald-100 text-emerald-800",
  employee: "bg-gray-100 text-gray-800",
};

const roleLabels: Record<string, string> = {
  super_admin: "Супер Админ",
  admin: "Администратор",
  content_manager: "Контент-менеджер",
  hr_manager: "HR менеджер",
  contest_manager: "Менеджер конкурсов",
  sports_manager: "Менеджер спорта",
  moderator: "Модератор",
  news_moderator: "Модератор новостей",
  social_admin: "Админ Жылы Жүрекпен",
  employee: "Сотрудник",
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
  newsCount?: number;
};

export function UsersClient({ users, pendingUsers, viewerEmployeeId }: { users: User[]; pendingUsers: User[]; viewerEmployeeId?: string }) {
  const { t } = useAdminLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "super_admin";
  const isBoss = viewerEmployeeId === "151192";
  // 001 can reset passwords for 002 and 050 only
  const canResetFor = (target: User) => {
    if (isBoss) return true; // 151192 can reset anyone
    return ["002", "050"].includes(target.employeeId ?? "");
  };
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

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

  const handleResetPassword = async () => {
    if (!resetTarget || !newPassword.trim()) return;
    if (newPassword.length < 4) { toast.error("Минимум 4 символа"); return; }
    setResetting(true);
    try {
      const res = await fetch(`/api/admin/users/${resetTarget.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      if (res.ok) {
        toast.success(`Пароль ${resetTarget.lastName} ${resetTarget.firstName} сброшен`);
        setResetTarget(null);
        setNewPassword("");
      } else {
        toast.error("Ошибка сброса пароля");
      }
    } catch {
      toast.error("Ошибка сброса пароля");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      {/* Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Сброс пароля</h2>
              <button onClick={() => { setResetTarget(null); setNewPassword(""); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Пользователь: <span className="font-medium text-foreground">{resetTarget.lastName} {resetTarget.firstName} (#{resetTarget.employeeId})</span>
            </p>
            <div className="mb-4">
              <Label>Новый пароль</Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleResetPassword} disabled={resetting || !newPassword.trim()} className="bg-ktz-blue flex-1">
                {resetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => { setResetTarget(null); setNewPassword(""); }}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}

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

      {/* Управление персоналом — только для 001 (не босс) */}
      {isSuperAdmin && !isBoss && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-ktz-blue flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Управление персоналом
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {users.filter(u => ["002", "050"].includes(u.employeeId ?? "")).map(u => (
              <Card key={u.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{u.lastName} {u.firstName}</p>
                    <p className="text-xs text-muted-foreground">#{u.employeeId} · <Badge className={`${roleColors[u.role]} text-[10px] py-0`}>{roleLabels[u.role] || u.role}</Badge></p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="text-muted-foreground">Новостей: <span className="font-medium text-foreground">{u.newsCount ?? 0}</span></span>
                      <span className="text-muted-foreground">Вход: <span className="font-medium text-foreground">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("ru-RU") : "—"}</span></span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={() => { setResetTarget(u); setNewPassword(""); }}>
                    <KeyRound className="mr-1 h-3 w-3" />
                    Сброс пароля
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Existing Users */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ktz-blue">{t("users.title")}</h1>
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
              <TableHead>Новостей</TableHead>
              <TableHead>{t("users.lastLogin")}</TableHead>
              {isSuperAdmin && <TableHead />}
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
                    {roleLabels[user.role] || user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{user.department || "—"}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? t("users.active") : t("users.inactive")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.newsCount ?? 0}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("ru-RU") : "—"}
                </TableCell>
                {isSuperAdmin && (
                  <TableCell className="text-right">
                    {canResetFor(user) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-muted-foreground hover:text-ktz-blue"
                        onClick={() => { setResetTarget(user); setNewPassword(""); }}
                      >
                        <KeyRound className="mr-1 h-3 w-3" />
                        Сброс пароля
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
