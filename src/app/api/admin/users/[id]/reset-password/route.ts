import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { newPassword } = await req.json();

  if (!newPassword || newPassword.length < 4) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }

  const [user] = await db.select({ id: users.id, employeeId: users.employeeId })
    .from(users).where(eq(users.id, id)).limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const hashed = await hash(newPassword, 12);
  await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, id));

  return NextResponse.json({ success: true });
}
