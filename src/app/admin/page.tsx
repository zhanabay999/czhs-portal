import { db } from "@/db";
import { newsArticles, users, votes } from "@/db/schema";
import { sql } from "drizzle-orm";
import { DashboardClient } from "./DashboardClient";

export default async function AdminDashboard() {
  let stats = { newsCount: 0, usersCount: 0, votesCount: 0 };

  try {
    const [nc] = await db.select({ count: sql<number>`count(*)` }).from(newsArticles);
    const [uc] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [voc] = await db.select({ count: sql<number>`count(*)` }).from(votes);
    stats = {
      newsCount: Number(nc.count),
      usersCount: Number(uc.count),
      votesCount: Number(voc.count),
    };
  } catch {}

  return <DashboardClient stats={stats} />;
}
