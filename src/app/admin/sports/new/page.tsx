"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

const eventTypes = [
  { value: "football", label: "Футбол" },
  { value: "volleyball", label: "Волейбол" },
  { value: "basketball", label: "Баскетбол" },
  { value: "table_tennis", label: "Настольный теннис" },
  { value: "chess", label: "Шахматы" },
  { value: "track_and_field", label: "Легкая атлетика" },
  { value: "swimming", label: "Плавание" },
  { value: "other", label: "Другое" },
];

export default function NewSportsEventPage() {
  const router = useRouter();
  const { locale } = useAdminLocale();
  const isKk = locale === "kk";

  const [form, setForm] = useState({
    titleKk: "",
    titleRu: "",
    descriptionKk: "",
    descriptionRu: "",
    eventType: "",
    location: "",
    startDate: "",
    endDate: "",
    coverImageUrl: "",
    status: "draft",
  });
  const [loading, setLoading] = useState(false);

  const isValid = form.titleKk && form.titleRu && form.eventType && form.startDate;

  async function handleSubmit(status: string) {
    if (!isValid) return;
    setLoading(true);

    try {
      const res = await fetch("/api/admin/sports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });
      if (res.ok) {
        router.push("/admin/sports");
        router.refresh();
      }
    } catch {
      alert(isKk ? "Қате орын алды" : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sports">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {isKk ? "Жаңа спорт іс-шара" : "Новое спортивное мероприятие"}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Казахский */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isKk ? "Қазақша" : "Казахский"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{isKk ? "Тақырып" : "Заголовок"} (ҚАЗ) *</Label>
              <Input
                value={form.titleKk}
                onChange={(e) => setForm({ ...form, titleKk: e.target.value })}
                placeholder={isKk ? "Іс-шара тақырыбы" : "Название мероприятия на казахском"}
              />
            </div>
            <div>
              <Label>{isKk ? "Сипаттама" : "Описание"} (ҚАЗ)</Label>
              <Textarea
                value={form.descriptionKk}
                onChange={(e) => setForm({ ...form, descriptionKk: e.target.value })}
                placeholder={isKk ? "Сипаттама..." : "Описание на казахском..."}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Русский */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{isKk ? "Орысша" : "Русский"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{isKk ? "Тақырып" : "Заголовок"} (РУС) *</Label>
              <Input
                value={form.titleRu}
                onChange={(e) => setForm({ ...form, titleRu: e.target.value })}
                placeholder={isKk ? "Іс-шара тақырыбы" : "Название мероприятия на русском"}
              />
            </div>
            <div>
              <Label>{isKk ? "Сипаттама" : "Описание"} (РУС)</Label>
              <Textarea
                value={form.descriptionRu}
                onChange={(e) => setForm({ ...form, descriptionRu: e.target.value })}
                placeholder={isKk ? "Сипаттама..." : "Описание на русском..."}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Настройки */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isKk ? "Баптаулар" : "Настройки"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>{isKk ? "Спорт түрі" : "Вид спорта"} *</Label>
              <Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}>
                <SelectTrigger>
                  <SelectValue placeholder={isKk ? "Таңдаңыз" : "Выберите"} />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{isKk ? "Өткізілетін орын" : "Место проведения"}</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder={isKk ? "Мысалы: Астана, Дворец спорта" : "Например: Астана, Дворец спорта"}
              />
            </div>

            <div>
              <Label>{isKk ? "Басталу күні" : "Дата начала"} *</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label>{isKk ? "Аяқталу күні" : "Дата окончания"}</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <Label>{isKk ? "Мұқаба суреті URL" : "URL обложки"}</Label>
              <Input
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Кнопки */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => handleSubmit("draft")}
          disabled={!isValid || loading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isKk ? "Жоба ретінде сақтау" : "Сохранить как черновик"}
        </Button>
        <Button
          className="bg-ktz-blue hover:bg-ktz-blue/90"
          onClick={() => handleSubmit("published")}
          disabled={!isValid || loading}
        >
          {isKk ? "Жариялау" : "Опубликовать"}
        </Button>
      </div>
    </div>
  );
}
