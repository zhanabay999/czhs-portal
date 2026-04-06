"use client";

import { useState, KeyboardEvent, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Hash } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  locale: "kk" | "ru";
  suggestions?: string[];
}

export const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(
  function TagsInput({ tags, onChange, locale, suggestions = [] }, ref) {
    const [input, setInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isKk = locale === "kk";

    const addTag = (value: string) => {
      const tag = value.trim().replace(/^#/, "").toLowerCase();
      if (tag && !tags.includes(tag)) {
        onChange([...tags, tag]);
      }
      setInput("");
      setShowDropdown(false);
    };

    const removeTag = (tag: string) => {
      onChange(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "," || e.key === " ") {
        e.preventDefault();
        addTag(input);
      }
      if (e.key === "Backspace" && !input && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      }
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };

    const handleInputChange = (value: string) => {
      setInput(value);
      setShowDropdown(value.trim().length > 0);
    };

    const filteredSuggestions = suggestions.filter(
      (s) =>
        s.toLowerCase().includes(input.toLowerCase().replace(/^#/, "")) &&
        !tags.includes(s.toLowerCase())
    );

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 px-2 py-0.5 text-xs"
            >
              <Hash className="h-3 w-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full hover:bg-black/10"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="relative">
          <Input
            ref={ref}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => input.trim().length > 0 && setShowDropdown(true)}
            onBlur={() => {
              closeTimer.current = setTimeout(() => {
                setShowDropdown(false);
              }, 150);
            }}
            placeholder={
              isKk
                ? "Хэштег жазып Enter басыңыз..."
                : "Введите хэштег и нажмите Enter..."
            }
            className="text-sm"
          />
          {showDropdown && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-md">
              <p className="px-3 pt-2 pb-1 text-[10px] text-muted-foreground">
                {isKk ? "Бұрын қолданылған" : "Ранее использованные"}
              </p>
              <ul className="max-h-40 overflow-y-auto pb-1">
                {filteredSuggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-1.5 px-3 py-1.5 text-sm hover:bg-blue-50 hover:text-blue-700"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        addTag(s);
                      }}
                    >
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {isKk
            ? "Enter, пробел немесе үтір арқылы қосыңыз"
            : "Разделяйте Enter, пробелом или запятой"}
        </p>
      </div>
    );
  }
);
