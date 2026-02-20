import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // Create super admin
  const hashedPassword = await hash("1111", 12);
  await db.insert(schema.users).values({
    email: "admin@czhs.kz",
    employeeId: "001",
    password: hashedPassword,
    firstName: "Админ",
    lastName: "Бас",
    patronymic: null,
    role: "super_admin",
    department: "IT бөлімі",
    position: "Жүйе әкімшісі",
    isActive: true,
    preferredLang: "kk",
  }).onConflictDoNothing();

  // Create test employee
  await db.insert(schema.users).values({
    email: "employee@czhs.kz",
    employeeId: "100",
    password: hashedPassword,
    firstName: "Айбек",
    lastName: "Қасымов",
    role: "employee",
    department: "Жол шаруашылығы",
    position: "Инженер",
    isActive: true,
    preferredLang: "kk",
  }).onConflictDoNothing();

  // Create content manager
  await db.insert(schema.users).values({
    email: "content@czhs.kz",
    employeeId: "050",
    password: hashedPassword,
    firstName: "Динара",
    lastName: "Нұрланова",
    role: "content_manager",
    department: "PR бөлімі",
    position: "Мазмұн менеджері",
    isActive: true,
    preferredLang: "ru",
  }).onConflictDoNothing();

  // News categories
  await db.insert(schema.newsCategories).values([
    { slug: "general", nameKk: "Жалпы", nameRu: "Общее", sortOrder: 1 },
    { slug: "events", nameKk: "Іс-шаралар", nameRu: "Мероприятия", sortOrder: 2 },
    { slug: "achievements", nameKk: "Жетістіктер", nameRu: "Достижения", sortOrder: 3 },
    { slug: "corporate", nameKk: "Корпоративтік", nameRu: "Корпоративное", sortOrder: 4 },
  ]).onConflictDoNothing();

  // FAQ categories
  await db.insert(schema.faqCategories).values([
    { nameKk: "НЖС мәселелері", nameRu: "Вопросы НЖС", sortOrder: 1 },
    { nameKk: "НОД мәселелері", nameRu: "Вопросы НОД", sortOrder: 2 },
    { nameKk: "Жалпы сұрақтар", nameRu: "Общие вопросы", sortOrder: 3 },
  ]).onConflictDoNothing();

  // Update all existing user passwords to "1111"
  const { eq } = await import("drizzle-orm");
  await db.update(schema.users).set({ password: hashedPassword });

  // Sample news (get admin user id)
  const [admin] = await db.select().from(schema.users).where(eq(schema.users.email, "admin@czhs.kz")).limit(1);

  if (admin) {
    await db.insert(schema.newsArticles).values([
      {
        slug: "czhs-portal-launch-2026",
        titleKk: "ЦЖС ақпараттық порталы іске қосылды",
        titleRu: "Запущен информационный портал ЦЖС",
        excerptKk: "Магистральдық желі дирекциясының жаңа корпоративтік порталы жұмысын бастады",
        excerptRu: "Новый корпоративный портал Дирекции магистральной сети начал свою работу",
        contentKk: "<p>Құрметті әріптестер! Магистральдық желі дирекциясының жаңа ақпараттық порталы іске қосылды. Порталда сіз жаңалықтар, вакансиялар, санаторлық-курорттық сауықтыру, жазғы лагерь және басқа да ақпараттарды таба аласыз.</p><p>Портал қазақ және орыс тілдерінде жұмыс істейді.</p>",
        contentRu: "<p>Уважаемые коллеги! Запущен новый информационный портал Дирекции магистральной сети. На портале вы сможете найти новости, вакансии, информацию о санаторно-курортном оздоровлении, летнем лагере и многое другое.</p><p>Портал работает на казахском и русском языках.</p>",
        status: "published",
        isPinned: true,
        publishedAt: new Date(),
        authorId: admin.id,
      },
      {
        slug: "sports-tournament-2026",
        titleKk: "ЦЖС арасындағы спорт жарыстары",
        titleRu: "Спортивные соревнования среди ЦЖС",
        excerptKk: "Жыл сайынғы спорт жарыстарына тіркелу басталды",
        excerptRu: "Началась регистрация на ежегодные спортивные соревнования",
        contentKk: "<p>ЦЖС спорт комитеті жыл сайынғы спорт жарыстарын ұйымдастырады. Барлық қызметкерлер қатыса алады.</p>",
        contentRu: "<p>Спортивный комитет ЦЖС организует ежегодные спортивные соревнования. Все сотрудники могут принять участие.</p>",
        status: "published",
        publishedAt: new Date(Date.now() - 86400000),
        authorId: admin.id,
      },
    ]).onConflictDoNothing();
  }

  console.log("Seed completed!");
}

seed().catch(console.error);
