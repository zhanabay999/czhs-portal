"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewsArticle } from "@/actions/news.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

export default function NewNewsPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const [isPending, startTransition] = useTransition();
  const [titleKk, setTitleKk] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [excerptKk, setExcerptKk] = useState("");
  const [excerptRu, setExcerptRu] = useState("");
  const [contentKk, setContentKk] = useState("");
  const [contentRu, setContentRu] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (status: "draft" | "published") => {
    if (!titleKk || !titleRu || !contentKk || !contentRu) {
      toast.error(t("newsForm.required"));
      return;
    }
    startTransition(async () => {
      try {
        await createNewsArticle({
          titleKk,
          titleRu,
          excerptKk: excerptKk || undefined,
          excerptRu: excerptRu || undefined,
          contentKk,
          contentRu,
          coverImageUrl: coverImageUrl || undefined,
          status,
          isInternal,
          isPinned,
        });
        toast.success(t("newsForm.success"));
        router.push("/admin/news");
      } catch {
        toast.error(t("newsForm.error"));
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/news"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("newsForm.title")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="kk">
                <TabsList className="mb-4">
                  <TabsTrigger value="kk">{t("newsForm.tabKk")}</TabsTrigger>
                  <TabsTrigger value="ru">{t("newsForm.tabRu")}</TabsTrigger>
                </TabsList>
                <TabsContent value="kk" className="space-y-4">
                  <div>
                    <Label>{t("newsForm.titleKk")}</Label>
                    <Input lang="kk" value={titleKk} onChange={(e) => setTitleKk(e.target.value)} placeholder={t("newsForm.titleKkPh")} />
                  </div>
                  <div>
                    <Label>{t("newsForm.excerptKk")}</Label>
                    <Textarea lang="kk" value={excerptKk} onChange={(e) => setExcerptKk(e.target.value)} placeholder={t("newsForm.excerptKkPh")} rows={2} />
                  </div>
                  <div>
                    <Label>{t("newsForm.contentKk")}</Label>
                    <Textarea lang="kk" value={contentKk} onChange={(e) => setContentKk(e.target.value)} placeholder={t("newsForm.contentKkPh")} rows={12} className="font-mono text-sm" />
                  </div>
                </TabsContent>
                <TabsContent value="ru" className="space-y-4">
                  <div>
                    <Label>{t("newsForm.titleRu")}</Label>
                    <Input lang="ru" value={titleRu} onChange={(e) => setTitleRu(e.target.value)} placeholder={t("newsForm.titleRuPh")} />
                  </div>
                  <div>
                    <Label>{t("newsForm.excerptRu")}</Label>
                    <Textarea lang="ru" value={excerptRu} onChange={(e) => setExcerptRu(e.target.value)} placeholder={t("newsForm.excerptRuPh")} rows={2} />
                  </div>
                  <div>
                    <Label>{t("newsForm.contentRu")}</Label>
                    <Textarea lang="ru" value={contentRu} onChange={(e) => setContentRu(e.target.value)} placeholder={t("newsForm.contentRuPh")} rows={12} className="font-mono text-sm" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("newsForm.settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("newsForm.coverUrl")}</Label>
                <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t("newsForm.isInternal")}</Label>
                <Switch checked={isInternal} onCheckedChange={setIsInternal} />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t("newsForm.isPinned")}</Label>
                <Switch checked={isPinned} onCheckedChange={setIsPinned} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("newsForm.publish")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => handleSubmit("draft")} variant="outline" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("newsForm.saveDraft")}
              </Button>
              <Button onClick={() => handleSubmit("published")} className="w-full bg-[#003DA5]" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {t("newsForm.publishBtn")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
