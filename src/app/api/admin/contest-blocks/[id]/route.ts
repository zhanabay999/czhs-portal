import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contestBlocks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { eq } from "drizzle-orm";
import type { UserRole } from "@/lib/permissions";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "contest:update")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const { titleKk, titleRu, imageUrl, linkUrl, linkLabel, isActive, sortOrder } = body;

    await db.update(contestBlocks).set({
      ...(titleKk !== undefined && { titleKk }),
      ...(titleRu !== undefined && { titleRu }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(linkUrl !== undefined && { linkUrl: linkUrl || null }),
      ...(linkLabel !== undefined && { linkLabel: linkLabel || null }),
      ...(isActive !== undefined && { isActive }),
      ...(sortOrder !== undefined && { sortOrder }),
    }).where(eq(contestBlocks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "contest:delete")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await db.delete(contestBlocks).where(eq(contestBlocks.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
