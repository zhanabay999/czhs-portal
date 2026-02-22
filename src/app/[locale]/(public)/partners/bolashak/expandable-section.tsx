"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function ExpandableSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-[#003DA5] transition-colors hover:bg-gray-50"
      >
        {title}
        {open ? (
          <Minus className="h-5 w-5 shrink-0 text-[#003DA5]" />
        ) : (
          <Plus className="h-5 w-5 shrink-0 text-[#003DA5]" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-200 px-5 pb-5 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
