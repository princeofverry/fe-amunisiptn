"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const INFO_CARDS = [
  { src: "/images/background/info_to1.png", alt: "Info UTBK 1" },
  { src: "/images/background/info_to2.png", alt: "Info UTBK 2" },
  { src: "/images/background/info_to3.png", alt: "Info UTBK 3" },
  { src: "/images/background/info_to4.png", alt: "Info UTBK 4" },
];

export default function InfoCardCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.children[0]?.clientWidth ?? 0;
    const gap = 16;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
  }, []);

  // Handle scroll to update dot indicator
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.children[0]?.clientWidth ?? 0;
      const gap = 16;
      const scrollPosition = container.scrollLeft;
      const index = Math.round(scrollPosition / (cardWidth + gap));
      setActiveIndex(Math.min(index, INFO_CARDS.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isAutoScrollPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % INFO_CARDS.length;
        scrollToIndex(next);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoScrollPaused, scrollToIndex]);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-900">
        Buat amunisian yang mau kejar UTBK
      </h2>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseEnter={() => setIsAutoScrollPaused(true)}
        onMouseLeave={() => setIsAutoScrollPaused(false)}
      >
        {INFO_CARDS.map((card, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[260px] md:w-[280px] snap-start rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 260px, 280px"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2">
        {INFO_CARDS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveIndex(index);
              scrollToIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
