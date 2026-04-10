import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { contests, contestants, votes, contestBlocks } from "@/db/schema";
import { desc, eq, sql, asc } from "drizzle-orm";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Vote, ArrowRight, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export default async function BeautyContestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  let contest = null;
  let contestantsList: Array<typeof contestants.$inferSelect> = [];
  let voteCount = 0;
  let blocks: typeof contestBlocks.$inferSelect[] = [];

  try {
    const [c] = await db.select().from(contests).orderBy(desc(contests.year)).limit(1);
    contest = c || null;
    if (contest) {
      contestantsList = await db.select().from(contestants).where(eq(contestants.contestId, contest.id)).orderBy(contestants.sortOrder);
      const [vc] = await db.select({ count: sql<number>`count(*)` }).from(votes).where(eq(votes.contestId, contest.id));
      voteCount = Number(vc.count);
    }
    blocks = await db.select().from(contestBlocks).where(eq(contestBlocks.isActive, true)).orderBy(asc(contestBlocks.sortOrder));
  } catch {}

  return <ContestContent locale={locale} isKk={isKk} contest={contest} contestantsList={contestantsList} voteCount={voteCount} blocks={blocks} />;
}

function ContestContent({ locale, isKk, contest, contestantsList, voteCount, blocks }: {
  locale: string; isKk: boolean;
  contest: typeof contests.$inferSelect | null;
  contestantsList: Array<typeof contestants.$inferSelect>;
  voteCount: number;
  blocks: typeof contestBlocks.$inferSelect[];
}) {
  const t = useTranslations("contest");

  const statusMap = {
    upcoming: { label: t("votingUpcoming"), color: "bg-yellow-500" },
    nominations: { label: isKk ? "Ұсыныстар" : "Номинации", color: "bg-blue-500" },
    voting: { label: t("votingActive"), color: "bg-green-500" },
    closed: { label: t("votingClosed"), color: "bg-gray-500" },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 border-b-2 border-[#003DA5] pb-3">
        <h1 className="text-2xl font-bold text-[#003DA5]">{isKk ? "Конкурстар" : "Конкурсы"}</h1>
      </div>

      {/* Contest blocks */}
      {blocks.length > 0 && (
        <section className="mb-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {blocks.map((block) => (
              <Card key={block.id} className="overflow-hidden">
                <img
                  src={block.imageUrl}
                  alt={isKk ? block.titleKk : block.titleRu}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold text-[#003DA5]">
                    {isKk ? block.titleKk : block.titleRu}
                  </h3>
                  {block.linkUrl && (
                    <a
                      href={block.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#003DA5] hover:underline"
                    >
                      {block.linkLabel || (isKk ? "Толығырақ" : "Подробнее")}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {contest ? (
        <>
          {/* Contest info */}
          <Card className="mb-8 overflow-hidden">
            {contest.coverImageUrl && (
              <img src={contest.coverImageUrl} alt={isKk ? contest.titleKk : contest.titleRu} className="h-[300px] w-full object-cover" />
            )}
            <CardContent className="p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge className={`${statusMap[contest.status].color} text-white`}>
                  {statusMap[contest.status].label}
                </Badge>
                <Badge variant="outline">{contest.year}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> {contestantsList.length} {t("contestants")}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Vote className="h-4 w-4" /> {voteCount} {t("totalVotes")}
                </span>
              </div>
              <h2 className="mb-2 text-2xl font-bold">{isKk ? contest.titleKk : contest.titleRu}</h2>
              {(isKk ? contest.descriptionKk : contest.descriptionRu) && (
                <p className="text-muted-foreground">{isKk ? contest.descriptionKk : contest.descriptionRu}</p>
              )}
            </CardContent>
          </Card>

          {/* Rules */}
          {(isKk ? contest.rulesKk : contest.rulesRu) && (
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-[#003DA5]">{t("rules")}</h2>
              <div className="prose max-w-none rounded-lg border p-6" dangerouslySetInnerHTML={{ __html: (isKk ? contest.rulesKk : contest.rulesRu)! }} />
            </section>
          )}

          {/* Contestants preview */}
          {contestantsList.length > 0 && (
            <section className="mb-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#003DA5]">{t("contestants")}</h2>
                {contest.status === "voting" && (
                  <Button asChild className="bg-[#003DA5]">
                    <Link href="/beauty-contest/vote">
                      {t("vote")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {contestantsList.map((c) => (
                  <Card key={c.id} className="overflow-hidden">
                    <img src={c.photoUrl} alt={isKk ? c.fullNameKk : c.fullNameRu} className="aspect-[3/4] w-full object-cover" />
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium">{isKk ? c.fullNameKk : c.fullNameRu}</p>
                      {c.department && <p className="text-xs text-muted-foreground">{c.department}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Crown className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{isKk ? "Конкурс жақында жарияланады" : "Конкурс скоро будет объявлен"}</p>
        </div>
      )}
    </div>
  );
}
