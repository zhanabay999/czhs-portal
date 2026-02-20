import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission, type UserRole } from "@/lib/permissions";
import { db } from "@/db";
import { faqItems } from "@/db/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !hasPermission(session.user.role as UserRole, "faq:create")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  await db.insert(faqItems).values({
    questionKk: data.questionKk,
    questionRu: data.questionRu,
    answerKk: data.answerKk,
    answerRu: data.answerRu,
    status: data.status || "draft",
  });

  return NextResponse.json({ success: true });
}
