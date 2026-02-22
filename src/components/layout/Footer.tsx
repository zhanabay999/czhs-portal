"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Train, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isKk = locale === "kk";

  return (
    <footer className="border-t border-gray-200 bg-[#0A1628] text-gray-400">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003DA5]">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">{tc("appFullName")}</p>
                <p className="text-xs">{tc("companyName")}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              {isKk
                ? "Магистральдық желі дирекциясының корпоративтік ақпараттық порталы"
                : "Корпоративный информационный портал Дирекции магистральной сети"}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-300">
              {isKk ? "Бөлімдер" : "Разделы"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news" className="transition-colors hover:text-white">{t("news")}</Link></li>
              <li><Link href="/sanatorium" className="transition-colors hover:text-white">{t("sanatorium")}</Link></li>
              <li><Link href="/vacancies" className="transition-colors hover:text-white">{t("vacancies")}</Link></li>
              <li><Link href="/summer-camp" className="transition-colors hover:text-white">{t("summerCamp")}</Link></li>
            </ul>
          </div>

          {/* More links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-300">
              {isKk ? "Қосымша" : "Дополнительно"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/reorganization-faq" className="transition-colors hover:text-white">{t("faq")}</Link></li>
              <li><Link href="/beauty-contest" className="transition-colors hover:text-white">{t("beautyContest")}</Link></li>
              <li><Link href="/sports" className="transition-colors hover:text-white">{t("sports")}</Link></li>
              <li>
                <a
                  href="https://job.railways.kz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  job.railways.kz <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts + Social */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-300">
              {isKk ? "Байланыс" : "Контакты"}
            </h3>
            <ul className="mb-6 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                <span>{isKk ? "Астана қ., Қазақстан" : "г. Астана, Казахстан"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gray-500" />
                <span>+7 (7172) 60-30-00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gray-500" />
                <span>info@czhs.kz</span>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/czhs_ktz_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-colors hover:bg-[#E1306C] hover:text-white"
                title="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://t.me/czhs_ktz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 transition-colors hover:bg-[#0088cc] hover:text-white"
                title="Telegram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.504-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {tc("companyName")} — {tc("appFullName")}</p>
          <div className="flex items-center gap-4">
            <a href="https://railways.kz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">railways.kz</a>
            <a href="https://job.railways.kz" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">job.railways.kz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
