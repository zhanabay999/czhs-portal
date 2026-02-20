"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, LogIn, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VotePage() {
  const t = useTranslations("contest");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isKk = locale === "kk";
  const { data: session, status } = useSession();
  const [contest, setContest] = useState<{
    id: string;
    status: string;
    contestants: Array<{
      id: string;
      fullNameKk: string;
      fullNameRu: string;
      department: string | null;
      photoUrl: string;
    }>;
  } | null>(null);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/contest/active");
        if (res.ok) {
          const data = await res.json();
          setContest(data.contest);
          setVotedFor(data.votedFor);
        }
      } catch {} finally {
        setLoading(false);
      }
    }
    if (session) loadData();
    else setLoading(false);
  }, [session]);

  const handleVote = (contestantId: string) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/contest/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contestantId, contestId: contest?.id }),
        });
        if (res.ok) {
          setVotedFor(contestantId);
          toast.success(t("voted"));
        } else {
          const data = await res.json();
          toast.error(data.error || "Error");
        }
      } catch {
        toast.error("Error");
      }
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#003DA5]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Crown className="h-16 w-16 text-[#C8A951]" />
        <h2 className="text-2xl font-bold">{t("loginToVote")}</h2>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            {tc("login")}
          </Link>
        </Button>
      </div>
    );
  }

  if (!contest || contest.status !== "voting") {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Crown className="h-16 w-16 text-gray-300" />
        <h2 className="text-xl font-bold text-muted-foreground">{t("votingUpcoming")}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-[#003DA5]">{t("vote")}</h1>
        <div className="mx-auto h-1 w-20 rounded bg-[#C8A951]" />
        {votedFor && (
          <Badge className="mt-4 bg-green-500 text-white">{t("alreadyVoted")}</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {contest.contestants.map((c) => (
          <Card key={c.id} className={`overflow-hidden transition-all ${votedFor === c.id ? "ring-2 ring-[#C8A951]" : ""}`}>
            <img src={c.photoUrl} alt={isKk ? c.fullNameKk : c.fullNameRu} className="aspect-[3/4] w-full object-cover" />
            <CardContent className="p-4 text-center">
              <p className="mb-1 font-semibold">{isKk ? c.fullNameKk : c.fullNameRu}</p>
              {c.department && <p className="mb-3 text-xs text-muted-foreground">{c.department}</p>}
              {votedFor === c.id ? (
                <Badge className="bg-green-500 text-white"><Check className="mr-1 h-3 w-3" />{t("voted")}</Badge>
              ) : !votedFor ? (
                <Button
                  size="sm"
                  onClick={() => handleVote(c.id)}
                  disabled={isPending}
                  className="w-full bg-[#003DA5] hover:bg-[#0052D4]"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("voteFor")}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
