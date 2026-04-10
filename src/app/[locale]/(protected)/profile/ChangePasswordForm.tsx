"use client";

import { useState } from "react";
import { changePassword } from "@/actions/auth.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

const messages: Record<string, Record<string, string>> = {
  kk: {
    title: "Құпия сөзді өзгерту",
    currentPassword: "Ағымдағы құпия сөз",
    newPassword: "Жаңа құпия сөз",
    confirmPassword: "Жаңа құпия сөзді растаңыз",
    submit: "Өзгерту",
    success: "Құпия сөз сәтті өзгертілді!",
    required: "Барлық өрістерді толтырыңыз",
    passwordTooShort: "Құпия сөз кемінде 4 таңбадан тұруы керек",
    wrongPassword: "Ағымдағы құпия сөз қате",
    mismatch: "Жаңа құпия сөздер сәйкес келмейді",
    userNotFound: "Пайдаланушы табылмады",
  },
  ru: {
    title: "Изменить пароль",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите новый пароль",
    submit: "Изменить",
    success: "Пароль успешно изменён!",
    required: "Заполните все поля",
    passwordTooShort: "Пароль должен быть не менее 4 символов",
    wrongPassword: "Текущий пароль неверный",
    mismatch: "Новые пароли не совпадают",
    userNotFound: "Пользователь не найден",
  },
};

export function ChangePasswordForm({ userId, locale }: { userId: string; locale: string }) {
  const t = messages[locale] || messages.ru;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t.required);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    if (newPassword.length < 4) {
      setError(t.passwordTooShort);
      return;
    }

    setLoading(true);
    const result = await changePassword({ userId, currentPassword, newPassword });
    setLoading(false);

    if (result.error) {
      setError(t[result.error] || result.error);
    } else {
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lock className="h-5 w-5 text-[#003DA5]" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">{t.currentPassword}</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="newPassword">{t.newPassword}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{t.success}</p>}

          <Button type="submit" disabled={loading} className="bg-[#003DA5] hover:bg-[#002d7a]">
            {loading ? "..." : t.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
