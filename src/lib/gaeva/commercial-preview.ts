export type CommercialOperation = "gaeva" | "dry_maia_nova_operacao";

export const COMMERCIAL_OPERATION_LABELS: Record<CommercialOperation, string> = {
  gaeva: "GAEVA",
  dry_maia_nova_operacao: "Dry Maia — Nova Operação",
};

export type CommercialActionPhase = "rascunho" | "programada" | "em_andamento" | "encerrada";

export interface CommercialActionPreview {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  goalCents: number;
  operations: CommercialOperation[];
  ownerName: string;
  phase: CommercialActionPhase;
  updatedAt: string;
}

export interface CommercialDailyPoint {
  date: string;
  label: string;
  gaeva: number | null;
  dry: number | null;
  realized: number | null;
  cumulative: number | null;
  goalCumulative: number;
}

export interface CommercialActionExample {
  simulatedDate: string;
  daily: CommercialDailyPoint[];
  ranking: CommercialAgentRank[];
  sales: CommercialSalePreview[];
}

export interface CommercialAgentRank {
  name: string;
  value: number;
  count: number;
  gaevaValue: number;
  gaevaCount: number;
  dryValue: number;
  dryCount: number;
}

export interface CommercialSalePreview {
  id: string;
  date: string;
  operation: CommercialOperation;
  agentName: string;
  customerName: string;
  amountCents: number;
  confirmed: boolean;
  originLabel: string;
}

export const COMMERCIAL_PHASE_LABELS: Record<CommercialActionPhase, string> = {
  rascunho: "Rascunho",
  programada: "Programada",
  em_andamento: "Em andamento",
  encerrada: "Encerrada",
};

export const COMMERCIAL_ACTIONS_FIXTURE: CommercialActionPreview[] = [
  {
    id: "acao-15-dias",
    name: "Sprint comercial — 15 dias",
    description: "Exemplo visual para validar o acompanhamento conjunto das operações.",
    startDate: "2026-09-17",
    endDate: "2026-10-01",
    goalCents: 3_000_000,
    operations: ["gaeva", "dry_maia_nova_operacao"],
    ownerName: "Renân Campos",
    phase: "em_andamento",
    updatedAt: "2026-09-17T10:42:00-03:00",
  },
  {
    id: "black-friday-preview",
    name: "Black Friday — planejamento",
    description: "Rascunho demonstrativo de uma ação futura.",
    startDate: "2026-11-16",
    endDate: "2026-11-30",
    goalCents: 5_000_000,
    operations: ["gaeva"],
    ownerName: "Rayane Falconeres",
    phase: "rascunho",
    updatedAt: "2026-09-16T15:18:00-03:00",
  },
  {
    id: "fechamento-agosto-preview",
    name: "Fechamento de agosto",
    description: "Ação encerrada usada apenas para revisar estados visuais.",
    startDate: "2026-08-17",
    endDate: "2026-08-31",
    goalCents: 2_400_000,
    operations: ["gaeva", "dry_maia_nova_operacao"],
    ownerName: "Renân Campos",
    phase: "encerrada",
    updatedAt: "2026-09-01T09:10:00-03:00",
  },
];

const RAW_DAILY = [
  ["2026-09-17", "17 set", 145_000, 82_000],
  ["2026-09-18", "18 set", 198_000, 104_000],
  ["2026-09-19", "19 set", 122_000, 138_000],
  ["2026-09-20", "20 set", 264_000, 96_000],
  ["2026-09-21", "21 set", 184_000, 166_000],
  ["2026-09-22", "22 set", 236_000, 112_000],
  ["2026-09-23", "23 set", 102_000, 148_000],
  ["2026-09-24", "24 set", 218_000, 94_000],
] as const;

function datesInPeriod(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${startDate}T12:00:00Z`);
  const end = new Date(`${endDate}T12:00:00Z`);
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return dates;
}

function shortDateLabel(date: string): string {
  return new Date(`${date}T12:00:00Z`)
    .toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })
    .replace(" de ", " ")
    .replace(".", "");
}

const RAW_DAILY_BY_DATE = new Map<string, { gaeva: number; dry: number }>(
  RAW_DAILY.map(([date, , gaeva, dry]) => [date, { gaeva, dry }] as const),
);

export const COMMERCIAL_DAILY_FIXTURE: CommercialDailyPoint[] = datesInPeriod(
  "2026-09-17",
  "2026-10-01",
).map((date, index, dates) => {
  const amounts = RAW_DAILY_BY_DATE.get(date);
  const previousRealized = dates.slice(0, index + 1).reduce((sum, itemDate) => {
    const item = RAW_DAILY_BY_DATE.get(itemDate);
    return sum + (item ? item.gaeva + item.dry : 0);
  }, 0);
  return {
    date,
    label: shortDateLabel(date),
    gaeva: amounts?.gaeva ?? null,
    dry: amounts?.dry ?? null,
    realized: amounts ? amounts.gaeva + amounts.dry : null,
    cumulative: amounts ? previousRealized : null,
    goalCumulative: 200_000 * (index + 1),
  };
});

export const COMMERCIAL_RANKING_FIXTURE: CommercialAgentRank[] = [
  {
    name: "Marina Lopes",
    value: 815_000,
    count: 7,
    gaevaValue: 600_000,
    gaevaCount: 4,
    dryValue: 215_000,
    dryCount: 3,
  },
  {
    name: "Caio Mendes",
    value: 684_000,
    count: 5,
    gaevaValue: 369_000,
    gaevaCount: 3,
    dryValue: 315_000,
    dryCount: 2,
  },
  {
    name: "Paula Reis",
    value: 532_000,
    count: 5,
    gaevaValue: 260_000,
    gaevaCount: 3,
    dryValue: 272_000,
    dryCount: 2,
  },
  {
    name: "Lucas Andrade",
    value: 378_000,
    count: 3,
    gaevaValue: 240_000,
    gaevaCount: 2,
    dryValue: 138_000,
    dryCount: 1,
  },
];

export const COMMERCIAL_SALES_FIXTURE: CommercialSalePreview[] = [
  {
    id: "demo-sale-01",
    date: "2026-09-24",
    operation: "gaeva",
    agentName: "Marina Lopes",
    customerName: "Cliente demonstrativo 01",
    amountCents: 218_000,
    confirmed: true,
    originLabel: "Pedido de exemplo",
  },
  {
    id: "demo-sale-02",
    date: "2026-09-24",
    operation: "dry_maia_nova_operacao",
    agentName: "Caio Mendes",
    customerName: "Cliente demonstrativo 02",
    amountCents: 94_000,
    confirmed: true,
    originLabel: "Oportunidade de exemplo",
  },
  {
    id: "demo-sale-03",
    date: "2026-09-23",
    operation: "dry_maia_nova_operacao",
    agentName: "Paula Reis",
    customerName: "Cliente demonstrativo 03",
    amountCents: 148_000,
    confirmed: true,
    originLabel: "Oportunidade de exemplo",
  },
  {
    id: "demo-sale-04",
    date: "2026-09-23",
    operation: "gaeva",
    agentName: "Lucas Andrade",
    customerName: "Cliente demonstrativo 04",
    amountCents: 102_000,
    confirmed: true,
    originLabel: "Pedido de exemplo",
  },
  {
    id: "demo-sale-05",
    date: "2026-09-22",
    operation: "gaeva",
    agentName: "Marina Lopes",
    customerName: "Cliente demonstrativo 05",
    amountCents: 236_000,
    confirmed: true,
    originLabel: "Pedido de exemplo",
  },
];

export const COMMERCIAL_ACTION_EXAMPLES: Partial<Record<string, CommercialActionExample>> = {
  "acao-15-dias": {
    simulatedDate: "2026-09-24",
    daily: COMMERCIAL_DAILY_FIXTURE,
    ranking: COMMERCIAL_RANKING_FIXTURE,
    sales: COMMERCIAL_SALES_FIXTURE,
  },
};

export function commercialActionRealized(actionId: string): number {
  const daily = COMMERCIAL_ACTION_EXAMPLES[actionId]?.daily ?? [];
  return [...daily].reverse().find((point) => point.cumulative !== null)?.cumulative ?? 0;
}

export function formatPreviewDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatPreviewPeriod(start: string, end: string): string {
  return `${formatPreviewDate(start)} a ${formatPreviewDate(end)}`;
}
