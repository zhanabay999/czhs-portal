"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, User, Lock, Loader2 } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { toast } from "sonner";

type UserProfile = {
  id: string;
  employeeId: string;
  lastName: string;
  firstName: string;
  patronymic: string | null;
  phone: string | null;
  email: string | null;
  department: string | null;
  position: string | null;
  avatarUrl: string | null;
  role: string;
};

export function ProfileClient({ user }: { user: UserProfile }) {
  const { t, locale } = useAdminLocale();
  const { update } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    lastName: user.lastName,
    firstName: user.firstName,
    patronymic: user.patronymic || "",
    phone: user.phone || "",
    email: user.email || "",
    department: user.department || "",
    position: user.position || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const roleLabels: Record<string, string> = {
    super_admin: locale === "kk" ? "Супер Админ" : "Супер Админ",
    admin: locale === "kk" ? "Әкімші" : "Администратор",
    content_manager: locale === "kk" ? "Контент менеджер" : "Контент-менеджер",
    social_admin: locale === "kk" ? "Әлеуметтік әкімші" : "Админ Жылы Жүрекпен",
    employee: locale === "kk" ? "Қызметкер" : "Сотрудник",
  };

  async function handleSaveProfile() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          toast.success(locale === "kk" ? "Профиль сақталды" : "Профиль сохранён");
          await update({ firstName: form.firstName, lastName: form.lastName, name: `${form.firstName} ${form.lastName}` });
          router.refresh();
        } else {
          toast.error(locale === "kk" ? "Қате" : "Ошибка");
        }
      } catch {
        toast.error(locale === "kk" ? "Қате" : "Ошибка");
      }
    });
  }

  async function handleChangePassword() {
    if (passwords.newPassword !== passwords.confirm) {
      toast.error(locale === "kk" ? "Құпия сөздер сәйкес келмейді" : "Пароли не совпадают");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error(locale === "kk" ? "Кемінде 6 символ" : "Минимум 6 символов");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/profile/password", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwords.current,
            newPassword: passwords.newPassword,
          }),
        });
        if (res.ok) {
          toast.success(locale === "kk" ? "Құпия сөз өзгертілді" : "Пароль изменён");
          setPasswords({ current: "", newPassword: "", confirm: "" });
        } else {
          const data = await res.json();
          toast.error(data.error || (locale === "kk" ? "Қате" : "Ошибка"));
        }
      } catch {
        toast.error(locale === "kk" ? "Қате" : "Ошибка");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-ktz-blue">
        {locale === "kk" ? "Профиль" : "Профиль"}
      </h1>

      {/* Info */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-ktz-blue" />
            {locale === "kk" ? "Жеке деректер" : "Личные данные"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3">
            <div>
              <p className="text-xs text-muted-foreground">{locale === "kk" ? "Табельдік нөмір" : "Табельный номер"}</p>
              <p className="font-mono font-bold text-ktz-blue">{user.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{locale === "kk" ? "Рөл" : "Роль"}</p>
              <p className="font-medium">{roleLabels[user.role] || user.role}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{locale === "kk" ? "Тегі" : "Фамилия"}</Label>
              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <Label>{locale === "kk" ? "Аты" : "Имя"}</Label>
              <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <Label>{locale === "kk" ? "Әкесінің аты" : "Отчество"}</Label>
              <Input value={form.patronymic} onChange={(e) => setForm({ ...form, patronymic: e.target.value })} />
            </div>
            <div>
              <Label>{locale === "kk" ? "Телефон" : "Телефон"}</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7..." />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
            </div>
            <div>
              <Label>{locale === "kk" ? "Лауазымы" : "Должность"}</Label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={isPending} className="bg-ktz-blue">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {locale === "kk" ? "Сақтау" : "Сохранить"}
          </Button>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-ktz-blue" />
            {locale === "kk" ? "Құпия сөзді өзгерту" : "Изменить пароль"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{locale === "kk" ? "Ағымдағы құпия сөз" : "Текущий пароль"}</Label>
            <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
          </div>
          <div>
            <Label>{locale === "kk" ? "Жаңа құпия сөз" : "Новый пароль"}</Label>
            <Input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
          </div>
          <div>
            <Label>{locale === "kk" ? "Қайта енгізіңіз" : "Подтвердите пароль"}</Label>
            <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          </div>
          <Button
            onClick={handleChangePassword}
            disabled={isPending || !passwords.current || !passwords.newPassword || !passwords.confirm}
            variant="outline"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
            {locale === "kk" ? "Өзгерту" : "Изменить"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
