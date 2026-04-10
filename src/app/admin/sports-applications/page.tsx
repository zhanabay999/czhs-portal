import { db } from "@/db";
import { sportsApplications } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SportsApplicationsClient } from "./SportsApplicationsClient";

export default async function SportsApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/kk/login");

  const applications = await db
    .select()
    .from(sportsApplications)
    .orderBy(desc(sportsApplications.createdAt));

  return <SportsApplicationsClient applications={applications} />;
}
