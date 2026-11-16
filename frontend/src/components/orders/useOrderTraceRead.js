import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";

export const record = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
export const validId = (value) => Number.isSafeInteger(value) && value > 0;
export function useOrderTraceRead(path, validate) {
  const api = useApi();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!path) return;
    let current = true;
    const controller = new AbortController();
    api.get(path, { signal: controller.signal }).then((data) => {
      if (!validate(data)) throw new Error("Malformed record");
      if (current) setState({ path, attempt, data });
    }).catch((error) => {
      if (current) setState({ path, attempt, error: error?.status === 401 ? "Sessão indisponível." : error?.status === 403 ? "Acesso negado." : error?.status === 404 ? "Registro não encontrado." : "Leitura indisponível." });
    });
    return () => { current = false; controller.abort(); };
  }, [api, path, attempt, validate]);
  return { ...(state?.path === path && state?.attempt === attempt ? state : { loading: Boolean(path) }), retry: () => setAttempt((n) => n + 1) };
}
