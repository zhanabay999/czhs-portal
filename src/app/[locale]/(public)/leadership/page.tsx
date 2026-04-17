export const dynamic = "force-dynamic";

import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { leaders } from "@/db/schema";
import { asc } from "drizzle-orm";
import { LeadershipOrgChart } from "./OrgChart";

type Props = { params: Promise<{ locale: string }> };

export default async function LeadershipPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allLeaders = await db.select().from(leaders).orderBy(asc(leaders.level), asc(leaders.sortOrder));

  const data = allLeaders.map((l) => ({
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

  return <LeadershipOrgChart leaders={data} locale={locale} />;
}
