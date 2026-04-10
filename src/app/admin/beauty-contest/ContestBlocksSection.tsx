"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Upload, Loader2, ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

type ContestBlock = {
  id: string;
  titleKk: string;
  titleRu: string;
  imageUrl: string;
  linkUrl: string | null;
  linkLabel: string | null;
  isActive: boolean;
  sortOrder: number;
};

type Props = {
  initialBlocks: ContestBlock[];
};

export function ContestBlocksSection({ initialBlocks }: Props) {
  const { locale } = useAdminLocale();
  const isKk = locale === "kk";
  const [blocks, setBlocks] = useState<ContestBlock[]>(initialBlocks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titleKk: "", titleRu: "", imageUrl: "", linkUrl: "", linkLabel: "" });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "contests");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.url;
    } catch {
      toast.error(isKk ? "Сурет жүктеу қатесі" : "Ошибка загрузки фото");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!form.titleKk || !form.titleRu || !form.imageUrl) {
      toast.error(isKk ? "Барлық міндетті өрістерді толтырыңыз" : "Заполните все обязательные поля");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contest-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const block = await res.json();
      setBlocks((prev) => [...prev, block]);
      setForm({ titleKk: "", titleRu: "", imageUrl: "", linkUrl: "", linkLabel: "" });
      setShowForm(false);
      toast.success(isKk ? "Блок қосылды" : "Блок добавлен");
    } catch {
      toast.error(isKk ? "Қате" : "Ошибка");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(isKk ? "Өшіру?" : "Удалить?")) return;
    try {
      await fetch(`/api/admin/contest-blocks/${id}`, { method: "DELETE" });
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      toast.success(isKk ? "Өшірілді" : "Удалено");
    } catch {
      toast.error(isKk ? "Қате" : "Ошибка");
    }
  }

  async function handleMove(id: string, dir: -1 | 1) {
    const idx = blocks.findIndex((b) => b.id === id);
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    setBlocks(next);
    // Update sortOrder for both
    await Promise.all([
      fetch(`/api/admin/contest-blocks/${next[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: idx }),
      }),
      fetch(`/api/admin/contest-blocks/${next[target].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target }),
      }),
    ]);
  }

  async function handleToggleActive(block: ContestBlock) {
    try {
      await fetch(`/api/admin/contest-blocks/${block.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !block.isActive }),
      });
      setBlocks((prev) => prev.map((b) => b.id === block.id ? { ...b, isActive: !b.isActive } : b));
    } catch {
      toast.error(isKk ? "Қате" : "Ошибка");
    }
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-ktz-blue">
          {isKk ? "Конкурс блоктары" : "Блоки конкурсов"}
        </h2>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-ktz-blue gap-1">
          <Plus className="h-4 w-4" />
          {isKk ? "Қосу" : "Добавить"}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mb-4">
          <CardContent className="p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>{isKk ? "Тақырып (қаз)" : "Заголовок (каз)"} *</Label>
                <Input value={form.titleKk} onChange={(e) => setForm({ ...form, titleKk: e.target.value })} />
              </div>
              <div>
                <Label>{isKk ? "Тақырып (орыс)" : "Заголовок (рус)"} *</Label>
                <Input value={form.titleRu} onChange={(e) => setForm({ ...form, titleRu: e.target.value })} />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <Label>{isKk ? "Сурет" : "Фото"} *</Label>
              <div className="flex gap-2">
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="URL..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = await uploadImage(file);
                    if (url) setForm({ ...form, imageUrl: url });
                    e.target.value = "";
                  }}
                />
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="" className="mt-2 h-32 w-full rounded-lg object-cover" />
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label>{isKk ? "Сілтеме (міндетті емес)" : "Ссылка (необязательно)"}</Label>
                <Input
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>{isKk ? "Сілтеме мәтіні" : "Текст ссылки"}</Label>
                <Input
                  value={form.linkLabel}
                  onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
                  placeholder={isKk ? "Толығырақ..." : "Подробнее..."}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAdd} disabled={saving} className="bg-ktz-blue">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isKk ? "Сақтау" : "Сохранить"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {isKk ? "Бас тарту" : "Отмена"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocks list */}
      {blocks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isKk ? "Блоктар жоқ" : "Блоков нет"}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block, idx) => (
            <Card key={block.id} className={block.isActive ? "" : "opacity-50"}>
              <CardContent className="p-3">
                <img
                  src={block.imageUrl}
                  alt={isKk ? block.titleKk : block.titleRu}
                  className="mb-2 h-36 w-full rounded-lg object-cover"
                />
                <p className="mb-1 font-medium text-sm">{isKk ? block.titleKk : block.titleRu}</p>
                {block.linkUrl && (
                  <a
                    href={block.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {block.linkLabel || block.linkUrl}
                  </a>
                )}
                <div className="flex items-center gap-1 mt-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(block.id, -1)} disabled={idx === 0}>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove(block.id, 1)} disabled={idx === blocks.length - 1}>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs ml-auto"
                    onClick={() => handleToggleActive(block)}
                  >
                    {block.isActive ? (isKk ? "Жасыру" : "Скрыть") : (isKk ? "Көрсету" : "Показать")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-400 hover:text-red-600"
                    onClick={() => handleDelete(block.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
