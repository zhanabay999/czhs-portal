import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Building2, Briefcase, Shield, Calendar } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);
  const isKk = locale === "kk";

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) redirect(`/${locale}/login`);

  const fields = [
    { icon: Mail, label: isKk ? "Email" : "Email", value: user.email },
    { icon: Shield, label: isKk ? "Табельдік нөмір" : "Табельный номер", value: user.employeeId || "—" },
    { icon: Building2, label: isKk ? "Бөлімше" : "Подразделение", value: user.department || "—" },
    { icon: Briefcase, label: isKk ? "Лауазым" : "Должность", value: user.position || "—" },
    { icon: Phone, label: isKk ? "Телефон" : "Телефон", value: user.phone || "—" },
    { icon: Calendar, label: isKk ? "Тіркелген" : "Зарегистрирован", value: new Date(user.createdAt).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU") },
  ];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#003DA5]">
        {isKk ? "Профиль" : "Профиль"}
      </h1>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#003DA5]">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {user.lastName} {user.firstName} {user.patronymic || ""}
              </CardTitle>
              <Badge className="mt-1" variant="outline">{user.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.label} className="flex items-center gap-3 border-b pb-3 last:border-0">
                <field.icon className="h-5 w-5 shrink-0 text-[#003DA5]" />
                <div>
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="font-medium">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
