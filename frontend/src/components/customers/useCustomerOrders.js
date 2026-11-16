import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

// Bind every response to its customer. Aborting alone is insufficient when a
// response has already started parsing or a transport ignores cancellation.
export default function useCustomerOrders(customerId) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(null);

  useEffect(() => {
    let current = true;
    const controller = new AbortController();
    const load = async () => {
      let reason = "Não foi possível carregar os pedidos. Tente novamente.";
      try {
        const response = await fetch(
          `${API_URL}/api/v1/admin/customers/${customerId}/orders?limit=10`,
          { credentials: "include", signal: controller.signal },
        );
        if (!response.ok) {
          const messages = {
            401: "Sua sessão expirou. Entre novamente para consultar os pedidos.",
            403: "Você não tem permissão para consultar estes pedidos.",
            404: "Os pedidos deste cliente não estão disponíveis.",
          };
          reason = messages[response.status] || reason;
          throw new Error(reason);
        }
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("A resposta dos pedidos está indisponível. Tente novamente.");
        if (current) setState({ customerId, attempt, orders: data, error: null });
      } catch (error) {
        if (current) setState({ customerId, attempt, orders: [], error: error instanceof TypeError
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : reason });
      }
    };
    load();
    return () => { current = false; controller.abort(); };
  }, [customerId, attempt]);

  const matches = state?.customerId === customerId && state?.attempt === attempt;
  return {
    orders: matches ? state.orders : [],
    error: matches ? state.error : null,
    loading: !matches,
    retry: () => setAttempt((value) => value + 1),
  };
}
