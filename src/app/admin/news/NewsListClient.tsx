"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Eye,
  Pin,
  Search,
  Trash2,
  Archive,
  Loader2,
  Filter,
  BarChart3,
} from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { deleteNewsArticle } from "@/actions/news.actions";
import { toast } from "sonner";

type Article = {
  id: string;
  slug: string;
  titleKk: string;
  titleRu: string;
  status: string;
  isPinned: boolean;
  isInternal: boolean;
  viewCount: number;
  categoryName?: string | null;
  publishedAt: string | null;
  createdAt: string;
};

type StatusFilter = "all" | "draft" | "published" | "archived";

export function NewsListClient({ articles }: { articles: Article[] }) {
  const { t, locale } = useAdminLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, Record<string, string>> = {
    draft: { kk: "Жоба", ru: "Черновик" },
    published: { kk: "Жарияланған", ru: "Опубликовано" },
    archived: { kk: "Мұрағат", ru: "Архив" },
  };

  const filtered = articles.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.titleRu.toLowerCase().includes(q) ||
        a.titleKk.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
    archived: articles.filter((a) => a.status === "archived").length,
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(locale === "kk" ? `"${title}" мұрағатқа жіберу?` : `Архивировать "${title}"?`)) return;
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteNewsArticle(id);
        toast.success(locale === "kk" ? "Мұрағатталды" : "Архивировано");
        router.refresh();
      } catch {
        toast.error(locale === "kk" ? "Қате" : "Ошибка");
      } finally {
        setDeletingId(null);
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">{t("news.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} {t("news.count")}
          </p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("news.add")}
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${statusFilter === "all" ? "border-[#003DA5] bg-blue-50" : "border-border"}`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#003DA5]" />
            <span className="text-xs font-medium text-muted-foreground">
              {locale === "kk" ? "Барлығы" : "Всего"}
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-[#003DA5]">{stats.total}</p>
        </button>
        <button
          onClick={() => setStatusFilter("published")}
          className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${statusFilter === "published" ? "border-green-500 bg-green-50" : "border-border"}`}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-muted-foreground">
              {locale === "kk" ? "Жарияланған" : "Опубликовано"}
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-green-700">{stats.published}</p>
        </button>
        <button
          onClick={() => setStatusFilter("draft")}
          className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${statusFilter === "draft" ? "border-yellow-500 bg-yellow-50" : "border-border"}`}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <span className="text-xs font-medium text-muted-foreground">
              {locale === "kk" ? "Жобалар" : "Черновики"}
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-yellow-700">{stats.draft}</p>
        </button>
        <button
          onClick={() => setStatusFilter("archived")}
          className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${statusFilter === "archived" ? "border-gray-500 bg-gray-50" : "border-border"}`}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-xs font-medium text-muted-foreground">
              {locale === "kk" ? "Мұрағат" : "Архив"}
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-600">{stats.archived}</p>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={locale === "kk" ? "Жаңалық іздеу..." : "Поиск по новостям..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">{t("news.heading")}</TableHead>
              <TableHead className="w-24">{t("news.status")}</TableHead>
              <TableHead className="hidden w-28 sm:table-cell">
                {locale === "kk" ? "Санат" : "Рубрика"}
              </TableHead>
              <TableHead className="w-20">{t("news.views")}</TableHead>
              <TableHead className="w-28">{t("news.date")}</TableHead>
              <TableHead className="w-28 text-right">{t("news.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((article) => (
              <TableRow key={article.id} className={article.status === "archived" ? "opacity-50" : ""}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {article.isPinned && (
                      <Pin className="h-3.5 w-3.5 shrink-0 text-[#C8A951]" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium">{article.titleRu}</p>
                      <p className="truncate text-xs text-muted-foreground">{article.titleKk}</p>
                    </div>
                    {article.isInternal && (
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {t("news.internal")}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[article.status]}>
                    {statusLabels[article.status]?.[locale] || article.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                  {article.categoryName || "—"}
                </TableCell>
                <TableCell>
                  <span className="text-sm tabular-nums">{article.viewCount}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })
                    : new Date(article.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/admin/news/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/ru/news/${article.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {article.status !== "archived" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        disabled={deletingId === article.id}
                        onClick={() => handleDelete(article.id, article.titleRu)}
                      >
                        {deletingId === article.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Archive className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  {search
                    ? locale === "kk"
                      ? "Іздеу нәтижесі жоқ"
                      : "Ничего не найдено"
                    : t("news.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
