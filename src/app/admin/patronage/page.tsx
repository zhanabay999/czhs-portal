import { db } from "@/db";
import { patronageBranches } from "@/db/schema";
import { asc } from "drizzle-orm";
import { PatronageClient } from "./PatronageClient";

export default async function AdminPatronagePage() {
  const branches = await db.select().from(patronageBranches).orderBy(asc(patronageBranches.sortOrder));
  return <PatronageClient branches={JSON.parse(JSON.stringify(branches))} />;
}
