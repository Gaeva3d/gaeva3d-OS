import { AnimatePresence, motion } from "motion/react";
import { Filter, Search, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** Anima a altura do conteúdo (padrão da referência de filtros). */
function AnimateChangeInHeight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const observed = entries[0]?.contentRect.height;
      if (observed !== undefined) setHeight(observed);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.16, ease: "easeInOut" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}

export interface FilterFieldOption {
  value: string;
  label: string;
}

export interface FilterField {
  id: string;
  label: string;
  icon: LucideIcon;
  options: FilterFieldOption[];
}

interface LinearFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  queryPlaceholder?: string;
  fields: FilterField[];
  /** Valor aplicado por campo (id do campo -> valor). */
  values: Record<string, string | undefined>;
  onChange: (fieldId: string, value: string | undefined) => void;
  onClear: () => void;
  /** Filtros vindos de outra tela (ex.: foco do painel), exibidos como chip removível. */
  extraChips?: { key: string; label: string; clear: () => void }[];
  children?: ReactNode;
}

export function LinearFilters({
  query,
  onQueryChange,
  queryPlaceholder = "Buscar",
  fields,
  values,
  onChange,
  onClear,
  extraChips = [],
  children,
}: LinearFiltersProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FilterField | null>(null);
  const [commandInput, setCommandInput] = useState("");

  const applied = fields.filter((field) => values[field.id]);
  const activeCount = applied.length + extraChips.length + (query ? 1 : 0);

  const reset = () => {
    setSelected(null);
    setCommandInput("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={queryPlaceholder}
            className="pl-8"
            aria-label={queryPlaceholder}
          />
        </div>

        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setTimeout(reset, 160);
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="size-4" />
              {activeCount === 0 ? "Filtrar" : `Filtros (${activeCount})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[240px] p-0">
            <AnimateChangeInHeight>
              <Command>
                <CommandInput
                  value={commandInput}
                  onValueChange={setCommandInput}
                  placeholder={selected ? selected.label : "Filtrar..."}
                  className="h-9"
                />
                <CommandList className="max-h-[260px]">
                  <CommandEmpty>Nada encontrado.</CommandEmpty>
                  {selected ? (
                    <CommandGroup>
                      {selected.options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          className="group flex items-center gap-2"
                          onSelect={() => {
                            onChange(selected.id, option.value);
                            setOpen(false);
                            setTimeout(reset, 160);
                          }}
                        >
                          <span className="truncate">{option.label}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandGroup>
                      {fields.map((field) => (
                        <CommandItem
                          key={field.id}
                          value={field.label}
                          className="flex items-center gap-2"
                          onSelect={() => {
                            setSelected(field);
                            setCommandInput("");
                          }}
                        >
                          <field.icon className="size-3.5 text-muted-foreground" />
                          {field.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </AnimateChangeInHeight>
          </PopoverContent>
        </Popover>

        {children}
      </div>

      <AnimatePresence initial={false}>
        {activeCount > 0 ? (
          <motion.div
            key="chips"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="flex flex-wrap items-center gap-2"
          >
            <AnimatePresence initial={false}>
              {query ? (
                <motion.div
                  key="chip-busca"
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="flex h-7 items-center rounded-md border border-border bg-background text-xs shadow-xs"
                >
                  <span className="flex items-center gap-1.5 px-2 text-muted-foreground">
                    <Search className="size-3.5" /> Busca
                  </span>
                  <span className="border-x border-border px-1.5 text-muted-foreground">é</span>
                  <span className="max-w-[160px] truncate px-2 font-medium">{query}</span>
                  <button
                    type="button"
                    aria-label="Remover busca"
                    onClick={() => onQueryChange("")}
                    className="transition-ui rounded-r-md px-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-3" />
                  </button>
                </motion.div>
              ) : null}

              {applied.map((field) => {
                const value = values[field.id];
                const label =
                  field.options.find((option) => option.value === value)?.label ?? value ?? "";
                return (
                  <motion.div
                    key={field.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="flex h-7 items-center rounded-md border border-border bg-background text-xs shadow-xs"
                  >
                    <span className="flex items-center gap-1.5 px-2 text-muted-foreground">
                      <field.icon className="size-3.5" /> {field.label}
                    </span>
                    <span className="border-x border-border px-1.5 text-muted-foreground">é</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="transition-ui max-w-[180px] truncate px-2 font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {label}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[220px] p-0">
                        <Command>
                          <CommandInput placeholder={field.label} className="h-9" />
                          <CommandList className="max-h-[240px]">
                            <CommandEmpty>Nada encontrado.</CommandEmpty>
                            <CommandGroup>
                              {field.options.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.label}
                                  onSelect={() => onChange(field.id, option.value)}
                                >
                                  <span className="truncate">{option.label}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <button
                      type="button"
                      aria-label={`Remover filtro ${field.label}`}
                      onClick={() => onChange(field.id, undefined)}
                      className="transition-ui rounded-r-md px-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <X className="size-3" />
                    </button>
                  </motion.div>
                );
              })}

              {extraChips.map((chip) => (
                <motion.div
                  key={chip.key}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  className="flex h-7 items-center rounded-md border border-border bg-background text-xs shadow-xs"
                >
                  <span className="max-w-[200px] truncate px-2 font-medium">{chip.label}</span>
                  <button
                    type="button"
                    aria-label={`Remover filtro ${chip.label}`}
                    onClick={chip.clear}
                    className="transition-ui rounded-r-md px-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <Button variant="ghost" size="sm" onClick={onClear}>
              Limpar filtros
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
