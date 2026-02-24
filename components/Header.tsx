"use client";

import { ViewMode } from "./ArticleCard";

interface HeaderProps {
  total: number;
  fetchedAt: string | null;
  loading: boolean;
  viewMode: ViewMode;
  onRefresh: () => void;
  onViewModeChange: (mode: ViewMode) => void;
}

function minutesAgo(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 60000
  );
  if (diff < 1) return "just now";
  if (diff === 1) return "1 min ago";
  if (diff < 60) return `${diff} mins ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

export default function Header({
  total,
  fetchedAt,
  loading,
  viewMode,
  onRefresh,
  onViewModeChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-zinc-950/85 border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">

        {/* Brand + stats */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-base font-bold text-white tracking-tight">SEO News</span>
          </div>

          {!loading && total > 0 && (
            <span className="hidden sm:block text-xs text-zinc-500">
              {total} articles
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">

          {/* Last updated */}
          {fetchedAt && !loading && (
            <span className="hidden lg:block text-xs text-zinc-600" title={new Date(fetchedAt).toLocaleTimeString()}>
              {minutesAgo(fetchedAt)}
            </span>
          )}

          {/* View mode toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange("comfortable")}
              title="Card view"
              className={`cursor-pointer p-1.5 rounded-md transition-all ${
                viewMode === "comfortable"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange("compact")}
              title="List view"
              className={`cursor-pointer p-1.5 rounded-md transition-all ${
                viewMode === "compact"
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh feeds (R)"
            className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{loading ? "Loading…" : "Refresh"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
