import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

export const portalReadMessage = (status) => ({
  401: "Sua sessão expirou. Entre novamente para consultar o portal.",
  403: "Você não tem permissão para consultar estes dados do portal.",
  404: "Esta consulta do portal não está disponível no sistema.",
}[status] || "Não foi possível consultar o portal. Tente novamente.");

// This validates only the existing client's access indicator, not a PRO schema
// or invitation/permission policy. No access can be inferred from a failed GET.
export default function useCustomerPortal(customerId, enabled) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(null);
  useEffect(() => {
    if (!enabled) { setState(null); return; }
    let current = true;
    const controller = new AbortController();
    const load = async () => {
      let error = portalReadMessage();
      try {
        const response = await fetch(`${API_URL}/api/v1/admin/customers/${customerId}/portal-details`, { credentials: "include", signal: controller.signal });
        if (!response.ok) { error = portalReadMessage(response.status); throw new Error(); }
        const data = await response.json();
        if (!data || Array.isArray(data) || typeof data.has_portal_access !== "boolean") throw new Error();
        if (current) setState({ customerId, attempt, data, error: null });
      } catch {
        if (current) setState({ customerId, attempt, data: null, error });
      }
    };
    load();
    return () => { current = false; controller.abort(); };
  }, [customerId, enabled, attempt]);
  const matches = enabled && state?.customerId === customerId && state?.attempt === attempt;
  return { data: matches ? state.data : null, error: matches ? state.error : null,
    loading: enabled && !matches, retry: () => setAttempt((value) => value + 1) };
}
