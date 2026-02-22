import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { sportsEvents } from "@/db/schema";
import { desc, eq, gte, lt } from "drizzle-orm";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, MapPin } from "lucide-react";

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
      <div className="mb-6 border-b-2 border-[#003DA5] pb-3">
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("title")}</h1>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("upcoming")}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map(renderEvent)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("past")}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map(renderEvent)}
          </div>
        </section>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{isKk ? "Іс-шаралар жақында қосылады" : "Мероприятия скоро появятся"}</p>
        </div>
      )}
    </div>
  );
}
