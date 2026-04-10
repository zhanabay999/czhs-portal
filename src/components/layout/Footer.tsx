"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { InstallAppButton } from "@/components/InstallAppButton";

export function Footer() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isKk = locale === "kk";

  return (
    <>
    <footer id="footer" className="bg-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Company Info - 2 columns */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-5 flex items-center gap-2">
              <img
                src={isKk ? "/czhs-logo-kk.png" : "/czhs-logo-ru.png"}
                alt={isKk ? "Қазақстан Темір Жолы" : "Қазақстан Темір Жолы"}
                className="h-10 w-auto brightness-0 invert object-contain"
              />
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-background/50">
              {isKk
                ? "Магистральдық желі дирекциясының корпоративтік порталы. Ақпарат, жаңалықтар мен қызметкерлерге арналған сервистер."
                : "Корпоративный портал Дирекции магистральной сети. Информация, новости и сервисы для сотрудников."}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="tel:+XXXXXXXXXX"
                className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
              >
                <Phone className="h-4 w-4" />
                +X(XXXX) XX-XX-XX
              </a>
              <a
                href="mailto:info@czhs.kz"
                className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
              >
                <Mail className="h-4 w-4" />
                info@czhs.kz
              </a>
              <div className="flex items-start gap-2 text-sm text-background/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {isKk ? "Астана қ., Д. Қонаев к-сі, 6" : "г. Астана, ул. Д. Кунаева, 6"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-background">
              {isKk ? "Навигация" : "Навигация"}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/" className="text-sm text-background/50 transition-colors hover:text-background">
                  {tc("home")}
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("news")}
                </Link>
              </li>
              <li>
                <Link href="/sanatorium" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("sanatorium")}
                </Link>
              </li>
              <li>
                <Link href="/vacancies" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("vacancies")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-background">
              {isKk ? "Сервистер" : "Сервисы"}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/summer-camp" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("summerCamp")}
                </Link>
              </li>
              <li>
                <Link href="/beauty-contest" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("beautyContest")}
                </Link>
              </li>
              <li>
                <Link href="/sports" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("sports")}
                </Link>
              </li>
              <li>
                <a
                  href="https://job.railways.kz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-background/50 transition-colors hover:text-background"
                >
                  job.railways.kz <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Useful */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-background">
              {isKk ? "Пайдалы" : "Полезное"}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/reorganization-faq" className="text-sm text-background/50 transition-colors hover:text-background">
                  {t("faq")}
                </Link>
              </li>
              <li>
                <a
                  href="https://railways.kz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-background/50 transition-colors hover:text-background"
                >
                  railways.kz
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/czhs_ktz_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 text-background/50 transition-colors hover:bg-[#E1306C] hover:text-white"
                title="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://t.me/czhs_ktz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 text-background/50 transition-colors hover:bg-[#0088cc] hover:text-white"
                title="Telegram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-background/40 sm:flex-row lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {tc("companyName")} — {isKk ? "ЦЖС Порталы" : "ЦЖС Порталы"}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://railways.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-background/60"
            >
              railways.kz
            </a>
            <a
              href="https://job.railways.kz"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-background/60"
            >
              job.railways.kz
            </a>
            <Link href="/login" className="transition-colors hover:text-background/60">
              {tc("login")}
            </Link>
          </div>
        </div>
      </div>
    </footer>

      {/* Mobile install PWA button */}
      <InstallAppButton />
    </>
  );
}
