"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Image,
  Type,
  Images,
  Link2,
  Video,
  GripVertical,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  ImagePlus,
  Upload,
  Loader2,
} from "lucide-react";

// ─── Block types ────────────────────────────────────────────

export type BlockType = "text" | "image" | "carousel" | "video" | "link";

export type TextBlock = {
  type: "text";
  id: string;
  content: string;
};

export type ImageBlock = {
  type: "image";
  id: string;
  url: string;
  caption: string;
};

export type CarouselBlock = {
  type: "carousel";
  id: string;
  images: { url: string; caption: string }[];
};

export type VideoBlock = {
  type: "video";
  id: string;
  url: string;
  caption: string;
};

export type LinkBlock = {
  type: "link";
  id: string;
  url: string;
  label: string;
};

export type ContentBlock = TextBlock | ImageBlock | CarouselBlock | VideoBlock | LinkBlock;

// ─── Helpers ────────────────────────────────────────────────

let blockCounter = 0;
function newId() {
  return `blk_${Date.now()}_${++blockCounter}`;
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "text":
          return block.content
            .split("\n\n")
            .filter(Boolean)
            .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
            .join("\n");
        case "image":
          return `<figure><img src="${block.url}" alt="${block.caption}" style="width:100%;border-radius:8px;" />${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}</figure>`;
        case "carousel":
          return `<div class="news-carousel">${block.images.map((img) => `<figure><img src="${img.url}" alt="${img.caption}" style="width:100%;border-radius:8px;" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ""}</figure>`).join("\n")}</div>`;
        case "video":
          return `<div class="news-video" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;"><iframe src="${getEmbedUrl(block.url)}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>${block.caption ? `<p style="text-align:center;font-size:0.875rem;color:#666;margin-top:0.5rem;">${block.caption}</p>` : ""}`;
        case "link":
          return `<p><a href="${block.url}" target="_blank" rel="noopener noreferrer">${block.label || block.url}</a></p>`;
        default:
          return "";
      }
    })
    .join("\n");
}

export function htmlToBlocks(html: string): ContentBlock[] {
  if (!html || !html.trim()) return [];
  // Simple fallback: put all existing HTML as one text block
  const cleaned = html
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();
  if (!cleaned) return [];
  return [{ type: "text", id: newId(), content: cleaned }];
}

// ─── Main component ─────────────────────────────────────────

interface NewsBlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  locale: "kk" | "ru";
}

export function NewsBlockEditor({
  blocks,
  onChange,
  locale,
}: NewsBlockEditorProps) {
  const isKk = locale === "kk";

  const addBlock = (type: BlockType) => {
    const id = newId();
    let newBlock: ContentBlock;
    switch (type) {
      case "text":
        newBlock = { type: "text", id, content: "" };
        break;
      case "image":
        newBlock = { type: "image", id, url: "", caption: "" };
        break;
      case "carousel":
        newBlock = {
          type: "carousel",
          id,
          images: [{ url: "", caption: "" }],
        };
        break;
      case "video":
        newBlock = { type: "video", id, url: "", caption: "" };
        break;
      case "link":
        newBlock = { type: "link", id, url: "", label: "" };
        break;
    }
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updated: ContentBlock) => {
    const next = [...blocks];
    next[index] = updated;
    onChange(next);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <div key={block.id} className="group relative">
          <div className="rounded-xl border border-border bg-card transition-all hover:border-[#003DA5]/30">
            {/* Block header */}
            <div className="flex items-center gap-1 border-b border-border/50 px-3 py-1.5">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {block.type === "text"
                  ? isKk ? "Мәтін" : "Текст"
                  : block.type === "image"
                    ? isKk ? "Сурет" : "Фото"
                    : block.type === "carousel"
                      ? isKk ? "Карусель" : "Карусель"
                      : block.type === "video"
                        ? isKk ? "Бейне" : "Видео"
                        : isKk ? "Сілтеме" : "Ссылка"}
              </span>
              <div className="ml-auto flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-600"
                  onClick={() => removeBlock(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Block content */}
            <div className="p-3">
              {block.type === "text" && (
                <TextBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  locale={locale}
                />
              )}
              {block.type === "image" && (
                <ImageBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  locale={locale}
                />
              )}
              {block.type === "carousel" && (
                <CarouselBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  locale={locale}
                />
              )}
              {block.type === "video" && (
                <VideoBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  locale={locale}
                />
              )}
              {block.type === "link" && (
                <LinkBlockEditor
                  block={block}
                  onChange={(b) => updateBlock(index, b)}
                  locale={locale}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add block buttons */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-border/60 p-4">
        <span className="mr-1 text-xs font-medium text-muted-foreground">
          {isKk ? "Блок қосу:" : "Добавить блок:"}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => addBlock("text")}
        >
          <Type className="h-3.5 w-3.5" />
          {isKk ? "Мәтін" : "Текст"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => addBlock("image")}
        >
          <Image className="h-3.5 w-3.5" />
          {isKk ? "Сурет" : "Фото"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => addBlock("carousel")}
        >
          <Images className="h-3.5 w-3.5" />
          {isKk ? "Карусель" : "Карусель"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => addBlock("video")}
        >
          <Video className="h-3.5 w-3.5" />
          {isKk ? "Бейне" : "Видео"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => addBlock("link")}
        >
          <Link2 className="h-3.5 w-3.5" />
          {isKk ? "Сілтеме" : "Ссылка"}
        </Button>
      </div>
    </div>
  );
}

// ─── Block editors ──────────────────────────────────────────

function TextBlockEditor({
  block,
  onChange,
  locale,
}: {
  block: TextBlock;
  onChange: (b: TextBlock) => void;
  locale: string;
}) {
  return (
    <Textarea
      value={block.content}
      onChange={(e) => onChange({ ...block, content: e.target.value })}
      placeholder={
        locale === "kk"
          ? "Мәтін жазыңыз... (абзацтарды бос жолмен бөліңіз)"
          : "Напишите текст... (абзацы разделяйте пустой строкой)"
      }
      rows={5}
      className="resize-y border-0 p-0 text-sm shadow-none focus-visible:ring-0"
    />
  );
}

function ImageBlockEditor({
  block,
  onChange,
  locale,
}: {
  block: ImageBlock;
  onChange: (b: ImageBlock) => void;
  locale: string;
}) {
  const isKk = locale === "kk";
  return (
    <div className="space-y-2">
      <Input
        value={block.url}
        onChange={(e) => onChange({ ...block, url: e.target.value })}
        placeholder={isKk ? "Сурет URL мекенжайы" : "URL фотографии"}
        className="text-sm"
      />
      <Input
        value={block.caption}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder={isKk ? "Сурет сипаттамасы (міндетті емес)" : "Подпись к фото (необязательно)"}
        className="text-sm"
      />
      {block.url && (
        <div className="overflow-hidden rounded-lg border">
          <img
            src={block.url}
            alt={block.caption}
            className="h-40 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}
    </div>
  );
}

function CarouselBlockEditor({
  block,
  onChange,
  locale,
}: {
  block: CarouselBlock;
  onChange: (b: CarouselBlock) => void;
  locale: string;
}) {
  const isKk = locale === "kk";
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addImage = () => {
    onChange({
      ...block,
      images: [...block.images, { url: "", caption: "" }],
    });
  };

  const updateImage = (idx: number, field: "url" | "caption", value: string) => {
    const images = [...block.images];
    images[idx] = { ...images[idx], [field]: value };
    onChange({ ...block, images });
  };

  const removeImage = (idx: number) => {
    if (block.images.length <= 1) return;
    onChange({ ...block, images: block.images.filter((_, i) => i !== idx) });
  };

  const handleFileUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "news");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      updateImage(idx, "url", data.url);
    } catch {
      // silent fail
    } finally {
      setUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-3">
      {block.images.map((img, idx) => (
        <div key={idx} className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <div className="flex gap-1">
              <Input
                value={img.url}
                onChange={(e) => updateImage(idx, "url", e.target.value)}
                placeholder={`${isKk ? "Сурет" : "Фото"} ${idx + 1} URL`}
                className="text-sm flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 shrink-0"
                onClick={() => fileRefs.current[idx]?.click()}
                disabled={uploadingIdx === idx}
              >
                {uploadingIdx === idx
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Upload className="h-3.5 w-3.5" />}
              </Button>
              <input
                ref={(el) => { fileRefs.current[idx] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(idx, file);
                  e.target.value = "";
                }}
              />
            </div>
            <Input
              value={img.caption}
              onChange={(e) => updateImage(idx, "caption", e.target.value)}
              placeholder={isKk ? "Сипаттама" : "Подпись"}
              className="text-sm"
            />
          </div>
          {img.url && (
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border">
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 self-center text-red-400"
            onClick={() => removeImage(idx)}
            disabled={block.images.length <= 1}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1 text-xs"
        onClick={addImage}
      >
        <ImagePlus className="h-3 w-3" />
        {isKk ? "Сурет қосу" : "Добавить фото"}
      </Button>
    </div>
  );
}

function VideoBlockEditor({
  block,
  onChange,
  locale,
}: {
  block: VideoBlock;
  onChange: (b: VideoBlock) => void;
  locale: string;
}) {
  const isKk = locale === "kk";
  const embedUrl = block.url ? getEmbedUrl(block.url) : "";

  return (
    <div className="space-y-2">
      <Input
        value={block.url}
        onChange={(e) => onChange({ ...block, url: e.target.value })}
        placeholder={
          isKk
            ? "YouTube немесе Vimeo сілтемесін қойыңыз"
            : "Вставьте ссылку YouTube или Vimeo"
        }
        className="text-sm"
      />
      <Input
        value={block.caption}
        onChange={(e) => onChange({ ...block, caption: e.target.value })}
        placeholder={isKk ? "Бейне сипаттамасы (міндетті емес)" : "Подпись к видео (необязательно)"}
        className="text-sm"
      />
      {embedUrl && (
        <div className="relative overflow-hidden rounded-lg border" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {block.url && !embedUrl.includes("embed") && !embedUrl.includes("player") && (
        <p className="text-[10px] text-amber-600">
          {isKk
            ? "YouTube немесе Vimeo сілтемесін қойыңыз (мысалы: https://youtube.com/watch?v=...)"
            : "Вставьте ссылку YouTube или Vimeo (например: https://youtube.com/watch?v=...)"}
        </p>
      )}
    </div>
  );
}

function LinkBlockEditor({
  block,
  onChange,
  locale,
}: {
  block: LinkBlock;
  onChange: (b: LinkBlock) => void;
  locale: string;
}) {
  const isKk = locale === "kk";
  return (
    <div className="space-y-2">
      <Input
        value={block.url}
        onChange={(e) => onChange({ ...block, url: e.target.value })}
        placeholder="https://..."
        className="text-sm"
      />
      <Input
        value={block.label}
        onChange={(e) => onChange({ ...block, label: e.target.value })}
        placeholder={isKk ? "Сілтеме мәтіні" : "Текст ссылки"}
        className="text-sm"
      />
    </div>
  );
}
