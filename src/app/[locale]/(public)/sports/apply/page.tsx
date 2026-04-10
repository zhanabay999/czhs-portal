"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

const sportTypes = [
  { value: "football", labelRu: "Футбол", labelKk: "Футбол" },
  { value: "volleyball", labelRu: "Волейбол", labelKk: "Волейбол" },
  { value: "basketball", labelRu: "Баскетбол", labelKk: "Баскетбол" },
  { value: "table_tennis", labelRu: "Настольный теннис", labelKk: "Үстел теннисі" },
  { value: "chess", labelRu: "Шахматы", labelKk: "Шахмат" },
  { value: "track_and_field", labelRu: "Легкая атлетика", labelKk: "Жеңіл атлетика" },
  { value: "swimming", labelRu: "Плавание", labelKk: "Жүзу" },
  { value: "togyzqumalaq", labelRu: "Тогызкумалак", labelKk: "Тоғызқұмалақ" },
  { value: "other", labelRu: "Другое", labelKk: "Басқа" },
];

export default function SportsApplyPage() {
  const { locale } = useParams();
  const isKk = locale === "kk";

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    patronymic: "",
    employeeId: "",
    branch: "",
    sportType: "",
    otherSport: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const effectiveSport = form.sportType === "other" ? form.otherSport : form.sportType;
  const isValid = form.lastName && form.firstName && form.branch && effectiveSport && form.phone;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);

    try {
      const res = await fetch("/api/sports-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sportType: effectiveSport,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert(isKk ? "Қате орын алды" : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
            <h2 className="mb-2 text-2xl font-bold text-green-700">
              {isKk ? "Өтінім жіберілді!" : "Заявка отправлена!"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {isKk
                ? "Сіздің өтініміңіз қабылданды. Спорт комитеті жақын арада сізбен байланысады."
                : "Ваша заявка принята. Спортивный комитет свяжется с вами в ближайшее время."}
            </p>
            <Link
              href={`/${locale}/sports`}
              className="inline-flex items-center gap-2 rounded-lg bg-ktz-blue px-6 py-3 text-white hover:bg-ktz-blue/90"
            >
              <ArrowLeft className="h-4 w-4" />
              {isKk ? "Спорт бетіне оралу" : "Вернуться на страницу спорта"}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/${locale}/sports`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-ktz-blue hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {isKk ? "Артқа" : "Назад"}
      </Link>

      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl text-ktz-blue">
            {isKk ? "ЦЖС спортшылар пулына кіруге өтінім" : "Заявка на вступление в пул спортсменов ЦЖС"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>{isKk ? "Тегі" : "Фамилия"} *</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder={isKk ? "Тегіңізді енгізіңіз" : "Введите фамилию"}
                required
              />
            </div>

            <div>
              <Label>{isKk ? "Аты" : "Имя"} *</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder={isKk ? "Атыңызды енгізіңіз" : "Введите имя"}
                required
              />
            </div>

            <div>
              <Label>{isKk ? "Әкесінің аты" : "Отчество"}</Label>
              <Input
                value={form.patronymic}
                onChange={(e) => setForm({ ...form, patronymic: e.target.value })}
                placeholder={isKk ? "Әкесінің атын енгізіңіз" : "Введите отчество"}
              />
            </div>

            <div>
              <Label>{isKk ? "Табельдік нөмір" : "Табельный номер"}</Label>
              <Input
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                placeholder={isKk ? "Табельдік нөміріңізді енгізіңіз" : "Введите табельный номер"}
              />
            </div>

            <div>
              <Label>{isKk ? "Филиал атауы" : "Название филиала"} *</Label>
              <Input
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                placeholder={isKk ? "Филиал атауын енгізіңіз" : "Введите название филиала"}
                required
              />
            </div>

            <div>
              <Label>{isKk ? "Спорт түрі" : "Вид спорта"} *</Label>
              <Select value={form.sportType} onValueChange={(v) => setForm({ ...form, sportType: v, otherSport: "" })}>
                <SelectTrigger>
                  <SelectValue placeholder={isKk ? "Спорт түрін таңдаңыз" : "Выберите вид спорта"} />
                </SelectTrigger>
                <SelectContent>
                  {sportTypes.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {isKk ? s.labelKk : s.labelRu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.sportType === "other" && (
              <div>
                <Label>{isKk ? "Спорт түрін жазыңыз" : "Укажите вид спорта"} *</Label>
                <Input
                  value={form.otherSport}
                  onChange={(e) => setForm({ ...form, otherSport: e.target.value })}
                  placeholder={isKk ? "Спорт түрін енгізіңіз" : "Введите вид спорта"}
                  required
                />
              </div>
            )}

            <div>
              <Label>{isKk ? "Телефон нөмірі" : "Номер телефона"} *</Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-ktz-blue hover:bg-ktz-blue/90"
              disabled={!isValid || loading}
            >
              <Send className="mr-2 h-4 w-4" />
              {loading
                ? (isKk ? "Жіберілуде..." : "Отправка...")
                : (isKk ? "Өтінім жіберу" : "Отправить заявку")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
