import { db } from "./index";
import { patronageBranches } from "./schema";

const branches = [
  { code: "czhs", nameKk: "ЦЖС аппараты", nameRu: "ЦЖС аппарат", childrenCount: 12, sortOrder: 0 },
  { code: "nzhs-1", nameKk: "НЖС-1 Ақмола", nameRu: "НЖС-1 Акмола", childrenCount: 119, sortOrder: 1, subBranchNameKk: "Астана тораптық бөлімшесі", subBranchNameRu: "Узел Астана", subBranchChildrenCount: 0, subBranchCurators: [] },
  { code: "nzhs-2", nameKk: "НЖС-2 Қостанай", nameRu: "НЖС-2 Костанай", childrenCount: 68, sortOrder: 2 },
  { code: "nzhs-3", nameKk: "НЖС-3 Павлодар", nameRu: "НЖС-3 Павлодар", childrenCount: 78, sortOrder: 3 },
  { code: "nzhs-4", nameKk: "НЖС-4 Қарағанды", nameRu: "НЖС-4 Караганда", childrenCount: 74, sortOrder: 4 },
  { code: "nzhs-6", nameKk: "НЖС-6 Семей", nameRu: "НЖС-6 Семей", childrenCount: 58, sortOrder: 5 },
  { code: "nzhs-7", nameKk: "НЖС-7 Алматы", nameRu: "НЖС-7 Алматы", childrenCount: 74, sortOrder: 6 },
  { code: "nzhs-8", nameKk: "НЖС-8 Жамбыл", nameRu: "НЖС-8 Жамбыл", childrenCount: 84, sortOrder: 7 },
  { code: "nzhs-9", nameKk: "НЖС-9 Шымкент", nameRu: "НЖС-9 Шымкент", childrenCount: 64, sortOrder: 8 },
  { code: "nzhs-10", nameKk: "НЖС-10 Қызылорда", nameRu: "НЖС-10 Кызылорда", childrenCount: 83, sortOrder: 9 },
  { code: "nzhs-11", nameKk: "НЖС-11 Ақтөбе", nameRu: "НЖС-11 Актобе", childrenCount: 121, sortOrder: 10 },
  { code: "nzhs-13", nameKk: "НЖС-13 Атырау", nameRu: "НЖС-13 Атырау", childrenCount: 65, sortOrder: 11 },
  { code: "nzhs-14", nameKk: "НЖС-14 Маңғыстау", nameRu: "НЖС-14 Мангистау", childrenCount: 106, sortOrder: 12 },
];

async function seed() {
  for (const branch of branches) {
    await db.insert(patronageBranches).values({
      ...branch,
      curators: [],
    }).onConflictDoNothing();
  }
  console.log("Patronage branches seeded!");
  process.exit(0);
}

seed().catch(console.error);
