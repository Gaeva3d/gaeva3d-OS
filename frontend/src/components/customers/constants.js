// Customer status options and styling (static for Tailwind purge safety)
export const STATUS_OPTIONS = [
  { value: "active", label: "Ativo", color: "green" },
  { value: "inactive", label: "Inativo", color: "gray" },
  { value: "suspended", label: "Suspenso", color: "red" },
];

const STATUS_CLASS = {
  green: "bg-green-500/20 text-green-400",
  gray: "bg-gray-500/20 text-gray-400",
  red: "bg-red-500/20 text-red-400",
};

export function getStatusStyle(status) {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  if (!found) return STATUS_CLASS.gray;
  return STATUS_CLASS[found.color];
}

// Payment terms — single source of truth for options + labels
export const PAYMENT_TERMS_OPTIONS = [
  { value: "cod", label: "Pagamento na entrega" },
  { value: "prepay", label: "Pagamento antecipado" },
  { value: "net15", label: "Prazo de 15 dias" },
  { value: "net30", label: "Prazo de 30 dias" },
  { value: "card_on_file", label: "Cartão cadastrado" },
];

export const PAYMENT_TERMS_LABELS = Object.fromEntries(
  PAYMENT_TERMS_OPTIONS.map((o) => [o.value, o.label])
);

// Format phone number as (XXX) XXX-XXXX
export const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};
