import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { db } from "@/db";
import { sportsEvents, sportsResults, sportsGalleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, MapPin, Trophy, Medal } from "lucide-react";

type Props = { params: Promise<{ locale: string; eventSlug: string }> };

export default async function SportsEventPage({ params }: Props) {
  const { locale, eventSlug } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  const [event] = await db.select().from(sportsEvents).where(eq(sportsEvents.slug, eventSlug)).limit(1);
  if (!event) notFound();

  const results = await db.select().from(sportsResults).where(eq(sportsResults.eventId, event.id)).orderBy(sportsResults.position);
  const gallery = await db.select().from(sportsGalleryImages).where(eq(sportsGalleryImages.eventId, event.id)).orderBy(sportsGalleryImages.sortOrder);

  return <EventContent locale={locale} isKk={isKk} event={event} results={results} gallery={gallery} />;
}

function EventContent({ locale, isKk, event, results, gallery }: {
  locale: string; isKk: boolean;
  event: typeof sportsEvents.$inferSelect;
  results: Array<typeof sportsResults.$inferSelect>;
  gallery: Array<typeof sportsGalleryImages.$inferSelect>;
}) {
  const t = useTranslations("sports");
  const tc = useTranslations("common");

  const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/sports"><ArrowLeft className="mr-2 h-4 w-4" />{tc("back")}</Link>
      </Button>

      {event.coverImageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img src={event.coverImageUrl} alt={isKk ? event.titleKk : event.titleRu} className="h-[300px] w-full object-cover" />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className="bg-[#003DA5] text-white">{t(`eventTypes.${event.eventType}`)}</Badge>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(event.startDate).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU", { year: "numeric", month: "long", day: "numeric" })}
        </span>
        {event.location && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />{event.location}
          </span>
        )}
      </div>

      <h1 className="mb-6 text-3xl font-bold text-[#003DA5]">{isKk ? event.titleKk : event.titleRu}</h1>

      {(isKk ? event.descriptionKk : event.descriptionRu) && (
        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: (isKk ? event.descriptionKk : event.descriptionRu)! }} />
      )}

      {results.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-[#003DA5]">{t("results")}</h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{t("position")}</TableHead>
                  <TableHead>{t("team")}</TableHead>
                  <TableHead className="w-32">{t("score")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.position <= 3 ? (
                        <Medal className={`h-5 w-5 ${medalColors[r.position - 1]}`} />
                      ) : (
                        r.position
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{isKk ? r.teamOrPlayerKk : r.teamOrPlayerRu}</TableCell>
                    <TableCell>{r.score || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      )}

      {gallery.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#003DA5]">{t("gallery")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {gallery.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-lg">
                <img src={img.url} alt={isKk ? img.captionKk || "" : img.captionRu || ""} className="h-48 w-full object-cover transition-transform hover:scale-105" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
