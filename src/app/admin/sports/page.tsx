import { db } from "@/db";
import { sportsEvents } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SportsListClient } from "./SportsListClient";

export default async function AdminSportsPage() {
  let events: Array<{
    id: string;
    titleKk: string;
    titleRu: string;
    eventType: string;
    status: string;
    startDate: Date;
  }> = [];
  try {
    const raw = await db.select().from(sportsEvents).orderBy(desc(sportsEvents.startDate));
    events = raw.map(e => ({
      id: e.id,
      titleKk: e.titleKk,
      titleRu: e.titleRu,
      eventType: e.eventType,
      status: e.status,
      startDate: e.startDate,
    }));
  } catch {}

  return <SportsListClient events={JSON.parse(JSON.stringify(events))} />;
}
