import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: number;
  previous?: number | undefined;
  icon: LucideIcon;
  /** Valor do parâmetro `foco` aplicado na tela de pedidos. */
  focus: string;
  /** Menor é melhor (atrasados, urgentes): inverte a cor da variação. */
  inverse?: boolean | undefined;
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Anima apenas na carga inicial e quando o valor muda. */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (start === value || prefersReducedMotion()) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const began = performance.now();
    const duration = 420;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span data-numeric>{display}</span>;
}

function Delta({
  current,
  previous,
  inverse,
}: {
  current: number;
  previous?: number | undefined;
  inverse?: boolean | undefined;
}) {
  if (previous === undefined) return null;
  const diff = current - previous;
  const pct = previous === 0 ? (current === 0 ? 0 : 100) : Math.round((diff / previous) * 100);
  const good = inverse ? diff < 0 : diff > 0;
  const Icon = diff === 0 ? Minus : diff > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <p className="mt-2 flex items-center gap-1.5 text-xs">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 font-medium",
          diff === 0
            ? "border-border text-muted-foreground"
            : good
              ? "border-success/30 bg-success/10 text-success"
              : "border-danger/30 bg-danger/10 text-danger",
        )}
      >
        <Icon className="size-3" aria-hidden />
        <span data-numeric>
          {diff > 0 ? "+" : ""}
          {pct}%
        </span>
      </span>
      <span className="truncate font-normal text-muted-foreground">vs. período anterior</span>
    </p>
  );
}

export function StatPanel({
  items,
  search,
}: {
  items: StatItem[];
  search: Record<string, string | undefined>;
}) {
  return (
    <section
      aria-label="Indicadores operacionais"
      className="surface-card grid grid-cols-1 overflow-hidden sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
    >
      {items.map(({ label, value, previous, icon: Icon, focus, inverse }) => (
        <Link
          key={label}
          to="/pedidos"
          search={{ ...search, foco: focus }}
          className={cn(
            "transition-ui group border-border px-4 py-4 outline-none",
            "border-b last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0",
            "sm:odd:border-r xl:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(3n+1)]:border-r xl:[&:nth-child(3n+2)]:border-r",
            "xl:[&:nth-last-child(-n+3)]:border-b-0",
            "2xl:border-b-0 2xl:border-r 2xl:last:border-r-0",
            "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md border border-border bg-muted/60 text-muted-foreground">
              <Icon className="size-3.5" aria-hidden />
            </span>
            <span className="truncate text-sm font-medium text-foreground">{label}</span>
          </div>
          <p className="mt-3 text-[28px] font-semibold leading-none tabular-nums">
            <AnimatedNumber value={value} />
          </p>
          <Delta current={value} previous={previous} inverse={inverse} />
        </Link>
      ))}
    </section>
  );
}
