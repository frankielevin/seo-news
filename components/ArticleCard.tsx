"use client";

import { useState } from "react";
import { Article } from "@/lib/rss";

export type ViewMode = "comfortable" | "compact";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function isToday(dateStr: string): boolean {
  const article = new Date(dateStr);
  const now = new Date();
  return (
    article.getFullYear() === now.getFullYear() &&
    article.getMonth() === now.getMonth() &&
    article.getDate() === now.getDate()
  );
}

interface ArticleCardProps {
  article: Article;
  viewMode: ViewMode;
  index: number;
}

export default function ArticleCard({ article, viewMode, index }: ArticleCardProps) {
  const [copied, setCopied] = useState(false);
  const fresh = isToday(article.publishedAt);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard
      .writeText(article.link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  // ── Compact (list) mode ──────────────────────────────────────────────────
  if (viewMode === "compact") {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="card-animate group flex items-center gap-3 px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-150"
        style={{
          animationDelay: `${Math.min(index * 18, 350)}ms`,
          borderLeftColor: article.sourceColor,
          borderLeftWidth: "3px",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: article.sourceColor }}
        />
        <span
          className="text-[11px] font-bold uppercase tracking-wider flex-shrink-0 w-[52px] truncate"
          style={{ color: article.sourceColor }}
        >
          {article.sourceShortName}
        </span>

        {fresh && (
          <span className="flex-shrink-0 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full">
            NEW
          </span>
        )}

        <span className="flex-1 text-sm text-zinc-200 group-hover:text-white truncate transition-colors">
          {article.title}
        </span>

        <span className={`flex-shrink-0 text-xs tabular-nums ${fresh ? "text-zinc-400" : "text-zinc-600"}`}>
          {timeAgo(article.publishedAt)}
        </span>

        <button
          onClick={handleCopy}
          title="Copy link"
          className="cursor-pointer flex-shrink-0 p-1 rounded text-zinc-700 hover:text-zinc-300 hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all"
        >
          {copied ? (
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        <svg className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  // ── Comfortable (card) mode ──────────────────────────────────────────────
  return (
    <div
      className="card-animate group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/50"
      style={{
        animationDelay: `${Math.min(index * 25, 400)}ms`,
        borderLeftColor: article.sourceColor,
        borderLeftWidth: "3px",
      }}
    >
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col flex-1 p-6"
      >
        {/* Source row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: article.sourceColor }}
            />
            <span
              className="text-xs font-bold tracking-widest uppercase truncate"
              style={{ color: article.sourceColor }}
            >
              {article.sourceName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {fresh && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded-full tracking-wide">
                NEW
              </span>
            )}
            <span className={`text-xs tabular-nums ${fresh ? "text-zinc-400" : "text-zinc-600"}`}>
              {timeAgo(article.publishedAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-zinc-100 leading-snug mb-3 line-clamp-2 group-hover:text-white transition-colors">
          {article.title}
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 flex-1">
            {article.summary}
          </p>
        )}
      </a>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 pb-5 pt-3 border-t border-zinc-800/60 gap-2">
        <span className="text-xs text-zinc-500 truncate">
          {article.author ?? ""}
        </span>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleCopy}
            title="Copy link"
            className={`cursor-pointer flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-all ${
              copied
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied</span>
              </>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/read flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-200 px-2 py-1 rounded-md hover:bg-zinc-800 transition-all"
          >
            Read
            <svg className="w-3 h-3 group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
