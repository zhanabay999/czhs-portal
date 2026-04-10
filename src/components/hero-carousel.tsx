"use client";

import { useState, useEffect, useCallback } from "react";

const fallbackSlides = [
  "/hero/slide-1.jpg",
  "/hero/slide-2.jpg",
  "/hero/slide-3.jpg",
];

export function HeroCarousel({ slides }: { slides?: string[] }) {
  const images = slides && slides.length > 0 ? slides : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [current, isTransitioning]
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      goTo((current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goTo, images.length]);

  return (
    <div className="relative h-[420px] overflow-hidden md:h-[500px] lg:h-[560px]">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
