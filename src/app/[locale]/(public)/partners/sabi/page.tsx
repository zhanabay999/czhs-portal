import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function SabiHealthPage({ params }: Props) {
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
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
          <Sun className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk ? "«Sabi Health» Войта-клиникасы" : "Войта-клиника «Sabi Health»"}
        </h1>
      </div>

      <div className="prose max-w-none space-y-4 text-gray-700">
        {isKk ? (
          <>
            <p>«Sabi Health» — балалар мен ересектерге арналған оңалту және қалпына келтіру орталығы. Клиника Войта-терапия әдісі бойынша мамандандырылған.</p>
            <p>Клиника қызметінің негізгі бағыттары:</p>
            <ul>
              <li>Войта-терапия — неврологиялық бұзылыстарды оңалту</li>
              <li>Балалардың психомоторлық дамуын бағалау және қолдау</li>
              <li>Физиотерапия және емдік дене шынықтыру</li>
              <li>Жеке оңалту бағдарламаларын құру</li>
            </ul>
            <p>Клиника тәжірибелі мамандардан тұрады және әр пациентке жеке көзқараспен қарайды.</p>
          </>
        ) : (
          <>
            <p>«Sabi Health» — центр реабилитации и восстановления здоровья для детей и взрослых. Клиника специализируется на методе Войта-терапии.</p>
            <p>Основные направления деятельности клиники:</p>
            <ul>
              <li>Войта-терапия — реабилитация при неврологических нарушениях</li>
              <li>Оценка и поддержка психомоторного развития детей</li>
              <li>Физиотерапия и лечебная физкультура</li>
              <li>Составление индивидуальных программ реабилитации</li>
            </ul>
            <p>В клинике работают опытные специалисты, обеспечивающие индивидуальный подход к каждому пациенту.</p>
          </>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://www.instagram.com/sabi__health"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003DA5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002D7A]"
        >
          Instagram — @sabi__health
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
