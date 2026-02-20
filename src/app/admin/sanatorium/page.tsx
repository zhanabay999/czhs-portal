import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function AdminSanatoriumPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">Санаторий</h1>
        <p className="text-sm text-muted-foreground">Санаторлық-курорттық сауықтыру бетін басқару</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">Санаторий бетін редакциялау мүмкіндігі</p>
          <p className="mt-2 text-sm text-muted-foreground">Мазмұнды, бағдарламаларды және құжаттарды басқарыңыз</p>
        </CardContent>
      </Card>
    </div>
  );
}
