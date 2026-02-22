"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Eye, Pin } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

type Article = {
  id: string;
  slug: string;
  titleKk: string;
  titleRu: string;
  status: string;
  isPinned: boolean;
  isInternal: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
};

export function NewsListClient({ articles }: { articles: Article[] }) {
  const { t } = useAdminLocale();

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    archived: "bg-gray-100 text-gray-800",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">{t("news.title")}</h1>
          <p className="text-sm text-muted-foreground">{articles.length} {t("news.count")}</p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("news.add")}
          </Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("news.heading")}</TableHead>
              <TableHead className="w-28">{t("news.status")}</TableHead>
              <TableHead className="w-24">{t("news.views")}</TableHead>
              <TableHead className="w-32">{t("news.date")}</TableHead>
              <TableHead className="w-20">{t("news.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {article.isPinned && <Pin className="h-3.5 w-3.5 text-[#C8A951]" />}
                    <span className="font-medium">{article.titleRu}</span>
                    {article.isInternal && (
                      <Badge variant="outline" className="text-xs">{t("news.internal")}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{article.titleKk}</p>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[article.status]}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell>{article.viewCount}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(article.createdAt).toLocaleDateString("ru-RU")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/admin/news/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`/kk/news/${article.slug}`} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  {t("news.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
