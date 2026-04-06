import { db } from "@/db";
import { newsArticles, newsCategories, tags, tagsOnNews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditNewsClient } from "./EditNewsClient";

type Props = { params: Promise<{ id: string }> };

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;

  const [article] = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.id, id))
    .limit(1);

  if (!article) notFound();

  const [categories, tagRows, allTagRows] = await Promise.all([
    db.select().from(newsCategories).orderBy(newsCategories.sortOrder),
    db
      .select({ name: tags.nameRu })
      .from(tagsOnNews)
      .innerJoin(tags, eq(tagsOnNews.tagId, tags.id))
      .where(eq(tagsOnNews.articleId, id)),
    db.select({ name: tags.nameRu }).from(tags),
  ]);

  const articleTags = tagRows.map((r) => r.name);
  const allTags = allTagRows.map((r) => r.name);

  return (
    <EditNewsClient
      article={JSON.parse(JSON.stringify(article))}
      categories={JSON.parse(JSON.stringify(categories))}
      initialTags={articleTags}
      allTags={allTags}
    />
  );
}
