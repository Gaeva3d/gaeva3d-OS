import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/comercial/acoes")({
  component: CommercialActionsLayout,
});

function CommercialActionsLayout() {
  return <Outlet />;
}
