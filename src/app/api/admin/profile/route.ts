import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { lastName, firstName, patronymic, phone, email, department, position } = body;

    await db.update(users).set({
      lastName: lastName || undefined,
      firstName: firstName || undefined,
      patronymic: patronymic || null,
      phone: phone || null,
      email: email || null,
      department: department || null,
      position: position || null,
      updatedAt: new Date(),
    }).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
