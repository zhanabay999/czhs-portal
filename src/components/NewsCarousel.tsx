"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Newspaper } from "lucide-react";
import Link from "next/link";

type Article = {
  id: string;
  slug: string;
  titleKk: string;
  titleRu: string;
  excerptKk: string | null;
  excerptRu: string | null;
  coverImageUrl: string | null;
  coverImageUrlKk: string | null;
  coverImageUrlRu: string | null;
  publishedAt: Date | null;
  isPinned: boolean;
};

export function NewsCarousel({
  articles,
  locale,
}: {
  articles: Article[];
  locale: string;
}) {
  const isKk = locale === "kk";

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(
      locale === "kk" ? "kk-KZ" : "ru-RU",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };
  const perPage = 3;
  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, Math.ceil(articles.length / perPage) - 1);
  const visible = articles.slice(page * perPage, page * perPage + perPage);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <Link key={article.id} href={`/${locale}/news/${article.slug}`} className="group">
            <article className="h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {(isKk ? article.coverImageUrlKk : article.coverImageUrlRu) || article.coverImageUrl ? (
                  <img
                    src={(isKk ? article.coverImageUrlKk : article.coverImageUrlRu) || article.coverImageUrl}
                    alt={isKk ? article.titleKk : article.titleRu}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#003DA5]/80 to-[#0066CC]/80">
                    <Newspaper className="h-10 w-10 text-white/30" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <time>{formatDate(article.publishedAt)}</time>
                </div>
                <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-gray-800 transition-colors group-hover:text-[#003DA5]">
                  {isKk ? article.titleKk : article.titleRu}
                </h3>
                {(isKk ? article.excerptKk : article.excerptRu) && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {isKk ? article.excerptKk : article.excerptRu}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {maxPage > 0 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#003DA5] hover:text-[#003DA5] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-500">
            {page + 1} / {maxPage + 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
            disabled={page === maxPage}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:border-[#003DA5] hover:text-[#003DA5] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
