import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { sanatoriumPages, sanatoriumPrograms, sanatoriumDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SanatoriumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  let page = null;
  let programs: Array<typeof sanatoriumPrograms.$inferSelect> = [];
  let documents: Array<typeof sanatoriumDocuments.$inferSelect> = [];

  try {
    const [p] = await db
      .select()
      .from(sanatoriumPages)
      .where(eq(sanatoriumPages.status, "published"))
      .limit(1);
    page = p || null;

    if (page) {
      programs = await db
        .select()
        .from(sanatoriumPrograms)
        .where(eq(sanatoriumPrograms.pageId, page.id))
        .orderBy(sanatoriumPrograms.sortOrder);
      documents = await db
        .select()
        .from(sanatoriumDocuments)
        .where(eq(sanatoriumDocuments.pageId, page.id));
    }
  } catch {
    // DB not ready
  }

  return <SanatoriumContent locale={locale} isKk={isKk} page={page} programs={programs} documents={documents} />;
}

function SanatoriumContent({
  locale,
  isKk,
  page,
  programs,
  documents,
}: {
  locale: string;
  isKk: boolean;
  page: typeof sanatoriumPages.$inferSelect | null;
  programs: Array<typeof sanatoriumPrograms.$inferSelect>;
  documents: Array<typeof sanatoriumDocuments.$inferSelect>;
}) {
  const t = useTranslations("sanatorium");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 border-b-2 border-[#003DA5] pb-3">
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("description")}</p>
      </div>

      {page ? (
        <>
          {page.coverImageUrl && (
            <div className="mb-8 overflow-hidden rounded-xl">
              <img
                src={page.coverImageUrl}
                alt={isKk ? page.titleKk : page.titleRu}
                className="h-[300px] w-full object-cover"
              />
            </div>
          )}

          <div
            className="prose max-w-none mb-12"
            dangerouslySetInnerHTML={{
              __html: isKk ? page.contentKk : page.contentRu,
            }}
          />

          {/* Programs */}
          {programs.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("programs")}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {programs.map((prog) => (
                  <Card key={prog.id} className="overflow-hidden">
                    {prog.imageUrl && (
                      <img
                        src={prog.imageUrl}
                        alt={isKk ? prog.nameKk : prog.nameRu}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {isKk ? prog.nameKk : prog.nameRu}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {isKk ? prog.descKk : prog.descRu}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-bold text-[#003DA5]">{t("documents")}</h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-secondary"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-[#003DA5]" />
                    <span className="flex-1 font-medium">
                      {isKk ? doc.titleKk : doc.titleRu}
                    </span>
                    {doc.fileSize && (
                      <span className="text-sm text-muted-foreground">
                        {(doc.fileSize / 1024).toFixed(0)} KB
                      </span>
                    )}
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">
            {isKk ? "Ақпарат жақында қосылады" : "Информация скоро появится"}
          </p>
        </div>
      )}
    </div>
  );
}
