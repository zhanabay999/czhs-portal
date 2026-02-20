import { db } from "@/db";
import { sportsEvents } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Eye, Trophy } from "lucide-react";

export default async function AdminSportsPage() {
  let events: Array<typeof sportsEvents.$inferSelect> = [];
  try {
    events = await db.select().from(sportsEvents).orderBy(desc(sportsEvents.startDate));
  } catch {}

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">Спорт іс-шаралар</h1>
          <p className="text-sm text-muted-foreground">{events.length} іс-шара</p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/sports/new"><Plus className="mr-2 h-4 w-4" />Іс-шара қосу</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Атауы</TableHead>
              <TableHead className="w-28">Түрі</TableHead>
              <TableHead className="w-28">Статус</TableHead>
              <TableHead className="w-32">Күні</TableHead>
              <TableHead className="w-20">Әрекет</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <p className="font-medium">{event.titleRu}</p>
                  <p className="text-xs text-muted-foreground">{event.titleKk}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{event.eventType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={event.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(event.startDate).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Іс-шаралар жоқ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
