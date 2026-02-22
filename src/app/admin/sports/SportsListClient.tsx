"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

type Event = { id: string; titleKk: string; titleRu: string; eventType: string; status: string; startDate: string };

export function SportsListClient({ events }: { events: Event[] }) {
  const { t } = useAdminLocale();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">{t("sports.title")}</h1>
          <p className="text-sm text-muted-foreground">{events.length} {t("sports.count")}</p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/sports/new"><Plus className="mr-2 h-4 w-4" />{t("sports.add")}</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("sports.name")}</TableHead>
              <TableHead className="w-28">{t("sports.type")}</TableHead>
              <TableHead className="w-28">{t("sports.status")}</TableHead>
              <TableHead className="w-32">{t("sports.date")}</TableHead>
              <TableHead className="w-20">{t("sports.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <p className="font-medium">{event.titleRu}</p>
                  <p className="text-xs text-muted-foreground">{event.titleKk}</p>
                </TableCell>
                <TableCell><Badge variant="outline">{event.eventType}</Badge></TableCell>
                <TableCell>
                  <Badge className={event.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{new Date(event.startDate).toLocaleDateString("ru-RU")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">{t("sports.empty")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
