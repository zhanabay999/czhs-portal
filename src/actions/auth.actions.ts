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
