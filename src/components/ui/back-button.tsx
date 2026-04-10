"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export function BackButton({ label }: { label: string }) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <Button
      variant="ghost"
      className="mb-6"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(`/${locale}`);
        }
      }}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
