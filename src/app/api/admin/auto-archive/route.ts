import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsArticles } from "@/db/schema";
import { and, eq, lt } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Архивируем всё, что опубликовано ДО 1-го числа прошлого месяца
  // Пример: 16 апреля → threshold = 1 марта → февраль и старше уходят в архив
  const threshold = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const result = await db
    .update(newsArticles)
    .set({ status: "archived" })
    .where(
      and(
        eq(newsArticles.status, "published"),
        lt(newsArticles.publishedAt, threshold)
      )
    )
    .returning({ id: newsArticles.id });

  return NextResponse.json({ archived: result.length, threshold: threshold.toISOString() });
}
