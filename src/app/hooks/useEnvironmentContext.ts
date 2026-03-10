import { useState, useEffect, useCallback } from "react";
import {
  fetchEnvironmentContext,
  type EnvironmentContext,
} from "../services/env-apis";

export function useEnvironmentContext() {
  const [data, setData] = useState<EnvironmentContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ctx = await fetchEnvironmentContext();
      setData(ctx);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
