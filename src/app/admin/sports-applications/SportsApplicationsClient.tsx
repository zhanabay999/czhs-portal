"use client";

import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { sportsApplications } from "@/db/schema";

type Application = typeof sportsApplications.$inferSelect;

const sportLabels: Record<string, string> = {
  football: "Футбол",
  volleyball: "Волейбол",
  basketball: "Баскетбол",
  table_tennis: "Настольный теннис",
  chess: "Шахматы",
  track_and_field: "Легкая атлетика",
  swimming: "Плавание",
  togyzqumalaq: "Тогызкумалак",
};

export function SportsApplicationsClient({ applications }: { applications: Application[] }) {
  const { locale } = useAdminLocale();
  const isKk = locale === "kk";

  function exportToCSV() {
    const headers = ["#", "Фамилия", "Имя", "Отчество", "Табельный номер", "Филиал", "Вид спорта", "Телефон", "Дата"];
    const rows = applications.map((app, i) => [
      i + 1,
      app.lastName,
      app.firstName,
      app.patronymic || "",
      app.employeeId || "",
      app.branch,
      sportLabels[app.sportType] || app.sportType,
      app.phone,
      new Date(app.createdAt).toLocaleDateString("ru-RU"),
    ]);
    const csv = [headers, ...rows].map(r => r.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sports_applications.csv";
    a.click();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isKk ? "Спорт өтінімдері" : "Заявки спортсменов"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {applications.length} {isKk ? "өтінім" : "заявок"}
          </p>
        </div>
        {applications.length > 0 && (
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            {isKk ? "CSV экспорт" : "Экспорт CSV"}
          </Button>
        )}
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-muted-foreground">
              {isKk ? "Өтінімдер жоқ" : "Заявок пока нет"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">#</th>
                    <th className="px-4 py-3 text-left font-medium">{isKk ? "Аты-жөні" : "ФИО"}</th>
                    <th className="px-4 py-3 text-left font-medium">{isKk ? "Табельдік нөмір" : "Табельный номер"}</th>
                    <th className="px-4 py-3 text-left font-medium">{isKk ? "Филиал" : "Филиал"}</th>
                    <th className="px-4 py-3 text-left font-medium">{isKk ? "Спорт түрі" : "Вид спорта"}</th>
                    <th className="px-4 py-3 text-left font-medium">{isKk ? "Телефон" : "Телефон"}</th>
                    <th className="px-4 py-3 text-left font-medium">{isKk ? "Күні" : "Дата"}</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => (
                    <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        {app.lastName} {app.firstName} {app.patronymic || ""}
                      </td>
                      <td className="px-4 py-3">{app.employeeId || "—"}</td>
                      <td className="px-4 py-3">{app.branch}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary">
                          {sportLabels[app.sportType] || app.sportType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{app.phone}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString(isKk ? "kk-KZ" : "ru-RU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
