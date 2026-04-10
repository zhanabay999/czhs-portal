import {
  pgTable,
  pgEnum,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
  index,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "content_manager",
  "hr_manager",
  "contest_manager",
  "sports_manager",
  "moderator",
  "news_moderator",
  "social_admin",
  "employee",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

export const contestStatusEnum = pgEnum("contest_status", [
  "upcoming",
  "nominations",
  "voting",
  "closed",
]);

export const vacancyTypeEnum = pgEnum("vacancy_type", [
  "internal",
  "external",
]);

export const eventTypeEnum = pgEnum("event_type", [
  "football",
  "volleyball",
  "basketball",
  "table_tennis",
  "chess",
  "track_and_field",
  "swimming",
  "other",
]);

export const languageEnum = pgEnum("language", ["kk", "ru"]);

// ============================================================
// USERS & AUTH
// ============================================================

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    employeeId: varchar("employee_id", { length: 50 }).unique(),
    password: text("password").notNull(),
    passwordAlt: text("password_alt"),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    patronymic: varchar("patronymic", { length: 100 }),
    role: userRoleEnum("role").default("employee").notNull(),
    department: varchar("department", { length: 255 }),
    position: varchar("position", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").default(true).notNull(),
    isApproved: boolean("is_approved").default(false).notNull(),
    preferredLang: languageEnum("preferred_lang").default("kk").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
  },
  (table) => [index("users_email_idx").on(table.email)]
);

export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

// ============================================================
// NEWS
// ============================================================

export const newsCategories = pgTable("news_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameKk: varchar("name_kk", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsArticles = pgTable(
  "news_articles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: varchar("slug", { length: 300 }).notNull().unique(),
    titleKk: text("title_kk").notNull(),
    titleRu: text("title_ru").notNull(),
    excerptKk: text("excerpt_kk"),
    excerptRu: text("excerpt_ru"),
    contentKk: text("content_kk").notNull(),
    contentRu: text("content_ru").notNull(),
    coverImageUrl: text("cover_image_url"),
    coverImageUrlKk: text("cover_image_url_kk"),
    coverImageUrlRu: text("cover_image_url_ru"),
    status: contentStatusEnum("status").default("draft").notNull(),
    isInternal: boolean("is_internal").default(false).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    categoryId: text("category_id").references(() => newsCategories.id),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("news_status_published_idx").on(table.status, table.publishedAt),
    index("news_category_idx").on(table.categoryId),
  ]
);

export const newsImages = pgTable("news_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  altTextKk: text("alt_text_kk"),
  altTextRu: text("alt_text_ru"),
  sortOrder: integer("sort_order").default(0).notNull(),
  articleId: text("article_id")
    .notNull()
    .references(() => newsArticles.id, { onDelete: "cascade" }),
});

export const tags = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nameKk: varchar("name_kk", { length: 100 }).notNull(),
  nameRu: varchar("name_ru", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const tagsOnNews = pgTable(
  "tags_on_news",
  {
    articleId: text("article_id")
      .notNull()
      .references(() => newsArticles.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.tagId] })]
);

// ============================================================
// SANATORIUM
// ============================================================

export const sanatoriumPages = pgTable("sanatorium_pages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titleKk: text("title_kk").notNull(),
  titleRu: text("title_ru").notNull(),
  contentKk: text("content_kk").notNull(),
  contentRu: text("content_ru").notNull(),
  coverImageUrl: text("cover_image_url"),
  status: contentStatusEnum("status").default("draft").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sanatoriumPrograms = pgTable("sanatorium_programs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nameKk: varchar("name_kk", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  descKk: text("desc_kk").notNull(),
  descRu: text("desc_ru").notNull(),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  pageId: text("page_id")
    .notNull()
    .references(() => sanatoriumPages.id, { onDelete: "cascade" }),
});

export const sanatoriumDocuments = pgTable("sanatorium_documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titleKk: varchar("title_kk", { length: 255 }).notNull(),
  titleRu: varchar("title_ru", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  pageId: text("page_id")
    .notNull()
    .references(() => sanatoriumPages.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// VACANCIES
// ============================================================

export const vacancies = pgTable(
  "vacancies",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    titleKk: text("title_kk").notNull(),
    titleRu: text("title_ru").notNull(),
    descriptionKk: text("description_kk"),
    descriptionRu: text("description_ru"),
    department: varchar("department", { length: 255 }),
    location: varchar("location", { length: 255 }),
    salaryRange: varchar("salary_range", { length: 100 }),
    type: vacancyTypeEnum("type").default("internal").notNull(),
    externalUrl: text("external_url"),
    status: contentStatusEnum("status").default("draft").notNull(),
    closingDate: timestamp("closing_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("vacancies_status_closing_idx").on(table.status, table.closingDate),
  ]
);

// ============================================================
// SUMMER CAMP
// ============================================================

export const summerCampPages = pgTable("summer_camp_pages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titleKk: text("title_kk").notNull(),
  titleRu: text("title_ru").notNull(),
  contentKk: text("content_kk").notNull(),
  contentRu: text("content_ru").notNull(),
  year: integer("year").notNull(),
  coverImageUrl: text("cover_image_url"),
  status: contentStatusEnum("status").default("draft").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campSessions = pgTable("camp_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nameKk: varchar("name_kk", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  capacity: integer("capacity"),
  location: varchar("location", { length: 255 }),
  descKk: text("desc_kk"),
  descRu: text("desc_ru"),
  pageId: text("page_id")
    .notNull()
    .references(() => summerCampPages.id, { onDelete: "cascade" }),
});

export const campGalleryImages = pgTable("camp_gallery_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  captionKk: text("caption_kk"),
  captionRu: text("caption_ru"),
  sortOrder: integer("sort_order").default(0).notNull(),
  pageId: text("page_id")
    .notNull()
    .references(() => summerCampPages.id, { onDelete: "cascade" }),
});

export const campDocuments = pgTable("camp_documents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titleKk: varchar("title_kk", { length: 255 }).notNull(),
  titleRu: varchar("title_ru", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  pageId: text("page_id")
    .notNull()
    .references(() => summerCampPages.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// FAQ
// ============================================================

export const faqCategories = pgTable("faq_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nameKk: varchar("name_kk", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const faqItems = pgTable(
  "faq_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    questionKk: text("question_kk").notNull(),
    questionRu: text("question_ru").notNull(),
    answerKk: text("answer_kk").notNull(),
    answerRu: text("answer_ru").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    status: contentStatusEnum("status").default("draft").notNull(),
    categoryId: text("category_id").references(() => faqCategories.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("faq_category_idx").on(table.categoryId)]
);

// ============================================================
// BEAUTY CONTEST (ЦЖС-Аруы)
// ============================================================

export const contests = pgTable("contests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titleKk: text("title_kk").notNull(),
  titleRu: text("title_ru").notNull(),
  descriptionKk: text("description_kk"),
  descriptionRu: text("description_ru"),
  rulesKk: text("rules_kk"),
  rulesRu: text("rules_ru"),
  coverImageUrl: text("cover_image_url"),
  year: integer("year").notNull(),
  status: contestStatusEnum("status").default("upcoming").notNull(),
  votingStartAt: timestamp("voting_start_at"),
  votingEndAt: timestamp("voting_end_at"),
  maxVotesPerUser: integer("max_votes_per_user").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contestants = pgTable("contestants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fullNameKk: varchar("full_name_kk", { length: 255 }).notNull(),
  fullNameRu: varchar("full_name_ru", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  bioKk: text("bio_kk"),
  bioRu: text("bio_ru"),
  photoUrl: text("photo_url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  contestId: text("contest_id")
    .notNull()
    .references(() => contests.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const votes = pgTable(
  "votes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    contestId: text("contest_id")
      .notNull()
      .references(() => contests.id),
    contestantId: text("contestant_id")
      .notNull()
      .references(() => contestants.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("votes_user_contest_idx").on(table.userId, table.contestId),
  ]
);

// ============================================================
// SPORTS COMMITTEE
// ============================================================

export const sportsEvents = pgTable(
  "sports_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    slug: varchar("slug", { length: 300 }).notNull().unique(),
    titleKk: text("title_kk").notNull(),
    titleRu: text("title_ru").notNull(),
    descriptionKk: text("description_kk"),
    descriptionRu: text("description_ru"),
    eventType: eventTypeEnum("event_type").notNull(),
    location: varchar("location", { length: 255 }),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    coverImageUrl: text("cover_image_url"),
    status: contentStatusEnum("status").default("draft").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("sports_status_date_idx").on(table.status, table.startDate),
  ]
);

export const sportsResults = pgTable("sports_results", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("event_id")
    .notNull()
    .references(() => sportsEvents.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  teamOrPlayerKk: text("team_or_player_kk").notNull(),
  teamOrPlayerRu: text("team_or_player_ru").notNull(),
  score: varchar("score", { length: 50 }),
  notes: text("notes"),
});

export const sportsGalleryImages = pgTable("sports_gallery_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  captionKk: text("caption_kk"),
  captionRu: text("caption_ru"),
  sortOrder: integer("sort_order").default(0).notNull(),
  eventId: text("event_id")
    .notNull()
    .references(() => sportsEvents.id, { onDelete: "cascade" }),
});

// ============================================================
// PATRONAGE (Жылы жүрекпен)
// ============================================================

export const patronageBranches = pgTable("patronage_branches", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: varchar("code", { length: 50 }).notNull().unique(),
  nameKk: varchar("name_kk", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  childrenCount: integer("children_count").default(0).notNull(),
  curators: jsonb("curators").$type<Array<{ name: string; position: string }>>().default([]).notNull(),
  subBranchNameKk: varchar("sub_branch_name_kk", { length: 255 }),
  subBranchNameRu: varchar("sub_branch_name_ru", { length: 255 }),
  subBranchChildrenCount: integer("sub_branch_children_count"),
  subBranchCurators: jsonb("sub_branch_curators").$type<Array<{ name: string; position: string }>>(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PatronageBranch = typeof patronageBranches.$inferSelect;

// ============================================================
// SPORTS APPLICATIONS
// ============================================================

export const sportsApplications = pgTable("sports_applications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  patronymic: varchar("patronymic", { length: 255 }),
  employeeId: varchar("employee_id", { length: 50 }),
  branch: varchar("branch", { length: 255 }).notNull(),
  sportType: varchar("sport_type", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// HERO SLIDES (КАРУСЕЛЬ)
// ============================================================

export const heroSlides = pgTable("hero_slides", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================
// LEADERSHIP (РУКОВОДСТВО)
// ============================================================

export const leaders = pgTable("leaders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nameKk: varchar("name_kk", { length: 255 }).notNull(),
  nameRu: varchar("name_ru", { length: 255 }).notNull(),
  positionKk: text("position_kk").notNull(),
  positionRu: text("position_ru").notNull(),
  photoUrl: text("photo_url"),
  photoPosition: text("photo_position").default("50% 20%"),
  level: integer("level").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  parentId: text("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Leader = typeof leaders.$inferSelect;

// ============================================================
// CONTEST BLOCKS (Конкурс блоктары)
// ============================================================

export const contestBlocks = pgTable("contest_blocks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  titleKk: varchar("title_kk", { length: 255 }).notNull(),
  titleRu: varchar("title_ru", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  linkLabel: varchar("link_label", { length: 100 }),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContestBlock = typeof contestBlocks.$inferSelect;

// ============================================================
// SYSTEM
// ============================================================

export const siteSettings = pgTable("site_settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 20 }).default("text").notNull(),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    entity: varchar("entity", { length: 100 }).notNull(),
    entityId: text("entity_id"),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_user_idx").on(table.userId),
    index("audit_entity_idx").on(table.entity, table.entityId),
    index("audit_created_idx").on(table.createdAt),
  ]
);

// ============================================================
// TYPE EXPORTS
// ============================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type NewNewsArticle = typeof newsArticles.$inferInsert;
export type NewsCategory = typeof newsCategories.$inferSelect;
export type Vacancy = typeof vacancies.$inferSelect;
export type FAQItem = typeof faqItems.$inferSelect;
export type Contest = typeof contests.$inferSelect;
export type Contestant = typeof contestants.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type SportsEvent = typeof sportsEvents.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
