import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function BolashakPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isKk ? "Артқа" : "Назад"}
        </Link>
      </Button>

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#003DA5]/10">
          <Heart className="h-12 w-12 text-[#003DA5]" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk ? "«Bolashak Charity» қайырымдылық қоғамдық қоры" : "Общественный фонд «Bolashak Charity»"}
        </h1>
      </div>

      <div className="prose max-w-none space-y-4 text-gray-700">
        {isKk ? (
          <>
            <p>«Bolashak Charity» қоғамдық қоры — балаларға, мұқтаж отбасыларға және әлеуметтік осал топтарға көмек көрсетуге бағытталған қайырымдылық ұйымы.</p>
            <p>Қор қызметінің негізгі бағыттары:</p>
            <ul>
              <li>Мұқтаж отбасылардың балаларына маусымдық киім және мектеп құралдарын беру</li>
              <li>Ерекше қажеттіліктері бар балаларға тәлімгерлік бағдарламалары</li>
              <li>Демалыс іс-шараларын ұйымдастыру</li>
              <li>Отбасыларға қаржылық және моральдық қолдау көрсету</li>
            </ul>
            <p>Қор «Қазақстан темір жолы» ұлттық компаниясымен «Жылы жүрекпен» әлеуметтік жобасы аясында ынтымақтастық жасайды.</p>
          </>
        ) : (
          <>
            <p>Общественный фонд «Bolashak Charity» — благотворительная организация, направленная на помощь детям, нуждающимся семьям и социально уязвимым группам населения.</p>
            <p>Основные направления деятельности фонда:</p>
            <ul>
              <li>Обеспечение детей из нуждающихся семей сезонной одеждой и школьными принадлежностями</li>
              <li>Программы наставничества для детей с особыми потребностями</li>
              <li>Организация досуговых мероприятий</li>
              <li>Финансовая и моральная поддержка семей</li>
            </ul>
            <p>Фонд сотрудничает с национальной компанией «Казахстан темир жолы» в рамках социального проекта «Жылы жүрекпен».</p>
          </>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://www.instagram.com/bolashakcharity"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003DA5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002D7A]"
        >
          Instagram — @bolashakcharity
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
