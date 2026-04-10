import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { auth } from "@/lib/auth";
import { asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { imageUrl, sortOrder } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });

    await db.insert(heroSlides).values({
      imageUrl,
      sortOrder: sortOrder || 0,
    });
    revalidatePath("/ru");
    revalidatePath("/kk");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
