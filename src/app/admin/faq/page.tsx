import { db } from "@/db";
import { faqItems } from "@/db/schema";
import { FAQListClient } from "./FAQListClient";

export default async function AdminFAQPage() {
  let items: Array<{ id: string; questionKk: string; questionRu: string; status: string }> = [];
  try {
    const raw = await db.select().from(faqItems).orderBy(faqItems.sortOrder);
    items = raw.map(i => ({ id: i.id, questionKk: i.questionKk, questionRu: i.questionRu, status: i.status }));
  } catch {}

  return <FAQListClient items={items} />;
}
