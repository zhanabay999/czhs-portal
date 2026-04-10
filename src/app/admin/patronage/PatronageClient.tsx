"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLocale } from "@/components/providers/AdminLocaleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Check, HeartHandshake } from "lucide-react";
import type { PatronageBranch } from "@/db/schema";

type Curator = { name: string; position: string };

function BranchCard({ branch, isKk }: { branch: PatronageBranch; isKk: boolean }) {
  const [childrenCount, setChildrenCount] = useState(branch.childrenCount);
  const [curators, setCurators] = useState<Curator[]>(branch.curators || []);
  const [subChildrenCount, setSubChildrenCount] = useState(branch.subBranchChildrenCount || 0);
  const [subCurators, setSubCurators] = useState<Curator[]>(branch.subBranchCurators || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const hasSubBranch = !!branch.subBranchNameRu;

  function addCurator() {
    setCurators([...curators, { name: "", position: "" }]);
  }
  function removeCurator(i: number) {
    setCurators(curators.filter((_, idx) => idx !== i));
  }
  function updateCurator(i: number, field: keyof Curator, value: string) {
    const updated = [...curators];
    updated[i] = { ...updated[i], [field]: value };
    setCurators(updated);
  }

  function addSubCurator() {
    setSubCurators([...subCurators, { name: "", position: "" }]);
  }
  function removeSubCurator(i: number) {
    setSubCurators(subCurators.filter((_, idx) => idx !== i));
  }
  function updateSubCurator(i: number, field: keyof Curator, value: string) {
    const updated = [...subCurators];
    updated[i] = { ...updated[i], [field]: value };
    setSubCurators(updated);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/patronage/${branch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childrenCount,
          curators,
          subBranchChildrenCount: hasSubBranch ? subChildrenCount : null,
          subBranchCurators: hasSubBranch ? subCurators : null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    } catch {} finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-ktz-blue">
          {isKk ? branch.nameKk : branch.nameRu}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{isKk ? "Балалар саны" : "Кол-во детей"}</Label>
          <Input
            type="number"
            value={childrenCount}
            onChange={(e) => setChildrenCount(Number(e.target.value))}
            className="w-32"
          />
        </div>

        <div>
          <Label className="mb-2 block">{isKk ? "Кураторлар" : "Кураторы"}</Label>
          {curators.map((c, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <Input
                placeholder={isKk ? "Аты-жөні" : "ФИО"}
                value={c.name}
                onChange={(e) => updateCurator(i, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder={isKk ? "Лауазымы" : "Должность"}
                value={c.position}
                onChange={(e) => updateCurator(i, "position", e.target.value)}
                className="w-40"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500" onClick={() => removeCurator(i)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCurator}>
            <Plus className="mr-1 h-3 w-3" /> {isKk ? "Куратор қосу" : "Добавить куратора"}
          </Button>
        </div>

        {hasSubBranch && (
          <div className="rounded-lg border border-dashed border-yellow-400 bg-yellow-50 p-3">
            <p className="mb-3 text-sm font-semibold text-yellow-800">
              {isKk ? branch.subBranchNameKk : branch.subBranchNameRu}
            </p>
            <div className="mb-3">
              <Label>{isKk ? "Балалар саны" : "Кол-во детей"}</Label>
              <Input
                type="number"
                value={subChildrenCount}
                onChange={(e) => setSubChildrenCount(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <Label className="mb-2 block">{isKk ? "Кураторлар" : "Кураторы"}</Label>
            {subCurators.map((c, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <Input
                  placeholder={isKk ? "Аты-жөні" : "ФИО"}
                  value={c.name}
                  onChange={(e) => updateSubCurator(i, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder={isKk ? "Лауазымы" : "Должность"}
                  value={c.position}
                  onChange={(e) => updateSubCurator(i, "position", e.target.value)}
                  className="w-40"
                />
                <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500" onClick={() => removeSubCurator(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addSubCurator}>
              <Plus className="mr-1 h-3 w-3" /> {isKk ? "Куратор қосу" : "Добавить куратора"}
            </Button>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={saving}
          className={saved ? "bg-green-600 hover:bg-green-700" : "bg-ktz-blue hover:bg-ktz-blue/90"}
          size="sm"
        >
          {saved ? <><Check className="mr-1 h-4 w-4" /> {isKk ? "Сақталды" : "Сохранено"}</> :
           saving ? (isKk ? "Сақталуда..." : "Сохранение...") :
           <><Save className="mr-1 h-4 w-4" /> {isKk ? "Сақтау" : "Сохранить"}</>}
        </Button>
      </CardContent>
    </Card>
  );
}

export function PatronageClient({ branches }: { branches: PatronageBranch[] }) {
  const { locale } = useAdminLocale();
  const isKk = locale === "kk";

  const totalChildren = branches.reduce((sum, b) => sum + b.childrenCount + (b.subBranchChildrenCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <HeartHandshake className="h-6 w-6 text-ktz-blue" />
            {isKk ? "Патронаж" : "Патронаж"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isKk ? "Ерекше балалар саны" : "Всего детей с особенными потребностями"}: <strong>{totalChildren}</strong>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} isKk={isKk} />
        ))}
      </div>
    </div>
  );
}
