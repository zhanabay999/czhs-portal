import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { sportsEvents } from "@/db/schema";
import { desc, eq, gte, lt } from "drizzle-orm";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";

type Props = { params: Promise<{ locale: string }> };

const eventTypeColors: Record<string, string> = {
  football: "bg-green-500",
  volleyball: "bg-blue-500",
  basketball: "bg-orange-500",
  table_tennis: "bg-purple-500",
  chess: "bg-gray-700",
  track_and_field: "bg-red-500",
  swimming: "bg-cyan-500",
  other: "bg-gray-500",
};

export default async function SportsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";
  const now = new Date();

  let upcoming: Array<typeof sportsEvents.$inferSelect> = [];
  let past: Array<typeof sportsEvents.$inferSelect> = [];

  try {
    upcoming = await db
      .select().from(sportsEvents)
      .where(eq(sportsEvents.status, "published"))
      .orderBy(sportsEvents.startDate);

    past = upcoming.filter(e => new Date(e.startDate) < now);
    upcoming = upcoming.filter(e => new Date(e.startDate) >= now);
  } catch {}

  return <SportsContent locale={locale} isKk={isKk} upcoming={upcoming} past={past} />;
}

const committeeMembers = [
  { photo: "/sports-committee/karimov.jpg", name: "Каримов Нурлан Манапович", role: "chairman", specRu: "Председатель комитета", specKk: "Комитет төрағасы" },
  { photo: "/sports-committee/akhmedin.jpg", name: "Ахмедин Айдос Куандыкович", specRu: "Организаторские вопросы", specKk: "Ұйымдастыру мәселелері" },
  { photo: "/sports-committee/beisenbaev.jpg", name: "Бейсенбаев Алибек Еркинович", specRu: "Футбол", specKk: "Футбол" },
  { photo: "/sports-committee/mauletov.jpg", name: "Маулетов Жанибек Кенесбекулы", specRu: "Баскетбол", specKk: "Баскетбол" },
  { photo: "/sports-committee/sambetov.jpg", name: "Самбетов Бауржан Кошкарович", specRu: "Волейбол", specKk: "Волейбол" },
  { photo: "/sports-committee/kanafin.jpg", name: "Канафин Асхат Маратович", specRu: "Шахматы", specKk: "Шахмат" },
  { photo: "/sports-committee/nauanov.jpg", name: "Науанов Қайрат Қабақұлы", specRu: "Национальные игры", specKk: "Ұлттық ойындар" },
  { photo: "/sports-committee/akhmedova.jpg", name: "Ахмедова Дана Давлатқызы", specRu: "Настольный теннис", specKk: "Үстел теннисі" },
  { photo: "/sports-committee/ospanova.jpg", name: "Оспанова Жанайым Абдрахмановна", specRu: "Волейбол", specKk: "Волейбол" },
  { photo: "/sports-committee/kasymov.jpg", name: "Касымов Руслан Айдушевич", specRu: "Футбол", specKk: "Футбол" },
];

function CommitteeSection({ isKk }: { isKk: boolean }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-ktz-blue flex items-center gap-2">
        <Users className="h-6 w-6" />
        {isKk ? "Спорт комитеті" : "Спортивный комитет"}
      </h2>
      {/* Председатель — по центру */}
      <div className="mb-8 flex justify-center">
        {committeeMembers.filter(m => m.role === "chairman").map((member) => (
          <div key={member.name} className="flex flex-col items-center text-center">
            <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-full border-4 border-yellow-500 ring-2 ring-yellow-300 shadow-lg sm:h-44 sm:w-44">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <p className="text-base font-semibold leading-tight">{member.name}</p>
            <p className="mt-1 text-sm font-semibold text-yellow-600">{isKk ? "Комитет төрағасы" : "Председатель комитета"}</p>
          </div>
        ))}
      </div>
      {/* Остальные члены — 3 столбца */}
      <div className="grid grid-cols-3 justify-items-center gap-x-3 gap-y-6 sm:gap-6">
        {committeeMembers.filter(m => m.role !== "chairman").map((member) => (
          <div key={member.name} className="flex flex-col items-center text-center">
            <div className="relative mb-2 h-24 w-24 overflow-hidden rounded-full border-3 border-ktz-blue/20 shadow-md sm:h-36 sm:w-36 sm:border-4">
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <p className="text-xs font-medium leading-tight sm:text-sm">{member.name}</p>
            <p className="mt-1 text-[10px] text-ktz-blue font-medium sm:text-xs">{isKk ? member.specKk : member.specRu}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SportsContent({ locale, isKk, upcoming, past }: {
  locale: string; isKk: boolean;
  upcoming: Array<typeof sportsEvents.$inferSelect>;
  past: Array<typeof sportsEvents.$inferSelect>;
}) {
  const t = useTranslations("sports");

  const renderEvent = (event: typeof sportsEvents.$inferSelect) => (
    <Link key={event.id} href={`/sports/${event.slug}`}>
      <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        {event.coverImageUrl ? (
          <img src={event.coverImageUrl} alt={isKk ? event.titleKk : event.titleRu} className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#003DA5] to-[#0066CC]">
            <Trophy className="h-12 w-12 text-white/30" />
          </div>
        )}
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className={`${eventTypeColors[event.eventType] || "bg-gray-500"} text-white`}>
              {t(`eventTypes.${event.eventType}`)}
            </Badge>
          </div>
          <h3 className="mb-2 font-semibold group-hover:text-[#003DA5]">
            {isKk ? event.titleKk : event.titleRu}
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(event.startDate).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            {event.location && (
              <p className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 border-b-2 border-ktz-blue pb-3">
        <h1 className="text-2xl font-bold text-ktz-blue">{t("title")}</h1>
      </div>

      <CommitteeSection isKk={isKk} />

      {/* Календарь спортивных мероприятий */}
      <section className="mb-12">
        <div className="mb-6 border-b-2 border-ktz-blue pb-3">
          <h2 className="text-2xl font-bold text-ktz-blue flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            {isKk ? "Спорт іс-шаралар күнтізбесі" : "Календарь спортивных мероприятий"}
          </h2>
        </div>

        {upcoming.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-semibold text-ktz-blue">{t("upcoming")}</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map(renderEvent)}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-ktz-blue">{t("past")}</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map(renderEvent)}
            </div>
          </div>
        )}

        {upcoming.length === 0 && past.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-muted-foreground">{isKk ? "Іс-шаралар жақында қосылады" : "Мероприятия скоро появятся"}</p>
          </div>
        )}
      </section>

      {/* Заявка на вступление */}
      <div className="mb-12 flex justify-center">
        <Link href="/sports/apply" className="inline-flex items-center gap-2 rounded-lg bg-ktz-blue px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-ktz-blue/90 hover:-translate-y-0.5 hover:shadow-xl">
          {isKk ? "ЦЖС спортшылар пулына кіруге өтінім" : "Заявка на вступление в пул спортсменов ЦЖС"}
        </Link>
      </div>
    </div>
  );
}
