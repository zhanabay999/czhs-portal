import { Card, CardContent } from "@/components/ui/card";
import { Sun } from "lucide-react";

export default function AdminSummerCampPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#003DA5]">Жазғы лагерь</h1>
        <p className="text-sm text-muted-foreground">Балалардың жазғы демалысын басқару</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Sun className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">Ауысымдарды, фотогалереяны және құжаттарды басқарыңыз</p>
        </CardContent>
      </Card>
    </div>
  );
}
