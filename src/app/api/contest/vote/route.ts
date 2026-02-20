import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { contests, votes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contestId, contestantId } = await req.json();
  if (!contestId || !contestantId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check contest is in voting status
  const [contest] = await db
    .select()
    .from(contests)
    .where(eq(contests.id, contestId))
    .limit(1);

  if (!contest || contest.status !== "voting") {
    return NextResponse.json({ error: "Voting not active" }, { status: 400 });
  }

  // Check if already voted
  const [existing] = await db
    .select()
    .from(votes)
    .where(
      and(eq(votes.userId, session.user.id), eq(votes.contestId, contestId))
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: "Already voted" }, { status: 400 });
  }

  await db.insert(votes).values({
    userId: session.user.id,
    contestId,
    contestantId,
  });

  return NextResponse.json({ success: true });
}
