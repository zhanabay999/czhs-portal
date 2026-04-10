"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CoverImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  locale: string;
  onClear?: () => void;
}

export function CoverImageUpload({ value, onChange, locale, onClear }: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isKk = locale === "kk";

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "news");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        onChange(url);
        toast.success(isKk ? "Сурет жүктелді" : "Фото загружено");
      } else {
        toast.error(isKk ? "Жүктеу қатесі" : "Ошибка загрузки");
      }
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-sm text-blue-600">
          {isKk ? "Жүктелуде..." : "Загрузка..."}
        </span>
      </div>
    );
  }

  if (!value) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-6 text-sm text-muted-foreground transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
        >
          <ImagePlus className="h-5 w-5" />
          {isKk ? "Сурет қосу" : "Добавить изображение"}
        </button>
      </>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border">
      <img src={value} alt="Cover" className="h-40 w-full object-cover" />
      <div className="absolute bottom-2 right-2 flex gap-1.5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-7 gap-1 text-xs shadow"
          onClick={() => inputRef.current?.click()}
        >
          <RefreshCw className="h-3 w-3" />
          {isKk ? "Ауыстыру" : "Заменить"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="h-7 gap-1 text-xs shadow"
          onClick={() => onClear ? onClear() : onChange("")}
        >
          <X className="h-3 w-3" />
          {isKk ? "Жою" : "Удалить"}
        </Button>
      </div>
    </div>
  );
}
