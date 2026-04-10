import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { patronageBranches } from "@/db/schema";
import { asc } from "drizzle-orm";
import { BackButton } from "@/components/ui/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, Users } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function PatronagePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  const branches = await db.select().from(patronageBranches).orderBy(asc(patronageBranches.sortOrder));
  const totalChildren = branches.reduce((sum, b) => sum + b.childrenCount + (b.subBranchChildrenCount || 0), 0);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <BackButton label={isKk ? "Артқа" : "Назад"} />

      <div className="mb-8 text-center">
        <HeartHandshake className="mx-auto mb-4 h-12 w-12 text-ktz-blue" />
        <h1 className="text-2xl font-bold text-ktz-blue sm:text-3xl">
          {isKk ? "Патронаж" : "Патронаж"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isKk
            ? "Ерекше қажеттіліктері бар балаларға қамқорлық"
            : "Шефство над детьми с особенными потребностями"}
        </p>
      </div>

      {/* Баннер с общим числом */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-ktz-blue to-ktz-blue/80 p-6 text-center text-white shadow-lg">
        <p className="text-sm uppercase tracking-wide opacity-80">
          {isKk ? "Ерекше қажеттіліктері бар балалар саны" : "Всего детей с особенными потребностями"}
        </p>
        <p className="mt-1 text-4xl font-bold">{totalChildren}</p>
      </div>

      {/* Карточки филиалов */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => {
          const curators = (branch.curators || []) as Array<{ name: string; position: string }>;
          const subCurators = (branch.subBranchCurators || []) as Array<{ name: string; position: string }>;
          const hasSubBranch = !!branch.subBranchNameRu;

          return (
            <Card key={branch.id} className="overflow-hidden">
              <div className="bg-ktz-blue px-4 py-3">
                <h3 className="font-bold text-white">{isKk ? branch.nameKk : branch.nameRu}</h3>
              </div>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-ktz-blue" />
                  <span className="text-2xl font-bold text-ktz-blue">{branch.childrenCount}</span>
                  <span className="text-sm text-muted-foreground">{isKk ? "бала" : "детей"}</span>
                </div>

                {curators.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                      {isKk ? "Кураторлар" : "Кураторы"}
                    </p>
                    <ul className="space-y-1">
                      {curators.map((c, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium">{c.name}</span>
                          {c.position && <span className="ml-1 text-xs text-muted-foreground">({c.position})</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {hasSubBranch && (
                  <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-3">
                    <p className="mb-1 text-sm font-semibold text-yellow-800">
                      {isKk ? branch.subBranchNameKk : branch.subBranchNameRu}
                    </p>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-yellow-700">{branch.subBranchChildrenCount || 0}</span>
                      <span className="text-xs text-yellow-600">{isKk ? "бала" : "детей"}</span>
                    </div>
                    {subCurators.length > 0 && (
                      <ul className="space-y-1">
                        {subCurators.map((c, i) => (
                          <li key={i} className="text-sm">
                            <span className="font-medium">{c.name}</span>
                            {c.position && <span className="ml-1 text-xs text-muted-foreground">({c.position})</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {curators.length === 0 && !hasSubBranch && (
                  <p className="text-sm italic text-muted-foreground">
                    {isKk ? "Кураторлар тағайындалмаған" : "Кураторы не назначены"}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
