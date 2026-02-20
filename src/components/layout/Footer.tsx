"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Train, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <footer className="border-t border-border bg-[#0A1628] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003DA5]">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">{tc("appName")}</p>
                <p className="text-xs text-gray-400">{tc("appFullName")}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">{tc("companyName")}</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-semibold text-white">
              {tc("appName")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/news"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/sanatorium"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("sanatorium")}
                </Link>
              </li>
              <li>
                <Link
                  href="/vacancies"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("vacancies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/summer-camp"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("summerCamp")}
                </Link>
              </li>
            </ul>
          </div>

          {/* More links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">
              {tc("readMore")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/reorganization-faq"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="/beauty-contest"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("beautyContest")}
                </Link>
              </li>
              <li>
                <Link
                  href="/sports"
                  className="transition-colors hover:text-[#C8A951]"
                >
                  {t("sports")}
                </Link>
              </li>
              <li>
                <a
                  href="https://job.railways.kz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-[#C8A951]"
                >
                  {t("vacancies")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 font-semibold text-white">
              Байланыс / Контакты
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#C8A951]" />
                <span>Астана қ., Қазақстан</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#C8A951]" />
                <span>+7 (7172) 60-30-00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#C8A951]" />
                <span>info@czhs.kz</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {tc("companyName")} -{" "}
            {tc("appFullName")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/czhs_ktz_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#C8A951]"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
