"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

type Event = { id: string; titleKk: string; titleRu: string; eventType: string; status: string; startDate: string };

const sportLabels: Record<string, string> = {
  football: "Футбол",
  volleyball: "Волейбол",
  basketball: "Баскетбол",
  table_tennis: "Наст. теннис",
  chess: "Шахматы",
  track_and_field: "Лёгкая атлетика",
  swimming: "Плавание",
  other: "Другое",
};

export function SportsListClient({ events }: { events: Event[] }) {
  const { t, locale } = useAdminLocale();
  const isKk = locale === "kk";
  const router = useRouter();

  async function toggleStatus(id: string, current: string) {
    const newStatus = current === "published" ? "draft" : "published";
    await fetch(`/api/admin/sports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  async function deleteEvent(id: string) {
    if (!confirm(isKk ? "Жойғыңыз келе ме?" : "Удалить мероприятие?")) return;
    await fetch(`/api/admin/sports/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ktz-blue">{t("sports.title")}</h1>
          <p className="text-sm text-muted-foreground">{events.length} {t("sports.count")}</p>
        </div>
        <Button asChild className="bg-ktz-blue">
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
              <TableHead className="w-28">{t("sports.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <p className="font-medium">{isKk ? event.titleKk : event.titleRu}</p>
                  <p className="text-xs text-muted-foreground">{isKk ? event.titleRu : event.titleKk}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{sportLabels[event.eventType] || event.eventType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={event.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {event.status === "published" ? (isKk ? "Жарияланған" : "Опубликовано") : (isKk ? "Жоба" : "Черновик")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(event.startDate).toLocaleDateString(isKk ? "kk-KZ" : "ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleStatus(event.id, event.status)}
                      title={event.status === "published" ? (isKk ? "Жасыру" : "Скрыть") : (isKk ? "Жариялау" : "Опубликовать")}
                    >
                      {event.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
