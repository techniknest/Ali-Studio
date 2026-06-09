"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getDisplayCategory } from "@/lib/utils";

export function PortfolioGrid({ items }: { items: { _id: string; title: string; category: string; images: string[] }[] }) {
  const [shuffledItems, setShuffledItems] = useState<{ _id: string; title: string; category: string; images: string[] }[]>([]);
  // Store spans for each image index
  const [spans, setSpans] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let arr = [...items];
    
    // Shuffle helper function
    const shuffleArray = <T,>(array: T[]): T[] => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    let attempts = 0;
    let hasViolations = true;
    
    // A minimum distance of 5 ensures duplicate images are never adjacent:
    // - Horizontally (difference of 1)
    // - Vertically stacked in the same column on a 4-column grid (difference of 4)
    // - Diagonally adjacent (difference of 3 or 5)
    const MIN_DISTANCE = 5;

    while (hasViolations && attempts < 200) {
      arr = shuffleArray(items);
      hasViolations = false;
      attempts++;

      for (let i = 0; i < arr.length; i++) {
        for (let d = 1; d <= MIN_DISTANCE; d++) {
          if (i - d >= 0 && arr[i]._id === arr[i - d]._id) {
            hasViolations = true;
            break;
          }
        }
        if (hasViolations) break;
      }
    }

    const finalItems = arr;

    setShuffledItems(finalItems);
  }, [items]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => {
    const target = e.target as HTMLImageElement;
    const { naturalWidth, naturalHeight } = target;
    const ratio = naturalWidth / naturalHeight;
    
    let spanClass = "col-span-1 row-span-1"; // Default square-ish

    if (ratio > 1.5) {
      // Landscape (Wide)
      spanClass = "col-span-1 md:col-span-2 row-span-1";
    } else if (ratio < 0.75) {
      // Portrait (Tall)
      spanClass = "col-span-1 row-span-2";
    }

    setSpans((prev) => ({ ...prev, [id]: spanClass }));
  };

  const getDisplayTitle = (title: string) => {
    return title.toLowerCase().includes("portfolio") ? "Ali Studio" : title;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[250px] grid-flow-dense w-full">
      {(shuffledItems.length > 0 ? shuffledItems : items).map((item, index) => {
        const id = item._id;
        const spanClass = spans[id] || "col-span-1 row-span-1 opacity-0"; // Hidden until loaded
        
        return (
          <motion.article
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: spans[id] ? 1 : 0, y: spans[id] ? 0 : 20 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`relative overflow-hidden rounded-xl bg-neutral-900 group ${spanClass}`}
          >
            {item.images[0] && (
              <>
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  unoptimized={true}
                  priority={index < 8}
                  onLoad={(e) => handleImageLoad(e, id)}
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-6 z-20">
                  <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-medium mb-2">
                    {getDisplayCategory(item.category, item.title, item.images[0])}
                  </span>
                  <h2 className="font-display text-2xl text-white drop-shadow-md">
                    {getDisplayTitle(item.title)}
                  </h2>
                </div>
              </>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}
