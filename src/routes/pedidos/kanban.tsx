import { createFileRoute } from "@tanstack/react-router";
import { OrdersKanban } from "@/components/gaeva/orders-kanban";

export const Route = createFileRoute("/pedidos/kanban")({
  head: () => ({ meta: [{ title: "Kanban de pedidos · GAEVA OS" }] }),
  component: OrdersKanban,
});
