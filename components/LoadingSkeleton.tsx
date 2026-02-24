export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-pulse"
          style={{ borderLeftWidth: "3px", borderLeftColor: "#27272a" }}
        >
          {/* Source + time row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="h-3 w-20 bg-zinc-700 rounded" />
            </div>
            <div className="h-3 w-10 bg-zinc-800 rounded" />
          </div>

          {/* Title */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-zinc-700 rounded w-full" />
            <div className="h-4 bg-zinc-700 rounded w-4/5" />
          </div>

          {/* Summary */}
          <div className="space-y-1.5 mb-3">
            <div className="h-3 bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-800 rounded w-3/5" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="h-3 w-10 bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
