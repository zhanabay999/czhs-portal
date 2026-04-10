import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sportsEvents } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { titleKk, titleRu, descriptionKk, descriptionRu, eventType, location, startDate, endDate, coverImageUrl, status } = body;

    if (!titleKk || !titleRu || !eventType || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = slugify(titleRu) + "-" + Date.now();

    await db.insert(sportsEvents).values({
      slug,
      titleKk,
      titleRu,
      descriptionKk: descriptionKk || null,
      descriptionRu: descriptionRu || null,
      eventType,
      location: location || null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      coverImageUrl: coverImageUrl || null,
      status: status || "draft",
    });

    revalidatePath("/ru/sports");
    revalidatePath("/kk/sports");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sports event create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
