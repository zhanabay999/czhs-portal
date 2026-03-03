import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function SanatoriumQuotaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/sanatorium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isKk ? "Артқа" : "Назад"}
        </Link>
      </Button>

      <h1 className="mb-6 text-2xl font-bold text-[#003DA5] sm:text-3xl">
        {isKk ? "Санаторийге квота" : "Квота на санаторий"}
      </h1>

      <div className="prose max-w-none space-y-4 text-gray-700">
        <p className="text-muted-foreground">
          {isKk ? "Ақпарат жақында қосылады" : "Информация скоро появится"}
        </p>
      </div>
    </div>
  );
}
