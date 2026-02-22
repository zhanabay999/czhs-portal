import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { desc } from "drizzle-orm";
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
    publishedAt: Date | null;
    createdAt: Date;
  }> = [];

  try {
    articles = await db
      .select({
        id: newsArticles.id,
        slug: newsArticles.slug,
        titleKk: newsArticles.titleKk,
        titleRu: newsArticles.titleRu,
        status: newsArticles.status,
        isPinned: newsArticles.isPinned,
        isInternal: newsArticles.isInternal,
        viewCount: newsArticles.viewCount,
        publishedAt: newsArticles.publishedAt,
        createdAt: newsArticles.createdAt,
      })
      .from(newsArticles)
      .orderBy(desc(newsArticles.createdAt));
  } catch {}

  return <NewsListClient articles={JSON.parse(JSON.stringify(articles))} />;
}
