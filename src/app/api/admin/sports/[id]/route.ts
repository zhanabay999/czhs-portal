import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sportsEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(sportsEvents).where(eq(sportsEvents.id, id));
    revalidatePath("/ru/sports");
    revalidatePath("/kk/sports");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sports event delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    await db.update(sportsEvents).set({
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      updatedAt: new Date(),
    }).where(eq(sportsEvents.id, id));
    revalidatePath("/ru/sports");
    revalidatePath("/kk/sports");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sports event update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
