import { db } from "@/db";
import { faqItems, faqCategories } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";

export default async function AdminFAQPage() {
  let items: Array<typeof faqItems.$inferSelect> = [];
  try {
    items = await db.select().from(faqItems).orderBy(faqItems.sortOrder);
  } catch {}

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">FAQ</h1>
          <p className="text-sm text-muted-foreground">{items.length} сұрақ</p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/faq/new"><Plus className="mr-2 h-4 w-4" />Сұрақ қосу</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Сұрақ</TableHead>
              <TableHead className="w-28">Статус</TableHead>
              <TableHead className="w-20">Әрекет</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.questionRu}</p>
                  <p className="text-xs text-muted-foreground">{item.questionKk}</p>
                </TableCell>
                <TableCell>
                  <Badge className={item.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  Сұрақтар жоқ
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
