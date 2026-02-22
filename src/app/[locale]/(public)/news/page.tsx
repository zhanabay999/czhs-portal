import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { db } from "@/db";
import { newsArticles, newsCategories } from "@/db/schema";
import { desc, eq, like, and, or, sql } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, ChevronLeft, ChevronRight, Clock } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
};

const ITEMS_PER_PAGE = 12;

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageStr, category, search } = await searchParams;
  setRequestLocale(locale);
  const page = Math.max(1, parseInt(pageStr || "1"));
  const isKk = locale === "kk";

  let categories: Array<{ id: string; slug: string; nameKk: string; nameRu: string }> = [];
  let articles: Array<{
    id: string;
    slug: string;
    titleKk: string;
    titleRu: string;
    excerptKk: string | null;
    excerptRu: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
    isPinned: boolean;
    viewCount: number;
  }> = [];
  let totalCount = 0;

  try {
    categories = await db.select().from(newsCategories).orderBy(newsCategories.sortOrder);

    const conditions = [
      eq(newsArticles.status, "published"),
      eq(newsArticles.isInternal, false),
    ];
    if (category) {
      conditions.push(eq(newsArticles.categoryId, category));
    }
    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      conditions.push(
        or(
          like(newsArticles.titleKk, searchLower),
          like(newsArticles.titleRu, searchLower)
        )!
      );
    }

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsArticles)
      .where(and(...conditions));
    totalCount = Number(countResult.count);

    articles = await db
      .select({
        id: newsArticles.id,
        slug: newsArticles.slug,
        titleKk: newsArticles.titleKk,
        titleRu: newsArticles.titleRu,
        excerptKk: newsArticles.excerptKk,
        excerptRu: newsArticles.excerptRu,
        coverImageUrl: newsArticles.coverImageUrl,
        publishedAt: newsArticles.publishedAt,
        isPinned: newsArticles.isPinned,
        viewCount: newsArticles.viewCount,
      })
      .from(newsArticles)
      .where(and(...conditions))
      .orderBy(desc(newsArticles.isPinned), desc(newsArticles.publishedAt))
      .limit(ITEMS_PER_PAGE)
      .offset((page - 1) * ITEMS_PER_PAGE);
  } catch {}

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return <NewsContent
    locale={locale}
    isKk={isKk}
    articles={articles}
    categories={categories}
    currentCategory={category}
    currentSearch={search}
    page={page}
    totalPages={totalPages}
  />;
}

function NewsContent({
  locale,
  isKk,
  articles,
  categories,
  currentCategory,
  currentSearch,
  page,
  totalPages,
}: {
  locale: string;
  isKk: boolean;
  articles: Array<{
    id: string;
    slug: string;
    titleKk: string;
    titleRu: string;
    excerptKk: string | null;
    excerptRu: string | null;
    coverImageUrl: string | null;
    publishedAt: Date | null;
    isPinned: boolean;
    viewCount: number;
  }>;
  categories: Array<{ id: string; slug: string; nameKk: string; nameRu: string }>;
  currentCategory?: string;
  currentSearch?: string;
  page: number;
  totalPages: number;
}) {
  const t = useTranslations("news");

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(
      locale === "kk" ? "kk-KZ" : "ru-RU",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6 border-b-2 border-[#003DA5] pb-3">
          <h1 className="text-2xl font-bold text-[#003DA5]">{t("title")}</h1>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link href="/news">
              <Badge
                variant={!currentCategory ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1 ${!currentCategory ? "bg-[#003DA5]" : ""}`}
              >
                {t("allCategories")}
              </Badge>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/news?category=${cat.id}`}>
                <Badge
                  variant={currentCategory === cat.id ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1 ${currentCategory === cat.id ? "bg-[#003DA5]" : ""}`}
                >
                  {isKk ? cat.nameKk : cat.nameRu}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* News Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group">
                <article className="h-full overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {article.coverImageUrl ? (
                      <img
                        src={article.coverImageUrl}
                        alt={isKk ? article.titleKk : article.titleRu}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#003DA5]/80 to-[#0066CC]/80">
                        <Newspaper className="h-10 w-10 text-white/30" />
                      </div>
                    )}
                    {article.isPinned && (
                      <span className="absolute left-3 top-3 rounded bg-[#C8A951] px-2 py-1 text-xs font-bold text-white">
                        {t("featured")}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                      <span>{article.viewCount} {t("views")}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-gray-800 transition-colors group-hover:text-[#003DA5]">
                      {isKk ? article.titleKk : article.titleRu}
                    </h3>
                    {(isKk ? article.excerptKk : article.excerptRu) && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {isKk ? article.excerptKk : article.excerptRu}
                      </p>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <Newspaper className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">{t("noNews")}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/news?page=${page - 1}${currentCategory ? `&category=${currentCategory}` : ""}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                asChild
                variant={p === page ? "default" : "outline"}
                size="sm"
                className={p === page ? "bg-[#003DA5]" : ""}
              >
                <Link href={`/news?page=${p}${currentCategory ? `&category=${currentCategory}` : ""}`}>
                  {p}
                </Link>
              </Button>
            ))}
            {page < totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/news?page=${page + 1}${currentCategory ? `&category=${currentCategory}` : ""}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
