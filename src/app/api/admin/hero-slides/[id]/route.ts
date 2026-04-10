import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    await db.update(heroSlides).set(body).where(eq(heroSlides.id, id));
    revalidatePath("/ru");
    revalidatePath("/kk");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    revalidatePath("/ru");
    revalidatePath("/kk");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
