"use server";

import { auth } from "@/lib/auth";
import { hasPermission, type UserRole } from "@/lib/permissions";
import { db } from "@/db";
import { newsArticles, newsCategories, tags as tagsTable, tagsOnNews } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
  const cyrMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'ә': 'a', 'ғ': 'g', 'қ': 'q', 'ң': 'n', 'ө': 'o', 'ұ': 'u',
    'ү': 'u', 'һ': 'h', 'і': 'i',
  };
  const transliterated = title
    .toLowerCase()
    .split('')
    .map(ch => cyrMap[ch] || ch)
    .join('');
  return transliterated
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200) + '-' + Date.now().toString(36);
}

async function syncTags(articleId: string, tagNames: string[]) {
  // Remove existing tags for this article
  await db.delete(tagsOnNews).where(eq(tagsOnNews.articleId, articleId));

  if (tagNames.length === 0) return;

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/[^a-zа-яәғқңөұүһі0-9]/g, '-').replace(/-+/g, '-');

    // Find or create tag
    let [tag] = await db.select().from(tagsTable).where(eq(tagsTable.slug, slug)).limit(1);
    if (!tag) {
      [tag] = await db.insert(tagsTable).values({
        nameKk: name,
        nameRu: name,
        slug,
      }).returning();
    }

    // Link tag to article
    await db.insert(tagsOnNews).values({
      articleId,
      tagId: tag.id,
    }).onConflictDoNothing();
  }
}

export async function createNewsArticle(data: {
  titleKk: string;
  titleRu: string;
  excerptKk?: string;
  excerptRu?: string;
  contentKk: string;
  contentRu: string;
  coverImageUrl?: string;
  coverImageUrlKk?: string;
  coverImageUrlRu?: string;
  categoryId?: string;
  status: "draft" | "published";
  isInternal?: boolean;
  isPinned?: boolean;
  tags?: string[];
  scheduledAt?: string;
}) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "news:create")) {
    throw new Error("Unauthorized");
  }

  const slug = generateSlug(data.titleRu || data.titleKk);

  const publishedAt = data.status === "published"
    ? new Date()
    : data.scheduledAt
      ? new Date(data.scheduledAt)
      : null;

  const [article] = await db.insert(newsArticles).values({
    slug,
    titleKk: data.titleKk,
    titleRu: data.titleRu,
    excerptKk: data.excerptKk || null,
    excerptRu: data.excerptRu || null,
    contentKk: data.contentKk,
    contentRu: data.contentRu,
    coverImageUrl: data.coverImageUrl || null,
    coverImageUrlKk: data.coverImageUrlKk || null,
    coverImageUrlRu: data.coverImageUrlRu || null,
    categoryId: data.categoryId || null,
    authorId: session.user.id,
    status: data.status,
    isInternal: data.isInternal || false,
    isPinned: data.isPinned || false,
    publishedAt,
  }).returning();

  // Sync tags
  if (data.tags && data.tags.length > 0 && article) {
    await syncTags(article.id, data.tags);
  }

  revalidatePath("/admin/news");
  revalidatePath("/kk/news");
  revalidatePath("/ru/news");
  revalidatePath("/kk");
  revalidatePath("/ru");
}

export async function updateNewsArticle(
  id: string,
  data: {
    titleKk: string;
    titleRu: string;
    excerptKk?: string;
    excerptRu?: string;
    contentKk: string;
    contentRu: string;
    coverImageUrl?: string;
    coverImageUrlKk?: string;
    coverImageUrlRu?: string;
    categoryId?: string;
    status: "draft" | "published" | "archived";
    isInternal?: boolean;
    isPinned?: boolean;
    tags?: string[];
    scheduledAt?: string;
  }
) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "news:update")) {
    throw new Error("Unauthorized");
  }

  const [existing] = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
  if (!existing) throw new Error("Not found");

  const publishedAt =
    data.status === "published" && !existing.publishedAt
      ? new Date()
      : data.scheduledAt
        ? new Date(data.scheduledAt)
        : existing.publishedAt;

  await db
    .update(newsArticles)
    .set({
      titleKk: data.titleKk,
      titleRu: data.titleRu,
      excerptKk: data.excerptKk || null,
      excerptRu: data.excerptRu || null,
      contentKk: data.contentKk,
      contentRu: data.contentRu,
      coverImageUrl: data.coverImageUrl || null,
      coverImageUrlKk: data.coverImageUrlKk || null,
      coverImageUrlRu: data.coverImageUrlRu || null,
      categoryId: data.categoryId || null,
      status: data.status,
      isInternal: data.isInternal || false,
      isPinned: data.isPinned || false,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(newsArticles.id, id));

  // Sync tags
  if (data.tags) {
    await syncTags(id, data.tags);
  }

  revalidatePath("/admin/news");
  revalidatePath("/kk/news");
  revalidatePath("/ru/news");
  revalidatePath(`/kk/news/${existing.slug}`);
  revalidatePath(`/ru/news/${existing.slug}`);
  revalidatePath("/kk");
  revalidatePath("/ru");
}

export async function deleteNewsArticle(id: string) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "news:delete")) {
    throw new Error("Unauthorized");
  }

  await db.update(newsArticles).set({ status: "archived" }).where(eq(newsArticles.id, id));

  revalidatePath("/admin/news");
  revalidatePath("/kk/news");
  revalidatePath("/ru/news");
}

export async function getNewsArticles() {
  return db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt));
}

export async function getNewsArticleById(id: string) {
  const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
  return article || null;
}

export async function getCategories() {
  return db.select().from(newsCategories).orderBy(newsCategories.sortOrder);
}

export async function getArticleTags(articleId: string): Promise<string[]> {
  const rows = await db
    .select({ name: tagsTable.nameRu })
    .from(tagsOnNews)
    .innerJoin(tagsTable, eq(tagsOnNews.tagId, tagsTable.id))
    .where(eq(tagsOnNews.articleId, articleId));
  return rows.map((r) => r.name);
}
