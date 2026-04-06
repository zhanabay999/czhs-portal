import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { db } from "@/db";
import { newsArticles, users, newsCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function NewsArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  const [article] = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.slug, slug))
    .limit(1);

  if (!article || article.status !== "published") {
    notFound();
  }

  // Increment view count
  await db
    .update(newsArticles)
    .set({ viewCount: article.viewCount + 1 })
    .where(eq(newsArticles.id, article.id));

  const [author] = await db
    .select({ firstName: users.firstName, lastName: users.lastName })
    .from(users)
    .where(eq(users.id, article.authorId))
    .limit(1);

  let category = null;
  if (article.categoryId) {
    const [cat] = await db
      .select()
      .from(newsCategories)
      .where(eq(newsCategories.id, article.categoryId))
      .limit(1);
    category = cat || null;
  }

  return (
    <ArticleContent
      locale={locale}
      isKk={isKk}
      article={article}
      author={author}
      category={category}
    />
  );
}

function ArticleContent({
  locale,
  isKk,
  article,
  author,
  category,
}: {
  locale: string;
  isKk: boolean;
  article: typeof newsArticles.$inferSelect;
  author: { firstName: string; lastName: string } | null;
  category: { nameKk: string; nameRu: string } | null;
}) {
  const t = useTranslations("news");
  const tc = useTranslations("common");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/news">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tc("back")}
        </Link>
      </Button>

      {/* Cover image */}
      {((isKk ? article.coverImageUrlKk : article.coverImageUrlRu) || article.coverImageUrl) && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={((isKk ? article.coverImageUrlKk : article.coverImageUrlRu) || article.coverImageUrl)!}
            alt={isKk ? article.titleKk : article.titleRu}
            className="h-[250px] w-full object-cover md:h-[350px] lg:h-[400px]"
          />
        </div>
      )}

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {category && (
          <Badge variant="secondary">
            {isKk ? category.nameKk : category.nameRu}
          </Badge>
        )}
        {article.isInternal && (
          <Badge variant="destructive">{t("internal")}</Badge>
        )}
        {article.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.publishedAt).toLocaleDateString(
              locale === "kk" ? "kk-KZ" : "ru-RU",
              { year: "numeric", month: "long", day: "numeric" }
            )}
          </span>
        )}
        {author && (
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {author.firstName} {author.lastName}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {article.viewCount + 1}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-8 text-3xl font-bold leading-tight text-[#003DA5] lg:text-4xl">
        {isKk ? article.titleKk : article.titleRu}
      </h1>

      {/* Content */}
      <article
        className="prose prose-lg max-w-none prose-headings:text-[#003DA5] prose-a:text-[#0066CC] prose-p:leading-relaxed"
        lang={isKk ? "kk" : "ru"}
        dangerouslySetInnerHTML={{
          __html: isKk ? article.contentKk : article.contentRu,
        }}
      />
    </div>
  );
}
