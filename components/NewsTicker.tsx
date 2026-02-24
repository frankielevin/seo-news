"use client";

import { Article } from "@/lib/rss";

function isToday(dateStr: string): boolean {
  const article = new Date(dateStr);
  const now = new Date();
  return (
    article.getFullYear() === now.getFullYear() &&
    article.getMonth() === now.getMonth() &&
    article.getDate() === now.getDate()
  );
}

interface NewsTickerProps {
  articles: Article[];
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  const todayArticles = articles.filter((a) => isToday(a.publishedAt));

  if (todayArticles.length === 0) return null;

  // Duplicate so the scroll loops seamlessly
  const items = [...todayArticles, ...todayArticles];

  // Scale speed to content: ~6s per article, min 20s
  const duration = Math.max(todayArticles.length * 6, 20);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center h-12 bg-zinc-950 border-t border-zinc-800/80 overflow-hidden select-none">

      {/* Label */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 h-full bg-gradient-to-r from-sky-600 to-indigo-600 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span className="text-xs font-extrabold tracking-widest uppercase text-white whitespace-nowrap">
          Today
        </span>
      </div>

      {/* Thin divider shadow so label feels raised */}
      <div className="flex-shrink-0 w-px h-full bg-zinc-700" />

      {/* Scrolling track */}
      <div
        className="ticker-track flex-1 overflow-hidden relative"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)" }}
      >
        <div
          className="ticker-content flex items-center whitespace-nowrap"
          style={{ animationDuration: `${duration}s` }}
        >
          {items.map((article, i) => (
            <a
              key={`${article.id}-${i}`}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 group"
            >
              {/* Source label */}
              <span
                className="text-xs font-extrabold uppercase tracking-widest flex-shrink-0"
                style={{ color: article.sourceColor }}
              >
                {article.sourceShortName}
              </span>

              {/* Separator dot */}
              <span className="text-zinc-700 text-xs">›</span>

              {/* Title */}
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors duration-150">
                {article.title}
              </span>

              {/* Item divider */}
              <span className="text-zinc-700 ml-3 text-base leading-none">|</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
