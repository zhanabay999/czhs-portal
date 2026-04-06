import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

type Props = { params: Promise<{ locale: string }> };

const scheduleData = [
  { date: "1 марта", stream: 1, age: "0-8 лет", count: 73, region: "Акмолинская обл, Астана, Караганда" },
  { date: "15 марта", stream: 2, age: "0-8 лет", count: 58, region: "Атырау, Актобе, Мангистау" },
  { date: "29 марта", stream: 3, age: "0-8 лет", count: 58, region: "Атырау, Актобе, Мангистау" },
  { date: "12 апреля", stream: 4, age: "0-8 лет", count: 48, region: "Алматы, Шымкент" },
  { date: "26 апреля", stream: 5, age: "0-8 лет", count: 64, region: "Жамбыл, Кызылорда" },
  { date: "10 мая", stream: 6, age: "0-8 лет", count: 72, region: "Костанай, Семей, Павлодар" },
  { date: "24 мая", stream: 7, age: "9-16 лет", count: 53, region: "Акмолинская обл, Астана, Караганда" },
  { date: "7 июня", stream: 8, age: "9-16 лет", count: 53, region: "Акмолинская обл, Астана, Караганда" },
  { date: "21 июня", stream: 9, age: "9-16 лет", count: 50, region: "Атырау, Актобе, Мангистау" },
  { date: "2 августа", stream: 10, age: "9-16 лет", count: 50, region: "Атырау, Актобе, Мангистау" },
  { date: "16 августа", stream: 11, age: "9-16 лет", count: 51, region: "Атырау, Актобе, Мангистау" },
  { date: "30 августа", stream: 12, age: "9-16 лет", count: 71, region: "Алматы, Шымкент" },
  { date: "13 сентября", stream: 13, age: "9-17 лет", count: 50, region: "Жамбыл, Кызылорда" },
  { date: "27 сентября", stream: 14, age: "9-17 лет", count: 51, region: "Жамбыл, Кызылорда" },
  { date: "11 октября", stream: 15, age: "9-16 лет", count: 57, region: "Костанай, Семей, Павлодар" },
  { date: "25 октября", stream: 16, age: "9-16 лет", count: 57, region: "Костанай, Семей, Павлодар" },
  { date: "1 ноября", stream: 17, age: "17-18 лет", count: 50, region: "Все регионы (за исключением детей 17 лет из Жамбыла и Кызылорды — они в 13, 14 потоках)" },
  { date: "15 ноября", stream: 18, age: "18-33 года", count: 50, region: "Все регионы" },
];

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
              {scheduleData.map((row) => (
                <tr key={row.stream} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="whitespace-nowrap px-3 py-2.5">{row.date}</td>
                  <td className="px-3 py-2.5 text-center">{row.stream}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-center">{row.age}</td>
                  <td className="px-3 py-2.5 text-center">{row.count}</td>
                  <td className="px-3 py-2.5 text-gray-600">{row.region}</td>
                </tr>
              ))}
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
