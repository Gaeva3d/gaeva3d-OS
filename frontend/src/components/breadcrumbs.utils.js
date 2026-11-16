/**
 * Paths that appear in breadcrumb trails but don't map to real pages.
 * These are rendered as plain text instead of links to avoid 404s.
 */
export const NON_NAVIGABLE_PATHS = new Set([
  "/admin/inventory",
  "/admin/materials",
]);

/**
 * Route path → human-readable label map.
 * Intermediate paths (e.g. /admin/inventory) that aren't real pages
 * are included so the breadcrumb trail remains complete.
 */
export const ROUTE_LABELS = {
  "/admin": "Painel inicial",
  "/admin/dashboard": "Indicadores",
  "/admin/intake-studio": "Estúdio de entrada",
  "/admin/intake-batch": "Entrada em lote",
  "/admin/integrations": "Integrações",
  "/admin/license": "Licença",
  // Sales
  "/admin/orders": "Pedidos",
  "/admin/orders/import": "Importar pedidos",
  "/admin/quotes": "Propostas",
  "/admin/payments": "Pagamentos",
  "/admin/invoices": "Faturas",
  "/admin/customers": "Clientes",
  "/admin/messages": "Mensagens",
  // Inventory
  "/admin/items": "Itens e modelos",
  "/admin/bom": "Lista de materiais",
  "/admin/materials": "Materiais",
  "/admin/materials/import": "Importar materiais",
  "/admin/inventory": "Estoque",
  "/admin/inventory/transactions": "Movimentações",
  "/admin/inventory/cycle-count": "Inventário cíclico",
  "/admin/locations": "Locais",
  "/admin/spools": "Carretéis",
  // Operations
  "/admin/production": "Produção",
  "/admin/manufacturing": "Centros e roteiros",
  "/admin/printers": "Impressoras",
  "/admin/bambuddy": "Bambuddy",
  "/admin/purchasing": "Compras",
  "/admin/shipping": "Expedição",
  // Quality
  "/admin/quality": "Qualidade",
  "/admin/quality/plans": "Planos de qualidade",
  "/admin/quality/traceability": "Rastreabilidade",
  // B2B Portal
  "/admin/access-requests": "Solicitações de acesso",
  "/admin/catalogs": "Catálogos",
  "/admin/price-levels": "Tabelas de preço",
  // Admin
  "/admin/accounting": "Contabilidade",
  "/admin/users": "Equipe",
  "/admin/scrap-reasons": "Motivos de perda",
  "/admin/analytics": "Indicadores avançados",
  "/admin/settings": "Configurações",
  "/admin/security": "Auditoria de segurança",
  "/admin/command-center": "Painel inicial",
};

/**
 * Checks if a path segment looks like a dynamic ID (numeric or UUID-like).
 */
export function isDynamicSegment(segment) {
  return /^\d+$/.test(segment) || /^[0-9a-f-]{36}$/i.test(segment);
}

/**
 * Build breadcrumb items from the current URL pathname.
 * Returns an array of { label, path, isLast }.
 */
export function buildBreadcrumbs(pathname) {
  // Strip trailing slash
  const cleanPath = pathname.replace(/\/$/, "") || "/admin";

  // Don't show breadcrumbs on dashboard
  if (cleanPath === "/admin") return [];

  const segments = cleanPath.split("/").filter(Boolean); // ['admin', 'orders', '123']
  const crumbs = [];

  // Always start with Dashboard
  crumbs.push({ label: ROUTE_LABELS["/admin"], path: "/admin" });

  // Build cumulative paths from segments (skip 'admin' since it's the root)
  for (let i = 1; i < segments.length; i++) {
    const cumulativePath = "/" + segments.slice(0, i + 1).join("/");
    const segment = segments[i];

    if (isDynamicSegment(segment)) {
      crumbs.push({ label: `#${segment}`, path: cumulativePath });
    } else {
      const label =
        ROUTE_LABELS[cumulativePath] ||
        segment
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      crumbs.push({ label, path: cumulativePath });
    }
  }

  // Mark the last item
  if (crumbs.length > 0) {
    crumbs[crumbs.length - 1].isLast = true;
  }

  return crumbs;
}
