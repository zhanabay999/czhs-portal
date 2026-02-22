"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Train, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { registerUser } from "@/actions/auth.actions";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await registerUser({
        lastName,
        firstName,
        patronymic: patronymic || undefined,
        employeeId,
        password,
      });

      if (result.error) {
        setError(t(result.error));
      } else {
        setSuccess(true);
      }
    } catch {
      setError(t("required"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              {t("registerTitle")}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {t("registerSuccess")}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-[#003DA5] px-6 py-2 text-sm font-medium text-white hover:bg-[#0052D4]"
            >
              {t("loginLink")}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#003DA5]">
            <Train className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-[#003DA5]">
            {t("registerTitle")}
          </CardTitle>
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
              <Label htmlFor="lastName">{t("lastName")} *</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">{t("firstName")} *</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patronymic">{t("patronymic")}</Label>
              <Input
                id="patronymic"
                type="text"
                value={patronymic}
                onChange={(e) => setPatronymic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">{t("employeeId")} *</Label>
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
              <Label htmlFor="password">{t("password")} *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
              />
            </div>

            <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="consent"
                className="text-sm font-normal leading-snug cursor-pointer"
              >
                {t("consent")}
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#003DA5] hover:bg-[#0052D4]"
              disabled={loading || !consent}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("registerButton")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link
                href="/login"
                className="font-medium text-[#003DA5] hover:underline"
              >
                {t("loginLink")}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
