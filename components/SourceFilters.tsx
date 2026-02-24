"use client";

import { SOURCES } from "@/lib/feeds";

export type TimeFilter = "all" | "today" | "week";

interface SourceFiltersProps {
  activeSource: string | null;
  onSelectSource: (id: string | null) => void;
  timeFilter: TimeFilter;
  onSelectTime: (t: TimeFilter) => void;
  sourceStatuses: Record<string, number>;
}

const TIME_TABS: { key: TimeFilter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "all", label: "All Time" },
];

export default function SourceFilters({
  activeSource,
  onSelectSource,
  timeFilter,
  onSelectTime,
  sourceStatuses,
}: SourceFiltersProps) {
  const activeSources = SOURCES.filter((s) => (sourceStatuses[s.id] ?? 0) > 0);

  return (
    <div className="sticky top-[57px] z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-0 py-2.5 overflow-x-auto scrollbar-hide">

          {/* Time filter tabs */}
          <div className="flex items-center gap-1 flex-shrink-0 mr-3">
            {TIME_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onSelectTime(tab.key)}
                className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  timeFilter === tab.key
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-zinc-700/60 flex-shrink-0 mr-3" />

          {/* All sources pill */}
          <button
            onClick={() => onSelectSource(null)}
            className={`cursor-pointer flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap mr-1.5 ${
              activeSource === null
                ? "bg-white text-zinc-900"
                : "text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800"
            }`}
          >
            All
          </button>

          {/* Source pills */}
          {activeSources.map((source) => {
            const isActive = activeSource === source.id;
            return (
              <button
                key={source.id}
                onClick={() => onSelectSource(isActive ? null : source.id)}
                className={`cursor-pointer flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap mr-1.5 ${
                  isActive
                    ? "text-white shadow-sm"
                    : "text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: source.color,
                        boxShadow: `0 0 12px ${source.color}45`,
                      }
                    : {}
                }
              >
                {!isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: source.color }}
                  />
                )}
                {source.shortName}
                <span className={`text-[10px] ${isActive ? "opacity-70" : "text-zinc-600"}`}>
                  {sourceStatuses[source.id] ?? 0}
                </span>
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
}
