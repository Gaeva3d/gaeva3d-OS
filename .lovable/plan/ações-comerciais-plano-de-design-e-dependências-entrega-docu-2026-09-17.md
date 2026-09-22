# Ações comerciais — plano de design e dependências (entrega documental)

Esta rodada é documental: sem código de produto, sem migration, sem banco, sem publicação. Nenhuma prévia visual está sendo solicitada aqui; se for pedida depois, será explicitamente identificada como prévia, sem dados reais e sem persistência.

## 1. O que foi verificado nos arquivos inspecionados

- Rotas atuais: `/`, `/pedidos`, `/pedidos/kanban`, `/pedidos/novo`, `/pedidos/$id`, `/producao`, `/clientes`, `/impressoras`, `/equipe`, `/configuracoes`; navegação em lista fixa em `src/components/gaeva/app-shell.tsx`.
- `src/integrations/supabase/types.ts` declara: approvals, audit_logs, customers, order_assignments, order_files, order_items, orders, printers, production_events, production_jobs, profiles, team_members, view `order_operational_summary`, funções `operate_order`, `order_history`, `generate_order_code`, `prepare_team_access`, `link_team_access`.
- Nos arquivos inspecionados **não há** referência a `crm_opportunities`, a operação/marca comercial, nem a Dry. Isso descreve apenas o repositório: tipos gerados podem estar desatualizados e **não comprovam** o que existe ou não no banco remoto. O estado real do banco precisa ser verificado antes de qualquer decisão de schema.
- O CRM local (`gaeva-flow-comercial`, branch `codex/crm-fundacao`) **não foi inspecionado** nesta sessão. Do que foi informado, sei apenas de `crm_opportunities` com `stage`, `sale_value`, `closed_at`, `closed_by_agent_id` e `order_id` único. Não afirmo que exista conceito de operação/marca lá — isso é uma lacuna a verificar na reconciliação.
- Permissões: store em `src/lib/gaeva/store.tsx` com papéis admin, comercial, producao, designer, visualizacao e ações como `manage_commercial` / `manage_production`. Não há permissão por operação.
- Datas: `operationDate`, `dashboardRange`, `inDateRange` (`src/lib/gaeva/dashboard-helpers.ts`) já operam em America/Sao_Paulo com limites `[início, fim)`. Reutilizar.
- Componentes reutilizáveis: `app-shell`, `stat-panel`, `linear-filters`, `badges`, `order-drawer`; UI `card`, `table`, `tabs`, `chart` (recharts instalado), `breadcrumb`, `progress`, `command`, `popover`, `skeleton`, `tooltip`, `sonner`.

### Lacunas a resolver antes de integrar dados
1. Estado real do banco remoto (existência e forma das tabelas de CRM).
2. Existência e nome do conceito de operação no CRM local.
3. Semântica de `closed_at`.
4. Pedidos GAEVA legados sem oportunidade correspondente.

## 2. Identidade comercial e isolamento (proposta)

- Identidade única da venda: um `sale_id` canônico. Fonte preferencial é a oportunidade do CRM; pedido GAEVA associado é **referência**, não segunda venda. Nenhum agregado percorre `orders` e oportunidades somando ambos.
- **Pedidos legados sem oportunidade**: não presumir que toda venda histórica exista como oportunidade, e não fazer backfill cego. Proposta: inventário contado desses pedidos, classificação em "com correspondência provável" e "sem correspondência", e revisão humana em lote antes de qualquer vinculação. Enquanto não revisados, ficam fora dos agregados, visíveis num contador "pendente de revisão".
- Campos comerciais do contrato: `operation`, `commercial_date` (data local explícita, distinta de `closed_at`), `confirmed` (≠ recebimento), `canceled_at`, `amount_cents` (inteiro), `agent_id` (responsável comercial do fechamento, nunca o responsável de produção), `source`, `external_id`.
- `closed_at` só vira data comercial após verificação de semântica; sem `commercial_date`/`operation` confiáveis, o registro fica marcado para revisão e não soma.
- Identidade da operação Dry, fixa em todo o módulo, dados e rótulos: **Dry Maia — Nova Operação**.
- Vínculo ação↔venda: no modo automático a participação é **derivada da regra de elegibilidade**, não exige tabela persistida. Persistir vínculos só se a arquitetura posterior exigir (ex.: seleção manual ou congelamento de encerramento), decidido na etapa de schema.
- Isolamento: filtro por operação aplicado no servidor em KPIs, séries, listas, exportações e RLS. O módulo não escreve em `orders` e não altera consultas do core.

## 3. Navegação, layout e estados

Grupo "Comercial" na sidebar existente com o item **Ações comerciais** (`/comercial/acoes`, `/comercial/acoes/$id`). Leitura e gestão são permissões distintas.

Breadcrumb: `Comercial / Ações comerciais / <nome da ação>`.

**Tema**: shell, sidebar e tema claro do OS preservados integralmente. O marinho escuro aplica-se **apenas à área do placar** (faixa de KPIs + contexto) no detalhe da ação, como bloco de contraste; gráficos, tabelas e formulários seguem o tema claro.

### Listagem
Título, busca, botão "Nova ação" (só com permissão de gestão). Tabela densa no padrão de Pedidos: Nome · Período · Situação · Operações (chips laranja Dry Maia — Nova Operação / ciano GAEVA, sempre com rótulo textual) · Meta · Realizado com mini barra · Atualizado em · menu "···" (editar, arquivar). Linha clicável. Filtros pelo `linear-filters` existente.

### Detalhe
1. Topo claro: breadcrumb, nome, período por extenso, chip de situação (rascunho / programada / em andamento / encerrada / arquivada), "Editar ação", "Atualizado há X".
2. Placar (bloco marinho escuro, reutilizando a estrutura do `stat-panel`): Realizado com barra e percentual (texto pode passar de 100%, barra limitada) · Meta · Faltante ou Excedente · Ritmo necessário por dia.
3. Faixa contextual dentro do placar, tipografia menor: Dias restantes · Meta diária · Esperado até hoje (tooltip: inclui a meta do dia atual inteiro) · Ticket médio · Quantidade · badge de pendentes de revisão.
4. Gráficos (recharts via `components/ui/chart`), tema claro:
   - Acumulado realizado × meta acumulada; dias futuros ausentes, dias passados sem venda = 0.
   - Vendas por dia, colunas empilhadas por operação, linha opcional de meta diária.
   - Barras horizontais por operação com valor e participação.
   - Ranking por responsável comercial com valor e quantidade.
   - Sem rosca redundante.
5. Tabela de vendas: data comercial · operação · responsável · cliente · valor · confirmação · link à origem; busca, paginação no servidor, subtotais por operação vindos do servidor. A UI nunca soma a página para compor receita.

### Layout responsivo
Desktop ≥1280: placar em faixa única; evolução em 8 colunas com operação/ranking empilhados em 4; tabela em largura total. Tablet: evolução em largura total, operação e ranking lado a lado. Mobile: KPIs em 2 colunas (1 quando estreito), gráficos com scroll no próprio container, tabela em cards.

### Estados
Carregando (skeletons com a forma final) · vazio · erro com "Tentar novamente" · **sem acesso** (nenhum dado, apenas aviso) · **acesso parcial autorizado** (visão explicitamente parcial, sem total global nem comparação global) · rascunho (nada contabilizado) · programada · encerrada · meta superada (estado próprio, sem limiar de 90%).

### Acessibilidade
Cor nunca é o único indicador: rótulo textual, ícone e padrão de traço distintos por série. Contraste verificado também no bloco marinho. Foco visível, navegação por teclado, tooltips acessíveis, `tabular-nums`.

### Formulário
Nome, descrição opcional, início/fim inclusivos, meta em BRL > 0, operações participantes, responsável. Rascunho explícito; "Ativar" é ação separada; fase derivada das datas após ativação; arquivamento independente. Configuração sugerida e editável, em rascunho: "Dry Maia + GAEVA — Meta de 15 dias", R$ 30.000,00, 17/09/2026 a 01/10/2026, operações GAEVA e Dry Maia — Nova Operação. Sem vendas de exemplo.

## 4. Regras de cálculo (fonte única no servidor)

America/Sao_Paulo, intervalo `[início 00:00, dia seguinte ao fim 00:00)`.
Elegível: confirmada, valor positivo, não cancelada, identidade única, operação participante, data comercial no período e não futura.
`duracao = fim − inicio + 1` (1–366) · `realizado = Σ elegíveis` · `quantidade` · `ticket = realizado/quantidade ou 0` · `progresso = realizado/meta` · `faltante = max(meta−realizado,0)` · `excedente = max(realizado−meta,0)` · `metaDiaria = meta/duracao` · `diasTranscorridos = clamp(hoje−inicio+1,0,duracao)` · `esperado = metaDiaria × diasTranscorridos` · `diasRestantes` = duração antes do início, `fim−hoje+1` durante, 0 depois · `ritmo = faltante/diasRestantes`, com "Prazo encerrado" quando vencido com faltante.
Estados: não iniciada · no ritmo/acima · abaixo do ritmo · meta atingida · encerrada.

### Recorte versus visão geral
As métricas carregam explicitamente o seu escopo. Métricas de meta (meta, faltante, excedente, progresso, meta diária, esperado, ritmo) só existem quando o cálculo cobre **todas** as operações da ação sem filtros de recorte. Havendo filtro por operação ou responsável, o resultado é um **subtotal de recorte** (realizado, quantidade, ticket, série diária) acompanhado de "sem meta para este recorte". Nunca dividir subtotal pela meta conjunta.

## 5. Contrato de dados (TypeScript completo)

```ts
export type Operation = "gaeva" | "dry_maia_nova_operacao";

export const OPERATION_LABELS: Record<Operation, string> = {
  gaeva: "GAEVA",
  dry_maia_nova_operacao: "Dry Maia — Nova Operação",
};

export type ActionPhase =
  | "rascunho"
  | "programada"
  | "em_andamento"
  | "encerrada";

export type ActionState =
  | "nao_iniciada"
  | "no_ritmo"
  | "abaixo_do_ritmo"
  | "meta_atingida"
  | "encerrada";

export interface CommercialAction {
  id: string;
  name: string;
  description: string | null;
  start_date: string; // YYYY-MM-DD local
  end_date: string; // YYYY-MM-DD local, inclusivo
  goal_cents: number;
  operations: Operation[];
  owner_id: string;
  phase: ActionPhase;
  archived_at: string | null;
  updated_at: string;
}

// Acesso: negado, parcial autorizado ou global.
export type AccessScope =
  | { kind: "denied" }
  | {
      kind: "partial";
      can_manage: false;
      allowed_operations: Operation[]; // subconjunto não vazio
    }
  | {
      kind: "global";
      can_manage: boolean;
      allowed_operations: Operation[]; // todas as operações da ação
    };

export interface ActionFilters {
  operations: Operation[]; // vazio = sem recorte por operação
  agent_ids: string[]; // vazio = sem recorte por responsável
  search: string;
  page: number;
  page_size: number;
}

export interface BaseMetrics {
  realized_cents: number;
  sales_count: number;
  ticket_cents: number;
  days_total: number;
  days_elapsed: number;
  days_left: number;
  pending_review_count: number;
}

export interface GoalMetrics {
  goal_cents: number;
  progress: number; // pode exceder 1
  missing_cents: number;
  surplus_cents: number;
  daily_goal_cents: number;
  expected_cents: number;
  required_pace_cents: number | null; // null quando prazo encerrado
  deadline_over: boolean;
  state: ActionState;
}

// Visão geral (sem recorte, escopo global) carrega metas.
// Recorte por filtro ou escopo parcial NÃO carrega metas.
export type ActionMetrics =
  | { scope: "overall"; metrics: BaseMetrics & GoalMetrics }
  | { scope: "filtered"; metrics: BaseMetrics; goal_available: false }
  | { scope: "partial_access"; metrics: BaseMetrics; goal_available: false };

// Operações negadas não aparecem como chave nem como zero.
export type OperationAmounts = Partial<Record<Operation, number>>;

export interface DailyPoint {
  date: string; // YYYY-MM-DD local
  by_operation: OperationAmounts; // apenas operações autorizadas e presentes
  realized_cents: number | null; // null = dia futuro (ausente)
  cumulative_cents: number | null; // null = dia futuro
  goal_cumulative_cents: number | null; // null quando não há meta no escopo
}

export interface OperationBreakdownRow {
  operation: Operation;
  value_cents: number;
  // share só existe no escopo global sem recorte; ausente nos demais.
  share?: number;
}

export interface AgentRankRow {
  agent_id: string;
  agent_name: string;
  value_cents: number;
  sales_count: number;
}

export type SaleOrigin =
  | { kind: "order"; id: string; url: string }
  | { kind: "opportunity"; id: string; url: string };

export interface SaleRow {
  sale_id: string;
  commercial_date: string;
  operation: Operation;
  agent_id: string | null;
  agent_name: string | null;
  customer_name: string | null;
  amount_cents: number;
  confirmed: boolean;
  origin: SaleOrigin;
}

export interface SalesPage {
  rows: SaleRow[];
  total: number;
  page: number;
  page_size: number;
  totals_by_operation: OperationBreakdownRow[]; // vindo do servidor
}

export interface ActionDashboard {
  action: CommercialAction;
  scope: AccessScope;
  filters: ActionFilters;
  metrics: ActionMetrics;
  daily: DailyPoint[];
  by_operation: OperationBreakdownRow[];
  ranking: AgentRankRow[] | null; // null quando ranking global não é autorizado
  sales: SalesPage;
}
```

Regras do contrato: com `kind: "denied"` o servidor não devolve `ActionDashboard` nenhum. Em `partial`, o servidor omite meta, participação, esperado, ranking global e metadados sensíveis — não apenas a UI. Nenhum campo é `any`.

## 6. Etapas e dependências

**Bloqueantes antes de qualquer integração**: verificar o banco remoto real; inspecionar o CRM local e confirmar se há conceito de operação; definir a semântica de `closed_at` e a data comercial; decidir a política de pedidos legados sem oportunidade; definir política de permissão por operação (se não comportar visão parcial consistente, restringir a ação inteira).

1. **Documentação/design** (esta entrega): hierarquia, layout, estados, cálculos e contrato acima.
2. **Arquitetura de dados**: proposta de schema, elegibilidade derivada versus vínculo persistido, RLS por operação, auditoria de valor/status/data/operação/meta/período. Aprovação explícita antes de executar.
3. **Implementação de UI** sobre o contrato, com Dry inativa até haver isolamento verificável.
4. **Testes antes de ativar**: GAEVA 1000 + Dry 500 = 1500 com 66,67%/33,33% e zero impacto no core; oportunidade ligada a pedido contando uma vez; cancelamento volta a 1000; edição de valor/data/operação propaga a todos os recortes; pendente/futuro/fora do período não soma; fronteiras locais de data; 1, 15, 30 e 366 dias; meta superada; ação futura, encerrada e sem vendas; usuário sem acesso não recebe dados nem agregados por chamada direta; duas ações não duplicam receita no consolidado; regressão de pedidos, produção, autenticação, RLS e CRM; responsividade e estados dos gráficos.
5. **Adiado**: seleção manual de vendas, duplicação de ações, metas individuais, importador XLSX/CSV e consolidado multiações.

Relato final sempre separará implementação, testes efetivamente executados, dependências e publicação; interface com fixtures nunca será descrita como integração real.
