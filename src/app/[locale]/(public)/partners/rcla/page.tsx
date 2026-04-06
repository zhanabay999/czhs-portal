import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

type Props = { params: Promise<{ locale: string }> };

export default async function RCLAPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <BackButton label={isKk ? "Артқа" : "Назад"} />

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
          <img src="/rcla-logo.jpg" alt="РКЮК" className="h-24 w-24 object-cover" />
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
            <p>
              Заң кеңесшілерінің Республикалық алқасы — облыстардың, республикалық маңызы бар
              қалалардың және астананың кемінде үштен екісін білдіретін заң кеңесшілері
              палаталарының ерікті мүшелігіне негізделген коммерциялық емес ұйым. Оның қызметі
              мен өкілеттіктері Қазақстан Республикасының «Адвокаттық қызмет және заңгерлік
              көмек туралы» Заңымен, Қазақстан Республикасының өзге де заңнамасымен, алқа
              жарғысымен айқындалады және оның мүшелері болып табылатын заң кеңесшілері
              палаталарының қатысты мүдделері үшін жүзеге асырылады.
            </p>
            <p>
              Алқа өз қызметін Қазақстан Республикасының Конституциясы, Қазақстан
              Республикасының Азаматтық кодексі, Қазақстан Республикасының «Адвокаттық қызмет
              және заңгерлік көмек туралы», «Коммерциялық емес ұйымдар туралы» заңдары мен
              өзге де заңнамалық актілері, басқару органдарының шешімдері мен Жарғы негізінде
              жүзеге асырады.
            </p>
          </>
        ) : (
          <>
            <p>
              Республиканская коллегия юридических консультантов – некоммерческая организация,
              основанная на добровольном членстве палат юридических консультантов, представляющих
              не менее двух третей областей, городов республиканского значения и столицы,
              деятельность и полномочия которой определяются Законом Республики Казахстан
              «Об адвокатской деятельности и юридической помощи», иным законодательством
              Республики Казахстан, уставом коллегии и осуществляются в отношении и интересах
              палат юридических консультантов, являющихся ее членами.
            </p>
            <p>
              Коллегия осуществляет свою деятельность на основе Конституции Республики Казахстан,
              Гражданского Кодекса Республики Казахстан, Законов Республики Казахстан
              «Об адвокатской деятельности и юридической помощи», «О некоммерческих организациях»
              и иных законодательных актов Республики Казахстан, решений органов управления и Устава.
            </p>
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
