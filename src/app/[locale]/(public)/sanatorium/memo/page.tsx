import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  BookOpen,
  Users,
  ClipboardList,
  Award,
  FileText,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Banknote,
  CircleDollarSign,
  BadgeCheck,
  Heart,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = { params: Promise<{ locale: string }> };

export default async function SanatoriumMemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/sanatorium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isKk ? "Артқа" : "Назад"}
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="mb-10 rounded-2xl bg-gradient-to-br from-[#003DA5] to-[#0052CC] p-8 text-white shadow-xl sm:p-10">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-8 w-8 text-blue-200" />
          <span className="text-sm font-medium uppercase tracking-wider text-blue-200">
            {isKk ? "Жадынама" : "Памятка"}
          </span>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {isKk
            ? "Жолдамалар беру және санаториялық-курорттық сауықтыруға материалдық көмек көрсету"
            : "Предоставление путёвок и оказание материальной помощи на санаторно-курортное оздоровление"}
        </h1>
        <p className="mt-3 text-sm text-blue-100">
          {isKk
            ? "Астана қ., 2025 жыл"
            : "г. Астана, 2025 год"}
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="mb-10 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
          <ClipboardList className="h-5 w-5 text-[#003DA5]" />
          {isKk ? "Мазмұны" : "Содержание"}
        </h2>
        <ol className="space-y-2 text-sm">
          {[
            { id: "distribution", label: isKk ? "Жолдамалар мен материалдық көмек бөлу тәртібі" : "Порядок распределения путёвок и оказания материальной помощи" },
            { id: "vouchers", label: isKk ? "Санаториялық-курорттық сауықтыруға жолдамалар" : "Путёвки на санаторно-курортное оздоровление" },
            { id: "financial-aid", label: isKk ? "Санаториялық-курорттық сауықтыруға материалдық көмек" : "Материальная помощь на санаторно-курортное оздоровление" },
            { id: "contacts", label: isKk ? "Байланыс ақпараты" : "Контактная информация" },
          ].map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003DA5]/10 text-xs font-bold text-[#003DA5]">
                  {i + 1}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ========== SECTION 1: Distribution Order ========== */}
      <section id="distribution" className="mb-12 scroll-mt-20">
        <SectionHeader
          icon={<Users className="h-6 w-6" />}
          number={1}
          title={isKk ? "Жолдамалар мен материалдық көмек бөлу тәртібі" : "Порядок распределения путёвок и оказания материальной помощи"}
        />

        {/* Voucher conditions */}
        <InfoCard
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          title={isKk ? "Жолдамалар беру шарттары" : "Условия предоставления путёвок"}
          color="blue"
        >
          <ul className="space-y-3 text-sm text-muted-foreground">
            <BulletItem icon={<Clock className="h-4 w-4" />}>
              {isKk
                ? "12 күнтізбелік күннен аспайтын мерзімге және 12 айда 1 реттен жиі емес беріледі"
                : "Предоставляются на срок не более 12 календарных дней и не чаще 1 раза в 12 месяцев"}
            </BulletItem>
            <BulletItem icon={<Heart className="h-4 w-4" />}>
              {isKk
                ? "Медициналық көрсетілімдер болған кезде және еңбек демалысы кезеңінде беріледі"
                : "Предоставляются при наличии медицинских показаний и в период трудового отпуска"}
            </BulletItem>
            <BulletItem icon={<Building2 className="h-4 w-4" />}>
              {isKk
                ? "Лауазымдық жалақысы 180 АЕК-тен асатын қызметкерлерге жолдамалар 1-ші және 4-ші тоқсандарда «С. Сейфуллин атындағы санаторий-профилакторий» филиалында беріледі"
                : "Работникам с окладом свыше 180 МРП путёвки предоставляются в 1-м и 4-м кварталах в филиале «Санаторий-профилакторий имени С. Сейфуллина»"}
            </BulletItem>
          </ul>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <p className="mb-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
              {isKk ? "1-ші және 4-ші тоқсандарда рұқсат етіледі:" : "В 1-м и 4-м кварталах допускается:"}
            </p>
            <ol className="space-y-1.5 text-xs text-blue-700 dark:text-blue-400">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                {isKk
                  ? "Жолдаманы отбасы мүшелеріне қайта ресімдеу"
                  : "Переоформление путёвки на членов семьи работника"}
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                {isKk
                  ? "Отбасы мүшесімен бірге пайдалану (бір мезгілде орналасу)"
                  : "Использование путёвки совместно с одним из членов семьи при одновременном заселении"}
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                {isKk
                  ? "Отбасы мүшелері үшін қосымша жолдама беру (бір мезгілде орналасу)"
                  : "Выдача дополнительной путёвки для членов семьи (при одновременном заселении)"}
              </li>
            </ol>
          </div>
        </InfoCard>

        {/* Financial aid conditions */}
        <InfoCard
          icon={<Banknote className="h-5 w-5 text-emerald-600" />}
          title={isKk ? "Материалдық көмек көрсету шарттары" : "Условия оказания материальной помощи"}
          color="emerald"
        >
          <ul className="space-y-3 text-sm text-muted-foreground">
            <BulletItem icon={<Shield className="h-4 w-4" />}>
              {isKk
                ? "Бір жолдама/мат. көмек тек бір адамға ғана берілед (баланы ілестірмей)"
                : "Одна путёвка/мат. помощь предназначена только для одного человека (без сопровождения ребёнка)"}
            </BulletItem>
            <BulletItem icon={<CircleDollarSign className="h-4 w-4" />}>
              {isKk
                ? "60 АЕК-тен аспайтын мөлшерде, тәулігіне 6 АЕК-тен аспайтын, стандарт сыныптан жоғары емес"
                : "В размере до 60 МРП, до 6 МРП за сутки, не выше класса «стандарт»"}
            </BulletItem>
            <BulletItem icon={<BadgeCheck className="h-4 w-4" />}>
              {isKk
                ? "Темір жол көлігіндегі жұмыс стажы кемінде 5 жыл және медициналық ұйымның жолдамасы болуы тиіс"
                : "Необходим стаж работы на ж/д транспорте не менее 5 лет и направление мед. организации"}
            </BulletItem>
          </ul>

          <div className="mt-4 rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-900 dark:bg-red-950/30">
            <div className="flex gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs text-red-700 dark:text-red-400">
                {isKk
                  ? "Басқа адамға беруге тыйым салынады! Анықталған жағдайда қызметкер мат. көмектің толық мөлшерін төлейді және 4 жыл бойы мат. көмек алу құқығынан айырылады."
                  : "Передача другому лицу запрещена! В случае выявления работник оплачивает полный размер мат. помощи и лишается права на её получение в течение 4 лет."}
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Quota distribution */}
        <InfoCard
          icon={<Users className="h-5 w-5 text-amber-600" />}
          title={isKk
            ? "Квота аймақтық және желілік деңгейлерде қалай бөлінеді?"
            : "Как распределяется квота на путёвки?"
          }
          color="amber"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.2 бөлімінің 18, 19, 20 тармақтары" : "Пункты 18, 19, 20 раздел 3.2 Правил"}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <StepCard step={1} color="amber">
              {isKk
                ? "HR бөлімшелер арасында жолдамалар/мат. көмек бойынша бөлу тізімдемесін қалыптастырады (ПП-70%, ӘБП және зейнеткерлер – 30%)"
                : "HR формирует разнарядку по путёвкам/мат. помощи среди подразделений (ПП-70%, АУП и пенсионеры – 30%)"}
            </StepCard>
            <StepCard step={2} color="amber">
              {isKk
                ? "ЦЖСКсоц HR бекіткен тізімдеме негізінде аймақтық деңгейдегі бөлімшелер арасында тізімдемелерді қалыптастырады"
                : "ЦЖСКсоц на основании утверждённой разнарядки формирует разнарядки среди подразделений регионального уровня"}
            </StepCard>
            <StepCard step={3} color="amber">
              {isKk
                ? "Бөлімшелерде тиісті комиссиялар құрылады (төраға, ПБ өкілі, кадр блогы, кәсіподақ, хатшы)"
                : "В подразделениях создаются комиссии (председатель, представитель ПБ, HR, профсоюз, секретарь)"}
            </StepCard>
          </div>
        </InfoCard>

        {/* Scoring system */}
        <InfoCard
          icon={<Star className="h-5 w-5 text-purple-600" />}
          title={isKk ? "Балл жинау жүйесі" : "Система начисления баллов"}
          color="purple"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.2 бөлімінің 30 тармағы" : "Пункт 30 раздел 3.2 Правил"}
          </p>
          <div className="space-y-3">
            <ScoreRow
              points={isKk ? "5 балл / 3 балл" : "5 баллов / 3 балла"}
              label={isKk
                ? "Темір жол саласындағы жұмыс стажы — толық бір жыл = 5 балл, бір жылдан аз = 3 балл (тек мат. көмекте)"
                : "Стаж работы в ж/д отрасли — полный год = 5 баллов, менее года = 3 балла (только при мат. помощи)"}
            />
            <ScoreRow
              points={isKk ? "20 балл" : "20 баллов"}
              label={isKk
                ? "Диспансерлік есепте тұрғандар үшін медициналық ұйымның қорытындысы"
                : "Заключение мед. организации о необходимости оздоровления (для состоящих на диспансерном учёте)"}
            />
            <ScoreRow
              points={isKk ? "10 балл" : "10 баллов"}
              label={isKk
                ? "«Құрметті теміржолшы» төсбелгісінің болуы"
                : "Наличие нагрудного знака «Почётный железнодорожник»"}
            />
          </div>

          <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-900 dark:bg-purple-950/30">
            <p className="text-xs text-purple-700 dark:text-purple-400">
              {isKk
                ? "Тең балл жинағанда әлеуметтік осал топтарға (көп балалы отбасылар, жалғызбасты ата-аналар, аз қамтылған отбасылар, мүгедектер) артықшылық беріледі."
                : "При равном количестве баллов предпочтение отдаётся социально уязвимым слоям населения (многодетные семьи, родители-одиночки, малообеспеченные, инвалиды)."}
            </p>
          </div>
        </InfoCard>
      </section>

      {/* ========== SECTION 2: Vouchers ========== */}
      <section id="vouchers" className="mb-12 scroll-mt-20">
        <SectionHeader
          icon={<FileText className="h-6 w-6" />}
          number={2}
          title={isKk ? "Санаториялық-курорттық сауықтыруға жолдамалар" : "Путёвки на санаторно-курортное оздоровление"}
        />

        {/* Required documents */}
        <InfoCard
          icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
          title={isKk
            ? "Есепке қою үшін қажетті құжаттар"
            : "Необходимые документы для постановки на учёт"
          }
          color="blue"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.2 бөлімінің 22 тармағы" : "Пункт 22 раздел 3.2 Правил"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <DocumentCard number={1}>
              {isKk
                ? "Ережелердің 1-қосымшасы бойынша санаториялық-курорттық сауықтыруға жолдама беру туралы өтініш"
                : "Заявление о предоставлении путёвки по форме приложения 1 к Правилам"}
            </DocumentCard>
            <DocumentCard number={2}>
              {isKk
                ? "Медициналық ұйымның санаториялық-курорттық сауықтыру қажеттілігі туралы қорытындысы"
                : "Заключение мед. организации о необходимости санаторно-курортного оздоровления"}
            </DocumentCard>
            <DocumentCard number={3}>
              {isKk
                ? "Лауазымдық жалақы туралы анықтама (қызметкерлер үшін)"
                : "Справка о должностном окладе (для работников)"}
            </DocumentCard>
            <DocumentCard number={4}>
              {isKk
                ? "Ережелердің 3-қосымшасы бойынша салық салынатын табысты түзету туралы өтініш (қызметкерлер)"
                : "Заявление о применении корректировки доходов по форме приложения 3 к Правилам (работники)"}
            </DocumentCard>
          </div>
        </InfoCard>

        {/* Payment */}
        <InfoCard
          icon={<CircleDollarSign className="h-5 w-5 text-emerald-600" />}
          title={isKk ? "Берілген жолдамалардың төлемі" : "Оплата выданных путёвок"}
          color="emerald"
        >
          <p className="mb-4 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.4 бөлімінің 46, 47 тармақтары" : "Пункты 46, 47 раздел 3.4 Правил"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <Users className="h-4 w-4 text-blue-500" />
                {isKk ? "Қызметкерлер (жалақыдан)" : "Работники (из зарплаты)"}
              </h4>
              <div className="space-y-2">
                <PaymentRow type={isKk ? "Стандарт" : "Стандарт"} percent="10%" />
                <PaymentRow type={isKk ? "Жартылай люкс" : "Полулюкс"} percent="20%" />
                <PaymentRow type={isKk ? "Люкс" : "Люкс"} percent="30%" />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <Heart className="h-4 w-4 text-rose-500" />
                {isKk ? "Зейнеткерлер (аударым)" : "Пенсионеры (перечисление)"}
              </h4>
              <div className="space-y-2">
                <PaymentRow type={isKk ? "Стандарт" : "Стандарт"} percent="10%" />
                <PaymentRow type={isKk ? "Жартылай люкс" : "Полулюкс"} percent="15%" />
                <PaymentRow type={isKk ? "Люкс" : "Люкс"} percent="20%" />
              </div>
            </div>
          </div>
        </InfoCard>

        {/* Secretary duties */}
        <InfoCard
          icon={<BadgeCheck className="h-5 w-5 text-indigo-600" />}
          title={isKk ? "Хатшының міндеттері" : "Обязанности секретаря комиссии"}
          color="indigo"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.2 бөлімінің 23 тармағы" : "Пункт 23 раздел 3.2 Правил"}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {(isKk ? [
              "Жолдама/мат. көмек туралы өтініштерді қабылдау және тіркеу",
              "Санаториялық-курорттық сауықтыруды қажет ететін қызметкерлер мен зейнеткерлерді есепке алу",
              "Қызметкерлер мен зейнеткерлердің балдарын есепке алу",
              "Салық салынатын табысты түзету туралы өтініштерді қабылдау",
              "Жолдаманы қызметкерлерге тапсыру актісін ресімдеу",
              "Әрбір жоспарланған кезекке дейін 10 күн бұрын тізімді ұсыну",
              "SAP жүйесіне 3 жұмыс күні ішінде деректер енгізу",
              "Сауалнамаларды қабылдау және сақтау",
            ] : [
              "Приём и регистрация заявлений работников и пенсионеров",
              "Учёт нуждающихся в санаторно-курортном оздоровлении",
              "Учёт баллов работников и пенсионеров",
              "Приём заявлений о корректировке налогооблагаемых доходов",
              "Оформление акта передачи путёвки для выписки электронных счетов-фактур",
              "Представление списков за 10 календарных дней до каждого планируемого заезда",
              "Занесение данных в SAP в течение 3 рабочих дней со дня заезда",
              "Приём и хранение опросников (приложение 7)",
            ]).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </section>

      {/* ========== SECTION 3: Financial Aid ========== */}
      <section id="financial-aid" className="mb-12 scroll-mt-20">
        <SectionHeader
          icon={<Banknote className="h-6 w-6" />}
          number={3}
          title={isKk
            ? "Санаториялық-курорттық сауықтыруға материалдық көмек"
            : "Материальная помощь на санаторно-курортное оздоровление"
          }
        />

        {/* Required documents for financial aid */}
        <InfoCard
          icon={<ClipboardList className="h-5 w-5 text-teal-600" />}
          title={isKk
            ? "Материалдық көмек алу үшін қажетті құжаттар"
            : "Необходимые документы для получения материальной помощи"
          }
          color="teal"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.3 бөлімінің 41 тармағы" : "Пункт 41 раздел 3.3 Правил"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DocumentCard number={1}>
              {isKk
                ? "Ережелердің 2-қосымшасы бойынша материалдық көмек көрсету туралы өтініш"
                : "Заявление об оказании мат. помощи по форме приложения 2 к Правилам"}
            </DocumentCard>
            <DocumentCard number={2}>
              {isKk
                ? "Ережелердің 3-қосымшасы бойынша салық салынатын табысты түзету туралы өтініш"
                : "Заявление о корректировке доходов по форме приложения 3 к Правилам"}
            </DocumentCard>
            <DocumentCard number={3}>
              {isKk
                ? "Медициналық ұйымның санаториялық-курорттық сауықтыру қажеттілігі туралы қорытындысы"
                : "Заключение мед. организации о необходимости оздоровления"}
            </DocumentCard>
            <DocumentCard number={4}>
              {isKk
                ? "Лауазымдық жалақы туралы анықтама"
                : "Справка о должностном окладе"}
            </DocumentCard>
            <DocumentCard number={5}>
              {isKk ? "Келісім өтініші" : "Заявление-согласие"}
            </DocumentCard>
          </div>
        </InfoCard>

        {/* Documents to submit to CFO */}
        <InfoCard
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          title={isKk
            ? "ЦФО/РЦО-ға ұсынылуы тиіс құжаттар"
            : "Документы для предоставления в ЦФО/РЦО"
          }
          color="orange"
        >
          <p className="mb-3 text-xs text-muted-foreground">
            {isKk ? "Ережелердің 3.3 бөлімінің 43 тармағы" : "Пункт 43 раздел 3.3 Правил"}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {(isKk ? [
              "Санаториялық-курорттық карта",
              "Жолдама үшін төленген шоттың фискалды чегі бар кіріс кассалық ордері",
              "Санаторийге жолдаманың кері талоны / емделгенін растайтын құжат және санаториялық-курорттық кітапша",
              "Көрсетілген қызмет актісі, шот-фактура",
            ] : [
              "Санаторно-курортная карта",
              "Приходной кассовый ордер с фискальным чеком оплаченного счёта за путёвку",
              "Обратный талон к путёвке / документ, подтверждающий лечение в санатории, и санаторно-курортная книжка",
              "Акт оказанных услуг, счёт-фактура",
            ]).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {isKk
                  ? "Материалдық көмек алған қызметкер жолдама алуға үміткер бола алмайды."
                  : "Работник, получивший материальную помощь, не может претендовать на получение путёвки."}
              </p>
            </div>
          </div>
        </InfoCard>

        {/* Sanatorium list */}
        <InfoCard
          icon={<Building2 className="h-5 w-5 text-cyan-600" />}
          title={isKk
            ? "Санаториялар тізімі"
            : "Перечень санаториев"
          }
          color="cyan"
        >
          <p className="mb-4 text-xs text-muted-foreground">
            {isKk
              ? "«ҚТЖ» ҰК» АҚ Кадрлық комитетінің 30.05.25ж. хаттамасының қосымшасы"
              : "Приложение к протоколу Кадрового комитета АО «НК «ҚТЖ» от 30.05.25г. №ЦЗК-06/6"}
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Image
              src="/sanatorium-table.png"
              alt={isKk ? "Санаториялар тізімі" : "Перечень санаториев"}
              width={2340}
              height={1620}
              className="w-full"
              quality={90}
            />
          </div>
        </InfoCard>
      </section>

      {/* ========== SECTION 4: Contacts ========== */}
      <section id="contacts" className="mb-8 scroll-mt-20">
        <SectionHeader
          icon={<Phone className="h-6 w-6" />}
          number={4}
          title={isKk ? "Байланыс ақпараты" : "Контактная информация"}
        />

        <div className="rounded-xl border border-border bg-gradient-to-br from-card to-accent/30 p-6 shadow-sm">
          <p className="mb-5 text-sm text-muted-foreground">
            {isKk
              ? "HR мамандарының кері байланысы берілмеген немесе дұрыс берілмеген жағдайда ЦЖСКадр әлеуметтік мәселелерді үйлестіру блогына хабарласыңыз:"
              : "В случае непредоставления или некорректной обратной связи HR специалистов просим обращаться в блок по координации социальных вопросов ЦЖСКадр:"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard
              name={isKk ? "Махамеджанова Қырмызы Оразовна" : "Махамеджанова Кырмызы Оразовна"}
              phone="+7 7172 60 53 05"
              email="Makhamedzhanova_k@railways.kz"
              address={isKk
                ? "Астана қ., Қонаев к-сі 6, «Б» корпусы, 1701 кабинет"
                : "г. Астана, ул. Кунаева 6, корпус «Б», каб. 1701"
              }
            />
            <ContactCard
              name={isKk ? "Нұрпейсова Сания Қырықбаевна" : "Нурпейсова Сания Кырыкбаевна"}
              phone="+7 7172 60 53 07"
              email="Nurpeisova_S@railways.kz"
              address={isKk
                ? "Астана қ., Қонаев к-сі 6, «Б» корпусы, 1701 кабинет"
                : "г. Астана, ул. Кунаева 6, корпус «Б», каб. 1701"
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============ Sub-components ============ */

function SectionHeader({
  icon,
  number,
  title,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#003DA5] text-white shadow-md">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#003DA5]">
          {number === 1
            ? "Раздел"
            : number === 2
              ? "Раздел"
              : number === 3
                ? "Раздел"
                : "Раздел"}{" "}
          {number}
        </p>
        <h2 className="text-lg font-bold text-foreground sm:text-xl">{title}</h2>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const borderColors: Record<string, string> = {
    blue: "border-l-blue-500",
    emerald: "border-l-emerald-500",
    amber: "border-l-amber-500",
    purple: "border-l-purple-500",
    indigo: "border-l-indigo-500",
    teal: "border-l-teal-500",
    orange: "border-l-orange-500",
    cyan: "border-l-cyan-500",
  };

  return (
    <div
      className={`mb-5 rounded-xl border border-border border-l-4 ${borderColors[color] || "border-l-blue-500"} bg-card p-5 shadow-sm`}
    >
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function BulletItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-[#003DA5]">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

function StepCard({
  step,
  color,
  children,
}: {
  step: number;
  color: string;
  children: React.ReactNode;
}) {
  const bgColors: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  };

  return (
    <div className="rounded-lg border border-border bg-accent/30 p-3">
      <span
        className={`mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${bgColors[color] || bgColors.blue}`}
      >
        {step}
      </span>
      <p className="text-xs text-muted-foreground">{children}</p>
    </div>
  );
}

function ScoreRow({ points, label }: { points: string; label: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-accent/20 p-3">
      <span className="shrink-0 rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-400">
        {points}
      </span>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function DocumentCard({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-accent/20 p-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">
        {number}
      </span>
      <p className="text-xs text-muted-foreground">{children}</p>
    </div>
  );
}

function PaymentRow({ type, percent }: { type: string; percent: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-accent/30 px-3 py-2">
      <span className="text-xs text-muted-foreground">{type}</span>
      <span className="rounded-full bg-[#003DA5]/10 px-2.5 py-0.5 text-xs font-bold text-[#003DA5]">
        {percent}
      </span>
    </div>
  );
}

function ContactCard({
  name,
  phone,
  email,
  address,
}: {
  name: string;
  phone: string;
  email: string;
  address: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-bold text-foreground">{name}</h4>
      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#003DA5]" />
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-[#003DA5]">
            {phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-[#003DA5]" />
          <a href={`mailto:${email}`} className="hover:text-[#003DA5]">
            {email}
          </a>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#003DA5]" />
          <span>{address}</span>
        </div>
      </div>
    </div>
  );
}
