"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, X, Save, User, Users, UserCog } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { toast } from "sonner";

type Leader = {
  id: string;
  nameKk: string;
  nameRu: string;
  positionKk: string;
  positionRu: string;
  photoUrl: string | null;
  photoPosition: string | null;
  level: number;
  sortOrder: number;
  parentId: string | null;
};

type FormData = {
  nameKk: string;
  nameRu: string;
  positionKk: string;
  positionRu: string;
  photoUrl: string;
  photoPosition: string;
  level: string;
  sortOrder: string;
  parentId: string;
};

const emptyForm: FormData = {
  nameKk: "", nameRu: "", positionKk: "", positionRu: "",
  photoUrl: "", photoPosition: "50% 20%", level: "2", sortOrder: "0", parentId: "",
};

function PhotoPositionEditor({
  photoUrl,
  position,
  onChange,
  locale,
}: {
  photoUrl: string;
  position: string;
  onChange: (pos: string) => void;
  locale: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Local state for smooth visual feedback during drag — parent updated only on mouseUp
  const [localPos, setLocalPos] = useState(position);
  const [lx, ly] = localPos.split(" ").map((v) => parseFloat(v) || 50);

  const calcPos = useCallback((clientX: number, clientY: number): string => {
    const el = containerRef.current;
    if (!el) return localPos;
    const rect = el.getBoundingClientRect();
    const nx = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const ny = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return `${Math.round(nx)}% ${Math.round(ny)}%`;
  }, [localPos]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    const p = calcPos(e.clientX, e.clientY);
    setLocalPos(p);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setLocalPos(calcPos(e.clientX, e.clientY));
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const p = calcPos(e.clientX, e.clientY);
    setLocalPos(p);
    onChange(p); // commit to parent only once, on release
  };
  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      onChange(localPos);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    const p = calcPos(t.clientX, t.clientY);
    setLocalPos(p);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches[0];
    setLocalPos(calcPos(t.clientX, t.clientY));
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    const p = calcPos(t.clientX, t.clientY);
    setLocalPos(p);
    onChange(p);
  };

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs text-muted-foreground font-medium">
        {locale === "kk" ? "Фото орналасуы (сүйреңіз)" : "Положение фото (перетащите)"}
      </p>
      <div className="flex items-center gap-4">
        {/* Draggable source image */}
        <div
          ref={containerRef}
          className="relative h-28 w-40 shrink-0 cursor-crosshair overflow-hidden rounded-lg border-2 border-dashed border-ktz-blue/30 select-none"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            draggable={false}
            style={{ objectPosition: localPos }}
          />
          {/* Crosshair indicator */}
          <div
            className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ktz-blue/60 shadow"
            style={{ left: `${lx}%`, top: `${ly}%` }}
          />
          <p className="pointer-events-none absolute bottom-1 left-0 right-0 text-center text-[10px] text-white drop-shadow">
            {locale === "kk" ? "нүктені жылжытыңыз" : "тащите точку"}
          </p>
        </div>
        {/* Circle preview */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-ktz-blue/30 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              draggable={false}
              style={{ objectPosition: localPos }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {locale === "kk" ? "кружочте" : "в кружке"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LeadershipClient({ leaders }: { leaders: Leader[] }) {
  const { t, locale } = useAdminLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const level2Leaders = leaders.filter((l) => l.level === 2);

  const levelLabels: Record<number, string> = {
    1: t("leadership.level1"),
    2: t("leadership.level2"),
    3: t("leadership.level3"),
  };

  const levelColors: Record<number, string> = {
    1: "bg-yellow-100 text-yellow-800",
    2: "bg-blue-100 text-blue-800",
    3: "bg-gray-100 text-gray-800",
  };

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(leader: Leader) {
    setForm({
      nameKk: leader.nameKk,
      nameRu: leader.nameRu,
      positionKk: leader.positionKk,
      positionRu: leader.positionRu,
      photoUrl: leader.photoUrl || "",
      photoPosition: leader.photoPosition || "50% 20%",
      level: String(leader.level),
      sortOrder: String(leader.sortOrder),
      parentId: leader.parentId || "",
    });
    setEditingId(leader.id);
    setShowForm(true);
  }

  async function handleSave() {
    const payload = {
      nameKk: form.nameKk,
      nameRu: form.nameRu,
      positionKk: form.positionKk,
      positionRu: form.positionRu,
      photoUrl: form.photoUrl || null,
      photoPosition: form.photoPosition || "50% 20%",
      level: Number(form.level),
      sortOrder: Number(form.sortOrder),
      parentId: form.level === "3" ? form.parentId || null : null,
    };

    startTransition(async () => {
      try {
        const url = editingId ? `/api/admin/leadership/${editingId}` : "/api/admin/leadership";
        const method = editingId ? "PATCH" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success(t("leadership.success"));
          setShowForm(false);
          setEditingId(null);
          router.refresh();
        } else {
          toast.error(t("leadership.error"));
        }
      } catch {
        toast.error(t("leadership.error"));
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm(t("leadership.confirmDelete"))) return;
    startTransition(async () => {
      try {
        await fetch(`/api/admin/leadership/${id}`, { method: "DELETE" });
        toast.success(t("leadership.success"));
        router.refresh();
      } catch {
        toast.error(t("leadership.error"));
      }
    });
  }

  const grouped = [1, 2, 3].map((level) => ({
    level,
    label: levelLabels[level],
    items: leaders.filter((l) => l.level === level),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ktz-blue">{t("leadership.title")}</h1>
          <p className="text-sm text-muted-foreground">{leaders.length} {locale === "kk" ? "адам" : "человек"}</p>
        </div>
        <Button onClick={openAdd} className="bg-ktz-blue">
          <Plus className="mr-2 h-4 w-4" />
          {t("leadership.add")}
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? t("leadership.edit") : t("leadership.add")}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t("leadership.name")} (RU) *</Label>
              <Input value={form.nameRu} onChange={(e) => setForm({ ...form, nameRu: e.target.value })} placeholder="Фамилия Имя Отчество" />
            </div>
            <div>
              <Label>{t("leadership.name")} (KK) *</Label>
              <Input value={form.nameKk} onChange={(e) => setForm({ ...form, nameKk: e.target.value })} placeholder="Тегі Аты Әкесінің аты" />
            </div>
            <div>
              <Label>{t("leadership.position")} (RU) *</Label>
              <Input value={form.positionRu} onChange={(e) => setForm({ ...form, positionRu: e.target.value })} placeholder="Должность" />
            </div>
            <div>
              <Label>{t("leadership.position")} (KK) *</Label>
              <Input value={form.positionKk} onChange={(e) => setForm({ ...form, positionKk: e.target.value })} placeholder="Лауазымы" />
            </div>
            <div className="sm:col-span-2">
              <Label>{t("leadership.photo")}</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("folder", "leaders");
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  if (res.ok) {
                    const { url } = await res.json();
                    setForm({ ...form, photoUrl: url, photoPosition: "50% 20%" });
                    toast.success(locale === "kk" ? "Фото жүктелді" : "Фото загружено");
                  } else {
                    toast.error(locale === "kk" ? "Қате" : "Ошибка загрузки");
                  }
                }}
              />
              {form.photoUrl && (
                <PhotoPositionEditor
                  photoUrl={form.photoUrl}
                  position={form.photoPosition}
                  onChange={(pos) => setForm({ ...form, photoPosition: pos })}
                  locale={locale}
                />
              )}
            </div>
            <div>
              <Label>{t("leadership.level")} *</Label>
              <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{t("leadership.level1")}</SelectItem>
                  <SelectItem value="2">{t("leadership.level2")}</SelectItem>
                  <SelectItem value="3">{t("leadership.level3")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.level !== "1" && (
              <div>
                <Label>{t("leadership.parent")}</Label>
                <Select value={form.parentId} onValueChange={(v) => setForm({ ...form, parentId: v })}>
                  <SelectTrigger><SelectValue placeholder={locale === "kk" ? "Таңдаңыз" : "Выберите"} /></SelectTrigger>
                  <SelectContent>
                    {leaders.filter((l) => l.level < Number(form.level)).map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {locale === "kk" ? l.nameKk : l.nameRu} ({t(`leadership.level${l.level}`)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>{locale === "kk" ? "Реттік нөмірі" : "Порядок"}</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleSave} disabled={isPending || !form.nameRu || !form.nameKk || !form.positionRu || !form.positionKk} className="bg-ktz-blue">
              <Save className="mr-2 h-4 w-4" />
              {t("leadership.save")}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              {locale === "kk" ? "Бас тарту" : "Отмена"}
            </Button>
          </div>
        </Card>
      )}

      {/* Уровень 1 — Директор */}
      {leaders.filter(l => l.level === 1).length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-ktz-blue">
            <UserCog className="h-5 w-5" />
            {t("leadership.level1")}
          </h2>
          {leaders.filter(l => l.level === 1).map((leader) => (
            <Card key={leader.id} className="flex items-start gap-4 p-4">
              {leader.photoUrl ? (
                <img src={leader.photoUrl} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <UserCog className="h-7 w-7 text-yellow-600" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{locale === "kk" ? leader.nameKk : leader.nameRu}</p>
                <p className="text-sm text-muted-foreground">{locale === "kk" ? leader.positionKk : leader.positionRu}</p>
                <span className="mt-1 inline-block rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800">
                  {t("leadership.level1")}
                </span>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(leader)}>
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(leader.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Уровень 2 — Заместители + их подчинённые */}
      {leaders.filter(l => l.level === 2).length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-ktz-blue">
            <Users className="h-5 w-5" />
            {t("leadership.level2")} ({leaders.filter(l => l.level === 2).length})
          </h2>
          <div className="space-y-4">
            {leaders.filter(l => l.level === 2).map((deputy) => {
              const subs = leaders.filter(l => l.level === 3 && l.parentId === deputy.id);
              return (
                <div key={deputy.id} className="rounded-xl border border-border overflow-hidden">
                  {/* Заместитель */}
                  <Card className="flex items-start gap-4 rounded-none border-0 bg-blue-50/50 p-4">
                    {deputy.photoUrl ? (
                      <img src={deputy.photoUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ktz-blue/10">
                        <Users className="h-6 w-6 text-ktz-blue" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{locale === "kk" ? deputy.nameKk : deputy.nameRu}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{locale === "kk" ? deputy.positionKk : deputy.positionRu}</p>
                      <span className="mt-1 inline-block rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-800">
                        {t("leadership.level2")}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(deputy)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(deputy.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>

                  {/* Подчинённые */}
                  {subs.length > 0 && (
                    <div className="border-t border-border bg-white px-4 py-3">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {locale === "kk" ? "Бағыныштылар" : "Подчинённые"} ({subs.length})
                      </p>
                      <div className="space-y-2">
                        {subs.map((sub) => (
                          <div key={sub.id} className="flex items-start gap-3 rounded-lg border border-border/50 bg-gray-50/50 p-3">
                            {sub.photoUrl ? (
                              <img src={sub.photoUrl} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{locale === "kk" ? sub.nameKk : sub.nameRu}</p>
                              <p className="text-xs text-muted-foreground leading-snug">{locale === "kk" ? sub.positionKk : sub.positionRu}</p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(sub)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(sub.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Уровень 3 без руководителя */}
      {(() => {
        const orphans = leaders.filter(l => l.level === 3 && (!l.parentId || !leaders.find(p => p.id === l.parentId && p.level === 2)));
        if (orphans.length === 0) return null;
        return (
          <div className="mb-8">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-ktz-blue">
              <User className="h-5 w-5" />
              {t("leadership.level3")} ({orphans.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {orphans.map((leader) => (
                <Card key={leader.id} className="flex items-start gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{locale === "kk" ? leader.nameKk : leader.nameRu}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{locale === "kk" ? leader.positionKk : leader.positionRu}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(leader)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(leader.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
