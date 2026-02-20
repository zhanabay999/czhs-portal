import { db } from "@/db";
import { contests, contestants, votes } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Vote } from "lucide-react";

export default async function AdminContestPage() {
  let contestList: Array<typeof contests.$inferSelect & { contestantsCount: number; votesCount: number }> = [];

  try {
    const raw = await db.select().from(contests).orderBy(desc(contests.year));
    for (const c of raw) {
      const [cc] = await db.select({ count: sql<number>`count(*)` }).from(contestants).where(eq(contestants.contestId, c.id));
      const [vc] = await db.select({ count: sql<number>`count(*)` }).from(votes).where(eq(votes.contestId, c.id));
      contestList.push({ ...c, contestantsCount: Number(cc.count), votesCount: Number(vc.count) });
    }
  } catch {}

  const statusColors: Record<string, string> = {
    upcoming: "bg-yellow-100 text-yellow-800",
    nominations: "bg-blue-100 text-blue-800",
    voting: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">ЦЖС-Аруы конкурсы</h1>
      </div>

      {contestList.length > 0 ? (
        <div className="grid gap-6">
          {contestList.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-[#C8A951]" />
                      <h3 className="text-lg font-bold">{c.titleRu}</h3>
                      <Badge className={statusColors[c.status]}>{c.status}</Badge>
                      <Badge variant="outline">{c.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{c.titleKk}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-[#003DA5]">{c.contestantsCount}</p>
                      <p className="text-xs text-muted-foreground">Қатысушылар</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#C8A951]">{c.votesCount}</p>
                      <p className="text-xs text-muted-foreground">Дауыстар</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Crown className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p>Конкурстар жоқ</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
