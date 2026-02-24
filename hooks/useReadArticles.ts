"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "seo-news:read";
const MAX_STORED = 2000;

export function useReadArticles() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReadIds(new Set(JSON.parse(raw) as string[]));
    } catch {}
  }, []);

  const persist = (ids: Set<string>) => {
    try {
      // Trim to prevent unbounded growth
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...ids].slice(-MAX_STORED))
      );
    } catch {}
  };

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      persist(next);
      return next;
    });
  }, []);

  const markAllRead = useCallback((ids: string[]) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      persist(next);
      return next;
    });
  }, []);

  return { readIds, markRead, markAllRead };
}
