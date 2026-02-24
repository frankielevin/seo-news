"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Article } from "@/lib/rss";
import Header from "@/components/Header";
import SourceFilters, { TimeFilter } from "@/components/SourceFilters";
import ArticleCard, { ViewMode } from "@/components/ArticleCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NewsTicker from "@/components/NewsTicker";

interface FeedResponse {
  articles: Article[];
  sourceStatuses: Record<string, number>;
  fetchedAt: string;
  total: number;
}

function applyTimeFilter(articles: Article[], tf: TimeFilter): Article[] {
  if (tf === "all") return articles;
  const ms = tf === "today" ? 86400000 : 604800000;
  return articles.filter(
    (a) => Date.now() - new Date(a.publishedAt).getTime() <= ms
  );
}

export default function Home() {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & view
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("comfortable");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feeds");
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json: FeedResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load feeds");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  // ── Debounce search ──────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchInput("");
        searchRef.current?.blur();
      }
      if ((e.key === "r" || e.key === "R") && !typing && !loading) {
        fetchFeeds();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [loading, fetchFeeds]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!data) return [];
    let articles = data.articles;
    articles = applyTimeFilter(articles, timeFilter);
    if (activeSource) {
      articles = articles.filter((a) => a.sourceId === activeSource);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.sourceName.toLowerCase().includes(q)
      );
    }
    return articles;
  }, [data, timeFilter, activeSource, search]);

  const sourceStatuses = data?.sourceStatuses ?? {};
  const activeSourceCount = Object.values(sourceStatuses).filter(
    (n) => n > 0
  ).length;

  const hasActiveFilters =
    activeSource !== null || timeFilter !== "all" || search.trim() !== "";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-12">
      <Header
        total={data?.total ?? 0}
        fetchedAt={data?.fetchedAt ?? null}
        loading={loading}
        viewMode={viewMode}
        onRefresh={fetchFeeds}
        onViewModeChange={setViewMode}
      />

      <NewsTicker articles={data?.articles ?? []} />

      <SourceFilters
        activeSource={activeSource}
        onSelectSource={setActiveSource}
        timeFilter={timeFilter}
        onSelectTime={setTimeFilter}
        sourceStatuses={sourceStatuses}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

        {/* Search + results bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search articles…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all"
            />
            {searchInput ? (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-zinc-700 font-mono pointer-events-none">/</span>
            )}
          </div>


          {/* Clear filters */}
          {hasActiveFilters && !loading && (
            <button
              onClick={() => {
                setActiveSource(null);
                setTimeFilter("all");
                setSearchInput("");
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all whitespace-nowrap"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-zinc-300 font-medium mb-1">Failed to load feeds</p>
              <p className="text-sm text-zinc-500">{error}</p>
            </div>
            <button
              onClick={fetchFeeds}
              className="text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-zinc-400 text-sm">
              {search.trim()
                ? `No results for "${search}"`
                : timeFilter === "today"
                ? "No articles published today yet"
                : timeFilter === "week"
                ? "No articles this week"
                : "No articles found"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => { setActiveSource(null); setTimeFilter("all"); setSearchInput(""); }}
                className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "comfortable" ? (
          <div
            key={data?.fetchedAt}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                viewMode="comfortable"
                index={i}
              />
            ))}
          </div>
        ) : (
          <div key={data?.fetchedAt} className="flex flex-col gap-1">
            {filtered.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                viewMode="compact"
                index={i}
              />
            ))}
          </div>
        )}

        {/* Footer hint */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-zinc-700 mt-10 pb-6">
            Press <kbd className="bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono text-[11px]">/</kbd> to search
            &nbsp;·&nbsp;
            <kbd className="bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono text-[11px]">R</kbd> to refresh
            &nbsp;·&nbsp;
            <kbd className="bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded font-mono text-[11px]">Esc</kbd> to clear search
          </p>
        )}
      </main>
    </div>
  );
}
