"use client";

import { useState, useEffect, useCallback } from "react";

export function useSupabaseData<T>(
  fetcher: () => Promise<T>,
  fallback: T
): { data: T; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => setData(result))
      .catch((err) => {
        console.error("Supabase fetch error:", err);
        setError(err?.message || "Failed to fetch data");
      })
      .finally(() => setLoading(false));
  }, [fetcher]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
