import { useState, type FormEvent } from "react";
import { AlertTriangle, Save } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  COMMERCIAL_OPERATION_LABELS,
  type CommercialActionPreview,
  type CommercialOperation,
} from "@/lib/gaeva/commercial-preview";

const OPERATIONS = Object.keys(COMMERCIAL_OPERATION_LABELS) as CommercialOperation[];

export function CommercialActionForm({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (action: CommercialActionPreview) => void;
}) {
  const [operations, setOperations] = useState<CommercialOperation[]>(["gaeva"]);
  const [validationError, setValidationError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const startDate = String(form.get("startDate"));
    const endDate = String(form.get("endDate"));
    const goal = Number(form.get("goal"));
    const startTime = new Date(`${startDate}T12:00:00Z`).getTime();
    const endTime = new Date(`${endDate}T12:00:00Z`).getTime();
    const durationDays = Math.floor((endTime - startTime) / 86_400_000) + 1;

    if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || durationDays < 1) {
      setValidationError("A data final deve ser igual ou posterior à data inicial.");
      return;
    }
    if (durationDays > 366) {
      setValidationError("A ação deve ter duração máxima de 366 dias.");
      return;
    }
    if (!Number.isFinite(goal) || goal <= 0) {
      setValidationError("Informe uma meta positiva e válida.");
      return;
    }

    setValidationError(null);
    const action: CommercialActionPreview = {
      id: `preview-${Date.now()}`,
      name: String(form.get("name") || "Nova ação demonstrativa"),
      description: String(form.get("description") || "") || null,
      startDate,
      endDate,
      goalCents: Math.round(goal * 100),
      operations,
      ownerName: String(form.get("owner") || "Equipe comercial"),
      phase: "rascunho",
      updatedAt: new Date().toISOString(),
    };
    onCreate(action);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova ação comercial</DialogTitle>
          <DialogDescription>
            Monte um rascunho para validar o fluxo. Nenhum dado será gravado.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-warning/30 bg-warning/5">
          <AlertTriangle className="size-4 text-warning" />
          <AlertTitle>Somente nesta prévia</AlertTitle>
          <AlertDescription>
            O rascunho permanece apenas nesta tela e desaparece ao recarregar a página.
          </AlertDescription>
        </Alert>

        {validationError ? (
          <Alert variant="destructive" role="alert">
            <AlertTriangle className="size-4" />
            <AlertTitle>Revise os dados da ação</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        ) : null}

        <form
          id="commercial-action-preview-form"
          onSubmit={submit}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="action-name">Nome da ação</Label>
            <Input id="action-name" name="name" required placeholder="Ex.: Meta de outubro" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="action-description">Descrição</Label>
            <Textarea id="action-description" name="description" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action-start">Início</Label>
            <Input
              id="action-start"
              name="startDate"
              type="date"
              required
              defaultValue="2026-09-17"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action-end">Fim</Label>
            <Input id="action-end" name="endDate" type="date" required defaultValue="2026-10-01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action-goal">Meta em reais</Label>
            <Input
              id="action-goal"
              name="goal"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue="30000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="action-owner">Responsável</Label>
            <Input id="action-owner" name="owner" required defaultValue="Equipe comercial" />
          </div>
          <fieldset className="space-y-2 sm:col-span-2">
            <legend className="text-sm font-medium">Operações participantes</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {OPERATIONS.map((operation) => (
                <label
                  key={operation}
                  className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <Checkbox
                    checked={operations.includes(operation)}
                    onCheckedChange={(checked) => {
                      setOperations((current) =>
                        checked
                          ? [...new Set([...current, operation])]
                          : current.filter((item) => item !== operation),
                      );
                    }}
                  />
                  {COMMERCIAL_OPERATION_LABELS[operation]}
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="hidden" />
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="commercial-action-preview-form"
            disabled={operations.length === 0}
          >
            <Save className="size-4" /> Criar rascunho na prévia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
