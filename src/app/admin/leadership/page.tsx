import { db } from "@/db";
import { leaders } from "@/db/schema";
import { asc } from "drizzle-orm";
import { LeadershipClient } from "./LeadershipClient";

export default async function AdminLeadershipPage() {
  let items: Array<{
    id: string;
    nameKk: string;
    nameRu: string;
    positionKk: string;
    positionRu: string;
    photoUrl: string | null;
    photoPosition: string | null;
    level: number;
    sortOrder: number;
    parentId: string | null;
  }> = [];

  try {
    const raw = await db.select().from(leaders).orderBy(asc(leaders.level), asc(leaders.sortOrder));
    items = raw.map((l) => ({
      id: l.id,
      nameKk: l.nameKk,
      nameRu: l.nameRu,
      positionKk: l.positionKk,
      positionRu: l.positionRu,
      photoUrl: l.photoUrl,
      photoPosition: l.photoPosition,
      level: l.level,
      sortOrder: l.sortOrder,
      parentId: l.parentId,
    }));
  } catch {}

  return <LeadershipClient leaders={items} />;
}
