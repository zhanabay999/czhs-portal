"use server";

import { auth } from "@/lib/auth";
import { hasPermission, type UserRole } from "@/lib/permissions";
import { db } from "@/db";
import { newsCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function seedDefaultCategories() {
  const session = await auth();
  if (
    !session?.user?.id ||
    !hasPermission(session.user.role as UserRole, "news:create")
  ) {
    throw new Error("Unauthorized");
  }

  const existing = await db.select().from(newsCategories);
  if (existing.length > 0) return { created: 0 };

  const defaults = [
    {
      slug: "infrastructure",
      nameKk: "Инфрақұрылым",
      nameRu: "Инфраструктура",
      sortOrder: 1,
    },
    {
      slug: "social",
      nameKk: "Әлеуметтік сала",
      nameRu: "Социум",
      sortOrder: 2,
    },
    {
      slug: "hr",
      nameKk: "Кадрлар",
      nameRu: "Кадры / КТЖ в лицах",
      sortOrder: 3,
    },
    {
      slug: "sports-culture",
      nameKk: "Спорт және мәдениет",
      nameRu: "Спорт и культура",
      sortOrder: 4,
    },
    {
      slug: "regions",
      nameKk: "Аймақтар",
      nameRu: "Регионы",
      sortOrder: 5,
    },
    {
      slug: "announcements",
      nameKk: "Хабарландырулар",
      nameRu: "Объявления",
      sortOrder: 6,
    },
    {
      slug: "interview",
      nameKk: "Сұхбат",
      nameRu: "Интервью",
      sortOrder: 7,
    },
    {
      slug: "safety",
      nameKk: "Еңбекті қорғау",
      nameRu: "Охрана труда",
      sortOrder: 8,
    },
  ];

  await db.insert(newsCategories).values(defaults);
  revalidatePath("/admin/news");
  return { created: defaults.length };
}

export async function getCategories() {
  return db.select().from(newsCategories).orderBy(newsCategories.sortOrder);
}
