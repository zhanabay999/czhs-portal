import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ExternalLink, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function RCLAPage({ params }: Props) {
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
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50">
          <Scale className="h-12 w-12 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk
            ? "Заң кеңесшілерінің Республикалық алқасы"
            : "Республиканская Коллегия Юридических Консультантов"}
        </h1>
      </div>

      <div className="prose max-w-none space-y-4 text-gray-700">
        {isKk ? (
          <>
            <p>Заң кеңесшілерінің Республикалық алқасы (RCLA) — Қазақстан Республикасындағы заң кеңесшілерінің кәсіби бірлестігі.</p>
            <p>Алқа ұсынатын қызметтер:</p>
            <ul>
              <li>Азаматтық және отбасылық құқық бойынша заңгерлік кеңестер</li>
              <li>Сот өкілдігі — азаматтық, қылмыстық және әкімшілік істер</li>
              <li>Еңбек дауларын шешу</li>
              <li>Құқықтық құжаттарды дайындау және сараптама жасау</li>
              <li>Шағын және орта бизнеске заңгерлік қолдау</li>
            </ul>
            <p>Алқа мүшелері — жоғары білікті заң кеңесшілері, олар заңнамаға сәйкес лицензияланған кәсіби қызмет көрсетеді.</p>
          </>
        ) : (
          <>
            <p>Республиканская Коллегия Юридических Консультантов (RCLA) — профессиональное объединение юридических консультантов Республики Казахстан.</p>
            <p>Услуги, предоставляемые коллегией:</p>
            <ul>
              <li>Юридические консультации по гражданскому и семейному праву</li>
              <li>Судебное представительство — гражданские, уголовные и административные дела</li>
              <li>Разрешение трудовых споров</li>
              <li>Подготовка и экспертиза правовых документов</li>
              <li>Юридическое сопровождение малого и среднего бизнеса</li>
            </ul>
            <p>Члены коллегии — высококвалифицированные юридические консультанты, оказывающие профессиональные услуги в соответствии с законодательством.</p>
          </>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://rcla.kz/ru"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003DA5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002D7A]"
        >
          rcla.kz
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
