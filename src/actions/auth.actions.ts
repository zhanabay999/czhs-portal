"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function registerUser(data: {
  lastName: string;
  firstName: string;
  patronymic?: string;
  employeeId: string;
  password: string;
}) {
  // Validate required fields
  if (!data.lastName.trim() || !data.firstName.trim() || !data.employeeId.trim() || !data.password.trim()) {
    return { error: "required" };
  }

  // Validate employee ID format (1-7 digits)
  if (!/^\d{1,7}$/.test(data.employeeId)) {
    return { error: "invalidEmployeeId" };
  }

  // Check password length
  if (data.password.length < 4) {
    return { error: "passwordTooShort" };
  }

  // Check if employee ID already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.employeeId, data.employeeId))
    .limit(1);

  if (existing) {
    return { error: "employeeIdTaken" };
  }

  // Hash password
  const hashedPassword = await hash(data.password, 12);

  // Create user with isApproved = false
  await db.insert(users).values({
    email: `${data.employeeId}@czhs.kz`,
    employeeId: data.employeeId,
    password: hashedPassword,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    patronymic: data.patronymic?.trim() || null,
    role: "employee",
    isActive: true,
    isApproved: false,
  });

  return { success: true };
}

export async function changePassword(data: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  if (!data.currentPassword.trim() || !data.newPassword.trim()) {
    return { error: "required" };
  }

  if (data.newPassword.length < 4) {
    return { error: "passwordTooShort" };
  }

  const [user] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.id, data.userId))
    .limit(1);

  if (!user) {
    return { error: "userNotFound" };
  }

  const { compare } = await import("bcryptjs");
  const isValid = await compare(data.currentPassword, user.password);
  if (!isValid) {
    return { error: "wrongPassword" };
  }

  const hashedPassword = await hash(data.newPassword, 12);
  await db
    .update(users)
    .set({ password: hashedPassword, updatedAt: new Date() })
    .where(eq(users.id, data.userId));

  return { success: true };
}
