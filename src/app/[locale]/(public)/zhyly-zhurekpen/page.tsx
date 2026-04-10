import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Heart, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export default async function ZhylyZhurekpenPage({ params }: Props) {
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
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-50">
          <Heart className="h-12 w-12 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk
            ? "«Жылы жүрекпен» әлеуметтік жобасы"
            : "Социальный проект «Жылы Жүрекпен»"}
        </h1>
      </div>

      <div className="prose max-w-none space-y-6 text-gray-700">
        {/* О проекте */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-[#003DA5]">
            {isKk ? "Жоба туралы" : "О проекте"}
          </h2>
          {isKk ? (
            <p>
              Ерекше қажеттіліктері бар балаларды тәрбиелейтін Дирекция
              қызметкерлерін қолдаудың әлеуметтік жобасы корпоративтік әлеуметтік
              жауапкершілік аясында жүзеге асырылады. Жоба коммерциялық емес
              сипатта және қызметкерлер отбасыларын қолдаудың ішкі корпоративтік
              жүйесін құруға бағытталған.
            </p>
          ) : (
            <p>
              Социальный проект поддержки работников Дирекции, воспитывающих
              детей с особыми потребностями, реализуется в рамках корпоративной
              социальной ответственности. Проект носит некоммерческий характер и
              направлен на создание внутрикорпоративной системы поддержки семей
              сотрудников.
            </p>
          )}
        </div>

        {/* Для кого */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-[#003DA5]">
            {isKk ? "Кімге арналған" : "Для кого"}
          </h2>
          {isKk ? (
            <p>
              Қосымша назар, сүйемелдеу және мамандандырылған көмек қажет ететін
              балалардың ата-аналары болып табылатын Дирекция қызметкерлеріне
              арналған.
            </p>
          ) : (
            <p>
              Для работников Дирекции, которые являются родителями детей,
              требующих дополнительного внимания, сопровождения и
              специализированной помощи.
            </p>
          )}
        </div>

        {/* Цель проекта */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-[#003DA5]">
            {isKk ? "Жобаның мақсаты" : "Цель проекта"}
          </h2>
          {isKk ? (
            <>
              <p>
                Қызметкерлер білікті кеңестер, қажетті ақпарат және отбасына
                байланысты мәселелер бойынша ұйымдастырушылық көмек ала алатын
                тұрақты қолдау тетігін қалыптастыру.
              </p>
              <p>
                Жоба ұжым ішіндегі өзара жауапкершілік пен қолдау мәдениетін
                нығайтады.
              </p>
            </>
          ) : (
            <>
              <p>
                Формирование устойчивого механизма поддержки, при котором
                сотрудники могут получать квалифицированные консультации,
                необходимую информацию и организационное содействие по вопросам,
                связанным с семьёй.
              </p>
              <p>
                Проект укрепляет культуру взаимной ответственности и поддержки
                внутри коллектива.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Кнопка Патронаж */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/zhyly-zhurekpen/patronage"
          className="inline-flex items-center gap-2 rounded-lg bg-ktz-blue px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-ktz-blue/90 hover:-translate-y-0.5 hover:shadow-xl"
        >
          <HeartHandshake className="h-5 w-5" />
          {isKk ? "Патронаж" : "Патронаж"}
        </Link>
      </div>

      {/* Наши партнёры */}
      <div className="mt-12">
        <h2 className="mb-6 text-center text-lg font-bold text-[#003DA5]">
          {isKk ? "Біздің серіктестер" : "Наши партнёры"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* RCLA */}
          <Link
            href="/partners/rcla"
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md"
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
              <img
                src="/rcla-logo.jpg"
                alt="РКЮК"
                className="h-16 w-16 object-cover"
              />
            </div>
            <h3 className="mb-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-[#003DA5]">
              {isKk
                ? "Заң кеңесшілерінің Республикалық алқасы"
                : "Республиканская Коллегия Юридических Консультантов"}
            </h3>
            <p className="text-xs text-gray-500">
              {isKk
                ? "Заң кеңесшілері палаталарының ерікті мүшелігіне негізделген коммерциялық емес ұйым"
                : "Некоммерческая организация, основанная на добровольном членстве палат юридических консультантов"}
            </p>
          </Link>

          {/* Bolashak Charity */}
          <Link
            href="/partners/bolashak"
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md"
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden">
              <img
                src="/bolashak-charity-logo.png"
                alt="Bolashak Charity"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h3 className="mb-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-[#003DA5]">
              BOLASHAK CHARITY
            </h3>
            <p className="text-xs text-gray-500">
              {isKk
                ? "Білім беру, денсаулық сақтау және әлеуметтік саланы дамытуға бағытталған қайырымдылық қоры"
                : "Благотворительный фонд поддержки образования, здравоохранения и социальной сферы"}
            </p>
          </Link>

          {/* Sabi Health */}
          <Link
            href="/partners/sabi"
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-[#003DA5]/30 hover:shadow-md"
          >
            <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
              <img
                src="/sabi-health-logo.png"
                alt="Sabi Health"
                className="h-16 w-16 object-contain"
              />
            </div>
            <h3 className="mb-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-[#003DA5]">
              SABI HEALTH
            </h3>
            <p className="text-xs text-gray-500">
              {isKk
                ? "Балалардың дамуын кешенді қолдауға маманданған балалар оңалту орталығы"
                : "Детский реабилитационный центр комплексной поддержки развития детей"}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
