import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Info, CalendarCheck, FileText, BookOpen, ArrowRight } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SanatoriumPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  const cards = [
    {
      href: "/sanatorium/info",
      icon: Info,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: isKk
        ? "Санаториялық-курорттық сауықтыру туралы ақпарат"
        : "Информация о санаторно-курортном оздоровлении",
      description: isKk
        ? "Санаториялық-курорттық сауықтыру бағдарламасы туралы толық ақпарат"
        : "Полная информация о программе санаторно-курортного оздоровления",
    },
    {
      href: "/sanatorium/quota",
      icon: CalendarCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: isKk ? "Санаторийге квота" : "Квота на санаторий",
      description: isKk
        ? "Санаторийге квота бөлу тәртібі мен шарттары"
        : "Порядок и условия распределения квот на санаторий",
    },
    {
      href: "/sanatorium/application-form",
      icon: FileText,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      title: isKk ? "Өтініш үлгісі" : "Образец заявления",
      description: isKk
        ? "Санаториялық сауықтыруға өтініш беру үлгісі"
        : "Образец заявления на санаторно-курортное оздоровление",
    },
    {
      href: "/sanatorium/memo",
      icon: BookOpen,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      title: isKk
        ? "Санаториялық-курорттық сауықтыру туралы жадынама"
        : "Памятка о санаторно-курортном оздоровлении",
      description: isKk
        ? "Қызметкерлерге арналған маңызды ақпарат пен нұсқаулықтар"
        : "Важная информация и инструкции для сотрудников",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">
          {isKk ? "Сервистер" : "Сервисы"}
        </p>
        <h1 className="text-2xl font-bold text-[#003DA5] sm:text-3xl">
          {isKk ? "Санаториялық-курорттық сауықтыру" : "Санаторно-курортное оздоровление"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isKk
            ? "Қызметкерлер мен олардың отбасыларына арналған сауықтыру бағдарламалары"
            : "Программы оздоровления для сотрудников и их семей"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.iconBg} ${card.iconColor}`}
            >
              <card.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                {card.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                {isKk ? "Толығырақ" : "Подробнее"}
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
