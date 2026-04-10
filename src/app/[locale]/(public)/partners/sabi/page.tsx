import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

type Props = { params: Promise<{ locale: string }> };

const scheduleData = [
  { dateRu: "1 марта", dateKk: "1 наурыз", dateISO: "2026-03-01", stream: 1, ageRu: "0-8 лет", ageKk: "0-8 жас", count: 73, regionRu: "Акмолинская обл, Астана, Караганда", regionKk: "Ақмола обл, Астана, Қарағанды" },
  { dateRu: "15 марта", dateKk: "15 наурыз", dateISO: "2026-03-15", stream: 2, ageRu: "0-8 лет", ageKk: "0-8 жас", count: 58, regionRu: "Атырау, Актобе, Мангистау", regionKk: "Атырау, Ақтөбе, Маңғыстау" },
  { dateRu: "29 марта", dateKk: "29 наурыз", dateISO: "2026-03-29", stream: 3, ageRu: "0-8 лет", ageKk: "0-8 жас", count: 58, regionRu: "Атырау, Актобе, Мангистау", regionKk: "Атырау, Ақтөбе, Маңғыстау" },
  { dateRu: "12 апреля", dateKk: "12 сәуір", dateISO: "2026-04-12", stream: 4, ageRu: "0-8 лет", ageKk: "0-8 жас", count: 48, regionRu: "Алматы, Шымкент", regionKk: "Алматы, Шымкент" },
  { dateRu: "26 апреля", dateKk: "26 сәуір", dateISO: "2026-04-26", stream: 5, ageRu: "0-8 лет", ageKk: "0-8 жас", count: 64, regionRu: "Жамбыл, Кызылорда", regionKk: "Жамбыл, Қызылорда" },
  { dateRu: "10 мая", dateKk: "10 мамыр", dateISO: "2026-05-10", stream: 6, ageRu: "0-8 лет", ageKk: "0-8 жас", count: 72, regionRu: "Костанай, Семей, Павлодар", regionKk: "Қостанай, Семей, Павлодар" },
  { dateRu: "24 мая", dateKk: "24 мамыр", dateISO: "2026-05-24", stream: 7, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 53, regionRu: "Акмолинская обл, Астана, Караганда", regionKk: "Ақмола обл, Астана, Қарағанды" },
  { dateRu: "7 июня", dateKk: "7 маусым", dateISO: "2026-06-07", stream: 8, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 53, regionRu: "Акмолинская обл, Астана, Караганда", regionKk: "Ақмола обл, Астана, Қарағанды" },
  { dateRu: "21 июня", dateKk: "21 маусым", dateISO: "2026-06-21", stream: 9, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 50, regionRu: "Атырау, Актобе, Мангистау", regionKk: "Атырау, Ақтөбе, Маңғыстау" },
  { dateRu: "2 августа", dateKk: "2 тамыз", dateISO: "2026-08-02", stream: 10, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 50, regionRu: "Атырау, Актобе, Мангистау", regionKk: "Атырау, Ақтөбе, Маңғыстау" },
  { dateRu: "16 августа", dateKk: "16 тамыз", dateISO: "2026-08-16", stream: 11, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 51, regionRu: "Атырау, Актобе, Мангистау", regionKk: "Атырау, Ақтөбе, Маңғыстау" },
  { dateRu: "30 августа", dateKk: "30 тамыз", dateISO: "2026-08-30", stream: 12, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 71, regionRu: "Алматы, Шымкент", regionKk: "Алматы, Шымкент" },
  { dateRu: "13 сентября", dateKk: "13 қыркүйек", dateISO: "2026-09-13", stream: 13, ageRu: "9-17 лет", ageKk: "9-17 жас", count: 50, regionRu: "Жамбыл, Кызылорда", regionKk: "Жамбыл, Қызылорда" },
  { dateRu: "27 сентября", dateKk: "27 қыркүйек", dateISO: "2026-09-27", stream: 14, ageRu: "9-17 лет", ageKk: "9-17 жас", count: 51, regionRu: "Жамбыл, Кызылорда", regionKk: "Жамбыл, Қызылорда" },
  { dateRu: "11 октября", dateKk: "11 қазан", dateISO: "2026-10-11", stream: 15, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 57, regionRu: "Костанай, Семей, Павлодар", regionKk: "Қостанай, Семей, Павлодар" },
  { dateRu: "25 октября", dateKk: "25 қазан", dateISO: "2026-10-25", stream: 16, ageRu: "9-16 лет", ageKk: "9-16 жас", count: 57, regionRu: "Костанай, Семей, Павлодар", regionKk: "Қостанай, Семей, Павлодар" },
  { dateRu: "1 ноября", dateKk: "1 қараша", dateISO: "2026-11-01", stream: 17, ageRu: "17-18 лет", ageKk: "17-18 жас", count: 50, regionRu: "Все регионы (за исключением детей 17 лет из Жамбыла и Кызылорды — они в 13, 14 потоках)", regionKk: "Барлық аймақтар (Жамбыл мен Қызылордадан 17 жастағы балаларды қоспағанда — олар 13, 14 ағындарда)" },
  { dateRu: "15 ноября", dateKk: "15 қараша", dateISO: "2026-11-15", stream: 18, ageRu: "18-33 года", ageKk: "18-33 жас", count: 50, regionRu: "Все регионы", regionKk: "Барлық аймақтар" },
];

function isPastDate(dateISO: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateISO + "T23:59:59");
  return eventDate < today;
}

export default async function SabiHealthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <BackButton label={isKk ? "Артқа" : "Назад"} />

      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
          <img src="/sabi-health-logo.png" alt="Sabi Health" className="h-24 w-24 object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk ? "Балалар оңалту орталығы «Sa`bi health»" : "Детский реабилитационный центр «Sa`bi health»"}
        </h1>
      </div>

      <div className="prose max-w-none space-y-4 text-gray-700">
        {isKk ? (
          <>
            <p>
              Sabi Health — балалардың дамуын кешенді қолдауға маманданған балалар оңалту орталығы.
              Орталық жұмысының негізгі бағыты — баланың дене, қимыл-қозғалыс және функционалдық
              дағдыларын нығайту, сондай-ақ үйлесімді өсу мен дамуға жағдай жасау.
            </p>
            <p>
              Орталық негізгі дағдыларды меңгеруде, моторика, координация және жалпы дене
              дайындығын дамытуда қосымша қолдау қажет ететін балалармен жұмыс істейді.
            </p>
            <p>
              Sabi Health өз қызметін әр баланың ерекшеліктерін, қажеттіліктерін және даму
              қарқынын ескере отырып, жеке тәсіл негізінде құрады. Орталықтың басты мақсаты —
              балаларға өз әлеуетін ашуға, өзіне деген сенімді нығайтуға көмектесу және отбасы
              мен мамандар бірге жұмыс істейтін қолайлы даму ортасын құру.
            </p>
            <p>
              Орталық ата-аналарды белсенді қолдайды, баланың назар мен қамқорлық алатын,
              ал ата-аналардың кәсіби кеңестер мен қолдау алатын кеңістігін жасайды.
            </p>
          </>
        ) : (
          <>
            <p>
              Sabi Health — детский реабилитационный центр, который специализируется на комплексной
              поддержке развития детей. Основное внимание в работе центра уделяется укреплению
              физических, двигательных и функциональных навыков, а также созданию условий для
              гармоничного роста и развития ребёнка.
            </p>
            <p>
              Центр работает с детьми, которым требуется дополнительная поддержка в освоении базовых
              навыков и развитию моторики, координации, а также общей физической подготовленности.
            </p>
            <p>
              Sabi Health строит свою деятельность на индивидуальном подходе к каждому ребёнку,
              учитывая его особенности, потребности и темп развития. Главная цель центра — помочь
              детям раскрыть свой потенциал, укрепить уверенность в себе и создать комфортную среду
              для развития, где семья и специалисты работают вместе для достижения положительных
              результатов.
            </p>
            <p>
              Центр активно поддерживает родителей, создавая пространство, где ребёнок получает
              внимание и заботу, а родители — профессиональные рекомендации и поддержку.
            </p>
          </>
        )}
      </div>

      {/* График консультаций */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-[#003DA5]">
          {isKk
            ? "Sabi Health-тен ерекше балалардың ата-аналарына арналған тегін онлайн-кеңестер кестесі"
            : "График цикла безоплатных онлайн-консультаций от Sabi Health для родителей особенных детей"}
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          {isKk
            ? "«ҚТЖ» ҰК» АҚ филиалы — «Магистральдық желі дирекциясы» қызметкерлері"
            : "Сотрудники филиала АО «НК «КТЖ» — «Дирекция магистральной сети»"}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-3 py-3 text-left font-semibold text-foreground">
                  {isKk ? "Күні" : "Дата"}
                </th>
                <th className="px-3 py-3 text-center font-semibold text-foreground">
                  {isKk ? "Ағын" : "Поток"}
                </th>
                <th className="px-3 py-3 text-center font-semibold text-foreground">
                  {isKk ? "Жасы" : "Возраст"}
                </th>
                <th className="px-3 py-3 text-center font-semibold text-foreground">
                  {isKk ? "Балалар саны" : "Кол-во детей"}
                </th>
                <th className="px-3 py-3 text-left font-semibold text-foreground">
                  {isKk ? "Аймақ" : "Регион"}
                </th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row) => {
                const past = isPastDate(row.dateISO);
                return (
                  <tr key={row.stream} className={`border-b border-border last:border-0 ${past ? "bg-green-100 text-green-900" : "hover:bg-secondary/30"}`}>
                    <td className="whitespace-nowrap px-3 py-2.5 font-medium">{isKk ? row.dateKk : row.dateRu} {past && "✓"}</td>
                    <td className="px-3 py-2.5 text-center">{row.stream}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-center">{isKk ? row.ageKk : row.ageRu}</td>
                    <td className="px-3 py-2.5 text-center">{row.count}</td>
                    <td className={`px-3 py-2.5 ${past ? "text-green-800" : "text-gray-600"}`}>{isKk ? row.regionKk : row.regionRu}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="https://www.instagram.com/sabi__health"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#003DA5] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002D7A]"
        >
          Instagram — @sabi__health
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
