import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { summerCampPages, campSessions, campDocuments, campGalleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Calendar, MapPin, Users, FileText, Download } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function SummerCampPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  let page = null;
  let sessions: Array<typeof campSessions.$inferSelect> = [];
  let gallery: Array<typeof campGalleryImages.$inferSelect> = [];
  let documents: Array<typeof campDocuments.$inferSelect> = [];

  try {
    const [p] = await db.select().from(summerCampPages).where(eq(summerCampPages.status, "published")).limit(1);
    page = p || null;
    if (page) {
      sessions = await db.select().from(campSessions).where(eq(campSessions.pageId, page.id));
      gallery = await db.select().from(campGalleryImages).where(eq(campGalleryImages.pageId, page.id)).orderBy(campGalleryImages.sortOrder);
      documents = await db.select().from(campDocuments).where(eq(campDocuments.pageId, page.id));
    }
  } catch {}

  return <CampContent locale={locale} isKk={isKk} page={page} sessions={sessions} gallery={gallery} documents={documents} />;
}

function CampContent({ locale, isKk, page, sessions, gallery, documents }: {
  locale: string; isKk: boolean;
  page: typeof summerCampPages.$inferSelect | null;
  sessions: Array<typeof campSessions.$inferSelect>;
  gallery: Array<typeof campGalleryImages.$inferSelect>;
  documents: Array<typeof campDocuments.$inferSelect>;
}) {
  const t = useTranslations("camp");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#003DA5]">{t("title")}</h1>
        <div className="h-1 w-20 rounded bg-[#C8A951]" />
      </div>

      {page ? (
        <>
          {page.coverImageUrl && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img src={page.coverImageUrl} alt={isKk ? page.titleKk : page.titleRu} className="h-[300px] w-full object-cover" />
            </div>
          )}
          <div className="prose max-w-none mb-12" dangerouslySetInnerHTML={{ __html: isKk ? page.contentKk : page.contentRu }} />

          {sessions.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("sessions")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {sessions.map((s) => (
                  <Card key={s.id}>
                    <CardHeader>
                      <CardTitle>{isKk ? s.nameKk : s.nameRu}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2"><Calendar className="h-4 w-4" />{new Date(s.startDate).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU")} — {new Date(s.endDate).toLocaleDateString(locale === "kk" ? "kk-KZ" : "ru-RU")}</p>
                      {s.location && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{s.location}</p>}
                      {s.capacity && <p className="flex items-center gap-2"><Users className="h-4 w-4" />{t("capacity")}: {s.capacity}</p>}
                      {(isKk ? s.descKk : s.descRu) && <p>{isKk ? s.descKk : s.descRu}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("gallery")}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {gallery.map((img) => (
                  <div key={img.id} className="overflow-hidden rounded-lg">
                    <img src={img.url} alt={isKk ? img.captionKk || "" : img.captionRu || ""} className="h-48 w-full object-cover transition-transform hover:scale-105" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {documents.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("documents")}</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-secondary">
                    <FileText className="h-5 w-5 shrink-0 text-[#003DA5]" />
                    <span className="flex-1 font-medium">{isKk ? doc.titleKk : doc.titleRu}</span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Sun className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{isKk ? "Ақпарат жақында қосылады" : "Информация скоро появится"}</p>
        </div>
      )}
    </div>
  );
}
