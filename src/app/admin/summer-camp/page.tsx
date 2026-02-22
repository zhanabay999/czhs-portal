"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sun } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

export default function AdminSummerCampPage() {
  const { t } = useAdminLocale();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">{t("camp.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("camp.subtitle")}</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Sun className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{t("camp.desc")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
