import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ExternalLink, MapPin, Calendar, Building2 } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VacanciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  let vacancyList: Array<typeof vacancies.$inferSelect> = [];
  try {
    vacancyList = await db
      .select()
      .from(vacancies)
      .where(eq(vacancies.status, "published"))
      .orderBy(desc(vacancies.createdAt));
  } catch {
    // DB not ready
  }

  return <VacanciesContent locale={locale} isKk={isKk} vacancyList={vacancyList} />;
}

function VacanciesContent({
  locale,
  isKk,
  vacancyList,
}: {
  locale: string;
  isKk: boolean;
  vacancyList: Array<typeof vacancies.$inferSelect>;
}) {
  const t = useTranslations("vacancies");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#003DA5]">{t("title")}</h1>
        <div className="h-1 w-20 rounded bg-[#C8A951]" />
      </div>

      {/* External link banner */}
      <Card className="mb-8 border-[#003DA5] bg-gradient-to-r from-[#003DA5] to-[#0066CC] text-white">
        <CardContent className="flex flex-col items-center gap-4 p-8 sm:flex-row sm:justify-between">
          <div>
            <h2 className="mb-1 text-xl font-bold">{t("externalLink")}</h2>
            <p className="text-blue-100">{t("externalDescription")}</p>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 bg-[#C8A951] text-[#1A1A2E] hover:bg-[#D4B862]"
          >
            <a href="https://job.railways.kz/" target="_blank" rel="noopener noreferrer">
              job.railways.kz
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Internal vacancies */}
      <h2 className="mb-6 text-xl font-bold text-[#003DA5]">{t("internal")}</h2>
      {vacancyList.length > 0 ? (
        <div className="grid gap-4">
          {vacancyList.map((vacancy) => {
            const daysLeft = vacancy.closingDate
              ? Math.ceil(
                  (new Date(vacancy.closingDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                )
              : null;

            return (
              <Card key={vacancy.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold">
                        {isKk ? vacancy.titleKk : vacancy.titleRu}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {vacancy.department && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {vacancy.department}
                          </span>
                        )}
                        {vacancy.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {vacancy.location}
                          </span>
                        )}
                        {vacancy.closingDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(vacancy.closingDate).toLocaleDateString(
                              locale === "kk" ? "kk-KZ" : "ru-RU"
                            )}
                          </span>
                        )}
                      </div>
                      {(isKk ? vacancy.descriptionKk : vacancy.descriptionRu) && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {isKk ? vacancy.descriptionKk : vacancy.descriptionRu}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {vacancy.salaryRange && (
                        <Badge variant="secondary" className="text-sm">
                          {vacancy.salaryRange}
                        </Badge>
                      )}
                      {daysLeft !== null && (
                        <Badge variant={daysLeft > 0 ? "outline" : "destructive"}>
                          {daysLeft > 0
                            ? `${daysLeft} ${t("daysLeft")}`
                            : t("expired")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Briefcase className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{t("noVacancies")}</p>
        </div>
      )}
    </div>
  );
}
