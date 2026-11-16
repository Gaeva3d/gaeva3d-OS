/**
 * MaterialRequirementsSection - Material requirements table with shortage indicators.
 *
 * Extracted from OrderDetail.jsx (ARCHITECT-002)
 */

import { useFormatCurrency } from "../../hooks/useFormatCurrency";
import { orderStatusLabel } from "./orderCopy";
import { useId } from "react";

const knownQuantity = (value) => (typeof value === "number" || typeof value === "string")
  && String(value).trim() !== "" && Number.isFinite(Number(value));
const formatQuantity = (value) => knownQuantity(value)
  ? Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : "Não informado";
const knownCostOperand = (value) => knownQuantity(value)
  && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(String(value).trim());
// Optional summary counters are checked only when supplied. Missing counters
// are not synthesized; contradictory or malformed counters cannot confirm stock.
const summaryCountMatches = (value, expected) => value === undefined
  || (knownQuantity(value) && Number.isInteger(Number(value)) && Number(value) === expected);

export default function MaterialRequirementsSection({
  materialRequirements,
  materialAvailability,
  expandedSections,
  onToggle,
  exploding,
  order,
  onCreateWorkOrder,
  onCreatePurchaseOrder,
}) {
  const formatCurrency = useFormatCurrency();
  const sectionId = useId();
  const totalMaterialCost = materialRequirements.every((req) =>
    knownCostOperand(req.gross_quantity) && knownCostOperand(req.unit_cost)) ? materialRequirements.reduce(
    (sum, req) => sum + req.gross_quantity * (req.unit_cost || 0),
    0
  ) : null;
  const hasShortages = materialRequirements.some((req) => req.net_shortage > 0);
  // LEGACY-1: the backend flags terminal/short-closed orders as historical —
  // requirements are still shown for reference, but stock is not re-checked,
  // so live shortage alerts would be phantom noise.
  const isHistorical = Boolean(materialAvailability?.historical);
  const showShortageAlerts = hasShortages && !isHistorical;
  const availabilityConfirmed = materialAvailability?.has_shortages === false
    && summaryCountMatches(materialAvailability.materials_short, 0)
    && summaryCountMatches(materialAvailability.total_materials, materialRequirements.length)
    && summaryCountMatches(materialAvailability.materials_available, materialRequirements.length)
    && !hasShortages && materialRequirements.every((req) =>
      knownQuantity(req.gross_quantity) && knownQuantity(req.available_quantity)
      && knownQuantity(req.net_shortage) && Number(req.net_shortage) === 0);

  return (
    <div className="bg-[var(--paper)] border border-[var(--rule-hair)] rounded-xl p-6 shadow-[var(--shadow-pop)]">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          id={`${sectionId}-heading`}
          aria-expanded={Boolean(expandedSections.materialRequirements)}
          aria-controls={sectionId}
          onClick={() => onToggle("materialRequirements")}
          className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)] hover:text-[var(--ink-2)]"
        >
          <svg
            className={`w-5 h-5 transition-transform ${expandedSections.materialRequirements ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
                    Necessidades de materiais
          {showShortageAlerts && (
            <span className="px-2 py-0.5 bg-[var(--status-red-tint)] text-[var(--status-red)] text-xs rounded-full">
              {materialRequirements.filter((r) => r.net_shortage > 0).length} em falta
            </span>
          )}
          {isHistorical && (
            <span className="px-2 py-0.5 bg-[var(--paper-sunk)] text-[var(--ink-3)] text-xs rounded-full">
              Somente para consulta
            </span>
          )}
        </button>
        {exploding && (
          <span role="status" aria-busy="true" className="text-[var(--ink-3)] text-sm">Calculando…</span>
        )}
      </div>
      {expandedSections.materialRequirements && (
        <div role="region" aria-labelledby={`${sectionId}-heading`} id={sectionId}>
          {exploding ? (
            <p className="py-6 text-[var(--ink-3)]">Aguarde a consulta dos materiais.</p>
          ) : materialRequirements.length === 0 ? (
            <div className="text-center py-8 text-[var(--ink-4)]">
              {order.product_id || (order.lines && order.lines.length > 0)
                ? materialAvailability ? "Nenhuma necessidade de material retornada nesta consulta." : "Necessidades de materiais não confirmadas. Consulte novamente os dados do pedido."
                : "Nenhum produto associado a este pedido"}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto"><table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--rule-hair)]">
                    <th className="text-left p-2 text-[var(--ink-3)]">Componente</th>
                    <th className="text-left p-2 text-[var(--ink-3)]">Operação</th>
                    <th className="text-right p-2 text-[var(--ink-3)]">Necessário</th>
                    <th className="text-right p-2 text-[var(--ink-3)]">Disponível</th>
                    <th className="text-right p-2 text-[var(--ink-3)]">Falta</th>
                    <th className="text-center p-2 text-[var(--ink-3)]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {materialRequirements.map((req, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-[var(--rule-hair)] ${
                        req.net_shortage > 0 && !isHistorical ? "bg-[var(--status-red-tint)]" : ""
                      }`}
                    >
                      <td className="p-2">
                        <div className="text-[var(--ink)]">{req.product_sku} - {req.product_name}</div>
                        {req.material_source === "routing" && (
                          <span className="text-xs text-[var(--ink-3)]">via roteiro</span>
                        )}
                        {req.has_incoming_supply && (
                          <span className="text-xs text-[var(--status-amber)] ml-2" title={req.incoming_supply_details?.expected_date ? `Previsão: ${req.incoming_supply_details.expected_date}` : ""}>
                            Pedido de compra pendente
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-left">
                        {req.operation_code ? (
                          <span className="px-2 py-0.5 bg-[var(--paper-sunk)] text-[var(--ink-2)] text-xs rounded-full">
                            {req.operation_code}
                          </span>
                        ) : (
                          <span className="text-[var(--ink-4)] text-xs">-</span>
                        )}
                      </td>
                      <td className="p-2 text-right text-[var(--ink)]">
                        {formatQuantity(req.gross_quantity)}
                      </td>
                      <td className="p-2 text-right text-[var(--ink-2)]">
                        {formatQuantity(req.available_quantity)}
                      </td>
                      <td className="p-2 text-right">
                        <span
                          className={
                            !knownQuantity(req.net_shortage) ? "text-[var(--ink-3)]" : req.net_shortage > 0
                              ? isHistorical
                                ? "text-[var(--ink-3)]"
                                : "text-[var(--status-red)] font-semibold"
                              : "text-[var(--status-green)]"
                          }
                        >
                          {formatQuantity(req.net_shortage)}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {req.net_shortage > 0 &&
                          !isHistorical &&
                          (req.has_bom ? (
                            <button
                              onClick={() => onCreateWorkOrder(req)}
                              className="text-[var(--ink)] hover:text-[var(--orange)] text-sm"
                            >
                              Criar ordem de produção
                            </button>
                          ) : (
                            <button
                              onClick={() => onCreatePurchaseOrder(req)}
                              className="text-[var(--ink)] hover:text-[var(--orange)] text-sm"
                            >
                              Criar pedido de compra
                            </button>
                          ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[var(--paper-sunk)] font-semibold">
                    <td colSpan="4" className="p-2 text-right text-[var(--ink)]">
                      {isHistorical ? (
                        <span className="text-[var(--ink-3)]">Somente para consulta</span>
                      ) : materialAvailability?.has_shortages ? (
                        <span className="text-[var(--status-red)]">
                          {knownQuantity(materialAvailability.materials_short) && knownQuantity(materialAvailability.total_materials)
                            ? `${materialAvailability.materials_short} de ${materialAvailability.total_materials} materiais em falta`
                            : "Há materiais em falta"}
                        </span>
                      ) : availabilityConfirmed ? (
                        <span className="text-[var(--status-green)]">Todos os materiais estão disponíveis</span>
                      ) : (
                        <span className="text-[var(--ink-3)]">Disponibilidade não confirmada</span>
                      )}
                    </td>
                    <td className="p-2 text-right text-[var(--ink)]">
                      Estimativa: {totalMaterialCost !== null && Number.isFinite(totalMaterialCost) ? formatCurrency(totalMaterialCost) : "Não informado"}
                    </td>
                    <td className="p-2"></td>
                  </tr>
                </tfoot>
              </table></div>

              {showShortageAlerts && (
                <div className="mt-4 p-3 bg-[var(--status-red-tint)] border border-[var(--status-red)]/30 rounded-lg">
                  <p className="text-[var(--status-red)] text-sm">
                    Há materiais em falta. Crie{" "}
                    <span className="text-[var(--ink)]">ordens de produção</span> para
                    subconjuntos ou{" "}
                    <span className="text-[var(--ink)]">pedidos de compra</span> para
                    matérias-primas.
                  </p>
                </div>
              )}
              {isHistorical && (
                <div className="mt-4 p-3 bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg">
                  <p className="text-[var(--ink-3)] text-sm">
                    Status do pedido: {orderStatusLabel(order?.status)} —
                    os materiais estão disponíveis para consulta histórica.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
