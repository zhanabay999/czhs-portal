"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";

type FAQItem = { id: string; questionKk: string; questionRu: string; status: string };

export function FAQListClient({ items }: { items: FAQItem[] }) {
  const { t } = useAdminLocale();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#003DA5]">{t("faq.title")}</h1>
          <p className="text-sm text-muted-foreground">{items.length} {t("faq.count")}</p>
        </div>
        <Button asChild className="bg-[#003DA5]">
          <Link href="/admin/faq/new"><Plus className="mr-2 h-4 w-4" />{t("faq.add")}</Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("faq.question")}</TableHead>
              <TableHead className="w-28">{t("faq.status")}</TableHead>
              <TableHead className="w-20">{t("faq.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.questionRu}</p>
                  <p className="text-xs text-muted-foreground">{item.questionKk}</p>
                </TableCell>
                <TableCell>
                  <Badge className={item.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                  {t("faq.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
