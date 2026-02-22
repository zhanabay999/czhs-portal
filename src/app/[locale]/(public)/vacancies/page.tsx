import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Briefcase } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VacanciesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VacanciesContent locale={locale} />;
}

function VacanciesContent({ locale }: { locale: string }) {
  const t = useTranslations("vacancies");
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 border-b-2 border-[#003DA5] pb-3">
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("title")}</h1>
      </div>

      <div className="mx-auto max-w-2xl py-12">
        <Card className="border-[#003DA5] bg-gradient-to-r from-[#003DA5] to-[#0066CC] text-white">
          <CardContent className="flex flex-col items-center gap-6 p-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
              <Briefcase className="h-8 w-8" />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold">{t("externalLink")}</h2>
              <p className="text-blue-100">{t("externalDescription")}</p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-[#C8A951] text-[#1A1A2E] hover:bg-[#D4B862]"
            >
              <a href="https://job.railways.kz/" target="_blank" rel="noopener noreferrer">
                job.railways.kz
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
