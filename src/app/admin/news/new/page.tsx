"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewsArticle, getCategories } from "@/actions/news.actions";
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

export default function NewNewsPage() {
  const router = useRouter();
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
      toast.error("Барлық міндетті өрістерді толтырыңыз");
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
        toast.success("Жаңалық сәтті сақталды");
        router.push("/admin/news");
      } catch {
        toast.error("Қате орын алды");
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/news"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#003DA5]">Жаңа жаңалық</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="kk">
                <TabsList className="mb-4">
                  <TabsTrigger value="kk">Қазақша</TabsTrigger>
                  <TabsTrigger value="ru">Русский</TabsTrigger>
                </TabsList>
                <TabsContent value="kk" className="space-y-4">
                  <div>
                    <Label>Тақырып (ҚАЗ) *</Label>
                    <Input value={titleKk} onChange={(e) => setTitleKk(e.target.value)} placeholder="Жаңалық тақырыбы" />
                  </div>
                  <div>
                    <Label>Қысқаша сипаттама (ҚАЗ)</Label>
                    <Textarea value={excerptKk} onChange={(e) => setExcerptKk(e.target.value)} placeholder="Қысқаша мәтін..." rows={2} />
                  </div>
                  <div>
                    <Label>Мазмұны (ҚАЗ) *</Label>
                    <Textarea value={contentKk} onChange={(e) => setContentKk(e.target.value)} placeholder="Жаңалық мазмұны (HTML қолдау көрсетіледі)..." rows={10} />
                  </div>
                </TabsContent>
                <TabsContent value="ru" className="space-y-4">
                  <div>
                    <Label>Заголовок (РУС) *</Label>
                    <Input value={titleRu} onChange={(e) => setTitleRu(e.target.value)} placeholder="Заголовок новости" />
                  </div>
                  <div>
                    <Label>Краткое описание (РУС)</Label>
                    <Textarea value={excerptRu} onChange={(e) => setExcerptRu(e.target.value)} placeholder="Краткий текст..." rows={2} />
                  </div>
                  <div>
                    <Label>Содержание (РУС) *</Label>
                    <Textarea value={contentRu} onChange={(e) => setContentRu(e.target.value)} placeholder="Содержание новости (поддержка HTML)..." rows={10} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Баптаулар</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Мұқаба суреті URL</Label>
                <Input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center justify-between">
                <Label>Ішкі жаңалық</Label>
                <Switch checked={isInternal} onCheckedChange={setIsInternal} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Бекітілген</Label>
                <Switch checked={isPinned} onCheckedChange={setIsPinned} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Жариялау</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => handleSubmit("draft")} variant="outline" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Жоба ретінде сақтау
              </Button>
              <Button onClick={() => handleSubmit("published")} className="w-full bg-[#003DA5]" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Жариялау
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
