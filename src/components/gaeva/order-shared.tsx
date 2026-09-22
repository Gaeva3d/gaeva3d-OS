import { useInfiniteQuery } from "@tanstack/react-query";
import { Paperclip, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchOrderHistory } from "@/lib/gaeva/order-operations";
import { describeActivity, formatActivityTime } from "@/lib/gaeva/dashboard-helpers";
import { mapAudit } from "@/lib/gaeva/supabase-mappers";
import { formatBytes } from "@/lib/gaeva/helpers";
import type { OrderFile } from "@/lib/gaeva/types";

export function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">{value}</p>
    </div>
  );
}
export function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string | undefined;
  options: { value: string; label: string }[];
  onChange: (value: string | undefined) => void;
}) {
  return (
    <Select value={value || "all"} onValueChange={(v) => onChange(v === "all" ? undefined : v)}>
      <SelectTrigger className="h-9 w-full min-w-[145px] sm:w-[165px]" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}: todos</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function OrderFiles({
  files,
  onRemove,
}: {
  files: OrderFile[];
  onRemove?: (id: string) => void;
}) {
  if (!files.length)
    return <p className="py-4 text-sm text-muted-foreground">Nenhum arquivo anexado.</p>;
  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li key={file.id} className="rounded-md border border-border p-3">
          {file.url && file.mime_type.startsWith("image/") ? (
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <img
                src={file.url}
                alt={file.name}
                loading="lazy"
                className="mb-2 max-h-56 w-full rounded object-contain bg-secondary/30"
              />
            </a>
          ) : null}
          <div className="flex items-center gap-2 text-sm">
            <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            {file.url ? (
              <a
                className="min-w-0 flex-1 truncate text-primary hover:underline"
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.name}
              </a>
            ) : (
              <span className="min-w-0 flex-1 break-all">{file.name} • link indisponível</span>
            )}
            <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(file.size)}</span>
            {onRemove ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover ${file.name}`}
                onClick={() => onRemove(file.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
export function OrderTimeline({ orderId, code }: { orderId: string; code: string }) {
  const history = useInfiniteQuery({
    queryKey: ["orders", "history", orderId],
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => fetchOrderHistory(orderId, pageParam),
    getNextPageParam: (last) => (last.length === 100 ? last.at(-1)?.id : undefined),
    staleTime: 15_000,
  });
  if (history.isPending)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Carregando histórico…
      </p>
    );
  if (history.isError)
    return (
      <div role="alert" className="text-sm text-danger">
        Não foi possível carregar o histórico.{" "}
        <Button variant="outline" size="sm" onClick={() => void history.refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  const rows = history.data.pages.flat();
  return (
    <div>
      {!rows.length ? (
        <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
      ) : (
        <ol className="space-y-4 border-l border-border pl-4">
          {rows.map((row) => {
            const mapped = mapAudit(row, row.author);
            const activity = describeActivity(mapped, [{ id: orderId, code }]);
            const values = row.new_values as Record<string, unknown> | null;
            const note =
              row.table_name === "production_events" && typeof values?.["notes"] === "string"
                ? values["notes"]
                : null;
            return (
              <li key={row.id} className="relative text-sm">
                <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary" />
                <p className="whitespace-pre-wrap break-words">
                  <span className="font-medium">{row.author}</span> · {note ?? activity.text}
                </p>
                {row.comment ? <p className="text-muted-foreground">{row.comment}</p> : null}
                <time className="text-xs text-muted-foreground" dateTime={row.created_at}>
                  {formatActivityTime(row.created_at)}
                </time>
              </li>
            );
          })}
        </ol>
      )}
      {history.hasNextPage ? (
        <Button
          className="mt-4"
          variant="outline"
          size="sm"
          disabled={history.isFetchingNextPage}
          onClick={() => void history.fetchNextPage()}
        >
          Carregar histórico anterior
        </Button>
      ) : null}
    </div>
  );
}
