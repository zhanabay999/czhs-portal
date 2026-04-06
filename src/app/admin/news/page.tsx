import { db } from "@/db";
import { newsArticles, newsCategories } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NewsListClient } from "./NewsListClient";

export default async function AdminNewsPage() {
  let articles: Array<{
    id: string;
    slug: string;
    titleKk: string;
    titleRu: string;
    status: string;
    isPinned: boolean;
    isInternal: boolean;
    viewCount: number;
    categoryName: string | null;
    publishedAt: Date | null;
    createdAt: Date;
  }> = [];

  try {
    const raw = await db
      .select({
        id: newsArticles.id,
        slug: newsArticles.slug,
        titleKk: newsArticles.titleKk,
        titleRu: newsArticles.titleRu,
        status: newsArticles.status,
        isPinned: newsArticles.isPinned,
        isInternal: newsArticles.isInternal,
        viewCount: newsArticles.viewCount,
        categoryId: newsArticles.categoryId,
        publishedAt: newsArticles.publishedAt,
        createdAt: newsArticles.createdAt,
      })
      .from(newsArticles)
      .orderBy(desc(newsArticles.createdAt));

    const categories = await db.select().from(newsCategories);
    const catMap = new Map(categories.map((c) => [c.id, c.nameRu]));

    articles = raw.map((a) => ({
      ...a,
      categoryName: a.categoryId ? catMap.get(a.categoryId) || null : null,
    }));
  } catch {}

  return <NewsListClient articles={JSON.parse(JSON.stringify(articles))} />;
}
