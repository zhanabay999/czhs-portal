"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock } from "lucide-react";

type Article = {
  id: string;
  slug: string;
  titleKk: string;
  titleRu: string;
  excerptKk: string | null;
  excerptRu: string | null;
  publishedAt: Date | null;
};

type MonthGroup = {
  monthKey: string;
  label: string;
  articles: Article[];
};

type YearGroup = {
  year: number;
  months: MonthGroup[];
};

export function ArchiveAccordion({
  years,
  locale,
}: {
  years: YearGroup[];
  locale: string;
}) {
  const isKk = locale === "kk";
  const [openKey, setOpenKey] = useState<string | null>(
    years[0]?.months[0]?.monthKey ?? null
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(isKk ? "kk-KZ" : "ru-RU", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="space-y-10">
      {years.map(({ year, months }) => (
        <div key={year}>
          {/* Year header */}
          <div className="mb-5 flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#003DA5]">{year}</h2>
            <div className="h-0.5 flex-1 bg-[#003DA5]/20" />
          </div>

          {/* Month accordions */}
          <div className="space-y-2">
            {months.map(({ monthKey, label, articles }) => {
              const isOpen = openKey === monthKey;
              return (
                <div key={monthKey} className="overflow-hidden rounded-lg border border-gray-200">
                  {/* Month header — clickable */}
                  <button
                    type="button"
                    onClick={() => setOpenKey(isOpen ? null : monthKey)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold capitalize text-gray-800">{label}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {articles.length}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Articles list */}
                  {isOpen && (
                    <ul className="divide-y divide-gray-100 border-t border-gray-100">
                      {articles.map((article) => (
                        <li key={article.id}>
                          <Link
                            href={`/${locale}/news/${article.slug}`}
                            className="group flex items-start gap-3 px-4 py-3 hover:bg-gray-50"
                          >
                            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-800 group-hover:text-[#003DA5]">
                                {isKk ? article.titleKk : article.titleRu}
                              </p>
                              {(isKk ? article.excerptKk : article.excerptRu) && (
                                <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                                  {isKk ? article.excerptKk : article.excerptRu}
                                </p>
                              )}
                            </div>
                            <time className="ml-auto shrink-0 text-xs text-gray-400">
                              {formatDate(article.publishedAt)}
                            </time>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
