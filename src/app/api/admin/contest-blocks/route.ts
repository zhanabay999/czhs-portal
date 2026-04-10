import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contestBlocks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { asc } from "drizzle-orm";
import type { UserRole } from "@/lib/permissions";

export async function GET() {
  try {
    const blocks = await db.select().from(contestBlocks).orderBy(asc(contestBlocks.sortOrder));
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "contest:create")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { titleKk, titleRu, imageUrl, linkUrl, linkLabel } = await req.json();
    if (!titleKk || !titleRu || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [maxOrder] = await db.select({ sortOrder: contestBlocks.sortOrder }).from(contestBlocks).orderBy(contestBlocks.sortOrder);
    const nextOrder = maxOrder ? maxOrder.sortOrder + 1 : 0;

    const [block] = await db.insert(contestBlocks).values({
      titleKk,
      titleRu,
      imageUrl,
      linkUrl: linkUrl || null,
      linkLabel: linkLabel || null,
      sortOrder: nextOrder,
    }).returning();

    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
