import { db } from "@/db";
import { contests, contestants, votes, contestBlocks } from "@/db/schema";
import { desc, eq, sql, asc } from "drizzle-orm";
import { ContestClient } from "./ContestClient";
import { ContestBlocksSection } from "./ContestBlocksSection";

export default async function AdminContestPage() {
  let contestList: Array<{
    id: string;
    titleKk: string;
    titleRu: string;
    status: string;
    year: number;
    contestantsCount: number;
    votesCount: number;
  }> = [];

  let blocks: typeof contestBlocks.$inferSelect[] = [];

  try {
    const raw = await db.select().from(contests).orderBy(desc(contests.year));
    for (const c of raw) {
      const [cc] = await db.select({ count: sql<number>`count(*)` }).from(contestants).where(eq(contestants.contestId, c.id));
      const [vc] = await db.select({ count: sql<number>`count(*)` }).from(votes).where(eq(votes.contestId, c.id));
      contestList.push({
        id: c.id,
        titleKk: c.titleKk,
        titleRu: c.titleRu,
        status: c.status,
        year: c.year,
        contestantsCount: Number(cc.count),
        votesCount: Number(vc.count),
      });
    }
    blocks = await db.select().from(contestBlocks).orderBy(asc(contestBlocks.sortOrder));
  } catch {}

  return (
    <div>
      <ContestBlocksSection initialBlocks={JSON.parse(JSON.stringify(blocks))} />
      <ContestClient contests={contestList} />
    </div>
  );
}
