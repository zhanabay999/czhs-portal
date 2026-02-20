import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "super_admin") redirect("/admin");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">Баптаулар</h1>
        <p className="text-sm text-muted-foreground">Сайт баптаулары</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Settings className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">Сайт баптаулары: логотип, баннер, байланыс ақпараты</p>
        </CardContent>
      </Card>
    </div>
  );
}
