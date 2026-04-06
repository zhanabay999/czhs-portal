import { db } from "@/db";
import { newsCategories, tags } from "@/db/schema";
import { NewNewsClient } from "./NewNewsClient";

export default async function NewNewsPage() {
  let categories: Array<{
    id: string;
    slug: string;
    nameKk: string;
    nameRu: string;
  }> = [];
  let allTags: string[] = [];

  try {
    [categories, allTags] = await Promise.all([
      db.select().from(newsCategories).orderBy(newsCategories.sortOrder),
      db.select({ name: tags.nameRu }).from(tags).then((rows) => rows.map((r) => r.name)),
    ]);
  } catch {}

  return (
    <NewNewsClient
      categories={JSON.parse(JSON.stringify(categories))}
      allTags={allTags}
    />
  );
}
