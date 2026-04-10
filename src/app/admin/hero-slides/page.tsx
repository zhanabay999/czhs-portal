import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { asc } from "drizzle-orm";
import { HeroSlidesClient } from "./HeroSlidesClient";

export default async function AdminHeroSlidesPage() {
  const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
  return <HeroSlidesClient slides={JSON.parse(JSON.stringify(slides))} />;
}
