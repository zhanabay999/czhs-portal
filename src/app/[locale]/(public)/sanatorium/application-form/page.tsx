import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

const forms = [
  {
    file: "/forms/application-voucher.docx",
    titleRu: "Образец заявления на предоставление путёвки",
    titleKk: "Жолдама беру туралы өтініш үлгісі",
    size: "24 КБ",
  },
  {
    file: "/forms/application-material-aid.docx",
    titleRu: "Образец заявления на материальную помощь",
    titleKk: "Материалдық көмек туралы өтініш үлгісі",
    size: "20 КБ",
  },
  {
    file: "/forms/application-tax-adjustment.docx",
    titleRu: "Образец заявления на корректировку доходов, подлежащих налогообложению",
    titleKk: "Салық салынатын табыстарды түзету туралы өтініш үлгісі",
    size: "20 КБ",
  },
];

export default async function SanatoriumApplicationFormPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKk = locale === "kk";

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/sanatorium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isKk ? "Артқа" : "Назад"}
        </Link>
      </Button>

      <h1 className="mb-2 text-2xl font-bold text-[#003DA5] sm:text-3xl">
        {isKk ? "Өтініш үлгілері" : "Образцы заявлений"}
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        {isKk
          ? "Санаториялық-курорттық сауықтыруға қажетті өтініш нысандары"
          : "Формы заявлений для санаторно-курортного оздоровления"}
      </p>

      <div className="flex flex-col gap-4">
        {forms.map((form, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-foreground">
                  {isKk ? form.titleKk : form.titleRu}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  DOCX &middot; {form.size}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={`https://docs.google.com/gview?url=https://czhs-portal.vercel.app${form.file}&embedded=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    {isKk ? "Қарау" : "Просмотр"}
                  </a>
                  <a
                    href={form.file}
                    download
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#003DA5] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#002D7A]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {isKk ? "Жүктеу" : "Скачать"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
