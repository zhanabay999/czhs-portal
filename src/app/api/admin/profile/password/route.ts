import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Минимум 6 символов" }, { status: 400 });
    }

    const [user] = await db.select({ password: users.password }).from(users).where(eq(users.id, session.user.id));
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hash, updatedAt: new Date() }).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
