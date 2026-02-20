import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { faqCategories, faqItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  let categories: Array<typeof faqCategories.$inferSelect> = [];
  let items: Array<typeof faqItems.$inferSelect> = [];

  try {
    categories = await db.select().from(faqCategories).orderBy(faqCategories.sortOrder);
    items = await db.select().from(faqItems).where(eq(faqItems.status, "published")).orderBy(faqItems.sortOrder);
  } catch {}

  return <FAQContent locale={locale} isKk={isKk} categories={categories} items={items} />;
}

function FAQContent({ locale, isKk, categories, items }: {
  locale: string; isKk: boolean;
  categories: Array<typeof faqCategories.$inferSelect>;
  items: Array<typeof faqItems.$inferSelect>;
}) {
  const t = useTranslations("faq");

  const groupedItems = categories.map((cat) => ({
    ...cat,
    items: items.filter((item) => item.categoryId === cat.id),
  }));
  const uncategorized = items.filter((item) => !item.categoryId);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-[#003DA5]">{t("title")}</h1>
        <div className="h-1 w-20 rounded bg-[#C8A951]" />
      </div>

      {items.length > 0 ? (
        <div className="space-y-8">
          {groupedItems.map((group) =>
            group.items.length > 0 ? (
              <section key={group.id}>
                <h2 className="mb-4 text-xl font-bold text-[#003DA5]">
                  {isKk ? group.nameKk : group.nameRu}
                </h2>
                <Accordion type="multiple" className="space-y-2">
                  {group.items.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="rounded-lg border px-4">
                      <AccordionTrigger className="text-left font-medium hover:text-[#003DA5]">
                        {isKk ? item.questionKk : item.questionRu}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: isKk ? item.answerKk : item.answerRu }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ) : null
          )}

          {uncategorized.length > 0 && (
            <Accordion type="multiple" className="space-y-2">
              {uncategorized.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="rounded-lg border px-4">
                  <AccordionTrigger className="text-left font-medium hover:text-[#003DA5]">
                    {isKk ? item.questionKk : item.questionRu}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: isKk ? item.answerKk : item.answerRu }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{isKk ? "Сұрақтар жақында қосылады" : "Вопросы скоро появятся"}</p>
        </div>
      )}
    </div>
  );
}
