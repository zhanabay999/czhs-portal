"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallAppButton() {
  const locale = useLocale();
  const isKk = locale === "kk";
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    ) return;

    if (localStorage.getItem("install-dismissed")) return;
    setDismissed(false);

    const ua = navigator.userAgent;
    setIsMobile(
      /Android|iPhone|iPad|iPod/i.test(ua) || window.innerWidth < 768
    );
    setIsIOS(
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );

    // Silently capture native prompt if available
    const handler = (e: Event) => {
      e.preventDefault();
      promptRef.current = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    // Try native prompt first
    if (promptRef.current) {
      try {
        await promptRef.current.prompt();
        const { outcome } = await promptRef.current.userChoice;
        if (outcome === "accepted") {
          handleDismiss();
          return;
        }
      } catch {
        // Native prompt failed, show guide
      }
    }
    // Show manual instructions
    setShowGuide(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("install-dismissed", "1");
    setShowGuide(false);
  };

  if (dismissed || !isMobile) return null;

  return (
    <>
      {showGuide && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 md:hidden"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#003DA5]">
                {isKk ? "Қосу нұсқаулығы" : "Как установить"}
              </h3>
              <button onClick={() => setShowGuide(false)} className="p-1">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {isIOS ? (
              <>
                <p className="mb-3 text-xs text-gray-500">
                  {isKk ? "Тек Safari браузерінде жұмыс істейді" : "Работает только в Safari"}
                </p>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">1</span>
                    <span>{isKk ? 'Төменгі панельдегі "Бөлісу" ⬆ батырмасын басыңыз' : 'Нажмите "Поделиться" ⬆ внизу экрана'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">2</span>
                    <span>{isKk ? '"Басты экранға қосу" ➕ тармағын таңдаңыз' : 'Выберите "На экран Домой" ➕'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">3</span>
                    <span>{isKk ? '"Қосу" батырмасын басыңыз' : 'Нажмите "Добавить"'}</span>
                  </li>
                </ol>
              </>
            ) : (
              <>
                <p className="mb-3 text-xs text-gray-500">
                  {isKk ? "Chrome браузерінде" : "В браузере Chrome"}
                </p>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">1</span>
                    <span>{isKk ? 'Жоғарғы оң жақтағы ⋮ (үш нүкте) менюді басыңыз' : 'Нажмите ⋮ (три точки) в правом верхнем углу'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">2</span>
                    <span>{isKk ? '"Басты экранға қосу" немесе "Қолданбаны орнату" тармағын таңдаңыз' : 'Выберите "Добавить на главный экран" или "Установить приложение"'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#003DA5] text-xs font-bold text-white">3</span>
                    <span>{isKk ? '"Орнату" батырмасын басыңыз' : 'Нажмите "Установить"'}</span>
                  </li>
                </ol>
              </>
            )}

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowGuide(false)}
                className="flex-1 rounded-xl bg-[#003DA5] py-2.5 text-sm font-semibold text-white"
              >
                {isKk ? "Түсіндім" : "Понятно"}
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-500"
              >
                {isKk ? "Кейін" : "Позже"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#003DA5]/10 bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-lg md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={handleInstall}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#003DA5] px-4 py-3 text-sm font-semibold text-white active:bg-[#002d7a]"
          >
            <Download className="h-4 w-4" />
            {isKk ? "Қолданбаны орнату" : "Установить приложение"}
          </button>
          <button
            onClick={handleDismiss}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 active:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
