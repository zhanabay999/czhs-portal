"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { User, X } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

type Leader = {
  id: string;
  nameKk: string;
  nameRu: string;
  positionKk: string;
  positionRu: string;
  photoUrl: string | null;
  photoPosition: string | null;
  level: number;
  sortOrder: number;
  parentId: string | null;
};

/* ─── Animated connecting line ─── */
function ConnectingLine({ show }: { show: boolean }) {
  return (
    <div className="flex justify-center">
      <div
        className={`w-0.5 bg-gradient-to-b from-ktz-blue/40 to-ktz-blue/10 transition-all duration-700 ease-out ${show ? "h-8 opacity-100" : "h-0 opacity-0"}`}
      />
    </div>
  );
}

/* ─── Branch lines from parent to multiple children ─── */
function BranchLines({ count, show }: { count: number; show: boolean }) {
  if (count <= 1) return <ConnectingLine show={show} />;
  return (
    <div className={`flex flex-col items-center transition-all duration-500 ${show ? "opacity-100" : "opacity-0"}`}>
      {/* Vertical line down */}
      <div className={`w-0.5 bg-ktz-blue/30 transition-all duration-500 ${show ? "h-5" : "h-0"}`} />
      {/* Horizontal connector */}
      <div className={`h-0.5 bg-ktz-blue/20 transition-all duration-700 delay-200 ${show ? "w-full max-w-md" : "w-0"}`} />
    </div>
  );
}

/* ─── Leader Card ─── */
function LeaderCard({
  leader,
  isKk,
  size = "md",
  onClick,
  isExpanded,
  hasChildren,
  dimmed,
  zoomed,
  fillHeight,
}: {
  leader: Leader;
  isKk: boolean;
  size?: "lg" | "md" | "sm" | "xs";
  onClick?: () => void;
  isExpanded?: boolean;
  hasChildren?: boolean;
  dimmed?: boolean;
  zoomed?: boolean;
  fillHeight?: boolean;
}) {
  const styles = {
    lg: { card: "w-44 sm:w-52", photo: "h-28 w-28 sm:h-36 sm:w-36", icon: "h-10 w-10", name: "text-xs sm:text-sm font-bold", pos: "text-[10px] sm:text-xs" },
    md: { card: "w-28 sm:w-36", photo: "h-20 w-20 sm:h-24 sm:w-24", icon: "h-6 w-6", name: "text-[11px] sm:text-xs font-semibold", pos: "text-[9px] sm:text-[10px]" },
    sm: { card: "w-26 sm:w-32", photo: "h-16 w-16 sm:h-20 sm:w-20", icon: "h-5 w-5", name: "text-[10px] sm:text-xs font-semibold", pos: "text-[8px] sm:text-[10px]" },
    xs: { card: "w-24 sm:w-28", photo: "h-14 w-14 sm:h-16 sm:w-16", icon: "h-4 w-4", name: "text-[9px] sm:text-[11px] font-medium", pos: "text-[8px] sm:text-[9px]" },
  };
  const s = styles[size];

  const borderClass =
    size === "lg"
      ? "border-4 border-yellow-500 ring-2 ring-yellow-300 shadow-lg"
      : isExpanded || zoomed
        ? "border-3 border-ktz-blue shadow-xl ring-2 ring-ktz-blue/30"
        : "border-2 border-ktz-blue/20 shadow-md";

  return (
    <div
      className={`${s.card} flex flex-col items-center text-center transition-all duration-500 ease-out
        ${fillHeight ? "flex-1" : ""}
        ${onClick ? "cursor-pointer group" : ""}
        ${dimmed ? "opacity-30 scale-90 blur-[1px]" : ""}
        ${zoomed ? "scale-110" : ""}
      `}
      onClick={onClick}
    >
      <div className={`relative ${s.photo} shrink-0 overflow-hidden rounded-full ${borderClass} transition-all duration-500 ${onClick ? "group-hover:scale-105" : ""}`}>
        {leader.photoUrl ? (
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={leader.photoUrl} alt={isKk ? leader.nameKk : leader.nameRu} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: leader.photoPosition || "50% 20%" }} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ktz-blue/10">
            <User className={`${s.icon} text-ktz-blue/40`} />
          </div>
        )}
      </div>
      {/* Должность — высота по содержимому */}
      <div className="mt-2 w-full">
        <p className={`${s.pos} w-full leading-snug text-ktz-blue font-medium text-center`}>
          {isKk ? leader.positionKk : leader.positionRu}
        </p>
      </div>
      {/* ФИО — прижато к низу карточки */}
      <div className="mt-auto pt-2 w-full">
        <p className={`${s.name} w-full leading-snug text-gray-900 text-center`}>
          {isKk ? leader.nameKk : leader.nameRu}
        </p>
      </div>
      {/* Индикатор — фиксированная высота чтобы все ФИО были на одном уровне */}
      <div className="h-8 flex items-center justify-center">
        {hasChildren && !isExpanded && !zoomed && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ktz-blue/10 text-ktz-blue/50 group-hover:bg-ktz-blue group-hover:text-white transition-all duration-300">
            <span className="text-sm leading-none">▼</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Full recursive tree with animated lines ─── */
function FullTree({
  parentId,
  leaders,
  isKk,
  depth = 0,
  show,
}: {
  parentId: string;
  leaders: Leader[];
  isKk: boolean;
  depth?: number;
  show: boolean;
}) {
  const children = leaders.filter((l) => l.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  if (children.length === 0) return null;

  const size = depth === 0 ? "md" : "sm";
  const baseDelay = depth * 300;

  return (
    <div className="flex flex-col items-center">
      <BranchLines count={children.length} show={show} />
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 items-stretch">
        {children.map((child, i) => {
          const hasKids = leaders.some((l) => l.parentId === child.id);
          const delay = baseDelay + i * 120;
          return (
            <div
              key={child.id}
              className="flex flex-col items-center"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
              }}
            >
              <LeaderCard leader={child} isKk={isKk} size={size} fillHeight={!hasKids} />
              {hasKids && (
                <FullTree
                  parentId={child.id}
                  leaders={leaders}
                  isKk={isKk}
                  depth={depth + 1}
                  show={show}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
export function LeadershipOrgChart({ leaders, locale }: { leaders: Leader[]; locale: string }) {
  const isKk = locale === "kk";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showTree, setShowTree] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);

  const director = leaders.filter((l) => l.level === 1);
  const deputies = leaders.filter((l) => l.level === 2).sort((a, b) => a.sortOrder - b.sortOrder);

  const half = Math.ceil(deputies.length / 2);
  const row1 = deputies.slice(0, half);
  const row2 = deputies.slice(half);

  const hasChildren = (id: string) => leaders.some((l) => l.parentId === id);
  const selectedLeader = selectedId ? leaders.find((l) => l.id === selectedId) : null;

  const handleClick = useCallback((id: string) => {
    if (selectedId === id) {
      setShowTree(false);
      setTimeout(() => setSelectedId(null), 400);
    } else {
      setShowTree(false);
      setSelectedId(id);
      setTimeout(() => setShowTree(true), 100);
      // Scroll to tree after animation
      setTimeout(() => {
        treeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [selectedId]);

  const handleClose = useCallback(() => {
    setShowTree(false);
    setTimeout(() => setSelectedId(null), 400);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton label={isKk ? "Артқа" : "Назад"} />

      <div className="mb-8 border-b-2 border-ktz-blue pb-3">
        <h1 className="text-xl sm:text-2xl font-bold text-ktz-blue">
          {isKk
            ? "«ҚТЖ» ҰК» АҚ филиалы — «Магистральдық желі дирекциясы» басшылығы"
            : "Руководство филиала АО «НК «ҚТЖ» — «Дирекция магистральной сети»"}
        </h1>
      </div>

      {/* Директор */}
      {director.map((d) => (
        <div key={d.id} className="mb-6 flex justify-center">
          <LeaderCard leader={d} isKk={isKk} size="lg" />
        </div>
      ))}

      {director.length > 0 && deputies.length > 0 && (
        <ConnectingLine show />
      )}

      {/* 1-й ряд */}
      <div className="mb-4 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
        {row1.map((d) => (
          <LeaderCard
            key={d.id}
            leader={d}
            isKk={isKk}
            size="md"
            onClick={hasChildren(d.id) ? () => handleClick(d.id) : undefined}
            isExpanded={selectedId === d.id}
            hasChildren={hasChildren(d.id)}
            dimmed={!!selectedId && selectedId !== d.id}
          />
        ))}
      </div>

      {/* 2-й ряд */}
      {row2.length > 0 && (
        <div className="mb-6 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
          {row2.map((d) => (
            <LeaderCard
              key={d.id}
              leader={d}
              isKk={isKk}
              size="md"
              onClick={hasChildren(d.id) ? () => handleClick(d.id) : undefined}
              isExpanded={selectedId === d.id}
              hasChildren={hasChildren(d.id)}
              dimmed={!!selectedId && selectedId !== d.id}
            />
          ))}
        </div>
      )}

      {/* Раскрытое дерево */}
      {selectedLeader && hasChildren(selectedLeader.id) && (
        <div
          ref={treeRef}
          className={`mt-4 rounded-2xl border border-ktz-blue/10 bg-gradient-to-b from-blue-50/50 to-white p-6 sm:p-8 transition-all duration-500 ${showTree ? "opacity-100" : "opacity-0"}`}
        >
          {/* Выбранный руководитель */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <LeaderCard leader={selectedLeader} isKk={isKk} size="md" zoomed />
              <button
                onClick={handleClose}
                className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Дерево с анимированными линиями */}
            <FullTree
              parentId={selectedLeader.id}
              leaders={leaders}
              isKk={isKk}
              depth={0}
              show={showTree}
            />
          </div>
        </div>
      )}

      {/* Подсказка */}
      {deputies.some((d) => hasChildren(d.id)) && !selectedId && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <span className="inline-block animate-bounce">👆</span>{" "}
          {isKk
            ? "Басшыны басыңыз — бағыныштыларын көру үшін"
            : "Нажмите на руководителя, чтобы увидеть подчинённых"}
        </p>
      )}

      {leaders.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-muted-foreground">{isKk ? "Деректер жақында қосылады" : "Данные скоро появятся"}</p>
        </div>
      )}
    </div>
  );
}
