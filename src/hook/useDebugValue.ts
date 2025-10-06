import { useDebugValue, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export function useForceDelete(endpoint: string, id: number) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useDebugValue(loading ? "⏳ Deleting..." : "✅ Idle");

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/${endpoint}/forceDelete`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Items: [id] }),
        });
        setResult(res);
      } catch (e) {
        console.error("useForceDelete error:", e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [endpoint, id]);

  return { result, loading };
}
