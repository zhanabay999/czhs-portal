"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveUser(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  await db
    .update(users)
    .set({ isApproved: true })
    .where(eq(users.id, userId));

  revalidatePath("/admin/users");
}

export async function rejectUser(userId: string) {
  const session = await auth();
  if (session?.user?.role !== "super_admin") {
    throw new Error("Unauthorized");
  }

  await db.delete(users).where(eq(users.id, userId));

  revalidatePath("/admin/users");
}
