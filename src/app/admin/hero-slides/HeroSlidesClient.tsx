"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff, GripVertical, Loader2, ImageIcon } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { toast } from "sonner";

type Slide = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export function HeroSlidesClient({ slides }: { slides: Slide[] }) {
  const { locale } = useAdminLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "hero");
      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) throw new Error();
      const { url } = await uploadRes.json();

      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, sortOrder: slides.length + 1 }),
      });
      if (res.ok) {
        toast.success(locale === "kk" ? "Слайд қосылды" : "Слайд добавлен");
        router.refresh();
      }
    } catch {
      toast.error(locale === "kk" ? "Қате" : "Ошибка загрузки");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    startTransition(async () => {
      await fetch(`/api/admin/hero-slides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm(locale === "kk" ? "Слайдты жою?" : "Удалить слайд?")) return;
    startTransition(async () => {
      await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
      toast.success(locale === "kk" ? "Жойылды" : "Удалено");
      router.refresh();
    });
  }

  async function handleUrlAdd() {
    const url = prompt(locale === "kk" ? "Сурет URL енгізіңіз:" : "Введите URL изображения:");
    if (!url) return;
    startTransition(async () => {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url, sortOrder: slides.length + 1 }),
      });
      if (res.ok) {
        toast.success(locale === "kk" ? "Слайд қосылды" : "Слайд добавлен");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ktz-blue">
            {locale === "kk" ? "Басты бет слайдтары" : "Слайды главной страницы"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {slides.length} {locale === "kk" ? "слайд" : "слайдов"} · {slides.filter(s => s.isActive).length} {locale === "kk" ? "белсенді" : "активных"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUrlAdd} variant="outline" disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            URL
          </Button>
          <label>
            <Button asChild className="bg-ktz-blue cursor-pointer" disabled={uploading}>
              <span>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {locale === "kk" ? "Фото жүктеу" : "Загрузить фото"}
              </span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{locale === "kk" ? "Слайдтар жоқ" : "Нет слайдов"}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, i) => (
            <Card key={slide.id} className={`overflow-hidden ${!slide.isActive ? "opacity-50" : ""}`}>
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={slide.imageUrl}
                  alt={`Slide ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white">
                  {i + 1}
                </div>
                {!slide.isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                      {locale === "kk" ? "Өшірілген" : "Скрыт"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="truncate text-xs text-muted-foreground">{slide.imageUrl.split("/").pop()}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggle(slide.id, slide.isActive)}
                    disabled={isPending}
                    title={slide.isActive ? "Скрыть" : "Показать"}
                  >
                    {slide.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => handleDelete(slide.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
