"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Train, Loader2, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        employeeId,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        const session = await getSession();
        const role = session?.user?.role;
        if (role && role !== "employee") {
          router.push("/admin");
        } else {
          router.push(`/${locale}`);
        }
        router.refresh();
      }
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#003DA5]">
            <Train className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-[#003DA5]">{t("loginTitle")}</CardTitle>
          <p className="text-sm text-muted-foreground">{tc("appFullName")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="employeeId">{t("employeeId")}</Label>
              <Input
                id="employeeId"
                type="text"
                inputMode="numeric"
                pattern="\d{1,7}"
                maxLength={7}
                value={employeeId}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 7);
                  setEmployeeId(val);
                }}
                placeholder="0000001"
                required
                className="text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                {locale === "kk"
                  ? "7 цифрға дейін табельдік нөміріңізді енгізіңіз"
                  : "Введите ваш табельный номер (до 7 цифр)"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#003DA5] hover:bg-[#0052D4]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {tc("login")}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
