import { db } from "@/db";
import { vacancies } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Briefcase } from "lucide-react";

export default async function AdminVacanciesPage() {
  let vacancyList: Array<typeof vacancies.$inferSelect> = [];
  try {
    vacancyList = await db.select().from(vacancies).orderBy(desc(vacancies.createdAt));
  } catch {}

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">Вакансиялар</h1>
          <p className="text-sm text-muted-foreground">{vacancyList.length} вакансия</p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/vacancies/new"><Plus className="mr-2 h-4 w-4" />Вакансия қосу</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Атауы</TableHead>
              <TableHead className="w-28">Түрі</TableHead>
              <TableHead className="w-28">Статус</TableHead>
              <TableHead className="w-32">Жабу күні</TableHead>
              <TableHead className="w-20">Әрекет</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vacancyList.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <p className="font-medium">{v.titleRu}</p>
                  <p className="text-xs text-muted-foreground">{v.department}</p>
                </TableCell>
                <TableCell><Badge variant="outline">{v.type}</Badge></TableCell>
                <TableCell>
                  <Badge className={v.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {v.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {v.closingDate ? new Date(v.closingDate).toLocaleDateString("ru-RU") : "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {vacancyList.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Вакансиялар жоқ</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
