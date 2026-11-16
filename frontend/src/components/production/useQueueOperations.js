import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

// Reads only. Missing, denied and malformed responses must never mean that an
// order has no operations, material requirements or dispatch constraints.
export default function useQueueOperations(orders) {
  const key = JSON.stringify((orders || []).map((order) => order.id));
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(null);

  useEffect(() => {
    const ids = JSON.parse(key);
    const controller = new AbortController();
    let current = true;
    const load = async () => {
      const operations = {};
      const failures = {};
      for (let i = 0; i < ids.length && current; i += 5) {
        await Promise.all(ids.slice(i, i + 5).map(async (id) => {
          try {
            const response = await fetch(`${API_URL}/api/v1/production-orders/${id}/operations`, {
              credentials: "include", signal: controller.signal,
            });
            if (!response.ok) {
              failures[id] = response.status === 403 ? "Acesso negado" : "Operações indisponíveis";
              return;
            }
            const data = await response.json();
            const list = Array.isArray(data) ? data : data?.operations;
            if (!Array.isArray(list) || list.some((op) => !op || typeof op !== "object" || Array.isArray(op))) {
              throw new Error("Invalid operations response");
            }
            operations[id] = list;
          } catch {
            failures[id] = "Operações indisponíveis";
          }
        }));
      }
      if (current) setState({ key, source: orders, attempt, operations, failures });
    };
    load();
    return () => { current = false; controller.abort(); };
  }, [orders, key, attempt]);

  const matches = state?.key === key && state?.source === orders && state?.attempt === attempt;
  return {
    operations: matches ? state.operations : {},
    failures: matches ? state.failures : {},
    loading: (orders?.length || 0) > 0 && !matches,
    retry: () => setAttempt((value) => value + 1),
  };
}
