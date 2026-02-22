"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

export default function NewFAQPage() {
  const router = useRouter();
  const { t } = useAdminLocale();
  const [isPending, startTransition] = useTransition();
  const [questionKk, setQuestionKk] = useState("");
  const [questionRu, setQuestionRu] = useState("");
  const [answerKk, setAnswerKk] = useState("");
  const [answerRu, setAnswerRu] = useState("");

  const handleSubmit = (status: "draft" | "published") => {
    if (!questionKk || !questionRu || !answerKk || !answerRu) {
      toast.error(t("faqForm.required"));
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionKk, questionRu, answerKk, answerRu, status }),
        });
        if (res.ok) {
          toast.success(t("faqForm.success"));
          router.push("/admin/faq");
        } else {
          toast.error(t("faqForm.error"));
        }
      } catch {
        toast.error(t("faqForm.error"));
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/faq"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("faqForm.title")}</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="kk">
            <TabsList className="mb-4">
              <TabsTrigger value="kk">{t("common.tabKk")}</TabsTrigger>
              <TabsTrigger value="ru">{t("common.tabRu")}</TabsTrigger>
            </TabsList>
            <TabsContent value="kk" className="space-y-4">
              <div>
                <Label>{t("faqForm.questionKk")}</Label>
                <Input value={questionKk} onChange={(e) => setQuestionKk(e.target.value)} />
              </div>
              <div>
                <Label>{t("faqForm.answerKk")}</Label>
                <Textarea value={answerKk} onChange={(e) => setAnswerKk(e.target.value)} rows={6} />
              </div>
            </TabsContent>
            <TabsContent value="ru" className="space-y-4">
              <div>
                <Label>{t("faqForm.questionRu")}</Label>
                <Input value={questionRu} onChange={(e) => setQuestionRu(e.target.value)} />
              </div>
              <div>
                <Label>{t("faqForm.answerRu")}</Label>
                <Textarea value={answerRu} onChange={(e) => setAnswerRu(e.target.value)} rows={6} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-3">
            <Button onClick={() => handleSubmit("draft")} variant="outline" disabled={isPending}>
              {t("faqForm.saveDraft")}
            </Button>
            <Button onClick={() => handleSubmit("published")} className="bg-[#003DA5]" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {t("faqForm.publish")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
