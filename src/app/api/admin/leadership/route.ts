import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leaders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const all = await db.select().from(leaders).orderBy(asc(leaders.level), asc(leaders.sortOrder));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nameKk, nameRu, positionKk, positionRu, photoUrl, level, sortOrder, parentId } = body;

    if (!nameKk || !nameRu || !positionKk || !positionRu || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.insert(leaders).values({
      nameKk,
      nameRu,
      positionKk,
      positionRu,
      photoUrl: photoUrl || null,
      level,
      sortOrder: sortOrder || 0,
      parentId: parentId || null,
    });

    revalidatePath("/ru/leadership");
    revalidatePath("/kk/leadership");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leadership create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
