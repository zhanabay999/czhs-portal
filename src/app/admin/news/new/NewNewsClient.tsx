"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createNewsArticle } from "@/actions/news.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Save, Clock, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import {
  NewsBlockEditor,
  blocksToHtml,
  type ContentBlock,
} from "@/components/admin/NewsBlockEditor";
import { TagsInput } from "@/components/admin/TagsInput";
import { CoverImageUpload } from "@/components/admin/CoverImageUpload";

type Category = {
  id: string;
  slug: string;
  nameKk: string;
  nameRu: string;
};

export function NewNewsClient({ categories, allTags = [] }: { categories: Category[]; allTags?: string[] }) {
  const router = useRouter();
  const { t, locale } = useAdminLocale();
  const [isPending, startTransition] = useTransition();

  const [titleKk, setTitleKk] = useState("");
  const [titleRu, setTitleRu] = useState("");
  const [excerptKk, setExcerptKk] = useState("");
  const [excerptRu, setExcerptRu] = useState("");

  // Block editors per language
  const [blocksKk, setBlocksKk] = useState<ContentBlock[]>([
    { type: "text", id: "init_kk", content: "" },
  ]);
  const [blocksRu, setBlocksRu] = useState<ContentBlock[]>([
    { type: "text", id: "init_ru", content: "" },
  ]);

  // Cover images — KK is source, RU syncs automatically unless overridden
  const [coverImageUrlKk, setCoverImageUrlKk] = useState("");
  const [coverImageUrlRu, setCoverImageUrlRu] = useState("");
  const [ruImageOverridden, setRuImageOverridden] = useState(false);

  const [categoryId, setCategoryId] = useState("none");

  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  // Scheduled publishing
  const [useSchedule, setUseSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");

  // Preview toggle
  const [showPreview, setShowPreview] = useState(false);

  const handleKkImageChange = (url: string) => {
    setCoverImageUrlKk(url);
    if (!ruImageOverridden) {
      setCoverImageUrlRu(url);
    }
  };

  const handleSubmit = (status: "draft" | "published") => {
    if (!titleKk || !titleRu) {
      toast.error(locale === "kk" ? "Тақырыпты толтырыңыз" : "Заполните заголовок");
      return;
    }

    const contentKk = blocksToHtml(blocksKk);
    const contentRu = blocksToHtml(blocksRu);

    if (!contentKk && !contentRu) {
      toast.error(locale === "kk" ? "Мазмұнды толтырыңыз" : "Добавьте содержание");
      return;
    }

    let scheduledAt: string | undefined;
    if (useSchedule && scheduleDate && status === "published") {
      scheduledAt = `${scheduleDate}T${scheduleTime}:00`;
      status = "draft";
    }

    startTransition(async () => {
      try {
        await createNewsArticle({
          titleKk,
          titleRu,
          excerptKk: excerptKk || undefined,
          excerptRu: excerptRu || undefined,
          contentKk: contentKk || titleKk,
          contentRu: contentRu || titleRu,
          coverImageUrlKk: coverImageUrlKk || undefined,
          coverImageUrlRu: coverImageUrlRu || undefined,
          categoryId: categoryId !== "none" ? categoryId : undefined,
          status,

          isPinned,
          tags,
          scheduledAt,
        });
        toast.success(
          scheduledAt
            ? locale === "kk" ? "Жаңалық жоспарланды" : "Новость запланирована"
            : t("newsForm.success")
        );
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
          <Link href="/admin/news">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ktz-blue">{t("newsForm.title")}</h1>
          <p className="text-xs text-muted-foreground">
            {locale === "kk" ? "Блоктарды қосып конструктор арқылы құрыңыз" : "Собирайте новость из блоков как конструктор"}
          </p>
        </div>
        <Button
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className={showPreview ? "bg-[#003DA5]" : ""}
        >
          <Eye className="mr-2 h-4 w-4" />
          {locale === "kk" ? "Алдын ала қарау" : "Предпросмотр"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {/* Main content */}
        <div className="xl:col-span-3">
          {showPreview ? (
            /* Preview — два столбца */
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ktz-blue">ҚАЗ</p>
                  {coverImageUrlKk && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      <img src={coverImageUrlKk} alt="" className="h-36 w-full object-cover" />
                    </div>
                  )}
                  <h2 className="mb-2 text-xl font-bold">{titleKk || "..."}</h2>
                  {excerptKk && <p className="mb-4 text-sm text-muted-foreground">{excerptKk}</p>}
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blocksToHtml(blocksKk) }} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">РУС</p>
                  {coverImageUrlRu && (
                    <div className="mb-3 overflow-hidden rounded-lg">
                      <img src={coverImageUrlRu} alt="" className="h-36 w-full object-cover" />
                    </div>
                  )}
                  <h2 className="mb-2 text-xl font-bold">{titleRu || "..."}</h2>
                  {excerptRu && <p className="mb-4 text-sm text-muted-foreground">{excerptRu}</p>}
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blocksToHtml(blocksRu) }} />
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Editor — два столбца рядом */
            <div className="grid gap-4 md:grid-cols-2">
              {/* Казахский */}
              <Card className="border-l-4 border-l-ktz-blue">
                <CardContent className="p-5 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ktz-blue">ҚАЗ</p>

                  {/* KK обложка */}
                  <div>
                    <Label className="mb-1.5 block text-xs text-muted-foreground">
                      {locale === "kk" ? "Басты сурет" : "Обложка"}
                    </Label>
                    <CoverImageUpload
                      value={coverImageUrlKk}
                      onChange={handleKkImageChange}
                      locale={locale}
                      onClear={() => handleKkImageChange("")}
                    />
                  </div>

                  <div>
                    <Label>{t("newsForm.titleKk")}</Label>
                    <Input
                      lang="kk"
                      value={titleKk}
                      onChange={(e) => setTitleKk(e.target.value)}
                      placeholder={t("newsForm.titleKkPh")}
                      className="text-lg font-bold"
                    />
                  </div>
                  <div>
                    <Label>{t("newsForm.excerptKk")}</Label>
                    <Input
                      lang="kk"
                      value={excerptKk}
                      onChange={(e) => setExcerptKk(e.target.value)}
                      placeholder={t("newsForm.excerptKkPh")}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Мазмұн блоктары
                    </Label>
                    <NewsBlockEditor blocks={blocksKk} onChange={setBlocksKk} locale="kk" />
                  </div>
                </CardContent>
              </Card>

              {/* Русский */}
              <Card className="border-l-4 border-l-gray-300">
                <CardContent className="p-5 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">РУС</p>

                  {/* RU обложка — умная синхронизация */}
                  <div>
                    {!ruImageOverridden ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">
                            {locale === "kk" ? "Басты сурет" : "Обложка"}
                          </Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => setRuImageOverridden(true)}
                          >
                            {locale === "kk" ? "Басқа сурет қою" : "Поставить другое фото"}
                          </Button>
                        </div>
                        {coverImageUrlRu ? (
                          <div className="relative overflow-hidden rounded-lg border">
                            <img src={coverImageUrlRu} alt="" className="h-40 w-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                                {locale === "kk" ? "ҚАЗ-дан синхрондалды" : "Синхронизировано с KK"}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-14 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-muted-foreground">
                            {locale === "kk" ? "ҚАЗ суреті автоматты қосылады" : "Фото добавится автоматически из KK"}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <CoverImageUpload
                          value={coverImageUrlRu}
                          onChange={setCoverImageUrlRu}
                          locale={locale}
                          onClear={() => setCoverImageUrlRu("")}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="w-full gap-1.5 text-xs text-muted-foreground"
                          onClick={() => {
                            setRuImageOverridden(false);
                            setCoverImageUrlRu(coverImageUrlKk);
                          }}
                        >
                          <RotateCcw className="h-3 w-3" />
                          {locale === "kk" ? "ҚАЗ суретіне қайту" : "Вернуть фото из KK"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>{t("newsForm.titleRu")}</Label>
                    <Input
                      lang="ru"
                      value={titleRu}
                      onChange={(e) => setTitleRu(e.target.value)}
                      placeholder={t("newsForm.titleRuPh")}
                      className="text-lg font-bold"
                    />
                  </div>
                  <div>
                    <Label>{t("newsForm.excerptRu")}</Label>
                    <Input
                      lang="ru"
                      value={excerptRu}
                      onChange={(e) => setExcerptRu(e.target.value)}
                      placeholder={t("newsForm.excerptRuPh")}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Блоки содержания
                    </Label>
                    <NewsBlockEditor blocks={blocksRu} onChange={setBlocksRu} locale="ru" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category & settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("newsForm.settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-xs">
                  {locale === "kk" ? "Рубрика" : "Рубрика"}
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {locale === "kk" ? "Санатсыз" : "Без рубрики"}
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {locale === "kk" ? cat.nameKk : cat.nameRu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm">{t("newsForm.isPinned")}</Label>
                  <p className="text-[10px] text-muted-foreground">
                    {locale === "kk" ? "Жоғарыда бекіту" : "Закрепить наверху"}
                  </p>
                </div>
                <Switch checked={isPinned} onCheckedChange={setIsPinned} />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {locale === "kk" ? "Хэштегтер" : "Хэштеги"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TagsInput tags={tags} onChange={setTags} locale={locale} suggestions={allTags} />
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                {locale === "kk" ? "Жоспарлау" : "Планирование"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  {locale === "kk" ? "Кейінге жоспарлау" : "Отложенная публикация"}
                </Label>
                <Switch checked={useSchedule} onCheckedChange={setUseSchedule} />
              </div>
              {useSchedule && (
                <div className="space-y-2 rounded-lg bg-blue-50 p-3">
                  <div>
                    <Label className="text-xs">
                      {locale === "kk" ? "Күні" : "Дата"}
                    </Label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">
                      {locale === "kk" ? "Уақыты" : "Время"}
                    </Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Publish actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("newsForm.publish")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleSubmit("draft")}
                variant="outline"
                className="w-full"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("newsForm.saveDraft")}
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                className="w-full bg-[#003DA5]"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {useSchedule && scheduleDate
                  ? locale === "kk" ? "Жоспарлау" : "Запланировать"
                  : t("newsForm.publishBtn")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
