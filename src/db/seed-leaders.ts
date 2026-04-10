import { db } from "./index.js";
import { leaders } from "./schema.js";

async function seed() {
  // Check if already seeded
  const existing = await db.select().from(leaders);
  if (existing.length > 0) {
    console.log("Already seeded:", existing.length, "leaders");
    process.exit(0);
  }

  // Level 1 - Director
  const [director] = await db.insert(leaders).values({
    nameRu: "Рахметов Сакен Маратович",
    nameKk: "Рахметов Сакен Маратұлы",
    positionRu: "Управляющий директор по инфраструктуре — директор филиала",
    positionKk: "Инфрақұрылым жөніндегі басқарушы директор — филиал директоры",
    level: 1,
    sortOrder: 1,
  }).returning();
  console.log("✓ Director:", director.nameRu);

  // Level 2 - Deputies
  const deputiesData = [
    { nameRu: "Утегенов Руслан Куктюбаевич", nameKk: "Утегенов Руслан Күктібайұлы", positionRu: "Заместитель директора по эксплуатации и безопасности", positionKk: "Пайдалану және қауіпсіздік жөніндегі директордың орынбасары", sortOrder: 1 },
    { nameRu: "Досанов Абай Сабитович", nameKk: "Досанов Абай Сабитұлы", positionRu: "Заместитель директора по вокзальному хозяйству, содержанию зданий и инженерных систем", positionKk: "Вокзал шаруашылығы, ғимараттар мен инженерлік жүйелерді ұстау жөніндегі директордың орынбасары", sortOrder: 2 },
    { nameRu: "Урынбаев Кайырбай Ермекович", nameKk: "Урынбаев Қайырбай Ермекұлы", positionRu: "Главный инженер", positionKk: "Бас инженер", sortOrder: 3 },
    { nameRu: "Амантаев Ануар Тлектесович", nameKk: "Амантаев Ануар Тлектесұлы", positionRu: "Заместитель директора по инфраструктурному развитию", positionKk: "Инфрақұрылымдық даму жөніндегі директордың орынбасары", sortOrder: 4 },
    { nameRu: "Кирович Александр Сергеевич", nameKk: "Кирович Александр Сергеевич", positionRu: "Заместитель директора по экономике и финансам", positionKk: "Экономика және қаржы жөніндегі директордың орынбасары", sortOrder: 5 },
    { nameRu: "Каримов Нурлан Манапович", nameKk: "Каримов Нұрлан Манапұлы", positionRu: "Заместитель директора по снабжению", positionKk: "Жабдықтау жөніндегі директордың орынбасары", sortOrder: 6 },
  ];

  const deputies: Record<string, string> = {};
  for (const d of deputiesData) {
    const [inserted] = await db.insert(leaders).values({ ...d, level: 2 }).returning();
    deputies[d.nameRu.split(" ")[0]] = inserted.id;
    console.log("✓ Deputy:", d.nameRu);
  }

  // Level 3 - Executive Directors
  const execsData = [
    { nameRu: "Барбасов Руслан Назибекович", nameKk: "Барбасов Руслан Назибекұлы", positionRu: "Главный менеджер по корпоративной безопасности", positionKk: "Корпоративтік қауіпсіздік жөніндегі бас менеджер", sortOrder: 1, parent: "Утегенов" },
    { nameRu: "Айкынбеков Серик Батырханович", nameKk: "Айқынбеков Серік Батырханұлы", positionRu: "Исполнительный директор по безопасности", positionKk: "Қауіпсіздік жөніндегі атқарушы директор", sortOrder: 2, parent: "Утегенов" },
    { nameRu: "Бубиканов Арман Сражадинович", nameKk: "Бубиканов Арман Сражадинұлы", positionRu: "Исполнительный директор по эксплуатации", positionKk: "Пайдалану жөніндегі атқарушы директор", sortOrder: 3, parent: "Утегенов" },
    { nameRu: "Корпебаев Жубан Кырыкбаевич", nameKk: "Көрпебаев Жұбан Қырықбайұлы", positionRu: "Исполнительный директор по эксплуатации вокзалов, содержанию зданий и инженерных систем", positionKk: "Вокзалдарды пайдалану, ғимараттар мен инженерлік жүйелерді ұстау жөніндегі атқарушы директор", sortOrder: 4, parent: "Досанов" },
    { nameRu: "Назарбеков Ерболат Кадырович", nameKk: "Назарбеков Ерболат Қадырұлы", positionRu: "Исполнительный директор по организации доступа на МЖС", positionKk: "МЖД-ға қол жеткізуді ұйымдастыру жөніндегі атқарушы директор", sortOrder: 5, parent: "Урынбаев" },
    { nameRu: "Кизатов Ерлан Ануарбекович", nameKk: "Қизатов Ерлан Ануарбекұлы", positionRu: "Исполнительный директор по экономике", positionKk: "Экономика жөніндегі атқарушы директор", sortOrder: 6, parent: "Кирович" },
    { nameRu: "Елеукен Айсулу Ержановна", nameKk: "Елеукен Айсұлу Ержанқызы", positionRu: "Исполнительный директор — директор ЦЖСК", positionKk: "Атқарушы директор — ЦЖСК директоры", sortOrder: 7, parent: "Каримов" },
    { nameRu: "Кожахметов Руслан Сабитович", nameKk: "Қожахметов Руслан Сабитұлы", positionRu: "Исполнительный директор по правовым вопросам", positionKk: "Құқықтық мәселелер жөніндегі атқарушы директор", sortOrder: 8, parent: "Каримов" },
  ];

  for (const e of execsData) {
    const { parent, ...rest } = e;
    await db.insert(leaders).values({
      ...rest,
      level: 3,
      parentId: deputies[parent] || null,
    });
    console.log("✓ Executive:", e.nameRu, "→", parent);
  }

  const total = await db.select().from(leaders);
  console.log("\n✅ Done! Total:", total.length, "leaders seeded");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
