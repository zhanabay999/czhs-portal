import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { contests, contestants, votes } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

export async function GET() {
  const session = await auth();

  const [contest] = await db
    .select()
    .from(contests)
    .orderBy(desc(contests.year))
    .limit(1);

  if (!contest) {
    return NextResponse.json({ contest: null, votedFor: null });
  }

  const contestantsList = await db
    .select({
      id: contestants.id,
      fullNameKk: contestants.fullNameKk,
      fullNameRu: contestants.fullNameRu,
      department: contestants.department,
      photoUrl: contestants.photoUrl,
    })
    .from(contestants)
    .where(eq(contestants.contestId, contest.id))
    .orderBy(contestants.sortOrder);

  let votedFor = null;
  if (session?.user?.id) {
    const [vote] = await db
      .select({ contestantId: votes.contestantId })
      .from(votes)
      .where(
        and(
          eq(votes.userId, session.user.id),
          eq(votes.contestId, contest.id)
        )
      )
      .limit(1);
    votedFor = vote?.contestantId || null;
  }

  return NextResponse.json({
    contest: {
      id: contest.id,
      status: contest.status,
      contestants: contestantsList,
    },
    votedFor,
  });
}
