import { productionControlLabels } from "../productionControlLabels";
import { formatProductionTime, productionCopy } from "../productionControlsCopy";

/**
 * Conflict-display subcomponents for OperationSchedulerModal.
 *
 * Extracted verbatim from OperationSchedulerModal.jsx (DEBT-1 D2-B) — markup,
 * classes, and props are unchanged. These render the resource-conflict,
 * predecessor-conflict, and successor-conflict panels plus the shared
 * next-available slot-suggestion pill.
 */


/**
 * Shared slot suggestion pill — used by both conflict alert banners.
 */
export function SlotSuggestion({ label, nextAvailableStart, nextAvailableEnd, onUseSlot }) {
  if (!nextAvailableStart) return null;
  return (
    <div className="mt-3 p-2 bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded">
      <p className="text-sm text-[var(--ink-2)]">
        {label}: {formatProductionTime(nextAvailableStart)}
        {nextAvailableEnd ? ` – ${formatProductionTime(nextAvailableEnd)}` : ""}
      </p>
      <button
        type="button"
        onClick={() => onUseSlot(nextAvailableStart, nextAvailableEnd)}
        className="mt-1 text-sm text-[var(--ink-2)] hover:text-[var(--ink)] underline"
      >
        {productionControlLabels.usarEsteHorario}
      </button>
    </div>
  );
}

/**
 * Conflict alert banner with next-available slot suggestion (resource conflicts)
 */
export function ConflictAlert({
  conflicts,
  nextAvailableStart,
  nextAvailableEnd,
  onUseSlot,
}) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="bg-[var(--status-red-tint)] border border-[var(--status-red)]/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[var(--status-red)] flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-[var(--status-red)] font-medium">{productionControlLabels.conflitoDeRecurso}</h4>
          <p className="text-sm text-[var(--status-red)]/70 mt-1">
            {productionControlLabels.esteHorarioCoincideCom}
          </p>
          <ul className="mt-2 space-y-1">
            {conflicts.map((conflict, idx) => (
              <li key={idx} className="text-sm text-[var(--status-red)]">
                - {conflict.production_order_code || conflict.po_code} -{" "}
                {conflict.operation_code || productionCopy.operation}
                {conflict.scheduled_start && (
                  <span className="text-[var(--status-red)]/50">
                    {" "}
                    ({formatProductionTime(conflict.scheduled_start)} –{" "}
                    {formatProductionTime(conflict.scheduled_end)})
                  </span>
                )}
              </li>
            ))}
          </ul>
          <SlotSuggestion
            label={productionControlLabels.primeiroHorarioDisponivel}
            nextAvailableStart={nextAvailableStart}
            nextAvailableEnd={nextAvailableEnd}
            onUseSlot={onUseSlot}
          />
          {!nextAvailableStart && (
            <p className="text-xs text-[var(--status-red)]/50 mt-2">
              {productionControlLabels.ajusteOHorarioDeInicioOuSelecioneOutroRecurso}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Predecessor sequence violation banner with earliest-valid-start suggestion.
 */
export function PredecessorAlert({
  message,
  earliestValidStart,
  nextAvailableStart,
  nextAvailableEnd,
  onUseSlot,
}) {
  if (!message) return null;

  return (
    <div className="bg-[var(--status-amber-tint)] border border-[var(--status-amber)]/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[var(--status-amber)] flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-[var(--status-amber)] font-medium">{productionControlLabels.restricaoDeSequencia}</h4>
          <p className="text-sm text-[var(--status-amber)]/70 mt-1">{message}</p>
          {earliestValidStart && (
            <p className="text-sm text-[var(--status-amber)] mt-1">
              {productionControlLabels.aOperacaoAnteriorTerminaAs}{" "}
              <span className="font-medium">{formatProductionTime(earliestValidStart)}</span>
            </p>
          )}
          {nextAvailableStart ? (
            <SlotSuggestion
              label={productionControlLabels.primeiroInicioPermitido}
              nextAvailableStart={nextAvailableStart}
              nextAvailableEnd={nextAvailableEnd}
              onUseSlot={onUseSlot}
            />
          ) : (
            <p className="text-xs text-[var(--status-amber)]/50 mt-2">
              {productionControlLabels.agendeAOperacaoAnteriorETenteNovamente}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Successor conflict banner — shown when moving an op would violate a
 * downstream op's existing schedule.
 */
export function SuccessorConflictAlert({ successorConflicts }) {
  if (!successorConflicts || successorConflicts.length === 0) return null;
  return (
    <div className="bg-[var(--status-amber-tint)] border border-[var(--status-amber)]/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-[var(--status-amber)] flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <h4 className="text-[var(--status-amber)] font-medium">{productionControlLabels.conflitoComOperacoesSeguintes}</h4>
          <p className="text-sm text-[var(--status-amber)]/70 mt-1">
            {productionControlLabels.moverEstaOperacaoCausariaConflitoComOsAgendamentosDe}
          </p>
          <ul className="mt-2 space-y-1">
            {successorConflicts.map((sc, idx) => (
              <li key={idx} className="text-sm text-[var(--status-amber)]">
                {productionControlLabels.seq}{sc.sequence} ({sc.operation_code || productionCopy.operation})
                {sc.scheduled_start && (
                  <span className="text-[var(--status-amber)]/50">
                    {" "}{productionControlLabels.agendadaPara}{formatProductionTime(sc.scheduled_start)}
                  </span>
                )}
                {sc.earliest_valid_start && (
                  <span className="text-[var(--status-amber)]">
                    {" "}{productionControlLabels.primeiroInicioPermitido2}{formatProductionTime(sc.earliest_valid_start)}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--status-amber)]/50 mt-2">
            {productionControlLabels.reagendeAsOperacoesSeguintesOuEscolhaUmTerminoMais}
          </p>
        </div>
      </div>
    </div>
  );
}
