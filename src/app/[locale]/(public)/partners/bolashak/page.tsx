import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableSection } from "./expandable-section";

type Props = { params: Promise<{ locale: string }> };

export default async function BolashakPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  const S = isKk ? "Мектеп" : "Школа";
  const kpiData = [
    { city: "Актау", schools: [`${S} №17`] },
    { city: "Актобе", schools: [`${S} №26`, `${S} №29`] },
    { city: "Алматы", schools: [`${S} №63`, `${S} №64`, `${S} №74`, `${S} №75`, `${S} №87`, `${S} №116`, `${S} №174`] },
    { city: "Астана", schools: [`${S} №8`, `${S} №11`, `${S} №37`, `${S} №71`, `${S} №85`, `${S} №88`, `${S} №89`, `${S} №91`, `${S} №92`, `${S} №95`, "Бином имени Сатпаева", "Детский сад №24", "Детский сад №34", "Детский сад №89", "Детский сад №54", "Детский сад №60", "Детский сад №66", "Детский сад №95", "Детский сад №8", "Детский сад №11", "Детский сад №76", "Детский сад №63", "Детский сад №80", "Детский сад №98", "Детский сад №86", "Детский сад №35", "Детский сад №52", "Детский сад №77", "Детский сад №64"] },
    { city: isKk ? "Атырау" : "Атырау", schools: [`${S} №3`, `${S} №6`, `${S} №21`, `${S} №24`, `${S} №40 ФПП`, `${S} №42`] },
    { city: isKk ? "Құлсары (Атырау обл.)" : "Кульсары (Атырауская обл.)", schools: [`${S} №7`, "СШ им Нысанбаева ФПП"] },
    { city: isKk ? "Жаркент (Алматы обл.)" : "Жаркент (Алматинская обл.)", schools: ["СШ им. Алтынсарина ФПП"] },
    { city: isKk ? "Жезқазған" : "Жезказган", schools: [`${S} №13`] },
    { city: isKk ? "Қарағанды" : "Караганда", schools: [`${S} №5`, `${S} №10`, `${S} №33`, `${S} №48`, `${S} №82`, `${S} №102`] },
    { city: isKk ? "Көкшетау" : "Кокшетау", schools: [`${S} №4`] },
    { city: isKk ? "Қостанай" : "Костанай", schools: [`${S} №27`, `${S} №29`] },
    { city: isKk ? "Қарасу (Қостанай обл.)" : "Карасу (Костанайская обл.)", schools: ["Карасуская школа ФПП"] },
    { city: isKk ? "Рудный (Қостанай обл.)" : "Рудный (Костанайская обл.)", schools: [`${S} №17 ФПП`] },
    { city: isKk ? "Қызылорда" : "Кызылорда", schools: [`${S} №6`, `${S} №23`] },
    { city: isKk ? "Павлодар" : "Павлодар", schools: [`${S} №6`] },
    { city: isKk ? "Петропавл" : "Петропавловск", schools: [`${S} №8`, `${S} №21`, `${S} №23`] },
    { city: isKk ? "Семей" : "Семей", schools: [`${S} №17`, `${S} №27`, `${S} №36 ФПП`] },
    { city: isKk ? "Талдықорған" : "Талдыкорган", schools: [`${S} №7`, `${S} №27 ФПП`] },
    { city: isKk ? "Тараз" : "Тараз", schools: [`${S} №9 ФПП`, `${S} №32`, `${S} №35 ФПП`] },
    { city: isKk ? "Теміртау" : "Темиртау", schools: [`${S} №10`] },
    { city: isKk ? "Түркістан" : "Туркестан", schools: [`${S} №1 ФПП`, `${S} №21 ФПП`, `${S} №24`] },
    { city: isKk ? "Орал" : "Уральск", schools: [`${S} №5 ФПП`, `${S} №13`, `${S} №21`] },
    { city: isKk ? "Подстепное (БҚО)" : "Подстепное (Западно-Казахстанская обл.)", schools: [`${S} №1 ФПП`] },
    { city: isKk ? "Өскемен" : "Усть-Каменогорск", schools: [`${S} №15`, `${S} №17 ФПП`, `${S} №26`, `${S} №36`, `${S} №39`] },
    { city: isKk ? "Екібастұз" : "Экибастуз", schools: [`${S} №10`] },
    { city: isKk ? "Шымкент" : "Шымкент", schools: [`${S} №12`, `${S} №19`, `${S} №37`] },
  ];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isKk ? "Артқа" : "Назад"}
        </Link>
      </Button>

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-auto items-center justify-center overflow-hidden">
          <img src="/bolashak-charity-logo.png" alt="Bolashak Charity" className="h-24 w-auto object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk
            ? "«Болашақ» қайырымдылық қоры"
            : "Благотворительный фонд «Болашак»"}
        </h1>
      </div>

      {/* Описание */}
      <div className="prose max-w-none space-y-4 text-gray-700">
        {isKk ? (
          <>
            <p>
              «Болашақ» қайырымдылық қоры — «Болашақ» Қауымдастығының
              корпоративтік қоры, ол Қазақстанда білім беру, денсаулық сақтау
              және әлеуметтік саланы дамытуға бағытталған әлеуметтік
              бастамалар мен жобаларды қолдаумен айналысады. Қор жобаларға
              ұйымдастырушылық, ақпараттық және талдамалық қолдау көрсетіп,
              компаниялар, мемлекеттік құрылымдар мен қоғамдық ұйымдардың
              өзара іс-қимыл жасау алаңын құрады.
            </p>
            <p>
              Қор коммерциялық емес қызмет қағидаттары негізінде жұмыс істейді,
              қоғамға нақты пайда әкелетін және корпоративтік сектордың
              әлеуметтік жауапкершілігін нығайтатын ұзақ мерзімді әлеуметтік
              бағдарламалар мен бастамаларды дамытуға назар аударады.
            </p>
            <p>
              Қордың мақсаты — білім беру, мәдени және әлеуметтік жобаларды
              қолдау арқылы қоғамның тұрақты дамуына ықпал ету, маңызды
              әлеуметтік нәтижелерге жету үшін әртүрлі қатысушылардың
              ресурстарын, сараптамасын және тәжірибесін біріктіру.
            </p>
          </>
        ) : (
          <>
            <p>
              Благотворительный фонд «Болашак» — корпоративный фонд Ассоциации
              «Болашак», который занимается поддержкой социальных инициатив и
              проектов, направленных на развитие образования, здравоохранения и
              социальной сферы в Казахстане. Фонд обеспечивает организационную,
              информационную и аналитическую поддержку проектов, создавая
              платформу для взаимодействия компаний, государственных структур и
              общественных организаций.
            </p>
            <p>
              Фонд действует на принципах некоммерческой деятельности,
              концентрируясь на развитии долгосрочных социальных программ и
              инициатив, которые приносят реальную пользу обществу и укрепляют
              социальную ответственность корпоративного сектора.
            </p>
            <p>
              Цель фонда — способствовать устойчивому развитию общества через
              поддержку образовательных, культурных и социальных проектов,
              объединяя ресурсы, экспертизу и опыт различных участников для
              достижения значимых социальных результатов.
            </p>
          </>
        )}
      </div>

      {/* Тест M-CHAT */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://bolashakcharity.kz/m-chat-r-test-na-pervye-priznaki-autizma-u-rebenka/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003DA5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002D7A]"
        >
          {isKk ? "M-CHAT ТЕСТІН ТАПСЫРУ" : "Пройти ТЕСТ M-CHAT"}
          <ExternalLink className="h-4 w-4" />
        </a>
        <a
          href="https://www.youtube.com/watch?v=MHriJZC4q7g&list=PLhvBiDNqdcQSxPlfnK1zCn3iNFwrb5aR1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[#003DA5] px-6 py-3 text-sm font-bold text-[#003DA5] transition-colors hover:bg-[#003DA5]/5"
        >
          {isKk ? "Бейне нұсқаулықты көру" : "Посмотреть видеоинструкцию"}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Список клиник */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-[#003DA5]">
          {isKk ? "Инклюзияны қолдау кабинеттерінің тізімі (ИҚК)" : "Список кабинетов поддержки инклюзии (КПИ)"}
        </h2>
        <ExpandableSection
          title={isKk ? "Кабинеттерді көрсету" : "Показать кабинеты"}
        >
          <div className="space-y-2">
            {kpiData.map((item, i) => (
              <ExpandableSection key={i} title={item.city}>
                <ul className="space-y-1">
                  {item.schools.map((school, j) => (
                    <li
                      key={j}
                      className="rounded-md bg-gray-50 px-4 py-2 text-sm text-gray-700"
                    >
                      {school}
                    </li>
                  ))}
                </ul>
              </ExpandableSection>
            ))}
          </div>
        </ExpandableSection>
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
